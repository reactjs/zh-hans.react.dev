---
title: 渲染列表
translator:
  - Megrax
  - rottenpen
---

<Intro>

你可能经常需要通过 [JavaScript 的数组方法](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array#) 来操作数组中的数据，从而将一个数据集渲染成多个相似的组件。在这篇文章中，你将学会如何在 React 中使用 [`filter()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) 筛选需要渲染的组件和使用 [`map()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/map) 把数组转换成组件数组。

</Intro>

<YouWillLearn>

* 如何通过 JavaScript 的 `map()` 方法从数组中生成组件
* 如何通过 JavaScript 的 `filter()` 筛选需要渲染的组件
* 何时以及为何使用 React 中的 key

</YouWillLearn>

## 从数组中渲染数据 {/*rendering-data-from-arrays*/}

这里我们有一个列表。

```js
<ul>
  <li>凯瑟琳·约翰逊: 数学家</li>
  <li>马里奥·莫利纳: 化学家</li>
  <li>穆罕默德·阿卜杜勒·萨拉姆: 物理学家</li>
  <li>珀西·莱温·朱利亚: 化学家</li>
  <li>苏布拉马尼扬·钱德拉塞卡: 天体物理学家</li>
</ul>
```

可以看到，这些列表项之间唯一的区别就是其中的内容/数据。未来你可能会碰到很多类似的情况，在那些场景中，你想基于不同的数据渲染出相似的组件，比如评论列表或者个人资料的图库。在这样的场景下，可以把要用到的数据存入 JavaScript 对象或数组，然后用 [`map()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/map) 或 [`filter()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) 这样的方法来渲染出一个组件列表。

这里给出一个由数组生成一系列列表项的简单示例：

1. 首先，把数据 **存储** 到数组中：

```js
const people = [
  '凯瑟琳·约翰逊: 数学家',
  '马里奥·莫利纳: 化学家',
  '穆罕默德·阿卜杜勒·萨拉姆: 物理学家',
  '珀西·莱温·朱利亚: 化学家',
  '苏布拉马尼扬·钱德拉塞卡: 天体物理学家',
];
```

2. **遍历** `people` 这个数组中的每一项，并获得一个新的 JSX 节点数组 `listItems`：

```js
const listItems = people.map(person => <li>{person}</li>);
```

3. 把 `listItems` 用 `<ul>` 包裹起来，然后 **返回** 它：

```js
return <ul>{listItems}</ul>;
```

来看看运行的结果：

<Sandpack>

```js
const people = [
  '凯瑟琳·约翰逊: 数学家',
  '马里奥·莫利纳: 化学家',
  '穆罕默德·阿卜杜勒·萨拉姆: 物理学家',
  '珀西·莱温·朱利亚: 化学家',
  '苏布拉马尼扬·钱德拉塞卡: 天体物理学家',
];

export default function List() {
  const listItems = people.map(person =>
    <li>{person}</li>
  );
  return <ul>{listItems}</ul>;
}
```

```css
li { margin-bottom: 10px; }
```

</Sandpack>

注意上面的沙盒可能会输出这样一个控制台错误：

<ConsoleBlock level="error">

Warning: Each child in a list should have a unique "key" prop.

</ConsoleBlock>

等会我们会学到怎么修复它。在此之前，我们先来看看如何把这个数组变得更加结构化。

## 对数组项进行过滤 {/*filtering-arrays-of-items*/}

让我们把 `people` 数组变得更加结构化一点。

```js
const people = [
  {
    id: 0,
    name: '凯瑟琳·约翰逊',
    profession: '数学家',
  },
  {
    id: 1,
    name: '马里奥·莫利纳',
    profession: '化学家',
  },
  {
    id: 2,
    name: '穆罕默德·阿卜杜勒·萨拉姆',
    profession: '物理学家',
  },
  {
    name: '珀西·莱温·朱利亚',
    profession: '化学家',
  },
  {
    name: '苏布拉马尼扬·钱德拉塞卡',
    profession: '天体物理学家',
  },
];
```

现在，假设你只想在屏幕上显示职业是 `化学家` 的人。那么你可以使用 JavaScript 的 `filter()` 方法来返回满足条件的项。这个方法会让数组的子项经过 “过滤器”（一个返回值为 `true` 或 `false` 的函数）的筛选，最终返回一个只包含满足条件的项的新数组。

既然你只想显示 `profession` 值是 `化学家` 的人，那么这里的 “过滤器” 函数应该长这样：`(person) => person.profession === '化学家'`。下面我们来看看该怎么把它们组合在一起：

1. 首先，**创建** 一个用来存化学家们的新数组 `chemists`，这里用到 `filter()` 方法过滤 `people` 数组来得到所有的化学家，过滤的条件应该是 `person.profession === '化学家'`：

```js
const chemists = people.filter(person =>
  person.profession === '化学家'
);
```

2. 接下来 **用 map 方法遍历** `chemists` 数组:

```js {1,13}
const listItems = chemists.map(person =>
  <li>
     <img
       src={getImageUrl(person)}
       alt={person.name}
     />
     <p>
       <b>{person.name}:</b>
       {' ' + person.profession + ' '}
       因{person.accomplishment}而闻名世界
     </p>
  </li>
);
```

3. 最后，**返回** `listItems`：

```js
return <ul>{listItems}</ul>;
```

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const chemists = people.filter(person =>
    person.profession === '化学家'
  );
  const listItems = chemists.map(person =>
    <li>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}:</b>
        {' ' + person.profession + ' '}
        因{person.accomplishment}而闻名世界
      </p>
    </li>
  );
  return <ul>{listItems}</ul>;
}
```

```js data.js
export const people = [
  {
    id: 0,
    name: '凯瑟琳·约翰逊',
    profession: '数学家',
    accomplishment: '太空飞行相关数值的核算',
    imageId: 'MK3eW3A',
  },
  {
    id: 1,
    name: '马里奥·莫利纳',
    profession: '化学家',
    accomplishment: '北极臭氧空洞的发现',
    imageId: 'mynHUSa',
  },
  {
    id: 2,
    name: '穆罕默德·阿卜杜勒·萨拉姆',
    profession: '物理学家',
    accomplishment: '关于基本粒子间弱相互作用和电磁相互作用的统一理论',
    imageId: 'bE7W1ji',
  },
  {
    id: 3,
    name: '珀西·莱温·朱利亚',
    profession: '化学家',
    accomplishment: '开创性的可的松药物、类固醇和避孕药的研究',
    imageId: 'IOjWm71',
  },
  {
    id: 4,
    name: '苏布拉马尼扬·钱德拉塞卡',
    profession: '天体物理学家',
    accomplishment: '白矮星质量计算',
    imageId: 'lrWQx8l',
  },
];
```

```js utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li { 
  margin-bottom: 10px; 
  display: grid; 
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<Pitfall>

因为箭头函数会隐式地返回位于 `=>` 之后的表达式，所以你可以省略 `return` 语句。

```js
const listItems = chemists.map(person =>
  <li>...</li> // 隐式地返回！
);
```

不过，**如果你的 `=>` 后面跟了一对花括号 `{` ，那你必须使用 `return` 来指定返回值！**

```js
const listItems = chemists.map(person => { // 花括号
  return <li>...</li>;
});
```

箭头函数 `=> {` 后面的部分被称为 ["块函数体"](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Arrow_functions#function_body)，块函数体支持多行代码的写法，但要用 `return` 语句才能指定返回值。假如你忘了写 `return`，那这个函数什么都不会返回！

</Pitfall>

## 用 `key` 保持列表项的顺序 {/*keeping-list-items-in-order-with-key*/}

如果把上面任何一个沙盒示例在新标签页打开，你就会发现控制台有这样一个报错：

<ConsoleBlock level="error">

Warning: Each child in a list should have a unique "key" prop.

</ConsoleBlock>

这是因为你必须给数组中的每一项都指定一个 `key`——它可以是字符串或数字的形式，只要能唯一标识出各个数组项就行：

```js
<li key={person.id}>...</li>
```

<Note>

直接放在 `map()` 方法里的 JSX 元素一般都需要指定 `key` 值！

</Note>

这些 key 会告诉 React，每个组件对应着数组里的哪一项，所以 React 可以把它们匹配起来。这在数组项进行移动（例如排序）、插入或删除等操作时非常重要。一个合适的 `key` 可以帮助 React 推断发生了什么，从而得以正确地更新 DOM 树。

用作 key 的值应该在数据中提前就准备好，而不是在运行时才随手生成：

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const listItems = people.map(person =>
    <li key={person.id}>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}</b>
          {' ' + person.profession + ' '}
          因{person.accomplishment}而闻名世界
      </p>
    </li>
  );
  return <ul>{listItems}</ul>;
}
```

```js data.js active
export const people = [
  {
    id: 0, // 在 JSX 中作为 key 使用
    name: '凯瑟琳·约翰逊',
    profession: '数学家',
    accomplishment: '太空飞行相关数值的核算',
    imageId: 'MK3eW3A',
  },
  {
    id: 1, // 在 JSX 中作为 key 使用
    name: '马里奥·莫利纳',
    profession: '化学家',
    accomplishment: '北极臭氧空洞的发现',
    imageId: 'mynHUSa',
  },
  {
    id: 2, // 在 JSX 中作为 key 使用
    name: '穆罕默德·阿卜杜勒·萨拉姆',
    profession: '物理学家',
    accomplishment: '关于基本粒子间弱相互作用和电磁相互作用的统一理论',
    imageId: 'bE7W1ji',
  },
  {
    id: 3, // 在 JSX 中作为 key 使用
    name: '珀西·莱温·朱利亚',
    profession: '化学家',
    accomplishment: '开创性的可的松药物、类固醇和避孕药',
    imageId: 'IOjWm71',
  },
  {
    id: 4, // 在 JSX 中作为 key 使用
    name: '苏布拉马尼扬·钱德拉塞卡',
    profession: '天体物理学家',
    accomplishment: '白矮星质量计算',
    imageId: 'lrWQx8l',
  },
];
```

```js utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li { 
  margin-bottom: 10px; 
  display: grid; 
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<DeepDive>

#### 为每个列表项显示多个 DOM 节点 {/*displaying-several-dom-nodes-for-each-list-item*/}

如果你想让每个列表项都输出多个 DOM 节点而非一个的话，该怎么做呢？

Fragment 语法的简写形式 `<> </>` 无法接受 key 值，所以你只能要么把生成的节点用一个 `<div>` 标签包裹起来，要么使用长一点但更明确的 `<Fragment>` 写法：

```js
import { Fragment } from 'react';

// ...

const listItems = people.map(person =>
  <Fragment key={person.id}>
    <h1>{person.name}</h1>
    <p>{person.bio}</p>
  </Fragment>
);
```

这里的 Fragment 标签本身并不会出现在 DOM 上，这串代码最终会转换成 `<h1>`、`<p>`、`<h1>`、`<p>`…… 的列表。

</DeepDive>

### 如何设定 `key` 值 {/*where-to-get-your-key*/}

不同来源的数据往往对应不同的 key 值获取方式：

* **来自数据库的数据：** 如果你的数据是从数据库中获取的，那你可以直接使用数据表中的主键，因为它们天然具有唯一性。
* **本地产生数据：** 如果你数据的产生和保存都在本地（例如笔记软件里的笔记），那么你可以使用一个自增计数器或者一个类似 [`uuid`](https://www.npmjs.com/package/uuid) 的库来生成 key。

### key 需要满足的条件 {/*rules-of-keys*/}

* **key 值在兄弟节点之间必须是唯一的。** 不过不要求全局唯一，在不同的数组中可以使用相同的 key。
* **key 值不能改变**，否则就失去了使用 key 的意义！所以千万不要在渲染时动态地生成 key。

### React 中为什么需要 key？ {/*why-does-react-need-keys*/}

设想一下，假如你桌面上的文件都没有文件名，取而代之的是，你需要通过文件的位置顺序来区分它们———第一个文件，第二个文件，以此类推。也许你也不是不能接受这种方式，可是一旦你删除了其中的一个文件，这种组织方式就会变得混乱无比。原来的第二个文件可能会变成第一个文件，第三个文件会成为第二个文件……

React 里需要 key 和文件夹里的文件需要有文件名的道理是类似的。它们（key 和文件名）都让我们可以从众多的兄弟元素中唯一标识出某一项（JSX 节点或文件）。而一个精心选择的 key 值所能提供的信息远远不止于这个元素在数组中的位置。即使元素的位置在渲染的过程中发生了改变，它提供的 `key` 值也能让 React 在整个生命周期中一直认得它。

<Pitfall>

你可能会想直接把数组项的索引当作 key 值来用，实际上，如果你没有显式地指定 `key` 值，React 确实默认会这么做。但是数组项的顺序在插入、删除或者重新排序等操作中会发生改变，此时把索引顺序用作 key 值会产生一些微妙且令人困惑的 bug。

与之类似，请不要在运行过程中动态地产生 key，像是 `key={Math.random()}` 这种方式。这会导致每次重新渲染后的 key 值都不一样，从而使得所有的组件和 DOM 元素每次都要重新创建。这不仅会造成运行变慢的问题，更有可能导致用户输入的丢失。所以，使用能从给定数据中稳定取得的值才是明智的选择。

有一点需要注意，组件不会把 `key` 当作 props 的一部分。Key 的存在只对 React 本身起到提示作用。如果你的组件需要一个 ID，那么请把它作为一个单独的 prop 传给组件： `<Profile key={id} userId={id} />`。

</Pitfall>

<Recap>

在这篇文章中，你学习了：

* 如何从组件中抽离出数据，并把它们放入像数组、对象这样的数据结构中。
* 如何使用 JavaScript 的 `map()` 方法来生成一组相似的组件。
* 如何使用 JavaScript 的 `filter()` 方法来筛选数组。
* 为何以及如何给集合中的每个组件设置一个 `key` 值：它使 React 能追踪这些组件，即便后者的位置或数据发生了变化。

</Recap>



<Challenges>

#### 把列表一分为二 {/*splitting-a-list-in-two*/}

下面的示例中有一个包含所有人员信息的列表。

请试着把它分成一前一后的两个列表：分别是 **化学家们** 和 **其余的人**。像之前一样，你可以通过 `person.profession === '化学家'` 这个条件来判断一个人是不是化学家。

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const listItems = people.map(person =>
    <li key={person.id}>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}:</b>
        {' ' + person.profession + ' '}
        因{person.accomplishment}而闻名世界
      </p>
    </li>
  );
  return (
    <article>
      <h1>科学家</h1>
      <ul>{listItems}</ul>
    </article>
  );
}
```

```js data.js
export const people = [
  {
    id: 0,
    name: '凯瑟琳·约翰逊',
    profession: '数学家',
    accomplishment: '太空飞行相关数值的核算',
    imageId: 'MK3eW3A',
  },
  {
    id: 1,
    name: '马里奥·莫利纳',
    profession: '化学家',
    accomplishment: '北极臭氧空洞的发现',
    imageId: 'mynHUSa',
  },
  {
    id: 2,
    name: '穆罕默德·阿卜杜勒·萨拉姆',
    profession: '物理学家',
    accomplishment: '关于基本粒子间弱相互作用和电磁相互作用的统一理论',
    imageId: 'bE7W1ji',
  },
  {
    id: 3,
    name: '珀西·莱温·朱利亚',
    profession: '化学家',
    accomplishment: '开创性的可的松药物、类固醇和避孕药',
    imageId: 'IOjWm71',
  },
  {
    id: 4,
    name: '苏布拉马尼扬·钱德拉塞卡',
    profession: '天体物理学家',
    accomplishment: '白矮星质量计算',
    imageId: 'lrWQx8l',
  },
];
```

```js utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<Solution>

