---
title: 使用自定义Hook重用逻辑
---

<Intro>

React带有一些内置的Hook，比如`useState`， `useContext`和`useEffect`。有时候你需要一个用途更加特定的Hook：比如远程获取数据，追踪用户是否在线，或者连接一个聊天室。在React中可能找不到这些Hook，但是你可以根据自己应用的需求取创建自己的Hook。

</Intro>

<YouWillLearn>

- 什么是自定义Hook，以及如何写自己的Hook
- 如何在组件间重用逻辑
- 如何命名和构建你的自定义Hook
- 提取自定义Hook的时机和原因

</YouWillLearn>

## 自定义Hook：在组件间共享逻辑 {/*custom-hooks-sharing-logic-between-components*/}

假设你正在开发一款重度依赖网络的应用（和大多数应用一样）。当用户使用你的应用时，如果网络意外断开，你想要警告用户。你会如何处理这种情况呢？看上去你在组件中需要两个东西：

1. 一个追踪网络是否在线的state。
2. 一个订阅全局[`在线`](https://developer.mozilla.org/en-US/docs/Web/API/Window/online_event)和[`离线`](https://developer.mozilla.org/en-US/docs/Web/API/Window/offline_event)事件以及更新上述state的Effect。

这将让你的组件与网络状态保持[同步](/learn/synchronizing-with-effects)。你可以像这样开始：

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}
```

</Sandpack>

尝试开启和关闭网络，注意`StatusBar`应对你的行为是如何更新的。

现在假设你想要在一个不同的组件里**也**使用这段相同的逻辑。你想实现一个Save按钮，当网络离线时，这个按钮会变成不可用并且显示“Reconnecting...”而不是“Save”。

你可以通过复制和粘贴`isOnline` state和Effect到`SaveButton`开始：

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function SaveButton() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}
```

</Sandpack>

验证一下，如果关闭网络，按钮会变更展示。

这两个组件都工作正常，但是不幸的是他们之间的逻辑重复了。即使两个组件看上去有不同的**视觉界面**，你也想要重用他们之间的逻辑。

### 从组件中提取出你的自定义Hook {/*extracting-your-own-custom-hook-from-a-component*/}

想象一下，与[`useState`](/reference/react/useState)和[`useEffect`](/reference/react/useEffect)类似，有一个内置的`useOnlineStatus`Hook。那么就可以简化这两个组件并且移除他们之间的重复部分：

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}
```

尽管目前没有这样的内置Hook，但是你可以自己写。声明一个`useOnlineStatus`函数，并且把早前组件里的所有重复代码移到里面：

```js {2-16}
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

在函数结尾处，返回 `isOnline`。这可以让组件读取到那个值：

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js useOnlineStatus.js
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

</Sandpack>

验证切换网络状态是否更新了两个组件。

现在你的组件里没有那么多重复的逻辑了。**更重要的是，组件中的代码描述了他们想要做什么（使用在线状态！），而不是如何做（通过订阅浏览器事件完成）**

当提取逻辑到自定义Hook中时，你可以隐藏如何处理一些外部系统或者浏览器API的艰难细节。组件中的代码表达的是你的目的而不是实现。

### Hook的名称必须永远以 `use`开头 {/*hook-names-always-start-with-use*/}

React 应用是由组件构建的。组件是由内置的或者自定义的Hook构建的。你可能经常使用别人创建的自定义Hook，但是偶尔也可能要自己写！

你必须遵循以下这些命名公约：

1. **React组件名称必须以大写字母开头**， 比如 `StatusBar` 和 `SaveButton`。React 组件还需要返回一些React知道如何展示的内容，比如一段JSX代码。
2. **Hook的名称必须以 `use`开头，后面跟一个大写字母**， 像 [`useState`](/reference/react/useState) (内置) 或者 `useOnlineStatus` (像文章早前的自定义Hook)。Hook可能会返回任意值。

这个公约保证了你始终可以查看组件并且知道它的state，Effect以及其他的React特性可能“隐藏”在哪里。例如如果你在组件内部看见`getColor()`的函数调用，你可以确定它内部不可能包含React state，因为它的名称没有以`use`开头。但是像`useOnlineStatus()`这样的函数调用将极有可能包含对内部其他Hook的调用！

<Note>

