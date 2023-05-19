---
title: 安装
translators:
  - ChelesteWang
---

<Intro>

React 从诞生之初就是可被渐进式使用的。因此你可以选择性地使用 React 特性。不管你是想体验下 React，用它为简单的 HTML 页面增加交互，还是重新搭建一个由 React 驱动的复杂应用，本章节内容都能帮你快速入门。

</Intro>

<YouWillLearn isChapter={true}>

* [如何开始一个新的 React 项目](/learn/start-a-new-react-project)
* [如果添加 React 到一个已有的项目](/learn/add-react-to-an-existing-project)
* [如何设置你的编辑器](/learn/editor-setup)
* [如何安装 React 开发者工具套件](/learn/react-developer-tools)

</YouWillLearn>

## 尝试 React {/*try-react*/}

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

你可以直接对它进行编辑，或点击右上角的 "Fork" 按钮在一个新的标签页中打开。

React 文档中的大部分页面都包含这样的 sandbox。除 React 文档以外，还存在许多支持 React 的在线代码编辑器：例如 [CodeSandbox](https://codesandbox.io/s/new)，[StackBlitz](https://stackblitz.com/fork/react)，或者 [CodePen](https://codepen.io/pen?&editors=0010&layout=left&prefill_data_id=3f4569d1-1b11-4bce-bd46-89090eed5ddb)。

### 本地尝试 React {/*try-react-locally*/}

如果想在电脑本地上进行尝试, [下载这个HTML页面](https://gist.githubusercontent.com/gaearon/0275b1e1518599bbeafcde4722e79ed1/raw/db72dcbf3384ee1708c4a07d3be79860db04bff0/example.html)。 然后在你的编辑器和浏览器中打开!

## 开始一个新的 React 项目 {/*start-a-new-react-project*/}

如果你想完全使用 React 建立一个应用或者一个网站, [开始一个新的 React 项目](/learn/start-a-new-react-project)。

## 添加 React 到一个已有的项目 {/*add-react-to-an-existing-project*/}

如果你想在一个现有的应用或者网站上尝试 React, [添加 React 到一个现有的项目](/learn/add-react-to-an-existing-project)。

## 下一节 {/*next-steps*/}

前往 [快速入门](/learn) 章节。以学习你每天都会遇到且最为重要的 React 概念。
