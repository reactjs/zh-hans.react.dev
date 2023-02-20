---
id: profiler
title: Profiler API
layout: docs
category: Reference
permalink: docs/profiler.html
---

`Profiler` 测量一个 React 应用多久渲染一次以及渲染一次的“代价”。
它的目的是识别出应用中渲染较慢的部分，或是可以使用[类似 memoization 优化](/docs/hooks-faq.html#how-to-memoize-calculations)的部分，并从相关优化中获益。

> 注意：
>
> Profiling 增加了额外的开支，所以**它在[生产构建](/docs/optimizing-performance.html#use-the-production-build)中会被禁用**。
>
> 为了将 profiling 功能加入生产环境中，React 提供了使 profiling 可用的特殊的生产构建环境。
> 从 [fb.me/react-profiling](https://fb.me/react-profiling)了解更多关于如何使用这个构建环境的信息。

## 用法 {#usage}

`Profiler` 能添加在 React 树中的任何地方来测量树中这部分渲染所带来的开销。
它需要两个 prop ：一个是 `id`(string)，一个是当组件树中的组件“提交”更新的时候被React调用的回调函数 `onRender`(function)。

例如，为了分析 `Navigation` 组件和它的子代：

```js{3}
render(
  <App>
    <Profiler id="Navigation" onRender={callback}>
      <Navigation {...props} />
    </Profiler>
    <Main {...props} />
  </App>
);
```

多个 `Profiler` 组件能测量应用中的不同部分：
```js{3,6}
render(
  <App>
    <Profiler id="Navigation" onRender={callback}>
      <Navigation {...props} />
    </Profiler>
    <Profiler id="Main" onRender={callback}>
      <Main {...props} />
    </Profiler>
  </App>
);
```

嵌套使用 `Profiler` 组件来测量相同一个子树下的不同组件：

```js{3,5,8}
render(
  <App>
    <Profiler id="Panel" onRender={callback}>
      <Panel {...props}>
        <Profiler id="Content" onRender={callback}>
          <Content {...props} />
        </Profiler>
        <Profiler id="PreviewPane" onRender={callback}>
          <PreviewPane {...props} />
        </Profiler>
      </Panel>
    </Profiler>
  </App>
);
```

> 注意
>
> 尽管 `Profiler` 是一个轻量级组件，我们依然应该在需要时才去使用它。对一个应用来说，每添加一些都会给 CPU 和内存带来一些负担。

## `onRender` 回调 {#onrender-callback}

`Profiler` 需要一个 `onRender` 函数作为参数。
React 会在 profile 包含的组件树中任何组件 “提交” 一个更新的时候调用这个函数。
它的参数描述了渲染了什么和花费了多久。

```js
function onRenderCallback(
  id, // 发生提交的 Profiler 树的 “id”
  phase, // "mount" （如果组件树刚加载） 或者 "update" （如果它重渲染了）之一
  actualDuration, // 本次更新 committed 花费的渲染时间
  baseDuration, // 估计不使用 memoization 的情况下渲染整棵子树需要的时间
  startTime, // 本次更新中 React 开始渲染的时间
  commitTime, // 本次更新中 React committed 的时间
  interactions // 属于本次更新的 interactions 的集合
) {
  // 合计或记录渲染时间。。。
}
```

让我们来仔细研究一下各个 prop:

* **`id: string`** - 
发生提交的 `Profiler` 树的 `id`。
如果有多个 profiler，它能用来分辨树的哪一部分发生了“提交”。
* **`phase: "mount" | "update"`** -
判断是组件树的第一次装载引起的重渲染，还是由 props、state 或是 hooks 改变引起的重渲染。
* **`actualDuration: number`** -
本次更新在渲染 `Profiler` 和它的子代上花费的时间。
这个数值表明使用 memoization 之后能表现得多好。（例如 [`React.memo`](/docs/react-api.html#reactmemo)，[`useMemo`](/docs/hooks-reference.html#usememo)，[`shouldComponentUpdate`](/docs/hooks-faq.html#how-do-i-implement-shouldcomponentupdate)）。
理想情况下，由于子代只会因特定的 prop 改变而重渲染，因此这个值应该在第一次装载之后显著下降。
* **`baseDuration: number`** -
在 `Profiler` 树中最近一次每一个组件 `render` 的持续时间。
这个值估计了最差的渲染时间。（例如当它是第一次加载或者组件树没有使用 memoization）。
* **`startTime: number`** -
本次更新中 React 开始渲染的时间戳。
* **`commitTime: number`** -
本次更新中 React commit 阶段结束的时间戳。
在一次 commit 中这个值在所有的 profiler 之间是共享的，可以将它们按需分组。
* **`interactions: Set`** -
当更新被制定时，["interactions"](https://fb.me/react-interaction-tracing) 的集合会被追踪。（例如当 `render` 或者 `setState` 被调用时）。

> 注意
>
> Interactions 能用来识别更新是由什么引起的，尽管这个追踪更新的 API 依然是实验性质的。
>
> 从 [fb.me/react-interaction-tracing](https://fb.me/react-interaction-tracing) 了解更多
