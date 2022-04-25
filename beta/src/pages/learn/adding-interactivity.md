---
title: 增加互动性
---

<Intro>

屏幕上的一些东西会根据用户的输入而更新。例如，点击图片库可以切换活动图片。在 React 中，随时间变化的数据被称为状态。你可以向任何组件添加状态，并根据需要更新它。在本章中，你将学习如何编写处理交互的组件，更新它们的状态，并随时间显示不同的输出。

</Intro>

<YouWillLearn isChapter={true}>

* [如何处理用户发起的事件](/learn/responding-to-events)
* [如何使组件"记住"有状态的信息](/learn/state-a-components-memory)
* [React 如何分两个阶段更新 UI](/learn/render-and-commit)
* [为什么状态在你改变后没有立即更新](/learn/state-as-a-snapshot)
* [如何排队进行多个状态更新](/learn/queueing-a-series-of-state-updates)
* [如何在状态中更新一个对象](/learn/updating-objects-in-state)
* [如何在状态下更新一个数组](/learn/updating-arrays-in-state)

</YouWillLearn>

## 对事件作出回应 {/*responding-to-events*/}

React 让你在你的 JSX 中添加事件处理程序。事件处理程序是你自己的函数，它将在用户互动时被触发，如点击、悬停、关注表单输入等等。

像 `<button>` 这样的内置组件只支持像 `onClick` 这样的内置浏览器事件。然而，你也可以创建你自己的组件，并给它们的事件处理 props 起任何你喜欢的特定应用名称。

<Sandpack>

```js
export default function App() {
  return (
    <Toolbar
      onPlayMovie={() => alert('播放!')}
      onUploadImage={() => alert('上传!')}
    />
  );
}

function Toolbar({ onPlayMovie, onUploadImage }) {
  return (
    <div>
      <Button onClick={onPlayMovie}>
        播放电影
      </Button>
      <Button onClick={onUploadImage}>
        上传图片
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

阅读 **[响应事件](/learn/responding-to-events)**，学习如何添加事件处理程序。

</LearnMore>

## 状态：一个组件的记忆 {/*state-a-components-memory*/}

组件经常需要改变屏幕上的内容作为互动的结果。在表单中打字应该更新输入字段，在图片转盘上点击“下一个”应该改变显示的图片，点击“购买”将产品放入购物车。组件需要“记住”一些东西：当前的输入值、当前的图片、购物车。在 React 中，这种针对组件的记忆被称为状态。

你可以用 [`useState`](/apis/usestate) Hook 给组件添加状态。Hooks 是让你的组件使用 React 特性的特殊函数（状态是其中一个特性）。`useState` Hook 让你声明一个状态变量。它接收初始状态，并返回一对值：当前状态，以及一个让你更新状态的状态设置函数。

```js
const [index, setIndex] = useState(0);
const [showMore, setShowMore] = useState(false);
```

下面是一个图片库如何在点击时使用和更新状态：

<Sandpack>

```js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  function handleNextClick() {
    setIndex(index + 1);
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleNextClick}>
        下一页
      </button>
      <h2>
        <i>{sculpture.name} </i>
        由 {sculpture.artist}
      </h2>
      <h3>
        ({index + 1} of {sculptureList.length})
      </h3>
      <button onClick={handleMoreClick}>
        {showMore ? 'Hide' : 'Show'} 细节
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

