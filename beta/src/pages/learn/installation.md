---
title: 安装
translators:
  - ChelesteWang
---

<Intro>

React 从诞生之初就是可被渐进式使用的。因此你可以选择性地使用 React 特性。不管你是想体验下 React，用它为简单的 HTML 页面增加交互，还是重新搭建一个由 React 驱动的复杂应用，本章节内容都能帮你快速入门。

</Intro>

<YouWillLearn isChapter={true}>

* [如何将 React 添加到页面中](/learn/add-react-to-a-website)
* [如何启动一个全新的 React 项目](/learn/start-a-new-react-project)
* [如何配置你的编辑器](/learn/editor-setup)
* [如何安装 React 开发工具](/learn/react-developer-tools)

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

如果你喜欢使用自己的文本编辑器，也可以 [下载这个 HTML](https://raw.githubusercontent.com/reactjs/reactjs.org/main/static/html/single-file-example.html) 文件，然后编辑修改文件内容，最后直接用浏览器打开。

## 将 React 添加到已有页面 {/*add-react-to-a-page*/}

如果你正在维护一个已有的网站，需要添加少量 React 代码，你可以 [使用 script 标签添加 React](/learn/add-react-to-a-website)。

## 开始一个 React 项目 {/*start-a-react-project*/}

如果你准备好使用 React [启动一个独立的项目](/learn/start-a-new-react-project) ，你可以建立一个最小的工具链以获得愉快的开发体验。你也可以从一个框架开始，它为你做了很多开箱即用的设定。

## 下一节 {/*next-steps*/}

前往 [快速入门](/learn) 章节。以学习你每天都会遇到且最为重要的 React 概念。
