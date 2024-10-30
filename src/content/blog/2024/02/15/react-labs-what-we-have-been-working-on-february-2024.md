---
title: "React Labs：我们正在努力的方向——2024 年 2 月"
author: Joseph Savona, Ricky Hanlon, Andrew Clark, Matt Carroll, and Dan Abramov
date: 2024/02/15
description: 在 React Labs 的文章中，我们讲述了正在进行研究与开发的项目。自上次更新以来，我们又取得了巨大进展，现在我们想将这些内容分享给大家。
---

2024 年 2 月 15 日 [Joseph Savona](https://twitter.com/en_JS)、[Ricky Hanlon](https://twitter.com/rickhanlonii)、[Andrew Clark](https://twitter.com/acdlite)、[Matt Carroll](https://twitter.com/mattcarrollcode) 与 [Dan Abramov](https://twitter.com/dan_abramov)

---

<Intro>

在 React Labs 的文章中，我们讲述了正在进行研究与开发的项目。自 [上次更新](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023) 以来，我们又取得了巨大进展，现在我们想将这些内容分享给大家。

</Intro>

<Note>

React Conf 2024 定于 5 月 15 日至 16 日在内华达州亨德森举行！如果有兴趣亲临 React Conf，请在 2 月 28 日之前 [注册门票抽签](https://forms.reform.app/bLaLeE/react-conf-2024-ticket-lottery/1aRQLK)。

有关门票、免费直播、赞助等更多信息，请访问 [React Conf 网站](https://conf.react.dev)。

</Note>

---

## React 编译器 {/*react-compiler*/}

React 编译器不再是一个研究项目：该编译器现在已经在生产环境中为 instagram.com 提供动力，并且我们正在努力将该编译器推广到 Meta 的其他平台，并准备进行第一次开源发布。

正如我们在 [之前的文章](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-optimizing-compiler) 中所讨论的，当状态发生变化时，React 有时会过度重新渲染。自 React 早期以来，我们对这种情况的解决方案一直是手动记忆化。在我们当前的 API 中，这意味着使用 [`useMemo`](/reference/react/useMemo)、[`useCallback`](/reference/react/useCallback) 和 [`memo`](/reference/react/memo) API 手动调整 React 在状态变化时重新渲染的程度。但是手动记忆化是一种妥协。它会使我们的代码变得混乱、很容易出错，并且需要额外的工作来保持更新。

手动记忆化是一个合理的妥协，但我们并不满意。我们的愿景是当状态发生变化时 React 可以自动重新渲染 UI 的恰当部分，而不是向 React 的核心心智模型妥协。我们相信 React 的方式——将 UI 视为状态的简单函数，使用标准的 JavaScript 值和习惯用法——是 React 为许多开发人员提供可接近性的关键部分。这就是我们投资于构建 React 的优化编译器的原因。

JavaScript 是一个因其松散规则和动态特性而闻名的具有挑战性的语言。React 编译器能够通过模拟 JavaScript 的规则和“React 的规则”来安全地编译代码。例如，React 组件必须是幂等的——给定相同的输入返回相同的值——并且不能突变 props 或状态值。这些规则限制了开发人员可以做的事情，并为编译器优化开辟了一个安全的空间。

当然，我们理解开发人员有时会在规则上有所放宽，我们的目标是使 React 编译器能够在尽可能多的代码上立即生效。编译器会尝试检测代码是否严格遵循 React 的规则，如果安全则编译代码，否则跳过编译。我们正在针对 Meta 庞大且多样化的代码库进行测试，以帮助验证这种方法。

对于那些对确保其代码遵循 React 规则感兴趣的开发人员，我们建议 [启用严格模式](/reference/react/StrictMode) 并 [配置 React 的 ESLint 插件](/learn/editor-setup#linting)。这些工具可以帮助捕获 React 代码中的微妙错误，提高应用程序的质量，并为即将推出的功能（如 React 编译器）做好准备。我们还正在努力整理 React 规则的综合文档并更新我们的 ESLint 插件，以帮助团队理解和应用这些规则，从而创建更健壮的应用程序。

欢迎查看我们 [去年秋季的演讲](https://www.youtube.com/watch?v=qOQClO3g8-Y) 以查看编译器的实际效果。在演讲时，我们从尝试在 instagram.com 的一个页面上使用 React 编译器获取了早期的实验数据。自那时以来，我们已将编译器推广到了 instagram.com 的生产环境。我们还扩大了团队规模，加快了在 Meta 的其他平台和开源的推出速度。我们对未来的道路充满期待，并将在未来几个月内分享更多内容。

## Action {/*actions*/}


我们 [之前分享过](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)，我们正在探索使用服务器操作将数据从客户端发送到服务器的解决方案，以便可以执行数据库变更和实现表单。在开发 Server Action 期间，我们扩展了这些 API，以支持仅客户端应用程序中的数据处理。

我们将含有此更广泛含义的操作称为 Action。Action 允许将一个函数传递给诸如 [`<form/>`](/reference/react-dom/components/form) 等 DOM 元素：

```js
<form action={search}>
  <input name="query" />
  <button type="submit">搜索</button>
</form>
```

`action` 函数可以同步或异步执行。你可以在客户端使用标准 JavaScript 定义它们，也可以在服务器上使用 [`'use server'`](/reference/rsc/use-server) 指示符。当使用 action 时，React 将帮助管理数据提交的生命周期，提供类似 [`useFormStatus`](/reference/react-dom/hooks/useFormStatus) 和 [`useActionState`](/reference/react/useActionState) 的 Hook，以访问表单操作的当前 state 与响应。

默认情况下，Action 在 [transition](/reference/react/useTransition) 中提交，使当前页面在操作处理过程中保持交互性。由于 Action 支持异步函数，我们还添加了在 transitions 中使用 `async/await` 的功能，这允许在异步请求（如 `fetch`）开始时使用转换的 `isPending` 状态显示待处理 UI，并在应用更新时始终显示待处理 UI。

除了 Action，我们还引入了一个名为 [`useOptimistic`](/reference/react/useOptimistic) 的功能，用于管理乐观状态更新。使用此 Hook 可以应用临时更新，一旦最终状态提交，它们就会自动回滚。对于 Action，这将帮助乐观地设置客户端数据的最终状态，假设提交成功，并恢复为从服务器接收到的数据值。它使用常规的 `async`/`await`，因此无论是在客户端上使用 `fetch` 还是在服务器上使用 Server Action，都可以工作。

库作者可以使用 `useTransition` 在自己的组件中实现自定义 `action={fn}` props。我们的目的是，当设计他们的组件 API 时，库应采用 Action 模式，为 React 开发人员提供一致的体验。例如，如果你的库提供了一个 `<Calendar onSelect={eventHandler}>` 组件，则还可以考虑暴露一个 `<Calendar selectAction={action}>` API。

尽管我们最初专注于 Server Action 用于客户端/服务器数据传输，但我们对 React 的理念是在所有平台和环境中提供相同的编程模型。在可能的情况下，如果我们在客户端引入一个功能，我们也会使它在服务器上起作用，反之亦然。这一理念使我们能够创建一组 API，无论你的应用在何处运行，都可以工作，从而使以后更容易升级到不同的环境。

Action 现在在 Canary 通道中可用，并将在下一个 React 发布版本中发布。

## React Canary 版本中的新特性 {/*new-features-in-react-canary*/}

我们将 [React Canaries](/blog/2023/05/03/react-canaries) 作为一个选项引入，可以在它们的设计接近完成时立即采用个别新的稳定功能，然后再发布到稳定的 semver 版本中。

Canaries 是我们开发 React 的一种变化。以前，功能会在 Meta 内部进行研究和构建，因此用户只会在发布到 Stable 时看到最终成品。通过 Canaries，我们正在社区的帮助下公开构建，以完成我们在 React Labs 博客系列中分享的功能。这意味着开发者能够更早地了解新功能，因为它们正在完成而不是已经完成。

React 服务器组件、资源加载、文档元数据与 Action 都已经加入了 React Canary，并且我们已经在 react.dev 上为这些功能添加了文档：

- **指示符**：[`"use client"`](/reference/rsc/use-client) 与 [`"use server"`](/reference/rsc/use-server) 是设计用于全栈 React 框架的打包功能。它们标记了两个环境之间的“分割点”：use client 指示符指示打包工具生成一个 `<script>` 标签（类似于 [Astro Islands](https://docs.astro.build/en/concepts/islands/#creating-an-island)），而 use server 告诉打包工具生成一个 POST 端点（类似于 [tRPC Mutations](https://trpc.io/docs/concepts)）。它们让你可以编写将客户端交互性与相关的服务器端逻辑组合在一起的可重用组件。

- **文档元数据**：我们内置支持在组件树中的任何位置渲染 [`<title>`](/reference/react-dom/components/title)、[`<meta>`](/reference/react-dom/components/meta) 和元数据 [`<link>`](/reference/react-dom/components/link) 标签。这些在所有环境中都以相同的方式工作，包括完全客户端代码、SSR 和 RSC。这为像 [React Helmet](https://github.com/nfl/react-helmet) 这样的库开创的功能提供了内置支持。

- **资源加载**：我们将 Suspense 与样式表、字体和脚本等资源的加载生命周期集成在一起，以便 React 考虑它们来确定像 [`<style>`](/reference/react-dom/components/style)、[`<link>`](/reference/react-dom/components/link) 和 [`<script>`](/reference/react-dom/components/script) 这样的元素中的内容是否已准备就绪。我们还添加了新的 [资源加载 API](/reference/react-dom#resource-preloading-apis)，如 `preload` 和 `preinit`，以提供更大的控制权，指示何时应加载和初始化资源。

- **Action**：如上所述，我们已将 Action 添加到管理从客户端发送数据到服务器的功能中。现在可以将 `action` 添加到像 [`<form/>`](/reference/react-dom/components/form) 这样的元素中，使用 [`useFormStatus`](/reference/react-dom/hooks/useFormStatus) 访问状态，使用 [`useActionState`](/reference/react/useActionState) 处理结果，并使用 [`useOptimistic`](/reference/rsc/useOptimistic) 乐观地更新 UI。

由于所有这些功能是相互配合的，因此单独在稳定渠道中发布它们是困难的。发布 Action 而不带有用于访问表单状态的补充 Hook 会限制 Action 的实际可用性。引入 React 服务器组件而不集成 Server Action 会把在服务器上修改数据变得复杂化。

在我们可以将一组功能发布到稳定渠道之前，我们需要确保它们能够协同工作，并且开发人员拥有在生产环境中使用它们所需的一切。React Canaries 允许我们逐个开发这些功能，并逐步释放稳定的 API，直到整个功能集完成。

目前在 React Canary 中的功能已经完整并且准备发布。

## React 的下一个主要版本 {/*the-next-major-version-of-react*/}

经过几年的迭代，`react@canary` 现在已经准备好发布到 `react@latest`。上面提到的新功能与应用程序运行的任何环境兼容，提供了生产使用所需的一切。由于资源加载与文档元数据可能对一些应用程序造成破坏性变化，因此下一个 React 版本将是一个主要版本：**React 19**。

我们仍然需要做更多准备工作才能发布。在 React 19 中，我们还将添加一些长期请求的改进，这些改进需要进行破坏性更改，如支持 Web Components。我们现在的重点是完成这些改进、为新功能制定最终文档，并发布关于包含哪些内容的公告。

在接下来的几个月中，我们将分享有关 React 19 包含的所有内容、如何采用新的客户端功能以及如何为 React 服务器组件构建支持的更多信息。

## Offscreen（已经重命名为 Activity） {/*offscreen-renamed-to-activity*/}

自上次更新以来，我们已经将我们正在研究的一个功能从“Offscreen”重命名为“Activity”。“Offscreen”意味着它仅适用于不可见的应用程序部分，但在研究该功能时，我们意识到应用程序的某些部分可能是可见但不活动的，例如模态框后面的内容。新名称更贴近于标记应用程序的某些部分为“active”或“inactive”的行为。

Activity 仍处于研究阶段，我们剩下的工作是最终确定向库开发人员公开的基本原语。在我们专注于发布更完整功能的同时，我们已将此领域的优先级降低。

* * *

除了此更新之外，我们的团队还在会议上发表了演讲并在播客中露面，更多地讲述我们的工作并回答问题。

- [Sathya Gunasekaran](/community/team#sathya-gunasekaran) 在 [React India](https://www.youtube.com/watch?v=kjOacmVsLSE) 大会上介绍了 React 编译器。

- [Dan Abramov](/community/team#dan-abramov) 在 [RemixConf](https://www.youtube.com/watch?v=zMf_xeGPn6s) 上发表了名为“React from Another Dimension”的演讲，探讨了 React 服务器组件与 Action 可能是如何创建的另一种历史。

- [Dan Abramov](/community/team#dan-abramov) 在 [the Changelog’s JS Party podcast](https://changelog.com/jsparty/311) 上接受了关于 React 服务器组件的采访

- [Matt Carroll](/community/team#matt-carroll) 在 [Front-End Fire podcast](https://www.buzzsprout.com/2226499/14462424-interview-the-two-reacts-with-rachel-nabors-evan-bacon-and-matt-carroll) 上接受了采访，他讨论了 [The Two Reacts](https://overreacted.io/the-two-reacts/)。

感谢 [Lauren Tan](https://twitter.com/potetotes)、[Sophie Alpert](https://twitter.com/sophiebits)、[Jason Bonta](https://threads.net/someextent)、[Eli White](https://twitter.com/Eli_White) 和 [Sathya Gunasekaran](https://twitter.com/_gsathya) 对本文的审核。

感谢你的阅读，期待在 [React Conf](https://conf.react.dev/) 见到你！
