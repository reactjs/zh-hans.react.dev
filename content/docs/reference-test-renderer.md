---
id: test-renderer
title: Test Renderer
permalink: docs/test-renderer.html
layout: docs
category: Reference
---

**如何引入**

```javascript
import TestRenderer from 'react-test-renderer'; // ES6
const TestRenderer = require('react-test-renderer'); // ES5 with npm
```

## 概览 {#overview}

这个 package 提供了一个 React 渲染器，用于将 React 组件渲染成纯 JavaScript 对象，无需依赖 DOM 或原生移动环境。

这个 package 提供的主要功能是在不依赖浏览器或 [jsdom](https://github.com/tmpvar/jsdom) 的情况下，返回某个时间点由 React DOM 或者 React Native 平台渲染出的视图结构（类似与 DOM 树）快照。

示例:

```javascript
import TestRenderer from 'react-test-renderer';

function Link(props) {
  return <a href={props.page}>{props.children}</a>;
}

const testRenderer = TestRenderer.create(
  <Link page="https://www.facebook.com/">Facebook</Link>
);

console.log(testRenderer.toJSON());
// { type: 'a',
//   props: { href: 'https://www.facebook.com/' },
//   children: [ 'Facebook' ] }
```

你可以使用 Jest 的快照测试功能来自动保存当前 `JSON` 树结构到一个文件中，并在测试中检查它是否被修改：[了解更多](https://jestjs.io/docs/en/snapshot-testing)。

你也可以通过遍历输出来查找特定节点，并对它们进行断言。

```javascript
import TestRenderer from 'react-test-renderer';

function MyComponent() {
  return (
    <div>
      <SubComponent foo="bar" />
      <p className="my">Hello</p>
    </div>
  )
}

function SubComponent() {
  return (
    <p className="sub">Sub</p>
  );
}

const testRenderer = TestRenderer.create(<MyComponent />);
const testInstance = testRenderer.root;

expect(testInstance.findByType(SubComponent).props.foo).toBe('bar');
expect(testInstance.findByProps({className: "sub"}).children).toEqual(['Sub']);
```

### TestRenderer {#testrenderer}

* [`TestRenderer.create()`](#testrenderercreate)
* [`TestRenderer.act()`](#testrendereract)

### TestRenderer instance {#testrenderer-instance}

* [`testRenderer.toJSON()`](#testrenderertojson)
* [`testRenderer.toTree()`](#testrenderertotree)
* [`testRenderer.update()`](#testrendererupdate)
* [`testRenderer.unmount()`](#testrendererunmount)
* [`testRenderer.getInstance()`](#testrenderergetinstance)
* [`testRenderer.root`](#testrendererroot)

### TestInstance {#testinstance}

* [`testInstance.find()`](#testinstancefind)
* [`testInstance.findByType()`](#testinstancefindbytype)
* [`testInstance.findByProps()`](#testinstancefindbyprops)
* [`testInstance.findAll()`](#testinstancefindall)
* [`testInstance.findAllByType()`](#testinstancefindallbytype)
* [`testInstance.findAllByProps()`](#testinstancefindallbyprops)
* [`testInstance.instance`](#testinstanceinstance)
* [`testInstance.type`](#testinstancetype)
* [`testInstance.props`](#testinstanceprops)
* [`testInstance.parent`](#testinstanceparent)
* [`testInstance.children`](#testinstancechildren)

## 参考 {#reference}

### `TestRenderer.create()` {#testrenderercreate}

```javascript
TestRenderer.create(element, options);
```

通过传来的 React 元素创建一个 `TestRenderer` 实例。它并不使用真实的 DOM，但是它依然将组件树完整地渲染到内存，以便于你对它进行断言。此时将返回一个 [TestRenderer 实例](#testrenderer-instance)。

### `TestRenderer.act()` {#testrendereract}

```javascript
TestRenderer.act(callback);
```

与 [`react-dom/test-utils` 中的 `act()`](/docs/test-utils.html#act) 相似，`TestRender.act` 为断言准备一个组件。可以使用 `act()` 来包装 `TestRenderer.create` 和 `testRenderer.update`。

```javascript
import {create, act} from 'react-test-renderer';
import App from './app.js'; // The component being tested

// 渲染组件
let root; 
act(() => {
  root = create(<App value={1}/>)
});

// 对根元素进行断言
expect(root.toJSON()).toMatchSnapshot();

// 更新 props
act(() => {
  root = root.update(<App value={2}/>);
})

// 对根元素进行断言
expect(root.toJSON()).toMatchSnapshot();
```

### `testRenderer.toJSON()` {#testrenderertojson}

```javascript
testRenderer.toJSON()
```

返回一个已渲染的的树对象。该树仅包含特定平台的节点，例如 `<div>` 或 `<View>` 和它们的 props，但并不包含任何用户编写的组件。这对于[快照测试](http://facebook.github.io/jest/docs/en/snapshot-testing.html#snapshot-testing-with-jest)非常方便。

### `testRenderer.toTree()` {#testrenderertotree}

```javascript
testRenderer.toTree()
```

返回一个已渲染的的树对象。它所表示的内容比 `toJSON()` 提供的内容要更加详细，并且包含用户编写的组件。除非你要在测试渲染器（test renderer）之上编写自己的断言库，否则你可能并不需要这个方法。

### `testRenderer.update()` {#testrendererupdate}

```javascript
testRenderer.update(element)
```

使用新的根元素重新渲染内存中的树。它模拟根元素的一次 React 更新。如果新的元素和之前的元素有相同的 type 和 key，该树将会被更新；否则，它将重挂载一个新树。

### `testRenderer.unmount()` {#testrendererunmount}

```javascript
testRenderer.unmount()
```

卸载内存中的树，会触发相应的生命周期事件。

### `testRenderer.getInstance()` {#testrenderergetinstance}

```javascript
testRenderer.getInstance()
```

如果可用的话，返回与根元素相对应的实例。如果根元素是函数定义组件，该方法无效，因为函数定义组件没有实例。

### `testRenderer.root` {#testrendererroot}

```javascript
testRenderer.root
```

返回根元素“测试实例”对象，它对于断言树中的特定节点十分有用。你可以利用它来查找其他更深层的“测试实例”。

### `testInstance.find()` {#testinstancefind}

```javascript
testInstance.find(test)
```

找到一个 `test(testInstance)` 返回 `true` 的后代测试实例。如果不只有一个测试实例匹配，将会报错。

### `testInstance.findByType()` {#testinstancefindbytype}

```javascript
testInstance.findByType(type)
```

找到匹配指定 `type` 的后代测试实例，如果不是只有一个测试实例匹配指定的 `type`，将会报错。

### `testInstance.findByProps()` {#testinstancefindbyprops}

```javascript
testInstance.findByProps(props)
```

找到匹配指定 `props`的后代测试实例，如果不是正好只有一个测试实例匹配指定的 `props`，将会报错。

### `testInstance.findAll()` {#testinstancefindall}

```javascript
testInstance.findAll(test)
```

找到所有 `test(testInstance)` 返回 `true` 的后代测试实例。

### `testInstance.findAllByType()` {#testinstancefindallbytype}

```javascript
testInstance.findAllByType(type)
```

找到所有匹配指定 `type` 的后代测试实例。

### `testInstance.findAllByProps()` {#testinstancefindallbyprops}

```javascript
testInstance.findAllByProps(props)
```

找到所有匹配指定 `props` 的后代测试实例。

### `testInstance.instance` {#testinstanceinstance}

```javascript
testInstance.instance
```

该测试实例相对应的组件实例。它只能用于类定义组件，因为函数定义组件没有实例。它匹配给定的组件内部的 `this` 的值。

### `testInstance.type` {#testinstancetype}

```javascript
testInstance.type
```

该测试实例相对应的组件的类型。例如，一个 `<Button />` 组件有一个 `Button` 类型。

### `testInstance.props` {#testinstanceprops}

```javascript
testInstance.props
```

该测试实例相对应的组件的 props。例如，一个 `<Button size="small" />` 组件的 props 为 `{size: 'small'}`。

### `testInstance.parent` {#testinstanceparent}

```javascript
testInstance.parent
```

该测试实例的父测试实例。

### `testInstance.children` {#testinstancechildren}

```javascript
testInstance.children
```

该测试实例的子测试实例。

## 想法 {#ideas}

你可以把 `createNodeMock` 函数作为选项（option）传递给 `TestRenderer.create`，进行自定义 refs 模拟。`createNodeMock` 接受当前元素作为参数，并且返回一个模拟 ref 对象的。这十分有利于依赖 refs 组件的测试。

```javascript
import TestRenderer from 'react-test-renderer';

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.input = null;
  }
  componentDidMount() {
    this.input.focus();
  }
  render() {
    return <input type="text" ref={el => this.input = el} />
  }
}

let focused = false;
TestRenderer.create(
  <MyComponent />,
  {
    createNodeMock: (element) => {
      if (element.type === 'input') {
        // 模拟 focus 函数
        return {
          focus: () => {
            focused = true;
          }
        };
      }
      return null;
    }
  }
);
expect(focused).toBe(true);
```
