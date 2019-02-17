---
id: hooks-state
title: 使用 Effect Hook
permalink: docs/hooks-effect.html
next: hooks-rules.html
prev: hooks-intro.html
---

*Hooks* are a new addition in React 16.8. They let you use state and other React features without writing a class.
*Hooks* 是 React 16.8 的新增特性。它可以让你在不使用 class 的情况下使用 state 和一些其他 React 功能。

The *Effect Hook* lets you perform side effects in function components:
*Effect Hook* 让你可以在函数定义组件中执行一些副作用(side effect)操作

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

This snippet is based on the [counter example from the previous page](/docs/hooks-state.html), but we added a new feature to it: we set the document title to a custom message including the number of clicks.
这段代码是基于[上一页中的计数器示例](/docs/hooks-state.html)修改的，我们为计数器增加了一个小功能：将 document 的 title 设置为一句包含了点击次数的消息

Data fetching, setting up a subscription, and manually changing the DOM in React components are all examples of side effects. Whether or not you're used to calling these operations "side effects" (or just "effects"), you've likely performed them in your components before.
数据获取，设置订阅以及手动更改 React 组件中的 DOM 都是副作用的示例。无论你之前是否将他们称为"副作用"（可能就是你想要的效果），应该都在组件中使用过了。


>Tip
>
>If you're familiar with React class lifecycle methods, you can think of `useEffect` Hook as `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount` combined.
>如果你熟悉 React class 的生命周期函数，你可以把 `useEffect` Hooks 看做 `componentDidMount` 和 `componentWillUnmount` 这两个函数的结合

There are two common kinds of side effects in React components: those that don't require cleanup, and those that do. Let's look at this distinction in more detail.
通常来说在 React 组件中有两种副作用操作：须要清理的和不需要清理的。我们来更仔细地看一下他们之间的区别

## Effects Without Cleanup {#effects-without-cleanup}
## 无需清理的 Effect {#effects-without-cleanup}

Sometimes, we want to **run some additional code after React has updated the DOM.** Network requests, manual DOM mutations, and logging are common examples of effects that don't require a cleanup. We say that because we can run them and immediately forget about them. Let's compare how classes and Hooks let us express such side effects.
有时候，我们只是想**在 React 更新 DOM 之后运行一些额外的代码。**比如发送网络请求，手动变更 DOM，记录日志，这些都是常见的无需清理的操作。因为我们在执行完这些操作之后，就可以忽略他们了。

### Example Using Classes {#example-using-classes}
### 使用 class 的示例 {#example-using-classes}

In React class components, the `render` method itself shouldn't cause side effects. It would be too early -- we typically want to perform our effects *after* React has updated the DOM.
在 React 的类定义组件中，`render` 函数是不应该有任何副作用的。一般来说，在这里执行操作太早了，我们基本上都希望在 React 更新 DOM 之后才执行我们的操作。

This is why in React classes, we put side effects into `componentDidMount` and `componentDidUpdate`. Coming back to our example, here is a React counter class component that updates the document title right after React makes changes to the DOM:
这就是为什么在 React 类中，我们把副作用操作放到 `componentDidMount` 和 `componentDidUpdate` 函数中。回到我们的示例中来，这是一个 React 计数器类定义组件。它在 Ract 对 DOM 进行操作之后，立刻更新了 document 的 title 属性

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

Note how **we have to duplicate the code between these two lifecycle methods in class.**
为什么**在这个 class 中我们需要在两个生命周期函数中写重复的代码**

This is because in many cases we want to perform the same side effect regardless of whether the component just mounted, or if it has been updated. Conceptually, we want it to happen after every render -- but React class components don't have a method like this. We could extract a separate method but we would still have to call it in two places.
这是因为很多情况下我们希望在组件加载和更新时执行同样的操作。从概念上说，我们希望它在每次渲染之后执行 ———— 但 React 的类定义组件没有提供这样的方法。即使我们提取出一个方法，我们还是要在两个地方调用它。

Now let's see how we can do the same with the `useEffect` Hook.
现在让我们来看看如何使用 `useEffect` Hook 做同样的事情。

### Example Using Hooks {#example-using-hooks}
### 使用 Hooks 的示例 {#example-using-hooks}

