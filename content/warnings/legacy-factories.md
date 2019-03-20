---
title: 警告：有关 React Element 工厂和 JSX 
layout: single
permalink: warnings/legacy-factories.html
---

你能到这个页面很可能是因为：你的代码把你的组件直接作为普通的函数来调用。这个方式现在被废弃了：

```javascript
var MyComponent = require('MyComponent');

function render() {
  return MyComponent({ foo: 'bar' });  // 警告
}
```

## JSX {#jsx}

React 组件现在不再能像这样直接被调用。取而代之的，[你可以使用 JSX](/docs/jsx-in-depth.html)。

```javascript
var React = require('react');
var MyComponent = require('MyComponent');

function render() {
  return <MyComponent foo="bar" />;
}
```

## 不用 JSX {#without-jsx}

如果你不希望、或者是不能使用 JSX，那么你需要把你的组件包装成工厂函数然后再调用它：

```javascript
var React = require('react');
var MyComponent = React.createFactory(require('MyComponent'));

function render() {
  return MyComponent({ foo: 'bar' });
}
```

当你有一大堆现存的函数调用的时候，这样做是一个简单的升级方式。

## 不使用 JSX 的动态组件 {#dynamic-components-without-jsx}

如果从动态来源取得组件类，那么就不需要创建立即调用的工厂函数。你可以改用内联的方式创建你的元素：

```javascript
var React = require('react');

function render(MyComponent) {
  return React.createElement(MyComponent, { foo: 'bar' });
}
```

## 深入 {#in-depth}

[查阅更多关于**为什么**我们做出这个变动。](https://gist.github.com/sebmarkbage/d7bce729f38730399d28)
