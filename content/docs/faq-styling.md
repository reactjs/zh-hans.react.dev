---
id: faq-styling
title: 样式与 CSS
permalink: docs/faq-styling.html
layout: docs
category: FAQ
---

### 我如何为组件添加 CSS 类？ {#how-do-i-add-css-classes-to-components}

传递一个字符串作为 `className` 属性：

```jsx
render() {
  return <span className="menu navigation-menu">Menu</span>
}
```

CSS 类依赖组件的 props 或 state 的情况很常见：

```jsx
render() {
  let className = 'menu';
  if (this.props.isActive) {
    className += ' menu-active';
  }
  return <span className={className}>Menu</span>
}
```

>提示
>
>如果你经常发现自己写类似这样的代码， [classnames](https://www.npmjs.com/package/classnames#usage-with-reactjs) package 可以简化这一过程。

### 我可以使用行内样式吗？ {#can-i-use-inline-styles}

可以，在[此处](/docs/dom-elements.html#style)查看关于样式的文档。

### 行内样式不好 (bad) 吗？ {#are-inline-styles-bad}

从性能角度来说，CSS 类通常比行内样式更好。

### 什么是 CSS-in-JS? {#what-is-css-in-js}

“CSS-in-JS” 是指一种模式，其中 CSS 由 JavaScript 生成而不是在外部文件中定义。在[此处](https://github.com/MicheleBertoli/css-in-js)阅读 CSS-in-JS 库的一个比较。

_注意此功能并不是 React 的一部分，而是由第三方库提供。_ React 对样式如何定义并没有一个观点；如果有所怀疑，一个好的起点是和平时一样，在一个单独的 `*.css` 文件定义你的样式，并且通过 [`className`](/docs/dom-elements.html#classname) 指代它们。

### 我可以在 React 中实现动画效果吗？ {#can-i-do-animations-in-react}

React 可以被用来实现动画。参见 [React Transition Group](https://reactcommunity.org/react-transition-group/) 和 [React Motion](https://github.com/chenglou/react-motion)，举例说明。
