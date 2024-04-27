---
title: React 调用组件和 Hook
---

<Intro>
React 负责在必要时渲染组件和 Hook，以优化用户体验。它是声明式的，你只需要告诉 React 在你的组件逻辑中渲染什么，React 会决定最佳的渲染方式以展示给用户。
</Intro>

<InlineToc />

---

## 绝不要直接调用组件函数 {/*never-call-component-functions-directly*/}
组件应该仅在 JSX 中被使用。不要将它们作为普通函数调用。应该由 React 来调用它们。

React 必须决定 [在渲染过程中](/reference/rules/components-and-hooks-must-be-pure#how-does-react-run-your-code) 何时调用你的组件函数。在 React 中，你可以通过 JSX 来实现这一点。

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

如果组件包含 Hook，在循环或条件语句中直接调用它们时，很容易违反 [Hook 的规则](/reference/rules/rules-of-hooks)。

让 React 来协调渲染还有许多好处：

* **组件不仅仅是函数**。 React 可以通过 Hook 向它们添加特性，如与组件在树中身份相关联的局部状态。
* **组件类型参与协调**。通过让 React 来调用你的组件，你也向它展示了你的组件树的结构。例如，当你从渲染 `<Feed>` 转移到 `<Profile>` 页面时，React不会尝试重用它们。
* **React 可以提升你的用户体验**。 例如，它可以在组件调用期间中断，允许浏览器执行一些工作，这样重新渲染大型组件树就不会阻塞主线程。
* **更好的调试体验**。 如果组件在库中被视为“一等公民”，我们可以围绕这些组件构建丰富的开发者工具，以便在开发过程中进行检查和理解程序内部结构和状态。
* **更高效的协调**。 React 可以决定树中哪些组件需要重新渲染，并跳过那些无需重新渲染的组件。使得你的应用程序运行更快，响应更敏捷。

---

## 绝不要像传递常规值一样传递 Hook。 {/*never-pass-around-hooks-as-regular-values*/}

Hook 只能在组件或 Hook 内部调用。永远不要像常规值一样传递它们。

Hook 允许你使用 React 功能来增强组件。它们应该始终作为函数来调用，而绝不能作为常规值传递。这使得局部推理成为可能，即开发者可以通过单独审视一个组件，就能理解该组件所能执行的所有操作。

违反此规则将导致 React 无法自动优化你的组件。

### 不要在运行时动态修改 Hook {/*dont-dynamically-mutate-a-hook*/}

Hook 应当尽可能保持“静态”。这意味着你不应该动态地改变它们。这意味着你不应该编写高阶 Hook。

```js {2}
function ChatInput() {
  const useDataWithLogging = withLogging(useData); // 🔴 Bad: don't write higher order Hooks
  const data = useDataWithLogging();
}
```

Hook 应该是不可变的，不应被动态改变。与其动态地改变 Hook，不如在创建时就定义一个包含所需功能的静态版本的 Hook。

```js {2,6}
function ChatInput() {
  const data = useDataWithLogging(); // ✅ Good: Create a new version of the Hook
}

function useDataWithLogging() {
  // ... Create a new version of the Hook and inline the logic here
}
```

### 不要动态地使用 Hook {/*dont-dynamically-use-hooks*/}

Hook 也不应该被动态使用，例如，不应该通过将 Hook 作为值传递来在一个组件中实现依赖注入。

```js {2}
function ChatInput() {
  return <Button useData={useDataWithLogging} /> // 🔴 Bad: don't pass Hooks as props
}
```

你应该始终将 Hook 的调用内联到组件内部，并在其中处理所有逻辑。

```js {6}
function ChatInput() {
  return <Button />
}

function Button() {
  const data = useDataWithLogging(); // ✅ Good: Use the Hook directly
}

function useDataWithLogging() {
  // If there's any conditional logic to change the Hook's behavior, it should be inlined into
  // the Hook
}
```

这样，`<Button />` 组件更容易理解也更易于调试。当 Hook 以动态方式使用时，会大大增加应用的复杂性，并妨碍局部推理，这从长远来看会降低团队的生产力。它还更容易意外地违反 [Hook 的规则](/reference/rules/rules-of-hooks)，即 Hook 不应该被条件性地调用。如果你发现自己需要为测试而模拟组件，最好是模拟服务器返回以响应预设数据。如果可能，通常进行端到端测试你的应用是更有效的方法。

