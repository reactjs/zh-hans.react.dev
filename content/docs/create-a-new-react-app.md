---
id: create-a-new-react-app
title: 创建新的 React 应用
permalink: docs/create-a-new-react-app.html
redirect_from:
  - "docs/add-react-to-a-new-app.html"
prev: add-react-to-a-website.html
next: cdn-links.html
---

使用集成的工具链，以实现最佳的用户和开发人员体验。

本页将介绍一些流行的 React 工具链，它们有助于完成如下任务：

* 扩展文件和组件的规模。
* 使用来自 npm 的第三方库。
* 尽早发现常见错误。
* 在开发中实时编辑 CSS 和 JS。
* 优化生产输出。

本页推荐的工具链**无需配置即可开始使用**。

## 你可能不需要工具链 {#you-might-not-need-a-toolchain}

如果你没有碰到上述的问题，或者还不习惯使用 JavaScript 工具，可以考虑[把 React 作为普通的 `<script>` 标记添加到 HTML 页面上](/docs/add-react-to-a-website.html)，以及[使用可选的 JSX](/docs/add-react-to-a-website.html#optional-try-react-with-jsx)。

这也是**将 React 集成到现有网站最简单的方式**。如果你认为更大的工具链有所帮助，可以随时添加！

## 推荐的工具链 {#recommended-toolchains}

React 团队主要推荐这些解决方案：

- 如果你是在**学习 React** 或**创建一个新的[单页](/docs/glossary.html#single-page-application)应用**，请使用 [Create React App](#create-react-app)。
- 如果你是在**用 Node.js 构建服务端渲染的网站**，试试 [Next.js](#nextjs)。
- 如果你是在构建**面向内容的静态网站**，试试 [Gatsby](#gatsby)。
- 如果你是在打造**组件库**或**将 React 集成到现有代码仓库**，尝试[更灵活的工具链](#more-flexible-toolchains)。

### Create React App {#create-react-app}

[Create React App](https://github.com/facebookincubator/create-react-app) 是一个用于**学习 React** 的舒适环境，也是用 React 创建**新的[单页](/docs/glossary.html#single-page-application)应用**的最佳方式。

它会配置你的开发环境，以便使你能够使用最新的 JavaScript 特性，提供良好的开发体验，并为生产环境优化你的应用程序。你需要在你的机器上安装 Node >= 8.10 和 npm >= 5.6。要创建项目，请执行：

```bash
npx create-react-app my-app
cd my-app
npm start
```

> 注意
>
> 第一行的 `npx` 不是拼写错误 —— 它是 [npm 5.2+ 附带的 package 运行工具](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b)。

Create React App 不会处理后端逻辑或操纵数据库；它只是创建一个前端构建流水线（build pipeline），所以你可以使用它来配合任何你想使用的后端。它在内部使用 [Babel](https://babeljs.io/) 和 [webpack](https://webpack.js.org/)，但你无需了解它们的任何细节。

当你准备好部署到生产环境时，执行 `npm run build` 会在 `build` 文件夹内生成你应用的优化版本。你能[从它的 README](https://github.com/facebookincubator/create-react-app#create-react-app--) 和[用户指南](https://facebook.github.io/create-react-app/)了解 Create React App 的更多信息。

### Next.js {#nextjs}

[Next.js](https://nextjs.org/) 是一个流行的、轻量级的框架，用于配合 React 打造**静态化和服务端渲染应用**。它包括开箱即用的**样式和路由方案**，并且假定你使用 [Node.js](https://nodejs.org/) 作为服务器环境。

从 [Next.js 的官方指南](https://nextjs.org/learn/)了解更多。

### Gatsby {#gatsby}

[Gatsby](https://www.gatsbyjs.org/) 是用 React 创建**静态网站**的最佳方式。它让你能使用 React 组件，但输出预渲染的 HTML 和 CSS 以保证最快的加载速度。

从 Gatsby 的[官方指南](https://www.gatsbyjs.org/docs/)和[入门示例集](https://www.gatsbyjs.org/docs/gatsby-starters/)了解更多。

### 更灵活的工具链 {#more-flexible-toolchains}

以下工具链为 React 提供更多更具灵活性的方案。推荐给更有经验的使用者：

- **[Neutrino](https://neutrinojs.org/)** 把 [webpack](https://webpack.js.org/) 的强大功能和简单预设结合在一起。并且包括了 [React 应用](https://neutrinojs.org/packages/react/)和 [React 组件](https://neutrinojs.org/packages/react-components/)的预设。

- **[nwb](https://github.com/insin/nwb)** 特别适合于[将 React 组件发布到 npm](https://github.com/insin/nwb/blob/master/docs/guides/ReactComponents.md#developing-react-components-and-libraries-with-nwb)。它也[能用于](https://github.com/insin/nwb/blob/master/docs/guides/ReactApps.md#developing-react-apps-with-nwb)创造 React 应用。

- **[Parcel](https://parceljs.org/)** 是一个快速的、零配置的网页应用打包器，并且可以[搭配 React 一起工作](https://parceljs.org/recipes.html#react)。

- **[Razzle](https://github.com/jaredpalmer/razzle)** 是一个无需配置的服务端渲染框架，但它提供了比 Next.js 更多的灵活性。

## 从头开始打造工具链 {#creating-a-toolchain-from-scratch}

一组 JavaScript 构建工具链通常由这些组成：

* 一个 **package 管理器**，比如 [Yarn](https://yarnpkg.com/) 或 [npm](https://www.npmjs.com/)。它能让你充分利用庞大的第三方 package 的生态系统，并且轻松地安装或更新它们。

* 一个**打包器**，比如 [webpack](https://webpack.js.org/) 或 [Parcel](https://parceljs.org/)。它能让你编写模块化代码，并将它们组合在一起成为小的 package，以优化加载时间。

* 一个**编译器**，例如 [Babel](https://babeljs.io/)。它能让你编写的新版本 JavaScript 代码，在旧版浏览器中依然能够工作。

如果你倾向于从头开始打造你自己的 JavaScript 工具链，可以[查看这个指南](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658)，它重新创建了一些 Create React App 的功能。

别忘了确保你自定义的工具链[针对生产环境进行了正确配置](/docs/optimizing-performance.html#use-the-production-build)。
