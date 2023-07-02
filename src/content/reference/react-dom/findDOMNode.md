---
title: findDOMNode
---

<Deprecated>

此 API 将在未来的 React 主要版本中被移除。[请查看替代方案](#alternatives)。

</Deprecated>

<Intro>

`findDOMNode` 方法可以获取 [类式组件](/reference/react/Component) 实例对应的浏览器 DOM 节点。

```js
const domNode = findDOMNode(componentInstance)
```

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `findDOMNode(componentInstance)` {/*finddomnode*/}

使用 `findDOMNode` 获取 [类式组件](/reference/react/Component) 实例对应的浏览器 DOM 节点。

```js
import { findDOMNode } from 'react-dom';

const domNode = findDOMNode(componentInstance);
```

[参见下面更多示例](#usage)。

#### 参数 {/*parameters*/}

* `componentInstance`：[`Component`](/reference/react/Component) 子类的实例。举个例子，类式组件中的 `this`。


#### 返回值 {/*returns*/}

`findDOMNode` 方法返回与给定的 `componentInstance` 中最接近的浏览器 DOM 节点。当组件渲染为 `null` 或 `false` 时，`findDOMNode` 返回 `null`。当组件渲染为字符串时，`findDOMNode` 返回一个包含该值的文本 DOM 节点。

#### 注意 {/*caveats*/}

* 组件可能会返回包含多个子元素的数组或 [Fragment](/reference/react/Fragment)。在这种情况下，`findDOMNode` 会返回第一个非空子节点对应的 DOM 节点。

* `findDOMNode` 只对已经挂载到 DOM 上的组件有效。如果你尝试在一个还未挂载的组件上调用 `findDOMNode()`（比如在一个还未创建的组件的 `render()` 方法中调用 `findDOMNode()`），会抛出异常。

* `findDOMNode` 只会返回调用时的结果，你无法得知组件是否在之后渲染了不同的节点。

* `findDOMNode` 接受类组件实例作为参数，而不能用于函数式组件。

---

## 用法 {/*usage*/}

### 寻找类式组件对应的 DOM 节点 {/*finding-the-root-dom-node-of-a-class-component*/}

使用 `findDOMNode` 获取 [类式组件](/reference/react/Component) 实例（通常是 `this`）对应的已渲染 DOM 节点。

```js {3}
class AutoselectingInput extends Component {
  componentDidMount() {
    const input = findDOMNode(this);
    input.select()
  }

  render() {
    return <input defaultValue="你好" />
  }
}
```

在这里，`input` 变量将被设置为 `<input>` DOM 元素，这样你就可以对其进行操作。例如，当点击下方的“显示示例”按钮并挂载了输入框后，[`input.select()`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLInputElement/select) 会选中输入框中的所有文本：

<Sandpack>

```js App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        显示示例
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js AutoselectingInput.js active
import { Component } from 'react';
import { findDOMNode } from 'react-dom';

class AutoselectingInput extends Component {
  componentDidMount() {
    const input = findDOMNode(this);
    input.select()
  }

  render() {
    return <input defaultValue="你好" />
  }
}

export default AutoselectingInput;
```

</Sandpack>

---

## 替代方案 {/*alternatives*/}

### 使用 ref 读取组件自己的 DOM 节点 {/*reading-components-own-dom-node-from-a-ref*/}

由于 JSX 节点与操作相应的 DOM 节点的代码之间的联系不是显式的，因此使用 `findDOMNode` 的代码非常脆弱。例如，尝试将此 `<input />` 包装在一个 `<div>` 中：

<Sandpack>

```js App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        显示示例
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js AutoselectingInput.js active
import { Component } from 'react';
import { findDOMNode } from 'react-dom';

class AutoselectingInput extends Component {
  componentDidMount() {
    const input = findDOMNode(this);
    input.select()
  }
  render() {
    return <input defaultValue="Hello" />
  }
}

export default AutoselectingInput;
```

</Sandpack>

这将出现问题。`findDOMNode(this)` 找到的是 `<div>` 节点，但其实我们期望找到的是 `<input>` 节点。为了避免这些问题，考虑使用 [`createRef`](/reference/react/createRef) 管理特定的 DOM 节点。

在这个例子中不再使用 `findDOMNode`。相反，使用 `inputRef = createRef(null)` 并将其定义为类的实例字段。如果想要从中读取 DOM 节点，可以使用`this.inputRef.current`。如果想要将其附加在 JSX 上，考虑渲染 `<input ref={this.inputRef} />`。这将连接使用 DOM 节点的代码与对应 JSX。

<Sandpack>

```js App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        显示示例
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js AutoselectingInput.js active
import { createRef, Component } from 'react';

class AutoselectingInput extends Component {
  inputRef = createRef(null);

  componentDidMount() {
    const input = this.inputRef.current;
    input.select()
  }

  render() {
    return (
      <input ref={this.inputRef} defaultValue="你好" />
    );
  }
}

export default AutoselectingInput;
```

</Sandpack>

在函数式组件中，你应该使用 [`useRef`](/reference/react/useRef)：

<Sandpack>

```js App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        显示示例
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js AutoselectingInput.js active
import { useRef, useEffect } from 'react';

export default function AutoselectingInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    const input = inputRef.current;
    input.select();
  }, []);

  return <input ref={inputRef} defaultValue="你好" />
}
```

</Sandpack>

如果你想了解更多，请阅读 [使用 ref 操作 DOM](/learn/manipulating-the-dom-with-refs)。

---

### 使用 ref 操作子组件的 DOM 节点 {/*reading-a-child-components-dom-node-from-a-forwarded-ref*/}

在这个例子中，`findDOMNode(this)` 获取了属于另一个组件的 DOM 节点。`AutoselectingInput` 渲染了我们自己的 `MyInput` 组件，而 `MyInput` 渲染了浏览器标签 `<input>`。

<Sandpack>

```js App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        显示示例
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js AutoselectingInput.js active
import { Component } from 'react';
import { findDOMNode } from 'react-dom';
import MyInput from './MyInput.js';

class AutoselectingInput extends Component {
  componentDidMount() {
    const input = findDOMNode(this);
    input.select()
  }
  render() {
    return <MyInput />;
  }
}

export default AutoselectingInput;
```

```js MyInput.js
export default function MyInput() {
  return <input defaultValue="你好" />;
}
```

</Sandpack>

请注意，即使 `<input>` 被隐藏在 `MyInput` 组件中，在 `AutoselectingInput` 中调用 `findDOMNode(this)` 仍然会返回 `<input>`。这在上面的例子中似乎很方便，但它会导致代码变得非常脆弱。想象一下，如果你以后想编辑 `MyInput` 并使用 `<div>` 包装，但是这将会破坏 `AutoselectingInput` 的代码（因为它期望找到 `<input>`）。

考虑在这个例子中替换 `findDOMNode`，并且下列两个组件需要协同工作：

1. 在 `AutoSelectingInput` 中声明一个 ref，就像 [前面的例子](#reading-components-own-dom-node-from-a-ref) 中一样，并将其传递给 `<MyInput>`。
2. `MyInput` 使用 [`forwardRef`](/reference/react/forwardRef) 接收该 ref 并将其转发到 `<input>` 节点。

这种方式解决了这个问题，所以不再需要 `findDOMNode`：

<Sandpack>

```js App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        显示示例
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js AutoselectingInput.js active
import { createRef, Component } from 'react';
import MyInput from './MyInput.js';

class AutoselectingInput extends Component {
  inputRef = createRef(null);

  componentDidMount() {
    const input = this.inputRef.current;
    input.select()
  }

  render() {
    return (
      <MyInput ref={this.inputRef} />
    );
  }
}

export default AutoselectingInput;
```

```js MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  return <input ref={ref} defaultValue="你好" />;
});

export default MyInput;
```

</Sandpack>

以下是上面代码在函数式组件中的样子：

<Sandpack>

```js App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        显示示例
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js AutoselectingInput.js active
import { useRef, useEffect } from 'react';
import MyInput from './MyInput.js';

export default function AutoselectingInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    const input = inputRef.current;
    input.select();
  }, []);

  return <MyInput ref={inputRef} defaultValue="你好" />
}
```

```js MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  return <input ref={ref} defaultValue="你好" />;
});

export default MyInput;
```

</Sandpack>

---

### 使用 `<div>` 包装 {/*adding-a-wrapper-div-element*/}

有时，一个组件想要知道子元素的位置和大小。这会让你想要使用 `findDOMNode(this)` 查找子元素，然后使用 [`getBoundingClientRect`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getBoundingClientRect) 等 DOM 方法来进行测量。

目前，还没有直接适用于此场景的替代方法，这就是为什么 `findDOMNode` 已弃用但尚未从 React 中完全删除的原因。在此期间，你可以尝试在内容周围使用 `<div>` 包装，并向其添加 ref。但是，额外的包装可能会破坏样式。

```js
<div ref={someRef}>
  {children}
</div>
```

这对于聚焦以及滚动到任何子元素也是一样。
