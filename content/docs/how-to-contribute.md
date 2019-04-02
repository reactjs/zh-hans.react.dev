---
id: how-to-contribute
title: How to Contribute
layout: contributing
permalink: docs/how-to-contribute.html
next: codebase-overview.html
redirect_from:
  - "contributing/how-to-contribute.html"
  - "tips/introduction.html"
---
React是Facebook的首先开源项目的一个，它仍然还在开发并且把代码带给每个人。我们仍然在规划操作指南使贡献工程尽可能简单和透明，但是我们做的还不够好。希望这个文档使贡献的步骤清晰和回答一些你们的问题。

### [行为守则](https://code.facebook.com/codeofconduct) {#code-of-conduct}
Facebook已经采纳的行为守则，我们希望工程的参与者跟随它。请读[完整版](https://code.facebook.com/codeofconduct),以致我们知道什么该做什么不该做。

### 开放式开发 {#open-development}
在React进行的所有工作直接发生在[GitHub](https://github.com/facebook/react)上。核心团队成员和外部的贡献者发起拉取代码的请求都是经过同样的审查流程。

### 分支组织 {#branch-organization}
我们将尽我们最大的努力保持[`master` 分支](https://github.com/facebook/react/tree/master)的稳定，确保测试总是通过的。但是为了行动的更快，我们将使做出和你们应用不兼容的改变。我们推荐你使用[React最新的稳定版](/downloads.html).
如果你们发起一个拉取的请求，请不要在`master`分支上这么做。我们维持稳定分支为主要版本的分别，但我们不能接收直接从它们拉取请求。代替，我们优选非中断性改变从master到最新的稳定版本。

### 语义化版本 {#semantic-versioning}
React遵从[语义化版本](https://semver.org/).我们为修复问题发布补丁版本，最小的版本针对新功能，和主要版本为中断性的改变。当我们做出中断性改变，我们也介绍过期的警告在小版本里以致用户知道即将到来的改变和提前迁移他们的代码。
我们附加每个拉取请求一个标签，标记这个改变是否在下个[补丁](https://github.com/facebook/react/pulls?q=is:open+is:pr+label:semver-patch)中发布，[最小版本](https://github.com/facebook/react/pulls?q=is:open+is:pr+label:semver-minor)，或者[主要版本](https://github.com/facebook/react/pulls?q=is:open+is:pr+label:semver-major)。我们每几个星期发布新的补丁版本，每几个月发布一个最小版本，和一年两次的主要版本。
每次重大的改变写在[改变日志文件](https://github.com/facebook/react/blob/master/CHANGELOG.md)里。

### 问题 {#bugs}

#### 从哪里发现已知的问题 {#where-to-find-known-issues}
我们正在使用[GitHub Issues](https://github.com/facebook/react/issues)管理我们的公共bugs。我们密切关注这个和当我们正在按照进度修复问题的时候使它更清楚。在我们完成任务之前，试着确保问题不在存在。

#### 报告新的问题 {#reporting-new-issues}
做好的方式知道你修复的问题是提供一个简化的测试用例。这个[JSFiddle template](https://jsfiddle.net/Luktwrdm/)是一个着手点。

#### 安全问题 {#security-bugs}
Facebook有一个[安全程序](https://www.facebook.com/whitehat/)为安全问题中的安全泄露。请记住，不要发布在公共问题中；请按照那页的处理大纲走。

### 如何取得联系 {#how-to-get-in-touch}

* 在线聊天系统: [#reactjs on freenode](https://webchat.freenode.net/?channels=reactjs)
* 论坛: [discuss.reactjs.org](https://discuss.reactjs.org/)
假如你需要React相关的帮助，在Discard聊天平台上的React用户的交流群也是一种选择。

### 提议一个改变 {#proposing-a-change}
如果你想要改变一个公共API,或者在实现上做出有意义的改变，我们推荐[发出一个问题](https://github.com/facebook/react/issues/new)。在你付出很大努力之前请让我们在提议上达成一个协议。
如果你仅仅修复了一个问题，立即提交一个拉取请求是好的，但是我们仍然推荐你发一个正在修复问题的详情。假入我们不接受那个指定的修复，但我们想追踪这个问题，这样将会很有用。

### 你的第一次拉取请求 {#your-first-pull-request}
你第一次拉取请求吗？你可以从免费的系列视频中学习怎么做：

**[在GitHub上怎么贡献开源项目](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github)**
为了帮助你一步一个脚印的熟悉我们的贡献步骤，我们有一个**[好问题](https://github.com/facebook/react/issues?q=is:open+is:issue+label:"good+first+issue")** 的列表，那个列表包含相对限制范围的问题。这是一个开始的好地方。
如果你决定去修复一个问题，请确保检查评论线以防有人正在修复这个问题。如果在那会儿没有人正在修复，请留下一个评论声明你正在修复这个问题，所以其他人不会突然重复你的任务。
如果有人声明的问题超过两个星期没有跟进它，你可以去接管它，但你仍然要留下一个评论。

### 正在发送一个拉取请求 {#sending-a-pull-request}
核心团队正在管理拉取请求。我们将审核你的拉取请求，或者合并它，或者请求改变它，或者关闭它并给出一个解释。针对API的改变，我们可能需要在Facebook.com内部使用它，那将可能引起一些延迟。我们将全程尽最大努力提供更新和反馈。

**在提交一个拉取请求之前,** 请确保以下已经完成了:
1. 分叉[代码库](https://github.com/facebook/react)和创建你的分支从`master`。
2. 运行`yarn在库的根目录。
3. 如果你修复一个问题或者添加代码，那些代码应该被测试，添加测试！
4. 确保你的测试套件通过 (`yarn test`)。提示：在开发中`yarn test --watch TestName`是有用的。
5. 运行`yarn test-prod`去测试在产品环境中。它支持和`yarn test`同样的可选项。
6. 如果你需要一个调试器，运行`yarn debug-test --watch TestName`，打开`chrome://inspect`,和按"Inspect"。
7. 格式化你的代码用[prettier](https://github.com/prettier/prettier)这个工具 (`yarn prettier`).
8. 确保你的代码没有错误 (`yarn lint`). 提示: `yarn linc` 仅仅检查已经改变的文件.
9. 运行[Flow](https://flowtype.org/) 进行类型检查 (`yarn flow`).
10. 如果你还没有拥有, 完成 CLA.

### 贡献者授权协议(CLA) {#contributor-license-agreement-cla}
为了去接收你的拉取请求，我们需要你提交一个贡献者授权协议。你仅仅需要做这个一次，如果你已经在另外一个Facebook开源项目中做过，你将会很擅长做它。如果你正在首次提交一个拉取请求，仅仅让我们知道你已经完成贡献者授权协议和我们可以复审你的GitHub用户名。

**[在这儿完成你的贡献者授权协议](https://code.facebook.com/cla)**

### 贡献的先决条件 {#contribution-prerequisites}
* 你安装的[Node](https://nodejs.org)版本在v8.0.0+和[Yarn](https://yarnpkg.com/en/)的版本在v1.2.0+。
* 你已经安装`gcc`或者正在安装合适的编译器。一些依赖可能需要一个编译步骤。在OS X上，这个Xcode 命令行工具将包含这。在Ubuntu上， `apt-get install build-essential` 将安装需要的包。相似的命令应该工作在其他的Linux版本上。Windows将需要额外的步骤，详细情况请看 [`node-gyp` 安装说明](https://github.com/nodejs/node-gyp#installation)。
*你熟悉Git。

### 开发工作流 {#development-workflow}
在cloning React代码后，运行`yarn`去刷新它的依赖。
然后，你可以运行几个命令：
* `yarn lint` 检查代码样式。
* `yarn linc` 跟`yarn lint`很像但是更快，因为它仅仅检查在分支上不同的文件。
* `yarn test` 运行完整的一套测试。
* `yarn test --watch`运行一个交互式的监视器。
* `yarn test <pattern>` 运行和文件名匹配的测试。
* `yarn test-prod`运行产品环境的测试， 它支持和`yarn test`同样的可选项。
* `yarn debug-test` 跟 `yarn test`一样，但是有一个调试器。打开`chrome://inspect`和按"Inspect"。
* `yarn flow` 运行[Flow](https://flowtype.org/)进行代码检查。
* `yarn build`创建一个包含所有包的`build`目录。
* `yarn build react/index,react-dom/index --type=UMD` 创建Reac和ReactDOM的UMD构建。
我们推荐运行`yarn test`(或者上面的变量)，为了确保改变代码的时候不会引入任何后悔的操作。不管怎么样在真实应用中很方便构建React。
首先，运行`yarn build`。在`build`文件里将生成一个预构建的bundles，也在`build/packages`文件夹里准备npm的包。

最简单的方式去尝试你的改变是去运行`yarn build react/index,react-dom/index --type=UMD`，然后打开`fixtures/packaging/babel-standalone/dev.html`文件，这个文件已经使用 `build`目录下的`react.development.js`文件，所以它将加载你的改变。

如果你想在已经存在的工程中尝试你的改变，你可以复制`build/dist/react.development.js`, `build/dist/react-dom.development.js`，或者任何在你应用里的其他构建产品，使用它们来代替稳定版本。如果你的项目使用的React来自npm，你可以在它的依赖中删除`react` 和 `react-dom`，并且使用`yarn link`指向它们在本地的build目录：
```sh
cd ~/path_to_your_react_clone/build/node_modules/react
yarn link
cd ~/path_to_your_react_clone/build/node_modules/react-dom
yarn link
cd /path/to/your/project
yarn link react react-dom
```
每次你在React目录里运行`yarn build`，更新的版本将会显示在工程的`node_modules`文件夹里。你可以重新构建你的工程去试试你的改变。
我们人让要求你的拉取请求包含为新功能添加的单元测试。这个方式我们可以确保在未来不会损坏你的代码。

### 样式指导 {#style-guide}
我们使用一个叫[Prettier](https://prettier.io/)的自动代码格式器。
在改变任何代码后，运行`yarn prettier`。

然后，我们的linter将找出存在代码中的最多问题。
你可以简单通过运行`yarn linc`检查你的代码样式状态。
不管怎么样，仍然有些样式问题而linter找不出来。如果不肯定一些事情，看看[Airbnb的样式指导](https://github.com/airbnb/javascript)将指明你正确的方向。

### 介绍视频 {#introductory-video}
你可能感兴趣这个[短视频](https://www.youtube.com/watch?v=wUpPsEcGsg8) (26 分钟)，这个视频将介绍怎么贡献React。

#### 视频高亮: {#video-highlights}
- [4:12](https://youtu.be/wUpPsEcGsg8?t=4m12s) - 构建和测试本地的React。
- [6:07](https://youtu.be/wUpPsEcGsg8?t=6m7s) - 创建一个拉取请求
- [8:25](https://youtu.be/wUpPsEcGsg8?t=8m25s) - 组织代码
- [14:43](https://youtu.be/wUpPsEcGsg8?t=14m43s) - React npm 登记
- [19:15](https://youtu.be/wUpPsEcGsg8?t=19m15s) - 添加新的功能。

对于第一次贡献React的_感觉_的正式概述，检出[有趣的ReactNYC讨论](https://www.youtube.com/watch?v=GWCcZ6fnpn4).
For a realistic overview of what it _feels_ like to contribute to React for the first time, check out [this entertaining ReactNYC talk](https://www.youtube.com/watch?v=GWCcZ6fnpn4).

### 评论请求(RFC) {#request-for-comments-rfc}
很多改变，包括问题修复和文档改善通过正常的GitHub拉取请求工作流可以被实现和预览。

一些改变的想法是重大的，我们要求它们通过一个设计过程并且在React核心团队中间产生共识。
这个"RFC"(评论请求)过程是想要为工程添加的新功能提供一个稳定和被控制的路径，你们可以贡献通过访问[rfcs库](https://github.com/reactjs/rfcs)。

### 许可证 #license}
为了贡献React, 你同意你的贡献被MIT许可证许可。

### 下一个是是什么? {#what-next}

读[下一部分](/docs/codebase-overview.html)去学习基本代码是如何被组织的。