如果为[React配置了](/learn/editor-setup#linting)检查工具，它会强制执行这个命名公约。滑动到上面的sandbox，并将`useOnlineStatus`重命名为`getOnlineStatus`。注意检查工具将不会再允许你在内部调用`useState` 或者 `useEffect`。只有Hook和组件可以调用其他Hook！

</Note>

<DeepDive>

#### 渲染期间调用的所有函数都应该以前缀use开头么？ {/*should-all-functions-called-during-rendering-start-with-the-use-prefix*/}

不是。没有**调用**Hook的函数不需要**成为**Hook。

如果你的函数没有调用任何Hook，请避免使用`use` 前缀。 而是**不带**`use`前缀，把它作为常规函数去写。例如下面的`useSorted` 没有调用Hook，所以叫它 `getSorted`：

```js
// 🔴 避免：没有调用其他Hook的Hook
function useSorted(items) {
  return items.slice().sort();
}

// ✅ Good：没有使用Hook的常规函数
function getSorted(items) {
  return items.slice().sort();
}
```

这保证了你的代码可以在包括条件语句在内的任何地方调用这个常规函数：

```js
function List({ items, shouldSort }) {
  let displayedItems = items;
  if (shouldSort) {
    // ✅ 在条件分支里调用getSorted()是没问题的，因为它不是Hook
    displayedItems = getSorted(items);
  }
  // ...
}
```

如果内部至少使用了一个Hook，你应该给这个函数`use`前缀（从而让它成为一个Hook）：

```js
// ✅ Good：一个使用了其他Hook的Hook
function useAuth() {
  return useContext(Auth);
}
```

从技术上讲，这不是React强制的。原则上你可以写一个不调用其他Hook的Hook。这常常会令人迷惑且受到限制，所以最好是避免那种方式。但是在极少一些场景下，它可能是有帮助的。例如也许你的函数现在没有使用任何Hook，但是计划未来会添加一些Hook调用。那么使用`use`前缀给它命名就很有意义：

```js {3-4}
// ✅ Good：之后即将可能使用一些其他Hook的一个Hook
function useAuth() {
  // TODO: 当认证功能实现以后，替换这一行：
  // 返回 useContext(Auth)；
  return TEST_USER;
}
```

接下来组件就不能在条件分支里调用这个函数。当你在里面添加了Hook调用时，这一点将变得很重要。如果你没有计划在内部使用Hook（现在或者之后），就不要让它成为一个Hook。

</DeepDive>

### 自定义Hook共享的是状态逻辑，而不是state本身 {/*custom-hooks-let-you-share-stateful-logic-not-state-itself*/}

之前的例子里，当你开启或关闭网络时，两个组件一起更新了。但是两个组件共享一个`isOnline`state变量的想法是错误的。看这段代码：

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  // ...
}

function SaveButton() {
  const isOnline = useOnlineStatus();
  // ...
}
```

它的工作方式和你提取重复部分之前一样：

```js {2-5,10-13}
function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    // ...
  }, []);
  // ...
}

function SaveButton() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    // ...
  }, []);
  // ...
}
```

这是两个完全独立的state变量和Effect！他们只是碰巧同时有同样的值，因为你将两个组件与相同的外部值同步（无论网络是否开启）。

为了更好的说明这一点，我们需要一个不同的例子。看下面的 `Form` 组件：

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('Mary');
  const [lastName, setLastName] = useState('Poppins');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <label>
        First name:
        <input value={firstName} onChange={handleFirstNameChange} />
      </label>
      <label>
        Last name:
        <input value={lastName} onChange={handleLastNameChange} />
      </label>
      <p><b>Good morning, {firstName} {lastName}.</b></p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

每个表单域都有一些重复的逻辑：

1. 都有state（`firstName` 和 `lastName`）。
1. 都有change handler（`handleFirstNameChange` 和 `handleLastNameChange`）。
1. 都有为输入框指定`value` 和 `onChange`属性的JSX片段。

你可以把重复的逻辑提取到自定义Hook`useFormInput`：

<Sandpack>

```js
import { useFormInput } from './useFormInput.js';

export default function Form() {
  const firstNameProps = useFormInput('Mary');
  const lastNameProps = useFormInput('Poppins');

  return (
    <>
      <label>
        First name:
        <input {...firstNameProps} />
      </label>
      <label>
        Last name:
        <input {...lastNameProps} />
      </label>
      <p><b>Good morning, {firstNameProps.value} {lastNameProps.value}.</b></p>
    </>
  );
}
```

```js useFormInput.js active
import { useState } from 'react';

export function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue);

  function handleChange(e) {
    setValue(e.target.value);
  }

  const inputProps = {
    value: value,
    onChange: handleChange
  };

  return inputProps;
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

注意它只声明了**一个**叫做 `value` 的state变量。

但是`Form`组件调用了**两次**`useFormInput`：

```js
function Form() {
  const firstNameProps = useFormInput('Mary');
  const lastNameProps = useFormInput('Poppins');
  // ...
```

这就是为什么它工作的时候像声明了两个独立的state变量！

