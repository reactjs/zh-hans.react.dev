---
id: concurrent-mode-suspense
title: Suspense 用于数据获取（试验版）
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
>本章节所描述的**实验性功能在稳定版本中[尚不可用](/docs/concurrent-mode-adoption.html)**。请不要在应用程序的生产环境中使用。这些功能可能会发生重大变化，并且在正式成为 React 的一部分之前不会给出警告。
>
>本文档面向早期此功能的使用者以及对此功能好奇的开发者。**如果你并不熟悉 React，请不必担心**——你不需要立刻学习这些功能。稳定版本中有相应的替代实现方式。举个例子，如果你在找和数据获取相关且当下可用的教程，可以改阅[这篇文档](https://www.robinwieruch.de/react-hooks-fetch-data/)。

</div>

React 16.6 新增了 `<Suspense>` 组件，让你可以“等待”目标代码的下载，并且可以直接指定一个加载的界面（像是个 spinner），让它在用户等待的时候显示：

```jsx
const ProfilePage = React.lazy(() => import('./ProfilePage')); // 懒加载

// 在 ProfilePage 组件处于加载阶段时显示一个 spinner
<Suspense fallback={<Spinner />}>
  <ProfilePage />
</Suspense>
```

通过 Suspense 来实现数据获取是 React 的一个新功能，**等待数据获取只是它的能力之一**，你可以直接声明 `<Suspense>` **等待任何你需要的东西**。本文着重介绍的是 `<Suspense>` 应用在数据获取的实现，但这并不意味着它只局限于数据获取，任何其他的异步操作，比如说等待图片、脚本的加载，它都是适用的。

- [究竟什么是 Suspense？](#what-is-suspense-exactly)
  - [什么不是 Suspense](#what-suspense-is-not)
  - [Suspense 可以做什么](#what-suspense-lets-you-do)
- [在实践中使用 Suspense](#using-suspense-in-practice)
  - [如果我不用 Relay？](#what-if-i-dont-use-relay)
  - [致库作者](#for-library-authors)
- [传统实现方法 vs Suspense](#traditional-approaches-vs-suspense)
  - [方法 1：渲染之后获取数据（不使用 Suspense）](#approach-1-fetch-on-render-not-using-suspense)
  - [方法 2：接收到全部数据之后渲染（不使用 Suspense）](#approach-2-fetch-then-render-not-using-suspense)
  - [方法 3：获取数据之后渲染（使用 Suspense）](#approach-3-render-as-you-fetch-using-suspense)
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

上面的 demo 只是个示意。如果示例代码让你摸不着头脑，别担心。我们后面会详细说明这部分代码的运作方式。需要记住的是，Suspense 其实更像是一种*机制*，而 demo 中那些具体的 API，如 `fetchProfileData()` 或者 `resource.posts.read()`，这些 API 本身并不重要。不过，如果你还是对它们很好奇，可以在这个 [demo sandbox](https://codesandbox.io/s/frosty-hermann-bztrp) 中找到它们的定义。

Suspense 不是一个获取数据的库，而是一个机制。这个**机制是用来给获取数据的库**向 React 沟通说明*某个组件正在读取的数据当前仍不可用*。沟通之后，React 可以继续等待数据的返回并更新 UI。 在 Facebook，我们用了 Relay 和它那[支持 Suspense 的新功能](https://relay.dev/docs/en/experimental/step-by-step) 。我们期望其他的库，像 Apollo 之类的，也能支持 Suspense。

从长远上说，我们想让 Suspense 成为组件读取异步数据的主要方式——无论数据来自何方。

### Suspense 不是什么 {#what-suspense-is-not}

Suspense 和当下其他解决异步问题的方法很不一样，因而，第一次接触 Suspense 容易让人产生误解。下面我们阐述下常见的误解：

- **它不是数据获取的一种实现**。它并不假定你使用 GraphQL，REST，或者任何其他特定的数据格式、库、数据传输方式、协议。

- **它不是可以直接用于数据获取的客户端**。你不能用 Suspense 来替代 `fetch` 或者 Relay。不过你可以使用整合了 Suspense 的库（比如说，[新的 Relay APIs](https://relay.dev/docs/en/experimental/api-reference)）

-  * **它不使数据获取与视图层代码耦合**。它协助编排加载状态在 UI 中的显示，但它并不将你的网络逻辑捆绑到 React 组件。

### Suspense 可以做什么 {#what-suspense-lets-you-do}

说了那么多，Suspense 到底有什么用呢？对于这个问题，我们可以从不同的角度来回答：

- **它能让数据获取库与 React 紧密整合**。如果一个获取数据的库实现了对 Suspense 的支持，那么，在 React 中使用 Suspense 将会是自然不过的事。

- **它能让你有针对性地安排加载状态的展示**。它并不干涉数据被获取的方式，但它可以让你对应用的视觉加载流程有更大的控制权。

- **它能够消除 race conditions**。即便是用上 `await`，异步代码还是很容易出错。相比之下，Suspense 更给人*同步*读取数据的感觉——假定数据已经加载完毕。

## 在实践中使用 Suspense {#using-suspense-in-practice}

在 Facebook 中，我们目前只在生产环境使用整合了 Suspense 的 Relay。**如果当前你在找一份实质性的指引来上手 Suspense，[可以看 Relay 的这份指引](https://relay.dev/docs/en/experimental/step-by-step)**！指引里头写明了当前运行在我们在生产环境中的可用模式。

**上面的 demo 代码里用到的 API 其实是“假”的实现，不是 Relay**。我们这样做的目的是想让代码本身更易懂些，让不熟悉 GraphQL 的读者也能看懂代码。也正因为里头 API 是假的，demo 的代码本身并不是在应用中使用 Suspense 的“正确方式”。可以说，本文是从概念上出发，目的是帮你厘清*为什么* Suspense 是以特定方式运行，以及 Suspense 解决了哪些问题这两件事情。

### 如果我不使用 Relay 怎么办？{#what-if-i-dont-use-relay}

如果你当下并不使用 Relay，那么你暂时无法在应用中试用 Suspense。因为迄今为止，在实现了 Suspense 的库中，Relay 是我们唯一在生产环境测试过，且对它的运作有把握的一个库。

在接下来的几个月里，许多库将会实现它们各自支持 Suspense 的 API。**如果你倾向于等到技术更加稳定之后才开始学习，那大概率你会先不看这部分文档，等到 Suspense 的生态更成熟之后再回来学习。**

如果你有兴趣的话，也可以自己开发，然后将你对 Suspense 的实现整合到某个数据获取的库中。

### 致库作者 {#for-library-authors}

我们很期待看到社区中其他库对 Suspense 进行试验。对于数据获取库的作者，有一件重要的事情需要你们引起注意。

尽管实现对 Suspense 的支持从技术上是可行的，Suspense 当前**并不**作为在组件渲染的时候开始获取数据的方式。反而，它让组件表达出它们在正在“等待”*已经发出获取行为的*数据。**[使用 Concurrent 模式和 Suspense 来构建优秀的用户体验](/blog/2019/11/06/building-great-user-experiences-with-concurrent-mode-and-suspense.html)一文说明了这一点的重要性，以及如何在实践中实现这个模式。**

除非你有现成的解决方法来避免 waterfalls，我们建议采用支持在渲染之前就能先获取数据的 APIs。关于实现这类 API 的确切例子，你可以查看 [Relay Suspense API](https://relay.dev/docs/en/experimental/api-reference#usepreloadedquery) 实现预加载的方式。对于这方面的信息，我们当前给出的和过去给出的并不完全一致。因为 Suspense 用于数据获取还处于试验阶段，我们的推荐会随着我们对 Suspense 在生产环境中使用的习得和对 waterfalls 这个问题的理解深度不同，而发生变化。

## 传统实现方式 vs Suspense {#traditional-approaches-vs-suspense}

我们可以完全不提及当前主流的数据获取方式，只介绍 Suspense。但这样做的话，以下 3 件事情：Suspense 解决了的问题、为什么这些问题需要被处理、以及 Suspense 和其他现存方法的不同，会更难厘清。

因此，我们把 Suspense 看作是一系列解决方法的下一步逻辑演化。从这个角度对其展开介绍：

- **渲染之后获取数据（比如，在 useEffect 里获取数据）**：先开始渲染组件，然后每个完成渲染的组件可能会在它们的 effects 或者生命周期函数中获取数据。这种方式经常导致“waterfalls”。
- **接收到全部数据之后渲染（比如，使用 Relay 但不使用 Suspense）**：先尽早获取下一屏需要的所有数据，当数据拿到之后，渲染新的屏幕。但在数据拿到之前，我们什么事也做不了。
- **获取数据之后渲染（比如，使用 Relay 且使用 Suspense）**：先尽早获取下一屏需要的所有数据，然后*马上* 着手渲染新的屏幕——*在我们接收到返回数据之前就开始*。一旦返回数据开始流入，React 再次渲染需要数据的那部分组件，直到数据全部接收完毕。

>**注意**
>
>这部分流程经过了简化处理，在实际应用中，真正被采用的方法通常是由不同方法混合而成。但是，我们接下来还是会逐一审视这些方法，因为这样可以让我们更好理解它们各自的优劣。

为了对比这 3 个方法，我们分别用它们实现一个 profile 页面。

### 方法 1：渲染之后获取数据（不使用 Suspense）{#approach-1-fetch-on-render-not-using-suspense}

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

我们称这种方法为“渲染之后获取数据”（fetch-on-render），因为数据的获取是发生在组件被渲染到屏幕*之后*。这种方法会导致一个问题叫“waterfall”。

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

**[在 CodeSandbox 中尝试](https://codesandbox.io/s/fragrant-glade-8huj6)**

如果你运行上面代码，你会发现 console 里头打印如下信息：

1. We start fetching user details（我们开始获取用户信息）
2. We wait...（我们处于等待中）
3. We finish fetching user details（我们接收完所有的用户信息）
4. We start fetching posts（我们开始获取博文数据）
5. We wait...（我们处于等待中）
6. We finish fetching posts（我们接收完所有的博文数据）

假设获取用户信息总共需要 3 秒，那么在这个方法中，我们就只能在 3 秒之后，才*开始*获取博文数据。而这，就是上面提到的“waterfall”问题：本该并行发出的请求被无意地*串联*发送出去。

在渲染之后再获取数据是引发 waterfall 的常见原因。虽然这种情况下的 waterfall 问题可以被解决，但随着项目代码的增多，开发者更倾向于选用其他不会引发这个问题的数据获取方法。

### 方法 2：接收到全部数据之后渲染（不使用 Suspense）{#approach-2-fetch-then-render-not-using-suspense}

通过提供更集中化的方式来实现数据获取，库可以避免 waterfall 的出现。比如说，Relay 是通过把组件所需的数据转移到可静态分析的*fragments*上，*fragments*随后会被整合进一个单一的请求。

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

**[在 CodeSandbox 中尝试](https://codesandbox.io/s/wandering-morning-ev6r0)**

在方法 2 中，console 打印的信息变成这样：

1. We start fetching user details（我们开始获取用户信息）
2. We start fetching posts（我们开始获取博文数据）
3. We wait...（我们处于等待中）
4. We finish fetching user details（我们接收完所有的用户信息）
5. We finish fetching posts（我们接收完所有的博文数据）

这里，我们解决了方法 1 中出现的网络“waterfall”问题，却又不经意引出另外一个问题。我们在 `fetchProfileData` 里用 `Promise.all()` 来等待*所有*数据，这就导致了，即便我们先接收完用户信息的数据，我们也不能先渲染 `ProfileDetails` 这个组件，还得等到博文信息也接收完才行。在这个方法中，我们必须等到两份数据都接收完毕。

不难看出，在当前这个例子中，上述问题是可解的。我们可以去掉 `Promise.all()`，改用分别等待两个 Promises 的方式来解决。但随着我们所需数据的复杂度的上升和组件树的扩大，这个方法的短板会逐渐显现出来。我们很难写出健壮可靠的组件，因为数据树中可能出现部分数据的缺失或者过期。因此，一次性拿到新屏幕所需的全部数据之后，*再*去渲染页面是个更加切合实际的方式。

### 方法 3：获取数据之后渲染（使用 Suspense） {#approach-3-render-as-you-fetch-using-suspense}

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
  // 尝试读取用户信息，尽管信息可能未下载完毕
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}

function ProfileTimeline() {
  // 尝试读取博文数据，尽管数据可能未下载完毕
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

1. 我们一开始就通过 `fetchProfileData()` 发出请求。这个方法返回给我们一个特殊的对象“resource”，而不是一个 Promise。在现实的案例中，这个对象是由像 Relay 这样的数据获取库通过整合 Suspense 来提供给我们的。
2. React 尝试渲染 `<ProfilePage>`。该组件返回两个子组件：`<ProfileDetails>` 和 `<ProfileTimeline>`。
3. React 尝试渲染 `<ProfileDetails>`。该组件调用了 `resource.user.read()`，但因为读取的数据还没被获取完毕，所以组件会处于一个“挂起”的状态。React 会跳过这个组件，转去渲染组件树中的其他组件。
4. React 尝试渲染 `<ProfileTimeline>`。该组件调用了 `resource.posts.read()`，和上面一样，数据还没获取完毕，所以这个组件也是处在“挂起”的状态。React 同样跳过这个组件，去渲染组件树中的其他组件。
5. 组件树中已经没有其他东西需要渲染了。因为 `<ProfileDetails>` 组件处于“挂起”状态，React 则是渲染出距该组件最近的上游 `<Suspense>` fallback 给它：`<h1>Loading profile...</h1>` 。渲染到这里就结束了。

这里的 `resource` 对象代表的数据虽然还没到位，但大概率它最终会被下载完。所以，当我们读取 `read()` 的时候，我们要么拿到数据，要么拿到一个处于“挂起”状态的组件。

**当返回数据开始流入的时候，React 会重新开始渲染，每一次渲染它都可能渲染出更加完整的组件树。**当 `resource.user` 的数据获取完毕之后，`<ProfileDetails>` 组件就能被顺利渲染出来，这时，我们就不再需要展示 `<h1>Loading profile...</h1>` 这个 fallback 了。当我们拿到全部数据之后，所有的 fallbacks 就都可以不展示了。

这个过程暗含着一个有意思的点，那就是，虽然我们是用 GraphQL 客户端来通过一个单一的请求来获取所有需要的数据，*但因为响应报文是数据流的格式，我们因此能够更早地展示出接收到的数据*。因为我们的采用的方法是“获取数据之后渲染”（render-as-we-fetch）（而非渲染之后才获取数据），我们能够在响应报文接收完毕之前就先“解锁”最外层的 `<Suspense>`。我们在方法 2 里头没谈到这一点：即便是在方法 2 “接收到全部数据之后渲染”（fetch-then-render）中，在获取数据和渲染之间也有 waterfall 问题。而 Suspense 并不会导致这个 waterfall，数据获取库像是 Relay 就抓住了 Suspense 的这个优势。

这里需要注意我们是如何在代码中去掉方法 2 中的 `if (…)` “is loading”这个检查分支。方法 3 不单单删去了 if 分支，还简化了代码设计快速转变的流程。举个例子，如果我们想让 `<ProfileDetails>` 组件和 `<ProfileTimeline>` 组件一直同时“弹出”，我们可以删去上面代码中的内层 `<Suspense>`。又或者，我们可以通过*分别给它们都包上一层*`<Suspense>` 来让两者的渲染展示独立于彼此。Suspense 赋予了我们对加载状态的精细控制力，让我们可以在不对代码进行大改的前提下，控制安排组件间的加载状态和显示顺序。

## 尽早开始获取数据 {#start-fetching-early}

如果你正在开发获取数据的库，对于“获取数据之后渲染”这个方法，你会想知道一件至关重要的事情：**我们是在渲染*之前*就进行数据获取**。可以仔细观察下面代码：

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

需要注意的是，上面代码中 `read()` 本身并不触发数据获取这个行为。它做的事情仅仅是**在数据获取之后**，去读取数据。这个区别对于用 Suspense 创建敏捷应用而言，相当重要。我们并不想把数据获取推迟到组件渲染之后。因此，作为数据获取库的作者，你得实现这一点，让用户能拿到 `resource` 这个对象而不触发数据获取的行为。本文中所有的 demo 都通过使用“假 API”来实现这点。

你可能已经察觉到，像上面例子那样直接在“最外层”获取数据的操作很不实际。现实情况中，如果我们要跳转到另外一个 profile 页面，该怎么实现？我们可能打算基于 props 来做数据获取。所以这个问题的答案是：**我们想实现在事件处理函数中开始获取数据，而不是在“最外层”**。下面是实现了在两个 profile 页面中跳转的简化代码示例：

```js{1,2,10,11}
// 初始数据获取，越快越好
const initialResource = fetchProfileData(0);

function App() {
  const [resource, setResource] = useState(initialResource);
  return (
    <>
      <button onClick={() => {
          const nextUserId = getNextId(resource.userId);
          // 下一次数据获取：在用户点击之后
          setResource(fetchProfileData(nextUserId));
        }}>
        Next
      </button>
      <ProfilePage resource={resource} />
    </>
  );
}
```

**[在 CodeSandbox 中尝试](https://codesandbox.io/s/infallible-feather-xjtbu)**

通过上面代码中的方法，我们可以**并行获取代码和数据**。当我们在不同页面间跳转的时候，不需要等到页面对应的代码加载完之后才开始获取数据。我们可以实现在获取代码的同时（在点击链接的时候）也开始获取数据，从而提供更好的用户体验。

这个方法本身提出了一个问题：我们在渲染下个页面之前，怎么知道要获取*什么*数据？对于这个问题，有几个不同的解决方法（像是，通过将数据获取的相关代码整合到你的路由逻辑中来解决）。如果你在开发数据获取库，[使用 Concurrent 模式和 Suspense 来构建优秀的用户体验](/blog/2019/11/06/building-great-user-experiences-with-concurrent-mode-and-suspense.html)一文深入介绍了如何解决这个问题，以及问题本身的重要性。

### 我们仍在寻求方法中 {#were-still-figuring-this-out}

Suspense 本身作为一个机制而言，它灵活可变并且没有太多的限制。而产品的代码需要足够多的限制来保障代码中不会有 waterfall。关于如何提供保障这一点，目前是有不同的实现方式。当下，我们仍在探索以下问题：

- 尽早地获取数据用代码表达起来会显得笨重。我们该如何让避免 waterfall 这个过程更加容易实现？
- 我们给某个页面获取数据时，当想快速地*从*该页面过渡切换出去，对应的 API 支持带上数据吗？
- 响应报文的有效时长是多少？缓存是要处理成全局还是本地？谁来操控相应的缓存？
- 可以不通过插入 `read()`，让代理协助表示懒加载的 APIs 吗？
- 对于任意的 Suspense 数据，什么能作为复合 GraphQL queries 的等效替代？

Relay 对于以上的问题有自己的一套答案。但上述问题的答案绝对不止一种，我们很期待看到 React 社区中解决这些问题的新思路。

## Suspense 和 Race Conditions {#suspense-and-race-conditions}

Race conditions 是 bug 的一类，它的出现是源于开发人员对代码运行顺序的错误推算。在 `useEffect` Hook 或在 class 组件的生命周期函数中调用 `componentDidUpdate` 方法是导致 race conditions 的常见原因。对这类问题，Suspense 也能帮得上忙——下面谈谈具体做法。

为了说明这类问题，我们增加一个最外层组件 `<App>`，它渲染出我们上面的`<ProfilePage>` 组件，外加一个按钮，让我们可以**在不同的 profiles 页面之间切换**。

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

接下来，我们对比下不同的数据获取方法分别是如何实现页面切换。

### 涉及 `useEffect` 的 Race Conditions {#race-conditions-with-useeffect}

我们先直接复制上面方法 1 的代码，然后做些修改：给 `<ProfilePage>` 组件传入个参数 `id`，并把这个 `id` 传给 `fetchUser(id)` 和 `fetchPosts(id)`，如下：

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

**[在 CodeSandbox 中尝试](https://codesandbox.io/s/nervous-glade-b5sel)**

需要注意代码中 effect 的依赖从 `[]` 变成了 `[id]`——因为我们想在 `id` 变化之后，effect 紧接着再次运行，不然的话，我们就拿不到最新的数据。

如果我们运行上面的代码，咋一看会觉得它应该可以正常运行。然而，如果我们在 `fetchUser` 和 `fetchPosts` 这两个“假 API”里头都做延迟处理，且延迟的时间随机赋值，接着快速点击按钮“Next”，我们就能从 console 的打印信息看出程序有 bug。**在我们已经切换到新的 profile 页面之后，旧页面发出的请求会时不时“杀回来”——那时，回来的过期响应报文就会用另外一个 ID 的过期数据重写当前正确且新鲜的 state。**

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

**[在 CodeSandbox 中尝试](https://codesandbox.io/s/trusting-clarke-8twuq)**

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

**[在 CodeSandbox 中尝试](https://codesandbox.io/s/infallible-feather-xjtbu)**

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

**[在 CodeSandbox 中尝试](https://codesandbox.io/s/adoring-goodall-8wbn7)**

上面代码中的错误边界组件既能捕捉渲染过程的报错，*也*能捕捉 Suspense 里头数据获取的报错。理论上，我们在组件树中插入多少个错误边界组件都是可以的，但这并不是推荐的做法，错误边界组件的位置最好是深思熟虑之后再确定。

## 下一步 {#next-steps}

到这里，我们已经介绍完当 Suspense 用于数据获取时的基本内容。更重要的是，我们现在对 Suspense 有自己运作方式的*原因*，以及它是如何在数据获取这个领域中发挥自己的作用这两点有更好的理解。

Suspense 本身解答了一些问题，但同时它也引出一些新的问题：

- 如果部分组件处于“挂起”状态，整个应用会卡死吗？该怎么避免这个问题？
- 如果我们不想在目标组件的上层，而想在其他地方展示 spinner，可以实现吗？
- 如果我们*想*有计划地在一个短的时间内展示不同的 UI，能够实现吗？
- 除了展示个 spinner，我们能添加额外的视觉效果吗？像是给现有界面加上蒙层之类的？
- 在[最后一个 Suspense 的代码示例中](https://codesandbox.io/s/infallible-feather-xjtbu)，为什么在点击了“Next”按钮之后，会报出警告？

对于上述问题的解答，我们将交由下一章节 [Concurrent UI 模式](/docs/concurrent-mode-patterns.html)处理。
