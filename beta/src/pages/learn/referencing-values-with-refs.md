---
title: '使用 Refs 引用值'
translators: 
  - SylviaZ89
---

<Intro>

当你希望组件 “记住” 某些信息，但又不想让这些信息 [触发新的渲染](/learn/render-and-commit) 时，你可以使用 **ref** —— 就像一个用来存储组件信息的秘密 “口袋”！

</Intro>

<YouWillLearn>

- 如何向组件添加 ref
- 如何更新 ref 的值
- refs 与 state 有何不同
- 如何安全地使用 refs

</YouWillLearn>

## 给你的组件添加 ref

你可以通过从 React 导入 `useRef` Hook 来为你的组件添加一个 ref：

```js
import { useRef } from 'react';
```

在你的组件内，调用 `useRef` Hook 并传入引用的初始值作为唯一参数。例如，这里的 ref 值是 “0”：

```js
const ref = useRef(0);
```

`useRef` 返回一个这样的对象:

<!-- prettier-ignore -->
```js
{ 
  current: 0 // 你向 useRef 传入的值
}
```

<Illustration src="/images/docs/illustrations/i_ref.png" alt="An arrow with 'current' written on it stuffed into a pocket with 'ref' written on it." />

你可以用 `ref.current` 属性访问该 ref 的当前值。 这个值是有意设置为可变的，意味着你既可以读取也可以写入它。（这就是让它成为 React 单向数据流的 “应急方案” 的原因 —— 详见下文！）

这里，每次点击按钮时会增加 `ref.current`：

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('你点击了 ' + ref.current + ' 次！');
  }

  return (
    <button onClick={handleClick}>
      点击我！
    </button>
  );
}
```

</Sandpack>

这里的 ref 指向一个数字，但是，像 [state](/learn/state-a-components-memory) 一样，你可以让它指向任何东西：字符串、对象，甚至是函数。与 state 不同的是，ref 是一个普通的 JavaScript 对象，具有可以读取和修改的 `current` 属性。

请注意，**组件不会在每次递增时重新渲染。** 与 state 一样，React 会在每次重新渲染之间保留 refs。但是，设置 state 会重新渲染组件，更改 ref 不会！

## 示例：制作秒表

在单个组件中，你可以组合使用 refs 和 state。例如，让我们制作一个秒表，用户可以按下按钮来启动或停止。为了展示从用户按下 “开始” 以来过去了多久，你需要追踪按下 “开始” 按钮的时间和当前时间。**此信息用于渲染，所以你将使用 state 存储：**

```js
const [startTime, setStartTime] = useState(null);
const [now, setNow] = useState(null);
```

当用户按下 “开始” 时，你将用 [`setInterval`](https://developer.mozilla.org/docs/Web/API/setInterval) 每 10 毫秒更新一次时间：

<Sandpack>

```js
import { useState } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);

  function handleStart() {
    // 开始计时。
    setStartTime(Date.now());
    setNow(Date.now());

    setInterval(() => {
      // 每 10ms 更新一次当前时间。
      setNow(Date.now());
    }, 10);
  }

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  return (
    <>
      <h1>时间过去了： {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>
        开始
      </button>
    </>
  );
}
```

</Sandpack>

当按下 “停止” 按钮时，你需要取消现有的 interval ，以便让它停止更新 `now` state 变量。 你可以通过调用 [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval) 来完成此操作。但你需要为其提供 interval ID，此 ID 是之前用户按下 Start ，调用 `setInterval` 时返回的。你需要将 interval ID 保留在某处。 **由于 interval ID 不用于渲染，你可以将其保存在 ref 中：**

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);
  const intervalRef = useRef(null);

  function handleStart() {
    setStartTime(Date.now());
    setNow(Date.now());
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 10);
  }

  function handleStop() {
    clearInterval(intervalRef.current);
  }

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  return (
    <>
      <h1>时间过去了： {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>
        开始
      </button>
      <button onClick={handleStop}>
        停止
      </button>
    </>
  );
}
```

</Sandpack>

当一条信息用于渲染时，将它保存在 state 中。 当一条信息仅被事件处理器需要，并且更改它不会重新渲染时，使用 ref 可能更有效。 

## Refs 和 state 的不同之处

也许你觉得 refs 似乎没有 state 那样 “严格” —— 例如，你可以改变它们而非总是必须使用 state 设置函数。但在大多数情况下，你会想要使用 state。Refs 是你不经常需要的 “应急方案”。 以下是 state 和 refs 的对比：

