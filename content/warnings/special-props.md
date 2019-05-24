---
title: 警告：特殊的 props
layout: single
permalink: warnings/special-props.html
---

大部分 JSX 元素上的 props 都会被传入组件，然而，有两个特殊的 props （`ref` 和 `key`） 已经被 React 所使用，因此不会被传入组件。

举个例子，在组件中试图获取 `this.props.key` （比如通过 render 函数或 [propTypes](/docs/typechecking-with-proptypes.html#proptypes))）将得到 undefined。如果你需要在子组件中获取相同的值，你应该用一个不同的 prop 来传入它（例如：`<ListItemWrapper key={result.id} id={result.id} />`）。虽然这似乎是多余的，但是将应用程序逻辑和协调提示（reconciliation hints）分开是很重要的。
