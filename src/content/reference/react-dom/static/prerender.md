---
title: prerender
---

<Intro>

`prerender` 使用 [Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) 将 React 树渲染为静态 HTML 字符串。

```js
const {prelude} = await prerender(reactNode, options?)
```

</Intro>

<InlineToc />

<Note>

此 API 依赖于 [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)。对于 Node.js，请使用 [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream)。

</Note>

---

## 参考 {/*reference*/}

### `prerender(reactNode, options?)` {/*prerender*/}

调用 `prerender` 将应用程序渲染为静态 HTML。

```js
import { prerender } from 'react-dom/static';

async function handler(request) {
  const {prelude} = await prerender(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(prelude, {
    headers: { 'content-type': 'text/html' },
  });
}
```

在客户端，调用 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) 将服务器生成的 HTML 转换为可交互的内容。

[请参阅下面的更多示例。](#usage)

#### 参数 {/*parameters*/}

* `reactNode`：需要渲染为 HTML 的 React 节点。例如，一个像 `<App />` 的 JSX 节点。它应表示整个文档，因此 App 组件应渲染 `<html>` 标签。

* **可选** `options`：一个包含静态生成选项的对象。
  * **可选** `bootstrapScriptContent`：如果指定，此字符串将被放置在一个内联的 `<script>` 标签中。
  * **可选** `bootstrapScripts`：一个字符串 URL 的数组，用于在页面上生成 `<script>` 标签。使用此选项包含调用 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) 的 `<script>`。如果不希望在客户端运行 React，可以省略此选项。
  * **可选** `bootstrapModules`：类似于 `bootstrapScripts`，但会生成 [`<script type="module">`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)。
  * **可选** `identifierPrefix`：React 用于 [`useId`](/reference/react/useId) 生成的 ID 的字符串前缀。当在同一页面上使用多个根时，这对于避免冲突非常有用。必须与传递给 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot#parameters) 的前缀相同。
  * **可选** `namespaceURI`：流的根 [命名空间 URI](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS#important_namespace_uris) 的字符串。默认为常规 HTML。对于 SVG，请传递 `'http://www.w3.org/2000/svg'`；对于 MathML，请传递 `'http://www.w3.org/1998/Math/MathML'`。
  * **可选** `onError`：每当发生服务器错误时触发的回调，无论是 [可恢复的](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-outside-the-shell) 还是 [不可恢复的](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-inside-the-shell)。默认情况下，它只调用 `console.error`。如果你重写它用来 [记录崩溃报告](/reference/react-dom/server/renderToReadableStream#logging-crashes-on-the-server) ，请确保仍然调用 `console.error`。你还可以使用它在 shell 被生成之前 [调整状态码](/reference/react-dom/server/renderToReadableStream#setting-the-status-code)。
  * **可选** `progressiveChunkSize`：每个块的字节数。[阅读更多关于默认启发式的信息。](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-server/src/ReactFizzServer.js#L210-L225)
  * **可选** `signal`：一个 [中止信号](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)，允许你 [中止预渲染](#aborting-prerendering) 并在客户端渲染剩余内容。

#### 返回值 {/*returns*/}

`prerender` 返回一个 Promise 对象：
- 如果渲染成功，Promise 将解析为一个包含以下内容的对象：
  - `prelude`：一个 [Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) 的 HTML。你可以使用此流以块的形式发送响应，或者将整个流读取为字符串。
- 如果渲染失败，Promise 将被拒绝。[使用此方法输出一个回退 shell。](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-inside-the-shell)

#### Caveats {/*caveats*/}

`nonce` is not an available option when prerendering. Nonces must be unique per request and if you use nonces to secure your application with [CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP) it would be inappropriate and insecure to include the nonce value in the prerender itself.


<Note>

### 何时使用 `prerender` ？ {/*when-to-use-prerender*/}

静态 `prerender` API 用于静态服务器端生成 (SSG)。与 `renderToString` 不同， `prerender` 会等待所有数据加载完成后再解析。这使其适合为整个页面生成静态 HTML，包括需要通过 Suspense 获取的数据。要在加载内容时进行流式传输，请使用流式服务器端渲染 (SSR) API，例如 [renderToReadableStream](/reference/react-dom/server/renderToReadableStream)。

</Note>

---

## 用法 {/*usage*/}

### 将 React 树渲染为静态 HTML 流 {/*rendering-a-react-tree-to-a-stream-of-static-html*/}

调用 `prerender` 将 React 树渲染为静态 HTML，并生成一个 [可读的 Web 流](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)：

```js [[1, 4, "<App />"], [2, 5, "['/main.js']"]]
import { prerender } from 'react-dom/static';

async function handler(request) {
  const {prelude} = await prerender(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(prelude, {
    headers: { 'content-type': 'text/html' },
  });
}
```

与 <CodeStep step={1}>根组件</CodeStep>一起, 你需要提供一组 <CodeStep step={2}> 引导 `<script>` 路径 </CodeStep>。 根组件应返回 **包含 `<html>` 标签** 的整个文档。

例如，它可能看起来像这样：

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

React 将会把 [doctype](https://developer.mozilla.org/en-US/docs/Glossary/Doctype) 和 <CodeStep step={2}>引导 `<script>` 标签</CodeStep> 注入到生成的 HTML 流中：

```html [[2, 5, "/main.js"]]
<!DOCTYPE html>
<html>
  <!-- ... HTML from your components ... -->
</html>
<script src="/main.js" async=""></script>
```

在客户端，引导脚本应 [通过调用 `hydrateRoot` 来对整个 `文档` 进行初始化：](/reference/react-dom/client/hydrateRoot#hydrating-an-entire-document)

```js [[1, 4, "<App />"]]
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

这将为静态服务器生成的 HTML 附加事件监听器，使其具有交互性。

<DeepDive>

#### 从构建产物中读取 CSS 和 JS 资源路径 {/*reading-css-and-js-asset-paths-from-the-build-output*/}

最终的资源 URL（如 JavaScript 和 CSS 文件）通常在构建后会被哈希处理。例如，`styles.css` 可能会变成 `styles.123456.css`。对静态资源文件名进行哈希处理可以确保每次构建的相同资源都会有不同的文件名。这很有用，因为它允许你安全地为静态资源启用长期缓存：具有特定名称的文件内容永远不会更改。

然而，如果在构建完成之前无法知道资源的 URL，就无法将它们直接写入源代码。例如，像之前那样在 JSX 中硬编码 `"/styles.css"` 是不可行的。为了避免将它们写入源代码，根组件可以通过一个传递的属性读取真实的文件名映射。

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

在服务器上，渲染 `<App assetMap={assetMap} />` 并传递包含资源 URL 的 `assetMap` ：

```js {1-5,8,9}
// 需要从构建工具中获取此 JSON，例如从构建输出中读取。
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

async function handler(request) {
  const {prelude} = await prerender(<App assetMap={assetMap} />, {
    bootstrapScripts: [assetMap['/main.js']]
  });
  return new Response(prelude, {
    headers: { 'content-type': 'text/html' },
  });
}
```

由于服务器现在正在渲染 `<App assetMap={assetMap} />`，你还需要在客户端使用 `assetMap` 进行渲染，以避免交互初始化时的错误。可以通过序列化并将 `assetMap` 递给客户端，如下所示：

```js {9-10}
// 需要从构建工具中获取此 JSON。
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

async function handler(request) {
  const {prelude} = await prerender(<App assetMap={assetMap} />, {
    // 注意：将其使用 stringify() 是安全的，因为这些数据不是用户产生的。
    bootstrapScriptContent: `window.assetMap = ${JSON.stringify(assetMap)};`,
    bootstrapScripts: [assetMap['/main.js']],
  });
  return new Response(prelude, {
    headers: { 'content-type': 'text/html' },
  });
}
```

在上面的示例中， `bootstrapScriptContent` 选项会添加一个额外的内联 `<script>` 标签，在客户端设置全局变量 `window.assetMap` 。这使客户端代码能够读取相同的 `assetMap` ：

```js {4}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App assetMap={window.assetMap} />);
```

客户端和服务器都使用相同的 `assetMap` 属性渲染 `App` ，因此不会出现交互初始化时的错误。

</DeepDive>

---

### 将 React 树渲染为静态 HTML 字符串 {/*rendering-a-react-tree-to-a-string-of-static-html*/}

调用 `prerender` 将应用程序渲染为静态 HTML 字符串：

```js
import { prerender } from 'react-dom/static';

async function renderToString() {
  const {prelude} = await prerender(<App />, {
    bootstrapScripts: ['/main.js']
  });

  const reader = prelude.getReader();
  let content = '';
  while (true) {
    const {done, value} = await reader.read();
    if (done) {
      return content;
    }
    content += Buffer.from(value).toString('utf8');
  }
}
```

这将生成 React 组件的初始非交互式 HTML 输出。在客户端，你需要调用 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) 来 *初始化* 服务器生成的 HTML，并使其具有交互功能。

---

### 等待所有数据加载 {/*waiting-for-all-data-to-load*/}

`prerender` 会等待所有数据加载完成后再结束静态 HTML 的生成并解析。例如，考虑一个展示封面、包含好友和照片的侧边栏，以及帖子列表的个人资料页面：

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

假设 `<Posts />` 需要加载一些数据，这可能会花费一些时间。理想情况下，你希望在帖子加载完成后再将其包含在 HTML 中。为此，可以使用 Suspense 来暂停数据加载，而 `prerender` 会等待挂起的内容加载完成后再生成静态 HTML。

<Note>

**只有支持 Suspense 的数据源才能触发 Suspense 组件。** 包括：

- 使用支持 Suspense 的框架（如：[Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) 和 [Next.js](https://nextjs.org/docs/getting-started/react-essentials)）进行数据获取 
- 使用 [`lazy`](/reference/react/lazy) 懒加载组件代码
- 使用 [`use`](/reference/react/use) 获取 Promise 的结果

Suspense **无法** 检测在 Effect 或事件处理程序中获取的数据。

在上述 `Posts` 组件中加载数据的具体方式取决于你使用的框架。如果你使用支持 Suspense 的框架，可以在其数据获取文档中找到详细信息。

在没有使用特定框架的情况下，支持 Suspense 的数据获取尚未得到支持。实现支持 Suspense 的数据源的要求目前不稳定且未记录。React 未来版本将发布用于集成数据源与 Suspense 的官方 API。

</Note>

---

### 中止预渲染 {/*aborting-prerendering*/}

可以通过设置超时，来强制“终止”预渲染进程：


```js {2-5,11}
async function renderToString() {
  const controller = new AbortController();
  setTimeout(() => {
    controller.abort()
  }, 10000);

  try {
    // the prelude will contain all the HTML that was prerendered
    // before the controller aborted.
    const {prelude} = await prerender(<App />, {
      signal: controller.signal,
    });
    //...
```

所有包含未完成子组件的 Suspense 边界都将以 fallback 状态包含在 prelude 中。

---

## 疑难解答 {/*troubleshooting*/}

### 我的流要等到整个应用渲染完成后才会启动。 {/*my-stream-doesnt-start-until-the-entire-app-is-rendered*/}

`prerender` 的响应会等待整个应用渲染完成，包括所有 Suspense 边界的内容加载完成后，才会解析。这种设计适用于静态站点生成（SSG），并不支持在内容加载时进行流式加载。

如果需要在内容加载时进行流式加载，可以使用类似 [renderToReadableStream](/reference/react-dom/server/renderToReadableStream) 的流式服务器渲染 API。