| refs                                                                                  | state                                                                                                                     |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `useRef(initialValue)`返回 `{ current: initialValue }`  | `useState(initialValue)` 返回 state 变量的当前值和一个 state 设置函数 ( `[value, setValue]`) |
| 更改时不会触发重新渲染   | 更改时触发重新渲染。 |
| 可变 —— 你可以在渲染过程之外修改和更新 `current` 的值。 | “不可变” —— 你必须使用 state 设置函数来修改 state 变量，从而排队重新渲染。 |
| 你不应在渲染期间读取（或写入） `current` 值。 | 你可以随时读取 state。但是，每次渲染都有自己的 state [快照](/learn/state-as-a-snapshot) 状态，它是不会改变的。

这是一个使用 state 实现的计数器按钮：

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      你点击了 {count} 次
    </button>
  );
}
```

</Sandpack>

因为显示了 `count` 值，所以使用 state 是有意义的的。当使用 setCount() 设置计数器的值时，React 会重新渲染组件，并且屏幕会更新以展示新的计数。

如果你试图用 ref 来实现它，React 永远不会重新渲染组件，所以你永远不会看到计数变化！看看点击这个按钮如何 **不更新它的文本**：

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let countRef = useRef(0);

  function handleClick() {
    // 这样并未重新渲染组件！
    countRef.current = countRef.current + 1;
  }

  return (
    <button onClick={handleClick}>
      你点击了 {countRef.current} 次
    </button>
  );
}
```

</Sandpack>

这就是为什么在渲染期间读取 `ref.current` 会导致代码不可靠的原因。如果需要，请改用 state。 

<DeepDive title="useRef 内部是如何工作的？">

尽管 `useState` 和 `useRef` 都是由 React 提供的，原则上 `useRef` 可以在 `useState` _的基础上_ 实现。 你可以想象在 React 内部，`useRef` 是这样实现的：

```js
// React 内部
function useRef(initialValue) {
  const [ref, unused] = useState({ current: initialValue });
  return ref;
}
```

第一次渲染期间，`useRef` 返回 `{ current: initialValue }`。 该对象由 React 存储，因此在下一次渲染期间将返回相同的对象。 请注意，在这个示例中，state 设置函数没有被用到。它是不必要的，因为 `useRef` 总是需要返回相同的对象！

React 提供了一个内置版本的 `useRef`，因为它在实践中很常见。 但是你可以将其视为没有设置器的常规 state 变量。 如果你熟悉面向对象编程，refs 可能会让你想起实例字段 —— 但是你写的不是 `this.something`，而是 `somethingRef.current`。

</DeepDive>

## 何时使用 refs

通常，当你的组件需要 “跳出” React 并与外部 API 通信时，你会用到 ref —— 通常是不会影响组件外观的浏览器 API。 以下是一些罕见的情况：

