---
title: 介绍
---

<Intro>
React Compiler 是一个新的构建时工具，它可以自动优化你的 React 应用。它支持纯 JavaScript，并且了解 [React 的规则](/reference/rules)，因此你无需重写任何代码即可使用它。
</Intro>

<YouWillLearn>

* React 编译器的作用
* 如何开始使用该编译器
* 渐进式采用策略
* 出现问题时的调试与排查
* 在你的 React 库中使用该编译器

</YouWillLearn>

<Note>
React Compiler 目前处于发布候选（RC）阶段。我们现在建议所有人尝试使用该编译器并提供反馈。最新的 RC 版本可以通过 `@rc` 标签找到。
</Note>

## React 编译器是做什么的？ {/*what-does-react-compiler-do*/}

React Compiler 会在构建时自动优化你的 React 应用。通常情况下，即使不进行优化，React 的性能也已经足够快，但有时你需要手动对组件和值进行记忆化（memoization）以保持应用的响应速度。这种手动记忆化既繁琐又容易出错，并且会增加需要维护的额外代码。React Compiler 为你自动完成这些优化，减轻了你的思维负担，使你可以专注于功能的开发。

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
[_See this example in the React Compiler Playground_](https://playground.react.dev/#N4Igzg9grgTgxgUxALhAMygOzgFwJYSYAEAYjHgpgCYAyeYOAFMEWuZVWEQL4CURwADrEicQgyKEANnkwIAwtEw4iAXiJQwCMhWoB5TDLmKsTXgG5hRInjRFGbXZwB0UygHMcACzWr1ABn4hEWsYBBxYYgAeADkIHQ4uAHoAPksRbisiMIiYYkYs6yiqPAA3FMLrIiiwAAcAQ0wU4GlZBSUcbklDNqikusaKkKrgR0TnAFt62sYHdmp+VRT7SqrqhOo6Bnl6mCoiAGsEAE9VUfmqZzwqLrHqM7ubolTVol5eTOGigFkEMDB6u4EAAhKA4HCEZ5DNZ9ErlLIWYTcEDcIA)

React Compiler automatically applies the equivalent of manual memoization, ensuring that only the relevant parts of an app re-render as state changes, which is sometimes referred to as "fine-grained reactivity". In the above example, React Compiler determines that the return value of `<FriendListCard />` can be reused even as `friends` changes, and can avoid recreating this JSX _and_ avoid re-rendering `<MessageButton>` as the count changes.

#### Expensive calculations also get memoized {/*expensive-calculations-also-get-memoized*/}

React Compiler can also automatically memoize expensive calculations used during rendering:

```js
// **Not** memoized by React Compiler, since this is not a component or hook
function expensivelyProcessAReallyLargeArrayOfObjects() { /* ... */ }

// Memoized by React Compiler since this is a component
function TableContainer({ items }) {
  // This function call would be memoized:
  const data = expensivelyProcessAReallyLargeArrayOfObjects(items);
  // ...
}
```
[_See this example in the React Compiler Playground_](https://playground.react.dev/#N4Igzg9grgTgxgUxALhAejQAgFTYHIQAuumAtgqRAJYBeCAJpgEYCemASggIZyGYDCEUgAcqAGwQwANJjBUAdokyEAFlTCZ1meUUxdMcIcIjyE8vhBiYVECAGsAOvIBmURYSonMCAB7CzcgBuCGIsAAowEIhgYACCnFxioQAyXDAA5gixMDBcLADyzvlMAFYIvGAAFACUmMCYaNiYAHStOFgAvk5OGJgAshTUdIysHNy8AkbikrIKSqpaWvqGIiZmhE6u7p7ymAAqXEwSguZcCpKV9VSEFBodtcBOmAYmYHz0XIT6ALzefgFUYKhCJRBAxeLcJIsVIZLI5PKFYplCqVa63aoAbm6u0wMAQhFguwAPPRAQA+YAfL4dIloUmBMlODogDpAA)

However, if `expensivelyProcessAReallyLargeArrayOfObjects` is truly an expensive function, you may want to consider implementing its own memoization outside of React, because:

- React Compiler only memoizes React components and hooks, not every function
- React Compiler's memoization is not shared across multiple components or hooks

So if `expensivelyProcessAReallyLargeArrayOfObjects` was used in many different components, even if the same exact items were passed down, that expensive calculation would be run repeatedly. We recommend [profiling](reference/react/useMemo#how-to-tell-if-a-calculation-is-expensive) first to see if it really is that expensive before making code more complicated.
</DeepDive>

## 我应该尝试这个编译器吗？ {/*should-i-try-out-the-compiler*/}

我们鼓励大家开始使用 React 编译器。虽然目前编译器仍是 React 的可选附加功能，但未来某些功能可能需要编译器才能完整运行。

### 使用起来安全吗？ {/*is-it-safe-to-use*/}

React 编译器目前已进入 RC 阶段，并已在生产环境中进行了广泛测试。虽然像 Meta 这样的公司已经在生产中使用了它，但是否将编译器部署到你的应用程序生产环境，将取决于你的代码库状况以及你对 [React 规则](/reference/rules) 的遵循程度。

## 支持哪些构建工具？ {/*what-build-tools-are-supported*/}

React Compiler 可以在多个构建工具中安装，例如 [Babel、Vite、Metro 和 Rsbuild](/learn/react-compiler/installation)。

React Compiler 主要是围绕核心编译器构建的一个轻量级 Babel 插件封装，其设计初衷是为了与 Babel 本身解耦。尽管编译器的第一个稳定版本主要仍然是一个 Babel 插件，但我们正在与 swc 和 [oxc](https://github.com/oxc-project/oxc/issues/10048) 团队合作，为 React Compiler 构建一流的支持，这样你将来无需再将 Babel 添加到你的构建流程中。

Next.js 用户可以通过使用 [v15.3.1](https://github.com/vercel/next.js/releases/tag/v15.3.1) 或更高版本来启用由 swc 调用的 React Compiler。

## 关于 useMemo、useCallback 和 React.memo 我应该怎么做？ {/*what-should-i-do-about-usememo-usecallback-and-reactmemo*/}

如果你正在使用 React 编译器，可以移除 [`useMemo`](/reference/react/useMemo)、[`useCallback`](/reference/react/useCallback) 和 [`React.memo`](/reference/react/memo)。React 编译器能够比使用这些 Hook 更精确和细致地添加自动记忆化功能。如果你选择保留手动记忆化，React 编译器会分析它们，并判断你的手动记忆化是否与其自动推断出的记忆化一致。如果不一致，编译器将选择放弃优化该组件。

这样做是出于谨慎考虑，因为手动记忆化常见的反模式是为了保证程序的正确性。这意味着你的应用依赖于对特定值进行记忆化才能正常运行。例如，为了防止无限循环，你可能会记忆某些值来阻止 `useEffect` 被触发。这违反了 React 的规则，但因为编译器自动移除手动记忆化可能会有潜在危险，所以会直接放弃优化。你应该手动移除自己的手动记忆化代码，并验证应用是否仍能按预期运行。

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