**自定义Hook只是共享状态逻辑而不是state本身。每个Hook的调用都完全独立于对同一个Hook的其他调用**。 这就是为什么上面两个sandbox完全相同的原因。如果你愿意，可以滚动回去并比较他们。提取自定义Hook之前和之后的行为是一致的。

而当你需要在多个组件之间共享state本身时，需要[将变量提升并传递下去](/learn/sharing-state-between-components)。

## 在Hook之间传递响应值 {/*passing-reactive-values-between-hooks*/}

组件每次重新渲染，自定义Hook中的代码也会重新运行。这就是为什么组件和自定义Hook都[需要纯粹](/learn/keeping-components-pure)的原因。我们应该把自定义Hook的代码作为组件主体的一部分。

自定义组件总会接收到最新的props和state，因为它会和你的组件一起重新渲染。想知道这意味着什么，看一下这个聊天室的例子。变更Server URL或者聊天室ID：

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

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
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notifications.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
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
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
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
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl + '');
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

export function showNotification(message, theme = 'dark') {
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

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

当你修改`serverUrl`或者`roomId`时，Effect会对[你的修改做出“反应”](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values)和重新同步。你可以通过修改Effect依赖引起的聊天室重连的每次console信息来区分。

现在把Effect代码移动到自定义Hook中：

```js {2-13}
export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

这让你的`ChatRoom`组件调用自定义Hook,不需要担心内部是如何工作：

```js {4-7}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

这看上去简洁多了！（但是它做的是同一件事情。）

注意逻辑**仍然响应** prop和state修改。尝试编辑server URL或者选中的房间：

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

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
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js ChatRoom.js active
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js useChatRoom.js
import { useEffect } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notifications.js';

export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
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
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
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
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl + '');
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

export function showNotification(message, theme = 'dark') {
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

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

注意你是如何获取到Hook的返回值：

```js {2}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

并且把它作为输入传递给另外一个Hook：

```js {6}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

每次`ChatRoom`组件重新渲染，它都会传最新的`roomId`和`serverUrl`到你的Hook中。这就是为什么每当他们的值在重新渲染后不同的时候你的Effect会重连聊天室。（如果你曾经使用过音视频处理软件，像这样的链式Hook也许会让你想起链式可视化或音频effect。就好像`useState` 的输出作为 `useChatRoom`的输入）。

### 把事件处理器传到自定义Hook中 {/*passing-event-handlers-to-custom-hooks*/}

<Wip>

这个章节描述React稳定版中**还没有发布的实验性API**。

</Wip>

当你在更多组件中使用`useChatRoom`组件时，你也许想要让组件自定义它的行为。例如现在Hook中收到信息时做什么的逻辑是硬编码：

```js {9-11}
export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

假设你想要把这个逻辑移回到组件中：

```js {7-9}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl,
    onReceiveMessage(msg) {
      showNotification('New message: ' + msg);
    }
  });
  // ...
```

完成这个工作需要修改自定义Hook，把`onReceiveMessage`作为命名选项之一：

```js {1,10,13}
export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onReceiveMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl, onReceiveMessage]); // ✅ 声明了所有的依赖
}
```

这将会生效，但是当自定义Hook接受事件处理器的时候，你还可以做另一个改进。

增加一个`onReceiveMessage`依赖并不理想，每次只要组件重新渲染，聊天就会重新连接。[将这个事件处理器包装到Effect Event从而将它从依赖中移除](/learn/removing-effect-dependencies#wrapping-an-event-handler-from-the-props)：

```js {1,4,5,15,18}
import { useEffect, useEffectEvent } from 'react';
// ...

export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  const onMessage = useEffectEvent(onReceiveMessage);

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ 声明所有依赖
}
```

现在聊天室不会在每次`ChatRoom` 组件重新渲染时都重新连接。这是一个传递事件处理器给自定义Hook的例子，你可以尝试一下：

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

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
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js ChatRoom.js active
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';
import { showNotification } from './notifications.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl,
    onReceiveMessage(msg) {
      showNotification('New message: ' + msg);
    }
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js useChatRoom.js
import { useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection } from './chat.js';

export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  const onMessage = useEffectEvent(onReceiveMessage);

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
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
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
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
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl + '');
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

export function showNotification(message, theme = 'dark') {
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

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

注意你不再需要为了使用它而去了解`useChatRoom`是**如何**工作的。你可以把它添加到其他任意组件，传递其他任意选项，而它会以同样的方式工作。这就是自定义Hook的强大之处。

## 什么时候使用自定义Hook {/*when-to-use-custom-hooks*/}

你不需要把每段重复的代码提取为自定义Hook。一些重复是可以的。例如像早前用来包裹单个`useState`调用的`useFormInput`Hook可能就是没有必要的。

但是每当你写Effect的时候，请考虑一下把它包裹在自定义Hook会不会更清晰。[你不应该经常使用Effect](/learn/you-might-not-need-an-effect)，所以如果你正在写Effect就意味着你需要“走出React”来和一些外部系统同步，或者需要做一些React中没有内置API的事。把重复代码包装进自定义Hook可以让你准确表达你的意图和数据在里面是如何流动的。

例如假设 `ShippingForm` 组件展示两个下拉框：一个展示城市列表，另一个展示选中的城市的区域列表。你可能会像这样开始写代码：

```js {3-16,20-35}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  // 这个Effect拉取一个国家的城市数据
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
  }, [country]);

  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);
  // 这个Effect拉取选中城市的区域列表
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
  }, [city]);

  // ...
