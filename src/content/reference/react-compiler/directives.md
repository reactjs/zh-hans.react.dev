---
title: 指令
---

<Intro>
React 编译器指令是特殊的字符串文字，用于控制特定函数是否被编译。
</Intro>

```js
function MyComponent() {
  "use memo"; // 选择让该组件加入编译
  return <div>{/* ... */}</div>;
}
```

<InlineToc />

---

## 概览 {/*overview*/}

React 编译器指令让你能够精细化地控制哪些函数由编译器进行优化。它们是放置在函数体开头或模块顶部的字符串文字。

### 可用的指令 {/*available-directives*/}

* **[`"use memo"`](/reference/react-compiler/directives/use-memo)** - 让一个函数选择加入编译
* **[`"use no memo"`](/reference/react-compiler/directives/use-no-memo)** - 让一个函数选择退出编译
  
### 快速比较 {/*quick-comparison*/}

| 指令 | 目的 | 使用场景 |
|-----------|---------|-------------|
| [`"use memo"`](/reference/react-compiler/directives/use-memo) | 强制编译 | 当使用 `annotation` 模式时，或需要覆盖 `infer` 模式的推断逻辑时 |
| [`"use no memo"`](/reference/react-compiler/directives/use-no-memo) | 阻止编译 | 调试问题或处理不兼容的代码时 |

---

## 用法 {/*usage*/}

### 函数级别的指令 {/*function-level*/}

将指令放置在函数体的最开始，以控制该函数的编译行为：

```js
// 选择加入编译
function OptimizedComponent() {
  "use memo";
  return <div>这个组件将被优化</div>;
}

// 选择退出编译
function UnoptimizedComponent() {
  "use no memo";
  return <div>这个组件不会被优化</div>;
}
```

### 模块级别的指令 {/*module-level*/}

将指令放置在文件的顶部，以影响该模块中的所有函数：

```js
// 在文件的最顶部
"use memo";

// 该文件中的所有函数都将被编译
function Component1() {
  return <div>已编译</div>;
}

function Component2() {
  return <div>同样已编译</div>;
}

// 可以在函数级别被覆盖
function Component3() {
  "use no memo"; // 这会覆盖模块指令
  return <div>未编译</div>;
}
```

### 与编译模式的交互 {/*compilation-modes*/}

指令的行为因你的 [`compilationMode`](/reference/react-compiler/compilationMode) 配置而异：

* **`annotation` 模式**: 仅有带 `"use memo"` 的函数会被编译
* **`infer` 模式**: 编译器自行决定编译哪些内容，指令可以覆盖编译器的决定
* **`all` 模式**: 所有内容都会被编译，`"use no memo"` 可以用来排除特定的函数

---

## 最佳实践 {/*best-practices*/}

### 谨慎使用指令 {/*use-sparingly*/}

指令是一种脱围机制 (escape hatch)。应优先考虑在项目级别进行编译器配置：

```js
// ✅ Good - 项目的全局配置
{
  plugins: [
    ['babel-plugin-react-compiler', {
      compilationMode: 'infer'
    }]
  ]
}

// ⚠️ 仅在必要时使用指令
function SpecialCase() {
  "use no memo"; // 务必注释说明为何需要这样做
  // ...
}
```

### 为指令的使用添加文档说明 {/*document-usage*/}

务必解释为何要使用某个指令：

```js
// ✅ 推荐 - 清晰的解释
function DataGrid() {
  "use no memo"; // TODO:修复动态行高问题后移除 (JIRA-123)
  // 复杂的表格实现
}

// ❌ 不推荐 - 没有解释
function Mystery() {
  "use no memo";
  // ...
}
```

### 为移除指令制定计划 {/*plan-removal*/}

选择退出编译的指令应该是临时性的：

1. 添加指令，并附上 TODO 注释
2. 创建一个跟踪此问题的事项
3. 修复底层的问题
4. 移除该指令

```js
function TemporaryWorkaround() {
  "use no memo"; // TODO: 待 ThirdPartyLib 升级到 v2.0 后移除
  return <ThirdPartyComponent />;
}
```

---

## 常见模式 {/*common-patterns*/}

### 渐进式引入 {/*gradual-adoption*/}

在大型代码库中引入 React 编译器时：

```js
// 从 annotation 模式开始
{
  compilationMode: 'annotation'
}

// 将稳定的组件加入编译
function StableComponent() {
  "use memo";
  // 经过充分测试的组件
}

// 后续可以切换到 infer 模式，并将有问题的组件排除掉
function ProblematicComponent() {
  "use no memo"; // 在移除此指令前先修复相关问题
  // ...
}
```


---

## 故障排除 {/*troubleshooting*/}

关于指令的具体问题，请参阅以下页面的问题排查部分：

* [`"use memo"` 问题排查](/reference/react-compiler/directives/use-memo#troubleshooting)
* [`"use no memo"` 问题排查](/reference/react-compiler/directives/use-no-memo#troubleshooting)

### 常见问题 {/*common-issues*/}

1. **指令被忽略**: 检查指令的位置（必须在最前面）和拼写
2. **代码仍然被编译**: 检查 `ignoreUseNoForget` 配置项
3. **模块级指令不生效**: 确保它在所有 `import` 语句之前

---

## 另请参阅 {/*see-also*/}

* [`compilationMode`](/reference/react-compiler/compilationMode) - 配置编译器如何选择要优化的内容
* [`Configuration`](/reference/react-compiler/configuration) - 完整的编译器配置选项
* [React 编译器文档](https://react.dev/learn/react-compiler) - 入门指南
