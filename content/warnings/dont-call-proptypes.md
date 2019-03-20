---
title: 警告：禁止调用 PropTypes 函数
layout: single
permalink: warnings/dont-call-proptypes.html
---

> 注意：
>
> 自从 React v15.5 起，`React.PropTypes` 被移动到了另一个 package 中。请改用 [`prop-types`](https://www.npmjs.com/package/prop-types)。
>
> 我们提供了 [codemod 脚本](/blog/2017/04/07/react-v15.5.0.html#migrating-from-react.proptypes) 来自动完成这个过程。

在 React 未来的主要版本（major release）中。执行 PropType 校验函数的代码应该从生产环境中剥离。此时，任何手动调用这些函数的代码（还没从生产环境中剥离的）都会产生报错。

### 声明 PropTypes 仍然没有问题 {#declaring-proptypes-is-still-fine}

PropTypes 的正常用法依然是被支持的：

```javascript
Button.propTypes = {
  highlighted: PropTypes.bool
};
```

没有变化。

### 不要直接调用 PropTypes 函数 {#dont-call-proptypes-directly}

除了用于解释 React 组件，其他使用 PropTypes 的方式将不再受到支持：

```javascript
var apiShape = PropTypes.shape({
  body: PropTypes.object,
  statusCode: PropTypes.number.isRequired
}).isRequired;

// 不支持！
var error = apiShape(json, 'response');
```

如果你依赖这样使用 PropTypes 的方式，我们鼓励你对 PropTypes 进行 fork 和使用（就像 [这个](https://github.com/aackerman/PropTypes) 还有 [这个](https://github.com/developit/proptypes) package）。

如果你不根据警告进行修复，在采用 React 16 的生产环境中这些代码将会崩溃。

### 如果你没有直接调用 PropTypes 函数但是依然出现警告 {#if-you-dont-call-proptypes-directly-but-still-get-the-warning}

检查警告产生的堆栈跟踪。你将找到涉及 PropTypes 直接调用的组件定义。问题很有可能是由包装（wrap）了 React PropTypes 的第三方 PropTypes 导致的，举个例子：

```js
Button.propTypes = {
  highlighted: ThirdPartyPropTypes.deprecated(
    PropTypes.bool,
    'Use `active` prop instead'
  )
}
```

在这个例子中，`ThirdPartyPropTypes.deprecated` 是一个调用 `PropTypes.bool` 的包装器（wrapper）。这个模式本身很好，但是会引发误报，因为 React 认为你在直接调用 PropTypes 函数。下一小节将介绍如何为像 `ThirdPartyPropTypes` 那样实现的库修复该问题。如果它不是你编写的库，你可以给它提一个 issue。

### 修复第三方 PropTypes 库的误报 {#fixing-the-false-positive-in-third-party-proptypes}

如果你是第三方 PropTypes 库的作者，并且能让使用者包装现有的 React PropTypes，他们可能就会看到由你的库引起的这个警告。发生这种情况是因为 React 没有看到用于检测手动 PropTypes 调用的、React “秘密”  [传入](https://github.com/facebook/react/pull/7132) 的最后一个参数。

下面是修复的方法。我们用 [react-bootstrap/react-prop-types](https://github.com/react-bootstrap/react-prop-types/blob/0d1cd3a49a93e513325e3258b28a82ce7d38e690/src/deprecated.js) 中的 `deprecated` 做示例。当前实现只传递 `props`、`propName` 和 `componentName` 参数：

```javascript
export default function deprecated(propType, explanation) {
  return function validate(props, propName, componentName) {
    if (props[propName] != null) {
      const message = `"${propName}" property of "${componentName}" has been deprecated.\n${explanation}`;
      if (!warned[message]) {
        warning(false, message);
        warned[message] = true;
      }
    }

    return propType(props, propName, componentName);
  };
}
```

为了修复误报，确保你向被包装的 PropType 传入了**全部的**参数。用 ES6 的 `...rest` 运算符来做比较简单。

```javascript
export default function deprecated(propType, explanation) {
  return function validate(props, propName, componentName, ...rest) { // 注意这里的 ...rest
    if (props[propName] != null) {
      const message = `"${propName}" property of "${componentName}" has been deprecated.\n${explanation}`;
      if (!warned[message]) {
        warning(false, message);
        warned[message] = true;
      }
    }

    return propType(props, propName, componentName, ...rest); // 还有这里
  };
}
```

这将会消除错误警告。
