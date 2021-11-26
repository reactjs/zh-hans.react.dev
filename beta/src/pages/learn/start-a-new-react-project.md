---
title: 开始一个 React 新项目
translators:
  - watonyweng
---

<Intro>

如果你正在学习 React 或考虑将其添加到现有项目中，你可以通过 [使用脚本标签添加 React 到任意的 HTML 页面](/learn/add-react-to-a-website) 快速入门。如果你的项目需要很多组件和文件，那么是时候考虑下面的选项了！

</Intro>

## 选择你的冒险 {#choose-your-own-adventure}

React 是一个允许你将 UI 代码有效地组织称为组件的框架。React 不关注路由或者数据管理。对于这些特性，你需要使用第三方库或者书写自己的解决方案。这意味着有几种方法可以启动一个新的 React 项目：

- 从**最小工具链开始，**如有必要添加新特性到你的项目中。
- 从一个已经内置了通用功能的**固执己见的框架**开始。

无论你刚刚入门、想要构建大型项目，或者想构建自己的工具链，本指南都会为你指明正确的道路。

## 使用 React 工具链入门 {#getting-started-with-a-react-toolchain}

如果你刚开始使用 React，我们推荐 [Create React App](https://create-react-app.dev/)，这是试用 React 特性的一种流行方式，也是构建一个单页面，客户端的好办法。Create React App 是一个专为 React 配置坚持己见的工具链。工具链有助于处理以下事情：

- 允许扩展许多文件和组件
- 使用来自 npm 的第三方库
- 及早地发现常见错误
- 开发过程中的实时编辑 CSS 和 JS
- 优化生产输出

你可以在终端通过 Create React App 一行代码来开始构建你的应用！(**确保你已经安装 [Node.js](https://nodejs.org/)！**)

<TerminalBlock>

npx create-react-app my-app

</TerminalBlock>

现在可以通过以下方式你的应用：

<TerminalBlock>

cd my-app
npm start

</TerminalBlock>

想了解更多信息，请 [查阅官方指南](https://create-react-app.dev/docs/getting-started)。

> Create React App 不处理后端逻辑或者数据库；它只是创建了一个前端构建管道。这意味着你可以将它与你想要的任何后端一起使用。但是你正在寻找更多特性，比如路由和服务端渲染逻辑，请继续往下阅读！

### 其它选项 {#other-options-1}

Create React App 非常适合开始使用 React，但如果你想要更轻量级的工具链，可以尝试以下流行的工具链：

- [Vite](https://vitejs.dev/guide/)
- [Parcel](https://parceljs.org/)
- [Snowpack](https://www.snowpack.dev/tutorials/react)

## 使用 React 和框架构建 {#building-with-react-and-a-framework}

如果你想开始一个大规模、生产可用的项目，[Next.js](https://nextjs.org/) 是一个很好的起点。Next.js 是一个流行的，轻量的使用 React 构建的静态和服务端渲染框架。它预先打包了路由，样式，服务端渲染等特性，可用快速地开始你的项目。

使用官方指南来 [入门 Next.js](https://nextjs.org/docs/getting-started)。

### 其它选项 {#other-options-2}

- [Gatsby](https://www.gatsbyjs.org/) 允许你使用 React 和 GraphQL 生成静态站点。
- [Razzle](https://razzlejs.org/) 是一个无需任何配置的服务端渲染框架，它提供了比 Next.js 更多的灵活性。

## 自定义工具链 {#custom-toolchains}

你可能更喜欢创建和配置自己的工具链。一个 JavaScript 构建工具链通常包括：

- 一个**包管理器**——允许你安装，更新和管理第三方包。[Yarn](https://yarnpkg.com/) 和 [npm](https://www.npmjs.com/) 是两个流行的包管理器。
- 一个**打包器**——允许你编写模块化代码并将其捆绑到更小的包中来优化加载时间。[Webpack](https://webpack.js.org/)，[Snowpack](https://www.snowpack.dev/)，[Parcel](https://parceljs.org/) 是几个流行的打包器。
- 一个**编译器**——允许你编写在旧浏览器中可以正常运行的现代 JavaScript 代码。[Babel](https://babeljs.io/) 是其中的一个例子。

在一个大型项目中，你可以需要一个工具来管理单个存储库中的多个包。[Nx](https://nx.dev/react) 是这种工具的例子。

如果你更喜欢从头开始设置自己的 JavaScript 工具链，对于以函数方式重新创建 React 应用可以 [查阅指南](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658)。
