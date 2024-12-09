---
title: startTransition
translators:
  - Davont
---

<Intro>

<<<<<<< HEAD
`startTransition` 可以让你在不阻塞 UI 的情况下更新 state。
=======
`startTransition` lets you render a part of the UI in the background.
>>>>>>> 69edd845b9a654c6ac9ed68da19d5b42897e636e

```js
startTransition(action)
```

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `startTransition(action)` {/*starttransition*/}

`startTransition` 函数可以将 state 更新标记为 transition。

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
* `action`: A function that updates some state by calling one or more [`set` functions](/reference/react/useState#setstate). React calls `action` immediately with no parameters and marks all state updates scheduled synchronously during the `action` function call as Transitions. Any async calls awaited in the `action` will be included in the transition, but currently require wrapping any `set` functions after the `await` in an additional `startTransition` (see [Troubleshooting](#react-doesnt-treat-my-state-update-after-await-as-a-transition)). State updates marked as Transitions will be [non-blocking](#marking-a-state-update-as-a-non-blocking-transition) and [will not display unwanted loading indicators.](#preventing-unwanted-loading-indicators).
>>>>>>> 69edd845b9a654c6ac9ed68da19d5b42897e636e

#### 返回值 {/*returns*/}

`startTransition` 不返回任何内容。

#### 注意事项 {/*caveats*/}

* `startTransition` 没有提供一种跟踪 Transition 是否处于待定状态的方法。为了在 Transition 进行时显示一个待定状态的指示器，你需要使用 [`useTransition`](/reference/react/useTransition)。

* 只有当你能访问某个 state 的 `set` 函数时，你才能将它的更新包裹到 Transition 中。如果你想根据 props 或自定义 Hook 的返回值来启动一个 transition，请尝试使用 [`useDeferredValue`](/reference/react/useDeferredValue)。

<<<<<<< HEAD
* 你传递给 `startTransition` 的函数必须是同步的。React 会立即执行此函数，将其执行期间发生的所有 state 更新标记为 transition。如果你想试着稍后执行更多的 state 更新（例如，在 timeout 中），它们不会被标记为转换。
=======
* The function you pass to the of `startTransition` is called immediately, marking all state updates that happen while it executes as Transitions. If you try to perform state updates in a `setTimeout`, for example, they won't be marked as Transitions.

* You must wrap any state updates after any async requests in another `startTransition` to mark them as Transitions. This is a known limitation that we will fix in the future (see [Troubleshooting](#react-doesnt-treat-my-state-update-after-await-as-a-transition)).
>>>>>>> 69edd845b9a654c6ac9ed68da19d5b42897e636e

* 一个被标记为 Transition 的 state 更新时将会被其他 state 更新打断。例如，如果你在 Transition 内部更新图表组件，但在图表重新渲染时在输入框中打字，则 React 将先处理输入 state 更新，之后才会重新启动对图表组件的渲染工作。

* Transition 更新不能用于控制文本输入。

<<<<<<< HEAD
* 如果有多个正在进行的 transition，当前 React 会将它们集中在一起处理。这是一个限制，在未来的版本中可能会被移除。
=======
* If there are multiple ongoing Transitions, React currently batches them together. This is a limitation that may be removed in a future release.
>>>>>>> 69edd845b9a654c6ac9ed68da19d5b42897e636e

---

## 使用方法 {/*usage*/}

### 将 state 更新标记为非阻塞 Transition {/*marking-a-state-update-as-a-non-blocking-transition*/}

你可以通过将一个 state 包裹在 `startTransition` 回调中，将其更新标记为一个 **transition**：

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

通过 transition，你的 UI 在重新渲染过程中保持响应。例如，如果用户单击一个选项卡后又改变主意并单击另一个选项卡，则可以在第一次重新渲染完成之前执行此操作而无需等待。

<Note>

`startTransition` 与 [`useTransition`](/reference/react/useTransition) 非常相似，但它不提供 `isPending` 标志来跟踪一个 Transition 是否正在进行。你可以在 `useTransition` 不可用时调用 `startTransition`。例如，在组件外部（如从数据库中）使用 `startTransition`。

[在 `useTransition` 页面上了解 Transition 并查看示例](/reference/react/useTransition)。

</Note>
