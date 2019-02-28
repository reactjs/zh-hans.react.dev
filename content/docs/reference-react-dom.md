---
id: react-dom
title: ReactDOM
layout: docs
category: Reference
permalink: docs/react-dom.html
---

如果你使用一个 `<script>` 标签引入 React ，所有的顶层 API 都能在全局 `ReactDOM` 上调用。如果你使用 npm 和 ES6 ，你可以用 `import ReactDOM from 'react-dom'` 。如果你使用 npm 和 ES5 ，你可以用 `var ReactDOM = require('react-dom')` 。

## 概述 {#overview}

`react-dom` 包提供了可在应用顶层使用的针对 DOM（DOM-specific）的方法，如果有需要，你可以把这些方法用作到 React 模型外面的逃生出口。不过一般情况下，你的大部分组件都不需要使用这个模块。

- [`render()`](#render)
- [`hydrate()`](#hydrate)
- [`unmountComponentAtNode()`](#unmountcomponentatnode)
- [`findDOMNode()`](#finddomnode)
- [`createPortal()`](#createportal)

### 浏览器支持 {#browser-support}

React 支持所有的现代浏览器，包括 IE9 及以上版本，但是需要为老浏览器比如 IE9 和 IE10 引入[一些 polyfills](/docs/javascript-environment-requirements.html) 。

> 注意：
>
>我们不支持那些不兼容 ES5 方法的老浏览器，但如果你的应用包含了 polyfill ，例如 [es5-shim and es5-sham](https://github.com/es-shims/es5-shim) 你可能会发现你的应用仍然可以在这些浏览器中正常运行。不过如果你选择这种方法，你便需要孤军奋战了。

* * *

## 参考 {#reference}

### `render()` {#render}

```javascript
ReactDOM.render(element, container[, callback])
```

在提供的 `container` 里渲染一个 React 元素，返回一个这个组件的[引用](/docs/more-about-refs.html)（或者为[无状态组件](/docs/components-and-props.html#functional-and-class-components)返回 `null`）。

如果 React 元素之前已经在 `container` 里渲染过，这将会进行一次更新，并且只会在必要时改变 DOM 来体现最新的 React 元素。

如果提供了可选的回调函数，回调将在组件被渲染或更新之后执行。

> 注意：
>
> `ReactDOM.render()` 会控制你提供的容器节点里的内容。当第一次调用时，容器节点里的所有 DOM 元素都会被替换，后续的调用则会使用 React 的 DOM 差分算法（DOM diffing algorithm）进行高效的更新。
>
> `ReactDOM.render()` 不会修改容器节点（只会修改容器的子节点）。你可以在不覆盖已有子节点的情况下添加一个组件到已有的 DOM 节点中去。
>
> `ReactDOM.render()` 目前会返回一个指向根 `ReactComponent` 实例的引用。但是使用返回值的这种写法来自历史遗留并且应该避免，因为在未来版本的 React 中，组件的渲染在某些情况下会是异步的。如果你真的需要一个指向根 `ReactComponent` 实例的引用，推荐的方法是添加一个 [callback ref](/docs/more-about-refs.html#the-ref-callback-attribute) 到根元素上。
>
> 使用 `ReactDOM.render()` 混合服务端渲染的容器已经废弃了，并且会在 React 17 被移除。作为替代，使用 [`hydrate()`](#hydrate)。

* * *

### `hydrate()` {#hydrate}

```javascript
ReactDOM.hydrate(element, container[, callback])

```
和 [`render()`](#render) 相同，用来混合由 [`ReactDOMServer`](/docs/react-dom-server.html) 渲染 HTML 内容的容器。React 会尝试在已有标记上绑定事件监听器。

React 期望服务端和客户端渲染的内容完全一致。React 可以弥补文本内容的差异，但是你需要将不匹配的地方作为 bug 进行修复。在开发者模式，React 会对混合过程中的不匹配进行警告。不过不能保证在不匹配的情况下，属性的不同会被修补。在性能原因上这很重要，因为大多是应用很少有不匹配的情况，所以验证所有的标记将会造成过于昂贵的性能开销。

如果一个单一元素的属性或者文本内容，在服务端和客户端之间不可避免的不同（比如：时间戳），你可以为元素添加 `suppressHydrationWarning={true}` 隐藏警告。这种方式只在一层深度上有效，而且应只作为一个逃生窗口（escape hatch）。除非是文本内容，否则不要滥用，React 不会尝试修补不同，所以在未来的更新以前，仍会保持不一致。

如果你刻意的在服务端与客户端渲染不同内容，你可以采用两遍（two-pass）渲染。在客户端渲染不同内容的组件可以读取一个 state 变量，例如 `this.state.isClient` ，你可以在 `componentDidMount()` 里将它设置为 `true` 。这种方式在初始渲染时会和服务端渲染相同的内容，避免不同。混合之后，另外的操作会同步进行。 注意，因为进行了两次渲染，这种实现会使你的组件变慢，请小心使用。

记得留意弱网络环境下的用户体验，JavaScript 代码的加载可能比初始 HTML 渲染晚的多。所以如果你只在客户端渲染不同的内容，其变化可能会有冲突。但是，如果执行顺利，在服务端渲染外壳（shell）也许是有益的，并且只需在客户端显示额外的小组件。要了解如何在避免不匹配标记问题下实现，请参考上一段的解释。

* * *

### `unmountComponentAtNode()` {#unmountcomponentatnode}

```javascript
ReactDOM.unmountComponentAtNode(container)
```
从 DOM 中移除一个已经挂载的组件，并且清除其事件处理器（event handlers）和 state 。如果指定容器上没有已挂载组件，这个函数什么也不会做。如果组件被移除将会返回 `true` ，如果没有组件可被移除将会返回 `false` 。

* * *

### `findDOMNode()` {#finddomnode}

> 注意:
> `findDOMNode` 是一个访问底层 DOM 节点的逃生窗口（escape hatch）。在大多数情况下，不鼓励使用这个方法，因为它会穿透组件的抽象结构。[严格模式下这个方法已经弃用。](/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)


```javascript
ReactDOM.findDOMNode(component)
```
如果组件已经被挂载到 DOM 上，这个方法会返回相应的原生浏览器 DOM 元素。这个方法对于从 DOM 中读取值很有用，例如表单字段的值和执行 DOM 测量（performing DOM measurements）。**大多数情况下，你可以绑定一个 ref 到 DOM 节点上，完全避免使用 findDOMNode。**

当一个组件渲染的内容是 `null` 或者 `false` 时， `findDOMNode` 返回的是 `null` 。当一个组件渲染的是字符串时，`findDOMNode` 返回的包含这个值的文本 DOM 节点。从 React 16 开始，一个组件可能会返回有多个子节点的碎片（fragment），在这个情况下，`findDOMNode` 会返回第一个非空子节点对应的 DOM 节点。

> 注意:
>
> `findDOMNode` 只在挂载的组件上可用（即，已经放置在 DOM 中的组件）。如果你尝试调用一个未挂载的组件（例如在一个还未创建的组件上调用 `render()` 中的 `findDOMNode()`）将会引发异常。
> 
> `findDOMNode` 不能用于函数式组件。

* * *

### `createPortal()` {#createportal}

```javascript
ReactDOM.createPortal(child, container)
```
创建一个入口。入口提供了一种[将子节点渲染到 DOM 节点中的方法，该节点存在于 DOM 组件的层次结构之外](/docs/portals.html)。
