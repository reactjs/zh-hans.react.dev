---
title: "React Labs：我们正在努力的方向——2023 年 3 月"
---

2023 年 3 月 22 日 [Joseph Savona](https://twitter.com/en_JS)、[Josh Story](https://twitter.com/joshcstory)、[Lauren Tan](https://twitter.com/potetotes)、[Mengdi Chen](https://twitter.com/mengdi_en)、[Samuel Susla](https://twitter.com/SamuelSusla)、[Sathya Gunasekaran](https://twitter.com/_gsathya)、[Sebastian Markbåge](https://twitter.com/sebmarkbage) 与 [Andrew Clark](https://twitter.com/acdlite)

---

<Intro>

在 React Labs 的文章中，我们讲述了正在进行研究和开发的项目。自 [上次更新](https://react.dev/blog/2022/06/15/react-labs-what-we-have-been-working-on-june-2022) 以来，我们在 React 服务器组件、资产加载、优化编译器、离屏渲染和过渡追踪方面取得了重要进展，并希望分享我们所学到的知识。

</Intro>

---

## React 服务器组件 {/*react-server-components*/}

React 服务器组件（React Server Components，简称 RSC）是由 React 团队设计的新的应用架构。

我们之前在 [introductory talk](/blog/2020/12/21/data-fetching-with-react-server-components) 与 [RFC](https://github.com/reactjs/rfcs/pull/188) 中分享了有关 RSC 的研究。之前我们提到，我们引入了一种新的组件类型——服务器组件。服务器组件会提前运行，并在打包时被排除在外。服务器组件也可以在构建期间运行，并允许你从文件系统中读取或提取静态内容。它们也可以在服务器上运行，让你可以访问数据层而不必构建 API。你可以通过 props 将数据从服务器组件传递到浏览器中的交互式客户端组件中。

RSC 将面向服务器的多页面应用程序的简单“请求/响应”思维模型与面向客户端的单页面应用程序的无缝交互性相结合，为你提供了两者的最佳结合。

自上次更新以来，我们已将 [RFC](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md) 合并以批准提案。我们解决了 [React 服务器模块约定](https://github.com/reactjs/rfcs/blob/main/text/0227-server-module-conventions.md) 提案中未解决的问题，并与我们的合作伙伴达成共识，采用 `use client` 协定。这些文件还作为符合 RSC 兼容实现应支持的规范。

最大的变化是我们引入了 [`async` / `await`](https://github.com/reactjs/rfcs/pull/229) 作为从服务器组件中进行数据提取的主要方式。我们还计划通过引入一个名为 `use` 的新 Hook，从客户端支持数据加载，该 Hook 也将取消 Promises。虽然我们不能在仅限客户端的应用程序中的任意组件中支持 `async / await`，但我们计划在将客户端仅应用程序结构化类似于 RSC 应用程序的方式时添加支持。

现在我们已经相当好地解决了数据提取的问题，我们正在探索另一个方向：从客户端向服务器发送数据，以便可以执行数据库变更和实现表单。我们通过在服务器/客户端边界传递 Server Action 函数来实现这一点。客户端可以调用该函数，提供无缝 RPC。而在 JavaScript 加载之前，Server Action 还可以提供逐步增强的表单。

RSC 已经在 [Next.js App Router](/learn/start-a-new-react-project#nextjs-app-router) 中发布，展示了一个真正深度集成的路由器，它使用了 RSC 并将其作为 primitive。但这不是构建 RSC 兼容的路由器和框架的唯一方法。RSC 规范和实现提供了特定功能的明确分离，旨在成为适用于兼容 React 框架的组件规范。

我们通常建议使用现有的框架，但你仍然可以构建自定义框架。由于需要深度集成 bundler，构建自定义 RSC 兼容的框架并不像想象中那么容易。当前的若代 bundler 非常适合在客户端使用，但它们并没有专门为将单个模块图分割为服务器和客户端提供一流的支持而设计。因此我们选择直接与 bundler 开发人员合作，以将内置 RSC 作为 primitive。

## 资源加载 {/*asset-loading*/}

[Suspense](/reference/react/Suspense) 指定在组件的数据或代码仍在加载时显示在屏幕上的内容。这能够让页面正在加载，或者因为路由导航需要加载更多数据和代码时，用户逐步看到更多内容。然而，从用户的角度来看，数据加载和渲染并不能完全说明新内容是否已准备就绪。默认情况下，浏览器独立地加载样式表、字体和图像，这可能会导致 UI 的跳跃以及不断的布局变化。

我们正在努力将 Suspense 与样式表、字体和图像的加载生命周期完全集成，以便 React 能够了解它们是否已经准备好然后显示它们。在不更改已编写的 React 组件的方式的情况下，更新将以更连贯和令人愉悦的方式进行。作为优化，我们还将提供一种手动方式，可以直接从组件中预加载类似字体之类的资源。

我们目前正在实现这些功能，很快将有更多内容分享。

## Document Metadata {/*document-metadata*/}

应用程序中的不同页面和屏幕可能具有不同的 metadata，如 `<title>` 标签、描述（description）和其他特定于此屏幕的 `<meta>` 标签。从维护的角度来看，将此信息保持接近该页面或屏幕的 React 组件更具可扩展性。然而，metadata 的 HTML 标签被包含在文档的 `<head>` 中，通常在应用程序的根组件中渲染。

现在可以通过以下两种技术解决此问题。

一种技术是渲染一个特殊的第三方组件，将 `<title>`、`<meta>` 和其他标签移动到其中，并将其放在 document `<head>` 中。这适用于主流浏览器，但也有许多不运行 JavaScript 的客户端，如 Open Graph 解析器（parser），因此这种技术不是普遍适用的。

另一种技术是将页面分为两部分进行服务器渲染。首先，渲染主要内容并收集所有这些标签；然后渲染 `<head>` 与这些标签；最后将 `<head>` 和主要内容发送到浏览器。这种方法是可行的，但它会阻止利用 [React 18 的流式服务器渲染器](/reference/react-dom/server/renderToReadableStream)，因为你必须在发送 `<head>` 之前等待所有内容渲染完成。

这就是为什么我们正在添加内置支持，以便在组件树中的任何位置渲染 `<title>`、`<meta>` 和 metadata `<link>` 标签。它将在所有环境中以相同的方式工作，包括完全客户端代码、SSR 和未来的 RSC。我们将很快分享更多关于此的详细信息。

## React 优化编译器 {/*react-optimizing-compiler*/}

自从上次更新以来，我们一直在积极迭代 [React Forget](/blog/2022/06/15/react-labs-what-we-have-been-working-on-june-2022#react-compiler) 的设计，这是 React 的一个优化编译器。我们之前曾将其称为“自动记忆化编译器”，在某种意义上这是正确的。但是构建编译器帮助我们更深入地理解了 React 的编程模型。更好地理解 React Forget 的方法是将其视为一种自动的 **reactive** 编译器。

React 的核心思想是开发人员将其 UI 定义为当前状态的函数。可以使用普通的 JavaScript 值，如数字、字符串、数组、对象，并使用标准的 JavaScript 语法，如 if/else、for 等，来描述组件逻辑。其思维模型是，当应用程序状态发生更改时，React 将重新渲染。我们认为，这种简单的思维模型和与 JavaScript 语义密切相关的原则是 React 编程模型中的重要原则。

问题在于，React 有时会过于 **reactive**：它可能会重新渲染太多次。例如，在 JavaScript 中，我们没有简单的方法来比较两个对象或数组是否相等（具有相同的键和值），因此在每次渲染时创建一个新对象或数组都可能会导致 React 执行更多的工作。这意味着开发人员必须显式地记忆化组件，以免对更改做出过度的反应。

我们的目标是通过 React Forget 确保 React 应用程序默认具有恰当的 reactive：只有在状态值 **有意义** 地更改时才重新渲染应用程序。从实现的角度来看，这意味着自动记忆化，但我们相信，reactive 框架是更好地理解 React 和 Forget 的一种方法。一种思考方式是，当对象标识发生更改时 React 会重新渲染。而使用 Forget，当语义值发生更改时，React 就会重新渲染——但不会产生深层比较的运行时成本。

就具体进展而言，自上次更新以来，我们已经迭代了大量编译器的设计，以符合这种自动 reactive 的方法，并融入了内部使用编译器的反馈意见。在去年末对编译器进行了一些重大重构后，我们现在已经开始在 Meta 的有限生产环境中使用编译器。我们计划在生产环境中证明它后开源。

最后，许多人对编译器的工作原理表示出很大的兴趣。我们期待在验证编译器并开源它时分享更多细节。但现在有一些细节可以分享：

编译器的核心与 Babel 几乎完全解耦，核心编译器 API（大致上）是旧 AST 输入，新 AST 输出（同时保留源位置数据）。在底层，我们使用自定义代码表示和转换管道（pipeline），以进行低级语义分析。然而，编译器的主要公共接口将通过 Babel 和其他构建系统插件提供。为了方便测试，我们目前有一个 Babel 插件，它是一个非常薄的包装器，将调用编译器生成每个函数的新版本并替换它。

在过去的几个月中，我们对编译器进行了重构，希望专注于细化核心编译模型，以确保我们可以处理诸如条件语句、循环、reassignment 和 mutation 等复杂问题。然而，JavaScript 在表达每个特性的上都可能有很多方式：if/else、三目运算符、for、for-in、for-of 等。如果试图一开始就支持整个语言会延迟我们验证核心模型的时间点。相反，我们从语言的一个较小但有代表性的子集开始：let/const、if/else、for 循环、对象、数组、原始类型、函数调用和其他一些特性。随着我们对核心模型的信心增强和内部抽象的完善，我们扩展了支持的语言子集。我们还明确了我们尚不支持的语法，记录诊断信息并跳过不受支持的输入的编译。我们有工具可以在 Meta 的代码库上尝试编译器，并查看哪些不受支持的特性最常见，以便我们下一个优先考虑它们。我们将继续逐步扩展，以支持整个语言。

在 React 组件中使原生 JavaScript 变得 reactive 需要一个具有深刻理解语义的编译器，以便它能准确理解代码正在做什么。通过采取这种方法，我们正在创建一个用于在 JavaScript 中实现 reactive 的系统，它将帮助开发者使用语言的全部表达能力编写任何复杂度的产品代码，而不仅仅局限于领域特定语言。

## 离屏渲染 {/*offscreen-rendering*/}

离屏渲染是 React 即将推出的一种功能，用于在后台渲染屏幕，而无需额外的性能开销。可以将其视为 [`content-visibility` CSS 属性](https://developer.mozilla.org/ch-ZN/docs/Web/CSS/content-visibility) 的一个版本，它不仅适用于 DOM 元素，还适用于 React 组件。在我们的研究中，我们发现了各种用例：

- 路由可以在后台预渲染屏幕，以便当用户导航到它们时，可以立即使用。
- 切换选项卡组件可以保留隐藏选项卡的状态，以便用户可以在不丢失进度的情况下在它们之间切换。
- 虚拟化列表组件可以在可见窗口的上方和下方预渲染额外的行。
- 当打开模态或弹出窗口时，整个应用程序可以进入“后台”模式，以便除模态框外的所有内容都禁用事件和更新。

大多数 React 开发人员不会直接与 React 的离屏 API 交互。相反，离屏渲染将集成到路由器和 UI 库等内容中，然后使用这些库的开发人员将自动受益，而无需额外的工作。

我们的想法是，开发者应该能够在不更改组件编写方式的情况下，将任何 React 树渲染到屏幕外。当组件被离屏渲染时，它实际上并没有 **挂载**，直到组件变为可见状态——其效果不会被触发。例如，如果组件使用 `useEffect` 在首次出现时记录分析数据，预渲染不会影响数据的准确性。同样，当组件离开屏幕时，其效果也会被卸载。离屏渲染的一个关键特性是，可以切换组件的可见性，而不会失去其状态。

自上次更新以来，我们在 Meta 的 React Native 应用程序上测试了一个实验性的预渲染版本，包括 Android 和 iOS，性能表现良好。我们还改进了离屏渲染与 Suspense 的配合方式——在离屏树中挂起（suspend）但不会触发 Suspense 后备方案。我们剩下的工作是完成向库开发人员公开的基本组件。我们预计将于今年晚些时候发布一个 RFC，同时发布一个实验性的 API 用于测试和反馈。

## 追踪 transition {/*transition-tracing*/}

追踪 transition 的 API 可以检测 [React transition](/reference/react/useTransition) 变慢的原因，并调查为什么会变慢。在上次更新后，我们完成了 API 的初始设计，并发布了一个 [RFC](https://github.com/reactjs/rfcs/pull/238)，基本功能也已经实现。该项目目前处于暂停状态。我们欢迎对 RFC 进行反馈，并期待恢复其开发，为 React 提供更好的性能测量工具。这将特别对基于 React transition 构建的路由非常有用，例如 [Next.js App Router](/learn/start-a-new-react-project#nextjs-app-router)。

* * *
除了这个更新，我们的团队最近还在社区播客和直播中客串，更多地讲述我们的工作并回答问题。

* [Dan Abramov](https://twitter.com/dan_abramov) 和 [Joe Savona](https://twitter.com/en_JS) 在 [Kent C. Dodds 的 YouTube 频道](https://www.youtube.com/watch?v=h7tur48JSaw) 上接受了采访，讨论了关于 React 服务器组件的问题。
* [Dan Abramov](https://twitter.com/dan_abramov) 和 [Joe Savona](https://twitter.com/en_JS) 在 [JSParty podcast](https://jsparty.fm/267) 上作为嘉宾，分享了他们对 React 未来的看法。

感谢 [Andrew Clark](https://twitter.com/acdlite)、[Dan Abramov](https://twitter.com/dan_abramov)、[Dave McCabe](https://twitter.com/mcc_abe)、[Luna Wei](https://twitter.com/lunaleaps)、[Matt Carroll](https://twitter.com/mattcarrollcode)、[Sean Keegan](https://twitter.com/DevRelSean)、[Sebastian Silbermann](https://twitter.com/sebsilbermann)、[Seth Webster](https://twitter.com/sethwebster) 和 [Sophie Alpert](https://twitter.com/sophiebits) 对本篇文章进行审查。

感谢阅读，我们下次更新见！
