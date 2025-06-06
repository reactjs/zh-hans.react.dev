---
title: Component
---

<Pitfall>

我们建议使用函数式组件，而不是类式组件。[了解如何迁移](#alternatives)。

</Pitfall>

<Intro>

`Component` 是一个 [JavaScript 类](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes)，其被定义为 React 组件的基类，类式组件仍然被 React 支持，但我们不建议在新代码中使用它们。

```js
class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `Component` {/*component*/}

如果想要使用类式组件，需要继承内置的 `Component` 类并定义 [`render` 方法](#render)：

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

只有 `render` 方法是必要的，其他方法是可选的。

[参见下方更多示例](#usage)。

---

### `context` {/*context*/}

类式组件可以通过使用 `this.context` 访问 [context](/learn/passing-data-deeply-with-context)。但是只有使用 [`static contextType`](#static-contexttype) 指定想要接受 **哪一个** context 时才会有效。

类式组件一次只能读取一个 context。

```js {2,5}
class Button extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {this.props.children}
      </button>
    );
  }
}

```

<Note>

在类式组件中读取 `this.context` 等同于在函数式组件中使用 [`useContext`](/reference/react/useContext)。

[了解如何迁移](#migrating-a-component-with-context-from-a-class-to-a-function)。

</Note>

---

### `props` {/*props*/}

使用 `this.props` 能够访问一个类组件的 props。

```js {3}
class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}

<Greeting name="Taylor" />
```

<Note>

在类式组件中读取 `this.props` 等同于在函数式组件中使用 [声明式 props](/learn/passing-props-to-a-component#step-2-read-props-inside-the-child-component)。

[了解如何迁移](#migrating-a-simple-component-from-a-class-to-a-function)。

</Note>

---

### `state` {/*state*/}

使用 `this.state` 来访问一个类式组件的 state。`state` 字段必须是一个对象。请不要直接改变 state 的值。如果你希望改变 state，那么请使用新的 state 来调用 `setState` 函数。

```js {2-4,7-9,18}
class Counter extends Component {
  state = {
    age: 42,
  };

  handleAgeChange = () => {
    this.setState({
      age: this.state.age + 1 
    });
  };

  render() {
    return (
      <>
        <button onClick={this.handleAgeChange}>
        增加年龄
        </button>
        <p>你{this.state.age}岁了。</p>
      </>
    );
  }
}
```

<Note>

在类式组件中定义 `state` 等同于在函数式组件中调用 [`useState`](/reference/react/useState)。

[了解如何迁移](#migrating-a-component-with-state-from-a-class-to-a-function)。

</Note>

---

### `constructor(props)` {/*constructor*/}

[constructor](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes/constructor) 会在你的类式组件 **挂载**（添加到屏幕上）之前运行。一般来说，在 React 中 constructor 仅用于两个目的。它可以让你来声明 state 以及将你的类方法 [绑定](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_objects/Function/bind) 到你的类实例上。

```js {2-6}
class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = { counter: 0 };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // ...
  }
```

如果你使用较新的 JavaScript 语法的话，那么很少需要使用到 constructors。相反，你可以使用现代浏览器和像 [Babel](https://babeljs.io/) 这样的工具都支持的 [公有类字段语法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes/Public_class_fields) 来重写上面的代码：

```js {2,4}
class Counter extends Component {
  state = { counter: 0 };

  handleClick = () => {
    // ...
  }
```

构造函数不应包含任何存在副作用或者事件监听相关的代码。

#### 参数 {/*constructor-parameters*/}

* `props`：组件初始的 props。

#### 返回值 {/*constructor-returns*/}

`constructor` 不应该返回任何值。

#### 注意 {/*constructor-caveats*/}

* 不要在 constructor 中运行任何副作用或者监听相关的代码。使用 [`componentDidMount`](#componentdidmount) 来应对这种需求。

* 在 constructor 中，你需要在其他的声明之前调用 `super(props)`。如果你不这样做，`this.props` 在 constructor 运行时就会为 `undefined`，这可能会造成困惑并且导致错误。

* Constructor 中是唯一一个你能直接赋值 [`this.state`](#state) 的地方。在其余所有方法中，你需要使用 [`this.setState()`](#setstate) 来代替。不要在 constructor 中使用 `setState`。

* 当你使用 [服务端渲染](/reference/react-dom/server) 时，constructor 也将在服务端运行，然后紧接着会运行 [`render`](#render) 方法。然而，像 `componentDidMount` 或者 `componentWillUnmount` 这样的生命周期方法将不会在服务端运行。

* 当 [严格模式](/reference/react/StrictMode) 打开时，React 将会在开发过程中调用两次 `constructor` 然后丢弃其中的一个实例。这有助于你注意到需要从 `constructor` 中移出的意外的副作用。

<Note>

在函数式组件中没有与 `constructor` 作用完全相同的函数。要在函数式组件中声明 state 请调用 [`useState`](/reference/react/useState) 来避免重新计算初始的 state，[传递一个函数给 `useState`](/reference/react/useState#avoiding-recreating-the-initial-state)。

</Note>

---

### `componentDidCatch(error, info)` {/*componentdidcatch*/}

如果你定义了 `componentDidCatch`，那么 React 将在某些子组件（包括后代组件）在渲染过程中抛出错误时调用它。这使得你可以在生产中将该错误记录到错误报告服务中。

一般来说，它与 [`static getDerivedStateFromError`](#static-getderivedstatefromerror) 一起使用，这样做允许你更新 state 来响应错误并向用户显示错误消息。具有这些方法的组件称为 **错误边界**。

[查看示例](#catching-rendering-errors-with-an-error-boundary)。

#### 参数 {/*componentdidcatch-parameters*/}

* `error`：被抛出的错误。实际上，它通常会是一个 [`Error`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Error) 的实例，但是这并不能保证，因为 JavaScript 允许 [`抛出`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/throw) 所有值，包括字符串甚至是 `null`。

* `info`：一个包含有关错误的附加信息的对象。它的 `componentStack` 字段包含一个关于有关组件的堆栈跟踪，以及其所有父组件的名称和源位置。在生产中，组件名称将被简化。如果你设置了生产错误报告服务，则可以使用源映射来解码组件堆栈，就像处理常规 JavaScript 错误堆栈一样。

#### 返回值 {/*componentdidcatch-returns*/}

`componentDidCatch` 不应该返回任何值。

#### 注意 {/*componentdidcatch-caveats*/}

* 在以前经常会在 `componentDidCatch` 中使用 `setState` 来更新 UI 以及显示后备错误消息。我们反对这种方法，更赞同定义 [`static getDerivedStateFromError`](#static-getderivedstatefromerror)。

* `componentDidCatch` 在 React 生产环境和开发环境中处理错误的方式有所不同，在开发环境下，错误将冒泡至 `window`，这意味着任何 `window.onerror` 或者 `window.addEventListener('error', callback)` 事件都将中断被 `componentDidCatch` 所捕获到的错误。而在生产环境下则相反，错误并不会冒泡，这意味着任何父级的错误处理器都只会接收到被 `componentDidCatch` 捕获的非显式错误。

<Note>

在函数式组件中没有与 `componentDidCatch` 作用完全相同的函数。如果你想要避免创建类式组件，那么可以单独写一个像上面一样的 `错误边界` 并在整个应用中使用它。又或者，你可以使用 [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary) 包，它可以完成同样的工作。

</Note>

---

### `componentDidMount()` {/*componentdidmount*/}

如果你定义了 `componentDidMount` 方法，React 将会在组件被添加到屏幕上 **（挂载）** 后调用它。这里是设置数据获取、订阅监听事件或操作 DOM 节点的常见位置。

如果你要实现 `componentDidMount`，你通常需要设置一些其他的生命周期函数来避免出错。例如，如果 `componentDidMount` 读取一些 state 或者 props，你还必须要设置 [`componentDidUpdate`](#componentdidupdate) 来处理它们的更新，以及设置 [`componentWillUnmount`](#componentwillunmount) 来清理 `componentDidMount` 的效果。

```js {6-8}
class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  // ...
}
```

[查看更多示例](#adding-lifecycle-methods-to-a-class-component)。

#### 参数 {/*componentdidmount-parameters*/}

`componentDidMount` 不需要任何参数。

#### 返回值 {/*componentdidmount-returns*/}

`componentDidMount` 不应该返回任何值。

#### 注意 {/*componentdidmount-caveats*/}

- 当 [严格模式](/reference/react/StrictMode) 开启时，在开发环境中 React 会调用 `componentDidMount`，然后会立刻调用 [`componentWillUnmount`](#componentwillunmount)，接着再次调用 `componentDidMount`。这将帮助你注意到你是否忘记设置 `componentWillUnmount` 或者它的逻辑是否完全对应到 `componentDidMount` 的效果。

- 虽然你可以在 `componentDidMount` 中立即调用 [`setState`](#setstate)，不过最好避免这样做。因为这将触发一次浏览器更新屏幕之前发生的额外的渲染。在这种情况下即使 [`render`](#render) 被调用了两次，用户也无法看到中间的状态。请谨慎使用这种模式因为它可能会造成性能问题。在大多数情况下，你应该能在 [`constructor`](#constructor) 中设置初始的 state。但是对于 modal 和 tooltip 等当你的渲染依赖于 DOM 节点的大小或位置情况下，这种方法可能是必要的。

<Note>

对于大多数的使用场景来说，在类式组件中一起定义 `componentDidMount`，`componentDidUpdate` 和 `componentWillUnmount` 等同于在函数式组件中调用 [`useEffect`](/reference/react/useEffect)。在一些少数的情况，例如在浏览器绘制前执行代码很重要时，更像是等同于 [`useLayoutEffect`](/reference/react/useLayoutEffect)。

[了解如何迁移](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)。

</Note>

---

### `componentDidUpdate(prevProps, prevState, snapshot?)` {/*componentdidupdate*/}

如果你定义了 `componentDidUpdate` 方法，那么 React 会在你的组件更新了 props 或 state 重新渲染后立即调用它。这个方法不会在首次渲染时调用。

你可以在一次更新后使用它来操作 DOM。处理网络请求时也可能会使用这个方法，只要你将当前的 props 与以前的 props 进行比较（因为，如果 props 没有更改，则可能不需要网络请求）。这个方法一般会和 [`componentDidMount`](#componentdidmount) 以及 [`componentWillUnmount`](#componentwillunmount) 一起使用：

```js {10-18}
class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  // ...
}
```

[查看更多示例](#adding-lifecycle-methods-to-a-class-component)。


#### 参数 {/*componentdidupdate-parameters*/}

* `prevProps`：更新之前的 props。`prevProps` 将会与 [`this.props`](#props) 进行比较来确定发生了什么改变。

* `prevState`：更新之前的 state。`prevState` 将会与 [`this.state`](#state) 进行比较来确定发生了什么改变。

* `snapshot`：如果你实现了 [`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate) 方法，那么 `snapshot` 将包含从该方法返回的值。否则它将是 `undefined`。

