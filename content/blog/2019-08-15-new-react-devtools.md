---
title: "全新的 React DevTools 简介"
author: [bvaughn]
---
我们激动地宣布 React 开发者工具发布了新版本，目前可以在 Chrome，Firefox 以及 （Chromium）Edge 中使用！

## 有哪些变化？ {#whats-changed}

React DevTools v4 中发生了很多变化！
站在高角度来看，此版本应该可以提供显著的性能提升以及得以改进的导航体验。
它还对 React Hook 进行了全面地支持，包括检查嵌套对象。

![DevTools version 4 screenshot](../images/blog/devtools-v4-screenshot.png)

<<<<<<< HEAD
[访问互动教程](https://react-devtools-tutorial.now.sh/)试用新版本或 [参阅 changelog](https://github.com/facebook/react/blob/master/packages/react-devtools/CHANGELOG.md#400-august-15-2019)，以了解相关演示视频及更多信息。
=======
[Visit the interactive tutorial](https://react-devtools-tutorial.now.sh/) to try out the new version or [see the changelog](https://github.com/facebook/react/blob/main/packages/react-devtools/CHANGELOG.md#400-august-15-2019) for demo videos and more details.
>>>>>>> 0bb0303fb704147452a568472e968993f0729c28

## 支持哪些版本的 React？{#which-versions-of-react-are-supported}

**`react-dom`**

* `0`-`14.x`：不支持
* `15.x`：支持（新的组件过滤特性除外）
* `16.x`：支持

**`react-native`**
* `0`-`0.61.x`：不支持
* `0.62`：将得到支持 （当 0.62 版本发布时）

## 如何获取最新的 DevTools {#how-do-i-get-the-new-devtools}

React DevTools 可作为 [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) 和 [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/) 的扩展程序。如果你已安装了此扩展程序，则会在接下来的几小时内自动更新。

如果你使用了独立的 shell （例如：在 ReactNative 或 Safari 中），则可以通过 [NPM](https://www.npmjs.com/package/react-devtools) 安装新版本：

```shell
npm install -g react-devtools@^4
```

## 所有 DOM 元素去了哪里？ {#where-did-all-of-the-dom-elements-go}

新的 DevTools 提供了一种在树中过滤组件的方法，以便更轻松地展示嵌套的层次结构。
宿主节点（例如：HTML `<div>`，React Native `<View>`）默认**隐藏**，但可以禁用此过滤器：

![DevTools component filters](../images/blog/devtools-component-filters.gif)

## 如何恢复旧版本？ {#how-do-i-get-the-old-version-back}

如果你使用的是 React Native v0.60（或更早版本），则可以通过 NPM 安装旧版本的 DevTools：

```shell
npm install --dev react-devtools@^3
```

对于旧版本的 React DOM（v0.14 或更早版本），你需要通过源代码的方式构建此扩展程序：

```shell
# Checkout the extension source
git clone https://github.com/facebook/react-devtools

cd react-devtools

# Checkout the previous release branch
git checkout v3

# Install dependencies and build the unpacked extension
yarn install
yarn build:extension

# Follow the on-screen instructions to complete installation
```

## 致谢！{#thank-you}

我们要感谢所有测试 DevTools v4 早期版本的小伙伴。
你的反馈将有助于显著改善此早期版本

我们仍然计划了许多令人兴奋的特性，欢迎提出建议！
如有疑问，请开启 [GitHub issue](https://github.com/facebook/react/issues/new?labels=Component:%20Developer%20Tools) 或者直接在 [Twitter 上 @reactjs ](https://twitter.com/reactjs)。
