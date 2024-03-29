---
title: startTransition
translators:
  - Davont
---

<Intro>

`startTransition` 可以让你在不阻塞 UI 的情况下更新 state。

```js
startTransition(scope)
```

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `startTransition(scope)` {/*starttransitionscope*/}

<<<<<<< HEAD
`startTransition` 函数可以将 state 更新标记为 transition。
=======
The `startTransition` function lets you mark a state update as a Transition.
>>>>>>> 307679521bb050565a6a8bdf807f94a919998504

```js {7,9}
import { startTransition } from 'react';

function TabContainer() {
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

[请看下面的更多例子](#usage)。

#### 参数 {/*parameters*/}

<<<<<<< HEAD
* `scope`：调用一个或多个 [`set` 函数](/reference/react/useState#setstate) 来更新 state 的函数。React 会立即调用没有参数的 `scope`，并将在 `scope` 函数调用期间，调度所有的 state，并将同步更新标记为 transition。它们是 [非阻塞的](/reference/react/useTransition#marking-a-state-update-as-a-non-blocking-transition)，并且 [不会显示不想要的加载提示](/reference/react/useTransition#preventing-unwanted-loading-indicators)。
=======
* `scope`: A function that updates some state by calling one or more [`set` functions.](/reference/react/useState#setstate) React immediately calls `scope` with no arguments and marks all state updates scheduled synchronously during the `scope` function call as Transitions. They will be [non-blocking](/reference/react/useTransition#marking-a-state-update-as-a-non-blocking-transition) and [will not display unwanted loading indicators.](/reference/react/useTransition#preventing-unwanted-loading-indicators)
>>>>>>> 307679521bb050565a6a8bdf807f94a919998504

#### 返回值 {/*returns*/}

`startTransition` 不返回任何内容。

#### 注意事项 {/*caveats*/}

<<<<<<< HEAD
* `startTransition` 没有提供一种跟踪 transition 是否处于待定状态的方法。为了在 transition 进行时显示一个待定状态的指示器，你需要使用 [`useTransition`](/reference/react/useTransition)。

* 只有当你能访问某个 state 的 `set` 函数时，你才能将它的更新包裹到 transition 中。如果你想根据 props 或自定义 Hook 的返回值来启动一个 transition，请尝试使用 [`useDeferredValue`](/reference/react/useDeferredValue)。

* 你传递给 `startTransition` 的函数必须是同步的。React 会立即执行此函数，将其执行期间发生的所有 state 更新标记为 transition。如果你想试着稍后执行更多的 state 更新（例如，在 timeout 中），它们不会被标记为转换。

* 一个被标记为 transition 的 state 更新时将会被其他 state 更新打断。例如，如果你在 transition 内部更新图表组件，但在图表重新渲染时在输入框中打字，则 React 将先处理输入 state 更新，之后才会重新启动对图表组件的渲染工作。
=======
* `startTransition` does not provide a way to track whether a Transition is pending. To show a pending indicator while the Transition is ongoing, you need [`useTransition`](/reference/react/useTransition) instead.

* You can wrap an update into a Transition only if you have access to the `set` function of that state. If you want to start a Transition in response to some prop or a custom Hook return value, try [`useDeferredValue`](/reference/react/useDeferredValue) instead.

* The function you pass to `startTransition` must be synchronous. React immediately executes this function, marking all state updates that happen while it executes as Transitions. If you try to perform more state updates later (for example, in a timeout), they won't be marked as Transitions.

* A state update marked as a Transition will be interrupted by other state updates. For example, if you update a chart component inside a Transition, but then start typing into an input while the chart is in the middle of a re-render, React will restart the rendering work on the chart component after handling the input state update.
>>>>>>> 307679521bb050565a6a8bdf807f94a919998504

* transition 更新不能用于控制文本输入。

<<<<<<< HEAD
* 如果有多个正在进行的 transition，当前 React 会将它们集中在一起处理。这是一个限制，在未来的版本中可能会被移除。
=======
* If there are multiple ongoing Transitions, React currently batches them together. This is a limitation that will likely be removed in a future release.
>>>>>>> 307679521bb050565a6a8bdf807f94a919998504

---

## 使用方法 {/*usage*/}

<<<<<<< HEAD
### 将 state 更新标记为非阻塞 transition {/*marking-a-state-update-as-a-non-blocking-transition*/}

你可以通过将一个 state 包裹在 `startTransition` 回调中，将其更新标记为一个 **transition**：
=======
### Marking a state update as a non-blocking Transition {/*marking-a-state-update-as-a-non-blocking-transition*/}

You can mark a state update as a *Transition* by wrapping it in a `startTransition` call:
>>>>>>> 307679521bb050565a6a8bdf807f94a919998504

```js {7,9}
import { startTransition } from 'react';

function TabContainer() {
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

transition 可以让用户界面在慢速设备上保持更新响应。

<<<<<<< HEAD
通过 transition，你的 UI 在重新渲染过程中保持响应。例如，如果用户单击一个选项卡后又改变主意并单击另一个选项卡，则可以在第一次重新渲染完成之前执行此操作而无需等待。

<Note>

`startTransition` 与 [`useTransition`](/reference/react/useTransition) 非常相似，但它不提供 `isPending` 标志来跟踪一个 transition 是否正在进行。你可以在 `useTransition` 不可用时调用 `startTransition`。例如，在组件外部（如从数据库中）使用 `startTransition`。

[在 `useTransition` 页面上了解 transition 并查看示例](/reference/react/useTransition)。
=======
With a Transition, your UI stays responsive in the middle of a re-render. For example, if the user clicks a tab but then change their mind and click another tab, they can do that without waiting for the first re-render to finish.

<Note>

`startTransition` is very similar to [`useTransition`](/reference/react/useTransition), except that it does not provide the `isPending` flag to track whether a Transition is ongoing. You can call `startTransition` when `useTransition` is not available. For example, `startTransition` works outside components, such as from a data library.

[Learn about Transitions and see examples on the `useTransition` page.](/reference/react/useTransition)
>>>>>>> 307679521bb050565a6a8bdf807f94a919998504

</Note>