```js data.js
export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: '虽然 Colvin 主要以暗示前西班牙符号的抽象主题而闻名，但这个巨大的雕塑，对神经外科的致敬，是她最容易识别的公共艺术作品之一。',
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: '一座青铜雕像，两只交叉的手在指尖微妙地夹着一个人脑。'
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: '这种巨大的（75 英尺或 23 米）银花位于 Buenos Aires。它被设计成可以移动，在傍晚或强风吹拂时关闭花瓣，在早晨打开花瓣。',
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: '一个巨大的金属花雕塑，具有反射镜面的花瓣和巨大的花蕊。'
}, {
  name: '永恒的存在',
  artist: 'John Woodrow Wilson',
  description: 'Wilson 因其对平等、社会正义以及人类的本质和精神品质的关注而闻名。这个巨大的（7 英尺或 2.13 米）铜像代表了他所描述的“象征性的黑人存在，注入了一种普遍的人性”。',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: '描绘人头的雕塑似乎永远存在，而且很庄重。它散发着平静和安详的气息。'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: '位于复活节岛上，有 1000 座摩艾（moai），即现存的纪念性雕像，由早期的 Rapa Nui 人创造，有人认为它们代表着被神化的祖先。',
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: '三座不朽的半身雕像，头部大得不成比例，脸色阴沉。'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'Nanas 是胜利的生物，象征着女性和母性。最初，Saint Phalle 使用织物和现成的物品来制作“Nanas”，后来又引入了聚酯，以达到更加鲜艳的效果。',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: '一个大型的马赛克雕塑，一个奇特的跳舞的女性形象，穿着五颜六色的服装，散发着快乐的气息。'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: '这个抽象的青铜雕塑是位于 Yorkshire 雕塑公园的《人类大家庭》系列的一部分。Hepworth 选择不创作世界的字面表述，而是开发出受人和风景启发的抽象形式。',
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: '一个由三个元素叠加而成的高大雕塑，让人联想到一个人形。'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Fakeye 是四代木雕师的后代，他的作品融合了传统和当代 Yoruba 主题。",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: '一个错综复杂的木雕，一个骑在马背上表情专注的战士，上面装饰着图案。'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow 因其将支离破碎的身体作为雕塑作品而闻名，以此来比喻青春和美丽的脆弱和无常。这件雕塑描绘了两个非常逼真的大肚子，它们相互堆叠在一起，每个都有 5 英尺（1.5 米）高。",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: '这座雕塑让人联想到层层叠叠的褶皱，与古典雕塑中的腹部截然不同。'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: '秦始皇兵马俑是一组描绘中国第一个皇帝秦始皇的军队的兵马俑雕塑。这支军队包括 8000 多名士兵，130 辆战车，520 匹马，以及 150 匹骑兵马。',
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: '12 个庄严的战士陶器雕塑，每个都有独特的面部表情和盔甲。'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson 以从纽约市的废墟中搜刮物品而闻名，后来她将这些物品组装成不朽的建筑。在这幅作品中，她使用了一些不相干的部件，如床柱、杂耍针和座椅碎片，将它们钉在一起并粘在盒子里，反映了立体主义对空间和形式的几何抽象的影响。',
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: '一件黑色亚光雕塑，其中的各个元素最初是无法区分的。'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar 融合了传统和现代，自然和工业。她的艺术集中在人与自然的关系上。她的作品被描述为抽象和具象的引人注目，无视重力，是“不可能的材料的精细综合”。',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: '一个苍白的钢丝状雕塑安装在混凝土墙上，并在地板上下降。它看起来很轻。'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: '台北动物园委托建造了一个河马广场，其特点是在水中嬉戏的河马。',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: '一组青铜河马雕塑从沉淀的人行道上冒出来，仿佛在游泳。'
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

阅读 **[状态：一个组件的记忆](/learn/state-a-components-memory)**，学习如何记住一个值并在交互时更新它。

</LearnMore>

## 渲染和提交 {/*render-and-commit*/}

在你的组件显示在屏幕上之前，它们必须由 React 进行渲染。了解这个过程中的步骤将有助于你思考你的代码如何执行并解释其行为。

想象一下，你的组件是厨房里的厨师，用原料组装出美味的菜肴。在这个场景中，React 是服务员，负责提出顾客的请求，并为他们带来订单。这个请求和服务 UI 的过程有三个步骤：

1. **触发**渲染（将食客的订单送到厨房）。
2. **渲染**组件（从厨房获得订单）。
3. **提交**到 DOM（将订单放在桌子上）。

<IllustrationBlock sequential>
  <Illustration caption="触发" alt="React 就像餐厅里的服务器，从用户那里获取订单，并将它们送到组件厨房。" src="/images/docs/illustrations/i_render-and-commit1.png" />
  <Illustration caption="渲染" alt="Card Chef 给了 React 一个新鲜的 Card 组件。" src="/images/docs/illustrations/i_render-and-commit2.png" />
  <Illustration caption="提交" alt="React 将卡片送到用户的桌子上。" src="/images/docs/illustrations/i_render-and-commit3.png" />
</IllustrationBlock>

<LearnMore path="/learn/render-and-commit">

阅读 **[渲染和提交](/learn/render-and-commit)** 以了解 UI 更新的生命周期。

</LearnMore>

## 状态是一个快照 {/*state-as-a-snapshot*/}

与普通的 JavaScript 变量不同，React 状态的行为更像一个快照。设置它并不改变你已经拥有的状态变量，而是触发一次重新渲染。这在一开始可能会让人吃惊！

```js
console.log(count);  // 0
setCount(count + 1); // 请求重新渲染，加 1
console.log(count);  // 还是 0!
```

React 这样工作是为了帮助你避免微妙的 bug。这里有一个小的聊天应用程序。试着猜一猜，如果你先按下“发送”，*然后*把收件人改为 Bob，会发生什么？五秒钟后，谁的名字会出现在“弹窗”中？

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [to, setTo] = useState('Alice');
  const [message, setMessage] = useState('你好');

  function handleSubmit(e) {
    e.preventDefault();
    setTimeout(() => {
      alert(`你对 ${to} 说 ${message}`);
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
        placeholder="消息"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">发送</button>
    </form>
  );
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>


<LearnMore path="/learn/state-as-a-snapshot">

阅读 **[状态是一个快照](/learn/state-as-a-snapshot)**，了解为什么状态在事件处理程序中显得“固定”和不变。

</LearnMore>

## 排队等候一系列的状态变化 {/*queueing-a-series-of-state-changes*/}

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
      <h1>分数：{score}</h1>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
```

