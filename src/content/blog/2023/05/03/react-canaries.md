---
title: "React Canaries：在 Meta 之外逐步推出新功能"
---

2023 年 5 月 3 日 [Dan Abramov](https://twitter.com/dan_abramov)、[Sophie Alpert](https://twitter.com/sophiebits)、[Rick Hanlon](https://twitter.com/rickhanlonii)、[Sebastian Markbåge](https://twitter.com/sebmarkbage) 与 [Andrew Clark](https://twitter.com/acdlite)

---

<Intro>

我们希望为 React 社区提供一种选择，使他们能够在新功能设计接近最终状态时立即采用这些功能——类似于 Meta 内部使用 React 的方式。我们正在推出一个新的官方支持的 [Canary 发布渠道](/community/versioning-policy#canary-channel)。它允许如框架一样的 curated setup，将对单个 React 功能的采用与 React 发布计划分离开。

</Intro>

---

## tl;dr {/*tldr*/}

我们正在引入一个官方支持的 React [Canary 发布渠道](/community/versioning-policy#canary-channel)。由于它得到了官方支持，如果出现任何回归（regression）问题，我们将像处理稳定版本的错误一样予以处理。
Canary 能够让你在它们出现在 semver 稳定版本之前开始使用单个新的 React 功能。
与 [实验性](/community/versioning-policy#experimental-channel) 渠道不同，React Canary 仅包括我们认为准备采用的合理功能。我们鼓励框架考虑锁定 Canary React 发布版本。
即使有关内容已经出现在了 Canary 版本中，我们仍将在博客中宣布重大变更和新功能。
**一如既往，React 在每个稳定版本中都遵循 semver 语义化版本控制模块**。

## 新功能通常是如何开发的 {/*how-react-features-are-usually-developed*/}

通常，每个 React 功能都将经历以下相同阶段：

1. 开发初始版本，并添加前缀 `experimental_` 或 `unstable_`，表示该功能仅在 `experimental` 发布渠道中可用。此时，该功能预计会发生重大变化。
2. 找到一个愿意帮助我们测试该功能并提供反馈的 Meta 团队，这将导致一轮变更。随着功能变得更加稳定，我们与更多的 Meta 团队一起尝试它。
3. 最终，我们对此设计感到有信心。我们从 API 名称中删除对应前缀，并使该功能默认在 `main` 分支上可用，表示大多数 Meta 产品都在使用。此时，任何 Meta 团队都可以使用此功能。
4. 当我们对该方向有信心时，我们也会发布一个新功能的 RFC。此时，我们知道此设计适用于广泛的情况，但可能会进行最后一些调整。
5. 当我们接近发布一项开源版本时，我们将为该功能编写文档，并最终在稳定的 React 版本中发布该功能。

这个流程对我们迄今发布的大多数功能都有效。但是，新功能在“通常可以使用（步骤 3）”与“在开源中发布（步骤 5）”之间可能存在显著差距。

**我们希望为 React 社区提供与 Meta 相同的选择，让单个新功能（在其可用时）可以更早地被采用，而无需等待 React 的下一个发布周期**。

与往常一样，所有 React 功能最终都将进入稳定的版本。

## 能否只发布更多的小版本更新？ {/*can-we-just-do-more-minor-releases*/}

通常情况下，我们确实会使用小版本更新来引入新功能。

然而，这并非总是可行的。有时，新功能与其他尚未完全完成且仍在积极迭代的新功能相互关联。由于它们的实现相关联，因此无法分别发布。同样，因为它们可能会影响相同的软件包（例如 `react` 和 `react-dom`），我们也不能将它们分别版本化。我们需要不断对尚未准备就绪的部分进行迭代，所以不会出现大量主要版本发布，这是 semver 要求我们做到的。

在 Meta，我们通过从 `main` 分支构建 React，并手动将其更新为每周的特定锁定提交来解决这个问题。这也是 React Native 发布在过去几年中一直遵循的方法。每个 *稳定的* React Native 发布都锁定在 React 仓库的 `main` 分支的特定提交上。这使得 React Native 可以包含重要的错误修复，并在框架级别逐步采用新的 React 功能，而不会与全局 React 发布时间表耦合。

我们希望将这种工作流程提供给其他框架和 curated setup。例如，在破坏性更改进入稳定性发布之前，它允许基于 React 的框架包含与 React 相关的破坏性更改。由于一些破坏性更改仅影响框架集成，因此这会特别有用。这使得框架可以在其自己的小版本中发布此类更改而不会破坏 semver。

Canary 的滚动发布将允许我们拥有更紧密的反馈循环，并确保新功能在社区中得到全面测试。这种工作流程更接近于 TC39——JavaScript 标准委员会——[处理编号阶段中的更改](https://tc39.es/process-document/) 的方式。在 React 稳定发布之前，建立在 React 之上的框架中可能会提供新的 React 功能，就像在浏览器中提供新的 JavaScript 功能一样，尽管它们尚未被正式批准为规范的一部分。

## 为什么不使用实验性发布？ {/*why-not-use-experimental-releases-instead*/}

虽然在技术上可以使用 [实验性发布](/community/versioning-policy#canary-channel)，但我们建议不要在生产环境中使用它们，因为实验性 API 在稳定之前可能会经历重大的破坏性更改（甚至可能完全被删除）。而尽管 Canary 也可能包含错误（与任何版本发布一样），但我们会计划在博客上宣布 Canary 中的任何重大破坏性更改。Canary 最接近 Meta 内部运行的代码，所以它们通常是相对稳定的。但是，在更新锁定提交之间，你需要锁定版本并手动检查 GitHub 提交日志。

**我们预计，在未经策划设置（如框架）的情况下使用 React 的大多数人将希望继续使用稳定版本**。但是，如果你正在构建一个框架，你可能想考虑锁定一个特定提交的 Canary 版本的 React，并以你自己的节奏进行更新。这样做的好处是，它可以按照你自己的发布计划，更早为你的用户提供单独完成的 React 功能和错误修复。这类似于 React Native 在过去几年中一直在做的。缺点是，你需要承担额外的责任来审核哪些 React 提交应该被 pull，并向你的用户传达哪些 React 更改包含在你的发布中。

如果你是一个框架作者，想尝试这种方法，请与我们联系。

## 更早宣布破坏性更改与新功能 {/*announcing-breaking-changes-and-new-features-early*/}

Canary 发布代表了我们在任何时候对下一个稳定版本的 React 所做的最佳猜测。

传统上，我们只在发布周期的 **最后**（进行主要发布时）宣布破坏性更改。现在，Canary 发布是一种正式支持的使用 React 的方式，我们计划改为在 Canary 中 **已经出现** 破坏性更改和重大新功能时就宣布它们。例如，如果我们合并一个将在 Canary 中发布的破坏性更改，我们将在 React 博客上写一篇关于它的文章，包括必要的 codemods 和迁移说明。然后，如果你是一个框架作者，正在处理一个主要版本的发布，以更新锁定的 React Canary 以包含该更改，你可以在你的发布说明中链接到我们的博客文章。最后，当 React 的稳定主要版本准备好时，我们将链接到那些已经发布的博客文章，我们希望这将帮助我们的团队更快地取得进展。

我们计划记录在 Canary 中已经准备好的 API，即使这些 API 尚未在外部提供。仅在 Canary 中可用的 API 将在相应页面上用特殊注释标记。这将包括像 [`use`](https://github.com/reactjs/rfcs/pull/229) 这样的API，以及一些其他 API（如 `cache` 和 `createServerContext`），我们将为其发送 RFC。

## 锁定 Canary 版本 {/*canaries-must-be-pinned*/}

如果你决定为你的应用程序或框架采用 Canary 工作流，请确保始终锁定 Canary 的 **确切** 版本。由于 Canary 是预发布版本，它们可能仍然包含破坏性更改。

## 例子：React 服务器组件 {/*example-react-server-components*/}

正如我们在三月份 [宣布的那样](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)，React 服务器组件的规范已经最终确定，并且我们不希望出现与用户界面 API 相关的破坏性更改。然而，我们还在继续处理几个相互关联的仅与框架有关的功能（比如 [资源加载](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#asset-loading)），我们预计在这方面还会有更多的破坏性更改。

这意味着 React 服务器组件已经准备好被框架采用。然而在下一个主要的 React 版本发布之前，框架采用它们的唯一方式是锁定 Canary 发布的 React 版本（为了避免捆绑两个 React 副本，希望这样做的框架需要强制解析 `react` 和 `react-dom` 到他们框架中锁定的 Canary 版本，并向他们的用户解释。Next.js App Router 就是这样做的）。

## 同时针对稳定版本和 Canary 版本的测试库 {/*testing-libraries-against-both-stable-and-canary-versions*/}

我们不希望库作者测试每个 Canary 版本，因为这将极其困难。然而，就像我们在三年前 [介绍不同的 React 预发布渠道](https://legacy.reactjs.org/blog/2019/10/22/react-release-channels.html) 时一样，我们鼓励库针对 **最新的** 稳定版本和 Canary 版本运行测试。如果你看到了未经宣布的行为变化，请在 React 仓库中提交一个错误报告，以便我们可以帮助诊断它。我们希望随着这种做法的广泛采用，它将减少升级库到最新 React 主要版本所需的工作量，因为在使用它们时会发现意外的回归问题（regressions）。

<Note>

严格来说，Canary 不是一个 **新的** 发布渠道——它曾经被称为 Next。后来我们决定更名以避免与 Next.js 混淆。我们宣布它是一个 **新的** 发布渠道，也是为了传达新的期望：比如 Canary 是一种正式支持使用 React 的方式。

</Note>

## 稳定版本的发布流程与之前一样 {/*stable-releases-work-like-before*/}

我们不会对稳定性 React 版本进行任何更改。