- 存储 [timeout ID](https://developer.mozilla.org/docs/Web/API/setTimeout)
- 存储和操作 [DOM 元素](https://developer.mozilla.org/docs/Web/API/Element)，我们将在 [下一页](/learn/manipulating-the-dom-with-refs) 中介绍 
- 存储不需要计算 JSX 的其他对象。

如果你的组件需要存储一些值，但不影响渲染逻辑，请选择 refs。

## Refs 的最佳实践

遵循这些原则将使你的组件更具可预测性：

- **将 refs 视为应急方案。** 使用外部系统或浏览器 API 时，refs 很有用。如果你的大部分应用程序逻辑和数据流依赖于 refs，你可能需要重新考虑你的方法。
- **不要在渲染过程中读取或写入 `ref.current`。** 如果渲染过程中需要某些信息，请使用 [state](/learn/state-a-components-memory) 代替。由于 React 不知道 `ref.current` 何时发生变化，即使在渲染时读取它也会使组件的行为难以预测。（唯一的例外是像 `if (!ref.current) ref.current = new Thing()` 这样的代码，它只在第一次渲染期间设置一次 ref。）

React state 的限制不适用于 refs。例如，state 就像 [每次渲染的快照](/learn/state-as-a-snapshot)， 并且 [不会同步更新](/learn/queueing-a-series-of-state-updates)。但是当你改变 ref 的 current 值时，它会立即改变：

```js
ref.current = 5;
console.log(ref.current); // 5
```

这是因为 **ref 本身是一个普通的 JavaScript 对象，** 所以它的行为就像对象那样。

当你使用 ref 时，也无需担心 [避免突变](/learn/updating-objects-in-state)。只要你改变的对象不用于渲染，React 就不会关心你对 ref 或其内容做了什么。

## Refs 和 DOM

你可以将 ref 指向任何值。但是，ref 最常见的用法是访问 DOM 元素。 例如，如果你想以编程方式令输入框获得焦点，这很方便。 当你将 ref 传递给 JSX 中的 `ref` 属性时，比如 `<div ref={myRef}>`，React 会将相应的 DOM 元素放入 `myRef.current` 中。你可以在 [使用 Refs 操作 DOM](/learn/manipulating-the-dom-with-refs) 中阅读更多相关信息。

<Recap>

- Refs 是一个应急方案，用于保留不用于渲染的值。 你不会经常需要它们。
- ref 是一个普通的 JavaScript 对象，具有一个名为 `current` 的属性，你可以读取或设置它。
- 你可以通过调用 `useRef` Hook 来让 React 给你一个 ref。
- 与 state 一样，refs 允许你在组件的重新渲染之间保留信息。
- 与 state 不同，设置 ref 的 `current` 值不会触发重新渲染。
- 不要在渲染过程中读取或写入 `ref.current`。 这使你的组件难以预测。

</Recap>



<Challenges>

### 修复坏掉的聊天输入框

输入消息并单击 “发送”。 你会注意到，在看到 “已发送！” 提示框之前有 3 秒的延迟。在此延迟期间，你可以看到一个 “撤消” 按钮。点击它。这个 “撤消” 按钮应该打断“发送！” 消息弹出。它通过调用 [`clearTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/clearTimeout) 来做到这点，这一步骤需要使用在 `handleSend` 时保存的 timeout ID。但是，即使在单击 “撤消” 后，“已发送！” 消息仍然出现。找出它不起作用的原因，然后修复它。

<Hint>

像`let timeoutID` 这样的常规变量不会在重新渲染之间 “存活”，因为每次渲染都从头开始运行你的组件（并初始化其变量）。你应该将 timeout ID 保存在其他地方吗？

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  let timeoutID = null;

  function handleSend() {
    setIsSending(true);
    timeoutID = setTimeout(() => {
      alert('已发送！');
      setIsSending(false);
    }, 3000);
  }

  function handleUndo() {
    setIsSending(false);
    clearTimeout(timeoutID);
  }

  return (
    <>
      <input
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        disabled={isSending}
        onClick={handleSend}>
        {isSending ? '发送中……' : '发送'}
      </button>
      {isSending &&
        <button onClick={handleUndo}>
          撤销
        </button>
      }
    </>
  );
}
```

</Sandpack>

<Solution>

每当你的组件重新渲染时（例如当你设置 state 时），所有局部变量都会从头开始初始化。这就是为什么你不能将 timeout ID 保存在像 `timeoutID` 这样的局部变量中，然后期望未来另一个事件处理器 “看到” 它。相反，将它存储在一个 ref 中，React 将在渲染之间保留它。

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const timeoutRef = useRef(null);

  function handleSend() {
    setIsSending(true);
    timeoutRef.current = setTimeout(() => {
      alert('已发送!');
      setIsSending(false);
    }, 3000);
  }

  function handleUndo() {
    setIsSending(false);
    clearTimeout(timeoutRef.current);
  }

  return (
    <>
      <input
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        disabled={isSending}
        onClick={handleSend}>
        {isSending ? '发送中……' : '发送'}
      </button>
      {isSending &&
        <button onClick={handleUndo}>
          撤销
        </button>
      }
    </>
  );
}
```

</Sandpack>

</Solution>


### 修复无法重新渲染的组件

这个按钮本该在显示 “开” 和 “关” 之间切换。但是，它始终显示 “关”。 这段代码有什么问题？ 修复它。

<Sandpack>

```js
import { useRef } from 'react';

export default function Toggle() {
  const isOnRef = useRef(false);

  return (
    <button onClick={() => {
      isOnRef.current = !isOnRef.current;
    }}>
      {isOnRef.current ? '开' : '关'}
    </button>
  );
}
```

</Sandpack>

<Solution>

在这个例子中，ref 的 current 值被用于计算渲染输出：`{isOnRef.current ? '开'：'关'}`。这表明此信息不应该在 ref 中，而应该放在 state 里。要修复它，请删除 ref ，使用 state 代替：

<Sandpack>

```js
import { useState } from 'react';

export default function Toggle() {
  const [isOn, setIsOn] = useState(false);

  return (
    <button onClick={() => {
      setIsOn(!isOn);
    }}>
      {isOn ? '开' : '关'}
    </button>
  );
}
```

</Sandpack>

</Solution>

### 修复防抖

在这个例子中，所有按钮点击处理器都是 ["防抖的"](https://redd.one/blog/debounce-vs-throttle)。 要了解这意味着什么，请按下其中一个按钮。注意消息在一秒后显示。如果你在等待消息时按下按钮，计时器将重置。如果你多次快速单击同一个按钮，则直到你停止单击 *之后* 1 秒钟，该消息才会显示。 防抖可以让你延迟一些动作，直到用户 “停止动作”。

这个例子有效，但并不完全符合预期。按钮不是独立的。要查看问题，请单击其中一个按钮，然后立即单击另一个按钮。你期望在延迟之后，看到两个按钮的消息。但只显示了最后一个按钮的消息。第一个按钮的消息丢失了。

为什么按钮会相互干扰呢？查找并修复问题。

<Hint>

最后一个 timeout ID 变量在所有 `DebouncedButton` 组件之间共享。这就是为什么单击一个按钮会重置另一个按钮的超时时间。你能为每个按钮存储一个单独的超时 ID 吗？

</Hint>

<Sandpack>

```js
import { useState } from 'react';

let timeoutID;

function DebouncedButton({ onClick, children }) {
  return (
    <button onClick={() => {
      clearTimeout(timeoutID);
      timeoutID = setTimeout(() => {
        onClick();
      }, 1000);
    }}>
      {children}
    </button>
  );
}

export default function Dashboard() {
  return (
    <>
      <DebouncedButton
        onClick={() => alert('宇宙飞船已发射！')}
      >
        发射宇宙飞船
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('汤煮好了！')}
      >
        煮点儿汤
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('唱摇篮曲了！')}
      >
        唱首摇篮曲
      </DebouncedButton>
    </>
  )
}
```

```css
button { display: block; margin: 10px; }
```

</Sandpack>

<Solution>

像 `timeoutID` 这样的变量在所有组件之间共享。这就是为什么单击第二个按钮会重置第一个按钮挂起超时的原因。要解决此问题，你可以把 timeout 保存在 ref 中。每个按钮都有自己的 ref，因此它们不会相互冲突。请注意快速单击两个按钮如何显示两个消息。

<Sandpack>

```js
import { useState, useRef } from 'react';

