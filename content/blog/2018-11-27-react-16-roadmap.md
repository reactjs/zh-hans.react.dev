---
title: "React 16.x 的规划"
author: [gaearon]
---

你可能已经在之前的博客和视频中看到过了“Hooks”，”延迟渲染”和”同步渲染“这三种功能。在这篇文章中，我们会讨论它们将如何整合在React中，以及它们将在何时出现在React的稳定版本中。

## 太长不看 {#tldr}

我们计划在如下里程碑中发布React的新功能：

* React 16.6 中包括 [延迟渲染以帮助分割代码](#react-166-shipped-the-one-with-suspense-for-code-splitting) (*已经发布*)
* 16.x 的一个小更新包括 [React Hooks](#react-16x-q1-2019-the-one-with-hooks) (~2019第一季度)
* 16.x 的一个小更新包括 [同步模式](#react-16x-q2-2019-the-one-with-concurrent-mode) (~2019第二季度)
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

*延迟渲染* 代表了React的新功能：当组件在等待某些事情时，我们可以“延迟”渲染并显示一个载入指示图标。在React 16.6中，延迟渲染只支持一种情况：使用`React.lazy()` 和 `<React.Suspense>`延迟加载组件。

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

从2018年7月开始，Facebook就已经开始使用延迟渲染分割代码了，并且期待它是稳定的。在第一个公开版本16.6.0中，这个功能还有一些问题，我们在16.6.3中修复了它们。

代码分割只是延迟渲染的第一步。我们对延迟渲染的的长远规划包括了利用它来获取信息（并集成一些库，比如Apollo）。除了是一个方便的编程模型，在同步模式中，延迟渲染也提供了更好的用户体验。我们会在本文之后的内容中讨论它们。

**在React DOM中的状态:** 自React 16.6.0 之后的版本支持。

**在React DOM Server中的状态:** 延迟渲染还没有包含在服务器端渲染器中。不是因为我们不关注它，我们已经开始了对一个支持延迟渲染的异步服务器端渲染器的开发工作。这是一个很大的项目，将会占用2019年的大部分时间来完成。

**在React Native中的状态:** 分割Bundle在React Native中不是很有用，不过当一个组件使用Promise时，没有任何技术障碍可以阻止你用`React.lazy()` 和 `<Suspense>`。

**建议:** 如果你只在客户端渲染，我们强烈建议使用`React.lazy()` 和 `<React.Suspense>`来分割React组件的代码。如果你在服务器端渲染，你需要等到新的服务器端渲染器开发完成再使用它们。

### React 16.x (~2019第一季度): 包含Hooks的版本 {#react-16x-q1-2019-the-one-with-hooks}

*Hooks* 让你可以在函数组件中使用诸如state和生命周期之类的的功能。它们也可以让你在不在文件数中增加镶嵌的情况下重用带有状态的逻辑。

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

Hooks [介绍](/docs/hooks-intro.html) 和 [综述](/docs/hooks-overview.html) 是好的起点。 观看 [这些演讲](https://www.youtube.com/watch?v=V-QO-KO90iQ) ，这是视频的综述和深入介绍。[问答](/docs/hooks-faq.html) 部分可以解答你的一些问题。 如果想要了解Hooks背后的动机，可以阅读 [这篇文章](https://medium.com/@dan_abramov/making-sense-of-react-hooks-fdbde8803889)。 一些Hooks API设计的原理阐述可以在 [这个RFC帖子](https://github.com/reactjs/rfcs/pull/68#issuecomment-439314884)中找到。

自9月以来，我们在Facebook对Hooks进行了内测。我们不认为Hooks中还存在严重漏洞。Hooks只在16.7 alpha版本React中。一些API会在最终版本中改动（在[这个评论](https://github.com/reactjs/rfcs/pull/68#issuecomment-439314884)的底部有详细信息）。也有可能对于Hooks的小更新不在React 16.7版本中。

Hooks represent our vision for the future of React. They solve both problems that React users experience directly ("wrapper hell" of render props and higher-order components, duplication of logic in lifecycle methods), and the issues we've encountered optimizing React at scale (such as difficulties in inlining components with a compiler). Hooks don't deprecate classes. However, if Hooks are successful, it is possible that in a future *major* release class support might move to a separate package, reducing the default bundle size of React.

**Status in React DOM:** The first version of `react` and `react-dom` supporting Hooks is `16.7.0-alpha.0`. We expect to publish more alphas over the next months (at the time of writing, the latest one is `16.7.0-alpha.2`). You can try them by installing `react@next` with `react-dom@next`. Don't forget to update `react-dom` -- otherwise Hooks won't work.

**Status in React DOM Server:** The same 16.7 alpha versions of `react-dom` fully support Hooks with `react-dom/server`.

**Status in React Native:** There is no officially supported way to try Hooks in React Native yet. If you're feeling adventurous, check out [this thread](https://github.com/facebook/react-native/issues/21967) for unofficial instructions. There is a known issue with `useEffect` firing too late which still needs to be solved.

**Recommendation:** When you’re ready, we encourage you to start trying Hooks in new components you write. Make sure everyone on your team is on board with using them and familiar with this documentation. We don’t recommend rewriting your existing classes to Hooks unless you planned to rewrite them anyway (e.g. to fix bugs). Read more about the adoption strategy [here](/docs/hooks-faq.html#adoption-strategy).

### React 16.x (~Q2 2019): The One with Concurrent Mode {#react-16x-q2-2019-the-one-with-concurrent-mode}

*Concurrent Mode* lets React apps be more responsive by rendering component trees without blocking the main thread. It is opt-in and allows React to interrupt a long-running render (for example, rendering a new feed story) to handle a high-priority event (for example, text input or hover). Concurrent Mode also improves the user experience of Suspense by skipping unnecessary loading states on fast connections.

>Note
>
>You might have previously heard Concurrent Mode being referred to as ["async mode"](/blog/2018/03/27/update-on-async-rendering.html). We've changed the name to Concurrent Mode to highlight React's ability to perform work on different priority levels. This sets it apart from other approaches to async rendering.

```js
// Two ways to opt in:

// 1. Part of an app (not final API)
<React.unstable_ConcurrentMode>
  <Something />
</React.unstable_ConcurrentMode>

// 2. Whole app (not final API)
ReactDOM.unstable_createRoot(domNode).render(<App />);
```

There is no documentation written for the Concurrent Mode yet. It is important to highlight that the conceptual model will likely be unfamiliar at first. Documenting its benefits, how to use it efficiently, and its pitfalls is a high priority for us, and will be a prerequisite for calling it stable. Until then, [Andrew's talk](https://www.youtube.com/watch?v=ByBPyMBTzM0) is the best introduction available.

Concurrent Mode is *much* less polished than Hooks. Some APIs aren't properly "wired up" yet and don't do what they're expected to. At the time of writing this post, we don't recommend using it for anything except very early experimentation. We don't expect many bugs in Concurrent Mode itself, but note that components that produce warnings in [`<React.StrictMode>`](https://reactjs.org/docs/strict-mode.html) may not work correctly. On a separate note, we've seen that Concurrent Mode *surfaces* performance problems in other code which can sometimes be mistaken for performance issues in Concurrent Mode itself. For example, a stray `setInterval(fn, 1)` call that runs every millisecond would have a worse effect in Concurrent Mode. We plan to publish more guidance about diagnosing and fixing issues like this as part of this release's documentation.

Concurrent Mode is a big part of our vision for React. For CPU-bound work, it allows non-blocking rendering and keeps your app responsive while rendering complex component trees. That's demoed in the first part of [our JSConf Iceland talk](/blog/2018/03/01/sneak-peek-beyond-react-16.html). Concurrent Mode also makes Suspense better. It lets you avoid flickering a loading indicator if the network is fast enough. It's hard to explain without seeing so [Andrew's talk](https://www.youtube.com/watch?v=ByBPyMBTzM0) is the best resource available today. Concurrent Mode relies on a cooperative main thread [scheduler](https://github.com/facebook/react/tree/master/packages/scheduler), and we are [collaborating with the Chrome team](https://www.youtube.com/watch?v=mDdgfyRB5kg) to eventually move this functionality into the browser itself.

**Status in React DOM:** A *very* unstable version of Concurrent Mode is available behind an `unstable_` prefix in React 16.6 but we don't recommend trying it unless you're willing to often run into walls or missing features. The 16.7 alphas include `React.ConcurrentMode` and `ReactDOM.createRoot` without an `unstable_` prefix, but we'll likely keep the prefix in 16.7, and only document and mark Concurrent Mode as stable in this future minor release.

**Status in React DOM Server:** Concurrent Mode doesn't directly affect server rendering. It will work with the existing server renderer.

**Status in React Native:** The current plan is to delay enabling Concurrent Mode in React Native until [React Fabric](https://github.com/react-native-community/discussions-and-proposals/issues/4) project is near completion.

**Recommendation:** If you wish to adopt Concurrent Mode in the future, wrapping some component subtrees in [`<React.StrictMode>`](https://reactjs.org/docs/strict-mode.html) and fixing the resulting warnings is a good first step. In general it's not expected that legacy code would immediately be compatible. For example, at Facebook we mostly intend to use the Concurrent Mode in the more recently developed codebases, and keep the legacy ones running in the synchronous mode for the near future.

### React 16.x (~mid 2019): The One with Suspense for Data Fetching {#react-16x-mid-2019-the-one-with-suspense-for-data-fetching}

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
