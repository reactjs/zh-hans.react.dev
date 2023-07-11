---
title: "回顾 React Conf 2021"
---

2021 年 12 月 17 日 [Jesslyn Tannady](https://twitter.com/jtannady) 与 [Rick Hanlon](https://twitter.com/rickhanlonii)

---

<Intro>

上周，我们举办了第六届 React Conf。在以往的几年中，我们在 React Conf 的舞台上发布了行业改变的信息，如 [**React Native**](https://engineering.fb.com/2015/03/26/android/react-native-bringing-modern-web-techniques-to-mobile/) 和 [**React Hooks**](https://reactjs.org/docs/hooks-intro.html)。今年，我们从发布 React 18 和逐步采用并发功能开始，分享了我们对 React 的多平台愿景。

</Intro>

---

这是 React Conf 首次在线举办，并且免费直播，并翻译成 8 种不同的语言。来自世界各地的参与者参加了我们的会议 Discord 和针对所有时区都可访问的重播活动。超过 50000 人注册，19 场演讲总共有超过 60000 次观看，Discord 平台上两个活动共有 5000 名参与者。

所有的演讲都可以 [在线播放](https://www.youtube.com/watch?v=FZ0cG47msEk&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa)。

以下是大会分享内容的摘要：

## React 18 和并发特性 {/*react-18-and-concurrent-features*/}

在主题演讲中，我们分享了从 React 18 开始对未来 React 的愿景。

在没有引入任何重大的破坏性变化的情况下，React 18 添加了期待已久的并发渲染器和对 Suspense 的更新。应用程序可以升级到 React 18 并开始逐步采用并发功能，其工作量与任何其他主要版本相当。

**这意味着没有并发模式，只有并发功能**。

在主题演讲中，我们还分享了对 Suspense、服务器组件、新 React 工作组的愿景，以及对 React Native 的长期多平台愿景。

请在此处观看 [Andrew Clark](https://twitter.com/acdlite)、[Juan Tejada](https://twitter.com/_jstejada)、[Lauren Tan](https://twitter.com/potetotes) 和 [Rick Hanlon](https://twitter.com/rickhanlonii) 的完整主题演讲：

<YouTubeIframe src="https://www.youtube.com/embed/FZ0cG47msEk" />

## 面向应用程序开发人员的 React 18 {/*react-18-for-application-developers*/}

在主题演讲中，我们还宣布 React 18 RC 现已可供试用。在等待进一步的反馈之前，这是我们将于明年初发布稳定版的 React 版本。

要尝试 React 18 RC，请升级你的依赖项：

```bash
npm install react@rc react-dom@rc
```

并切换到新的 **createRoot** API：

```js
// 切换前
const container = document.getElementById('root');
ReactDOM.render(<App />, container);

// 切换后
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App/>);
```

有关升级到 React 18 的演示，请参阅 [Shruti Kapoor](https://twitter.com/shrutikapoor08) 的演讲：

<YouTubeIframe src="https://www.youtube.com/embed/ytudH8je5ko" />

## Suspense 串流服务端渲染 {/*streaming-server-rendering-with-suspense*/}

React 18 还包括使用 Suspense 对服务端渲染性能的改进。

串流服务端渲染允许你从服务器上的 React 组件生成 HTML，并将该 HTML 流式传输给用户。在 React 18 中，你可以使用 **Suspense** 将应用程序分解为更小的独立单元，这些单元可以彼此独立地进行流式传输，而不会阻塞应用程序的其余部分。这意味着用户将更快地看到你的内容，并能够更快地开始与之交互。

如需深入了解，请参阅 [Shaundai Person](https://twitter.com/shaundai) 的演讲：

<YouTubeIframe src="https://www.youtube.com/embed/pj5N-Khihgc" />

## 第一个 React 工作组 {/*the-first-react-working-group*/}

对于 React 18，我们创建了第一个工作组，与专家、开发人员、库维护人员和教育工作者小组合作。我们共同制定了逐步采用策略并完善了新的 API，例如 **useId**、**useSyncExternalStore** 和 **useInsertionEffect**。

有关这项工作的概述，请参阅 [Aakansha' Doshi](https://twitter.com/aakansha1216) 的演讲：

<YouTubeIframe src="https://www.youtube.com/embed/qn7gRClrC9U" />

## React 开发者工具 {/*react-developer-tooling*/}

为了支持此版本中的新功能，我们还宣布了新成立的 React DevTools 团队和新的 Timeline Profiler，以帮助开发人员调试他们的 React 应用程序。

有关新 DevTools 功能的更多信息和演示，请参阅 [Brian Vaughn](https://twitter.com/brian_d_vaughn) 的演讲：

<YouTubeIframe src="https://www.youtube.com/embed/oxDfrke8rZg" />

## 没有 memo 的 React {/*react-without-memo*/}

展望未来，[Xuan Huang (黄玄)](https://twitter.com/Huxpro) 分享了我们的 React Labs 对自动记忆编译器的研究的更新。查看此演讲以获取更多信息和编译器原型的演示：

<YouTubeIframe src="https://www.youtube.com/embed/lGEMwh32soc" />

## React 文档主题演讲 {/*react-docs-keynote*/}

[Rachel Nabors](https://twitter.com/rachelnabors) 开始了有关 React 学习和设计的部分演讲，并发表了关于我们对 React 新文档（[现已作为 React.dev 发布](/blog/2023/03/16/introducing-react-dev)）的投入的主题演讲：

<YouTubeIframe src="https://www.youtube.com/embed/mneDaMYOKP8" />

## 以及更多 {/*and-more*/}

**我们还听到了有关使用 React 进行学习和设计的演讲**：

* 由 Debbie O'Brien 演讲的 [Things I learnt from the new React docs](https://youtu.be/-7odLW_hG7s)。
* 由 Sarah Rainsberger 演讲的 [Learning in the Browser](https://youtu.be/5X-WEQflCL0)。
* 由 Linton Ye 演讲的 [The ROI of Designing with React](https://youtu.be/7cPWmID5XAk)。
* 由 Delba de Oliveira 演讲的 [Interactive playgrounds with React](https://youtu.be/zL8cz2W0z34)。

**来自 Relay、React Native 和 PyTorch 团队的演讲**：

* 由 Robert Balicki 演讲的 [Re-introducing Relay](https://youtu.be/lhVGdErZuN4)。
* 由 Eric Rozell 和 Steven Moyes 演讲的 [React Native Desktop](https://youtu.be/9L4FFrvwJwY)。
* 由 Roman Rädle 演讲的 [On-device Machine Learning for React Native](https://youtu.be/NLj73vrc2I8)。

**社区中关于可访问性、工具和服务器组件的演讲**：

* 由 Daishi Kato 演讲的 [React 18 for External Store Libraries](https://youtu.be/oPfSC5bQPR8)。
* 由 Diego Haz 演讲的 [Building Accessible Components in React 18](https://youtu.be/dcm8fjBfro8)。
* 由 Tafu Nakazaki 演讲的 [Accessible Japanese Form Components with React](https://youtu.be/S4a0QlsH0pU).
* 由 Lyle Troxell 演讲的 [UI tools for artists](https://youtu.be/b3l4WxipFsE)。
* 由 Helen Lin 演讲的 [Hydrogen + React 18](https://youtu.be/HS6vIYkSNks)。

## 感谢 {/*thank-you*/}

这是我们自己策划会议的第一年，我们要感谢很多人。

首先，感谢所有演讲者 [Aakansha Doshi](https://twitter.com/aakansha1216),、 [Andrew Clark](https://twitter.com/acdlite)、[Brian Vaughn](https://twitter.com/brian_d_vaughn)、[Daishi Kato](https://twitter.com/dai_shi)、[Debbie O'Brien](https://twitter.com/debs_obrien)、[Delba de Oliveira](https://twitter.com/delba_oliveira)、[Diego Haz](https://twitter.com/diegohaz)、[Eric Rozell](https://twitter.com/EricRozell)、[Helen Lin](https://twitter.com/wizardlyhel)、[Juan Tejada](https://twitter.com/_jstejada)、[Lauren Tan](https://twitter.com/potetotes)、[Linton Ye](https://twitter.com/lintonye)、[Lyle Troxell](https://twitter.com/lyle)、[Rachel Nabors](https://twitter.com/rachelnabors)、[Rick Hanlon](https://twitter.com/rickhanlonii)、[Robert Balicki](https://twitter.com/StatisticsFTW)、[Roman Rädle](https://twitter.com/raedle)、[Sarah Rainsberger](https://twitter.com/sarah11918)、[Shaundai Person](https://twitter.com/shaundai)、[Shruti Kapoor](https://twitter.com/shrutikapoor08)、[Steven Moyes](https://twitter.com/moyessa)、[Tafu Nakazaki](https://twitter.com/hawaiiman0) 和 [Xuan Huang (黄玄)](https://twitter.com/Huxpro)。

感谢所有为会谈提供反馈的人，包括  [Andrew Clark](https://twitter.com/acdlite)、[Dan Abramov](https://twitter.com/dan_abramov)、[Dave McCabe](https://twitter.com/mcc_abe)、[Eli White](https://twitter.com/Eli_White)、[Joe Savona](https://twitter.com/en_JS)、 [Lauren Tan](https://twitter.com/potetotes)、[Rachel Nabors](https://twitter.com/rachelnabors) 和 [Tim Yung](https://twitter.com/yungsters)。

感谢 [Lauren Tan](https://twitter.com/potetotes) 组织了 Discord 会议并担任我们的 Discord 管理员。

感谢 [Seth Webster](https://twitter.com/sethwebster) 对总体方向的反馈，并确保我们专注于多样性和包容性。

感谢 [Rachel Nabors](https://twitter.com/rachelnabors) 领导我们的审核工作，感谢 [Aisha Blake](https://twitter.com/AishaBlake) 创建我们的审核指南、领导我们的审核团队、培训翻译人员和审核人员以及帮助审核这两项活动。

感谢我们的会议主席 [Jesslyn Tannady](https://twitter.com/jtannady)、[Suzie Grange](https://twitter.com/missuze)、[Becca Bailey](https://twitter.com/beccaliz)、[Luna Wei](https://twitter.com/lunaleaps)、[Joe Previte](https://twitter.com/jsjoeio)、[Nicola Corti](https://twitter.com/Cortinico)、[Gijs Weterings](https://twitter.com/gweterings)、[Claudio Procida](https://twitter.com/claudiopro)、Julia Neumann、Mengdi Chen、Jean Zhang、Ricky Li 和 [Xuan Huang (黄玄)](https://twitter.com/Huxpro)。

感谢来自 [React India](https://www.reactindia.io/) 的 [Manjula Dube](https://twitter.com/manjula_dube)、[Sahil Mhapsekar](https://twitter.com/apheri0) 和 Vihang Patel，以及来自 [React China](https://twitter.com/ReactChina) 的 [Jasmine Xie](https://twitter.com/jasmine_xby)、[QiChang Li](https://twitter.com/QCL15) 和 [YanLun Li](https://twitter.com/anneincoding) 帮助主持我们的重播活动并保持其对社区的吸引力。

感谢 Vercel 发布了会议网站所基于的 [虚拟活动入门套件](https://vercel.com/virtual-event-starter-kit)，并感谢 [Lee Robinson](https://twitter.com/leeerob) 和 [Delba de Oliveira](https://twitter.com/delba_oliveira) 分享了他们举办 Next.js Conf 的经验。

感谢 [Leah Silber](https://twitter.com/wifelette) 分享她举办会议的经验、从举办 [RustConf](https://rustconf.com/) 中学到的知识，以及她的书 [《事件驱动》](https://leanpub.com/eventdriven/) 及其包含的关于举办会议的建议。

感谢 [Kevin Lewis](https://twitter.com/_phzn) 和 [Rachel Nabors](https://twitter.com/rachelnabors) 分享了她们举办 Women of React Conf 的经验。

感谢 [Aakansha Doshi](https://twitter.com/aakansha1216)、[Laurie Barth](https://twitter.com/laurieontech)、[Michael Chan](https://twitter.com/chantastic) 和 [Shaundai Person](https://twitter.com/shaundai) 在整个规划过程中提供的建议和想法。

感谢 [Dan Lebowitz](https://twitter.com/lebo) 帮助设计和构建会议网站和门票。

感谢 Laura Podolak Waddell、Desmond Osei-Acheampong、Mark Rossi、Josh Toberman 以及 Facebook 视频制作团队的其他人员录制了主题演讲和 Meta 员工演讲的视频。

感谢我们的合作伙伴 HitPlay 帮助组织会议、编辑直播中的所有视频、翻译所有演讲以及以多种语言主持 Discord。

最后，感谢所有参与者让本次 React Conf 变得精彩！
