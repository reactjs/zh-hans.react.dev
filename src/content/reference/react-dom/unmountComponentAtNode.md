---
title: unmountComponentAtNode
---

<Deprecated>

此 API 将在未来的 React 主要版本中被移除。

在 React 18, `unmountComponentAtNode` 已被 [`root.unmount()`](/reference/react-dom/client/createRoot#root-unmount) 取代。

</Deprecated>

<Intro>

`unmountComponentAtNode` 用于从 DOM 中移除一个已挂载的 React 组件。

```js
unmountComponentAtNode(domNode)
```

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `unmountComponentAtNode(domNode)` {/*unmountcomponentatnode*/}

使用 `unmountComponentAtNode` 从 DOM 中移除一个已挂载的 React 组件，并清除相关事件处理程序与状态。

```js
import { unmountComponentAtNode } from 'react-dom';

const domNode = document.getElementById('root');
render(<App />, domNode);

unmountComponentAtNode(domNode);
```

[参见下面更多示例](#usage)。

#### 参数 {/*parameters*/}

* `domNode`：[DOM 节点](https://developer.mozilla.org/zh-CN/docs/Web/API/Element)。React 将从此节点移除已挂载的 React 组件。

#### 返回值 {/*returns*/}

如果 `unmountComponentAtNode` 成功移除对应的组件，将返回 `true`，否则返回 `false`。

---

## 用法 {/*usage*/}

使用 `unmountComponentAtNode` 从 <CodeStep step={2}>浏览器 DOM 节点</CodeStep> 中移除 <CodeStep step={1}>已挂载的 React 组件</CodeStep>，并清除有关事件处理程序与状态。

```js [[1, 5, "<App />"], [2, 5, "rootNode"], [2, 8, "rootNode"]]
import { render, unmountComponentAtNode } from 'react-dom';
import App from './App.js';

const rootNode = document.getElementById('root');
render(<App />, rootNode);

// ...
unmountComponentAtNode(rootNode);
```


### 从 DOM 节点移除 React 应用程序 {/*removing-a-react-app-from-a-dom-element*/}

有时你可能希望在一个已有的页面上添加一些 React 元素，或在一个没有完全使用 React 编写的页面上使用 React。在这些情况下，你可能需要从相关的 DOM 节点上移除所有 UI、状态和监听器，来“停止”React 应用程序。

在这个例子中，点击“渲染 React 应用程序”将会渲染一个 React 应用程序；而点击“卸载 React 应用程序”将会销毁它：

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <button id='render'>渲染 React 应用程序</button>
    <button id='unmount'>卸载 React 应用程序</button>
    <!-- This is the React App node -->
    <div id='root'></div>
  </body>
</html>
```

```js index.js active
import './styles.css';
import { render, unmountComponentAtNode } from 'react-dom';
import App from './App.js';

const domNode = document.getElementById('root');

document.getElementById('render').addEventListener('click', () => {
  render(<App />, domNode);
});

document.getElementById('unmount').addEventListener('click', () => {
  unmountComponentAtNode(domNode);
});
```

```js App.js
export default function App() {
  return <h1>你好，世界！</h1>;
}
```

</Sandpack>
