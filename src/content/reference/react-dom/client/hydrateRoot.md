---
title: hydrateRoot
translators:
  - childrentime
---

<Intro>

`hydrateRoot` 函数允许你在先前由 [`react-dom/server`](/reference/react-dom/server) 生成的浏览器 HTML DOM 节点中展示 React 组件。

```js
const root = hydrateRoot(domNode, reactNode, options?)
```

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `hydrateRoot(domNode, reactNode, options?)` {/*hydrateroot*/}

用 `hydrateRoot` 函数将 React 连接到由 React 在服务端环境中渲染的现有 HTML 中。

```js
import { hydrateRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = hydrateRoot(domNode, reactNode);
```

React 将会连接到内部有 `domNode` 的 HTML 上，然后接管其中的 `domNode`。一个完全由 React 构建的应用只会在其根组件中调用一次 `hydrateRoot` 方法。

[请参见下面更多示例](#usage)。

#### 参数 {/*parameters*/}

* `domNode`：一个在服务器端渲染时呈现为根元素的 [DOM 元素](https://developer.mozilla.org/zh-CN/docs/Web/API/Element)。

* `reactNode`：用于渲染已存在 HTML 的“React 节点”。这个节点通常是一些类似于 `<App />` 的 JSX，它会在 `ReactDOM Server` 端使用类似于 `renderToPipeableStream(<App />)` 的方法进行渲染。

* **可选**  `options`：一个包含此 React 根元素选项的对象。

  * **optional** `onCaughtError`: Callback called when React catches an error in an Error Boundary. Called with the `error` caught by the Error Boundary, and an `errorInfo` object containing the `componentStack`.
  * **optional** `onUncaughtError`: Callback called when an error is thrown and not caught by an Error Boundary. Called with the `error` that was thrown and an `errorInfo` object containing the `componentStack`.
  * **optional** `onRecoverableError`: Callback called when React automatically recovers from errors. Called with the `error` React throws, and an `errorInfo` object containing the `componentStack`. Some recoverable errors may include the original error cause as `error.cause`.
  * **optional** `identifierPrefix`: A string prefix React uses for IDs generated by [`useId`.](/reference/react/useId) Useful to avoid conflicts when using multiple roots on the same page. Must be the same prefix as used on the server.


#### 返回值 {/*returns*/}

`hydrateRoot` 返回一个包含两个方法的对象 [`render`](#root-render) 和 [`unmount`](#root-unmount)。

#### 警告 {/*caveats*/}

* `hydrateRoot()` 期望渲染内容与服务端渲染的内容完全相同。你应该将不匹配视为错误并进行修复。
* 在开发模式下，React 会在激活期间发出不匹配警告。在不匹配的情况下，不能保证内容差异会被修补。出于性能原因，这很重要，因为在大多数应用程序中，不匹配很少见，因此验证所有标记将是昂贵而不可行的。
* 你的应用程序可能只有一个 `hydrateRoot()` 函数调用。如果你使用框架，则可能会为你完成此调用。
* 如果你的应用程序是客户端渲染，并且没有已渲染好的 HTML，则不支持使用 `hydrateRoot()`。请改用 [`createRoot()`](/reference/react-dom/client/createRoot)。

---

### `root.render(reactNode)` {/*root-render*/}

使用 `root.render` 更新一个激活根组件中的 React 组件来渲染浏览器端 DOM 元素。

```js
root.render(<App />);
```

React 将会在激活 `root` 中更新 `<App />`。

[参见下面更多示例](#usage)。

#### 参数 {/*root-render-parameters*/}

* `reactNode`：你想要更新的 "React 节点"。通常这会是一段JSX代码，例如 `<App />`，但你也可以传递一个通过 [`createElement()`](/reference/react/createElement) 创建的 React 元素，一个字符串，一个数字，`null` 值 或者 `undefined` 值。


#### 返回值 {/*root-render-returns*/}

`root.render` 返回 `undefined` 值。

#### 警告 {/*root-render-caveats*/}

* 如果你在根节点还没有完成激活的情况下调用了 `root.render`，React 将清除现有的服务端渲染 HTML 内容，并将整个根节点切换到客户端渲染。

---

### `root.unmount()` {/*root-unmount*/}

调用 `root.unmount` 来销毁 React 根节点内的渲染树。

```js
root.unmount();
```

完全使用 React 构建的应用通常不会有任何调用 `root.unmount` 的情况。

这主要适用于 React 根节点的 DOM 节点（或其任何祖先节点）可能会被其他代码从 DOM 中移除的情况。例如，想象一下一个 jQuery 标签面板，它会将非活动标签从 DOM 中移除。如果一个标签被移除，其内部的所有内容（包括其中的 React 根节点）也将从 DOM 中移除。你需要调用 `root.unmount` 来告诉 React “停止”管理已移除根节点的内容。否则，已移除根节点内的组件将无法清理和释放已使用的资源，例如订阅。

调用 `root.unmount` 将卸载根节点中的所有组件，并“分离” React 与根 DOM 节点之间的连接，包括删除树中的任何事件处理程序或状态。


#### 参数 {/*root-unmount-parameters*/}


`root.unmount` 不接受任何参数。

#### 返回值 {/*root-unmount-returns*/}

`render` 返回 `undefined` 值。

#### 警告 {/*root-unmount-caveats*/}

* 调用 `root.unmount` 将卸载树中的所有组件，并“分离” React 与根 DOM 节点之间的连接。

* 一旦你调用 `root.unmount`，就不能再在根节点上调用 `root.render`。在未挂载的根节点上尝试调用 `root.render` 将抛出“不能更新未挂载的根节点”的错误。

---

## 用法 {/*usage*/}

### 激活服务端渲染的 HTML {/*hydrating-server-rendered-html*/}

如果你的应用程序的 HTML 是由 [`react-dom/server`](/reference/react-dom/client/createRoot) 生成的，你需要在客户端上进行 **hydrate**。

```js [[1, 3, "document.getElementById('root')"], [2, 3, "<App />"]]
import { hydrateRoot } from 'react-dom/client';

hydrateRoot(document.getElementById('root'), <App />);
```

对于你的应用程序来说，这将激活你的服务端 HTML 来复苏里面的 <CodeStep step={1}>浏览器 DOM 节点</CodeStep>和 <CodeStep step={2}>React 组件</CodeStep>。通常，你只需要在启动时执行一次。如果你使用框架，则可能会自动在幕后执行此操作。

为了进行激活，React 将把你的组件逻辑连接到服务器上生成的初始 HTML 中。激活可以将来自服务器的初始 HTML 快照转换为在浏览器中运行的完全可交互应用。

<Sandpack>

```html public/index.html
<!--
  在 <div id="root">...</div> 中的 HTML 内容
  由 react-dom/server 生成
-->
<div id="root"><h1>Hello, world!</h1><button>You clicked me <!-- -->0<!-- --> times</button></div>
```

```js src/index.js active
import './styles.css';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(
  document.getElementById('root'),
  <App />
);
```

```js src/App.js
import { useState } from 'react';

export default function App() {
  return (
    <>
      <h1>Hello, world!</h1>
      <Counter />
    </>
  );
}

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      You clicked me {count} times
    </button>
  );
}
```

</Sandpack>

你不需要再次调用 `hydrateRoot` 或者在其他地方调用它。从现在开始，React 将管理你的应用程序的 DOM。想要更新 UI 请使用 [useState](/reference/react/useState) 替代。

<Pitfall>

传递给 `hydrateRoot` 的 React 树必须生成与服务端 **相同的输出**。

这对于用户体验非常重要。用户会在你的 JavaScript 代码加载前花费一些时间来查看服务端生成的 HTML。服务端渲染通过显示应用输出的 HTML 快照来产生了应用程序加速加载的错觉。突然出现不同的内容会破坏这种错觉。这就是为什么服务端渲染输出必须与客户端初始渲染输出匹配。

导致激活错误的最常见原因包括：

* 根节点 React 生成的 HTML 周围存在额外的空白符（如换行符）。
* 在渲染逻辑中使用 `typeof window !== 'undefined'` 这样的判断。
* 在渲染逻辑中使用仅限于浏览器端的 API，例如 [`window.matchMedia`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/matchMedia)。
* 在服务器和客户端渲染不同的数据。

React 可以从一些激活错误中恢复，但 **你必须像处理其他 bug 一样修复它们**。在最好的情况下，它们会导致应用程序加载变慢；在最坏的情况下，事件处理程序可能会附加到错误的元素上。

</Pitfall>

---

### 激活整个文档 {/*hydrating-an-entire-document*/}

完全使用 React 构建的应用程序可以将整个文档作为 JSX 渲染，包括 [`<html>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/html) 标签：

```js {3,13}
function App() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles.css"></link>
        <title>My app</title>
      </head>
      <body>
        <Router />
      </body>
    </html>
  );
}
```

要对整个文档进行激活处理，将全局的 [`document`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/document) 作为 `hydrateRoot` 的第一个参数传递：

```js {4}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

---

### 抑制不可避免的激活处理不匹配错误 {/*suppressing-unavoidable-hydration-mismatch-errors*/}

如果一个单独元素属性或文本内容在服务器和客户端之间是不可避免地不同的（例如，时间戳），则可以抑制激活处理不匹配警告。

要消除对元素的激活处理警告，请添加 `suppressHydrationWarning={true}`：

<Sandpack>

```html public/index.html
<!--
  在 <div id="root">...</div> 中的 HTML 内容
  由 react-dom/server 生成
-->
<div id="root"><h1>Current Date: <!-- -->01/01/2020</h1></div>
```

```js src/index.js
import './styles.css';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document.getElementById('root'), <App />);
```

```js src/App.js active
export default function App() {
  return (
    <h1 suppressHydrationWarning={true}>
      Current Date: {new Date().toLocaleDateString()}
    </h1>
  );
}
```

</Sandpack>

此方法仅适用于当前层级，并且旨在作为一种脱围机制。不要滥用它。除非是文本内容，否则 React 不会尝试修补它，因此可能会保持不一致，直到未来的更新来到。

---

### 处理不同的客户端和服务端内容 {/*handling-different-client-and-server-content*/}

如果你有意在服务器和客户端上呈现不同的内容，则可以进行两次渲染。在客户端上呈现不同内容的组件可以读取类似于 `isClient` 的 [状态变量](/reference/react/useState)，你可以在 [Effect](/reference/react/useEffect) 中将其设置为 `true`：

<Sandpack>

```html public/index.html
<!--
  在 <div id="root">...</div> 中的 HTML 内容
  由 react-dom/server 生成
-->
<div id="root"><h1>Is Server</h1></div>
```

```js src/index.js
import './styles.css';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document.getElementById('root'), <App />);
```

```js src/App.js active
import { useState, useEffect } from "react";

export default function App() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <h1>
      {isClient ? 'Is Client' : 'Is Server'}
    </h1>
  );
}
```

</Sandpack>

这样，初始渲染将呈现与服务器相同的内容，避免不匹配，但是在激活之后会同步进行额外的渲染。

<Pitfall>

这种方法使得激活变慢，因为你的组件需要渲染两次。要注意在网络连接较慢的情况下用户的体验。JavaScript 代码的加载时间可能会比初始的 HTML 渲染慢很多，因此在激活之后立即呈现不同的 UI 对用户来说可能也会感到不适。

</Pitfall>

---

### 更新激活根组件 {/*updating-a-hydrated-root-component*/}

在根组件激活完成之后，你可以调用 [`root.render`](#root-render) 来更新根 React 组件。**与  [`createRoot`](/reference/react-dom/client/createRoot) 不同的是，通常你不需要这样做，因为初始内容已经渲染为 HTML**。

如果在激活之后某个时刻调用了 `root.render`，并且组件树结构与之前渲染的相匹配，那么 React 将 [保留重置 state](/learn/preserving-and-resetting-state)。请注意，你可以在输入框中输入文字，这意味着在此示例中每秒钟重复调用的 `render` 不会破坏已有的组件状态：

<Sandpack>

```html public/index.html
<!--
  在 <div id="root">...</div> 中的 HTML 内容
  由 react-dom/server 生成
-->
<div id="root"><h1>Hello, world! <!-- -->0</h1><input placeholder="Type something here"/></div>
```

```js src/index.js active
import { hydrateRoot } from 'react-dom/client';
import './styles.css';
import App from './App.js';

const root = hydrateRoot(
  document.getElementById('root'),
  <App counter={0} />
);

let i = 0;
setInterval(() => {
  root.render(<App counter={i} />);
  i++;
}, 1000);
```

```js src/App.js
export default function App({counter}) {
  return (
    <>
      <h1>Hello, world! {counter}</h1>
      <input placeholder="Type something here" />
    </>
  );
}
```

</Sandpack>

It is uncommon to call [`root.render`](#root-render) on a hydrated root. Usually, you'll [update state](/reference/react/useState) inside one of the components instead.

### Show a dialog for uncaught errors {/*show-a-dialog-for-uncaught-errors*/}

By default, React will log all uncaught errors to the console. To implement your own error reporting, you can provide the optional `onUncaughtError` root option:

```js [[1, 7, "onUncaughtError"], [2, 7, "error", 1], [3, 7, "errorInfo"], [4, 11, "componentStack"]]
import { hydrateRoot } from 'react-dom/client';

const root = hydrateRoot(
  document.getElementById('root'),
  <App />,
  {
    onUncaughtError: (error, errorInfo) => {
      console.error(
        'Uncaught error',
        error,
        errorInfo.componentStack
      );
    }
  }
);
root.render(<App />);
```

The <CodeStep step={1}>onUncaughtError</CodeStep> option is a function called with two arguments:

1. The <CodeStep step={2}>error</CodeStep> that was thrown.
2. An <CodeStep step={3}>errorInfo</CodeStep> object that contains the <CodeStep step={4}>componentStack</CodeStep> of the error.

You can use the `onUncaughtError` root option to display error dialogs:

<Sandpack>

```html public/index.html hidden
<!DOCTYPE html>
<html>
<head>
  <title>My app</title>
</head>
<body>
<!--
  Error dialog in raw HTML
  since an error in the React app may crash.
-->
<div id="error-dialog" class="hidden">
  <h1 id="error-title" class="text-red"></h1>
  <h3>
    <pre id="error-message"></pre>
  </h3>
  <p>
    <pre id="error-body"></pre>
  </p>
  <h4 class="-mb-20">This error occurred at:</h4>
  <pre id="error-component-stack" class="nowrap"></pre>
  <h4 class="mb-0">Call stack:</h4>
  <pre id="error-stack" class="nowrap"></pre>
  <div id="error-cause">
    <h4 class="mb-0">Caused by:</h4>
    <pre id="error-cause-message"></pre>
    <pre id="error-cause-stack" class="nowrap"></pre>
  </div>
  <button
    id="error-close"
    class="mb-10"
    onclick="document.getElementById('error-dialog').classList.add('hidden')"
  >
    Close
  </button>
  <h3 id="error-not-dismissible">This error is not dismissible.</h3>
</div>
<!--
  HTML content inside <div id="root">...</div>
  was generated from App by react-dom/server.
-->
<div id="root"><div><span>This error shows the error dialog:</span><button>Throw error</button></div></div>
</body>
</html>
```

```css src/styles.css active
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }

#error-dialog {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: white;
  padding: 15px;
  opacity: 0.9;
  text-wrap: wrap;
  overflow: scroll;
}

.text-red {
  color: red;
}

.-mb-20 {
  margin-bottom: -20px;
}

.mb-0 {
  margin-bottom: 0;
}

.mb-10 {
  margin-bottom: 10px;
}

pre {
  text-wrap: wrap;
}

pre.nowrap {
  text-wrap: nowrap;
}

.hidden {
 display: none;  
}
```

```js src/reportError.js hidden
function reportError({ title, error, componentStack, dismissable }) {
  const errorDialog = document.getElementById("error-dialog");
  const errorTitle = document.getElementById("error-title");
  const errorMessage = document.getElementById("error-message");
  const errorBody = document.getElementById("error-body");
  const errorComponentStack = document.getElementById("error-component-stack");
  const errorStack = document.getElementById("error-stack");
  const errorClose = document.getElementById("error-close");
  const errorCause = document.getElementById("error-cause");
  const errorCauseMessage = document.getElementById("error-cause-message");
  const errorCauseStack = document.getElementById("error-cause-stack");
  const errorNotDismissible = document.getElementById("error-not-dismissible");
  
  // Set the title
  errorTitle.innerText = title;
  
  // Display error message and body
  const [heading, body] = error.message.split(/\n(.*)/s);
  errorMessage.innerText = heading;
  if (body) {
    errorBody.innerText = body;
  } else {
    errorBody.innerText = '';
  }

  // Display component stack
  errorComponentStack.innerText = componentStack;

  // Display the call stack
  // Since we already displayed the message, strip it, and the first Error: line.
  errorStack.innerText = error.stack.replace(error.message, '').split(/\n(.*)/s)[1];
  
  // Display the cause, if available
  if (error.cause) {
    errorCauseMessage.innerText = error.cause.message;
    errorCauseStack.innerText = error.cause.stack;
    errorCause.classList.remove('hidden');
  } else {
    errorCause.classList.add('hidden');
  }
  // Display the close button, if dismissible
  if (dismissable) {
    errorNotDismissible.classList.add('hidden');
    errorClose.classList.remove("hidden");
  } else {
    errorNotDismissible.classList.remove('hidden');
    errorClose.classList.add("hidden");
  }
  
  // Show the dialog
  errorDialog.classList.remove("hidden");
}

export function reportCaughtError({error, cause, componentStack}) {
  reportError({ title: "Caught Error", error, componentStack,  dismissable: true});
}

export function reportUncaughtError({error, cause, componentStack}) {
  reportError({ title: "Uncaught Error", error, componentStack, dismissable: false });
}

export function reportRecoverableError({error, cause, componentStack}) {
  reportError({ title: "Recoverable Error", error, componentStack,  dismissable: true });
}
```

```js src/index.js active
import { hydrateRoot } from "react-dom/client";
import App from "./App.js";
import {reportUncaughtError} from "./reportError";
import "./styles.css";
import {renderToString} from 'react-dom/server';

const container = document.getElementById("root");
const root = hydrateRoot(container, <App />, {
  onUncaughtError: (error, errorInfo) => {
    if (error.message !== 'Known error') {
      reportUncaughtError({
        error,
        componentStack: errorInfo.componentStack
      });
    }
  }
});
```

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [throwError, setThrowError] = useState(false);
  
  if (throwError) {
    foo.bar = 'baz';
  }
  
  return (
    <div>
      <span>This error shows the error dialog:</span>
      <button onClick={() => setThrowError(true)}>
        Throw error
      </button>
    </div>
  );
}
```

</Sandpack>


### Displaying Error Boundary errors {/*displaying-error-boundary-errors*/}

By default, React will log all errors caught by an Error Boundary to `console.error`. To override this behavior, you can provide the optional `onCaughtError` root option for errors caught by an [Error Boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary):

```js [[1, 7, "onCaughtError"], [2, 7, "error", 1], [3, 7, "errorInfo"], [4, 11, "componentStack"]]
import { hydrateRoot } from 'react-dom/client';

const root = hydrateRoot(
  document.getElementById('root'),
  <App />,
  {
    onCaughtError: (error, errorInfo) => {
      console.error(
        'Caught error',
        error,
        errorInfo.componentStack
      );
    }
  }
);
root.render(<App />);
```

The <CodeStep step={1}>onCaughtError</CodeStep> option is a function called with two arguments:

1. The <CodeStep step={2}>error</CodeStep> that was caught by the boundary.
2. An <CodeStep step={3}>errorInfo</CodeStep> object that contains the <CodeStep step={4}>componentStack</CodeStep> of the error.

You can use the `onCaughtError` root option to display error dialogs or filter known errors from logging:

<Sandpack>

```html public/index.html hidden
<!DOCTYPE html>
<html>
<head>
  <title>My app</title>
</head>
<body>
<!--
  Error dialog in raw HTML
  since an error in the React app may crash.
-->
<div id="error-dialog" class="hidden">
  <h1 id="error-title" class="text-red"></h1>
  <h3>
    <pre id="error-message"></pre>
  </h3>
  <p>
    <pre id="error-body"></pre>
  </p>
  <h4 class="-mb-20">This error occurred at:</h4>
  <pre id="error-component-stack" class="nowrap"></pre>
  <h4 class="mb-0">Call stack:</h4>
  <pre id="error-stack" class="nowrap"></pre>
  <div id="error-cause">
    <h4 class="mb-0">Caused by:</h4>
    <pre id="error-cause-message"></pre>
    <pre id="error-cause-stack" class="nowrap"></pre>
  </div>
  <button
    id="error-close"
    class="mb-10"
    onclick="document.getElementById('error-dialog').classList.add('hidden')"
  >
    Close
  </button>
  <h3 id="error-not-dismissible">This error is not dismissible.</h3>
</div>
<!--
  HTML content inside <div id="root">...</div>
  was generated from App by react-dom/server.
-->
<div id="root"><span>This error will not show the error dialog:</span><button>Throw known error</button><span>This error will show the error dialog:</span><button>Throw unknown error</button></div>
</body>
</html>
```

```css src/styles.css active
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }

#error-dialog {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: white;
  padding: 15px;
  opacity: 0.9;
  text-wrap: wrap;
  overflow: scroll;
}

.text-red {
  color: red;
}

.-mb-20 {
  margin-bottom: -20px;
}

.mb-0 {
  margin-bottom: 0;
}

.mb-10 {
  margin-bottom: 10px;
}

pre {
  text-wrap: wrap;
}

pre.nowrap {
  text-wrap: nowrap;
}

.hidden {
 display: none;  
}
```

```js src/reportError.js hidden
function reportError({ title, error, componentStack, dismissable }) {
  const errorDialog = document.getElementById("error-dialog");
  const errorTitle = document.getElementById("error-title");
  const errorMessage = document.getElementById("error-message");
  const errorBody = document.getElementById("error-body");
  const errorComponentStack = document.getElementById("error-component-stack");
  const errorStack = document.getElementById("error-stack");
  const errorClose = document.getElementById("error-close");
  const errorCause = document.getElementById("error-cause");
  const errorCauseMessage = document.getElementById("error-cause-message");
  const errorCauseStack = document.getElementById("error-cause-stack");
  const errorNotDismissible = document.getElementById("error-not-dismissible");
  
  // Set the title
  errorTitle.innerText = title;
  
  // Display error message and body
  const [heading, body] = error.message.split(/\n(.*)/s);
  errorMessage.innerText = heading;
  if (body) {
    errorBody.innerText = body;
  } else {
    errorBody.innerText = '';
  }

  // Display component stack
  errorComponentStack.innerText = componentStack;

  // Display the call stack
  // Since we already displayed the message, strip it, and the first Error: line.
  errorStack.innerText = error.stack.replace(error.message, '').split(/\n(.*)/s)[1];
  
  // Display the cause, if available
  if (error.cause) {
    errorCauseMessage.innerText = error.cause.message;
    errorCauseStack.innerText = error.cause.stack;
    errorCause.classList.remove('hidden');
  } else {
    errorCause.classList.add('hidden');
  }
  // Display the close button, if dismissible
  if (dismissable) {
    errorNotDismissible.classList.add('hidden');
    errorClose.classList.remove("hidden");
  } else {
    errorNotDismissible.classList.remove('hidden');
    errorClose.classList.add("hidden");
  }
  
  // Show the dialog
  errorDialog.classList.remove("hidden");
}

export function reportCaughtError({error, cause, componentStack}) {
  reportError({ title: "Caught Error", error, componentStack,  dismissable: true});
}

export function reportUncaughtError({error, cause, componentStack}) {
  reportError({ title: "Uncaught Error", error, componentStack, dismissable: false });
}

export function reportRecoverableError({error, cause, componentStack}) {
  reportError({ title: "Recoverable Error", error, componentStack,  dismissable: true });
}
```

```js src/index.js active
import { hydrateRoot } from "react-dom/client";
import App from "./App.js";
import {reportCaughtError} from "./reportError";
import "./styles.css";

const container = document.getElementById("root");
const root = hydrateRoot(container, <App />, {
  onCaughtError: (error, errorInfo) => {
    if (error.message !== 'Known error') {
      reportCaughtError({
        error,
        componentStack: errorInfo.componentStack
      });
    }
  }
});
```

```js src/App.js
import { useState } from 'react';
import { ErrorBoundary } from "react-error-boundary";

export default function App() {
  const [error, setError] = useState(null);
  
  function handleUnknown() {
    setError("unknown");
  }

  function handleKnown() {
    setError("known");
  }
  
  return (
    <>
      <ErrorBoundary
        fallbackRender={fallbackRender}
        onReset={(details) => {
          setError(null);
        }}
      >
        {error != null && <Throw error={error} />}
        <span>This error will not show the error dialog:</span>
        <button onClick={handleKnown}>
          Throw known error
        </button>
        <span>This error will show the error dialog:</span>
        <button onClick={handleUnknown}>
          Throw unknown error
        </button>
      </ErrorBoundary>
      
    </>
  );
}

function fallbackRender({ resetErrorBoundary }) {
  return (
    <div role="alert">
      <h3>Error Boundary</h3>
      <p>Something went wrong.</p>
      <button onClick={resetErrorBoundary}>Reset</button>
    </div>
  );
}

function Throw({error}) {
  if (error === "known") {
    throw new Error('Known error')
  } else {
    foo.bar = 'baz';
  }
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.0.0-rc-3edc000d-20240926",
    "react-dom": "19.0.0-rc-3edc000d-20240926",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```

</Sandpack>

### Show a dialog for recoverable hydration mismatch errors {/*show-a-dialog-for-recoverable-hydration-mismatch-errors*/}

When React encounters a hydration mismatch, it will automatically attempt to recover by rendering on the client. By default, React will log hydration mismatch errors to `console.error`. To override this behavior, you can provide the optional `onRecoverableError` root option:

```js [[1, 7, "onRecoverableError"], [2, 7, "error", 1], [3, 11, "error.cause", 1], [4, 7, "errorInfo"], [5, 12, "componentStack"]]
import { hydrateRoot } from 'react-dom/client';

const root = hydrateRoot(
  document.getElementById('root'),
  <App />,
  {
    onRecoverableError: (error, errorInfo) => {
      console.error(
        'Caught error',
        error,
        error.cause,
        errorInfo.componentStack
      );
    }
  }
);
```

The <CodeStep step={1}>onRecoverableError</CodeStep> option is a function called with two arguments:

1. The <CodeStep step={2}>error</CodeStep> React throws. Some errors may include the original cause as <CodeStep step={3}>error.cause</CodeStep>.
2. An <CodeStep step={4}>errorInfo</CodeStep> object that contains the <CodeStep step={5}>componentStack</CodeStep> of the error.

You can use the `onRecoverableError` root option to display error dialogs for hydration mismatches:

<Sandpack>

```html public/index.html hidden
<!DOCTYPE html>
<html>
<head>
  <title>My app</title>
</head>
<body>
<!--
  Error dialog in raw HTML
  since an error in the React app may crash.
-->
<div id="error-dialog" class="hidden">
  <h1 id="error-title" class="text-red"></h1>
  <h3>
    <pre id="error-message"></pre>
  </h3>
  <p>
    <pre id="error-body"></pre>
  </p>
  <h4 class="-mb-20">This error occurred at:</h4>
  <pre id="error-component-stack" class="nowrap"></pre>
  <h4 class="mb-0">Call stack:</h4>
  <pre id="error-stack" class="nowrap"></pre>
  <div id="error-cause">
    <h4 class="mb-0">Caused by:</h4>
    <pre id="error-cause-message"></pre>
    <pre id="error-cause-stack" class="nowrap"></pre>
  </div>
  <button
    id="error-close"
    class="mb-10"
    onclick="document.getElementById('error-dialog').classList.add('hidden')"
  >
    Close
  </button>
  <h3 id="error-not-dismissible">This error is not dismissible.</h3>
</div>
<!--
  HTML content inside <div id="root">...</div>
  was generated from App by react-dom/server.
-->
<div id="root"><span>Server</span></div>
</body>
</html>
```

```css src/styles.css active
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }

#error-dialog {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: white;
  padding: 15px;
  opacity: 0.9;
  text-wrap: wrap;
  overflow: scroll;
}

.text-red {
  color: red;
}

.-mb-20 {
  margin-bottom: -20px;
}

.mb-0 {
  margin-bottom: 0;
}

.mb-10 {
  margin-bottom: 10px;
}

pre {
  text-wrap: wrap;
}

pre.nowrap {
  text-wrap: nowrap;
}

.hidden {
 display: none;  
}
```

```js src/reportError.js hidden
function reportError({ title, error, componentStack, dismissable }) {
  const errorDialog = document.getElementById("error-dialog");
  const errorTitle = document.getElementById("error-title");
  const errorMessage = document.getElementById("error-message");
  const errorBody = document.getElementById("error-body");
  const errorComponentStack = document.getElementById("error-component-stack");
  const errorStack = document.getElementById("error-stack");
  const errorClose = document.getElementById("error-close");
  const errorCause = document.getElementById("error-cause");
  const errorCauseMessage = document.getElementById("error-cause-message");
  const errorCauseStack = document.getElementById("error-cause-stack");
  const errorNotDismissible = document.getElementById("error-not-dismissible");
  
  // Set the title
  errorTitle.innerText = title;
  
  // Display error message and body
  const [heading, body] = error.message.split(/\n(.*)/s);
  errorMessage.innerText = heading;
  if (body) {
    errorBody.innerText = body;
  } else {
    errorBody.innerText = '';
  }

  // Display component stack
  errorComponentStack.innerText = componentStack;

  // Display the call stack
  // Since we already displayed the message, strip it, and the first Error: line.
  errorStack.innerText = error.stack.replace(error.message, '').split(/\n(.*)/s)[1];
  
  // Display the cause, if available
  if (error.cause) {
    errorCauseMessage.innerText = error.cause.message;
    errorCauseStack.innerText = error.cause.stack;
    errorCause.classList.remove('hidden');
  } else {
    errorCause.classList.add('hidden');
  }
  // Display the close button, if dismissible
  if (dismissable) {
    errorNotDismissible.classList.add('hidden');
    errorClose.classList.remove("hidden");
  } else {
    errorNotDismissible.classList.remove('hidden');
    errorClose.classList.add("hidden");
  }
  
  // Show the dialog
  errorDialog.classList.remove("hidden");
}

export function reportCaughtError({error, cause, componentStack}) {
  reportError({ title: "Caught Error", error, componentStack,  dismissable: true});
}

export function reportUncaughtError({error, cause, componentStack}) {
  reportError({ title: "Uncaught Error", error, componentStack, dismissable: false });
}

export function reportRecoverableError({error, cause, componentStack}) {
  reportError({ title: "Recoverable Error", error, componentStack,  dismissable: true });
}
```

```js src/index.js active
import { hydrateRoot } from "react-dom/client";
import App from "./App.js";
import {reportRecoverableError} from "./reportError";
import "./styles.css";

const container = document.getElementById("root");
const root = hydrateRoot(container, <App />, {
  onRecoverableError: (error, errorInfo) => {
    reportRecoverableError({
      error,
      cause: error.cause,
      componentStack: errorInfo.componentStack
    });
  }
});
```

```js src/App.js
import { useState } from 'react';
import { ErrorBoundary } from "react-error-boundary";

export default function App() {
  const [error, setError] = useState(null);
  
  function handleUnknown() {
    setError("unknown");
  }

  function handleKnown() {
    setError("known");
  }
  
  return (
    <span>{typeof window !== 'undefined' ? 'Client' : 'Server'}</span>
  );
}

function fallbackRender({ resetErrorBoundary }) {
  return (
    <div role="alert">
      <h3>Error Boundary</h3>
      <p>Something went wrong.</p>
      <button onClick={resetErrorBoundary}>Reset</button>
    </div>
  );
}

function Throw({error}) {
  if (error === "known") {
    throw new Error('Known error')
  } else {
    foo.bar = 'baz';
  }
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.0.0-rc-3edc000d-20240926",
    "react-dom": "19.0.0-rc-3edc000d-20240926",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```

</Sandpack>

## Troubleshooting {/*troubleshooting*/}


### I'm getting an error: "You passed a second argument to root.render" {/*im-getting-an-error-you-passed-a-second-argument-to-root-render*/}

A common mistake is to pass the options for `hydrateRoot` to `root.render(...)`:

<ConsoleBlock level="error">

Warning: You passed a second argument to root.render(...) but it only accepts one argument.

</ConsoleBlock>

To fix, pass the root options to `hydrateRoot(...)`, not `root.render(...)`:
```js {2,5}
// 🚩 Wrong: root.render only takes one argument.
root.render(App, {onUncaughtError});

// ✅ Correct: pass options to createRoot.
const root = hydrateRoot(container, <App />, {onUncaughtError});
```
