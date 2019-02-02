---
id: thinking-in-react
title: React 哲学
permalink: docs/thinking-in-react.html
redirect_from:
  - 'blog/2013/11/05/thinking-in-react.html'
  - 'docs/thinking-in-react-zh-CN.html'
prev: composition-vs-inheritance.html
---

我们认为，React 是用 JavaScript 构建快速响应的大型 Web 应用程序的首选方式。它在 Facebook 和 Instagram 上表现优秀。

React 最棒的部分之一是引导我们思考如何构建一个应用。在这篇文档中，我们将会通过 React 构建一个可搜索的产品数据表格来更深刻地领会 React 哲学。

## 从原型图开始

假设我们已经有了一个返回 JSON 的 API，以及设计师提供的组件原型图。如下所示：

![Mockup](../images/blog/thinking-in-react-mock.png)

该 JSON API 会返回以下数据：

```
[
  {category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football"},
  {category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball"},
  {category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball"},
  {category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch"},
  {category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5"},
  {category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7"}
];
```

## 第一步：将设计好的 UI 划分为组件层级

首先，你需要在原型图上用方框圈出每一个组件（包括它们的子组件），并且以合适的名称命名。如果你是和设计师一起完成此任务，他们可能已经通过方框划分过组件层级，所以请预先和他们交谈以达成共识！这样他们最终命名出来的 Photoshop 图层名称，可能无须额外改动，直接就是你编写的 React 组件的名称！

