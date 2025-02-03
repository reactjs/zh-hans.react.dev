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


你可以在没有框架的情况下使用 React，但是我们发现大多数应用程序和网站最终都会构建常见问题的解决方案，例如代码分割、路由、数据获取和生成 HTML。不仅仅是 React，这些问题对于所有 UI 库都很常见。

从框架开始一个项目，你就可以快速使用 React，这样以后也不需要构建自己的框架。

<DeepDive>

#### 我可以在没有框架的情况下使用 React 吗？ {/*can-i-use-react-without-a-framework*/}

你当然可以在没有框架的情况下使用 React——这也就是你将 [使用 React 作为页面的一部分](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page)。**但是，如果你完全使用 React 构建新应用程序或网站，我们建议使用框架。**

原因如下。

即使你一开始不需要路由或数据获取，你也可能需要为它们添加一些库。随着 JavaScript 包随着每个新功能的增加而增长，你可能必须弄清楚如何单独拆分每个路由的代码。随着数据获取需求变得更加复杂，你可能会遇到服务器-客户端网络瀑布，这会让你的应用程序让人感觉非常缓慢。由于你的受众里面有更多网络条件较差和低端设备的用户，你可能需要从组件生成 HTML 以便尽早显示内容（无论是在服务器上还是在构建期间）。更改设定以在服务器上或构建期间运行某些代码可能非常棘手。

**这些问题不是 React 特有的。这就是为什么 Svelte 有 SvelteKit、Vue 有 Nuxt 等等。要自己解决这些问题，需要将打包工具与路由和数据获取的库集成**。让初始设定正常工作并不难，但是要制作一个即使随着时间的推移而增长也能快速加载的应用程序，涉及到很多微妙之处。你需要发送最少量的应用程序代码，在单个客户端-服务器往返中执行此操作，与页面所需的任何数据并行。你可能希望页面在 JavaScript 代码运行之前就具有交互性，以支持渐进增强。你可能希望为你营销页面生成一个包含纯静态 HTML 文件的文件夹，该文件夹可以托管在任何地方，并且在禁用 JavaScript 的情况下仍然可以工作。自己构建这些东西需要付出实际的努力。

此页面上的 React 框架默认解决此类问题，无需进行额外的工作。它们让你能够非常精简地开始，然后根据你的需求扩展应用程序。每个 React 框架都有一个社区，因此寻找问题的答案和升级工具变得更加容易。框架还为你的代码提供结构，帮助你和其他人保留不同项目之间的上下文和技巧。相反，使用自定义设置更容易陷入不受支持的依赖版本，并且你基本上最终会创建自己的框架——但这没有社区支持或升级路径（如果它和我们过去做的一样，设计得比较草率的话）。

如果你的应用程序具有这些框架无法很好地满足的异常约束，或者你更喜欢自己解决这些问题，则可以使用 React 进行自己的自定义设置。从 npm 获取 `react` 和 `react-dom`，使用 [Vite](https://cn.vitejs.dev/) 或 [Parcel](https://parceljs.org/) 等打包工具设置自定义构建流程，并根据需要添加其他工具用于路由、静态内容生成或服务端渲染等。

</DeepDive>

## 生产级的 React 框架 {/*production-grade-react-frameworks*/}

这些框架支持在生产中部署和扩展应用程序所需的所有功能，并致力于支持我们的 [全栈架构愿景](#which-features-make-up-the-react-teams-full-stack-architecture-vision)。我们推荐的所有框架都是开源的，有活跃的社区支持，并且可以部署到你自己的服务器或托管服务提供商。如果你是一位框架作者，有兴趣加入此列表，[请告诉我们](https://github.com/reactjs/react.dev/issues/new?assignees=&labels=type%3A+framework&projects=&template=3-framework.yml&title=%5BFramework%5D%3A+)。

### Next.js {/*nextjs-pages-router*/}

**[Next.js 的页面路由](https://nextjs.org/) 是一个全栈的 React 框架**。它用途广泛，可让你创建任何规模的 React 应用程序——从大部分的静态博客到复杂的动态应用程序。要创建新的 Next.js 项目，请在终端中运行：

<TerminalBlock>
npx create-next-app@latest
</TerminalBlock>

如果你是 Next.js 的新手，请查看 [Next.js 课程](https://nextjs.org/learn)。

Next.js 由 [Vercel](https://vercel.com/) 维护。你可以 [将 Next.js 应用](https://nextjs.org/docs/app/building-your-application/deploying) 部署到 Node.js 或 serverless 上，也可以部署到你自己的服务器上。[完全静态的 Next.js 应用](https://nextjs.org/docs/pages/building-your-application/deploying/static-exports) 可以部署在任何支持静态服务的地方。

### Remix {/*remix*/}

**[Remix](https://remix.run/) 是一个具有嵌套路由的全栈式 React 框架**。它可以把你的应用分成嵌套部分，该嵌套部分可以并行加载数据并响应用户操作进行刷新。要创建一个新的 Remix 项目，请运行：

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

在我们探索如何继续改进 React 的过程中，我们意识到将 React 与框架（特别是路由、bundle 和服务端技术）更紧密地结合起来是我们帮助 React 用户构建更好的应用的最大机会。Next.js 团队已经同意与我们合作，研究、开发、集成和测试与框架无关的 React 前沿功能，如 [React 服务器组件](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)。

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
