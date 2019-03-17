---
title: “你可能不需要使用Derived State”
author: [bvaughn]
---

React 16.4版本修复了一个[getDerivedStateFromProps的bug](/blog/2018/05/23/react-v-16-4.html#bugfix-for-getderivedstatefromprops)的bug，这个bug会在React components复现一些已知的bug。如果这个版本导致出现的问题，导致您在修复过之后还已知出现的话，我们非常抱歉。在这篇文章里，我们会展示一些常见的反面模式，和相对应的，我们推荐的模式。

在很长一段时间内，生命周期函数`componentWillReceiveProps`是响应Props变化之后进行更新的唯一方式。16.3版本里, [我们介绍了一个替代版的生命周期函数：`getDerivedStateFromProps`](/blog/2018/03/29/react-v-16-3.html#component-lifecycle-changes)，尝试用一个更安全的方式达到同样的目的。与此同时，我们意识到人们对如何使用这两种方法存在许多误解，并且我们发现反模式会导致细微而混乱的错误。16.4版本修复的这个bug， [让derived state更加可控](https://github.com/facebook/react/issues/12898)，会让滥用导致的bug更容易被发现。

> 注意
>
> 下面所有的反面模式中，`componentWillReceiveProps`和`getDerivedStateFromProps`都是通用的。

 这篇blog包含以下主题：
* [什么时候使用derived state](#when-to-use-derived-state)
* [derived state的常见bug](#common-bugs-when-using-derived-state)
  * [反面模式：直接复制props到state上](#anti-pattern-unconditionally-copying-props-to-state)
  * [反面模式：在props变化后修改state](#anti-pattern-erasing-state-when-props-change)
* [建议的模式](#preferred-solutions)
* [尝试一下memoization？](#what-about-memoization)

## 什么时候使用derived state {#when-to-use-derived-state}

`getDerivedStateFromProps`的存在只有一个目的：让组件在**props变化**的时候更新state。上一个blog展示了一些示例，比如[props的offset变化时，修改当前的滚动方向](/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props)和[根据props变化加载外部数据](/blog/2018/03/27/update-on-async-rendering.html#fetching-external-data-when-props-change)。

我们没有提供很多示例，应为有**保守使用derived state**这个规则。大部分使用derived state导致的问题，不外乎两个原因：1，直接复制props到state上；2，如果props和state不一致就更新state。下面的示例包含了这两种情况。

* 如果你只是为了缓存（memoize）基于当前props计算后的结果的话，你就没必要使用derived state。[尝试一下memoization？](#what-about-memoization)。
* 如果只是用来保存props或者和当前state比较之后不一致后更新state，那你的组件应该是太频繁的更新了state。请继续阅读。

## Derived State的常见bug {#common-bugs-when-using-derived-state}

名词[“受控”](/docs/forms.html#controlled-components)和[“非受控”](/docs/uncontrolled-components.html)通常用来指代表单的inputs，但是也可以用来描述数据频繁更新的组件。用props传入数据的话，组件可以被认为是**受控**（因为组件被父级传入的props控制）。数据只保存在组件内部的state的话，是**非受控**组件（因为外部没办法直接控制state）。

常见的错误就是把两者混为一谈。当一个derived state值也被`setState`方法更新的时候，这个值就不是一个单一来源的值了。[加载外部数据示例](/blog/2018/03/27/update-on-async-rendering.html#fetching-external-data-when-props-change)描述的行为和这个类似，但是有很重要的区别。在加载外部数据示例中，数据`source`和`loading`都有非常清晰并且唯一的数据来源。当prop改变时，`loading`的状态**一定**会改变。相反，state只有在prop改变的时候才会改变，除非组件内部还有其他行为改变这个状态。

上述条件如果有一个不满足，就会导致问题，最常见的就是在两个表单里修改数据。

### 反面模式: 直接复制prop到state{#anti-pattern-unconditionally-copying-props-to-state}

最常见的误解就是`getDerivedStateFromProps`和`componentWillReceiveProps`只会在props“改变的”时候才会调用。实际上只要父级重新渲染的时候，这两个生命周期函数就会重新调用，不管props是不是“变化”了。所以，在这两个方法内直接复制（_unconditionally_）props到state是不安全的。**这样做会导致state后没有正确渲染**。

重现一下这个问题。这个`EmailInput`组件复制porops到state：
```js
class EmailInput extends Component {
  state = { email: this.props.email };

  render() {
    return <input onChange={this.handleChange} value={this.state.email} />;
  }

  handleChange = event => {
    this.setState({ email: event.target.value });
  };

  componentWillReceiveProps(nextProps) {
    // 这会覆盖所有组件内的state更新！
    // 不要这样做。
    this.setState({ email: nextProps.email });
  }
}
```

乍看之下还可以。state的初始值是props传来的，当在`<input>`里输入的时候，修改state。但是如果父组件重新渲染，我们输入的所有东西都会丢失！([查看这个示例](https://codesandbox.io/s/m3w9zn1z8x))，即使在重置state前比较`nextProps.email !== this.state.email`仍然会导致更新。

这个小例子中，使用`shouldComponentUpdate`，比较props的email是不是修改再决定要不要重新渲染。但是在实践中，一个组件会接收多个prop，任何一个prop的改变都会导致重新渲染和不正确的状态重置。加上行内函数和对象prop，创建一个完全可靠的`shouldComponentUpdate`会变得越来越难。[这个示例展示了这个情况](https://codesandbox.io/s/jl0w6r9w59)。而且`shouldComponentUpdate`的最佳实践是用于性能提升，而不是改正不合适的derived state。

希望以上能解释清楚为什么**直接复制prop到state是一个非常糟糕的想法**。在寻找解决方案之前，让我们看看一个相关的问题：假如我们只使用props中的email属性更新组件呢？

### 反面模式: 在props变化后修改state {#anti-pattern-erasing-state-when-props-change}

继续上面的示例，我们可以只使用`props.email`来更新组件，这样能防止修改state导致的bug：

```js
class EmailInput extends Component {
  state = {
    email: this.props.email
  };

  componentWillReceiveProps(nextProps) {
    // 只要props.email改变，就改变state
    if (nextProps.email !== this.props.email) {
      this.setState({
        email: nextProps.email
      });
    }
  }
  
  // ...
}
```

> 注意
>
> 示例中使用了`componentWillReceiveProps`，使用`getDerivedStateFromProps`也是一样。

我们已经做了一个很大的改进。现在组件只会在prop改变的时候才会改变。

但是仍然有个问题。想象一下，如果这是一个密码输入组件，拥有同样email的两个账户进行切换的时候，这个输入框不会重置（用来让用户重新登录）。因为父组件传来的prop值没有修改！这会让用户非常惊讶，因为这看起来像是帮助一个用户分享了另外一个用户的密码，([查看这个示例](https://codesandbox.io/s/mz2lnkjkrx))。

虽然这个设计就有问题，但是这样的错误很常见，([我就犯过这样的错误](https://twitter.com/brian_d_vaughn/status/959600888242307072))。幸运的是，有两个方案能解决这些问题。这两者的关键在于，**任何数据，都要保证只有一个数据来源，而且避免直接复制它**。我们来看看这两个方案。

## 建议的模式 {#preferred-solutions}

### 建议：完全可控的组件 {#recommendation-fully-controlled-component}

阻止上述问题发生的一个方法是，从组件里删除state。如果prop里包含了email，我们就没必要担心它和state冲突。我们甚至可以把`EmailInput`转换成一个轻量的函数组件：
```js
function EmailInput(props) {
  return <input onChange={props.onChange} value={props.email} />;
}
```

这样能用最简单的方式完成我们需要的组件。但是如果我们仍然想要保存临时的值，则需要父组件手动执行保存这个动作。([点击查看这个模式的演示](https://codesandbox.io/s/7154w1l551))。

### 建议：有key的非可控组件 {#recommendation-fully-uncontrolled-component-with-a-key}

另外一个选择是让组件自己存储临时的email state。在这种情况下，组件仍然可以从prop接收“初始值”，但是更改之后的值就和prop没关系了：

```js
class EmailInput extends Component {
  state = { email: this.props.defaultEmail };

  handleChange = event => {
    this.setState({ email: event.target.value });
  };

  render() {
    return <input onChange={this.handleChange} value={this.state.email} />;
  }
}
```

在这密码管理器的例子中，为了在不同的页面切换不同的值，我们可以使用`key`这个特殊的React属性。当`key`变化的时候，React会[创建一个新的而不是更新一个既有的组件](/docs/reconciliation.html#keys)。Keys一般用来渲染动态列表，但是这里也可以使用。在这个示例里，当用户输入的时候，我们使用user ID当作key重新创建一个新的email input组件：

```js
<EmailInput
  defaultEmail={this.props.user.email}
  key={this.props.user.id}
/>
```

每次ID更改，都会重新创建`EmailInput`，并将其状态重置为最新的`defaultEmail`值。([点击查看这个模式的演示](https://codesandbox.io/s/6v1znlxyxn)) 使用此方法，不用为每次输入都添加`key`，在整个表单上添加`key`更有位合理。每次的key变化，表单里的所有组件都会用新的初始值重新创建。

大部分情况下，这是处理重置state的最好的办法。

> 注意
>
> 这听起来很慢，但是这点的性能是可以忽略的。如果在组件树的更新上有很重的逻辑，这样反而会更快，因为省略了子组件diff。

#### 选项一：用prop的ID重置非受控组件 {#alternative-1-reset-uncontrolled-component-with-an-id-prop}

如果某些情况下`key`不起作用（可能是组件初始化的开销太大），一个麻烦但是可行的方案是在`getDerivedStateFromProps`观察`userID`的变化：

```js
class EmailInput extends Component {
  state = {
    email: this.props.defaultEmail,
    prevPropsUserID: this.props.userID
  };

  static getDerivedStateFromProps(props, state) {
    // 只要当前user变化，
    // 重置所有跟user相关的状态。
    // 这个例子中，只有email和user相关。
    if (props.userID !== state.prevPropsUserID) {
      return {
        prevPropsUserID: props.userID,
        email: props.defaultEmail
      };
    }
    return null;
  }

  // ...
}
```

如果你乐意，你也可以只重置一小部分state([点击查看这个模式的演示](https://codesandbox.io/s/rjyvp7l3rq))。

> 注意
>
>上面的示例使用了`getDerivedStateFromProps`，用`componentWillReceiveProps`也一样。

#### 选项二：使用实例方法重置非受控组件 {#alternative-2-reset-uncontrolled-component-with-an-instance-method}

更少见的情况是，即使没有合适的`key`，我们也想重新创建组件。一种解决方案是给一个随机值或者递增的值当作`key`，另外一种是用示例方法强制重置内部状态：

```js
class EmailInput extends Component {
  state = {
    email: this.props.defaultEmail
  };

  resetEmailForNewUser(newEmail) {
    this.setState({ email: newEmail });
  }

  // ...
}
```

然后父级组件可以[使用`ref`调用这个方法](/docs/glossary.html#refs)。([点击查看这个模式的演示](https://codesandbox.io/s/l70krvpykl))。

Refs在某些情况下很有用，比如这个。但通常我们建议谨慎使用。即使是做一个演示，这个命令式的方法也是非理想的，因为这会导致两次而不是一次渲染。

-----

### 概括 {#recap}

回顾一下，设计组件的时候，重要的是确定组件是受控组件还是非受控组件。

不要直接复制（mirror）props的值到state中，而是去实现一个**受控**的组件，然后在父组件里合并两个值。比如，不要在子组件里被动的接受`props.value`并跟踪一个临时的`state.value`，而要在父组件里管理`state.draftValue`和`state.committedValue`，直接控制子组件里的值。这样数据才更加明确可预测。

对于**不受控**的组件，当你想在prop变化（通常是ID）的时候重置state的话，可以选择一下几种方式：
* **建议: 重置内部所有的初始state，使用`key`属性**
* 选项一：仅更改某些字段，观察特殊属性的变化（比如`props.userID`）。
* 选项二：使用ref调用实例方法。

## 尝试一下memoization？ {#what-about-memoization}

我们上面用到了————仅在输入变化的时候，重新计算`render`需要使用的值————这个技术叫做[memoization](https://en.wikipedia.org/wiki/Memoization).

把derived state用作memoization并不是什么坏事情，但是这并不是好的方法。管理derived state本来就很复杂，而且这种复杂度是随着需要管理的属性变得越来越庞大。比如，如果我们想在组件state里添加第二个derived state，那就需要写两份跟踪变化的逻辑。

这里有个示例，组件使用一个prop————一个列表————并在用户输入查询条件时显示匹配的项，我们可以使用derived state存储过滤后的列表：

```js
class Example extends Component {
  state = {
    filterText: "",
  };

  // *******************************************************
  // 注意：这个例子不是建议的方法。
  // 下面的例子才是建议的方法。
  // *******************************************************

  static getDerivedStateFromProps(props, state) {
    // 列表变化或者过滤文本变化的时候都重新过滤。
    // 注意我们要存储prevFilterText和prevPropsList来检测变化。
    if (
      props.list !== state.prevPropsList ||
      state.prevFilterText !== state.filterText
    ) {
      return {
        prevPropsList: props.list,
        prevFilterText: state.filterText,
        filteredList: props.list.filter(item => item.text.includes(state.filterText))
      };
    }
    return null;
  }

  handleChange = event => {
    this.setState({ filterText: event.target.value });
  };

  render() {
    return (
      <Fragment>
        <input onChange={this.handleChange} value={this.state.filterText} />
        <ul>{this.state.filteredList.map(item => <li key={item.id}>{item.text}</li>)}</ul>
      </Fragment>
    );
  }
}
```

这个实现避免了重复计算`filteredList`，但是过于复杂。因为它必须单独追踪并检测prop和state的变化，在能及时的更新过滤后的list。我们可以使用`PureComponent`，把过滤操作放到render方法里来简化这个组件：

```js
// PureComponents只会在state或者prop的值修改的时候才会再次渲染。
// 通过对state和prop的key做浅比较（shallow comparison）来确定有没有变化。
class Example extends PureComponent {
  // State只需要保存filter的值：
  state = {
    filterText: ""
  };

  handleChange = event => {
    this.setState({ filterText: event.target.value });
  };

  render() {
    // PureComponent的render只有
    // 在props.list或state.filterText变化的时候才会调用
    const filteredList = this.props.list.filter(
      item => item.text.includes(this.state.filterText)
    )

    return (
      <Fragment>
        <input onChange={this.handleChange} value={this.state.filterText} />
        <ul>{filteredList.map(item => <li key={item.id}>{item.text}</li>)}</ul>
      </Fragment>
    );
  }
}
```

上面的方法比derived state版本更加清晰明了。只有在过滤很大的列表的时候，这样做的效率不是很好。当有prop改变的时候`PureComponent`不会阻止再次渲染。为了解决这两个问题，我们可以添加memoization帮助函数来阻止非必要的过滤：

```js
import memoize from "memoize-one";

class Example extends Component {
  // State只需要保存当前的filter值：
  state = { filterText: "" };

  // 在list数组或者filter变化时，重新运行filter：
  filter = memoize(
    (list, filterText) => list.filter(item => item.text.includes(filterText))
  );

  handleChange = event => {
    this.setState({ filterText: event.target.value });
  };

  render() {
    // 计算最新的过滤后的list。
    // 如果和上次render参数一样，`memoize-one`会重复使用上一次的值。
    const filteredList = this.filter(this.props.list, this.state.filterText);

    return (
      <Fragment>
        <input onChange={this.handleChange} value={this.state.filterText} />
        <ul>{filteredList.map(item => <li key={item.id}>{item.text}</li>)}</ul>
      </Fragment>
    );
  }
}
```

这样更简单，而且和derived state版本一样好！

在使用memoization时，请记住这些约束：

1. 大部分情况下， **每个组件内部都要引入memoized方法**，已免实例之间相互影响。
2. 一般情况下，我们会**限制memoization helper的缓存空间**，以免内存泄漏。（上面的例子中，使用`memoize-one`是因为它只缓存最后一次的参数和结果）。
3. 如果每次父组件都传入新的`props.list`，那本文提到的问题都不会遇到。在大多数情况下，这种方式是可取的。

## 结束语 {#in-closing}

在实际应用中，组件一般既包含了controlled和uncontrolled行为。这是正常的！不过如果每个值都有明确的来源，则可以避免上面提到的反面模式。

`getDerivedStateFromProps`（以及其他derived state）是一个高级复杂的功能，应该保守使用，这个再怎么重申也不过分。如果你的用法不属于这些模式，请在[GitHub](https://github.com/reactjs/reactjs.org/issues/new)或[Twitter](https://twitter.com/reactjs)与我们分享！

---

> 译注
>
> 反面模式是anti-patterns的翻译，参考[wiki页面](https://zh.wikipedia.org/zh-cn/%E5%8F%8D%E9%9D%A2%E6%A8%A1%E5%BC%8F)
>
> derived state应该翻译成派生状态，但是这个词好像并不怎么流行，不是那么通用。所以我觉得就没必要再记一个新的词汇了，就没翻译。
