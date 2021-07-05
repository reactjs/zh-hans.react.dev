---
id: concurrent-mode-intro
title: Concurrent 模式介绍 (实验性)
permalink: docs/concurrent-mode-intro.html
next: concurrent-mode-suspense.html
---

<style>
.scary > blockquote {
  background-color: rgba(237, 51, 21, 0.2);
  border-left-color: #ed3315;
}
</style>

<div class="scary">

>注意：
>
>本章节所描述的功能还处于实验阶段，在稳定版本中尚不可用。它面向的人群是早期使用者以及好奇心较强的人。
>
>本页面中许多信息现已过时，仅仅是为了存档而存在。欲了解最新信息，**请参阅 [React 18 Alpha 版公告](/blog/2021/06/08/the-plan-for-react-18.html)**。
>
>在 React 18 发布前，我们将用稳定的文档替代此章节。

</div>

本页面提供了 Concurrent 模式的理论概述。**有关更多实用性的介绍，你可能需要查看以下部分：**

* [Suspense 用于数据获取](/docs/concurrent-mode-suspense.html) 描述了一种在 React 组件中获取数据的新机制。
* [Concurrent UI Patterns](/docs/concurrent-mode-patterns.html) 展示了一些通过 Concurrent 模式和 Suspense 实现的 UI 模式。
* [采用 Concurrent 模式](/docs/concurrent-mode-adoption.html) 解释了如何在你的项目中尝试 Concurrent 模式。
* [Concurrent 模式的 API 索引](/docs/concurrent-mode-reference.html) 记录了在实验性版本中可用的新 API。

## 什么是 Concurrent 模式？ {#what-is-concurrent-mode}

Concurrent 模式是一组 React 的新功能，可帮助应用保持响应，并根据用户的设备性能和网速进行适当的调整。

这些功能尚处于试验阶段，可能会发生改变。它们还不是稳定的 React 版本中的一部分，但是你可以在实验版本中尝试它们。

## 阻塞 vs 可中断渲染 {#blocking-vs-interruptible-rendering}

<<<<<<< HEAD
**为了解释 Concurrent 模式，我们将使用版本控制作为比喻。** 如果你在团队中工作，你可能使用了像 Git 这样的版本控制系统并在分支上进行工作。当一个分支准备就绪时，你可以将你的工作合并到 master 中，以便他人拉取。
=======
**To explain Concurrent Mode, we'll use version control as a metaphor.** If you work on a team, you probably use a version control system like Git and work on branches. When a branch is ready, you can merge your work into main so that other people can pull it.
>>>>>>> 0bb0303fb704147452a568472e968993f0729c28

在版本控制存在之前，开发工作流程有很大的不同。不存在分支的概念。如果你想编辑某些文件，你必须告诉所有人在你完成编辑工作之前不要触碰这些文件。你甚至不能同时和那个人研究它们 —— 实际上, 你被它们 *阻塞* 了。

这说明了包括 React 在内的 UI 库在目前通常是如何工作的。一旦它们开始渲染一次更新，它们不能中断包括创建新的 DOM 节点和运行组件中代码在内的工作。我们称这种方法为 “阻塞渲染”。

在 Concurrent 模式中，渲染不是阻塞的。它是可中断的。这改善了用户体验。它同时解锁了以前不可能的新功能。在我们查看[下一个](/docs/concurrent-mode-suspense.html) [章节](/docs/concurrent-mode-patterns.html)的具体例子之前，我们将对新功能做一个高级的概述。

### 可中断渲染 {#interruptible-rendering}

考虑一个可过滤的产品列表。你是否曾在一个列表筛选器中输入过，且每一次输入都感觉到并不流畅？一些更新产品列表的工作是不可避免的，例如创建新的 DOM 节点或者浏览器执行布局。然而，我们 *何时* 以及 *如何* 处理这项工作起着很大的作用。

解决卡顿的一种常见方法是对输入进行“防抖”处理。防抖时，我们只在用户停止输入 *之后* 更新列表。然而，令人沮丧的是，在我们键入的时候不会进行更新。作为一种替代，我们可以对输入进行“节流”，并以一定的最大频率更新列表。但是在功率较低的设备上，还是会发生卡顿现象。无论防抖还是节流都不会提供最佳的用户体验。

产生卡顿的原因很简单：一旦渲染开始，就不能被终止。因此浏览器不能在按键结束后立即更新。无论 UI 库(如 React)在基准测试中表现得多么出色，只要它使用阻塞渲染，组件中总会有一定数量的工作导致卡顿。并且，通常没有简单的解决办法。

**Concurrent 模式通过使渲染可中断来修复此基本限制。** 这意味着当用户按下另一个按键时，React 不需要阻塞浏览器更新文本输入。相反，它可以让浏览器绘制输入的更新，然后 *在内存中* 渲染更新后的列表。当渲染完成后，React 更新 DOM，并且变化会反映在屏幕上。

