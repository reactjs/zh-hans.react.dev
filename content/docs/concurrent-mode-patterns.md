---
id: concurrent-mode-patterns
title: Concurrent UI 模式 (试验阶段)
permalink: docs/concurrent-mode-patterns.html
prev: concurrent-mode-suspense.html
next: concurrent-mode-adoption.html
---

>注意：
>
>本文所述的内容是**稳定版本中 [尚无法使用的](/docs/concurrent-mode-adoption.html) 试验阶段特性**。 请不要再产线应用中使用试验阶段的 React 版本. 这些特性在正式加入 React 之前仍可能会有巨大的变化而官方不会对此做任何通知.
>
>本文面向的是新功能的早期使用者和对此好奇的人。如果你是 React 新手，那并不需要担心这些特性 -- 你现在还不需要学习这些.

通常，当我们更新 state 的时候，我们会希望这些变化立刻反映到屏幕上。因为我们希望我们的应用能够响应用户的输入，所以这是合理的。但是，也有的时候我们会希望**延迟一个更新在屏幕上的响应**。

举个例子，假如我们从一个页面切换到另一个页面，但是在下一个页面的代码和数据还没有加载好的时候，看到一个空白的，显示着加载中提示的页面，这会让人很难受。这种情况下我们可能更希望在前一个页面多停留一会儿。在 React 中实现这个功能在之前是很难做到的。Concurrent 模式提供了一系列的新工具使之成为可能。

