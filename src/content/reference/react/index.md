---
<<<<<<< HEAD
title: "内置 React Hook"
---

<Intro>

**Hook** 可以帮助在组件中使用不同的 React 功能。你可以使用内置的 Hook 或使用自定义 Hook。本页列出了 React 中所有的内置 Hook。

=======
title: React Reference Overview
---

<Intro>
This section provides detailed reference documentation for working with React. 
For an introduction to React, please visit the [Learn](/learn) section. 
>>>>>>> 9c60167bf966286bafb99492e31b0609ccb56b5c
</Intro>

Our The React reference documentation is broken down into functional subsections: 

<<<<<<< HEAD
## 状态 Hook {/*state-hooks*/}

**state** 让一个组件 [“记住”用户输入的信息](/learn/state-a-components-memory)，比如，一个表单组件可以使用 state 来存储输入值，而一个图片库组件可以使用 state 来存储选定的图片索引。

使用下面的 Hook 以向组件添加状态：

* 使用 [`useState`](/reference/react/useState) 声明可以直接更新的 state 变量。
* 使用 [`useReducer`](/reference/react/useReducer) 在 [reducer 函数](/learn/extracting-state-logic-into-a-reducer) 中声明带有更新逻辑的 state 变量。

```js
function ImageGallery() {
  const [index, setIndex] = useState(0);
  // ……
```

---

## Context Hook {/*context-hooks*/}

**context** 允许组件 [从祖先组件中接收信息，而不需要将其作为 props 传递](/learn/passing-props-to-a-component)。比如，app 的顶层组件可以将当前的 UI 主题传递给下面的所有组件，无论它们层级多深。

* 使用 [`useContext`](/reference/react/useContext) 读取并订阅 context。

```js
function Button() {
  const theme = useContext(ThemeContext);
  // ……
```

---

## Ref Hook {/*ref-hooks*/}

**ref** 允许组件 [持有一些不用于渲染的信息](/learn/referencing-values-with-refs)，如 DOM 节点或 timeout ID。与 state 不同的是，更新 ref 并不会重新渲染组件。ref 是 React 范式的一个“规避机制”。当需要与非 React 系统如浏览器内置 API 一起工作时，ref 将会很有用。

* 使用 [`useRef`](/reference/react/useRef) 声明 ref。你可以在其中保存任何值，但最常见的是使用 ref 保存 DOM 节点。
* 使用 [`useImperativeHandle`](/reference/react/useImperativeHandle) 自定义从组件中暴露的 ref，但是一般很少使用。

```js
function Form() {
  const inputRef = useRef(null);
  // ……
```

---

## Effect Hook {/*effect-hooks*/}

**Effect** 允许组件 [连接到外部系统并与之同步](/learn/synchronizing-with-effects)。这包括处理网络、浏览器、DOM、动画、使用不同 UI 库编写的 widgets 以及其他非 React 代码。

* [`useEffect`](/reference/react/useEffect) 能够将组件连接到外部系统。

```js
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
  // ……
```

Effect 是 React 范式的“规避机制”。避免使用 Effect 协调应用程序的数据流。如果不需要与外部系统交互，那么 [你可能不需要 Effect](/learn/you-might-not-need-an-effect)。

`useEffect` 有两个很少使用的变换形式，它们在时机上有一些差异：

* [`useLayoutEffect`](/reference/react/useLayoutEffect) 在浏览器重新绘制屏幕前执行。在这里，你可以测量布局。
* [`useInsertionEffect`](/reference/react/useInsertionEffect) 在 React 对 DOM 进行更改之前触发。在这里，库可以插入动态的 CSS。

---

## 性能 Hook {/*performance-hooks*/}

优化重新渲染性能的一个常见方法就是跳过不必要的工作。比如，可以告诉 React 重用一个缓存的计算结果，或者如果数据在上一次渲染后没有变化时跳过这次重新渲染。

可以使用这些 Hook 跳过计算和不必要的重新渲染：

* [`useMemo`](/reference/react/useMemo) 可以帮助缓存一个代价非常高的计算结果。
* [`useCallback`](/reference/react/useCallback) 可以帮助在将一个函数定义传递给一个优化的组件之前缓存它。

```js
function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ……
}
```

有时由于屏幕确实需要更新，不能跳过重新渲染。在这种情况下，可以通过将必须同步的阻塞更新（比如使用输入法输入内容）与不需要阻塞用户界面的非阻塞更新（比如更新图表）分开以提高性能。

要确定渲染的优先级，可以使用以下 Hook：

* [`useTransition`](/reference/react/useTransition) 允许将状态转换标记为非阻塞，并允许其他更新中断它此更新。
* [`useDeferredValue`](/reference/react/useDeferredValue) 允许推迟更新用户界面的一个非关键部分，以让其他部分有限更新。

---

## 资源 Hook {/*resource-hooks*/}

**资源** 可以被组件访问，而无需将它们作为其状态的一部分。例如，组件可以从 Promise 中读取消息，或者从 context 中读取样式信息。

使用下面这个 Hook 以从资源中读取值：

- [`use`](/reference/react/use) 允许读取如 [Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise) 或 [context](/learn/passing-data-deeply-with-context) 资源的值。

```js
function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  // ……
}
```

---

## 其他 Hook {/*other-hooks*/}

这些 Hook 主要对库作者有用，而不常用于应用程序代码。

* [`useDebugValue`](/reference/react/useDebugValue) 允许在 React 开发者工具中为自定义 Hook 添加一个标签。
* [`useId`](/reference/react/useId) 允许组件绑定一个唯一 ID，其通常与可访问性 API 一起使用。
* [`useSyncExternalStore`](/reference/react/useSyncExternalStore) 允许一个组件订阅一个外部 store。

---

## 自定义 Hook {/*your-own-hooks*/}

也可以在 JavaScript 函数中 [自定义 Hook](/learn/reusing-logic-with-custom-hooks#extracting-your-own-custom-hook-from-a-component)。
=======
## React {/*react*/}
Programmatic React features:  
* [Hooks](/reference/react/hooks) - Use different React features from your components.
* [Components](/reference/react/components) - Documents built-in components that you can use in your JSX.
* [APIs](/reference/react/apis) - APIs that are useful for defining components. 
* [Directives](/reference/react/directives) - Provide instructions to bundlers compatible with React Server Components.

## React DOM {/*react-dom*/}
React-dom contains features that are only supported for web applications 
(which run in the browser DOM environment). This section is broken into the following:

* [Hooks](/reference/react-dom/hooks) - Hooks for web applications which run in the browser DOM environment.
* [Components](/reference/react-dom/components) - React supports all of the browser built-in HTML and SVG components.
* [APIs](/reference/react-dom) - The `react-dom` package contains methods supported only in web applications.
* [Client APIs](/reference/react-dom/client) - The `react-dom/client` APIs let you render React components on the client (in the browser). 
* [Server APIs](/reference/react-dom/server) - The `react-dom/server` APIs let you render React components to HTML on the server.

## Legacy APIs {/*legacy-apis*/}
* [Legacy APIs](/reference/react/legacy) - Exported from the react package, but not recommended for use in newly written code. 
>>>>>>> 9c60167bf966286bafb99492e31b0609ccb56b5c
