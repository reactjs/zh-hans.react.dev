---
title: 安装
translators:
  - ChelesteWang
---

<Intro>

React 从诞生之初就是可被渐进式使用的。因此你可以选择性地使用 React 特性。不管你是想体验下 React，用它为简单的 HTML 页面增加交互，还是重新搭建一个由 React 驱动的复杂应用，本章节内容都能帮你快速入门。

</Intro>

<YouWillLearn isChapter={true}>

* [How to start a new React project](/learn/start-a-new-react-project)
* [How to add React to an existing project](/learn/add-react-to-an-existing-project)
* [How to set up your editor](/learn/editor-setup)
* [How to install React Developer Tools](/learn/react-developer-tools)

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

To try React locally on your computer, [download this HTML page.](https://gist.githubusercontent.com/gaearon/0275b1e1518599bbeafcde4722e79ed1/raw/db72dcbf3384ee1708c4a07d3be79860db04bff0/example.html) Open it in your editor and in your browser!

## Start a new React project {/*start-a-new-react-project*/}

If you want to build an app or a website fully with React, [start a new React project.](/learn/start-a-new-react-project)

## Add React to an existing project {/*add-react-to-an-existing-project*/}

If want to try using React in your existing app or a website, [add React to an existing project.](/learn/add-react-to-an-existing-project)

## 下一节 {/*next-steps*/}

前往 [快速入门](/learn) 章节。以学习你每天都会遇到且最为重要的 React 概念。
