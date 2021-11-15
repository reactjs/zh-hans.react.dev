---
title: 'React v16.6.0：lazy，memo 以及 contextType'
author: [sebmarkbage]
---

今天我们发布了 React 16.6 版本，其中包含一些便利的新功能。例如为函数组件提供了类似于 PureComponent/shouldComponentUpdate 的方式，还有使用 Suspense 进行拆分代码以及在 class 组件中更简单使用 context 的方式。

更多详情可以查阅下面的更新[日志](#changelog)。

## [`React.memo`](/docs/react-api#reactmemo) {/*reactmemo*/}

过去，我们使用 [`PureComponent`](/docs/react-api#reactpurecomponent) 或是 [`shouldComponentUpdate`](/docs/react-component#shouldcomponentupdate) 来解决 class 组件在 props 不变时会重新渲染的问题。如今，你可以通过用 [`React.memo`](/docs/react-api#reactmemo) 包裹函数组件使其获得同样的能力。

```js
const MyComponent = React.memo(function MyComponent(props) {
  /* 仅在 props 发生改变时才会 rerenders */
});
```

## [`React.lazy`](/docs/code-splitting#reactlazy): 依赖 `Suspense` 进行代码分割 {/*reactlazy-code-splitting-with-suspense*/}

您可能已经阅读过了 [Dan 在冰岛的 JSConf 上关于 React Suspense 的演讲](/blog/2018/03/01/sneak-peek-beyond-react-16)。现在，您可以通过 `React.lazy()` 包装动态加载的组件的方式使用 Suspense 来进行 [代码分割](/docs/code-splitting#reactlazy) 了。

```js
import React, {lazy, Suspense} from 'react';
const OtherComponent = lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OtherComponent />
    </Suspense>
  );
}
```

今后，Suspense 组件还会允许库作者们开发具备 Suspense 支持的数据获取功能。

> 注意：这项功能尚不可用于服务器端渲染，将在稍后的版本中支持。

## [`static contextType`](/docs/context#classcontexttype) {/*static-contexttype*/}

在 [React 16.3](/blog/2018/03/29/react-v-16-3) 中我们引入了官方发布的 Context API 来替代过去的 [Legacy Context](/docs/legacy-context)。

```js
const MyContext = React.createContext();
```

我们收到了一些关于难以在 class 组件中使用 context 的反馈，因此我们添加了便捷的 API 以便于[在 class 组件中使用 context 的值](/docs/context#classcontexttype).

```js
class MyClass extends React.Component {
  static contextType = MyContext;
  componentDidMount() {
    let value = this.context;
    /* 在首次挂载后使用 MyContext 执行副作用*/
  }
  componentDidUpdate() {
    let value = this.context;
    /* ... */
  }
  componentWillUnmount() {
    let value = this.context;
    /* ... */
  }
  render() {
    let value = this.context;
    /* 基于 MyContext 的值 render 某些内容*/
  }
}
```

## [`static getDerivedStateFromError()`](/docs/react-component#static-getderivedstatefromerror) {/*static-getderivedstatefromerror*/}

React 16 引入了[错误边界](/blog/2017/07/26/error-handling-in-react-16)来捕获在 React 的 render 中抛出的异常。我们已经拥有了在错误发生后被调用的生命周期方法 `componentDidCatch`。您可以通过它将错误记录到服务器，这非常有用。同时您还可以通过调用 `setState` 来展示对用户更友好的界面。

在 `componentDidCatch` 被触发之前，我们 render `null` 来替代抛出异常树。但这有时会破坏不期望该组件的 ref 为空的父组件。同时这个方法也无法帮助我们恢复服务端发生的异常， 因为 `Did` 这个生命周期方法不会在服务端渲染时被触发。

我们正在添加另一个错误捕获的方法，允许您在 render 完成之前回退 UI。请参阅文档 [`getDerivedStateFromError()`](/docs/react-component#static-getderivedstatefromerror).

> 注意: `getDerivedStateFromError()` 尚不可用于服务端渲染。它被设计为在将来的版本中支持服务端渲染。我们提前发布，只是为了让您可以开始准备如何使用它。

## 在 StrictMode 中被弃用的 {/*deprecations-in-strictmode*/}

在 [16.3](/blog/2018/03/29/react-v-16-3#strictmode-component) 中我们介绍了 [`StrictMode`](/docs/strict-mode) 组件。它允许您选择对可能在将来导致问题的模式进行提前预警。

我们在 `StrictMode` 的弃用 API 列表中再次添加了两个 API。如果您不使用`StrictMode` 则无需担忧；这些警告不会影响到您。

- **ReactDOM.findDOMNode()** - 这个 API 经常被误解与滥用。它在 React 16 中可能会出乎意料地慢。请[查阅文档](/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)以获得可能的升级方式。
- **Legacy Context** 使用 contextTypes 以及 getChildContext 的 Legacy context 使 React 变得比它所需要更大更慢。这就是为什么我们强烈期望您升级到 [新的 context API](/docs/context.html)。希望添加 [`contextType`](/docs/context.html#classcontexttype) API 能够改善这一切。

如果您在升级时遇到问题，我们希望听到您的反馈意见。

## 安装 {/*installation*/}

npm 的源中提供了 React v16.6.0。

要使用 Yarn 安装 React 16，请运行：

```bash
yarn add react@^16.6.0 react-dom@^16.6.0
```

要使用 npm 安装 React 16，请运行：

```bash
npm install --save react@^16.6.0 react-dom@^16.6.0
```

我们还通过 CDN 提供了 React 的 UMD 版本：

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

更详细 [安装说明](/docs/installation)，请参阅文档。

## 更新日志 {/*changelog*/}

### React {/*react*/}

- 添加 `React.memo()` 作为 `PureComponent` 在函数组件中的替代品。 ([@acdlite](https://github.com/acdlite) 在 [#13748](https://github.com/facebook/react/pull/13748))
- 添加 `React.lazy()` 以支持代码拆分组件。 ([@acdlite](https://github.com/acdlite) 在 [#13885](https://github.com/facebook/react/pull/13885))
- `React.StrictMode` 现在会警告使用旧的 context API。 ([@bvaughn](https://github.com/bvaughn) 在 [#13760](https://github.com/facebook/react/pull/13760))
- `React.StrictMode` 现在会警告使用 `findDOMNode`。 ([@sebmarkbage](https://github.com/sebmarkbage) 在 [#13841](https://github.com/facebook/react/pull/13841))
- 重命名 `unstable_AsyncMode` 为 `unstable_ConcurrentMode`。 ([@trueadm](https://github.com/trueadm) 在 [#13732](https://github.com/facebook/react/pull/13732))
- 重命名 `unstable_Placeholder` 为 `Suspense`，`delayMs` 为 `maxDuration`。 ([@gaearon](https://github.com/gaearon) 在 [#13799](https://github.com/facebook/react/pull/13799) 和 [@sebmarkbage](https://github.com/sebmarkbage) 在 [#13922](https://github.com/facebook/react/pull/13922))

### React DOM {/*react-dom*/}

- 为 `contextType` 添加了在 class 组件中更人性化的订阅方式。 ([@bvaughn](https://github.com/bvaughn) 在 [#13728](https://github.com/facebook/react/pull/13728))
- 添加 `getDerivedStateFromError` 生命周期方法以在将来的异步服务器端渲染中捕获错误。 ([@bvaughn](https://github.com/bvaughn) 在 [#13746](https://github.com/facebook/react/pull/13746))
- 当使用 `<Context>` 而不是 `<Context.Consumer>` 时，给予警告。 ([@trueadm](https://github.com/trueadm) 在 [#13829](https://github.com/facebook/react/pull/13829))
- 修复iOS Safari上的灰色覆盖层。 ([@philipp-spiess](https://github.com/philipp-spiess) 在 [#13778](https://github.com/facebook/react/pull/13778))
- 修复在开发中覆盖了 `window.event` 的错误。 ([@sergei-startsev](https://github.com/sergei-startsev) 在 [#13697](https://github.com/facebook/react/pull/13697))

### React DOM Server {/*react-dom-server*/}

- 添加 `React.memo()` 支持。 ([@alexmckenley](https://github.com/alexmckenley) 在 [#13855](https://github.com/facebook/react/pull/13855))
- 添加 `contextType` 支持。 ([@alexmckenley](https://github.com/alexmckenley) 和 [@sebmarkbage](https://github.com/sebmarkbage) 在 [#13889](https://github.com/facebook/react/pull/13889))

### Scheduler (实验阶段) {/*scheduler-experimental*/}

- 将包重命名为 `scheduler`。 ([@gaearon](https://github.com/gaearon) 在 [#13683](https://github.com/facebook/react/pull/13683))
- 支持优先级，延续和包装回调。 ([@acdlite](https://github.com/acdlite) 在 [#13720](https://github.com/facebook/react/pull/13720) and [#13842](https://github.com/facebook/react/pull/13842))
- 改进非DOM环境中的回退机制。 ([@acdlite](https://github.com/acdlite) 在 [#13740](https://github.com/facebook/react/pull/13740))
- 提前安排 `requestAnimationFrame`。 ([@acdlite](https://github.com/acdlite) 在 [#13785](https://github.com/facebook/react/pull/13785))
- 修复DOM检测，使之更为彻底。 ([@trueadm](https://github.com/trueadm) 在 [#13731](https://github.com/facebook/react/pull/13731))
- 通过交互跟踪修复错误。 ([@bvaughn](https://github.com/bvaughn) 在 [#13590](https://github.com/facebook/react/pull/13590))
- 在包中添加 `envify` 转换。 ([@mridgway](https://github.com/mridgway) 在 [#13766](https://github.com/facebook/react/pull/13766))
