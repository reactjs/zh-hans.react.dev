---
id: legacy-context
title: 过时的 Context
permalink: docs/legacy-context.html
---

> 注意：
>
> 过时的 context API 会在未来的主要版本中被移除。
> 使用 16.3 版本中引入的 [新的 context API](/docs/context.html)。
> 过时的 API 将会继续在所有 16.x 版本中工作。

## 如何使用 Context {#how-to-use-context}

> 本节记录一个过时的 API。查看 [新的 API](/docs/context.html)。

假设你有这样一个结构：

```javascript
class Button extends React.Component {
  render() {
    return (
      <button style={{background: this.props.color}}>
        {this.props.children}
      </button>
    );
  }
}

class Message extends React.Component {
  render() {
    return (
      <div>
        {this.props.text} <Button color={this.props.color}>Delete</Button>
      </div>
    );
  }
}

class MessageList extends React.Component {
  render() {
    const color = "purple";
    const children = this.props.messages.map((message) =>
      <Message text={message.text} color={color} />
    );
    return <div>{children}</div>;
  }
}
```

在这个示例中，我们手动传递一个 `color` 属性来设置 `Button` 和 `Message` 组件的样式。使用 context，我们可以通过组件树自动传递属性：

```javascript{6,13-15,21,28-30,40-42}
import PropTypes from 'prop-types';

class Button extends React.Component {
  render() {
    return (
      <button style={{background: this.context.color}}>
        {this.props.children}
      </button>
    );
  }
}

Button.contextTypes = {
  color: PropTypes.string
};

class Message extends React.Component {
  render() {
    return (
      <div>
        {this.props.text} <Button>Delete</Button>
      </div>
    );
  }
}

class MessageList extends React.Component {
  getChildContext() {
    return {color: "purple"};
  }

  render() {
    const children = this.props.messages.map((message) =>
      <Message text={message.text} />
    );
    return <div>{children}</div>;
  }
}

MessageList.childContextTypes = {
  color: PropTypes.string
};
```

通过给 `MessageList`（context 的生产者）添加 `childContextTypes` 和 `getChildContext`，React 自动向下传递信息，子树上的所有组件（在这个例子中是 `Button`）可以通过定义 `contextTypes` 来访问 context。

如果 `contextTypes` 没有被定义，`context` 就会是个空对象。

> 注意：
>
> 自从 React 15.5 版本之后，`React.PropTypes` 已经转移到了另一个包。请改用 [`prop-types` 库](https://www.npmjs.com/package/prop-types) 来定义 `contextTypes`。
>
> 我们提供了 [一个 codemod 脚本](/blog/2017/04/07/react-v15.5.0.html#migrating-from-react.proptypes) 来自动转换。

### 父-子 结合 {#parent-child-coupling}

> 本节记录一个过时的 API。查看 [新的 API](/docs/context.html)。

Context 也能让你构建一个父子组件通信的 API。例如，[React Router V4](https://reacttraining.com/react-router) 这个库就是这样工作的：

```javascript
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

const BasicExample = () => (
  <Router>
    <div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/topics">Topics</Link></li>
      </ul>

      <hr />

      <Route exact path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/topics" component={Topics} />
    </div>
  </Router>
);
```

通过从 `Router` 组件向下传递一些信息，每一个 `Link` 和 `Route` 能够与包含它的 `Router` 通信。

在你构建类似的 API 的组件之前，先考虑是否有更简洁的方式。例如，如果你愿意的话，你可以将整个 React 组件作为 props。

### 在生命周期方法中引用 Context {#referencing-context-in-lifecycle-methods}

> 本节记录一个过时的 API。查看 [新的 API](/docs/context.html)。

如果一个组件内定义了 `contextTypes`，下面的 [生命周期方法](/docs/react-component.html#the-component-lifecycle) 会接收一个额外参数，就是 `context` 对象：

- [`constructor(props, context)`](/docs/react-component.html#constructor)
- [`componentWillReceiveProps(nextProps, nextContext)`](/docs/react-component.html#componentwillreceiveprops)
- [`shouldComponentUpdate(nextProps, nextState, nextContext)`](/docs/react-component.html#shouldcomponentupdate)
- [`componentWillUpdate(nextProps, nextState, nextContext)`](/docs/react-component.html#componentwillupdate)

> 注意：
>
> 从 React 16 开始，`componentDidUpdate` 不再接收 `prevContext`。

### 在函数组件中引用 Context {#referencing-context-in-stateless-function-components}

> 本节记录一个过时的 API。查看 [新的 API](/docs/context.html)。

只要 `contextTypes` 被定义为函数的一个属性，函数组件也能够引用 `context`。下面的代码展示了一个函数组件写法的 `Button` 组件。

<br/>

```javascript
import PropTypes from 'prop-types';

const Button = ({children}, context) =>
  <button style={{background: context.color}}>
    {children}
  </button>;

Button.contextTypes = {color: PropTypes.string};
```

### 更新 Context {#updating-context}

> 本节记录一个过时的 API。查看 [新的 API](/docs/context.html)。

不要这样做。

React 有一个 API 可以更新 context，但它基本上是坏的，你不应该使用它。

当 state 或者 props 改变的时候，`getChildContext` 函数就会被调用。为了更新 context 里的数据，使用 `this.setState` 触发当前 state 的更新。这样会产生一个新的 context 并且子组件会接收到变化。

```javascript
import PropTypes from 'prop-types';

class MediaQuery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {type:'desktop'};
  }

  getChildContext() {
    return {type: this.state.type};
  }

  componentDidMount() {
    const checkMediaQuery = () => {
      const type = window.matchMedia("(min-width: 1025px)").matches ? 'desktop' : 'mobile';
      if (type !== this.state.type) {
        this.setState({type});
      }
    };

    window.addEventListener('resize', checkMediaQuery);
    checkMediaQuery();
  }

  render() {
    return this.props.children;
  }
}

MediaQuery.childContextTypes = {
  type: PropTypes.string
};
```

问题是，如果组件提供的一个 context 发生了变化，而中间父组件的 `shouldComponentUpdate` 返回 `false`，那么使用到该值的后代组件不会进行更新。使用了 context 的组件则完全失控，所以基本上没有办法能够可靠的更新 context。[这篇博客文章](https://medium.com/@mweststrate/how-to-safely-use-react-context-b7e343eff076)很好地解释了为什么这是一个问题，以及你该如何规避它。
