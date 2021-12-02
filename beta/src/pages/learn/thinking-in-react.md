---
title: 在 React 中思考
translators:
  - HerbertHe
---

<Intro>

React 可以改变你对设计和构建应用的思考。曾经你看到的可能是森林, 在与 React 工作为伴之后, 你将更享受每一颗独立的树。React 使对于设计系统和 UI 状态的思考更加容易。在本篇教程中, 我们将带你感悟使用 React 进行构建可搜索产品数据表格的心路历程。

</Intro>

## 使用模型开始 {/*start-with-the-mockup*/}

想象一下, 你早已从设计者那儿获取了一个 JSON API 和 模型。

JSON API 返回如下面所示的一些数据:

```json
[
  { category: "Fruits", price: "$1", stocked: true, name: "Apple" },
  { category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit" },
  { category: "Fruits", price: "$2", stocked: false, name: "Passionfruit" },
  { category: "Vegetables", price: "$2", stocked: true, name: "Spinach" },
  { category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin" },
  { category: "Vegetables", price: "$1", stocked: true, name: "Peas" }
]
```

模型看起来如这样:

<img src="/images/docs/s_thinking-in-react_ui.png" width="300" style={{margin: '0 auto'}} />

在 React 中实现 UI, 你仅需跟随下面的五步。

## 步骤一: 将 UI 分解为组件层级结构 {/*step-1-break-the-ui-into-a-component-hierarchy*/}

开始, 绘制模型中每个组件和子组件周围的盒子并且命名它们。如果你与设计师一起工作, 他们可能早已在其设计工具中命名了这些组件。检查一下它们!

依赖于你的背景, 你可以考虑通过不同的方式将设计分割为组件:

