---
title: React 参考总览
---

<Intro>

本部分提供了使用 React 的详细参考文档。如果需要了解 React，请访问 [教程](/learn) 部分。

</Intro>

React 参考文档分为以下内容：

## React {/*react*/}

编程式 React 功能：

* [Hook](/reference/react/hooks) —— 在组件中使用不同的 React 特性。
* [组件](/reference/react/components) —— 记录了可以在 JSX 中使用的内置组件。
* [API](/reference/react/apis) —— 用于定义组件的有用 API。
* [指示符](/reference/react/directives) —— 为与 React 服务器组件兼容的捆绑器提供指示。

## React DOM {/*react-dom*/}

React-dom 仅支持在 web 应用程序中使用（在浏览器 DOM 环境中运行）。本节分为以下部分：

* [Hook](/reference/react-dom/hooks) —— 适用于在浏览器 DOM 环境中运行的 web 应用程序的 Hook。
* [组件](/reference/react-dom/components) —— React 支持所有内置的 HTML 和 SVG 组件。
* [API](/reference/react-dom) —— `react-dom` 包含仅在 web 应用程序中支持的方法。
* [客户端 API](/reference/react-dom/client) —— `react-dom/client` API 允许在客户端（浏览器中）渲染 React 组件。
* [服务端 API](/reference/react-dom/server) —— `react-dom/server` API 允许在服务器端将 React 组件渲染为 HTML。

<<<<<<< HEAD
## 过时的 API {/*legacy-apis*/}
=======
## Rules of React {/*rules-of-react*/}

React has idioms — or rules — for how to express patterns in a way that is easy to understand and yields high-quality applications:

* [Components and Hooks must be pure](/reference/rules/components-and-hooks-must-be-pure) – Purity makes your code easier to understand, debug, and allows React to automatically optimize your components and hooks correctly.
* [React calls Components and Hooks](/reference/rules/react-calls-components-and-hooks) – React is responsible for rendering components and hooks when necessary to optimize the user experience.
* [Rules of Hooks](/reference/rules/rules-of-hooks) – Hooks are defined using JavaScript functions, but they represent a special type of reusable UI logic with restrictions on where they can be called.

## Legacy APIs {/*legacy-apis*/}
>>>>>>> f55d9487c6648570fc80f1421d7dca0a3b9b94b6

* [过时的 API](/reference/react/legacy) —— 从 react 包中导出，但不建议在新编写的代码中使用。
