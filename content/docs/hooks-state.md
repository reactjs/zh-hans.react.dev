---
id: hooks-state
title: Using the State Hook
permalink: docs/hooks-state.html
next: hooks-effect.html
prev: hooks-overview.html
---

*Hooks* 是一个新功能提案，它让你不用写 class 也可以使用 state 和其他 React 特性。React v16.7.0-alpha 已经具备了 Hooks 功能，[开放 RFC ](https://github.com/reactjs/rfcs/pull/68).

[前几章](/docs/hooks-intro.html)我们已经用这个例子介绍过 Hooks:

```js{4-5}
import { useState } from 'react';

function Example() {
  // 声明一个新的状态变量：count
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

我们将通过对比上述代码和使用 class 实现相同功能的代码的方式来学习 Hooks。 

## 使用class实现相同功能的例子

如果你之前使用过 React 的 class,你可能会对下面的代码有似曾相识的感觉：

```js
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    );
  }
}
```

状态初始化 `{ count: 0 }`,当用户点击按钮后，`this.setState()`被调用来增加 `state.count`。我们在整个页面都会使用到这一段代码。

>注意
>
>你可能会想知道为什么我们要用一个计数器例子而不使用一个更加实际的应用。这是为了帮助我们关注 API 本身，因为我们还在迈出使用 Hooks 的第一步。


## Hooks 和函数式组件

复习一下， React 的函数组件是这个样子的：

```js
const Example = (props) => {
  // 你可以在这用Hooks
  return <div />;
}
```

或是这样：

```js
function Example(props) {
  // 你可以在这用Hooks
  return <div />;
}
```

你之前可能听过另一个概念"无状态组件"，我们现在介绍的是在"无状态组件"基础上使用 React 的 State ,所以我们更愿意叫他"函数组件"。

Hooks 在 class 内部是 **无效的**。但你可以在不写 class 情况下使用它。

## Hook是什么？

接下来我们介绍一个使用 React 里面的`useState`的例子：

```js{1}
import { useState } from 'react';

function Example() {
  // ...
}
```

**Hook是什么？** Hook 是一个特殊的函数，它可以让你接入到 React 的特性。例如， `useState` 是一个让你添加 React State 到函数组件的钩子。之后我们将学习其他的钩子函数。

**什么时候我会用到Hook？** 如果你正在写一个函数组件并且你想要把状态加入到组件里面，如果是以前的话你必须把函数转化成class的形式。现在你可以在现有的函数组件内部使用钩子函数。让我们立即行动！

>注意：
>
>这里有一些在组件内部能使用 Hooks 和不能使用 Hooks 的规则。详情请访问[Hooks使用规则](/docs/hooks-rules.html)。

## 声明一个状态变量

在下面 class 中，我们在构造函数中通过设置 `this.state` 为 `{ count: 0 }` 来初始化`count` 状态为 `0`：

```js{4-6}
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }
```

在函数组件内部，我们没有 `this`，所以我们不能读或写 `this.state`。我们直接在我们组件内部调用 `useState` 钩子函数：

```js{4,5}
import { useState } from 'react';

