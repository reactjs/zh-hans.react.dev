---
title: 'Mixins Considered Harmful'
author: [gaearon]
---

“我怎么从几个组件之间共享代码呢?”，这是人们在学习 React 的时候第一个会问的问题。我们总会回答使用组合组件来使得代码可以复用。你可以定义一个组件并且在几个其他组件中使用。

如何通过组合去解决特定的模式并不总是显而易见。 React 受到了函数式编程的影响，但这进入了一种由面向对象库主导的领域。Facebook 内部和外部的工程师都很难放弃他们习惯的模式。

为了简化最初的采用和学习，我们在 React 中加入了某些应急方案。 mixin 系统是其中一个应急方案，并且它的目标是当你不确定如何通过组合解决同样问题的时候，给你提供一个组件之间复用代码的方法。

React 已经发布三年了。境况变了。多个视图库现在采用与React类似的组件模型。使用继承之上的组合来构建声明性用户界面已不再是新鲜事。我们对React组件模型也更加自信，我们在内部和社区都看到了它的许多创造性应用。

在本文中，我们将考虑一些 mixins 的场景问题。然后我们将对于同样的使用案例提出几个可选的模式。我们发现，与 minxins 相比，这些模式可以更好适应代码库的复杂度。

## 为什么 Mixins 是破坏性的 {/*why-mixins-are-broken*/}

在 Facebook， React 组件的使用量已经从几十个增长到了上千个。这让我们更了解用户是如何使用 React 的。多亏了声明式的渲染和自顶向下的数据流，许多团队能够在采用 React 时发布新功能的同时修复一堆漏洞。

然而不可避免的是，我们的一部分 React 代码会逐渐变得难以理解。React 小组有时会在不同的项目中看到很多令人不敢乱改动的组件。这些组件一改动就很容易出 bug，而且让新接手的开发人员难以理解，最后变得即使是最初编写它们的人也看不懂了。这样的混乱大都是由 mixins 造成的。虽然当时我没有在 Facebook 工作，但是在我写出关于 mixins 糟糕之处的分享后，我得出了[同样的结论](https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750)。

这并不意味着 mixins 本身是坏的。人们成功地在不同的语言和范例中使用它，包括一些函数式语言。在 Facebook ，我们广泛地在 Hack 语言中使用与 mixins 非常相似的特征。尽管如此，我们仍然认为在 React 代码库中，mixins 是不必要的和容易出问题的。这里列出了为什么这样说的几条理由。

### Mixins 引入了隐式依赖 {/*mixins-introduce-implicit-dependencies*/}

有时一个组件依赖于在 mixin 中定义的某个确定方法，例如 `getClassName()`。有时相反，mixin 在组件上调用 renderHeader() 方法。 JavaScript 是一种动态语言，因此很难强制记录这些依赖关系。

Mixins 打破了常规的，通常是安全的假设 —— 你可以在组件文件中通过搜索 state 名字或者方法名来重新命名。你可能会写一个有状态的组件，然后你的同事可能添加一个读取这个组件 state 的 mixin。几个月之后，你可能希望将该 state 移动到父组件，以便与其兄弟组件共享。你会记得更新这个 mixin 来读取 props 而不是 state 吗？如果还有其他组件也在使用这个 mixin 呢？

这些隐含的依赖关系使得新的团队成员很难为代码库做出贡献。组件的 `render() ` 方法可能引用一些未在该类上定义的方法，是否可以安全地删除？也许它是在一个 mixins 中定义的，但是是哪一个呢？你需要向上滚动到 mixin 列表，打开这些文件，并查找此方法。更糟糕的是，mixins 可以指定自己的 mixins，所以搜索层级可能会很深。

通常来说，mixins 依赖于其他 mixins ，并且删除其中的一个会破坏另一个 mixin。在这些情况下，告诉数据如何流入和流出 mixin 以及它们的依赖图怎样是非常棘手的。与组件不同，mixins 不构成层次结构：它们是扁平化的并在相同的命名空间中运行。

### Mixins 会造成命名冲突 {/*mixins-cause-name-clashes*/}