```

尽管这部分代码是重复的，但是[把这些Effect各自分开是正确的](/learn/removing-effect-dependencies#is-your-effect-doing-several-unrelated-things)。他们同步两个不同的事情，所以你不应该把他们合并到同一个Effect。取而代之的是，你可以提取他们的通用逻辑到你自己的`useData` Hook中来简化上面的`ShippingForm` 组件：

```js {2-18}
function useData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    if (url) {
      let ignore = false;
      fetch(url)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setData(json);
          }
        });
      return () => {
        ignore = true;
      };
    }
  }, [url]);
  return data;
}
```

现在你可以调用`useData`代替`ShippingForm`组件中的Effect：

```js {2,4}
function ShippingForm({ country }) {
  const cities = useData(`/api/cities?country=${country}`);
  const [city, setCity] = useState(null);
  const areas = useData(city ? `/api/areas?city=${city}` : null);
  // ...
```

提取自定义Hook可以让数据流清晰。你可以输入`url`，输出 `data`。通过把你的Effect“隐藏”在`useData`中，也可以防止一些正在处理`ShippingForm`组件的人向里面添加[不必要的依赖](/learn/removing-effect-dependencies)。随着时间的推移，你app中的大部分Effect都会存在于自定义Hook中。

<DeepDive>

#### 让你的自定义Hook专注于具体的高级用例 {/*keep-your-custom-hooks-focused-on-concrete-high-level-use-cases*/}

从选择你的自定义Hook名称开始。如果你难以选择一个清晰的名称，这意味着你的Effect和组件逻辑的剩余部分耦合度太高，还没有准备好被提取出来。

理想情况下，你的自定义Hook名称应该清晰到即使一个不经常写代码的人也能很好地猜中你的自定义Hook的功能，输入和返回：

* ✅ `useData(url)`
* ✅ `useImpressionLog(eventName, extraData)`
* ✅ `useChatRoom(options)`

当你和外部系统同步的时候，你的自定义Hook名称可能会更加专业，并使用该系统特定的术语。只要这个名称对于熟悉这个系统的人来说清晰，那就是好的：

* ✅ `useMediaQuery(query)`
* ✅ `useSocket(url)`
* ✅ `useIntersectionObserver(ref, options)`

**保持自定义Hook专注于具体的高级用例**。避免创建和使用作为`useEffect`API本身的替代品和wrapper的自定义“生命周期”Hook：

* 🔴 `useMount(fn)`
* 🔴 `useEffectOnce(fn)`
* 🔴 `useUpdateEffect(fn)`

例如这个 `useMount` Hook试图保证一些代码只在“加载”的时候运行：

```js {4-5,14-15}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // 🔴 避免：使用自定义 "lifecycle" Hook
  useMount(() => {
    const connection = createConnection({ roomId, serverUrl });
    connection.connect();

    post('/analytics/event', { eventName: 'visit_chat' });
  });
  // ...
}

