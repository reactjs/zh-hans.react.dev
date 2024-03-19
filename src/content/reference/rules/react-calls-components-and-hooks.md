---
title: React 调用组件与 Hook
---

<Intro>
React 负责在必要时渲染组件与 Hook 以优化用户体验。它是声明式的：只需要在组件逻辑中告诉 React 要渲染什么，React 会找出如何最好地将其渲染给用户。
</Intro>

<InlineToc />

---

## 永远不要直接调用组件函数 {/*never-call-component-functions-directly*/}
组件应该以 JSX 的形式使用。不要像调用常规函数那样调用它们。React 应该调用它。

在 React 中，必须决定 [在渲染期间](/reference/rules/components-and-hooks-must-be-pure#how-does-react-run-your-code) 何时调用组件函数。在 React 中，可以使用 JSX 来实现这一点。

```js {2}
function BlogPost() {
  return <Layout><Article /></Layout>; // ✅ 正确：以 JSX 的形式使用组件
}
```

```js {2}
function BlogPost() {
  return <Layout>{Article()}</Layout>; // 🔴 错误：不要直接调用组件函数
}
```

如果一个组件包含 Hook，直接在循环或条件语句中调用组件时很容易违反 [Hook 规则](/reference/rules/rules-of-hooks)。

让 React 协调渲染还可以带来许多好处：

* **组件变得不仅仅是函数**。React 可以通过与组件在树中的标识相关联的钩子来增强它们的功能，例如本地状态。
* **组件类型参与协调**。通过让 React 调用组件，可以告诉它更多关于树的概念结构的信息。例如，当从渲染 `<Feed>` 转到 `<Profile>` 页面时，React 不会尝试重用它们。
* **React 可以增强用户体验**。例如，它可以让浏览器在组件调用之间做一些工作，以便重新渲染大型组件树不会阻塞主线程。
* **更好的调试体验**。如果组件是库意识到的一流公民，我们可以为开发构建丰富的内省工具。
* **更高效的协调**。React 可以精确地决定树中哪些组件需要重新渲染，并跳过不需要重新渲染的组件。这使应用程序更快速，更敏捷。

---

## 不要将 Hook 作为常规值传递 {/*never-pass-around-hooks-as-regular-values*/}

Hook 应该只在组件或 Hook 内部调用。永远不要将其作为常规值传递。

Hook 允许使用 React 功能增强的组件。它们应该始终被调用为函数，永远不要作为常规值传递。这使得局部推理成为可能，即开发人员通过查看单独的组件就能理解组件的所有功能。

违反此规则将导致 React 不会自动优化组件。

### 不要动态修改 Hook {/*dont-dynamically-mutate-a-hook*/}

Hook 应该尽可能地保持“静态”。这意味着不应该动态地修改它们。例如，这意味着不应该编写高阶 Hook：

```js {2}
function ChatInput() {
  const useDataWithLogging = withLogging(useData); // 🔴 错误：不应编写高阶 Hook
  const data = useDataWithLogging();
}
```

Hook 应该是不可变的，不应该被改变。不要动态地修改钩子，而是创建一个具有所需功能的静态版本的 Hook。

```js {2,6}
function ChatInput() {
  const data = useDataWithLogging(); // ✅ 正确：创建 Hook 的新版本
}

function useDataWithLogging() {
  // ……创建 Hook 的新版本并于此处编写逻辑
}
```

### 不要动态使用 Hook {/*dont-dynamically-use-hooks*/}

Hook 不应该被动态使用：例如，不要通过将 Hook 作为值传递来在组件中进行依赖注入：

```js {2}
function ChatInput() {
  return <Button useData={useDataWithLogging} /> // 🔴 错误：不要将 Hook 作为 props
}
```

应该始终将 Hook 的调用内联到该组件中，并在其中处理任何逻辑。

```js {6}
function ChatInput() {
  return <Button />
}

function Button() {
  const data = useDataWithLogging(); // ✅ 正确：直接使用 Hook
}

function useDataWithLogging() {
  // 如果有任何条件逻辑改变 Hook 的行为，它应该内联至
  // Hook 中
}
```

这样，`<Button />` 组件就更容易理解和调试了。当 Hook 以动态方式使用时，会大大增加应用程序的复杂性，阻碍局部推理，从长远来看，会降低团队的生产力。它还使得更容易意外地违反 [Hook 规则](/reference/rules/rules-of-hooks)，即 Hook 不应该被条件地调用。如果发现自己需要为测试模拟组件，最好是模拟服务器以响应预先准备的数据。如果可能的话，使用端到端测试来测试应用程序通常也更有效。

