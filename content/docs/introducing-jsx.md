---
id: introducing-jsx
title: JSX 简介
permalink: docs/introducing-jsx.html
prev: hello-world.html
next: rendering-elements.html
---

考虑如下声明变量：

```js
const element = <h1>Hello, world!</h1>;
```

这个有趣的标签语法既不是字符串也不是 HTML。

它被称为 JSX， 是一个 JavaScript 的语法扩展。我们建议在 React 中配合使用 JSX，JSX 可以很好地描述 UI 应该呈现出它应有交互的本质形式。JSX 可能使人想起模版语言，但它具有 JavaScript 的全部功能。

JSX 生成 React “元素”。我们将在[下一章节](/docs/rendering-elements.html)中探讨如何将这些元素渲染到 DOM 里。下面，我们来看一下开始学习 JSX 的所需的基础知识。

### 为什么使用 JSX？

React 认为渲染逻辑本质上与其他 UI 逻辑一脉相通，比如，如何处理事件、状态如何随时间变化，以及如何把数据展示出来。

React 并没有把标记语言和逻辑这两个东西分开放在不同的文件里，而是使用松散耦合的单元进行[关注点*分离*](https://en.wikipedia.org/wiki/Separation_of_concerns)，这些单元称为包含两者的“组件”。我们会在[延伸章节](/docs/components-and-props.html)里重新回到“组件”，但如果你还不熟悉怎么在 JS 里使用标记语言，[这个视频解说](https://www.youtube.com/watch?v=x7cQ3mrcKaY)可能会说服你。

React 不一定要使用 JSX (/docs/react-without-jsx.html)，但是大多数人发现在JavaScript 代码中使用 UI 时它是一种有用的视觉辅助工具。它还允许 React 显示更多有用的错误和警告消息。

弄清楚这个，让我们开始吧！

### 在 JSX 中嵌入表达式

在下面的例子中，我们声明了一个名为 `name` 的变量，然后在 JSX 中使用它，并将它包装在大括号中：

```js{1,2}
const name = 'Josh Perez';
const element = <h1>Hello, {name}</h1>;

ReactDOM.render(
 element,
document.getElementById('root')
);
```

你可以在 JSX 中的大括号内放置任何有效的[JavaScript 表达式] (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators#Expressions)。例如，`2 + 2`，`user.firstName`或`formatName（user）`都是有效的 JavaScript 表达式。

在下面的示例中，我们将调用 JavaScript 函数 `formatName（user）` 的结果， 并将结果嵌入到 `<h1>` 元素中。

```js{12}
function formatName(user) {
return user.firstName + ' ' + user.lastName;
}

const user = {
firstName: 'Harper',
lastName: 'Perez'
};

const element = (
<h1>
Hello, {formatName(user)}!
</h1>
);

ReactDOM.render(
element,
document.getElementById('root')
);
```

[在codepen上运行](codepen://introducing-jsx)

为了便于阅读，我们将 JSX 拆分为多行。 虽然不需要这样，但在执行此操作时，我们还是建议将其包装在括号中，以避免掉入[分号自动插入]的陷阱 (http://stackoverflow.com/q/2846283)。

### JSX 本身也是一种表达式

编译之后，JSX 表达式成为常规 JavaScript 函数调用， 并评估为 JavaScript 对象。

这意味着你可以在 `if` 语句和 `for` 循环中使用 JSX，将其赋值给变量，当作参数传入，并从函数返回它：

```js{3,5}
function getGreeting(user) {
if (user) {
return <h1>Hello, {formatName(user)}!</h1>;
}
return <h1>Hello, Stranger.</h1>;
}
```

### JSX 属性

你可以使用引号来定义以字符串为值的属性：

```js
const element = <div tabIndex="0"></div>;
```

也可以使用大括号来定义以 JavaScript 表达式为值的属性：

```js
const element = <img src={user.avatarUrl}></img>;
```

切记，如果把 JavaScript 表达式镶嵌在大括号里，大括号外面不能再套引号。JSX 会将引号当中的内容识别为字符串而不是表达式。你可以只使用引号 （当对象是字符串），或者使用大阔号（当对象是表达式），但这两个不能在同一个属性里出现。

>**警告：**
>
>因为 JSX 的特性更接近 JavaScript 而不是 HTML , 所以 React DOM 使用 camelCase （小驼峰命名）来定义属性的名称，而不是使用 HTML 的属性名称。
>
>例如，JSX 里的 class 变成了 className (https://developer.mozilla.org/en-US/docs/Web/API/Element/className)，而 tabindex 则对应着 tabIndex (https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/tabIndex)。

### 使用 JSX 指定子项

假如一个标签里面没有内容，你可以把它当作 XML ，在末尾加上 `/>` 来关上它。

```js
const element = <img src={user.avatarUrl} />;
```

JSX 标签里能够包含很多子项:

```js
const element = (
<div>
<h1>Hello!</h1>
<h2>Good to see you here.</h2>
</div>
);
```

### JSX 防止注入攻击

你可以放心地在 JSX 当中使用用户输入：

```js
const title = response.potentiallyMaliciousInput;
// 直接使用是安全的：
const element = <h1>{title}</h1>;
```

React DOM 在渲染之前默认会[过滤](http://stackoverflow.com/questions/7381974/which-characters-need-to-be-escaped-on-html)所有传入的值。它可以确保你的应用里没有写进去的信息无法被进行注入攻击。所有的内容在渲染之前都被转换成了字符串。这样可以有效地防止 [XSS (跨站脚本)](https://en.wikipedia.org/wiki/Cross-site_scripting)攻击。

### JSX 代表对象（Objects）

Babel 转译器会把 JSX 转换成一个名为 React.createElement() 的方法调用。

下面两种代码的作用是完全相同的：


```js
const element = (
<h1 className="greeting">
Hello, world!
</h1>
);
```

```js
const element = React.createElement(
  'h1',
  {className: 'greeting'},
  'Hello, world!'
);
```

React.createElement() 这个方法首先会进行一些避免 bug 的检查，但更主要的是返回一个类似下面例子的对象：

```js
// Note: this structure is simplified
const element = {
type: 'h1',
props: {
className: 'greeting',
children: 'Hello, world!'
}
};
```

这样的对象被称为“React 元素”。它代表所有你在屏幕上看到的东西。React 通过读取这些对象来构建 DOM 并保持随时更新。

我们将在下一节中探讨如何将 React 元素渲染到 DOM。

Tip:

我们建议您使用[“Babel”语言定义]工具 (http://babeljs.io/docs/editors) 作为您选择的编辑器的辅助，以便正确突出显示 ES6 和 JSX 代码。 本网站使用与之兼容的 [Oceanic Next]（https://labs.voronianski.com/oceanic-next-color-scheme/）配色方案。

