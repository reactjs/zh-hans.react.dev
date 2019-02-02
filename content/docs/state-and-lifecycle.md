---
id: state-and-lifecycle
title: State 和生命周期
permalink: docs/state-and-lifecycle.html
redirect_from:
  - "docs/interactivity-and-dynamic-uis.html"
prev: components-and-props.html
next: handling-events.html
---

本页面会介绍一个 React 组件中 state 和生命周期的概念。你可以在这查阅[详细的组件 API 参考文档](/docs/react-component.html)。

请参考[之前一节](/docs/rendering-elements.html#updating-the-rendered-element)中的 Ticking Clock 的例子。在[元素渲染](/docs/rendering-elements.html#rendering-an-element-into-the-dom)章节中，我们只了解了一种更新 UI 界面的方法。通过调用 `ReactDOM.render()` 来修改我们想要渲染的元素：

```js{8-11}
function tick() {
  const element = (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {new Date().toLocaleTimeString()}.</h2>
    </div>
  );
  ReactDOM.render(
    element,
    document.getElementById('root')
  );
}

setInterval(tick, 1000);
```

[**在 CodePen 中试试**](http://codepen.io/gaearon/pen/gwoJZk?editors=0010)

在本节中，我们将学习如何使真正的复用与封装 `Clock` 组件。它将设置自己的计时器并每秒更新一次。

我们可以从像这样封装 Clock 的外观显示开始：

```js{3-6,12}
function Clock(props) {
  return (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {props.date.toLocaleTimeString()}.</h2>
    </div>
  );
}

function tick() {
  ReactDOM.render(
    <Clock date={new Date()} />,
    document.getElementById('root')
  );
}

setInterval(tick, 1000);
```

[**在 CodePen 中试试**](http://codepen.io/gaearon/pen/dpdoYR?editors=0010)

可是，这样我们就错过了一个关键要求： `Clock` 设置一个计时器并且每秒更新 UI 应该是 `Clock` 的实现细节。

理想情况下，我们希望像这样只写一次，然后让`Clock` 会自己更新自己：

```js{2}
ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

我们需要在 `Clock` 组件中添加 "state" 来实现这个功能。

State 与 props 类似，但是 state 是私有的，并且完全受控于当前组件。

我们[之前提到](/docs/components-and-props.html#functional-and-class-components)过组件如果一个组件用 class 定义时，会有一些额外的特性。 state 是： 仅属于类定义组件的特性。

## 从函数定义组件转换成类定义组件

你可以用以下五个步骤把一个类似于 `Clock` 的函数定义组件转换成一个类定义组件：

1. 创建一个同名的 [ES6 class](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes)，并且继承自 `React.Component`。

2. 添加一个空的 `render()` 方法。
   
3. 把函数体移动到 `render()` 方法之中。

4. 在 `render()` 方法中用 `this.props` 替换 `props`。

5. 删除剩下的空函数声明。

```js
class Clock extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.props.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

[**在 CodePen 中试试**](http://codepen.io/gaearon/pen/zKRGpo?editors=0010)

`Clock` 现在被定义为一个 class，而不是一个函数。

`render` 方法会在每次组件更新时被调用。然而只要在相同的 DOM 节点中渲染 `<Clock />` ，就会只有一个 `Clock` class 的实例被调用。这就让我们可以使用一些比如 state 或是生命周期方法的一些额外特性。

## 向类型定义组件中添加局部的 state

我们用以下三个步骤把 `date` 从 props 移动到 state ：

1) 把 `render()` 方法中的 `this.props.date` 替换成 `this.state.date` ：

```js{6}
class Clock extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

2) 添加一个[class 构造函数](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes#Constructor)，然后在其中为 `this.state` 赋初值：

```js{4}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

注意看我们是如何把 `props` 传递到父类的构造函数中的：

```js{2}
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }
```

类定义组件应该始终用 `props` 参数来调用父类的构造函数。

1) 删除 `<Clock />` 元素中的 `date` 属性。

```js{2}
ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

我们之后会把计时器相关的代码添加回组件本身。

结果看上去是这样的：

```js{2-5,11,18}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

[**在 CodePen 中试试**](http://codepen.io/gaearon/pen/KgQpJd?editors=0010)

接下来，我们会让 `Clock` 设置自己的计时器并每秒更新一次。

## 将生命周期方法添加到 Class 中

在具有许多组件的应用程序中，当组件被销毁时释放所占用的资源是非常重要的。

我们想要在每当 `Clock` 第一次被渲染到 DOM 中的时候，就[设置一个计时器](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval)。这在 React 中被称为 "挂载(mount)" 。

同时，我们还想在当 DOM 告知我们 `Clock` 被删除的时候[清除计时器](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/clearInterval)。这在 React 中被称为 "卸载(umount)" 。

我们可以在类定义组件中声明一些特殊的方法，每当一个组件挂载或卸载时就会去执行这些方法：

```js{7-9,11-13}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

这些方法叫做“生命周期方法”。

`componentDidMount()` 方法会在组件已经被渲染到 DOM 中后运行，所以，最好在这里设置计时器：

```js{2-5}
  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }
```

注意看我们是如何把计时器的 ID 保存在 `this` 之中的。

尽管 `this.props` 是 React 本身设置的， `this.state` 拥有一个特殊的含义，但是你可以向 class 中随意添加不参与数据流（比如计时器 ID）的额外字段。

我们会在 `componentWillUnmount()` 生命周期方法中清除计时器：

```js{2}
  componentWillUnmount() {
    clearInterval(this.timerID);
  }
```

最后，我们会实现一个叫 `tick()`　的方法， `Clock` 组件每秒都会调用它。

它会用 `this.setState()`  来调度组件 state 的更新：

```js{18-22}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

[**在 CodePen 中试试**](http://codepen.io/gaearon/pen/amqdNA?editors=0010)

现在时钟每秒都会刷新。

让我们来快速概括一下发生了什么和这些方法的调用顺序：

1) 当 `<Clock />` 被传给 `ReactDOM.render()`的时候，React 会调用 `Clock` 组件的构造函数。 因为 `Clock` 需要显示当前的时间，所以它会用一个包含当前时间的对象来初始化 `this.state`。我们会在之后更新 state。

2) 之后 React 会调用组件的 `render()` 方法。这就是　React 确定该在页面上展示什么的方式。然后　React 更新 DOM 来匹配 `Clock` 渲染的输出。

3) 当 `Clock` 的输出被插入到 DOM 中后， React 就会调用 `ComponentDidMount()` 生命周期方法。在这个方法中，`Clock` 组件向浏览器请求设置一个计时器来每秒调用一次组件的 `tick()` 方法。