// 🔴 避免：创建自定义 "lifecycle" Hook
function useMount(fn) {
  useEffect(() => {
    fn();
  }, []); // 🔴 React Hook useEffect 缺少依赖项: 'fn'
}
```

**像`useMount`这样的自定义“生命周期” Hook不能很好的适应React模式**。例如示例代码有一个错误（它没有“响应” `roomId`或`serverUrl`的变化），但是代码检查工具并不会向你发出对应的告警，因为代码检查工具只能检测直接的`useEffect`调用。它并不了解你的Hook。

如果你正在编写Effect，请从直接使用React API开始：

```js
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // ✅ Good: 通过用途分割的两个原始Effect

  useEffect(() => {
    const connection = createConnection({ serverUrl, roomId });
    connection.connect();
    return () => connection.disconnect();
  }, [serverUrl, roomId]);

  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_chat', roomId });
  }, [roomId]);

  // ...
}
```

然后你可以（但不是必须）为不同的高级用例提取自定义Hook：

```js
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // ✅ Great: 以用途命名的自定义Hook
  useChatRoom({ serverUrl, roomId });
  useImpressionLog('visit_chat', { roomId });
  // ...
}
```

**一个好的自定义Hook通过限制功能使代码调用更具声明性**。例如`useChatRoom(options)`只能连接聊天室，而`useImpressionLog(eventName, extraData)`只能向分析系统发送impression日志。如果你的自定义Hook API 没有约束用例且非常抽象，那么在长期的运行中，比起它解决的问题，可能会引入更多问题。

</DeepDive>

### 自定义Hook帮助你迁移到更好的模式 {/*custom-hooks-help-you-migrate-to-better-patterns*/}

Effect是一个[“应急出口”](/learn/escape-hatches):当你需要“走出React”且对于你的用例没有更好的内置解决方案的时候你可以使用他们。随着时间的推移，React团队的目标是通过给更多特定问题提供特定解决方案来最小化应用中的Effect数量。把你的Effect包裹进自定义Hook会使得这些解决方案可用的时候升级代码更加容易。

让我们回到这个例子：

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js useOnlineStatus.js active
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

</Sandpack>

在上面的例子中，`useOnlineStatus`借助[`useState`](/reference/react/useState)和[`useEffect`](/reference/react/useEffect) 实现。但这不是最好的解决方案。它有许多没有考虑到的边界用例。例如假设当组件加载的时候，`isOnline`已经是 `true`，但是如果网络已经离线的话这就是错误的。你可以使用浏览器的[`navigator.onLine`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine)API来检查，但是直接在生成初始HTML的服务器上使用它是不生效的。简而言之这段代码可以改进。

幸运的是，React 18包含了一个叫做[`useSyncExternalStore`]的专用API，它可以解决所有这些问题。这里是如何利用这个新API来重写你的`useOnlineStatus` Hook：

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js useOnlineStatus.js active
import { useSyncExternalStore } from 'react';

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

export function useOnlineStatus() {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine, // 如何在客户端获取值
    () => true // 如何在服务端获取值
  );
}

```

</Sandpack>

注意**不需要修改任何组件**如何来完成这次迁移：

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  // ...
}

function SaveButton() {
  const isOnline = useOnlineStatus();
  // ...
}
```

这是为什么把Effect包裹进自定义Hook是有益的另一个原因：

1. 你让进出Effect的数据流非常清晰。
2. 你让组件专注于目标，而不是Effect的实现。
3. 当React增加新特性时，你可以在不修改你的任何组件的情况下移除这些Effect。

和[设计系统](https://uxdesign.cc/everything-you-need-to-know-about-design-systems-54b109851969)类似，你可能会发现从应用的组件中提取通用逻辑到自定义Hook是非常有帮助的。这会让你的组件代码专注于目标，避免经常写原始Effect。许多很棒的自定义Hook是由React社区维护的。

<DeepDive>

#### React会为远程数据获取提供内置的解决方案么？ {/*will-react-provide-any-built-in-solution-for-data-fetching*/}

我们仍然在规划细节，但是期望未来可以像这样写远程数据获取：

```js {1,4,6}
import { use } from 'react'; // 还不可用！

function ShippingForm({ country }) {
  const cities = use(fetch(`/api/cities?country=${country}`));
  const [city, setCity] = useState(null);
  const areas = city ? use(fetch(`/api/areas?city=${city}`)) : null;
  // ...
```

比起在每个组件手动写原始Effect，如果你在应用中使用像上面的`useData`这样的自定义Hook，迁移到最终推荐方式所需要的更改更少。但是旧的方式仍然可以有效工作，所以如果你喜欢写原始Effect，你可以继续这样做。

</DeepDive>

### 不止一个方法达到这个目的 {/*there-is-more-than-one-way-to-do-it*/}

假设你想要使用浏览器的[`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)API实现一个**从头开始的**渐入动画。你可能会从一个建立动画循环的Effect开始。在动画的每一帧中，你可以修改[ref持有的](/learn/manipulating-the-dom-with-refs)DOM节点的opacity属性直到它为`1`。你的代码可能这样开始：

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';

