---
id: concurrent-mode-suspense
title: 用于数据获取的 Suspense（试验阶段）
permalink: docs/concurrent-mode-suspense.html
prev: concurrent-mode-intro.html
next: concurrent-mode-patterns.html
---

<style>
.scary > blockquote {
  background-color: rgba(237, 51, 21, 0.2);
  border-left-color: #ed3315;
}
</style>

<div class="scary">

>**注意**：
>
>本章节所描述的功能还处于实验阶段，在稳定版本中尚不可用。它面向的人群是早期使用者以及好奇心较强的人。
>
>本页面中许多信息现已过时，仅仅是为了存档而存在。欲了解最新信息，**请参阅 [React 18 Alpha 版公告](/blog/2021/06/08/the-plan-for-react-18.html)**。
>
>在 React 18 发布前，我们将用稳定的文档替代此章节。

</div>

React 16.6 新增了 `<Suspense>` 组件，让你可以“等待”目标代码加载，并且可以直接指定一个加载的界面（像是个 spinner），让它在用户等待的时候显示：

```jsx
const ProfilePage = React.lazy(() => import('./ProfilePage')); // 懒加载

// 在 ProfilePage 组件处于加载阶段时显示一个 spinner
<Suspense fallback={<Spinner />}>
  <ProfilePage />
</Suspense>
```

用于数据获取的 Suspense 是一个新特性，你可以使用 `<Suspense>` **以声明的方式来“等待”任何内容，包括数据。**本文重点介绍它在数据获取的用例，它也可以用于等待图像、脚本或其他异步的操作。