使用两次 `filter()` 方法来获得两个单独的数组，然后用 `map` 方法分别遍历它们来得到结果。

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const chemists = people.filter(person =>
    person.profession === '化学家'
  );
  const everyoneElse = people.filter(person =>
    person.profession !== '化学家'
  );
  return (
    <article>
      <h1>科学家</h1>
      <h2>化学家</h2>
      <ul>
        {chemists.map(person =>
          <li key={person.id}>
            <img
              src={getImageUrl(person)}
              alt={person.name}
            />
            <p>
              <b>{person.name}:</b>
              {' ' + person.profession + ' '}
              因{person.accomplishment}而闻名世界
            </p>
          </li>
        )}
      </ul>
      <h2>其余的人</h2>
      <ul>
        {everyoneElse.map(person =>
          <li key={person.id}>
            <img
              src={getImageUrl(person)}
              alt={person.name}
            />
            <p>
              <b>{person.name}:</b>
              {' ' + person.profession + ' '}
              因{person.accomplishment}而闻名世界
            </p>
          </li>
        )}
      </ul>
    </article>
  );
}
```

```js data.js
export const people = [
  {
    id: 0,
    name: '凯瑟琳·约翰逊',
    profession: '数学家',
    accomplishment: '太空飞行相关数值的核算',
    imageId: 'MK3eW3A',
  },
  {
    id: 1,
    name: '马里奥·莫利纳',
    profession: '化学家',
    accomplishment: '北极臭氧空洞的发现',
    imageId: 'mynHUSa',
  },
  {
    id: 2,
    name: '穆罕默德·阿卜杜勒·萨拉姆',
    profession: '物理学家',
    accomplishment: '关于基本粒子间弱相互作用和电磁相互作用的统一理论',
    imageId: 'bE7W1ji',
  },
  {
    id: 3,
    name: '珀西·莱温·朱利亚',
    profession: '化学家',
    accomplishment: '开创性的可的松药物、类固醇和避孕药',
    imageId: 'IOjWm71',
  },
  {
    id: 4,
    name: '苏布拉马尼扬·钱德拉塞卡',
    profession: '天体物理学家',
    accomplishment: '白矮星质量计算',
    imageId: 'lrWQx8l',
  },
];
```

```js utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

