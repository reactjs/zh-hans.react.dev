---
title: PureComponent
---

<Pitfall>

我们建议使用函数式组件而非类式组件。[查看如何迁移](#alternatives)。

</Pitfall>

<Intro>

`PureComponent` 类似于 [`Component`](/reference/react/Component)，但是当 props 和 state 与之前保持一致时会跳过重新渲染。React 仍然支持类式组件，但我们不建议在新代码中使用。

```js
class Greeting extends PureComponent {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `PureComponent` {/*purecomponent*/}

为了在 props 和 state 相同时跳过重新渲染，类式组件应该继承 `PureComponent` 而不是 [`Component`](/reference/react/Component)：

```js
import { PureComponent } from 'react';

class Greeting extends PureComponent {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

`PureComponent` 是 `Component` 的子类，并且支持 [所有 `Component` 的 API](/reference/react/Component#reference)。继承 `PureComponent` 的子类相当与定义了一个自定义的 [`shouldComponentUpdate`](/reference/react/Component#shouldcomponentupdate) 方法，该方法将浅比较 props 和 state。


[请参阅以下更多示例](#usage)。

---

## 用法 {/*usage*/}

### 跳过类式组件不必要的重新渲染 {/*skipping-unnecessary-re-renders-for-class-components*/}

当父组件重新渲染时，React 通常会重新渲染子组件。为了优化性能，你可以创建一个组件，在父组件重新渲染时不会重新渲染，前提是新的 props 和 state 与旧的 props 和 state 相同。[类式组件](/reference/react/Component) 可以通过继承 `PureComponent` 来选择此行为。

```js {1}
class Greeting extends PureComponent {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

React 组件应该始终具有 [纯粹的渲染逻辑](/learn/keeping-components-pure)。这意味着如果 props、state 和 context 没有发生变化，它必须返回相同的输出。使用 `PureComponent` 便是在告诉 React 你的组件符合这个要求，因此只要 props 和 state 没有改变，React 就不需要重新渲染组件。然而，如果你的组件正在使用的 context 发生变化，它仍会重新渲染。

注意，在这个例子中，`Greeting` 组件会在 `name` 改变时重新渲染（因为这是它的 props），但在 `address` 改变时不会（因为它没有作为 props 传递给 `Greeting`）：

<Sandpack>

```js
import { PureComponent, useState } from 'react';

class Greeting extends PureComponent {
  render() {
    console.log("Greeting was rendered at", new Date().toLocaleTimeString());
    return <h3>Hello{this.props.name && ', '}{this.props.name}!</h3>;
  }
}

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

<Pitfall>

我们建议使用函数式组件而非类式组件。[查看如何迁移](#alternatives)。

</Pitfall>

---

## 替代方案 {/*alternatives*/}

### 从 `PureComponent` 类式组件迁移到函数式组件 {/*migrating-from-a-purecomponent-class-component-to-a-function*/}

我们建议在新代码中使用函数式组件，而不是 [类式组件](/reference/react/Component)。如果你有一些使用 `PureComponent` 的现有组件，以下是如何进行转换。这是原始代码：

<Sandpack>

```js
import { PureComponent, useState } from 'react';

class Greeting extends PureComponent {
  render() {
    console.log("Greeting was rendered at", new Date().toLocaleTimeString());
    return <h3>Hello{this.props.name && ', '}{this.props.name}!</h3>;
  }
}

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

当你 [将这个组件从类式组件转换为函数式组件](/reference/react/Component#alternatives) 时，将其包装在 [`memo`](/reference/react/memo)：

<Sandpack>

```js
import { memo, useState } from 'react';

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting was rendered at", new Date().toLocaleTimeString());
  return <h3>Hello{name && ', '}{name}!</h3>;
});

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

<Note>

与 `PureComponent` 不同，[`memo`](/reference/react/memo) 不会比较新旧 state。在函数组件中，即使没有 `memo`，调用具有相同 state 的 [`set` 函数](/reference/react/useState#setstate)，[默认已经阻止了重新渲染](/reference/react/memo#updating-a-memoized-component-using-state)。

</Note>
