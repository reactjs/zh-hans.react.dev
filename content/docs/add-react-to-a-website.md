---
id: add-react-to-a-website
title: 在网站中添加 React
permalink: docs/add-react-to-a-website.html
redirect_from:
  - "docs/add-react-to-an-existing-app.html"
prev: getting-started.html
next: create-a-new-react-app.html
---

根据需要选择性地使用 React。

React 在设计之初就可以被渐进式适配，并且**你可以根据需要选择性地使用 React**。可能你只想在现有页面中“局部地添加交互性”。使用 React 组件是一种不错的方式。

大多数网站不是、也不需要是单页应用程序。通过**仅仅几行代码并且无需使用构建工具**，试试在你的网站的一小部分中使用 React。然后，你可以逐步扩展它的存在，或只将其涵盖在少数动态部件中。

---

- [一分钟用上 React](#add-react-in-one-minute)
- [可选：使用 React 和 JSX](#optional-try-react-with-jsx) (不需要打包工具！)

## 一分钟用上 React {#add-react-in-one-minute}

在本小节中，我们会展示如何将 React 组件添加到现有的 HTML 页面中。你可以基于自己现有的网站，或创建一个空的 HTML 文件来练习。

不会涉及复杂的工具或安装需求 —— **完成这一节的内容，你只需要连接到网络，以及一分钟的时间。**

可选：[下载完整示例（2KB 压缩包）](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605/archive/87f0b6f34238595b44308acfb86df6ea43669c08.zip)

### 步骤 1： 添加一个 DOM 容器到 HTML {#step-1-add-a-dom-container-to-the-html}

首先，打开你想要编辑的 HTML 页面。添加一个空的 `<div>` 标签作为标记你想要用 React 显示内容的位置。例如：

```html{3}
<!-- ... 其它 HTML ... -->

<div id="like_button_container"></div>

<!-- ... 其它 HTML ... -->
```

我们给这个 `<div>` 加上唯一的 `id` HTML 属性。这将允许我们稍后用 JavaScript 代码找到它，并在其中显示一个 React 组件。

> 提示
>
> 你可以像这样在 `<body>` 标签内的**任意位置**放置一个“容器” `<div>`。根据需要，你可以在一个页面上放置多个独立的 DOM 容器。它们通常是空标签 —— React 会替换 DOM 容器内的任何已有内容。

### 步骤 2：添加 Script 标签 {#step-2-add-the-script-tags}

接下来，在 `</body>` 结束标签之前，向 HTML 页面中添加三个 `<script>` 标签：

```html{5,6,9}
  <!-- ... 其它 HTML ... -->

  <!-- 加载 React。-->
  <!-- 注意: 部署时，将 "development.js" 替换为 "production.min.js"。-->
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>

  <!-- 加载我们的 React 组件。-->
  <script src="like_button.js"></script>

</body>
```

前两个标签加载 React。第三个将加载你的组件代码。

### 步骤 3：创建一个 React 组件 {#step-3-create-a-react-component}

在 HTML 页面文件的同级目录下创建一个名为 `like_button.js` 的文件。

查看**[这段模板代码](https://gist.github.com/gaearon/0b180827c190fe4fd98b4c7f570ea4a8/raw/b9157ce933c79a4559d2aa9ff3372668cce48de7/LikeButton.js)**并把它粘贴到你创建的文件中。

> 提示
>
> 这段代码定义了一个名为 `LikeButton` 的 React 组件。如果你还不明白这段代码的意思，不用担心 —— 我们将在后续的[入门教程](/tutorial/tutorial.html)和[核心概念](/docs/hello-world.html)中介绍 React 的构建块。目前，我们先只做到显示！

在 `like_button.js` 的底部，在**[模板代码](https://gist.github.com/gaearon/0b180827c190fe4fd98b4c7f570ea4a8/raw/b9157ce933c79a4559d2aa9ff3372668cce48de7/LikeButton.js)**之后，加入以下三行代码。

```js{3,4,5}
// ... 此前粘贴的代码 ...

const domContainer = document.querySelector('#like_button_container');
const root = ReactDOM.createRoot(domContainer);
root.render(e(LikeButton));
```

这三行代码会找到我们在步骤 1 中添加在 HTML 里的 `<div>`，用它创建一个 React 应用，然后在其内部显示我们 “Like” 按钮的 React 组件。

### 就是这么简单！ {#thats-it}

没有第四步了。**你刚刚已经将第一个 React 组件添加到你的网站中。**

查看后续小节，以便查看关于集成 React 的更多提示。

**[查看完整的示例源码](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605)**

**[下载完整示例（2KB 压缩包）](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605/archive/87f0b6f34238595b44308acfb86df6ea43669c08.zip)**

### 提示：重用一个组件 {#tip-reuse-a-component}

通常，你可能希望在 HTML 页面的多个位置展示 React 组件。下面是一个示例，它显示了三次 “Like” 按钮，并向各自传入了一些数据：

[查看完整的示例源码](https://gist.github.com/gaearon/faa67b76a6c47adbab04f739cba7ceda)

[下载完整示例（2KB 压缩包）](https://gist.github.com/gaearon/faa67b76a6c47adbab04f739cba7ceda/archive/279839cb9891bd41802ebebc5365e9dec08eeb9f.zip)

> 注意
>
> 当页面中以 React 驱动的不同部分是相互独立的时候，这种策略通常非常有用。在 React 代码中，使用[组件组合（component composition）](/docs/components-and-props.html#composing-components) 来实现会更容易。

### 提示：为生产环境压缩 JavaScript 代码 {#tip-minify-javascript-for-production}

在将你的网站部署到生产环境之前，要注意未经压缩的 JavaScript 可能会显著降低用户的访问速度。

如果你已经压缩了应用代码，如果你确保已部署的 HTML 加载了以 `production.min.js` 结尾的 React 版本，那么**你的网站是生产就绪（production-ready）的**：

```js
<script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
```

如果你没有一个代码压缩的步骤，[这有一个配置它的方式](https://gist.github.com/gaearon/42a2ffa41b8319948f9be4076286e1f3)。

## 可选：使用 React 和 JSX {#optional-try-react-with-jsx}

在上面的示例中，我们只依赖了浏览器原生支持的特性。这就是为什么我们使用了 JavaScript 函数调用来告诉 React 要显示什么：

```js
const e = React.createElement;

// 显示一个 "Like" <button>
return e(
  'button',
  { onClick: () => this.setState({ liked: true }) },
  'Like'
);
```

然而，React 还提供了一种使用 [JSX](/docs/introducing-jsx.html) 编写界面的方式：

```js
// 显示一个 "Like" <button>
return (
  <button onClick={() => this.setState({ liked: true })}>
    Like
  </button>
);
```

这两段代码是等价的。虽然 **JSX [完全是可选的](/docs/react-without-jsx.html)**，但是多数人觉得这样编写 UI 代码更方便 —— 无论是使用 React 还是其它库。

你可以通过[在线编译器](https://babeljs.io/en/repl#?babili=false&browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=DwIwrgLhD2B2AEcDCAbAlgYwNYF4DeAFAJTw4B88EAFmgM4B0tAphAMoQCGETBe86WJgBMAXJQBOYJvAC-RGWQBQ8FfAAyaQYuAB6cFDhkgA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=es2015%2Creact%2Cstage-2&prettier=false&targets=&version=7.15.7)试用 JSX。

### 快速尝试 JSX {#quickly-try-jsx}

在项目中尝试 JSX 最快的方法是在页面中添加这个 `<script>` 标签：

```html
<script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
```

现在，你可以在任何 `<script>` 标签内使用 JSX，方法是在为其添加 `type="text/babel"` 属性。这是[一个使用了 JSX 的 HTML 文件的例子](https://raw.githubusercontent.com/reactjs/reactjs.org/main/static/html/single-file-example.html)，你可以下载并尝试使用。

这种方式适合于学习和创建简单的示例。然而，它会使你的网站变慢，并且**不适用于生产环境**。当你准备好更进一步时，删除你添加的这个新的 `<script>` 标签以及`type="text/babel"` 属性。取而代之的，在下一小节中，你将设置一个 JSX 预处理器来自动转换所有 `<script>` 标签的内容。

### 将 JSX 添加到项目 {#add-jsx-to-a-project}

将 JSX 添加到项目中并不需要诸如打包工具或开发服务器那样复杂的工具。本质上，添加 JSX **就像添加 CSS 预处理器一样**。唯一的要求是你在计算机上安装了 [Node.js](https://nodejs.org/)。

在终端上跳转到你的项目文件夹，然后粘贴这两个命令：

1. **步骤 1：** 执行 `npm init -y` （如果失败，[这是修复办法](https://gist.github.com/gaearon/246f6380610e262f8a648e3e51cad40d)）
2. **步骤 2：** 执行 `npm install babel-cli@6 babel-preset-react-app@3`

> 提示
>
> 我们**在这里使用 npm 只是用来安装 JSX 预处理器**，之后你不再需要它。React 和应用程序代码都可以继续使用 `<script>` 标签而不做任何更改。

恭喜！你刚刚为你的项目加入了一个**生产就绪（production-ready）的 JSX 配置环境**。


### 运行 JSX 预处理器 {#run-jsx-preprocessor}

创建一个名为 `src` 的文件夹并执行这个终端命令：

```console
npx babel --watch src --out-dir . --presets react-app/prod
```

> 注意：
>
> `npx` 不是拼写错误 —— 它是 [npm 5.2+ 附带的 package 运行工具](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b)。
>
> 如果你看到一个错误消息显示为："You have mistakenly installed the `babel` package"，你可能错过了[上一步](#add-jsx-to-a-project)。在同一个文件夹中执行它，然后重试。

不要等待它运行结束 —— 这个命令启动了一个对 JSX 的自动监听器。

如果此时你用这段 **[JSX 入门代码](https://gist.github.com/gaearon/c8e112dc74ac44aac4f673f2c39d19d1/raw/09b951c86c1bf1116af741fa4664511f2f179f0a/like_button.js)**创建一个 `src/like_button.js` 文件，监听器会创建一个预处理过的 `like_button.js` 文件，它包含了适用于浏览器的普通 JavaScript 代码。当你编辑带有 JSX 的源文件时，转换过程将自动重新执行。

这样，在旧浏览器上也能够使用现代 JavaScript 的语法特性，比如 class。我们刚才使用的工具叫 Babel，你可以从[它的文档](https://babeljs.io/docs/en/babel-cli/)中了解更多。

如果你认为你已经习惯了构建工具，并希望它们能为你做更多事，[下一章节](/docs/create-a-new-react-app.html)描述了一些最流行和易上手的工具链。如果不使用构建工具 —— 直接以 scripts 标签的方式也可以很好地完成工作！