- [何为 Suspense？](#what-is-suspense-exactly)
  - [什么不是 Suspense](#what-suspense-is-not)
  - [Suspense 可以做什么](#what-suspense-lets-you-do)
- [在实践中使用 Suspense](#using-suspense-in-practice)
  - [如果我不使用 Relay，怎么办？](#what-if-i-dont-use-relay)
  - [致库作者](#for-library-authors)
- [传统实现方法 vs Suspense](#traditional-approaches-vs-suspense)
  - [方法 1：Fetch-on-render（渲染之后获取数据，不使用 Suspense）](#approach-1-fetch-on-render-not-using-suspense)
  - [方法 2：Fetch-then-render（接收到全部数据之后渲染，不使用 Suspense）](#approach-2-fetch-then-render-not-using-suspense)
  - [方法 3：Render-as-you-fetch（获取数据之后渲染，使用 Suspense）](#approach-3-render-as-you-fetch-using-suspense)
- [尽早开始获取数据](#start-fetching-early)
  - [我们仍在寻求方法中](#were-still-figuring-this-out)
- [Suspense 和 Race Conditions](#suspense-and-race-conditions)
  - [涉及 useEffect 的 Race Conditions](#race-conditions-with-useeffect)
  - [涉及 componentDidUpdate 的 Race Conditions](#race-conditions-with-componentdidupdate)
  - [Race Conditions 问题](#the-problem)
  - [借助 Suspense 消除 Race Condition](#solving-race-conditions-with-suspense)
- [错误处理](#handling-errors)
- [下一步](#next-steps)

## 何为 Suspense？{#what-is-suspense-exactly}

Suspense 让组件“等待”某个异步操作，直到该异步操作结束即可渲染。在下面[例子](https://codesandbox.io/s/frosty-hermann-bztrp)中，两个组件都会等待异步 API 的返回值：

```js
const resource = fetchProfileData();

function ProfilePage() {
  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails />
      <Suspense fallback={<h1>Loading posts...</h1>}>
        <ProfileTimeline />
      </Suspense>
    </Suspense>
  );
}

function ProfileDetails() {
  // 尝试读取用户信息，尽管该数据可能尚未加载
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}

function ProfileTimeline() {
  // 尝试读取博文信息，尽管该部分数据可能尚未加载
  const posts = resource.posts.read();
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

**[在 CodeSandbox 中尝试](https://codesandbox.io/s/frosty-hermann-bztrp)**

上面的 demo 只是个示意。别担心看不懂代码。我们后面会详细说明这部分代码的运作方式。需要记住的是，Suspense 其实更像是一种*机制*，而 demo 中那些具体的 API，如 `fetchProfileData()` 或者 `resource.posts.read()`，这些 API 本身并不重要。不过，如果你还是对它们很好奇，可以在这个 [demo sandbox](https://codesandbox.io/s/frosty-hermann-bztrp) 中找到它们的定义。

Suspense 不是一个数据请求的库，而是一个机制。这个**机制是用来给数据请求库**向 React 通信说明*某个组件正在读取的数据当前仍不可用*。通信之后，React 可以继续等待数据的返回并更新 UI。在 Facebook，我们用了 Relay 和它的[集成 Suspense 新功能](https://relay.dev/docs/getting-started/step-by-step-guide/) 。我们期望其他的库，如 Apollo，也能支持类似的集成。

从长远来看，我们想让 Suspense 成为组件读取异步数据的主要方式——无论数据来自何方。

### 什么不是 Suspense {#what-suspense-is-not}

Suspense 和当下其他解决异步问题的方法存在明显差异，因而，第一次接触 Suspense 容易让人产生误解。下面我们阐述下常见的误解：

* **它不是数据获取的一种实现。**它并不假定你使用 GraphQL，REST，或者任何其他特定的数据格式、库、数据传输方式、协议。

* **它不是一个可以直接用于数据获取的客户端。**你不能用 Suspense 来“替代” `fetch` 或者 Relay。不过你可以使用集成 Suspense 的库（比如说，[新的 Relay API](https://relay.dev/docs/api-reference/relay-environment-provider/)）。

* **它不使数据获取与视图层代码耦合。**它协助编排加载状态在 UI 中的显示，但它并不将你的网络逻辑捆绑到 React 组件。

### Suspense 可以做什么 {#what-suspense-lets-you-do}

说了那么多，Suspense 到底有什么用呢？对于这个问题，我们可以从不同的角度来回答：

* **它能让数据获取库与 React 紧密整合。**如果一个数据请求库实现了对 Suspense 的支持，那么，在 React 中使用 Suspense 将会是自然不过的事。

* **它能让你有针对性地安排加载状态的展示。**虽然它不干涉数据_怎样_获取，但它可以让你对应用的视图加载顺序有更大的控制权。

* **它能够消除 race conditions。**即便是用上 `await`，异步代码还是很容易出错。相比之下，Suspense 更给人*同步*读取数据的感觉 —— 假定数据已经加载完毕。

## 在实践中使用 Suspense {#using-suspense-in-practice}

在 Facebook 中，我们目前只在生产环境使用集成了 Suspense 的 Relay。**如果你正在找一份实用指南来上手 Suspense，[可以看这份 Relay 指南](https://relay.dev/docs/getting-started/step-by-step-guide/)**！指南中写明了当前运行在我们在生产环境中的可用模式。

**本文所有演示代码均使用“伪”API 实现，而不是 Relay。**我们这样做的目的是想让代码本身更易懂些，让不熟悉 GraphQL 的读者也能看懂代码。也正因为示例代码使用“伪 API”，示例代码本身并不是在应用中使用 Suspense 的“正确方式”。可以说，本文是从概念上出发，目的是帮你了解*为什么* Suspense 是以特定方式运行，以及 Suspense 解决了哪些问题这两件事情。

### 如果我不使用 Relay，怎么办？{#what-if-i-dont-use-relay}

如果你当下并不使用 Relay，那么你暂时无法在应用中试用 Suspense。因为迄今为止，在实现了 Suspense 的库中，Relay 是我们唯一在生产环境测试过，且对它的运作有把握的一个库。

在接下来的几个月里，许多库将会实现它们各自支持 Suspense 的 API。**如果你倾向于等到技术更加稳定之后才开始学习，那大概率你会先不看这部分文档，等到 Suspense 的生态更成熟之后再回来学习。**

如果你有兴趣的话，也可以自己开发，然后将你对 Suspense 的实现集成到某个数据请求库中。

### 致库作者 {#for-library-authors}

我们很期待看到社区中其他库对 Suspense 进行试验。对于数据请求库的作者，有一件重要的事情需要你们引起注意。

尽管实现对 Suspense 的支持从技术上是可行的，Suspense 当前**并不**作为在组件渲染的时候开始获取数据的方式。反而，它让组件表达出它们在正在“等待”*已经发出获取行为的*数据。**[使用 Concurrent 模式和 Suspense 来构建优秀的用户体验](/blog/2019/11/06/building-great-user-experiences-with-concurrent-mode-and-suspense.html)一文说明了这一点的重要性，以及如何在实践中实现这个模式。**

除非你有现成的解决方法来避免瀑布（waterfall）问题，我们建议采用支持在渲染之前就能先获取数据的 API。关于实现这类 API 的具体例子，你可以查看 [Relay Suspense API](https://relay.dev/docs/api-reference/use-preloaded-query/) 实现预加载的方式。对于这方面的信息，我们当前给出的和过去给出的并不完全一致。因为 Suspense 用于数据获取还处于试验阶段，我们的建议会随着我们对 Suspense 在生产环境中的使用习得和对瀑布问题的理解，而发生变化。

## 传统实现方式 vs Suspense {#traditional-approaches-vs-suspense}

我们可以完全不提及当前主流的数据获取方式，只介绍 Suspense。但这样做的话，以下 3 件事情：Suspense 解决了什么问题、为什么这些问题值得处理、以及 Suspense 和其他现存方法的不同，会更难理解。

因此，我们把 Suspense 看作是一系列解决方法的下一步逻辑演化。从这个角度对其展开介绍：

* **Fetch-on-render（渲染之后获取数据，如：在 `useEffect` 中 `fetch`）：**先开始渲染组件，每个完成渲染的组件都可能在它们的 effects 或者生命周期函数中获取数据。这种方式经常导致“瀑布”问题。
* **Fetch-then-render（接收到全部数据之后渲染，如：不使用 Suspense 的 Relay）：**先尽早获取下一屏需要的所有数据，数据准备好后，渲染新的屏幕。但在数据拿到之前，我们什么事也做不了。
* **Render-as-you-fetch（获取数据之后渲染，如：使用了 Suspense 的 Relay）：**先尽早获取下一屏需要的所有数据，然后*立刻*渲染新的屏幕——*在网络响应可用之前就开始*。在接收到数据的过程中，React迭代地渲染需要数据的组件，直到渲染完所有内容为止。

>**注意**
>
>这部分流程经过了简化处理，在实际应用中，真正被采用的方法通常是由不同方法混合而成。但是，我们接下来还是会逐一审视这些方法，因为这样可以让我们更好理解它们各自的优劣。

为了对比这 3 个方法，我们分别用它们实现一个 profile 页面。

### 方法 1：Fetch-on-render（渲染之后获取数据，不使用 Suspense）{#approach-1-fetch-on-render-not-using-suspense}

目前 React 应用中常用的数据获取方式是使用 effect：

```js
// 在函数组件中：
useEffect(() => {
  fetchSomething();
}, []);

// 或者，在 class 组件里：
componentDidMount() {
  fetchSomething();
}
```

我们称这种方法为“fetch-on-render”（渲染之后获取数据），因为数据的获取是发生在组件被渲染到屏幕*之后*。这种方法会导致“瀑布”的问题。

仔细看下面的 `<ProfilePage>` 和 `<ProfileTimeline>` 组件：

```js{4-6,22-24}
function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser().then(u => setUser(u));
  }, []);

  if (user === null) {
    return <p>Loading profile...</p>;
  }
  return (
    <>
      <h1>{user.name}</h1>
      <ProfileTimeline />
    </>
  );
}

function ProfileTimeline() {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    fetchPosts().then(p => setPosts(p));
  }, []);

  if (posts === null) {
    return <h2>Loading posts...</h2>;
  }
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

<<<<<<< HEAD
**[在 CodeSandbox 中尝试](https://codesandbox.io/s/fragrant-glade-8huj6)**
=======
**[Try it on CodeSandbox](https://codesandbox.io/s/fast-glade-rqnhtt)**
>>>>>>> 1e3b023d3192c36a2da7b72389debee2f0e0e8b0

如果你运行上面的代码，你会发现 console 打印如下信息：

1. We start fetching user details（我们开始获取用户信息）
2. We wait...（我们处于等待中）
3. We finish fetching user details（我们接收完所有的用户信息）
4. We start fetching posts（我们开始获取博文数据）
5. We wait...（我们处于等待中）
6. We finish fetching posts（我们接收完所有的博文数据）

假设获取用户信息需要 3 秒，那么在这个方法中，我们只能在 3 秒之后，才*开始*获取博文数据。这就是上面提到的“瀑布”问题：本该并行发出的请求无意中被*串行*发送出去。

在渲染之后再获取数据是引发“瀑布”问题的常见原因。虽然这种情况下的“瀑布”问题可以被解决，但随着项目代码的增多，开发者更倾向于选用其他不会引发这个问题的数据获取方法。

### 方法 2：Fetch-then-render（接收到全部数据之后渲染，不使用 Suspense）{#approach-2-fetch-then-render-not-using-suspense}

通过提供更集中化的方式来实现数据获取，库可以避免“瀑布”问题。比如说，Relay 是通过把组件所需的数据转移到可静态分析的*fragments*上，*fragments*随后会被整合进一个单一的请求。

在本文中，我们不假定读者了解 Relay，因而我们不会在方法 2 的示例代码中使用它。我们做的，是手动把获取数据的方法合并到一起，来模拟 Relay 的行为：

```js
function fetchProfileData() {
  return Promise.all([
    fetchUser(),
    fetchPosts()
  ]).then(([user, posts]) => {
    return {user, posts};
  })
}
```

在下面例子中，`<ProfilePage>` 等待两个并行发出的请求：

```js{1,2,8-13}
// 尽早开始获取数据
const promise = fetchProfileData();

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    promise.then(data => {
      setUser(data.user);
      setPosts(data.posts);
    });
  }, []);

  if (user === null) {
    return <p>Loading profile...</p>;
  }
  return (
    <>
      <h1>{user.name}</h1>
      <ProfileTimeline posts={posts} />
    </>
  );
}

// 子组件不再触发数据请求
function ProfileTimeline({ posts }) {
  if (posts === null) {
    return <h2>Loading posts...</h2>;
  }
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

<<<<<<< HEAD
**[在 CodeSandbox 中尝试](https://codesandbox.io/s/wandering-morning-ev6r0)**
=======
**[Try it on CodeSandbox](https://codesandbox.io/s/hopeful-lake-loddz9)**
>>>>>>> 1e3b023d3192c36a2da7b72389debee2f0e0e8b0

在方法 2 中，console 打印的信息变成这样：

1. We start fetching user details（我们开始获取用户信息）
2. We start fetching posts（我们开始获取博文数据）
3. We wait...（我们处于等待中）
4. We finish fetching user details（我们接收完所有的用户信息）
5. We finish fetching posts（我们接收完所有的博文数据）

这里，我们解决了之前出现的网络“瀑布”问题，却意外引出另外一个问题。我们在 `fetchProfileData` 方法里利用 `Promise.all()` 来等待*所有*数据，这就导致了，即便我们先接收完用户信息的数据，我们也不能先渲染 `ProfileDetails` 这个组件，还得等到博文信息也接收完才行。在这个方法中，我们必须等到两份数据都接收完毕。

当然，这个例子的问题是可以解决的。我们可以去掉 `Promise.all()` ，改用分别等待两个 Promise 的方式来解决。但随着数据和组件树复杂度的增加，这个方法的缺点会逐渐显现出来。如果数据树中出现部分数据的缺失或者过时，则很难写出健壮可靠的组件。因此，在拿到新屏幕所需的全部数据之后，*再*去渲染页面通常是一个比较现实的选择。

### 方法 3：Render-as-you-fetch（获取数据之后渲染，使用 Suspense）{#approach-3-render-as-you-fetch-using-suspense}

在上面方法 2 中，我们是在调用 `setState` 之前就开始获取数据：

1. 开始获取数据
2. 结束获取数据
3. 开始渲染

有了 Suspense，我们依然可以先获取数据，而且可以给上面流程的 2、3 步骤调换顺序：

1. 开始获取数据
2. **开始渲染**
3. **结束获取数据**

**有了 Suspense，我们不必等到数据全部返回才开始渲染**。实际上，我们是一发送网络请求，*就马上*开始渲染：

```js{2,17,23}
// 这不是一个 Promise。这是一个支持 Suspense 的特殊对象。
const resource = fetchProfileData();

function ProfilePage() {
  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails />
      <Suspense fallback={<h1>Loading posts...</h1>}>
        <ProfileTimeline />
      </Suspense>
    </Suspense>
  );
}

function ProfileDetails() {
  // 尝试读取用户信息，尽管信息可能未加载完毕
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}

function ProfileTimeline() {
  // 尝试读取博文数据，尽管数据可能未加载完毕
  const posts = resource.posts.read();
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

**[在 CodeSandbox 中尝试](https://codesandbox.io/s/frosty-hermann-bztrp)**

以下是方法 3 中当我们渲染 `<ProfilePage>` 时会发生的事情：

1. 我们一开始就通过 `fetchProfileData()` 发出请求。这个方法返回给我们一个特殊的对象“resource”，而不是一个 Promise。在现实的案例中，这个对象是由 Relay 通过集成了 Suspense 来提供的。
2. React 尝试渲染 `<ProfilePage>`。该组件返回两个子组件：`<ProfileDetails>` 和 `<ProfileTimeline>`。
3. React 尝试渲染 `<ProfileDetails>`。该组件调用了 `resource.user.read()`，但因为读取的数据还没被获取完毕，所以组件会处于一个“挂起”的状态。React 会跳过这个组件，继续渲染组件树中的其他组件。
4. React 尝试渲染 `<ProfileTimeline>`。该组件调用了 `resource.posts.read()`，和上面一样，数据还没获取完毕，所以这个组件也是处在“挂起”的状态。React 同样跳过这个组件，去渲染组件树中的其他组件。
5. 组件树中已经没有其他组件需要渲染了。因为 `<ProfileDetails>` 组件处于“挂起”状态，React 则是显示出距其上游最近的 `<Suspense>` fallback：`<h1>Loading profile...</h1>` 。渲染到这里就结束了。

这里的 `resource` 对象表示尚未存在但最终将被加载的数据。当我们调用 `read()` 的时候，我们要么获取数据，要么组件处于“挂起”状态。

**随着更多数据的到来，React 将尝试重新渲染，并且每次都可能渲染出更加完整的组件树。**当 `resource.user` 的数据获取完毕之后，`<ProfileDetails>` 组件就能被顺利渲染出来，这时，我们就不再需要展示 `<h1>Loading profile...</h1>` 这个 fallback 了。当我们拿到全部数据之后，所有的 fallbacks 就都可以不展示了。

这意味着一个有趣的事实，即使我们使用 GraphQL 客户端来收集单个请求中需要的所有数据，*流式响应也可以使我们尽早显示更多的内容*。*在数据获取时（render-as-we-fetch）*（而不是全部数据获取*后*）渲染，因此，如果 `user` 在响应中比 `posts` 出现得更早，我们则可以在响应结束之前“解锁”外层的 `<Suspense>` 边界。我们之前并没有意识到这一点，即便是 fetch-then-render（接收到全部数据之后渲染）这个解决方案，在数据获取和渲染之间也有“瀑布”问题。Suspense 没有这个“瀑布”问题，像 Relay 这样的库就利用了这个优势。

请注意，我们是如何在组件中去掉 `if (…)`“is loading” 这个检查的。这不仅删除了样板代码，还简化了代码设计快速转变的流程。举个例子，如果我们想同时“弹出” `<ProfileDetails>` 组件和 `<ProfileTimeline>` 组件，只需删除两者之间的 `<Suspense>`。或者，我们可以通过*给它们各自的*`<Suspense>` 来让两者彼此独立。通过Suspense，我们可以更改加载状态的粒度并控制顺序，而无需调整代码。

## 尽早开始获取数据 {#start-fetching-early}

如果你正在开发数据请求库，对于“获取数据之后渲染”这个方法，你会想知道一件至关重要的事情：**我们是在渲染*之前*就进行数据获取**。可以仔细观察下面代码：

```js
// 一早就开始数据获取，在渲染之前！
const resource = fetchProfileData();

// ...

function ProfileDetails() {
  // 尝试读取用户信息
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}
```

**[在 CodeSandbox 中尝试](https://codesandbox.io/s/frosty-hermann-bztrp)**

请注意，此示例中的 `read()` 调用尚未*开始*。 它只是试图读取**已经获取的数据**。 在创建具有 Suspense 的敏捷应用程序时，这种差异非常重要。 我们并不想把数据获取推迟到组件渲染之后。因此，作为数据请求库的作者，你可以将 `resource` 对象设计成在数据开始请求之前无法被获取，来实现数据请求先发生于组件渲染。 本文中所有使用“伪 API” 的演示都实现了对请求和渲染的顺序控制。

你可能认为演示代码中“在最顶层”获取数据的操作不切实际。如果我们想跳转到另一个人的 profile 页面怎么办？我们可能希望根据 props 获取数据。则解决问题的方法是：**在事件处理函数中开始获取数据**。下面是在不同 profile 页面间导航的简单示例：

```js{1,2,10,11}
// 开始获取数据，越快越好
const initialResource = fetchProfileData(0);

function App() {
  const [resource, setResource] = useState(initialResource);
  return (
    <>
      <button onClick={() => {
        const nextUserId = getNextId(resource.userId);
        // 再次获取数据：用户点击时
        setResource(fetchProfileData(nextUserId));
      }}>
        Next
      </button>
      <ProfilePage resource={resource} />
    </>
  );
}
```

<<<<<<< HEAD
**[在 CodeSandbox 中尝试](https://codesandbox.io/s/infallible-feather-xjtbu)**
=======
**[Try it on CodeSandbox](https://codesandbox.io/s/sparkling-field-41z4r3)**
>>>>>>> 1e3b023d3192c36a2da7b72389debee2f0e0e8b0

通过这种方法，我们可以**并行获取代码和数据**。在页面之间导航时，我们不必等待页面上的代码加载就可以开始加载页面数据。我们可以同时开始获取代码和数据（单击链接时），从而提供更好的用户体验。

接下来需解决的问题是：在渲染下个页面之前，我们怎么知道要获取*什么*数据”。对此解决方法有多种（例如，将数据请求集成到路由解决方案附近）。如果你正在开发数据请求库，那么[使用 Concurrent 模式和 Suspense 来构建优秀的用户体验](/blog/2019/11/06/building-great-user-experiences-with-concurrent-mode-and-suspense.html)将深入探讨了如何解决此问题及其重要性。

### 我们仍在寻求方法中 {#were-still-figuring-this-out}

Suspense 本身作为一个机制而言，它灵活可变并且没有太多的限制。而产品的代码需要足够多的限制来保障代码中不会有“瀑布”问题。关于如何提供保障这一点，目前是有不同的实现方式。当下，我们仍在探索以下问题：

* 提前请求数据可能很困难。我们可以轻松避免瀑布问题吗？
* 当我们获取页面数据时，API是否应该包含数据以便*从*该页面立即转换？
* 响应的有效期是多长？缓存应该是全局的还是本地的？谁管理缓存？
* 可以不通过插入 `read()`，让代理协助表示延迟加载的 APIs 吗？
* 对于任意给定的 Suspense 数据，GraphQL 查询的替代物是什么？

对于这些问题，Relay 有自己的答案。当然，解决这些问题的方法不止一种，我们很期待看到即将出现在 React 社区的新想法

## Suspense 和 Race Conditions {#suspense-and-race-conditions}

Race Conditions 是由于对代码运行顺序的错误假设而导致的 bug。使用生命周期方法（如：`useEffect` Hook  和类的 `componentDidUpdate` 方法）获取数据经常会导致这种情况。Suspense 在这里很有用，让我们看看如何实现。

为了说明问题，我们增加一个顶层组件 `<App>` 来渲染 `<ProfilePage>` ，并放置一个可以**在不同的 profile 页面之间切换**的按钮：

```js{9-11}
function getNextId(id) {
  // ...
}

function App() {
  const [id, setId] = useState(0);
  return (
    <>
      <button onClick={() => setId(getNextId(id))}>
        Next
      </button>
      <ProfilePage id={id} />
    </>
  );
}
```

让我们比较一下不同的数据获取方法如何实现这个需求。

### 涉及 `useEffect` 的 Race Conditions {#race-conditions-with-useeffect}

首先，我们将尝试使用原始的“在 effect 中获取数据”示例，重写在 `<ProfilePage>` props 中传递的 `id` 参数，以传给 `fetchUser(id)` 和 `fetchPosts(id)`：

```js{1,5,6,14,19,23,24}
function ProfilePage({ id }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(id).then(u => setUser(u));
  }, [id]);

  if (user === null) {
    return <p>Loading profile...</p>;
  }
  return (
    <>
      <h1>{user.name}</h1>
      <ProfileTimeline id={id} />
    </>
  );
}

function ProfileTimeline({ id }) {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    fetchPosts(id).then(p => setPosts(p));
  }, [id]);

  if (posts === null) {
    return <h2>Loading posts...</h2>;
  }
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

<<<<<<< HEAD
**[在 CodeSandbox 中尝试](https://codesandbox.io/s/nervous-glade-b5sel)**
=======
**[Try it on CodeSandbox](https://codesandbox.io/s/beautiful-mendeleev-qwyxzg)**
>>>>>>> 1e3b023d3192c36a2da7b72389debee2f0e0e8b0

请注意，我们将 effect 的依赖从 `[]` 更改为 `[id]`——因为我们希望每次 `id` 更改时都重新运行 effect。 如果不这样做，我们将无法再次获取到新的数据。

如果我们尝试运行此代码，一开始看起来运行得很好。但是，如果我们将“伪 API”实现的延迟时间随机化，快速点击“Next”按钮，就会发现控制台日志中有些问题。**有时，在把 profile 页面切换成别的 ID 后，旧的 profile 的请求会“返回”——这种情况下，其他 ID 用的旧响应会覆盖新的 state。**

这个问题是可以解决的（通过在 effect 里头配置 cleanup 函数来过滤、或者取消过期请求），但它依然是个反直觉的问题，且难以检测。

### 涉及 componentDidUpdate 的 Race Conditions {#race-conditions-with-componentdidupdate}

有的人可能认为 race conditions 这个问题只跟 `useEffect` 有关系，或者只和 Hooks 有关。如果我们把上面代码改用 class 组件来实现，或者用 `async / await` 来写，可能就能避开这个问题？

先一起试试看：

```js
class ProfilePage extends React.Component {
  state = {
    user: null,
  };
  componentDidMount() {
    this.fetchData(this.props.id);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      this.fetchData(this.props.id);
    }
  }
  async fetchData(id) {
    const user = await fetchUser(id);
    this.setState({ user });
  }
  render() {
    const { id } = this.props;
    const { user } = this.state;
    if (user === null) {
      return <p>Loading profile...</p>;
    }
    return (
      <>
        <h1>{user.name}</h1>
        <ProfileTimeline id={id} />
      </>
    );
  }
}

class ProfileTimeline extends React.Component {
  state = {
    posts: null,
  };
  componentDidMount() {
    this.fetchData(this.props.id);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      this.fetchData(this.props.id);
    }
  }
  async fetchData(id) {
    const posts = await fetchPosts(id);
    this.setState({ posts });
  }
  render() {
    const { posts } = this.state;
    if (posts === null) {
      return <h2>Loading posts...</h2>;
    }
    return (
      <ul>
        {posts.map(post => (
          <li key={post.id}>{post.text}</li>
        ))}
      </ul>
    );
  }
}
```

<<<<<<< HEAD
**[在 CodeSandbox 中尝试](https://codesandbox.io/s/trusting-clarke-8twuq)**
=======
**[Try it on CodeSandbox](https://codesandbox.io/s/async-wind-9o4ojn)**
>>>>>>> 1e3b023d3192c36a2da7b72389debee2f0e0e8b0

上面代码看似简单易读，实则暗含同样的问题。

所以很不幸，无论是改用 class 组件，还是改用 `async / await` 都没能解决 race conditions。上面代码和用 Hooks 一样都有问题，问题的源头也一样。

### Race Conditions 问题 {#the-problem}

React 组件有它们自己的“生命周期”。组件可能在任意时间点接收到 props 或者更新 state。然而，每一个异步请求*同样也*有自己的“生命周期”。异步请求的生命周期开始于我们发出请求，结束于我们收到响应报文。这里我们面临的问题是，如何在这两类生命周期之间及时进行“同步”。这个问题很是棘手。

### 借助 Suspense 消除 Race Condition {#solving-race-conditions-with-suspense}

我们再来重写上面代码，但这次我们只用 Suspense 来写：

```js
const initialResource = fetchProfileData(0);

function App() {
  const [resource, setResource] = useState(initialResource);
  return (
    <>
      <button onClick={() => {
        const nextUserId = getNextId(resource.userId);
        setResource(fetchProfileData(nextUserId));
      }}>
        Next
      </button>
      <ProfilePage resource={resource} />
    </>
  );
}

function ProfilePage({ resource }) {
  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails resource={resource} />
      <Suspense fallback={<h1>Loading posts...</h1>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
    </Suspense>
  );
}

function ProfileDetails({ resource }) {
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}

function ProfileTimeline({ resource }) {
  const posts = resource.posts.read();
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

<<<<<<< HEAD
**[在 CodeSandbox 中尝试](https://codesandbox.io/s/infallible-feather-xjtbu)**
=======
**[Try it on CodeSandbox](https://codesandbox.io/s/sparkling-field-41z4r3)**
>>>>>>> 1e3b023d3192c36a2da7b72389debee2f0e0e8b0

在这个用上 Suspense 的示例中，我们只需要获取一个数据 `resource`，所以我们把它提到最外层，作为<u>顶层变量</u>。考虑到我们有多个 resources，我们把这个变量放入 `<App>` 组件的 state。

```js{4}
const initialResource = fetchProfileData(0);

function App() {
  const [resource, setResource] = useState(initialResource);
```

当我们点击“Next”按钮，`<App>` 组件便开始发出获取下一个 profile 的请求，并把*请求返回的*对象下传给 `<ProfilePage>` 组件。

```js{4,8}
  <>
    <button onClick={() => {
      const nextUserId = getNextId(resource.userId);
      setResource(fetchProfileData(nextUserId));
    }}>
      Next
    </button>
    <ProfilePage resource={resource} />
  </>
```

再次申明，要注意**这里我们并不是干等到响应报文被接收之后，才去更新 state，而是反过来：我们发出请求之后，马上就开始更新 state（外加开始渲染）**。一旦收到响应，React 就把可用的数据用到 `<Suspense>` 组件里头。

和之前的两版一样，这版代码的可读性也很强，但它和之前的有所不同，Suspense 的这版不会有 race conditions 问题。你可能好奇为什么不会有，这是因为，相比之前的两版，在 Suspense 的这版里，我们不需要太怎么考虑*时机*这个事情。在第一版有 race conditions 问题的代码中，state 需要*在准确的时机*设置，否则就会出错。然而在 Suspense 版本里，我们是都是在获取数据之后，立马就设置 state——因此大大降低出错的概率。

## 错误处理 {#handling-errors}

每当使用 Promises，大概率我们会用 `catch()` 来做错误处理。但当我们用 Suspense 时，我们不*等待* Promises 就直接开始渲染，这时 `catch()` 就不适用了。这种情况下，错误处理该怎么进行呢？

在 Suspense 中，获取数据时抛出的错误和组件渲染时的报错处理方式一样——你可以在需要的层级渲染一个[错误边界](/docs/error-boundaries.html)组件来“捕捉”层级下面的所有的报错信息。

首先，给我们的项目定义一个错误边界组件：

```js
// 目前，错误边界组件只支持通过 class 组件定义。
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    };
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
```

其次，我们将它放到组件树中任意我们想要的地方来捕捉错误：

```js{5,9}
function ProfilePage() {
  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails />
      <ErrorBoundary fallback={<h2>Could not fetch posts.</h2>}>
        <Suspense fallback={<h1>Loading posts...</h1>}>
          <ProfileTimeline />
        </Suspense>
      </ErrorBoundary>
    </Suspense>
  );
}
```

<<<<<<< HEAD
**[在 CodeSandbox 中尝试](https://codesandbox.io/s/adoring-goodall-8wbn7)**
=======
**[Try it on CodeSandbox](https://codesandbox.io/s/sparkling-rgb-r5vfhs)**
>>>>>>> 1e3b023d3192c36a2da7b72389debee2f0e0e8b0

上面代码中的错误边界组件既能捕捉渲染过程的报错，*也*能捕捉 Suspense 里头数据获取的报错。理论上，我们在组件树中插入多少个错误边界组件都是可以的，但这并不是推荐的做法，错误边界组件的位置最好是深思熟虑之后再确定。

## 下一步 {#next-steps}

到这里，我们已经介绍完当 Suspense 用于数据获取时的基本内容。更重要的是，我们现在对 Suspense 有自己运作方式的*原因*，以及它是如何在数据获取这个领域中发挥自己的作用这两点有更好的理解。

Suspense 本身解答了一些问题，但同时它也引出一些新的问题：

<<<<<<< HEAD
* 如果部分组件处于“挂起”状态，整个应用会卡死吗？该怎么避免这个问题？
* 如果我们不想在目标组件的上层，而想在其他地方展示 spinner，可以实现吗？
* 如果我们*想*有计划地在一个短的时间内展示不同的 UI，能够实现吗？
* 除了展示个 spinner，我们能添加额外的视觉效果吗？像是给现有界面加上蒙层之类的？
* 在[最后一个 Suspense 的代码示例中](https://codesandbox.io/s/infallible-feather-xjtbu)，为什么在点击了“Next”按钮之后，会报出警告？
=======
* If some component "suspends", does the app freeze? How to avoid this?
* What if we want to show a spinner in a different place than "above" the component in a tree?
* If we intentionally *want* to show an inconsistent UI for a small period of time, can we do that?
* Instead of showing a spinner, can we add a visual effect like "greying out" the current screen?
* Why does our [last Suspense example](https://codesandbox.io/s/sparkling-field-41z4r3) log a warning when clicking the "Next" button?
>>>>>>> 1e3b023d3192c36a2da7b72389debee2f0e0e8b0

对于上述问题的解答，我们将交由下一章节 [Concurrent UI 模式](/docs/concurrent-mode-patterns.html)处理。
