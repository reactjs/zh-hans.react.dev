---
title: 启动一个新的 React 项目
translators:
  - watonyweng
  - QC-L
  - ZZZCNY
---

<Intro>

如果你想完全用 React 构建一个新的应用或网站，我们建议选择社区中流行的、由 React 驱动的框架。

</Intro>


你可以在没有框架的情况下使用 React，不过我们发现大多数应用程序和网站最终都会构建解决常见问题的解决方案，例如代码分离、路由、数据获取和生成 HTML。这些问题不仅是 React，而是所有 UI 库都普遍存在的。

通过从框架开始，你可以快速入门 React，并避免以后重头构建自己的框架。

<DeepDive>

#### 我可以不借助框架使用 React 吗？ {/*can-i-use-react-without-a-framework*/}

你绝对可以在没有框架的情况下使用 React——这就是你会 [在页面的一部分中使用 React 的方式](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page)。**然而，如果你正在全面使用 React 构建一个新的应用程序或网站，我们建议使用一个框架**。

原因如下。

即使你起初不需要路由或数据获取，你可能也会想要添加一些库来实现这些功能。随着每个新功能的加入，你的 JavaScript 打包文件会不断增长，你可能需要为每个路由单独分离代码。随着数据获取需求变得越来越复杂，你可能会遇到导致应用程序响应缓慢的服务器/客户端网络瀑布的情况。随着网络条件差和低端设备用户的增加，你可能需要从组件生成 HTML 来尽早显示内容——无论是在服务器上还是在构建时。更改设置以在服务器上运行一些代码或在构建时运行一些代码可能非常棘手。

**这些问题并不特定于 React**。**这就是为什么 Svelte 提供了 SvelteKit，Vue 提供了 Nuxt 等等的原因**。要解决这些问题，你需要将你的打包器与你的路由器和数据获取库集成起来。初始设置并不难，但在随着时间的推移使应用程序快速加载时涉及许多微妙之处。你希望发送最小量的应用程序代码，但要在单个客户端与服务器往返中进行，与页面所需的任何数据并行。你可能希望在 JavaScript 代码运行之前，页面就已经可以进行交互，以支持渐进式增强。你可能希望为营销页面生成一个完全静态 HTML 文件夹，这样可以在任何地方托管，并且在禁用 JavaScript 的情况下仍然可以正常工作。构建这些功能需要真正的工作。

**此页面上的 React 框架默认解决了这些问题，无需额外的任何工作**。它们让你可以从很小的开始，然后根据你的需求扩展你的应用程序。每个 React 框架都有一个社区，因此找到答案和升级工具更容易。框架还为你的代码提供结构，帮助你和其他人在不同项目之间保持上下文和技能。相反，如果使用自定义设置，更容易卡在不受支持的依赖版本上，实际上你最终会创建自己的框架——尽管这个框架没有社区或升级路径（如果像过去我们制作的那样，设计更加随意）。

