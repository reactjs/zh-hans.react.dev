---
id: shallow-renderer
title: 浅层渲染
permalink: docs/shallow-renderer.html
layout: docs
category: Reference
---

**如何引入**

```javascript
import ShallowRenderer from 'react-test-renderer/shallow'; // ES6
var ShallowRenderer = require('react-test-renderer/shallow'); // ES5 with npm
```

## 概览 {#overview}

当为 React 编写单元测试时，浅层渲染十分有用。浅层渲染可以只渲染组件的“第一层”，并且对组件的 render 方法的返回值进行断言，不必担心子组件的行为，子组件并没有实例化或被渲染。并且浅层渲染不依赖 DOM。

例如，如果你有如下的组件：

```javascript
function MyComponent() {
  return (
    <div>
      <span className="heading">Title</span>
      <Subcomponent foo="bar" />
    </div>
  );
}
```

你可以使用断言：

```javascript
import ShallowRenderer from 'react-test-renderer/shallow';

// 测试代码:
const renderer = new ShallowRenderer();
renderer.render(<MyComponent />);
const result = renderer.getRenderOutput();

expect(result.type).toBe('div');
expect(result.props.children).toEqual([
  <span className="heading">Title</span>,
  <Subcomponent foo="bar" />
]);
```

浅层测试（Shallow testing）目前有些局限性，即不支持 refs。

> 注意：
>
> 建议你查阅 Enzyme 的[浅层渲染的 API](https://airbnb.io/enzyme/docs/api/shallow.html)。它在相同的功能基础上提供了更棒更高级的 API。

## 参考 {#reference}

### `shallowRenderer.render()` {#shallowrendererrender}

你可以把 shallowRenderer 看作用来渲染测试中组件的“容器”，且可以从容器中取到该组件的输出内容。

`shallowRenderer.render()` 和 [`ReactDOM.render()`](/docs/react-dom-client.html#createroot) 很像，但是它不依赖 DOM 且只渲染一层。这意味着你可以对组件和其子组件的实现进行隔离测试。

### `shallowRenderer.getRenderOutput()` {#shallowrenderergetrenderoutput}

在 `shallowRenderer.render()` 被调用后，你可以使用 `shallowRenderer.getRenderOutput()` 来获取浅层渲染的输出内容。

然后，你就可以开始对输出内容进行断言操作。
