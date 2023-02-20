---
title: '使用 React 预发布版为新功能打基础'
author: [acdlite]
---

为了与 React 生态系统的合作伙伴共享即将发生的变化，我们正式建立了预发布的渠道。我们希望通过这一过程有助于我们胸有成竹地对 React 进行更改，并为开发人员提供尝试试验阶段功能的机会。

> 此文章与从事框架，库或开发工具的开发人员息息相关。而主要使用 React 来构建应用程序的开发者无需担心此预发布渠道。

React 依靠强大的开源社区收集错误报告，pull request 以及 [RFC](https://github.com/reactjs/rfcs)。为了鼓励大家反馈，我们打算共享一些特殊的 React 版本，其中可能包括未发布的功能。

由于 React 的实际来源是[Github 公有库](https://github.com/facebook/react)，因此你始终可以通过此仓库构建一个包含最新修改的 React 副本。但是，对于开发者来说，使用 npm 安装 React 会更加容易，因此我们会时常发布预发布版本到 npm registry 中。最新的示例是 16.7 Alpha 版，其中包括 Hook API 的早期版本。

我们期望开发者更容易地测试 React 的预发布版本，因此我们将通过三个单独的发布渠道来规范我们的流程。

## 发布渠道 {/*release-channels*/}

> 本文中的相关信息可以查阅[发布渠道](/docs/release-channels)章节。每次我们的发布流程发生变化，我们都会更新该流程。

React 的每个发布渠道都是针对不同的用例进行设计地：

- [**最新**](#latest-channel)版本用于稳定的 semver React 版本。此版本可通过 npm 安装获取。此渠道为目前大家已经在用的方式。**其主要用于所有面向用户的 React 应用程序。**
- [**Next**](#next-channel) 版本主要用于追踪 React 源码仓库的 main 分支。我们会将其视为下一个次要版本发布的候选版本。使用它可以进行 React 与第三方项目间的集成测试。
- [**实验阶段**](#experimental-channel)版本包含稳定版本中不提供的实验阶段的 API 与功能。同时它也追踪了 main 分支，但启用了附加新功能的标志。使用此渠道可以尝试即将发布的功能。

所有版本都将发布到 npm，但只要最新版本遵循[语义版本控制](/docs/faq-versioning)。预发布版本（应用于 Next 版本和实验渠道的版本）会根据其内容的哈希值生成版本，例如，Next 的版本为 `0.0.0-1022ee0ec`，实验版为 `0.0.0-experimental-1022ee0ec`。

**最新版是面向用户应用程序的唯一官方支持发布渠道**。提供 Next 和实验版本的目的是用于测试，我们并不保证功能在这两个版本中不发生变化。因为它们并不遵循用于最新版发布的 semver 协议。

通过将预发布版发布到与稳定版同一注册表中，我们可以利用许多支持 npm 工作流的工具，诸如 [unpkg](https://unpkg.com) 和 [CodeSandbox](https://codesandbox.io)。 

### 最新版渠道 {/*latest-channel*/}

最新版是用于稳定 React 版本的渠道。它对应是 npm 中 `latest` 标签。此版本是所有交付给真实用户的 React 应用程序的推荐版本。

**如果你不确定使用哪个版本，则选择最新版本。**如果你是 React 开发者，那这就是你正确的选择。

你可以希望最新版的更新足够稳定。版本遵循语义版本控制方案。你可以在[版本政策](/docs/faq-versioning)中详细了解我们对稳定性和增量迁移的承诺。

### Next 版渠道 {/*next-channel*/}

Next 属于预发布渠道，用于追踪 React 仓库的 main 分支。我们在 Next 渠道中使用预发布版本作为最新版发布渠道的候选版本。你可以将 Next 视为最新版的超集，它的更新频率更高。

最新的 Next 发布版与最新的最新发布版之间的更改程度，大致与两个 semver 次版本之间的更改程度相同。但是，**Next 发布渠道不遵循语义版本控制**。你可能希望在 Next 渠道中的后续发布版本之间偶尔有重大更改。

**不要在面向用户的应用程序中使用预发布版本。**

Next 渠道中的发行版本在 npm 中携带 `next` 标签发布。版本会根据构建内容的哈希值生成，例如 `0.0.0-1022ee0ec`。

#### 使用 Next 渠道版本进行集成测试 {/*using-the-next-channel-for-integration-testing*/}

Next 渠道旨在支持 React 与其他项目直接的集成测试。

React 中的所有更改在发布之前都需进行大量的内部测试。但是，在整个 React 生态系统中使用了无数的环境与配置，因此我们不可能针对每一项进行测试。

如果你是 React 第三方框架，库，开发者工具或类似基础设施项目的作者，则可以通过定期针对最新版本运行的测试用例，帮助我们一起维持 React 稳定，为你的用户和整个 React 社区保驾护航。如果你对此有兴趣，请按照下列步骤进行操作：

- 在你喜欢的持续集成平台上设置 cron job。[CircleCI](https://circleci.com/docs/2.0/triggers/#scheduled-builds) 和 [Travis CI](https://docs.travis-ci.com/user/cron-jobs/) 均支持 cron job。
- 在 cron job 中，使用 npm 的 `next` 标签将 React 版本更新至 Next 渠道中的最新版本。使用 npm cli：

  ```console
  npm update react@next react-dom@next
  ```

  或者使用 yarn：

  ```console
  yarn upgrade react@next react-dom@next
  ```

- 针对更新的 packages 执行测试用例。
- 如果均通过，那么恭喜你！你的项目可以与下个小版本的 React 一起使用。
- 如果发生意外中断，请通过[提交 issus](https://github.com/facebook/react/issues) 告知我们。

Next.js 使用了此工作流。你可以将它们 [CircleCI 配置](https://github.com/zeit/next.js/blob/c0a1c0f93966fe33edd93fb53e5fafb0dcd80a9e/.circleci/config.yml) 作为示例进行参考。

### 实验阶段渠道 {/*experimental-channel*/}

与 Next 相似，实验阶段通道是一个预发布通道，用于追踪 React 仓库 main 分支。但不同于 Next 的是，实验阶段的发布版本包含尚未准备好广泛推广的功能及 API。

通常，对 Next 更新时也会对实验版本进行更新。它们基于相同的源，但是构建时会使用不同的功能标记。

实验阶段发布的版本可能与 Next 和最新版本的发布均不相同。**不要在面向用户的应用程序中使用实验阶段版本。** 你应该能够想象到实验渠道中发布的版本会频繁进行破坏性更新。

实验版本会在 npm 上会以 `experimental` 标签的形式发布。版本会根据构建内容的哈希值生成，例如，`0.0.0-experimental-1022ee0ec`。

#### 实验阶段发布包含哪些内容？ {/*what-goes-into-an-experimental-release*/}

实验阶段功能并未打算公开发布，在最终确定之前可能会发生巨大变化。有些实验功能可能永远不会完成 —— 我们进行实验的目的是为了测试变更提案的可行性。

例如，如果我们在宣布发布 Hook 时，其已经存在在实验渠道中，我们会在最新版本发布 Hook 之前几周，将其发布到实验渠道中。

你可能会发现针对实验阶段进行集成测试很有必要。但是，请注意，实验阶段版本的稳定性是不如 Next 版本的。**我们并不保证实验版本之间的稳定性。**

#### 如何了解有关实验功能的更多信息？ {/*how-can-i-learn-more-about-experimental-features*/}

实验性的功能可能会有文档，也可能不会有文档。通常，在实验渠道的内容发布到 Next 或 Stable 中之前，才会编写文档。

如果找不到文档，则可能会附有 [RFC](https://github.com/reactjs/rfcs) 说明。

当我们准备发布新的实验内容时，我们会发布到 React 博客中，但这并不意味着我们将公开发布每个实验内容。

欲查看完整的变更列表，你可以参考 Github 公有库中的[历史记录](https://github.com/facebook/react/commits/main)。
