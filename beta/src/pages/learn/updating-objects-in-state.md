---
title: 更新 state 中的对象
---

<Intro>

state 中可以存放任意种类的 JavaScript 值，当然也包括对象。但是您不应该直接修改存放在 React 的 state 中的对象。取而代之的，当您想要更新一个对象时，您需要创建一个新的对象（或者依照当前对象复制出一份新的），然后把这个新的对象设置到 state 上。

</Intro>

<YouWillLearn>

- 如何正确地更新 React state 中的对象
- 如何在不产生 mutation 的情况下更新一个嵌套对象
- 什么事不可变性，以及如何不破坏它
- 如何使用 Immer 来减少对象重复复制的次数

</YouWillLearn>

## What's a mutation? {/*whats-a-mutation*/}

您可以在 state 中存放任何类型的 JavaScript 值。

```js
const [x, setX] = useState(0);
```

到目前为止，您已经尝试过在 state 中存放数组、字符串和布尔类型的值。这些类型的数据都是“不可变的”，意味着它们不能被改变，是只读的。您可以通过触发一次重渲染来改变他们的值：

```js
setX(5);
```

变量 `x` 的 state 从 `0` 变为 `5` ，但是*数字 `0` 本身*并没有发生改变。在JavaScript中，不可能对内置的原始值如数字、字符串和布尔值进行任何改变。

现在考虑一下 state 中存放对象时的情况：

```js
const [position, setPosition] = useState({ x: 0, y: 0 });
```

从技术上来说，是可以直接改变*对象本身*的内容的。**当您这样做时，就制造了一个 mutation。**

```js
position.x = 5;
```

然而，虽然 React state 中存放的对象从技术上来讲是可变的，您应该像对待数字、布尔值和字符串一样去对待它们，视它们为不可变的。您不应该直接修改它们，而是应该总是用新的状态去替换旧的状态。

## 将 state 视为只读的 {/*treat-state-as-read-only*/}

换句话说，您应该**把所有存放在 state 中的 JavaScript 对象都视为只读的**。

在下面的例子中，我们用一个存放在 state 中的对象来表示指针当前的位置。当您在预览区触摸或移动光标时，红色的点应该会移动。但是实际上红点仍停留在原处：

<Sandpack>

```js
import { useState } from 'react';
export default function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  return (
    <div
      onPointerMove={e => {
        position.x = e.clientX;
        position.y = e.clientY;
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}>
      <div style={{
        position: 'absolute',
        backgroundColor: 'red',
        borderRadius: '50%',
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: -10,
        top: -10,
        width: 20,
        height: 20,
      }} />
    </div>
  )
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```

</Sandpack>

问题出在下面这段代码中。

```js
onPointerMove={e => {
  position.x = e.clientX;
  position.y = e.clientY;
}}
```

这段代码直接修改了[上一次渲染中](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time)分配给 `position` 的对象。但是因为并没有使用 state 的 setting 函数，所以 React 并不知道对象已经改变了。所以 React 并没有做出任何回应。这就像您在吃完后之后才尝试去改变要点的菜一样。虽然在一些情况下，直接修改 state 可以正常工作，但是我们并不推荐这么做。您应该把在渲染过程中访问到的 state 视为只读的。

