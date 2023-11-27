---
title: useSyncExternalStore
---

<Intro>

`useSyncExternalStore` 是一个让你订阅外部 store 的 React Hook。

```js
const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)
```

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)` {/*usesyncexternalstore*/}

在组件顶层调用 `useSyncExternalStore` 以从外部 store 读取值。

```js
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  // ...
}
```

它返回 store 中数据的快照。你需要传两个函数作为参数：

1. `subscribe` 函数应当订阅该 store 并返回一个取消订阅的函数。
2. `getSnapshot` 函数应当从该 store 读取数据的快照。

[请查看下面更多的例子](#usage)。

#### 参数 {/*parameters*/}

* `subscribe`：一个函数，接收一个单独的 `callback` 参数并把它订阅到 store 上。当 store 发生改变，它应当调用被提供的 `callback`。这会导致组件重新渲染。`subscribe` 函数会返回清除订阅的函数。

* `getSnapshot`：一个函数，返回组件需要的 store 中的数据快照。在 store 不变的情况下，重复调用 `getSnapshot` 必须返回同一个值。如果 store 改变，并且返回值也不同了（用 [`Object.is`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 比较），React 就会重新渲染组件。

* **可选** `getServerSnapshot`：一个函数，返回 store 中数据的初始快照。它只会在服务端渲染时，以及在客户端进行服务端渲染内容的 hydration 时被用到。快照在服务端与客户端之间必须相同，它通常是从服务端序列化并传到客户端的。如果你忽略此参数，在服务端渲染这个组件会抛出一个错误。

#### 返回值 {/*returns*/}

该 store 的当前快照，可以在你的渲染逻辑中使用。

#### 警告 {/*caveats*/}

* `getSnapshot` 返回的 store 快照必须是不可变的。如果底层 store 有可变数据，要在数据改变时返回一个新的不可变快照。否则，返回上次缓存的快照。

* 如果在重新渲染时传入一个不同的 `subscribe` 函数，React 会用新传入的 `subscribe` 函数重新订阅该 store。你可以通过在组件外声明 `subscribe` 来避免。

* 如果在 [非阻塞 transition 更新](/reference/react/useTransition) 过程中更改了 store，React 将会回退并将该更新视为阻塞更新。具体来说，在每次 transition 更新时，React 将在将更改应用到 DOM 之前第二次调用 `getSnapshot`。如果它返回的值与最初调用时不同，React 将重新从头开始进行更新，这次将其作为阻塞更新应用，以确保屏幕上的每个组件都反映 store 的相同版本。

* 不建议根据 `useSyncExternalStore` 返回的 store 值暂停渲染。原因是对外部 store 的变更无法被标记为 [非阻塞 transition 更新](/reference/react/useTransition)，因此它们会触发最近的 [`Suspense` 后备方案](/reference/react/Suspense)，用加载旋转器替换已经呈现在屏幕上的内容，通常会导致较差的用户体验。

  例如，以下操作是不建议的：

  ```js
  const LazyProductDetailPage = lazy(() => import('./ProductDetailPage.js'));

  function ShoppingApp() {
    const selectedProductId = useSyncExternalStore(...);

    // ❌ Calling `use` with a Promise dependent on `selectedProductId`
    const data = use(fetchItem(selectedProductId))

    // ❌ Conditionally rendering a lazy component based on `selectedProductId`
    return selectedProductId != null ? <LazyProductDetailPage /> : <FeaturedProducts />;
  }
  ```

---

## 使用 {/*usage*/}

### 订阅外部 store {/*subscribing-to-an-external-store*/}

你的多数组件只会从它们的 [props](/learn/passing-props-to-a-component)，[state](/reference/react/useState)，以及 [context](/reference/react/useContext) 读取数据。然而，有时一个组件需要从一些 React 之外的 store 读取一些随时间变化的数据。这包括：

* 在 React 之外持有状态的第三方状态管理库
* 暴露出一个可变值及订阅其改变事件的浏览器 API

在组件顶层调用 `useSyncExternalStore` 以从外部 store 读取值。

```js [[1, 5, "todosStore.subscribe"], [2, 5, "todosStore.getSnapshot"], [3, 5, "todos", 0]]
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  // ...
}
```

它返回 store 中数据的 <CodeStep step={3}>快照</CodeStep>。你需要传两个函数作为参数：

1. <CodeStep step={1}>`subscribe` 函数</CodeStep>应当订阅 store 并返回一个取消订阅函数。
2. <CodeStep step={2}>`getSnapshot` 函数</CodeStep>应当从 store 中读取数据的快照。

React 会用这些函数来保持你的组件订阅到 store 并在它改变时重新渲染。

例如，在下面的沙盒中，`todosStore` 被实现为一个保存 React 之外数据的外部 store。`TodosApp` 组件通过 `useSyncExternalStore` Hook 连接到外部 store。

<Sandpack>

```js
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