We've already seen this example at the top of this page, but let's take a closer look at it:
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

**What does `useEffect` do?** By using this Hook, you tell React that your component needs to do something after render. React will remember the function you passed (we'll refer to it as our "effect"), and call it later after performing the DOM updates. In this effect, we set the document title, but we could also perform data fetching or call some other imperative API.
**`useEffect` 做了什么？** 通过使用这个 Hook，你告诉 React 您的组件需要在渲染后执行某些操作。React会记住你传递的函数(我们将它称之为 "effect")，并且在执行 DOM 更新之后调用它。在这个 effect 中，我们设置了 document 的 title 属性，另外我们也可以执行数据获取或调用其他命令式 API。

**Why is `useEffect` called inside a component?** Placing `useEffect` inside the component lets us access the `count` state variable (or any props) right from the effect. We don't need a special API to read it -- it's already in the function scope. Hooks embrace JavaScript closures and avoid introducing React-specific APIs where JavaScript already provides a solution.
**为什么在组件内部调用 `useEffect`？** 将 `useEffect` 放在组件内部让我们可以在 effect 中直接访问 `count` state 变量(或其他 props)。我们不需要特殊的 API 来读取它 -- 他已经在作用域中了。Hooks 使用 JavaScript 的闭包机制，而不是在 JavaScript 已经提供了解决方案的情况下还引入特定的 React API。

**Does `useEffect` run after every render?** Yes! By default, it runs both after the first render *and* after every update. (We will later talk about [how to customize this](#tip-optimizing-performance-by-skipping-effects).) Instead of thinking in terms of "mounting" and "updating", you might find it easier to think that effects happen "after render". React guarantees the DOM has been updated by the time it runs the effects.
**`useEffect` 会在每次渲染后都执行吗？**是的，默认情况下，它在第一次渲染之后*和*每次更新之后都运行。(我们稍后会谈到[如何控制它](#tip-optimizing-performance-by-skipping-effects)。)你可能会更容易接受 effect 发生在"渲染之后"这种概念，不用再去考虑"挂载"还是"更新"。React 保证了每次运行 effect 的时候，DOM 都已经更新完毕

### Detailed Explanation {#detailed-explanation}
### 详细说明 {#detailed-explanation}

Now that we know more about effects, these lines should make sense:
现在我们已经对 effect 有了一些了解，下面这些代码应该不难看懂了：

```js
function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });
```

We declare the `count` state variable, and then we tell React we need to use an effect. We pass a function to the `useEffect` Hook. This function we pass *is* our effect. Inside our effect, we set the document title using the `document.title` browser API. We can read the latest `count` inside the effect because it's in the scope of our function. When React renders our component, it will remember the effect we used, and then run our effect after updating the DOM. This happens for every render, including the first one.
我们声明了 `count` state 变量，接着告诉 React 我们需要使用一个 effect。接着传递一个函数给 `useEffect` Hook。这个函数就是我们的 effect。然后使用 `document.title` 浏览器 API设置 document 的 title。我们可以在 effct 中获取到最新的 `count` 值，因为他在函数的作用域内。当 React 渲染我们的组件时，会记住我们使用的 effect，并在更新完 DOM 后运行它。这个过程在每次渲染时都会发生，包括首次渲染。

Experienced JavaScript developers might notice that the function passed to `useEffect` is going to be different on every render. This is intentional. In fact, this is what lets us read the `count` value from inside the effect without worrying about it getting stale. Every time we re-render, we schedule a _different_ effect, replacing the previous one. In a way, this makes the effects behave more like a part of the render result -- each effect "belongs" to a particular render. We will see more clearly why this is useful [later on this page](#explanation-why-effects-run-on-each-update).
经验丰富的JavaScript开发人员可能会注意到，传递给`useEffect`的函数在每个渲染中都会有所不同，这是刻意为之的。事实上这正是我们可以在 effect 中获取最新的 `count` 的值，而不用担心其过期的原因。每次我们重新渲染，都会生成一个_新的_ effect，替换掉之前的。某种意义上来说，effect 更像是渲染结果的一部分 -- 每个 effect "属于"一次特定的渲染。我们将在[本页后面(#explanation-why-effects-run-on-each-update)]更清楚地看到为什么这很有意义。

>Tip
>
>Unlike `componentDidMount` or `componentDidUpdate`, effects scheduled with `useEffect` don't block the browser from updating the screen. This makes your app feel more responsive. The majority of effects don't need to happen synchronously. In the uncommon cases where they do (such as measuring the layout), there is a separate [`useLayoutEffect`](/docs/hooks-reference.html#uselayouteffect) Hook with an API identical to `useEffect`.
> 与 `componentDidMount` 或 `componentDidUpdate` 不同，使用 `useEffect` 调度的 effect 不会阻止浏览器更新屏幕，这让你的 app 看起来响应更快。大多数情况下，effect 不需要同步地执行。 在个别情况下（例如测量布局），有一个单独的 [`useLayoutEffect`](/docs/hooks-reference.html#uselayouteffect) Hook，其API与`useEffect`相同。

## Effects with Cleanup {#effects-with-cleanup}
## 须要清理的 Effect

Earlier, we looked at how to express side effects that don't require any cleanup. However, some effects do. For example, **we might want to set up a subscription** to some external data source. In that case, it is important to clean up so that we don't introduce a memory leak! Let's compare how we can do it with classes and with Hooks.
之前，我们研究了如何使用不需要任何清理的副作用，还有一些 effect 是需要清理的。例如**我们可能需要订阅一些外部数据源**。这种情况下，清理工作是非常重要的，防止我们引起内存泄露！现在让我们来比较一下如何用 Class 和 Hooks 来实现。

### Example Using Classes {#example-using-classes-1}
### 使用 Class 的sh示例'i'l {#example-using-classes-1}

In a React class, you would typically set up a subscription in `componentDidMount`, and clean it up in `componentWillUnmount`. For example, let's say we have a `ChatAPI` module that lets us subscribe to a friend's online status. Here's how we might subscribe and display that status using a class:

在 React class 中，你通常会在 `componentDidMount` 中设置订阅，并在 `componentWillUnmount` 中清理它。 例如，假设我们有一个 `ChatAPI` 模块，它允许我们订阅朋友的在线状态。以下是我们如何使用 class 订阅和显示该状态：

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

Notice how `componentDidMount` and `componentWillUnmount` need to mirror each other. Lifecycle methods force us to split this logic even though conceptually code in both of them is related to the same effect.
你会注意到 `componentDidMount` 和 `componentWillUnmount` 之间相互依赖。生命周期函数让我们只能拆分这些逻辑，即使他们中的代码都是服务于同一个功能。


>Note
>
>Eagle-eyed readers may notice that this example also needs a `componentDidUpdate` method to be fully correct. We'll ignore this for now but will come back to it in a [later section](#explanation-why-effects-run-on-each-update) of this page.
>眼尖的读者可能已经注意到了，这个示例还需要一个 `componentDidUpdate` 方法是完全正确的。我们先暂时忽略这一点，并在本页的[后面一部分](#explanation-why-effects-run-on-each-update)再关注它。


### Example Using Hooks {#example-using-hooks-1}
### 使用 Hooks 的示例

Let's see how we could write this component with Hooks.
让我们看看我们如何用 Hooks 编写这个组件。

You might be thinking that we'd need a separate effect to perform the cleanup. But code for adding and removing a subscription is so tightly related that `useEffect` is designed to keep it together. If your effect returns a function, React will run it when it is time to clean up:
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

**Why did we return a function from our effect?** This is the optional cleanup mechanism for effects. Every effect may return a function that cleans up after it. This lets us keep the logic for adding and removing subscriptions close to each other. They're part of the same effect!
**为什么我们要在 effect 中返回一个函数？**这是 effect 可选的清理机制。每一个 effect 都可以返回一个他的清理函数。这让我们可以将添加和移除订阅的逻辑放在一起。他们都是同一个 effect 的一部分。

**When exactly does React clean up an effect?** React performs the cleanup when the component unmounts. However, as we learned earlier, effects run for every render and not just once. This is why React *also* cleans up effects from the previous render before running the effects next time. We'll discuss [why this helps avoid bugs](#explanation-why-effects-run-on-each-update) and [how to opt out of this behavior in case it creates performance issues](#tip-optimizing-performance-by-skipping-effects) later below.
**React 什么时候清理一个 effect？**React 在组件卸载的时候执行清理。正如我们之前学到的， effect 在每次渲染的时候都会执行。这就是为什么 React *还会*在执行 effect 之前对上一个 effect 进行清理。我们稍后将讨论[为什么这有助于避免 bug](#explanation-why-effects-run-on-each-update)以及[如何在发生性能问题时选择跳过此行为](#tip-optimizing-performance-by-skipping-effects)。

>Note
>
>We don't have to return a named function from the effect. We called it `cleanup` here to clarify its purpose, but you could return an arrow function or call it something different.
>我们并不是必须在 effect 中返回一个命名的函数。这里我们将其命名为 `cleanup` 是为了表明此函数的目的，但其实也可以返回一个箭头函数或者给它命一个别的名字

## Recap {#recap}
## 小结 {#recap}

We've learned that `useEffect` lets us express different kinds of side effects after a component renders. Some effects might require cleanup so they return a function:
我们已经了解了 `useEffect` 让我们可以在组件渲染后实现各种不同的副作用。有些副作用可能须要清理，所以他们会返回一个函数。


```js
  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
```

Other effects might not have a cleanup phase, and don't return anything.
其他的 effect 可能没有清理阶段，所以不需要返回。

```js
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });
```

The Effect Hook unifies both use cases with a single API.
Effect Hook 使用同一个 API 来满足这两种情况。

-------------

**If you feel like you have a decent grasp on how the Effect Hook works, or if you feel overwhelmed, you can jump to the [next page about Rules of Hooks](/docs/hooks-rules.html) now.**
**如果你感觉你对 Effect Hook 的机制已经有很好的把握，或者你感到不知所措，你现在可以跳转到[关于 Hook 规则的下一页](/docs/hooks-rules.html)**

-------------

## Tips for Using Effects {#tips-for-using-effects}
## 使用 Effect 的 Tip {#tips-for-using-effects}

We'll continue this page with an in-depth look at some aspects of `useEffect` that experienced React users will likely be curious about. Don't feel obligated to dig into them now. You can always come back to this page to learn more details about the Effect Hook.
在本页中我们将继续深入了解 `useEffect` 的某些方面，有经验的 React 使用者可能会对此感兴趣。你不一定要在现在了解他们，你可以随时返回此页面以了解有关 Effect Hook 的更多详细信息。

### Tip: Use Multiple Effects to Separate Concerns {#tip-use-multiple-effects-to-separate-concerns}
### Tip: 使用多个 Effect 来隔离不同的问题 {#tip-use-multiple-effects-to-separate-concerns}

One of the problems we outlined in the [Motivation](/docs/hooks-intro.html#complex-components-become-hard-to-understand) for Hooks is that class lifecycle methods often contain unrelated logic, but related logic gets broken up into several methods. Here is a component that combines the counter and the friend status indicator logic from the previous examples:
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

Note how the logic that sets `document.title` is split between `componentDidMount` and `componentDidUpdate`. The subscription logic is also spread between `componentDidMount` and `componentWillUnmount`. And `componentDidMount` contains code for both tasks.
可以看到设置 `document.title` 的逻辑是如何被分割到 `componentDidMount` 和 `componentDidUpdate` 中的，订阅逻辑又是如何被分割到 `componentDidMount` 和 `componentWillUnmount` 中。而且 `componentDidMount` 中同时包含了两个不同功能的代码。

So, how can Hooks solve this problem? Just like [you can use the *State* Hook more than once](/docs/hooks-state.html#tip-using-multiple-state-variables), you can also use several effects. This lets us separate unrelated logic into different effects:

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

**Hooks lets us split the code based on what it is doing** rather than a lifecycle method name. React will apply *every* effect used by the component, in the order they were specified.

### Explanation: Why Effects Run on Each Update {#explanation-why-effects-run-on-each-update}

If you're used to classes, you might be wondering why the effect cleanup phase happens after every re-render, and not just once during unmounting. Let's look at a practical example to see why this design helps us create components with fewer bugs.

[Earlier on this page](#example-using-classes-1), we introduced an example `FriendStatus` component that displays whether a friend is online or not. Our class reads `friend.id` from `this.props`, subscribes to the friend status after the component mounts, and unsubscribes during unmounting:

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

**But what happens if the `friend` prop changes** while the component is on the screen? Our component would continue displaying the online status of a different friend. This is a bug. We would also cause a memory leak or crash when unmounting since the unsubscribe call would use the wrong friend ID.

In a class component, we would need to add `componentDidUpdate` to handle this case:

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

Forgetting to handle `componentDidUpdate` properly is a common source of bugs in React applications.

Now consider the version of this component that uses Hooks:

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

It doesn't suffer from this bug. (But we also didn't make any changes to it.)

There is no special code for handling updates because `useEffect` handles them *by default*. It cleans up the previous effects before applying the next effects. To illustrate this, here is a sequence of subscribe and unsubscribe calls that this component could produce over time:

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

This behavior ensures consistency by default and prevents bugs that are common in class components due to missing update logic.

### Tip: Optimizing Performance by Skipping Effects {#tip-optimizing-performance-by-skipping-effects}

In some cases, cleaning up or applying the effect after every render might create a performance problem. In class components, we can solve this by writing an extra comparison with `prevProps` or `prevState` inside `componentDidUpdate`:

```js
componentDidUpdate(prevProps, prevState) {
  if (prevState.count !== this.state.count) {
    document.title = `You clicked ${this.state.count} times`;
  }
}
```

This requirement is common enough that it is built into the `useEffect` Hook API. You can tell React to *skip* applying an effect if certain values haven't changed between re-renders. To do so, pass an array as an optional second argument to `useEffect`:

```js{3}
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]); // Only re-run the effect if count changes
```

In the example above, we pass `[count]` as the second argument. What does this mean? If the `count` is `5`, and then our component re-renders with `count` still equal to `5`, React will compare `[5]` from the previous render and `[5]` from the next render. Because all items in the array are the same (`5 === 5`), React would skip the effect. That's our optimization.

When we render with `count` updated to `6`, React will compare the items in the `[5]` array from the previous render to items in the `[6]` array from the next render. This time, React will re-apply the effect because `5 !== 6`. If there are multiple items in the array, React will re-run the effect even if just one of them is different.

This also works for effects that have a cleanup phase:

```js{6}
useEffect(() => {
  ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
  return () => {
    ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
  };
}, [props.friend.id]); // Only re-subscribe if props.friend.id changes
```

In the future, the second argument might get added automatically by a build-time transformation.

>Note
>
>If you use this optimization, make sure the array includes **any values from the outer scope that change over time and that are used by the effect**. Otherwise, your code will reference stale values from previous renders. We'll also discuss other optimization options in the [Hooks API reference](/docs/hooks-reference.html).
>
>If you want to run an effect and clean it up only once (on mount and unmount), you can pass an empty array (`[]`) as a second argument. This tells React that your effect doesn't depend on *any* values from props or state, so it never needs to re-run. This isn't handled as a special case -- it follows directly from how the inputs array always works. While passing `[]` is closer to the familiar `componentDidMount` and `componentWillUnmount` mental model, we suggest not making it a habit because it often leads to bugs, [as discussed above](#explanation-why-effects-run-on-each-update). Don't forget that React defers running `useEffect` until after the browser has painted, so doing extra work is less of a problem.

## Next Steps {#next-steps}

Congratulations! This was a long page, but hopefully by the end most of your questions about effects were answered. You've learned both the State Hook and the Effect Hook, and there is a *lot* you can do with both of them combined. They cover most of the use cases for classes -- and where they don't, you might find the [additional Hooks](/docs/hooks-reference.html) helpful.

We're also starting to see how Hooks solve problems outlined in [Motivation](/docs/hooks-intro.html#motivation). We've seen how effect cleanup avoids duplication in `componentDidUpdate` and `componentWillUnmount`, brings related code closer together, and helps us avoid bugs. We've also seen how we can separate effects by their purpose, which is something we couldn't do in classes at all.

At this point you might be questioning how Hooks work. How can React know which `useState` call corresponds to which state variable between re-renders? How does React "match up" previous and next effects on every update? **On the next page we will learn about the [Rules of Hooks](/docs/hooks-rules.html) -- they're essential to making Hooks work.**
