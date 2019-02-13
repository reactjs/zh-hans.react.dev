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

## 概述 {#overview}

当为 React 写单元测试时，浅层渲染十分有用。浅层渲染可以使你只渲染一个组件的“第一层”，并且对组件的 render 方法的返回值进行断言，不用担心子组件的行为，子组件并没有实例化或被渲染。并且浅层渲染不需要 DOM。

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

你可以断言(assert)：

```javascript
import ShallowRenderer from 'react-test-renderer/shallow';

// 在你的测试中:
const renderer = new ShallowRenderer();
renderer.render(<MyComponent />);
const result = renderer.getRenderOutput();

expect(result.type).toBe('div');
expect(result.props.children).toEqual([
  <span className="heading">Title</span>,
  <Subcomponent foo="bar" />
]);
```

浅层测试（Shallow testing）当前还有一些局限，即不支持 refs。

> 注意:
>
> 我们还建议你看看 Enzyme 的 [Shallow Rendering API](http://airbnb.io/enzyme/docs/api/shallow.html)。它在相同的功能上提供了一个更棒的高级 API。

## 参考 {#reference}

### `shallowRenderer.render()` {#shallowrendererrender}

你可以把 shallowRenderer 看作一个用来渲染你正在测试的组件的“地方”，并且你可以从那里取到该组件的输出。

`shallowRenderer.render()` 和 [`ReactDOM.render()`](/docs/react-dom.html#render) 很像，但是它不需要 DOM 并且只渲染一层。 这意味着你可以只测试组件，不必担心它的子组件是如何实现的。

### `shallowRenderer.getRenderOutput()` {#shallowrenderergetrenderoutput}

在 `shallowRenderer.render()` 被调用后，你可以使用 `shallowRenderer.getRenderOutput()` 来获取浅层渲染的输出。

然后，你就可以开始对输出进行断言（assert）了。