export default function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  return (
    <>
      <button onClick={() => todosStore.addTodo()}>Add todo</button>
      <hr />
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}
```

```js todoStore.js
// 这是一个第三方 store 的例子，
// 你可能需要把它与 React 集成。

// 如果你的应用完全由 React 构建，
// 我们推荐使用 React state 替代。

let nextId = 0;
let todos = [{ id: nextId++, text: 'Todo #1' }];
let listeners = [];

export const todosStore = {
  addTodo() {
    todos = [...todos, { id: nextId++, text: 'Todo #' + nextId }]
    emitChange();
  },
  subscribe(listener) {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },
  getSnapshot() {
    return todos;
  }
};

function emitChange() {
  for (let listener of listeners) {
    listener();
  }
}
```

</Sandpack>

<Note>

当可能的时候，我们推荐通过 [`useState`](/reference/react/useState) 和 [`useReducer`](/reference/react/useReducer) 使用内建的 React state 代替。如果你需要去集成已有的非 React 代码，`useSyncExternalStore` API 是很有用的。

</Note>

---

### 订阅浏览器 API {/*subscribing-to-a-browser-api*/}

添加 `useSyncExternalStore` 的另一个场景是当你想订阅一些由浏览器暴露的并随时间变化的值时。例如，假设你想要组件展示网络连接是否正常。浏览器通过一个叫做 [`navigator.onLine`](https://developer.mozilla.org/zh-CN/docs/Web/API/Navigator/onLine) 的属性暴露出这一信息。

这个值可能在 React 不知道的情况下改变，所以你应当通过 `useSyncExternalStore` 来读取它。

```js
import { useSyncExternalStore } from 'react';

function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  // ...
}
```

从浏览器 API 读取当前值，来实现 `getSnapshot` 函数：

```js
function getSnapshot() {
  return navigator.onLine;
}
```

接下来，你需要实现 `subscribe` 函数。例如，当 `navigator.onLine` 改变，浏览器触发 `window` 对象的 [`online`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/online_event) 和 [`offline`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/offline_event) 事件，然后返回一个清除订阅的函数：

```js
function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

现在 React 知道如何从外部的 `navigator.onLine` API 读到这个值，以及如何订阅其改变。断开你的设备的网络，就可以观察到组件重新渲染了：

<Sandpack>

```js
import { useSyncExternalStore } from 'react';

export default function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function getSnapshot() {
  return navigator.onLine;
}

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

</Sandpack>

---

### 把逻辑抽取到自定义 Hook {/*extracting-the-logic-to-a-custom-hook*/}

通常不会在组件里直接用 `useSyncExternalStore`，而是在自定义 Hook 里调用它。这使得你可以在不同组件里使用相同的外部 store。

例如：这里自定义的 `useOnlineStatus` Hook 追踪网络是否在线：

```js {3,6}
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return isOnline;
}

function getSnapshot() {
  // ...
}

