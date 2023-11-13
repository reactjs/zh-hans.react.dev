---
title: "如何升级到 React 18"
---

2022 年 8 月 3 日 [Rick Hanlon](https://twitter.com/rickhanlonii)

---

<Intro>

正如我们在 [发布报告](/blog/2022/03/29/react-v18) 中分享的那样，React 18 借助新的并发渲染引入了许多新特性，对于已经存在的应用可以采用渐进式策略。在这篇文章中，我们会指导你如何逐步升级到 React 18。

如果你在升级的过程中遇到任何问题，可以在 GitHub [提 issue](https://github.com/facebook/react/issues/new/choose)。

</Intro>

<Note>

对于 React Native 用户来说， React 18 会在 React Native 的未来版本中出现。因为 React 18 依赖于新的 React Native 架构才能受益于这篇文章中提出的新的能力。想了解更多信息，请查看 [这里的 React 会议纪要](https://www.youtube.com/watch?v=FZ0cG47msEk&t=1530s)。

</Note>

---

## 安装 {/*installing*/}

安装最新版的 React：

```bash
npm install react react-dom
```

或者也可以使用 yarn：

```bash
yarn add react react-dom
```

## 客户端渲染 API 的更新 {/*updates-to-client-rendering-apis*/}

当你第一次安装 React 18 的时候，控制台会出现如下警告：

<ConsoleBlock level="error">

ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot

</ConsoleBlock>

React 18 引入了一个新的 root API，它提供了更好的操作根节点的方式。新的 root API 还启用了新的并发渲染器，使开发者能够选择使用并发特性。

```js
// 之前
import { render } from 'react-dom';
const container = document.getElementById('app');
render(<App tab="home" />, container);

// 现在
import { createRoot } from 'react-dom/client';
const container = document.getElementById('app');
const root = createRoot(container); // 如果你使用 TypeScript，请使用 createRoot(container!)
root.render(<App tab="home" />);
```

我们也已经将 `unmountComponentAtNode` 修改为 `root.unmount`：

```js
// 之前
unmountComponentAtNode(container);

// 现在
root.unmount();
```

我们从 render 中移除了回调函数，因为当使用 Suspense 的时候通常不是预期的结果：

```js
// 之前
const container = document.getElementById('app');
render(<App tab="home" />, container, () => {
  console.log('rendered');
});

// 现在
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

<Note>

对于旧的 render 回调函数 API 没有一对一的替换——它取决于你的用例。查看工作组的 [使用 createRoot 替换 render](https://github.com/reactwg/react-18/discussions/5) 博文了解更多信息。

</Note>

最后如果应用通过 hydrate 使用了服务端渲染，你需要将 `hydrate` 升级到 `hydrateRoot`：

```js
// 之前
import { hydrate } from 'react-dom';
const container = document.getElementById('app');
hydrate(<App tab="home" />, container);

// 现在
import { hydrateRoot } from 'react-dom/client';
const container = document.getElementById('app');
const root = hydrateRoot(container, <App tab="home" />);
// 和 createRoot 不一样，在这里你不需要单独的 root.render()。
```

了解更多信息，请查看 [工作组的讨论](https://github.com/reactwg/react-18/discussions/5)。

<Note>

**如果你的应用升级后无法工作，请检查它是否被 `<StrictMode>` 包裹**。[严格模式在 React 18 中变得更加严格](#updates-to-strict-mode)，并不是所有组件都可以弹性应对它在开发模式中添加的新检查。如果移除严格模式可以修复你的应用，你可以在升级期间移除它，然后等你修复它指出的问题之后再在树的顶部或者其中一部分添加回来。

</Note>

## 服务端渲染 API 的更新 {/*updates-to-server-rendering-apis*/}

在这次发布中，我们修改 `react-dom/server` API 使它完全支持服务端的 Suspense 和 流式 SSR。作为这些变化的一部分，我们正在废弃旧的 Node 流式 API，因为它不支持服务端的增量 Suspense 流。

现在使用这个 API 会发出警告：

* `renderToNodeStream`：**废弃 ⛔️️**

取而代之的是，对于 Node 环境中的流我们使用：
* `renderToPipeableStream`：**新增 ✨**

同时也引入了新的 API 借助 Suspense 为像 Deno 和 Cloudflare workers 这样的现代分布式运行时环境来支持流式 SSR：
* `renderToReadableStream`：**新增 ✨**

下面的 API 会继续工作，但是对于 Suspense 支持是有限的：
* `renderToString`：**有限制** ⚠️
* `renderToStaticMarkup`：**有限制** ⚠️

最后这个 API 会继续用于渲染电子邮件：
* `renderToStaticNodeStream`

更多关于服务端渲染 API 的变化信息，可以查看工作组文章 [在服务端升级到 React 18](https://github.com/reactwg/react-18/discussions/22)，[深入探讨新的 Suspense SSR 架构](https://github.com/reactwg/react-18/discussions/37)，以及 [Shaundai 个人](https://twitter.com/shaundai) 在 React 2021 会议上关于 [使用 Suspense 的流式服务端渲染](https://www.youtube.com/watch?v=pj5N-Khihgc) 的演讲。

## 更新 TypeScript 类型定义 {/*updates-to-typescript-definitions*/}

如果项目使用了 TypeScript，你需要更新 `@types/react` 和 `@types/react-dom` 依赖到最新版。新的类型更加安全并且能捕获过去常常被类型检查器忽略的问题。最值得注意的变化是，现在定义 props 时，`children` prop 需要被明确列出来，例如：

```typescript{3}
interface MyButtonProps {
  color: string;
  children?: React.ReactNode;
}
```

查看 [React 18 类型 PR](https://github.com/DefinitelyTyped/DefinitelyTyped/pull/56210) 查看只有类型变了的完整清单。它链接到了在类型库中修复的例子，你可以从中了解如何调整你自己的代码。你可以使用 [自动迁移脚本](https://github.com/eps1lon/types-react-codemod) 来帮助你的应用代码更快变更到更安全的新类型。

如果你发现了类型中的问题，请在 DefinitelyTyped 仓库 [提交 issue](https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/new?category=issues-with-a-types-package)。

## 自动批处理 {/*automatic-batching*/}

React 18 通过默认做更多批量处理来增加开箱即用性能提升。批量处理指的是 React 为了提高性能将多个 state 更新分组到一个单独的重渲染。React 18 之前，我们只在 React 事件处理函数内部实现批量更新，而 promise、setTimeout、本地事件处理函数或者其他事件中更新状态，在 React 中默认是不进行批量处理的：

```js
// React 18 之前，只有 React 事件会被批量处理

function handleClick() {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React 只会在结束的时候重新渲染一次（这就是批量处理！）
}

setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React 会渲染两次，每一个 state 更新的时候渲染一次（非批量处理）
}, 1000);
```


从使用 `createRoot` 的 React 18 开始，无论来自于哪里，所有的更新都会自动批量处理。这意味着 timeout、promise、本地事件处理函数或者其他任何事件的更新都会和 React 事件内部的更新一样批量处理：

```js
// React 18 中 timeout、promise、
// 本地事件处理函数或者其他任何事件的更新都会批量处理。

function handleClick() {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React 只会在结束的时候重新渲染一次（这就是批量处理！）
}

setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React 只会在结束的时候重新渲染一次（这就是批量处理！）
}, 1000);
```

这是一个破坏性变更，但是我们期望这个变更可以产生更少的渲染工作，从而提高应用的性能表现。为了有选择性地使用自动化处理，你可以使用 `flushSync` 包裹：

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

更多信息请查看 [深入探索自动批处理](https://github.com/reactwg/react-18/discussions/21)。

## 新 API {/*new-apis-for-libraries*/}

在 React 18 工作组，我们和第三方库的维护者合作，创建需要支持 styles 和外部存储中的特定用例的并发渲染的新 API。为了支持 React 18，一些第三方库可能需要切换到下面的 API 之一：

* `useSyncExternalStore` 是一个新增 Hook，它允许外部存储通过对 store 的强制更新保持同步从而支持并发读取。这个新 API 推荐用于任何和 React 的外部状态集成的库。了解更多信息请查看 [useSyncExternalStore 概览](https://github.com/reactwg/react-18/discussions/70) 和 [useSyncExternalStore API 细节](https://github.com/reactwg/react-18/discussions/86)。
* `useInsertionEffect` 是一个新增 Hook，它可以让 CSS-in-JS 库解决渲染中注入样式的性能问题。我们希望只有在你已经构建了一个 CSS-in-JS 库的情况下才使用它。这个 Hook 会在 DOM 变化之后，layout effect 读取新的布局之前运行。这解决了 React 17 及其以下就已经存在但是在 React 18 更重要的问题，因为在并发渲染期间 React 会阻止浏览器，给了它一个重新计算布局的机会。了解更多信息，查看 [`<style>` 库升级指南](https://github.com/reactwg/react-18/discussions/110)。

React 18 也引入了一些并发渲染的新 API，例如 `startTransition`、`useDeferredValue` 以及 `useId`，关于此更多信息我们在 [发布报告](/blog/2022/03/29/react-v18) 中有所分享。

## 严格模式的变化 {/*updates-to-strict-mode*/}

在未来，我们想要添加一个特性，它允许 React 在保存 state 的时候添加和移除 UI 块。例如，当用户离开当前 tab 页面又返回时，React 应该能够立刻展示之前的页面。为了达到这个目的，React 会使用和之前一样的组件状态来卸载和重新加载树。

这个特性会让 React 拥有更好的开箱即用性能，但是它需要组件能够灵活应对多次加载和销毁的 effect。大部分 effect 工作方式没有任何变化，但是一些 effect 希望它们只加载或者销毁一次。

为了帮助让这些问题浮出水面，React 18 向严格模式中引入了一个只在开发环境进行的新检查。每当组件第一次加载时，新的检查会自动卸载和重新加载每一个组件，并在第二次加载的时候存储之前的状态。

在这些变化之前，React 会加载组件和创建 effect：

```
* React 加载组件。
    * 创建 Layout effect。
    * 创建 Effect effect。
