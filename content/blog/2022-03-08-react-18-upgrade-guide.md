---
title: "如何升级到 React 18"
author: [rickhanlonii]
---

我们在 [release post](/blog/2022/03/29/react-v18.html) 分享过, React 18 带来了并发渲染驱动的特性，对已有应用支持循序渐进的采用策略。本文将向你说明升级到 React 18 的步骤。

升级到 React 18 遇到问题请 [报告issue](https://github.com/facebook/react/issues/new/choose) 。

*React Native 用户请注意: React Native 在未来版本会集成 React 18。 这是因为 React 18 依赖 React Native 的新架构，从而受益于本文介绍的新能力。更多信息请阅读 [React Conf keynote](https://www.youtube.com/watch?v=FZ0cG47msEk&t=1530s) 。*

## 安装 {#installing}

安装 React 最新版本：

```bash
npm install react react-dom
```

如果你使用 yarn ：

```bash
yarn add react react-dom
```

## 升级客户端渲染 API {#updates-to-client-rendering-apis}

初次安装 React 18，控制台会显示一条警告：

>  React 18 不再支持 ReactDOM.render，请替换成 createRoot 。直到切换为新 API，你的应用表现的就像是运行在 React 17 。了解更多：https://reactjs.org/link/switch-to-createroot

React 18 引入了一个新的 root API ，可以更高效地操作 root（provides better ergonomics for managing roots）。新的 root API 也开启了新的并发渲染器，带你走向并发渲染特性。

```js
// 升级前
import { render } from 'react-dom';
const container = document.getElementById('app');
render(<App tab="home" />, container);

// 升级后
import { createRoot } from 'react-dom/client';
const container = document.getElementById('app');
const root = createRoot(container); // TypeScript 使用 createRoot(container!)
root.render(<App tab="home" />);
```

`unmountComponentAtNode` 也更改为 `root.unmount` 了:

```js
// 升级前
unmountComponentAtNode(container);

// 升级后
root.unmount();
```

我们还删除了渲染回调，因为在使用 Suspense 时通常得不到预期结果。

```js
// 升级前
const container = document.getElementById('app');
render(<App tab="home" />, container, () => {
  console.log('rendered');
});

// 升级后
function AppWithCallbackAfterRender() {
  useEffect(() => {
    console.log('rendered');
  });

  return <App tab="home" />
}

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<AppWithCallbackAfterRender />);
```

> 注意：
> 
> 不存在老的渲染回调 API 一一对应的替代品 —— 这取决于你的使用场景。阅读工作组文章 [用 createRoot 取代 render](https://github.com/reactwg/react-18/discussions/5) 获取更多信息。

最后，如果你的应用使用了服务端渲染和 hydration ，需要把 `hydrate` 升级为 `hydrateRoot`：

```js
// 升级前
import { hydrate } from 'react-dom';
const container = document.getElementById('app');
hydrate(<App tab="home" />, container);

// 升级后
import { hydrateRoot } from 'react-dom/client';
const container = document.getElementById('app');
const root = hydrateRoot(container, <App tab="home" />);
// 和 createRoot 不同，这里不需要再调用 root.render() 。
```

请阅读 [工作组讨论](https://github.com/reactwg/react-18/discussions/5) 获取更多信息。

> 注意
> 
> **如果你的应用在升级后无法正常工作，请检查是否包裹了 `<StrictMode>` 。** [React 18 的严格模式更严格了](#updates-to-strict-mode)，而且不是你所有的组件都适应开发模式增加的新检查。如果删掉严格模式可以修复你的应用，那么可以在升级过程中先删除，然后解决问题后再加回去（在顶层或者作为组件树的一部分）。 

## 升级服务端渲染 API {#updates-to-server-rendering-apis}

本次发布我们改进了 `react-dom/server` API ，以在 SSR 和流式 SSR 完全支持 Suspense 。作为更改的一部分，我们废弃了老的 Node 流式 API，因为它不支持服务端增量 Suspense 流。

使用这些 API 会告警：

* `renderToNodeStream`: **已废弃 ⛔️️**

Node 环境使用 streaming ，请使用：
* `renderToPipeableStream`: **新 ✨**

我们还引入了一个新的 API ，以在现代边缘运行时环境，如 Deno 和 Cloudflare worker 支持带 Suspense 的流式 SSR ：
* `renderToReadableStream`: **新 ✨**

以下 API 依然可用，但是对 Suspense 的支持是受限的：
* `renderToString`: **受限的** ⚠️
* `renderToStaticMarkup`: **受限的** ⚠️

最后，以下这个 API 依然可以用来渲染 e-mail ：
* `renderToStaticNodeStream`

更多服务端渲染 API 的更改，请查看工作组文章 [在服务端升级到 React 18](https://github.com/reactwg/react-18/discussions/22) ，[深入新的 Suspense SSR 架构](https://github.com/reactwg/react-18/discussions/37)，以及 [Shaundai Person](https://twitter.com/shaundai) 在 React Conf 2021 关于[用 Suspense 实现服务端流式渲染](https://www.youtube.com/watch?v=pj5N-Khihgc) 的演讲。

## 升级 TypeScript 定义

如果你的项目使用 TypeScript ，你需要升级 `@types/react` 和 `@types/react-dom` 依赖到最新版本。新的类型更安全，可以捕获以前易被类型检查器（type checker）忽略的问题。最值得一提的更改是定义 props 时，`children` 属性需要显式定义了，如：

```typescript{3}
interface MyButtonProps {
  color: string;
  children?: React.ReactNode;
}
```

查看 [React 18 typings pull request](https://github.com/DefinitelyTyped/DefinitelyTyped/pull/56210) 获得只含类型更改的完整清单。它链到库类型的修复例子，你就知道如何调整自己的代码。 你可以使用 [自动迁移脚本](https://github.com/eps1lon/types-react-codemod) 来加速帮你把应用代码迁移到更安全的新类型。

如果你发现了类型的 bug ，请在 DefinitelyTyped repo [提交一个 issue](https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/new?category=issues-with-a-types-package)。

## 自动化批处理 {#automatic-batching}

React 18 通过更多默认批处理提供了开箱即用的性能优化。批处理是指 React 把多个状态更新组合为一次重渲染从而获得更好性能。React 18 之前，我们仅把 React event handler 的更新做批处理。Promise、setTimeout、native event handler，或者其他事件中的更新，React 默认不进行批处理：

```js
// React 18 之前的版本，只有 React 事件进行批处理

function handleClick() {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React 只会在最后重渲染一次（这就是批处理！）
}

setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React 会渲染2次，每次 state 更新各1次 (没有批处理)
}, 1000);
```


在 React 18 通过 `createRoot` ，所有更新会自动批处理，无论更新的来源。这意味着 Promise、setTimeout、native event handler，或者其他事件中的更新，会和 React 事件一样做批处理：

```js
// React 18 之后，timeout、promise、
// native event handler，或者其他事件中的更新，会做批处理。

function handleClick() {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React 只会在最后重渲染一次（这就是批处理！）
}

setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React 只会在最后重渲染一次（这就是批处理！）
}, 1000);
```

这是一个破坏性更改，我们期望带来更少的渲染工作，从而给应用带来更好的性能。以用 `flushSync` 关闭自动批处理：

```js
import { flushSync } from 'react-dom';

function handleClick() {
  flushSync(() => {
    setCounter(c => c + 1);
  });
  // 现在 React 已更新 DOM
  flushSync(() => {
    setFlag(f => !f);
  });
  // 现在 React 已更新 DOM
}
```

阅读 [深入自动批处理](https://github.com/reactwg/react-18/discussions/21) 获取更多信息。

## 为库提供的新 API  {#new-apis-for-libraries}

React 18 工作组和库维护者合作，为他们的特定 use case ，例如样式和外部 store ，创建了支持并发渲染的新 API 。为了支持 React 18，有些库可能需要切换到以下 API 中的一个：

* `useSyncExternalStore` 是一个新的 hook ，通过强制把 store 的更新设置为同步，允许外部 store 支持并发读（concurrent reads）。推荐所有集成了 React 外部状态的库使用这个新 API 。 更多信息请阅读 [useSyncExternalStore overview post](https://github.com/reactwg/react-18/discussions/70) 和 [useSyncExternalStore API details](https://github.com/reactwg/react-18/discussions/86)。
* `useInsertionEffect` 是一个新的 hook ，允许 CSS-in-JS 库定位渲染时注入的样式的性能问题。除非你已构建了 CSS-in-JS 库，否则不要用这个 hook 。这个 hook 会在 DOM 可交互后运行，但是在布局 effect 读到新的布局前。这解决了 React 17 及以下版本已存在的一个问题，不过对于 React 18 更重要，因为 React 在并发渲染期间会把控制权交给浏览器，让浏览器有机会重新计算布局。阅读 [`<style>` 的库升级指南](https://github.com/reactwg/react-18/discussions/110) 获取更多信息。

React 18 还引入了 `startTransition`、`useDeferredValue` 和 `useId` 等并发渲染的新 API，在 [发布公告](/blog/2022/03/29/react-v18.html) 中我们有更详细介绍。

## 升级严格模式 {#updates-to-strict-mode}

未来我们会添加一个特性，允许 React 增加和删除 UI 部分（add and remove sections of the UI），同时保留状态。例如，用户切换标签走了再回来，React 应该能立即展示之前的屏幕。为了实现这点，React 需用之前的组件状态卸载和重挂载组件树。

这个特性给 React 带来了开箱即用的更佳性能，但是需要组件适应 effect 多次挂载和销毁。大部分 effect 不需要任何修改就能工作，有些则假设他们只会挂载和销毁一次。

为了让这些问题暴露，React 18 给严格模式引入了新的仅开发模式检查。这项新检查会自动对每个组件卸载和重挂载，第二次挂载的时候恢复之前的状态。

这次更改前，React 按如下方式挂载组件和创建 effect ：

```
* React 挂载组件。
    * Layout effect 创建。
    * Effect effect 创建。
```

React 18 开启严格模式后，在开发模式下 React 会模拟卸载和重挂载组件：

```
* React 挂载组件。
    * Layout effect 创建。
    * Effect effect 创建。
* React 模拟卸载组件。
    * Layout effect 销毁。
    * Effects 销毁。
* React 模拟用之前的状态挂载组件。
    * 运行 Layout effect 的 setup 代码
    * 运行 Effect 的 setup 代码
```

请阅读工作组关于 [在严格模式下添加可重用状态](https://github.com/reactwg/react-18/discussions/19) 和 [如何在 Effect 中支持可重用的状态](https://github.com/reactwg/react-18/discussions/18) 的文章获取更多信息。

## 配置你的测试环境 {#configuring-your-testing-environment}

当你第一次更新你的测试用例为使用 `createRoot` ，你可能在测试控制台看到这样的警告：

> The current testing environment is not configured to support act(...)

在运行测试前设置 `globalThis.IS_REACT_ACT_ENVIRONMENT` 为 `true` 可以修复这问题：

```js
// 你的测试 setup 文件
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
```

此标识的目的是告诉 React 运行在类似单元测试的环境下。如果你忘记用 `act` 包裹更新，React 会记录有用的警告。

你也可以把标识置为 `false` 告诉 React 不需要用 `act` 。 这对于模拟完整浏览器环境的 e2e 测试很有用。

最后，我们期望测试库帮你自动配置。例如 [下一版本的 React 测试库已内置对 React 18 的支持](https://github.com/testing-library/react-testing-library/issues/509#issuecomment-917989936) 不需要任何额外配置。

这里还有工作组[关于 `act` 测试 API 和相关更改的更多背景](https://github.com/reactwg/react-18/discussions/102)。

## 不再支持 Internet Explorer {#dropping-support-for-internet-explorer}

从这个版本起，React 放弃了对 IE 的支持，IE [从2022-06-15不再支持](https://blogs.windows.com/windowsexperience/2021/05/19/the-future-of-internet-explorer-on-windows-10-is-in-microsoft-edge)了。我们现在做出这个改变，是因为 React 18 引入的新特性是基于现代浏览器的新特性，比如微任务，而这些在 IE 不能很好的用 polyfill 支持。

如果你需要支持 IE ，我们建议你停留在 React 17 。

## 废弃（Deprecations） {#deprecations}

* `react-dom`: `ReactDOM.render` 已废弃。继续使用会发出警告，并且应用运行在 React 17 模式。
* `react-dom`: `ReactDOM.hydrate` 已废弃。继续使用会发出警告，并且应用运行在 React 17 模式。
* `react-dom`: `ReactDOM.unmountComponentAtNode` 已废弃。
* `react-dom`: `ReactDOM.renderSubtreeIntoContainer` 已废弃。
* `react-dom/server`: `ReactDOMServer.renderToNodeStream` 已废弃。

## 其他破坏性更改（Other Breaking Changes） {#other-breaking-changes}

* **一致的 useEffect 时序**: 如果更新是由独立的用户输入事件，如 click 或 keydown 事件，则 React 现在总是同步刷新 effect 函数。而以前行为并非总是可预测的和一致的。
* **更严格的 hydration 错误**: 由于缺失的或额外的文本内容现在被当做错误而非警告，因此 hydration 匹配不上了。React 不再尝试在客户端插入或删除节点对单独节点进行 "patch up" ，以匹配服务端的内容，而是回退到客户端，渲染组件树最近的 `<Suspense>` 边界。这样保证 hydrate 后树的一致性，避免潜在的由 hydration 不匹配导致的隐私和安全漏洞 。
* **Suspense 树总是一致的：** 如果一个组件在完全添加到组件树前挂起了，React 会以不完整状态将其添加到组件树，或者触发其副作用。React 会完全抛弃新的树，等待异步操作完成，然后尝试从头开始渲染。React 用并发渲染进行重试，并且不阻塞浏览器。
* **Layout Effects with Suspense**：当组件树重新挂起并回退到兜底时，React 会清理布局 effect ，然后当边界内的内容重新显示时，重新创建它们。这解决了一个问题，这个问题会阻止组件库在使用 Suspense 时正确测量布局。
* **新的 JS 环境要求**: React 现在依赖现代浏览器的特性，包括 `Promise`、`Symbol` 和 `Object.assign`。如果你支持老的浏览器和设备，例如 IE ，对现代浏览器特性缺乏原生支持或者有兼容性问题，可以考虑在应用 bundle 增加全局 polyfill 。

## 其他重要更改 {#other-notable-changes}

### React {#react}

* **组件现在可以渲染 `undefined`:** 如果组件返回 `undefined`，React 不再警告。这样组件的返回值与组件树中间允许的值保持一致。我们建议使用 linter 来避免在 JSX 之前忘记 `return` 语句的错误。
* **在测试中, `act` 警告是可选的:** 如果你在运行 e2e 测试，`act` 警告是不必要的。我们引入了一个 [opt-in](https://github.com/reactwg/react-18/discussions/102) 机制，这样你可以在单元测试时启用，对于单元测试是有用和有收益的。
* **未挂载组件 `setState` 不再有警告:** 以前, 当你在未挂载组件调用 `setState` 时，React 警告内存泄露。该警告是为了订阅添加的，然后人们遇到这种情况时，大部分时候都是正常情况，而解决方案让代码更糟糕。 我们已[删除](https://github.com/facebook/react/pull/22114)这个警告。
* **不抑制控制台日志：** 严格模式下, React 每个组件渲染2次，帮你发现意外的副作用。在 React 17 中我们抑制了其中一次渲染的控制台日志，让日志更易读。根据[社区反馈](https://github.com/facebook/react/issues/21783)，这个功能让人困惑，我们已删除了这个功能。现在如果你安装了 React DevTools，第二条日志显示成灰色的，同时提供一个选项（默认不开启）彻底抑制日志。 
* **改进的内存使用:** React现在会在卸载时清理更多内部字段，让你的应用中可能存在的未修复内存泄露的影响更轻。

### React DOM Server {#react-dom-server}

* **`renderToString`:** 服务端挂起时不再返回错误。而是返回最近的 `<Suspense>` 边界的兜底 HTML ，然后在客户端重试渲染这个内容。依然推荐切换到 `renderToPipeableStream` 或 `renderToReadableStream` 等流式 API 。
* **`renderToStaticMarkup`:** 服务端挂起时不再返回错误。 而是返回最近的 `<Suspense>` 边界的兜底 HTML。

## Changelog {#changelog}

你可以在这里查看 [完整 changelog](https://github.com/facebook/react/blob/main/CHANGELOG.md)。
