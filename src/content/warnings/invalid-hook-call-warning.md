---
title: Hook 规则
---

你进入到这个页面，大概是因为遇到了下面这个错误提示：

<ConsoleBlock level="error">

Hooks can only be called inside the body of a function component.

</ConsoleBlock>

通常有以下 3 个错误原因：

1. 你可能 **打破了 Hook 的使用规则**。
2. 你可能使用了 **版本不一致** 的 React 和 React DOM。
3. 你可能在同一个应用当中使用了 **重复的 React 引用**。

让我们来逐个看看这些问题。

## 打破了 Hook 的使用规则 {/*breaking-rules-of-hooks*/}

在 React 中被调用的且以 `use` 开头命名的函数叫 [**Hook**](/reference/react)。

**不要在循环语句内、条件语句后或嵌套的函数内调用 Hook**。反之，应该始终保证 Hook 在函数式组件的顶层，并避免在 Hook 调用前过早终止函数。你只能在 React 渲染函数式组件的过程当中调用 Hook：

* ✅ 在 [函数式组件](/learn/your-first-component) 内部的顶级作用域调用他们。
* ✅ 在 [自定义 Hook](/learn/reusing-logic-with-custom-hooks) 内部的顶级作用域调用他们。

```js{2-3,8-9}
function Counter() {
  // ✅ 正确：函数式组件的顶级作用域
  const [count, setCount] = useState(0);
  // ...
}

function useWindowWidth() {
  // ✅ 正确：自定义 Hook 的顶级作用域
  const [width, setWidth] = useState(window.innerWidth);
  // ...
}
```

以下有几个要点，这些情况下 **不** 支持调用 Hook（以 `use` 开头的函数），例如：

* 🔴 不要在条件语句内或循环语句内调用 Hook。
* 🔴 不要在包含 `return` 的条件语句之后调用 Hook。
* 🔴 不要在事件监听中调用 Hook。
* 🔴 不要在类式组件内调用 Hook。
* 🔴 不要在那些传给 `useMemo`，`useReducer` 或 `useEffect` 的函数内调用 Hook。

如果你打破了这些规则，你可能就会看到这个错误提示。

```js{3-4,11-12,20-21}
function Bad({ cond }) {
  if (cond) {
    // 🔴 错误：在条件语句内调用（修复办法：把它挪到外层！）
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  for (let i = 0; i < 10; i++) {
    // 🔴 错误：在循环内调用（修复办法：把它挪到外层！）
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad({ cond }) {
  if (cond) {
    return;
  }
  // 🔴 错误：在包含 return 的条件语句后调用（修复办法：挪到 return 之前！）
  const theme = useContext(ThemeContext);
  // ...
}

function Bad() {
  function handleClick() {
    // 🔴 错误：在事件监听器或回调中调用（修复办法：把它挪到外层！）
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  const style = useMemo(() => {
    // 🔴 错误：在 useMemo 内调用（修复办法：把它挪到外层！）
    const theme = useContext(ThemeContext);
    return createStyle(theme);
  });
  // ...
}

class Bad extends React.Component {
  render() {
    // 🔴 错误：在类式组件内调用（修复办法：写一个函数式组件而不是类式组件！）
    useEffect(() => {})
    // ...
  }
}
```

你可以借助 [`eslint-plugin-react-hooks` 插件](https://www.npmjs.com/package/eslint-plugin-react-hooks) 来帮你提前暴露这些错误。

<Note>

[自定义 Hook](/learn/reusing-logic-with-custom-hooks) **可能** 被其他的 Hook 调用 (这仍然符合设计初衷)。为什么呢？因为自定义 Hook 也是被设定为只能在函数式组件渲染过程中被调用。

</Note>

## 版本不一致的 React 和 React DOM {/*mismatching-versions-of-react-and-react-dom*/}

你可能正在使用一个还不支持 Hook 的版本，例如 `react-dom`（< 16.8.0）或 `react-native`（< 0.59）。你可以在你的应用目录下执行 `npm ls react-dom` 或 `npm ls react-native` 来检查下你正在使用的版本。如果你发现了同一个包有多个版本，那也可能带来其他的问题（下文会详细展开）。

## 重复的 React {/*duplicate-react*/}

为了使 Hook 正常工作，你需要确保你应用代码中所引用的 `react` 和 `react-dom` 内部使用的 `react` 是同一个来源。

如果上述的两个 `react` 是使用不同模块导出的值，你可能会看到这个警告信息。一般来说，原因都会是你 **意外地使用了重复的** `react` 包。

如果你用的是 Node 进行包管理，你可以在你的应用目录下执行这个命令做个检查：

<TerminalBlock>

npm ls react

</TerminalBlock>

如果你看到了超过 1 个 `React`，你可能需要去搞明白为什么会这样，并且修复一下你的包依赖关系。举个例子：你可能用了一个包，其内部错误地声明了 `react` 作为它的依赖（推荐做法应该是在 peerDependency 中）。在这个包被修复之前，[yarn resolutions](https://yarnpkg.com/lang/en/docs/selective-version-resolutions/) 可以作为一个临时解决办法。

你也可以通过增加一些日志，然后重启你的开发服务器，这样你就可以自己来调试这个问题了：

```js
// 把下面这行加在 node_modules/react-dom/index.js
window.React1 = require('react');

// 把下面这几行加入到你的组件逻辑中
require('react-dom');
window.React2 = require('react');
console.log(window.React1 === window.React2);
```

如果你在控制台看到打印了 `false`，那代表你的项目中存在两个 React，你需要搞明白这是为什么。[此 issue](https://github.com/facebook/react/issues/13991) 列举了一些常见的可能的原因。

如果你使用了 `npm link` 或者同类操作，也有可能导致这个问题出现。在这种情况下，你的构建工具可能会“看到”两个不同的 React——一个在应用目录，另一个则在工具库的目录。假设 `myapp` 和 `mylib` 是两个相邻的目录，一个可能有效的解决办法是在 `mylib` 目录下执行 `npm link ../myapp/node_modules/react`，这样就能让工具库里面使用的 React 和你应用里面使用的是同一个了。

<Note>

通常来讲，在一个页面上使用多个相互独立的 React 是完全没问题的（举个例子，应用和第三方库同时使用各自的 React）。只有当你组件里引用的 `react` 和 `react-dom` 里引用的 `react` 不一致时，才会导致这个报错。

</Note>

## 其他原因 {/*other-causes*/}

如果上文没有解决你的问题，你可以在 [此 issue](https://github.com/facebook/react/issues/13991) 中提交评论，我们会积极地提供帮助。评论的时候，如果能提供一个小的、能复现的示例那最好不过了。
