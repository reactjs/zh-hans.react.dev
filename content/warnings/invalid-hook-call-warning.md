---
title: 警告：非法 Hook 调用
layout: single
permalink: warnings/invalid-hook-call-warning.html
---

你能到这个页面很可能是因为你看到了以下错误信息：

> Hooks can only be called inside the body of a function component.

触发这个警告有三种常见的原因：

1. 你的 React 和 React DOM 可能**版本不匹配**。
2. 你可能**打破了 [Hook 的规则](/docs/hooks-rules.html)**。
3. 你可能在同一个应用中拥有**多个 React 副本**。

让我们依次来看这些情况。

## React 和 React DOM 版本不匹配 {#mismatching-versions-of-react-and-react-dom}

你可能使用的是尚未支持 Hook 的 `react-dom`（< 16.8.0）或 `react-native`（< 0.59）版本。你可以在应用文件夹中执行 `npm ls react-dom` 或 `npm ls react-native` 来检当前使用的版本。如果你发现不止一个相关的依赖，可能也会产生问题（在后面的小节会进行说明）。

## 打破了 Hook 的规则 {#breaking-the-rules-of-hooks}

你只能在**当 React 渲染函数组件时**调用 Hook：

* ✅ 在函数组件的顶层调用它们。
* ✅ 在[自定义 Hook](/docs/hooks-custom.html) 的顶层调用它们。

**查看 [Hook 的规则](/docs/hooks-rules.html)以了解更多内容。**

```js{2-3,8-9}
function Counter() {
  // ✅ Good：函数组件的顶层
  const [count, setCount] = useState(0);
  // ...
}

function useWindowWidth() {
  // ✅ Good：自定义 Hook 的顶层
  const [width, setWidth] = useState(window.innerWidth);
  // ...
}
```

为避免困惑，在以下情况中调用 Hook 是**不**被支持的：

* 🔴 不要在 class 组件中调用 Hook。
* 🔴 不要在 event handlers 中调用。
* 🔴 不要在 `useMemo`、`useReducer` 或 `useEffect` 的参数函数中调用。

如果你打破了这些规则，那么你可能就会看到本错误。

```js{3-4,11-12,20-21}
function Bad1() {
  function handleClick() {
    // 🔴 Bad：在 event handler 内部 (移到外部来修复它)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad2() {
  const style = useMemo(() => {
    // 🔴 Bad：在 useMemo 内部 (移到外部来修复它)
    const theme = useContext(ThemeContext);
    return createStyle(theme);
  });
  // ...
}

class Bad3 extends React.Component {
  render() {
    // 🔴 Bad：在 class 组件内部
    useEffect(() => {})
    // ...
  }
}
```

你可以使用 [`eslint-plugin-react-hooks` 插件](https://www.npmjs.com/package/eslint-plugin-react-hooks)来捕获这些错误。

> 注意
>
> [自定义 Hook](/docs/hooks-custom.html) *可能会*调用其他 Hook（这恰好是他们的用途）。这是可行的，因为自定义 Hook 也应该只在函数组件渲染时被调用。


## 重复的 React {#duplicate-react}

为了使 Hook 正常工作，你应用代码中的 `react` 依赖以及 `react-dom` 的 package 内部使用的 `react` 依赖，必须解析为同一个模块。

如果这些 `react` 依赖解析为两个不同的导出对象，你就会看到本警告。这可能发生在你**意外地引入了两个 `react` 的 package 副本**。

如果你用的是 Node 作为 package 管理工具，你可以执行以下代码来检查你的项目文件夹：

    npm ls react

如果你看到多个 React，则需要弄清楚为什么会发生这种情况，并修复 dependency 树。例如，你使用的库可能错误地指定 `react` 作为 dependency（而不是 peer dependency）。在该库修复之前，[Yarn resolutions](https://yarnpkg.com/lang/en/docs/selective-version-resolutions/) 是一种可行的解决方案。

你也可以通过添加一些 log 并重启开发服务器来尝试 debug：

```js
// 在 node_modules/react-dom/index.js 中加入这一行
window.React1 = require('react');

// 在你的组件文件中加入这些代码
require('react-dom');
window.React2 = require('react');
console.log(window.React1 === window.React2);
```

如果打印出 `false`，那么你可能调用了两个 React，你需要弄清楚为什么会发生这种情况。[这个 issue](https://github.com/facebook/react/issues/13991) 包含了一些社区中常见的原因。

这个问题也可能发生在你使用 `npm link` 或等效方案时。在这种情况下，你的打包器可能会“检测”到两个 React —— 一个在应用项目文件夹中，另一个在你的工具库文件夹中。假设 `myapp` 和 `mylib` 是同级文件夹，一个可能的修复方法是在 `mylib` 执行 `npm link ../myapp/node_modules/react`。这将会使得工具库使用应用项目中的 React 副本。

> 注意
>
> 通常，React 支持在单个页面上使用多个独立副本（例如，应用和第三方小部件都使用它）。错误只会发生在，当组件和渲染它的 `react-dom` 副本两者中的 `require（'react'）` 解析不相同时。

## 其他原因 {#other-causes}

如果这些方法都不起效，请在[这个 issue](https://github.com/facebook/react/issues/13991) 中发表评论，我们将尽力提供帮助。尝试创建一个小型的重现示例 —— 重现你会发现问题的做法。
