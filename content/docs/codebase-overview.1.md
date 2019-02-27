---
id: codebase-overview
title: Codebase Overview
layout: contributing
permalink: docs/codebase-overview.html
prev: how-to-contribute.html
next: implementation-notes.html
redirect_from:
  - "contributing/codebase-overview.html"
---

本节将对React代码库的架构，它的标准和其实现进行概述。

如果您想[参与React](/docs/how-to-contribute.html)的开发，我们希望这份指导可以帮助你更加轻松地做出修改。

我们并不完全推荐在React app中使用这些制约。有许多是历史原因并且之后也许会有所修改。

### 外部依赖 {#external-dependencies}

React几乎没有外部依赖。通常`require()`指向React自己代码库的文件。然而，也有一些比较少见的例外。

[fbjs仓库](https://github.com/facebook/fbjs) 的存在是因为React和一些库像[Relay](https://github.com/facebook/relay)共享一些小功能，并且我们保证他们同步。我们不依赖Node系统中同能小巧的模块，因为我们希望Facebook工程师必要时能够做出修改。fbjs中的功能没有一个是公共API，他们仅仅是用于Facebook的项目，比如React。

### 顶层文件夹 {#top-level-folders}

当clone[React仓库](https://github.com/facebook/react)之后，你们看到最一些顶层文件夹：

* [`packages`](https://github.com/facebook/react/tree/master/packages) 包含元数据（比如`package.json`）和源码 (`src`子目录) 用于React仓库的所有包。. **如果你修改相关代码, 每个包的`src`子目录是你需要花费大部分事件的部分。**
* [`fixtures`](https://github.com/facebook/react/tree/master/fixtures)包含给参与者一些小的React测试应用。
* `build`是React的创建的输出。这不在仓库内，但是这会出现在你第一次[创建React clone版本](/docs/how-to-contribute.html#development-workflow)之后。

文档在[和React分离得一个单独仓库中](https://github.com/reactjs/reactjs.org)。


还有一些其他的顶层文件夹，但是他们几乎都是用于工具得，并且你基本上在参与得时候不会遇上。

### 共同测试 {#colocated-tests}

我没有单元测试的顶层文件夹。而是讲他们放入一个一个叫做`__tests__`的文件夹，相对于他们想要测试的文件。


比如，一个用于[`setInnerHTML.js`](https://github.com/facebook/react/blob/87724bd87506325fcaf2648c70fc1f43411a87be/src/renderers/dom/client/utils/setInnerHTML.js) 的测试，位于[`__tests__/setInnerHTML-test.js`](https://github.com/facebook/react/blob/87724bd87506325fcaf2648c70fc1f43411a87be/src/renderers/dom/client/utils/__tests__/setInnerHTML-test.js)，就在它旁边。

### 警告和不变数据 {#warnings-and-invariants}

React仓库用`warning`模块展示警告。

```js
var warning = require('warning');

warning(
  2 + 2 === 4,
  'Math is not working today.'
);
```

**警告会在`warning`的条件设置为false的时候出现。**

有一种思考方式是，这个条件需要反应正常情况而不是特殊情况。

有一个很好的主意，避免大量打印重复的警告：

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

警告仅在开发环境中启用。在生产环境中，他们会被完全剥离出来。如果你需要禁止执行某些代码，请使用`invariant`模块代替：

```js
var invariant = require('invariant');

invariant(
  2 + 2 === 4,
  'You shall not pass!'
);
```

**当`invariant`条件是`false`时，会抛出invariant**

“Invariant”只是一种方式，说 “这种情况下总是true”的方式。你可以把这个当成一种断言。

保持开发和生产环境的行为相似是十分重要的，因此`invariant`在开发和生产环境下都会抛出。

这些错误信息会在生产环境中自动替换错误的代码，以避免对字节大小产生负面影响。

### 开发和生产 {#development-and-production}

你可以在代码库中使用`__DEV__`这个伪全局变量，用来管理开发环境中的代码块。

这在编译阶段会被内联，并且在CommonJS构建中，转化成`process.env.NODE_ENV !== 'production'`这样的判断。

对于单独构建，在未压缩的构建中，这会变成`true`，同时在压缩的构件中，检测到的`if`代码块会被完全去除。

```js
if (__DEV__) {
  // 仅在开发环境下执行的代码
}
```

### Flow {#flow}

我们最近开始引入[Flow](https://flow.org/)，用于检查代码库。在许可证头部的注释中，标记了`@flow`注释的文件是已经经过类型检查的。

我们接受[添加Flow注释到现有代码](https://github.com/facebook/react/pull/7600/files)。Flow注释看上去像这样：

```js
ReactRef.detachRefs = function(
  instance: ReactInstance,
  element: ReactElement | string | number | null | false,
): void {
  // ...
}
```

如果可以，新代码需要使用Flow注释。
你可以运行`yarn flow`，用Flow本地检查你的代码。

### 动态注入 {#dynamic-injection}

React在一些模块中使用了动态注入。虽然这一直很清晰，但是这依然很不幸因为这阻碍了代码的可读性。这存在的最主要原因是React原本只以支持DOM为目标。React Native 开始作为React的一个分支。我们必须添加一些动态注入让React Native覆盖一些行为。

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
`injection`部分并没有用某种特别的方式处理。但是按照惯例，这意味着这模块在运行时想要注入一些（很可能是平台特定的）依赖。

在代码库中有许多注入点。未来，我们打算抛弃动态注入机制，并且在构建的时候静态地连接所有的碎片。

### 多包 {#multiple-packages}

React是一个[单包](https://danluu.com/monorepo/)。他的代码库包含多个单独的包，因此他的改动是一起协调的，并且问题只存在一个地方。

### React核心 {#react-core}

React"核心"包括所有[全局`React`APIs](/docs/top-level-api.html#react)，比如：

* `React.createElement()`
* `React.Component`
* `React.Children`

**React核心只包含定义组件必要的API**。它不包含[reconciliation](/docs/reconciliation.html)算法或者其他平台特定的代码。这是适用于React DOM和React Native组件。

React核心代码在源码树的[`packages/react`](https://github.com/facebook/react/tree/master/packages/react)这里。这在npm上作为[`react`](https://www.npmjs.com/package/react)包。 相应的独立浏览器构建版本称为`react.js`，这个导出一个称为`React`的全局对象。

### 渲染层 {#renderers}

React最初只是服务于DOM，但是这之后被改编成也支持原生平台的[React Native](https://facebook.github.io/react-native/)。这就在React内部机制中引入了“渲染层”这个概念。

**渲染层管理如何讲一棵React树变成底层平台调用。**

渲染层同样位于[`packages/`](https://github.com/facebook/react/tree/master/packages/)：

* [React DOM Renderer](https://github.com/facebook/react/tree/master/packages/react-dom)将React组件渲染成DOM。
它实现了顶级[`ReactDOM`API](/docs/react-dom.html)，这在npm上作为[`react-dom`](https://www.npmjs.com/package/react-dom)包。这也可以作为单独浏览器版本使用，称为 `react-dom.js`，导出一个`ReactDOM`的全局对象.
* [React Native Renderer](https://github.com/facebook/react/tree/master/packages/react-native-renderer)将React组件渲染为原生视图。这在React Native内部使用。 
* [React Test Renderer](https://github.com/facebook/react/tree/master/packages/react-test-renderer)将React组件渲染为JSON树。这用于 [Jest](https://facebook.github.io/jest)的[快照测试](https://facebook.github.io/jest/blog/2016/07/27/jest-14.html)特性。这在npm上作为[react-test-renderer](https://www.npmjs.com/package/react-test-renderer)包。

另外一个官方支持的渲染层的是[`react-art`](https://github.com/facebook/react/tree/master/packages/react-art)。它曾经是一个单独的[GitHub仓库](https://github.com/reactjs/react-art)，但是现在我们将此加入了主源代码树。

>**注意:**
>
>严格说来，[`react-native-renderer`](https://github.com/facebook/react/tree/master/packages/react-native-renderer)是一个非常薄的层，这实现了React和React Native的互动。管理着原生视图的真正的平台特定的代码和它的组件一起在[React Native repository](https://github.com/facebook/react-native)这里。

### reconcilers {#reconcilers}

即便React DOM和ReactNative渲染层区别很大，他们也需要共享一些逻辑。特别是[reconciliation](/docs/reconciliation.html)算法需要尽可能相似，这样可以让声明渲染，自定义组件，state，生命周期方法和refs，保持跨平台工作一致.

为了解决这个问题，不同的渲染层分享一些相同的代码。我们称React这一部分为"reconciler"。当安排了类似于`setState()`这样的更新，reconciler会调用树中组件上的 `render()`，然后决定装载，更新或者是卸载它们。

Reconciler没有单独的包，因为他们暂时没有公共API。相反，它们被如React DOM和React Native的渲染层排除在外。
### Stack reconciler {#stack-reconciler}

"stack" reconciler是React 15及更早的使用方案。虽然我们已经停止使用他了, 但是这个在[下一章节](/docs/implementation-notes.html)有详细的文档。

### Fiber reconciler {#fiber-reconciler}

"fiber" reconciler是一个新尝试，致力于解决stack reconciler中固有的问题，同时解决一些由来已久的问题。这个从React 16开始变成了默认的reconciler。

它的主要目标是：

* 能够剔除区块中可中断工作。
* 能够在运行中，划分优先顺序，重建和复用工作。
* 能够在父元素和子元素之间来回提供支持React中的层。
* 能够从`render()`中返回多个元素。
* 更好地支持错误边界。

你可以在[这里](https://github.com/acdlite/react-fiber-architecture)和[这里](https://medium.com/react-in-depth/inside-fiber-in-depth-overview-of-the-new-reconciliation-algorithm-in-react-e1c04700ef6e)，深入了解React Fiber架构。
虽然这已经再React 16中启用了，但是async特性还没有默认启用。

他的代码在[`packages/react-reconciler`](https://github.com/facebook/react/tree/master/packages/react-reconciler)。

### 事件系统 {#event-system}
React实现一个合成事件，这与渲染层无关，适用于React DOM和React Native。他的源码在[`packages/events`](https://github.com/facebook/react/tree/master/packages/events)。

这个是一个[深入研究代码的视频](https://www.youtube.com/watch?v=dRo_egw7tBc) （66分钟）。

### 下一个是什么？ {#what-next}

查看[下一章节](/docs/implementation-notes.html)去学习reconciler在pre-React 16中的实现。我们还没有给新的reconciler的内部原理写文档。
