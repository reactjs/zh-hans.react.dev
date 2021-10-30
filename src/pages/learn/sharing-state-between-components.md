---
title: 在组件间共享状态
---

<Intro>

有时候，你希望两个组件的状态始终同步更改。要实现这一点，可以将相关状态从这两个组件上移除，并把状态放到它们的公共父级，再通过 props 将状态传递给这两个组件。这被称为“状态提升”，这是编写 React 代码时常做的事。

</Intro>

<YouWillLearn>

- 如何使用状态提升在组件之间共享状态
- 什么是受控组件和非受控组件

</YouWillLearn>

## 举例说明一下状态提升 {#lifting-state-up-by-example}

这个例子中有 2 个组件。

父组件 `Accordion` 渲染了 2 个独立的 `Panel` 组件。每个 `Panel` 组件都有一个布尔值 `isActive`，用于控制其内容是否可见。

请点击 2 个面板中的显示按钮：

<Sandpack>

```js
import { useState } from 'react';

function Panel({ title, children }) {
  const [isActive, setIsActive] = useState(false);
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={() => setIsActive(true)}>
          显示
        </button>
      )}
    </section>
  );
}

export default function Accordion() {
  return (
    <>
      <Panel title="Ingredients">
        牛奶、茶包和一根肉桂棒。
      </Panel>
      <Panel title="Recipe">
        把牛奶加热，然后把茶包放进锅里。 
        最后加入肉桂棒。
      </Panel>
    </>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

我们发现点击其中一个面板中的按钮并不会影响另外一个——他们是独立的。

**假设现在你想改变这种行为，保证同一时间只展开 1 个面板。** 基于这种设计，展开第 2 个面板时应该折叠第 1 个面板。你想怎么实现呢？

要协调好这两个面板，我们需要分 3 步将状态“提升”到他们的父组件中。

<img alt="左侧是两个独立的组件，每个组件都有自己的状态值。右侧是一个包含两个子组件的父组件，它同时拥有两个子组件的状态值。" src="/images/docs/sketches/s_lifting-state-up.png" />

### 第 1 步: 从子组件中移除状态 {#remove-state-from-the-child-components}

你将把 `Panel` 组件对 `isActive` 的控制权交给他们的父组件。然后再把这个状态通过 `props` 传给子组件。我们先从 `Panel` 组件中 **删除这一行**：

```js
const [isActive, setIsActive] = useState(false);
```

And instead, add `isActive` to the `Panel`'s list of props:

```js
function Panel({ title, children, isActive }) {
```

现在，`Panel` 的父组件就可以通过 [向下传递 prop](/learn/passing-props-to-a-component) 来 *控制* `isActive`。这样就反过来了，`Panel` 组件对 `isActive` 的值 *没有控制权* ——现在完全由父组件决定！

### 第 2 步: 从公共父级传递硬编码数据 {#pass-hardcoded-data-from-the-common-parent}

为了实现状态提升，必须找到 *两个* 子组件最近的公共父组件：

* `Accordion` *(最近的公共父组件)*
  - `Panel`
  - `Panel`

在这个例子中，公共父组件是 `Accordion`。因为它位于两个面板之上，可以控制它们的 props，所以它将成为当前激活的面板的“真相之源”。通过 `Accordion` 组件将硬编码值 `isActive`（例如 `true` ）传递给两个面板：

<Sandpack>

```js
import { useState } from 'react';

export default function Accordion() {
  return (
    <>
      <Panel title="Ingredients" isActive={true}>
        牛奶、茶包和一根肉桂棒。
      </Panel>
      <Panel title="Recipe" isActive={true}>
        把牛奶加热，然后把茶包放进锅里。 
        最后加入肉桂棒。
      </Panel>
    </>
  );
}

function Panel({ title, children, isActive }) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={() => setIsActive(true)}>
          显示
        </button>
      )}
    </section>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

尝试修改 `Accordion` 组件中 `isActive` 的值，并在屏幕上查看结果。

### 第 3 步: 为公共父组件添加状态 {#add-state-to-the-common-parent}

状态提升通常会改变原状态的数据存储类型。在这个例子中，一次只能激活一个面板。这意味着 `Accordion` 这个父组件需要追踪 *哪个* 面板是活动面板。我们可以用个数字来代表当前活动的 `Panel` 的索引，而不是 `boolean` 值：

```js
const [activeIndex, setActiveIndex] = useState(0);
```

当 `activeIndex` 为 `0` 时，激活第一个面板，为 `1` 时，激活第二个面板。

