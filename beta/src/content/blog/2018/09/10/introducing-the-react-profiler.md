---
title: "React Profiler 介绍"
author: [bvaughn]
---

React 16.5 添加了对开发者工具的 Profiler 插件的支持。
该插件使用了 React 的 [Profiler 实验性 API](https://github.com/reactjs/rfcs/pull/51) 来收集所有组件渲染的耗时，目的是为了找出 React 应用程序的性能瓶颈。
它将完全兼容我们即将推出的 [时间片和 suspense](/blog/2018/03/01/sneak-peek-beyond-react-16.html) 特性。

这篇博文包含以下内容：

- [分析应用程序](#profiling-an-application)
- [查看性能数据](#reading-performance-data)
  - [浏览提交记录](#browsing-commits)
  - [筛选提交记录](#filtering-commits)
  - [火焰图](#flame-chart)
  - [排序图](#ranked-chart)
  - [组件图](#component-chart)
  - [交互动作](#interactions)
- [常见问题](#troubleshooting)
  - [选择的根元素下没有分析数据被记录](#no-profiling-data-has-been-recorded-for-the-selected-root)
  - [选中的提交记录没可展示的时间数据](#no-timing-data-to-display-for-the-selected-commit)
- [视频解析](#deep-dive-video)

## 分析应用程序 {/*profiling-an-application*/}

开发者工具将会对支持新的分析 API 的应用程序添加一个“Profiler”选项卡：

![新的开发者工具“Profiler”选项卡](../images/blog/introducing-the-react-profiler/devtools-profiler-tab.png)

> 注意：
>
> `react-dom` 16.5+ 在 DEV 模式下支持性能分析。
> 在生产环境也可以使用 `react-dom/profiling` 代码包进行性能分析，
> 查阅 [fb.me/react-profiling](https://fb.me/react-profiling) 了解更多如何使用这个代码包。

这个“Profiler”面板初始为空，你可以点击 record 按钮开始分析：

![点击“record”开始分析](/images/blog/introducing-the-react-profiler/start-profiling.png)

当你开始记录之后，开发者工具将在每次应用程序渲染时自动收集性能数据。
你可以和平常一样使用你的应用程序，
当你完成分析之后，请点击“Stop”按钮。

![当你完成性能分析之后，点击“stop”](/images/blog/introducing-the-react-profiler/stop-profiling.png)

假设你的应用程序在分析时至少渲染一次，开发者工具将提供几种方法查看性能数据。
我们将会[在接下来介绍它们](#reading-performance-data)。

## 查看性能数据 {/*reading-performance-data*/}

### 浏览提交记录 {/*browsing-commits*/}

从概念上讲，React 分两个阶段工作：

- **渲染** 阶段会确定需要进行哪些更改，比如 DOM。在此阶段，React 调用 `render`，然后将结果与上次渲染的结果进行比较。
- **提交** 阶段发生在当 React 应用变化时。（对于 React DOM 来说，会发生在 React 插入，更新及删除 DOM 节点的时候。）在此阶段，React 还会调用 `componentDidMount` 和 `componentDidUpdate` 之类的生命周期方法。

开发者工具的 profiler 是在提交阶段收集性能数据的。
每次提交都会被展示在 profiler 界面顶部的条形图中：

![已分析的提交记录](/images/blog/introducing-the-react-profiler/commit-selector.png)

在条形图中，每一列都表示单次提交的数据，当前选中的提交会变成黑色。
你可以点击各个列（或者是左/右切换按钮）来查看不同的提交的数据。

这些列的颜色和高度对应该次提交渲染所需的时间。
(较高的黄色的列比较短的蓝色的列耗费的时间长。)

### 筛选提交记录 {/*filtering-commits*/}

你分析的时间越长，应用程序渲染的次数就越多。
有时候，你可能会因为_过多的提交记录_而感觉难以处理。
profiler 提供了一个筛选功能，帮助你解决这个问题。
使用它来设置一个时间阈值，profiler 将隐藏所有比该值_更快_的提交记录。

![按时间筛选提交记录](/images/blog/introducing-the-react-profiler/filtering-commits.gif)

### 火焰图 {/*flame-chart*/}

火焰图会展示你所指定的那一次提交的应用程序的信息，
图中的每一列都代表了一个 React 组件，（如：`App`，`Nav`）。
列的大小和颜色代表渲染该组件及其子组件所需的耗时。
(列的宽度代表组件_上次渲染_的耗时，列的颜色代表在_该次提交_中渲染的耗时。)

![火焰图示例](/images/blog/introducing-the-react-profiler/flame-chart.png)

> 注意：
>
> 列的宽度表示组件（及其子组件）上次渲染所需的耗时。
> 如果组件在本次提交中未重新渲染，则代表上次渲染的耗时。
> 一个列越宽，其所代表的组件渲染耗时就越长。
>
> 列的颜色表示组件（及其子组件）在本次提交中渲染的耗时。
> 黄色代表耗时较长，蓝色代表耗时较短，灰色代表该组件在这次提交中没有重新渲染。

例如，上图中所展示的提交总共渲染耗时为 18.4ms。
`Router` 组件是渲染成本“最昂贵的”（花费了 18.4ms）。
它所花费的时间大部分在它的两个子组件上：`Nav`（8.4ms）和 `Route`（7.9ms）。
剩下的时间用于它的其他子组件和它自身的渲染。

你可以通过单击组件放大或缩小火焰图：
![单击组件放大或缩小火焰图](/images/blog/introducing-the-react-profiler/zoom-in-and-out.gif)

点击一个组件的同时也会选中它，它的详细信息将会展示在右边的面板中，该面板会展示该组件在这次提交时的 `props` 和 `state`。
你可以深入研究这些信息，进一步了解这次提交组件实际渲染的内容：

![查看组件提交的 props 和 state](/images/blog/introducing-the-react-profiler/props-and-state.gif)

在某些情况下，选中一个组件后在不同的提交之间切换也可以发现触发这次渲染的_原因_：

![查看提交之间变化的数据](/images/blog/introducing-the-react-profiler/see-which-props-changed.gif)

上图表示 `state.scrollOffset` 在提交之间被改变了。 
这可能是导致 `List` 组件重新渲染的原因。

### 排序图 {/*ranked-chart*/}

同火焰图一样，排序图也会展示你所指定的那一次提交的信息，
图中的每一列都代表了一个 React 组件（如：`App`，`Nav`）。
不同的是排序图是有顺序的，耗时最长的组件会展示在第一行。

![排序图示例](/images/blog/introducing-the-react-profiler/ranked-chart.png)

> 注意：
>
> 组件的渲染耗时包含了其子组件渲染所花费的时间，
> 因此，渲染耗时最长的组件通常距离树的顶部最近。

与火焰图一样，你可以通过单击组件放大或缩小排序图。

### 组件图 {/*component-chart*/}

在你分析的过程中，使用该图来查看某一组件在多次提交中的渲染时间有时候是非常有用的。
组件图会以一个列的形式展示，
其中每一列都表示你所选择的组件某一次提交下的渲染时间。
每列的颜色和高度都表示该组件在某次提交中_同其它组件_的渲染耗时对比。

![组件图示例](/images/blog/introducing-the-react-profiler/component-chart.png)

上图显示 `List` 组件渲染了 11 次。
同时它还显示了每次渲染时，它都是提交中最“昂贵”的组件（意味着它的耗时最长）。

想查看此图，请双击组件_或者_选择组件后单击右侧面板中的蓝色列表图标。
你可以通过单击右侧面板中的“x”按钮返回原图。 
也可以通过双击组件图的某一列来查看该提交的更多信息

![如何查看某一组件所有的渲染](/images/blog/introducing-the-react-profiler/see-all-commits-for-a-fiber.gif)

如果你选中的组件在分析期间从未被渲染过，则会显示下面的消息：

![所选组件无渲染时间](/images/blog/introducing-the-react-profiler/no-render-times-for-selected-component.png)

### 交互动作 {/*interactions*/}

React 最近添加了一个用于跟踪更新_原因_的[实验性 API](https://fb.me/react-interaction-tracing)。
被这些 API 跟踪的“交互动作”也会显示在 profiler 中:

![交互动作面板](/images/blog/introducing-the-react-profiler/interactions.png)

上图显示了一个分析期间被跟踪的四个交互动作。
每行都表示一个已经被跟踪的交互动作。
每行中彩色的点表示与该交互动作相关的提交记录。

你还可以从火焰图和排序图的视图中查看某一提交记录被跟踪了哪些交互动作：

![提交记录的交互动作列表](/images/blog/introducing-the-react-profiler/interactions-for-commit.png)

通过单击交互动作和提交记录，可以在它们之间切换：

![在交互动作和提交记录之间切换](/images/blog/introducing-the-react-profiler/navigate-between-interactions-and-commits.gif)

tracing API 是新的特性，我们会在未来的博文中更详细地介绍它。

## 常见问题 {/*troubleshooting*/}

### 选择的根元素下没有分析数据被记录 {/*no-profiling-data-has-been-recorded-for-the-selected-root*/}

如果你的应用程序有多个“根”节点，你可能会在分析后看到以下消息：
![选择的根元素下没有分析数据被记录](/images/blog/introducing-the-react-profiler/no-profiler-data-multi-root.png)

这个信息表示你在“Elements”面板中选择的根节点没有性能数据被记录。
在这种情况下，请尝试在该面板中选择其他根节点来查看性能分析数据：

![在“Elements”界面中选择根节点来查看它的性能数据](/images/blog/introducing-the-react-profiler/select-a-root-to-view-profiling-data.gif)

### 选中的提交记录没可展示的时间数据 {/*no-timing-data-to-display-for-the-selected-commit*/}

有时提交的速度可能很快，以至于 `performance.now()` 无法给开发者工具任何有意义的数据。
在这种情况下，将显示以下的消息：

![选中的提交记录没可展示的时间数据](/images/blog/introducing-the-react-profiler/no-timing-data-for-commit.png)

## 视频解析 {/*deep-dive-video*/}

以下视频演示了如何使用 React profiler 来检测和改进实际 React 应用程序中的性能瓶颈。

<br/>

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/nySib7ipZdk?rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
