---
id: integrating-with-other-libraries
title: 与第三方库协同
permalink: docs/integrating-with-other-libraries.html
---

React 可以被用于任何 web 应用中。它可以被嵌入到其他应用，且需要注意，其他的应用也可以被嵌入到 React。本指南将介绍一些更常见的用例，专注于与 [jQuery](https://jquery.com/) 和 [Backbone](http://backbonejs.org/) 进行整合，同样的思路还可以应用于将组件与任意现有代码集成。

## 集成带有 DOM 操作的插件 {#integrating-with-dom-manipulation-plugins}

React 不会理会 React 自身之外的 DOM 操作。它根据内部虚拟 DOM 来决定是否需要更新，而且如果同一个 DOM 节点被另一个库操作了，React 会觉得困惑而且没有办法恢复。

这并不意味着 React 与其他操作 DOM 的方式不能结合，也不一定结合困难，只不过需要你去关注每个库所做的事情。

避免冲突的最简单方式就是防止 React 组件更新。你可以渲染无需更新的 React 元素，比如一个空的 `<div />`。

### 如何解决这个问题 {#how-to-approach-the-problem}

为了证明这一点，我来草拟一个用于通用 jQuery 插件的 wrapper

我们会添加一个 [ref](/docs/refs-and-the-dom.html) 到这个根 DOM 元素。 在 `componentDidMount` 中，我们能够获取它的引用这样我们就可以把它传递给 jQuery 插件了。

为了防止 React 在挂载之后去触碰这个 DOM，我们会从 `render()` 函数返回一个空的 `<div />`。这个 `<div />` 元素既没有属性也没有子元素，所以 React 没有理由去更新它，使得 jQuery 插件可以自由的管理这部分的 DOM：

```js{3,4,8,12}
class SomePlugin extends React.Component {
  componentDidMount() {
    this.$el = $(this.el);
    this.$el.somePlugin();
  }

  componentWillUnmount() {
    this.$el.somePlugin('destroy');
  }

  render() {
    return <div ref={el => this.el = el} />;
  }
}
```

注意我们同时定义了 `componentDidMount` 和 `componentWillUnmount` [生命周期函数](/docs/react-component.html#the-component-lifecycle)。许多 jQuery 插件绑定事件监听到 DOM 上，所以在 `componentWillUnmount` 中注销监听是很重要的。如果这个插件没有提供一个用于清理的方法，你很可能会需要自己来提供一个，为了避免内存泄漏要记得把所有插件注册的监听都移除掉。

### 集成 jQuery Chosen 插件 {#integrating-with-jquery-chosen-plugin}

对于应用这些概念的更具体的一个例子，我们给这个用于增强 `<select>` 输入的 [Chosen](https://harvesthq.github.io/chosen/) 插件写一个最小的 wrapper。

>**注意：**
>
>仅仅是因为可能，但这并不意味着这是构建 React 应用的最佳方式。我们鼓励大家尽可能的使用 React 组件。组件在 React 应用中更易于复用，并且在大多数情况下能更好地控制其行为和显示。

首先，我们来看下 Chosen 对 DOM 做了哪些操作

如果你在一个 `<select>` DOM 节点上调用了它，它会读取原 DOM 节点的属性，使用行内样式隐藏它，然后紧挨着这个 `<select>` 之后增加一个独立的具有它自身显示表现的 DOM 节点。然后它会在值变化的时候触发 jQuery 事件来通知我们这些变化。

以下代码是我们最终要实现的效果：

```js
function Example() {
  return (
    <Chosen onChange={value => console.log(value)}>
      <option>vanilla</option>
      <option>chocolate</option>
      <option>strawberry</option>
    </Chosen>
  );
}
```

为了简化，我们将它实现为 [uncontrolled component](/docs/uncontrolled-components.html)

首先，我会创建一个空的组件，它的 `render()` 函数我们返回一个包含 `<select>` 的 `<div>`:

```js{4,5}
class Chosen extends React.Component {
  render() {
    return (
      <div>
        <select className="Chosen-select" ref={el => this.el = el}>
          {this.props.children}
        </select>
      </div>
    );
  }
}
```

注意我们为什么要把 `<select>` 使用一个额外的 `<div>` 包裹起来。这是很必要的，因为 Chosen 会紧挨着我们传递给它的 `<select>` 节点追加另一个 DOM 元素。然而，对于 React 来说 `<div>` 总是只有一个子节点。这样我们就能确保 React 更新不会和 Chosen 追加的额外 DOM 节点发生冲突。在 React 工作流之外修改 DOM 是非常重大的事情，你必须确保 React 没有理由去触碰那些节点。

接下来，我们会实现生命周期函数。我们需要在 `componentDidMount` 中使用 `<select>` 的引用初始化 Chosen，并且在 `componentWillUnmount` 中将其销毁:

```js{2,3,7}
componentDidMount() {
  this.$el = $(this.el);
  this.$el.chosen();
}

componentWillUnmount() {
  this.$el.chosen('destroy');
}
```

[**在 CodePen 上运行**](http://codepen.io/gaearon/pen/qmqeQx?editors=0010)

注意 React 不会给 `this.el` 字段赋予特殊的含义。它能够工作只是因为我们之前在 `render()` 函数中把一个 `ref` 赋值给了这个字段：

```js
<select className="Chosen-select" ref={el => this.el = el}>
```

到此已经足够让我们的组件去渲染了，但我们同时希望在值变化的时候被通知到。要做到这点，我们需要在订阅由 Chosen 管理的 `<select>` 上的 jQuery `change` 事件。

我们不直接把 `this.props.onChange` 传递给 Chosen 是因为组件的 props 可能随时变化，并且这也包括事件处理函数。对应的，我们会定义一个 `handleChange()` 方法来调用 `this.props.onChange`，并且订阅 jQuery 的 `change` 事件：

```js{5,6,10,14-16}
componentDidMount() {
  this.$el = $(this.el);
  this.$el.chosen();

  this.handleChange = this.handleChange.bind(this);
  this.$el.on('change', this.handleChange);
}

componentWillUnmount() {
  this.$el.off('change', this.handleChange);
  this.$el.chosen('destroy');
}

handleChange(e) {
  this.props.onChange(e.target.value);
}
```

[**在 CodePen 上运行**](http://codepen.io/gaearon/pen/bWgbeE?editors=0010)

最后，还剩下一件事情需要处理。在 React 中，props 可以在不同的时间有不同的值。例如，如果父组件的状态发生变化 `<Chosen>` 组件可能得到不同的 children。这意味着从集成的角度来看，我们因应 prop 的更新而手动更新 DOM 这一点是非常重要的，因为我们已经不再使用 React 来帮我们管理 DOM 了。

Chosen 的文档建议我们使用 jQuery `trigger()` API 来通知原始 DOM 元素这些变化。我们会让 React来管理在 `<select>` 中 `this.props.children` 的更新，但是我们同样需要增加一个 `componentDidUpdate()` 生命周期函数来通知 Chosen 关于 children 列表的变化：

```js{2,3}
componentDidUpdate(prevProps) {
  if (prevProps.children !== this.props.children) {
    this.$el.trigger("chosen:updated");
  }
}
```

通过这种方法，当由 React 管理的 `<select>` children 改变时， Chosen 会知道如何更新它的 DOM 元素。

`Chosen` 组件的完整实现看起来是这样的：

```js
class Chosen extends React.Component {
  componentDidMount() {
    this.$el = $(this.el);
    this.$el.chosen();

    this.handleChange = this.handleChange.bind(this);
    this.$el.on('change', this.handleChange);
  }
  
  componentDidUpdate(prevProps) {
    if (prevProps.children !== this.props.children) {
      this.$el.trigger("chosen:updated");
    }
  }

  componentWillUnmount() {
    this.$el.off('change', this.handleChange);
    this.$el.chosen('destroy');
  }
  
  handleChange(e) {
    this.props.onChange(e.target.value);
  }

  render() {
    return (
      <div>
        <select className="Chosen-select" ref={el => this.el = el}>
          {this.props.children}
        </select>
      </div>
    );
  }
}
```

[**在 CodePen 上运行**](http://codepen.io/gaearon/pen/xdgKOz?editors=0010)

## 和其他视图库集成 {#integrating-with-other-view-libraries}

得益于 [`createRoot()`](/docs/react-dom-client.html#createRoot) 的灵活性 React 可以被嵌入到其他的应用中。

虽然 React 通常被用来在启动的时候加载一个单独的根 React 组件到 DOM 上，`createRoot()` 同样可以在 UI 的独立部分上多次调用，这些部分可以小到一个按钮，也可以大到一个应用。

事实上，这正是 Facebook 如何使用 React 的。这让我们小块小块地在应用中使用 React，并且把他们结合到我们现存的服务端产生的模板和其他客户端代码中。

### 利用 React 替换基于字符串的渲染 {#replacing-string-based-rendering-with-react}

在旧的 web 应用中一个通用的模式就是使用一个字符串描述 DOM 块并且通过类似 `$el.html(htmlString)` 这样的方式插入到 DOM 中。代码库中的这种例子是非常适合引入 React 的。直接把基于字符串的渲染重写成 React 组件即可。

那么下面这段 jQuery 的实现...

```js
$('#container').html('<button id="btn">Say Hello</button>');
$('#btn').click(function() {
  alert('Hello!');
});
```

...可以使用 React 组件重写为：

```js
function Button() {
  return <button id="btn">Say Hello</button>;
}

$('#btn').click(function() {
  alert('Hello!');
});
```

从这起你可开始以把更多的逻辑移动到组件中，并且开始应用更多通用 React 实践。例如，在组件中最好不要依赖 ID 因为同一个组件可能会被渲染多次。相反的，我们会使用 [React 事件系统](/docs/handling-events.html) 并且直接注册 click 处理函数到 React `<button>` 元素：

```js{2,6,9}
function Button(props) {
  return <button onClick={props.onClick}>Say Hello</button>;
}

function HelloButton() {
  function handleClick() {
    alert('Hello!');
  }
  return <Button onClick={handleClick} />;
}
```

[**在 CodePen 上运行**](http://codepen.io/gaearon/pen/RVKbvW?editors=1010)

只要你喜欢你可以有不限数量的这种独立组件，并且使用 `ReactDOM.createRoot()` 把他们渲染到不同的容器中。逐渐的，随着你把越来越多的应用转换到 React，你就可以把它们结合成更大的组件，并且把 `ReactDOM.createRoot()` 的调用移动到更上层的结构。

### 把 React 嵌入到 Backbone 视图 {#embedding-react-in-a-backbone-view}

[Backbone](http://backbonejs.org/) 视图通常使用 HTML 字符串，或者产生字符串的模板函数，来创建 DOM 元素的内容。这个过程，同样的，可以通过渲染一个 React 组件来替换掉。

如下，我们会创建一个名为 `ParagraphView` 的 Backbone 视图。他会重载 Backbone 的 `render()` 函数来渲染一个 React `<Paragraph>` 组件到 Backbone (`this.el`) 提供的 DOM 元素中。这里，同样的，我们将会使用 [`ReactDOM.createRoot()`](/docs/react-dom-client.html#createroot)：

```js{7,11,15}
function Paragraph(props) {
  return <p>{props.text}</p>;
}

const ParagraphView = Backbone.View.extend({
  initialize(options) {
    this.reactRoot = ReactDOM.createRoot(this.el);
  },
  render() {
    const text = this.model.get('text');
    this.reactRoot.render(<Paragraph text={text} />);
    return this;
  },
  remove() {
    this.reactRoot.unmount();
    Backbone.View.prototype.remove.call(this);
  }
});
```

[**在 CodePen 上运行**](http://codepen.io/gaearon/pen/gWgOYL?editors=0010)

在 `remove` 方法中我们也需要调用 `root.unmount()` 以便在它解除的时候 React 清理组件树相关的事件处理的注册和其他的资源，这点是是很重要的。

当一个组件在 React 树中*从内部*删除的时候，清理工作是自动完成的，但是因为我们现在手动移除整个树，我们必须调用这个方法。

## 和 Model 层集成 {#integrating-with-model-layers}

虽然通常是推荐使用单向数据流动的，例如 [React state](/docs/lifting-state-up.html)，[Flux](http://facebook.github.io/flux/)，或者 [Redux](http://redux.js.org/)，React 组件也可以使用一个其他框架和库的 Model 层。

### 在 React 组件中使用 Backbone 的 Model {#using-backbone-models-in-react-components}

在 React 组件中使用 [Backbone](http://backbonejs.org/) 的 model 和 collection 最简单的方法就是监听多种变化事件并且手动强制触发一个更新。

负责渲染 model 的组件会监听 `'change'` 事件，而负责渲染 collection 的组件需要监听 `'add'` 和 `'remove'` 事件。在这两种情况中，调用 [`this.forceUpdate()`](/docs/react-component.html#forceupdate) 来使用新的数据重新渲染组件。

在下面的例子中，`List` 组件渲染一个 Backbone collection，使用 `Item` 组件来渲染独立的项。

```js{1,7-9,12,16,24,30-32,35,39,46}
class Item extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.forceUpdate();
  }

  componentDidMount() {
    this.props.model.on('change', this.handleChange);
  }

  componentWillUnmount() {
    this.props.model.off('change', this.handleChange);
  }

  render() {
    return <li>{this.props.model.get('text')}</li>;
  }
}

class List extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.forceUpdate();
  }

  componentDidMount() {
    this.props.collection.on('add', 'remove', this.handleChange);
  }

  componentWillUnmount() {
    this.props.collection.off('add', 'remove', this.handleChange);
  }

  render() {
    return (
      <ul>
        {this.props.collection.map(model => (
          <Item key={model.cid} model={model} />
        ))}
      </ul>
    );
  }
}
```

[**在 CodePen 上运行**](http://codepen.io/gaearon/pen/GmrREm?editors=0010)

### 从 Backbone Model 提取数据 {#extracting-data-from-backbone-models}

前面的方式需要你的 React 组件知道 Backbone 的 model 和 collection。如果你计划迁移到另一个数据管理方案，你可能希望将关于Backbone的知识集中在尽可能少的代码部分中。

其中一个解决方案就是每当 model 中的属性变化时都把它提取成简单数据，并且把这个逻辑放在一个独立的地方。下面是一个[高阶组件](/docs/higher-order-components.html)，它提取了 Backbone model 的所有数据存放到 state 中，并将数据传递到被包裹的组件中。

通过这种方法，只有高阶组件需要知道 Backbone model 的内部构造，而且应用中大多数的组件可以保持和 Backbone 无关。

在下面的例子中，我们会拷贝一份 model 的属性来形成初始的 state。我们订阅 `change` 事件（并且在取消挂载时停止订阅），而当变化发生时，我们使用 model 的当前属性更新这个 state。最终，我们确保了只要 `model` 属性本身变化的时候，我们不要忘了停止旧 model 的订阅并开始订阅新的 model。

请注意，这个例子并不是为了彻底完整展示如何与 Backbone 集成，而是它应该让你了解如何以通用的方式处理此问题：

```js{1,5,10,14,16,17,22,26,32}
function connectToBackboneModel(WrappedComponent) {
  return class BackboneComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = Object.assign({}, props.model.attributes);
      this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
      this.props.model.on('change', this.handleChange);
    }

    componentWillReceiveProps(nextProps) {
      this.setState(Object.assign({}, nextProps.model.attributes));
      if (nextProps.model !== this.props.model) {
        this.props.model.off('change', this.handleChange);
        nextProps.model.on('change', this.handleChange);
      }
    }

    componentWillUnmount() {
      this.props.model.off('change', this.handleChange);
    }

    handleChange(model) {
      this.setState(model.changedAttributes());
    }

    render() {
      const propsExceptModel = Object.assign({}, this.props);
      delete propsExceptModel.model;
      return <WrappedComponent {...propsExceptModel} {...this.state} />;
    }
  }
}
```

要演示如何使用它，我们会链接一个 `NameInput` React 组件到一个 Backbone model，并且每当输入框变化时更新它的 `firstName` 属性：

```js{4,6,11,15,19-21}
function NameInput(props) {
  return (
    <p>
      <input value={props.firstName} onChange={props.handleChange} />
      <br />
      My name is {props.firstName}.
    </p>
  );
}

const BackboneNameInput = connectToBackboneModel(NameInput);

function Example(props) {
  function handleChange(e) {
    props.model.set('firstName', e.target.value);
  }

  return (
    <BackboneNameInput
      model={props.model}
      handleChange={handleChange}
    />
  );
}

const model = new Backbone.Model({ firstName: 'Frodo' });
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Example model={model} />);
```

[**在 CodePen 上运行**](http://codepen.io/gaearon/pen/PmWwwa?editors=0010)

这个技术并不仅限于 Backbone。你可以通过在生命周期方法中订阅其更改，并选择性地，拷贝数据到本地 React state，来将 React 用于任何 model 库。
