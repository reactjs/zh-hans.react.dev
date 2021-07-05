---
title: 异步渲染之更新
author: [bvaughn]
---

一年多来，React 团队一直致力于实现异步渲染。上个月，在 JSConf 冰岛的演讲中，[Dan 展示了异步渲染带来的新可能性](/blog/2018/03/01/sneak-peek-beyond-react-16.html)。现在，我们希望与你分享我们在使用这些功能时学到的一些经验教训，以及一些帮助你在组件启动时准备异步渲染的方法。

我们得到最重要的经验是，过时的组件生命周期往往会带来不安全的编码实践，具体函数如下：

* `componentWillMount`
* `componentWillReceiveProps`
* `componentWillUpdate`

这些生命周期方法经常被误解和滥用；此外，我们预计，在异步渲染中，它们潜在的误用问题可能更大。我们将在即将发布的版本中为这些生命周期添加 “UNSAFE_” 前缀。（这里的 “unsafe” 不是指安全性，而是表示使用这些生命周期的代码在 React 的未来版本中更有可能出现 bug，尤其是在启用异步渲染之后。）

## 逐步迁移路径 {#gradual-migration-path}

[React 遵循语义版本控制](/blog/2016/02/19/new-versioning-scheme.html)，因此这种变化将是逐步的。我们目前的计划是：

* **16.3**：为不安全的生命周期引入别名，`UNSAFE_componentWillMount`、`UNSAFE_componentWillReceiveProps` 和 `UNSAFE_componentWillUpdate`。（旧的生命周期名称和新的别名都可以在此版本中使用。）
* **未来 16.x 版本**：为 `componentWillMount`、`componentWillReceiveProps` 和 `componentWillUpdate` 启用废弃告警。（旧的生命周期名称和新的别名都将在这个版本中工作，但是旧的名称在开发模式下会产生一个警告。）
* **17.0**：删除 `componentWillMount`、`componentWillReceiveProps` 和 `componentWillUpdate`。（在此版本之后，只有新的 "UNSAFE_" 生命周期名称可以使用。）

**注意，如果你是 React 应用程序开发人员，则无需对这些过时的方法执行任何操作。即将发布的 16.3 版本的主要目的是使开源项目维护人员能够在任何废弃警告之前更新他们的库。在未来的 16.x 版本发布之前，不会启用这些警告。**

我们在 Facebook 上维护了超过 50,000 个 React 组件，我们不打算立即重写它们。我们知道迁移需要时间。我们将与 React 社区中的每个人一起采取逐步迁移的方式。

If you don't have the time to migrate or test these components, we recommend running a ["codemod"](https://medium.com/@cpojer/effective-javascript-codemods-5a6686bb46fb) script that renames them automatically:

```bash
cd your_project
npx react-codemod rename-unsafe-lifecycles
```

