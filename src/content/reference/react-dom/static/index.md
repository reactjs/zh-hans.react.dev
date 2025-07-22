---
title: Static React DOM APIs
---

<Intro>

`react-dom/static` API 允许你为 React 组件生成静态 HTML。与流式 API 相比，它们的功能有限。[框架](/learn/start-a-new-react-project#full-stack-frameworks) 可能会调用它们。你的大多数组件不需要导入或使用它们。

</Intro>

---

## Web 流的静态 API {/*static-apis-for-web-streams*/}

这些方法仅在支持 [Web 流](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) 的环境中可用，包括浏览器、Deno 和一些现代的边缘运行时环境：

* [`prerender`](/reference/react-dom/static/prerender) 使用 [可读的 Web 流](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) 将 React 树渲染为静态 HTML。


---

## Node.js 流的静态 API {/*static-apis-for-nodejs-streams*/}

这些方法仅在支持 [Node.js 流](https://nodejs.org/api/stream.html) 的环境中可用：

* [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream) 使用 [Node.js 流](https://nodejs.org/api/stream.html) 将 React 树渲染为静态 HTML。


