---
title: "React 分析器简介"
author: [bvaughn]
---
React 16.5 新增了开发者工具的分析器插件。
该插件使用 React 的[实验性 Profiler API](https://github.com/reactjs/rfcs/pull/51) 来收集每个组件渲染的耗时，以识别 React 应用程序中的性能瓶颈。
它将完全兼容我们即将推出的[时间切片和 suspense](/blog/2018/03/01/sneak-peek-beyond-react-16.html) 功能。

这篇博文涵盖了以下主题：
* [分析应用程序](#profiling-an-application)
* [读取性能数据](#reading-performance-data)
  * [浏览提交](#browsing-commits)
  * [筛选提交](#filtering-commits)
  * [火焰图](#flame-chart)
  * [排行榜](#ranked-chart)
  * [组件图](#component-chart)
  * [交互](#interactions)
* [故障排除](#troubleshooting)
  * [未记录所选根节点的分析数据](#no-profiling-data-has-been-recorded-for-the-selected-root)
  * [所选提交无可显示的计时数据](#no-timing-data-to-display-for-the-selected-commit)
* [深度视频解析](#deep-dive-video)

## 分析应用程序 {#profiling-an-application}

开发者工具将为支持分析 API 的应用程序显示 "Profiler" 选项卡：

![新的开发者工具 "profiler" 选项卡](../images/blog/introducing-the-react-profiler/devtools-profiler-tab.png)

> 注意：
>
> `react-dom` 16.5+ 在 DEV 模式下支持性能分析。
> 也可以使用 `react-dom/profiling` 生产分析代码包，
> 通过查阅 [fb.me/react-profiling](https://fb.me/react-profiling) 来了解更多关于使用这个包的内容。

"Profiler" 面板初始为空，点击记录按钮开始分析：

![点击 "record" 开始分析](../images/blog/introducing-the-react-profiler/start-profiling.png)

一旦你开始录制，开发者工具将在每次应用程序渲染时自动收集性能信息。
正常使用你的应用，
当你完成性能分析时，点击 "Stop" 按钮。

![点击 "stop"，当你完成性能分析时](../images/blog/introducing-the-react-profiler/stop-profiling.png)

假设你的应用程序在分析时至少渲染一次，开发者工具将提供几种方法查看性能数据。
我们将[在下面逐一介绍](#reading-performance-data).

## 读取性能数据 {#reading-performance-data}

### 浏览提交 {#browsing-commits}
从概念上讲，React分两个阶段工作：

* **渲染** 阶段会确定需要进行哪些更改，比如 DOM。在此阶段，React 调用 `render` ，然后将结果与上次渲染的结果进行比较。
* **提交** 阶段发生在当 React 应用变化时。（对于 React DOM 来说，会发生在 React 插入，更新及删除 DOM 节点的时候。）在此阶段，React 还会调用 `componentDidMount` 和 `componentDidUpdate` 之类的生命周期方法。

开发者工具的分析器按提交对性能信息进行分组。
提交展示在分析器顶部附近的条形图中：

![提交条形图的简介](../images/blog/introducing-the-react-profiler/commit-selector.png)

图表中的每个条形表示单个提交，当前选定的提交为黑色。
你可以单击条形图（或左/右箭头按钮）来选择其他提交。

每个条形的颜色和高度对应该次提交渲染所需的时间。
(较高的黄色条形比较短的蓝色条形耗费的时间长。)

### 筛选提交 {#filtering-commits}

分析的时间越长，应用程序渲染的次数越多。
在某些情况下，你可能会因为 _太多的提交_ 而难以处理。
分析器提供了一种过滤机制来帮助实现这一点。
使用它来指定阈值，分析器将隐藏所有比该值 _更快_ 的提交。

![按时间筛选提交](../images/blog/introducing-the-react-profiler/filtering-commits.gif)

### 火焰图 {#flame-chart}

火焰图代表指定提交的应用程序状态。
图表中的每个条形代表一个 React 组件， (如： `App`, `Nav`)。
条形的大小和颜色代表渲染该组件及其子组件所需的耗时。
(条形的宽度代表组件 _上次渲染_ 的耗时，颜色代表 _当前提交_ 的耗时。)

![火焰图示例](../images/blog/introducing-the-react-profiler/flame-chart.png)

> 注意：
>
> 条形的宽度代表上次渲染组件（及其子组件）时所需的耗时。
> 如果组件在本次提交中未重新渲染，则代表之前的渲染耗时。
> 组件越大，渲染耗时越长。
> 
> 条形的颜色指示组件（及其子组件）在所选提交中渲染的耗时。
> 黄色组件耗时更多，蓝色组件耗时更少，灰色组件则表示在这个提交期间不渲染。

例如，上面显示的提交总共需要 18.4ms 进行渲染。
`Router` 组件是"最昂贵的"渲染（耗时 18.4ms）。
大部分时间消耗在它的两个子组件上，`Nav` (8.4ms) 和 `Route` (7.9ms)。
其余时间由剩余的子节点瓜分，或者在组件自己的渲染方法中使用。

你可以通过单击组件放大或缩小火焰图：
![单击组件放大或缩小火焰图](../images/blog/introducing-the-react-profiler/zoom-in-and-out.gif)

单击组件将选中它并同时在右侧面板中其详细信息，其中包括其提交时的 `props` 和 `state`。
您可以深入了解这些内容，进一步了解提交期间组件实际渲染的内容：

![查看组件提交的 props 和 state](../images/blog/introducing-the-react-profiler/props-and-state.gif)

在某些情况下，选择组件并在提交之间单步执行也可能得到关于组件渲染 _原因_ 的提示：

![查看提交之间更改的值](../images/blog/introducing-the-react-profiler/see-which-props-changed.gif)

上图显示 `state.scrollOffset` 在提交之间发生了变化。 
这可能是导致 `List` 组件重新渲染的原因。

### 排行榜 {#ranked-chart}

排行榜视图表示单个提交。
图表中的每个条形代表一个 React 组件 (如： `App`，`Nav`)。
图表按顺序排列，以便渲染耗时最长的组件位于顶部。

![排行榜示例](../images/blog/introducing-the-react-profiler/ranked-chart.png)

> 注意：
>
> 组件的渲染耗时包括渲染其子组件所花费的时间，
> 因此，渲染耗时最长的组件通常位于树的顶部附近。

与火焰图一样，你可以通过单击组件放大或缩小排行榜。

### 组件图 {#component-chart}

有时，查看指定组件在分析时渲染的次数非常有用。
组件图以条形图的方式提供此信息。
图表中的每个条形表示组件渲染的时间。
每个条形的颜色和高度对应于组件在指定提交中渲染 _相对于其他组件_ 所需的耗时。

![组件图示例](../images/blog/introducing-the-react-profiler/component-chart.png)

上图显示 `List` 组件渲染了11次。
它还显示了每次渲染时，它都是提交中最"昂贵”的组件（意味着它的耗时最长）。

要查看此图表，请双击组件 _或_ 选择组件，然后单击右侧详细信息窗格中的蓝色条形图图标。
你可以通过单击右侧详细信息窗格中的 "x" 按钮返回到上一个图表。 
你还可以双击指定的条形来查看该提交的更多信息

![如何查看指定组件的所有渲染](../images/blog/introducing-the-react-profiler/see-all-commits-for-a-fiber.gif)

如果所选的组件在分析会话期间没有渲染，将显示以下消息：

![所选组件无渲染时间](../images/blog/introducing-the-react-profiler/no-render-times-for-selected-component.png)

### 交互 {#interactions}

React 最近添加了另一个用于跟踪更新 _原因_ 的 [实验性 API](https://fb.me/react-interaction-tracing)。
跟踪此 API 的"交互"也将显示在分析器中:

![交互面板](../images/blog/introducing-the-react-profiler/interactions.png)

上图显示了跟踪四个交互的分析会话。
每行表示已跟踪的交互。
行中的彩色点表示与该交互相关的提交。

你还可以从火焰图和排行榜的视图中查看指定提交跟踪了哪些交互：

![提交的交互列表](../images/blog/introducing-the-react-profiler/interactions-for-commit.png)

通过单击交互和提交，可以在交互和提交之间导航：

![在交互和提交之间导航](../images/blog/introducing-the-react-profiler/navigate-between-interactions-and-commits.gif)

新的跟踪 API，我们将在未来的博文中更详细地介绍它。

## 故障排除 {#troubleshooting}

### 未记录所选根节点的分析数据 {#no-profiling-data-has-been-recorded-for-the-selected-root}

如果你的应用程序有多个"根”节点，你可能会在分析后看到以下消息：
![未记录所选根节点的分析数据](../images/blog/introducing-the-react-profiler/no-profiler-data-multi-root.png)

此消息指示未记录在“元素”面板中选择的根节点的性能数据。
在这种情况下，请尝试在该面板中选择其他根节点来查看性能分析信息：

![在“元素”面板中选择根节点以查看其性能数据](../images/blog/introducing-the-react-profiler/select-a-root-to-view-profiling-data.gif)

### 所选提交无可显示的计时数据 {#no-timing-data-to-display-for-the-selected-commit}

有时提交可能很快，以至于 `performance.now()` 不会给开发者工具任何有意义的计时信息。 在这种情况下，将显示以下消息。
在这种情况下，将显示以下消息：

![所选提交无可显示的计时数据](../images/blog/introducing-the-react-profiler/no-timing-data-for-commit.png)

## 深度视频解析 {#deep-dive-video}

以下视频演示了如何使用 React 分析器来检测和改进实际 React 应用程序中的性能瓶颈。

<br>

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/nySib7ipZdk?rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
