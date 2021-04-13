---
title: "React v17.0"
author: [gaearon,rachelnabors]
---

今天，我们宣布 React 17 正式发布！在此之前，我们在 [React 17 RC 的博文](/blog/2020/08/10/react-v17-rc.html)中已经介绍了 React 17 发布的意义以及包含的变化。此文是针对那篇文章的简单总结，如果你已阅读过那篇博文，此文可略过。

## 无新特性 {#no-new-features}

React v17 的发布非比寻常，因为它没有增加任何面向开发者的新特性。但是，**这个版本会使得 React 自身的升级变得更加容易**。

值得特别说明地是，React v17 作为后续版本的 ”基石“，它让不同版本的 React 相互嵌套变得更加容易。

除此之外，还会使 React 更容易嵌入到由其他技术构建的应用中。

## 渐进式升级 {#gradual-upgrades}

**React v17 开启了 React 渐进式升级的新篇章**。当你从 React 15 升级至 16 时（或者，从 16 升级到 17），你通常会一次性升级整个应用程序，这对大部分应用来说十分有效。但是，如果代码库编写于几年前，并且没有及时的维护升级，这会使得升级成本越来越高。并且，在 React 17 之前，如果在同一个页面上使用不同的 React 版本（可以这么做，但是有风险），会导致事件问题的出现，会有一些未知的风险。

我们正在修复 React v17 中的许多问题。这意味着，**当 React 18 或未来版本来临时，你将有更多选择**。首选，当然还是一次性升级整个应用；但你还有个可选方案，渐进式升级你的应用。举个例子，你可能将大部分功能升级至 React v18，但保留部分懒加载的对话框或子路由在 React v17。

但这并**不意味着**你必须进行渐进式升级。**对于大多数应用来说，一次性升级仍是更好的选择**。加载两个版本的 React，仍然不是理想方案 —— 即使其中一个版本是按需加载的。但对于那些长期未维护的大型应用来说，这意义非凡，React v17 开始让这些应用不会被轻易淘汰。

