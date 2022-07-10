---
title: "React 16.x 的规划"
author: [gaearon]
---

你可能已经在之前的博客和视频中看到过了 “Hook”，”Suspense” 和 ”并发渲染“ 这三种功能。在这篇文章中，我们会讨论它们将如何整合在 React 中，以及它们将在何时出现在 React 的稳定版本中。

> 2019 年 8 月更新
>
> 你可以在 [React 16.9 版本的博客](/blog/2019/08/08/react-v16.9.0.html#an-update-to-the-roadmap)中找到关于路线图更新的内容。

## 简介 {#tldr}

我们计划在如下里程碑中发布 React 的新功能：

* React 16.6 中包括 [Suspense 以帮助分割代码](#react-166-shipped-the-one-with-suspense-for-code-splitting) (*已经发布*)
* 16.x 的一个小更新包括 [React Hook](#react-16x-q1-2019-the-one-with-hooks) (~2019 第一季度)
* 16.x 的一个小更新包括[并发模式](#react-16x-q2-2019-the-one-with-concurrent-mode) (~2019 第二季度)
* 16.x 的一个小更新包括 [Suspense 以帮助数据获取](#react-16x-mid-2019-the-one-with-suspense-for-data-fetching) (~2019 中旬)

*(这篇文章的原始版本包含了具体的版本号。现在我们隐藏了他们，因为我们可能会在其中加入一些其他的小更新)*

这些是我们的估计，具体计划会根据情况而定。我们计划在 2019 年还至少再完成 2 个项目。它们需要更多的探究，目前还没有加入特定的版本。

* [现代化 React DOM](#modernizing-react-dom)
* [Suspense 以帮助服务器渲染](#suspense-for-server-rendering)

我们将会在未来的几个月中研究出更加清晰的时间线。

>注意
>
>
>这篇文章只是一个计划 —— 其中并没有需要立即注意的内容。未来在每个新功能发布的时候我们会撰写详细的博客文章来解释它们。

## 发行计划 {#release-timeline}

我们对于这些功能有一个总体的规划，但是我们将会在完成每个功能的时候发布它，以便大家可以尽早测试和使用。当你单独看一些API的设计的时候，它们不总是合理的。为了方便你在全局的角度理解我们的计划，这篇文章整理了我们计划中的重要组成部分。（参见 [版本规则](/docs/faq-versioning.html) 来了解我们对稳定性的承诺）

我们逐步发布的计划可以帮助我们优化API，不过在过渡期一些还不完善的部分会令人费解。我们来看看这些功能将会对你的app产生怎样的影响，这些功能之间的关联，还有你可以在什么时候开始学习并使用它们。

### [React 16.6](/blog/2018/10/23/react-v-16-6.html) (已发布)：Suspense 以便拆分代码 {#react-166-shipped-the-one-with-suspense-for-code-splitting}

*Suspense* 代表了 React 的新功能：当组件在等待某些事情时，我们可以 “延迟” 渲染并显示一个载入指示图标。在 React 16.6 中， Suspense 只支持一种情况：使用 `React.lazy()` 和 `<React.Suspense>` 延迟加载组件。

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

使用 `React.lazy()` 和 `<React.Suspense>` 分割代码被记录在 [代码分割指南](/docs/code-splitting.html#reactlazy)中。你可以在 [这篇文章](https://medium.com/@pomber/lazy-loading-and-preloading-components-in-react-16-6-804de091c82d)中找到另一个实践中的例子。

从 2018 年 7 月开始，Facebook 就已经开始使用 Suspense 分割代码了，并且期待它是稳定的。在第一个公开版本 16.6.0 中，这个功能还有一些问题，我们在 16.6.3 中修复了它们。

代码分割只是 Suspense 的第一步。我们对 Suspense 的的长远规划包括了利用它来获取信息（并集成一些库，比如 Apollo）。除了是一个方便的编程模型，在并发模式中， Suspense 也提供了更好的用户体验。我们会在本文之后的内容中讨论它们。

**在 React DOM 中的状态：** 自 React 16.6.0 之后的版本支持。

**在 React DOM Server 中的状态：**  Suspense 还没有包含在服务器端渲染器中。不是因为我们不关注它，我们已经开始了对一个支持 Suspense 的异步服务器端渲染器的开发工作。这是一个很大的项目，将会占用2019年的大部分时间来完成。

**在 React Native 中的状态：** 分割 Bundle 在 React Native 中不是很有用，不过当一个组件使用 Promise 时，没有任何技术障碍可以阻止你用 `React.lazy()` 和 `<Suspense>`。

**建议：** 如果你只在客户端渲染，我们强烈建议使用 `React.lazy()` 和 `<React.Suspense>` 来分割React组件的代码。如果你在服务器端渲染，你需要等到新的服务器端渲染器开发完成再使用它们。

### React 16.x (~2019 第一季度): 包含 Hook 的版本 {#react-16x-q1-2019-the-one-with-hooks}

*Hook* 让你可以在函数组件中使用诸如 state 和生命周期之类的的功能。它们也可以让你在不在文件数中增加镶嵌的情况下重用带有状态的逻辑。

```js
function Example() {
  // 声明一个新的 state 变量，我们叫他 “count”
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

Hook [介绍](/docs/hooks-intro.html)和[综述](/docs/hooks-overview.html)是好的起点。观看[这些演讲](https://www.youtube.com/watch?v=V-QO-KO90iQ)，视频包含综述以及深入介绍。[问答](/docs/hooks-faq.html)部分可以解答你的一些问题。如果想要了解 Hook 背后的动机，可以阅读[这篇文章](https://medium.com/@dan_abramov/making-sense-of-react-hooks-fdbde8803889)。一些 Hook API 设计的原理阐述可以在[这个 RFC 帖子](https://github.com/reactjs/rfcs/pull/68#issuecomment-439314884)中找到。

自 9 月以来，我们在 Facebook 对 Hook 进行了内测。我们不认为 Hook 中还存在严重漏洞。Hook 只在 16.7 alpha 版本 React 中。一些 API 会在最终版本中改动（在[这个评论](https://github.com/reactjs/rfcs/pull/68#issuecomment-439314884)的底部有详细信息）。也有可能对于 Hook 的小更新不在 React 16.7 版本中。

Hook 代表了我们对 React 未来的愿景。它解决了 React 用户们直接面对的问题（渲染 props 和高阶组件，以及生命周期方法中的重复逻辑造成的" wrapper 地狱"）和我们在优化 React 大规模化时候遇到的问题（比如用编译器处理内联组件时的困难）。Hook 不会弃用类。不过，如果 Hook 很成功，在一个未来的 *主要* 版本中，对类的支持会被转移到一个单独的包中，以减少 React 的默认包大小。

**React DOM 中的进度：** 第一个支持 Hook 的 `react` 和 `react-dom` 版本是 `16.7.0-alpha.0`。我们期望在未来的几个月中发布更多的 alpha 版本（本文发布时，最新版是 `16.7.0-alpha.2`）。 你可以通过安装 `react@next` 与 `react-dom@next` 来试用。不要忘记更新 `react-dom` —— 如果不更新的话 Hook 就不会起作用。

**React DOM Server 中的进度：** 同样，在 16.7 中，`react-dom` 给予了 `react-dom/server` 对 Hook 的完全支持。

**React Native 中的进度：** 目前还没有在 React Native 中试用 Hook 的官方方法。如果你希望探索一下，可以参考[这个帖子](https://github.com/facebook/react-native/issues/21967)来获得一些非官方的步骤。有一个还没有解决的已知问题是 `useEffect` 被触发的太晚了。

**建议：** 如果你准备好了，我们建议您在新写的组件中使用 Hook。确保您团队中的每个人都同意使用 Hook 并熟知这个文档。除非您已经打算重写（例如修复 bug）您已有的类，我们不推荐重写它们。您可以在[这里](/docs/hooks-faq.html#adoption-strategy)阅读有关采用 Hook 的更多信息。

### React 16.x （大约 2019 第二季度发布）：带有并发模式的版本 {#react-16x-q2-2019-the-one-with-concurrent-mode}

*Concurrent 模式* 通过渲染组件树而不阻塞主线程来使得 React 应用的响应更加及时。它是可选的，并允许 React 中断长时间运行的渲染（比如，渲染一个新的 news feed story）以处理一个高优先级事件（比如文本输入或者鼠标悬停）。并发模式也通过跳过网络状况良好的情况下的不必要的加载状态以提供更好的用户体验。

>注意
>
>你以前可能听说过并发模式被称为 [“异步模式”](/blog/2018/03/27/update-on-async-rendering.html)。为了强调 React 可以支持不同优先级的任务，我们把它更名为异步模式。这使得它与可以其他异步渲染方法区别开来。

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

目前，并发模式 *远没有* Hook 完成度高。一些 API 还没有被正确的“连通”，也不会执行预想中的任务。本文成文时，我们不推荐在除了早期探索的情况下使用它。我们觉得并发模式本生应该没有什么漏洞，但是，请注意，[`<React.StrictMode>`](https://reactjs.org/docs/strict-mode.html)中的错误提示组件可能还不可以正常工作。另外，我们注意到，并行模式会把一些不是并行模式本身的性能问题 *展现* 出来。举个例子，每隔毫秒执行的`setInterval(fn, 1)`会在并发模式中产生更差的影响。我们计划在正式发行并发模式的时候，提供一些发现并解决这类问题的文档。

并发模式是我们对 React 规划中的一个重要部分。对于需要使用大量 CPU 的任务来说，它提供了不被阻挡的渲染，并使得你的应用在渲染复杂的组件树时可响应。在[我们的冰岛 JSConf 演讲](/blog/2018/03/01/sneak-peek-beyond-react-16.html)中我们展示了它。并发模式也使得悬停 （Suspense）更好。它可以使你在网络够快的时候略过显示载入指示器。除非亲眼所见，它很难解释，[Andrew 的演讲](https://www.youtube.com/watch?v=ByBPyMBTzM0)时现今最好的资料。并发模式依靠一个配合的主线程[调度线程](https://github.com/facebook/react/tree/main/packages/scheduler)，我们正在[和 Chrome 团队合作](https://www.youtube.com/watch?v=mDdgfyRB5kg)以在未来把这个功能加入到浏览器中。

**React DOM 中的进度：** React 16.6 包含了一个 *非常* 不稳定的并发模式，你可以通过 `unstable_` 前缀找到它，。但我们并不推荐使用它，除非你愿意常常遇到死路或者未被开发的功能。16.7的 alpha 版本中包含了 `React.ConcurrentMode` 和 `ReactDOM.createRoot`，并且没有 `unstable_` 前缀。不过在正式版本中我们还是会保留这个前缀，我们将会在未来的小版本中提供文档并把并发模式标记为稳定。

**React DOM Server 中的进度：** 并发模式不会直接影响服务器渲染。现有服务器渲染器将会支持它。

**React Native 中的进度：** 目前的计划是延期在 React Native 中发布并行模式直到 [React Fabric](https://github.com/react-native-community/discussions-and-proposals/issues/4) 基本完成。

**建议：** 如果你计划在未来使用并行模式，一个很好的第一步是用 [`<React.StrictMode>`](https://reactjs.org/docs/strict-mode.html) 来包裹一些组件的子树然后修复出现的错误。通常，我们预计古旧的代码不会被立即兼容。 举个例子，在 Facebook，我们更多的在更新开发的代码中使用并发模式，古旧的代码近期还是会在同步模式下运行。

### React 16.x （大约2019年中旬）： 包含 Suspense 以数据提取的版本 {#react-16x-mid-2019-the-one-with-suspense-for-data-fetching}

如前所述，*Suspense* 是指 React 在组件等待某些事件的时候，“延缓”渲染并显示一个加载指示器的能力。它已经在 React 16.6 中发布，目前 Suspense 唯一支持的用例是代码拆分。在未来的小更新中，我们将会提供使用 Suspense 来加载数据的官方方法。我们会提供一个支持 Suspense 的基本的 “React Cache” 的例子。不过，你也可以自己来实现它。像 Apollo 和 Relay 这样的数据提取库将能够通过遵循我们将要提供的一个的简单的规范与 Suspense 集成。

```js
// 用于简单数据加载的 React Cache （不是最终 API）
import {unstable_createResource} from 'react-cache';

// 告诉 React Cache 如何加载你的数据
const TodoResource = unstable_createResource(fetchTodo);

function Todo(props) {
  // 延缓渲染直到数据存在于缓存中
  const todo = TodoResource.read(props.id);
  return <li>{todo.title}</li>;
}

function App() {
  return (
    // 你已经用于代码分割的 Suspense 的组件同样可以
    // 被用于数据加载
    <React.Suspense fallback={<Spinner />}>
      <ul>
        {/* 同级的数据将会被同时加载 */}
        <Todo id="1" />
        <Todo id="2" />
      </ul>
    </React.Suspense>
  );
}

// 其他的库，比如 Apollo 和 Relay 可以使用类似的 API
// 来集成 Suspense 。
```

关于如何使用 Suspense 加载数据，目前还没有官方的文档。不过你可以通过[这个演讲](https://youtu.be/ByBPyMBTzM0?t=1312)和[这个小演示](https://github.com/facebook/react/blob/main/packages/react-devtools/CHANGELOG.md#suspense-toggle)来获得一些早期信息。接近这次 React 发布的时候，我们会为 React Cache（以及如何实现你自己的可兼容 Suspense 的库）撰写文档。不过如果你好奇的话，你可以在[这里](https://github.com/facebook/react/blob/main/packages/react-cache/src/ReactCache.js)找到它的早期源码。

Suspense 的底层原理（延迟渲染并显示一个后备组件）在 React 16.6 中就已经处于稳定状态了。在过去几个月中，我们已经使用它来分割代码。但是，用于数据获取的上层 API 还非常不稳定。React Cache 还在快速的改变，并且还将改变几次。为了可以拥有更好的上层 API，有几个底层 API 还[不存在](https://github.com/reactjs/rfcs/pull/89)。除了非常早期的实验，我们不推荐在任何地方使用 React Cache。请注意，React Cache 本身并不严格依赖 React 版本，但当前的 alpha 版本缺少缓存失效的基本功能，如果你使用它，你很快就会碰壁。在本次 React 版本中，我们将会拥有一些可用的更新。

最终我们希望通过 Suspense 来获取大多数数据，但是集成所有的部件需要很长时间。在实践中，我们希望它被可以一步步的引进，多数时候是通过 Apollo 和 Relay，而不是直接使用。缺少一些上层 API 并不是唯一的障碍 —— 我们也不支持一些重要的 UI 模式，比如[显示加载结构之外的进度指示器](https://github.com/facebook/react/issues/14248)。一如往常，我们会在博客中的发行说明中提供我们的进度。

**在 React DOM 和 React Native 中的进度：** 技术上来说，一个与 `<React.Suspense>` 兼容的缓存已经存在于 React 16.6 中了。不过直到这个 React 的小更新，我们不会拥有一个好的缓存实现。如果你想探索一下，你可以参考 React Cache 的 alpha 版本来写你自己的缓存。不过请注意，其中的思路是完全不同的，直到文档完成之前，你将会有很大的可能误解 React Cache 的代码。

**React DOM Server 中的进度：** 服务器端渲染器还不支持 Suspense。正如前文提及的，我们开始了开发一个新的支持 Suspense 的异步服务器端渲染器的工作。不过，这是一个大型项目，我们需要使用2019年的大部分时间来完成它。

**建议：** 等待 React 的小更新以使用 Suspense 来获取数据。不要使用 16.6 中的 Suspense 功能来获取数据，我们还不支持它。不过在将来，当我们官方支持使用 Suspense 来获取数据的时候，你可以现存的用来分割代码的 `<Suspense>` 组件来显示加载指示器。

## 其他项目 {#other-projects}

### 现代化 React DOM {#modernizing-react-dom}

我们以减少包的大小和更加契合浏览器的行为为目标开始研究[简化和现代化](https://github.com/facebook/react/issues/13525)ReactDOM。要说有哪些具体的内容会被加入其中现在还为时过早，以为这个项目还在一个探索阶段。我们会在以后提供我们的进展。

### 服务器渲染中的 Suspense {#suspense-for-server-rendering}

我们已经开始了新的支持 Suspense（包括在服务器等待异步数据而不需要二次渲染）和以逐块的形式加载页面内容已提供更好的用户体验的服务器渲染器的设计。你可以在[这个演讲](https://www.youtube.com/watch?v=z-6JC0_cOns)中看到这个早期原型的简介。这个新的服务器渲染器是我们2019年的工作重点，不过具体的时间表还言之过早。和往常一样，它的开发将在 [GitHub 上](https://github.com/facebook/react/pulls?utf8=%E2%9C%93&q=is%3Apr+is%3Aopen+fizz)。

-----

以上就是全部啦！终于你看到的，我们忙于很多项目，但是我们在未来的几个月中期待很多进展。

我们希望这篇文章可以让你对我们现在的工作有一些了解，现在可以使用什么，在未来可以期待什么。尽管在社交平台中有很多关于新功能的讨论，如果你读了这篇文章，你将不会错过任何重要的内容。

我们非常希望收到建议和反馈。欢迎在 [RFC 知识库](https://github.com/reactjs/rfcs)，[issues](https://github.com/facebook/react/issues)，以及[推特](https://mobile.twitter.com/reactjs)中给我们留言。




