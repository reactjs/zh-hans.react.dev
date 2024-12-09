---
title: "回顾 React Conf 2024"
author: Ricky Hanlon
date: 2024/05/22
description: 上周我们在内华达州亨德森举办了为期两天的 React Conf 2024 大会，有 700 多名与会者亲临现场，讨论 UI 工程领域的最新进展。在这篇文章中，我们将总结这次活动的演讲和公告。
---

2024 年 5 月 22 日 [Ricky Hanlon](https://twitter.com/rickhanlonii)

---

<Intro>

上周我们在内华达州亨德森举办了为期两天的 React Conf 2024 大会，有 700 多名与会者亲临现场，讨论 UI 工程领域的最新进展。这是我们自 2019 年以来首次举办线下会议，我们很高兴能够再次将社区团结在一起。

</Intro>

---

在 React Conf 2024 上，我们宣布了 [React 19 RC](/blog/2024/12/05/react-19)、[React Native 新架构 Beta 版](https://github.com/reactwg/react-native-new-architecture/discussions/189)，以及 [React Compiler](/learn/react-compiler) 的实验版本。社区同时登台宣布了 [React Router v7](https://remix.run/blog/merging-remix-and-react-router)、Expo Router 中的 [通用服务器组件](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=20765s)、[RedwoodJS](https://redwoodjs.com/blog/rsc-now-in-redwoodjs) 中的 React 服务器组件等等。

完整的 [第一天](https://www.youtube.com/watch?v=T8TZQ6k4SLE) 和 [第二天](https://www.youtube.com/watch?v=0ckOUBiuxVY) 的直播已经可以在线观看了。在这篇文章中，我们将总结活动中的演讲和公告。

## 第一天 {/*day-1*/}

_[点击这里观看第一天完整直播。](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=973s)_

第一天由 Meta 的首席技术官 [Andrew "Boz" Bosworth](https://www.threads.net/@boztank) 发表欢迎致辞，随后由 Meat 的 React 组织负责人 [Seth Webster](https://twitter.com/sethwebster) 以及主持人 [Ashley Narcisse](https://twitter.com/_darkfadr) 进行演讲。

在第一天的主题演讲中，[Joe Savona](https://twitter.com/en_JS) 分享了我们对 React 的目标和愿景：帮助任何人更加轻松构建卓越的用户体验。[Lauren Tan](https://twitter.com/potetotes) 随后带来了 React 的现状报告：React 在 2023 年下载量超过 10 亿次，并且有 37% 的新开发者通过 React 学习编程。最后她强调，是 React 社区成就了 React 的今天。

更多内容，请查看会议随后带来的来自社区的演讲：

- [原生 React](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=5542s)，来自 [Ryan Florence](https://twitter.com/ryanflorence)
- [React 节奏布鲁斯](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=12728s)，来自 [Lee Robinson](https://twitter.com/leeerob)
- [RedwoodJS 现已支持 React 服务器组件](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=26815s)，来自 [Amy Dutton](https://twitter.com/selfteachme)
- [介绍 Expo Router 中的通用 React 服务器组件](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=20765s)，来自 [Evan Bacon](https://twitter.com/Baconbrix)

接下来的主题演讲中，[Josh Story](https://twitter.com/joshcstory) 和 [Andrew Clark](https://twitter.com/acdlite) 分享了 React 19 即将推出的新功能，并宣布了 React 19 RC，该版本已准备好用于生产环境测试。你可以在 [React 19 RC](/blog/2024/12/05/react-19) 这篇文章中查看 React 19 的全部功能，也可以查看以下关于新功能深入分析的演讲：

- [React 19 有哪些更新](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=8880s)，来自 [Lydia Hallie](https://twitter.com/lydiahallie)
- [React 解读：React 19 路线图](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=10112s)，来自 [Sam Selikoff](https://twitter.com/samselikoff)
- [React 19 深入：协调 HTML](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=24916s)，来自 [Josh Story](https://twitter.com/joshcstory)
- [使用 React 服务器组件增强表单](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=25280s)，来自 [Aurora Walberg Scharff](https://twitter.com/aurorascharff)
- [为两台计算机设计的 React](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=18825s)，来自 [Dan Abramov](https://twitter.com/dan_abramov2)
- [现在你应该理解了 React 服务器组件](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=11256s)，来自 [Kent C. Dodds](https://twitter.com/kentcdodds)

最后，[Joe Savona](https://twitter.com/en_JS)、[Sathya Gunasekaran](https://twitter.com/_gsathya) 和 [Mofei Zhang](https://twitter.com/zmofei) 宣布 React Compiler 现已 [开源](https://github.com/facebook/react/pull/29061)，并分享了一个实验版本的 React Compiler 供大家尝试。

有关使用 React Compile 及其工作原理的更多信息，请查看[文档](/learn/react-compiler)以及如下演讲：

- [忘了 Memo 吧](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=12020s)，来自 [Lauren Tan](https://twitter.com/potetotes)
- [深入解析 React Compiler](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=9313s)，来自 [Sathya Gunasekaran](https://twitter.com/_gsathya) 和 [Mofei Zhang](https://twitter.com/zmofei)

观看完整的第一天主题演讲：

<YouTubeIframe src="https://www.youtube.com/embed/T8TZQ6k4SLE?t=973s" />

## 第二天 {/*day-2*/}

_[点击这里观看第二天完整直播。](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=1720s)_

第二天由 [Seth Webster](https://twitter.com/sethwebster) 发表欢迎致辞，随后是 [Eli White](https://x.com/Eli_White) 的感谢致辞，以及我们的首席氛围官 [Ashley Narcisse](https://twitter.com/_darkfadr) 的介绍。

在第二天的主题演讲中，[Nicola Corti](https://twitter.com/cortinico) 分享了 React Native 的现状，包括 2023 年的 7800 万次下载量。他还强调了使用 React Native 的应用，包括了 Meta 内部使用的 2000 多个页面；Facebook 市场中的产品详情页面，该页面每天访问量超过 20 亿次；以及微软 Windows 开始菜单的一些部分，和几乎每个微软 Office 产品的移动和桌面版本中的一些功能。

Nicola 还强调了社区为支持 React Native 所做的所有工作，包括库、框架和多平台。更多内容，请查看来自社区的这些演讲：

- [React Native，不仅仅是移动和桌面应用](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=5798s)，来自 [Chris Traganos](https://twitter.com/chris_trag) 和 [Anisha Malde](https://twitter.com/anisha_malde)
- [使用 React 进行空间计算](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=22525s)，来自 [Michał Pierzchała](https://twitter.com/thymikee)

[Riccardo Cipolleschi](https://twitter.com/cipolleschir) 继续第二天的主题演讲，他宣布 React Native 新架构现已进入 Beta 阶段，并准备好在生产环境中使用。他分享了新架构中的新功能和改进，并分享了 React Native 未来的路线图。更多内容，请查看：

- [跨平台 React](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=26569s)，来自 [Olga Zinoveva](https://github.com/SlyCaptainFlint) 和 [Naman Goel](https://twitter.com/naman34)

在接下来在主题演讲中，Nicola 宣布官方建议所有使用 React Native 创建的新应用都使用 Expo 这样的框架启动。与此同时他还宣布了全新的 React Native 主页和入门文档。可以在 [React Native docs](https://reactnative.dev/docs/next/environment-setup) 中查看新的入门指南。

最后，在本次主题演讲的末尾，[Kadi Kraman](https://twitter.com/kadikraman) 分享了 Expo 的最新功能和改进，以及如何使用 Expo 开始 React Native 开发。

观看完整的第二天主题演讲：

<YouTubeIframe src="https://www.youtube.com/embed/0ckOUBiuxVY?t=1720s" />

## 问答环节 {/*q-and-a*/}

React 和 React Native 团队也在每天结束时进行了问答环节：

- [React 问答](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=27518s) 由 [Michael Chan](https://twitter.com/chantastic) 主持
- [React Native 问答](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=27935s) 由 [Jamon Holmgren](https://twitter.com/jamonholmgren) 主持

## 还有更多... {/*and-more*/}

大会还进行了关于可访问性、错误报告、CSS 等方面的演讲：

- [揭秘 React 应用中的可访问性](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=20655s)，来自 [Kateryna Porshnieva](https://twitter.com/krambertech)
- [Pigment CSS，服务器组件时代的 CSS](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=21696s)，来自 [Olivier Tassinari](https://twitter.com/olivtassinari)
- [实时 React 服务器组件](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=24070s)，来自 [Sunil Pai](https://twitter.com/threepointone)
- [打破 React 规则](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=25862s)，来自 [Charlotte Isambert](https://twitter.com/c_isambert)
- [解决 100% 的错误](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=19881s)，来自 [Ryan Albrecht](https://github.com/ryan953)

## 致谢 {/*thank-you*/}

感谢所有使 React Conf 2024 成为可能的工作人员、演讲者和参与者。感谢名单太长不能一一列出，但我们想特别感谢一些人。

感谢 [Barbara Markiewicz](https://twitter.com/barbara_markie)、[Callstack](https://www.callstack.com/) 团队和我们的 React 团队开发者倡导者 [Matt Carroll](https://twitter.com/mattcarrollcode) 帮助策划整个活动；感谢 [Sunny Leggett](https://zeroslopeevents.com/about) 和 [Zero Slope](https://zeroslopeevents.com) 的所有人帮助组织活动。

感谢 [Ashley Narcisse](https://twitter.com/_darkfadr) 担任我们的主持人和首席氛围官；感谢 [Michael Chan](https://twitter.com/chantastic) 和 [Jamon Holmgren](https://twitter.com/jamonholmgren) 主持问答环节。

感谢 [Seth Webster](https://twitter.com/sethwebster) 和 [Eli White](https://x.com/Eli_White) 每天欢迎我们，并提供结构和内容方面的指导；感谢 [Tom Occhino](https://twitter.com/tomocchino) 在聚会后加入我们，并发表特别讯息。

感谢 [Ricky Hanlon](https://www.youtube.com/watch?v=FxTZL2U-uKg&t=1263s) 提供关于演讲的详细反馈，设计幻灯片，以及总体上填补细节方面的空缺。

感谢 [Callstack](https://www.callstack.com/) 建设大会网站；感谢 [Kadi Kraman](https://twitter.com/kadikraman) 和 [Expo](https://expo.dev/) 团队建设大会移动应用。

感谢所有赞助商使本次活动得以实现：[Remix](https://remix.run/)、[Amazon](https://developer.amazon.com/apps-and-games?cmp=US_2024_05_3P_React-Conf-2024&ch=prtnr&chlast=prtnr&pub=ref&publast=ref&type=org&typelast=org)、[MUI](https://mui.com/)、[Sentry](https://sentry.io/for/react/?utm_source=sponsored-conf&utm_medium=sponsored-event&utm_campaign=frontend-fy25q2-evergreen&utm_content=logo-reactconf2024-learnmore)、[Abbott](https://www.jobs.abbott/software)、[Expo](https://expo.dev/)、[RedwoodJS](https://redwoodjs.com/) 以及 [Vercel](https://vercel.com)。

感谢音视频团队为我们提供的视觉、舞台和声音；感谢威斯汀酒店为我们提供的住宿。

感谢所有与社区分享他们的知识和经验的演讲者。

最后，感谢所有现场以及在线参加大会的每一位。是你们成就了 React 的今天。React 不仅仅是一个库，它更是一个社区，看到大家聚在一起分享和共同学习真是鼓舞人心。

下次见！

