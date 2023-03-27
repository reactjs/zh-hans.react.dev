---
title: "Hooks 简介"
---

<Intro>

*Hooks* 可以让你在组件中使用不同的 React 特性。你可以使用内置的 Hooks 或将它们组合起来构建自己的钩子。此页面列出了 React 中所有内置的 Hooks。

</Intro>

---

## State Hooks {/*state-hooks*/}

*State* 可以让组件 [“ 记住 ” 数据 如用户的输入。](/learn/state-a-components-memory) 例如，表单组件可以使用 State 来存储输入值，而图像库组件可以使用 State 来存储选定的图像索引。

向组件中添加 State，请使用以下的 Hooks ：

* [`useState`](/reference/react/useState) 声明一个可以直接更新的 State 变量。
* [`useReducer`](/reference/react/useReducer) 在 [reducer 函数](/learn/extracting-state-logic-into-a-reducer) 中声明一个带有更新逻辑的 State 变量。

```js
function ImageGallery() {
  const [index, setIndex] = useState(0);
  // ...
```

---

## Context Hooks {/*context-hooks*/}

*Context* 可以让组件 [从上层的父组件接收数据，而不必使用 Props 进行传递。](/learn/passing-props-to-a-component) 例如，应用的顶层组件可以将当前 UI 主题传递给下面的所有组件，无论其深度如何。

* [`useContext`](/reference/react/useContext) 读取并订阅上下文。

```js
function Button() {
  const theme = useContext(ThemeContext);
  // ...
```

---

## Ref Hooks {/*ref-hooks*/}

*Refs* 可以让组件 [保存一些不用于渲染的数据，](/learn/referencing-values-with-refs) 例如 DOM 节点或超时 ID。 与 State 不同，更新 Refs 不会重新渲染组件。Refs 是 React 范式的 “安全舱口”。当你需要使用非 React 系统（例如内置浏览器 API）时，它们很有用。

* [`useRef`](/reference/react/useRef) 声明 Ref。你可以在其中保存任何类型的值，但大多数情况下，它用于保存 DOM 节点。
* [`useImperativeHandle`](/reference/react/useImperativeHandle) 允许你自定义组件暴露的 Ref，这很少使用。

```js
function Form() {
  const inputRef = useRef(null);
  // ...
```

---

## Effect Hooks {/*effect-hooks*/}

*Effects* 可以让组件 [连接到外部系统并与之同步。](/learn/synchronizing-with-effects) 包括处理网络、浏览器 DOM、动画、使用不同 UI 库编写的小部件以及其他非 React 代码。

* [`useEffect`](/reference/react/useEffect) 将组件连接到外部系统。

```js
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
  // ...
```
Effects React 范式的 “安全舱口”。不要使用 Effects 去协调应用程序的数据流。如果你不与外部系统交互，[那么可能不需要 Effects。](/learn/you-might-not-need-an-effect)

有两个很少使用的 `useEffect` 变体，它们在时机上有所不同：

* [`useLayoutEffect`](/reference/react/useLayoutEffect) 在浏览器重新绘制屏幕之前触发。你可以在此处测量布局。
* [`useInsertionEffect`](/reference/react/useInsertionEffect) 在 React 对 DOM 进行更改之前触发。 你可以在此处插入动态 CSS。

---

## Performance Hooks {/*performance-hooks*/}

优化重新渲染性能的常见方法是跳过不必要的工作。例如，你可以告诉 React 重用已缓存的计算结果，或者在数据自上次渲染以来没有更改时，跳过重新渲染。

要跳过计算和不必要的重新渲染，请使用以下的 Hooks ：

- [`useMemo`](/reference/react/useMemo) 可以让你缓存一个消耗较大的计算结果。
- [`useCallback`](/reference/react/useCallback) 可以让你在将函数定义传递给优化组件之前对其进行缓存。

```js
function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

有时候，你不能跳过重新渲染，因为屏幕实际上需要更新。在这种情况下，你可以通过将必须同步执行的阻塞式更新（如输入文本）与不需要阻塞用户界面的非阻塞式更新（如更新图表）分开来，来提高性能。

确定渲染的优先级，请使用以下的 Hooks ：

- [`useTransition`](/reference/react/useTransition) 可以让你将 State 转换为非阻塞，并允许其他更新来打断它。
- [`useDeferredValue`](/reference/react/useDeferredValue) 可以让你延迟更新 UI 的非关键部分，并让其他部分先更新。

---

## Other Hooks {/*other-hooks*/}

以下 Hooks 主要对库作者有用，不常在应用代码中使用。

- [`useDebugValue`](/reference/react/useDebugValue) 可以让你自定义 React DevTools 在显示你的自定义Hook时使用的标签。
- [`useId`](/reference/react/useId) 可以让组件将唯一的标识符与自己关联起来，通常与可访问性API一起使用。
- [`useSyncExternalStore`](/reference/react/useSyncExternalStore) 可以让组件订阅外部 Store。

---

## Your own Hooks {/*your-own-hooks*/}

你也可以将 [自己定义的自定义 Hooks](/learn/reusing-logic-with-custom-hooks#extracting-your-own-custom-hook-from-a-component) 定义为 JavaScript 函数。
