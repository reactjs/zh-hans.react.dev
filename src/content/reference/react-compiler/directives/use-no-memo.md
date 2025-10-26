---
title: "use no memo"
titleForTitleTag: "'use no memo' 指令"
---

<Intro>

`"use no memo"` 可以防止函数被 React 编译器优化。

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `"use no memo"` {/*use-no-memo*/}

在函数的开头添加 `"use no memo"` 可以阻止 React 编译器进行优化。

```js {1}
function MyComponent() {
  "use no memo";
  // ...
}
```

当一个函数包含 "use no memo" 时，React 编译器会在优化过程中完全跳过它。在调试或处理与编译器不兼容的代码时，这是一个很有用的脱围机制。

#### 注意事项 {/*caveats*/}

* `"use no memo"` 必须位于函数体的最开始，在任何导入或其他代码之前（注释可以）。
* 该指令必须使用双引号或单引号，而不是反引号。
* 该指令必须与 `"use no memo"` 或其别名 `"use no forget"` 完全匹配。
* 该指令的优先级高于所有编译模式和其他指令。
* 它旨在作为一种临时的调试工具，而非永久的解决方案。

### `"use no memo"` 如何选择退出优化 {/*how-use-no-memo-opts-out*/}

React 编译器会在构建时分析你的代码以应用优化。`"use no memo"` 创建了一个明确的边界，告诉编译器完全跳过一个函数。

该指令的优先级高于所有其他设置：
* 在 `all` 模式下：尽管有全局设置，该函数仍会被跳过
* 在 `infer` 模式下：即使启发式算法会优化该函数，它也仍会被跳过

编译器会像未启用 React 编译器一样对待这些函数，让它们保持原样。

### 何时使用 `"use no memo"` {/*when-to-use*/}

`"use no memo"` 应谨慎并临时使用。常见场景包括：

#### 调试编译器问题 {/*debugging-compiler*/}
当你怀疑编译器引起问题时，可以暂时禁用优化来隔离问题：

```js
function ProblematicComponent({ data }) {
  "use no memo"; // TODO: 修复 issue #123 后移除

  // 未被静态检测到的违反 React 规则的代码
  // ...
}
```

#### 第三方库集成 {/*third-party*/}
当与可能不兼容编译器的库集成时：

```js
function ThirdPartyWrapper() {
  "use no memo";

  useThirdPartyHook(); // 存在可能被编译器错误优化的副作用
  // ...
}
```

---

## 用法 {/*usage*/}

 `"use no memo"` 指令放在函数体的开头，以防止 React 编译器优化该函数：
 
```js
function MyComponent() {
  "use no memo";
  // 函数体
}
```

该指令也可以放在文件的顶部，以影响该模块中的所有函数：

```js
"use no memo";

// 此文件中的所有函数都将被编译器跳过
```

`"use no memo"` 在函数级别覆盖模块级别指令。

---

## 故障排查 {/*troubleshooting*/}

### 指令未阻止编译 {/*not-preventing*/}

如果 `"use no memo"` 不起作用：

```js
// ❌ 错误 - 指令在代码之后
function Component() {
  const data = getData();
  "use no memo"; // 太晚了！
}

// ✅ 正确 - 指令在最前面
function Component() {
  "use no memo";
  const data = getData();
}
```

同时检查：
* 拼写 - 必须是 `"use no memo"`
* 引号 - 必须使用单引号或双引号，而不是反引号

### 最佳实践 {/*best-practices*/}

**始终记录** 你禁用优化的 **原因**：

```js
// ✅ 好的 - 有清晰的解释和追踪
function DataProcessor() {
  "use no memo"; // TODO:修复违反 React 规则的问题后移除
  // ...
}

// ❌ 坏的 - 没有解释
function Mystery() {
  "use no memo";
  // ...
}
```

### 参见 {/*see-also*/}

* [`"use memo"`](/reference/react-compiler/directives/use-memo) - 选择加入编译
* [React 编译器](/learn/react-compiler) - 入门指南
