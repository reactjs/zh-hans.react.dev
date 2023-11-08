---
title: "React Labs：我们正在努力的方向——2022 年 6 月"
---

2022 年 6 月 15 日 [Andrew Clark](https://twitter.com/acdlite)、[Dan Abramov](https://twitter.com/dan_abramov)、[Jan Kassens](https://twitter.com/kassens)、[Joseph Savona](https://twitter.com/en_JS)、[Josh Story](https://twitter.com/joshcstory)、[Lauren Tan](https://twitter.com/potetotes)、[Luna Ruan](https://twitter.com/lunaruan)、[Mengdi Chen](https://twitter.com/mengdi_en)、[Rick Hanlon](https://twitter.com/rickhanlonii)、[Robert Zhang](https://twitter.com/jiaxuanzhang01)、[Sathya Gunasekaran](https://twitter.com/_gsathya)、[Sebastian Markbåge](https://twitter.com/sebmarkbage) 与 [Xuan Huang](https://twitter.com/Huxpro)

---

<Intro>

[React 18](/blog/2022/03/29/react-v18) 经过多年的努力才得以问世，它为 React 团队带来了宝贵的经验教训。它的发布是多年的研究和探索的结果。其中一些路径是成功的，但更多的是死胡同，但是也带来了新的见解。我们学到的一个教训是，对社区来说，在等待新功能时没有了解我们正在探索的路径是令人沮丧的。

</Intro>

---

我们通常会同时进行多个项目，从更具实验性的项目到明确定义的项目不一而足。展望未来，我们希望开始定期与社区分享我们在这些项目中的工作。

我们并不在此给出具有明确时间表的路线图：许多项目正在积极研究中，很难确定具体的发布日期。根据我们的学习情况，它们甚至可能在当前迭代中不会发布。相反，我们想与你分享我们正在积极思考的问题领域以及我们迄今为止学到的东西。

## 服务器组件 {/*server-components*/}

我们在 2020 年 12 月发布了 [React 服务器组件](https://legacy.reactjs.org/blog/2020/12/21/data-fetching-with-react-server-components.html)（RSC）的实验性演示。从那时起，我们一直在完成 React 18 中的依赖项，并根据实验性反馈进行改进。

特别地，我们放弃了拥有分叉 I/O 库（例如 react-fetch）的想法，转而采用了具有更好兼容性的 async/await 模型。这从技术上讲并不阻碍 RSC 的发布，因为还可以使用路由器进行数据获取。另一个变化是我们也放弃了文件扩展名的方法，而是采用了 [注释边界](https://github.com/reactjs/rfcs/pull/189#issuecomment-1116482278) 的方式。

我们正在与 Vercel 和 Shopify 合作，在 Webpack 和 Vite 中统一打包器（bundler）对共享语义的支持。在发布之前，我们希望确保整个 React 生态系统中的 RSC 的语义是一致的。这是达到稳定状态的主要障碍。

## 资源加载 {/*asset-loading*/}

目前，像脚本、外部样式、字体和图像等资源通常是通过外部系统预加载和加载的。这可能在新的环境（如跨流媒体、服务器组件等）之间协调起来比较棘手。

我们正在考虑添加 API，以通过适用于所有 React 环境的 React API 来预加载和加载经过重复数据删除的外部资源。

我们还正在研究如何支持 Suspense，这样就可以拥有在加载完成之前阻塞显示的图像、CSS 和字体，但不会阻塞流媒体和并发渲染。这可以帮助避免视觉上的 [popcorning](https://twitter.com/sebmarkbage/status/1516852731251724293) 现象，即视觉效果的突然出现和布局的变化

## 静态服务器渲染优化 {/*static-server-rendering-optimizations*/}

静态站点生成（SSG）和增量静态再生成（ISR）是提高可缓存页面性能的好方法，但我们认为我们可以添加功能来改进动态服务器端渲染（SSR）的性能，特别是当大部分但不是全部内容都是可缓存的时候。我们正在探索利用编译和静态传递来优化服务器渲染的方式。

## React 优化编译器 {/*react-compiler*/}

我们在 React Conf 2021 上提供了 React Forget 的 [早期预览](https://www.youtube.com/watch?v=lGEMwh32soc)。它是一个编译器，可以自动生成等效的 `useMemo` 和 `useCallback` 调用，以最小化重新渲染的成本，同时保留 React 的编程模型。

最近，我们完成了编译器的重写，使其更可靠且功能更强大。这种新的架构使我们能够分析和缓存更复杂的模式，比如使用 [local mutation](/learn/keeping-components-pure#local-mutation-your-components-little-secret)，并开启了许多新的编译时优化机会，不仅仅与记忆化 hook 持平。

我们还正在开发一个用于探索编译器多个方面的 playground。尽管 playground 的目标是使编译器的开发变得更容易，但我们认为它将使尝试和建立对编译器工作方式的直观感觉变得更容易。它揭示了编译器在幕后的各种工作原理，并且可以在输入时实时渲染编译器的输出。它将与编译器一起发布。

## 离屏渲染 {/*offscreen*/}

如今，如果你想隐藏和显示一个组件，有两种选择。一种是完全从树中添加或删除。这种方法的问题在于，每次卸载组件时，包括在 DOM 中存储的滚动位置在内的 UI 状态都会丢失。

另一种选择是保持组件挂载，并使用 CSS 在视觉上切换外观。这样可以保留 UI 的状态，但会带来性能损耗，因为每当 React 接收到新的更新时，它必须继续渲染隐藏的组件及其所有子组件。

离屏渲染（Offscreen）引入了第三种选择：在视觉上隐藏 UI，但将其内容降低优先级。这个想法本质上类似于 `content-visibility` CSS 属性：当内容被隐藏时，它不需要与其他 UI 保持同步。React 可以将渲染工作推迟到应用程序的其他部分处于空闲状态，或者直到内容再次变得可见为止。

离屏渲染是一个低级能力，可以实现高级功能。类似于 React 的其他并发功能（如 `startTransition`），在大多数情况下，你不会直接与 Offscreen API 交互，而是通过一个偏好的框架来实现以下模式：

* **即时过渡**。一些路由框架已经预取数据以加快后续导航，例如在悬停在链接上时。使用离屏渲染，它们还可以在后台预渲染下一个屏幕。
* **可重用状态**。类似地，在路由或选项卡之间导航时，你可以使用离屏渲染来保留上一个屏幕的状态，以便你可以切换回来并继续之前的操作。
* **虚拟化列表渲染**。显示大型项目列表时，虚拟化列表框架将预先渲染比当前可见行数更多的行。你可以使用离屏渲染以比列表中可见项目更低的优先级预渲染隐藏的行。
* **后台内容**。我们还在探索一项相关功能，可以将后台内容降低优先级而不隐藏它，例如显示模态覆盖层时。

## Transition Tracing {/*transition-tracing*/}

目前，React 有两个性能分析工具。[原始的 Profiler](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html) 显示了性能分析会话中的所有提交的概览。对于每个提交，它还显示了所有已渲染组件以及它们渲染所花费的时间。我们还在 React 18 中引入了一个 [Timeline Profiler](https://github.com/reactwg/react-18/discussions/76) 的测试版本，它显示了组件何时安排更新以及 React 在这些更新上的工作时间。这两个性能分析工具都有助于开发人员在代码中识别性能问题。

我们意识到，开发人员并不认为单独了解缓慢的提交或组件是有用的，更有用的是了解导致缓慢提交的实际原因。开发人员希望能够跟踪特定的交互（例如按钮点击、初始加载或页面导航），以便观察性能回归，并理解为什么交互缓慢以及如何修复它。

我们之前尝试通过创建一个 [交互追踪 API](https://gist.github.com/bvaughn/8de925562903afd2e7a12554adcdda16) 来解决这个问题，但它存在一些基本的设计缺陷，降低了追踪交互缓慢原因的准确性，有时导致交互永远无法结束。由于这些问题，我们最终 [移除了这个API](https://github.com/facebook/react/pull/20037)。

我们正在开发一个新版本的交互追踪 API（由于它通过 `startTransition` 发起，我们将其暂时称为 Transition Tracing），来解决这些问题。

## 新版文档 {/*new-react-docs*/}

去年，我们宣布了新版文档网站的测试版本（[后来发布为 react.dev](/blog/2023/03/16/introducing-react-dev)）。新的学习材料首先介绍了 Hook，并提供了新的图表、插图，以及许多交互式示例和挑战。之前我们暂时中断了这项工作，专注于 React 18 的发布；但现在 React 18 已经发布，我们正在积极努力完成和发布新的文档。

我们目前正在撰写关于 effect 的详细部分，因为我们听说这是对新手和有经验的 React 用户来说最具挑战性的主题之一。[与 Effect 保持同步](/learn/synchronizing-with-effects) 是系列中首个发布的页面，接下来的几周还会有更多页面发布。当我们开始撰写关于 effect 的详细部分时，我们意识到许多常见的 effect 模式可以通过向 React 添加一个新的原语来简化。我们在 [useEvent RFC](https://github.com/reactjs/rfcs/pull/220) 中分享了一些初步想法。目前还处于早期研究阶段，我们仍在对这个想法进行迭代。我们非常感谢社区对 RFC 的意见，以及对正在进行的文档重写的 [反馈](https://github.com/reactjs/reactjs.org/issues/3308) 和贡献。我们特别要感谢 [Harish Kumar](https://github.com/harish-sethuraman) 为新网站实现提交和审查了许多改进的工作。

感谢 [Sophie Alpert](https://twitter.com/sophiebits) 对本篇博客文章的审查！
