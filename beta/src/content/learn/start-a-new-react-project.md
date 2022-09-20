---
title: 启动一个新的 React 项目
translators:
  - watonyweng
  - QC-L
---

<Intro>

如果你打算启动一个新项目，我们建议使用工具链或框架。这些工具提供了非常舒适的开发环境，但前提是需要在本地安装 Node.js。

</Intro>

<YouWillLearn>

* 工具链与框架有何不同
* 如何用极简的工具链启动一个项目
* 如何用功能齐全的框架启动一个项目
* 流行的工具链和框架有哪些

</YouWillLearn>

## 选择适合你的方案 {/*choose-your-own-adventure*/}

React 是一个库，可以让你通过将 UI 代码分解成一个个组件的方式来组织它。但 React 并不负责路由或者数据管理。这意味着有几种方案来启动一个 React 新项目：

<<<<<<< HEAD
* 从 [**HTML 文件和 script 标签开始**](/learn/add-react-to-a-website)。这种方案无需 Node.js 配置，但提供的功能有限。
* 从一款 **极简的工具链** 开始，可以在你的项目中加入更多的功能。（非常适合学习入门！）
* 从一款 **功能齐全的框架** 开始，它内置了数据获取以及路由等常见功能。
=======
* [Start with an **HTML file and a script tag.**](/learn/add-react-to-a-website) This doesn't require Node.js setup but offers limited features.
* Start with a **minimal toolchain,** adding more features to your project as you go. (Great for learning!)
* Start with an **opinionated framework** that has common features like data fetching and routing built-in.
>>>>>>> d1fee87a0f70f82677b29f05f5c5d7101eec9b8d

## 快速入门极简工具链 {/*getting-started-with-a-minimal-toolchain*/}

