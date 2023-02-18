---
title: 'React v16.9.0 发布及 Roadmap 最新进展'
author: [gaearon, bvaughn]
---

今天我们发布了 React 16.9。它包含几个新功能，bug 修复以及新的弃用警告，以助于筹备接下来的主要版本。

## 新的弃用 {/*new-deprecations*/}

### 重命名 Unsafe 的生命周期方法 {/*renaming-unsafe-lifecycle-methods*/}

[一年前](/blog/2018/03/27/update-on-async-rendering)，我们宣布新的 unsafe 的生命周期方法正在进行重命名：

- `componentWillMount` → `UNSAFE_componentWillMount`
- `componentWillReceiveProps` → `UNSAFE_componentWillReceiveProps`
- `componentWillUpdate` → `UNSAFE_componentWillUpdate`

**React 16.9 未包含破坏性更改，并且旧的生命周期方法名在此版本继续沿用。**但当你使用旧的生命周期方法名时，你将看到如下警告：

![Warning: componentWillMount has been renamed, and is not recommended for use.](https://i.imgur.com/sngxSML.png)

正如警告所示，对于每种 unsafe 的方法来说，通常都有[更好的解决方案](/blog/2018/03/27/update-on-async-rendering#migrating-from-legacy-lifecycles)。但你可能没有时间迁移或测试这些组件。在这种情况下，我们建议你运行一个自动重命名的 ["codemod"](https://medium.com/@cpojer/effective-javascript-codemods-5a6686bb46fb) 脚本：

```bash
cd your_project
npx react-codemod rename-unsafe-lifecycles
```

__（请注意，这里使用了 `npx`，而非 `npm`。`npx` 是 Node 6+ 默认提供的实用工具）__

运行 codemod 会将旧的生命周期方法名替换，例如 `componentWillMount` 会被替换为 `UNSAFE_componentWillMount`：

![Codemod in action](https://i.imgur.com/Heyvcyi.gif)

新的方法名（如 `UNSAFE_componentWillMount`）**在 React 16.9 和 React 17.x 中，仍可以继续使用**。但是，新的 `UNSAFE_` 前缀将有助于在代码 review 和 debug 期间，使这些有问题的字样更突出。（你也可以按照自己的意愿，在你的应用中选择性的引入 [严格模式（Strict Mode）](/docs/strict-mode) 来进一步阻止大家使用它们）。

>注意
>
>了解更多关于 [版本策略及对稳定性的承诺](/docs/faq-versioning#commitment-to-stability)。

### 废弃 `javascript:` 形式的 URL {/*deprecating-javascript-urls*/}

以 `javascript:` 开头的 URL 非常容易遭受攻击，因为它很容易在诸如 `<a href>` 之类的标签中引入未经过处理的输出并会造成安全漏洞：

```js
const userProfile = {
  website: "javascript: alert('you got hacked')",
};
// 此处现在会有警告
<a href={userProfile.website}>Profile</a>
```

**在 React 16.9 中，** 这种模式将继续有效，但它将输出一个警告。如果你需使用 `javascript:` 形式的 URL 作为逻辑，请尝试使用 React 的事件处理程序替代。（万不得已时，你可以使用 [`dangerouslySetInnerHTML`](/docs/dom-elements#dangerouslysetinnerhtml) 来规避保护，但是这样并不被推荐且经常导致安全漏洞。）

**未来的主要版本中，** 如果遇到 `javascript:` 形式的 URL，React 将抛出错误。

### 废弃 "Factory" 组件 {/*deprecating-factory-components*/}

在使用 Babel 编译 JavaScript Class 成为主流前，React 支持 "factory" 组件，该组件使用 `render` 方法返回一个对象：

```js
function FactoryComponent() {
  return {
    render() {
      return <div />;
    },
  };
}
```

这种方式令人困惑，因为它看起来像函数组件 —— 但它并不是。（函数组件只返回示例中的 `<div />`。）

这种方式几乎从未被广泛使用过，并且支持它会导致 React 变大且变慢。因此，我们在 16.9 中逐步弃用此模式，并在遇到时输出警告。如果项目中依赖了此组件，可以通过添加 `FactoryComponent.prototype = React.Component.prototype` 作为解决方案。或者你可以直接将其转换为 class 组件或函数组件。

我们不希望大多数代码库受到此影响。

## 新特性 {/*new-features*/}

### 用于测试的异步函数 [`act()`](/docs/test-utils#act) {/*async-act-for-testing*/}

[React 16.8](/blog/2019/02/06/react-v16.8.0) 引入了名为 [`act()`](/docs/test-utils#act) 的新测试实用工具来帮助你编写更符合浏览器行为的测试代码。例如，单个 `act()` 中的多个状态更新会进行批处理。这与 React 在处理真实浏览器事件时的工作方式相匹配，并有助于为将来 React 更频繁地批量更新组件做准备。

然而，在 16.8 中的 `act()` 仅支持同步函数。有时，你可能会在测试时看到类似的警告，但[无法轻易修复](https://github.com/facebook/react/issues/14769)：

```
An update to SomeComponent inside a test was not wrapped in act(...).
```

**在 React 16.9 中，`act()` 也支持异步函数，** 并且你可以在调用它时使用 `await`：

```js
await act(async () => {
  // ...
});
```

这就解决了之前无法使用 `act()` 的情况，如当 state 更新发生在异步函数内时。因此 **现在你应该能在测试中修复所有有关 `act()` 的警告了。**

我们了解到没有足够的信息来说明如何使用 `act()` 来编写测试。新的[测试技巧](/docs/testing-recipes)一文描述了场景的场景，以及 `act()` 如何帮助你编写优秀的测试。这些示例采用了原生 DOM API，但你可以使用 [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) 来减少样板代码（boilerplate code）。它的许多方法已经在实现上运用了 `act()`。

如果你遇到 `act()` 的相关问题，请提出 [issue](https://github.com/facebook/react/issues) 告知我们，我们会尽力提供帮助。

### 使用 [`<React.Profiler>`](/docs/profiler) 进行性能评估 {/*performance-measurements-with-reactprofiler*/}

在 React 16.5 中，我们推出了新的 [React Profiler for DevTools](/blog/2018/09/10/introducing-the-react-profiler)，它可以帮你找出应用程序中的性能瓶颈。**在 React 16.9 中，我们还提供了一种通过*编程*的方式来收集测量你的代码**，这种方式被称为 `<React.Profiler>`。我们预计大多数较小的应用都不会使用它，但在较大的应用中追踪性能回归可能会很方便。

`<Profiler>` 能测量 React 应用程序渲染的频率以及渲染的 “成本”。其目的是帮助标识应用程序中渲染缓慢的部分，并可能会更易于进行 [memoization](/docs/hooks-faq#how-to-memoize-calculations) 等优化。

`<Profiler>` 可以在 React 树中的任意位置添加，以评估渲染树中对应位置的成本。
它依赖两个 props：`id` (string) 和 [`onRender` 回调](/docs/profiler#onrender-callback) (function)，当树中的组件 “提交（commit）” 更新时， React 就会调用它。

```js {2,7}
render(
  <Profiler id="application" onRender={onRenderCallback}>
    <App>
      <Navigation {...props} />
      <Main {...props} />
    </App>
  </Profiler>
);
```

欲了解有关 `Profiler` 和传递给 `onRender` 回调参数的更多信息，请参阅 [`Profiler` 文档](/docs/profiler)。

> 注意:
>
> 性能分析会增加额外的开销，因此它**在[生产构建](https://reactjs.org/docs/optimizing-performance#use-the-production-build)中会被禁用**。
>
> 如果想要在生产环境进行性能分析，React 提供了一个特殊的生成构建，并启用了分析模式。
> 在 [fb.me/react-profiling](https://fb.me/react-profiling) 中阅读有关如何使用此构建的更多信息。

## 值得注意的 bug 修复 {/*notable-bugfixes*/}

此版本包含一些其他显著的改进：

- 在 `<Suspense>` 树中调用 `findDOMNode()` 时出现崩溃的情况。[已修复](https://github.com/facebook/react/pull/15312)。

- 保留已删除的子树导致的内存泄露。[已修复](https://github.com/facebook/react/pull/16115)。

- 由 `useEffect` 中 `setState` 引起的无限循环，现在会[输出错误](https://github.com/facebook/react/pull/15180)。（这与在 class 组件中的 `componentDidUpdate` 调用 `setState` 时看到的错误一致。）

感谢所有帮助解决这些问题的贡献者。你可以在[此处](#changelog)找到完整的更新日志。

## Roadmap 的进展 {/*an-update-to-the-roadmap*/}

[2018 年 11 月](/blog/2018/11/27/react-16-roadmap)我们发布了 16.x 版本的 roadmap：

- 实现 React Hooks 的 16.x 小版本（预估：Q1 2019）
- 实现 Concurrent Mode 的 16.x 小版本 (预估：Q2 2019)
- 实现 Suspense for Data Fetching (预估：2019 年中)

这些预估过于理想化，我们需要进行调整。

**tldr：** 我们按时发布了 Hook，但我们正在将 Concurrent Mode 和 Suspense for Data Fetching 重组为今年晚些时候的单个版本。

2 月份时，我们在[发布的稳定 16.8 版本](/blog/2019/02/06/react-v16.8.0)中引入了 React Hook，React Native 在[一个月后](https://reactnative.dev/blog/2019/03/12/releasing-react-native-059)也进行了支持。但是，我们低估了此版本的后续工作，其中包括 lint 规则，developer tools，示例以及更多文档。这使得时间线发生了改变。

现在 React Hook 已经推出，Concurrent Mode 和 Suspense for Data Fetching 的工作正在全面展开。[目前正在进行 Facebook 新网站的研发工作](https://twitter.com/facebook/status/1123322299418124289) 是建立在这些特性基础之上的。使用真实代码环境对它们进行测试有助于在影响开源用户之前发现并解决许多未知问题。其中一些修复涉及到这些特性的内部重新设计，这也导致时间的推迟。

望大家理解，这就是我们接下来的计划。

### 一个版本而不是两个版本 {/*one-release-instead-of-two*/}

Concurrent Mode 和 Suspense [驱动了 Facebook 新网站的研发](https://developers.facebook.com/videos/2019/building-the-new-facebookcom-with-react-graphql-and-relay/)，这个项目目前在积极的开发中，因此我们可以很自信的说，从技术上讲，Concurrent Mode 和 Suspense 已近乎稳定了。同时，我们也更加清楚，在它们被开源使用之前我们应该具体做哪些步骤。

最开始，我们觉得为了实现 Data Fetching（数据请求），我们需要把 Concurrent Mode 和 Suspense 拆分为两个版本。后来我们发现，这个顺序很难说的通，因为这些特性之间的关系比我们当初想象的更为密切。因此，我们计划为 Data Fetching 发布一个同时支持 Concurrent Mode 和 Suspense 的单个版本。

我们不想再次过度承诺发布日期。考虑到我们在生产环境的代码中同时依赖了这两者，我们期望今年的 16.x 的某个版本中，支持可以选择性的使用它们。

### Data Fetching 的进展 {/*an-update-on-data-fetching*/}

虽然 React 没有规定你如何请求数据，但是第一版用来请求数据的 Suspense 很有可能专注于集成 __固定的数据请求库__。比如，在 Facebook，我们正在使用即将发布的集成了 Suspense 的 Relay APIs。我们也将会给出对其他库（比如 Apollo）做类似的整合的文档。

在第一个版本中，我们 __并没有__ 打算专注于我们在早期演示中（也称为“React Cache”）使用的临时 “触发HTTP请求” 解决方案。但是，我们希望我们和 React 社区将在首次发布后的几个月内仍会在这个领域继续探索。

### 服务端渲染的进展 {/*an-update-on-server-rendering*/}

我们已经开始研究[新的支持 Suspense 的服务器端渲染引擎](/blog/2018/11/27/react-16-roadmap#suspense-for-server-rendering)，但是我们 __不认为__ 它在并发模式的最初版本将会就绪。然而，这个版本将会提供一个临时的解决方案，这个方案可以让现有的服务端渲染引擎在 Suspense 的回调函数中立即生成 HTML，然后在客户端渲染出真正的内容。这就是我们在流式渲染引擎就绪之前，当前在 Facebook 内部使用的方案。

### 为什么要花费这么久时间？ {/*why-is-it-taking-so-long*/}

随着每个单独的部件趋于稳定，我们将它们迁移到了并发模式中，其中包括了 [新的 context API](/blog/2018/03/29/react-v-16-3)、[含有 Suspense 的懒加载](/blog/2018/10/23/react-v-16-6) 以及 [Hook](/blog/2019/02/06/react-v16.8.0)。我们也十分期望发布其他缺失的部分，但是[大规模尝试它们](/docs/design-principles#dogfooding)是这个过程中一个很重要的部分。坦诚地说，我们比最开始预想投入了更多的工作。我们会一如既往，感谢你在 [Twitter](https://twitter.com/reactjs) 和 [问题跟踪](https://github.com/facebook/react/issues) 中提出的问题和反馈。

## 安装 {/*installation*/}

### React {/*react*/}

npm registry 中提供了 React v16.9.0。

使用 yarn 安装 React 16，执行如下命令：

```bash
yarn add react@^16.9.0 react-dom@^16.9.0
```

使用 npm 安装 React 16，执行如下命令：

```bash
npm install --save react@^16.9.0 react-dom@^16.9.0
```

我们还通过 CDN 提供了 React 的 UMD 版本：

```html
<script
  crossorigin
  src="https://unpkg.com/react@16/umd/react.production.min.js"
></script>
<script
  crossorigin
  src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"
></script>
```

请参阅[详细安装说明文档](/docs/installation)。

## Changelog {/*changelog*/}

### React {/*changelog-react*/}

- 提供 `<React.Profiler>` API 实现以编程的方式进行性能评估。([@bvaughn](https://github.com/bvaughn) in [#15172](https://github.com/facebook/react/pull/15172))
- 删除 `unstable_ConcurrentMode` 以支持 `unstable_createRoot`。([@acdlite](https://github.com/acdlite) in [#15532](https://github.com/facebook/react/pull/15532))

### React DOM {/*changelog-react-dom*/}

- 弃用以 `UNSAFE_*` 开头的旧生命周期方法。([@bvaughn](https://github.com/bvaughn) in [#15186](https://github.com/facebook/react/pull/15186) and [@threepointone](https://github.com/threepointone) in [#16103](https://github.com/facebook/react/pull/16103))
- 弃用 `javascript:` 形式的 URL。 ([@sebmarkbage](https://github.com/sebmarkbage) in [#15047](https://github.com/facebook/react/pull/15047))
- 弃用不常用的 "module pattern" (factory) 组件。 ([@sebmarkbage](https://github.com/sebmarkbage) in [#15145](https://github.com/facebook/react/pull/15145))
- 在 `<video>` 组件上添加对 `disablePictureInPicture` 属性的支持。([@eek](https://github.com/eek) in [#15334](https://github.com/facebook/react/pull/15334))
- 为 `<embed>` 添加对 `onLoad` 事件的支持。([@cherniavskii](https://github.com/cherniavskii) in [#15614](https://github.com/facebook/react/pull/15614))
- 为在 DevTools 中编辑 `useState` 的 state 提供支持。([@bvaughn](https://github.com/bvaughn) in [#14906](https://github.com/facebook/react/pull/14906))
- 为在 DevTools 中切换 Suspense 提供支持。([@gaearon](https://github.com/gaearon) in [#15232](https://github.com/facebook/react/pull/15232))
- 当 `setState` 在 `useEffect` 中循环调用时，发出警告。([@gaearon](https://github.com/gaearon) in [#15180](https://github.com/facebook/react/pull/15180))
- 修复内存泄露。([@paulshen](https://github.com/paulshen) in [#16115](https://github.com/facebook/react/pull/16115))
- 修复 `<Suspense>` 包裹的组件中使用 `findDOMNode` 发生崩溃的问题。([@acdlite](https://github.com/acdlite) in [#15312](https://github.com/facebook/react/pull/15312))
- 修复因为刷新太晚而导致 pending effect 的情况。([@acdlite](https://github.com/acdlite) in [#15650](https://github.com/facebook/react/pull/15650))
- 修复警告信息中不正确的参数顺序。([@brickspert](https://github.com/brickspert) in [#15345](https://github.com/facebook/react/pull/15345))
- 修复当存在 `!important` 样式时，隐藏 Suspense 降级节点的问题。([@acdlite](https://github.com/acdlite) in [#15861](https://github.com/facebook/react/pull/15861) and [#15882](https://github.com/facebook/react/pull/15882))
- 提高 hydration 的性能。([@bmeurer](https://github.com/bmeurer) in [#15998](https://github.com/facebook/react/pull/15998))

### React DOM Server {/*changelog-react-dom-server*/}

- 修复 camelCase 自定义 CSS 属性名称的错误输出。([@bedakb](https://github.com/bedakb) in [#16167](https://github.com/facebook/react/pull/16167))

### React Test Utilities and Test Renderer {/*changelog-react-test-utilities-and-test-renderer*/}

- 添加 `act(async () => ...)` 来测试异步状态更新。([@threepointone](https://github.com/threepointone) in [#14853](https://github.com/facebook/react/pull/14853))
- 添加对不同渲染器嵌套 `act` 的支持。 ([@threepointone](https://github.com/threepointone) in [#16039](https://github.com/facebook/react/pull/16039) and [#16042](https://github.com/facebook/react/pull/16042))
- 在严格模式下，如果副作用函数在 `act` 之外被调用，就会发出警告。([@threepointone](https://github.com/threepointone) in [#15763](https://github.com/facebook/react/pull/15763) and [#16041](https://github.com/facebook/react/pull/16041))
- 当在错误的渲染器中使用 `act` 时发出警告。([@threepointone](https://github.com/threepointone) in [#15756](https://github.com/facebook/react/pull/15756))
