---
title: resume
---

<Intro>

`resume` 将预渲染的 React 树流式传输到 [Web 可读流](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)。

```js
const stream = await resume(reactNode, postponedState, options?)
```

</Intro>

<InlineToc />

<Note>

此 API 依赖于 [Web 流](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)。对于 Node.js，请改用 [`resumeToNodeStream`](/reference/react-dom/server/renderToPipeableStream)。

</Note>

---

## 参考 {/*reference*/}

### `resume(node, postponedState, options?)` {/*resume*/}

调用 `resume`，将预渲染的 React 树继续渲染为 HTML，并写入 [Web 可读流](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)。

```js
import { resume } from 'react-dom/server';
import {getPostponedState} from './storage';

async function handler(request, writable) {
  const postponed = await getPostponedState(request);
  const resumeStream = await resume(<App />, postponed);
  return resumeStream.pipeTo(writable)
}
```

[请参阅下面的更多示例](#usage)。

#### 参数 {/*parameters*/}

* `reactNode`：调用 `prerender` 时传入的 React 节点。例如，像 `<App />` 这样的 JSX 元素。它应表示整个文档，因此 `App` 组件应渲染 `<html>` 标签。
* `postponedState`：从 [prerender API](/reference/react-dom/static/index) 返回的不透明 `postpone` 对象，从你存储它的位置加载（例如 Redis、文件或 S3）。
* **可选** `options`：包含流式传输选项的对象。
  * **可选** `nonce`：一个 [`nonce`](http://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#nonce) 字符串，用于允许 [`script-src` 内容安全策略](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src) 中的脚本。
  * **可选** `signal`：一个 [中止信号](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)，允许你 [中止服务端渲染](#aborting-server-rendering)，并在客户端渲染剩余内容。
  * **可选** `onError`：每当发生服务端错误时触发的回调函数，无论错误是 [可恢复](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-outside-the-shell) 还是 [不可恢复](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-inside-the-shell)。默认情况下，它只调用 `console.error`。如果你重写它来 [记录崩溃报告](/reference/react-dom/server/renderToReadableStream#logging-crashes-on-the-server)，请确保仍然调用 `console.error`。


#### 返回值 {/*returns*/}

`resume` 返回一个 Promise：

- 如果 `resume` 成功生成了 [shell](/reference/react-dom/server/renderToReadableStream#specifying-what-goes-into-the-shell)，该 Promise 将解析为一个 [Web 可读流](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)，可以将其通过管道传输到 [Web 可写流](https://developer.mozilla.org/en-US/docs/Web/API/WritableStream)。
- 如果 shell 中发生错误，Promise 将因该错误而被拒绝。

返回的流还有一个额外属性：

* `allReady`：一个在所有渲染完成后解析的 Promise。你可以在返回响应之前 `await stream.allReady`，以供 [爬虫和静态生成](/reference/react-dom/server/renderToReadableStream#waiting-for-all-content-to-load-for-crawlers-and-static-generation) 使用。这样做不会有任何渐进式加载，流中将包含最终的 HTML。

#### 注意事项 {/*caveats*/}

- `resume` 不接受 `bootstrapScripts`、`bootstrapScriptContent` 或 `bootstrapModules` 选项。相反，你需要将这些选项传递给生成 `postponedState` 的 `prerender` 调用。你也可以手动将引导内容注入可写流。
- `resume` 不接受 `identifierPrefix`，因为该前缀在 `prerender` 和 `resume` 中必须保持一致。
- 由于不能向 `prerender` 提供 `nonce`，只有在没有向 `prerender` 提供脚本时，才应向 `resume` 提供 `nonce`。
- `resume` 会从根节点重新渲染，直到找到一个未完全预渲染的组件。只有完全预渲染的组件（组件及其子组件都已完成预渲染）才会被完全跳过。

## 用法 {/*usage*/}

### 恢复预渲染 {/*resuming-a-prerender*/}

<Sandpack>

```js src/App.js hidden
```

```html public/index.html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>文档</title>
</head>
<body>
  <iframe id="container"></iframe>
</body>
</html>
```

```js src/index.js
import {
  flushReadableStreamToFrame,
  getUser,
  Postponed,
  sleep,
} from "./demo-helpers";
import { StrictMode, Suspense, use, useEffect } from "react";
import { prerender } from "react-dom/static";
import { resume } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";

function Header() {
  return <header>我和我的后代都可以被预渲染</header>;
}

const { promise: cookies, resolve: resolveCookies } = Promise.withResolvers();

function Main() {
  const { sessionID } = use(cookies);
  const user = getUser(sessionID);

  useEffect(() => {
    console.log("已达到交互状态！");
  }, []);

  return (
    <main>
      你好，{user.name}！
      <button onClick={() => console.log("已完成 hydration！")}>
        点击此按钮需要先完成 hydration。
      </button>
    </main>
  );
}

function Shell({ children }) {
  // 在真实应用中，你应在此处放置 html 和 body。
  // 这里只是为了演示，使用可以包含在现有 body 中的标签。
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}

function App() {
  return (
    <Shell>
      <Suspense fallback="正在加载页眉">
        <Header />
      </Suspense>
      <Suspense fallback="正在加载主体">
        <Main />
      </Suspense>
    </Shell>
  );
}

async function main(frame) {
  // 第 1 层
  const controller = new AbortController();
  const prerenderedApp = prerender(<App />, {
    signal: controller.signal,
    onError(error) {
      if (error instanceof Postponed) {
      } else {
        console.error(error);
      }
    },
  });
  // 我们会立即在宏任务中止该过程。
  // 任何无法同步获取或无法在微任务中获取的数据，都不会完成加载。
  setTimeout(() => {
    controller.abort(new Postponed());
  });

  const { prelude, postponed } = await prerenderedApp;
  await flushReadableStreamToFrame(prelude, frame);

  // 第 2 层
  // 这里只是为了演示而等待。
  // 在真实应用中，prelude 和 postponed 状态会在第 1 层序列化，并在这一层反序列化。
  // 在 React 从预渲染中断处继续渲染的同时，prelude 内容可以立即作为普通 HTML 刷新。
  await sleep(2000);

  // 你会从传入的 HTTP 请求中获取 cookie
  resolveCookies({ sessionID: "abc" });

  const stream = await resume(<App />, postponed);

  await flushReadableStreamToFrame(stream, frame);

  // 第 3 层
  // 这里只是为了演示而等待。
  await sleep(2000);

  hydrateRoot(frame.contentWindow.document, <App />);
}

main(document.getElementById("container"));

```

```js src/demo-helpers.js
export async function flushReadableStreamToFrame(readable, frame) {
  const document = frame.contentWindow.document;
  const decoder = new TextDecoder();
  for await (const chunk of readable) {
    const partialHTML = decoder.decode(chunk);
    document.write(partialHTML);
  }
}

// 这不一定要是一个错误。
// 你可以使用其他任何方式来判断预渲染期间的错误
// 是由有意中止导致的，还是实际错误。
export class Postponed extends Error {}

// 这里只是硬编码一个会话。
export function getUser(sessionID) {
  return {
    name: "Alice",
  };
}

export function sleep(timeoutMS) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeoutMS);
  });
}
```

</Sandpack>

### 延伸阅读 {/*further-reading*/}

恢复过程的行为类似于 `renderToReadableStream`。有关更多示例，请参阅 [`renderToReadableStream` 的用法部分](/reference/react-dom/server/renderToReadableStream#usage)。
[`prerender` 的用法部分](/reference/react-dom/static/prerender#usage) 包含专门介绍如何使用 `prerender` 的示例。
