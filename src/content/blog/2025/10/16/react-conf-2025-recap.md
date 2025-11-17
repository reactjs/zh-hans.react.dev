---
title: "回顾 React Conf 2025"
author: Matt Carroll and Ricky Hanlon
date: 2025/10/16
description: 上周我们举办了 React Conf 2025，在本文中，我们总结了会议的演讲和公告...
---

2025 年 10 月 16 日 [Matt Carroll](https://x.com/mattcarrollcode) 和 [Ricky Hanlon](https://bsky.app/profile/ricky.fm)

---

<Intro>

上周我们举办了 React Conf 2025 大会，会上我们宣布了 [React 基金会](/blog/2025/10/07/introducing-the-react-foundation)，并展示了 React 和 React Native 即将推出的新特性。

</Intro>

---

React Conf 2025 于 2025 年 10 月 7-8 日在内华达州亨德森举行。

完整的 [第一天](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=1067s) 和 [第二天](https://www.youtube.com/watch?v=p9OcztRyDl0&t=2299s) 的直播已经可以在线观看了。你可以在 [这里](https://conf.react.dev/photos) 查看活动照片。

在这篇文章中，我们将总结活动中的演讲和公告。


## 第一天 {/*day-1-keynote*/}

__[点击这里观看第一天完整直播。](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=1067s)__

在第一天的主题演讲中，Joe Savona 分享了自上届 React Conf 以来团队和社区的更新，以及 React 19.0 和 19.1 的亮点。

Mofei Zhang 重点介绍了 React 19.2 的新特性，包括：
* [`<Activity />`](https://react.dev/reference/react/Activity) —— 一个用于管理可见性的新组件。
* [`useEffectEvent`](https://react.dev/reference/react/useEffectEvent) 用于从 Effects 中触发事件。
* [性能追踪](https://react.dev/reference/dev-tools/react-performance-tracks) —— DevTools 中的新性能分析工具。
* [部分预渲染](https://react.dev/blog/2025/10/01/react-19-2#partial-pre-rendering) 预先渲染应用的一部分，并在稍后恢复渲染以填充动态内容。

Jack Pope 宣布了 Canary 版本中的新特性，包括：

* [`<ViewTransition />`](https://react.dev/reference/react/ViewTransition) —— 用于为页面过渡添加动画的新组件。
* [Fragment Refs](https://react.dev/reference/react/Fragment#fragmentinstance) —— 与 Fragment 包裹的 DOM 节点交互的新方式。

Lauren Tan 宣布 [React 编译器 v1.0](https://react.dev/blog/2025/10/07/react-compiler-1)，并建议所有应用使用 React 编译器，可以获得以下好处：
* 能够理解 React 代码的 [自动记忆化](/learn/react-compiler/introduction#what-does-react-compiler-do)。
* 由 React 编译器提供的 [新 lint 规则](/learn/react-compiler/installation#eslint-integration) ，用于传授最佳实践。
* 在 Vite、Next.js 和 Expo 中为新应用提供 [默认支持](/learn/react-compiler/installation#basic-setup)。
* 为准备迁移到 React 编译器的现有应用提供 [迁移指南](/learn/react-compiler/incremental-adoption)。

最后，Seth Webster 宣布成立 [React 基金会](/blog/2025/10/07/introducing-the-react-foundation) 来管理 React 的开源开发和社区。

观看完整的第一天主题演讲：

<YouTubeIframe src="https://www.youtube.com/embed/zyVRg2QR6LA?si=z-8t_xCc12HwGJH_&t=1067s" />

## 第二天 {/*day-2-keynote*/}

__[点击这里观看第二天完整直播。](https://www.youtube.com/watch?v=p9OcztRyDl0&t=2299s)__

在第二天的主题演讲中，Jorge Cohen 和 Nicola Corti 开场就重点介绍了 React Native 的惊人增长 —— 每周下载量达 400 万次（同比增长 100%），以及 Shopify、Zalando 和 HelloFresh 等公司值得关注的应用迁移，RISE、RUNNA 和 Partyful 等获奖应用，以及来自 Mistral、Replit 和 v0 的 AI 应用。

Riccardo Cipolleschi 分享了 React Native 的两个重大公告：
- [React Native 0.82 将仅支持新架构](https://reactnative.dev/blog/2025/10/08/react-native-0.82#new-architecture-only)
- [实验性 Hermes V1 支持](https://reactnative.dev/blog/2025/10/08/react-native-0.82#experimental-hermes-v1)

Ruben Norte 和 Alex Hunt 继续主题演讲，宣布了：
- [新的与 Web 标准对齐的 DOM API](https://reactnative.dev/blog/2025/10/08/react-native-0.82#dom-node-apis)，提高了 React Native 与 Web 的兼容性。
- [新的性能 API](https://reactnative.dev/blog/2025/10/08/react-native-0.82#web-performance-apis-canary) 配备新的网络面板和桌面应用。

观看完整的第二天主题演讲：

<YouTubeIframe src="https://www.youtube.com/embed/p9OcztRyDl0?si=qPTHftsUE07cjZpS&t=2299s" />


## React 团队演讲 {/*react-team-talks*/}

整个会议期间，React 团队进行了多场演讲，包括：
* [Async React 第一部分](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=10907s) 和 [第二部分](https://www.youtube.com/watch?v=p9OcztRyDl0&t=29073s)，来自 [Ricky Hanlon](https://x.com/rickhanlonii)，展示了过去 10 年创新所带来的可能性。
* [探索 React 性能](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=20274s)，来自 [Joe Savona](https://x.com/en_js)，展示了我们的 React 性能研究结果。
* [重新构想 React Native 中的列表](https://www.youtube.com/watch?v=p9OcztRyDl0&t=10382s)，来自 [Luna Wei](https://x.com/lunaleaps)，介绍了 Virtual View，一个用于列表的新原语，它通过基于模式的渲染（隐藏/预渲染/可见）来管理可见性。
* [使用 React 性能追踪进行性能分析](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=8276s)，来自 [Ruslan Lesiutin](https://x.com/ruslanlesiutin)，展示了如何使用新的 React 性能追踪来调试性能问题并构建优秀的应用。
* [React Strict DOM](https://www.youtube.com/watch?v=p9OcztRyDl0&t=9026s)，来自 [Nicolas Gallagher](https://nicolasgallagher.com/)，讨论了 Meta 在原生平台上使用 Web 代码的方法。
* [View Transitions 和 Activity](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=4870s)，来自 [Chance Strickland](https://x.com/chancethedev)，Chance 与 React 团队合作，展示了如何使用 `<Activity />` 和 `<ViewTransition />` 来构建快速且具有原生体验的动画。
* [错过了 Memo？](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=9525s)，来自 [Cody Olsen](https://bsky.app/profile/codey.bsky.social)，Cody 与 React 团队合作，在 Sanity Studio 中采用了 React 编译器，并分享了使用经验。
## React 框架演讲 {/*react-framework-talks*/}

第二天下半场进行了一系列来自 React 框架团队的演讲，包括：

* [React Native，增强版](https://www.youtube.com/watch?v=p9OcztRyDl0&t=5737s)，来自 [Giovanni Laquidara](https://x.com/giolaq) 和 [Eric Fahsl](https://x.com/efahsl)
* [React 无处不在：将 React 引入原生应用](https://www.youtube.com/watch?v=p9OcztRyDl0&t=18213s)，来自 [Mike Grabowski](https://x.com/grabbou)
* [Parcel 如何打包 React 服务器组件](https://www.youtube.com/watch?v=p9OcztRyDl0&t=19538s)，来自 [Devon Govett](https://x.com/devonovett)
* [设计页面过渡效果](https://www.youtube.com/watch?v=p9OcztRyDl0&t=20640s)，来自 [Delba de Oliveira](https://x.com/delba_oliveira)
* [快速构建，更快部署 —— 2025 年的 Expo](https://www.youtube.com/watch?v=p9OcztRyDl0&t=21350s)，来自 [Evan Bacon](https://x.com/baconbrix)
* [React Router 对 RSC 的看法](https://www.youtube.com/watch?v=p9OcztRyDl0&t=22367s)，来自 [Kent C. Dodds](https://x.com/kentcdodds)
* [RedwoodSDK：Web 标准驱动的全栈 React](https://www.youtube.com/watch?v=p9OcztRyDl0&t=24992s)，来自 [Peter Pistorius](https://x.com/appfactory) 和 [Aurora Scharff](https://x.com/aurorascharff)
* [TanStack Start](https://www.youtube.com/watch?v=p9OcztRyDl0&t=26065s)，来自 [Tanner Linsley](https://x.com/tannerlinsley)

## 问答环节 {/*q-and-a*/}
会议期间有三场问答环节：

* [Meta 公司 React 团队的问答环节](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=26304s)，由 [Shruti Kapoor](https://x.com/shrutikapoor08) 主持
* [React 框架问答](https://www.youtube.com/watch?v=p9OcztRyDl0&t=26812s)，由 [Jack Herrington](https://x.com/jherr) 主持
* [React 和 AI 圆桌讨论](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=18741s)，由 [Lee Robinson](https://x.com/leerob) 主持

## 还有更多... {/*and-more*/}

我们还听到了来自社区的演讲，包括：
* [构建 MCP 服务器](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=24204s)，来自 [James Swinton](https://x.com/JamesSwintonDev)（[AG Grid](https://www.ag-grid.com/?utm_source=react-conf&utm_medium=react-conf-homepage&utm_campaign=react-conf-sponsorship-2025)）
* [使用 React 创建现代电子邮件](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=25521s)，来自 [Zeno Rocha](https://x.com/zenorocha)（[Resend](https://resend.com/)）
* [为什么 React Native 应用最赚钱](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=24917s)，来自 [Perttu Lähteenlahti](https://x.com/plahteenlahti)（[RevenueCat](https://www.revenuecat.com/)）
* [卓越用户体验的隐形技艺](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=23400s)，来自 [Michał Dudak](https://x.com/michaldudak)（[MUI](https://mui.com/)）

## 致谢 {/*thanks*/}

感谢所有使 React Conf 2025 成为可能的工作人员、演讲者和参与者。感谢名单太长不能一一列出，但我们想特别感谢一些人。

感谢 [Matt Carroll](https://x.com/mattcarrollcode) 策划整个活动并搭建了大会网站。

感谢 [Michael Chan](https://x.com/chantastic) 以极大的热忱和活力主持了 React Conf，在整个活动中，他不仅为每个演讲者做了精心的介绍，还带来了有趣的笑话，展现出了真挚的热情。感谢 [Jorge Cohen](https://x.com/JorgeWritesCode) 主持直播，采访每位演讲者，并将现场的 React Conf 体验搬到了线上。

感谢 [Mateusz Kornacki](https://x.com/mat_kornacki)、[Mike Grabowski](https://x.com/grabbou)、[Kris Lis](https://www.linkedin.com/in/krzysztoflisakakris/) 和 [Callstack](https://www.callstack.com/) 团队共同组织 React Conf，并提供设计、工程和营销支持。感谢 [ZeroSlope 团队](https://zeroslopeevents.com/contact-us/) 的 Sunny Leggett、Tracey Harrison、Tara Larish、Whitney Pogue 和 Brianne Smythia 帮助组织活动。

感谢 [Jorge Cabiedes Acosta](https://github.com/jorge-cab)、[Gijs Weterings](https://x.com/gweterings)、[Tim Yung](https://x.com/yungsters) 和 [Jason Bonta](https://x.com/someextent) 将 Discord 中的问题带到直播中。感谢 [Lynn Yu](https://github.com/lynnshaoyu) 负责 Discord 的管理工作。感谢 [Seth Webster](https://x.com/sethwebster) 每天迎接我们；感谢 [Christopher Chedeau](https://x.com/vjeux)、[Kevin Gozali](https://x.com/fkgozali) 和 [Pieter De Baets](https://x.com/Javache) 在会后派对上为我们带来了特别寄语。

感谢 [Kadi Kraman](https://x.com/kadikraman)、[Beto](https://x.com/betomoedano) 和 [Nicolas Solerieu](https://www.linkedin.com/in/nicolas-solerieu/) 开发了大会的移动应用。感谢 [Wojtek Szafraniec](https://x.com/wojteg1337) 为大会网站提供的帮助。感谢 [Mustache](https://www.mustachepower.com/) & [Cornerstone](https://cornerstoneav.com/) 为我们提供的视觉、舞台和音响支持；感谢威斯汀酒店为我们提供的住宿。

感谢所有赞助商使本次活动得以实现：[Amazon](https://www.developer.amazon.com)、[MUI](https://mui.com/)、[Vercel](https://vercel.com/)、[Expo](https://expo.dev/)、[RedwoodSDK](https://rwsdk.com)、[Ag Grid](https://www.ag-grid.com)、[RevenueCat](https://www.revenuecat.com/)、[Resend](https://resend.com)、[Mux](https://www.mux.com/)、[Old Mission](https://www.oldmissioncapital.com/)、[Arcjet](https://arcjet.com)、[Infinite Red](https://infinite.red/) 以及 [RenderATL](https://renderatl.com)。

感谢所有与社区分享他们的知识和经验的演讲者。

最后，感谢所有现场以及在线参加大会的每一位，正是因为有你们，React 才成为了今天的 React。React 不仅仅是一个库，它更是一个社区，看到大家齐聚一堂、共同分享和学习，真是令人鼓舞。

下次见！
