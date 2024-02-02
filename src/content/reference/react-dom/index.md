---
title: React DOM API
---

<Intro>

`react-dom` 包包含一些仅支持在浏览器 DOM 环境下运行的方法，不支持在 React Native 中使用。

</Intro>

---

## API {/*apis*/}

这些 API 可以在你的组件中导入，但是很少使用：

* [`createPortal`](/reference/react-dom/createPortal) 允许你将子组件渲染到 DOM 树的不同位置。
* [`flushSync`](/reference/react-dom/flushSync) 允许你强制 React 同步刷新状态并更新 DOM。

## Resource Preloading APIs {/*resource-preloading-apis*/}

These APIs can be used to make apps faster by pre-loading resources such as scripts, stylesheets, and fonts as soon as you know you need them, for example before navigating to another page where the resources will be used.

[React-based frameworks](/learn/start-a-new-react-project) frequently handle resource loading for you, so you might not have to call these APIs yourself. Consult your framework's documentation for details.

* [`prefetchDNS`](/reference/react-dom/prefetchDNS) lets you prefetch the IP address of a DNS domain name that you expect to connect to.
* [`preconnect`](/reference/react-dom/preconnect) lets you connect to a server you expect to request resources from, even if you don't know what resources you'll need yet.
* [`preload`](/reference/react-dom/preload) lets you fetch a stylesheet, font, image, or external script that you expect to use.
* [`preloadModule`](/reference/react-dom/preloadModule) lets you fetch an ESM module that you expect to use.
* [`preinit`](/reference/react-dom/preinit) lets you fetch and evaluate an external script or fetch and insert a stylesheet.
* [`preinitModule`](/reference/react-dom/preinitModule) lets you fetch and evaluate an ESM module.

---

## 入口 {/*entry-points*/}

`react-dom` 包提供了两个额外的入口：

* [`react-dom/client`](/reference/react-dom/client) 包含在客户端（在浏览器中）渲染 React 组件的 API。
* [`react-dom/server`](/reference/react-dom/server) 包含在服务器上渲染 React 组件的 API。

---

## 已弃用 API {/*deprecated-apis*/}

<Deprecated>

这些 API 将在未来的 React 主要版本中被移除。

</Deprecated>

* [`findDOMNode`](/reference/react-dom/findDOMNode) 用于查找与类式组件实例对应的最近的 DOM 节点。
* [`hydrate`](/reference/react-dom/hydrate) 可以将服务器生成的 HTML 作为浏览器 DOM 节点，并在其中渲染 React 组件。目前已被 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) 取代。
* [`render`](/reference/react-dom/render) 可以在浏览器的 DOM 元素中渲染 React 组件，目前已被 [`createRoot`](/reference/react-dom/client/createRoot) 取代。
* [`unmountComponentAtNode`](/reference/react-dom/unmountComponentAtNode) 可以从 DOM 中移除一个已挂载的 React 组件，目前已被 [`root.unmount()`](/reference/react-dom/client/createRoot#root-unmount) 取代。
