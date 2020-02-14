---
title: 更新异步渲染
author: [bvaughn]
---

一年多来, React 团队一直致力于实现异步渲染。上个月，在 JSConf 冰岛的演讲中，[Dan 揭开了一些令人兴奋的异步渲染解锁的新的可能性](/blog/2018/03/01/sneak-peek-beyond-react-16.html)。现在我们想与您分享一些我们在使用这些功能上获得的一些经验，以及一些帮助您准备在组件开启异步渲染时使用的方法。

我们学到的最重要的经验之一是，我们的一些遗留组件生命周期往往会导致不安全的编码实践。它们是：

* `componentWillMount`
* `componentWillReceiveProps`
* `componentWillUpdate`

这些生命周期方法经常被误解和巧妙地误用；另外，我们预计，对于异步渲染它们的潜在误用可能会更成问题。因此, 我们将在即将发布的版本中为这些生命周期方法添加 “UNSAFE_” 前缀。（这里，“unsafe” 指的不是安全性，而是传达使用这些生命周期的代码将更有可能在 React 的未来版本中出现错误，特别是在启用异步渲染时。）

## 逐步迁移路径 {#gradual-migration-path}

[React 遵循语义版本控制](/blog/2016/02/19/new-versioning-scheme.html)，因此这种改变将是渐进的。我们目前的计划是：

* **16.3**：为不安全的生命周期函数引入别名，`UNSAFE_componentWillMount`、`UNSAFE_componentWillReceiveProps` 和 `UNSAFE_componentWillUpdate`。（旧版生命周期名和新的别名都适用于此版本。）
* **未来的 16.x 版本**: 为 `componentWillMount`、`componentWillReceiveProps` 和 `componentWillUpdate` 启用废弃警告。（旧的生命周期名和新的别名都可以在此版本中使用，但旧名在 DEV 模式下会有警告日志。）
* **17.0**: 删除 `componentWillMount`, `componentWillReceiveProps` 和 `componentWillUpdate`。（从这个版本开始，只有新的 “UNSAFE_” 生命周期名可以使用。）

**注意，如果你是 React 应用程序开发人员，则不必对遗留方法执行任何操作。即将发布的 16.3 版本的主要目的是使开源项目维护者能够在任何废弃警告之前更新其库。在未来的 16.x 版本发布之前，不会启用这些警告。**

在 Facebook 我们维护了超过 50,000 个 React 组件，我们不打算立即重写它们。我们知道迁移需要时间。我们将与 React 社区中的每个人一起采取逐步迁移的方式。

---

## 从遗留生命周期迁移 {#migrating-from-legacy-lifecycles}

如果您想开始使用 React 16.3 中引入的新组件 API（或者如果您是维护人员希望提前更新您的库），我们希望这些示例可以帮助您开始有点不同地思考组件。随着时间的推移，我们计划在我们的文档中添加额外的“方法”，以展示如何以避免有问题的生命周期的方式执行常见任务。

在开始之前，这里是对版本 16.3 计划的生命周期更改的快速概述：
* 我们**将添加以下生命周期别名**：`UNSAFE_componentWillMount`、`UNSAFE_componentWillReceiveProps` 和 `UNSAFE_componentWillUpdate`. (旧的生命周期名和新的别名都将支持。)
* 我们**将引入两个新的生命周期**，静态 `getDerivedStateFromProps` 和 `getSnapshotBeforeUpdate`。

### 新的生命周期：`getDerivedStateFromProps` {#new-lifecycle-getderivedstatefromprops}

`embed:update-on-async-rendering/definition-getderivedstatefromprops.js`

新的静态 `getDerivedStateFromProps` 生命周期将在，组件实例化之后以及组件重新渲染之前被调用。它可以返回一个更新 `state` 对象, 或者返回 `null` 以表示新的 `props` 不需要更新 `state`。

与 `componentDidUpdate` 一起, 此新的生命周期可以覆盖旧版 `componentWillReceiveProps` 的所有用例。

