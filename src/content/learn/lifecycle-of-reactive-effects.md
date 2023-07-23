---
title: '响应式 Effect 的生命周期'
---

<Intro>

Effect 与组件有不同的生命周期。组件可以挂载、更新或卸载。Effect 只能做两件事：开始同步某些东西，然后停止同步它。如果 Effect 依赖于随时间变化的 props 和 state，这个循环可能会发生多次。React 提供了代码检查规则来检查是否正确地指定了 Effect 的依赖项，这能够使 Effect 与最新的 props 和 state 保持同步。

</Intro>

<YouWillLearn>

- Effect 的生命周期与组件的生命周期有何不同
- 如何独立地考虑每个 Effect
- 什么时候以及为什么 Effect 需要重新同步
- 如何确定 Effect 的依赖项
- 值是响应式的含义是什么
- 空依赖数组意味着什么
- React 如何使用检查工具验证依赖关系是否正确
- 与代码检查工具产生分歧时，该如何处理

</YouWillLearn>

## Effect 的生命周期 {/*the-lifecycle-of-an-effect*/}

每个 React 组件都经历相同的生命周期：

- 当组件被添加到屏幕上时，它会进行组件的 **挂载**。
- 当组件接收到新的 props 或 state 时，通常是作为对交互的响应，它会进行组件的 **更新**。
- 当组件从屏幕上移除时，它会进行组件的 **卸载**。

**这是一种很好的思考组件的方式，但并不适用于 Effect**。相反，尝试从组件生命周期中跳脱出来，独立思考 Effect。Effect 描述了如何将外部系统与当前的 props 和 state 同步。随着代码的变化，同步的频率可能会增加或减少。

为了说明这一点，考虑下面这个示例。Effect 将组件连接到聊天服务器：

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

Effect 的主体部分指定了如何 **开始同步**：

```js {2-3}
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
    // ...
```

Effect 返回的清理函数指定了如何 **停止同步**：

```js {5}
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
    // ...
```

你可能会直观地认为当组件挂载时 React 会 **开始同步**，而当组件卸载时会 **停止同步**。然而，事情并没有这么简单！有时，在组件保持挂载状态的同时，可能还需要 **多次开始和停止同步**。

让我们来看看 **为什么** 这是必要的、**何时** 会发生以及 **如何** 控制这种行为。

<Note>

有些 Effect 根本不返回清理函数。[在大多数情况下](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)，可能希望返回一个清理函数，但如果没有返回，React 将表现得好像返回了一个空的清理函数。

</Note>

### 为什么同步可能需要多次进行 {/*why-synchronization-may-need-to-happen-more-than-once*/}

想象一下，这个 `ChatRoom` 组件接收 `roomId` 属性，用户可以在下拉菜单中选择。假设初始时，用户选择了 `"general"` 作为 `roomId`。应用程序会显示 `"general"` 聊天室：

```js {3}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId /* "general" */ }) {
  // ...
  return <h1>欢迎来到 {roomId} 房间！</h1>;
}
```

在 UI 显示之后，React 将运行 Effect 来 **开始同步**。它连接到 `"general"` 聊天室：

```js {3,4}
function ChatRoom({ roomId /* "general" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // 连接到 "general" 聊天室
    connection.connect();
    return () => {
      connection.disconnect(); // 断开与 "general" 聊天室的连接
    };
  }, [roomId]);
  // ...
```

到目前为止，一切都很顺利。

之后，用户在下拉菜单中选择了不同的房间（例如 `"travel"` ）。首先，React 会更新 UI：

```js {1}
function ChatRoom({ roomId /* "travel" */ }) {
  // ...
  return <h1>欢迎来到 {roomId} 房间！</h1>;
}
```

思考接下来应该发生什么。用户在界面中看到 `"travel"` 是当前选定的聊天室。然而，上次运行的 Effect 仍然连接到 `"general"` 聊天室。**`roomId` 属性已经发生了变化，所以之前 Effect 所做的事情（连接到 `"general"` 聊天室）不再与 UI 匹配**。

此时，你希望 React 执行两个操作：

1. 停止与旧的 `roomId` 同步（断开与 `"general"` 聊天室的连接）
2. 开始与新的 `roomId` 同步（连接到 `"travel"` 聊天室）

**幸运的是，你已经教会了 React 如何执行这两个操作**！Effect 的主体部分指定了如何开始同步，而清理函数指定了如何停止同步。现在，React 只需要按照正确的顺序和正确的 props 和 state 来调用它们。让我们看看具体是如何实现的。

### React 如何重新同步 Effect {/*how-react-re-synchronizes-your-effect*/}

回想一下，`ChatRoom` 组件已经接收到了 `roomId` 属性的新值。之前它是 `"general"`，现在变成了 `"travel"`。React 需要重新同步 Effect，以重新连接到不同的聊天室。

为了 **停止同步**，React 将调用 Effect 返回的清理函数，该函数在连接到 `"general"` 聊天室后返回。由于 `roomId` 为 `"general"`，清理函数将断开与 `"general"` 聊天室的连接：