```

在 React 18 的严格模式中，React 会在开发模式下模仿卸载和重新加载组件：

```
* React 加载组件。
    * 创建 Layout effect。
    * 创建 Effect effect。
* React 模仿卸载组件。
    * 销毁 Layout effect。
    * 销毁 Effect effect。
* React 模仿加载有上一个状态的组件。
    * 运行 Layout effect setup 代码
    * 运行 Effect effect setup 代码
```

了解更多信息，可以查看工作组的文章：[向严格模式添加可复用的状态](https://github.com/reactwg/react-18/discussions/19) 和 [如何支持 Effect 中的可复用状态](https://github.com/reactwg/react-18/discussions/18)。

## 配置测试环境 {/*configuring-your-testing-environment*/}

第一次更新测试环境使用 `createRoot`，你可能在测试环境的控制台看到这个警告：

<ConsoleBlock level="error">

The current testing environment is not configured to support act(...)

</ConsoleBlock>

为了修复这个问题，需要在运行测试之前将 `globalThis.IS_REACT_ACT_ENVIRONMENT` 设置为 `true`：

```js
// 测试配置文件中
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
```

这个配置项的目的是告诉 React 它正运行于一个类似单元测试的环境中。如果你忘记用 `act` 包裹一个更新的话，React 会记录有帮助的告警信息。

你也可以将其设置为 `false` 告诉 React 不需要 `act`。这对于要模拟完整浏览器环境的端到端测试非常有用。

最终我们希望测试库会自动为你配置这些。例如，[下一个版本的 React Testing Library 对于 React 18 提供了内置支持](https://github.com/testing-library/react-testing-library/issues/509#issuecomment-917989936) 而不需要额外的配置。

[更多关于 `act` 测试 API 的背景资料和相关的修改](https://github.com/reactwg/react-18/discussions/102) 可在工作组获取。

## 放弃对 Internet Explorer 的支持 {/*dropping-support-for-internet-explorer*/}

在本次发布中，React 正在放弃对 Internet Explorer 的支持，[最终会在 2022 年 6 月 15 日完全放弃](https://blogs.windows.com/windowsexperience/2021/05/19/the-future-of-internet-explorer-on-windows-10-is-in-microsoft-edge)。我们现在正在做这一变更，因为 React 18 中引入的新特性是使用现代浏览器特性构建的，例如在 IE 中不能 polyfill 的微任务。

如果你需要支持 Internet Explorer，我们推荐你保持在 React 17。

## 废弃 {/*deprecations*/}

* `react-dom`：`ReactDOM.render` 已经被废弃。使用它会发出警告并且让应用运行在 React 17 模式下。
* `react-dom`：`ReactDOM.hydrate` 已经被废弃。使用它会发出警告并且让应用运行在 React 17 模式下。
* `react-dom`：`ReactDOM.unmountComponentAtNode` 已经被废弃。
* `react-dom`：`ReactDOM.renderSubtreeIntoContainer` 已经被废弃。
* `react-dom/server`：`ReactDOMServer.renderToNodeStream` 已经被废弃。

## 其他破坏性变更 {/*other-breaking-changes*/}

* **一致的 useEffect 时间**：现在，如果更新是在类似点击或者敲击键盘事件这样的离散用户输入事件期间触发，React 总是同步刷新 effect 函数。而之前的行为不是一直可预测或者一致的。
* **更严格的 hydrate 报错**：由于缺失或者额外的文本而导致的 hydrate 不匹配现在会作为错误而不是告警对待。React 将不再试图通过在客户端增加或删除节点来“修补”单个节点来匹配服务端标记，并且将会回退客户端渲染到树中最近的 `<Suspense>` 边界。这可以保证 hydrate 树保持一致并且避免可能由 hydrate 不匹配导致的隐私和安全漏洞。
* **Suspense 树一直保持一致**：如果一个组件在它完全被添加到树上之前挂起，React 将不会把它以不完整的状态添加到树或者触发它的 effect。React 会完全扔掉新树，等待异步操作结束，然后重新尝试从头开始再次渲染。React 会同时渲染重试尝试，并且不会阻塞浏览器。
* **使用 Suspense 的 Layout Effect**：当一个树重新挂起并恢复为后备方案时，现在的 React 会清理 layout effect，然后在边界内的内容再次显示时重新创建它们。这修复了一个在与 Suspense 一起使用时的问题：阻止组件库正确测量布局。
* **新的 JavaScript 环境要求**：React 现在依赖于现代浏览器特性，包括 `Promise`、`Symbol` 和 `Object.assign`。如果你需要支持像 Internet Explorer 这样较老版本的浏览器和设备，它们本身不提供现代浏览器特性或者有不兼容的实现，可以考虑在打包后的应用中包含全局的 polyfill。

## 其他值得注意的变化 {/*other-notable-changes*/}

### React {/*react*/}

* **组件现在可以渲染 `undefined`**：如果你从组件返回 `undefined`，React 不会再发出告警。这使得允许的组件返回值与组件树中间允许的值能够保持一致。我们建议使用代码检查工具来防止像忘记在 JSX 前面的 `return` 语句这样的错误。
* **在测试中，`act` 告警现在是可选的**：如果你正在运行端对端的测试，`act` 告警是非必要的。我们已经引入了一个 [可选](https://github.com/reactwg/react-18/discussions/102) 机制，这样你就可以只在有用且有益的单元测试开启它们。
* **未加载的组件取消了关于 `setState` 的告警**：之前每当你在未加载的组件中调用 `setState`，React 就会发出内存泄漏告警。这个告警是为订阅添加的，但是人们经常在设置状态完好遇见它并且解决方法会让代码变得更加糟糕。所以我们已经 [移除](https://github.com/facebook/react/pull/22114) 了这个告警。
* **不抑制控制台打印**：当你使用 Strict Mode 时，React 会将每个组件渲染两次来帮助你找到不符合预期的副作用。在 React 17 中，我们已经抑制了两次渲染之一的控制台打印让其更容易阅读。为了响应关于这会令人难以理解的 [社区反馈](https://github.com/facebook/react/issues/21783)，我们移除了这个抑制。取而代之的是，如果你安装了 React DevTool，第二次记录的渲染将会以灰色的文字展示并且会有一个选项（默认关闭）来抑制它们。
* **改进了内存使用**：React 现在在卸载的时候会清理更多内部区域，这使得可能存在于应用代码中的未修复内存泄露的影响不那么严重。

### React DOM Server {/*react-dom-server*/}

* **`renderToString`**：当在服务端挂起时，它不再会报错。而是会为最接近的 `<Suspense>` 边界发射后备 HTML，然后在客户端尝试渲染同样的内容。我们仍然推荐你切换到像 `renderToPipeableStream` 或者 `renderToReadableStream` 这样的流式 API。
* **`renderToStaticMarkup`**：当在服务端挂起时，它不再会报错。而是会为最接近的 `<Suspense>` 边界发射后备 HTML。

## 更新日志 {/*changelog*/}

你可以在这里查看 [完整更新日志](https://github.com/facebook/react/blob/main/CHANGELOG.md)。
