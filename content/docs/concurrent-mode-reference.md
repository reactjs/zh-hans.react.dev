---
id: concurrent-mode-reference
title: Concurrent 模式 API 参考（实验版）
permalink: docs/concurrent-mode-reference.html
prev: concurrent-mode-adoption.html
---

<style>
.scary > blockquote {
  background-color: rgba(237, 51, 21, 0.2);
  border-left-color: #ed3315;
}
</style>

<div class="scary">

>注意：
>
>本章节所描述的实验性功能**在稳定版本中[尚不可用](/docs/concurrent-mode-adoption.html)**。请不要在应用程序的生产环境中使用。这些功能可能会发生重大变化，并且在正式成为 React 的一部分之前不会给出警告。
>
>本文档面向早期此功能的使用者以及对此功能好奇的开发者。**如果你并不熟悉 React，请不必担心** —— 你不需要立刻学习这些功能。

</div>

本章节为 [Concurrent 模式](/docs/concurrent-mode-intro.html)的 React API 参考。如果你想找使用指南，请查阅 [Concurrent UI 模式](/docs/concurrent-mode-patterns.html)。

**注意：这是社区的预览版，并不是最终的稳定版本。这些 API 将来可能会发生变化。请自行承担风险！**

- [启用 Concurrent 模式](#concurrent-mode)
    - [`createRoot`](#createroot)
    - [`createBlockingRoot`](#createblockingroot)
- [Suspense](#suspense)
    - [`Suspense`](#suspensecomponent)
    - [`SuspenseList`](#suspenselist)
    - [`useTransition`](#usetransition)
    - [`useDeferredValue`](#usedeferredvalue)

## 启用 Concurrent 模式 {#concurrent-mode}

### `createRoot` {#createroot}

```js
ReactDOM.createRoot(rootNode).render(<App />);
```

使用上述代码替换 `ReactDOM.render(<App />, rootNode)` 并启用 Concurrent 模式。

欲了解有关 Concurrent 模式的更多信息，请查阅 [Concurrent 模式文档](/docs/concurrent-mode-intro.html)

### `createBlockingRoot` {#createblockingroot}

```js
ReactDOM.createBlockingRoot(rootNode).render(<App />)
```

使用上述代码替换 `ReactDOM.render(<App />, rootNode)` 并启用 [Blocking 模式](/docs/concurrent-mode-adoption.html#migration-step-blocking-mode)。

选择 Concurrent 模式会对 React 的工作方式带来语义上的变化。这意味着你不能只在部分组件中使用 concurrent 模式。因此，一些应用程序可能无法直接迁移到 Concurrent 模式。

Blocking 模式只包含了 Concurrent 模式的小部分功能，目的是为无法直接迁移的应用程序提供过渡方案。

## Suspense API {#suspense}

### `Suspense` {#suspensecomponent}

```js
<Suspense fallback={<h1>加载中...</h1>}>
  <ProfilePhoto />
  <ProfileDetails />
</Suspense>
```

`Suspense` 让你的组件在渲染之前进行“等待”，并在等待时显示 fallback 的内容。

在这个示例中，`ProfileDetails` 正在等待异步 API 调用来获取某些数据。在等待 `ProfileDetails` 和 `ProfilePhoto` 时，我们将显示`加载中...`的 fallback。请注意，在 `<Suspense>` 中的所有子组件都加载之前，我们将继续显示这个 fallback。

`Suspense` 接受两个 props：
* **fallback** 接受一个加载指示器。这个 fallback 在 `Suspense` 所有子组件完成渲染之前将会一直显示。
* **unstable_avoidThisFallback** 接受一个布尔值。它告诉 React 是否在初始加载时“跳过”显示这个边界，这个 API 可能会在后续版本中删除。

### `<SuspenseList>` {#suspenselist}

```js
<SuspenseList revealOrder="forwards">
  <Suspense fallback={'加载中...'}>
    <ProfilePicture id={1} />
  </Suspense>
  <Suspense fallback={'加载中...'}>
    <ProfilePicture id={2} />
  </Suspense>
  <Suspense fallback={'加载中...'}>
    <ProfilePicture id={3} />
  </Suspense>
  ...
</SuspenseList>
```

`SuspenseList` 通过编排向用户显示这些组件的顺序，来帮助协调许多可以挂起的组件。

当多个组件需要获取数据时，这些数据可能会以不可预知的顺序到达。不过，如果你将这些项目包装在 `SuspenseList` 中，React 将不会在列表中显示这个项目，直到它之前的项目已经显示（此行为可调整）。

`SuspenseList` 接受两个 props：
* **revealOrder (forwards, backwards, together)** 定义了 `SuspenseList` 子组件应该显示的顺序。
  * `together` 在*所有*的子组件都准备好了的时候显示它们，而不是一个接着一个显示。
* **tail (collapsed, hidden)** 指定如何显示 `SuspenseList` 中未加载的项目。
    * 默认情况下，`SuspenseList` 将显示列表中的所有 fallback。
    * `collapsed` 仅显示列表中下一个 fallback。
    * `hidden` 未加载的项目不显示任何信息。

请注意，`SuspenseList` 只对其下方最近的 `Suspense` 和 `SuspenseList` 组件进行操作。它不会搜索深度超过一级的边界。不过，可以将多个 `SuspenseList` 组件相互嵌套来构建栅格。

### `useTransition` {#usetransition}

```js
const SUSPENSE_CONFIG = { timeoutMs: 2000 };

const [startTransition, isPending] = useTransition(SUSPENSE_CONFIG);
```

`useTransition` 允许组件在**切换到下一个界面**之前等待内容加载，从而避免不必要的加载状态。它还允许组件将速度较慢的数据获取更新推迟到随后渲染，以便能够立即渲染更重要的更新。

`useTransition` hook 返回两个值的数组。
* `startTransition` 是一个接受回调的函数。我们用它来告诉 React 需要推迟的 state。
* `isPending` 是一个布尔值。这是 React 通知我们是否正在等待过渡的完成的方式。

**如果某个 state 更新导致组件挂起，则该 state 更新应包装在 transition 中**

```js
const SUSPENSE_CONFIG = { timeoutMs: 2000 };

function App() {
  const [resource, setResource] = useState(initialResource);
  const [startTransition, isPending] = useTransition(SUSPENSE_CONFIG);
  return (
    <>
      <button
        disabled={isPending}
        onClick={() => {
          startTransition(() => {
            const nextUserId = getNextId(resource.userId);
            setResource(fetchProfileData(nextUserId));
          });
        }}
      >
        Next
      </button>
      {isPending ? " 加载中..." : null}
      <Suspense fallback={<Spinner />}>
        <ProfilePage resource={resource} />
      </Suspense>
    </>
  );
}
```

在这段代码中，我们使用 `startTransition` 包装了我们的数据获取。这使我们可以立即开始获取用户资料的数据，同时推迟下一个用户资料页面以及其关联的 `Spinner` 的渲染 2 秒钟（`timeoutMs` 中显示的时间）。

`isPending` 布尔值让 React 知道我们的组件正在切换，因此我们可以通过在之前的用户资料页面上显示一些加载文本来让用户知道这一点。

**深入了解 transition，可以阅读 [Concurrent UI 模式](/docs/concurrent-mode-patterns.html#transitions).**

#### useTransition 配置 {#usetransition-config}

```js
const SUSPENSE_CONFIG = { timeoutMs: 2000 };
```

`useTransition` 接受带有 `timeoutMs` 的**可选的 Suspense 配置**。 此超时（毫秒）告诉 React 在显示下一个状态（上例中为新的用户资料页面）之前等待多长时间。

**注意：我们建议你在不同的模块之间共享 Suspense 配置。**


### `useDeferredValue` {#usedeferredvalue}

```js
const deferredValue = useDeferredValue(value, { timeoutMs: 2000 });
```

返回一个延迟响应的值，该值可能“延后”的最长时间为 `timeoutMs`。

这通常用于在具有基于用户输入立即渲染的内容，以及需要等待数据获取的内容时，保持接口的可响应性。

文本输入框是个不错的示例。

```js
function App() {
  const [text, setText] = useState("hello");
  const deferredText = useDeferredValue(text, { timeoutMs: 2000 }); 

  return (
    <div className="App">
      {/* 保持将当前文本传递给 input */}
      <input value={text} onChange={handleChange} />
      ...
      {/* 但在必要时可以将列表“延后” */}
      <MySlowList text={deferredText} />
    </div>
  );
 }
```

这让我们可以立即显示 `input` 的新文本，从而感觉到网页的响应。同时，`MySlowList` “延后” 2 秒，根据 `timeoutMs` ，更新之前，允许它在后台渲染当前文本。

**深入了解延迟值，可以阅读 [Concurrent UI 模式](/docs/concurrent-mode-patterns.html#deferring-a-value)。**

#### useDeferredValue 配置 {#usedeferredvalue-config}

```js
const SUSPENSE_CONFIG = { timeoutMs: 2000 };
```

`useDeferredValue` 所接受的**配置参数 Suspense 可选**，该参数包含 `timeoutMs` 字段。此超时（以毫秒为单位）表示延迟的值允许延后多长时间。

当网络和设备允许时，React 始终会尝试使用较短的延迟。
