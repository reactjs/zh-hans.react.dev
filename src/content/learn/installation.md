---
title: 安装
translators:
  - ChelesteWang
---

<Intro>

React 从诞生之初就是可被渐进式使用的。因此你可以选择性地使用 React 特性。不管你是想体验下 React，用它为简单的 HTML 页面增加交互，还是重新搭建一个由 React 驱动的复杂应用，本章节内容都能帮你快速入门。

</Intro>

## Try React {/*try-react*/}

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

React 文档中的大部分页面都包含这样的 sandbox。除 React 文档以外，还存在许多支持 React 的在线代码编辑器：例如 [CodeSandbox](https://codesandbox.io/s/new)，[StackBlitz](https://stackblitz.com/fork/react)，或者 [CodePen](https://codepen.io/pen?template=QWYVwWN)。

想要在本地尝试 React，你可以 [下载这个 HTML 页面](https://gist.githubusercontent.com/gaearon/0275b1e1518599bbeafcde4722e79ed1/raw/db72dcbf3384ee1708c4a07d3be79860db04bff0/example.html)。然后就可以使用编辑器或是浏览器打开它了！

## 创建一个 React 应用 {/*creating-a-react-app*/}

如果你想开始一个新的 React 应用，你可以用我们推荐的框架 [创建一个 React 应用](/learn/creating-a-react-app)。

## Build a React App from Scratch {/*build-a-react-app-from-scratch*/}

<<<<<<< HEAD
如果某个框架不适合你的项目，或者你更愿意从构建自己的框架开始，则可以 [构建你自己的 React 框架](/learn/building-a-react-framework)。
=======
If a framework is not a good fit for your project, you prefer to build your own framework, or you just want to learn the basics of a React app you can [build a React app from scratch](/learn/build-a-react-app-from-scratch).
>>>>>>> c03f0290502e0b1210f50faaa464489accd57c35


## 添加 React 到一个已有的项目 {/*add-react-to-an-existing-project*/}

<<<<<<< HEAD
如果你想尝试在现有应用程序或网站中使用 React，你可以 [将 React 添加到现有项目](/learn/add-react-to-an-existing-project)。

## 弃用的选项 {/*deprecated-options*/}

### Create React App（已弃用） {/*create-react-app-deprecated*/}

Create React App 是一个已弃用的工具，以前建议用于创建新的 React 应用。如果你想启动新的 React 应用，你可以 [创建 React 应用](/learn/creating-a-react-app)并使用推荐的框架。
=======

<Note>

#### Should I use Create React App? {/*should-i-use-create-react-app*/}

No. Create React App has been deprecated. For more information, see [Sunsetting Create React App](/blog/2025/02/14/sunsetting-create-react-app).

</Note>
>>>>>>> c03f0290502e0b1210f50faaa464489accd57c35

更多信息，参见 [逐步淘汰 Create React App](/blog/2025/02/14/sunsetting-create-react-app)。

## 下一节 {/*next-steps*/}

前往 [快速入门](/learn) 章节。以学习你每天都会遇到且最为重要的 React 概念。
