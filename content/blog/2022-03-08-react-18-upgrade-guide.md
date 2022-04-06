---
title: "如何升级到 React 18"
author: [rickhanlonii]
---

正如我们在 [发行说明](/blog/2022/03/29/react-v18.html) 中所分享的那样，React 18 引入了由我们开发的新的并发渲染器，对现有的应用程序采取逐步采用的策略。在这篇文章中，我们将指导你完成升级到 React 18 的步骤。

请 [报告你在升级到 React 18 时遇到的任何问题](https://github.com/facebook/react/issues/new/choose)。

*React Native 用户注意：React 18 将在 React Native 的未来版本中搭载。这是因为 React 18 依赖于新的 React Native 架构，以受益于本博文中提出的新功能。更多信息，请参阅 [React Conf keynote here](https://www.youtube.com/watch?v=FZ0cG47msEk&t=1530s)。*

## 安装 {#installing}

安装最新版本的 React：

```bash
npm install react react-dom
```

如果你用的是 yarn：

```bash
yarn add react react-dom
```

## 对客户端渲染 API 的更新 {#updates-to-client-rendering-apis}

当你第一次安装 React 18 时，你会在控制台看到一个警告：

> ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot  
> 翻译：ReactDOM.render 在 React 18 中不再被支持。使用 createRoot 代替。在你切换到新的 API 之前，你的应用程序将表现得像运行 React 17 一样。了解更多：https://reactjs.org/link/switch-to-createroot

React 18 引入了一个新的 root API，为管理根元素提供了更好的机制。新的 root API 还启用了新的并发渲染器，它允许你选择进入并发功能。

```js
// 之前
import { render } from 'react-dom';
const container = document.getElementById('app');
render(<App tab="home" />, container);

// 之后
import { createRoot } from 'react-dom/client';
const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App tab="home" />);

```

我们还将 `unmountComponentAtNode` 改为 `root.unmount`：

```js
// 之前
unmountComponentAtNode(container);

// 之后
root.unmount();
```

我们还删除了 render 中的回调，因为在使用 Suspense 时，它通常不会有预期的结果：

```js
// 之前
const container = document.getElementById('app');
ReactDOM.render(<App tab="home" />, container, () => {
  console.log('rendered');
});

// 之后
function AppWithCallbackAfterRender() {
  useEffect(() => {
    console.log('rendered');
  });

return <App tab="home" />
}

const container = document.getElementById('app');
const root = ReactDOM.createRoot(container);
root.render(<AppWithCallbackAfterRender />);
```

> 注意：旧的渲染回调 API 没有一对一的替换——这取决于你的用例。更多信息请参见工作组发布的 [用 createRoot 代替 render](https://github.com/reactwg/react-18/discussions/5)。

最后，如果你的应用程序使用服务器端渲染注水，请将 `hydrate` 升级为 `hydrateRoot`：

```js
// 之前
import { hydrate } from 'react-dom';
const container = document.getElementById('app');
hydrate(<App tab="home" />, container);

// 之后
import { hydrateRoot } from 'react-dom/client';
const container = document.getElementById('app');
const root = hydrateRoot(container, <App tab="home" />);
// 与 createRoot 不同，你不需要在这里单独调用 root.render()。
```

欲了解更多信息，请参见 [工作组讨论](https://github.com/reactwg/react-18/discussions/5)。

## 对服务器渲染 API 的更新 {#updates-to-server-rendering-apis}

在这个版本中，我们正在修改 `react-dom/server` 的 API，以完全支持服务器上的 Suspense 和流式 SSR。作为这些变化的一部分，我们正在废除旧的 Node 流媒体 API，它不支持服务器上的增量 Suspense 流。

使用这些 API 现在会发出警告：

* `renderToNodeStream`: **废弃的 ⛔️️**

相反，对于 Node 环境下的流媒体，使用：
* `renderToPipeableStream`: **新的 ✨**

我们还推出了一个新的 API，以支持边缘侧运行环境（如 Deno 和 Cloudflare 工作者）的流式 SSR 与 Suspense：
* `renderToReadableStream`: **新的 ✨**

以下 API 将继续工作，但对 Suspense 的支持有限：
* `renderToString`: **有限的** ⚠️
* `renderToStaticMarkup`: **有限的** ⚠️

最后，这个 API 将继续适用于渲染电子邮件：
* `renderToStaticNodeStream`

关于服务器渲染 API 变化的更多信息，请参见工作组关于 [在服务器上升级到 React 18](https://github.com/reactwg/react-18/discussions/22) 的帖子，[深入了解新的 Suspense SSR 架构](https://github.com/reactwg/react-18/discussions/37)，以及 [Shaundai Person's](https://twitter.com/shaundai) 在 2021 年 React Conf 上关于 [用 Suspense 进行流式服务器渲染](https://www.youtube.com/watch?v=pj5N-Khihgc) 的演讲。

## 自动批处理 {#automatic-batching}

React 18 通过默认做更多的批处理来增加开箱即用的性能改进。批处理是指 React 将多个状态更新分组到一个重新渲染中，以获得更好的性能。在 React 18 之前，我们只对 React 事件处理程序中的更新进行分批。默认情况下，React 不会对承诺、setTimeout、本地事件处理程序或任何其他事件中的更新进行批处理：

```js
// 在 React 18 之前，只有 React 事件是分批进行的。

function handleClick() {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React 只会在最后重新渲染一次（这就是批处理！）。
}

setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React 会渲染两次，每次状态更新一次（没有批处理）。
}, 1000);
```


从 React 18 的 `createRoot` 开始，所有的更新将被自动批处理，无论它们来自哪里。这意味着，超时、承诺、本地事件处理程序或任何其他事件中的更新将以与 React 事件中的更新相同的方式进行批处理。

```js
// 在 React 18 的超时、承诺、本地事件处理程序或任何其他事件内的更新被分批处理。

function handleClick() {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React 只会在最后重新渲染一次（这就是批处理！）。
}

setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React 只会在最后重新渲染一次（这就是批处理！）。
}, 1000);
```

这是一个突破性的变化，但我们希望这将导致更少的工作渲染，从而提高你的应用程序的性能。要选择退出自动批处理，你可以使用 `flushSync`：

```js
import { flushSync } from 'react-dom';

function handleClick() {
  flushSync(() => {
    setCounter(c => c + 1);
  });
  // React 现在已经更新了 DOM
  flushSync(() => {
    setFlag(f => !f);
  });
  // React 现在已经更新了 DOM
}
```

欲了解更多信息，请参见 [自动批处理的深入研究](https://github.com/reactwg/react-18/discussions/21)。

## 库的新 API {#new-apis-for-libraries}

在 React 18 工作组中，我们与库维护者合作，创建了新的 API，以支持在样式、外部存储等领域的特定用例的并发渲染。为了支持 React 18，一些库可能需要切换到以下 API 之一：

* `useSyncExternalStore` 是一个新的 hook，它允许外部存储支持并发读取，强制更新存储是同步的。这个新的 API 被推荐给任何与 React 外部状态集成的库。更多信息，请参阅 [useSyncExternalStore 概述帖子](https://github.com/reactwg/react-18/discussions/70) 和 [useSyncExternalStore API 详情](https://github.com/reactwg/react-18/discussions/86)。
* `useInsertionEffect` 是一个新的 hook，能够解决 CSS-in-JS 库在渲染中注入样式的性能问题。除非你已经建立了一个 CSS-in-JS 库，否则我们希望你使用这个新的 API。这个 hook 将在 DOM 被改变后运行，但在布局生效前就已经读取新的布局。这解决了一个在 React 17 及以下版本中已经存在的问题，但在 React 18 中更加重要，因为 React 在并发渲染期间让位于浏览器，使其有机会重新计算布局。更多信息，请参阅 [Library Upgrade Guide for `<style>`](https://github.com/reactwg/react-18/discussions/110)。

React 18 还引入了其它用于并发渲染的新 API，如 `startTransition`、`useDeferredValue` 和 `useId`，我们在 [发行说明](/blog/2022/03/29/react-v18.html) 中分享了更多信息。

## 对严格模式的更新 {#updates-to-strict-mode}

在未来，我们希望增加一个功能，允许 React 在保留状态的同时增加和删除 UI 的部分。例如，当用户从一个屏幕切换到另一个屏幕时，React 应该能够立即显示之前的屏幕。要做到这一点，React 将使用与之前相同的组件状态来卸载和重新装载树。

这个功能会让 React 在开箱后有更好的性能，但需要组件对效果被多次加载和销毁具有弹性。大多数效果将在没有任何改变的情况下工作，但有些效果假定它们只被加载或销毁一次。

为了帮助解决这些问题，React 18 为严格模式引入了一个新的开发专用检查。这个新的检查将自动卸载并重新挂载每一个组件，无论一个组件首次挂载时是什么样的，在第二次挂载时必须恢复卸载之前的状态。

在这一变化之前，React 只会装载组件并创建效果：

```
* React mounts the component.
    * Layout effects are created.
    * Effect effects are created.
```

在 React 18 的严格模式下，React 会在开发模式下模拟卸载和重新挂载组件：

```
* React mounts the component.
    * Layout effects are created.
    * Effect effects are created.
* React simulates unmounting the component.
    * Layout effects are destroyed.
    * Effects are destroyed.
* React simulates mounting the component with the previous state.
    * Layout effect setup code runs
    * Effect setup code runs
```

更多信息，请参见工作组的帖子：[Adding Reusable State to StrictMode](https://github.com/reactwg/react-18/discussions/19) 和 [How to support Reusable State in Effects](https://github.com/reactwg/react-18/discussions/18)。

## 配置你的测试环境 {#configuring-your-testing-environment}

当你第一次更新你的测试以使用 `createRoot` 时，你可能会在测试控制台看到这个警告：

> The current testing environment is not configured to support act(...)  
> 翻译：目前的测试环境没有被配置为支持行为(...)

为了解决这个问题，在运行测试之前，将 `globalThis.IS_REACT_ACT_ENVIRONMENT` 设置为 `true`：

```js
// 在你的测试设置文件中
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
```

这个标志的目的是告诉 React 它正在一个类似单元测试的环境中运行。如果你忘了用 `act` 包裹更新，React 会记录有用的警告。

你也可以把这个标志设置为 `false`，告诉 React 不需要 `act`。这对模拟完整浏览器环境的端到端测试很有用。

最终，我们希望测试库能自动为你配置。例如，[React 测试库的下一个版本内置了对 React 18 的支持](https://github.com/testing-library/react-testing-library/issues/509#issuecomment-917989936)，无需任何额外配置。

[更多关于 `act` 测试 API 和相关变化的背景](https://github.com/reactwg/react-18/discussions/102) 可在工作组中找到。

## 放弃对 Internet Explorer 的支持 {#dropping-support-for-internet-explorer}

在这个版本中，React 放弃了对 Internet Explorer 的支持，它将 [于 2022 年 6 月 15 日停止支持](https://blogs.windows.com/windowsexperience/2021/05/19/the-future-of-internet-explorer-on-windows-10-is-in-microsoft-edge)。我们现在做出这样的改变是因为 React 18 中引入的新功能是使用现代浏览器功能构建的，比如微任务，这些功能在 IE 中不能被充分地使用。

如果你需要支持 Internet Explorer，我们建议你继续使用 React 17。

## 弃用 {#deprecations}

* `react-dom`：`ReactDOM.render` 已被弃用。使用它将警告并在 React 17 模式下运行你的应用程序。
* `react-dom`：`ReactDOM.hydrate` 已被弃用。使用它将警告并在 React 17 模式下运行你的应用程序。
* `react-dom`：`ReactDOM.unmountComponentAtNode` 已被弃用。
* `react-dom`：`ReactDOM.renderSubtreeIntoContainer` 已经被弃用。
* `react-dom/server`：`ReactDOMServer.renderToNodeStream` 已被弃用。

## 其他突破性变化 {#other-breaking-changes}

* **一致的 useEffect 时机**：如果更新是在离散的用户输入事件中触发的，如点击或按键事件，React 现在总是同步地刷新效果函数。以前，这种行为并不总是可预测的或一致的。
* **更严格的注水错误**：由于缺失或额外的文本内容导致的注水不匹配现在被视为错误而不是警告。React 将不再试图通过在客户端插入或删除一个节点来“修补”单个节点，以试图匹配服务器标记，并将恢复到客户端渲染，直到树中最近的 `<Suspense>` 边界。这确保了注水树的一致性，避免了注水不匹配可能造成的潜在隐私和安全漏洞。
* **Suspense 树总是一致的：**如果一个组件在完全添加到树上之前就暂停了，React 不会在不完整的状态下将其添加到树上或启动其效果。相反，React 会完全扔掉新的树，等待异步操作完成，然后再从头重新尝试渲染。React 会并发地重新渲染，而且不会阻塞浏览器。
* **带有 Suspense 的布局效果**：当一棵树 re-suspends 并恢复到回退状态时，React 现在会清理布局效果，然后在边界内的内容再次显示时重新创建它们。这修复了一个问题，即当与 Suspense 一起使用时，组件库无法正确测量布局。
* **新的 JS 环境要求**：React 现在依赖于现代浏览器的功能，包括 `Promise`、`Symbol` 和 `Object.assign`。如果你支持旧的浏览器和设备，如 Internet Explorer，它们不提供现代浏览器的原生功能，或有不符合要求的实现，考虑在你的捆绑应用中包括一个全局的 polyfill。

## 其他值得注意的变化 {#other-notable-changes}

### React {#react}

* **组件现在可以呈现 `undefined`：**如果你从一个组件返回 `undefined`，React 不再警告。这使得允许的组件返回值与组件树中间允许的值一致。我们建议使用 linter 来防止错误，比如在 JSX 之前忘记了 `return` 语句。
* **在测试中，`act` 警告现在是可选的：**如果你正在运行端到端的测试，`act` 警告是不必要的。我们引入了一个 [opt-in](https://github.com/reactwg/react-18/discussions/102) 机制，所以你可以只在单元测试中启用它们，因为它们是有用和有益的。
* **对未挂载的组件上的 `setState` 没有警告：**以前，当你在未挂载的组件上调用 `setState` 时，React 会警告内存泄漏。这个警告是为订阅而添加的，但人们主要是在设置状态没有问题的情况下遇到这个问题，而变通方法使代码变得更糟。我们已经 [移除](https://github.com/facebook/react/pull/22114) 这个警告。
* **不压制控制台日志：**当你使用严格模式时，React 会对每个组件渲染两次，以帮助你发现意外的副作用。在 React 17 中，我们已经抑制了两次渲染中的一次的控制台日志，以使日志更容易阅读。为了回应 [社区反馈](https://github.com/facebook/react/issues/21783) 关于这一点的困惑，我们已经取消了抑制的做法。相反，如果你安装了 React DevTools，第二个日志的渲染将以灰色显示，并且有一个选项（默认为关闭）可以完全抑制它们。
* **改进了内存使用：** React 现在在卸载时清理了更多的内部字段，使你的应用程序代码中可能存在的未修复的内存泄漏的影响不那么严重。

### React DOM Server {#react-dom-server}

* **`renderToString`：**在服务器上暂停时将不再出错。相反，它将为最接近的 `<Suspense>` 边界发出回退的 HTML，然后在客户端重试渲染相同的内容。我们仍然建议你改用流媒体 API，如 `renderToPipeableStream` 或 `renderToReadableStream` 来代替。
* **`renderToStaticMarkup`：**在服务器上暂停时将不再出错。相反，它将为最接近的 `<Suspense>` 边界发出后备 HTML，并在客户端重试渲染。

## 更新日志 {#changelog}

你可以查看 [完整更新日志](https://github.com/facebook/react/blob/main/CHANGELOG.md)。