这个解决方案中，我们直接在父级的 `<ul>` 元素里就执行了 `map` 方法。当然如果你想提高代码的可读性，你也可以先用变量保存一下 `map` 之后的结果。

现在得到的列表中仍然存在一些重复的代码，我们可以更进一步，将这些重复的部分提取成一个 `<ListSection>` 组件：

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

function ListSection({ title, people }) {
  return (
    <>
      <h2>{title}</h2>
      <ul>
        {people.map(person =>
          <li key={person.id}>
            <img
              src={getImageUrl(person)}
              alt={person.name}
            />
            <p>
              <b>{person.name}:</b>
              {' ' + person.profession + ' '}
              因{person.accomplishment}而闻名世界
            </p>
          </li>
        )}
      </ul>
    </>
  );
}

export default function List() {
  const chemists = people.filter(person =>
    person.profession === '化学家'
  );
  const everyoneElse = people.filter(person =>
    person.profession !== '化学家'
  );
  return (
    <article>
      <h1>科学家</h1>
      <ListSection
        title="化学家"
        people={chemists}
      />
      <ListSection
      title="其余的人"
      people={everyoneElse} 
      />
    </article>
  );
}
```

```js data.js
export const people = [
  {
    id: 0,
    name: '凯瑟琳·约翰逊',
    profession: '数学家',
    accomplishment: '太空飞行相关数值的核算',
    imageId: 'MK3eW3A',
  },
  {
    id: 1,
    name: '马里奥·莫利纳',
    profession: '化学家',
    accomplishment: '北极臭氧空洞的发现',
    imageId: 'mynHUSa',
  },
  {
    id: 2,
    name: '穆罕默德·阿卜杜勒·萨拉姆',
    profession: '物理学家',
    accomplishment: '关于基本粒子间弱相互作用和电磁相互作用的统一理论',
    imageId: 'bE7W1ji',
  },
  {
    id: 3,
    name: '珀西·莱温·朱利亚',
    profession: '化学家',
    accomplishment: '开创性的可的松药物、类固醇和避孕药',
    imageId: 'IOjWm71',
  },
  {
    id: 4,
    name: '苏布拉马尼扬·钱德拉塞卡',
    profession: '天体物理学家',
    accomplishment: '白矮星质量计算',
    imageId: 'lrWQx8l',
  },
];
```

```js utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