>注意：
>
>旧的 `componentWillReceiveProps` 和新的 `getDerivedStateFromProps` 方法都会给组件带来很大的复杂性。这经常会导致 [bugs](/blog/2018/06/07/you-probably-dont-need-derived-state.html#common-bugs-when-using-derived-state) 考虑**[更简单的派生 state 替代方案](/blog/2018/06/07/you-probably-dont-need-derived-state.html)**以使组件可预测和可维护。

### 新的生命周期：`getSnapshotBeforeUpdate` {#new-lifecycle-getsnapshotbeforeupdate}

`embed:update-on-async-rendering/definition-getsnapshotbeforeupdate.js`

新的 `getSnapshotBeforeUpdate` 生命周期在 mutations 之前被调用（例如在更新 DOM 之前）。此生命周期的返回值将作为第三个参数传递给 `componentDidUpdate`。（此生命周期通常不需要，但在重新渲染过程中手动保留滚动位置等情况下非常有用。）

与 `componentDidUpdate` 一起，此新生命周期可以覆盖旧版 `componentWillUpdate` 的所有用例。

你可以[在这个要点中](https://gist.github.com/gaearon/88634d27abbc4feeb40a698f760f3264)找到它们的类型签名。

我们将看看下面如何使用这两个生命周期的例子。

## 示例 {#examples}
- [初始化 state](#initializing-state)
- [获取外部数据](#fetching-external-data)
- [添加事件监听（或订阅）](#adding-event-listeners-or-subscriptions)
- [基于 props 更新 `state`](#updating-state-based-on-props)
- [调用外部回调](#invoking-external-callbacks)
- [props 改变副作用](#side-effects-on-props-change)
- [props 改变时获取外部数据](#fetching-external-data-when-props-change)
- [更新之前读取 DOM 属性](#reading-dom-properties-before-an-update)

> 注意
>
> 为简洁起见，下面的示例使用了一些实验性类属性转换，但没有它，相同的迁移策略同样适用。

### 初始化 state{#initializing-state}

此示例展示了一个组件在 `componentWillMount` 中调用 `setState`：
`embed:update-on-async-rendering/initializing-state-before.js`

这种类型组件最简单的重构方式是将 state 初始化移动到构造函数或属性初始化器，如下所示：
`embed:update-on-async-rendering/initializing-state-after.js`

### 获取外部数据{#fetching-external-data}

以下是使用 `componentWillMount` 获取外部数据的组件示例：
`embed:update-on-async-rendering/fetching-external-data-before.js`

以上代码是有问题的对于服务端渲染（外部数据将不会被使用）以及即将到来的异步渲染模式（请求可能会被多次发起）。

对于大多数用例建议的升级路径是将数据获取移动到 `componentDidMount` ：
`embed:update-on-async-rendering/fetching-external-data-after.js`

有一种常见误解，即在 `componentWillMount` 中获取数据可以避免第一次空的渲染状态。实际上，这从来不是真的，因为 React 总是在 `componentWillMount` 之后立即执行 `render`。如果 `componentWillMount` 触发时数据不可用，则无论您在何处发起 fetch，首次渲染仍将显示加载状态。这就是为什么将 fetch 移动到 `componentDidMount` 在绝大多数情况下不会有可察觉的效果。

> 注意
>
> 一些高级用例（例如像 Relay 这样的库）可能想要尝试急切地预取异步数据。[这里](https://gist.github.com/bvaughn/89700e525ff423a75ffb63b1b1e30a8f)有一个如何做到这一点的例子。
>
> 从长远来看，在 React 组件中获取数据的规范方式可能基于[在冰岛 JSConf 引入的](/blog/2018/03/01/sneak-peek-beyond-react-16.html) “suspense” API。简单的数据提取解决方案像 Apollo 和 Relay 这样的库都可以在引擎盖下使用它。它比上述任何一种解决方案都要简单得多，但不会在 16.3 版本中及时完成。
>
> 当支持服务端渲染时，有必要同步地提供数据 —— `componentWillMount` 通常用于此目的，但构造函数可用作替换。即将推出的 suspense API 将使异步数据获取对客户端和服务端渲染都成为可能。

### 添加事件监听（或订阅）{#adding-event-listeners-or-subscriptions}

以下是组件挂载时订阅外部事件调度器的组件示例：
`embed:update-on-async-rendering/adding-event-listeners-before.js`

不幸的是, 这可能导致服务端渲染（其中 `componentWillUnmount` 永远不会被调用）和异步渲染（渲染可能在完成之前被中断，导致 `componentWillUnmount` 不会被调用）的内存泄漏。

人们通常认为 `componentWillMount` 和 `componentWillUnmount` 总是配对的，但这并不能保证。只有调用了 `componentDidMount`，React 保证稍后将调用 `componentWillUnmount` 进行清理。

因此，添加监听器/订阅的推荐方法是使用 `componentDidMount` 生命周期：
`embed:update-on-async-rendering/adding-event-listeners-after.js`

有时，更新订阅以响应属性更改很重要。如果您使用的是 Redux 或 MobX 等库，则库的容器组件应该会为您处理。对于应用程序作者，我们已经创建了一个小型库 [`create-subscription`](https://github.com/facebook/react/tree/master/packages/create-subscription) 来帮助解决这个问题。我们将与 React 16.3 一起发布它。

我们可以使用 `create-subscription` 传递订阅的值，而不是像上面的示例中那样传递可订阅的 `dataSource` 属性：

`embed:update-on-async-rendering/adding-event-listeners-create-subscription.js`

> 注意
>
> 像 Relay/Apollo 这样的库应该使用与 `create-subscription` 在底层使用的相同技术手动管理订阅（如[此处](https://gist.github.com/bvaughn/d569177d70b50b58bff69c3c4a5353f3)所述），以最适合其库使用的方式进行优化。

### 基于 props 更新 `state`{#updating-state-based-on-props}

>注意：
>
>旧的 `componentWillReceiveProps` 和新的 `getDerivedStateFromProps` 方法都会给组件带来很大的复杂性。这经常会导致 [bugs](/blog/2018/06/07/you-probably-dont-need-derived-state.html#common-bugs-when-using-derived-state) 考虑**[更简单的派生 state 替代方案](/blog/2018/06/07/you-probably-dont-need-derived-state.html)**以使组件可预测和可维护。

以下是使用遗留的 `componentWillReceiveProps` 生命周期根据新的 `props` 值更新 `state` 的组件示例：
`embed:update-on-async-rendering/updating-state-from-props-before.js`

虽然上面的代码是没有问题的，但 `componentWillReceiveProps` 生命周期经常被以确实存在问题的方式误用。因此，该方法将被废弃。

从版本 16.3 开始，更新 `state` 以响应 `props` 更改的推荐方法是使用新的 `static getDerivedStateFromProps` 生命周期。（在创建组件时以及每次收到新的 props 时都会调用该生命周期）：
`embed:update-on-async-rendering/updating-state-from-props-after.js`

在上面的示例中您可能会注意到 `props.currentRow` 被保存在 state 中（作为 `state.lastRow`）。这使 `getDerivedStateFromProps` 能够以与 `componentWillReceiveProps` 中相同的方式访问先前的 props。

您可能想知道为什么我们不将以前的 props 作为参数传递给 `getDerivedStateFromProps`。我们在设计 API 时考虑了这个选项，但最终没有这样决定，有两个原因：
* 第一次调用 `getDerivedStateFromProps` 时（实例化后），`prevProps` 参数将为 null，需要在访问 `prevProps` 时添加 if-not-null 检查。
* 不将先前的 props 传递给此函数是在未来的 React 版本中释放内存的一步。（如果 React 不需要将先前的 props 传递给生命周期，那么它不需要将先前的 `props` 对象保留在内存中。）

> 注意
>
> 如果您正在编写共享组件，[`react-lifecycles-compat`](https://github.com/reactjs/react-lifecycles-compat) polyfill 也可以使新的 `getDerivedStateFromProps` 生命周期与旧版本的 React 一起使用。[在下面详细了解如何使用它。](#open-source-project-maintainers)

### 调用外部回调{#invoking-external-callbacks}

以下是在内部 state 发生变化时调用外部函数的组件示例：
`embed:update-on-async-rendering/invoking-external-callbacks-before.js`

有时人们使用 `componentWillUpdate` 是因为错误地担心，当 `componentDidUpdate` 触发时，更新其他组件的状态“为时已晚”。事实并非如此。React 确保在 `componentDidMount` 和 `componentDidUpdate` 中发生的任何 `setState` 调用都在用户看到更新的 UI 之前被刷新。通常，最好避免像这样的级联更新，但在某些情况下它们是必需的（例如，如果您需要在测量渲染的 DOM 元素后定位工具提示）。

无论哪种方式，在异步模式下将 `componentWillUpdate` 用于此目的是不安全的，因为对于单个更新，可能会多次调用外部回调。相反，应该使用 `componentDidUpdate` 生命周期，因为保证每次更新只调用一次：
`embed:update-on-async-rendering/invoking-external-callbacks-after.js`

### props 改变副作用{#side-effects-on-props-change}

与[以上示例](#invoking-external-callbacks)类似，有时组件在 `props` 更改时会产生副作用。
`embed:update-on-async-rendering/side-effects-when-props-change-before.js`

与 `componentWillUpdate`类似，`componentWillReceiveProps` 可能会在单个更新中多次被调用。因此，避免这种方法产生副作用是很重要的。相反，应该使用 `componentDidUpdate`，因为它保证每次更新只调用一次：

`embed:update-on-async-rendering/side-effects-when-props-change-after.js`

### props 改变时获取外部数据{#fetching-external-data-when-props-change}

以下是基于 `props` 值获取外部数据的组件示例：
`embed:update-on-async-rendering/updating-external-data-when-props-change-before.js`

此组件的建议升级路径是将数据更新移动到 `componentDidUpdate` 中。您还可以使用新的 `getDerivedStateFromProps` 生命周期在渲染新 props 之前清除过时的数据：
`embed:update-on-async-rendering/updating-external-data-when-props-change-after.js`

> 注意
>
> 如果您正在使用支持取消的 HTTP 库，例如 [axios](https://www.npmjs.com/package/axios)，那么在卸载时取消正在进行的请求很简单。对于原生 Promise，您可以使用类似于[此处所示](https://gist.github.com/bvaughn/982ab689a41097237f6e9860db7ca8d6)的方法。

### 更新之前读取 DOM 属性{#reading-dom-properties-before-an-update}

下面是一个组件的示例，该组件在更新之前从 DOM 中读取属性，以便在列表中保持滚动位置：
`embed:update-on-async-rendering/react-dom-properties-before-update-before.js`

在上面的示例中，`componentWillUpdate` 用于读取 DOM 属性。但是，对于异步渲染，在“渲染”阶段生命周期（如 `componentWillUpdate` 和 `render`）和“提交”阶段生命周期（如 `componentDidUpdate`）之间可能存在延迟。如果用户在这段时间内执行类似调整窗口大小的操作，则从 `componentWillUpdate` 读取的 `scrollHeight` 值将过时。

这个问题的解决方案是使用新的“提交”阶段生命周期 `getSnapshotBeforeUpdate`。在 mutations 发生之前（例如，在更新 DOM 之前）立即调用此方法。它可以返回一个值，React 将其作为参数传递给 `componentDidUpdate`，后者在发生 mutations 后立即被调用。

这两个生命周期可以像这样一起使用:

`embed:update-on-async-rendering/react-dom-properties-before-update-after.js`

> 注意
>
> 如果您正在编写共享组件，[`react-lifecycles-compat`](https://github.com/reactjs/react-lifecycles-compat) polyfill 也可以使新的 `getSnapshotBeforeUpdate` 生命周期与旧版本的 React 一起使用。[在下面详细了解如何使用它。](#open-source-project-maintainers)

## 其他场景 {#other-scenarios}

虽然我们试图在这篇文章中涵盖最常见的用例，但我们认识到我们可能错过了其中的一些用例。如果您使用本文章中未涵盖的方式使用 `componentWillMount`、`componentWillUpdate` 或 `componentWillReceiveProps` ，并且不确定如何迁移这些遗留生命周期，请[根据我们的文档提交一个新的 issue](https://github.com/reactjs/reactjs.org/issues/new)，并提供您的代码示例和尽可能多的背景信息。我们将在出现新的替代模式时更新此文档。

## 开源项目维护者 {#open-source-project-maintainers}

开源维护者可能想知道这些变化对共享组件意味着什么。如果您实现上述建议，那么依赖于新的静态 `getDerivedStateFromProps` 生命周期的组件会发生什么？您是否还必须发布新的主要版本并降低 React 16.2 及更早版本的兼容性？

幸运的是，你不需要这样！

当 React 16.3 发布时，我们还将发布一个新的 npm 包，[`react-lifecycles-compat`](https://github.com/reactjs/react-lifecycles-compat)。
此包 polyfills 组件，以便新的 `getDerivedStateFromProps` 和 `getSnapshotBeforeUpdate` 生命周期也可以与旧版本的 React（0.14.9+）一起使用。

要使用此 polyfill，首先将其作为依赖项添加到库中：

```bash
# Yarn
yarn add react-lifecycles-compat

# NPM
npm install react-lifecycles-compat --save
```

接下来，更新组件以使用新的生命周期（如上所述）。

最后，使用 polyfill 使组件向后兼容旧版本的 React：
`embed:update-on-async-rendering/using-react-lifecycles-compat.js`
