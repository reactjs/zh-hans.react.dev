---
title: "推出 React 错误代码系统"
author: [keyanzhang]
---

营造更好的开发者体验一直是 React 十分关心的事之一，而其中很重要的部分就是可以及早察觉反模式或潜在的错误并给出有用的提示。但是，这些大都只会在开发环境里看到。在生产环境中，为了减少字节发送的数量，我们尽量避免出现多余的断言以及完整的错误提示。

在此发布版之前，我们会在构建时去除错误提示，这就是为什么你会在生产环境中看到这样的提示：

> Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.

<<<<<<< HEAD
为了简化生产环境的调试，我们将在 [15.2.0](https://github.com/facebook/react/releases/tag/v15.2.0) 推出错误代码系统。我们开发了一个[脚本](https://github.com/facebook/react/blob/master/scripts/error-codes/extract-errors.js)来集合所有 `invariant` 错误提示然后转化为一个 [JSON 文件](https://github.com/facebook/react/blob/master/scripts/error-codes/codes.json)。在打包时 Babel 会用这个 JSON 来对照与其对应的错误 ID 然后[重写](https://github.com/facebook/react/blob/master/scripts/error-codes/transform-error-messages.js)所有生产环境中 `invariant` 错误提示。当生产环境中出现问题时，React 显示的错误提示将会包含一个附有错误 ID 以及相关讯息的 URL。这个 URL 将带你到我们文档中的一页来去看原本错误提示的重组。
=======
In order to make debugging in production easier, we're introducing an Error Code System in [15.2.0](https://github.com/facebook/react/releases/tag/v15.2.0). We developed a [script](https://github.com/facebook/react/blob/main/scripts/error-codes/extract-errors.js) that collects all of our `invariant` error messages and folds them to a [JSON file](https://github.com/facebook/react/blob/main/scripts/error-codes/codes.json), and at build-time Babel uses the JSON to [rewrite](https://github.com/facebook/react/blob/main/scripts/error-codes/transform-error-messages.js) our `invariant` calls in production to reference the corresponding error IDs. Now when things go wrong in production, the error that React throws will contain a URL with an error ID and relevant information. The URL will point you to a page in our documentation where the original error message gets reassembled.
>>>>>>> 0bb0303fb704147452a568472e968993f0729c28

虽然我们不预期你会经常看到错误提示，但你可以到[这里](/docs/error-decoder.html?invariant=109&args[]=Foo)去参考它的运作方式。以上同样的错误提示会被显示为：

> Minified React error #109; visit [https://reactjs.org/docs/error-decoder.html?invariant=109&args[]=Foo](/docs/error-decoder.html?invariant=109&args[]=Foo) for the full message or use the non-minified dev environment for full errors and additional helpful warnings.

我们这样做是为了让开发者的体验越来越好，同时尽可能的不扩大生产环境的 bundle 尺寸。此功能不需要你做任何改变 —— 只要在生产环境中用 `min.js` 或用 `process.env.NODE_ENV === 'production'` 来打包你的应用程序就可以了!
