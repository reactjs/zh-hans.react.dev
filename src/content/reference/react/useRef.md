---
title: useRef
---

<Intro>

`useRef` 是一个 React Hook，它能帮助引用一个不需要渲染的值。

```js
const ref = useRef(initialValue)
```

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `useRef(initialValue)` {/*useref*/}

在组件顶层调用 `useRef` 以声明一个 [ref](/learn/referencing-values-with-refs)。

```js
import { useRef } from 'react';

function MyComponent() {
  const intervalRef = useRef(0);
  const inputRef = useRef(null);
  // ...
```

[请参阅下方更多示例](#usage)。

#### 参数 {/*parameters*/}

* `initialValue`：ref 对象的 `current` 属性的初始值。可以是任意类型的值。这个参数在首次渲染后被忽略。

#### 返回值 {/*returns*/}

`useRef` 返回一个只有一个属性的对象:

* `current`：初始值为传递的 `initialValue`。之后可以将其设置为其他值。如果将 ref 对象作为一个 JSX 节点的 `ref` 属性传递给 React，React 将为它设置 `current` 属性。

在后续的渲染中，`useRef` 将返回同一个对象。

#### 注意 {/*caveats*/}

* 可以修改 `ref.current` 属性。与 state 不同，它是可变的。然而，如果它持有一个用于渲染的对象（例如 state 的一部分），那么就不应该修改这个对象。
* 改变 `ref.current` 属性时，React 不会重新渲染组件。React 不知道它何时会发生改变，因为 ref 是一个普通的 JavaScript 对象。
* 除了 [初始化](#avoiding-recreating-the-ref-contents) 外不要在渲染期间写入或者读取 `ref.current`，否则会使组件行为变得不可预测。
* 在严格模式下，React 将会 **调用两次组件方法**，这是为了 [帮助发现意外问题](/reference/react/useState#my-initializer-or-updater-function-runs-twice)。但这只是开发模式下的行为，不会影响生产模式。每个 ref 对象都将会创建两次，但是其中一个版本将被丢弃。如果使用的是组件纯函数（也应当如此），那么这不会影响其行为。

---

## 使用 {/*usage*/}

### 使用 ref 引用一个值 {/*referencing-a-value-with-a-ref*/}

在组件顶层调用 `useRef` 声明一个或多个 [ref](/learn/referencing-values-with-refs)。

```js [[1, 4, "intervalRef"], [3, 4, "0"]]
import { useRef } from 'react';

function Stopwatch() {
  const intervalRef = useRef(0);
  // ...
```

`useRef` 返回一个具有单个 <CodeStep step={2}>`current` 属性</CodeStep> 的 <CodeStep step={1}>ref 对象</CodeStep>，并初始化为你提供的 <CodeStep step={3}>初始值</CodeStep>。

在后续的渲染中，`useRef` 将返回相同的对象。你可以改变它的 `current` 属性来存储信息，并在之后读取它。这会让人联想到 [state](/reference/react/useState)，但是有一个重要的区别。

**改变 ref 不会触发重新渲染**。这意味着 ref 是存储一些不影响组件视图输出信息的完美选择。例如，如果需要存储一个 [interval ID](https://developer.mozilla.org/zh-CN/docs/Web/API/setInterval) 并在以后检索它，那么可以将它存储在 ref 中。只需要手动改变它的 <CodeStep step={2}>`current` 属性</CodeStep> 即可修改 ref 的值：

```js [[2, 5, "intervalRef.current"]]
function handleStartClick() {
  const intervalId = setInterval(() => {
    // ...
  }, 1000);
  intervalRef.current = intervalId;
}
```

在之后，从 ref 中读取 interval ID 便可以 [清除定时器](https://developer.mozilla.org/zh-CN/docs/Web/API/clearInterval)：

```js [[2, 2, "intervalRef.current"]]
function handleStopClick() {
  const intervalId = intervalRef.current;
  clearInterval(intervalId);
}
```

使用 ref 可以确保：

- 可以在重新渲染之间 **存储信息**（普通对象存储的值每次渲染都会重置）。
- 改变它 **不会触发重新渲染**（状态变量会触发重新渲染）。
- 对于组件的每个副本而言，**这些信息都是本地的**（外部变量则是共享的）。

改变 ref 不会触发重新渲染，所以 ref 不适合用于存储期望显示在屏幕上的信息。如有需要，使用 state 代替。阅读更多关于 [在 `useRef` 和 `useState` 之间选择](/learn/referencing-values-with-refs#differences-between-refs-and-state) 的信息。

<Recipes titleText="Examples of referencing a value with useRef" titleId="examples-value">

#### 点击计数器 {/*click-counter*/}

这个组件使用 ref 记录按钮被点击的次数。注意，在这里使用 ref 而不是 state 是可以的，因为点击次数只在事件处理程序中被读取和写入。

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('You clicked ' + ref.current + ' times!');
  }

  return (
    <button onClick={handleClick}>
      点击！
    </button>
  );
}
```

</Sandpack>

如果在 JSX 中显示 `{ref.current}`，数字不会在点击时更新。这是因为修改 `ref.current` 不会触发重新渲染——用于渲染的信息应该使用 state。

<Solution />

#### 秒表 {/*a-stopwatch*/}

这个例子使用了 state 和 ref 的组合。`startTime` 和 `now` 都是 state 变量，因为它们是用来渲染的。但是还需要持有 [interval ID](https://developer.mozilla.org/zh-CN/docs/Web/API/setInterval) 以在按下按钮时停止定时器。因为 interval ID 不用于渲染，所以应该把它保存在一个 ref 中，并且手动更新它。

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

    clearInterval(intervalRef.current);
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
      <h1>Time passed: {secondsPassed.toFixed(3)}</h1>
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

<Solution />

</Recipes>

<Pitfall>

**不要在渲染期间写入或者读取 `ref.current`**。

React 期望组件主体 [表现得像一个纯函数](/learn/keeping-components-pure)：

- 如果输入的（[props](/learn/passing-props-to-a-component)、[state](/learn/state-a-components-memory) 与 [上下文](/learn/passing-data-deeply-with-context)）都是一样的，那么就应该返回一样的 JSX。
- 以不同的顺序或用不同的参数调用它，不应该影响其他调用的结果。

在 **渲染期间** 读取或写入 ref 会破坏这些预期行为。

```js {expectedErrors: {'react-compiler': [4]}} {3-4,6-7}
function MyComponent() {
  // ...
  // 🚩 不要在渲染期间写入 ref
  myRef.current = 123;
  // ...
  // 🚩 不要在渲染期间读取 ref
  return <h1>{myOtherRef.current}</h1>;
}
```

可以在 **事件处理程序或者 Effect** 中读取和写入 ref。

```js {4-5,9-10}
function MyComponent() {
  // ...
  useEffect(() => {
    // ✅ 可以在 Effect 中读取和写入 ref
    myRef.current = 123;
  });
  // ...
  function handleClick() {
    // ✅ 可以在事件处理程序中读取和写入 ref
    doSomething(myOtherRef.current);
  }
  // ...
}
```

如果不得不在渲染期间读取 [或者写入](/reference/react/useState#storing-information-from-previous-renders)，那么应该 [使用 state](/reference/react/useState) 代替。

当打破这些规则时，组件可能仍然可以工作，但是我们为 React 添加的大多数新功能将依赖于这些预期行为。阅读 [保持组件纯粹](/learn/keeping-components-pure#where-you-can-cause-side-effects) 以了解更多信息。

</Pitfall>

---

### 通过 ref 操作 DOM {/*manipulating-the-dom-with-a-ref*/}

使用 ref 操作 [DOM](https://developer.mozilla.org/zh-CN/docs/Web/API/HTML_DOM_API) 是非常常见的行为。React 内置了对它的支持。

首先，声明一个 <CodeStep step={3}>初始值</CodeStep> 为 `null` 的 <CodeStep step={1}>ref 对象</CodeStep>

```js [[1, 4, "inputRef"], [3, 4, "null"]]
import { useRef } from 'react';

function MyComponent() {
  const inputRef = useRef(null);
  // ...
```

然后将 ref 对象作为 `ref` 属性传递给想要操作的 DOM 节点的 JSX：

```js [[1, 2, "inputRef"]]
  // ...
  return <input ref={inputRef} />;
```

当 React 创建 DOM 节点并将其渲染到屏幕时，React 将会把 DOM 节点设置为 ref 对象的 <CodeStep step={2}>`current` 属性</CodeStep>。现在可以借助 ref 对象访问 `<input>` 的 DOM 节点，并且可以调用类似于 [`focus()`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/focus) 的方法：

```js [[2, 2, "inputRef.current"]]
  function handleClick() {
    inputRef.current.focus();
  }
```

当节点从屏幕上移除时，React 将把 `current` 属性设置回 `null`。

阅读 [用 ref 操纵 DOM](/learn/manipulating-the-dom-with-refs) 以了解更多信息。

<Recipes titleText="Examples of manipulating the DOM with useRef" titleId="examples-dom">

#### 聚焦文字输入框 {/*focusing-a-text-input*/}

在这个示例中，点击按钮将会聚焦输入框：

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        聚焦输入框
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

#### 滚动图片到视图 {/*scrolling-an-image-into-view*/}

在这个示例中，点击按钮将会把图片滚动到视图。这里使用 ref 绑定到列表的 DOM 节点，然后调用 DOM 的 [`querySelectorAll`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/querySelectorAll) API 找到想要滚动的图片。

<Sandpack>

```js
import { useRef } from 'react';

export default function CatFriends() {
  const listRef = useRef(null);

  function scrollToIndex(index) {
    const listNode = listRef.current;
    // This line assumes a particular DOM structure:
    const imgNode = listNode.querySelectorAll('li > img')[index];
    imgNode.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  return (
    <>
      <nav>
        <button onClick={() => scrollToIndex(0)}>
          Neo
        </button>
        <button onClick={() => scrollToIndex(1)}>
          Millie
        </button>
        <button onClick={() => scrollToIndex(2)}>
          Bella
        </button>
      </nav>
      <div>
        <ul ref={listRef}>
          <li>
            <img
              src="https://placecats.com/neo/300/200"
              alt="Neo"
            />
          </li>
          <li>
            <img
              src="https://placecats.com/millie/200/200"
              alt="Millie"
            />
          </li>
          <li>
            <img
              src="https://placecats.com/bella/199/200"
              alt="Bella"
            />
          </li>
        </ul>
      </div>
    </>
  );
}
```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>

<Solution />

#### 播放和暂停视频 {/*playing-and-pausing-a-video*/}

这个示例使用 ref 调用 `<video>` DOM 节点的 [`play()`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLMediaElement/play) 和 [`pause()`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLMediaElement/pause) 方法。

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const ref = useRef(null);

  function handleClick() {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);

    if (nextIsPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? '暂停' : '播放'}
      </button>
      <video
        width="250"
        ref={ref}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

<Solution />

#### 向组件暴露 ref {/*exposing-a-ref-to-your-own-component*/}

有时你可能想让父组件在组件中操纵 DOM。例如，假设正在编写一个 `MyInput` 组件，但希望父组件能够聚焦 input（不过父组件无法访问）。此时可以在父组件中创建一个 `ref` 并作为 prop 传递给子组件。在这里阅读 [详细演练](/learn/manipulating-the-dom-with-refs#accessing-another-components-dom-nodes)。

<Sandpack>

```js
import { useRef } from 'react';

function MyInput({ ref }) {
  return <input ref={ref} />;
};

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        聚焦输入框
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

### 避免重复创建 ref 的内容 {/*avoiding-recreating-the-ref-contents*/}

React 会保存 ref 初始值，并在后续的渲染中忽略它。

```js
function Video() {
  const playerRef = useRef(new VideoPlayer());
  // ...
```

虽然 `new VideoPlayer()` 的结果只会在首次渲染时使用，但是依然在每次渲染时都在调用这个方法。如果是创建昂贵的对象，这可能是一种浪费。

为了解决这个问题，你可以像这样初始化 ref：

```js
function Video() {
  const playerRef = useRef(null);
  if (playerRef.current === null) {
    playerRef.current = new VideoPlayer();
  }
  // ...
```

通常情况下，在渲染过程中写入或读取 `ref.current` 是不允许的。然而，在这种情况下是可以的，因为结果总是一样的，而且条件只在初始化时执行，所以是完全可预测的。

<DeepDive>

#### 避免在初始化 `useRef` 之后进行 `null` 的类型检查 {/*how-to-avoid-null-checks-when-initializing-use-ref-later*/}

如果使用了类型检查器，并且不想总是检查 `null`，可以尝试用这样的模式来代替：

```js
function Video() {
  const playerRef = useRef(null);

  function getPlayer() {
    if (playerRef.current !== null) {
      return playerRef.current;
    }
    const player = new VideoPlayer();
    playerRef.current = player;
    return player;
  }

  // ...
```

在这里，`playerRef` 本身是可以为空的。然而，应该能够使类型检查器确信，不存在 `getPlayer()` 返回 `null` 的情况。然后在事件处理程序中调用 `getPlayer()`。

</DeepDive>

---

## 疑难解答 {/*troubleshooting*/}

### 无法获取自定义组件的 ref {/*i-cant-get-a-ref-to-a-custom-component*/}

如果尝试像这样传递 `ref` 到自定义组件：

```js
const inputRef = useRef(null);

return <MyInput ref={inputRef} />;
```

你可能会在控制台中得到这样的错误：

<ConsoleBlock level="error">

TypeError: Cannot read properties of null

</ConsoleBlock>

默认情况下，自定义组件不会暴露它们内部 DOM 节点的 ref。

为了解决这个问题，首先，找到想获得 ref 的组件：

```js
export default function MyInput({ value, onChange }) {
  return (
    <input
      value={value}
      onChange={onChange}
    />
  );
}
```

然后在组件的 props 参数中提取 `ref`，并将它作为参数传递给相关的 [内置组件](/reference/react-dom/components/common)。如下所示：

```js {1,6}
function MyInput({ value, onChange, ref }) {
  return (
    <input
      value={value}
      onChange={onChange}
      ref={ref}
    />
  );
};

export default MyInput;
```

最后，父级组件就可以得到它的 ref。

阅读 [访问另一个组件的 DOM 节点](/learn/manipulating-the-dom-with-refs#accessing-another-components-dom-nodes) 以了解更多信息。