```js {6}
function ChatRoom({ roomId /* "general" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // 连接到 "general" 聊天室
    connection.connect();
    return () => {
      connection.disconnect(); // 断开与 "general" 聊天室的连接
    };
    // ...
```

然后，React 将运行在此渲染期间提供的 Effect。这次，`roomId` 为 `"travel"`，因此它将 **开始同步** 到 `"travel"` 聊天室（直到最终也调用了清理函数）：

```js {3,4}
function ChatRoom({ roomId /* "travel" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // 连接到 "travel" 聊天室
    connection.connect();
    // ...
```

多亏了这一点，现在已经连接到了用户在 UI 中选择的同一个聊天室。避免了灾难！

每当组件使用不同的 `roomId` 重新渲染后，Effect 将重新进行同步。例如，假设用户将 `roomId` 从 `"travel"` 更改为 `"music"`。React 将再次通过调用清理函数 **停止同步** Effect（断开与 `"travel"` 聊天室的连接）。然后，它将通过使用新的 `roomId` 属性再次运行 Effect 的主体部分 **开始同步**（连接到 `"music"` 聊天室）。

最后，当用户切换到不同的屏幕时，`ChatRoom` 组件将被卸载。现在没有必要保持连接了。React 将 **最后一次停止同步** Effect，并从 `"music"` 聊天室断开连接。

### 从 Effect 的角度思考 {/*thinking-from-the-effects-perspective*/}

让我们总结一下从 `ChatRoom` 组件的角度所发生的一切：

1. `ChatRoom` 组件挂载，`roomId` 设置为 `"general"`
1. `ChatRoom` 组件更新，`roomId` 设置为 `"travel"`
1. `ChatRoom` 组件更新，`roomId` 设置为 `"music"`
1. `ChatRoom` 组件卸载

在组件生命周期的每个阶段，Effect 执行了不同的操作：

1. Effect 连接到了 `"general"` 聊天室
1. Effect 断开了与 `"general"` 聊天室的连接，并连接到了 `"travel"` 聊天室
1. Effect 断开了与 `"travel"` 聊天室的连接，并连接到了 `"music"` 聊天室
1. Effect 断开了与 `"music"` 聊天室的连接

现在让我们从 Effect 本身的角度来思考所发生的事情：

```js
  useEffect(() => {
    // Effect 连接到了通过 roomId 指定的聊天室...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      // ...直到它断开连接
      connection.disconnect();
    };
  }, [roomId]);
```

这段代码的结构可能会将所发生的事情看作是一系列不重叠的时间段：

1. Effect 连接到了 `"general"` 聊天室（直到断开连接）
1. Effect 连接到了 `"travel"` 聊天室（直到断开连接）
1. Effect 连接到了 `"music"` 聊天室（直到断开连接）

之前，你是从组件的角度思考的。当你从组件的角度思考时，很容易将 Effect 视为在特定时间点触发的“回调函数”或“生命周期事件”，例如“渲染后”或“卸载前”。这种思维方式很快变得复杂，所以最好避免使用。

**相反，始终专注于单个启动/停止周期。无论组件是挂载、更新还是卸载，都不应该有影响。只需要描述如何开始同步和如何停止。如果做得好，Effect 将能够在需要时始终具备启动和停止的弹性**。

这可能会让你想起当编写创建 JSX 的渲染逻辑时，并不考虑组件是挂载还是更新。描述的是应该显示在屏幕上的内容，而 React 会 [解决其余的问题](/learn/reacting-to-input-with-state)。

### React 如何验证 Effect 可以重新进行同步 {/*how-react-verifies-that-your-effect-can-re-synchronize*/}

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
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
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
  // 实际的实现将会连接到服务器
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

请注意，当组件首次挂载时，会看到三个日志：

1. `✅ 连接到 "general" 聊天室，位于 https://localhost:1234...` *(仅限开发环境)*
2. `❌ 从 "general" 聊天室断开连接，位于 https://localhost:1234.` *(仅限开发环境)*
3. `✅ 连接到 "general" 聊天室，位于 https://localhost:1234...`

前两个日志仅适用于开发环境。在开发环境中，React 总是会重新挂载每个组件一次。

**React 通过在开发环境中立即强制 Effect 重新进行同步来验证其是否能够重新同步**。这可能让你想起打开门并额外关闭它以检查门锁是否有效的情景。React 在开发环境中额外启动和停止 Effect 一次，以检查 [是否正确实现了它的清理功能](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)。

实际上，Effect 重新进行同步的主要原因是它所使用的某些数据发生了变化。在上面的示例中，更改所选的聊天室。注意当 `roomId` 发生变化时，Effect 会重新进行同步。

然而，还存在其他一些不寻常的情况需要重新进行同步。例如，在上面的示例中，尝试在聊天打开时编辑 `serverUrl`。注意当修改代码时，Effect会重新进行同步。将来，React 可能会添加更多依赖于重新同步的功能。

### React 如何知道需要重新进行 Effect 的同步 {/*how-react-knows-that-it-needs-to-re-synchronize-the-effect*/}

