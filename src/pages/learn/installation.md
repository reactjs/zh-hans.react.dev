---
title: 安装
---

<Intro>

React 从诞生之初就是可被逐步采用的，因而你可以按需引入或多或少的 React 特性。不管你是想体验下 React，用它给简单的 HTML 页面增加一点交互，还是要开始一个完全由 React 驱动的复杂应用，该章节内容里的链接都能帮你快速开始。

</Intro>

<YouWillLearn>

* [如何将 React 添加到一个页面](/learn/add-react-to-a-website)
* [如何启动一个独立的 React 项目](/learn/start-a-new-react-project)
* [如何设置你的编辑器](/learn/editor-setup)
* [如何安装 React 开发工具](/learn/react-developer-tools)

</YouWillLearn>

## 尝试 React {#try-react}

你不需要安装任何东西。在下面的在线代码编辑器尝试一下吧：

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

我们在教学文档中将使用在线代码编辑器作为教学辅助工具。它可以帮助你熟悉 React 的工作方式，并帮助你决定 React 是否适合你。在 React 文档之外，还有许多支持 React 的在线代码编辑器：例如[CodeSandbox](https://codesandbox.io/s/new)，[Stackblitz](https://stackblitz.com/fork/react)，或者 [CodePen](
https://codepen.io/pen/?template=wvdqJJm).

### 本地尝试 React 

如果你喜欢使用自己的文本编辑器，也可以[下载这个 HTML](https://raw.githubusercontent.com/reactjs/reactjs.org/main/static/html/single-file-example.html)文件，然后编辑文件内容，最后再用浏览器从本地文件系统打开文件

## 将 React 添加到页面 {#add-react-to-a-page}

如果你正在维护一个已有的网站，只需要添加一部分 React，你可以 [使用 script 标签添加 React](/learn/add-react-to-a-website)

## 开始一个 React 项目 {#start-a-react-project}

如果你准备好使用 React [启动一个独立的项目](/learn/start-a-new-react-project) ，你可以建立一个最小的工具链以获得愉快的开发体验。你也可以从一个框架开始，它为你做了很多开箱即用的设定。

## 下节预告 {#next-steps}

你从哪里开始学习，取决于你喜欢如何学习，你需要完成什么，以及你下一步想去哪里! 不妨读一下[React 哲学](/learn/thinking-in-react)——我们的介绍性教程？或者你可以跳到 [描述用户界面](/learn/describing-the-ui) 来尝试更多的例子，一步一步地学习每个主题。这是一个学习 React 不错的方法。
