---
id: react-component
title: React.Component
layout: docs
category: Reference
permalink: docs/react-component.html
redirect_from:
  - "docs/component-api.html"
  - "docs/component-specs.html"
  - "docs/component-specs-ko-KR.html"
  - "docs/component-specs-zh-CN.html"
  - "tips/UNSAFE_componentWillReceiveProps-not-triggered-after-mounting.html"
  - "tips/dom-event-listeners.html"
  - "tips/initial-ajax.html"
  - "tips/use-react-with-other-libraries.html"
---

此页面包含React组件类定义的详细API参考。它假设你熟悉基本的React概念，例如[ Components 和 Props](/docs/components-and-props.html)，以及[ State 和 生命周期 ](/docs/state-and-lifecycle.html)。如果你不是，请先阅读。

## 概述 {#overview}

React允许你将组件定义为类或函数。定义为类的组件当前提供了更多功能，这些功能将在此页面中详细介绍。要定义React组件类，需要继承 React.Component：

```js
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

你必须在React.Component子类中定义一个名为render的函数。此页面上描述的其他方法都是可选的。

**我们强烈建议你不要创建自己的组件基类。** 在React组件中, [代码重用的实现主要通过组合而不是继承。](/docs/composition-vs-inheritance.html).

>注意:
>
>React不会强制你使用ES6类语法。如果你倾向于不使用它，你可以使用 create-react-class 模块或类似的自定义抽象来代替。在 [Using React without ES6](/docs/react-without-es6.html) 里查看更多.

### 组件的生命周期 {#the-component-lifecycle}

每个组件都有一些“生命周期方法”, 你可以重写代码运行在特定的时间。 你可以使用此生命周期图作为一个备忘单。在下面的列表中,常用的生命周期方法是标记为粗体。其他人存在相对罕见的用例。
#### 挂载 {#mounting}

按照以下顺序调用这些方法,当一个组件的一个实例被创建和插入到DOM:

- [**`constructor()`**](#constructor)
- [`static getDerivedStateFromProps()`](#static-getderivedstatefromprops)
- [**`render()`**](#render)
- [**`componentDidMount()`**](#componentdidmount)

>注意:
>
>这些方法已经被废弃里,你在新代码中应该[避免使用它们](/blog/2018/03/27/update-on-async-rendering.html):
>
>- [`UNSAFE_componentWillMount()`](#unsafe_componentwillmount)

#### 更新 {#updating}

props或state的变化会触发更新。当一个组件被重新渲染的时候会按照以下顺序调用这些方法:

- [`static getDerivedStateFromProps()`](#static-getderivedstatefromprops)
- [`shouldComponentUpdate()`](#shouldcomponentupdate)
- [**`render()`**](#render)
- [`getSnapshotBeforeUpdate()`](#getsnapshotbeforeupdate)
- [**`componentDidUpdate()`**](#componentdidupdate)

>注意:
>
>这些方法已经被废弃里,你在新代码中应该[避免使用它们](/blog/2018/03/27/update-on-async-rendering.html):
>
>- [`UNSAFE_componentWillUpdate()`](#unsafe_componentwillupdate)
>- [`UNSAFE_componentWillReceiveProps()`](#unsafe_componentwillreceiveprops)

#### 卸载 {#unmounting}

当一个组件正在调用此方法从DOM中删除:

- [**`componentWillUnmount()`**](#componentwillunmount)

#### 错误处理 {#error-handling}

这些方法会被触发, 当在渲染期间,或者生命周期方法,或任何子组件的构造函数中抛出错误的时候。

- [`static getDerivedStateFromError()`](#static-getderivedstatefromerror)
- [`componentDidCatch()`](#componentdidcatch)

### 其他 APIs {#other-apis}

每个组件还提供了一些额外的api:

  - [`setState()`](#setstate)
  - [`forceUpdate()`](#forceupdate)

### 类属性 {#class-properties}

  - [`defaultProps`](#defaultprops)
  - [`displayName`](#displayname)

### 实例属性 {#instance-properties}

  - [`props`](#props)
  - [`state`](#state)

* * *

## 说明 {#reference}

### 常用的生命周期方法 {#commonly-used-lifecycle-methods}

本节中的方法涵盖了创建React组件时遇到的绝大多数用例 **想要更好了解这些方法,可以参考[生命周期图谱](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/).**

### `render()` {#render}

```javascript
render()
```

render（）方法是类组件中唯一必需的方法。

调用时，它会检查this.props和this.state并返回以下类型之一：

- **React elements.** 通常通过JSX创建。例如， `<div />`和 `<MyComponent />`是React元素，它们指示React分别渲染DOM节点或另一个用户定义的组件。
- **Arrays and fragments.** 让你从渲染中返回多个元素。
有关更多详细信息，请参阅 [fragments](/docs/fragments.html) 文档
- **Portals**. 让你将子项渲染到不同的DOM子树中。
有关更多详细信息，请参阅有关 [portals](/docs/portals.html) 的文档。
- **String and numbers.** 它们在DOM中渲染为文本节点.
- **Booleans or `null`**.什么都不渲染。
（主要用于支持返回 `test && <Child />`模式，其中test是boolean类型。)

render（）函数应该是纯的，这意味着它不会修改组件状态的情况下，每次调用时都返回相同的结果，并且它不直接与浏览器交互。

如果需要与浏览器进行交互，请在componentDidMount（）或其他生命周期方法中执行你的工作。
保持render（）纯粹使组件更容易思考。

> 注意
>
> 如果shouldComponentUpdate（）返回false，则不会调用render（）。

* * *

### `constructor()` {#constructor}

```javascript
constructor(props)
```

**如果不需要初始化状态活不绑定方法的上下文，则不需要为React组件实现构造函数。**

在React组件挂载之前，会调用它的构造函数。
在为React.Component子类实现构造函数时，应该在任何其他语句之前调用super（props）。
否则，this.props将在构造函数中未定义，这可能导致错误。

通常，在React中，构造函数仅用于两个目的：

* 通过将对象 assign 给 this.state 来初始化 [本地状态](/docs/state-and-lifecycle.html)。
* 绑定[事件方法](/docs/handling-events.html)的上下文到实例。

在 `constructor()` 函数中 **不应该调用 `setState()` 方法**. 相反，如果你的组件需要使用本地状态，请直接在构造函数中将 **初始状态分配给 this.state**：

```js
constructor(props) {
  super(props);
  // Don't call this.setState() here!
  this.state = { counter: 0 };
  this.handleClick = this.handleClick.bind(this);
}
```

构造函数是你应该直接分配this.state的唯一位置。
在所有其他方法中，你需要使用this.setState（）。

避免在构造函数中引入任何副作用或订阅。
对于这些用例，请改用componentDidMount 来代替

>注意
>
>**避免将 props 复制到 state！这是一个常见的错误：**
>
>```js
>constructor(props) {
>  super(props);
>  // Don't do this!
>  this.state = { color: props.color };
>}
>```
>
>这里的问题是它既不必要的（你可以直接使用this.props.color），同时产生了错误（颜色道具的更新不会反映在状态中）.
>
>**此模式仅在你有意忽略prop的更新时使用** 在这种情况下，将prop重命名为initialColor或defaultColor是有意义的。
然后，在必要时你可以通过[更改它的属性](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key)来强制组件“重置”其内部状态
>
>阅读我们关于[避免派生状态的博客文章](/blog/2018/06/07/you-probably-dont-need-derived-state.html) ，去了解如果state 依赖 props 的话该如何去做。


* * *

### `componentDidMount()` {#componentdidmount}

```javascript
componentDidMount()
```

`componentDidMount()` is invoked immediately after a component is mounted (inserted into the tree). Initialization that requires DOM nodes should go here. If you need to load data from a remote endpoint, this is a good place to instantiate the network request.
`componentDidMount()` 会在组件挂载（插入虚拟dom树中）后被立即调用。需要DOM节点的初始化应该放在这里。如果需要从远程端点加载数据，这是实例化网络请求的好地方。

这个方法是设置任何订阅的好地方。如果你这样做，请不要忘记在componentWillUnmount（）里取消订阅。

你在`componentDidMount()`里**可以立即调用`setState()`**.它将触发额外的渲染，但它将在浏览器更新屏幕之前发生。
这保证了即使在这种情况下将调用`render()`两次，用户也不会看到中间状态。请谨慎使用该模式，因为它通常会导致性能问题。
在大多数情况下，你更应该在`constructor()`中分配初始状态。但是，在当你需要在渲染依赖于其大小或位置的内容之前测量DOM节点时，如实现 modals 和 tooltips 等情况下，你可以用这种模式进行处理。
* * *

### `componentDidUpdate()` {#componentdidupdate}

```javascript
componentDidUpdate(prevProps, prevState, snapshot)
```

`componentDidUpdate()` 在更新发生后会被立即调用。初始渲染不会调用此方法。

将此作为在更新组件时对DOM进行操作的机会。这也是在比较更新前后的props然后进行网络请求的好地方。（例如，如果道具未更改，则可能不需要网络请求）。

```js
componentDidUpdate(prevProps) {
  // Typical usage (don't forget to compare props):
  if (this.props.userID !== prevProps.userID) {
    this.fetchData(this.props.userID);
  }
}
```

你在`componentDidUpdate()`里**可以立即调用`setState()`** ，但请注意 **它必须在某种条件下** 如上面的例子，或者你会导致无限循环。它还会导致额外的重新渲染，虽然用户不可见，但会影响组件性能。如果你试图将上面传下来的props“镜像”到一些state里，请考虑直接使用props。 更多有关内容请阅读[为什么复制props到state会造成bugs](/blog/2018/06/07/you-probably-dont-need-derived-state.html).

如果组件实现了`getSnapshotBeforeUpdate()`生命周期（很少见），则它返回的值将作为第三个“snapshot”参数传递给`componentDidUpdate()`。否则此参数将是undefined。

> 注意
>
> 如果`shouldComponentUpdate()`返回false，则不会调用`componentDidUpdate()`

* * *

### `componentWillUnmount()` {#componentwillunmount}

```javascript
componentWillUnmount()
```

`componentWillUnmount()`会在卸载和销毁组件之前立即调用。在此方法中可以执行任何必要的清理，例如使计时器的清除，取消网络请求或清除在`componentDidMount()`中创建的任何订阅。

你在`componentWillUnmount()`中**不应该调用`setState()`**，因为该组件永远不会被重新渲染。
卸载组件实例后，将永远不会再次挂载它。

* * *

### 很少使用的生命周期方法 {#rarely-used-lifecycle-methods}

本节中的方法对应于不常见的用例。它们偶尔会很方便，但是你的大部分组件可能都不需要它们。
**如果单击顶部的“显示不太常见的生命周期”复选框，你可以在[生命周期图](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)上看到下面的大多数方法**。

### `shouldComponentUpdate()` {#shouldcomponentupdate}

```javascript
shouldComponentUpdate(nextProps, nextState)
```

使用`shouldComponentUpdate()` 让React知道组件的输出是否不受当前状态或道具更改的影响。
默认行为是在每次状态更改时重新渲染，在绝大多数情况下，你应该依赖于默认行为。

`shouldComponentUpdate()` 在接收新的props或state时，在渲染之前会被调用。默认返回值为true。
初始渲染或使用`forceUpdate()`时不会调用此方法。

此方法仅作为**[性能优化](/docs/optimizing-performance.html)**而存在。
不要依赖它来“防止”渲染，因为这会导致错误。
**考虑使用内置的`PureComponent`](/docs/react-api.html#reactpurecomponent)****，而不是手动编写`shouldComponentUpdate()` 
`PureComponent`会对props和state的进行浅层比较，并减少你跳过必要更新的机会。

如果你确信要手动编写它，可以将`this.props`与`nextProps`和`this.state`与`nextState`进行比较，并返回`false`以告知React可以跳过更新。请注意，返回`false`不会阻止子组件在状态更改时重新渲染。

我们不建议在`shouldComponentUpdate()`中进行深度相等检查或使用`JSON.stringify()`。这样效率非常低，会损害性能。

目前，如果`shouldComponentUpdate()`返回`false`，则不会调用 [`UNSAFE_componentWillUpdate()`](#unsafe_componentwillupdate), [`render()`](#render), 和 [`componentDidUpdate()`](#componentdidupdate)。
在将来，React可能会将`shouldComponentUpdate()` 视为提示而不是严格的指令，并且返回`false`仍可能导致重新渲染组件。

* * *

### `static getDerivedStateFromProps()` {#static-getderivedstatefromprops}

```js
static getDerivedStateFromProps(props, state)
```

`getDerivedStateFromProps`在调用render方法之前调用，包括初始安装和后续更新。它应返回一个对象来更新状态，或者返回null以不更新任何内容。

此方法适用于[罕见的用例](/blog/2018/06/07/you-probably-dont-need-derived-state.html#when-to-use-derived-state)，当state的值在任何时候都取决于props。
例如，实现一个`<Transition>`组件可能很方便，该组件比较其前一个和下一个子组件，以决定它们中的哪个进行动画制作。

导出状态会导致冗长的代码并使你的组件难以思考。
[确保你熟悉更简单的替代方案：](/blog/2018/06/07/you-probably-dont-need-derived-state.html)

* 如果你需要**执行副作用**（例如，数据提取或动画）以响应props中的更改，请改用[`componentDidUpdate`](#componentdidupdate)生命周期。

* 如果只想在**prop更改时重新计算某些数据**，[请用memoization helper代替](/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization)

* 如果你想**在prop更改时“重置”某些状态**，请考虑使用组件[完全受控](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) 或 [完全不受控](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key) 代替.

此方法无权访问组件实例。如果你愿意，可以通过提取组件props的纯函数和类定义之外的状态，在`getDerivedStateFromProps()`和其他类方法之间重用一些代码。

请注意，无论原因如何，都会在*每个*渲染上触发此方法。
这与`UNSAFE_componentWillReceiveProps`形成对比，后者仅在父项导致重新渲染而不是本地`setState`的结果时触发。

* * *

### `getSnapshotBeforeUpdate()` {#getsnapshotbeforeupdate}

```javascript
getSnapshotBeforeUpdate(prevProps, prevState)
```

`getSnapshotBeforeUpdate()`在最近的渲染的输出被映射到DOM之前调用。
它使你的组件可以在可能更改之前从DOM捕获一些信息（例如滚动位置）。
此生命周期返回的任何值都将作为参数传递给`componentDidUpdate()`。

此用例并不常见，但它可能出现在需要以特殊方式处理滚动位置的聊天线程等UI中。

应返回一个 snapshot 值（或`null`）

例如：

`embed:react-component-reference/get-snapshot-before-update.js`

在上面的示例中，重要的是读取`getSnapshotBeforeUpdate` 中的`scrollHeight`属性，因为“render”阶段生命周期（如render）和“commit”阶段生命周期（如`getSnapshotBeforeUpdate` 和 `componentDidUpdate`）之间可能存在延迟。

* * *

### Error boundaries {#error-boundaries}

[Error boundaries](/docs/error-boundaries.html)是React组件，它们在其子组件树中的任何位置捕获JavaScript错误，记录这些错误，并显示回退UI而不是崩溃的组件树。Error boundaries在渲染期间，生命周期方法以及它们下面的整个树的构造函数中捕获错误。

如果类组件定义了生命周期方法`static getDerivedStateFromError()`或`componentDidCatch()`中的任何一个（或两者），则它成为Error boundaries。从这些生命周期更新状态可让你在下面的树中捕获未处理的JavaScript错误并显示回退UI。

仅使用Error boundaries来从意外异常中恢复; **不要试图将它们用于控制流程。**

有关更多详细信息，请参阅[React 16中的错误处理](/blog/2017/07/26/error-handling-in-react-16.html)。

> 注意
> 
> Error boundaries 仅捕获树中它们**下面**的组件中的错误。它本身无法捕获错误

### `static getDerivedStateFromError()` {#static-getderivedstatefromerror}
```javascript
static getDerivedStateFromError(error)
```

此生命周期在后代组件抛出错误后被调用。
它接收作为参数抛出的错误，并应返回值以更新状态。

```js{7-10,13-16}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}
```

> 注意
>
> 在“渲染”阶段调用`getDerivedStateFromError()`，因此不允许出现副作用。
对于这些情况，请改用`componentDidCatch()` 。

* * *

### `componentDidCatch()` {#componentdidcatch}

```javascript
componentDidCatch(error, info)
```

此生命周期在后代组件抛出错误后被调用。
它接收两个参数：

1. `error` - 抛出的错误。
2. `info` - 一个带有`componentStack`键的对象其中包含[有关哪个组件引发错误的信息](/docs/error-boundaries.html#component-stack-traces)。


`componentDidCatch()` 在“提交”阶段被调用，因此允许副作用。它应该用于记录错误之类的事情

```js{12-19}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Example "componentStack":
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    logComponentStackToMyService(info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}
```

> 注意
> 
> 如果发生错误，你可以通过调用`setState`使用`componentDidCatch()`渲染回退UI，但在将来的版本中将不推荐使用。
> 使用静态`getDerivedStateFromError()`来处理后备渲染。

* * *

### 遗留生命周期方法 {#legacy-lifecycle-methods}

以下生命周期方法标记为“遗留”。
它们仍然有效，但我们不建议在新代码中使用它们。
你可以在[此博客文章](/blog/2018/03/27/update-on-async-rendering.html)中了解有关迁移旧版生命周期方法的更多信息

### `UNSAFE_componentWillMount()` {#unsafe_componentwillmount}

```javascript
UNSAFE_componentWillMount()
```

> 注意
>
> 此生命周期之前名为`componentWillMount`。
该名称将继续有效，直到版17版本。使用[`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles)自动更新组件。

