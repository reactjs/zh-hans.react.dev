---
title: "介绍全新的 JSX 转换"
author: [lunaruan]
---

虽然 React 17 [并未包含新特性](/blog/2020/08/10/react-v17-rc.html)，但它将提供一个全新版本的 JSX 转换。本文中，我们将为你描述它是什么以及如何使用。

## 何为 JSX 转换？ {#whats-a-jsx-transform}

在浏览器中无法直接使用 JSX，所以大多数 React 开发者需依靠 Babel 或 TypeScript 来**将 JSX 代码转换为 JavaScript**。许多包含预配置的工具，例如 Create React App 或 Next.js，在其内部也引入了 JSX 转换。

React 17 发布在即，尽管我们想对 JSX 的转换进行改进，但我们不想打破现有的配置。于是我们选择[与 Babel 合作](https://babeljs.io/blog/2020/03/16/7.9.0#a-new-jsx-transform-11154httpsgithubcombabelbabelpull11154) ，为想要升级的开发者**提供了一个全新的，重构过的 JSX 转换的版本**。

升级至全新的转换完全是可选的，但升级它会为你带来一些好处：

* 使用全新的转换，你可以**单独使用 JSX 而无需引入 React**。
* 根据你的配置，JSX 的编译输出可能会**略微改善 bundle 的大小**。
* 它将**减少你需要学习 React 概念的数量**，以备未来之需。

**此次升级不会改变 JSX 语法，也并非必须**。旧的 JSX 转换将继续工作，没有计划取消对它的支持。


[React 17 的 RC 版本](/blog/2020/08/10/react-v17-rc.html) 已经引入了对新转换的支持，所以你可以尝试一下！为了让大家更容易使用，在 React 17 正式发布后，我们还将此支持移植到了 React 16.14.0，React 15.7.0 以及 React 0.14.10。你可以在[下方](#how-to-upgrade-to-the-new-jsx-transform)找到不同工具的升级说明。

接下来，我们来仔细对比新旧转换的区别。

## 新的转换有何不同？ {#whats-different-in-the-new-transform}

当你使用 JSX 时，编译器会将其转换为浏览器可以理解的 React 函数调用。**旧的 JSX 转换**会把 JSX 转换为 `React.createElement(...)` 调用。

例如，假设源代码如下：

```js
import React from 'react';

function App() {
  return <h1>Hello World</h1>;
}
```

旧的 JSX 转换会将上述代码变成普通的 JavaScript 代码：

```js
import React from 'react';

function App() {
  return React.createElement('h1', null, 'Hello world');
}
```

>注意
>
>**无需改变源码**。我们将介绍 JSX 转换如何将你的 JSX 源码变成浏览器可以理解的 JavaScript 代码。

然而，这并不完美：

* 如果使用 JSX，则需在 `React` 的环境下，因为 JSX 将被编译成 `React.createElement`。
* 有一些 `React.createElement` 无法做到的[性能优化和简化](https://github.com/reactjs/rfcs/blob/createlement-rfc/text/0000-create-element-changes.md#motivation)。

为了解决这些问题，React 17 在 React 的 package 中引入了两个新入口，这些入口只会被 Babel 和 TypeScript 等编译器使用。新的 JSX 转换**不会将 JSX 转换为 `React.createElement`**，而是自动从 React 的 package 中引入新的入口函数并调用。

假设你的源代码如下：

```js
function App() {
  return <h1>Hello World</h1>;
}
```

下方是新 JSX 被转换编译后的结果：

```js
// 由编译器引入（禁止自己引入！）
import {jsx as _jsx} from 'react/jsx-runtime';

function App() {
  return _jsx('h1', { children: 'Hello world' });
}
```

注意，此时源代码**无需引入 React** 即可使用 JSX 了！（但仍需引入 React，以便使用 React 提供的 Hook 或其他导出。）

**此变化与所有现有 JSX 代码兼容**，所以你无需修改组件。如果你对此感兴趣，你可以查看 [RFC](https://github.com/reactjs/rfcs/blob/createlement-rfc/text/0000-create-element-changes.md#detailed-design) 了解全新转换工作的具体细节。

> 注意
>
> `react/jsx-runtime` 和 `react/jsx-dev-runtime` 中的函数只能由编译器转换使用。如果你需要在代码中手动创建元素，你可以继续使用 `React.createElement`。它将继续工作，不会消失。

## 如何升级至新的 JSX 转换 {#how-to-upgrade-to-the-new-jsx-transform}

如果你还没准备好升级为全新的 JSX 转换，或者你正在为其他库使用 JSX，请不要担心，旧的转换不会被移除，并将继续支持。

如果你想升级，你需要准备两件事：

* **支持新转换的 React 版本**（[React 17 的 RC 版本](/blog/2020/08/10/react-v17-rc.html) 及更高版本支持它，但是我们也发布了 React 16.14.0，React 15.7.0 以及 0.14.10 等主要版本，以供还在使用旧版本的开发者使用它们）
* **一个兼容新转换的编译器**（请看下面关于不同工具的说明）。

由于新的 JSX 转换不依赖 React 环境，[我们准备了一个自动脚本](#removing-unused-react-imports)，用于移除你代码中不必要的引入。

### Create React App {#create-react-app}

Create React App [4.0.0](https://github.com/facebook/create-react-app/releases/tag/v4.0.0)+ 使用了兼容 React 版本的 JSX 转换。

### Next.js {#nextjs}

Next.js 的 [v9.5.3](https://github.com/vercel/next.js/releases/tag/v9.5.3)+ 会使用新的转换来兼容 React 版本。

### Gatsby {#gatsby}

<<<<<<< HEAD
Gatsby 的 [v2.24.5](https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby/CHANGELOG.md#22452-2020-08-28)+ 会使用新的转换来兼容 React 版本。
=======
Gatsby [v2.24.5](https://github.com/gatsbyjs/gatsby/blob/main/packages/gatsby/CHANGELOG.md#22452-2020-08-28)+ uses the new transform for compatible React versions.
>>>>>>> 0bb0303fb704147452a568472e968993f0729c28

>注意
>
>如果你在 [Gatsby 中遇到 error](https://github.com/gatsbyjs/gatsby/issues/26979)，请升级至 React 17 的 RC 版本，运行 `npm update` 解决此问题。

### 手动设置 Babel {#manual-babel-setup}

Babel 的 [v7.9.0](https://babeljs.io/blog/2020/03/16/7.9.0) 及以上版本可支持全新的 JSX 转换。

首先，你需要更新至最新版本的 Babel 和 transform 插件。

如果你使用的是 `@babel/plugin-transform-react-jsx`：

```bash
# npm 用户
npm update @babel/core @babel/plugin-transform-react-jsx
```

```bash
# yarn 用户
yarn upgrade @babel/core @babel/plugin-transform-react-jsx
```

如果你使用的是 `@babel/preset-react`：

```bash
# npm 用户
npm update @babel/core @babel/preset-react
```

```bash
# yarn 用户
yarn upgrade @babel/core @babel/preset-react
```

目前，旧的转换的默认选项为 `{"runtime": "classic"}`。如需启用新的转换，你可以使用 `{"runtime": "automatic"}` 作为 `@babel/plugin-transform-react-jsx` 或 `@babel/preset-react` 的选项：

```js
// 如果你使用的是 @babel/preset-react
{
  "presets": [
    ["@babel/preset-react", {
      "runtime": "automatic"
    }]
  ]
}
```

```js
// 如果你使用的是 @babel/plugin-transform-react-jsx
{
  "plugins": [
    ["@babel/plugin-transform-react-jsx", {
      "runtime": "automatic"
    }]
  ]
}
```

从 Babel 8 开始，`"automatic"` 会将两个插件默认集成在 rumtime 中。欲了解更多信息，请查阅 Babel 文档中的 [@babel/plugin-transform-react-jsx](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx) 以及 [@babel/preset-react](https://babeljs.io/docs/en/babel-preset-react)。

> 注意
>
> 如果你在使用 JSX 时，使用 React 以外的库，你可以使用 [`importSource` 选项](https://babeljs.io/docs/en/babel-preset-react#importsource)从该库中引入 — 前提是它提供了必要的入口。或者你可以继续使用经典的转换，它会继续被支持。
>
> 如果你是库的作者并且需要为你的库实现 `/jsx-runtime` 的入口，需注意[一种情况](https://github.com/facebook/react/issues/20031#issuecomment-710346866)，在此情况下，为了向下兼容，即使使用了新的 jsx 转换，也必须考虑 `createElement`。在上述情况中，将直接从 `importSource` 的根入口中自动引入 `createElement`。

### ESLint {#eslint}

如果你正在使用 [eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react)，其中的 `react/jsx-uses-react` 和 `react/react-in-jsx-scope` 规则将不再需要，可以关闭它们或者删除。

```js
{
  // ...
  "rules": {
    // ...
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off"
  }
}
```

### TypeScript {#typescript}

TypeScript 将在 [v4.1](https://devblogs.microsoft.com/typescript/announcing-typescript-4-1/#jsx-factories) 及以上版本中支持新的 JSX 转换。

### Flow {#flow}

Flow 将在 [v0.126.0](https://github.com/facebook/flow/releases/tag/v0.126.0) 中支持新的 JSX 转换。

## 移除未使用的 React 引入 {#removing-unused-react-imports}

因为新的 JSX 转换会自动引入必要的 `react/jsx-runtime` 函数，因此当你使用 JSX 时，将无需再引入 React。将可能会导致你代码中有未使用到的 React 引入。保留它们也无伤大雅，但如果你想删除它们，我们建议运行 [“codemod”](https://medium.com/@cpojer/effective-javascript-codemods-5a6686bb46fb) 脚本来自动删除它们：

```bash
cd your_project
npx react-codemod update-react-imports
```

>注意：
>
>如果你在运行 codemod 时出现错误，请尝试使用 `npx react-codemod update-react-imports` 选择不同的 JavaScript 环境。尤其是选择 "JavaScript with Flow" 时，即使你未使用 Flow，也可以选择它，因为它比 JavaScript 支持更新的语法。如果遇到问题，请[告知我们](https://github.com/reactjs/react-codemod/issues)。
>
>请注意，codemod 的输出可能与你的代码风格并不匹配，因此你可能需要再 codemod 完成后运行 [Prettier](https://prettier.io/) 以保证格式一致。

运行 codemod 会执行如下操作：

* 升级到新的 JSX 转换，删除所有未使用的 React 引入。
* 所有 React 的默认引入将被改为解构命名引入（例如，`import React from "react"` 会变成 `import { useState } from "react"`），这将成为未来开发的首选风格。codemod **不会** 影响现有的命名空间引入方式（即 `import * as React from "react"`），这也是一种有效的风格。默认的引入将在 React 17 中继续工作，但从长远来看，我们建议尽量不使用它们。

示例：

```js
import React from 'react';

function App() {
  return <h1>Hello World</h1>;
}
```

将被替换为

```js
function App() {
  return <h1>Hello World</h1>;
}
```

如果你使用了 React 的其他导出 — 比如 Hook，那么 codemod 将把它们转换为具名导入。

示例：

```js
import React from 'react';

function App() {
  const [text, setText] = React.useState('Hello World');
  return <h1>{text}</h1>;
}
```

会被替换为

```js
import { useState } from 'react';

function App() {
  const [text, setText] = useState('Hello World');
  return <h1>{text}</h1>;
}
```

除了清理未使用的引入外，此工具还可帮你为未来 React 主要版本（不是 React 17 版本）做铺垫，该版本将支持 ES 模块，并且没有默认导出。

## 鸣谢 {#thanks}

我们要感谢 Babel，TypeScript，Create React App，Next.js，Gatsby，ESLint 以及 Flow 的主要维护者为新 JSX 转换提供的实现和整合。我们还要感谢 React 社区对相关 [RFC](https://github.com/reactjs/rfcs/pull/107) 提供的反馈和讨论。
