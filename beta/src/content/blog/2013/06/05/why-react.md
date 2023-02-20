---
title: 我们为什么要构建 React?
author: [petehunt]
---

现在有很多 JavaScript MVC 框架。我们为什么还要构建 React，
你又为什么会使用它？

## React 不是一个 MVC 框架。 {/*react-isnt-an-mvc-framework*/}

React 是一个用于构建可组合用户界面的库。
它鼓励创建那些用于呈现随时间变化数据的、可复用的
UI 组件。

## React 不使用模板。 {/*react-doesnt-use-templates*/}

在以往，web 应用程序的 UI 都是使用模板或者 HTML 指令构建的。
这些模板决定了你可以用来构建
UI 的全套抽象。

而 React 用了不同的方式构建 UI，把它们拆成**组件**。
这意味着 React 使用了一种真实的、具有各种特性的编程语言来渲染视图，
我们认为它相较于模板而言是一种优势的理由如下:

- **JavaScript 是一种灵活、强大的编程语言**，具有构建抽象的能力，
  这在大型应用中非常重要。
- 通过将你的标记和其相对应的视图逻辑统一起来，
  React 实际上可以让视图变得**更容易扩展和维护**。
- 通过把一种对标记和内容的理解融入 JavaScript，
  **不用手动连接字符串**，因此 XSS
  漏洞的表面积也更小。

相比原生 JavaScript，如果你更喜欢 HTML 的高可读性，
我们创造了 [JSX](/docs/jsx-in-depth.html)，一种可选的语法扩展。

## 响应式更新非常简单。 {/*reactive-updates-are-dead-simple*/}

当你的数据随时间变化的时候，React 表现得真的很出色。

在一个传统的 JavaScript 应用中，你需要观察数据发生了什么变化，
并且为了让 DOM 保持最新的状态还必须对它进行更改。
AngularJS 甚至通过指令和数据绑定的提供声明式接口，
还[需要一个链接函数来手动更新 DOM 节点](https://code.angularjs.org/1.0.8/docs/guide/directive#reasonsbehindthecompilelinkseparation) 。

但 React 采用了不同的方式。

当你的组件首次初始化，组件的 `render` 方法会被调用，
对你的视图生成一个轻量化的表示。从那个表示生成一串标记，
并注入到文档中。当你的数据发生了变化，
`render` 方法会再次被调用。为了尽可能高效地执行更新，
我们会对前一次调用 `render` 方法返回的结果和新的调用结果进行区分，
并生成一个要应用于 DOM
的最小更改集合。

> `render` 返回的数据既不是一串字符串也不是一个 DOM 节点 —— 而是一种表示
> DOM 应该是什么样子的轻量化描述。

我们把这个过程称为**协调**。 查看
[这个 jsFiddle](http://jsfiddle.net/2h6th4ju/)
可以看到实际的协调示例。

因为这样的重渲染实在太快了（对于 TodoMVC 而言大概就 1ms），
所以开发者不需要显式地指定数据绑定。
我们发现这种方式可以更轻松地构建应用程序。

## HTML 只是开始。 {/*html-is-just-the-beginning*/}

因为 React 有它自己对于文档的轻量化表示，
所以我们可以用它做一些非常酷的事情：

- Facebook 有些动态的图表会渲染成 `<canvas>` 而不是 HTML。
- Instagram 是一个完全用 React 和 `Backbone.Router` 构建的“单页”web 应用程序。
  设计师经常使用 JSX 来提供 React 代码。
- 我们已经构建了在 web worker 中运行 React 应用程序的内部原型，并且用
  React 通过一个 Objective-C 桥接器来驱动 **原生 iOS 视图**。
- 你可以
  [在服务器上](https://github.com/petehunt/react-server-rendering-example)
  运行 React 以获得 SEO、性能、代码共享和整体的灵活性。
- 事件在所有浏览器（包括 IE8）中以一致的、符合标准的方式运行，
  并且自动使用了
  [事件委托](http://davidwalsh.name/event-delegate) 。

前往 [https://reactjs.org](https://reactjs.org) 可以查看我们已经构建的内容。
我们的文档旨在用框架构建应用程序，
但是如果你对具体细节感兴趣，
请与我们[联系](/support.html)！

感谢阅读！
