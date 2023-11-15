---
title: "介绍 react.dev"
---

2023 年 3 月 16 日 [Dan Abramov](https://twitter.com/dan_abramov) 与 [Rachel Nabors](https://twitter.com/rachelnabors)

---

<Intro>

今天，我们非常高兴推出 react.dev，React 及其文档的新家。在本文中，我们想带你参观新网站。

</Intro>

---

## tl;dr {/*tldr*/}

* 新的 React 文档网站（[react.dev](https://react.dev)）将介绍使用函数式组件和 Hook 的现代 React。
* 新网站包括了图表、插图、挑战和超过 600 个新的交互式示例。
* 旧的 React 文档网站现在已经迁移到 [legacy.reactjs.org](https://legacy.reactjs.org)。

## 新网站，新域名，新主页 {/*new-site-new-domain-new-homepage*/}

首先，介绍一些小的背景。

为了庆祝新文档的发布，更重要的是为了清晰区分新旧内容，我们已经将域名更改为更短的 [react.dev](https://react.dev)；旧的 [reactjs.org](https://reactjs.org) 域名现在将重定向到此处。

旧的 React 文档现在已经存档于 [legacy.reactjs.org](https://legacy.reactjs.org)。以避免“破坏网络”，所有现有的指向旧内容的链接将自动重定向到那里，但是旧网站将不会再得到新的更新。

不敢相信，React 很快就要十岁了。在 JavaScript 的年代里，这就像整整一个世纪！我们 [更新了 React 主页](https://react.dev)，以反映我们为什么认为 React 是创建用户界面的绝佳方式，并更新了入门指南，更突出地提到基于现代 React 的框架。

如果你还没有看过新主页，请快去看看！

## 进入使用 Hook 的现代 React {/*going-all-in-on-modern-react-with-hooks*/}

当 React 在 2018 年发布 Hook 时，Hook 文档假定读者熟悉类组件。这有助于社区非常迅速地采用 Hook，但是一段时间后，旧的文档无法为新读者服务，因为新读者不得不学习两次 React：一次是使用类式组件，然后再学习在函数式组件中使用 Hook。

**新文档从一开始就使用 Hook 来介绍 React**。新文档分为两个主要部分：

* **[学习 React](/learn)** 是一个自学课程，从头开始介绍 React。
* **[API 参考](/reference)** 提供了每个 React API 的详细信息和使用示例。

让我们更仔细地看看可以从每个部分中找到什么。

<Note>

仍有一些罕见的类式组件尚未有基于 Hook 的替代品。React 仍然支持类式组件，并且在新网站的 [legacy API](/reference/react/legacy) 部分中有文档记录。

</Note>

## 快速入门 {/*quick-start*/}

学习部分从 [快速入门](/learn) 页面开始。它是 React 的一个简短介绍性导览，介绍了诸如组件、props 和 state 等概念，但并不详细介绍如何使用它们。

如果你喜欢通过实践来学习，我们建议你接下来查看 [井字棋教程](/learn/tutorial-tic-tac-toe)。它会带领你一步步构建一个小游戏，同时介绍你每天都会用到的技能。这是你将要构建的内容：

<Sandpack>

```js App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

```css styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

我们还想强调一下 [React 哲学](/learn/thinking-in-react) ——这是许多人理解 React 的教程。**我们使用了函数式组件和 Hook 更新了这两个经典教程**。

<Note>

上面的例子使用了 sandbox。我们在整个网站上添加了超过 600 个 sandbox。你可以编辑所有的 sandbox，或者点击右上角的 Fork 按钮，然后在单独的标签页中打开它。sandbox 可以让你快速体验 React API，探索你的想法并检查你的理解。

</Note>

## 一步步学习 React {/*learn-react-step-by-step*/}

我们希望世界上每个人都有平等机会自学 React。

这就是为什么“学习”部分被组织成一个自学课程的章节。前两章描述了 React 的基本知识。如果你是初次尝试 React，或者想要刷新你对 React 的记忆，可以从这里开始：

- **[描述 UI](/learn/describing-the-ui)** 章节介绍了如何使用组件显示信息。
- **[添加交互性](/learn/adding-interactivity)** 章节介绍了如何在响应用户输入时更新屏幕。

接下来的两章持续深入，将带你了解更棘手的部分：

- **[管理状态](/learn/managing-state)** 章节介绍了如何在应用程序变得越来越复杂时组织逻辑。
- **[应急方案](/learn/escape-hatches)** 章节介绍了如何“走出”React，并在何时做出最明智的决策。

每个章节都由几个相关的页面组成。其中大部分页面将介绍特定的技能或技术，例如 [使用 JSX 编写标记](/learn/writing-markup-with-jsx)、[更新状态中的对象](/learn/updating-objects-in-state) 或 [在组件间共享状态](/learn/sharing-state-between-components)。一些页面聚焦于解释一个概念，例如 [渲染和提交](/learn/render-and-commit) 或 [将状态作为快照（snapshot）](/learn/state-as-a-snapshot)。还有一些页面如 [你可能不需要 Effect](/learn/you-might-not-need-an-effect) 是基于我们多年的经验而分享的建议。

你不必完全按顺序阅读这些章节，谁有这个时间呢？！不过也许你可以。学习部分的页面只依赖于早期页面介绍的概念。如果你想像读书一样阅读它，那就去吧！

### 使用挑战（challenge）检查你的理解 {/*check-your-understanding-with-challenges*/}

“学习”章节的大多数页面都以一些挑战结尾，以检查你的理解情况。例如以下是有关 [条件渲染](/learn/conditional-rendering#challenges) 页面上的一些挑战。

除非你真的如此想，不然不必现在就解决它们！

<Challenges noTitle={true}>

#### 使用 `? :` 显示不完整 item 的图标 {/*show-an-icon-for-incomplete-items-with--*/}

如果 `isPacked` 不为 `true`，使用条件运算符（`cond ? a : b`）渲染 ❌。

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✔'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked ? '✔' : '❌'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

</Solution>

#### 使用 `&&` 展示 item 的重要性 {/*show-the-item-importance-with-*/}

在这个例子中，每个 `Item` 组件都会接收一个数字类型的 `importance` 属性。使用 `&&` 运算符来渲染斜体 "_(Importance: X)_"，但只有在 `importance` 属性不为零时才渲染。你的列表应该看起来像下面一样：

* Space suit _(Importance: 9)_
* Helmet with a golden leaf
* Photo of Tam _(Importance: 6)_

不要忘记在 label 之间添加一个空格！

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          importance={9} 
          name="Space suit" 
        />
        <Item 
          importance={0} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          importance={6} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

应该这样来实现：

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
      {importance > 0 && ' '}
      {importance > 0 &&
        <i>(Importance: {importance})</i>
      }
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          importance={9} 
          name="Space suit" 
        />
        <Item 
          importance={0} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          importance={6} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

请注意，你必须写成 `importance > 0 && ...` 而不是 `importance && ...`，这样如果 `importance` 的值为 `0` 时，就不会将 `0` 作为结果进行渲染！

在这个解决方案中，使用了两个独立的条件来在名称和 importance label 之间插入一个空格。或者，你可以使用带有前导空格的 Fragment：`importance > 0 && <> <i>...</i></>`，或者在 `<i>` 标签内立即添加一个空格：`importance > 0 && <i> ...</i>`。

</Solution>

</Challenges>

请注意左下角的“显示解决方案”按钮。如果你想要检查自己的代码，它会很有用！

### 通过图表和插图来建立直觉 {/*build-an-intuition-with-diagrams-and-illustrations*/}

当我们无法弄清楚如何仅用代码和文字来解释某些内容时，我们添加了有助于提供一些直觉的图表。例如，下面是 [保存和重置 state](/learn/preserving-and-resetting-state) 中的图表之一：

<Diagram name="preserving_state_diff_same_pt1" height={350} width={794} alt="图表包含三个部分，每个部分之间有一个箭头过渡。 第一部分包含一个标记为 `div` 的 React 组件，其中有一个标记为 `section` 的子组件，该组件有一个标记为 `Counter` 的子组件，其中包含一个标记为 `count`、值为 3 的 state 气泡。中间部分具有相同的 `div` 父组件，但子组件现已被删除，由黄色“proof”图像指示。第三部分再次具有相同的 `div` 父级，现在有一个由黄色突出显示并且标记为 `div` 的新子级，还有一个标记为 `Counter` 的新子级，其中包含一个标记为 `count` 且值为 0 的 state 气泡。她们都使用黄色进行了高亮。">

当 `section` 被改变为 `div` 时，`section` 会被删除而新的 `div` 会被添加。

</Diagram>

在文档中还有一些插图——这是其中一个 [浏览器绘制屏幕的示意图](/learn/render-and-commit#epilogue-browser-paint)。

<Illustration alt="浏览器正在绘制“带有卡片元素的静物画”" src="/images/docs/illustrations/i_browser-paint.png" />

我们已经与浏览器厂商确认，这个描绘是 100% 科学准确的。

## 新的并且更细致的 API 参考 {/*a-new-detailed-api-reference*/}

在 [API 参考](/reference/react) 中，每个 React API 现在都有一个专门的页面。这包括各种类型的 API：

- 内置 Hook，比如 [`useState`](/reference/react/useState)。
- 内置组件，比如 [`<Suspense>`](/reference/react/Suspense)。
- 内置浏览器组件，比如 [`<input>`](/reference/react-dom/components/input)。
- 面向框架的 API，比如 [`renderToPipeableStream`](/reference/react-dom/server/renderToReadableStream)。
- 其他 React API，比如 [`memo`](/reference/react/memo)。

你会注意到，每个 API 页面至少被分成两个部分：**参考** 和 **用法**。

[参考](/reference/react/useState#reference) 通过列举参数与返回值描述了正式的 API。这一部分比较简洁，但如果你不熟悉该 API，你可能会感觉有点抽象。“参考”描述了一个 API 做什么，但不是如何使用它。

[用法](/reference/react/useState#usage) 展示了为什么需要以及如何在实践中使用这个 API，就像同事或朋友可能会解释的那样。它展示了 React 团队设计每个 API 的 **典型使用场景**。我们添加了彩色代码片段、使用不同 API 的示例以及可以复制和粘贴的示例。

<Recipes titleText="useState 的基础示例" titleId="examples-basic">

#### 数字计数 {/*counter-number*/}

在这个例子中，`count` state 变量保存了一个数字。点击按钮会将其递增。

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

<Solution />

#### 输入文本（字符串） {/*text-field-string*/}

在这个例子中，`text` state 变量保存一个字符串。当你输入时，`handleChange` 从浏览器输入 DOM 元素中读取最新的输入值，并调用 `setText` 来更新 state。这使得你可以在下方显示当前的 `text`。

<Sandpack>

```js
import { useState } from 'react';

export default function MyInput() {
  const [text, setText] = useState('你好');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      <input value={text} onChange={handleChange} />
      <p>你输入了：{text}</p>
      <button onClick={() => setText('你好')}>
        重置
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

#### 多选框（布尔值） {/*checkbox-boolean*/}

在这个例子中，`liked` state 变量保存一个布尔值。当你点击输入框时，`setLiked` 用浏览器复选框输入是否被选中更新 `liked` state 变量。`liked` 变量被用于渲染复选框下方的文本。

<Sandpack>

```js
import { useState } from 'react';

export default function MyCheckbox() {
  const [liked, setLiked] = useState(true);

  function handleChange(e) {
    setLiked(e.target.checked);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={liked}
          onChange={handleChange}
        />
        我喜欢这个
      </label>
      <p>你 {liked ? '喜欢' : '不喜欢'} 这个。</p>
    </>
  );
}
```

</Sandpack>

<Solution />

#### 表单（使用两个 state） {/*form-two-variables*/}

你可以在同一个组件中定义两个 state 变量。每一个 state 变量都是完全独立的。

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  return (
    <>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => setAge(age + 1)}>
        增大年龄。
      </button>
      <p>你好，{name}。你现在 {age} 岁。</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

一些 API 页面还包括针对常见问题的 [故障排除](/reference/react/useEffect#troubleshooting) 和针对弃用 API 的 [替代方案](/reference/react-dom/findDOMNode#alternatives)。

我们希望 API 参考不仅仅是用来查找参数，还可以用来查看任何给定 API 可以做的所有不同事情以及与其他 API 相关联的方法。

## 接下来还有什么 {/*whats-next*/}

对新文档的介绍到此结束！浏览一下新网站，看看你喜欢或不喜欢什么，欢迎在 [匿名调查](https://www.surveymonkey.co.uk/r/PYRPF3X) 或 [问题跟踪器](https://github.com/reactjs/reactjs.org/issues) 中提供反馈。

我们承认这个项目花费了很长时间才发布。我们希望 React 社区保持应该拥有的高质量标准。在编写这些文档和创建所有示例的过程中，我们发现了一些自己解释中的错误、React 中的错误，甚至是 React 设计中的空缺，我们现在正在努力解决。我们希望新文档将帮助我们在未来将 React 本身保持在更高的标准上。

我们听到了许多想要扩展网站内容和功能的请求，例如：

- 为所有示例提供 TypeScript 版本；
- 创建更新的性能、测试和可访问性指南；
- 独立记录 React 服务器组件，而不是依赖于支持它们的框架；
- 与我们的国际社区合作，将新文档翻译成各种语言；
- 在新网站中添加缺少的功能（例如，此博客的 RSS）

[react.dev](https://react.dev/) 已经发布，我们希望将重心从“追赶”第三方 React 教育资源转向添加新信息并进一步改进我们的新网站。

我们认为现在是学习 React 的最好的时机。

## 贡献者 {/*who-worked-on-this*/}

在 React 团队中，[Rachel Nabors](https://twitter.com/rachelnabors/) 领导了该项目并提供了插图，而 [Dan Abramov](https://twitter.com/dan_abramov) 设计了课程。他们也共同撰写了大部分内容。

当然，没有一个这么大的项目是孤立进行的。我们有很多想要感谢的人！

[Sylwia Vargas](https://twitter.com/SylwiaVargas) 改进了我们的示例，而不是继续使用“foo/bar/baz”、kitten，和来自世界各地的科学家、艺术家和城市。[Maggie Appleton](https://twitter.com/Mappletons) 将我们的涂鸦转化成了清晰的图表系统。

感谢 [David McCabe](https://twitter.com/mcc_abe)、[Sophie Alpert](https://twitter.com/sophiebits)、[Rick Hanlon](https://twitter.com/rickhanlonii)、[Andrew Clark](https://twitter.com/acdlite) 和 [Matt Carroll](https://twitter.com/mattcarrollcode) 提供额外的写作贡献。我们还要感谢 [Natalia Tepluhina](https://twitter.com/n_tepluhina) 和 [Sebastian Markbåge](https://twitter.com/sebmarkbage) 提供的想法和反馈。

感谢 [Dan Lebowitz](https://twitter.com/lebo) 设计了网站，[Razvan Gradinar](https://dribbble.com/GradinarRazvan) 设计了 sandbox。

在开发方面，感谢 [Jared Palmer](https://twitter.com/jaredpalmer) 进行原型开发。感谢 [Dane Grant](https://twitter.com/danecando) 和来自 [ThisDotLabs](https://www.thisdot.co/) 的 [Dustin Goodman](https://twitter.com/dustinsgoodman) 为 UI 开发提供了支持。感谢 [Ives van Hoorne](https://twitter.com/CompuIves)、[Alex Moldovan](https://twitter.com/alexnmoldovan)、[Jasper De Moor](https://twitter.com/JasperDeMoor) 和来自 [CodeSandbox](https://codesandbox.io/) 的 [Danilo Woznica](https://twitter.com/danilowoz) 为集成 sandbox 做出了贡献。感谢 [Rick Hanlon](https://twitter.com/rickhanlonii) 进行开发和设计工作，完善我们的颜色和细节。感谢 [Harish Kumar](https://www.strek.in/) 和 [Luna Ruan](https://twitter.com/lunaruan) 为网站添加新功能并帮助维护它。

非常感谢那些自愿参加 alpha 和 beta 测试计划的人。你们的热情和宝贵的反馈帮助我们塑造了这些文档。特别感谢我们的 beta 测试人员 [Debbie O'Brien](https://twitter.com/debs_obrien)，她在 React Conf 2021 上分享了她使用 React 文档的经验。

最后，感谢 React 社区的启发，是你们促使我们完成了这个新的项目。我们希望新文档将帮助大家使用 React 构建任何你想要的用户界面。
