---
title: 添加交互
---

<Intro>

界面上的控件会根据用户的输入而更新。例如，点击按钮切换轮播图的展示。在 React 中，随时间变化的数据被称为状态（state）。你可以向任何组件添加状态，并按需进行更新。在本章节中，你将学习如何编写处理交互的组件，更新它们的状态，并根据时间变化显示不同的效果。

</Intro>

<YouWillLearn isChapter={true}>

* [如何处理用户发起的事件](/learn/responding-to-events)
* [如何用状态使组件“记住”信息](/learn/state-a-components-memory)
* [React 是如何分两个阶段更新 UI 的](/learn/render-and-commit)
* [为什么状态在你改变后没有立即更新](/learn/state-as-a-snapshot)
* [如何排队进行多个状态的更新](/learn/queueing-a-series-of-state-updates)
* [如何更新状态中的对象](/learn/updating-objects-in-state)
* [如何更新状态中的数组](/learn/updating-arrays-in-state)

</YouWillLearn>

## 响应事件 {/*responding-to-events*/}

React 允许你向 JSX 中添加事件处理程序。事件处理程序是你自己的函数，它将在用户交互时被触发，如点击、悬停、焦点在表单输入框上等等。

`<button>` 等内置组件只支持内置浏览器事件，如 `onClick`。但是，你也可以创建你自己的组件，并给它们的事件处理程序 props 指定你喜欢的任何特定于应用的名称。

<Sandpack>

