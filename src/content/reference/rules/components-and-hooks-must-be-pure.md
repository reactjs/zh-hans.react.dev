---
title: 组件和 Hook 必须是纯粹的
---

<Intro>
Pure functions only perform a calculation and nothing more. It makes your code easier to understand, debug, and allows React to automatically optimize your components and Hooks correctly.
</Intro>

<Note>
本参考页面涵盖高级话题，需要熟悉 [保持组件纯粹](/learn/keeping-components-pure) 页面中涉及的概念。
</Note>

<InlineToc />

### 为什么保持纯粹很重要？ {/*why-does-purity-matter*/}

React 中的一个核心概念是保持纯粹。一个纯组件或 Hook 是指：

* **Idempotent** – You [always get the same result every time](/learn/keeping-components-pure#purity-components-as-formulas) you run it with the same inputs – props, state, context for component inputs; and arguments for hook inputs.
* **Has no side effects in render** – Code with side effects should run [**separately from rendering**](#how-does-react-run-your-code). For example as an [event handler](/learn/responding-to-events) – where the user interacts with the UI and causes it to update; or as an [Effect](/reference/react/useEffect) – which runs after render.
* **Does not mutate non-local values**: Components and Hooks should [never modify values that aren't created locally](#mutation) in render.

当渲染保持纯净时，React 能够理解哪些更新对用户来说最重要，应该优先显示。这是因为渲染的纯粹，即由于组件 [在渲染过程中](#how-does-react-run-your-code) 不会产生副作用，React 可以暂停渲染那些不是那么重要的组件，等到真正需要时再继续渲染它们。

具体来说，这意味着渲染逻辑可以多次运行，这样 React 就能够为你的用户提供愉快的体验。然而，如果你的组件 [在渲染过程中](#how-does-react-run-your-code) 有无追踪的副作用，比如修改全局变量的值，那么当 React 再次运行你的渲染代码时，这些副作用会以你不希望的方式被触发。这通常会导致意外的 bug，从而降低用户对你应用的体验感。你可以看到这样一个 [例子在保持组件纯粹页面中](/learn/keeping-components-pure#side-effects-unintended-consequences)。

#### React 是如何运行你的代码的？ {/*how-does-react-run-your-code*/}

React 是声明式的，即你告诉 React 你想要渲染的内容，React 会自己选择最佳的方式向用户展示它。为了做到这一点，React 在执行你的代码时分为几个阶段。虽然你不必了解所有这些阶段就能很好地使用 React。但是，从高层次来看，你应该了解哪些代码在渲染阶段运行，哪些代码在渲染阶段之外运行。

_Rendering_ refers to calculating what the next version of your UI should look like. After rendering, [Effects](/reference/react/useEffect) are _flushed_ (meaning they are run until there are no more left) and may update the calculation if the Effects have impacts on layout. React takes this new calculation and compares it to the calculation used to create the previous version of your UI, then _commits_ just the minimum changes needed to the [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) (what your user actually sees) to catch it up to the latest version.

<DeepDive>

#### 如何判断代码是否在渲染中运行 {/*how-to-tell-if-code-runs-in-render*/}

一个快速判断代码是否在渲染过程中运行的方法是检查代码的位置：如果它像下面的例子那样写在顶层，那么它很可能会在渲染过程中运行。

```js {2}
function Dropdown() {
  const selectedItems = new Set(); // 在渲染过程中创建
  // ...
}
```

事件处理函数和 Effect 在渲染过程中不会运行：

```js {4}
function Dropdown() {
  const selectedItems = new Set();
  const onSelect = (item) => {
    // 这段代码位于事件处理函数中，因此只有在用户触发这个事件时才会运行。
    selectedItems.add(item);
  }
}
```

```js {4}
function Dropdown() {
  const selectedItems = new Set();
  useEffect(() => {
    // 这段代码位于 Effect 内部，因此它只在渲染完成后运行。
    logForAnalytics(selectedItems);
  }, [selectedItems]);
}
```
</DeepDive>

---

## Components and Hooks must be idempotent {/*components-and-hooks-must-be-idempotent*/}

Components must always return the same output with respect to their inputs – props, state, and context. This is known as _idempotency_. [Idempotency](https://en.wikipedia.org/wiki/Idempotence) is a term popularized in functional programming. It refers to the idea that you [always get the same result every time](learn/keeping-components-pure) you run that piece of code with the same inputs.

这意味着，为了遵循这一规则，所有 [在渲染期间](#how-does-react-run-your-code)  执行的代码也必须是幂等的。例如，以下这行代码就不是幂等的（因此，包含这行代码的组件也不是幂等的）：

```js {2}
function Clock() {
  const time = new Date(); // 🔴 错误的：总是返回不同的结果！
  return <span>{time.toLocaleString()}</span>
}
```

`new Date()` 函数不是幂等的，因为它总是返回当前的日期和时间，并且每次调用时返回的结果都不同。当你渲染上面的组件时，屏幕上显示的时间将会停留在组件被渲染的那一刻的时间。类似地，像 `Math.random()` 这样的函数也不是幂等的，因为即使输入相同，它们每次调用也都会返回不同的结果。

这并不意味着你完全不能使用像 `new Date()` 这样非幂等的函数——你只需要避免 [在渲染过程](#how-does-react-run-your-code) 中使用它们即可。在这种情况下，我们可以使用一个 [Effect](/reference/react/useEffect) 来将最新的日期与这个组件进行“同步”：

<Sandpack>

```js
import { useState, useEffect } from 'react';

function useTime() {
  // 1. 跟踪当前日期的状态。`useState` 接受一个初始化函数作为其
  //    初始状态。它只在调用 Hook 时运行一次，因此只有调用 Hook 时的
  //    当前日期才被首先设置。
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    // 2. 使用 `setInterval` 每秒更新当前日期。
    const id = setInterval(() => {
      setTime(new Date()); // ✅ 正确的：非幂等代码不再在渲染中运行。
    }, 1000);
    // 3. 返回一个清理函数，这样我们就不会忘记清理 `setInterval` 定时器，导致内存泄漏。
    return () => clearInterval(id);
  }, []);

  return time;
}

export default function Clock() {
  const time = useTime();
  return <span>{time.toLocaleString()}</span>;
}
```

</Sandpack>

通过将非幂等的 `new Date()` 调用包装在一个 Effect 中，就可以将这个计算移动到 [渲染之外](#how-does-react-run-your-code)。

如果你不需要将某些外部状态与 React 同步，只需要在响应用户交互时更新，你可以考虑使用一个 [事件处理函数](/learn/responding-to-events)。

---

## 副作用必须在渲染之外执行 {/*side-effects-must-run-outside-of-render*/}

[副作用](/learn/keeping-components-pure#side-effects-unintended-consequences) 不应该 [在渲染中](#how-does-react-run-your-code) 执行，因为 React 可能会多次渲染组件以提供最佳的用户体验。

<Note>
副作用是一个比 Effect 更广泛的概念。Effect 特指被包裹在 `useEffect` 中的代码，而“副作用”是一般术语，指除了将其主要结果（返回值）传递给调用者之外，对外部世界有任何可观察影响的代码。

副作用通常写在 [事件处理函数](/learn/responding-to-events) 或 Effect 内部。但绝不能在渲染过程中写。
</Note>

尽管渲染必须保持纯净，但副作用对于你的应用来说是应当也是非常必要的，这样才能做一些有趣的事情，比如在屏幕上显示内容！这条规则的关键点在于，副作用不应该 [在渲染中](#how-does-react-run-your-code) 执行，因为 React 可能会多次渲染组件。在大多数情况下，你会使用 [事件处理函数](learn/responding-to-events) 来处理副作用。使用事件处理函数明确地告诉 React 这段代码不需要在渲染过程中执行，从而保持渲染的纯粹。如果你已经尝试了所有可能的方法——并且只是作为最后的解决办法——你也可以使用 `useEffect` 来处理副作用。

### 什么时候可以进行 mutation？ {/*mutation*/}

#### 局部 mutation {/*local-mutation*/}
一个常见的副作用示例是突变（mutation），这在 JavaScript 中指的是改变一个非 [原始值](https://developer.mozilla.org/en-US/docs/Glossary/Primitive) 的值。通常来说，在 React 中 mutation 操作并不符合最佳实践，但是进行局部 mutation 是完全可以接受的：

```js {2,7}
function FriendList({ friends }) {
  const items = []; // ✅ 正确的：在局部创建
  for (let i = 0; i < friends.length; i++) {
    const friend = friends[i];
    items.push(
      <Friend key={friend.id} friend={friend} />
    ); // ✅ 正确的：局部修改是可以的。
  }
  return <section>{items}</section>;
}
```

你没有必要为了回避局部 mutation 而刻意编写复杂的代码。虽然为了简洁，这里可以使用 [`Array.map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)，但创建一个局部数组，然后 [在渲染时](#how-does-react-run-your-code) 向其中添加数组项也是完全可以的。

尽管看起来我们正在修改 `items`，但关键的一点是这种 mutation 是局部的，当组件再次渲染时，这种 mutation 不会被“记住”。换句话说，`items` 只在组件存在期间有效。因为每次渲染 `<FriendList />` 时，`items` 都会被重新创建，所以组件总能返回相同的结果。

另一方面，如果 `items` 是在组件外部创建的，那么它会保留其之前的值，并记住所做的更改：

```js {1,7}
const items = []; // 🔴 错误的：在组件外部创建
function FriendList({ friends }) {
  for (let i = 0; i < friends.length; i++) {
    const friend = friends[i];
    items.push(
      <Friend key={friend.id} friend={friend} />
    ); // 🔴 错误的：修改了一个在渲染之外创建的值。
  }
  return <section>{items}</section>;
}
```

每当 `<FriendList />` 组件再次运行时，我们都会持续地向 `items` 数组追加 `friends`，这将导致产生多个重复的结果。这个版本的 `<FriendList />` [在渲染中](#how-does-react-run-your-code) 具有可观察的副作用，所以违反了规则。

#### 延迟初始化 {/*lazy-initialization*/}

即使不是完全“纯粹”的，延迟初始化也是完全可以接受的：

```js {2}
function ExpenseForm() {
  SuperCalculator.initializeIfNotReady(); // ✅ 正确的：如果它对其他组件没有影响。
  // Continue rendering...
}
```

#### 改变 DOM {/*changing-the-dom*/}

在 React 组件的渲染逻辑中不允许有直接对用户可见的副作用。换句话说，仅仅调用一个组件函数本身不应当在屏幕上产生变化。

```js {2}
function ProductDetailPage({ product }) {
  document.window.title = product.title; // 🔴 错误的：改变 DOM
}
```

要在渲染之外更新 `window.title` 的一个方法是 [将组件与 `window` 进行同步](/learn/synchronizing-with-effects)。

只要多次调用组件是安全的，并且不会影响其他组件的渲染，React 就不会在意组件是否在严格的函数式编程意义上是百分之百纯粹的。更重要的是，[组件必须是幂等的](/reference/rules/components-and-hooks-must-be-pure)。

---

## props 和 state 是不可变的 {/*props-and-state-are-immutable*/}

组件的 props 和 state 是不可变的 [快照](learn/state-as-a-snapshot)。永远不要直接修改它们。相反，你应该向下传递新的属性，以及使用 `useState` 提供的 setter 函数。

你可以将 props 和 state 视为在渲染后更新的快照。因此，你不会直接修改 props 或 state，相反，你传递新的 props，或者使用提供给你的 setter 函数来告诉 React，state 需要在下一次组件渲染时更新。

### 不要修改 props {/*props*/}
props 是不可变的，因为如果你改变了它们，应用程序可能会产生不一致的结果，这会让调试变得困难，因为程序可能会在某些情况下工作，而在另一些情况下不工作。

```js {2}
function Post({ item }) {
  item.url = new Url(item.url, base); // 🔴 错误的：永远不要直接修改 props
  return <Link url={item.url}>{item.title}</Link>;
}
```

```js {2}
function Post({ item }) {
  const url = new Url(item.url, base); // ✅ 正确的：创建一个新的副本替代
  return <Link url={url}>{item.title}</Link>;
}
```

### 不要修改 state {/*state*/}
`useState` 返回一个 state 和一个用于更新该状态的 setter。

```js
const [stateVariable, setter] = useState(0);
```

我们不应该直接在 state 变量上进行更新，而应该使用 `useState` 返回的 setter 函数来进行更新。如果在 state 变量上直接修改值，并不会导致组件界面更新，这样用户界面就会显示过时的信息。通过使用 setter 函数，我们告诉 React 状态已经发生了变化，需要进行重新渲染，以便更新用户界面。

```js {5}
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    count = count + 1; // 🔴 错误的：永远不要直接修改 state
  }

  return (
    <button onClick={handleClick}>
      You pressed me {count} times
    </button>
  );
}
```

```js {5}
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1); // ✅ 正确的：使用由 useState 返回的 setter 函数来修改 state。
  }

  return (
    <button onClick={handleClick}>
      You pressed me {count} times
    </button>
  );
}
```

---

## Hook 的返回值和参数是不可变的 {/*return-values-and-arguments-to-hooks-are-immutable*/}

一旦值被传递给 Hook，就不应该再对它们进行修改。就像在 JSX 中的 props 一样，当值被传递给 Hook 时，它们就应该是不可变的了。

```js {4}
function useIconStyle(icon) {
  const theme = useContext(ThemeContext);
  if (icon.enabled) {
    icon.className = computeStyle(icon, theme); // 🔴 错误的：永远不要直接修改 Hook 的参数。
  }
  return icon;
}
```

```js {3}
function useIconStyle(icon) {
  const theme = useContext(ThemeContext);
  const newIcon = { ...icon }; // ✅ 正确的：创建一个新的副本替代
  if (icon.enabled) {
    newIcon.className = computeStyle(icon, theme);
  }
  return newIcon;
}
```

在 React 中有一个重要的原则叫做局部推理，即通过单独查看组件或 Hook 的代码，就能理解它的作用。当调用 Hook 时，应该把它们当作“黑盒子”。例如，自定义 Hook 可能使用其参数作为依赖项，在内部缓存值：

```js {4}
function useIconStyle(icon) {
  const theme = useContext(ThemeContext);

  return useMemo(() => {
    const newIcon = { ...icon };
    if (icon.enabled) {
      newIcon.className = computeStyle(icon, theme);
    }
    return newIcon;
  }, [icon, theme]);
}
```

If you were to mutate the Hooks arguments, the custom hook's memoization will become incorrect,  so it's important to avoid doing that.

```js {4}
style = useIconStyle(icon);         // `style` 是基于 `icon` 进行记忆化的
icon.enabled = false;               // 错误的： 🔴 永远不要直接修改 Hook 的参数
style = useIconStyle(icon);         // 返回之前记忆化的结果
```

```js {4}
style = useIconStyle(icon);         // `style` 是基于 `icon` 进行记忆化的
icon = { ...icon, enabled: false }; // 正确的: ✅ 创建一个新的副本替代
style = useIconStyle(icon);         // 计算 `style` 的新值
```

Similarly, it's important to not modify the return values of Hooks, as they may have been memoized.

---

## 不要改变传递给 JSX 后的值 {/*values-are-immutable-after-being-passed-to-jsx*/}

不要在 JSX 使用过值之后改变它们。应该在创建 JSX 之前完成值的更改。

当你在表达式中使用 JSX 时，React 可能会在组件完成渲染之前就急于计算 JSX。这意味着，如果在将值传递给 JSX 之后对它们进行更改，可能会导致 UI 过时，因为 React 不会知道需要更新组件的输出。

```js {4}
function Page({ colour }) {
  const styles = { colour, size: "large" };
  const header = <Header styles={styles} />;
  styles.size = "small"; // 🔴 错误的：styles 已经在上面的 JSX 中使用了。
  const footer = <Footer styles={styles} />;
  return (
    <>
      {header}
      <Content />
      {footer}
    </>
  );
}
```

```js {4}
function Page({ colour }) {
  const headerStyles = { colour, size: "large" };
  const header = <Header styles={headerStyles} />;
  const footerStyles = { colour, size: "small" }; // ✅ 正确的：我们创建了一个新的值。
  const footer = <Footer styles={footerStyles} />;
  return (
    <>
      {header}
      <Content />
      {footer}
    </>
  );
}
```
