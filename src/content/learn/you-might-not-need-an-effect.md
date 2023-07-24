---
title: '你可能不需要 Effect'
---

<Intro>

Effect 是 React 范式中的一个逃脱方案。它们让你可以 “逃出” React 并使组件和一些外部系统同步，比如非 React 组件、网络和浏览器 DOM。如果没有涉及到外部系统（例如，你想根据 props 或 state 的变化来更新一个组件的 state），你就不应该使用 Effect。移除不必要的 Effect 可以让你的代码更容易理解，运行得更快，并且更少出错。

</Intro>

<YouWillLearn>

* 为什么以及如何从你的组件中移除 Effect
* 如何在没有 Effect 的情况下缓存昂贵的计算
* 如何在没有 Effect 的情况下重置和调整组件的 state
* 如何在事件处理函数之间共享逻辑
* 应该将哪些逻辑移动到事件处理函数中
* 如何将发生的变动通知到父组件

</YouWillLearn>

## 如何移除不必要的 Effect {/*how-to-remove-unnecessary-effects*/}

有两种不必使用 Effect 的常见情况：

* **你不必使用 Effect 来转换渲染所需的数据**。例如，你想在展示一个列表前先做筛选。你的直觉可能是写一个当列表变化时更新 state 变量的 Effect。然而，这是低效的。当你更新这个 state 时，React 首先会调用你的组件函数来计算应该显示在屏幕上的内容。然后 React 会把这些变化“[提交](/learn/render-and-commit)”到 DOM 中来更新屏幕。然后 React 会执行你的 Effect。如果你的 Effect 也立即更新了这个 state，就会重新执行整个流程。为了避免不必要的渲染流程，应在你的组件顶层转换数据。这些代码会在你的 props 或 state 变化时自动重新执行。
* **你不必使用 Effect 来处理用户事件**。例如，你想在用户购买一个产品时发送一个 `/api/buy` 的 POST 请求并展示一个提示。在这个购买按钮的点击事件处理函数中，你确切地知道会发生什么。但是你不知道用户做了什么导致 Effect 被执行（例如，点击了某个按钮）。这就是为什么你通常应该在相应的事件处理函数中处理用户事件。