4) 浏览器每秒都会调用一次 `tick()` 方法。 在这方法之中，`Clock` 组件会通过调用 `setState()` 来计划进行一次 UI 更新。得益于 `setState()` 的调用，React 能够知道 state 已经改变了，然后会重新调用 `render()` 方法来确定页面上该显示什么。这一次，`render()` 方法中的 `this.state.date` 就不一样了，如此以来就会渲染输出更新过的时间。React 也会相应的更新 DOM。

5) 一旦 `Clock` 组件从 DOM 中被移除，React 就会调用 `componentWillUnmount()` 生命周期方法，这样计时器就停止了。

## 正确地使用 State

关于 `setState()` 你应该了解三件事：

### 不要直接修改 State

例如，此代码不会重新渲染组件：

```js
// Wrong
this.state.comment = 'Hello';
```

而是应该使用 `setState()`:

```js
// Correct
this.setState({comment: 'Hello'});
```

构造函数是唯一可以给 `this.state` 赋值的地方：

### State 的更新可能是异步的

出于性能考虑，React 可能会把多个 `setState()` 调用合并成一个调用。

因为 `this.props` 和 `this.state` 可能会异步更新，所以你不要依赖他们的值来更新下一个状态。

例如，此代码可能会无法更新计数器：

```js
// Wrong
this.setState({
  counter: this.state.counter + this.props.increment,
});
```

要解决这个问题，可以让 `setState()` 接收一个函数而不是一个对象。这个函数用上一个 state 作为第一个参数，将此次更新被应用时的 props 做为第二个参数：

```js
// Correct
this.setState((state, props) => ({
  counter: state.counter + props.increment
}));
```

我们上面用到了一个[箭头函数](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions)，但是用普通的函数也是可以运行的：

```js
// Correct
this.setState(function(state, props) {
  return {
    counter: state.counter + props.increment
  };
});
```

### State 的更新会被合并

当你调用 `setState()` 的时候，React 会把你提供的对象合并到当前的 state。

例如，你的 state 包含几个独立的变量：

```js{4,5}
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      comments: []
    };
  }
```

然后你可以分开调用 `setState()` 来单独地更新它们：

```js{4,10}
  componentDidMount() {
    fetchPosts().then(response => {
      this.setState({
        posts: response.posts
      });
    });

    fetchComments().then(response => {
      this.setState({
        comments: response.comments
      });
    });
  }
```

这里的合并是浅合并，所以 `this.setState({coments})` 完整保留了 `this.state.posts`， 但是完全替换了 `this.state.comments`。

## 数据是向下流动的

不管是父组件或是子组件都无法知道某个组件是有状态的还是无状态的，而且它们也不应该关心它是以函数定义的还是以类定义的。

这就是为什么称 state 为局部的或是封装的的原因。除了拥有并设置了它的组件，其他组件都无法访问。

一个组件可以选择把他的 state 作为 props 向下传递到它的子组件：

```js
<h2>It is {this.state.date.toLocaleTimeString()}.</h2>
```

这对于用户定义的组件同样适用：

```js
<FormattedDate date={this.state.date} />
```

`FormattedDate` 组件会在他的 props 中接收 `date` 参数，但是却无法知道它是来自于 `Clock` 的 state，或是 `Clock` 的 props，又或者是手动输入的：

```js
function FormattedDate(props) {
  return <h2>It is {props.date.toLocaleTimeString()}.</h2>;
}
```

[**在 CodePen 中试试**](http://codepen.io/gaearon/pen/zKRqNB?editors=0010)

这通常会被叫做“自顶向下”或是“单向”的数据流。任何的 state 总是所属于特定的组件，而且从该 state 派生的任何数据或 UI 只能影响树中“低于”它们的组件。

如果你把一个以组件构成的树想象成一个 props 的数据瀑布的话，那么每一个组件的 state 就像是在任意一点上给瀑布增加额外的水源，但是它只能向下流动。

为了展示所有的组件都是真正独立的，我们可以创建一个渲染三个 `Clock` 的 `App` 组件：

```js{4-6}
function App() {
  return (
    <div>
      <Clock />
      <Clock />
      <Clock />
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

[**在 CodePen 中试试**](http://codepen.io/gaearon/pen/vXdGmd?editors=0010)

每个 `Clock` 会单独的设置它自己的计时器并且更新它。

在 React 应用中，，一个组件是有状态的还是无状态的属于组件实现的细节，他会随着时间变化。你可以在有状态的组件中使用无状态的组件，反之亦然。
