---
title: '响应式 Effect 的生命周期'
---

<Intro>

Effect 与组件有不同的生命周期。组件可以挂载、更新或卸载。Effect 只能做两件事：开始同步某些东西，然后停止同步它。如果你的 Effect 依赖于随时间变化的 props 和 state，这个循环可能会发生多次。React 提供了一个代码检查规则来检查你是否正确地指定了 Effect 的依赖项，这能够使你的 Effect 与最新的 props 和 state 保持同步。

</Intro>

<YouWillLearn>

- Effect 的生命周期与组件的生命周期有何不同
- 如何独立地考虑每个 Effect
- 什么时候你的 Effect 需要重新同步，为什么
- 如何确定 Effect 的依赖项
- 值是响应式的含义是什么
- 空依赖数组意味着什么
- React 如何使用检查工具验证你的依赖关系是否正确
- 当你与代码检查工具产生分歧时，该如何处理

</YouWillLearn>

## 响应式 Effect 的生命周期 {/*the-lifecycle-of-an-effect*/}

每个 React 组件都经历相同的生命周期：

- 当一个组件被添加到屏幕上时，它会进行组件的 **挂载**。
- 当一个组件接收到新的 props 或 state 时，通常是作为对交互的响应，它会进行组件的 **更新**。
- 当一个组件从屏幕上移除时，它会进行组件的 **卸载**。

**这是一种很好的思考组件的方式，但并不适用于 Effect**。相反，尝试将每个Effect独立思考，与你的组件生命周期无关。Effect 描述了如何将外部系统与当前的 props 和 state 同步。随着你的代码变化，同步的频率可能会增加或减少。

为了说明这一点，考虑下面这个将你的组件连接到聊天服务器的 Effect 示例：

```js
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

你的 Effect 的主体部分指定了如何 **开始同步**：

```js {2-3}
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
    // ...
```

你的 Effect 返回的清理函数指定了如何 **停止同步**：

```js {5}
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
    // ...
