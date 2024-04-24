---
title: 内置的 React API
translators:
  - loveloki
  - Yucohny
---

<Intro>

除了 [Hooks](/reference/react) 和 [Components](/reference/react/components) 之外，`react` 包还导出了一些其他的 API，这些 API 对于创建组件非常有用。本页面将介绍这些剩余的 React API。

</Intro>

---

<<<<<<< HEAD
* [`createContext`](/reference/react/createContext) API 可以创建一个 context，你可以将其提供给子组件，通常会与 [`useContext`](/reference/react/useContext) 一起配合使用。
* [`forwardRef`](/reference/react/forwardRef) 允许组件将 DOM 节点作为 ref 暴露给父组件。
* [`lazy`](/reference/react/lazy) 允许你延迟加载组件，直到该组件需要第一次被渲染。
* [`memo`](/reference/react/memo) 允许你在 props 没有变化的情况下跳过组件的重渲染。通常 [`useMemo`](/reference/react/useMemo) 与 [`useCallback`](/reference/react/useCallback) 会一起配合使用。
* [`startTransition`](/reference/react/startTransition) 允许你可以标记一个状态更新是不紧急的。类似于 [`useTransition`](/reference/react/useTransition)。
=======
* [`createContext`](/reference/react/createContext) lets you define and provide context to the child components. Used with [`useContext`.](/reference/react/useContext)
* [`forwardRef`](/reference/react/forwardRef) lets your component expose a DOM node as a ref to the parent. Used with [`useRef`.](/reference/react/useRef)
* [`lazy`](/reference/react/lazy) lets you defer loading a component's code until it's rendered for the first time.
* [`memo`](/reference/react/memo) lets your component skip re-renders with same props. Used with [`useMemo`](/reference/react/useMemo) and [`useCallback`.](/reference/react/useCallback)
* [`startTransition`](/reference/react/startTransition) lets you mark a state update as non-urgent. Similar to [`useTransition`.](/reference/react/useTransition)

---

## Resource APIs {/*resource-apis*/}

*Resources* can be accessed by a component without having them as part of their state. For example, a component can read a message from a Promise or read styling information from a context.

To read a value from a resource, use this API:

* [`use`](/reference/react/use) lets you read the value of a resource like a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) or [context](/learn/passing-data-deeply-with-context).
```js
function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  // ...
}
```
>>>>>>> 9fb2f0dd12ef0babc9dc30c0eb984e49a94a9a20