我们准备了[示例仓库](https://github.com/reactjs/react-gradual-upgrade-demo/)，此示例演示了如何在必要时懒加载旧版本的 React。此示例由 Create React App 构建，使用其他工具也可以实现同样的效果。欢迎使用其他工具的小伙伴通过 PR 的形式提供 Demo。

>注意
>
>我们**将其他特性**推迟到了 React v17 之后。这个版本的目标就是实现渐进式升级。如果升级到 17 很困难，那就违背了此版本的目的。

## 事件委托的变更 {#changes-to-event-delegation}

为了实现渐进式升级，我们需要对 React 的事件系统进行修改。React 17 是一个重要版本，因为这个版本的可能存在破坏性更改。关于版本的更多信息，请查阅[版本的 FAQ](/docs/faq-versioning.html#breaking-changes)，以了解我们对版本稳定性的承诺。

React v17 中，React 不会再将事件处理添加到 `document` 上，而是将事件处理添加到渲染 React 树的根 DOM 容器中：

```js
const rootNode = document.getElementById('root');
ReactDOM.render(<App />, rootNode);
```

在 React 16 及之前版本中，React 会对大多数事件进行 `document.addEventListener()` 操作。React v17 开始会通过调用 `rootNode.addEventListener()` 来代替。

![此图展示了 React 17 如何将事件连接到根节点而非 document](../images/blog/react-v17-rc/react_17_delegation.png)

经核实，多年来在 [issue](https://github.com/facebook/react/issues/7094) [追踪器](https://github.com/facebook/react/issues/8693) 上[报告](https://github.com/facebook/react/issues/12518)的[许多](https://github.com/facebook/react/issues/13451)[问题](https://github.com/facebook/react/issues/4335)[都](https://github.com/facebook/react/issues/1691)[已](https://github.com/facebook/react/issues/285#issuecomment-253502585)[被](https://github.com/facebook/react/pull/8117)[新特性](https://github.com/facebook/react/issues/11530)[解决](https://github.com/facebook/react/issues/7128)，其中大多与将 React 与非 React 代码集成有关。

如果你在升级时遇到了这方面的问题，[可以看看这个常见的解决方案](/blog/2020/08/10/react-v17-rc.html#fixing-potential-issues)。

## 其他破坏性更改 {#other-breaking-changes}

[React v17 的 RC 博文](/blog/2020/08/10/react-v17-rc.html#other-breaking-changes)描述了关于 React v17 中其他的破坏性更改。

我们在升级 Facebook 项目代码中 10w+ 组件的过程中，只修改了不到 20 个组件，所以**我们猜测大多数应用在升级 v17 时，不会有太大的问题**。如果你遇到任何问题，请[告诉我们](https://github.com/facebook/react/issues)。

## 全新的 JSX 转换 {#new-jsx-transform}

React v17 支持了[全新的 JSX 转换](/blog/2020/09/22/introducing-the-new-jsx-transform.html)。我们还针对 React 16.14.0，React 15.7.0 和 0.14.0 版本做了兼容。请注意，此功能完全可选，并非必须使用。之前的 JSX 转换将会继续维护，并且没有停止支持它的计划。

## React Native {#react-native}

React Native 会有一个单独的发布计划。目前，我们对 React v17 的支持已在 React Native 0.64 中落地。你可以在 React Native 社区的发布 [issue tracker](https://github.com/react-native-community/releases) 上参与讨论。

## 安装 {#installation}

使用 npm 安装 React v17：

```bash
npm install react@17.0.0 react-dom@17.0.0
```

使用 yarn 安装 React v17：

```bash
yarn add react@17.0.0 react-dom@17.0.0
```

我们还提供了由 UMD 构建的 CDN 版本：

```html
<script crossorigin src="https://unpkg.com/react@17.0.0/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@17.0.0/umd/react-dom.production.min.js"></script>
```

请参阅文档中的[详细安装说明](/docs/installation.html)。

## 变更日志 {#changelog}

### React {#react}

* 为全新的 [JSX 转换器](https://babeljs.io/blog/2020/03/16/7.9.0#a-new-jsx-transform-11154-https-githubcom-babel-babel-pull-11154)添加 `react/jsx-runtime` 和 `react/jsx-dev-runtime`。（[@lunaruan](https://github.com/lunaruan) 提交于 [#18299](https://github.com/facebook/react/pull/18299)）
* 根据原生框架构建组件调用栈。（[@sebmarkbage](https://github.com/sebmarkbage) 提交于 [#18561](https://github.com/facebook/react/pull/18561)）
* 可以在 context 中设置 `displayName` 以改善调用栈信息。（[@eps1lon](https://github.com/eps1lon) 提交于 [#18224](https://github.com/facebook/react/pull/18224)）
* 防止 `'use strict'` 从 UMD 的 bundles 中泄露。（[@koba04](https://github.com/koba04) 提交于 [#19614](https://github.com/facebook/react/pull/19614)）
* 停止使用 `fb.me` 进行重定向。（[@cylim](https://github.com/cylim) 提交于 [#19598](https://github.com/facebook/react/pull/19598)）

### React DOM {#react-dom}

* 将事件委托从 `document` 切换为 root。（[@trueadm](https://github.com/trueadm) 提交于 [#18195](https://github.com/facebook/react/pull/18195) 及[其他](https://github.com/facebook/react/pulls?q=is%3Apr+author%3Atrueadm+modern+event+is%3Amerged)）
* 在运行下一个副作用前，请清理所有副作用。（[@bvaughn](https://github.com/bvaughn) 提交于 [#17947](https://github.com/facebook/react/pull/17947)）
* 异步运行 `useEffect` 清理函数。（[@bvaughn](https://github.com/bvaughn) 提交于 [#17925](https://github.com/facebook/react/pull/17925)）
* 使用浏览器的 `focusin` 和 `focusout` 替换 `onFocus` 和 `onBlur` 的底层实现。（[@trueadm](https://github.com/trueadm) 提交于 [#19186](https://github.com/facebook/react/pull/19186)）
* 将所有 `Capture` 事件都使用浏览器的捕获阶段实现。（[@trueadm](https://github.com/trueadm) 提交于 [#19221](https://github.com/facebook/react/pull/19221)）
* 禁止在 `onScroll` 事件时冒泡。（[@gaearon](https://github.com/gaearon) 提交于 [#19464](https://github.com/facebook/react/pull/19464))
* 如果 `forwardRef` 或 `memo` 组件的返回值为 `undefined`，则抛出异常。（[@gaearon](https://github.com/gaearon) 提交于 [#19550](https://github.com/facebook/react/pull/19550)）
* 移除事件池。（[@trueadm](https://github.com/trueadm) 提交于 [#18969](https://github.com/facebook/react/pull/18969)）
* 移除 React Native Web 不需要的内部组件。（[@necolas](https://github.com/necolas) 提交于 [#18483](https://github.com/facebook/react/pull/18483))
* 当挂载 root 时，附加所有已知的事件监听器。（[@gaearon](https://github.com/gaearon) 提交于 [#19659](https://github.com/facebook/react/pull/19659)）
* 在 Dev 模式下，禁用第二次渲染过程中的 `console`。（[@sebmarkbage](https://github.com/sebmarkbage) 提交于 [#18547](https://github.com/facebook/react/pull/18547)）
* 弃用为记录且具有误导性的 `ReactTestUtils.SimulateNative` API。（[@gaearon](https://github.com/gaearon) 提交于 [#13407](https://github.com/facebook/react/pull/13407))
* 重命名内部使用的私有字段（[@gaearon](https://github.com/gaearon) 提交于 [#18377](https://github.com/facebook/react/pull/18377)）
* 不在开发环境调用 User Timing API。（[@gaearon](https://github.com/gaearon) 提交于 [#18417](https://github.com/facebook/react/pull/18417)）
* 在严格模式下重复渲染期间禁用 console。（[@sebmarkbage](https://github.com/sebmarkbage) 提交于 [#18547](https://github.com/facebook/react/pull/18547)）
* 在严格模式下，二次渲染组件也不使用 Hook。（[@eps1lon](https://github.com/eps1lon) 提交于 [#18430](https://github.com/facebook/react/pull/18430)）
* 允许在生命周期函数中调用 `ReactDOM.flushSync`（但会发出警告）。（[@sebmarkbage](https://github.com/sebmarkbage) 提交于 [#18759](https://github.com/facebook/react/pull/18759)）
* 将 `code` 属性添加到键盘事件对象中。（[@bl00mber](https://github.com/bl00mber) 提交于 [#18287](https://github.com/facebook/react/pull/18287)）
* 为 `video` 元素添加 `disableRemotePlayback` 属性。（[@tombrowndev](https://github.com/tombrowndev) 提交于 [#18619](https://github.com/facebook/react/pull/18619)）
* 为 `input` 元素添加 `enterKeyHint` 属性。（[@eps1lon](https://github.com/eps1lon) 提交于 [#18634](https://github.com/facebook/react/pull/18634)）
* 当没有给 `<Context.Provider>` 提供任何值时，会发出警告。（[@charlie1404](https://github.com/charlie1404) 提交于 [#19054](https://github.com/facebook/react/pull/19054)）
* 如果 `forwardRef` 或 `memo` 组件的返回值为 `undefined`，则抛出警告。（[@bvaughn](https://github.com/bvaughn) 提交于 [#19550](https://github.com/facebook/react/pull/19550)）
* 为无效更新改进错误信息。（[@JoviDeCroock](https://github.com/JoviDeCroock) 提交于 [#18316](https://github.com/facebook/react/pull/18316)）
* 从调用栈信息中忽略 forwardRef 和 memo。（[@sebmarkbage](https://github.com/sebmarkbage) 提交于 [#18559](https://github.com/facebook/react/pull/18559)）
* 在受控输入与非受控输入间切换时，改善错误消息。（[@vcarl](https://github.com/vcarl) 提交于 [#17070](https://github.com/facebook/react/pull/17070)）
* 保持 `onTouchStart`、`onTouchMove` 和 `onWheel` 默认为 passive。（[@gaearon](https://github.com/gaearon) 提交于 [#19654](https://github.com/facebook/react/pull/19654)）
* 修复在 development 模式下 iframe 关闭时，`setState` 挂起的问题。（[@gaearon](https://github.com/gaearon) 提交于 [#19220](https://github.com/facebook/react/pull/19220)）
* 使用 `defaultProps` 修复拉架子组件在渲染时的问题。（[@jddxf](https://github.com/jddxf) 提交于 [#18539](https://github.com/facebook/react/pull/18539)）
* 修复当 `dangerouslySetInnerHTML` 为 `undefined` 时，误报警告的问题。（[@eps1lon](https://github.com/eps1lon) 提交于 [#18676](https://github.com/facebook/react/pull/18676)）
* 使用非标准的 `require` 实现来修复 Test Utils。（[@just-boris](https://github.com/just-boris) 提交于 [#18632](https://github.com/facebook/react/pull/18632)）
* 修复 `onBeforeInput` 报告错误的 `event.type`。（[@eps1lon](https://github.com/eps1lon) 提交于 [#19561](https://github.com/facebook/react/pull/19561)）
* 修复 Firefox 中 `event.relatedTarget` 输出为 `undefined` 的问题。（[@claytercek](https://github.com/claytercek) 提交于 [#19607](https://github.com/facebook/react/pull/19607)）
* 修复 IE11 中 "unspecified error" 的问题。（[@hemakshis](https://github.com/hemakshis) 提交于 [#19664](https://github.com/facebook/react/pull/19664)）
* 修复 shadow root 中的渲染问题。（[@Jack-Works](https://github.com/Jack-Works) 提交于 [#15894](https://github.com/facebook/react/pull/15894)）
* 使用事件捕获修复 `movementX/Y` polyfill 的问题。（[@gaearon](https://github.com/gaearon) 提交于 [#19672](https://github.com/facebook/react/pull/19672)）
* 使用委托处理 `onSubmit` 和 `onReset` 事件。（[@gaearon](https://github.com/gaearon) 提交于 [#19333](https://github.com/facebook/react/pull/19333)）
* 提高内存使用率。（[@trueadm](https://github.com/trueadm) 提交于 [#18970](https://github.com/facebook/react/pull/18970)）

### React DOM Server {#react-dom-server}

* 使用服务端渲染的 `useCallback` 与 `useMemo` 一致。（[@alexmckenley](https://github.com/alexmckenley)提交于 [#18783](https://github.com/facebook/react/pull/18783)）
* 修复函数组件抛出异常时状态泄露的问题。（[@pmaccart](https://github.com/pmaccart) 提交于 [#19212](https://github.com/facebook/react/pull/19212)）

### React Test Renderer {#react-test-renderer}

* 改善 `findByType` 错误信息。（[@henryqdineen](https://github.com/henryqdineen) 提交于 [#17439](https://github.com/facebook/react/pull/17439)）

### Concurrent Mode（实验阶段） {#concurrent-mode-experimental}

* 改进启发式更新算法。（[@acdlite](https://github.com/acdlite) 提交于 [#18796](https://github.com/facebook/react/pull/18796)）
* 在实验性 API 前添加 `unstable_` 前缀。 ([@acdlite](https://github.com/acdlite) 提交于 [#18825](https://github.com/facebook/react/pull/18825))
* 移除 `unstable_discreteUpdates` 和 `unstable_flushDiscreteUpdates`。（[@trueadm](https://github.com/trueadm) 提交于 [#18825](https://github.com/facebook/react/pull/18825)）
* 移除了 `timeoutMs` 参数。（[@acdlite](https://github.com/acdlite) 提交于 [#19703](https://github.com/facebook/react/pull/19703)）
* 禁用 `<div hidden />` 预渲染，以支持未来的 API。（[@acdlite](https://github.com/acdlite) 提交于 [#18917](https://github.com/facebook/react/pull/18917)）
* 为 Suspense 添加了 `unstable_expectedLoadTime`，用于 CPU-bound 树。（[@acdlite](https://github.com/acdlite) 提交于 [#19936](https://github.com/facebook/react/pull/19936)）
* 添加了一个实验性的 `unstable_useOpaqueIdentifier` Hook。（[@lunaruan](https://github.com/lunaruan) 提交于 [#17322](https://github.com/facebook/react/pull/17322)）
* 添加了一个实验性的 `unstable_startTransition` API. ([@rickhanlonii](https://github.com/rickhanlonii) 提交于 [#19696](https://github.com/facebook/react/pull/19696))
* 在测试渲染器中使用 `act` 后，不在刷新 Suspense 的 fallback。（[@acdlite](https://github.com/acdlite) 提交于 [#18596](https://github.com/facebook/react/pull/18596)）
* 将全局渲染的 timeout 用于 CPU Suspense。（[@sebmarkbage](https://github.com/sebmarkbage) 提交于 [#19643](https://github.com/facebook/react/pull/19643)）
* 挂载前，清除现有根目录的内容。（[@bvaughn](https://github.com/bvaughn) 提交于 [#18730](https://github.com/facebook/react/pull/18730)）
* 修复带有错误边界的 bug。（[@acdlite](https://github.com/acdlite) 提交于 [#18265](https://github.com/facebook/react/pull/18265)）
* 修复了导致挂起树更新丢失的 bug。（[@acdlite](https://github.com/acdlite) 提交于 [#18384](https://github.com/facebook/react/pull/18384) 以及 [#18457](https://github.com/facebook/react/pull/18457)）
* 修复导致渲染阶段更新丢失的 bug。（[@acdlite](https://github.com/acdlite) 提交于 [#18537](https://github.com/facebook/react/pull/18537)）
* 修复 SuspenseList 的 bug。（[@sebmarkbage](https://github.com/sebmarkbage) 提交于 [#18412](https://github.com/facebook/react/pull/18412)）
* 修复导致 Suspense fallback 过早显示的 bug。（[@acdlite](https://github.com/acdlite) 提交于 [#18411](https://github.com/facebook/react/pull/18411)）
* 修复 SuspenseList 中使用 class 组件异常的 bug。（[@sebmarkbage](https://github.com/sebmarkbage) 提交于 [#18448](https://github.com/facebook/react/pull/18448)）
* 修复输入内容可能被更新被丢弃的 bug。（[@jddxf](https://github.com/jddxf) 提交于 [#18515](https://github.com/facebook/react/pull/18515) 以及 [@acdlite](https://github.com/acdlite) 提交于 [#18535](https://github.com/facebook/react/pull/18535)）
* 修复暂挂 Suspense fallback 后卡住的错误。（[@acdlite](https://github.com/acdlite) 提交于 [#18663](https://github.com/facebook/react/pull/18663)）
* 如果 hydrate 中，不要切断 SuspenseList 的尾部。（[@sebmarkbage](https://github.com/sebmarkbage) 提交于 [#18854](https://github.com/facebook/react/pull/18854)）
* 修复 `useMutableSource` 中的 bug，此 bug 可能在 `getSnapshot` 更改时出现。（[@bvaughn](https://github.com/bvaughn) 提交于 [#18297](https://github.com/facebook/react/pull/18297)）
* 修复 `useMutableSource` 令人恶心的 bug。（[@bvaughn](https://github.com/bvaughn) 提交于 [#18912](https://github.com/facebook/react/pull/18912)）
* 如果外部渲染且提交之前调用 `setState`，会发出警告。（[@sebmarkbage](https://github.com/sebmarkbage) 提交于 [#18838](https://github.com/facebook/react/pull/18838)）