#### 返回值 {/*componentdidupdate-returns*/}

`componentDidUpdate` 不应该返回任何值。

#### 注意 {/*componentdidupdate-caveats*/}

- 如果你定义了 [`shouldComponentUpdate`](#shouldcomponentupdate) 并且返回值是 `false` 的话，那么 `componentDidUpdate` 将不会被调用。

- `componentDidUpdate` 内部的逻辑通常应该包含在比较 `this.props` 与 `prevProps` 以及 `this.state` 与 `prevState` 的条件之中。否则就会存在创建无限循环的风险。

- 虽然你可以在 `componentDidUpdate` 中直接调用 [`setState`](#setstate)，但最好尽可能避免这样做。因为它将触发一次发生在浏览器更新屏幕内容之前的额外渲染，在这种情况下，即使 [`render`](#render) 会被调用两次，用户也看不到中间状态。这种模式通常会导致性能问题，但是对于 modal 和 tooltip 等当你的渲染依赖于 DOM 节点的大小或位置情况下，这种方法可能是必要的。

<Note>

对于大多数用例来说，在类式组件中一起定义 `componentDidMount`，`componentDidUpdate` 和 `componentWillUnmount` 等同于在函数式组件中定义 [`useEffect`](/reference/react/useEffect)。在一些少数的情况，例如在浏览器绘制前执行代码很重要时，更像是等同于 [`useLayoutEffect`](/reference/react/useLayoutEffect)。

[了解如何迁移](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)。

</Note>
---

### `componentWillMount()` {/*componentwillmount*/}

<Deprecated>

此 API 已从 `componentWillMount` 重命名为 [`UNSAFE_componentWillMount`](#unsafe_componentwillmount)。旧名称已被弃用，在 React 未来的主版本中，只有新名称才有效。

运行 [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) 来自动更新你的组件。

</Deprecated>

---

### `componentWillReceiveProps(nextProps)` {/*componentwillreceiveprops*/}

<Deprecated>

此 API 已从 `componentWillReceiveProps` 重命名为 [`UNSAFE_componentWillReceiveProps`](#unsafe_componentwillreceiveprops)。旧名称已被弃用，在 React 未来的主版本中，只有新名称才有效。

运行 [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) 来自动更新你的组件。

</Deprecated>

---

### `componentWillUpdate(nextProps, nextState)` {/*componentwillupdate*/}

<Deprecated>

此 API 已从 `componentWillUpdate` 重命名为 [`UNSAFE_componentWillUpdate`](#unsafe_componentwillupdate)。旧名称已被弃用，在 React 未来的主版本中，只有新名称才有效。

运行 [`rename-unsafe-lifecycles` 重构器](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) 来自动更新你的组件。

</Deprecated>

---

### `componentWillUnmount()` {/*componentwillunmount*/}

如果你定义了 `componentWillUnmount` 方法，React 会在你的组件被移除屏幕（**卸载**）之前调用它。此方法常常用于取消数据获取或移除监听事件。

`componentWillUnmount` 内部的逻辑应该完全“对应”到 [`componentDidMount`](#componentdidmount) 内部的逻辑，例如，如果你在 `componentDidMount` 中设置了一个监听事件，那么 `componentWillUnmount` 中就应该清除掉这个监听事件。如果你的 `componentWillUnmount` 的清理逻辑中读取了一些 props 或者 state，那么你通常还需要实现一个 [`componentDidUpdate`](#componentdidupdate) 来清理使用了旧 props 和 state 的资源（例如监听事件）。

```js {20-22}
class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  // ...
}
```

[查看更多示例](#adding-lifecycle-methods-to-a-class-component)。

#### 参数 {/*componentwillunmount-parameters*/}

`componentWillUnmount` 不需要任何参数。

#### 返回值 {/*componentwillunmount-returns*/}

`componentWillUnmount` 不应该返回任何值。

#### 注意 {/*componentwillunmount-caveats*/}

- 当 [严格模式](/reference/react/StrictMode) 开启时，在开发中 React 会在调用 [`componentDidMount`](#componentdidmount) 后立即调用 `componentWillUnmount`，接着再次调用 `componentDidMount`。这可以帮助你注意到你是否忘记实现 `componentWillUnmount`，或者它的逻辑是否没有完全对应到 `componentDidMount` 的效果。

<Note>

对于许多用例来说，在类式组件中一起定义 `componentDidMount`、`componentDidUpdate` 和 `componentWillUnmount` 等同于在函数式组件中使用 [`useEffect`](/reference/react/useEffect)。在一些少数的情况，例如在浏览器绘制前执行代码很重要时，更像是等同于 [`useLayoutEffect`](/reference/react/useLayoutEffect)。

[了解如何迁移](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)。

</Note>

---

### `forceUpdate(callback?)` {/*forceupdate*/}

强制组件重新渲染。

通常来说，这是没必要的。如果组件的 [`render`](#render) 方法仅读取了 [`this.props`](#props)、[`this.state`](#state) 或 [`this.context`]( #context) 时，当你在组件或其任一父组件内调用 [`setState`](#setstate) 时，它就将自动重新渲染。但是如果组件的 `render` 方法是直接读取外部数据源时，则必须告诉 React 在该数据源更改时更新用户界面。这就是 `forceUpdate` 的作用。

尽量避免使用 `forceUpdate` 并且在 `render` 中尽量只读取 `this.props` 和 `this.state`。

#### 参数 {/*forceupdate-parameters*/}

* **可选的** 如果指定了 `callback`，React 将在提交完更新后调用你提供的 `callback`。

#### 返回值 {/*forceupdate-returns*/}

`forceUpdate` 不返回任何值。

#### 注意 {/*forceupdate-caveats*/}

- 如果你调用了 `forceUpdate`，React 将重新渲染而且不会调用 [`shouldComponentUpdate`](#shouldComponentupdate)。

<Note>

读取外部数据源并强制类式组件使用 `forceUpdate` 来重新渲染更改已被函数式组件中的 [`useSyncExternalStore`](/reference/react/useSyncExternalStore) 所取代。

</Note>

---

### `getSnapshotBeforeUpdate(prevProps, prevState)` {/*getsnapshotbeforeupdate*/}

如果你实现了 `getSnapshotBeforeUpdate`，React 会在 React 更新 DOM 之前时直接调用它。它使你的组件能够在 DOM 发生更改之前捕获一些信息（例如滚动的位置）。此生命周期方法返回的任何值都将作为参数传递给 [`componentDidUpdate`](#componentdidupdate)。

例如，你可以在像是需要在更新期间保留其滚动位置的聊天消息的 UI 中来使用它。

```js {7-15,17}
class ScrollingList extends React.Component {
  constructor(props) {
    super(props);
    this.listRef = React.createRef();
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // 我们是否要向列表中添加新内容？
    // 捕获滚动的​​位置，以便我们稍后可以调整滚动。
    if (prevProps.list.length < this.props.list.length) {
      const list = this.listRef.current;
      return list.scrollHeight - list.scrollTop;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // 如果我们有快照值，那么说明我们刚刚添加了新内容。
    // 调整滚动，使得这些新内容不会将旧内容推出视野。
    //（这里的 snapshot 是 getSnapshotBeforeUpdate 返回的值）
    if (snapshot !== null) {
      const list = this.listRef.current;
      list.scrollTop = list.scrollHeight - snapshot;
    }
  }

  render() {
    return (
      <div ref={this.listRef}>{/* ...contents... */}</div>
    );
  }
}
```

在上面的示例中，能直接在 `getSnapshotBeforeUpdate` 中读取到 `scrollHeight` 属性非常重要。在 [`render`](#render)、[`UNSAFE_componentWillReceiveProps`](#unsafe_componentwillreceiveprops) 或 [`UNSAFE_componentWillUpdate`](#unsafe_componentwillupdate) 中读取它是不安全的，因为这些方法的调用与 React 更新 DOM 之间存在潜在的时间间隔。

#### 参数 {/*getsnapshotbeforeupdate-parameters*/}

* `prevProps`：更新之前的 Props。`prevProps` 将会与 [`this.props`](#props) 进行比较来确定发生了什么改变。

* `prevState`：更新之前的 State。`prevState` 将会与 [`this.state`](#state) 进行比较来确定发生了什么改变。

#### 返回值 {/*getsnapshotbeforeupdate-returns*/}

你应该返回你想要的任何类型的快照值，或者是 `null`。你返回的值将作为第三个参数传递给 [`componentDidUpdate`](#componentdidupdate)。

#### 注意 {/*getsnapshotbeforeupdate-caveats*/}

- 如果你定义了 [`shouldComponentUpdate`](#shouldcomponentUpdate) 并返回了 `false`，则 `getSnapshotBeforeUpdate` 不会被调用。

<Note>

目前，函数式组件中还没有与 `getSnapshotBeforeUpdate` 等同的方法。这种使用场景非常罕见，但如果你有这种需求，那么你就必须编写一个类式组件。

</Note>

---

### `render()` {/*render*/}

`render` 方法是类式组件中唯一必需的方法。

`render` 方法应该指定你想要在屏幕上显示的内容，例如：

```js {4-6}
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

React 可能随时调用 `render` 方法，因此你不应该假设它将在某一特定时间运行。一般来说，`render` 方法应该返回一段 [JSX](/learn/writing-markup-with-jsx)，但它也支持一些 [其他的返回类型](#render-returns)（如字符串）。为了计算返回的 JSX，`render` 方法可以读取 [`this.props`](#props)、[`this.state`](#state) 和 [`this.context`](#context)。

你应该将 `render` 方法编写为纯函数，这意味着如果它使用的 props、state 和 context 相同的话，它应该返回相同的结果。它也不应该包含副作用（例如订阅监听事件）或与浏览器 API 交互。副作用应该发生在事件处理程序或 [`componentDidMount`](#componentdidmount) 等方法中。

#### 参数 {/*render-parameters*/}

`render` 不需要任何参数。

#### 返回值 {/*render-returns*/}

`render` 可以返回任何有效的 React 节点。其中包括 React 元素，例如 `<div />`、字符串、数字、[portals](/reference/react-dom/createPortal)、空节点（`null`、`undefined`、`true` 和 `false`）以及 React 节点数组。

#### 注意 {/*render-caveats*/}

- `render` 应该写成关于 props、state 和 context 的纯函数，它不应该包含副作用。

- 如果定义了 [`shouldComponentUpdate`](#shouldcomponentupdate) 并返回 `false` 的话，则 `render` 不会被调用。

- 当 [严格模式](/reference/react/StrictMode) 开启时，React 将在开发过程中调用两次 `render`，然后丢弃其中一个结果。这可以帮助你注意到需要从 `render` 方法中移出的意外的副作用。

- `render` 的调用和后续的 `componentDidMount` 或 `componentDidUpdate` 的调用之间没有一一对应的关系。React 可能会在有益的情况下丢弃一些 `render` 的调用结果。
---


### `setState(nextState, callback?)` {/*setstate*/}

调用 `setState` 来更新 React 组件的 state。

```js {8-10}
class Form extends Component {
  state = {
    name: 'Taylor',
  };

  handleNameChange = (e) => {
    const newName = e.target.value;
    this.setState({
      name: newName
    });
  }

  render() {
    return (
      <>
        <input value={this.state.name} onChange={this.handleNameChange} />
        <p>Hello, {this.state.name}.</p>
      </>
    );
  }
}
```

`setState` 将组件的 state 的更改加入队列。它告诉 React 该组件及其子组件需要使用新的 state 来重新渲染。这是更新用户界面来响应交互的主要方式。

<Pitfall>

调用 `setState` 时 **不会** 更改已执行代码中当前的 state：

```js {6}
function handleClick() {
  console.log(this.state.name); // "Taylor"
  this.setState({
    name: 'Robin'
  });
  console.log(this.state.name); // 依然是 "Taylor"!
}
```

它只影响从 **下一个** 渲染开始返回的 `this.state`。

</Pitfall>

你还可以将函数传递给 `setState`。它允许你根据先前的 state 来更新 state：

```js {2-6}
  handleIncreaseAge = () => {
    this.setState(prevState => {
      return {
        age: prevState.age + 1
      };
    });
  }
```

你不必这样做，但如果你想在同一事件期间多次更新状态，这样就会很方便。

#### 参数 {/*setstate-parameters*/}

* `nextState`：一个对象或者函数。
  * 如果你传递一个对象作为 `nextState`，它将浅层合并到 `this.state` 中。
  * 如果你传递一个函数作为 `nextState`，它将被视为 **更新函数**。它必须是个纯函数，应该以已加载的 state 和 props 作为参数，并且应该返回要浅层合并到 `this.state` 中的对象。React 会将你的更新函数放入队列中并重新渲染你的组件。在下一次渲染期间，React 将通过应用队列中的所有的更新函数来计算下一个 state。

* **可选的** `callback`：如果你指定该函数，React 将在提交更新后调用你提供的 `callback`。

#### 返回值 {/*setstate-returns*/}

`setState` 不会返回任何值。

#### 注意 {/*setstate-caveats*/}

- 将 `setState` 视为 **请求** 而会不是立即更新组件的命令。当多个组件更新它们的 state 来响应事件时，React 将批量更新它们，并在这次事件结束时将它们一并重新渲染。在极少数情况下，你需要强制同步应用特定的 state 更新，这时你可以将其包装在 [`flushSync`](/reference/react-dom/flushSync) 中，但这可能会损害性能。

- `setState` 不会立即更新 `this.state`。这让在调用 `setState` 之后立即读取 `setState` 成为了一个潜在的陷阱。相反请使用 [`componentDidUpdate`](#componentdidupdate) 或设置 setState的 `callback` 参数，其中任何一个都保证读取 state 将在 state 的更新后触发。如果需要根据前一个 state 来设置 state，那么可以传递给 `nextState` 一个函数，如上所述。

<Note>

在类式组件中调用 `setState` 等同于在函数式组件中调用 [`set` 函数](/reference/react/useState#setstate)。

[了解如何迁移](#migrating-a-component-with-state-from-a-class-to-a-function)。

</Note>

---

### `shouldComponentUpdate(nextProps, nextState, nextContext)` {/*shouldcomponentupdate*/}

如果你定义了 `shouldComponentUpdate`，React 将调用它来确定是否可以跳过重新渲染。

如果你确定你想手动编写它，你可以将 `this.props` 与 `nextProps` 以及 `this.state` 与 `nextState` 进行比较，并返回 `false` 来告诉 React 可以跳过更新。

```js {6-18}
class Rectangle extends Component {
  state = {
    isHovered: false
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.position.x === this.props.position.x &&
      nextProps.position.y === this.props.position.y &&
      nextProps.size.width === this.props.size.width &&
      nextProps.size.height === this.props.size.height &&
      nextState.isHovered === this.state.isHovered
    ) {
      // 没有任何改变，因此不需要重新渲染
      return false;
    }
    return true;
  }

  // ...
}

```

当收到新的 props 或 state 时，React 会在渲染之前调用 `shouldComponentUpdate`，默认值为 `true`。初始渲染或使用 [`forceUpdate`](#forceupdate) 时将不会调用此方法。

#### 参数 {/*shouldcomponentupdate-parameters*/}

- `nextProps`：组件即将用来渲染的下一个 props。将 `nextProps` 与 [`this.props`](#props) 进行比较以确定发生了什么变化。
- `nextState`：组件即将渲染的下一个 state。将 `nextState` 与 [`this.state`](#props) 进行比较以确定发生了什么变化。
- `nextContext`：组件将要渲染的下一个 context。将 `nextContext` 与 [`this.context`](#context) 进行比较以确定发生了什么变化。仅当你指定了 [`static contextType`](#static-contexttype) 时才可用。

#### 返回值 {/*shouldcomponentupdate-returns*/}

如果你希望组件重新渲染的话就返回 `true`。这是也是默认执行的操作。

返回 `false` 来告诉 React 可以跳过重新渲染。

#### 注意 {/*shouldcomponentupdate-caveats*/}

- 此方法 **仅仅** 作为性能优化而存在。如果你的组件在没有它的情况下损坏，请先修复组件。

- 可以考虑使用 [`PureComponent`](/reference/react/PureComponent) 而不是手写 `shouldComponentUpdate`。`PureComponent` 会浅比较 props 和 state 以及减少错过必要更新的概率。

- 我们不建议在 `shouldComponentUpdate` 中使用深度相等检查或使用 `JSON.stringify`。因为它使性能变得不可预测并且它与每个 prop 和 state 的数据结构有关。在最好的情况下，你可能会面临给应用程序引入多秒停顿的风险，而在最坏的情况下，你可能会面临使应用程序崩溃的风险。

- 返回 `false` 并不会阻止子组件在 **他们的** state 发生变化时重新渲染。

- 返回 `false` 并不能 **确保** 组件不会重新渲染。React 将使用返回值作为提示，但如果是出于其他有意义的原因，它仍然可能选择重新渲染你的组件。

<Note>

使用 `shouldComponentUpdate` 来优化类式组件与使用 [`memo`](/reference/react/memo) 来优化函数式组件类似。函数式组件还使用 [`useMemo`](/reference/react/useMemo) 来提供更精细的优化。

</Note>

---

### `UNSAFE_componentWillMount()` {/*unsafe_componentwillmount*/}

如果你定义了 `UNSAFE_componentWillMount`，React 会在 [`constructor`](#constructor) 之后就立即调用它。它仅因历史原因而存在，不应在任何新代码中使用。相反请使用其他替代方案：

- 要初始化状态，请将 [`state`](#state) 声明为类字段或在 [`constructor`](#constructor) 内设置 `this.state`。
- 如果你需要运行额外作用或订阅监听事件事件，请将该逻辑移至 [`componentDidMount`](#componentdidmount)。

[查看避免不安全生命周期的示例](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#examples)。

#### 参数 {/*unsafe_componentwillmount-parameters*/}

`UNSAFE_componentWillMount` 不需要任何参数。

#### 返回值 {/*unsafe_componentwillmount-returns*/}

`UNSAFE_componentWillMount` 不应该返回任何值。

#### 注意 {/*unsafe_componentwillmount-caveats*/}

- 如果组件实现了 [`static getDerivedStateFromProps`](#static-getdrivenstatefromprops) 或 [`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate)，则不会调用 `UNSAFE_componentWillMount`。

- 尽管它的名字是这样的，但是如果你的应用程序使用 [`Suspense`](/reference/react/Sus​​pense) 等新式的 React 功能时，`UNSAFE_componentWillMount` 不保证组件 **将** 被挂载。如果渲染尝试被中止（例如，因为某些子组件的代码尚未加载），那么 React 将丢弃正在进行的树，并在下一次尝试期间尝试从头开始构建组件。这就是为什么这种方法是 **不安全** 的。依赖于挂载（例如添加监听事件）的代码应放入 [`componentDidMount`](#componentdidmount)。

- `UNSAFE_componentWillMount` 是运行 [服务器渲染](/reference/react-dom/server) 期间运行的唯一生命周期方法。对于所有实际上的用途来说，它与 [`constructor`](#constructor) 相同，因此你应该使用 `constructor` 来代替这种类型的逻辑。

<Note>

在类式组件中的 `UNSAFE_componentWillMount` 内部调用 [`setState`](#setstate) 来初始化状态等同于函数式组件中用该 state 作为初始 state 传递给 [`useState`](/reference/react/useState)。

</Note>

---

### `UNSAFE_componentWillReceiveProps(nextProps, nextContext)` {/*unsafe_componentwillreceiveprops*/}

如果你定义了 `UNSAFE_componentWillReceiveProps`，React 会在组件收到新的 props 时调用它。它仅因历史原因而存在，不应在任何新代码中使用。相反请使用以下替代方案：

- 如果你需要 **运行副作用**（例如，获取数据、运行动画或重新初始化监听）来响应 prop 的更改，那么请将该逻辑移至 [`componentDidUpdate`](#componentdidupdate)。
- 如果你需要 **避免仅 prop 更改时就重新计算某些数据** 时，请使用 [memoization helper](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization) 来代替。
- 如果你需要 **在 prop 更改时“重置”某些状态** 时，请考虑使组件 [完全控制](https://legacy.reactjs.org/blog/2018/06/07/you-probously-不需要派生状态。html#recommendation-fully-controlled-component) 或者 [使用 key 使组件完全不受控](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key) 来代替。
- 如果你需要 **在 prop 更改时“调整”某些状态** 时，请检查你是否可以在渲染期间单独从 props 计算所有必要的信息。如果不能，请使用 [`static getDerivedStateFromProps`](/reference/react/Component#static-getdrivenstatefromprops) 代替。

[查看避免不安全生命周期的示例](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props)。

#### 参数 {/*unsafe_componentwillreceiveprops-parameters*/}

- `nextProps`：组件即将从父组件接收的下一个 props。可以将 `nextProps` 与 [`this.props`](#props) 进行比较以确定具体是什么地方发生了变化。
- `nextContext`：组件即将从最近的 provider 中接收的下一个 context。可以将 `nextContext` 与 [`this.context`](#context) 进行比较以确定具体是什么地方发生了变化。仅在指定 [`static contextType`](#static-contexttype) 时可用。

#### 返回值 {/*unsafe_componentwillreceiveprops-returns*/}

`UNSAFE_componentWillReceiveProps` 不应该返回任何值。

#### 注意 {/*unsafe_componentwillreceiveprops-caveats*/}

- 如果组件实现了 [`static getDerivedStateFromProps`](#static-getdrivenstatefromprops) 或 [`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate)，则不会调用 `UNSAFE_componentWillReceiveProps`。

- 尽管它的名字是这样的，但如果你的应用程序使用 [`Suspense`](/reference/react/Sus​​pense) 等新式的 React 功能时，`UNSAFE_componentWillReceiveProps` 不保证组件 **将会** 接收这些 Props。如果渲染尝试被中止（例如，因为某些子组件的代码尚未加载），React 将丢弃正在进行的树，并在下一次尝试期间尝试从头开始构建组件。到下一次渲染尝试时，Props 可能会有所不同。这就是为什么这种方法 **不安全**。仅为了提交更新（例如重置监听事件）的代码应放入 [`componentDidUpdate`](#componentdidupdate)。

- `UNSAFE_componentWillReceiveProps` 并不意味着组件收到了与上次 **不同的** props。你需要自己比较 `nextProps` 和 `this.props` 以检查是否发生了变化。

- React 在挂载期间不会使用初始 props 调用 `UNSAFE_componentWillReceiveProps`。仅当组件的某些属性要更新时，它才会调用此方法。例如，在同一组件内调用 [`setState`](#setstate) 通常不会触发 `UNSAFE_componentWillReceiveProps`。

<Note>

在类式组件中的 `UNSAFE_componentWillReceiveProps` 里调用 [`setState`](#setstate) 来“调整”state 等同于在函数式组件在 [渲染期间调用来自 `useState` 的 `set` 函数](/reference/react/useState#storing-information-from-previous-renders)。

</Note>

---

### `UNSAFE_componentWillUpdate(nextProps, nextState)` {/*unsafe_componentwillupdate*/}


如果你定义了 `UNSAFE_componentWillUpdate`，React 会在使用新的 props 或 state 渲染之前调用它。它仅因历史原因而存在，不应在任何新代码中使用。相反请使用下面的替代方案：

- 如果你需要运行副作用（例如，获取数据、运行动画或重新初始化监听）来响应 prop 或 state 的更改，请将该逻辑移至 [`componentDidUpdate`](#componentdidupdate)。
- 如果需要从 DOM 中读取一些信息（例如，保存当前滚动位置）以便稍后在 [`componentDidUpdate`](#componentdidupdate) 中使用的话，那么请在 [`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate) 中读取这些信息。

[查看避免不安全生命周期的示例](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#examples)。

#### 参数 {/*unsafe_componentwillupdate-parameters*/}

- `nextProps`：组件即将用来渲染的下一个 props。将 `nextProps` 与 [`this.props`](#props) 进行比较以确定发生了什么变化。
- `nextState`：组件即将渲染的下一个 state。将 `nextState` 与 [`this.state`](#state) 进行比较以确定发生了什么变化。

#### 返回值 {/*unsafe_componentwillupdate-returns*/}

`UNSAFE_componentWillUpdate` 不应该返回任何值。

#### 注意 {/*unsafe_componentwillupdate-caveats*/}

- 如果定义了 [`shouldComponentUpdate`](#shouldcomponentupdate) 并返回 `false`，则 `UNSAFE_componentWillUpdate` 将不会被调用。

- 如果组件实现了 [`static getDerivedStateFromProps`](#static-getdrivenstatefromprops) 或 [`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate)，则不会调用 `UNSAFE_componentWillUpdate`。

- 不支持在 `componentWillUpdate` 期间调用 [`setState`](#setstate)（或任何导致调用 `setState` 的方法，例如调度 Redux 操作）。

- 尽管它的命名是这样，但如果你的应用程序使用如 [`Suspense`](/reference/react/Sus​​pense) 时等新式的 React 功能时，`UNSAFE_componentWillUpdate` 并不能保证组件 **将会** 更新。如果渲染尝试被中止（例如，因为某些子组件的代码尚未加载），React 将丢弃正在进行的树，并在下一次尝试期间尝试从头开始构建组件。到下一次渲染尝试时，props 和 state 可能会有所不同。这就是为什么这种方法“不安全”。仅针对提交更新（例如重置监听）而运行的代码应放入 [`componentDidUpdate`](#componentdidupdate)。

- `UNSAFE_componentWillUpdate` 并不意味着组件收到了与上次不同的 props 或 state。你需要自己将 `nextProps` 与 `this.props` 以及 `nextState` 与 `this.state` 进行比较，以检查是否发生了变化。

- React 在挂载期间不会使用初始的 props 和 state 调用 `UNSAFE_componentWillUpdate`。

<Note>

函数式组件中没有与 `UNSAFE_componentWillUpdate` 直接等同的方法。

</Note>

---

### `static contextType` {/*static-contexttype*/}

如果你想从类式组件中读取 [`this.context`](#context-instance-field)，则必须指定它需要读取哪个 context。你指定为 `static contextType` 的 context 必须是之前由 [`createContext` 创建的值](/reference/react/createContext)。

```js {2}
class Button extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {this.props.children}
      </button>
    );
  }
}
```

<Note>

在类式组件中读取 `this.context` 等同于在函数式组件中使用 [`useContext`](/reference/react/useContext)。

[了解如何迁移](#migrating-a-component-with-context-from-a-class-to-a-function)。

</Note>

---

### `static defaultProps` {/*static-defaultprops*/}

你可以定义 `static defaultProps` 来设置类的默认 props。它们将在 props 为 `undefined` 或者缺少时有效，但在 props 为 `null` 时无效。

例如，以下是如何定义 `color` 属性默认为 `blue`：

```js {2-4}
class Button extends Component {
  static defaultProps = {
    color: 'blue'
  };

  render() {
    return <button className={this.props.color}>click me</button>;
  }
}
```

如果 `color` props 未提供或者为 `undefined` 时，它将默认设置为 `blue`：

```js
<>
  {/* this.props.color 为 “blue” */}
  <Button />

  {/* this.props.color 为 “blue” */}
  <Button color={undefined} />

  {/* this.props.color 为 null */}
  <Button color={null} />

  {/* this.props.color 为 “red” */}
  <Button color="red" />
</>
```

<Note>

在类式组件中定义 `defaultProps` 类似于在函数式组件中使用 [默认值](/learn/passing-props-to-a-component#specifying-a-default-value-for-a-prop)。

</Note>

---

### `static getDerivedStateFromError(error)` {/*static-getderivedstatefromerror*/}

如果你定义了 `static getDerivedStateFromError`，那么当子组件（包括远亲组件）在渲染过程中抛出错误时，React 就会调用它。这使你可以显示错误消息而不是直接清理 UI。

通常，它与 [`componentDidCatch`](#componentDidCatch) 一起使用，它可以让你将错误报告发送到某些分析服务。具有这些方法的组件称为 **错误边界**。

[查看示例](#catching-rendering-errors-with-an-error-boundary)。

#### 参数 {/*static-getderivedstatefromerror-parameters*/}

* `error`：被抛出的错误。实际上，它通常是 [`Error`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Error) 的实例，但这并不能保证，因为 JavaScript 允许 [`抛出`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/throw) 任何类型的值，包括字符串甚至是 `null`。

#### 返回值 {/*static-getderivedstatefromerror-returns*/}

`static getDerivedStateFromError` 应该返回告诉组件显示错误消息的 state。

#### 注意 {/*static-getderivedstatefromerror-caveats*/}

* `static getDerivedStateFromError` 应该是一个纯函数。如果你想执行副作用（例如调用分析服务），你还需要实现 [`componentDidCatch`](#componentdidcatch)。

<Note>

函数式组件中目前还没有与 `static getDerivedStateFromError` 直接等同的东西。如果你想避免创建类式组件，请像上面那样编写一个 `ErrorBoundary` 组件，并在整个应用程序中使用它。或者使用 [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary) 包来执行此操作。

</Note>

---

### `static getDerivedStateFromProps(props, state)` {/*static-getderivedstatefromprops*/}

如果你定义了 `static getDerivedStateFromProps`，React 会在初始挂载和后续更新时调用 [`render`](#render) 之前调用它。它应该返回一个对象来更新 state，或者返回 `null` 就不更新任何内容。

此方法适用于 [少数罕见用例](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#when-to-use-derived-state)，其中 state 取决于 props 随着时间的推移的变化。例如，当 `userID` 属性更改时，此 `Form` 组件会重置 `email` 状态：

```js {7-18}
class Form extends Component {
  state = {
    email: this.props.defaultEmail,
    prevUserID: this.props.userID
  };

  static getDerivedStateFromProps(props, state) {
    // 每当当前用户发生变化时，
    // 重置与该用户关联的任何 state 部分。
    // 在这个简单的示例中，只是以 email 为例。
    if (props.userID !== state.prevUserID) {
      return {
        prevUserID: props.userID,
        email: props.defaultEmail
      };
    }
    return null;
  }

  // ...
}
```

请注意，此模式要求你将 prop 的先前值（如 `userID`）保留在 state（如 `prevUserID`）中。

<Pitfall>

派生 state 会导致代码冗长，并使你的组件难以理解。[确保你熟悉这些更简单的替代方案](https://legacy.reactjs.org/blog/2018/06/07/you-probously-dont-need-driven-state.html)：

- 如果你需要 **执行副作用**（例如，数据获取或动画）以响应 props 的更改，请改用 [`componentDidUpdate`](#componentdidupdate) 方法。
- 如果你想 **仅在 prop 更改时重新计算一些数据**，[使用 memoization helper 代替](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization)。
- 如果你想要 **当 prop 改变时“重置”一些 state**，请考虑使组件 [完全控制](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) 或者 [使用 key 使组件完全不受控](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key)。

</Pitfall>

#### 参数 {/*static-getderivedstatefromprops-parameters*/}

- `props`：组件即将用来渲染的下一个 props。
- `state`：组件即将渲染的下一个 state。

#### 返回值 {/*static-getderivedstatefromprops-returns*/}

`static getDerivedStateFromProps` 返回一个对象来更新 state，或返回 `null` 不更新任何内容。

#### 注意 {/*static-getderivedstatefromprops-caveats*/}

- 无论什么原因，此方法都会在 **每次** 渲染时触发。这与 [`UNSAFE_componentWillReceiveProps`](#unsafe_cmoponentwillreceiveprops) 不同，后者仅在父组件不是因为调用了本地的 `setState` 而重新渲染时触发。

- 此方法无权访问组件实例。如果你愿意，你可以在 `static getDerivedStateFromProps` 和其他类方法之间重用一些代码，也就是提取类定义之外的组件 props 和 state 的纯函数。

<Note>

在类式组件中实现 `static getDerivedStateFromProps` 等同于在函数式组件中 [在渲染期间从 useState 调用 set 函数](/reference/react/useState#storing-information-from-previous-renders)。

</Note>

---

## 用法 {/*usage*/}

### 定义类式组件 {/*defining-a-class-component*/}

要将 React 组件定义为类，请继承内置的 `Component` 类并定义 [`render` 方法](#render)：

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>你好, {this.props.name}!</h1>;
  }
}
```

每当 React 需要确定屏幕上显示的内容时，它就会调用你的 [`render`](#render) 方法。一般来说，你会让它返回一些 [JSX](/learn/writing-markup-with-jsx)。你的 `render` 方法应该是一个 [纯函数](https://en.wikipedia.org/wiki/Pure_function)：它应该只计算 JSX。

与 [函数式组件](/learn/your-first-component#defining-a-component) 类似，类式组件可以从它的父组件 [通过 props 接收信息](/learn/your-first-component#defining-a-component)。然而，读取 props 的语法是不同的。例如，如果父组件渲染了 `<Greeting name="Taylor" />` 组件，那么你可以从 [`this.props`](#props) 读取 `name` 属性，例如 `this.props.name`：

<Sandpack>

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>你好, {this.props.name}!</h1>;
  }
}

export default function App() {
  return (
    <>
      <Greeting name="Sara" />
      <Greeting name="Cahal" />
      <Greeting name="Edite" />
    </>
  );
}
```

</Sandpack>

请注意，类式组件内部不支持 Hook 函数（以 `use` 开头的函数，例如 [`useState`](/reference/react/useState)）。

<Pitfall>

我们建议使用函数式组件，而不是类式组件。[了解如何迁移](#migrating-a-simple-component-from-a-class-to-a-function)。

</Pitfall>

---

### 向类式组件添加 state {/*adding-state-to-a-class-component*/}

为了向类式组件添加 [state](/learn/state-a-components-memory)，请将一个对象分配给一个名为 [`state`](#state) 的属性。要更新 state 的话，请调用 [`this.setState`](#setstate)。

<Sandpack>

```js
import { Component } from 'react';

export default class Counter extends Component {
  state = {
    name: 'Taylor',
    age: 42,
  };

  handleNameChange = (e) => {
    this.setState({
      name: e.target.value
    });
  }

  handleAgeChange = () => {
    this.setState({
      age: this.state.age + 1 
    });
  };

  render() {
    return (
      <>
        <input
          value={this.state.name}
          onChange={this.handleNameChange}
        />
        <button onClick={this.handleAgeChange}>
          Increment age
        </button>
        <p>Hello, {this.state.name}. You are {this.state.age}.</p>
      </>
    );
  }
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack> 

<Pitfall>

我们建议使用函数式组件，而不是类式组件。[了解如何迁移](#migrating-a-component-with-state-from-a-class-to-a-function)。

</Pitfall>

---

### 向类式组件中添加生命周期方法 {/*adding-lifecycle-methods-to-a-class-component*/}

你可以在类中定义一些特殊方法。

如果你定义了 [`componentDidMount`](#componentdidmount) 方法，当你的组件被添加到屏幕上（**挂载**）时，React 将会调用它。当你的组件由于 props 或 state 改变而重新渲染后，React 将调用 [`componentDidUpdate`](#componentdidupdate)。当你的组件从屏幕上被移除（**卸载**）后，React 将调用 [`componentWillUnmount`](#componentwillunmount) 方法。

如果你实现了 `componentDidMount` 方法，那么通常还需要实现所有三个生命周期以避免错误。例如，如果 `componentDidMount` 读取了某些 state 或属性，你就还必须实现 `componentDidUpdate` 来处理它们的更改，并且实现 `componentWillUnmount` 来清理 `componentDidMount` 所执行的所有操作。

例如，这个 `ChatRoom` 组件使聊天连接与 props 和 state 保持同步：

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        选择一个聊天室:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">日常</option>
          <option value="travel">旅行</option>
          <option value="music">音乐</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? '关闭聊天' : '开启聊天'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/ChatRoom.js active
import { Component } from 'react';
import { createConnection } from './chat.js';

export default class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  setupConnection() {
    this.connection = createConnection(
      this.state.serverUrl,
      this.props.roomId
    );
    this.connection.connect();    
  }

  destroyConnection() {
    this.connection.disconnect();
    this.connection = null;
  }

  render() {
    return (
      <>
        <label>
          Server URL:{' '}
          <input
            value={this.state.serverUrl}
            onChange={e => {
              this.setState({
                serverUrl: e.target.value
              });
            }}
          />
        </label>
        <h1>欢迎来到 {this.props.roomId} 聊天室！</h1>
      </>
    );
  }
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // 真正的实现将实际地连接到服务器
  return {
    connect() {
      console.log('✅ 成功连接到 "' + roomId + '" 号聊天室，服务端 Url：' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ 无法连接到 "' + roomId + '" 号聊天室，服务端 Url：' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

请注意，在开发中，当 [严格模式](/reference/react/StrictMode) 开启时，React 将在调用 `componentDidMount` 后，立即调用 `componentWillUnmount`，然后再次调用 `componentDidMount`。这可以帮助你注意到你是否忘记实现 `componentWillUnmount`，或者它的逻辑是否没有完全“对应”到 `componentDidMount` 的效果。

<Pitfall>

我们建议使用函数式组件，而不是类式组件。[了解如何迁移](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)。

</Pitfall>

---

### 使用错误边界捕获渲染错误 {/*catching-rendering-errors-with-an-error-boundary*/}

默认情况下，如果你的应用程序在渲染过程中抛出错误，React 将从屏幕上删除其 UI。为了防止这种情况，你可以将 UI 的一部分包装到 **错误边界** 中。错误边界是一个特殊的组件，可让你显示一些后备 UI，而不是显示例如错误消息这样崩溃的部分。

要实现错误边界组件，你需要提供 [`static getDerivedStateFromError`](#static-getderivedstatefromerror)，它允许你更新状态以响应错误并向用户显示错误消息。你还可以选择实现 [`componentDidCatch`](#componentdidcatch) 来添加一些额外的逻辑，例如将错误添加到分析服务。

With [`captureOwnerStack`](/reference/react/captureOwnerStack) you can include the Owner Stack during development.

```js {9-12,14-27}
import * as React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // 更新状态，以便下一次渲染将显示后备 UI。
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    logErrorToMyService(
      error,
      // 示例“组件堆栈”：
      // 在 ComponentThatThrows 中（由 App 创建）
      // 在 ErrorBoundary 中（由 APP 创建）
      // 在 div 中（由 APP 创建）
      // 在 App 中
      info.componentStack,
      // 警告：Owner Stack 在生产中不可用
      React.captureOwnerStack(),
    );
  }

  render() {
    if (this.state.hasError) {
      // 你可以渲染任何自定义后备 UI
      return this.props.fallback;
    }

    return this.props.children;
  }
}
```

然后你可以用它包装组件树的一部分：

```js {1,3}
<ErrorBoundary fallback={<p>Something went wrong</p>}>
  <Profile />
</ErrorBoundary>
```

如果 `Profile` 或其子组件抛出错误，`ErrorBoundary` 将“捕获”该错误，然后显示带有你提供的错误消息的后备 UI，并向你的错误报告服务发送生产错误报告。

你不需要将每个组件包装到单独的错误边界中。当你考虑 [错误边界的布置](https://aweary.dev/fault-tolerance-react/) 时，请考虑在哪里显示错误消息才有意义。例如，在消息传递应用程序中，在对话列表周围放置错误边界是有意义的。在每条单独的消息周围放置一个也是有意义的。然而，在每个头像周围设置边界是没有意义的。

<Note>

目前还没有办法将错误边界编写为函数式组件。但是你不必自己编写错误边界类。例如，你可以使用 [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary) 包来代替。

</Note>

---

## 备选方案 {/*alternatives*/}

### 将简单的类式组件迁移为函数式 {/*migrating-a-simple-component-from-a-class-to-a-function*/}

一般来说，你应该把 [组件定义为函数](/learn/your-first-component#defining-a-component)。

例如，假设你要将 `Greeting` 从类式组件转换为函数：

<Sandpack>

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}

export default function App() {
  return (
    <>
      <Greeting name="Sara" />
      <Greeting name="Cahal" />
      <Greeting name="Edite" />
    </>
  );
}
```

</Sandpack>

定义一个名为 `Greeting` 的函数。将 `render` 函数的主体移动到这里。

```js
function Greeting() {
  // ... 把 render 方法中的代码移动到这里 ...
}
```

定义 `name` 属性而不是 `this.props.name`，[使用解构语法](/learn/passing-props-to-a-component) 来直接读取它：

```js
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}
```

这里有个完整的例子：

<Sandpack>

```js
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

export default function App() {
  return (
    <>
      <Greeting name="Sara" />
      <Greeting name="Cahal" />
      <Greeting name="Edite" />
    </>
  );
}
```

</Sandpack>

---

### 将具有 state 的类式组件迁移到函数 {/*migrating-a-component-with-state-from-a-class-to-a-function*/}

假设你要将这个 `Counter` 从类式组件转换为函数：

<Sandpack>

```js
import { Component } from 'react';

export default class Counter extends Component {
  state = {
    name: 'Taylor',
    age: 42,
  };

  handleNameChange = (e) => {
    this.setState({
      name: e.target.value
    });
  }

  handleAgeChange = (e) => {
    this.setState({
      age: this.state.age + 1 
    });
  };

  render() {
    return (
      <>
        <input
          value={this.state.name}
          onChange={this.handleNameChange}
        />
        <button onClick={this.handleAgeChange}>
          Increment age
        </button>
        <p>Hello, {this.state.name}. You are {this.state.age}.</p>
      </>
    );
  }
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

首先用必要的 [state 变量](/reference/react/useState#adding-state-to-a-component) 来创建一个函数。

```js {4-5}
import { useState } from 'react';

function Counter() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);
  // ...
```

接下来，转换事件处理程序：

```js {5-7,9-11}
function Counter() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleAgeChange() {
    setAge(age + 1);
  }
  // ...
```

最后，将所有以 `this` 开头的引用替换为你在组件中定义的变量和函数。例如，将 `this.state.age` 替换为 `age`，将 `this.handleNameChange` 替换为 `handleNameChange`。

这是一个完全转换后的组件：

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleAgeChange() {
    setAge(age + 1);
  }

  return (
    <>
      <input
        value={name}
        onChange={handleNameChange}
      />
      <button onClick={handleAgeChange}>
        Increment age
      </button>
      <p>Hello, {name}. You are {age}.</p>
    </>
  )
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

---

### 将具有生命周期方法的组件从类迁移到函数 {/*migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function*/}

假设你要将具有生命周期方法的 `ChatRoom` 类式组件转换为函数：

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/ChatRoom.js active
import { Component } from 'react';
import { createConnection } from './chat.js';

export default class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  setupConnection() {
    this.connection = createConnection(
      this.state.serverUrl,
      this.props.roomId
    );
    this.connection.connect();    
  }

  destroyConnection() {
    this.connection.disconnect();
    this.connection = null;
  }

  render() {
    return (
      <>
        <label>
          Server URL:{' '}
          <input
            value={this.state.serverUrl}
            onChange={e => {
              this.setState({
                serverUrl: e.target.value
              });
            }}
          />
        </label>
        <h1>欢迎俩到 {this.props.roomId} 聊天室！</h1>
      </>
    );
  }
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // 真正的实现将实际连接到服务器
  return {
    connect() {
      console.log('✅ 成功连接到 "' + roomId + '" 号聊天室，服务端 Url：' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ 无法连接到 "' + roomId + '" 号聊天室，服务端 Url：' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

首先，验证你的 [`componentWillUnmount`](#componentwillunmount) 是否与 [`componentDidMount`](#componentdidmount) 执行相反的操作。在上面的示例中操作是正确的：它会断开 `componentDidMount` 设置的连接。如果缺少这样的逻辑，请先添加它。

接下来，验证你的 [`componentDidUpdate`](#componentdidupdate) 方法是否可以处理对 `componentDidMount` 中使用的任何 props 和 state 的更改。在上面的例子中，`componentDidMount` 调用 `setupConnection` 来读取 `this.state.serverUrl` 和 `this.props.roomId`。这就是为什么 `componentDidUpdate` 检查 `this.state.serverUrl` 和 `this.props.roomId` 是否已更改，如果更改了则重置连接。如果你的 `componentDidUpdate` 逻辑丢失或无法处理所有相关 props 和 state 的更改，那么请首先修复该问题。

在上面的示例中，生命周期方法内的逻辑将组件连接到 React 外部的系统（聊天服务器）。要将组件连接到外部系统，[请将此逻辑描述为单个 Effect](/reference/react/useEffect#connecting-to-an-external-system)：

```js {6-12}
import { useState, useEffect } from 'react';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);

  // ...
}
```

这个 [`useEffect`](/reference/react/useEffect) 的调用就相当于实现了上面所有生命周期方法中的逻辑。如果你的生命周期方法做了多个互不相关的事，[将它们分成多个独立的 Effect](/learn/removing-effect-dependencies#is-your-effect-doing-several-unrelated-things)。这是一个你可以使用的完整示例：

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // 真正的实现将实际连接到服务器
  return {
    connect() {
      console.log('✅ 成功连接到 "' + roomId + '" 号聊天室，服务端 Url：' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ 无法连接到 "' + roomId + '" 号聊天室，服务端 Url：' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

<Note>

如果你的组件不与任何外部系统同步，[你可能不需要 Effect ](/learn/you-might-not-need-an-effect)。

</Note>

---

### 将具有 context 的组件从类迁移到函数 {/*migrating-a-component-with-context-from-a-class-to-a-function*/}

在这个例子中，`Panel` 和 `Button` 类式组件从 [`this.context`](#context) 读取 [context](/learn/passing-data-deeply-with-context)：

<Sandpack>

```js
import { createContext, Component } from 'react';

const ThemeContext = createContext(null);

class Panel extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'panel-' + theme;
    return (
      <section className={className}>
        <h1>{this.props.title}</h1>
        {this.props.children}
      </section>
    );    
  }
}

class Button extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {this.props.children}
      </button>
    );
  }
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>注册</Button>
      <Button>登录</Button>
    </Panel>
  );
}

export default function MyApp() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  )
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

当你将它们转换为函数式组件时，将 `this.context` 用调用 [`useContext`](/reference/react/useContext) 来替换：

<Sandpack>

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>注册</Button>
      <Button>登录</Button>
    </Panel>
  );
}

export default function MyApp() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  )
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>
