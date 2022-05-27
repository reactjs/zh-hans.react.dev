---
id: optimizing-performance
title: 性能优化
permalink: docs/optimizing-performance.html
redirect_from:
  - "docs/advanced-performance.html"
---

UI 更新需要昂贵的 DOM 操作，因此 React 内部使用了几种巧妙的技术来最小化 DOM 操作次数。对于大部分应用而言，使用 React 时无需做大量优化工作就能拥有高性能的用户界面。尽管如此，你仍然有办法来加速你的 React 应用。

## 使用生产版本 {#use-the-production-build}

当你需要对你的 React 应用进行 benchmark，或者遇到了性能问题，请确保你正在使用压缩后的生产版本。

React 默认包含了许多有用的警告信息。这些警告信息在开发过程中非常有帮助。然而这使得 React 变得更大且更慢，所以你需要确保部署时使用了生产版本。

如果你不能确定你的编译过程是否设置正确，你可以通过安装 [Chrome 的 React 开发者工具](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) 来检查。如果你浏览一个基于 React 生产版本的网站，图标背景会变成深色：

<img src="../images/docs/devtools-prod.png" style="max-width:100%" alt="React DevTools on a website with production version of React">

如果你浏览一个基于 React 开发模式的网站，图标背景会变成红色：

<img src="../images/docs/devtools-dev.png" style="max-width:100%" alt="React DevTools on a website with development version of React">

推荐你在开发应用时使用开发模式，而在为用户部署应用时使用生产模式。

你可以在下面看到几种为应用构建生产版本的操作说明。

### Create React App {#create-react-app}

