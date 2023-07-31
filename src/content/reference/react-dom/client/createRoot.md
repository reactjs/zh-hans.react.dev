---
title: createRoot
---

<Intro>

`createRoot` 允许在浏览器的 DOM 节点中创建根节点以显示 React 组件。

```js
const root = createRoot(domNode, options?)
```

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `createRoot(domNode, options?)` {/*createroot*/}

调用 `createRoot` 以在浏览器 DOM 元素中创建根节点显示内容。

```js
import { createRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = createRoot(domNode);
```

React 将会为 `domNode` 创建一个根节点，并控制其中的 DOM。在已经创建根节点之后，需要调用 [`root.render`](#root-render) 来显示 React 组件：

```js
root.render(<App />);
```

对于一个完全用 React 构建的应用程序，通常会调用一个 `createRoot` 来创建它的根节点。而对于一个使用了“少量” React 来创建部分内容的应用程序，则要按具体需求来确定根节点的数量。

[参见下方更多示例](#usage)。

#### 参数 {/*parameters*/}

* `domNode`：一个 [DOM 元素](https：//developer.mozilla.org/zh-CN/docs/Web/API/Element)。React 将为这个 DOM 元素创建一个根节点然后允许你在这个根节点上调用函数，比如 `render` 来显示渲染的 React 内容。

* **可选** `options`：用于配置这个 React 根节点的对象。

  * **可选** `onRecoverableError`：回调函数，在 React 从异常错误中恢复时自动调用。
  * **可选** `identifierPrefix`：一个 React 用来配合 [`useId`](/reference/react/useId) 生成 id 的字符串前缀。在同一个页面上使用多个根节点的场景下，这将能有效避免冲突。

#### 返回值 {/*returns*/}

`createRoot` 返回一个带有两个方法的的对象，这两个方法是：[`render`](#root-render) 和 [`unmount`](#root-unmount)。

#### 注意 {/*caveats*/}
* 如果应用程序是服务端渲染的，那么不能使用 `createRoot()`。请使用 [`hydrateRoot()`](/reference/react-dom/client/hydrateRoot) 替代它。
* 在你的应用程序中，可能只调用了一次 `createRoot`。但如果你使用了框架，它可能已经自动帮你完成了这次调用。
* 当你想要渲染一段 JSX，但是它存在于 DOM 树的其他位置，并非当前组件的子组件时（比如，一个弹窗或者提示框），使用 [`createPortal`](/reference/react-dom/createPortal) 替代 `createRoot`。

---

### `root.render(reactNode)` {/*root-render*/}

调用 `root.render` 以将一段 [JSX](/learn/writing-markup-with-jsx)（“React 节点”）在 React 的根节点中渲染为 DOM 节点并显示。

```js
root.render(<App />);
```

React 将会在 `根节点` 中显示 `<App />` 组件，并且控制组件中的 DOM。

[参见下方更多示例](#usage)。

#### 参数 {/*root-render-parameters*/}

* `reactNode`：一个你想要显示的 **React 节点**。它总是一段 JSX，就像 `<App />`，但是你也总是可以传递一个 [`createElement()`](/reference/react/createElement) 构造的 React 元素、一个字符串、一个数字、`null` 或者 `undefined`。


#### 返回值 {/*root-render-returns*/}

`root.render` 返回 `undefined`。

#### 注意 {/*root-render-caveats*/}

* 首次调用 `root.render` 时，React 会先清空根节点中所有已经存在的 HTML，然后才会渲染 React 组件。

* 如果你的根节点包含了由 React 在构建期间通过服务端渲染生成的 HTML 内容，请使用 [`hydrateRoot()`](/reference/react-dom/client/hydrateRoot) 替代这个方法，这样才能把事件处理程序和现有的 HTML 绑定。

如果你在一个根节点上多次调用了 `render`，React 仍然会更新 DOM，这样才能保证显示的内容是最新的。React 将会筛选出可复用的部分和需要更新的部分，对于需要更新的部分，是 React 通过与之前渲染的树进行 [“比较”](/learn/preserving-and-resetting-state) 得到的。在同一个根节点上再次调用 `render` 就和在根节点上调用 [`set` 函数](/reference/react/useState#setstate) 类似：React 会避免没必要的 DOM 更新。

---

### `root.unmount()` {/*root-unmount*/}

调用 `root.unmount` 以销毁 React 根节点中的一个已经渲染的树。

```js
root.unmount();
```

通常情况下，一个完全由 React 构建的应用程序不会调用 `root.unmount`。

此方法适用的场景是，React 根节点中的 DOM 节点（或者它的任何一个父级节点）被除了这个方法以外的代码移除了。举个例子，试想在一个 jQuery 选项卡面板中，非活跃状态的选项卡的 DOM 结构将被移除。一个标签页被移除时，它内部的所有内容（包括 React 根节点）也将会从 DOM 树移除。在这种情况下，你才需要调用 `root.unmount` 来通知 React “停止”控制已经被移除的根节点的内容。否则，被移除的根节点的内部组件就不能及时释放消息订阅等资源。

调用 `root.unmout` 将卸载根节点内的所有组件，该根节点上的 React 将被剥离，即所有事件处理程序以及组件树上的状态将被移除。

#### 参数 {/*root-unmount-parameters*/}

`root.unmount` 不接收任何参数。


#### 返回值 {/*root-unmount-returns*/}

`root.unmount` 返回 `undefined`。

#### 注意事项 {/*root-unmount-caveats*/}

* 调用 `root.unmout` 将卸载根节点内的所有组件，该根节点上的 React 将被剥离，即所有事件处理程序以及组件树上的状态将被移除。

* 一旦调用 `root.unmout`，就不能在该根节点上调用 `root.render`。在一个已经卸载的根节点上尝试调用 `root.render` 将会抛出异常错误信息“无法更新一个未挂载的根节点（Cannot update an unmouted root）”。不过，你可以在卸载一个根节点后又重新创建它。

---

## 用法 {/*usage*/}

### 渲染一个完全由 React 构建的应用 {/*rendering-an-app-fully-built-with-react*/}

如果应用程序是完全由 React 构建的，那么请为整个应用程序创建全局唯一的一个根节点。

```js [[1, 3, "document.getElementById('root')"], [2, 4, "<App />"]]
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

通常情况下，在项目启动阶段，你只需要运行下面的代码。它将会：

1. 获取 HTML 中定义的<CodeStep step={1}>DOM 节点</CodeStep>。
2. 在该 DOM 节点中显示 <CodeStep step={2}>React 组件</CodeStep>。

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <!-- 这就是我们提到的 DOM 节点 -->
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
      <h1>你好，世界!</h1>
      <Counter />
    </>
  );
}

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      点击了 {count} 次
    </button>
  );
}
```

</Sandpack>

**如果你的应用程序完全由 React 构建，你仅应该创建全局唯一的一个根节点，并只调用一次 [`root.render`](#root-render)**。

从这时起，React 将会控制整个应用程序的 DOM。如果要添加更多组件，[可以将它们嵌套进 `App` 组件中](/learn/importing-and-exporting-components)。如果你需要更新视图，每一个组件都可以通过使用 [state](/reference/react/useState) 做到这一点。如果你需要额外显示一些在这个 DOM 节点之外的内容，比如一个弹窗或者提示框，那么可以 [使用 portal 进行渲染](/reference/react-dom/createPortal)。

<Note>

当 HTML 为空时，用户将会看一个空白的页面，直到应用程序中的 JavaScript 代码加载并运行：

```html
<div id="root"></div>
```

这个过程太慢了！要解决这个问题，可以在 [服务端或者应用构建期间](/reference/react-dom/server) 通过组件生成一些初始 HTML。这样一来，在 JavaScript 加载之前，用户就能看到一些文字、图片，也能点击链接。我们推荐 [使用框架](/learn/start-a-new-react-project#production-grade-react-frameworks)，通过框架开箱即用的能力轻易地完成这个优化。根据框架运行的时机，分为 **服务端渲染（SSR）** 和 **静态站点生成（SSG）**。

</Note>

<Pitfall>

**使用了服务端渲染或者静态站点生成的应用程序，必须调用 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) 而不是 `createRoot`**。调用后，React 将会 **hydrate** HTML 中的 DOM 节点，而不是销毁后重新创建它们。

</Pitfall>

---

### 渲染一个部分由 React 构建的应用 {/*rendering-a-page-partially-built-with-react*/}

如果页面 [不完全是 React 构建的](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page)，可以多次调用 `createRoot` 为每一个由 React 管理的顶级视图片段，即一段 DOM 中的顶级节点，创建一个根节点。可以在每一个根节点中调用 [`root.render`](#root-render) 来显示不同的内容。

这样依赖，两个不同的 React 组件分别在同一个文件 `index.html` 内定义的两个 DOM 节点中被渲染：

<Sandpack>

```html public/index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <nav id="navigation"></nav>
    <main>
      <p>这一段不会被 React 渲染（可以打开 index.html 验证这一点）。</p>
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
      <Comment text="你好!" author="Sophie" />
      <Comment text="最近怎么样?" author="Sunil" />
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

也可以通过 [`document.createElement()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/createElement) 创建一个新的 DOM 节点然后手动将其加入页面文档之中。


```js
const domNode = document.createElement('div');
const root = createRoot(domNode); 
root.render(<Comment />);
document.body.appendChild(domNode); // 你可以把它加入到页面文档的任何位置
```

调用 [`root.unmount`](#root-unmount) 将从 DOM 节点移除这个 React 树并清除它使用的资源。

```js
root.unmount();
```

如果 React 组件处于一个由不同框架构建的应用程序之中时，那么这个方法将会非常有用。

---

### 更新一个根组件 {/*updating-a-root-component*/}

可以在同一个根节点上多次调用 `render`。只要当前的组件树结构与之前渲染的结果是一致的，React 将会 [保存 state](/learn/preserving-and-resetting-state)。仔细思考一下，为什么能在输入框中正常输入？正如下方的示例，在每一秒中内多次重复调用 `render` 后发生的更新，是非破坏性的：

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
      <h1>你好，世界！{counter}</h1>
      <input placeholder="在这里输入一些内容" />
    </>
  );
}
```

</Sandpack>

多次调用 `render` 是一个不常见的事情。通常情况下，你的组件将通过 [更新 state](/reference/react/useState) 达到同样的效果。

---
## 错误排查 {/*troubleshooting*/}

### 我已经创建了一个根节点，但是页面没有显示任何内容 {/*ive-created-a-root-but-nothing-is-displayed*/}

确保你没有忘记在根节点上 **渲染** 你的应用程序：

```js {5}
import { createRoot } from 'react-dom/client';
import App from './App.js';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

在你进行渲染之前，页面不会显示任何内容。

---

### 我得到了一个异常报错信息：“目标容器不是一个 DOM 元素（Target container is not a DOM element）” {/*im-getting-an-error-target-container-is-not-a-dom-element*/}

这个异常错误即字面意思，你传递给 `createRoot` 的内容不是一个 DOM 元素。

如果你不确定发生了什么，试着在控制台打印它：

```js {2}
const domNode = document.getElementById('root');
console.log(domNode); // ？？？
const root = createRoot(domNode);
root.render(<App />);
```
举个例子，如果 `domNode` 是 `null`，代表着 [`getElementById`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/getElementById) 返回了 `null`。这意味着你在调用这个方法的时候，页面文档内并不存在指定的 id 对应的元素，于是就出现了这个问题。这里有一些可能的原因：


1. 你使用的 id 可能和 HTML 文件中的 id 不同。请检查一下你的拼写是否正确！
2. 打包构建产物的 HTML 文件中的 `<script>` 标签，不能感知到在它执行 **之后** 才出现的 DOM 节点。

触发这个异常报错的另一个常见方式是，将 `createRoot(domNode)` 错写成 `createRoot(<App />)`。

---

### 我得到了一个异常报错信息：“函数不是合法的 React 子项（Functions are not valid as a React child）” {/*im-getting-an-error-functions-are-not-valid-as-a-react-child*/}

这个错误意味着，你传递给 `root.render` 的内容不是一个 React 组件。

这可能发生在你使用 `Component` 而不是 `<Component />` 作为参数对 `root.render` 进行调用时：

```js {2,5}
// 🚩 错误方式：App 是一个函数，不是一个组件。
root.render(App);

// ✅ 正确方式：<App /> 是一个组件。
root.render(<App />);
```

或者你向 `root.render` 传递了一个函数本身，而不是其返回值：

```js {2,5}
// 🚩 错误方式：createApp 是一个函数，不是一个组件。
root.render(createApp);

// ✅ 正确方式：使用 createApp 执行后返回的组件。
root.render(createApp());
```

---

### 我的服务端渲染的 HTML 在更新时会全部重新创建 {/*我的服务端渲染的-html-在更新时会全部重新创建*/}

如果你的应用程序是服务端渲染的，并且包含了由 React 生成的初始 HTML，你可能会注意到，在创建一个根节点后调用 `root.render` 时会删除所有初始 HTML，然后重新生成所有 DOM 节点。这可能会让你的应用变得比客户端渲染更慢，并且在用户输入失去焦点和滑动滚动条时丢失用户输入的内容。

服务端渲染的应用程序必须使用 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) 替代 `createRoot`：

```js {1,4-7}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(
  document.getElementById('root'),
  <App />
);
```

请注意，服务端渲染的 API 是不同的。特别注意，在通常情况下，不会再有 `root.render` 调用。
