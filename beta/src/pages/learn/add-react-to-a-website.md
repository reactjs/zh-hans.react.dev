---
title: 在网站中添加 React
translators:
  - Atrist
---

<Intro>

React 在设计之初就可以被渐进式适配，并且你可以根据需要选择性地使用 React 。无论你是使用微前端，已有项目，还是仅仅想尝试一下 React，你只需要几行代码便可以将 React 添加到你的 HTML 页面--无需构建工具！

</Intro>

## 一分钟用上 React {/*add-react-in-one-minute*/}

在本小节中，我们会展示如何将 React 组件添加到现有的 HTML 页面中。你可以基于你自己的网站，或者创建一个 [空的 HTML 文件](https://gist.github.com/rachelnabors/7b33305bf33776354797a2e3c1445186/archive/859eac2f7079c9e1f0a6eb818a9684a464064d80.zip) 来进行练习。你只需要连接到网络，和一个像 Notepad 的文本编辑器（也可以是 vscode，可以查看我们的文档来 [设置你自己的编辑器](/learn/editor-setup/)） ！

### 步骤 1：添加一个 DOM 容器到 HTML {/*step-1-add-an-element-to-the-html*/}

首先，打开你想要编辑的 HTML 页面，添加一个带有唯一 `id` 属性的 `<div>` 标签，用于标记你想要用 React 显示内容的位置。

你可以在 `<body>` 标签内的任何地方放置一个类似 `<div>` 的容器元素。根据需要，你可以在一个页面上放置多个独立的 DOM 容器。它们通常是空标签 —— React 会替换 DOM 容器内的任何已有内容。

```html {3}
<!-- ... 其它 HTML ... -->

<div id="component-goes-here"></div>

<!-- ... 其它 HTML ... -->
```

### 步骤 2：添加 Script 标签 {/*step-2-add-the-script-tags*/}

在 `</body>` 结束标签之前，向 HTML 页面中添三个 `<script>` 标签用于加载以下文件：

- [**react.development.js**](https://unpkg.com/react@17/umd/react.development.js)  React 的核心文件
- [**react-dom.development.js**](https://unpkg.com/react-dom@17/umd/react-dom.development.js) 让 React 将 HTML 元素渲染到 [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model) 的依赖文件。
- **like_button.js** 步骤 3 中编写你自己组件的脚本文件。

<Gotcha>

部署时，将 "development.js" 替换为 "production.min.js"

</Gotcha>

```html
  <!-- 其他内容 -->
  <script src="https://unpkg.com/react@17/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js" crossorigin></script>
  <script src="like_button.js"></script>
</body>
```

### 步骤 3：创建一个 React 组件 {/*step-3-create-a-react-component*/}

在 HTML 页面文件的同级目录下创建一个名为 **like_button.js** 的文件, 并将下面的代码片段添加到文件中。这段代码定义了一个名为 LikeButton 的 React 组件。[你可以在这里了解更多关于如何创建一个组件。](/learn/your-first-component)

```js
'use strict';

function LikeButton() {
  const [liked, setLiked] = React.useState(false);

  if (liked) {
    return 'You liked this!';
  }

  return React.createElement(
    'button',
    {
      onClick: () => setLiked(true),
    },
    'Like'
  );
}
```

### 步骤 4： 把你的 React 组件添加到网站中 {/*step-4-add-your-react-component-to-the-page*/}

最后, 在 **like_button.js** 底部添加以下两行代码。这两行代码会找到我们在步骤 1 中添加到 HTML 里的 `<div>`，然后在它内部显示我们的 React 组件 “like” 按钮。

```js
const domContainer = document.getElementById('component-goes-here');
ReactDOM.render(React.createElement(LikeButton), domContainer);
```

**恭喜! 你刚刚已经将第一个 React 组件添加到你的网站中!**

- [查看完整的示例源码](https://gist.github.com/rachelnabors/c64b3aeace8a191cf5ea6fb5202e66c9)
- [下载完整示例（2KB 压缩包）](https://gist.github.com/rachelnabors/c64b3aeace8a191cf5ea6fb5202e66c9/archive/7b41a88cb1027c9b5d8c6aff5212ecd3d0493504.zip)

#### 你可以重复使用你的组件! {/*you-can-reuse-components*/}

你可能希望在 HTML 页面的多个位置展示同一个 React 组件。你可以多次调用 `ReactDOM.render()` 来实现这个想法。 当页面中以 React 驱动的不同部分是相互独立的，这种策略通常是非常有用的。

1. 在 **index.html**，添加另外一个的容器元素 `<div id="component-goes-here-too"></div>`.
2. 在 **like_button.js**, 为新的容器元素添加 `ReactDOM.render()`:

```js {6,7,8,9}
ReactDOM.render(
  React.createElement(LikeButton),
  document.getElementById('component-goes-here')
);

ReactDOM.render(
  React.createElement(LikeButton),
  document.getElementById('component-goes-here-too')
);
```

这有[一个示例，它显示了三次 “Like” 按钮，并向各自传入了一些数据](https://gist.github.com/rachelnabors/c0ea05cc33fbe75ad9bbf78e9044d7f8)!

### 步骤 5: 为生产环境压缩 JavaScript 代码 {/*step-5-minify-javascript-for-production*/}

未经压缩的 JavaScript 可能会显著降低用户的访问速度。在将你的网站部署到生产环境之前，最好的方式是对你的脚本文件进行压缩。

- **如果你没有一个代码压缩的步骤**, [这有一个配置它的方式](https://gist.github.com/gaearon/42a2ffa41b8319948f9be4076286e1f3).
- **如果你已经压缩了** 应用代码, 如果你确保已部署的 HTML 加载了以 `production.min.js` 结尾的 React 版本，那么你的网站是生产就绪（production-ready）的：

```html
<script src="https://unpkg.com/react@17/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js" crossorigin></script>
```

## 使用 React 和 JSX {/*try-react-with-jsx*/}

在上面的示例中，我们只依赖了浏览器原生支持的特性。 这就是为什么我们在 **like_button.js** 中调用了 一个 JavaScript 函数来告诉 React 要显示什么：

```js
return React.createElement('button', {onClick: () => setLiked(true)}, 'Like');
```

然而，React 还提供了一种使用 [JSX](/learn/writing-markup-with-jsx) 编写界面的方式，，一种类于 HTML 的 JavaScript 语法：

```jsx
return <button onClick={() => setLiked(true)}>Like</button>;
```

这两段代码是等价的。 JSX 是一种在 JavaScript 中描述标签的语法。多数人觉得这样编写 UI 代码更方便 —— 无论是使用 React 还是其它库。您可能会在其他项目中发现 “标签在 JavaScript 中随处散布”！

> 你可以通过 [在线编译器](https://babeljs.io/en/repl#?babili=false&browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=DwIwrgLhD2B2AEcDCAbAlgYwNYF4DeAFAJTw4B88EAFmgM4B0tAphAMoQCGETBe86WJgBMAXJQBOYJvAC-RGWQBQ8FfAAyaQYuAB6cFDhkgA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=es2015%2Creact%2Cstage-2&prettier=false&targets=&version=7.4.3) 试用 JSX。

### 尝试 JSX {/*try-jsx*/}

在项目中尝试 JSX 最快的方法是在页面中添加这几个 `<script>` 标签：

```html {6}
<!-- ... 其他 <head> ... -->

<script src="https://unpkg.com/react@17/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js" crossorigin></script>

<script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>

</head>
<!-- ... 其他 <body> ... -->
```

现在，你可以在任何 `<script>` 标签内使用 JSX，方法是在为其添加 `type="text/babel"` 属性。举一个例子:

```jsx {1}
<script type="text/babel">
  ReactDOM.render(
  <h1>Hello, world!</h1>, document.getElementById('root') );
</script>
```

使用 JSX 编写 **like_button.js**:

1. 在 **like_button.js**, 用

```jsx
return <button onClick={() => setLiked(true)}>Like</button>;
```
替换
```js
return React.createElement(
  'button',
  {
    onClick: () => setLiked(true),
  },
  'Like'
);
```



1. 在 **index.html**，为 link_button_js 的` script` 标签添加  `type="text/babel"` 属性 :

```html
<script src="like_button.js" type="text/babel"></script>
```

这是 [一个使用了 JSX 的 HTML 文件的例子](https://raw.githubusercontent.com/reactjs/reactjs.org/main/static/html/single-file-example.html) ，你可以下载并尝试使用。

这种方式适合于学习和创建简单的示例。然而，它会使你的网站变慢，并且不适用**于生产环境**。当你准备好更进一步时，删除你添加的这个新的 `<script>` 标签以及 `type="text/babel"` 属性。取而代之的，在下一小节中，你将设置一个 JSX 预处理器来自动转换所有 `<script>` 标签的内容。

### 将 JSX 添加到项目 {/*add-jsx-to-a-project*/}

将 JSX 添加到项目中并不需要诸如打包工具像 [bundler](/learn/start-a-new-react-project#custom-toolchains) 或开发服务器那样复杂的工具。本质上，添加 JSX 就像添加 CSS 预处理器一样。

在终端上跳转到你的项目文件夹，然后粘贴这两个命令：(**确保你的计算机安装了 [Node.js](https://nodejs.org/) !**):

1. `npm init -y` (如果失败，[这是修复办法](https://gist.github.com/gaearon/246f6380610e262f8a648e3e51cad40d))
2. `npm install babel-cli@6 babel-preset-react-app@3`

我们在这里使用 npm 只是用来安装 JSX 预处理器，之后你不再需要它。React 和应用程序代码都可以继续使用 `<script>` 标签而不做任何更改。

恭喜！你刚刚为你的项目加入了一个 **生产就绪（production-ready）的 JSX 配置环境**。

### 运行 JSX 预处理器 {/*run-the-jsx-preprocessor*/}

当你编辑保存带有 JSX 的源文件时，这个转换过程将自动重新执行，并把 JSX 文件转换成普通的 JavaScript 文件。

1. 创建一个名为 `src` 的文件夹
2. 在终端执行这个命令： `npx babel --watch src --out-dir . --presets react-app/prod ` (不要等待它运行结束 —— 这个命令启动了一个对 JSX 的自动监听器。)
3. 把包含 JSX 语法的 **like_button_js**文件移动到新创建的 **src** 文件夹中(或者在 **src**文件夹中创建一个包含[此段代码](https://gist.githubusercontent.com/rachelnabors/ffbc9a0e33665a58d4cfdd1676f05453/raw/652003ff54d2dab8a1a1e5cb3bb1e28ff207c1a6/like_button.js))的 **like_button_js** 的文件)

监听器会创建一个预处理过的 **like_button.js** 文件，它包含了适用于浏览器的普通 JavaScript 代码.

<Gotcha>

如果你看到一个错误消息显示为：“You have mistakenly installed the `babel` package”，你可能错过了 [上一步](#add-jsx-to-a-project) 。在同一个文件夹中执行它，然后重试。

</Gotcha>

这样，在旧浏览器上也能够使用现代 JavaScript 的语法特性，比如 class。我们刚才使用的工具叫 Babel，你可以从[它的文档](https://babeljs.io/docs/en/babel-cli/)中了解更多。.

如果你认为你已经习惯了构建工具，并希望它们能为你做更多事, [我们在这描述了一些最流行和易上手的工具链](/learn/start-a-new-react-project).

<DeepDive title="React without JSX">

最初引入 JSX 是为了想让 React 编写组件的感觉就像编写 HTML 一样，但也有可能你不想又或者不能使用 JSX，这里也有两种解决方案：

- 使用像 [htm](https://github.com/developit/htm) 这样的 JSX 替代品，它不使用编译器——它使用 JavaScript 的原生标记模板。
- 使用 [`React.createElement()`](/reference/createelement)，它具有下面解释的特殊结构。

用 JSX 编写的代码：

```jsx
function Hello(props) {
  return <div>Hello {props.toWhat}</div>;
}

ReactDOM.render(<Hello toWhat="World" />, document.getElementById('root'));
```

如果使用 `React.createElement()`, 将会是这样:

```js
function Hello(props) {
  return React.createElement('div', null, `Hello ${props.toWhat}`);
}

ReactDOM.render(
  React.createElement(Hello, {toWhat: 'World'}, null),
  document.getElementById('root')
);
```

`React.createElement(component, props, children)`，它接受三个参数：

1. 一个 **组件** , 它可以是表示 HTML 标签的字符串也可以是一个函数。
2. 一个对象，包含你想传递给组件的 [所有数据](/learn/passing-props-to-a-component) 。
3. 一个对象，表示此组件存在所有子元素，比如一串文本字符。

如果你不想每次都键入 `React.createElement`，通常的做法是创建快捷方式：

```js
const e = React.createElement;

ReactDOM.render(e('div', null, 'Hello World'), document.getElementById('root'));
```

如果你使用 React.createElement() 的这种简写形式，那么在没有 JSX 的情况下使用 React 几乎同样方便。

</DeepDive>
