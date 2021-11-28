---
title: 状态更新的队列
translators: 
  - Jiacheng787
---

<Intro>

设置组件状态将会把一个渲染任务加入队列。但有时你可能会希望在下次渲染任务加入队列之前，执行多次状态更新。为此，这有助于了解 React 如何批量更新状态。

</Intro>

<YouWillLearn>

* 什么是“批处理”以及 React 如何使用它来处理多个状态更新
* 如何通过一行代码对同一状态变量进行多次更新

</YouWillLearn>

## React 批量状态更新 {/*react-batches-state-updates*/}

在下面的示例中，你可能会认为，点击“+3”按钮会使计数器增加三次，因为它调用了 `setNumber(number + 1)` 三次：

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 1);
        setNumber(number + 1);
        setNumber(number + 1);
      }}>+3</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

但是，你可能还记得上一节中的内容，[每一次渲染的状态值都是固定的](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time)，因此无论你调用多少次 `setNumber(1)`，在第一次渲染的事件处理函数内部的 `number` 值总是 `0` ：

```js
setNumber(0 + 1);
setNumber(0 + 1);
setNumber(0 + 1);
```

但是这里还有另外一个因素需要讨论。**在处理状态更新之前，React 会等待事件处理函数中的 *所有* 代码都运行完毕。** 这就是为什么重新渲染只在所有这些 `setNumber()` 调用 *之后* 发生的原因。

这可能会让你想起在餐厅点菜的服务员。服务员不会在提到你的第一道菜的时候就跑到厨房！相反，他们会让你完成订单，让你对其进行更改，甚至可以接受桌上其他人的订单。

<Illustration src="/images/docs/illustrations/i_react-batching.png"  alt="在餐厅里，优雅的光标会引导扮演服务员角色的 React 多次点餐。在她多次调用 setState() 之后，服务员将她所点的最后一个作为她的最终订单记录下来。" />

这让你可以更新多个状态——甚至来自多个组件——而不会触发太多的 [重新渲染](/learn/render-and-commit#re-renders-when-state-updates)。但这也意味着只有在你的事件处理函数及其中任何代码完成 *之后*，UI 才会更新。这种行为，被称为 **批处理，** 使你的 React app 运行更快。它还避免了处理只​​更新了一些变量的令人困惑的“半成品”渲染。

**React 不会跨 *多个* 有意的事件（如点击）进行批处理**——每次点击都是单独处理的。请放心，React 仅在通常安全的情况下才进行批处理。这确保了，例如，如果第一次点击按钮禁用了表单，则第二次点击不会再次提交它。

## 在下次渲染前多次更新同一个状态 {/*updating-the-same-state-variable-multiple-times-before-the-next-render*/}

这是一个不常见的用例，但是如果你想在下次渲染之前多次更新同一个状态，而不是传递 *下一个状态值* 例如 `setNumber(number + 1)`，你可以传递一个 *函数*，该函数根据队列中的前一个状态计算下一个状态，例如 `setNumber(n => n + 1)`。这是一种告诉 React “用状态值做某事”而不是仅仅替换它的方法。

现在尝试增加计数器：

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(n => n + 1);
        setNumber(n => n + 1);
        setNumber(n => n + 1);
      }}>+3</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

在这里，`n => n + 1` 被称为 **更新函数**。当你将它传递给 state setter 时：

1. React 将此函数加入队列，在事件处理函数中的所有其他代码运行后进行处理。
2. 在下一次渲染期间，React 遍历队列并提供最终更新状态。

```js
setNumber(n => n + 1);
setNumber(n => n + 1);
setNumber(n => n + 1);
```

下面是 React 在执行事件处理函数时的处理流程：

1. `setNumber(n => n + 1)`：`n => n + 1` 是一个函数。React 将它加入队列。
2. `setNumber(n => n + 1)`：`n => n + 1` 是一个函数。React 将它加入队列。
3. `setNumber(n => n + 1)`：`n => n + 1` 是一个函数。React 将它加入队列。

当你在下次渲染期间调用 `useState`，React 会遍历队列。初始的 `number` 状态是 `0`，所以这就是 React 作为 `n` 参数传递给第一个更新函数的值。然后 React 获取上一个更新函数的返回值，并将其作为 `n` 传递给下一个更新函数，以此类推：

|  更新队列 | `n` | 返回值 |
|--------------|---------|-----|
| `n => n + 1` | `0` | `0 + 1 = 1` |
| `n => n + 1` | `1` | `1 + 1 = 2` |
| `n => n + 1` | `2` | `2 + 1 = 3` |

React 保存 `3` 为最终结果并从 `useState` 中返回。

这就是为什么在上面的示例中点击“+3”正确地将值增加“+3”。
### 如果在替换状态后更新状态会发生什么 {/*what-happens-if-you-update-state-after-replacing-it*/}

