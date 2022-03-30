---
id: implementation-notes
title: 实现说明
layout: contributing
permalink: docs/implementation-notes.html
prev: codebase-overview.html
next: design-principles.html
redirect_from:
  - "contributing/implementation-notes.html"
---

这一部分是关于 [stack reconciler](/docs/codebase-overview.html#stack-reconciler) 的一些实现说明。

这部分比较具有技术性，需要对 React 公共 API，以及 React 是如何将其分为 core、renderer 和 reconciler 的具有较好的理解。如果你对源码库还不是很熟悉，请先阅读[源码总览](/docs/codebase-overview.html)。

这部分还要求了解 [React 组件及其实例和元素之间的不同](/blog/2015/12/18/react-components-elements-and-instances.html)。

stack reconciler 是在 React 15 以及更早的版本中被采用。它的源码位于 [src/renderers/shared/stack/reconciler](https://github.com/facebook/react/tree/15-stable/src/renderers/shared/stack/reconciler)。

### 视频：从零开始构建 React {#video-building-react-from-scratch}

[Paul O'Shannessy](https://twitter.com/zpao) 讲解的[从零开始构建 React](https://www.youtube.com/watch?v=_MAD4Oly9yg) 对本文档有较大的启发。

本文档和他的讲解都是对实际代码库的简化，所以你能通过熟悉它们来获得更好的理解。

### 概览 {#overview}

reconciler 本身没有公共的 API。像 React DOM 和 React Native 这样的 [renderer](/docs/codebase-overview.html#renderers) 使用它来根据用户写的 React 组件来高效地更新用户界面。

### 挂载是递归过程 {#mounting-as-a-recursive-process}

让我们考虑第一次挂载组件时：

```js
const root = ReactDOM.createRoot(rootEl);
root.render(<App />);
```

`root.render` 把 `<App />` 传递给 reconciler。请记住，`<App />` 是一个 React 元素，也就是对要渲染的*内容*的描述。可以把它视为普通的对象：

```js
console.log(<App />);
// { type: App, props: {} }
```

reconciler 检查 `App` 是一个类还是一个函数。

如果 `App` 是函数，那么 reconciler 会调用 `App(props)` 来获取渲染的元素。

如果 `App` 是类，那么 reconciler 会通过 `new App(props)` 来实例化 `App`，并调用生命周期方法 `componentWillMount()`，之后调用 `render()` 方法来获取渲染的元素。

无论哪种方式，reconciler 都会探悉 `App` 的内容并渲染。

这个过程是递归的。`App` 可能会渲染某个 `<Greeting />`，`Greeting` 可能会渲染某个 `<Button />`，以此类推。当它探悉各个组件渲染的元素时，reconciler 会通过用户定义的组件递归地 "向下探索"。

通过以下伪代码想象一下这个过程：

```js
function isClass(type) {
  // 类组件会有这个标识位
  return (
    Boolean(type.prototype) &&
    Boolean(type.prototype.isReactComponent)
  );
}

// 这个函数接受一个 React 元素 (例如： <App />)
// 并返回表示已挂载树的 DOM 或者 原生节点
function mount(element) {
  var type = element.type;
  var props = element.props;

  // 将通过 type 作为函数运行
  // 或创建实例并调用 render() 
  // 返回渲染后的元素
  var renderedElement;
  if (isClass(type)) {
    // 类组件
    var publicInstance = new type(props);
    // 设置 props
    publicInstance.props = props;
    // 如果有生命周期方法就调用
    if (publicInstance.componentWillMount) {
      publicInstance.componentWillMount();
    }
    // 调用 render() 返回渲染后的元素
    renderedElement = publicInstance.render();
  } else {
    // 函数组件
    renderedElement = type(props);
  }

  // 这个过程是递归的
  // 因为组件可能会返回具体另一个组件类型的元素
  return mount(renderedElement);

  // 提示：这个实现是不完整的并且无限递归！
  // 只处理像 <App /> 或者 <Button /> 的元素
  // 还不能处理像 <div /> 或者 <p /> 的元素
}

var rootEl = document.getElementById('root');
var node = mount(<App />);
rootEl.appendChild(node);
```

>**注意：**
>
>这其实*是*一份伪代码。它与真实的实现并不相似。因为我们还没有讨论该递归过程何时停止，所以它也会造成堆栈溢出。

让我们回顾上面例子中的一些关键的想法：

* React 元素是用来表示组件的类型（例如：`App`）和 props 的简单的对象。
* 用户定义的组件（例如：`App`）可以是类，也可以是函数，但是它们都“渲染产生”元素。
* “挂载”是一个递归的过程，根据特定的顶层 React 元素（e.g. `<App />`）产生 DOM 或 Native 树。

### 挂载宿主元素 {#mounting-host-elements}

如果我们没有渲染某些东西输出到电脑屏幕，这个过程将会是无用的。

除了用户定义的（“组合”）组件，React 元素也可能表示为平台专属（“宿主”）组件。例如，`Button` 可能会从 render 方法返回一个 `<div />`。

如果元素的 `type` 属性是字符串，我们处理的就是宿主元素：

```js
console.log(<div />);
// { type: 'div', props: {} }
```

宿主元素中没有用户定义代码。

当 reconciler 遇到宿主元素时，它会让 renderer 负责挂载它。例如，React DOM 会创建一个 DOM 节点。

如果宿主元素拥有子元素，reconciler 会根据上文提到的算法对其进行递归地挂载。无论子元素是宿主（像 `<div><hr /><div>`），还是组合（像 `<div><Button /></div>`），两者都无所谓。

子组件生成的 DOM 节点会附加在父 DOM 节点上，递归地完成整个 DOM 结构的组装。

>**注意：**
>
>reconciler 本身不与 DOM 绑定。挂载的确切结果（在源代码中有时叫做 “挂载映像”）取决于 renderer，可以是一个 DOM 节点（React DOM），一个字符串（React DOM Server），或是一个表示原生视图的数字（React Native）。

如果我们扩展代码去处理宿主元素，会是如下样子：

```js
function isClass(type) {
  // 类组件会有这个标识位
  return (
    Boolean(type.prototype) &&
    Boolean(type.prototype.isReactComponent)
  );
}

// 此函数仅处理组合类型的元素
// 例如，处理 <App /> 和 <Button />, 但不处理 <div />
function mountComposite(element) {
  var type = element.type;
  var props = element.props;

  var renderedElement;
  if (isClass(type)) {
    // 类组件
    var publicInstance = new type(props);
    // 设置 props
    publicInstance.props = props;
    // 如果有生命周期方法就调用
    if (publicInstance.componentWillMount) {
      publicInstance.componentWillMount();
    }
    renderedElement = publicInstance.render();
  } else if (typeof type === 'function') {
    // 函数组件
    renderedElement = type(props);
  }

  // 这是递归的，但是当元素是宿主(例如： <div />)而不是组合(例如 <App />)时，
  // 我们最终会到达递归的底部：
  return mount(renderedElement);
}

// 此函数只处理宿主类型的元素
// 例如： 处理 <div /> 和 <p />，但不处理 <App />.
function mountHost(element) {
  var type = element.type;
  var props = element.props;
  var children = props.children || [];
  if (!Array.isArray(children)) {
    children = [children];
  }
  children = children.filter(Boolean);

  // 这段代码不应该出现在 reconciler。
  // 不同的 renderer 可能会以不同方式初始化节点。
  // 例如，React Native 会创建 iOS 或 Android 的视图。
  var node = document.createElement(type);
  Object.keys(props).forEach(propName => {
    if (propName !== 'children') {
      node.setAttribute(propName, props[propName]);
    }
  });

  // 挂载子元素
  children.forEach(childElement => {
    // 子元素可能是宿主(例如：<div />)或者组合 (例如：<Button />).
    // 我们还是递归挂载他们
    var childNode = mount(childElement);

    // 这一行代码也是特殊的 renderer。
    // 根据 renderer 不同，方式也不同：
    node.appendChild(childNode);
  });

  // DOM 节点作为挂载的结果返回。
  // 这是递归结束的位置。
  return node;
}

function mount(element) {
  var type = element.type;
  if (typeof type === 'function') {
    // 用户定义组件
    return mountComposite(element);
  } else if (typeof type === 'string') {
    // 平台特定组件
    return mountHost(element);
  }
}

var rootEl = document.getElementById('root');
var node = mount(<App />);
rootEl.appendChild(node);
```

以上代码是可以运作的，但是与 reconciler 的实际实现依然相差很远。关键的缺失部分是对更新的支持。

### 引入内部实例 {#introducing-internal-instances}

React 的关键特点是你可以重新渲染所有内容，并且不会重新生成 DOM 或重置 state：

```js
root.render(<App />);
// 应该重用已经存在的 DOM：
root.render(<App />);
```

然而，之前的实现只是知道如何挂载最初的树。由于它没有储存所有的必要信息，例如所有的 `publicInstance`，或 DOM 节点属于哪个组件，所以它不能完成更新操作。

stack reconciler 源码通过把 `mount()` 函数作为一个类的方法来解决这个问题。这种方法是存在缺点的，所以我们正朝着与之相对的方向[进行 reconciler 的重写工作](/docs/codebase-overview.html#fiber-reconciler)。不过这就是它现在的运作方式。

我们会创建两个类：`DOMComponent` 和 `CompositeComponent`，而不是分离的两个函数 `mountHost` 和 `mountComposite`。

两个类都有一个接受 `element` 的构造函数，同时也有一个返回挂载后节点的 `mount()` 方法。我们用一个可以实例化正确类的工厂函数替换了顶层的 `mount()` 函数：

```js
function instantiateComponent(element) {
  var type = element.type;
  if (typeof type === 'function') {
    // 用户定义组件
    return new CompositeComponent(element);
  } else if (typeof type === 'string') {
    // 平台特定组件
    return new DOMComponent(element);
  }  
}
```

首先，让我们思考一下 `CompositeComponent` 的实现：

```js
class CompositeComponent {
  constructor(element) {
    this.currentElement = element;
    this.renderedComponent = null;
    this.publicInstance = null;
  }

  getPublicInstance() {
    // 对于组合组件，公共类实例
    return this.publicInstance;
  }

  mount() {
    var element = this.currentElement;
    var type = element.type;
    var props = element.props;

    var publicInstance;
    var renderedElement;
    if (isClass(type)) {
      // 组件类
      publicInstance = new type(props);
      // 设置 props
      publicInstance.props = props;
      // 如果有生命周期方法就调用
      if (publicInstance.componentWillMount) {
        publicInstance.componentWillMount();
      }
      renderedElement = publicInstance.render();
    } else if (typeof type === 'function') {
      // 函数组件
      publicInstance = null;
      renderedElement = type(props);
    }

    // 保存公共实例
    this.publicInstance = publicInstance;

    // 根据元素实例化子内部实例。
    // <div /> 或者 <p /> 是 DOMComponent，
    // 而 <App /> 或者 <Button /> 是 CompositeComponent。
    var renderedComponent = instantiateComponent(renderedElement);
    this.renderedComponent = renderedComponent;

    // 挂载渲染后的输出
    return renderedComponent.mount();
  }
}
```

这与之前的 `mountComposite()` 的实现没有太多的不同，但是现在我们可以保存一些信息，如 `this.currentElement`，`this.renderedComponent` 和 `this.publicInstance`，用于更新期间使用。

需要注意的是 `CompositeComponent` 的实例与用户提供的 `element.type` 的实例是不同的东西。`CompositeComponent` 是我们的 reconciler 的实现细节，并且永远不会暴露给用户。用户定义的类是从 `element.type` 读取的，并且 `CompositeComponent` 会创建一个它的实例。

为了避免混淆，我们把 `CompositeComponent` 和 `DOMComponent` 的实例叫做“内部实例”。由于它们的存在，我们可以把一些长时间存在的数据存入其中。只有 renderer 和 reconciler 能意识到它们的存在。

相反，我们把用户定义的类的实例叫做“公共实例”。公共实例就是你在 `render()` 中所见到的 `this` 和你的自定义组件中的一些其他方法。

`mountHost()` 函数，重构为 `DOMComponent` 类的 `mount()` 方法，看起来也很熟悉：

```js
class DOMComponent {
  constructor(element) {
    this.currentElement = element;
    this.renderedChildren = [];
    this.node = null;
  }

  getPublicInstance() {
    // 对于 DOM 组件，只公共 DOM 节点
    return this.node;
  }

  mount() {
    var element = this.currentElement;
    var type = element.type;
    var props = element.props;
    var children = props.children || [];
    if (!Array.isArray(children)) {
      children = [children];
    }

    // 创建并保存节点
    var node = document.createElement(type);
    this.node = node;

    // 设置属性
    Object.keys(props).forEach(propName => {
      if (propName !== 'children') {
        node.setAttribute(propName, props[propName]);
      }
    });

    // 创建并保存包含的子项
    // 他们每个都可以是 DOMComponent 或者是 CompositeComponent，
    // 取决于类型是字符串还是函数
    var renderedChildren = children.map(instantiateComponent);
    this.renderedChildren = renderedChildren;

    // 收集他们在 mount 上返回的节点
    var childNodes = renderedChildren.map(child => child.mount());
    childNodes.forEach(childNode => node.appendChild(childNode));

    // DOM 节点作为挂载结果返回
    return node;
  }
}
```

`mountHost()` 重构后主要的区别是我们保存了与内部 DOM 组件实例关联的 `this.node` 和 `this.renderedChildren`。在将来我们还使用他们来进行非破坏性更新。

因此，每个内部实例，组合或者宿主，现在都指向了它的子内部实例。为帮你更直观的了解，假设有函数组件 `<App>` 会渲染类组件 `<Button>`，并且 `Button` 渲染一个 `<div>`，其内部实例树将如下所示:

```js
[object CompositeComponent] {
  currentElement: <App />,
  publicInstance: null,
  renderedComponent: [object CompositeComponent] {
    currentElement: <Button />,
    publicInstance: [object Button],
    renderedComponent: [object DOMComponent] {
      currentElement: <div />,
      node: [object HTMLDivElement],
      renderedChildren: []
    }
  }
}
```

在 DOM 中, 你只能看到 `<div>`。但是在内部实例树包含了组合和宿主的内部实例。

组合内部实例需要存储：

* 当前元素。
* 如果元素的类型是类的公共实例
* 单次渲染后的内部实例。它可以是 `DOMComponent` 或 `CompositeComponent`。

宿主内部实例需要存储：

* 当前元素。
* DOM 节点.
* 所有子内部实例。它们中的每一个都可以是 `DOMComponent` 或` CompositeComponent`。

如果你难以想象内部实例树在较为复杂的应用程序中的结构，[React DevTools](https://github.com/facebook/react-devtools) 可以给你一个相似的结果，因为它突出呈现了灰色的宿主实例，以及紫色的组合实例。

 <img src="../images/docs/implementation-notes-tree.png" width="500" style="max-width: 100%" alt="React DevTools tree" />

为了完成重构，我们将引入一个函数，它将完整的树挂载到容器节点中并返回公共实例：

```js
function mountTree(element, containerNode) {
  // 创建顶层内部实例
  var rootComponent = instantiateComponent(element);

  // 挂载顶层组件到容器中
  var node = rootComponent.mount();
  containerNode.appendChild(node);

  // 返回它提供的公共实例
  var publicInstance = rootComponent.getPublicInstance();
  return publicInstance;
}

var rootEl = document.getElementById('root');
mountTree(<App />, rootEl);
```

### 卸载 {#unmounting}

现在，我们有内部实例，以保留其子节点和 DOM 节点，我们可以实现卸载。对于组合组件，卸载调用生命周期方法和递归。

```js
class CompositeComponent {

  // ...

  unmount() {
    // 如果有生命周期方法就调用
    var publicInstance = this.publicInstance;
    if (publicInstance) {
      if (publicInstance.componentWillUnmount) {
        publicInstance.componentWillUnmount();
      }
    }

    // 卸载单个渲染的组件
    var renderedComponent = this.renderedComponent;
    renderedComponent.unmount();
  }
}
```

对于 `DOMComponent`，会告诉每一个子项去卸载

```js
class DOMComponent {

  // ...

  unmount() {
    // 卸载所有的子项
    var renderedChildren = this.renderedChildren;
    renderedChildren.forEach(child => child.unmount());
  }
}
```

在实践中，卸载 DOM 组件也需要删除事件侦听器和清除一些缓存，但我们将跳过这些细节。

我们现在可以添加一个叫 `unmountTree(containerNode)` 顶层函数，该函数类似于 `ReactDOM.unmountComponentAtNode()` 。

```js
function unmountTree(containerNode) {
  // 从 DOM 节点读取内部实例:
  // (这还不起作用,我们需要更改 mountTreeTree() 来存储它。)
  var node = containerNode.firstChild;
  var rootComponent = node._internalInstance;

  // 卸载树并清空容器
  rootComponent.unmount();
  containerNode.innerHTML = '';
}
```

为了使其工作，我们需要从 DOM 节点读取内部根实例。我们将修改 `mountTree()` 为其增加 `_internalInstance` 属性来添加 DOM 根节点，我们还将在 `mountTree()` 中实现销毁任何现有的树的功能, 以便它可以被多次调用:

```js
function mountTree(element, containerNode) {
  // 销毁所有现有的树
  if (containerNode.firstChild) {
    unmountTree(containerNode);
  }

  // 创建顶层的内部实例
  var rootComponent = instantiateComponent(element);

  // 挂载顶层组件到容器中
  var node = rootComponent.mount();
  containerNode.appendChild(node);

  // 保存对内部实例的引用
  node._internalInstance = rootComponent;

  // 返回它提供的公共实例
  var publicInstance = rootComponent.getPublicInstance();
  return publicInstance;
}
```

现在，运行 `unmountTree()` 或重复运行 `mountTree()`，都会删除旧树并在组件上运行 `componentWillUnmount()` 生命周期方法。

### 更新 {#updating}

在上一个章节，我们实现了卸载。但是，如果每个 prop 更改都卸载整棵树，并重新挂载，那么 react 就不再高效了。reconciler 的目标是尽可能复用现有实例来保留 DOM 和状态：

```js
var rootEl = document.getElementById('root');

mountTree(<App />, rootEl);
// 应该复用已经存在的 DOM：
mountTree(<App />, rootEl);
```

我们将用一种方法扩展内部实例。除了 `mount()` 和 `unmount()` 之外，`DOMComponent` 和 `CompositeComponent` 都将实现一个名为 `receive(nextElement)` 的新方法：

```js
class CompositeComponent {
  // ...

  receive(nextElement) {
    // ...
  }
}

class DOMComponent {
  // ...

  receive(nextElement) {
    // ...
  }
}
```

它的工作是尽一切可能使组件（及其任何子组件）与 `nextElement` 提供的描述一起更新。

这通常被称为 "virtual DOM diffing" 的部分，但实际发生的情况是，我们递归遍历内部树，让每个内部实例接收更新。

### 更新组合组件 {#updating-composite-components}

当一个组合组件接收一个新的元素时，我们将运行生命周期方法 `componentWillUpdate()`。

然后我们使用新的 prop 重新渲染组件, 并获取下一次渲染的元素：

```js
class CompositeComponent {

  // ...

  receive(nextElement) {
    var prevProps = this.currentElement.props;
    var publicInstance = this.publicInstance;
    var prevRenderedComponent = this.renderedComponent;
    var prevRenderedElement = prevRenderedComponent.currentElement;

    // 更新*自己的*元素
    this.currentElement = nextElement;
    var type = nextElement.type;
    var nextProps = nextElement.props;

    // 找下一次 render() 输出的是什么
    var nextRenderedElement;
    if (isClass(type)) {
      // 类组件
      // 如果有生命周期方法就调用
      if (publicInstance.componentWillUpdate) {
        publicInstance.componentWillUpdate(nextProps);
      }
      // 更新 props 
      publicInstance.props = nextProps;
      // 重新渲染
      nextRenderedElement = publicInstance.render();
    } else if (typeof type === 'function') {
      // 函数组件
      nextRenderedElement = type(nextProps);
    }

    // ...
```

接下来，我们可以看一下渲染元素的 `type`。如果 `type` 自上次渲染后没有改变，之后的组件也可以就地更新。

例如，如果第一次返回 `<Button color="red" />`，第二次返回 `<Button color="blue" />`，我们可以只告诉相应的内部实例 `receive()` 下一个元素：

```js
    // ...

    // 如果渲染元素的 type 没有更改，
    // 重用已经存在组件实例并退出。
    if (prevRenderedElement.type === nextRenderedElement.type) {
      prevRenderedComponent.receive(nextRenderedElement);
      return;
    }

    // ...
```

但是，如果下一个渲染元素的 `type` 与先前渲染的元素不同，则无法更新内部实例。`<button>` 不能 “变成” `<input>`。

相反，我们必须卸载现有的内部实例，然后挂载并渲染元素 `type` 对应的新实例。例如，当先前渲染 `<button />` 的组件再渲染 `<input />` 时，会发生这种情况：

```js
    // ...

    // 如果我们达到这里，我们需要卸载以前挂载的组件。
    // 挂载新的组件，并交换其节点。

    // 查找旧节点，因为需要替换它
    var prevNode = prevRenderedComponent.getHostNode();

    // 卸载旧的子组件并挂载新的子组件
    prevRenderedComponent.unmount();
    var nextRenderedComponent = instantiateComponent(nextRenderedElement);
    var nextNode = nextRenderedComponent.mount();

    // 替换子组件的引用
    this.renderedComponent = nextRenderedComponent;

    // 将旧节点替换为新节点
    // 注意：这是 renderer 特定的代码,
    // 理想情况下应位于 CompositeComponent 之外：
    prevNode.parentNode.replaceChild(nextNode, prevNode);
  }
}
```

综上所述，当组合组件收到新元素时，它可以将更新委派给其渲染的内部实例，或者卸载它并在其位置挂载新元素。

还有另一种情况，组件将重新挂载而非接收元素，即元素的 `key` 已更改。在当前文档中，我们不讨论 `key` 处理，因为它增加了复杂教程的复杂性。

请注意，我们需要向内部实例添加名为 `getHostNode()` 的方法，以便可以在更新期间找到平台特定的节点并替换它。对于两个类，其实现都非常简单:

```js
class CompositeComponent {
  // ...

  getHostNode() {
    // 要求渲染组件提供它。
    // 递归深入任意组合组件。
    return this.renderedComponent.getHostNode();
  }
}

class DOMComponent {
  // ...

  getHostNode() {
    return this.node;
  }  
}
```

### 更新宿主组件 {#updating-host-components}

宿主组件实现，如`DOMComponent`，更新方式不同。当他们收到一个元素时，他们需要更新平台特定的视图。在 React DOM 的情况下，这意味着更新 DOM 属性:

```js
class DOMComponent {
  // ...

  receive(nextElement) {
    var node = this.node;
    var prevElement = this.currentElement;
    var prevProps = prevElement.props;
    var nextProps = nextElement.props;    
    this.currentElement = nextElement;

    // 删除旧的属性
    Object.keys(prevProps).forEach(propName => {
      if (propName !== 'children' && !nextProps.hasOwnProperty(propName)) {
        node.removeAttribute(propName);
      }
    });
    // 设置新的属性
    Object.keys(nextProps).forEach(propName => {
      if (propName !== 'children') {
        node.setAttribute(propName, nextProps[propName]);
      }
    });

    // ...
```

然后宿主组件需要更新其子组件。与组合组件不同，它们可能包含多个子组件。

在此简化的示例中，我们使用内部实例数组并遍历它，根据接收的 `type` 是否与以前的 `type` 匹配更新或替换内部实例。真正的 reconciler 还会在描述中获取元素的 `key`，并存储和跟踪除了插入和删除之外的移动，但我们这里将省略此逻辑。

我们在列表中收集子组件的 DOM 操作，以便可以批量执行它们:

```js
    // ...

    // 这些是 React 元素的数组:
    var prevChildren = prevProps.children || [];
    if (!Array.isArray(prevChildren)) {
      prevChildren = [prevChildren];
    }
    var nextChildren = nextProps.children || [];
    if (!Array.isArray(nextChildren)) {
      nextChildren = [nextChildren];
    }
    // 这些是内部实例的数组:
    var prevRenderedChildren = this.renderedChildren;
    var nextRenderedChildren = [];

    // 当我们迭代子组件时，我们将向数组添加相应操作。
    var operationQueue = [];

    // 注意：以下部分非常简化!
    // 它不处理重新排序、带空洞或有 key 的子组件。
    // 它的存在只是为了说明整个流程，而不是细节。

    for (var i = 0; i < nextChildren.length; i++) {
      // 尝试去获取此子组件现有的内部实例
      var prevChild = prevRenderedChildren[i];

      // 如果此索引下没有内部实例，
      // 则子实例已追加到末尾。
      // 创建新的内部实例,挂载它,并使用其节点。
      if (!prevChild) {
        var nextChild = instantiateComponent(nextChildren[i]);
        var node = nextChild.mount();

        // 记录我们需要追加的节点
        operationQueue.push({type: 'ADD', node});
        nextRenderedChildren.push(nextChild);
        continue;
      }

      // 仅当实例的元素类型匹配时，我们才能更新该实例。
      // 例如，<Button size="small" /> 可以更新成 <Button size="large" />，
      // 但是不能更新成 <App />。
      var canUpdate = prevChildren[i].type === nextChildren[i].type;

      // 如果我们无法更新现有的实例，
      // 我们必须卸载它并安装一个新实例去替代
      if (!canUpdate) {
        var prevNode = prevChild.getHostNode();
        prevChild.unmount();

        var nextChild = instantiateComponent(nextChildren[i]);
        var nextNode = nextChild.mount();

        // 记录我们需要替换的节点
        operationQueue.push({type: 'REPLACE', prevNode, nextNode});
        nextRenderedChildren.push(nextChild);
        continue;
      }

      // 如果我们能更新现有的内部实例，
      // 只是让它接收下一个元素并处理自己的更新。
      prevChild.receive(nextChildren[i]);
      nextRenderedChildren.push(prevChild);
    }

    // 最后，卸载不存在的任何子组件:
    for (var j = nextChildren.length; j < prevChildren.length; j++) {
      var prevChild = prevRenderedChildren[j];
      var node = prevChild.getHostNode();
      prevChild.unmount();

      // 记录我们需要删除的节点
      operationQueue.push({type: 'REMOVE', node});
    }

    // 将渲染的子级列表指向更新的版本。
    this.renderedChildren = nextRenderedChildren;

    // ...
```

最后一步，我们执行 DOM 操作。同样，真正的 reconciler 代码更为复杂，因为它还处理移动操作:

```js
    // ...

    // 处理操作队列。
    while (operationQueue.length > 0) {
      var operation = operationQueue.shift();
      switch (operation.type) {
      case 'ADD':
        this.node.appendChild(operation.node);
        break;
      case 'REPLACE':
        this.node.replaceChild(operation.nextNode, operation.prevNode);
        break;
      case 'REMOVE':
        this.node.removeChild(operation.node);
        break;
      }
    }
  }
}
```

这就是更新宿主组件。

### 顶层更新 {#top-level-updates}

现在，`CompositeComponent` 和 `DOMComponent` 都实现了 `receive(nextElement)` 方法，我们可以更改顶级的 `mountTree()` 函数，以便当元素的 `type` 与上次相同时使用它:

```js
function mountTree(element, containerNode) {
  // 检查现有的树
  if (containerNode.firstChild) {
    var prevNode = containerNode.firstChild;
    var prevRootComponent = prevNode._internalInstance;
    var prevElement = prevRootComponent.currentElement;

    // 如果可以，重用现有的根组件
    if (prevElement.type === element.type) {
      prevRootComponent.receive(element);
      return;
    }

    // 否则，卸载现有树
    unmountTree(containerNode);
  }

  // ...

}
```

现在调用 `mountTree()` 两次相同的 `type` 是没有破坏性的

```js
var rootEl = document.getElementById('root');

mountTree(<App />, rootEl);
// 应该重用已经存在的 DOM：
mountTree(<App />, rootEl);
```

这些是 React 内部工作原理的基础知识。

### 我们遗漏了什么 {#what-we-left-out}

与真实代码库相比，本文档得到了简化。我们没有解决几个重要方面：

* 组件可以呈现 `null`，reconciler 可以处理在数组中“空插槽”和渲染输出。

* reconciler 还从元素中读取 `key`，并使用它来确定哪个内部实例对应于数组中的哪个元素。实际 React 实现中的大部分复杂性与此相关。

* 除了组合和宿主内部实例类外，还有用于“文本”和“空”组件的类。它们表示文本节点和通过渲染 `null` 获得 “空插槽”。

* renderer 使用[注入](/docs/codebase-overview.html#dynamic-injection)的方式将宿主内部类传递给 reconciler. 例如，React DOM 告诉 reconciler 使用 `ReactDOMComponent` 作为宿主内部实例实现。

* 更新子列表的逻辑被提取到一个名为 `ReactMultiChild` 的 mixin 中，它由 React DOM 和 React Native 中的宿主内部实例类实现使用。

* reconciler 还在组合组件中实现对 `setState()` 的支持。事件处理程序内的多个更新将被批处理为单一更新。

* reconciler 还负责将 refs 附加和分离到组合组件和宿主节点。

* 在 DOM 准备好之后调用的生命周期方法，例如 `componentDidMount()` 和 `componentDidUpdate()`，被收集到“回调队列”中并在一个批处理中执行。

* React 将有关当前更新的信息放入名为 “transaction” 的内部对象中。事务可用于跟踪挂起的生命周期方法的队列、警告的当前 DOM 嵌套以及特定更新的“全局”任何其他内容。事务还确保在更新后“清理所有内容”。例如，React DOM 提供的事务类在任何更新后还原 input selection。

### 跳转到代码 {#jumping-into-the-code}

* [`ReactMount`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/dom/client/ReactMount.js) 就像本教程中 `mountTree()` 和 `unmountTree()` 这样的代码。它负责挂载和卸载顶层组件。[`ReactNativeMount`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/native/ReactNativeMount.js) 是 React Native 的模拟。
* [`ReactDOMComponent`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/dom/shared/ReactDOMComponent.js) 相当于本教程中的 `DOMComponent`。它实现了React DOM renderer 的宿主组件类。[`ReactNativeBaseComponent`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/native/ReactNativeBaseComponent.js) 是 React Native 的模拟。
* [`ReactCompositeComponent`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/ReactCompositeComponent.js) 相当于本教程中的 `CompositeComponent`。它处理调用用户定义的组件并维护其状态。
* [`instantiateReactComponent`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/instantiateReactComponent.js) 包含选择要为元素构造的正确内部实例类的开关。它相当于本教程中的 `instantiateComponent()`.

* [`ReactReconciler`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/Reactreconciler.js) 是一个包含 `mountComponent()`、`receiveComponent()` 和 `unmountComponent()` 方法的包装器。它调用内部实例上的底层实现，但也包括一些由所有内部实例实现共享的代码。

* [`ReactChildReconciler`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/ReactChildreconciler.js) 实现根据子元素的 `key` 挂载、更新和卸载子级的逻辑。

* [`ReactMultiChild`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/ReactMultiChild.js) 实现对子组件插入、删除和移动操作队列的处理，独立于渲 renderer。

* 由于遗留原因，`mount()`、 `receive()` 和 `unmount()` 在 React 代码库中实际上名字为 `mountComponent()`、`receiveComponent()` 和 `unmountComponent()`，但是它们接收元素。

* 内部实例的属性以下划线开头，例如，`_currentElement`。它们被认为是整个代码库中的只读公共字段。

### 未来方向 {#future-directions}

stack reconciler 具有固有的局限性，例如同步并且无法中断工作或将其拆分为块。[新的 Fiber reconciler](/docs/codebase-overview.html#fiber-reconciler)正在进行中，具有[完全不同的架构](https://github.com/acdlite/react-fiber-architecture)。在未来，我们打算用它替换 stack reconciler，但目前它还远远没有达到功能对等。

### 下一步 {#next-steps}

阅读[下一节](/docs/design-principles.html) 了解我们用于开发 React 的指导原则。