如果你的应用程序有一些不受这些框架很好服务的异常限制，或者你更喜欢自己解决这些问题，那么你可以使用 React 创建自己的自定义设置。从 npm 获取 `react` 和 `react-dom`，使用像 [Vite](https://vitejs.dev/) 或 [Parcel](https://parceljs.org/) 这样的打包器设置自定义构建过程，并根据需要添加其他工具，如路由、静态生成或服务器端渲染等。

</DeepDive>

## 生产级 React 框架 {/*production-grade-react-frameworks*/}

这些框架支持在生产环境中部署和扩展应用程序所需的所有功能，并致力于支持我们的 [全栈架构愿景](#which-features-make-up-the-react-teams-full-stack-architecture-vision)。我们推荐的所有框架都是开源的，并有积极的社区提供支持，可以部署到自己的服务器或托管提供商上。如果你是一位框架作者，并且有兴趣被包含在这个列表中，请 [联系我们](https://github.com/reactjs/react.dev/issues/new?assignees=&labels=type%3A+framework&projects=&template=3-framework.yml&title=%5BFramework%5D%3A+)。

### Next.js {/*nextjs-pages-router*/}

**[Next.js 的 Page Router](https://nextjs.org/) 是一个全栈 React 框架**。它功能多样，让开发者可以创建任何大小的 React 应用程序--从大部分静态的博客到复杂的动态应用程序。在终端运行以下命令以创建一个新的 Next.js 项目：

<TerminalBlock>
npx create-next-app@latest
</TerminalBlock>

如果你是 Next.js 的新手，请查看 [Next.js 课程](https://nextjs.org/learn)。

Next.js 由 [Vercel](https://vercel.com/) 维护。你可以 [将 Next.js 应用](https://nextjs.org/docs/app/building-your-application/deploying) 部署到 Node.js 或 serverless 上，也可以部署到你自己的服务器上。[完全静态的 Next.js 应用程序](https://nextjs.org/docs/pages/building-your-application/deploying/static-exports) 可以部署在任何支持静态服务的地方。

### Remix {/*remix*/}

**[Remix](https://remix.run/) 是一个具有嵌套路由的全栈式 React 框架**。它可以把你的应用程序分成嵌套部分，该嵌套部分可以并行加载数据并响应用户操作进行刷新。要创建一个新的 Remix 项目，请运行：

<TerminalBlock>
npx create-remix
</TerminalBlock>

如果你是 Remix 的新手，请查看 Remix 的 [博客教程](https://remix.run/docs/en/main/tutorials/blog)（短）和 [应用教程](https://remix.run/docs/en/main/tutorials/jokes)（长）。

Remix 由 [Shopify](https://www.shopify.com/) 维护。当你创建一个 Remix 项目时，你需要 [选择你的部署目标](https://remix.run/docs/en/main/guides/deployment)。你可以通过使用或编写 [适配器](https://remix.run/docs/en/main/other-api/adapter) 将 Remix 应用部署到 Node.js 或 serverless 上进行托管。

### Gatsby {/*gatsby*/}

**[Gatsby](https://www.gatsbyjs.com/) 是一个快速的支持 CMS 的网站的 React 框架**。其丰富的插件生态系统和 GraphQL 数据层简化了将内容、API 和服务整合到一个网站的过程。要创建一个新的 Gatsby 项目，请运行：

<TerminalBlock>
npx create-gatsby
</TerminalBlock>

如果你是 Gatsby 的新手，请查看 [Gatsby 教程](https://www.gatsbyjs.com/docs/tutorial/)。

Gatsby 由 [Netlify](https://www.netlify.com/) 维护。你可以 [部署一个完全静态的 Gatsby 网站](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting) 到任何一个支持静态服务的地方。如果你选择使用服务器上的功能，请确保你的主机供应商支持 Gatsby 的功能。

### Expo（用于原生应用） {/*expo*/}

**[Expo](https://expo.dev/) 是一个 React 框架，可以让你创建具有真正原生 UI 的应用，包括 Android、iOS，以及 Web 应用**。它为 [React Native](https://reactnative.dev/) 提供了 SDK，使原生部分更容易使用。要创建一个新的 Expo 项目，请运行：

<TerminalBlock>
npx create-expo-app
</TerminalBlock>

如果你是 Expo 的新手，请查看 [Expo 教程](https://docs.expo.dev/tutorial/introduction/)。

Expo 是由 [Expo 这家公司](https://expo.dev/about) 维护的。用 Expo 构建应用是免费的，而且你可以不受限制地将它们提交到谷歌和苹果的应用商店。此外，Expo 还提供选择性的付费云服务。

## Bleeding-edge React frameworks {/*bleeding-edge-react-frameworks*/}

在我们探索如何继续改进 React 的过程中，我们意识到将 React 与框架（特别是路由、bundle 和服务端技术）更紧密地结合起来是我们帮助 React 用户构建更好的应用的最大机会。Next.js 团队已经同意与我们合作，研究、开发、集成和测试与框架无关的 React 前沿功能，如 [React 服务器组件](/blog/2023/03/22/react-labs-what-we-have-been-working-march-2023#react-server-components)。

这些功能每天都在接近生产就绪，而且我们一直在与其他 bundler 和框架的开发者讨论整合它们。我们希望在一两年内，这个页面上列出的所有框架都能完全支持这些功能。（如果你是一个框架的作者，有兴趣与我们合作来实验这些功能，请告诉我们！）

### Next.js (App Router) {/*nextjs-app-router*/}

**[Next.js 的 App Router](https://nextjs.org/docs) 是对 Next.js API 的重新设计，旨在实现 React 团队的全栈架构愿景**。它让你在异步组件中获取数据，这些组件甚至能在服务端构建过程中运行。

Next.js 由 [Vercel](https://vercel.com/) 维护。你可以将 [Next.js 应用](https://nextjs.org/docs/app/building-your-application/deploying) 部署到 Node.js 或 serverless 主机上，或部署到你自己的服务器上。Next.js 还支持 [静态导出](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)，不需要服务器。

<DeepDive>

#### 哪些功能构成了 React 团队的全栈架构愿景？ {/*which-features-make-up-the-react-teams-full-stack-architecture-vision*/}

Next.js 的 App Router bundler 完全实现了官方的 [React 服务器组件规范](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md)。这让你可以在一棵 React 树上同时使用 *构建时*、*纯服务端* 和 *交互组件*。

例如，你可以把一个纯服务端的 React 组件写成一个 `async` 函数，从数据库或文件中读取。然后你可以把数据从它那里传递给你的交互组件：

```js
// 这个组件只在服务端运行（或在构建期间）。
async function Talks({ confId }) {
  // 1. 你在服务端，所以你可以和你的数据层对话。不需要 API 端点。
  const talks = await db.Talks.findAll({ confId });

  // 2. 添加任意数量的渲染逻辑。它不会使你的 JavaScript bundle 变大。
  const videos = talks.map(talk => talk.video);

  // 3. 将数据向下传递给将在浏览器中运行的组件。
  return <SearchableVideoList videos={videos} />;
}
```

Next.js 的 App Router 还集成了 [用 Suspense 获取数据的能力](/blog/2022/03/29/react-v18#suspense-in-data-frameworks)。这让你可以直接在 React 树中为用户界面的不同部分指定一个加载状态（像一个骨架占位符）：

```js
<Suspense fallback={<TalksLoading />}>
  <Talks confId={conf.id} />
</Suspense>
```

服务器组件和 Suspense 是 React 的功能，不是由 Next.js 提供的。然而，在框架层面上采用它们需要投入大量的实现工作。目前，Next.js App Router 是最完整的实现。React 团队正在与 bundler 的开发人员合作，使这些功能在下一代框架中更容易实现。

</DeepDive>
