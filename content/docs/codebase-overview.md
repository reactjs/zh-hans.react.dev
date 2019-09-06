---
id: codebase-overview
title: 源码概览
layout: contributing
permalink: docs/codebase-overview.html
prev: how-to-contribute.html
next: implementation-notes.html
redirect_from:
  - "contributing/codebase-overview.html"
---

本节将对 React 的源码架构，约定及其实现进行概述。

如果您想[参与 React](/docs/how-to-contribute.html) 的开发，我们希望这份指南可以帮助你更加轻松地进行修改。

我们并不推荐在 React 应用中遵循这些约定。有许多约定是历史原因，并且之后也许会有所修改。

### 外部依赖 {#external-dependencies}

React 几乎没有外部依赖。通常 `require()` 都会引用 React 源码中的文件。然而，也有个别的例外。

依赖 [fbjs 仓库](https://github.com/facebook/fbjs)是因为 React 需要和一些类似于 [Relay](https://github.com/facebook/relay) 的库共享一些小功能，并且与他们保持同步。我们不依赖 Node 生态系统中同等功能的小模块，因为我们希望 Facebook 工程师能够在必要时做出修改。fbjs 中没有公共 API，他们仅仅用于 Facebook 的项目，比如 React。

### 顶层目录 {#top-level-folders}

当克隆 [React 仓库](https://github.com/facebook/react)之后，你们将看到一些顶层目录：

* [`packages`](https://github.com/facebook/react/tree/master/packages) 包含元数据（比如 `package.json`）和 React 仓库中所有 package 的源码（子目录 `src`）。**如果你需要修改源代码, 那么每个包的 `src` 子目录是你最需要花费精力的地方。**
* [`fixtures`](https://github.com/facebook/react/tree/master/fixtures) 包含一些给贡献者准备的小型 React 测试项目。
* `build` 是 React 的输出目录。源码仓库中并没有这个目录，但是它会在你克隆 React 并且第一次[构建它](/docs/how-to-contribute.html#development-workflow)之后出现。

文档位于 [React 仓库之外的一个独立仓库中](https://github.com/reactjs/reactjs.org)。

还有一些其他的顶层目录，但是它们几乎都是工具类的，并且在贡献代码时基本不会涉及。

### 共置测试 {#colocated-tests}

我们没有单元测试的顶层目录。而是将它们放置在所需测试文件的相同目录下的 `__tests__` 的目录之中。

比如，一个用于 [`setInnerHTML.js`](https://github.com/facebook/react/blob/87724bd87506325fcaf2648c70fc1f43411a87be/src/renderers/dom/client/utils/setInnerHTML.js) 的测试文件，会存放在 [`__tests__/setInnerHTML-test.js`](https://github.com/facebook/react/blob/87724bd87506325fcaf2648c70fc1f43411a87be/src/renderers/dom/client/utils/__tests__/setInnerHTML-test.js)，就在它同级目录下。

### warning 和 invariant {#warnings-and-invariants}

React 源码采用 `warning` 模块展示警告。

```js
var warning = require('warning');

warning(
  2 + 2 === 4,
  'Math is not working today.'
);
```

**警告会在 `warning` 的条件为 false 时出现。**

`warning` 机制可以理解为，当编写判定条件的时候，应当使用符合正常逻辑的条件判断，这样出现异常的时候就会触发 warning，注意判定条件不要用反了。

我们应当注意避免大量打印重复的 warning：

```js
var warning = require('warning');

var didWarnAboutMath = false;
if (!didWarnAboutMath) {
  warning(
    2 + 2 === 4,
    'Math is not working today.'
  );
  didWarnAboutMath = true;
}
```

warning 仅在开发环境中启用。在生产环境中，他们会被完全剔除掉。如果你需要在生产环境禁止执行某些代码，请使用 `invariant` 模块代替 `warning`：

```js
var invariant = require('invariant');

invariant(
  2 + 2 === 4,
  'You shall not pass!'
);
```

**当 `invariant` 判别条件为 `false` 时，会将 invariant 的信息作为错误抛出**

“Invariant” 用于声明 “这个条件应总为 true”。你可以把它当成一种断言。

保持开发和生产环境的行为相似是十分重要的，因此 `invariant` 在开发和生产环境下都会抛出错误。不同点在于在生产环境中这些错误信息会被自动替换成错误代码，这样可以让输出库文件变得更小。

### 开发环境与生产环境 {#development-and-production}

你可以在代码库中使用 `__DEV__` 这个伪全局变量，用于管理开发环境中需运行的代码块

这在编译阶段会被内联，在 CommonJS 构建中，转化成 `process.env.NODE_ENV !== 'production'` 这样的判断。

对于独立构建来说，在没有 minify 的构建中，它会变成 `true`，同时在 minify 的构建中，检测到的 `if` 代码块会被完全剔除。

```js
if (__DEV__) {
  // 仅在开发环境下执行的代码
}
```

### Flow {#flow}

我们最近将 [Flow](https://flow.org/) 引入源码，用于类型检查。在许可证头部的注释中，标记为 `@flow` 注释的文件是已经经过类型检查的。

我们接受[添加 Flow 注释到现有代码](https://github.com/facebook/react/pull/7600/files)。Flow 注释看上去像这样：

```js
ReactRef.detachRefs = function(
  instance: ReactInstance,
  element: ReactElement | string | number | null | false,
): void {
  // ...
}
```

如果可以的话，新代码应尽量使用 Flow 注释。
你可以运行 `yarn flow`，用 Flow 本地检查你的代码。

### 动态注入 {#dynamic-injection}

React 在一些模块中使用了动态注入。虽然它总是显式地，但仍然存在问题，因为这会阻碍对代码的理解。它存在的最主要原因是 React 原本只以支持 DOM 为目标。然而 React Native 开始作为 React 的一个分支之后。我们只好添加一些动态注入让 React Native 覆盖一些行为。

你可能看到过一些模块，像下面这样声明动态依赖：

```js
// 动态注入
var textComponentClass = null;

// 依赖动态注入的值
function createInstanceForText(text) {
  return new textComponentClass(text);
}

var ReactHostComponent = {
  createInstanceForText,

  // 提供动态注入的入口
  injection: {
    injectTextComponentClass: function(componentClass) {
      textComponentClass = componentClass;
    },
  },
};

module.exports = ReactHostComponent;
```

`injection` 字段并没有用某种特别的方式处理。但是按照惯例，这意味着这模块在运行时想要注入一些（很可能是平台特定的）依赖。

在代码库中有许多注入点。未来，我们打算抛弃动态注入机制，并且在构建的时候静态地连接所有的碎片。

### Multiple Packages {#multiple-packages}

React 采用 [monorepo](https://danluu.com/monorepo/) 的管理方式。仓库中包含多个独立的包，以便于更改可以一起联调，并且问题只会出现在同一地方。

### React Core {#react-core}

React “Core” 中包含所有[全局 `React` API](/docs/top-level-api.html#react)，比如：

* `React.createElement()`
* `React.Component`
* `React.Children`

**React 核心只包含定义组件必要的 API**。它不包含[协调](/docs/reconciliation.html)算法或者其他平台特定的代码。它同时适用于 React DOM 和 React Native 组件。

React 核心代码在源码的 [`packages/react`](https://github.com/facebook/react/tree/master/packages/react) 目录中。在 npm 上发布为 [`react`](https://www.npmjs.com/package/react) 包。相应的独立浏览器构建版本称为 `react.js`，它会导出一个称为 `React` 的全局对象。

### 渲染器 {#renderers}

React 最初只是服务于 DOM，但是这之后被改编成也能同时支持原生平台的 [React Native](https://facebook.github.io/react-native/)。因此，在 React 内部机制中引入了“渲染器”这个概念。

**渲染器用于管理一棵 React 树，使其根据底层平台进行不同的调用。**

渲染器同样位于 [`packages/`](https://github.com/facebook/react/tree/master/packages/) 目录下：

* [React DOM Renderer](https://github.com/facebook/react/tree/master/packages/react-dom) 将 React 组件渲染成 DOM。它实现了全局 [`ReactDOM`API](/docs/react-dom.html)，这在npm上作为 [`react-dom`](https://www.npmjs.com/package/react-dom) 包。这也可以作为单独浏览器版本使用，称为 `react-dom.js`，导出一个 `ReactDOM` 的全局对象.
* [React Native Renderer](https://github.com/facebook/react/tree/master/packages/react-native-renderer) 将 React 组件渲染为 Native 视图。此渲染器在 React Native 内部使用。
* [React Test Renderer](https://github.com/facebook/react/tree/master/packages/react-test-renderer) 将 React 组件渲染为 JSON 树。这用于 [Jest](https://facebook.github.io/jest) 的[快照测试](https://facebook.github.io/jest/blog/2016/07/27/jest-14.html)特性。在 npm 上作为 [react-test-renderer](https://www.npmjs.com/package/react-test-renderer) 包发布。

另外一个官方支持的渲染器的是 [`react-art`](https://github.com/facebook/react/tree/master/packages/react-art)。它曾经是一个独立的 [GitHub 仓库](https://github.com/reactjs/react-art)，但是现在我们将此加入了主源代码树。

>**注意:**
>
>严格说来，[`react-native-renderer`](https://github.com/facebook/react/tree/master/packages/react-native-renderer) 实现了 React 和 React Native 的连接。真正渲染 Native 视图的平台特定代码及组件都存储在 [React Native 仓库](https://github.com/facebook/react-native)中。

### reconcilers {#reconcilers}

即便 React DOM 和 React Native 渲染器的区别很大，但也需要共享一些逻辑。特别是[协调](/docs/reconciliation.html)算法需要尽可能相似，这样可以让声明式渲染，自定义组件，state，生命周期方法和 refs 等特性，保持跨平台工作一致。

为了解决这个问题，不同的渲染器彼此共享一些代码。我们称 React 的这一部分为 “reconciler”。当处理类似于 `setState()` 这样的更新时，reconciler 会调用树中组件上的 `render()`，然后决定是否进行挂载，更新或是卸载操作。

Reconciler 没有单独的包，因为他们暂时没有公共 API。相反，它们被如 React DOM 和 React Native 的渲染器排除在外。

### Stack reconciler {#stack-reconciler}

"stack" reconciler 是 React 15 及更早的解决方案。虽然我们已经停止了对它的使用, 但是这在[下一章节](/docs/implementation-notes.html)有详细的文档。

### Fiber reconciler {#fiber-reconciler}

"fiber" reconciler 是一个新尝试，致力于解决 stack reconciler 中固有的问题，同时解决一些历史遗留问题。Fiber 从 React 16 开始变成了默认的 reconciler。

它的主要目标是：

* 能够把可中断的任务切片处理。
* 能够调整优先级，重置并复用任务。
* 能够在父元素与子元素之间交错处理，以支持 React 中的布局。
* 能够在 `render()` 中返回多个元素。
* 更好地支持错误边界。

你可以在[这里](https://github.com/acdlite/react-fiber-architecture)和[这里](https://medium.com/react-in-depth/inside-fiber-in-depth-overview-of-the-new-reconciliation-algorithm-in-react-e1c04700ef6e)，深入了解 React Fiber 架构。虽然这已经在 React 16 中启用了，但是 async 特性还没有默认开启。

源代码在 [`packages/react-reconciler`](https://github.com/facebook/react/tree/master/packages/react-reconciler) 目录下。

### 事件系统 {#event-system}

React 实现一个合成事件，这与渲染器无关，它适用于 React DOM 和 React Native。源码在 [`packages/react-events`](https://github.com/facebook/react/tree/master/packages/react-events) 目录下。

这个是一个[深入研究事件系统代码的视频](https://www.youtube.com/watch?v=dRo_egw7tBc)（66分钟）。

### 下一章节学习什么？ {#what-next}

查看下一章节去学习 reconciler 在 pre-React 16 中的实现。我们还没有为新的 reconciler 内部原理编写文档。
