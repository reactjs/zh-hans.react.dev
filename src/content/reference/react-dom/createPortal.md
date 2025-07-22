---
title: createPortal
---

<Intro>

`createPortal` 允许你将 JSX 作为 children 渲染至 DOM 的不同部分。


```js
<div>
  <SomeComponent />
  {createPortal(children, domNode, key?)}
</div>
```

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `createPortal(children, domNode, key?)` {/*createportal*/}

调用 `createPortal` 创建 portal，并传入 JSX 与实际渲染的目标 DOM 节点：

```js
import { createPortal } from 'react-dom';

// ...

<div>
  <p>这个子节点被放置在父节点 div 中。</p>
  {createPortal(
    <p>这个子节点被放置在 document body 中。</p>,
    document.body
  )}
</div>
```

[参见下方更多示例](#usage)。

portal 只改变 DOM 节点的所处位置。在其他方面，渲染至 portal 的 JSX 的行为表现与作为 React 组件的子节点一致。该子节点可以访问由父节点树提供的 context 对象、事件将从子节点依循 React 树冒泡到父节点。

#### 参数 {/*parameters*/}

* `children`：React 可以渲染的任何内容，如 JSX 片段（`<div />` 或 `<SomeComponent />` 等等）、[Fragment](/reference/react/Fragment)（`<>...</>`）、字符串或数字，以及这些内容构成的数组。

* `domNode`：某个已经存在的 DOM 节点，例如由 `document.getElementById()` 返回的节点。在更新过程中传递不同的 DOM 节点将导致 portal 内容被重建。

* **可选参数** `key`：用作 portal [key](/learn/rendering-lists#keeping-list-items-in-order-with-key) 的独特字符串或数字。

#### 返回值 {/*returns*/}

`createPortal` 返回一个可以包含在 JSX 中或从 React 组件中返回的 React 节点。如果 React 在渲染输出中遇见它，它将把提供的 `children` 放入提供的 `domNode` 中。

#### 警告 {/*caveats*/}

* portal 中的事件传播遵循 React 树而不是 DOM 树。例如点击 `<div onClick>` 内部的 portal，将触发 `onClick` 处理程序。如果这会导致意外的问题，请在 portal 内部停止事件传播，或将 portal 移动到 React 树中的上层。

---

## 用法 {/*usage*/}

### 渲染到 DOM 的不同部分 {/*rendering-to-a-different-part-of-the-dom*/}

*portal* 允许组件将它们的某些子元素渲染到 DOM 中的不同位置。这使得组件的一部分可以“逃脱”它所在的容器。例如组件可以在页面其余部分上方或外部显示模态对话框和提示框。

调用 `createPortal` 并传入 <CodeStep step={1}>JSX</CodeStep> 与 <CodeStep step={2}> 应该放置的 DOM 节点</CodeStep> 作为参数，然后渲染返回值以创建 portal：

```js [[1, 8, "<p>这个子节点被放置在 document body 中。</p>"], [2, 9, "document.body"]]
import { createPortal } from 'react-dom';

function MyComponent() {
  return (
    <div style={{ border: '2px solid black' }}>
      <p>这个子节点被放置在父节点 div 中。</p>
      {createPortal(
        <p>这个子节点被放置在 document body 中。</p>,
        document.body
      )}
    </div>
  );
}
```

React 将 <CodeStep step={1}>传递的 JSX</CodeStep> 对应的 DOM 节点放入 <CodeStep step={2}>提供的 DOM 节点</CodeStep> 中。

如果没有 portal，第二个 `<p>` 将放置在父级 `<div>` 中，但 portal 会将其“传送”到 [`document.body`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/body) 中：

<Sandpack>

```js
import { createPortal } from 'react-dom';

export default function MyComponent() {
  return (
    <div style={{ border: '2px solid black' }}>
      <p>这个子节点被放置在父节点 div 中。</p>
      {createPortal(
        <p>这个子节点被放置在 document body 中。</p>,
        document.body
      )}
    </div>
  );
}
```

</Sandpack>

请注意，第二个段落在视觉上出现在带有边框的父级 `<div>` 之外。如果你使用开发者工具检查 DOM 结构，会发现第二个 `<p>` 直接放置在 `<body>` 中：

```html {4-6,9}
<body>
  <div id="root">
    ...
      <div style="border: 2px solid black">
        <p>这个子节点被放置在父节点 div 中。</p>
      </div>
    ...
  </div>
  <p>这个子节点被放置在 document body 中。</p>
</body>
```

portal 只改变 DOM 节点的所处位置。在其他方面，portal 中的 JSX 将作为实际渲染它的 React 组件的子节点。该子节点可以访问由父节点树提供的 context 对象、事件将仍然从子节点冒泡到父节点树。

---

### 使用 portal 渲染模态对话框 {/*rendering-a-modal-dialog-with-a-portal*/}

你可以使用 portal 创建一个浮动在页面其余部分之上的模态对话框，即使呼出对话框的组件位于带有 `overflow: hidden` 或其他干扰对话框样式的容器中。

在此示例中，这两个容器具有破坏模态对话框的样式，但是渲染到 portal 中的容器不受影响，因为在 DOM 中，模态对话框不包含在父 JSX 元素内部。

<Sandpack>

```js src/App.js active
import NoPortalExample from './NoPortalExample';
import PortalExample from './PortalExample';

export default function App() {
  return (
    <>
      <div className="clipping-container">
        <NoPortalExample  />
      </div>
      <div className="clipping-container">
        <PortalExample />
      </div>
    </>
  );
}
```

```js src/NoPortalExample.js
import { useState } from 'react';
import ModalContent from './ModalContent.js';

export default function NoPortalExample() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        不使用 portal 展示模态（modal）
      </button>
      {showModal && (
        <ModalContent onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
```

```js src/PortalExample.js active
import { useState } from 'react';
import { createPortal } from 'react-dom';
import ModalContent from './ModalContent.js';

export default function PortalExample() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        使用 portal 展示模态（motal）
      </button>
      {showModal && createPortal(
        <ModalContent onClose={() => setShowModal(false)} />,
        document.body
      )}
    </>
  );
}
```

```js src/ModalContent.js
export default function ModalContent({ onClose }) {
  return (
    <div className="modal">
      <div>这是一个模态对话框</div>
      <button onClick={onClose}>关闭</button>
    </div>
  );
}
```


```css src/styles.css
.clipping-container {
  position: relative;
  border: 1px solid #aaa;
  margin-bottom: 12px;
  padding: 12px;
  width: 250px;
  height: 80px;
  overflow: hidden;
}

.modal {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  box-shadow: rgba(100, 100, 111, 0.3) 0px 7px 29px 0px;
  background-color: white;
  border: 2px solid rgb(240, 240, 240);
  border-radius: 12px;
  position:  absolute;
  width: 250px;
  top: 70px;
  left: calc(50% - 125px);
  bottom: 70px;
}
```

</Sandpack>

<Pitfall>

使用 portal 时，确保应用程序的无障碍性非常重要。例如，你可能需要管理键盘焦点，以便用户可以自然进出 portal。

创建模态对话框时，请遵循 [WAI-ARIA 模态实践指南](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal)。如果你使用了社区包，请确保它具有无障碍性，并遵循这些指南。

</Pitfall>

---

### 将 React 组件渲染到非 React 服务器标记中 {/*rendering-react-components-into-non-react-server-markup*/}

如果静态或服务端渲染的网站中只有某一部分使用 React，则 portal 可能非常有用。如果你的页面使用 Rails 等服务端框架构建，则可以在静态区域（例如侧边栏）中创建交互区域。与拥有 [多个独立的 React 根](/reference/react-dom/client/createRoot#rendering-a-page-partially-built-with-react) 相比，portal 将应用程序视为一个单一的 React 树，即使它的部分在 DOM 的不同部分渲染，也可以共享状态。

<Sandpack>

```html public/index.html
<!DOCTYPE html>
<html>
  <head><title>我的应用程序</title></head>
  <body>
    <h1>我的网站一部分使用了 React，另外一部分没有使用</h1>
    <div class="parent">
      <div class="sidebar">
        这是一个非 React 服务器标记
        <div id="sidebar-content"></div>
      </div>
      <div id="root"></div>
    </div>
  </body>
</html>
```

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js active
import { createPortal } from 'react-dom';

const sidebarContentEl = document.getElementById('sidebar-content');

export default function App() {
  return (
    <>
      <MainContent />
      {createPortal(
        <SidebarContent />,
        sidebarContentEl
      )}
    </>
  );
}

function MainContent() {
  return <p>这一部分是被 React 渲染的。</p>;
}

function SidebarContent() {
  return <p>这一部分也是被 React 渲染的！</p>;
}
```

```css
.parent {
  display: flex;
  flex-direction: row;
}

#root {
  margin-top: 12px;
}

.sidebar {
  padding:  12px;
  background-color: #eee;
  width: 200px;
  height: 200px;
  margin-right: 12px;
}

#sidebar-content {
  margin-top: 18px;
  display: block;
  background-color: white;
}

p {
  margin: 0;
}
```

</Sandpack>

---

### 将 React 组件渲染到非 React DOM 节点 {/*rendering-react-components-into-non-react-dom-nodes*/}

你还可以使用 portal 来管理在 React 之外管理的 DOM 节点的内容。假设你正在集成非 React 地图小部件，并且想要在弹出窗口中渲染 React 内容，那么可以声明一个 `popupContainer` state 变量来存储要渲染到的目标 DOM 节点：

```js
const [popupContainer, setPopupContainer] = useState(null);
```

在创建第三方小部件时，存储由小部件返回的 DOM 节点，以便可以将内容渲染到其中：

```js {5-6}
useEffect(() => {
  if (mapRef.current === null) {
    const map = createMapWidget(containerRef.current);
    mapRef.current = map;
    const popupDiv = addPopupToMapWidget(map);
    setPopupContainer(popupDiv);
  }
}, []);
```

这样，一旦 `popupContainer` 可用，就可以使用 `createPortal` 将 React 内容渲染到其中：

```js {3-6}
return (
  <div style={{ width: 250, height: 250 }} ref={containerRef}>
    {popupContainer !== null && createPortal(
      <p>来自 React 的你，你好！</p>,
      popupContainer
    )}
  </div>
);
```

以下是一个完整的示例，你可以尝试一下：

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "leaflet": "1.9.1",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { createMapWidget, addPopupToMapWidget } from './map-widget.js';

export default function Map() {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [popupContainer, setPopupContainer] = useState(null);

  useEffect(() => {
    if (mapRef.current === null) {
      const map = createMapWidget(containerRef.current);
      mapRef.current = map;
      const popupDiv = addPopupToMapWidget(map);
      setPopupContainer(popupDiv);
    }
  }, []);

  return (
    <div style={{ width: 250, height: 250 }} ref={containerRef}>
      {popupContainer !== null && createPortal(
        <p>来自 React 的你，你好！</p>,
        popupContainer
      )}
    </div>
  );
}
```

```js src/map-widget.js
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';

export function createMapWidget(containerDomNode) {
  const map = L.map(containerDomNode);
  map.setView([0, 0], 0);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map);
  return map;
}

export function addPopupToMapWidget(map) {
  const popupDiv = document.createElement('div');
  L.popup()
    .setLatLng([0, 0])
    .setContent(popupDiv)
    .openOn(map);
  return popupDiv;
}
```

```css
button { margin: 5px; }
```

</Sandpack>