但你如何确定应该将哪些部分划分到一个组件中呢？你可以将组件当作一种函数或者是对象来考虑，根据[单一功能原则](https://zh.wikipedia.org/wiki/%E5%8D%95%E4%B8%80%E5%8A%9F%E8%83%BD%E5%8E%9F%E5%88%99)来判定组件的范围。也就是说，一个组件原则上只能负责一个功能。如果它需要负责更多的功能，这时候就应该考虑将它拆分成更小的组件。

在实践中，因为你经常是在向用户展示 JSON 数据模型，所以如果你的模型设计得恰当，UI（或者说组件结构）便会与数据模型一一对应，这是因为 UI 和数据模型都会倾向于遵守相同的*信息结构*。因此，将用户界面划分为组件的工作量就可以忽略不计了。只需使组件完全对应地展现数据模型的某部分即可。

![Component diagram](../images/blog/thinking-in-react-components.png)

我们的简单应用中包含五个组件。我们已经将每个组件展示的数据标注为了斜体。

  1. **`FilterableProductTable` (橙色):** 是整个示例应用的整体
  2. **`SearchBar` (蓝色):** 接受所有的*用户输入*
  3. **`ProductTable` (绿色):** 展示*数据内容*并根据*用户输入*筛选结果
  4. **`ProductCategoryRow` (天蓝色):** 为每一个*产品类别*展示标题
  5. **`ProductRow` (红色):** 每一行展示一个*产品*

你可能注意到，`ProductTable` 的表头（包含 "Name" 和 "Price" 的那一部分）并未单独成为一个组件。这仅仅是一种偏好选择，如何处理这一问题也一直存在争论。就这个示例而言，因为表头只起到了渲染*数据集合*的作用——这与 `ProductTable` 是一致的，所以我们仍然将其作为 `ProductTable` 的一部分。但是，如果表头过于复杂（比如我们需为其添加排序功能），那么将它作为一个独立的 `ProductTableHeader` 组件就很有必要了。

现在我们已经确定了原型图中应该包含的组件，接下来我们将把它们描述为更加清晰的层级。原型图中被其他组件包含的子组件应该在层级上作为其子节点。

  * `FilterableProductTable`
    * `SearchBar`
    * `ProductTable`
      * `ProductCategoryRow`
      * `ProductRow`

## 第二步：用 React 创建一个静态版本

<p data-height="600" data-theme-id="0" data-slug-hash="BwWzwm" data-default-tab="js" data-user="lacker" data-embed-version="2" class="codepen">参阅 <a href="http://codepen.io">CodePen</a> 上的 <a href="https://codepen.io/gaearon/pen/BwWzwm">React 哲学：第二步</a>。</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

现在我们已经确定了组件层级，可以着手编写对应的应用了。此时，最简单的办法是先用已有的数据模型创建一个不包含交互功能的 UI。编写一个应用的静态版本时，往往要进行大量输入，而不需要考虑太多；添加交互功能时，考虑的问题更多，却不怎么需要输入。所以，将这两个过程分开进行更为合适。你慢慢会体会到其中的原因。

在构建应用的静态版本时，一个组件往往会重用其他更小的组件，并通过 *props* 传递所需的数据。*props* 是父组件向子组件传递数据的方式。即使你已经熟悉了 *state* 的概念，也**完全不应该使用 state** 构建静态版本。State 代表了随时间会产生变化的数据，应当仅在实现交互时使用。所以构建应用的静态版本时，你不会用到它。

你可以自上而下或者自下而上构建应用：自上而下意味着首先编写层级较高的组件（例如 `FilterableProductTable`），自下而上意味着从最基本的组件开始编写（比如示例中的 `ProductRow`）。当你的应用比较简单时，使用自上而下的方式更方便；对于较为庞大的项目来说，自下而上地构建，并同时为低层组件编写测试是更加简单的方式。

到此为止，你应该已经有了一个可重用的组件库来渲染你的数据模型。由于我们构建的是静态版本，这些组件应该只有唯一的一个 `render()` 方法。最顶层的组件 `FilterableProductTable` 通过 props 接受你的数据模型。一旦你的数据模型发生了改变，`ReactDOM.render()` 就会被调用，从而更新 UI。所幸这个组件并不复杂，所以很容易修改，也很容易看到 UI 的具体改变。React **单向数据流**（也叫*单向绑定*）的思想使得组件模块化，易于快速开发。

如果你在完成这一步骤时遇到了困难，可以参阅 [React 文档](/docs/)。

### 补充说明: 有关 props 和 state

在 React 中，有两种“模型”数据：props 和 state。清楚地理解两者的区别是十分重要的；如果你不太有把握，可以参阅 [React 官方文档](/docs/interactivity-and-dynamic-uis.html)。

## 第三步：确定 UI state 的最小（且完整）集合表示

为了使你的 UI 具有交互功能，你需要及时地触发底层数据模型的改变。React 通过 **state** 来完成这个任务。

为了正确地构建应用，你首先需要考虑应用所需的最小的可变 state 集合表示。其中的关键正是 [DRY: *Don't Repeat Yourself*](https://zh.wikipedia.org/wiki/%E4%B8%80%E6%AC%A1%E4%B8%94%E4%BB%85%E4%B8%80%E6%AC%A1)。只保留应用需要的最小的 state 集合表示，其他数据均由它们计算产生。比如，你要编写一个任务清单应用，你只需要保存一个包含所有事项的数组，而不需要额外保存数组的长度（任务个数）。当你需要展示任务个数时，只需要利用该数组的 length 属性即可。

我们的示例应用拥有如下数据：

  * 包含所有产品的原始列表
  * 用户输入的搜索词
  * 复选框是否选中的值
  * 经过搜索筛选的产品列表

通过问自己以下几个问题，你可以逐个检查以上数据是否应该属于 state。

  1. 该数据是否是由父组件通过 props 传递而来的？如果是，那它应该不是 state。
  2. 该数据是否随时间完全不发生改变？如果是，那它应该也不是 state。
  3. 你能否根据其他 state 或 props 计算出该数据的值？如果是，那它也不是 state。

包含所有产品的原始列表是经由 props 传递到该组件的，所以它不是 state；搜索词和复选框的值应该是 state，因为它们随时间会发生改变且无法由其他数据计算而来；经过搜索筛选的产品列表不是 state，因为他的结果可以由产品的原始列表根据搜索词和复选框的选择而计算出来。

综上所述，属于 state 的有：

  * 用户输入的搜索词
  * 复选框是否选中的值

## 第四步：确定 state 放置的位置

<p data-height="600" data-theme-id="0" data-slug-hash="qPrNQZ" data-default-tab="js" data-user="lacker" data-embed-version="2" class="codepen">参阅 <a href="http://codepen.io">CodePen</a> 上的 <a href="https://codepen.io/gaearon/pen/qPrNQZ">React 哲学：第四步</a>。</p>

我们已经确定了应用所需的最小的 state 集合表示。接下来，我们需要确定哪一个组件能够改变这些 state，或者说*拥有*这些 state。

注意：React 中的数据流是单向的，并顺着组件层级从上往下传递。哪个组件应该拥有某个 state 这件事，**对初学者来说往往是最难理解的部分**。尽管这可能在一开始不是那么清晰，但你可以尝试以下办法来辨别：

对于应用中的每一个 state

  * 找到根据这个 state 进行渲染的所有组件。
  * 找到他们的共同所有者（common owner）组件（在组件层级上高于所有需要该 state 的组件）。
  * 该共同所有者组件或者比它层级更高的组件应该拥有该 state。
  * 如果你找不到一个合适的位置来存放该 state，就可以直接创建一个新的组件来存放该 state，并将这一新组件置于高于共同所有者组件层级的位置。

根据以上策略重新考虑我们的示例应用：

  * `ProductTable` 需要根据 state 筛选产品列表。`SearchBar` 需要展示搜索词和复选框的状态。
  * 他们的共同所有者是 `FilterableProductTable`。
  * 因此，搜索词和复选框的值很自然地应该存放在 `FilterableProductTable` 组件中。

很好，我们已经决定把这些 state 存放在 `FilterableProductTable` 组件中。首先，将实例属性 `this.state = {filterText: '', inStockOnly: false}` 添加到 `FilterableProductTable` 的 `constructor` 中，设置应用的初始 state；接着，将 `filterText` 和 `inStockOnly` 作为 props 传入 `ProductTable` 和 `SearchBar`；最后，用这些 props 筛选 `ProductTable` 中的产品信息，并设置 `SearchBar` 的表单值。

你现在可以看到应用的变化了：将 `filterText` 设置为 `"ball"` 并刷新应用，你能发现表格中的数据已经更新了。

## 第五步：添加反向数据流

<p data-height="600" data-theme-id="0" data-slug-hash="LzWZvb" data-default-tab="js,result" data-user="rohan10" data-embed-version="2" data-pen-title="Thinking In React: Step 5" class="codepen">参阅 <a href="http://codepen.io">CodePen</a> 上的 <a href="https://codepen.io/gaearon/pen/LzWZvb">React 哲学：第五步</a>。</p>

到目前为止，我们已经通过自上而下传递的 props 和 state 渲染了一个应用。现在，我们将尝试让数据反向传递：处于较低层级的表单组件更新高层级的 `FilterableProductTable` 中的 state。

React 通过一种比传统的双向绑定略微繁琐的方法来实现反向数据传递。尽管如此，这种需要显式声明的方法更利于人们理解应用的运作方式。

如果你在这时尝试在搜索框输入或勾选复选框，React 不会产生任何响应。这是正常的，因为我们之前已经将 `input` 的值设置为了从 `FilterableProductTable` 的 `state` 传递而来的固定值。

让我们重新梳理一下需要实现的功能：每当用户改变表单的值，我们需要改变 state 来反映用户的当前输入。由于 state 只能由拥有它们的组件进行更改，`FilterableProductTable` 必须将一个能够触发 state 改变的回调函数（callback）传递给 `SearchBar`。我们可以使用输入框的 `onChange` 事件来监视用户输入的变化。`FilterableProductTable` 传递给 `SearchBar` 的回调函数将能够调用 `setState()`，从而更新应用。

尽管描述起来有点复杂，但是实现上却很简单。你可以清楚地看到你的应用中数据是如何流动的。

## 这就是全部了

希望这篇文档能够帮助你建立起构建 React 组件和应用的一般概念。尽管你可能需要敲更多的代码，但是别忘了：比起写，代码更多地是给人看的。我们一起构建的这个模块化示例应用的代码就很适合阅读。当你开始构建更大的组件库时，你会意识到这种代码模块化和清晰度的重要性。并且随着代码重用程度的加深，你的代码行数也会显著地减少。:)
