---
id: hello-world
title: Hello World
permalink: docs/hello-world.html
prev: cdn-links.html
next: introducing-jsx.html
---

最简易的 React 示例如下：

```jsx
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<h1>Hello, world!</h1>);
```

它将在页面上展示一个 "Hello, world!" 的标题。

**[在 CodePen 上试试](https://codepen.io/gaearon/pen/rrpgNB?editors=1010)**

点击链接打开在线编辑器。随意更改内容，查看它们会怎样影响展示。本指南中的大多数页面都有像这样的可编辑的示例。


## 如何阅读本指南 {#how-to-read-this-guide}

在本指南中，我们将研究 React 应用程序的组成部分：元素和组件。一旦你掌握了它们，便可以使用这些可复用的小片段组成复杂的应用。

>提示
>
>本指南专为喜欢**逐步学习概念**的人士设计。如果你想边学边做，请查阅我们的[实用教程](/tutorial/tutorial.html)。你会发现该指南与教程是相互补充的。

本文是 React 核心概念分步指南的第一章。你可以在侧边导航栏中找到所有章节的列表。如果你是通过移动设备阅读此内容，你可以通过点击屏幕右下角的按钮来查看导航栏。

本指南中的每一章节都以其前述章节中介绍的知识点为基础。**你可以按照侧边导航栏中显示的顺序阅读浏览 “核心概念” 的指南章节。以了解 React 的大部分内容。** 例如，[“JSX 简介”](/docs/introducing-jsx.html)就是本文的下一章节。

## 预备知识 {#knowledge-level-assumptions}

React 是一个 JavaScript 库，所以我们假设你对 JavaScript 语言已有基本的了解。**如果你对自己的基础不自信，我们推荐[通过 JavaScript 教程](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript)检查你的基础知识储备水平**，使得你能够无压力的阅读本指南。这可能会花费你 30 分钟到 1 个小时的时间，但这样做的好处是你不会觉得同时在学习 React 和 JavaScript。

>注意
>
>本指南的示例中偶尔会使用一些 JavaScript 新语法。如果你在过去几年中并没有使用过 JavaScript，大多数情况下[这三点](https://gist.github.com/gaearon/683e676101005de0add59e8bb345340c)应该能帮到你。


## 让我们开始吧！ {#lets-get-started}

继续向下滚动，你将在网站页脚右侧找到[下一篇指南](/docs/introducing-jsx.html)的链接。


