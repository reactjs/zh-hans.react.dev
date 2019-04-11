---
title: 警告：Refs 属性必须有所有者
layout: single
permalink: warnings/refs-must-have-owner.html
---

你能到这个页面很可能是因为你看到了以下错误信息：

*React 16.0.0+*
> Warning:
>
> Element ref was specified as a string (myRefName) but no owner was set. You may have multiple copies of React loaded. (details: https://fb.me/react-refs-must-have-owner).

*早期版本的 React*
> Warning:
>
> addComponentAsRefTo(...): Only a ReactOwner can have refs. You might be adding a ref to a component that was not created inside a component's `render` method, or you have multiple copies of React loaded.

这通常意味着以下三种原因之一：

- 你试图给一个函数组件添加 `ref`；
- 你试图把 `ref` 添加到一个在 render() 函数之外生成的元素上；
- 你加载了多个不同的（冲突的） React 副本（比方说是由配置错误的 npm 依赖所引起）。

## 函数组件上的 Refs {#refs-on-function-components}

如果 `<Foo>` 是一个函数组件，那么你不能给它添加 ref：

```js
// 如果 Foo 是一个函数，那么这样将不起作用！
<Foo ref={foo} />
```

如果你需要为一个组件添加 ref，首先将组件转换为 class，或者考虑不要使用 refs，因为它们 [是非必要的](/docs/refs-and-the-dom.html#when-to-use-refs)。

## 在 Render 方法外的字符串型 Refs {#strings-refs-outside-the-render-method}

这通常意味着你试图将 ref 添加到没有所有者的组件上（即，不是在某个组件的 `render` 方法中创建的）。举个例子，下述代码是不起作用的：

```js
// 不起作用！
ReactDOM.render(<App ref="app" />, el);
```

试试在顶层组件内渲染该组件，由该组件保存 ref。或者，你可以用回调函数作为 ref：

```js
let app;
ReactDOM.render(
  <App ref={inst => {
    app = inst;
  }} />,
  el
);
```

在使用这种实现方式之前，请考虑你是否 [真的需要 ref](/docs/refs-and-the-dom.html#when-to-use-refs)。

## 多个 React 副本 {#multiple-copies-of-react}

Bower 在消除重复依赖方面做得不错，但 npm 不行。如果你没有用 refs 做任何（花哨的）事情，那么很可能不是你编写的 refs 的原因，而是由于你的项目加载了多个 React 副本所引起。有时候，当你通过 npm 拉取一个第三方模块时，你会得到重复的依赖库副本，这可能会产生问题。

如果你用的是 npm，`npm ls` 或 `npm ls react` 命令将有助于发现问题。