如果你的项目是通过 [Create React App](https://github.com/facebookincubator/create-react-app) 构建的，运行：

```
npm run build
```

这段命令将在你的项目下的 `build/` 目录中生成对应的生产版本。

注意只有在生产部署前才需要执行这个命令。正常开发使用 `npm start` 即可。

### 单文件构建 {#single-file-builds}

我们提供了可以在生产环境使用的单文件版 React 和 React DOM：

```html
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
```

注意只有以 `.production.min.js` 为结尾的 React 文件适用于生产。

### Brunch {#brunch}

通过安装 [`terser-brunch`](https://github.com/brunch/terser-brunch) 插件，来获得最高效的 Brunch 生产构建：

```
# 如果你使用 npm
npm install --save-dev terser-brunch

# 如果你使用 Yarn
yarn add --dev terser-brunch
```

接着，在 `build` 命令后添加 `-p` 参数，以创建生产构建：

```
brunch build -p
```

请注意，你只需要在生产构建时这么做。你不需要在开发环境中使用 `-p` 参数或者应用这个插件，因为这会隐藏有用的 React 警告信息并使得构建速度变慢。

### Browserify {#browserify}

为了最高效的生产构建，需要安装一些插件：

```
# 如果你使用 npm
npm install --save-dev envify terser uglifyify

# 如果你使用 Yarn
yarn add --dev envify terser uglifyify
```

为了创建生产构建，确保你添加了以下转换器 **（顺序很重要）**：

* [`envify`](https://github.com/hughsk/envify) 转换器用于设置正确的环境变量。设置为全局 (`-g`)。
* [`uglifyify`](https://github.com/hughsk/uglifyify) 转换器移除开发相关的引用代码。同样设置为全局 (`-g`)。
* 最后，将产物传给 [`terser`](https://github.com/terser-js/terser) 并进行压缩（[为什么要这么做？](https://github.com/hughsk/uglifyify#motivationusage)）。

举个例子：

```
browserify ./index.js \
  -g [ envify --NODE_ENV production ] \
  -g uglifyify \
  | terser --compress --mangle > ./bundle.js
```

请注意，你只需要在生产构建时用到它。你不需要在开发环境应用这些插件，因为这会隐藏有用的 React 警告信息并使得构建速度变慢。

### Rollup {#rollup}

为了最高效的 Rollup 生产构建，需要安装一些插件：

```
# 如果你使用 npm
npm install --save-dev rollup-plugin-commonjs rollup-plugin-replace rollup-plugin-terser

# 如果你使用 Yarn
yarn add --dev rollup-plugin-commonjs rollup-plugin-replace rollup-plugin-terser
```

为了创建生产构建，确保你添加了以下插件 **（顺序很重要）**：

* [`replace`](https://github.com/rollup/rollup-plugin-replace) 插件确保环境被正确设置。
* [`commonjs`](https://github.com/rollup/rollup-plugin-commonjs) 插件用于支持 CommonJS。
* [`terser`](https://github.com/TrySound/rollup-plugin-terser) 插件用于压缩并生成最终的产物。

```js
plugins: [
  // ...
  require('rollup-plugin-replace')({
    'process.env.NODE_ENV': JSON.stringify('production')
  }),
  require('rollup-plugin-commonjs')(),
  require('rollup-plugin-terser')(),
  // ...
]
```

[点击](https://gist.github.com/Rich-Harris/cb14f4bc0670c47d00d191565be36bf0)查看完整的安装示例。

请注意，你只需要在生产构建时用到它。你不需要在开发中使用 `terser` 插件或者 `replace` 插件替换 `'production'` 变量，因为这会隐藏有用的 React 警告信息并使得构建速度变慢。

### webpack {#webpack}

>**注意：**
>
>如果你使用了 Create React App，请跟随[上面的说明](#create-react-app)进行操作。<br>
>只有当你直接配置了 webpack 才需要参考以下内容。

在生产模式下，Webpack v4+ 将默认对代码进行压缩：

```js
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  optimization: {
    minimizer: [new TerserPlugin({ /* additional options here */ })],
  },
};
```

你可以在 [webpack 文档](https://webpack.js.org/guides/production/)中了解更多内容。

请注意，你只需要在生产构建时用到它。你不需要在开发中使用 `TerserPlugin` 插件，因为这会隐藏有用的 React 警告信息并使得构建速度变慢。

## 使用开发者工具中的分析器对组件进行分析 {#profiling-components-with-the-devtools-profiler}

`react-dom` 16.5+ 和 `react-native` 0.57+ 加强了分析能力。在开发模式下，React 开发者工具会出现分析器标签。
你可以在[《介绍 React 分析器》](/blog/2018/09/10/introducing-the-react-profiler.html)这篇博客中了解概述。
你也可以[在 YouTube 上](https://www.youtube.com/watch?v=nySib7ipZdk)观看分析器的视频指导。

如果你还未安装 React 开发者工具，你可以在这里找到它们：

- [Chrome 浏览器扩展](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
- [Firefox 浏览器扩展](https://addons.mozilla.org/en-GB/firefox/addon/react-devtools/)
- [独立 Node 包](https://www.npmjs.com/package/react-devtools)

> 注意
>
>`react-dom` 的生产分析包也可以在 `react-dom/profiling` 中找到。
>通过查阅 [fb.me/react-profiling](https://fb.me/react-profiling) 来了解更多关于使用这个包的内容。

> 注意
>
> 在 React 17 之前，我们使用了标准的 [User Timing API](https://developer.mozilla.org/en-US/docs/Web/API/User_Timing_API)，用 chrome 的 performance 性能选项卡来配置组件。
> 更详细的攻略，请参阅 [Ben Schwarz 的文章](https://calibreapp.com/blog/react-performance-profiling-optimization)。

## 虚拟化长列表 {#virtualize-long-lists}

如果你的应用渲染了长列表（上百甚至上千的数据），我们推荐使用“虚拟滚动”技术。这项技术会在有限的时间内仅渲染有限的内容，并奇迹般地降低重新渲染组件消耗的时间，以及创建 DOM 节点的数量。

[react-window](https://react-window.now.sh/) 和 [react-virtualized](https://bvaughn.github.io/react-virtualized/) 是热门的虚拟滚动库。
它们提供了多种可复用的组件，用于展示列表、网格和表格数据。
如果你想要一些针对你的应用做定制优化，你也可以创建你自己的虚拟滚动组件，就像 [Twitter 所做的](https://medium.com/@paularmstrong/twitter-lite-and-high-performance-react-progressive-web-apps-at-scale-d28a00e780a3)。

## 避免调停 {#avoid-reconciliation}

React 构建并维护了一套内部的 UI 渲染描述。它包含了来自你的组件返回的 React 元素。该描述使得 React 避免创建 DOM 节点以及没有必要的节点访问，因为 DOM 操作相对于 JavaScript 对象操作更慢。虽然有时候它被称为“虚拟 DOM”，但是它在 React Native 中拥有相同的工作原理。

当一个组件的 props 或 state 变更，React 会将最新返回的元素与之前渲染的元素进行对比，以此决定是否有必要更新真实的 DOM。当它们不相同时，React 会更新该 DOM。

即使 React 只更新改变了的 DOM 节点，重新渲染仍然花费了一些时间。在大部分情况下它并不是问题，不过如果它已经慢到让人注意了，你可以通过覆盖生命周期方法 `shouldComponentUpdate` 来进行提速。该方法会在重新渲染前被触发。其默认实现总是返回 `true`，让 React 执行更新：

```javascript
shouldComponentUpdate(nextProps, nextState) {
  return true;
}
```

如果你知道在什么情况下你的组件不需要更新，你可以在 `shouldComponentUpdate` 中返回 `false` 来跳过整个渲染过程。其包括该组件的 `render` 调用以及之后的操作。

在大部分情况下，你可以继承 [`React.PureComponent`](/docs/react-api.html#reactpurecomponent) 以代替手写 `shouldComponentUpdate()`。它用当前与之前 props 和 state 的浅比较覆写了 `shouldComponentUpdate()` 的实现。

## shouldComponentUpdate 的作用 {#shouldcomponentupdate-in-action}

这是一个组件的子树。每个节点中，`SCU` 代表 `shouldComponentUpdate` 返回的值，而 `vDOMEq` 代表返回的 React 元素是否相同。最后，圆圈的颜色代表了该组件是否需要被调停。

<figure><img src="../images/docs/should-component-update.png" style="max-width:100%" /></figure>

节点 C2 的 `shouldComponentUpdate` 返回了 `false`，React 因而不会去渲染 C2，也因此 C4 和 C5 的 `shouldComponentUpdate` 不会被调用到。

对于 C1 和 C3，`shouldComponentUpdate` 返回了 `true`，所以 React 需要继续向下查询子节点。这里 C6 的 `shouldComponentUpdate` 返回了 `true`，同时由于渲染的元素与之前的不同使得 React 更新了该 DOM。

最后一个有趣的例子是 C8。React 需要渲染这个组件，但是由于其返回的 React 元素和之前渲染的相同，所以不需要更新 DOM。

显而易见，你看到 React 只改变了 C6 的 DOM。对于 C8，通过对比了渲染的 React 元素跳过了渲染。而对于 C2 的子节点和 C7，由于 `shouldComponentUpdate` 使得 `render` 并没有被调用。因此它们也不需要对比元素了。

## 示例 {#examples}

如果你的组件只有当 `props.color` 或者 `state.count` 的值改变才需要更新时，你可以使用 `shouldComponentUpdate` 来进行检查：

```javascript
class CounterButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: 1};
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.color !== nextProps.color) {
      return true;
    }
    if (this.state.count !== nextState.count) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <button
        color={this.props.color}
        onClick={() => this.setState(state => ({count: state.count + 1}))}>
        Count: {this.state.count}
      </button>
    );
  }
}
```

在这段代码中，`shouldComponentUpdate` 仅检查了 `props.color` 或 `state.count` 是否改变。如果这些值没有改变，那么这个组件不会更新。如果你的组件更复杂一些，你可以使用类似“浅比较”的模式来检查 `props` 和 `state` 中所有的字段，以此来决定是否组件需要更新。React 已经提供了一位好帮手来帮你实现这种常见的模式 - 你只要继承 `React.PureComponent` 就行了。所以这段代码可以改成以下这种更简洁的形式：

```js
class CounterButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {count: 1};
  }

  render() {
    return (
      <button
        color={this.props.color}
        onClick={() => this.setState(state => ({count: state.count + 1}))}>
        Count: {this.state.count}
      </button>
    );
  }
}
```

大部分情况下，你可以使用 `React.PureComponent` 来代替手写 `shouldComponentUpdate`。但它只进行浅比较，所以当 props 或者 state 某种程度是可变的话，浅比较会有遗漏，那你就不能使用它了。当数据结构很复杂时，情况会变得麻烦。例如，你想要一个 `ListOfWords` 组件来渲染一组用逗号分开的单词。它有一个叫做 `WordAdder` 的父组件，该组件允许你点击一个按钮来添加一个单词到列表中。以下代码*并不*正确：

```javascript
class ListOfWords extends React.PureComponent {
  render() {
    return <div>{this.props.words.join(',')}</div>;
  }
}

class WordAdder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      words: ['marklar']
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // 这部分代码很糟，而且还有 bug
    const words = this.state.words;
    words.push('marklar');
    this.setState({words: words});
  }

  render() {
    return (
      <div>
        <button onClick={this.handleClick} />
        <ListOfWords words={this.state.words} />
      </div>
    );
  }
}
```

问题在于 `PureComponent` 仅仅会对新老 `this.props.words` 的值进行简单的对比。由于代码中 `WordAdder` 的 `handleClick` 方法改变了同一个 `words` 数组，使得新老 `this.props.words` 比较的其实还是同一个数组。即便实际上数组中的单词已经变了，但是比较结果是相同的。可以看到，即便多了新的单词需要被渲染， `ListOfWords` 却并没有被更新。

## 不可变数据的力量 {#the-power-of-not-mutating-data}

避免该问题最简单的方式是避免更改你正用于 props 或 state 的值。例如，上面 `handleClick` 方法可以用 `concat` 重写：

```javascript
handleClick() {
  this.setState(state => ({
    words: state.words.concat(['marklar'])
  }));
}
```

ES6 数组支持[扩展运算符](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator)，这让代码写起来更方便了。如果你在使用 Create React App，该语法已经默认支持了。

```js
handleClick() {
  this.setState(state => ({
    words: [...state.words, 'marklar'],
  }));
};
```

你可以用类似的方式改写代码来避免可变对象的产生。例如，我们有一个叫做 `colormap` 的对象。我们希望写一个方法来将 `colormap.right` 设置为 `'blue'`。我们可以这么写：

```js
function updateColorMap(colormap) {
  colormap.right = 'blue';
}
```

为了不改变原本的对象，我们可以使用 [Object.assign](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) 方法：

```js
function updateColorMap(colormap) {
  return Object.assign({}, colormap, {right: 'blue'});
}
```

现在 `updateColorMap` 返回了一个新的对象，而不是修改老对象。`Object.assign` 是 ES6 的方法，需要 polyfill。

这里有一个 JavaScript 的提案，旨在添加[对象扩展属性](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)以使得更新不可变对象变得更方便：

```js
function updateColorMap(colormap) {
  return {...colormap, right: 'blue'};
}
```

此特性已被收录在 JavaScript 的 ES2018 中。

如果你在使用 Create React App，`Object.assign` 以及对象扩展运算符已经默认支持了。

当处理深层嵌套对象时，以 immutable （不可变）的方式更新它们令人费解。如遇到此类问题，请参阅 [Immer](https://github.com/mweststrate/immer) 或 [immutability-helper](https://github.com/kolodny/immutability-helper)。这些库会帮助你编写高可读性的代码，且不会失去 immutability （不可变性）带来的好处。