仔细的读者会发现我们在这写了两个 `filter`，对于每个人的职业我们都进行了两次过滤。读取一个属性的值花不了多少时间，因此放在这个简单的示例中没什么大问题。但是如果你的代码逻辑比这里复杂和“昂贵”得多，那你可以把两次的 `filter` 替换成一个只需进行一次检查就能构造两个数组的循环。

实际上，如果 `people` 的数据不会改变，可以直接把这段代码移到组件外面。从 React 的视角来看，它只关心你最后给它的是不是包含 JSX 节点的数组，并不在乎数组是怎么来的：

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

let chemists = [];
let everyoneElse = [];
people.forEach(person => {
  if (person.profession === '化学家') {
    chemists.push(person);
  } else {
    everyoneElse.push(person);
  }
});

function ListSection({ title, people }) {
  return (
    <>
      <h2>{title}</h2>
      <ul>
        {people.map(person =>
          <li key={person.id}>
            <img
              src={getImageUrl(person)}
              alt={person.name}
            />
            <p>
              <b>{person.name}:</b>
              {' ' + person.profession + ' '}
              因{person.accomplishment}而闻名世界
            </p>
          </li>
        )}
      </ul>
    </>
  );
}

export default function List() {
  return (
    <article>
      <h1>科学家</h1>
      <ListSection
        title="化学家"
        people={chemists}
      />
      <ListSection
        title="其余的人"
        people={everyoneElse}
      />
    </article>
  );
}
```

```js data.js
export const people = [
  {
    id: 0,
    name: '凯瑟琳·约翰逊',
    profession: '数学家',
    accomplishment: '太空飞行相关数值的核算',
    imageId: 'MK3eW3A',
  },
  {
    id: 1,
    name: '马里奥·莫利纳',
    profession: '化学家',
    accomplishment: '北极臭氧空洞的发现',
    imageId: 'mynHUSa',
  },
  {
    id: 2,
    name: '穆罕默德·阿卜杜勒·萨拉姆',
    profession: '物理学家',
    accomplishment: '关于基本粒子间弱相互作用和电磁相互作用的统一理论',
    imageId: 'bE7W1ji',
  },
  {
    id: 3,
    name: '珀西·莱温·朱利亚',
    profession: '化学家',
    accomplishment: '开创性的可的松药物、类固醇和避孕药',
    imageId: 'IOjWm71',
  },
  {
    id: 4,
    name: '苏布拉马尼扬·钱德拉塞卡',
    profession: '天体物理学家',
    accomplishment: '白矮星质量计算',
    imageId: 'lrWQx8l',
  },
];
```

```js utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

