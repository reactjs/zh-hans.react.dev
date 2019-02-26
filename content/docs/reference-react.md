---
id: react-api
title: React 顶层 API
layout: docs
category: Reference
permalink: docs/react-api.html
redirect_from:
  - "docs/reference.html"
  - "docs/clone-with-props.html"
  - "docs/top-level-api.html"
  - "docs/top-level-api-ja-JP.html"
  - "docs/top-level-api-ko-KR.html"
  - "docs/top-level-api-zh-CN.html"
---

`React` 是 React 库的入口。如果你通过使用 `<script>` 标签的方式来加载 React，则可以通过 `React` 全局变量对象来获得 React 的顶层 API。当你使用 ES6 与 npm 时，可以通过编写 `import React from 'react'` 来引入它们。当你使用 ES5 与 npm 时，则可以通过编写 `var React = require('react')` 来引入它们。

## 概览 {#overview}

### 组件 {#components}

通过使用 React 组件，让你可以将 UI 拆分为独立可复用的片段，并将它们作为相互独立的部分进行考虑。你可以通过子类 `React.Component` 或 `React.PureComponent` 来定义 React 组件。

 - [`React.Component`](#reactcomponent)
 - [`React.PureComponent`](#reactpurecomponent)

如果你不使用 ES6 的 class，则可以使用 `create-react-class` 模块来替代。详见 [不使用 ES6](/docs/react-without-es6.html) 获取更多详细信息。

React 组件也可以被定义为可被包装的函数：

- [`React.memo`](#reactmemo)

### 创建 React 元素 {#creating-react-elements}

我们建议 [使用 JSX](/docs/introducing-jsx.html) 来描述您的 UI 外观。每个 JSX 元素都仅仅是调用 [`React.createElement()`](#createelement) 的语法糖。一般来说，只要你使用了 JSX，那就不再需要直接调用以下方法。

- [`createElement()`](#createelement)
- [`createFactory()`](#createfactory)

详见 [不使用 JSX](/docs/react-without-jsx.html) 获取更多详细信息。

### 转换元素 {#transforming-elements}

`React` 提供了几个用于操作元素的 API：

- [`cloneElement()`](#cloneelement)
- [`isValidElement()`](#isvalidelement)
- [`React.Children`](#reactchildren)

### Fragments {#fragments}

`React` 还提供了一个不使用包装元素就可以渲染多个元素的组件。

- [`React.Fragment`](#reactfragment)

### Refs {#refs}

- [`React.createRef`](#reactcreateref)
- [`React.forwardRef`](#reactforwardref)

### Suspense {#suspense}

Suspense 让组件能够在“等待”一些操作后再进行渲染。在目前阶段，Suspense 仅支持一个使用场景：[使用 `React.lazy` 动态加载组件](/docs/code-splitting.html#reactlazy)。未来它将会支持包括数据获取在内的其它使用场景。

- [`React.lazy`](#reactlazy)
- [`React.Suspense`](#reactsuspense)

### Hooks {#hooks}

*Hooks* 是在 React 16.8 中新引入的概念。它们允许你在不使用 class 来定义组件的情况下使用 state 和其他 React 功能。Hooks 有其 [专用文档部分](/docs/hooks-intro.html) 和单独的 API 参考：

- [基础 Hooks](/docs/hooks-reference.html#basic-hooks)
  - [`useState`](/docs/hooks-reference.html#usestate)
  - [`useEffect`](/docs/hooks-reference.html#useeffect)
  - [`useContext`](/docs/hooks-reference.html#usecontext)
- [额外的 Hooks](/docs/hooks-reference.html#additional-hooks)
  - [`useReducer`](/docs/hooks-reference.html#usereducer)
  - [`useCallback`](/docs/hooks-reference.html#usecallback)
  - [`useMemo`](/docs/hooks-reference.html#usememo)
  - [`useRef`](/docs/hooks-reference.html#useref)
  - [`useImperativeHandle`](/docs/hooks-reference.html#useimperativehandle)
  - [`useLayoutEffect`](/docs/hooks-reference.html#uselayouteffect)
  - [`useDebugValue`](/docs/hooks-reference.html#usedebugvalue)

* * *

## 参考 {#reference}

### `React.Component` {#reactcomponent}

`React.Component` 是使用 [ES6 classes](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes) 方式定义的 React 组件的基类：

```javascript
class Greeting extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

请参阅 [React.Component API 参考](/docs/react-component.html) 以获取与基类 `React.Component` 相关的方法和属性的详细列表。

* * *

### `React.PureComponent` {#reactpurecomponent}

`React.PureComponent` 与 [`React.Component`](#reactcomponent) 很相似。 两者的区别在于 [`React.Component`](#reactcomponent) 并不实现 [`shouldComponentUpdate()`](/docs/react-component.html#shouldcomponentupdate), 而 `React.PureComponent` 中以浅层对比 prop 和 state 的方式来实现它。

如果你的 React 组件中的 `render()` 函数在给定相同的 props 和 state 的情况下呈现相同的结果，那么可根据实际情况使用 `React.PureComponent` 来提高性能表现。

> 注意
>
> `React.PureComponent` 中的 `shouldComponentUpdate()` 仅作对象的浅层比较。如果这些对象内包含复杂的数据结构，则有可能因为更深层次的差别无法被察觉而产生出错误的比对结果。仅当你期望简单的 props 和 state，或者说当你知道深层数据结构发生了变化时使用 [`forceUpdate()`](/docs/react-component.html#forceupdate)，亦或是考虑使用 [immutable objects](https://facebook.github.io/immutable-js/) 来促进嵌套数据的快速比较等这些场景下，才适合使用 `React.PureComponent`。
>
> 此外，`React.PureComponent` 中的 `shouldComponentUpdate()` 将跳过所有子组件树的 prop 更新。因此，请确保所有子组件也都是“纯净”的组件。

* * *

### `React.memo` {#reactmemo}

```javascript
const MyComponent = React.memo(function MyComponent(props) {
  /* 使用 props 渲染 */
});
```

`React.memo` 是一个 [高阶组件](/docs/higher-order-components.html)。它与 [`React.PureComponent`](#reactpurecomponent) 非常相似，但它是面向函数组件而不是 class 组件的。

如果你的函数组件在给定相同 props 的情况下渲染相同的结果，那么你可以通过将其包装在 `React.memo` 中调用，以此通过记忆组件渲染结果的方式来提高组件的性能表现。这意味着在这种情况下，React 将跳过渲染组件的操作并直接复用最近一次渲染的结果。

默认情况下其只会对复杂对象做浅层对比，如果你想要控制对比过程，那么请将自定义的比较函数通过第二个参数传入来实现。

```javascript
function MyComponent(props) {
  /* 使用 props 渲染 */
}
function areEqual(prevProps, nextProps) {
  /*
  如果把 nextProps 传入 render 方法的返回结果与
  将 prevProps 传入 render 方法的返回结果一致则返回 true，
  否则返回 false
  */
}
export default React.memo(MyComponent, areEqual);
```

这个方法仅作为 **[性能优化](/docs/optimizing-performance.html)** 手段而存在。请不要依靠它来“阻止”渲染，因为这会导致 bug。

> 注意
>
> 与 class 组件上 [`shouldComponentUpdate()`](/docs/react-component.html#shouldcomponentupdate) 方法不同的是, `areEqual` 函数在 props 相等的情况下返回 `true`，在 props 不相等的情况下返回 `false`。与 `shouldComponentUpdate` 方法的表现是相反的。

* * *

### `createElement()` {#createelement}

```javascript
React.createElement(
  type,
  [props],
  [...children]
)
```

创建和返回一个新的指定类型的 [React 元素](/docs/rendering-elements.html)。其中的类型参数既可以是一个标签名字符串（像是 `'div'` 或 `'span'`），也可以是 [React 组件](/docs/components-and-props.html) 类型 （class 组件或函数组件），还可以是一个 [React fragment](#reactfragment) 类型。

使用 [JSX](/docs/introducing-jsx.html) 编写的代码将会被转换成使用 `React.createElement()` 的形式。只要使用了 JSX 方式，那么一般来说你不需要直接调用 `React.createElement()`。详见 [不使用 JSX](/docs/react-without-jsx.html) 获得更多信息。

* * *

### `cloneElement()` {#cloneelement}

```javascript
React.cloneElement(
  element,
  [props],
  [...children]
)
```

以 `element` 为样板克隆并返回一个新的 React 元素。结果元素的 props 将会是将新的 props 浅层合并入原始元素的 props 后的结果。新的子元素将取代现有的子元素，而来自原始元素的 `key` 和 `ref` 将被保留。

`React.cloneElement()` 几乎等同于：

```js
<element.type {...element.props} {...props}>{children}</element.type>
```

但是，这样做也保留了组件的 `ref`。也就是说，如果被克隆组件的子节点上包含 `ref`，你将不会错误地从你的父节点上窃取它。相同的 `ref` 将添加至克隆后的新元素。

引入此 API 是为了替换已弃用的 `React.addons.cloneWithProps()`。

* * *

### `createFactory()` {#createfactory}

```javascript
React.createFactory(type)
```

返回一个用于生成给定类型的 React 元素的函数。与 [`React.createElement()`](#createElement) 相似的是，类型参数既可以是一个标签名字符串（像是 `'div'` 或 `'span'`），也可以是 [React 组件](/docs/components-and-props.html) 类型 （class 组件或函数组件），还可以是一个 [React fragment](#reactfragment) 类型。

这个辅助函数已废弃，建议使用 JSX 或直接调用 `React.createElement()` 来替代它。

如果你使用 JSX，那么一般来说你不需要直接调用 `React.createFactory()`。详见 [不使用 JSX](/docs/react-without-jsx.html) 获得更多信息。

* * *

### `isValidElement()` {#isvalidelement}

```javascript
React.isValidElement(object)
```

验证对象是否是一个 React 元素，返回 `true` 或是 `false`。

* * *

### `React.Children` {#reactchildren}

`React.Children` 提供了用于处理 `this.props.children` 不透明数据结构的实用方法。

#### `React.Children.map` {#reactchildrenmap}

```javascript
React.Children.map(children, function[(thisArg)])
```

在 `children` 里的每个直接子节点上调用一个函数，并将 `this` 设置为 `thisArg`。如果 `children` 是一个数组，它将被遍历并且将为数组中的每个子节点调用该函数。如果子节点为 `null` 或是 `undefined`，则此方法将返回 `null` 或是 `undefined` 而不是返回一个数组。

> 注意
>
> 如果 `children` 是一个 `Fragment` 对象，则它将被视为单一子节点的情况处理，并且不会被遍历。

#### `React.Children.forEach` {#reactchildrenforeach}

```javascript
React.Children.forEach(children, function[(thisArg)])
```

与 [`React.Children.map()`](#reactchildrenmap) 类似，但它不会返回一个数组。

#### `React.Children.count` {#reactchildrencount}

```javascript
React.Children.count(children)
```

返回 `children` 中的组件总数量，等同于调用传递给 `map` 或 `forEach` 的回调函数的次数。

#### `React.Children.only` {#reactchildrenonly}

```javascript
React.Children.only(children)
```

验证 `children` 只有一个子节点（一个 React 元素）并返回它。否则此方法将会抛出一个错误。

> 注意：
>
>`React.Children.only()` 不接受 [`React.Children.map()`](#reactchildrenmap) 的返回值，因为它不是一个 React 元素而是一个数组。

#### `React.Children.toArray` {#reactchildrentoarray}

```javascript
React.Children.toArray(children)
```

将 `children` 这个不透明数据结构以对象数组的方式展开并返回，并为每个子节点分配一个键。如果你想要在渲染方法中操作子节点的集合的话，它将会非常实用，特别是当你想要在向下传递 `this.props.children` 之前对内容重新排序或取子集时。

> 注意：
>
> `React.Children.toArray()` 在展开子节点列表时更改键以保留嵌套数组的语义。也就是说，`toArray` 为返回数组中的每个键添加前缀，以便让每个元素的键的范围都限定在这个函数的入参数组对象内。

* * *

### `React.Fragment` {#reactfragment}

`React.Fragment` 组件使得你能够在不用创建多余的 DOM 元素的情况下在 `render()` 方法中返回多个元素。

```javascript
render() {
  return (
    <React.Fragment>
      Some text.
      <h2>A heading</h2>
    </React.Fragment>
  );
}
```

你也可以使用它的简写语法 `<></>`。更多相关信息，详见 [React v16.2.0: Fragments 支持改进](/blog/2017/11/28/react-v16.2.0-fragment-support.html)。


### `React.createRef` {#reactcreateref}

`React.createRef` 创建一个能够通过 ref 属性附加到 React 元素的 [ref](/docs/refs-and-the-dom.html)。
`embed:16-3-release-blog-post/create-ref-example.js`

### `React.forwardRef` {#reactforwardref}

`React.forwardRef` 创建一个React组件，这个组件能够将它接受的的 [ref](/docs/refs-and-the-dom.html) 属性转发到其组件树下一级的另一个组件中。这种技术并不常见，但在以下两种场景中特别有用：

* [转发 refs 到 DOM 组件](/docs/forwarding-refs.html#forwarding-refs-to-dom-components)
* [在高阶组件中转发 refs](/docs/forwarding-refs.html#forwarding-refs-in-higher-order-components)

`React.forwardRef` 接受一个渲染函数作为参数。React 将使用 `props` 和 `ref` 作为两个参数来调用这个函数。这个函数应返回一个 React 节点。

`embed:reference-react-forward-ref.js`

在上面的示例中，React将 `<FancyButton ref = {ref}>` 元素的 `ref` 作为第二个参数传递给 `React.forwardRef` 调用中的渲染函数。该渲染函数将 `ref` 传递给 `<button ref = {ref}>` 元素。

因此，在 React 附加了 ref 属性之后，`ref.current` 将直接指向 `<button>` DOM 元素实例。

更多相关信息，详见 [refs 转发](/docs/forwarding-refs.html)。

### `React.lazy` {#reactlazy}

`React.lazy()` 允许你定义一个动态加载的组件。这有助于缩减 bundle 的体积，并延迟加载在初次渲染时未用到的组件。

你可以从我们的 [代码分割文档](/docs/code-splitting.html#reactlazy) 中学习如何使用它。你可能还想查看 [这篇文章](https://medium.com/@pomber/lazy-loading-and-preloading-components-in-react-16-6-804de091c82d) 来了解它的更多用法细节。

```js
// 这个组件是动态加载的
const SomeComponent = React.lazy(() => import('./SomeComponent'));
```

请注意，渲染 `lazy` 组件需要该组件渲染树的上层有一个 `<React.Suspense>` 组件。它用于标记组件的加载方式。

> **注意**
>
> 使用 `React.lazy` 的动态引入特性需要在 JS 环境中使用 Promise。在 IE11 及以下版本浏览器中使用这个特性需要 polyfill。

### `React.Suspense` {#reactsuspense}

`React.Suspense` 让你指定加载方式，以防它下面的树中的某些子组件尚未具备渲染条件。目前，延迟加载组件是 `<React.Suspense>` 支持的 **唯一** 用例：

```js
// 该组件是动态加载的
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    // 显示 <Spinner> 组件直至 OtherComponent 加载完成
    <React.Suspense fallback={<Spinner />}>
      <div>
        <OtherComponent />
      </div>
    </React.Suspense>
  );
}
```

它已被收录在了我们的 [代码分割指南](/docs/code-splitting.html#reactlazy) 中。请注意，`lazy` 组件可以位于 `Suspense` 组件树的深处 -- 它不必包装树中的每一个延迟加载组件。最佳实践是将 `<Suspense>` 置于你想要的加载指示器的位置，而在任何你想要做代码分割的地方使用 `lazy()`。

虽然现在还不支持，但未来我们计划让 `Suspense` 支持包括数据获取在内的更多使用场景。你可以在 [我们的路线图](/blog/2018/11/27/react-16-roadmap.html) 中了解相关信息。

>注意:
>
>`React.lazy()` 和 `<React.Suspense>` 尚未在 `ReactDOMServer` 中支持。这是一个已知的局限性，将会在未来解决。
