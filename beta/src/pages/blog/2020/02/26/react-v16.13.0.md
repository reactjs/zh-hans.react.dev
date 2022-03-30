---
title: 'React v16.13.0'
author: [threepointone]
redirect_from:
  - 'blog/2020/03/02/react-v16.13.0'
---

今天我们发布了 React 16.13.0。此版本修复了部分 bug 并添加了新的弃用警告，以助力接下来的主要版本。

## 新的警告 {/*new-warnings*/}

### Render 期间更新的警告 {/*warnings-for-some-updates-during-render*/}

React 组件不应在 render 期间对其他组件产生副作用。

在 render 期间调用 `setState` 是被支持的，但是 [仅仅适用于*同一个组件*](/docs/hooks-faq#how-do-i-implement-getderivedstatefromprops)。 如果你在另一个组件 render 期间调用 `setState`，现在你将会看到一条警告。

```
Warning: Cannot update a component from inside the function body of a different component.
```

**这些警告将会帮助你找到应用中由意外的状态改变引起的 bug。** 在极少数情况下，由于渲染，你有意要更改另一个组件的状态，你可以将 `setState` 调用包装为  `useEffect`。

### 冲突的样式规则警告 {/*warnings-for-conflicting-style-rules*/}

当动态地应用包含了全写和简写的 `style` 版本的 CSS 属性时，特定的更新组合可能会导致样式不一致。例如：

```js
<div
  style={
    toggle
      ? {background: 'blue', backgroundColor: 'red'}
      : {backgroundColor: 'red'}
  }>
  ...
</div>
```

你可能期待这个 `<div>` 总是拥有红色背景，不论 `toggle` 的值是什么。然而，在 `true` 和 `false`之间交替使用`toggle`时，背景色开始是 `red`，然后在 `transparent` 和 `blue`之间交替，[正如你能在这个 demo 中看到的](https://codesandbox.io/s/blue-water-ghx8mi)。

**React 现在检测到冲突的样式规则并打印出警告**。要解决此问题，请不要在 `style` 属性中混合使用同一CSS属性的简写和全写版本。

### 某些废弃字符串 ref 的警告 {/*warnings-for-some-deprecated-string-refs*/}

[字符串 ref 是过时的 API](/docs/refs-and-the-dom#legacy-api-string-refs) 这是不可取的，将来将被弃用：

```js
<Button ref="myRef" />
```

(不要将字符串 ref 与一般的 ref 混淆，后者**仍然完全受支持**。)

在将来，我们将提供一个自动脚本（“codemod”），以从字符串 ref 中迁移。然而，一些罕见的案例不能自动迁移。此版本在弃用之前添加了一个新的警告**仅适用于那些情况**。

例如，如果将字符串 ref 与 Render Prop 模式一起使用，则它将触发：

```jsx
class ClassWithRenderProp extends React.Component {
  componentDidMount() {
    doSomething(this.refs.myRef);
  }
  render() {
    return this.props.children();
  }
}

class ClassParent extends React.Component {
  render() {
    return (
      <ClassWithRenderProp>{() => <Button ref="myRef" />}</ClassWithRenderProp>
    );
  }
}
```

这样的代码通常暗含 bug。（你可能希望 ref 在 `ClassParent` 上可用，但是它被放在 `ClassWithRenderProp` 上）。

**你很可能没有这样的代码**。如果是有意为之，请将其转换为 [`React.createRef()`](/docs/refs-and-the-dom#creating-refs)：

```jsx
class ClassWithRenderProp extends React.Component {
  myRef = React.createRef();
  componentDidMount() {
    doSomething(this.myRef.current);
  }
  render() {
    return this.props.children(this.myRef);
  }
}

class ClassParent extends React.Component {
  render() {
    return (
      <ClassWithRenderProp>
        {(myRef) => <Button ref={myRef} />}
      </ClassWithRenderProp>
    );
  }
}
```

> Note
>
> 要查看此警告，你需要在你的 Babel plugins 中安装 [babel-plugin-transform-react-jsx-self](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx-self)。它必须 __只__ 在开发模式下启用。 
>
> 如果你使用 Create React App 或者用 babel 7+ 的 React preset，那么默认情况下已经安装了这个插件。

### 弃用 `React.createFactory` {/*deprecating-reactcreatefactory*/}

[`React.createFactory`](/docs/react-api#createfactory)为 React 创建一个帮助器元素。此版本向该方法添加了一个弃用警告。它将在未来的主要版本中删除。

把 `React.createFactory` 替换为普通的 JSX 。或者可以复制并粘贴此单行辅助对象或将其发布为库：

```jsx
let createFactory = (type) => React.createElement.bind(null, type);
```

它的作用完全相同。

### 弃用 `ReactDOM.unstable_createPortal` 推荐 `ReactDOM.createPortal` {/*deprecating-reactdomunstable_createportal-in-favor-of-reactdomcreateportal*/}

当 React 16 发布时，`createPortal` 成为一个官方支持的 API。

但是，我们保留了 `unstable_createPortal` 作为受支持的别名，以使采用它的少数库正常工作。我们现在反对使用 unstable 别名。直接使用 `createPortal` 而不是 `unstable_createPortal`。它有完全相同的签名。

## 其他改进 {/*other-improvements*/}

### Hydration 过程中组件堆栈的警告 {/*component-stacks-in-hydration-warnings*/}

React 将组件堆栈添加到其开发警告中，使开发人员能够隔离 bug 并调试他们的程序。此版本将组件堆栈添加到许多以前没有的开发警告中。举个例子，考虑一下以前版本中的 hydration 警告：

![控制台警告的屏幕截图，简单地说明 hydration 不匹配的性质："Warning: Expected server HTML to contain a matching div in div."](/images/blog/react-v16.13.0/hydration-warning-before.png)

虽然它指出了代码中的一个错误，但不清楚错误在哪里存在，以及下一步该怎么做。此版本向此警告添加了一个组件堆栈，使其看起来如下所示：

![控制台警告的屏幕截图，说明 hydration 不匹配的性质，但也包括组件堆栈："Warning: Expected server HTML to contain a matching div in div, in div (at pages/index.js:4)..."](/images/blog/react-v16.13.0/hydration-warning-after.png)

这样可以清楚地看出问题所在，并让你更快地找到并修复错误。

### 值得注意的错误修复 {/*notable-bugfixes*/}

此版本包含其他一些值得注意的改进：

- 在严格的开发模式下，React 调用生命周期方法两次，以清除任何可能不需要的副作用。此版本将此行为添加到 `shouldComponentUpdate` 中。这不会影响大多数代码，除非在 `shouldComponentUpdate` 中有副作用。要解决此问题，请将具有副作用的代码移到 `componentDidUpdate` 中。

- 在严格开发模式下，使用遗留上下文 API 的警告不包括触发警告的组件堆栈。此版本将丢失的堆栈添加到警告中。

- `onMouseEnter` 现在在被禁用的 `<button>` 对象上不能被触发。

- 自从我们发布 v16 以来，ReactDOM 缺少一个 `version` 导出。这个版本又添加了它。我们不建议在应用程序逻辑中使用它，但是在调试同一页面上的 ReactDOM 的不匹配/多个版本时，它非常有用。

我们感谢所有帮助揭示和解决这些和其他问题的贡献者。你可以找到完整的变更日志 [如下](#changelog)。

## 安装 {/*installation*/}

### React {/*react*/}

React v16.13.0 现在在 npm 库中已经可用。

用 Yarn 安装 React 16，运行：

```bash
yarn add react@^16.13.0 react-dom@^16.13.0
```

用 npm 安装 React 16，运行：

```bash
npm install --save react@^16.13.0 react-dom@^16.13.0
```

我们也通过 CDN 提供了 React 的 UMD 版本：

```html
<script
  crossorigin
  src="https://unpkg.com/react@16/umd/react.production.min.js"
></script>
<script
  crossorigin
  src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"
></script>
```

参考这篇文档 [详细安装说明](/docs/installation)。

## 变更日志 {/*changelog*/}

### React {/*react*/}

- 当字符串 ref 的使用方式不符合将来的代码模式时发出警告 ([@lunaruan](https://github.com/lunaruan) in [#17864](https://github.com/facebook/react/pull/17864))
- 弃用 `React.createFactory()` ([@trueadm](https://github.com/trueadm) in [#17878](https://github.com/facebook/react/pull/17878))

### React DOM {/*react-dom*/}

- `style` 中的更改可能导致意外冲突时发出警告 ([@sophiebits](https://github.com/sophiebits) 在 [#14181](https://github.com/facebook/react/pull/14181)，[#18002](https://github.com/facebook/react/pull/18002))
- 在另一个组件的 render 阶段更新 function 组件时发出警告 ([@acdlite](<(https://github.com/acdlite)>) 在 [#17099](https://github.com/facebook/react/pull/17099))
- 弃用 `unstable_createPortal` ([@trueadm](https://github.com/trueadm) 在 [#17880](https://github.com/facebook/react/pull/17880))
- 修复 `onMouseEnter` 在被禁用的按钮上被触发 ([@AlfredoGJ](https://github.com/AlfredoGJ) 在 [#17675](https://github.com/facebook/react/pull/17675))
- 在 `StrictMode` 下调用 `shouldComponentUpdate` 两次 ([@bvaughn](https://github.com/bvaughn) 在 [#17942](https://github.com/facebook/react/pull/17942))
- 增加 ReactDOM `version` 属性 ([@ealush](https://github.com/ealush) 在 [#15780](https://github.com/facebook/react/pull/15780))
- 不要调用 `dangerouslySetInnerHTML` 的 `toString()` 方法 ([@sebmarkbage](https://github.com/sebmarkbage) 在 [#17773](https://github.com/facebook/react/pull/17773))
- 在组件堆栈中展示更多警告 ([@gaearon](https://github.com/gaearon) 在 [#17922](https://github.com/facebook/react/pull/17922)，[#17586](https://github.com/facebook/react/pull/17586))

### 并发模式（实验） {/*concurrent-mode-experimental*/}

- 警告有问题的用法 `ReactDOM.createRoot()` ([@trueadm](https://github.com/trueadm) 在 [#17937](https://github.com/facebook/react/pull/17937))
- 移除 `ReactDOM.createRoot()` 回调传参并且在用法上增加了警告 ([@bvaughn](https://github.com/bvaughn) 在 [#17916](https://github.com/facebook/react/pull/17916))
- 不要将空闲/屏幕外的工作与其他工作分组 ([@sebmarkbage](https://github.com/sebmarkbage) 在 [#17456](https://github.com/facebook/react/pull/17456))
- 调整 `SuspenseList` CPU 边界启发式 ([@sebmarkbage](https://github.com/sebmarkbage) 在 [#17455](https://github.com/facebook/react/pull/17455))
- 增加丢失事件插件属性 ([@trueadm](https://github.com/trueadm) 在 [#17914](https://github.com/facebook/react/pull/17914))
- 修复 `isPending` 仅当从输入事件内部转换时为 true ([@acdlite](https://github.com/acdlite) 在 [#17382](https://github.com/facebook/react/pull/17382))
- 修复 `React.memo` 组件在被更高优先级的更新中断时删除更新 ([@acdlite](https://github.com/acdlite) 在 [#18091](https://github.com/facebook/react/pull/18091))
- 以错误的优先级暂停时不发出警告 ([@gaearon](https://github.com/gaearon) 在 [#17971](https://github.com/facebook/react/pull/17971))
- 用重定基更新修复一个 bug ([@acdlite](https://github.com/acdlite) 和 [@sebmarkbage](https://github.com/sebmarkbage) 在 [#17560](https://github.com/facebook/react/pull/17560)，[#17510](https://github.com/facebook/react/pull/17510)，[#17483](https://github.com/facebook/react/pull/17483)，[#17480](https://github.com/facebook/react/pull/17480))
