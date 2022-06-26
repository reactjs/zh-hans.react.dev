---
id: react-without-es6
title: 不使用 ES6
permalink: docs/react-without-es6.html
---

通常我们会用 JavaScript 的 `class` 关键字来定义 React 组件：

```javascript
class Greeting extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

如果你还未使用过 ES6，你可以使用 `create-react-class` 模块：


```javascript
var createReactClass = require('create-react-class');
var Greeting = createReactClass({
  render: function() {
    return <h1>Hello, {this.props.name}</h1>;
  }
});
```

ES6 中的 class 与 `createReactClass()` 方法十分相似，但有以下几个区别值得注意。

## 声明默认属性 {#declaring-default-props}

无论是函数组件还是 class 组件，都拥有 `defaultProps` 属性：

```javascript
class Greeting extends React.Component {
  // ...
}

Greeting.defaultProps = {
  name: 'Mary'
};
```

如果使用 `createReactClass()` 方法创建组件，那就需要在组件中定义 `getDefaultProps()` 函数：

```javascript
var Greeting = createReactClass({
  getDefaultProps: function() {
    return {
      name: 'Mary'
    };
  },

  // ...

});
```

## 初始化 State {#setting-the-initial-state}

如果使用 ES6 的 class 关键字创建组件，你可以通过给 `this.state` 赋值的方式来定义组件的初始 state：

```javascript
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: props.initialCount};
  }
  // ...
}
```

如果使用 `createReactClass()` 方法创建组件，你需要提供一个单独的 `getInitialState` 方法，让其返回初始 state：

```javascript
var Counter = createReactClass({
  getInitialState: function() {
    return {count: this.props.initialCount};
  },
  // ...
});
```

## 自动绑定 {#autobinding}

对于使用 ES6 的 class 关键字创建的 React 组件，组件中的方法遵循与常规 ES6 class 相同的语法规则。这意味着这些方法不会自动绑定 `this` 到这个组件实例。 你需要在 constructor 中显式地调用 `.bind(this)`：

```javascript
class SayHello extends React.Component {
  constructor(props) {
    super(props);
    this.state = {message: 'Hello!'};
    // 这一行很重要！
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    alert(this.state.message);
  }

  render() {
    // 由于 `this.handleClick` 已经绑定至实例，因此我们才可以用它来处理点击事件
    return (
      <button onClick={this.handleClick}>
        Say hello
      </button>
    );
  }
}
```

如果使用 `createReactClass()` 方法创建组件，组件中的方法会自动绑定至实例，所以不需要像上面那样做：

```javascript
var SayHello = createReactClass({
  getInitialState: function() {
    return {message: 'Hello!'};
  },

  handleClick: function() {
    alert(this.state.message);
  },

  render: function() {
    return (
      <button onClick={this.handleClick}>
        Say hello
      </button>
    );
  }
});
```

这就意味着，如果使用 ES6 class 关键字创建组件，在处理事件回调时就要多写一部分代码。但对于大型项目来说，这样做可以提升运行效率。

如果模板代码对你来说不太友好，你可以尝试使用 [ES2022 Class Properties](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Public_class_fields#public_instance_fields) 语法：


```javascript
class SayHello extends React.Component {
  constructor(props) {
    super(props);
    this.state = {message: 'Hello!'};
  }
  
  // 在这里使用箭头函数就可以把方法绑定给实例：
  handleClick = () => {
    alert(this.state.message);
  };

  render() {
    return (
      <button onClick={this.handleClick}>
        Say hello
      </button>
    );
  }
}
```

为了安全起见，你可以采用以下几种方式：

* 在 constructor 中绑定方法。
* 使用箭头函数，比如：`onClick={(e) => this.handleClick(e)}`。
* 继续使用 `createReactClass`。

## Mixins {#mixins}

>**注意：**
>
>ES6 本身是不包含任何 mixin 支持。因此，当你在 React 中使用 ES6 class 时，将不支持 mixins 。
>
>**我们也发现了很多使用 mixins 然后出现了问题的代码库。[并且不建议在新代码中使用它们](/blog/2016/07/13/mixins-considered-harmful.html)。**
>
> 以下内容仅作为参考。

如果完全不同的组件有相似的功能，这就会产生["横切关注点（cross-cutting concerns）"问题](https://en.wikipedia.org/wiki/Cross-cutting_concern)。针对这个问题，在使用 createReactClass 创建 React 组件的时候，引入 `mixins` 功能会是一个很好的解决方案。

比较常见的用法是，组件每隔一段时间更新一次。使用 `setInterval()` 可以很容易实现这个功能，但需要注意的是，当你不再需要它时，你应该清除它以节省内存。React 提供了[生命周期方法](/docs/react-component.html#the-component-lifecycle)，这样你就可以知道一个组件何时被创建或被销毁了。让我们创建一个简单的 mixin，它使用这些方法提供一个简单的 `setInterval()` 函数，它会在组件被销毁时被自动清理。

```javascript
var SetIntervalMixin = {
  componentWillMount: function() {
    this.intervals = [];
  },
  setInterval: function() {
    this.intervals.push(setInterval.apply(null, arguments));
  },
  componentWillUnmount: function() {
    this.intervals.forEach(clearInterval);
  }
};

var createReactClass = require('create-react-class');

var TickTock = createReactClass({
  mixins: [SetIntervalMixin], // 使用 mixin
  getInitialState: function() {
    return {seconds: 0};
  },
  componentDidMount: function() {
    this.setInterval(this.tick, 1000); // 调用 mixin 上的方法
  },
  tick: function() {
    this.setState({seconds: this.state.seconds + 1});
  },
  render: function() {
    return (
      <p>
        React has been running for {this.state.seconds} seconds.
      </p>
    );
  }
});

const root = ReactDOM.createRoot(document.getElementById('example'));
root.render(<TickTock />);
```

如果组件拥有多个 mixins，且这些 mixins 中定义了相同的生命周期方法（例如，当组件被销毁时，几个 mixins 都想要进行一些清理工作），那么这些生命周期方法都会被调用的。使用 mixins 时，mixins 会先按照定义时的顺序执行，最后调用组件上对应的方法。
