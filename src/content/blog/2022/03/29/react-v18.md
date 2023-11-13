---
title: "React v18.0"
---

2022 年 3 月 29 日，由 [React 团队](/community/team) 发布

---

<Intro>

React 18 现在可以在 npm 上使用啦！在我们的上一篇文章里，我们分享了 [将你的应用更新到 React 18](/blog/2022/03/08/react-18-upgrade-guide) 的每一个步骤。在这片文章里，我们将会概述 React 18 究竟有哪些更新，以及这些更新对于未来的意义。

</Intro>

---

我们最新的主要版本包含了开箱即用的改进，如自动批处理、`startTransition` 等新 API，以及支持 Suspense 的流式服务端渲染。

React 18 的许多新功能都建立在新推出的并发渲染特性之上，也就是一种解锁全新能力的底层变动。并发模式 React 是选择性启用的——只有当你使用了一个并发功能的时候才会开启——但是我们认为它将会对人们构建应用的方式产生巨大的影响。

我们花了很多年时间来研发 React 的并发渲染，同时我们也还考虑为现有用户提供一种过渡的路径。去年夏天，[我们成立了 React 18 工作组](/blog/2021/06/08/the-plan-for-react-18) 来收集社区专家们的反馈信息，保证整个 React 生态都能有一个丝滑的升级体验。

如果你忘了，我们在 React 大会 2021 上公开提出了这个愿景：