</Solution>

#### 嵌套列表 {/*nested-lists-in-one-component*/}

请根据给你的数组生成菜谱列表！其中每个菜谱，都用 `<h2>` 来显示它的名称，并在 `<ul>` 里列出它所需的原料。

<Hint>

这里的写法需要嵌套两层 `map`。

</Hint>

<Sandpack>

```js App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>菜谱</h1>
    </div>
  );
}
```

```js data.js
export const recipes = [
  {
    id: 'greek-salad',
    name: '希腊沙拉',
    ingredients: ['西红柿', '黄瓜', '洋葱', '油橄榄', '羊奶酪'],
  },
  {
    id: 'hawaiian-pizza',
    name: '夏威夷披萨',
    ingredients: ['披萨饼皮', '披萨酱', '马苏里拉奶酪', '火腿', '菠萝'],
  },
  {
    id: 'hummus',
    name: '鹰嘴豆泥',
    ingredients: ['鹰嘴豆', '橄榄油', '蒜瓣', '柠檬', '芝麻酱'],
  },
];
```

</Sandpack>

<Solution>

这是一种可能的解法：

<Sandpack>

```js App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>菜谱</h1>
      {recipes.map(recipe =>
        <div key={recipe.id}>
          <h2>{recipe.name}</h2>
          <ul>
            {recipe.ingredients.map(ingredient =>
              <li key={ingredient}>
                {ingredient}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
```

