---
id: design-principles
title: 设计原则
layout: contributing
permalink: docs/design-principles.html
prev: implementation-notes.html
redirect_from:
  - "contributing/design-principles.html"
---

编写该文档的目的是，使开发者更易于了解我们如何决策 React（应该做哪些，不应该做哪些），以及我们的开发理念。我们非常欢迎来自社区的贡献，但如若违背这些理念，实非我们所愿。

>**注意：**
>
>文章描述了 React 自身的设计原则，而非 React 组件或应用，阅读者需要对 React 有深入的理解。
>
>如需 React 的入门文档，查看 [React 哲学](/docs/thinking-in-react.html)。

### 组合 {#composition}

组件之间的组合是 React 的重要特征。不同开发者写的组件应该可以一起正常执行。给一个组件添加功能，而不会对整个代码库造成涟漪似的变化，这对我们很重要。

比如，应该可以在不影响任何使用它的组件的情况下，将一些内部 state 引入该组件。类似的，在必要的情况下可以在任何组件里添加一些初始化和销毁的代码。

在组件中使用 state 或者生命周期函数没什么“不好”。跟所有强大的特性一样，应该适度使用它们，我们并不打算移除他们。相反，我们认为他们是 React 之所以好用的一部分。我们未来也许会启用[更多函数模式](https://github.com/reactjs/react-future/tree/master/07%20-%20Returning%20State)，但内部 state 和生命周期函数都会在里面。

人们常常认为组件“只是函数”，但在我们看来，组件要好用的话，需要的不止这些。在 React 中，组件描述了任何可组合的行为，包含渲染、生命周期和 state。一些类似 [Relay](https://facebook.github.io/relay/) 的外部库给组件带来了其他增强功能，比如描述数据之间的依赖关系。有可能这些做法会以某种形式回到 React 中。

### 共用抽象 {#common-abstraction}

一般而言我们[拒绝添加](https://www.youtube.com/watch?v=4anAwXYqLG8)一些开发者可以实现的特性。我们不想因为无用的库代码使得大家的应用变的累赘，然而也有特例。

比如，如果 React 不支持内部 state 或者生命周期函数，大家会为此创建自己的抽象。当有多种抽象竞争的时候，React 不能强制使用或利用这些抽象中的任何一个。React 必须选择最基本的共同点。

这就是我们增加 React 特性的原因。如果我们发现很多组件以不兼容或者不高效的方式实现了某些特性，我们会倾向在 React 中实现它。我们轻易不这样做，只有我们非常确定提高抽象层级有助于整个生态系统时我们才会这样做。State、生命周期函数、跨浏览器事件的正规化都是很好的范例。

我们总是和社区一起商议这样的优化提议。你可以在 React 问题跟踪的 [“big picture”](https://github.com/facebook/react/issues?q=is:open+is:issue+label:"Type:+Big+Picture") 标签上找到一些这样的讨论。

### 应急方案 {#escape-hatches}

React 是务实的，Facebook 的产品需求驱使它这样。尽管 React 受一些目前还非主流的编程思想比如函数式编程的影响，这个项目的一个明确目标是广泛地接触具有不同技能和经验的开发者。

如果要废弃某个我们不喜欢的模式，我们有责任在废弃之前，考虑所有已知的用例并且教育社区这些模式的[替代做法](/blog/2016/07/13/mixins-considered-harmful.html)。如果某些有助于开发应用的模式很难以声明式的方式表达，我们会提供一个[命令式的 API](/docs/more-about-refs.html)。如果我们发现很多应用中必要的模式我们找不到一个完美的API，我们会[提供一个临时欠佳的 API](/docs/legacy-context.html)，只要以后可以移除它并且方便后续的优化。

### 稳定性 {#stability}

我们重视 API 的稳定性。在 Facebook，我们有超过 5 万多个组件在使用 React。很多其他公司，包括 [Twitter](https://twitter.com/) 和 [Airbnb](https://www.airbnb.com/) 也是 React 的重度用户。这就是我们一般不愿意变更公共 API 或行为的原因。

然而我们认为“没有变更”的这种稳定性被高估了，它很快会演变成停滞不前。我们偏向这样理解稳定性：“在生产环境大规模使用，当需要变更时有一个明确的（自动化更好）迁移路径。”。

当我们废弃一个模式时，我们会研究它在 Facebook 内部的使用情况并添加废弃警告。这样我们可以评估变更的影响范围。有时觉得时机太早了，我们就不作变更。我们需要更策略化的思考来让代码库准备好这样的变更。

如果我们自信地认为这次改动破坏性不是非常大，而且迁移策略对所有用户场景都可行，我们会在开源社区发布废弃警告。我们和很多 Facebook 以外的 React 用户联系紧密，而且我们会监控流行的开源项目并指导他们解决这些废弃警告。

只考虑 Facebook 里的 React 的代码库大小，成功的内部迁移往往是个好兆头：其他公司迁移也不会有困难。然而时不时会有人提出我们没有考虑到的场景，我们会给他们一个紧急出路，或者反思我们的做法。

没有充分的理由我们不会废弃任何特性。我们意识到有时废弃警告会让开发者沮丧，但我们添加废弃警告是因为它们为社区中的很多人认为有价值的优化和新特性扫除了障碍。

例如，我们在 React 15.2.0 中添加了一个[未知 DOM 属性的警告](/warnings/unknown-prop.html)，很多项目因此受到影响。然而修复这些警告非常重要，因为我们可以在 React 中新增支持[自定义属性](https://github.com/facebook/react/issues/140)。以往的每一次废弃警告都有像这样的考量在里面。

我们添加废弃警告时会保留到当前大版本，在[下一次大版本中改变行为](/blog/2016/02/19/new-versioning-scheme.html)。如果这其中设计到大量重复性的人力工作，我们会发布一个[代码更改](https://www.youtube.com/watch?v=d0pOgY8__JM)脚本自动化大部分的改动。Codemods 使我们能够在庞大的代码库中继续前行，我们也推荐大家使用。

你可以在 [react-codemod](https://github.com/reactjs/react-codemod) 仓库中找到我们发布的 codemods。

### 互操作性 {#interoperability}

我们很看重与已有系统的互操作性和渐进式的采用。Facebook 有一个庞大的非 React 的代码库。Facebook 的网站混合使用了名为 XHP 的服务端组件系统、React 之前的内部 UI 库和 React。任何产品团队能够[开始在小功能上使用React](https://www.youtube.com/watch?v=BF58ZJ1ZQxY)而不是重写他们的代码，这对我们很重要。

这就是 React 提供应急方案的原因：让不同的模型协同工作，让不同的 UI 库协同工作。你可以把一个已有的命令式 UI 封装成声明式的组件，反之亦然。这对渐进采用而言至关重要。

### 调度 {#scheduling}

即便你的组件以 function 的方式声明，在 React 中你也并不会直接调用它们。每个组件返回一个该渲染什么的描述，该描述会包含开发者写的组件如 `<LikeButton>` 和 平台特定的组件如 `<div>`。由 React 决定在未来的某个时间点展开 `<LikeButton>`，并根据组件的渲染结果递归地把这些变更实际应用到 UI 树上。

虽然只是微小的区别，但这样做意义重大。因为你不需要调用组件方法而是让 React 调用它，这意味着如果必要 React 可以延迟调用。在 React 当前的实现中，React 在单个 tick 周期中递归地走完这棵树，然后调用整个更新后树的渲染方法。但是以后 React 可能会[延迟一些更新操作来防止掉帧](https://github.com/facebook/react/issues/6170)。

这在 React 的设计中很常见。有一些流行的库实现了“推”模式，即当新数据到达时再计算。然而 React 坚持“拉”模式，即延迟计算直到必须。

React 不是一个常规的数据处理库，它是开发用户界面的库。我们认为 React 在一个应用中的位置很独特，它知道当前哪些计算当前是相关的，哪些不是。

如果不在当前屏幕，我们可以延迟执行相关逻辑。如果数据数据到达的速度快过帧速，我们可以合并、批量更新。我们优先执行用户交互（例如按钮点击形成的动画）的工作，延后执行相对不那么重要的后台工作（例如渲染刚从网络上下载的新内容），从而避免掉帧。

要清楚我们现在还没有利用调度。然而，我们之所以偏好自己控制调度以及异步`setState()`，是因为拥有了选择的自由度。

如果我们允许用户使用在一些变体的[函数反应式编程](https://en.wikipedia.org/wiki/Functional_reactive_programming)范式中常见的“推”模式直接拼接视图，我们将会很难获得调度的控制权。

React 的一个关键目标是在把控制权转交给 React 之前执行的用户代码量最少。这确保 React 保持调度的能力，并根据它所知道的 UI 的情况把工作切分成小块处理。

在团队内部有个笑话，React 本该叫做“调度”因为 React 不想变得完全“反应式（reactive）”。

### 开发者体验 {#developer-experience}

提供好的开发者体验对我们很重要。

例如，我们维护了 [React DevTools](https://github.com/facebook/react-devtools)，它让大家在 Chrome 和 Firefox 浏览器中可以检查 React 组件树。我们听说它大幅提高了 Facebook 的工程师和社区的生产效率。

我们还提供了对开发有所帮助的开发者警告。比如你以浏览器不理解的方式嵌套标签或者你在编写 API 时常见的错别字，React 会警告你。开发者警告和相关的检查导致了 React 的开发版本比生产版本速度慢。

Facebook 内部的使用模式帮助我们了解常见的错误有哪些，以及如何提前预防。当我们添加新特性时，我们尝试去预测可能会发生的错误并发出警告。

我们一直在寻找提高开发者体验的方法。我们很乐意听取大家的建议，接受大家的贡献，把开发者体验做的更好。

### 调试 {#debugging}

当发生错误时，你有一些线索可以追溯到代码库中的具体代码，这很重要。在 React 中，props 和 state 就是线索。

当你看到屏幕上出现错误时，你可以打开 React 开发者工具，找到负责渲染的组件，检查它的 props 和 state 是否正确。如果正确，你就知道为题要么在于组件的 `render()` 方法，要么在于某个被 `render()` 调用的方法。可见问题被独立出来了。

如果 state 发生错误，你就知道问题在于这个文件中的某个 `setState()` 调用，定位和修复也相对简单，因为在单个文件中 `setState()` 调用次数很少。

如果 props 出现错误，你可以在检查器中沿着树向上排查，查找到第一个因为向下传递了错误的 props 而“污染了这口井”的组件。

能够以当前的 props 和 state 这种形式追溯到其产生的任何 UI，这种能力对 React 来说非常重要。state 不会包裹在闭包和组合子中，并且在 React 中可以直接获取，这是 React 一个非常明确的设计目标。

尽管 UI 是动态变化的，但是我们认为 state 和 props 的同步执行的 `render()` 函数使得调试变成了无聊但是有限的步骤，而不是瞎猜。我们在 React 里保留了这个限制，即使它使调试在某些场景下变得更加困难，比如复杂的动画。

### 配置 {#configuration}

我们发现全局的运行时配置会造成很多问题。

比如我们时常收到这样的请求，实现类似于 `React.configure(options)` 或者 `React.register(component)` 的方法。然而这样做会出现很多问题，而我们对此并没有很好的解决方案。

如果有人在第三方组件库中调用了这样的方法怎么办？如果一个 React 应用内嵌了另一个 React 应用，而且他们需要的配置不兼容怎么办？一个第三方组件怎么申明它需要某个特定配置呢？我们认为全局的配置与组合搭配效果不好。既然组合是 React 的核心，那么我们不在代码里提供全局的配置。

然而我们在构建层面提供了一些全局的配置。比如我们提供了独立的开发和生产环境的构建。我们后面也许会[增加一个分析构建](https://github.com/facebook/react/issues/6627)。我们对考虑使用其他构建参数保持开放态度。

### DOM 之外 {#beyond-the-dom}

我们认为 React 的价值在于它使我们写出更少 bug 的组件，而且组件很方便组合。React 当初的渲染目标是 DOM，但 [React Native](https://facebook.github.io/react-native/) 对 Facebook 和社区来说同样重要。

React 的一个重要设计约束是要渲染引擎无关。这在内部呈现增加了一些开销，另一方面，对内核的任何优化将对所有平台都有益。

单一的编程模型使我们能够围绕产品形成工程团队，而不是围绕平台。目前来看这样的取舍对我们来说很值得。

### 实现 {#implementation}

相比优雅的实现，我们更想提供尽可能优雅的 API。现实是不完美的，如果能让用户无需写这些代码，在合适的范围内，我们偏向把丑陋的代码写在库里。我们评估新代码时，我们看中的是正确地实现、高性能并且能够带来良好的开发体验，优雅是第二位的。

我们宁可写无聊的代码也不写耍聪明的代码。代码是一次性的而且经常变更，所以[除非极度必要，不引入新的内部抽象](https://youtu.be/4anAwXYqLG8?t=13m9s)很重要。很方便移动、改动和删除的啰嗦的代码比过早抽象且难以变更的优雅的代码更好。

### 针对工具优化 {#optimized-for-tooling}

React 一些常用的 API 名字很冗长。比如，我们采用 `componentDidMount()` 而非 `didMount()` 或者 `onMount()`。这是[有意为之的](https://github.com/reactjs/react-future/issues/40#issuecomment-142442124)，目的是使得和 React 的交互点具有高可见性。

在像 Facebook 这样庞大的代码库中，能够搜索某些特定 API 的使用很重要。我们重视清晰冗长的名字，特别是在一些需要保守使用的特性上。比如，`dangerouslySetInnerHTML` 在代码评审中就很容易被发现。

针对搜索优化很重要，因为我们依赖 [codemods](https://www.youtube.com/watch?v=d0pOgY8__JM) 做不兼容的变更。我们希望非常容易、安全地在代码库中应用大量自动化变更，独特冗长的名字帮助了我们。类似地，独特的命名使得编写自定义 React 用法的[提示规则](https://github.com/yannickcr/eslint-plugin-react)变得很容易，无需担心潜在的错误匹配。

[JSX](/docs/introducing-jsx.html) 也类似这样。尽管 React 不强制使用 JSX，在 Facebook 我们大量使用 JSX，因为它既好看有实用。

在我们的代码库中，JSX 给和 React 元素树打交道的工具提供了明确的提示。这使得构建时优化成为可能，比如[提升常量元素](https://babeljs.io/docs/en/babel-plugin-transform-react-constant-elements/)、安全地进行代码提示、codemod 内部组件用法、在代码警告中[包含 JSX 源码定位](https://github.com/facebook/react/pull/6771).

### 内部测试 {#dogfooding}

我们全力解决社区提出的问题。但我们可能会优先处理在 Facebook 内部遇到的*同样的*问题。也许这很反直觉，但是我们认为这是社区相信 React 的主要原因。

内部的重度使用使我们坚信 React 不会凭空消失。Facebook 创建了 React 是来解决它的问题的。React 给 Facebook 带来了现实的商业价值，并且在很多产品中使用。在内部测试意味着我们的目光保持敏锐，有着前进的重点方向。

这不代表我们会忽视社区提出的问题。比如，即便我们内部并不依赖他们，我们仍增加了 React 对 [web components](/docs/webcomponents.html) 和 [SVG](https://github.com/facebook/react/pull/6243) 的支持。我们倾听者大家的痛点，并全力解决他们。是社区使 React 变得与众不同，所以我们很荣幸可以回报社区。

在 Facebook 发布了很多开源的项目之后，我们学到了让大家都开心的做法会导致项目没有重点，成长不起来。相反，我们发现选择一小部分群体，重点关注如何使他们开心带来了积极的净效应。这正是 React 的做法，到目前为止解决 Facebook 产品团队的问题很好的传递到了开源社区。

这种做法的不好之处是有时对于 Facebook 团队无需关心的事，比如“起步”的体验，我们不能够给予足够的重视。我们已经觉察到了，我们正在着手思考如何做才能使社区里的每个人都受益，不重蹈以前开源项目的覆辙。
