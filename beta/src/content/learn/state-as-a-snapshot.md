---
title: State 作为快照
translators:
  - zzw
---

<Intro>

State 变量看起来和一般的可读写的 JavaScript 变量类似。但实际上，State 表现得更像是一张快照。设置它不会更改你已有的 state 变量，而是会触发重新渲染。

</Intro>

<YouWillLearn>

* 设置 state 如何导致重新渲染
* State 在何时以何种方式更新
* 为什么 state 不在设置后立即更新
* 事件处理函数如何获取 state 的一张“快照”

</YouWillLearn>

## 设置 state 触发渲染 {#setting-state-triggers-renders}

你可能认为，你的用户界面会直接响应用户的输入（如单击）而发生变化。这种感觉很直观，如果你一直在[故事板化](https://wikipedia.org/wiki/Storyboard)你的设计和交互的话：

<Illustration alt="A linear progression from a form, to a finger on the submit button, to a confirmation message." src="/images/docs/sketches/s_ui-response.jpg" />

在 React 中，它的工作方式与这种思维模型略有不同。在上一页中，你看到了来自 React 的[设置 state 请求重新渲染](/learn/render-and-commit#step-1-trigger-a-render)。这意味着要使界面对输入做出反应，你需要设置其 state。

<Illustration alt="React initially renders a form, a finger on the submit button sends a setState to React, and React re-renders a confirmation message." src="/images/docs/sketches/s_react-ui-response.jpg" />

在这个例子中，当你按下“send”时，`setIsSent(true)` 会通知 React 重新渲染 UI：

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('Hi!');
  if (isSent) {
    return <h1>Your message is on its way!</h1>
  }
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      setIsSent(true);
      sendMessage(message);
    }}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}

