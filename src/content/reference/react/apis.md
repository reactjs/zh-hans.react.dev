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

* [`createContext`](/reference/react/createContext) API 可以创建一个 context，你可以将其提供给子组件，通常会与 [`useContext`](/reference/react/useContext) 一起配合使用。
* [`forwardRef`](/reference/react/forwardRef) 允许组件将 DOM 节点作为 ref 暴露给父组件。
* [`lazy`](/reference/react/lazy) 允许你延迟加载组件，直到该组件需要第一次被渲染。
* [`memo`](/reference/react/memo) 允许你在 props 没有变化的情况下跳过组件的重渲染。通常 [`useMemo`](/reference/react/useMemo) 与 [`useCallback`](/reference/react/useCallback) 会一起配合使用。
* [`startTransition`](/reference/react/startTransition) 允许你可以标记一个状态更新是不紧急的。类似于 [`useTransition`](/reference/react/useTransition)。
