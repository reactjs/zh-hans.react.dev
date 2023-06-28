---
title: 未知属性警告
---

如果尝试使用 React 不认识的属性来渲染 DOM 元素，将会触发未知属性警告。你应该确保 DOM 元素没有无法识别的冗余属性。

出现此警告的可能原因有以下几个：

1. 你是否正在使用 `{...props}` 或 `cloneElement(element, props)`？在将 props 复制到子组件时，你应该确保不会意外地将仅用于父组件的 props 转发给子组件。请参阅下面针对此问题的常见修复方式。

2. 也许是为了展示自定义数据，你正在将非标准的 DOM 属性应用于 DOM 节点。如果你想将自定义数据附加到标准 DOM 元素上，请考虑使用自定义数据属性，如 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/Guide/HTML/Using_data_attributes) 中所述。

3. React 尚未识别指定的属性。这可能会在未来的 React 版本中修复。如果这样的属性名称为小写，React 将允许你传递它而不会出现警告。

4. 如果你使用一个首字母小写的 React 组件，如 `<myButton />`，React 会将其解释为 DOM 标签，因为 React JSX 使用大小写约定来区分用户自定义组件与 DOM 标签。对于自定义 React 组件，请使用 PascalCase 命名。例如，`<myButton />` 应该写为 `<MyButton />`。

---

如果你因为传递了类似 `{...props}` 的 props 而收到此警告，你的父组件需要使用（consume）任何仅用于父组件而不是子组件的 props。这是一个例子：

**错误的做法**：意外地将 `layout` props 转发给 `div` 标签。

```js
function MyDiv(props) {
  if (props.layout === 'horizontal') {
    // 错误！因为 layout 不是 <div> 能理解的属性。
    return <div {...props} style={getHorizontalStyle()} />
  } else {
    // 错误！因为 layout 不是 <div> 能理解的属性。
    return <div {...props} style={getVerticalStyle()} />
  }
}
```

**正确的做法**：使用展开运算符获取其他属性，并将这些属性放在一个变量中。

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

**正确的做法**：你也可以将 props 拷贝给一个新对象，并从新对象中删除正在使用的键。但要确保不要从原始的 `this.props` 对象中删除属性，因为该对象应被视为不可变的。

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
