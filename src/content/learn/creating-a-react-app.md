---
title: 创建一个 React 应用
---

<Intro>

如果你想用 React 构建一个新的应用或网站，我们推荐从一个框架开始。

</Intro>

## 推荐的 React 框架 {/*bleeding-edge-react-frameworks*/}

这些推荐的框架支持你在生产环境中部署和扩展应用所需的所有功能。它们集成了 React 的最新特性，并充分利用了 React 的架构。

<Note>

#### React 框架不需要服务器。 {/*react-frameworks-do-not-require-a-server*/}

本页面中的所有框架都可以创建单页应用。单页应用可以部署到 [CDN](https://developer.mozilla.org/en-US/docs/Glossary/CDN) 或静态托管服务上，而无需服务器。如果你希望启用需要服务器的功能（例如服务器端渲染），你可以在不重写应用的情况下，为个别路由启用这些功能。

</Note>

### Next.js (App Router) {/*nextjs-app-router*/}

**[Next.js's App Router](https://nextjs.org/docs) 是一个 React 框架，充分利用了 React 的架构，支持全栈 React 应用。**

<TerminalBlock>
npx create-next-app@latest
</TerminalBlock>

Next.js 由 [Vercel](https://vercel.com/) 维护。你可以 [将 Next.js 应用部署](https://nextjs.org/docs/app/building-your-application/deploying) 到任何支持 Node.js 或 serverless 的托管平台，或者部署到你自己的服务器。 Next.js 也支持 [静态导出](https://nextjs.org/docs/app/building-your-application/deploying/static-exports) 无需服务器。Vercel 还提供可选的付费云服务。

### React Router (v7) {/*react-router-v7*/}

**[React Router](https://reactrouter.com/start/framework/installation) 是 React 最流行的路由库，可以与 Vite 结合创建一个全栈 React 框架**。它强调标准的 Web APIs 并提供了多个 [可部署的模板](https://github.com/remix-run/react-router-templates) 适用于各种 JavaScript 运行时和平台.

要创建一个新的 React Router 框架项目，请运行:

<TerminalBlock>
npx create-react-router@latest
</TerminalBlock>

React Router 由 [Shopify](https://www.shopify.com) 维护。

### Expo (for native apps) {/*expo*/}

**[Expo](https://expo.dev/) 是一个 React 框架，让你可以创建支持真正原生 UI 的通用 Android、iOS 和 Web 应用。** 它为 [React Native](https://reactnative.dev/) 提供了一个 SDK，让原生部分更易于使用。要创建一个新的 Expo 项目，请运行：

<TerminalBlock>
npx create-expo-app@latest
</TerminalBlock>

如果你是 Expo 新手，请查看 [Expo 教程](https://docs.expo.dev/tutorial/introduction/).

Expo 由 [Expo (the company)](https://expo.dev/about) 维护。使用 Expo 构建应用是免费的，你可以将应用提交到 Google 和 Apple 应用商店，没有任何限制。Expo 还提供可选的付费云服务。


## 其它选项 {/*other-options*/}

还有一些新兴的框架正在努力实现我们的全栈 React 愿景：

- [TanStack Start (Beta)](https://tanstack.com/): TanStack Start 是一个由 TanStack Router 驱动的全栈 React 框架。它使用 Nitro 和 Vite 等工具提供完整的文档服务端渲染、流式传输、服务器函数、打包等功能。
- [RedwoodJS](https://redwoodjs.com/): Redwood 是一个全栈 React 框架，带有许多预装的包和配置，方便构建全栈 Web 应用。

<DeepDive>

#### 哪些特性构成了 React 团队的全栈架构愿景？ {/*which-features-make-up-the-react-teams-full-stack-architecture-vision*/}

Next.js 的 App Router 打包器完全实现了官方的 [React Server Components 规范](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md). 这让你可以在同一个 React 树中混合使用构建时、仅服务器端和交互式组件。

例如，你可以编写一个仅在服务器端运行（或在构建期间运行）的服务器端 React 组件，作为 async 函数从数据库或文件中读取数据。然后，你可以将数据传递给将在浏览器中运行的交互式组件：

```js
// 该组件*仅*在服务器端运行（或在构建期间运行）。
async function Talks({ confId }) {
  // 1. 你在服务器端，因此可以直接与数据层交互。无需 API 端点。
  const talks = await db.Talks.findAll({ confId });

  // 2. 添加任意渲染逻辑。这不会使你的 JavaScript bundle 变大。
  const videos = talks.map(talk => talk.video);

  // 3. 将数据传递给将在浏览器中运行的组件。
  return <SearchableVideoList videos={videos} />;
}
```

Next.js 的 App Router 还集成了 [使用 Suspense 的数据获取](/blog/2022/03/29/react-v18#suspense-in-data-frameworks). 这让你可以直接在 React 树中为用户界面的不同部分指定加载状态（例如骨架占位符）：

```js
<Suspense fallback={<TalksLoading />}>
  <Talks confId={conf.id} />
</Suspense>
```

服务器组件和 Suspense 是 React 的特性，而不是 Next.js 的特性。然而，在框架层面采用它们需要开发者的支持和大量的实现工作。目前，Next.js App Router 是最完整的实现。React 团队正在与打包工具开发者合作，以便在下一代框架中更容易实现这些特性。

</DeepDive>

<Note>


#### 你推荐使用 Vite 吗？ {/*do-you-recommend-vite*/}

我们推荐了一些基于 Vite 的选项。

React Router v7 是一个基于 Vite 的框架，允许你使用 Vite 的快速开发服务器和构建工具，同时提供路由和数据获取功能。与其他推荐的框架一样，你可以用 React Router v7 构建单页应用。

我们也推荐在 [将 React 添加到现有项目中](/learn/add-react-to-an-existing-project), or [构建一个 React 框架](/learn/building-a-react-framework) 时使用 Vite。

就像 Svelte 有 Sveltekit、Vue 有 Nuxt、Solid 有 SolidStart 一样，React 推荐使用集成了 Vite 等构建工具的框架来创建新项目。

</Note>

-----

_如果你是一个框架开发者，希望在本页面被推荐，[请告知我们](https://github.com/reactjs/react.dev/issues/new?assignees=&labels=type%3A+framework&projects=&template=3-framework.yml&title=%5BFramework%5D%3A+)。_
