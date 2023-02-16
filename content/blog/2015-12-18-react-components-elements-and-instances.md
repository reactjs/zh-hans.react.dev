---
title: "React 组件，元素和实例"
author: [gaearon]
---

许多 React 初学者对**组件、其实例以及元素**之间的区别感到困惑。为什么有三个不同的术语来指代屏幕上绘制的内容？

## 管理实例 {#managing-the-instances}

如果你不熟悉 React，那么此前你可能仅仅工作用到过组件类和实例。例如，你可能通过新建一个 class 来声明 `Button` *组件*。当 app 运行起来以后，你可能会有若干个拥有自己属性和本地 state 的*实例*运行在屏幕上。这是传统的面向对象 UI 编程。那为什么要引入*元素*？

在这些传统的 UI 模型中，需要由你来关心创建及销毁子组件们的实例。如果一个 `Form` 组件要渲染一个 `Button` 组件，那么它需要创建其实例并手动根据最新的信息使其保持同步。

```js
class Form extends TraditionalObjectOrientedView {
  render() {
    // 读取一些数据到当前视图
    const { isSubmitted, buttonText } = this.attrs;

    if (!isSubmitted && !this.button) {
      // 表单还未提交。创建按钮！
      this.button = new Button({
        children: buttonText,
        color: 'blue'
      });
      this.el.appendChild(this.button.el);
    }

    if (this.button) {
      // 按钮可见。更新其文本！
      this.button.attrs.children = buttonText;
      this.button.render();
    }

    if (isSubmitted && this.button) {
      // 表单已提交。销毁按钮！
      this.el.removeChild(this.button.el);
      this.button.destroy();
    }

    if (isSubmitted && !this.message) {
      // 表达已经提交。显示成功信息！
      this.message = new Message({ text: 'Success!' });
      this.el.appendChild(this.message.el);
    }
  }
}
```

虽然这是一段伪代码，但只要你在使用一个库（比如 Backbone）编写复合界面代码的同时，恪守面向对象的思想，最终代码多少都会变成这个样子。

每个组件实例都必须保持对 DOM 节点和子组件实例的引用，同时在正确的时机新建、更新、销毁它们。随着组件可能状态的平方式增长，代码行数也将增长。与此同时，父组件直接访问子组件实例也使得将来它们彼此之间更难解耦。

所以 React 有何不同呢？

## 元素描述了树 {#elements-describe-the-tree}

这正是 React 希望*元素*施展拳脚之处。**元素是一个用来*描述*组件实例或 DOM 节点及其需要属性的普通对象**。它只包含组件类型（比如 `Button`），其属性（比如`color`）以及所有其下子元素的相关信息。

一个元素不是一个确切的实例。他是一种告诉 React 你*想要*在屏幕上看到什么的方法。你不能在元素上调用任何方法。它只是一个携有 `type: (string | ReactClass)` 和 `props: Object`[^1] 字段的不可变描述对象。

### DOM 元素 {#dom-elements}

当一个元素的 `type` 是字符串时，它代表了一个具有该标签名称的 DOM 节点。`props` 对应于它的属性。React 这就是 React 将呈现的内容。举个例子：

```js
{
  type: 'button',
  props: {
    className: 'button button-blue',
    children: {
      type: 'b',
      props: {
        children: 'OK!'
      }
    }
  }
}
```

这个元素只不过是一种将下面这段 HTML 表示成一个普通对象的方法。

```html
<button class='button button-blue'>
  <b>
    OK!
  </b>
</button>
```

注意元素是如何嵌套的。按照惯例，当我们要创建一棵 element tree 时，我们指定一或多个子元素作为其 `children` 成员。

重要的是子元素和父元素*仅仅作为描述而不是真正的实例*。当你创建了它们，它们并不代表任何屏幕上的东西。你可以创建、丢弃它们，不必担心什么。

React 元素易于遍历，无需解析。此外它们比起真实的 DOM 元素更轻——它们只是对象！

### 组件元素 {#component-elements}

然而，元素的 `type` 究竟是一个函数还是一个类则视 React 组件而定：

```js
{
  type: Button,
  props: {
    color: 'blue',
    children: 'OK!'
  }
}
```

这是 React 的核心思想。

**一个用于描述组件的元素也是一个元素，就像一个用于描述 DOM 节点的元素一样。它们可以彼此嵌套，互相混合。**

该特性让你可以将 `DangerButton` 组件定义为一个被指定 `color` 值的 `Button`，而你完全不必关心 `Button` 是渲染成一个 DOM `<button>`、`<div>` 或其他东西。

