---
id: hooks-faq
title: Hooks FAQ
permalink: docs/hooks-faq.html
prev: hooks-reference.html
---

*Hooks* 是 React 16.8 中加入的新特性。它可以让你在 class 以外使用 state 和其它 React 特性。

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
  * [我应该使用 Hooks， classes， 还是两者混用？](#should-i-use-hooks-classes-or-a-mix-of-both)
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
  * [我可以只有在更新时运行一个效果吗？](#can-i-run-an-effect-only-on-updates)
  * [如何获取之前的 props 或 state？](#how-to-get-the-previous-props-or-state)
  * [我改如何实现 getDerivedStateFromProps？](#how-do-i-implement-getderivedstatefromprops)
  * [有类似 forceUpdate 的东西吗？](#is-there-something-like-forceupdate)
  * [我可以引用一个函数组件吗？](#can-i-make-a-ref-to-a-function-component)
  * [const [thing, setThing] = useState() 是什么意思？](#what-does-const-thing-setthing--usestate-mean)
* **[性能优化](#performance-optimizations)**
  * [我能在更新时跳过一个效果吗？](#can-i-skip-an-effect-on-updates)
  * [我该如何实现 shouldComponentUpdate？](#how-do-i-implement-shouldcomponentupdate)
  * [如何记忆计算结果？](#how-to-memoize-calculations)
  * [如何惰性创建昂贵的对象？](#how-to-create-expensive-objects-lazily)
  * [Hooks 是否会因为在渲染时创建函数而显得慢？](#are-hooks-slow-because-of-creating-functions-in-render)
  * [如何避免向下传递回调？](#how-to-avoid-passing-callbacks-down)
  * [如何从 useCallback 读取一个经常变化的值？](#how-to-read-an-often-changing-value-from-usecallback)
* **[背后的原理](#under-the-hood)**
  * [React 是如何把对 Hook 的调用和组件联系起来的？](#how-does-react-associate-hook-calls-with-components)
  * [Hooks 使用了哪些现有技术](#what-is-the-prior-art-for-hooks)

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

### 我应该使用 Hooks， classes， 还是两者混用？ {#should-i-use-hooks-classes-or-a-mix-of-both}

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
  // Test first render and effect
  act(() => {
    ReactDOM.render(<Counter />, container);
  });
  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('You clicked 0 times');
  expect(document.title).toBe('You clicked 0 times');

  // Test second render and effect
  act(() => {
    button.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });
  expect(label.textContent).toBe('You clicked 1 times');
  expect(document.title).toBe('You clicked 1 times');
});
```

对 `act()` 的调用也会清空它们内部的效果。

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

如果我们只是想设定一个循环定时器，我们不会需要这个 ref（`id` 可以是在效果本地的），但如果我们想要在一个事件处理器中清除这个循环定时器的话这就很有用了：

```js{3}
  // ...
  function handleCancelClick() {
    clearInterval(intervalRef.current);
  }
  // ...
```

从概念上讲，你可以认为 refs 就像是一个 class 的实例变量。除非你正在做 [懒加载](#how-to-create-expensive-objects-lazily)，否则避免在渲染期间设置 refs —— 这可能会导致意外的行为。Instead, typically you want to modify refs in event handlers and effects.

### Should I use one or many state variables? {#should-i-use-one-or-many-state-variables}

If you're coming from classes, you might be tempted to always call `useState()` once and put all state into a single object. You can do it if you'd like. Here is an example of a component that follows the mouse movement. We keep its position and size in the local state:

```js
function Box() {
  const [state, setState] = useState({ left: 0, top: 0, width: 100, height: 100 });
  // ...
}
```

Now let's say we want to write some logic that changes `left` and `top` when the user moves their mouse. Note how we have to merge these fields into the previous state object manually:

```js{4,5}
  // ...
  useEffect(() => {
    function handleWindowMouseMove(e) {
      // Spreading "...state" ensures we don't "lose" width and height
      setState(state => ({ ...state, left: e.pageX, top: e.pageY }));
    }
    // Note: this implementation is a bit simplified
    window.addEventListener('mousemove', handleWindowMouseMove);
    return () => window.removeEventListener('mousemove', handleWindowMouseMove);
  }, []);
  // ...
```

This is because when we update a state variable, we *replace* its value. This is different from `this.setState` in a class, which *merges* the updated fields into the object.

If you miss automatic merging, you can write a custom `useLegacyState` Hook that merges object state updates. However, instead **we recommend to split state into multiple state variables based on which values tend to change together.**

For example, we could split our component state into `position` and `size` objects, and always replace the `position` with no need for merging:

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

Separating independent state variables also has another benefit. It makes it easy to later extract some related logic into a custom Hook, for example:

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

Note how we were able to move the `useState` call for the `position` state variable and the related effect into a custom Hook without changing their code. If all state was in a single object, extracting it would be more difficult.

Both putting all state in a single `useState` call, and having a `useState` call per each field can work. Components tend to be most readable when you find a balance between these two extremes, and group related state into a few independent state variables. If the state logic becomes complex, we recommend [managing it with a reducer](/docs/hooks-reference.html#usereducer) or a custom Hook.

### Can I run an effect only on updates? {#can-i-run-an-effect-only-on-updates}

This is a rare use case. If you need it, you can [use a mutable ref](#is-there-something-like-instance-variables) to manually store a boolean value corresponding to whether you are on the first or a subsequent render, then check that flag in your effect. (If you find yourself doing this often, you could create a custom Hook for it.)

### How to get the previous props or state? {#how-to-get-the-previous-props-or-state}

Currently, you can do it manually [with a ref](#is-there-something-like-instance-variables):

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

This might be a bit convoluted but you can extract it into a custom Hook:

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

Note how this would work for props, state, or any other calculated value.

```js{5}
function Counter() {
  const [count, setCount] = useState(0);

  const calculation = count * 100;
  const prevCalculation = usePrevious(calculation);
  // ...
```

It's possible that in the future React will provide a `usePrevious` Hook out of the box since it's a relatively common use case.

See also [the recommended pattern for derived state](#how-do-i-implement-getderivedstatefromprops).

### How do I implement `getDerivedStateFromProps`? {#how-do-i-implement-getderivedstatefromprops}

While you probably [don't need it](/blog/2018/06/07/you-probably-dont-need-derived-state.html), in rare cases that you do (such as implementing a `<Transition>` component), you can update the state right during rendering. React will re-run the component with updated state immediately after exiting the first render so it wouldn't be expensive.

Here, we store the previous value of the `row` prop in a state variable so that we can compare:

```js
function ScrollView({row}) {
  let [isScrollingDown, setIsScrollingDown] = useState(false);
  let [prevRow, setPrevRow] = useState(null);

  if (row !== prevRow) {
    // Row changed since last render. Update isScrollingDown.
    setIsScrollingDown(prevRow !== null && row > prevRow);
    setPrevRow(row);
  }

  return `Scrolling down: ${isScrollingDown}`;
}
```

This might look strange at first, but an update during rendering is exactly what `getDerivedStateFromProps` has always been like conceptually.

### Is there something like forceUpdate? {#is-there-something-like-forceupdate}

Both `useState` and `useReducer` Hooks [bail out of updates](/docs/hooks-reference.html#bailing-out-of-a-state-update) if the next value is the same as the previous one. Mutating state in place and calling `setState` will not cause a re-render.

Normally, you shouldn't mutate local state in React. However, as an escape hatch, you can use an incrementing counter to force a re-render even if the state has not changed:

```js
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  function handleClick() {
    forceUpdate();
  }
```

Try to avoid this pattern if possible.

### Can I make a ref to a function component? {#can-i-make-a-ref-to-a-function-component}

While you shouldn't need this often, you may expose some imperative methods to a parent component with the [`useImperativeHandle`](/docs/hooks-reference.html#useimperativehandle) Hook.

### What does `const [thing, setThing] = useState()` mean? {#what-does-const-thing-setthing--usestate-mean}

If you're not familiar with this syntax, check out the [explanation](/docs/hooks-state.html#tip-what-do-square-brackets-mean) in the State Hook documentation.


## Performance Optimizations {#performance-optimizations}

### Can I skip an effect on updates? {#can-i-skip-an-effect-on-updates}

Yes. See [conditionally firing an effect](/docs/hooks-reference.html#conditionally-firing-an-effect). Note that forgetting to handle updates often [introduces bugs](/docs/hooks-effect.html#explanation-why-effects-run-on-each-update), which is why this isn't the default behavior.

### How do I implement `shouldComponentUpdate`? {#how-do-i-implement-shouldcomponentupdate}

You can wrap a function component with `React.memo` to shallowly compare its props:

```js
const Button = React.memo((props) => {
  // your component
});
```

It's not a Hook because it doesn't compose like Hooks do. `React.memo` is equivalent to `PureComponent`, but it only compares props. (You can also add a second argument to specify a custom comparison function that takes the old and new props. If it returns true, the update is skipped.)

`React.memo` doesn't compare state because there is no single state object to compare. But you can make children pure too, or even [optimize individual children with `useMemo`](/docs/hooks-faq.html#how-to-memoize-calculations).


### How to memoize calculations? {#how-to-memoize-calculations}

The [`useMemo`](/docs/hooks-reference.html#usememo) Hook lets you cache calculations between multiple renders by "remembering" the previous computation:

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

This code calls `computeExpensiveValue(a, b)`. But if the inputs `[a, b]` haven't changed since the last value, `useMemo` skips calling it a second time and simply reuses the last value it returned.

Remember that the function passed to `useMemo` runs during rendering. Don't do anything there that you wouldn't normally do while rendering. For example, side effects belong in `useEffect`, not `useMemo`.

**You may rely on `useMemo` as a performance optimization, not as a semantic guarantee.** In the future, React may choose to "forget" some previously memoized values and recalculate them on next render, e.g. to free memory for offscreen components. Write your code so that it still works without `useMemo` — and then add it to optimize performance. (For rare cases when a value must *never* be recomputed, you can [lazily initialize](#how-to-create-expensive-objects-lazily) a ref.)

Conveniently, `useMemo` also lets you skip an expensive re-render of a child:

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

Note that this approach won't work in a loop because Hook calls [can't](/docs/hooks-rules.html) be placed inside loops. But you can extract a separate component for the list item, and call `useMemo` there.

### How to create expensive objects lazily? {#how-to-create-expensive-objects-lazily}

`useMemo` lets you [memoize an expensive calculation](#how-to-memoize-calculations) if the inputs are the same. However, it only serves as a hint, and doesn't *guarantee* the computation won't re-run. But sometimes need to be sure an object is only created once.

**The first common use case is when creating the initial state is expensive:**

```js
function Table(props) {
  // ⚠️ createRows() is called on every render
  const [rows, setRows] = useState(createRows(props.count));
  // ...
}
```

To avoid re-creating the ignored initial state, we can pass a **function** to `useState`:

```js
function Table(props) {
  // ✅ createRows() is only called once
  const [rows, setRows] = useState(() => createRows(props.count));
  // ...
}
```

React will only call this function during the first render. See the [`useState` API reference](/docs/hooks-reference.html#usestate).

**You might also occasionally want to avoid re-creating the `useRef()` initial value.** For example, maybe you want to ensure some imperative class instance only gets created once:

```js
function Image(props) {
  // ⚠️ IntersectionObserver is created on every render
  const ref = useRef(new IntersectionObserver(onIntersect));
  // ...
}
```

`useRef` **does not** accept a special function overload like `useState`. Instead, you can write your own function that creates and sets it lazily:

```js
function Image(props) {
  const ref = useRef(null);

  // ✅ IntersectionObserver is created lazily once
  function getObserver() {
    let observer = ref.current;
    if (observer !== null) {
      return observer;
    }
    let newObserver = new IntersectionObserver(onIntersect);
    ref.current = newObserver;
    return newObserver;
  }

  // When you need it, call getObserver()
  // ...
}
```

This avoids creating an expensive object until it's truly needed for the first time. If you use Flow or TypeScript, you can also give `getObserver()` a non-nullable type for convenience.


### Are Hooks slow because of creating functions in render? {#are-hooks-slow-because-of-creating-functions-in-render}

No. In modern browsers, the raw performance of closures compared to classes doesn't differ significantly except in extreme scenarios.

In addition, consider that the design of Hooks is more efficient in a couple ways:

* Hooks avoid a lot of the overhead that classes require, like the cost of creating class instances and binding event handlers in the constructor.

* **Idiomatic code using Hooks doesn't need the deep component tree nesting** that is prevalent in codebases that use higher-order components, render props, and context. With smaller component trees, React has less work to do.

Traditionally, performance concerns around inline functions in React have been related to how passing new callbacks on each render breaks `shouldComponentUpdate` optimizations in child components. Hooks approach this problem from three sides.

* The [`useCallback`](/docs/hooks-reference.html#usecallback) Hook lets you keep the same callback reference between re-renders so that `shouldComponentUpdate` continues to work:

    ```js{2}
    // Will not change unless `a` or `b` changes
    const memoizedCallback = useCallback(() => {
      doSomething(a, b);
    }, [a, b]);
    ```

* The [`useMemo` Hook](/docs/hooks-faq.html#how-to-memoize-calculations) makes it easier to control when individual children update, reducing the need for pure components.

* Finally, the `useReducer` Hook reduces the need to pass callbacks deeply, as explained below.

### How to avoid passing callbacks down? {#how-to-avoid-passing-callbacks-down}

We've found that most people don't enjoy manually passing callbacks through every level of a component tree. Even though it is more explicit, it can feel like a lot of "plumbing".

In large component trees, an alternative we recommend is to pass down a `dispatch` function from [`useReducer`](/docs/hooks-reference.html#usereducer) via context:

```js{4,5}
const TodosDispatch = React.createContext(null);

function TodosApp() {
  // Tip: `dispatch` won't change between re-renders
  const [todos, dispatch] = useReducer(todosReducer);

  return (
    <TodosDispatch.Provider value={dispatch}>
      <DeepTree todos={todos} />
    </TodosDispatch.Provider>
  );
}
```

Any child in the tree inside `TodosApp` can use the `dispatch` function to pass actions up to `TodosApp`:

```js{2,3}
function DeepChild(props) {
  // If we want to perform an action, we can get dispatch from context.
  const dispatch = useContext(TodosDispatch);

  function handleClick() {
    dispatch({ type: 'add', text: 'hello' });
  }

  return (
    <button onClick={handleClick}>Add todo</button>
  );
}
```

This is both more convenient from the maintenance perspective (no need to keep forwarding callbacks), and avoids the callback problem altogether. Passing `dispatch` down like this is the recommended pattern for deep updates.

Note that you can still choose whether to pass the application *state* down as props (more explicit) or as context (more convenient for very deep updates). If you use context to pass down the state too, use two different context types -- the `dispatch` context never changes, so components that read it don't need to rerender unless they also need the application state.

### How to read an often-changing value from `useCallback`? {#how-to-read-an-often-changing-value-from-usecallback}

>Note
>
>We recommend to [pass `dispatch` down in context](#how-to-avoid-passing-callbacks-down) rather than individual callbacks in props. The approach below is only mentioned here for completeness and as an escape hatch.
>
>Also note that this pattern might cause problems in the [concurrent mode](/blog/2018/03/27/update-on-async-rendering.html). We plan to provide more ergonomic alternatives in the future, but the safest solution right now is to always invalidate the callback if some value it depends on changes.

In some rare cases you might need to memoize a callback with [`useCallback`](/docs/hooks-reference.html#usecallback) but the memoization doesn't work very well because the inner function has to be re-created too often. If the function you're memoizing is an event handler and isn't used during rendering, you can use [ref as an instance variable](#is-there-something-like-instance-variables), and save the last committed value into it manually:

```js{6,10}
function Form() {
  const [text, updateText] = useState('');
  const textRef = useRef();

  useLayoutEffect(() => {
    textRef.current = text; // Write it to the ref
  });

  const handleSubmit = useCallback(() => {
    const currentText = textRef.current; // Read it from the ref
    alert(currentText);
  }, [textRef]); // Don't recreate handleSubmit like [text] would do

  return (
    <>
      <input value={text} onChange={e => updateText(e.target.value)} />
      <ExpensiveTree onSubmit={handleSubmit} />
    </>
  );
}
```

This is a rather convoluted pattern but it shows that you can do this escape hatch optimization if you need it. It's more bearable if you extract it to a custom Hook:

```js{4,16}
function Form() {
  const [text, updateText] = useState('');
  // Will be memoized even if `text` changes:
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

In either case, we **don't recommend this pattern** and only show it here for completeness. Instead, it is preferable to [avoid passing callbacks deep down](#how-to-avoid-passing-callbacks-down).


## Under the Hood {#under-the-hood}

### How does React associate Hook calls with components? {#how-does-react-associate-hook-calls-with-components}

React keeps track of the currently rendering component. Thanks to the [Rules of Hooks](/docs/hooks-rules.html), we know that Hooks are only called from React components (or custom Hooks -- which are also only called from React components).

There is an internal list of "memory cells" associated with each component. They're just JavaScript objects where we can put some data. When you call a Hook like `useState()`, it reads the current cell (or initializes it during the first render), and then moves the pointer to the next one. This is how multiple `useState()` calls each get independent local state.

### What is the prior art for Hooks? {#what-is-the-prior-art-for-hooks}

Hooks synthesize ideas from several different sources:

* Our old experiments with functional APIs in the [react-future](https://github.com/reactjs/react-future/tree/master/07%20-%20Returning%20State) repository.
* React community's experiments with render prop APIs, including [Ryan Florence](https://github.com/ryanflorence)'s [Reactions Component](https://github.com/reactions/component).
* [Dominic Gannaway](https://github.com/trueadm)'s [`adopt` keyword](https://gist.github.com/trueadm/17beb64288e30192f3aa29cad0218067) proposal as a sugar syntax for render props.
* State variables and state cells in [DisplayScript](http://displayscript.org/introduction.html).
* [Reducer components](https://reasonml.github.io/reason-react/docs/en/state-actions-reducer.html) in ReasonReact.
* [Subscriptions](http://reactivex.io/rxjs/class/es6/Subscription.js~Subscription.html) in Rx.
* [Algebraic effects](https://github.com/ocamllabs/ocaml-effects-tutorial#2-effectful-computations-in-a-pure-setting) in Multicore OCaml.

[Sebastian Markbåge](https://github.com/sebmarkbage) came up with the original design for Hooks, later refined by [Andrew Clark](https://github.com/acdlite), [Sophie Alpert](https://github.com/sophiebits), [Dominic Gannaway](https://github.com/trueadm), and other members of the React team.