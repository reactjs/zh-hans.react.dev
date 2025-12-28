---
title: config
---

<Intro>

验证编译器 [配置选项](/reference/react-compiler/configuration)。

</Intro>

## 规则详情 {/*rule-details*/}

React 编译器接受各种 [配置选项](/reference/react-compiler/configuration) 来控制其行为。此规则验证你的配置使用了正确的选项名称和值类型，防止因拼写错误或错误设置而导致的静默失败。

### 无效的 {/*invalid*/}

此规则的错误代码示例：

```js
// ❌ 未知的选项名称
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compileMode: 'all' // 拼写错误：应该是 compilationMode
    }]
  ]
};

// ❌ 无效的选项值
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compilationMode: 'everything' // 无效：使用 'all' 或 'infer'
    }]
  ]
};
```

### 有效的 {/*valid*/}

此规则的正确代码示例：

```js
// ✅ 有效的编译器配置
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compilationMode: 'infer',
      panicThreshold: 'critical_errors'
    }]
  ]
};
```

## 故障排除 {/*troubleshooting*/}

### 配置未按预期工作 {/*config-not-working*/}

你的编译器配置可能有拼写错误或错误的值：

```js
// ❌ 错误：常见的配置错误
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      // 选项名称拼写错误
      compilationMod: 'all',
      // 错误的值类型
      panicThreshold: true,
      // 未知选项
      optimizationLevel: 'max'
    }]
  ]
};
```

查看 [配置文档](/reference/react-compiler/configuration) 了解有效选项：

```js
// ✅ 更好：有效的配置
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compilationMode: 'all', // 或 'infer'
      panicThreshold: 'none', // 或 'critical_errors'、'all_errors'
      // 只使用文档中记录的选项
    }]
  ]
};
```
