---
title: createElement
---

<Intro>

`createElement` 允许你创建一个 React 元素。它可以作为 [JSX](/learn/writing-markup-with-jsx) 的替代方案。

```js
const element = createElement(type, props, ...children)
```

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `createElement(type, props, ...children)` {/*createelement*/}

调用 `createElement` 来创建一个 React 元素，它有 `type`、`props` 和 `children` 三个参数。

```js
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    '你好'
  );
}
```

[查看更多例子](#usage)。

#### 参数 {/*parameters*/}

* `type`：`type` 参数必须是一个有效的 React 组件类型，例如一个字符串标签名（如 `'div'` 或 `'span'`），或一个 React 组件（一个函数式组件、一个类式组件，或者是一个特殊的组件如 [`Fragment`](/reference/react/Fragment)）。

* `props`：`props` 参数必须是一个对象或 `null`。如果你传入 `null`，它会被当作一个空对象。创建的 React 元素的 `props` 与这个参数相同。注意，`props` 对象中的 `ref` 和 `key` 比较特殊，它们 **不会** 作为 `element.props.ref` 和 `element.props.key` 出现在创建的元素 `element` 上，而是作为 `element.ref` 和 `element.key` 出现。

* **可选** `...children`：零个或多个子节点。它们可以是任何 React 节点，包括 React 元素、字符串、数字、[portal](/reference/react-dom/createPortal)、空节点（`null`、`undefined`、`true` 和 `false`），以及 React 节点数组。

#### 返回值 {/*returns*/}

`createElement` 返回一个 React 元素，它有这些属性：

* `type`：你传入的 `type`。
* `props`：你传入的 `props`，不包括 `ref` 和 `key`。如果 `type` 是一个组件，且带有过时的 `type.defaultProps` 属性，那么 `props` 中任何缺失或未定义的字段都会采用 `type.defaultProps` 中的值。
* `ref`：你传入的 `ref`。如果缺失则为 `null`。
* `key`：你传入的 `key`，会被强制转换为字符串。如果缺失则为 `null`。

通常你会在你组件的最后返回这个元素，或者把它作为另一个元素的子元素。虽然你可以读取元素的属性，但你最好把创建的元素作为黑盒，只用于渲染。

#### 注意事项 {/*caveats*/}

* 你必须 **把 React 元素和它们的 props 视为 [不可变的](https://en.wikipedia.org/wiki/Immutable_object)**，在创建后永远不要改变它们的内容。在开发环境中，React 会浅层 [冻结](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) 返回的元素及其 `props` 属性，以确保如此。

* 当你使用 JSX 时，**你必须以大写字母开头来渲染你的自定义组件**。换句话说，`<Something />` 等价于 `createElement(Something)`，但 `<something />`（小写）等价于 `createElement('something')`（注意它是一个字符串，它会被当作内置的 HTML 标签）。

* 你应该仅 **在所有子元素都是静态可知的情况下，才将它们依次传递给 `createElement` 的可选参数**，比如 `createElement('h1', {}, child1, child2, child3)`。如果你的子元素不固定，则把它们放到数组中作为第三个参数传递，例如 `createElement('ul', {}, listItems)`，以此确保 React 可以在动态列表的场景下 [警告你缺少 `key`](/learn/rendering-lists#keeping-list-items-in-order-with-key)。静态列表的场景不需要这么做，因为它们不会重新排序。

---

## 用法 {/*usage*/}

## 不使用 JSX 创建元素 {/*creating-an-element-without-jsx*/}

如果你不喜欢 [JSX](/learn/writing-markup-with-jsx) 或者无法在你的项目中使用它，你可以使用 `createElement` 作为替代方案。

要想不使用 JSX 创建一个元素，你可以调用 `createElement` 并传入 <CodeStep step={1}>type</CodeStep>、<CodeStep step={2}>props</CodeStep> 和 <CodeStep step={3}>children</CodeStep>：

```js [[1, 5, "'h1'"], [2, 6, "{ className: 'greeting' }"], [3, 7, "'你好',"], [3, 8, "createElement('i', null, name),"], [3, 9, "'。欢迎！'"]]
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    '你好',
    createElement('i', null, name),
    '。欢迎！'
  );
}
```

<CodeStep step={3}>children</CodeStep> 是可选的，你可以传入任意数量的子元素（上面的例子中有三个）。这段代码会显示一个带有问候语的 `<h1>` 标题。为了对比，这是使用 JSX 的版本：

```js [[1, 3, "h1"], [2, 3, "className=\\"greeting\\""], [3, 4, "你好<i>{name}</i>，欢迎！"], [1, 5, "h1"]]
function Greeting({ name }) {
  return (
    <h1 className="greeting">
      你好<i>{name}</i>，欢迎！
    </h1>
  );
}
```

要想渲染你自己的 React 组件，则传入一个函数（比如 `Greeting`）作为 <CodeStep step={1}>type</CodeStep> ，而不是一个字符串（比如 `'h1'`）：

```js [[1, 2, "Greeting"], [2, 2, "{ name: '泰勒' }"]]
export default function App() {
  return createElement(Greeting, { name: '泰勒' });
}
```

如果使用 JSX，它看起来像这样：

```js [[1, 2, "Greeting"], [2, 2, "name=\\"泰勒\\""]]
export default function App() {
  return <Greeting name="泰勒" />;
}
```

这里是一个完整的使用 `createElement` 的示例：

<Sandpack>

```js
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    '你好',
    createElement('i', null, name),
    '，欢迎！'
  );
}

export default function App() {
  return createElement(
    Greeting,
    { name: '泰勒' }
  );
}
```

```css
.greeting {
  color: darkgreen;
  font-family: Georgia;
}
```

</Sandpack>

这里是相同的示例，但使用的是 JSX：

<Sandpack>

```js
function Greeting({ name }) {
  return (
    <h1 className="greeting">
      你好<i>{name}</i>，欢迎！
    </h1>
  );
}

export default function App() {
  return <Greeting name="泰勒" />;
}
```

```css
.greeting {
  color: darkgreen;
  font-family: Georgia;
}
```

</Sandpack>

两种编码风格都没问题，你可以在项目中使用任何一个你喜欢的风格。相比于 `createElement`，使用 JSX 的主要好处是很容易看出哪个闭合标签对应哪个开放标签。

<DeepDive>

#### React 元素究竟是什么？ {/*what-is-a-react-element-exactly*/}

元素是用来描述一部分用户界面的轻量级结构。比如，`<Greeting name="泰勒" />` 和 `createElement(Greeting, { name: '泰勒' })` 都会生成一个这样的对象：

```js
// 极度简化的样子
{
  type: Greeting,
  props: {
    name: '泰勒'
  },
  key: null,
  ref: null,
}
```

**注意，创建这个对象并不会渲染 `Greeting` 组件或者创建任何 DOM 元素**。

React 元素更像是一个描述或指令，它告诉 React 之后该如何渲染 `Greeting` 组件。你从 `App` 组件中返回了这个对象，就是告诉了 React 接下来该做什么。

创建元素非常高效，因此你不需要试图优化或者避免它。

</DeepDive>