你可能想知道 React 是如何知道在 `roomId` 更改后需要重新同步 Effect。这是因为 **你告诉了 React** 它的代码依赖于 `roomId`，通过将其包含在 [依赖列表](/learn/synchronizing-with-effects#step-2-specify-the-effect-dependencies) 中。

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

1. 你知道 `roomId` 是 prop，这意味着它可能会随着时间的推移发生变化。
2. 你知道 Effect 读取了 `roomId`（因此其逻辑依赖于可能会在之后发生变化的值）。
3. 这就是为什么你将其指定为 Effect 的依赖项（以便在 `roomId` 发生变化时重新进行同步）。

每次在组件重新渲染后，React 都会查看传递的依赖项数组。如果数组中的任何值与上一次渲染时在相同位置传递的值不同，React 将重新同步 Effect。

例如，如果在初始渲染时传递了 `["general"]`，然后在下一次渲染时传递了 `["travel"]`，React 将比较 `"general"` 和 `"travel"`。这些是不同的值（使用 [`Object.is`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 进行比较），因此 React 将重新同步 Effect。另一方面，如果组件重新渲染但 `roomId` 没有发生变化，Effect 将继续连接到相同的房间。

### 每个 Effect 表示一个独立的同步过程。 {/*each-effect-represents-a-separate-synchronization-process*/}

抵制将与 Effect 无关的逻辑添加到已经编写的 Effect 中，仅仅因为这些逻辑需要与 Effect 同时运行。例如，假设你想在用户访问房间时发送一个分析事件。你已经有一个依赖于 `roomId` 的 Effect，所以你可能会想要将分析调用添加到那里：

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

但是想象一下，如果以后给这个 Effect 添加了另一个需要重新建立连接的依赖项。如果这个 Effect 重新进行同步，它将为相同的房间调用 `logVisit(roomId)`，而这不是你的意图。记录访问行为是 **一个独立的过程**，与连接不同。将它们作为两个单独的 Effect 编写：

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

在上面的示例中，删除一个 Effect 不会影响另一个 Effect 的逻辑。这表明它们同步不同的内容，因此将它们拆分开是有意义的。另一方面，如果将一个内聚的逻辑拆分成多个独立的 Effects，代码可能会看起来更加“清晰”，但 [维护起来会更加困难](/learn/you-might-not-need-an-effect#chains-of-computations)。这就是为什么你应该考虑这些过程是相同还是独立的，而不是只考虑代码是否看起来更整洁。

## Effect 会“响应”于响应式值 {/*effects-react-to-reactive-values*/}

Effect 读取了两个变量（`serverUrl` 和 `roomId`），但是只将 `roomId` 指定为依赖项：

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

另一方面，`roomId` 在重新渲染时可能会不同。**在组件内部声明的 props、state 和其他值都是 响应式 的，因为它们是在渲染过程中计算的，并参与了 React 的数据流**。

如果 `serverUrl` 是状态变量，那么它就是响应式的。响应式值必须包含在依赖项中：

```js {2,5,10}
function ChatRoom({ roomId }) { // Props 随时间变化
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // State 可能随时间变化

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Effect 读取 props 和 state
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]); // 因此，你告诉 React 这个 Effect "依赖于" props 和 state
  // ...
}
```

通过将 `serverUrl` 包含在依赖项中，确保 Effect 在其发生变化后重新同步。

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

```js chat.js
export function createConnection(serverUrl, roomId) {
  // 实际的实现将会连接到服务器
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

无论何时更改一个类似 `roomId` 或 `serverUrl` 的响应式值，该 Effect 都会重新连接到聊天服务器。

### 没有依赖项的 Effect 的含义 {/*what-an-effect-with-empty-dependencies-means*/}

如果将 `serverUrl` 和 `roomId` 都移出组件会发生什么？

```js {1,2}
const serverUrl = 'https://localhost:1234';
const roomId = 'general';

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

现在 Effect 的代码不使用任何响应式值，因此它的依赖可以是空的 (`[]`)。

从组件的角度来看，空的 `[]` 依赖数组意味着这个 Effect 仅在组件挂载时连接到聊天室，并在组件卸载时断开连接。（请记住，在开发环境中，React 仍会 [额外执行一次](#how-react-verifies-that-your-effect-can-re-synchronize) 来对逻辑进行压力测试。）


<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'general';

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
  // 实际的实现将会连接到服务器
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

然而，如果你 [从 Effect 的角度思考](#thinking-from-the-effects-perspective)，根本不需要考虑挂载和卸载。重要的是，你已经指定了 Effect 如何开始和停止同步。目前，它没有任何响应式依赖。但是，如果希望用户随时间改变 `roomId` 或 `serverUrl`（它们将变为响应式），Effect 的代码不需要改变。只需要将它们添加到依赖项中即可。

### 在组件主体中声明的所有变量都是响应式的 {/*all-variables-declared-in-the-component-body-are-reactive*/}

Props 和 state 并不是唯一的响应式值。从它们计算出的值也是响应式的。如果 props 或 state 发生变化，组件将重新渲染，从中计算出的值也会随之改变。这就是为什么 Effect 使用的组件主体中的所有变量都应该在依赖列表中。

假设用户可以在下拉菜单中选择聊天服务器，但他们还可以在设置中配置默认服务器。假设你已经将设置状态放入了 [上下文](/learn/scaling-up-with-reducer-and-context)，因此从该上下文中读取 `settings`。现在，可以根据 props 中选择的服务器和默认服务器来计算 `serverUrl`：

```js {3,5,10}
function ChatRoom({ roomId, selectedServerUrl }) { // roomId 是响应式的
  const settings = useContext(SettingsContext); // settings 是响应式的
  const serverUrl = selectedServerUrl ?? settings.defaultServerUrl; // serverUrl 是响应式的
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Effect 读取了 roomId 和 serverUrl
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]); // 因此，当它们中的任何一个发生变化时，它需要重新同步！
  // ...
}
```

在这个例子中，`serverUrl` 不是 prop 或 state 变量。它是在渲染过程中计算的普通变量。但是它是在渲染过程中计算的，所以它可能会因为重新渲染而改变。这就是为什么它是响应式的。

**组件内部的所有值（包括 props、state 和组件体内的变量）都是响应式的。任何响应式值都可以在重新渲染时发生变化，所以需要将响应式值包括在 Effect 的依赖项中**。

换句话说，Effect 对组件体内的所有值都会“react”。

<DeepDive>

#### 全局变量或可变值可以作为依赖项吗？ {/*can-global-or-mutable-values-be-dependencies*/}

可变值（包括全局变量）不是响应式的。

例如，像 [`location.pathname`](https://developer.mozilla.org/zh-CN/docs/Web/API/Location/pathname) 这样的可变值不能作为依赖项。它是可变的，因此可以在 React 渲染数据流之外的任何时间发生变化。更改它不会触发组件的重新渲染。因此，即使在依赖项中指定了它，React 也无法知道在其更改时重新同步 Effect。这也违反了 React 的规则，因为在渲染过程中读取可变数据（即在计算依赖项时）会破坏 [纯粹的渲染](/learn/keeping-components-pure)。相反，应该使用 [`useSyncExternalStore`](/learn/you-might-not-need-an-effect#subscribing-to-an-external-store) 来读取和订阅外部可变值。

**另外，像 [`ref.current`](/reference/react/useRef#reference) 或从中读取的值也不能作为依赖项。`useRef` 返回的 ref 对象本身可以作为依赖项**，但其 `current` 属性是有意可变的。它允许 [跟踪某些值而不触发重新渲染](/learn/referencing-values-with-refs)。但由于更改它不会触发重新渲染，它不是响应式值，React 不会知道在其更改时重新运行 Effect。

正如你将在本页面下面学到的那样，检查工具将自动检查这些问题。

</DeepDive>

### React 会验证是否将每个响应式值都指定为了依赖项 {/*react-verifies-that-you-specified-every-reactive-value-as-a-dependency*/}

如果检查工具 [配置了 React](/learn/editor-setup#linting)，它将检查 Effect 代码中使用的每个响应式值是否已声明为其依赖项。例如，以下示例是一个 lint 错误，因为 `roomId` 和 `serverUrl` 都是响应式的：

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

```js chat.js
export function createConnection(serverUrl, roomId) {
  // 实际的实现将会连接到服务器
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

这可能看起来像是 React 错误，但实际上 React 是在指出代码中的 bug。`roomId` 和 `serverUrl` 都可能随时间改变，但忘记了在它们改变时重新同步 Effect。即使用户在 UI 中选择了不同的值，仍然保持连接到初始的 `roomId` 和 `serverUrl`。

要修复这个 bug，请按照检查工具的建议将 `roomId` 和 `serverUrl` 作为 Effect 的依赖进行指定：

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

在某些情况下，React **知道** 一个值永远不会改变，即使它在组件内部声明。例如，从 `useState` 返回的 `set` 函数和从 `useRef` 返回的 ref 对象是 **稳定的** ——它们保证在重新渲染时不会改变。稳定值不是响应式的，因此可以从列表中省略它们。包括它们是允许的：它们不会改变，所以无关紧要。

</Note>

### 当你不想进行重新同步时该怎么办 {/*what-to-do-when-you-dont-want-to-re-synchronize*/}

在上一个示例中，通过将 `roomId` 和 `serverUrl` 列为依赖项来修复了 lint 错误。

然而，可以通过向检查工具“证明”这些值不是响应式值，即它们 **不会** 因为重新渲染而改变。例如，如果 `serverUrl` 和 `roomId` 不依赖于渲染并且始终具有相同的值，可以将它们移到组件外部。现在它们不需要成为依赖项：

```js {1,2,11}
const serverUrl = 'https://localhost:1234'; // serverUrl 不是响应式的
const roomId = 'general'; // roomId 不是响应式的

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

也可以将它们 **移动到 Effect 内部**。它们不是在渲染过程中计算的，因此它们不是响应式的：

```js {3,4,10}
function ChatRoom() {
  useEffect(() => {
    const serverUrl = 'https://localhost:1234'; // serverUrl 不是响应式的
    const roomId = 'general'; // roomId 不是响应式的
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ 声明的所有依赖
  // ...
}
```

**Effect 是一段响应式的代码块**。它们在读取的值发生变化时重新进行同步。与事件处理程序不同，事件处理程序只在每次交互时运行一次，而 Effect 则在需要进行同步时运行。

**不能“选择”依赖项**。依赖项必须包括 Effect 中读取的每个 [响应式值](#all-variables-declared-in-the-component-body-are-reactive)。代码检查工具会强制执行此规则。有时，这可能会导致出现无限循环的问题，或者 Effect 过于频繁地重新进行同步。不要通过禁用代码检查来解决这些问题！下面是一些解决方案：

* **检查 Effect 是否表示了独立的同步过程**。如果 Effect 没有进行任何同步操作，[可能是不必要的](/learn/you-might-not-need-an-effect)。如果它同时进行了几个独立的同步操作，[将其拆分为多个 Effect](#each-effect-represents-a-separate-synchronization-process)。

* **如果想读取 props 或 state 的最新值，但又不想对其做出反应并重新同步 Effect**，可以将 Effect 拆分为具有反应性的部分（保留在 Effect 中）和非反应性的部分（提取为名为 "Effect Event" 的内容）。[阅读关于将事件与 Effect 分离的内容](/learn/separating-events-from-effects)。

* **避免将对象和函数作为依赖项**。如果在渲染过程中创建对象和函数，然后在 Effect 中读取它们，它们将在每次渲染时都不同。这将导致 Effect 每次都重新同步。[阅读有关从 Effect 中删除不必要依赖项的更多内容](/learn/removing-effect-dependencies)。

<Pitfall>

检查工具是你的朋友，但它们的能力是有限的。检查工具只知道依赖关系是否 **错误**。它并不知道每种情况下的 **最佳** 解决方法。如果静态代码分析工具建议添加某个依赖关系，但添加该依赖关系会导致循环，这并不意味着应该忽略静态代码分析工具。需要修改 Effect 内部（或外部）的代码，使得该值不是响应式的，也不 **需要** 成为依赖项。

如果有一个现有的代码库，可能会有一些像这样禁用了检查工具的 Effect：

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

#### 修复每次输入均重新连接 {/*fix-reconnecting-on-every-keystroke*/}

在这个例子中，`ChatRoom` 组件在组件挂载时连接到聊天室，在卸载时断开连接，并且在选择不同的聊天室时重新连接。这种行为是正确的，所以需要保持它的正常工作。

然而，存在一个问题。每当在底部的消息框中输入时，`ChatRoom` 也会重新连接到聊天室（可以通过清空控制台并在输入框中输入内容来注意到这一点）。修复这个问题，使其不再发生重新连接的情况。

<Hint>

应该需要为这个 Effect 添加依赖数组，那么应该包含哪些依赖项呢？

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
      <h1>欢迎来到 {roomId} 聊天室！</h1>
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

```js chat.js
export function createConnection(serverUrl, roomId) {
  // 实际的实现将会连接到服务器
  return {
    connect() {
      console.log('✅ 建立连接 "' + roomId + '" 聊天室位于 ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ 断开连接 "' + roomId + '" 聊天室位于 ' + serverUrl);
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

这个 Effect 实际上没有任何依赖数组，所以它在每次重新渲染后都会重新同步。首先，添加依赖数组。然后，确保每个被 Effect 使用的响应式值都在数组中指定。例如，`roomId` 是响应式的（因为它是 `prop`），所以它应该包含在数组中。这样可以确保当用户选择不同的聊天室时，聊天会重新连接。另一方面，`serverUrl` 是在组件外部定义的，这就是为什么它不需要在数组中的原因。

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
      <h1>欢迎来到 {roomId} 聊天室！</h1>
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

```js chat.js
export function createConnection(serverUrl, roomId) {
  // 实际的实现将会连接到服务器
  return {
    connect() {
      console.log('✅ 建立连接 "' + roomId + '" 聊天室位于 ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ 断开连接 "' + roomId + '" 聊天室位于 ' + serverUrl);
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

#### 打开和关闭状态同步 {/*switch-synchronization-on-and-off*/}

在这个例子中，Effect 订阅了 window 的 [`pointermove`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/pointermove_event) 事件，以在屏幕上移动一个粉色的点。尝试在预览区域上悬停（或者如果你使用移动设备，请触摸屏幕），看看粉色的点如何跟随你移动。

还有一个复选框。勾选复选框会切换 `canMove` 状态变量，但是这个状态变量在代码中没有被使用。你的任务是修改代码，使得当 `canMove` 为 `false`（复选框未选中）时，点应该停止移动。在切换复选框回到选中状态（将 `canMove` 设置为 `true`）之后，点应该重新跟随移动。换句话说，点是否可以移动应该与复选框的选中状态保持同步。

<Hint>

你不能在条件语句中声明 Effect，但是可以在 Effect 内部使用条件语句来控制其行为！

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
        是否允许移动
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

一个解决方案是将 `setPosition` 的调用包裹在 `if (canMove) { ... }` 条件语句中：

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
        是否允许移动
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

或者，你可以将 **事件订阅** 的逻辑包裹在 `if (canMove) { ... }` 条件语句中：

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
        是否允许移动
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

在这两种情况下，`canMove` 是一个响应式变量，并在 Effect 中读取它。这就是为什么它必须在 Effect 的依赖列表中进行指定。这样可以确保在每次值的更改后，Effect 重新同步。

</Solution>

#### 寻找过时值的错误 {/*investigate-a-stale-value-bug*/}

在这个例子中，当复选框选中时，粉色的点应该移动，当复选框未选中时，点应该停止移动。这个逻辑已经实现了：`handleMove` 事件处理程序检查 `canMove` 状态变量。

然而，出现问题的是在 `handleMove` 内部，`canMove` 状态变量似乎是“过时的”：即使在取消选中复选框之后，它始终是 `true`。这是怎么可能的？找出代码中的错误并进行修复。

<Hint>

如果你在代码中看到有一个被禁止的 linter 规则，建议考虑删除这个禁止。通常情况下，禁止 linter 规则可能隐藏了潜在的错误或代码问题。

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
        是否允许移动
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

原始代码的问题在于禁止了依赖性检查的 linter 规则。如果移除禁止，会发现这个 Effect 依赖于 `handleMove` 函数。这是有道理的：`handleMove` 是在组件体内声明的，这使得它成为一个响应式值。每个响应式值都必须在依赖列表中进行指定，否则它可能会随着时间的推移变为过时！

原始代码的作者通过声明 Effect 不依赖任何响应式值（`[]`）来欺骗 React。这就是为什么 React 在 `canMove` 改变后（以及 `handleMove`）没有重新同步该 Effect。因为 React 没有重新同步该 Effect，所以附加的 `handleMove` 侦听器是在初始渲染期间创建的 `handleMove` 函数。在初始渲染期间，`canMove` 是 `true`，这就是为什么初始渲染时的 `handleMove` 将永远获取到该值。

**如果从不禁止 linter，就不会遇到过时值的问题**。解决这个 bug 有几种不同的方法，但应该始终从移除 linter 禁止开始。然后修改代码来修复 lint 错误。

可以将 Effect 的依赖项更改为 `[handleMove]`，但由于它在每次渲染时都会被重新定义，也可以完全删除依赖项数组。然后，Effect 将在 **每次重新渲染后重新同步**：

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
        是否允许移动
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

这个解决方案有效，但并不理想。如果在 Effect 内部放置 `console.log('Resubscribing')`，会注意到它在每次重新渲染后都重新订阅。重新订阅很快，但是正常情况下应该避免频繁进行重新订阅。

更好的解决方案是将 `handleMove` 函数 **移动到** Effect 内部。然后，`handleMove` 就不会成为响应式值，因此 Effect 不会依赖于函数。相反，它将依赖于 Effect 内部的 `canMove`。这符合预期行为，因为 Effect 现在将始终与 `canMove` 的值保持同步：

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
        是否允许移动
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

请在 Effect 主体中添加 `console.log('Resubscribing')`，注意现在它只在切换复选框（`canMove` 变化）或编辑代码时重新订阅。这使得它比之前的方法更好，因为它只在必要时重新订阅。

你将在 [将事件与 Effect 分离](/learn/separating-events-from-effects) 中学习到更通用的解决此类问题的方法。

</Solution>

#### 修复连接开关 {/*fix-a-connection-switch*/}

在这个例子中，`chat.js` 中的聊天服务提供了两个不同的 API：`createEncryptedConnection` 和 `createUnencryptedConnection`。根组件 `App` 允许用户选择是否使用加密，并将相应的 API 方法作为 `createConnection` 属性传递给子组件 `ChatRoom`。

请注意，最初控制台日志显示连接未加密。尝试切换复选框：不会发生任何变化。然而，如果在此之后更改所选的聊天室，那么聊天将重新连接 **并且** 启用加密（从控制台日志中可以看到）。这是一个错误。修复这个错误，以便切换复选框 **也** 会使重新连接聊天室。

<Hint>

禁用代码检查工具总是令人产生疑问。这可能是一个 bug 吗？

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
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        启用加密
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

  return <h1>欢迎来到 {roomId} 聊天室！</h1>;
}
```

```js chat.js
export function createEncryptedConnection(roomId) {
  // 实际的实现将会连接到服务器
  return {
    connect() {
      console.log('✅ 🔐 建立连接 "' + roomId + '... (加密)');
    },
    disconnect() {
      console.log('❌ 🔐 断开连接 "' + roomId + '" room (加密)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // 实际的实现将会连接到服务器
  return {
    connect() {
      console.log('✅ 建立连接 "' + roomId + '... (未加密)');
    },
    disconnect() {
      console.log('❌ 断开连接 "' + roomId + '" room (未加密)');
    }
  };
}
````

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

如果解除代码检查工具的禁用，你会看到一个代码检查错误。问题在于 `createConnection` 是一个 prop，因此它是一个响应式的值。它可以随时间而改变！（实际上，当用户勾选复选框时，父组件会传递一个不同的 `createConnection` prop 值。）这就是为什么它应该是一个依赖项。将其包含在依赖项列表中以修复该 bug：

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
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        启用加密
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

  return <h1>欢迎来到 {roomId} 聊天室！</h1>;
}
```

```js chat.js
export function createEncryptedConnection(roomId) {
  // 实际的实现将会连接到服务器
  return {
    connect() {
      console.log('✅ 🔐 建立连接 "' + roomId + '... (加密)');
    },
    disconnect() {
      console.log('❌ 🔐 断开连接 "' + roomId + '" room (加密)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // 实际的实现将会连接到服务器
  return {
    connect() {
      console.log('✅ 建立连接 "' + roomId + '... (未加密)');
    },
    disconnect() {
      console.log('❌ 断开连接 "' + roomId + '" room (未加密)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

是的，`createConnection` 是一个依赖项。然而，这段代码并不健壮，因为可以编辑 `App` 组件以将内联函数作为该 prop 的值传递。在这种情况下，每次 `App` 组件重新渲染时，其值都会不同，因此 Effect 可能会过于频繁地重新同步。为了避免这种情况，可以传 `isEncrypted` 作为 prop 的值：

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
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        启用加密
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

  return <h1>欢迎来到 {roomId} 聊天室！</h1>;
}
```

```js chat.js
export function createEncryptedConnection(roomId) {
  // 实际的实现将会连接到服务器
  return {
    connect() {
      console.log('✅ 🔐 建立连接 "' + roomId + '... (加密)');
    },
    disconnect() {
      console.log('❌ 🔐 断开连接 "' + roomId + '" room (加密)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // 实际的实现将会连接到服务器
  return {
    connect() {
      console.log('✅ 建立连接 "' + roomId + '... (未加密)');
    },
    disconnect() {
      console.log('❌ 断开连接 "' + roomId + '" room (未加密)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

在这个版本中，`App` 组件传递了一个布尔类型的 prop，而不是一个函数。在 Effect 内部，根据需要决定使用哪个函数。由于 `createEncryptedConnection` 和 `createUnencryptedConnection` 都是在组件外部声明的，它们不是响应式的，因此不需要作为依赖项。你可以在 [移除 Effect 依赖项](/learn/removing-effect-dependencies) 中了解更多相关内容。

</Solution>

#### 填充一系列选择框 {/*populate-a-chain-of-select-boxes*/}

当前的示例中有两个下拉框。一个下拉框允许用户选择一个行星，而另一个下拉框应该显示该选定行星上的地点。然而，目前这两个下拉框都还没有正常工作。你的任务是添加一些额外的代码，使得选择一个行星时，`placeList` 状态变量被填充为 `"/planets/" + planetId + "/places"` API 调用的结果。

如果你正确实现了这个功能，选择一个行星应该会填充地点列表，而更改行星应该会相应地改变地点列表。

<Hint>

如果你有两个独立的同步过程，需要编写两个单独的 Effect。

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
        console.log('获取了一个行星列表。');
        setPlanetList(result);
        setPlanetId(result[0].id); // 选择第一个行星
      }
    });
    return () => {
      ignore = true;
    }
  }, []);

  return (
    <>
      <label>
        选择一个行星：{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList?.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        选择一个地点：{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList?.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>你将要前往：{planetId || '...'} 的 {placeId || '...'} </p>
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
      throw Error('预期的 URL，如“/planets/earth/places”。 已收到："' + url + '"。');
    }
    return fetchPlaces(match[1]);
  } else throw Error('预期的 URL，如“/planets”或“/planets/earth/places”。已收到："' + url + '"。');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: '地球'
      }, {
        id: 'venus',
        name: '金星'
      }, {
        id: 'mars',
        name: '火星'        
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) 需要一个字符串参数。' +
      '而是收到：' + planetId + '。'
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      if (planetId === 'earth') {
        resolve([{
          id: 'laos',
          name: '老挝'
        }, {
          id: 'spain',
          name: '西班牙'
        }, {
          id: 'vietnam',
          name: '越南'        
        }]);
      } else if (planetId === 'venus') {
        resolve([{
          id: 'aurelia',
          name: '奥雷利亚'
        }, {
          id: 'diana-chasma',
          name: '戴安娜哈斯玛'
        }, {
          id: 'kumsong-vallis',
          name: 'Kŭmsŏng山谷'        
        }]);
      } else if (planetId === 'mars') {
        resolve([{
          id: 'aluminum-city',
          name: '铝城'
        }, {
          id: 'new-new-york',
          name: '纽纽约'
        }, {
          id: 'vishniac',
          name: '毗湿奴'
        }]);
      } else throw Error('未知的行星编号：' + planetId);
    }, 1000);
  });
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

有两个独立的同步过程：

- 第一个选择框与远程的行星列表进行同步。
- 第二个选择框与当前 `planetId` 对应的远程地点列表进行同步。

因此，将它们描述为两个单独的 Effect 是有意义的。下面是一个示例，展示如何实现这两个独立的同步过程：

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
        console.log('获取了一个行星列表。');
        setPlanetList(result);
        setPlanetId(result[0].id); // 选择第一个行星。
      }
    });
    return () => {
      ignore = true;
    }
  }, []);

  useEffect(() => {
    if (planetId === '') {
      // 第一个选择框还没有选中任何内容。
      return;
    }

    let ignore = false;
    fetchData('/planets/' + planetId + '/places').then(result => {
      if (!ignore) {
        console.log('Fetched a list of places on "' + planetId + '".');
        setPlaceList(result);
        setPlaceId(result[0].id); // 选择第一个地点
      }
    });
    return () => {
      ignore = true;
    }
  }, [planetId]);

  return (
    <>
      <label>
        选择一个行星：{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList?.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        选择一个地点：{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList?.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>你将要前往：{planetId || '...'} 的 {placeId || '...'} </p>
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
      throw Error('预期的 URL，如“/planets/earth/places”。 已收到："' + url + '"。');
    }
    return fetchPlaces(match[1]);
  } else throw Error('预期的 URL，如“/planets”或“/planets/earth/places”。已收到："' + url + '"。');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: '地球'
      }, {
        id: 'venus',
        name: '金星'
      }, {
        id: 'mars',
        name: '火星'        
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) 需要一个字符串参数。' +
      '而是收到：' + planetId + '。'
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      if (planetId === 'earth') {
        resolve([{
          id: 'laos',
          name: '老挝'
        }, {
          id: 'spain',
          name: '西班牙'
        }, {
          id: 'vietnam',
          name: '越南'        
        }]);
      } else if (planetId === 'venus') {
        resolve([{
          id: 'aurelia',
          name: '奥雷利亚'
        }, {
          id: 'diana-chasma',
          name: '戴安娜哈斯玛'
        }, {
          id: 'kumsong-vallis',
          name: 'Kŭmsŏng山谷'        
        }]);
      } else if (planetId === 'mars') {
        resolve([{
          id: 'aluminum-city',
          name: '铝城'
        }, {
          id: 'new-new-york',
          name: '纽纽约'
        }, {
          id: 'vishniac',
          name: '毗湿奴'
        }]);
      } else throw Error('未知的行星编号：' + planetId);
    }, 1000);
  });
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

这段代码有些重复。然而，将其合并为单个 Effect 的理由不充分！如果这样做，将不得不将两个 Effect 的依赖项合并为一个列表，这样改变行星时将重新获取所有行星的列表。Effect 并不是用于代码复用的工具。

相反，为了减少重复，可以将一些逻辑提取到一个自定义 Hook 中，比如下面的 `useSelectOptions`：

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
        选择一个行星：{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList?.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        选择一个地点：{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList?.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>你将要前往：{planetId || '...'} 的 {placeId || '...'} </p>
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
      throw Error('预期的 URL，如“/planets/earth/places”。 已收到："' + url + '"。');
    }
    return fetchPlaces(match[1]);
  } else throw Error('预期的 URL，如“/planets”或“/planets/earth/places”。已收到："' + url + '"。');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: '地球'
      }, {
        id: 'venus',
        name: '金星'
      }, {
        id: 'mars',
        name: '火星'        
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) 需要一个字符串参数。' +
      '而是收到：' + planetId + '。'
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      if (planetId === 'earth') {
        resolve([{
          id: 'laos',
          name: '老挝'
        }, {
          id: 'spain',
          name: '西班牙'
        }, {
          id: 'vietnam',
          name: '越南'        
        }]);
      } else if (planetId === 'venus') {
        resolve([{
          id: 'aurelia',
          name: '奥雷利亚'
        }, {
          id: 'diana-chasma',
          name: '戴安娜哈斯玛'
        }, {
          id: 'kumsong-vallis',
          name: 'Kŭmsŏng山谷'        
        }]);
      } else if (planetId === 'mars') {
        resolve([{
          id: 'aluminum-city',
          name: '铝城'
        }, {
          id: 'new-new-york',
          name: '纽纽约'
        }, {
          id: 'vishniac',
          name: '毗湿奴'
        }]);
      } else throw Error('未知的行星编号：' + planetId);
    }, 1000);
  });
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

请查看沙盒中的 `useSelectOptions.js` 标签以了解其工作原理。理想情况下，应用程序中的大多数 Effect 最终都应该由自定义 Hook 替代，无论是由你自己编写还是由社区提供。自定义 Hook 隐藏了同步逻辑，因此调用组件不知道 Effect 的存在。随着你继续开发应用程序，你将开发出一套可供选择的 Hooks，并且最终将不再经常在组件中编写 Effect。

</Solution>

</Challenges>
