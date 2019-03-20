---
title: 一个简单组件
order: 0
domid: hello-example
---

React 组件使用一个名为 `render()` 的方法，接收输入的数据并返回需要展示的内容。右侧这个示例中类似 XML 的写法被称为 JSX。被传入组件的输入数据可通过 `this.props` 在 `render()` 中被访问。

**使用 React 的时候也可以不使用 JSX 语法。**你可以在 [Babel REPL](https://babeljs.io/repl/#?presets=react&code_lz=MYewdgzgLgBApgGzgWzmWBeGAeAFgRgD4AJRBEAGhgHcQAnBAEwEJsB6AwgbgChRJY_KAEMAlmDh0YWRiGABXVOgB0AczhQAokiVQAQgE8AkowAUPGDADkdECChWeASl4AlOMOBQAIgHkAssp0aIySpogoaFBUQmISdC48QA) 查看 JSX 是如何被编译成原生 JavaScript 代码的。