function Welcome() {
  const ref = useRef(null);

  useEffect(() => {
    const duration = 1000;
    const node = ref.current;

    let startTime = performance.now();
    let frameId = null;

    function onFrame(now) {
      const timePassed = now - startTime;
      const progress = Math.min(timePassed / duration, 1);
      onProgress(progress);
      if (progress < 1) {
        // 我们还有更多的帧需要绘制
        frameId = requestAnimationFrame(onFrame);
      }
    }

    function onProgress(progress) {
      node.style.opacity = progress;
    }

    function start() {
      onProgress(0);
      startTime = performance.now();
      frameId = requestAnimationFrame(onFrame);
    }

    function stop() {
      cancelAnimationFrame(frameId);
      startTime = null;
      frameId = null;
    }

    start();
    return () => stop();
  }, []);

  return (
    <h1 className="welcome" ref={ref}>
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

为了让组件更具有可读性，你可能要将逻辑提取到自定义Hook`useFadeIn`：

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js useFadeIn.js
import { useEffect } from 'react';

export function useFadeIn(ref, duration) {
  useEffect(() => {
    const node = ref.current;

    let startTime = performance.now();
    let frameId = null;

    function onFrame(now) {
      const timePassed = now - startTime;
      const progress = Math.min(timePassed / duration, 1);
      onProgress(progress);
      if (progress < 1) {
        // 我们还有更多的帧需要绘制
        frameId = requestAnimationFrame(onFrame);
      }
    }

    function onProgress(progress) {
      node.style.opacity = progress;
    }

    function start() {
      onProgress(0);
      startTime = performance.now();
      frameId = requestAnimationFrame(onFrame);
    }

    function stop() {
      cancelAnimationFrame(frameId);
      startTime = null;
      frameId = null;
    }

    start();
    return () => stop();
  }, [ref, duration]);
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

你可以让`useFadeIn` 和原来保持一致，但是也可以更进一步重构。例如你可以把创建动画循环的逻辑从`useFadeIn`提取到自定义Hook`useAnimationLoop`：

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js useFadeIn.js active
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export function useFadeIn(ref, duration) {
  const [isRunning, setIsRunning] = useState(true);

  useAnimationLoop(isRunning, (timePassed) => {
    const progress = Math.min(timePassed / duration, 1);
    ref.current.style.opacity = progress;
    if (progress === 1) {
      setIsRunning(false);
    }
  });
}

function useAnimationLoop(isRunning, drawFrame) {
  const onFrame = useEffectEvent(drawFrame);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const startTime = performance.now();
    let frameId = null;

    function tick(now) {
      const timePassed = now - startTime;
      onFrame(timePassed);
      frameId = requestAnimationFrame(tick);
    }

    tick();
    return () => cancelAnimationFrame(frameId);
  }, [isRunning]);
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

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

</Sandpack>

但是你**没有必要**这样做。和常规函数一样，最终是由你决定在哪里绘制代码不同部分之间的边界。你也可以采取不一样的方法。把大部分必要的逻辑移入一个[JavaScript类](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)，而不是把逻辑保留在Effect中：

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js useFadeIn.js active
import { useState, useEffect } from 'react';
import { FadeInAnimation } from './animation.js';

export function useFadeIn(ref, duration) {
  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(duration);
    return () => {
      animation.stop();
    };
  }, [ref, duration]);
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
    if (progress === 1) {
      this.stop();
    } else {
      // 我们还有更多的帧要绘制
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
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

Effect可以将React和外部系统连接起来。Effect之间需要的协调越多（例如链接多个动画），像上面的sandbox一样**完整地**从Effect和Hook中提取逻辑就越有意义。然后你提取的代码**变成**“外部系统”。这会让你的 Effect保持简单化，因为他们只需要向已经移动到React外部的系统发送消息。

上面这个例子假设需要使用JavaScript写fade-in逻辑。但是使用纯[CSS 动画](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations)实现这个特定的fade-in会更加简单和高效：

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import './welcome.css';

function Welcome() {
  return (
    <h1 className="welcome">
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```css styles.css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
```

```css welcome.css active
.welcome {
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);

  animation: fadeIn 1000ms;
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

```

</Sandpack>

某些时候你甚至不需要Hook！

<Recap>

- 自定义Hook让你可以在组件间共享逻辑。
- 自定义Hook命名必须以后面跟着一个大写字母的`use`开头。
- 自定义Hook共享的只是有状态的逻辑，而不是state 本身。
- 你可以将响应值从一个Hook传到另一个，并且他们保持最新。
- 每次你的组件重新渲染时，所有的Hook会重新运行。
- 自定义Hook的代码应该和组件代码一样保持纯粹。
- 把自定义Hook收到的事件处理器封装到Effect Event。
- 不要创建像`useMount`这样的自定义Hook。保持目标具体化。
- 如何以及在哪里选择代码边界取决于你自己。

</Recap>

<Challenges>

#### 提取一个 `useCounter` Hook {/*extract-a-usecounter-hook*/}

这个组件使用了一个state变量和一个Effect来展示每秒递增的一个数字。把逻辑提取到一个`useCounter`的自定义Hook中。你的目标是让`Counter` 组件的实现看上去和这个一样：

```js
export default function Counter() {
  const count = useCounter();
  return <h1>Seconds passed: {count}</h1>;
}
```

你需要在 `useCounter.js`中编写你的自定义Hook，并且把它引入到`Counter.js` 文件。

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return <h1>Seconds passed: {count}</h1>;
}
```

```js useCounter.js
// 在这个文件中编写你的自定义Hook!
```

</Sandpack>

<Solution>

你的代码应该像这样：

<Sandpack>

```js
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter();
  return <h1>Seconds passed: {count}</h1>;
}
```

```js useCounter.js
import { useState, useEffect } from 'react';

export function useCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return count;
}
```

</Sandpack>

注意`App.js` 不再需要引入`useState` 或者 `useEffect`。

</Solution>

#### 让计时器的delay变为可配置 {/*make-the-counter-delay-configurable*/}

这个例子中有一个由滑动条控制的state变量`delay`，但是它的值没有被用到。请将`delay`值传给你的自定义Hook `useCounter`，修改`useCounter` Hook，用传过去的`delay`代替硬编码`1000`毫秒。

<Sandpack>

```js
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const [delay, setDelay] = useState(1000);
  const count = useCounter();
  return (
    <>
      <label>
        Tick duration: {delay} ms
        <br />
        <input
          type="range"
          value={delay}
          min="10"
          max="2000"
          onChange={e => setDelay(Number(e.target.value))}
        />
      </label>
      <hr />
      <h1>Ticks: {count}</h1>
    </>
  );
}
```

```js useCounter.js
import { useState, useEffect } from 'react';

