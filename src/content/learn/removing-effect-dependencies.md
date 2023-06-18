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

In the sandbox above, the input only updates the `message` state variable. From the user's perspective, this should not affect the chat connection. However, every time you update the `message`, your component re-renders. When your component re-renders, the code inside of it runs again from scratch.

A new `options` object is created from scratch on every re-render of the `ChatRoom` component. React sees that the `options` object is a *different object* from the `options` object created during the last render. This is why it re-synchronizes your Effect (which depends on `options`), and the chat re-connects as you type.

**This problem only affects objects and functions. In JavaScript, each newly created object and function is considered distinct from all the others. It doesn't matter that the contents inside of them may be the same!**

```js {7-8}
// During the first render
const options1 = { serverUrl: 'https://localhost:1234', roomId: 'music' };

// During the next render
const options2 = { serverUrl: 'https://localhost:1234', roomId: 'music' };

// These are two different objects!
console.log(Object.is(options1, options2)); // false
```

**Object and function dependencies can make your Effect re-synchronize more often than you need.** 

This is why, whenever possible, you should try to avoid objects and functions as your Effect's dependencies. Instead, try moving them outside the component, inside the Effect, or extracting primitive values out of them.

#### Move static objects and functions outside your component {/*move-static-objects-and-functions-outside-your-component*/}

If the object does not depend on any props and state, you can move that object outside your component:

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

This way, you *prove* to the linter that it's not reactive. It can't change as a result of a re-render, so it doesn't need to be a dependency. Now re-rendering `ChatRoom` won't cause your Effect to re-synchronize.

This works for functions too:

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

Since `createOptions` is declared outside your component, it's not a reactive value. This is why it doesn't need to be specified in your Effect's dependencies, and why it won't ever cause your Effect to re-synchronize.

#### Move dynamic objects and functions inside your Effect {/*move-dynamic-objects-and-functions-inside-your-effect*/}

If your object depends on some reactive value that may change as a result of a re-render, like a `roomId` prop, you can't pull it *outside* your component. You can, however, move its creation *inside* of your Effect's code:

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

Now that `options` is declared inside of your Effect, it is no longer a dependency of your Effect. Instead, the only reactive value used by your Effect is `roomId`. Since `roomId` is not an object or function, you can be sure that it won't be *unintentionally* different. In JavaScript, numbers and strings are compared by their content:

```js {7-8}
// During the first render
const roomId1 = 'music';

// During the next render
const roomId2 = 'music';

// These two strings are the same!
console.log(Object.is(roomId1, roomId2)); // true
```

Thanks to this fix, the chat no longer re-connects if you edit the input:

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

However, it *does* re-connect when you change the `roomId` dropdown, as you would expect.

This works for functions, too:

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

You can write your own functions to group pieces of logic inside your Effect. As long as you also declare them *inside* your Effect, they're not reactive values, and so they don't need to be dependencies of your Effect.

#### Read primitive values from objects {/*read-primitive-values-from-objects*/}

Sometimes, you may receive an object from props:

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

The risk here is that the parent component will create the object during rendering:

```js {3-6}
<ChatRoom
  roomId={roomId}
  options={{
    serverUrl: serverUrl,
    roomId: roomId
  }}
/>
```

This would cause your Effect to re-connect every time the parent component re-renders. To fix this, read information from the object *outside* the Effect, and avoid having object and function dependencies:

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

The logic gets a little repetitive (you read some values from an object outside an Effect, and then create an object with the same values inside the Effect). But it makes it very explicit what information your Effect *actually* depends on. If an object is re-created unintentionally by the parent component, the chat would not re-connect. However, if `options.roomId` or `options.serverUrl` really are different, the chat would re-connect.

#### Calculate primitive values from functions {/*calculate-primitive-values-from-functions*/}

The same approach can work for functions. For example, suppose the parent component passes a function:

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

To avoid making it a dependency (and causing it to re-connect on re-renders), call it outside the Effect. This gives you the `roomId` and `serverUrl` values that aren't objects, and that you can read from inside your Effect:

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

This only works for [pure](/learn/keeping-components-pure) functions because they are safe to call during rendering. If your function is an event handler, but you don't want its changes to re-synchronize your Effect, [wrap it into an Effect Event instead.](#do-you-want-to-read-a-value-without-reacting-to-its-changes)

<Recap>

- Dependencies should always match the code.
- When you're not happy with your dependencies, what you need to edit is the code.
- Suppressing the linter leads to very confusing bugs, and you should always avoid it.
- To remove a dependency, you need to "prove" to the linter that it's not necessary.
- If some code should run in response to a specific interaction, move that code to an event handler.
- If different parts of your Effect should re-run for different reasons, split it into several Effects.
- If you want to update some state based on the previous state, pass an updater function.
- If you want to read the latest value without "reacting" it, extract an Effect Event from your Effect.
- In JavaScript, objects and functions are considered different if they were created at different times.
- Try to avoid object and function dependencies. Move them outside the component or inside the Effect.

</Recap>

<Challenges>

#### Fix a resetting interval {/*fix-a-resetting-interval*/}

This Effect sets up an interval that ticks every second. You've noticed something strange happening: it seems like the interval gets destroyed and re-created every time it ticks. Fix the code so that the interval doesn't get constantly re-created.

<Hint>

It seems like this Effect's code depends on `count`. Is there some way to not need this dependency? There should be a way to update the `count` state based on its previous value without adding a dependency on that value.

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

You want to update the `count` state to be `count + 1` from inside the Effect. However, this makes your Effect depend on `count`, which changes with every tick, and that's why your interval gets re-created on every tick.