`UNSAFE_componentWillMount()`在安装发生之前被调用。
它在`render()`之前调用，因此在此方法中同步调用`setState()`不会触发额外的渲染。
通常，我们建议使用`constructor()`来初始化state。

避免在此方法中引入任何副作用或订阅。对于这些用例，请改用`componentDidMount()`。

这是服务端渲染唯一会调用的一个生命周期函数

* * *

### `UNSAFE_componentWillReceiveProps()` {#unsafe_componentwillreceiveprops}

```javascript
UNSAFE_componentWillReceiveProps(nextProps)
```

> 注意
>
> 此生命周期之前名为`componentWillReceiveProps`。
该名称将继续有效，直到版17版本。使用[`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles)自动更新组件

> 注意:
>
> 使用此生命周期方法通常会导致错误和不一致
>
> * 如果你需要**执行副作用**（例如，数据提取或动画）以响应props中的更改，请改用[`componentDidUpdate`](#componentdidupdate)生命周期。
> * 如果你仅使用`componentWillReceiveProps`**在prop更改时重新计算某些数据**，[使用 memoization helper 代替](/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization)。
> * 如果你使用`componentWillReceiveProps`**是为了在prop更改时“重置”某些状态**，请考虑使用组件[完全受控](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component)或[完全不受控](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key)
>
> 对于其他用例， [请遵循此博客文章中有关派生状态的建议](/blog/2018/06/07/you-probably-dont-need-derived-state.html)。

`UNSAFE_componentWillReceiveProps()`在挂载的组件接收新的props之前被调用。
如果你需要更新状态以响应prop更改（例如，重置它），你可以比较`this.props`和`nextProps`并使用此方法中的`this.setState()`执行状态转换。

请注意，如果父组件导致组件重新渲染，即使props没有更改，也会调用此方法。
如果你只想处理更改，请务必比较当前值和下一个值。

在[挂载](#mounting)过程中，React不会使用初始props调用`UNSAFE_componentWillReceiveProps()`。
如果某些组件的props可能会更新，它只会调用此方法。
调用`this.setState()`通常不会触发`UNSAFE_componentWillReceiveProps()`。

* * *

### `UNSAFE_componentWillUpdate()` {#unsafe_componentwillupdate}

```javascript
UNSAFE_componentWillUpdate(nextProps, nextState)
```

> 注意
>
> 此生命周期之前名为`componentWillUpdate`。
该名称将继续有效，直到版17版本。使用[`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles)自动更新组件

