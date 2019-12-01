---
id: concurrent-mode-adoption
title: 使用 concurrent 模式（实验性）
permalink: docs/concurrent-mode-adoption.html
prev: concurrent-mode-patterns.html
next: concurrent-mode-reference.html
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
>本章节所描述的实验功能**在稳定版本中尚不可用**。请不要在应用程序的生产环境中依赖 React 的实验性版本。这些功能可能会发生重大变化，并且在成为 React 的一部分之前不会给出警告。
>
>本文档面向早期此功能的使用者和对此功能好奇的人。如果你不熟悉 React，请不必担心 —— 你不需要立刻学习这些功能。

</div>

- [安装](#installation)
  - [此实验版本适用于谁？](#who-is-this-experimental-release-for)
  - [开启 concurrent 模式](#enabling-concurrent-mode)
- [有何期望](#what-to-expect)
  - [迁移步骤： blocking 模式](#migration-step-blocking-mode)
  - [为什么有这么多模式？](#why-so-many-modes)
  - [特性对比](#feature-comparison)

## 安装 {#installation}

concurrent 模式目前仅在 React 的[实验版本](/blog/2019/10/22/react-release-channels.html#experimental-channel)可用。安装命令：

```
npm install react@experimental react-dom@experimental
```

**实验版本与语义版本不同。**
在 `@experimental` 版本，API 会随时增删改。

**实验版本经常会包含破坏性更改**

你可以在个人项目或新分支中尝试这些实验性功能，但我们并不建议在生产环境中使用它们。在 Facebook，我们**确实**在生产环境中使用它们，但我们在使用的同时也修复了 bug。**再次强调，请不要在生产环境使用！**

### 此实验版本适用于谁？ {#who-is-this-experimental-release-for}

这个版本主要针对功能早期使用者、库作者和对此好奇的人。

我们在生产中使用这段代码，但是仍然有一些 bug、缺少许多特性，且文档存在缺陷。我们希望了解更多关于 concurrent 模式中的出现的问题，以便更好地为未来发布稳定版本做准备。

### 开启 concurrent 模式 {#enabling-concurrent-mode}

通常，当我们给 React 添加功能的时候，你可以立即使用。比如 Fragments，Context，甚至 Hooks。你可以直接在代码里使用，而不用修改之前的代码。

concurrent 模式并不是这样。它给引入了新的语义，改变了 React 的工作方式。否则*不能启用*[这些新功能](/docs/concurrent-mode-patterns.html)。这就是它被分组到了新的模式，而不是相继的发布出来。

你不能为某个子树单独启用 concurrent 模式。你应该在 `ReactDOM.render()` 里启用它。

**这会在整个 `<App />` 结构树里启用 concurrent 模式：**

```js
import ReactDOM from 'react-dom';

// 如果你之前的代码是：
//
// ReactDOM.render(<App />, document.getElementById('root'));
//
// 你可以用下面的代码引入 concurrent 模式：

ReactDOM.createRoot(
  document.getElementById('root')
).render(<App />);
```

>注意：
>
> concurrent 模式 API 如 `createRoot` 只存在于 React 实验版本。

在 concurrent 模式下，生命周期[之前被标记过](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html)为“不安全”是真的不安全，会比现在的 React 出现更多的 bug。在你的 app 完全兼容[严格模式](https://reactjs.org/docs/strict-mode.html)之前，我们不建议使用 concurrent 模式。

## 有何期望 {#what-to-expect}

如果你有已完成的大型 app，或着你的 app 有大量第三方依赖，请不要立即使用 concurrent 模式。**比如在 Facebook 我们在新网站的开发上使用 concurrent 模式，并没有打算在旧的网站开发上使用。** 这是因为我们旧网站的代码里使用了不安全的生命周期方法、不兼容第三方库、与 concurrent 模式也不兼容。

根据我们的经验，使用常见的 React 开发模式，并且不依赖外部状态管理的代码最容易切换到 concurrent 模式。在接下来的几周内，我们会列出常见的问题和解决方案。

### 迁移步骤： blocking 模式 {#migration-step-blocking-mode}

对于较旧的代码库，concurrent 模式可能步子迈的太大。这就是我们在实验版本中提供“ blocking 模式”的原因。你可以通过使用 `createBlockingRoot` 代替 `createRoot` 尝试一下。它仅提供了 concurrent 模式的*小部分功能*，但它更接近于 React 今天的工作方式，可以作为迁移的一个步骤。

回顾：

* **legacy 模式：** `ReactDOM.render(<App />, rootNode)`。这是当前 React app 使用的方式。当前没有计划删除本模式，但是这个模式可能不支持这些新功能。
* **blocking 模式：** `ReactDOM.createBlockingRoot(rootNode).render(<App />)`。目前正在实验中。作为迁移到 concurrent 模式的第一个步骤。
* **concurrent 模式：** `ReactDOM.createRoot(rootNode).render(<App />)`。目前在实验中，未来稳定之后，打算作为 React 的默认开发模式。这个模式开启了*所有的*新功能。

### 为什么有这么多模式？{#why-so-many-modes}

我们认为提供[渐进的迁移策略](/docs/faq-versioning.html#commitment-to-stability)比进行破坏性的更改或者使 React 停滞不前是更好的选择。

实际上，我们希望今天使用 legacy 模式的大多数 app 至少能迁移到 blocking 模式（如果不能迁移到 concurrent 模式）。对于希望在短期内支持所有模式的库而言，碎片化可能是很讨厌的事情。但是组件将生态系统从 legacy 模式中移除，也会*解决*一些影响 React 主要库的问题。比如[获取布局时令人迷惑的 Suspense 行为](https://github.com/facebook/react/issues/14536)和[缺乏一致性的批处理](https://github.com/facebook/react/issues/15080)。legacy 模式下，如果不修改语义就无法修复的许多错误，在 blocking 模式和 concurrent 模式下就不存。

你可以把 blocking 模式当作 concurrent 模式的“优雅降级”版本。**所以长远来看，模式的数量会收敛，不用考虑不同的模式。**但就目前而言，模式是一项重要的迁移策略。能让每个人都能决定自己什么时候迁移，并按照自己的速度进行迁移。

### 特性对比 {#feature-comparison}

<style>
  #feature-table table { border-collapse: collapse; }
  #feature-table th { padding-right: 30px; }
  #feature-table tr { border-bottom: 1px solid #eee; }
</style>

<div id="feature-table">

|   | legacy 模式  | blocking 模式  | concurrent 模式  |
|---  |---  |---  |---  |
|[String Refs](/docs/refs-and-the-dom.html#legacy-api-string-refs)  |✅  |🚫**  |🚫**  |
|[Legacy Context](/docs/legacy-context.html) |✅  |🚫**  |🚫**  |
|[findDOMNode](/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)  |✅  |🚫**  |🚫**  |
|[Suspense](/docs/concurrent-mode-suspense.html#what-is-suspense-exactly) |✅  |✅  |✅  |
|[SuspenseList](/docs/concurrent-mode-patterns.html#suspenselist) |🚫  |✅  |✅  |
|Suspense SSR + Hydration |🚫  |✅  |✅  |
|Progressive Hydration  |🚫  |✅  |✅  |
|Selective Hydration  |🚫  |🚫  |✅  |
|Cooperative Multitasking |🚫  |🚫  |✅  |
|Automatic batching of multiple setStates     |🚫* |✅  |✅  |
|[Priority-based Rendering](/docs/concurrent-mode-patterns.html#splitting-high-and-low-priority-state) |🚫  |🚫  |✅  |
|[Interruptible Prerendering](/docs/concurrent-mode-intro.html#interruptible-rendering) |🚫  |🚫  |✅  |
|[useTransition](/docs/concurrent-mode-patterns.html#transitions)  |🚫  |🚫  |✅  |
|[useDeferredValue](/docs/concurrent-mode-patterns.html#deferring-a-value) |🚫  |🚫  |✅  |
|[Suspense Reveal "Train"](/docs/concurrent-mode-patterns.html#suspense-reveal-train)  |🚫  |🚫  |✅  |

</div>

\*：legacy 模式在合成事件中有自动批处理的功能，但仅限于一个浏览器任务。非 React 事件想使用这个功能必须使用 `unstable_batchedUpdates`。在 blocking 模式和 concurrent 模式下，所有的 `setState` 在默认情况下都是批处理的。

\*\*：会在开发中发出警告。
