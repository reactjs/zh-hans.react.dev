---
title: 调试和故障排除
---

<Intro>
本指南可帮助您在使用 React Compiler 时识别和修复问题。学习如何调试编译问题并解决常见错误。
</Intro>

<YouWillLearn>

* 编译器错误与运行时问题的区别
* 导致编译失败的常见模式
* 分步调试工作流程

</YouWillLearn>

## 了解编译器行为 {/*understanding-compiler-behavior*/}

React 编译器旨在处理遵循 [React 规则](/reference/rules) 的代码。当遇到可能违反这些规则的代码时，它会安全地跳过优化，而不是冒险改变应用程序的行为。

### 编译器错误与运行时问题 {/*compiler-errors-vs-runtime-issues*/}

**编译错误** 发生在构建时，并会阻止你的代码编译。这类错误很少见，因为编译器的设计理念是跳过有问题的代码而不是直接失败。

**运行时问题** 发生在已编译的代码行为与预期不符时。大多数情况下，如果你遇到了与 React 编译器相关的问题，这通常是运行时问题。这通常是因为你的代码以编译器无法检测到的方式轻微违反了 React 的规则，而编译器错误地编译了一个本应跳过的组件。

在调试运行时问题时，应集中精力在受影响的组件中查找 ESLint 规则未能检测到的 React 规则违规情况。编译器依赖于你的代码遵循这些规则，当规则被违反且编译器无法检测到时，就会出现运行时问题。


## 常见的破坏性模式 {/*common-breaking-patterns*/}

React Complier 可能导致你的应用出错的一个主要方式是，如果你的代码是基于正确性的记忆化（memoization）编写的。这意味着你的应用依赖于某些特定值的记忆化来正常工作。由于编译器的记忆化方式可能与你手动实现的方式不同，这可能导致一些意外行为，例如副作用重复触发、无限循环或更新丢失。

这种情况常见的场景包括：

- **依赖引用相等性的副作用** - 当副作用依赖于对象或数组在多次渲染中保持相同的引用
- **需要稳定引用的依赖数组** - 当不稳定的依赖导致副作用触发过于频繁或产生无限循环
- **基于引用判断的条件逻辑** - 当代码使用引用相等性检查来进行缓存或优化

## 调试工作流程 {/*debugging-workflow*/}

遇到问题时，请按照以下步骤操作：

### 编译器构建错误 {/*compiler-build-errors*/}

如果你遇到一个意外中断构建的编译器错误，这很可能是编译器中的一个 bug。请将以下信息报告到 [facebook/react](https://github.com/facebook/react/issues) 仓库：
- 错误信息
- 导致错误的代码
- 你使用的 React 和编译器版本

### 运行时问题 {/*runtime-issues*/}

关于运行时行为问题：

### 1. 临时禁用编译 {/*temporarily-disable-compilation*/}

使用 `"use no memo"` 来确定问题是否与编译器相关：

```js
function ProblematicComponent() {
  "use no memo"; // Skip compilation for this component
  // ... rest of component
}
```

如果问题消失，则很可能与违反 React 规则有关。

你还可以尝试从问题组件中移除手动的 memoization（useMemo、useCallback 和 memo），以验证在没有任何 memoization 的情况下应用程序是否能正常工作。如果在所有 memoization 都被移除后问题仍然存在，则说明存在需要修复的 React 规则违反情况。

### 2. 逐步修复问题 {/*fix-issues-step-by-step*/}

1. 识别根本原因（通常是为了正确性的记忆化问题）
2. 每次修复后进行测试
3. 修复完成后移除 `"use no memo"`
4. 在 React DevTools 中验证组件是否显示 ✨ 徽章

## 报告编译器错误 {/*reporting-compiler-bugs*/}

如果你认为发现了一个编译器错误：

1. **确认不是违反 React 规则的问题** - 使用 ESLint 进行检查
2. **创建最小的复现代码** - 在一个小示例中隔离问题
3. **在不使用编译器的情况下测试** - 确认问题仅在编译时出现
4. **提交一个 [issue](https://github.com/facebook/react/issues/new?template=compiler_bug_report.yml)**：
  - React 和编译器的版本
  - 最小复现代码
  - 预期行为与实际行为
  - 任何错误信息

## 下一步 {/*next-steps*/}

- 查看 [React 规则](/reference/rules) 以防止问题发生
- 查阅 [渐进采用指南](/learn/react-compiler/incremental-adoption) 以获取逐步推广策略
