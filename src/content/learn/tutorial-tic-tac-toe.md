---
title: '教程：井字棋游戏'
---

<Intro>

本教程将实现一个小型井字棋游戏，并且你不需要对 React 有任何了解。在此过程中你会学习到一些 React 基本知识，这些知识可以让你对 React 有更深入的了解。

</Intro>

<Note>

本教程专为喜欢 **理论与实战相结合** 以及希望快速看见成果的人而设计。如果你喜欢逐步学习每个概念，请从 [描述 UI](/learn/describing-the-ui) 开始。

</Note>

教程分成以下几个部分：

- [配置](#setup-for-the-tutorial) 是一些准备工作。
- [概览](#overview) 介绍了 React 的 **基础知识**：组件、prop 和 state。
- [完成游戏](#completing-the-game) 介绍了 React 开发中 **最常用的技术**。
- [添加“时间旅行”](#adding-time-travel) 可以让你更深入地了解 React 的独特优势。
### 将会构建什么？ {/*what-are-you-building*/}

本教程将使用 React 构建一个可以交互的井字棋游戏。

你可以在下面预览最终成果：

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

如果你还不是很明白上面的代码，不用担心！本教程的目的就是帮你理解 React 及其语法。

我们建议你在继续本教程之前，先看看上面的井字棋游戏。我们会注意到的一项功能是，棋盘右侧有一个编号列表，它记录了游戏中落子的历史，并随着游戏的进行而更新。

体验完游戏以后，继续阅读本教程吧！我们将从一个更简单的模板开始。下一步将介绍相关配置，以便于你可以开始构建这个游戏。

## 配置 {/*setup-for-the-tutorial*/}

在下面的实时代码编辑器中，单击右上角的 **Fork**，将访问网站 CodeSandbox，在新选项卡中打开编辑器。CodeSandbox 让你能够在浏览器中编写代码并预览效果。你应该能够看见一个空方块和本教程的初始代码。

<Sandpack>

```js App.js
export default function Square() {
  return <button className="square">X</button>;
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

<Note>

你也可以使用本地开发环境来跟着这个教程学习，你需要：

1. 安装 [Node.js](https://nodejs.org/en/)
2. 在之前打开的 CodeSandbox 选项卡中，按左上角的按钮打开菜单，然后选择 **File > Export to ZIP**，将代码压缩包下载到本地。
3. 将压缩包解压，打开终端并使用 `cd` 命令切换到你解压后的目录。
4. 使用 `npm install` 安装依赖。
5. 运行 `npm start` 启动本地服务器，按照提示在浏览器中查看运行效果。

如果你卡住了，不要让它挡道。请改为在线进行操作，稍后再尝试本地配置。

</Note>

## 概览 {/*overview*/}

完成配置以后，我们来大概看一看 React 是什么样子吧！

### 看一下刚刚的代码 {/*inspecting-the-starter-code*/}

在 CodeSandbox 中，你将看到三个主要的部分：

![CodeSandbox with starter code](../images/tutorial/react-starter-code-codesandbox.png)

1. _Files_ 部分列出了一些文件：`App.js`、`index.js`、`styles.css` 和一个叫 `public` 的文件夹。
2. _code editor_ 里面你能够看到打开的代码。
3. _browser_ 部分你将看到代码的实时效果。

`App.js` 文件里面的内容应该是这样的：

```jsx
export default function Square() {
  return <button className="square">X</button>;
}
```

_browser_ 部分应该会像下面这样在方块里面显示一个 X：
![x-filled square](../images/tutorial/x-filled-square.png)

现在，让我们仔细来看一看这些文件吧。

#### `App.js` {/*appjs*/}

`App.js` 的代码创建了一个 _组件_。在 React 中，组件是一段可重用代码，它通常作为 UI 界面的一部分。组件用于渲染、管理和更新应用中的 UI 元素。让我们逐行查看这段代码，看看发生了什么：

```js {1}
export default function Square() {
  return <button className="square">X</button>;
}
```

第一行定义了一个名为 `Square` 的函数。`export` JavaScript 关键字使此函数可以在此文件之外访问。`default` 关键字表明它是文件中的主要函数。

```js {2}
export default function Square() {
  return <button className="square">X</button>;
}
```

第二行返回一个按钮。`return` JavaScript 关键字意味着后面的内容都作为值返回给函数的调用者。`<button>` 是一个 JSX 元素。JSX 元素是 JavaScript 代码和 HTML 标签的组合，用于描述要显示的内容。`className="square"` 是一个 button 属性，它决定 CSS 如何设置按钮的样式。`X` 是按钮内显示的文本，`</button>` 闭合 JSX 元素表示不应将任何后续内容放置在按钮内。

#### `styles.css` {/*stylescss*/}

单击 CodeSandbox 中的 `styles.css` 文件。该文件定义了 React 应用的样式。前两个 CSS 选择器（`*` 和 `body`）定义应用大部分的样式，而 `.square` 选择器定义 `className` 属性设置为 `square` 的任何组件的样式。这将与 `App.js` 文件中的 `Square` 组件中的按钮相匹配。
#### `index.js` {/*indexjs*/}

单击 CodeSandbox 中的 `index.js` 的文件。在本教程中我们不会编辑此文件，但它是 `App.js` 文件中创建的组件与 Web 浏览器之间的桥梁。

```jsx
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';

import App from './App';
```

将第 1-5 行将所有必要的部分组合在一起：

* React
* React 与 Web 浏览器对话的库（React DOM）
* 组件的样式
* `App.js` 里面创建的组件

其他文件将它们组合在一起，并将最终成果注入 `public` 文件夹里面的 `index.html` 中。

### 构建棋盘 {/*building-the-board*/}

让我们回到 `App.js`。接下来我们将聚焦于这个文件。

目前棋盘只有一个方块，但你需要九个！如果你只是想着复制粘贴来制作两个像这样的正方形：

```js {2}
export default function Square() {
  return <button className="square">X</button><button className="square">X</button>;
}
```

你将会得到如下错误：

<ConsoleBlock level="error">

/src/App.js: Adjacent JSX elements must be wrapped in an enclosing tag. Did you want a JSX fragment `<>...</>`?

</ConsoleBlock>

React 组件只能返回单个 JSX 元素，而不是像两个按钮那样的多个相邻的 JSX 元素。要解决此问题，可以使用 `<>` 和 `</>` 来包裹多个相邻的 JSX 元素，如下所示：

```js {3-6}
export default function Square() {
  return (
    <>
      <button className="square">X</button>
      <button className="square">X</button>
    </>
  );
}
```

现在你应该可以看见：

![two x-filled squares](../images/tutorial/two-x-filled-squares.png)

非常棒！现在你只需要通过复制粘贴来添加九个方块，然后……

![nine x-filled squares in a line](../images/tutorial/nine-x-filled-squares.png)

哦不！这些方块都在一条直线上，而不是排列成网格。要解决此问题，需要使用 `div` 将方块分到每一行中并添加一些 CSS 样式。当你这样做的时候，需要给每个方块一个数字，以确保你知道每个方块的位置。

`App.js` 文件中，`Square` 组件看起来像这样：

```js {3-19}
export default function Square() {
  return (
    <>
      <div className="board-row">
        <button className="square">1</button>
        <button className="square">2</button>
        <button className="square">3</button>
      </div>
      <div className="board-row">
        <button className="square">4</button>
        <button className="square">5</button>
        <button className="square">6</button>
      </div>
      <div className="board-row">
        <button className="square">7</button>
        <button className="square">8</button>
        <button className="square">9</button>
      </div>
    </>
  );
}
```

`styles.css` 成功设置了样式！现在我们已经使用样式化的 `div` 将组件分组到行中，你拥有了井字棋棋盘：

![tic-tac-toe board filled with numbers 1 through 9](../images/tutorial/number-filled-board.png)

但是现在有个问题，名为 `Square` 的组件实际上不再是正方形了。让我们通过将名称更改为 Board 来解决这个问题：

```js {1}
export default function Board() {
  //...
}
```

此时你的代码应如下所示：

<Sandpack>

```js
export default function Board() {
  return (
    <>
      <div className="board-row">
        <button className="square">1</button>
        <button className="square">2</button>
        <button className="square">3</button>
      </div>
      <div className="board-row">
        <button className="square">4</button>
        <button className="square">5</button>
        <button className="square">6</button>
      </div>
      <div className="board-row">
        <button className="square">7</button>
        <button className="square">8</button>
        <button className="square">9</button>
      </div>
    </>
  );
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

<Note>

嘶，要输入的内容太多了！可以从该页面复制和粘贴代码。但是，如果你愿意迎接一点挑战，我们建议只复制你自己至少手动输入过一次的代码。

</Note>

### 通过 prop 传递数据 {/*passing-data-through-props*/}

接下来，当用户单击正方形时，我们要将正方形的值从空更改为“X”。根据目前构建的棋盘，你需要复制并粘贴九次更新方块的代码（每个方块都需要一次）！但是，React 的组件架构可以创建可重用的组件，以避免混乱、重复的代码。

首先，要将定义第一个方块（`<button className="square">1</button>`）的这行代码从 `Board` 组件复制到新的 `Square` 组件中：

```js {1-3}
function Square() {
  return <button className="square">1</button>;
}

export default function Board() {
  // ...
}
```

然后，将更新 Board 组件并使用 JSX 语法渲染 `Square` 组件：

```js {5-19}
// ...
export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
}
```

需要注意的是，这并不像 `div`，这些你自己的组件如 `Board` 和 `Square`，必须以大写字母开头。

让我们来看一看效果：

![one-filled board](../images/tutorial/board-filled-with-ones.png)

哦不！你失去了你以前有正确编号的方块。现在每个方块都写着“1”。要解决此问题，需要使用 *prop* 将每个方块应具有的值从父组件（`Board`）传递到其子组件（`Square`）。

更新 `Square` 组件，读取从 `Board` 传递的 `value` prop：

```js {1}
function Square({ value }) {
  return <button className="square">1</button>;
}
```

`function Square({ value })` 表示可以向 Square 组件传递一个名为 `value` 的 prop。

现在你如果想要显示对应的 `value` 而不是 `1`，可以试一下像下面这样：

```js {2}
function Square({ value }) {
  return <button className="square">value</button>;
}
```

糟糕！这还不是你想要的：

![value-filled board](../images/tutorial/board-filled-with-value.png)

我们需要从组件中渲染名为 `value` 的 JavaScript 变量，而不是“value”这个词。要从 JSX“转义到 JavaScript”，你需要大括号。在 JSX 中的 `value` 周围添加大括号，如下所示：

```js {2}
function Square({ value }) {
  return <button className="square">{value}</button>;
}
```

现在，你应该会看到一个空的棋盘了：

![empty board](../images/tutorial/empty-board.png)

这是因为 `Board` 组件还没有将 `value` prop 传递给它渲染的每个 `Square` 组件。要修复这个问题，需要向 `Board` 组件里面的的每个 `Square` 组件添加 `value` prop：

```js {5-7,10-12,15-17}
export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square value="1" />
        <Square value="2" />
        <Square value="3" />
      </div>
      <div className="board-row">
        <Square value="4" />
        <Square value="5" />
        <Square value="6" />
      </div>
      <div className="board-row">
        <Square value="7" />
        <Square value="8" />
        <Square value="9" />
      </div>
    </>
  );
}
```

现在你应该能再次看到数字网格：

![tic-tac-toe board filled with numbers 1 through 9](../images/tutorial/number-filled-board.png)

更新后的代码应该是这样：

<Sandpack>

```js App.js
function Square({ value }) {
  return <button className="square">{value}</button>;
}

export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square value="1" />
        <Square value="2" />
        <Square value="3" />
      </div>
      <div className="board-row">
        <Square value="4" />
        <Square value="5" />
        <Square value="6" />
      </div>
      <div className="board-row">
        <Square value="7" />
        <Square value="8" />
        <Square value="9" />
      </div>
    </>
  );
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

### 创建一个具有交互性的组件 {/*making-an-interactive-component*/}

当你单击它的时候，应该用 `X` 来填充 `Square` 组件。在 `Square` 内部声明一个名为 `handleClick` 的函数。然后，将 `onClick` 添加到由 `Square` 返回的按钮的 JSX 元素的 prop 中：

```js {2-4,9}
function Square({ value }) {
  function handleClick() {
    console.log('clicked!');
  }

  return (
    <button
      className="square"
      onClick={handleClick}
    >
      {value}
    </button>
  );
}
```

如果现在单击一个方块，你应该会看到一条日志，上面写着 `"clicked!"` 在 CodeSandbox 中 *Browser* 部分底部的 *Console* 选项卡中。多次单击方块将再次记录 `"clicked!"`。具有相同消息的重复控制台日志不会在控制台中创建更多行。相反，你会在第一次 `"clicked!"` 旁边看到一个递增的计数器。

<Note>

如果使用本地开发环境学习本教程，则需要打开浏览器的控制台。例如，如果使用 Chrome 浏览器，则可以使用键盘快捷键 **Shift + Ctrl + J**（在 Windows/Linux 上）或 **Option + ⌘ + J**（在 macOS 上）查看控制台。

</Note>

下一步，我们希望 Square 组件能够“记住”它被单击过，并用“X”填充它。为了“记住”一些东西，组件使用 *state*.

React 提供了一个名为 `useState` 的特殊函数，可以从组件中调用它来让它“记住”一些东西。让我们将 `Square` 的当前值存储在 `state` 中，并在单击 `Square` 时更改它。

在文件的顶部导入 `useState`。从 `Square` 组件中移除 `value` prop。相反地，在调用 `useState` 的 `Square` 的开头添加一个新行。让它返回一个名为 value 的 state 变量：

```js {1,3,4}
import { useState } from 'react';

function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    //...
```

`value` 存储值，而 `setValue` 是可用于更改值的函数。传递给 `useState` 的 `null` 用作这个 state 变量的初始值，因此此处 `value` 的值开始时等于 null。

由于 `Square` 组件不再接受 prop，将从 Board 组件创建的所有九个 Square 组件中删除 `value` prop：

```js {6-8,11-13,16-18}
// ...
export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
}
```

现在将更改 `Square` 以在单击时显示“X”。替换掉 `console.log("clicked!");` 使用 `setValue('X');` 的事件处理程序。现在你的 `Square` 组件看起来像这样：

```js {5}
function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    setValue('X');
  }

  return (
    <button
      className="square"
      onClick={handleClick}
    >
      {value}
    </button>
  );
}
```

通过从 `onClick` 处理程序调用此 `set` 函数，你告诉 `React` 在单击其 `<button>` 时重新渲染该 `Square`。更新后，方块的值将为“X”，因此会在棋盘上看到“X”。点击任意方块，“X”应该出现：

![adding xes to board](../images/tutorial/tictac-adding-x-s.gif)

每个 Square 都有自己的 state：存储在每个 Square 中的 `value` 完全独立于其他 Square。当你在组件中调用 set 函数时，React 也会自动更新内部的子组件。

完成上述更改后，代码将如下所示：

<Sandpack>

```js App.js
import { useState } from 'react';

function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    setValue('X');
  }

  return (
    <button
      className="square"
      onClick={handleClick}
    >
      {value}
    </button>
  );
}

