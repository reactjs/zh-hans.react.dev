---
title: 编译库
---

<Intro>
本指南旨在帮助库作者理解如何使用 React 编译器来为用户提供经过优化的库代码。  
</Intro>

<InlineToc />

## 为什么要发布编译后的代码？{/*why-ship-compiled-code*/}

作为库作者，你可以在将代码发布到 npm 之前编译。这样做有几个好处：

- **为所有用户提升性能** —— 即使用户尚未使用 React 编译器，他们也能从你的库中获得优化后的代码。
- **用户无需配置** —— 这些优化开箱即用
- **行为一致** —— 无论用户的构建设置如何，他们都能获得相同版本的优化代码

## 设置编译 {/*setting-up-compilation*/}

将 React 编译器添加到你的库的构建过程中：

<TerminalBlock>
npm install -D babel-plugin-react-compiler@latest
</TerminalBlock>

配置你的构建工具来编译你的库。例如，使用 Babel：

```js
// babel.config.js
module.exports = {
  plugins: [
    'babel-plugin-react-compiler',
  ],
  // ... 其他配置
};
```

## 向下兼容性 {/*backwards-compatibility*/}

如果你的库需要支持 React 19 以下的版本，你需要进行额外的配置：

### 1. 安装运行时包 {/*install-runtime-package*/}

我们推荐将 react-compiler-runtime 作为直接依赖安装：

<TerminalBlock>
npm install react-compiler-runtime@latest
</TerminalBlock>

```json
{
  "dependencies": {
    "react-compiler-runtime": "^1.0.0"
  },
  "peerDependencies": {
    "react": "^17.0.0 || ^18.0.0 || ^19.0.0"
  }
}
```

### 2. 配置目标版本 {/*configure-target-version*/}

设置你的库所支持的最低 React 版本：

```js
{
  target: '17', // 最低支持的 React 版本 
}
```

## 测试策略 {/*testing-strategy*/}

为了确保兼容性，你应该对编译和未编译两种情况下的库都进行测试。在编译后的代码上运行你现有的测试套件，并创建一个绕过编译器的独立测试配置。这有助于捕获任何可能由编译过程引起的问题，并确保你的库在所有场景下都能正常工作

## 故障排除 {/*troubleshooting*/}

### 库在旧版 React 中无法工作 {/*library-doesnt-work-with-older-react-versions*/}

如果你编译后的库在 React 17 或 18 中抛出错误：

1. 确认你已将 `react-compiler-runtime` 安装为生产依赖
2. 检查你的 `target` 配置是否与你支持的最低 React 版本匹配
3. 确保运行时包已包含在你最终发布的打包中

### 编译过程与其他 Babel 插件冲突 {/*compilation-conflicts-with-other-babel-plugins*/}

某些 Babel 插件可能与 React 编译器存在冲突：

1. 将 `babel-plugin-react-compiler` 放在插件列表的靠前位置
2. 在其他插件中禁用可能引起冲突的优化选项
3. 对你的构建输出进行彻底的测试

### 找不到运行时模块 {/*runtime-module-not-found*/}

如果用户遇到 “Cannot find module 'react-compiler-runtime'” 错误:

1. 确保该运行时包被列在 `dependencies` 中，而不是 `devDependencies`
2. 检查你的打包工具是否将该运行时包含在了输出中
3. 确认这个包已经和你的库一起成功发布到了 npm

## Next Steps {/*next-steps*/}

- 学习针对已编译代码的 [调试技巧](/learn/react-compiler/debugging)
- 查看 [配置选项](/reference/react-compiler/configuration) 以了解所有编译器选项
- 探索用于选择性优化的 [编译模式](/reference/react-compiler/compilationMode)
