---
title: 移除 Effect 依赖项
---

<Intro>

当你写 Effect 的时候，代码检查工具会检查依赖项列表是否已经包含了 Effect 读取的每个响应式值（例如 props 和 state）。这可以保证 Effect 和组件最新的 props 以及 state 保持同步。不必要的依赖可能会导致 Effect 频繁运行，甚至造成无限循环。请跟随这篇指南来检查和移除你的 Effect 中不必要的依赖项。

</Intro>

<YouWillLearn>

- 怎样修复 Effect 依赖的无限循环
- 移除一个依赖项的时候要做些什么
- 怎样从 Effect 中读取一个值而不需要对他“做出响应”
- 怎样以及为什么要避免对象和函数依赖项
- 为什么抑制依赖项检查是危险的，以及应该怎么做

</YouWillLearn>

## 依赖项应该和代码匹配 {/*dependencies-should-match-the-code*/}

当你写 Effect 时，无论想要 Effect 做什么，首先要做的就是指明如何 [开始和结束](/learn/lifecycle-of-reactive-effects#the-lifecycle-of-an-effect)：

```js {5-7}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  	// ...
}
```

如果你将 Effect 依赖项置为空（`[]`），代码检查工具就会建议正确的依赖项：

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
  }, []); // <-- 修复这里的错误！
  return <h1>Welcome to the {roomId} room!</h1>;
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
  // 真正的实现会真的连接服务器
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

根据代码检查工具的建议填写依赖项：

```js {6}
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ 所有依赖项被声明
  // ...
}
```

[Effect 会对响应式值“做出响应”](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values)。由于 roomId 是响应式值（它会因为重新渲染而变化），代码检查工具会验证你是否已经将它指定为依赖项。每当 roomId 接收到一个不同的值，React 就会重新同步对应的 Effect。这可以保证聊天会一直和选中的房间保持连接，并对下拉框的变化“做出响应”：

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
  return <h1>Welcome to the {roomId} room!</h1>;
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
  // 真正的实现会真的连接服务器
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

### 移除一个依赖，需要先证明它不是依赖项 {/*to-remove-a-dependency-prove-that-its-not-a-dependency*/}

注意你不能“选择”Effect 的依赖项。Effect 代码中用到的每一个 <CodeStep step={2}>响应式值</CodeStep> 都必须在依赖项列表中声明。依赖项列表是由周围的代码决定的：

```js [[2, 3, "roomId"], [2, 5, "roomId"], [2, 8, "roomId"]]
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) { // 这是响应式值
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // 这个 Effect 读取了响应式值
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ 所以你必须将这个响应式值指定为 Effect 的依赖项
  // ...
}
```