```js
export default function App() {
  return (
    <Toolbar
      onPlayMovie={() => alert('Playing!')}
      onUploadImage={() => alert('Uploading!')}
    />
  );
}

function Toolbar({ onPlayMovie, onUploadImage }) {
  return (
    <div>
      <Button onClick={onPlayMovie}>
        Play Movie
      </Button>
      <Button onClick={onUploadImage}>
        Upload Image
      </Button>
    </div>
  );
}

function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

<LearnMore path="/learn/responding-to-events">

阅读 **[响应事件](/learn/responding-to-events)** 了解如何添加事件处理程序。

</LearnMore>

## State: 组件的记忆 {/*state-a-components-memory*/}

组件通常需要根据交互改变屏幕上的内容。在表单中键入更新输入栏，在轮播图上点击“下一个”改变显示的图片，点击“购买”将产品放入购物车。组件需要“记住”一些东西：当前的输入值、当前的图片、购物车。在 React 中，这种特定于组件的记忆被称为状态。

你可以用 [`useState`](/reference/react/useState) Hook 为组件添加状态。*Hook* 是能让你的组件使用 React 功能的特殊函数（状态是这些功能之一）。`useState` Hook 让你声明一个状态变量。它接收初始状态并返回一对值：当前状态，以及一个让你更新状态的设置函数。

```js
const [index, setIndex] = useState(0);
const [showMore, setShowMore] = useState(false);
```

下面是一个图库，演示如何使用并在点击时更新状态：

<Sandpack>

```js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const hasNext = index < sculptureList.length - 1;

  function handleNextClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleNextClick}>
        Next
      </button>
      <h2>
        <i>{sculpture.name} </i>
        by {sculpture.artist}
      </h2>
      <h3>
        ({index + 1} of {sculptureList.length})
      </h3>
      <button onClick={handleMoreClick}>
        {showMore ? 'Hide' : 'Show'} details
      </button>
      {showMore && <p>{sculpture.description}</p>}
      <img
        src={sculpture.url}
        alt={sculpture.alt}
      />
    </>
  );
}
```

```js src/data.js
export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: '尽管 Colvin 以暗示前西班牙符号的抽象主题而闻名，但这座巨大的雕塑是对神经外科的致敬，是她最知名的公共艺术作品之一。',
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: '一尊双手交叉的青铜雕像，它的手指优雅地握住一个人类的大脑。'
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: '这朵巨大的银花（75 英尺或 23 米）位于布宜诺斯艾利斯。它并非静止的艺术，它能在晚上或强风吹拂时关闭花瓣，在早晨打开它们。',
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: '一个巨大的金属花卉雕塑，具有棱镜状的花瓣和坚固的雄蕊。'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: '威尔逊以专注于平等、社会正义以及人类的基本和精神品质而闻名。这个巨大的（7 英尺或 2.13 米）青铜代表了他所描述的“一种象征性的黑人存在，注入了“普遍的人性意识”。',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: '描绘人的头部的雕塑似乎从古至今都是庄严肃穆的。它们散发着平静和宁静。'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: '在复活节岛上，有 1000 个石像，或现存的纪念碑雕像，由早期的拉帕努伊人创造，一些人认为代表神化的祖先。',
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: 'Three monumental stone busts with the heads that are disproportionately large with somber faces.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'Nana 是一群自信奔放的人，也是女性气质和母性的象征。最初，Saint Phalle 使用布料和废弃物品来创作 Nana，后来又引入合成树脂以实现更具活力的效果。',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: '这是一件大型马赛克雕塑，展现了一个穿着绚丽服装、欢快舞蹈的女性形象，充满了喜悦和活力。'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: '这座抽象的青铜雕塑是位于约克郡雕塑公园的《人类家族》系列的一部分。Hepworth 选择的不是创造世界的文字表现，而是受到人和景观的启发而发展出抽象的形式。',
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: 'A tall sculpture made of three elements stacked on each other reminding of a human figure.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "法基是四代木雕家的后代，他的作品融合了传统和当代约鲁巴主题。",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: '一个复杂的木制战士雕塑，马背上有一张严肃的脸，脸上装饰着图案。'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow 以她的肢体破损的雕塑而闻名，这些雕塑隐喻了年轻和美丽的脆弱和短暂。这座雕塑描绘了两个非常逼真的大肚皮，彼此叠放在一起，每个大约5英尺（1.5米）高。",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: '这座雕塑让人联想到层叠的褶皱，与古典雕塑中的腹部截然不同。'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: '兵马俑是一组陶俑雕塑，描绘了中国第一个皇帝秦始皇的军队。军队由8000多名士兵、130辆战车、520匹马和150匹骑兵组成。',
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: '12 个庄严的武士兵马俑，每个都有独特的面部表情和盔甲。'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson 以从纽约市的废墟中捡拾物体而闻名，后来她将这些碎片组装成纪念性建筑。在这幅画中，她使用了不同的部分，如床柱、杂耍的大头针和座椅碎片，将它们钉在盒子里并粘在一起，反映了立体主义对空间和形式的几何抽象的影响。',
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: '一种黑色哑光雕塑，其中单个元素最初无法区分。'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar 融合了传统与现代、自然与工业。她的艺术关注人与自然的关系。她的工作被描述为在抽象和比喻上都引人注目，挑战重力，以及“不太可能的材料的精细合成”。"',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: '一个苍白的线状雕塑安装在混凝土墙上，并下降到地板上。它看起来很轻。'
}, {
  name: 'Hippos',
  artist: '台北动物园',
  description: '台北动物园委托建造了河马广场，以水下河马为特色。',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: '一组青铜河马雕塑从露台的人行道上出现，好像他们在游泳。'
}];
```

```css
h2 { margin-top: 10px; margin-bottom: 0; }
h3 {
 margin-top: 5px;
 font-weight: normal;
 font-size: 100%;
}
img { width: 120px; height: 120px; }
button {
  display: block;
  margin-top: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<LearnMore path="/learn/state-a-components-memory">

阅读 **[State: 组件的记忆](/learn/state-a-components-memory)** 了解如何记住一个值并在交互时更新它。

</LearnMore>

## 渲染和提交 {/*render-and-commit*/}

在你的组件显示在屏幕上之前，它们必须由 React 进行渲染。理解这个过程中的步骤有助于你思考你的代码如何执行并解释其行为。

想象一下，你的组件是厨房里的厨师，用食材制作出美味的菜肴。在这个场景中，React 是服务员，负责提出顾客的要求，并给顾客上菜。这个请求和服务 UI 的过程有三个步骤：

1. **触发**渲染（将食客的订单送到厨房）
2. **渲染**组件（在厨房准备订单）
3. **提交**到 DOM（将订单送到桌前）

<IllustrationBlock sequential>
  <Illustration caption="Trigger" alt="React 就像一个餐厅的服务员，从用户那里获取订单，并将它们送到组件厨房。" src="/images/docs/illustrations/i_render-and-commit1.png" />
  <Illustration caption="Render" alt="Card 厨师给 React 提供了一个新鲜的 Card 组件。" src="/images/docs/illustrations/i_render-and-commit2.png" />
  <Illustration caption="Commit" alt="React 将 Card 送到用户桌前。" src="/images/docs/illustrations/i_render-and-commit3.png" />
</IllustrationBlock>

<LearnMore path="/learn/render-and-commit">

阅读 **[渲染和提交](/learn/render-and-commit)** 了解 UI 更新的生命周期。

</LearnMore>

## state 如同一张快照 {/*state-as-a-snapshot*/}

与普通 JavaScript 变量不同，React 状态的行为更像一个快照。设置它并不改变你已有的状态变量，而是触发一次重新渲染。这在一开始可能会让人感到惊讶！

```js
console.log(count);  // 0
setCount(count + 1); // 请求用 1 重新渲染
console.log(count);  // 仍然是 0！
```

React 这样工作是为了帮助你避免微妙的 bug。这里有一个小的聊天应用程序。试着猜一猜，如果先按下“发送”，然后再把收件人改为 Bob，会发生什么？五秒钟后，谁的名字会出现在 `alert` 中？

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


<LearnMore path="/learn/state-as-a-snapshot">

阅读 **[state 如同一张快照](/learn/state-as-a-snapshot)** 了解为什么状态在事件处理程序中是“固定的”和不变的。

</LearnMore>

## 把一系列 state 更新加入队列 {/*queueing-a-series-of-state-updates*/}

这个组件有问题：点击“+3”只能增加一次分数。

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [score, setScore] = useState(0);

  function increment() {
    setScore(score + 1);
  }

  return (
    <>
      <button onClick={() => increment()}>+1</button>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <h1>Score: {score}</h1>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
```

</Sandpack>

[state 如同一张快照](/learn/state-as-a-snapshot) 解释了为什么会出现这种情况。设置状态会请求一个新的重新渲染，但不会在已运行的代码中更改它。所以在你调用 `setScore(score + 1)` 后，`score` 仍然是 `0`。

```js
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
```

你可以通过在设置状态时传递一个 *更新器函数* 来解决这个问题。注意用 `setScore(s => s + 1)` 替换 `setScore(score + 1)` 是如何修复“+3”按钮的。如果你需要排队进行多次状态更新，那么这非常方便。

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [score, setScore] = useState(0);

  function increment() {
    setScore(s => s + 1);
  }

  return (
    <>
      <button onClick={() => increment()}>+1</button>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <h1>Score: {score}</h1>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
```

</Sandpack>

<LearnMore path="/learn/queueing-a-series-of-state-updates">

阅读 **[把一系列 state 更新加入队列](/learn/queueing-a-series-of-state-updates)** 了解如何在下一次渲染前排队多个更新。

</LearnMore>

## 更新 state 中的对象 {/*updating-objects-in-state*/}

状态可以持有任何类型的 JavaScript 值，包括对象。但你不应该直接改变你在 React 状态中持有的对象和数组。相反，当你想更新一个对象和数组时，你需要创建一个新的对象（或复制现有的对象），然后用这个副本来更新状态。

通常情况下，你会使用 `...` 展开语法来复制你想改变的对象和数组。例如，更新一个嵌套对象可以是这样的：

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    setPerson({
      ...person,
      name: e.target.value
    });
  }

  function handleTitleChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        title: e.target.value
      }
    });
  }

  function handleCityChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        city: e.target.value
      }
    });
  }

  function handleImageChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        image: e.target.value
      }
    });
  }

  return (
    <>
      <label>
        Name:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Title:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        City:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Image:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' by '}
        {person.name}
        <br />
        (located in {person.artwork.city})
      </p>
      <img
        src={person.artwork.image}
        alt={person.artwork.title}
      />
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

