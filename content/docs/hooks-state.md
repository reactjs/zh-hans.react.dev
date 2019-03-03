---
id: hooks-state
title: 使用State Hook
permalink: docs/hooks-state.html
next: hooks-effect.html
prev: hooks-overview.html
---

*Hooks*是在React 16.8中新增的能力。他让你可以使用state或者其他React的功能而不需要写一个class。

[上一个页面](/docs/hooks-intro.html)中使用下面的例子介绍了Hooks:

```js{4-5}
import React, { useState } from 'react';

function Example() {
  // Declare a new state variable, which we'll call "count"
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

我们通过对比这段代码和等同的class代码来学习Hooks

## 等同的class代码 {#equivalent-class-example}

如果你之前在React中使用过class，这段代码应该非常眼熟

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

这里状态从`{ count: 0 }`开始，当一个用户点击按钮之后，我们会通过`this.setState()`增加`state.count`。整个页面我们都会使用这段代码。

> 注意
>
> 你可能会疑惑为什么我们在这里使用一个计数器，而不是更实际的例子。这么做是为了帮助我们在刚接触Hooks的时候更专注于API本身

## Hooks和 方法组件 {#hooks-and-function-components}

稍作提醒，React中的方法组件看起来是这样的：

```js
const Example = (props) => {
  // You can use Hooks here!
  return <div />;
}
```

或者这样的:

```js
function Example(props) {
  // You can use Hooks here!
  return <div />;
}
```

之前你或许了解这些为"无状态组件"。我们现在介绍了在这些组件中使用React state的能力，所以我们更偏向于叫他"方法组件"

Hooks**不能**在class里面使用。但是你可以用他们来代替class

## 什么是Hooks？ {#whats-a-hook}

我们的例子开始于从React中引入`useState`

```js{1}
import React, { useState } from 'react';

function Example() {
  // ...
}
```

**什么是Hooks？**一个Hook是一个能够让你连接React功能的特殊的方法。举个例子，`useState`是一个能够让你的方法组件使用React state的Hook。我们会在后续学习其他Hooks

**什么时候我会使用Hook？**如果你写了一个方法组件然后发现你需要为其增加一些状态，以前你需要将他转化成一个class。现在你可以直接在你现有的方法组件中使用Hook。我们现在要做的就是这个！

>注意：
>
>在组件中使用Hooks的时候会存在一些特殊的你可以或者不可以使用的规则。我们会在[Hooks的规则](/docs/hooks-rules.html)中学习他们。

## 声明一个State变量 {#declaring-a-state-variable}

在class中，我们通过在构造函数中设置`this.state`为`{ count: 0 }`初始化`count`为`0`：

```js{4-6}
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }
```

在一个方法组件中，我们没有`this`，所以我们不能修改或者读取`this.state`。相对的，我们在组件中直接调用`useState` Hook：

```js{4,5}
import React, { useState } from 'react';

function Example() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);
```

**调用`useState`的时候做了什么？**他声明了一个"state变量"。我们的变量叫做`count`但是我们可以叫他任何名字，比如`banana`。这是在方法调用中"保存"一些值的方法 -- `useState`是一种新的能够为我们提供跟class中的`this.state`具有相同能力的方法。一般来说变量在方法执行完之后就"消失"了，但是state会被React保留。

**我们传递给`useState`的参数是什么？**`useState`的唯一参数是初始值。跟class不同，state不一定必须是一个对象。如果需要我们可以保存一个数字或者一个字符串。在我们的例子中，我们只需要一个数字来表示用户点击来多少次，所以传递`0`作为变量的初始值。（如果我们想要保存两个不同的值作为state，我们可以调用两次`useState`。）

**`useState`返回什么？**他返回一对值：当前的状态和一个用来更新这个状态的方法。这也是为什么我们需要写`const [count, setCount] = useState()`的原因。除了你以一对值的方式获取他们之外，这跟class中的`this.state.count`和`this.setState`很像。如果你不熟悉我们使用的语法，我们会在[页面的最底部](/docs/hooks-state.html#tip-what-do-square-brackets-mean)讲到他。

现在我们知道`useState`做了什么，我们的例子需要变得更有意义：

```js{4,5}
import React, { useState } from 'react';

function Example() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);
```

我们声明了一个叫做`count`的变量，并且设置他为`0`。React在重新渲染的过程中会记住他当前值，并且提供最近一次更新的内容。如果我们想要更新当前的`count`，我们可以调用`setCount`。

>注意
>
>你可能会疑惑：为什么`useState`不叫`createState`？
>
>"Create"并不那么准确因为state只有在第一次渲染我们的组件的时候才被创建。在下一次渲染，`useState`返回当前的state。不然他就不是"state"了。另外还有一个原因为什么Hook的名字总是以`use`开头。我们可以在后面[Hoos的规则](/docs/hooks-rules.html)中了解它。

## 读取State {#reading-state}

当我们想要在class中展示当前的count变量，我们需要读取`this.state.count`：

```js
  <p>You clicked {this.state.count} times</p>
