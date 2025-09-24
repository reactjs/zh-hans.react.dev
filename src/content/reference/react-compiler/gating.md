---
title: gating
---

<Intro>

`gating` 选项启用条件编译，允许你控制是否在运行时使用优化代码

</Intro>

```js
{
  gating: {
    source: 'my-feature-flags',
    importSpecifierName: 'shouldUseCompiler'
  }
}
```

<InlineToc />

---

## Reference {/*reference*/}

### `gating` {/*gating*/}

为已编译函数配置运行时特性开关的 gating。

#### Type {/*type*/}

```
{
  source: string;
  importSpecifierName: string;
} | null
```

#### 默认值 {/*default-value*/}

`null`

#### Properties {/*properties*/}

- **`source`**：用于导入特性开关的模块路径
- **`importSpecifierName`**：要导入的已导出函数的名字

#### 注意事项 {/*caveats*/}

- gating 函数必须返回布尔值
- 同时包含编译版本与原始版本会增加包大小
- 所有包含已编译函数的文件都会被添加该导入

---

## 用法 {/*usage*/}

### 基础特性开关设置 {/*basic-setup*/}

1. 创建一个特性开关模块：

```js
// src/utils/feature-flags.js
export function shouldUseCompiler() {
  // your logic here
  return getFeatureFlag('react-compiler-enabled');
}
```

2. 配置编译器：

```js
{
  gating: {
    source: './src/utils/feature-flags',
    importSpecifierName: 'shouldUseCompiler'
  }
}
```

3.  编译器将生成 gated 代码：

```js
// 输入
function Button(props) {
  return <button>{props.label}</button>;
}

// 输出（简化）
import { shouldUseCompiler } from './src/utils/feature-flags';

const Button = shouldUseCompiler()
  ? function Button_optimized(props) { /* compiled version */ }
  : function Button_original(props) { /* original version */ };
```

注意，gating 函数在模块加载时只会执行一次，因此一旦 JS 包被解析并执行，组件的选择将在本次浏览器会话的剩余时间内保持不变。

---

## 故障排除 {/*troubleshooting*/}

### 特性开关不起作用 {/*flag-not-working*/}

确认你的开关模块导出了正确的函数：

```js
// ❌ 错误：默认导出
export default function shouldUseCompiler() {
  return true;
}

// ✅ 正确：命名匹配的导出 importSpecifierName
export function shouldUseCompiler() {
  return true;
}
```

### 导入错误 {/*import-errors*/}

确保 source 路径正确：

```js
// ❌ 错误：相对于 babel.config.js
{
  source: './src/flags',
  importSpecifierName: 'flag'
}

// ✅ 正确：模块解析路径
{
  source: '@myapp/feature-flags',
  importSpecifierName: 'flag'
}

// ✅ 同样正确：项目根目录的绝对路径
{
  source: './src/utils/flags',
  importSpecifierName: 'flag'
}
```
