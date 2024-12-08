---
title: Server React DOM API
---

<Intro>

<<<<<<< HEAD
`react-dom/server` API 允许你在服务器上将 React 组件渲染为 HTML。这些 API 仅在服务器应用程序顶层调用，以生成初始 HTML。有的 [框架](/learn/start-a-new-react-project#production-grade-react-frameworks) 可能会为你调用相关 API，大多数组件不需要导入或使用这些 API。
=======
The `react-dom/server` APIs let you server-side render React components to HTML. These APIs are only used on the server at the top level of your app to generate the initial HTML. A [framework](/learn/start-a-new-react-project#production-grade-react-frameworks) may call them for you. Most of your components don't need to import or use them.
>>>>>>> 69edd845b9a654c6ac9ed68da19d5b42897e636e

</Intro>

---

## Node.js 流服务器 API {/*server-apis-for-nodejs-streams*/}

以下方法仅在具有 [Node.js 流](https://nodejs.org/api/stream.html) 的环境中可用：

<<<<<<< HEAD
* [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) 将 React 树渲染为可传输的 [Node.js 流](https://nodejs.org/api/stream.html)。
* [`renderToStaticNodeStream`](/reference/react-dom/server/renderToStaticNodeStream) 将非交互式 React 树渲染为 [Node.js 可读流](https://nodejs.org/api/stream.html#readable-streams)。
=======
* [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) renders a React tree to a pipeable [Node.js Stream.](https://nodejs.org/api/stream.html)
>>>>>>> 69edd845b9a654c6ac9ed68da19d5b42897e636e

---

## Web 流服务器 API {/*server-apis-for-web-streams*/}

以下方法仅在具有 [web 流](https://developer.mozilla.org/zh-CN/docs/Web/API/Streams_API) 的环境中可用，包括浏览器、Deno，以及一些现代 edge 运行时：

+   [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream) 将 React 树渲染为 [可读的 web 流](https://developer.mozilla.org/zh-CN/docs/Web/API/ReadableStream)。

---

<<<<<<< HEAD
## 非流式环境 API {/*server-apis-for-non-streaming-environments*/}
=======
## Legacy Server APIs for non-streaming environments {/*legacy-server-apis-for-non-streaming-environments*/}
>>>>>>> 69edd845b9a654c6ac9ed68da19d5b42897e636e

以下方法可以在非流式环境中使用：

* [`renderToString`](/reference/react-dom/server/renderToString) 将 React 树渲染为字符串。
* [`renderToStaticMarkup`](/reference/react-dom/server/renderToStaticMarkup) 将非交互式 React 树渲染为字符串。

<<<<<<< HEAD
相比于流式 API，这些 API 在功能上有些限制。

---

## 已弃用的服务器 API {/*deprecated-server-apis*/}

<Deprecated>

这些 API 将在未来的 React 主要版本中被移除。

</Deprecated>

* [`renderToNodeStream`](/reference/react-dom/server/renderToNodeStream) 能够将 React 树渲染为 [Node.js 只读流](https://nodejs.org/api/stream.html#readable-streams)（已弃用）。
=======
They have limited functionality compared to the streaming APIs.
>>>>>>> 69edd845b9a654c6ac9ed68da19d5b42897e636e
