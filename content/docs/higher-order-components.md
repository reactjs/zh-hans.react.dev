---
id: higher-order-components
title: 高阶组件
permalink: docs/higher-order-components.html
---

高阶组件（之后简称 HOC，复数 HOCs）是 React 中复用组件逻辑的高级技能。HOCs 本身并不是 React API 的一部分。他们是从 React 的特性中衍生出来的一种模式。

具体来讲，**HOC 是接收一个组件作为参数然后返回一个新的组件的方法。**

```js
const EnhancedComponent = higherOrderComponent(WrappedComponent);
```

相对于组件把 props 转换成 UI，HOC 则是把一个组件转换成另外一个组件。

HOCs 经常用于 React 的第三方库，比如 Redux 中的 [`connect`](https://github.com/reduxjs/react-redux/blob/master/docs/api/connect.md#connect) 和 Relay 中的 [`createFragmentContainer`](http://facebook.github.io/relay/docs/en/fragment-container.html)。

在这篇文档中，我们会讨论为什么 HOCs 是有用的，以及怎么写一个你自己的 HOC。

## 使用 HOCs 来切分逻辑 {#use-hocs-for-cross-cutting-concerns}

> **注意**
>
> 我们曾今推荐使用 mixins 作为处理横切关注点的方式。我们现在发觉相比于 mixins 的价值他带来了更多麻烦。[阅读更多](/blog/2016/07/13/mixins-considered-harmful.html)关于为什么我们去掉来 mixins 以及你该如何修改你已有的组件。

组件是 React 中最主要的代码复用单元。然而你会发现一些模式并不非常直接适合传统的组件。

举个例子，假如你有一个 `CommentList` 组件用来订阅外部的数据源并渲染一个评论列表：

```js
class CommentList extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      // "DataSource" is some global data source
      comments: DataSource.getComments()
    };
  }

  componentDidMount() {
    // Subscribe to changes
    DataSource.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    // Clean up listener
    DataSource.removeChangeListener(this.handleChange);
  }

  handleChange() {
    // Update component state whenever the data source changes
    this.setState({
      comments: DataSource.getComments()
    });
  }

  render() {
    return (
      <div>
        {this.state.comments.map((comment) => (
          <Comment comment={comment} key={comment.id} />
        ))}
      </div>
    );
  }
}
```

然后，你写了一个组件使用相同的模式来订阅一篇博客：

```js
class BlogPost extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      blogPost: DataSource.getBlogPost(props.id)
    };
  }

  componentDidMount() {
    DataSource.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    DataSource.removeChangeListener(this.handleChange);
  }

  handleChange() {
    this.setState({
      blogPost: DataSource.getBlogPost(this.props.id)
    });
  }

  render() {
    return <TextBlock text={this.state.blogPost} />;
  }
}
```

`CommentList` 和 `BlogPost` 并不完全相同——他们调用 `DateSource` 上的不同方法，并渲染不同的输出。但是他们大部分的实现过程是一样的：

- 在挂载后，在 `DateSource` 上增加一个变化监听器。
- 在订阅中一旦发现数据变化就调用 `setState`。
- 在卸载之前，删除变化监听器。

你可以预感到在一个大型的应用中，这种类似的订阅 `DataSource` 并调用 `setState` 的模式会一次又一次的出现。我们想要一种抽象来允许我们把这部分逻辑定义到一个单独的地方并在不同的组件中进行分享。这就是HOCs擅长的地方。

我们可以写一个方法来创建组件，比如 `CommentList` 和 `BlogPost` 这种订阅 `DataSource` 的组件，这个方法接收的参数中会有一个子组件，其接收订阅数据作为 prop。我们叫这个方法 `withSubscription`：

```js
const CommentListWithSubscription = withSubscription(
  CommentList,
  (DataSource) => DataSource.getComments()
);

const BlogPostWithSubscription = withSubscription(
  BlogPost,
  (DataSource, props) => DataSource.getBlogPost(props.id)
);
```

第一个参数是一个被包装的组件。第二个参数用来检索我们感兴趣的数据，他接收 `DataSource` 以及当前的props作为参数。

当 `CommentListWithSubscription` 和 `BlogPostWithSubscription` 被渲染的时候，`CommentList` 和 `BlogPost` 会收到一个叫 `data` 的 prop，他会带上从 `DataSource` 中获取的最新数据：

```js
// This function takes a component...
function withSubscription(WrappedComponent, selectData) {
  // ...and returns another component...
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
      this.state = {
        data: selectData(DataSource, props)
      };
    }

    componentDidMount() {
      // ... that takes care of the subscription...
      DataSource.addChangeListener(this.handleChange);
    }

    componentWillUnmount() {
      DataSource.removeChangeListener(this.handleChange);
    }

    handleChange() {
      this.setState({
        data: selectData(DataSource, this.props)
      });
    }

    render() {
      // ... and renders the wrapped component with the fresh data!
      // Notice that we pass through any additional props
      return <WrappedComponent data={this.state.data} {...this.props} />;
    }
  };
}
```

注意 HOC 不会修改传入的组件，也不会使用继承的方式来拷贝他的行为。相反，HOC **组合**原始组件的方式是通过把他**包装**进入一个容器组件。HOC 是一个没有任何副作用的纯粹的方法。

就是这样！被包装的组件从容器那接收所有的 props，同时包括一个新的 prop，叫做 `date`，用来渲染他的输出。HOC 并不关心数据被怎么样或者为什么被使用，同样被包装的组件也不关心数据是从哪里来的。

因为 `withSubscription` 只是一个普通的方法，你可以增加随意数量的参数。举个例子，你可能想要让 `date` 的名字变得可配置，让 HOC 更加独立于被包装的组件。或者你可以接收一个参数来配置 `shouldComponentUpdate`，甚至一个参数来配置数据源。这些都是可能的因为 HOC 有定义组件的完全控制权。

跟组件很像，`withSubscription` 和被包装的组件之间的约定是完全基于 props 的。这就让切换一个 HOC 到另外一个变得非常简单，只要他们提供相同的props给被包装的组件。举个例子，这在我们需要切换数据获取的类库的时候可能会非常有用。

## 不要修改原始的组件。使用组合。 {#dont-mutate-the-original-component-use-composition}

请抵挡诱惑，不要在 HOC 中去修改组件的原型（或者直接修改他本身）。

```js
function logProps(InputComponent) {
  InputComponent.prototype.componentWillReceiveProps = function(nextProps) {
    console.log('Current props: ', this.props);
    console.log('Next props: ', nextProps);
  };
  // The fact that we're returning the original input is a hint that it has
  // been mutated.
  return InputComponent;
}

// EnhancedComponent will log whenever props are received
const EnhancedComponent = logProps(InputComponent);
```

这样做会存在一些问题。首先输入的组件不能和增强之后的组件分开使用来。至关重要的是，如果你对 `EnhancedComponent` 使用了另外一个同样修改了 `componentWillReceiveProps` 的 HOC，那么第一个 HOC 的功能就会被覆盖！这个 HOC 还不能配合函数组件进行使用，因为函数组件根本没有生命周期方法。

通过修改实现的 HOCs 是低级抽象——使用者必须知道他们是如何实现的，才能避免和其他 HOCs 产生冲突。

HOCs 应该使用组合，通过包装输入组件进入一个容器的方式，而不是直接进行修改。

```js
function logProps(WrappedComponent) {
  return class extends React.Component {
    componentWillReceiveProps(nextProps) {
      console.log('Current props: ', this.props);
      console.log('Next props: ', nextProps);
    }
    render() {
      // Wraps the input component in a container, without mutating it. Good!
      return <WrappedComponent {...this.props} />;
    }
  }
}
```

这个 HOC 跟通过修改实现的版本有相同的功能，同时他可以避免潜在的冲突问题。他能够同时很好地配合 class 和函数组件使用。同时因为他是纯粹的方法，他能够和其他 HOCs，甚至是自己都进行组合。

你可能已经注意到了 HOCs 和**容器组件**模式之间的相似性。容器组件是分割高级和低级关注点策略的一部分。容器处理订阅和状态等内容，并且传递 props 给一些处理UI渲染的组件。HOCs 使用容器作为他的实现的一部分。你可以认为 HOCs 是参数化的容器组件定义。

## 惯例：无关的 Props 直接传递到被包装的组件 {#convention-pass-unrelated-props-through-to-the-wrapped-component}

HOCs 为组件增加功能，HOCs 不应该大量的改动组件的约定。我们期望 HOC 返回的组件跟被包装的组件具有相似的接口。

HOCs 应该直接传递跟他的具体关注点无关的 props。大部分的 HOCs 会包含一个类似如下的 render 方法：

```js
render() {
  // Filter out extra props that are specific to this HOC and shouldn't be
  // passed through
  const { extraProp, ...passThroughProps } = this.props;

  // Inject props into the wrapped component. These are usually state values or
  // instance methods.
  const injectedProp = someStateOrInstanceMethod;

  // Pass props to wrapped component
  return (
    <WrappedComponent
      injectedProp={injectedProp}
      {...passThroughProps}
    />
  );
}
```

这个惯例帮助我们确保 HOCs 的最高的灵活性和复用性。

## 惯例：最大限度的可组合性 {#convention-maximizing-composability}

并不是所有的 HOC 看上去都一样。有些时候他们接收唯一一个参数——被包装的组件：

```js
const NavbarWithRouter = withRouter(Navbar);
```

通常来说，HOCs 会接收额外的参数。在一些 Relay 的例子中，一个配置对象会被用来表示组件的数据依赖：

```js
const CommentWithRelay = Relay.createContainer(Comment, config);
```

最常见的 HOC 特征看起来如下：

```js
// React Redux's `connect`
const ConnectedComment = connect(commentSelector, commentActions)(CommentList);
```

*啥？！*如果你把他们分开来看，可以很轻松发现到底他做了什么。

```js
// connect is a function that returns another function
const enhance = connect(commentListSelector, commentListActions);
// The returned function is a HOC, which returns a component that is connected
// to the Redux store
const ConnectedComment = enhance(CommentList);
```

换句话说，`connect` 是一个高阶方法，他返回一个 HOC！

这种方式看起来令人困惑的或者是不必要的，但是他包含了非常有用特性。类似 `connect` 返回的单参数的HOC具有 `Component => Component` 这样的特性。具有输入和输出的类型相同的方法真的非常容易进行组合。

```js
// Instead of doing this...
const EnhancedComponent = withRouter(connect(commentSelector)(WrappedComponent))

// ... you can use a function composition utility
// compose(f, g, h) is the same as (...args) => f(g(h(...args)))
const enhance = compose(
  // These are both single-argument HOCs
  withRouter,
  connect(commentSelector)
)
const EnhancedComponent = enhance(WrappedComponent)
```

（这种相同的特性同样允许 `connect` 和其他增强类型的 HOCs 被用来当作装饰器，一个试验性的 JavaScript 提案。）

很多第三方库提供了 `compose` 工具方法包括lodash（叫做 [`lodash.flowRight`](https://lodash.com/docs/#flowRight)），[Redux](https://redux.js.org/api/compose)，以及 [Ramda](https://ramdajs.com/docs/#compose)。

## 惯例：包装显示名称来方便调试 {#convention-wrap-the-display-name-for-easy-debugging}

HOCs 创建的容器组件会像其他组件一样在 [React 开发工具](https://github.com/facebook/react-devtools)中展示。为了方便调试，选择一个显示名称来传达他是一个 HOC 返回的结果。

最常用的技巧是包装被包装组件的显示名称。所以如果你的HOC叫做 `withSubscription`，同时被包装的组件的显示名字是 `CommentList`，那么使用显示名称 `WithSubscription(CommentList)`：

```js
function withSubscription(WrappedComponent) {
  class WithSubscription extends React.Component {/* ... */}
  WithSubscription.displayName = `WithSubscription(${getDisplayName(WrappedComponent)})`;
  return WithSubscription;
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
```


## 附加说明 {#caveats}

如果你是 React 新手 HOC 中会存在一些不那么明显的附加说明需要注意。

### 不要在render方法中使用HOCs {#dont-use-hocs-inside-the-render-method}

React 的对比算法（通常叫做调和）使用组件标识来确认是否他应该更新当前的子树或者直接丢弃重新挂载一个新的。如果 `render` 中返回的组件和上一次渲染中的组件完全相同（`===`），React 会递归地更新子树通过对比新的组件。如果他们不相同，之前的子树会完全卸载。

通常来说，你不应考虑这个问题。但是在 HOC 中这非常重要，因为他意味着你不能在一个组件的 render 方法执行的时候调用 HOC 来生产一个组件。

```js
render() {
  // A new version of EnhancedComponent is created on every render
  // EnhancedComponent1 !== EnhancedComponent2
  const EnhancedComponent = enhance(MyComponent);
  // That causes the entire subtree to unmount/remount each time!
  return <EnhancedComponent />;
}
```

在这的问题并不只是性能——重新挂载一个组件会导致组件的状态和他所有的子节点全部丢失。

相对的，在一个组件定义的外部调用 HOCs，所以结果只会被创建一次。然后他的标识会在渲染中就是一致的。无论如何这通常都是你想要的。

在其他一些你需要动态调用 HOCs 的罕见的场景中，你同样可以在组件的生命周期方法或者他的构造器当中来执行。

### 静态方法必须拷贝过去 {#static-methods-must-be-copied-over}

有时候在 React 组件上定义一个静态方法会十分有用。比如，Relay 容器暴露出了一个静态的 `getFragment` 方法来帮助组合 GraphQL fragments。

当你对一个组件调用 HOCs，原始组件会被包装到一个容器组件中。这意味着新的组件并不包含原始组件上的静态方法。

```js
// Define a static method
WrappedComponent.staticMethod = function() {/*...*/}
// Now apply a HOC
const EnhancedComponent = enhance(WrappedComponent);

// The enhanced component has no static method
typeof EnhancedComponent.staticMethod === 'undefined' // true
```

要解决这个问题，你可以在返回容器组件之前把所有方法拷贝过去。

```js
function enhance(WrappedComponent) {
  class Enhance extends React.Component {/*...*/}
  // Must know exactly which method(s) to copy :(
  Enhance.staticMethod = WrappedComponent.staticMethod;
  return Enhance;
}
```

然而，这要求你完全清楚哪些方法需要拷贝。你可以使用 [hoist-non-react-statics](https://github.com/mridgway/hoist-non-react-statics) 来自动拷贝非 React 的静态方法。

```js
import hoistNonReactStatic from 'hoist-non-react-statics';
function enhance(WrappedComponent) {
  class Enhance extends React.Component {/*...*/}
  hoistNonReactStatic(Enhance, WrappedComponent);
  return Enhance;
}
```

另外一个可能的解决方案是把静态方法和组件分开导出

```js
// Instead of...
MyComponent.someFunction = someFunction;
export default MyComponent;

// ...export the method separately...
export { someFunction };

// ...and in the consuming module, import both
import MyComponent, { someFunction } from './MyComponent.js';
```

### Refs 不会被传递过去 {#refs-arent-passed-through}

虽然惯例来说 HOCs 会把所有 props 传递给被包装的组件，但是这对于 refs 来说是不可行的。因为 `ref` 并不是真正的 prop——就像 `key`，他会被 React 特殊处理。如果你对一个 HOC 生产的组件增加 ref，他会被指向外层的容器组件，而不是被包装的组件。

解决方法是使用 `React.forwardRef` API（在React 16.3中引入）。[在 forwarding refs 章节学习更多](/docs/forwarding-refs.html).
