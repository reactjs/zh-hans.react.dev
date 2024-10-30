---
title: <StrictMode>
---


<Intro>

`<StrictMode>` 帮助你在开发过程中尽早地发现组件中的常见错误。


```js
<StrictMode>
  <App />
</StrictMode>
```

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `<StrictMode>` {/*strictmode*/}

使用 `StrictMode` 来启用组件树内部的额外开发行为和警告：

```js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

[以下是更多的示例](#usage)。

严格模式启用了以下仅在开发环境下有效的行为：

- 组件将 [重新渲染一次](#fixing-bugs-found-by-double-rendering-in-development)，以查找由于非纯渲染而引起的错误。
- 组件将 [重新运行 Effect 一次](#fixing-bugs-found-by-re-running-effects-in-development)，以查找由于缺少 Effect 清理而引起的错误。
- 组件将被 [检查是否使用了已弃用的 API](#fixing-deprecation-warnings-enabled-by-strict-mode)。

#### 参数 {/*props*/}

`StrictMode` 不接受任何参数。

#### 注意事项 {/*caveats*/}

* 在由 `<StrictMode>` 包裹的树中，无法选择退出严格模式。这可以确保在 `<StrictMode>` 内的所有组件都经过检查。如果两个团队在一个产品上工作，并且对于这些检查是否有价值存在分歧，他们需要达成共识或将 `<StrictMode>` 下移到树的较低层级。

---

## 用法 {/*usage*/}

### 为整个应用启用严格模式 {/*enabling-strict-mode-for-entire-app*/}

严格模式为 `<StrictMode>` 组件内的整个组件树启用额外的开发环境检查，这些检查有助于在开发过程中尽早地发现组件中的常见错误。


如果要为整个应用启用严格模式，请在渲染根组件时使用 `<StrictMode>` 包裹它：

```js {6,8}
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

我们建议将整个应用程序包裹在严格模式中，特别是对于新创建的应用程序。如果你使用的是一个调用 [`createRoot`](/reference/react-dom/client/createRoot) 的框架，请查阅其文档以了解如何启用严格模式。

尽管严格模式的检查 **仅在开发环境** 下运行，但它们有助于找出已经存在于代码中但在生产环境中可能难以复现的错误。严格模式让你在用户反馈之前就可以修复这些错误。

<Note>

严格模式启用了以下仅在开发环境下有效的行为：

