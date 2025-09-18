---
title: 配置
---

<Intro>

本页列出 React 编译器的所有可用配置项。

</Intro>

<Note>

对于大多数应用，默认选项开箱即用即可满足需求。如果你有特殊需求，你可以使用这些高级选项。

</Note>

```js
// babel.config.js
module.exports = {
  plugins: [
    [
      'babel-plugin-react-compiler', {
        // compiler options
      }
    ]
  ]
};
```

---

## 编译控制 {/*compilation-control*/}

这些选项用于控制编译器优化的 **内容**，以及它 **如何** 选择要编译的组件和 hook。

* [`compilationMode`](/reference/react-compiler/compilationMode) 控制选择要编译的函数的策略（例如：全部函数、仅带注解的函数，或自动检测）。

```js
{
  compilationMode: 'annotation' // 仅编译 “use memo” 函数
}
```

---

## 版本兼容性 {/*version-compatibility*/}

React 版本配置可确保编译器生成的代码与你的 React 版本兼容。

[`target`](/reference/react-compiler/target) 指定你正在使用的 React 版本（17、18 或 19）。

```js
// 对于 React 18 项目
{
  target: '18' // 还需要 react-compiler-runtime 包
}
```

---

## 错误处理 {/*error-handling*/}

这些选项控制编译器如何处理不遵循 [React 规则](/reference/rules) 的代码。

[`panicThreshold`](/reference/react-compiler/panicThreshold) 决定是让构建失败还是跳过存在问题的组件。

```js
// 推荐用于生产环境
{
  panicThreshold: 'none' // 跳过有错误的组件，而不是导致构建失败
}
```

---

## 调试 {/*debugging*/}

日志和分析选项有助于你理解编译器在做什么。

[`logger`](/reference/react-compiler/logger) 为编译事件提供自定义日志功能。

```js
{
  logger: {
    logEvent(filename, event) {
      if (event.kind === 'CompileSuccess') {
        console.log('Compiled:', filename);
      }
    }
  }
}
```

---

## Feature Flags {/*feature-flags*/}

条件式编译使你控制何时使用优化后的代码。

[`gating`](/reference/react-compiler/gating) 启用运行环境 feature flags，用于 A/B 测试或渐进式发布。

```js
{
  gating: {
    source: 'my-feature-flags',
    importSpecifierName: 'isCompilerEnabled'
  }
}
```

---

## 常见配置模式 {/*common-patterns*/}

### 默认配置 {/*default-configuration*/}

对于大多数 React 19 应用，编译器无需配置即可工作：

```js
// babel.config.js
module.exports = {
  plugins: [
    'babel-plugin-react-compiler'
  ]
};
```

### React 17/18 项目 {/*react-17-18*/}

较旧的 React 版本需要安装运行环境包并设置 target：

```bash
npm install react-compiler-runtime@rc
```

```js
{
  target: '18' // or '17'
}
```

### 渐进式接入 {/*incremental-adoption*/}

从特定目录开始并逐步扩大范围：

```js
{
  compilationMode: 'annotation' 仅编译 “use memo” 函数
}
```

