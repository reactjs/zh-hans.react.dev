---
title: 安装
---

<Intro>
本指南将帮助你在 React 应用程序中安装和配置 React Compiler。
</Intro>

<YouWillLearn>

* 如何安装 React 编译器
* 不同构建工具的基本配置
* 如何验证你的设置是否正常工作

</YouWillLearn>

## 前提条件 {/*prerequisites*/}

React 编译器专为与 React 19 配合使用而设计，但也支持 React 17 和 18。了解有关 [React 版本兼容性](/reference/react-compiler/target) 的更多信息。

<Note>
React Compiler 当前处于 RC 阶段。请使用 `@rc` 标签安装，以获取最新的发布候选版本。
</Note>

## 安装 {/*installation*/}

将 React 编译器安装为 `devDependency`：

<TerminalBlock>
npm install -D babel-plugin-react-compiler@rc
</TerminalBlock>

或者使用 Yarn：

<TerminalBlock>
yarn add -D babel-plugin-react-compiler@rc
</TerminalBlock>

或者使用 pnpm：

<TerminalBlock>
pnpm install -D babel-plugin-react-compiler@rc
</TerminalBlock>

## 基本设置 {/*basic-setup*/}

React Compiler 默认无需任何配置即可工作。不过，如果你需要在特殊情况下进行配置（例如，要支持低于 19 版本的 React），请参考[编译器选项参考文档](/reference/react-compiler/configuration)。

设置过程取决于你使用的构建工具。React Compiler 包含一个 Babel 插件，可以集成到你的构建流程中。

<Pitfall>
React Compiler 必须在你的 Babel 插件管道中 **首先** 运行。编译器需要原始的源代码信息来进行正确的分析，因此它必须在其他转换操作之前处理你的代码。
</Pitfall>

### Babel {/*babel*/}

创建或更新你的 `babel.config.js`：

```js {3}
module.exports = {
  plugins: [
    'babel-plugin-react-compiler', // must run first!
    // ... other plugins
  ],
  // ... other config
};
```

### Vite {/*vite*/}

如果你使用 Vite，可以将插件添加到 vite-plugin-react 中：

```js {3,9}
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
  ],
});
```

或者，如果你更倾向于为 Vite 使用一个独立的 Babel 插件：

<TerminalBlock>
npm install -D vite-plugin-babel
</TerminalBlock>

```js {2,11}
// vite.config.js
import babel from 'vite-plugin-babel';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    babel({
      babelConfig: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
  ],
});
```

### Next.js {/*usage-with-nextjs*/}

更多信息请参考 [Next.js 文档](https://nextjs.org/docs/app/api-reference/next-config-js/reactCompiler)。

### React Router {/*usage-with-react-router*/}
安装 `vite-plugin-babel`，并将其编译器的 Babel 插件添加到其中：

<TerminalBlock>
{`npm install vite-plugin-babel`}
</TerminalBlock>

```js {3-4,16}
// vite.config.js
import { defineConfig } from "vite";
import babel from "vite-plugin-babel";
import { reactRouter } from "@react-router/dev/vite";

const ReactCompilerConfig = { /* ... */ };

export default defineConfig({
  plugins: [
    reactRouter(),
    babel({
      filter: /\.[jt]sx?$/,
      babelConfig: {
        presets: ["@babel/preset-typescript"], // if you use TypeScript
        plugins: [
          ["babel-plugin-react-compiler", ReactCompilerConfig],
        ],
      },
    }),
  ],
});
```

### Webpack {/*usage-with-webpack*/}

社区开发的 webpack loader 现在可以从[这里](https://github.com/SukkaW/react-compiler-webpack)获取。

### Expo {/*usage-with-expo*/}

请参考 [Expo 文档](https://docs.expo.dev/guides/react-compiler/) 以了解如何在 Expo 应用中启用并使用 React 编译器。

### Metro (React Native) {/*usage-with-react-native-metro*/}

React Native 通过 Metro 使用 Babel，因此请参考 [与 Babel 配合使用](#babel) 章节获取安装说明。

### Rspack {/*usage-with-rspack*/}

请参考 [Rspack 文档](https://rspack.dev/guide/tech/react#react-compiler) 以了解如何在 Rspack 应用中启用并使用 React 编译器。

### Rsbuild {/*usage-with-rsbuild*/}

请参考 [Rsbuild 文档](https://rsbuild.dev/guide/framework/react#react-compiler) 以了解如何在 Rsbuild 应用中启用并使用 React 编译器。


## ESLint Integration {/*eslint-integration*/}

React Compiler 包含一条 ESLint 规则，可帮助识别无法优化的代码。当 ESLint 规则报告错误时，意味着编译器将跳过对该特定组件或 Hook 的优化。这是安全的：编译器将继续优化代码库的其他部分。你不需要立即修复所有违规之处。可以按照自己的节奏逐步解决这些问题，以逐渐增加已优化组件的数量。

安装 ESLint 插件：

<TerminalBlock>
npm install -D eslint-plugin-react-hooks@rc
</TerminalBlock>

如果你尚未配置好 eslint-plugin-react-hooks，参考 [readme 的安装说明来进行配置](https://github.com/facebook/react/blob/main/packages/eslint-plugin-react-hooks/README.md#installation)。最新的 RC 版本中默认启用了编译器规则，因此不需要其他配置。

ESLint 规则将会：
- 识别对 [React 规则](/reference/rules) 的违反情况
- 显示哪些组件无法被优化
- 提供有用的错误信息来帮助修复问题

## 验证你的设置 {/*verify-your-setup*/}

安装后，请验证 React 编译器是否正常工作。

### 检查 React DevTools {/*check-react-devtools*/}

由 React 编译器优化的组件会在 React DevTools 中显示一个 "Memo ✨" 徽章：

1. 安装 [React Developer Tools](/learn/react-developer-tools) 浏览器扩展
2. 在开发模式下打开你的应用
3. 打开 React DevTools
4. 查看组件名称旁边的 ✨ 表情符号

如果编译器正在工作：
- 组件将在 React DevTools 中显示一个 "Memo ✨" 徽章
- 昂贵的计算将自动被记忆化
- 无需手动使用 `useMemo`

### 检查构建输出 {/*check-build-output*/}

你还可以通过检查构建输出来验证编译器是否正在运行。编译后的代码将包含编译器自动添加的自动记忆化逻辑。

```js
import { c as _c } from "react/compiler-runtime";
export default function MyApp() {
  const $ = _c(1);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = <div>Hello World</div>;
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  return t0;
}

```

## 故障排除 {/*troubleshooting*/}

### 排除特定组件 {/*opting-out-specific-components*/}

如果某个组件在编译后引发问题，可以使用 `"use no memo"` 指令暂时将其排除：

```js
function ProblematicComponent() {
  "use no memo";
  // Component code here
}
```

这会告诉编译器跳过对该特定组件的优化。你应该修复根本问题，并在解决后移除该指令。

如需更多故障排除帮助，请参阅[调试指南](/learn/react-compiler/debugging)。

## 下一步 {/*next-steps*/}

既然你已经安装了 React 编译器，可以进一步了解以下内容：

- [React 版本兼容性](/reference/react-compiler/target)，适用于 React 17 和 18
- [配置选项](/reference/react-compiler/configuration)，用于自定义编译器
- [渐进采用策略](/learn/react-compiler/incremental-adoption)，用于现有的代码库
- [调试技巧](/learn/react-compiler/debugging)，用于排查问题
- [编译库指南](/reference/react-compiler/compiling-libraries)，用于编译你的 React 库