```js
const DangerButton = ({ children }) => ({
  type: Button,
  props: {
    color: 'red',
    children: children
  }
});
```

你可以混合和匹配 DOM 及组件元素在一个单独的 element tree 中：

```js
const DeleteAccount = () => ({
  type: 'div',
  props: {
    children: [{
      type: 'p',
      props: {
        children: 'Are you sure?'
      }
    }, {
      type: DangerButton,
      props: {
        children: 'Yep'
      }
    }, {
      type: Button,
      props: {
        color: 'blue',
        children: 'Cancel'
      }
   }]
});
```

或者，如果你喜欢 JSX：

```js
const DeleteAccount = () => (
  <div>
    <p>Are you sure?</p>
    <DangerButton>Yep</DangerButton>
    <Button color='blue'>Cancel</Button>
  </div>
);
```

这种混合和匹配有助于组件彼此分离，因为它们可以仅仅通过组合来表示 *is-a* 和 *has-a* 的关系:

* `Button` 是一个被指定部分属性的 DOM `<button>`。
* `DangerButton` 是一个被指定部分属性的 `Button`。
* `DeleteAccount` 在一个 `<div>`中包含一个 `Button` 和一个 `DangerButton` 。

### 组件封装 Element Trees {#components-encapsulate-element-trees}

当 React 遇到一个带有函数或类 `type` 的元素时，它知道要问*那个*组件它要呈现什么元素，并给出相应的 `props`。

当它遇到这个元素:

```js
{
  type: Button,
  props: {
    color: 'blue',
    children: 'OK!'
  }
}
```

React 将问 `Button` 它将渲染成什么。`Button` 将会返回这个元素：

```js
{
  type: 'button',
  props: {
    className: 'button button-blue',
    children: {
      type: 'b',
      props: {
        children: 'OK!'
      }
    }
  }
}
```

React 将重复这个过程直到它知道了页面上每一个组件之下的 DOM 标签元素。

React 就像一个孩子。在搞清楚这个世界的每一件小事之前，它都要向每一个你所解释的 ”X是Y“ 询问 ”Y是什么“。

还记得之前 `Form` 的例子吗？它可以用 React 编写如下[^1]：

```js
const Form = ({ isSubmitted, buttonText }) => {
  if (isSubmitted) {
    // Form 提交了！返回一个 message 元素。
    return {
      type: Message,
      props: {
        text: 'Success!'
      }
    };
  }

  // Form 还在继续显示！返回一个 button 元素。
  return {
    type: Button,
    props: {
      children: buttonText,
      color: 'blue'
    }
  };
};
```

这就是它！对于一个 React 组件，props 就是输入，element tree 就是输出。

**返回的 element tree 可以包含描述 DOM 节点的元素，描述其他组件的元素。这使你可以组成 UI 的独立部分，而无需依赖其内部 DOM 结构。**

我们让 React 创建，更新，销毁实例。我们通过组件返回的元素*描述*它们，而 React 负责管理这些实例。

### 组件可以是类或函数 {#components-can-be-classes-or-functions}

在之前的代码中，`Form`, `Message` 和 `Button` 是 React 组件。它们既可以像此前那样被写作函数，也可以通过`React.Component`写作类。这三种声明组件的方式几乎是等效的：

```js
// 1) 作为一个带 props 的函数
const Button = ({ children, color }) => ({
  type: 'button',
  props: {
    className: 'button button-' + color,
    children: {
      type: 'b',
      props: {
        children: children
      }
    }
  }
});

// 2) 使用 React.createClass() 工厂
const Button = React.createClass({
  render() {
    const { children, color } = this.props;
    return {
      type: 'button',
      props: {
        className: 'button button-' + color,
        children: {
          type: 'b',
          props: {
            children: children
          }
        }
      }
    };
  }
});

// 3) 作为从 React.Component 继承的ES6类
class Button extends React.Component {
  render() {
    const { children, color } = this.props;
    return {
      type: 'button',
      props: {
        className: 'button button-' + color,
        children: {
          type: 'b',
          props: {
            children: children
          }
        }
      }
    };
  }
}
```

当一个组件用类定义时，它会比一个函数组件要强大一点。当创建或销毁相应的 DOM 节点时，它能存储一些本地状态并执行自定义逻辑。

函数组件功能更弱，但它更简单。它就像一个只有 `render()` 方法的 class 组件。除非你需要只有从类组件那才能得到的功能，否则我们建议你用函数组件。

**然而，不论函数或类，根本上来说它们都是 React 组件。它们将 props 作为输入，返回元素作为输出。**