无法保证两个特定的 mixin 可以一起使用。例如，如果 `FluxListenerMixin `和 `WindowSizeMixin` 都定义了 `handleChange()`，则不能一起使用它们。同时，你也无法在自己的组件上定义具有此名称的方法。

如果你控制此 mixin 代码，这倒还好。当有冲突时，你可以在其中一个mixins上重命名该方法。但是这也会很棘手，因为某些组件或其他 mixins 可能已经直接调用此方法，你还需要查找和修复这些调用。

如果你有与第三方软件包的 mixins 名称冲突，则无法重命名其上的方法。相反，你必须在组件上使用尴尬的方法名称才能避免冲突。

对于 mixin 作者来说，情况也并不好。即使添加一个新的方法到 mixin 中也通常是一个潜在的破坏性的变化，因为具有相同的名称方法可能已经存在于使用它的一些组件，直接或通过另一个mixin。一旦写入，mixins 很难删除或改变。坏的设计也不会被重构，因为重构太危险了。

### Mixins 导致滚雪球式的复杂性 {/*mixins-cause-snowballing-complexity*/}

即使刚开始的时候 mixins 很简单，它们往往随着时间的推移变得复杂。下面的例子是基于我在代码库中看到的一个真实场景。

一个组件需要一些状态来跟踪鼠标悬停。为了使逻辑可重用，你可以将 `handleMouseEnter()`、`handleMouseLeave()` 和 `isHovering()`提取到`HoverMixin` 中。接下来，有人需要实现一个工具提示。他们不想复制 `HoverMixin` 的逻辑，所以他们创建一个使用 `HoverMixin` 的 `TooltipMixin`。 `TooltipMixin` 在其 `componentDidUpdate()` 读取 `HoverMixin` 提供的 `isHovering()`，并显示或隐藏工具提示。

几个月后，有人想让工具提示方向可配置。为了避免代码重复，他们对 `TooltipMixin` 增加了一个新的可选方法 `getTooltipOptions()` 的支持。到这个时候，另一个显示弹出层悬停的组件也使用 `HoverMixin`。然而，此组件需要不同的悬停延迟。为了解决这个问题，有人增加了对可选的 `getTooltipOptions`() 方法的支持，并在 `TooltipMixin` 中实现它。这些 mixins 现在紧密耦合。

这还好没有任何新的需求。然而，这个解决方案不能很好地扩展，如果你想支持在单个组件中显示多个工具提示怎么办？你不能在组件中定义相同的 mixin 两次。如果工具提示需要在引导中自动显示，而不是悬停展示？祝你从 `HoverMixin` 的解耦 `TooltipMixin` 好运。如果你需要支持悬停区域和工具提示锚位于不同组件的情况，该怎么办？你不能轻易地将 mixins 使用的状态提升到父组件中。与组件不同，mixins 并不适用于这些更改。

每一个新的要求使得 mixins 更难理解。使用相同 mixin 的组件随时间变得越来越多。任何 mixin 的新的功能被添加到使用该 mixin 的所有组件。没有办法拆分mixin 的“更简单”的部分，而不需要复制代码或在 mixins 之间引入更多的依赖性和间接性。逐渐地，封装的边界被侵蚀，由于很难改变或删除现有的 mixins，它们不断变得更抽象，直到没有人了解它们如何工作。

这些是我们在 React 之前构建应用程序所遇到的同样的问题。我们发现它们通过声明性渲染，自上而下的数据流和封装的组件来解决。在 Facebook，我们一直在使用替代模式从 mixins 迁移我们的代码，通常，对迁移的结果都很满意。你可以阅读下面的这些模式。

## 从 Mixins 迁移 {/*migrating-from-mixins*/}

让我们清楚的是，mixins 在技术上不被淘汰。如果你使用 `React.createClass()`，可以继续使用它们。我们只是说它对我们没有好处，所以在未来我们不建议使用它们。

下面是我们在 Facebook 代码库中找到的一些典型 mixin 和它们解决的问题以及我们认为比 mixins 更好的解决方案。这些例子是在ES5中编写的，但是一旦你不需要 mixin，你可以根据需要切换到 ES6 的类语法。

我们希望你发现此列表有帮助。如果我们错过重要的用例，请让我们知道，我们可以修改列表或修正错误！

