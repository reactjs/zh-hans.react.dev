---
title: 脱围机制（Escape Hatches）
---

<Intro>

有些组件可能需要控制和同步 React 之外的系统。例如，你可能需要使用浏览器 API 聚焦输入框，或者在没有 React 的情况下实现视频播放器，或者连接并监听远程服务器的消息。在本章中，你将学习到一些脱围机制，让你可以“走出” React 并连接到外部系统。大多数应用逻辑和数据流不应该依赖这些功能。

</Intro>

<YouWillLearn isChapter={true}>

* [在不重新渲染的情况下“记住”信息](/learn/referencing-values-with-refs)
* [访问 React 管理的 DOM 元素](/learn/manipulating-the-dom-with-refs)
* [将组件与外部系统同步](/learn/synchronizing-with-effects)
* [从组件中删除不必要的 Effect](/learn/you-might-not-need-an-effect)
* [Effect 的生命周期与组件的生命周期有何不同](/learn/lifecycle-of-reactive-effects)
* [防止某些值重新触发 Effect](/learn/separating-events-from-effects)
* [减少 Effect 重新执行的频率](/learn/removing-effect-dependencies)
* [在组件之间共享逻辑](/learn/reusing-logic-with-custom-hooks)

</YouWillLearn>

## 使用 ref 引用值 {/*referencing-values-with-refs*/}

当你希望组件“记住”某些信息，但又不想让这些信息 [触发新的渲染](/learn/render-and-commit) 时，你可以使用 **ref**：

```js
const ref = useRef(0);
```

与 state 一样，ref 在重新渲染之间由 React 保留。但是，设置 state 会重新渲染组件，而更改 ref 不会！你可以通过 `ref.current` 属性访问该 ref 的当前值。

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('你点击了 ' + ref.current + ' 次!');
  }

  return (
    <button onClick={handleClick}>
      点我！
    </button>
  );
}
```

</Sandpack>

ref 就像组件的一个不被 React 追踪的秘密口袋。例如，可以使用 ref 来存储 [timeout ID](https://developer.mozilla.org/zh-CN/docs/Web/API/setTimeout#return_value)、[DOM 元素](https://developer.mozilla.org/zh-CN/docs/Web/API/Element) 和其他不影响组件渲染输出的对象。

<LearnMore path="/learn/referencing-values-with-refs">

阅读 **[使用 ref 引用值](/learn/referencing-values-with-refs)** 以了解如何使用 ref 来记住信息。

</LearnMore>

## 使用 ref 操作 DOM {/*manipulating-the-dom-with-refs*/}

由于 React 会自动更新 [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction) 以匹配渲染输出，因此组件通常不需要操作 DOM。但是，有时可能需要访问由 React 管理的 DOM 元素——例如聚焦节点、滚动到此节点，以及测量它的尺寸和位置。React 没有内置的方法来执行此类操作，所以需要一个指向 DOM 节点的 ref 来实现。例如，点击按钮将使用 ref 聚焦输入框：

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        聚焦输入框
      </button>
    </>
  );
}
```

</Sandpack>

<LearnMore path="/learn/manipulating-the-dom-with-refs">

阅读 **[使用 ref 操作 DOM](/learn/manipulating-the-dom-with-refs)** 以了解如何访问 React 管理的 DOM 元素。

</LearnMore>

## 使用 Effect 进行同步 {/*synchronizing-with-effects*/}

有些组件需要与外部系统同步。例如，可能需要根据 React 状态控制非 React 组件、设置服务器连接或在组件出现在屏幕上时发送分析日志。与处理特定事件的事件处理程序不同，**Effect** 在渲染后运行一些代码。使用它将组件与 React 之外的系统同步。

多按几次播放/暂停，观察视频播放器如何与 `isPlaying` 属性值保持同步：

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying]);

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? '暂停' : '播放'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

