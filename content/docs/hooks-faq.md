---
id: hooks-faq
title: Hooks FAQ
permalink: docs/hooks-faq.html
prev: hooks-reference.html
---

*Hooks* 是 React 16.8 中加入的新特性。它可以让你无需编写 class 就能使用 state 和其它 React 特性。

这一页回答了一些关于 [Hooks](/docs/hooks-overview.html) 的常见问题。

<!--
  if you ever need to regenerate this, this snippet in the devtools console might help:

  $$('.anchor').map(a =>
    `${' '.repeat(2 * +a.parentNode.nodeName.slice(1))}` +
    `[${a.parentNode.textContent}](${a.getAttribute('href')})`
  ).join('\n')
-->

* **[采纳策略](#adoption-strategy)**
  * [哪个版本的 React 包含了 Hooks？](#which-versions-of-react-include-hooks)
  * [我需要重写我所有的组件吗？](#do-i-need-to-rewrite-all-my-class-components)
  * [有什么是 Hooks 能做到而 classes 做不到的？](#what-can-i-do-with-hooks-that-i-couldnt-with-classes)
  * [我的 React 知识还有多少是继续有用的？](#how-much-of-my-react-knowledge-stays-relevant)
  * [我应该使用 Hooks，classes，还是两者混用？](#should-i-use-hooks-classes-or-a-mix-of-both)
  * [Hooks 能否覆盖 classes 的所有使用场景？](#do-hooks-cover-all-use-cases-for-classes)
  * [Hooks 会替代 render props 和高阶组件吗？](#do-hooks-replace-render-props-and-higher-order-components)
  * [Hooks 对像 Redux connect() 和 React Router 等流行的 API 意味着什么？](#what-do-hooks-mean-for-popular-apis-like-redux-connect-and-react-router)
  * [Hooks 能和静态类型一起用吗？](#do-hooks-work-with-static-typing)
  * [如何测试使用了 Hooks 的组件？](#how-to-test-components-that-use-hooks)
  * [lint 规则具体强制了哪些内容？](#what-exactly-do-the-lint-rules-enforce)
* **[从 Classes 迁移到 Hooks](#from-classes-to-hooks)**
  * [生命周期方法要如何对应到 Hooks？](#how-do-lifecycle-methods-correspond-to-hooks)
  * [有类似实例变量的东西吗？](#is-there-something-like-instance-variables)
  * [我应该使用单个还是多个 state 变量？](#should-i-use-one-or-many-state-variables)
  * [我可以只在更新时运行一个 effect 吗？](#can-i-run-an-effect-only-on-updates)
  * [如何获取上一轮的 props 或 state？](#how-to-get-the-previous-props-or-state)
  * [我该如何实现 getDerivedStateFromProps？](#how-do-i-implement-getderivedstatefromprops)
  * [有类似 forceUpdate 的东西吗？](#is-there-something-like-forceupdate)
  * [我可以引用一个函数组件吗？](#can-i-make-a-ref-to-a-function-component)
  * [const [thing, setThing] = useState() 是什么意思？](#what-does-const-thing-setthing--usestate-mean)
* **[性能优化](#performance-optimizations)**
  * [我可以在更新时跳过一个 effect 吗？](#can-i-skip-an-effect-on-updates)
  * [我该如何实现 shouldComponentUpdate？](#how-do-i-implement-shouldcomponentupdate)
  * [如何记忆计算结果？](#how-to-memoize-calculations)
  * [如何惰性创建昂贵的对象？](#how-to-create-expensive-objects-lazily)
  * [Hooks 是否会因为在渲染时创建函数而显得慢？](#are-hooks-slow-because-of-creating-functions-in-render)
  * [如何避免向下传递回调？](#how-to-avoid-passing-callbacks-down)
  * [如何从 useCallback 读取一个经常变化的值？](#how-to-read-an-often-changing-value-from-usecallback)
* **[底层原理](#under-the-hood)**
  * [React 是如何把对 Hook 的调用和组件联系起来的？](#how-does-react-associate-hook-calls-with-components)
  * [Hooks 使用了哪些现有技术？](#what-is-the-prior-art-for-hooks)

## 采纳策略 {#adoption-strategy}

### 哪个版本的 React 包含了 Hooks？ {#which-versions-of-react-include-hooks}

从 16.8.0 开始，React 在以下模块中包含了 React Hooks 的稳定实现：

* React DOM
* React DOM Server
* React Test Renderer
* React Shallow Renderer

注意，**想要启用 Hooks，所有的 React 包需要 16.8.0 或更高版本**。如果你忘记更新的话 Hooks 是不会起作用的，比如说, React DOM。

React Native 会在它的下一个稳定发行版中全面支持 Hooks。

### 我需要重写我所有的组件吗？ {#do-i-need-to-rewrite-all-my-class-components}

不。我们并 [没有计划](/docs/hooks-intro.html#gradual-adoption-strategy) 从 React 中移除 classes —— 我们都需要不断的发布产品，重写不起。我们推荐在新代码中尝试 Hooks。

### 有什么是 Hooks 能做到而 classes 做不到的？ {#what-can-i-do-with-hooks-that-i-couldnt-with-classes}

Hooks 提供了强大而富有表现力的方式来在组件间复用功能。[「自定义 Hooks」](/docs/hooks-custom.html) 允许我们一瞥能做些什么。[这篇文章](https://medium.com/@dan_abramov/making-sense-of-react-hooks-fdbde8803889) 来自一位 React 核心团队的成员，深入剖析了 Hooks 解锁了哪些新的能力。

### 我的 React 知识还有多少是继续有用的？ {#how-much-of-my-react-knowledge-stays-relevant}

Hooks 是使用你已经知道的 React 特性的一种更直接的方式 —— 比如 state，生命周期，context，以及 refs。它们并没有从根本上改变 React 的工作方式，你对组件，props, 以及自顶向下的数据流的知识并没有改变。

Hooks 确实有它们自己的学习曲线。如果这份文档中遗失了一些什么，[提一个 issue](https://github.com/reactjs/reactjs.org/issues/new)，我们会尽可能地帮你。

### 我应该使用 Hooks，classes，还是两者混用？ {#should-i-use-hooks-classes-or-a-mix-of-both}

当你准备好了，我们鼓励你在新写的组件里开始尝试 Hooks。请确保你团队中的每个人都都愿意使用它们并且熟悉这份文档中的内容。我们不推荐用 Hooks 重写你已有的 classes，除非你本就打算重写它们。（例如：为了修复问题）。

你不能用 Hooks *替代* 一个 class 组件，但你绝对可以在一棵树里混用 classed 和使用了 Hooks 的函数组件。一个组件到底是一个 class 还是一个使用了 Hooks 的函数是哪个组件的实现细节。长远来看，我们期望 Hooks 能够成为人们编写 React 组件的主要方式。

### Hooks 能否覆盖 classes 的所有使用场景？ {#do-hooks-cover-all-use-cases-for-classes}

我们给 Hooks 设定的目标是尽早覆盖 classes 的所有使用场景。目前暂时还没有对应不常用的 `getSnapshotBeforeUpdate` 和 `componentDidCatch` 生命周期的 Hook 等价写法，但我们计划尽早把它们加进来。

目前 Hooks 还处于早期阶段，一些第三方的库可能还暂时无法兼容 Hooks。

### Hooks 会替代 render props 和高阶组件吗？ {#do-hooks-replace-render-props-and-higher-order-components}

通常，render props 和高阶组件只渲染一个子节点。我们认为让 Hooks 来服务这个使用场景更加简单。这两种模式仍有用武之地，（例如，一个虚拟滚动条组件或许会有一个 `renderItem` 属性，或是一个课件的容器组件或许会有它自己的 DOM 结构）。但在大部分场景下，Hooks 足够了，并且能够帮助减少嵌套。

### Hooks 对像 Redux connect() 和 React Router 等流行的 API 意味着什么？ {#what-do-hooks-mean-for-popular-apis-like-redux-connect-and-react-router}

你可以继续使用完全相同的 API；它们会继续工作的。

在未来，这些苦的新版本或许也会导出诸如 `useRedux()` 和 `useRouter()` 的自定义 Hooks 以允许你不需要包裹组件也能使用同样的特性。

### Hooks 能和静态类型一起用吗？ {#do-hooks-work-with-static-typing}

Hooks 在设计阶段就考虑了静态类型的问题。因为它们是函数，所以它们比像高阶组件这样的模式更易于设定正确的类型。最新版的 Flow 和 TypeScript React 定义已经包含了对 React Hooks 的支持。

重要的是，如果你想以某种更加严格的方式来指定类型，自定义 Hooks 能够给你限制 React API 的能力。React 给你的内容很原始，但你可以用和自带内容不同的方式去组合它们。

### 如何测试使用了 Hooks 的组件？ {#how-to-test-components-that-use-hooks}

在 React 看来，一个使用了 Hooks 的组件只不过是一个常规组件。如果你的测试方案不依赖于 React 的内部实现，测试带 Hooks 的组件应该和你通常测试组件的方式没什么差别。

举个例子，比如我们有这么个计数器组件：

```js
function Example() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

我们会使用 React DOM 来测试它。为了确保它表现得和在浏览器中一样，我们会把代码渲染的部分包裹起来，并更新为 [`ReactTestUtils.act()`](/docs/test-utils.html#act) 调用:

```js{3,20-22,29-31}
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import Counter from './Counter';

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it('can render and update a counter', () => {
  // 测试首次渲染和 effect
  act(() => {
    ReactDOM.render(<Counter />, container);
  });
  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('You clicked 0 times');
  expect(document.title).toBe('You clicked 0 times');

  // 测试第二次渲染和 effect
  act(() => {
    button.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });
  expect(label.textContent).toBe('You clicked 1 times');
  expect(document.title).toBe('You clicked 1 times');
});
```

对 `act()` 的调用也会清空它们内部的 Effects。

如果你需要测试一个自定义 Hook，你可以在你的测试代码中创建一个组件并在其中使用你的 Hook。然后你就可以测试你刚写的组件了。

为了减少不必要的模板项目，我们推荐使用 [`react-testing-library`](https://git.io/react-testing-library)，该项目被设计用来鼓励编写按照你的终端用户的方式来使用你的组件的测试。

### [lint 规则](https://www.npmjs.com/package/eslint-plugin-react-hooks)具体强制了哪些内容？ {#what-exactly-do-the-lint-rules-enforce}

我们提供了一个 [ESLint 插件](https://www.npmjs.com/package/eslint-plugin-react-hooks) 来强制 [Hooks 规范](/docs/hooks-rules.html) 以避免 Bugs。它假设任何以 「`use`」 开头并紧跟着一个大写字母的函数就是一个 Hook。我们知道这种启发方式并不完美，甚至存在一些伪真理，但如果没有一个全生态范围的约定就没法让 Hooks 很好的工作 —— 而名字太长会让人要么不愿意采用 Hooks，要么不愿意遵守约定。

规范尤其强制了以下内容：

* 对 Hooks 的调用要么在一个`大驼峰法`命名的函数内部（视作一个组件）或另一个 `useSomething` 函数（视作一个自定义 Hook）。
* Hooks 在每次渲染时都按照相同的顺序被调用。

还有一些其他的启发方式，但随着我们不断地调优以在发现 Bugs 和避免伪真理之前取得平衡，这些方式随时会改变。

## 从 Classes 迁移到 Hooks {#from-classes-to-hooks}

### 生命周期方法要如何对应到 Hooks？ {#how-do-lifecycle-methods-correspond-to-hooks}

* `constructor`：函数组件不需要构造函数。你可以通过调用 [`useState`](/docs/hooks-reference.html#usestate) 来初始化 state。如果计算的代价比较昂贵，你可以传一个函数给 `useState`。

* `getDerivedStateFromProps`：改为 [在渲染时](#how-do-i-implement-getderivedstatefromprops) 安排一次更新。

* `shouldComponentUpdate`：详见 [下方](#how-do-i-implement-shouldcomponentupdate) `React.memo`.

* `render`：这是函数组件体本身。

* `componentDidMount`, `componentDidUpdate`, `componentWillUnmount`：[`useEffect` Hook](/docs/hooks-reference.html#useeffect) 可以表达所有这些(包括 [不那么](#can-i-skip-an-effect-on-updates) [常见](#can-i-run-an-effect-only-on-updates) 的场景)的组合。

* `componentDidCatch` and `getDerivedStateFromError`：目前还没有这些方法的 Hook 等价写法，但很快会加上。

### 有类似实例变量的东西吗？ {#is-there-something-like-instance-variables}

有！[`useRef()`](/docs/hooks-reference.html#useref) Hook 不仅可以用于 DOM refs。「ref」 对象是一个 `current` 属性可变且可以容纳任意值的通用容器，类似于一个 class 的实例属性。

你可以在 `useEffect` 内部对其进行写入:

```js{2,8}
function Timer() {
  const intervalRef = useRef();

  useEffect(() => {
    const id = setInterval(() => {
      // ...
    });
    intervalRef.current = id;
    return () => {
      clearInterval(intervalRef.current);
    };
  });

  // ...
}
```

如果我们只是想设定一个循环定时器，我们不会需要这个 ref（`id` 可以是在 effect 本地的），但如果我们想要在一个事件处理器中清除这个循环定时器的话这就很有用了：

```js{3}
  // ...
  function handleCancelClick() {
    clearInterval(intervalRef.current);
  }
  // ...
```

从概念上讲，你可以认为 refs 就像是一个 class 的实例变量。除非你正在做 [懒加载](#how-to-create-expensive-objects-lazily)，否则避免在渲染期间设置 refs —— 这可能会导致意外的行为。相反的，通常你应该在事件处理器和 effects 中修改 refs。

### 我应该使用单个还是多个 state 变量？ {#should-i-use-one-or-many-state-variables}

如果你之前用过 classes，你或许会试图总是在一次 `useState()` 调用中传入一个包含了所有 state 的对象。如果你愿意的话你可以这么做。这里有一个跟踪鼠标移动的组件的例子。我们在本地 state 中记录它的位置和尺寸：

```js
function Box() {
  const [state, setState] = useState({ left: 0, top: 0, width: 100, height: 100 });
  // ...
}
```

现在假设我们想要编写一些逻辑以便在用户移动鼠标时改变 `left` 和 `top`。注意到我们是如何必须手动把这些字段合并到之前的 state 对象的：

```js{4,5}
// ...
  useEffect(() => {
    function handleWindowMouseMove(e) {
      // 展开 「...state」 以确保我们没有 「丢失」 width 和 height
      setState(state => ({ ...state, left: e.pageX, top: e.pageY }));
    }
    // 注意：这是个简化版的实现
    window.addEventListener('mousemove', handleWindowMouseMove);
    return () => window.removeEventListener('mousemove', handleWindowMouseMove);
  }, []);
  // ...
```

这是因为当我们更新一个 state 变量，我们会 *替换* 它的值。这和 class 中的 `this.setState` 不一样，后者会把更新后的字段 *合并* 入对象中。

如果你怀念自动合并，你可以写一个自定义的 `useLegacyState` Hook 来合并对象 state 的更新。然而However, instead **we recommend to split state into multiple state variables based on which values tend to change together.**

举个例子，我们可以把组件的 state 拆分为 `position` 和 `size` 两个对象，并永远以非合并的方式去替换 `position`：

```js{2,7}
function Box() {
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const [size, setSize] = useState({ width: 100, height: 100 });

  useEffect(() => {
    function handleWindowMouseMove(e) {
      setPosition({ left: e.pageX, top: e.pageY });
    }
    // ...
```

把独立的 state 变量拆分开还有另外的好处。这使得后期把一些相关的逻辑抽取到一个自定义 Hook 变得容易，比如说:

```js{2,7}
function Box() {
  const position = useWindowPosition();
  const [size, setSize] = useState({ width: 100, height: 100 });
  // ...
}

function useWindowPosition() {
  const [position, setPosition] = useState({ left: 0, top: 0 });
  useEffect(() => {
    // ...
  }, []);
  return position;
}
```

注意看我们是如何做到把对 `position` 这个 state 变量的 `useState` 调用和相关的 effect 移动到一个自定义 custom Hook 但不改变它们的代码的。如果所有的 state 都存在同一个对象中，想要抽取出来就比较难了。

把所有 state 都放在同一个 `useState` 调用中，或是每一个字段都对应一个 `useState` 调用，这两方式都能跑通。当你在这两个极端之间找到平衡，然后把相关 state 组合到几个独立的 state 变量时，组件就会更加的可读。如果 state 的逻辑开始变得复杂，我们推荐 [用 reducer 来管理它](/docs/hooks-reference.html#usereducer)，或使用自定义 Hook。

### 我可以只在更新时运行一个 effect 吗？ {#can-i-run-an-effect-only-on-updates}

这是个比较罕见的使用场景。如果你需要的话，你可以 [使用一个可变的 ref](#is-there-something-like-instance-variables) 来手动存储一个布尔值来表示时首次渲染还是后续渲染，然后在你的 effect 中检查这个标识。（如果你发现自己经常在这么做，你可以为之创建一个自定义 Hook。）

### 如何获取上一轮的 props 或 state？ {#how-to-get-the-previous-props-or-state}

目前，你可以 [通过 ref](#is-there-something-like-instance-variables) 来手动实现：

```js{6,8}
function Counter() {
  const [count, setCount] = useState(0);

  const prevCountRef = useRef();
  useEffect(() => {
    prevCountRef.current = count;
  });
  const prevCount = prevCountRef.current;

  return <h1>Now: {count}, before: {prevCount}</h1>;
}
```

这或许有一点错综复杂，但你可以把它抽取成一个自定义 Hook：

```js{3,7}
function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);
  return <h1>Now: {count}, before: {prevCount}</h1>;
}

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
```

注意看这是如何作用于 props， state，或任何其他计算出来的值的。

```js{5}
function Counter() {
  const [count, setCount] = useState(0);

  const calculation = count * 100;
  const prevCalculation = usePrevious(calculation);
  // ...
```

考虑到这是一个相对常见的使用场景，很可能在未来 React 会自带一个 `usePrevious` Hook。

参见 [derived state 推荐模式](#how-do-i-implement-getderivedstatefromprops).

### 我该如何实现 `getDerivedStateFromProps`？ {#how-do-i-implement-getderivedstatefromprops}

尽管你可能 [不需要它](/blog/2018/06/07/you-probably-dont-need-derived-state.html)，但在一些罕见的你需要用到的场景下（比如实现一个 `<Transition>` 组件），你可以在渲染过程中更新 state 。React 会立即退出第一次渲染并用更新后的 state 重新运行组件以避免耗费太多性能。

这里我们把 `row` prop 上一轮的值存在一个 state 变量中以便比较：

```js
function ScrollView({row}) {
  let [isScrollingDown, setIsScrollingDown] = useState(false);
  let [prevRow, setPrevRow] = useState(null);

  if (row !== prevRow) {
    // Row 自上次渲染以来发生过改变。更新 isScrollingDown。
    setIsScrollingDown(prevRow !== null && row > prevRow);
    setPrevRow(row);
  }

  return `Scrolling down: ${isScrollingDown}`;
}
```

初看这或许有点奇怪，但渲染期间的一次更新恰恰就是 `getDerivedStateFromProps` 一直以来的概念。

### 有类似 forceUpdate 的东西吗？ {#is-there-something-like-forceupdate}

如果前后两次的值相同，`useState` 和 `useReducer` Hooks [都会放弃更新](/docs/hooks-reference.html#bailing-out-of-a-state-update)。原地修改 state 并调用 `setState` 不会引起重新渲染。

通常，你不应该在 React 中修改本地 state。然而，作为一条出路，你可以用一个增长的计数器来在 state 没变的时候依然强制一次重新渲染：

```js
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  function handleClick() {
    forceUpdate();
  }
```

可能的话尽量避免这种模式。

### 我可以引用一个函数组件吗？ {#can-i-make-a-ref-to-a-function-component}

尽管你不应该经常需要这么做，但你可以通过 [`useImperativeHandle`](/docs/hooks-reference.html#useimperativehandle) Hook 暴露一些命令式的方法给父组件。

### `const [thing, setThing] = useState()` 是什么意思？ {#what-does-const-thing-setthing--usestate-mean}

如果你不熟悉这个语法，可以查看 State Hook 文档中的 [解释](/docs/hooks-state.html#tip-what-do-square-brackets-mean) 一节。


## 性能优化 {#performance-optimizations}

### 我可以在更新时跳过一个 effect 吗？ {#can-i-skip-an-effect-on-updates}

可以的。参见 [条件式的发起一个 effect](/docs/hooks-reference.html#conditionally-firing-an-effect)。注意，忘记处理更新常会 [导致 bugs](/docs/hooks-effect.html#explanation-why-effects-run-on-each-update)，这就是不以此为默认行为的原因。

### 我该如何实现 `shouldComponentUpdate`? {#how-do-i-implement-shouldcomponentupdate}

你可以用 `React.memo` 包裹一个组件来对它的 props 进行浅比较：

```js
const Button = React.memo((props) => {
  // 你的组件
});
```

这不是一个 Hook 因为它的写法和 Hooks 不同。`React.memo` 等效于 `PureComponent`，但它之比较 props。（你也可以通过第二个参数指定一个自定义的比较函数来比较新旧 props。如果函数返回 true，就会跳过更新。）

`React.memo` 不比较 state 因为没有单一的 state 对象可供比较。但你也可以让子节点变为纯组件，或者针织 [用 `useMemo` 优化每一个具体的子节点](/docs/hooks-faq.html#how-to-memoize-calculations)。


### 如何记忆计算结果？ {#how-to-memoize-calculations}

[`useMemo`](/docs/hooks-reference.html#usememo) Hook 允许你通过「记住」上一次计算结果的方式在多次渲染的之间缓存计算结果：

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

这行代码会调用 `computeExpensiveValue(a, b)`。但如果输入 `[a, b]` 自上次值以来没有改变过，`useMemo` 会跳过再一次的调用，简单复用它上一次返回的值。

记住，传给 `useMemo` 的函数是在渲染期间运行的。不要在其中做任何你通常不会在渲染期间做的事。举个例子，副作用属于 `useEffect`，而不是 `useMemo`。

**你可以把 `useMemo` 作为一种性能优化的手段，但不要把它当做一种语义上的保证。**未来，React 可能会渲染「忘掉」一些之前记住的值并在下一次渲染时重新计算它们，比如为离屏组件释放内存。建议自己编写相关代码以便没有 `useMemo` 也能正常工作 —— 然后把它加入性能优化。（在某些取值必须 *从不* 被重新计算的罕见场景，你可以 [惰性初始化](#how-to-create-expensive-objects-lazily) 一个 ref。）

方便起见，`useMemo` 也允许你跳过一次子节点的昂贵的重新渲染：

```js
function Parent({ a, b }) {
  // Only re-rendered if `a` changes:
  const child1 = useMemo(() => <Child1 a={a} />, [a]);
  // Only re-rendered if `b` changes:
  const child2 = useMemo(() => <Child2 b={b} />, [b]);
  return (
    <>
      {child1}
      {child2}
    </>
  )
}
```

注意这种方式在循环中是无效的，因为 Hook 调用 [不能](/docs/hooks-rules.html) 被放在循环中。但你可以为列表项抽取一个单独的组件，并在其中调用 `useMemo`。

### 如何惰性创建昂贵的对象？ {#how-to-create-expensive-objects-lazily}

如果输入的内容相同，`useMemo` 允许你 [记住一次昂贵的计算](#how-to-memoize-calculations)。但是，这仅作为一种提示，并不 *保证* 计算不会重新运行。但有时候需要确保一个对象仅被创建一次。

**第一个常见的使用场景是当创建初始 state 很昂贵时：**

```js
function Table(props) {
  // ⚠️ createRows() 每次渲染都会被调用
  const [rows, setRows] = useState(createRows(props.count));
  // ...
}
```

为避免重新创建被忽略的初始 state，我们可以传一个 **函数** 给 `useState`：

```js
function Table(props) {
  // ✅ createRows() 只会被调用一次
  const [rows, setRows] = useState(() => createRows(props.count));
  // ...
}
```

React 只会在首次渲染时调用这个函数。参见 [`useState` API 参考](/docs/hooks-reference.html#usestate)。

**你或许也会偶尔想要避免重新创建 `useRef()` 的初始值。**举个例子，或许你想确保某些命令式的 class 实例只被创建一次：

```js
function Image(props) {
  // ⚠️ IntersectionObserver 在每次渲染都会被创建
  const ref = useRef(new IntersectionObserver(onIntersect));
  // ...
}
```

`useRef` **不会** 像 `useState` 那样接受一个特殊的函数重载。相反，你可以辨析你自己的函数来创建并将其设为惰性的：

```js
function Image(props) {
  const ref = useRef(null);

  // ✅ IntersectionObserver 只会被惰性创建一次
  function getObserver() {
    let observer = ref.current;
    if (observer !== null) {
      return observer;
    }
    let newObserver = new IntersectionObserver(onIntersect);
    ref.current = newObserver;
    return newObserver;
  }

  // 当你需要时，调用 getObserver()
  // ...
}
```

这避免了创建一个昂贵的对象直到它首次被真正需要。如果你使用 Flow 或 TypeScript，你还可以为了方便给 `getObserver()` 一个不可为 null 的类型。


### Hooks 是否会因为在渲染时创建函数而显得慢？ {#are-hooks-slow-because-of-creating-functions-in-render}

不会。在现代浏览器中，闭包和类的原始性能只有在极端场景下才会有明显的差别。

除此之外，可以认为 Hooks 的设计在某些方面更加高效：

* Hooks 避免了 classes 需要的额外开支，像是创建类实例和在构造函数中绑定事件处理器的成本。

* **符合语言习惯的代码在使用 Hooks 时不需要很深的组件树嵌套**。这个现象在使用高阶组件、render props、和 context 的代码库中非常普遍。组件树小了，React 的工作量也随之减少。

传统上认为，在 React 中使用内联函数对性能的影响与在每次渲染时传递新的回调是如何破坏子组件的 `shouldComponentUpdate` 优化的有关。 Hooks 从三个方面解决了这个问题。

* [`useCallback`](/docs/hooks-reference.html#usecallback) Hook 允许你在重新渲染之间保持对相同的回调引用以使得 `shouldComponentUpdate` 继续工作：

    ```js{2}
    // 除非 `a` 或 `b` 改变，否则不会变
    const memoizedCallback = useCallback(() => {
      doSomething(a, b);
    }, [a, b]);
    ```

* [`useMemo` Hook](/docs/hooks-faq.html#how-to-memoize-calculations) 使控制具体子节点何时更新变得更容易，减少了对纯组件的需要。

* 最后，`useReducer` Hook 减少了对深层传递回调的需要，就如下面解释的那样。

### 如何避免向下传递回调？ {#how-to-avoid-passing-callbacks-down}

我们已经发现大部分人并不喜欢在组件树的每一层手动传递回调。尽管这种写法更明确，但这给人感觉像错综负责的管道工程一样麻烦。

在大型的组件树中，我们推荐的替代方案是通过 context 用 [`useReducer`](/docs/hooks-reference.html#usereducer) 往下传一个 `dispatch` 函数：

```js{4,5}
const TodosDispatch = React.createContext(null);

function TodosApp() {
<<<<<<< HEAD
  // 提示：`dispatch` 不会在重新渲染之间变化
=======
  // Note: `dispatch` won't change between re-renders
>>>>>>> master
  const [todos, dispatch] = useReducer(todosReducer);

  return (
    <TodosDispatch.Provider value={dispatch}>
      <DeepTree todos={todos} />
    </TodosDispatch.Provider>
  );
}
```

`TodosApp` 内部组件树里的任何子节点都可以使用 `dispatch` 函数来向上传递 actions 到 `TodosApp`：

```js{2,3}
function DeepChild(props) {
  // 如果我们想要执行一个 action，我们可以从 context 中获取 dispatch。
  const dispatch = useContext(TodosDispatch);

  function handleClick() {
    dispatch({ type: 'add', text: 'hello' });
  }

  return (
    <button onClick={handleClick}>Add todo</button>
  );
}
```

总而言之，从维护的角度来这样看更加方便（不用不断转发回调），同时也避免了回调的问题。像这样向下传递 `dispatch` 是处理深度更新的推荐模式。

注意，你依然可以选择是要把应用的 *state* 作为 props 向下传递（更显明确）还是作为作为 context（对很深的更新而言更加方便）。如果你也使用 context 来向下传递 state，请使用两种不同的 context 类型 —— `dispatch` context 永远不会变，因此组件通过读取它就不需要重新渲染了，除非它们还需要应用的 state。

### 如何从 `useCallback` 读取一个经常变化的值？ {#how-to-read-an-often-changing-value-from-usecallback}

>注意
>
>我们推荐 [在 context 中向下传递 `dispatch`](#how-to-avoid-passing-callbacks-down) 而非在 props 中使用独立的回调。下面的方法仅仅出于文档完整性考虑，以及作为一条出路在此提及。
>
>同时也请注意这种模式在 [并行模式](/blog/2018/03/27/update-on-async-rendering.html) 下可能会导致一些问题。我们计划在未来提供一个更加符合人体工程学的太呆方案，但当下最安全的解决方案是，如果回调所依赖的值变化了，总是让回调失效。

在某些罕见场景中，你可能会需要用 [`useCallback`](/docs/hooks-reference.html#usecallback) 记住一个回调，但由于内部函数必须经常重新创建，记忆效果不是很好。如果你想要记住的函数是一个事件处理器并且在渲染期间没有被用到，你可以 [把 ref 当做实例变量](#is-there-something-like-instance-variables) 来用，并手动把最后提交的值保存在它当中：

```js{6,10}
function Form() {
  const [text, updateText] = useState('');
  const textRef = useRef();

  useLayoutEffect(() => {
    textRef.current = text; // 把它写入 ref
  });

  const handleSubmit = useCallback(() => {
    const currentText = textRef.current; // 从 ref 读取它
    alert(currentText);
  }, [textRef]); // 不要像 [text] 那样重新创建 handleSubmit

  return (
    <>
      <input value={text} onChange={e => updateText(e.target.value)} />
      <ExpensiveTree onSubmit={handleSubmit} />
    </>
  );
}
```

这是一个比较麻烦的模式，但这表示如果你需要的话你可以用这条出路进行优化。如果你把它抽取成一个自定义 Hook 的话会更加好受些：

```js{4,16}
function Form() {
  const [text, updateText] = useState('');
  // 即便 `text` 变了也会被记住:
  const handleSubmit = useEventCallback(() => {
    alert(text);
  }, [text]);

  return (
    <>
      <input value={text} onChange={e => updateText(e.target.value)} />
      <ExpensiveTree onSubmit={handleSubmit} />
    </>
  );
}

function useEventCallback(fn, dependencies) {
  const ref = useRef(() => {
    throw new Error('Cannot call an event handler while rendering.');
  });

  useLayoutEffect(() => {
    ref.current = fn;
  }, [fn, ...dependencies]);

  return useCallback(() => {
    const fn = ref.current;
    return fn();
  }, [ref]);
}
```

无论是和，我们都 **不推荐使用这种模式** 并仅处于文档文整形而把它展示在这里。相反的，我们更倾向于 [避免很深的向下传递回调](#how-to-avoid-passing-callbacks-down)。


## 底层原理 {#under-the-hood}

### React 是如何把对 Hook 的调用和组件联系起来的？ {#how-does-react-associate-hook-calls-with-components}

React 保持对当先渲染中的组件的追踪。多亏了 [Hooks 规范](/docs/hooks-rules.html)，我们得知 Hooks 只会在 React 组件中被调用（或自定义 Hooks —— 同样只会在 React 组件中被调用）。

每个组件内部都有一个「记忆单元格」列表。它们只不过是我们用来存储一些数据的 JavaScript 对象。当你用 `useState()` 调用一个 Hook 的时候，它会读取当前的单元格（或在首次渲染时将其初始化），让后把指针移动到下一个。这就是多个 `useState()` 调用会得到各自独立的本地 state 的原因。

### Hooks 使用了哪些现有技术？ {#what-is-the-prior-art-for-hooks}

Hooks 从多个不同的来源合成想法：

* [react-future](https://github.com/reactjs/react-future/tree/master/07%20-%20Returning%20State) 这个仓库中我们对函数式 APIs 的老旧实验。
* React 社区对 render prop APIs 的实验，包括 [Ryan Florence](https://github.com/ryanflorence) 的 [Reactions Component](https://github.com/reactions/component)。
* [Dominic Gannaway](https://github.com/trueadm) 的用 [`adopt` 关键字](https://gist.github.com/trueadm/17beb64288e30192f3aa29cad0218067) 作为 render props 的语法糖的提案。
* [DisplayScript](http://displayscript.org/introduction.html) 中的 state 变量和 state 单元格。
* ReasonReact 中的 [Reducer components](https://reasonml.github.io/reason-react/docs/en/state-actions-reducer.html)。
* Rx 中的 [Subscriptions](http://reactivex.io/rxjs/class/es6/Subscription.js~Subscription.html)。
* 多核 OCaml 中的 [Algebraic effects](https://github.com/ocamllabs/ocaml-effects-tutorial#2-effectful-computations-in-a-pure-setting)。

[Sebastian Markbåge](https://github.com/sebmarkbage) 想到了 Hooks 最初的设计，后来经过 [Andrew Clark](https://github.com/acdlite)，[Sophie Alpert](https://github.com/sophiebits)，[Dominic Gannaway](https://github.com/trueadm)，和 React 团队的其它成员的提炼。