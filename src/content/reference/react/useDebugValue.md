---
title: useDebugValue
---

<Intro>

`useDebugValue` 是一个 React Hook，可以让你在 [React 开发工具](/learn/react-developer-tools) 中为自定义 Hook 添加标签。

```js
useDebugValue(value, format?)
```

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `useDebugValue(value, format?)` {/*usedebugvalue*/}

在你的 [自定义 Hook](/learn/reusing-logic-with-custom-hooks) 的顶层调用 `useDebugValue`，以显示可读的调试值：

```js
import { useDebugValue } from 'react';

function useOnlineStatus() {
  // ...
  useDebugValue(isOnline ? 'Online' : 'Offline');
  // ...
}
```

[请看下方更多示例](#usage)。

#### 参数 {/*parameters*/}

* `value`：你想在 React 开发工具中显示的值。可以是任何类型。
* **可选** `format`：它接受一个格式化函数。当组件被检查时，React 开发工具将用 `value` 作为参数来调用格式化函数，然后显示返回的格式化值（可以是任何类型）。如果不指定格式化函数，则会显示 `value`。

#### 返回值 {/*returns*/}

`useDebugValue` 没有返回值。

## 用法 {/*usage*/}

### 为自定义 Hook 添加标签 {/*adding-a-label-to-a-custom-hook*/}

在 [自定义 Hook](/learn/reusing-logic-with-custom-hooks) 中调用 `useDebugValue`，可以让 [React 开发工具](/learn/react-developer-tools) 显示可读的 <CodeStep step={1}>调试值</CodeStep>。

```js [[1, 5, "isOnline ? 'Online' : 'Offline'"]]
import { useDebugValue } from 'react';

function useOnlineStatus() {
  // ...
  useDebugValue(isOnline ? 'Online' : 'Offline');
  // ...
}
```

这样一来，当你检查调用 `useOnlineStatus` 的组件时，它们会显示一个标签，例如 `OnlineStatus: "Online"`。

![在 React 开发工具中显示调试值的截图](/images/docs/react-devtools-usedebugvalue.png)

如果没有使用 `useDebugValue`，则只会显示底层数据（在此示例中为 `true`）。

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

export default function App() {
  return <StatusBar />;
}
```

```js useOnlineStatus.js active
import { useSyncExternalStore, useDebugValue } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, () => navigator.onLine, () => true);
  useDebugValue(isOnline ? 'Online' : 'Offline');
  return isOnline;
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

<Note>

不必为每个自定义 Hook 添加调试值。这对于那些作为共享库一部分、具有复杂的内部数据结构并且难以检查的自定义 Hook 更有价值。

</Note>

---

### 延迟格式化调试值 {/*deferring-formatting-of-a-debug-value*/}

你也可以将一个格式化函数作为 `useDebugValue` 的第二个参数传入：

```js [[1, 1, "date", 18], [2, 1, "date.toDateString()"]]
useDebugValue(date, date => date.toDateString());
```

格式化函数将接收 <CodeStep step={1}>调试值</CodeStep> 作为参数，返回 <CodeStep step={2}>格式化后的显示值</CodeStep>。当你的组件被检查时，React 开发工具将调用此函数并显示其返回值。

使用格式化函数，可以避免在组件没有被检查时运行可能开销较大的格式化逻辑。例如，如果 `date` 是一个日期值，则可以避免在每次渲染时都调用 `toDateString()` 方法。
