---
title: prerenderToNodeStream
---

<Intro>

`prerenderToNodeStream` 使用 [Node.js 流](https://nodejs.org/api/stream.html) 将 React 树渲染为静态 HTML 字符串。

```js
const {prelude, postponed} = await prerenderToNodeStream(reactNode, options?)
```

</Intro>

<InlineToc />

<Note>

此 API 针对 Node.js。具有 [Web 流](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) 的环境（例如 Deno 和现代 edge 运行时）应改用 [`prerender`](/reference/react-dom/static/prerender)。

</Note>

---

## 参考 {/*reference*/}

### `prerenderToNodeStream(reactNode, options?)` {/*prerender*/}

调用 `prerenderToNodeStream` 将应用渲染为静态 HTML。

```js
import { prerenderToNodeStream } from 'react-dom/static';

// 路由处理的语法取决于后端框架 
app.use('/', async (request, response) => {
  const { prelude } = await prerenderToNodeStream(<App />, {
    bootstrapScripts: ['/main.js'],
  });

  response.setHeader('Content-Type', 'text/plain');
  prelude.pipe(response);
});
```

在客户端，使用 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) 将服务器生成的 HTML 变为可交互。

[详见下面的更多示例。](#usage)

#### 参数 {/*parameters*/}

* `reactNode`：要渲染为 HTML 的 React 节点。例如 JSX 节点 `<App />`。它应代表整个文档，因此 `App` 组件应渲染 `<html>` 标签。

* **可选** `options`：一个用于静态生成的选项对象。
  * **可选** `bootstrapScriptContent`：若指定，该字符串会放入内联 `<script>` 标签中。
  * **可选** `bootstrapScripts`：要在页面中输出的 `<script>` 标签 URL 字符串数组。用于包含调用 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) 的脚本；如果不希望在客户端运行 React，可省略此项。
  * **可选** `bootstrapModules`：与 `bootstrapScripts` 类似，但输出的是 [`<script type="module">`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)。
  * **可选** `identifierPrefix`：React 用于 [`useId`](/reference/react/useId) 生成 ID 的字符串前缀。当页面上存在多个 root 时可避免冲突。此值必须与传给 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot#parameters) 的前缀相同。
  * **可选** `namespaceURI`：流的根 [namespace URI](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/createElementNS#important_namespace_uris) 字符串。默认是普通 HTML。若为 SVG，请传 `'http://www.w3.org/2000/svg'`；若为 MathML，请传 `'http://www.w3.org/1998/Math/MathML'`。
  * **可选** `onError`：当服务器发生错误（可恢复或不可恢复）时触发的回调。默认仅会调用 `console.error`。如果你重写它以记录崩溃报告，请确保仍然调用 `console.error`。你也可以在 shell 发出之前使用它来调整响应状态码。
  * **可选** `progressiveChunkSize`：每个 chunk 的字节数。 [了解默认启发式的更多信息。](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-server/src/ReactFizzServer.js#L210-L225)
  * **可选** `signal`：一个 [abort signal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)，可以用来 [中止 prerender](#aborting-prerendering)，并在客户端渲染剩余部分。

#### 返回 {/*returns*/}

`prerenderToNodeStream` 返回一个 Promise：
- 如果渲染成功，该 Promise 会解析为一个对象，包含：
  - `prelude`：用于 HTML 的 [Node.js 流](https://nodejs.org/api/stream.html)。你可以使用这个流按块（chunk）发送响应，也可以将整个流读取为一个字符串。
  - `postponed`: a JSON-serializeable, opaque object that can be passed to [`resumeToPipeableStream`](/reference/react-dom/server/resumeToPipeableStream) if `prerenderToNodeStream` did not finish. Otherwise `null` indicating that the `prelude` contains all the content and no resume is necessary.
- 如果渲染失败，该 Promise 将被拒绝。请参阅 [使用此方法输出 fallback（占位 UI）外壳](/reference/react-dom/server/renderToPipeableStream#recovering-from-errors-inside-the-shell)，了解如何在出错时提供占位页面。

#### 注意事项 {/*caveats*/}

在 prerender 时无法使用 `nonce` 选项。`nonce` 必须对每次请求保持唯一；如果你使用 nonce 配合 [CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP) 来保护应用，那么在 prerender 的输出中包含该 nonce 值是不合适且不安全的。

<Note>

### 何时应使用 `prerenderToNodeStream`？ {/*when-to-use-prerender*/}

静态的 `prerenderToNodeStream` API 用于静态服务器端生成（SSG）。与 `renderToString` 不同，`prerenderToNodeStream` 会等待所有数据加载完成后才 resolve，因此适合为整个页面生成包含需通过 Suspense 获取的数据的静态 HTML。若想在内容加载时就开始流式输出，请使用流式 SSR API（例如 [renderToReadableStream](/reference/react-dom/server/renderToReadableStream)）。

`prerenderToNodeStream` can be aborted and resumed later with `resumeToPipeableStream` to support partial pre-rendering.

</Note>

---

## 用法 {/*usage*/}

### 将 React 树渲染到静态 HTML 的流中 {/*rendering-a-react-tree-to-a-stream-of-static-html*/}

调用 `prerenderToNodeStream` 可将 React 树渲染为指向 [Node.js 流](https://nodejs.org/api/stream.html) 的静态 HTML：

```js [[1, 5, "<App />"], [2, 6, "['/main.js']"]]
import { prerenderToNodeStream } from 'react-dom/static';

// 路由处理的语法取决于后端框架
app.use('/', async (request, response) => {
  const { prelude } = await prerenderToNodeStream(<App />, {
    bootstrapScripts: ['/main.js'],
  });

  response.setHeader('Content-Type', 'text/plain');
  prelude.pipe(response);
});
```

除了示例中的 <CodeStep step={1}>根组件</CodeStep>，你还需要提供一组 <CodeStep step={2}>bootstrap `<script>` 路径</CodeStep>。根组件应返回**包含根 `<html>` 标签的整个文档。**

例如，它可能像这样：

```js [[1, 1, "App"]]
export default function App() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles.css"></link>
        <title>My app</title>
      </head>
      <body>
        <Router />
      </body>
    </html>
  );
}
```

React 会将 [doctype](https://developer.mozilla.org/en-US/docs/Glossary/Doctype) 与你的 <CodeStep step={2}>bootstrap `<script>` 标签</CodeStep> 注入到生成的 HTML 流中：

```html [[2, 5, "/main.js"]]
<!DOCTYPE html>
<html>
  <!-- ... 组件中的 HTML ... -->
</html>
<script src="/main.js" async=""></script>
```

在客户端，你的 bootstrap 脚本应通过调用 `hydrateRoot` 来[为整个 `document` 做 hydration：](/reference/react-dom/client/hydrateRoot#hydrating-an-entire-document)

```js [[1, 4, "<App />"]]
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

这会为服务器生成的静态 HTML 附加事件监听器，使其变为可交互。

<DeepDive>

#### 从构建产物读取 CSS 与 JS 资源路径 {/*reading-css-and-js-asset-paths-from-the-build-output*/}

构建后静态资源通常会被哈希，例如 `styles.css` 可能变为 `styles.123456.css`。哈希文件名保证每次构建的同名资源在文件内容变化时文件名也会变化，从而可以安全开启长期缓存。

如果你在构建后才能获取到最终资源名，就无法在源代码中硬编码这些路径。为此，根组件可以通过 prop 接收一个映射表来读取真实文件名：

```js {1,6}
export default function App({ assetMap }) {
  return (
    <html>
      <head>
        <title>My app</title>
        <link rel="stylesheet" href={assetMap['styles.css']}></link>
      </head>
      ...
    </html>
  );
}
```

在服务器端，渲染 `<App assetMap={assetMap} />` 并传入 `assetMap`：

```js {1-5,8,9}
// 您需要从构建工具中获取 JSON。例如，从构建输出中阅读。
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

app.use('/', async (request, response) => {
  const { prelude } = await prerenderToNodeStream(<App />, {
    bootstrapScripts: [assetMap['/main.js']]
  });

  response.setHeader('Content-Type', 'text/html');
  prelude.pipe(response);
});
```

因为现在服务器端是用 `assetMap` 渲染 `<App assetMap={assetMap} />`，客户端也需要以相同方式渲染以避免 hydration 错误。你可以像下面这样将 `assetMap` 序列化并传给客户端：

```js {9-10}
// 您需要从构建工具中获取 JSON。
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

app.use('/', async (request, response) => {
  const { prelude } = await prerenderToNodeStream(<App />, {
    // Careful: It's safe to stringify() this because this data isn't user-generated.
    bootstrapScriptContent: `window.assetMap = ${JSON.stringify(assetMap)};`,
    bootstrapScripts: [assetMap['/main.js']],
  });

  response.setHeader('Content-Type', 'text/html');
  prelude.pipe(response);
});
```

上例中 `bootstrapScriptContent` 会添加一个内联脚本，在客户端设置全局变量 `window.assetMap`，从而让客户端代码读取相同的 `assetMap`：

```js {4}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App assetMap={window.assetMap} />);
```

服务器与客户端均以相同的 `assetMap` 渲染 `App`，因此不会出现 hydration 错误。

</DeepDive>

---

### 将 React 树渲染为静态 HTML 字符串 {/*rendering-a-react-tree-to-a-string-of-static-html*/}

调用 `prerenderToNodeStream` 将应用渲染为静态 HTML 字符串：

```js
import { prerenderToNodeStream } from 'react-dom/static';

async function renderToString() {
  const {prelude} = await prerenderToNodeStream(<App />, {
    bootstrapScripts: ['/main.js']
  });

  return new Promise((resolve, reject) => {
    let data = '';
    prelude.on('data', chunk => {
      data += chunk;
    });
    prelude.on('end', () => resolve(data));
    prelude.on('error', reject);
  });
}
```

这会产生组件的初始非交互式 HTML 输出。在客户端，你需要调用 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) 来 *hydrate* 该服务器生成的 HTML，使其变为可交互。

---

### 等待所有数据加载完成 {/*waiting-for-all-data-to-load*/}

`prerenderToNodeStream` 会等待所有数据加载完成后再结束静态 HTML 的生成并 resolve。例如，考虑包含封面、侧边栏（好友与照片）和帖子列表的个人资料页：

```js
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Sidebar>
        <Friends />
        <Photos />
      </Sidebar>
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

假设 `<Posts />` 需要加载数据且耗时较长。若你希望在静态 HTML 中包含这些帖子内容，可以使用 Suspense 挂起数据，`prerenderToNodeStream` 会等待挂起内容完成后再将其包含在生成的静态 HTML 内。

<Note>

**只有支持 Suspense 的数据源才会触发 Suspense 组件。** 包括：

- 使用像 [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) 和 [Next.js](https://nextjs.org/docs/getting-started/react-essentials) 等支持 Suspense 的框架进行数据获取
- 使用 [`lazy`](/reference/react/lazy) 做按需加载的组件代码
- 使用 [`use`](/reference/react/use) 读取 Promise 的值

Suspense **不会** 检测在 Effect 或事件处理器中执行的数据请求。

如何在上例的 `Posts` 组件中加载数据取决于你使用的框架。若使用支持 Suspense 的框架，请参阅该框架的数据获取文档。

在不使用特定框架的情况下实现支持 Suspense 的数据获取尚不稳定且未文档化。用于与 Suspense 集成的数据源官方 API 将在未来的 React 版本中发布。

</Note>

---

### 中止 prerender（aborting-prerendering） {/*aborting-prerendering*/}

你可以在超时后强制 prerender “放弃”：

```js {2-5,11}
async function renderToString() {
  const controller = new AbortController();
  setTimeout(() => {
    controller.abort()
  }, 10000);

  try {
    // prelude 将包含预渲染的所有 HTML 代码
    // 在控制器终止之前。
    const {prelude} = await prerenderToNodeStream(<App />, {
      signal: controller.signal,
    });
    //...
```

任何仍未完成的 Suspense 边界会以 fallback 状态包含在 prelude 中。

This can be used for partial prerendering together with [`resumeToPipeableStream`](/reference/react-dom/server/resumeToPipeableStream) or [`resumeAndPrerenderToNodeStream`](/reference/react-dom/static/resumeAndPrerenderToNodeStream).

## Troubleshooting {/*troubleshooting*/}

### 当整个应用渲染完成之前流没有开始输出怎么办？ {/*my-stream-doesnt-start-until-the-entire-app-is-rendered*/}

`prerenderToNodeStream` 会等待整个应用渲染完成（包括所有 Suspense 边界）后再 resolve。它的设计目的是用于静态站点生成（SSG），不支持在内容加载时逐步流式输出更多内容。

若想在内容加载过程中就开始流式输出，请使用流式 SSR API，例如 [renderToPipeableStream](/reference/react-dom/server/renderToPipeableStream)。
