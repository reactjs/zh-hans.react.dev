---
title: hydrate
---

<Deprecated>

此 API 将在未来的 React 主要版本中被移除。

从 React 18 开始，`hydrate` 被 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) 替代。在 React 18 或更高版本中使用 `hydrate` 将会警告你的应用程序行为会和 React 17 一样。如果你想了解更多，请看 [这里](/blog/2022/03/08/react-18-upgrade-guide#updates-to-client-rendering-apis)。

</Deprecated>

<Intro>

`hydrate` 允许你在 React 17 及以下版本中将使用 [`react-dom/server`](/reference/react-dom/server) 生成的 HTML 内容作为浏览器 DOM 节点，并在其中显示 React 组件。

```js
hydrate(reactNode, domNode, callback?)
```

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `hydrate(reactNode, domNode, callback?)` {/*hydrate*/}

在 React 17 及以下版本中调用 `hydrate`，可以将 React “附加”到在服务器环境中已经由 React 渲染的现有 HTML 上。

```js
import { hydrate } from 'react-dom';

hydrate(reactNode, domNode);
```

React 将会附加到 `domNode` 内部现有的 HTML，并接管有关的 DOM 的管理。使用 React 完全构建的应用通常只会有一个 `hydrate` 调用，并用于根组件。

[参见下面更多示例](#usage)。

#### 参数 {/*parameters*/}

* `reactNode`：此参数用于渲染现有的 HTML。这通常是像 `<App />` 这样的 JSX 片段，并且在 React 17 中使用如 `renderToString(<App />)` 的 `ReactDOM Server` 方法进行渲染。

* `domNode`：在服务器中被渲染为根节点的 [DOM 元素](https://developer.mozilla.org/zh-CN/docs/Web/API/Element)。

* **可选属性** `callback`：一个函数。如果传递了该参数，React 将会在组件 hydrate 后调用它。

#### 返回值 {/*returns*/}

`hydrate` 返回 `null`。

#### 注意 {/*caveats*/}
* `hydrate` 要求渲染的内容与服务器渲染的内容完全相同。尽管 React 可以修复文本内容的差异，但你应该首先将不匹配视为错误并进行修复。
* 在开发模式下，React 会在 hydration 期间警告不匹配的错误。如果存在不匹配情况，无法保证属性的差异会被修补。在大多数应用程序中不匹配是很少见的，所以验证所有标记的代价将会很高。因此考虑到性能原因，这是很重要的。
* 你的应用程序中可能只有一个 `hydrate` 调用。如果你使用了框架，它可能会为你执行此调用。
* 如果你的应用程序是客户端渲染的，并且没有已经渲染的 HTML，则不支持使用 `hydrate()`。请改用 [render()](/reference/react-dom/render)（适用于 React 17 及以下版本）或 [createRoot()](/reference/react-dom/client/createRoot)（适用于 React 18 及以上版本）。

---

## 用法 {/*usage*/}

调用 `hydrate` 将 <CodeStep step={1}>React 组件</CodeStep> 附加（attach）到服务器渲染的 <CodeStep step={2}>浏览器 DOM 节点</CodeStep>。

```js [[1, 3, "<App />"], [2, 3, "document.getElementById('root')"]]
import { hydrate } from 'react-dom';

hydrate(<App />, document.getElementById('root'));
```

不支持使用 `hydrate()` 渲染仅用于客户端的应用程序（没有服务器渲染的 HTML）。请改用 [`render()`](/reference/react-dom/render)（适用于 React 17 及以下版本）或 [`createRoot()`](/reference/react-dom/client/createRoot)（适用于 React 18 及以上版本）。

### hydrate 服务器渲染的 HTML {/*hydrating-server-rendered-html*/}

在 React 中，hydrate 是指将 React “附加（attach）”到在服务器环境中已由 React 渲染的现有 HTML 上。在 hydrate 期间，React 将尝试将事件监听器附加（attach）到现有标记，并在客户端上接管渲染应用程序。

在完全使用 React 构建的应用程序中，**通常只会在第一次启动整个应用程序时，hydrate “根”节点**。

<Sandpack>

```html public/index.html
<!--
  `<div id="root">...</div>` 中的 HTML 内容是
  由 `react-dom/server` 从 `App` 生成的。
-->
<div id="root"><h1>你好，世界！</h1></div>
```

```js index.js active
import './styles.css';
import { hydrate } from 'react-dom';
import App from './App.js';

hydrate(<App />, document.getElementById('root'));
```

```js App.js
export default function App() {
  return <h1>你好，世界！</h1>;
}
```

</Sandpack>

通常情况下，你不需要再次调用 `hydrate`，也不需要在更多地方调用它。从此时开始，React 将会管理你的应用程序的 DOM。为了更新 UI，你的组件将会 [使用 state](/reference/react/useState)。

有关 hydrate 的更多信息，请参阅 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot)。

---

### 抑制不可避免的 hydrate 不匹配错误 {/*suppressing-unavoidable-hydration-mismatch-errors*/}

如果服务器和客户端之间某个元素的属性或文本内容无法避免不同（比如一个时间戳），你可以禁止 hydrate 警告。

使用 `suppressHydrationWarning={true}` 禁止 hydrate 警告：

<Sandpack>

```html public/index.html
<!--
  `<div id="root">...</div>` 中的 HTML 内容是
  由 `react-dom/server` 从 `App` 生成的。
-->
<div id="root"><h1>当前时间：01/01/2020</h1></div>
```

```js index.js
import './styles.css';
import { hydrate } from 'react-dom';
import App from './App.js';

hydrate(<App />, document.getElementById('root'));
```

```js App.js active
export default function App() {
  return (
    <h1 suppressHydrationWarning={true}>
      当前时间：{new Date().toLocaleDateString()}
    </h1>
  );
}
```

</Sandpack>

这只在同级深度上有效，而且是一种应急方法，因此不要过度使用它。除非它是文本内容，否则 React 仍然不会尝试修补它，因此直至未来的更新它都可能会保持不一致。

---

### 处理不同的客户端和服务器内容 {/*handling-different-client-and-server-content*/}

如果需要在服务器和客户端上故意渲染不同的内容，可以进行双重渲染。在客户端上渲染不同内容的组件可以读取像 `isClient` 这样的 [state 变量](/reference/react/useState)，你可以在 [effect](/reference/react/useEffect) 中将其设置为 `true`：

<Sandpack>

```html public/index.html
<!--
  `<div id="root">...</div>` 中的 HTML 内容是
  由 `react-dom/server` 从 `App` 生成的。
-->
<div id="root"><h1>在服务器</h1></div>
```

```js index.js
import './styles.css';
import { hydrate } from 'react-dom';
import App from './App.js';

hydrate(<App />, document.getElementById('root'));
```

```js App.js active
import { useState, useEffect } from "react";

export default function App() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <h1>
      {isClient ? '在客户端' : '在服务器'}
    </h1>
  );
}
```

</Sandpack>

这样，初始渲染过程将呈现与服务器相同的内容，并且避免不匹配的情况，但会在 hydrate 后立即同步并进行额外的渲染。

<Pitfall>

这种方法会使 hydrate 变慢，因为你的组件必须渲染两次，因此要注意在网络不好情况下的用户体验。JavaScript 代码的加载可能比初始 HTML 渲染要晚许多，因此在 hydrate 后立即渲染不同的 UI 可能会让用户感到不适。

</Pitfall>
