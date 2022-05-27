---
id: static-type-checking
title: 静态类型检查
permalink: docs/static-type-checking.html
---

像 [Flow](https://flow.org/) 和 [TypeScript](https://www.typescriptlang.org/) 等这些静态类型检查器，可以在运行前识别某些类型的问题。他们还可以通过增加自动补全等功能来改善开发者的工作流程。出于这个原因，我们建议在大型代码库中使用 Flow 或 TypeScript 来代替 `PropTypes`。

## Flow {#flow}

[Flow](https://flow.org/) 是一个针对 JavaScript 代码的静态类型检测器。Flow 由 Facebook 开发，经常与 React 一起使用。Flow 通过特殊的类型语法为变量，函数，以及 React 组件提供注解，帮助你尽早地发现错误。你可以阅读 [introduction to Flow](https://flow.org/en/docs/getting-started/) 来了解它的基础知识。

完成以下步骤，便可开始使用 Flow：

* 将 Flow 添加到你的项目依赖中。
* 确保编译后的代码中去除了 Flow 语法。
* 添加类型注解并且运行 Flow 来检查它们。

下面我们会详细解释这些步骤。

### 在项目中添加 Flow {#adding-flow-to-a-project}

首先，在终端中进入到项目根目录下。然后你需要执行以下命令：

如果你使用 [Yarn](https://yarnpkg.com/)，执行：

```bash
yarn add --dev flow-bin
```

如果你使用 [npm](https://www.npmjs.com/)，执行：

```bash
npm install --save-dev flow-bin
```

这个命令将在你的项目中安装最新版的 Flow。

接下来，将 `flow` 添加到项目 `package.json` 的 `"scripts"` 部分，以便能够从终端命令行中使用它：

```js{4}
{
  // ...
  "scripts": {
    "flow": "flow",
    // ...
  },
  // ...
}
```

最后，执行以下命令之一：

如果你使用 [Yarn](https://yarnpkg.com/)，执行：

```bash
yarn run flow init
```

如果你使用 [npm](https://www.npmjs.com/)，执行：

```bash
npm run flow init
```

这条命令将生成你需要提交的 Flow 配置文件。

### 从编译后的代码中去除 Flow 语法 {#stripping-flow-syntax-from-the-compiled-code}

Flow 通过这种类型注释的特殊语法扩展了 JavaScript 语言。但是，浏览器不能够解析这种语法，所以我们需要确保它不会被编译到在浏览器执行的 JavaScript bundle 中。

具体方法取决于你使用的 JavaScript 编译工具。

#### Create React App {#create-react-app}

如果你的项目使用的是 [Create React App](https://github.com/facebookincubator/create-react-app)，那么 Flow 注解默认会被去除，所以在这一步你不需要做任何事情。

#### Babel {#babel}

>注意：
>
>这些说明*不适用*于使用 Create React App 的用户。虽然 Create React App 底层也使用了 Babel，但它已经配置了去除 Flow。如果你*没有*使用 Create React App，请执行此步骤。

如果你的项目手动配置了 Babel，你需要为 Flow 安装一个特殊的 preset。

如果你使用 Yarn，执行：

```bash
yarn add --dev @babel/preset-flow
```

如果你使用 npm，执行：

```bash
npm install --save-dev @babel/preset-flow
```

接下来将 `flow` preset 添加到你的 [Babel 配置](https://babeljs.io/docs/usage/babelrc/) 配置中。例如，如果你通过 `.babelrc` 文件配置 Babel，它可能会如下所示：

```js{3}
{
  "presets": [
    "@babel/preset-flow",
    "react"
  ]
}
```

这将让你可以在代码中使用 Flow 语法。

>注意：
>
>Flow 不需要 react preset，但他们经常一起使用。Flow 内置了 JSX 的语法识别。

#### 其他构建工具设置 {#other-build-setups}

如果没有使用 Create React App 或 Babel 来构建项目，可以通过 [flow-remove-types](https://github.com/flowtype/flow-remove-types) 去除类型注解。

### 运行 Flow {#running-flow}

如果你按照上面的说明操作，你应该能运行 Flow 了。

```bash
yarn flow
```

如果你使用 npm，执行：

```bash
npm run flow
```

你应该会看到如下消息：

```
No errors!
✨  Done in 0.17s.
```

### 添加 Flow 类型注释 {#adding-flow-type-annotations}

默认情况下，Flow 仅检查包含此注释的文件：

```js
// @flow
```

通常，它位于文件的顶部。试着将其添加到项目的某些文件中，然后运行 `yarn flow` 或 `npm run flow` 来查看 Flow 是否已经发现了一些问题。

还可以通过[这个选项](https://flow.org/en/docs/config/options/#toc-all-boolean)开启*所有*文件（包括没有注解的文件）的强制检查。通过 Flow 来检查全部文件对于现有的项目来说，可能导致大量修改，但对于希望完全集成 Flow 的新项目来说开启这个选项比较合理。

现在一切就绪！我们建议你查看以下资源来了解有关 Flow 的更多信息：

* [Flow 文档：类型注解](https://flow.org/en/docs/types/)
* [Flow 文档：编辑器](https://flow.org/en/docs/editors/)
* [Flow 文档：React](https://flow.org/en/docs/react/)
* [在 Flow 中进行 lint](https://medium.com/flow-type/linting-in-flow-7709d7a7e969)

## TypeScript {#typescript}

[TypeScript](https://www.typescriptlang.org/) 是一种由微软开发的编程语言。它是 JavaScript 的一个类型超集，包含独立的编译器。作为一种类型语言，TypeScript 可以在构建时发现 bug 和错误，这样程序运行时就可以避免此类错误。您可以通过[此文档](https://github.com/Microsoft/TypeScript-React-Starter#typescript-react-starter) 了解更多有关在 React 中使用 TypeScript 的知识。

完成以下步骤，便可开始使用 TypeScript：
* 将 TypeScript 添加到你的项目依赖中
* 配置 TypeScript 编译选项
* 使用正确的文件扩展名
* 为你使用的库添加定义

下面让我们详细地介绍一下这些步骤：

### 在 Create React App 中使用 TypeScript {#using-typescript-with-create-react-app}

Create React App 内置了对 TypeScript 的支持。

需要创建一个使用 TypeScript 的**新项目**，在终端运行：

```bash
npx create-react-app my-app --template typescript
```

如需将 TypeScript 添加到**现有的 Create React App 项目**中，[请参考此文档](https://facebook.github.io/create-react-app/docs/adding-typescript).

>注意：
>
>如果你使用的是 Create React App，可以跳过本节的其余部分。其余部分讲述了不使用 Create React App 脚手架，手动配置项目的用户。


### 添加 TypeScript 到现有项目中 {#adding-typescript-to-a-project}
这一切都始于在终端中执行的一个命令。

如果你使用 [Yarn](https://yarnpkg.com/)，执行：

```bash
yarn add --dev typescript
```

如果你使用 [npm](https://www.npmjs.com/)，执行：

```bash
npm install --save-dev typescript
```

恭喜！你已将最新版本的 TypeScript 安装到项目中。安装 TypeScript 后我们就可以使用 `tsc` 命令。在配置编译器之前，让我们将 `tsc` 添加到 `package.json` 中的 "scripts" 部分：

```js{4}
{
  // ...
  "scripts": {
    "build": "tsc",
    // ...
  },
  // ...
}
```

### 配置 TypeScript 编译器{#configuring-the-typescript-compiler}
没有配置项，编译器提供不了任何帮助。在 TypeScript 里，这些配置项都在一个名为 `tsconfig.json` 的特殊文件中定义。可以通过执行以下命令生成该文件：

如果你使用 [Yarn](https://yarnpkg.com/)，执行：

```bash
yarn run tsc --init
```

如果你使用 [npm](https://www.npmjs.com/)，执行：

```bash
npx tsc --init
```

`tsconfig.json` 文件中，有许多配置项用于配置编译器。查看所有配置项的的详细说明，[请参考此文档](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)。

我们来看一下 `rootDir` 和 `outDir` 这两个配置项。编译器将从项目中找到 TypeScript 文件并编译成相对应 JavaScript 文件。但我们不想混淆源文件和编译后的输出文件。

为了解决该问题，我们将执行以下两个步骤：
* 首先，让我们重新整理下项目目录，把所有的源代码放入 `src` 目录中。

```
├── package.json
├── src
│   └── index.ts
└── tsconfig.json
```

* 其次，我们将通过配置项告诉编译器源码和输出的位置。

```js{6,7}
// tsconfig.json

{
  "compilerOptions": {
    // ...
    "rootDir": "src",
    "outDir": "build"
    // ...
  },
}
```

很好！现在，当我们运行构建脚本时，编译器会将生成的 javascript 输出到 `build` 文件夹。 [TypeScript React Starter](https://github.com/Microsoft/TypeScript-React-Starter/blob/master/tsconfig.json) 提供了一套默认的 `tsconfig.json` 帮助你快速上手。

通常情况下，你不希望将编译后生成的 JavaScript 文件保留在版本控制内。因此，应该把构建文件夹添加到 `.gitignore` 中。

### 文件扩展名 {#file-extensions}
在 React 中，你的组件文件大多数使用 `.js` 作为扩展名。在 TypeScript 中，提供两种文件扩展名：

`.ts` 是默认的文件扩展名，而 `.tsx` 是一个用于包含 `JSX` 代码的特殊扩展名。

### 运行 TypeScript {#running-typescript}

如果你按照上面的说明操作，现在应该能运行 TypeScript 了。

```bash
yarn build
```

如果你使用 npm，执行：

```bash
npm run build
```

如果你没有看到输出信息，这意味着它编译成功了。


### 类型定义 {#type-definitions}
为了能够显示来自其他包的错误和提示，编译器依赖于声明文件。声明文件提供有关库的所有类型信息。这样，我们的项目就可以用上像 npm 这样的平台提供的三方 JavaScript 库。

获取一个库的声明文件有两种方式：

__Bundled__ - 该库包含了自己的声明文件。这样很好，因为我们只需要安装这个库，就可以立即使用它了。要知道一个库是否包含类型，看库中是否有 `index.d.ts` 文件。有些库会在 `package.json` 文件的 `typings` 或 `types` 属性中指定类型文件。

__[DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)__ - DefinitelyTyped 是一个庞大的声明仓库，为没有声明文件的 JavaScript 库提供类型定义。这些类型定义通过众包的方式完成，并由微软和开源贡献者一起管理。例如，React 库并没有自己的声明文件。但我们可以从 DefinitelyTyped 获取它的声明文件。只要执行以下命令。

```bash
# yarn
yarn add --dev @types/react

# npm
npm i --save-dev @types/react
```

__局部声明__
有时，你要使用的包里没有声明文件，在 DefinitelyTyped 上也没有。在这种情况下，我们可以创建一个本地的定义文件。因此，在项目的根目录中创建一个 `declarations.d.ts` 文件。一个简单的声明可能是这样的：

```typescript
declare module 'querystring' {
  export function stringify(val: object): string
  export function parse(val: string): object
}
```

你现在已做好编码准备了！我们建议你查看以下资源来了解有关 TypeScript 的更多知识：

* [TypeScript 文档：常用类型](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
* [TypeScript 文档：JavaScript 迁移](https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html)
* [TypeScript 文档：React 与 Webpack](https://www.typescriptlang.org/docs/handbook/react-&-webpack.html)

## ReScript {#rescript}

[ReScript](https://rescript-lang.org/) 是一门类型语言，可编译为 JavaScript。它的部分核心功能是为了保证 100% 的类型覆盖，完美支持 JSX 和[独有的 React 绑定](https://rescript-lang.org/docs/react/latest/introduction)，以允许开发者无缝集成到现有的 JS/TS 的 React 代码库中。

你可以在[此处](https://rescript-lang.org/docs/manual/latest/installation#integrate-into-an-existing-js-project)。了解更多关于如何将 ReScript 集成到现有的 JS / React 代码库的信息。

## Kotlin {#kotlin}

[Kotlin](https://kotlinlang.org/) 是由 JetBrains 开发的一门静态类型语言。其目标平台包括 JVM、Android、LLVM 和 [JavaScript](https://kotlinlang.org/docs/reference/js-overview.html)。

JetBrains 专门为 React 社区开发和维护了几个工具：[React bindings](https://github.com/JetBrains/kotlin-wrappers) 以及 [Create React Kotlin App](https://github.com/JetBrains/create-react-kotlin-app)。后者可以通过 Kotlin 快速编写 React 应用程序，并且不需要构建配置。

## 其他语言 {#other-languages}

注意，还有其他静态类型语言可以编译成 JavaScript，也与 React 兼容。例如，和 [elmish-react](https://elmish.github.io/react) 一起使用的 [F#/Fable](https://fable.io)。查看他们各自的网站以获取更多信息，并欢迎添加更多和与 React 结合的静态类型语言到这个页面！
