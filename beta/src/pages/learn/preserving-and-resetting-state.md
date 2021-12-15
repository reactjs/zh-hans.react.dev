---
title: 如何控制状态的保留或重置
translators:
  - YogaLin
---

<Intro>

状态与组件之间是隔离的。根据组件在 UI 树中的位置，React 可以跟踪组件所属的状态。你可以控制重新渲染时状态是保留还是重置。

</Intro>

<YouWillLearn>

* React 怎样“看待”组件结构
* React 保留或重置状态的条件
* 如何强制 React 重置组件的状态
* Key 和组件类型变化对状态保留的影响

</YouWillLearn>

## UI 树 {/*the-ui-tree*/}

浏览器使用许多树形结构来构建 UI 。[DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction) 用于表示 HTML 元素，[CSSOM](https://developer.mozilla.org/docs/Web/API/CSS_Object_Model) 则表示 CSS 元素。甚至还有 [Accessibility tree](https://developer.mozilla.org/docs/Glossary/Accessibility_tree)！

React 也使用树形结构来对你创造的 UI 进行管理和构建。React 根据 JSX 生成了 **UI 树** 。React DOM 根据 UI 树去更新浏览器的 DOM 元素。（React Native 则在不同的移动端平台将 UI 树转换为相应的元素）

<img alt="React 获取组件后将它们转换为 UI 树结构，然后 ReactDOM 在浏览器中使用 DOM 将它们转换为 HTML。" src="/images/docs/sketches/s_react-dom-tree.png" />

## 状态与其在树中的位置相关联 {/*state-is-tied-to-a-position-in-the-tree*/}

当你创建了一个组件状态，你可能会觉得这个状态存在于组件内。但实际上，状态在 React 内部。根据组件在 UI 树中的位置，React 将它所持有的每个状态与正确的组件关联起来。


下面只定义了一个 `<Counter />` JSX 标签，但将它渲染在了两个不同的位置：

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const counter = <Counter />;
  return (
    <div>
      {counter}
      {counter}
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        加一
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

下面是它们在树中的样子：

<img alt="JSX 被转换为一棵树" src="/images/docs/sketches/s_jsx-to-tree.png" />

**这是两个独立的 counter，因为它们在树中被渲染在了各自的位置。** 一般情况下你不用去考虑这些位置来使用 React，但知道它们是如何工作会很有用。

在 React 中，屏幕中的每个组件都有完全独立的状态。举个例子，当你并排渲染了两个 `Counter` 组件时，它们都拥有各自独立的 `score` 和 `hover` 状态。

试试点击两个 counter 你会发现它们互不影响：

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  return (
    <div>
      <Counter />
      <Counter />
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        加一
      </button>
    </div>
  );
}
```

```css
.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

只有当相同的组件被渲染在了相同的位置，React 才会一直保留着组件的状态。想要验证这一点，可以增加两个计数器的值，取消勾选“渲染第二个计数器”的复选框，然后重新勾选：

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [showB, setShowB] = useState(true);
  return (
    <div>
      <Counter />
      {showB && <Counter />} 
      <label>
        <input
          type="checkbox"
          checked={showB}
          onChange={e => {
            setShowB(e.target.checked)
          }}
        />
        渲染第二个计数器
      </label>
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        加一
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

注意，当停止渲染第二个计数器的那一刻，它的状态完全消失了。这是因为当 React 删除一个组件时， React 会销毁它的状态。

<img alt="React 从树中移出组件的时候，也会同时销毁它的状态" src="/images/docs/sketches/s_remove-ui.png" />

当你重新勾选“渲染第二个计数器”复选框时，另一个计数器及其状态从头开始初始化（`score = 0`）并添加到 DOM 中。

<img alt="React 新增 UI 到 DOM 树时, 它会用新的状态进行初始化。" src="/images/docs/sketches/s_add-back-ui.png" />

**只要一个组件还被渲染在 UI 树的相同位置，React 就会保留它的状态。** 如果它被删除，或者一个不同的组件在相同的位置被渲染，React 将丢弃它的状态。

## 同一组件在相同位置会保留状态 {/*same-component-at-the-same-position-preserves-state*/}

在这个例子中，有两个不同的 `<Counter />` 标签：

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? (
        <Counter isFancy={true} /> 
      ) : (
        <Counter isFancy={false} /> 
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        使用好看的样式
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        加一
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

当你勾选或清除复选框的时候，计数器状态没有被重置。不管 `isFancy` 是 `true` 还是 `false`，根 `App` 组件返回的 `div` 的第一个子元素总是 `<Counter />`：

<img alt="React 只关注组件以及它在 UI 树中渲染的位置。" src="/images/docs/sketches/s_ui-swap.png" />


位于相同位置的相同组件，所以对 React 来说，它是同一个计数器。

<Illustration src="/images/docs/illustrations/i_react-is-blind-to-ui-swap.png" alt="尽管两个组件颜色不同，React 比较后仍然认为它们是相同的。" />

<Gotcha>

记住 **对 React 来说重要的是组件在 UI 树中的位置,而不是在 JSX 的位置！** 这个组件有两个 `return` 语句，它们在 `if` 内外有不同的 `<Counter />` JSX 标签：

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  if (isFancy) {
    return (
      <div>
        <Counter isFancy={true} />
        <label>
          <input
            type="checkbox"
            checked={isFancy}
            onChange={e => {
              setIsFancy(e.target.checked)
            }}
          />
          使用好看的样式
        </label>
      </div>
    );
  }
  return (
    <div>
      <Counter isFancy={false} />
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        使用好看的样式
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        加一
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

你可能认为当你勾选复选框的时候状态会被重置，但它没有！这是因为 **两个 `<Counter />` 标签被渲染在了相同的位置。** React 不知道你的函数里是如何进行条件判断的，它只关注你返回的树。在这两种条件下，`App` 组件都返回了一个包裹着 `<Counter />` 作为第一个子元素的 `div`。这就是 React 认为它们是 _同一个_ `<Counter />` 的原因。

你可以认为它们有相同的“地址”：根节点的第一个子节点的第一个子节点。不管你的逻辑是怎么组织的，这就是 React 在上下两次渲染间将它们匹配的方式。

</Gotcha>

## 相同位置的不同组件将重置状态 {/*different-components-at-the-same-position-reset-state*/}

在这个例子中，勾选复选框会将 `<Counter>` 替换为一个 `<p>`：

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isPaused, setIsPaused] = useState(false);
  return (
    <div>
      {isPaused ? (
        <p>待会见！</p> 
      ) : (
        <Counter /> 
      )}
      <label>
        <input
          type="checkbox"
          checked={isPaused}
          onChange={e => {
            setIsPaused(e.target.checked)
          }}
        />
        休息一下
      </label>
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        加一
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

示例中，你在相同位置用 _不同类型_ 的组件进行切换。初始化时， `<div>` 的第一个子元素是一个 `Counter` 。但是当你切换成一个 `p` 时，React 将 `Counter` 从 UI 树中移除并销毁了它的状态。

<img alt="将一个组件从 UI 树中移除会销毁它的状态。" src="/images/docs/sketches/s_ui-component-swap.png" />

并且，**当你在相同位置渲染了不同的组件时，组件的整个子树都会被重置** 。验证这一点，可以增加计数器的值然后勾选复选框：

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? (
        <div>
          <Counter isFancy={true} /> 
        </div>
      ) : (
        <section>
          <Counter isFancy={false} />
        </section>
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        使用好看的样式
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        加一
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

当你勾选复选框后计数器的状态被重置了。即使你渲染了一个 `Counter` ， `div` 的第一个子元素从 `div` 变成了 `section` 。当子 `div` 从 DOM 中被移除的时候，它底下的整颗树（包含 `Counter` 以及它的状态）也都被销毁了。

<img alt="如果第一个子元素不同了，就回不去了！" src="/images/docs/sketches/s_ui-components-swap.png" />

一般来说，**如果你想在重新渲染之间保持状态，树的结构应该“匹配”** 于两次渲染之间。结构不同会导致状态的销毁，因为 React 会在组件从树中移除后销毁它的状态。

<Gotcha>

以下是为什么不应将组件嵌套定义的原因。

示例中， `MyTextField` 组件被定义在了 `MyComponent` 内：

<Sandpack>

```js
import { useState } from 'react';

export default function MyComponent() {
  const [counter, setCounter] = useState(0);

  function MyTextField() {
    const [text, setText] = useState('');

    return (
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
    );
  }

  return (
    <>
      <MyTextField />
      <button onClick={() => {
        setCounter(counter + 1)
      }}>点击了 {counter} 次</button>
    </>
  );
}
```

</Sandpack>


每次点击按钮后，输入框的状态都消失了！这是因为每次渲染后都创建了一个 _不同_ 的 `MyTextField` 函数。在相同位置渲染的是 _不同_ 的组件，所以 React 将它相关的状态都重置了。这样会导致 bug 以及性能问题。为了避免这个问题， **总是将组件定义在最外层并且不要嵌套定义。**

</Gotcha>

## 在相同位置重置状态 {/*resetting-state-at-the-same-position*/}

默认情况下，React 会保留还在相同位置的组件的状态。通常这就是我们想要的，所以它作为默认行为很合理。但有时候，你可能想要重置一个组件的状态。考虑一下这个应用，它可以让两个玩家在每个回合中记录他们的得分：

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA ? (
        <Counter person="Taylor" />
      ) : (
        <Counter person="Sarah" />
      )}
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        下一位玩家！
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person} 的分数：{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        加一
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

目前你切换了玩家后，分数还是没有变化。这两个 `Counter` 出现于相同位置，所以 React 认为是 _同一个_ `Counter` ，只是传了不同的 `person` prop。

<Illustration src="/images/docs/illustrations/i_react-is-blind-to-ui-swap.png" alt="React 比较这两个组件，虽然他们的颜色不同，但依然认为它们是相同的。" />

概念上讲，这个应用的两个计数器应该是分离的。它们虽然 UI 上的位置相同，但是一个是 Taylor 的计数器，一个是 Sarah 的计数器。

有两个方法可以让它们之间切换时重置状态：

1. 将组件渲染在不同的位置
2. 给每个组件一个明确的标识 `key`


### 方法一：将组件渲染在不同的位置 {/*option-1-rendering-a-component-in-different-positions*/}

如果想要两个 `Counter` 是独立的，可以将他们渲染在不同的位置：

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA &&
        <Counter person="Taylor" />
      }
      {!isPlayerA &&
        <Counter person="Sarah" />
      }
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        下一位玩家！
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person} 的分数：{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        加一
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

* 初始化时， `isPlayerA` 的值是 `true` 。所以第一个位置包含了 `Counter` 的状态，而第二个位置是空的。
* 点击了“下一位玩家”按钮后，第一个位置被清空了但是第二个位置现在包含了一个 `Counter` 。

<img alt=" " src="/images/docs/sketches/s_placeholder-ui.png" />

> 每次 `Counter` 被从 DOM 中移除时它的状态会被销毁。这就是每次点击了按钮后它们被重置的原因。

如果只有少数独立的组件在相同的位置渲染，这个解决方案很方便。这个例子中只有 2 个组件，所以在 JSX 里分开进行渲染并不麻烦。

### 方法二：使用 key 来重置状态 {/*option-2-resetting-state-with-a-key*/}

还有另一种更通用的方法来重置组件的状态。

你可能已经在 [列表渲染](/learn/rendering-lists#keeping-list-items-in-order-with-key) 章节看过了 `key` 。但 key 不只是用于列表！你可以使用 key 来让 React 区分任何组件。默认情况下，React 使用父级中的顺序（“第一个计数器”、“第二个计数器”）来区分组件。但是 key 可以告诉 React 这不仅仅是 *第一个* 或者 *第二个* 计数器，而是一个特定的计数器————例如，*Taylor* 的计数器。这样不管它出现在哪里 React 都会知道它是 *Taylor* 的计数器！

在这个例子中，两个 `<Counter />` 不会共享状态，即使它们出现在 JSX 中的相同位置：

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA ? (
        <Counter key="Taylor" person="Taylor" />
      ) : (
        <Counter key="Sarah" person="Sarah" />
      )}
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        下一位玩家！
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person} 的分数：{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        加一
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

在 Taylor 和 Sarah 之间切换不会保留状态。因为 **你给它们赋了不同的 `key`：**

```js
{isPlayerA ? (
  <Counter key="Taylor" person="Taylor" />
) : (
  <Counter key="Sarah" person="Sarah" />
)}
```

指定 `key` 告诉 React 使用 `key` 作为其位置信息的一部分，而不是它们在父元素中的顺序。这就是为什么尽管你用 JSX 将组件渲染在相同位置，但在 React 看来它们是两个不同的计数器。因此它们不会共享状态。每次一个计数器出现在屏幕上时，它的状态会被创建。每次它被移除了，它的状态会被销毁。在它们之间切换会一次又一次地重置它们的状态。

<Illustration src="/images/docs/illustrations/i_keys-in-trees.png" alt="React distinguishes between components with different keys, even if they are of the same type." />

> 请记住 key 不是全局唯一的。它们只能在同一父元素内指定顺序。

### 使用 key 重置表单 {/*resetting-a-form-with-a-key*/}

使用 key 来重置状态在处理表单时特别有用。

在这个聊天应用中， `<Chat>` 组件包含文本输入状态：

<Sandpack>

```js App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat contact={to} />
    </div>
  )
}

const contacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'跟 ' + contact.name + ' 聊一聊'}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>发送到 {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

尝试在输入框中输入一些内容，然后点击 “Alice” 或 “Bob” 去切换到不同的收件人。你会发现因为 `<Chat>` 被渲染在了树的相同位置，输入框的状态依然被保留了。

**在很多应用里这可能就是想要的行为，但在这个聊天应用里不是的！** 你不希望用户因为一次偶然的点击而把他们已经输入的信息发送给一个错误的人。要修复这个问题，只需给组件添加一个 `key` ：

```js
<Chat key={to.id} contact={to} />
```

这样确保了当你选择一个不同的收件人时， `Chat` 组件以及它在树中的任何状态都将从头开始重新创建。 React 还将重新创建 DOM 元素，而不是复用它们。

现在切换收件人都将清除文本字段：

<Sandpack>

```js App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat key={to.id} contact={to} />
    </div>
  )
}

const contacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'跟 ' + contact.name + ' 聊一聊'}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>发送到 {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<DeepDive title="Preserving state for removed components">

在真正的聊天应用中，当用户再次选择前一个收件人时，你可能希望恢复输入的状态。对于不可见的组件，有几种方法可以让其状态保持“存活”：

- 你可以渲染 _所有_ 的聊天而不只是当前这一个，但是用 CSS 隐藏其他的。这些聊天不会从树中移除，所以它们的内部状态会被保留下来。这种方法对于简单 UI 非常有效。但如果隐藏的树节点很大且包含了大量的 DOM 节点，那么性能会变得很差。
- 你可以进行 [状态提升](/learn/sharing-state-between-components) 并在父组件中保存每个收件人的草稿消息。这样即使子组件被移除了也无所谓，因为保留重要信息的是父组件。这是最常见的方法。
- 除了 React 的状态，你也可以使用其他数据源。例如，即使用户不小心关闭页面后你也希望草稿消息持久化。要实现这一点，你可以让 `Chat` 组件从 [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) 读取数据进行初始化，并把草稿保存到 localStorage 。

无论采取哪种策略，与 Alice 的聊天在概念上都不同于与 Bob 的聊天，因此根据当前收件人为 `<Chat>` 树指定一个 `key` 是有意义的。

</DeepDive>

<Recap>

- 只要在相同位置渲染的是相同组件， React 就会保留状态。
- 状态不是保留在 JSX 标签里。它与你在树中放置该 JSX 的位置相关联。
- 你可以通过指定一个不同的 key 让一个子树重置它的状态。
- 不要嵌套组件的定义，否则将意外地重置状态。

</Recap>



<Challenges>

### 修复丢失的输入文本 {/*fix-disappearing-input-text*/}

这个例子在你按了按钮后会展示一条消息，但同时也会意外地重置输入文本。为什么会发生这种情况？修复它，使按下按钮不再重置输入的文本。

<Sandpack>

```js App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  if (showHint) {
    return (
      <div>
        <p><i>提示：你最喜欢哪个城市？</i></p>
        <Form />
        <button onClick={() => {
          setShowHint(false);
        }}>隐藏提示</button>
      </div>
    );
  }
  return (
    <div>
      <Form />
      <button onClick={() => {
        setShowHint(true);
      }}>显示提示</button>
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>

<Solution>

`Form` 被渲染在了不同的位置是问题所在。在 `if` 分支里， `Form` 是 `<div>` 的第二个子元素，但在 `else` 分支里它是第一个子元素。所以在相同位置的组件类型发生了变化。第一个位置在保存 `p` 和 `Form` 之间变化，而第二个位置在保存 `Form` 和 `button` 之间变化。每当组件类型发生变化时， React 都会重置状态。

最简单的解决方案是统一分支的写法，这样 `Form` 总是在相同位置渲染：

<Sandpack>

```js App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  return (
    <div>
      {showHint &&
        <p><i>提示：你最喜欢哪个城市？</i></p>
      }
      <Form />
      {showHint ? (
        <button onClick={() => {
          setShowHint(false);
        }}>隐藏提示</button>
      ) : (
        <button onClick={() => {
          setShowHint(true);
        }}>显示提示</button>
      )}
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>


还有个技巧，你可以将 `null` 添加到 `else` 分支的 `<Form />` 前，以匹配 `if` 的分支结构：

<Sandpack>

```js App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  if (showHint) {
    return (
      <div>
        <p><i>提示：你最喜欢哪个城市？</i></p>
        <Form />
        <button onClick={() => {
          setShowHint(false);
        }}>隐藏提示</button>
      </div>
    );
  }
  return (
    <div>
      {null}
      <Form />
      <button onClick={() => {
        setShowHint(true);
      }}>显示提示</button>
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>

这样 `Form` 总是第二个子元素，所以它保持在相同位置并保留了它的状态。但是这种方法不那么明显，并且会引入其他人删除这个 `null` 的风险。

</Solution>

### 交换两个表单字段 {/*swap-two-form-fields*/}

这个表单可以让你输入姓氏和名字。它还有一个复选框控制哪个字段放在前面。勾选复选框时，“姓氏”字段将出现在“名字”字段之前。

它差不多可以正常工作，但有一个 bug 。如果你填写了“名字”输入框并勾选复选框，文本将保留在第一个输入(现在变成了“姓氏”)。修复它，当你反转顺序时输入文本 *也* 会跟着移动。

<Hint>

对于这两个字段来说，只利用它们在父节点中的位置不足以实现功能。有没有办法让 React 知道如何在重新渲染之间匹配状态？

</Hint>

<Sandpack>

```js App.js
import { useState } from 'react';

export default function App() {
  const [reverse, setReverse] = useState(false);
  let checkbox = (
    <label>
      <input
        type="checkbox"
        checked={reverse}
        onChange={e => setReverse(e.target.checked)}
      />
      反转顺序
    </label>
  );
  if (reverse) {
    return (
      <>
        <Field label="姓氏" /> 
        <Field label="名字" />
        {checkbox}
      </>
    );
  } else {
    return (
      <>
        <Field label="名字" /> 
        <Field label="姓氏" />
        {checkbox}
      </>
    );    
  }
}

function Field({ label }) {
  const [text, setText] = useState('');
  return (
    <label>
      {label}：
      <input
        type="text"
        value={text}
        placeholder={label}
        onChange={e => setText(e.target.value)}
      />
    </label>
  );
}
```

```css
label { display: block; margin: 10px 0; }
```

</Sandpack>

<Solution>

为 `if` 和 `else` 分支中的两个 `<Field>` 组件都指定一个 `key` 。这告诉 React 如何“匹配” `<Field>` 的正确状态，即使它们在父节点中的顺序发生了变化：

<Sandpack>

```js App.js
import { useState } from 'react';

export default function App() {
  const [reverse, setReverse] = useState(false);
  let checkbox = (
    <label>
      <input
        type="checkbox"
        checked={reverse}
        onChange={e => setReverse(e.target.checked)}
      />
      反转顺序
    </label>
  );
  if (reverse) {
    return (
      <>
        <Field key="lastName" label="姓氏" /> 
        <Field key="firstName" label="名字" />
        {checkbox}
      </>
    );
  } else {
    return (
      <>
        <Field key="firstName" label="名字" /> 
        <Field key="lastName" label="姓氏" />
        {checkbox}
      </>
    );    
  }
}

function Field({ label }) {
  const [text, setText] = useState('');
  return (
    <label>
      {label}：
      <input
        type="text"
        value={text}
        placeholder={label}
        onChange={e => setText(e.target.value)}
      />
    </label>
  );
}
```

```css
label { display: block; margin: 10px 0; }
```

</Sandpack>

</Solution>

### 重置详情表单 {/*reset-a-detail-form*/}

这是一个可编辑的联系人列表。你您可以编辑所选联系人的详细信息，然后点击“保存”进行更新或点击“重置”来撤消你的修改。

当你选中另一个联系人（比如， Alice），状态会更新，但表单会一直显示前一个联系人的详细信息。修复它，使选定的联系人改变时，表单获得重置时。

<Sandpack>

```js App.js
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        initialData={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js ContactList.js
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js EditContact.js
import { useState } from 'react';

export default function EditContact({ initialData, onSave }) {
  const [name, setName] = useState(initialData.name);
  const [email, setEmail] = useState(initialData.email);
  return (
    <section>
      <label>
        名称：
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        邮箱：
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: initialData.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        保存
      </button>
      <button onClick={() => {
        setName(initialData.name);
        setEmail(initialData.email);
      }}>
        重置
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<Solution>

将 `key={selectedId}` 赋给 `EditContact` 组件。这样在不同联系人之间切换将重置表单：

<Sandpack>

```js App.js
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        key={selectedId}
        initialData={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js ContactList.js
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js EditContact.js
import { useState } from 'react';

export default function EditContact({ initialData, onSave }) {
  const [name, setName] = useState(initialData.name);
  const [email, setEmail] = useState(initialData.email);
  return (
    <section>
      <label>
        名称：
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        邮箱：
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: initialData.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        保存
      </button>
      <button onClick={() => {
        setName(initialData.name);
        setEmail(initialData.email);
      }}>
        重置
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

</Solution>

### 清除加载中的图片 {/*clear-an-image-while-its-loading*/}

当点击“下一张”时，浏览器开始加载下一张图片。但因为它显示在相同的 `<img>` 标签中，默认情况下在下一张图片加载完成前你都会看到上一张图片。如果文案与图片一一对应很重要，那么这可能不是我们想要的。调整它使得你点击“下一张”时上一张图片立即被清除。

<Hint>

有没有办法让 React 重新创建而不是复用 DOM ？

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const hasNext = index < images.length - 1;

  function handleClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  let image = images[index];
  return (
    <>
      <button onClick={handleClick}>
        下一张
      </button>
      <h3>
        第 {index + 1} 张图片 / {images.length}
      </h3>
      <img src={image.src} />
      <p>
        {image.place}
      </p>
    </>
  );
}

let images = [{
  place: 'Penang, Malaysia',
  src: 'https://i.imgur.com/FJeJR8M.jpg'
}, {
  place: 'Lisbon, Portugal',
  src: 'https://i.imgur.com/dB2LRbj.jpg'
}, {
  place: 'Bilbao, Spain',
  src: 'https://i.imgur.com/z08o2TS.jpg'
}, {
  place: 'Valparaíso, Chile',
  src: 'https://i.imgur.com/Y3utgTi.jpg'
}, {
  place: 'Schwyz, Switzerland',
  src: 'https://i.imgur.com/JBbMpWY.jpg'
}, {
  place: 'Prague, Czechia',
  src: 'https://i.imgur.com/QwUKKmF.jpg'
}, {
  place: 'Ljubljana, Slovenia',
  src: 'https://i.imgur.com/3aIiwfm.jpg'
}];
```

```css
img { width: 150px; height: 150px; }
```

</Sandpack>

<Solution>

你可以为 `<img>` 提供一个 `key` 。当 `key` 更改时，React 将从头开始重新创建 `<img>` DOM 节点。这样会导致在每张图片加载时一个短暂的闪白，所以你不会希望应用里的每张图片都这样子。但是如果你想确保图片与文本始终匹配，那这么做是有意义的。

<Sandpack>

```js
import { useState } from 'react';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const hasNext = index < images.length - 1;

  function handleClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  let image = images[index];
  return (
    <>
      <button onClick={handleClick}>
        下一张
      </button>
      <h3>
        第 {index + 1} 张图片 / {images.length}
      </h3>
      <img key={image.src} src={image.src} />
      <p>
        {image.place}
      </p>
    </>
  );
}

let images = [{
  place: 'Penang, Malaysia',
  src: 'https://i.imgur.com/FJeJR8M.jpg'
}, {
  place: 'Lisbon, Portugal',
  src: 'https://i.imgur.com/dB2LRbj.jpg'
}, {
  place: 'Bilbao, Spain',
  src: 'https://i.imgur.com/z08o2TS.jpg'
}, {
  place: 'Valparaíso, Chile',
  src: 'https://i.imgur.com/Y3utgTi.jpg'
}, {
  place: 'Schwyz, Switzerland',
  src: 'https://i.imgur.com/JBbMpWY.jpg'
}, {
  place: 'Prague, Czechia',
  src: 'https://i.imgur.com/QwUKKmF.jpg'
}, {
  place: 'Ljubljana, Slovenia',
  src: 'https://i.imgur.com/3aIiwfm.jpg'
}];
```

```css
img { width: 150px; height: 150px; }
```

</Sandpack>

</Solution>

### 修复列表中错位的状态 {/*fix-misplaced-state-in-the-list*/}

在这个列表中每个 `Contact` 都有个状态表示是否按下了“显示邮箱”。点击 Alice 的“显示邮箱”按钮，然后勾选“以相反的顺序显示”复选框。你会注意到现在展开的是 _Taylor_ 的邮箱，而已经被移到底部的 Alice 的邮箱已经被收起了。

修复它使得不管选中的顺序如何，表示展开的状态都与各个联系人相关联。

<Sandpack>

```js App.js
import { useState } from 'react';
import Contact from './Contact.js';

export default function ContactList() {
  const [reverse, setReverse] = useState(false);

  const displayedContacts = [...contacts];
  if (reverse) {
    displayedContacts.reverse();
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          value={reverse}
          onChange={e => {
            setReverse(e.target.checked)
          }}
        />{' '}
        以相反的顺序显示
      </label>
      <ul>
        {displayedContacts.map((contact, i) =>
          <li key={i}>
            <Contact contact={contact} />
          </li>
        )}
      </ul>
    </>
  );
}

const contacts = [
  { id: 0, name: 'Alice', email: 'alice@mail.com' },
  { id: 1, name: 'Bob', email: 'bob@mail.com' },
  { id: 2, name: 'Taylor', email: 'taylor@mail.com' }
];
```

```js Contact.js
import { useState } from 'react';

export default function Contact({ contact }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <p><b>{contact.name}</b></p>
      {expanded &&
        <p><i>{contact.email}</i></p>
      }
      <button onClick={() => {
        setExpanded(!expanded);
      }}>
        {expanded ? '隐藏' : '显示'}邮箱
      </button>
    </>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li {
  margin-bottom: 20px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<Solution>

这个例子的问题是使用了 index 作为 `key`：

```js
{displayedContacts.map((contact, i) =>
  <li key={i}>
```

然而我们希望状态与 _每个特定的联系人_ 相关联。

使用联系人的 ID 作为 `key` 来修复这个问题：

<Sandpack>

```js App.js
import { useState } from 'react';
import Contact from './Contact.js';

export default function ContactList() {
  const [reverse, setReverse] = useState(false);

  const displayedContacts = [...contacts];
  if (reverse) {
    displayedContacts.reverse();
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          value={reverse}
          onChange={e => {
            setReverse(e.target.checked)
          }}
        />{' '}
        以相反的顺序显示
      </label>
      <ul>
        {displayedContacts.map(contact =>
          <li key={contact.id}>
            <Contact contact={contact} />
          </li>
        )}
      </ul>
    </>
  );
}

const contacts = [
  { id: 0, name: 'Alice', email: 'alice@mail.com' },
  { id: 1, name: 'Bob', email: 'bob@mail.com' },
  { id: 2, name: 'Taylor', email: 'taylor@mail.com' }
];
```

```js Contact.js
import { useState } from 'react';

export default function Contact({ contact }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <p><b>{contact.name}</b></p>
      {expanded &&
        <p><i>{contact.email}</i></p>
      }
      <button onClick={() => {
        setExpanded(!expanded);
      }}>
        {expanded ? '显示' : '隐藏'}邮箱
      </button>
    </>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li {
  margin-bottom: 20px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

状态与树的位置相关联。 `key` 允许你指定一个具名的位置，而不再依赖于顺序。

</Solution>

</Challenges>