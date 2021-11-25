---
title: render()
translators:
  - liu-jin-yi
---

<Intro>

`render` 函数会将 [JSX](/learn/writing-markup-with-jsx)（“React 元素”）渲染到浏览器 DOM 容器节点中。它可以让 React 改变 `container` 中 DOM，使其与传递的 JSX 相匹配。

```js
render(<App />, container);
render(<App />, container, callback);
```

</Intro>

## 渲染根组件 {/*rendering-the-root-component*/}

想要调用“render”，你需要一段 JSX 和一个 DOM 容器：

<APIAnatomy>

<AnatomyStep title="React element">

你想渲染的 UI 界面。

</AnatomyStep>

<AnatomyStep title="DOM container">

你如果想把你的 UI 界面渲染到 DOM 节点中去。那么容器是不能被修改的，只能修改它的子节点。

</AnatomyStep>

```js [[1, 2, "<App />"], [2, 2, "container"]]
const container = document.getElementById('root');
render(<App />, container);
```

</APIAnatomy>

在完全由 React 构建的应用程序中，你将在你的应用程序的顶层做一次这样的工作 —— 渲染"root"组件。

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

不管你在哪里使用 React 的 ["sprinkles"](/learn/add-react-to-a-website) ，你都应该为每个由 React 管理的顶层 UI 组件调用“render”进行渲染。

<Sandpack>

```html public/index.html
<nav id="navigation"></nav>
<main>
  <p>这一段没有被 React 渲染（可以打开 index.html 来验证）。</p>
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
      <NavLink href="/">Home</NavLink>
      <NavLink href="/about">About</NavLink>
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
      <h2>Comments</h2>
      <Comment text="你好！" author="Sophie" />
      <Comment text="你是谁？" author="Sunil" />
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

## 更新已渲染的 DOM {/*updating-the-rendered-tree*/}

你可以在同一个 DOM 节点上多次调用“render”。只要组件树结构与之前渲染的内容一致，React 就会 [保留这个状态](/learn/preserving-and-resetting-state) 。请注意你书写代码的方式：

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
      <h1>Hello, world! {counter}</h1>
      <input placeholder="在这里输入一些东西" />
    </>
  );
}
```

</Sandpack>

你可以使用 [“unmountComponentAtNode()”](TODO) 销毁已渲染的 DOM 树。

<br />

## 何时不使用它 {/*when-not-to-use-it*/}

* 如果你的应用程序使用服务器渲染并在服务器上生成 HTML ，请使用 [“hydrate”](TODO) 而不是“render”。
* 如果你的应用程序是完全用 React 构建的，你应该不需要多次使用“render”。如果你想在 DOM 树的不同部分渲染一些东西（例如，modal 或者 tooltip），那么请使用 [“createPortal”](TODO) 来代替。

<br />


## 使用细节 {/*behavior-in-detail*/}

在你第一次调用“render”时，“container”内的任何现有 DOM 元素都会被替换。如果你再次调用“render”，React 将会通过 ["匹配"](/learn/preserving-and-resetting-state) 与先前渲染的组件树来决定 DOM 的哪些部分可以重用，哪些需要重新创建。重复调用“render”与调用“setState” —— 在这两种情况下，React 都会避免不必要的 DOM 更新。

你可以传递一个回调函数作为第三个参数。React 会在你的组件出现在 DOM 中后调用它。

如果你渲染 `<MyComponent />` ，并且“MyComponent”是一个类组件，“render”将返回该类的实例。在其他情况下，它将返回“null”。