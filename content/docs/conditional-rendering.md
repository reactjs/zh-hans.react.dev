---
id: conditional-rendering
title: Conditional Rendering
permalink: docs/conditional-rendering.html
prev: handling-events.html
next: lists-and-keys.html
redirect_from:
  - "tips/false-in-jsx.html"
---

In React, you can create distinct components that encapsulate behavior you need. Then, you can render only some of them, depending on the state of your application.

Conditional rendering in React works the same way conditions work in JavaScript. Use JavaScript operators like [`if`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) or the [conditional operator](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) to create elements representing the current state, and let React update the UI to match them.

Consider these two components:

在 React 中，你可以创建一些明确的组件来封装各种你需要的行为。然后，依据应用的不同状态，你可以只渲染对应状态下的部分内容。

React 中的条件渲染和 JavaScript 中的一样，使用 JavaScript 操作符 [`if`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) 或者 [条件运算符](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) 去创建元素来表现当前的状态，然后让 React 会根据他们来更新 UI。

来看看这两个组件:

```js
function UserGreeting(props) {
  return <h1>Welcome back!</h1>;
}

function GuestGreeting(props) {
  return <h1>Please sign up.</h1>;
}
```

We'll create a `Greeting` component that displays either of these components depending on whether a user is logged in:
我们再创建一个 `Greeting` 组件，它会根据用户是否登录来决定显示上面的哪一个组件。

```javascript{3-7,11,12}
function Greeting(props) {
  const isLoggedIn = props.isLoggedIn;
  if (isLoggedIn) {
    return <UserGreeting />;
  }
  return <GuestGreeting />;
}

ReactDOM.render(
  // Try changing to isLoggedIn={true}:
  <Greeting isLoggedIn={false} />,
  document.getElementById('root')
);
```

