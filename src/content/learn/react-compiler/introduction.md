---
title: 介绍
---

<Intro>
React 编译器是一个新的构建时工具，它可以自动优化你的 React 应用。它支持纯 JavaScript，并且了解 [React 的规则](/reference/rules)，因此你无需重写任何代码即可使用它。
</Intro>

<YouWillLearn>

* React 编译器的作用
* 如何开始使用该编译器
* 渐进式采用策略
* 出现问题时的调试与排查
* 在你的 React 库中使用该编译器

</YouWillLearn>

## What does React Compiler do? {/*what-does-react-compiler-do*/}

React 编译器会在构建时自动优化你的 React 应用。通常情况下，即使不进行优化，React 的性能也已经足够快，但有时你需要手动对组件和值进行记忆化（memoization）以保持应用的响应速度。这种手动记忆化既繁琐又容易出错，并且会增加需要维护的额外代码。React 编译器为你自动完成这些优化，减轻了你的思维负担，使你可以专注于功能的开发。

### 在使用 React 编译器之前 {/*before-react-compiler*/}

没有编译器的情况下，你需要手动对组件和值进行记忆化以优化重新渲染：

```js
import { useMemo, useCallback, memo } from 'react';

const ExpensiveComponent = memo(function ExpensiveComponent({ data, onClick }) {
  const processedData = useMemo(() => {
    return expensiveProcessing(data);
  }, [data]);

  const handleClick = useCallback((item) => {
    onClick(item.id);
  }, [onClick]);

  return (
    <div>
      {processedData.map(item => (
        <Item key={item.id} onClick={() => handleClick(item)} />
      ))}
    </div>
  );
});
```

<Note>

这种手动记忆化存在一个会破坏记忆化效果的细微 bug：

```js [[2, 1, "() => handleClick(item)"]]
<Item key={item.id} onClick={() => handleClick(item)} />
```

尽管 `handleClick` 被 `useCallback` 包裹，但每次组件渲染时，箭头函数 `() => handleClick(item)` 都会创建一个新的函数。这意味着 `Item` 总会接收到一个新的 `onClick` prop，从而破坏了记忆化效果。

React 编译器无论是否存在这个箭头函数，都能够正确地进行优化，确保 `Item`  仅在 `props.onClick` 变化时才重新渲染。

</Note>

### 在使用 React 编译器之后 {/*after-react-compiler*/}

使用 React 编译器，你可以编写相同的代码而无需手动进行记忆化：

```js
function ExpensiveComponent({ data, onClick }) {
  const processedData = expensiveProcessing(data);

  const handleClick = (item) => {
    onClick(item.id);
  };

  return (
    <div>
      {processedData.map(item => (
        <Item key={item.id} onClick={() => handleClick(item)} />
      ))}
    </div>
  );
}
```