```js data.js
export const recipes = [
  {
    id: 'greek-salad',
    name: '希腊沙拉',
    ingredients: ['西红柿', '黄瓜', '洋葱', '油橄榄', '羊奶酪'],
  },
  {
    id: 'hawaiian-pizza',
    name: '夏威夷披萨',
    ingredients: ['披萨饼皮', '披萨酱', '马苏里拉奶酪', '火腿', '菠萝'],
  },
  {
    id: 'hummus',
    name: '鹰嘴豆泥',
    ingredients: ['鹰嘴豆', '橄榄油', '蒜瓣', '柠檬', '芝麻酱'],
  },
];
```

</Sandpack>

`recipes` 数组中每一项都拥有一个 `id`，所以外层的循环可以直接拿它作为 `key`。不过，在循环遍历原料的时候就没有现成的 `id` 可以用了。但是，合理推测一下，一份菜谱里不会罗列多次同一种原料，所以其实原料的名字就适合作为 `key`。此外，你也可以自行修改原本的数据人为增加一项 `id`，或是使用索引作为 `key`（需要注意的是，这么做会使你无法正常地对原料进行排序）。

</Solution>

#### 把列表项提取成一个组件 {/*extracting-a-list-item-component*/}

`RecipeList` 组件的代码里嵌套了两层 `map`。出于简化代码的考虑，我们提取出一个接受 `id`、`name` 和 `ingredients` 作为 props 的 `Recipe` 组件。这种情况下，你会把外层的 `key` 放在哪里呢？原因是什么？

