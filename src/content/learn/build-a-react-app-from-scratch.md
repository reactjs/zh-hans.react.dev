---
title: 从零开始构建 React 应用
---

<Intro>

如果现有框架无法满足你应用的要求，或者你更喜欢自己构建框架，亦或者你只想学习 React 应用程序的基础知识，那么你可以选择从零开始构建 React 应用。

</Intro>

<DeepDive>

#### 考虑使用框架 {/*consider-using-a-framework*/}

从头开始使用 React 是一种简单的入门方式，但需要注意的是，这通常相当于构建自己的临时框架。随着需求的变化，你可能需要解决一些框架相关的问题，而我们推荐的框架已经具备成熟且得到支持的解决方案。

例如，如果将来你的应用需要支持服务器端渲染（SSR）、静态站点生成（SSG）或 React 服务器组件（RSC），你将需要自行实现这些功能。同样，如果你希望使用将来 React 的特性，这些特性需要在框架层面集成，你也必须自行实现。

我们的推荐框架还帮助你构建性能更好的应用。例如，减少或消除网络请求中的瀑布效应可以提升用户体验。在构建小项目时，这可能不是优先考虑的事项，但如果你的应用获得用户，你可能会希望提高其性能。

选择这种方式会使获取支持变得更困难，因为你开发路由、数据获取和其他功能的方式是独特的。只有在你能够独立解决这些问题，或你确信自己永远不需要这些功能时，才应该选择这个选项。

有关推荐框架的列表，请查看 [创建一个 React 应用](/learn/creating-a-react-app)。

</DeepDive>


## 步骤 1: 安装构建工具 {/*step-1-install-a-build-tool*/}

第一步是安装一个构建工具，如 Vite、Parcel 或 rsbuild。这些构建工具提供了打包和运行源代码的功能，提供本地开发的开发服务器，以及部署应用到生产服务器的构建命令。

### Vite {/*vite*/}

