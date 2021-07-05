---
title: "Create React App 2.0: Babel 7, Sass, and More"
author: [timer, gaearon]
---

Create React App 2.0 已于今天发布，通过单个依赖更新即可获得一整年的改进。

虽然 React 本身[不需要任何构建依赖](/docs/create-a-new-react-app.html)，但如果没有快捷的测试运行器、代码压缩工具、模块化工具的情形下，编写复杂的应用程序是非常具有挑战性的。自从第一次发布以来，[Create React App](https://github.com/facebook/create-react-app) 的目标就是帮助你处理构建和测试设置，让你能聚焦于最重要的应用程序代码编写。

它所依赖的许多工具都已经发布了包含新特性和性能改进的新版本：[Babel 7](https://babeljs.io/blog/2018/08/27/7.0.0)、[webpack 4](https://medium.com/webpack/webpack-4-released-today-6cdb994702d4) 以及 [Jest 23](https://jestjs.io/blog/2018/05/29/jest-23-blazing-fast-delightful-testing.html)。 然而，手动更新它们并使它们协同工作，仍然需要很多的工作。 这正是过去几个月来 [Create React App 2.0 贡献者](https://github.com/facebook/create-react-app/graphs/contributors)一直在忙的事情：**使你不需要自行迁移配置和依赖项。**

现在，Create React App 2.0 已经不在是测试版本了，让我们来看看有什么新功能，以及如何尝试使用它!

>注意
>
>不要害怕升级。如果您对当前的功能、性能和可靠性感到满意，可以继续使用当前的版本。当 2.0 版本更稳定的时候，再用于生产环境也是不错的注意。

## 有什么新特性 {#whats-new}

以下是该版本新特性的概要说明：

<<<<<<< HEAD
* 🎉 更多样式选项：你可以使用 [Sass](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#adding-a-sass-stylesheet) 以及 [CSS Modules](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#adding-a-css-modules-stylesheet)。
* 🐠 升级到了 [Babel 7](https://babeljs.io/blog/2018/08/27/7.0.0)，包含了对 [React fragment syntax](/docs/fragments.html#short-syntax) 的支持以及许多 bug 修复。
* 📦 升级到了 [webpack 4](https://medium.com/webpack/webpack-4-released-today-6cdb994702d4)，可以更智能的自动拆分 JS 包。
* 🃏 升级到了 [Jest 23](https://jestjs.io/blog/2018/05/29/jest-23-blazing-fast-delightful-testing.html)，支持以[交互模式](https://jestjs.io/blog/2018/05/29/jest-23-blazing-fast-delightful-testing#interactive-snapshot-mode)查看快照。
* 💄 支持 [PostCSS](https://preset-env.cssdb.org/features#stage-3)，让你可以以最新的 CSS 语法编写兼容老旧浏览器的样式代码。
* 💎 你可以使用 [Apollo](https://github.com/leoasis/graphql-tag.macro#usage)、[Relay Modern](https://github.com/facebook/relay/pull/2171#issuecomment-411459604)、[MDX](https://github.com/facebook/create-react-app/issues/5149#issuecomment-425396995) 以及其他三方的基于 [Babel Macros](https://babeljs.io/blog/2017/09/11/zero-config-with-babel-macros) 的转换器。
* 🌠 你可以[将 SVG 作为组件导入](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#adding-svgs)，并且可以在 JSX 中使用。
* 🐈 你可以尝试使用实验性的 [Yarn Plug'n'Play 模式](https://github.com/yarnpkg/rfcs/pull/101) 来移除 `node_modules`.
* 🕸 你可以在开发模式下[注入你自己的代理实现](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#configuring-the-proxy-manually) 来匹配你的后端 API。
* 🚀 你可以在不破坏构建的情况下使用[为最新版本 Node 编写的包](https://github.com/sindresorhus/ama/issues/446#issuecomment-281014491)。
* ✂️ 可以为现代浏览器，选择构建更小巧的 CSS 包。
* 👷‍♀️ 可选 Service workers ，并且内置支持使用 Google 的 [Workbox](https://developers.google.com/web/tools/workbox/)。
=======
* 🎉 More styling options: you can use [Sass](https://github.com/facebook/create-react-app/blob/main/packages/react-scripts/template/README.md#adding-a-sass-stylesheet) and [CSS Modules](https://github.com/facebook/create-react-app/blob/main/packages/react-scripts/template/README.md#adding-a-css-modules-stylesheet) out of the box.
* 🐠 We updated to [Babel 7](https://babeljs.io/blog/2018/08/27/7.0.0), including support for the [React fragment syntax](/docs/fragments.html#short-syntax) and many bugfixes.
* 📦 We updated to [webpack 4](https://medium.com/webpack/webpack-4-released-today-6cdb994702d4), which automatically splits JS bundles more intelligently.
* 🃏 We updated to [Jest 23](https://jestjs.io/blog/2018/05/29/jest-23-blazing-fast-delightful-testing.html), which includes an [interactive mode](https://jestjs.io/blog/2018/05/29/jest-23-blazing-fast-delightful-testing#interactive-snapshot-mode) for reviewing snapshots.
* 💄 We added [PostCSS](https://preset-env.cssdb.org/features#stage-3) so you can use new CSS features in old browsers.
* 💎 You can use [Apollo](https://github.com/leoasis/graphql-tag.macro#usage), [Relay Modern](https://github.com/facebook/relay/pull/2171#issuecomment-411459604), [MDX](https://github.com/facebook/create-react-app/issues/5149#issuecomment-425396995), and other third-party [Babel Macros](https://babeljs.io/blog/2017/09/11/zero-config-with-babel-macros) transforms.
* 🌠 You can now [import an SVG as a React component](https://facebook.github.io/create-react-app/docs/adding-images-fonts-and-files#adding-svgs), and use it in JSX.
* 🐈 You can try the experimental [Yarn Plug'n'Play mode](https://github.com/yarnpkg/rfcs/pull/101) that removes `node_modules`.
* 🕸 You can now [plug your own proxy implementation](https://github.com/facebook/create-react-app/blob/main/packages/react-scripts/template/README.md#configuring-the-proxy-manually) in development to match your backend API.
* 🚀 You can now use [packages written for latest Node versions](https://github.com/sindresorhus/ama/issues/446#issuecomment-281014491) without breaking the build.
* ✂️ You can now optionally get a smaller CSS bundle if you only plan to target modern browsers.
* 👷‍♀️ Service workers are now opt-in and are built using Google's [Workbox](https://developers.google.com/web/tools/workbox/).
>>>>>>> 0bb0303fb704147452a568472e968993f0729c28

**所有的这些功能都是现成的** -- 为了启用它们，请遵循如下说明。

## 使用 Create React App 2.0 来启动项目 {#starting-a-project-with-create-react-app-20}

你无须做任何更改。从今天开始，当你运行 `create-react-app` 时，它将以 2.0 版本作为默认模板。玩的开心！

由于一些原因，如果你想 **使用 1.x 的模板**，你可以给 `create-react-app` 传递参数 `--scripts-version=react-scripts@1.x`。

## 更新项目到 Create React App 2.0 {#updating-a-project-to-create-react-app-20}

升级一个非弹出模式的项目到 Create React App 2.0 通常是非常直接的。打开 `package.json` 文件，在根节点中，找到 `react-scripts` 的地方。

然后修改版本号为 `2.0.3`：

```js{2}
  // ... 其他依赖项 ...
  "react-scripts": "2.0.3"
```

运行 `npm install`（或者 `yarn`）。 **对许多项目来说，一行改动就可以完成升级。**

<blockquote class="twitter-tweet" data-conversation="none" data-dnt="true"><p lang="en" dir="ltr">正常工作... 谢谢所有的新特性。 👍</p>&mdash; Stephen Haney (@sdothaney) <a href="https://twitter.com/sdothaney/status/1046822703116607490?ref_src=twsrc%5Etfw">October 1, 2018</a></blockquote>

当你开始使用时，还有一些建议给到你。

**当你升级之后第一次运行 `npm start`** 你将会看到一个控制台提示询问你打算要支持的浏览器。请输入 `y` 来选择默认的那一个。你的选择将会被写入到 `package.json`，之后你可以随时修改它们。Create React App 会根据这个信息来为你的现代浏览器提供更小的 CSS 捆绑包，或者为老旧浏览器提供 css polyfill。

<<<<<<< HEAD
**当 `npm start` 在升级之后仍不能完全工作，** [请先仔细检查发布日志中的升级说明](https://github.com/facebook/create-react-app/releases/tag/v2.0.3)。在本次发布中有一些破坏性变更，但它们的影响返回是有限的，它们不需要花几个小时来整理。注意，为了减少垫片的大小，[支持老旧浏览器 (https://github.com/facebook/create-react-app/blob/master/packages/react-app-polyfill/README.md) 当前是**可选功能**。
=======
**If `npm start` still doesn't quite work for you after the upgrade,** [check out the more detailed migration instructions in the release notes](https://github.com/facebook/create-react-app/releases/tag/v2.0.3). There *are* a few breaking changes in this release but the scope of them is limited, so they shouldn't take more than a few hours to sort out. Note that **[support for older browsers](https://github.com/facebook/create-react-app/blob/main/packages/react-app-polyfill/README.md) is now opt-in** to reduce the polyfill size.
>>>>>>> 0bb0303fb704147452a568472e968993f0729c28

**如果你之前选择了弹出配置，现在又想升级，** 一个通用的方案是先回退到你弹出时的版本（以及任何更改配置的后续提交），然后升级，随后视情况把你之后的更改再注入一次。很有可能你扩充的功能当前已经支持了。

>注意
>
>由于 NPM 的 Bug，你可能会在 unsatisfied 的对等依赖中发现警告。建议忽略该警告。据我们所知，目前 Yarn 没有该问题。

## 破坏性变更 {#breaking-changes}

本次发布中的破坏性变更如下：

<<<<<<< HEAD
* 不在支持 Node 6。
* 通过可选的 [独立包](https://github.com/facebook/create-react-app/tree/master/packages/react-app-polyfill) 支持了老旧浏览器(IE 9 ~ IE 11)。
* 使用 `import()` 来实现代码分割更接近规范，一段时候后 `require.ensure()` 将被禁用。
* 默认的 Jest 运行环境包含 jsdom。
* 使用自定义代理模块来代替 `proxy` 对象配置。
* 移除了对于 `.mjs` 的支持。等待周边生态稳定。
* 在产线构建中，会自动剥离 PropTypes 定义。
=======
* Node 6 is no longer supported.
* Support for older browsers (such as IE 9 to IE 11) is now opt-in with a [separate package](https://github.com/facebook/create-react-app/tree/main/packages/react-app-polyfill).
* Code-splitting with `import()` now behaves closer to specification, while `require.ensure()` is disabled.
* The default Jest environment now includes jsdom.
* Support for specifying an object as `proxy` setting was replaced with support for a custom proxy module.
* Support for `.mjs` extension was removed until the ecosystem around it stabilizes.
* PropTypes definitions are automatically stripped out of the production builds.
>>>>>>> 0bb0303fb704147452a568472e968993f0729c28

如果这些变更对你有影响，[2.0.3 发布说明](https://github.com/facebook/create-react-app/releases/tag/v2.0.3) 有更详细的说明。

## 了解更多 {#learn-more}

你可以在[发布说明](https://github.com/facebook/create-react-app/releases/tag/v2.0.3)中找到完整的变更日志。这是一个大的发布，我们可能会遗漏一些事情。请通过[问题跟踪器](https://github.com/facebook/create-react-app/issues/new) 反馈给我们，我们将尽可能的给予帮助。

>注意
>
>如果你使用 2.x 的早期版本，我们提供了 [独立的迁移说明](https://gist.github.com/gaearon/8650d1c70e436e5eff01f396dffc4114)。

## Thanks {#thanks}

如果没有我们优秀的贡献者社区，这个版本是不可能发布的。感谢 [Andreas Cederström](https://github.com/andriijas), [Clement Hoang](https://github.com/clemmy), [Brian Ng](https://github.com/existentialism), [Kent C. Dodds](https://github.com/kentcdodds), [Ade Viankakrisna Fadlil](https://github.com/viankakrisna), [Andrey Sitnik](https://github.com/ai), [Ro Savage](https://github.com/ro-savage), [Fabiano Brito](https://github.com/Fabianopb), [Ian Sutherland](https://github.com/iansu), [Pete Nykänen](https://github.com/petetnt), [Jeffrey Posnick](https://github.com/jeffposnick), [Jack Zhao](https://github.com/bugzpodder), [Tobias Koppers](https://github.com/sokra), [Henry Zhu](https://github.com/hzoo), [Maël Nison](https://github.com/arcanis), [XiaoYan Li](https://github.com/lixiaoyan), [Marko Trebizan](https://github.com/themre), [Marek Suscak](https://github.com/mareksuscak), [Mikhail Osher](https://github.com/miraage)以及其他为该版本提供反馈和测试贡献者。
