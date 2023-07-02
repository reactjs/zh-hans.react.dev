---
title: Component
---

<Pitfall>

我们建议将组件定义为函数而不是类。[了解如何迁移](#alternatives)

</Pitfall>

<Intro>

`Component` 是被定义为 [JavaScript 类](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) 的 React 基类，类组件仍然被 React 支持，但我们不建议在新代码中使用它们。

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

要想将React组件定义为一个类，你需要扩展内置的 `Component` 类并定义一个 [`render` 方法](#render)：

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

只有 `render` 方法是必要的，其他方法是可选的。

[查看以下的更多实例](#usage)

---

### `context` {/*context*/}

一个类组件的 [context](/learn/passing-data-deeply-with-context) 可以通过使用 `this.context` 来实现。 只有当你使用 [`static contextType`](#static-contexttype) (更新的)或者 [`static contextTypes`](#static-contexttypes) (已被废弃) 来特别指定你想要接受 **哪一个** context 时它才会有效。

类组件一次只能读取一个context。

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

在类组件中读取 `this.context` 等同于在函数式组件中使用的 [`useContext`](/reference/react/useContext) 。

[了解如何迁移](#migrating-a-component-with-context-from-a-class-to-a-function)

</Note>

---

### `props` {/*props*/}

传递给类组件的 props 的有效形式为 `this.props` 。

```js {3}
class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}

<Greeting name="Taylor" />
```

<Note>

在类组件中读取 `this.props` 等同于在函数式组件中使用的 [declaring props](/learn/passing-props-to-a-component#step-2-read-props-inside-the-child-component) 。

[了解如何迁移](#migrating-a-simple-component-from-a-class-to-a-function)

</Note>

---

### `refs` {/*refs*/}

<Deprecated>

这个API将在未来React的主版本中被移除。 [使用 `createRef` 来代替](/reference/react/createRef)。

</Deprecated>

允许你获取此组件的 [legacy string refs](https://reactjs.org/docs/refs-and-the-dom.html#legacy-api-string-refs) 

---

### `state` {/*state*/}

使用 `this.state` 来访问一个类组件的 state 。 `state` 字段必须是一个对象。请不要直接改变 state 的值。如果你希望改变 state ，使用新的 state 来调用 `setState` 函数。

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
        Increment age
        </button>
        <p>You are {this.state.age}.</p>
      </>
    );
  }
}
```

<Note>

在类组件中定义 `state` 等同于在函数式组件中通过调用 [`useState`](/reference/react/useState) 函数所创造的 state 。

[了解如何迁移](#migrating-a-component-with-state-from-a-class-to-a-function)

</Note>

---

### `constructor(props)` {/*constructor*/}

[constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/constructor) 在你的类组件 **挂载**（添加到屏幕上）之前运行，一般来说，在 React 中 constructor 仅用于两个目的。它可以让你来声明 state 以及将你的类方法 [bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind) 到你的类实例上。

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

如果你使用更新的 JavaScript 语法的话，那么很少需要使用到 constructors 。相反，你可以使用现代浏览器和像 [Babel](https://babeljs.io/) 这样的工具都支持的[公有类字段语法](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Public_class_fields)来重写上面的代码。

```js {2,4}
class Counter extends Component {
  state = { counter: 0 };

  handleClick = () => {
    // ...
  }
```

constructor 不应该包含任何额外作用或者监听相关。

#### 参数 {/*constructor-parameters*/}

* `props`: 组件初始的 props 。

#### 返回值 {/*constructor-returns*/}

`constructor` 不应该返回任何东西。

#### 说明 {/*constructor-caveats*/}

* 不要在 constructor 中运行任何任额外作用或者监听相关的代码。相反，我们使用 [`componentDidMount`](#componentdidmount) 来解决这个问题。

* 在 constructor 中，你需要在其他声明之前调用 `super(props)` 。如果你不这样做，当 constructor 运行时  `this.props` 就会为 `undefined` ， 这可能会让人迷惑并且导致错误。
 
* Constructor 是唯一一个你能直接赋值 [`this.state`](#state) 的地方。 在其余所有方法中，你需要使用 [`this.setState()`](#setstate) 来代替。不要使用在 constructor 中使用 `setState` 。

* 当你使用 [服务端渲染](/reference/react-dom/server) 时， constructor 也将在服务端运行，紧接着是 [`render`](#render) 方法。 然而，像是 `componentDidMount` 或者 `componentWillUnmount` 这样的生命周期方法将不会在服务端运行。

* 当 [严格模式](/reference/react/StrictMode) 打开时， React 将会在开发过程中调用两次 `constructor` 然后丢弃其中的一个实例。这有助于你注意到需要从 `constructor` 中移出的意外副作用。

<Note>

在函数式组件中没有与 `constructor` 完全相同的构造函数。 要在函数式组件中声明 state 请调用 [`useState`](/reference/react/useState) 来避免重复计算 state 的初始状态。[传递一个函数给 `useState`](/reference/react/useState#avoiding-recreating-the-initial-state)。

</Note>

---

### `componentDidCatch(error, info)` {/*componentdidcatch*/}

如果你定义了 `componentDidCatch` ，那么当某些子组件(包括远程子组件)在渲染过程中抛出错误时React将调用它。这使得你可以在生产中将该错误记录到错误报告服务中。

一般来说，它与 [`static getDerivedStateFromError`](#static-getderivedstatefromerror) 一起使用，这样做允许你更新状态以响应错误并向用户显示错误消息。具有这些方法的组件称为 **错误边界** 。

[查看示例](#catching-rendering-errors-with-an-error-boundary)

#### 参数 {/*componentdidcatch-parameters*/}

* `error`: 抛出的错误。实际上，它通常会是一个 [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 的实例，不过这并不能保证，因为 JavaScript 允许 [`throw`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw) 所有的值，包括字符串甚至是 `null` 。

* `info`: 一个包含有关错误的附加信息的对象。 它的 `componentStack` 字段包含一个堆栈跟踪，其中包含抛出的组件，以及其所有父组件的名称和源位置。在生产中，组件名称将被缩小。如果你设置了生产错误报告，则可以使用源映射来解码组件堆栈，就像处理常规 JavaScript 错误堆栈一样。

#### 返回值 {/*componentdidcatch-returns*/}

`componentDidCatch` 不应该返回任何值。

#### 说明 {/*componentdidcatch-caveats*/}

* 在以前， 经常在 `componentDidCatch` 中使用 `setState` 来更新UI以及显示回退错误消息。这已被废弃，有利于定义 [`static getDerivedStateFromError`.](#static-getderivedstatefromerror) 。

* React 的生产和开发版本在 `componentDidCatch` 处理错误的方式有所不同，在开发环境下，错误将冒泡至 `window` ，这意味着任何 `window.onerror` 或者 `window.addEventListener('error', callback)` 都将拦截被 `componentDidCatch` 所捕获到的错误。在生产环境下，相反，错误并不会冒泡， 这意味着任何祖先级的错误处理器都只会接收到被 `componentDidCatch` 捕获的非显式错误。

<Note>

在函数组件中目前还没有直接等价的 `componentDidCatch` 。如果你想要避免创建类组件，那么可以单独写一个像上面一样的 `ErrorBoundary` 并在整个应用中使用它。 又或者，你可以使用 [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary) 包，它可以完成同样的工作。

</Note>

---

### `componentDidMount()` {/*componentdidmount*/}

如果你定义了 `componentDidMount` 方法， React 将会在你的组件添加上屏幕 **（mounted）** 时调用它。这是开始数据获取、设置监听或操作DOM节点的常见位置。

如果你要执行 `componentDidMount` ，你通常需要设置一些其他的生命周期函数来避免出错。例如，如果 `componentDidMount` 读取一些 state 或者 props ，你还必须要设置 [`componentDidUpdate`](#componentdidupdate) 来处理它们的更改， 以及设置 [`componentWillUnmount`](#componentwillunmount) 来清理 `componentDidMount` 所产生的作用。

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

[查看更多实例](#adding-lifecycle-methods-to-a-class-component)

#### 参数 {/*componentdidmount-parameters*/}

`componentDidMount` 不需要任何参数。

#### 返回值 {/*componentdidmount-returns*/}

`componentDidMount` 不应该返回任何值。

#### 说明 {/*componentdidmount-caveats*/}

- 当 [严格模式](/reference/react/StrictMode) 开启时，在开发环境中 React 会调用 `componentDidMount`，然后会立刻调用 [`componentWillUnmount`,](#componentwillunmount) 接着再次调用 `componentDidMount` 。 这将帮助你注意到你是否忘记设置 `componentWillUnmount` 或者它的逻辑是否完全覆盖到 `componentDidMount` 的功能。

- 虽然你可以在 `componentDidMount` 中立即调用[`setState`](#setstate) ，不过最好避免这样做。 这将触发一次额外的渲染，但是这是在浏览器更新屏幕之前发生的。 这确认了在这种情况下即使 [`render`](#render) 被调用了两次， 用户也无法看到中间的状态。请谨慎使用这种模式因为它可能会造成性能问题。在大多数情况下， 你应该能在[`constructor`](#constructor)中设置初始的 state 。 但是，对于模态和工具提示等情况，当你需要在呈现依赖于其大小或位置的内容之前测量 DOM 节点时，它可能是必要的。

<Note>

对于大多数的使用场景来说，在类组件中一起定义 `componentDidMount`， `componentDidUpdate`， 和 `componentWillUnmount` 等同于在函数式组件中调用 [`useEffect`](/reference/react/useEffect) 。在一些少数的情况，例如在浏览器绘制前执行代码很重要时， [`useLayoutEffect`](/reference/react/useLayoutEffect) 是一个更合适的匹配。

[了解如何迁移](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Note>

---

### `componentDidUpdate(prevProps, prevState, snapshot?)` {/*componentdidupdate*/}

如果你定义了 `componentDidUpdate` 方法，当你的组件更新了 props 或 state 重新渲染后，React 将立即调用它。这个方法不会在首次渲染时调用。

你可以在更新后使用它来操作 DOM 。这也是进行网络请求的常见位置，只要你将当前的 props 与以前的 props 进行比较即可（例如，如果 props 没有更改，则可能不需要网络请求）。一般来说， 这个方法与[`componentDidMount`](#componentdidmount) 以及 [`componentWillUnmount`:](#componentwillunmount) 一起使用。

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

[查看更多实例](#adding-lifecycle-methods-to-a-class-component)


#### 参数 {/*componentdidupdate-parameters*/}

* `prevProps`: 更新之前的 Props 。 `prevProps` 将会与 [`this.props`](#props) 进行比较来确定是否改变。

* `prevState`: 更新之前的 State 。 `prevState` 将会与 [`this.state`](#state) 进行比较来确定是否改变。

* `snapshot`: 如果你设置了 [`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate) ，那么 `snapshot` 将包含从该方法返回的值。否则，它将是 `undefined` 。

#### 返回值 {/*componentdidupdate-returns*/}

`componentDidUpdate` 不应该返回任何值。

#### 说明 {/*componentdidupdate-caveats*/}

- 如果你定义了 [`shouldComponentUpdate`](#shouldcomponentupdate) 并且返回 false 的话，那么 `componentDidUpdate` 将不会被调用。

- `componentDidUpdate` 内部的逻辑通常应该包含在比较 `this.props` 与 `prevProps` 和 `this.state` 与 `prevState` 之中。 否则，就会存在创建无限循环的风险。

- 虽然可以在 `componentDidUpdate` 中立即调用 [`setState`](#setstate) ，但最好尽可能避免这样做。它将触发一个额外的渲染，但它将在浏览器更新屏幕之前发生。 这导致了即使 [`render`](#render) 在这种情况下会被调用两次， 用户也不会看到中间状态。这种模式通常会导致性能问题，但在模态和工具提示等少数情况下，当你需要在呈现依赖于其大小或位置的内容之前测量DOM节点时，可能需要使用这种模式。

<Note>

对于大多数用例来说， 在类组件中一起定义 `componentDidMount` ， `componentDidUpdate` ， 和 `componentWillUnmount` 相当于在函数式组件中定义了 [`useEffect`](/reference/react/useEffect) 。在少数情况下，代码在浏览器绘制之前运行很重要，这时 [`useLayoutEffect`](/reference/react/useLayoutEffect) 是更佳的匹配。

[了解如何迁移](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Note>
---

### `componentWillMount()` {/*componentwillmount*/}

<Deprecated>

此 API 已从 `componentWillMount` 重命名为 [`UNSAFE_componentWillMount`.](#unsafe_componentwillmount) ，旧名称已被弃用，在 React 的未来主要版本中，只有新名称才有效。

运行 [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) 来自动更新你的组件。

</Deprecated>

---

### `componentWillReceiveProps(nextProps)` {/*componentwillreceiveprops*/}

<Deprecated>

此 API 已从 `componentWillReceiveProps` 重命名为 [`UNSAFE_componentWillReceiveProps`.](#unsafe_componentwillreceiveprops) ，旧名称已被弃用，在 React 的未来主要版本中，只有新名称才有效。

运行 [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) 来自动更新你的组件。

</Deprecated>

---

### `componentWillUpdate(nextProps, nextState)` {/*componentwillupdate*/}

<Deprecated>

此 API 已从 `componentWillUpdate` 重命名为 [`UNSAFE_componentWillUpdate`.](#unsafe_componentwillupdate) ，旧名称已被弃用，在 React 的未来主要版本中，只有新名称才有效。

运行 [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) 来自动更新你的组件。

</Deprecated>

---

### `componentWillUnmount()` {/*componentwillunmount*/}

如果你定义了 `componentWillUnmount` 方法，React 会在你的组件被移除屏幕之前 *(unmounted)* 调用它。这是取消数据获取或删除监听的常见位置。

`componentWillUnmount` 内部的逻辑应该覆盖全 [`componentDidMount`.](#componentdidmount) 内部的逻辑， 例如，如果在 `componentDidMount` 中设置了一个监听，那么 `componentWillUnmount` 中应该清除掉这个监听。如果你 `componentWillUnmount` 的清理逻辑中读取了一些 props 或者 state ，那么你通常还需要实现一个 [`componentDidUpdate`](#componentdidupdate) 来清理旧 props 和 state 对应的资源（例如监听）。

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

[查看更多示例](#adding-lifecycle-methods-to-a-class-component)

#### 参数 {/*componentwillunmount-parameters*/}

`componentWillUnmount` 不需要任何参数。

#### 返回值 {/*componentwillunmount-returns*/}

`componentWillUnmount` 不应该返回任何值。

#### 说明 {/*componentwillunmount-caveats*/}

- 当 [严格模式](/reference/react/StrictMode) 开启时，在开发中React会调用[`componentDidMount`,](#componentdidmount)，然后立即调用 `componentWillUnmount` ，然后再次调用 `componentDidMount` 。这可以帮助你注意到你是否忘记实现 `componentWillUnmount` ，或者它的逻辑是否没有完全覆盖到 `componentDidMount` 的作用。

<Note>

对于许多用例，在类组件中一起定义 `componentDidMount` 、 `componentDidUpdate` 和 `componentWillUnmount` 相当于在函数式组件中调用 [`useEffect`](/reference/react/useEffect) 。在少数情况下，代码在浏览器绘制之前运行很重要时，[`useLayoutEffect`](/reference/react/useLayoutEffect) 是更为接近的匹配。

[了解如何迁移](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Note>

---

### `forceUpdate(callback?)` {/*forceupdate*/}

强制组件重新渲染。

通常来说，这是没有必要的。如果组件的 [`render`](#render) 方法仅读取了 [`this.props`](#props) 、 [`this.state`](#state) 或 [`this.context`,]( #context) 时，当你在组件或其父组件之一内调用 [`setState`](#setstate) 时，它就将自动重新渲染。但是，如果组件的 `render` 方法直接从外部数据源读取，则必须告诉 React 在该数据源更改时更新用户界面。这就是你可以用 `forceUpdate` 做的事。

尽量避免使用 `forceUpdate` 并且在 `render` 中只读取 `this.props` 和 `this.state` 。

#### 参数 {/*forceupdate-parameters*/}

* **optional** `callback` 如果有指定，React 将在提交更新后调用你提供的 `callback` 。

#### 返回值 {/*forceupdate-returns*/}

`forceUpdate` 不返回任何值。

#### 说明 {/*forceupdate-caveats*/}

- 如果你调用了 `forceUpdate`， React 将重新渲染而且不会调用 [`shouldComponentUpdate`。](#shouldComponentupdate)

<Note>

读取外部数据源并强制类组件使用 `forceUpdate` 来重新渲染更改已被函数式组件中的 [`useSyncExternalStore`](/reference/react/useSyncExternalStore) 所取代。

</Note>

---

### `getChildContext()` {/*getchildcontext*/}

<Deprecated>

该 API 将在 React 的未来主要版本中删除。 [使用 `Context.Provider` 代替。](/reference/react/createContext#provider)

</Deprecated>

允许你指定由该组件提供的 [legacy context](https://reactjs.org/docs/legacy-context.html) 的值。

---

### `getSnapshotBeforeUpdate(prevProps, prevState)` {/*getsnapshotbeforeupdate*/}

如果你实现 `getSnapshotBeforeUpdate` ，React 会在 React 更新 DOM 之前立即调用它。它使你的组件能够在 DOM 发生更改之前捕获一些信息（例如滚动位置）。此生命周期方法返回的任何值都将作为参数传递给 [`componentDidUpdate`。](#componentdidupdate)

例如，你可以在 UI 中像是需要在更新期间保留其滚动位置的聊天消息来使用它。

```js {7-15,17}
class ScrollingList extends React.Component {
  constructor(props) {
    super(props);
    this.listRef = React.createRef();
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // 我们是否要向列表中添加新项目？
    // 捕获滚动​​位置，以便我们稍后可以调整滚动。
    if (prevProps.list.length < this.props.list.length) {
      const list = this.listRef.current;
      return list.scrollHeight - list.scrollTop;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // 如果我们有快照值，那么我们刚刚添加了新项目。
    // 调整滚动，使这些新项目不会将旧项目推出视野。
    // （这里的snapshot是getSnapshotBeforeUpdate返回的值）
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

在上面的示例中，直接在 `getSnapshotBeforeUpdate` 中读取 `scrollHeight` 属性非常重要。在 [`render`](#render) 、 [`UNSAFE_componentWillReceiveProps`](#unsafe_componentwillreceiveprops) 或 [`UNSAFE_componentWillUpdate`](#unsafe_componentwillupdate) 中读取它是不安全的，因为在这些方法被调用和 React 更新 DOM 之间存在潜在的时间间隔。

#### 参数 {/*getsnapshotbeforeupdate-parameters*/}

* `prevProps`: 更新之前的 Props 。 `prevProps` 将会与 [`this.props`](#props) 进行比较来确定是否改变。

* `prevState`: 更新之前的 State 。 `prevState` 将会与 [`this.state`](#state) 进行比较来确定是否改变。

#### 返回值 {/*getsnapshotbeforeupdate-returns*/}

你应该返回你想要的任何类型的快照值，或者 `null` 。你返回的值将作为第三个参数传递给 [`componentDidUpdate`。](#componentdidupdate) 。

#### 说明 {/*getsnapshotbeforeupdate-caveats*/}

- 如果定义了 [`shouldComponentUpdate`](#shouldcomponentUpdate) 并返回了 `false` ，则不会调用 `getSnapshotBeforeUpdate` 。

<Note>

目前，函数式组件中还没有与 `getSnapshotBeforeUpdate` 等效的API。这种用例非常罕见，但如果你有需要，那么你必须编写一个类组件。

</Note>

---

### `render()` {/*render*/}

`render` 方法是类组件中唯一必需的方法。

`render` 方法应该指定你想要在屏幕上显示的内容，例如：

```js {4-6}
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

React 可能随时调用 `render` ，因此你不应该假设它在特定时间运行。通常， `render` 方法应该返回一段 [JSX](/learn/writing-markup-with-jsx)，但也支持一些 [其他返回类型](#render-returns)（如字符串）。为了计算返回的 JSX ，`render` 方法可以读取 [`this.props`](#props)、[`this.state`](#state) 和 [`this.context`](#context) 。

你应该将 `render` 方法编写为纯函数，这意味着如果 props、state 和 context 相同，它应该返回相同的结果。它也不应该包含额外的作用（例如设置监听）或与浏览器 API 交互。额外的作用应该发生在事件处理程序或 [`componentDidMount`.](#componentdidmount) 等方法中。

#### 参数 {/*render-parameters*/}

* `prevProps`: 更新之前的 Props 。 `prevProps` 将会与 [`this.props`](#props) 进行比较来确定是否改变。

* `prevState`: 更新之前的 State 。 `prevState` 将会与 [`this.state`](#state) 进行比较来确定是否改变。

#### 返回值 {/*render-returns*/}

`render` 可以返回任何有效的 React 节点。这包括 React 元素，例如 `<div />`、字符串、数字、 [portals](/reference/react-dom/createPortal) 、空节点（`null`、`undefined`、`true` 和 `false` ）和 React 节点数组。

#### 说明 {/*render-caveats*/}

- `render` 应该写成 props 、 state 和 context 的纯函数，它不应该包含额外的作用。

- 如果定义了 [`shouldComponentUpdate`](#shouldcomponentupdate) 并返回 `false`，则不会调用 `render`。

- 当 [严格模式](/reference/react/StrictMode) 开启时，React 将在开发过程中调用 `render` 两次，然后丢弃其中一个结果。这可以帮助你注意到需要从 `render` 方法中移出的意外副作用。

- `render` 调用和后续的 `componentDidMount` 或 `componentDidUpdate` 调用之间没有一一对应的关系。当这样更好时，React 可能会丢弃一些 `render` 的调用结果。

---

### `setState(nextState, callback?)` {/*setstate*/}

调用 `setState` 来更新 React 组件的 state 。

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
        <p>Hello, {this.state.name}.
      </>
    );
  }
}
```

`setState` 将组件的 state 的更改加入队列。它告诉 React 该组件及其子组件需要使用新状态重新渲染。这是更新用户界面以响应交互的主要方式。

<Pitfall>

调用 `setState` 时 **不会** 更改已执行代码中的当前状态：

```js {6}
function handleClick() {
  console.log(this.state.name); // "Taylor"
  this.setState({
    name: 'Robin'
  });
  console.log(this.state.name); // 依然是 "Taylor"!
}
```

它只影响从 **下一个** 渲染开始返回的 `this.state` 。

</Pitfall>

你还可以将函数传递给 `setState` 。它允许你根据先前的 state 来更新 state：

```js {2-6}
  handleIncreaseAge = () => {
    this.setState(prevState => {
      return {
        age: prevState.age + 1
      };
    });
  }
```

你不必这样做，但如果你想在同一事件期间多次更新状态，这会很方便。

#### 参数 {/*setstate-parameters*/}

* `nextState`: 一个对象或者函数。
  * 如果你传递一个对象作为 `nextState` ，它将浅层合并到 `this.state` 中。
  * 如果你传递一个函数作为 `nextState` ，它将被视为 **更新函数** 。它必须是个纯函数，应该以已加载的 state 和 props 作为参数，并且应该返回要浅层合并到 `this.state` 中的对象。 React 会将你的更新函数放入队列中并重新渲染你的组件。在下一次渲染期间，React 将通过应用队列中的所有更新程序来计算下一个 state 。

* **可选的** `callback`: 如果指定，React 将在提交更新后调用你提供的 `回调` 。

#### 返回值 {/*setstate-returns*/}

`setState` 不会返回任何值。

#### 说明 {/*setstate-caveats*/}

- 将 `setState` 视为 **请求** ，而不是立即会更新组件的命令。当多个组件更新它们的 state 以响应事件时， React 将批量更新它们，并在这次事件结束时将它们一起重新渲染。在极少数情况下，你需要强制同步应用特定的状态更新，你可以将其包装在 [`flushSync`,](/reference/react-dom/flushSync) 中，但这可能会损害性能。

- `setState` 不会立即更新 `this.state`。这让在调用 `setState` 之后立即读取 `setState` 成为一个潜在的陷阱。相反，请使用 [`componentDidUpdate`](#componentdidupdate) 或 setState `callback` 参数，其中任何一个都保证在更新后触发。如果需要根据前一个状态来设置状态，可以将函数传递给 `nextState` ，如上所述。

<Note>

在类组件中调用 `setState` 等同于在函数式组件中调用 [`set` 函数](/reference/react/useState#setstate) 。

[了解如何迁移](#migrating-a-component-with-state-from-a-class-to-a-function)

</Note>

---

### `shouldComponentUpdate(nextProps, nextState, nextContext)` {/*shouldcomponentupdate*/}

如果你定义了 `shouldComponentUpdate` ，React 将调用它来确定是否可以跳过重新渲染。

如果你确信你想手动编写它，你可以将`this.props`与`nextProps`进行比较，将`this.state`与`nextState`进行比较，并返回`false`来告诉React可以跳过更新。

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

当收到新的 props 或 state 时，React 会在渲染之前调用 `shouldComponentUpdate` ，默认为 `true` 。初始渲染或使用 [`forceUpdate`](#forceupdate) 时将不会调用此方法。

#### 参数 {/*shouldcomponentupdate-parameters*/}

- `nextProps`: 组件即将用来渲染的下一个 props 。将 `nextProps` 与 [`this.props`](#props) 进行比较以确定发生了什么变化。
- `nextState`: 组件即将渲染的下一个 state 。将 `nextState` 与 [`this.state`](#props) 进行比较以确定发生了什么变化。
- `nextContext`: 组件将要渲染的下一个上下文。将 `nextContext` 与 [`this.context`](#context) 进行比较以确定发生了什么变化。仅当你指定了 [`static contextType`](#static-contexttype)（更新的）或 [`static contextTypes`](#static-contexttypes)（旧版）时才可用。

#### 返回值 {/*shouldcomponentupdate-returns*/}

返回 `true` 如果你希望组件重新渲染。这是默认返回。

返回 `false` 来告诉 React 可以跳过重新渲染。

#### 说明 {/*shouldcomponentupdate-caveats*/}

- 此方法 **仅仅** 作为性能优化而存在。如果你的组件在没有它的情况下损坏，请先修复组件。

- 可以考虑使用 [`PureComponent`](/reference/react/PureComponent) 而不是手动编写 `shouldComponentUpdate` 。 `PureComponent` 浅层比较 props 和 state ，并减少你跳过必要更新的机会。

- 我们不建议在 `shouldComponentUpdate` 中进行深度相等检查或使用 `JSON.stringify` 。它使性能变得不可预测，并且依赖于每个 prop 和 state 的数据结构。在最好的情况下，你可能会冒着给应用程序引入多秒停顿的风险，而在最坏的情况下，你可能会面临使应用程序崩溃的风险。

- 返回 `false` 并不会阻止子组件在 **他们的** state 发生变化时重新渲染。

- 返回 `false` 并不能 **确保** 组件不会重新渲染。 React 将使用返回值作为提示，但如果出于其他有意义原因，它仍然可能选择重新渲染你的组件。

<Note>

使用 `shouldComponentUpdate` 优化类组件与使用 [`memo`.](/reference/react/memo) 优化函数式组件类似。函数式组件还使用 [`useMemo`.](/reference/react/useMemo) 来提供更精细的优化。

</Note>

---

### `UNSAFE_componentWillMount()` {/*unsafe_componentwillmount*/}

如果你定义了 `UNSAFE_componentWillMount` ，React 会在 [`constructor`](#constructor) 之后立即调用它。它仅因历史原因而存在，不应在任何新代码中使用。相反，请使用一种替代方案：

- 要初始化状态，请将 [`state`](#state) 声明为类字段或在 [`constructor`.](#constructor) 内设置 `this.state` 。

- 如果你需要运行额外作用或设置监听，请将该逻辑移至 [`componentDidMount`](#componentdidmount) 。

[查看避免不安全生命周期的示例](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#examples)

#### 参数 {/*unsafe_componentwillmount-parameters*/}

`UNSAFE_componentWillMount` 不需要任何参数。

#### 返回值 {/*unsafe_componentwillmount-returns*/}

`UNSAFE_componentWillMount` 不应该返回任何值。

#### 说明 {/*unsafe_componentwillmount-caveats*/}

- 如果组件实现了 [`static getDerivedStateFromProps`](#static-getdrivenstatefromprops) 或 [`getSnapshotBeforeUpdate`.](#getsnapshotbeforeupdate)，则不会调用 `UNSAFE_componentWillMount` .

- 即使它的名字是这样的，但是如果你的应用程序使用 [`Suspense`.](/reference/react/Sus​​pense) 等现代 React 功能时，`UNSAFE_componentWillMount` 不保证组件 **将** 被安装。（例如，因为某些子组件的代码尚未加载。） React 将丢弃正在进行的树，并在下一次尝试期间尝试从头开始构建组件。 这就是为什么这种方法是 **不安全** 的。依赖于挂载（例如添加监听）的代码应放入 [`componentDidMount`。](#componentdidmount)

- `UNSAFE_componentWillMount` 是用于所有实际目的在[服务器渲染](/reference/react-dom/server)期间运行的唯一生命周期方法，它与 [`constructor`,](#constructor) 相同，因此你应该使用 `constructor` 来代替这种类型的逻辑。

<Note>

在类组件中的 `UNSAFE_componentWillMount` 内部调用 [`setState`](#setstate) 来初始化状态等同于函数式组件中用该 state 作为初始状态传递给 [`useState`] 。


</Note>

---

### `UNSAFE_componentWillReceiveProps(nextProps, nextContext)` {/*unsafe_componentwillreceiveprops*/}

如果你定义了 `UNSAFE_componentWillReceiveProps` ，React 会在组件收到新的 props 时调用它。它仅因历史原因而存在，不应在任何新代码中使用。相反，请使用以下替代方案：

- 如果你需要 **运行额外作用** （例如，获取数据、运行动画或重新初始化监听）来响应 prop 更改，请将该逻辑移至 [`componentDidUpdate`](#componentdidupdate)
- 如果你需要 **避免仅在 prop 更改时重新计算某些数据** 请使用 [memoization helper](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization) 代替。
- 如果你需要 **在 prop 更改时`重置`某些状态**考虑制作一个组件 [fully uncontrolled](https://legacy.reactjs.org/blog/2018/06/07/you-probously-不需要派生状态。html#recommendation-fully-controlled-component) 或者 [fully uncontrolled with a key](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key) instead.
- 如果你需要 **在 prop 更改时`调整`某些状态，** 检查你是否可以在渲染期间单独从 props 计算所有必要的信息。如果不能，请改用 [`static getDerivedStateFromProps`](/reference/react/Component#static-getdrivenstatefromprops)。

[查看避免不安全生命周期的示例](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props)

#### 参数 {/*unsafe_componentwillreceiveprops-parameters*/}

- `nextProps`: 组件将从其父组件接收的下一个 props。将 `nextProps` 与 [`this.props`](#props) 进行比较以确定发生了什么变化。
- `nextContext`: 组件将从最近的提供者处接收的下一个 props。将 `nextContext` 与 [`this.context`](#context) 进行比较以确定发生了什么变化。仅当你指定 [`static contextType`](#static-contexttype)（更新的）或 [`static contextTypes`](#static-contexttypes)（旧版）时才可用。

#### 返回值 {/*unsafe_componentwillreceiveprops-returns*/}

`UNSAFE_componentWillReceiveProps` 不应该返回任何值。

#### 说明 {/*unsafe_componentwillreceiveprops-caveats*/}

- 如果组件实现了 [`static getDerivedStateFromProps`](#static-getdrivenstatefromprops) 或 [`getSnapshotBeforeUpdate`.](#getsnapshotbeforeupdate)，则不会调用 `UNSAFE_componentWillReceiveProps`

- 即使它的名字是这样的， 如果你的应用程序使用 [`Suspense`.](/reference/react/Sus​​pense) 等现代 React 功能，`UNSAFE_componentWillReceiveProps` 不保证组件 **将** 接收这些 Props （例如，因为某些子组件的代码尚未加载）， React 将丢弃正在进行的树，并在下一次尝试期间尝试从头开始构建组件。 到下一次渲染尝试时，Props 可能会有所不同。这就是为什么这种方法 **不安全** 。仅为提交更新（例如重置监听）的代码应放入 [`componentDidUpdate`.](#componentdidupdate)

- `UNSAFE_componentWillReceiveProps` 并不意味着组件收到了与上次 **不同的** props 。你需要自己比较 `nextProps` 和 `this.props` 以检查是否发生了变化。

- React 在挂载期间不会使用初始 props 调用 `UNSAFE_componentWillReceiveProps` 。仅当组件的某些属性要更新时，它才会调用此方法。例如，在同一组件内调用 [`setState`](#setstate) 通常不会触发 `UNSAFE_componentWillReceiveProps`。

<Note>

在类组件中的 `UNSAFE_componentWillReceiveProps` 里调用 [`setState`](#setstate) 来“调整” state 等同于在函数式组件中调用[calling the `set` function from `useState` during rendering](/reference/react/useState#storing-information-from-previous-renders)。

</Note>

---

### `UNSAFE_componentWillUpdate(nextProps, nextState)` {/*unsafe_componentwillupdate*/}


如果你定义了`UNSAFE_componentWillUpdate`，React 会在使用新的 props 或 state 渲染之前调用它。它仅因历史原因而存在，不应在任何新代码中使用。相反，请使用下面的替代方案：

- 如果你需要运行额外作用（例如，获取数据、运行动画或重新初始化监听）来响应 prop 或 state 更改，请将该逻辑移至 [`componentDidUpdate`](#componentdidupdate) 。
- 如果需要从 DOM 中读取一些信息（例如，保存当前滚动位置）以便稍后在 [`componentDidUpdate`](#componentdidupdate) 中使用的话，那么请在 [`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate) 中读取。

[查看避免不安全生命周期的示例](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#examples)

#### 参数 {/*unsafe_componentwillupdate-parameters*/}

- `nextProps`: 组件即将用来渲染的下一个 props。将 `nextProps` 与 [`this.props`](#props) 进行比较以确定发生了什么变化。

- `nextState`: 组件即将渲染的下一个 state 。将 `nextState` 与 [`this.state`](#state) 进行比较以确定发生了什么变化。

#### 返回值 {/*unsafe_componentwillupdate-returns*/}

`UNSAFE_componentWillUpdate` 不应该返回任何值。

#### 说明 {/*unsafe_componentwillupdate-caveats*/}

- 如果定义了 [`shouldComponentUpdate`](#shouldcomponentupdate) 并返回 `false`，则 `UNSAFE_componentWillUpdate` 将不会被调用。

- 如果组件实现了 [`static getDerivedStateFromProps`](#static-getdrivenstatefromprops) 或 [`getSnapshotBeforeUpdate`.](#getsnapshotbeforeupdate)，则不会调用`UNSAFE_componentWillUpdate`

- 不支持在 `componentWillUpdate` 期间调用 [`setState`](#setstate)（或任何导致调用 `setState` 的方法，例如分派 Redux 操作）。

- 尽管它的命名是这样， `UNSAFE_componentWillUpdate` 并不能保证如果你的应用程序使用现代 React 功能（如 [`Suspense`.](/reference/react/Sus​​pense) ）时，组件 **将会** 更新（例如，因为某些子组件的代码尚未加载），React 将丢弃正在进行的树，并在下一次尝试期间尝试从头开始构建组件。到下一次渲染尝试时，props 和 state 可能会有所不同。 这就是为什么这种方法“不安全”。仅针对提交更新（例如重置监听）运行的代码应放入 [`componentDidUpdate`。](#componentdidupdate)

- `UNSAFE_componentWillUpdate` 并不意味着组件收到了与上次不同的 props 或状态。你需要自己将 `nextProps` 与 `this.props` 以及 `nextState` 与 `this.state` 进行比较，以检查是否发生了变化。

- React 在挂载期间不会使用初始 props 和 state 调用 `UNSAFE_componentWillUpdate` 。
<Note>

函数式组件中没有与 `UNSAFE_componentWillUpdate` 直接dewng'tong的东西。

</Note>

---

### `static childContextTypes` {/*static-childcontexttypes*/}

<Deprecated>

该 API 将在 React 的未来主要版本中删除。 [使用 `static contextType` 代替。](#static-contexttype)

</Deprecated>

允许你指定此组件提供哪个[旧版上下文](https://reactjs.org/docs/legacy-context.html)。

---

### `static contextTypes` {/*static-contexttypes*/}

<Deprecated>

该 API 将在 React 的未来主要版本中删除。 [使用 `static contextType` 代替。](#static-contexttype)

</Deprecated>

允许你指定此组件使用哪个[旧版上下文](https://reactjs.org/docs/legacy-context.html)。

---

### `static contextType` {/*static-contexttype*/}

如果你想从类组件中读取 [`this.context`](#context-instance-field)，则必须指定它需要读取哪个 context 。你指定为 `static contextType` 的上下文必须是之前由 [`createContext` 创建的值。](/reference/react/createContext)

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

在类组件中读取 `this.context` 等同于在函数组件中读取 [`useContext`](/reference/react/useContext) 。

[了解如何迁移](#migrating-a-component-with-context-from-a-class-to-a-function)

</Note>

---

### `static defaultProps` {/*static-defaultprops*/}

你可以定义 `static defaultProps` 来设置类的默认 props 。它们将在props为 `undefined` 和缺少时使用 ，但不能用于 props 为 `null` 时 。

例如，以下是如何定义 `color` 属性默认为 `blue` ：

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

如果未提供 `color` props 或者为 `undefined` ，它将默认设置为 `blue` ：

```js
<>
  {/* this.props.color is "blue" */}
  <Button />

  {/* this.props.color is "blue" */}
  <Button color={undefined} />

  {/* this.props.color is null */}
  <Button color={null} />

  {/* this.props.color is "red" */}
  <Button color="red" />
</>
```

<Note>

在类组件中定义 `defaultProps` 类似于在函数式组件中使用[默认值](/learn/passing-props-to-a-component#specifying-a-default-value-for-a-prop)。

</Note>

---

### `static propTypes` {/*static-proptypes*/}

你可以定义 `static propTypes` 和 [`prop-types`](https://www.npmjs.com/package/prop-types) 库来声明组件接受的 props 类型。这些类型仅在渲染和开发过程中进行检查。

```js
import PropTypes from 'prop-types';

class Greeting extends React.Component {
  static propTypes = {
    name: PropTypes.string
  };

  render() {
    return (
      <h1>Hello, {this.props.name}</h1>
    );
  }
}
```

<Note>

我们建议使用 [TypeScript](https://www.typescriptlang.org/) 而不是在运行时检查 prop 类型。

</Note>

---

### `static getDerivedStateFromError(error)` {/*static-getderivedstatefromerror*/}

如果你定义了`static getDerivedStateFromError`，当子组件（包括远程子组件）在渲染过程中抛出错误时，React 将调用它。这使你可以显示错误消息而不是清除 UI。

通常，它与 [`componentDidCatch`](#componentDidCatch) 一起使用，它可以让你将错误报告发送到某些分析服务。具有这些方法的组件称为 **错误边界。**

[查看示例](#catching-rendering-errors-with-an-error-boundary)

#### 参数 {/*static-getderivedstatefromerror-parameters*/}

* `error`: 被抛出的错误。实际上，它通常是 [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 的实例，但这并不能保证，因为 JavaScript 允许 [`throw`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw) 任何值，包括字符串甚至 `null`。

#### 返回值 {/*static-getderivedstatefromerror-returns*/}

`static getDerivedStateFromError` 应该返回告诉组件显示错误消息的状态。

#### 说明 {/*static-getderivedstatefromerror-caveats*/}

* `static getDerivedStateFromError` 应该是一个纯函数。如果你想执行额外作用（例如，调用分析服务），你还需要实现 [`componentDidCatch`.](#componentdidcatch)

<Note>

函数式组件中目前还没有与 `static getDerivedStateFromError` 直接等效的东西。 如果你想避免创建类组件，请像上面那样编写一个`ErrorBoundary` 组件，并在整个应用程序中使用它。或者，使用 [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary) 包来执行此操作。

</Note>

---

### `static getDerivedStateFromProps(props, state)` {/*static-getderivedstatefromprops*/}

如果你定义了 `static getDerivedStateFromProps` ，React 会在初始挂载和后续更新时调用 [`render`](#render) 之前调用它。它应该返回一个对象来更新状态，或者返回 `null` 不更新任何内容。

此方法适用于[少数罕见用例](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#when-to-use-derived-state) ，其中 state 取决于 props 随着时间的推移的变化。例如，当 `userID` 属性更改时，此 `Form` 组件会重置 `email` 状态：

```js {7-18}
class Form extends Component {
  state = {
    email: this.props.defaultEmail,
    prevUserID: this.props.userID
  };

  static getDerivedStateFromProps(props, state) {
    // 每当当前用户发生变化时，
    // 重置与该用户关联的任何 state 部分。
    // 在这个简单的示例中，只是以电子邮件为例。
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

请注意，此模式要求你将 prop 的先前值（如 `userID` ）保留在状态（如 `prevUserID` ）中。

<Pitfall>

派生 state 会导致代码冗长，并使你的组件难以理解。 [确保你熟悉更简单的替代方案：](https://legacy.reactjs.org/blog/2018/06/07/you-probously-dont-need-driven-state.html)

- 如果你需要 **执行副作用** （例如，数据获取或动画）以响应 props 的更改，请改用 [`componentDidUpdate`](#componentdidupdate) 方法。
- 如果你想 **仅在 prop 更改时重新计算一些数据，**[使用记忆助手代替。](https://legacy.reactjs.org/blog/2018/06/07/you-probously-不需要派生状态.html#what-about-memoization）
-如果你想要 **当 prop 改变时 "重置" 一些 state，** 考虑制作一个组件[完全控制](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) 或者 [带key的完全非受控组件](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key)。
</Pitfall>

#### 参数 {/*static-getderivedstatefromprops-parameters*/}

- `props`: 组件即将用来渲染的下一个 props 。
- `state`: 组件即将渲染的下一个 state 。

#### 返回值 {/*static-getderivedstatefromprops-returns*/}

`static getDerivedStateFromProps` 返回一个对象以更新状态，或返回 `null` 不更新任何内容。

#### 说明 {/*static-getderivedstatefromprops-caveats*/}

- 无论原因如何，此方法都会在 **每个** 渲染时触发。这与 [`UNSAFE_componentWillReceiveProps`](#unsafe_cmoponentwillreceiveprops) 不同，后者仅在父级导致重新渲染时触发，而不是由于本地 `setState` 的结果。

- 此方法无权访问组件实例。如果你愿意，你可以通过在类定义之外提取组件 props 和 state 的纯函数，在 `static getDerivedStateFromProps` 和其他类方法之间重用一些代码。

<Note>

在类组件中实现 `static getDerivedStateFromProps` 等同于于在函数式组件中[在渲染期间从 useState 调用 set 函数](/reference/react/useState#storing-information-from-previous-renders)。

</Note>

---

## 用法 {/*usage*/}

### 定义类组件 {/*defining-a-class-component*/}

要将 React 组件定义为类，请扩展内置的 `Component` 类并定义 [`render` 方法:](#render)

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

每当 React 需要确定屏幕上显示的内容时，它就会调用你的 [`render`](#render) 方法。一般来说，你将让它返回一些 [JSX](/learn/writing-markup-with-jsx) 你的 `render` 方法应该是一个[纯函数：](https://en.wikipedia.org/wiki/Pure_function)，它应该只计算 JSX。

与[函数式组件](/learn/your-first-component#defining-a-component)类似，类组件可以从它的父组件[通过props接收信息](/learn/your-first-component#defining-a-component) 。然而，读取 props 的语法是不同的。例如，如果父组件渲染 `<Greeting name="Taylor" />`，那么你可以从 [`this.props`](#props) 读取 `name` 属性，例如 `this.props.name` ：

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

请注意，类组件内部不支持 Hook（以 `use` 开头的函数，例如 [`useState`](/reference/react/useState) ）。

<Pitfall>

我们建议将组件定义为函数而不是类。[了解如何迁移](#migrating-a-simple-component-from-a-class-to-a-function)

</Pitfall>

---

### 向类组件添加 state {/*adding-state-to-a-class-component*/}

为了向类组件添加 [state](/learn/state-a-components-memory) ，将一个对象分配给一个名为 [`state`](#state) 的属性。要更新 state ，请调用 [`this.setState`](#setstate) 。

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

我们建议将组件定义为函数而不是类。[了解如何迁移](#migrating-a-component-with-state-from-a-class-to-a-function)

</Pitfall>

---

### 向类组件中添加生命周期方法 {/*adding-lifecycle-methods-to-a-class-component*/}

你可以在类中定义一些特殊方法。

如果你定义了 [`componentDidMount`](#componentdidmount) 方法，当你的组件被添加到屏幕上时，React 将会调用它。当你的组件由于 props 或 state 改变而重新渲染后，React 将调用 [`componentDidUpdate`](#componentdidupdate)。当你的组件从屏幕上被移除（**卸载**）后，React 将调用 [`componentWillUnmount`](#componentwillunmount)。

如果你实现了 `componentDidMount` ，通常需要实现所有三个生命周期以避免错误。例如，如果 `componentDidMount` 读取某些 state 或属性，你还必须实现 `componentDidUpdate` 来处理它们的更改，并实现 `componentWillUnmount` 来清理 `componentDidMount`所执行的所有操作。

例如，这个 `ChatRoom` 组件使聊天连接与 props 和 state 保持同步：

<Sandpack>

```js App.js
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

```js ChatRoom.js active
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
        <h1>Welcome to the {this.props.roomId} room!</h1>
      </>
    );
  }
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // 真正的实现将实际地连接到服务器
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

请注意，在开发中，当 [严格模式](/reference/react/StrictMode) 开启时，React 将在调用 `componentDidMount` 后，立即调用 `componentWillUnmount` ，然后再次调用 `componentDidMount` 。这可以帮助你注意到你是否忘记实现 `componentWillUnmount` ，或者它的逻辑是否没有完全“镜像覆盖到” `componentDidMount` 的作用。

<Pitfall>

我们建议将组件定义为函数而不是类。[了解如何迁移](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Pitfall>

---

### 使用错误边界捕获渲染错误 {/*catching-rendering-errors-with-an-error-boundary*/}

默认情况下，如果你的应用程序在渲染过程中抛出错误，React 将从屏幕上删除其 UI。为了防止这种情况，你可以将 UI 的一部分包装到 **错误边界** 中。错误边界是一个特殊的组件，可让你显示一些备用 UI ，而不是例如错误消息这样崩溃的部分。

要实现错误边界组件，你需要提供静态 getDerivedStateFromError ，它允许你更新状态以响应错误并向用户显示错误消息。你还可以选择实现 [`componentDidCatch`](#componentdidcatch) 以添加一些额外的逻辑，例如，将错误记录到分析服务。

```js {7-10,12-19}
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
    // 示例“组件堆栈”：
    //   在 ComponentThatThrows 中（由 App 创建）
    //   在 ErrorBoundary 中（由 APP 创建）
    //   在 div 中（由 APP 创建）
    //   在 App 中
    logErrorToMyService(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // 您可以渲染任何自定义后备 UI
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

如果 `Profile` 或其子组件抛出错误，`ErrorBoundary` 将“捕获”该错误，显示带有你提供的错误消息的后备 UI，并向你的错误报告服务发送生产错误报告。

你不需要将每个组件包装到单独的错误边界中。当你考虑[错误边界的布置](https://aweary.dev/fault-tolerance-react/)时，请考虑在哪里显示错误消息才有意义。例如，在消息传递应用程序中，在对话列表周围放置错误边界是有意义的。在每条单独的消息周围放置一个也是有意义的。然而，在每个头像周围设置边界是没有意义的。

<Note>

目前还没有办法将错误边界编写为函数组件。但是，你不必自己编写错误边界类。例如，你可以使用 [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary) 代替。

</Note>

---

## 备选方案 {/*alternatives*/}

### 将简单的类组件迁移为函数式 {/*migrating-a-simple-component-from-a-class-to-a-function*/}

一般来说，你[将组件定义为函数](/learn/your-first-component#defining-a-component)。

例如，假设你要将 `Greeting` 从类组件转换为函数：

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

定义一个名为 `Greeting` 的函数。你将移动 `render` 函数的主体到这里。

```js
function Greeting() {
  // ... 把 render 方法中的代码移动到这里 ...
}
```

定义 `name` 属性而不是 `this.props.name` ，[使用解构语法](/learn/passing-props-to-a-component) 来直接读取它：
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

### 将具有状态的类组件迁移到函数 {/*migrating-a-component-with-state-from-a-class-to-a-function*/}

Suppose you're converting this `Counter` class component to a function:

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

首先用必要的 [state variables](/reference/react/useState#adding-state-to-a-component) 来创建一个函数。

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

最后，将所有以 `this` 开头的引用替换为你在组件中定义的变量和函数。例如，将 `this.state.age` 替换为 `age` ，将 `this.handleNameChange` 替换为 `handleNameChange` 。

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

假设你要将具有生命周期方法的 `ChatRoom` 类组件转换为函数：

<Sandpack>

```js App.js
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

```js ChatRoom.js active
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
        <h1>Welcome to the {this.props.roomId} room!</h1>
      </>
    );
  }
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // 真正的实现将实际连接到服务器
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
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

接下来， 验证你的 [`componentDidUpdate`](#componentdidupdate) 方法是否可以处理对 `componentDidMount` 中使用的任何 props 和 state 的更改。在上面的例子中，`componentDidMount` 调用 `setupConnection` 来读取 `this.state.serverUrl` 和 `this.props.roomId` 。这就是为什么 `componentDidUpdate` 检查 `this.state.serverUrl` 和 `this.props.roomId` 是否已更改，如果更改了则重置连接。 如果你的 `componentDidUpdate` 逻辑丢失或无法处理所有相关 props 和 state 的更改，请首先修复该问题。

在上面的示例中，生命周期方法内的逻辑将组件连接到 React 外部的系统（聊天服务器）。要将组件连接到外部系统，[将此逻辑描述为单个效果：](/reference/react/useEffect#connecting-to-an-external-system)

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

这个 [`useEffect`](/reference/react/useEffect) 调用相当于上面生命周期方法中的逻辑。如果你的生命周期方法做了多个互不相关的事，[将它们分成多个独立的效果](/learn/removing-effect-dependencies#is-your-effect-doing-several-unrelated-things)。这是一个你可以使用的完整示例：

<Sandpack>

```js App.js
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

```js ChatRoom.js active
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

```js chat.js
export function createConnection(serverUrl, roomId) {
  // 真正的实现将实际连接到服务器
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
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

如果你的组件不与任何外部系统同步，[你可能不需要 effect ](/learn/you-might-not-need-an-effect)

</Note>

---

### 将具有 context 的组件从类迁移到函数 {/*migrating-a-component-with-context-from-a-class-to-a-function*/}

在这个例子中，`Panel` 和 `Button` 类组件从 [`this.context`:](#context) 读取 [context](/learn/passing-data-deeply-with-context)。

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
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

export default function MyApp() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
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

当你将它们转换为函数组件时，将 `this.context` 替换为 [`useContext`](/reference/react/useContext) 调用：

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
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

export default function MyApp() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
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