* 在 [摘要](https://www.youtube.com/watch?v=FZ0cG47msEk&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa) 中，我们解释了 React 18 为什么能够实现让开发者创造更好的用户体验这一使命。
* [Shruti Kapoor](https://twitter.com/shrutikapoor08) [示范了如何使用 React 18 中的新功能](https://www.youtube.com/watch?v=ytudH8je5ko&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa&index=2)。
* [Shaundai Person](https://twitter.com/shaundai) 为我们大概介绍了 [支持 Suspense 的流式服务端渲染](https://www.youtube.com/watch?v=pj5N-Khihgc&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa&index=3)。

以下是一个在此版本中对需要关注的内容的总结，先从并发渲染开始介绍。

<Note>

对于 React Native 用户而言，React 18 将会伴随新的 React Native 体系结构发布。想了解更多信息，可以阅读 [React Conf 摘要](https://www.youtube.com/watch?v=FZ0cG47msEk&t=1530s)。

</Note>

## 什么是并发 React？ {/*what-is-concurrent-react*/}

React 18 中最重要的更新内容是我们希望你永远不会考虑的：并发。我们认为这对于应用开发者而言是一件非常好的事情，尽管这对于库的维护者来说可能有点复杂。

并发渲染本身并不是一个功能。它是一个新的底层机制，使得 React 能够同时准备多个版本的 UI。你可以把并发视为一种底层实现的细节——它解锁了许多新功能因而非常有价值。React 在底层实现上使用了非常复杂的技术，如优先队列和多级缓冲。但是你不会在任何公共 API 中感知到这些。

在设计 API 时，我们刻意隐藏了实现细节。作为一名 React 开发者，你只需要关注视图是 **什么** 样子，然后由 React 来处理 **如何** 来实现，所以我们不需要 React 开发者了解并发的底层运行原理。

不过，并发模式 React 比典型的实现细节更重要──它是 React 核心渲染模型的基础性更新。因此，尽管了解并发渲染底层工作原理不是很重要，但如果是为了追求更高的技术层次，倒是值得去了解它。

并发模式的一个关键特性是渲染可中断。当首次升级到 React 18，在加入任何并发功能之前，更新内容渲染的方式和 React 之前的版本一样——通过一个单一的且不可中断的同步事务进行处理。同步渲染意味着，一旦开始渲染就无法中断，直到用户可以在屏幕上看到渲染结果。

在并发渲染中，情况并不总是如此。React 可能开始渲染一个更新，然后中途挂起，稍后又继续。它甚至可能完全放弃一个正在进行的渲染。React 保证即使渲染被中断，UI 也会保持一致。为了实现这一点，它会在整个 DOM 树被计算完毕前一直等待，完毕后再执行 DOM 变更。这样做，React 就可以在后台提前准备新的屏幕内容，而不阻塞主线程。这意味着用户输入可以被立即响应，即使存在大量渲染任务，也能有流畅的用户体验。

另一个例子是可重用状态。并发 React 可以从屏幕中移除部分 UI，然后在稍后将它们再添加回来，并重用之前的状态。例如，当用户来回切换标签页，React 应该能够立即将屏幕恢复到它先前的状态。在即将到来的次要版本中，我们计划添加一个新的名为 `<Offscreen>` 的组件，它实现了这种模式。同样地，你将能够使用 Offscreen 在后台准备新的 UI，在显示前就准备完毕以便快速响应。

并发渲染是一个 React 中非常强大的工具，并且我们大多数新功能都是利用了它的优势来创建的，包括 Suspense，transition 和流式服务端渲染。但是在并发渲染这个方向，React 18 也仅仅只是实现我们最终目标的第一步。

## 渐进式采用并发特性 {/*gradually-adopting-concurrent-features*/}

从技术上讲，并发渲染是一个破坏性变更。因为并发渲染是可中断的，因此在并发模式下组件的行为会略微不同。

在我们的测试过程中，我们已经把几千个组件更新到了 React 18。我们发现，几乎所有现有的组件都能在并发渲染下“正常工作”。然而部分组件可能需要一些额外的迁移工作。这种变化通常很小，你仍然可以按照自己的节奏进行使用。React 18 中的新渲染行为 **只在你的应用中使用新功能的部分启用**。

整体的升级策略是使你的应用基于 React 18 运行而不用破坏现存的代码，然后你可以渐进地按照你的节奏开始添加并发功能。你可以在开发环境中使用 [`<StrictMode>`](/reference/react/StrictMode) 以利于暴露并发模式相关的问题。严格模式是不影响生产环境的，但是在开发环境中它将会记录额外的警告日志，并且被视为幂等的函数将被调用两次。这没办法捕获所有异常，但是能够有效预防大部分常见的错误类型。

在升级到 React 18 后，可以立即开始使用并发模式的功能。例如，你可以使用 `startTransition` 在屏幕内容之间进行导航，而不会阻塞用户输入；或者使用 `useDeferredValue` 来节流处理开销巨大的重新渲染。

长远来看，我们希望你在应用中添加并发渲染能力的主要方式是，使用支持并发渲染的库或者框架。在大多数情况中，你不用与并发模式的 API 直接交互。例如，在导航到一个新的屏幕时，开发者无需调用 `startTransition`，路由库会自动将导航操作包裹在 `startTransition` 中。

这些库升级到兼容并发模式可能需要一些时间。我们已经提供了新的 API，使这些库更容易利用并发功能。同时，在我们努力逐步迁移 React 生态系统的过程中，请对维护者保持耐心。

如果想了解更多信息，可以查看我们之前的文章：[如何升级到 React 18](/blog/2022/03/08/react-18-upgrade-guide)。

## 数据框架中的 Suspense {/*suspense-in-data-frameworks*/}

在 React 18 中，你可以在 Relay，Next.js，Hydrogen 或者 Remix 等框架中获取数据。临时使用 [Suspense](/reference/react/Suspense) 获取数据在技术上是可行的，但是不建议作为一般方案。

在未来，我们可能会暴露更多原语，使你能用 `Suspense` 更容易地获取数据，那时也就不一定必须要使用某个的框架。不过，Suspense 被深度整合到你的应用结构中时能产生最好的效果：你的路由，你的数据层，你的服务端渲染环境。因此我们预计，即使在未来相当长一段时间里，库和框架也还会在 React 生态中发挥关键作用。

就像在过去的 React 的版本中，你总是可以使用 Suspense 与客户端侧的 `React.lazy` 配合进行代码分割。但是我们的对 Suspense 的期望并不仅仅是加载代码——最终的目标是扩展对 Suspense 的支持，以至于相同的声明式 Suspense 后备方案能够处理任何异步操作（加载代码，数据，图片等）。

## 服务器组件仍在开发中 {/*server-components-is-still-in-development*/}

[**服务器组件**](/blog/2020/12/21/data-fetching-with-react-server-components) 是一个即将到来的功能，允许开发者构建跨越服务端和客户端的应用，结合客户端应用丰富的交互性和传统服务端渲染的优良性能，服务器组件和并发模式 React 并不是强耦合的，但是它设计的初衷就是为了配合 Suspense 和流式服务端渲染这样的并发功能。

服务器组件仍然是实验性的，但是我们预计会在 18.x 的一个小版本中正式发布。同时，我们正在与 Next.js，Hydrogen 和 Remix 等框架合作，以推进提案，并使其准备好被广泛采用。

## React 18 的新内容 {/*whats-new-in-react-18*/}

### 新功能：自动批处理 {/*new-feature-automatic-batching*/}

批处理是指，当 React 在一个单独的重渲染事件中批量处理多个状态更新以此实现优化性能。如果没有自动批处理的话，我们仅能够在 React 事件处理程序中批量更新。在 React 18 之前，默认情况下 `promise`、`setTimeout`、原生应用的事件处理程序以及任何其他事件中的更新都不会被批量处理；但现在，这些更新内容都会被自动批处理：


```js
// 以前: 只有 React 事件会被批处理。
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React 会渲染两次，每次更新一个状态（没有批处理）
}, 1000);

// 现在: 超时，promise，本机事件处理程序
// 原生应用时间处理程序或者任何其他时间都被批处理了
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // 最终，React 将仅会重新渲染一次（这就是批处理！）
}, 1000);
```

想要了解更多信息，可以阅读 [React 18 中能减少渲染次数的自动批处理机制](https://github.com/reactwg/react-18/discussions/21)。

### 新功能：过渡更新 {/*new-feature-transitions*/}

过渡（transition）更新是 React 中一个新的概念，用于区分紧急和非紧急的更新。

* **紧急更新** 对应直接的交互，如输入，点击，按压等。
* **过渡更新** 将 UI 从一个视图过渡到另一个。

像输入，点击，按压等紧急更新，需要立刻响应以符合人们对物理对象行为的预期。否则，他们就会觉得“不对劲”。但是，过渡更新不太一样，因为用户对感知到屏幕上的每一个中间值这件事是没有预期的。

举个例子，当我们在一个下拉菜单中选择了一个过滤器，你期望的是这个过滤器按钮在你点击的时候立即就能响应。然而，实际结果可能是不连贯的过渡。这样一个较短的延迟是难以察觉的，而且这往往也是能符合预期的。并且如果你在渲染完成之前，再次改变了过滤器，你需要关心的其实只是最新的结果。

通常情况下，为了更好的用户体验，一个用户输入应该同时产生一个紧急更新和一个过渡更新。你可以在一个输入事件中使用 `startTransition` API 告诉 React 哪些更新是紧急更新，哪些又是过渡更新：


```js
import { startTransition } from 'react';

// 紧急更新: 显示输入的内容
setInputValue(input);

// 将任何内部的状态更新都标记为过渡更新
startTransition(() => {
  // 过渡更新: 展示结果
  setSearchQuery(input);
});
```


被包裹在 `startTransition` 中的更新会被处理为过渡更新，如果有紧急更新出现，比如点击或者按键，则会中断过渡更新。如果一个过渡更新被用户中断（比如，快速输入多个字符），React 将会抛弃未完成的渲染结果，然后仅渲染最新的内容。


* `useTransition`： 一个用于开启过渡更新的 Hook，用于跟踪待定转场状态。
* `startTransition`： 当 Hook 不能使用时，用于开启过渡的方法。

并发渲染中将会加入过渡更新，允许更新被中断。如果更新内容被重新挂起，过渡机制也会告诉 React 在后台渲染过渡内容时继续展示当前内容（查看 [Suspense 意见征求](https://github.com/reactjs/rfcs/blob/main/text/0213-suspense-in-react-18.md) 了解更多信息）。

[更多内容请参阅 transition 相关的文档](/reference/react/useTransition)。

### 新的 Suspense 特性 {/*new-suspense-features*/}

Suspense 允许你声明式地为一部分还没有准备好被展示的组件树指定加载状态：

```js
<Suspense fallback={<Spinner />}>
  <Comments />
</Suspense>
```

Suspense 使得“UI 加载状态”成为了 React 编程模型中最高级的声明式概念。我们基于此能够构建更高级的功能。

几年前，我们推出了一个受限制版的 Suspense。但是唯一支持的场景就是用 `React.lazy` 拆分代码，而且在服务端渲染时完全没有作用。

在 React 18 中，我们已经支持了服务端 Suspense，并且使用并发渲染特性扩展了其功能。

React 18 中的 Suspense 在与 transition API 结合时效果最好。如果你在 transition 期间挂起，React 不会让已显示的内容被后备方案取代。相反，React 会延迟渲染，直到有足够的数据，以防止出现加载状态错误。

更多内容参见 [React 18 中的 Suspense](https://github.com/reactjs/rfcs/blob/main/text/0213-suspense-in-react-18.md) 的意见征求。

### 新的客户端和服务端渲染 APIs {/*new-client-and-server-rendering-apis*/}

我们利用这次版本更新的机会，重新设计了我们为在客户端和服务端进行渲染所暴露的 API。这些更改允许用户在升级到 React 18 使用新的 API 时，也能继续使用 React 17 中的旧 API。

#### React DOM Client {/*react-dom-client*/}

这些新的 API 现在可以从 `react-dom/client` 中导出：

* `createRoot`：为 `render` 或者 `unmount` 创建根节点的新方法。请用它替代 `ReactDOM.render`。如果没有它，React 18 中的新功能就无法生效。
* `hydrateRoot`：hydrate 服务端渲染的应用的新方法。使用它来替代 `ReactDOM.hydrate` 与新的 React DOM 服务端 API 一起使用。如果没有它，React 18 中的新功能就无法生效。

`createRoot` 和 `hydrateRoot` 都能接受一个新的可选参数叫做 `onRecoverableError`，它能在 React 在渲染或者 hydrate 过程发生错误后又恢复时，做日志记录对你进行通知。默认情况下，React 会使用 [`reportError`](https://developer.mozilla.org/en-US/docs/Web/API/reportError)，如果在老旧版本浏览器中，则会使用 `console.error`。


[参阅 React DOM Client 的文档](/reference/react-dom/client)。

#### React DOM Server {/*react-dom-server*/}

这些新的 API 现在可以从 `react-dom/server` 中导出，并且在服务端端完全支持流式 Suspense：

* `renderToPipeableStream`：用于 Node 环境中的流式渲染。
* `renderToReadableStream`：对新式的非主流运行时环境，比如 Deno 和 Cloudflare workers。

现有的 `renderToString` 方法仍然可以使用，但是并不推荐这样做。

[参阅 React DOM Server 的文档](/reference/react-dom/server)。
### 新的严格模式行为 {/*new-strict-mode-behaviors*/}

在未来，我们希望新增一个功能，允许 React 在保留状态的同时添加和移除 UI。例如，当一个用户标签页切出又切回时，React 应该能够立即将之前的页面内容恢复到它先前的状态。为了实现这一点，React 将在卸载后又重新挂载组件树时，复用之前的状态。

这个功能将给 React 应用带来更好的开箱即用能力，但要求组件能够灵活应对多次安装和销毁的副作用。对于大多数副作用不需要任何改动也依然能够生效，但是部分副作用需要保证它们只进行一次挂载或销毁。

为了利于暴露这些问题，React 18 为严格模式下的开发环境引入了一个新的检查机制。每当组件第一次挂载时，这个检查机制将自动卸载又重新挂载每个组件，并在第二次挂载时复用先前的状态。

在这个变更之前，React 是在挂载组件时产生一些副作用：

```
* React 装载组件
  * layout effect 创建
  * effect 创建
```


在 React 18 的严格模式下，React 在开发模式下将会模拟组件的卸载和挂载：

```
* React 挂载组件
  * layout effect 创建
  * effect 创建
* React 模拟卸载组件
  * layout effect 销毁
  * effect 销毁
* React 模拟挂载组件，并复用之前的状态
  * layout effect 创建
  * effect 创建
```

[参阅确保状态可复用的文档](/reference/react/StrictMode#fixing-bugs-found-by-re-running-effects-in-development)。

### 新的 Hook {/*new-hooks*/}

#### useId {/*useid*/}

`useId` 是一个新的Hook，用于生成在客户端和服务端两侧都独一无二的 id，避免 hydrate 后两侧内容不匹配。它主要用于需要唯一 id 的，具有集成 API 的组件库。这个更新不仅解决了一个在 React 17 及更低版本中的存在的问题，而且它会在 React 18 中发挥更重要的作用，因为新的流式服务端渲染响应 HTML 的方式将是无序的，需要独一无二的 id 作为索引。[参阅文档](/reference/react/useId)。

> Note
>
> `useId` **不是** 为了生成 [列表中的 key](/learn/rendering-lists#where-to-get-your-key)。key 应该根据你的数据生成。

#### useTransition {/*usetransition*/}

`useTransition` 和 `startTransition` 让你能够将一些状态更新标记为过渡更新。默认情况下，状态更新都被视为紧急更新。React 将允许紧急更新（例如，更新一个文本输入内容）打断过渡更新（例如，渲染一个搜索结果列表）。[参阅文档](/reference/react/useTransition)。

#### useDeferredValue {/*usedeferredvalue*/}

`useDeferredValue` 允许推迟渲染树的非紧急更新。这和防抖操作非常相似，但是有一些改进。它没有固定的延迟时间，React 会在第一次渲染在屏幕上出现后立即尝试延迟渲染。延迟渲染是可中断的，它不会阻塞用户输入。[参阅文档](/reference/react/useDeferredValue)。

#### useSyncExternalStore {/*usesyncexternalstore*/}

`useSyncExternalStore` 是一个新的 Hook，允许使用第三方状态管理来支持并发模式，并且能通过对 store 进行强制更新实现数据同步。对第三方数据源的订阅能力的实现上，消除了对 `useEffect` 的依赖，推荐任何 React 相关的第三方状态管理库使用这个新特性。[参阅文档](/reference/react/useSyncExternalStore)。

> Note
>
> `useSyncExternalStore` 旨在供库使用，而不是应用程序代码。

#### useInsertionEffect {/*useinsertioneffect*/}

`useInsertionEffect` 是一个新的 Hook ，允许 CSS-in-JS 库解决在渲染中注入样式的性能问题。除非你已经建立了一个 CSS-in-JS 库，否则我们不希望你使用它。这个 Hook 将在 DOM 变更发生后，在 layout effect 获取新布局之前运行。这个功能不仅解决了一个在 React 17 及以下版本中已经存在的问题，而且在 React 18 中更加重要，因为 React 在并发渲染时会为浏览器让步，给它一个重新计算布局的机会。[参阅文档](/reference/react/useInsertionEffect)。

> Note
>
> `useInsertionEffect` 旨在供库使用，而不是应用程序代码。

## 如何更新 {/*how-to-upgrade*/}

请参阅 [如何升级到 React 18](/blog/2022/03/08/react-18-upgrade-guide) 以获取分步说明和完整的中断列表以及值得注意的变化。

## 修改日志 {/*changelog*/}

### React {/*react*/}

* 添加 `useTransition` 和 `useDeferredValue` 以将紧急更新和过渡更新分开。([#10426](https://github.com/facebook/react/pull/10426)，[#10715](https://github.com/facebook/react/pull/10715)，[#15593](https://github.com/facebook/react/pull/15593)，[#15272](https://github.com/facebook/react/pull/15272)，[#15578](https://github.com/facebook/react/pull/15578)，[#15769](https://github.com/facebook/react/pull/15769)，[#17058](https://github.com/facebook/react/pull/17058)，[#18796](https://github.com/facebook/react/pull/18796)，[#19121](https://github.com/facebook/react/pull/19121)，[#19703](https://github.com/facebook/react/pull/19703)，[#19719](https://github.com/facebook/react/pull/19719)，[#19724](https://github.com/facebook/react/pull/19724)，[#20672](https://github.com/facebook/react/pull/20672)，[#20976](https://github.com/facebook/react/pull/20976) [@acdlite](https://github.com/acdlite)，[@lunaruan](https://github.com/lunaruan)，[@rickhanlonii](https://github.com/rickhanlonii)，and [@sebmarkbage](https://github.com/sebmarkbage))
* 添加 `useId` 用于生成唯一 ID。([#17322](https://github.com/facebook/react/pull/17322)，[#18576](https://github.com/facebook/react/pull/18576)，[#22644](https://github.com/facebook/react/pull/22644)，[#22672](https://github.com/facebook/react/pull/22672)，[#21260](https://github.com/facebook/react/pull/21260) [@acdlite](https://github.com/acdlite)，[@lunaruan](https://github.com/lunaruan)，and [@sebmarkbage](https://github.com/sebmarkbage))
* 添加 `useSyncExternalStore` 以帮助外部存储库与 React 集成。([#15022](https://github.com/facebook/react/pull/15022)，[#18000](https://github.com/facebook/react/pull/18000)，[#18771](https://github.com/facebook/react/pull/18771)，[#22211](https://github.com/facebook/react/pull/22211)，[#22292](https://github.com/facebook/react/pull/22292)，[#22239](https://github.com/facebook/react/pull/22239)，[#22347](https://github.com/facebook/react/pull/22347)，[#23150](https://github.com/facebook/react/pull/23150) [@acdlite](https://github.com/acdlite)，[@bvaughn](https://github.com/bvaughn)，and [@drarmstr](https://github.com/drarmstr))
* 添加 `startTransition` 作为 `useTransition` 的一个版本，不需要等待反馈。 ([#19696](https://github.com/facebook/react/pull/19696) [@rickhanlonii](https://github.com/rickhanlonii))
* 添加 `useInsertionEffect` 用于 CSS-in-JS 库。([#21913](https://github.com/facebook/react/pull/21913) [@rickhanlonii](https://github.com/rickhanlonii))
* 当内容重新出现时，使 Suspense 重新装载 layout effect。([#19322](https://github.com/facebook/react/pull/19322)，[#19374](https://github.com/facebook/react/pull/19374)，[#19523](https://github.com/facebook/react/pull/19523)，[#20625](https://github.com/facebook/react/pull/20625)，[#21079](https://github.com/facebook/react/pull/21079) [@acdlite](https://github.com/acdlite)，[@bvaughn](https://github.com/bvaughn)，and [@lunaruan](https://github.com/lunaruan))
* 使 `<StrictMode>` 重新运行 effect 以检查可恢复的状态。([#19523](https://github.com/facebook/react/pull/19523) ，[#21418](https://github.com/facebook/react/pull/21418) [@bvaughn](https://github.com/bvaughn) and [@lunaruan](https://github.com/lunaruan))
* 假设 `Symbols` 总是可用的。([#23348](https://github.com/facebook/react/pull/23348) [@sebmarkbage](https://github.com/sebmarkbage))
* 移除 `object-assign` polyfill。([#23351](https://github.com/facebook/react/pull/23351) [@sebmarkbage](https://github.com/sebmarkbage))
* 移除不支持的 `unstable_changedBits` API。([#20953](https://github.com/facebook/react/pull/20953) [@acdlite](https://github.com/acdlite))
* 允许组件渲染 undefined。([#21869](https://github.com/facebook/react/pull/21869) [@rickhanlonii](https://github.com/rickhanlonii))
* 从个别事件（如点击），同步送出 useEffect 结果。([#21150](https://github.com/facebook/react/pull/21150) [@acdlite](https://github.com/acdlite))
* Suspense `fallback={undefined}` 现在与 `null` 的行为相同，不会被忽略。([#21854](https://github.com/facebook/react/pull/21854) [@rickhanlonii](https://github.com/rickhanlonii))
* 考虑所有 `lazy()` 解析为相同的等效组件。([#20357](https://github.com/facebook/react/pull/20357) [@sebmarkbage](https://github.com/sebmarkbage))
* 首次渲染时不要 patch 控制台。([#22308](https://github.com/facebook/react/pull/22308) [@lunaruan](https://github.com/lunaruan))
* 提高内存利用率。([#21039](https://github.com/facebook/react/pull/21039) [@bgirard](https://github.com/bgirard))
* 如果字符串强制抛出（Temporal.*，Symbol，等），改进提示信息。([#22064](https://github.com/facebook/react/pull/22064) [@justingrant](https://github.com/justingrant))
*使用 setImmediate 当它在 MessageChannel 上可用时。([#20834](https://github.com/facebook/react/pull/20834) [@gaearon](https://github.com/gaearon))
* 修复上下文无法在挂起的树内传播。([#23095](https://github.com/facebook/react/pull/23095) [@gaearon](https://github.com/gaearon))
* 通过移除紧急处理机制，修复 `useReducer` 观察到不正确的参数。([#22445](https://github.com/facebook/react/pull/22445) [@josephsavona](https://github.com/josephsavona))
* 修复 Safari 在追加 iframe 时忽略 `setState` 的问题。([#23111](https://github.com/facebook/react/pull/23111) [@gaearon](https://github.com/gaearon))
* 修复在树中渲染 `ZonedDateTime` 时的崩溃。([#20617](https://github.com/facebook/react/pull/20617) [@dimaqq](https://github.com/dimaqq))
* 修复在测试中文档被设置为 `null` 时的崩溃问题。([#22695](https://github.com/facebook/react/pull/22695) [@SimenB](https://github.com/SimenB))
* 修复 onLoad 在开启并发特性时不触发的问题。([#23316](https://github.com/facebook/react/pull/23316) [@gnoff](https://github.com/gnoff))
* 修复选择器返回 `NaN` 时的警告。([#23333](https://github.com/facebook/react/pull/23333) [@hachibeeDI](https://github.com/hachibeeDI))
* 修复在测试中文档被设置为 `null` 时的崩溃问题。([#22695](https://github.com/facebook/react/pull/22695) [@SimenB](https://github.com/SimenB))
* 修复生成的 License 头。([#23004](https://github.com/facebook/react/pull/23004) [@vitaliemiron](https://github.com/vitaliemiron))
* 添加 `package.json` 作为入口点之一。 ([#22954](https://github.com/facebook/react/pull/22954) [@Jack](https://github.com/Jack-Works))
* 允许在 Suspense 边界外挂起。([#23267](https://github.com/facebook/react/pull/23267) [@acdlite](https://github.com/acdlite))
* 每当 hydrate 失败时记录一个可恢复的错误。([#23319](https://github.com/facebook/react/pull/23319) [@acdlite](https://github.com/acdlite))

### React DOM {/*react-dom*/}

* 添加 `createRoot` 和 `hydrateRoot`。([#10239](https://github.com/facebook/react/pull/10239)，[#11225](https://github.com/facebook/react/pull/11225)，[#12117](https://github.com/facebook/react/pull/12117)，[#13732](https://github.com/facebook/react/pull/13732)，[#15502](https://github.com/facebook/react/pull/15502)，[#15532](https://github.com/facebook/react/pull/15532)，[#17035](https://github.com/facebook/react/pull/17035)，[#17165](https://github.com/facebook/react/pull/17165)，[#20669](https://github.com/facebook/react/pull/20669)，[#20748](https://github.com/facebook/react/pull/20748)，[#20888](https://github.com/facebook/react/pull/20888)，[#21072](https://github.com/facebook/react/pull/21072)，[#21417](https://github.com/facebook/react/pull/21417)，[#21652](https://github.com/facebook/react/pull/21652)，[#21687](https://github.com/facebook/react/pull/21687)，[#23207](https://github.com/facebook/react/pull/23207)，[#23385](https://github.com/facebook/react/pull/23385) [@acdlite](https://github.com/acdlite)，[@bvaughn](https://github.com/bvaughn)，[@gaearon](https://github.com/gaearon)，[@lunaruan](https://github.com/lunaruan)，[@rickhanlonii](https://github.com/rickhanlonii)，[@trueadm](https://github.com/trueadm)，and [@sebmarkbage](https://github.com/sebmarkbage))
* 添加选择性 hydrate。([#14717](https://github.com/facebook/react/pull/14717)，[#14884](https://github.com/facebook/react/pull/14884)，[#16725](https://github.com/facebook/react/pull/16725)，[#16880](https://github.com/facebook/react/pull/16880)，[#17004](https://github.com/facebook/react/pull/17004)，[#22416](https://github.com/facebook/react/pull/22416)，[#22629](https://github.com/facebook/react/pull/22629)，[#22448](https://github.com/facebook/react/pull/22448)，[#22856](https://github.com/facebook/react/pull/22856)，[#23176](https://github.com/facebook/react/pull/23176) [@acdlite](https://github.com/acdlite)，[@gaearon](https://github.com/gaearon)，[@salazarm](https://github.com/salazarm)，and [@sebmarkbage](https://github.com/sebmarkbage))
* 在已知的 ARIA 属性列表中增加 `aria-description`。([#22142](https://github.com/facebook/react/pull/22142) [@mahyareb](https://github.com/mahyareb))
* 为 video 元素添加 `onResize` 事件。([#21973](https://github.com/facebook/react/pull/21973) [@rileyjshaw](https://github.com/rileyjshaw))
* 将 `imageSizes` 和 `imageSrcSet` 添加到已知属性中。([#22550](https://github.com/facebook/react/pull/22550) [@eps1lon](https://github.com/eps1lon))
* 若提供了 `value`，允许非字符串 `<option>` 子元素。  ([#21431](https://github.com/facebook/react/pull/21431) [@sebmarkbage](https://github.com/sebmarkbage))
* 修复 `aspectRatio` 样式未被应用的问题。 ([#21100](https://github.com/facebook/react/pull/21100) [@gaearon](https://github.com/gaearon))
* 若 `renderSubtreeIntoContainer` 被调用，发出警告。 ([#23355](https://github.com/facebook/react/pull/23355) [@acdlite](https://github.com/acdlite))

### React DOM Server {/*react-dom-server-1*/}

* 添加新的流式渲染器。([#14144](https://github.com/facebook/react/pull/14144)，[#20970](https://github.com/facebook/react/pull/20970)，[#21056](https://github.com/facebook/react/pull/21056)，[#21255](https://github.com/facebook/react/pull/21255)，[#21200](https://github.com/facebook/react/pull/21200)，[#21257](https://github.com/facebook/react/pull/21257)，[#21276](https://github.com/facebook/react/pull/21276)，[#22443](https://github.com/facebook/react/pull/22443)，[#22450](https://github.com/facebook/react/pull/22450)，[#23247](https://github.com/facebook/react/pull/23247)，[#24025](https://github.com/facebook/react/pull/24025)，[#24030](https://github.com/facebook/react/pull/24030) [@sebmarkbage](https://github.com/sebmarkbage))
* 修复 SSR 中的上下文提供者在处理多个请求时的问题。([#23171](https://github.com/facebook/react/pull/23171) [@frandiox](https://github.com/frandiox))
* 文本不匹配时恢复到客户端渲染。([#23354](https://github.com/facebook/react/pull/23354) [@acdlite](https://github.com/acdlite))
* 弃用 `renderToNodeStream`。([#23359](https://github.com/facebook/react/pull/23359) [@sebmarkbage](https://github.com/sebmarkbage))
* 修复新服务端渲染器中一个有误的错误日志。([#24043](https://github.com/facebook/react/pull/24043) [@eps1lon](https://github.com/eps1lon))
* 修复新服务端渲染器中的一个错误。([#22617](https://github.com/facebook/react/pull/22617) [@shuding](https://github.com/shuding))
* 忽略服务端自定义元素内的函数和符号值。([#21157](https://github.com/facebook/react/pull/21157) [@sebmarkbage](https://github.com/sebmarkbage))

### React DOM Test Utils {/*react-dom-test-utils*/}

* 在生产环境使用 `act` 时抛出错误。 ([#21686](https://github.com/facebook/react/pull/21686) [@acdlite](https://github.com/acdlite))
* 支持使用 `global.IS_REACT_ACT_ENVIRONMENT` 禁用 act 警告。 ([#22561](https://github.com/facebook/react/pull/22561) [@acdlite](https://github.com/acdlite))
* 扩大 act 警告，以覆盖所有可能预计 React 工作的 API。([#22607](https://github.com/facebook/react/pull/22607) [@acdlite](https://github.com/acdlite))
* 使 act 批量更新。([#21797](https://github.com/facebook/react/pull/21797) [@acdlite](https://github.com/acdlite))
* 移除对被挂起的 effect 的警告。([#22609](https://github.com/facebook/react/pull/22609) [@acdlite](https://github.com/acdlite))

### React Refresh {/*react-refresh*/}

* 在快速刷新中跟踪后期装载的 root。([#22740](https://github.com/facebook/react/pull/22740) [@anc95](https://github.com/anc95))
* 在 `package.json` 中添加 `exports` 字段。([#23087](https://github.com/facebook/react/pull/23087) [@otakustay](https://github.com/otakustay))

### 实验性的服务器组件 {/*server-components-experimental*/}

* 增加服务端上下文支持。([#23244](https://github.com/facebook/react/pull/23244) [@salazarm](https://github.com/salazarm))
* 增加对 `lazy` 的支持。 ([#24068](https://github.com/facebook/react/pull/24068) [@gnoff](https://github.com/gnoff))
* 更新 webpack 插件以支持 webpack 5。([#22739](https://github.com/facebook/react/pull/22739) [@michenly](https://github.com/michenly))
* 修正 Noder loader 中的一个错误。([#22537](https://github.com/facebook/react/pull/22537) [@btea](https://github.com/btea))
* 在边缘环境中使用 `globalThis` 而不是 `window`。([#22777](https://github.com/facebook/react/pull/22777) [@huozhi](https://github.com/huozhi))
