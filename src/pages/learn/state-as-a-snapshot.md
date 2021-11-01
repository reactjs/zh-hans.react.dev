---
title: State 作为快照
---

<Intro>

State 变量也许看着像是一般的可读写 JavaScript 变量。但实际上，State 表现得更像是一张快照。设置它不会更改你已有的 state 变量，而是会触发重新渲染。

</Intro>

<YouWillLearn>

* 设置 state 会如何导致重新渲染
* State 在何时以何种方式更新
* 为什么 state 不在设置后立即更新
* 事件处理程序如何获取 state 的一张“快照”

</YouWillLearn>

## 设置 state 触发渲染 {#setting-state-triggers-renders}

你可能认为，你的用户界面会直接响应用户的输入（如单击）而发生变化。这种感觉很直观，如果你一直在[故事板化](https://wikipedia.org/wiki/Storyboard) 你的设计和交互的话：

<Illustration alt="A linear progression from a form, to a finger on the submit button, to a confirmation message." src="/images/docs/sketches/s_ui-response.jpg" />

在 React 中，它的工作方式与这种心理模型略有不同。在上一页中，你看到了来自 React 的[设置 state 要求重新渲染](/learn/render-and-commit#step-1-trigger-a-render)。这意味着要使界面对输入做出反应，你需要设置其 state。

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

1. 执行 `onSubmit` 事件处理程序。
2. `setIsSent(true)` 将 `isSent` 设置为 `true` 并排列一个新的渲染。
3. React 根据新的 `isSent` 值重新渲染组件。

让我们仔细看看 state 和渲染之间的关系。

<Illustration alt="State living in React; React gets a setUpdate; in the re-render, React passes a snapshot of the state value into the component." src="/images/docs/illustrations/i_ui-snapshot.png" />


## Rendering takes a snapshot in time

["渲染"](/learn/render-and-commit#step-2-react-renders-your-components)表示 React 正在调用你的组件，组件是一个函数。你从该函数返回的 JSX 就像是一张及时的 UI 快照。它的 props、事件处理程序和局部变量都是**根据当前渲染下的 state 计算的。**

与照片或电影画面不同，你返回的 UI “快照”是可交互的。它包含类似于事件处理程序的逻辑，用于指定输入时发生什么响应。 React 随后更新界面以匹配此快照，并绑定事件处理程序。因此，按下按钮将触发 JSX 中的 click 事件处理程序。

当 React 重新渲染组件时：

1. React 再次调用你的函数
2. 你的函数返回新的 JSX 快照
3. React 更新界面来匹配返回的快照

<IllustrationBlock title="Re-rendering" sequential>
    <Illustration caption="React executing the function" src="/images/docs/illustrations/i_render1.png" />
    <Illustration caption="Calculating the snapshot" src="/images/docs/illustrations/i_render2.png" />
    <Illustration caption="Updating the DOM tree" src="/images/docs/illustrations/i_render3.png" />
</IllustrationBlock>

作为组件的内存，state 不同于在函数返回后就消失的一般变量。State 实际上“存在”于 React 当中——就像在架子上！——位于你的函数之外。当 React 调用你的组件时，它会为该次渲染提供一张 state 快照。你的组件在 JSX 中返回带有新 props 和事件处理程序的 UI 快照 ，所有都是**使用该次渲染中的 state 值进行计算的！**
As a component's memory, state is not like a regular variable that disappears after your function returns. State actually "lives" in React itself--as if on a shelf!--outside of your function. When React calls your component, it gives you a snapshot of the state for that particular render. Your component returns a snapshot of the UI with a fresh set of props and event handlers in its JSX, all calculated **using the state values from that render!**

<IllustrationBlock sequential>
  <Illustration caption="React gets a setUpdate." src="/images/docs/illustrations/i_state-snapshot1.png" />
  <Illustration caption="React updates the state value." src="/images/docs/illustrations/i_state-snapshot2.png" />
  <Illustration caption="React passes a snapshot of the state value into the component." src="/images/docs/illustrations/i_state-snapshot3.png" />
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

我们注意到，每次点击只会让 `number`值增加 1！

**设置 state 只会在*下一个* 渲染中改变 state 的值。**在第一次渲染期间，`number` 为 `0`。这也就解释了，为什么在这个渲染中的* `onClick` 函数里，即便调用了 `setNumber(number + 1)` ，`number` 的值仍然是 `0`：
**Setting state only changes it for the *next* render.** During the first render, `number` was `0`. This is why, in *that render's* `onClick` handler, the value of `number` is still `0` even after `setNumber(number + 1)` was called:

```js
<button onClick={() => {
  setNumber(number + 1);
  setNumber(number + 1);
  setNumber(number + 1);
}}>+3</button>
```

以下是这个按钮的 click 事件处理程序通知 React 做的事情：

1. `setNumber(number + 1)`：`number` 是 `0` 所以 `setNumber(0 + 1)`。
    - React 准备在下一次渲染时将 `number` 更改为 `1`。
2.`setNumber(number + 1)`：`number` 是`0` 所以`setNumber(0 + 1)`。
    - React 准备在下一次渲染时将 `number` 更改为 `1`。
3.`setNumber(number + 1)`：`number` 是`0` 所以`setNumber(0 + 1)`。
    - React 准备在下一次渲染时将 `number` 更改为 `1`。

尽管你调用了`setNumber(number + 1)` 三次，但在*这次渲染的* 事件处理程序中 `number` 总是`0`，所以你将 state 设置成了 `1` 三次。这就是为什么，在你的事件处理程序完成后，React 重新渲染组件时，其中的 `number` 等于 `1` 而不是 `3`。

你还可以在心中通过在代码中用 state 变量的值替换 state 变量来将其可视化。由于*这次渲染* 的 `number` state 变量为 `0`，其事件处理程序如下所示：
You can also visualize this by mentally substituting state variables with their values in your code. Since the `number` state variable is `0` for *this render*, its event handler looks like this:

```js
<button onClick={() => {
  setNumber(0 + 1);
  setNumber(0 + 1);
  setNumber(0 + 1);
}}>+3</button>
```
对于下一次渲染，`number` 为 `1`，因此*第二次渲染的* click 事件处理程序如下所示：
For the next render, `number` is `1`, so *that render's* click handler looks like this:

```js
<button onClick={() => {
  setNumber(1 + 1);
  setNumber(1 + 1);
  setNumber(1 + 1);
}}>+3</button>
```
这就是为什么再次单击按钮会将计数器设置为“2”，然后再一次单击后又设置为“3”，依此类推。
This is why clicking the button again will set the counter to `2`, then to `3` on the next click, and so on.

## State over time

嗯，这很有趣。试着猜猜单击此按钮会发出什么警告：
Well, that was fun. Try to guess what clicking this button will alert:

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

吃惊吗？如果使用替换方法，则可以看到传递给 alert 的 state 的“快照”。

```js
setNumber(0 + 5);
setTimeout(() => {
  alert(0);
}, 3000);
```
React 中存储的 state 可能在 alert 运行时已更改，但它是使用用户与其交互时的状态快照来安排的！
The state stored in React may have changed by the time the alert runs, but it was scheduled using a snapshot of the state at the time the user interacted with it!

**State 变量的值在渲染中永远不会改变，**即使其事件处理程序的代码是异步的。在*那个渲染的* `onClick` 中，即使在调用 `setNumber(number + 5)` 之后，`number` 的值仍然是`0`。当 React 通过调用你的组件“获取 UI 的快照”时，它的值是“固定的”。
**A state variable's value never changes within a render,** even if its event handler's code is asynchronous. Inside *that render's* `onClick`, the value of `number` continues to be `0` even after `setNumber(number + 5)` was called. Its value was "fixed" when React "took the snapshot" of the UI by calling your component.

这是一个使你的事件处理程序更不易出现计时错误的示例。下面是一个延迟五秒发送消息的表单。想象以下场景：
Here is an example of how that makes your event handlers less prone to timing mistakes. Below is a form that sends a message with a five-second delay. Imagine this scenario:

1. 你按下“发送”按钮，向 Alice 发送“Hello”。
2. 在五秒延迟结束之前，将“To”字段的值更改为“Bob”。

你希望 `alert` 显示什么？它会显示“You said Hello to Alice”吗？或者它会显示“You said Hello to Bob”？根据你已经学到的作出猜测，然后试一试：
What do you expect the `alert` to display? Would it display, "You said Hello to Alice"? Or would it display, "You said Hello to Bob"? Make a guess based on what you know, and then try it:

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

**React 在一次渲染的事件处理程序中始终固定 state 的值。**你无需担心代码运行时 state 是否已更改。
**React keeps the state values "fixed" within one render's event handlers.** You don't need to worry whether the state has changed while the code is running.

但是，如果你想在重新渲染之前读取最新的 state 怎么办？你将需要使用[状态更新程序功能](/learn/queueing-a-series-of-state-updates)，下一页将会介绍！
But what if you wanted to read the latest state before a re-render? You'll want to use a [state updater function](/learn/queueing-a-series-of-state-updates), covered on the next page!

<Recap>

* 设置 state 要求新的渲染。
* React 将 state 存储在组件之外，就像在架子上一样。
* 当你调用 `useState` 时，React 会为你提供*该渲染* 的 state快照。
* 变量和事件处理程序不会在重新渲染中“幸存”。每个渲染都有自己的事件处理程序。
* 每个渲染（以及其中的函数）将始终“看到”React 给 *那个* 渲染的 state 快照。
* 你可以在心中替换事件处理程序中的 state，类似于你如何考虑渲染的 JSX。
* 过去创建的事件处理程序拥有的是创建它们的那次渲染中的 state 值。
* Setting state requests a new render.
* React stores state outside of your component, as if on a shelf.
* When you call `useState`, React gives you a snapshot of the state *for that render*.
* Variables and event handlers don't "survive" re-renders. Every render has its own event handlers.
* Every render (and functions inside it) will always "see" the snapshot of the state that React gave to *that* render.
* You can mentally substitute state in event handlers, similarly to how you think about the rendered JSX.
* Event handlers created in the past have the state values from the render in which they were created.

</Recap>



<Challenges>

### Implement a traffic light

这是一个人行横道灯组件，在按下按钮时会打开：
Here is a crosswalk light component that toggles on when the button is pressed:

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

向 click 事件处理程序添加一个 `alert` 。当灯为绿色且显示“Walk”时，单击按钮应显示“Stop is next”。当灯为红色并显示“Stop”时，单击按钮应显示“Walk is next”。

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

无论是将它放在 `setWalk` 调用之前还是之后都没有区别。这次渲染下 `walk` 的值是固定的。调用`setWalk` 只会在*下次* 渲染时改变它，不会影响之前渲染的事件处理程序。

这条线乍一看似乎有违直觉：

```js
alert(walk ? 'Stop is next' : 'Walk is next');
```

但是，如果你将其读作：“如果交通灯显示‘Walk now’，则消息应显示‘Stop is next’。”事件处理程序中的 `walk` 变量与该渲染器的 `walk` 值相匹配，并且不会改变。
But it makes sense if you read it as: "If the traffic light shows 'Walk now', the message should say 'Stop is next.'" The `walk` variable inside your event handler matches that render's value of `walk` and does not change.

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

因此，单击“Change to Stop”会排列一个将 `walk` 设置为 `false` 的渲染，并弹出 alert 显示“Stop is next”。
So clicking "Change to Stop" queues a render with `walk` set to `false`, and alerts "Stop is next".

</Solution>

</Challenges>