export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
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

### React 开发者工具 {/*react-developer-tools*/}

React 开发者工具可以检查 React 组件的 prop 和 state。可以在 CodeSandbox 的 *Browser* 部分底部找到 React DevTools 选项卡：

![React DevTools in CodeSandbox](../images/tutorial/codesandbox-devtools.png)

要检查屏幕上的特定组件，请使用 React 开发者工具左上角的按钮：

![Selecting components on the page with React DevTools](../images/tutorial/devtools-select.gif)

<Note>

对于本地开发，React 开发工具可作为 [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)、[Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/) 和 [Edge](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil) 的浏览器扩展使用。安装它，*Component* 选项卡将出现在你的浏览器开发人员工具中，用于使用 React 的站点。

</Note>

## 完成这个游戏 {/*completing-the-game*/}

至此，你已经拥有井字棋游戏的所有基本构建块。要玩完整的游戏，你现在需要在棋盘上交替放置“X”和“O”，并且你需要一种确定获胜者的方法。

### 状态提升 {/*lifting-state-up*/}

目前，每个 `Square` 组件都维护着游戏 state 的一部分。要检查井字棋游戏中的赢家，`Board` 需要以某种方式知道 9 个 `Square` 组件中每个组件的 state。

你会如何处理？起初，你可能会猜测 `Board` 需要向每个 `Square`“询问”`Square` 的 state。尽管这种方法在 React 中在技术上是可行的，但我们不鼓励这样做，因为代码变得难以理解、容易出现错误并且难以重构。相反，最好的方法是将游戏的 state 存储在父 `Board` 组件中，而不是每个 `Square` 中。`Board` 组件可以通过传递一个 prop 来告诉每个 `Square` 显示什么，就像你将数字传递给每个 Square 时所做的那样。

