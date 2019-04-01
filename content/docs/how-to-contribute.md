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
1.分叉[代码库](https://github.com/facebook/react)和创建你的分支从`master`。
2.运行`yarn在库的根目录。
3.如果你修复一个问题或者添加代码，那些代码应该被测试，添加测试！
4.确保你的测试套件通过 (`yarn test`)。提示：在开发中`yarn test --watch TestName`是有用的。
5.运行`yarn test-prod`去测试在产品环境中。它支持和`yarn test`同样的可选项。
6.如果你需要一个调试器，运行`yarn debug-test --watch TestName`，打开`chrome://inspect`,和按"Inspect"。
7.格式化你的代码用[prettier](https://github.com/prettier/prettier)这个工具 (`yarn prettier`).
8. 确保你的代码没有错误 (`yarn lint`). 提示: `yarn linc` 仅仅检查已经改变的文件.
9. 运行[Flow](https://flowtype.org/) 进行类型检查 (`yarn flow`).
10.如果你还没有拥有, 完成 CLA.

### 贡献者授权协议(CLA) {#contributor-license-agreement-cla}
为了去接收你的拉取请求，我们需要你提交一个贡献者授权协议。你仅仅需要做这个一次，如果你已经在另外一个Facebook开源项目中做过，你将会很擅长做它。如果你正在首次提交一个拉取请求，仅仅让我们知道你已经完成贡献者授权协议和我们可以复审你的GitHub用户名。

**[在这儿完成你的贡献者授权协议](https://code.facebook.com/cla)**

### 贡献的先决条件 {#contribution-prerequisites}

* You have [Node](https://nodejs.org) installed at v8.0.0+ and [Yarn](https://yarnpkg.com/en/) at v1.2.0+.
* You have `gcc` installed or are comfortable installing a compiler if needed. Some of our dependencies may require a compilation step. On OS X, the Xcode Command Line Tools will cover this. On Ubuntu, `apt-get install build-essential` will install the required packages. Similar commands should work on other Linux distros. Windows will require some additional steps, see the [`node-gyp` installation instructions](https://github.com/nodejs/node-gyp#installation) for details.
* You are familiar with Git.

### Development Workflow {#development-workflow}

After cloning React, run `yarn` to fetch its dependencies.
Then, you can run several commands:

* `yarn lint` checks the code style.
* `yarn linc` is like `yarn lint` but faster because it only checks files that differ in your branch.
* `yarn test` runs the complete test suite.
* `yarn test --watch` runs an interactive test watcher.
* `yarn test <pattern>` runs tests with matching filenames.
* `yarn test-prod` runs tests in the production environment. It supports all the same options as `yarn test`.
* `yarn debug-test` is just like `yarn test` but with a debugger. Open `chrome://inspect` and press "Inspect".
* `yarn flow` runs the [Flow](https://flowtype.org/) typechecks.
* `yarn build` creates a `build` folder with all the packages.
* `yarn build react/index,react-dom/index --type=UMD` creates UMD builds of just React and ReactDOM.

We recommend running `yarn test` (or its variations above) to make sure you don't introduce any regressions as you work on your change. However it can be handy to try your build of React in a real project.

First, run `yarn build`. This will produce pre-built bundles in `build` folder, as well as prepare npm packages inside `build/packages`.

The easiest way to try your changes is to run `yarn build react/index,react-dom/index --type=UMD` and then open `fixtures/packaging/babel-standalone/dev.html`. This file already uses `react.development.js` from the `build` folder so it will pick up your changes.

If you want to try your changes in your existing React project, you may copy `build/dist/react.development.js`, `build/dist/react-dom.development.js`, or any other build products into your app and use them instead of the stable version. If your project uses React from npm, you may delete `react` and `react-dom` in its dependencies and use `yarn link` to point them to your local `build` folder:

```sh
cd ~/path_to_your_react_clone/build/node_modules/react
yarn link
cd ~/path_to_your_react_clone/build/node_modules/react-dom
yarn link
cd /path/to/your/project
yarn link react react-dom
```

Every time you run `yarn build` in the React folder, the updated versions will appear in your project's `node_modules`. You can then rebuild your project to try your changes.

We still require that your pull request contains unit tests for any new functionality. This way we can ensure that we don't break your code in the future.

### Style Guide {#style-guide}

We use an automatic code formatter called [Prettier](https://prettier.io/).
Run `yarn prettier` after making any changes to the code.

Then, our linter will catch most issues that may exist in your code.
You can check the status of your code styling by simply running `yarn linc`.

However, there are still some styles that the linter cannot pick up. If you are unsure about something, looking at [Airbnb's Style Guide](https://github.com/airbnb/javascript) will guide you in the right direction.

### Introductory Video {#introductory-video}

You may be interested in watching [this short video](https://www.youtube.com/watch?v=wUpPsEcGsg8) (26 mins) which gives an introduction on how to contribute to React.

#### Video highlights: {#video-highlights}
- [4:12](https://youtu.be/wUpPsEcGsg8?t=4m12s) - Building and testing React locally
- [6:07](https://youtu.be/wUpPsEcGsg8?t=6m7s) - Creating and sending pull requests
- [8:25](https://youtu.be/wUpPsEcGsg8?t=8m25s) - Organizing code
- [14:43](https://youtu.be/wUpPsEcGsg8?t=14m43s) - React npm registry
- [19:15](https://youtu.be/wUpPsEcGsg8?t=19m15s) - Adding new React features

For a realistic overview of what it _feels_ like to contribute to React for the first time, check out [this entertaining ReactNYC talk](https://www.youtube.com/watch?v=GWCcZ6fnpn4).

### Request for Comments (RFC) {#request-for-comments-rfc}

Many changes, including bug fixes and documentation improvements can be implemented and reviewed via the normal GitHub pull request workflow.

Some changes though are "substantial", and we ask that these be put through a bit of a design process and produce a consensus among the React core team.

The "RFC" (request for comments) process is intended to provide a consistent and controlled path for new features to enter the project. You can contribute by visiting the [rfcs repository](https://github.com/reactjs/rfcs).

### License {#license}

By contributing to React, you agree that your contributions will be licensed under its MIT license.

### What Next? {#what-next}

Read the [next section](/docs/codebase-overview.html) to learn how the codebase is organized.