在这种情况下，为了真正地[触发渲染](/learn/state-as-a-snapshot#setting-state-triggers-renders)，**您需要创建一个*新*对象并把它传递给 state 的 setting 函数**

```js
onPointerMove={e => {
  setPosition({
    x: e.clientX,
    y: e.clientY
  });
}}
```

通过使用 `setPosition` ，您在告诉 React：

* 使用这个新的对象替代 `position` 的值
* 再次渲染这个组件

现在您可以看到，当您在预览区触摸或移动光标时，红点会跟随着您的指针移动：

<Sandpack>

```js
import { useState } from 'react';
export default function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  return (
    <div
      onPointerMove={e => {
        setPosition({
          x: e.clientX,
          y: e.clientY
        });
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}>
      <div style={{
        position: 'absolute',
        backgroundColor: 'red',
        borderRadius: '50%',
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: -10,
        top: -10,
        width: 20,
        height: 20,
      }} />
    </div>
  )
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```

</Sandpack>

<DeepDive title="Local mutation is fine">

下面这样的代码会产生一些问题，因为它改变的是 state 中*存在*的对象：

```js
position.x = e.clientX;
position.y = e.clientY;
```

但是下面的代码就**没有任何问题**，因为您改变的是您刚刚创建的一个新的对象：

```js
const nextPosition = {};
nextPosition.x = e.clientX;
nextPosition.y = e.clientY;
setPosition(nextPosition);
````

事实上，它完全等同于下面这种写法：

```js
setPosition({
  x: e.clientX,
  y: e.clientY
});
```

当您尝试改变 state 中已经存在的对象时，mutation 是唯一的问题。而修改一个您刚刚创建的对象就不会出现任何问题，因为*还没有其他的代码在引用它*。改变它并不会意外地影响到依赖它的东西。这叫做“局部 mutation ”。您甚至可以[在渲染的过程中](/learn/keeping-components-pure#local-mutation-your-components-little-secret)进行“局部 mutation”的操作。这种操作既便捷又没有任何问题！

</DeepDive>  

## 使用展开语法来复制对象 {/*copying-objects-with-the-spread-syntax*/}

在之前的例子中，`position` 对象总是会依据指针的位置创建一个全新的对象。但是更多的时候，我们希望创建的新对象中仍然包含之前的一部分数据。例如，您可能只想要更新表单中的*一个*字段，其他的字段仍然使用之前的值。

下面的代码中，输入框并不会正常工作，因为 `onChange` 直接修改了 state ：

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
    person.firstName = e.target.value;
  }

  function handleLastNameChange(e) {
    person.lastName = e.target.value;
  }

  function handleEmailChange(e) {
    person.email = e.target.value;
  }

  return (
    <>
      <label>
        First name:
        <input
          value={person.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
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

例如，下面这行代码修改了上一次渲染中的 state ：

```js
person.firstName = e.target.value;
```

想要实现您的需求，最可靠的办法就是创建一个新的对象并将它传递给 `setPerson` 。但是在这里，您也想要**把当前的数据复制到新对象中**，因为您只改变了其中一个字段：

```js
setPerson({
  firstName: e.target.value, // 输入的新的 first name
  lastName: person.lastName,
  email: person.email
});
```

您可以使用 `...` [对象展开](a-javascript-refresher#object-spread)语法，这样您就不需要把每个属性单独复制一次了。

```js
setPerson({
  ...person, // Copy the old fields
  firstName: e.target.value // But override this one
});
```

现在表单可以正常工作了！

您可以看到，对于每一个输入框您并没有单独声明一个 state 。对于数据量大的表单，将所有的数据都存放在同一个对象中是非常方便的 —— 前提是您能够正确地更新它！

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
        First name:
        <input
          value={person.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
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

请注意 `...` 展开语法是浅拷贝的，它只会复制一层。虽然它的语法更为简洁，但是这也意味着当您想要更新一个嵌套属性的值时，您可能不得不在每一层都使用一次展开语法来达到目的。

<DeepDive title="使用一个事件处理函数来更新多个字段">

您也可以在对象的定义中使用 `[` 和 `]` 括号来实现属性的动态命名。下面是一个例子，它使用了一个事件处理函数而不是三个：

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleChange(e) {
    setPerson({
      ...person,
      [e.target.name]: e.target.value
    });
  }

  return (
    <>
      <label>
        First name:
        <input
          name="firstName"
          value={person.firstName}
          onChange={handleChange}
        />
      </label>
      <label>
        Last name:
        <input
          name="lastName"
          value={person.lastName}
          onChange={handleChange}
        />
      </label>
      <label>
        Email:
        <input
          name="email"
          value={person.email}
          onChange={handleChange}
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

在这里， `e.target.name` 指的是 `<input>` 这个 DOM 元素的 `name` 属性。

</DeepDive>

## 更新一个嵌套对象 {/*updating-a-nested-object*/}

考虑下面这种结构的嵌套对象：

```js
const [person, setPerson] = useState({
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg',
  }
});
```

如果您想要更新 `person.artwork.city` 的值，如何用 mutation 的方法来实现非常清晰：

```js
person.artwork.city = 'New Delhi';
```

但是在 React 中，您需要将 state 视为不可变的！为了修改 `city` 的值，您首先需要创建一个新的 `artwork` 对象（其中预先填充了之前的数据），然后创建一个新的 `person` 对象，并使得其中的 `artwork` 属性指向新创建的 `artwork` 对象：

```js
const nextArtwork = { ...person.artwork, city: 'New Delhi' };
const nextPerson = { ...person, artwork: nextArtwork };
setPerson(nextPerson);
```

或者，使用一个函数来完成这一切操作

Or, written as a single function call:

```js
setPerson({
  ...person, // 复制其他字段的数据
  artwork: { // 替换 artwork 字段
    ...person.artwork, // 复制之前 person.artwork 中的数据
    city: 'New Delhi' // 但是将 city 的值替换为 New Delhi！
  }
});
```

这虽然看起来有点冗长，但对于很多情况都能有效地解决问题：

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

<DeepDive title="Objects are not really nested">

下面这个对象从代码上来看是“嵌套”的：

```js
let obj = {
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg',
  }
};
```

然而，当我们思考对象的行为时，“嵌套”并不是一个非常准确的方式。当这段代码运行的时候，并没有什么“嵌套”的对象。您实际上会看到两个不同的对象：

```js
let obj1 = {
  title: 'Blue Nana',
  city: 'Hamburg',
  image: 'https://i.imgur.com/Sd1AgUOm.jpg',
};

