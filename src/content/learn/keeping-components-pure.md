---
title: 保持组件纯粹
translators:
  - 7ooz
  - Hyuain
  - QC-L
---

<Intro>

部分 JavaScript 函数是 **纯粹** 的，这类函数通常被称为纯函数。纯函数仅执行计算操作，不做其他操作。你可以通过将组件按纯函数严格编写，以避免一些随着代码库的增长而出现的、令人困扰的 bug 以及不可预测的行为。但为了获得这些好处，你需要遵循一些规则。

</Intro>

<YouWillLearn>

* 纯函数是什么，以及它如何帮助你避免 bug
* 如何将数据变更与渲染过程分离，以保持组件的纯粹
* 如何使用严格模式发现组件中的错误

</YouWillLearn>

## 纯函数：组件作为公式 {/*purity-components-as-formulas*/}

在计算机科学中（尤其是函数式编程的世界中），[纯函数](https://wikipedia.org/wiki/Pure_function) 通常具有如下特征：

* **只负责自己的任务**。它不会更改在该函数调用前就已存在的对象或变量。
* **输入相同，则输出相同**。给定相同的输入，纯函数应总是返回相同的结果。

举个你非常熟悉的纯函数示例：数学中的公式。

考虑如下数学公式：<Math><MathI>y</MathI> = 2<MathI>x</MathI></Math>。

若 <Math><MathI>x</MathI> = 2</Math> 则 <Math><MathI>y</MathI> = 4</Math>。永远如此。

若 <Math><MathI>x</MathI> = 3</Math> 则 <Math><MathI>y</MathI> = 6</Math>。永远如此。

若 <Math><MathI>x</MathI> = 3</Math>，那么 <MathI>y</MathI> 并不会因为时间或股市的影响，而有时等于 <Math>9</Math> 、 <Math>–1</Math> 或 <Math>2.5</Math>。 

若 <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math> 且 <Math><MathI>x</MathI> = 3</Math>, 那么 <MathI>y</MathI> _永远_ 等于 <Math>6</Math>. 

我们使用 JavaScript 的函数实现，看起来将会是这样：

```js
function double(number) {
  return 2 * number;
}
```

上述例子中，`double()` 就是一个 **纯函数**。如果你传入 `3` ，它将总是返回 `6` 。

React 便围绕着这个概念进行设计。**React 假设你编写的所有组件都是纯函数**。也就是说，对于相同的输入，你所编写的 React 组件必须总是返回相同的 JSX。

<Sandpack>

```js App.js
function Recipe({ drinkers }) {
  return (
    <ol>    
      <li>Boil {drinkers} cups of water.</li>
      <li>Add {drinkers} spoons of tea and {0.5 * drinkers} spoons of spice.</li>
      <li>Add {0.5 * drinkers} cups of milk to boil and sugar to taste.</li>
    </ol>
  );
}

export default function App() {
  return (
    <section>
      <h1>Spiced Chai Recipe</h1>
      <h2>For two</h2>
      <Recipe drinkers={2} />
      <h2>For a gathering</h2>
      <Recipe drinkers={4} />
    </section>
  );
}
```

</Sandpack>

当你给函数 `Recipe` 传入 `drinkers={2}` 参数时，它将返回包含 `2 cups of water` 的 JSX。永远如此。

而当你传入 `drinkers={4}` 时，它将返回包含 `4 cups of water` 的 JSX。永远如此。

就像数学公式一样。

你可以把你的组件当作食谱：如果你遵循它们，并且在烹饪过程中不引入新食材，你每次都会得到相同的菜肴。那这道 “菜肴” 就是组件用于 React [渲染](/learn/render-and-commit) 的 JSX。

<Illustration src="/images/docs/illustrations/i_puritea-recipe.png" alt="A tea recipe for x people: take x cups of water, add x spoons of tea and 0.5x spoons of spices, and 0.5x cups of milk" />

## 副作用：（不符合）预期的后果 {/*side-effects-unintended-consequences*/}

React 的渲染过程必须自始至终是纯粹的。组件应该只 **返回** 它们的 JSX，而不 **改变** 在渲染前，就已存在的任何对象或变量 — 这将会使它们变得不纯粹！

以下是违反这一规则的组件示例：

<Sandpack>

```js
let guest = 0;

function Cup() {
  // Bad: changing a preexisting variable!
  guest = guest + 1;
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup />
      <Cup />
      <Cup />
    </>
  );
}
```

</Sandpack>

该组件正在读写其外部声明的 `guest` 变量。这意味着 **多次调用这个组件会产生不同的 JSX**！并且，如果 **其他** 组件读取 `guest` ，它们也会产生不同的 JSX，其结果取决于它们何时被渲染！这是无法预测的。

回到我们的公式 <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math> ，现在即使 <Math><MathI>x</MathI> = 2</Math> ，我们也不能相信 <Math><MathI>y</MathI> = 4</Math> 。我们的测试可能会失败，我们的用户可能会感到困扰，飞机可能会从天空坠毁——你将看到这会引发多么扑朔迷离的 bugs！

你可以 [将 `guest` 作为 prop 传入](/learn/passing-props-to-a-component) 来修复此组件：

<Sandpack>

```js
function Cup({ guest }) {
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup guest={1} />
      <Cup guest={2} />
      <Cup guest={3} />
    </>
  );
}
```

</Sandpack>

现在你的组件就是纯粹的，因为它返回的 JSX 只依赖于 `guest` prop。

一般来说，你不应该期望你的组件以任何特定的顺序被渲染。调用 <Math><MathI>y</MathI> = 5<MathI>x</MathI></Math> 和 <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math> 的先后顺序并不重要：这两个公式相互独立。同样地，每个组件也应该“独立思考”，而不是在渲染过程中试图与其他组件协调，或者依赖于其他组件。渲染过程就像是一场学校考试：每个组件都应该自己计算 JSX！

<DeepDive>

#### 使用严格模式检测不纯的计算 {/*detecting-impure-calculations-with-strict-mode*/}

尽管你可能还没使用过，但在 React 中，你可以在渲染时读取三种输入：[props](/learn/passing-props-to-a-component)，[state](/learn/state-a-components-memory) 和 [context](/learn/passing-data-deeply-with-context)。你应该始终将这些输入视为只读。

当你想根据用户输入 *更改* 某些内容时，你应该 [设置状态](/learn/state-a-components-memory)，而不是直接写入变量。当你的组件正在渲染时，你永远不应该改变预先存在的变量或对象。

React 提供了 “严格模式”，在严格模式下开发时，它将会调用每个组件函数两次。**通过重复调用组件函数，严格模式有助于找到违反这些规则的组件**。

我们注意到，原始示例显示的是 “Guest #2”、“Guest #4” 和 “Guest #6”，而不是 “Guest #1”、“Guest #2” 和 “Guest #3”。原来的函数并不纯粹，因此调用它两次就出现了问题。但对于修复后的纯函数版本，即使调用该函数两次也能得到正确结果。**纯函数仅仅执行计算，因此调用它们两次不会改变任何东西** — 就像两次调用 `double(2)` 并不会改变返回值，两次求解 <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math> 不会改变 <MathI>y</MathI> 的值一样。相同的输入，总是返回相同的输出。

严格模式在生产环境下不生效，因此它不会降低应用程序的速度。如需引入严格模式，你可以用 `<React.StrictMode>` 包裹根组件。一些框架会默认这样做。

</DeepDive>

### 局部 mutation：组件的小秘密 {/*local-mutation-your-components-little-secret*/}

上述示例的问题出在渲染过程中，组件改变了 **预先存在的** 变量的值。为了让它听起来更可怕一点，我们将这种现象称为 **突变（mutation）** 。纯函数不会改变函数作用域外的变量、或在函数调用前创建的对象——这会使函数变得不纯粹！

但是，**你完全可以在渲染时更改你 *刚刚* 创建的变量和对象**。在本示例中，你创建一个 `[]` 数组，将其分配给一个 `cups` 变量，然后 `push` 一打 cup 进去：

<Sandpack>

```js
function Cup({ guest }) {
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaGathering() {
  let cups = [];
  for (let i = 1; i <= 12; i++) {
    cups.push(<Cup key={i} guest={i} />);
  }
  return cups;
}
```

</Sandpack>

如果 `cups` 变量或 `[]` 数组是在 `TeaGathering` 函数之外创建的，这将是一个很大的问题！因为如果那样的话，当你调用数组的 push 方法时，就会更改 **预先存在的** 对象。

但是，这里不会有影响，因为每次渲染时，你都是在 `TeaGathering` 函数内部创建的它们。`TeaGathering` 之外的代码并不会知道发生了什么。这就被称为 **“局部 mutation”** — 如同藏在组件里的小秘密。

## 哪些地方 **可能** 引发副作用 {/*where-you-can-cause-side-effects*/}

函数式编程在很大程度上依赖于纯函数，但 **某些事物** 在特定情况下不得不发生改变。这是编程的要义！这些变动包括更新屏幕、启动动画、更改数据等，它们被称为 **副作用**。它们是 **“额外”** 发生的事情，与渲染过程无关。

在 React 中，**副作用通常属于 [事件处理程序](/learn/responding-to-events)**。事件处理程序是 React 在你执行某些操作（如单击按钮）时运行的函数。即使事件处理程序是在你的组件 **内部** 定义的，它们也不会在渲染期间运行！ **因此事件处理程序无需是纯函数**。

如果你用尽一切办法，仍无法为副作用找到合适的事件处理程序，你还可以调用组件中的 [`useEffect`](/reference/react/useEffect) 方法将其附加到返回的 JSX 中。这会告诉 React 在渲染结束后执行它。**然而，这种方法应该是你最后的手段**。

如果可能，请尝试仅通过渲染过程来表达你的逻辑。你会惊讶于这能带给你多少好处！

<DeepDive>

#### React 为何侧重于纯函数? {/*why-does-react-care-about-purity*/}

编写纯函数需要遵循一些习惯和规程。但它开启了绝妙的机遇：

* 你的组件可以在不同的环境下运行 — 例如，在服务器上！由于它们针对相同的输入，总是返回相同的结果，因此一个组件可以满足多个用户请求。
* 你可以为那些输入未更改的组件来 [跳过渲染](/reference/react/memo)，以提高性能。这是安全的做法，因为纯函数总是返回相同的结果，所以可以安全地缓存它们。
* 如果在渲染深层组件树的过程中，某些数据发生了变化，React 可以重新开始渲染，而不会浪费时间完成过时的渲染。纯粹性使得它随时可以安全地停止计算。

我们正在构建的每个 React 新特性都利用到了纯函数。从数据获取到动画再到性能，保持组件的纯粹可以充分释放 React 范式的能力。

</DeepDive>

<Recap>

* 一个组件必须是纯粹的，就意味着：
  * **只负责自己的任务。** 它不会更改在该函数调用前就已存在的对象或变量。
  * **输入相同，则输出相同。** 给定相同的输入，组件应该总是返回相同的 JSX。
* 渲染随时可能发生，因此组件不应依赖于彼此的渲染顺序。
* 你不应该改变组件用于渲染的任何输入。这包括 props、state 和 context。通过 [“设置” state](/learn/state-a-components-memory) 来更新界面，而不要改变预先存在的对象。
* 努力在你返回的 JSX 中表达你的组件逻辑。当你需要“改变事物”时，你通常希望在事件处理程序中进行。作为最后的手段，你可以使用 `useEffect`。
* 编写纯函数需要一些练习，但它充分释放了 React 范式的能力。

</Recap>


  
<Challenges>

#### 修复坏掉的时钟 {/*fix-a-broken-clock*/}

该组件尝试在午夜到早上 6 点期间，将 `<h1>` 的 CSS 类设置为 `"night"`，而在其他时间都设置为 `"day"`。但它不起作用。你能修复这个组件吗？

你可以临时更改计算机的时区来验证你的解决方案是否有效。当前时间位于午夜至早上六点之间时，时钟应该有相反的颜色！

<Hint>

渲染是一种 *计算过程* ，它不应该试图“做”其他事情。你能用其他方式表达这一思想吗？

</Hint>

<Sandpack>

```js Clock.js active
export default function Clock({ time }) {
  let hours = time.getHours();
  if (hours >= 0 && hours <= 6) {
    document.getElementById('time').className = 'night';
  } else {
    document.getElementById('time').className = 'day';
  }
  return (
    <h1 id="time">
      {time.toLocaleTimeString()}
    </h1>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  return (
    <Clock time={time} />
  );
}
```

```css
body > * {
  width: 100%;
  height: 100%;
}
.day {
  background: #fff;
  color: #222;
}
.night {
  background: #222;
  color: #fff;
}
```

</Sandpack>

<Solution>

你可以计算 `className`，并将其包含在渲染的输出中，以此实现对组件的修复：

<Sandpack>

```js Clock.js active
export default function Clock({ time }) {
  let hours = time.getHours();
  let className;
  if (hours >= 0 && hours <= 6) {
    className = 'night';
  } else {
    className = 'day';
  }
  return (
    <h1 className={className}>
      {time.toLocaleTimeString()}
    </h1>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  return (
    <Clock time={time} />
  );
}
```

```css
body > * {
  width: 100%;
  height: 100%;
}
.day {
  background: #fff;
  color: #222;
}
.night {
  background: #222;
  color: #fff;
}
```

</Sandpack>

在这个例子中，副作用（修改 DOM）完全没有必要。你只需要返回 JSX。

</Solution>

#### 修复损坏的资料 {/*fix-a-broken-profile*/}

两个 `Profile` 组件使用不同的数据并排呈现。在第一个资料中点击 “Collapse” 折叠，然后点击 “Expand” 展开它。你会看到两个资料现在显示的是同一个人。这是一个 bug。

找出产生 bug 的原因，并修复它。

<Hint>

问题代码出现在 `Profile.js` 中。一定要从上到下读完所有内容！

</Hint>

<Sandpack>

```js Profile.js
import Panel from './Panel.js';
import { getImageUrl } from './utils.js';

let currentPerson;

export default function Profile({ person }) {
  currentPerson = person;
  return (
    <Panel>
      <Header />
      <Avatar />
    </Panel>
  )
}

function Header() {
  return <h1>{currentPerson.name}</h1>;
}

function Avatar() {
  return (
    <img
      className="avatar"
      src={getImageUrl(currentPerson)}
      alt={currentPerson.name}
      width={50}
      height={50}
    />
  );
}
```

```js Panel.js hidden
import { useState } from 'react';

export default function Panel({ children }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="panel">
      <button onClick={() => setOpen(!open)}>
        {open ? 'Collapse' : 'Expand'}
      </button>
      {open && children}
    </section>
  );
}
```

```js App.js
import Profile from './Profile.js';

export default function App() {
  return (
    <>
      <Profile person={{
        imageId: 'lrWQx8l',
        name: 'Subrahmanyan Chandrasekhar',
      }} />
      <Profile person={{
        imageId: 'MK3eW3A',
        name: 'Creola Katherine Johnson',
      }} />
    </>
  )
}
```

```js utils.js hidden
export function getImageUrl(person, size = 's') {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; }
.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
  width: 200px;
}
h1 { margin: 5px; font-size: 18px; }
```

</Sandpack>

<Solution>

问题在于 `Profile` 组件写入了一个预先存在的 `currentPerson` 变量，而 `Header` 和 `Avatar` 组件读取了这个变量。这使得 **三个组件都** 变得不纯粹且难以预测。

要修复这个 bug，需要删除 `currentPerson` 变量。同时，通过 props 将所有信息从 `Profile` 传递到 `Header` 和 `Avatar` 中。你需要向两个组件各添加一个 `person` prop，并将其一直向下传递。

<Sandpack>

```js Profile.js active
import Panel from './Panel.js';
import { getImageUrl } from './utils.js';

export default function Profile({ person }) {
  return (
    <Panel>
      <Header person={person} />
      <Avatar person={person} />
    </Panel>
  )
}

function Header({ person }) {
  return <h1>{person.name}</h1>;
}

function Avatar({ person }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={50}
      height={50}
    />
  );
}
```

```js Panel.js hidden
import { useState } from 'react';

export default function Panel({ children }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="panel">
      <button onClick={() => setOpen(!open)}>
        {open ? 'Collapse' : 'Expand'}
      </button>
      {open && children}
    </section>
  );
}
```

```js App.js
import Profile from './Profile.js';

export default function App() {
  return (
    <>
      <Profile person={{
        imageId: 'lrWQx8l',
        name: 'Subrahmanyan Chandrasekhar',
      }} />
      <Profile person={{
        imageId: 'MK3eW3A',
        name: 'Creola Katherine Johnson',
      }} />
    </>
  );
}
```

```js utils.js hidden
export function getImageUrl(person, size = 's') {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; }
.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
  width: 200px;
}
h1 { margin: 5px; font-size: 18px; }
```

</Sandpack>

请记住，React 无法保证组件函数以任何特定的顺序执行，因此你无法通过设置变量在它们之间进行通信。所有的交流都必须通过 props 进行。

</Solution>

#### 修复损坏的故事集 {/*fix-a-broken-story-tray*/}

你所在公司的 CEO 要求你在在线时钟 app 中添加 “故事”，你不能拒绝。你编写了一个 `StoryTray` 组件，它接受一个 `stories` 列表，后跟一个 “Create Story” 占位符。

你在作为 props 的 `stories` 数组末尾 push 了一个假故事来实现 “Create Story” 占位符。但出于某种原因，“Create Story” 出现了不止一次。请修复这个问题。

<Sandpack>

```js StoryTray.js active
export default function StoryTray({ stories }) {
  stories.push({
    id: 'create',
    label: 'Create Story'
  });

  return (
    <ul>
      {stories.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState([...initialStories])
  let time = useTime();

  // HACK: Prevent the memory from growing forever while you read docs.
  // We're breaking our own rules here.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>It is {time.toLocaleTimeString()} now.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

</Sandpack>

<Solution>

请注意，每当时钟更新时，“Create Story” 都会被添加 **两次**。这暗示我们在渲染过程中发生了 mutation — 严格模式调用两次组件，可以使这些问题更加明显。

`StoryTray` 的功能不纯粹。通过在接收到的 `stories` 数组（一个 prop！）上调用 `push` 方法，它正改变着一个在 `StoryTray` 渲染 **之前** 创建的对象。这使得它有问题并且难以预测。

最简单的解决方案是完全不碰数组，单独渲染 “Create Story”：

<Sandpack>

```js StoryTray.js active
export default function StoryTray({ stories }) {
  return (
    <ul>
      {stories.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
      <li>Create Story</li>
    </ul>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState([...initialStories])
  let time = useTime();

  // HACK: Prevent the memory from growing forever while you read docs.
  // We're breaking our own rules here.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>It is {time.toLocaleTimeString()} now.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

或者，你可以在 push 之前创建一个 **新** 数组（通过复制现有数组）：

<Sandpack>

```js StoryTray.js active
export default function StoryTray({ stories }) {
  // Copy the array!
  let storiesToDisplay = stories.slice();

  // Does not affect the original array:
  storiesToDisplay.push({
    id: 'create',
    label: 'Create Story'
  });

  return (
    <ul>
      {storiesToDisplay.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState([...initialStories])
  let time = useTime();

  // HACK: Prevent the memory from growing forever while you read docs.
  // We're breaking our own rules here.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>It is {time.toLocaleTimeString()} now.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

这使你的 mutation 保持在局部，并使你的渲染函数保持纯粹。但你仍然需要小心：例如，当你想要更改数组的任意项时，必须先对其进行拷贝。

记住数组上的哪些操作会修改原始数组、哪些不会，这非常有帮助。例如，`push`、`pop`、`reverse` 和 `sort` 会改变原始数组，但 `slice`、`filter` 和 `map` 则会创建一个新数组。

</Solution>

</Challenges>
