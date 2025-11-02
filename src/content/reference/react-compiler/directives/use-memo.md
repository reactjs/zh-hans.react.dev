---
title: "use memo"
titleForTitleTag: "'use memo' 指令"
---

<Intro>

`"use memo"` 用于标记一个函数，以便 React 编译器对其进行优化。

</Intro>

<Note>

在大多数情况下，你并不需要使用 `"use memo"`。它主要用于 `annotation` 模式，在该模式下你必须显式地标记需要优化的函数。在 `infer` 模式下，编译器会根据命名约定（组件使用 PascalCase 命名法，Hooks 使用 use 前缀）自动检测组件和 hook。如果在 `infer` 模式下某个组件或 hook 没有被编译，你应该修正它的命名，而不是用 `"use memo"` 来强制编译。

</Note>

<InlineToc />

---

## 参考 {/*reference*/}

### `"use memo"` {/*use-memo*/}

在函数的开头添加 `"use memo"`，以此来标记该函数，使其可以被 React 编译器优化。

```js {1}
function MyComponent() {
  "use memo";
  // ...
}
```

当一个函数包含 `"use memo"` 指令时，React 编译器将在构建时对其进行分析和优化。编译器会自动对值和组件进行记忆化，以防止不必要的重计算和重渲染。

#### 注意事项 {/*caveats*/}

* `"use memo"` 必须位于函数体的最开始，在任何 import 语句或其他代码之前（注释除外）。
* 该指令必须使用双引号或单引号，而不是反引号。
* 该指令必须与 `"use memo"` 完全匹配。
* 只有一个函数中的第一个指令会被处理；其余的指令将被忽略。
* 指令的效果取决于你的 [`compilationMode`](/reference/react-compiler/compilationMode) 配置。

### `"use memo"` 如何标记函数以进行优化 {/*how-use-memo-marks*/}

在使用 React 编译器的应用中，所有函数都会在构建时被分析，以确定它们是否可以被优化。默认情况下，编译器会自动推断哪些组件需要被记忆化，但这取决于你所设置的 [`compilationMode`](/reference/react-compiler/compilationMode)。

`"use memo"` 可以显式地标记一个函数需要被优化，从而覆盖编译器的默认行为：

* 在 `annotation` 模式下：只有带 `"use memo"` 的函数才会被优化
* 在 `infer` 模式下：编译器使用启发式规则进行推断，但 `"use memo"` 会强制进行优化
* 在 `all` 模式下：所有内容默认都会被优化，这使得 `"use memo"` 成为多余的

该指令在你的代码库中为优化和非优化的代码创建了一个清晰的界限，让你能对编译过程进行精细化控制。

### 何时使用 `"use memo"` {/*when-to-use*/}

你应该在以下情况考虑使用 `"use memo"`:

#### 你使用 annotation 模式 {/*annotation-mode-use*/}
当 `compilationMode: 'annotation'` 时，任何你希望被优化的函数都必须使用该指令：

```js
// ✅ 这个组件将会被优化
function OptimizedList() {
  "use memo";
  // ...
}

// ❌ 这个组件不会被优化
function SimpleWrapper() {
  // ...
}
```

#### 你正在渐进式地引入 React 编译器 {/*gradual-adoption*/}
可以从 `annotation` 模式开始，并有选择性地优化那些稳定的组件：

```js
// 从优化叶子组件开始
function Button({ onClick, children }) {
  "use memo";
  // ...
}

// 在验证其行为后，逐步向组件树上层移动
function ButtonGroup({ buttons }) {
  "use memo";
  // ...
}
```

---

## 用法 {/*usage*/}

### 在不同编译模式下的使用 {/*compilation-modes*/}

`"use memo"` 的行为会根据你的编译器配置而改变：

```js
// babel.config.js
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compilationMode: 'annotation' // 或 'infer' 和 'all'
    }]
  ]
};
```

#### Annotation 模式 {/*annotation-mode-example*/}
```js
// ✅ 使用 "use memo" 进行优化
function ProductCard({ product }) {
  "use memo";
  // ...
}

// ❌ 未优化 (没有指令)
function ProductList({ products }) {
  // ...
}
```

#### Infer 模式（默认）{/*infer-mode-example*/}
```js
// 会被自动记忆化，因为它的命名符合组件规范
function ComplexDashboard({ data }) {
  // ...
}

// 会被跳过：因为它的命名不符合组件规范
function simpleDisplay({ text }) {
  // ...
}
```

在 `infer` 模式下，编译器会根据命名约定（组件使用 PascalCase 命名法，hook 使用 `use` 前缀）自动检测组件和 hook。如果在 `infer` 模式下某个组件或 hook 没有被编译，你应该修正它的命名，而不是用 `"use memo"` 来强制编译。

---

## 故障排除 {/*troubleshooting*/}

### 验证优化效果 {/*verifying-optimization*/}

要确认你的组件是否被成功优化，可以：

1. 检查你构建产物中被编译后的输出代码
2. 使用 React 开发工具检查组件是否带有 Memo ✨ 徽章

### 参见 {/*see-also*/}

* [`"use no memo"`](/reference/react-compiler/directives/use-no-memo) - 选择退出编译
* [`compilationMode`](/reference/react-compiler/compilationMode) - 配置编译行为
* [React 编译器](/learn/react-compiler) - 入门指南
