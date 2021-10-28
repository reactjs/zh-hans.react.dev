---
title: 安装
---

<Intro>

React 从一开始就被设计为渐进式的，你可以根据你的需要使用少量或大量的 React。无论你是想体验一下 React 给 HTML 页面添加一些交互性，还是开始一个复杂的由 React 驱动的应用，本章节将帮助你开始。
</Intro>

<YouWillLearn>

* [如何将 React 添加到一个 HTML 页面](/learn/add-react-to-a-website)
* [如何启动一个独立的 React 项目](/learn/start-a-new-react-project)
* [如何设置你的编辑器](/learn/editor-setup)
* [如何安装 React 开发工具](/learn/react-developer-tools)

</YouWillLearn>

## 尝试 React {#try-react}

你不需要安装任何东西来尝试 React。试试在下面的沙盒编辑使用吧：

<Sandpack>

```js
function Greeting({ name }) {
  return <h1>Hello, {name}</h1>;
}

export default function App() {
  return <Greeting name="world" />
}
```

</Sandpack>

我们在这些文档中使用沙盒作为教学辅助工具。沙盒可以帮助你熟悉 React 的工作方式，并帮助你决定 React 是否适合你。在 React 文档之外，有许多支持 React 的在线沙盒：例如[CodeSandbox](https://codesandbox.io/s/new)，[Stackblitz](https://stackblitz.com/fork/react)，或者 [CodePen](
https://codepen.io/pen/?template=wvdqJJm).

### 本地尝试 React 

在你的计算机上进行 React 尝试, [下载这个 HTML](https://raw.githubusercontent.com/reactjs/reactjs.org/main/static/html/single-file-example.html)。在编辑器或者浏览器中打开它!

## 将 React 添加到页面 {#add-react-to-a-page}

如果你正在使用一个现有的网站，只需要添加一部分 React，你可以 [使用 script 标签添加 React](/learn/add-react-to-a-website)

## 开始一个 React 项目 {#start-a-react-project}

如果你准备好使用 React [启动一个独立的项目](/learn/start-a-new-react-project) ，你可以建立一个最小的工具链以获得愉快的开发体验。你也可以从一个框架开始，它为你做了很多开箱即用的设定。

## 下节预告 {#next-steps}

你从哪里开始，取决于你喜欢如何学习，你需要完成什么，以及你下一步想去哪里! 不妨读一下[React 哲学](/learn/thinking-in-react)--我们的介绍性教程？或者你可以跳到 [描述用户界面](/learn/describing-the-ui) 来尝试更多的例子，一步一步地学习每个主题。这是一个学习 React 不错的方法。
