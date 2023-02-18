---
id: hooks-overview
title: Hook 概览
permalink: docs/hooks-overview.html
next: hooks-state.html
prev: hooks-intro.html
---

*Hook* 是 React 16.8 的新增特性。它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性。

Hook 是[向下兼容的](/docs/hooks-intro.html#no-breaking-changes)。本页面为有经验的 React 用户提供一个对 Hook 的概览。这是一个相当快速的概览，如果你有疑惑，可以参阅下面这样的黄色提示框。

>详细说明
>
>有关我们要在 React 中引入 Hook 的原因，请参考[动机](/docs/hooks-intro.html#motivation)。

**↑↑↑ 每个部分的结尾都会有一个如上所示的黄色方框。** 它们会链接到更详细的说明。

## 📌 State Hook {#state-hook}

这个例子用来显示一个计数器。当你点击按钮，计数器的值就会增加：

```js{1,4,5}
import React, { useState } from 'react';

function Example() {
  // 声明一个叫 “count” 的 state 变量。
  const [count, setCount] = useState(0);

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

在这里，`useState` 就是一个 *Hook* （等下我们会讲到这是什么意思）。通过在函数组件里调用它来给组件添加一些内部 state。React 会在重复渲染时保留这个 state。`useState` 会返回一对值：**当前**状态和一个让你更新它的函数，你可以在事件处理函数中或其他一些地方调用这个函数。它类似 class 组件的 `this.setState`，但是它不会把新的 state 和旧的 state 进行合并。（我们会在[使用 State Hook](/docs/hooks-state.html) 里展示一个对比 `useState` 和 `this.state` 的例子）。

`useState` 唯一的参数就是初始 state。在上面的例子中，我们的计数器是从零开始的，所以初始 state 就是 `0`。值得注意的是，不同于 `this.state`，这里的 state 不一定要是一个对象 —— 如果你有需要，它也可以是。这个初始 state 参数只有在第一次渲染时会被用到。

#### 声明多个 state 变量 {#declaring-multiple-state-variables}

你可以在一个组件中多次使用 State Hook:

```js
function ExampleWithManyStates() {
  // 声明多个 state 变量！
  const [age, setAge] = useState(42);
  const [fruit, setFruit] = useState('banana');
  const [todos, setTodos] = useState([{ text: 'Learn Hooks' }]);
  // ...
}
```

[数组解构](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Array_destructuring)的语法让我们在调用 `useState` 时可以给 state 变量取不同的名字。当然，这些名字并不是 `useState` API 的一部分。React 假设当你多次调用 `useState` 的时候，你能保证每次渲染时它们的调用顺序是不变的。后面我们会再次解释它是如何工作的以及在什么场景下使用。

#### 那么，什么是 Hook? {#but-what-is-a-hook}

Hook 是一些可以让你在函数组件里“钩入” React state 及生命周期等特性的函数。Hook 不依赖在 class 组件中使用 —— 这使得你不使用 class 也能使用 React。（我们[不推荐](/docs/hooks-intro.html#gradual-adoption-strategy)把你已有的组件全部重写，但是你可以在新组件里开始使用 Hook。）

React 内置了一些像 `useState` 这样的 Hook。你也可以创建你自己的 Hook 来复用不同组件之间的状态逻辑。我们会先介绍这些内置的 Hook。

> 详细说明
>
> 你可以在这一章节了解更多关于 State Hook 的内容：[使用 State Hook](/docs/hooks-state.html)。

## ⚡️ Effect Hook {#effect-hook}

你之前可能已经在 React 组件中执行过数据获取、订阅或者手动修改过 DOM。我们统一把这些操作称为“副作用”，或者简称为“作用”。

`useEffect` 就是一个 Effect Hook，给函数组件增加了操作副作用的能力。它跟 class 组件中的 `componentDidMount`、`componentDidUpdate` 和 `componentWillUnmount` 具有相同的用途，只不过被合并成了一个 API。（我们会在[使用 Effect Hook](/docs/hooks-effect.html) 里展示对比 `useEffect` 和这些方法的例子。）

例如，下面这个组件在 React 更新 DOM 后会设置一个页面标题：

```js{1,6-10}
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // 相当于 componentDidMount 和 componentDidUpdate:
  useEffect(() => {
    // 使用浏览器的 API 更新页面标题
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

当你调用 `useEffect` 时，就是在告诉 React 在完成对 DOM 的更改后运行你的“副作用”函数。由于副作用函数是在组件内声明的，所以它们可以访问到组件的 props 和 state。默认情况下，React 会在每次渲染后调用副作用函数 —— **包括**第一次渲染的时候。（我们会在[使用 Effect Hook](/docs/hooks-effect.html) 中跟 class 组件的生命周期方法做更详细的对比。）

副作用函数还可以通过返回一个函数来指定如何“清除”副作用。例如，在下面的组件中使用副作用函数来订阅好友的在线状态，并通过取消订阅来进行清除操作：

```js{10-16}
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);

    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

在这个示例中，React 会在组件销毁时取消对 `ChatAPI` 的订阅，然后在后续渲染时重新执行副作用函数。（如果传给 `ChatAPI` 的 `props.friend.id` 没有变化，你也可以[告诉 React 跳过重新订阅](/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects)。）

跟 `useState` 一样，你可以在组件中多次使用 `useEffect` ：

```js{3,8}
function FriendStatusWithCounter(props) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  const [isOnline, setIsOnline] = useState(null);
  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }
  // ...
```

通过使用 Hook，你可以把组件内相关的副作用组织在一起（例如创建订阅及取消订阅），而不要把它们拆分到不同的生命周期函数里。

> 详细说明
>
> 你可以在这一章节了解更多关于 `useEffect` 的内容：[使用 Effect Hook](/docs/hooks-effect.html)

## ✌️ Hook 使用规则 {#rules-of-hooks}

Hook 就是 JavaScript 函数，但是使用它们会有两个额外的规则：

* 只能在**函数最外层**调用 Hook。不要在循环、条件判断或者子函数中调用。
* 只能在 **React 的函数组件**中调用 Hook。不要在其他 JavaScript 函数中调用。（还有一个地方可以调用 Hook —— 就是自定义的 Hook 中，我们稍后会学习到。）

同时，我们提供了 [linter 插件](https://www.npmjs.com/package/eslint-plugin-react-hooks)来自动执行这些规则。这些规则乍看起来会有一些限制和令人困惑，但是要让 Hook 正常工作，它们至关重要。

>详细说明
>
>你可以在这章节了解更多关于这些规则的内容：[Hook 使用规则](/docs/hooks-rules.html)。

## 💡 自定义 Hook {#building-your-own-hooks}

有时候我们会想要在组件之间重用一些状态逻辑。目前为止，有两种主流方案来解决这个问题：[高阶组件](/docs/higher-order-components.html)和 [render props](/docs/render-props.html)。自定义 Hook 可以让你在不增加组件的情况下达到同样的目的。

前面，我们介绍了一个叫 `FriendStatus` 的组件，它通过调用 `useState` 和 `useEffect` 的 Hook 来订阅一个好友的在线状态。假设我们想在另一个组件里重用这个订阅逻辑。

首先，我们把这个逻辑抽取到一个叫做 `useFriendStatus` 的自定义 Hook 里：

```js{3}
import React, { useState, useEffect } from 'react';

function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}
```

它将 `friendID` 作为参数，并返回该好友是否在线：

现在我们可以在两个组件中使用它：


```js{2}
function FriendStatus(props) {
  const isOnline = useFriendStatus(props.friend.id);

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

```js{2}
function FriendListItem(props) {
  const isOnline = useFriendStatus(props.friend.id);

  return (
    <li style={{ color: isOnline ? 'green' : 'black' }}>
      {props.friend.name}
    </li>
  );
}
```

每个组件间的 state 是完全独立的。Hook 是一种复用*状态逻辑*的方式，它不复用 state 本身。事实上 Hook 的每次*调用*都有一个完全独立的 state —— 因此你可以在单个组件中多次调用同一个自定义 Hook。

自定义 Hook 更像是一种约定而不是功能。如果函数的名字以 “`use`” 开头并调用其他 Hook，我们就说这是一个自定义 Hook。 `useSomething` 的命名约定可以让我们的 linter 插件在使用 Hook 的代码中找到 bug。

你可以创建涵盖各种场景的自定义 Hook，如表单处理、动画、订阅声明、计时器，甚至可能还有更多我们没想到的场景。我们很期待看到 React 社区会出现什么样的自定义 Hook。

>详细说明
>
>我们会在这一章节介绍更多关于自定义 Hook 的内容： [创建你自己的 Hook](/docs/hooks-custom.html)。

## 🔌 其他 Hook {#-other-hooks}

除此之外，还有一些使用频率较低的但是很有用的 Hook。比如，[`useContext`](/docs/hooks-reference.html#usecontext) 让你不使用组件嵌套就可以订阅 React 的 Context。

```js{2,3}
function Example() {
  const locale = useContext(LocaleContext);
  const theme = useContext(ThemeContext);
  // ...
}
```

另外 [`useReducer`](/docs/hooks-reference.html#usereducer) 可以让你通过 reducer 来管理组件本地的复杂 state。

```js{2}
function Todos() {
  const [todos, dispatch] = useReducer(todosReducer);
  // ...
```

>详细说明
>
>你可以在这一章节了解更多关于所有内置 Hook 的内容：[Hook API 索引](/docs/hooks-reference.html)。


## 下一步 {#next-steps}

嗯，真快！如果你还有什么东西不是很理解或者想要了解更详细的内容，可以继续阅读下一章节：[State Hook](/docs/hooks-state.html)。

你也可以查阅 [Hook API 索引](/docs/hooks-reference.html) 和 [Hooks FAQ](/docs/hooks-faq.html)。

最后，不要忘记查阅 [Hook 简介](/docs/hooks-intro.html)，它介绍了我们*为什么*要增加 Hook 以及如何在不重写整个应用的情况下将 Hook 跟 class 组件同时使用。
