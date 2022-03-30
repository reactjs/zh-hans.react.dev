---
id: javascript-environment-requirements
title: JavaScript 环境要求
layout: docs
category: Reference
permalink: docs/javascript-environment-requirements.html
---

React 18 支持所有现代浏览器（Edge, Firefox, Chrome, Safari 等）。

如果你支持旧的浏览器和设备，如果 Internet Explorer，它们没有提供原生的现代浏览器特性，或有些不符合标准的实现，你可以考虑在应用程序中引入一个全局的 polyfill。

以下是 React 18 使用的现代浏览器特性的列表：
- [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [`Symbol`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
- [`Object.assign`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)

这些特性的 polyfill 取决于你的环境，对于大部分用户来说，你可以配置你的 [Browserlist](https://github.com/browserslist/browserslist)。对于其他用户，你可能需要直接引入类似于 [`core-js`](https://github.com/zloirock/core-js) 这样的 polyfills。
