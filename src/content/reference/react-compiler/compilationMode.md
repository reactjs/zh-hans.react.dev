---
title: compilationMode
---

<Intro>

`compilationMode` 选项控制 React 编译器如何选择要编译的函数。

</Intro>

```js
{
  compilationMode: 'infer' // 或 'annotation'、'syntax' 和 'all'
}
```

<InlineToc />

---

## 参考 {/*reference*/}

### `compilationMode` {/*compilationmode*/}

控制用于确定 React 编译器将优化哪些函数的策略。

#### 类型 {/*type*/}

```
'infer' | 'syntax' | 'annotation' | 'all'
```

#### 默认值 {/*default-value*/}

`'infer'`

#### 选项 {/*options*/}

- **`'infer'`**（默认值）：编译器使用智能的启发式方法来识别 React 组件和 Hook：
  - 明确使用 `"use memo"` 指令注释的函数 
  - 命名类似组件（PascalCase）或 Hook（`use` 前缀）并且创建了 JSX 和/或调用了其他 Hook 的函数

- **`'annotation'`**：仅编译使用 `"use memo"` 指示符明确标记的函数。是增量采用的理想选择。

- **`'syntax'`**：仅编译使用 Flow 的 [component](https://flow.org/en/docs/react/component-syntax/) 和 [hook](https://flow.org/en/docs/react/hook-syntax/) 语法的组件和 Hook。

- **`'all'`**：编译所有顶层函数。不推荐，因为它可能会编译非 React 函数。

#### 注意事项 {/*caveats*/}

- `'infer'`  模式要求函数遵循 React 的命名约定才能被检测到
- 使用 `'all'` 模式可能会因编译工具函数而对性能产生负面影响
- `'syntax'` 模式需要 Flow，无法与 TypeScript 一起使用
- 无论在哪种模式下，带有 `"use no memo"` 指令的函数总会被跳过

---

## 用法 {/*usage*/}

### 默认推断模式 {/*default-inference-mode*/}

默认的 `'infer'` 模式适用于大多数遵循 React 约定的代码库：

```js
{
  compilationMode: 'infer'
}
```

在此模式下，以下函数将被编译：

```js
// ✅ 已编译：命名类似组件 + 返回 JSX
function Button(props) {
  return <button>{props.label}</button>;
}

// ✅ 已编译：命名类似 Hook + 调用 Hook
function useCounter() {
  const [count, setCount] = useState(0);
  return [count, setCount];
}

// ✅ 已编译：显式指令
function expensiveCalculation(data) {
  "use memo";
  return data.reduce(/* ... */);
}

// ❌ 未编译：不是组件/Hook 模式
function calculateTotal(items) {
  return items.reduce((a, b) => a + b, 0);
}
```

### 使用注解模式进行增量采用 {/*incremental-adoption*/}

为了逐步迁移，可以使用 `'annotation'` 模式，仅编译被标记的函数：

```js
{
  compilationMode: 'annotation'
}
```

然后显式地标记要编译的函数：

```js
// 只有这个函数会被编译
function ExpensiveList(props) {
  "use memo";
  return (
    <ul>
      {props.items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}

// 如果没有指令，这个函数将不会被编译
function NormalComponent(props) {
  return <div>{props.content}</div>;
}
```

### 使用 Flow 语法模式 {/*flow-syntax-mode*/}

如果你的代码库使用 Flow 而不是 TypeScript：

```js
{
  compilationMode: 'syntax'
}
```

然后使用 Flow 的组件语法：

```js
// 已编译：Flow 组件语法
component Button(label: string) {
  return <button>{label}</button>;
}

// 已编译：Flow hook 语法
hook useCounter(initial: number) {
  const [count, setCount] = useState(initial);
  return [count, setCount];
}

// 未编译：常规函数语法
function helper(data) {
  return process(data);
}
```

### 选择性地跳过特定函数 {/*opting-out*/}

无论编译模式如何，都可以使用 `"use no memo"` 来跳过编译：

```js
function ComponentWithSideEffects() {
  "use no memo"; // 阻止编译

  // 这个组件有不应被 memoize 的副作用
  logToAnalytics('component_rendered');

  return <div>Content</div>;
}
```

---

## 故障排除 {/*troubleshooting*/}

### 在 infer 模式下组件未被编译 {/*component-not-compiled-infer*/}

在 `'infer'` 模式下，请确保你的组件遵循 React 的约定：

```js
// ❌ 不会编译：小写名称
function button(props) {
  return <button>{props.label}</button>;
}

// ✅ 将会编译：PascalCase 名称
function Button(props) {
  return <button>{props.label}</button>;
}

// ❌ 不会编译：未创建 JSX 或调用 Hook
function useData() {
  return window.localStorage.getItem('data');
}

// ✅ 将会编译：调用了一个 Hook
function useData() {
  const [data] = useState(() => window.localStorage.getItem('data'));
  return data;
}
```