`UNSAFE_componentWillUpdate()`在收到新的props或state时，在渲染之前调用被调用。使用此作为在更新发生之前执行准备的机会。初始渲染不会调用此方法。

注意，你不能在这里调用`this.setState()`;
在`UNSAFE_componentWillUpdate()`返回之前，你也不应该执行任何其他操作（例如，调度Redux操作）以触发对React组件的更新。

通常，此方法可以由`componentDidUpdate()`替换。
如果你在此方法中读取DOM（例如，为了保存滚动位置），则可以将该逻辑移动到`getSnapshotBeforeUpdate()`

> 注意
>
> `UNSAFE_componentWillUpdate()` 如果`shouldComponentUpdate()`返回false，则不会调用。

* * *

## 其他API {#other-apis-1}

与上面的生命周期方法（React为你调用）不同，下面的方法是你可以从组件调用的方法。

它们只有两个: `setState()` 和 `forceUpdate()`.

### `setState()` {#setstate}

```javascript
setState(updater[, callback])
```

`setState()` 将对组件状态的更改排入队列，并告诉React需要使用更新后的状态重新渲染此组件及其子组件。
这是用于更新用户界面以响应事件处理程序和服务器响应的主要方法

将`setState()`视为*请求*而不是更新组件的立即命令。
为了获得更好的感知性能，React可能会延迟它，然后在一次通过中更新几个组件。
React不保证立即应用状态更改。