单击 `Panel` 中的“显示”按钮需要更改 `Accordion` 中的活动索引。 `Panel` 中无法直接设置`activeIndex` 的值，因为它是在 `Accordion` 组件中定义的。 `Accordion` 组件需要 *明确地允许* `Panel` 组件通过 [将事件处理程序作为 prop 向下传递](/learn/responding-to-events#passing-event-handlers-as-props) 来更改其状态：

```js
<Panel
  isActive={activeIndex === 0}
  onShow={() => setActiveIndex(0)}
>
  ...
</Panel>
<Panel
  isActive={activeIndex === 1}
  onShow={() => setActiveIndex(1)}
>
  ...
</Panel>
```

现在 `Panel` 组件中的 `<button>` 将使用 `onShow` 这个属性作为其点击事件的处理程序：

<Sandpack>

```js
import { useState } from 'react';

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <Panel
        title="Ingredients"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        牛奶、茶包和一根肉桂棒。
      </Panel>
      <Panel
        title="Recipe"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        把牛奶加热，然后把茶包放进锅里。 
        最后加入肉桂棒。
      </Panel>
    </>
  );
}

function Panel({
  title,
  children,
  isActive,
  onShow
}) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={onShow}>
          显示
        </button>
      )}
    </section>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

这样，我们就完成了对状态的提升！把状态移到公共父组件中可以让你更好的管理这两个面板。使用活动索引代替之前的 `是否显示` 标识确保了一次只能激活一个面板。而通过向下传递事件处理函数可以让子组件修改父组件中的状态。

<DeepDive title="受控组件和非受控组件">

通常我们把包含“不受控制”的状态的组件称为“非受控组件”。例如，原本带有 `isActive` 状态变量的 `Panel` 组件是不受控制的，因为其父组件无法改变面板的激活状态。

相反，当组件中的重要信息是由 props 而不是其自身状态驱动时，就可以认为该组件是“受控组件”。这就允许父组件完全指定其行为。最后带有 `isActive` 属性的 `Panel` 组件是由 `Accordion` 组件控制的。

非受控组件通常很简单，因为它们不需要太多配置。但是当你想把它们组合在一起使用时，就不那么灵活了。受控组件具有最大的灵活性，但它们需要父组件使用 props 对其进行配置。

事实上，“受控”和“非受控”并不是严格的技术术语——通常每个组件都同时拥有内部状态和 props。然而，这是讨论组件如何设计以及提供什么功能的一种有用方式。

当编写一个组件时，你应该考虑哪些信息应该受控制（通过 props），哪些信息不应该受控制（通过 state）。不过你后面可以随时更改并重构。

</DeepDive>

<img alt="父组件传递状态设置函数给两个子组件" src="/images/docs/sketches/s_passing-functions-down.png" />

## 每个状态都对应唯一的数据源 {#a-single-source-of-truth-for-each-state}

在 React 应用中，很多组件都有自己的状态。一些状态可能“活跃”在叶子组件（如输入框）附近。其它状态可能在应用程序顶部附近“活动”。例如，路由器通常也是通过将当前路由存储在 React 状态中并通过 props 将其传递下去来实现的！

**每个唯一的状态，都“拥有”它对应的组件**。这一原则也被称为拥有“可信单一数据源”。它并不意味着所有状态都活跃在一个地方——但对每个状态来说，都有一个特定的组成部分来保存这些信息。与复制组件之间的共享状态不同，你需要 *将其提升* 到其公共父级，并 *将其传递* 到需要它的子级。

你的应用状态会随着操作而改变。通常，当你在处理每个状态的“活跃”位置时，会进行移除或备份操作。这是整个过程的一部分！

<Recap>

* 当你想要整合两个组件时，将它们的状态移动到共同的父组件中。
* 然后在父组件中通过 props 把信息传递下去。
* 最后，向下传递事件处理程序，以便子组件可以改变父组件的状态。
* 将组件视为“受控”（由属性驱动）或“不受控”（由状态驱动）是很有用的。

</Recap>



<Challenges>

### 同步输入状态 {#synced-inputs}

现在有两个独立的输入框。为了让它们的状态保持同步：编辑一个输入框时应使用相同的文本更新另一个输入框，反之亦然。你需要将它们的状态提升到父组件中。

<Sandpack>

```js
import { useState } from 'react';

export default function SyncedInputs() {
  return (
    <>
      <Input label="第一个输入框" />
      <Input label="第二个输入框" />
    </>
  );
}

function Input({ label }) {
  const [text, setText] = useState('');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <label>
      {label}
      {' '}
      <input
        value={text}
        onChange={handleChange}
      />
    </label>
  );
}
```

```css
input { margin: 5px; }
label { display: block; }
```

</Sandpack>

<Solution>

将 `text` 状态变量与 `handleChange` 处理程序一起移动到父组件中。然后将它们作为props 传递给两个 `Input` 组件。这样它们就能保持同步了。

<Sandpack>

```js
import { useState } from 'react';

export default function SyncedInputs() {
  const [text, setText] = useState('');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      <Input
        label="第一个输入框"
        value={text}
        onChange={handleChange}
      />
      <Input
        label="第二个输入框"
        value={text}
        onChange={handleChange}
      />
    </>
  );
}

