---
title: "React Native v0.4"
layout: post
author: [vjeux]
---

自从我们开源 React Native 到现在有三周了，已经有一些令人激动的的活跃度：超过 12.5k stars，1000 commits，500 issues，380 pull requests和 100 contributors，另外app store中有[35 plugins](http://react.parts/native-ios) 和[1个app](http://herman.asia/building-a-flashcard-app-with-react-native) ！我们期待这个项目会引起轰动，但这远远超出了我们的想象。感谢！

我要特别感谢社区成员 Brent Vatne 和 James Ide，他们都为项目做出了有意义的贡献，并且在 IRC 、pr、issue上都有很大的帮助。

## 修改日志 {#changelog}

过去几周的主要关注点是让 React Native 成为 Facebook 以外开发者的最佳体验。以下是自我们开源以来所做事情的重点概括：

* **错误提示和文档**: 我们希望 React Native 成为构建移动端应用程序的绝对最佳开发体验。我们添加了许多警告、改进了文档并修复了许多bug。如果你遇到问题，我的意思是任何问题，不是预期的或明确的，请创建一个issue - 我们希望知道并修复它。
* **NPM 模块兼容性**: NPM 上有很多不依赖于 node/browser 内部的库，这些库在 React Native 中非常有用，例如 superagent、underscore、parse 等等。打包器现在更加倾向于 node/browserify/webpack 依赖性解析。如果您最喜欢的库不能开箱即用，请创建一个issue。
* **基础架构**: 我们正在重构 React Native 的内部结构，使其更容易插接入现有的 iOS 代码库，并通过删除冗余视图和 shadow 视图、支持多个根视图和手动注册类以减少启动时间来提高性能。
* **组件**: 许多 UI 组件和 API，特别是那些我们在 Facebook 内部没有大量使用的，由于你的多次 pr 而得到了显著改进。
* **测试**: 我们将 JavaScript 测试、iOS 快照测试和端到端测试移植到 Travis CI 平台。我们在同步时已经破坏了 GitHub master 好几次（哎呀！），我们希望随着这个不断增长的测试套件，这样做会变得越来越不易出错。
* **专利授权**: 你们中的许多人对专利文件有疑虑和问题。 我们推送了 [一个新版本的授权](https://code.facebook.com/posts/1639473982937255/updating-our-open-source-patent-grant/) 。
* **每一条提交历史**: 为了从 Facebook 同步到 GitHub，我们过去每隔几天就会进行一次超大量的提交。我们改进了我们的工具，现在可以维护作者（不管是内部还是外部的 pr ）的每次提交记录信息，并且我们可追溯地将其应用比较于历史差异以提供合适的的归属。

## 我们接下来要做什么? {#where-are-we-going}

除了支持 pr、issue 和一般功能改进之外，我们还在努力开发内部 React Native 集成和 Android 版 React Native。