function sendMessage(message) {
  // ...
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

单击按钮时会发生以下情况：

1. 执行 `onSubmit` 事件处理函数。
2. `setIsSent(true)` 将 `isSent` 设置为 `true` 并排列一个新的渲染。
3. React 根据新的 `isSent` 值重新渲染组件。

让我们仔细看看 state 和渲染之间的关系。

<Illustration alt="State living in React; React gets a setUpdate; in the re-render, React passes a snapshot of the state value into the component." src="/images/docs/illustrations/i_ui-snapshot.png" />

## 渲染接收实时快照 {#rendering-takes-a-snapshot-in-time}

["渲染"](/learn/render-and-commit#step-2-react-renders-your-components)表示 React 正在调用你的组件，组件是一个函数。你从该函数返回的 JSX 就像是一张及时的 UI 快照。它的 props、事件处理函数和局部变量都是**根据当前渲染下的 state 计算的。**

与照片或电影画面不同，你返回的 UI “快照”是可交互的。它包含类似于事件处理函数的逻辑，用于指定输入时发生什么响应。 React 随后更新界面以匹配此快照，并绑定事件处理函数。因此，按下按钮将触发 JSX 中的 click 事件处理函数。

当 React 重新渲染组件时：

1. React 再次调用你的函数
2. 你的函数返回新的 JSX 快照
3. React 更新界面来匹配返回的快照

<IllustrationBlock title="重渲染" sequential>
    <Illustration caption="React 执行函数" src="/images/docs/illustrations/i_render1.png" />
    <Illustration caption="计算快照" src="/images/docs/illustrations/i_render2.png" />
    <Illustration caption="更新 DOM 树" src="/images/docs/illustrations/i_render3.png" />
</IllustrationBlock>

作为组件的内存，state 不同于在函数返回后就消失的一般变量。State 实际上“存在”于 React 当中——就像在架子上！——位于你的函数之外。当 React 调用你的组件时，它会为该次渲染提供一张 state 快照。你的组件在 JSX 中返回带有新 props 和事件处理函数的一张 UI 快照 ，其中所有的值都是**根据该次渲染中的 state 计算的！**

<IllustrationBlock sequential>
  <Illustration caption="React 收到 setUpdate 的通知" src="/images/docs/illustrations/i_state-snapshot1.png" />
  <Illustration caption="React 更新 state 的值" src="/images/docs/illustrations/i_state-snapshot2.png" />
  <Illustration caption="React 向组件内传入一张 state 的快照" src="/images/docs/illustrations/i_state-snapshot3.png" />
</IllustrationBlock>

这里有一个小例子，向你展示这是如何工作的。在这个例子中，你可能期望点击“+3”按钮会增加计数器三次，因为它调用了 `setNumber(number + 1)` 三次。

让我们看看点击“+3”按钮会发生什么：

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

我们注意到，每次点击只会让 `number`的值增加 1！

**设置 state 只会在*下一个* 渲染中改变 state 的值。**在第一次渲染期间，`number` 为 `0`。这也就解释了，为什么在*这次渲染*中的 `onClick` 函数里，即便调用了 `setNumber(number + 1)` ，`number` 的值仍然是 `0`：

```js
<button onClick={() => {
  setNumber(number + 1);
  setNumber(number + 1);
  setNumber(number + 1);
}}>+3</button>
```

以下是这个按钮的 click 事件处理函数通知 React 做的事情：

1. `setNumber(number + 1)`：`number` 是 `0` 所以 `setNumber(0 + 1)`。
    - React 准备在下一次渲染时将 `number` 更改为 `1`。
2.`setNumber(number + 1)`：`number` 是`0` 所以`setNumber(0 + 1)`。
    - React 准备在下一次渲染时将 `number` 更改为 `1`。
3.`setNumber(number + 1)`：`number` 是`0` 所以`setNumber(0 + 1)`。
    - React 准备在下一次渲染时将 `number` 更改为 `1`。

尽管你调用了`setNumber(number + 1)` 三次，但在*这次渲染的* 事件处理函数中 `number` 总是`0`，所以你将 state 设置成了 `1` 三次。这就是为什么，在你的事件处理函数完成后，React 重新渲染组件时，其中的 `number` 等于 `1` 而不是 `3`。

你还可以在心中可视化这个过程，用 state 变量当前的值去替换掉它。由于*这次渲染* 的state 变量 `number` 的值为 `0`，其事件处理函数看起来将是这样：

```js
<button onClick={() => {
  setNumber(0 + 1);
  setNumber(0 + 1);
  setNumber(0 + 1);
}}>+3</button>
```
对于下一次渲染，`number` 的值变为 `1`，因此*下次渲染的* click 事件处理函数如下所示：

```js
<button onClick={() => {
  setNumber(1 + 1);
  setNumber(1 + 1);
  setNumber(1 + 1);
}}>+3</button>
```
这就是为什么第二次单击按钮会将计数器设置为“2”，再一次单击后又变为“3”，依此类推。

## 状态伴随时间 {#state-over-time}

嗯，这很有趣。试着猜猜单击此按钮会发出什么警告：

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
        alert(number);
      }}>+5</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

如果你使用之前的替换模型，你可以猜到这个 alert 将会显示"0"：

```js
setNumber(0 + 5);
alert(0);
```

但如果你在这个 alert 上加上一个定时器， 使得它在组件重新渲染后才会触发，又会怎样呢？会显示“0”还是“5”？猜一猜！

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
        setTimeout(() => {
          alert(number);
        }, 3000);
      }}>+5</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

惊讶吗？如果使用替换方法，则可以看到传递给 alert 的 state 的“快照”。

```js
setNumber(0 + 5);
setTimeout(() => {
  alert(0);
}, 3000);
```
React 中存储的 state 可能在执行 alert 时发生了更改，但它的值是由用户与其交互时的 state 快照决定的！

**在一次渲染中，State 变量的值永远不会改变，**即使其事件处理函数的代码是异步的。在*这次渲染的* `onClick` 中，即使在调用 `setNumber(number + 5)` 之后，`number` 的值仍然是`0`。当 React 通过调用你的组件“获取 UI 的快照”时，它的值是“固定的”。

这是一个使你的事件处理函数更不易出现计时错误的示例。下面是一个延迟五秒发送消息的表单。想象以下场景：

1. 你按下“发送”按钮，向 Alice 发送“Hello”。
2. 在五秒延迟结束之前，将“To”字段的值更改为“Bob”。

