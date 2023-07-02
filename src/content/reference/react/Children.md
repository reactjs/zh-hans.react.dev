---
title: Children
---

<Pitfall>

使用 `Children` 的场景并不常见，使用它可能会削弱代码的健壮性。[查看常见的替代方案](#alternatives)。

</Pitfall>

<Intro>

`Children` 允许你处理和转化作为 [`children`](/learn/passing-props-to-a-component#passing-jsx-as-children) 的 JSX。

```js
const mappedChildren = Children.map(children, child =>
  <div className="Row">
    {child}
  </div>
);

```

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `Children.count(children)` {/*children-count*/}

调用 `Children.count(children)` 可以获取 `children` 中的节点数量。

```js RowList.js active
import { Children } from 'react';

function RowList({ children }) {
  return (
    <>
      <h1>行数: {Children.count(children)}</h1>
      ...
    </>
  );
}
```

[请参阅下面的更多示例](#counting-children)。

#### 参数 {/*children-count-parameters*/}

* `children`：组件接收到的 [`children` 参数](/learn/passing-props-to-a-component#passing-jsx-as-children)。

#### 返回值 {/*children-count-returns*/}

`children` 中的节点数量。

#### 注意事项 {/*children-count-caveats*/}

- 空节点（`null`，`undefined` 以及布尔值），字符串，数字和 [React 元素](/reference/react/createElement) 都会被统计为一个节点。**在遍历统计的过程中，React 元素不会被渲染，所以其子节点不会被统计**。 [Fragment](/reference/react/Fragment) 也不会被统计。对于数组，它本身也不会被统计，但其中的元素遵循上述规则。

---

### `Children.forEach(children, fn, thisArg?)` {/*children-foreach*/}

调用 `Children.forEach(children, fn, thisArg?)` 可以为每个 `children` 中的每个子节点执行一段代码。

```js RowList.js active
import { Children } from 'react';

function SeparatorList({ children }) {
  const result = [];
  Children.forEach(children, (child, index) => {
    result.push(child);
    result.push(<hr key={index} />);
  });
  // ...
```

[请参阅下面的更多示例](#running-some-code-for-each-child)。

#### 参数 {/*children-foreach-parameters*/}

* `children`：组件接收到的 [`children` 属性](/learn/passing-props-to-a-component#passing-jsx-as-children)。
* `fn`：和 [数组的 `forEach` 方法]((https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)) 中的回调类似，是你希望为每个子节点执行的函数。当这个函数执行时，对应的子节点和其下标将分别作为函数的第一、第二个参数，下标从 `0` 开始自增。
* **可选** `thisArg`：为 `fn` 函数绑定 [`this`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)。默认值为 `undefined`。

#### 返回值 {/*children-foreach-returns*/}

`Children.forEach` 返回值是 `undefined`。

#### 注意事项 {/*children-foreach-caveats*/}

- 空节点（`null`，`undefined` 以及布尔值），字符串，数字和 [React 元素](/reference/react/createElement) 都会被统计为单个节点。**在遍历统计的过程中，React 元素不会被渲染，所以其子节点不会被统计**。[Fragment](/reference/react/Fragment) 也不会被统计。对于数组，它本身也不会被统计，但其中的元素遵循上述规则。

---

### `Children.map(children, fn, thisArg?)` {/*children-map*/}

调用 `Children.map(children, fn, thisArg?)` 可以对 `children` 中的每个子节点进行映射或转换。

```js RowList.js active
import { Children } from 'react';

function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

[请参阅下面的更多示例](#transforming-children)。

#### 参数 {/*children-map-parameters*/}

* `children`：组件接收到的 [`children` 属性](/learn/passing-props-to-a-component#passing-jsx-as-children)。
* `fn`：和 [数组的 `map` 方法](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) 中的回调类似，是一个映射函数。当这个函数执行时，对应的子节点和其下标将分别作为函数的第一、第二个参数，下标从 `0` 开始自增。你需要使这个映射函数返回一个 React 节点，它可以是一个空节点（`null`，`undefined`）。
* **可选** `thisArg`：为 `fn` 函数绑定 [`this`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)。默认值为 `undefined`。

#### 返回值 {/*children-map-returns*/}

如果 `children` 是 `null` 或者 `undefined`，那么就返回这个值。

否则就返回一个由 `fn` 函数返回节点组成的一维数组。这个数组将包含除 `null` 和 `undefined` 以外的所有节点。

#### 注意事项 {/*children-map-caveats*/}

- 空节点（`null`，`undefined` 以及布尔值），字符串，数字和 [React 元素](/reference/react/createElement) 都会被统计为单个节点。**在遍历统计的过程中，React 元素不会被渲染，所以其子节点不会被统计**。[Fragment](/reference/react/Fragment) 也不会被统计。对于数组，它本身也不会被统计，但其中的元素遵循上述规则。

- 如果你在 `fn` 中返回了一个具有 key 的元素或者元素数组，**各个元素的 key 将自动与其在 `children` 中对应的原始项的 key 绑定**。当你在 `fn` 中返回了一个包含了多个元素的数组时，其中的每个元素的 key 都需要保证在这个数组中是独一无二的。

---

### `Children.only(children)` {/*children-only*/}


调用 `Children.only(children)` 能够断言 `children` 代表一个 React 元素。

```js
function Box({ children }) {
  const element = Children.only(children);
  // ...
```

#### 参数 {/*children-only-parameters*/}

* `children`：组件接收到的 [`children` 属性](/learn/passing-props-to-a-component#passing-jsx-as-children)。

#### 返回值 {/*children-only-returns*/}

如果 `children` [是一个合法的元素](/reference/react/isValidElement)，那么就会返回这个元素。 

否则会抛出一个异常。

#### 注意事项 {/*children-only-caveats*/}

- 如果传入一个数组（比如 `Children.map` 的返回值）作为 `children`，那么这个方法会抛出异常。也就是说，这个方法强制要求 `children` 是一个 React 元素，而不是一个元素数组。

---

### `Children.toArray(children)` {/*children-toarray*/}

调用 `Children.toArray(children)` 能够通过 `children` 创建一个数组。

```js ReversedList.js active
import { Children } from 'react';

export default function ReversedList({ children }) {
  const result = Children.toArray(children);
  result.reverse();
  // ...
```

#### 参数 {/*children-toarray-parameters*/}

* `children`：组件接收到的 [`children` 属性](/learn/passing-props-to-a-component#passing-jsx-as-children)。

#### 返回值 {/*children-toarray-returns*/}

返回一个由 `children` 中的元素构成的一维数组。

#### 注意事项 {/*children-toarray-caveats*/}

- 空节点（`null`，`undefined` 以及 布尔值）将在返回的数组中被忽略掉。**返回的元素的 key 将根据原始元素的 key 和其嵌套层级与位置进行计算得到**。这保证了扁平化数组时不会更改原本的行为。

---

## 用法 {/*usage*/}

### 转化 children {/*transforming-children*/}

如果想修改组件 [接收到的 `children` 属性](/learn/passing-props-to-a-component#passing-jsx-as-children)，那么可以使用 `Children.map`：

```js {6,10}
import { Children } from 'react';

function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

在上述例子中，`RowList` 用 `<div className="Row">` 包裹了接收到的每一个子元素。举个例子，假设父组件将三个 `<p>` 作为 `children` 属性传递给 `RowList`：

```js
<RowList>
  <p>这是第一项。</p>
  <p>这是第二项。</p>
  <p>这是第三项。</p>
</RowList>
```

然后，使用实现上面的 `RowList`，最终的渲染结果将是像下面这样：

```js
<div className="RowList">
  <div className="Row">
    <p>这是第一项。</p>
  </div>
  <div className="Row">
    <p>这是第二项。</p>
  </div>
  <div className="Row">
    <p>这是第三项。</p>
  </div>
</div>
```

`Children.map` 和 [用来转化数组的 `map()` 类似](/learn/rendering-lists)。区别在于 `children` 被视为 **不透明的**。这意味着即使有时它真的是一个数组，你也不应该假设它是一个数组或者其他数据类型。这就是为什么如果你要转换`children`, 应该使用 `Children.map`。

<Sandpack>

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>这是第一项。</p>
      <p>这是第二项。</p>
      <p>这是第三项。</p>
    </RowList>
  );
}
```

```js RowList.js active
import { Children } from 'react';

export default function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

<DeepDive>

#### 为什么 children 属性并不总是一个数组？ {/*why-is-the-children-prop-not-always-an-array*/}

在 React 中，`children` 属性是被视为 **不透明的** 数据结构。这意味着你不应该依赖它的结构。如果要转换，过滤，或者统计子节点，你应该使用 `Children` 方法。

实际操作过程中，`children` 在底层常常被表示为数组。但是如果这里只有一个子节点，那么 React 将不会创建数组，因为这将导致不必要的内存开销。只要你使用 `Children` 方法而不是直接操作 `children` 底层结构，即使 React 改变了 `children` 数据结构的实际实现方式，你的代码也不会被中断。

当 `children` 是一个数组时，`Children.map` 会有许多有用的特性。比如，`Children.map` 将被返回元素上的 [key](/learn/rendering-lists#keeping-list-items-in-order-with-key) 和 你传递给它的 `children` 上的 key 绑定。这保证了原本的 JSX 子元素不会“丢失” key，即使它们上面的例子中那样被包裹。

</DeepDive>

<Pitfall>

`children` 的数据结构中 **不会包括你传递的 JSX 组件的渲染输出结果**。在下面的例子中，`RowList` 接收到的 `children` 仅包含两个子项而不是三个：

1. `<p>这是第一项。</p>`
2. `<MoreRows />`

这就是为什么在这个例子中仅产生了两个行级元素容器。

<Sandpack>

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>这是第一项。</p>
      <MoreRows />
    </RowList>
  );
}

function MoreRows() {
  return (
    <>
      <p>这是第二项。</p>
      <p>这是第三项。</p>
    </>
  );
}
```

```js RowList.js
import { Children } from 'react';

export default function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

当操作 `children` 时，我们没办法获取到像 `<MoreRows />` 这样的内部组件的渲染输出结果，这就是为什么 [我们更推荐使用替代方案之一](#alternatives)。

</Pitfall>

---

### 为每一个子元素执行一段代码 {/*running-some-code-for-each-child*/}

调用 `Children.forEach` 能够迭代 `children` 数据结构中的每一个子节点。它并不会返回任何值，这和 [数组的 `forEach` 方法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) 类似。你可以使用它来运行自定义逻辑，例如构造自己的数组。

<Sandpack>

```js
import SeparatorList from './SeparatorList.js';

export default function App() {
  return (
    <SeparatorList>
      <p>这是第一项。</p>
      <p>这是第二项。</p>
      <p>这是第三项。</p>
    </SeparatorList>
  );
}
```

```js SeparatorList.js active
import { Children } from 'react';

export default function SeparatorList({ children }) {
  const result = [];
  Children.forEach(children, (child, index) => {
    result.push(child);
    result.push(<hr key={index} />);
  });
  result.pop(); // Remove the last separator
  return result;
}
```

</Sandpack>

<Pitfall>

就像之前提到过的一样，当操作 `children` 时，我们没办法获取到内部组件的渲染输出结果。这就是为什么 [我们更推荐使用替代方案之一](#alternatives)。

</Pitfall>

---

### 统计子节点 {/*counting-children*/}

调用 `Children.count(children)` 能够计算子节点的数量。

<Sandpack>

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>这是第一项。</p>
      <p>这是第二项。</p>
      <p>这是第三项。</p>
    </RowList>
  );
}
```

```js RowList.js active
import { Children } from 'react';

export default function RowList({ children }) {
  return (
    <div className="RowList">
      <h1 className="RowListHeader">
        Total rows: {Children.count(children)}
      </h1>
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.RowListHeader {
  padding-top: 5px;
  font-size: 25px;
  font-weight: bold;
  text-align: center;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

<Pitfall>

就像之前提到过的一样，当操作 `children`时，我们没办法获取到内部组件的渲染输出结果。这就是为什么 [我们更推荐使用替代方案之一](#alternatives)。

</Pitfall>

---

### 将 children 转化为数组 {/*converting-children-to-an-array*/}

通过调用 `Children.toArray(children)` 将 `children` 变为一个常规的 JavaScript 数组。这使得你能够使用 [`filter`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)， [`sort`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)， 或者 [`reverse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse)  等数组内置方法来操作这个数组。

<Sandpack>

```js
import ReversedList from './ReversedList.js';

export default function App() {
  return (
    <ReversedList>
      <p>这是第一项。</p>
      <p>这是第二项。</p>
      <p>这是第三项。</p>
    </ReversedList>
  );
}
```

```js ReversedList.js active
import { Children } from 'react';

export default function ReversedList({ children }) {
  const result = Children.toArray(children);
  result.reverse();
  return result;
}
```

</Sandpack>

<Pitfall>

就像之前提到过的一样，当操作 `children`时，我们没办法获取到内部组件的渲染输出结果。这就是为什么 [我们更推荐使用替代方案之一](#alternatives)。

</Pitfall>

---

## 替代方案 {/*alternatives*/}

<Note>

像下面这样导入的就是（大写字母 `C` 开头的）`Children` API，本章节将会介绍它的一些替代方案：

```js
import { Children } from 'react';
```

不要将它和 (小写字母 `c` 开头的) [`children` 属性](/learn/passing-props-to-a-component#passing-jsx-as-children) 混淆，后者是我们推荐使用的。

</Note>

### 暴露多个组件 {/*exposing-multiple-components*/}

使用 `Children` 方法操作子节点通常会削弱代码的健壮性。在 JSX 中将子节点传递给组件时，通常不希望操作或转换子节点。

如果能够的话，尽量避免使用 `Children` 方法。例如，如果你希望 `RowList` 的每一个子节点都被 `<div className="Row">` 包裹，那么可以导出一个 `Row` 组件，然后像下面这样手动把包裹每一行：

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList>
      <Row>
        <p>这是第一项。</p>
      </Row>
      <Row>
        <p>这是第二项。</p>
      </Row>
      <Row>
        <p>这是第三项。</p>
      </Row>
    </RowList>
  );
}
```

```js RowList.js
export function RowList({ children }) {
  return (
    <div className="RowList">
      {children}
    </div>
  );
}

export function Row({ children }) {
  return (
    <div className="Row">
      {children}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

和使用 `Children.map` 不同，这种方式不会自动包裹每个子节点。但是，和 [上文中关于 `Children.map` 例子](#transforming-children) 相比，这种方式具有明显的优势，因为即使你继续抽离更多的组件，它也仍然有效。

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList>
      <Row>
        <p>这是第一项。</p>
      </Row>
      <MoreRows />
    </RowList>
  );
}

function MoreRows() {
  return (
    <>
      <Row>
        <p>这是第二项。</p>
      </Row>
      <Row>
        <p>这是第三项。</p>
      </Row>
    </>
  );
}
```

```js RowList.js
export function RowList({ children }) {
  return (
    <div className="RowList">
      {children}
    </div>
  );
}

export function Row({ children }) {
  return (
    <div className="Row">
      {children}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

这里使用 `Children.map` 得不到一样的结果，因为它会“认为” `<MoreRows>` 只是一个单独的子节点（并且只占据了一行）。

---

### 接收对象数组作为参数 {/*accepting-an-array-of-objects-as-a-prop*/}

你也可以显示地传递一个数组作为组件的参数。例如，下面的 `RowList` 接收了一个 `rows` 数组作为组件的参数：

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList rows={[
      { id: 'first', content: <p>这是第一项。</p> },
      { id: 'second', content: <p>这是第二项。</p> },
      { id: 'third', content: <p>这是第三项。</p> }
    ]} />
  );
}
```

```js RowList.js
export function RowList({ rows }) {
  return (
    <div className="RowList">
      {rows.map(row => (
        <div className="Row" key={row.id}>
          {row.content}
        </div>
      ))}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

因为 `rows` 是一个常规的 JavaScript 数组，`RowList` 组件可以对其使用 [`map`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/map) 等数组内置方法。

当你希望能够将更多信息作为结构化数据，与子节点一起传递时，这个方案将会非常有用。在下面的示例中，`TabSwitcher` 接收了一个对象数组作为 `tabs` 的属性：

<Sandpack>

```js
import TabSwitcher from './TabSwitcher.js';

export default function App() {
  return (
    <TabSwitcher tabs={[
      {
        id: 'first',
        header: 'First',
        content: <p>这是第一项。</p>
      },
      {
        id: 'second',
        header: 'Second',
        content: <p>这是第二项。</p>
      },
      {
        id: 'third',
        header: 'Third',
        content: <p>这是第三项。</p>
      }
    ]} />
  );
}
```

```js TabSwitcher.js
import { useState } from 'react';

export default function TabSwitcher({ tabs }) {
  const [selectedId, setSelectedId] = useState(tabs[0].id);
  const selectedTab = tabs.find(tab => tab.id === selectedId);
  return (
    <>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setSelectedId(tab.id)}
        >
          {tab.header}
        </button>
      ))}
      <hr />
      <div key={selectedId}>
        <h3>{selectedTab.header}</h3>
        {selectedTab.content}
      </div>
    </>
  );
}
```

</Sandpack>

和将子节点作为 JSX 传递不同，这个方法允许你将一些额外的数据，比如 `header`，与每个子项关联。因为你直接使用 `tabs`，并且它是一个数组，所以你并不需要 `Children` 方法。

---

### 调用渲染属性以自定义渲染 {/*calling-a-render-prop-to-customize-rendering*/}

除了为每一个子项生成 JSX，你还可以传递一个返回值类型是 JSX 的函数，并且在必要的时候调用这个函数。在这个示例中，`App` 组件向 `TabSwitcher` 组件传递了一个 `renderContent` 函数。`TabSwitcher` 组件仅对被选中的 tab 调用 `renderContent`。

<Sandpack>

```js
import TabSwitcher from './TabSwitcher.js';

export default function App() {
  return (
    <TabSwitcher
      tabIds={['first', 'second', 'third']}
      getHeader={tabId => {
        return tabId[0].toUpperCase() + tabId.slice(1);
      }}
      renderContent={tabId => {
        return <p>This is the {tabId} item.</p>;
      }}
    />
  );
}
```

```js TabSwitcher.js
import { useState } from 'react';

export default function TabSwitcher({ tabIds, getHeader, renderContent }) {
  const [selectedId, setSelectedId] = useState(tabIds[0]);
  return (
    <>
      {tabIds.map((tabId) => (
        <button
          key={tabId}
          onClick={() => setSelectedId(tabId)}
        >
          {getHeader(tabId)}
        </button>
      ))}
      <hr />
      <div key={selectedId}>
        <h3>{getHeader(selectedId)}</h3>
        {renderContent(selectedId)}
      </div>
    </>
  );
}
```

</Sandpack>

像 `renderContent` 这样的参数会被称为渲染属性，因为它指定了如何渲染一部分用户交互界面。但是，它也并没有什么特别之处，只是一个普通的属性同时恰好又是一个函数。

渲染属性是函数，所以你可以向它们传递参数。比如，这里的 `RowList` 组件向 `renderRow` 传递了一个 `id` 和每一行的 `index`，该属性用 `index` 来选择偶数行：

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList
      rowIds={['first', 'second', 'third']}
      renderRow={(id, index) => {
        return (
          <Row isHighlighted={index % 2 === 0}>
            <p>This is the {id} item.</p>
          </Row> 
        );
      }}
    />
  );
}
```

```js RowList.js
import { Fragment } from 'react';

export function RowList({ rowIds, renderRow }) {
  return (
    <div className="RowList">
      <h1 className="RowListHeader">
        Total rows: {rowIds.length}
      </h1>
      {rowIds.map((rowId, index) =>
        <Fragment key={rowId}>
          {renderRow(rowId, index)}
        </Fragment>
      )}
    </div>
  );
}

export function Row({ children, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {children}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.RowListHeader {
  padding-top: 5px;
  font-size: 25px;
  font-weight: bold;
  text-align: center;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}

.RowHighlighted {
  background: #ffa;
}
```

</Sandpack>

这是如何在不操纵子组件的情况下，父组件和子组件进行协作的另一个示例。

---

## 错误排查 {/*troubleshooting*/}

### 我传递入了一个自定义组件，但是 `Children` 方法没有显示渲染的内容 {/*i-pass-a-custom-component-but-the-children-methods-dont-show-its-render-result*/}

假设你向 `RowList` 传入了两个子节点，像下面这样：

```js
<RowList>
  <p>第一项</p>
  <MoreRows />
</RowList>
```

如果你在 `RowList` 中执行 `Children.count(children)`，其返回值将为 `2`。即使 `MoreRows` 渲染了 10 个不同的子项，或者返回了 `null`，`Children.count(children)` 的返回值仍然是 `2`。从 `RowList` 的角度上看，它只能感知到它直接接收到的 JSX，并不能感知到 `MoreRows` 组件的内部。

这导致抽离一个组件变得较为困难，这也是为什么我们更推荐使用 [替代方案](#alternatives) 而不是使用 `Children`。