许多 Effect 也会自行“清理”。例如，与聊天服务器建立连接的 Effect 应该返回一个 **cleanup 函数**，告诉 React 如何断开组件与该服务器的连接：

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>欢迎前来聊天！</h1>;
}
```

```js src/chat.js
export function createConnection() {
  // 真正的实现实际上会连接到服务器
  return {
    connect() {
      console.log('✅ 连接中...');
    },
    disconnect() {
      console.log('❌ 断开连接。');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
```

</Sandpack>

在开发环境中，React 将立即运行并额外清理一次 Effect。这就是为什么你会看到 `"✅ 连接中..."` 打印了两次。这能够确保你不会忘记实现清理功能。

<LearnMore path="/learn/synchronizing-with-effects">

阅读 **[使用 Effect 进行同步](/learn/synchronizing-with-effects)** 以了解如何将组件与外部系统同步。

</LearnMore>

## 你可能不需要 Effect {/*you-might-not-need-an-effect*/}

Effect 是 React 范式中的一种脱围机制。它们可以“逃出” React 并使组件和一些外部系统同步。如果没有涉及到外部系统（例如，需要根据一些 props 或 state 的变化来更新一个组件的 state），不应该使用 Effect。移除不必要的 Effect 可以让代码更容易理解，运行得更快，并且更少出错。

有两种常见的不必使用 Effect 的情况：
- **不必为了渲染而使用 Effect 来转换数据。**
- **不必使用 Effect 来处理用户事件。**

例如，不需要 Effect 来根据其他状态调整某些状态：

```js {expectedErrors: {'react-compiler': [8]}} {5-9}
function Form() {
  const [firstName, setFirstName] = useState('泰勒');
  const [lastName, setLastName] = useState('斯威夫特');

  // 🔴 避免：多余的 state 和不必要的 Effect
  const [fullName, setFullName] = useState('');
  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);
  // ...
}
```

相反，在渲染时进行尽可能多地计算：

```js {4-5}
function Form() {
  const [firstName, setFirstName] = useState('泰勒');
  const [lastName, setLastName] = useState('斯威夫特');
  // ✅ 非常好：在渲染期间进行计算
  const fullName = firstName + ' ' + lastName;
  // ...
}
```

<<<<<<< HEAD
你 **的确** 可以使用 Effect 来和外部系统同步。
=======
However, you *do* need Effects to synchronize with external systems.
>>>>>>> e377252563aaec455d98f0c325ec989bef09065e

<LearnMore path="/learn/you-might-not-need-an-effect">

阅读 **[你可能不需要 Effect](/learn/you-might-not-need-an-effect)** 以了解如何移除不必要的 Effect。

</LearnMore>

## 响应式 Effect 的生命周期 {/*lifecycle-of-reactive-effects*/}

Effect 的生命周期不同于组件。组件可以挂载、更新或卸载。Effect 只能做两件事：开始同步某些东西，然后停止同步它。如果 Effect 依赖于随时间变化的 props 和 state，这个循环可能会发生多次。

这个 Effect 依赖于 `roomId` props 的值。props 是 **响应值**，这意味着它们可以在重新渲染时改变。注意，如果 `roomId` 更改，Effect 将会 **重新同步**（并重新连接到服务器）：

<Sandpack>

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

  return <h1>欢迎来到 {roomId} 房间！</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        选择聊天室：{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">所有</option>
          <option value="travel">旅游</option>
          <option value="music">音乐</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // 真正的实现实际上会连接到服务器
  return {
    connect() {
      console.log('✅ 连接到 "' + roomId + '" 房间，在' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ 断开 "' + roomId + '" 房间，在' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

React 提供了检查工具规则来检查是否正确地指定了 Effect 的依赖项。如果忘记在上述示例的依赖项列表中指定 `roomId`，检查工具会自动找到该错误。

<LearnMore path="/learn/lifecycle-of-reactive-effects">

阅读 **[响应式 Effect 的生命周期](/learn/lifecycle-of-reactive-effects)** 以了解 Effect 的生命周期与组件的生命周期有何不同。

</LearnMore>

## 将事件从 Effect 中分开 {/*separating-events-from-effects*/}

事件处理程序仅在再次执行相同的交互时重新运行。与事件处理程序不同，如果 Effect 读取的任何值（如 props 或 state）与上次渲染期间不同，则会重新同步。有时，需要混合两种行为：Effect 重新运行以响应某些值而不是其他值。

Effect 中的所有代码都是 **响应式的**。如果它读取的某些响应式的值由于重新渲染而发生变化，它将再次运行。例如，如果 `roomId` 或 `theme` 发生变化，这个 Effect 将重新连接到聊天：

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('已连接！', theme);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, theme]);

  return <h1>欢迎来到 {roomId} 房间！</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('所有');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        选择聊天室：{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">所有</option>
          <option value="travel">旅游</option>
          <option value="music">音乐</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        使用深色主题
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // 真正的实现实际上会连接到服务器
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('不能添加处理程序两次。');
      }
      if (event !== 'connected') {
        throw Error('仅支持“已连接”事件。');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

这并不理想。因为仅当 `roomId` 已更改时，才想重新连接到聊天，所以切换 `theme` 不应该重新连接到聊天！考虑将读取 `theme` 的代码从 Effect 移到 **Effect Event** 中：

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('已连接！', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>欢迎来到 {roomId} 房间！</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('所有');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        选择聊天室：{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">所有</option>
          <option value="travel">旅游</option>
          <option value="music">音乐</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        使用深色主题
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // 真正的实现实际上会连接到服务器
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('不能添加处理程序两次。');
      }
      if (event !== 'connected') {
        throw Error('仅支持“已连接”事件。');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js src/notifications.js hidden
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

Effect Events 中的代码不是响应式的，因此更改“主题”不再使 Effect 重新连接。

<LearnMore path="/learn/separating-events-from-effects">

阅读 **[将事件从 Effect 中分开](/learn/separating-events-from-effects)**，了解如何防止某些值重新触发 Effect。

</LearnMore>

## 移除 Effect 依赖 {/*removing-effect-dependencies*/}

当你写 Effect 时，代码检查器会验证是否已经将 Effect 读取的每一个响应式值（如 props 和 state）包含在 Effect 的依赖列表中。这可以确保 Effect 与组件的 props 和 state 保持同步。不必要的依赖关系可能会导致 Effect 运行过于频繁，甚至产生无限循环。删除它们的方式取决于具体情况。

例如，这个 Effect 依赖于每次编辑输入时都会重新创建的 `options` 对象：

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);

  return (
    <>
      <h1>欢迎来到 {roomId} 房间！</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('所有');
  return (
    <>
      <label>
        选择聊天室：{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // 真正的实现实际上会连接到服务器
  return {
    connect() {
      console.log('✅ 连接到 "' + roomId + '" 房间，在' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ 断开 "' + roomId + '" 房间，在' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

你不希望每次开始在聊天中输入消息时聊天都重新连接。要解决这个问题，你应该在 Effect 中创建 `options` 对象，使得 Effect 仅依赖于 `roomId` 字符串：

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>欢迎来到 {roomId} 房间！</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('所有');
  return (
    <>
      <label>
        选择聊天室：{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">所有</option>
          <option value="travel">旅游</option>
          <option value="music">音乐</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // 真正的实现实际上会连接到服务器
  return {
    connect() {
      console.log('✅ 连接到 "' + roomId + '" 房间，在' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ 断开 "' + roomId + '" 房间，在' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

请注意，你并没有通过编辑依赖项列表来删除 `options`  依赖项，那是错误的。相反，你更改了周围的代码，使依赖关系变得 **不必要**。将依赖关系列表视为 Effect 代码使用的所有响应值的列表。不必刻意选择把什么放在该列表中。该列表描述了你的代码。要改变依赖性列表，请改变代码。

<LearnMore path="/learn/removing-effect-dependencies">

阅读 **[移除 Effect 依赖](/learn/removing-effect-dependencies)** 以了解如何减少 Effect 重新运行的频率。

</LearnMore>

## 使用自定义 Hook 复用逻辑 {/*reusing-logic-with-custom-hooks*/}

React 有一些内置 Hook，例如 `useState`，`useContext` 和 `useEffect`。有时需要用途更特殊的 Hook：例如获取数据，记录用户是否在线或者连接聊天室。为了实现效果，可以根据应用需求创建自己的 Hook。

这个示例中，自定义 Hook `usePointerPosition` 追踪当前指针位置，而自定义 Hook `useDelayedValue` 返回一个“滞后”传递的值一定毫秒数的值。将光标移到沙盒预览区域上以查看跟随光标移动的点轨迹：

<Sandpack>

```js
import { usePointerPosition } from './usePointerPosition.js';
import { useDelayedValue } from './useDelayedValue.js';

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos4, 50);
  return (
    <>
      <Dot position={pos1} opacity={1} />
      <Dot position={pos2} opacity={0.8} />
      <Dot position={pos3} opacity={0.6} />
      <Dot position={pos4} opacity={0.4} />
      <Dot position={pos5} opacity={0.2} />
    </>
  );
}

