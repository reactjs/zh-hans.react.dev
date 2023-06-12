---
title: 客户端 React DOM APIs
translators:
  - neo-of-matrix
---

<Intro>

`react-dom/client` APIs 让你可以在客户端（浏览器）渲染 React 组件。这些 API 通常在你的应用的顶端初始化 React 树。一个 [框架](/learn/start-a-new-react-project#production-grade-react-frameworks) 可能会为你调用它们。你的大部分组件不需要导入和使用它们。

</Intro>

---

## 客户端 API {/*client-apis*/}

* [`createRoot`](/reference/react-dom/client/createRoot) 让你可以在浏览器的 DOM 节点里面创建一个根节点来显示 React 组件。
* [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) 让你可以在 HTML 内容提前由 [`react-dom/server`](/reference/react-dom/server) 生成的浏览器 DOM 节点里面显示 React 组件。
---

## 浏览器兼容性 {/*browser-support*/}

React 支持所有流行的浏览器，包括 Internet Explorer 9 以及以上版本的浏览器。更旧的浏览器比如 IE9 和 IE10 需要使用 polyfill。