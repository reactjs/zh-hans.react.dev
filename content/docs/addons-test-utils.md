---
id: test-utils
title: Test Utilities
permalink: docs/test-utils.html
layout: docs
category: Reference
---

**如何引入**

```javascript
import ReactTestUtils from 'react-dom/test-utils'; // ES6
var ReactTestUtils = require('react-dom/test-utils'); // ES5 使用 npm 的方式
```

## 概览 {#overview}

`ReactTestUtils` 可搭配你所选的测试框架，轻松实现 React 组件测试。在 Facebook 内部，我们使用 [Jest](https://facebook.github.io/jest/) 来轻松实现 JavaScript 测试。你可以从 Jest 官网的 [React 教程](https://jestjs.io/docs/tutorial-react)中了解如何开始使用它。

> 注意：
>
> 我们推荐使用 [React Testing Library](https://testing-library.com/react)，它使得针对组件编写测试用例就像终端用户在使用它一样方便。
>
> 当使用的 React 版本 <= 16 时，可以使用 [Enzyme](https://airbnb.io/enzyme/) 的测试工具，通过它能够轻松对 React 组件的输出进行断言、操控和遍历。

 - [`act()`](#act)
 - [`mockComponent()`](#mockcomponent)
 - [`isElement()`](#iselement)
 - [`isElementOfType()`](#iselementoftype)
 - [`isDOMComponent()`](#isdomcomponent)
 - [`isCompositeComponent()`](#iscompositecomponent)
 - [`isCompositeComponentWithType()`](#iscompositecomponentwithtype)
 - [`findAllInRenderedTree()`](#findallinrenderedtree)
 - [`scryRenderedDOMComponentsWithClass()`](#scryrendereddomcomponentswithclass)
 - [`findRenderedDOMComponentWithClass()`](#findrendereddomcomponentwithclass)
 - [`scryRenderedDOMComponentsWithTag()`](#scryrendereddomcomponentswithtag)
 - [`findRenderedDOMComponentWithTag()`](#findrendereddomcomponentwithtag)
 - [`scryRenderedComponentsWithType()`](#scryrenderedcomponentswithtype)
 - [`findRenderedComponentWithType()`](#findrenderedcomponentwithtype)
 - [`renderIntoDocument()`](#renderintodocument)
 - [`Simulate`](#simulate)

## 参考 {#reference}

### `act()` {#act}

为断言准备一个组件，包裹要渲染的代码并在调用 `act()` 时执行更新。这会使得测试更接近 React 在浏览器中的工作方式。

>注意
>
>如果你使用了 `react-test-renderer`，它也提供了与 `act` 行为相同的函数。

例如，假设我们有个 `Counter` 组件:

```js
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: 0};
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    document.title = `You clicked ${this.state.count} times`;
  }
  componentDidUpdate() {
    document.title = `You clicked ${this.state.count} times`;
  }
  handleClick() {
    this.setState(state => ({
      count: state.count + 1,
    }));
  }
  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={this.handleClick}>
          Click me
        </button>
      </div>
    );
  }
}
```

以下是其测试代码：

```js{3,20-22,29-31}
import React from 'react';
import ReactDOM from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import Counter from './Counter';

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it('can render and update a counter', () => {
  // 首先测试 render 和 componentDidMount
  act(() => {
    ReactDOM.createRoot(container).render(<Counter />);
  });
  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('You clicked 0 times');
  expect(document.title).toBe('You clicked 0 times');

  // 再测试 render 和 componentDidUpdate
  act(() => {
    button.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });
  expect(label.textContent).toBe('You clicked 1 times');
  expect(document.title).toBe('You clicked 1 times');
});
```

千万不要忘记，只有将 DOM 容器添加到 `document` 时，触发 DOM 事件才生效。你可以使用类似于 [React Testing Library](https://testing-library.com/react) 等库来减少样板代码（boilerplate code）。

- [`recipes`](/docs/testing-recipes.html) 文档包含了关于 `act()` 函数的示例、用法及更多详细信息。

* * *

### `mockComponent()` {#mockcomponent}

```javascript
mockComponent(
  componentClass,
  [mockTagName]
)
```

将模拟组件模块传入这个方法后，React 内部会使用有效的方法填充该模块，使其成为虚拟的 React 组件。与通常的渲染不同，组件将变成一个简单的 `<div>` (如果提供了 `mockTagName` 则是其他标签)，包含任何提供的子级。

> 注意：
>
> `mockComponent()` 是一个过时的 API，我们推荐使用 [`jest.mock()`](https://jestjs.io/docs/tutorial-react-native#mock-native-modules-using-jestmock) 来代替。

* * *

### `isElement()` {#iselement}

```javascript
isElement(element)
```

当 `element` 是任何一种 React 元素时，返回 `true`。

* * *

### `isElementOfType()` {#iselementoftype}

```javascript
isElementOfType(
  element,
  componentClass
)
```

当 `element` 是一种 React 元素，并且它的类型是参数 `componentClass` 的类型时，返回 `true`。

* * *

### `isDOMComponent()` {#isdomcomponent}

```javascript
isDOMComponent(instance)
```

当 `instance` 是一个 DOM 组件（比如 `<div>` 或 `<span>`）时，返回 `true`。

* * *

### `isCompositeComponent()` {#iscompositecomponent}

```javascript
isCompositeComponent(instance)
```

当 `instance` 是一个用户自定义的组件，比如一个类或者一个函数时，返回 `true`。

* * *

### `isCompositeComponentWithType()` {#iscompositecomponentwithtype}

```javascript
isCompositeComponentWithType(
  instance,
  componentClass
)
```

当 `instance` 是一个组件，并且它的类型是参数 `componentClass` 的类型时，返回 `true`。

* * *

### `findAllInRenderedTree()` {#findallinrenderedtree}

```javascript
findAllInRenderedTree(
  tree,
  test
)
```

遍历所有在参数 `tree` 中的组件，记录所有 `test(component)` 为 `true` 的组件。单独调用此方法不是很有用，但是它常常被作为底层 API 被其他测试方法使用。

* * *

### `scryRenderedDOMComponentsWithClass()` {#scryrendereddomcomponentswithclass}

```javascript
scryRenderedDOMComponentsWithClass(
  tree,
  className
)
```

查找渲染树中组件的所有 DOM 元素，这些组件是 css 类名与参数 `className` 匹配的 DOM 组件。

* * *

### `findRenderedDOMComponentWithClass()` {#findrendereddomcomponentwithclass}

```javascript
findRenderedDOMComponentWithClass(
  tree,
  className
)
```

用法与 [`scryRenderedDOMComponentsWithClass()`](#scryrendereddomcomponentswithclass) 保持一致，但期望仅返回一个结果。不符合预期的情况下会抛出异常。

* * *

### `scryRenderedDOMComponentsWithTag()` {#scryrendereddomcomponentswithtag}

```javascript
scryRenderedDOMComponentsWithTag(
  tree,
  tagName
)
```

查找渲染树中组件的所有的 DOM 元素，这些组件是标记名与参数 `tagName` 匹配的 DOM 组件。

* * *

### `findRenderedDOMComponentWithTag()` {#findrendereddomcomponentwithtag}

```javascript
findRenderedDOMComponentWithTag(
  tree,
  tagName
)
```

用法与 [`scryRenderedDOMComponentsWithTag()`](#scryrendereddomcomponentswithtag) 保持一致，但期望仅返回一个结果。不符合预期的情况下会抛出异常。

* * *

### `scryRenderedComponentsWithType()` {#scryrenderedcomponentswithtype}

```javascript
scryRenderedComponentsWithType(
  tree,
  componentClass
)
```

查找组件类型等于 `componentClass` 组件的所有实例。

* * *

### `findRenderedComponentWithType()` {#findrenderedcomponentwithtype}

```javascript
findRenderedComponentWithType(
  tree,
  componentClass
)
```

用法与 [`scryRenderedComponentsWithType()`](#scryrenderedcomponentswithtype) 保持一致，但期望仅返回一个结果。不符合预期的情况下会抛出异常。

* * *

### `renderIntoDocument()` {#renderintodocument}

```javascript
renderIntoDocument(element)
```

渲染 React 元素到 document 中的某个单独的 DOM 节点上。**这个函数需要一个 DOM 对象。** 它实际相当于：

```js
const domContainer = document.createElement('div');
ReactDOM.createRoot(domContainer).render(element);
```

> 注意：
>
> 你需要在引入 `React` **之前**确保 `window` 存在，`window.document` 和 `window.document.createElement` 能在全局环境中获取到。不然 React 会认为它没有权限去操作 DOM，以及像 `setState` 这样的方法将不可用。

* * *

## 其他工具方法 {#other-utilities}

### `Simulate` {#simulate}

```javascript
Simulate.{eventName}(
  element,
  [eventData]
)
```

使用可选的 `eventData` 事件数据来模拟在 DOM 节点上触发事件。

[React 所支持的所有事件](/docs/events.html#supported-events) 在 `Simulate` 中都有对应的方法。

**点击元素**

```javascript
// <button ref={(node) => this.button = node}>...</button>
const node = this.button;
ReactTestUtils.Simulate.click(node);
```

**修改一个 input 输入框的值，然后按回车键。**

```javascript
// <input ref={(node) => this.textInput = node} />
const node = this.textInput;
node.value = 'giraffe';
ReactTestUtils.Simulate.change(node);
ReactTestUtils.Simulate.keyDown(node, {key: "Enter", keyCode: 13, which: 13});
```

> 注意：
>
> 你必须提供一切需要在组件中用到的事件属性（比如：keyCode、which 等等），因为 React 没有为你创建这些属性。

* * *