function Input({ label, value, onChange }) {
  return (
    <label>
      {label}
      {' '}
      <input
        value={value}
        onChange={onChange}
      />
    </label>
  );
}
```

```css
input { margin: 5px; }
label { display: block; }
```

</Sandpack>

</Solution>

### 列表过滤 {#filtering-a-list}

在这个例子中，`SearchBar` 组件拥有一个用来控制输入框的 `query` 状态，它的父组件中展示了一个 `List` 组件，但是没有考虑搜索条件。

使用 `filterItems(foods, query)` 方法来通过搜索条件过滤列表项。为了测试你的修改，请在输入框中输入 “寿” 来验证是否能过滤出 “寿司”。

可以看到 `filterItems` 已经自动引入了，所以不需要我们自己再引入了。

<Hint>

你需要从 `SearchBar` 组件中移除 `query` 状态和 `handleChange` 处理程序，并把它们移到 `FilterableList` 组件中。然后将 `query` 和 `onChange` 当做 props 向下传递给 `SearchBar` 组件。

</Hint>

<Sandpack>

```js
import { useState } from 'react';
import { foods, filterItems } from './data.js';

export default function FilterableList() {
  return (
    <>
      <SearchBar />
      <hr />
      <List items={foods} />
    </>
  );
}

function SearchBar() {
  const [query, setQuery] = useState('');

  function handleChange(e) {
    setQuery(e.target.value);
  }

  return (
    <label>
      搜索：{' '}
      <input
        value={query}
        onChange={handleChange}
      />
    </label>
  );
}

function List({ items }) {
  return (
    <table> 
      {items.map(food => (
        <tr key={food.id}>
          <td>{food.name}</td>
          <td>{food.description}</td>
        </tr>
      ))}
    </table>
  );
}
```

```js data.js
export function filterItems(items, query) {
  query = query.toLowerCase();
  return items.filter(item =>
    item.name.split(' ').some(word =>
      word.toLowerCase().startsWith(query)
    )
  );
}

export const foods = [{
  id: 0,
  name: '寿司',
  description: '寿司是一道传统的日本菜，是用醋米饭做成的'
}, {
  id: 1,
  name: '木豆',
  description: '制作木豆最常见的方法是在汤中加入洋葱、西红柿和各种香料'
}, {
  id: 2,
  name: '饺子',
  description: '饺子是用未发酵的面团包裹咸的或甜的馅料，然后在沸水中煮制而成的'
}, {
  id: 3,
  name: '烤肉串',
  description: '烤肉串是一种很受欢迎的食物，是用肉串和肉块做成。'
}, {
  id: 4,
  name: '点心',
  description: '点心是广东人的传统喜好，是在餐馆吃早餐和午餐时喜欢吃的一系列小菜'
}];
```

</Sandpack>

<Solution>

将 `query` 状态提升到 `FilterableList` 组件中。调用 `filterItems(foods, query)` 方法获取过滤后的列表并将其传递给 `List` 组件。现在修改查询条件就会反映在列表中：

<Sandpack>

```js
import { useState } from 'react';
import { foods, filterItems } from './data.js';

export default function FilterableList() {
  const [query, setQuery] = useState('');
  const results = filterItems(foods, query);

  function handleChange(e) {
    setQuery(e.target.value);
  }

  return (
    <>
      <SearchBar
        query={query}
        onChange={handleChange}
      />
      <hr />
      <List items={results} />
    </>
  );
}

function SearchBar({ query, onChange }) {
  return (
    <label>
      搜索：{' '}
      <input
        value={query}
        onChange={onChange}
      />
    </label>
  );
}

function List({ items }) {
  return (
    <table> 
      {items.map(food => (
        <tr key={food.id}>
          <td>{food.name}</td>
          <td>{food.description}</td>
        </tr>
      ))}
    </table>
  );
}
```

```js data.js
export function filterItems(items, query) {
  query = query.toLowerCase();
  return items.filter(item =>
    item.name.split(' ').some(word =>
      word.toLowerCase().startsWith(query)
    )
  );
}

export const foods = [{
  id: 0,
  name: '寿司',
  description: '寿司是一道传统的日本菜，是用醋米饭做成的'
}, {
  id: 1,
  name: '木豆',
  description: '制作木豆最常见的方法是在汤中加入洋葱、西红柿和各种香料'
}, {
  id: 2,
  name: '饺子',
  description: '饺子是用未发酵的面团包裹咸的或甜的馅料，然后在沸水中煮制而成的'
}, {
  id: 3,
  name: '烤肉串',
  description: '烤肉串是一种很受欢迎的食物，是用肉串和肉块做成。'
}, {
  id: 4,
  name: '点心',
  description: '点心是广东人的传统喜好，是在餐馆吃早餐和午餐时喜欢吃的一系列小菜'
}];
```

</Sandpack>

</Solution>

</Challenges>