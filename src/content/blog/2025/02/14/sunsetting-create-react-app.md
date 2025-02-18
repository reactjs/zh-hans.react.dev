---
title: "停止维护 Create React App"
author: Matt Carroll 和 Ricky Hanlon
date: 2025/02/14
description: 今天，我们不再推荐在新应用中使用 Create React App，并鼓励现有应用迁移到框架。当框架不适合你的项目，或者你更倾向于从构建框架开始时，我们还提供了文档。 
---

2025 年 2 月 14 日，作者：[Matt Carroll](https://twitter.com/mattcarrollcode) 和 [Ricky Hanlon](https://bsky.app/profile/ricky.fm)

---

<Intro>

今天，我们不再推荐在新应用中使用 [Create React App](https://create-react-app.dev/)，并鼓励现有应用迁移到 [框架](/learn/creating-a-react-app)。当框架不适合你的项目，或者你更倾向于从 [构建框架](/learn/building-a-react-framework)开始时，我们还提供了文档。

</Intro>

-----

当我们在 2016 年发布 Create React App 时，还没有一种明确的方式来构建一个新的 React 应用。

要创建一个 React 应用，你必须安装一堆工具，并手动将它们配置在一起，以支持 JSX、代码检查（linting）和热更新（hot reloading）等基本功能。这很难正确的完成，因此 [社区](https://github.com/react-boilerplate/react-boilerplate) 为 [常见的](https://github.com/gaearon/react-hot-boilerplate) [设置](https://github.com/erikras/react-redux-universal-hot-example) [创建] 了(https://github.com/kriasoft/react-starter-kit) [模板代码](https://github.com/petehunt/react-boilerplate)。然而，模板代码很难更新，而且代码碎片化的情况使得 React 难以推出新功能。

Create React App 通过将多个工具整合到一个推荐的配置中，解决了这些问题。这使得应用程序能够以简单的方式升级到新的工具特性，同时也让 React 团队能够将重要的工具变更（如快速刷新支持、React Hook 的 lint 规则）部署给尽可能广泛的用户群体。

这种模式变得非常流行，以至于如今有一整类工具都采用这种方式工作。

## 弃用 Create React App {/*deprecating-create-react-app*/}

尽管 Create React App 可以轻松上手，但仍存在 [一些限制](#limitations-of-create-react-app)，这些限制使得构建高性能的生产应用程序变得困难。原则上，我们可以通过将其逐步发展成一个 [框架](#why-we-recommend-frameworks) 来解决这些问题。

然而，由于 Create React App 目前没有活跃的维护者，并且已经有许多现有的框架能够解决这些问题，我们决定弃用 Create React App。

从今天开始，如果你安装一个新的应用程序，你会看到一个弃用警告：

<ConsoleBlockMulti>
<ConsoleLogLine level="error">

create-react-app is deprecated.
{'\n\n'}
You can find a list of up-to-date React frameworks on react.dev
For more info see: react.dev/link/cra
{'\n\n'}
This error message will only be shown once per install.

</ConsoleLogLine>
</ConsoleBlockMulti>

我们推荐使用框架来 [创建新的 React 应用程序](/learn/creating-a-react-app)。我们推荐的所有框架都支持仅客户端的单页应用（SPA），并且可以在没有服务器的情况下部署到 CDN 或静态托管服务。

对于现有的应用程序，这些指南将帮助你迁移到仅客户端的单页应用（SPA）：

* [Next.js 的 Create React App 迁移指南](https://nextjs.org/docs/app/building-your-application/upgrading/from-create-react-app)
* [React Router 的框架采用指南](https://reactrouter.com/upgrading/component-routes).
* [Expo webpack 到 Expo Router 的迁移指南](https://docs.expo.dev/router/migrate/from-expo-webpack/)

Create React App 将继续以维护模式运行，并且我们已经发布了一个新版本的 Create React App 以支持 React 19。

如果你的应用程序有特殊的限制，或者你更喜欢通过构建自己的框架来解决这些问题，或者你只是想从头学习 React 的工作原理，你可以使用 Vite、Parcel 或 Rsbuild 来定制自己的 React 设置。

为了帮助用户开始使用 Vite、Parcel 或 Rsbuild，我们发布了新的文档，介绍如何 [构建一个框架](/learn/building-a-react-framework)。继续阅读以了解更多关于 [Create React App 的限制](#limitations-of-create-react-app)，以及 [为什么我们推荐使用框架](#why-we-recommend-frameworks)。

<Note>

#### 你推荐 Vite 吗？ {/*do-you-recommend-vite*/}

我们提供了几个基于 Vite 的建议。 

React Router v7 是一个基于 Vite 的框架，它能让你在一个具备路由和数据获取功能的框架中，使用 Vite 快速的开发服务器和构建工具。就像我们推荐的其他框架一样，你可以使用 React Router v7 构建单页应用（SPA）。 

我们也推荐在 [将 React 添加到现有项目](/learn/add-react-to-an-existing-project) 或 [构建框架](/learn/building-a-react-framework) 时使用 Vite。

就像 Svelte 有 SvelteKit、Vue 有 Nuxt、Solid 有 SolidStart 一样，对于新项目，React 建议使用能与 Vite 这类构建工具集成的框架。 

</Note>

## Create React App 的局限性 {/*limitations-of-create-react-app*/}

Create React App 及类似的构建工具使得开始构建 React 应用程序变得非常容易。运行 `npx create-react-app my-app` 后，你会得到一个完全配置好的 React 应用程序，包括开发服务器、代码检查和生产构建。

例如，如果你正在构建一个内部管理工具，你可以从一个落地页开始：

```js
export default function App() {
  return (
    <div>
      <h1>Welcome to the Admin Tool!</h1>
    </div>
  )
}
```

这让你能够立即开始用 React 进行编码，同时可以使用诸如 JSX、默认的代码检查规则，还有一个能在开发和生产环境中运行的打包工具。不过，这种设置缺少构建一个真正的生产应用程序所需的工具。

大多数生产应用程序需要解决诸如路由、数据获取和代码分割等方面的问题。

### 路由 {/*routing*/}

Create React App 并未包含特定的路由解决方案。如果你刚刚开始开发，一种选择是使用 `useState` 来在不同路由间进行切换。但这样做意味着你无法分享应用的链接，每个链接都会指向同一页面，而且随着时间推移，对应用进行架构设计会变得困难。

```js
import {useState} from 'react';

import Home from './Home';
import Dashboard from './Dashboard';

export default function App() {
  // ❌ Routing in state does not create URLs
  const [route, setRoute] = useState('home');
  return (
    <div>
      {route === 'home' && <Home />}
      {route === 'dashboard' && <Dashboard />}
    </div>
  )
}
```

这就是为什么大多数使用 Create React App 的应用会借助像 [React Router](https://reactrouter.com/) 或 [Tanstack Router](https://tanstack.com/router/latest) 这样的路由库来添加路由功能。使用路由库，你可以为应用添加额外的路由，这有助于规划应用的结构，还能让你开始分享指向特定路由的链接。例如，使用 React Router 你可以定义路由：

```js
import {RouterProvider, createBrowserRouter} from 'react-router';

import Home from './Home';
import Dashboard from './Dashboard';

// ✅ Each route has it's own URL
const router = createBrowserRouter([
  {path: '/', element: <Home />},
  {path: '/dashboard', element: <Dashboard />}
]);

export default function App() {
  return (
    <RouterProvider value={router} />
  )
}
```

通过这一改动，你可以分享指向 `/dashboard` 的链接，应用会导航至仪表盘页面。一旦你使用了路由库，就可以添加诸如嵌套路由、路由守卫和路由过渡效果等额外功能，而如果没有路由库，这些功能很难实现。

这里存在一个权衡：路由库会增加应用的复杂性，但它也能带来一些没有它就很难实现的功能。 

### 数据获取 {/*data-fetching*/}

在Create React App中，另一个常见的问题是数据获取。Create React App并未内置特定的数据获取解决方案。一个常见的选择是在 副作用函数(useEffect) 中使用 `fetch` 来加载数据。

但是，这样做意味着数据是在组件渲染之后才获取的，这可能会导致 网络瀑布流问题（network waterfalls）。网络瀑布流问题的产生是因为数据是在应用程序渲染时才开始获取的，而不是在代码下载的同时并行获取数据：

```js
export default function Dashboard() {
  const [data, setData] = useState(null);

  // ❌ Fetching data in a component causes network waterfalls
  useEffect(() => {
    fetch('/api/data')
      .then(response => response.json())
      .then(data => setData(data));
  }, []);

  return (
    <div>
      {data.map(item => <div key={item.id}>{item.name}</div>)}
    </div>
  )
}
```

在 副作用函数（useEffect） 中获取数据意味着用户需要等待更长时间才能看到内容，即使这些数据本可以更早地获取。为了解决这个问题，你可以使用一些数据获取库，例如：[React Query](https://react-query.tanstack.com/)、[SWR](https://swr.vercel.app/)、[Apollo](https://www.apollographql.com/docs/react) 或 [Relay](https://relay.dev/)，这些库提供了预取数据的功能，使得请求可以在组件渲染之前就开始，从而减少用户等待时间并提升性能

这些库在与路由的 "loader" 模式 集成时效果最佳，可以在路由级别指定数据依赖关系，从而使路由器能够优化数据获取：

```js
export async function loader() {
  const response = await fetch(`/api/data`);
  const data = await response.json();
  return data;
}

// ✅ Fetching data in parallel while the code is downloading
export default function Dashboard({loaderData}) {
  return (
    <div>
      {loaderData.map(item => <div key={item.id}>{item.name}</div>)}
    </div>
  )
}
```

在首次加载时，路由器可以在渲染路由之前立即获取数据。当用户在应用中进行导航时，路由器能够同时获取数据和路由，实现并行获取。这减少了用户在屏幕上看到内容所需的时间，并且可以改善用户体验。

然而，这需要在你的应用中正确配置加载器，并且要在性能提升和复杂度增加之间进行权衡。 

### 代码分割 {/*code-splitting*/}

Create React App 中的另一个常见问题是 [代码分割](https://www.patterns.dev/vanilla/bundle-splitting)。Create React App 并未包含特定的代码分割解决方案。如果你刚刚开始开发，你可能根本不会考虑代码分割。

这意味着你的应用会作为一个单一的 bundle 进行发布（部署）。

```txt
- bundle.js    75kb
```

但为了达到理想的性能表现，你应该将代码 “分割” 成多个独立的代码包，这样用户只需下载他们所需要的部分。通过仅下载查看当前页面所需的代码，就能减少用户加载应用的等待时间。 

```txt
- core.js      25kb
- home.js      25kb
- dashboard.js 25kb
```

实现代码分割的一种方法是使用 `React.lazy`。不过，这意味着代码要到组件渲染时才会被获取，这可能会导致网络瀑布效应。更优的解决方案是利用路由器的一项功能，在代码下载的同时并行获取代码。例如，React Router 提供了一个 `lazy` 选项，用于指定某个路由应进行代码分割，并对其加载时机进行优化：

```js
import Home from './Home';
import Dashboard from './Dashboard';

// ✅ Routes are downloaded before rendering
const router = createBrowserRouter([
  {path: '/', lazy: () => import('./Home')},
  {path: '/dashboard', lazy: () => import('Dashboard')}
]);
```

优化代码分割很难做到恰到好处，而且很容易犯错，导致用户下载的代码超出实际所需。当代码分割与路由和数据加载解决方案集成时，效果最佳，这样可以最大限度地利用缓存、并行获取数据，并支持 ["交互时导入"](https://www.patterns.dev/vanilla/import-on-interaction) 模式。

### 更多内容… {/*and-more*/}

这些只是 Create React App 的一些限制示例。

一旦你集成了路由、数据获取和代码分割，你现在还需要考虑挂起状态、导航中断、向用户显示错误信息以及数据的重新验证。用户需要解决一系列问题，例如：

<div style={{display: 'flex', width: '100%', justifyContent: 'space-around'}}>
  <ul>
    <li>无障碍设施</li>
    <li>资源加载</li>
    <li>验证</li>
    <li>缓存</li>
  </ul>
  <ul>
    <li>错误处理</li>
    <li>数据变更</li>
    <li>导航</li>
    <li>乐观更新</li>
  </ul>
  <ul>
    <li>渐进增强</li>
    <li>服务器端渲染</li>
    <li>静态站点生成</li>
    <li>流媒体</li>
  </ul>
</div>

所有这些（因素/元素/部分等，需结合前文确定）共同作用，以打造出最理想的 [加载顺序](https://www.patterns.dev/vanilla/loading-sequence)。

在 Create React App 中逐个解决这些问题可能颇具难度，因为每个问题都相互关联，而且解决这些问题可能需要用户深入掌握他们或许并不熟悉的领域的专业知识。为了解决这些问题，用户最终会在 Create React App 的基础上构建自己的定制化解决方案，而这恰恰是 Create React App 最初试图解决的问题。 

## 为什么我们推荐框架 {/*why-we-recommend-frameworks*/}

虽然你可以自己使用 Create React App、Vite 或 Parcel 等构建工具解决所有这些问题，但要做好却并非易事。就像 Create React App 本身将多个构建工具集成在一起一样，你需要一个工具将所有这些功能集成在一起，以便为用户提供最佳体验。

这类能够集成构建工具、渲染、路由、数据获取和代码分割等功能的工具被称作 “框架”。或者，如果你倾向于将 React 本身视为一个框架，那么你可以把它们称为 “元框架”。

框架会对应用的架构设计提出一些规范建议，目的是为用户带来更好的体验，这就如同构建工具会给出一些规范建议以使工具的使用更加便捷一样。这就是我们开始为新项目推荐像 [Next.js](https://nextjs.org/)、[React Router](https://reactrouter.com/) 和 [Expo](https://expo.dev/) 这类框架的原因。

框架提供了与Create React App相同的入门体验，但同时也为用户在实际生产应用中必须解决的问题提供了解决方案。

<DeepDive>

#### 服务器端渲染是可选的 {/*server-rendering-is-optional*/}

我们推荐的框架都提供了创建 [客户端渲染（CSR）](https://developer.mozilla.org/en-US/docs/Glossary/CSR) 应用的选项。

在某些情况下，客户端渲染（CSR）对于某个页面来说是正确的选择，但很多时候并非如此。即使你的应用大部分采用客户端渲染，通常也会有一些单独的页面能够从服务器端渲染特性中获益，比如 [静态网站生成（SSG）](https://developer.mozilla.org/en-US/docs/Glossary/SSG) 或 [服务器端渲染（SSR）](https://developer.mozilla.org/en-US/docs/Glossary/SSR)，例如服务条款页面或文档页面。

服务器渲染通常会向客户端发送更少的JavaScript代码，并生成一个完整的HTML文档，这通过减少 [总阻塞时间（TBT）](https://web.dev/articles/tbt) 来提高 [首次内容绘制（FCP）](https://web.dev/articles/fcp) 的速度，同时也可能降低 [下一次绘制的交互时间（INP）](https://web.dev/articles/inp)。这就是为什么 [Chrome 团队鼓励](https://web.dev/articles/rendering-on-the-web) 开发者考虑使用静态或服务器端渲染，而不是完全的客户端渲染方法，以实现最佳性能。

使用服务器渲染存在一定的权衡，它并不总是每个页面的最佳选择。在服务器上生成页面会产生额外的成本，并且需要时间来完成，这可能会增加 [首字节时间（TTFB）](https://web.dev/articles/ttfb)。性能最佳的应用程序能够根据每种策略的权衡，在逐页的基础上选择正确的渲染策略。

框架提供了在任何页面上使用服务器的选项，但并不会强制你使用服务器。这允许你为应用程序中的每个页面选择最合适的渲染策略。

#### 关于服务器组件 {/*server-components*/}

我们推荐的框架还支持 React 服务器组件。

服务器组件通过将路由和数据获取操作移至服务器端来帮助解决这些问题。它允许基于渲染的数据（而非仅仅基于所渲染的路由）对客户端组件进行代码分割，并且减少发送的 JavaScript 代码量，以实现尽可能理想的 [加载顺序](https://www.patterns.dev/vanilla/loading-sequence)。

服务器组件并不一定需要实时运行的服务器支持。它们既可以在持续集成（CI）服务器的构建阶段运行，以创建一个静态网站生成（SSG）应用；也可以在 Web 服务器的运行时阶段使用，从而实现服务器端渲染（SSR）应用。

有关更多信息，请参阅 [介绍零捆绑包大小的 React 服务器组件](/blog/2020/12/21/data-fetching-with-react-server-components) 和 [相关文档](/reference/rsc/server-components)。

</DeepDive>

<Note>

#### 服务器渲染不仅仅用于 SEO {/*server-rendering-is-not-just-for-seo*/}

一个常见的误解是，服务器端渲染仅仅是为了 [SEO](https://developer.mozilla.org/en-US/docs/Glossary/SEO)。

虽然服务器端渲染可以提升搜索引擎优化效果，但它还能通过减少用户在看到屏幕上的内容之前需要下载和解析的 JavaScript 代码量来提高性能。 

这就是为什么 Chrome 团队 [has encouraged](https://web.dev/articles/rendering-on-the-web) 开发者考虑采用静态渲染或服务器端渲染，而非完全的客户端渲染方式，以实现尽可能最佳的性能。

</Note>

---

感谢 [Dan Abramov](https://bsky.app/profile/danabra.mov) 创建了 Create React App，也感谢 [Joe Haddad](https://github.com/Timer)、 [Ian Schmitz](https://github.com/ianschmitz)、 [Brody McKee](https://github.com/mrmckeb) 以及 [其他众多贡献者](https://github.com/facebook/create-react-app/graphs/contributors) 多年来对 Create React App 的维护。感谢 [Brooks Lybrand](https://bsky.app/profile/brookslybrand.bsky.social)、[Dan Abramov](https://bsky.app/profile/danabra.mov)、[Devon Govett](https://bsky.app/profile/devongovett.bsky.social)、[Eli White](https://x.com/Eli_White)、[Jack Herrington](https://bsky.app/profile/jherr.dev)、[Joe Savona](https://x.com/en_JS)、[Lauren Tan](https://bsky.app/profile/no.lol)、[Lee Robinson](https://x.com/leeerob)、[Mark Erikson](https://bsky.app/profile/acemarke.dev)、[Ryan Florence](https://x.com/ryanflorence)、[Sophie Alpert](https://bsky.app/profile/sophiebits.com)、[Tanner Linsley](https://bsky.app/profile/tannerlinsley.com) 和 [Theo Browne](https://x.com/theo) 对这篇文章进行审阅并提供反馈。
