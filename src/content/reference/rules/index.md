---
title: React 规则
---

<Intro>
正如不同的编程语言有自己表达概念的方式，React 有自己的习惯用法或者规则，用于以易于理解的方式表达模式，从而产生高质量的应用程序。
</Intro>

<InlineToc />

---

<Note>
要了解更多关于使用 React 表达 UI 的信息，我们推荐阅读 [React 哲学](/learn/thinking-in-react)。
</Note>

本节描述了你需要遵循的规则，以编写符合 React 习惯的代码。编写符合 React 习惯的代码可以帮助你编写组织良好、安全、可组合的应用程序。这些属性使你的应用程序更加适应变化，并且使得与其他开发人员、库和工具合作更加容易。

这些规则被称为 **React 规则**。 它们是规则——而不仅仅是指导原则——的意义在于，如果这些规则被违反，你的应用程序可能会有 bugs。你的代码也会变得不符合 React 习惯，更难以理解和推理。

我们强烈推荐使用 [Strict Mode](/reference/react/StrictMode) 以及 React 的 [ESLint 插件](https://www.npmjs.com/package/eslint-plugin-react-hooks) 来帮助你的代码库遵循 React 规则。通过遵循 React 规则，你将能够发现并解决这些 bugs，并保持你的应用程序易于维护。

---

## 组件和 Hook 必须是纯净的 {/*components-and-hooks-must-be-pure*/}

[组件和 Hook 中的纯净性](/reference/rules/components-and-hooks-must-be-pure) 是 React 的一个关键规则，它使你的应用程序变得可预测、易于调试，并允许 React 自动优化你的代码。

* [组件必须是幂等的](/reference/rules/components-and-hooks-must-be-pure#components-and-hooks-must-be-idempotent)——React 组件被假定为总是针对它们一样的输入——props、state 和 context 返回相同的输出。
* [副作用必须在渲染之外运行](/reference/rules/components-and-hooks-must-be-pure#side-effects-must-run-outside-of-render)——副作用不应该在渲染中运行，因为 React 可能会多次渲染组件以创建最佳的用户体验。
* [属性和状态是不可变的](/reference/rules/components-and-hooks-must-be-pure#props-and-state-are-immutable)——一个组件的属性和状态是针对单次渲染的不可变快照。永远不要直接修改它们。
* [Hook 的返回值和参数是不可变的](/reference/rules/components-and-hooks-must-be-pure#return-values-and-arguments-to-hooks-are-immutable)——一旦值被传递给 Hook，你不应该修改它们。就像在 JSX 中的属性一样，值在被传递给 Hook 时变得不可变。
* [值在被传递给 JSX 后是不可变的](/reference/rules/components-and-hooks-must-be-pure#values-are-immutable-after-being-passed-to-jsx)——不要在值已经被用于 JSX 后修改它们。在创建 JSX 之前进行修改。

---

## React 调用组件和 Hook {/*react-calls-components-and-hooks*/}

[React 负责在必要时渲染组件和 Hook 以优化用户体验](/reference/rules/react-calls-components-and-hooks)。它是声明式的：你在组件逻辑中告诉 React 需要渲染什么，React 会找出最佳方式将其展示给用户。

* [永远不要直接调用组件函数](/reference/rules/react-calls-components-and-hooks#never-call-component-functions-directly)——组件应该只在 JSX 中使用。不要将它们作为常规函数调用。
* [永远不要将 Hook 作为常规值传递](/reference/rules/react-calls-components-and-hooks#never-pass-around-hooks-as-regular-values)——Hook 应该只在组件内部调用。不要将其作为常规值传递。

---

## Hook 的规则 {/*rules-of-hooks*/}

Hook 使用 JavaScript 函数定义，但它们代表一种特殊的可重用 UI 逻辑，并且它们在调用位置上有限制。当你使用 Hook 时，需要遵循 [Hook 的规则](/reference/rules/rules-of-hooks)。

* [只在顶层调用 Hook](/reference/rules/rules-of-hooks#only-call-hooks-at-the-top-level)——不要在循环、条件或嵌套函数中调用 Hook。相反，总是在你的 React 函数的顶层使用 Hook，并且在任何早期返回之前使用。
* [只在 React 函数中调用 Hook](/reference/rules/rules-of-hooks#only-call-hooks-from-react-functions)——不要从常规 JavaScript 函数中调用 Hook。

