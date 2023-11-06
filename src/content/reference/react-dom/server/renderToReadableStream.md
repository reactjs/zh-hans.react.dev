---
title: renderToReadableStream
---

<Intro>

`renderToReadableStream` 将 React 树渲染后发送至 [Web 可读流](https://developer.mozilla.org/zh-CN/docs/Web/API/ReadableStream)。

```js
const stream = await renderToReadableStream(reactNode, options?)
```

</Intro>

<InlineToc />

<Note>

这个 API 依赖 [Web 流](https://developer.mozilla.org/zh-CN/docs/Web/API/Streams_API)，因此在 Node.js 中使用 [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) 代替。

</Note>

---

## 参考 {/*reference*/}

### `renderToReadableStream(reactNode, options?)` {/*rendertoreadablestream*/}

调用 `renderToReadableStream`，将 React 树渲染为 HTML 后，发送至 [Web 可读流](https://developer.mozilla.org/zh-CN/docs/Web/API/ReadableStream) 中。

```js
import { renderToReadableStream } from 'react-dom/server';

async function handler(request) {
  const stream = await renderToReadableStream(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

在客户端上，调用 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) 使服务器生成的 HTML 变得可交互。

[请参阅下面的更多示例](#usage)。

#### 参数 {/*parameters*/}

* `reactNode`：要渲染为 HTML 的 React 节点。例如，类似 `<App />` 的 JSX 元素。它应该表示整个文档，因此 `App` 组件应该渲染 `<html>` 标签。

* **可选参数** `options`：一个对象，用于对流进行配置。
  * **可选属性** `bootstrapScriptContent`：如果指定了这个属性值，那么这个字符串会被放置在内联 `<script>` 标签中。
  * **可选属性** `bootstrapScripts`：一个字符串 URL 的数组， 用于在页面上生成 `<script>` 标签。使用它的话，可在 `<script>` 中调用 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot)。如果你根本不想在客户端上运行 React，则忽略它。
  * **可选属性** `bootstrapModules`：就像 `bootstrapScripts`, 但不同的是，生成 [`<script type="module">`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Modules) 标签。
  * **可选属性** `identifierPrefix`：一个字符串前缀，React 通过 [`useId`](/reference/react/useId) 来生成 ID。在同一页面上使用多个根组件时，有助于避免冲突。必须与传递给 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot#parameters) 的前缀相同。
  * **可选属性** `namespaceURI`：是一个字符串，带有流的根 [命名空间URI](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/createElementNS#important_namespace_uris)。默认为常规 HTML。如果用于 SVG，传入 `'http://www.w3.org/2000/svg'`，如果用于 MathML，传入 `'http://www.w3.org/1998/Math/MathML'`。
  * **可选属性** `nonce`：一个 [`nonce`](http://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/script#nonce) 字符串，用以使脚本通过 [`script-src` 内容安全策略](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Security-Policy/script-src)。
  * **可选属性** `onError`：一个回调函数，只要服务器出错就会触发，无论错误是 [否](#recovering-from-errors-inside-the-shell) 可 [恢复](#recovering-from-errors-outside-the-shell)。默认情况下，它只调用 `console.error`。如果你用 [log crash reports](#logging-crashes-on-the-server) 重写，请确保你仍然调用 `console.error`。你还可以使用它在 shell 触发之前 [调整状态代码](#setting-the-status-code)。
  * **可选属性** `progressiveChunkSize`：块中的字节数。[阅读更多默认启发式方法](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-server/src/ReactFizzServer.js#L210-L225)。
  * **可选属性** `signal`：一个 [中止信号](https://developer.mozilla.org/zh-CN/docs/Web/API/AbortSignal)，用于 [中止服务端渲染](#aborting-server-rendering) 并在客户端上渲染其余部分。


#### 返回值 {/*returns*/}

`renderToReadableStream` 返回一个 Promise：

- 如果渲染 [shell](#specifying-what-goes-into-the-shell) 成功，那么 Promise 将 resolve [Web 可读流](https://developer.mozilla.org/zh-CN/docs/Web/API/ReadableStream)。
- 如果渲染 shell 失败，Promise 将 reject。[使用这个输出后备 shell ](#recovering-from-errors-inside-the-shell)。

返回的流具有附加属性：

* `allReady`：一个 Promise，在所有的渲染完成后 resolve，包括 [shell](#specifying-what-goes-into-the-shell) 和所有额外的 [内容](#streaming-more-content-as-it-loads)。你可以在响应爬虫和静态资源之前执行 `await stream.allReady`，这样就不会得到任何渐进的加载内容，流会包含最终的 HTML。

---

## 用法 {/*usage*/}

### 将 React 树渲染为 HTML 并发送至 Web 可读流 {/*rendering-a-react-tree-as-html-to-a-readable-web-stream*/}

调用 `renderToReadableStream` 将 React 渲染为 HTML 并发送至 [Web 可读流](https://developer.mozilla.org/zh-CN/docs/Web/API/ReadableStream)：

```js [[1, 4, "<App />"], [2, 5, "['/main.js']"]]
import { renderToReadableStream } from 'react-dom/server';

async function handler(request) {
  const stream = await renderToReadableStream(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

除了 <CodeStep step={1}>根组件</CodeStep>，你还需要提供 <CodeStep step={2}>启动 `<script>` 路由</CodeStep> 列表，你的根组件应该返回 **包括根 `<html>` 标签的整个 document** 

例如，它可能是这样的：

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

React 将把 [doctype](https://developer.mozilla.org/zh-CN/docs/Glossary/Doctype) 和你的 <CodeStep step={2}>启动 `<script>` 标签</CodeStep> 注入到生成的 HTML 流中：

```html [[2, 5, "/main.js"]]
<!DOCTYPE html>
<html>
  <!-- ... 来自于组件的 HTML ... -->
</html>
<script src="/main.js" async=""></script>
```

在客户端上，启动脚本应该 [用 `hydrateRoot` 混合整个 `document` ](/reference/react-dom/client/hydrateRoot#hydrating-an-entire-document)：

```js [[1, 4, "<App />"]]
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

如此一来，监听事件就挂到了服务器生成的 HTML 上，就可以交互了。

<DeepDive>

#### 从构建输出中读取 CSS 和 JS 的资源路径 {/*reading-css-and-js-asset-paths-from-the-build-output*/}

最终的资源 URL（像 JavaScript 和 CSS 文件）通常在构建后进行散列。例如，你可能最终得到的不是 `styles.css` 而是 `styles.123456.css`。散列静态资源文件名可以保证同一资源的每个不同构建都有不同的文件名。这个方案是有用处的，因为它可以安全地为静态资源开启长期缓存：有了特定名字的文件，其内容就永远不会变。

但是，如果构建之后才能知道静态资源的 URL，那就无法将它们放到源代码中。例如，像前面那样将 `"/styles.css"` 硬编码到 JSX 中是行不通的。为了将它们保持在源代码之外，根组件可以从 prop 传递的映射中读取真实文件名：

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

在服务器上，渲染 `<App assetMap={assetMap} />` 并用资源 URL 传递 `assetMap`：

```js {1-5,8,9}
// 你需要从构建工具中获得这个 JSON，例如，从构建输出中读取。
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

async function handler(request) {
  const stream = await renderToReadableStream(<App assetMap={assetMap} />, {
    bootstrapScripts: [assetMap['/main.js']]
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

因为服务器正在渲染 `<App assetMap={assetMap}/>`，所以客户端上也需使用 `assetMap` 来渲染，以避产生混合错误。你可以序列化 `assetMap` 并将其传递给客户端，如下所示：

```js {9-10}
// 你需要从构建工具中获得这个 JSON。
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

async function handler(request) {
  const stream = await renderToReadableStream(<App assetMap={assetMap} />, {
    // 注意：序列化是安全的，因为这个数据不是用户生成的。
    bootstrapScriptContent: `window.assetMap = ${JSON.stringify(assetMap)};`,
    bootstrapScripts: [assetMap['/main.js']],
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

在上面的示例中，`bootstrapScriptContent` 配置项添加了一个额外的内联 `<script>` 标签，用于设置客户端上的全局变量 `window.assetMap`。这允许客户端代码读取相同的 `assetMap`：

```js {4}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App assetMap={window.assetMap} />);
```

因为客户端和服务器都使用相同的 `assetMap` prop 渲染 `App`，因此没有混合错误。

</DeepDive>

---

### 加载时，流传输更多内容 {/*streaming-more-content-as-it-loads*/}

流式传输允许用户在服务器上加载所有数据前就开始查看内容。例如，有一个个人资料页面，它显示一个封面、一个包含朋友和照片的侧边栏和一个帖子列表：

```js
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Sidebar>
        <Friends />
        <Photos />
      </Sidebar>
      <Posts />
    </ProfileLayout>
  );
}
```

想象一下，加载 `<Posts/>` 的数据是需要一些时间的。理想情况是希望在不等帖子内容返回的情况下，向用户显示个人资料页面的其余内容。要做到这一点，需要 [将 `Posts` 包裹在 `<Suspense>` 边界里](/reference/react/Suspense#displaying-a-fallback-while-content-is-loading)：

```js {9,11}
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

告诉 React 在 `Posts` 加载数据之前开始流式传输 HTML。React 将首先发送加载后备 HTML（`PostsGlimmer`），然后，当 `Posts` 完成数据加载后，React 将发送剩余的 HTML，并用该 HTML 替换之前替代内联 `<script>` 标签的后备方案。从用户视角看，该页面会首先显示 `PostsGlimmer` 的内容，然后被替换为 `Posts` 的内容。

你可以进一步 [嵌套 `<Suspense>` 边界](/reference/react/Suspense#revealing-nested-content-as-it-loads) 来创建更细粒度的加载序列：

```js {5,13}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<BigSpinner />}>
        <Sidebar>
          <Friends />
          <Photos />
        </Sidebar>
        <Suspense fallback={<PostsGlimmer />}>
          <Posts />
        </Suspense>
      </Suspense>
    </ProfileLayout>
  );
}
```


在本例中，React 可以更早地开始对页面进行流式传输。只有 `ProfileLayout` 和 `ProfileCover` 是必须先完成渲染的，因为它们没有封装进任何 `<Suspense>` 边界中。但是，如果 `Sidebar`、`Friends` 或 `Photos` 需要加载一些数据，React 将发送 HTML 以供回退 `BigSpinner`。然后，随着更多的数据变得可用，更多的内容将会被显示，直到所有的内容都可见。

在浏览器中，流不需要等待 React 自身的加载，也不需等待应用变得可交互。在任何 `<script>` 标签加载之前，来自服务器中的 HTML 内容将会逐步的显示出来。

[阅读流式 HTML 工作原理的更多信息](https://github.com/reactwg/react-18/discussions/37)。

<Note>

**只有支持 Suspense 的数据源将会激活 Suspense 组件**。它们包括：

- 使用支持 Suspense 的框架获取数据，如 [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) 和 [Next.js](https://nextjs.org/docs/getting-started/react-essentials)
- 用 [`lazy`](/reference/react/lazy) 来懒加载组件代码
- 使用 [`use`](/reference/react/use) 读取 Promise 的值

suspense **不会去探测** Effect 内部或事件处理器中获取的数据。

在上面的 `Posts` 组件中加载数据的具体方式取决于你的框架。如果你使用一个支持 Suspense 的框架，你可以在其数据获取文档中找到详细信息。

目前还不支持在不使用已提到的框架的情况下使用 Suspense 功能的数据提取。实现支持 Suspense 数据源的需求不稳定且没有记录。用 Suspense 集成数据源的官方 API 将在 React 的未来版本中发布。

</Note>

---

### 指定放入 shell 的内容 {/*specifying-what-goes-into-the-shell*/}

应用中任何 `<Suspense>` 边界之外的部分称为 *shell*：

```js {3-5,13,14}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<BigSpinner />}>
        <Sidebar>
          <Friends />
          <Photos />
        </Sidebar>
        <Suspense fallback={<PostsGlimmer />}>
          <Posts />
        </Suspense>
      </Suspense>
    </ProfileLayout>
  );
}
```

它决定了用户可以看到的最早的载入状态：

```js {3-5,13}
<ProfileLayout>
  <ProfileCover />
  <BigSpinner />
</ProfileLayout>
```

如果将整个应用包装进根组件的 `<Suspense>` 边界中，则 shell 将只包括 spinner。但这种用户体验不好，因为在屏幕上看到一个大 spinner 会比多等一段时间看到真实的布局感觉更慢、更烦人。这就是为什么通常希望放置 `<Suspense>` 边界，以便 shell 看起来是 **最小但完整** 的——就像一整个页面布局的骨架。

只要整个 shell 被渲染了，异步调用 `renderToReadableStream` 会 resolve 一个 `stream`。通常情况下，可以创建并返回带有 `stream` 的响应来开始流式传输。

```js {5}
async function handler(request) {
  const stream = await renderToReadableStream(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

当返回 `stream` 时，嵌套在 `<Suspense>` 里的组件可能仍在加载数据。

---

### 服务器上的崩溃日志 {/*logging-crashes-on-the-server*/}

默认情况下，服务器上的所有错误都会被记录到控制台。你可以覆盖此行为，来记录崩溃报告：

```js {4-7}
async function handler(request) {
  const stream = await renderToReadableStream(<App />, {
    bootstrapScripts: ['/main.js'],
    onError(error) {
      console.error(error);
      logServerCrashReport(error);
    }
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

如果你提供了自定义的 `onError` 实现，请不要忘记像上面那样将错误记录到控制台。

---

### shell 内部，从报错中恢复程序 {/*recovering-from-errors-inside-the-shell*/}

在本例中，shell 包含 `ProfileLayout`、`ProfileCover` 和 `PostsGlimmer`：

```js {3-5,7-8}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

如果在渲染这些组件时发生错误，React 将不会向客户端发送任何有意义的 HTML。将 `renderToReadableStream` 的调用放到 `try...catch` 里，发送一个不依赖服务端渲染的回滚 HTML 作为最后的后备方案：

```js {2,13-18}
async function handler(request) {
  try {
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        console.error(error);
        logServerCrashReport(error);
      }
    });
    return new Response(stream, {
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>Something went wrong</h1>', {
      status: 500,
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

如果在生成 shell 时出错，`onError` 和 `catch` 都会被触发。用 `onError` 报告错误，并用 `catch` 发送后备 HTML。你的后备 HTML 不一定必须是个错误页面。相反，你可以返回一个替代的 shell，这个 shell 只在客户端上渲染你的应用。

---

### shell 外部，从报错中恢复程序 {/*recovering-from-errors-outside-the-shell*/}

在本例中，`<Posts/>` 组件被包装在 `<Suspense>` 中，因此它不是 shell 的一部分：

```js {6}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

If an error happens in the `Posts` component or somewhere inside it, React will [try to recover from it:](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-client-only-content)

1. 它将为最近的 `<Suspense>` 边界（`PostsGlimmer`）触发加载中的后备方案到 HTML。
2. 它将 **放弃** 再尝试在服务器上渲染 `Posts`。
3. 当 JavaScript 代码加载到客户端上时，React **重新尝试** 在客户端上渲染 `Posts`。

如果在客户端上重新尝试渲染 `Posts` **也** 失败，React 将在客户端上抛出错误。与渲染过程中抛出的所有错误一样，[最近的父级错误边界](/reference/reflect/Component#staticgetderivedstatefromwerror) 决定如何向用户展示错误。在实践中，这意味着用户将看到加载指示符，直到确定错误不可恢复为止。

如果在客户端上重新尝试渲染 `Posts` 成功，则从服务器加载中的后备方案将被客户端渲染的输出所取代。用户不会知道有服务器错误。但是，服务器的 `onError` 回调和客户端的 [`onRecoverableError`](/reference/react-dom/client/hydrateRoot#hydrateroot) 回调将被触发，以便你可以收到有关错误通知。

---

### 设置状态码 {/*setting-the-status-code*/}

流传输需要权衡利弊。你希望尽早开始流式传输页面，以便用户能够更快地看到内容。但是，一旦开始流式传输，就无法再设置响应状态码。

通过 [把你的应用分割](#specifying-what-goes-into-the-shell) 为 shell（最重要的是 `<Suspense>` 边界）和其他内容，你已经解决了这个问题的一部分。如果 shell 出错，会运行你的 `catch` 块，允许你设置错误状态码。否则，应用可能会在客户端上恢复，所以你可以发送 **OK**。

```js {11}
async function handler(request) {
  try {
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        console.error(error);
        logServerCrashReport(error);
      }
    });
    return new Response(stream, {
      status: 200,
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>Something went wrong</h1>', {
      status: 500,
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

如果 shell **外** 的组件（即 `<Suspense>` 边界内）抛出错误，React 将不会停止渲染。这意味着会触发 `onError` 回调，但你的代码会继续运行，不会进入 `catch` 块。这是因为 React 将尝试从客户端的错误中恢复，[就像上面描述的那样](#recovering-from-errors-outside-the-shell)。

但是，如果你愿意，你可以使用出现错误的实际情况来设置状态码：

```js {3,7,13}
async function handler(request) {
  try {
    let didError = false;
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        didError = true;
        console.error(error);
        logServerCrashReport(error);
      }
    });
    return new Response(stream, {
      status: didError ? 500 : 200,
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>Something went wrong</h1>', {
      status: 500,
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

这只会捕获 shell 外的报错，那些报错发生在生成初始 shell 内容时，所以它没有具体的报错信息。如果知道某些内容是否发生错误是很重要的，则可以将其向上移动到 shell 中。

---

### 以不同的方式处理不同的错误 {/*handling-different-errors-in-different-ways*/}

你可以 [创建自己的 `Error` 子类](https://javascript.info/custom-errors) 并使用 [`instanceof`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/instanceof) 运算符来检查抛出的错误。例如，你可以自定义一个 `NotFoundError` 并将其从组件中抛出。然后，你可以将错误保存在 `onError` 中，并根据错误类型在返回响应之前执行不同的操作：

```js {2-3,5-15,22,28,33}
async function handler(request) {
  let didError = false;
  let caughtError = null;

  function getStatusCode() {
    if (didError) {
      if (caughtError instanceof NotFoundError) {
        return 404;
      } else {
        return 500;
      }
    } else {
      return 200;
    }
  }

  try {
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        didError = true;
        caughtError = error;
        console.error(error);
        logServerCrashReport(error);
      }
    });
    return new Response(stream, {
      status: getStatusCode(),
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>Something went wrong</h1>', {
      status: getStatusCode(),
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

记住，一旦发出 shell 并开始流传输，就无法更改状态码。

---

### 等待加载所有爬虫和静态生成的内容 {/*waiting-for-all-content-to-load-for-crawlers-and-static-generation*/}

流提供了更好的用户体验，因为用户可以在内容可用时看到内容。

但是，当爬虫访问你的页面时，或者如果你在构建时生成页面，你可能希望先加载所有内容，然后生成最终的 HTML 输出，而不是逐步显示。

你可以等 `stream.allReady` Promise 来加载所有内容：

```js {12-15}
async function handler(request) {
  try {
    let didError = false;
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        didError = true;
        console.error(error);
        logServerCrashReport(error);
      }
    });
    let isCrawler = // ... 取决于你的机器人检测策略 ...
    if (isCrawler) {
      await stream.allReady;
    }
    return new Response(stream, {
      status: didError ? 500 : 200,
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>Something went wrong</h1>', {
      status: 500,
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

普通访问者将获得一个逐步加载的流。所有数据加载之后，爬虫将接收最终的 HTML 输出。然而，这也意味着爬虫将不得不等待 **所有** 数据，其中一些数据可能加载缓慢或出错。根据你的应用，你也可以选择将 shell 发给爬虫。

---

### 中止服务端渲染 {/*aborting-server-rendering*/}

可以在超时后强制服务器 **放弃** 渲染：

```js {3,4-6,9}
async function handler(request) {
  try {
    const controller = new AbortController();
    setTimeout(() => {
      controller.abort();
    }, 10000);

    const stream = await renderToReadableStream(<App />, {
      signal: controller.signal,
      bootstrapScripts: ['/main.js'],
      onError(error) {
        didError = true;
        console.error(error);
        logServerCrashReport(error);
      }
    });
    // ...
```

React 会把剩余的加载中的后备方案刷新为 HTML，并尝试在客户端上渲染其余部分。
