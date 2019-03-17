---
id: hooks-state
title: 使用 Effect Hook
permalink: docs/hooks-effect.html
next: hooks-rules.html
prev: hooks-intro.html
---

*Hook* 是 React 16.8 的新增特性。它可以让你在不使用 class 的情况下使用 state 和一些其他的 React 特性。

*Effect Hook* 让你可以在函数定义组件中执行一些副作用操作

```js{1,6-10}
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update the document title using the browser API
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

这段代码是基于[上一页中的计数器示例](/docs/hooks-state.html)修改的，我们为计数器增加了一个小功能：将 document 的 title 设置为一句包含了点击次数的消息

数据获取，设置订阅以及手动更改 React 组件中的 DOM 都是副作用的示例。无论你之前是否将他们称为"副作用"（可能就是你想要的效果），应该都在组件中使用过了。

>Tip
>
>如果你熟悉 React class 的生命周期函数，你可以把 `useEffect` Hook 看做 `componentDidMount`，`componentDidUpdate` 和 `componentWillUnmount` 这三个函数的组合。

通常来说在 React 组件中有两种副作用操作：需要清理的和不需要清理的。我们来更仔细地看一下他们之间的区别

## 无需清理的 Effect {#effects-without-cleanup}

有时候，我们只是想**在 React 更新 DOM 之后运行一些额外的代码。**比如发送网络请求，手动变更 DOM，记录日志，这些都是常见的无需清理的操作。因为我们在执行完这些操作之后，就可以忽略他们了。让我们对比一下使用 class 和 Hook 都是怎么实现这些副作用的。

### 使用 class 的示例 {#example-using-classes}

在 React 的类定义组件中，`render` 函数是不应该有任何副作用的。一般来说，在这里执行操作太早了，我们基本上都希望在 React 更新 DOM 之后才执行我们的操作。

这就是为什么在 React class中，我们把副作用操作放到 `componentDidMount` 和 `componentDidUpdate` 函数中。回到我们的示例中来，这是一个 React 计数器 class 组件。它在 React 对 DOM 进行操作之后，立刻更新了 document 的 title 属性

```js{9-15}
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  componentDidMount() {
    document.title = `You clicked ${this.state.count} times`;
  }

  componentDidUpdate() {
    document.title = `You clicked ${this.state.count} times`;
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    );
  }
}
```

注意，**在这个 class 中我们需要在两个生命周期函数中写重复的代码**

这是因为很多情况下我们希望在组件加载和更新时执行同样的操作。从概念上说，我们希望它在每次渲染之后执行 ———— 但 React 的 class 组件没有提供这样的方法。即使我们提取出一个方法，我们还是要在两个地方调用它。

现在让我们来看看如何使用 `useEffect` Hook 做同样的事情。

### 使用 Hook 的示例 {#example-using-hooks}

我们已经在本页顶部看到了这个示例，但让我们再仔细看看它：

```js{1,6-8}
import React, { useState, useEffect } from 'react';

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

**`useEffect` 做了什么？** 通过使用这个 Hook，你告诉 React 你的组件需要在渲染后执行某些操作。React 会记住你传递的函数(我们将它称之为 “effect”)，并且在执行 DOM 更新之后调用它。在这个 effect 中，我们设置了 document 的 title 属性，不过我们也可以执行数据获取或调用其他命令式 API。

**为什么在组件内部调用 `useEffect`？** 将 `useEffect` 放在组件内部让我们可以在 effect 中直接访问 `count` state 变量(或其他 props)。我们不需要特殊的 API 来读取它 -- 它已经在作用域中了。Hooks 使用 JavaScript 的闭包机制，而不是在 JavaScript 已经提供了解决方案的情况下还引入特定的 React API。

