---
title: renderToReadableStream
---

<Intro>

`renderToReadableStream` 渲染一棵 React 树到一个 [Web 可读流](https://developer.mozilla.org/zh-CN/docs/Web/API/ReadableStream) 中。

```js
const stream = await renderToReadableStream(reactNode, options?)
```

</Intro>

<InlineToc />

<Note>

这个 API 依赖 [Web 流](https://developer.mozilla.org/zh-CN/docs/Web/API/Streams_API)，因此在 Node.js 中使用 [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) 代替。

</Note>

---

## 引用 {/*reference*/}

### `renderToReadableStream(reactNode, options?)` {/*rendertoreadablestream*/}

调用 `renderToReadableStream`，将 React 树作为 HTML 呈现为 [Web 可读流](https://developer.mozilla.org/zh-CN/docs/Web/API/ReadableStream)。

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

在客户端上，调用 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) 使服务器生成的 HTML 可交互。

[请参阅下面的更多示例](#usage)。

#### 参数 {/*parameters*/}

* `reactNode`：要渲染为HTML的React节点。例如，类似 `<App />` 的JSX元素。它应该表示整个文档，因此 `App` 组件应该渲染 `<html>` 标记。

* **可选参数** `options`：具有流选项的对象。
  * **可选参数** `bootstrapScriptContent`：如果指定，此字符串将被放置在内联 `<script>` 标记中。
  * **可选参数** `bootstrapScripts`：在页面上为 `<script>` 标签生成的字符串URL数组。使用它的话，可在 `<script>` 中调用 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot)。如果你根本不想在客户端上运行 React，请忽略它。
  * **可选参数** `bootstrapModules`：就像 `bootstrapScripts`, 但是生成 [`<script type="module">`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Modules)。
  * **可选参数** `identifierPrefix`：一个字符串前缀，React 通过 [`useId`](/reference/react/useId) 来生成 IDs。在同一页面上使用多个根时，有助于避免冲突。必须与传递给 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot#parameters) 的前缀相同。
  * **可选参数** `namespaceURI`：具有流的根[命名空间URI](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/createElementNS#important_namespace_uris)的字符串。默认为常规 HTML。如果是 SVG，传 `'http://www.w3.org/2000/svg'`，如果是 MathML，传 `'http://www.w3.org/1998/Math/MathML'`。
  * **可选参数** `nonce`：一个 [`随机字符串`](http://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/script#nonce) 让脚本通过 [`script-src` 内容安全策略](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Security-Policy/script-src)。
  * **可选参数** `onError`：无论是 [否](#recovering-from-errors-inside-the-shell) 可 [恢复](#recovering-from-errors-outside-the-shell)，只要出现服务器错误就会触发的回调。默认情况下，它只调用 `console.error`。如果你用 [log crash reports](#logging-crashes-on-the-server) 重写，请确保你仍然调用 `console.error`。你还可以使用它在 shell 发出之前 [调整状态代码](#setting-the-status-code)调整状态代码。
  * **可选参数** `progressiveChunkSize`： 块中的字节数。[阅读更多关于默认启发式的信息](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-server/src/ReactFizzServer.js#L210-L225)。
  * **可选参数** `signal`：一个 [中止信号](https://developer.mozilla.org/zh-CN/docs/Web/API/AbortSignal)，用于 [中止服务器渲染](#aborting-server-rendering) 并在客户端上渲染其余部分。


#### 返回值 {/*returns*/}

`renderToReadableStream` 返回一个 Promise：

- 如果渲染 [shell](#specifying-what-goes-into-the-shell) 成功，那么 Promise 将 resolve [Web 可读流](https://developer.mozilla.org/zh-CN/docs/Web/API/ReadableStream)。
- 如果渲染 shell 失败，Promise 将会 reject。[使用此选项可输出回滚shell](#recovering-from-errors-inside-the-shell)。

返回的流具有附加属性：

* `allReady`：一个 Promise，在所有渲染完成时 resolve，包括 [shell](#specifying-what-goes-into-the-shell) 和所有额外的 [内容](#streaming-more-content-as-it-loads)。你可以在返回响应（用于爬虫和静态生成）之前 `await stream.allReady`。如果你这样做，你就不会得到任何渐进的加载。流将包含最终的 HTML。

---

## 用法 {/*usage*/}

### 将 React 树按照 HTML 渲染成一个 Web 可读流 {/*rendering-a-react-tree-as-html-to-a-readable-web-stream*/}

调用 `renderToReadableStream` 将 React 树按照 HTML 渲染成 [Web 可读流](https://developer.mozilla.org/zh-CN/docs/Web/API/ReadableStream)：

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

除了<CodeStep step={1}>根组件</CodeStep>，你还需要提供一个<CodeStep step={2}>引导 `<script>` 路径</CodeStep>列表，你的根组件应该返回 **整个文档，包括根 `<html>` 标签** 

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

React将把 [doctype](https://developer.mozilla.org/zh-CN/docs/Glossary/Doctype) 和你的<CodeStep step={2}>引导程序 `<script>` 标签</CodeStep>注入到生成的 HTML 流中：

```html [[2, 5, "/main.js"]]
<!DOCTYPE html>
<html>
  <!-- ... HTML from your components ... -->
</html>
<script src="/main.js" async=""></script>
```

在客户端上，引导脚本应该 [通过调用 `hydrateRoot` 混合整个`document`](/reference/react-dom/client/hydrateRoot#hydrating-an-entire-document)：

```js [[1, 4, "<App />"]]
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

这将把事件侦听器附加到服务器生成的HTML，并使其具有交互性。

<DeepDive>

#### 从构建输出中读取CSS和JS资源路径 {/*reading-css-and-js-asset-paths-from-the-build-output*/}

最终的资源URL（如 JavaScript 和 CSS 文件）通常在构建后进行散列。例如，你可能最终得到的不是 `styles.css` 而是 `styles.123456.css`。散列静态资源文件名可以保证同一资源的每个不同构建都有不同的文件名。这很有用，因为它可以安全地为静态资源启用长期缓存：具有特定名称的文件永远不会更改内容。

但是，如果直到构建之后才知道资源URL，那么就无法将它们放入源代码中。例如，像前面那样将 `"/styles.css"` 硬编码到 JSX 中是行不通的。为了将它们排除在源代码之外，根组件可以从作为 prop 传递的映射中读取真实的文件名：

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

在服务器上，渲染 `<App assetMap={assetMap} />` 并用资源 URLs 传递 `assetMap`：

```js {1-5,8,9}
// You'd need to get this JSON from your build tooling, e.g. read it from the build output.
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

由于你的服务器现在正在渲染 `<App assetMap={assetMap}/>`，因此你也需要在客户端上使用 `assetMap` 来渲染它，以避免混合错误。你可以序列化 `assetMap` 并将其传递给客户端，如下所示：

```js {9-10}
// You'd need to get this JSON from your build tooling.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

async function handler(request) {
  const stream = await renderToReadableStream(<App assetMap={assetMap} />, {
    // Careful: It's safe to stringify() this because this data isn't user-generated.
    bootstrapScriptContent: `window.assetMap = ${JSON.stringify(assetMap)};`,
    bootstrapScripts: [assetMap['/main.js']],
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

在上面的示例中，`bootstrapScriptContent` 选项添加了一个额外的内联 `<script>` 标签，用于设置客户端上的全局 `window.assetMap` 变量。这允许客户端代码读取相同的 `assetMap`：

```js {4}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App assetMap={window.assetMap} />);
```

客户端和服务器都使用相同的 `assetMap` prop渲染 `App`，因此没有混合错误。

</DeepDive>

---

### 加载时流式传输更多内容 {/*streaming-more-content-as-it-loads*/}

流式传输允许用户在服务器上加载所有数据之前就开始查看内容。例如，考虑一个个人资料页面，它显示了一个封面、一个包含朋友和照片的侧边栏以及一个帖子列表：

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

想象一下，加载 `<Posts/>` 的数据需要一些时间。理想情况下，你希望在不等待帖子的情况下，向用户显示个人资料页面的其余内容。要做到这一点，[将`Posts`包装在`<Suspense>`边界中](/reference/react/Suspense#displaying-a-fallback-while-content-is-loading)：

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

这告诉 React 在 `Posts` 加载数据之前开始流式传输 HTML。React 将首先发送加载回滚的 HTML（`PostsGlimmer`），然后，当 `Posts` 完成加载其数据时，React 将发送剩余的HTML以及用该 HTML 替换加载回滚的内联 `<script>` 标记。从用户的角度来看，该页面将首先显示 `PostsGlimmer`，然后替换为 `Posts`。

你可以进一步 [嵌套`<Suspense>`边界](/reference/react/Suspense#revealing-nested-content-as-it-loads) 来创建更细粒度的加载序列：

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


在本例中，React 可以更早地开始对页面进行流式传输。只有 `ProfileLayout` 和 `ProfileCover` 必须首先完成渲染，因为它们没有封装在任何 `<Suspense>` 边界中。但是，如果 `Sidebar` 、 `Friends` 或  `Photos` 需要加载一些数据，React 将发送 HTML 以供 `BigSpinner` 回滚。然后，随着更多的数据变得可用，更多的内容将继续被显示，直到所有内容都可见。

流媒体不需要等待 React 本身在浏览器中加载，也不需要等待你的应用程序变得交互式。在加载任何 `<script>` 标记之前，服务器中的 HTML 内容将逐渐显示出来。

[阅读有关流式HTML工作原理的更多信息](https://github.com/reactwg/react-18/discussions/37)。

<Note>

**只有支持 Suspense 的数据源将会激活 Suspense 组件.** 它们包括：

- 使用支持 Suspense 的框架获取数据，如 [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) 和 [Next.js](https://nextjs.org/docs/getting-started/react-essentials)
- 用 [`lazy`](/reference/react/lazy) 来懒加载组件代码

当在 Effect 或事件处理程序内提取数据时，Suspense **不会检测到**。

在上面的 `Posts` 组件中加载数据的确切方式取决于你的框架。如果你使用一个支持 Suspense 的框架，你可以在其数据获取文档中找到详细信息。

目前还不支持在不使用已提到的框架的情况下使用 Suspense 功能的数据提取。实现支持 Suspense 数据源的要求是不稳定的并且没有文档记录。用于将数据源与 Suspense 集成的官方 API 将在 React 的未来版本中发布。

</Note>

---

### 指定进入 shell 的内容 {/*specifying-what-goes-into-the-shell*/}

应用程序中任何 `<Suspense>` 边界之外的部分称为 *shell*：

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

它确定用户可能看到的最早加载状态：

```js {3-5,13}
<ProfileLayout>
  <ProfileCover />
  <BigSpinner />
</ProfileLayout>
```

如果将整个应用程序包装到根的 `<Suspense>` 边界中，则 shell 将只包含该 spinner。然而，这并不是一种愉快的用户体验，因为在屏幕上看到一个大的 spinner 会比多等一段时间并看到真实的布局感觉更慢、更烦人。这就是为什么通常你希望放置 `<Suspense>` 边界，以便 shell 感觉 **最小但完整** ——就像整个页面布局的骨架。

对 `renderToReadableStream` 的异步调用将在渲染完整个 shell 后立即 resolve `stream`。通常，你将通过创建并返回带有 `stream` 的响应来开始流式传输。

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

当返回 `stream` 时，嵌套 `<Suspense>` 边界中的组件可能仍在加载数据。

---

### 服务器上的崩溃日志 {/*logging-crashes-on-the-server*/}

默认情况下，服务器上的所有错误都会记录到控制台。你可以覆盖此行为以记录崩溃报告：

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

### 从 shell 内部的错误中恢复 {/*recovering-from-errors-inside-the-shell*/}

在本例中，shell 包含 `ProfileLayout` 、 `ProfileCover` 和 `PostsGlimmer`：

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

如果在呈现这些组件时发生错误，React 将不会向客户端发送任何有意义的 HTML。将 `renderToReadableStream` 调用包装为 `try...catch` 发送一个不依赖于服务器渲染作为最后手段的回滚 HTML：

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

如果在生成 shell 时出现错误，`onError` 和 `catch` 块都将启动。使用 `onError` 进行错误报告，并使用 `catch` 块发送回退 HTML 文档。你的回滚 HTML 不必是错误页。相反，你可以包含一个替代 shell，该 shell 仅在客户端上呈现你的应用程序。

---

### 从 shell 外部的错误中恢复 {/*recovering-from-errors-outside-the-shell*/}

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

如果 `Posts` 组件或其内部发生错误，React 将 [尝试从中恢复](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-server-only-content)：

1. 它将为最近的 `<Suspense>` 边界（`PostsGlimmer`）触发加载回退到 HTML。
2. 它将“放弃”再尝试在服务器上呈现 `Posts` 内容。
3. 当 JavaScript 代码加载到客户端上时，React **重试** 在客户端上呈现 `Posts`。

如果在客户端上重试呈现 `Posts` **也** 失败，React 将在客户端上抛出错误。与渲染过程中抛出的所有错误一样，[最近的父级错误边界](/reference/reflect/Component#staticgetderivedstatefromwerror) 决定如何向用户显示错误。在实践中，这意味着用户将看到加载指示符，直到确定错误不可恢复为止。

如果在客户端上重试呈现 `Posts` 成功，则从服务器加载回退将被客户端呈现输出所取代。用户不会知道存在服务器错误。但是，服务器 `onError` 回调和客户端 [`onRecoverableError`](/reference/react-dom/client/hydrateRoot#hydrateroot) 回调将触发，以便你可以收到有关错误的通知。

---

### 设置状态码 {/*setting-the-status-code*/}

流传输需要权衡。你希望尽早开始流式传输页面，以便用户能够更快地看到内容。但是，一旦开始流式传输，就无法再设置响应状态代码。

通过 [把你的应用分割](#specifying-what-goes-into-the-shell) 为 shell（最重要的是 `<Suspense>` 边界）和其他内容，你已经解决了这个问题的一部分。如果 shell 出错，将运行你的 `catch` 块，该块允许你设置错误状态代码。否则，你知道应用程序可能会在客户端上恢复，所以你可以发送 "OK"。

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

如果 shell **外** 的组件（即 `<Suspense>` 边界内）抛出错误，React 将不会停止渲染。这意味着 `onError` 回调将启动，但你的代码将继续运行，而不会进入 `catch` 块。这是因为 React 将尝试从客户端的错误中恢复，[如上面的描述](#recovering-from-errors-outside-the-shell)。

但是，如果你愿意，你可以使用出现错误的事实来设置状态代码：

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

这只会捕获在生成初始 shell 内容时发生的 shell 外的错误，因此它并不详尽。如果知道某些内容是否发生错误是至关重要的，则可以将其向上移动到 shell 中。

---

### 以不同的方式处理不同的错误 {/*handling-different-errors-in-different-ways*/}

你可以 [创建自己的`Error`子类](https://javascript.info/custom-errors) 并使用 [`instanceof`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/instanceof) 运算符来检查抛出的错误。例如，你可以定义一个自定义的 `NotFoundError` 并将其从组件中抛出。然后，你可以将错误保存在 `onError` 中，并根据错误类型在返回响应之前执行不同的操作：

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

请记住，一旦发出 shell 并开始流式传输，就无法更改状态码。

---

### 正在等待加载爬虫和静态生成的所有内容 {/*waiting-for-all-content-to-load-for-crawlers-and-static-generation*/}

流媒体提供了更好的用户体验，因为用户可以在内容可用时看到内容。

但是，当爬虫访问你的页面时，或者如果你在构建时生成页面，你可能希望先加载所有内容，然后生成最终的 HTML 输出，而不是逐步显示。

你可以通过等待 `stream.allReady` Promise 来等待加载所有内容：

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
    let isCrawler = // ... depends on your bot detection strategy ...
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

普通访问者将获得一个逐渐加载的内容流。在所有数据加载之后，爬虫将接收最终的 HTML 输出。然而，这也意味着爬虫将不得不等待 **所有** 数据，其中一些数据可能加载缓慢或出错。根据你的应用程序，你也可以选择将 shell 发送给爬虫。

---

### 中止服务器渲染 {/*aborting-server-rendering*/}

可以在超时后强制服务器“放弃”渲染：

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

React  将把剩余的加载回滚刷新为 HTML，并将尝试在客户端上呈现其余部分。