__[在 React 编译器游乐场中查看此示例](https://playground.react.dev/#N4Igzg9grgTgxgUxALhAMygOzgFwJYSYAEAogB4AOCmYeAbggMIQC2Fh1OAFMEQCYBDHAIA0RQowA2eOAGsiAXwCURYAB1iROITA4iFGBERgwCPgBEhAogF4iCStVoMACoeO1MAcy6DhSgG4NDSItHT0ACwFMPkkmaTlbIi48HAQWFRsAPlUQ0PFMKRlZFLSWADo8PkC8hSDMPJgEHFhiLjzQgB4+eiyO-OADIwQTM0thcpYBClL02xz2zXz8zoBJMqJZBABPG2BU9Mq+BQKiuT2uTJyomLizkoOMk4B6PqX8pSUFfs7nnro3qEapgFCAFEA)__

React 编译器会自动应用等效的优化，确保你的应用只在必要时重新渲染。

<DeepDive>
#### React 编译器添加了哪种类型的记忆化？ {/*what-kind-of-memoization-does-react-compiler-add*/}

React 编译器的自动记忆化主要专注于 **提高更新性能（重新渲染现有组件）**，因此它聚焦于以下两种使用场景：

1. **跳过组件的级联重新渲染**
    * 重新渲染 `<Parent />` 会导致其组件树中的许多组件重新渲染，即使只有 `<Parent />` 发生了变化
1. **跳过 React 外部的昂贵计算**
    * 例如，在组件或 Hook 中调用 `expensivelyProcessAReallyLargeArrayOfObjects()` 这个处理大数据数组的函数

#### 优化重新渲染 {/*optimizing-re-renders*/}

React 允许你将 UI 表达为其当前状态的函数（更具体地说：其 props、state 和 context）。在其当前的实现中，当一个组件的状态发生变化时，React 会重新渲染该组件 __及其所有子组件__，除非你使用了 `useMemo()`、`useCallback()` 或 `React.memo()` 进行手动记忆优化。例如，在以下示例中，每当 `<FriendList>` 的状态变化时，`<MessageButton>` 都会重新渲染：

```javascript
function FriendList({ friends }) {
  const onlineCount = useFriendOnlineCount();
  if (friends.length === 0) {
    return <NoFriends />;
  }
  return (
    <div>
      <span>{onlineCount} online</span>
      {friends.map((friend) => (
        <FriendListCard key={friend.id} friend={friend} />
      ))}
      <MessageButton />
    </div>
  );
}
```
[__在 React 编译器游乐场中查看此示例__](https://playground.react.dev/#N4Igzg9grgTgxgUxALhAMygOzgFwJYSYAEAYjHgpgCYAyeYOAFMEWuZVWEQL4CURwADrEicQgyKEANnkwIAwtEw4iAXiJQwCMhWoB5TDLmKsTXgG5hRInjRFGbXZwB0UygHMcACzWr1ABn4hEWsYBBxYYgAeADkIHQ4uAHoAPksRbisiMIiYYkYs6yiqPAA3FMLrIiiwAAcAQ0wU4GlZBSUcbklDNqikusaKkKrgR0TnAFt62sYHdmp+VRT7SqrqhOo6Bnl6mCoiAGsEAE9VUfmqZzwqLrHqM7ubolTVol5eTOGigFkEMDB6u4EAAhKA4HCEZ5DNZ9ErlLIWYTcEDcIA)

React 编译器会自动应用与手动记忆化等效的优化，确保随着状态的变化，应用中只有相关的部分会重新渲染，这有时被称为“细粒度响应式”。在上面的示例中，React 编译器确定即使 `friends` 发生变化，`<FriendListCard />` 的返回值也可以被重用，并且可以避免重新创建此 JSX，同时避免在 count 变化时重新渲染 `<MessageButton>`。

#### 昂贵的计算也会被记忆化 {/*expensive-calculations-also-get-memoized*/}

React 编译器还可以自动记忆化渲染期间使用的昂贵计算：

```js
// **不会** 被 React 编译器记忆化，因为它不是一个组件或 hook
function expensivelyProcessAReallyLargeArrayOfObjects() { /* ... */ }

// 会被 React 编译器记忆化，因为它是一个组件
function TableContainer({ items }) {
  // 这个函数调用将被记忆化：
  const data = expensivelyProcessAReallyLargeArrayOfObjects(items);
  // ...
}
```
[__在 React 编译器游乐场中查看此示例__](https://playground.react.dev/#N4Igzg9grgTgxgUxALhAejQAgFTYHIQAuumAtgqRAJYBeCAJpgEYCemASggIZyGYDCEUgAcqAGwQwANJjBUAdokyEAFlTCZ1meUUxdMcIcIjyE8vhBiYVECAGsAOvIBmURYSonMCAB7CzcgBuCGIsAAowEIhgYACCnFxioQAyXDAA5gixMDBcLADyzvlMAFYIvGAAFACUmMCYaNiYAHStOFgAvk5OGJgAshTUdIysHNy8AkbikrIKSqpaWvqGIiZmhE6u7p7ymAAqXEwSguZcCpKV9VSEFBodtcBOmAYmYHz0XIT6ALzefgFUYKhCJRBAxeLcJIsVIZLI5PKFYplCqVa63aoAbm6u0wMAQhFguwAPPRAQA+YAfL4dIloUmBMlODogDpAA)

然而，如果 `expensivelyProcessAReallyLargeArrayOfObjects` 真的是一个昂贵的函数，你可能需要考虑在 React 之外实现其自身的记忆化，因为：

- React 编译器只对 React 组件和 Hook 进行记忆化，而不是所有函数
- React 编译器的记忆化不会在多个组件或 Hook 之间共享

因此，如果 `expensivelyProcessAReallyLargeArrayOfObjects` 在许多不同的组件中使用，即使传递了完全相同的 items，这个昂贵的计算也会被重复运行。我们建议在使代码变得更复杂之前，先 [profiling](reference/react/useMemo#how-to-tell-if-a-calculation-is-expensive) 以确定计算是否真的那么昂贵。
</DeepDive>

## 我应该尝试这个编译器吗？ {/*should-i-try-out-the-compiler*/}

我们鼓励大家开始使用 React 编译器。虽然目前编译器仍是 React 的可选附加功能，但未来某些功能可能需要编译器才能完整运行。

### 使用起来安全吗？ {/*is-it-safe-to-use*/}

React 编译器目前已经稳定，并且在生产环境中进行了广泛测试。虽然像 Meta 这样的公司已经在生产中使用了它，但是否将编译器部署到你的应用程序生产环境，将取决于你的代码库状况以及你对 [React 规则](/reference/rules) 的遵循程度。

## 支持哪些构建工具？ {/*what-build-tools-are-supported*/}

React 编译器可以在多个构建工具中安装，例如 [Babel、Vite、Metro 和 Rsbuild](/learn/react-compiler/installation)。

React 编译器主要是围绕核心编译器构建的一个轻量级 Babel 插件封装，其设计初衷是为了与 Babel 本身解耦。尽管编译器的第一个稳定版本主要仍然是一个 Babel 插件，但我们正在与 swc 和 [oxc](https://github.com/oxc-project/oxc/issues/10048) 团队合作，为 React 编译器构建一流的支持，这样你将来无需再将 Babel 添加到你的构建流程中。

Next.js 用户可以通过使用 [v15.3.1](https://github.com/vercel/next.js/releases/tag/v15.3.1) 或更高版本来启用由 swc 调用的 React 编译器。

## 关于 useMemo、useCallback 和 React.memo 我应该怎么做？ {/*what-should-i-do-about-usememo-usecallback-and-reactmemo*/}

By default, React Compiler will memoize your code based on its analysis and heuristics. In most cases, this memoization will be as precise, or moreso, than what you may have written.

However, in some cases developers may need more control over memoization. The `useMemo` and `useCallback` hooks can continue to be used with React Compiler as an escape hatch to provide control over which values are memoized. A common use-case for this is if a memoized value is used as an effect dependency, in order to ensure that an effect does not fire repeatedly even when its dependencies do not meaningfully change.

For new code, we recommend relying on the compiler for memoization and using `useMemo`/`useCallback` where needed to achieve precise control.

For existing code, we recommend either leaving existing memoization in place (removing it can change compilation output) or carefully testing before removing the memoization.

## 尝试 React 编译器 {/*try-react-compiler*/}

本节将帮助你开始使用 React 编译器，并了解如何在项目中有效地使用它。

* **[安装](/learn/react-compiler/installation)** - 安装 React 编译器并为你的构建工具进行配置
* **[React 版本兼容性](/reference/react-compiler/target)** - 支持 React 17、18 和 19
* **[配置](/reference/react-compiler/configuration)** - 根据你的特定需求自定义编译器
* **[渐进式采用](/learn/react-compiler/incremental-adoption)** - 在现有代码库中逐步推广编译器的策略
* **[调试与故障排除](/learn/react-compiler/debugging)** - 识别并解决使用编译器时的问题
* **[编译库](/reference/react-compiler/compiling-libraries)** - 发布已编译代码的最佳实践
* **[API 参考](/reference/react-compiler/configuration)** - 所有配置选项的详细文档

## 其他资源 {/*additional-resources*/}

除了这些文档外，我们还建议查看 [React 编译器工作组](https://github.com/reactwg/react-compiler) 以获取有关该编译器的更多信息和讨论。

