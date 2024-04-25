---
title: React 调用组件和 Hook
---

<Intro>
React 负责在必要时渲染组件和 Hook，以优化用户体验。它是声明式的：你只需要告诉 React 在你的组件逻辑中渲染什么，React 会找出向用户展示的最佳方式。
</Intro>

<InlineToc />

---

## 绝不要直接调用组件函数 {/*never-call-component-functions-directly*/}
组件应该只在 JSX 中使用。不要将它们作为常规函数调用。React 应该来调用它们。

React 必须决定何时调用你的组件函数 [在渲染过程中](/reference/rules/components-and-hooks-must-be-pure#how-does-react-run-your-code)。在 React 中，你通过 JSX 来实现这一点。

```js {2}
function BlogPost() {
  return <Layout><Article /></Layout>; // ✅ Good: Only use components in JSX
}
```

```js {2}
function BlogPost() {
  return <Layout>{Article()}</Layout>; // 🔴 Bad: Never call them directly
}
```

如果组件包含 Hook，在循环或条件语句中直接调用组件时，很容易违反 [Hook 的规则](/reference/rules/rules-of-hooks)。

让 React 来协调渲染还允许许多好处：

* **组件不仅仅是函数**。 React 可以通过 Hook 向它们添加特性，如与组件在树中身份相关联的局部状态。
* **组件类型参与协调**。通过让 React 调用你的组件，你也告诉它更多关于你的树的概念结构。例如，当你从渲染 `<Feed>` 转移到 `<Profile>` 页面时，React不会尝试重用它们。
* **React 可以提升你的用户体验**。 例如，它可以允许浏览器在组件调用之间做一些工作，这样重新渲染大型组件树就不会阻塞主线程。
* **更好的调试体验**。 如果组件在库中被视为“一等公民”，我们可以围绕这些组件构建丰富的开发者工具，以便在开发过程中进行检查和理解程序内部结构和状态的过程。
* **更高效的协调**。 React 可以决定树中哪些组件需要重新渲染，并跳过不需要的组件。这使你的应用程序更快，更灵敏。

---

## 绝不要像常规值一样传递 Hook {/*never-pass-around-hooks-as-regular-values*/}

Hook 只能在组件或 Hook 内部调用。永远不要像常规值一样传递它们。

Hook 允许你用 React 特性增强组件。它们应该始终作为函数调用，永远不要作为常规值传递。这使得局部推理成为可能，或者开发者可以通过单独查看组件来理解组件可以做的所有事情的能力。

违反这条规则将导致 React 无法自动优化你的组件。

### 不要动态地修改 Hook {/*dont-dynamically-mutate-a-hook*/}

Hook 应该尽可能地“静态”。这意味着你不应该动态地修改它们。例如，这意味着你不应该编写高阶 Hook：

```js {2}
function ChatInput() {
  const useDataWithLogging = withLogging(useData); // 🔴 Bad: don't write higher order hooks
  const data = useDataWithLogging();
}
```

Hook 应该是不可变的，不应该被修改。与其动态地修改 Hook，不如创建一个具有所需功能的静态版本的 Hook。

```js {2,6}
function ChatInput() {
  const data = useDataWithLogging(); // ✅ Good: Create a new version of the hook
}

function useDataWithLogging() {
  // ... Create a new version of the Hook and inline the logic here
}
```

### 不要动态地使用 Hook {/*dont-dynamically-use-hooks*/}

Hook 也不应该被动态使用：例如，不要通过将 Hook 作为值传递来进行组件的依赖注入：

```js {2}
function ChatInput() {
  return <Button useData={useDataWithLogging} /> // 🔴 Bad: don't pass hooks as props
}
```

你应该始终将 Hook 的调用内联到那个组件中，并在那里处理任何逻辑。

```js {6}
function ChatInput() {
  return <Button />
}

function Button() {
  const data = useDataWithLogging(); // ✅ Good: Use the hook directly
}

function useDataWithLogging() {
  // If there's any conditional logic to change the hook's behavior, it should be inlined into
  // the hook
}
```

这样，`<Button />` 更容易理解并调试。当 Hook 以动态方式使用时，它大大增加了你的应用程序的复杂性，并抑制了局部推理，这从长远来看使你的团队生产力降低。它还更容易意外地违反 [Hook 的规则](/reference/rules/rules-of-hooks)，即 Hook 不应该被条件性地调用。如果你发现自己需要为测试模拟组件，最好是模拟服务器以响应罐装数据。如果可能，通常进行端到端测试你的应用程序也是更有效的。

