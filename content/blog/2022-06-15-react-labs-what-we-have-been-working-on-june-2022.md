---
title: "React 实验室: 我们都在研究什么 – 2022 六月"
author: [acdlite,gaearon,kassens,josephsavona,joshcstory,laurentan,lunaruan,mengdichen,rickhanlonii,robertzhang,gsathya,sebmarkbage,huxpro]
---

[React 18](https://reactjs.org/blog/2022/03/29/react-v18.html) 着实酝酿了很多年，但它也为 React 团队带来了宝贵的经验。它的发布是多年的研究和众多路线探索的结果。其中一些路线是成功的；更多的则是在进入了死胡同后换来了一些新的洞见。我们学到的一个教训是，如果让社区干等新功能的发布，却无从知晓我们正在探索的事情的话，会比较令人沮丧。

我们通常在任何时候都有许多同时进行的项目，有更具实验性的，也有一些更加明确的。以后，我们将会定期与社区分享我们在进行的这些项目。

当然，大家要有一个心理预期，就是这些项目并没有一个明确的时间表。其中许多项目还处于高度研究的状况，很难确定具体的发布日期。有一些甚至可能最终都不会发布。即便如此，我们还是想与你分享我们都在思考哪些问题，以及我们迄今为止我们都有哪些进展。

## 服务端组件 {#server-components}

我们于 2020 年 12 月宣布了  [React 服务端组件 (RSC) 的实验性方案](https://reactjs.org/blog/2020/12/21/data-fetching-with-react-server-components.html) 。从那时起，我们就一直在尽力完成 React 18 中 RSC 所依赖的一些能力，并致力于根据实验情况做一些改进。

值得一提得是，我们放弃了必须使用 react-fetch 这样专用 I/O 库的路线，而是决定采用一个兼容 async/await 的路线。严格地说，这个改动并不会阻碍 RSC 的发布，目前你仍然可以继续用路由（routers）来获取数据。另一个变化是我们已经决定不用文件扩展名这种方式，而是转而考虑使用 [标注来确定边界（annotating boundaries）](https://github.com/reactjs/rfcs/pull/189#issuecomment-1116482278)。

我们正在与 Vercel 和 Shopify 合作，在 Webpack 与 Vite 中找到一种通用的语义来统一 bundler 上的的支持。在发布之前，我们希望确保 RSC 的语义在整个 React 生态系统中是相同的，这样才能达到稳定。

## 静态资源加载 {#asset-loading}

目前，脚本、CSS、字体、图像等静态资通常是使用外部系统来进行预加载或按需加载得，这会对像流式渲染或服务端组件这样的新环境带来一些困难。我们正在考虑添加新的 React API 来方便在任何 React 环境中表达如何做外部系统中预加载或者不重复加载静态资源。

我们也在考虑用 Suspense 来让图像、CSS、字体的加载能够阻塞 UI 的展示，但又不会阻塞流式（streaming）和并发渲染（concurrent rendering）。这有助于避免渲染时界面和布局像 [“爆米花“](https://twitter.com/sebmarkbage/status/1516852731251724293) 一样跳来跳去得。

## 静态服务端渲染优化 {#static-server-rendering-optimizations}

静态站点生成 (SSG) 和增量静态重生成 (ISR) 都是通过让页面可以被缓存而提升性能的好方法，但我们觉得也有必要添加新的能力来提高动态服务器端渲染 (SSR) 的性能 —— 特别是当大多数内容都可以被缓存但有一部分仍然是动态的时候。我们正在探索如何利用编译期优化来优化服务器渲染。

## React 优化编译器 {#react-compiler}

我们在 React Conf 2021 上[预告](https://www.youtube.com/watch?v=lGEMwh32soc) 了 React Forget 项目。它是一个可以自动生成等效于 `useMemo` 和 `useCallback` 代码的编译器，旨在保持 React 现有编程模型的前提下最小化重渲染的开销。

最近，我们完成了对编译器的重写，使其更加可靠和强大。新的编译器架构使我们能够分析与记忆化比如 [局部可变数据（local mutations）](https://beta.reactjs.org/learn/keeping-components-pure#local-mutation-your-components-little-secret) 这样的复杂代码，并打开了许多新的编译期优化的可能，而不仅仅局限于 Hooks 能做的优化。

我们还在开发一个用于探索这个编译器的 Playground。虽然 Playground 的首要目的是使编译器开发本身更加容易，但因为它能够揭示编译器背后的一些原理，并且可以实时渲染编译器优化后的效果，所以我们觉得它也会方便大家上手体验直观的感受编译优化的效果。Playground 将会随着编译器一同发布。

## 离屏（Offscreen） {#offscreen}

当前，如果你想隐藏和显示一个组件，你有两个选择。第一种是从 UI 树中完全添加或删除它，但这种方法的问题在于每次卸载（unmount）时 UI 的状态都会丢失，包括存储在 DOM 中的状态，例如滚动条的位置。

而另一种选择是在保持组件装载（mount）的情况下用 CSS 切换视觉上的外观。这么做可以保留 UI 的状态，但也伴随着性能代价，因为 React 仍然必须在收到新更新时不断渲染这个即便已经隐藏起来组件，以及其所有的子组件。

Offscreen 引入了第三种选择：在视觉上隐藏 UI，但降低其内容渲染的优先级。这个想法在本质上类似于 `content-visibility` 这个 CSS 属性：当内容被隐藏时，它不需要与 UI 的其余部分保持同步。React 可以推迟渲染这个组件，直到应用程序没有其余工作需要做闲置下来，或者直到内容需要再次可见时，才去渲染它。

Offscreen 只是一个底层能力，他的目的是解锁更高层次的功能。就像 `startTransition` 等 React 的其他并发特性一样，你在大多数情况下都可能不会直接与 Offscreen API 打交道，而是直接使用元框架们通过 Offscreen 实现的高阶模式就好，诸如：

* **即时过渡（Instant transitions）**： 一些路由框架已经可以通过诸如在 hover 链接时预加载数据等方式来对后续的跳转提速。通过 Offscreen，他们将可以直接在后台就预渲染下一个屏幕。
* **可重用状态（Reusable state）**： 同样，在路由或者标签之间跳转时，你可以用 Offscreen 来保留前一个屏幕的状态，使得你可以在切换回来后从中断处继续。
* **虚拟化列表渲染（Virtualized list rendering）**： 显示大型列表时，一些虚拟化列表的框架通常都会预渲染可见范围外的内容，你可以使用 Offscreen 来让预渲染不可见内容具备比渲染可见内容有更低的优先级。
* **背景内容（Backgrounded content）**：这是另一个我们在探索的功能，比如在展示模态弹窗（model）时，可以在不隐藏背景的情况下降低对背景内容渲染的优先级。

## 过渡跟踪（Transition Tracing） {#transition-tracing}

目前，React 有两个 Profiler 性能分析工具。[最早的 Profiler](https://reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html)  显示了一次分析会话中所有提交的概览。对于每次提交，它还显示所有渲染的组件以及渲染它们所花费的时间。我们还有一个在 React 18 中引入的 [时间线（Timeline） Profiler](https://github.com/reactwg/react-18/discussions/76) 的 beta 版本，它显示组件何时安排更新以及 React 何时处理这些更新。这两个分析器都可以帮助开发人员识别代码中的性能问题。

我们已经意识到，开发人员并没有发现，其实了解单个缓慢的提交或脱离上下文的组件是很有用的。了解导致缓慢提交的真正原因会更有用。并且开发人员希望能够跟踪特定的交互（例如按钮单击、初始加载或页面导航）以观察性能回归并了解交互缓慢的原因以及如何去修复它。

我们之前尝试通过创建 [交互跟踪 API](https://gist.github.com/bvaughn/8de925562903afd2e7a12554adcdda16) 来解决这个问题，但它存在一些降低跟踪交互缓慢原因准确性的基本设计缺陷，有时会导致交互永无止境。由于这些问题，我们最终 [移除了这个 API](https://github.com/facebook/react/pull/20037) 。

我们正在开发一个新版本的交互跟踪 API（暂时称为过渡跟踪（Transition Tracing），因为它是通过 `startTransition` 来触发的）来解决这些问题。

## React 新文档 {#new-react-docs}

去年，我们宣布了新的 React 文档网站的 [beta 版本](https://beta.reactjs.org/) ，新的学习材料从 Hooks 开始，并有新的图表、插图以及许多交互式代码示例和习题挑战。之前我们因为要专注于 React 18 的开发而暂停了这项工作，但现在既然 React 18 已经发布，我们就开始积极努力地完成与发布新文档了。

我们目前正在写一个关于副作用（effects）的详细章节，因为我们听说这对于新的和有经验的 React 用户来说都是相对具有挑战性的主题之一。[与 Effects 同步](https://beta.reactjs.org/learn/synchronizing-with-effects) 是该系列中的第一篇文章，接下来几周我们还会发布更多内容。当我们第一次开始编写有关 effects 的详细部分时，我们已经意识到可以通过向 React 添加新的原始 API 来简化许多常见的 effects 模式。[useEvent RFC](https://github.com/reactjs/rfcs/pull/220) 中分享了一些初步想法。它目前处于早期研究阶段，我们仍在迭代这个想法。我们感谢社区迄今为止对 RFC 的评论，以及对正在进行的文档重写的 [反馈](https://github.com/reactjs/reactjs.org/issues/3308) 和贡献。我们要特别感谢 [Harish Kumar](https://github.com/harish-sethuraman) 提交并审查了对新网站实施的诸多改进。

*感谢 [Sophie Alpert](https://twitter.com/sophiebits) 对本篇文章的校对!*