function subscribe(callback) {
  // ...
}
```

现在不同的组件都可以调用 `useOnlineStatus`，而不必重复底层实现：

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
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return isOnline;
}

function getSnapshot() {
  return navigator.onLine;
}

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

</Sandpack>

---

### 添加服务端渲染支持 {/*adding-support-for-server-rendering*/}

如果你的 React 应用使用 [服务端渲染](/reference/react-dom/server)，你的 React 组件也会运行在浏览器环境之外来生成初始 HTML。这给连接到外部 store 造成了一些挑战：

- 如果你连接到一个浏览器特有的 API，因为它在服务端不存在，所以是不可行的。
- 如果你连接到一个第三方 store，数据要在服务端和客户端之间相匹配。

为了解决这些问题，要传一个 `getServerSnapshot` 函数作为第三个参数给 `useSyncExternalStore`：

```js {4,12-14}
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return isOnline;
}

function getSnapshot() {
  return navigator.onLine;
}

function getServerSnapshot() {
  return true; // 服务端生成的 HTML 总是显示“在线”
}

function subscribe(callback) {
  // ...
}
```

`getServerSnapshot` 函数与 `getSnapshot` 相似，但它只在两种情况下才运行：

- 在服务端生成 HTML 时。
- 在客户端 [hydration](/reference/react-dom/client/hydrateRoot) 时，即：当 React 拿到服务端的 HTML 并使其可交互。

This lets you provide the initial snapshot value which will be used before the app becomes interactive. If there is no meaningful initial value for the server rendering, omit this argument to [force rendering on the client.](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-client-only-content)

<Note>

确保客户端初始渲染与服务端渲染时 `getServerSnapshot` 返回完全相同的数据。例如，如果在服务端 `getServerSnapshot` 返回一些预先载入的 store 内容，你就需要把这些内容也传给客户端。一种方法是在服务端渲染时，生成 `<script>` 标签来设置像 `window.MY_STORE_DATA` 这样的全局变量，并在客户端 `getServerSnapshot` 内读取此全局变量。你的外部 store 应当提供如何这样做的说明。

</Note>

---

## 疑难解答 {/*troubleshooting*/}

### 遇到一个错误：“The result of `getSnapshot` should be cached” {/*im-getting-an-error-the-result-of-getsnapshot-should-be-cached*/}

这个错误意味着你的 `getSnapshot` 函数每次调用都返回了一个新对象，例如：

```js {2-5}
function getSnapshot() {
  // 🔴 getSnapshot 不要总是返回不同的对象
  return {
    todos: myStore.todos
  };
}
```

如果 `getSnapshot` 返回值不同于上一次，React 会重新渲染组件。这就是为什么，如果总是返回一个不同的值，会进入到一个无限循环，并产生这个报错。

只有当确实有东西改变了，`getSnapshot` 才应该返回一个不同的对象。如果你的 store 包含不可变数据，可以直接返回此数据：

```js {2-3}
function getSnapshot() {
  // ✅ 你可以返回不可变数据
  return myStore.todos;
}
```

如果你的 store 数据是可变的，`getSnapshot` 函数应当返回一个它的不可变快照。这意味着 **确实** 需要创建新对象，但不是每次调用都如此。而是应当保存最后一次计算得到的快照，并且在 store 中的数据不变的情况下，返回与上一次相同的快照。如何决定可变数据发生了改变则取决于你的可变 store。

---

### 我的 `subscribe` 函数每次重新渲染都被调用 {/*my-subscribe-function-gets-called-after-every-re-render*/}

这里的 `subscribe` 函数是在组件 **内部** 定义的，所以它每次渲染都不同：

```js {4-7}
function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  
  // 🚩 总是不同的函数，所以 React 每次重新渲染都会重新订阅
  function subscribe() {
    // ...
  }

  // ...
}
```
  
如果重新渲染时你传一个不同的 `subscribe` 函数，React 会重新订阅你的 store。如果这造成了性能问题，因而你想避免重新订阅，就把 `subscribe` 函数移到外面：

```js {6-9}
function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  // ...
}

// ✅ 总是相同的函数，所以 React 不需要重新订阅
function subscribe() {
  // ...
}
```

或者，把 `subscribe` 包在 [`useCallback`](/reference/react/useCallback) 里面以便只在某些参数改变时重新订阅：

```js {4-8}
function ChatIndicator({ userId }) {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  
  // ✅ 只要 userId 不变，都是同一个函数
  const subscribe = useCallback(() => {
    // ...
  }, [userId]);

  // ...
}
```