function Example() {
  // 声明一个新状态变量：count
  const [count, setCount] = useState(0);
```

** `useState` 方法做了哪些事情 ?** 它定义一个“状态变量”。我们命名它为 `count` ， 你也可以给它取其他的名字，像 `banana` 。这是一种在函数调用过程中保存值的方式 —— `useState` 是一种使用 class 里面的 `this.state` 的新方法。一般来说，在函数退出后变量就就会"消失"，但状态变量在函数退出后仍然会被 React 保存。

**我们应该传递给 `useState` 哪些参数？** `useState()` 方法里面唯一的参数就是初始状态。与 class 不一样，状态可以不是对象。如果我们只需要数字或字符串，我们就可以只存储字符串和数字。在我们例子中，我们只要一个数字记录用户点击次数，所以我们传了 `0` 作为我们状态的初始值。（如果想要存储两个不同的状态变量，只需调用 `useState()`两次即可。）


**`useState`方法的返回值是什么？** 它返回一组值：当前状态和一个更新状态的函数。这就是我们写 `const [count, setCount] = useState()` 的原因。
这和 class 里面的 `this.state.count` 和 `this.setState` 类似，不过你同时返回了两个。如果你们对我们使用的语法不熟悉，你可以在[底部](/docs/hooks-state.html#tip-what-do-square-brackets-mean)找到它。

既然我们知道了 `useState` 干了什么，我们的例子应该更加容易理解了：

```js{4,5}
import { useState } from 'react';

function Example() {
  // 声明状态变量：count
  const [count, setCount] = useState(0);
```

我们声明了 `count` 变量，然后把它设为 `0`。React 会在重新渲染的时候保存它当前的值，并且把最新的值传递给我们的函数。如果我想要更新当前的 `count`,我们可以调用 `setCount`。


>注意
>
>你可能好奇：为什么叫 `useState` 而不叫 `createState`?
>
>"Create"可能不是很准确，因为状态只在组件首次渲染的时候创建。在下一次重新渲染时，`useState` 返回给你当前的状态。否则状态就不会被"保持"了！这也是钩子函数*总是*以`use`开头的一个原因。我们也可以访问[Hooks规则](/docs/hooks-rules.html)了解这些。

## 读取状态

当我们在 class 中显示当前的 count，我们直接访问 `this.state.count`：

```js
  <p>You clicked {this.state.count} times</p>
```

在函数里面，我们可以直接用 `count`:

```js
  <p>You clicked {count} times</p>
```

## 更新状态

在 class 中，我们需要调用 `this.setState()` 来更新 `count` 状态：

```js{1}
  <button onClick={() => this.setState({ count: this.state.count + 1 })}>
    Click me
  </button>
```

在函数中，我们已经有了 `setCount` 和 `count` 变量，所以我们不需要 `this`:

```js{1}
  <button onClick={() => setCount(count + 1)}>
    Click me
  </button>
```

## 总结

现在我们可以**一行行过一下**代码，并且看下我们是否真正理解了。

<!--
  I'm not proud of this line markup. Please somebody fix this.
  But if GitHub got away with it for years we can cheat.
-->
```js{1,4,9}
 1:  import { useState } from 'react';
 2: 
 3:  function Example() {
 4:    const [count, setCount] = useState(0);
 5:
 6:    return (
 7:      <div>
 8:        <p>You clicked {count} times</p>
 9:        <button onClick={() => setCount(count + 1)}>
10:         Click me
11:        </button>
12:      </div>
13:    );
14:  }
```

* **第一行:** 引入 React 中的`useState` 钩子函数。它让我们在函数组件中存储内部状态。
* **第四行:** 在 `Example` 组件内部，我们调用 `useState` 钩子函数定义了一个新的状态变量。它返回一个数组给我们的变量。我们把变量命名为 `count`,因为它存储的是点击次数。我们通过传参数`0`给 `useState` 方法来把变量初始化为 `0`。第二个返回的值是一个函数。它让我们可以更新 `count` 的值,所以我们叫它 `setCount`。
* **第九行:** 当用户点击按钮后，我们传递一个新的值给 `setCount` 方法。React会重新渲染 `Example` 组件，并把最新的 `count` 传给它。


你可能感觉要理解的东西太多了。不要急于求成！如果你有不理解的地方，再看一遍上面的代码并且从头读到尾。我们保证只要你试着"忘记" class 里面 state 的工作原理，并且擦亮眼睛看下这段代码，就会有种豁然开朗的感觉。 

### 提示：方括号有什么用？

你可能注意到我们用方括号定义了一个状态变量

```js
  const [count, setCount] = useState(0);
```

等号左边名字并不是 React API 的部分，你可以自己取名字：

```js
  const [fruit, setFruit] = useState('banana');
```

这种 Javascript 语法叫[数组解构](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Array_destructuring)。它意味着我们同时创建了 `fruit` 和 `setFruit` 两个变量，
`fruit`值为 `useState` 返回的第一个值，`setFruit` 是返回的第二个。它等价于下面的代码：

```js
  var fruitStateVariable = useState('banana'); // 返回一个数组
  var fruit = fruitStateVariable[0]; // 数组里的第一个值
  var setFruit = fruitStateVariable[1]; // 数组里的第二个值
```

当我们使用 `useSatate` 定义变量时候，它返回有两个值的数组。第一个是当前的状态，第二个是更新状态的函数。使用 `[0]` 和 `[1]` 来访问它们会让人困惑，因为他们的含义不一样。这就是为什么我们使用数组析构的方式的原因。

>注意
>
>你可能会好奇React怎么知道是哪个组件的 `useState` ，因为我们并没有传递 `this` 给 React 。我们将在 FAQ 里面对[这些问题](/docs/hooks-faq.html#how-does-react-associate-hook-calls-with-components)及其他问题进行解答。

### 提示：使用多个状态变量

使用 `[something, setSomething]` 方式定义状态变量会很便捷，因为如果我们需要使用不止一个状态变量，我们可以使用不同的名字：

```js
function ExampleWithManyStates() {
  // 定义多个状态变量
  const [age, setAge] = useState(42);
  const [fruit, setFruit] = useState('banana');
  const [todos, setTodos] = useState([{ text: 'Learn Hooks' }]);
```
上面组件中，我们有 `age`,`fruit` 和 `todos` 局部变量，并且我们可以独立地更新它们：

```js
  function handleOrangeClick() {
    // 和 this.setState({ fruit: 'orange' }) 类似
    setFruit('orange');
  }
```

你 **不一定** 要使用多个状态变量。状态变量也可以存储对象和数组，所以你可以把有关联的数据组合起来。然而，不像在class内部`this.setState`，更新一个状态变量往往`替换`它而不是合并它。

关于分割独立的状态变量，我们在[FAQ](/docs/hooks-faq.html#should-i-use-one-or-many-state-variables)中提供了很多建议。

## 下一步
上述页面中，我们已经学到了React提供的一个叫 `useState` 钩子函数，有时候我们也叫它 `State Hook`。它让我们在React函数组件上添加局部状态，局部状态只需初始化一次就可一直使用。

我们也学到了一点点关于 Hooks 是什么的知识。Hooks 是能让你在函数组件中接入React特性的函数。它们名字都以 `use` 开始，还有很多 Hooks 等着我们去探索。


**接下来我们继续下一章[学习下一个Hook: `useEffect` .](/docs/hooks-effect.html)** 它让你了解到组件的副作用，并且它跟class里面的生命周期函数很类似。