let obj2 = {
  name: 'Niki de Saint Phalle',
  artwork: obj1
};
```

`obj1` 这个对象并不存放在 `obj2` 这个对象中。例如，下面的代码中，`obj3` 这个对象中的属性也可以指向 `obj1` 这个对象：

```js
let obj1 = {
  title: 'Blue Nana',
  city: 'Hamburg',
  image: 'https://i.imgur.com/Sd1AgUOm.jpg',
};

let obj2 = {
  name: 'Niki de Saint Phalle',
  artwork: obj1
};

let obj3 = {
  name: 'Copycat',
  artwork: obj1
};
```

如果您直接修改 `obj3.artwork.city` ，它会同时影响到 `obj2.artwork.city` 和 `obj1.city` 。这是因为 `obj3.artwork` 、 `obj2.artwork` 和 `obj1.city` 都指向同一个对象。当您用“嵌套”的方式去思考对象的时候，很难看出这一点。取而代之的，它们是相互独立的对象，只不过其中的某个属性的值指向了另外一个对象。

</DeepDive>  

### 使用 Immer 写出简洁的更新逻辑 {/*write-concise-update-logic-with-immer*/}

如果您的 state 有多层的嵌套，您获取应该考虑[使它扁平一些](/learn/choosing-the-state-structure#avoid-deeply-nested-state)。但是，如果您不想改变 state 的数据结构，您也可以采取一个更简单的方法。[Immer](https://github.com/immerjs/use-immer) 是一个非常流行的库，它使得您可以使用简便的直接修改的语法，并会帮您处理好复制的过程。通过使用 Immer ，您写出的代码看起来似乎是“打破了规则”并直接修改了对象：

```js
updatePerson(draft => {
  draft.artwork.city = 'Lagos';
});
```

但是不同于一般的 mutation ，它并不会覆盖之前的 state ！

<DeepDive title="How does Immer work?">

`draft` 是 Immer 提供的一种特殊的对象，被称为[代理](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)，他会记录您的操作。这就是您能够自由自在地直接修改对象的原因所在！本质上说， Immer 知道了 `draft` 对象哪些部分被改变了，并会依照您的修改创建出一个全新的对象。

</DeepDive>

使用 Immer 的步骤：

1. 在 `package.json` 添加 `use-immer` 这个依赖
2. 运行 `npm install`
3. 用 `import { useImmer } from 'use-immer'` 替换掉 `import { useState } from 'react'`

下面我们把上面的例子用 Immer 实现一下：

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

可以看到，事件处理函数变得更简洁了。只要您想，您可以在一个组件中同时使用 `useState` and `useImmer`。当您想要写出更简洁的处理函数时， Immer 会是一个不错的选择，尤其是当您的 state 中有嵌套，复制对象会引发大量重复的代码时。

<DeepDive title="为什么在 React 中不推荐直接修改 state">

有以下几个原因：

* **调试：** 如果您使用 `console.log` 调试，并且没有直接修改 state，您之前 log 中的 state 的值不会被新的 state 的值影响。因此您可以清楚地看到两次渲染之间 state 的值发生了什么变化。
* **优化：** React 最基本的优化策略依赖于，如果先前一次的 prop 或者 state 的值和下一次相同就会跳过渲染。如果您从未直接修改 state ，查看 state 发生了哪些变化就会变得非常容易。如果 `prevObj === obj` ，那么可以肯定的是这个对象并没有发生改变。
* **新特性：** 我们正在构建的 React 的新特性依赖于 state 被[视为类似于快照](/learn/state-as-a-snapshot)的理念。如果您直接修改 state ，可能会影响您使用这些新特性。
* **需求变更：** 一些应用的特性，需要实现撤销/重做的功能，展示修改的历史，或是实现用户可以回滚到某个特定历史值的功能。如果没有直接修改 state ，这一切都会变得十分容易。因为您可以把 state 的历史记录复制到内存中，并在适当的时候再次使用它。如果您一开始就用了直接修改 state 的方式，那么后面要实现这样的功能就会变得非常困难。
* **更简单的实现** 因为 React 并不依赖于 mutation ，所以您不需要额外对对象进行任何操作。它不需要劫持对象的属性、用代理的方式包裹对象或者做一些其他“响应式”的解决方案需要做的事。这是因为 React 允许您把任何对象存放在 state 中，不管对象有多么巨大，都不会有任何额外的性能问题和正确性的陷阱。

在练习中，您经常可以“侥幸”使用直接修改 state 的方式而不会报错，但是我们强烈建议您不要这样做，以便您可以使用以这种方法开发的新 React 功能。未来的贡献者甚至是您自己在未来也会感谢自己这样做了的！

</DeepDive>

<Recap>

* 在 React 中，将所有 state 都视为不可直接修改的
* 当你在 state 中存放对象时，直接修改对象并不会触发重渲染，并且还会改变前一次渲染的“快照”中的值。
* 不要直接修改对象，而要创建一个*新的*对象，并通过 state 的 setting 函数来出发重渲染。
* 你可以使用类似 `{...obj, something: 'newValue'}` 这种对象展开语法来创建对象的拷贝。
* 展开语法是浅拷贝的：它只会复制一层
* 想要更新嵌套对象，你需要从需要更新的位置开始自底向上为每一层都创建新的拷贝。
* 想要减少重复的拷贝代码，可以使用 Immer 。

</Recap>



<Challenges>

### 修复错误的 state 更新代码 {/*fix-incorrect-state-updates*/}

下面的表单是有问题的。试着点击几次增加分数的按钮。你会注意到分数并没有增加。然后试着修改一下 first name 字段，你会注意到分数的值“突然”发生了变化。最后，试着修改一下 last name 字段，你会发现分数完全消失了。

你的任务就是修复这些问题。当你修复他们之后，解释一下每个问题产生的原因。

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [player, setPlayer] = useState({
    firstName: 'Ranjani',
    lastName: 'Shettar',
    score: 10,
  });

  function handlePlusClick() {
    player.score++;
  }

  function handleFirstNameChange(e) {
    setPlayer({
      ...player,
      firstName: e.target.value,
    });
  }

  function handleLastNameChange(e) {
    setPlayer({
      lastName: e.target.value
    });
  }

  return (
    <>
      <label>
        Score: <b>{player.score}</b>
        {' '}
        <button onClick={handlePlusClick}>
          +1
        </button>
      </label>
      <label>
        First name:
        <input
          value={player.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={player.lastName}
          onChange={handleLastNameChange}
        />
      </label>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 10px; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

<Solution>

下面是两个问题都得到修复后的代码：

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [player, setPlayer] = useState({
    firstName: 'Ranjani',
    lastName: 'Shettar',
    score: 10,
  });

  function handlePlusClick() {
    setPlayer({
      ...player,
      score: player.score + 1,
    });
  }

  function handleFirstNameChange(e) {
    setPlayer({
      ...player,
      firstName: e.target.value,
    });
  }

  function handleLastNameChange(e) {
    setPlayer({
      ...player,
      lastName: e.target.value
    });
  }

  return (
    <>
      <label>
        Score: <b>{player.score}</b>
        {' '}
        <button onClick={handlePlusClick}>
          +1
        </button>
      </label>
      <label>
        First name:
        <input
          value={player.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={player.lastName}
          onChange={handleLastNameChange}
        />
      </label>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

代码中 `handlePlusClick` 函数的问题在于它直接修改了 `player` 对象。这就造成了 React 并不知道需要重渲染，也就没有更新屏幕上分数的值。因此，当你修改 first name 字段的时候，state 发生了更新，触发了重渲染，*同时也*更新了屏幕上分数显示的值。

代码中 `handleLastNameChange` 的问题在于它没有把 `...player` 中已经包含的属性复制到新的对象中。因此，当你编辑 last name 字段时，分数的值就丢失了。

</Solution>

### 发现并修复 mutation {/*find-and-fix-the-mutation*/}

在静止的背景上有一个可以拖动的方形。你可以使用下拉框来修改方形的颜色。

但是这里有个问题。当你先移动了方形，再去修改它的颜色时，背景会突然“跳”到方形所在的位置（实际上背景的位置并不应该发生变化！）。但是这并不是我们想要的，背景的 `position` 属性被设置为 `initialPosition` ，也就是 `{ x: 0, y: 0 }` 。为什么当修改颜色时，背景会移动呢？

找到问题所在并修复它。

<Hint>

If something unexpected changes, there is a mutation. Find the mutation in `App.js` and fix it.

</Hint>

<Sandpack>

```js App.js
import { useState } from 'react';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    shape.position.x += dx;
    shape.position.y += dy;
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Drag me!
      </Box>
    </>
  );
}
```

```js Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
```

</Sandpack>

<Solution>

问题出在 `handleMove` 中的 mutation 。它直接修改了 `shape.position` ，但是此时 `initialPosition` 所指向的也是同一个对象。因此方形和背景都发生了移动。（因为是 mutation ，所以变化并没有立即反映到屏幕上，而是等到最近一次相关的更新，也就是颜色变化，才触发了一次重渲染。）

修复问题的方法就是从 `handleMove` 中移除这个 mutation ，然后用展开运算符来复制方形对象。请注意 `+=` 是 mutation 的一种，所以你需要用正常的 “+” 来重写。

<Sandpack>

```js App.js
import { useState } from 'react';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    setShape({
      ...shape,
      position: {
        x: shape.position.x + dx,
        y: shape.position.y + dy,
      }
    });
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Drag me!
      </Box>
    </>
  );
}
```

```js Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
```

</Sandpack>

</Solution>

### 使用 Immer 更新对象 {/*update-an-object-with-immer*/}

这里的例子和上面那段有问题的代码是相同的。这次，试着用 Immer 来修复 mutation 的问题。为了你的便捷，`useImmer` 已经被引入了，因此你只需要修改 `shape` 这个 state 来使用它。

<Sandpack>

```js App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    shape.position.x += dx;
    shape.position.y += dy;
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Drag me!
      </Box>
    </>
  );
}
```

```js Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
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

<Solution>

下面的代码是使用 Immer 重写的。请注意代码中的事件处理函数仍然是以直接修改对象的方式书写的，但是代码不会产生任何问题了。这是因为从本质上来说，Immer 从来没有直接修改现有的对象。

<Sandpack>

```js App.js
import { useImmer } from 'use-immer';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, updateShape] = useImmer({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    updateShape(draft => {
      draft.position.x += dx;
      draft.position.y += dy;
    });
  }

  function handleColorChange(e) {
    updateShape(draft => {
      draft.color = e.target.value;
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Drag me!
      </Box>
    </>
  );
}
```

```js Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
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

</Solution>

</Challenges>