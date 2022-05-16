---
title: 在网站中添加 React
translators:
  - Atrist
  - yyyang1996
  - QC-L
---

<Intro>

<<<<<<< HEAD
React 从一开始就是为渐进式开发而生，你可以根据需要选择性地使用 React。无论你是想简单试用，或者在已有项目中添加，甚至是应用于微前端，都只需几行代码便可实现在 HTML 页面中使用交互式的 React 组件，并且不依赖任何构建工具。

</Intro>

## 一分钟用上 React {/*add-react-in-one-minute*/}

在本小节中，我们会展示如何将 React 组件添加到现有的 HTML 页面中。你可以在你自己的网站上尝试，或者创建一个 [空的 HTML 文件](https://gist.github.com/rachelnabors/7b33305bf33776354797a2e3c1445186/archive/859eac2f7079c9e1f0a6eb818a9684a464064d80.zip) 来进行练习。你只需要连接到网络，使用一个像 Notepad 的文本编辑器（也可以是 VSCode，可以查看我们的文档来学习 [如何设置你的编辑器](/learn/editor-setup/)）！

### 步骤 1：添加一个 DOM 容器到 HTML {/*step-1-add-an-element-to-the-html*/}

首先，打开你想编辑的 HTML 页面，添加一个带有唯一 `id` 属性的空 `<div>` 标签，用于标记你想要用 React 显示内容的位置。

你可以在 `<body>` 标签内的任意位置，放置一个类似 `<div>` 的容器元素。你还可以根据需要在一个页面中放置多个独立的 DOM 容器，这些容器通常都是空标签，因为 React 会替换 DOM 容器内的已有内容。
=======
You don't have to build your whole website with React. Adding React to HTML doesn't require installation, takes a minute, and lets you start writing interactive components right away.

</Intro>

<YouWillLearn>

* How to add React to an HTML page in one minute
* What is the JSX syntax and how to quickly try it
* How to set up a JSX preprocessor for production

</YouWillLearn>

## Add React in one minute {/*add-react-in-one-minute*/}

React has been designed from the start for gradual adoption. Most websites aren't (and don't need to be) fully built with React. This guide shows how to add some “sprinkles of interactivity” to an existing HTML page.

