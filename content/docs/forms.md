---
id: forms
title: Forms
permalink: docs/forms.html
prev: lists-and-keys.html
next: lifting-state-up.html
redirect_from:
  - "tips/controlled-input-null-value.html"
  - "docs/forms-zh-CN.html"
---

在 React 里，HTML 表单元素的工作方式和其他的 DOM 元素有些不同，这是因为表单元素通常会保持一些内部的状态。例如这个纯 HTML 表单只接受一个名称：

```html
<form>
  <label>
    Name:
    <input type="text" name="name" />
  </label>
  <input type="submit" value="Submit" />
</form>
```

此表单具有默认的 HTML 表单行为，即用户提交表单后浏览到新页面。在 React 中，如果你只需要这种行为，你不用做任何修改。但是，在大多数情况下，拥有一个处理表单提交和对用户输入的数据的访问的 javascript 函数是很方便的。实现这一点的标准方法是使用一种称为“受控组件”的技术。

## 受控组件 {#controlled-components}

在HTML中，表单元素（如`<input>`、`<textarea>`和`<select>`）通常保持自己的 state，并根据用户输入进行更新。在 React 中，可变状态通常保存在组件的 state 属性中，并且只用 [`setState()`](/docs/react-component.html#setstate)来更新.

我们可以把两者结合起来，使 React state 成为“事实的维一来源”。这样控制表单渲染的 React 组件还控制在随后的用户输入对表单的影响。这种输入值由 React 以这种方式控制着表单元素称为“受控组件”。

例如，如果我们想让前一个示例在提交时记录名称，我们可以将表单作为受控组件写入：

```javascript{4,10-12,24}
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

[**在CodePen试一试**](https://codepen.io/gaearon/pen/VmmPgp?editors=0010)

由于在表单元素上设置了 `value` 属性，因此显示的值将始终为 `this.state.value`，这使React state成为事实的来源。由于 `handlechange` 在每次按键时都会运行以更新 React state，因此显示的值将随着用户输入而更新。

对于受控组件，每个状态突变都有一个相关的处理函数。这使得修改或验证用户输入变得简单。例如，如果我们要强制要求所有名称都用大写字母书写，我们可以将 `handlechange` 写为：

```javascript{2}
handleChange(event) {
  this.setState({value: event.target.value.toUpperCase()});
}
```

## textarea 标签 {#the-textarea-tag}

在HTML中, `<textarea>` 元素通过其子元素定义其文本:

```html
<textarea>
  Hello there, this is some text in a text area
</textarea>
```
在 React 中，`<textarea>` 用 `value` 属性。这样，使用 `<textarea>` 的表单可以和使用单行input的表单非常类似：

```javascript{4-6,12-14,26}
class EssayForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'Please write an essay about your favorite DOM element.'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('An essay was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Essay:
          <textarea value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

请注意，`this.state.value` 是在构造函数中初始化的，因此文本区域开始时是有一些文本的。

## select 标签 {#the-select-tag}

在 HTML 中，`<select>` 创建下拉列表。例如，此 HTML 创建一个口味下拉列表：

```html
<select>
  <option value="grapefruit">Grapefruit</option>
  <option value="lime">Lime</option>
  <option selected value="coconut">Coconut</option>
  <option value="mango">Mango</option>
</select>
```

请注意，由于 `selected` 属性的缘故，椰子选项最初是被选中的。React 不使用此 `selected` 属性，而是在根 `select` 标签上使用 `value` 属性。这在受控组件中更方便，因为您只需要在一个地方更新它。例如：

```javascript{4,10-12,24}
class FlavorForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: 'coconut'};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('Your favorite flavor is: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Pick your favorite flavor:
          <select value={this.state.value} onChange={this.handleChange}>
            <option value="grapefruit">Grapefruit</option>
            <option value="lime">Lime</option>
            <option value="coconut">Coconut</option>
            <option value="mango">Mango</option>
          </select>
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

[**在CodePen试一试**](https://codepen.io/gaearon/pen/JbbEzX?editors=0010)

总的来说，这使得 `<input type=“text”>`, `<textarea>` 和 `<select>` 所有的标签工作都非常相似-它们都接受一个 `value` 属性，您可以使用它来实现一个受控制的组件。

> 注意
>
> 可以将数组传递到 `value` 属性中，允许您在 `select` 标签中选择多个选项：
>
>```js
><select multiple={true} value={['B', 'C']}>
>```

## 文件 input 标签 {#the-file-input-tag}

在HTML中，`<input type=“file”>` 允许用户从设备存储中选择一个或多个文件上载到服务器或通过 [File API](https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications) 来控制。

```html
<input type="file" />
```

因为它的值是只读的，所以它是 React 中的一个**不受控制的**组件。将与其他不受控制的部件[在以后的文档中](/docs/uncontrolled-components.html#the-file-input-tag)一起讨论。

## 处理多个输入 {#handling-multiple-inputs}

当需要处理多个 `input` 元素时，我们可以给每个元素添加 `name` 属性，并让处理函数根据 `event.target.name` 的值选择要执行的操作。

例如：

```javascript{15,18,28,37}
class Reservation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isGoing: true,
      numberOfGuests: 2
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <form>
        <label>
          Is going:
          <input
            name="isGoing"
            type="checkbox"
            checked={this.state.isGoing}
            onChange={this.handleInputChange} />
        </label>
        <br />
        <label>
          Number of guests:
          <input
            name="numberOfGuests"
            type="number"
            value={this.state.numberOfGuests}
            onChange={this.handleInputChange} />
        </label>
      </form>
    );
  }
}
```

[**在CodePen试一试**](https://codepen.io/gaearon/pen/wgedvV?editors=0010)

请注意，我们是如何使用 ES6 [计算属性名称](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Object_initializer#Computed_property_names)语法更新与给定输入名称对应的 state 键：

例如：

```js{2}
this.setState({
  [name]: value
});
```

等同 ES5:

```js{2}
var partialState = {};
partialState[name] = value;
this.setState(partialState);
```

另外，由于 `setState()` 自动[将部分状态合并到当前状态](/docs/state-and-lifecycle.html#state-updates-are-merged), 我们只需要用更改的部分来调用它。

## 受控输入空值 {#controlled-input-null-value}

如果您愿意，在[受控元素](/docs/forms.html#controlled-components)上指定 value prop 可防止用户更改输入。如果指定了 `value`，但输入仍可编辑，则可能是意外地将`value` 设置为  `undefined`或 `null`。

下面的代码演示了这一点。（输入最初被锁定，但在短时间延迟后变为可编辑。）

```javascript
ReactDOM.render(<input value="hi" />, mountNode);

setTimeout(function() {
  ReactDOM.render(<input value={null} />, mountNode);
}, 1000);

```

## 受控组件的替代品 {#alternatives-to-controlled-components}

有时使用受控制的组件会很麻烦，因为您需要为数据可以更改的每种方式编写一个事件处理程序，并通过一个 React 组件传递所有的输入状态。当您将先前存在的代码库转换为 React 或将 React 应用程序与非 React 库集成时，这可能会变得特别烦人。在这些情况下，您可能希望使用[非受控组件](/docs/uncontrolled-components.html), 这是实现输入表单的另一种技术。

## 成熟的解决方案 {#fully-fledged-solutions}

如果您正在寻找一个完整的解决方案，包括验证、跟踪访问的字段和处理表单提交, [Formik](https://jaredpalmer.com/formik) 是一个流行的选择。然而，它建立在受控组件和管理状态的相同原则之上——所以不要忽视学习它们。