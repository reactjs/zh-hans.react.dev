---
id: introducing-jsx
title: JSX 简介
permalink: docs/introducing-jsx.html
prev: hello-world.html
next: rendering-elements.html
---

我们来观察一下声明的这个变量：

```js
const element = <h1>Hello, world!</h1>;
```

这个语法标记看起来很奇怪，因为它既不是字符串也不是 HTML。

它被称为 JSX， 一种 JavaScript 的语法扩展。 我们推荐在 React 中使用 JSX 来描写用户界面。JSX 可能乍一看像模版语言，但它具有JavaScript 的全部功能。

JSX 生成 React "元素"。We will explore rendering them to the DOM in the [next section](/docs/rendering-elements.html). Below, you can find the basics of JSX necessary to get you started.

我们将在[下一章节]（/ docs / rendering-elements.html）中探索如何将这些元素渲染到DOM里去。 下面，我们来看一看JSX的基本使用方法，以帮助您入门。

### 为什么使用JSX？

React 认为渲染逻辑本质上与其他UI逻辑一脉相通，比如，如何处理事件，状态如何随时间变化，以及如何把数据展示出来。

React 并没有把标记语言 (markup) 和逻辑这两个东西区分放在不同的文件里，而是使用松散耦合的单元分离“关注点” (https://en.wikipedia.org/wiki/Separation_of_concerns)，这些单元称为包含两者的“组件”。我们会在[延伸章节]（/docs /components-and-props.html）里重新回到“组件”，但如果你还不熟悉在JS里使用标记 (markup)，[这个视频解说]（https://www.youtube .com / watch？v = x7cQ3mrcKaY）可能会说服你。

React 也可以不要求使用 JSX (/docs /react-without-jsx.html)，但大多数人觉得在 JavaScript 代码中处理UI时，JSX 是一种有用的视觉辅助工具。除此之外，JSX 也帮助 React 显示更多有用的错误和警告消息。

明白了这个，让我们开始吧！

### 在JSX中嵌入表达式

在下面的例子中，我们声明了一个名为`name`的变量，然后在JSX中使用它，并将它包装在花括号中：

```js{1,2}
const name = 'Josh Perez';
const element = <h1>Hello, {name}</h1>;

ReactDOM.render(
  element,
  document.getElementById('root')
);
```

你可以在 JSX 中的花括号内放置任何有效的[JavaScript表达式]（https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators#Expressions）。 例如，`2 + 2`，`user.firstName`或`formatName（user）`都是有效的JavaScript表达式。

在下面的示例中，我们将调用JavaScript函数`formatName（user）`的结果， 并将结果嵌入到`<h1>`元素中。

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

[](codepen://introducing-jsx)

We split JSX over multiple lines for readability. While it isn't required, when doing this, we also recommend wrapping it in parentheses to avoid the pitfalls of [automatic semicolon insertion](http://stackoverflow.com/q/2846283).

### JSX is an Expression Too

After compilation, JSX expressions become regular JavaScript function calls and evaluate to JavaScript objects.

This means that you can use JSX inside of `if` statements and `for` loops, assign it to variables, accept it as arguments, and return it from functions:

```js{3,5}
function getGreeting(user) {
  if (user) {
    return <h1>Hello, {formatName(user)}!</h1>;
  }
  return <h1>Hello, Stranger.</h1>;
}
```

### Specifying Attributes with JSX

You may use quotes to specify string literals as attributes:

```js
const element = <div tabIndex="0"></div>;
```

You may also use curly braces to embed a JavaScript expression in an attribute:

```js
const element = <img src={user.avatarUrl}></img>;
```

Don't put quotes around curly braces when embedding a JavaScript expression in an attribute. You should either use quotes (for string values) or curly braces (for expressions), but not both in the same attribute.

>**Warning:**
>
>Since JSX is closer to JavaScript than to HTML, React DOM uses `camelCase` property naming convention instead of HTML attribute names.
>
>For example, `class` becomes [`className`](https://developer.mozilla.org/en-US/docs/Web/API/Element/className) in JSX, and `tabindex` becomes [`tabIndex`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/tabIndex).

### Specifying Children with JSX

If a tag is empty, you may close it immediately with `/>`, like XML:

```js
const element = <img src={user.avatarUrl} />;
```

JSX tags may contain children:

```js
const element = (
  <div>
    <h1>Hello!</h1>
    <h2>Good to see you here.</h2>
  </div>
);
```

### JSX Prevents Injection Attacks

It is safe to embed user input in JSX:

```js
const title = response.potentiallyMaliciousInput;
// This is safe:
const element = <h1>{title}</h1>;
```

By default, React DOM [escapes](http://stackoverflow.com/questions/7381974/which-characters-need-to-be-escaped-on-html) any values embedded in JSX before rendering them. Thus it ensures that you can never inject anything that's not explicitly written in your application. Everything is converted to a string before being rendered. This helps prevent [XSS (cross-site-scripting)](https://en.wikipedia.org/wiki/Cross-site_scripting) attacks.

### JSX Represents Objects

Babel compiles JSX down to `React.createElement()` calls.

These two examples are identical:

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

`React.createElement()` performs a few checks to help you write bug-free code but essentially it creates an object like this:

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

These objects are called "React elements". You can think of them as descriptions of what you want to see on the screen. React reads these objects and uses them to construct the DOM and keep it up to date.

We will explore rendering React elements to the DOM in the next section.

>**Tip:**
>
>We recommend using the ["Babel" language definition](http://babeljs.io/docs/editors) for your editor of choice so that both ES6 and JSX code is properly highlighted. This website uses the [Oceanic Next](https://labs.voronianski.com/oceanic-next-color-scheme/) color scheme which is compatible with it.