Try this out with your own website or [an empty HTML file](https://gist.github.com/gaearon/edf814aeee85062bc9b9830aeaf27b88/archive/3b31c3cdcea7dfcfd38a81905a0052dd8e5f71ec.zip). All you need is an internet connection and a text editor like Notepad or VSCode. (Here's [how to configure your editor](/learn/editor-setup/) for syntax highlighting!)

### Step 1: Add a root HTML tag {/*step-1-add-a-root-html-tag*/}

First, open the HTML page you want to edit. Add an empty `<div>` tag to mark the spot where you want to display something with React. Give this `<div>` a unique `id` attribute value. For example:
>>>>>>> 951fae39f0e12dc061f1564d02b2f4707c0541c4

```html {3}
<!-- ... 其它 HTML ... -->

<div id="like-button-root"></div>

<!-- ... 其它 HTML ... -->
```

<<<<<<< HEAD
### 步骤 2：添加 Script 标签 {/*step-2-add-the-script-tags*/}
=======
It's called a "root" because it's where the React tree will start. You can place a root HTML tag like this anywhere inside the `<body>` tag. Leave it empty because React will replace its contents with your React component.

You may have as many root HTML tags as you need on one page.

### Step 2: Add the script tags {/*step-2-add-the-script-tags*/}
>>>>>>> 951fae39f0e12dc061f1564d02b2f4707c0541c4

在 HTML 页面的 `</body>` 结束标签之前，添加三个 `<script>` 标签用于加载以下文件：

<<<<<<< HEAD
- [**react.development.js**](https://unpkg.com/react@17/umd/react.development.js) React 的核心代码文件
- [**react-dom.development.js**](https://unpkg.com/react-dom@17/umd/react-dom.development.js) 这个脚本文件可以让 React 将 HTML 元素渲染到 [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model) 中。
- **like_button.js** 步骤 3 中编写的组件脚本文件。

<Gotcha>

部署时，你需要将 “development.js” 替换为 “production.min.js”。

</Gotcha>

```html
  <!-- 其他内容 -->
  <script src="https://unpkg.com/react@17/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js" crossorigin></script>
  <script src="like_button.js"></script>
</body>
```

### 步骤 3：创建一个 React 组件 {/*step-3-create-a-react-component*/}

在 HTML 页面文件的同级目录下创建一个名为 **like_button.js** 的文件，并将下述代码片段添加到该文件中。这段代码定义了一个名为 LikeButton 的 React 组件。[你可以在这里了解更多关于如何创建一个组件](/learn/your-first-component)。
=======
- [`react.development.js`](https://unpkg.com/react@18/umd/react.development.js) lets you define React components.
- [`react-dom.development.js`](https://unpkg.com/react-dom@18/umd/react-dom.development.js) lets React render HTML elements to the [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model).
- **`like-button.js`** is where you'll write your component in the next step!

Your HTML should now end like this:

```html
    <!-- end of the page -->
    <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
    <script src="like-button.js"></script>
  </body>
</html>
```

<Gotcha>

Before deploying to a live website, make sure to replace `development.js` with `production.min.js`! Development builds of React provide more helpful error messages, but slow down your website *a lot.*

</Gotcha>

### Step 3: Create a React component {/*step-3-create-a-react-component*/}

Create a file called **`like-button.js`** next to your HTML page, add this code snippet, and save the file. This code defines a React component called `LikeButton`. (Learn more about making components in the [Quick Start!](/learn))
>>>>>>> 951fae39f0e12dc061f1564d02b2f4707c0541c4

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

<<<<<<< HEAD
### 步骤 4： 把你的 React 组件添加到页面中 {/*step-4-add-your-react-component-to-the-page*/}

最后，在 **like_button.js** 底部添加以下三行代码。这三行代码会找到我们在步骤 1 中添加到 HTML 里的 `<div>`，接着创建一个 React 应用，最后在其内部显示我们的 React 组件 “like” 按钮。
=======
### Step 4: Add your React component to the page {/*step-4-add-your-react-component-to-the-page*/}

Lastly, add three lines to the bottom of **`like-button.js`**. These lines of code find the `<div>` you added to the HTML in the first step, create a React root, and then display the "Like" button React component inside of it:
>>>>>>> 951fae39f0e12dc061f1564d02b2f4707c0541c4

```js
const rootNode = document.getElementById('like-button-root');
const root = ReactDOM.createRoot(rootNode);
root.render(React.createElement(LikeButton));
```

**恭喜！你刚刚已成功将第一个 React 组件添加到你的网站当中**！

<<<<<<< HEAD
- [查看完整的示例源码](https://gist.github.com/rachelnabors/c64b3aeace8a191cf5ea6fb5202e66c9)
- [下载完整示例（2KB 压缩包）](https://gist.github.com/rachelnabors/c64b3aeace8a191cf5ea6fb5202e66c9/archive/7b41a88cb1027c9b5d8c6aff5212ecd3d0493504.zip)
=======
- [View the full example source code](https://gist.github.com/gaearon/0b535239e7f39c524f9c7dc77c44f09e)
- [Download the full example (2KB zipped)](https://gist.github.com/gaearon/0b535239e7f39c524f9c7dc77c44f09e/archive/651935b26a48ac68b2de032d874526f2d0896848.zip)
>>>>>>> 951fae39f0e12dc061f1564d02b2f4707c0541c4

#### 复用你的组件 {/*you-can-reuse-components*/}

<<<<<<< HEAD
你可能需要在同一 HTML 页面的多个位置展示相同的 React 组件。你可以通过多次调用 `ReactDOM.createRoot()` 来实现这个想法。当页面中依赖 React 的部分相互独立时，这种策略通常非常有效。

1. 在 **index.html**，添加另外一个的容器元素 `<div id="component-goes-here-too"></div>`。
2. 在 **like_button.js**，为新的容器元素添加 `ReactDOM.render()`：
=======
You might want to display React components in multiple places on the same HTML page. This is useful if React-powered parts of your page are separate from each other. You can do this by putting multiple root tags in your HTML and then rendering React components inside each of them with `ReactDOM.createRoot()`. For example:

1. In **`index.html`**, add an additional container element `<div id="another-root"></div>`.
2. In **`like-button.js`**, add three more lines at the end:
>>>>>>> 951fae39f0e12dc061f1564d02b2f4707c0541c4

```js {6,7,8,9}
const anotherRootNode = document.getElementById('another-root');
const anotherRoot = ReactDOM.createRoot(anotherRootNode);
anotherRoot.render(React.createElement(LikeButton));
```

<<<<<<< HEAD
具体请参阅此 [示例，它展示了三次 “Like” 按钮，并向分别向按钮中传递了一些数据](https://gist.github.com/rachelnabors/c0ea05cc33fbe75ad9bbf78e9044d7f8)！
=======
If you need to render the same component in many places, you can assign a CSS `class` instead of `id` to each root, and then find them all. Here is [an example that displays three "Like" buttons and passes data to each.](https://gist.github.com/gaearon/779b12e05ffd5f51ffadd50b7ded5bc8)
>>>>>>> 951fae39f0e12dc061f1564d02b2f4707c0541c4

### 步骤 5：为生产环境压缩 JavaScript 代码 {/*step-5-minify-javascript-for-production*/}

未经压缩的 JavaScript 可能会极大降低用户的访问速度。在将你的网站部署到生产环境之前，请务必对你的脚本文件进行压缩。

- **如果你不知道如何进行压缩**，[请参考该配置教程](https://gist.github.com/gaearon/42a2ffa41b8319948f9be4076286e1f3)。
- 如果你已完成了 **对应用代码的压缩**，并且确保已部署的 HTML 加载的是以 `production.min.js` 结尾的 React 版本，那么你的网站就已完成生产部署（production-ready）：

```html
<script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
```

## 尝试使用 JSX 编写 React {/*try-react-with-jsx*/}

<<<<<<< HEAD
在上面的示例中，依靠的是浏览器原生就支持的特性。这也就是为什么我们在 **like_button.js** 中要调用 JavaScript 的函数，用以告知 React 要显示的内容：
=======
The examples above rely on features that are natively supported by browsers. This is why **`like-button.js`** uses a JavaScript function call to tell React what to display:
>>>>>>> 951fae39f0e12dc061f1564d02b2f4707c0541c4

```js
return React.createElement('button', {onClick: () => setLiked(true)}, 'Like');
```

然而，React 还提供了一种使用 [JSX](/learn/writing-markup-with-jsx) 编写界面的方式，一种类似 HTML 的 JavaScript 语法：

```jsx
return <button onClick={() => setLiked(true)}>Like</button>;
```

<<<<<<< HEAD
这两段代码是等价的。JSX 是一种在 JavaScript 中描述标签的语法。多数人觉得这样编写 UI 代码更方便 —— 无论是使用 React 还是其它库。你可能会在其他项目中看到 “混在 JavaScript 代码中的标签”！

> 你可以通过 [在线转换器](https://babeljs.io/en/repl#?babili=false&browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=DwIwrgLhD2B2AEcDCAbAlgYwNYF4DeAFAJTw4B88EAFmgM4B0tAphAMoQCGETBe86WJgBMAXJQBOYJvAC-RGWQBQ8FfAAyaQYuAB6cFDhkgA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=es2015%2Creact%2Cstage-2&prettier=false&targets=&version=7.4.3) 试用 JSX。
=======
These two code snippets are equivalent. JSX is popular syntax for describing markup in JavaScript. Many people find it familiar and helpful for writing UI code--both with React and with other libraries.

> You can play with transforming HTML markup into JSX using [this online converter](https://babeljs.io/en/repl#?babili=false&browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=DwIwrgLhD2B2AEcDCAbAlgYwNYF4DeAFAJTw4B88EAFmgM4B0tAphAMoQCGETBe86WJgBMAXJQBOYJvAC-RGWQBQ8FfAAyaQYuAB6cFDhkgA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=es2015%2Creact%2Cstage-2&prettier=false&targets=&version=7.17).
>>>>>>> 951fae39f0e12dc061f1564d02b2f4707c0541c4

### 试用 JSX {/*try-jsx*/}

<<<<<<< HEAD
在项目中试用 JSX 最快的方法，就是在页面中添加这几个 `<script>` 标签：

```html {6}
<!-- ... 其他 <head> ... -->

<script src="https://unpkg.com/react@17/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js" crossorigin></script>

<script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>

</head>
<!-- ... 其他 <body> ... -->
```

添加完成后，你便可以在任何添加了 `type="text/babel"` 属性的 `<script>` 标签内使用 JSX。示例如下：

```jsx {1}
<script type="text/babel">
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<h1>Hello, world!</h1>);
</script>
```

使用 JSX 编写 **like_button.js**：

1. 在 **like_button.js** 文件中，将
=======
The quickest way to try JSX is to add the Babel compiler as a `<script>` tag to the page. Put it before **`like-button.js`**, and then add `type="text/babel"` attribute to the `<script>` tag for **`like-button.js`**:

```html {3,4}
  <script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="like-button.js" type="text/babel"></script>
</body>
```

Now you can open **`like-button.js`** and replace
>>>>>>> 951fae39f0e12dc061f1564d02b2f4707c0541c4

```js
return React.createElement(
  'button',
  {
    onClick: () => setLiked(true),
  },
  'Like'
);
```

<<<<<<< HEAD
替换为：
=======
with the equivalent JSX code:
>>>>>>> 951fae39f0e12dc061f1564d02b2f4707c0541c4

```jsx
return (
  <button onClick={() => setLiked(true)}>
    Like
  </button>
);
```

<<<<<<< HEAD
2. 在 **index.html** 文件中，为 link_button_js 的 `script` 标签添加 `type="text/babel"` 属性：
=======
It may feel a bit unusual at first to mix JS with markup, but it will grow on you! Check out [Writing Markup in JSX](/learn/writing-markup-with-jsx) for an introduction. Here is [an example HTML file with JSX](https://raw.githubusercontent.com/reactjs/reactjs.org/main/static/html/single-file-example.html) that you can download and play with.
>>>>>>> 951fae39f0e12dc061f1564d02b2f4707c0541c4

<Gotcha>

<<<<<<< HEAD
这是 [一个使用了 JSX 的 HTML 文件示例](https://raw.githubusercontent.com/reactjs/reactjs.org/main/static/html/single-file-example.html)，你可以下载并尝试使用。

这种方式适合于学习和创建简单的示例。然而，它会使你的网站加载变慢，并且**这并不适用于生产环境**。当你准备好进行下一步学习时，请删除新添加的 `<script>` 标签以及 like_button 上的 `type="text/babel"` 属性。在下一小节中，我们将学习通过设置 JSX 预处理器来自动转换所有 `<script>` 标签的内容。
=======
The Babel `<script>` compiler is fine for learning and creating simple demos. However, **it makes your website slow and isn't suitable for production**. When you're ready to move forward, remove the Babel `<script>` tag and remove the `type="text/babel"` attribute you've added in this step. Instead, in the next section you will set up a JSX preprocessor to convert all your `<script>` tags from JSX to JS.

</Gotcha>
>>>>>>> 951fae39f0e12dc061f1564d02b2f4707c0541c4

### 将 JSX 添加到项目 {/*add-jsx-to-a-project*/}

将 JSX 添加到项目中并不需要诸如 [打包工具](/learn/start-a-new-react-project#custom-toolchains) 或开发服务器那样复杂的工具。本质上，添加 JSX 就像添加 CSS 预处理器一样。

在终端上进入你的项目文件夹，然后执行如下两个命令：(**确保你的计算机安装了 [Node.js](https://nodejs.org/)！**)：

1. `npm init -y`（如果失败，请参阅 [修复方案](https://gist.github.com/gaearon/246f6380610e262f8a648e3e51cad40d)）
2. `npm install babel-cli@6 babel-preset-react-app@3`

此处使用 npm 只是用于安装 JSX 预处理器，之后便不再需要它。React 和应用程序代码都可以继续使用 `<script>` 标签而不做任何更改。

恭喜！你为你的项目成功添加了 **生产环境（production-ready）的 JSX 配置**。

### 运行 JSX 预处理器 {/*run-the-jsx-preprocessor*/}

<<<<<<< HEAD
当你编辑保存带有 JSX 的源文件时，这个转换过程将自动重新执行，并把 JSX 文件转换成普通的 JavaScript 文件。

1. 创建一个名为 `src` 的文件夹
2. 在终端执行这个命令： `npx babel --watch src --out-dir . --presets react-app/prod ` （无需等待运行结果 —— 这个命令会自动启动对 JSX 的监听器。）
3. 把包含 JSX 语法的 **like_button_js** 文件移动到新创建的 **src** 文件夹中（或者在 **src**文件夹中创建一个包含 [此段代码](https://gist.githubusercontent.com/rachelnabors/ffbc9a0e33665a58d4cfdd1676f05453/raw/652003ff54d2dab8a1a1e5cb3bb1e28ff207c1a6/like_button.js) 的 **like_button_js** 的文件）

监听器会创建一个预处理过的 **like_button.js** 文件，它包含了适用于浏览器的普通 JavaScript 代码.
=======
You can preprocess JSX so that every time you save a file with JSX in it, the transform will be re-run, converting the JSX file into a new, plain JavaScript file that the browser can understand. Here's how to set this up:

1. Create a folder called **`src`**.
2. In your terminal, run this command: `npx babel --watch src --out-dir . --presets react-app/prod ` (Don't wait for it to finish! This command starts an automated watcher for edits to JSX inside `src`.)
3. Move your JSX-ified **`like-button.js`** ([it should look like this!](https://gist.githubusercontent.com/gaearon/1884acf8834f1ef9a574a953f77ed4d8/raw/dfc664bbd25992c5278c3bf3d8504424c1104ecf/like-button.js)) to the new **`src`** folder.

The watcher will create a preprocessed **`like-button.js`** with the plain JavaScript code suitable for the browser.
>>>>>>> 951fae39f0e12dc061f1564d02b2f4707c0541c4

<Gotcha>

如果你看到一个错误消息显示为：“You have mistakenly installed the `babel` package”，原因可能是未按照 [上一步骤](#add-jsx-to-a-project) 进行操作。在同一个文件夹中执行上一步骤中的命令，然后重试。

</Gotcha>

<<<<<<< HEAD
这样，在旧浏览器上也能够使用现代 JavaScript 的语法特性，比如 class。我们刚才使用的工具叫 Babel，你可以从 [它的文档](https://babeljs.io/docs/en/babel-cli/) 中了解更多。
=======
The tool you just used is called Babel, and you can learn more about it from [its documentation](https://babeljs.io/docs/en/babel-cli/). In addition to JSX, it lets you use the most recent JavaScript syntax features without worrying about breaking older browsers.
>>>>>>> 951fae39f0e12dc061f1564d02b2f4707c0541c4

如果你认为你已经习惯了构建工具，并希望它们能为你做更多事，[我们在这描述了一些最流行和易上手的工具链](/learn/start-a-new-react-project)。

<DeepDive title="React without JSX">

最初引入 JSX 是为了想让 React 编写组件的感觉就像编写 HTML 一样简单，但总有例外，你不想或者不能使用 JSX，此时可以参考其他两种解决方案：

<<<<<<< HEAD
- 使用像 [htm](https://github.com/developit/htm) 这样的 JSX 替代品，它不使用编译器——它使用 JavaScript 原生的带标签的模板字符串。
- 使用 [`React.createElement()`](/apis/createelement)，它具有下面解释的特殊结构。
=======
- Use a JSX alternative like [htm](https://github.com/developit/htm) which uses JavaScript [template strings](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) instead of a compiler.
- Use [`React.createElement()`](/apis/createelement) which has a special structure explained below.
>>>>>>> 951fae39f0e12dc061f1564d02b2f4707c0541c4

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

<<<<<<< HEAD
`React.createElement(component, props, children)`，它接受三个参数：

1. 一个**组件**，它既可以是一个表示 HTML 标签名的字符串，也可以是一个函数组件。
2. 一个对象，包含你想传递给组件的 [**props**](/learn/passing-props-to-a-component)。
3. 一个对象，表示此组件存在的所有子元素，比如一串文本字符。
=======
It accepts several arguments: `React.createElement(component, props, ...children)`.

Here's how they work:

1. A **component**, which can be a string representing an HTML element or a function component
2. An object of any [**props** you want to pass](/learn/passing-props-to-a-component)
3. The rest are **children** the component might have, such as text strings or other elements
>>>>>>> 951fae39f0e12dc061f1564d02b2f4707c0541c4

如果你不想每次都键入 `React.createElement`，通常的做法是使用简写：

```js
const e = React.createElement;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(e('div', null, 'Hello World'));
```

<<<<<<< HEAD
在你不使用 JSX 编写 React 组件时，这种简写形式的 `React.createElement()` 同样方便。
=======
Then, if you prefer this style, it can be just as convenient as JSX.
>>>>>>> 951fae39f0e12dc061f1564d02b2f4707c0541c4

</DeepDive>
