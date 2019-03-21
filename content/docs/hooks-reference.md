---
id: hooks-reference
title: Hooks API 参考
permalink: docs/hooks-reference.html
prev: hooks-custom.html
next: hooks-faq.html
---

*Hook* 是 React 16.8 的新特性。利用它，你无需编写 class 就能使用 state 和其他 React 特性。

本页面描述 React 内置的 Hook API。

如果你是 Hook 新手，可能需要先查阅 [概览](/docs/hooks-overview.html) 一章来了解它。还能在 [常见问题](/docs/hooks-faq.html) 一章找到有用的信息。

- [基础的 Hook](#basic-hooks)
  - [`useState`](#usestate)
  - [`useEffect`](#useeffect)
  - [`useContext`](#usecontext)
- [额外的 Hook](#additional-hooks)
  - [`useReducer`](#usereducer)
  - [`useCallback`](#usecallback)
  - [`useMemo`](#usememo)
  - [`useRef`](#useref)
  - [`useImperativeHandle`](#useimperativehandle)
  - [`useLayoutEffect`](#uselayouteffect)
  - [`useDebugValue`](#usedebugvalue)

## 基础的 Hook {#basic-hooks}

### `useState` {#usestate}

```js
const [state, setState] = useState(initialState);
```

`useState` 返回一个有状态的值和一个可以更新该值的函数。

在组件初始渲染期间，`useState` 会返回和它第一个参数（`initialState`）等值的 state（`state`）。

`setState` 函数用来更新 state。它接收新的 state 值，然后将组件排入重渲染队列。

```js
setState(newState);
```

在后续的组件重渲染过程中，`useState` 的第一个返回值总是最新的 state。

> 注意
>
> React 会确保 `setState` 函数的标识是稳定的，并且不会在组件重新渲染时发生变化。这就是为什么可以安全地从 `useEffect` 或 `useCallback` 的依赖列表中省略 `setState`。

#### 函数式的更新 {#functional-updates}

如果需要基于上一轮的 state 来计算新的 state，可以把一个接收旧值并返回新值的函数传给 `setState`。下面的计数器组件示例使用了 `setState` 的两种用法：

```js
function Counter({initialCount}) {
  const [count, setCount] = useState(initialCount);
  return (
    <>
      Count: {count}
      <button onClick={() => setCount(initialCount)}>Reset</button>
      <button onClick={() => setCount(prevCount => prevCount + 1)}>+</button>
      <button onClick={() => setCount(prevCount => prevCount - 1)}>-</button>
    </>
  );
}
```

由于需通过上一次的计数来计算新的计数值，「+」「-」按钮采用函数式的 `setState` 去处理更新。而「Reset」按钮则使用普通形式的 `setState`，因为它总是将计数置回 0。

> 注意
>
> 与 class 组件的 `setState` 方法不同，`useState` 返回的 `setState` 函数并不会自动合并两次更新时接收的对象。你可以用函数式的 `setState` 结合对象拓展语法来合并 state 对象。
>
> ```js
> setState(prevState => {
>   // 也可以使用 Object.assign
>   return {...prevState, ...updatedValues};
> });
> ```
>
> `useReducer` 是另一种可选的方案，但它更适合管理包含多个子状态的 state 对象。

#### state 的惰性初始化 {#lazy-initial-state}

`initialState` 参数只会在组件的初始渲染中起作用，后续渲染时会被忽略。如果初始化 state 的开销比较大，你可以提供一个返回 state 的函数作为 `initialState` 实参，该函数只在初始渲染时被调用：

```js
const [state, setState] = useState(() => {
  const initialState = someExpensiveComputation(props);
  return initialState;
});
```

#### 跳过 state 更新 {#bailing-out-of-a-state-update}

假如你在调用 State Hook 的更新函数时，给它传入当前的 state 值，那本次更新将被跳过，React 既不会渲染子组件，也不会执行 effect。（React 使用 [`Object.is` 比较算法](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description) 来比较 state。）

Note that React may still need to render that specific component again before bailing out. That shouldn't be a concern because React won't unnecessarily go "deeper" into the tree. If you're doing expensive calculations while rendering, you can optimize them with `useMemo`.

### `useEffect` {#useeffect}

```js
useEffect(didUpdate);
```

`useEffect` 接收一个包含命令式的、可能有副作用代码的函数。

在函数组件主体内（这里指在 React 渲染阶段）变更DOM、设置订阅、计时、记录日志，以及执行其他副作用等操作都是不可取的，因为这可能引发令人困扰的 bugs，破坏 UI 的一致性。

相反，应该使用 `useEffect` 来完成上述操作。传给 `useEffect` 的函数会在组件渲染完成后执行。你可以把 effect 函数看作是从 React 的纯函数世界通往命令式世界的应急通道。

默认情况下，effect 将在每轮渲染结束后执行，但你可以选择让它 [在只有某些值改变的时候](#conditionally-firing-an-effect) 才执行。

#### 清理 effect {#cleaning-up-an-effect}

通常，effect 内部会产生诸如订阅或计时器 ID 等资源，必须在组件卸载前清除它们。为此，传给 `useEffect` 的函数可能需要返回一个清理函数。如下，一个创建订阅的例子：

```js
useEffect(() => {
  const subscription = props.source.subscribe();
  return () => {
    // 清除订阅
    subscription.unsubscribe();
  };
});
```

为防止内存泄漏，清理函数将在组件卸载前执行。另外，如果组件多次渲染（通常如此），**在执行下一轮的 effect 之前，上一轮的 effect 就已经被清理了**。在我们的示例中，意味着组件每一轮更新都会创建新的订阅。若想避免每次都调用 effect，请参阅下一章节。

#### effect 的调用时机 {#timing-of-effects}

与 `componentDidMount`、`componentDidUpdate` 不同，在浏览器完成布局与绘制**之后**，传给 `useEffect` 的函数会在一个延迟事件中被调用。这使得 `useEffect` 能跟许多常见的副作用，如订阅设置、事件处理器等搭配使用，因为大多数副作用不应该阻塞视图更新。

然而，并非所有 effect 都可以被延迟。例如，在浏览器执行下一次绘制前，用户可见的 DOM 变更就必须同步执行，这样用户才不会感觉到视觉上的不一致。（在概念上类似于被动事件监听器和主动事件监听器的区别。）React 提供了额外的 [`useLayoutEffect`](#uselayouteffect) Hook 来处理这类 effect。它和 `useEffect` 签名相同，区别只是调用时机不同。

浏览器绘制完成之后，`useEffect` 会确保在新的组件渲染前调用 effect。React 将在组件更新前刷新上一轮渲染的 effect。

#### effect 的条件调用 {#conditionally-firing-an-effect}

默认情况下，effect 会在每轮组件渲染完成后被调用。这样一旦 effect 的依赖发生变化了，它就会被重新创建。

然而，在某些场景下这么做可能过于简单粗暴了。就像上一章节的订阅示例一样，我们不需要在每次组件更新时都创建新的订阅，只要在 `source` props 改变时重新创建就行。

为此，可以用数组表示 effect 的依赖项，作为 `useEffect` 的第二个参数。更新后的示例如下:

```js
useEffect(
  () => {
    const subscription = props.source.subscribe();
    return () => {
      subscription.unsubscribe();
    };
  },
  [props.source],
);
```

现在，只有当 `props.source` 改变了才会重新创建订阅。

> 注意
>
> 如果使用此优化，请确保依赖项数组包含**组件作用域（如 props 和 state）内被 effect 使用的所有随时间变化的值**。否则，你的代码将会引用上一轮渲染的旧数据。了解更多有关 [如何处理函数](/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies) 和如何处理 [频繁变化的数组值](/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often) 的信息。
>
> 如果你期望 effect 只会被调用一次和清理一次（在 mount 和 unmount 的时候），可以传一个空数组（`[]`）作为 `useEffect` 第二个参数。这表示你的 effect 不依赖于任何的 props 或 state，所以无需重复调用。它不是一个特例，而是遵循依赖项数组一贯的工作方式。
>
> 如果你传了一个空数组（`[]`），effect 内部引用的 props 和 state 将始终维持它们的初始值。将 `[]` 作为第二个参数有点类似于 `componentDidMount` 和 `componentWillUnmount` 的手动模式，但通常来说有 [更好的](/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies) [解决方案](/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often) 来避免 effect 的频繁调用。另外，不要忘了 React 会把 `useEffect` 延迟到浏览器完成绘制才执行，所以多一些额外的调用也没什么问题。
>
>
> 我们推荐你把 [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) 规则作为 [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) 的一部分来使用。当依赖项指定有误时，它会生成警告并提供修复建议。

依赖项数组不会作为参数传给 effect 函数。然而从概念上来说，这表示 effect 函数引用的每个值也应该出现在依赖项数组中。将来，一个足够先进的编译器可以自动创建这个数组。

### `useContext` {#usecontext}

```js
const value = useContext(MyContext);
```

`useContext` 接收一个 context 对象（`React.createContext` 的返回值）并返回该 context 的当前值。该值由距离当前组件最近的 `<MyContext.Provider>` 的 `value` prop 确定。

当最近的 `<MyContext.Provider>` 更新时，`useContext` Hook 将使用 `MyContext` provider 的最新 context `value` 触发组件重渲染。

别忘了 `useContext` 的参数必须是 *context 对象本身*：

 * **正确的：** `useContext(MyContext)`
 * **错误的：** `useContext(MyContext.Consumer)`
 * **错误的：** `useContext(MyContext.Provider)`

调用了 `useContext` 的组件总会在 context 值变化时重新渲染。如果重渲染组件的开销较大，你可以 [通过 memoization 手段进行优化](https://github.com/facebook/react/issues/15156#issuecomment-474590693)。

> 提示
>
> 如果你已经对 context API 很熟悉，应该明白 `useContext(MyContext)` 相当于 class 组件中的 `static contextType = MyContext` 或者 `<MyContext.Consumer>`。
>
> `useContext(MyContext)` 只是给你提供了 *读取* context 值和订阅 context 变化的功能。你仍然需要在组件树中使用 `<MyContext.Provider>` 为组件 *提供* context 值。

## 额外的 Hook {#additional-hooks}

以下介绍的 Hook，有些是上一章节基础 Hook 的变体，有些仅在特定边界场景下用到。不用急着先学习它们。

### `useReducer` {#usereducer}

```js
const [state, dispatch] = useReducer(reducer, initialArg, init);
```

`useReducer` 是 [`useState`](#usestate) 的替代方案。它接收一个形如 `(state, action) => newState` 的 reducer，然后返回当前的 state 以及配套的 `dispatch` 方法。（如果你熟悉 Redux 的话，你已经知道这个 Hook 是如何工作的了。）

当你遇到几种情况，比如 state 包含多个子对象、逻辑复杂，或者未来的 state 需要依赖之前的 state，通常 `useReducer` 会比 `useState` 更适用。使用 `useReducer` 还能给那些会触发深度更新的组件做性能优化，因为 [你可以向子组件传递 `dispatch` 而不是回调函数](/docs/hooks-faq.html#how-to-avoid-passing-callbacks-down) 。

用 reducer 重写 [`useState`](#usestate) 一章的计数器示例：

```js
const initialState = {count: 0};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}

function Counter({initialState}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
    </>
  );
}
```

> 注意
>
> React 确保 `dispatch` 函数的标识是稳定的，并且不会在组件重新渲染时改变。这就是为什么可以安全地从 `useEffect` 或 `useCallback` 的依赖列表中省略 `dispatch`。

#### 指定初始 state {#specifying-the-initial-state}

有两种初始化 `useReducer` state 的方法，你可以根据使用场景选择其中一种。将初始 state 作为 `useReducer` 的第二个参数是最简单的方法：

```js{3}
  const [state, dispatch] = useReducer(
    reducer,
    {count: initialCount}
  );
```

> 注意
>
> React 不使用 `state = initialState` 这一由 Redux 推广开来的参数约定。有时候初始值依赖于 props，因此需要在调用 Hook 时指定。如果你特别喜欢上述的参数约定，可以通过调用 `useReducer(reducer, undefined, reducer)` 来模拟 Redux 的行为，但我们不鼓励你这么做。

#### 惰性初始化 {#lazy-initialization}

你可以选择惰性初始化 state。为此，需要把 `init` 函数作为 `useReducer` 的第三个参数。这样初始状态将被设置为 `init(initialArg)`。

使用这种方法可以把 state 的初始化计算逻辑抽离到 reducer 外面，也方便将来对重置 state 的 action 做处理：

```js{1-3,11-12,19,24}
function init(initialCount) {
  return {count: initialCount};
}

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    case 'reset':
      return init(action.payload);
    default:
      throw new Error();
  }
}

function Counter({initialCount}) {
  const [state, dispatch] = useReducer(reducer, initialCount, init);
  return (
    <>
      Count: {state.count}
      <button
        onClick={() => dispatch({type: 'reset', payload: initialCount})}>
        Reset
      </button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
    </>
  );
}
```

#### 跳过 dispatch {#bailing-out-of-a-dispatch}

如果你在 Reducer Hook 的 reducer 中返回当前的 state 值，那么本次更新将被跳过，React 既不会渲染子组件，也不会执行 effect。（React 使用 [`Object.is` 比较算法](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description)来比较 state。）

Note that React may still need to render that specific component again before bailing out. That shouldn't be a concern because React won't unnecessarily go "deeper" into the tree. If you're doing expensive calculations while rendering, you can optimize them with `useMemo`.

### `useCallback` {#usecallback}

```js
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);
```

`useCallback` 返回一个 [memoized](https://en.wikipedia.org/wiki/Memoization) 回调函数。

给 `useCallback` 传一个内联的回调函数和一个依赖项数组，它会返回回调函数的 memoized 版本，该回调仅在某个依赖项改变时才更新。当你把回调函数传给优化过的、利用引用相等规则去避免非必要渲染（例如 `shouldComponentUpdate`）的子组件时，这种手段非常有用。

`useCallback(fn, deps)` 相当于 `useMemo(() => fn, deps)`。

> 注意
>
> 依赖项数组不会作为参数传给回调函数。然而从概念上来说，这表示回调函数引用的每个值也应该出现在依赖项数组中。将来，一个足够先进的编译器可以自动创建这个数组。
>
> 我们推荐你把 [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) 规则作为 [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) 的一部分来使用。当依赖项指定有误时，它会生成警告并提供修复建议。

### `useMemo` {#usememo}

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

`useMemo` 返回一个 [memoized](https://en.wikipedia.org/wiki/Memoization) 值。

它接收一个「创建器」函数和一个依赖项数组。仅在某个依赖项改变时，`useMemo` 才会重新计算 memoized 值。这种优化有助于避免在每次渲染时都进行高开销的计算。

记住，传给 `useMemo` 的函数会在渲染期间执行。不要在这个函数内部执行与渲染无关的操作。像副作用就应该交给 `useEffect` 去处理，而不是交给 `useMemo`。

如果没有提供依赖项数组，每次渲染 `useMemo` 都会计算新的值。

 **你可以把 `useMemo` 作为性能优化的手段，但不要把它当成语义上的保证。** 未来，React 可能会选择「忘记」以前的一些 memoized 值，并在下次渲染时重新计算它们，比如为离屏组件释放内存。建议自己编写代码，以便脱离 `useMemo` 也能正常工作 —— 然后在你的代码中添加 `useMemo` 来优化性能。

> 注意
>
> 依赖项数组不会作为参数传给「创建器」函数。然而从概念上来说，这表示「创建器」函数引用的每个值也应该出现在依赖项数组中。将来，一个足够先进的编译器可以自动创建这个数组。
>
> 我们推荐你把 [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) 规则作为 [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) 的一部分来使用。当依赖项指定有误时，它会生成警告并提供修复建议。

### `useRef` {#useref}

```js
const refContainer = useRef(initialValue);
```

`useRef` 返回一个可变的 ref 对象，其 `.current` 属性被初始化为 `useRef` 的参数（`initialValue`）。ref 对象在组件的整个生命周期内保持不变。

一个常见的用例，命令式地访问子组件：

```js
function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // `current` 指向挂载到 DOM 上的文本输入元素
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```

本质上，`useRef` 就像一个「盒子」，可以在其 `.current` 属性中保存一个可变值。

refs 主要作为一种 [访问 DOM](/docs/refs-and-the-dom.html) 的方法，对此你已经很熟悉。如果以 `<div ref={myRef} />` 的绑定形式把 ref 对象传给 React，只要节点发生变化，React 都会将 ref 对象的 `.current` 属性设置为相应的 DOM 节点。

然而，`useRef()` 比 `ref` 属性更有用。它可以 [很方便地保持任何可变值](/docs/hooks-faq.html#is-there-something-like-instance-variables)，其原理类似于你在 class 中使用实例字段的方式。

之所以 `useRef()` 能实现上述功能，是因为它创建的是普通的 Javascript 对象。使用 `useRef()` 和你自己创建一个 `{current: ...}` 对象的唯一区别是，`useRef` 会在每次渲染时返回同一个 ref 对象。

请记住，当 ref 对象内容发生变化时，`useRef` *不会* 通知你。更改 `.current` 属性不会引发组件重渲染。如果要在 React 绑定或解绑 DOM 节点的 ref 时运行某些代码，则需要使用 [回调 ref](/docs/hooks-faq.html#how-can-i-measure-a-dom-node)。


### `useImperativeHandle` {#useimperativehandle}

```js
useImperativeHandle(ref, createHandle, [deps])
```

`useImperativeHandle` 可以让你在使用 `ref` 时自定义暴露给父组件的实例值。在大多数情况下，应该避免使用 refs 这样的命令式代码。`useImperativeHandle` 应该和 `forwardRef` 一起使用：

```js
function FancyInput(props, ref) {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    }
  }));
  return <input ref={inputRef} ... />;
}
FancyInput = forwardRef(FancyInput);
```

在本例中，渲染 `<FancyInput ref={fancyInputRef} />` 的父组件可以调用 `fancyInputRef.current.focus()`。

### `useLayoutEffect` {#uselayouteffect}

`useLayoutEffect` 的函数签名与 `useEffect` 相同，但它会在所有的 DOM 变更之后同步调用 effect。可以使用它来读取 DOM 布局，并同步地触发重渲染。在浏览器执行绘制之前，`useLayoutEffect` 内部的更新计划将被同步刷新。

尽可能使用标准的 `useEffect` 以避免阻塞视图更新。

> 提示
>
> 如果你正在将代码从 class 组件迁移到使用 Hook 的函数组件，需要知道 `useLayoutEffect` 的调用时机和 `componentDidMount`、`componentDidUpdate` 一样。然而，我们推荐你 **一开始先用 `useEffect`**，只有在出问题的时候才来尝试 `useLayoutEffect`。
>
> 如果你使用服务端渲染，请记住，在 Javascript 代码加载完成之前，`useLayoutEffect` 和 `useEffect` *都* 无法执行。这就是为什么 React 发现服务端渲染组件包含了 `useLayoutEffect` 代码的时候会发出警告。想解决这个问题，要么把逻辑迁移到 `useEffect`（如果首次渲染不需要这段逻辑），要么将该组件延迟到客户端渲染完了再显示（如果直到 `useLayoutEffect` 执行之前 HTML 都像坏掉一样的话）。
>
> 为了从服务端渲染的 HTML 中移除用到 layout effect 的组件，可以通过 `showChild && <Child />` 进行条件渲染，并使用 `useEffect(() => { setShowChild(true); }, [])` 延迟显示组件。这样，在客户端渲染完成之前，UI 就不会出现坏掉的样子。

### `useDebugValue` {#usedebugvalue}

```js
useDebugValue(value)
```

`useDebugValue` 用于在 React 开发者工具中显示自定义 hook 标签。

例如，考虑 [「编写自己的 Hook」](/docs/hooks-custom.html) 一章中描述的 `useFriendStatus` 自定义 Hook：

```js{6-8}
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  // ...

  // 在开发者工具中的这个 Hook 旁边显示标签
  // e.g. "FriendStatus: Online"
  useDebugValue(isOnline ? 'Online' : 'Offline');

  return isOnline;
}
```

> 提示
>
> 我们不推荐你向每个自定义 Hook 添加 debug 值。对于共享库的自定义 Hook 来说，它是最有价值的。

#### 延迟格式化 debug 值 {#defer-formatting-debug-values}

在某些情况下，格式化显示可能是一项开销很大的操作。除非真的去查看 Hook，否则没有必要对 Hook 的显示值做格式化处理。

因此，`useDebugValue` 接收一个格式化函数作为可选的第二个参数。该函数只有在 Hook 被查看时才会被调用。它接收 debug 值作为参数，并且应该返回一个格式化的显示值。

例如，一个返回 `Date` 值的自定义 Hook 可以通过格式化函数来避免不必要的 `toDateString` 函数调用：

```js
useDebugValue(date, date => date.toDateString());
```
