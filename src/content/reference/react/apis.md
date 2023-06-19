---
title: 内置的 React API
translators:
  - loveloki
---

<Intro>

除了 [Hooks](/reference/react) 和 [Components](/reference/react/components)，`react` 还导出了一些可用于定义组件的 API。此页面列出了所有剩余的现代 React API。

</Intro>

---

* [`createContext`](/reference/react/createContext) 让你向子组件定义和提供一个 context。与 [`useContext`](/reference/react/useContext) 一起使用。
* [`forwardRef`](/reference/react/forwardRef) 让你的组件作为一个 ref 将 DOM 节点暴露给父节点。与 [`useRef`](/reference/react/useRef) 一起使用。
* [`lazy`](/reference/react/lazy) 让你延迟加载组件代码，直到它第一次被渲染。
* [`memo`](/reference/react/memo) 让你在 props 没有变化的情况下跳过组件的重渲染。与 [`useMemo`](/reference/react/useMemo) 和 [`useCallback`](/reference/react/useCallback) 一起使用。
* [`startTransition`](/reference/react/startTransition) 让你可以标记一个状态更新是不紧急的。类似于 [`useTransition`](/reference/react/useTransition)。