### 自上而下的的协调 {#top-down-reconciliation}

当你调用：

```js
ReactDOM.render({
  type: Form,
  props: {
    isSubmitted: false,
    buttonText: 'OK!'
  }
}, document.getElementById('root'));
```

React 先将那些 `props` 传入 `Form` 组件，随后等待返回 element tree。它将通过更简单的”基元“逐步完善对组件树的理解：

```js
// React: 你告诉了我这...
{
  type: Form,
  props: {
    isSubmitted: false,
    buttonText: 'OK!'
  }
}

// React: ...然后 Form 告诉了我这...
{
  type: Button,
  props: {
    children: 'OK!',
    color: 'blue'
  }
}

// React: ...然后 Button 告诉了我这！我觉得我做完了。
{
  type: 'button',
  props: {
    className: 'button button-blue',
    children: {
      type: 'b',
      props: {
        children: 'OK!'
      }
    }
  }
}
```

这是 React 称之为[协调](/docs/reconciliation.html)过程的一部分。它开始于你调用 [`ReactDOM.render()`](/docs/top-level-api.html#reactdom.render) 或 [`setState()`](/docs/component-api.html#setstate)。在协调结束的时候，React 知道了结果的 DOM 树，然后一个渲染器像 `react-dom` 或 `react-native` 尽可能使用最少的变化来更新 DOM 节点（或在 React Native 中的特定平台视图）。

这种逐步改善过程也是为什么 React 应用易于优化的原因。如果你组件树的一部分因为变得太大导致 React 无法高效的访问，你可以告诉它[如果相关props没有变化，跳过这个”改善“并且只比对树的某些部分](/docs/advanced-performance.html)。如果 props 是不可变的，那么计算其是否发生变化是非常快的，因此 React 和不可变性可以很好地协同工作，并且可以以最小的努力提供出色的优化。

你可能已经注意到，此博客文章讨论了很多组件和元素的内容，没有提到太多实例。事实上，与绝大多数面向对象 UI 框架相比，实例在 React 中的重要性要小很多。

只有使用类声明的组件有实例，而且你永远不会直接创建它们：React 为你做了那些。尽管存在[父组件实例访问子组件实例的机制](/docs/more-about-refs.html)，但只要不是万不得已（譬如为某个字段设置聚焦），我们通常都应该避免这种操作。

React 负责为每个类组件创建一个实例，所以你可以用面向对象的方法写一个带有方法和本地状态的组件。但除此之外，在 React 的编程模型中实例并不十分重要，而且这些都由它自己管理。

## 总结 {#summary}
## Summary {#summary}

一个*元素*是一个普通的对象。它被用来描述什么需要在屏幕上显示，根据 DOM 节点还是其他组件。元素可以在它们的 props 里包含其他元素。创建一个 React 元素很廉价。一旦一个元素被创建了，它就不再改变。

一个*组件*可以通过多种不同的方式声明。它可以是一个带有 `render()` 方法的类。或者，更简单些，它可以被定义成一个函数。不论何种方式，它都需要 props 作为输入，返回一个 element tree 作为输出。

当一个组件收到一些 props 作为输入，其必是因为某个父组件返回了一个带有它 `type` 和这些 props 的元素。这就是为什么在 React 中人们说 props 是单向流：从父级到子级。

*实例*是你在编写组件类中称为`this`的东西。它在[保存本地状态和响应生命周期事件](/docs/component-api.html)上很有用。

函数组件根本没有实例。类组件才有实例，但你永远不需要去直接创建组件实例——React 会负责这些。

最后，要新建一个元素，使用[`React.createElement()`](/docs/top-level-api.html#react.createelement)， [JSX](/docs/jsx-in-depth.html), 或 [element factory helper](/docs/top-level-api.html#react.createfactory)。不要在真实代码中将元素写作普通对象——知道它们是处于底层的普通对象足矣。

## 拓展阅读 {#further-reading}

* [Introducing React Elements](/blog/2014/10/14/introducing-react-elements.html)
* [Streamlining React Elements](/blog/2015/02/24/streamlining-react-elements.html)
* [React (Virtual) DOM Terminology](/docs/glossary.html)

[^1]: 出于[安全原因](https://github.com/facebook/react/pull/4832)，所有 React 元素都需要在对象上声明一个额外的 ``$$typeof: Symbol.for('react.element')`` 字段。在上文的示例中将其省略了。为了使你理解底层发生了什么，这篇博客为元素使用了内联对象，但无论是为元素添加 `$$typeof` 还是更改代码使用 `React.createElement()` 或 JSX，代码都不会如预期运行。
