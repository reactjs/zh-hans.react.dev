---
id: strict-mode
title: 严格模式
permalink: docs/strict-mode.html
---

`StrictMode` 是一个用来突出显示应用程序中潜在问题的工具。与 `Fragment` 一样，`StrictMode` 不会渲染任何可见的 UI。它为其后代元素触发额外的检查和警告。

> 注意：
>
> 严格模式检查仅在开发模式下运行；_它们不会影响生产构建_。

你可以为应用程序的任何部分启用严格模式。例如：
`embed:strict-mode/enabling-strict-mode.js`

在上述的示例中，*不*会对 `Header` 和 `Footer` 组件运行严格模式检查。但是，`ComponentOne` 和 `ComponentTwo` 以及它们的所有后代元素都将进行检查。

`StrictMode` 目前有助于：
* [识别不安全的生命周期](#identifying-unsafe-lifecycles)
* [关于使用过时字符串 ref API 的警告](#warning-about-legacy-string-ref-api-usage)
* [关于使用废弃的 findDOMNode 方法的警告](#warning-about-deprecated-finddomnode-usage)
* [检测意外的副作用](#detecting-unexpected-side-effects)
* [检测过时的 context API](#detecting-legacy-context-api)
* [确保可复用的状态](#ensuring-reusable-state)

未来的 React 版本将添加更多额外功能。

### 识别不安全的生命周期 {#identifying-unsafe-lifecycles}

正如[这篇博文](/blog/2018/03/27/update-on-async-rendering.html)所述，某些过时的生命周期方法在异步 React 应用程序中使用是不安全的。但是，如果你的应用程序使用了第三方库，很难确保它们不使用这些生命周期方法。幸运的是，严格模式可以帮助解决这个问题！

当启用严格模式时，React 会列出使用了不安全生命周期方法的所有 class 组件，并打印一条包含这些组件信息的警告消息，如下所示：

![](../images/blog/strict-mode-unsafe-lifecycles-warning.png)

*此时*解决项目中严格模式所识别出来的问题，会使得在未来的 React 版本中使用 concurrent 渲染变得更容易。

### 关于使用过时字符串 ref API 的警告 {#warning-about-legacy-string-ref-api-usage}

以前，React 提供了两种方法管理 refs 的方式：已过时的字符串 ref API 的形式及回调函数 API 的形式。尽管字符串 ref API 在两者中使用更方便，但是它有[一些缺点](https://github.com/facebook/react/issues/1373)，因此官方推荐采用[回调的方式](/docs/refs-and-the-dom.html#legacy-api-string-refs)。

React 16.3 新增了第三种选择，它提供了使用字符串 ref 的便利性，并且不存在任何缺点：
`embed:16-3-release-blog-post/create-ref-example.js`

由于对象 ref 主要是为了替换字符串 ref 而添加的，因此严格模式现在会警告使用字符串 ref。

> **注意：**
>
> 除了新增加的 `createRef` API，回调 ref 依旧适用。
>
> 你无需替换组件中的回调 ref。它们更灵活，因此仍将作为高级功能保留。

[在此处了解有关 `createRef` API 的更多信息](/docs/refs-and-the-dom.html)

### 关于使用废弃的 findDOMNode 方法的警告 {#warning-about-deprecated-finddomnode-usage}

React 支持用 `findDOMNode` 来在给定 class 实例的情况下在树中搜索 DOM 节点。通常你不需要这样做，因为你可以[将 ref 直接绑定到 DOM 节点](/docs/refs-and-the-dom.html#creating-refs)。

`findDOMNode` 也可用于 class 组件，但它违反了抽象原则，它使得父组件需要单独渲染子组件。它会产生重构危险，你不能更改组件的实现细节，因为父组件可能正在访问它的 DOM 节点。`findDOMNode` 只返回第一个子节点，但是使用 Fragments，组件可以渲染多个 DOM 节点。`findDOMNode` 是一个只读一次的 API。调用该方法只会返回第一次查询的结果。如果子组件渲染了不同的节点，则无法跟踪此更改。因此，`findDOMNode` 仅在组件返回单个且不可变的 DOM 节点时才有效。

你可以通过将 ref 传递给自定义组件并使用 [ref 转发](/docs/forwarding-refs.html#forwarding-refs-to-dom-components)来将其传递给 DOM 节点。

你也可以在组件中创建一个 DOM 节点的 wrapper，并将 ref 直接绑定到它。

```javascript{4,7}
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.wrapper = React.createRef();
  }
  render() {
    return <div ref={this.wrapper}>{this.props.children}</div>;
  }
}
```

> 注意：
>
> 在 CSS 中，如果你不希望节点成为布局的一部分，则可以使用 [`display: contents`](https://developer.mozilla.org/en-US/docs/Web/CSS/display#display_contents) 属性。

### 检测意外的副作用 {#detecting-unexpected-side-effects}

从概念上讲，React 分两个阶段工作：
* **渲染** 阶段会确定需要进行哪些更改，比如 DOM。在此阶段，React 调用 `render`，然后将结果与上次渲染的结果进行比较。
* **提交** 阶段发生在当 React 应用变化时。（对于 React DOM 来说，会发生在 React 插入，更新及删除 DOM 节点的时候。）在此阶段，React 还会调用 `componentDidMount` 和 `componentDidUpdate` 之类的生命周期方法。

提交阶段通常会很快，但渲染过程可能很慢。因此，即将推出的 concurrent 模式 (默认情况下未启用) 将渲染工作分解为多个部分，对任务进行暂停和恢复操作以避免阻塞浏览器。这意味着 React 可以在提交之前多次调用渲染阶段生命周期的方法，或者在不提交的情况下调用它们（由于出现错误或更高优先级的任务使其中断）。

渲染阶段的生命周期包括以下 class 组件方法：
* `constructor`
* `componentWillMount` (or `UNSAFE_componentWillMount`)
* `componentWillReceiveProps` (or `UNSAFE_componentWillReceiveProps`)
* `componentWillUpdate` (or `UNSAFE_componentWillUpdate`)
* `getDerivedStateFromProps`
* `shouldComponentUpdate`
* `render`
* `setState` 更新函数（第一个参数）

因为上述方法可能会被多次调用，所以不要在它们内部编写副作用相关的代码，这点非常重要。忽略此规则可能会导致各种问题的产生，包括内存泄漏和或出现无效的应用程序状态。不幸的是，这些问题很难被发现，因为它们通常具有[非确定性](https://en.wikipedia.org/wiki/Deterministic_algorithm)。

严格模式不能自动检测到你的副作用，但它可以帮助你发现它们，使它们更具确定性。通过故意重复调用以下函数来实现的该操作：

* class 组件的 `constructor`，`render` 以及 `shouldComponentUpdate` 方法
* class 组件的生命周期方法 `getDerivedStateFromProps`
* 函数组件体
* 状态更新函数 (即 `setState` 的第一个参数）
* 函数组件通过使用 `useState`，`useMemo` 或者 `useReducer`

> 注意：
>
> 这仅适用于开发模式。_生产模式下生命周期不会被调用两次。_

例如，请考虑以下代码：
`embed:strict-mode/side-effects-in-constructor.js`

这段代码看起来似乎没有问题。但是如果 `SharedApplicationState.recordEvent` 不是[幂等](https://en.wikipedia.org/wiki/Idempotence#Computer_science_meaning)的情况下，多次实例化此组件可能会导致应用程序状态无效。这种小 bug 可能在开发过程中不会表现出来，或者说表现出来但并不明显，并因此被忽视。

严格模式采用故意重复调用方法（如组件的构造函数）的方式，使得这种 bug 更容易被发现。

> 注意：
>
> 在 React 17 中，React 会自动修改 console 的方法，例如 `console.log()`，在第二次调用生命周期函数时，将日志静默。然而，在某些情况下，这可能会导致一些不符合期望的行为发生，此时，[可以使用替代解决方案](https://github.com/facebook/react/issues/20090#issuecomment-715927125)。
>
> 从 React 18 开始，React 不会抑制任何日志。不过，如果你安装了 React Dev Tools，第二次调用的日志会出现被轻微淡化。React DevTools 也提供了一个设置（默认关闭）来完全抑制它们。

### 检测过时的 context API {#detecting-legacy-context-api}

过时的 context API 容易出错，将在未来的主要版本中删除。在所有 16.x 版本中它仍然有效，但在严格模式下，将显示以下警告：

![](../images/blog/warn-legacy-context-in-strict-mode.png)

阅读[新的 context API 文档](/docs/context.html)以帮助你迁移到新版本。


### 确保可复用的 state {#ensuring-reusable-state}

在未来，我们希望增加一个功能，允许 React 在保留 state 的同时对 UI 进行增删。例如，当用户从当前屏幕的标签离开并返回时，React 应该能立即展示之前屏幕的内容。为了做到这一点，React 支持使用卸载前已有的组件状态重新挂载到树上。

该特性会给 React 带来更好的开箱即用性能，但需要组件对多次挂载和销毁的副作用具有弹性。大多数副作用将在不做任何改变的情况下工作，但有些副作用可能会在销毁回调中未正确的清理订阅，或者隐示的认为它们只被挂载或销毁一次。

为了帮助解决这些问题，React 18 为严格模式引入了一个全新的仅用于开发环境的检查操作。每当第一次安装组件时，这个新的检查将自动卸载并重新安装每个组件，并在第二次挂载时恢复之前的 state。

为了演示你在严格模式下看到的具有这一特性的开发行为，考虑一下当 React 挂载一个新组件时会发生什么？如果没有这个变化，当一个组件挂载时，React 会创建副作用：

```
* React mounts the component.
  * Layout effects are created.
  * Effects are created.
```

从 React 18 开始的严格模式，每当组件在开发中挂载时，React 会模拟立即卸载和重新挂载组件：

```
* React mounts the component.
    * Layout effects are created.
    * Effect effects are created.
* React simulates effects being destroyed on a mounted component.
    * Layout effects are destroyed.
    * Effects are destroyed.
* React simulates effects being re-created on a mounted component.
    * Layout effects are created
    * Effect setup code runs
```

在第二次挂载时，React 将恢复第一次装载时的状态。这个功能模拟了用户的行为，比如用户从屏幕上切换标签再回来，确保代码能正确处理状态恢复。

当组件卸载时，副作用会如常销毁：

```
* React unmounts the component.
  * Layout effects are destroyed.
  * Effect effects are destroyed.
```

卸载和重新挂载的函数，包括：

- `componentDidMount`
- `componentWillUnmount`
- `useEffect`
- `useLayoutEffect`
- `useInsertionEffect`

> 注意：
>
> 这只适用于开发模式，_生产环境没有变化_。

如需了解更多常见问题，请参阅：
  - [如何在 Effects 中支持可复用的 state](https://github.com/reactwg/react-18/discussions/18)
