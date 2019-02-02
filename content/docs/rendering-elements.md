---
id: rendering-elements
title: 元素渲染
permalink: docs/rendering-elements.html
redirect_from:
  - "docs/displaying-data.html"
prev: introducing-jsx.html
next: components-and-props.html
---

元素是 React 应用的最小组成单位。

元素描述了你在屏幕上想看到的内容。

```js
const element = <h1>Hello, world</h1>;
```

与浏览器的 DOM 元素不同，React 元素是创建开销极小的原生对象。React DOM 会负责更新 DOM 来与 React 元素保持一致。

>**注意：**
>
>你可能会将元素与另一个被熟知的概念——“组件”混淆起来。我们会在[下一个章节](/docs/components-and-props.html)介绍组件。组件是由元素构成的。我们希望你先阅读本章节，而不要急于翻看其他章节。

## 将元素渲染进 DOM

假设你的 HTML 文件某处有一个 `<div>`：

```html
<div id="root"></div>
```

我们将其称为“根” DOM 节点，因为该节点内的所有内容都将由 React DOM 管理。

仅使用 React 构建的应用通常只有单一的根 DOM 节点。如果你在将 React 集成进一个现有应用，那么你可以在应用中包含任意多的独立根 DOM 节点。

将 React 元素和一个根 DOM 节点一起传入 `ReactDOM.render()` 来将该元素渲染进 DOM：

`embed:rendering-elements/render-an-element.js`

[](codepen://rendering-elements/render-an-element)

页面上会出现 "Hello, world"。

## 更新已渲染的元素

React 元素是[不可变对象](https://zh.wikipedia.org/wiki/%E4%B8%8D%E5%8F%AF%E8%AE%8A%E7%89%A9%E4%BB%B6)。一旦被创建，你就无法更改它的子元素或者属性。一个元素就像电影的一帧：它代表了 UI 在特定时刻的状态。

根据我们已有的知识，更新 UI 唯一的方式是创建一个全新的元素，并将其传入 `ReactDOM.render()`。

考虑一个计时器的例子：

`embed:rendering-elements/update-rendered-element.js`

[](codepen://rendering-elements/update-rendered-element)

每一秒，它会通过 [`setInterval()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/setInterval) 回调函数调用 `ReactDOM.render()`。

>**注意：**
>
>在实践中，大多数 React 应用只会调用一次 `ReactDOM.render()`。在下一个章节，我们将学习如何通过[有状态组件](/docs/state-and-lifecycle.html)实现这样的代码。
>
>我们建议你不要跳跃着阅读，因为每个话题都是紧密联系的。

## React 的按需更新

React DOM 会将元素和它的子元素与它们之前的状态进行比较，并只会进行必要的更新来使 DOM 达到预期的状态。

你可以使用浏览器的检查元素工具查看[上一个例子](codepen://rendering-elements/update-rendered-element)来确认这一点。

![DOM inspector showing granular updates](../images/docs/granular-dom-updates.gif)

尽管每一秒我们都会新建一个描述全部 UI 树的元素，React DOM 只会更新实际改变了的内容，也就是例子中的文本节点。

根据我们的经验，考虑 UI 在任意给定时刻的状态而不是随时间变化的过程能够消灭一整类的 bug。
