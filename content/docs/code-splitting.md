---
id: code-splitting
title: 代码分割
permalink: docs/code-splitting.html
---

## 打包 {#bundling}

<<<<<<< HEAD
大多数 React 应用都会使用 [Webpack](https://webpack.docschina.org)，[Rollup](https://rollupjs.org/) 或 [Browserify](http://browserify.org/) 这类的构建工具来打包文件。
打包是一个将文件引入并合并到一个单独文件的过程，最终形成一个 “bundle”。
接着在页面上引入该 bundle，整个应用即可一次性加载。
=======
Most React apps will have their files "bundled" using tools like [Webpack](https://webpack.js.org/), [Rollup](https://rollupjs.org/) or [Browserify](http://browserify.org/). Bundling is the process of following imported files and merging them into a single file: a "bundle". This bundle can then be included on a webpage to load an entire app at once.
>>>>>>> upstream/master

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
> 最终你的打包文件看起来会和上面的例子区别很大。

<<<<<<< HEAD
如果你正在使用 [Create React App](https://create-react-app.dev)，[Next.js](https://nextjs.org/)，[Gatsby](https://www.gatsbyjs.org/)，或者类似的工具，你可以直接使用的 Webpack 配置来构建你的应用。

如果你没有使用这类工具，你就需要自己来进行配置。例如，查看 Webpack 文档上的[安装](https://webpack.docschina.org/guides/installation/)和[入门教程](https://webpack.docschina.org/guides/getting-started/)。
=======
If you're using [Create React App](https://create-react-app.dev/), [Next.js](https://nextjs.org/), [Gatsby](https://www.gatsbyjs.org/), or a similar tool, you will have a Webpack setup out of the box to bundle your app.

If you aren't, you'll need to setup bundling yourself. For example, see the [Installation](https://webpack.js.org/guides/installation/) and [Getting Started](https://webpack.js.org/guides/getting-started/) guides on the Webpack docs.
>>>>>>> upstream/master

## 代码分割 {#code-splitting}

<<<<<<< HEAD
打包是个非常棒的技术，但随着你的应用增长，你的代码包也将随之增长。尤其是在整合了体积巨大的第三方库的情况下。你需要关注你代码包中所包含的代码，以避免因体积过大而导致加载时间过长。

为了避免搞出大体积的代码包，在前期就思考该问题并对代码包进行分割是个不错的选择。
代码分割是由诸如 [Webpack](https://webpack.docschina.org/guides/code-splitting/)，[Rollup](https://rollupjs.org/guide/en/#code-splitting) 和 Browserify（[factor-bundle](https://github.com/browserify/factor-bundle)）这类打包器支持的一项技术，能够创建多个包并在运行时动态加载。

对你的应用进行代码分割能够帮助你“懒加载”当前用户所需要的内容，能够显著地提高你的应用性能。尽管并没有减少应用整体的代码体积，但你可以避免加载用户永远不需要的代码，并在初始加载的时候减少所需加载的代码量。

## `import()` {#import}

在你的应用中引入代码分割的最佳方式是通过动态 `import()` 语法。
=======
Bundling is great, but as your app grows, your bundle will grow too. Especially if you are including large third-party libraries. You need to keep an eye on the code you are including in your bundle so that you don't accidentally make it so large that your app takes a long time to load.

To avoid winding up with a large bundle, it's good to get ahead of the problem and start "splitting" your bundle. Code-Splitting is a feature
supported by bundlers like [Webpack](https://webpack.js.org/guides/code-splitting/), [Rollup](https://rollupjs.org/guide/en/#code-splitting) and Browserify (via [factor-bundle](https://github.com/browserify/factor-bundle)) which can create multiple bundles that can be dynamically loaded at runtime.

Code-splitting your app can help you "lazy-load" just the things that are currently needed by the user, which can dramatically improve the performance of your app. While you haven't reduced the overall amount of code in your app, you've avoided loading code that the user may never need, and reduced the amount of code needed during the initial load.

## `import()` {#import}

The best way to introduce code-splitting into your app is through the dynamic `import()` syntax.
>>>>>>> upstream/master

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

<<<<<<< HEAD
当 Webpack 解析到该语法时，会自动进行代码分割。
如果你使用 Create React App，该功能已开箱即用，
你可以[立刻使用](https://create-react-app.dev/docs/code-splitting/)该特性。
[Next.js](https://nextjs.org/docs/advanced-features/dynamic-import) 也已支持该特性而无需进行配置。

如果你自己配置 Webpack，你可能要阅读下 Webpack 关于[代码分割](https://webpack.docschina.org/guides/code-splitting/)的指南。你的 Webpack 配置应该[类似于此](https://gist.github.com/gaearon/ca6e803f5c604d37468b0091d9959269)。

当使用 [Babel](https://babeljs.io/) 时，你要确保 Babel 能够解析动态 import 语法而不是将其进行转换。对于这一要求你需要 [@babel/plugin-syntax-dynamic-import](https://classic.yarnpkg.com/en/package/@babel/plugin-syntax-dynamic-import) 插件。
=======
When Webpack comes across this syntax, it automatically starts code-splitting your app. If you're using Create React App, this is already configured for you and you can [start using it](https://create-react-app.dev/docs/code-splitting/) immediately. It's also supported out of the box in [Next.js](https://nextjs.org/docs/advanced-features/dynamic-import).

If you're setting up Webpack yourself, you'll probably want to read Webpack's [guide on code splitting](https://webpack.js.org/guides/code-splitting/). Your Webpack config should look vaguely [like this](https://gist.github.com/gaearon/ca6e803f5c604d37468b0091d9959269).

When using [Babel](https://babeljs.io/), you'll need to make sure that Babel can parse the dynamic import syntax but is not transforming it. For that you will need [@babel/plugin-syntax-dynamic-import](https://classic.yarnpkg.com/en/package/@babel/plugin-syntax-dynamic-import).
>>>>>>> upstream/master

## `React.lazy` {#reactlazy}

> 注意:
>
> `React.lazy` 和 Suspense 技术还不支持服务端渲染。如果你想要在使用服务端渲染的应用中使用，我们推荐 [Loadable Components](https://github.com/gregberge/loadable-components) 这个库。它有一个很棒的[服务端渲染打包指南](https://loadable-components.com/docs/server-side-rendering/)。

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

<<<<<<< HEAD
决定在哪引入代码分割需要一些技巧。你需要确保选择的位置能够均匀地分割代码包而不会影响用户体验。

一个不错的选择是从路由开始。大多数网络用户习惯于页面之间能有个加载切换过程。你也可以选择重新渲染整个页面，这样您的用户就不必在渲染的同时再和页面上的其他元素进行交互。

这里是一个例子，展示如何在你的应用中使用 `React.lazy` 和 [React Router](https://react-router.docschina.org/) 这类的第三方库，来配置基于路由的代码分割。
=======
Deciding where in your app to introduce code splitting can be a bit tricky. You want to make sure you choose places that will split bundles evenly, but won't disrupt the user experience.

A good place to start is with routes. Most people on the web are used to page transitions taking some amount of time to load. You also tend to be re-rendering the entire page at once so your users are unlikely to be interacting with other elements on the page at the same time.

Here's an example of how to setup route-based code splitting into your app using libraries like [React Router](https://reacttraining.com/react-router/) with `React.lazy`.
>>>>>>> upstream/master

```js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));

const App = () => (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/about" component={About}/>
      </Switch>
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
