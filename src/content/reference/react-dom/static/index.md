---
title: 静态 React DOM API
---

<Intro>

`react-dom/static` API 允许你为 React 组件生成静态 HTML。与流式 API 相比，它们的功能有限。[框架](/learn/creating-a-react-app#full-stack-frameworks) 可能会调用它们。你的大多数组件不需要导入或使用它们。

</Intro>

---

## Web 流的静态 API {/*static-apis-for-web-streams*/}

这些方法仅在支持 [Web 流](https://developer.mozilla.org/zh-CN/docs/Web/API/Streams_API) 的环境中可用，包括浏览器、Deno 和一些现代的边缘运行时环境：

* [`prerender`](/reference/react-dom/static/prerender) 使用 [可读的 Web 流](https://developer.mozilla.org/zh-CN/docs/Web/API/ReadableStream) 将 React 树渲染为静态 HTML。
* <ExperimentalBadge /> [`resumeAndPrerender`](/reference/react-dom/static/resumeAndPrerender) 使用 [可读 Web 流](https://developer.mozilla.org/zh-CN/docs/Web/API/ReadableStream) 将 React 树持续预渲染为静态 HTML。

Node.js 也包含这些方法以实现兼容性，但由于性能较差，因此不推荐使用。而是使用 [Node.js 专用 API](#static-apis-for-nodejs-streams)。

---

## Node.js 流的静态 API {/*static-apis-for-nodejs-streams*/}

这些方法仅在支持 [Node.js 流](https://nodejs.org/api/stream.html) 的环境中可用：

* [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream) 使用 [Node.js 流](https://nodejs.org/api/stream.html) 将 React 树渲染为静态 HTML。
* <ExperimentalBadge /> [`resumeAndPrerenderToNodeStream`](/reference/react-dom/static/resumeAndPrerenderToNodeStream) 使用 [Node.js 流](https://nodejs.org/api/stream.html) 将 React 树持续预渲染为静态 HTML。

