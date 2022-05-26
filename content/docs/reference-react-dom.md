---
id: react-dom
title: ReactDOM
layout: docs
category: Reference
permalink: docs/react-dom.html
---

`react-dom` 包提供了用户 DOM 的特定方法，可以在你应用程序的顶层进行使用，如果你有需要的话，还可以作为应急方案，在 React 模型以外的地方使用。

```js
import * as ReactDOM from 'react-dom';
```

如果你使用 npm 和 ES5，你可以用：

```js
var ReactDOM = require('react-dom');
```

`react-dom` 包还提供了客户端和服务器应用程序的特定模块：
- [`react-dom/client`](/docs/react-dom-client.html)
- [`react-dom/server`](/docs/react-dom-server.html)

## 概览 {#overview}

`react-dom` 包导出了如下这些方法：
- [`createPortal()`](#createportal)
- [`flushSync()`](#flushsync)

如下这些方法也会被 `react-dom` 导出，但会被认为是遗弃：
- [`render()`](#render)
- [`hydrate()`](#hydrate)
- [`findDOMNode()`](#finddomnode)
- [`unmountComponentAtNode()`](#unmountcomponentatnode)

> 注意：
>
> 在 React 18，`render` 和 `hydrate` 都被新的 [客户端方法](/docs/react-dom-client.html) 所取代。这些方法将警告你的应用程序将表现得像运行 React 17 一样（欲了解更多请参阅 [此处](https://reactjs.org/link/switch-to-createroot)）。

### 浏览器支持 {#browser-support}

React 支持所有的现代浏览器，尽管对于旧版本来说，可能需要引入 [相关的 polyfills 依赖](/docs/javascript-environment-requirements.html)。

> 注意：
>
>我们不支持那些不兼容 ES5 方法的旧版浏览器，但如果你的应用包含了 polyfill，例如 [es5-shim 和 es5-sham](https://github.com/es-shims/es5-shim) 你可能会发现你的应用仍然可以在这些浏览器中正常运行。但是如果你选择这种方法，你便需要孤军奋战了。

## 参考 {#reference}

### `createPortal()` {#createportal}

```javascript
createPortal(child, container)
```

创建 portal。[Portal](/docs/portals.html) 提供了一种将子节点渲染到已 DOM 节点中的方式，该节点存在于 DOM 组件的层次结构之外。

### `flushSync()` {#flushsync}

```javascript
flushSync(callback)
```

强制 React 同步刷新提供的回调函数中的任何更新。这确保了 DOM 会被立即 更新。

```javascript
// Force this state update to be synchronous.
flushSync(() => {
  setCount(count + 1);
});
// By this point, DOM is updated.
```

> 注意：
> 
> `flushSync` 会对性能产生很大影响。尽量少用。
> 
> `flushSync` 可能会迫使悬而未决的 Suspense 边界显示其 `fallback` 的状态。
> 
> `flushSync` 也可以运行待定副作用，并在返回之前同步应用它们所包含的任何更新。
> 
> 当需要刷新内部的更新时，`flushSync` 也可以在回调外部刷新更新。例如，如果有来自点击的未决更新。React 可能会在刷新回调之前刷新这些更新。

## 遗留方法参考 {#legacy-reference}
### `render()` {#render}
```javascript
render(element, container[, callback])
```

> 注意：
>
> 在 React 18 中，`render` 函数已被 `createRoot` 函数所取代。具体请参阅 [createRoot](/docs/react-dom-client.html#createroot) 以了解更多。

在提供的 `container` 里渲染一个 React 元素，并返回对该组件的[引用](/docs/more-about-refs.html)（或者针对[无状态组件](/docs/components-and-props.html#function-and-class-components)返回 `null`）。

如果 React 元素之前已经在 `container` 里渲染过，这将会对其执行更新操作，并仅会在必要时改变 DOM 以映射最新的 React 元素。

如果提供了可选的回调函数，该回调将在组件被渲染或更新之后被执行。

> 注意：
>
> `render()` 会控制你传入容器节点里的内容。当首次调用时，容器节点里的所有 DOM 元素都会被替换，后续的调用则会使用 React 的 DOM 差分算法（DOM diffing algorithm）进行高效的更新。
>
> `render()` 不会修改容器节点（只会修改容器的子节点）。可以在不覆盖现有子节点的情况下，将组件插入已有的 DOM 节点中。
>
> `render()` 目前会返回对根组件 `ReactComponent` 实例的引用。
> 但是，目前应该避免使用返回的引用，因为它是历史遗留下来的内容，而且在未来版本的 React 中，组件渲染在某些情况下可能会是异步的。
> 如果你真的需要获得对根组件 `ReactComponent` 实例的引用，那么推荐为根元素添加 [callback ref](/docs/refs-and-the-dom.html#callback-refs)。
>
> 使用 `render()` 对服务端渲染容器进行 hydrate 操作的方式已经被废弃，并且会在 React 17 被移除。作为替代，请使用 [`hydrateRoot()`](#hydrateroot)。

* * *

### `hydrate()` {#hydrate}

```javascript
hydrate(element, container[, callback])
```

> 注意：
>
> 在 React 18 中，请使用 `hydrateRoot` 来替代 `hydrate`。请参阅 [hydrateRoot](/docs/react-dom-client.html#hydrateroot) 以了解更多。

与 [`render()`](#render) 相同，但它用于在 [`ReactDOMServer`](/docs/react-dom-server.html) 渲染的容器中对 HTML 的内容进行 hydrate 操作。React 会尝试在已有标记上绑定事件监听器。

React 希望服务端与客户端渲染的内容完全一致。React 可以弥补文本内容的差异，但是你需要将不匹配的地方作为 bug 进行修复。在开发者模式下，React 会对 hydration 操作过程中的不匹配进行警告。但并不能保证在不匹配的情况下，修补属性的差异。由于性能的关系，这一点非常重要，因为大多是应用中不匹配的情况很少见，并且验证所有标记的成本非常昂贵。

如果单个元素的属性或者文本内容，在服务端和客户端之间有无法避免差异（比如：时间戳），则可以为元素添加 `suppressHydrationWarning={true}` 来消除警告。这种方式只在一级深度上有效，应只作为一种应急方案（escape hatch）。请不要过度使用！除非它是文本内容，否则 React 仍不会尝试修补差异，因此在未来的更新之前，仍会保持不一致。

如果你执意要在服务端与客户端渲染不同内容，你可以采用双重（two-pass）渲染。在客户端渲染不同内容的组件可以读取类似于 `this.state.isClient` 的 state 变量，你可以在 `componentDidMount()` 里将它设置为 `true`。这种方式在初始渲染过程中会与服务端渲染相同的内容，从而避免不匹配的情况出现，但在 hydration 操作之后，会同步进行额外的渲染操作。注意，因为进行了两次渲染，这种方式会使得组件渲染变慢，请小心使用。

记得保证弱网环境下的用户体验。JavaScript 代码的加载要比最初的 HTML 渲染晚的多。因此如果你只在客户端渲染不同的内容，其转换可能会不稳定。但是，如果执行顺利，那么在服务端负责渲染的 shell 会对渲染提供帮助，并且只显示客户端上额外的小组件。欲了解如何在不出现标记不匹配的情况下执行此操作，请参考上一段的解释。

* * *

### `unmountComponentAtNode()` {#unmountcomponentatnode}

```javascript
unmountComponentAtNode(container)
```

> 注意：
>
> 在 React 18 中，`unmountComponentAtNode` 已被 `root.unmount()` 取代。具体请参阅 [createRoot](/docs/react-dom-client.html#createroot) 以了解更多。

从 DOM 中卸载组件，会将其事件处理器（event handlers）和 state 一并清除。如果指定容器上没有对应已挂载的组件，这个函数什么也不会做。如果组件被移除将会返回 `true`，如果没有组件可被移除将会返回 `false`。

* * *

### `findDOMNode()` {#finddomnode}

> 注意:
>
> `findDOMNode` 是一个访问底层 DOM 节点的应急方案（escape hatch）。在大多数情况下，不推荐使用该方法，因为它会破坏组件的抽象结构。[严格模式下该方法已弃用。](/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)

```javascript
findDOMNode(component)
```
如果组件已经被挂载到 DOM 上，此方法会返回浏览器中相应的原生 DOM 元素。此方法对于从 DOM 中读取值很有用，例如获取表单字段的值或者执行 DOM 检测（performing DOM measurements）。**大多数情况下，你可以绑定一个 ref 到 DOM 节点上，可以完全避免使用 findDOMNode。**

当组件渲染的内容为 `null` 或 `false` 时，`findDOMNode` 也会返回 `null`。当组件渲染的是字符串时，`findDOMNode` 返回的是字符串对应的 DOM 节点。从 React 16 开始，组件可能会返回有多个子节点的 fragment，在这种情况下，`findDOMNode` 会返回第一个非空子节点对应的 DOM 节点。

> 注意:
>
> `findDOMNode` 只在已挂载的组件上可用（即，已经放置在 DOM 中的组件）。如果你尝试调用未挂载的组件（例如在一个还未创建的组件上调用 `render()` 中的 `findDOMNode()`）将会引发异常。
>
> `findDOMNode` 不能用于函数组件。

* * *