<Sandpack>

```js App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>菜谱</h1>
      {recipes.map(recipe =>
        <div key={recipe.id}>
          <h2>{recipe.name}</h2>
          <ul>
            {recipe.ingredients.map(ingredient =>
              <li key={ingredient}>
                {ingredient}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
```

```js data.js
export const recipes = [
  {
    id: 'greek-salad',
    name: '希腊沙拉',
    ingredients: ['西红柿', '黄瓜', '洋葱', '油橄榄', '羊奶酪'],
  },
  {
    id: 'hawaiian-pizza',
    name: '夏威夷披萨',
    ingredients: ['披萨饼皮', '披萨酱', '马苏里拉奶酪', '火腿', '菠萝'],
  },
  {
    id: 'hummus',
    name: '鹰嘴豆泥',
    ingredients: ['鹰嘴豆', '橄榄油', '蒜瓣', '柠檬', '芝麻酱'],
  },
];
```

</Sandpack>

<Solution>

你可以将外层 `map` 里的 JSX 复制粘贴到新的 `Recipe` 组件中，并作为这个新组件的返回值。接着把原先的 `recipe.name` 改成 `name`，`recipe.id` 改成 `id`，以此类推，最后把它们作为 props 传给 `Recipe`：

<Sandpack>

```js
import { recipes } from './data.js';

function Recipe({ id, name, ingredients }) {
  return (
    <div>
      <h2>{name}</h2>
      <ul>
        {ingredients.map(ingredient =>
          <li key={ingredient}>
            {ingredient}
          </li>
        )}
      </ul>
    </div>
  );
}

export default function RecipeList() {
  return (
    <div>
      <h1>菜谱</h1>
      {recipes.map(recipe =>
        <Recipe {...recipe} key={recipe.id} />
      )}
    </div>
  );
}
```

