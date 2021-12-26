---
title: 'React DOM 不再支持 IE 8'
author: [sophiebits]
---

自从 2013 年的发布, React 就支持所有现代浏览器，包括 Internet Explorer 8 及其之后的版本。我们处理了许多旧版浏览器所存在的不同之处，包括了事件系统的差异，这样在编写应用代码时就无需担心浏览器的差异问题。

如今，Microsoft [已停止支持旧版 IE](https://www.microsoft.com/en-us/WindowsForBusiness/End-of-IE-support)。从 React v15 起，我们也将停止 React DOM 对 IE 8 的支持。我们听说大部分用 React DOM 的应用已经不支持旧版的 Internet Explorer，所以这个决定应该不会影响太多人。这个决定将帮助我们快速开发以及完善 React DOM。(我们不会立刻积极去除关于 IE 8 的代码，不过我们也不会优先处理新举报的有关问题。如果你需要 IE 8 的支持，我们建议你采用 React v0.14 版本。)

在未来的时间里 React DOM 将继续支持 IE 9 及其后的版本。
