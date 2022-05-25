---
id: error-boundaries
title: 错误边界
permalink: docs/error-boundaries.html
---

过去，组件内的 JavaScript 错误会导致 React 的内部状态被破坏，并且在下一次渲染时 [产生](https://github.com/facebook/react/issues/4026) [可能无法追踪的](https://github.com/facebook/react/issues/6895) [错误](https://github.com/facebook/react/issues/8579)。这些错误基本上是由较早的其他代码（非 React 组件代码）错误引起的，但 React 并没有提供一种在组件中优雅处理这些错误的方式，也无法从错误中恢复。


## 错误边界（Error Boundaries） {#introducing-error-boundaries}

部分 UI 的 JavaScript 错误不应该导致整个应用崩溃，为了解决这个问题，React 16 引入了一个新的概念 —— 错误边界。
 
错误边界是一种 React 组件，这种组件**可以捕获发生在其子组件树任何位置的 JavaScript 错误，并打印这些错误，同时展示降级 UI**，而并不会渲染那些发生崩溃的子组件树。错误边界可以捕获发生在整个子组件树的渲染期间、生命周期方法以及构造函数中的错误。

> 注意
>
> 错误边界**无法**捕获以下场景中产生的错误：
>
> * 事件处理（[了解更多](#how-about-event-handlers)）
> * 异步代码（例如 `setTimeout` 或 `requestAnimationFrame` 回调函数）
> * 服务端渲染
> * 它自身抛出来的错误（并非它的子组件）

如果一个 class 组件中定义了 [`static getDerivedStateFromError()`](/docs/react-component.html#static-getderivedstatefromerror) 或 [`componentDidCatch()`](/docs/react-component.html#componentdidcatch) 这两个生命周期方法中的任意一个（或两个）时，那么它就变成一个错误边界。当抛出错误后，请使用 `static getDerivedStateFromError()` 渲染备用 UI ，使用 `componentDidCatch()` 打印错误信息。

```js{7-10,12-15,18-21}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 你同样可以将错误日志上报给服务器
    logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // 你可以自定义降级后的 UI 并渲染
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}
```

然后你可以将它作为一个常规组件去使用：

```js
<ErrorBoundary>
  <MyWidget />
</ErrorBoundary>
```

错误边界的工作方式类似于 JavaScript 的 `catch {}`，不同的地方在于错误边界只针对 React 组件。只有 class 组件才可以成为错误边界组件。大多数情况下, 你只需要声明一次错误边界组件, 并在整个应用中使用它。

注意**错误边界仅可以捕获其子组件的错误**，它无法捕获其自身的错误。如果一个错误边界无法渲染错误信息，则错误会冒泡至最近的上层错误边界，这也类似于 JavaScript 中 `catch {}` 的工作机制。

## 在线演示 {#live-demo}

查看 [定义和使用错误边界的示例](https://codepen.io/gaearon/pen/wqvxGa?editors=0010)。


## 错误边界应该放置在哪？ {#where-to-place-error-boundaries}

错误边界的粒度由你来决定，可以将其包装在最顶层的路由组件并为用户展示一个 “Something went wrong” 的错误信息，就像服务端框架经常处理崩溃一样。你也可以将单独的部件包装在错误边界以保护应用其他部分不崩溃。 


## 未捕获错误（Uncaught Errors）的新行为 {#new-behavior-for-uncaught-errors}

这一改变具有重要意义，**自 React 16 起，任何未被错误边界捕获的错误将会导致整个 React 组件树被卸载。**

我们对这一决定有过一些争论，但根据我们的经验，把一个错误的 UI 留在那比完全移除它要更糟糕。例如，在类似 Messenger 的产品中，把一个异常的 UI 展示给用户可能会导致用户将信息错发给别人。同样，对于支付类应用而言，显示错误的金额也比不呈现任何内容更糟糕。

此变化意味着当你迁移到 React 16 时，你可能会发现一些已存在你应用中但未曾注意到的崩溃。增加错误边界能够让你在应用发生异常时提供更好的用户体验。

例如，Facebook Messenger 将侧边栏、信息面板、聊天记录以及信息输入框包装在单独的错误边界中。如果其中的某些 UI 组件崩溃，其余部分仍然能够交互。

我们也鼓励使用 JS 错误报告服务（或自行构建），这样你能了解关于生产环境中出现的未捕获异常，并将其修复。


## 组件栈追踪 {#component-stack-traces}

在开发环境下，React 16 会把渲染期间发生的所有错误打印到控制台，即使该应用意外的将这些错误掩盖。除了错误信息和 JavaScript 栈外，React 16 还提供了组件栈追踪。现在你可以准确地查看发生在组件树内的错误信息：

<img src="../images/docs/error-boundaries-stack-trace.png" style="max-width:100%" alt="Error caught by Error Boundary component">

你也可以在组件栈追踪中查看文件名和行号，这一功能在 [Create React App](https://github.com/facebookincubator/create-react-app) 项目中默认开启：

<img src="../images/docs/error-boundaries-stack-trace-line-numbers.png" style="max-width:100%" alt="Error caught by Error Boundary component with line numbers">

如果你没有使用 Create React App，可以手动将[该插件](https://www.npmjs.com/package/@babel/plugin-transform-react-jsx-source)添加到你的 Babel 配置中。注意它仅用于开发环境，**在生产环境必须将其禁用** 。

> 注意
>
> 组件名称在栈追踪中的显示依赖于 [`Function.name`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name) 属性。如果你想要支持尚未提供该功能的旧版浏览器和设备（例如 IE 11），考虑在你的打包（bundled）应用程序中包含一个 `Function.name` 的 polyfill，如 [`function.name-polyfill`](https://github.com/JamesMGreene/Function.name) 。或者，你可以在所有组件上显式设置 [`displayName`](/docs/react-component.html#displayname) 属性。


## 关于 try/catch ？ {#how-about-trycatch}

`try` / `catch` 很棒但它仅能用于命令式代码（imperative code）：

```js
try {
  showButton();
} catch (error) {
  // ...
}
```

然而，React 组件是声明式的并且具体指出 *什么* 需要被渲染：

```js
<Button />
```

错误边界保留了 React 的声明性质，其行为符合你的预期。例如，即使一个错误发生在 `componentDidUpdate` 方法中，并且由某一个深层组件树的 `setState` 引起，其仍然能够冒泡到最近的错误边界。

## 关于事件处理器 {#how-about-event-handlers}

错误边界**无法**捕获事件处理器内部的错误。

React 不需要错误边界来捕获事件处理器中的错误。与 render 方法和生命周期方法不同，事件处理器不会在渲染期间触发。因此，如果它们抛出异常，React 仍然能够知道需要在屏幕上显示什么。

如果你需要在事件处理器内部捕获错误，使用普通的 JavaScript `try` / `catch` 语句：

```js{9-13,17-20}
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    try {
      // 执行操作，如有错误则会抛出
    } catch (error) {
      this.setState({ error });
    }
  }

  render() {
    if (this.state.error) {
      return <h1>Caught an error.</h1>
    }
    return <button onClick={this.handleClick}>Click Me</button>
  }
}
```

请注意上述例子只是演示了普通的 JavaScript 行为，并没有使用错误边界。

## 自 React 15 的命名更改 {#naming-changes-from-react-15}

React 15 中有一个支持有限的错误边界方法 `unstable_handleError`。此方法不再起作用，同时自 React 16 beta 发布起你需要在代码中将其修改为 `componentDidCatch`。

对此，我们已提供了一个 [codemod](https://github.com/reactjs/react-codemod#error-boundaries) 来帮助你自动迁移你的代码。
