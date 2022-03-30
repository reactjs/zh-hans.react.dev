---
id: glossary
title: React 术语词汇表
layout: docs
category: Reference
permalink: docs/glossary.html

---

## 单页面应用 {#single-page-application}

单页面应用(single-page application)，是一个应用程序，它可以加载单个 HTML 页面，以及运行应用程序所需的所有必要资源（例如 JavaScript 和 CSS）。与页面或后续页面的任何交互，都不再需要往返 server 加载资源，即页面不会重新加载。

你可以使用 React 来构建单页应用程序，但不是必须如此。React 还可用于增强现有网站的小部分，使其增加额外交互。用 React 编写的代码，可以与服务器端渲染的标记（例如 PHP）或其他客户端库和平共处。实际上，这也正是 Facebook 内部使用 React 的方式。

## ES6, ES2015, ES2016 等 {#es6-es2015-es2016-etc}

这些首字母缩写都是指 ECMAScript 语言规范标准的最新版本，JavaScript 语言是此标准的一个实现。其中 ES6 版本（也称为 ES2015）包括对前面版本的许多补充，例如：箭头函数、class、模板字面量、`let` 和 `const` 语句。可以在[这里](https://en.wikipedia.org/wiki/ECMAScript#Versions)了解此规范特定版本的详细信息。

## Compiler（编译器） {#compilers}

JavaScript compiler 接收 JavaScript 代码，然后对其进行转换，最终返回不同格式的 JavaScript 代码。最为常见的使用示例是，接收 ES6 语法，然后将其转换为旧版本浏览器能够解释执行的语法。[Babel](https://babeljs.io/) 是 React 最常用的 compiler。

## Bundler（打包工具） {#bundlers}

bundler 会接收写成单独模块（通常有数百个）的 JavaScript 和 CSS 代码，然后将它们组合在一起，最终生成出一些为浏览器优化的文件。常用的打包 React 应用的工具有 [webpack](https://webpack.js.org/) 和 [Browserify](http://browserify.org/)。

## Package 管理工具 {#package-managers}

package 管理工具，是帮助你管理项目依赖的工具。[npm](https://www.npmjs.com/) 和 [Yarn](https://yarnpkg.com/) 是两个常用的管理 React 应用依赖的 package 管理工具。它们都是使用了相同 npm package registry 的客户端。

## CDN {#cdn}

CDN 代表内容分发网络（Content Delivery Network）。CDN 会通过一个遍布全球的服务器网络来分发缓存的静态内容。

## JSX {#jsx}

JSX 是一个 JavaScript 语法扩展。它类似于模板语言，但它具有 JavaScript 的全部能力。JSX 最终会被编译为 `React.createElement()` 函数调用，返回称为 “React 元素” 的普通 JavaScript 对象。通过[查看这篇文档](/docs/introducing-jsx.html)获取 JSX 语法的基本介绍，在[这篇文档](/docs/jsx-in-depth.html)中可以找到 JSX 语法的更多深入教程。

React DOM 使用 camelCase（驼峰式命名）来定义属性的名称，而不使用 HTML 属性名称的命名约定。例如，HTML 的 `tabindex` 属性变成了 JSX 的 `tabIndex`。而 `class` 属性则变为 `className`，这是因为 `class` 是 JavaScript 中的保留字：

```jsx
<h1 className="hello">My name is Clementine!</h1>
```

## [元素](/docs/rendering-elements.html) {#elements}

React 元素是构成 React 应用的基础砖块。人们可能会把元素与广为人知的“组件”概念相互混淆。元素描述了你在屏幕上想看到的内容。React 元素是不可变对象。

```js
const element = <h1>Hello, world</h1>;
```

通常我们不会直接使用元素，而是从组件中返回元素。

## [组件](/docs/components-and-props.html) {#components}

React 组件是可复用的小的代码片段，它们返回要在页面中渲染的 React 元素。React 组件的最简版本是，一个返回 React 元素的普通 JavaScript 函数：

```js
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

组件也可以使用 ES6 的 class 编写：

```js
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

组件可被拆分为不同的功能片段，这些片段可以在其他组件中使用。组件可以返回其他组件、数组、字符串和数字。根据经验来看，如果 UI 中有一部分被多次使用（Button，Panel，Avatar），或者组件本身就足够复杂（App，FeedStory，Comment），那么它就是一个可复用组件的候选项。组件名称应该始终以大写字母开头（`<Wrapper/>` **而不是** `<wrapper/>`）。有关渲染组件的更多信息，请参阅[这篇文档](/docs/components-and-props.html#rendering-a-component)。

### [`props`](/docs/components-and-props.html) {#props}

`props` 是 React 组件的输入。它们是从父组件向下传递给子组件的数据。

记住，`props` 是只读的。不应以任何方式修改它们：

```js
// 错误做法！
props.number = 42;
```

如果你想要修改某些值，以响应用户输入或网络响应，请使用 `state` 来作为替代。

### `props.children` {#propschildren}

每个组件都可以获取到 `props.children`。它包含组件的开始标签和结束标签之间的内容。例如：

```js
<Welcome>Hello world!</Welcome>
```

在 `Welcome` 组件中获取 `props.children`，就可以得到字符串 `Hello world!`：

```js
function Welcome(props) {
  return <p>{props.children}</p>;
}
```

对于 class 组件，请使用 `this.props.children` 来获取：

```js
class Welcome extends React.Component {
  render() {
    return <p>{this.props.children}</p>;
  }
}
```

### [`state`](/docs/state-and-lifecycle.html#adding-local-state-to-a-class) {#state}

当组件中的一些数据在某些时刻发生变化时，这时就需要使用 `state` 来跟踪状态。例如，`Checkbox` 组件可能需要 `isChecked` 状态，而 `NewsFeed` 组件可能需要跟踪 `fetchedPosts` 状态。

`state` 和 `props` 之间最重要的区别是：`props` 由父组件传入，而 `state` 由组件本身管理。组件不能修改 `props`，但它可以修改 `state`。

对于所有变化数据中的每个特定部分，只应该由一个组件在其 state 中“持有”它。不要试图同步来自于两个不同组件的 state。相反，应当将其[提升](/docs/lifting-state-up.html)到最近的共同祖先组件中，并将这个 state 作为 props 传递到两个子组件。

## [生命周期方法](/docs/state-and-lifecycle.html#adding-lifecycle-methods-to-a-class) {#lifecycle-methods}

生命周期方法，用于在组件不同阶段执行自定义功能。在组件被创建并插入到 DOM 时（即[挂载中阶段（mounting）](/docs/react-component.html#mounting)），组件更新时，组件取消挂载或从 DOM 中删除时，都有可以使用的生命周期方法。

## [受控组件](/docs/forms.html#controlled-components) vs [非受控组件](/docs/uncontrolled-components.html)

React 有两种不同的方式来处理表单输入。

如果一个 input 表单元素的值是由 React 控制，就其称为*受控组件*。当用户将数据输入到受控组件时，会触发修改状态的事件处理器，这时由你的代码来决定此输入是否有效（如果有效就使用更新后的值重新渲染）。如果不重新渲染，则表单元素将保持不变。

一个*非受控组件*，就像是运行在 React 体系之外的表单元素。当用户将数据输入到表单字段（例如 input，dropdown 等）时，React 不需要做任何事情就可以映射更新后的信息。然而，这也意味着，你无法强制给这个表单字段设置一个特定值。

在大多数情况下，你应该使用受控组件。

## [key](/docs/lists-and-keys.html) {#keys}

“key” 是在创建元素数组时，需要用到的一个特殊字符串属性。key 帮助 React 识别出被修改、添加或删除的 item。应当给数组内的每个元素都设定 key，以使元素具有固定身份标识。

只需要保证，在同一个数组中的兄弟元素之间的 key 是唯一的。而不需要在整个应用程序甚至单个组件中保持唯一。

不要将 `Math.random()` 之类的值传递给 key。重要的是，在前后两次渲染之间的 key 要具有“固定身份标识”的特点，以便 React 可以在添加、删除或重新排序 item 时，前后对应起来。理想情况下，key 应该从数据中获取，对应着唯一且固定的标识符，例如 `post.id`。

## [Ref](/docs/refs-and-the-dom.html) {#refs}

React 支持一个特殊的、可以附加到任何组件上的 `ref` 属性。此属性可以是一个由 [`React.createRef()` 函数](/docs/react-api.html#reactcreateref)创建的对象、或者一个回调函数、或者一个字符串（遗留 API）。当 `ref` 属性是一个回调函数时，此函数会（根据元素的类型）接收底层 DOM 元素或 class 实例作为其参数。这能够让你直接访问 DOM 元素或组件实例。

谨慎使用 ref。如果你发现自己经常使用 ref 来在应用中“实现想要的功能”，你可以考虑去了解一下[自上而下的数据流](/docs/lifting-state-up.html)。

## [事件](/docs/handling-events.html) {#events}

使用 React 元素处理事件时，有一些语法上差异：

* React 事件处理器使用 camelCase（驼峰式命名）而不使用小写命名。
* 通过 JSX，你可以直接传入一个函数，而不是传入一个字符串，来作为事件处理器。

## [协调](/docs/reconciliation.html) {#reconciliation}

当组件的 props 或 state 发生变化时，React 通过将最新返回的元素与原先渲染的元素进行比较，来决定是否有必要进行一次实际的 DOM 更新。当它们不相等时，React 才会更新 DOM。这个过程被称为“协调”。
