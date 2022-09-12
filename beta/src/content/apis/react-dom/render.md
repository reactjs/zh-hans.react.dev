---
title: render
translators:
  - liu-jin-yi
  - QC-L
  - Neo42
---

<Gotcha>

在 React 18 中，`render` 函数将被 [`createRoot`](/apis/react-dom/client/createRoot) 函数替换。在 React 18 中使用 `render` 函数，React 会抛出警告，你的应用程序的表现将像运行在 React 17 中表现一致。具体详情请参阅 [博文](https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html#updates-to-client-rendering-apis)。

</Gotcha>


<Intro>

`render` 函数会将一段 [JSX](/learn/writing-markup-with-jsx)（“React 节点”）渲染到浏览器 DOM 容器节点中。

```js
render(reactNode, domNode, callback?)
```

</Intro>

<InlineToc />

---

## 用法 {/*usage*/}

通过调用 `render` 函数在 <CodeStep step={2}>浏览器 DOM 节点</CodeStep>中展示 <CodeStep step={1}>React 组件</CodeStep>。

```js [[1, 4, "<App />"], [2, 4, "document.getElementById('root')"]]
import {render} from 'react-dom';
import App from './App.js';

render(<App />, document.getElementById('root'));
````

### 渲染根组件 {/*rendering-the-root-component*/}

在完全由 React 构建的应用程序中，**你通常只需在启动时，执行此操作** —— 渲染 “根” 组件。

<Sandpack>

```js index.js active
import './styles.css';
import {render} from 'react-dom';
import App from './App.js';

render(<App />, document.getElementById('root'));
```

```js App.js
export default function App() {
  return <h1>你好，世界！</h1>;
}
```

</Sandpack>

通常你不需要多次调用 `render` 或在更多地方调用它。从此刻开始，React 将管理你的应用程序的 DOM。如果你想更新 UI，你在组件中通过 [using state](/apis/react/useState) 来实现。

---

### 渲染多个根组件 {/*rendering-multiple-roots*/}

如果你的页面并非 [全部由 React 构建](/learn/add-react-to-a-website)，请为每个由 React 管理的顶层 UI 调用 `render` 函数。

<Sandpack>

```html public/index.html
<nav id="navigation"></nav>
<main>
  <p>这一段没有被 React 渲染（可以查看 index.html 进行验证）。</p>
  <section id="comments"></section>
</main>
```

```js index.js active
import './styles.css';
import { render } from 'react-dom';
import { Comments, Navigation } from './Components.js';

render(
  <Navigation />,
  document.getElementById('navigation')
);

render(
  <Comments />,
  document.getElementById('comments')
);
```

```js Components.js
export function Navigation() {
  return (
    <ul>
      <NavLink href="/">首页</NavLink>
      <NavLink href="/about">关于</NavLink>
    </ul>
  );
}

function NavLink({ href, children }) {
  return (
    <li>
      <a href={href}>{children}</a>
    </li>
  );
}

export function Comments() {
  return (
    <>
      <h2>评论</h2>
      <Comment text="你好！" author="Sophie" />
      <Comment text="你好吗？" author="Sunil" />
    </>
  );
}

function Comment({ text, author }) {
  return (
    <p>{text} — <i>{author}</i></p>
  );
}
```

```css
nav ul { padding: 0; margin: 0; }
nav ul li { display: inline-block; margin-right: 20px; }
```

</Sandpack>

<<<<<<< HEAD
你可以使用 [`unmountComponentAtNode()`](TODO) 来销毁已被渲染的组件树。
=======
You can destroy the rendered trees with [`unmountComponentAtNode()`](/apis/react-dom/unmountComponentAtNode).
>>>>>>> c7d858947f832d1ba4e78caebc391fd964ff6de6

## 更新已渲染的组件树 {/*updating-the-rendered-tree*/}

你可以在同一 DOM 节点上多次调用 `render`。只要组件树结构与之前渲染的内容一致，React 就会 [保留 state](/learn/preserving-and-resetting-state)。请注意观察在输入框中输入内容时的效果，这意味着在此示例中每次重复调用 `render` 时，并不会造成任何影响：

<Sandpack>

```js index.js active
import {render} from 'react-dom';
import './styles.css';
import App from './App.js';

let i = 0;
setInterval(() => {
  render(
    <App counter={i} />,
    document.getElementById('root')
  );
  i++;
}, 1000);
```

```js App.js
export default function App({counter}) {
  return (
    <>
      <h1>你好，世界! {counter}</h1>
      <input placeholder="在这里输入一些东西" />
    </>
  );
}
```

</Sandpack>

多次调用 `render` 函数并不常见。通常，会通过在组件中 [更新 state](/apis/react/useState) 来代替。

---

## 参考 {/*reference*/}

### `render(reactNode, domNode, callback?)` {/*render*/}

通过调用 `render` 函数，可以在浏览器的 DOM 元素中展示 React 组件。

```js
const domNode = document.getElementById('root');
render(<App />, domNode);
```

React 将在 `domNode` 中展示 `<App />` 组件，并对该 DOM 中的内容进行管理。

一个完全由 React 构建的应用程序通常只会对一个根组件调用 `render` 函数。如果一个页面中只有部分内容 "零散" 的使用了 React，可以根据实际需求对 `render` 进行多次调用。

[具体参考上述示例](#usage)。

#### 参数 {/*parameters*/}

* `reactNode`：需要展示的 *React 节点*。这通常是一段 JSX，如 `<App />`，但你也可以传递使用 [`createElement()`](/TODO) 构建的 React 元素，字符串，数字，`null` 或是 `undefined`。

* `domNode`：[DOM 元素](https://developer.mozilla.org/en-US/docs/Web/API/Element)。React 会将 `reactNode` 渲染在该 DOM 元素中。从此刻开始，React 将管理 `domNode` 中的 DOM，并会在 React 树发生变化时更新它。

* **可选** `callback`：回调函数。如果编写了该函数，React 将在你的组件放入 DOM 后调用该函数。


#### 返回值 {/*returns*/}

通常 `render` 会返回 `null`。然后，如果你传递的 `reactNode` 是一个 *class 组件*，那么它将返回该组件的示例。

#### 注意事项 {/*caveats*/}

* 在 React 18 中，`render` 函数已被 [`createRoot`](/apis/react-dom/client/createRoot) 取代。请在 React 18 及后续版本中使用。

* 当你第一次调用 `render` 时，React 会在组件渲染到 `domNode` 中之前，清除掉 `domNode` 中所有已有的 HTML 内容。如果你的 `domNode` 中包含了 React 在服务器上或构建过程中生成的 HTML，请使用 [`hydrate()`](/TODO) 代替，它会将事件处理程序附加到现有的 HTML 中。

* 如果你在同一个 `domNode` 上多次调用 `render` 函数，React 会按需更新 DOM 以响应你传递的最新 JSX。React 会通过与之前渲染的树 ["匹配"](/learn/preserving-and-resetting-state) 的方式来决定 DOM 的哪些部分可以被重用，哪些需要重新创建。多次在同一个 `domNode` 上调用 `render`，类似于在根组件上调用 [`set` 函数](/apis/react/useState#setstate)：React 会避免不必要的 DOM 更新。

<<<<<<< HEAD
* 如果你的应用程序是完全基于 React 构建，那么你其实不需要多次使用 `render` 函数。（如果你使用框架，它可能已帮你完成该调用。）当你想在 DOM 树的不同部分渲染一段 JSX 时，而不是你组件的 children（例如，modal 或者 tooltip），那么请使用 [`createPortal`](TODO) 来代替。
=======
* If your app is fully built with React, you'll likely have only one `render` call in your app. (If you use a framework, it might do this call for you.) When you want to render a piece of JSX in a different part of the DOM tree that isn't a child of your component (for example, a modal or a tooltip), use [`createPortal`](/apis/react-dom/createPortal) instead of `render`.
>>>>>>> c7d858947f832d1ba4e78caebc391fd964ff6de6

---
