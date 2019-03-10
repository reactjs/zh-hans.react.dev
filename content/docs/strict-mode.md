---
id: strict-mode
title: 严格模式
permalink: docs/strict-mode.html
---

`StrictMode` 是一个用来突出显示应用程序中潜在问题的工具。 与 `Fragment` 一样， `StrictMode` 不会渲染任何可见的 UI。它为其后代元素触发额外的检查和警告。

> 注意：
>
> 严格模式检查仅在开发模式下运行； _它们不会影响生产构建_。

你可以为应用程序的任何部分启用严格模式。例如：
`embed:strict-mode/enabling-strict-mode.js`

在上面的示例中，*不* 会对 `Header` 和 `Footer` 组件运行严格模式检查。但是， `ComponentOne` 和 `ComponentTwo` 以及它们的所有后代元素都将进行检查。 

`StrictMode` 目前有助于：
* [识别不安全的生命周期](#identifying-unsafe-lifecycles)
* [关于使用过时字符串 ref API 的警告](#warning-about-legacy-string-ref-api-usage)
* [关于使用废弃的 findDOMNode 方法的警告](#warning-about-deprecated-finddomnode-usage)
* [检测意外的副作用](#detecting-unexpected-side-effects)
* [检测过时的 context API](#detecting-legacy-context-api)

未来的React版本将添加其他功能。

### 识别不安全的生命周期 {#identifying-unsafe-lifecycles}

正如 [这篇博文](/blog/2018/03/27/update-on-async-rendering.html) 所述，某些过时的生命周期方法在异步 React 应用程序中使用是不安全的。但是，如果你的应用程序使用第三方库，很难确保它们不使用这些生命周期方法。幸运的是，严格模式可以帮助解决这个问题！

当启用严格模式时，React 会列出使用不安全生命周期方法的所有类组件，并记录一条包含这些组件信息的警告消息，如下所示：

![](../images/blog/strict-mode-unsafe-lifecycles-warning.png)

_现在_ 解决严格模式识别的问题，会让你在未来的 React 版本中利用异步渲染变得更容易。

### 关于使用过时字符串 ref API 的警告{#warning-about-legacy-string-ref-api-usage}

以前，React 提供了两种方法管理 ref：过时字符串 ref API 和回调 API。 尽管字符串 ref API 在两者中使用更方便，但是它有 [一些缺点](https://github.com/facebook/react/issues/1373)， 因此我们官方推荐 [使用回调方式](/docs/refs-and-the-dom.html#legacy-api-string-refs)。

React 16.3新增了第三种选择，它提供了字符串 ref 的便利性，并且没有任何缺点：
`embed:16-3-release-blog-post/create-ref-example.js`

由于对象 ref 主要是为了替换字符串 ref 而添加的，因此严格模式现在会警告使用字符串 ref。

> **注意：**
>
> 除了新增加的 `createRef` API，还将继续支持回调 ref。
>
> 你无需替换组件中的回调 ref。它们更灵活，因此仍将作为高级功能保留。

[在此处了解有关 `createRef` API 的更多信息](/docs/refs-and-the-dom.html)

### 关于使用废弃的 findDOMNode 方法的警告 {#warning-about-deprecated-finddomnode-usage}

React 支持用 `findDOMNode` 来在给定类实例的情况下在树中搜索 DOM 节点。通常你不需要这样做，因为你可以 [将 ref 直接绑定到 DOM 节点](/docs/refs-and-the-dom.html#creating-refs)。

`findDOMNode` 也可用于类组件，但它违反了抽象级别，允许父组件要求渲染某个子组件。它会产生重构危险，你不能更改组件的实现细节，因为父组件可能正在访问它的 DOM 节点。`findDOMNode` 只返回第一个子节点，但是使用 Fragments，组件可以渲染多个 DOM 节点。`findDOMNode` 是一个只读一次的 API。调用该方法只会返回第一次查询的结果。如果子组件渲染了不同的节点，则无法跟踪此更改。因此，`findDOMNode` 仅在组件返回单个且不可变的 DOM 节点时才有效。

你可以通过将 ref 传递给自定义组件并使用 [ref 转发](/docs/forwarding-refs.html#forwarding-refs-to-dom-components) 来将其传递给 DOM 节点。

你也可以在组件中创建一个 wrapper DOM 节点，并将 ref 直接绑定到它。

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
* **渲染** 阶段确定需要对 DOM 进行哪些更改。在此阶段，React 调用 `render`，然后将结果与前一个渲染的结果进行比较。
* **提交** 阶段是 React 应用任何更改的时间。（就 React DOM 来说，这是 React 插入，更新和删除 DOM 节点的时候。）在此阶段，React 还会调用 `componentDidMount` 和 `componentDidUpdate` 之类的生命周期方法。

提交阶段通常很快，但渲染可能很慢。因此，即将推出的异步模式 (默认情况下未启用) 将渲染工作分解为多个部分，暂停和恢复工作以避免阻塞浏览器。这意味着 React 可以在提交之前多次调用渲染阶段生命周期的方法，或者在不提交的情况下调用它们（由于错误或更高优先级的中断）。

渲染阶段的生命周期包括以下 class 组件方法：
* `constructor`
* `componentWillMount`
* `componentWillReceiveProps`
* `componentWillUpdate`
* `getDerivedStateFromProps`
* `shouldComponentUpdate`
* `render`
* `setState` 更新函数（第一个参数）

由于上述方法可能不止一次被调用，因此重要的是它们不会导致任何副作用。忽略此规则可能会导致各种问题，包括内存泄漏和无效的应用程序状态。不幸的是，很难发现这些问题，因为它们通常都是 [不确定](https://en.wikipedia.org/wiki/Deterministic_algorithm) 的。

严格模式不能自动检测到你的副作用，但它可以帮助你发现它们，使它们更具确定性。这是通过故意双重调用以下方法来完成的：

* class 组件的 `constructor` 方法
* `render` 方法
* `setState` 更新函数 (第一个参数）
* 静态的 `getDerivedStateFromProps` 生命周期方法

> 注意：
>
> 这仅适用于开发模式。_生产模式下生命周期不会被调用两次。_

例如，请考虑以下代码：
`embed:strict-mode/side-effects-in-constructor.js`


乍一看，这段代码似乎没有问题。但是如果 `SharedApplicationState.recordEvent` 不是 [幂等](https://en.wikipedia.org/wiki/Idempotence#Computer_science_meaning) 的，那么多次实例化此组件可能会导致应用程序状态无效。这种小 bug 可能在开发过程中不会表现出来，或者很少见，以至于它们不被注意到。

通过故意双重调用方法（如组件的构造函数），严格模式使得这样的情况更容易被发现。

### 检测过时的 context API {#detecting-legacy-context-api}

过时的 context API 容易出错，将在未来的主要版本中删除。在所有 16.x 版本中它仍然有效，但在严格模式下，将显示以下警告：

![](../images/blog/warn-legacy-context-in-strict-mode.png)

阅读 [新的 context API 文档](/docs/context.html) 以帮助你迁移到新版本。
