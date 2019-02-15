---
id: react-dom-server
title: ReactDOMServer
layout: docs
category: Reference
permalink: docs/react-dom-server.html
---

`ReactDOMServer` 类允许你将组件渲染成静态标记。通常，它被使用在 Node 服务端上：

```js
// ES modules
import ReactDOMServer from 'react-dom/server';
// CommonJS
var ReactDOMServer = require('react-dom/server');
```

## 概览 {#overview}

下面的方法可以被使用在服务端和浏览器环境。

- [`renderToString()`](#rendertostring)
- [`renderToStaticMarkup()`](#rendertostaticmarkup)

下面这些附加的方法依赖一个**只能在服务端使用**的 package（`stream`）。它们在浏览器中不起作用。

- [`renderToNodeStream()`](#rendertonodestream)
- [`renderToStaticNodeStream()`](#rendertostaticnodestream)

* * *

## 参考 {#reference}

### `renderToString()` {#rendertostring}

```javascript
ReactDOMServer.renderToString(element)
```

将一个 React 元素渲染成其初始 HTML。React 会返回一个 HTML 字符串。你可以使用本方法在服务器上生成 HTML，并在初始请求时将标记下发，以加快页面加载速度，并允许搜索引擎抓取你的页面以达到 SEO 优化的目的。

如果你在一个已经有了服务端渲染标记的节点上调用 [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) 方法，React 将会保留该节点并仅作绑定事件处理，从而让你有一个非常高性能的首次加载体验。

* * *

### `renderToStaticMarkup()` {#rendertostaticmarkup}

```javascript
ReactDOMServer.renderToStaticMarkup(element)
```

本方法与 [`renderToString`](#rendertostring) 相似，除了本方法不会创建在 React 内部使用的额外 DOM 属性，例如 `data-reactroot`。如果你希望把 React 当作一个静态页面生成器来使用，本方法会非常有用，因为除去额外的属性可以节省一些字节。

如果你计划在前端使用 React 以使得标记可交互，不要使用本方法。作为代替，在服务端上使用 [`renderToString`](#rendertostring) 和在前端上使用 [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate)。

* * *

### `renderToNodeStream()` {#rendertonodestream}

```javascript
ReactDOMServer.renderToNodeStream(element)
```

将一个 React 元素渲染成其初始 HTML。返回一个可输出 HTML 字符串的 [可读流](https://nodejs.org/api/stream.html#stream_readable_streams)。通过可读流输出的 HTML，完全等同于 [`ReactDOMServer.renderToString`](#rendertostring) 返回的 HTML。你可以使用本方法在服务器上生成 HTML，并在初始请求时将标记下发，以加快页面加载速度，并允许搜索引擎抓取你的页面以达到 SEO 优化的目的。

如果你在一个已经有了服务端渲染标记的节点上调用 [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) 方法，React 将会保留该节点并仅作绑定事件处理，从而让你有一个非常高性能的首次加载体验。

> 注意:
>
> 这个 API 仅允许在服务端使用。不允许在浏览器使用。
> 通过本方法返回的流会返回一个由 utf-8 编码的字节流。如果你需要另一种编码的流，请查看像 [iconv-lite](https://www.npmjs.com/package/iconv-lite) 这样的项目，它为转换文本提供了转换流。


* * *

### `renderToStaticNodeStream()` {#rendertostaticnodestream}

```javascript
ReactDOMServer.renderToStaticNodeStream(element)
```

本方法与 [`renderToNodeStream`](#rendertonodestream) 相似，除了本方法不会创建在 React 内部使用的额外 DOM 属性，例如 `data-reactroot`。如果你希望把 React 当作一个静态页面生成器来使用，本方法会非常有用，因为除去额外的属性可以节省一些字节。

通过可读流输出的 HTML，完全等同于 [`ReactDOMServer.renderToString`](#rendertostring) 返回的 HTML。

如果你计划在前端使用 React 以使得标记可交互，不要使用本方法。作为代替，在服务端上使用 [`renderToNodeStream`](#rendertonodestre上) 和在前端上使用 [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate)。

> 注意:
>
> 这个 API 仅允许在服务端使用。不允许在浏览器使用。
> 通过本方法返回的流会返回一个由 utf-8 编码的字节流。如果你需要另一种编码的流，请查看像 [iconv-lite](https://www.npmjs.com/package/iconv-lite) 这样的项目，它为转换文本提供了转换流。