- 组件将 [重新渲染一次](#fixing-bugs-found-by-double-rendering-in-development)，以查找由于非纯渲染而引起的错误。
- 组件将 [重新运行 Effect 一次](#fixing-bugs-found-by-re-running-effects-in-development)，以查找由于缺少 Effect 清理而引起的错误。
- 组件将被 [检查是否使用了已弃用的 API](#fixing-deprecation-warnings-enabled-by-strict-mode)。

**所有这些检查仅在开发环境中进行，不会影响生产构建。**

</Note>

---

### 为应用程序的一部分启用严格模式 {/*enabling-strict-mode-for-a-part-of-the-app*/}

你也可以为应用程序的任意一部分启用严格模式：

```js {7,12}
import { StrictMode } from 'react';

function App() {
  return (
    <>
      <Header />
      <StrictMode>
        <main>
          <Sidebar />
          <Content />
        </main>
      </StrictMode>
      <Footer />
    </>
  );
}
```

在这个例子中，严格模式的检查不会对 `Header` 和 `Footer` 组件运行。然而，它们会在 `Sidebar` 和 `Content` 以及它们内部的所有组件上运行，无论多深。

---

### 修复在开发过程中通过双重渲染发现的错误 {/*fixing-bugs-found-by-double-rendering-in-development*/}

[React 假设编写的每个组件都是纯函数](/learn/keeping-components-pure)。这意味着编写的 React 组件在给定相同的输入（props、state 和 context）时必须始终返回相同的 JSX。

违反此规则的组件会表现得不可预测，并引发错误。为了帮助你找到意外的非纯函数代码，严格模式 **在开发环境中会调用一些函数两次**（仅限应为纯函数的函数）。这些函数包括：

- 组件函数体（仅限顶层逻辑，不包括事件处理程序内的代码）
- 传递给 [`useState`](/reference/react/useState)、[`set` 函数](/reference/react/useState#setstate)、[`useMemo`](/reference/react/useMemo) 或 [`useReducer`](/reference/react/useReducer) 的函数。
- 部分类组件的方法，例如 [`constructor`](/reference/react/Component#constructor)、[`render`](/reference/react/Component#render)、[`shouldComponentUpdate`](/reference/react/Component#shouldcomponentupdate) 等（[请参阅完整列表](https://reactjs.org/docs/strict-mode.html#detecting-unexpected-side-effects)）。

如果一个函数是纯函数，运行两次不会改变其行为，因为纯函数每次都会产生相同的结果。然而，如果一个函数是非纯函数（例如，它会修改接收到的数据），运行两次通常会产生明显的差异（这就是它是非纯函数的原因！）。这有助于及早发现并修复错误。

**下面是一个示例，用来说明严格模式中的双重渲染如何帮助你早期发现错误**。

下面的 `StoryTray` 组件接收一个 `stories` 数组，并在末尾添加一个额外的“创建故事”节点：

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```js src/App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "安琪的故事" },
  {id: 1, label: "泰勒的故事" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  const items = stories;
  items.push({ id: 'create', label: '创建故事' });
  return (
    <ul>
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

上面的代码中有一个错误，但很容易被忽视，因为初始输出看起来是正确的。

如果 `StoryTray` 组件重新渲染多次，这个错误将变得更加明显。例如，当鼠标悬停在 `StoryTray` 组件上时，以不同的背景颜色重新渲染它：

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

```js src/App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "安琪的故事" },
  {id: 1, label: "泰勒的故事" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js src/StoryTray.js active
import { useState } from 'react';

export default function StoryTray({ stories }) {
  const [isHover, setIsHover] = useState(false);
  const items = stories;
  items.push({ id: 'create', label: '创建故事' });
  return (
    <ul
      onPointerEnter={() => setIsHover(true)}
      onPointerLeave={() => setIsHover(false)}
      style={{
        backgroundColor: isHover ? '#ddd' : '#fff'
      }}
    >
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

注意，每次在 `StoryTray` 组件上悬停时，“创建故事”都会再次添加到列表中。代码的本意是将它添加到列表的末尾一次。但是，`StoryTray` 直接修改了传入的 `stories` 数组。每次 `StoryTray` 重新渲染时，它会再次将“创建故事”添加到相同的数组末尾。换句话说，`StoryTray` 不是一个纯函数——多次运行它会产生不同的结果。

为了解决这个问题，你可以创建数组的副本并修改该副本，而不是修改原始数组：

```js {2}
export default function StoryTray({ stories }) {
  const items = stories.slice(); // 复制数组
  // ✅ 正确的：在新数组上进行修改
  items.push({ id: 'create', label: 'Create Story' });
```

这样做会 [使 `StoryTray` 函数成为纯函数](/learn/keeping-components-pure)。每次调用函数时，它只会修改一个新的数组副本，不会影响任何外部对象或变量。这解决了错误，但在发现其行为有问题之前，你可能需要更频繁地使组件重新渲染。

**在原始的例子中，这个错误并不明显。现在让我们将原始有错误的代码包裹在 `<StrictMode>` 中**：

<Sandpack>

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "安琪的故事" },
  {id: 1, label: "泰勒的故事" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  const items = stories;
  items.push({ id: 'create', label: '创建故事' });
  return (
    <ul>
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

**严格模式始终会调用渲染函数两次**，这样可以帮助立即发现错误（“创建故事”出现两次）。这让开发者能够在早期阶段注意到此类错误。当修复组件以在严格模式下进行渲染时，也会修复许多可能的未来生产错误，例如之前的悬停功能：

<Sandpack>

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "安琪的故事" },
  {id: 1, label: "泰勒的故事" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js src/StoryTray.js active
import { useState } from 'react';

export default function StoryTray({ stories }) {
  const [isHover, setIsHover] = useState(false);
  const items = stories.slice(); // 复制数组
  items.push({ id: 'create', label: '创建故事' });
  return (
    <ul
      onPointerEnter={() => setIsHover(true)}
      onPointerLeave={() => setIsHover(false)}
      style={{
        backgroundColor: isHover ? '#ddd' : '#fff'
      }}
    >
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

在没有严格模式的情况下，在你添加了更多的重新渲染前很容易忽视这个错误。而严格模式立即显示了相同的错误。严格模式可以帮助你在将错误推送给团队和用户之前发现它们。

[更多请阅读《保持组件纯粹》](/learn/keeping-components-pure)。

<Note>

如果你已经安装了 [React DevTools](/learn/react-developer-tools)，在第二次渲染期间进行的任何 `console.log` 调用将会显示为稍微变暗的颜色。React DevTools 还提供了一个设置（默认情况下关闭），可以完全禁止显示这些日志。

</Note>

---

### 修复在开发中通过重新运行 Effect 发现的错误 {/*fixing-bugs-found-by-re-running-effects-in-development*/}

严格模式也可以帮助发现 [Effect](/learn/synchronizing-with-effects) 中的错误。

每个 Effect 都有一些 setup 和可能的 cleanup 函数。通常情况下，当组件挂载时，React 会调用 setup 代码；当组件卸载时，React 会调用 cleanup 代码。如果依赖关系在上一次渲染之后发生了变化，React 将再次调用 setup 代码和 cleanup 代码。

当开启严格模式时，React 还会在开发模式下为每个 Effect **额外运行一次 setup 和 cleanup 函数**。这可能会让人感到惊讶，但它有助于发现手动难以捕捉到的细微错误。

**下面是一个例子，用来说明在严格模式下重新运行 Effects 如何帮助你早期发现错误**。

参考以下将组件连接到聊天功能的示例：

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = '所有';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, []);
  return <h1>欢迎来到 {roomId} 聊天室！</h1>;
}
```

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // 实际的实现将会连接到服务器
  return {
    connect() {
      console.log('✅ 连接到 "' + roomId + '" 聊天室，位于' + serverUrl + '...');
      connections++;
      console.log('活跃连接数: ' + connections);
    },
    disconnect() {
      console.log('❌ 断开 "' + roomId + '" 聊天室，位于' + serverUrl);
      connections--;
      console.log('活跃连接数: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

这段代码存在一个问题，但可能并不明显。

为了更直观地展示这个问题，让我们实现一个功能。在下面的示例中，`roomId` 不是硬编码的，而是用户可以从下拉菜单中选择要连接的 `roomId`。点击“打开聊天”，然后依次选择不同的聊天室。在控制台中跟踪活跃连接的数量：

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, [roomId]);

  return <h1>欢迎来到 {roomId} 聊天室！</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('所有');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        选择聊天室：{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="所有">所有</option>
          <option value="旅游">旅游</option>
          <option value="音乐">音乐</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? '关闭聊天' : '打开聊天'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // 实际的实现将会连接到服务器
  return {
    connect() {
      console.log('✅ 连接到 "' + roomId + '" 聊天室，位于' + serverUrl + '...');
      connections++;
      console.log('活跃连接数: ' + connections);
    },
    disconnect() {
      console.log('❌ 断开 "' + roomId + '" 聊天室，位于' + serverUrl);
      connections--;
      console.log('活跃连接数: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

你会注意到打开的连接数量一直在增加。在真实的应用程序中，这会导致性能和网络问题。问题出在 [你的 Effect 缺少 cleanup 函数](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed)：

```js {4}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
```

现在你的 Effect 在自身执行清理并销毁过时的连接后，问题被解决了。但是请注意，在添加了更多功能（下拉框）之前，这个问题很难被发现。

**在原始的例子中，这个错误并不明显。现在让我们将原始有错误的代码包裹在 `<StrictMode>` 中**：

<Sandpack>

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = '所有';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, []);
  return <h1>欢迎来到 {roomId} 聊天室！</h1>;
}
```

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // 实际的实现将会连接到服务器
  return {
    connect() {
      console.log('✅ 连接到 "' + roomId + '" 聊天室，位于' + serverUrl + '...');
      connections++;
      console.log('活跃连接数: ' + connections);
    },
    disconnect() {
      console.log('❌ 断开 "' + roomId + '" 聊天室，位于' + serverUrl);
      connections--;
      console.log('活跃连接数: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

**在严格模式下，你立即就能看到存在问题**（活跃连接的数量增加到了2个）。严格模式会为每个 Effect 运行额外一次 setup + cleanup。这个 Effect 没有 cleanup 逻辑，所以它创建了一个额外的连接但没有销毁它。这是一个提示，你可能忘记了添加清理函数。

严格模式让你能够在开发过程的早期就发现这样的错误。当你在严格模式下通过添加清理函数来修复你的 Effect 时，你也同时修复了许多可能在未来的生产环境中出现的错误，比如之前的下拉框问题。

<Sandpack>

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>欢迎来到 {roomId} 聊天室！</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('所有');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        选择聊天室：{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="所有">所有</option>
          <option value="旅游">旅游</option>
          <option value="音乐">音乐</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? '关闭聊天' : '打开聊天'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // 实际的实现将会连接到服务器
  return {
    connect() {
      console.log('✅ 连接到 "' + roomId + '" 聊天室，位于' + serverUrl + '...');
      connections++;
      console.log('活跃连接数: ' + connections);
    },
    disconnect() {
      console.log('❌ 断开 "' + roomId + '" 聊天室，位于' + serverUrl);
      connections--;
      console.log('活跃连接数: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

请注意，控制台中活跃连接的数量不再持续增加。

在没有严格模式的情况下，很容易忽视你的 Effect 需要进行清理的情况。通过在开发中运行 *setup → cleanup → setup*，而不是仅运行 *setup*，严格模式使你更容易发现遗漏的 cleanup 逻辑。

[请阅读更多关于实现 Effect 清理的内容](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)。

---

### 修复严格模式发出的弃用警告 {/*fixing-deprecation-warnings-enabled-by-strict-mode*/}

React 会在任何一个位于 `<StrictMode>` 树中的组件使用以下弃用 API 时发出警告：

* [`findDOMNode`](/reference/react-dom/findDOMNode)，[请参考替代方案](https://reactjs.org/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)。
* `UNSAFE_` 类生命周期方法，例如 [`UNSAFE_componentWillMount`](/reference/react/Component#unsafe_componentwillmount)，[请参考替代方案](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#migrating-from-legacy-lifecycles)。
* 旧版上下文（[`childContextTypes`](/reference/react/Component#static-childcontexttypes)、[`contextTypes`](/reference/react/Component#static-contexttypes) 和 [`getChildContext`](/reference/react/Component#getchildcontext)），[请参考替代方案](/reference/react/createContext)。
* 旧版字符串引用（[`this.refs`](/reference/react/Component#refs)）,[请参考替代方案](https://reactjs.org/docs/strict-mode.html#warning-about-legacy-string-ref-api-usage)。

这些 API 主要用于旧版的 [类式组件](/reference/react/Component)，因此在新版程序中很少出现。
