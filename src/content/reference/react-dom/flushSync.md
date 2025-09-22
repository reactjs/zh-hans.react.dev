---
title: flushSync
---

<Pitfall>

使用 `flushSync` 是不常见的行为，并且可能损伤应用程序的性能。

</Pitfall>

<Intro>

`flushSync` 允许你强制 React 在提供的回调函数内同步刷新任何更新，这将确保 DOM 立即更新。

```js
flushSync(callback)
```

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `flushSync(callback)` {/*flushsync*/}

调用 `flushSync` 强制 React 刷新所有挂起的工作，并同步更新 DOM。

```js
import { flushSync } from 'react-dom';

flushSync(() => {
  setSomething(123);
});
```

大多数时候都不需要使用 `flushSync`，请将其作为最后的手段使用。

[参见下面更多示例](#usage)。

#### 参数 {/*parameters*/}


* `callback`：一个函数。React 会立即调用这个回调函数，并同步刷新其中包含的任何更新。它也可能会刷新任何挂起的更新、Effect 或 Effect 内部的更新。如果因为调用 `flushSync` 而导致更新挂起（suspend），则可能会重新显示后备方案。

#### 返回值 {/*returns*/}

`flushSync` 返回 `undefined`。

#### 注意 {/*caveats*/}

* `flushSync` 可能会严重影响性能，因此请谨慎使用。
* `flushSync` 可能会强制挂起的 Suspense 边界显示其 `fallback` 状态。
* `flushSync` 可能会在返回之前运行挂起的 Effect，并同步应用其包含的任何更新。
* `flushSync` 可能会在必要时刷新回调函数之外的更新，以便刷新回调函数内部的更新。例如，如果有来自点击事件的挂起更新，React 可能会在刷新回调函数内部的更新之前刷新这些更新。

---

## 用法 {/*usage*/}

### 刷新第三方集成更新 {/*flushing-updates-for-third-party-integrations*/}

当与浏览器 API 或 UI 库等第三方代码集成时，可能需要强制 React 刷新更新。调用 `flushSync` 以强制 React 同步刷新在回调函数内的任何状态更新：

```js [[1, 2, "setSomething(123)"]]
flushSync(() => {
  setSomething(123);
});
// 这一行代码运行之后，DOM 将被更新。
```

这确保了在下一行代码运行时，React 已经更新了 DOM。

**使用 `flushSync` 是不常见的行为，频繁调用可能会严重影响应用程序的性能**。如果你的应用只使用 React API，并且不与第三方库集成，那么 `flushSync` 应该是不必要的。

然而，它对于与浏览器 API 等第三方代码集成可能会有帮助。

一些浏览器 API 希望回调函数内的结果同步写入 DOM，以便在回调函数结束时，浏览器可以对渲染的 DOM 进行操作。在大多数情况下，React 会自动处理这个问题。但在某些情况下，可能需要强制进行同步更新。

例如，浏览器的 `onbeforeprint` API 允许你在打印对话框打开之前立即更改页面。这对于应用自定义打印样式，使文档在打印时能够更好地显示非常有用。在下面的示例中，你在 `onbeforeprint` 回调函数内调用 `flushSync` 来立即将 React 状态“刷新”到 DOM 中。然后，当打印对话框打开时，`isPrinting` 会显示为“是”：

<Sandpack>

```js src/App.js active
import { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';

export default function PrintApp() {
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    function handleBeforePrint() {
      flushSync(() => {
        setIsPrinting(true);
      })
    }

    function handleAfterPrint() {
      setIsPrinting(false);
    }

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    }
  }, []);

  return (
    <>
      <h1>是否打印：{isPrinting ? '是' : '否'}</h1>
      <button onClick={() => window.print()}>
        打印
      </button>
    </>
  );
}
```

</Sandpack>

如果没有使用 `flushSync`，打印对话框会将 `isPrinting` 显示为“否”。这是因为 React 将异步批处理更新，而打印对话框在状态更新之前就显示出来了。

<Pitfall>

`flushSync` 可能会严重影响性能，并且可能会意外地强制挂起的 Suspense 边界显示其后备状态。

大多数时候都不需要使用 `flushSync`，请将其作为最后的手段使用。

</Pitfall>

---

## Troubleshooting {/*troubleshooting*/}

### I'm getting an error: "flushSync was called from inside a lifecycle method" {/*im-getting-an-error-flushsync-was-called-from-inside-a-lifecycle-method*/}


React cannot `flushSync` in the middle of a render. If you do, it will noop and warn:

<ConsoleBlock level="error">

Warning: flushSync was called from inside a lifecycle method. React cannot flush when React is already rendering. Consider moving this call to a scheduler task or micro task.

</ConsoleBlock>

This includes calling `flushSync` inside:

- rendering a component.
- `useLayoutEffect` or `useEffect` hooks.
- Class component lifecycle methods.

For example, calling `flushSync` in an Effect will noop and warn:

```js
import { useEffect } from 'react';
import { flushSync } from 'react-dom';

function MyComponent() {
  useEffect(() => {
    // 🚩 Wrong: calling flushSync inside an effect
    flushSync(() => {
      setSomething(newValue);
    });
  }, []);

  return <div>{/* ... */}</div>;
}
```

To fix this, you usually want to move the `flushSync` call to an event:

```js
function handleClick() {
  // ✅ Correct: flushSync in event handlers is safe
  flushSync(() => {
    setSomething(newValue);
  });
}
```


If it's difficult to move to an event, you can defer `flushSync` in a microtask:

```js {3,7}
useEffect(() => {
  // ✅ Correct: defer flushSync to a microtask
  queueMicrotask(() => {
    flushSync(() => {
      setSomething(newValue);
    });
  });
}, []);
```

This will allow the current render to finish and schedule another syncronous render to flush the updates.

<Pitfall>

`flushSync` can significantly hurt performance, but this particular pattern is even worse for performance. Exhaust all other options before calling `flushSync` in a microtask as an escape hatch.

</Pitfall>
