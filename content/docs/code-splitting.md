---
id: code-splitting
title: 代码分割
permalink: docs/code-splitting.html
---

## 打包 {#bundling}

大多数 React 应用都会使用 [Webpack](https://webpack.docschina.org)，[Rollup](https://rollupjs.org/) 或 [Browserify](http://browserify.org/) 这类的构建工具来打包文件。打包是一个将文件引入并合并到一个单独文件的过程，最终形成一个 “bundle”。接着在页面上引入该 bundle，整个应用即可一次性加载。

#### 示例 {#example}

**App文件：**

```js
// app.js
import { add } from './math.js';

console.log(add(16, 26)); // 42
```

```js
// math.js
export function add(a, b) {
  return a + b;
}
```

**打包后文件：**

```js
function add(a, b) {
  return a + b;
}

console.log(add(16, 26)); // 42
```

> 注意：
>
> 最终你打包后的文件可能看起来会和上面的例子区别很大。

如果你正在使用 [Create React App](https://create-react-app.dev)，[Next.js](https://nextjs.org/)，[Gatsby](https://www.gatsbyjs.org/)，或者类似的工具，你可以直接使用内置的 Webpack 配置来构建你的应用。

如果你没有使用这类工具，你就需要自己来进行配置。例如，查看 Webpack 文档上的[安装](https://webpack.docschina.org/guides/installation/)和[入门教程](https://webpack.docschina.org/guides/getting-started/)。

## 代码分割 {#code-splitting}

打包是个非常棒的技术，但随着你的应用增长，你的代码包也将随之增长。尤其是在整合了体积巨大的第三方库的情况下。你需要关注你代码包中所包含的代码，以避免因体积过大而导致加载时间过长。

为了避免搞出大体积的代码包，在前期就思考该问题并对代码包进行分割是个不错的选择。
代码分割是由诸如 [Webpack](https://webpack.docschina.org/guides/code-splitting/)，[Rollup](https://rollupjs.org/guide/en/#code-splitting) 和 Browserify（[factor-bundle](https://github.com/browserify/factor-bundle)）这类打包器支持的一项技术，能够创建多个包并在运行时动态加载。

对你的应用进行代码分割能够帮助你“懒加载”当前用户所需要的内容，能够显著地提高你的应用性能。尽管并没有减少应用整体的代码体积，但你可以避免加载用户永远不需要的代码，并在初始加载的时候减少所需加载的代码量。

## `import()` {#import}

在你的应用中引入代码分割的最佳方式是通过动态 `import()` 语法。

**使用之前：**

```js
import { add } from './math';

console.log(add(16, 26));
```

**使用之后：**

```js
import("./math").then(math => {
  console.log(math.add(16, 26));
});
```

当 Webpack 解析到该语法时，会自动进行代码分割。如果你使用 Create React App，该功能已开箱即用，你可以[立刻使用](https://create-react-app.dev/docs/code-splitting/)该特性。[Next.js](https://nextjs.org/docs/advanced-features/dynamic-import) 也已支持该特性而无需进行配置。

如果你自己配置 Webpack，你可能要阅读下 Webpack 关于[代码分割](https://webpack.docschina.org/guides/code-splitting/)的指南。你的 Webpack 配置应该[类似于此](https://gist.github.com/gaearon/ca6e803f5c604d37468b0091d9959269)。

当使用 [Babel](https://babeljs.io/) 时，你要确保 Babel 能够解析动态 import 语法而不是将其进行转换。对于这一要求你需要 [@babel/plugin-syntax-dynamic-import](https://classic.yarnpkg.com/en/package/@babel/plugin-syntax-dynamic-import) 插件。

## `React.lazy` {#reactlazy}

`React.lazy` 函数能让你像渲染常规组件一样处理动态引入（的组件）。

**使用之前：**

```js
import OtherComponent from './OtherComponent';
```

**使用之后：**

```js
const OtherComponent = React.lazy(() => import('./OtherComponent'));
```

此代码将会在组件首次渲染时，自动导入包含 `OtherComponent` 组件的包。

`React.lazy` 接受一个函数，这个函数需要动态调用 `import()`。它必须返回一个 `Promise`，该 Promise 需要 resolve 一个 `default` export 的 React 组件。

然后应在 `Suspense` 组件中渲染 lazy 组件，如此使得我们可以使用在等待加载 lazy 组件时做优雅降级（如 loading 指示器等）。

```js
import React, { Suspense } from 'react';

const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <OtherComponent />
      </Suspense>
    </div>
  );
}
```

`fallback` 属性接受任何在组件加载过程中你想展示的 React 元素。你可以将 `Suspense` 组件置于懒加载组件之上的任何位置。你甚至可以用一个 `Suspense` 组件包裹多个懒加载组件。

```js
import React, { Suspense } from 'react';

const OtherComponent = React.lazy(() => import('./OtherComponent'));
const AnotherComponent = React.lazy(() => import('./AnotherComponent'));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <section>
          <OtherComponent />
          <AnotherComponent />
        </section>
      </Suspense>
    </div>
  );
}
```

### 避免兜底 {#avoiding-fallbacks}

任何组件都可能因渲染而暂停，甚至是已经展示给用户的组件。为了使屏幕内容始终一致，如果一个已经显示的组件暂停，React 必须隐藏它的树，直到最近的 `<Suspense>` 边界。然而，从用户的角度来看，这可能会使人很困惑。

参考这个标签切换的示例：

```js
import React, { Suspense } from 'react';
import Tabs from './Tabs';
import Glimmer from './Glimmer';

const Comments = React.lazy(() => import('./Comments'));
const Photos = React.lazy(() => import('./Photos'));

function MyComponent() {
  const [tab, setTab] = React.useState('photos');
  
  function handleTabSelect(tab) {
    setTab(tab);
  };

  return (
    <div>
      <Tabs onTabSelect={handleTabSelect} />
      <Suspense fallback={<Glimmer />}>
        {tab === 'photos' ? <Photos /> : <Comments />}
      </Suspense>
    </div>
  );
}

```

在这个示例中，如果标签从 `'photos'` 切换为 `'comments'`，但 `Comments` 会暂停，用户会看到屏幕闪烁。这符合常理，因为用户不想看到 `'photos'`，而 `Comments` 组件还没有准备好渲染其内容，而 React 为了保证用户体验的一致性，只能显示上面的 `Glimmer`，别无选择。

然而，有时这种用户体验并不可取。特别是在准备新 UI 时，展示 "旧" 的 UI 会体验更好。你可以尝试使用新的 [`startTransition`](/docs/react-api.html#starttransition) API 来让 React 实现这一点：

```js
function handleTabSelect(tab) {
  startTransition(() => {
    setTab(tab);
  });
}
```

此处代码会告知 React，将标签切换为 `'comments'` 不会标记为紧急更新，而是标记为需要一些准备时间的 [transition](/docs/react-api.html#transitions)。然后 React 会保留旧的 UI 并进行交互，当它准备好时，会切换为 `<Comments />`，具体请参阅 [Transitions](/docs/react-api.html#transitions) 以了解更多相关信息。

### 异常捕获边界（Error boundaries）{#error-boundaries}

如果模块加载失败（如网络问题），它会触发一个错误。你可以通过[异常捕获边界（Error boundaries）](/docs/error-boundaries.html)技术来处理这些情况，以显示良好的用户体验并管理恢复事宜。

```js
import React, { Suspense } from 'react';
import MyErrorBoundary from './MyErrorBoundary';

const OtherComponent = React.lazy(() => import('./OtherComponent'));
const AnotherComponent = React.lazy(() => import('./AnotherComponent'));

const MyComponent = () => (
  <div>
    <MyErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <section>
          <OtherComponent />
          <AnotherComponent />
        </section>
      </Suspense>
    </MyErrorBoundary>
  </div>
);
```

## 基于路由的代码分割 {#route-based-code-splitting}

决定在哪引入代码分割需要一些技巧。你需要确保选择的位置能够均匀地分割代码包而不会影响用户体验。

一个不错的选择是从路由开始。大多数网络用户习惯于页面之间能有个加载切换过程。你也可以选择重新渲染整个页面，这样您的用户就不必在渲染的同时再和页面上的其他元素进行交互。

这里是一个例子，展示如何在你的应用中使用 `React.lazy` 和 [React Router](https://reactrouter.com/) 这类的第三方库，来配置基于路由的代码分割。

```js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));

const App = () => (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Suspense>
  </Router>
);
```

## 命名导出（Named Exports）{#named-exports}

`React.lazy` 目前只支持默认导出（default exports）。如果你想被引入的模块使用命名导出（named exports），你可以创建一个中间模块，来重新导出为默认模块。这能保证 tree shaking 不会出错，并且不必引入不需要的组件。

```js
// ManyComponents.js
export const MyComponent = /* ... */;
export const MyUnusedComponent = /* ... */;
```

```js
// MyComponent.js
export { MyComponent as default } from "./ManyComponents.js";
```

```js
// MyApp.js
import React, { lazy } from 'react';
const MyComponent = lazy(() => import("./MyComponent.js"));
```
