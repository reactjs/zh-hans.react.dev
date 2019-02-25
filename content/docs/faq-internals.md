---
id: faq-internals
title: 虚拟 DOM 及内核
permalink: docs/faq-internals.html
layout: docs
category: FAQ
---

### 什么是虚拟 DOM? {#what-is-the-virtual-dom}

The virtual DOM (VDOM) is a programming concept where an ideal, or "virtual", representation of a UI is kept in memory and synced with the "real" DOM by a library such as ReactDOM. This process is called [reconciliation](/docs/reconciliation.html).
虚拟 DOM 是一种编程概念。在这个概念里，一种想象的，或者说“虚拟的” UI 呈现会被保存于内存中，并借助如 ReactDOM 等类库使之与“真实的” DOM 同步。这一过程叫作[协调](/docs/reconciliation.html).

This approach enables the declarative API of React: You tell React what state you want the UI to be in, and it makes sure the DOM matches that state. This abstracts out the attribute manipulation, event handling, and manual DOM updating that you would otherwise have to use to build your app.
这种方式实现了 React 的声明式 API：您告诉 React 想让 UI 是什么状态，React 就确保 DOM 是什么状态。 这抽象出了您在构建程序时必须用到的属性操作、事件处理和手动 DOM 更新。

Since "virtual DOM" is more of a pattern than a specific technology, people sometimes say it to mean different things. In React world, the term "virtual DOM" is usually associated with [React elements](/docs/rendering-elements.html) since they are the objects representing the user interface. React, however, also uses internal objects called "fibers" to hold additional information about the component tree. They may also be considered a part of "virtual DOM" implementation in React.

### Is the Shadow DOM the same as the Virtual DOM? {#is-the-shadow-dom-the-same-as-the-virtual-dom}

No, they are different. The Shadow DOM is a browser technology designed primarily for scoping variables and CSS in web components. The virtual DOM is a concept implemented by libraries in JavaScript on top of browser APIs.

### What is "React Fiber"? {#what-is-react-fiber}

Fiber is the new reconciliation engine in React 16. Its main goal is to enable incremental rendering of the virtual DOM. [Read more](https://github.com/acdlite/react-fiber-architecture).