如果在代码中复制对象感觉乏味，可以使用 [Immer](https://github.com/immerjs/use-immer) 之类的库来减少重复代码：

<Sandpack>

```js
import { useImmer } from 'use-immer';

export default function Form() {
  const [person, updatePerson] = useImmer({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    updatePerson(draft => {
      draft.name = e.target.value;
    });
  }

  function handleTitleChange(e) {
    updatePerson(draft => {
      draft.artwork.title = e.target.value;
    });
  }

  function handleCityChange(e) {
    updatePerson(draft => {
      draft.artwork.city = e.target.value;
    });
  }

  function handleImageChange(e) {
    updatePerson(draft => {
      draft.artwork.image = e.target.value;
    });
  }

  return (
    <>
      <label>
        Name:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Title:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        City:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Image:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' by '}
        {person.name}
        <br />
        (located in {person.artwork.city})
      </p>
      <img
        src={person.artwork.image}
        alt={person.artwork.title}
      />
    </>
  );
}
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

<LearnMore path="/learn/updating-objects-in-state">

阅读 **[更新 state 中的对象](/learn/updating-objects-in-state)** 了解如何正确地更新对象。

</LearnMore>

## 更新 state 中的数组 {/*updating-arrays-in-state*/}

数组是另一种可以存在状态中的可变 JavaScript 对象，应将其视为只读。就像对象一样，当你想更新存在状态中的数组时，你需要创建一个新数组（或者复制现有数组），然后用新数组来更新状态。

<Sandpack>

```js
import { useState } from 'react';

const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [list, setList] = useState(
    initialList
  );

  function handleToggle(artworkId, nextSeen) {
    setList(list.map(artwork => {
      if (artwork.id === artworkId) {
        return { ...artwork, seen: nextSeen };
      } else {
        return artwork;
      }
    }));
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={list}
        onToggle={handleToggle} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

</Sandpack>

如果在代码中复制数组感觉乏味，可以使用 [Immer](https://github.com/immerjs/use-immer) 之类的库来减少重复代码：

<Sandpack>

```js
import { useState } from 'react';
import { useImmer } from 'use-immer';

const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [list, updateList] = useImmer(initialList);

  function handleToggle(artworkId, nextSeen) {
    updateList(draft => {
      const artwork = draft.find(a =>
        a.id === artworkId
      );
      artwork.seen = nextSeen;
    });
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={list}
        onToggle={handleToggle} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

<LearnMore path="/learn/updating-arrays-in-state">

阅读 **[更新 state 中的数组](/learn/updating-arrays-in-state)** 了解如何正确地更新数组。

</LearnMore>

## 下节预告 {/*whats-next*/}

前往 [响应事件](/learn/responding-to-events) 开始逐页阅读本章！

或者，如果你已经熟悉这些主题，不妨看看 [状态管理](/learn/managing-state)