这个事件处理函数会怎么样？你认为 `number` 下一次渲染的值是什么？

```js
<button onClick={() => {
  setNumber(number + 5);
  setNumber(n => n + 1);
}}>
```

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setNumber(n => n + 1);
      }}>增加数字</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

这是事件处理函数告诉 React 要做的事情：

1. `setNumber(number + 5)`：`number` 为 `0`，所以 `setNumber(0 + 5)`。React 将 *“替换为 `5`”* 添加到其队列中。
2. `setNumber(n => n + 1)`：`n => n + 1` 是一个更新函数。 React 将 *该函数* 添加到其队列中。

在下一次渲染期间，React 会遍历状态队列：

|   更新队列       | `n` | 返回值 |
|--------------|---------|-----|
| “替换为 `5`” | `0`（未使用） | `5` |
| `n => n + 1` | `5` | `5 + 1 = 6` |

React 保存 `6` 为最终结果并从 `useState` 中返回。

> 你可能已经注意到，`setState(x)` 实际上像 `setState(n => x)` 一样工作，只是 `n` 未使用！

### 如果在更新状态后替换状态会发生什么 {/*what-happens-if-you-replace-state-after-updating-it*/}

让我们再看一个例子。你认为 `number` 下一次渲染的值是什么？

```js
<button onClick={() => {
  setNumber(number + 5);
  setNumber(n => n + 1);
  setNumber(42);
}}>
```

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setNumber(n => n + 1);
        setNumber(42);
      }}>增加数字</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

以下是 React 在执行事件处理函数时的处理流程：

1. `setNumber(number + 5)`：`number` 为 `0`，所以 `setNumber(0 + 5)`。React 将 *“替换为 `5`”* 添加到其队列中。
2. `setNumber(n => n + 1)`：`n => n + 1` 是一个更新函数。React 将该函数添加到其队列中。
3. `setNumber(42)`：React 将 *“替换为 `42`”* 添加到其队列中。

在下一次渲染期间，React 会遍历状态队列：

|   更新队列       | `n` | 返回值 |
|--------------|---------|-----|
| “替换为 `5`” | `0`（未使用） | `5` |
| `n => n + 1` | `5` | `5 + 1 = 6` |
| “替换为 `42`” | `6`（未使用） | `42` |

然后 React 保存 `42` 为最终结果并从 `useState` 中返回。

总而言之，以下是你可以考虑传递给 `setNumber` state setter 的内容：

* **一个更新函数**（例如：`n => n + 1`）被添加到队列中。
* **任何其他值**（例如：数字 `5`）将“替换为 `5`”添加到队列中，忽略已经在队列中的内容。

事件处理函数执行完成后，React 将触发重新渲染。在重新渲染期间，React 将处理队列。更新函数在渲染期间执行，因此 **更新函数必须是 [纯函数](/learn/keeping-components-pure)** 并且只 *返回* 结果。不要尝试从它们内部设置状态或者执行其他副作用。在严格模式下，React 会执行每个更新函数两次（但是丢弃第二个结果）以帮助你发现错误。

### 命名约定 {/*naming-conventions*/}

通常通过相应状态变量的第一个字母来命名更新函数参数：

```js
setEnabled(e => !e);
setLastName(ln => ln.reverse());
setFriendCount(fc => fc * 2);
```

如果你喜欢更冗长的代码，另一个常见的约定是重复完整的状态变量名称，如 `setEnabled(enabled => !enabled)`，或使用前缀如 `setEnabled(prevEnabled => !prevEnabled)`。

<Recap>

* 设置状态不会更改现有渲染中的变量，但会请求新的渲染。
* React 在事件处理函数执行完成之后处理状态更新。这称为批处理。
* 要在一个事件中多次更新某些状态，你可以使用 `setNumber(n => n + 1)` 更新函数。

</Recap>



<Challenges>

### 修复请求计数器 {/*fix-a-request-counter*/}

你正在开发一个艺术市场应用，该应用允许用户同时提交一个艺术项目的多个订单。每次用户按下“购买”按钮，“等待”计数器应增加一。三秒后，“等待”计数器应该减少，“完成”计数器应该增加。

但是，“等待”计数器的行为不符合预期。当你按下“购买”按钮时，它会减少到 `-1`（这应该是不可能的）。如果你快速点击两次，两个计数器的行为似乎都无法预测。

为什么会发生这种情况？修复两个计数器。

<Sandpack>

```js
import { useState } from 'react';

export default function RequestTracker() {
  const [pending, setPending] = useState(0);
  const [completed, setCompleted] = useState(0);

  async function handleClick() {
    setPending(pending + 1);
    await delay(3000);
    setPending(pending - 1);
    setCompleted(completed + 1);
  }

  return (
    <>
      <h3>
        等待：{pending}
      </h3>
      <h3>
        完成：{completed}
      </h3>
      <button onClick={handleClick}>
        购买
      </button>
    </>
  );
}

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
```

