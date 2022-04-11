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

以下方法仅在 **带有 [Node.js Streams](https://nodejs.dev/learn/nodejs-streams) 的环境下** 有效：

- [`renderToPipeableStream()`](#rendertopipeablestream)
- [`renderToNodeStream()`](#rendertonodestream) (Deprecated)
- [`renderToStaticNodeStream()`](#rendertostaticnodestream)

以下方法仅在 **有 [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) 的环境下** 有效（这包括浏览器、Deno 以及一些前沿的运行时）

- [`renderToReadableStream()`](#rendertoreadablestream)

以下方法可以在不支持 streams 的环境中使用：

- [`renderToString()`](#rendertostring)
- [`renderToStaticMarkup()`](#rendertostaticmarkup)

## 参考 {#reference}

### `renderToPipeableStream()` {#rendertopipeablestream}

```javascript
ReactDOMServer.renderToPipeableStream(element, options)
```

将 React 元素渲染为其初始 HTML。返回一个流，使用 `pipe(res)` 方法来管道输出，并使用 `abort()` 中止请求。完全支持 HTML 的悬念和流式处理，稍后通过内联 `<script>` 标签 “弹出” “延迟” 内容块。[阅读更多](https://github.com/reactwg/react-18/discussions/37)

如果你在已经具有此服务器渲染标记的节点上调用 [`ReactDOM.hydraRoot()`](/docs/react-dom-client.html#hydraroot)，React 将保留它并仅附加事件处理程序，使首次加载体验性能十足。

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

请参阅 [完整选项列表](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-dom/src/server/ReactDOMFizzServerNode.js#L36-L46)。

> 注意：
>
> 这是一个仅 Node.js 的 API。 具有 [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) 的环境，例如 Deno 和前沿运行时，应该使用 [`renderToReadableStream`](#rendertoreadablestream) 代替。
>

* * *

### `renderToReadableStream()` {#rendertoreadablestream}

```javascript
ReactDOMServer.renderToReadableStream(element, options);
```

将 React 元素流式传输到其初始 HTML。返回解析为 [Readable Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) 的 Promise。完全支持 HTML 的 Suspense 和流式传输。[阅读更多](https://github.com/reactwg/react-18/discussions/127)

如果你在已经具有此服务器渲染标记的节点上调用 [`ReactDOM.hydraRoot()`](/docs/react-dom-client.html#hydraroot)，React 将保留它并仅附加事件处理程序，使首次加载体验性能十足。

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

请参阅 [完整选项列表](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-dom/src/server/ReactDOMFizzServerBrowser.js#L27-L35)。

> 注意:
>
> 这个 API 需要 [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)。在 Node.js 下，使用[`renderToPipeableStream`](#rendertopipeablestream)。
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

将一个 React 元素渲染成其初始 HTML。React 会返回一个 HTML 字符串。你可以使用本方法在服务器上生成 HTML，并在初始请求时将标记下发，以加快页面加载速度，并允许搜索引擎抓取你的页面以达到 SEO 优化的目的。

如果你在已经具有此服务器渲染标记的节点上调用 [`ReactDOM.hydraRoot()`](/docs/react-dom-client.html#hydraroot)，React 将保留它并仅附加事件处理程序，使首次加载体验性能十足。

> 注意
>
> 此 API 对 Suspense 的支持有限，并且不支持流式传输。
>
> 在服务器上，建议使用 [`renderToPipeableStream`](#rendertopipeablestream)（对于 Node.js）或 [`renderToReadableStream`](#rendertoreadablestream)（对于 Web Stream）。

* * *

### `renderToStaticMarkup()` {#rendertostaticmarkup}

```javascript
ReactDOMServer.renderToStaticMarkup(element)
```

与 [`renderToString`](#rendertostring) 相仿，不过这不会创建 React 内部使用的额外 DOM 属性，比如 `data-reactroot`。如果你打算把 React 用作简单的静态页面生成器，这很有用，因为剥离额外的属性可以节省一些空间。

如果你打算在客户端使用 React 来使标记交互，请不要使用此方法。相反，在服务器上使用 [`renderToString`](#rendertostring) 并在客户端上使用 [`ReactDOM.hydraRoot()`](/docs/react-dom-client.html#hydraroot)。
