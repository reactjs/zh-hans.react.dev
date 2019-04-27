---
title: "React 16.x 的规划"
author: [gaearon]
---

你可能已经在之前的博客和视频中看到过了“Hooks”，”延迟渲染”和”并发渲染“这三种功能。在这篇文章中，我们会讨论它们将如何整合在 React 中，以及它们将在何时出现在React的稳定版本中。

## 太长不看 {#tldr}

我们计划在如下里程碑中发布 React 的新功能：

* React 16.6 中包括 [延迟渲染以帮助分割代码](#react-166-shipped-the-one-with-suspense-for-code-splitting) (*已经发布*)
* 16.x 的一个小更新包括 [React Hooks](#react-16x-q1-2019-the-one-with-hooks) (~2019第一季度)
* 16.x 的一个小更新包括 [并发模式](#react-16x-q2-2019-the-one-with-concurrent-mode) (~2019第二季度)
* 16.x 的一个小更新包括 [延迟渲染以帮助数据获取](#react-16x-mid-2019-the-one-with-suspense-for-data-fetching) (~2019中旬)

*(这篇文章的原始版本包含了具体的版本号。现在我们隐藏了他们，因为我们可能会在其中加入一些其他的小更新)*

这些是我们的估计，具体计划会根据情况而定。我们计划在2019年还至少再完成2个项目。它们需要更多的探究，目前还没有加入特定的版本。

* [现代化 React DOM](#modernizing-react-dom)
* [延迟渲染以帮助服务器渲染](#suspense-for-server-rendering)

我们将会在未来的几个月中研究出更加清晰的时间线。

>注意
>
>
>这篇文章只是一个计划 —— 其中并没有需要立即注意的内容。未来在每个新功能发布的时候我们会撰写详细的博客文章来解释它们。

## 发行计划 {#release-timeline}

我们对于这些功能有一个总体的规划，但是我们将会在完成每个功能的时候发布它，以便大家可以尽早测试和使用。当你单独看一些API的设计的时候，它们不总是合理的。为了方便你在全局的角度理解我们的计划，这篇文章整理了我们计划中的重要组成部分。（参见 [版本规则](/docs/faq-versioning.html) 来了解我们对稳定性的承诺）

我们逐步发布的计划可以帮助我们优化API，不过在过渡期一些还不完善的部分会令人费解。我们来看看这些功能将会对你的app产生怎样的影响，这些功能之间的关联，还有你可以在什么时候开始学习并使用它们。

### [React 16.6](/blog/2018/10/23/react-v-16-6.html) (已发布): 延迟渲染以便拆分代码 {#react-166-shipped-the-one-with-suspense-for-code-splitting}

*延迟渲染* 代表了React的新功能：当组件在等待某些事情时，我们可以“延迟”渲染并显示一个载入指示图标。在React 16.6中，延迟渲染只支持一种情况：使用 `React.lazy()` 和 `<React.Suspense>` 延迟加载组件。

```js
// 这个组件是动态加载的
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <React.Suspense fallback={<Spinner />}>
      <div>
        <OtherComponent />
      </div>
    </React.Suspense>
  );
}
```

使用 `React.lazy()` 和 `<React.Suspense>` 分割代码被记录在 [代码分割指南](/docs/code-splitting.html#reactlazy)中。 你可以在 [这篇文章](https://medium.com/@pomber/lazy-loading-and-preloading-components-in-react-16-6-804de091c82d)中找到另一个实践中的例子。

从2018年7月开始，Facebook 就已经开始使用延迟渲染分割代码了，并且期待它是稳定的。在第一个公开版本16.6.0中，这个功能还有一些问题，我们在16.6.3中修复了它们。

代码分割只是延迟渲染的第一步。我们对延迟渲染的的长远规划包括了利用它来获取信息（并集成一些库，比如 Apollo）。除了是一个方便的编程模型，在并发模式中，延迟渲染也提供了更好的用户体验。我们会在本文之后的内容中讨论它们。

**在React DOM中的状态:** 自React 16.6.0 之后的版本支持。

**在React DOM Server中的状态:** 延迟渲染还没有包含在服务器端渲染器中。不是因为我们不关注它，我们已经开始了对一个支持延迟渲染的异步服务器端渲染器的开发工作。这是一个很大的项目，将会占用2019年的大部分时间来完成。

**在React Native中的状态:** 分割 Bundle 在 React Native 中不是很有用，不过当一个组件使用 Promise 时，没有任何技术障碍可以阻止你用 `React.lazy()` 和 `<Suspense>`。

**建议:** 如果你只在客户端渲染，我们强烈建议使用 `React.lazy()` 和 `<React.Suspense>` 来分割React组件的代码。如果你在服务器端渲染，你需要等到新的服务器端渲染器开发完成再使用它们。

### React 16.x (~2019第一季度): 包含Hooks的版本 {#react-16x-q1-2019-the-one-with-hooks}

*Hooks* 让你可以在函数组件中使用诸如 state 和生命周期之类的的功能。它们也可以让你在不在文件数中增加镶嵌的情况下重用带有状态的逻辑。

```js
function Example() {
  // 声明一个新的state变量，我们叫他“count”
  const [count, setCount] = useState(0);

  return (
   <div>
     <p>You clicked {count} times</p>
     <button onClick={() => setCount(count + 1)}>
       Click me
     </button>
   </div>
 );
}
```

Hooks [介绍](/docs/hooks-intro.html) 和 [综述](/docs/hooks-overview.html) 是好的起点。 观看 [这些演讲](https://www.youtube.com/watch?v=V-QO-KO90iQ) ，这是视频的综述和深入介绍。[问答](/docs/hooks-faq.html) 部分可以解答你的一些问题。 如果想要了解 Hooks 背后的动机，可以阅读 [这篇文章](https://medium.com/@dan_abramov/making-sense-of-react-hooks-fdbde8803889)。 一些 Hooks API 设计的原理阐述可以在 [这个RFC帖子](https://github.com/reactjs/rfcs/pull/68#issuecomment-439314884)中找到。

自9月以来，我们在 Facebook 对 Hooks 进行了内测。我们不认为 Hooks 中还存在严重漏洞。Hooks 只在 16.7 alpha 版本 React 中。一些 API 会在最终版本中改动（在[这个评论](https://github.com/reactjs/rfcs/pull/68#issuecomment-439314884)的底部有详细信息）。也有可能对于 Hooks 的小更新不在 React 16.7 版本中。

Hooks 代表了我们对 React 未来的愿景。它解决了 React 用户们直接面对的问题（渲染 props 和高阶组件，以及生命周期方法中的重复逻辑造成的" wrapper 地狱"）和我们在优化 React 大规模化时候遇到的问题（比如用编译器处理内联组件时的困难）。Hooks 不会弃用类。不过，如果 Hooks 很成功，在一个未来的 *主要* 版本中，对类的支持会被转移到一个单独的包中，以减少 React 的默认包大小。

**React DOM 中的进度：** 第一个支持 Hooks 的 `react` 和 `react-dom` 版本是 `16.7.0-alpha.0`。我们期望在未来的几个月中发布更多的 alpha 版本（本文发布时，最新版是 `16.7.0-alpha.2`）。 你可以通过安装 `react@next` 与 `react-dom@next` 来试用。不要忘记更新 `react-dom` —— 如果不更新的话 Hooks 就不会起作用。

**React DOM Server 中的进度：** 同样，在 16.7 中，`react-dom` 给予了 `react-dom/server` 对 Hooks 的完全支持。

**React Native 中的进度：** 目前还没有在 React Native 中试用 Hooks 的官方方法。如果你希望探索一下，可以参考[这个帖子](https://github.com/facebook/react-native/issues/21967)来获得一些非官方的步骤。有一个还没有解决的已知问题是 `useEffect` 被触发的太晚了。

**建议：** 如果你准备好了，我们建议您在新写的组件中使用 Hooks。确保您团队中的每个人都同意使用 Hooks 并熟知这个文档。除非您已经打算重写（例如修复 bug）您已有的类，我们不推荐重写它们。您可以在[这里](/docs/hooks-faq.html#adoption-strategy)阅读有关采用 Hooks 的更多信息。

### React 16.x （大约2019第二季度发布）：带有并发模式的版本 {#react-16x-q2-2019-the-one-with-concurrent-mode}

*并发模式* 通过渲染组件树而不阻塞主线程来使得 React 应用的响应更加及时。它是可选的，并允许 React 中断长时间运行的渲染（比如，渲染一个新的时间线故事）以处理一个高优先级事件（比如文本输入或者鼠标悬停）。并发模式也通过跳过网络状况良好的情况下的不必要的加载状态以提供更好的用户体验。

>注意
>
>你以前可能听说过并发模式被称为[“异步模式”](/blog/2018/03/27/update-on-async-rendering.html)。为了强调 React 可以支持不同优先级的任务，我们把它更名为异步模式。这使得它与可以其他异步渲染方法区别开来。

```js
// 两中方法来获得异步模式：

// 1. 应用的一部分 （不是最终 API）
<React.unstable_ConcurrentMode>
  <Something />
</React.unstable_ConcurrentMode>

// 2. 整个应用 （不是最终 API）
ReactDOM.unstable_createRoot(domNode).render(<App />);
```

目前还没有针对并发模式的文档。我们需要强调，您很可能一开始对这个概念模型觉得陌生。记录它的优点，如何高效的使用以及它的陷阱是我们高优先级的工作项目，也是推出稳定版本的先决条件。在那之前，[Andrew 的演讲](https://www.youtube.com/watch?v=ByBPyMBTzM0)是最好的介绍。

目前，并发模式 *远没有* Hooks 完成度高。一些 API 还没有被正确的“连通”，也不会执行预想中的任务。本文成文时，我们不推荐在除了早期探索的情况下使用它。我们觉得并发模式本生应该没有什么漏洞，但是，请注意，[`<React.StrictMode>`](https://reactjs.org/docs/strict-mode.html)中的错误提示组件可能还不可以正常工作。另外，我们注意到，并行模式会把一些不是并行模式本身的性能问题 *展现* 出来。举个例子，每隔毫秒执行的`setInterval(fn, 1)`会在并发模式中产生更差的影响。我们计划在正式发行并发模式的时候，提供一些发现并解决这类问题的文档。

并发模式是我们对 React 规划中的一个重要部分。对于需要使用大量 CPU 的任务来说，它提供了不被阻挡的渲染，并使得你的应用在渲染复杂的组件树时可响应。在[我们的冰岛 JSConf 演讲](/blog/2018/03/01/sneak-peek-beyond-react-16.html)中我们展示了它。并发模式也使得悬停 （Suspense）更好。它可以使你在网络够快的时候略过显示载入指示器。除非亲眼所见，它很难解释，[Andrew 的演讲](https://www.youtube.com/watch?v=ByBPyMBTzM0)时现今最好的资料。并发模式依靠一个配合的主线程[调度线程](https://github.com/facebook/react/tree/master/packages/scheduler)，我们正在[和 Chome 团队合作](https://www.youtube.com/watch?v=mDdgfyRB5kg)以在未来把这个功能加入到浏览器中。

**React DOM中的进度：** React 16.6 包含了一个 *非常* 不稳定的并发模式，你可以通过 `unstable_` 前缀找到它，。但我们并不推荐使用它，除非你愿意常常遇到死路或者未被开发的功能。16.7的 alpha 版本中包含了 `React.ConcurrentMode` 和 `ReactDOM.createRoot`，并且没有 `unstable_` 前缀。不过在正式版本中我们还是会保留这个前缀，我们将会在未来的小版本中提供文档并把并发模式标记为稳定。

**React DOM Server中的进度：** 并发模式不会直接影响服务器渲染。现有服务器渲染器将会支持它。

**React Native中的进度：** 目前的计划是延期在 React Native 中发布并行模式直到 [React Fabric](https://github.com/react-native-community/discussions-and-proposals/issues/4) 基本完成。

**建议：** 如果你计划在未来使用并行模式，一个很好的第一步是用 [`<React.StrictMode>`](https://reactjs.org/docs/strict-mode.html) 来包裹一些组件的子树然后修复出现的错误。通常，我们预计古旧的代码不会被立即兼容。 举个例子，在 Facebook，我们更多的在更新开发的代码中使用并发模式，古旧的代码近期还是会在同步模式下运行。

### React 16.x （大约2019年中旬）： 包含悬挂以数据提取的版本 {#react-16x-mid-2019-the-one-with-suspense-for-data-fetching}

As mentioned earlier, *Suspense* refers to React's ability to "suspend" rendering while components are waiting for something, and display a loading indicator. In the already shipped React 16.6, the only supported use case for Suspense is code splitting. In this future minor release, we'd like to provide officially supported ways to use it for data fetching too. We'll provide a reference implementation of a basic "React Cache" that's compatible with Suspense, but you can also write your own. Data fetching libraries like Apollo and Relay will be able to integrate with Suspense by following a simple specification that we'll document.

```js
// React Cache for simple data fetching (not final API)
import {unstable_createResource} from 'react-cache';

// Tell React Cache how to fetch your data
const TodoResource = unstable_createResource(fetchTodo);

function Todo(props) {
  // Suspends until the data is in the cache
  const todo = TodoResource.read(props.id);
  return <li>{todo.title}</li>;
}

function App() {
  return (
    // Same Suspense component you already use for code splitting
    // would be able to handle data fetching too.
    <React.Suspense fallback={<Spinner />}>
      <ul>
        {/* Siblings fetch in parallel */}
        <Todo id="1" />
        <Todo id="2" />
      </ul>
    </React.Suspense>
  );
}

// Other libraries like Apollo and Relay can also
// provide Suspense integrations with similar APIs.
```

There is no official documentation for how to fetch data with Suspense yet, but you can find some early information in [this talk](https://youtu.be/ByBPyMBTzM0?t=1312) and [this small demo](https://github.com/facebook/react/tree/master/fixtures/unstable-async/suspense). We'll write documentation for React Cache (and how to write your own Suspense-compatible library) closer to this React release, but if you're curious, you can find its very early source code [here](https://github.com/facebook/react/blob/master/packages/react-cache/src/ReactCache.js).

The low-level Suspense mechanism (suspending rendering and showing a fallback) is expected to be stable even in React 16.6. We've used it for code splitting in production for months. However, the higher-level APIs for data fetching are very unstable. React Cache is rapidly changing, and will change at least a few more times. There are some low-level APIs that are [missing](https://github.com/reactjs/rfcs/pull/89) for a good higher-level API to be possible. We don't recommend using React Cache anywhere except very early experiments. Note that React Cache itself isn't strictly tied to React releases, but the current alphas lack basic features as cache invalidation, and you'll run into a wall very soon. We expect to have something usable with this React release.

Eventually we'd like most data fetching to happen through Suspense but it will take a long time until all integrations are ready. In practice we expect it to be adopted very incrementally, and often through layers like Apollo or Relay rather than directly. Missing higher level APIs aren't the only obstacle — there are also some important UI patterns we don't support yet such as [showing progress indicator outside of the loading view hierarchy](https://github.com/facebook/react/issues/14248). As always, we will communicate our progress in the release notes on this blog.

**Status in React DOM and React Native:** Technically, a compatible cache would already work with `<React.Suspense>` in React 16.6. However, we don't expect to have a good cache implementation until this React minor release. If you're feeling adventurous, you can try to write your own cache by looking at the React Cache alphas. However, note that the mental model is sufficiently different that there's a high risk of misunderstanding it until the docs are ready.

**Status in React DOM Server:** Suspense is not available in the server renderer yet. As we mentioned earlier, we've started work on a new asynchronous server renderer that will support Suspense, but it's a large project and will take a good chunk of 2019 to complete.

**Recommendation:** Wait for this minor React release in order to use Suspense for data fetching. Don’t try to use Suspense features in 16.6 for it; it’s not supported. However, your existing `<Suspense>` components for code splitting will be able to show loading states for data too when Suspense for Data Fetching becomes officially supported.

## Other Projects {#other-projects}

### Modernizing React DOM {#modernizing-react-dom}

We started an investigation into [simplifying and modernizing](https://github.com/facebook/react/issues/13525) ReactDOM, with a goal of reduced bundle size and aligning closer with the browser behavior. It is still early to say which specific bullet points will "make it" because the project is in an exploratory phase. We will communicate our progress on that issue.

### Suspense for Server Rendering {#suspense-for-server-rendering}

We started designing a new server renderer that supports Suspense (including waiting for asynchronous data on the server without double rendering) and progressively loading and hydrating page content in chunks for best user experience. You can watch an overview of its early prototype in [this talk](https://www.youtube.com/watch?v=z-6JC0_cOns). The new server renderer is going to be our major focus in 2019, but it's too early to say anything about its release schedule. Its development, as always, [will happen on GitHub](https://github.com/facebook/react/pulls?utf8=%E2%9C%93&q=is%3Apr+is%3Aopen+fizz).

-----

And that's about it! As you can see, there's a lot here to keep us busy but we expect much progress in the coming months.

We hope this post gives you an idea of what we're working on, what you can use today, and what you can expect to use in the future. While there's a lot of discussion about new features on social media platforms, you won't miss anything important if you read this blog.

We're always open to feedback, and love to hear from you in the [RFC repository](https://github.com/reactjs/rfcs), [the issue tracker](https://github.com/facebook/react/issues), and [on Twitter](https://mobile.twitter.com/reactjs).
