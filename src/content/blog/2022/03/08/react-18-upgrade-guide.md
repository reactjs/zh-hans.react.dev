---
title: "如何升级到 React 18"
---

2022 年 8 月 3 日 [Rick Hanlon](https://twitter.com/rickhanlonii)

---

<Intro>

正如我们在 [发布报告](/blog/2022/03/29/react-v18) 中分享的那样，React 18 借助新的并发渲染引入了许多新特性，对于已经存在的应用可以采用渐进式策略。在这篇文章中，我们会指导你如何逐步升级到 React 18。

如果你在升级的过程中遇到任何问题，可以在 github [提 issue](https://github.com/facebook/react/issues/new/choose)。

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

当你第一次安装 React 18 的时候，控制台会出现如下告警：

<ConsoleBlock level="error">

React 18 不再支持 ReactDOM.render，而是使用 createRoot 代替。在切换到新的 API 之前，你的应用将会和在 React 17 上一样运行。了解更多：https://reactjs.org/link/switch-to-createroot

</ConsoleBlock>

React 18 引入了一个新的 root API,这个 API 为管理根节点提供了更符合人类工程学。新的 root API 也可以启用新增的并发渲染，这让你可以选择并发特性。

```js
// 之前
import { render } from 'react-dom';
const container = document.getElementById('app');
render(<App tab="home" />, container);

// 现在
import { createRoot } from 'react-dom/client';
const container = document.getElementById('app');
const root = createRoot(container); // 如果你使用 TypeScript, createRoot(container!)
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

对于旧的 render 回调函数 API 没有一对一的替换 — 它取决于你的用例。查看工作组的 [使用 createRoot 替换 render](https://github.com/reactwg/react-18/discussions/5) 博文了解更多信息。

</Note>

最后如果应用通过 hydration 使用了服务端渲染，你需要将 `hydrate` 升级到 `hydrateRoot`：

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

**如果你的应用升级后无法工作，请检查它是否被 `<StrictMode>` 包裹**。[严格模式在 React 18 中变的更加严格](#updates-to-strict-mode)，并且不是所有组件都可以弹性应对它在开发模式中添加的新检查。如果移除 Strict Mode 可以修复你的应用，你可以在升级期间移除它，然后等你修复它指出的问题之后再添加回来（可以在树的顶部或者其中一部分）。

</Note>

## 服务端渲染 API 的更新 {/*updates-to-server-rendering-apis*/}

在这次发布中，我们修改 `react-dom/server` API 使它完全支持服务端的 Suspense 和 流式 SSR。作为这些变化的一部分，我们正在废弃旧的 Node 流式 API，因为它不支持服务端的增量 Suspense 流。

现在使用这个 API 会发出告警：

* `renderToNodeStream`: **废弃 ⛔️️**

取而代之的是，对于 Node 环境中的流我们使用：
* `renderToPipeableStream`: **新增 ✨**

同时也引入了新的 API 借助 Suspense 为像 Deno 和 Cloudflare workers 这样的现代分布式运行时环境来支持流式 SSR：
* `renderToReadableStream`: **新增 ✨**

下面的 API 会继续工作，但是对于 Suspense 支持是有限的：
* `renderToString`: **有限制** ⚠️
* `renderToStaticMarkup`: **有限制** ⚠️

最后这个 API 会继续用于渲染电子邮件：
* `renderToStaticNodeStream`

更多关于服务端渲染 API 的变化信息，可以查看工作组文章 [在服务端升级到 React 18](https://github.com/reactwg/react-18/discussions/22)，[深入探讨新的 Suspense SSR 架构](https://github.com/reactwg/react-18/discussions/37)，以及 [Shaundai 个人](https://twitter.com/shaundai) 在 React 2021 会议上关于[使用 Suspense 的流式服务端渲染](https://www.youtube.com/watch?v=pj5N-Khihgc) 的演讲。

## TypeScript 定义的更新 {/*updates-to-typescript-definitions*/}

如果项目使用了 TypeScript，你需要更新 `@types/react` 和 `@types/react-dom` 依赖到最新版。新的类型更加安全并且能捕获过去常常被类型检查器忽略的问题。最值得注意的变化是，现在定义 props 时，`children` prop 需要被明确列出来，例如：

```typescript{3}
interface MyButtonProps {
  color: string;
  children?: React.ReactNode;
}
```

查看 [React 18 类型 PR](https://github.com/DefinitelyTyped/DefinitelyTyped/pull/56210) 查看只有类型变了的完整清单。因为它链接到了在类型库中修复的例子，所以你可以知道如何调整你自己的代码。你可以使用 [自动迁移脚本](https://github.com/eps1lon/types-react-codemod) 来帮助你的应用代码更快变更到更安全的新类型。

如果你发现了类型中的 bug，请在 DefinitelyTyped 仓库 [上报问题](https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/new?category=issues-with-a-types-package)。

## 自动批处理 {/*automatic-batching*/}

React 18 跳出既有框架，通过默认做更多批量处理来增加性能提升。批量处理指的是 React 为了提高性能将多个 state 更新分组到一个单独的重渲染。React 18 之前，我们只在 React 事件处理函数内部惊醒批量更新，而 promise、setTimeout、本地事件处理函数或者其他事件，在 React 中默认是不进行批量处理的：

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

更多信息请查看 [深入探索自动化处理](https://github.com/reactwg/react-18/discussions/21)。

## 库的新 API {/*new-apis-for-libraries*/}

在 React 18 工作组，我们和第三方库的维护者合作，创建需要支持 styles 和外部存储中的特定用例的并发渲染的新 API。为了支持 React 18，一些第三方库可能需要切换到下面的 API 之一：
<!-- todo -->
* `useSyncExternalStore` 是一个新增 hook，它允许外部存储通过对 store 的强制更新来支持并发读取。 
allows external stores to support concurrent reads by forcing updates to the store to be synchronous. 
This new API is recommended for any library that integrates with state external to React. 
For more information, see the [useSyncExternalStore overview post](https://github.com/reactwg/react-18/discussions/70) and [useSyncExternalStore API details](https://github.com/reactwg/react-18/discussions/86).
* `useInsertionEffect` is a new hook that allows CSS-in-JS libraries to address performance issues of injecting styles in render. Unless you've already built a CSS-in-JS library we don't expect you to ever use this. This hook will run after the DOM is mutated, but before layout effects read the new layout. This solves an issue that already exists in React 17 and below, but is even more important in React 18 because React yields to the browser during concurrent rendering, giving it a chance to recalculate layout. For more information, see the [Library Upgrade Guide for `<style>`](https://github.com/reactwg/react-18/discussions/110).

React 18 also introduces new APIs for concurrent rendering such as `startTransition`, `useDeferredValue` and `useId`, which we share more about in the [release post](/blog/2022/03/29/react-v18).

## Strict Mode 的变化 {/*updates-to-strict-mode*/}

In the future, we'd like to add a feature that allows React to add and remove sections of the UI while preserving state. For example, when a user tabs away from a screen and back, React should be able to immediately show the previous screen. To do this, React would unmount and remount trees using the same component state as before.

This feature will give React better performance out-of-the-box, but requires components to be resilient to effects being mounted and destroyed multiple times. Most effects will work without any changes, but some effects assume they are only mounted or destroyed once.

To help surface these issues, React 18 introduces a new development-only check to Strict Mode. This new check will automatically unmount and remount every component, whenever a component mounts for the first time, restoring the previous state on the second mount.

Before this change, React would mount the component and create the effects:

```
* React mounts the component.
    * Layout effects are created.
    * Effect effects are created.
```

With Strict Mode in React 18, React will simulate unmounting and remounting the component in development mode:

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

For more information, see the Working Group posts for [Adding Reusable State to StrictMode](https://github.com/reactwg/react-18/discussions/19) and [How to support Reusable State in Effects](https://github.com/reactwg/react-18/discussions/18).

## 配置测试环境 {/*configuring-your-testing-environment*/}

When you first update your tests to use `createRoot`, you may see this warning in your test console:

<ConsoleBlock level="error">

The current testing environment is not configured to support act(...)

</ConsoleBlock>

To fix this, set `globalThis.IS_REACT_ACT_ENVIRONMENT` to `true` before running your test:

```js
// In your test setup file
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
```

The purpose of the flag is to tell React that it's running in a unit test-like environment. React will log helpful warnings if you forget to wrap an update with `act`.

You can also set the flag to `false` to tell React that `act` isn't needed. This can be useful for end-to-end tests that simulate a full browser environment.

Eventually, we expect testing libraries will configure this for you automatically. For example, the [next version of React Testing Library has built-in support for React 18](https://github.com/testing-library/react-testing-library/issues/509#issuecomment-917989936) without any additional configuration.

[More background on the `act` testing API and related changes](https://github.com/reactwg/react-18/discussions/102) is available in the working group.

## 放弃对 Internet Explorer 的支持 {/*dropping-support-for-internet-explorer*/}

In this release, React is dropping support for Internet Explorer, which is [going out of support on June 15, 2022](https://blogs.windows.com/windowsexperience/2021/05/19/the-future-of-internet-explorer-on-windows-10-is-in-microsoft-edge). We’re making this change now because new features introduced in React 18 are built using modern browser features such as microtasks which cannot be adequately polyfilled in IE.

If you need to support Internet Explorer we recommend you stay with React 17.

## 废弃 {/*deprecations*/}

* `react-dom`: `ReactDOM.render` has been deprecated. Using it will warn and run your app in React 17 mode.
* `react-dom`: `ReactDOM.hydrate` has been deprecated. Using it will warn and run your app in React 17 mode.
* `react-dom`: `ReactDOM.unmountComponentAtNode` has been deprecated.
* `react-dom`: `ReactDOM.renderSubtreeIntoContainer` has been deprecated.
* `react-dom/server`: `ReactDOMServer.renderToNodeStream` has been deprecated.

## 其他破坏性变更 {/*other-breaking-changes*/}

* **Consistent useEffect timing**: React now always synchronously flushes effect functions if the update was triggered during a discrete user input event such as a click or a keydown event. Previously, the behavior wasn't always predictable or consistent.
* **Stricter hydration errors**: Hydration mismatches due to missing or extra text content are now treated like errors instead of warnings. React will no longer attempt to "patch up" individual nodes by inserting or deleting a node on the client in an attempt to match the server markup, and will revert to client rendering up to the closest `<Suspense>` boundary in the tree. This ensures the hydrated tree is consistent and avoids potential privacy and security holes that can be caused by hydration mismatches.
* **Suspense trees are always consistent:** If a component suspends before it's fully added to the tree, React will not add it to the tree in an incomplete state or fire its effects. Instead, React will throw away the new tree completely, wait for the asynchronous operation to finish, and then retry rendering again from scratch. React will render the retry attempt concurrently, and without blocking the browser.
* **Layout Effects with Suspense**: When a tree re-suspends and reverts to a fallback, React will now clean up layout effects, and then re-create them when the content inside the boundary is shown again. This fixes an issue which prevented component libraries from correctly measuring layout when used with Suspense.
* **New JS Environment Requirements**: React now depends on modern browsers features including `Promise`, `Symbol`, and `Object.assign`. If you support older browsers and devices such as Internet Explorer which do not provide modern browser features natively or have non-compliant implementations, consider including a global polyfill in your bundled application.

## 其他值得注意的变化 {/*other-notable-changes*/}

### React {/*react*/}

* **Components can now render `undefined`:** React no longer warns if you return `undefined` from a component. This makes the allowed component return values consistent with values that are allowed in the middle of a component tree. We suggest to use a linter to prevent mistakes like forgetting a `return` statement before JSX.
* **In tests, `act` warnings are now opt-in:** If you're running end-to-end tests, the `act` warnings are unnecessary. We've introduced an [opt-in](https://github.com/reactwg/react-18/discussions/102) mechanism so you can enable them only for unit tests where they are useful and beneficial.
* **No warning about `setState` on unmounted components:** Previously, React warned about memory leaks when you call `setState` on an unmounted component. This warning was added for subscriptions, but people primarily run into it in scenarios where setting state is fine, and workarounds make the code worse. We've [removed](https://github.com/facebook/react/pull/22114) this warning.
* **No suppression of console logs:** When you use Strict Mode, React renders each component twice to help you find unexpected side effects. In React 17, we've suppressed console logs for one of the two renders to make the logs easier to read. In response to [community feedback](https://github.com/facebook/react/issues/21783) about this being confusing, we've removed the suppression. Instead, if you have React DevTools installed, the second log's renders will be displayed in grey, and there will be an option (off by default) to suppress them completely.
* **Improved memory usage:** React now cleans up more internal fields on unmount, making the impact from unfixed memory leaks that may exist in your application code less severe.

### React DOM Server {/*react-dom-server*/}

* **`renderToString`:** Will no longer error when suspending on the server. Instead, it will emit the fallback HTML for the closest `<Suspense>` boundary and then retry rendering the same content on the client. It is still recommended that you switch to a streaming API like `renderToPipeableStream` or `renderToReadableStream` instead.
* **`renderToStaticMarkup`:** Will no longer error when suspending on the server. Instead, it will emit the fallback HTML for the closest `<Suspense>` boundary.

## Changelog {/*changelog*/}

你可以在这里查看 [完整的 changelog](https://github.com/facebook/react/blob/main/CHANGELOG.md)。
