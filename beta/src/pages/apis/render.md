---
title: render()
translators:
  - liu-jin-yi
  - QC-L
  - Neo42
---

<Intro>

`render` 函数会将一段 [JSX](/learn/writing-markup-with-jsx)（“React 元素”）渲染到浏览器 DOM 容器节点中。它会指引 React 改变 `container` 中的 DOM，使其与所传递的 JSX 相匹配。

```js
render(<App />, container);
render(<App />, container, callback);
```

</Intro>

## 渲染根组件 {/*rendering-the-root-component*/}

如需调用 `render`，你需要编写一段 JSX 代码以及一个 DOM 容器：

<APIAnatomy>

<AnatomyStep title="React 元素">

需要渲染的 UI 界面。

</AnatomyStep>

<AnatomyStep title="DOM 容器">

用于渲染 UI 界面的 DOM 节点。容器本身不会被修改，只有其子节点会被修改。

</AnatomyStep>

```js [[1, 2, "<App />"], [2, 2, "container"]]
const container = document.getElementById('root');
render(<App />, container);
```

</APIAnatomy>

在完全使用 React 构建的应用程序中，你需要在应用程序的最顶层执行一次该操作——渲染“根”组件。

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

<br />

## 渲染多个根组件 {/*rendering-multiple-roots*/}

如果你在多个地方都散布了 React ["碎片"](/learn/add-react-to-a-website)，那么你就得为每个由 React 管理的顶层 UI 组件调用 `render` 函数。

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

<br />

## 更新已渲染的组件树 {/*updating-the-rendered-tree*/}

你可以在同一 DOM 节点上多次调用 `render`。只要组件树结构与之前渲染的内容一致，React 就会 [保留 state](/learn/preserving-and-resetting-state)。请仔细观察在输入框中输入内容后的效果：

<Sandpack>

```js index.js active
import {render} from 'react-dom';
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

你可以使用 [`unmountComponentAtNode()`](TODO) 来销毁已被渲染的组件树。

<br />

## 何时不使用它 {/*when-not-to-use-it*/}

* 如果你的应用程序使用服务器渲染，并会在服务器上生成 HTML，请使用 [`hydrate`](TODO) 函数，而非 `render` 函数。
* 如果你的应用程序完全基于 React 构建，那么你其实不需要多次使用 `render` 函数。如果你想在 DOM 树的其他位置渲染内容（例如，modal 或者 tooltip），那么请使用 [`createPortal`](TODO) 来代替。

<br />


## 细节特性 {/*behavior-in-detail*/}

在你第一次调用 `render` 时，`container` 内任何已有的 DOM 元素都会被替换。如果你再次调用 render 的话，React 会为了体现最新的 JSX 而进行必要的 DOM 更新。React 会通过将 DOM 与先前渲染的组件树进行“匹配”的方式来决定 DOM 的哪些部分可以复用、哪些部分需要重新创建。重复调用 render 与调用 setState 相似——在这两种情况下，React 都会避免不必要的 DOM 更新。

你可以将一个回调函数作为第三个参数传递给 render。React 会在你的组件在 DOM 中出现后调用它。

如果你渲染了一个 `<MyComponent />` ，并且 `MyComponent` 是一个类组件，那么 `render` 函数就会返回该类的实例。在其他情况下，它将返回 `null`。