你 **的确** 可以使用 Effect 来和外部系统 [同步](/learn/synchronizing-with-effects#what-are-effects-and-how-are-they-different-from-events) 。例如，你可以写一个 Effect 来保持一个 jQuery 的组件和 React state 之间的同步。你也可以使用 Effect 来获取数据：例如，你可以同步当前的查询搜索和查询结果。请记住，比起直接在你的组件中写 Effect，现代 [框架](/learn/start-a-new-react-project#production-grade-react-frameworks) 提供了更加高效的，内置的数据获取机制。

为了帮助你获得正确的直觉，让我们来看一些常见的实例吧！

### 根据 props 或 state 来更新 state {/*updating-state-based-on-props-or-state*/}

假设你有一个包含了两个 state 变量的组件：`firstName` 和 `lastName`。你想通过把它们联结起来计算出 `fullName`。此外，每当 `firstName` 和 `lastName` 变化时，你希望 `fullName` 都能更新。你的第一直觉可能是添加一个 state 变量：`fullName`，并在一个 Effect 中更新它：

```js {5-9}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');

  // 🔴 避免：多余的 state 和不必要的 Effect
  const [fullName, setFullName] = useState('');
  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);
  // ...
}
```

大可不必这么复杂。而且这样效率也不高：它先是用 `fullName` 的旧值执行了整个渲染流程，然后立即使用更新后的值又重新渲染了一遍。让我们移除 state 变量和 Effect：

```js {4-5}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  // ✅ 非常好：在渲染期间进行计算
  const fullName = firstName + ' ' + lastName;
  // ...
}
```

**如果一个值可以基于现有的 props 或 state 计算得出，[不要把它作为一个 state](/learn/choosing-the-state-structure#avoid-redundant-state)，而是在渲染期间直接计算这个值**。这将使你的代码更快（避免了多余的 “级联” 更新）、更简洁（移除了一些代码）以及更少出错（避免了一些因为不同的 state 变量之间没有正确同步而导致的问题）。如果这个观点对你来说很新奇，[React 哲学](/learn/thinking-in-react#step-3-find-the-minimal-but-complete-representation-of-ui-state) 中解释了什么值应该作为 state。

### 缓存昂贵的计算 {/*caching-expensive-calculations*/}

这个组件使用它接收到的 props 中的 `filter` 对另一个 prop `todos` 进行筛选，计算得出 `visibleTodos`。你的直觉可能是把结果存到一个 state 中，并在 Effect 中更新它：

```js {4-8}
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');

  // 🔴 避免：多余的 state 和不必要的 Effect
  const [visibleTodos, setVisibleTodos] = useState([]);
  useEffect(() => {
    setVisibleTodos(getFilteredTodos(todos, filter));
  }, [todos, filter]);

  // ...
}
```

就像之前的例子一样，这既没有必要，也很低效。首先，移除 state 和 Effect：

```js {3-4}
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  // ✅ 如果 getFilteredTodos() 的耗时不长，这样写就可以了。
  const visibleTodos = getFilteredTodos(todos, filter);
  // ...
}
```

一般来说，这段代码没有问题！但是，`getFilteredTodos()` 的耗时可能会很长，或者你有很多 `todos`。这些情况下，当 `newTodo` 这样不相关的 state 变量变化时，你并不想重新执行 `getFilteredTodos()`。

你可以使用 [`useMemo`](/reference/react/useMemo) Hook 缓存（或者说 [记忆（memoize）](https://en.wikipedia.org/wiki/Memoization)）一个昂贵的计算。

```js {5-8}
import { useMemo, useState } from 'react';

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  const visibleTodos = useMemo(() => {
    // ✅ 除非 todos 或 filter 发生变化，否则不会重新执行
    return getFilteredTodos(todos, filter);
  }, [todos, filter]);
  // ...
}
```

或者写成一行：

```js {5-6}
import { useMemo, useState } from 'react';

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  // ✅ 除非 todos 或 filter 发生变化，否则不会重新执行 getFilteredTodos()
  const visibleTodos = useMemo(() => getFilteredTodos(todos, filter), [todos, filter]);
  // ...
}
```

**这会告诉 React，除非 `todos` 或 `filter` 发生变化，否则不要重新执行传入的函数**。React 会在初次渲染的时候记住 `getFilteredTodos()` 的返回值。在下一次渲染中，它会检查 `todos` 或 `filter` 是否发生了变化。如果它们跟上次渲染时一样，`useMemo` 会直接返回它最后保存的结果。如果不一样，React 将再次调用传入的函数（并保存它的结果）。

你传入 [`useMemo`](/reference/react/useMemo) 的函数会在渲染期间执行，所以它仅适用于 [纯函数](/learn/keeping-components-pure) 场景。

<DeepDive>

#### 如何判断计算是昂贵的？ {/*how-to-tell-if-a-calculation-is-expensive*/}

一般来说只有你创建或循环遍历了成千上万个对象时才会很耗费时间。如果你想确认一下，可以添加控制台输出来测量某一段代码的执行时间：

```js {1,3}
console.time('筛选数组');
const visibleTodos = getFilteredTodos(todos, filter);
console.timeEnd('筛选数组');
```

触发要测量的交互（例如，在输入框中输入）。你会在控制台中看到类似 `筛选数组：0.15ms` 这样的输出日志。如果总耗时达到了一定量级（比方说 `1ms` 或更多），那么把计算结果记忆（memoize）起来可能是有意义的。做一个实验，你可以把计算传入 `useMemo` 中来验证该交互导致的总耗时是减少了还是没什么变化：

```js
console.time('筛选数组');
const visibleTodos = useMemo(() => {
  return getFilteredTodos(todos, filter); // 如果 todos 或 filter 没有发生变化将跳过执行
}, [todos, filter]);
console.timeEnd('筛选数组');
```

`useMemo` 不会让 **第一次** 渲染变快。它只是帮助你跳过不必要的更新。

请注意，你的设备性能可能比用户的更好，因此最好通过人工限制工具来测试性能。例如，Chrome 提供了 [CPU 节流](https://developer.chrome.com/blog/new-in-devtools-61/#throttling) 工具。

同时需要注意的是，在开发环境测试性能并不能得到最准确的结果（例如，当开启 [严格模式](/reference/react/StrictMode) 时，你会看到每个组件渲染了两次，而不是一次）。所以为了得到最准确的时间，需要将你的应用构建为生产模式，同时使用与你的用户性能相当的设备进行测试。

</DeepDive>

### 当 props 变化时重置所有 state {/*resetting-all-state-when-a-prop-changes*/}

`ProfilePage` 组件接收一个 prop：`userId`。页面上有一个评论输入框，你用了一个 state：`comment` 来保存它的值。有一天，你发现了一个问题：当你从一个人的个人资料导航到另一个时，`comment` 没有被重置。这导致很容易不小心把评论发送到不正确的个人资料。为了解决这个问题，你想在 `userId` 变化时，清除 `comment` 变量：

```js {4-7}
export default function ProfilePage({ userId }) {
  const [comment, setComment] = useState('');

  // 🔴 避免：当 prop 变化时，在 Effect 中重置 state
  useEffect(() => {
    setComment('');
  }, [userId]);
  // ...
}
```

但这是低效的，因为 `ProfilePage` 和它的子组件首先会用旧值渲染，然后再用新值重新渲染。并且这样做也很复杂，因为你需要在 `ProfilePage` 里面 **所有** 具有 state 的组件中都写这样的代码。例如，如果评论区的 UI 是嵌套的，你可能也想清除嵌套的 comment state。

取而代之的是，你可以通过为每个用户的个人资料组件提供一个明确的键来告诉 React 它们原则上是 **不同** 的个人资料组件。将你的组件拆分为两个组件，并从外部的组件传递一个 `key` 属性给内部的组件：

```js {5,11-12}
export default function ProfilePage({ userId }) {
  return (
    <Profile
      userId={userId}
      key={userId}
    />
  );
}

function Profile({ userId }) {
  // ✅ 当 key 变化时，该组件内的 comment 或其他 state 会自动被重置
  const [comment, setComment] = useState('');
  // ...
}
```

通常，当在相同的位置渲染相同的组件时，React 会保留状态。**通过将 `userId` 作为 `key` 传递给 `Profile` 组件，使  React 将具有不同 `userId` 的两个 `Profile` 组件视为两个不应共享任何状态的不同组件**。每当 key（这里是 `userId`）变化时，React 将重新创建 DOM，并 [重置](/learn/preserving-and-resetting-state#option-2-resetting-state-with-a-key) `Profile` 组件和它的所有子组件的 state。现在，当在不同的个人资料之间导航时，`comment` 区域将自动被清空。

请注意，在这个例子中，只有外部的 `ProfilePage` 组件被导出并在项目中对其他文件可见。渲染 `ProfilePage` 的那些组件不用传递 `key` 给它：它们只需把 `userId` 作为常规 prop 传入即可。而 `ProfilePage` 将其作为 `key` 传递给内部的 `Profile` 组件是它的实现细节而已。

### 当 prop 变化时调整部分 state {/*adjusting-some-state-when-a-prop-changes*/}

有时候，当 prop 变化时，你可能只想重置或调整部分 state ，而不是所有 state。

`List` 组件接收一个 `items` 列表作为 prop，然后用 state 变量 `selection` 来保持已选中的项。当 `items` 接收到一个不同的数组时，你想将 `selection` 重置为 `null`：

```js {5-8}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // 🔴 避免：当 prop 变化时，在 Effect 中调整 state
  useEffect(() => {
    setSelection(null);
  }, [items]);
  // ...
}
```

这不太理想。每当 `items` 变化时，`List` 及其子组件会先使用旧的 `selection` 值渲染。然后 React 会更新 DOM 并执行 Effect。最后，调用 `setSelection(null)` 将导致 `List` 及其子组件重新渲染，重新启动整个流程。

让我们从删除 Effect 开始。取而代之的是在渲染期间直接调整 state：

```js {5-11}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // 好一些：在渲染期间调整 state
  const [prevItems, setPrevItems] = useState(items);
  if (items !== prevItems) {
    setPrevItems(items);
    setSelection(null);
  }
  // ...
}
```

像这样 [存储前序渲染的信息](/reference/react/useState#storing-information-from-previous-renders) 可能很难理解，但它比在 Effect 中更新这个 state 要好。上面的例子中，在渲染过程中直接调用了 `setSelection`。当它执行到 `return` 语句退出后，React 将 **立即** 重新渲染 `List`。此时 React 还没有渲染 `List` 的子组件或更新 DOM，这使得 `List` 的子组件可以跳过渲染旧的 `selection` 值。

在渲染期间更新组件时，React 会丢弃已经返回的 JSX 并立即尝试重新渲染。为了避免非常缓慢的级联重试，React 只允许在渲染期间更新 **同一** 组件的状态。如果你在渲染期间更新另一个组件的状态，你会看到一条报错信息。条件判断 `items !== prevItems` 是必要的，它可以避免无限循环。你可以像这样调整 state，但任何其他副作用（比如变化 DOM 或设置的延时）应该留在事件处理函数或 Effect 中，以 [保持组件纯粹](/learn/keeping-components-pure)。

**虽然这种方式比 Effect 更高效，但大多数组件也不需要它**。无论你怎么做，根据 props 或其他 state 来调整 state 都会使数据流更难理解和调试。总是检查是否可以通过添加 [key 来重置所有 state](#resetting-all-state-when-a-prop-changes)，或者 [在渲染期间计算所需内容](#updating-state-based-on-props-or-state)。例如，你可以存储已选中的 **item ID** 而不是存储（并重置）已选中的 **item**：

```js {3-5}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  // ✅ 非常好：在渲染期间计算所需内容
  const selection = items.find(item => item.id === selectedId) ?? null;
  // ...
}
```

现在完全不需要 “调整” state 了。如果包含已选中 ID 的项出现在列表中，则仍然保持选中状态。如果没有找到匹配的项，则在渲染期间计算的 `selection` 将会是 `null`。行为不同了，但可以说更好了，因为大多数对 `items` 的更改仍可以保持选中状态。

### 在事件处理函数中共享逻辑 {/*sharing-logic-between-event-handlers*/}

假设你有一个产品页面，上面有两个按钮（购买和付款），都可以让你购买该产品。当用户将产品添加进购物车时，你想显示一个通知。在两个按钮的 click 事件处理函数中都调用 `showNotification()` 感觉有点重复，所以你可能想把这个逻辑放在一个 Effect 中：

```js {2-7}
function ProductPage({ product, addToCart }) {
  // 🔴 避免：在 Effect 中处理属于事件特定的逻辑
  useEffect(() => {
    if (product.isInCart) {
      showNotification(`已添加 ${product.name} 进购物车！`);
    }
  }, [product]);

  function handleBuyClick() {
    addToCart(product);
  }

  function handleCheckoutClick() {
    addToCart(product);
    navigateTo('/checkout');
  }
  // ...
}
```

这个 Effect 是多余的。而且很可能会导致问题。例如，假设你的应用在页面重新加载之前 “记住” 了购物车中的产品。如果你把一个产品添加到购物车中并刷新页面，通知将再次出现。每次刷新该产品页面时，它都会出现。这是因为 `product.isInCart` 在页面加载时已经是 `true` 了，所以上面的 Effect 每次都会调用 `showNotification()`。

**当你不确定某些代码应该放在 Effect 中还是事件处理函数中时，先自问 为什么 要执行这些代码。Effect 只用来执行那些显示给用户时组件 需要执行 的代码**。在这个例子中，通知应该在用户 **按下按钮** 后出现，而不是因为页面显示出来时！删除 Effect 并将共享的逻辑放入一个被两个事件处理程序调用的函数中：

```js {2-6,9,13}
function ProductPage({ product, addToCart }) {
  // ✅ 非常好：事件特定的逻辑在事件处理函数中处理
  function buyProduct() {
    addToCart(product);
    showNotification(`已添加 ${product.name} 进购物车！`);
  }

  function handleBuyClick() {
    buyProduct();
  }

  function handleCheckoutClick() {
    buyProduct();
    navigateTo('/checkout');
  }
  // ...
}
```

这既移除了不必要的 Effect，又修复了问题。

### 发送 POST 请求 {/*sending-a-post-request*/}

这个 `Form` 组件会发送两种 POST 请求。它在页面加载之际会发送一个分析请求。当你填写表格并点击提交按钮时，它会向 `/api/register` 接口发送一个 POST 请求：

```js {5-8,10-16}
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // ✅ 非常好：这个逻辑应该在组件显示时执行
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' });
  }, []);

  // 🔴 避免：在 Effect 中处理属于事件特定的逻辑
  const [jsonToSubmit, setJsonToSubmit] = useState(null);
  useEffect(() => {
    if (jsonToSubmit !== null) {
      post('/api/register', jsonToSubmit);
    }
  }, [jsonToSubmit]);

  function handleSubmit(e) {
    e.preventDefault();
    setJsonToSubmit({ firstName, lastName });
  }
  // ...
}
```

让我们应用与之前示例相同的准则。

分析请求应该保留在 Effect 中。这是 **因为** 发送分析请求是表单显示时就需要执行的（在开发环境中它会发送两次，请 [参考这里](/learn/synchronizing-with-effects#sending-analytics) 了解如何处理）。

然而，发送到 `/api/register` 的 POST 请求并不是由表单 **显示** 时引起的。你只想在一个特定的时间点发送请求：当用户按下按钮时。它应该只在这个 **特定的交互** 中发生。删除第二个 Effect，将该 POST 请求移入事件处理函数中：

```js {12-13}
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // ✅ 非常好：这个逻辑应该在组件显示时执行
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    // ✅ 非常好：事件特定的逻辑在事件处理函数中处理
    post('/api/register', { firstName, lastName });
  }
  // ...
}
```

当你决定将某些逻辑放入事件处理函数还是 Effect 中时，你需要回答的主要问题是：从用户的角度来看它是 **怎样的逻辑**。如果这个逻辑是由某个特定的交互引起的，请将它保留在相应的事件处理函数中。如果是由用户在屏幕上 **看到** 组件时引起的，请将它保留在 Effect 中。

### 链式计算 {/*chains-of-computations*/}

有时候你可能想链接多个 Effect，每个 Effect 都基于某些 state 来调整其他的 state：

```js {7-29}
function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);

  // 🔴 避免：链接多个 Effect 仅仅为了相互触发调整 state
  useEffect(() => {
    if (card !== null && card.gold) {
      setGoldCardCount(c => c + 1);
    }
  }, [card]);

  useEffect(() => {
    if (goldCardCount > 3) {
      setRound(r => r + 1)
      setGoldCardCount(0);
    }
  }, [goldCardCount]);

  useEffect(() => {
    if (round > 5) {
      setIsGameOver(true);
    }
  }, [round]);

  useEffect(() => {
    alert('游戏结束！');
  }, [isGameOver]);

  function handlePlaceCard(nextCard) {
    if (isGameOver) {
      throw Error('游戏已经结束了。');
    } else {
      setCard(nextCard);
    }
  }

  // ...
```

这段代码里有两个问题。

一个问题是它非常低效：在链式的每个 `set` 调用之间，组件（及其子组件）都不得不重新渲染。在上面的例子中，在最坏的情况下（`setCard` → 渲染 → `setGoldCardCount` → 渲染 → `setRound` → 渲染 → `setIsGameOver` → 渲染）有三次不必要的重新渲染。

即使不考虑渲染效率问题，随着代码不断扩展，你会遇到这条 “链式” 调用不符合新需求的情况。试想一下，你现在需要添加一种方法来回溯游戏的历史记录，可以通过更新每个 state 变量到之前的值来实现。然而，将 `card` 设置为之前的的某个值会再次触发 Effect 链并更改你正在显示的数据。这样的代码往往是僵硬而脆弱的。

在这个例子中，更好的做法是：尽可能在渲染期间进行计算，以及在事件处理函数中调整 state：

```js {6-7,14-26}
function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);

  // ✅ 尽可能在渲染期间进行计算
  const isGameOver = round > 5;

  function handlePlaceCard(nextCard) {
    if (isGameOver) {
      throw Error('游戏已经结束了。');
    }

    // ✅ 在事件处理函数中计算剩下的所有 state
    setCard(nextCard);
    if (nextCard.gold) {
      if (goldCardCount <= 3) {
        setGoldCardCount(goldCardCount + 1);
      } else {
        setGoldCardCount(0);
        setRound(round + 1);
        if (round === 5) {
          alert('游戏结束！');
        }
      }
    }
  }

  // ...
```

这高效得多。此外，如果你实现了一个回溯游戏历史的方法，现在你可以将每个 state 变量设置为之前的任何的一个值，而不会触发每个调整其他值的 Effect 链。如果你需要在多个事件处理函数之间复用逻辑，可以 [提取成一个函数](#sharing-logic-between-event-handlers) 并在这些事件处理函数中调用它。

请记住，在事件处理函数内部，[state 的行为类似快照](/learn/state-as-a-snapshot)。例如，即使你调用了 `setRound(round + 1)`，`round` 变量仍然是用户点击按钮时的值。如果你需要使用下一个值进行计算，则需要像这样手动定义它：`const nextRound = round + 1`。

在某些情况下，你 **无法** 在事件处理函数中直接计算出下一个 state。例如，试想一个具有多个下拉菜单的表单，如果下一个下拉菜单的选项取决于前一个下拉菜单选择的值。这时，Effect 链是合适的，因为你需要与网络进行同步。

### 初始化应用 {/*initializing-the-application*/}

有些逻辑只需要在应用加载时执行一次。

你可能想把它放在一个顶层组件的 Effect 中：

```js {2-6}
function App() {
  // 🔴 避免：把只需要执行一次的逻辑放在 Effect 中
  useEffect(() => {
    loadDataFromLocalStorage();
    checkAuthToken();
  }, []);
  // ...
}
```

然后，你很快就会发现它在 [开发环境会执行两次](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)。这会导致一些问题——例如，它可能使身份验证 token 无效，因为该函数不是为被调用两次而设计的。一般来说，当组件重新挂载时应该具有一致性。包括你的顶层 `App` 组件。

尽管在实际的生产环境中它可能永远不会被重新挂载，但在所有组件中遵循相同的约束条件可以更容易地移动和复用代码。如果某些逻辑必须在 **每次应用加载时执行一次**，而不是在 **每次组件挂载时执行一次**，可以添加一个顶层变量来记录它是否已经执行过了：

```js {1,5-6,10}
let didInit = false;

function App() {
  useEffect(() => {
    if (!didInit) {
      didInit = true;
      // ✅ 只在每次应用加载时执行一次
      loadDataFromLocalStorage();
      checkAuthToken();
    }
  }, []);
  // ...
}
```

你也可以在模块初始化和应用渲染之前执行它：

```js {1,5}
if (typeof window !== 'undefined') { // 检测我们是否在浏览器环境
   // ✅ 只在每次应用加载时执行一次
  checkAuthToken();
  loadDataFromLocalStorage();
}

function App() {
  // ...
}
```

顶层代码会在组件被导入时执行一次——即使它最终并没有被渲染。为了避免在导入任意组件时降低性能或产生意外行为，请不要过度使用这种方法。将应用级别的初始化逻辑保留在像 `App.js` 这样的根组件模块或你的应用入口中。

### 通知父组件有关 state 变化的信息 {/*notifying-parent-components-about-state-changes*/}

假设你正在编写一个有具有内部 state `isOn` 的 `Toggle` 组件，该 state 可以是 `true` 或 `false`。有几种不同的方式来进行切换（通过点击或拖动）。你希望在 `Toggle` 的 state 变化时通知父组件，因此你暴露了一个 `onChange` 事件并在 `Effect` 中调用它：

```js {4-7}
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);

  // 🔴 避免：onChange 处理函数执行的时间太晚了
  useEffect(() => {
    onChange(isOn);
  }, [isOn, onChange])

  function handleClick() {
    setIsOn(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      setIsOn(true);
    } else {
      setIsOn(false);
    }
  }

  // ...
}
```

和之前一样，这不太理想。`Toggle` 首先更新它的 state，然后 React 会更新屏幕。然后 React 执行 Effect 中的代码，调用从父组件传入的 `onChange` 函数。现在父组件开始更新它自己的 state，开启另一个渲染流程。更好的方式是在单个流程中完成所有操作。

删除 Effect，并在同一个事件处理函数中更新 **两个** 组件的 state：

```js {5-7,11,16,18}
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);

  function updateToggle(nextIsOn) {
    // ✅ 非常好：在触发它们的事件中执行所有更新
    setIsOn(nextIsOn);
    onChange(nextIsOn);
  }

  function handleClick() {
    updateToggle(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      updateToggle(true);
    } else {
      updateToggle(false);
    }
  }

  // ...
}
```

通过这种方式，`Toggle` 组件及其父组件都在事件处理期间更新了各自的 state。React 会 [批量](/learn/queueing-a-series-of-state-updates) 处理来自不同组件的更新，所以只会有一个渲染流程。

你也可以完全移除该 state，并从父组件中接收 `isOn`：

```js {1,2}
// ✅ 也很好：该组件完全由它的父组件控制
function Toggle({ isOn, onChange }) {
  function handleClick() {
    onChange(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      onChange(true);
    } else {
      onChange(false);
    }
  }

  // ...
}
```

“[状态提升](/learn/sharing-state-between-components)” 允许父组件通过切换自身的 state 来完全控制 `Toggle` 组件。这意味着父组件会包含更多的逻辑，但整体上需要关心的状态变少了。每当你尝试保持两个不同的 state 变量之间的同步时，试试状态提升！

### 将数据传递给父组件 {/*passing-data-to-the-parent*/}

`Child` 组件获取了一些数据并在 Effect 中传递给 `Parent` 组件：

```js {9-14}
function Parent() {
  const [data, setData] = useState(null);
  // ...
  return <Child onFetched={setData} />;
}

function Child({ onFetched }) {
  const data = useSomeAPI();
  // 🔴 避免：在 Effect 中传递数据给父组件
  useEffect(() => {
    if (data) {
      onFetched(data);
    }
  }, [onFetched, data]);
  // ...
}
```

在 React 中，数据从父组件流向子组件。当你在屏幕上看到了一些错误时，你可以通过一路追踪组件树来寻找错误信息是从哪个组件传递下来的，从而找到传递了错误的 prop 或具有错误的 state 的组件。当子组件在 Effect 中更新其父组件的 state 时，数据流变得非常难以追踪。既然子组件和父组件都需要相同的数据，那么可以让父组件获取那些数据，并将其 **向下传递** 给子组件：

```js {4-5}
function Parent() {
  const data = useSomeAPI();
  // ...
  // ✅ 非常好：向子组件传递数据
  return <Child data={data} />;
}

function Child({ data }) {
  // ...
}
```

这更简单，并且可以保持数据流的可预测性：数据从父组件流向子组件。

### 订阅外部 store {/*subscribing-to-an-external-store*/}

有时候，你的组件可能需要订阅 React state 之外的一些数据。这些数据可能来自第三方库或内置浏览器 API。由于这些数据可能在 React 无法感知的情况下发变化，你需要在你的组件中手动订阅它们。这经常使用 Effect 来实现，例如：

```js {2-17}
function useOnlineStatus() {
  // 不理想：在 Effect 中手动订阅 store
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function updateState() {
      setIsOnline(navigator.onLine);
    }

    updateState();

    window.addEventListener('online', updateState);
    window.addEventListener('offline', updateState);
    return () => {
      window.removeEventListener('online', updateState);
      window.removeEventListener('offline', updateState);
    };
  }, []);
  return isOnline;
}

function ChatIndicator() {
  const isOnline = useOnlineStatus();
  // ...
}
```

这个组件订阅了一个外部的 store 数据（在这里，是浏览器的 `navigator.onLine` API）。由于这个 API 在服务端不存在（因此不能用于初始的 HTML），因此 state 最初被设置为 `true`。每当浏览器 store 中的值发生变化时，组件都会更新它的 state。

尽管通常可以使用 Effect 来实现此功能，但 React 为此针对性地提供了一个 Hook 用于订阅外部 store。删除 Effect 并将其替换为调用 [`useSyncExternalStore`](/reference/react/useSyncExternalStore)：

```js {11-16}
function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function useOnlineStatus() {
  // ✅ 非常好：用内置的 Hook 订阅外部 store
  return useSyncExternalStore(
    subscribe, // 只要传递的是同一个函数，React 不会重新订阅
    () => navigator.onLine, // 如何在客户端获取值
    () => true // 如何在服务端获取值
  );
}

function ChatIndicator() {
  const isOnline = useOnlineStatus();
  // ...
}
```

与手动使用 Effect 将可变数据同步到 React state 相比，这种方法能减少错误。通常，你可以写一个像上面的 `useOnlineStatus()` 这样的自定义 Hook，这样你就不需要在各个组件中重复写这些代码。[阅读更多关于在 React 组件中订阅外部数据 store 的信息](/reference/react/useSyncExternalStore)。

### 获取数据 {/*fetching-data*/}

许多应用使用 Effect 来发起数据获取请求。像这样在 Effect 中写一个数据获取请求是相当常见的：

```js {5-10}
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // 🔴 避免：没有清除逻辑的获取数据
    fetchResults(query, page).then(json => {
      setResults(json);
    });
  }, [query, page]);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}
```

你 **不需要** 把这个数据获取逻辑迁移到一个事件处理函数中。

这可能看起来与之前需要将逻辑放入事件处理函数中的示例相矛盾！但是，考虑到这并不是 **键入事件**，这是在这里获取数据的主要原因。搜索输入框的值经常从 URL 中预填充，用户可以在不关心输入框的情况下导航到后退和前进页面。

`page` 和 `query` 的来源其实并不重要。只要该组件可见，你就需要通过当前 `page` 和 `query` 的值，保持 `results` 和网络数据的 [同步](/learn/synchronizing-with-effects)。这就是为什么这里是一个 Effect 的原因。

然而，上面的代码有一个问题。假设你快速地输入 `“hello”`。那么 `query` 会从 `“h”` 变成 `“he”`，`“hel”`，`“hell”` 最后是 `“hello”`。这会触发一连串不同的数据获取请求，但无法保证对应的返回顺序。例如，`“hell”` 的响应可能在 `“hello”` 的响应 **之后** 返回。由于它的 `setResults()` 是在最后被调用的，你将会显示错误的搜索结果。这种情况被称为 “[竞态条件](https://en.wikipedia.org/wiki/Race_condition)”：两个不同的请求 “相互竞争”，并以与你预期不符的顺序返回。

**为了修复这个问题，你需要添加一个 [清理函数](/learn/synchronizing-with-effects#fetching-data) 来忽略较早的返回结果：**

```js {5,7,9,11-13}
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  useEffect(() => {
    let ignore = false;
    fetchResults(query, page).then(json => {
      if (!ignore) {
        setResults(json);
      }
    });
    return () => {
      ignore = true;
    };
  }, [query, page]);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}
```

这确保了当你在 Effect 中获取数据时，除了最后一次请求的所有返回结果都将被忽略。

处理竞态条件并不是实现数据获取的唯一难点。你可能还需要考虑缓存响应结果（使用户点击后退按钮时可以立即看到先前的屏幕内容），如何在服务端获取数据（使服务端初始渲染的 HTML 中包含获取到的内容而不是加载动画），以及如何避免网络瀑布（使子组件不必等待每个父组件的数据获取完毕后才开始获取数据）。

**这些问题适用于任何 UI 库，而不仅仅是 React。解决这些问题并不容易，这也是为什么现代 [框架](/learn/start-a-new-react-project#production-grade-react-frameworks) 提供了比在 Effect 中获取数据更有效的内置数据获取机制的原因。**

如果你不使用框架（也不想开发自己的框架），但希望使从 Effect 中获取数据更符合人类直觉，请考虑像这个例子一样，将获取逻辑提取到一个自定义 Hook 中：

```js {4}
function SearchResults({ query }) {
  const [page, setPage] = useState(1);
  const params = new URLSearchParams({ query, page });
  const results = useData(`/api/search?${params}`);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}

function useData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    let ignore = false;
    fetch(url)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setData(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [url]);
  return data;
}
```

你可能还想添加一些错误处理逻辑以及跟踪内容是否处于加载中。你可以自己编写这样的 Hook，也可以使用 React 生态中已经存在的许多解决方案。**虽然仅仅使用自定义 Hook 不如使用框架内置的数据获取机制高效，但将数据获取逻辑移动到自定义 Hook 中将使后续采用高效的数据获取策略更加容易。**

一般来说，当你不得不编写 Effect 时，请留意是否可以将某段功能提取到专门的内置 API 或一个更具声明性的自定义 Hook 中，比如上面的 `useData`。你会发现组件中的原始 `useEffect` 调用越少，维护应用将变得更加容易。

<Recap>

- 如果你可以在渲染期间计算某些内容，则不需要使用 Effect。
- 想要缓存昂贵的计算，请使用 `useMemo` 而不是 `useEffect`。
- 想要重置整个组件树的 state，请传入不同的 `key`。
- 想要在 prop 变化时重置某些特定的 state，请在渲染期间处理。
- 组件 **显示** 时就需要执行的代码应该放在 Effect 中，否则应该放在事件处理函数中。
- 如果你需要更新多个组件的 state，最好在单个事件处理函数中处理。
- 当你尝试在不同组件中同步 state 变量时，请考虑状态提升。
- 你可以使用 Effect 获取数据，但你需要实现清除逻辑以避免竞态条件。

</Recap>

<Challenges>

#### 不用 Effect 转换数据 {/*transform-data-without-effects*/}

下面的 `TodoList` 显示了一个待办事项列表。当 “只显示未完成的事项” 复选框被勾选时，已完成的待办事项不会显示在列表中。无论哪些待办事项可见，页脚始终显示尚未完成的待办事项数量。

通过移除不必要的 state 和 Effect 来简化这个组件。

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { initialTodos, createTodo } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [activeTodos, setActiveTodos] = useState([]);
  const [visibleTodos, setVisibleTodos] = useState([]);
  const [footer, setFooter] = useState(null);

  useEffect(() => {
    setActiveTodos(todos.filter(todo => !todo.completed));
  }, [todos]);

  useEffect(() => {
    setVisibleTodos(showActive ? activeTodos : todos);
  }, [showActive, todos, activeTodos]);

  useEffect(() => {
    setFooter(
      <footer>
        {activeTodos.length} 项待办
      </footer>
    );
  }, [activeTodos]);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        只显示未完成的事项
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
      {footer}
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        添加
      </button>
    </>
  );
}
```

```js todos.js
let nextId = 0;

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('买苹果', true),
  createTodo('买橘子', true),
  createTodo('买胡萝卜'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

<Hint>

如果你可以在渲染期间计算出某些值，那么就不需要使用 state 或 Effect 来更新它。

</Hint>

<Solution>

这个例子中只有两个必要的 state 变量：`todos` 列表和代表复选框是否勾选的 `showActive`。其他所有的 state 变量都是 [多余的](/learn/choosing-the-state-structure#avoid-redundant-state)，可以在渲染期间计算得出。包括 `footer`，可以直接移到包含它的 JSX 中。

你的最终答案应该是这样：

<Sandpack>

```js
import { useState } from 'react';
import { initialTodos, createTodo } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        只显示未完成的事项
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
      <footer>
        {activeTodos.length} 项待办
      </footer>
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        添加
      </button>
    </>
  );
}
```

```js todos.js
let nextId = 0;

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('买苹果', true),
  createTodo('买橘子', true),
  createTodo('买胡萝卜'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

</Solution>

#### 不用 Effect 缓存计算结果 {/*cache-a-calculation-without-effects*/}

在这个例子中，筛选 todos 的逻辑被提取到了一个叫做 `getVisibleTodos()` 的函数中，该函数内部包含一个 `console.log()`，它可以帮你了解函数的调用情况。切换 “只显示未完成的事项” 会导致 `getVisibleTodos()` 重新执行。这符合预期，因为切换未完成的待办事项会导致可见的待办事项发生变化。

你的任务是移除 `TodoList` 组件中重复计算 `visibleTodos` 列表的 Effect。但是，你需要确保在输入框中输入时，`getVisibleTodos()` **不会** 重新执行（因此不会打印任何日志）。

<Hint>

一个解决方案是通过添加一个 `useMemo` 来缓存可见的 todos。还有另一种不太明显的解决方案。

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [text, setText] = useState('');
  const [visibleTodos, setVisibleTodos] = useState([]);

  useEffect(() => {
    setVisibleTodos(getVisibleTodos(todos, showActive));
  }, [todos, showActive]);

  function handleAddClick() {
    setText('');
    setTodos([...todos, createTodo(text)]);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        只显示未完成的事项
      </label>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        添加
      </button>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

```js todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() 被调用了 ${++calls} 次`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('买苹果', true),
  createTodo('买橘子', true),
  createTodo('买胡萝卜'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

<Solution>

移除 state 变量和 Effect，取而代之的是添加一个 `useMemo` 来以缓存调用 `getVisibleTodos()` 的结果：

<Sandpack>

```js
import { useState, useMemo } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [text, setText] = useState('');
  const visibleTodos = useMemo(
    () => getVisibleTodos(todos, showActive),
    [todos, showActive]
  );

  function handleAddClick() {
    setText('');
    setTodos([...todos, createTodo(text)]);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        只显示未完成的事项
      </label>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        添加
      </button>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

```js todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() 被调用了 ${++calls} 次`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('买苹果', true),
  createTodo('买橘子', true),
  createTodo('买胡萝卜'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

通过这些改动，`getVisibleTodos()` 只有在 `todos` 或 `showActive` 变化时才会被调用。在输入框中输入只会更改 `text` 变量的值，并不会触发 `getVisibleTodos()`的调用。

还有一个不使用 `useMemo` 的解决方案。由于 `text` 变量不可能影响待办事项列表，你可以将 `NewTodo` 表单提取到一个单独的组件中，并将 text 变量移动到其中：

<Sandpack>

```js
import { useState, useMemo } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const visibleTodos = getVisibleTodos(todos, showActive);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        只显示未完成的事项
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        添加
      </button>
    </>
  );
}
```

```js todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() 被调用了 ${++calls} 次`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('买苹果', true),
  createTodo('买橘子', true),
  createTodo('买胡萝卜'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

这种方法也满足要求。当你在输入框中输入时，只有 `text` 变量会更新。由于 `text` 变量在子组件 `NewTodo` 中，父组件 `TodoList` 不会重新渲染。这就是当你输入时 `getVisibleTodos()` 不会被调用的原因（如果 `TodoList` 由于其他原因被重新渲染了，它仍然会被调用）。

</Solution>

#### 不用 Effect 重置 state {/*reset-state-without-effects*/}

`EditContact` 组件的 prop `savedContact` 接收一个类似于 `{ id, name, email }` 这样的联系人对象。尝试编辑名称和邮箱输入框。当你点击保存按钮时，表单上方的联系人按钮会更新为编辑后的名称。当你点击重置按钮时，表单中的任何改动都会被丢弃。试着玩一玩儿这个用户界面感受一下。

当你用顶部按钮选择一个联系人时，该表单会重置并展示该联系人的详细信息。这是在 `EditContact.js` 内部使用 Effect 实现的。移除该 Effect，找到另一种方式在 `savedContact.id` 变化时重置表单。

<Sandpack>

```js App.js hidden
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        savedContact={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js ContactList.js hidden
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js EditContact.js active
import { useState, useEffect } from 'react';

export default function EditContact({ savedContact, onSave }) {
  const [name, setName] = useState(savedContact.name);
  const [email, setEmail] = useState(savedContact.email);

  useEffect(() => {
    setName(savedContact.name);
    setEmail(savedContact.email);
  }, [savedContact]);

  return (
    <section>
      <label>
        姓名：{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        邮箱：{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: savedContact.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        保存
      </button>
      <button onClick={() => {
        setName(savedContact.name);
        setEmail(savedContact.email);
      }}>
        重置
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<Hint>

如果有一种方式可以告诉 React，当 `savedContact.id` 变化时，`EditContact` 表单本质上是一个 **不同的联系人表单**，不应该保留状态，那将非常棒。你还记得这样的方式吗？

</Hint>

<Solution>

将 `EditContact` 组件拆分为两个组件。将所有表单 state 移动到内部的 `EditForm` 组件中。导出外部的 `EditContact` 组件，并将 `savedContact.id` 作为 `key` 传入内部的 `EditForm` 组件。结果是，每当你选择不同的联系人时，内部的 `EditForm` 组件会重置所有表单状态并重新创建 DOM。

<Sandpack>

```js App.js hidden
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        savedContact={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js ContactList.js hidden
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js EditContact.js active
import { useState } from 'react';

export default function EditContact(props) {
  return (
    <EditForm
      {...props}
      key={props.savedContact.id}
    />
  );
}

function EditForm({ savedContact, onSave }) {
  const [name, setName] = useState(savedContact.name);
  const [email, setEmail] = useState(savedContact.email);

  return (
    <section>
      <label>
        姓名：{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        邮箱：{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: savedContact.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        保存
      </button>
      <button onClick={() => {
        setName(savedContact.name);
        setEmail(savedContact.email);
      }}>
        重置
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

</Solution>

#### 不用 Effect 提交表单 {/*submit-a-form-without-effects*/}

`Form` 组件可以让你向朋友发送消息。当你提交表单时，state 变量 `showForm` 会被设置为 `false`。这会触发一个 Effect 调用 `sendMessage(message)` 发送消息（你可以在控制台中看到）。消息发送后，你会看到一个 “谢谢” 的提示语，里面有一个 “打开聊天” 按钮，让你回到表单。

你的应用的用户发送的消息太多了。为了让聊天变得稍微困难一些，你决定 **先** 展示 “谢谢” 提示语，而不是表单。将 state 变量 `showForm` 的初始值改为 `false`，而不是 `true`。一旦你做了这些修改，控制台将发送一条空消息。这里的逻辑有问题！

导致这个问题的根本原因是什么？你能修复它吗？

<Hint>

是 **因为** 用户看到了 “谢谢” 提示语，才应该发送消息吗？还是其他什么原因？

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Form() {
  const [showForm, setShowForm] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!showForm) {
      sendMessage(message);
    }
  }, [showForm, message]);

  function handleSubmit(e) {
    e.preventDefault();
    setShowForm(false);
  }

  if (!showForm) {
    return (
      <>
        <h1>谢谢使用我们的服务！</h1>
        <button onClick={() => {
          setMessage('');
          setShowForm(true);
        }}>
          打开聊天
        </button>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="消息"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit" disabled={message === ''}>
        发送
      </button>
    </form>
  );
}

function sendMessage(message) {
  console.log('发送的消息：' + message);
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

<Solution>

state 变量 `showForm` 决定了显示表单还是 “谢谢” 提示语。然而，你并不是因为 “谢谢” 提示语被 **显示** 才发送消息的。你希望发送消息是因为用户 **提交了表单** 。删除误导性的 Effect，并将 `sendMessage` 调用移到 `handleSubmit` 事件处理函数中：

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Form() {
  const [showForm, setShowForm] = useState(true);
  const [message, setMessage] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setShowForm(false);
    sendMessage(message);
  }

  if (!showForm) {
    return (
      <>
        <h1>谢谢使用我们的服务！</h1>
        <button onClick={() => {
          setMessage('');
          setShowForm(true);
        }}>
          打开聊天
        </button>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="消息"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit" disabled={message === ''}>
        发送
      </button>
    </form>
  );
}

function sendMessage(message) {
  console.log('发送的消息： ' + message);
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

注意在这个版本中，只有 **提交表单**（这是一个事件）才会导致消息被发送。采用这种方案，无论 `showForm` 最初被设置为 `true` 还是 `false` 都同样有效（将其设置为 `false`，注意没有额外的控制台消息）。

</Solution>

</Challenges>
