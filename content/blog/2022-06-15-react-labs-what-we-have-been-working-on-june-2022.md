---
title: "React Labs: What We've Been Working On – June 2022"
author: [acdlite,gaearon,kassens,josephsavona,joshcstory,laurentan,lunaruan,mengdichen,rickhanlonii,robertzhang,gsathya,sebmarkbage,huxpro]
---

[React 18](https://reactjs.org/blog/2022/03/29/react-v18.html)  已经酝酿多年，它为 React 团队带来了宝贵的经验。它的发布是多年的研究和多种路线探索的结果。其中一些路线是成功的；更多的是进入了死胡同。我们学到的一个教训是，社区一直在等待新功能的发布，却没有深入了解我们正在探索的这些路线，这让我们很沮丧。

通常，在任何时候，我们都有许多项目在同时进行，从更具实验性的到明确定义的。以后，我们希望开始定期分享更多我们在这些项目中与社区相关的内容。

大家要有一些心理预期，这并没有一个有明确时间表。其中许多项目正在积极研究中，很难确定具体的发布日期。根据我们目前的评估，应该不会在当前的迭代中发布。虽然这样，我们还是想与你分享我们正在积极思考哪些问题，以及我们迄今为止已经有所认识的东西。

## 服务器组件 {#server-components}

我们于 2020 年 12 月宣布了  [React 服务器组件 (RSC) 的实验性方案](https://reactjs.org/blog/2020/12/21/data-fetching-with-react-server-components.html) 。从那时起，我们就一直在 React 18 里去完成对他的支持，并致力于根据实验反馈对他进行改进。

特别是，我们放弃了使用 I/O libraries（例如 react-fetch）的想法，而是采用 async/await 模型以获得更好的兼容性。这在技术上并不会 block RSC 的发布，因为你还可以使用 routers 来获取数据。另一个变化是我们已经不用文件扩展名这种方式，转而支持 [注释边界 annotating boundaries](https://github.com/reactjs/rfcs/pull/189#issuecomment-1116482278)。

我们正在与 Vercel 和 Shopify 合作，统一 bundler 对 Webpack 和 Vite 中共享语义（shared semantics）的支持。在发布之前，我们希望确保 RSC 的语义在整个 React 生态系统中是相同的，这样才能达到稳定。

## 资产加载 {#asset-loading}

目前，脚本、外部样式、字体和图像等资产通常是使用外部系统预加载或者实时加载的。这会使跨新环境（如流、服务器组件等）进行协调变得很棘手。我们正在考虑通过适用于所有 React 环境的 React API 的方式，再添加一些 API 以预加载和加载去重的外部资产。

我们也在考虑让他们支持 Suspense，这样你就可以让图像、CSS 和字体在加载之前阻止显示，但不会阻止流式传输（streaming）和并发渲染（concurrent rendering）。这有助于避免在视觉效果和布局发生变化时出现 [“爆米花“](https://twitter.com/sebmarkbage/status/1516852731251724293)。

## 静态服务器渲染优化 {#static-server-rendering-optimizations}

静态站点生成 (SSG) 和增量静态重新生成 (ISR) 是获得可缓存页面性能的好方法，但我们认为我们可以添加功能来提高动态服务器端渲染 (SSR) 的性能——特别是当大多数内容是可缓存的时候。我们正在探索利用编译（compilation）和静态通道（static passes）优化服务器渲染的方法。

## React 优化编译器 {#react-compiler}

我们在 React Conf 2021 上对 React Forget 进行了 [预告](https://www.youtube.com/watch?v=lGEMwh32soc) 。它是一个编译器，可以自动生成等价的 useMemo 和 useCallback 调用，以最小化重新渲染的成本，同时不改变 React 原有的编码方式。

最近，我们完成了对编译器的重写，使其更加可靠和强大。这种新架构使我们能够分析和缓存更复杂的模式，例如使用 [局部突变 local mutations](https://beta.reactjs.org/learn/keeping-components-pure#local-mutation-your-components-little-secret)，并开辟了许多新的编译时优化的机会，而不仅仅使用缓存这么简单。

我们还在开发一个用于探索编译器许多方面的 Playground 。虽然 Playground 的目标是使编译器的开发更容易，但我们认为它将更容易调试和交互，并让编译器的功能变的直观可见。它揭示了它如何在后台工作的各种原理，并在你编写代码时实时呈现编译器的输出。这将在发布时与编译器一起提供。

## 离屏 {#offscreen}

今天，如果你想隐藏和显示一个组件，你有两个选择。一种是从树中完全添加或删除它。这种方法的问题在于，每次卸载时 UI 的状态都会丢失，包括存储在 DOM 中的状态，例如滚动位置。

另一种选择是保持组件安装并使用 CSS 直观地切换外观。这会保留 UI 的状态，但会以性能为代价，因为 React 必须在收到新更新时不断渲染隐藏组件及其所有子组件。

Offscreen 引入了第三种选择：在视觉上隐藏 UI，但降低其内容渲染的优先级。这个想法在本质上类似于 `content-visibility` CSS 属性：当内容被隐藏时，它不需要与 UI 的其余部分保持同步。React 可以推迟渲染工作，直到应用程序的其余部分空闲，或者直到内容再次可见。

Offscreen 只是一个小能力，他的目的是解锁更高级的功能。与 React 的其他并发特性类似 `startTransition`，在大多数情况下，你不会直接与 Offscreen API 交互，而是通过一个完善的框架来实现以下模式：

* **即时过渡（Instant transitions）**： 一些路由框架已经可以通过预加载数据来加速后续导航，例如悬停在链接上时。使用 Offscreen，他们还可以在后台预渲染下一个屏幕。
* **可重用状态（Reusable state）**： 同样，在路线或选项卡之间导航时，你可以使用 Offscreen 来保留前一个屏幕的状态，以便你可以切换回来并从中断处继续。
* **虚拟化列表渲染（Virtualized list rendering）**： 显示大型项目列表时，虚拟化列表框架将预呈现比当前可见的更多行。你可以使用 Offscreen 以低于列表中可见项目的优先级预呈现隐藏行。
* **背景内容（Backgrounded content）**： 我们还在探索一项相关功能，用于在不隐藏背景的情况下降低内容渲染的优先级，例如在显示叠加层时。

## 过渡跟踪 {#transition-tracing}

目前，React 有两个分析工具。[Original Profiler](https://reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html)  显示了分析会话中所有提交的概览。对于每次提交，它还显示所有渲染的组件以及渲染它们所花费的时间。我们还有一个在 React 18 中引入的 [Timeline Profiler](https://github.com/reactwg/react-18/discussions/76) 的 beta 版本，它显示组件何时安排更新以及 React 何时处理这些更新。这两个分析器都可以帮助开发人员识别代码中的性能问题。

我们已经意识到，开发人员并没有发现，其实了解单个缓慢的提交或脱离上下文的组件是很有用的。了解导致缓慢提交的真正原因会更有用。并且开发人员希望能够跟踪特定的交互（例如按钮单击、初始加载或页面导航）以观察性能回归并了解交互缓慢的原因以及如何去修复它。

我们之前尝试通过创建 [交互跟踪 API](https://gist.github.com/bvaughn/8de925562903afd2e7a12554adcdda16) 来解决这个问题，但它存在一些降低跟踪交互缓慢原因准确性的基本设计缺陷，有时会导致交互永无止境。由于这些问题，我们最终 [移除了这个 API](https://github.com/facebook/react/pull/20037) 。

我们正在开发一个新版本的交互跟踪 API（暂时称为转换跟踪，因为它是通过 `startTransition` 开启的）来解决这些问题。

## 新的 React 文档 {#new-react-docs}

去年，我们宣布了新的 React 文档网站的 [beta 版本](https://beta.reactjs.org/) ，新的学习材料从 Hooks 开始，并有新的图表、插图以及许多交互式示例和挑战。之前我们因为要专注于 React 18 的开发而暂停了这项工作，但现在既然 React 18 已经发布，我们就开始积极努力地完成与发布新文档了。

我们目前正在写一个关于 effects 的详细章节，因为我们这听说对于新的和有经验的 React 用户来说都是相对具有挑战性的主题之一。[与 Effects 同步](https://beta.reactjs.org/learn/synchronizing-with-effects) 是该系列中的第一篇文章，接下来几周我们还会发布更多内容。当我们第一次开始编写有关 effects 的详细部分时，我们已经意识到可以通过向 React 添加新的原始 API 来简化许多常见的 effects 模式。[useEvent RFC](https://github.com/reactjs/rfcs/pull/220) 中分享了一些初步想法。它目前处于早期研究阶段，我们仍在迭代这个想法。我们感谢社区迄今为止对 RFC 的评论，以及对正在进行的文档重写的 [反馈](https://github.com/reactjs/reactjs.org/issues/3308) 和贡献。我们要特别感谢 [Harish Kumar](https://github.com/harish-sethuraman) 提交并审查了对新网站实施的诸多改进。

*感谢 [Sophie Alpert](https://twitter.com/sophiebits) 对本篇文章的校对!*
