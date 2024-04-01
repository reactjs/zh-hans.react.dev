---
title: <Profiler>
---

<Intro>

`<Profiler>` 允许你编程式测量 React 树的渲染性能。

```js
<Profiler id="App" onRender={onRender}>
  <App />
</Profiler>
```

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `<Profiler>` {/*profiler*/}

使用 `<Profiler>` 包裹组件树，以测量其渲染性能。

```js
<Profiler id="App" onRender={onRender}>
  <App />
</Profiler>
```

#### 参数 {/*props*/}

* `id`：字符串，用于标识正在测量的 UI 部分。
* `onRender`：[`onRender` 回调函数](#onrender-callback)，当包裹的组件树更新时，React 都会调用它。它接收有关渲染内容和所花费时间的信息。

#### 注意 {/*caveats*/}

* 进行性能分析会增加一些额外的开销，因此 **在默认情况下，它在生产环境中是被禁用的**。如果要启用生产环境下的性能分析，你需要启用一个 [特殊的带有性能分析功能的生产构建](https://fb.me/react-profiling)。

---

### `onRender` 回调函数 {/*onrender-callback*/}

当调用 `onRender` 回调函数时，React 会告诉你相关信息。

```js
function onRender(id, phase, actualDuration, baseDuration, startTime, commitTime) {
  // 对渲染时间进行汇总或记录...
}
```

#### 参数 {/*onrender-parameters*/}

* `id`：字符串，为 `<Profiler>` 树的 `id` 属性，用于标识刚刚提交的部分。如果使用多个 profiler，可以通过此属性识别提交的是树中的哪一部分。
* `phase`：为 `"mount"`、`"update"` 或 `"nested-update"` 中之一。这可以让你知道组件树是首次挂载还是由于 props、state 或 hook 的更改而重新渲染。
* `actualDuration`：在此次更新中，渲染 `<Profiler>` 组件树的毫秒数。这可以显示子树在使用记忆化（例如 [`memo`](/reference/react/memo) 和 [`useMemo`](/reference/react/useMemo)）后的效果如何。理想情况下，此值在挂载后应显著减少，因为许多后代组件只会在特定的 props 变化时重新渲染。
* `baseDuration`：估算在没有任何优化的情况下重新渲染整棵 `<Profiler>` 子树所需的毫秒数。它通过累加树中每个组件的最近一次渲染持续时间来计算。此值估计了渲染的最差情况成本（例如初始挂载或没有使用记忆化的树）。将其与 `actualDuration` 进行比较，以确定记忆化是否起作用。
* `startTime`：当 React 开始渲染此次更新时的时间戳。
* `commitTime`：当 React 提交此次更新时的时间戳。此值在提交的所有 profiler 中共享，如果需要，可以对它们进行分组。

---

## 用法 {/*usage*/}

### 编程式测量渲染性能 {/*measuring-rendering-performance-programmatically*/}

使用 `<Profiler>` 组件包裹 React 树以测量其渲染性能。

```js {2,4}
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <PageContent />
</App>
```

这需要两个属性：`id`（字符串）和 `onRender` 回调函数（函数），每当 React 树中的任何组件“提交”更新时都将调用该函数。

<Pitfall>

进行性能分析会增加一些额外的开销，因此 **在默认情况下，它在生产环境中是被禁用的**。如果要启用生产环境下的性能分析，你需要启用 [特殊的带有性能分析功能的生产构建](https://fb.me/react-profiling)。

</Pitfall>

<Note>

`<Profiler>` 允许你编程式收集性能测量数据。如果你正在寻找一个交互式的性能分析工具，可以尝试使用 [React 开发者工具](/learn/react-developer-tools) 中的 Profiler 标签页。它提供了类似浏览器扩展程序的功能。

</Note>

---

### 测量应用的不同部分 {/*measuring-different-parts-of-the-application*/}

你可以使用多个 `<Profiler>` 组件来测量应用的不同部分：

```js {5,7}
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <Profiler id="Content" onRender={onRender}>
    <Content />
  </Profiler>
</App>
```

还可以嵌套 `<Profiler>` 组件：

```js {5,7,9,12}
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <Profiler id="Content" onRender={onRender}>
    <Content>
      <Profiler id="Editor" onRender={onRender}>
        <Editor />
      </Profiler>
      <Preview />
    </Content>
  </Profiler>
</App>
```

虽然 `<Profiler>` 是一个轻量级组件，但它应该仅在必要时使用。每次使用都会给应用增加一些额外的 CPU 和内存开销。

---

