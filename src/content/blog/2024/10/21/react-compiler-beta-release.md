---
title: "React Compiler 发布 Beta 版本"
author: Lauren Tan
date: 2024/10/21
description: 在 React Conf 2024 上，我们宣布了 React Compiler 的实验性版本，这是一个构建时工具，可通过自动记忆化来优化 React 应用程序。在这篇文章中，我们想分享开源的下一步发展，以及我们在编译器方面的进展。

---

October 21, 2024 by [Lauren Tan](https://twitter.com/potetotes).

---

<Intro>

React 团队很高兴分享新的内容：

</Intro>

1. 今天我们发布了 React Compiler Beta 版本，以便早期采用者和库维护者可以尝试它并提供反馈。
2. 我们通过可选的 `react-compiler-runtime` 包来正式支持在 React 17+ 上的应用程序使用 React Compiler。
3. 我们正在开放 [React Compiler 工作组](https://github.com/reactwg/react-compiler) 的公共成员资格，为社区逐步采用该编译器做好准备。

---

在 [React Conf 2024](/blog/2024/05/22/react-conf-2024-recap) 上，我们宣布了 React Compiler 的实验版本，这是一个构建时工具，可通过自动记忆化来优化 React 应用程序。[你可以在这里找到对 React Compiler 的介绍](/learn/react-compiler)。

自第一个版本以来，我们修复了 React 社区报告的许多错误, 收到了多个高质量的错误修复和对编译器的贡献 [^1]，使编译器能够更好地适应多种 JavaScript 模式，并继续在 Meta 上更广泛地推出编译器。

在这篇文章中，我们想分享 React Compiler 的下一步发展。

## 从今天起开始尝试 React Compiler Beta 版本吧 {/*try-react-compiler-beta-today*/}

在 [React India 2024](https://www.youtube.com/watch?v=qd5yk2gxbtg) 上，我们分享了 React Compiler 的更新。今天，我们很高兴地宣布 React Compiler 和 ESLint 插件的新 Beta 版本。新的测试版使用 `@beta` 标签发布到 npm。

使用下面的方式来安装 React Compiler Beta 版本：

<TerminalBlock>
npm install -D babel-plugin-react-compiler@beta eslint-plugin-react-compiler@beta
</TerminalBlock>

或者使用 Yarn：

<TerminalBlock>
yarn add -D babel-plugin-react-compiler@beta eslint-plugin-react-compiler@beta
</TerminalBlock>

你可以在此处观看 [Sathya Gunasekaran](https://twitter.com/_gsathya) 在 React India 的演讲：

<YouTubeIframe src="https://www.youtube.com/embed/qd5yk2gxbtg" />

## 从今天起我们建议大家使用 React Compiler linter {/*we-recommend-everyone-use-the-react-compiler-linter-today*/}

React Compiler 的 ESLint 插件可帮助开发人员主动识别和纠正对于 [React 规则](/reference/rules) 的违规行为。**我们强烈建议大家从今天开始就使用 linter**。linter 不需要安装编译器，因此即使你还没有准备好尝试编译器，也可以独立使用它。

安装 linter 只需要执行：

<TerminalBlock>
npm install -D eslint-plugin-react-compiler@beta
</TerminalBlock>

或者使用 Yarn：

<TerminalBlock>
yarn add -D eslint-plugin-react-compiler@beta
</TerminalBlock>

安装后你可以通过[将其添加到 ESLint 配置](/learn/react-compiler#installing-eslint-plugin-react-compiler) 来启用 linter。使用 linter 有助于发现破坏 React 规则的地方，从而在编译器完全发布后更容易采用它。

## 向后兼容性 {/*backwards-compatibility*/}

React Compiler 生成的代码依赖于 React 19 中添加的运行时 API，但我们后来添加了对 React 17 和 18 的支持。如果你还没有使用 React 19，在 Beta 版本中可以通过在 compiler 配置中设置 `target` 来使用 React Compiler，并添加 `react-compiler-runtime` 作为依赖项。[你可以在这里找到相关文档](/learn/react-compiler#using-react-compiler-with-react-17-or-18)。

## 在库中使用 React Compiler {/*using-react-compiler-in-libraries*/}

我们的初始版本侧重于识别在应用程序中使用编译器的主要问题。从那时起我们得到了很好的反馈，并对编译器进行了实质性改进。我们现在已准备好接受社区的广泛反馈，并让库作者尝试编译器以提高性能和维护体验。

React Compiler 还可以用来编译库。由于 React Compiler 需要在代码转换之前的源码上运行，因此应用程序无法使用 pipeline 来编译所使用的库。因此我们建议库维护人员使用编译器独立编译和测试他们的库，并将编译后的代码发布到 npm。

由于库的代码是预编译的，因此用户无需启用 Compiler 即可从编译器的自动记忆化中受益。如果库的 target 不是 React 19，请指定一个最小的 [`target` 并且将 `react-compiler-runtime` 添加为直接依赖](#using-react-compiler-with-react-17-or-18)。这个运行时包将根据应用程序的版本使用正确的 API 实现，并在必要时填充缺失的 API。

[你可以在此处找到更多相关文档。](/learn/react-compiler#using-the-compiler-on-libraries)

## 向所有人开放 React Compiler 工作组 {/*opening-up-react-compiler-working-group-to-everyone*/}

我们之前在 React Conf 上宣布成立邀请制的 [React Compiler 工作组](https://github.com/reactwg/react-compiler) 以提供反馈、提出问题并就编译器的实验版本进行协作。

从今天开始，随着 React Compiler 的测试版发布，我们向所有人开放工作组成员资格。React Compiler 工作组的目标是为生态系统做好准备，以便现有应用程序和库顺利、逐步采用 React Compiler。请继续在 [React 仓库中](https://github.com/facebook/react) 提交错误报告，但是在 [工作组论坛](https://github.com/reactwg/react-compiler/discussions) 中留下反馈、提出问题或分享想法。

核心团队还将使用工作组论坛来分享我们的研究成果。随着稳定版本的临近，任何重要信息也将发布在该论坛上。

## React Compiler 在 Meta {/*react-compiler-at-meta*/}

在 [React Conf](/blog/2024/05/22/react-conf-2024-recap) 上，我们分享了在 Quest Store 和 Instagram 上成功推出编译器的消息。从那时起，我们在包括 [Facebook](https://www.facebook.com) 和 [Threads](https://www.threads.net) 的几个主要 Web 应用程序中部署了 React Compiler。这意味着如果你最近使用过这些应用程序中的任何一个，你的体验可能是由编译器提供支持的。我们能够在包含超过 100,000 个 React 组件的 monorepo 中将这些应用程序加载到编译器上，只需进行少量代码更改。

我们发现所有这些应用程序的性能都有显着提高。随着编译器的推出，我们将继续看到 [之前在 ReactConf 上分享的成功经验](https://youtu.be/lyEKhv8-3n0?t=3223) 的结果。多年来 Meta 工程师和 React 专家对这些应用程序经过了大量手工调整和优化，因此即使是几个百分点的改进对我们来说也是一个巨大的胜利。

我们还预计 React Compiler 会提高开发人员的生产力。为了衡量这一点，我们与 Meta[^2] 的数据科学合作伙伴合作，将手动记忆化对生产力的影响进行了彻底的统计分析。在 Meta 推出编译器之前，我们发现只有大约 8% 的 React PR 使用手动记忆化，并且这些 PR 的编写时间比其他 PR 增加了 31-46%[^3]。这证实了我们的直觉，即手动记忆化会带来认知开销，我们预计 React Compiler 将带来更高效的代码创作和审查。值得注意的是，React Compiler 还确保默认情况下记忆 **所有** 代码，而不仅仅是（在我们的例子中）开发人员明确记忆化的 8%。

## 稳定版本路线图 {/*roadmap-to-stable*/}

**这不是最终的路线图，可能会发生变化。**

我们打算在 Beta 版本发布后不久发布编译器的候选版本，届时大多数遵循 React 规则的应用程序和库已被证明可以与编译器良好配合。经过一段时间的社区最终反馈后，我们计划为编译器提供稳定版本。稳定版本将标志着 React 新基础的开始，强烈建议所有应用程序和库使用编译器和 ESLint 插件。

* ✅ 实验性（Experimental）：在 React Conf 2024 上发布，主要是为了获得早期采用者的反馈。 
* ✅ 公开测试版（Public Beta）：现已推出，以获取更广泛社区的反馈。
* 🚧 候选发布版（RC）： React Compiler 适用于大多数遵循规则的应用程序和库，不会引入任何问题。
* 🚧 普遍适用（General Availability）：在社区的最终反馈期结束后。

这些版本还包括编译器的 ESLint 插件，该插件提供编译器静态分析的诊断信息。我们计划将现有的 eslint-plugin-react-hooks 插件与编译器的 ESLint 插件结合起来，因此最终只需要安装一个插件。

稳定后，我们计划在少改动甚至不改动产品代码的情况下添加更多对编译器的优化和改进，这包括了对自动记忆化的持续优化和新的整体优化。升级到每个新版本的编译器都是为了更加简单明了，每次升级都将继续提高性能并更好地处理不同的 JavaScript 和 React 模式。

在整个过程中，我们还计划为 React 制作一个 IDE 扩展原型。研究还处于早期阶段，因此我们希望能够在未来的 React Labs 博客文章中与你分享更多我们的发现。

---

感谢 [Sathya Gunasekaran](https://twitter.com/_gsathya)、[Joe Savona](https://twitter.com/en_JS)、[Ricky Hanlon](https://twitter.com/rickhanlonii)、[Alex Taylor](https://github.com/alexmckenley)、[Jason Bonta](https://twitter.com/someextent) 和 [Eli White](https://twitter.com/Eli_White) 对本篇博客的审阅和编辑。

---

[^1]: 感谢 [@nikeee](https://github.com/facebook/react/pulls?q=is%3Apr+author%3Anikeee)、[@henryqdineen](https://github.com/facebook/react/pulls?q=is%3Apr+author%3Ahenryqdineen)、[@TrickyPi](https://github.com/facebook/react/pulls?q=is%3Apr+author%3ATrickyPi) 以及其他为编译器做出贡献的人。

[^2]: 感谢 [Vaishali Garg](https://www.linkedin.com/in/vaishaligarg09) 在 Meta 领导这项关于 React 编译器的研究，并审阅这篇文章。

[^3]: 在平衡了作者任期、代码 diff 长度和复杂性以及其他潜在的混杂因素之后。