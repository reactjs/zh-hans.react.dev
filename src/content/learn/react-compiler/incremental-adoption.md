---
title: 逐步使用
---

<Intro>
React Compiler 可以逐步采用，允许你首先在代码库的特定部分尝试使用。本指南将向你展示如何在现有项目中逐步推广该编译器的使用。
</Intro>

<YouWillLearn>

* 为何推荐增量式采用
* 使用 Babel 覆写进行基于目录的采用
* 使用 "use memo" 指令进行选择性编译
* 使用 "use no memo" 指令排除组件
* 带有 gating 的运行时特性标志
* 监控你的采用进度

</YouWillLearn>

## 为何采用渐进式迁移？ {/*why-incremental-adoption*/}

React Compiler 的设计目的是自动优化你的整个代码库，但你不必一次性全部采用。渐进式采用让你能够控制推行过程，在扩展到其余部分之前，先在应用程序的小部分上测试编译器。

从小处着手有助于建立对编译器优化的信心。你可以验证应用在编译代码下的行为是否正确，测量性能提升，并识别代码库中的任何特定边缘情况。这种方法对于稳定性至关重要的生产应用程序尤其有价值。

渐进式采用还使得更容易处理编译器可能发现的任何违反 React 规则的问题。你可以在扩展编译器覆盖范围的同时有条不紊地解决这些问题，而不是一次性修复整个代码库中的违规问题。这使迁移过程更易于管理，并降低了引入错误的风险。

通过控制代码中哪些部分被编译，你还可以运行 A/B 测试以衡量编译器优化在实际应用中的效果。这些数据有助于你做出是否全面采用的明智决策，并向团队展示其价值。

## 渐进式采用的方法 {/*approaches-to-incremental-adoption*/}

有三种主要方法可以逐步采用 React 编译器：

1. **覆盖 Babel** - 将编译器应用于特定目录  
2. **通过 "use memo" 选择加入** - 仅编译明确选择加入的组件  
3. **运行时控制** - 通过功能标志控制编译  

所有方法都允许你在完全上线之前，在应用程序的特定部分上测试该编译器。

## 基于目录的采用与 Babel 覆盖 {/*directory-based-adoption*/}

Babel 的 `overrides` 选项允许你将不同的插件应用于代码库的不同部分。这对于逐步在各个目录中采用 React 编译器非常理想。

### 基本配置 {/*basic-configuration*/}

首先将编译器应用到特定目录：

```js
// babel.config.js
module.exports = {
  plugins: [
    // Global plugins that apply to all files
  ],
  overrides: [
    {
      test: './src/modern/**/*.{js,jsx,ts,tsx}',
      plugins: [
        'babel-plugin-react-compiler'
      ]
    }
  ]
};
```

### 扩展覆盖范围 {/*expanding-coverage*/}

随着你信心的增加，添加更多目录：

```js
// babel.config.js
module.exports = {
  plugins: [
    // Global plugins
  ],
  overrides: [
    {
      test: ['./src/modern/**/*.{js,jsx,ts,tsx}', './src/features/**/*.{js,jsx,ts,tsx}'],
      plugins: [
        'babel-plugin-react-compiler'
      ]
    },
    {
      test: './src/legacy/**/*.{js,jsx,ts,tsx}',
      plugins: [
        // Different plugins for legacy code
      ]
    }
  ]
};
```

### 使用配置编译器选项 {/*with-compiler-options*/}

你还可以使用重写来配置编译器选项：

```js
// babel.config.js
module.exports = {
  plugins: [],
  overrides: [
    {
      test: './src/experimental/**/*.{js,jsx,ts,tsx}',
      plugins: [
        ['babel-plugin-react-compiler', {
          // options ...
        }]
      ]
    },
    {
      test: './src/production/**/*.{js,jsx,ts,tsx}',
      plugins: [
        ['babel-plugin-react-compiler', {
          // options ...
        }]
      ]
    }
  ]
};
```


## 使用 "use memo" 的选择加入模式 {/*opt-in-mode-with-use-memo*/}

如需最大程度的控制，你可以使用 `compilationMode: 'annotation'`，仅编译那些通过 `"use memo"` 指令显式选择加入的组件和 Hook。

<Note>
这种方法可以让你对各个组件和挂钩进行细粒度的控制。当你希望在不影响整个目录的情况下，针对特定组件测试编译器时，这种方法非常有用。
</Note>

### 选择加入模式配置 {/*annotation-mode-configuration*/}

```js
// babel.config.js
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compilationMode: 'annotation',
    }],
  ],
};
```

### 选择加入指令 {/*using-the-directive*/}

在要编译的函数开头添加 `"use memo"`：

```js
function TodoList({ todos }) {
  "use memo"; // Opt this component into compilation

  const sortedTodos = todos.slice().sort();

  return (
    <ul>
      {sortedTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}

function useSortedData(data) {
  "use memo"; // Opt this hook into compilation

  return data.slice().sort();
}
```

使用 `compilationMode: 'annotation'` 时，你必须：
- 在每个需要优化的组件中添加 `"use memo"`
- 在每个自定义 Hook 中添加 `"use memo"`
- 记得在新组件中也添加它

这可以在你评估编译器影响的同时，精确控制哪些组件会被编译。

## 运行时控制 {/*runtime-feature-flags-with-gating*/}

`gating`选项使你能够在运行时使用功能标志控制编译。这对于运行 A/B 测试或根据用户细分逐步推出编译器非常有用。

### 运行时控制工作原理 {/*how-gating-works*/}

编译器会在优化后的代码周围添加运行时检查。如果开关返回 `true`，则运行优化版本；否则运行原始代码。

### 控制配置 {/*gating-configuration*/}

```js
// babel.config.js
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      gating: {
        source: 'ReactCompilerFeatureFlags',
        importSpecifierName: 'isCompilerEnabled',
      },
    }],
  ],
};
```

### 实现功能标志 {/*implementing-the-feature-flag*/}

创建一个模块来导出你的门控函数：

```js
// ReactCompilerFeatureFlags.js
export function isCompilerEnabled() {
  // Use your feature flag system
  return getFeatureFlag('react-compiler-enabled');
}
```

## 故障排除 {/*troubleshooting-adoption*/}

如果在采用过程中遇到问题：

1. 使用 `"use no memo"` 临时排除有问题的组件
2. 查阅 [调试指南](/learn/react-compiler/debugging) 以了解常见问题
3. 修复 ESLint 插件识别出的 React 规则违规
4. 考虑使用 `compilationMode: 'annotation'` 以更渐进的方式采用

## 下一步 {/*next-steps*/}

- 阅读 [配置指南](/reference/react-compiler/configuration) 了解更多信息和选项
- 学习 [调试技巧](/learn/react-compiler/debugging)
- 查看 [API 参考](/reference/react-compiler/configuration) 获取所有编译器选项
