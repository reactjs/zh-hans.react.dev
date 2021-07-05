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

### 项目根目录 {#top-level-folders}

当克隆 [React 仓库](https://github.com/facebook/react)之后，你们将看到项目根目录的信息：

<<<<<<< HEAD
* [`packages`](https://github.com/facebook/react/tree/master/packages) 包含元数据（比如 `package.json`）和 React 仓库中所有 package 的源码（子目录 `src`）。**如果你需要修改源代码, 那么每个包的 `src` 子目录是你最需要花费精力的地方。**
* [`fixtures`](https://github.com/facebook/react/tree/master/fixtures) 包含一些给贡献者准备的小型 React 测试项目。
* `build` 是 React 的输出目录。源码仓库中并没有这个目录，但是它会在你克隆 React 并且第一次[构建它](/docs/how-to-contribute.html#development-workflow)之后出现。
=======
* [`packages`](https://github.com/facebook/react/tree/main/packages) contains metadata (such as `package.json`) and the source code (`src` subdirectory) for all packages in the React repository. **If your change is related to the code, the `src` subdirectory of each package is where you'll spend most of your time.**
* [`fixtures`](https://github.com/facebook/react/tree/main/fixtures) contains a few small React test applications for contributors.
* `build` is the build output of React. It is not in the repository but it will appear in your React clone after you [build it](/docs/how-to-contribute.html#development-workflow) for the first time.
>>>>>>> 0bb0303fb704147452a568472e968993f0729c28

文档位于 [React 仓库之外的一个独立仓库中](https://github.com/reactjs/reactjs.org)。

还有一些其他的顶层目录，但是它们几乎都是工具类的，并且在贡献代码时基本不会涉及。

### 共置测试 {#colocated-tests}

我们没有单元测试的顶层目录。而是将它们放置在所需测试文件的相同目录下的 `__tests__` 的目录之中。

比如，一个用于 [`setInnerHTML.js`](https://github.com/facebook/react/blob/87724bd87506325fcaf2648c70fc1f43411a87be/src/renderers/dom/client/utils/setInnerHTML.js) 的测试文件，会存放在 [`__tests__/setInnerHTML-test.js`](https://github.com/facebook/react/blob/87724bd87506325fcaf2648c70fc1f43411a87be/src/renderers/dom/client/utils/__tests__/setInnerHTML-test.js)，就在它同级目录下。

### warning 和 invariant {#warnings-and-invariants}

React 代码库直接使用 `console.error` 来展示 warnings：

```js
if (__DEV__) {
  console.error('Something is wrong.');
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

### Multiple Packages {#multiple-packages}

React 采用 [monorepo](https://danluu.com/monorepo/) 的管理方式。仓库中包含多个独立的包，以便于更改可以一起联调，并且问题只会出现在同一地方。

### React Core {#react-core}

React “Core” 中包含所有[全局 `React` API](/docs/top-level-api.html#react)，比如：

* `React.createElement()`
* `React.Component`
* `React.Children`

**React 核心只包含定义组件必要的 API**。它不包含[协调](/docs/reconciliation.html)算法或者其他平台特定的代码。它同时适用于 React DOM 和 React Native 组件。

<<<<<<< HEAD
React 核心代码在源码的 [`packages/react`](https://github.com/facebook/react/tree/master/packages/react) 目录中。在 npm 上发布为 [`react`](https://www.npmjs.com/package/react) 包。相应的独立浏览器构建版本称为 `react.js`，它会导出一个称为 `React` 的全局对象。
=======
The code for React core is located in [`packages/react`](https://github.com/facebook/react/tree/main/packages/react) in the source tree. It is available on npm as the [`react`](https://www.npmjs.com/package/react) package. The corresponding standalone browser build is called `react.js`, and it exports a global called `React`.
>>>>>>> 0bb0303fb704147452a568472e968993f0729c28

### 渲染器 {#renderers}

React 最初只是服务于 DOM，但是这之后被改编成也能同时支持原生平台的 [React Native](https://reactnative.dev/)。因此，在 React 内部机制中引入了“渲染器”这个概念。

**渲染器用于管理一棵 React 树，使其根据底层平台进行不同的调用。**

<<<<<<< HEAD
渲染器同样位于 [`packages/`](https://github.com/facebook/react/tree/master/packages/) 目录下：

* [React DOM Renderer](https://github.com/facebook/react/tree/master/packages/react-dom) 将 React 组件渲染成 DOM。它实现了全局 [`ReactDOM`API](/docs/react-dom.html)，这在npm上作为 [`react-dom`](https://www.npmjs.com/package/react-dom) 包。这也可以作为单独浏览器版本使用，称为 `react-dom.js`，导出一个 `ReactDOM` 的全局对象.
* [React Native Renderer](https://github.com/facebook/react/tree/master/packages/react-native-renderer) 将 React 组件渲染为 Native 视图。此渲染器在 React Native 内部使用。
* [React Test Renderer](https://github.com/facebook/react/tree/master/packages/react-test-renderer) 将 React 组件渲染为 JSON 树。这用于 [Jest](https://facebook.github.io/jest) 的[快照测试](https://facebook.github.io/jest/blog/2016/07/27/jest-14.html)特性。在 npm 上作为 [react-test-renderer](https://www.npmjs.com/package/react-test-renderer) 包发布。

另外一个官方支持的渲染器的是 [`react-art`](https://github.com/facebook/react/tree/master/packages/react-art)。它曾经是一个独立的 [GitHub 仓库](https://github.com/reactjs/react-art)，但是现在我们将此加入了主源代码树。
=======
Renderers are also located in [`packages/`](https://github.com/facebook/react/tree/main/packages/):

* [React DOM Renderer](https://github.com/facebook/react/tree/main/packages/react-dom) renders React components to the DOM. It implements [top-level `ReactDOM` APIs](/docs/react-dom.html) and is available as [`react-dom`](https://www.npmjs.com/package/react-dom) npm package. It can also be used as standalone browser bundle called `react-dom.js` that exports a `ReactDOM` global.
* [React Native Renderer](https://github.com/facebook/react/tree/main/packages/react-native-renderer) renders React components to native views. It is used internally by React Native.
* [React Test Renderer](https://github.com/facebook/react/tree/main/packages/react-test-renderer) renders React components to JSON trees. It is used by the [Snapshot Testing](https://facebook.github.io/jest/blog/2016/07/27/jest-14.html) feature of [Jest](https://facebook.github.io/jest) and is available as [react-test-renderer](https://www.npmjs.com/package/react-test-renderer) npm package.

The only other officially supported renderer is [`react-art`](https://github.com/facebook/react/tree/main/packages/react-art). It used to be in a separate [GitHub repository](https://github.com/reactjs/react-art) but we moved it into the main source tree for now.
>>>>>>> 0bb0303fb704147452a568472e968993f0729c28

>**注意:**
>
<<<<<<< HEAD
>严格说来，[`react-native-renderer`](https://github.com/facebook/react/tree/master/packages/react-native-renderer) 实现了 React 和 React Native 的连接。真正渲染 Native 视图的平台特定代码及组件都存储在 [React Native 仓库](https://github.com/facebook/react-native)中。
=======
>Technically the [`react-native-renderer`](https://github.com/facebook/react/tree/main/packages/react-native-renderer) is a very thin layer that teaches React to interact with React Native implementation. The real platform-specific code managing the native views lives in the [React Native repository](https://github.com/facebook/react-native) together with its components.
>>>>>>> 0bb0303fb704147452a568472e968993f0729c28

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

<<<<<<< HEAD
源代码在 [`packages/react-reconciler`](https://github.com/facebook/react/tree/master/packages/react-reconciler) 目录下。
=======
Its source code is located in [`packages/react-reconciler`](https://github.com/facebook/react/tree/main/packages/react-reconciler).
>>>>>>> 0bb0303fb704147452a568472e968993f0729c28

### 事件系统 {#event-system}

<<<<<<< HEAD
React 在原生事件基础上进行了封装，以抹平浏览器间差异。其源码在 [`packages/react-dom/src/events`](https://github.com/facebook/react/tree/master/packages/react-dom/src/events) 目录下。
=======
React implements a layer over native events to smooth out cross-browser differences. Its source code is located in [`packages/react-dom/src/events`](https://github.com/facebook/react/tree/main/packages/react-dom/src/events).
>>>>>>> 0bb0303fb704147452a568472e968993f0729c28

### 下一章节学习什么？ {#what-next}

查看下一章节去学习 reconciler 在 pre-React 16 中的实现。我们还没有为新的 reconciler 内部原理编写文档。
