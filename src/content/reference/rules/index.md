---
title: React 规则
---

<Intro>
正如不同的编程语言有其表达概念的方式一样，React 也有自己的俗语与规则，它们以一种易于理解并能帮助实现高质量应用程序的方式表达出来。
</Intro>

<InlineToc />

---

<Note>
要了解更多有关使用 React 表达 UI 的信息，我们建议阅读 [React 哲学](/learn/thinking-in-react)。
</Note>

本节描述需要遵循的规则，以编写俗语化的 React 代码。编写俗语化的 React 代码可以帮助编写组织良好、安全、可组合的应用程序。这些特性使应用程序更具抗变性，并且更易于与其他开发人员、库和工具一起使用。

这些规则被称为 **React 规则**。它们是规则而不仅仅是指南，因为如果它们被破坏，应用程序可能会有错误、代码也会变得不俗语化，更难以理解和推理。

我们强烈建议在使用 React 的同时使用 [严格模式](/reference/react/StrictMode) 以及 React 的 [ESLint 插件](https://www.npmjs.com/package/eslint-plugin-react-hooks) 来帮助代码库遵循 React 规则。通过遵循 React 规则，你将能够发现并解决这些错误，并保持应用程序的可维护性。

---

## 组件与 Hook 必须是纯粹的 {/*components-and-hooks-must-be-pure*/}

[组件与 Hook 必须是纯粹的](/reference/rules/components-and-hooks-must-be-pure) 是 React 的一个关键规则，它使应用程序可预测，易于调试，并允许 React 自动优化代码。

* [组件必须是幂等的](/reference/rules/components-and-hooks-must-be-pure#components-and-hooks-must-be-idempotent) —— React 组件假定始终返回与其输入（props、state 与上下文）相同的输出。
* [副作用必须在渲染外运行](/reference/rules/components-and-hooks-must-be-pure#side-effects-must-run-outside-of-render) —— Effect 不应在渲染中运行，因为 React 可能多次渲染组件以创建最佳的用户体验。
* [Props 和 state 是不可变的](/reference/rules/components-and-hooks-must-be-pure#props-and-state-are-immutable) —— 组件的 props 和 state 是针对单次渲染的不可变快照。永远不要直接改变它们。
* [返回给 Hook 的值和参数是不可变的](/reference/rules/components-and-hooks-must-be-pure#return-values-and-arguments-to-hooks-are-immutable) —— 一旦值被传递给一个 Hook，那么就不应该修改它们。与 JSX 中的 props 类似，传递给 Hook 的值在传递后变为不可变。
* [值在传递给 JSX 后是不可变的](/reference/rules/components-and-hooks-must-be-pure#values-are-immutable-after-being-passed-to-jsx) —— 不要改变已经在 JSX 中使用的值，应当在创建 JSX 之前改变。

---

## React 调用组件与 Hook 的方式 {/*react-calls-components-and-hooks*/}

[React 在必要时负责渲染组件与 Hook，以优化用户体验](/reference/rules/react-calls-components-and-hooks)。它是声明式的：只需要在组件的逻辑中告诉 React 要渲染什么，React 将找出如何最好地将其渲染给用户。

* [永远不要直接调用组件函数](/reference/rules/react-calls-components-and-hooks#never-call-component-functions-directly) —— 组件应该只在 JSX 中使用。不要将它们作为常规函数调用。
* [永远不要将 Hook 作为常规值传递](/reference/rules/react-calls-components-and-hooks#never-pass-around-hooks-as-regular-values) —— Hook 应该只在组件内部调用。永远不要将其作为常规值传递。 

---

## Hooks 规则 {/*rules-of-hooks*/}

Hook 是使用 JavaScript 函数定义的，但它们代表一种特殊类型的可重用 UI 逻辑，并且有限制可以调用它们的位置。在使用它们时，需要遵循 [Hook 规则](/reference/rules/rules-of-hooks)。

* [只在顶层调用 Hook](/reference/rules/rules-of-hooks#only-call-hooks-at-the-top-level) —— 不要在循环、条件或嵌套函数内调用 Hook。相反，应当始终在 React 函数的顶层使用 Hook，即在返回任何值之前。
* [只从 React 函数中调用 Hook](/reference/rules/rules-of-hooks#only-call-hooks-from-react-functions) —— 不要在常规的 JavaScript 函数中调用 Hook。