```js data.js
export const recipes = [
  {
    id: 'greek-salad',
    name: '希腊沙拉',
    ingredients: ['西红柿', '黄瓜', '洋葱', '油橄榄', '羊奶酪'],
  },
  {
    id: 'hawaiian-pizza',
    name: '夏威夷披萨',
    ingredients: ['披萨饼皮', '披萨酱', '马苏里拉奶酪', '火腿', '菠萝'],
  },
  {
    id: 'hummus',
    name: '鹰嘴豆泥',
    ingredients: ['鹰嘴豆', '橄榄油', '蒜瓣', '柠檬', '芝麻酱'],
  },
];
```

</Sandpack>

这里的 `<Recipe {...recipe} key={recipe.id} />` 是一种简写方式，它表示“把 `recipe` 对象里的每个属性都作为 props 传给 `Recipe` 组件”。这和直接写明每一个 prop 是等价的：`<Recipe id={recipe.id} name={recipe.name} ingredients={recipe.ingredients} key={recipe.id} />`。

**注意这里的 `key` 是写在 `<Recipe>` 组件本身上的，不要写在 `Recipe` 内部返回的 `<div>` 上。** 这是因为 `key` 只有在就近的数组上下文中才有意义。之前的写法里，我们生成了一个 `<div>` 的数组所以其中的每一项需要一个 `key`，但是现在的写法里，生成的实际上是 `<Recipe>` 的数组。换句话说，在提取组件的时候，`key` 应该写在复制粘贴的 JSX 的外层组件上。

</Solution>

#### 带有分隔符的列表 {/*list-with-a-separator*/}

下面这个示例展示了葛饰北斋一首著名的俳句，它的每一行都由 `<p>` 标签包裹。你需要在段落之间插入分隔符 `<hr />`，最终的结果大概像这样：

```js
<article>
  <p>I write, erase, rewrite</p>
  <hr />
  <p>Erase again, and then</p>
  <hr />
  <p>A poppy blooms.</p>
</article>
```

一首俳句通常只有三行，但是你的解答应当适用于任何行数。注意，`<hr />` 元素只应该在 `<p>` 元素 **之间** 出现，而不是在开头或结尾。

<Sandpack>

```js
const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  return (
    <article>
      {poem.lines.map((line, index) =>
        <p key={index}>
          {line}
        </p>
      )}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

（这是一个比较少见的可以把数组索引用作 key 的例子，因为诗句之间的顺序必然是固定的。）

<Hint>

你可以尝试把原本的 `map` 改造成手动循环，或者试下 fragment 语法。

</Hint>

<Solution>

可以写一个循环，在循环的过程中把 `<hr />` 和 `<p>...</p>` 插入到输出的数组：

<Sandpack>

```js
const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  let output = [];

  // 填充输出的数组
  poem.lines.forEach((line, i) => {
    output.push(
      <hr key={i + '-separator'} />
    );
    output.push(
      <p key={i + '-text'}>
        {line}
      </p>
    );
  });
  // 移除第一个 <hr />
  output.shift();

  return (
    <article>
      {output}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

原本使用诗句顺序索引作为 `key` 的方法已经行不通了，因为现在数组里同时包含了分隔符和诗句。但是，你可以用添加后缀的形式给它们赋予独一无二的 key 值，比如 `key={i + '-text'}` 这样。

另一种做法是，生成包含 `<hr />` 和 `<p>...</p>` 的 fragment 集合，但因其简写语法 `<> </>` 不支持指定 key，所以你需要写成 `<Fragment>` 的形式。

<Sandpack>

```js
import { Fragment } from 'react';

const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  return (
    <article>
      {poem.lines.map((line, i) =>
        <Fragment key={i}>
          {i > 0 && <hr />}
          <p>{line}</p>
        </Fragment>
      )}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

记住，采用 fragment 语法（通常写作 `<> </>`）来包裹 JSX 节点可以避免引入额外的 `<div>` 元素！

</Solution>

</Challenges>
