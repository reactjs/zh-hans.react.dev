---
title: "内置 React Hook"
---

<Intro>

*Hook* 让你可以在组件中使用不同的 React 功能。你可以使用内置的 Hook 或者把它们组合起来建立你自己的。本页列出了 React 中所有的内置 Hook。

</Intro>

---

## 状态 Hook {/*state-hooks*/}

*state* 让一个组件 [“记住”像用户输入的信息](/learn/state-a-components-memory)，比如，一个表单组件可以使用 state 来存储输入值，而一个图片库组件可以使用 state 来存储选定的图片索引。

要给一个组件添加状态，使用这些 Hook 中的一个：

* [`useState`](/reference/react/useState) 声明了一个你可以直接更新的 state 变量。
* [`useReducer`](/reference/react/useReducer) 声明了一个带有更新逻辑的 state 变量在一个 [reducer 函数](/learn/extracting-state-logic-into-a-reducer)中。

```js
function ImageGallery() {
  const [index, setIndex] = useState(0);
  // ...
```

---

## Context Hook {/*context-hooks*/}

*Context* 让一个组件 [从远处的父组件接收信息，而不需要将其作为 props 传递](/learn/passing-props-to-a-component)。比如，app 的顶层组件可以将当前的 UI 主题传递给下面的所有组件，无论它们层级多深。

* [`useContext`](/reference/react/useContext) 读取并订阅了一个上下文。

```js
function Button() {
  const theme = useContext(ThemeContext);
  // ...
```

---

## Ref Hook {/*ref-hooks*/}

*Ref* 让一个组件 [持有一些不用于渲染的信息](/learn/referencing-values-with-refs)，如 DOM 节点或一个 timeout ID。与 state 不同的是，更新 Ref 并不会重新渲染你的组件。Ref 是 React 范式的一个 "逃生舱门"。当你需要与非 React 系统一起工作时，它们很有用，比如内置的浏览器 API。

* [`useRef`](/reference/react/useRef) 声明了一个 Ref。你可以在其中保存任何值，但最常见的是它用来保存一个 DOM 节点。
* [`useImperativeHandle`](/reference/react/useImperativeHandle) 可以让你自定义你的组件所暴露的 Ref。这一点很少使用。

```js
function Form() {
  const inputRef = useRef(null);
  // ...
```

---

## Effect Hook {/*effect-hooks*/}

*Effect* 让一个组件[连接到外部系统并与之同步](/learn/synchronizing-with-effects)。这包括处理网络、浏览器、DOM、动画、使用不同 UI 库编写的 widgets 以及其他非 React 代码。

* [`useEffect`](/reference/react/useEffect) 将一个组件连接到外部系统。

```js
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
  // ...
```

Effect 是 React 范式的 "逃生舱门"。不要用 Effect 来协调你的应用程序的数据流。如果你不与外部系统交互，[你可能不需要 Effect](/learn/you-might-not-need-an-effect)。

`useEffect` 有两个很少使用的变换形式，它们在时间上有差异：

* [`useLayoutEffect`](/reference/react/useLayoutEffect) 在浏览器重绘屏幕前启动。你可以在这里测量布局。
* [`useInsertionEffect`](/reference/react/useInsertionEffect) 在 React 对 DOM 进行修改之前触发。Libraries 可以在这里插入动态 CSS。

---

## 性能 Hook {/*performance-hooks*/}

优化重新渲染性能的一个常见方法就是跳过不必要的工作。比如，你可以告诉 React 重用一个缓存的计算，或者如果数据在上一次渲染后没有变化，就跳过一次重新渲染。

要跳过计算和不必要的重新渲染，请使用这些 Hook 的一个：

* [`useMemo`](/reference/react/useMemo) 让你缓存一个非常高的计算结果。
* [`useCallback`](/reference/react/useCallback) 让你在将一个函数定义传递给一个优化的组件之前缓存它。

```js
function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

有时，你不能跳过重新渲染，因为屏幕确实需要更新。在这种情况下，你可以通过将必须同步的阻塞更新（比如向输入法输入）与不需要阻塞用户界面的非阻塞更新（比如更新图表）分开以提高性能。

要确定渲染的优先级，可以从以下 Hook 选择其中之一：

* [`useTransition`](/reference/react/useTransition) 让你把一个状态转换标记为非阻塞，并允许其他更新中断它。
* [`useDeferredValue`](/reference/react/useDeferredValue) 让你推迟更新用户界面的一个非关键部分，让其他部分更新。

---

## 其他 Hook {/*other-hooks*/}

这些 Hook 主要对 library 的作者有用，在应用代码中并不常用。

* [`useDebugValue`](/reference/react/useDebugValue) 让你在 React DevTools 中为自定义 Hook 添加一个 label。
* [`useId`](/reference/react/useId) 让组件将一个独特的 ID 与自己联系起来。通常与可访问性 API 一起使用。
* [`useSyncExternalStore`](/reference/react/useSyncExternalStore) 让一个组件订阅一个外部 store。

---

## 自己的 Hook {/*your-own-hooks*/}

你也可以在 JavaScript 函数中 [定义你自己的 Hook](/learn/reusing-logic-with-custom-hooks#extracting-your-own-custom-hook-from-a-component)。
