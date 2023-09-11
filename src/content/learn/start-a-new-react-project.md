---
title: 启动一个新的 React 项目
translators:
  - watonyweng
  - QC-L
  - ZZZCNY
---

<Intro>

如果你想完全用 React 构建一个新的应用或网站，我们建议选择社区中流行的、由 React 驱动的框架。这些框架提供大多数应用和网站最终需要的功能，包括路由、数据获取和生成 HTML。

</Intro>

<Note>

**你需要安装 [Node.js](https://nodejs.org/zh-cn) 用于本地开发**。你也可以选择在生产环境中使用 Node.js，但你不一定要这样。许多 React 框架支持导出 HTML/CSS/JS 等静态文件。

</Note>

## 生产级的 React 框架 {/*production-grade-react-frameworks*/}

### Next.js {/*nextjs*/}

**[Next.js](https://nextjs.org/) 是一个全栈式的 React 框架**。它用途广泛，可以让你创建任意规模的 React 应用——可以是静态博客，也可以是复杂的动态应用。要创建一个新的 Next.js 项目，请在你的终端运行：

<TerminalBlock>
npx create-next-app
</TerminalBlock>

如果你是 Next.js 的新手，请查看 [Next.js 教程](https://nextjs.org/learn/foundations/about-nextjs)。

Next.js 由 [Vercel](https://vercel.com/) 维护。你可以 [将 Next.js 应用](https://nextjs.org/docs/deployment) 部署到 Node.js 或 serverless 上，也可以部署到你自己的服务器上。[完全静态的 Next.js 应用](https://nextjs.org/docs/advanced-features/static-html-export) 可以部署在任何支持静态服务的地方。

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

<DeepDive>

#### 我可以在没有框架的情况下使用 React 吗？ {/*can-i-use-react-without-a-framework*/}

你当然可以在没有框架的情况下使用 React——这就是 [将 React 用于你页面的一部分](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page)。**但是，如果你要用 React 构建一个新的应用或网站，我们建议使用一个框架**。

这里是一些原因。

即使你一开始不需要路由或数据获取，你也可能想为它们添加一些库。随着你的 JavaScript 包随着每一个新功能的出现而增长，你可能要弄清楚如何为每一个路由单独拆分代码。随着你的数据获取需求越来越复杂，你很可能会遇到服务器-客户端的网络瀑布，使你的应用感觉非常慢。当你的受众包括更多网络条件差和低端设备的用户时，你可能需要从你的组件中生成 HTML 来提前显示内容——要么在服务器上，要么在构建时间内。改变你的设置以在服务端或在构建时中运行你的一些代码是非常棘手的。

**这些问题不是 React 特有的。这就是为什么 Svelte 有 SvelteKit、Vue 有 Nuxt 等等**。要自己解决这些问题，你需要将你的 bundler 与路由和数据获取库集成起来。在一开始这些配置工作并不难，但随着时间的推移，要使一个应用快速加载，还涉及很多微妙的问题。你需要尽可能减少应用程序代码的大小，并在单个客户端-服务器往返中同时发送页面所需的所有数据。甚至你可能希望在你的 JavaScript 代码运行之前，页面就已经可以交互，也就是支持渐进式增强。你可能想为你的营销页面生成一个完全静态的 HTML 文件夹，可以在任何地方托管，并且在禁用 JavaScript 的情况下仍然可以使用。自己构建这些功能需要付出实际的努力。

**本页面上的 React 框架默认解决了这些问题，不需要你做额外的工作**。它们让你可以从非常简洁的框架开始，根据需求扩展应用。每个 React 框架都有社区，可以比较容易地找到问题的答案和升级工具的方法。框架还为你的代码提供了基础结构，帮助你和其他人在不同的项目之间保持统一的开发环境和技术。相反，如果是自己配置，则更容易卡在已经不受支持的依赖版本上，而且你最终会创建一个没有社区和升级路径的框架（如果你创建的框架与我们以前创建的框架类似，那么它可能也存在设计上的不完善之处）。

如果你仍然不相信，或者你的应用有不寻常的限制，而这些框架不能很好地满足你的要求，你想推出你自己的自定义设置，我们不能阻止你——去做吧！从 npm 抓取 `react` 和 `react-dom`，用 [Vite](https://vitejs.dev/) 或 [Parcel](https://parceljs.org/) 等 bundler 设置你的自定义构建过程，并根据你的需要添加其他工具，用于路由、静态生成或服务器端渲染等等。
</DeepDive>

## 领先的 React 框架 {/*bleeding-edge-react-frameworks*/}

在我们探索如何继续改进 React 的过程中，我们意识到将 React 与框架（特别是路由、bundle 和服务端技术）更紧密地结合起来是我们帮助 React 用户构建更好的应用的最大机会。Next.js 团队已经同意与我们合作，研究、开发、集成和测试与框架无关的 React 前沿功能，如 [React 服务器组件](/blog/2023/03/22/react-labs-what-we-have-been-working-march-2023#react-server-components)。

这些功能每天都在接近生产就绪，而且我们一直在与其他 bundler 和框架的开发者讨论整合它们。我们希望在一两年内，这个页面上列出的所有框架都能完全支持这些功能。（如果你是一个框架的作者，有兴趣与我们合作来实验这些功能，请告诉我们！）

### Next.js (App Router) {/*nextjs-app-router*/}

**[Next.js 的 App Router](https://beta.nextjs.org/docs/getting-started) 是对 Next.js API 的重新设计，旨在实现 React 团队的全栈架构愿景**。它让你在异步组件中获取数据，这些组件甚至能在服务端构建过程中运行。

Next.js 由 [Vercel](https://vercel.com/) 维护。你可以将 [Next.js 应用](https://nextjs.org/docs/deployment) 部署到 Node.js 或 serverless 主机上，或部署到你自己的服务器上。Next.js 还支持 [静态导出](https://beta.nextjs.org/docs/configuring/static-export)，不需要服务器。
<Pitfall>

Next.js 的 App Router 目前处于 **测试阶段，还不建议用于生产环境**（截止到 2023 年 3 月）。要在现有的 Next.js 项目进行实验，[参见逐步迁移指南](https://beta.nextjs.org/docs/upgrade-guide#migrating-from-pages-to-app)。

</Pitfall>

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
