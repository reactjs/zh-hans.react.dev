---
title: useEffectEvent
---

<Intro>

`useEffectEvent` 是一个 React Hook，它可以让你将 Effect 中的非响应式逻辑提取到一个可复用的函数中，这个函数称为 [Effect Event](/learn/separating-events-from-effects#declaring-an-effect-event)。

```js
const onSomething = useEffectEvent(callback)
```

</Intro>

<InlineToc />

## 参考 {/*reference*/}

### `useEffectEvent(callback)` {/*useeffectevent*/}

在组件的顶层调用 `useEffectEvent` 来声明一个 Effect Event。Effect Event 是你可以在 Effect 中调用的函数，例如 `useEffect`：

```js {4-6,11}
import { useEffectEvent, useEffect } from 'react';

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

  // ...
}
```

[在下方查看更多示例](#usage)

#### 参数 {/*parameters*/}

- `callback`：一个包含你 Effect Event 逻辑的函数。当你使用 `useEffectEvent` 定义一个 Effect Event 时，`callback` 在被调用时总是可以访问到最新的 props 和 state。这有助于避免陈旧闭包问题。

#### 返回值 {/*returns*/}

返回一个 Effect Event 函数。你可以在 `useEffect`、`useLayoutEffect` 或 `useInsertionEffect` 中调用这个函数。

将强制执行此限制，以防止在错误的上下文中调用效果事件。

#### 注意事项 {/*caveats*/}

- **仅在 Effect 中调用**：Effect Event 应该只在 Effect 中调用。在使用它的 Effect 之前定义它。不要将它传递给其他组件或 hooks。[`eslint-plugin-react-hooks`](/reference/eslint-plugin-react-hooks) linter（6.1.1 或者更高版本）将强制执行此限制，以防止在错误的上下文中调用 Effect Events。
- **不是依赖数组的捷径**：不要用 `useEffectEvent` 来避免在 Effect 的依赖数组中声明依赖。这可能会隐藏 bug 并让代码更难理解。更推荐显式依赖，或使用 ref 来比较之前的值。
- **用于非响应式逻辑**：仅在逻辑不依赖变化的值时使用 `useEffectEvent` 来提取。

___

## 用法 {/*usage*/}

### 读取最新的 props 和 state {/*reading-the-latest-props-and-state*/}

通常，当你在 Effect 中访问一个响应式值时，你必须把它包含在依赖数组里。这样可以确保当这个值改变时，Effect 会再次运行，这通常是期望的行为。

但在某些情况下，你可能只想在 Effect 中读取最新的 props 或 state，而不希望当这些值改变时让 Effect 重新运行。

要在 Effect 中[读取最新的 props 或 state](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events)，而不让这些值成为响应式依赖，请把它们放进一个 Effect Event 中。

```js {7-9,12}
import { useEffect, useContext, useEffectEvent } from 'react';

function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  const onNavigate = useEffectEvent((visitedUrl) => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    onNavigate(url);
  }, [url]);

  // ...
}
```

In this example, the Effect should re-run after a render when `url` changes (to log the new page visit), but it should **not** re-run when `numberOfItems` changes. By wrapping the logging logic in an Effect Event, `numberOfItems` becomes non-reactive. It's always read from the latest value without triggering the Effect.

You can pass reactive values like `url` as arguments to the Effect Event to keep them reactive while accessing the latest non-reactive values inside the event.