</Sandpack>

[状态是一个快照](/learn/state-as-a-snapshot) 解释了为什么会发生这种情况。设置状态要求重新渲染，但在已经运行的代码中并没有改变。所以 `score` 在你调用 `setScore(score + 1)` 后仍然是 `0`。

```js
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
```

你可以通过在设置状态时传递一个*更新函数*来解决这个问题。注意将 `setScore(score + 1)` 替换为 `setScore(s => s + 1)` 可以修复“+3”按钮。如果你需要排队进行多个状态更新，这就很方便了。

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
      <h1>分数：{score}</h1>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
```

</Sandpack>

<LearnMore path="/learn/queueing-a-series-of-state-changes">

阅读 **[排队等候一系列的状态变化](/learn/queueing-a-series-of-state-changes)**，了解如何在下一次渲染前排队进行多次更新。

</LearnMore>

## 更新状态中的对象 {/*updating-objects-in-state*/}

状态可以保存任何种类的 JavaScript 值，包括对象。但你不应该直接改变你在 React 状态中持有的对象和数组。相反，当你想更新一个对象和数组时，你需要创建一个新的对象（或复制一个现有的对象），然后更新状态以使用该副本。

通常情况下，你会使用 `...` 传播语法来复制你想改变的对象和数组。例如，更新一个嵌套对象可以是这样的：

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
        命名：
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        标题：
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        城市：
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        图片：
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' 由 '}
        {person.name}
        <br />
        (位于 {person.artwork.city})
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

如果在代码中复制对象过于繁琐，你可以使用像 [Immer](https://github.com/immerjs/use-immer) 这样的库来减少重复的代码：

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
        命名：
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        标题：
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        城市：
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        图片：
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' 由 '}
        {person.name}
        <br />
        (位于 {person.artwork.city})
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

阅读 **[更新状态中的对象](/learn/updating-objects-in-state)**，学习如何正确更新对象。

</LearnMore>

## 更新状态中的数组 {/*updating-arrays-in-state*/}

数组是另一种类型的可变的 JavaScript 对象，你可以存储在状态中，并应将其视为只读。就像对象一样，当你想更新存储在状态中的数组时，你需要创建一个新的数组（或者复制一个现有的数组），然后设置状态以使用新的数组：

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
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
      <h1>艺术愿望清单</h1>
      <h2>我要看的艺术清单：</h2>
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

如果在代码中复制数组过于繁琐，你可以使用 [Immer](https://github.com/immerjs/use-immer) 这样的库来减少重复的代码：

<Sandpack>

```js
import { useState } from 'react';
import { useImmer } from 'use-immer';

let nextId = 3;
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
      <h1>艺术愿望清单</h1>
      <h2>我要看的艺术清单：</h2>
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

阅读 **[更新状态中的数组](/learn/updating-arrays-in-state)**，学习如何正确更新数组。

</LearnMore>

## 下一步是什么？ {/*whats-next*/}

前往 [应对事件](/learn/responding-to-events)，开始逐页阅读本章!

或者，如果你已经熟悉了这些主题，为什么不读一下 [管理状态](/learn/managing-state)？