**要从多个子组件收集数据，或让两个子组件相互通信，请改为在其父组件中声明共享 state。父组件可以通过道具将该 state 传回给子组件。这使子组件彼此同步并与其父组件保持同步。**

重构 React 组件时，将状态提升到父组件中很常见。

让我们借此机会尝试一下。编辑 `Board` 组件，使其声明一个名为 `squares` 的 state 变量，该变量默认为对应于 9 个方块的 9 个空值数组：

```js {3}
// ...
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  return (
    // ...
  );
}
```

`Array(9).fill(null)` 创建一个包含九个元素的数组，并将它们中的每一个都设置为 `null`。围绕它的 `useState()` 调用声明了一个初始设置为该数组的 `squares` state 变量。数组中的每个条目对应于一个正方形的值。当你稍后填写棋盘时，`squares` 数组将如下所示：

```jsx
['O', null, 'X', 'X', 'X', 'O', 'O', null, null]
```

现在你的 `Board` 组件需要将 `value` prop 向下传递给它渲染的每个 `Square`：

```js {6-8,11-13,16-18}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} />
        <Square value={squares[1]} />
        <Square value={squares[2]} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} />
        <Square value={squares[4]} />
        <Square value={squares[5]} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} />
        <Square value={squares[7]} />
        <Square value={squares[8]} />
      </div>
    </>
  );
}
```

