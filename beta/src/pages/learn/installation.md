---
title: 安装
translators:
- ChelesteWang
---

<Intro>

React 从诞生之初就是可被逐步采用的，因此你可以选择性地使用 React 特性。不管你是想体验下 React，用它为简单的 HTML 页面增加交互，还是重新搭建一个由 React 驱动的复杂应用，本章节内容都能帮你快速入门。

</Intro>

<YouWillLearn>

* [如何将 React 添加到页面中](/learn/add-react-to-a-website)
* [如何启动一个全新的 React 项目](/learn/start-a-new-react-project)
* [如何配置你的编辑器](/learn/editor-setup)
* [如何安装 React 开发工具](/learn/react-developer-tools)

</YouWillLearn>

## 尝试 React {#try-react}

无需进行任何安装，即可体验：

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

我们将在线代码编辑器集成到了文档之中，将其作为教学辅助工具。它可以帮助你熟悉 React 的工作方式，同时帮助你检测 React 与你的契合度。在 React 文档之外，还存在许多支持 React 的在线代码编辑器：例如 [CodeSandbox](https://codesandbox.io/s/new)，[Stackblitz](https://stackblitz.com/fork/react)，或者 [CodePen](
https://codepen.io/pen/?template=wvdqJJm)。

### 本地尝试 React {#try-react-locally}

如果你喜欢使用自己的文本编辑器，也可以 [下载这个 HTML](https://raw.githubusercontent.com/reactjs/reactjs.org/main/static/html/single-file-example.html) 文件，然后编辑修改文件内容，最后直接用浏览器打开。

## 将 React 添加到已有页面 {#add-react-to-a-page}

如果你正在维护一个已有的网站，只需要添加一部分 React，你可以 [使用 script 标签添加 React](/learn/add-react-to-a-website)。

## 开始一个 React 项目 {#start-a-react-project}

如果你准备好使用 React [启动一个独立的项目](/learn/start-a-new-react-project) ，你可以建立一个最小的工具链以获得愉快的开发体验。你也可以从一个框架开始，它为你做了很多开箱即用的设定。

## 下一步 {#next-steps}

你从哪里开始学习，这完全取决于你的学习习惯，你的学习目标，如果毫无头绪，不妨读一下 [React 哲学](/learn/thinking-in-react) —— 这是我们的入门级教程。或者你可以直接跳到 [描述用户界面](/learn/describing-the-ui) 来尝试更多的示例，逐步学习每个主题。总有一种适合你。