[响应式值](/learn/lifecycle-of-reactive-effects#all-variables-declared-in-the-component-body-are-reactive) 包括 props 和直接在组件内部声明的所有变量和函数。因为 roomId 是响应式值，所以不能将它从依赖项列表中移除。这在代码检查工具中是不会通过的：

```js {8}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // 🔴 React Hook useEffect 缺少依赖项: 'roomId'
  // ...
}
```

代码检查工具是对的！因为 `roomId` 可能随着时间的过去而变化，这将在代码中引入 bug。

**移除依赖项需要向代码检查工具证明这个值不需要成为依赖项**。例如，你可以从组件中移除 `roomId` 来证明它不是响应式值且在重新渲染时不会变化：

```js {2,9}
const serverUrl = 'https://localhost:1234';
const roomId = 'music'; // 不再是响应式值

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ 声明的所有依赖
  // ...
}
```

既然 `roomId` 不是响应式值（并且在重渲染时不会变化），它就不需要作为依赖项：

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'music';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // 真正的实现会真的连接服务器
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

这就是为什么你现在可以指定一个 [空 (`[]`) 依赖项列表](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means)。Effect **实际上不再**依赖任何响应式值，所以当组件的任何 props 和 state 变化时，它**并不**需要重新运行。

### 修改依赖项之前先修改代码 {/*to-change-the-dependencies-change-the-code*/}

你可能已经注意到工作流中的一个模式：

1. 首先你要 **修改代码**，包括 Effect 或者声明响应式值的方式。
2. 然后遵循代码检查工具的建议并且调整依赖项使其 **匹配刚刚修改的代码**。
3. 如果你不满意依赖项列表，则 **返回第一步**（再次修改代码）。

最后一部分很重要。**如果你想修改依赖项，就要先修改周围的代码**。你可以把依赖项列表当成 Effect 代码中 [用到的所有响应式值的列表](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency)。不是你 **选择** 放什么到列表，而是列表 **描述** 了你的代码。想要修改依赖项列表，就要先修改代码。

这可能感觉像是解决一个方程式。你也许会从目标着手（例如移除依赖项），需要“找到”匹配目标的代码。不是每个人都对解决方程式感兴趣，写 Effect 也是这样！幸运的是下面有一些你可以尝试的常用方法列表。

<Pitfall>

如果你有一个已经存在的代码库，可能有像这样存在抑制代码检查工具的 Effect：

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 避免像这样抑制代码检查工具：
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

**当依赖项不匹配代码时，会增加引入 bug 的风险**。通过抑制代码检查工具，可以就 Effect 依赖的值对 React“撒谎”。

取而代之的是，使用下面的技巧。

</Pitfall>

<DeepDive>

#### 为什么抑制依赖项检查会很危险？ {/*why-is-suppressing-the-dependency-linter-so-dangerous*/}

抑制代码检查会导致非常不直观的 bug，它们很难被找到并修复。这里是一个案例：

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  function onTick() {
	setCount(count + increment);
  }

  useEffect(() => {
    const id = setInterval(onTick, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

假设你想要Effect“只在组件挂载”的时候运行。你知道 [空 (`[]`)依赖项](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means) 可以达到这个目的，所以你已经决定忽略代码检查工具的建议并且强制指定 `[]` 为依赖。

这个计数器本应该每秒增加一个数，这个数由两个按钮配置。但是因为你对 React“谎称”这个 Effect 不依赖任何值，所以 React 一直使用初始渲染时的 `onTick` 函数。[在这次渲染期间](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time)，`count` 是 `0`，`increment` 为 `1`。这就是为什么此次渲染的 `onTick` 总是每秒调用一次 `setCount(0 + 1)`，且你看到的总是 `1`。像这样的 bug，当它们跨越多个组件的时候更难修复。

比起忽略代码检查，有一个更好的解决方法！你需要向依赖项列表中加入 `onTick` 来修复这段代码。（为了确保 interval 只设置一次，需要 [让 `onTick` 成为 Effect Event](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events)。）

**我们推荐你像对待编译错误一样对待依赖项检查错误。如果你不抑制它，你就永远不会看到像这样的 bug**。这篇文档的剩余部分记录了这种这种场景下的一些替代方案。

</DeepDive>

## 移除非必要的依赖项 {/*removing-unnecessary-dependencies*/}

每次调整 Effect 的依赖项以反映代码时，看看依赖项列表。当任意依赖项变化时，Effect 重新运行有意义吗？有时候答案是“no”：

* 你可能想要在不同条件下重新执行 Effect 的 **不同部分**。
* 你可能想要只读取一些依赖项的 **最新值** 而不是对它的变化“做出响应”。
* 因为它是一个对象或者函数，所以一个依赖可能 **无意中** 会频繁变化。

为了找到合适的解决方案，你需要回答一些关于你的 Effect 的一些问题。让我们开始吧。

### 这段代码应该移动事件处理函数中吗？ {/*should-this-code-move-to-an-event-handler*/}

你首先应该思考的是这段代码是否应该是一个 Effect。

假设有一个表单。在提交的时候，设置 `submitted` state 变量为 `true`。你需要发送一个 POST 请求并且展示一个通知。你已经把逻辑放在了 Effect 里面，会对 `submitted` 变为 `true` “做出响应”：

```js {6-8}
function Form() {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) {
      // 🔴 Avoid: Effect 内部的 Event-specific 逻辑
      post('/api/register');
      showNotification('Successfully registered!');
    }
  }, [submitted]);

  function handleSubmit() {
    setSubmitted(true);
  }

  // ...
}
```

之后你需要根据当前的主题给通知信息设置样式，所以你需要读取当前的主题。由于 `theme` 在组件内声明，所以它是一个响应式值，所以你需要将它添加到依赖项：

```js {3,9,11}
function Form() {
  const [submitted, setSubmitted] = useState(false);
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (submitted) {
      // 🔴 Avoid: Effect 内部的 Event-specific 逻辑
      post('/api/register');
      showNotification('Successfully registered!', theme);
    }
  }, [submitted, theme]); // ✅ 声明的所有依赖

  function handleSubmit() {
    setSubmitted(true);
  }  

  // ...
}
```

这样做会引入一个 bug。假设你先提交了表单，然后在 Dark 和 Light 主题间切换。`theme` 会变化，Effect 就会重新运行，所以它又会展示同样的通知消息！

**这里的问题首先是这不应该是一个 Effect** 。你想要发送这个 POST 请求并且作为对“提交表单”这个特殊交互的响应展示通知。为了响应特殊交互而运行的一些代码，直接把这段逻辑放在相应的事件处理函数中：

```js {6-7}
function Form() {
  const theme = useContext(ThemeContext);

  function handleSubmit() {
    // ✅ Good: Event-specific 逻辑是从事件处理函数调用的
    post('/api/register');
    showNotification('Successfully registered!', theme);
  }  

  // ...
}
```

既然代码是在一个事件处理函数里，所以它不是响应式的 — 所以它只会在用户提交表单的时候运行。了解更多关于 [如何选择事件处理函数和 Effect](/learn/separating-events-from-effects#reactive-values-and-reactive-logic) 以及 [如何删除不必要的Effect](/learn/you-might-not-need-an-effect)。

### 你的 Effect 正在做若干不相关的事情吗？ {/*is-your-effect-doing-several-unrelated-things*/}

你应该扪心自问的下一个问题是你的 Effect 是否正在做若干不相关的事情。

假设你正在创建一个 shipping 表单，用户在里面需要选择他们的城市和地区。你根据选中的 `country` 从服务器获取 `cities` 列表并且在下拉菜单中展示：

```js
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  const [city, setCity] = useState(null);

  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [country]); // ✅ 声明的所有依赖

  // ...
```

这是一个 [在Effect中获取数据](/learn/you-might-not-need-an-effect#fetching-data) 的优秀示例。你正在根据 `country` prop 借助网络同步 `cities`  state。你无法在一个事件函数中去做这件事情，因为你需要 `ShippingForm` 只要展示就去获取数据，并在 `country` 变化时立即重新获取（无论是什么交互导致的）。

假设你现在正在因为添加城市区域二级选择框，这个选择框获取当前选中的 `city` 的 `areas`。你可能会从在同一个 Effect 内部添加第二个 `fetch` 调用获取区域列表开始：

```js {15-24,28}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);

  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    // 🔴 Avoid: 同一个 Effect 同步两个独立的进程
    if (city) {
      fetch(`/api/areas?city=${city}`)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setAreas(json);
          }
        });
    }
    return () => {
      ignore = true;
    };
  }, [country, city]); // ✅ 声明的所有依赖项

  // ...
```

但是由于 Effect 现在使用 `city` state 变量，你必须将 `city` 添加到依赖项列表中。相对地，这会引起一个问题：每当用户选择不同的城市，Effect 就会重新运行和调用 `fetchCities(country)`。结果就是，你需要多次不必要地重新获取城市列表。

**这段代码的问题在于你同时同步两个不相关的事物：**

1. 你想要基于 `country`  prop 将 `cities` state 同步到网络。
1. 你想要基于 `city` state 将 `areas` state 同步到网络。

将这段逻辑拆分成两个 Effect，每个 Effect 只对它需要同步的 prop 做出响应：

```js {19-33}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [country]); // ✅ 声明的所有依赖

  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);
  useEffect(() => {
    if (city) {
      let ignore = false;
      fetch(`/api/areas?city=${city}`)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setAreas(json);
          }
        });
      return () => {
        ignore = true;
      };
    }
  }, [city]); // ✅ 声明的所有依赖

  // ...
```

现在第一个 Effect 只在 `country` 变化时重新运行，而第二个 Effect 只在 `city` 变化时重新运行。你已经根据目的将他们进行了拆分：两个不同的事物由两个单独的 Effect 进行同步。两个独立的 Effect 有各自的依赖项列表，所以不会无意中相互触发。

最终代码比原本的代码更长，但是分割这些 Effect 的做法仍然是非常正确的。[每个 Effect 应该表示一个独立的同步进程](/learn/lifecycle-of-reactive-effects#each-effect-represents-a-separate-synchronization-process)。在这个例子中，删除一个 Effect 不会破坏其他 Effect 的逻辑。这意味着他们 **同步不同的事物**，并且拆分它们是有好处的。如果你担心重复，可以通过 [提取重复逻辑到自定义 Hook ](/learn/reusing-logic-with-custom-hooks#when-to-use-custom-hooks)来改进这段代码。

### 你正在读取一些 state 来计算下一个 state 吗？ {/*are-you-reading-some-state-to-calculate-the-next-state*/}

这个 Effect 会在每次新消息到达时通过新建数组来更新 state 变量 `messages`：

```js {2,6-8}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages([...messages, receivedMessage]);
    });
    // ...
```

它使用 `messages` 变量来 [创建一个以所有已经存在的消息开头的新数组](/learn/updating-arrays-in-state)，并且在末尾添加新消息。但是因为 `messages` 是在 Effect 中读取的响应式值，所以它必须被设置为依赖项：

```js {7,10}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages([...messages, receivedMessage]);
    });
    return () => connection.disconnect();
  }, [roomId, messages]); // ✅ 声明的所有依赖
  // ...
```

让 `messages` 成为依赖项会引发一个问题。

每当收到一个消息，`setMessages()` 会因为新 `messages` 数组包含接收到的消息而导致组件重新渲染。但是由于这个 Effect 现在依赖于 `messages`，这 **也** 会重新同步这个 Effect。所以每条新的消息都会让聊天室重新连接。用户并不希望这样！

为了修复这个问题，请不要在 Effect 内部读取 `messages` 值。而是传递一个 [更新函数](/reference/react/useState#updating-state-based-on-the-previous-state) 来 `setMessages`：

```js {7,10}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ 声明的所有依赖
  // ...
```

**注意你的 Effect 现在完全不会读取 `messages` 变量**。你只需要传递一个像 `msgs => [...msgs, receivedMessage]` 这样的更新函数。React [把你的更新函数放置在一个队列中](/learn/queueing-a-series-of-state-updates) 且在下一次渲染中提供 `msgs` 参数执行。这就是为什么 Effect 本身不再需要依赖  `messages` 的原因。这个修复的结果就是收到聊天消息将不会在使得聊天重新连接。

### 你想要只读取值而不对它的变化“做出响应”吗？ {/*do-you-want-to-read-a-value-without-reacting-to-its-changes*/}

<Wip>

本章节描述了一个在 React 稳定版本中 **还没有发布的试验性 API**:

</Wip>

假设你想要 `isMuted` 不是 `true` 的时候在用户收到一个新消息的时候播放声音：

```js {3,10-12}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
      if (!isMuted) {
        playSound();
      }
    });
    // ...
```

由于 Effect 现在在代码里使用了 `isMuted` ，所以必须把它加到依赖项中：

```js {10,15}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
      if (!isMuted) {
        playSound();
      }
    });
    return () => connection.disconnect();
  }, [roomId, isMuted]); // ✅ 声明的所有依赖
  // ...
```

问题是每次 `isMuted` 变化时（例如用户按下“静音”按钮），Effect 会重新同步，并且聊天会重新连接。这不是预期的用户体验！（在这个示例中，即使禁用了代码检查也不会生效--如果你这么做，`isMuted` 会卡在旧值）。

为了解决这个问题，你需要从 Effect 中提取出不应该是响应式的逻辑。你不希望这个 Effect 对  `isMuted` 的变化“做出响应”。[将这段非响应式代码移入一个Effect Event 中](/learn/separating-events-from-effects#declaring-an-effect-event)：

```js {1,7-12,18,21}
import { useState, useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  const onMessage = useEffectEvent(receivedMessage => {
    setMessages(msgs => [...msgs, receivedMessage]);
    if (!isMuted) {
      playSound();
    }
  });

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ 声明的所有依赖
  // ...
```

Effect Event 让你将一个 Effect 拆分成响应式部分（这部分应对像 `roomId` 这样的响应式值值以及他们的变化“做出响应”）和非响应式部分（这部分只读取它们的最新值，比如 `onMessage` 读取 `isMuted`）。**既然你在 Effect Event 内部读取了 `isMuted`，就不需要将它作为 Effect 的依赖项之一了**。最终结果是当你切换“静音”状态的开关时，聊天不会重新连接，解决了初始的问题！

#### 封装一个来自 props 的事件处理函数 {/*wrapping-an-event-handler-from-the-props*/}

当组件收到一个作为 prop 的事件处理函数时，你可能会遇到一个类似的问题：

```js {1,8,11}
function ChatRoom({ roomId, onReceiveMessage }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onReceiveMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId, onReceiveMessage]); // ✅ 声明的所有依赖
  // ...
```

假设父组件在每次渲染时都传递了一个 **不同的** `onReceiveMessage` 函数：

```js {3-5}
<ChatRoom
  roomId={roomId}
  onReceiveMessage={receivedMessage => {
    // ...
  }}
/>
```

由于 `onReceiveMessage` 是一个依赖项，所以它会在每次父组件重新渲染后引发 Effect 重新同步。这会让聊天要重新连接。为了解决这个问题，需要将其调用封装在一个 Effect Event 中：

```js {4-6,12,15}
function ChatRoom({ roomId, onReceiveMessage }) {
  const [messages, setMessages] = useState([]);

  const onMessage = useEffectEvent(receivedMessage => {
    onReceiveMessage(receivedMessage);
  });

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ 声明的所有依赖
  // ...
```


#### 拆分响应式代码和非响应式代码 {/*separating-reactive-and-non-reactive-code*/}

在这个示例中，你需要在每次 `roomId` 变化时记录一次访问。且需要在每个记录中包含当前的 `notificationCount`，但是你 **不** 希望 `notificationCount` 的变化触发 log 事件。

解决方案就是再将非响应式代码分割到一个 Effect Event 中：

```js {2-4,7}
function Chat({ roomId, notificationCount }) {
  const onVisit = useEffectEvent(visitedRoomId => {
    logVisit(visitedRoomId, notificationCount);
  });

  useEffect(() => {
    onVisit(roomId);
  }, [roomId]); // ✅ 声明的所有依赖
  // ...
}
```

你希望关于 `roomId` 的逻辑是响应式的，所以你在 Effect 内部读取 `roomId` 值。但是你不想因为 `notificationCount` 的变化而记录一次额外的访问，所以你在 Effect Event 内部读取 `notificationCount`。[了解更多如何通过 Effect Event 从 Effect 中读取最新的 props 和 state 值](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events)。

### 会有一些响应式值无意中变化吗？ {/*does-some-reactive-value-change-unintentionally*/}

有时候你 **确实** 希望 Effect 对某个值“做出响应”，但是那个值比预期的变化频率要高--并且从用户角度来说并没有实际变化。举个例子，假设你在组件内创建一个 `options` 对象，然后从 Effect 内部读取这个对象：

```js {3-6,9}
function ChatRoom({ roomId }) {
  // ...
  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    // ...
```

这个对象是在组件内部声明的，所以它是一个[响应式值](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values)。当你在 Effect 内部读取像这样的响应式值时，需要将它声明为依赖项之一。这保证了 Effect 一定会对它的变化“做出响应”：

```js {3,6}
  // ...
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ 声明的所有依赖
  // ...
```

将它声明为依赖非常重要！例如，这保证了如果 `roomId` 变化，Effect 会使用新的 `options` 重新连接聊天。但是上面的代码也存在一个问题。为了找到它，尝试在下面的输入框输入并且查看 console 处发生了什么：

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  // 临时禁用代码检查演示问题
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
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
export function createConnection({ serverUrl, roomId }) {
  // 现实的实现会真的连接到一个服务器
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

上面的沙盒输入框只更新了 state 变量 `message`。从用户角度来看，这不应该影响到聊天连接。但是每当你更新 `message`，组件就会重新渲染。而当组件重新渲染时，内部的代码又会重新开始。

每次重新渲染 `ChatRoom` 组件都会创建一个新的 `options` 对象。React 认为本次渲染期间创建的 `options` 和上一次渲染期间创建的 `options` 是 **不一样的**。这就是为什么你的 Effect（依赖于 `options`）重新渲染，并且当你输入的时候聊天会重新连接。

**这个问题只影响对象和函数。在 JavaScript 中，每一个新创建的对象和函数都被认为是和其他的对象和函数不一样。内部的内容是否相同并不会影响这一结果！**

```js {7-8}
// 第一次渲染期间
const options1 = { serverUrl: 'https://localhost:1234', roomId: 'music' };

// 第二次渲染期间
const options2 = { serverUrl: 'https://localhost:1234', roomId: 'music' };

// 这是两个不同的对象！
console.log(Object.is(options1, options2)); // false
```

**对象和函数依赖让 Effect 的重新同步频率高于你的需求**。

这就是为什么你应该尽可能避免将对象和函数作为 Effect 的依赖项。而是应该尝试将它们移动到组件外部，移入 Effect 内部或者从中提取初始值。

#### 从组件中移出静态对象和函数 {/*move-static-objects-and-functions-outside-your-component*/}

如果这个对象不依赖于任何 props 和 state，你就可以将它们从组件中移出去：

```js {1-4,13}
const options = {
  serverUrl: 'https://localhost:1234',
  roomId: 'music'
};

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ 声明的所有依赖
  // ...
```

这样，你就可以向代码检查工具“证明”它不是响应式的。它不会因为重新渲染而变化，所以它不需要成为依赖项之一。现在重新渲染 `ChatRoom` 组件将不会让 Effect 重新同步。

这对函数也有用：

```js {1-6,12}
function createOptions() {
  return {
    serverUrl: 'https://localhost:1234',
    roomId: 'music'
  };
}

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ 声明的所有依赖
  // ...
```

因为 `createOptions` 是在组件外部声明的，所以它不是响应式值。这就是为什么它不需要被指定为 Effect 的依赖项，并且不会引起 Effect 重新同步。

#### 将动态对象和函数移入 Effect {/*move-dynamic-objects-and-functions-inside-your-effect*/}

如果你的对象依赖于某些像 `roomId` prop 这样会因为重新渲染而变化的响应式值，你就不能将它移动到组件 **外部**。但是你可以将它的创建移动到 Effect 代码的内部：

```js {7-10,11,14}
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
  }, [roomId]); // ✅ 声明的所有依赖
  // ...
```

既然 `options` 是在 Effect 内部声明的，它就不再是依赖项了。而 Effect 唯一使用的响应式值是 `roomId`。因为 `roomId` 不是对象或者函数，你可以确保它不会有 **不符合预期的** 不同。在 JavaScript 中，number 和  string 是通过内容进行比较的：

```js {7-8}
// 第一次渲染期间
const roomId1 = 'music';

// 第二次渲染期间
const roomId2 = 'music';

// 这两个字符串是一样的！
console.log(Object.is(roomId1, roomId2)); // true
```

由于这个修复，如果你再修改输入值，聊天不会再重新连接了：

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
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
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
export function createConnection({ serverUrl, roomId }) {
  // 真正的实现会真的连接服务器
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

但是当你修改 `roomId` 时，**还是** 会和预期的一样重新连接。

这对函数也有效：

```js {7-12,14}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() {
      return {
        serverUrl: serverUrl,
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ 声明的所有依赖
  // ...
```

你可以写自己的函数来对 Effect 内部的逻辑进行分组。只要你还在 Effect **内部** 声明了它们，就不是响应式值，所以也不需要成为 Effect 的依赖项。

#### 从对象中读取基本值 {/*read-primitive-values-from-objects*/}

有时候你可能会从 props 中接收到一个对象：

```js {1,5,8}
function ChatRoom({ options }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ 声明的所有依赖
  // ...
```

这里的风险在于父组件会在渲染期间创建这个对象：

```js {3-6}
<ChatRoom
  roomId={roomId}
  options={{
    serverUrl: serverUrl,
    roomId: roomId
  }}
/>
```

这会导致 Effect 会在每次父组件重新渲染时重新连接。为了修复这个问题，从 Effect **外部** 的对象读取信息，并且避免拥有对象和函数依赖：

```js {4,7-8,12}
function ChatRoom({ options }) {
  const [message, setMessage] = useState('');

  const { roomId, serverUrl } = options;
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ 声明的所有依赖
  // ...
```

这段逻辑有一点重复了（你从 Effect 外部读取了某些值，然后在内部又创建了一个有同样值的对象）。但是它会明确 Effect **实际** 依赖的是什么。如果父组件意外地重新创建了一个对象，聊天也不会重新连接。但是如果 `options.roomId` 或者 `options.serverUrl` 真的变化了，聊天就会重新连接。

#### 通过函数计算基本值 {/*calculate-primitive-values-from-functions*/}

同样的方法对函数也有效。例如假设父组件传递了一个函数：

```js {3-8}
<ChatRoom
  roomId={roomId}
  getOptions={() => {
    return {
      serverUrl: serverUrl,
      roomId: roomId
    };
  }}
/>
```

为了避免让它成为依赖项（会导致聊天在重新渲染中重新连接），而是在 Effect 外部调用。这会给你一个非对象的 `roomId` 和 `serverUrl` 值，并且你可以从 Effect 内部读取这个值：

```js {1,4}
function ChatRoom({ getOptions }) {
  const [message, setMessage] = useState('');

  const { roomId, serverUrl } = getOptions();
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ 声明的所有依赖
  // ...
```

这只对 [纯](/learn/keeping-components-pure) 函数有效，因为他们在渲染期间调用是安全的。如果你的函数是一个事件处理函数，但是你不想它的变化重新同步  Effect，[那就把它封装进一个 Effect Event](#do-you-want-to-read-a-value-without-reacting-to-its-changes)。

<Recap>

- 依赖应该永远和代码匹配。
- 当你不满意依赖项时，你需要做的就是修改代码。
- 抑制代码检查工具会引起令人疑惑的 bug，你应该永远避免这种行为。
- 为了移除依赖项，你需要向代码检查工具“证明”它不是必要的。
- 如果一些代码应该只在特定交互的时候运行，那就将这段代码移动到事件处理函数。
- 如果你的 Effect 中部分代码需要因为不同的原因重新运行，那你需要将它分割成若干个 Effect。
- 如果你想要更新一些基于之前 state 值的state，那就传递一个更新函数。
- 如果你想要读取最新的值而不用对它“做出响应”，那就从你的 Effect 中提取出一个 Effect Event 。
- 在 JavaScript 中，对象和函数如果是在不同时间创建的就会被认为是不一样的。
- 尝试避免对象和函数依赖。把它们移动到组件外部或者 Effect 内部。

</Recap>

<Challenges>

#### 修复重置时间间隔 {/*fix-a-resetting-interval*/}

这个 Effect 设置了一个每秒 tick 一次的时间间隔。你已经注意到发生了一些奇怪的现象：每次 tick 的时候看上去像 interval 被销毁又被重新创建。修复这段代码，这样不会一直重新创建 interval。

<Hint>

这个 Effect 的代码似乎依赖于 `count`。有什么方法可以不需要这个依赖吗？应该有一个方法可以基于之前的值更新 `count` state，而不需要将这个值添加为依赖项。

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('✅ Creating an interval');
    const id = setInterval(() => {
      console.log('⏰ Interval tick');
      setCount(count + 1);
    }, 1000);
    return () => {
      console.log('❌ Clearing an interval');
      clearInterval(id);
    };
  }, [count]);

  return <h1>Counter: {count}</h1>
}
```

</Sandpack>

<Solution>

你想要在 Effect 内部将 `count` state 更新为 `count + 1` 。但是这会让你的 Effect 依赖于 `count`，它每次 tick 的时候都会变化，这也是为什么每一个 tick 你的 interval 都会被重新创建的原因。

为了解决这个问题，我们使用 [更新函数](/reference/react/useState#updating-state-based-on-the-previous-state) 并且编写时使用 `setCount(count + 1)` 代替 `setCount(c => c + 1)`：

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('✅ Creating an interval');
    const id = setInterval(() => {
      console.log('⏰ Interval tick');
      setCount(c => c + 1);
    }, 1000);
    return () => {
      console.log('❌ Clearing an interval');
      clearInterval(id);
    };
  }, []);

  return <h1>Counter: {count}</h1>
}
```

</Sandpack>

你传递了一个 `c => c + 1` 指令（“增加这个数字！”）给 React，而不是在 Effect 内部读取 `count`。React 将在下一次渲染中使用。并且因为你不再需要在 Effect 内部读取 `count` 的值，所以可以保持 Effect 依赖为空 (`[]`)。这会阻止 Effect 在每一次的 tick 中重新创建 interval。

</Solution>

#### 修复一个重新触发动画 {/*fix-a-retriggering-animation*/}

在这个示例中，当你点击“Show”，一个欢迎信息会淡入式出现。这个动画需要 １ 秒钟。当你点击“Remove”，欢迎信息会立刻消失。渐入动画的逻辑在 `animation.js` 文件中以普通的 JavaScript [动画循环](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) 实现。你不需要修改这段逻辑。可以将它看作是第三方库。Effect 为 DOM 节点创建了 `FadeInAnimation` 实例,然后调用 `start(duration)` 或者 `stop()` 来控制动画。`duration` 由一个滑块控制。调整滑块看动画如何变化。

这段代码已经达到目的了，但是你需要修改一些东西。当你现在移动 state 变量 `duration` 控制滑块时，它会重新触发动画。修改这个行为，让 Effect 不会对 `duration` 变量的变化“做出响应”。当你按“Show”, Effect 应该使用滑块当前的 `duration`。但是单独移动滑块本身不应该重新触发动画。

<Hint>

这个 Effect 有代码不应该是响应式的吗？如何从 Effect 中移出非响应式代码呢？

</Hint>

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
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
import { useState, useEffect, useRef } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { FadeInAnimation } from './animation.js';

function Welcome({ duration }) {
  const ref = useRef(null);

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(duration);
    return () => {
      animation.stop();
    };
  }, [duration]);

  return (
    <h1
      ref={ref}
      style={{
        opacity: 0,
        color: 'white',
        padding: 50,
        textAlign: 'center',
        fontSize: 50,
        backgroundImage: 'radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)'
      }}
    >
      Welcome
    </h1>
  );
}

export default function App() {
  const [duration, setDuration] = useState(1000);
  const [show, setShow] = useState(false);

  return (
    <>
      <label>
        <input
          type="range"
          min="100"
          max="3000"
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
        />
        <br />
        Fade in duration: {duration} ms
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome duration={duration} />}
    </>
  );
}
```

```js animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    if (this.duration === 0) {
      // 立刻跳转到结束
      this.onProgress(1);
    } else {
      this.onProgress(0);
      // 开始动画
      this.startTime = performance.now();
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress < 1) {
      // 我们仍然有更多的帧需要绘制
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onProgress(progress) {
    this.node.style.opacity = progress;
  }
  stop() {
    cancelAnimationFrame(this.frameId);
    this.startTime = null;
    this.frameId = null;
    this.duration = 0;
  }
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
```

</Sandpack>

<Solution>

你的 Effect 需要读取 `duration` 的最新值，但你不想要对 `duration` 的变化做出响应。你用 `duration` 启动动画，但是启动动画不是响应式的。所以需要提取非响应式代码到 Effect Event，并且在你的 Effect 中调用这个函数。

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
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
import { useState, useEffect, useRef } from 'react';
import { FadeInAnimation } from './animation.js';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

function Welcome({ duration }) {
  const ref = useRef(null);

  const onAppear = useEffectEvent(animation => {
    animation.start(duration);
  });

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    onAppear(animation);
    return () => {
      animation.stop();
    };
  }, []);

  return (
    <h1
      ref={ref}
      style={{
        opacity: 0,
        color: 'white',
        padding: 50,
        textAlign: 'center',
        fontSize: 50,
        backgroundImage: 'radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)'
      }}
    >
      Welcome
    </h1>
  );
}

export default function App() {
  const [duration, setDuration] = useState(1000);
  const [show, setShow] = useState(false);

  return (
    <>
      <label>
        <input
          type="range"
          min="100"
          max="3000"
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
        />
        <br />
        Fade in duration: {duration} ms
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome duration={duration} />}
    </>
  );
}
```

```js animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    this.onProgress(0);
    this.startTime = performance.now();
    this.frameId = requestAnimationFrame(() => this.onFrame());
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress < 1) {
      //我们仍还有更多的帧需要绘制
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onProgress(progress) {
    this.node.style.opacity = progress;
  }
  stop() {
    cancelAnimationFrame(this.frameId);
    this.startTime = null;
    this.frameId = null;
    this.duration = 0;
  }
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
```

</Sandpack>

像 `onAppear` 这样的 Effect Event 是非响应式的，所以你可以在不重新触发动画的情况下读取到内部的 `duration`。

</Solution>

#### 修复一个聊天重新连接问题 {/*fix-a-reconnecting-chat*/}

在这个示例中，每次你按压 “Toggle theme”，聊天就会重新连接。为什么会这样呢？修复这个错误，让它只在你修改 Server URL 或选择不同聊天室的时候重新连接。

将 `chat.js` 看成是一个外部的第三方库：你可以查询它的 API，但不可以修改。

<Hint>

有不止一个方法修复这个问题，但是最终你需要避免将一个对象作为依赖项。

</Hint>

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle theme
      </button>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
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
      <ChatRoom options={options} />
    </div>
  );
}
```

```js ChatRoom.js active
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ options }) {
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);

  return <h1>Welcome to the {options.roomId} room!</h1>;
}
```

```js chat.js
export function createConnection({ serverUrl, roomId }) {
  // 真正的实现会实际连接到服务器
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
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
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

<Solution>

你的 Effect 由于依赖 `options` 对象所以正在重新运行。对象可以意外被创建，你应该尽可能避免用它们作为 Effect 的依赖项。

侵入性最小的修复方案是在 Effect 外部读取 `roomId` 和 `serverUrl`，然后使得这个 Effect 依赖于这些基本值（不会意外被修改）。在 Effect 内部创建一个对象并传递给 `createConnection`：

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle theme
      </button>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
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
      <ChatRoom options={options} />
    </div>
  );
}
```

```js ChatRoom.js active
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ options }) {
  const { roomId, serverUrl } = options;
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return <h1>Welcome to the {options.roomId} room!</h1>;
}
```

```js chat.js
export function createConnection({ serverUrl, roomId }) {
  // 真正的实现会实际连接到服务器
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
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
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

更好的方法是使用更多指定的 `roomId` 和 `serverUrl` props 来取代对象类型的 `options` prop： 

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle theme
      </button>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
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
      <ChatRoom
        roomId={roomId}
        serverUrl={serverUrl}
      />
    </div>
  );
}
```

```js ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ roomId, serverUrl }) {
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js chat.js
export function createConnection({ serverUrl, roomId }) {
  // 真正的实现会实际连接到服务器
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
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
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

尽可能坚持使用基本类型的 props 会让之后的组件优化更加容易。

</Solution>

#### 再次修复一个聊天重新连接问题 {/*fix-a-reconnecting-chat-again*/}

这个示例使用加密或非加密形式连接到聊天室。切换复选框并且注意当加密为 on 和 off 时 console 中的不同信息。尝试修改聊天室。然后切换主题。当你连接到一个聊天室，你将每隔几秒就会收到一条新的信息。验证他们的颜色是否和你选择的主题匹配。

在这个示例中，每当你试图修改主题，聊天就会重新连接。修复这个问题。修复结束之后，主题变化应该不会使得聊天重新连接，但是切换加密设置或者变更聊天室应该使聊天重新连接。

不要修改 `chat.js` 中的任何代码。除此之外，你可以修改任何会导致同样行为的代码。例如，你可能发现修改正在传递的 props 会有帮助。

<Hint>

你正在传递两个函数： `onMessage` 和 `createConnection`。这两个函数都是每次 `App` 重新渲染的时候重新创建的。它们每次都被认为是新的值，这就是会重新触发 Effect 的原因。

这些函数之一是事件处理函数。你知道哪些方法可以在 Effect 中调用事件处理函数而不对事件处理函数的新值“做出响应”吗？这会派上用场！

其中另一个函数仅用于将某些 state 传递给导入的 API 方法。这个函数真的有必要吗？正在传递的基本信息是什么？你可能需要将某些导入从 `App.js` 移动到 `ChatRoom.js`。

</Hint>

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
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

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';
import { showNotification } from './notifications.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
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
      <ChatRoom
        roomId={roomId}
        onMessage={msg => {
          showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
        }}
        createConnection={() => {
          const options = {
            serverUrl: 'https://localhost:1234',
            roomId: roomId
          };
          if (isEncrypted) {
            return createEncryptedConnection(options);
          } else {
            return createUnencryptedConnection(options);
          }
        }}
      />
    </>
  );
}
```

```js ChatRoom.js active
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function ChatRoom({ roomId, createConnection, onMessage }) {
  useEffect(() => {
    const connection = createConnection();
    connection.on('message', (msg) => onMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [createConnection, onMessage]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js chat.js
export function createEncryptedConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ 🔐 Connecting to "' + roomId + '" room... (encrypted)');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}

export function createUnencryptedConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room (unencrypted)...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}
```

```js notifications.js
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
label, button { display: block; margin-bottom: 5px; }
```

</Sandpack>

<Solution>

解决这个问题的正确方法不止这一种，但是这里只给出了一个可能的解决方案。

在原来的代码中，切换主题会导致重新创建和传递不同的 `onMessage` 和 `createConnection` 函数。因为 Effect 依赖于这些函数，所以每次切换主题，聊天都会重新连接。

为了修复 `onMessage` 这个问题，你需要将其封装进一个 Effect Event：

```js {1,2,6}
export default function ChatRoom({ roomId, createConnection, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    // ...
```

和 `onMessage` prop 不一样，`onReceiveMessage` Effect Event 不是响应式的。这就是为什么它不需要成为 Effect 的依赖项。最终结果是 `onMessage` 的变化不会引起聊天重新连接。

你不可以对 `createConnection` 做同样的事情，因为它 **应该是** 响应式的。如果用户切换加密和非加密连接或者切换当前聊天室的时候，你 **想要** Effect 重新触发。但是因为 `createConnection` 是一个函数，所以你不能检测它读取的信息是否 **实际** 变化了。为了解决这个问题，你需要传原始的 `roomId` 和 `isEncrypted` 值，而不是从 `App` 组件传递 `createConnection`：

```js {2-3}
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
        onMessage={msg => {
          showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
        }}
      />
```

现在你可以移动 `createConnection` 函数到 Effect **内部**，而不是将它从 `App` 中传递下去：

```js {1-4,6,10-20}
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
      if (isEncrypted) {
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }
    // ...
```

经过这两个修改后，你的 Effect 不再依赖任何函数值：

```js {1,8,10,21}
export default function ChatRoom({ roomId, isEncrypted, onMessage }) { // Reactive values
  const onReceiveMessage = useEffectEvent(onMessage); // Not reactive

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId // Reading a reactive value
      };
      if (isEncrypted) { // Reading a reactive value
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }

    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]); // ✅ All dependencies declared
```

最终，只有在某些有意义的值（`roomId` 或 `isEncrypted`）变化时，聊天才会重新连接：

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
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

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

import { showNotification } from './notifications.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
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
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
        onMessage={msg => {
          showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
        }}
      />
    </>
  );
}
```

```js ChatRoom.js active
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
      if (isEncrypted) {
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }

    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js chat.js
export function createEncryptedConnection({ serverUrl, roomId }) {
  // 真正的实现会实际连接到服务器
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ 🔐 Connecting to "' + roomId + '" room... (encrypted)');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}

export function createUnencryptedConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room (unencrypted)...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}
```

```js notifications.js
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
label, button { display: block; margin-bottom: 5px; }
```

</Sandpack>

</Solution>

</Challenges>