<<<<<<< HEAD
如果你正在 **学习 React**，我们推荐使用 [Create React App](https://create-react-app.dev/)。它是尝试 React 以及创建单页客户端应用的最流行方案。它是为 React 量身打造的，但缺点是不支持路由以及数据获取。

首先，你需要安装 [Node.js](https://nodejs.org/en/)。接着打开你的终端，并运行这行命令来创建一个新项目：
=======
If you're **learning React,** we recommend [Create React App.](https://create-react-app.dev/) It is the most popular way to try out React and build a new single-page, client-side application. It's made for React but isn't opinionated about routing or data fetching.

First, install [Node.js.](https://nodejs.org/en/) Then open your terminal and run this line to create a project:
>>>>>>> d1fee87a0f70f82677b29f05f5c5d7101eec9b8d

<TerminalBlock>

npx create-react-app my-app

</TerminalBlock>

现在可以通过以下方式运行你的应用：

<TerminalBlock>

cd my-app
npm start

</TerminalBlock>

<<<<<<< HEAD
想了解更多信息，请 [查阅官方指南](https://create-react-app.dev/docs/getting-started)。
=======
For more information, [check out the official guide.](https://create-react-app.dev/docs/getting-started)
>>>>>>> d1fee87a0f70f82677b29f05f5c5d7101eec9b8d

> Create React App 不处理任何后端逻辑或数据库。你可以把它与任何后端搭配使用。当你创建一个项目时，你会得到一个包含静态 HTML、CSS 和 JS 的文件夹。因为 Create React App 不能利用服务器优势，它不能提供最好的性能。如果你正在寻找更快的加载时间，以及完善的内置功能，如路由和服务端处理逻辑，我们推荐你使用框架代替。

### 主流备选方案 {/*popular-alternatives*/}

* [Vite](https://vitejs.dev/guide/)
* [Parcel](https://parceljs.org/getting-started/webapp/)

## 使用开箱即用的框架来构建 {/*building-with-a-full-featured-framework*/}

如果你想 **启动一个用于生产的项目**，[Next.js](https://nextjs.org/) 是你的首选。Next.js 是一款流行且轻量级的框架，用于使用 React 来构建静态和服务端渲染程序。它内置了路由、样式和服务端渲染等功能，可以快速启动和运行你的项目。

[Next.js 基础教程](https://nextjs.org/learn/foundations/about-nextjs) 是对使用 React 和 Next.js 进行构建的一个完美诠释。

### 主流备选方案 {/*popular-alternatives*/}

* [Gatsby](https://www.gatsbyjs.org/)
* [Remix](https://remix.run/)
* [Razzle](https://razzlejs.org/)

## 自定义工具链 {/*custom-toolchains*/}

你可能喜欢创建和配置你自己的工具链，一个工具链通常由以下部分组成：

<<<<<<< HEAD
* 一款 **包管理器（package manager）** 可以让你安装、更新并管理第三方软件包。主流的包管理器有：[npm](https://www.npmjs.com/)（内置于 Node.js）中，[Yarn](https://yarnpkg.com/)，[pnpm](https://pnpm.io/)。
* 一款 **编译器（compiler）** 可以让你编译现代语法特性和额外语法特性，如 JSX 或浏览器的类型注释。主流的编译器有：[Babel](https://babeljs.io/)，[TypeScript](https://www.typescriptlang.org/)，[swc](https://swc.rs/)。
* 一款 **捆绑器（bundler）** 可以编写模块化代码并将其进行捆绑到小包中，以优化加载时间。主流的捆绑器有：[webpack](https://webpack.js.org/)，[Parcel](https://parceljs.org/)，[esbuild](https://esbuild.github.io/)，[swc](https://swc.rs/).
* 一款 **压缩工具（minifier）** 可以使你的代码体积更小，从而提高加载速度。主流的压缩工具有：[Terser](https://terser.org/)，[swc](https://swc.rs/)。
* 一款 **服务端框架** 处理服务器请求，以便于将组件渲染成 HTML。主流的服务端框架有：[Express](https://expressjs.com/)。
* 一款 **代码检查工具（linter）** 用于检查你的代码是否包含常见错误。主流的代码检查工具有： [ESLint](https://eslint.org/)。
* 一款 **测试框架（test runner）** 用于对你的代码进行测试。主流测测试框架：[Jest](https://jestjs.io/)。
=======
* A **package manager** lets you install, update, and manage third-party packages. Popular package managers: [npm](https://www.npmjs.com/) (built into Node.js), [Yarn](https://yarnpkg.com/), [pnpm.](https://pnpm.io/)
* A **compiler** lets you compile modern language features and additional syntax like JSX or type annotations for the browsers. Popular compilers: [Babel](https://babeljs.io/), [TypeScript](https://www.typescriptlang.org/), [swc.](https://swc.rs/)
* A **bundler** lets you write modular code and bundle it together into small packages to optimize load time. Popular bundlers: [webpack](https://webpack.js.org/), [Parcel](https://parceljs.org/), [esbuild](https://esbuild.github.io/), [swc.](https://swc.rs/)
* A **minifier** makes your code more compact so that it loads faster. Popular minifiers: [Terser](https://terser.org/), [swc.](https://swc.rs/)
* A **server** handles server requests so that you can render components to HTML. Popular servers: [Express.](https://expressjs.com/)
* A **linter** checks your code for common mistakes. Popular linters: [ESLint.](https://eslint.org/)
* A **test runner** lets you run tests against your code. Popular test runners: [Jest.](https://jestjs.io/)

If you prefer to set up your own JavaScript toolchain from scratch, [check out this guide](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658) that re-creates some of the Create React App functionality. A framework will usually also provide a routing and a data fetching solution. In a larger project, you might also want to manage multiple packages in a single repository with a tool like [Nx](https://nx.dev/react) or [Turborepo.](https://turborepo.org/)
>>>>>>> d1fee87a0f70f82677b29f05f5c5d7101eec9b8d

如果你喜欢从 0 开始搭建自己的 JavaScript 工具链，[请参阅这篇指南](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658)，它重新编写了 Create React App 的功能。一个框架通常也会提供路由和数据获取的解决方案。在一个较大的项目中，你可能还需要用到类似 [Nx](https://nx.dev/react) 或者 [Turborepo](https://turborepo.org/) 这样的工具来管理一个仓库中的多个包。