[**Try it on CodePen**](https://codepen.io/gaearon/pen/ZpVxNq?editors=0011)

This example renders a different greeting depending on the value of `isLoggedIn` prop.
这个例子展示了如果根据 `isLoggedIn` 的值来渲染不同的问候语。

### Element Variables
### 元素变量

You can use variables to store elements. This can help you conditionally render a part of the component while the rest of the output doesn't change.
你可以使用变量来储存元素。 它可以帮组你有条件的渲染组件的一部分，而其他的渲染部分并不会因此而改变。

Consider these two new components representing Logout and Login buttons:
来看看这两个组件，它们分别代表了注销和登录按钮：

```js
function LoginButton(props) {
  return (
    <button onClick={props.onClick}>
      Login
    </button>
  );
}

function LogoutButton(props) {
  return (
    <button onClick={props.onClick}>
      Logout
    </button>
  );
}
```

In the example below, we will create a [stateful component](/docs/state-and-lifecycle.html#adding-local-state-to-a-class) called `LoginControl`.
在下面的例子中，我们将创建一个名叫 `LoginControl` 的 [有状态的组件](/docs/state-and-lifecycle.html#adding-local-state-to-a-class)

It will render either `<LoginButton />` or `<LogoutButton />` depending on its current state. It will also render a `<Greeting />` from the previous example:
它将根据当前的状态来渲染 `<LoginButton />` 或者 `<LogoutButton />`。它也将渲染上一个例子中的 `<Greeting />`。

```javascript{20-25,29,30}
class LoginControl extends React.Component {
  constructor(props) {
    super(props);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.state = {isLoggedIn: false};
  }

  handleLoginClick() {
    this.setState({isLoggedIn: true});
  }

  handleLogoutClick() {
    this.setState({isLoggedIn: false});
  }

  render() {
    const isLoggedIn = this.state.isLoggedIn;
    let button;

    if (isLoggedIn) {
      button = <LogoutButton onClick={this.handleLogoutClick} />;
    } else {
      button = <LoginButton onClick={this.handleLoginClick} />;
    }

    return (
      <div>
        <Greeting isLoggedIn={isLoggedIn} />
        {button}
      </div>
    );
  }
}

ReactDOM.render(
  <LoginControl />,
  document.getElementById('root')
);
```

[**Try it on CodePen**](https://codepen.io/gaearon/pen/QKzAgB?editors=0010)

While declaring a variable and using an `if` statement is a fine way to conditionally render a component, sometimes you might want to use a shorter syntax. There are a few ways to inline conditions in JSX, explained below.
声明一个变量并使用 `if` 语句是来做条件渲染的一个不错的方式，但有时你可能会想使用更简洁的语法。接下来，我们将介绍几中在 JSX 中做条件渲染的方法。

### Inline If with Logical && Operator
### 与运算符

You may [embed any expressions in JSX](/docs/introducing-jsx.html#embedding-expressions-in-jsx) by wrapping them in curly braces. This includes the JavaScript logical `&&` operator. It can be handy for conditionally including an element:
通过花括号包裹代码，你可以 [在 JSX 中嵌入任何表达式](/docs/introducing-jsx.html#embedding-expressions-in-jsx)。 这也包括 JavaScript 中的逻辑与 && 操作符。它可以很方便的来进行一个元素的条件渲染。

```js{6-10}
function Mailbox(props) {
  const unreadMessages = props.unreadMessages;
  return (
    <div>
      <h1>Hello!</h1>
      {unreadMessages.length > 0 &&
        <h2>
          You have {unreadMessages.length} unread messages.
        </h2>
      }
    </div>
  );
}

const messages = ['React', 'Re: React', 'Re:Re: React'];
ReactDOM.render(
  <Mailbox unreadMessages={messages} />,
  document.getElementById('root')
);
```

[**Try it on CodePen**](https://codepen.io/gaearon/pen/ozJddz?editors=0010)

It works because in JavaScript, `true && expression` always evaluates to `expression`, and `false && expression` always evaluates to `false`.

Therefore, if the condition is `true`, the element right after `&&` will appear in the output. If it is `false`, React will ignore and skip it.

之所以能这样做，是因为在 JavaScript 中， `true && expression` 总是会返回 `expression`, 而 `false && expression` 总是会返回 `false`。
(PS: 确保左边的值是 `Bool` 值)

### Inline If-Else with Conditional Operator
### 三目运算符

Another method for conditionally rendering elements inline is to use the JavaScript conditional operator [`condition ? true : false`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Conditional_Operator).

In the example below, we use it to conditionally render a small block of text.

另一种条件渲染的方法是使用 JavaScript 中的条件运算符 [`condition ? true : false`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Conditional_Operator)。

在下面这个例子中，我们用它来条件渲染一小段文本

```javascript{5}
render() {
  const isLoggedIn = this.state.isLoggedIn;
  return (
    <div>
      The user is <b>{isLoggedIn ? 'currently' : 'not'}</b> logged in.
    </div>
  );
}
```

It can also be used for larger expressions although it is less obvious what's going on:
同样的，它也可以用在较大的表达式中， 虽然看起来不是太直观。

```js{5,7,9}
render() {
  const isLoggedIn = this.state.isLoggedIn;
  return (
    <div>
      {isLoggedIn ? (
        <LogoutButton onClick={this.handleLogoutClick} />
      ) : (
        <LoginButton onClick={this.handleLoginClick} />
      )}
    </div>
  );
}
```

Just like in JavaScript, it is up to you to choose an appropriate style based on what you and your team consider more readable. Also remember that whenever conditions become too complex, it might be a good time to [extract a component](/docs/components-and-props.html#extracting-components).

就像在 JavaScript 中一样，你可以根据你们团队的习惯来选择更易读的代码风格。在这里提醒一下，如果条件变得过于复杂，那你应该考虑考虑[提取组件](/docs/components-and-props.html#extracting-components) 了。

### Preventing Component from Rendering
### 阻止组件渲染

In rare cases you might want a component to hide itself even though it was rendered by another component. To do this return `null` instead of its render output.

In the example below, the `<WarningBanner />` is rendered depending on the value of the prop called `warn`. If the value of the prop is `false`, then the component does not render:

在极少数情况下，你可能希望能隐藏组件，即使它已经被其他组件渲染了。为了达到这个目的，你可以让 `render` 方法返回 `null`。

```javascript{2-4,29}
function WarningBanner(props) {
  if (!props.warn) {
    return null;
  }

  return (
    <div className="warning">
      Warning!
    </div>
  );
}

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showWarning: true};
    this.handleToggleClick = this.handleToggleClick.bind(this);
  }

  handleToggleClick() {
    this.setState(state => ({
      showWarning: !state.showWarning
    }));
  }

  render() {
    return (
      <div>
        <WarningBanner warn={this.state.showWarning} />
        <button onClick={this.handleToggleClick}>
          {this.state.showWarning ? 'Hide' : 'Show'}
        </button>
      </div>
    );
  }
}

ReactDOM.render(
  <Page />,
  document.getElementById('root')
);
```

[**Try it on CodePen**](https://codepen.io/gaearon/pen/Xjoqwm?editors=0010)

Returning `null` from a component's `render` method does not affect the firing of the component's lifecycle methods. For instance `componentDidUpdate` will still be called.

在组件的 `render` 方法中返回 `null` 并不会影响组件的生命周期方法的回调。例如，上面这个例子中，`componentDidUpdate` 依然会被调用。