</Sandpack>

<Solution>

在 `handleClick` 事件处理函数内部，`pending` 和 `completed` 的值对应于点击事件发生时的值。对于第一次渲染，`pending` 为 `0` ，因此 `setPending(pending - 1)` 变成了 `setPending(-1)`，这是错误的。由于你想要 *增加* 或 *减少* 计数器，而不是将它们设置为在点击期间确定的具体值，你可以改为传递更新函数：

<Sandpack>

```js
import { useState } from 'react';

export default function RequestTracker() {
  const [pending, setPending] = useState(0);
  const [completed, setCompleted] = useState(0);

  async function handleClick() {
    setPending(p => p + 1);
    await delay(3000);
    setPending(p => p - 1);
    setCompleted(c => c + 1);
  }

  return (
    <>
      <h3>
        等待：{pending}
      </h3>
      <h3>
        完成：{completed}
      </h3>
      <button onClick={handleClick}>
        购买
      </button>
    </>
  );
}

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
```

</Sandpack>

这可以确保当你增加或减少计数器时，会根据其 *最新* 状态而不是点击时的状态来执行此操作。

</Solution>

### 自己实现状态队列 {/*implement-the-state-queue-yourself*/}

在这个挑战中，你将从头开始重新实现 React 的一小部分！这并不像听起来那么难。

滚动 sandbox 进行预览。请注意，它显示了 **四个测试用例** 。它们对应于你之前在本页上看到的示例。你的任务是实现 `getFinalState` 函数，以便它为每种情况返回正确的结果。如果你正确实现它，则所有四个测试用例都应该通过。

你将收到两个参数：`baseState` 是初始状态（例如：`0`），`queue` 是包含数字（例如：`5`）和更新函数（例如：`n => n + 1`）的混合数组，按添加顺序排列。

你的任务是返回最终状态，就像这个页面上的表格一样！

<Hint>

如果你没有思路，可以从下面的代码结构开始:

```js
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  for (let update of queue) {
    if (typeof update === 'function') {
      // TODO: 调用更新函数
    } else {
      // TODO: 替换状态
    }
  }

  return finalState;
}
```

完成剩余的代码！

</Hint>

<Sandpack>

```js processQueue.js active
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  // TODO: 对队列做些什么...

  return finalState;
}
```

```js App.js
import { getFinalState } from './processQueue.js';

function increment(n) {
  return n + 1;
}
increment.toString = () => 'n => n+1';

export default function App() {
  return (
    <>
      <TestCase
        baseState={0}
        queue={[1, 1, 1]}
        expected={1}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          increment,
          increment,
          increment
        ]}
        expected={3}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
        ]}
        expected={6}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
          42,
        ]}
        expected={42}
      />
    </>
  );
}

function TestCase({
  baseState,
  queue,
  expected
}) {
  const actual = getFinalState(baseState, queue);
  return (
    <>
      <p>初始状态：<b>{baseState}</b></p>
      <p>队列：<b>[{queue.join(', ')}]</b></p>
      <p>期望结果：<b>{expected}</b></p>
      <p style={{
        color: actual === expected ?
        'green' :
        'red'
      }}>
        你的结果：<b>{actual}</b>
        {' '}
        ({actual === expected ?
          '正确' :
          '错误'
        })
      </p>
    </>
  );
}
```

</Sandpack>

<Solution>

本页描述的正是 React 用来计算最终状态的算法:

<Sandpack>

```js processQueue.js active
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  for (let update of queue) {
    if (typeof update === 'function') {
      // 调用更新函数
      finalState = update(finalState);
    } else {
      // 替换状态
      finalState = update;
    }
  }

  return finalState;
}
```

```js App.js
import { getFinalState } from './processQueue.js';

function increment(n) {
  return n + 1;
}
increment.toString = () => 'n => n+1';

export default function App() {
  return (
    <>
      <TestCase
        baseState={0}
        queue={[1, 1, 1]}
        expected={1}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          increment,
          increment,
          increment
        ]}
        expected={3}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
        ]}
        expected={6}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
          42,
        ]}
        expected={42}
      />
    </>
  );
}

function TestCase({
  baseState,
  queue,
  expected
}) {
  const actual = getFinalState(baseState, queue);
  return (
    <>
      <p>初始状态：<b>{baseState}</b></p>
      <p>队列：<b>[{queue.join(', ')}]</b></p>
      <p>期望结果：<b>{expected}</b></p>
      <p style={{
        color: actual === expected ?
        'green' :
        'red'
      }}>
        你的结果：<b>{actual}</b>
        {' '}
        ({actual === expected ?
          '正确' :
          '错误'
        })
      </p>
    </>
  );
}
```

</Sandpack>

现在你知道 React 这部分是如何工作的了！

</Solution>

</Challenges>