你预测 `alert` 会显示什么？它会显示“You said Hello to Alice”吗？或者它会显示“You said Hello to Bob”？根据你已经学到的知识猜一猜，然后动手试一试：

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [to, setTo] = useState('Alice');
  const [message, setMessage] = useState('Hello');

  function handleSubmit(e) {
    e.preventDefault();
    setTimeout(() => {
      alert(`You said ${message} to ${to}`);
    }, 5000);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        To:{' '}
        <select
          value={to}
          onChange={e => setTo(e.target.value)}>
          <option value="Alice">Alice</option>
          <option value="Bob">Bob</option>
        </select>
      </label>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

**React 在一次渲染的事件处理函数中始终固定 state 的值。**你无需担心代码运行时 state 是否已更改。

但是，如果你想在重新渲染之前读取最新的 state 怎么办？你将需要使用[状态更新函数](/learn/queueing-a-series-of-state-updates)，下一页将会介绍！

<Recap>

* 设置 state 请求一次新的渲染。
* React 将 state 存储在组件之外，就像在架子上一样。
* 当你调用 `useState` 时，React 会为你提供*该次渲染* 的一张 state 快照。
* 变量和事件处理函数不会在重渲染中“存活”。每个渲染都有自己的事件处理函数。
* 每个渲染（以及其中的函数）始终“看到”的是 React 提供给*这个* 渲染的 state 快照。
* 你可以在心中替换事件处理函数中的 state，类似于替换渲染的 JSX。
* 过去创建的事件处理函数拥有的是创建它们的那次渲染中的 state 值。

</Recap>



<Challenges>

### 实现红绿灯组件

以下是一个人行道红绿灯组件，在按下按钮时会切换状态：

<Sandpack>

```js
import { useState } from 'react';

export default function TrafficLight() {
  const [walk, setWalk] = useState(true);

  function handleClick() {
    setWalk(!walk);
  }

  return (
    <>
      <button onClick={handleClick}>
        Change to {walk ? 'Stop' : 'Walk'}
      </button>
      <h1 style={{
        color: walk ? 'darkgreen' : 'darkred'
      }}>
        {walk ? 'Walk' : 'Stop'}
      </h1>
    </>
  );
}
```

```css
h1 { margin-top: 20px; }
```

</Sandpack>

向 click 事件处理函数添加一个 `alert` 。当灯为绿色且显示“Walk”时，单击按钮应显示“Stop is next”。当灯为红色并显示“Stop”时，单击按钮应显示“Walk is next”。

把 `alert` 方法放在 `setWalk` 方法之前或之后有区别吗？

<Solution>

你的 `alert` 应该看起来像是这样：

<Sandpack>

```js
import { useState } from 'react';

export default function TrafficLight() {
  const [walk, setWalk] = useState(true);

  function handleClick() {
    setWalk(!walk);
    alert(walk ? 'Stop is next' : 'Walk is next');
  }

  return (
    <>
      <button onClick={handleClick}>
        Change to {walk ? 'Stop' : 'Walk'}
      </button>
      <h1 style={{
        color: walk ? 'darkgreen' : 'darkred'
      }}>
        {walk ? 'Walk' : 'Stop'}
      </h1>
    </>
  );
}
```

```css
h1 { margin-top: 20px; }
```

</Sandpack>

无论是将它放在 `setWalk` 调用之前还是之后都没有区别。这次渲染下 `walk` 的值是固定的。调用`setWalk` 只会在*下次* 渲染时改变它，不会影响之前渲染的事件处理函数。

这一行代码乍看之下似乎有违直觉：

```js
alert(walk ? 'Stop is next' : 'Walk is next');
```

为了便于理解，如果你将其读作：“如果交通灯显示‘Walk now’，则消息应显示‘Stop is next’。”事件处理函数中的 `walk` 变量与渲染出的 `walk` 值一致，并且不会改变。

你可以应用替换方法来验证这是否正确。当 `walk` 为 `true` 时，你会得到：

```js
<button onClick={() => {
  setWalk(false);
  alert('Stop is next');
}}>
  Change to Stop
</button>
<h1 style={{color: 'darkgreen'}}>
  Walk
</h1>
```

因此，单击 “Change to Stop” 会排列一个将 `walk` 设置为 `false` 的渲染，并弹出 alert 显示 “Stop is next”。

</Solution>

</Challenges>
