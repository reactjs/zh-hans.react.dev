---
title: createRef
---

<Pitfall>

`createRef` 主要用于 [class 组件](/reference/react/Component)。而函数组件通常使用 [`useRef`](/reference/react/useRef)。

</Pitfall>

<Intro>

`createRef` 创建一个 [ref](/learn/referencing-values-with-refs) 对象，该对象可以包含任意值。

```js
class MyInput extends Component {
  inputRef = createRef();
  // ...
}
```

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `createRef()` {/*createref*/}

在 [class 组件](/reference/react/Component) 中调用 `createRef` 来声明一个 [ref](/learn/referencing-values-with-refs)。

```js
import { createRef, Component } from 'react';

class MyComponent extends Component {
  intervalRef = createRef();
  inputRef = createRef();
  // ...
```

[请看下方更多示例](#usage)。

#### 参数 {/*parameters*/}

`createRef` 不接受任何参数。

#### 返回值 {/*returns*/}

`createRef` 返回一个对象，该对象只有一个属性：

* `current`：初始值为 `null`，你可以稍后设置为其他内容。如果你把 ref 对象作为 JSX 节点的 `ref` 属性传递给 React，React 将设置其 `current` 属性。

#### 注意事项 {/*caveats*/}

* `createRef` 总是返回一个 **不同的** 对象。这相当于你自己编写了 `{ current: null }`。
* 在函数组件中，你可能想要使用 [`useRef`](/reference/react/useRef)，因为它始终返回相同的对象。
* `const ref = useRef()` 等同于 `const [ref, _] = useState(() => createRef(null))`。

---

## 用法 {/*usage*/}

### 在 class 组件中声明 ref {/*declaring-a-ref-in-a-class-component*/}

要在 [class 组件](/reference/react/Component) 中声明一个 ref，请调用 `createRef` 并将其结果分配给 class 字段：

```js {4}
import { Component, createRef } from 'react';

class Form extends Component {
  inputRef = createRef();

  // ...
}
```

如果你现在将 `ref={this.inputRef}` 传递给 JSX 中的 `<input>`，React 将把 input 的 DOM 节点赋值给 `this.inputRef.current`。例如，下面这段代码演示了如何创建一个按钮，点击该按钮会将焦点聚焦在输入框上：

<Sandpack>

```js
import { Component, createRef } from 'react';

export default class Form extends Component {
  inputRef = createRef();

  handleClick = () => {
    this.inputRef.current.focus();
  }

  render() {
    return (
      <>
        <input ref={this.inputRef} />
        <button onClick={this.handleClick}>
          聚焦这个输入框
        </button>
      </>
    );
  }
}
```

</Sandpack>

<Pitfall>

`createRef` 主要用于 [class 组件](/reference/react/Component)。而函数组件通常使用 [`useRef`](/reference/react/useRef)。

</Pitfall>

---

## 替代方案 {/*alternatives*/}

### 从使用 `createRef` 的 class 组件迁移到使用 `useRef` 的函数组件 {/*migrating-from-a-class-with-createref-to-a-function-with-useref*/}

我们建议在新代码中使用函数组件而不是 [class 组件](/reference/react/Component)。如果你有一些使用了 `createRef` 的 class 组件，以下是如何将它们转换为函数组件。这是原始代码：

<Sandpack>

```js
import { Component, createRef } from 'react';

export default class Form extends Component {
  inputRef = createRef();

  handleClick = () => {
    this.inputRef.current.focus();
  }

  render() {
    return (
      <>
        <input ref={this.inputRef} />
        <button onClick={this.handleClick}>
          聚焦这个输入框
        </button>
      </>
    );
  }
}
```

</Sandpack>

当你 [将此组件从 class 组件转化为函数组件](/reference/react/Component#alternatives) 时，用 [`useRef`](/reference/react/useRef) 替换 `createRef` 的调用：

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        聚焦这个输入框
      </button>
    </>
  );
}
```

</Sandpack>