从概念上讲，你可以将它视为 React “在分支上”准备每一次更新。就像你可以放弃分支上的工作或者在它们之间切换一样，React 在 Concurrent 模式中可以中断一项正在执行的更新去做一些更重要的事情，然后再回到之前正在做的工作。这项技术也许会使你想起电子游戏中的[双重缓冲](https://wiki.osdev.org/Double_Buffering)。

Concurrent 模式减少了防抖和节流在 UI 中的需求。因为渲染是可以中断的，React 不需要人为地 *延迟* 工作以避免卡顿。它可以立即开始渲染，但是当需要保持应用响应时中断这项工作。

### 有意的加载顺序 {#intentional-loading-sequences}

<<<<<<< HEAD
我们之前说过 Concurrent 模式就像 React 工作“在分支上”。分支不仅对短期修复有用，对长期的功能开发也很有用。有时你可能会开发某项功能，但是在它达到一个“足够好的状态”以合并到 master 之前，往往需要好几周的时间。我们的版本控制比喻在这一方面同样适用于渲染。
=======
We've said before that Concurrent Mode is like React working "on a branch". Branches are useful not only for short-term fixes, but also for long-running features. Sometimes you might work on a feature, but it could take weeks before it's in a "good enough state" to merge into main. This side of our version control metaphor applies to rendering too.
>>>>>>> 0bb0303fb704147452a568472e968993f0729c28

想象一下，我们正在应用的两个屏幕之间导航。有时，我们可能没有加载足够的代码和数据在新屏幕上向用户展示“足够好”的加载状态。这样过渡到一个空白屏或者大型的轮播图会是一个不愉快的体验。然而，通常获取所需的代码和数据不会花费太长时间。**如果 React 可以在旧屏幕上多停留一段时间，并在展示新屏幕之前“跳过”“不够好的加载状态”，不是更好吗？**

虽然这在当前是可以实现的，但是协调起来会有些困难。在 Concurrent 模式中，这些功能是内置的。React 首先在内存中准备新屏幕 — 或者，用我们比喻的说法，“在不同的分支上”。所以 React 可以在更新 DOM 之前进行等待，以便加载更多内容。在 Concurrent 模式中，我们可以让 React 继续显示完全互动，带有内联加载指示器的旧屏幕。当新屏幕准备就绪之后，React 可以带我们跳转到新屏幕。

### 并发 {#concurrency}

让我们回顾一下上面的两个例子然后看一下 Concurrent 模式是如何将它们联合起来的。**在 Concurrent 模式中，React 可以 *同时* 更新多个状态** —— 就像分支可以让不同的团队成员独立地工作一样：

* 对于 CPU-bound 的更新 (例如创建新的 DOM 节点和运行组件中的代码)，并发意味着一个更急迫的更新可以“中断”已经开始的渲染。
* 对于 IO-bound 的更新 (例如从网络加载代码或数据)，并发意味着 React 甚至可以在全部数据到达之前就在内存中开始渲染，然后跳过令人不愉快的空白加载状态。

重要的是，你 *使用* React 的方式是相同的。components，props，和 state 等概念的基本工作方式是相同的。当你想更新屏幕，设置 state 即可。

React 使用一种启发式方法决定更新的“紧急性”，并且允许你用几行代码对其进行调整，以便你可以在每次交互中实现理想的用户体验。

## 将研究投入生产 {#putting-research-into-production}

围绕 Concurrent 模式有一个共同的主题。**它的任务是帮助将人机交互研究的结果整合到真实的 UI 中。**

例如，研究表明，在屏幕之间切换时显示过多的中间加载状态会使切换的速度 *变慢*。这就是为什么 Concurrent 模式在一个固定的“时间表”上显示新的加载状态，用于避免不愉快的和过多的更新。

类似的，我们从研究得知悬停和文本输入之类的交互需要在很短的时间内处理，而点击和页面转换可以等待稍长时间而不会感到迟缓。Concurrent 模式在内部使用不同的“优先级”，大致对应于人类感知研究中的交互类别。

专注于用户体验的团队有时会通过一次性解决方案来解决类似的问题。然而，这些解决方案难以维护所以很少能长期存活。使用 Concurrent 模式，我们的目标是将 UI 的研究结果纳入抽象本身，并提供使用它们的惯用方法。作为一个 UI 库，React 很适合这样做。

## 下一步 {#next-steps}

现在你已经知道 Concurrent 模式是什么了！

在之后的页面中，你将学习更多特定主题的详细信息：

* [Suspense 用于数据获取](/docs/concurrent-mode-suspense.html) 描述了一种在 React 组件中获取数据的新机制。
* [Concurrent UI Patterns](/docs/concurrent-mode-patterns.html) 展示了一些通过 Concurrent 模式和 Suspense 实现的 UI 模式。
* [采用 Concurrent 模式](/docs/concurrent-mode-adoption.html) 解释了如何在你的项目中尝试 Concurrent 模式。
* [Concurrent 模式的 API 索引](/docs/concurrent-mode-reference.html) 记录了在实验性版本中可用的新 API。
