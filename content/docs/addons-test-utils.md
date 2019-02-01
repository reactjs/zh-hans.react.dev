---
id: test-utils
title: Test Utilities
permalink: docs/test-utils.html
layout: docs
category: Reference
---

**引入**

```javascript
import ReactTestUtils from 'react-dom/test-utils'; // ES6
var ReactTestUtils = require('react-dom/test-utils'); // ES5 with npm
```

## 概述

`ReactTestUtils` 让你在所选的测试框架中测试 React 组件变得容易。在 Facebook 我们使用 [Jest](https://facebook.github.io/jest/) 来做无压力 JavaScript 测试。学习如何开始使用 Jest 测试可以浏览官方文档中的 [React Tutorial](http://facebook.github.io/jest/docs/en/tutorial-react.html#content) 部分。

> 注意：
>
> Airbnb 发布了一款叫作 Enzyme 的测试工具，它能轻松对 React 组件的输出进行断言、控制和遍历。如果你需要决定一款和 Jest 搭配使用单元测试工具，或者其他测试运行器，值得看一下：[http://airbnb.io/enzyme/](http://airbnb.io/enzyme/)
> 
> 或者，这里有另外一款叫作 react-testing-library 的测试工具，设计成能够和鼓励像终端用户使用你的组件一样写测试用例。并且它也能与其他任何一款测试运行器配合工作：[https://git.io/react-testing-library](https://git.io/react-testing-library)

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

当我们为 React 编写单元测试时，浅层渲染非常有用。浅层渲染能让你渲染一个组件时“只渲染一层”，然后断言组件渲染函数返回的内容，不用担心子组件的渲染行为，这样没有组件实例化和真正的渲染。这种情况也不需要 DOM。

> 注意：
> 
> 浅层渲染的方法被移动到了 `react-test-renderer/shallow`。<br>
> [学习更多关于浅层渲染的内容查看这篇文档](/docs/shallow-renderer.html)

## 其他工具库

### `Simulate`

```javascript
Simulate.{eventName}(
  element,
  [eventData]
)
```

模拟在 DOM 节点上触发一个事件，使用可选的 `eventData` 事件数据。

`Simulate` 有对应的方法来支持 [React 支持的事件](/docs/events.html#supported-events).

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
> 你需要在引入 `React` 之前确保 `window`，`window.document` 和 `window.document.createElement` 能在全局环境中获取到。不然 React 会认为它没有权限去操作 DOM，以及像 `setState` 方法将不可用。

* * *

### `mockComponent()`

```javascript
mockComponent(
  componentClass,
  [mockTagName]
)
```

将一个模拟组件模块传递给这个方法，使用方法来扩充它，使它可以用作一个木偶 React 组件。与通常的渲染不同，组件将变成一个简单的 `<div>` (如果提供了 `mockTagName` 则是其他标签)，包含任何提供的子级。

> 注意：
>
> `mockComponent()` 是一个过时的 API，我们推荐使用 [shallow rendering](/docs/test-utils.html#shallow-rendering) 或者 [`jest.mock()`](https://facebook.github.io/jest/docs/en/tutorial-react-native.html#mock-native-modules-using-jestmock) 来代替。

* * *

### `isElement()`

```javascript
isElement(element)
```

结果返回 `true`，当 `element` 是任何一种 React 元素。

* * *

### `isElementOfType()`

```javascript
isElementOfType(
  element,
  componentClass
)
```

结果返回 `true`，当 `element` 是一种 React 元素，并且它的类型是参数 `componentClass` 的类型。

* * *

### `isDOMComponent()`

```javascript
isDOMComponent(instance)
```

结果返回 `true`，当 `instance` 是一个 DOM 组件（比如 `<div>` 或 `<span>`）。

* * *

### `isCompositeComponent()`

```javascript
isCompositeComponent(instance)
```

结果返回 `true`，当 `instance` 是一个用户自定义的组件，比如一个类或者一个函数。

* * *

### `isCompositeComponentWithType()`

```javascript
isCompositeComponentWithType(
  instance,
  componentClass
)
```

结果返回 `true`，当 `instance` 是一个组件，并且它的类型是参数 `componentClass` 的类型。

* * *

### `findAllInRenderedTree()`

```javascript
findAllInRenderedTree(
  tree,
  test
)
```

遍历所有在参数 `tree` 中的组件，记录所有 `test(component)` 为 `true` 的组件。这个方法本身没有那么有用，但是它常常被用作其他测试用例的原型。

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

查找组件类型等于参数 `componentClass` 的组件的所有实例。

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