**`useEffect` 会在每次渲染后都执行吗？**是的，默认情况下，它在第一次渲染之后*和*每次更新之后都运行。(我们稍后会谈到[如何控制它](#tip-optimizing-performance-by-skipping-effects)。)你可能会更容易接受 effect 发生在“渲染之后”这种概念，不用再去考虑“挂载”还是“更新”。React 保证了每次运行 effect 的时候，DOM 都已经更新完毕。

### 详细说明 {#detailed-explanation}

现在我们已经对 effect 有了一些了解，下面这些代码应该不难看懂了：

```js
function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });
```

我们声明了 `count` state 变量，并告诉 React 我们需要使用一个 effect。接着传递一个函数给 `useEffect` Hook。这个函数就是我们的 effect。然后使用 `document.title` 浏览器 API 设置 document 的 title。我们可以在 effct 中获取到最新的 `count` 值，因为他在函数的作用域内。当 React 渲染我们的组件时，会记住我们使用的 effect，并在更新完 DOM 后运行它。这个过程在每次渲染时都会发生，包括首次渲染。

经验丰富的 JavaScript 开发人员可能会注意到，传递给 `useEffect` 的函数在每次渲染中都会有所不同，这是刻意为之的。事实上这正是我们可以在 effect 中获取最新的 `count` 的值，而不用担心其过期的原因。每次我们重新渲染，都会生成一个_新的_ effect，替换掉之前的。某种意义上来说，effect 更像是渲染结果的一部分 -- 每个 effect “属于”一次特定的渲染。我们将在[本页后面(#explanation-why-effects-run-on-each-update)]更清楚地看到为什么这很有意义。

>Tip
>
> 与 `componentDidMount` 或 `componentDidUpdate` 不同，使用 `useEffect` 调度的 effect 不会阻止浏览器更新屏幕，这让你的 app 看起来响应更快。大多数情况下，effect 不需要同步地执行。 在个别情况下（例如测量布局），有一个单独的 [`useLayoutEffect`](/docs/hooks-reference.html#uselayouteffect) Hook，其API与`useEffect`相同。

## 须要清理的 Effect

之前，我们研究了如何使用不需要任何清理的副作用，还有一些 effect 是需要清理的。例如**我们可能需要订阅一些外部数据源**。这种情况下，清理工作是非常重要的，防止我们引起内存泄露！现在让我们来比较一下如何用 Class 和 Hooks 来实现。

### 使用 Class 的示例 {#example-using-classes-1}

在 React class 中，你通常会在 `componentDidMount` 中设置订阅，并在 `componentWillUnmount` 中清理它。 例如，假设我们有一个 `ChatAPI` 模块，它允许我们订阅好友的在线状态。以下是我们如何使用 class 订阅和显示该状态：

```js{8-26}
class FriendStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isOnline: null };
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  handleStatusChange(status) {
    this.setState({
      isOnline: status.isOnline
    });
  }

  render() {
    if (this.state.isOnline === null) {
      return 'Loading...';
    }
    return this.state.isOnline ? 'Online' : 'Offline';
  }
}
```

你会注意到 `componentDidMount` 和 `componentWillUnmount` 之间相互依赖。生命周期函数让我们只能拆分这些逻辑，即使他们中的代码都是服务于同一个功能。

>Note
>
>眼尖的读者可能已经注意到了，这个示例还需要一个 `componentDidUpdate` 方法是完全正确的。我们先暂时忽略这一点，并在本页的[后面一部分](#explanation-why-effects-run-on-each-update)再关注它。

### 使用 Hooks 的示例

让我们看看我们如何用 Hook 编写这个组件。

您可能认为我们需要单独的 effect 来执行清理工作。但因为添加和删除订阅的代码是如此紧密相关，所以 `useEffect` 的设计是让他们保持在同一个地方。如果你的 effect 返回了一个函数， React 将会在清理的时候执行它。

```js{10-16}
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    // Specify how to clean up after this effect:
    return function cleanup() {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

**为什么我们要在 effect 中返回一个函数？**这是 effect 可选的清理机制。每一个 effect 都可以返回一个它的清理函数。这让我们可以将添加和移除订阅的逻辑放在一起。他们都是同一个 effect 的一部分。

**React 什么时候清理一个 effect？**React 在组件卸载的时候执行清理。正如我们之前学到的， effect 在每次渲染的时候都会执行。这就是为什么 React *还会*在执行 effect 之前对上一个 effect 进行清理。我们稍后将讨论[为什么这有助于避免 bug](#explanation-why-effects-run-on-each-update)以及[如何在发生性能问题时选择跳过此行为](#tip-optimizing-performance-by-skipping-effects)。

>Note
>
>我们并不是必须在 effect 中返回一个命名的函数。这里我们将其命名为 `cleanup` 是为了表明此函数的目的，但其实也可以返回一个箭头函数或者给它命一个别的名字

## 小结 {#recap}

我们已经了解了 `useEffect` 让我们可以在组件渲染后实现各种不同的副作用。有些副作用可能须要清理，所以他们会返回一个函数：

```js
  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
```

其他的 effect 可能没有清理阶段，所以不需要返回。

```js
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });
```

Effect Hook 使用同一个 API 来满足这两种情况。

-------------

**如果你感觉你对 Effect Hook 的机制已经有很好的把握，或者你感到不解，你现在可以跳转到[关于 Hook 规则的下一页](/docs/hooks-rules.html)**

-------------

## 使用 Effect 的 Tip {#tips-for-using-effects}

在本页中我们将继续深入了解 `useEffect` 的某些方面，有经验的 React 使用者可能会对此感兴趣。你不一定要在现在了解他们，你可以随时返回此页面以了解有关 Effect Hook 的更多详细信息。

### Tip: 使用多个 Effect 来隔离不同的问题 {#tip-use-multiple-effects-to-separate-concerns}

我们使用 Hooks 其中一个[目的](/docs/hooks-intro.html#complex-components-become-hard-to-understand)就是要解决 class 中生命周期函数经常包含了不相关的逻辑，但又把相关的逻辑分隔到几个不同的方法中的问题。下面这是一个组合了前面示例中的计数器和朋友状态指示器逻辑的组件

```js
class FriendStatusWithCounter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0, isOnline: null };
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  componentDidMount() {
    document.title = `You clicked ${this.state.count} times`;
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentDidUpdate() {
    document.title = `You clicked ${this.state.count} times`;
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  handleStatusChange(status) {
    this.setState({
      isOnline: status.isOnline
    });
  }
  // ...
```

可以看到设置 `document.title` 的逻辑是如何被分割到 `componentDidMount` 和 `componentDidUpdate` 中的，订阅逻辑又是如何被分割到 `componentDidMount` 和 `componentWillUnmount` 中。而且 `componentDidMount` 中同时包含了两个不同功能的代码。

那么 Hooks 如何解决这个问题呢？就像[你可以使用多个 *State* Hook](/docs/hooks-state.html#tip-using-multiple-state-variables) 一样，你也可以使用多个 effect。这让我们将不相关的逻辑分到不同的 effect 中

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
}
```

**Hook 允许我们按照代码的用途分割他们**，而不是像生命周期函数那样。React 将按照 effect 声明的顺序依次调用组件中的*每一个* effct

### Explanation: 为什么每次更新的时候都要运行 Effect {#explanation-why-effects-run-on-each-update}

If you're used to classes, you might be wondering why the effect cleanup phase happens after every re-render, and not just once during unmounting. Let's look at a practical example to see why this design helps us create components with fewer bugs.
如果你已经习惯了使用 class，那么你可能会想知道为什么 effect 在每次重渲染时都会执行，而不是只在卸载组件的时候执行一次。让我们看一个实际的例子，看看为什么这个设计可以帮助我们创建 bug 更少的组件。

在[本页前面](#example-using-classes-1)，我们介绍了一个用于显示好友是否在线的 `FriendStatus` 组件。我们的 class 从 props 中读取 `friend.id`，在组件挂载后订阅好友的状态，并在卸载组件的时候取消订阅：

```js
  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }
```

**但是当组件已经显示在屏幕上时，`friend` prop 发生变化会发生什么？**我们的组件将继续展示原来的好友状态。这是一个 bug。而且我们还会因为取消订阅时使用错误的好友 ID 导致内存泄露或崩溃的问题。

在一个类定义组件中，我们需要加上 `componentDidUpdate` 来解决这个问题：

```js{8-19}
  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentDidUpdate(prevProps) {
    // Unsubscribe from the previous friend.id
    ChatAPI.unsubscribeFromFriendStatus(
      prevProps.friend.id,
      this.handleStatusChange
    );
    // Subscribe to the next friend.id
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }
```

忘记正确地处理 `componentDidUpdate` 是 React 应用中一个常见的错误来源。

现在看一下使用 Hook 的这个版本：

```js
function FriendStatus(props) {
  // ...
  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
```

它并不会受到这个 bug 的影响。(虽然我们没有对它做任何改动。)

我们并不需要特定的代码来处理更新的逻辑，因为 `useEffect` *默认*就会处理。它会在调用一个 effect 之前对前一个进行清理。为了说明这一点，下面按时间列出一个可能会产生的订阅和取消订阅操作调用序列：

```js
// Mount with { friend: { id: 100 } } props
ChatAPI.subscribeToFriendStatus(100, handleStatusChange);     // Run first effect

// Update with { friend: { id: 200 } } props
ChatAPI.unsubscribeFromFriendStatus(100, handleStatusChange); // Clean up previous effect
ChatAPI.subscribeToFriendStatus(200, handleStatusChange);     // Run next effect

// Update with { friend: { id: 300 } } props
ChatAPI.unsubscribeFromFriendStatus(200, handleStatusChange); // Clean up previous effect
ChatAPI.subscribeToFriendStatus(300, handleStatusChange);     // Run next effect

// Unmount
ChatAPI.unsubscribeFromFriendStatus(300, handleStatusChange); // Clean up last effect
```

这样的默认行为保证了一致性，避免了在类定义组件中常见的，由于没有处理更新逻辑而导致的 bug。

### 提示: 通过跳过 Effect 进行性能优化 {#tip-optimizing-performance-by-skipping-effects}

在某些情况下，每次渲染后都执行清理或者执行 effect 可能会导致性能问题。在 class 组件中，我们可以通过在 `componentDidUpdate` 中加入一些对 `prevProps` 或 `prevState` 进行比较的逻辑解决：

```js
componentDidUpdate(prevProps, prevState) {
  if (prevState.count !== this.state.count) {
    document.title = `You clicked ${this.state.count} times`;
  }
}
```

这是一个很常见的需求，所以它被内置到了 `useEffect` Hook API 中。如果某些特定值在两次重渲染之间没有发生变化，你可以告诉 React **跳过**对 effect 的调用，只要传递一个数组作为 `useEffect` 的第二个可选参数就可以了：

```js{3}
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]); // Only re-run the effect if count changes
```

上面这个示例中，我们传入 `[count]` 作为第二个参数。这个参数是什么作用呢？如果 `count` 的值是 `5`，而且我们的组件重渲染的时候 `count` 还是等于 `5`，React 将对前一次渲染的 `[5]` 和后一次渲染的 `[5]` 进行比较。因为数组中的所有元素都是相等的(`5 === 5`)，React 会跳过这个 effect，这就实现了性能的优化。

当我们渲染的时候，如果 `count` 的值更新成了 `6`，React 将会把前一次渲染时的数组 `[5]` 和这次渲染的数组 `[6]` 中的元素进行对比。这次因为 `5 !== 6`，React 就会再次调用 effect。如果数组中有多个元素，即使只有一个元素发生变化，React 也会执行 effect。

对于有清理阶段的 effect 这也是同样有效的：

```js{6}
useEffect(() => {
  ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
  return () => {
    ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
  };
}, [props.friend.id]); // Only re-subscribe if props.friend.id changes
```

将来，第二个参数可能会在构建时自动添加。

>Note
>
>如果你要使用这个优化，请确保数组中包含了**所有外部作用域中会随时间变化并且在 effect 中使用的变量**，否则你的代码会引用到先前渲染中陈旧的变量。我们在[Hooks API 参考](/docs/hooks-reference.html)中还讨论了其他的优化选项。
>
>如果你想要执行一个只运行一次的 effect(仅在组件加载和卸载时执行)，你可以传递一个空数组(`[]`)作为第二个参数。这就告诉 React 你的 effect 不依赖于 proprs 或 state 中的任何值，所以它永远都不需要重复执行。这并不算是一种特殊情况 -- 它依然遵循输入数组的工作方式。虽然传递 `[]` 更接近于我们熟悉的 `componentDidMount` 和 `componentWillUnmount`，但我们建议不要将它作为一种习惯，因为这经常会[像之前讨论的那样](#explanation-why-effects-run-on-each-update)导致 bug。不要忘记 React 将 `useEffect` 的运行延迟到浏览器完成绘制之后，所以做一些额外的工作并不是什么问题。

## 下一步 {#next-steps}

恭喜你！这是一个很长的页面，希望最后你关于 effect 的大多数问题都得到了解答。你已经学习了 State Hook 和 Effect Hook，将它们结合起来你可以做很多事情了。它们涵盖了大多数使用 class 的用例 - 如果没有，您可能须要[其他的 Hook](/docs/hooks-reference.html)。

我们也看到了 Hook 如何解决[使用目的部分](/docs/hooks-intro.html#motivation)中提到的问题。我们看到 effect 的清理机制如何避免重复地使用 `componentDidUpdate` 和 `componentWillUnmount`，同时让相关的代码关联更加紧密，帮助我们避免一些 bug。我们还看到了我们如何根据 effect 的功能分隔他们，这是在 class 中无法做到的。

此时你可能会好奇 Hook 是如何工作的。在两次渲染间，React如何知道哪个 `useState` 调用对应于哪个 state 变量？Reat 又是如何匹配前后两次渲染中的每一个 effect 的？**在下一页中我们会学习[使用 Hooks 的规则](/docs/hooks-rules.html) -- 他们对 Hook 的工作至关重要。**
