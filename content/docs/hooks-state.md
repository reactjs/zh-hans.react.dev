---
id: hooks-state
title: 使用 State Hook
permalink: docs/hooks-state.html
next: hooks-effect.html
prev: hooks-overview.html
---

> Try the new React documentation.
> 
> These new documentation pages teach modern React and include live examples:
>
> - [State: A Component's Memory](https://beta.reactjs.org/learn/state-a-components-memory)
> - [`useState`](https://beta.reactjs.org/reference/react/useState)
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

*Hook* 是 React 16.8 的新增特性。它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性。

[Hook 简介章节](/docs/hooks-intro.html)中使用下面的例子介绍了 Hook：

```js{4-5}
import React, { useState } from 'react';

function Example() {
  // 声明一个叫 "count" 的 state 变量
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

我们将通过将这段代码与一个等价的 class 示例进行比较来开始学习 Hook。

## 等价的 class 示例 {#equivalent-class-example}

如果你之前在 React 中使用过 class，这段代码看起来应该很熟悉：

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

state 初始值为 `{ count: 0 }` ，当用户点击按钮后，我们通过调用 `this.setState()` 来增加 `state.count`。整个章节中都将使用该 class 的代码片段做示例。

>注意
>
>你可能想知道为什么我们在这里使用一个计数器例子而不是一个更实际的示例。因为我们还只是初步接触 Hook ，这可以帮助我们将注意力集中到 API 本身。

## Hook 和函数组件 {#hooks-and-function-components}

复习一下， React 的函数组件是这样的：

```js
const Example = (props) => {
  // 你可以在这使用 Hook
  return <div />;
}
```

或是这样：

```js
function Example(props) {
  // 你可以在这使用 Hook
  return <div />;
}
```

你之前可能把它们叫做“无状态组件”。但现在我们为它们引入了使用 React state 的能力，所以我们更喜欢叫它"函数组件"。

Hook 在 class 内部是**不**起作用的。但你可以使用它们来取代 class 。

## Hook 是什么？ {#whats-a-hook}

在新示例中，首先引入 React 中 `useState` 的 Hook

```js{1}
import React, { useState } from 'react';

function Example() {
  // ...
}
```

**Hook 是什么？** Hook 是一个特殊的函数，它可以让你“钩入” React 的特性。例如，`useState` 是允许你在 React 函数组件中添加 state 的 Hook。稍后我们将学习其他 Hook。

**什么时候我会用 Hook？** 如果你在编写函数组件并意识到需要向其添加一些 state，以前的做法是必须将其转化为 class。现在你可以在现有的函数组件中使用 Hook。

>注意：
>
>在组件中有些特殊的规则，规定什么地方能使用 Hook，什么地方不能使用。我们将在 [Hook 规则](/docs/hooks-rules.html)中学习它们。

## 声明 State 变量  {#declaring-a-state-variable}

在 class 中，我们通过在构造函数中设置 `this.state` 为 `{ count: 0 }` 来初始化 `count` state 为 `0`：

```js{4-6}
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }
```

在函数组件中，我们没有 `this`，所以我们不能分配或读取 `this.state`。我们直接在组件中调用 `useState` Hook：

```js{4,5}
import React, { useState } from 'react';

function Example() {
  // 声明一个叫 “count” 的 state 变量
  const [count, setCount] = useState(0);
```

**`调用 useState` 方法的时候做了什么?** 它定义一个 “state 变量”。我们的变量叫 `count`， 但是我们可以叫他任何名字，比如 `banana`。这是一种在函数调用时保存变量的方式 —— `useState` 是一种新方法，它与 class 里面的 `this.state` 提供的功能完全相同。一般来说，在函数退出后变量就会"消失"，而 state 中的变量会被 React 保留。

**`useState` 需要哪些参数？** `useState()` 方法里面唯一的参数就是初始 state。不同于 class 的是，我们可以按照需要使用数字或字符串对其进行赋值，而不一定是对象。在示例中，只需使用数字来记录用户点击次数，所以我们传了 `0` 作为变量的初始 state。（如果我们想要在 state 中存储两个不同的变量，只需调用 `useState()` 两次即可。）

**`useState` 方法的返回值是什么？** 返回值为：当前 state 以及更新 state 的函数。这就是我们写 `const [count, setCount] = useState()` 的原因。这与 class 里面 `this.state.count` 和 `this.setState` 类似，唯一区别就是你需要成对的获取它们。如果你不熟悉我们使用的语法，我们会在[本章节的底部](/docs/hooks-state.html#tip-what-do-square-brackets-mean)介绍它。

既然我们知道了 `useState` 的作用，我们的示例应该更容易理解了：

```js{4,5}
import React, { useState } from 'react';

function Example() {
  // 声明一个叫 "count" 的 state 变量
  const [count, setCount] = useState(0);
```

我们声明了一个叫 `count` 的 state 变量，然后把它设为 `0`。React 会在重复渲染时记住它当前的值，并且提供最新的值给我们的函数。我们可以通过调用 `setCount` 来更新当前的 `count`。

>注意
>
>你可能想知道：为什么叫 `useState` 而不叫 `createState`?
>
>"Create" 可能不是很准确，因为 state 只在组件首次渲染的时候被创建。在下一次重新渲染时，`useState` 返回给我们当前的 state。否则它就不是 “state”了！这也是 Hook 的名字*总是*以 `use` 开头的一个原因。我们将在后面的 [Hook 规则](/docs/hooks-rules.html)中了解原因。

## 读取 State {#reading-state}

当我们想在 class 中显示当前的 count，我们读取 `this.state.count`：

```js
  <p>You clicked {this.state.count} times</p>
```

在函数中，我们可以直接用 `count`:


```js
  <p>You clicked {count} times</p>
```

## 更新 State {#updating-state}

在 class 中，我们需要调用 `this.setState()` 来更新 `count` 值：

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

## 总结 {#recap}

现在让我们来**仔细回顾一下学到的知识**，看下我们是否真正理解了。

<!--
  I'm not proud of this line markup. Please somebody fix this.
  But if GitHub got away with it for years we can cheat.
-->
```js{1,4,9}
 1:  import React, { useState } from 'react';
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

* **第一行:** 引入 React 中的 `useState` Hook。它让我们在函数组件中存储内部 state。
* **第四行:** 在 `Example` 组件内部，我们通过调用 `useState` Hook 声明了一个新的 state 变量。它返回一对值给到我们命名的变量上。我们把变量命名为 `count`，因为它存储的是点击次数。我们通过传 `0` 作为 `useState` 唯一的参数来将其初始化为 `0`。第二个返回的值本身就是一个函数。它让我们可以更新 `count` 的值，所以我们叫它 `setCount`。
* **第九行:** 当用户点击按钮后，我们传递一个新的值给 `setCount`。React 会重新渲染 `Example` 组件，并把最新的 `count` 传给它。

乍一看这似乎有点太多了。不要急于求成！如果你有不理解的地方，请再次查看以上代码并从头到尾阅读。我们保证一旦你试着"忘记" class 里面 state 是如何工作的，并用新的眼光看这段代码，就容易理解了。 

### 提示：方括号有什么用？ {#tip-what-do-square-brackets-mean}

你可能注意到我们用方括号定义了一个 state 变量

```js
  const [count, setCount] = useState(0);
```

等号左边名字并不是 React API 的部分，你可以自己取名字：

```js
  const [fruit, setFruit] = useState('banana');
```

这种 JavaScript 语法叫[数组解构](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Array_destructuring)。它意味着我们同时创建了 `fruit` 和 `setFruit` 两个变量，`fruit` 的值为 `useState` 返回的第一个值，`setFruit` 是返回的第二个值。它等价于下面的代码：

```js
  var fruitStateVariable = useState('banana'); // 返回一个有两个元素的数组
  var fruit = fruitStateVariable[0]; // 数组里的第一个值
  var setFruit = fruitStateVariable[1]; // 数组里的第二个值
```

当我们使用 `useState` 定义 state 变量时候，它返回一个有两个值的数组。第一个值是当前的 state，第二个值是更新 state 的函数。使用 `[0]` 和 `[1]` 来访问有点令人困惑，因为它们有特定的含义。这就是我们使用数组解构的原因。

>注意
>
>你可能会好奇 React 怎么知道 `useState` 对应的是哪个组件，因为我们并没有传递 `this` 给 React。我们将在 FAQ 部分回答[这个问题](/docs/hooks-faq.html#how-does-react-associate-hook-calls-with-components)以及许多其他问题。

### 提示：使用多个 state 变量 {#tip-using-multiple-state-variables}

将 state 变量声明为一对 `[something, setSomething]` 也很方便，因为如果我们想使用多个 state 变量，它允许我们给不同的 state 变量取不同的名称：

```js
function ExampleWithManyStates() {
  // 声明多个 state 变量
  const [age, setAge] = useState(42);
  const [fruit, setFruit] = useState('banana');
  const [todos, setTodos] = useState([{ text: '学习 Hook' }]);
```

在以上组件中，我们有局部变量 `age`，`fruit` 和 `todos`，并且我们可以单独更新它们：

```js
  function handleOrangeClick() {
    // 和 this.setState({ fruit: 'orange' }) 类似
    setFruit('orange');
  }
```

你**不必**使用多个 state 变量。State 变量可以很好地存储对象和数组，因此，你仍然可以将相关数据分为一组。然而，不像 class 中的 `this.setState`，更新 state 变量总是*替换*它而不是合并它。

我们[在 FAQ 中](/docs/hooks-faq.html#should-i-use-one-or-many-state-variables)提供了更多关于分离独立 state 变量的建议。

## 下一步 {#next-steps}

从上述内容中，我们了解了 React 提供的 `useState` Hook，有时候我们也叫它 “State Hook”。它让我们在 React 函数组件上添加内部 state —— 这是我们首次尝试。

我们还学到了一些知识比如什么是 Hook。Hook 是能让你在函数组件中“钩入” React 特性的函数。它们名字通常都以 `use` 开始，还有更多 Hook 等着我们去探索。

**现在我们将[学习另一个 Hook: `useEffect`](/docs/hooks-effect.html)。** 它能在函数组件中执行副作用，并且它与 class 中的生命周期函数极为类似。