function Dot({ position, opacity }) {
  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity,
      transform: `translate(${position.x}px, ${position.y}px)`,
      pointerEvents: 'none',
      left: -20,
      top: -20,
      width: 40,
      height: 40,
    }} />
  );
}
```

```js src/usePointerPosition.js
import { useState, useEffect } from 'react';

export function usePointerPosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);
  return position;
}
```

```js src/useDelayedValue.js
import { useState, useEffect } from 'react';

export function useDelayedValue(value, delay) {
  const [delayedValue, setDelayedValue] = useState(value);

  useEffect(() => {
    setTimeout(() => {
      setDelayedValue(value);
    }, delay);
  }, [value, delay]);

  return delayedValue;
}
```

```css
body { min-height: 300px; }
```

</Sandpack>

你可以创建自定义 Hooks，将它们组合在一起，在它们之间传递数据，并在组件之间重用它们。随着应用不断变大，你将减少手动编写的 Effect，因为你将能够重用已经编写的自定义 Hooks。React 社区也维护了许多优秀的自定义 Hooks。

<LearnMore path="/learn/reusing-logic-with-custom-hooks">

阅读 **[使用自定义 Hook 复用逻辑](/learn/reusing-logic-with-custom-hooks)** 以了解如何在组件之间共享逻辑。

</LearnMore>

## 下节预告 {/*whats-next*/}

跳转到 [使用 ref 引用值](/learn/referencing-values-with-refs) 这一节并开始一页页的阅读！
