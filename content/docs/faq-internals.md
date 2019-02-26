---
id: faq-internals
title: 虚拟 DOM 及内核
permalink: docs/faq-internals.html
layout: docs
category: FAQ
---

### 什么是虚拟 DOM? {#what-is-the-virtual-dom}

The virtual DOM (VDOM) is a programming concept where an ideal, or "virtual", representation of a UI is kept in memory and synced with the "real" DOM by a library such as ReactDOM. This process is called [reconciliation](/docs/reconciliation.html).
虚拟 DOM 是一种编程概念。在这个概念里，一种想象的，或者说“虚拟的” UI 会被保存于内存中，并通过如 ReactDOM 等类库使之与“真实的” DOM 同步。这一过程叫做[协调](/docs/reconciliation.html).

This approach enables the declarative API of React: You tell React what state you want the UI to be in, and it makes sure the DOM matches that state. This abstracts out the attribute manipulation, event handling, and manual DOM updating that you would otherwise have to use to build your app.
这种方式使用了 React 的声明式 API：您告诉 React 希望让 UI 是什么状态，React 就确保 DOM 匹配该状态。这抽象出了您在构建应用程序时必须用到的属性操作、事件处理和手动 DOM 更新。

Since "virtual DOM" is more of a pattern than a specific technology, people sometimes say it to mean different things. In React world, the term "virtual DOM" is usually associated with [React elements](/docs/rendering-elements.html) since they are the objects representing the user interface. React, however, also uses internal objects called "fibers" to hold additional information about the component tree. They may also be considered a part of "virtual DOM" implementation in React.
由于“虚拟 DOM”相比于特定的技术更像是一种模式，有时我们说它时也代表不同的含义。在 React 世界里，“虚拟 DOM”术语通常与[React 元素](/docs/rendering-elements.html)关联在一起，因为它们都是呈现 UI 的对象。而 React 也使用一个名为“ fibers ”的内部对象来存放组件树的其他信息。上述二者也被认为是 React 中“虚拟 DOM ”实现的一部分。

### 影子 DOM 和虚拟 DOM 是一回事吗? {#is-the-shadow-dom-the-same-as-the-virtual-dom}

No, they are different. The Shadow DOM is a browser technology designed primarily for scoping variables and CSS in web components. The virtual DOM is a concept implemented by libraries in JavaScript on top of browser APIs.
不，他们不一样。影子 DOM 是一种浏览器技术，主要用于在 web 组件中封装变量和CSS。虚拟 DOM 则是由 Javascript 类库基于浏览器 API 实现的概念。

### 什么是“React Fiber”? {#what-is-react-fiber}

Fiber is the new reconciliation engine in React 16. Its main goal is to enable incremental rendering of the virtual DOM. 
Fiber 是 React 16 中新的协调引擎. 它的主要目的是使虚拟 DOM 可以进行增量式渲染。[了解更多](https://github.com/acdlite/react-fiber-architecture).
