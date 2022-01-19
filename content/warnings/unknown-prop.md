---
title: 警告：未知的 Prop
layout: single
permalink: warnings/unknown-prop.html
---
当你尝试用一个无法被 React 识别为合法 DOM 属性（attribute / property）的 prop 渲染 DOM 元素时，会出现 unknown-prop 警告。你应该确保你的 DOM 元素上没有这类失效的 props。

这个警告出现的原因可能有如下几种：

1. 你使用了 `{...this.props}` 或者 `cloneElement(element, this.props)` 吗？你的组件会直接把它自己的 props 传递给子元素（例如 [传递 props](/docs/transferring-props.html))。向子组件传递 props 时，你应该避免转发本应由父组件解释的 props。

2. 你在原生 DOM 节点上使用的是非标准的 DOM 属性，或许是用来表示自定义数据。如果你想把自定义数据附加到标准 DOM 元素上，请参考 [MDN](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Using_data_attributes) 使用自定义的 data 属性。

3. React 还不能识别你指定的属性。这可能会在 React 的未来版本中修复。不过，React 目前会去除所有未知的属性，因此即使在 React 应用中指定这些属性也无法使它们渲染。

4. 你在使用 React 组件但是没有使用大写，React 会将其解释为 DOM 标签，这是因为 [React JSX 语法使用大小写约定来区分用户自定义组件和 DOM 标签](/docs/jsx-in-depth.html#user-defined-components-must-be-capitalized)。

---

要解决这个问题，组合组件应该“消费掉”任何只用于复合组件而不是子组件的 prop。例如：

**Bad：** `layout` prop 意外转发给了 `div` 标签。

```js
function MyDiv(props) {
  if (props.layout === 'horizontal') {
    // 糟糕的！ 因为你很清楚 <div> 不知道如何处理 "layout" 这个 prop。
    return <div {...props} style={getHorizontalStyle()} />
  } else {
    // 糟糕的！ 因为你很清楚 <div> 不知道如何处理 "layout" 这个 prop。
    return <div {...props} style={getVerticalStyle()} />
  }
}
```

**Good：** 展开运算符能从 props 中剥离变量，并将剩余的 props 放到一个新变量中。

```js
function MyDiv(props) {
  const { layout, ...rest } = props
  if (layout === 'horizontal') {
    return <div {...rest} style={getHorizontalStyle()} />
  } else {
    return <div {...rest} style={getVerticalStyle()} />
  }
}
```

**Good：** 你也可以将 props 分配给一个新的对象，并从新对象中删除你正在使用的属性。注意不要删除原始对象 `this.props` 中的 props，因为这个对象理应被认为是不可变的。

```js
function MyDiv(props) {

  const divProps = Object.assign({}, props);
  delete divProps.layout;

  if (props.layout === 'horizontal') {
    return <div {...divProps} style={getHorizontalStyle()} />
  } else {
    return <div {...divProps} style={getVerticalStyle()} />
  }
}
```