`setState()`并不总是立即更新组件。
它可以批量推迟更新或推迟更新。
这使得在调用`setState()`之后立即读取`this.state`是一个潜在的陷阱。
相反，使用`componentDidUpdate`或`setState`回调（`setState(updater, callback)`），其中任何一个都保证在应用更新后触发。如果需要根据以前的状态设置状态，请阅读下面的`updater`参数。

除非`shouldComponentUpdate()`返回`false`，否则`setState()`将始终导致重新渲染。
如果正在使用可变对象且无法在`shouldComponentUpdate()`中实现条件渲染逻辑，则仅当新状态与先前状态不同时调用`setState()`将避免不必要的重新渲染。

第一个参数是一个带有形式参数的`updater`函数：

```javascript
(state, props) => stateChange
```

`state`是对应用更改时组件状态的引用。它不应该直接变异。相反，应该通过基于`state`和`props`的输入构建新对象来表示更改。
例如，假设我们想通过`props.step`增加状态值：

```javascript
this.setState((state, props) => {
  return {counter: state.counter + props.step};
});
```

更新程序功能接收的`state`和`props`都保证是最新的。
updater的输出与`state`浅合并

`setState()` 的第二个参数是一个可选的回调函数，它将在`setState`完成并重新渲染组件后执行。
通常我们建议使用`componentDidUpdate()`代替这种逻辑

