---
id: react-dom-client
title: ReactDOMClient
layout: docs
category: Reference
permalink: docs/react-dom-client.html
---

`react-dom/client` 这个包提供了专门用于初始化一个客户端应用的特有方法，你的大部分组件可能不需要这个模块。

```js
import * as ReactDOM from 'react-dom/client';
```

如果你使用 ES5 和 npm，你可以这样写:

```js
var ReactDOM = require('react-dom/client');
```

## 概览 {#overview}

下面的方法可以在客户端环境使用:

- [`createRoot()`](#createroot)
- [`hydrateRoot()`](#hydrateroot)

### 浏览器支持 {#browser-support}

React 支持所有现代浏览器，但是对于老版本浏览器需要引入 [相关polyfills依赖](/docs/javascript-environment-requirements.html)。

> 注意：
>
> 我们不支持那些不兼容 ES5 方法或者微任务的旧版浏览器，比如 Internet Explorer，但如果你的应用包含了 polyfills，例如 [es5-shim 和 es5-sham](https://github.com/es-shims/es5-shim) 你可能会发现你的应用仍然可以在这些浏览器中正常运行。但是如果你选择这种方法，你便需要孤军奋战了。

## 参考 {#reference}

### `createRoot()` {#createroot}

> Try the new React documentation for [`createRoot`](https://beta.reactjs.org/reference/react-dom/client/createRoot).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

```javascript
createRoot(container[, options]);
```

为输入的 `container` 容器创建一个 React 根节点，并且返回根节点。根节点可以用 `render` 方法来渲染一个 React 元素至 DOM 中:

```javascript
const root = createRoot(container);
root.render(element);
```

`createRoot` 接收两个可选项:
- `onRecoverableError`: 这是一个可选的回调函数，当 React 从渲染错误中恢复时就会调用。
- `identifierPrefix`: 可选的前缀，主要用于为通过 `React.useId` 钩子生成的id值添加前缀，有效的避免了当一个页面有多个根节点时的冲突，必须与服务器上的前缀相同。

根节点在调用 `unmount` 时也会被卸载:

```javascript
root.unmount();
```

> 注意:
>
> `createRoot()` 控制着你传入的容器节点内容，当调用 render 函数时容器内的所有已存 DOM 元素都会被替换掉。之后的调用会通过 React 的 diffing 算法高效更新。
>
> `createRoot()` 不修改容器节点(只调整容器内的子节点)，它可以插入一个组件至已存的 DOM 节点中，而不用覆盖已存子节点。
>
> 不能用 `createRoot()` 去hydrate(可以理解为创建)一个服务端渲染容器，应该用 [`hydrateRoot()`](#hydrateroot) 替代。

* * *

### `hydrateRoot()` {#hydrateroot}

> Try the new React documentation for [`hydrateRoot`](https://beta.reactjs.org/reference/react-dom/client/hydrateRoot).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)


```javascript
hydrateRoot(container, element[, options])
```

与 [`createRoot()`](#createroot) 一样，但是 hydrateRoot 是用来 hydrate 一个HTML内容由 [`ReactDOMServer`](/docs/react-dom-server.html) 渲染的容器，React 会尝试在已有标记上绑定事件监听器。

`hydrateRoot` 接收两个可选项:
- `onRecoverableError`: 这是一个可选的回调函数，当 React 从渲染错误中恢复时就会调用。
- `identifierPrefix`: 可选的前缀，主要用于为 `React.useId` 钩子生成的id添加前缀，有效的避免了当一个页面有多个根节点时的冲突，必须与服务器上的前缀相同。


> 注意
> 
> React 希望服务端与客户端渲染的内容完全一致。React 可以弥补文本内容的差异，但是你需要将不匹配的地方作为 bug 进行修复。在开发者模式下，React 会对 hydration 操作过程中的不匹配进行警告。但并不能保证在不匹配的情况下，修补属性的差异。由于性能的因素，这一点非常重要，因为大多数应用中不匹配的情况很少见，并且验证所有标记的成本非常昂贵。
