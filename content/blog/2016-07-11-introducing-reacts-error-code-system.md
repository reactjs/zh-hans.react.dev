---
title: "推出 React 错误代码系统"
author: [keyanzhang]
---

营造更好的开发者体验一直是 React 十分关心的事之一, 而其中很重要的一部分就是可以早早察觉反面模式或可能会出现的错误而显示有用的提示。但是, 这些大都只会在开发环境里看到。在生产环境中, 为了减少字节发送的数量,我们尽量避免多余的断言以及完整的错误提示。

在此发布版之前，我们会在构建时去除错误提示，这就是为什么您可能在生产环境中看到过这样的提示 :

> Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.

为了简便生产环境的调试，我们将在[15.2.0](https://github.com/facebook/react/releases/tag/v15.2.0)推出错误代码系统。我们开发了一个 [gulp 脚本](https://github.com/facebook/react/blob/master/scripts/error-codes/gulp-extract-errors.js)来集合所有 `不变性的` 错误提示然后转化为一个 [JSON 文件](https://github.com/facebook/react/blob/master/scripts/error-codes/codes.json)。在打包时 Babel 会用这个 JSON 来对照与其对应的错误 ID 然后[重写](https://github.com/facebook/react/blob/master/scripts/error-codes/replace-invariant-error-codes.js)所有生产环境中 `不变性的` 错误提示。当生产环境中出现问题时， React 显示的错误提示将会包含一个附有错误 ID 以及相关讯息的 URL 。这个 URL 将带您到我们文档中的一页来去看原本错误提示的重组。

虽然我们不预期您会经常看到错误提示，但您可以到[这里](/docs/error-decoder.html?invariant=109&args[]=Foo)去参考它的运作方式。以上同样的错误提示会被显示为：

> Minified React error #109; visit [https://reactjs.org/docs/error-decoder.html?invariant=109&args[]=Foo](/docs/error-decoder.html?invariant=109&args[]=Foo) for the full message or use the non-minified dev environment for full errors and additional helpful warnings.

我们这样做是为了让开发者的体验越来越好，同时尽可能的不扩大生产环境的 bundle 尺寸。此功能不需要您做任何改变 — 只要在生产环境中用 `min.js` 或用 `process.env.NODE_ENV === 'production'` 来打包您的应用程序就可以了!