你可以选择将对象作为`setState()`的第一个参数而不是函数传递：

```javascript
setState(stateChange[, callback])
```

这会将`stateChange`浅层合并到新的state，例如，调整购物车项目数量：

```javascript
this.setState({quantity: 2})
```

这种形式的`setState()`也是异步的，并且在同一周期内的多个调用可以一起批处理。
例如，如果你尝试在同一周期中多次增加项目数量，则会产生相当于

```javaScript
Object.assign(
  previousState,
  {quantity: state.quantity + 1},
  {quantity: state.quantity + 1},
  ...
)
```

后续调用将覆盖同一周期中先前调用的值，因此数量将仅增加一次。
如果下一个状态取决于当前状态，我们建议使用更新程序功能表单，而不是：

```js
this.setState((state) => {
  return {quantity: state.quantity + 1};
});
```

有关详细信息，请参阅:

* [状态和生命周期指南](/docs/state-and-lifecycle.html)
* [深入：何时以及为什么setState（）调用批处理？](https://stackoverflow.com/a/48610973/458193)
* [深入：为什么不立即更新this.state？](https://github.com/facebook/react/issues/11527#issuecomment-360199710)

* * *

### `forceUpdate()` {#forceupdate}

```javascript
component.forceUpdate(callback)
```

默认情况下，当组件的状态或道具发生更改时，组件将重新渲染。
如果`render()`方法依赖于其他一些数据，则可以通过调用`forceUpdate()`告诉React该组件需要重新渲染。

调用`forceUpdate()`将导致在组件上调用`render()`，跳过`shouldComponentUpdate()`。
这将触发子组件的正常生命周期方法，包括每个子组件的`shouldComponentUpdate()`方法。
如果标记更改，React仍将仅更新DOM。

通常你应该尽量避免使用`forceUpdate()`，只能在`render()`中读取`this.props`和`this.state`。

* * *

## 类属性 {#class-properties-1}

### `defaultProps` {#defaultprops}

`defaultProps`可以定义为组件类本身的属性，以设置类的默认props。
这用于未定义的props，但不用于空props。例如

```js
class CustomButton extends React.Component {
  // ...
}

CustomButton.defaultProps = {
  color: 'blue'
};
```

如果未提供`props.color`，则默认情况下将其设置为`'blue'`：

```js
  render() {
    return <CustomButton /> ; // props.color will be set to blue
  }
```

如果`props.color`设置为`null`，则它将保持为`null`：

```js
  render() {
    return <CustomButton color={null} /> ; // props.color will remain null
  }
```

* * *

### `displayName` {#displayname}

displayName字符串用于调试消息。
通常，你不需要显式设置它，因为它是从定义组件的函数或类的名称推断出来的。
如果要为调试目的显示不同的名称或创建更高阶的组件，可能需要显式设置它，有关详细信息，请参阅[包装显示名称以进行简单调试](/docs/higher-order-components.html#convention-wrap-the-display-name-for-easy-debugging)。

* * *

## 实例属性 {#instance-properties-1}

### `props` {#props}

`this.props`包含由此组件的调用者定义的props。
有关道具的介绍，请参阅[组件和props](/docs/components-and-props.html)。

特别是，`this.props.children`是一个特殊的prop，通常由JSX表达式中的子标签而不是标签本身定义。

### `state` {#state}

状态包含特定于此组件的数据，该数据可能随时间而变化。
状态是用户定义的，它应该是一个普通的JavaScript对象。

如果某些值未用于渲染或数据流（例如，计时器ID），则不必将其置于该状态。
这些值可以定义为组件实例上的字段。

有关state的更多信息，请参阅[状态和生命周期](/docs/state-and-lifecycle.html)。

永远不要直接改变`this.state`，因为之后调用`setState()`可能会替换你所做的突变。
把`this.state`看作是不可变的
