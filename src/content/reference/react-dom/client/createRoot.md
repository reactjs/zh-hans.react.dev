---
title: createRoot
---

<Intro>

`createRoot` 能够让你创建一个根以在浏览器的DOM节点内展示React组件。

```js
const root = createRoot(domNode, options?)
```

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `createRoot(domNode, options?)` {/*createroot*/}

调用 `createRoot` 生成一个React根用以在浏览器的DOM元素中展示内容。

```js
import { createRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = createRoot(domNode);
```

React 将会为 `DOM节点` 创建一个根，并接管其中的DOM.。在根被创建后，你需要调用 [`root.render`](#root-render) 来在其中展示React组件：

```js
root.render(<App />);
```

一个完全使用React搭建的应用通常仅会在其根组件中调用一次 `createRoot`。一个页面如果使用React "糖衣" 来构建了自己的一部分的话，可能会按需创建多个根。

[往下查看更多案例](#usage)。

#### 参数 {/*parameters*/}

* `domNode`： 一个 [DOM元素](https：//developer.mozilla.org/en-US/docs/Web/API/Element)。React将会为此元素创建一个根，并允许你调用它的方法，比如调用 `render` 来展示React内容。

* **可选项** `options`： 一个对象，其中有传给React根的配置。

  * **可选项** `onRecoverableError`： 回调函数，当React从错误中自动恢复后会调用。
  * **可选项** `identifierPrefix`： 一个字符串前缀，是React使用 [`useId`](/reference/react/useId) 生成，并作为ID使用。 为避免在同页面中使用多个根时的冲突很有用。

#### 返回 {/*returns*/}

`createRoot` 返回一个对象，其中包含两个方法： [`render`](#root-render) 和 [`unmount`](#root-unmount)。

#### 警告 {/*caveats*/}
* 如果你的应用是由服务端渲染的，调用 `createRoot()` 是不支持的。用 [`hydrateRoot()`](/reference/react-dom/client/hydrateRoot) 来代替。
* 你基本只会在你的应用中调用一次 `createRoot`。如果你使用了框架，它应该已经替你做了调用。
* 当你想在非组件子节点的，DOM树的其他地方渲染一些JSX，比如一个模态框或一个工具提示，使用 [`createPortal`](/reference/react-dom/createPortal) 来代替 `createRoot`。

---

### `root.render(reactNode)` {/*root-render*/}

调用 `root.render` 来在根的浏览器DOM元素内展示一块 [JSX](/learn/writing-markup-with-jsx) ("React 节点")。

```js
root.render(<App />);
```

React 将会在 `根` 中展示 `<App />`，并接管其中的DOM。

[往下查看更多案例](#usage)。

#### 参数 {/*root-render-parameters*/}

* `reactNode`：一个你希望展示的 <b>React 节点</b> 。这通常是类似 `<App />` 的一块JSX，但你也可以传递一个使用with [`createElement()`](/reference/react/createElement) 构建的React元素，一串字符串，一个数字，`null` 或是 `undefined`。


#### 返回值 {/*root-render-returns*/}

`root.render` 返回 `undefined`。

#### 警告 {/*root-render-caveats*/}

* 但你第一次调用 `root.render`，React 将会在渲染React组件前清除React根中的所有现存HTML内容。

* 如果你的根的DOM节点包含React在服务端构建时生成的HTML，调用 [`hydrateRoot()`](/reference/react-dom/client/hydrateRoot) 代替，这个方法会将事件处理联结到现存的HTML上。

* 如果你在同一个根上调用 `render` 超过一次, React将会必要地更新DOM以展示你最新传递的JSX。React 将会基于和之前的渲染树 ["相匹配"](/learn/preserving-and-resetting-state) 来决定哪部分DOM可被重用，哪部分DOM需要被重新创建。在同一个根上再次调用 `render` 与在根组件上调用 [`set` 函数](/reference/react/useState#setstate) 是类似的：React会避免不必要的DOM更新。

---

### `root.unmount()` {/*root-unmount*/}

调用 `root.unmount` 来销毁一个React根内已渲染的树。

```js
root.unmount();
```

一个完全由React搭建的应用通常不会调用`root.unmount`。

当你的React根的DOM节点（或其任一祖先）可能会被某些代码从DOM中移除，此时这个API是最有用的。举个例子，想象一个jQuery选项卡面板从DOM中移除一些不活跃的选项卡。如果一个选项卡被移除，其中所有的（包括里面的React根们）也会被从DOM中移除。在这种情况下，你需要通过调用 `root.unmount`，告诉React停止管理被移除的根的内容。否则，被移除的根中的组件并不知道要去清理和释放全局资源，比如某些订阅。

调用 `root.unmount` 会卸载根内的所有组件，并将React与根DOM节点“分离”，包括卸载树中的所有事件处理函数和状态。


#### 参数 {/*root-unmount-parameters*/}

`root.unmount` 不接受任何参数。


#### 返回值 {/*root-unmount-returns*/}

`root.unmount` 返回 `undefined`。

#### 注意事项 {/*root-unmount-caveats*/}

* 调用 `root.unmount` 会卸载根内的所有组件，并将React与根DOM节点“分离”。

* 一旦你调用 `root.unmount`，你将无法在同一个根上调用 `root.render`。在一个卸载后的根上尝试调用 `root.render` 将会抛出一个 "无法更新一个已卸载的根" 的错误。然而，你可以一个DOM节点的前一个根卸载之后，在这个节点上再建立一个新的根。 

---

## 应用 {/*usage*/}

### 渲染一个完全由Reac构建的应用 {/*rendering-an-app-fully-built-with-react*/}

如果你的应用完全由React构建，你的整个应用应只建立一个根。

```js [[1, 3, "document.getElementById('root')"], [2, 4, "<App />"]]
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
````

通常，你只需要在启动时运行以上代码。它将：

1. 找到你的HTML中定义的 <CodeStep step={1}>浏览器DOM节点</CodeStep> 。
2. 展示你应用内的 <CodeStep step={2}>React组件</CodeStep> 。

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <!-- This is the DOM node -->
    <div id="root"></div>
  </body>
</html>
```

```js index.js active
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

```js App.js
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

**如果你的应用完全由React构建，你不需要创建更多根，或再次调用 [`root.render`](#root-render)。** 

从现在起，React将会管理你整个应用中的DOM。如果要添加更多组件，[将他们嵌套在 `App` 组件内](/learn/importing-and-exporting-components)。当你需要更新UI，你的每个组件都可以通过 [使用 state](/reference/react/useState) 来达成这一点。当你需要在DOM节点外展示额外内容，比如模态框或工具提示 [借助 portal 进行渲染](/reference/react-dom/createPortal)。

<Note>

当你的HTML为空，用户将会看到空白页，直到应用的JavaScript代码加载并执行：

```html
<div id="root"></div>
```

这会让人感觉非常慢！要解决这个问题，你可以在你的组件内创建一些初始的HTML [在服务端或是构建时](/reference/react-dom/server)。之后访问者就能够在JavaScript代码加载前读到文字，看到图片，还可以点击链接。我们推荐 [使用框架](/learn/start-a-new-react-project#production-grade-react-frameworks)，它能使这种优化开箱即用。取决于这一行为何时运行，它被称为 <b>服务端渲染(SSR)</b> 或者 <b>静态页面生产(SSG)</b>。

</Note>

<Pitfall>

**使用服务端渲染或静态生产的应用必须调用 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) 而非 `createRoot`。** React之后会 *hydrate* (复用) ，从你的HTML读取DOM节点，而不是销毁并重建他们

</Pitfall>

---

### 渲染一个部分由React构建的页面 {/*rendering-a-page-partially-built-with-react*/}

如果你的页面 [不是完全由React构建](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page)，你可以多次调用 `createRoot` ，在每一处由React管理的UI顶层创建一个根。你可以在每一个根内通过调用 [`root.render`](#root-render)，来展示不同的内容。 

这里，两个不同的React组件被渲染进 `index.html` 文件内的两个DOM节点：

<Sandpack>

```html public/index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <nav id="navigation"></nav>
    <main>
      <p>This paragraph is not rendered by React (open index.html to verify).</p>
      <section id="comments"></section>
    </main>
  </body>
</html>
```

```js index.js active
import './styles.css';
import { createRoot } from 'react-dom/client';
import { Comments, Navigation } from './Components.js';

const navDomNode = document.getElementById('navigation');
const navRoot = createRoot(navDomNode); 
navRoot.render(<Navigation />);

const commentDomNode = document.getElementById('comments');
const commentRoot = createRoot(commentDomNode); 
commentRoot.render(<Comments />);
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
      <Comment text="Hello!" author="Sophie" />
      <Comment text="How are you?" author="Sunil" />
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
nav ul { padding： 0; margin： 0; }
nav ul li { display： inline-block; margin-right： 20px; }
```

</Sandpack>

你也可以借助 [`document.createElement()`](https：//developer.mozilla.org/en-US/docs/Web/API/Document/createElement) 创建一个新的DOM节点，并手动将其添加到文档内。

```js
const domNode = document.createElement('div');
const root = createRoot(domNode); 
root.render(<Comment />);
document.body.appendChild(domNode); // 你可以在文档任意地方添加它
```

如果要从DOM节点上移除React树并清理所有它用到的资源，调用 [`root.unmount`](#root-unmount)。

```js
root.unmount();
```

当你的React组件存在于一个并非由React实现的应用中，这就是它最有用的时候。

---

### 更新一个根组件 {/*updating-a-root-component*/}

你可以在同一个根上多次调用 `render`。只要组件树的结构和之前渲染的能够相匹配，React将会 [保存状态](/learn/preserving-and-resetting-state)。注意你可以如何输入，这代表例子中，每秒重复调用一次 `render` 而引起的多次更新，并非是毁灭性的：

<Sandpack>

```js index.js active
import { createRoot } from 'react-dom/client';
import './styles.css';
import App from './App.js';

const root = createRoot(document.getElementById('root'));

let i = 0;
setInterval(() => {
  root.render(<App counter={i} />);
  i++;
}, 1000);
```

```js App.js
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

多次调用 `render` 并不常见。通常情况下，你的组件将会 [更新state] 来代替这一点。

---
## 疑难解答 {/*troubleshooting*/}

### 我创建了一个root，但什么都没有展示 {/*ive-created-a-root-but-nothing-is-displayed*/}

确保你真的在你应用的根上调用了 *render* ：

```js {5}
import { createRoot } from 'react-dom/client';
import App from './App.js';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

除非你这样做，否则什么都不会展示。

---

### 我得到了一个错误：“目标容器不是一个DOM元素” {/*im-getting-an-error-target-container-is-not-a-dom-element*/}

这个错误代表你传给 `createRoot` 的不是一个DOM节点。

如果你不确定发生了什么，试试输出它：

```js {2}
const domNode = document.getElementById('root');
console.log(domNode); // ???
const root = createRoot(domNode);
root.render(<App />);
```

比如，如果 `domNode` 是 `null`，这代表 [`getElementById`](https：//developer.mozilla.org/en-US/docs/Web/API/Document/getElementById) 返回 `null`。当你调用它的时候，如果document中此时没有指定ID的节点，就会这会发生这样的事。这里可能有以下几个原因：

1. 你搜索的这个ID和你在HTML文件里使用的ID不同。检查是否有输入错误！
2. 在HTML里，你的应用包里的 `<script>` 标签“看”不到任何在自身<b>之后</b>出现的DOM节点。

另一个常见的导致此错误的可能是输入了 `createRoot(<App />)` 而不是 `createRoot(domNode)`。

---

### 我得到了一个错误：“函数并不是有效的React子节点”。{/*im-getting-an-error-functions-are-not-valid-as-a-react-child*/}

这个错误表示你传给 `root.render` 不是一个React组件。

这可能是由于你在调用 `root.render` 时传入了 `Component`，而不是 `<Component />`：

```js {2,5}
// 🚩 错误： App 是一个函数，而非一个组件。
root.render(App);

// ✅ 正确： <App /> 是一个组件。
root.render(<App />);
````

或是你向 `root.render` 传递了一个函数，而不是这个函数执行的结果：

```js {2,5}
// 🚩 错误： createApp 是一个函数，而非一个组件。
root.render(createApp);

// ✅ 正确： 调用 createApp 返回一个组件。
root.render(createApp());
```

---

### 我服务端渲染的HTML又重新被创建了一遍 {/*my-server-rendered-html-gets-re-created-from-scratch*/}

如果你的应用是服务端渲染的，并且其中包含的初始HTML是由React生成的，你可能会注意到创建一个根并调用 `root.render`，会删除所有HTML，并且从头开始创建所有DOM节点。这会比较慢，并且会重置聚焦和滚动闻之，还会丢失用户的输入。

服务端渲染的应用必须使用 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot)，而不是 `createRoot`：

```js {1,4-7}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(
  document.getElementById('root'),
  <App />
);
```

注意这个API是不同的。特别地，通常这里不需要进一步地调用 `root.render`。
