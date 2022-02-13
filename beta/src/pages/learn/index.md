---
title: 开始
translator:
 - x-cold
 - sooia
 - KnowsCount
---

<Intro>

欢迎阅读 React 文档！本文档是你在本站点能找到的信息的概览。

</Intro>

<YouWillLearn>

* [如何安装 React](/learn/installation)
* [如何用 React 的思考方式构建用户界面](/learn/thinking-in-react)
* [如何在屏幕上渲染内容](/learn/describing-the-ui)
* [如何让你的用户界面响应交互](/learn/adding-interactivity)
* [随着应用的增长，如何保持逻辑的可维护性](/learn/managing-state)
* [必要时如何退出 React](/learn/escape-hatches)

</YouWillLearn>

## 介绍 {/*introduction*/}

这是一个最基本的 React 应用。可以 **编辑下面的代码** 并让它显示你的名字，以获得 React 的初体验：

<Sandpack>

```js
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

export default function App() {
  return (
    <div>
      <Greeting name="Divyesh" />
      <Greeting name="Sarah" />
      <Greeting name="Taylor" />
    </div>
  );
}
```

</Sandpack>

### React 是什么？{/*what-is-react*/}

React 是一个用于构建用户界面的 JavaScript 库。

React 擅长交互设计和编程。**它让你可以将一个复杂的用户界面，分解为我们称之为 [组件](/learn/your-first-component) 的可嵌套和可重用的片段，而这些组件可以很好的进行组合。** 如果你已经有编程的背景，这可能会让你想起用函数来编程。而如果你是一名设计师，它可能会让你联想到图层组合设计。如果你对这两个领域都不熟悉，那也没关系。很多人都是在接触 React 的过程中才熟悉它们的。使用 React 也许还会让你想起用玩具砖块来建造城堡。有时候，它甚至非常有趣。

