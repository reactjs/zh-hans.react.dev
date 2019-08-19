---
id: testing
title: 测试概览
permalink: docs/testing.html
redirect_from:
  - "community/testing.html"
next: testing-recipes.html
---

你可以用像测试其他 JavaScript 代码类似的方式测试 React 组件。

现在有许多种测试 React 组件的方法。大体上可以被分为两类：

* **渲染组件树** 在一个简化的测试环境中渲染组件树并对它们的输出做断言检查。
* **运行完整应用** 在一个真实的浏览器环境中运行整个应用（也被称为“端到端（end-to-end）”测试）。

本章节主要专注于第一种情况下的测试策略。虽然完整的端到端测试在防止对重要工作流的多次回归方面很有价值，但对 React 组件来说这类测试并不怎么需要关注，因此不在本章节的讨论范围之内。

### 权衡 {#tradeoffs}


当挑选测试工具的时候，有些细节值得我们权衡考虑：

* **迭代速度 vs 真实环境：** 一些工具在做出改动和看到结果之间提供了非常快速的反馈循环，但没有精确的模拟浏览器的行为。另一些工具，也许使用了真实的浏览器环境，但却降低了迭代速度，而且在持续集成服务器中不太可靠。
* **mock 到什么程度：** 对组件来说，“单元测试”和“集成测试”之间的差别可能会很模糊。如果你在测试一个表单，用例是否应该也测试表单里的按钮呢？一个按钮组件又需不需要有他自己的测试套件？重构按钮组件是否应该影响表单的测试用例？

不同的团队或产品可能会得出不同的答案。

### 推荐的工具 {#tools}

**[Jest](https://facebook.github.io/jest/)** 是一个 JavaScript 测试运行器。它允许你使用 [`jsdom`](/docs/testing-environments.html#mocking-a-rendering-surface) 操作 DOM 。尽管 jsdom 只是对浏览器工作表现的一个近似模拟，对测试 React 组件来说它通常也已经够用了。Jest 有着十分优秀的迭代速度，同时还提供了若干强大的功能，比如它可以模拟 [modules](/docs/testing-environments.html#mocking-modules) 和 [timers](/docs/testing-environments.html#mocking-timers) 让你更精细的控制代码如何执行。

**[React 测试库](https://testing-library.com/react)**是一组能让你不依赖 React 组件具体实现对他们进行测试的辅助工具。它让重构工作变得轻而易举，还会推动你拥抱有关无障碍的最佳实践。虽然它不能让你省略子元素来浅（shallowly）渲染一个组件，但像 Jest 这样的测试运行器可以通过 [mocking](/docs/testing-recipes.html#mocking-modules) 让你做到。

### 了解更多 {#learn-more}

这一章节被划分成了两页内容：

- [技巧](/docs/testing-recipes.html)：为 React 组件编写测试时的常见模式。
- [环境](/docs/testing-environments.html)：为 React 组件搭建测试环境的时候有哪些要考虑的东西。