### 性能优化 {/*performance-optimizations*/}

最常用的 mixins 之一是 [`PureRenderMixin`](/docs/pure-render-mixin.html)。当 props 和 state 和之前 props 和 state 浅层相等时，你可能会在某些组件中使用它来[防止不必要的重新渲染](/docs/advanced-performance.html#shouldcomponentupdate-in-action)

```javascript
var PureRenderMixin = require('react-addons-pure-render-mixin');

var Button = React.createClass({
  mixins: [PureRenderMixin],

  // ...
});
```

#### 解决方案 {/*solution*/}

不使用 mixins 要实现相同的功能，你可以直接使用 [`shallowCompare`](/docs/shallow-compare.html) 替代：

```js
var shallowCompare = require('react-addons-shallow-compare');

var Button = React.createClass({
  shouldComponentUpdate: function (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },

  // ...
});
```

如果你使用自定义 mixin 来实现具有不同算法的 `shouldComponentUpdate` 函数，我们建议从模块导出该函数，并直接从组件中调用它。

我们知道更多的输入字符可能会令人烦恼。对于最常见的情况，我们计划在下一个次要版本中引入一个名为 React.PureComponent 的新基类。它使用与现在的 `PureRenderMixin` 相同的浅层比较。

### 订阅和副作用 {/*订阅和副作用*/}

我们遇到的第二种最常见的混合类型是将 React 组件订阅到第三方数据源的 mixins 。无论此数据源是 Flux Store，Rx Observable 还是其他内容，这些模式非常相似：在 `componentDidMount` 中创建订阅，在 `componentWillUnmount` 中销毁，调用 `this.setState()` 更改。

```javascript
var SubscriptionMixin = {
  getInitialState: function () {
    return {
      comments: DataSource.getComments(),
    };
  },

  componentDidMount: function () {
    DataSource.addChangeListener(this.handleChange);
  },

  componentWillUnmount: function () {
    DataSource.removeChangeListener(this.handleChange);
  },

  handleChange: function () {
    this.setState({
      comments: DataSource.getComments(),
    });
  },
};

var CommentList = React.createClass({
  mixins: [SubscriptionMixin],

  render: function () {
    // Reading comments from state managed by mixin.
    var comments = this.state.comments;
    return (
      <div>
        {comments.map(function (comment) {
          return <Comment comment={comment} key={comment.id} />;
        })}
      </div>
    );
  },
});

module.exports = CommentList;
```

#### 解决方案 {/*solution-1*/}

如果只有一个组件订阅该数据源，将订阅逻辑嵌入到组件中是很好的。避免过早抽象。

如果几个组件使用这个 mixin 来订阅数据源，避免重复的一个好方法是使用一个称为 [`高阶组件`](https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750) 的模式。它听起来很吓人，所以我们将仔细看看这个模式如何从组件模型中自然出现。

#### 高阶组件说明 {/*higher-order-components-explained*/}

让我们暂时先忘记 React。考虑这两个函数，它们做加法和乘法，并打印日志记录结果：



```js
function addAndLog(x, y) {
  var result = x + y;
  console.log('result:', result);
  return result;
}

function multiplyAndLog(x, y) {
  var result = x * y;
  console.log('result:', result);
  return result;
}
```

这两个功能并不是非常有用，但它们可以帮助我们展示给我们可以应用于组件的模式。

假设我们想从这些函数中提取记录逻辑，而不改变它们的签名。我们该怎么做呢？一个优雅的解决方案是写一个 [高阶函数](https://en.wikipedia.org/wiki/Higher-order_function) ，即一个将一个函数作为一个参数并返回一个函数的高级函数。

这次，听起来更吓人：

```js
function withLogging(wrappedFunction) {
  // Return a function with the same API...
  return function (x, y) {
    // ... that calls the original function
    var result = wrappedFunction(x, y);
    // ... but also logs its result!
    console.log('result:', result);
    return result;
  };
}
```

`withLogging` 高阶函数可以让我们在没有日志记录语句的情况下编写加法和乘法，然后将它们打包成与以前完全相同的签名来获取 `addAndLog` 和 `multiplyAndLog：`

```js
function add(x, y) {
  return x + y;
}

function multiply(x, y) {
  return x * y;
}

function withLogging(wrappedFunction) {
  return function (x, y) {
    var result = wrappedFunction(x, y);
    console.log('result:', result);
    return result;
  };
}

// Equivalent to writing addAndLog by hand:
var addAndLog = withLogging(add);

// Equivalent to writing multiplyAndLog by hand:
var multiplyAndLog = withLogging(multiply);
```


高阶组件是非常相似的模式，但是应用于 React 中的组件。我们将从两个步骤中从 mixins 中应用这个转换。

第一步，我们将把我们的 `CommentList` 组件分成两部分，一个子组件和一个父组件。子组件只会关注渲染评论。父母将设置订阅，并通过 props 将最新数据传递给子组件。

```js
// This is a child component.
// It only renders the comments it receives as props.
var CommentList = React.createClass({
  render: function () {
    // Note: now reading from props rather than state.
    var comments = this.props.comments;
    return (
      <div>
        {comments.map(function (comment) {
          return <Comment comment={comment} key={comment.id} />;
        })}
      </div>
    );
  },
});

// This is a parent component.
// It subscribes to the data source and renders <CommentList />.
var CommentListWithSubscription = React.createClass({
  getInitialState: function () {
    return {
      comments: DataSource.getComments(),
    };
  },

  componentDidMount: function () {
    DataSource.addChangeListener(this.handleChange);
  },

  componentWillUnmount: function () {
    DataSource.removeChangeListener(this.handleChange);
  },

  handleChange: function () {
    this.setState({
      comments: DataSource.getComments(),
    });
  },

  render: function () {
    // We pass the current state as props to CommentList.
    return <CommentList comments={this.state.comments} />;
  },
});

module.exports = CommentListWithSubscription;
```

只剩最后一步。

还记得我们用 `withLogging()` 接收一个函数并返回一个包装它的函数吗？我们可以将类似的模式应用于 React 组件。

我们将编写一个名为 `withSubscription(WrappedComponent)` 的新函数。它的参数可以是任何 React 组件。我们将传递 `CommentList` 作为 WrappedComponent（被包装的组件），但是我们也可以传递任何其他组件。

此函数将返回另一个组件。返回的组件将管理订阅并使用当前数据渲染 `<WrappedComponent />`。

我们把这个模式叫做高阶组件。

组合发生在 React 渲染级别，而不是直接调用函数。所以说被包装组件无论是用 `createClass()`创建的 、 ES6 类组件或是函数式组件都可以。如果 `WrappedComponent` 是一个 React 组件，则使用 `withSubscription()` 创建的组件都可以渲染它。


```js
// This function takes a component...
function withSubscription(WrappedComponent) {
  // ...and returns another component...
  return React.createClass({
    getInitialState: function () {
      return {
        comments: DataSource.getComments(),
      };
    },

    componentDidMount: function () {
      // ... that takes care of the subscription...
      DataSource.addChangeListener(this.handleChange);
    },

    componentWillUnmount: function () {
      DataSource.removeChangeListener(this.handleChange);
    },

    handleChange: function () {
      this.setState({
        comments: DataSource.getComments(),
      });
    },

    render: function () {
      // ... and renders the wrapped component with the fresh data!
      return <WrappedComponent comments={this.state.comments} />;
    },
  });
}
```

现在我们可以通过将 `withSubscription` 应用于 `CommentList` 来声明 `CommentListWithSubscription：`



```js
var CommentList = React.createClass({
  render: function () {
    var comments = this.props.comments;
    return (
      <div>
        {comments.map(function (comment) {
          return <Comment comment={comment} key={comment.id} />;
        })}
      </div>
    );
  },
});

// withSubscription() returns a new component that
// is subscribed to the data source and renders
// <CommentList /> with up-to-date data.
var CommentListWithSubscription = withSubscription(CommentList);

// The rest of the app is interested in the subscribed component
// so we export it instead of the original unwrapped CommentList.
module.exports = CommentListWithSubscription;
```

#### 已解决，复盘一下 {/*已解决，复盘一下*/}

现在我们更好地了解了高阶组件，让我们再来看一下不涉及 mixins 的完整解决方案。有一些小的更改用内联注释说明：

```js
function withSubscription(WrappedComponent) {
  return React.createClass({
    getInitialState: function () {
      return {
        comments: DataSource.getComments(),
      };
    },

    componentDidMount: function () {
      DataSource.addChangeListener(this.handleChange);
    },

    componentWillUnmount: function () {
      DataSource.removeChangeListener(this.handleChange);
    },

    handleChange: function () {
      this.setState({
        comments: DataSource.getComments(),
      });
    },

    render: function () {
      // Use JSX spread syntax to pass all props and state down automatically.
      return <WrappedComponent {...this.props} {...this.state} />;
    },
  });
}

// Optional change: convert CommentList to a function component
// because it doesn't use lifecycle methods or state.
function CommentList(props) {
  var comments = props.comments;
  return (
    <div>
      {comments.map(function (comment) {
        return <Comment comment={comment} key={comment.id} />;
      })}
    </div>
  );
}

// Instead of declaring CommentListWithSubscription,
// we export the wrapped component right away.
module.exports = withSubscription(CommentList);
```

高阶组件是一个强大的模式。如果你想进一步自定义它们的行为，你可以向它们传递其他参数。毕竟，他们甚至不是 React 的一个特征。它们只是接收组件并返回包装组件的函数。

像任何解决方案一样，高阶组件都有自己的缺陷。例如，如果你大量使用 [refs](/docs/more-about-refs.html)，你可能会注意到，将某些内容包装到更高阶的组件中会将 ref 更改为指向包装组件。实际上，我们不鼓励使用 ref 进行组件通信，所以我们不认为这是一个大问题。在将来，我们可能会考虑添加 ref 转发 到 React 来解决这个烦恼。

### 渲染逻辑 {/*渲染逻辑*/}

我们在代码库中发现的 mixins 的另一个最常见的用例是在组件之间共享渲染逻辑。

以下是此模式的典型示例：

```js
var RowMixin = {
  // Called by components from render()
  renderHeader: function () {
    return (
      <div className="row-header">
        <h1>{this.getHeaderText() /* Defined by components */}</h1>
      </div>
    );
  },
};

var UserRow = React.createClass({
  mixins: [RowMixin],

  // Called by RowMixin.renderHeader()
  getHeaderText: function () {
    return this.props.user.fullName;
  },

  render: function () {
    return (
      <div>
        {this.renderHeader() /* Defined by RowMixin */}
        <h2>{this.props.user.biography}</h2>
      </div>
    );
  },
});
```

多个组件可能共享 `RowMixin` 来渲染头部，并且每个组件都需要定义 `getHeaderText()`。

#### 解决方案 2 {/*solution-2*/}

如果你在 mixin 中看到渲染逻辑，说明该提取组件了！

与使用 `RowMixin` 相比，我们将定义一个 `<RowHeader>` 组件。我们还将使用 React 中的顶级数据流（props）的标准机制来替换定义 `getHeaderText()` 方法。

最后，既然这些组件当前都不需要生命周期钩子或 state，我们可以将它们声明为简单的函数式组件：


```js
function RowHeader(props) {
  return (
    <div className="row-header">
      <h1>{props.text}</h1>
    </div>
  );
}

function UserRow(props) {
  return (
    <div>
      <RowHeader text={props.user.fullName} />
      <h2>{props.user.biography}</h2>
    </div>
  );
}
```
Props使组件依赖性保持明确，易于替换，并可通过 [Flow](https://flowtype.org/)  和 [TypeScript](https://www.typescriptlang.org/) 等工具强制执行。

> **注意：**
>
> 定义组件为函数式组件并不是必须的。使用生命周期钩子和 state 也没有错，他们都是原生的 React 功能。我们在这个例子中使用函数式组件，因为它们更容易阅读，并且我们不需要这些额外的功能，当然使用类组件也可以正常工作。

### 上下文 {/*context*/}

我们发现的另一组 mixin 是提供和消费 [React 上下文](/docs/context.html)。上下文是一个实验性的不稳定特征，具有[一定的问题](https://github.com/facebook/react/issues/2517)，并且将来可能会改变其 API。我们不建议使用它，除非你确信没有其他方法来解决你的问题。

然而，如果你已经使用了上下文，那么你可能已经用这样的 mixin 隐藏了它的使用：

```js
var RouterMixin = {
  contextTypes: {
    router: React.PropTypes.object.isRequired,
  },

  // The mixin provides a method so that components
  // don't have to use the context API directly.
  push: function (path) {
    this.context.router.push(path);
  },
};

var Link = React.createClass({
  mixins: [RouterMixin],

  handleClick: function (e) {
    e.stopPropagation();

    // This method is defined in RouterMixin.
    this.push(this.props.to);
  },

  render: function () {
    return <a onClick={this.handleClick}>{this.props.children}</a>;
  },
});

module.exports = Link;
```

#### 解决方案 {/*solution-3*/}

我们认同在 Context API 稳定之前，隐藏使用组件 Context API 是一个好主意。但是，我们建议使用高阶组件而不是 mixins。

让包装组件从 context 中抓取东西，并使用 props 将其传递给被包装组件：



```js
function withRouter(WrappedComponent) {
  return React.createClass({
    contextTypes: {
      router: React.PropTypes.object.isRequired,
    },

    render: function () {
      // The wrapper component reads something from the context
      // and passes it down as a prop to the wrapped component.
      var router = this.context.router;
      return <WrappedComponent {...this.props} router={router} />;
    },
  });
}

var Link = React.createClass({
  handleClick: function (e) {
    e.stopPropagation();

    // The wrapped component uses props instead of context.
    this.props.router.push(this.props.to);
  },

  render: function () {
    return <a onClick={this.handleClick}>{this.props.children}</a>;
  },
});

// Don't forget to wrap the component!
module.exports = withRouter(Link);
```

如果你正在使用仅提供 mixin 的第三方库，我们建议你提交链接到此帖子的问题，以便他们可以提供更高级的组件。在此期间，你可以以完全相同的方式在其周围创建高阶组件。

### Utility Methods {/*utility-methods*/}

有时，mixins 仅用于在组件之间共享功能函数：

```js
var ColorMixin = {
  getLuminance(color) {
    var c = parseInt(color, 16);
    var r = (c & 0xff0000) >> 16;
    var g = (c & 0x00ff00) >> 8;
    var b = c & 0x0000ff;
    return 0.299 * r + 0.587 * g + 0.114 * b;
  },
};

var Button = React.createClass({
  mixins: [ColorMixin],

  render: function () {
    var theme = this.getLuminance(this.props.color) > 160 ? 'dark' : 'light';
    return <div className={theme}>{this.props.children}</div>;
  },
});
```

#### 解决方案 {/*solution-4*/}

将功能程序函数放入常规的 JavaScript 模块并导入。这也使得更容易测试它们或在组件之外使用它们：

```js
var getLuminance = require('../utils/getLuminance');

var Button = React.createClass({
  render: function () {
    var theme = getLuminance(this.props.color) > 160 ? 'dark' : 'light';
    return <div className={theme}>{this.props.children}</div>;
  },
});
```

### 其他情形 {/*other-use-cases*/}


有时，人们使用 mixin 来选择性地将日志记录添加到某些组件中的生命周期钩子中。在将来，我们打算提供一个 [official DevTools API](https://github.com/facebook/react/issues/5306)，可以让你实现类似的操作，而不必触及组件。然而，这仍然是一项正在进行的工作。如果你严重依赖日志 mixin 来进行调试，那么你可能希望继续使用这些 mixin 。

如果你无法使用组件，高阶组件或功能模块完成某些操作，则可能意味着 React 应提供额外的操作。在此提出问题，告诉我们你的关于 mixins 的用例，我们将帮助你考虑你的功能请求的替代方案，或者可能的实现方案。

Mixins 在传统场景下并不过期。你仍然可以通过使用 `React.createClass()` 继续使用它们，因为我们不会进一步改变它们。最终，随着 ES6 类得到更多的采用，在 React 中的可用性问题得到解决，我们可能将 `React.createClass()` 分解成一个单独的包，因为大多数人不需要它。即使在这种情况下，旧的 mixin 也会正常生效。

我们认为，在绝大多数情况下，上述替代方案更好，我们邀请你尝试在不使用 mixins 的情况下编写 React 应用程序。