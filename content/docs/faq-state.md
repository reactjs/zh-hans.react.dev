---
id: faq-state
title: 组件状态
permalink: docs/faq-state.html
layout: docs
category: FAQ
---

### `setState` 实际做了什么？ {#what-does-setstate-do}

`setState()` 会对一个组件的 `state` 对象安排一次更新。当 state 改变了，该组件就会重新渲染。

### `state` 和 `props` 之间的区别是什么？  {#what-is-the-difference-between-state-and-props}

[`props`](/docs/components-and-props.html)（“properties” 的缩写）和 [`state`](/docs/state-and-lifecycle.html) 都是普通的 JavaScript 对象。它们都是用来保存信息的，这些信息可以控制组件的渲染输出，而它们的一个重要的不同点就是：`props` 是传递*给*组件的（类似于函数的形参），而 `state` 是在组件*内*被组件自己管理的（类似于在一个函数内声明的变量）。

下面是一些不错的资源，可以用来进一步了解使用 `props` 或 `state` 的最佳时机：
* [Props vs State](https://github.com/uberVU/react-guide/blob/master/props-vs-state.md)
* [ReactJS: Props vs. State](https://lucybain.com/blog/2016/react-state-vs-pros/)

### 为什么 `setState` 给了我一个错误的值？ {#why-is-setstate-giving-me-the-wrong-value}

在 React 中，`this.props` 和 `this.state` 都代表着*已经被渲染了的*值，即当前屏幕上显示的值。

调用 `setState` 其实是异步的 —— 不要指望在调用 `setState` 之后，`this.state` 会立即映射为新的值。如果你需要基于当前的 state 来计算出新的值，那你应该传递一个函数，而不是一个对象（详情见下文）。

代码*不会*像预期那样运行的示例：

```jsx
incrementCount() {
  // 注意：这样 *不会* 像预期的那样工作。
  this.setState({count: this.state.count + 1});
}

handleSomething() {
  // 假设 `this.state.count` 从 0 开始。
  this.incrementCount();
  this.incrementCount();
  this.incrementCount();
  // 当 React 重新渲染该组件时，`this.state.count` 会变为 1，而不是你期望的 3。

  // 这是因为上面的 `incrementCount()` 函数是从 `this.state.count` 中读取数据的，
  // 但是 React 不会更新 `this.state.count`，直到该组件被重新渲染。
  // 所以最终 `incrementCount()` 每次读取 `this.state.count` 的值都是 0，并将它设为 1。

  // 问题的修复参见下面的说明。
}
```

参见下面的说明来修复这个问题。

### 我应该如何更新那些依赖于当前的 state 的 state 呢？ {#how-do-i-update-state-with-values-that-depend-on-the-current-state}

给 `setState` 传递一个函数，而不是一个对象，就可以确保每次的调用都是使用最新版的 state（见下面的说明）。

### 给 `setState` 传递一个对象与传递一个函数的区别是什么？ {#what-is-the-difference-between-passing-an-object-or-a-function-in-setstate}

传递一个函数可以让你在函数内访问到当前的 state 的值。因为 `setState` 的调用是分批的，所以你可以链式地进行更新，并确保它们是一个建立在另一个之上的，这样才不会发生冲突：

```jsx
incrementCount() {
  this.setState((state) => {
    // 重要：在更新的时候读取 `state`，而不是 `this.state`。
    return {count: state.count + 1}
  });
}

handleSomething() {
  // 假设 `this.state.count` 从 0 开始。
  this.incrementCount();
  this.incrementCount();
  this.incrementCount();

  // 如果你现在在这里读取 `this.state.count`，它还是会为 0。
  // 但是，当 React 重新渲染该组件时，它会变为 3。
}
```

[学习更多有关 setState 的内容](/docs/react-component.html#setstate)

### `setState` 什么时候是异步的？ {#when-is-setstate-asynchronous}

目前，在事件处理函数内部的 `setState` 是异步的。

例如，如果 `Parent` 和 `Child` 在同一个 click 事件中都调用了 `setState` ，这样就可以确保 `Child` 不会被重新渲染两次。取而代之的是，React 会将该 state “冲洗” 到浏览器事件结束的时候，再统一地进行更新。这种机制可以在大型应用中得到很好的性能提升。

这只是一个实现的细节，所以请不要直接依赖于这种机制。在以后的版本当中，React 会在更多的情况下静默地使用 state 的批量更新机制。

### 为什么 React 不同步地更新 `this.state`？ {#why-doesnt-react-update-thisstate-synchronously}

如前面章节解释的那样，在开始重新渲染之前，React 会有意地进行“等待”，直到所有在组件的事件处理函数内调用的 `setState()` 完成之后。这样可以通过避免不必要的重新渲染来提升性能。

但是，你可能还是会想，为什么 React 不能立即更新 `this.state`，而不对组件进行重新渲染呢。

主要有两个原因：

* 这样会破坏掉 `props` 和 `state` 之间的一致性，造成一些难以 debug 的问题。
* 这样会让一些我们正在实现的新功能变得无法实现。

这个 [GitHub 评论](https://github.com/facebook/react/issues/11527#issuecomment-360199710) 深入了该特殊示例。

### 我应该使用一个像 Redux 或 MobX 那样的 state 管理库吗？ {#should-i-use-a-state-management-library-like-redux-or-mobx}

[或许需要。](https://redux.js.org/faq/general#when-should-i-use-redux)

在添加额外的库之前，最好先了解清楚 React 能干什么。你也可以只使用 React 来构建出一个比较复杂的应用。
