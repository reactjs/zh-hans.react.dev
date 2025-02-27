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

## 从零构建一个 React 应用 {/*build-a-react-app-from-scratch*/}

如果框架不适合你的项目，你更倾向于自己配置框架，或者你只是单纯想学习配置 React 应用的基础知识，你可以参照 [从零构建一个 React 应用](/learn/build-a-react-app-from-scratch).


## 添加 React 到一个已有的项目 {/*add-react-to-an-existing-project*/}


<Note>

#### 我还应该用 Create React App 么？ {/*should-i-use-create-react-app*/}

不， Create React App 已经不建议使用。更多信息可参照 [Sunsetting Create React App](/blog/2025/02/14/sunsetting-create-react-app).

</Note>

更多信息，参见 [逐步淘汰 Create React App](/blog/2025/02/14/sunsetting-create-react-app)。

## 下一节 {/*next-steps*/}

前往 [快速入门](/learn) 章节。以学习你每天都会遇到且最为重要的 React 概念。