React 没有规定要如何构建整个应用程序。它能帮助你定义和组合组件，但在其他问题中不会妨碍你。这意味你可以选择一个生态系统解决方案来解决路由、样式和数据获取等问题，或者你也可以 [使用一个提供了很多内置功能的框架](/learn/start-a-new-react-project#building-with-react-and-a-framework)。

### 你可以用 React 做什么？{/*what-can-you-do-with-react*/}

应用场景很广泛！开发者们使用 React 来创建各种用户界面——从像按钮和下拉菜单这样的小控件到整个应用程序。 **这些文档将教你在 web 平台上使用 React。** 然而，你在这里学到的大部分内容同样适用于 [React Native](https://reactnative.dev/)，它可以让你为 Android、iOS，甚至 [Windows 和 macOS](https://microsoft.github.io/react-native-windows/) 构建应用程序。

如果你好奇你日常使用的哪些产品是用 React 构建的，你可以安装 [React Developer Tools](/learn/react-developer-tools)。 每当你访问使用 React 构建的应用程序或网站时（比如说这个文档！），它的图标就会在工具栏中亮起来。

### React 使用 JavaScript {/*react-uses-javascript*/}

在 React 中，你会用 JavaScript 来可视化地描述你的逻辑。这需要一定的练习。如果你同时学习 JavaScript 和 React——很多人都这么干——但有时，它会更具挑战！不过还好，**大部分 React 的学习其实都是 JavaScript 的学习，** 也就是说你将学到远远超出 React 的内容。

使用 [此 JavaScript 概述](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/A_re-introduction_to_JavaScript) 检查你的知识水平。这将花费你 30 分钟到一个小时，但你会更有信心学习 React。 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript) 和 [javascript.info](https://zh.javascript.info/) 是两个很好的参考资源。

<DeepDive title="安装 (可选)">

如果你刚开始学习 React，你不需要安装任何东西。相反，我们建议你继续使用本网站中出现的 CodeSandbox。 它们看起来像这样：

<Sandpack>

```js
function Greeting({ name }) {
  return <h1>Hello, {name}</h1>;
}

export default function App() {
  return <Greeting name="world" />
}
```

</Sandpack>

当你准备好开始一个项目时，有多种选择。你可以在线编写 React 代码并将你的代码保存在类似 [CodeSandbox](https://react.new/) 的环境中。你也可以将 React 作为 `<script>` 标签添加到任何 HTML 文件中，以便于在现有网页的一小部分中试用它。或者你可以创建一个全新的 React 应用程序，有或没有框架都行。**请查阅 [安装](/learn/installation) 页面选择最适合你的方法——但现在你可以跳过它。**

</DeepDive>

## 学习 React {/*learn-react*/}

有几种方法可以开始：

- 如果你 **迫不及待并适合通过例子学习**，直接前往 **[React 哲学](/learn/thinking-in-react)**。该教程不会详细解释语法，但它会让你了解使用 React 构建用户界面的感受。
- 如果你 **熟悉这些概念并希望浏览可用的 API**，请查看 **[API 参考](/reference)**。
- 本文档的其余部分按章节组织，**逐步介绍每个概念** —— 带有许多交互式例子、详细说明和挑战以保证你的理解。 你不一定要按顺序阅读它们，但是每个主题都需要你熟悉前几页中的概念。

为了节省您的时间，我们在下面提供 **每章的简要概述**。 

### 第 1 章概述：描述 UI {/*chapter-1-overview-describing-the-ui*/}

React 应用程序由被称为 ["组件"](/learn/your-first-component) 的独立 UI 部分构建。 React 组件是一个 JavaScript 函数，您可以在其中添加标记。 组件可以小到一个按钮，也可以大到整个页面。下面的例子中，一个 *父* 组件 `Gallery` 渲染了三个 *子* 组件 `Profile` ：

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3As.jpg"
      alt="Katherine Johnson"
      className="avatar"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>了不起的科学家</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
.avatar { border-radius: 50%; }
```

</Sandpack>

上面例子中的标记看起来很像 HTML。这种语法叫做 [JSX](/learn/writing-markup-with-jsx)，它更严格一些（例如，所有标签必须闭合）。请注意，CSS 类在 JSX 中指定为 `className`。

就像你可以将一些信息传递给浏览器`<img>` 标签一样，你也可以将信息传递给你自己的组件，比如`<Profile>`。 此类信息称为 [_props_](/learn/passing-props-to-a-component)。下面的例子中，三个 `<Profile>` 接收不同的 props：

<Sandpack>

```js
function Profile({ name, imageUrl }) {
  return (
    <img
      className="avatar"
      src={imageUrl}
      alt={name}
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>了不起的科学家</h1>
      <Profile
        name="Lin Lanying"
        imageUrl="https://i.imgur.com/1bX5QH6.jpg"
      />
      <Profile
        name="Gregorio Y. Zara"
        imageUrl="https://i.imgur.com/7vQD0fPs.jpg"
      />
      <Profile
        name="Hedy Lamarr"
        imageUrl="https://i.imgur.com/yXOvdOSs.jpg"
      />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
.avatar { border-radius: 50%; }
```

</Sandpack>

你可能想知道为什么 `className="avatar"` 使用引号，而 `src={imageUrl}` 就使用花括号。在 JSX 中，花括号就像一个 ["进入 JavaScript 的窗口"](/learn/javascript-in-jsx-with-curly-braces)。 它们让你可以在标记中直接运行一些 JavaScript！所以 `src={imageUrl}` 读取第一行声明的 `imageUrl` prop，并从父组件 `Gallery` 传递过来。

在上面的例子中，所有的数据都是直接写在标记中的。但是，很多情况下我们想将其分开存储。下面的例子，数据保存在一个数组中。在 React 中，一般使用例如 [`map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)  的 JavaScript 函数，来 [渲染一个列表](/learn/rendering-lists) 的东西。 

<Sandpack>

```js App.js
import { people } from './data.js';
import Profile from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>了不起的科学家</h1>
      {people.map(person => (
        <Profile
          key={person.id}
          name={person.name}
          imageId={person.imageId}
        />
      ))}
    </section>
  );
}
```

```js Profile.js
export default function Profile({ name, imageId }) {
  const imageUrl = (
    'https://i.imgur.com/' +
    imageId +
    's.jpg'
  );
  return (
    <img
      className="avatar"
      src={imageUrl}
      alt={name}
    />
  );
}
```

```js data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  imageId: 'lrWQx8l'
}];
```

```css
img { margin: 0 10px 10px 0; }
.avatar { border-radius: 50%; }
```

</Sandpack>

<LearnMore path="/learn/describing-the-ui">

阅读 **[描述 UI](/learn/describing-the-ui)** 了解如何让东西出现在屏幕上，引用声明组件、导入它们、用大括号编写 JSX 以及编写条件和列表。

</LearnMore>

### 第 2 章概述：添加交互性 {/*chapter-2-overview-adding-interactivity*/}

作为交互的结果，组件通常需要更改屏幕上的内容。输入表单应该更新输入字段，单击图像轮播上的“下一步”应该更改显示的图像，单击“购买”将产品放入购物车。组件需要“记住”一些东西：当前输入值、当前图像、购物车。在 React 中，这种特定于组件的内存称为 [*state*](/learn/state-a-components-memory)。

你可以使用 [`useState`](/reference/usestate) Hook 向组件添加 state。 Hooks 是一种特殊的函数，可以让你的组件使用 React 特性（state 是这些特性之一）。`useState` Hook 允许你声明一个 state 变量。它接受初始 state 并返回一对值：当前 state 以及一个允许你更新它的 state 设置器函数。

这个 `Gallery` 组件需要记住两件事：当前图像索引（默认值为 `0`），以及用户是否切换了“显示详细信息”（默认值为 `false`）： 

```js
const [index, setIndex] = useState(0);
const [showMore, setShowMore] = useState(false);
```

请注意单击按钮如何更新屏幕：

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
        下一个
      </button>
      <h2>
        <i>{sculpture.name} </i>
        {sculpture.artist} 的 <i>{sculpture.name} </i>
      </h2>
      <h3>
        ({index + 1} / {sculptureList.length})
      </h3>
      <button onClick={handleMoreClick}>
        {showMore ? '隐藏' : '显示'} 详情
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
  description: 'Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.',
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: 'A bronze statue of two crossed hands delicately holding a human brain in their fingertips.'
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'This enormous (75 ft. or 23m) silver flower is located in Buenos Aires. It is designed to move, closing its petals in the evening or when strong winds blow and opening them in the morning.',
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson was known for his preoccupation with equality, social justice, as well as the essential and spiritual qualities of humankind. This massive (7ft. or 2,13m) bronze represents what he described as "a symbolic Black presence infused with a sense of universal humanity."',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: 'The sculpture depicting a human head seems ever-present and solemn. It radiates calm and serenity.'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: 'Located on the Easter Island, there are 1,000 moai, or extant monumental statues, created by the early Rapa Nui people, which some believe represented deified ancestors.',
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: 'Three monumental stone busts with the heads that are disproportionately large with somber faces.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'The Nanas are triumphant creatures, symbols of femininity and maternity. Initially, Saint Phalle used fabric and found objects for the Nanas, and later on introduced polyester to achieve a more vibrant effect.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: 'A large mosaic sculpture of a whimsical dancing female figure in a colorful costume emanating joy.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'This abstract bronze sculpture is a part of The Family of Man series located at Yorkshire Sculpture Park. Hepworth chose not to create literal representations of the world but developed abstract forms inspired by people and landscapes.',
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: 'A tall sculpture made of three elements stacked on each other reminding of a human figure.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Descended from four generations of woodcarvers, Fakeye's work blended traditional and contemporary Yoruba themes.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: 'An intricate wood sculpture of a warrior with a focused face on a horse adorned with patterns.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow is known for her sculptures of the fragmented body as a metaphor for the fragility and impermanence of youth and beauty. This sculpture depicts two very realistic large bellies stacked on top of each other, each around five feet (1,5m) tall.",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: 'The sculpture reminds a cascade of folds, quite different from bellies in classical sculptures.'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: 'The Terracotta Army is a collection of terracotta sculptures depicting the armies of Qin Shi Huang, the first Emperor of China. The army consited of more than 8,000 soldiers, 130 chariots with 520 horses, and 150 cavalry horses.',
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: '12 terracotta sculptures of solemn warriors, each with a unique facial expression and armor.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson was known for scavenging objects from New York City debris, which she would later assemble into monumental constructions. In this one, she used disparate parts like a bedpost, juggling pin, and seat fragment, nailing and gluing them into boxes that reflect the influence of Cubism’s geometric abstraction of space and form.',
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: 'A black matte sculpture where the individual elements are initially indistinguishable.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar merges the traditional and the modern, the natural and the industrial. Her art focuses on the relationship between man and nature. Her work was described as compelling both abstractly and figuratively, gravity defying, and a "fine synthesis of unlikely materials."',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: 'A pale wire-like sculpture mounted on concrete wall and descending on the floor. It appears light.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'The Taipei Zoo commissioned a Hippo Square featuring submerged hippos at play.',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: 'A group of bronze hippo sculptures emerging from the sett sidewalk as if they were swimming.'
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

State 也可以保存复杂的值。例如，如果你正在实现一个表单，你就可以在 state 中保持一个具有不同字段的对象。 下面示例中的 `...` 语法允许你 [基于现有对象创建新对象](/learn/updating-objects-in-state)。

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleFirstNameChange(e) {
    setPerson({
      ...person,
      firstName: e.target.value
    });
  }

  function handleLastNameChange(e) {
    setPerson({
      ...person,
      lastName: e.target.value
    });
  }

  function handleEmailChange(e) {
    setPerson({
      ...person,
      email: e.target.value
    });
  }

  return (
    <>
      <label>
        名：
        <input
          value={person.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        姓：
        <input
          value={person.lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <label>
        Email:
        <input
          value={person.email}
          onChange={handleEmailChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

你还可以将数组保持在 state。 这允许你添加、删除或更改列表中的内容以响应用户交互。按照你的需求，有不同的 [从现有数组创建新数组的方法](/learn/updating-arrays-in-state)。

<Sandpack>

```js
import { useState } from 'react';

let nextId = 0;

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState([]);

  return (
    <>
      <h1>鼓舞人心的雕塑家：</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => {
        setName('');
        setArtists([
          ...artists,
          { id: nextId++, name: name }
        ]);
      }}>添加</button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

<LearnMore path="/learn/adding-interactivity">

阅读 **[添加交互性](/learn/adding-interactivity)** 了解如何在交互时更新屏幕，包括添加事件处理程序、声明和更新 state，以及在 state 中更新对象和数组的不同方法。

</LearnMore>

### 第 3 章概述： 管理 State {/*chapter-3-overview-managing-state*/}

您经常会面临选择_究竟要把什么_放进 state 的问题。 您应该使用一个 state 变量还是多个 state 变量？ 对象还是数组？ 你应该如何[构建你的 state](/learn/choosing-the-state-structure)？ 最重要的原则是**避免冗余 state**。 如果某些信息永远不会改变，它就不应该处于 state。 如果某些信息是通过 props 从父组件收到的，它不应该处于 state 中。 如果某些信息可以从其他 props 或 state 计算得出，它也不应该处于 state 中！

例如，这个表单有一个多余的 `fullName` state 变量：

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
    setFullName(e.target.value + ' ' + lastName);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
    setFullName(firstName + ' ' + e.target.value);
  }

  return (
    <>
      <h2>让我帮您登记</h2>
      <label>
        名：{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        姓：{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        您的姓名是：{fullName}
      </p>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

您可以通过在组件渲染时计算 `fullName` 来删除它并简化代码：

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const fullName = firstName + ' ' + lastName;

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <h2>让我帮您登记</h2>
      <label>
        名：{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        姓：{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        您的姓名是：{fullName}
      </p>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

这可能看起来像一个小变化，但在 React 应用中很多 bug 都是这么修复的。

你有的时候可能需要两个组件的 state 同时更改。要做到这一点，在它们两个中都删除该 state，将它移动到它们最近的公共父节点，然后通过 props 将它传递给它们。这被称为 ["提升 state"](/learn/sharing-state-between-components)，这是编写 React 代码时最常见的事情之一。例如，在像下面这样的手风琴组件中，一次应该只有一个面板处于激活状态。父组件不应该将激活 state 保存在每个单独的面板内，而是保存在父组件的 state 中并通过 props 指定给子组件。

<Sandpack>

```js
import { useState } from 'react';

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <h2>阿拉木图, 哈萨克斯坦</h2>
      <Panel
        title="关于"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        阿拉木图有大约 200 万人口，是哈萨克斯坦最大的城市。从 1929 年到 1997 年，它是哈萨克斯坦的首都。
      </Panel>
      <Panel
        title="词源"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        这个名字源自 <span lang="kk-KZ">алма</span>，哈萨克语中的“苹果”一词，通常被翻译为“苹果之城”。 事实上，阿拉木图周边地区被认为是苹果的祖先家园，而野生<i lang="la">Malus Siversii (天山野苹果)</i> 可能是现代家养苹果祖先。
      </Panel>
    </>
  );
}

function Panel({
  title,
  children,
  isActive,
  onShow
}) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={onShow}>
          展示
        </button>
      )}
    </section>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<LearnMore path="/learn/managing-state">

阅读 **[管理 State](/learn/managing-state)** 了解如何保持组件的可维护性，包括如何很好地构建 state，如何在组件之间共享 state，以及如何将 state 传递到树的深处。

</LearnMore>

## 下一步 {/*next-steps*/}

这一章节奏很快！如果已经读到这里，你就已经读了 React 80% 的日常使用内容。

接下来的步骤取决于你：

* 如果你想在本地创建一个 React 项目，请参考 [安装](/learn/installation)。
* 如果你想了解在 React 中构建 UI 在实践中是什么感觉，请阅读 [React 哲学](/learn/thinking-in-react)。
* 或者，从 [描述 UI](/learn/describing-the-ui) 开始，仔细阅读第一章。

当你需要了解 API 必要的细节时，不要忘记阅读 [API 参考](/reference)！
