---
title: "React 内置 Hook"
---

<Intro>

Hook 允许从组件中使用不同的 React 功能。可以使用内置的 Hook，或构建自定义 Hook。本页面列出了 React 中的所有内置 Hook。

</Intro>

---

## State Hook {/*state-hooks*/}

状态允许组件像记住用户输入一样存储信息。例如，一个表单组件可以使用状态存储输入值，而一个图像库组件可以使用状态存储所选的图像索引。

要将状态添加到组件中，请使用以下 Hook：

* [`useState`](/reference/react/useState) 声明一个可以直接更新的状态变量。
* [`useReducer`](/reference/react/useReducer) 声明一个带有更新逻辑的状态变量，该逻辑在一个 [reducer 函数](/learn/extracting-state-logic-into-a-reducer) 中。

```js
function ImageGallery() {
  const [index, setIndex] = useState(0);
  // ...
```

---

## Context Hook {/*context-hooks*/}

上下文允许组件 [从远处的父组件接收信息，而无需将其作为 props 传递](/learn/passing-props-to-a-component)。例如，借助上下文，应用程序的顶层组件无论多深都可以将当前的 UI 主题传递给所有下方的组件。

* [`useContext`](/reference/react/useContext) 用于读取和订阅上下文。

```js
function Button() {
  const theme = useContext(ThemeContext);
  // ...
```

---

## Ref Hook {/*ref-hooks*/}

ref 允许组件保存一些不用于渲染的信息，比如 DOM 节点或超时 ID。与状态不同，更新 ref 不会重新渲染组件。ref 是从 React 范例中的“后备方案”。它们在需要与非 React 系统一起工作，比如内置的浏览器 API 时非常有用。

* [`useRef`](/reference/react/useRef) 声明一个 ref。可以在其中保存任何值，但最常用于保存 DOM 节点。
* [`useImperativeHandle`](/reference/react/useImperativeHandle) 允许自定义组件暴露的 ref，但是很少使用。

```js
function Form() {
  const inputRef = useRef(null);
  // ...
```

---

## Effect Hook {/*effect-hooks*/}

Effect 允许组件 [连接和与外部系统同步](/learn/synchronizing-with-effects)。这包括处理网络、浏览器 DOM、动画、使用不同 UI 库编写的小部件以及其他非 React 代码。

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

Effect 是从 React 范例中的“后备方案”。不要使用 Effect 来协调应用程序的数据流。如果没有与外部系统交互，那么 [可能不需要 Effect](/learn/you-might-not-need-an-effect)。

有两个很少使用的 `useEffect` 变体，它们在执行时机上有所不同：

* [`useLayoutEffect`](/reference/react/useLayoutEffect) 在浏览器重新绘制屏幕之前触发，可以在此处测量布局。
* [`useInsertionEffect`](/reference/react/useInsertionEffect) 在 React 对 DOM 进行更改之前触发。库可以在这里插入动态 CSS。

---

## 性能 Hook {/*performance-hooks*/}

优化重新渲染性能的一种常见方法是跳过不必要的工作。例如，可以告诉 React 重复使用缓存的计算，或者如果数据自上次渲染以来没有更改，则跳过重新渲染。

要跳过计算和不必要的重新渲染，请使用以下 Hook 中的一个：

- [`useMemo`](/reference/react/useMemo) 允许缓存昂贵计算的结果。
- [`useCallback`](/reference/react/useCallback) 允许在将函数传递给优化组件之前缓存函数定义。

```js
function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

因为屏幕实际上需要更新，有时无法跳过重新渲染。在这种情况下，可以通过分离必须是同步的阻塞更新（比如输入文字到输入框）和不需要阻止用户界面的非阻塞更新（比如更新图表）提高性能。

要优先处理渲染，请使用以下 Hook 中的一个：

- [`useTransition`](/reference/react/useTransition) 允许将状态转换标记为非阻塞，并允许其他更新中断它。
- [`useDeferredValue`](/reference/react/useDeferredValue) 允许延迟更新 UI 的非关键部分，让其他部分先更新。

---

## 资源 Hook {/*resource-hooks*/}

资源可以被组件访问，而无需将它们作为状态的一部分。例如，组件可以从 Promise 中读取消息，或从上下文中读取样式信息。

要从资源中读取值，请使用此 Hook：

- [`use`](/reference/react/use) 允许读取像 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 或 [上下文](/learn/passing-data-deeply-with-context) 这样的资源的值。

```js
function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  // ...
}
```

---

## 其他 Hook {/*other-hooks*/}

这些 Hook 主要适用于库作者，不常在应用程序代码中使用。

- [`useDebugValue`](/reference/react/useDebugValue) 允许自定义 React 开发者工具为自定义 Hook 显示的标签。
- [`useId`](/reference/react/useId) 允许组件将唯一的 ID 与自身关联。通常与辅助功能 API 一起使用。
- [`useSyncExternalStore`](/reference/react/useSyncExternalStore) 允许组件订阅外部存储。

---

## 自定义 Hook {/*your-own-hooks*/}

开发者可以 [自定义 Hook](/learn/reusing-logic-with-custom-hooks#extracting-your-own-custom-hook-from-a-component) 作为 JavaScript 函数。