function DebouncedButton({ onClick, children }) {
  const timeoutRef = useRef(null);
  return (
    <button onClick={() => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        onClick();
      }, 1000);
    }}>
      {children}
    </button>
  );
}

export default function Dashboard() {
  return (
    <>
      <DebouncedButton
        onClick={() => alert('宇宙飞船已发射！')}
      >
        发射宇宙飞船
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('汤煮好了！')}
      >
        煮点儿汤
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('唱摇篮曲了！')}
      >
        唱首摇篮曲
      </DebouncedButton>
    </>
  )
}
```

```css
button { display: block; margin: 10px; }
```

</Sandpack>

</Solution>

### 读取最新的 state

在此示例中，当你按下 “发送” 后，在显示消息之前会有一小段延迟。输入 “你好”，按下发送，然后再次快速编辑输入。尽管你进行了编辑，提示框仍会显示 “你好”（这是按钮被点击 [那一刻](/learn/state-as-a-snapshot#state-over-time) state 的值）。

通常，这种行为是你在应用程序中想要的。但是，有时可能需要一些异步代码来读取某些 state 的 *最新* 版本。你能想出一种方法，让提示框显示 *当前* 输入文本而不是点击时的内容吗？

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');

  function handleSend() {
    setTimeout(() => {
      alert('正在发送：' + text);
    }, 3000);
  }

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        onClick={handleSend}>
        发送
      </button>
    </>
  );
}
```

</Sandpack>

<Solution>

State 运作起来 [就像快照](/learn/state-as-a-snapshot)，因此你无法从timeout 等异步操作中读取最新的 state。但是，你可以在 ref 中保存最新的输入文本。ref 是可变的，因此你可以随时读取 `current` 属性。由于当前文本也用于渲染，在本例中， 一个 state 变量（用于渲染）*和* 一个 ref（在 timeout 时读取它）*都* 是你需要的。 您需要手动更新当前的 ref 值。

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const textRef = useRef(text);

  function handleChange(e) {
    setText(e.target.value);
    textRef.current = e.target.value;
  }

  function handleSend() {
    setTimeout(() => {
      alert('正在发送：' + textRef.current);
    }, 3000);
  }

  return (
    <>
      <input
        value={text}
        onChange={handleChange}
      />
      <button
        onClick={handleSend}>
        发送
      </button>
    </>
  );
}
```

</Sandpack>

</Solution>

</Challenges>