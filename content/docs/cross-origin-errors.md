---
id: cross-origin-errors
title: 跨源资源共享错误
permalink: docs/cross-origin-errors.html
---

> 注意:
>
> 以下部分仅适应于开发模式下的 React。生产模式下的异常处理由常规的 try/catch 语句完成。

在[开发模式](/docs/optimizing-performance.html)下,React 使用全局事件 `错误` 处理来保留在浏览器开发者工具的 "异常时暂停" 行为。它还会将错误记录到开发者控制台.

如果错误由一个[不同的源](https://developer.mozilla.org/zh-CN/docs/Web/Security/Same-origin_policy)抛出, 浏览器将会掩盖它的细节,React也不能记录原始的错误信息。这是一个由浏览器采取的安全预防措施来避免敏感信息的泄露。

你可以抛出一个同源策略的错误来简化开发/调试模式过程。以下是一些常见的引起跨源资源共享的原因以及处理他们的方法。

### CDN {#cdn}

当从一个 CDN 加载 React （或者其他可能抛出错误的库）,在你的 `<script>` 标签中添加 [`crossorigin`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/CORS_settings_attributes)属性：

```html
<script crossorigin src="..."></script>
```

并且确保 CDN 以 `Access-Control-Allow-Origin: *` HTTP 请求头应答：

![Access-Control-Allow-Origin: *](../images/docs/cdn-cors-header.png)

### Webpack {#webpack}

#### 源码映射 {#source-maps}

一些 JavaScript 打包器可能在开发过程中以 `eval` 包装应用代码。（例如，Webpack 会用这个如果设置 [`devtool`](https://webpack.js.org/configuration/devtool/) 的值任意包含"eval"）。这个可能会引起被视为跨源错误。

如果你使用 Webpack,我们推荐在开发中使用 `cheap-module-source-map` 设置来避免这个问题。

#### 代码拆分 {#code-splitting}

如果你的应用被拆分成多个包，这些包可能会使用 JSONP被加载。这些包会被视为跨源资源，从而可能会引发错误。

为了处理这个错误, 在标签 `<script>` 中为 `crossorigin` 属性添加 [`crossOriginLoading`](https://webpack.js.org/configuration/output/#output-crossoriginloading) 设置，从而为 JSONP 生成请求。 