[Vite](https://vite.dev/) 是一个构建工具，旨在为现代网络项目提供更快更简洁的开发体验。

<TerminalBlock>
{`npm create vite@latest my-app -- --template react`}
</TerminalBlock>

Vite 采用约定式设计，开箱即提供合理的默认配置。它拥有丰富的插件生态系统，能够支持快速热更新、JSX、Babel/SWC 等常见功能。你可以查看 Vite 的 [React 插件](https://vite.dev/plugins/#vitejs-plugin-react) 或 [React SWC 插件](https://vite.dev/plugins/#vitejs-plugin-react-swc) 和 [React 服务器端渲染示例项目](https://vite.dev/guide/ssr.html#example-projects) 来开始使用。

Vite 已经作为构建工具在我们 [推荐的框架](/learn/creating-a-react-app) 之一 [React Router](https://reactrouter.com/start/framework/installation) 中使用。

### Parcel {/*parcel*/}

[Parcel](https://parceljs.org/) 结合了出色的开箱即用开发体验和可扩展的架构，可以将你的项目从刚开始的阶段推向大规模的生产应用。

<TerminalBlock>
{`npm install --save-dev parcel`}
</TerminalBlock>

Parcel 支持快速刷新、JSX、TypeScript、Flow 和开箱即用的样式。请查看 [Parcel 的 React 教程](https://parceljs.org/recipes/react/#getting-started) 以开始。

### Rsbuild {/*rsbuild*/}

[Rsbuild](https://rsbuild.dev/) 是一个基于 Rspack 的构建工具，旨在为 React 应用程序提供无缝的开发体验。它配备了精心调优的默认设置和现成的性能优化。

<TerminalBlock>
{`npx create-rsbuild --template react`}
</TerminalBlock>

Rsbuild 内置了对 React 特性的支持，如快速刷新、JSX、TypeScript 和样式。请查看 [Rsbuild 的 React 指南](https://rsbuild.dev/zh/guide/framework/react) 以开始使用。

<Note>

#### React Native 的 Metro {/*react-native*/}

如果你从头开始使用 React Native，你将需要使用 [Metro](https://metrobundler.dev/), 这是 React Native 的 JavaScript 打包工具。Metro 支持 iOS 和 Android 等平台的打包，但与这里提到的工具相比，它缺少许多功能。除非你的项目需要 React Native 支持，否则我们建议从 Vite、Parcel 或 Rsbuild 开始。

</Note>

## 步骤 2: 构建常见的应用程序模式 {/*step-2-build-common-application-patterns*/}

上面列出的构建工具从客户端单页应用程序（SPA）开始，但不包括路由、数据获取或样式等常见功能的进一步解决方案。

React 生态系统中包含许多用于解决这些问题的工具。我们列出了一些广泛使用的工具作为起点，但如果其他工具更适合你，欢迎选择使用。

### 路由 {/*routing*/}

路由决定了当用户访问特定 URL 时显示的内容或页面。你需要设置一个路由来将 URL 映射到应用程序的不同部分。你还需要处理嵌套路由、路由参数和查询参数。路由可以在代码中配置，也可以根据组件文件夹和文件结构定义。

路由是现代应用程序的核心部分，通常与数据获取（包括为整个页面预取数据以加快加载速度）、代码拆分（以最小化客户端包的大小）和页面渲染方法（决定每个页面的生成方式）集成在一起。

我们建议使用:

- [React Router](https://reactrouter.com/start/data/custom)
- [Tanstack Router](https://tanstack.com/router/latest)


### 数据获取 {/*data-fetching*/}

从服务器或其他数据源获取数据是大多数应用程序的关键部分。要正确地执行此操作，需要处理加载状态、错误状态以及缓存获取的数据，这可能会很复杂。

专门构建的数据获取库为你完成数据获取和缓存的繁重工作，让你专注于应用程序需要哪些数据以及如何显示这些数据。这些库通常直接在组件中使用，但也可以集成到路由加载器中，以实现更快的预取和更好的性能，并且也可以用于服务器渲染。

请注意，直接在组件中获取数据可能会导致加载时间变慢，因为会出现网络请求瀑布效应，因此我们建议尽可能在路由加载器或服务器上预取数据！这样可以在页面显示时一次性获取页面的数据。

如果你从大多数后端或 REST 风格的 API 获取数据，我们建议使用：

- [React Query](https://react-query.tanstack.com/)
- [SWR](https://swr.vercel.app/)
- [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)

如果你从 GraphQL API 获取数据，我们建议使用：

- [Apollo](https://www.apollographql.com/docs/react)
- [Relay](https://relay.dev/)


### 代码拆分 {/*code-splitting*/}

代码拆分是将应用程序分解为可以按需加载的小型包的过程。随着每个新功能和额外依赖的增加，应用程序的代码体积会增大。应用程序可能会因为需要在使用前发送整个应用程序的所有代码而变得加载缓慢。缓存、减少功能/依赖项以及将部分代码移至服务器运行可以帮助缓解加载缓慢的问题，但如果过度使用，这些都是不完整的解决方案，可能会牺牲功能。

同样，如果你依赖使用框架的应用程序来拆分代码，可能会遇到加载速度比不进行代码拆分时更慢的情况。例如，[懒加载](/reference/react/lazy) 图表会延迟发送渲染图表所需的代码，将图表代码与应用程序的其余部分分开。[Parcel 支持使用 React.lazy 进行代码拆分](https://parceljs.org/recipes/react/#code-splitting)。然而，如果图表在初始渲染后才加载其数据，你就需要等待两次。这就是所谓的瀑布效应：与其同时获取图表的数据和发送渲染代码，你必须等待每个步骤依次完成。

通过路由拆分代码，并与打包和数据获取集成，可以减少应用程序的初始加载时间以及渲染应用程序最大可见内容所需的时间 ([最大内容绘制](https://web.dev/articles/lcp))。

有关代码拆分的说明，请参阅你的构建工具文档:
- [Vite 构建优化](https://vite.dev/guide/features.html#build-optimizations)
- [Parcel 代码拆分](https://parceljs.org/features/code-splitting/)
- [Rsbuild 代码拆分](https://rsbuild.dev/guide/optimization/code-splitting)

### 提高应用程序性能 {/*improving-application-performance*/}

由于你选择的构建工具仅支持单页应用程序（SPA），你需要实现其他 [渲染模式](https://www.patterns.dev/vanilla/rendering-patterns) 如服务器端渲染（SSR）、静态站点生成（SSG）和/或 React 服务器组件（RSC）。即使你一开始不需要这些功能，将来也可能有一些路由会从 SSR、SSG 或 RSC 中受益。

* **单页面应用程序 (SPA)** 加载单个 HTML 页面，并在用户与应用程序交互时动态更新页面。SPA 更容易入门，但初始加载时间可能较慢。SPA 是大多数构建工具的默认架构。

* **流式服务器端渲染 (SSR)** 在服务器上渲染页面并将完全渲染的页面发送到客户端。SSR 可以提高性能，但设置和维护比单页应用程序更复杂。随着流式处理的加入，SSR 的设置和维护可能会变得非常复杂。 请参阅 [Vite 的 SSR 指南]( https://vite.dev/guide/ssr)。

* **静态站点生成 (SSG)** 在构建时为你的应用生成静态 HTML 文件。SSG 可以提高性能，但设置和维护可能比服务器端渲染更复杂。请参阅[Vite 的 SSG 指南](https://vite.dev/guide/ssr.html#pre-rendering-ssg)。

* **React 服务器组件 (RSC)** 允许你在单个 React 树中混合构建时、仅服务器和交互式组件。RSC 可以提高性能，但目前需要深入的专业知识来设置和维护。请参阅 [Parcel 的 RSC 示例](https://github.com/parcel-bundler/rsc-examples)。

你的渲染策略需要与路由集成，以便使用你的框架构建的应用程序可以在每个路由级别选择渲染策略。这将使你能够在不重写整个应用程序的情况下使用不同的渲染策略。例如，你的应用程序的登录页面可能会从静态生成 (SSG) 中受益，而具有内容提要的页面可能在服务器端渲染时表现最佳。

使用合适的渲染策略针对合适的路由可以减少加载第一个内容字节的时间 ([首字节时间](https://web.dev/articles/ttfb))，第一个内容元素渲染的时间 ([首次内容绘制](https://web.dev/articles/fcp))，以及应用程序最大可见内容渲染的时间 ([最大内容绘制](https://web.dev/articles/lcp))。

### 还有... {/*and-more*/}

这些只是新应用在从头开始构建时需要考虑的功能的几个例子。你会遇到的许多限制可能很难解决，因为每个问题都与其他问题相互关联，并且可能需要你不熟悉的领域的深入专业知识。

如果你不想自己解决这些问题, 你可以 [从一个框架开始](/learn/creating-a-react-app)，该框架开箱即用地提供这些功能。
