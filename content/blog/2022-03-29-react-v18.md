---
title: "React v18.0"
author: [reactteam]
---

React 18 现在在 npm 上可用！

在我们过去的文章中，我们分享了一步步 [升级你的 app 到 React 18](https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html) 的说明。在这篇文章中，我们将概述 React 18 的新内容，以及它对未来的意义。

我们最新的主要版本包括开箱即用的改进，如自动批量处理，新的 API 如 startTransition，以及支持 Suspense 的流式服务端渲染。

React 18 的许多功能都是建立在我们新的并发渲染器上的，这是一个幕后变化，它解锁了强大的新功能。并发 React 是可选的，它只有在你使用并发功能时才会启用，但我们认为它对人们如何创建应用会有巨大影响。

我们已经花费了数年调查和开发，以支持 React 的并发，而且我们格外注意对现有用户的渐进式升级。去年夏天，[我们成立了一个 React 18 工作组](https://reactjs.org/blog/2021/06/08/the-plan-for-react-18.html)，以收集来自社区专家的反馈，从而确保整个 React 生态系统的平滑升级体验。

如果你错过了它，我们在 React Conf 2021 分享了很多这个愿景：

* 在 [这次分享](https://www.youtube.com/watch?v=FZ0cG47msEk&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa) 中，我们解释了 React 18 如何符合开发者轻松构建出色用户体验的使命
* [Shruti Kapoor](https://twitter.com/shrutikapoor08) [演示了如何使用 React 18 的新功能](https://www.youtube.com/watch?v=ytudH8je5ko&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa&index=2)
* [Shaundai Person](https://twitter.com/shaundai) 向我们介绍了 [Suspense 与流式服务端渲染](https://www.youtube.com/watch?v=pj5N-Khihgc&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa&index=3)

下面是对该版本预期内容的全面概述，首先是并发渲染。

*React Native 用户注意：React Native 将采用新架构搭载 React 18。更多信息，参阅 [这个 React Conf 分享](https://www.youtube.com/watch?v=FZ0cG47msEk&t=1530s)。*

## 什么是并发 React？ {#what-is-concurrent-react}

React 18 最重要的新增功能，是我们希望你永远不必考虑的：并发性。我们认为这对应用开发者来说基本正确，尽管对库的维护者来说，会有点复杂。

并发本身不是一个功能。它是一个新的幕后程序，它使 React 可以在同一时刻准备多个版本的 UI。你可以认为并发是一个实现细节，而它的价值在于它解锁的功能。React 在其内部实现采用了复杂的技术，如优先级队列和多缓冲。但你不会在我们的公共 API 中看到这些概念。

在我们设计 API 时，我们试图对开发者隐藏实现细节。作为 React 开发者，你关注的是你想要的用户体验是*什么*，而 React 处理的是*如何*提供这种体验。因此我们不会期望 React 开发者了解引擎下的并发是如何工作的。

不过，并发 React 比一个典型的实现细节更重要 ── 它是 React 核心渲染模型的基础性更新。因此，虽然知道并发如何工作不是非常重要，但可能值得在高层次上了解它是什么。

并发 React 的一个关键属性是，渲染是可中断的。当你第一次升级到 React 18 时，在添加任何并发功能前，更新会像之前的 React 版本那样渲染 ── 在一个单一的、非中断的、同步的事务中。对于同步渲染，一旦一个更新开始渲染，就不能中断它，直到用户可以在屏幕上看到结果。

在并发渲染中，并不总是这样。React 可能会开始渲染一个更新，在中途挂起，然后再继续。它甚至可能完全放弃一个正在进行的渲染。React 保证，即使渲染被中断，UI 也会呈现出一致性。为此，它等待执行 DOM 变更，直到整个树被评估完毕。这样做，React 可以在后台提前准备新屏幕，而不阻塞主线程。这意味着用户输入可以被立即响应，创造流畅的用户体验，即使它在大量渲染任务中。

另一个例子是可重用状态。并发 React 可以从屏幕中移除部分 UI，之后将他们再加回来，并重用之前的状态。例如，当一个用户标签在屏幕中切出并切回时，React 应该能够将之前的屏幕恢复到它先前的状态。在即将到来的次要版本中，我们计划添加一个新的名为 `<Offscreen>` 的组件，它实现了这种模式。同样地，你将能够使用 Offscreen 在后台准备新的 UI，以便在用户显示前准备就绪。

并发渲染是 React 中一个强大的新工具，我们的大多数新功能都是为了利用它而建立的，包括 Suspense、过渡和流式服务端渲染。但 React 18 仅仅是在此基础上，我们构建目标的开始。

## 渐进采用并发特性 {#gradually-adopting-concurrent-features}

从技术上讲，并发渲染是一个破坏性变化。因为并发渲染是可中断的，当它被启用时，组件的行为会有略微的不同。

在我们的测试中，我们已经将成千上万的组件升级到 React 18。我们发现，几乎所有的现有组件都能在并发渲染下“正常工作”，不需要做任何改变。然而，其中的一些可能需要一些额外的迁移工作。尽管这些变化通常很小，但你仍然可以按照自己的节奏进行。React 18 中的新渲染行为 **只在你的应用中使用新功能的部分启用**。

整体的升级策略是让你的应用运行在 React 18，而不破坏现有的代码。然后你可以渐进的开始添加并发特性，以你自己的节奏。你可以在开发过程中使用 [`<StrictMode>`](/docs/strict-mode.html) 帮助浮现与并发相关的 bug。严格模式不会影响生产环境行为，但在开发过程中，它会记录额外的警告，并两次调用那些预期为幂等的函数。它不会捕获所有情况，但它是防止多数常见类型错误的有效方式。

在你升级到 React 18 后，你将能够立即开始使用并发的功能。例如，你可以使用 startTransition 在屏幕之间进行导航，而不会阻塞用户输入。或者使用 useDeferredValue 节制昂贵的重新渲染。

然而，从长远来看，我们希望你在你的应用程序中增加并发性的主要方式是使用一个支持并发性的库或框架。在多数情况下，你不会直接与并发 API 交互。例如，在导航到一个新的屏幕时，开发者无需调用 startTransition，路由库会自动将导航操作包裹在 startTransition 中。

这些库升级到兼容并发，可能需要一些时间。我们已经提供了新的 API，使库更容易利用并发功能。同时，在我们努力逐步迁移 React 生态系统的过程中，请对维护者保持耐心。

更多信息，请看我们之前的帖子：[如何升级到 React 18](https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html)。

## 数据框架中的 Suspense {#suspense-in-data-frameworks}

在 React 18 中，你可以开始使用 Suspense 在 Relay、Next.js、Hydrogen 或 Remix 等框架中获取数据。使用 Suspense 临时获取数据在技术上是可行的，但仍不建议作为一般策略。

在未来，我们可能会暴露更多的原语，使你更容易用 Suspense 访问你的数据，也许不需要使用一个固执的框架。然而，当 Suspense 被深度整合到你的应用程序架构中时，它的效果是最好的：你的路由器、你的数据层和你的服务端渲染环境。因此，即使从长远来看，我们预计库和框架将在 React 生态系统中发挥关键作用。

就像以前的 React 版本一样，你也可以用 React.lazy 在客户端使用 Suspense 进行代码拆分。但是，我们对 Suspense 的愿景一直远超过加载代码 ── 目标是扩展对 Suspense 的支持，以便最终，同样的声明式 Suspense fallback 可以处理任何异步操作（加载代码、数据、图像等）。

## 服务端组件仍在开发中 {#server-components-is-still-in-development}

[**服务端组件**](https://reactjs.org/blog/2020/12/21/data-fetching-with-react-server-components.html) 是一个即将推出的功能，它允许开发者构建跨服务端和客户端的 app，以结合客户端 app 的丰富交互性与传统服务端渲染的改进性能。服务端组件本身并不与并发 React 耦合，但它被设计为与并发功能（如 Suspense 和流式服务端渲染）配合使用效果最好。

服务端组件仍是实验性的，但我们预计会在 18.x 小版本中发布一个初始版本。同时，我们正在与 Next.js、Hydrogen 和 Remix 等框架合作，以推进该提案，并使其准备好被广泛采用。

## React 18 的新内容 {#whats-new-in-react-18}

### 新功能：自动批量处理 {#new-feature-automatic-batching}

批量处理是指 React 将多个状态更新分组到一个重新渲染中，以获得更好的性能。如果没有自动批量处理，我们只对 React 事件处理程序中的更新进行批量处理。默认情况下，React 不会对 Promise、setTimeout、原生事件处理程序或任何其它事件中的更新进行批量处理。有了自动批量处理，这些更新将被自动的批量处理。


```js
// 之前：只对 React 事件执行批量处理
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React 将渲染两次，每次状态更新一次（无批量处理）
}, 1000);

// 之后：超时、Promises、本机事件处理程序
// 或任何其他事件内的更新是批处理的。

setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React 只会在最终重新渲染一次（这就是批量处理！）
}, 1000);
```

更多信息，请查看 [在 React 18 中自动批量处理以减少渲染次数](https://github.com/reactwg/react-18/discussions/21)。

### 新功能：过渡 {#new-feature-transitions}

过渡是 React 中的一个新概念，用以区分紧急和非紧急更新。

* **紧急更新** 反映了直接的交互，如输入、点击、按压等。
* **过渡更新** 将 UI 从一个视图过渡到另一个。

像输入、点击或按压这样的紧急更新，需要立即响应，以符合我们对物理对象行为方式的直觉。否则他们就会感到“不对劲儿”。然而，过渡是不同的，因为用户并不期望在屏幕上看到每个中间值。

例如，当你在一个下拉菜单中选择一个过滤器时，你希望过滤器按钮本身在你点击时能立即做出反应。然而，实际结果可能会单独过渡。一个小的延迟将是难以察觉的，而且往往是预期的。并且，如果你在结果渲染完成之前再次改变过滤器，你只关心看到最新的结果。

通常情况下，为了获得最佳的用户体验，一个用户输入应该同时导致一个紧急更新和一个非紧急更新。你可以在输入事件中使用 startTransition API 来告知 React 哪些是紧急更新，哪些是“过渡”：


```js
import {startTransition} from 'react';

// 紧急：显示输入的内容
setInputValue(input);

// 将内部的任何状态更新都标记为过渡
startTransition(() => {
  // 过渡：显示结果
  setSearchQuery(input);
});
```


被 startTransition 包裹的更新被当作非紧急事件处理，如有更紧急更新，如点击或按键，则会被中断。如果一个过渡被用户中断（例如，连续输入多个字符），React 会丢弃未完成的无效的渲染，而只渲染最新的更新。


* `useTransition`：一个启动过渡的 Hook，包括一个值以跟踪待定状态。
* `startTransition`：当 Hook 不能使用时，一个启动过渡的方法。

过渡将选择并发渲染，这允许更新被中断。如果内容重新挂起，过渡也会告诉 React 继续显示当前内容，同时在后台渲染过渡内容（参见 [过渡 RFC](https://github.com/reactjs/rfcs/blob/main/text/0213-suspense-in-react-18.md)）。

[更多内容请参阅过渡文档](/docs/react-api.html#transitions)。

### 新的 Suspense 特性 {#new-suspense-features}

如果组件树的某一部分还没有准备好被显示，Suspense 可以让你声明式地指定加载状态：

```js
<Suspense fallback={<Spinner />}>
  <Comments />
</Suspense>
```

Suspense 使“UI 加载状态”成为 React 编程模型中的第一类声明式概念。这让我们可以在它上面建立更高层次的功能。

几年前，我们推出了一个有限的 Suspense 版本。然而，唯一支持的用例是用 React.lazy 拆分代码，且在服务端渲染时根本不支持。

在 React 18 中，我们增加了对服务端的 Suspense 支持，并使用并发渲染特性扩展了其功能。

React 18 中的 Suspense 在与过渡 API 结合时效果最好。如果你在过渡期间挂起，React 将防止已经可见的内容被回退取代。相反，React 会延迟渲染，直到有足够的数据加载，以防止出现糟糕的加载状态。

更多内容参见 [React 18 Suspense](https://github.com/reactjs/rfcs/blob/main/text/0213-suspense-in-react-18.md) 的 RFC。

### 新的客户端、服务端渲染 API {#new-client-and-server-rendering-apis}

在这个版本中，我们借此机会重新设计了我们为在客户端和服务端渲染所暴露的 API。这些更改允许用户在升级到 React 18 中的新 API 时继续使用 React 17 模式下的旧 API。

#### React DOM Client {#react-dom-client}

这些新的 API 现在从 `react-dom/client` 导出：

* `createRoot`：新的创建根的方法，以进行 `render` 或 `unmount`。使用它替代 `ReactDOM.render`。没有它，React 18 的新功能就不能工作。
* `hydrateRoot`：新的方法用以创建服务端渲染应用。使用它替代 `ReactDOM.hydrate` 与新的 React DOM 服务端 API 一起使用。没有它，React 18 的新功能就不能工作。

`createRoot` 和 `hydrateRoot` 都接受一个新的选项，叫做 `onRecoverableError`，以防你想在 React `render` 或 `hydrate` 从错误恢复时得到通知，以便记录。默认情况下，React会使用 [`reportError`](https://developer.mozilla.org/en-US/docs/Web/API/reportError)，或在较旧的浏览器中使用 `console.error`。

[参阅 React DOM Client 的文档](/docs/react-dom-client.html)。

#### React DOM Server {#react-dom-server}

这些新的 API 现在从 `react-dom/server` 导出，并且完全支持服务端的流式 Suspense：

* `renderToPipeableStream`：用于 Node 环境下的 Stream。
* `renderToReadableStream`：用于现代边缘运行环境，如 Deno 和 Cloudflare workers。

现有的 `renderToString` 方法仍然可用，但不鼓励使用。

[参阅 React DOM Server 的文档](/docs/react-dom-server.html)。

### 新的严格模式行为 {#new-strict-mode-behaviors}

在未来，我们希望增加一个功能，允许 React 在保留状态的同时增加和删除部分的 UI。例如，当用户从一个屏幕切出并切回时，React 应该能够立即显示之前的屏幕。要做到这一点，React 将使用与之前相同的组件状态来卸载和重新装载树。

这个功能将给 React 应用带来更好的开箱即用的性能，但需要组件对 effect 被多次装载和销毁具有弹性。大多数 effect 会正常工作而无需任何更改，但有些 effect 假设它们只被装载或销毁一次。

为了帮助浮现这些问题，React 18 为严格模式引入了一个新的仅用于开发的检查。每当组件第一次装载时，此检查将自动卸载并重新装载每个组件，并在第二次装载时恢复先前的状态。

在这个变化之前，React 会装载组件并创建 effect：

```
* React 装载组件
  * layout effect 创建
  * effect 创建
```


在 React 18 的严格模式下，React 会在开发模式下模拟卸载和重新装载组件：

```
* React 装载组件
  * layout effect 创建
  * effect 创建
* React 模拟卸载组件
  * layout effect 销毁
  * effect 销毁
* React 模拟装载组件（使用之前的状态）
  * layout effect 创建
  * effect 创建
```

参阅 [确保状态可重用](/docs/strict-mode.html#ensuring-reusable-state) 文档。

### 新的 Hook {#new-hooks}

#### useId {#useid}

`useId` 是一个新的 Hook，用于在客户端和服务端上生成唯一 ID，避免 hydrate 不匹配。它主要用于组件库，这些库集成了需要唯一 ID 的可访问性 API。这解决了 React 17 及更低版本中已经存在的问题，但在 React 18 中更为重要，因为新的流式服务端渲染器对 HTML 的无序交付方式。[参阅文档](/docs/hooks-reference.html#useid)。

> Note
>
> `useId` is **not** for generating [keys in a list](/docs/lists-and-keys.html#keys). Keys should be generated from your data.

#### useTransition {#usetransition}

`useTransition` 和 `startTransition` 让你把一些状态更新标记为不紧急。其他状态更新在默认情况下被认为是紧急的。React 将允许紧急的状态更新（例如，更新一个文本输入）中断非紧急的状态更新（例如，渲染一个搜索结果列表）。[参阅文档](/docs/react-reference.html#usetransition)

#### useDeferredValue {#usedeferredvalue}

`useDeferredValue` 让你推迟重新渲染树的非紧急部分。它类似于 debounce，但与之相比有一些优势。它没有固定的时间延迟，React 会在第一次渲染反映在屏幕后立即尝试延迟渲染。延迟渲染是可中断的，它不会阻塞用户输入。[参阅文档](/docs/hooks-reference.html#usedeferredvalue)。

#### useSyncExternalStore {#usesyncexternalstore}

`useSyncExternalStore` 是一个新的 Hook，它允许外部存储支持并发读取，通过强制更新到 store 以同步。在实现对外部数据源的订阅时，它消除了对 useEffect 的需求，并被推荐给任何与 React 外部状态集成的库。[参阅文档](/docs/hooks-reference.html#usesyncexternalstore)。

> 注意
>
> `useSyncExternalStore` 旨在供库使用，而不是应用程序代码。

#### useInsertionEffect {#useinsertioneffect}

`useInsertionEffect` 是一个新的 Hook ，允许 CSS-in-JS 库解决在渲染中注入样式的性能问题。除非你已经建立了一个 CSS-in-JS 库，否则我们不希望你使用它。这个 Hook 将在 DOM 被变更后运行，但在 layout effect 读取新布局之前。这解决了一个在 React 17 及以下版本中已经存在的问题，但在 React 18 中更加重要，因为 React 在并发渲染时向浏览器让步，给它一个重新计算布局的机会。[参阅文档](/docs/hooks-reference.html#useinsertioneffect)。

> 注意
>
> `useInsertionEffect` 旨在供库使用，而不是应用程序代码。

## 如何升级 {#how-to-upgrade}

请参阅 [如何升级到 React 18](https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html) 以获取分步说明和完整的中断列表和值得注意的变化。

## 更新日志 {#changelog}

### React {#react}

* 添加 `useTransition` 和 `useDeferredValue` 将紧急更新与过渡分开。（[#10426](https://github.com/facebook/react/pull/10426)，[#10715](https://github.com/facebook/react/pull/10715)，[#15593](https://github.com/facebook/react/pull/15593)，[#15272](https://github.com/facebook/react/pull/15272)，[#15578](https://github.com/facebook/react/pull/15578)，[#15769](https://github.com/facebook/react/pull/15769)，[#17058](https://github.com/facebook/react/pull/17058)，[#18796](https://github.com/facebook/react/pull/18796)，[#19121](https://github.com/facebook/react/pull/19121)，[#19703](https://github.com/facebook/react/pull/19703)，[#19719](https://github.com/facebook/react/pull/19719)，[#19724](https://github.com/facebook/react/pull/19724)，[#20672](https://github.com/facebook/react/pull/20672)，[#20976](https://github.com/facebook/react/pull/20976) 由 [@acdlite](https://github.com/acdlite)，[@lunaruan](https://github.com/lunaruan)，[@rickhanlonii](https://github.com/rickhanlonii)，和 [@sebmarkbage](https://github.com/sebmarkbage)）
* 添加 `useId` 用于生成唯一 ID。（[#17322](https://github.com/facebook/react/pull/17322)，[#18576](https://github.com/facebook/react/pull/18576)，[#22644](https://github.com/facebook/react/pull/22644)，[#22672](https://github.com/facebook/react/pull/22672)，[#21260](https://github.com/facebook/react/pull/21260) 由 [@acdlite](https://github.com/acdlite)，[@lunaruan](https://github.com/lunaruan)，和 [@sebmarkbage](https://github.com/sebmarkbage)）
* 添加 `useSyncExternalStore` 以帮助外部存储库与 React 集成。（[#15022](https://github.com/facebook/react/pull/15022)，[#18000](https://github.com/facebook/react/pull/18000)，[#18771](https://github.com/facebook/react/pull/18771)，[#22211](https://github.com/facebook/react/pull/22211)，[#22292](https://github.com/facebook/react/pull/22292)，[#22239](https://github.com/facebook/react/pull/22239)，[#22347](https://github.com/facebook/react/pull/22347)，[#23150](https://github.com/facebook/react/pull/23150) by [@acdlite](https://github.com/acdlite)，[@bvaughn](https://github.com/bvaughn)，和 [@drarmstr](https://github.com/drarmstr)）
* 添加 `startTransition` 作为 `useTransition` 的一个版本，不需要等待反馈。（[#19696](https://github.com/facebook/react/pull/19696) 由 [@rickhanlonii](https://github.com/rickhanlonii)）
* 添加 `useInsertionEffect` 用于 CSS-in-JS 库。（[#21913](https://github.com/facebook/react/pull/21913) 由 [@rickhanlonii](https://github.com/rickhanlonii)）
* 当内容重新出现时，使 Suspense 重新装载 layout effect。（[#19322](https://github.com/facebook/react/pull/19322)，[#19374](https://github.com/facebook/react/pull/19374)，[#19523](https://github.com/facebook/react/pull/19523)，[#20625](https://github.com/facebook/react/pull/20625)，[#21079](https://github.com/facebook/react/pull/21079) by [@acdlite](https://github.com/acdlite)，[@bvaughn](https://github.com/bvaughn)，和 [@lunaruan](https://github.com/lunaruan)）
* 使 `<StrictMode>` 重新运行 effect 以检查可恢复的状态。（[#19523](https://github.com/facebook/react/pull/19523) ，[#21418](https://github.com/facebook/react/pull/21418) 由 [@bvaughn](https://github.com/bvaughn) 和 [@lunaruan](https://github.com/lunaruan)）
* 假设 Symbols 总是可用的。（[#23348](https://github.com/facebook/react/pull/23348) 由 [@sebmarkbage](https://github.com/sebmarkbage)）
* 移除 `object-assign` polyfill。（[#23351](https://github.com/facebook/react/pull/23351) 由 [@sebmarkbage](https://github.com/sebmarkbage)）
* 移除不支持的 `unstable_changedBits` API。（[#20953](https://github.com/facebook/react/pull/20953) 由 [@acdlite](https://github.com/acdlite)）
* 允许组件渲染 undefined。（[#21869](https://github.com/facebook/react/pull/21869) 由 [@rickhanlonii](https://github.com/rickhanlonii)）
* 从个别事件（如点击），同步送出 `useEffect` 结果。（[#21150](https://github.com/facebook/react/pull/21150) 由 [@acdlite](https://github.com/acdlite)）
* Suspense `fallback={undefined}` 现在与 `null` 的行为相同，不会被忽略。（[#21854](https://github.com/facebook/react/pull/21854) 由 [@rickhanlonii](https://github.com/rickhanlonii)）
* 考虑所有 `lazy()` 解析为相同的等效组件。（[#20357](https://github.com/facebook/react/pull/20357) 由 [@sebmarkbage](https://github.com/sebmarkbage)）
* 首次渲染时不要 patch 控制台。（[#22308](https://github.com/facebook/react/pull/22308) 由 [@lunaruan](https://github.com/lunaruan)）
* 提高内存利用率。（[#21039](https://github.com/facebook/react/pull/21039) 由 [@bgirard](https://github.com/bgirard)）
* 如果字符串强制抛出（Temporal.*，Symbol，等），改进提示信息（[#22064](https://github.com/facebook/react/pull/22064) 由 [@justingrant](https://github.com/justingrant)）
* 使用 `setImmediate` 当它在 `MessageChannel` 上可用时。（[#20834](https://github.com/facebook/react/pull/20834) 由 [@gaearon](https://github.com/gaearon)）
* 修复上下文无法在挂起的树内传播。（[#23095](https://github.com/facebook/react/pull/23095) 由 [@gaearon](https://github.com/gaearon)）
* 通过移除紧急处理机制，修复 `useReducer` 观察到不正确的参数。（[#22445](https://github.com/facebook/react/pull/22445) 由 [@josephsavona](https://github.com/josephsavona)）
* 修复 Safari 在追加 iframe 时忽略 `setState` 的问题。（[#23111](https://github.com/facebook/react/pull/23111) 由 [@gaearon](https://github.com/gaearon)）
* 修复在树中渲染 `ZonedDateTime` 时的崩溃。（[#20617](https://github.com/facebook/react/pull/20617) 由 [@dimaqq](https://github.com/dimaqq)）
* 修复在测试中文档被设置为 `null` 时的崩溃问题。（[#22695](https://github.com/facebook/react/pull/22695) 由 [@SimenB](https://github.com/SimenB)）
* 修复 `onLoad` 在开启并发特性时不触发的问题。（[#23316](https://github.com/facebook/react/pull/23316) 由 [@gnoff](https://github.com/gnoff)）
* 修复选择器返回 `NaN` 时的警告。（[#23333](https://github.com/facebook/react/pull/23333) 由 [@hachibeeDI](https://github.com/hachibeeDI)）
* 修复在测试中文档被设置为 `null` 时的崩溃问题。（[#22695](https://github.com/facebook/react/pull/22695) by [@SimenB](https://github.com/SimenB)）
* 修复生成的 License 头。（[#23004](https://github.com/facebook/react/pull/23004) 由 [@vitaliemiron](https://github.com/vitaliemiron)）
* 添加 `package.json` 作为入口点之一。（[#22954](https://github.com/facebook/react/pull/22954) 由 [@Jack](https://github.com/Jack-Works)）
* 允许在 Suspense 边界外挂起。（[#23267](https://github.com/facebook/react/pull/23267) 由 [@acdlite](https://github.com/acdlite)）
* 每当 hydrate 失败时记录一个可恢复的错误。（[#23319](https://github.com/facebook/react/pull/23319) 由 [@acdlite](https://github.com/acdlite)）

### React DOM {#react-dom}

* 添加 `createRoot` 和 `hydrateRoot`。（[#10239](https://github.com/facebook/react/pull/10239)，[#11225](https://github.com/facebook/react/pull/11225)，[#12117](https://github.com/facebook/react/pull/12117)，[#13732](https://github.com/facebook/react/pull/13732)，[#15502](https://github.com/facebook/react/pull/15502)，[#15532](https://github.com/facebook/react/pull/15532)，[#17035](https://github.com/facebook/react/pull/17035)，[#17165](https://github.com/facebook/react/pull/17165)，[#20669](https://github.com/facebook/react/pull/20669)，[#20748](https://github.com/facebook/react/pull/20748)，[#20888](https://github.com/facebook/react/pull/20888)，[#21072](https://github.com/facebook/react/pull/21072)，[#21417](https://github.com/facebook/react/pull/21417)，[#21652](https://github.com/facebook/react/pull/21652)，[#21687](https://github.com/facebook/react/pull/21687)，[#23207](https://github.com/facebook/react/pull/23207)，[#23385](https://github.com/facebook/react/pull/23385) by [@acdlite](https://github.com/acdlite)，[@bvaughn](https://github.com/bvaughn)，[@gaearon](https://github.com/gaearon)，[@lunaruan](https://github.com/lunaruan)，[@rickhanlonii](https://github.com/rickhanlonii)，[@trueadm](https://github.com/trueadm)，和 [@sebmarkbage](https://github.com/sebmarkbage)）
* 添加选择性 hydrate。（[#14717](https://github.com/facebook/react/pull/14717)，[#14884](https://github.com/facebook/react/pull/14884)，[#16725](https://github.com/facebook/react/pull/16725)，[#16880](https://github.com/facebook/react/pull/16880)，[#17004](https://github.com/facebook/react/pull/17004)，[#22416](https://github.com/facebook/react/pull/22416)，[#22629](https://github.com/facebook/react/pull/22629)，[#22448](https://github.com/facebook/react/pull/22448)，[#22856](https://github.com/facebook/react/pull/22856)，[#23176](https://github.com/facebook/react/pull/23176) by [@acdlite](https://github.com/acdlite)，[@gaearon](https://github.com/gaearon)，[@salazarm](https://github.com/salazarm)，和 [@sebmarkbage](https://github.com/sebmarkbage)）
* 在已知的 ARIA 属性列表中增加 `aria-description`。（[#22142](https://github.com/facebook/react/pull/22142) 由 [@mahyareb](https://github.com/mahyareb)）
* 为 video 元素添加 `onResize` 事件。（[#21973](https://github.com/facebook/react/pull/21973) 由 [@rileyjshaw](https://github.com/rileyjshaw)）
* 将 `imageSizes` 和 `imageSrcSet` 添加到已知属性中。（[#22550](https://github.com/facebook/react/pull/22550) 由 [@eps1lon](https://github.com/eps1lon)）
* 若提供了 `value`，允许非字符串 `<option>` 子元素。（[#21431](https://github.com/facebook/react/pull/21431) 由 [@sebmarkbage](https://github.com/sebmarkbage)）
* 修复 `aspectRatio` 样式未被应用的问题。（[#21100](https://github.com/facebook/react/pull/21100) 由 [@gaearon](https://github.com/gaearon)）
* 若 `renderSubtreeIntoContainer` 被调用，发出警告。（[#23355](https://github.com/facebook/react/pull/23355) 由 [@acdlite](https://github.com/acdlite)）

### React DOM Server {#react-dom-server-1}

* 添加新的流式渲染器。（[#14144](https://github.com/facebook/react/pull/14144)，[#20970](https://github.com/facebook/react/pull/20970)，[#21056](https://github.com/facebook/react/pull/21056)，[#21255](https://github.com/facebook/react/pull/21255)，[#21200](https://github.com/facebook/react/pull/21200)，[#21257](https://github.com/facebook/react/pull/21257)，[#21276](https://github.com/facebook/react/pull/21276)，[#22443](https://github.com/facebook/react/pull/22443)，[#22450](https://github.com/facebook/react/pull/22450)，[#23247](https://github.com/facebook/react/pull/23247)，[#24025](https://github.com/facebook/react/pull/24025)，[#24030](https://github.com/facebook/react/pull/24030) by [@sebmarkbage](https://github.com/sebmarkbage)）
* 修复 SSR 中的上下文提供者在处理多个请求时的问题。（[#23171](https://github.com/facebook/react/pull/23171) 由 [@frandiox](https://github.com/frandiox)）
* 文本不匹配时恢复到客户端渲染。（[#23354](https://github.com/facebook/react/pull/23354) 由 [@acdlite](https://github.com/acdlite)）
* 弃用 `renderToNodeStream`。（[#23359](https://github.com/facebook/react/pull/23359) 由 [@sebmarkbage](https://github.com/sebmarkbage)）
* 修复新服务端渲染器中一个有误的错误日志。（[#24043](https://github.com/facebook/react/pull/24043) 由 [@eps1lon](https://github.com/eps1lon)）
* 修复新服务端渲染器中的一个错误。（[#22617](https://github.com/facebook/react/pull/22617) 由 [@shuding](https://github.com/shuding)）
* 忽略服务端自定义元素内的函数和符号值。（[#21157](https://github.com/facebook/react/pull/21157) 由 [@sebmarkbage](https://github.com/sebmarkbage)）

### React DOM Test Utils {#react-dom-test-utils}

* 在生产环境使用 `act` 时抛出错误。（[#21686](https://github.com/facebook/react/pull/21686) 由 [@acdlite](https://github.com/acdlite)）
* 支持使用 `global.IS_REACT_ACT_ENVIRONMENT` 禁用 act 警告。（[#22561](https://github.com/facebook/react/pull/22561) 由 [@acdlite](https://github.com/acdlite)）
* 扩大 act 警告，以覆盖所有可能预计 React 工作的 API。（[#22607](https://github.com/facebook/react/pull/22607) 由 [@acdlite](https://github.com/acdlite)）
* 使 `act` 批量更新。（[#21797](https://github.com/facebook/react/pull/21797) 由 [@acdlite](https://github.com/acdlite)）
* 移除对被挂起的 effect 的警告。（[#22609](https://github.com/facebook/react/pull/22609) 由 [@acdlite](https://github.com/acdlite)）

### React Refresh {#react-refresh}

* 在快速刷新中跟踪后期装载的 root。（[#22740](https://github.com/facebook/react/pull/22740) 由 [@anc95](https://github.com/anc95)）
* 在 `package.json` 中添加 `exports` 字段。（[#23087](https://github.com/facebook/react/pull/23087) 由 [@otakustay](https://github.com/otakustay)）

### Server Components (Experimental) {#server-components-experimental}

* 增加服务端上下文支持。（[#23244](https://github.com/facebook/react/pull/22739) 由 [@salazarm](https://github.com/salazarm)）
* 增加对 `lazy` 的支持。（[#24068](https://github.com/facebook/react/pull/24068) 由 [@gnoff](https://github.com/gnoff)）
* 更新 webpack 插件以支持 webpack 5（[#22739](https://github.com/facebook/react/pull/22739) 由 [@michenly](https://github.com/michenly)）
* 修正节点加载器中的一个错误。（[#22537](https://github.com/facebook/react/pull/22537) 由 [@btea](https://github.com/btea)）
* 在边缘环境中使用 `globalThis` 而不是 `window`。（[#22777](https://github.com/facebook/react/pull/22777) 由 [@huozhi](https://github.com/huozhi)）