- [Transition](#transitions)
  - [用 Transition 包裹 setState](#wrapping-setstate-in-a-transition)
  - [添加一个等待提示器](#adding-a-pending-indicator)
  - [回顾更改](#reviewing-the-changes)
  - [Where Does the Update Happen?](#where-does-the-update-happen)
  - [Transitions Are Everywhere](#transitions-are-everywhere)
  - [Baking Transitions Into the Design System](#baking-transitions-into-the-design-system)
- [The Three Steps](#the-three-steps)
  - [Default: Receded → Skeleton → Complete](#default-receded-skeleton-complete)
  - [Preferred: Pending → Skeleton → Complete](#preferred-pending-skeleton-complete)
  - [Wrap Lazy Features in `<Suspense>`](#wrap-lazy-features-in-suspense)
  - [Suspense Reveal “Train”](#suspense-reveal-train)
  - [Delaying a Pending Indicator](#delaying-a-pending-indicator)
  - [Recap](#recap)
- [Other Patterns](#other-patterns)
  - [Splitting High and Low Priority State](#splitting-high-and-low-priority-state)
  - [Deferring a Value](#deferring-a-value)
  - [SuspenseList](#suspenselist)
- [Next Steps](#next-steps)

## Transition {#transitions}

我们先来回顾一下前一篇关于 [Suspense 用于数据获取](/docs/concurrent-mode-suspense.html) 文章中的 [这个示例](https://codesandbox.io/s/infallible-feather-xjtbu)。

当我们点击 "Next" 按钮来切换激活的页面，现存的页面立刻消失了，然后我们看到整个页面只有一个加载提示。可以说这是一个“不受欢迎”的加载状态。**如果我们可以“跳过”这个过程，并且等到内容加载后再过渡到新的页面，效果会更好**

React 提供了一个新的内置的 `useTransition()` Hook 可以实现这个设计。

我们通过3个步骤来使用它。

首先，我们我们要确保我们正在使用 Concurrent 模式。我们会在稍后讨论如何 [采用 Concurrent 模式](/docs/concurrent-mode-adoption.html)，但是就现在而言，我们要让这个特性工作只要知道需要使用 `ReactDOM.createRoot()` 而非 `ReactDOM.render()` 就足够了：

```js
const rootElement = document.getElementById("root");
// 进入 Concurrent 模式
ReactDOM.createRoot(rootElement).render(<App />);
```

接下来，我们需要增加一个从 React 引入 `useTransition` Hook 的 import：

```js
import React, { useState, useTransition, Suspense } from "react";
```

最后，我们在 `App` 组件中使用它：

```js{3-5}
function App() {
  const [resource, setResource] = useState(initialResource);
  const [startTransition, isPending] = useTransition({
    timeoutMs: 3000
  });
  // ...
```

**就这段代码而言，它还什么都做不了。**我们需要使用这个 Hook 的返回值来配置我们的界面切换。从 `useTransition` 返回的有两个值：

* `startTransition` 是一个函数。我们用它来告诉 React 我们希望的延迟的是*哪个* state 的更新。
* `isPending` 是一个布尔值。它是 React 用来告诉我们这个转换是否正在进行的变量。

接下来我们就会用到它们。

注意我们有给 `useTransition` 传入了一个配置对象。它的 `timeoutMs` 属性指定了**我们希望这个转换在多久之内完成**。通过传入了配置 `{timeoutMs: 3000}`，就等同于是告诉 React “如果下一个页面需要3秒钟以上才能加载好，我们就显示那个加载中提示 -- 但是在那之前，我们先显示前一个界面”。

### 用 Transition 包裹 setState {#wrapping-setstate-in-a-transition}

我们的 "Next" 按钮的点击事件处理器能够引起触发切换页面的 state 更新：

```js{4}
<button
  onClick={() => {
    const nextUserId = getNextId(resource.userId);
    setResource(fetchProfileData(nextUserId));
  }}
>
```

我们把这个 state 更新包裹在 `startTransition` 中。这就是我们通知 React 如果它会产生不受欢迎的加载中界面 **我们希望 React 延迟这个 state 的更新**：

```js{3,6}
<button
  onClick={() => {
    startTransition(() => {
      const nextUserId = getNextId(resource.userId);
      setResource(fetchProfileData(nextUserId));
    });
  }}
>
```

**[在 CodeSandbox 中运行](https://codesandbox.io/s/musing-driscoll-6nkie)**

试试点击 "Next" 几下。 注意它的体验已经很不一样了。**当点击时，我们没有直接切换到一个空白的页面，而是在前一个页面停留了一段时间。**当数据加载好的时候 React 会帮我们切换到新的界面。

如果我们把 API 接口的响应时间调整到5秒钟，[我们就可以确认](https://codesandbox.io/s/relaxed-greider-suewh) React “放弃”停留并在3秒后转换到了新的页面。这是因为我们给 `useTransition()` 传入的配置 `{timeoutMs: 3000}`。假如，我们传入的是 `{timeoutMs: 60000}` 那么它会等上整整一分钟。

### 添加一个等待提示器 {#adding-a-pending-indicator}

在 [我们前一个例子](https://codesandbox.io/s/musing-driscoll-6nkie) 中还是有地方体验不友好。是的，最好不要显示一个“糟糕的”加载中状态。**但是如果没有这个过程提示的话体验会更糟糕！**当我们点击 "Next"按钮，什么都没有发生，就好像整个应用坏掉一样。

我们的 `useTransition()` 调用反悔了两个值：`startTransition` 和 `isPending`。

```js
  const [startTransition, isPending] = useTransition({ timeoutMs: 3000 });
```

我们已经使用了 `startTransition` 来包裹 state 更新。现在我们要使用 `isPending` 了。React 提供了这个布尔值来告诉我们当前**我们是否正在等待界面切换完成**。我们会用它来指示是不是有什么事情正在发生：

```js{4,14}
return (
  <>
    <button
      disabled={isPending}
      onClick={() => {
        startTransition(() => {
          const nextUserId = getNextId(resource.userId);
          setResource(fetchProfileData(nextUserId));
        });
      }}
    >
      Next
    </button>
    {isPending ? " Loading..." : null}
    <ProfilePage resource={resource} />
  </>
);
```

**[在 CodeSandbox 中运行](https://codesandbox.io/s/jovial-lalande-26yep)**

现在，这感觉好多了！当我们点击 Next 按钮的时候，它变得不可用，因为点击它很多次并没有意义。而且新增的“Loading...”提示让用户知道程序并没有卡住。

### 回顾更改 {#reviewing-the-changes}

我们来再看一下我们基于 [原始例子](https://codesandbox.io/s/infallible-feather-xjtbu) 做出的所有更改：
```js{3-5,9,11,14,19}
function App() {
  const [resource, setResource] = useState(initialResource);
  const [startTransition, isPending] = useTransition({
    timeoutMs: 3000
  });
  return (
    <>
      <button
        disabled={isPending}
        onClick={() => {
          startTransition(() => {
            const nextUserId = getNextId(resource.userId);
            setResource(fetchProfileData(nextUserId));
          });
        }}
      >
        Next
      </button>
      {isPending ? " Loading..." : null}
      <ProfilePage resource={resource} />
    </>
  );
}
```

**[在 CodeSandbox 中运行](https://codesandbox.io/s/jovial-lalande-26yep)**

我们只用了7行代码来实现这个切换:

* 我们引入了 `useTransition` Hook 并在更新 state 的组件中使用了它。
* 我们传入了 `{timeoutMs: 3000}` 使得前一个页面在屏幕上最多保持3秒钟。
* 我们把 state 更新包裹在 `startTransition` 中，以通知 React 可以延迟这个更新。
* 我们使用 `isPending` 来告诉用户界面切换的进展并禁用按钮。

最后的结果是，点击“Next”按钮不会立刻切换界面到“不受欢迎的”加载中状态，而是停留在前一个界面并同步加载进度。

### Where Does the Update Happen? {#where-does-the-update-happen}

这并不是很难实现。但是，如果你已经开始思考这是如何工作的，这可能会有点让人费解。既然我们更新了 state，为什么我们不能立刻看到结果呢？下一个 `<ProfilePage>` 又是在*哪里*渲染的呢？

很明显，两个“版本”的 `<ProfilePage>` 同时存在了。我们知道旧的存在是因为它在界面上，而且它还显示了一个进度提示。我们也知道新的存在于*某个地方*，因为它就是我们正在等待的那个界面！

**但是同一个组件的两个版本的是如何同时存在的呢？**

这原因就在于 Concurrent 模式本身。我们 [之前提到](/docs/concurrent-mode-intro.html#intentional-loading-sequences) 它有点像在“branch”上运行的的一个 state 更新。或者我们可以想象成，当我们把 state 更新包裹在 `startTransition` 的时候会在*“另一个宇宙中”*开始渲染，就像科幻电影一样。我们并不能直接看到那个宇宙 -- 但是我们能够从那个宇宙探知一些事情正在发生的事情（`isPending`）。当更新完成的时候，我们的“多个宇宙”合并成一个，我们在屏幕上看到最终的结果！

在 [示例](https://codesandbox.io/s/jovial-lalande-26yep) 中多练习一下，然后试着想象它正在发生。

当然，两个版本的树*同时*渲染只是个假象，正如所有程序同时在你电脑上运行的想法也同样是假象。操作系统会在不同的应用之间快速的切换。类似的，React 可以在不同版本的树上进行切换，一个是你屏幕上看到的那个版本，另一个是它“准备”接下来给你显示的版本。

一个 `useTransition` 这样的 API 可以让你专注于期望的用户体验，而不需要思考这些机制是如何实现的。仍然，想象 `startTransition` 包裹的更新是“在一个分支上”或者“在另一个世界”发生的，是个很有帮助的比喻。

### 很多场景可以使用 transition {#transitions-are-everywhere}

正如我们从 [Suspense 走读](/docs/concurrent-mode-suspense.html) 所学，所有所需数据没有准备好的组件都可以“suspend”一段时间。我们可以从策略上用 `<Suspense>` 把树的不同部分圈起来处理，但这并不总是足够的。

我们回到 [第一个 Suspense 示例](https://codesandbox.io/s/frosty-hermann-bztrp) 那时还是只有一个界面的。现在我们增加一个“Refresh”按钮，用来检查服务端的数据更新。

我们的第一次尝试大概看起来是这样的：

```js{6-8,13-15}
const initialResource = fetchUserAndPosts();

function ProfilePage() {
  const [resource, setResource] = useState(initialResource);

  function handleRefreshClick() {
    setResource(fetchUserAndPosts());
  }

  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails resource={resource} />
      <button onClick={handleRefreshClick}>
        Refresh
      </button>
      <Suspense fallback={<h1>Loading posts...</h1>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
    </Suspense>
  );
}
```

**[在 CodeSandbox 中运行](https://codesandbox.io/s/boring-shadow-100tf)**

在这个例子中，我们会在加载*和*每次点击“Refresh”按钮的时候开始数据获取。我们把 `fetchUserAndPosts()` 的结果放到 state 中，这样下级的组件可以从我们刚刚发起的请求中读取新的数据。

我们可以看到在 [这个例子](https://codesandbox.io/s/boring-shadow-100tf) 中点击“Refresh”是可以工作的。 `<ProfileDetails>` 和 `<ProfileTimeline>` 组件接收代表新数据的 `resource` prop，它会因为我们尚未得到服务端响应而“suspend”，所以我们看到了降级方案界面。当服务端响应加载完成，我们看到更新后的文章（我们的伪造接口每3秒增加一些文章）。

然而，这种体验让人非常不爽。我们正在浏览页面，但是在我们交互的时候内容被一个加载状态换掉了。这让人困惑。**正如前面那样，要避免显示一个不受欢迎的加载中状态，我们把 state 更新放到 transition 中：**

```js{2-5,9-11,21}
function ProfilePage() {
  const [startTransition, isPending] = useTransition({
    // Wait 10 seconds before fallback
    timeoutMs: 10000
  });
  const [resource, setResource] = useState(initialResource);

  function handleRefreshClick() {
    startTransition(() => {
      setResource(fetchProfileData());
    });
  }

  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails resource={resource} />
      <button
        onClick={handleRefreshClick}
        disabled={isPending}
      >
        {isPending ? "Refreshing..." : "Refresh"}
      </button>
      <Suspense fallback={<h1>Loading posts...</h1>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
    </Suspense>
  );
}
```

**[在 CodeSandbox 中运行](https://codesandbox.io/s/sleepy-field-mohzb)**

这下感觉好多了！点击“Refresh”按钮再也不会打断我们的页面浏览了。我们看到有什么东西正在“内联”加载，并且当数据准备好，它就显示出来了。

### Baking Transitions Into the Design System {#baking-transitions-into-the-design-system}

现在我们知道 `useTransition` 的需求是*非常*常见的。差不多所有导致一个组件 suspend 的按钮点击或交互都需要用 `useTransition` 来避免意外的隐藏了用户正在交互的内容。

这将导致非常多的遍布各个组件的代码重复。这正是**我们通常建议把 `useTransition` 融合到你应用的*设计系统*组件中去**。例如，我们可以吧 transition 逻辑抽取到我们自己的 `<Button>` 组件中：

```js{7-9,20,24}
function Button({ children, onClick }) {
  const [startTransition, isPending] = useTransition({
    timeoutMs: 10000
  });

  function handleClick() {
    startTransition(() => {
      onClick();
    });
  }

  const spinner = (
    // ...
  );

  return (
    <>
      <button
        onClick={handleClick}
        disabled={isPending}
      >
        {children}
      </button>
      {isPending ? spinner : null}
    </>
  );
}
```

**[在 CodeSandbox 中运行](https://codesandbox.io/s/modest-ritchie-iufrh)**

需要注意按钮并不关心我们会更新*什么*。它把发生在它 `onClick` 处理器过程中的*任意* state 更新包装到一个 transition 中。这样我们的 `<Button>` 组件来管理 transition 的配置，而 `<ProfilePage>` 组件不在需要单独配置：

```js{4-6,11-13}
function ProfilePage() {
  const [resource, setResource] = useState(initialResource);

  function handleRefreshClick() {
    setResource(fetchProfileData());
  }

  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails resource={resource} />
      <Button onClick={handleRefreshClick}>
        Refresh
      </Button>
      <Suspense fallback={<h1>Loading posts...</h1>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
    </Suspense>
  );
}
```

**[在 CodeSandbox 中运行](https://codesandbox.io/s/modest-ritchie-iufrh)**

当一个按钮点击的时候，它开启一个 transition 并在自身内部调用 `props.onClick()` -- 这会触发 `<ProfilePage>` 组件中的 `handleRefreshClick`。我们开始获取数据，但这并不会触发一个降级界面，因为我们正运行在 transition 中，并且 `useTransition` 调用中指定的10秒钟尚未达到。当一个 transition 等待的时候，这个按钮会显示一个内联的加载中提示。

我们现在可以看出 Concurrent 模式能够帮助我们在不牺牲组件的独立性和模块性的同时达成更好的用户体验。由 React 来协调 transition。

## 3个阶段 {#the-three-steps}

到此我们已经讨论了一个更新可能经历的所有的不同的显示状态。在这一节中，我们我们会给它们命名并讨论它们之间的关联。

<br>

<img src="../images/docs/cm-steps-simple.png" alt="Three steps" />

在最后，我们达到 **Complete（完成）** 状态。那是我们最终想要达到的状态。它代表着下一个界面完全渲染并且不再加载新数据的那一刻。

但是在我们完成之前，我们可能需要加载一些数据或代码。当我们已经在下一个界面，但它的某些部分还在加载中，我们称他为一个 **Skeleton（骨架）** 状态。

最终，还有两种主要的方式引领我们进入骨架状态。我们会通过一个具体的例子详细描述他们之间的区别。

### 默认情况：Receded → Skeleton → Complete {#default-receded-skeleton-complete}

打开 [这个例子](https://codesandbox.io/s/prod-grass-g1lh5) 并点击“Open Profile”。你会陆续看到几个显示状态：

* **Receded（后退）**： 第一秒，你会看到 `<h1>Loading the app...</h1>` 降级界面。
* **Skeleton：** 你会看到 `<ProfilePage>` 组件中显示着 `<h2>Loading posts...</h2>` .
* **Complete:** 你会看到 `<ProfilePage>` 组件不再显示降级界面。所有内容获取完毕。

我们如何区分 Receded 和 Skeleton 状态呢？它们之间的区别在于 **Receded** 感觉像是面向用户“向后退一步”，而 **Skeleton** 模式感觉像是在我们的进程中“向前走一步”来展示更多的内容。

在这个例子中，我们从 `<HomePage>` 开始我们的旅程：

```js
<Suspense fallback={...}>
  {/* previous screen */}
  <HomePage />
</Suspense>
```

点击之后，React 开始渲染下一个界面：

```js
<Suspense fallback={...}>
  {/* next screen */}
  <ProfilePage>
    <ProfileDetails />
    <Suspense fallback={...}>
      <ProfileTimeline />
    </Suspense>
  </ProfilePage>
</Suspense>
```

`<ProfileDetails>` 和 `<ProfileTimeline>` 都需要数据来渲染，所以他们 suspend：

```js{4,6}
<Suspense fallback={...}>
  {/* next screen */}
  <ProfilePage>
    <ProfileDetails /> {/* suspends! */}
    <Suspense fallback={<h2>Loading posts...</h2>}>
      <ProfileTimeline /> {/* suspends! */}
    </Suspense>
  </ProfilePage>
</Suspense>
```

当一个组件 suspend，React 需要显示最近的那个降级界面。但是对 `<ProfileDetails>` 来说最近的降级界面就已经是最顶层了：

```js{2,3,7}
<Suspense fallback={
  // 我们现在看到这个降级界面是由 <ProfileDetails> 导致
  <h1>Loading the app...</h1>
}>
  {/* next screen */}
  <ProfilePage>
    <ProfileDetails /> {/* suspends! */}
    <Suspense fallback={...}>
      <ProfileTimeline />
    </Suspense>
  </ProfilePage>
</Suspense>
```

这就是当我们点击按钮之后，它感觉像是我们“后退了一步”。`<Suspense>` 范围本来显示的有用内容（`<HomePage />`）必须“后退”并显示降级界面（`<h1>Loading the app...</h1>`）。我们称之为**Receded（后退）**状态。

当我们加载了更多内容的时候，React 会重新尝试渲染，这时 `<ProfileDetails>` 能够成功渲染。最终，我们进入 **Skeleton** 状态。我们看到了尚未完全渲染的新的页面。

```js{6,7,9}
<Suspense fallback={...}>
  {/* 下一屏 */}
  <ProfilePage>
    <ProfileDetails />
    <Suspense fallback={
      // 我们看到此降级界面是由 <ProfileTimeline> 导致
      <h2>Loading posts...</h2>
    }>
      <ProfileTimeline /> {/* suspends! */}
    </Suspense>
  </ProfilePage>
</Suspense>
```

最终，它们也加载好了，然后我们达到 **Complete** 状态

这个剧情（Receded → Skeleton → Complete）是默认情况。但是 Receded 状态是非常不友好的，因为它“隐藏”了已经存在的信息。这正是 React 让我们通过 `useTransition` 进入另一个序列（**Pending（等待）** → Skeleton → Complete）的原因。

### Preferred: Pending → Skeleton → Complete {#preferred-pending-skeleton-complete}

When we `useTransition`, React will let us "stay" on the previous screen -- and show a progress indicator there. We call that a **Pending** state. It feels much better than the Receded state because none of our existing content disappears, and the page stays interactive.

You can compare these two examples to feel the difference:

* Default: [Receded → Skeleton → Complete](https://codesandbox.io/s/prod-grass-g1lh5)
* **Preferred: [Pending → Skeleton → Complete](https://codesandbox.io/s/focused-snow-xbkvl)**

The only difference between these two examples is that the first uses regular `<button>`s, but the second one uses our custom `<Button>` component with `useTransition`.

### Wrap Lazy Features in `<Suspense>` {#wrap-lazy-features-in-suspense}

Open [this example](https://codesandbox.io/s/nameless-butterfly-fkw5q). When you press a button, you'll see the Pending state for a second before moving on. This transition feels nice and fluid.

We will now add a brand new feature to the profile page -- a list of fun facts about a person:

```js{8,13-25}
function ProfilePage({ resource }) {
  return (
    <>
      <ProfileDetails resource={resource} />
      <Suspense fallback={<h2>Loading posts...</h2>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
      <ProfileTrivia resource={resource} />
    </>
  );
}

function ProfileTrivia({ resource }) {
  const trivia = resource.trivia.read();
  return (
    <>
      <h2>Fun Facts</h2>
      <ul>
        {trivia.map(fact => (
          <li key={fact.id}>{fact.text}</li>
        ))}
      </ul>
    </>
  );
}
```

**[在 CodeSandbox 中运行](https://codesandbox.io/s/focused-mountain-uhkzg)**

If you press "Open Profile" now, you can tell something is wrong. It takes whole seven seconds to make the transition now! This is because our trivia API is too slow. Let's say we can't make the API faster. How can we improve the user experience with this constraint?

If we don't want to stay in the Pending state for too long, our first instinct might be to set `timeoutMs` in `useTransition` to something smaller, like `3000`. You can try this [here](https://codesandbox.io/s/practical-kowalevski-kpjg4). This lets us escape the prolonged Pending state, but we still don't have anything useful to show!

There is a simpler way to solve this. **Instead of making the transition shorter, we can "disconnect" the slow component from the transition** by wrapping it into `<Suspense>`:

```js{8,10}
function ProfilePage({ resource }) {
  return (
    <>
      <ProfileDetails resource={resource} />
      <Suspense fallback={<h2>Loading posts...</h2>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
      <Suspense fallback={<h2>Loading fun facts...</h2>}>
        <ProfileTrivia resource={resource} />
      </Suspense>
    </>
  );
}
```

**[在 CodeSandbox 中运行](https://codesandbox.io/s/condescending-shape-s6694)**

This reveals an important insight. React always prefers to go to the Skeleton state as soon as possible. Even if we use transitions with long timeouts everywhere, React will not stay in the Pending state for longer than necessary to avoid the Receded state.

**If some feature isn't a vital part of the next screen, wrap it in `<Suspense>` and let it load lazily.** This ensures we can show the rest of the content as soon as possible. Conversely, if a screen is *not worth showing* without some component, such as `<ProfileDetails>` in our example, do *not* wrap it in `<Suspense>`. Then the transitions will "wait" for it to be ready.

### Suspense Reveal "Train" {#suspense-reveal-train}

When we're already on the next screen, sometimes the data needed to "unlock" different `<Suspense>` boundaries arrives in quick succession. For example, two different responses might arrive after 1000ms and 1050ms, respectively. If you've already waited for a second, waiting another 50ms is not going to be perceptible. This is why React reveals `<Suspense>` boundaries on a schedule, like a "train" that arrives periodically. This trades a small delay for reducing the layout thrashing and the number of visual changes presented to the user.

You can see a demo of this [here](https://codesandbox.io/s/admiring-mendeleev-y54mk). The "posts" and "fun facts" responses come within 100ms of each other. But React coalesces them and "reveals" their Suspense boundaries together. 

### Delaying a Pending Indicator {#delaying-a-pending-indicator}

Our `Button` component will immediately show the Pending state indicator on click:

```js{2,13}
function Button({ children, onClick }) {
  const [startTransition, isPending] = useTransition({
    timeoutMs: 10000
  });

  // ...

  return (
    <>
      <button onClick={handleClick} disabled={isPending}>
        {children}
      </button>
      {isPending ? spinner : null}
    </>
  );
}
```

**[在 CodeSandbox 中运行](https://codesandbox.io/s/floral-thunder-iy826)**

This signals to the user that some work is happening. However, if the transition is relatively short (less than 500ms), it might be too distracting and make the transition itself feel *slower*.

One possible solution to this is to *delay the spinner itself* from displaying:

```css
.DelayedSpinner {
  animation: 0s linear 0.5s forwards makeVisible;
  visibility: hidden;
}

@keyframes makeVisible {
  to {
    visibility: visible;
  }
}
```

```js{2-4,10}
const spinner = (
  <span className="DelayedSpinner">
    {/* ... */}
  </span>
);

return (
  <>
    <button onClick={handleClick}>{children}</button>
    {isPending ? spinner : null}
  </>
);
```

**[在 CodeSandbox 中运行](https://codesandbox.io/s/gallant-spence-l6wbk)**

With this change, even though we're in the Pending state, we don't display any indication to the user until 500ms has passed. This may not seem like much of an improvement when the API responses are slow. But compare how it feels [before](https://codesandbox.io/s/thirsty-liskov-1ygph) and [after](https://codesandbox.io/s/hardcore-http-s18xr) when the API call is fast. Even though the rest of the code hasn't changed, suppressing a "too fast" loading state improves the perceived performance by not calling attention to the delay.

### Recap {#recap}

The most important things we learned so far are:

* By default, our loading sequence is Receded → Skeleton → Complete.
* The Receded state doesn't feel very nice because it hides existing content.
* With `useTransition`, we can opt into showing a Pending state first instead. This will keep us on the previous screen while the next screen is being prepared.
* If we don't want some component to delay the transition, we can wrap it in its own `<Suspense>` boundary.
* Instead of doing `useTransition` in every other component, we can build it into our design system.

## Other Patterns {#other-patterns}

Transitions are probably the most common Concurrent Mode pattern you'll encounter, but there are a few more patterns you might find useful.

### Splitting High and Low Priority State {#splitting-high-and-low-priority-state}

When you design React components, it is usually best to find the "minimal representation" of state. For example, instead of keeping `firstName`, `lastName`, and `fullName` in state, it's usually better keep only `firstName` and `lastName`, and then calculate `fullName` during rendering. This lets us avoid mistakes where we update one state but forget the other state.

However, in Concurrent Mode there are cases where you might *want* to "duplicate" some data in different state variables. Consider this tiny translation app:

```js
const initialQuery = "Hello, world";
const initialResource = fetchTranslation(initialQuery);

function App() {
  const [query, setQuery] = useState(initialQuery);
  const [resource, setResource] = useState(initialResource);

  function handleChange(e) {
    const value = e.target.value;
    setQuery(value);
    setResource(fetchTranslation(value));
  }

  return (
    <>
      <input
        value={query}
        onChange={handleChange}
      />
      <Suspense fallback={<p>Loading...</p>}>
        <Translation resource={resource} />
      </Suspense>
    </>
  );
}

function Translation({ resource }) {
  return (
    <p>
      <b>{resource.read()}</b>
    </p>
  );
}
```

**[在 CodeSandbox 中运行](https://codesandbox.io/s/brave-villani-ypxvf)**

Notice how when you type into the input, the `<Translation>` component suspends, and we see the `<p>Loading...</p>` fallback until we get fresh results. This is not ideal. It would be better if we could see the *previous* translation for a bit while we're fetching the next one.

In fact, if we open the console, we'll see a warning:

```
Warning: App triggered a user-blocking update that suspended.

The fix is to split the update into multiple parts: a user-blocking update to provide immediate feedback, and another update that triggers the bulk of the changes.

Refer to the documentation for useTransition to learn how to implement this pattern.
```

As we mentioned earlier, if some state update causes a component to suspend, that state update should be wrapped in a transition. Let's add `useTransition` to our component:

```js{4-6,10,13}
function App() {
  const [query, setQuery] = useState(initialQuery);
  const [resource, setResource] = useState(initialResource);
  const [startTransition, isPending] = useTransition({
    timeoutMs: 5000
  });

  function handleChange(e) {
    const value = e.target.value;
    startTransition(() => {
      setQuery(value);
      setResource(fetchTranslation(value));
    });
  }

  // ...

}
```

**[在 CodeSandbox 中运行](https://codesandbox.io/s/zen-keldysh-rifos)**

Try typing into the input now. Something's wrong! The input is updating very slowly.

We've fixed the first problem (suspending outside of a transition). But now because of the transition, our state doesn't update immediately, and it can't "drive" a controlled input!

The answer to this problem **is to split the state in two parts:** a "high priority" part that updates immediately, and a "low priority" part that may wait for a transition.

In our example, we already have two state variables. The input text is in `query`, and we read the translation from `resource`. We want changes to the `query` state to happen immediately, but changes to the `resource` (i.e. fetching a new translation) should trigger a transition.

So the correct fix is to put `setQuery` (which doesn't suspend) *outside* the transition, but `setResource` (which will suspend) *inside* of it.

```js{4,5}
function handleChange(e) {
  const value = e.target.value;
  
  // Outside the transition (urgent)
  setQuery(value);

  startTransition(() => {
    // Inside the transition (may be delayed)
    setResource(fetchTranslation(value));
  });
}
```

**[在 CodeSandbox 中运行](https://codesandbox.io/s/lively-smoke-fdf93)**

With this change, it works as expected. We can type into the input immediately, and the translation later "catches up" to what we have typed.

### Deferring a Value {#deferring-a-value}

By default, React always renders a consistent UI. Consider code like this:

```js
<>
  <ProfileDetails user={user} />
  <ProfileTimeline user={user} />
</>
```

React guarantees that whenever we look at these components on the screen, they will reflect data from the same `user`. If a different `user` is passed down because of a state update, you would see them changing together. You can't ever record a screen and find a frame where they would show values from different `user`s. (If you ever run into a case like this, file a bug!)

This makes sense in the vast majority of situations. Inconsistent UI is confusing and can mislead users. (For example, it would be terrible if a messenger's Send button and the conversation picker pane "disagreed" about which thread is currently selected.)

However, sometimes it might be helpful to intentionally introduce an inconsistency. We could do it manually by "splitting" the state like above, but React also offers a built-in Hook for this:

```js
import { useDeferredValue } from 'react';

const deferredValue = useDeferredValue(value, {
  timeoutMs: 5000
});
```

To demonstrate this feature, we'll use [the profile switcher example](https://codesandbox.io/s/musing-ramanujan-bgw2o). Click the "Next" button and notice how it takes 1 second to do a transition.

Let's say that fetching the user details is very fast and only takes 300 milliseconds. Currently, we're waiting a whole second because we need both user details and posts to display a consistent profile page. But what if we want to show the details faster?

If we're willing to sacrifice consistency, we could **pass potentially stale data to the components that delay our transition**. That's what `useDeferredValue()` lets us do:

```js{2-4,10,11,21}
function ProfilePage({ resource }) {
  const deferredResource = useDeferredValue(resource, {
    timeoutMs: 1000
  });
  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails resource={resource} />
      <Suspense fallback={<h1>Loading posts...</h1>}>
        <ProfileTimeline
          resource={deferredResource}
          isStale={deferredResource !== resource}
        />
      </Suspense>
    </Suspense>
  );
}

function ProfileTimeline({ isStale, resource }) {
  const posts = resource.posts.read();
  return (
    <ul style={{ opacity: isStale ? 0.7 : 1 }}>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

**[在 CodeSandbox 中运行](https://codesandbox.io/s/vigorous-keller-3ed2b)**

The tradeoff we're making here is that `<ProfileTimeline>` will be inconsistent with other components and potentially show an older item. Click "Next" a few times, and you'll notice it. But thanks to that, we were able to cut down the transition time from 1000ms to 300ms.

Whether or not it's an appropriate tradeoff depends on the situation. But it's a handy tool, especially when the content doesn't change very visible between items, and the user might not even realize they were looking at a stale version for a second.

It's worth noting that `useDeferredValue` is not *only* useful for data fetching. It also helps when an expensive component tree causes an interaction (e.g. typing in an input) to be sluggish. Just like we can "defer" a value that takes too long to fetch (and show its old value despite others components updating), we can do this with trees that take too long to render.

For example, consider a filterable list like this:

```js
function App() {
  const [text, setText] = useState("hello");

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <div className="App">
      <label>
        Type into the input:{" "}
        <input value={text} onChange={handleChange} />
      </label>
      ...
      <MySlowList text={text} />
    </div>
  );
}
```

**[在 CodeSandbox 中运行](https://codesandbox.io/s/pensive-shirley-wkp46)**

In this example, **every item in `<MySlowList>` has an artificial slowdown -- each of them blocks the thread for a few milliseconds**. We'd never do this in a real app, but this helps us simulate what can happen in a deep component tree with no single obvious place to optimize.

We can see how typing in the input causes stutter. Now let's add `useDeferredValue`:

```js{3-5,18}
function App() {
  const [text, setText] = useState("hello");
  const deferredText = useDeferredValue(text, {
    timeoutMs: 5000
  });

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <div className="App">
      <label>
        Type into the input:{" "}
        <input value={text} onChange={handleChange} />
      </label>
      ...
      <MySlowList text={deferredText} />
    </div>
  );
}
```

**[在 CodeSandbox 中运行](https://codesandbox.io/s/infallible-dewdney-9fkv9)**

Now typing has a lot less stutter -- although we pay for this by showing the results with a lag.

How is this different from debouncing? Our example has a fixed artificial delay (3ms for every one of 80 items), so there is always a delay, no matter how fast our computer is. However, the `useDeferredValue` value only "lags behind" if the rendering takes a while. There is no minimal lag imposed by React. With a more realistic workload, you can expect the lag to adjust to the user’s device. On fast machines, the lag would be smaller or non-existent, and on slow machines, it would be more noticeable. In both cases, the app would remain responsive. That’s the advantage of this mechanism over debouncing or throttling, which always impose a minimal delay and can't avoid blocking the thread while rendering.

Even though there is an improvement in responsiveness, this example isn't as compelling yet because Concurrent Mode is missing some crucial optimizations for this use case. Still, it is interesting to see that features like `useDeferredValue` (or `useTransition`) are useful regardless of whether we're waiting for network or for computational work to finish.

### SuspenseList {#suspenselist}

`<SuspenseList>` is the last pattern that's related to orchestrating loading states.

Consider this example:

```js{5-10}
function ProfilePage({ resource }) {
  return (
    <>
      <ProfileDetails resource={resource} />
      <Suspense fallback={<h2>Loading posts...</h2>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
      <Suspense fallback={<h2>Loading fun facts...</h2>}>
        <ProfileTrivia resource={resource} />
      </Suspense>
    </>
  );
}
```

**[在 CodeSandbox 中运行](https://codesandbox.io/s/proud-tree-exg5t)**

The API call duration in this example is randomized. If you keep refreshing it, you will notice that sometimes the posts arrive first, and sometimes the "fun facts" arrive first.

This presents a problem. If the response for fun facts arrives first, we'll see the fun facts below the `<h2>Loading posts...</h2>` fallback for posts. We might start reading them, but then the *posts* response will come back, and shift all the facts down. This is jarring.

One way we could fix it is by putting them both in a single boundary:

```js
<Suspense fallback={<h2>Loading posts and fun facts...</h2>}>
  <ProfileTimeline resource={resource} />
  <ProfileTrivia resource={resource} />
</Suspense>
```

**[在 CodeSandbox 中运行](https://codesandbox.io/s/currying-violet-5jsiy)**

The problem with this is that now we *always* wait for both of them to be fetched. However, if it's the *posts* that came back first, there's no reason to delay showing them. When fun facts load later, they won't shift the layout because they're already below the posts.

Other approaches to this, such as composing Promises in a special way, are increasingly difficult to pull off when the loading states are located in different components down the tree.

To solve this, we will import `SuspenseList`:

```js
import { SuspenseList } from 'react';
```

`<SuspenseList>` coordinates the "reveal order" of the closest `<Suspense>` nodes below it:

```js{3,11}
function ProfilePage({ resource }) {
  return (
    <SuspenseList revealOrder="forwards">
      <ProfileDetails resource={resource} />
      <Suspense fallback={<h2>Loading posts...</h2>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
      <Suspense fallback={<h2>Loading fun facts...</h2>}>
        <ProfileTrivia resource={resource} />
      </Suspense>
    </SuspenseList>
  );
}
```

**[在 CodeSandbox 中运行](https://codesandbox.io/s/black-wind-byilt)**

The `revealOrder="forwards"` option means that the closest `<Suspense>` nodes inside this list **will only "reveal" their content in the order they appear in the tree -- even if the data for them arrives in a different order**. `<SuspenseList>` has other interesting modes: try changing `"forwards"` to `"backwards"` or `"together"` and see what happens.

You can control how many loading states are visible at once with the `tail` prop. If we specify `tail="collapsed"`, we'll see *at most one* fallback at the time. You can play with it [here](https://codesandbox.io/s/adoring-almeida-1zzjh).

Keep in mind that `<SuspenseList>` is composable, like anything in React. For example, you can create a grid by putting several `<SuspenseList>` rows inside a `<SuspenseList>` table.

## Next Steps {#next-steps}

Concurrent Mode offers a powerful UI programming model and a set of new composable primitives to help you orchestrate delightful user experiences.

It's a result of several years of research and development, but it's not finished. In the section on [adopting Concurrent Mode](/docs/concurrent-mode-adoption.html), we'll describe how you can try it and what you can expect.