export function useCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return count;
}
```

</Sandpack>

<Solution>

使用`useCounter(delay)`将`delay`传入你的Hook。然后在Hook内部使用`delay` 而不是硬编码`1000`。你需要向你的Effect依赖项中加入`delay`。这保证了`delay`的变化会重置间隔时间。

<Sandpack>

```js
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const [delay, setDelay] = useState(1000);
  const count = useCounter(delay);
  return (
    <>
      <label>
        Tick duration: {delay} ms
        <br />
        <input
          type="range"
          value={delay}
          min="10"
          max="2000"
          onChange={e => setDelay(Number(e.target.value))}
        />
      </label>
      <hr />
      <h1>Ticks: {count}</h1>
    </>
  );
}
```

```js useCounter.js
import { useState, useEffect } from 'react';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
  return count;
}
```

</Sandpack>

</Solution>

#### 从 `useCounter`中提取 `useInterval` {/*extract-useinterval-out-of-usecounter*/}

现在`useCounter` Hook做两件事。设置一个时间间隔，并且在每个时间间隔的tick内递增一次state变量。将设置时间间隔的逻辑拆分到到一个`useInterval`的独立Hook中。它应该输入两个参数：`onTick` 回调函数和`delay`。修改后`useCounter` 的实现应该如下所示：

```js
export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

在 `useInterval.js` 文件中编写`useInterval` 并在 `useCounter.js`文件中导入。

<Sandpack>

```js
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter(1000);
  return <h1>Seconds passed: {count}</h1>;
}
```

```js useCounter.js
import { useState, useEffect } from 'react';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
  return count;
}
```

```js useInterval.js
// 在这里编写你自己的Hook!
```

</Sandpack>

<Solution>

`useInterval`内部的逻辑应该是设置和清除计时器。不需要做除此之外的任何事。

<Sandpack>

```js
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter(1000);
  return <h1>Seconds passed: {count}</h1>;
}
```

```js useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js useInterval.js active
import { useEffect } from 'react';

export function useInterval(onTick, delay) {
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => clearInterval(id);
  }, [onTick, delay]);
}
```

</Sandpack>

请注意这个解决方案有一些你将会下一个挑战中解决的问题。

</Solution>

#### 修复计时器重置 {/*fix-a-resetting-interval*/}

这个例子有**两个**独立的计时器。

`App`组件调用`useCounter`，这个Hook调用`useInterval`来每秒更新一次计数器。但是`App`组件**也**调用`useInterval`来每两秒随机更新一次页面背景色。

更新页面背景色的回调函数因为一些原因从未执行。在 `useInterval`内部添加一些log。

```js {2,5}
  useEffect(() => {
    console.log('✅ Setting up an interval with delay ', delay)
    const id = setInterval(onTick, delay);
    return () => {
      console.log('❌ Clearing an interval with delay ', delay)
      clearInterval(id);
    };
  }, [onTick, delay]);
```