To solve this, use the [updater function](/reference/react/useState#updating-state-based-on-the-previous-state) and write `setCount(c => c + 1)` instead of `setCount(count + 1)`:

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

Instead of reading `count` inside the Effect, you pass a `c => c + 1` instruction ("increment this number!") to React. React will apply it on the next render. And since you don't need to read the value of `count` inside your Effect anymore, so you can keep your Effect's dependencies empty (`[]`). This prevents your Effect from re-creating the interval on every tick.

</Solution>

#### Fix a retriggering animation {/*fix-a-retriggering-animation*/}

In this example, when you press "Show", a welcome message fades in. The animation takes a second. When you press "Remove", the welcome message immediately disappears. The logic for the fade-in animation is implemented in the `animation.js` file as plain JavaScript [animation loop.](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) You don't need to change that logic. You can treat it as a third-party library. Your Effect creates an instance of `FadeInAnimation` for the DOM node, and then calls `start(duration)` or `stop()` to control the animation. The `duration` is controlled by a slider. Adjust the slider and see how the animation changes.

This code already works, but there is something you want to change. Currently, when you move the slider that controls the `duration` state variable, it retriggers the animation. Change the behavior so that the Effect does not "react" to the `duration` variable. When you press "Show", the Effect should use the current `duration` on the slider. However, moving the slider itself should not by itself retrigger the animation.

<Hint>

Is there a line of code inside the Effect that should not be reactive? How can you move non-reactive code out of the Effect?

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
      // Jump to end immediately
      this.onProgress(1);
    } else {
      this.onProgress(0);
      // Start animating
      this.startTime = performance.now();
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress < 1) {
      // We still have more frames to paint
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

Your Effect needs to read the latest value of `duration`, but you don't want it to "react" to changes in `duration`. You use `duration` to start the animation, but starting animation isn't reactive. Extract the non-reactive line of code into an Effect Event, and call that function from your Effect.

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
      // We still have more frames to paint
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

Effect Events like `onAppear` are not reactive, so you can read `duration` inside without retriggering the animation.

</Solution>

#### Fix a reconnecting chat {/*fix-a-reconnecting-chat*/}

In this example, every time you press "Toggle theme", the chat re-connects. Why does this happen? Fix the mistake so that the chat re-connects only when you edit the Server URL or choose a different chat room.

Treat `chat.js` as an external third-party library: you can consult it to check its API, but don't edit it.

<Hint>

There's more than one way to fix this, but ultimately you want to avoid having an object as your dependency.

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
  // A real implementation would actually connect to the server
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

Your Effect is re-running because it depends on the `options` object. Objects can be re-created unintentionally, you should try to avoid them as dependencies of your Effects whenever possible.

The least invasive fix is to read `roomId` and `serverUrl` right outside the Effect, and then make the Effect depend on those primitive values (which can't change unintentionally). Inside the Effect, create an object and it pass to `createConnection`:

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
  // A real implementation would actually connect to the server
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

It would be even better to replace the object `options` prop with the more specific `roomId` and `serverUrl` props:

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
  // A real implementation would actually connect to the server
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

Sticking to primitive props where possible makes it easier to optimize your components later.

</Solution>

#### Fix a reconnecting chat, again {/*fix-a-reconnecting-chat-again*/}

This example connects to the chat either with or without encryption. Toggle the checkbox and notice the different messages in the console when the encryption is on and off. Try changing the room. Then, try toggling the theme. When you're connected to a chat room, you will receive new messages every few seconds. Verify that their color matches the theme you've picked.

In this example, the chat re-connects every time you try to change the theme. Fix this. After the fix, changing the theme should not re-connect the chat, but toggling encryption settings or changing the room should re-connect.

Don't change any code in `chat.js`. Other than that, you can change any code as long as it results in the same behavior. For example, you may find it helpful to change which props are being passed down.

<Hint>

You're passing down two functions: `onMessage` and `createConnection`. Both of them are created from scratch every time `App` re-renders. They are considered to be new values every time, which is why they re-trigger your Effect.

One of these functions is an event handler. Do you know some way to call an event handler an Effect without "reacting" to the new values of the event handler function? That would come in handy!

Another of these functions only exists to pass some state to an imported API method. Is this function really necessary? What is the essential information that's being passed down? You might need to move some imports from `App.js` to `ChatRoom.js`.

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

There's more than one correct way to solve this, but here is one possible solution.

In the original example, toggling the theme caused different `onMessage` and `createConnection` functions to be created and passed down. Since the Effect depended on these functions, the chat would re-connect every time you toggle the theme.

To fix the problem with `onMessage`, you needed to wrap it into an Effect Event:

```js {1,2,6}
export default function ChatRoom({ roomId, createConnection, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    // ...
```

Unlike the `onMessage` prop, the `onReceiveMessage` Effect Event is not reactive. This is why it doesn't need to be a dependency of your Effect. As a result, changes to `onMessage` won't cause the chat to re-connect.

You can't do the same with `createConnection` because it *should* be reactive. You *want* the Effect to re-trigger if the user switches between an encrypted and an unencryption connection, or if the user switches the current room. However, because `createConnection` is a function, you can't check whether the information it reads has *actually* changed or not. To solve this, instead of passing `createConnection` down from the `App` component, pass the raw `roomId` and `isEncrypted` values:

```js {2-3}
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
        onMessage={msg => {
          showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
        }}
      />
```

Now you can move the `createConnection` function *inside* the Effect instead of passing it down from the `App`:

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

After these two changes, your Effect no longer depends on any function values:

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

As a result, the chat re-connects only when something meaningful (`roomId` or `isEncrypted`) changes:

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

</Solution>

</Challenges>