```

你可能会直观地认为当组件挂载时React会 **开始同步**，而当组件卸载时会 **停止同步**。然而，事情并没有这么简单！有时，在组件保持挂载状态的同时，可能还需要 **多次开始和停止同步**。

让我们来看看 **为什么** 这是必要的、**何时** 会发生以及 **如何** 控制这种行为。

<Note>

有些 Effect 根本不返回清理函数。[在大多数情况下](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)，你可能希望返回一个清理函数，但如果没有返回，React将表现得好像你返回了一个空的清理函数。

</Note>

### 为什么同步可能需要多次进行 {/*why-synchronization-may-need-to-happen-more-than-once*/}

想象一下，这个 `ChatRoom` 组件接收一个 `roomId` 属性，用户可以在下拉菜单中选择。假设初始时，用户选择了 `"所有"` 作为 `roomId`。你的应用程序会显示 `"所有"` 聊天室：

```js {3}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId /* "所有" */ }) {
  // ...
  return <h1>欢迎来到 {roomId} 房间！</h1>;
}
```

在 UI 显示之后，React 将运行你的 Effect 来 **开始同步**。它连接到`"所有"`聊天室：

```js {3,4}
function ChatRoom({ roomId /* "所有" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // 连接到 "所有" 聊天室
    connection.connect();
    return () => {
      connection.disconnect(); // 断开与 "所有" 聊天室的连接
    };
  }, [roomId]);
  // ...
```

到目前为止，一切都很顺利。

之后，用户在下拉菜单中选择了不同的房间（例如 `"旅游"`）。首先，React会更新 UI：

```js {1}
function ChatRoom({ roomId /* "旅游" */ }) {
  // ...
  return <h1>欢迎来到 {roomId} 房间！</h1>;
}
```

思考接下来应该发生什么。用户在界面中看到 `"旅游"` 是当前选定的聊天室。然而，上次运行的 Effect 仍然连接到 `"所有"` 聊天室。**`roomId` 属性已经发生了变化，所以之前 Effect 所做的事情（连接到 `"所有"` 聊天室）不再与 UI 匹配。**

此时，你希望React执行两个操作：

1. 停止与旧的 `roomId` 同步（断开与 `"所有"` 聊天室的连接）
2. 开始与新的 `roomId` 同步（连接到 `"旅游"` 聊天室）

**幸运的是，你已经教会了 React 如何执行这两个操作**！你的 Effect 的主体部分指定了如何开始同步，而清理函数指定了如何停止同步。现在，React 只需要按照正确的顺序和正确的 props 和 state 来调用它们。让我们看看具体是如何实现的。

### React 如何重新同步你的 Effect {/*how-react-re-synchronizes-your-effect*/}

回想一下，你的 `ChatRoom` 组件已经接收到了 `roomId` 属性的新值。之前它是 `"所有"`，现在变成了 `"旅游"`。React 需要重新同步你的 Effect，以将你重新连接到不同的聊天室。

为了 **停止同步**，React 将调用你的 Effect 返回的清理函数，该函数在连接到 `"所有"` 聊天室后返回。由于 `roomId` 为 `"所有"`，清理函数将断开与 `"所有"` 聊天室的连接：

```js {6}
function ChatRoom({ roomId /* "所有" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // 连接到 "所有" 聊天室
    connection.connect();
    return () => {
      connection.disconnect(); // 断开与 "所有" 聊天室的连接
    };
    // ...
```

然后，React 将运行你在此渲染期间提供的 Effect。这次，`roomId` 为 `"旅游"`，因此它将 **开始同步** 到 `"旅游"` 聊天室（直到最终也调用了清理函数）：

```js {3,4}
function ChatRoom({ roomId /* "旅游" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // 连接到 "旅游" 聊天室
    connection.connect();
    // ...
```

多亏了这一点，现在你已经连接到了用户在 UI 中选择的同一个聊天室。避免了灾难！

每当你的组件使用不同的 `roomId` 重新渲染后，你的 Effect 将重新进行同步。例如，假设用户将 `roomId` 从 `"旅游"` 更改为 `"音乐"`。React 将再次通过调用清理函数 **停止同步** 你的 Effect（断开与 `"旅游"` 聊天室的连接）。然后，它将通过使用新的 `roomId` 属性再次运行 Effect 的主体部分 **开始同步**（将你连接到 `"音乐"` 聊天室）。

最后，当用户切换到不同的屏幕时，`ChatRoom` 组件将被卸载。现在没有必要保持连接了。React 将 **最后一次停止同步** 你的 Effect，并将你从 `"音乐"` 聊天室断开连接。

### 从 Effect 的角度思考 {/*thinking-from-the-effects-perspective*/}

让我们总结一下从 `ChatRoom` 组件的角度所发生的一切：

1. `ChatRoom` 组件挂载，`roomId` 设置为 `"所有"`
1. `ChatRoom` 组件更新，`roomId` 设置为 `"旅游"`
1. `ChatRoom` 组件更新，`roomId` 设置为 `"音乐"`
1. `ChatRoom` 组件卸载

在组件生命周期的每个阶段，你的 Effect 执行了不同的操作：

1. 你的 Effect 连接到了 `"所有"` 聊天室
1. 你的 Effect 断开了与 `"所有"` 聊天室的连接，并连接到了 `"旅游"` 聊天室
1. 你的 Effect 断开了与 `"旅游"` 聊天室的连接，并连接到了 `"音乐"` 聊天室
1. 你的 Effect 断开了与 `"音乐"` 聊天室的连接

现在让我们从 Effect 本身的角度来思考所发生的事情：

```js
  useEffect(() => {
    // 你的 Effect 连接到了通过 roomId 指定的聊天室...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      // ...直到它断开连接
      connection.disconnect();
    };
  }, [roomId]);
```

这段代码的结构可能会让你将所发生的事情看作是一系列不重叠的时间段：

1. 你的 Effect 连接到了 `"所有"` 聊天室（直到断开连接）
1. 你的 Effect 连接到了 `"旅游"` 聊天室（直到断开连接）
1. 你的 Effect 连接到了 `"音乐"` 聊天室（直到断开连接）

之前，你是从组件的角度思考的。当你从组件的角度思考时，很容易将 Effect 视为在特定时间点触发的“回调函数”或“生命周期事件”，例如“渲染后”或“卸载前”。这种思维方式很快变得复杂，所以最好避免使用。

**相反，始终专注于单个启动/停止周期。无论组件是挂载、更新还是卸载，都不应该有影响。你只需要描述如何开始同步和如何停止。如果你做得好，你的 Effect 将能够在需要时始终具备启动和停止的弹性。**

这可能会让你想起当你编写创建 JSX 的渲染逻辑时，并不考虑组件是挂载还是更新。你描述的是应该显示在屏幕上的内容，而 React 会 [解决其余的问题](/learn/reacting-to-input-with-state)。

### React 如何验证你的 Effect 可以重新进行同步 {/*how-react-verifies-that-your-effect-can-re-synchronize*/}

这里有一个可以互动的实时示例。点击“打开聊天”来挂载 `ChatRoom` 组件：

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

```js chat.js
export function createConnection(serverUrl, roomId) {
  // 真正的实现实际上会连接到服务器
  return {
    connect() {
      console.log('✅ 连接到 "' + roomId + '" 房间，位于' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ 断开 "' + roomId + '" 房间，位于' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

请注意，当组件首次挂载时，你会看到三个日志：

1. `✅ 连接到 "所有" 聊天室，位于 https://localhost:1234...` *(仅限开发环境)*
2. `❌ 从 "所有" 聊天室断开连接，位于 https://localhost:1234.` *(仅限开发环境)*
3. `✅ 连接到 "所有" 聊天室，位于 https://localhost:1234...`

前两个日志仅适用于开发环境。在开发环境中，React 总是会重新挂载每个组件一次。

**React 通过在开发环境中立即强制 Effect 重新进行同步来验证其是否能够重新同步**。这可能让你想起打开门并额外关闭它以检查门锁是否有效的情景。React 在开发环境中额外启动和停止 Effect 一次，以检查 [你是否正确实现了它的清理功能](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)。

实际上，Effect 重新进行同步的主要原因是它所使用的某些数据发生了变化。在上面的示例中，更改所选的聊天室。注意当 `roomId` 发生变化时，Effect 会重新进行同步。

然而，还存在其他一些不寻常的情况需要重新进行同步。例如，在上面的示例中，尝试在聊天打开时编辑 `serverUrl`。注意当你修改代码时，Effect会重新进行同步。将来，React可能会添加更多依赖于重新同步的功能。

### React 如何知道需要重新进行 Effect 的同步 {/*how-react-knows-that-it-needs-to-re-synchronize-the-effect*/}

你可能想知道 React 是如何知道在 `roomId` 更改后需要重新同步你的 Effect。这是因为 **你告诉了React** 它的代码依赖于 `roomId`，通过将其包含在 [依赖列表](/learn/synchronizing-with-effects#step-2-specify-the-effect-dependencies) 中。

```js {1,3,8}
function ChatRoom({ roomId }) { // roomId 属性可能会随时间变化。
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // 这个 Effect 读取了 roomId
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]); // 因此，你告诉 React 这个 Effect "依赖于" roomId
  // ...
```

下面是它的工作原理：

1. 你知道 `roomId` 是一个 prop，这意味着它可能会随着时间的推移发生变化。
2. 你知道你的 Effect 读取了 `roomId`（因此其逻辑依赖于可能会在之后发生变化的值）。
3. 这就是为什么你将其指定为 Effect 的依赖项（以便在 `roomId` 发生变化时重新进行同步）。

每次在组件重新渲染后，React 都会查看你传递的依赖项数组。如果数组中的任何值与上一次渲染时在相同位置传递的值不同，React 将重新同步你的 Effect。

例如，如果在初始渲染时传递了 `["所有"]`，然后在下一次渲染时传递了 `["旅游"]`，React 将比较 `"所有"` 和 `"旅游"`。这些是不同的值（使用 [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 进行比较），因此 React 将重新同步你的 Effect。另一方面，如果你的组件重新渲染但 `roomId` 没有发生变化，你的 Effect 将继续连接到相同的房间。

### 每个 Effect 表示一个独立的同步过程。 {/*each-effect-represents-a-separate-synchronization-process*/}

抵制将与 Effect 无关的逻辑添加到已经编写的 Effect 中，仅仅因为这些逻辑需要与 Effect 同时运行。例如，假设你想在用户访问房间时发送一个分析事件。你已经有一个依赖于 `roomId` 的 Effect，所以你可能会感到诱惑将分析调用添加到那里：

```js {3}
function ChatRoom({ roomId }) {
  useEffect(() => {
    logVisit(roomId);
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

但是想象一下，如果以后你给这个 Effect 添加了另一个需要重新建立连接的依赖项。如果这个 Effect 重新进行同步，它将为相同的房间调用 `logVisit(roomId)`，而这不是你的意图。记录访问行为是 **一个独立的过程**，与连接不同。将它们作为两个单独的 Effects 编写：

```js {2-4}
function ChatRoom({ roomId }) {
  useEffect(() => {
    logVisit(roomId);
  }, [roomId]);

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    // ...
  }, [roomId]);
  // ...
}
```

**代码中的每个 Effect 应该代表一个独立的同步过程。.**

在上面的示例中，删除一个 Effect 不会影响另一个 Effect 的逻辑。这表明它们同步不同的内容，因此将它们拆分开是有意义的。另一方面，如果将一个内聚的逻辑拆分成多个独立的 Effects，代码可能会看起来更加“清晰”，但[维护起来会更加困难](/learn/you-might-not-need-an-effect#chains-of-computations)。这就是为什么你应该考虑这些过程是相同还是独立的，而不是只考虑代码是否看起来更整洁。

## Effect 会“响应”于响应式值 {/*effects-react-to-reactive-values*/}

你的 Effect 读取了两个变量（`serverUrl` 和 `roomId`），但是你只将 `roomId` 指定为依赖项：

```js {5,10}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

为什么 `serverUrl` 不需要作为依赖项呢？

这是因为 `serverUrl` 永远不会因为重新渲染而发生变化。无论组件重新渲染多少次以及原因是什么，`serverUrl` 都保持不变。既然 `serverUrl` 从不变化，将其指定为依赖项就没有意义。毕竟，依赖项只有在随时间变化时才会起作用！

另一方面，`roomId` 在重新渲染时可能会不同。**在组件内部声明的 props、state 和其他值都是 _响应式_ 的，因为它们是在渲染过程中计算的，并参与了 React 的数据流。**

如果 `serverUrl` 是一个状态变量，那么它就是响应式的。响应式值必须包含在依赖项中：

```js {2,5,10}
function ChatRoom({ roomId }) { // Props 随时间变化
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // State 可能随时间变化

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // 你的 Effect 读取 props 和 state
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]); // 因此，你告诉 React 这个 Effect "依赖于" props 和 state
  // ...
}
```

通过将 `serverUrl` 包含在依赖项中，你确保 Effect 在其发生变化后重新同步。

尝试在此沙盒中更改所选的聊天室或编辑服务器 URL：

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        服务器 URL：{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>欢迎来到 {roomId} 房间！</h1>
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
          <option value="所有">所有</option>
          <option value="旅游">旅游</option>
          <option value="音乐">音乐</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // 真正的实现实际上会连接到服务器
  return {
    connect() {
      console.log('✅ 连接到 "' + roomId + '" 房间，位于' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ 断开 "' + roomId + '" 房间，位于' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

无论何时你更改一个类似 `roomId` 或 `serverUrl` 的响应式值，该 Effect 都会重新连接到聊天服务器。

### 一个没有依赖项的 Effect 的含义 {/*what-an-effect-with-empty-dependencies-means*/}

如果将 `serverUrl` 和 `roomId` 都移出组件会发生什么？

```js {1,2}
const serverUrl = 'https://localhost:1234';
const roomId = '所有';

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ 声明的所有依赖
  // ...
}
```

现在你的 Effect 的代码不使用任何响应式值，因此它的依赖可以是空的 (`[]`)。

从组件的角度来看，空的 `[]` 依赖数组意味着这个 Effect 仅在组件挂载时连接到聊天室，并在组件卸载时断开连接。（请记住，在开发环境中，React 仍会 [额外执行一次](#how-react-verifies-that-your-effect-can-re-synchronize) 来对你的逻辑进行压力测试。）


<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = '所有';

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>欢迎来到 {roomId} 房间！</h1>;
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? '关闭聊天' : '打开聊天'}
      </button>
      {show && <hr />}
      {show && <ChatRoom />}
    </>
  );
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // 真正的实现实际上会连接到服务器
  return {
    connect() {
      console.log('✅ 连接到 "' + roomId + '" 房间，位于' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ 断开 "' + roomId + '" 房间，位于' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

然而，如果你 [从 Effect 的角度思考](#thinking-from-the-effects-perspective)，你根本不需要考虑挂载和卸载。重要的是，你已经指定了你的 Effect 如何开始和停止同步。目前，它没有任何响应式依赖。但是，如果你希望用户随时间改变 `roomId` 或 `serverUrl`（它们将变为响应式），你的 Effect 的代码不需要改变。你只需要将它们添加到依赖项中即可。

### 在组件主体中声明的所有变量都是响应式的 {/*all-variables-declared-in-the-component-body-are-reactive*/}

Props 和 state 并不是唯一的响应式值。从它们计算出的值也是响应式的。如果 props 或 state 发生变化，你的组件将重新渲染，从中计算出的值也会随之改变。这就是为什么 Effect 使用的组件主体中的所有变量都应该在依赖列表中。

假设用户可以在下拉菜单中选择聊天服务器，但他们还可以在设置中配置默认服务器。假设你已经将设置状态放入了一个 [上下文](/learn/scaling-up-with-reducer-and-context)，因此你从该上下文中读取 `settings`。现在，你可以根据 props 中选择的服务器和默认服务器来计算 `serverUrl`：

```js {3,5,10}
function ChatRoom({ roomId, selectedServerUrl }) { // roomId 是响应式的
  const settings = useContext(SettingsContext); // settings 是响应式的
  const serverUrl = selectedServerUrl ?? settings.defaultServerUrl; // serverUrl 是响应式的
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // 你的 Effect 读取了 roomId 和 serverUrl
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]); // 因此，当它们中的任何一个发生变化时，它需要重新同步！
  // ...
}
```

在这个例子中，`serverUrl` 不是一个 prop 或 state 变量。它是你在渲染过程中计算的普通变量。但是它是在渲染过程中计算的，所以它可能会因为重新渲染而改变。这就是为什么它是响应式的。

**组件内部的所有值（包括 props、state 和组件体内的变量）都是响应式的。任何响应式值都可以在重新渲染时发生变化，所以你需要将响应式值包括在 Effect 的依赖项中。**

换句话说，Effect 对组件体内的所有值都会“react”。

<DeepDive>

#### 全局变量或可变值可以作为依赖项吗？ {/*can-global-or-mutable-values-be-dependencies*/}

可变值（包括全局变量）不是响应式的。

例如，像 [`location.pathname`](https://developer.mozilla.org/en-US/docs/Web/API/Location/pathname) 这样的可变值不能作为依赖项。它是可变的，因此可以在 React 渲染数据流之外的任何时间发生变化。更改它不会触发组件的重新渲染。因此，即使你在依赖项中指定了它，React 也无法知道在其更改时重新同步 Effect。这也违反了 React 的规则，因为在渲染过程中读取可变数据（即在计算依赖项时）会破坏 [纯粹的渲染](/learn/keeping-components-pure)。相反，你应该使用 [`useSyncExternalStore`](/learn/you-might-not-need-an-effect#subscribing-to-an-external-store) 来读取和订阅外部可变值。

**另外，像 [`ref.current`](/reference/react/useRef#reference) 或从中读取的值也不能作为依赖项。`useRef` 返回的 ref 对象本身可以作为依赖项**，但其 `current` 属性是有意可变的。它允许你 [跟踪某些值而不触发重新渲染](/learn/referencing-values-with-refs)。但由于更改它不会触发重新渲染，它不是一个响应式值，React 不会知道在其更改时重新运行你的 Effect。

正如你将在本页面下面学到的那样，检查工具将自动检查这些问题。

</DeepDive>

### React 会验证你是否将每个响应式值都作为依赖项进行了指定 {/*react-verifies-that-you-specified-every-reactive-value-as-a-dependency*/}

如果你的检查工具 [配置了 React](/learn/editor-setup#linting)，它将检查你的 Effect 代码中使用的每个响应式值是否已声明为其依赖项。例如，以下示例是一个 lint 错误，因为 `roomId` 和 `serverUrl` 都是响应式的：

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) { // roomId 是响应式的
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // serverUrl 是响应式的

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // <-- 这里有些问题！

  return (
    <>
      <label>
        服务器 URL：{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>欢迎来到 {roomId} 房间！</h1>
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
          <option value="所有">所有</option>
          <option value="旅游">旅游</option>
          <option value="音乐">音乐</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // 真正的实现实际上会连接到服务器
  return {
    connect() {
      console.log('✅ 连接到 "' + roomId + '" 房间，位于' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ 断开 "' + roomId + '" 房间，位于' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

这可能看起来像是一个 React 错误，但实际上 React 是在指出你代码中的一个 bug。`roomId` 和 `serverUrl` 都可能随时间改变，但你忘记了在它们改变时重新同步你的 Effect。即使用户在 UI 中选择了不同的值，你仍然保持连接到初始的 `roomId` 和 `serverUrl`。

要修复这个 bug，请按照检查工具的建议将 `roomId` 和 `serverUrl` 作为你的 Effect 的依赖进行指定：

```js {9}
function ChatRoom({ roomId }) { // roomId 是响应式的
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // serverUrl 是响应式的
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]); // ✅ 声明的所有依赖
  // ...
}
```

在上面的沙盒中尝试这个修复方法。验证一下是否消除了检查工具的错误，并且在需要时聊天会重新连接。

<Note>

在某些情况下，React **知道** 一个值永远不会改变，即使它在组件内部声明。例如，从 `useState` 返回的 `set` 函数和从 `useRef`返回的 ref 对象是 **稳定的** ——它们保证在重新渲染时不会改变。稳定值不是响应式的，因此你可以从列表中省略它们。包括它们是允许的：它们不会改变，所以无关紧要。

</Note>

### 当你不想进行重新同步时该怎么办 {/*what-to-do-when-you-dont-want-to-re-synchronize*/}

在上一个示例中，你通过将 `roomId` 和 `serverUrl` 列为依赖项来修复了 lint 错误。

然而，你可以通过向检查工具“证明”这些值不是响应式值，即它们 **不会** 因为重新渲染而改变。例如，如果 `serverUrl` 和 `roomId` 不依赖于渲染并且始终具有相同的值，你可以将它们移到组件外部。现在它们不需要成为依赖项：

```js {1,2,11}
const serverUrl = 'https://localhost:1234'; // serverUrl 不是响应式的
const roomId = '所有'; // roomId 不是响应式的

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ 声明的所有依赖
  // ...
}
```

你也可以将它们 **移动到 Effect 内部**。它们不是在渲染过程中计算的，因此它们不是响应式的：

```js {3,4,10}
function ChatRoom() {
  useEffect(() => {
    const serverUrl = 'https://localhost:1234'; // serverUrl 不是响应式的
    const roomId = '所有'; // roomId 不是响应式的
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ 声明的所有依赖
  // ...
}
```

**Effect 是一段响应式的代码块**。它们在你读取的值发生变化时重新进行同步。与事件处理程序不同，事件处理程序只在每次交互时运行一次，而 Effect 则在需要进行同步时运行。

**你不能“选择”你的依赖项**。你的依赖项必须包括你在 Effect 中读取的每个 [响应式值](#all-variables-declared-in-the-component-body-are-reactive)。代码检查工具会强制执行此规则。有时，这可能会导致出现无限循环的问题，或者你的 Effect 过于频繁地重新进行同步。不要通过禁用代码检查来解决这些问题！下面是一些解决方案：

* **检查你的 Effect 是否表示了独立的同步过程**。如果你的 Effect 没有进行任何同步操作，[可能是不必要的](/learn/you-might-not-need-an-effect)。如果它同时进行了几个独立的同步操作，[将其拆分为多个 Effect](#each-effect-represents-a-separate-synchronization-process)。

* **如果你想读取 props 或 state 的最新值，但又不想对其做出反应并重新同步 Effect**，你可以将 Effect 拆分为具有反应性的部分（保留在 Effect 中）和非反应性的部分（提取为名为 "Effect Event" 的内容）。[阅读关于将事件与效果分离的内容](/learn/separating-events-from-effects)。

* **避免将对象和函数作为依赖项**。如果你在渲染过程中创建对象和函数，然后在 Effect 中读取它们，它们将在每次渲染时都不同。这将导致你的 Effect 每次都重新同步。[阅读有关从 Effect 中删除不必要依赖项的更多内容](/learn/removing-effect-dependencies)。

<Pitfall>

检查工具是你的朋友，但它们的能力是有限的。检查工具只知道依赖关系是否 **错误**。它并不知道每种情况下的 **最佳** 解决方法。如果静态代码分析工具建议添加某个依赖关系，但添加该依赖关系会导致循环，这并不意味着应该忽略静态代码分析工具。你需要修改 Effect 内部（或外部）的代码，使得该值不是响应式的，也不 **需要** 成为依赖项。

如果你有一个现有的代码库，可能会有一些像这样禁用了检查工具的 Effect：

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 避免这样禁用静态代码分析工具：
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

在 [下一页](/learn/separating-events-from-effects) 和 [之后的页面](/learn/removing-effect-dependencies) 中，你将学习如何修复这段代码，而不违反规则。修复代码总是值得的！

</Pitfall>

<Recap>

- 组件可以挂载、更新和卸载。
- 每个 Effect 与周围组件有着独立的生命周期。
- 每个 Effect 描述了一个独立的同步过程，可以 **开始** 和 **停止**。
- 在编写和读取 Effect 时，要独立地考虑每个 Effect（如何开始和停止同步），而不是从组件的角度思考（如何挂载、更新或卸载）。
- 在组件主体内声明的值是“响应式”的。
- 响应式值应该重新进行同步 Effect，因为它们可以随着时间的推移而发生变化。
- 检查工具验证在 Effect 内部使用的所有响应式值都被指定为依赖项。
- 检查工具标记的所有错误都是合理的。总是有一种方法可以修复代码，同时不违反规则。

</Recap>

<Challenges>

#### Fix reconnecting on every keystroke {/*fix-reconnecting-on-every-keystroke*/}

In this example, the `ChatRoom` component connects to the chat room when the component mounts, disconnects when it unmounts, and reconnects when you select a different chat room. This behavior is correct, so you need to keep it working.

However, there is a problem. Whenever you type into the message box input at the bottom, `ChatRoom` *also* reconnects to the chat. (You can notice this by clearing the console and typing into the input.) Fix the issue so that this doesn't happen.

<Hint>

You might need to add a dependency array for this Effect. What dependencies should be there?

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  });

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
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

```js chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

<Solution>

This Effect didn't have a dependency array at all, so it re-synchronized after every re-render. First, add a dependency array. Then, make sure that every reactive value used by the Effect is specified in the array. For example, `roomId` is reactive (because it's a prop), so it should be included in the array. This ensures that when the user selects a different room, the chat reconnects. On the other hand, `serverUrl` is defined outside the component. This is why it doesn't need to be in the array.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
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

```js chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

</Solution>

#### Switch synchronization on and off {/*switch-synchronization-on-and-off*/}

In this example, an Effect subscribes to the window [`pointermove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointermove_event) event to move a pink dot on the screen. Try hovering over the preview area (or touching the screen if you're on a mobile device), and see how the pink dot follows your movement.

There is also a checkbox. Ticking the checkbox toggles the `canMove` state variable, but this state variable is not used anywhere in the code. Your task is to change the code so that when `canMove` is `false` (the checkbox is ticked off), the dot should stop moving. After you toggle the checkbox back on (and set `canMove` to `true`), the box should follow the movement again. In other words, whether the dot can move or not should stay synchronized to whether the checkbox is checked.

<Hint>

You can't declare an Effect conditionally. However, the code inside the Effect can use conditions!

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)} 
        />
        The dot is allowed to move
      </label>
      <hr />
      <div style={{
        position: 'absolute',
        backgroundColor: 'pink',
        borderRadius: '50%',
        opacity: 0.6,
        transform: `translate(${position.x}px, ${position.y}px)`,
        pointerEvents: 'none',
        left: -20,
        top: -20,
        width: 40,
        height: 40,
      }} />
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>

<Solution>

One solution is to wrap the `setPosition` call into an `if (canMove) { ... }` condition:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      if (canMove) {
        setPosition({ x: e.clientX, y: e.clientY });
      }
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, [canMove]);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)} 
        />
        The dot is allowed to move
      </label>
      <hr />
      <div style={{
        position: 'absolute',
        backgroundColor: 'pink',
        borderRadius: '50%',
        opacity: 0.6,
        transform: `translate(${position.x}px, ${position.y}px)`,
        pointerEvents: 'none',
        left: -20,
        top: -20,
        width: 40,
        height: 40,
      }} />
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>

Alternatively, you could wrap the *event subscription* logic into an `if (canMove) { ... }` condition:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    if (canMove) {
      window.addEventListener('pointermove', handleMove);
      return () => window.removeEventListener('pointermove', handleMove);
    }
  }, [canMove]);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)} 
        />
        The dot is allowed to move
      </label>
      <hr />
      <div style={{
        position: 'absolute',
        backgroundColor: 'pink',
        borderRadius: '50%',
        opacity: 0.6,
        transform: `translate(${position.x}px, ${position.y}px)`,
        pointerEvents: 'none',
        left: -20,
        top: -20,
        width: 40,
        height: 40,
      }} />
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>

In both of these cases, `canMove` is a reactive variable that you read inside the Effect. This is why it must be specified in the list of Effect dependencies. This ensures that the Effect re-synchronizes after every change to its value.

</Solution>

#### Investigate a stale value bug {/*investigate-a-stale-value-bug*/}

In this example, the pink dot should move when the checkbox is on, and should stop moving when the checkbox is off. The logic for this has already been implemented: the `handleMove` event handler checks the `canMove` state variable.

However, for some reason, the `canMove` state variable inside `handleMove` appears to be "stale": it's always `true`, even after you tick off the checkbox. How is this possible? Find the mistake in the code and fix it.

<Hint>

If you see a linter rule being suppressed, remove the suppression! That's where the mistakes usually are.

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  function handleMove(e) {
    if (canMove) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  }

  useEffect(() => {
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)} 
        />
        The dot is allowed to move
      </label>
      <hr />
      <div style={{
        position: 'absolute',
        backgroundColor: 'pink',
        borderRadius: '50%',
        opacity: 0.6,
        transform: `translate(${position.x}px, ${position.y}px)`,
        pointerEvents: 'none',
        left: -20,
        top: -20,
        width: 40,
        height: 40,
      }} />
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>

<Solution>

The problem with the original code was suppressing the dependency linter. If you remove the suppression, you'll see that this Effect depends on the `handleMove` function. This makes sense: `handleMove` is declared inside the component body, which makes it a reactive value. Every reactive value must be specified as a dependency, or it can potentially get stale over time!

The author of the original code has "lied" to React by saying that the Effect does not depend (`[]`) on any reactive values. This is why React did not re-synchronize the Effect after `canMove` has changed (and `handleMove` with it). Because React did not re-synchronize the Effect, the `handleMove` attached as a listener is the `handleMove` function created during the initial render. During the initial render, `canMove` was `true`, which is why `handleMove` from the initial render will forever see that value.

**If you never suppress the linter, you will never see problems with stale values.** There are a few different ways to solve this bug, but you should always start by removing the linter suppression. Then change the code to fix the lint error.

You can change the Effect dependencies to `[handleMove]`, but since it's going to be a newly defined function for every render, you might as well remove dependencies array altogether. Then the Effect *will* re-synchronize after every re-render:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  function handleMove(e) {
    if (canMove) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  }

  useEffect(() => {
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  });

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)} 
        />
        The dot is allowed to move
      </label>
      <hr />
      <div style={{
        position: 'absolute',
        backgroundColor: 'pink',
        borderRadius: '50%',
        opacity: 0.6,
        transform: `translate(${position.x}px, ${position.y}px)`,
        pointerEvents: 'none',
        left: -20,
        top: -20,
        width: 40,
        height: 40,
      }} />
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>

This solution works, but it's not ideal. If you put `console.log('Resubscribing')` inside the Effect, you'll notice that it resubscribes after every re-render. Resubscribing is fast, but it would still be nice to avoid doing it so often.

A better fix would be to move the `handleMove` function *inside* the Effect. Then `handleMove` won't be a reactive value, and so your Effect won't depend on a function. Instead, it will need to depend on `canMove` which your code now reads from inside the Effect. This matches the behavior you wanted, since your Effect will now stay synchronized with the value of `canMove`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      if (canMove) {
        setPosition({ x: e.clientX, y: e.clientY });
      }
    }

    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, [canMove]);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)} 
        />
        The dot is allowed to move
      </label>
      <hr />
      <div style={{
        position: 'absolute',
        backgroundColor: 'pink',
        borderRadius: '50%',
        opacity: 0.6,
        transform: `translate(${position.x}px, ${position.y}px)`,
        pointerEvents: 'none',
        left: -20,
        top: -20,
        width: 40,
        height: 40,
      }} />
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>

Try adding `console.log('Resubscribing')` inside the Effect body and notice that now it only resubscribes when you toggle the checkbox (`canMove` changes) or edit the code. This makes it better than the previous approach that always resubscribed.

You'll learn a more general approach to this type of problem in [Separating Events from Effects.](/learn/separating-events-from-effects)

</Solution>

#### Fix a connection switch {/*fix-a-connection-switch*/}

In this example, the chat service in `chat.js` exposes two different APIs: `createEncryptedConnection` and `createUnencryptedConnection`. The root `App` component lets the user choose whether to use encryption or not, and then passes down the corresponding API method to the child `ChatRoom` component as the `createConnection` prop.

Notice that initially, the console logs say the connection is not encrypted. Try toggling the checkbox on: nothing will happen. However, if you change the selected room after that, then the chat will reconnect *and* enable encryption (as you'll see from the console messages). This is a bug. Fix the bug so that toggling the checkbox *also* causes the chat to reconnect.

<Hint>

Suppressing the linter is always suspicious. Could this be a bug?

</Hint>

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        createConnection={isEncrypted ?
          createEncryptedConnection :
          createUnencryptedConnection
        }
      />
    </>
  );
}
```

```js ChatRoom.js active
import { useState, useEffect } from 'react';

export default function ChatRoom({ roomId, createConnection }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js chat.js
export function createEncryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ 🔐 Connecting to "' + roomId + '... (encrypted)');
    },
    disconnect() {
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '... (unencrypted)');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

If you remove the linter suppression, you will see a lint error. The problem is that `createConnection` is a prop, so it's a reactive value. It can change over time! (And indeed, it should--when the user ticks the checkbox, the parent component passes a different value of the `createConnection` prop.) This is why it should be a dependency. Include it in the list to fix the bug:

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        createConnection={isEncrypted ?
          createEncryptedConnection :
          createUnencryptedConnection
        }
      />
    </>
  );
}
```

```js ChatRoom.js active
import { useState, useEffect } from 'react';

export default function ChatRoom({ roomId, createConnection }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, createConnection]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js chat.js
export function createEncryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ 🔐 Connecting to "' + roomId + '... (encrypted)');
    },
    disconnect() {
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '... (unencrypted)');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

It is correct that `createConnection` is a dependency. However, this code is a bit fragile because someone could edit the `App` component to pass an inline function as the value of this prop. In that case, its value would be different every time the `App` component re-renders, so the Effect might re-synchronize too often. To avoid this, you can pass `isEncrypted` down instead:

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
      />
    </>
  );
}
```

```js ChatRoom.js active
import { useState, useEffect } from 'react';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted }) {
  useEffect(() => {
    const createConnection = isEncrypted ?
      createEncryptedConnection :
      createUnencryptedConnection;
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js chat.js
export function createEncryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ 🔐 Connecting to "' + roomId + '... (encrypted)');
    },
    disconnect() {
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '... (unencrypted)');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

In this version, the `App` component passes a boolean prop instead of a function. Inside the Effect, you decide which function to use. Since both `createEncryptedConnection` and `createUnencryptedConnection` are declared outside the component, they aren't reactive, and don't need to be dependencies. You'll learn more about this in [Removing Effect Dependencies.](/learn/removing-effect-dependencies)

</Solution>

#### Populate a chain of select boxes {/*populate-a-chain-of-select-boxes*/}

In this example, there are two select boxes. One select box lets the user pick a planet. Another select box lets the user pick a place *on that planet.* The second box doesn't work yet. Your task is to make it show the places on the chosen planet.

Look at how the first select box works. It populates the `planetList` state with the result from the `"/planets"` API call. The currently selected planet's ID is kept in the `planetId` state variable. You need to find where to add some additional code so that the `placeList` state variable is populated with the result of the `"/planets/" + planetId + "/places"` API call.

If you implement this right, selecting a planet should populate the place list. Changing a planet should change the place list.

<Hint>

If you have two independent synchronization processes, you need to write two separate Effects.

</Hint>

<Sandpack>

```js App.js
import { useState, useEffect } from 'react';
import { fetchData } from './api.js';

export default function Page() {
  const [planetList, setPlanetList] = useState([])
  const [planetId, setPlanetId] = useState('');

  const [placeList, setPlaceList] = useState([]);
  const [placeId, setPlaceId] = useState('');

  useEffect(() => {
    let ignore = false;
    fetchData('/planets').then(result => {
      if (!ignore) {
        console.log('Fetched a list of planets.');
        setPlanetList(result);
        setPlanetId(result[0].id); // Select the first planet
      }
    });
    return () => {
      ignore = true;
    }
  }, []);

  return (
    <>
      <label>
        Pick a planet:{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        Pick a place:{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>You are going to: {placeId || '???'} on {planetId || '???'} </p>
    </>
  );
}
```

```js api.js hidden
export function fetchData(url) {
  if (url === '/planets') {
    return fetchPlanets();
  } else if (url.startsWith('/planets/')) {
    const match = url.match(/^\/planets\/([\w-]+)\/places(\/)?$/);
    if (!match || !match[1] || !match[1].length) {
      throw Error('Expected URL like "/planets/earth/places". Received: "' + url + '".');
    }
    return fetchPlaces(match[1]);
  } else throw Error('Expected URL like "/planets" or "/planets/earth/places". Received: "' + url + '".');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: 'Earth'
      }, {
        id: 'venus',
        name: 'Venus'
      }, {
        id: 'mars',
        name: 'Mars'        
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) expects a string argument. ' +
      'Instead received: ' + planetId + '.'
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      if (planetId === 'earth') {
        resolve([{
          id: 'laos',
          name: 'Laos'
        }, {
          id: 'spain',
          name: 'Spain'
        }, {
          id: 'vietnam',
          name: 'Vietnam'        
        }]);
      } else if (planetId === 'venus') {
        resolve([{
          id: 'aurelia',
          name: 'Aurelia'
        }, {
          id: 'diana-chasma',
          name: 'Diana Chasma'
        }, {
          id: 'kumsong-vallis',
          name: 'Kŭmsŏng Vallis'        
        }]);
      } else if (planetId === 'mars') {
        resolve([{
          id: 'aluminum-city',
          name: 'Aluminum City'
        }, {
          id: 'new-new-york',
          name: 'New New York'
        }, {
          id: 'vishniac',
          name: 'Vishniac'
        }]);
      } else throw Error('Unknown planet ID: ' + planetId);
    }, 1000);
  });
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

There are two independent synchronization processes:

- The first select box is synchronized to the remote list of planets.
- The second select box is synchronized to the remote list of places for the current `planetId`.

This is why it makes sense to describe them as two separate Effects. Here's an example of how you could do this:

<Sandpack>

```js App.js
import { useState, useEffect } from 'react';
import { fetchData } from './api.js';

export default function Page() {
  const [planetList, setPlanetList] = useState([])
  const [planetId, setPlanetId] = useState('');

  const [placeList, setPlaceList] = useState([]);
  const [placeId, setPlaceId] = useState('');

  useEffect(() => {
    let ignore = false;
    fetchData('/planets').then(result => {
      if (!ignore) {
        console.log('Fetched a list of planets.');
        setPlanetList(result);
        setPlanetId(result[0].id); // Select the first planet
      }
    });
    return () => {
      ignore = true;
    }
  }, []);

  useEffect(() => {
    if (planetId === '') {
      // Nothing is selected in the first box yet
      return;
    }

    let ignore = false;
    fetchData('/planets/' + planetId + '/places').then(result => {
      if (!ignore) {
        console.log('Fetched a list of places on "' + planetId + '".');
        setPlaceList(result);
        setPlaceId(result[0].id); // Select the first place
      }
    });
    return () => {
      ignore = true;
    }
  }, [planetId]);

  return (
    <>
      <label>
        Pick a planet:{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        Pick a place:{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>You are going to: {placeId || '???'} on {planetId || '???'} </p>
    </>
  );
}
```

```js api.js hidden
export function fetchData(url) {
  if (url === '/planets') {
    return fetchPlanets();
  } else if (url.startsWith('/planets/')) {
    const match = url.match(/^\/planets\/([\w-]+)\/places(\/)?$/);
    if (!match || !match[1] || !match[1].length) {
      throw Error('Expected URL like "/planets/earth/places". Received: "' + url + '".');
    }
    return fetchPlaces(match[1]);
  } else throw Error('Expected URL like "/planets" or "/planets/earth/places". Received: "' + url + '".');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: 'Earth'
      }, {
        id: 'venus',
        name: 'Venus'
      }, {
        id: 'mars',
        name: 'Mars'        
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) expects a string argument. ' +
      'Instead received: ' + planetId + '.'
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      if (planetId === 'earth') {
        resolve([{
          id: 'laos',
          name: 'Laos'
        }, {
          id: 'spain',
          name: 'Spain'
        }, {
          id: 'vietnam',
          name: 'Vietnam'        
        }]);
      } else if (planetId === 'venus') {
        resolve([{
          id: 'aurelia',
          name: 'Aurelia'
        }, {
          id: 'diana-chasma',
          name: 'Diana Chasma'
        }, {
          id: 'kumsong-vallis',
          name: 'Kŭmsŏng Vallis'        
        }]);
      } else if (planetId === 'mars') {
        resolve([{
          id: 'aluminum-city',
          name: 'Aluminum City'
        }, {
          id: 'new-new-york',
          name: 'New New York'
        }, {
          id: 'vishniac',
          name: 'Vishniac'
        }]);
      } else throw Error('Unknown planet ID: ' + planetId);
    }, 1000);
  });
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

This code is a bit repetitive. However, that's not a good reason to combine it into a single Effect! If you did this, you'd have to combine both Effect's dependencies into one list, and then changing the planet would refetch the list of all planets. Effects are not a tool for code reuse.

Instead, to reduce repetition, you can extract some logic into a custom Hook like `useSelectOptions` below:

<Sandpack>

```js App.js
import { useState } from 'react';
import { useSelectOptions } from './useSelectOptions.js';

export default function Page() {
  const [
    planetList,
    planetId,
    setPlanetId
  ] = useSelectOptions('/planets');

  const [
    placeList,
    placeId,
    setPlaceId
  ] = useSelectOptions(planetId ? `/planets/${planetId}/places` : null);

  return (
    <>
      <label>
        Pick a planet:{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList?.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        Pick a place:{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList?.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>You are going to: {placeId || '...'} on {planetId || '...'} </p>
    </>
  );
}
```

```js useSelectOptions.js
import { useState, useEffect } from 'react';
import { fetchData } from './api.js';

export function useSelectOptions(url) {
  const [list, setList] = useState(null);
  const [selectedId, setSelectedId] = useState('');
  useEffect(() => {
    if (url === null) {
      return;
    }

    let ignore = false;
    fetchData(url).then(result => {
      if (!ignore) {
        setList(result);
        setSelectedId(result[0].id);
      }
    });
    return () => {
      ignore = true;
    }
  }, [url]);
  return [list, selectedId, setSelectedId];
}
```

```js api.js hidden
export function fetchData(url) {
  if (url === '/planets') {
    return fetchPlanets();
  } else if (url.startsWith('/planets/')) {
    const match = url.match(/^\/planets\/([\w-]+)\/places(\/)?$/);
    if (!match || !match[1] || !match[1].length) {
      throw Error('Expected URL like "/planets/earth/places". Received: "' + url + '".');
    }
    return fetchPlaces(match[1]);
  } else throw Error('Expected URL like "/planets" or "/planets/earth/places". Received: "' + url + '".');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: 'Earth'
      }, {
        id: 'venus',
        name: 'Venus'
      }, {
        id: 'mars',
        name: 'Mars'        
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) expects a string argument. ' +
      'Instead received: ' + planetId + '.'
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      if (planetId === 'earth') {
        resolve([{
          id: 'laos',
          name: 'Laos'
        }, {
          id: 'spain',
          name: 'Spain'
        }, {
          id: 'vietnam',
          name: 'Vietnam'        
        }]);
      } else if (planetId === 'venus') {
        resolve([{
          id: 'aurelia',
          name: 'Aurelia'
        }, {
          id: 'diana-chasma',
          name: 'Diana Chasma'
        }, {
          id: 'kumsong-vallis',
          name: 'Kŭmsŏng Vallis'        
        }]);
      } else if (planetId === 'mars') {
        resolve([{
          id: 'aluminum-city',
          name: 'Aluminum City'
        }, {
          id: 'new-new-york',
          name: 'New New York'
        }, {
          id: 'vishniac',
          name: 'Vishniac'
        }]);
      } else throw Error('Unknown planet ID: ' + planetId);
    }, 1000);
  });
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

Check the `useSelectOptions.js` tab in the sandbox to see how it works. Ideally, most Effects in your application should eventually be replaced by custom Hooks, whether written by you or by the community. Custom Hooks hide the synchronization logic, so the calling component doesn't know about the Effect. As you keep working on your app, you'll develop a palette of Hooks to choose from, and eventually you won't need to write Effects in your components very often.

</Solution>

</Challenges>
