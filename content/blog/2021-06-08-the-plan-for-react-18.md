---
title: "React 18 发布计划"
author: [acdlite, bvaughn, abernathyca, gaearon, rachelnabors, rickhanlonii, sebmarkbage, sethwebster]
---

<div class="scary">

> 此博客已经归档。访问 [zh-hans.react.dev/blog](https://zh-hans.react.dev/blog) 查看最新的文章。

</div>

> 2021 年 11 月 15 日更新
>
> React 18 已进入 Beta 阶段。有关该版本的更多信息，可以在 [React 18 工作组相关的文章中找到](https://github.com/reactwg/react-18/discussions/112).

React 团队非常激动地与你分享一些最新的工作进展：

1. 我们已经开始了 React 18 版本的发布工作，这将是我们的下一个主要版本。
2. 我们创建了工作组，为社区逐步采用 React 18 的新特性做准备。
3. 我们发布了 React 18 Alpha 版本，便于库作者尝试它并为我们提出相应反馈。

目前这些更新主要面向第三方库的维护者。如果你正在学习、教学或使用 React 来构建面向用户的应用程序，你可以忽略这篇博客。但如果你出于好奇，我们同样欢迎你关注 React 18 工作组中的讨论！

## React 18 带来了什么 {#whats-coming-in-react-18}

当 React 18 发布时，它将包含开箱即用的改进（如 [automatic batching](https://github.com/reactwg/react-18/discussions/21))，全新的 API（如 [`startTransition`](https://github.com/reactwg/react-18/discussions/41)）以及内置支持了 `React.lazy` 的 [全新 SSR 架构](https://github.com/reactwg/react-18/discussions/37)。

这些功能之所以能够实现，要归功于我们在 React 18 中新加入的可选的 “并发渲染（concurrent rendering）” 机制。它使得 React 可以同时准备多个版本的 UI。这个机制主要发生在幕后，但它为 React 解锁了非常多新的可能性，来帮助你提高你应用程序的实际与感知性能。

如果你一直在关注我们对 React 未来的研究（我们并不期待你这么做！），你可能已经听说过 “并发模式（concurrent mode）”，或许还听过它可能会搞坏你的应用程序。为了回应社区对此的反馈，我们重新设计了可渐进的升级策略。相比于之前要么不升要么全升的一刀切方式，只有由新特性触发的更新会启用并发渲染。在实践中，这意味着 **你无需重写代码即可直接使用 React 18，且可以根据自己的节奏和需要来尝试新特性**。

## 循序渐进的采用策略 {#a-gradual-adoption-strategy}

由于 React 18 中的并发性是可选功能，所以并不会立刻对组件行为带来任何明显的破坏性变化。**你几乎不需要对应用程序中的代码进行任何改动就可以直接升级到 React 18，并不会比以往的 React 版本升级要困难**。根据我们自己将几个应用程序升级到 React 18 的经验来看，预计许多用户能在一个下午的时间内完成升级工作。

我们在 Facebook 成功地将并发功能交付给了数以万计的组件，根据我们的经验来看，我们发现大多数 React 组件无需任何改动就能 “正常工作”。我们致力于确保整个社区都能平滑的升级，所以今天我们宣布了 React 18 工作组的成立。

## 与社区合作 {#working-with-the-community}

我们正在这个版本中尝试一些新的可能：我们邀请了来自整个 React 社区的专家、开发者、库作者和教育者参与我们的 [React 18 工作组](https://github.com/reactwg/react-18)，以提供反馈，提出问题，并就发布工作进行合作。我们无法邀请所有我们想邀请的人来参加这个最初的小团体，但如果实验成功，我们希望将来会有更多的人参与！

**React 18 工作组的目标是为生态做好准备，使现有的应用程序和库能够顺利、逐步地采用 React 18**。该工作组托管在 [GitHub Discussions](https://github.com/reactwg/react-18/discussions)，以供公众阅读。工作组成员可以留下反馈，提出问题，并分享想法。核心团队也将使用 repo 的讨论区来分享我们的研究成果。随着稳定版的发布越来越近，任何重要的信息我们将在博客上发布。

欲了解关于升级到 React 18 的更多信息，或关于该版本的其他资源，请参阅 [React 18 公告](https://github.com/reactwg/react-18/discussions/4).

## 访问 React 18 工作组 {#accessing-the-react-18-working-group}

大家可以在 [React 18 工作组仓库](https://github.com/reactwg/react-18) 中阅读相关讨论的情况。

我们预计对工作组感兴趣的小伙伴会激增，所以只有被邀请的成员可以创建或评论主题。然而，这些过程对公众是完全可见的，所以每个人都可以获得相同的信息，我们相信这是一个很好的折衷方案，既能为工作组成员创造一个富有成效的环境，又能保持对广大社区的透明度。

其他依旧，你可以在我们的 [issue](https://github.com/facebook/react/issues) 中提交错误报告、问题和反馈。

## 如何尝试 React 18 Alpha {#how-to-try-react-18-alpha-today}

新的 alpha 版本通过 [`@alpha` 标签定期发布到 npm 中](https://github.com/reactwg/react-18/discussions/9)。这些版本是由仓库的主分支的最新提交构建而来。当一个特性或 bug 修复被合并时，它将在下一个工作日出现在 alpha 版本中。

在 alpha 版本之间可能会有重大的变更或 API 变化。请谨记，**alpha 版本不建议用于面向用户的生产应用中**。

## 预计 React 18 的发布时间 {#projected-react-18-release-timeline}

我们没有安排具体的发布时间，但我们预计需要几个月的反馈和迭代时间，React 18 才能做好准备，以应用于大多数生产项目。

* 库的 Alpha 版本：今天可用
* 公开的 Beta 版：至少几个月
* RC 版本：至少在 Beta 版发布后的几周
* 正式版：至少在 RC 版本发布之后的几周

关于发布时间表的更多细节，[可以关注工作组](https://github.com/reactwg/react-18/discussions/9)。当临近公开发布时，我们会在这个博客上发布更新。
