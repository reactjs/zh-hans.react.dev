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
var ReactTestUtils = require('react-dom/test-utils'); // ES5 with npm
```

## 概述

`ReactTestUtils` 可搭配你所选的测试框架，轻松实现 React 组件测试。在 Facebook 内部，我们使用 [Jest](https://facebook.github.io/jest/) 来轻松实现 JavaScript 测试。你可以从 Jest 官网的 [React Tutorial](http://facebook.github.io/jest/docs/en/tutorial-react.html#content) 中了解如何开始使用它。

> 注意：
>
> Airbnb 发布了一款叫作 Enzyme 的测试工具，通过它能够轻松对 React 组件的输出进行断言、操控和遍历。如果你需要决定一款和 Jest 或者其他测试运行器搭配使用单元测试工具，值得看一下：[http://airbnb.io/enzyme/](http://airbnb.io/enzyme/)
>
> 另外，这里还有一款叫做 react-testing-library 的测试工具，它使得对组件编写测试用例就像终端用户在使用它一样方便，并且能与任何一款测试运行器配合工作：[https://git.io/react-testing-library](https://git.io/react-testing-library)

 - [`Simulate`](#simulate)
 - [`renderIntoDocument()`](#renderintodocument)
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

## 参考

## 浅层渲染

当我们为 React 编写单元测试时，浅层渲染非常有用。浅层渲染能使得组件渲染时”只渲染一层“，断言组件渲染函数所返回的内容，无需担心触发子组件的行为，因为没有真正地进行组件实例化和渲染。这种情况也不需要 DOM。

> 注意：
> 浅层渲染的方法被移动到了 `react-test-renderer/shallow`。<br>
> [学习更多关于浅层渲染的内容查看这篇文档](/docs/shallow-renderer.html)

## 其他工具方法

### `Simulate`

```javascript
Simulate.{eventName}(
  element,
  [eventData]
)
```

使用可选的 `eventData` 事件数据来模拟在 DOM 节点上触发一个事件。

[React 所支持的所有事件](/docs/events.html#supported-events) 在 `Simulate` 中都有对应的方法.

**点击一个元素**

```javascript
// <button ref={(node) => this.button = node}>...</button>
const node = this.button;
ReactTestUtils.Simulate.click(node);
```

**修改一个 input 输入框的值，然后按回车键**

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

### `renderIntoDocument()`

```javascript
renderIntoDocument(element)
```

渲染一个 React 元素到 document 中的一个单独的 DOM 节点上。**这个函数需要一个 DOM 对象。**

> 注意：
>
> 你需要在引入 `React` **之前**确保 `window`，`window.document` 和 `window.document.createElement` 能在全局环境中获取到。不然 React 会认为它没有权限去操作 DOM，以及像 `setState` 这样的方法将不可用。

* * *

### `mockComponent()`

```javascript
mockComponent(
  componentClass,
  [mockTagName]
)
```

将模拟组件模块传入这个方法后，React 内部会使用有效的方法填充该模块，使其成为虚拟的 React 组件。与通常的渲染不同，组件将变成一个简单的 `<div>` (如果提供了 `mockTagName` 则是其他标签)，包含任何提供的子级。

> 注意：
>
> `mockComponent()` 是一个过时的 API，我们推荐使用[浅层渲染](/docs/test-utils.html#shallow-rendering)或者 [`jest.mock()`](https://facebook.github.io/jest/docs/en/tutorial-react-native.html#mock-native-modules-using-jestmock) 来代替。

* * *

### `isElement()`

```javascript
isElement(element)
```

当 `element` 是任何一种 React 元素时，返回 `true`。

* * *

### `isElementOfType()`

```javascript
isElementOfType(
  element,
  componentClass
)
```

当 `element` 是一种 React 元素，并且它的类型是参数 `componentClass` 的类型时，返回 `true`。

* * *

### `isDOMComponent()`

```javascript
isDOMComponent(instance)
```

当 `instance` 是一个 DOM 组件（比如 `<div>` 或 `<span>`）时，返回 `true`。

* * *

### `isCompositeComponent()`

```javascript
isCompositeComponent(instance)
```

当 `instance` 是一个用户自定义的组件，比如一个类或者一个函数时，返回 `true`。

* * *

### `isCompositeComponentWithType()`

```javascript
isCompositeComponentWithType(
  instance,
  componentClass
)
```

当 `instance` 是一个组件，并且它的类型是参数 `componentClass` 的类型时，返回 `true`。

* * *

### `findAllInRenderedTree()`

```javascript
findAllInRenderedTree(
  tree,
  test
)
```

遍历所有在参数 `tree` 中的组件，记录所有 `test(component)` 为 `true` 的组件。单独调用此方法不是很有用，但是它常常被作为底层 API 被其他测试方法使用。

* * *

### `scryRenderedDOMComponentsWithClass()`

```javascript
scryRenderedDOMComponentsWithClass(
  tree,
  className
)
```

查找渲染树中组件的所有 DOM 元素，这些组件是 css 类名与参数 `className` 匹配的 DOM 组件。

* * *

### `findRenderedDOMComponentWithClass()`

```javascript
findRenderedDOMComponentWithClass(
  tree,
  className
)
```

功能类似于 [`scryRenderedDOMComponentsWithClass()`](#scryrendereddomcomponentswithclass)，但是预计只有一个结果，然后返回这个结果，如果除了一个匹配项之外还有其他匹配项，则抛出异常。

* * *

### `scryRenderedDOMComponentsWithTag()`

```javascript
scryRenderedDOMComponentsWithTag(
  tree,
  tagName
)
```

查找渲染树中组件的所有的 DOM 元素，这些组件是标记名与参数 `tagName` 匹配的 DOM 组件。

* * *

### `findRenderedDOMComponentWithTag()`

```javascript
findRenderedDOMComponentWithTag(
  tree,
  tagName
)
```

功能类似于 [`scryRenderedDOMComponentsWithTag()`](#scryrendereddomcomponentswithtag)，但是预计只有一个结果，然后返回这个结果，如果除了一个匹配项之外还有其他匹配项，则抛出异常。

* * *

### `scryRenderedComponentsWithType()`

```javascript
scryRenderedComponentsWithType(
  tree,
  componentClass
)
```

查找组件类型等于 `componentClass` 组件的所有实例。

* * *

### `findRenderedComponentWithType()`

```javascript
findRenderedComponentWithType(
  tree,
  componentClass
)
```

功能类似于 [`scryRenderedComponentsWithType()`](#scryrenderedcomponentswithtype)，但是预计只有一个结果，然后返回这个结果，如果除了一个匹配项之外还有其他匹配项，则抛出异常。

* * *

