---
title: 有状态组件
order: 1
domid: timer-example
---

除了使用外部数据（通过 `this.props` 访问）以外，组件还可以维护其内部的状态数据（通过 `this.state` 访问）。当组件的状态数据改变时，组件会再次调用 `render()` 方法重新渲染对应的标记。
