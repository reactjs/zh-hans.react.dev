---
title: 版本策略
---

<Intro>

所有稳定版本的 React 都经过了高水平的测试，并遵循语义化版本控制（semver）的规范。React 还提供了不稳定的发布渠道，以鼓励对实验性功能的早期反馈。本页面描述了 React 发布版本的预期特性。

</Intro>

## 稳定版本 {/*stable-releases*/}

稳定的 React 版本（也被称为 Latest 发布渠道）遵循语义化版本控制（semver）的原则。

这意味着，根据版本号 **x.y.z**：

- 当发布 **关键性的错误修复** 时，我们通过改变 **z** 数字进行 **补丁发布**（例如：15.6.2 变为 15.6.3）。
- 当发布 **新功能** 或 **非关键性修复** 时，我们通过改变 **y** 数字进行 **次要版本发布**（例如：15.6.2 变为 15.7.0）。
- 当发布 **破坏性变更** 时，我们通过改变 **x** 数字进行 **主要版本发布**（例如：15.6.2 变为 16.0.0）。

主要版本发布也可以包含新功能，而任何版本都可以包括错误修复。

次要版本发布是最常见的发布类型。

### 破坏性版本 {/*breaking-changes*/}

破坏性改变对每个人都不方便，因此我们试图尽量减少主要版本的发布数量 - 例如，React 15 发布于 2016 年 4 月，React 16 发布于 2017 年 9 月，React 17 发布于 2020 年 10 月。

相反，我们在次要版本中发布新功能。这意味着次要版本发布通常比主要版本更有趣和引人注目，尽管它们的名称不太引人注意。

### 致力于稳定 {/*commitment-to-stability*/}