Learn more about this codemod on the [16.9.0 release post.](https://reactjs.org/blog/2019/08/08/react-v16.9.0.html#renaming-unsafe-lifecycle-methods) 

---

## 迁移过时的生命周期 {#migrating-from-legacy-lifecycles}

如果你想开始使用 React 16.3 中引入的新组件 API（或者如果你是维护人员，希望提前更新你的库），下面是一些示例，我们希望它们将帮助你开始以不同的方式思考组件。随着时间的推移，我们计划在文档中添加额外的“方法”，来说明如何以避免有问题的生命周期的方式执行常见任务。

在开始之前，下面是关于 16.3 版本计划的生命周期变更的快速概述：
* 我们将**添加以下生命周期别名**：`UNSAFE_componentWillMount`、`UNSAFE_componentWillReceiveProps` 和 `UNSAFE_componentWillUpdate`。（将同时支持旧的生命周期名称和新别名。）
* 我们将**引入两个新的生命周期**，静态的 `getDerivedStateFromProps` 和 `getSnapshotBeforeUpdate`。

### 新的生命周期：`getDerivedStateFromProps` {#new-lifecycle-getderivedstatefromprops}

`embed:update-on-async-rendering/definition-getderivedstatefromprops.js`

新的静态 `getDerivedStateFromProps` 生命周期方法在组件实例化之后以及重新渲染之前调用。它可以返回一个对象来更新 `state`，或者返回 `null` 来表示新的 `props` 不需要任何 `state` 的更新。

与 `componentDidUpdate` 一起，这个新的生命周期涵盖过时的 `componentWillReceiveProps` 的所有用例。

>注意：
>
>旧的 `componentWillReceiveProps` 和新的 `getDerivedStateFromProps` 方法都会增加组件的复杂性。这经常会导致 [bug](/blog/2018/06/07/you-probably-dont-need-derived-state.html#common-bugs-when-using-derived-state)。考虑使用 **[派生 state 的简单替代方法](/blog/2018/06/07/you-probably-dont-need-derived-state.html)** 让组件可预测且可维护。

### 新的生命周期：`getSnapshotBeforeUpdate` {#new-lifecycle-getsnapshotbeforeupdate}

`embed:update-on-async-rendering/definition-getsnapshotbeforeupdate.js`

新的 `getSnapshotBeforeUpdate` 生命周期方法在更新之前（如：更新 DOM 之前）被调用。此生命周期的返回值将作为第三个参数传递给 `componentDidUpdate`。（通常不需要，但在重新渲染过程中手动保留滚动位置等情况下非常有用。）

与 `componentDidUpdate` 一起，这个新的生命周期涵盖过时的 `componentWillUpdate` 的所有用例。

你可以[在这个 gist](https://gist.github.com/gaearon/88634d27abbc4feeb40a698f760f3264)中找到他们的类型签名。

下面我们将介绍如何使用这两个生命周期的示例。

## 示例 {#examples}
- [初始化 state](#initializing-state)
- [获取外部数据](#fetching-external-data)
- [添加事件监听器（或订阅）](#adding-event-listeners-or-subscriptions)
- [基于 props 更新 `state`](#updating-state-based-on-props)
- [调用外部回调](#invoking-external-callbacks)
- [props 更新的副作用](#side-effects-on-props-change)
- [props 更新时获取外部数据](#fetching-external-data-when-props-change)
- [更新前读取 DOM 属性](#reading-dom-properties-before-an-update)

> 注意
>
> 为了简洁起见，以下示例是使用实验性的类属性转换编写的，但是相同的迁移策略在没有它的情况下也适用。

### 初始化 state {#initializing-state}

这个例子显示了组件在 `componentWillMount` 中调用 `setState`：
`embed:update-on-async-rendering/initializing-state-before.js`

对于这种类型的组件，最简单的重构是将 state 的初始化，移到构造函数或属性的初始化器内，如下所示：
`embed:update-on-async-rendering/initializing-state-after.js`

### 获取外部数据 {#fetching-external-data}

以下是使用 `componentWillMount` 获取外部数据的组件的示例：
`embed:update-on-async-rendering/fetching-external-data-before.js`

上述代码对于服务器渲染（不使用外部数据）和即将推出的异步渲染模式（可能多次启动请求）都存在问题。

大多数用例推荐的升级方式是将数据获取移到 `componentDidMount`：
`embed:update-on-async-rendering/fetching-external-data-after.js`

有一个常见的误解是，在 `componentWillMount` 中获取数据可以避免第一次渲染为空的状态。实际上，这是不对的，因为 React 总是在 `componentWillMount` 之后立即执行 `render`。如果在 `componentWillMount` 触发时数据不可用，那么第一次 `render` 仍然会显示加载的状态，而不管你在哪里初始化获取数据。这就是为什么在绝大多数情况下，将获取数据移到 `componentDidMount` 没有明显效果的原因。

> 注意
>
> 一些高级用例（如：Relay 库）可能尝试提前获取异步数据。[这里](https://gist.github.com/bvaughn/89700e525ff423a75ffb63b1b1e30a8f)提供了一个如何实现的示例。
>
> 从长远来看，在 React 组件中获取数据的标准方法应该基于 “suspense” API [在冰岛 JSConf 提出](/blog/2018/03/01/sneak-peek-beyond-react-16.html)。无论是简单的数据获取解决方案，还是像 Apollo 和 Relay 这样的库，都可以在内部使用它。它比上面的任何一个解决方案都要简洁，但是不会在 16.3 版本发布之前完成。
>
> 当支持服务器渲染时，需要同步获取数据——`componentWillMount` 经常用于此目的，也可以用构造函数替代。即将推出的 suspense API 将使异步数据获取对于客户端和服务器渲染都是完全有可能的。

### 添加事件监听器（或订阅） {#adding-event-listeners-or-subscriptions}

下面是一个示例，在组件挂载时订阅了外部事件：
`embed:update-on-async-rendering/adding-event-listeners-before.js`

遗憾的是，这可能导致服务器渲染（永远不会调用 `componentWillUnmount`）和异步渲染（在渲染完成之前可能被中断，导致不调用 `componentWillUnmount`）的内存泄漏。

人们通常认为 `componentWillMount` 和 `componentWillUnmount` 是成对出现的，但这并不能保证。只有调用了 `componentDidMount` 之后，React 才能保证稍后调用 `componentWillUnmount` 进行清理。

因此，添加监听器/订阅的推荐方法是使用 `componentDidMount` 生命周期：
`embed:update-on-async-rendering/adding-event-listeners-after.js`

<<<<<<< HEAD
有时，更新订阅来响应属性变更非常重要。如果你正在使用像 Redux 或 MobX 这样的库，库的容器组件应该为你处理了这个问题。对于应用程序作者，我们创建了一个小型库，[`create-subscription`](https://github.com/facebook/react/tree/master/packages/create-subscription)，来帮助解决这个问题。我们将它与 React 16.3 一起发布。
=======
Sometimes it is important to update subscriptions in response to property changes. If you're using a library like Redux or MobX, the library's container component should handle this for you. For application authors, we've created a small library, [`create-subscription`](https://github.com/facebook/react/tree/main/packages/create-subscription), to help with this. We'll publish it along with React 16.3.
>>>>>>> 0bb0303fb704147452a568472e968993f0729c28

我们可以使用 `create-subscription` 来传递订阅的值，而不是像上面示例那样传递一个可订阅的 `dataSource` prop：

`embed:update-on-async-rendering/adding-event-listeners-create-subscription.js`

> 注意：
> 
> 像 Relay/Apollo 这样的库，内部应该使用了与 `create-subscription` 相同的技术，用最适合他们库使用的方式手动管理订阅（参考[这里](https://gist.github.com/bvaughn/d569177d70b50b58bff69c3c4a5353f3)）。

### 基于 `props` 更新 `state` {#updating-state-based-on-props}

>注意：
>
>旧的 `componentWillReceiveProps` 和新的 `getDerivedStateFromProps` 方法都会给组件增加明显的复杂性。这通常会导致 [bug](/blog/2018/06/07/you-probably-dont-need-derived-state.html#common-bugs-when-using-derived-state)。考虑 **[派生 state 的简单替代方法](/blog/2018/06/07/you-probably-dont-need-derived-state.html)** 使组件可预测且可维护。

这是一个示例，组件使用过时的 `componentWillReceiveProps` 生命周期基于新的 `props` 更新 `state`：
`embed:update-on-async-rendering/updating-state-from-props-before.js`

尽管上面的代码本身没有问题，但是 `componentWillReceiveProps` 生命周期经常被误用，_会_ 产生问题。因此，该方法将被废弃。

从 16.3 版本开始，当 `props` 变化时，建议使用新的 `static getDerivedStateFromProps` 生命周期更新 `state`。创建组件以及每次组件由于 props 或 state 的改变而重新渲染时都会调用该生命周期：
`embed:update-on-async-rendering/updating-state-from-props-after.js`

在上面的示例中，你可能会注意到 `props.currentRow` 在 state 中的镜像（`state.lastRow`）。这使得 `getDerivedStateFromProps` 能够像在 `componentWillReceiveProps` 中相同的方式访问上一个 props 的值。

你可能想知道为什么我们不将上一个 props 作为参数传递给 `getDerivedStateFromProps`。我们在设计 API 时考虑过这个方案，但最终决定不采用它，原因有两个：
* `prevProps` 参数在第一次调用 `getDerivedStateFromProps`（实例化之后）时为 null，需要在每次访问 `prevProps` 时添加 if-not-null 检查。
* 在 React 的未来版本中，不传递上一个 props 给这个方法是为了释放内存。（如果 React 无需传递上一个 props 给生命周期，那么它就无需保存上一个 `props` 对象在内存中。）

> 注意
>
> 如果你正在编写共享组件，[`react-lifecycles-compat`](https://github.com/reactjs/react-lifecycles-compat) polyfill 可以在旧版本的 React 里面使用新的 `getDerivedStateFromProps` 生命周期。[在下面了解更多如何使用。](#open-source-project-maintainers)

### 调用外部回调 {#invoking-external-callbacks}

下面是一个组件的示例，它在内部 state 发生变化时调用了外部函数：
`embed:update-on-async-rendering/invoking-external-callbacks-before.js`

有时人们使用 `componentWillUpdate` 是出于一种错误的担心，即当 `componentDidUpdate` 触发时，更新其他组件的 state 已经"太晚"了。事实并非如此。React 可确保在用户看到更新的 UI 之前，刷新在 `componentDidMount` 和 `componentDidUpdate` 期间发生的任何 `setState` 调用。通常，最好避免这样的级联更新，但在某些情况下，这些更新是必需的（例如：如果你需要在测量渲染的 DOM 元素后，定位工具的提示）。

不管怎样，在异步模式下使用 `componentWillUpdate` 都是不安全的，因为外部回调可能会在一次更新中被多次调用。相反，应该使用 `componentDidUpdate` 生命周期，因为它保证每次更新只调用一次：
`embed:update-on-async-rendering/invoking-external-callbacks-after.js`

### props 更新的副作用 {#side-effects-on-props-change}

类似于[上面的例子](#invoking-external-callbacks)，有时候组件在 `props` 发生变化时会产生副作用。

`embed:update-on-async-rendering/side-effects-when-props-change-before.js`

与 `componentWillUpdate` 类似，`componentWillReceiveProps` 可能在一次更新中被多次调用。因此，避免在此方法中产生副作用非常重要。相反，应该使用 `componentDidUpdate`，因为它保证每次更新只调用一次：

`embed:update-on-async-rendering/side-effects-when-props-change-after.js`

### `props` 更新时获取外部数据 {#fetching-external-data-when-props-change}

下面是一个组件的示例，它根据 `props` 的值获取外部数据：
`embed:update-on-async-rendering/updating-external-data-when-props-change-before.js`

此组件的推荐升级路径是将数据更新移动到 `componentDidUpdate`。你还可以使用新的 `getDerivedStateFromProps` 生命周期，在渲染新的 props 之前清除旧数据：
`embed:update-on-async-rendering/updating-external-data-when-props-change-after.js`

> 注意
>
> 如果你正在使用支持取消的 HTTP 库，例如 [axios](https://www.npmjs.com/package/axios) 那么在卸载时取消正在进行的请求非常简单。对于原生的 Promise，你可以使用类似[此处所示](https://gist.github.com/bvaughn/982ab689a41097237f6e9860db7ca8d6)的方法。

### 更新前读取 DOM 属性 {#reading-dom-properties-before-an-update}

下面是一个组件的示例，该组件在更新之前从 DOM 中读取属性，以便在列表中保持滚动的位置：
`embed:update-on-async-rendering/react-dom-properties-before-update-before.js`

在上面的示例中，`componentWillUpdate` 用于读取 DOM 属性。但是，对于异步渲染，“渲染”阶段的生命周期（如 `componentWillUpdate` 和 `render`）和"提交"阶段的生命周期（如 `componentDidUpdate`）之间可能存在延迟。如果用户在这段时间内调整窗口大小，那么从 `componentWillUpdate` 读取的 `scrollHeight` 值将过时。

这个问题的解决方案是使用新的“提交”阶段生命周期 `getSnapshotBeforeUpdate`。这个方法在发生变化 _前立即_ 被调用（例如在更新 DOM 之前）。它可以返回一个 React 的值作为参数传递给 `componentDidUpdate` 方法，该方法在发生变化 _后立即_ 被调用。

这两个生命周期可以像这样一起使用：

`embed:update-on-async-rendering/react-dom-properties-before-update-after.js`

> 注意
>
> 如果你正在编写共享组件，那么 [`react-lifecycles-compat`](https://github.com/reactjs/react-lifecycles-compat) polyfill 可以使新的 `getSnapshotBeforeUpdate` 生命周期与旧版本的 React 一起使用。[在下面了解更多如何使用。](#open-source-project-maintainers)

## 其他场景 {#other-scenarios}

尽管我们试图在这篇博文中涵盖最常见的用例，但是我们意识到依然可能会遗漏其中的一些用例。如果你正在以本博文未涵盖的方式使用 `componentWillMount`、`componentWillUpdate` 或者 `componentWillReceiveProps`，并且不确定如何迁移这些过时的生命周期，请[根据我们的文档提交一个新的 issue](https://github.com/reactjs/reactjs.org/issues/new)，附上你的代码示例，并提供尽可能多的背景信息。当出现新的替代用例时，我们将用它们更新此文档。

## 开源项目维护者 {#open-source-project-maintainers}

开源维护者可能想知道这些变化对共享组件意味着什么。如果你实现了上述建议，那么依赖于新的静态 `getDerivedStateFromProps` 生命周期的组件会发生什么情况呢？你是否还必须发布一个新的主要版本，删除 React 16.2 以及更旧版本的兼容代码？

幸运的是，你不需要这样做！

当 React 16.3 发布时，我们还将发布一个新的 npm 包，[`react-lifecycles-compat`](https://github.com/reactjs/react-lifecycles-compat)。它提供了组件的 polyfill，以便新的 `getDerivedStateFromProps` 和 `getSnapshotBeforeUpdate` 生命周期也适用于旧版本的 React（0.14.9+）。

要使用此 polyfill，首先将其作为依赖项添加到库中：

```bash
# Yarn
yarn add react-lifecycles-compat

# NPM
npm install react-lifecycles-compat --save
```

接下来，更新组件使用新的生命周期（如上所述）。

最后，使用 polyfill 让组件向后兼容旧版本的 React：
`embed:update-on-async-rendering/using-react-lifecycles-compat.js`
