---
id: react-dom-server
title: ReactDOMServer
layout: docs
category: Reference
permalink: docs/react-dom-server.html
---

`ReactDOMServer` 对象允许你将组件渲染成静态标记。通常，它被使用在 Node 服务端上：

```js
// ES modules
import * as ReactDOMServer from 'react-dom/server';
// CommonJS
var ReactDOMServer = require('react-dom/server');
```

## 概览 {#overview}

这些方法只在支持 **[Node.js Streams](https://nodejs.dev/learn/nodejs-streams) 的环境下可用：**

- [`renderToPipeableStream()`](#rendertopipeablestream)
- [`renderToNodeStream()`](#rendertonodestream) (Deprecated)
- [`renderToStaticNodeStream()`](#rendertostaticnodestream)

这些方法只在支持 **[Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) 的环境中可用**（这包含浏览器，Deno 和一些现代边缘 runtime）：

- [`renderToReadableStream()`](#rendertoreadablestream)

以下方法可以在不支持 Steam 的环境中使用：

- [`renderToString()`](#rendertostring)
- [`renderToStaticMarkup()`](#rendertostaticmarkup)

## 参考 {#reference}

### `renderToPipeableStream()` {#rendertopipeablestream}

```javascript
ReactDOMServer.renderToPipeableStream(element, options)
```

将一个 React 元素渲染为初始 HTML。返回一个带有 `pipe(res)` 方法的流，用于管道输出。`abort()` 用于中止请求。完美支持了 suspense 和 HTML 流，"延迟" 的内容块会通过内联的 `<script>` 标签嵌入。[了解更多](https://github.com/reactwg/react-18/discussions/37)

如果你在一个已经被服务端渲染标记的节点上调用 [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot)，React 会保留它，只附加事件处理程序，让你有一个非常高性能的首次加载体验。

```javascript
let didError = false;
const stream = renderToPipeableStream(
  <App />,
  {
    onShellReady() {
      // The content above all Suspense boundaries is ready.
      // If something errored before we started streaming, we set the error code appropriately.
      res.statusCode = didError ? 500 : 200;
      res.setHeader('Content-type', 'text/html');
      stream.pipe(res);
    },
    onShellError(error) {
      // Something errored before we could complete the shell so we emit an alternative shell.
      res.statusCode = 500;
      res.send(
        '<!doctype html><p>Loading...</p><script src="clientrender.js"></script>'
      );
    },
    onAllReady() {
      // If you don't want streaming, use this instead of onShellReady.
      // This will fire after the entire page content is ready.
      // You can use this for crawlers or static generation.

      // res.statusCode = didError ? 500 : 200;
      // res.setHeader('Content-type', 'text/html');
      // stream.pipe(res);
    },
    onError(err) {
      didError = true;
      console.error(err);
    },
  }
);
```

具体参见 [完整的选项列表](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-dom/src/server/ReactDOMFizzServerNode.js#L36-L46).

> 注意：
>
> 这是一个针对 Node.js 的 API。只在支持 [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) 的环境下可用，如 Deno 以及现代边缘 runtimes，应使用 [`renderToReadableStream`](#rendertoreadablestream) 代替。
>

* * *

### `renderToReadableStream()` {#rendertoreadablestream}

```javascript
ReactDOMServer.renderToReadableStream(element, options);
```

将一个 React 元素通过流的形式注入初始的 HTML 中。返回值为 Promise, resolve 一个 [可读 Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)。完美支持了 suspense 和 HTML 流。[了解更多](https://github.com/reactwg/react-18/discussions/127)

如果你在一个已经被服务端渲染标记的节点上调用 [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot)，React 会保留它，只为其附加事件处理程序。让你拥有一个非常良好的首次加载体验。

```javascript
let controller = new AbortController();
let didError = false;
try {
  let stream = await renderToReadableStream(
    <html>
      <body>Success</body>
    </html>,
    {
      signal: controller.signal,
      onError(error) {
        didError = true;
        console.error(error);
      }
    }
  );
  
  // This is to wait for all Suspense boundaries to be ready. You can uncomment
  // this line if you want to buffer the entire HTML instead of streaming it.
  // You can use this for crawlers or static generation:

  // await stream.allReady;

  return new Response(stream, {
    status: didError ? 500 : 200,
    headers: {'Content-Type': 'text/html'},
  });
} catch (error) {
  return new Response(
    '<!doctype html><p>Loading...</p><script src="clientrender.js"></script>',
    {
      status: 500,
      headers: {'Content-Type': 'text/html'},
    }
  );
}
```

具体参见 [完整的选项列表](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-dom/src/server/ReactDOMFizzServerBrowser.js#L27-L35)。

> 注意：
>
> 该 API 依赖 [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)。对于，请使用 [`renderToPipeableStream`](#rendertopipeablestream) 代替。
>

* * *

### `renderToNodeStream()`  (Deprecated) {#rendertonodestream}

```javascript
ReactDOMServer.renderToNodeStream(element)
```

将一个 React 元素渲染成其初始 HTML。返回一个可输出 HTML 字符串的 [Node.js 可读流](https://nodejs.org/api/stream.html#stream_readable_streams)。通过可读流输出的 HTML 完全等同于 [`ReactDOMServer.renderToString`](#rendertostring) 返回的 HTML。你可以使用本方法在服务器上生成 HTML，并在初始请求时将标记下发，以加快页面加载速度，并允许搜索引擎抓取你的页面以达到 SEO 优化的目的。

如果你在已有服务端渲染标记的节点上调用 [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) 方法，React 将会保留该节点且只进行事件处理绑定，从而让你有一个非常高性能的首次加载体验。

> 注意:
>
> 这个 API 仅允许在服务端使用。不允许在浏览器使用。
>
> 通过本方法返回的流会返回一个由 utf-8 编码的字节流。如果你需要另一种编码的流，请查看像 [iconv-lite](https://www.npmjs.com/package/iconv-lite) 这样的项目，它为转换文本提供了转换流。

* * *

### `renderToStaticNodeStream()` {#rendertostaticnodestream}

```javascript
ReactDOMServer.renderToStaticNodeStream(element)
```

此方法与 [`renderToNodeStream`](#rendertonodestream) 相似，但此方法不会在 React 内部创建的额外 DOM 属性，例如 `data-reactroot`。如果你希望把 React 当作静态页面生成器来使用，此方法会非常有用，因为去除额外的属性可以节省一些字节。

通过可读流输出的 HTML，完全等同于 [`ReactDOMServer.renderToStaticMarkup`](#rendertostaticmarkup) 返回的 HTML。

如果你计划在前端使用 React 以使得标记可交互，请不要使用此方法。你可以在服务端上使用 [`renderToNodeStream`](#rendertonodestream) 或在前端上使用 [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) 来代替此方法。

> 注意:
>
> 此 API 仅限于服务端使用，在浏览器中是不可用的。
>
> 通过本方法返回的流会返回一个由 utf-8 编码的字节流。如果你需要另一种编码的流，请查看像 [iconv-lite](https://www.npmjs.com/package/iconv-lite) 这样的项目，它为转换文本提供了转换流。

* * *

### `renderToString()` {#rendertostring}

```javascript
ReactDOMServer.renderToString(element)
```

将一个 React 元素渲染成其初始的 HTML。React 将返回一个 HTML 字符串。你可以使用这种方法在服务器上生产 HTML，并在初始请求中发送标记。以加快页面加载速度，并允许搜索引擎以 SEO 为目的抓取你的页面。

如果你在一个已被服务端渲染标记的节点上调用 [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot)，React 会保留它，只附加事件处理程序，让你有一个非常良好的首次加载体验。

> 注意：
>
> 此 API 对 Suspense 支持有限，并且不支持流。
>
> 在服务端，建议使用 [`renderToPipeableStream`](#rendertopipeablestream) (Node.js) 或者 [`renderToReadableStream`](#rendertoreadablestream) (for Web Streams) 代替。

* * *

### `renderToStaticMarkup()` {#rendertostaticmarkup}

```javascript
ReactDOMServer.renderToStaticMarkup(element)
```

与 [`renderToString`](#rendertostring) 相似，只是该方法不会创建 React 内部使用的额外 DOM 属性，如 `data-reactroot`。如果你只想把 React 作为简单的静态页面生成器使用，此方法会非常实用。因为剥离多余的属性可以节省一些字节占用。

如果你打算在客户端使用 React 进行交互标记，那请不要使用这个方法。作为替代，你可以在服务器使用 [`renderToString`](#rendertostring)，同时在客户端使用 [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot)。