* **程序设计**--使用同样的技术决定你是否应该创建一个新的函数或者对象。这一技术即 [单一功能原理](https://en.wikipedia.org/wiki/Single_responsibility_principle), 也就是说， 一个组件理想地仅做一件事情。如果功能持续增长, 它应该被分解为更小的子组件。
* **CSS**--考虑你将把类选择器用于何处。(然而, 组件并没有那么细的粒度。)
* **设计**--考虑你将如何组织布局的层级。

如果你的 JSON 结构非常棒, 将经常发现映射到 UI 中的组件结构是一件自然而然的事情。那是因为 UI 和数据模型常拥有相同的信息结构--即, 相同的形状。将你的 UI 分割到组件, 每个组件匹配到你数据模型的每个部分。

在屏幕中展示了五个组件:

<FullWidth>

<CodeDiagram flip>

<img src="/images/docs/s_thinking-in-react_ui_outline.png" width="500" style={{margin: '0 auto'}} />

1. `FilterableProductTable (可过滤产品表)` (灰色) 包含完整的应用。
2. `SearchBar (搜索条)` (蓝色) 获取用户输入。
3. `ProductTable (产品表)` (淡紫色) 根据用户输入, 展示和过滤清单。
4. `ProductCategoryRow (产品类别行)` (绿色) 展示每个类别的表头。
5. `ProductRow (产品行)` (黄色) 展示每个产品的行。

</CodeDiagram>

</FullWidth>

如果你看向 `ProductTable (产品表)`, 你将看到表头 (包含 "Name" 和 "Price" 标签) 并不是它自己的组件。这是偏好的问题, 你可以采取任何一种方式继续。在这个例子中, 它是 `ProductTable` 的一部分, 因为它展现在 `ProductTable` 清单之中。然而, 如果这个表头变得复杂 (举个例子, 如果你添加排序), 创建它自己的 `ProductTableHeader` 组件就变得有意义了。

现在你已经在模型中辨别了组件, 将它们变为层级结构。在模型中, 组件可以展示在其它组件之中, 在层级结构中即展示如其孩子一般:

* `FilterableProductTable (可过滤产品表)`
    * `SearchBar (搜索条)`
    * `ProductTable (产品表)`
        * `ProductCategoryRow (产品类别行)`
        * `ProductRow (产品行)`

## 步骤二: 在 React 中构建一个静态版本 {/*step-2-build-a-static-version-in-react*/}

现在你已经拥有了你自己的组件层级结构, 是时候实现你的应用程序了。最直接的办法是根据你的数据模型, 去构建一个不带任何交互的 UI 渲染代码版本... 然而! 经常是首先构建一个静态版本, 然后再带添加交互。构建一个静态版本需要写大量的代码, 不需要什么思考; 但添加交互需要大量的思考, 却不需要大量的代码。

构建你应用程序的静态版本渲染你的数据模型, 你将会构建 [组件](/learn/your-first-component) 并复用其它的组件, 接着使用 [props](/learn/passing-props-to-a-component) 传递数据。Props 是从父组件向子组件传递数据的一种方式。(如果你对 [状态(state)](/learn/state-a-components-memory) 章节很熟悉, 不要在静态版本中全部使用状态(state)进行构建。状态只是为交互提供的保留功能, 即数据会随着时间变化。因为这是一个静态应用程序, 所以不需要这个。)

你既可以通过从层次结构更高层组件 (如 `FilterableProductTable`) 开始 “自上而下” 构建, 也可以通过从更低层级组件 (如 `ProductRow`) “自下而上” 进行构建。在简单的例子中, 自上而下构建通常更简单; 在大型项目中, 自下而上构建更简单。

<Sandpack>

```jsx App.js
function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar() {
  return (
    <form>
      <input type="text" placeholder="Search..." />
      <label>
        <input type="checkbox" />
        {' '}
        Only show products in stock
      </label>
    </form>
  );
}

function FilterableProductTable({ products }) {
  return (
    <div>
      <SearchBar />
      <ProductTable products={products} />
    </div>
  );
}

const PRODUCTS = [
  {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
  {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
  {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding-top: 10px;
}
td {
  padding: 2px;
  padding-right: 40px;
}
```

</Sandpack>

**如果示例看起来很吓人, 不要感到烦躁!** 在本篇导读中, 我们将更关注于概念而非代码。确认收藏 [描述 UI](/learn/describing-the-ui)将会帮助你填补短板、理解代码。

在构建你的组件之后, 即拥有一个渲染数据模型的可复用组件库。因为这是一个静态应用程序, 组件仅返回 JSX。最顶层级的组件 (`FilterableProductTable`) 将接收你的数据模型, 并作为其 prop。这被称之为 _单向数据流_, 因为数据从树的顶端组件传递到下面的组件。

<Gotcha>

在这部分中, 你不需要使用任何状态(state)数值, 这是下一步的内容。

</Gotcha>

## 步骤三: 发现 UI 精简且完整的状态 (state) 表示 {/*step-3-find-the-minimal-but-complete-representation-of-ui-state*/}

使 UI 可交互, 你需要用户更改你潜在的数据结构。你将使用 *状态(state)* 进行实现。

将状态(state)作为你应用程序需要记住图改变数据的最小集合。组织状态(state)最重要的一条原则使保持它 [DRY(不要重复自己)](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)。计算出你应用程序需要的绝对精简的状态(state)表示, 按需计算其它一切。举个例子, 如果你正在构建一个购物清单, 你可将他们在状态(state)中存储为数组。如果你同时想展示清单中物品数量, 不需要将其另存为一个状态值(state value)。取而代之, 可以通过读取你数组的长度实现。

现在考虑示例应用程序中每一条数据:

1. 产品原始清单
2. 搜索用户键入的文本
3. 复选框的值
4. 过滤后的产品清单

其中那些是状态(state)呢? 标记那些不是的:

* 随着时间推移 **保持不变**? 如此, 便不是状态(state)。
* 通过属性(props) **从父组件传递**? 如此, 便不是状态(state)。
* 是否可以基于已存在于组件中的状态(state) 或者 属性(props) **进行计算**? 如此, 它*肯定*不是状态(state)!

剩下的可能是状态(state)。

让我们再次一条条验证它们:

1. 原始列表中的产品**作为属性传递, 所以它不是状态**。
2. 搜索文本随着时间推移保持不变, 似乎是状态, 并不能被计算。
3. 复选框的值随着时间推移保持不变, 似乎是状态, 并不能被计算。
4. 过滤后列表中的产品**不是状态, 因为可以通过被原始列表中的产品, 根据搜索框文本和复选框的值进行计算**。

这就意味着只有搜索文本和复选框的值是状态! 非常好!

<DeepDive title="Props vs State">

在 React 中有两种 "模型" 数据: 属性(props) 和 状态(state)。这是它们的不同之处:

* [**属性(Props)** 像是你传递的参数](/learn/passing-props-to-a-component) 至函数。它们使父组件传递数据给子组件, 定制它们的展示。举个例子, `Form` 可以传递 `color` 属性至 `Button`。
* [**状态(State)** 像是组件的内存。](/learn/state-a-components-memory) 它使组件对一些信息保持追踪, 并且根据交互改变。举个例子, `Button` 可以保持对 `isHovered` 状态的追踪。

属性和状态是不同的, 但是它们共同工作。父组件将经常在状态中保持一些信息 (以便它可以改变), 并且作为子组件的属性*向下*传递至它的子组件。如果第一次了解这其中的差别感到迷糊, 也没关系。大量练习即可牢牢记住!

</DeepDive>

## 步骤四: 验证状态应该被放置于哪里 {/*step-4-identify-where-your-state-should-live*/}

在验证你应用程序中的最小状态数据之后, 你需要验证哪个组件是通过改变状态可响应的, 或者*拥有*这个状态。记住: React 使用单向数据流, 通过组件层级结构从父组件传递数据至子组件。这可能不能立马知晓哪个组件拥有什么状态。如果你是第一次阅读此章节可能感到有挑战性, 但你可以通过下面的步骤搞定它!

在你应用程序中的每一块状态:

1. 验证*每一个*基于特定状态渲染的组件。
2. 寻找它们最近并且共同的父组件——在层级结构中, 一个凌驾于它们所有组件之上的组件。
3. 决定状态应该被放置于哪里:
    1. 通常情况下, 你可以直接放置状态于它们共同的父组件。、
    2. 你也可以将状态放置于它们父组件上层的组件。
    3. 如果你找不到一个有意义拥有这个状态的地方, 单独创建一个新的组件去管理这个状态, 并将它添加到它们父组件上层的某个地方。

在之前的步骤中, 你已在应用程序中创建了两块状态: 输入框文本和复选框的值。在这个例子中, 它们总一起展示, 将它们视为一个状态非常简单。

现在为这个状态贯彻我们的策略:

1. **验证组件使用状态:**
    * `ProductTable` 需要基于 状态(搜索文本和复选框值) 过滤产品列表。
    * `SearchBar` 需要展示状态(搜索文本和复选框值)。
2. **寻找它们的父组件:** 它们的第一个共同父组件为 `FilterableProductTable`.
3. **决定状态放置的地方:** 我们将保持过滤文本和勾选状态值于 `FilterableProductTable`.

所以状态将被放置在 `FilterableProductTable`。

通过 [`useState()` 钩子](/reference/usestate) 为组件添加状态。钩子使你 "勾入" 组件的 [渲染周期](/learn/render-and-commit)。在 `FilterableProductTable` 上面添加两个状态变量, 并在你的应用程序中指定初始值:

```js
function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
```

然后, 将 `filterText` 和 `inStockOnly` 作为属性传递至 `ProductTable` 和 `SearchBar`:

```js
<div>
  <SearchBar
    filterText={filterText}
    inStockOnly={inStockOnly} />
  <ProductTable
    products={products}
    filterText={filterText}
    inStockOnly={inStockOnly} />
</div>
```

你可以看见你的应用程序如何反应。在下面的沙盒代码, 通过修改`useState('')` 为 `useState('fruit')` 以编辑 `filterText` 的初始值, 你将会看到搜索输入值和表格更新:

<Sandpack>

```jsx App.js
import { useState } from 'react';

function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar
        filterText={filterText}
        inStockOnly={inStockOnly} />
      <ProductTable
        products={products}
        filterText={filterText}
        inStockOnly={inStockOnly} />
    </div>
  );
}

function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products, filterText, inStockOnly }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (
      product.name.toLowerCase().indexOf(
        filterText.toLowerCase()
      ) === -1
    ) {
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({ filterText, inStockOnly }) {
  return (
    <form>
      <input
        type="text"
        value={filterText}
        placeholder="Search..."/>
      <label>
        <input
          type="checkbox"
          checked={inStockOnly} />
        {' '}
        Only show products in stock
      </label>
    </form>
  );
}

const PRODUCTS = [
  {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
  {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
  {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding-top: 5px;
}
td {
  padding: 2px;
}
```

</Sandpack>

在上面的沙盒中, `ProductTable` 和 `SearchBar` 读取 `filterText` 和 `inStockOnly` 属性以渲染表格, 输入, 复选框。
举个例子, 这里展示了 `SearchBar` 如何填充输入的值:

```js {1,6}
function SearchBar({ filterText, inStockOnly }) {
  return (
    <form>
      <input
        type="text"
        value={filterText}
        placeholder="Search..."/>
```


参照 [管理状态](/learn/managing-state) 去深度了解 React 如何使用状态, 你又如何在你的应用程序中组织。

## 步骤五: 添加反向数据流 {/*step-5-add-inverse-data-flow*/}

目前你的应用程序可以带着属性和状态, 随着层级结构正确渲染了! 但是根据用户的输入改变状态, 你需要通过其它的方式指出数据流: 深层结构的表单组件需要在 `FilterableProductTable` 中更新状态。

React 使数据流显示展示, 但是与双向数据绑定相比, 它需要更多的输入。如果你尝试在上述的例子中输入或者勾选输入框, 你会发现 React 忽视了你的输入。这点是有意为之的。通过 `<input value={filterText} />`, 你已经设置了 `input` 的 `value` 属性, 并使之恒等于从 `FilterableProductTable` 传递的 `filterText` 状态。只要 `filterText` 状态不设置, 输入的值就不会改变。

当用户更改表单输入时，状态将更新以反映这些更改。状态由 `FilterableProductTable` 所拥有, 所以只有它可以被称为 `setFilterText` 和 `setInStockOnly`。使 `SearchBar` 更新 `FilterableProductTable` 的状态, 你需要将这些函数传递到 `SearchBar`:


```js {2,3,10,11}
function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar
        filterText={filterText}
        inStockOnly={inStockOnly}
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly} />
```

在 `SearchBar` 中, 你将添加一个 `onChange` 事件处理器, 并且使用其设置父组件的状态:

```js {5}
<input
  type="text"
  value={filterText}
  placeholder="Search..."
  onChange={(e) => onFilterTextChange(e.target.value)} />
```

现在应用程序可以完整工作了!

<Sandpack>

```jsx App.js
import { useState } from 'react';

function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar
        filterText={filterText}
        inStockOnly={inStockOnly}
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly} />
      <ProductTable
        products={products}
        filterText={filterText}
        inStockOnly={inStockOnly} />
    </div>
  );
}

function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products, filterText, inStockOnly }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (
      product.name.toLowerCase().indexOf(
        filterText.toLowerCase()
      ) === -1
    ) {
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({
  filterText,
  inStockOnly,
  onFilterTextChange,
  onInStockOnlyChange
}) {
  return (
    <form>
      <input
        type="text"
        value={filterText} placeholder="Search..."
        onChange={(e) => onFilterTextChange(e.target.value)} />
      <label>
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => onInStockOnlyChange(e.target.checked)} />
        {' '}
        只展示库存中的商品
      </label>
    </form>
  );
}

const PRODUCTS = [
  {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
  {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
  {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding: 4px;
}
td {
  padding: 2px;
}
```

</Sandpack>

你可以在 [添加交互](/learn/adding-interactivity) 这一章节, 学习到所有处理时间和更新状态的内容。

## 自此之后, 该往何处 {/*where-to-go-from-here*/}

这所述的仅是一个简介, 旨在告诉你使用 React 如何进行思考构建组件和应用程序。你可以即刻 [开始一个 React 项目](/learn/installation), 或者 [深潜于所有的语法](/learn/describing-the-ui), 那些在教程中使用到的。
