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
* [组件](/reference/react/components) —— 可以在 JSX 中使用的内置组件。
* [API](/reference/react/apis) —— 用于定义组件的有用 API。
* [指示符](/reference/rsc/directives) —— 为与 React 服务器组件兼容的捆绑器提供指示。

## React DOM {/*react-dom*/}

React-dom 仅支持在 web 应用程序中使用（在浏览器 DOM 环境中运行）。本节分为以下部分：

* [Hook](/reference/react-dom/hooks) —— 适用于在浏览器 DOM 环境中运行的 web 应用程序的 Hook。
* [组件](/reference/react-dom/components) —— React 支持所有内置的 HTML 和 SVG 组件。
* [API](/reference/react-dom) —— `react-dom` 包含仅在 web 应用程序中支持的方法。
* [客户端 API](/reference/react-dom/client) —— `react-dom/client` API 允许在客户端（浏览器中）渲染 React 组件。
* [服务端 API](/reference/react-dom/server) —— `react-dom/server` API 允许在服务器端将 React 组件渲染为 HTML。


## React Compiler {/*react-compiler*/}

The React Compiler is a build-time optimization tool that automatically memoizes your React components and values:

* [Configuration](/reference/react-compiler/configuration) - Configuration options for React Compiler.
* [Directives](/reference/react-compiler/directives) - Function-level directives to control compilation.
* [Compiling Libraries](/reference/react-compiler/compiling-libraries) - Guide for shipping pre-compiled library code.

## Rules of React {/*rules-of-react*/}

React 有一套表达模式的俗语与规则，它们以一种易于理解并能帮助实现高质量应用程序的方式表达出来：

* [组件与 Hook 必须是纯粹的](/reference/rules/components-and-hooks-must-be-pure) —— 组件与 Hook 的纯粹代码更易于理解、调试，并允许 React 自动优化组件与 Hook。
* [React 调用组件与 Hook](/reference/rules/react-calls-components-and-hooks) —— React 负责在必要时渲染组件与 Hook，以优化用户体验。
* [Hook 规则](/reference/rules/rules-of-hooks) —— Hook 使用 JavaScript 函数定义，但它们代表一种特殊类型的可重用 UI 逻辑，对它们可以被调用的位置有限制。

## 过时的 API {/*legacy-apis*/}

* [过时的 API](/reference/react/legacy) —— 从 react 包中导出，但不建议在新编写的代码中使用。
