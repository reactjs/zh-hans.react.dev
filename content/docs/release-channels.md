---
id: release-channels
title: 发布渠道
permalink: docs/release-channels.html
layout: docs
category: installation
prev: cdn-links.html
next: hello-world.html
---

React 依靠强大的开源社区收集 bug 报告，发起 pull request 和 [提交 RFC](https://github.com/reactjs/rfcs)。为了鼓励大家反馈，我们打算共享一些特殊的 React 版本，其中包括未发布的功能。

> 此文章与从事框架，库或开发工具的开发人员息息相关。而主要使用 React 来构建应用程序的开发者无需担心此预发布渠道。

React 的每个发布渠道都是针对不同的用例进行设计的：

- [**最新**](#latest-channel)版本用于稳定的 semver React 版本。此版本可通过 npm 安装获取。此渠道为目前大家已经在用的方式。**其主要用于所有面向用户的 React 应用程序。**
- [**Next**](#next-channel) 版本主要用于追踪 React 源码仓库的 main 分支。我们会将其视为下一个次要版本发布的候选版本。使用它可以进行 React 与第三方项目间的集成测试。
- [**实验阶段**](#experimental-channel)版本包含稳定版本中不提供的实验阶段的 API 与功能。同时它也追踪了 main 分支，但启用了附加新功能的标志。使用此渠道可以尝试即将发布的功能。

所有版本都将发布到 npm，但只有最新版本遵循[语义版本控制](/docs/faq-versioning.html)。预发布版本（应用于 Next 和实验渠道的版本）会根据其内容的哈希值和提交日期生成版本号，例如，Next 的版本为 `0.0.0-68053d940-20210623`，实验版则为 `0.0.0-experimental-68053d940-20210623`。

**最新版是面向用户应用程序的唯一官方支持发布渠道**。提供 Next 和实验版本的目的是用于测试，我们并不保证功能在这两个版本中不发生变化。因为它们并不遵循用于最新版发布的 semver 协议。

将预发布版本发布到与稳定版本相同的注册表，我们可以利用许多支持 npm 工作流的工具，比如：[unpkg](https://unpkg.com) 和 [CodeSandbox](https://codesandbox.io)。

### 最新版渠道 {#latest-channel}

最新版是用于稳定 React 版本的渠道。它对应是 npm 中 `latest` 标签。此版本是所有交付给真实用户的 React 应用程序的推荐版本。

**如果你不确定应该使用哪个版本，那就用最新版**。如果你是 React 开发人员，那么这就是你正确的选择。

你可以认为最新版的更新是非常稳定的。版本遵循语义版本控制方案。在[版本政策](/docs/faq-versioning.html)中了解更多关于我们对稳定性和增量迁移的承诺。

### Next 渠道 {#next-channel}

Next 属于预发布渠道，用于追踪 React 仓库的 main 分支。我们使用在 Next 渠道的预发布版本作为最新版发布渠道的候选版本。你可以将 Next 视为最新版的超集，它的更新频率更高。

最近的 Next 版本和最近的最新版本之间的变化程度，与两个次要的 semver 版本之间的变化程度大致相同。但是，**Next 渠道不遵循语义版本控制。**在 Next 渠道中，你应该预期到后续的版本中偶尔会有不兼容的改动。

**不要在面向用户的应用程序中使用预发布版本。**

Next 渠道中的预发布版本在 npm 中携带 `next` 标签发布。版本号是根据其构建内容的哈希值和提交日期生成的，例如：`0.0.0-68053d940-20210623`。

#### 使用 Next 渠道进行集成测试 {#using-the-next-channel-for-integration-testing}

Next 渠道用于支持 React 与其他项目之间的集成测试。

React 的所有更改在发布之前都要经过大量的内部测试。然而，React 的整个生态系统使用了无数的环境和配置，我们不可能针对每一项进行测试。

如果你是 React 第三方框架，库，开发者工具或类似基础设施项目的作者，则可以通过定期针对最新版本运行的测试用例，帮助我们一起维持 React 稳定，为你的用户和整个 React 社区保驾护航。如果你对此有兴趣，请按照下列步骤进行操作：

- 在你喜欢的持续集成平台上设置 cron job。[CircleCI](https://circleci.com/docs/2.0/triggers/#scheduled-builds) 和 [Travis CI](https://docs.travis-ci.com/user/cron-jobs/) 均支持 cron job。
- 在 cron job 中，使用 npm 的 `next` 标签将 React 版本更新至 Next 渠道中的最新版本。使用 npm cli：

  ```console
  npm update react@next react-dom@next
  ```

  或者 yarn：

  ```console
  yarn upgrade react@next react-dom@next
  ```
- 针对更新的 packages 运行你的测试用例。
- 如果均通过，那么恭喜你！你的项目可以与下个小版本的 React 一起使用。
- 如果发生意外中断，请通过[提交 issues](https://github.com/facebook/react/issues) 告知我们。

Next.js 项目使用了这个工作流。你可以参考他们的 [CircleCI 配置](https://github.com/zeit/next.js/blob/c0a1c0f93966fe33edd93fb53e5fafb0dcd80a9e/.circleci/config.yml)作为示例。

### 实验版渠道 {#experimental-channel}

与 Next 相似，实验版渠道是一个预发布渠道，用于追踪 React 仓库 main 分支。但不同于 Next 的是，实验版包含尚未准备好广泛推广的功能及 API。

通常，对 Next 更新时也会对实验版本进行更新。它们基于相同的源，但是构建时会使用不同的功能标记。

实验阶段发布的版本可能与 Next 和最新版本的发布均不相同。**不要在面向用户的应用程序中使用实验版。** 你应该能够想象到实验渠道中发布的版本会频繁进行破坏性的更新。

实验版本会在 npm 上会以 `experimental` 标签的形式发布。版本会根据构建内容的哈希值和提交日期生成，例如，`0.0.0-experimental-68053d940-20210623`。

#### 实验阶段发布包含哪些内容？{#what-goes-into-an-experimental-release}

实验阶段的功能并未打算公开发布，在最终确定之前可能会发生重大变化。有些实验功能可能永远不会完成 —— 我们进行实验的目的是为了测试变更提案的可行性。

例如，如果我们在宣布发布 Hook 时，其已经在实验渠道中存在，我们会在最新版本发布 Hook 的前几周，将其发布到实验渠道中。

你可能会发现在实验阶段进行集成测试是很有必要的。但是，请注意，实验阶段版本的稳定性不如 Next 版本。**我们并不保证实验版本之间的稳定性。**

#### 如何了解有关实验功能的更多信息？ {#how-can-i-learn-more-about-experimental-features}

实验性的功能可能会有文档，也可能不会有文档。通常，在实验渠道的内容发布到 Next 或 Latest 中之前，才会编写文档。

如果找不到文档，则可能会附有 [RFC](https://github.com/reactjs/rfcs) 说明。

当我们准备发布新的实验内容时，我们会发布到 [React 博客](/blog)中，但这并不意味着我们将公开发布每个实验的内容。

你可以参考 Github 公开仓库的[历史记录](https://github.com/facebook/react/commits/main)以查看完整的变更列表。