随着时间的推移，我们在改进 React 时，尽量减少利用新功能所需的工作量。如果可能的话，我们会保持旧的 API 可用，即使这意味着将其放在一个单独的包中。例如，[多年来一直不鼓励使用 mixin](https://legacy.reactjs.org/blog/2016/07/13/mixins-considered-harmful.html)，但至今仍然可以通过 [create-react-class](https://legacy.reactjs.org/docs/react-without-es6.html#mixins) 支持，并且许多代码库仍在稳定的遗留代码中使用它们。

超过一百万的开发人员使用 React，共同维护着数百万个组件。仅 Facebook 的代码库就有超过 50000 个 React 组件。这意味着我们需要尽可能地简化升级到新版本 React 的过程；如果我们在没有迁移路径的情况下进行大规模改变，人们将被困在旧版本上。我们在 Facebook 本身上测试这些升级路径——如果我们不到 10 人的团队能够单独更新 50000 多个组件，我们希望任何使用 React 的人都能够轻松进行升级。在许多情况下，我们编写 [自动化脚本](https://github.com/reactjs/react-codemod) 来升级组件语法，然后将其包含在开源发布中供所有人使用。

### 通过警告逐步更新 {/*gradual-upgrades-via-warnings*/}

React 的开发版本包含许多有用的警告信息。只要可能，我们会为即将发生的破坏性改变添加警告信息。这样，如果你的应用在最新版本中没有警告，它将与下一个主要版本兼容。这使你能够逐个组件地升级你的应用程序。

开发警告不会影响你的应用程序的运行行为。这样，你可以确信你的应用程序在开发版本和生产版本之间的行为是一致的——唯一的区别是生产版本不会记录警告，并且它更高效。如果你发现有其他情况，请提交 issue。

### 怎样算破坏性变更？ {/*what-counts-as-a-breaking-change*/}

总的来说，我们不会为以下更改而增加主要版本号：

* **开发警告**。由于这些不会影响生产行为，我们可能会在主要版本之间添加新的警告或修改现有警告。事实上，这正是我们能够可靠地警告即将发生的重大变化的原因。
* **以 `unstable_` 开头的 API**。这些被提供作为实验性功能，我们对其 API 还不够自信。通过以` unstable_` 前缀发布这些版本，我们可以更快地迭代并尽快达到稳定的 API。
* **React 的 alpha 和 Canary 版本**。我们提供 React 的 alpha 版本作为早期测试新功能的一种方式，但我们需要根据在 alpha 期间学到的知识来灵活进行更改。如果你使用这些版本，请注意在稳定版本发布之前 API 可能会发生变化。
* **未记录的 API 和内部数据结构**。如果你访问内部属性名如 `__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED` 或 `__reactInternalInstance$uk43rzhitjg`，则无法得到保证，你将自负其责。

此策略旨在务实：当然，我们不希望给你带来麻烦。如果我们为所有这些更改增加主要版本，我们将不断发布更多的主要版本，并最终给社区带来更多版本管理的困扰。这也意味着我们无法以我们希望的速度推进改进 React。

话虽如此，如果我们预计这个列表中的更改将在社区中引起广泛问题，我们仍然会尽力提供渐进迁移路径。

### 如果一个次要版本没有包含任何新功能，为什么它不是一个补丁版本呢？ {/*if-a-minor-release-includes-no-new-features-why-isnt-it-a-patch*/}

一个次要版本不包含新功能 [是 semver 允许的](https://semver.org/#spec-item-7)，它规定“次要版本可以在私有代码中引入重大的新功能或改进时递增。它可以包含补丁级别的变化。”

然而，这也引出了一个问题，为什么这些发布不被版本化为补丁呢？

答案是，对 React（或其他软件）的任何更改都会带来一些意外破坏的风险。想象一个场景，一个修复一个 bug 的补丁版本却意外引入了另一个 bug。这不仅会对开发者造成困扰，还会损害他们对未来补丁版本的信心。如果原始修复是为了一个在实践中很少遇到的 bug，那就更令人遗憾了。

我们在保持 React 版本无 bug 方面的记录相当不错，但是补丁版本的可靠性要求更高，因为大多数开发者都认为它们可以无副作用地采用。

出于这些原因，我们只将补丁版本保留给最关键的 bug 和安全漏洞。

如果一个发布包含非必要的更改，比如内部重构、实现细节的更改、性能改进或小的 bug 修复，即使没有新功能，我们也会递增次要版本号。

## 所有发布渠道 {/*all-release-channels*/}

React 依赖于充满活力的开源社区来提交 bug 报告、发起拉取请求和 [提交 RFC](https://github.com/reactjs/rfcs)。为了鼓励反馈，我们有时会分享包含未发布功能的特殊版本的 React。

<Note>

这一部分对于开发框架、库或开发者工具的开发人员来说最相关。主要用 React 构建面向用户的应用程序的开发人员不需要担心我们的预发布渠道。

</Note>

React 的每个发布渠道都针对不同的情况设计：

- **Latest** 是稳定的、符合语义化版本规范的 React 版本。当从 npm 安装 React 时，就会得到这个版本。这也是大家今天已经在使用的渠道。**直接使用 React 构建面向用户的应用程序使用此渠道**。
- **Canary** 追踪 React 源代码仓库的主分支，可以将其视为下一个语义化版本发布的候选版本。**[框架或其他经过策划的设置可能会选择使用此渠道，并固定版本的 React](/blog/2023/05/03/react-canaries)**。也可以使用 Canary 进行 React 与第三方项目之间的集成测试。
- **Experimental** 包含实验性的 API 和在稳定版中不可用的功能。它们也追踪主分支，但是会打开额外的功能开关。使用此渠道可在发布之前尝试即将推出的功能。

所有版本都会发布到 npm，但只有 Latest 版本使用语义化版本号。预发布版本（Canary 与 Experimental）的版本是根据其内容和提交日期的哈希值生成的，例如 Canary 版本的 `18.3.0-canary-388686f29-20230503` 以及 Experimental 版本的 `0.0.0-experimental-388686f29-20230503`。

**Latest 和 Canary 渠道都得到官方支持，用于面向用户的应用程序，但期望不同**：

- Latest 版本遵循传统的语义化版本模型。
- Canary 版本 [必须绑定版本](/blog/2023/05/03/react-canaries)，可能包含破坏性更改。它们适用于想要根据自己的发布计划逐步发布新的 React 功能和 bug 修复的经过策划的设置（如框架）。

Experimental 版本仅供测试目的提供，并且我们不保证行为在发布之间不会发生变化。它们不遵循我们在 Latest 版本发布中使用的语义化版本协议。

通过将预发布版本发布到与稳定版本相同的注册表中，我们能够利用许多支持 npm 工作流程的工具，如 [unpkg](https://unpkg.com) 与 [CodeSandbox](https://codesandbox.io)。

### Latest 渠道 {/*latest-channel*/}

Latest 是用于稳定版 React 发布的渠道。它对应于 npm 上的 `latest` 标签。对于所有发布给真实用户的 React 应用程序，推荐使用此渠道。

**如果你不确定应该使用哪个渠道，那就使用 Latest**。如果你直接使用 React，那使用的就是 Latest 渠道。你可以期望 Latest 的更新非常稳定。版本遵循之前描述的语义化版本方案。

### Canary 渠道 {/*canary-channel*/}

Canary 渠道是一个预发布渠道，追踪 React 仓库的主分支。我们将 Canary 渠道中的预发布版本用作 Latest 渠道的候选发布版本。你可以将 Canary 视为比 Latest 更频繁更新的超集。

最近的 Canary 版本与最近的 Latest 版本之间的变化程度大致与两个次要 semver 版本之间的变化程度相同。然而，**Canary 渠道不符合语义化版本规范**。你需要注意在 Canary 渠道的连续版本之间会偶尔出现破坏性更改。

**除非遵循 [Canary 工作流程](/blog/2023/05/03/react-canaries)，否则不要直接在面向用户的应用程序中使用预发布版本**。

Canary 发布使用 npm 上的 `canary` 标签进行标识。版本是根据构建内容和提交日期的哈希值生成的，例如 `18.3.0-canary-388686f29-20230503`。

#### 使用 canary 渠道进行集成测试 {/*using-the-canary-channel-for-integration-testing*/}

Canary 渠道还支持 React 与其他项目之间的集成测试。

在向公众发布之前，React 的所有更改都经过了广泛的内部测试。然而，在整个 React 生态系统中使用了大量的环境和配置，我们无法对每个环境都进行测试。

如果你是第三方 React 框架、库、开发者工具或类似的基础设施项目的作者，可以通过定期运行测试套件来帮助我们为你的用户和整个 React 社区保持 React 的稳定性。如果你有兴趣，请按照以下步骤进行操作：

- 使用你喜欢的持续集成平台设置一个 cron 作业。cron 作业受到 [CircleCI](https://circleci.com/docs/2.0/triggers/#scheduled-builds) 与 [Travis CI](https://docs.travis-ci.com/user/cron-jobs/) 的支持。
- 在 cron 作业中，使用 `canary` 标签从 Canary 渠道更新你的 React 包至最新的 React 版本。像下面一样使用 npm 命令行：

  ```console
  npm update react@canary react-dom@canary
  ```

  或者使用 yarn：

  ```console
  yarn upgrade react@canary react-dom@canary
  ```
- 运行测试套件以测试更新后的包。
- 如果一切顺利，那太好了！可以开始期望你的项目将与下一个次要版本的 React 配合使用。
- 如果出现意外的错误，请通过 [提交 issue](https://github.com/facebook/react/issues) 告诉我们。

Next.js 使用了此工作流程，你可以参考他们的 [CircleCI 配置](https://github.com/zeit/next.js/blob/c0a1c0f93966fe33edd93fb53e5fafb0dcd80a9e/.circleci/config.yml) 作为示例。

### Experimental 渠道 {/*experimental-channel*/}

与 Canary 类似，Experimental 渠道是一个预发布渠道，追踪 React 仓库的主分支。与 Canary 不同，实验性版本包括尚未准备好广泛发布的其他功能和 API。

通常，Canary 的更新会伴随着 Experimental 的相应更新。它们基于相同的源代码修订版本，但使用不同的功能开关进行构建。

实验性版本可能与 Canary 和 Latest 版本有显著差异。**不要在面向用户的应用程序中使用实验性版本**。你需要注意 Experimental 渠道的版本之间经常会发生破坏性更改。

实验性版本使用 npm 上的 `experimental` 标签进行标识。版本是根据构建内容和提交日期的哈希值生成的，例如 `0.0.0-experimental-68053d940-20210623`。

#### 实验版的发布内容是什么？ {/*what-goes-into-an-experimental-release*/}

实验性功能是那些尚未准备好发布给更广泛的公众使用，并且在最终确定之前可能会发生巨大变化的功能。有些实验性功能可能永远不会最终确定，我们进行实验的目的是为了测试拟议变更的可行性。

例如，如果在我们宣布 Hook 时存在 Experimental 渠道，我们会在 Hook 在最新版中可用之前的几周将其发布到 Experimental 渠道。

你可能会发现对实验版运行集成测试很有价值。这取决于你自己。但请注意，实验性版本的稳定性甚至不如 Canary。**我们不保证实验性版本任何稳定性**。

#### 如何了解更多关于实验性功能的信息？ {/*how-can-i-learn-more-about-experimental-features*/}

实验性功能可能有文档，也可能没有。通常情况下，实验性功能在 Canary 或 Latest 即将发布时才会撰写进入文档。

如果一个功能没有文档，可能会有一个 [RFC](https://github.com/reactjs/rfcs) 与之配套。

当我们准备好宣布新的实验性功能时，我们会在 [React 博客](/blog) 上发布相关信息，但这并不意味着我们会宣传每一个实验性功能。

你可以随时参考我们公开的 GitHub 仓库的 [历史记录](https://github.com/facebook/react/commits/main) 以获取完整的变更列表。
