---
title: Client React DOM API
translators:
  - neo-of-matrix
---

<Intro>

`react-dom/client` API 允许你在客户端（浏览器）渲染 React 组件。这些 API 通常在应用程序顶层调用，以初始化 React 树。有的 [框架](/learn/start-a-new-react-project#full-stack-frameworks) 可能会为你调用相关 API，大多数组件不需要导入和使用这些 API。

</Intro>

---

## 客户端 API {/*client-apis*/}

* [`createRoot`](/reference/react-dom/client/createRoot) 让你可以在浏览器的 DOM 节点里面创建一个根节点以显示 React 组件。
* [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) 让你可以在 HTML 内容提前由 [`react-dom/server`](/reference/react-dom/server) 生成的浏览器 DOM 节点里面显示 React 组件。
---

## 浏览器兼容性 {/*browser-support*/}

React 支持所有流行的浏览器，包括 Internet Explorer 9 以及以上版本的浏览器。更旧的浏览器比如 IE9 和 IE10 需要使用 polyfill。
