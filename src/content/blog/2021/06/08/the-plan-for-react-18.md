---
title: "React 18 发布计划"
---

2021 年 7 月 8 日 [Andrew Clark](https://twitter.com/acdlite)、[Brian Vaughn](https://github.com/bvaughn)、[Christine Abernathy](https://twitter.com/abernathyca)、[Dan Abramov](https://twitter.com/dan_abramov)、[Rachel Nabors](https://twitter.com/rachelnabors)、[Rick Hanlon](https://twitter.com/rickhanlonii)、[Sebastian Markbåge](https://twitter.com/sebmarkbage) 与 [Seth Webster](https://twitter.com/sethwebster)

---

<Intro>

React 团队很高兴分享一些更新：

1. 我们已经开始推进 React 18 的更新，也正是我们的下一个主要版本。
2. 我们已经创建了一些工作组，筹备 React 18 新功能在社区内逐步推广的相关工作。
3. 我们已经发布了一个 React 18 Alpha 版本，以便于一些库的作者们能够测试并反馈。

这些更新主要针对于第三方库的维护者们。如果你正在学习，教授或者使用 React 来构建面向用户的应用程序，你可以忽略这篇文章。但是如果你对此感到好奇，我们也非常欢迎你关注 React 18 工作组中的讨论。

---

</Intro>

## React 18 带来了什么 {/*whats-coming-in-react-18*/}

当 React 18 发布时，它将会有更好的开箱即用能力（如 [自动批处理](https://github.com/reactwg/react-18/discussions/21)），全新的 API（如 [`startTransition`](https://github.com/reactwg/react-18/discussions/41)），以及支持 `React.lazy` 的 [全新的流式服务端渲染](https://github.com/reactwg/react-18/discussions/37)。

这些功能之所以能够实现，要归功于我们在 React 18 中新加入的可选择性启用的机制，“并发渲染”，并且它使得 React 可以同时准备多个版本的 UI。这些大部分都是对底层的改动，但是也为你的应用程序提高其真实性能和用户感知性能创造了新的可能性，

如果你一直在关注我们对 React 的未来的研究（我们并不希望你这么做！），你可能已经听说过“并发模式”，或许还听说过它可能会对你的应用程序造成破坏性变更。为了回应社区对此的反馈，我们已经重新设计了渐进式的升级策略。相比于之前要么不升级，要么全部升级这样一刀切的方式，现在的只有被并发渲染相关的新功能触发的更新才会启用并发渲染。这对于工程实践的意义是，**你无需重写代码即可直接使用 React 18，并且可以根据自己的节奏和需求来尝试新特性**。

## 渐进式应用策略 {/*a-gradual-adoption-strategy*/}

由于并发机制在 React 18 中是一个可选功能，没有对组件行为造成明显的破坏性变更。**你几乎不需要对应用程序中的代码进行任何改动，就可以直接升级到 React 18，这比以往的 React 版本升级要容易许多**。根据我们自己将几个应用程序升级到 React 18 的经验来看，预计大多数用户能在一个下午的时间内完成升级工作。

我们在 Facebook 上成功地将并发功能赋予给了数以万计的组件，并且以我们的实践经验来看，大部分的 React 组件无需任何改动就能正常工作。今天我们成立了 React 18 工作组，我们将致力于保证整个社区都能顺利升级。

## 与社区合作 {/*working-with-the-community*/}

在这次更新中，我们正在尝试一些新的可能：我们邀请了 React 社区的专家、开发者、库的作者以及教育者参与我们的 [React 18 工作组](https://github.com/reactwg/react-18)，以提供反馈，咨询问题以及参与版本更新。我们没有没办法将所有人都邀请到这个刚建立的小群体，但是如果这次试验成功的话，我们也期待更多人的加入。

**React 18 工作组的目标是为生态做好准备，使现有的应用程序和库能够顺利、渐进地采用 React 18**。该工作组被托管在 [GitHub 讨论区](https://github.com/reactwg/react-18/discussions) 以供公众阅读。工作组的成员也可以留下反馈，咨询问题以及分享想法。核心团队也将会使用这个代码仓库的讨论区来分享我们的研发成果。在新版本变得越来越稳定的同时，所有重要信息都会在博客上发布。

想要了解关于升级到 React 18 的更多信息，或者关于该版本的其他资源，请参阅 [React 18 公告](https://github.com/reactwg/react-18/discussions/4)。

## 访问 React 18 工作组 {/*accessing-the-react-18-working-group*/}

每个人都可以阅读在 [React 18 工作组代码仓库](https://github.com/reactwg/react-18) 中的讨论信息。

我们预计对工作组感兴趣的人数会激增，所以目前只允许被邀请的成员可以创建或评论主题。不过，这些过程是完全公开的，所以每个人都能得到一致的信息。我们相信这是一个很好的折衷方案，既能为工作组的成员创造一个利于工作的环境，又能保持对广大社区的开放性。

和从前一样，你仍然可以在我们的 [issue](https://github.com/facebook/react/issues) 中发布错误报告、疑难问题和反馈等信息。

## 如何体验 React 18 alpha {/*how-to-try-react-18-alpha-today*/}

新的 alpha 版本是 [将 `@alpha` 标签定期发布到 npm 中](https://github.com/reactwg/react-18/discussions/9)。这些版本是由我们仓库主分支上最新的提交内容构建的。当一个新功能或者漏洞补丁被合并到主分支时，这些内容将在下一个工作日中出现在 alpha 版本中。

在 alpha 版本之间可能会有重大的行为逻辑或者 API 的变动。请谨记，**alpha 版本不建议在面向用户的生产环境应用中使用**。

## React 18 的预计发布时间 {/*projected-react-18-release-timeline*/}

我们没有明确的版本更新排期，但是我们预计在 React 18 可以满足大部分的生产环境应用之前，需要几个月的时间来收集反馈和迭代更新。

* 库的 Alpha 版本：今天可用
* 公开的 Beta 版：至少几个月
* RC 版本：至少在 Beta 版发布后的几周
* 正式版：至少在 RC 版本发布之后的几周

关于发布任务排期的更多细节都在 [走近工作组](https://github.com/reactwg/react-18/discussions/9)。当临近公开发布时，我们会在这个博客上发布更新。