```

在方法中，我们可以直接使用`count`：


```js
  <p>You clicked {count} times</p>
```

## 更新State {#updating-state}

在class中，我们需要调用`this.setState()`来更新`count`：

```js{1}
  <button onClick={() => this.setState({ count: this.state.count + 1 })}>
    Click me
  </button>
```

在方法中，我们已经有了`setCount`和`count`作为变量所以我们不需要`this`：

```js{1}
  <button onClick={() => setCount(count + 1)}>
    Click me
  </button>
```

## 概括 {#recap}

现在我们来**一行行概括一下我们刚才学习的内容**来检查我们是否真的理解。

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

* **第一行：**我们从React中引入`useState` Hook。他让我们在方法组件中保存私有状态。
* **第四行：**在`Example`组件中，我们通过调用`useState` Hook来声明一个新的state变量。他返回一对值，我们可以为其命名。我们叫我们的变量为`count`因为他记录按钮点击的次数。我们通过给`useState`传递唯一一个参数`0`来初始化他。第二个返回的值是一个方法。他能够让我们更新`count`所以我们叫他`setCount`。
* **第九行：**当用户点击按钮，我们调用`setCount`并传递一个新的值。React会重新渲染`Example`组件，并传递新的`count`值给他。

在一开始好像需要学习的内容有点多。不要着急！如果对文章解释的内容感到困惑，在看一下上面的代码并且尝试从上往下阅读。我们保证一旦你尝试"忘记"在class中state是如何工作的，然后重新看这些代码，他的意义就很明显了。

### 提示：方括号是什么意思？ {#tip-what-do-square-brackets-mean}

在我们声明一个新的state变量的时候你可能已经注意到了方括号：

```js
  const [count, setCount] = useState(0);
```

左边的变量名称并不是React API的一部分。你可以按照你的想法命名你的state变量：

```js
  const [fruit, setFruit] = useState('banana');
```

这个JavaScript语法叫做["数组解构"](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Array_destructuring)。他的意思是我们正在声明两个新的变量`fruit`和`setFruit`，`fruit`是`useState`返回的内容中的第一个值，而`setFruit`是第二个。他跟下面的代码是等同的：

```js
  var fruitStateVariable = useState('banana'); // 返回一对值
  var fruit = fruitStateVariable[0]; // 这对值中的第一个
  var setFruit = fruitStateVariable[1]; // 这对值中的第二个
```

当我们使用`useState`声明一个state变量的时候，他返回一对 -- 一个有两个节点的数组。第一个节点是当前的值，第二个是一个让我们更新第一个值的方法。使用`[0]`和`[1]`来调用他们有一点令人困惑的因为他们是有特定的含义的。这就是我们使用用数组解构的原因。

>注意
>
>你可能好奇React怎么知道`useState`对应的是哪个组件，毕竟我们没有传递任何像是`this`的内容给React。我们会在FAQ中回答[这个问题](/docs/hooks-faq.html#how-does-react-associate-hook-calls-with-components)和其他问题。

### 提示：使用多个State变量 {#tip-using-multiple-state-variables}

使用`[something, setSomething]`这样的值对来声明多个state变量同样方便，因为他让我们给不同的state变量不同的变量名：

```js
function ExampleWithManyStates() {
  // Declare multiple state variables!
  const [age, setAge] = useState(42);
  const [fruit, setFruit] = useState('banana');
  const [todos, setTodos] = useState([{ text: 'Learn Hooks' }]);
```

在上面的组件中，我们有`age`，`fruit`，和`todos`这些局部变量，并且我们可以分别对他们进行更新：

```js
  function handleOrangeClick() {
    // Similar to this.setState({ fruit: 'orange' })
    setFruit('orange');
  }
```

你**不需要**使用很多state变量。state变量可以保存对象或者数组，所以你可以把相关的数据放在一起。然而，不像class中的`this.setState`，更新一个state变量总是*替换*他而不是合并他。

我们[在FAQ中](/docs/hooks-faq.html#should-i-use-one-or-many-state-variables)提供了更多的的分割无关state变量的建议。

## 下一步 {#next-steps}

在这个页面我们学习了React提供的Hooks中的一个，叫做`useState`。我们有时候也称之为"State Hook"。他让我们给方法组件增加本地状态 -- 这是我们第一次成功这么做！

我们同时也了解了一点什么是Hooks。Hooks是帮助我们为方法组件连接React功能的。他们的名字总是以`use`开头，我们还有很多Hooks没有见识过。

**现在让我们继续 [学习下一个Hook： `useEffect`](/docs/hooks-effect.html)。**他帮助我们在组件中执行副作用，等同于类组件中的生命周期方法。