接下来，你将编辑 `Square` 组件以从 Board 组件接收 `value` prop。这将需要删除 Square 组件自己的 `value` state 跟踪和按钮的 `onClick` prop：

```js {1,2}
function Square({value}) {
  return <button className="square">{value}</button>;
}
```

此时你应该看到一个空的井字棋盘：

![empty board](../images/tutorial/empty-board.png)

你的代码应该是这样的：

<Sandpack>

```js App.js
import { useState } from 'react';

function Square({ value }) {
  return <button className="square">{value}</button>;
}

export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} />
        <Square value={squares[1]} />
        <Square value={squares[2]} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} />
        <Square value={squares[4]} />
        <Square value={squares[5]} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} />
        <Square value={squares[7]} />
        <Square value={squares[8]} />
      </div>
    </>
  );
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

现在，每个 Square 都会收到一个 `value` 道具，对于空方块，该道具将是 `'X'` 、`'O'` 或 `null`。

接下来，你需要更改单击 `Square` 时发生的情况。`Board` 组件现在维护填充了哪些方块。你需要为 `Square` 创建一种更新 `Board` state 的方法。由于 state 对于定义它的组件是私有的，因此你不能直接从 `Square` 更新 `Board` 的 state。

你将从 `Board` 组件向下传递一个函数到 `Square` 组件，你将让 `Square` 在单击方块时调用该函数。你将从单击 `Square` 组件时将调用的函数开始。你将调用该函数 `onSquareClick`：

```js {3}
function Square({ value }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}
```

接下来，将 `onSquareClick` 函数添加到 `Square` 组件的 prop 中：

```js {1}
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}
```

现在，你将把 `onSquareClick` prop 连接到 `Board` 组件中的一个函数，你将命名为 `handleClick`。要将 `onSquareClick` 连接到 `handleClick`，你需要将一个函数传递给第一个 `Square` 组件的 `onSquareClick` prop：

```js {7}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={handleClick} />
        //...
  );
}
```

最后，你将在 Board 组件内定义 `handleClick` 函数来更新保存你的棋盘 state 的 `squares` 数组：

```js {4-8}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick() {
    const nextSquares = squares.slice();
    nextSquares[0] = "X";
    setSquares(nextSquares);
  }

  return (
    // ...
  )
}
```

 `handleClick` 函数使用 JavaScript `slice()` Array 方法创建 `squares` 数组（`nextSquares` ）的副本。然后，`handleClick` 更新 `nextSquares` 数组以将 `X` 添加到第一个（`[0]` 索引）方块。

调用 `setSquares` 函数让 React 知道组件的 state 已经改变。这将触发使用 `squares` state（`Board`）的组件及其子组件（构成棋盘的 `Square` 组件）的重新渲染。

<Note>

JavaScript 支持闭包，这意味着内部函数（例如 `handleClick`）可以访问外部函数（例如 `Board`）中定义的变量和函数。`handleClick` 函数可以读取 `squares` state 并调用 `setSquares` 方法，因为它们都是在 `Board` 函数内部定义的。

</Note>

现在你可以将 X 添加到棋盘上……但只能添加到左上角的方块。你的 `handleClick` 函数被硬编码为更新左上角方块（ `0`）的索引。让我们更新 `handleClick` 以便能够更新任何正方形。将参数 `i` 添加到 `handleClick` 函数，该函数采用要更新的正方形索引：

```js {4,6}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice();
    nextSquares[i] = "X";
    setSquares(nextSquares);
  }

  return (
    // ...
  )
}
```

接下来，你需要将 `i` 传递给 `handleClick`。你可以尝试像这样在 JSX 中直接将 square 的 `onSquareClick` prop 设置为 `handleClick(0)`，但这是行不通的：

```jsx
<Square value={squares[0]} onSquareClick={handleClick(0)} />
```

这就是为什么这不起作用。`handleClick(0)` 调用将成为渲染板组件的一部分。因为 `handleClick(0)` 通过调用 `setSquares` 改变了棋盘组件的 state，所以你的整个棋盘组件将再次重新渲染。但这再次运行 `handleClick(0)`，导致无限循环：

<ConsoleBlock level="error">

Too many re-renders. React limits the number of renders to prevent an infinite loop.

</ConsoleBlock>

为什么这个问题没有早点发生？

当你传递 `onSquareClick={handleClick}` 时，你将 `handleClick` 函数作为道具向下传递。你不是在召唤它！但是现在你立即调用该函数——注意 `handleClick(0)` 中的括号——这就是它运行得太早的原因。你不想在用户点击之前调用 `handleClick` ！

你可以通过创建调用 `handleClick(0)` 的函数（如 `handleFirstSquareClick`）、调用 `handleClick(1)` 的函数（如 `handleSecondSquareClick`）等来修复。你可以将这些函数作为 `onSquareClick={handleFirstSquareClick}` 之类的道具传递（而不是调用）。这将解决无限循环。

但是，定义九个不同的函数并为每个函数命名太冗长了。相反，让我们这样做：

```js {6}
export default function Board() {
  // ...
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        // ...
  );
}
```

注意新的 `() =>` 语法。这里，`() => handleClick(0)` 是一个箭头函数，它是定义函数的一种较短的方式。单击正方形时，`=>`“箭头”之后的代码将运行，调用 `handleClick(0)`。

现在你需要更新其他八个方块以从你传递的箭头函数中调用 `handleClick`。确保 `handleClick` 的每次调用的参数对应于正确方块的索引：

```js {6-8,11-13,16-18}
export default function Board() {
  // ...
  return (
    <>
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
};
```

现在你可以再次通过单击将 X 添加到板上的任何方块：

![filling the board with X](../images/tutorial/tictac-adding-x-s.gif)

但是这次所有的 state 管理都由 `Board` 组件处理！

你的代码应该是这样的：

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

export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice();
    nextSquares[i] = 'X';
    setSquares(nextSquares);
  }

  return (
    <>
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

现在你的 state 处理在 `Board` 组件中，父 `Board` 组件将道具传递给子 `Square` 组件，以便它们可以正确显示。单击 `Square` 时，子 `Square` 组件现在要求父 `Board` 组件更新板的 state。当 `Board` 的 state 改变时，`Board` 组件和每个子 `Square` 都会自动重新渲染。保持 `Board` 组件中所有方块的 state 将允许它确定未来的赢家。

让我们回顾一下当用户单击你的看板左上角的方块以向其添加 `X` 时会发生什么：

1. 单击左上角的方块运行 `button` 从 `Square` 接收到的作为其 `onClick` prop 的函数。`Square` 组件从 `Board` 接收到该函数作为其 `onSquareClick` prop。`Board` 组件直接在 JSX 中定义了该函数。它使用参数 `0` 调用 `handleClick`。
1. `handleClick` 使用参数 ( `0` ) 将 `squares` 数组的第一个元素从 `null` 更新为 `X`。
1. `Board` 组件的 `squares` state 已更新，因此 `Board` 及其所有子组件都将重新渲染。这会导致索引为 `0` 的 `Square` 组件的 `value` prop 从 `null` 更改为 `X`。

最后，用户看到左上角的方块在单击后从空变为有一个 `X`。

<Note>

DOM `<button>` 元素的 `onClick` prop 对 React 有特殊意义，因为它是一个内置组件。对于像 Square 这样的自定义组件，命名由你决定。你可以给 `Square` 的 `onSquareClick` prop 或 `Board` 的 `handleClick` 函数起任何名字，代码会一样工作。在 React 中，通常使用 `onSomething` 命名代表事件的 props，使用 `handleSomething` 命名处理这些事件的函数定义。

</Note>

### 为什么不变性很重要 {/*why-immutability-is-important*/}

请注意在 `handleClick` 中，你如何调用 `.slice()` 来创建 `squares` 数组的副本而不是修改现有数组。为了解释原因，我们需要讨论不变性以及为什么学习不变性很重要。

通常有两种更改数据的方法。第一种方法是通过直接更改数据的值来改变数据。第二种方法是用具有所需更改的新副本替换数据。如果你改变 `squares` 数组，它会是这样的：

```jsx
const squares = [null, null, null, null, null, null, null, null, null];
squares[0] = 'X';
// Now `squares` is ["X", null, null, null, null, null, null, null, null];
```

如果你在不改变 `squares` 数组的情况下更改数据，它会是这样的：

```jsx
const squares = [null, null, null, null, null, null, null, null, null];
const nextSquares = ['X', null, null, null, null, null, null, null, null];
// Now `squares` is unchanged, but `nextSquares` first element is 'X' rather than `null`
```

结果是一样的，但通过不直接改变（改变底层数据），你可以获得几个好处。

不变性使复杂的功能更容易实现。在本教程的后面，你将实现一个“时间旅行”功能，让你回顾游戏的历史并“跳回”过去的动作。此功能并非特定于游戏——撤消和重做某些操作的能力是应用程序的常见要求。避免直接数据突变可以让你保持以前版本的数据完好无损，并在以后重用它们。

不变性还有另一个好处。默认情况下，当父组件的 state 发生变化时，所有子组件都会自动重新渲染。这甚至包括未受更改影响的子组件。尽管重新渲染本身不会引起用户注意（你不应该主动尝试避免它！），但出于性能原因，你可能希望跳过重新渲染显然不受其影响的树的一部分。不变性使得组件比较其数据是否已更改的成本非常低。你可以在 [`memo` API 参考](/reference/react/memo) 中了解更多关于 React 如何选择何时重新渲染组件的信息。

### 交替落子 {/*taking-turns*/}

现在是时候修复这个井字棋游戏的一个主要缺陷了：棋盘上无法标记“O”。

默认情况下，你会将第一步设置为“X”。让我们通过向 Board 组件添加另一个 state 来跟踪这一点：

```js {2}
function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  // ...
}
```

每次玩家移动时，`xIsNext`（一个布尔值）将被翻转以确定下一个玩家，游戏 state 将被保存。你将更新 `Board` 的 `handleClick` 函数以翻转 `xIsNext` 的值：

```js {7,8,9,10,11,13}
export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  return (
    //...
  );
}
```

现在，当你点击不同的方块时，它们会在 `X` 和 `O` 之间交替，这是它们应该做的！

但是等等，有一个问题。尝试多次点击同一个方块：

![O overwriting an X](../images/tutorial/o-replaces-x.gif)

 `X` 被 `O` 覆盖！虽然这会给游戏带来非常有趣的变化，但我们现在将坚持原来的规则。

当你用 `X` 或 `O` 标记方块时，你并不是首先检查该方块是否已经具有 `X` 或 `O` 值。你可以通过提早返回来解决此问题。你将检查方块是否已经有 `X` 或 `O`。如果方块已经填满，你将尽早在 `handleClick` 函数中 `return` — 在它尝试更新棋盘 state 之前。

```js {2,3,4}
function handleClick(i) {
  if (squares[i]) {
    return;
  }
  const nextSquares = squares.slice();
  //...
}
```

现在你只能将 `X` 或 `O` 添加到空方块中！此时你的代码应该如下所示：

<Sandpack>

```js App.js
import { useState } from 'react';

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    if (squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  return (
    <>
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

### 宣布获胜者 {/*declaring-a-winner*/}

现在你可以轮流对战了，接下来我们应该显示游戏何时获胜并且没有更多的轮次。为此，你将添加一个名为 `calculateWinner` 的辅助函数，它接受 9 个正方形的数组，检查获胜者并根据需要返回 `'X'` 、 `'O'` 或 `null`。不要太担心 `calculateWinner` 函数；它不是特定于 React 的：

```js App.js
export default function Board() {
  //...
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
    [2, 4, 6]
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

<Note>

在 `Board` 之前或之后定义 `calculateWinner` 并不重要。让我们把它放在最后，这样你就不必在每次编辑组件时都滚动过去。

</Note>

你将在 `Board` 组件的 `handleClick` 函数中调用 `calculateWinner(squares)` 来检查玩家是否获胜。你可以在检查用户是否单击了已经具有 `X` 或 `O` 的方块的同时执行此检查。在这两种情况下，我们都希望尽早返回：

```js {2}
function handleClick(i) {
  if (squares[i] || calculateWinner(squares)) {
    return;
  }
  const nextSquares = squares.slice();
  //...
}
```

为了让玩家知道游戏何时结束，你可以显示“获胜者：X”或“获胜者：O”等文字。为此，你需要将 `status` 部分添加到 `Board` 组件。如果游戏结束， state 将显示获胜者，如果游戏正在进行，你将显示下一个轮到哪个玩家：

```js {3-9,13}
export default function Board() {
  // ...
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <div>
      <div className="status">{status}</div>
      <div className="board-row">
        // ...
  )
}
```

恭喜！你现在有一个可以运行的井字棋游戏。你也刚刚学习了 React 的基础知识。所以你是这里真正的赢家。代码应该如下所示：

<Sandpack>

```js App.js
import { useState } from 'react';

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

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
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
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

## 添加时间旅行 {/*adding-time-travel*/}

作为最后的练习，让我们能够“回到过去”到游戏中之前的动作。

### 存储移动历史 {/*storing-a-history-of-moves*/}

如果你改变了 `squares` 数组，实现时间旅行将非常困难。

但是，你在每次移动后都使用 `slice()` 创建 `squares` 数组的新副本，并将其视为不可变的。这将允许你存储 `squares` 数组的每个过去版本，并在已经发生的轮次之间导航。

你将把过去的 `squares` 数组存储在另一个名为 `history` 的数组中，你将把它存储为一个新的 state 变量。`history` 数组表示所有棋盘 state，从第一步到最后一步，其形状如下：

```jsx
[
  // Before first move
  [null, null, null, null, null, null, null, null, null],
  // After first move
  [null, null, null, null, 'X', null, null, null, null],
  // After second move
  [null, null, null, null, 'X', null, null, null, 'O'],
  // ...
]
```

### 再次“状态提升” {/*lifting-state-up-again*/}

你现在将编写一个名为 `Game` 的新顶级组件来显示过去的移动列表。这就是你将放置包含整个游戏历史的 `history` state 的地方。

将 `history` state 放入 `Game` 组件将使你可以从其子 `Board` 组件中删除 `squares` state。就像你将 state 从 `Square` 组件“提升”到 `Board` 组件一样，你现在将把它从 `Board` 提升到顶层 `Game` 组件。这使 `Game` 组件可以完全控制 `Board` 的数据，并让它指示 `Board` 渲染来自 `history` 的先前回合。

首先，添加一个带有 `export default` 的 `Game` 组件。让它渲染 `Board` 组件和一些标记：

```js {1,5-16}
function Board() {
  // ...
}

export default function Game() {
  return (
    <div className="game">
      <div className="game-board">
        <Board />
      </div>
      <div className="game-info">
        <ol>{/*TODO*/}</ol>
      </div>
    </div>
  );
}
```

请注意，你要删除 `function Board() {` 声明之前的 `export default` 关键字，并将它们添加到 `function Game() {` 声明之前。这会告诉你的 `index.js` 文件使用 `Game` 组件而不是你的 `Board` 组件作为顶层组件。`Game` 组件返回的额外 `div` 正在为你稍后添加到棋盘的游戏信息腾出空间。

向 `Game` 组件添加一些 state 以跟踪下一个玩家和移动历史：

```js {2-3}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  // ...
```

请注意，`[Array(9).fill(null)]` 是一个包含单个项目的数组，它本身是一个包含 9 个 `null` 的数组。

要渲染当前移动的方块，你需要从 `history` 中读取最后一个方块数组。你不需要 `useState` ——你已经有足够的信息在渲染过程中计算它：

```js {4}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];
  // ...
```

接下来，在 `Game` 组件中创建一个 `handlePlay` 函数，`Board` 组件将调用该函数来更新游戏。将 `xIsNext` 、 `currentSquares` 和 `handlePlay` 作为 props 传递给 `Board` 组件：

```js {6-8,13}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    // TODO
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        //...
  )
}
```

Let's make the `Board` component fully controlled by the props it receives. Change the `Board` component to take three props: `xIsNext`, `squares`, and a new `onPlay` function that `Board` can call with the updated squares array when a player makes a move. Next, remove the first two lines of the `Board` function that call `useState`:

```js {1}
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    //...
  }
  // ...
}
```

现在，将 `Board` 组件中 `handleClick` 中的 `setSquares` 和 `setXIsNext` 调用替换为对新 `onPlay` 函数的一次调用，这样 `Game` 组件就可以在用户单击正方形时更新 `Board` :

```js {12}
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }
  //...
}
```

 `Board` 组件完全由 `Game` 组件传递给它的 props 控制。你需要在 `Game` 组件中实现 `handlePlay` 函数才能使游戏重新运行。

 `handlePlay` 被叫时应该做什么？请记住，Board 曾经使用更新后的数组调用 `setSquares` ；现在它将更新后的 `squares` 数组传递给 `onPlay`。

 `handlePlay` 函数需要更新 `Game` 的 state 以触发重新渲染，但是你没有可以再调用的 `setSquares` 函数——你现在正在使用 `history` state 变量来存储这些信息。你需要通过将更新后的 `squares` 数组作为新的历史条目附加来更新 `history`。你还想切换 `xIsNext`，就像 Board 过去所做的那样：

```js {4-5}
export default function Game() {
  //...
  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }
  //...
}
```

在这里，`[...history, nextSquares]` 创建了一个新数组，其中包含 `history` 中的所有项，后跟 `nextSquares`。（你可以将 `...history` 传播语法理解为“枚举 `history` 中的所有项目”。）

例如，如果 `history` 是 `[[null,null,null], ["X",null,null]]`，`nextSquares` 是 `["X",null,"O"]`，那么新的 `[...history, nextSquares]` 数组就是 `[[null,null,null], ["X",null,null], ["X",null,"O"]]`。

此时，你已将 state 移至 `Game` 组件中，并且 UI 应该完全正常工作，就像重构之前一样。这是此时代码的样子：

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
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{/*TODO*/}</ol>
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

### 显示过去的落步 {/*showing-the-past-moves*/}

由于你正在记录井字棋游戏的历史，因此你现在可以向玩家显示过去的动作列表。

像 `<button>` 这样的 React 元素是常规的 JavaScript 对象；你可以在你的应用程序中传递它们。要在 React 中渲染多个项目，你可以使用 React 元素数组。

你已经有一组 `history` state 移动，所以现在你需要将其转换为一组 React 元素。在 JavaScript 中，要将一个数组转换为另一个数组，可以使用 [数组的 `map` 方法](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)。

```jsx
[1, 2, 3].map((x) => x * 2) // [2, 4, 6]
```

你将使用 `map` 将你的 `history` 动作转换为代表屏幕上按钮的 React 元素，并显示一个按钮列表以“跳转”到过去的动作。让我们在 Game 组件中用 `map` 代替 `history`：

```js {11-13,15-27,35}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    // TODO
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li>
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
```

你可以在下面看到你的代码应该是什么样子。请注意，你应该会在开发人员工具控制台中看到一条错误消息：`Warning: Each child in an array or iterator should have a unique "key" prop. Check the render method of `Game`.` 你将在下一节中修复此错误。

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
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    // TODO
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li>
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

当你在传递给 `map` 的函数中遍历 `history` 数组时，`squares` 参数遍历 `history` 的每个元素，`move` 参数遍历每个数组索引：`0` 、@6 # , `2` , ….（在大多数情况下，你需要实际的数组元素，但要渲染移动列表，你只需要索引。）

对于井字棋游戏历史中的每一步，你创建一个列表项 `<li>`，其中包含一个按钮 `<button>`。该按钮有一个 `onClick` 处理程序，它调用一个名为 `jumpTo` 的函数（你尚未实现）。

现在，你应该会看到游戏中发生的动作列表和开发人员工具控制台中的错误。让我们讨论一下“关键”错误的含义。

### 选择 key {/*picking-a-key*/}

当你渲染一个列表时，React 会存储一些关于每个渲染列表项的信息。当你更新一个列表时，React 需要确定发生了什么变化。你可以添加、删除、重新排列或更新列表的项目。

想象一下从

```html
<li>Alexa: 7 tasks left</li>
<li>Ben: 5 tasks left</li>
```

到

```html
<li>Ben: 9 tasks left</li>
<li>Claudia: 8 tasks left</li>
<li>Alexa: 5 tasks left</li>
```

除了更新的计数之外，阅读本文的人可能会说你交换了 Alexa 和 Ben 的顺序，并在 Alexa 和 Ben 之间插入了 Claudia。然而，React 是一个计算机程序，无法知道你的意图，因此你需要为每个列表项指定一个关键属性，以将每个列表项与其兄弟项区分开来。如果你的数据来自数据库，Alexa、Ben 和 Claudia 的数据库 ID 可以用作 key：

```js {1}
<li key={user.id}>
  {user.name}: {user.taskCount} tasks left
</li>
```

重新渲染列表时，React 获取每个列表项的键并搜索前一个列表的项以查找匹配的键。如果当前列表有一个之前不存在的键，React 会创建一个组件。如果当前列表缺少前一个列表中存在的键，React 会销毁前一个组件。如果两个键匹配，则移动相应的组件。

Keys 告诉 React 每个组件的身份，这允许 React 在重新渲染之间保持 state。如果组件的键发生变化，组件将被销毁并以新 state 重新创建。

`key` 是 React 中一个特殊的保留属性。创建元素时，React 提取 `key` 属性并将键直接存储在返回的元素上。尽管 `key` 看起来像是作为 props 传递的，但 React 会自动使用 `key` 来决定要更新哪些组件。组件无法询问其父组件指定的 `key`。

**强烈建议你在构建动态列表时分配适当的键**。如果你没有合适的密钥，你可能需要考虑重组你的数据，以便你这样做。

如果没有指定key，React会报错，默认使用数组索引作为key。在尝试重新排序列表项或插入/删除列表项时，使用数组索引作为键是有问题的。显式传递 `key={i}` 可以消除错误，但与数组索引有相同的问题，在大多数情况下不推荐使用。

key 不需要是全局唯一的；它们只需要在组件及其同级组件之间是唯一的。

### 实现时间旅行 {/*implementing-time-travel*/}

在井字棋游戏的历史中，过去的每一步都有一个唯一的 ID 与之相关联：它是动作的序号。移动永远不会被重新排序、删除或插入中间，因此使用移动索引作为键是安全的。

在 `Game` 函数中，你可以将键添加为 `<li key={move}>`，如果你重新加载渲染的游戏，React 的“键”错误应该会消失：

```js {4}
const moves = history.map((squares, move) => {
  //...
  return (
    <li key={move}>
      <button onClick={() => jumpTo(move)}>{description}</button>
    </li>
  );
});
```

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
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    // TODO
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

在你可以实现 `jumpTo` 之前，你需要 `Game` 组件来跟踪用户当前正在查看的步骤。为此，定义一个名为 `currentMove` 的新 state 变量，默认为 `0`：

```js {4}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[history.length - 1];
  //...
}
```

接下来，更新 `Game` 中的 `jumpTo` 函数来更新那个 `currentMove`。如果你将 `currentMove` 更改为偶数，你还将设置 `xIsNext` 为 `true`。

```js {4-5}
export default function Game() {
  // ...
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);
  }
  //...
}
```

你现在将对 `Game` 的 `handlePlay` 函数进行两处更改，该函数在你单击正方形时调用。

- 如果你“回到过去”然后从那一点开始采取新的行动，你只想保持那一点的历史。不是在 `history` 中的所有项目（`...` 扩展语法）之后添加 `nextSquares`，而是在 `history.slice(0, currentMove + 1)` 中的所有项目之后添加它，这样你就只保留旧历史的那部分。
- 每次移动时，你都需要更新 `currentMove` 以指向最新的历史条目。

```js {2-4}
function handlePlay(nextSquares) {
  const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
  setHistory(nextHistory);
  setCurrentMove(nextHistory.length - 1);
  setXIsNext(!xIsNext);
}
```

最后，你将修改 `Game` 组件以渲染当前选定的着法，而不是始终渲染最后的着法：

```js {5}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  // ...
}
```

如果你点击游戏历史中的任何一步，井字棋盘应立即更新以显示该步骤发生后棋盘的样子。

<Sandpack>

```js App.js
import { useState } from 'react';

function Square({value, onSquareClick}) {
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
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);
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

### 最后清理 {/*final-cleanup*/}

如果仔细查看代码，你可能会注意到当 `currentMove` 为偶数时为 `xIsNext === true`，而当 `currentMove` 为奇数时为 `xIsNext === false`。换句话说，如果你知道 `currentMove` 的值，那么你总能算出 `xIsNext` 应该是什么。

你没有理由将这两者都存储在 state 中。事实上，总是尽量避免冗余 state。简化你在 state 中存储的内容可以减少错误并使你的代码更易于理解。更改 `Game` 使其不将 `xIsNext` 存储为单独的 state 变量，而是根据 `currentMove` 计算出来：

```js {4,11,15}
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
  // ...
}
```

你不再需要 `xIsNext` state 声明或对 `setXIsNext` 的调用。现在，`xIsNext` 不可能与 `currentMove` 不同步，即使你的代码写错了。

### 收尾 {/*wrapping-up*/}

祝贺！你已经创建了一个井字棋游戏，你实现了：

- 你现在可以玩的井字棋游戏
- 玩家在赢的时候有提示
- 随着游戏的进行存储游戏的历史
- 允许玩家回顾游戏的历史并查看棋盘的以前的版本

干得好！我们希望你现在觉得你对 React 的工作原理有了很好的了解。

在这里对照一下最终的结果吧：

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

如果你有额外的时间或想练习新的 React 技能，这里有一些你可以改进井字棋游戏的想法，按难度递增的顺序列出：

1. 仅针对当前着手，显示“You are at move #…”而不是按钮。
1. 重写 `Board` 以使用两个循环来制作正方形而不是对它们进行硬编码。
1. 添加一个切换按钮，使可以按升序或降序对移动的步数进行排序。
1. 当有人获胜时，突出显示致使获胜的三个方块（当没有人获胜时，显示一条关于结果为平局的消息）。
1. 在“移动”的历史列表中以 (row, col) 格式显示每步的位置。

在本教程中，你已经接触到了 React 概念，包括元素、组件、prop 和 state。现在你已经了解了这些概念在构建游戏时是如何工作的，请查看 [React 哲学](../learn/thinking-in-react) 以了解这些 React 概念在构建应用的 UI 时是如何工作的。
