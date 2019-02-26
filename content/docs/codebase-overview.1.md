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

本节将对React代码库组织，它的标准和其实现进行概述。

如果您想[参与React](/docs/how-to-contribute.html)，我们希望这份指导可以帮助你更加轻松地做出修改。

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

警告只在开发环境中启用。在生产环境中，他们会被完全剥离出来。如果你需要禁止执行某些代码，使用`invariant`模块代替：

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

You can use `__DEV__` pseudo-global variable in the codebase to guard development-only blocks of code.

It is inlined during the compile step, and turns into `process.env.NODE_ENV !== 'production'` checks in the CommonJS builds.

For standalone builds, it becomes `true` in the unminified build, and gets completely stripped out with the `if` blocks it guards in the minified build.

```js
if (__DEV__) {
  // This code will only run in development.
}
```

### Flow {#flow}

We recently started introducing [Flow](https://flow.org/) checks to the codebase. Files marked with the `@flow` annotation in the license header comment are being typechecked.

We accept pull requests [adding Flow annotations to existing code](https://github.com/facebook/react/pull/7600/files). Flow annotations look like this:

```js
ReactRef.detachRefs = function(
  instance: ReactInstance,
  element: ReactElement | string | number | null | false,
): void {
  // ...
}
```

When possible, new code should use Flow annotations.
You can run `yarn flow` locally to check your code with Flow.

### Dynamic Injection {#dynamic-injection}

React uses dynamic injection in some modules. While it is always explicit, it is still unfortunate because it hinders understanding of the code. The main reason it exists is because React originally only supported DOM as a target. React Native started as a React fork. We had to add dynamic injection to let React Native override some behaviors.

You may see modules declaring their dynamic dependencies like this:

```js
// Dynamically injected
var textComponentClass = null;

// Relies on dynamically injected value
function createInstanceForText(text) {
  return new textComponentClass(text);
}

var ReactHostComponent = {
  createInstanceForText,

  // Provides an opportunity for dynamic injection
  injection: {
    injectTextComponentClass: function(componentClass) {
      textComponentClass = componentClass;
    },
  },
};

module.exports = ReactHostComponent;
```

The `injection` field is not handled specially in any way. But by convention, it means that this module wants to have some (presumably platform-specific) dependencies injected into it at runtime.

There are multiple injection points in the codebase. In the future, we intend to get rid of the dynamic injection mechanism and wire up all the pieces statically during the build.

### Multiple Packages {#multiple-packages}

React is a [monorepo](https://danluu.com/monorepo/). Its repository contains multiple separate packages so that their changes can be coordinated together, and issues live in one place.

### React Core {#react-core}

The "core" of React includes all the [top-level `React` APIs](/docs/top-level-api.html#react), for example:

* `React.createElement()`
* `React.Component`
* `React.Children`

**React core only includes the APIs necessary to define components.** It does not include the [reconciliation](/docs/reconciliation.html) algorithm or any platform-specific code. It is used both by React DOM and React Native components.

The code for React core is located in [`packages/react`](https://github.com/facebook/react/tree/master/packages/react) in the source tree. It is available on npm as the [`react`](https://www.npmjs.com/package/react) package. The corresponding standalone browser build is called `react.js`, and it exports a global called `React`.

### Renderers {#renderers}

React was originally created for the DOM but it was later adapted to also support native platforms with [React Native](https://facebook.github.io/react-native/). This introduced the concept of "renderers" to React internals.

**Renderers manage how a React tree turns into the underlying platform calls.**

Renderers are also located in [`packages/`](https://github.com/facebook/react/tree/master/packages/):

* [React DOM Renderer](https://github.com/facebook/react/tree/master/packages/react-dom) renders React components to the DOM. It implements [top-level `ReactDOM` APIs](/docs/react-dom.html) and is available as [`react-dom`](https://www.npmjs.com/package/react-dom) npm package. It can also be used as standalone browser bundle called `react-dom.js` that exports a `ReactDOM` global.
* [React Native Renderer](https://github.com/facebook/react/tree/master/packages/react-native-renderer) renders React components to native views. It is used internally by React Native.
* [React Test Renderer](https://github.com/facebook/react/tree/master/packages/react-test-renderer) renders React components to JSON trees. It is used by the [Snapshot Testing](https://facebook.github.io/jest/blog/2016/07/27/jest-14.html) feature of [Jest](https://facebook.github.io/jest) and is available as [react-test-renderer](https://www.npmjs.com/package/react-test-renderer) npm package.

另外一个官方支持的渲染层的是[`react-art`](https://github.com/facebook/react/tree/master/packages/react-art)。它曾经是一个单独的[GitHub仓库](https://github.com/reactjs/react-art)，但是现在我们将此加入了主源代码树。

>**注意:**
>
>Technically the [`react-native-renderer`](https://github.com/facebook/react/tree/master/packages/react-native-renderer) is a very thin layer that teaches React to interact with React Native implementation. The real platform-specific code managing the native views lives in the [React Native repository](https://github.com/facebook/react-native) together with its components.

### 协调者 {#reconcilers}

Even vastly different renderers like React DOM and React Native need to share a lot of logic. In particular, the [协调](/docs/reconciliation.html) algorithm should be as similar as possible so that declarative rendering, custom components, state, lifecycle methods, and refs work consistently across platforms.

To solve this, different renderers share some code between them. We call this part of React a "reconciler". When an update such as `setState()` is scheduled, the reconciler calls `render()` on components in the tree and mounts, updates, or unmounts them.

Reconcilers are not packaged separately because they currently have no public API. Instead, they are exclusively used by renderers such as React DOM and React Native.

### Stack协调者 {#stack-reconciler}

"stack"协调者 is the implementation powering React 15 and earlier. 虽然我们已经停止使用他了, 但是这个在[下一章节](/docs/implementation-notes.html)有详细的文档。

### Fiber协调者 {#fiber-reconciler}

"fiber"协调者是一个新尝试，致力于解决问题stack协调者中固有的问题，同时解决一些由来已久的问题。这个从React 16开始变成了默认的协调者。

它的主要目标是：

* Ability to split interruptible work in chunks.
* Ability to prioritize, rebase and reuse work in progress.
* Ability to yield back and forth between parents and children to support layout in React.
* 能够从`render()`中返回多个元素。
* 更好地支持错误边界。

你可以在[这里](https://github.com/acdlite/react-fiber-architecture)和[这里](https://medium.com/react-in-depth/inside-fiber-in-depth-overview-of-the-new-reconciliation-algorithm-in-react-e1c04700ef6e)，深入了解React Fiber架构。
While it has shipped with React 16, the async features are not enabled by default yet.

他的代码在[`packages/react-reconciler`](https://github.com/facebook/react/tree/master/packages/react-reconciler)。

### 事件系统 {#event-system}
React实现一个合成事件，与渲染层无关，适用于React DOM和React Native。他的源码在[`packages/events`](https://github.com/facebook/react/tree/master/packages/events)。

这个是一个[深入研究代码的视频](https://www.youtube.com/watch?v=dRo_egw7tBc) （66分钟）。

### 下一个是什么？ {#what-next}

查看[下一章节](/docs/implementation-notes.html)去学习协调者在pre-React 16中的实现。我们还没有给新的协调者的内部原理写文档。
