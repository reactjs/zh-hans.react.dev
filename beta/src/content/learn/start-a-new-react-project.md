---
title: 启动一个新的 React 项目
translators:
  - watonyweng
  - QC-L
---

<Intro>

<<<<<<< HEAD
如果你打算启动一个新项目，我们建议使用工具链或框架。这些工具提供了非常舒适的开发环境，但前提是需要在本地安装 Node.js。
=======
If you want to build a new app or a new website fully with React, we recommend picking one of the React-powered frameworks popular in the community. Frameworks provide features that most apps and sites eventually need, including routing, data fetching, and generating HTML.
>>>>>>> dc1f7768c594d56eb0020348915ae409bb1b21ea

</Intro>

<Note>

<<<<<<< HEAD
* 工具链与框架有何不同
* 如何用极简的工具链启动一个项目
* 如何用功能齐全的框架启动一个项目
* 流行的工具链和框架有哪些
=======
**You need to install [Node.js](https://nodejs.org/en/) for local development.** You can *also* choose to use Node.js in production, but you don't have to. Many React frameworks support export to a static HTML/CSS/JS folder.
>>>>>>> dc1f7768c594d56eb0020348915ae409bb1b21ea

</Note>

<<<<<<< HEAD
## 选择适合你的方案 {/*choose-your-own-adventure*/}

React 是一个库，可以让你通过将 UI 代码分解成一个个组件的方式来组织它。但 React 并不负责路由或者数据管理。这意味着有几种方案来启动一个 React 新项目：

* 从 [**HTML 文件和 script 标签开始**](/learn/add-react-to-a-website)。这种方案无需 Node.js 配置，但提供的功能有限。
* 从一款 **极简的工具链** 开始，可以在你的项目中加入更多的功能。（非常适合学习入门！）
* 从一款 **功能齐全的框架** 开始，它内置了数据获取以及路由等常见功能。

## 快速入门极简工具链 {/*getting-started-with-a-minimal-toolchain*/}

如果你正在 **学习 React**，我们推荐使用 [Create React App](https://create-react-app.dev/)。它是尝试 React 以及创建单页客户端应用的最流行方案。它是为 React 量身打造的，但缺点是不支持路由以及数据获取。

首先，你需要安装 [Node.js](https://nodejs.org/en/)。接着打开你的终端，并运行这行命令来创建一个新项目：
=======
## Production-grade React frameworks {/*production-grade-react-frameworks*/}

### Next.js {/*nextjs*/}

**[Next.js](https://nextjs.org/) is a full-stack React framework.** It's versatile and lets you create React apps of any size--from a mostly static blog to a complex dynamic application. To create a new Next.js project, run in your terminal:
>>>>>>> dc1f7768c594d56eb0020348915ae409bb1b21ea

<TerminalBlock>
npx create-next-app
</TerminalBlock>

<<<<<<< HEAD
现在可以通过以下方式运行你的应用：
=======
If you're new to Next.js, check out the [Next.js tutorial.](https://nextjs.org/learn/foundations/about-nextjs)

Next.js is maintained by [Vercel](https://vercel.com/). You can [deploy a Next.js app](https://nextjs.org/docs/deployment) to any Node.js or serverless hosting, or to your own server. [Fully static Next.js apps](https://nextjs.org/docs/advanced-features/static-html-export) can be deployed to any static hosting.

### Remix {/*remix*/}

**[Remix](https://remix.run/) is a full-stack React framework with nested routing.** It lets you break your app into nested parts that can load data in parallel and refresh in response to the user actions. To create a new Remix project, run:
>>>>>>> dc1f7768c594d56eb0020348915ae409bb1b21ea

<TerminalBlock>
npx create-remix
</TerminalBlock>

<<<<<<< HEAD
想了解更多信息，请 [查阅官方指南](https://create-react-app.dev/docs/getting-started)。

> Create React App 不处理任何后端逻辑或数据库。你可以把它与任何后端搭配使用。当你创建一个项目时，你会得到一个包含静态 HTML、CSS 和 JS 的文件夹。因为 Create React App 不能利用服务器优势，它不能提供最好的性能。如果你正在寻找更快的加载时间，以及完善的内置功能，如路由和服务端处理逻辑，我们推荐你使用框架代替。

### 主流备选方案 {/*popular-alternatives*/}
=======
If you're new to Remix, check out the Remix [blog tutorial](https://remix.run/docs/en/main/tutorials/blog) (short) and [app tutorial](https://remix.run/docs/en/main/tutorials/jokes) (long).

Remix is maintained by [Shopify](https://www.shopify.com/). When you create a Remix project, you need to [pick your deployment target](https://remix.run/docs/en/main/guides/deployment). You can deploy a Remix app to any Node.js or serverless hosting by using or writing an [adapter](https://remix.run/docs/en/main/other-api/adapter).

### Gatsby {/*gatsby*/}
>>>>>>> dc1f7768c594d56eb0020348915ae409bb1b21ea

**[Gatsby](https://www.gatsbyjs.com/) is a React framework for fast CMS-backed websites.** Its rich plugin ecosystem and its GraphQL data layer simplify integrating content, APIs, and services into one website. To create a new Gatsby project, run:

<<<<<<< HEAD
## 使用开箱即用的框架来构建 {/*building-with-a-full-featured-framework*/}

如果你想 **启动一个用于生产的项目**，[Next.js](https://nextjs.org/) 是你的首选。Next.js 是一款流行且轻量级的框架，用于使用 React 来构建静态和服务端渲染程序。它内置了路由、样式和服务端渲染等功能，可以快速启动和运行你的项目。

[Next.js 基础教程](https://nextjs.org/learn/foundations/about-nextjs) 是对使用 React 和 Next.js 进行构建的一个完美诠释。

### 主流备选方案 {/*framework-popular-alternatives*/}
=======
<TerminalBlock>
npx create-gatsby
</TerminalBlock>

If you're new to Gatsby, check out the [Gatsby tutorial.](https://www.gatsbyjs.com/docs/tutorial/)

Gatsby is maintained by [Netlify](https://www.netlify.com/). You can [deploy a fully static Gatsby site](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting) to any static hosting. If you opt into using server-only features, make sure your hosting provider supports them for Gatsby.

### Expo (for native apps) {/*expo*/}
>>>>>>> dc1f7768c594d56eb0020348915ae409bb1b21ea

**[Expo](https://expo.dev/) is a React framework that lets you create universal Android, iOS, and web apps with truly native UIs.** It provides an SDK for [React Native](https://reactnative.dev/) that makes the native parts easier to use. To create a new Expo project, run:

<<<<<<< HEAD
## 自定义工具链 {/*custom-toolchains*/}

你可能喜欢创建和配置你自己的工具链，一个工具链通常由以下部分组成：

* 一款 **包管理器（package manager）** 可以让你安装、更新并管理第三方软件包。主流的包管理器有：[npm](https://www.npmjs.com/)（内置于 Node.js 中），[Yarn](https://yarnpkg.com/)，[pnpm](https://pnpm.io/)。
* 一款 **编译器（compiler）** 可以让你编译现代语法特性和额外语法特性，如 JSX 或浏览器的类型注释。主流的编译器有：[Babel](https://babeljs.io/)，[TypeScript](https://www.typescriptlang.org/)，[swc](https://swc.rs/)。
* 一款 **捆绑器（bundler）** 可以编写模块化代码并将其进行捆绑到小包中，以优化加载时间。主流的捆绑器有：[webpack](https://webpack.js.org/)，[Parcel](https://parceljs.org/)，[esbuild](https://esbuild.github.io/)，[swc](https://swc.rs/).
* 一款 **压缩工具（minifier）** 可以使你的代码体积更小，从而提高加载速度。主流的压缩工具有：[Terser](https://terser.org/)，[swc](https://swc.rs/)。
* 一款 **服务端框架** 处理服务器请求，以便于将组件渲染成 HTML。主流的服务端框架有：[Express](https://expressjs.com/)。
* 一款 **代码检查工具（linter）** 用于检查你的代码是否包含常见错误。主流的代码检查工具有： [ESLint](https://eslint.org/)。
* 一款 **测试框架（test runner）** 用于对你的代码进行测试。主流测测试框架：[Jest](https://jestjs.io/)。

如果你喜欢从 0 开始搭建自己的 JavaScript 工具链，[请参阅这篇指南](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658)，它重新编写了 Create React App 的功能。一个框架通常也会提供路由和数据获取的解决方案。在一个较大的项目中，你可能还需要用到类似 [Nx](https://nx.dev/react) 或者 [Turborepo](https://turborepo.org/) 这样的工具来管理一个仓库中的多个包。
=======
<TerminalBlock>
npx create-expo-app
</TerminalBlock>

If you're new to Expo, check out the [Expo tutorial](https://docs.expo.dev/tutorial/introduction/).

Expo is maintained by [Expo (the company)](https://expo.dev/about). Building apps with Expo is free, and you can submit them to the App Stores without any restrictions. Expo additionally provides opt-in paid cloud services.


<DeepDive>

#### Can I use React without a framework? {/*can-i-use-react-without-a-framework*/}

You can definitely use React without a framework--that's how you'd [use React for a part of your page.](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page) **However, if you're building a new app or a site fully with React, we recommend using a framework.**

Here's why.

Even if you don't need routing or data fetching at first, you'll likely want to add some libraries for them. As your JavaScript bundle grows with every new feature, you might have to figure out how to split code for every route individually. As your data fetching needs get more complex, you are likely to encounter server-client network waterfalls that make your app feel very slow. As your audience includes more users with poor network conditions and low-end devices, you might need to generate HTML from your components to display content early--either on the server, or during the build time. Changing your setup to run some of your code on the server or during the build can be very tricky.

**These problems are not React-specific. This is why Svelte has SvelteKit, Vue has Nuxt, and so on.** To solve these problems on your own, you'll need to integrate your bundler with your router and with your data fetching library. It's not hard to get an initial setup working, but there are a lot of subtleties involved in making an app that loads quickly even as it grows over time. You'll want to send down the minimal amount of app code but do so in a single client–server roundtrip, in parallel with any data required for the page. You'll likely want the page to be interactive before your JavaScript code even runs, to support progressive enhancement. You may want to generate a folder of fully static HTML files for your marketing pages that can be hosted anywhere and still work with JavaScript disabled. Building these capabilities yourself takes real work.

**React frameworks on this page solve problems like these by default, with no extra work from your side.** They let you start very lean and then scale your app with your needs. Each React framework has a community, so finding answers to questions and upgrading tooling is easier. Frameworks also give structure to your code, helping you and others retain context and skills between different projects. Conversely, with a custom setup it's easier to get stuck on unsupported dependency versions, and you'll essentially end up creating your own framework—albeit one with no community or upgrade path (and if it's anything like the ones we've made in the past, more haphazardly designed).

If you're still not convinced, or your app has unusual constraints not served well by these frameworks and you'd like to roll your own custom setup, we can't stop you--go for it! Grab `react` and `react-dom` from npm, and set up your custom build process with a bundler like [Vite](https://vitejs.dev/) or [Parcel](https://parceljs.org/), and add other tools as you need them for routing, static generation or server-side rendering, and more.
</DeepDive>

## Bleeding-edge React frameworks {/*bleeding-edge-react-frameworks*/}

As we've explored how to continue improving React, we realized that integrating React more closely with frameworks (specifically, with routing, bundling, and server technologies) is our biggest opportunity to help React users build better apps. The Next.js team has agreed to collaborate with us in researching, developing, integrating, and testing framework-agnostic bleeding-edge React features like [React Server Components.](/blog/2020/12/21/data-fetching-with-react-server-components)

These features are getting closer to being production-ready every day, and we've been in talks with other bundler and framework developers about integrating them. Our hope is that in a year or two, all frameworks listed on this page will have full support for these features. (If you're a framework author interested in partnering with us to experiment with these features, please let us know!)

### Next.js (App Router) {/*nextjs-app-router*/}

**[Next.js's App Router](https://beta.nextjs.org/docs/getting-started) is a redesign of the Next.js APIs aiming to fulfill the React team’s full-stack architecture vision.** It lets you fetch data in asynchronous components that run on the server or even during the build.

Next.js is maintained by [Vercel](https://vercel.com/). You can [deploy a Next.js app](https://nextjs.org/docs/deployment) to any Node.js or serverless hosting, or to your own server. Static export is [planned but not yet supported](https://beta.nextjs.org/docs/app-directory-roadmap#configuration) in the Next.js's App Router.

<Pitfall>

Next.js's App Router is **currently in beta and is not yet recommended for production** (as of Mar 2023). To experiment with it in an existing Next.js project, [follow this incremental migration guide](https://beta.nextjs.org/docs/upgrade-guide#migrating-from-pages-to-app).

</Pitfall>

<DeepDive>

#### Which features make up the React team’s full-stack architecture vision? {/*which-features-make-up-the-react-teams-full-stack-architecture-vision*/}

Next.js's App Router bundler fully implements the official [React Server Components specification](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md). This lets you mix build-time, server-only, and interactive components in a single React tree.

For example, you can write a server-only React component as an `async` function that reads from a database or from a file. Then you can pass data down from it to your interactive components:

```js
// This component runs *only* on the server (or during the build).
async function Talks({ confId }) {
  // 1. You're on the server, so you can talk to your data layer. API endpoint not required.
  const talks = await db.Talks.findAll({ confId });

  // 2. Add any amount of rendering logic. It won't make your JavaScript bundle larger.
  const videos = talks.map(talk => talk.video);

  // 3. Pass the data down to the components that will run in the browser.
  return <SearchableVideoList videos={videos} />;
}
```

Next.js's App Router also integrates [data fetching with Suspense](/blog/2022/03/29/react-v18#suspense-in-data-frameworks). This lets you specify a loading state (like a skeleton placeholder) for different parts of your user interface directly in your React tree:

```js
<Suspense fallback={<TalksLoading />}>
  <Talks confId={conf.id} />
</Suspense>
```

Server Components and Suspense are React features rather than Next.js features. However, adopting them at the framework level requires buy-in and non-trivial implementation work. At the moment, the Next.js App Router is the most complete implementation. The React team is working with bundler developers to make these features easier to implement in the next generation of frameworks.

</DeepDive>
>>>>>>> dc1f7768c594d56eb0020348915ae409bb1b21ea
