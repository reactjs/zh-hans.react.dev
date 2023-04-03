---
title: 在网站中添加 React
translators:
  - Atrist
  - yyyang1996
  - QC-L
---

<Intro>

无需使用 React 重构你的站点。只需花一分钟，将 React 添加到 HTML 中，且无需安装，即可立即开始编写交互式组件。

</Intro>

<YouWillLearn>

* 如何 1 分钟内将 React 添加到 HTML 中
* JSX 语法是什么及其用法
* 如何设置可用于生产环境的 JSX 预处理器

</YouWillLearn>

## 1 分钟拥有 React {/*add-react-in-one-minute*/}

React 从一开始就是为渐进式开发而生。大多数网站并没有（也不需要）完全使用 React 进行构建。本小节中，我们将向你展示如何在现有 HTML 页面中添加交互式组件的方法。

你可以在你自己的网站上尝试，或者创建一个 [空的 HTML 文件](https://gist.github.com/gaearon/edf814aeee85062bc9b9830aeaf27b88/archive/3b31c3cdcea7dfcfd38a81905a0052dd8e5f71ec.zip) 来进行练习。只需将电脑连接到网络并安装一款文本编辑器即可，如 Notepad 或者 VSCode。（如需语法高亮，可以通过 [如何配置你的编辑器](/learn/editor-setup/) 章节来实现！)

### 步骤 1：添加一个根标签 {/*step-1-add-a-root-html-tag*/}

首先，打开你需要编辑的 HTML 页面。在你想用 React 展示内容的地方添加一个空的 `<div>` 标签。并给这个 `<div>` 标签一个唯一的 `id` 属性值。例如：

```html {3}
<!-- ... 其它 HTML ... -->

<div id="like-button-root"></div>

<!-- ... 其它 HTML ... -->
```

它被称为"根"，因为这是 React 树开始的地方。你可以在 `<body>` 标签中的任何位置放置一个类似的根 HTML 标签。让它为内容留白。因为 React 会用你编写的 React 组件来替换它的内容。

你可以根据需要，在一个页面上设置多个根 HTML 标签。

### 步骤 2：添加 script 标签 {/*step-2-add-the-script-tags*/}

在 HTML 页面的 `</body>` 结束标签之前，添加三个 `<script>` 标签用于加载以下文件：

- [`react.development.js`](https://unpkg.com/react@18/umd/react.development.js) 可以让你定义 React 组件。
- [`react-dom.development.js`](https://unpkg.com/react-dom@18/umd/react-dom.development.js) 让 React 可以将 HTML 元素渲染到 [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model) 中。
- **`like-button.js`** 是你在步骤 3 中编写组件的地方！

你的 HTML 文件的结尾处，应该如下所示：

```html
    <!-- end of the page -->
    <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
    <script src="like-button.js"></script>
  </body>
</html>
```

<Pitfall>

部署时，你需要将 “development.js” 替换为 “production.min.js”！React 的 development 版本中内置了很多有用的错误信息，但同时也会降低你网站的访问速度。

</Pitfall>

### 步骤 3：创建一个 React 组件 {/*step-3-create-a-react-component*/}

在 HTML 页面文件的同级目录下创建一个名为 **`like_button.js`** 的文件，并将如下代码片段添加到该文件中。这段代码定义了一个名为 LikeButton 的 React 组件。（在 [快速入门](/learn) 中，了解更多关于编写组件的信息。)

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

### 步骤 4：把你的 React 组件添加到页面中 {/*step-4-add-your-react-component-to-the-page*/}

最后，在 **`like_button.js`** 底部添加以下三行代码。这几行代码会找到我们在步骤 1 中添加到 HTML 里的 `<div>`，接着创建了一个React 的根，最后在其内部展示了我们的 React 组件 —— "Like" 按钮：

```js
const rootNode = document.getElementById('like-button-root');
const root = ReactDOM.createRoot(rootNode);
root.render(React.createElement(LikeButton));
```

**恭喜！你刚刚已成功将第一个 React 组件添加到你的网站当中**！

- [查看完整的示例源码](https://gist.github.com/gaearon/0b535239e7f39c524f9c7dc77c44f09e)
- [下载完整示例（2KB 压缩包）](https://gist.github.com/gaearon/0b535239e7f39c524f9c7dc77c44f09e/archive/651935b26a48ac68b2de032d874526f2d0896848.zip)

#### 复用你的组件 {/*you-can-reuse-components*/}

你可能需要在同一 HTML 页面中的多个位置展示 React 组件。如果页面中由 React 驱动的部分相互独立，那复用就显得非常必要。你可以通过在你的 HTML 中放置多个根标签，然后用 `ReactDOM.createRoot()` 在每个根标签中渲染 React 组件来实现这一点。例如：

1. 在 **`index.html`** 中，添加另外一个的容器元素 `<div id="another-root"></div>`。
2. 在 **`like-button.js`** 文件最后，再添加以下三行代码：

```js {6,7,8,9}
const anotherRootNode = document.getElementById('another-root');
const anotherRoot = ReactDOM.createRoot(anotherRootNode);
anotherRoot.render(React.createElement(LikeButton));
```

如果你需要在很多地方渲染同一个组件，你可以为每个根的指定一个 `class`，而不是 `id`，然后再把它们找出来。这是 [一个显示三个 "Like" 按钮，并向每个按钮内传递了数据的示例](https://gist.github.com/gaearon/779b12e05ffd5f51ffadd50b7ded5bc8)。

### 步骤 5：为生产环境压缩 JavaScript 代码 {/*step-5-minify-javascript-for-production*/}

未经压缩的 JavaScript 可能会极大降低用户的访问速度。在将你的网站部署到生产环境之前，请务必对你的脚本文件进行压缩。

- **如果你不知道如何进行压缩**，[请参考该配置教程](https://gist.github.com/gaearon/ee0201910608f15df3f8cd66aa83f98e)。
- 如果你已完成了 **对应用代码的压缩**，并且确保已部署的 HTML 加载的是以 `production.min.js` 结尾的 React 版本，那么你的网站就已完成生产部署（production-ready）：

```html
<script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
```

## 尝试使用 JSX 编写 React {/*try-react-with-jsx*/}

在上面的示例中，依靠的是浏览器原生就支持的特性。这也就是为什么我们在 **`like_button.js`** 中要调用 JavaScript 的函数，用以告知 React 要显示的内容：

```js
return React.createElement('button', {onClick: () => setLiked(true)}, 'Like');
```

然而，React 还提供了一种使用 [JSX](/learn/writing-markup-with-jsx) 编写界面的方式，一种类似 HTML 的 JavaScript 语法：

```jsx
return <button onClick={() => setLiked(true)}>Like</button>;
```

这两段代码是等价的。JSX 是一种在 JavaScript 中描述标签的语法。多数人觉得这样编写 UI 代码更方便 —— 无论是使用 React 还是其它库。

> 你可以通过 [在线转换器](https://babeljs.io/en/repl#?babili=false&browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=DwIwrgLhD2B2AEcDCAbAlgYwNYF4DeAFAJTw4B88EAFmgM4B0tAphAMoQCGETBe86WJgBMAXJQBOYJvAC-RGWQBQ8FfAAyaQYuAB6cFDhkgA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=es2015%2Creact%2Cstage-2&prettier=false&targets=&version=7.17) 试用 JSX。

### 试用 JSX {/*try-jsx*/}

试用 JSX 的最快方法是将 Babel 编译器作为 `<script>` 标签引入页面中。把它放置在 **`like-button.js`** 之前，然后在 **`like-button.js`** 的 `script` 标签上添加 `type="text/babel"` 属性：

```html {3,4}
  <script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="like-button.js" type="text/babel"></script>
</body>
```

现在你可以编辑 **`like-button.js`**，并将

```js
return React.createElement(
  'button',
  {
    onClick: () => setLiked(true),
  },
  'Like'
);
```

替换为等效的 JSX 代码：

```jsx
return (
  <button onClick={() => setLiked(true)}>
    Like
  </button>
);
```

一开始，你可能会觉得将 JS 和标签混合在一起会有些奇怪，但后面你会慢慢爱上它的！欲了解更多，请参阅 [用 JSX 编写标签](/learn/writing-markup-with-jsx) 的介绍。这是 [一个使用了 JSX 的 HTML 文件示例](https://raw.githubusercontent.com/reactjs/reactjs.org/main/static/html/single-file-example.html)，你可以下载并尝试使用。

<Pitfall>

引入 Babel 的 `<script>` 编译器对于学习和创建简单的示例是很便捷的。但是，**它会使网站变慢，并不适用于生产环境**。当你准备好更进一步时，应该删除 Babel 的 `<script>` 标签，并移除在这一步中添加的 `type="text/babel"` 属性。作为替代方案，在下一小节中，我们将设置一个 JSX 的预处理器，将所有的 `<script>` 标签从 JSX 转为 JS。

</Pitfall>

### 将 JSX 添加到项目 {/*add-jsx-to-a-project*/}

将 JSX 添加到项目中并不需要诸如 [打包工具](/learn/start-a-new-react-project#custom-toolchains) 或开发服务器那样复杂的工具。本质上，添加 JSX 就像添加 CSS 预处理器一样。

在终端上进入你的项目文件夹，然后执行如下两个命令：(**确保你的计算机安装了 [Node.js](https://nodejs.org/)！**)：

1. `npm init -y` (如果失败，请参阅, [修复方案](https://gist.github.com/gaearon/246f6380610e262f8a648e3e51cad40d))
2. `npm install @babel/cli@7 babel-preset-react-app@10`

此处使用 npm 只是用于安装 JSX 预处理器，之后便不再需要它。React 和应用程序代码都可以继续使用 `<script>` 标签而不做任何更改。

恭喜！你为你的项目成功添加了 **生产环境（production-ready）的 JSX 配置**。

### 运行 JSX 预处理器 {/*run-the-jsx-preprocessor*/}

你可以对 JSX 文件进行预处理。当你编辑保存带有 JSX 的源文件时，这个转换过程将自动重新执行，并把 JSX 文件转换为一个全新的，浏览器可以识别的普通 JavaScript 文件，以下是设置方式：

1. 创建一个名为 **`src`** 的文件夹
2. 在终端执行这个命令：`npx babel --watch src --out-dir . --presets babel-preset-react-app/prod ` （无需等待运行结果 —— 这个命令会自动启动一个观察器，观察对 `src` 内 JSX 的编辑。）
3. 将已经 JSX 化的 **`like-button.js`** ([它看起来应该像这样](https://gist.githubusercontent.com/gaearon/be5ae0fbf563d6c5fe5c1563907b13d2/raw/4c0d0b8c7f4fcb341720424c28c72059f8174c62/like-button.js))！文件移动到新的 **`src`** 目录下。

监听器会创建一个预处理过的 **`like_button.js`** 文件，它包含了适用于浏览器的普通 JavaScript 代码.

<Pitfall>

如果你看到一个错误消息显示为：“You have mistakenly installed the `babel` package”，原因可能是未按照 [上一步骤](#add-jsx-to-a-project) 进行操作。在同一个文件夹中执行上一步骤中的命令，然后重试。

</Pitfall>

我们刚才使用的工具叫 Babel，你可以从 [它的文档](https://babeljs.io/docs/en/babel-cli/) 中了解更多。除了 JSX 以外，它还可以让你使用最新的 JavaScript 语法特性，而无需担心不适配旧的浏览器。

如果你认为你已经习惯了构建工具，并希望它们能为你做更多事，[我们在这描述了一些最流行和易上手的工具链](/learn/start-a-new-react-project)。

<DeepDive>

#### React without JSX {/*react-without-jsx*/}

最初引入 JSX 是为了想让 React 编写组件的感觉就像编写 HTML 一样简单，但总有例外，你不想或者不能使用 JSX，此时可以参考其他两种解决方案：

- 使用像 [htm](https://github.com/developit/htm) 这样的 JSX 替代品，它使用 JavaScript 的 [模板字符串](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Template_literals) 来取代编译器。
- 使用 [`React.createElement()`](/reference/react/createElement) ，它具有下面解释的特殊结构

用 JSX 编写的代码：

```jsx
function Hello(props) {
  return <div>Hello {props.toWhat}</div>;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Hello toWhat="World" />, );
```

如果使用 `React.createElement()`，将会是这样：

```js
function Hello(props) {
  return React.createElement('div', null, 'Hello ', props.toWhat);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  React.createElement(Hello, { toWhat: 'World' }, null)
);
```

`React.createElement(component, props, ...children)`，它接受三个参数。

以下是它的工作原理：

1. 一个**组件**，它既可以是一个表示 HTML 标签名的字符串，也可以是一个函数组件。
2. 一个对象，包含 [你想传递给组件的 **props**](/learn/passing-props-to-a-component)。
3. 其余的参数代表该组件可能拥有多个子元素，比如文本字符串或其他元素。

如果你不想每次都键入 `React.createElement`，通常的做法是使用简写：

```js
const e = React.createElement;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(e('div', null, 'Hello World'));
```

然后，如果你喜欢这种风格，如此编写也可以和 JSX 一样方便。

</DeepDive>
