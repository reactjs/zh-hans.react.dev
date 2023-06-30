---
title: 特殊属性警告
---

JSX 上的大多数 props 都会传递给组件，但是有两个特殊的 props（`ref` 与 `key`）被 React 自身使用，因此这两个 props 不会被转发给组件。

例如，组件无法读取 `props.key`。如果你需要在子组件中访问相同的值，你应该将其作为不同的 props传递，如 `<ListItemWrapper key={result.id} id={result.id} />` 并读取 `props.id`。尽管这可能看起来很多余，但将应用逻辑与 React 提示分开非常重要。
