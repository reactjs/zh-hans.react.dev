---
id: how-to-contribute
title: 贡献流程
layout: contributing
permalink: docs/how-to-contribute.html
next: codebase-overview.html
redirect_from:
  - "contributing/how-to-contribute.html"
  - "tips/introduction.html"
---

React 是 Facebook 首批开源项目中的一员，开发状态保持活跃，并在 [facebook.com](https://www.facebook.com) 上为我们提供了源代码。现在，我们正不断解决若干个问题以使参与贡献 React 尽可能容易和公开透明，虽然目前还差得很远。我们希望本篇文章能够解释清楚贡献的流程，回答你可能会有的一些问题。

### [行为规范](https://github.com/facebook/react/blob/main/CODE_OF_CONDUCT.md) {#code-of-conduct}

Facebook 将[参与者公约](https://www.contributor-covenant.org/zh-cn/version/1/4/code-of-conduct)作为行为规范，我们希望参与项目的各位严格遵守。请阅读[全文](https://github.com/facebook/react/blob/main/CODE_OF_CONDUCT.md)去了解什么行为允许，什么行为不允许。

### 人人皆可开发 {#open-development}

React 的一切工作在 [GitHub](https://github.com/facebook/react) 上完成，核心团队及其以外的贡献者发送 pull requests，其代码评审流程皆为一致。

### 语义化版本 {#semantic-versioning}

React 遵循[语义化版本](https://semver.org/lang/zh-CN/)。我们对重要的漏洞修复发布修订号；对新特性或不重要的变更发布次版本号；对重大且不兼容的变更发布主版本号。我们在开发重大且不兼容的变更时，还会在次版本号用 deprecation warnings 让用户得知将来的变更并提前迁移代码。请查看[版本号规则](/docs/faq-versioning.html)来了解更多我们在稳定性和渐进迁移方面要做哪些事情。

每一个重要变更参见 [changelog file](https://github.com/facebook/react/blob/main/CHANGELOG.md)。

### 分支管理 {#branch-organization}

请直接提交你的变更至 [`main branch`](https://github.com/facebook/react/tree/main)。对于开发或即将推出的版本，我们不会另建分支。我们尽力保持 `main` 不出问题，并通过所有测试。

合并进入 `main` 的代码必须与最新稳定版本兼容，可以有额外特性，但不能有重大变更。我们应从 `main` 随时能发布新的次版本号。

### 特性切换（Feature Flags）{#feature-flags}

我们为了使 `main` 能够发布，要求重大且不兼容的变更和实验性的特性必须用特性切换。

[`packages/shared/ReactFeatureFlags.js`](https://github.com/facebook/react/blob/main/packages/shared/ReactFeatureFlags.js) 中定义了特性切换。React 的一些版本可能启用了不同的特性切换；比如，React Native 可能与 React DOM 有不同的配置。这些特性切换见于 [`packages/shared/forks`](https://github.com/facebook/react/tree/main/packages/shared/forks)。特性切换使用了静态类型检查器 Flow，因此你可以运行 `yarn flow` 来确认所有必要文件已更新。

React 的构建系统（Build System）会先删去禁用的特性分支，之后再发布。每次 commit 都会运行持续集成（Continuous Integration）来检查包（Bundle）大小的变化。包大小的变化可以用来表明某特性正确合并。

### 漏洞 {#bugs}

#### 何处查找已知 issue {#where-to-find-known-issues}

我们用 [GitHub Issues](https://github.com/facebook/react/issues) 来公开漏洞。我们密切关注该版块，内部解决 bug 时也会想办法说明清楚。在你提交 issue 前，请确定没有重复 issue 出现。

#### 报告新的 issue {#reporting-new-issues}

修复 bug 的最佳方法是给出缩略版的测试用例。这个 [JSFiddle 模板](https://jsfiddle.net/Luktwrdm/)是个不错的起点。

#### 安全漏洞 {#security-bugs}

为了发现安全漏洞，Facebook 实行了漏洞[举报奖励制度](https://www.facebook.com/whitehat/)（Bounty Program）。为此，请不要将这类漏洞提交到 public issues，而要遵循举报奖励制度页面所描述的流程。

### 如何联系我们 {#how-to-get-in-touch}

- 因特网中继聊天（IRC）： [#reactjs on freenode](https://webchat.freenode.net/?channels=reactjs)
- [论坛](/community/support.html#popular-discussion-forums)

你如果需要有关 React 的帮助，还可以前往 Discord 聊天平台，这里建有 React 用户们的[活跃社区](https://www.reactiflux.com/)。

### 提出变更 {#proposing-a-change}

如果你想改变公开的 API，或者对实现有不小的变更，我们建议你[发起 issue](https://github.com/facebook/react/issues/new)，这会让我们先对你的提议达成一致，然后你再着手工作。

如果只是修复漏洞，你当然可以立即提交 pull request，不过我们还是建议先去提出 issue 来说明你修复了什么，这就对一种情况来说就很方便：我们没有接受特定 bug 的修复但想跟进该 issue 的情况。

### 首个 Pull Request {#your-first-pull-request}

在写第一个 Pull Request？你可以从这一系列视频中学习怎么做：

**[How to Contribute to an Open Source Project on GitHub](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)**

为了使你能够快速上手和熟悉贡献流程，我们这里有个列表 **[good first issues](https://github.com/facebook/react/issues?q=is:open+is:issue+label:"good+first+issue")**，里面有相对没那么笼统的漏洞，从这开始是个不错的选择。

如果你想解决一个 issue，请确定检查了该 issue 下的评论以防有人正在处理它。如果目前没人在处理该 issue，那么请留下评论去表明你想处理该 issue 以便其他人不会意外重复你的工作。

如果有人留言表明要处理该 issue 但是超过两周没有跟进，你可以接手工作，不过也应该留言说明。

### 提交 Pull Request {#sending-a-pull-request}

核心团队时刻关注 pull requests，我们会先评审你的 pull request，之后可能会合并，可能会要求再次更改，也可能会关闭该 pull request 并对此作出解释。对于 API 上的变更，我们可能得确认在 Facebook.com 上的内部 API 使用方法，因此该变更可能会推迟。我们会尽力全程更新和反馈。

**提交 pull request 前**，请确保完成以下步骤：

1. Fork [此仓库](https://github.com/facebook/react)，从 `main` 创建分支。
2. 在仓库根目录下执行 `yarn`。
3. 如果你修复了 bug 或者添加了代码，而这些内容需要测试，请添加测试！
4. 确保通过测试套件（`yarn test`）。提示：开发环境下，`yarn test --watch TestName` 很有用。
5. 生产环境下，执行 `yarn test --prod`  来进行测试。
6. 如果需要调试，请执行 `yarn debug-test --watch TestName`，打开 `chrome://inspect`， 之后再打开 “审查”。
7. 使用 [prettier](https://github.com/prettier/prettier)（`yarn prettier`）来格式化代码。
8. 确保 lint 校验代码（`yarn lint`）。提示：执行 `yarn linc` 去只检查更改过的文件。
9. 运行 [Flow](https://flowtype.org/) 来类型检查（`yarn flow`）。
10. 请签订贡献者许可证协议（Contributor License Agreement）。

### 贡献者许可证协议 {#contributor-license-agreement-cla}

为了让你的 pull request 得到接受，你得提交贡献者许可证协议。你只需提交该协议一次，所以如果你曾经对另一个 Facebook 开源项目提交过，那么你已经准备好了。如果你是第一次提交 pull request，请让我们得知你已提交协议，这样我们能多方核对你的 GitHub 用户名。

**[请在这里签订贡献者许可证协议](https://code.facebook.com/cla)**

### 必要条件 {#contribution-prerequisites}

* 你需要安装 [Node](https://nodejs.org) 的 LTS 版本和 [Yarn](https://yarnpkg.com/en/) v1.2.0+。
* 已安装 [JDK](https://www.oracle.com/technetwork/java/javase/downloads/index.html)。
* 你已安装 `gcc`（或者你在有必要安装编译器的情况下也不觉得麻烦），因为一些依赖可能得经过编译，而在 OS X，Xcode 命令行工具会帮你处理；在 Ubuntu，`apt-get install build-essential` 会安装所需的 package（其它 Linux 发行版的类似命令也有效）；在 Windows 上得做些额外步骤，请参考 [`node-gyp` 安装步骤](https://github.com/nodejs/node-gyp#installation)。
* 熟悉 Git。

### 开发工作流程 {#development-workflow}

克隆 React 项目后，执行 `yarn` 来获取依赖。
之后，你可以执行以下命令：

* `yarn lint` 检查代码风格。
* `yarn linc` 和 `yarn lint` 差不多，但是运行地更快，因为只检查了分支中的不同文件。
* `yarn test` 运行完整的测试套装。
* `yarn test --watch` 运行交互式的测试监听器。
* `yarn test --prod` 在生产环境下运行测试。
* `yarn test <pattern>` 匹配文件名，运行响应测试。
* `yarn debug-test` 和 `yarn test` 差不多，不过多了个调试器，你可以打开 `chrome://inspect` 并审查。
* `yarn flow` 运行 [Flow](https://flowtype.org/) 进行类型检查。
* `yarn build` 新建涉及所有包的 `build` 文件夹。
* `yarn build react/index,react-dom/index --type=UMD` 生成只有 React 和 ReactDOM 的 UMD 版本。

我们建议运行 `yarn test`（或上述命令）以确保你的代码没有引入回归，不管怎样，这有助于尝试你的 React 构建版本。

首先，运行 `yarn build`，这会于 `build` 文件夹中生成预先构建的 bundle，还会于 `build/packages` 中生成 npm 包。

想测试你做出的更改的话，最简单的方法就是运行 `yarn build react/index,react-dom/index --type=UMD`，之后再打开 `fixtures/packaging/babel-standalone/dev.html`，该文件已使用 `build` 文件夹内的 `react.development.js` 来搞定你的更改。

如果你想测试你对已有 React 项目做出的更改，你可以复制 `build/node_modules/react/umd/react.development.js` 和 `build/node_modules/react-dom/umd/react-dom.development.js` 或其它构建版本，放入你的应用中并使用这些构建版本而非稳定版。

如果你的项目用 npm，你可以从依赖中删去 `react` 和 `react-dom`，使用 `yarn link` 将其指向本地文件夹的 `build` 目录。请注意，**当请在构建时，传递 `--type=NODE`，而不是 `--type=UMD`。同时，你还需要构建 `scheduler` 的 package：

```bash
cd ~/path_to_your_react_clone/
yarn build react/index,react/jsx,react-dom/index,scheduler --type=NODE

cd build/node_modules/react
yarn link
cd build/node_modules/react-dom
yarn link

cd ~/path/to/your/project
yarn link react react-dom
```

每当你在项目文件夹下运行 `yarn build`，更新版本会出现在 `node_modules` 文件夹，之后可以重新构建项目来测试更改。

如果依然缺少某些 package（例如，可能在项目中使用到 `react-dom/server`），则应始终执行 `yarn build` 进行完整构建。请注意，不带选项运行 `yarn build` 会耗费很长时间。

我们仍要求：`pull request` 得包括新功能对应的单元测试。这样，我们能确保以后你的代码不出问题。

### 风格指南 {#style-guide}

我们使用自动化代码格式化软件 [Prettier](https://prettier.io/)。
对代码做出更改后，运行 `yarn prettier`。

之后，linter 会捕获代码中可能出现的多数问题。
你可以运行 `yarn linc` 来检查代码风格状态。

不过，linter 也有不能搞定的一些风格。如果有些东西不确定，请查看 [Airbnb's Style Guide](https://github.com/airbnb/javascript) 来指导自己。

### 请求意见稿（RFC） {#request-for-comments-rfc}

许多更改（包括修复 bug 和完善文档）会经过通常所用的 GitHub pull request 工作流程来评审。

不过有些更改较大，对此，我们要求这些更改得经过一番设计流程， 并在核心团队中达成共识。

请求意见稿让新特性的合并入库经过一致且受控的流程。你可以前往 [rfcs repository](https://github.com/reactjs/rfcs) 去贡献。

### License {#license}

你贡献 React 的同时也就同意了你的贡献部分使用了 MIT 协议。

### 接下来做什么？ {#what-next}

请阅读[下一部分](/docs/codebase-overview.html)来学习代码库是如何组织的.