这些log符合你的预期吗？如果你的一些Effect似乎不必要的重新同步了，你能猜中哪一个依赖导致这个情况发生吗？有其他方式从你的Effect中[移除依赖](/learn/removing-effect-dependencies)吗？

你修复这个问题以后，应该希望页面背景每两秒更新一次。

<Hint>

看上去你的`useInterval` Hook接受事件监听器作为参数。你能想到一些包裹事件监听器的方法，这样它不需要成为你的Effect的依赖项吗？

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
import { useCounter } from './useCounter.js';
import { useInterval } from './useInterval.js';

export default function Counter() {
  const count = useCounter(1000);

  useInterval(() => {
    const randomColor = `hsla(${Math.random() * 360}, 100%, 50%, 0.2)`;
    document.body.style.backgroundColor = randomColor;
  }, 2000);

  return <h1>Seconds passed: {count}</h1>;
}
```

```js useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js useInterval.js
import { useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export function useInterval(onTick, delay) {
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => {
      clearInterval(id);
    };
  }, [onTick, delay]);
}
```

</Sandpack>

<Solution>

和[早前这个页面](/learn/reusing-logic-with-custom-hooks#passing-event-handlers-to-custom-hooks)做的一样，在`useInterval`内部，把tick回调函数包裹进一个Effect Event。

这将让你可以从Effect的依赖项中删掉`onTick`。每次组件重新渲染时，Effect将不会重新同步，所以页面背景颜色更新间隔不会在有机会触发之前每秒重置一次。

随着这个修改，两个interval都会像预期的一样工作并且不会互相干预：

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
import { useCounter } from './useCounter.js';
import { useInterval } from './useInterval.js';

export default function Counter() {
  const count = useCounter(1000);

  useInterval(() => {
    const randomColor = `hsla(${Math.random() * 360}, 100%, 50%, 0.2)`;
    document.body.style.backgroundColor = randomColor;
  }, 2000);

  return <h1>Seconds passed: {count}</h1>;
}
```

```js useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js useInterval.js active
import { useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export function useInterval(callback, delay) {
  const onTick = useEffectEvent(callback);
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => clearInterval(id);
  }, [delay]);
}
```

</Sandpack>

</Solution>

#### 实现一个交错的运动 {/*implement-a-staggering-movement*/}

这个例子中，`usePointerPosition()`Hook追踪当前指针位置。尝试移动光标或你的手指到预览区域上方，看到有一个红点随着你移动。它的位置被保存在变量`pos1`中。

事实上，有5(!)个不同的红点正在被渲染。你看不见是因为他们都出现在了同一位置。这就是你需要修复的问题。你想要实现的是一个“交错的”运动：每个圆点应该“跟随”它前一个点的路径。例如如果你快速移动光标，第一个点应该立刻跟着它，第二个应该在小小的延时后跟上第一个点，第三个点应该跟着第二个点等。

你需要实现自定义Hook `useDelayedValue`。它当前的实现是返回提供给它的`value`。而你想从`delay`毫秒之前返回`value`。你可能需要一些state和一个Effect来完成这个任务。

实现`useDelayedValue`后，你应该看见这些点一个接一个运动。

<Hint>

你需要在自定义Hook内部存储一个state变量`delayedValue`。当`value`变化时，你需要运行一个Effect。这个Effect应该在`delay`毫秒后更新`delayedValue`。你可能发现调用`setTimeout`很有帮助。

这个Effect 需要清除吗？为什么？

</Hint>

<Sandpack>

```js
import { usePointerPosition } from './usePointerPosition.js';

function useDelayedValue(value, delay) {
  // TODO: 实现这个Hook
  return value;
}

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos3, 50);
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

```js usePointerPosition.js
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

```css
body { min-height: 300px; }
```

</Sandpack>

<Solution>

这里是一个生效的版本。你将`delayedValue`保存为一个state变量。当`value`更新的时候，你的Effect会安排一个timeout来更新`delayedValue`。这就是`delayedValue`总是滞后于真实的`value`的原因。

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { usePointerPosition } from './usePointerPosition.js';

function useDelayedValue(value, delay) {
  const [delayedValue, setDelayedValue] = useState(value);

  useEffect(() => {
    setTimeout(() => {
      setDelayedValue(value);
    }, delay);
  }, [value, delay]);

  return delayedValue;
}

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos3, 50);
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

```js usePointerPosition.js
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

```css
body { min-height: 300px; }
```

</Sandpack>

请注意这个Effect **不**需要清理。如果你在清理函数中调用了`clearTimeout`，那么每当`value`变化时，就会终止已经计划好的timeout。为了保持运动连续，你想要触发所有的timeout。

</Solution>

</Challenges>
