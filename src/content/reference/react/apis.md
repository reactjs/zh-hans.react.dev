---
title: 内置的 React API
translators:
  - loveloki
  - Yucohny
---

<Intro>

除了 [Hooks](/reference/react) 和 [Components](/reference/react/components)，`react` 还导出了一些可用于定义组件的 API。此页面列出了所有剩余的现代 React API。

</Intro>

---

* [`createContext`](/reference/react/createContext) 允许你定义和提供一个 context，并可以将其传递给子组件。与 [`useContext`](/reference/react/useContext) 一起使用。
* [`forwardRef`](/reference/react/forwardRef) 允许组件将 DOM 节点作为 ref 暴露给父组件。
* [`lazy`](/reference/react/lazy) 允许你延迟加载组件，直到该组件需要第一次被渲染。
* [`memo`](/reference/react/memo) 允许你在 props 没有变化的情况下跳过组件的重渲染。与 [`useMemo`](/reference/react/useMemo) 和 [`useCallback`](/reference/react/useCallback) 一起使用。
* [`startTransition`](/reference/react/startTransition) 允许你可以标记一个状态更新是不紧急的。类似于 [`useTransition`](/reference/react/useTransition)。
