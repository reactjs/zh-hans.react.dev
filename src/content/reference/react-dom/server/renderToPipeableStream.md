---
title: renderToPipeableStream
---

<Intro>

`renderToPipeableStream` 将一个 React 组件树渲染为管道化（pipeable）的 [Node.js 流](https://nodejs.org/api/stream.html)。

```js
const { pipe, abort } = renderToPipeableStream(reactNode, options?)
```

</Intro>

<InlineToc />

<Note>

这个 API 是专供 Node.js 使用的。像 Deno 这类可以支持 [Web 流](https://developer.mozilla.org/zh-CN/docs/Web/API/Streams_API) 的新式非主流运行时环境，应该使用另一个 API [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream)。

</Note>

---

## 参考 {/*reference*/}

### `renderToPipeableStream(reactNode, options?)` {/*rendertopipeablestream*/}

调用 `renderToPipeableStream` 以 React 组件树渲染为 HTML 后注入 [Node.js 流](https://nodejs.org/api/stream.html#writable-streams)。

```js
import { renderToPipeableStream } from 'react-dom/server';

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  }
});
```

在客户端，调用 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) 以让服务端生成的 HTML 中的绑定事件生效，进而让其变得可交互。

[参见下方更多示例](#usage)。

#### 参数 {/*parameters*/}

* `reactNode`：想要将其渲染为 HTML 的 React 节点，比如像 `<App />` 这样的 JSX 元素。这样做意味着整个页面文档都将被渲染，所以这里提到的 `App` 组件将渲染 `<html>` 标签.

* **可选** `options`：用于配置流的对象.
  * **可选** `bootstrapScriptContent`：指定一个字符串，这个字符串将被放入 `<script>` 标签中作为其内容。 
  * **可选** `bootstrapScripts`：一个 URL 字符串数组，它们将被转化为 `<script>` 标签嵌入页面。请将那些调用了 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) 的 `<script>` 对应的 URL 放入这个数组中。但是如果你不想让客户都端运行 React 的话，请省略这个参数。
  * **可选** `bootstrapModules`：和 `bootstrapScripts` 相似，但是嵌入页面的是 [`<script type="module">`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Modules)。
  * **可选** `identifierPrefix`：一个字符串前缀，用于由 [`useId`](/reference/react/useId) 生成的 id。在同一页面下的多人协作场景中会很有用，它能够很好地避免命名冲突。但是注意使用 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot#parameters) 时也要加上同样的前缀。
  * **可选** `namespaceURI`：一个字符串，指定与流相关联的 [命名空间 URI](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/createElementNS#important_namespace_uris)。默认是常规的 HTML。可以传入 `'http://www.w3.org/2000/svg'` 指定为 SVG，或者传入 `'http://www.w3.org/1998/Math/MathML'` 指定为 MathML。
  * **可选** `nonce`：[`nonce`](http://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/script#nonce) 一个字符串，能为脚本设置跨域限制，即 [`script-src` 浏览器内容安全策略](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Security-Policy/script-src)。
  * **可选** `onAllReady`：一个回调函数，将会在所有渲染完成时触发，包括 [shell](#specifying-what-goes-into-the-shell) 和所有额外的 [content](#streaming-more-content-as-it-loads)。你可以用这个替代 `onShellReady` [用于爬虫和静态内容生成](#waiting-for-all-content-to-load-for-crawlers-and-static-generation)。如果在此处开启了流式传输，所有的 HTML 都会被包含在流中直接返回，而不会有任何渐进的加载。
  * **可选** `onError`：一个回调函数，只要是出现了异常错误，无论这是 [可恢复的](#recovering-from-errors-outside-the-shell) 还是 [不可恢复的](#recovering-from-errors-inside-the-shell)，它都会触发。默认情况下，它只会调用 `console.error`。如果你想要将它重写为 [日志崩溃报告](#logging-crashes-on-the-server)，记得仍然要使用 `console.error` 为可能不兼容的场景兜底。你也可以在 shell 发送之前使用它来 [修改状态码](#setting-the-status-code)。
  * **可选** `onShellReady`：一个回调函数，在 [shell 初始化](#specifying-what-goes-into-the-shell) 渲染后立即调用。你可以 [设置状态码](#setting-the-status-code) 然后在这里调用 `pipe` 方法启用流式传输。这样一来，React 将会初始化 shell 渲染完毕后，通过上面提到的 `<script>` 进行 [流式传输更多内容](#streaming-more-content-as-it-loads)，用这些内容替换掉 HTML 的加载中的后备方案。
  * **可选** `onShellError`：一个回调函数，在初始化 shell 发生错误渲染时调用。它的第一个参数将自动接收捕获到的异常错误。此时，这个流中的任何内容都不会被发送，并且 `onShellReady` 和 `onAllReady` 都不会被调用，所以你还可以 [输出一段后备 HTML shell](#recovering-from-errors-inside-the-shell) 作为兜底。
  * **可选** `progressiveChunkSize`：一个块中的字节数。[查阅更多关于该参数默认值的信息](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-server/src/ReactFizzServer.js#L210-L225)。


#### 返回值 {/*returns*/}

`renderToPipeableStream` 返回一个包含了两个方法的对象：

* `pipe` 将一段 HTML 输出到 [Node.js 可写流中](https://nodejs.org/api/stream.html#writable-streams)。如果你想启用流式传输，那么可以在 `onShellReady` 中调用 `pipe`；如果要做爬虫和静态内容生成的话，那么可以在 `onAllReady` 中调用它。
* `abort` 使你 [终止服务端渲染](#aborting-server-rendering) 然后在客户端渲染未处理的部分。

---

## 用法 {/*usage*/}

### 将 React 组件树渲染为 HTML 并形成 Node.js 流 {/*rendering-a-react-tree-as-html-to-a-nodejs-stream*/}

调用 `renderToPipeableStream` 将 React 组件树渲染为 HTML 后注入 [Node.js 流](https://nodejs.org/api/stream.html#writable-streams)。

```js [[1, 5, "<App />"], [2, 6, "['/main.js']"]]
import { renderToPipeableStream } from 'react-dom/server';

// 路由的具体语法由你所使用的后端技术决定
app.use('/', (request, response) => {
  const { pipe } = renderToPipeableStream(<App />, {
    bootstrapScripts: ['/main.js'],
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  });
});
```

除了 <CodeStep step={1}>根组件</CodeStep> 之外，还需要提供一个列表，其元素是 <CodeStep step={2}>`<script>` 的资源路径</CodeStep>。注意根组件应该返回 **包含了 `<html>` 标签的完整的页面文档结构**。

更具体一点地说，就像是下面这样：

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

React 将会把 [文档类型](https://developer.mozilla.org/zh-CN/docs/Glossary/Doctype) 和 <CodeStep step={2}>`<script>` 标签</CodeStep> 注入到输出的 HTML 流中：

```html [[2, 5, "/main.js"]]
<!DOCTYPE html>
<html>
  <!-- ... 由你的组件产生的 HTML ... -->
</html>
<script src="/main.js" async=""></script>
```

在客户端，你的 script 将会 [通过调用 `hydrateRoot` 对整个 `页面文档` 进行 hydrate](/reference/react-dom/client/hydrateRoot#hydrating-an-entire-document)：

```js [[1, 4, "<App />"]]
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

上述过程让客户端开始监听服务端生成的 HTML 中绑定的事件，然后这些事件才能真正在客户端生效。

<DeepDive>

#### 从构建输出产物中读取 CSS 和 JS 资源路径 {/*reading-css-and-js-asset-paths-from-the-build-output*/}

在打包构建之后，最终的资源的 URL（比如 JavaScript 和 CSS 文件）总是被哈希映射处理过。举个例子，`styles.css` 最终可能会变成 `styles.123456.css`。被哈希处理过的资源文件名称能够保证同样的资源在每一次不同的构建后都有一个不一样的文件名。这是一个十分有用的机制，因为它让你能够安全地对静态资源进行长期缓存：如果名称固定不变，打包构建工具可能会认为这些资源没有改动，导致缓存的内容将不会发生相应的变化。

然而，如果在打包构建完成之前你都无法知晓资源最终的 URL 的话，那就无法将它们放进组件的代码之中。举个例子，像以前那样将 `"/styles.css"` 硬编码写入 JSX 的话，是不会有作用的。为了应对这种场景，可以向根组件传递一个映射文件名的 map 作为参数：

```js {1,6}
export default function App({ assetMap }) {
  return (
    <html>
      <head>
        ...
        <link rel="stylesheet" href={assetMap['styles.css']}></link>
        ...
      </head>
      ...
    </html>
  );
}
```

然后在服务端，像 `<App assetMap={assetMap} />` 这样传递资源 URL：

```js {1-5,8,9}
// 你需要从你的打包构建工具中获取这个 JSON，比如从构建产物中获取
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

app.use('/', (request, response) => {
  const { pipe } = renderToPipeableStream(<App assetMap={assetMap} />, {
    bootstrapScripts: [assetMap['main.js']],
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  });
});
```

因为你的服务端正在渲染 `<App assetMap={assetMap} />`，所以你还需要在客户端将这个带有 `assetMap` 的组件再渲染一次进行同构，以此避免 hydrate 错误。你可以像下面这样序列化 `assetMap` 之后再传递：

```js {9-10}
// 你需要从你的打包构建工具中获取这个 JSON。
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

app.use('/', (request, response) => {
  const { pipe } = renderToPipeableStream(<App assetMap={assetMap} />, {
    // 注意: 由于这些数据并非用户生成，所以使用 stringify 是安全的。
    bootstrapScriptContent: `window.assetMap = ${JSON.stringify(assetMap)};`,
    bootstrapScripts: [assetMap['main.js']],
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  });
});
```

在上面这个例子中，`bootstrapScriptContent` 参数添加了一个 `<script>` 标签，在客户端设置了一个全局变量 `window.assetMap`。这让客户端代码能够获取到与服务端一致的 `assetMap`：

```js {4}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App assetMap={window.assetMap} />);
```

这样一来，客户端和服务端都渲染了带有 `assetMap` 属性的 `App`，因此它们是同构的，就不会出现 hydrate 异常错误。

</DeepDive>

---

### 在加载时流式传输更多内容 {/*streaming-more-content-as-it-loads*/}

流式传输让用户在所有数据加载完毕之前就能够看见页面的部分内容。举个例子，想象一下这样的一个用户个人信息页面，页面上显示了一个封面大图、一个列出用户好友及其照片的侧边栏，还有一个文章列表：

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

可以想象到为 `<Posts />` 加载文章数据会消耗一些时间。但理想情况是，不等待文章数据加载，先直接为用户展示这个页面上的其余部分。想要实现这一点，只需要 [将 `Posts` 放入 `<Suspense>` 中](/reference/react/Suspense#displaying-a-fallback-while-content-is-loading)。

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

这样做将通知 React 在 `Posts` 加载数据之前就开始流式传输 HTML。React 首先会发送加载中的后备方案（`PostsGlimmer`）对应的 HTML，然后当 `Posts` 的数据加载完成时，React 会将剩下的 HTML 带上一个 `<script>` 标签一并发送，这个 `<script>` 的作用是将加载中的后备方案替换为这段 HTML。从用户的角度上看，页面上首先出现的是 `PostsGlimmer`，稍后被替换为 `Posts`。

你可以进一步地 [嵌套 `<Suspense>`](/reference/react/Suspense#revealing-nested-content-as-it-loads) 来创建一个更加细致的加载序列：

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

在这个例子中，React 甚至能够更早地启用流式传输。因为 `ProfileLayout` 和 `ProfileCover` 没有被包裹在 `<Suspense>` 中，所以它们必须先完成渲染。然而，如果 `Sidebar`、`Friend` 或者 `Photos` 需要加载更多数据，React 将会发送后备方案 `BigSpinner` 所对应的 HTML 暂时替代有效内容。然后，当这些数据加载完成时，有效内容将渐进地显示直至全部可见。

流式传输不需要等待 React 本身在浏览器中的加载，也不需要等待你的应用程序变得可交互。在任何 `<script>` 标签加载之前，服务端发送的 HTML 内容就会开始渐进式地显示。

[查阅更多以了解流式传输的 HTML 如何运行](https://github.com/reactwg/react-18/discussions/37)。

<Note>

**只有支持 Suspense 的数据源才会激活 Suspense 组件**。它们包括：

- 使用像 [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) 和 [Next.js](https://nextjs.org/docs/getting-started/react-essentials) 这样支持用 Suspence 获取数据的框架。
- 使用 [`lazy`](/reference/react/lazy) 懒加载组件。
- 使用 [`use`](/reference/react/use) 读取 Promise 的值。

当数据是在 Effect 或者事件处理程序中被获取时，Suspense **不会** 对此生效。

在上述的 `Post` 组件中加载数据的具体方式取决于你使用的框架。如果你使用了一个支持 Suspense 的框架，你可以它的文档中找到获取数据的详细方式。

并不一定就得使用某个框架才能使用支持 Suspense 的获取数据方式。但实现一个支持 Suspense 的数据源的具体要求并不明确而且目前没有参考实例。不过在 React 未来的版本中，官方将推出一个能够通过 Suspense 来聚合数据源的 API。 

</Note>

---

### 指定 shell 中的内容 {/*specifying-what-goes-into-the-shell*/}

在你的应用中，`<Suspense>` 之外的任何内容都叫做 **外壳（shell）**：

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

上述代码确定了最先加载的、用户可见的内容：

```js {3-5,13
<ProfileLayout>
  <ProfileCover />
  <BigSpinner />
</ProfileLayout>
```

如果你在根节点上，将整个应用都包裹进一个 `<Suspense>` 中，那么 shell 包含的内容只有加载动画组件。用户将看到一个超大的加载动画占据了整个屏幕，相比于直接看到页面真实的布局然后稍微等待一会儿来说，前者让用户心理感觉加载变得更慢了并感到更加烦躁。这就导致了用户体验不佳。所以在通常情况下你总是需要设置多个 `<Suspense>`，使得 shell 看上去 **小巧精致**——就像是显示整个页面布局的骨架屏一般。

`onShellReady` 回调函数会在所有的 shell 都渲染完成后执行。通常情况下你还会开启流式渲染，然后就像这样：

```js {3-6}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  }
});
```

在 `onShellReady` 执行的时候，`<Suspense>` 内的组件可能仍然在加载数据。

---

### 记录服务端崩溃日志 {/*logging-crashes-on-the-server*/}

默认情况下，服务端上所有的错误异常都会在控制台被打印。你可以重载这个行为。

```js {7-10}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onError(error) {
    console.error(error);
    logServerCrashReport(error);
  }
});
```

如果你提供了一个自定义的 `onError` 实现，记得总是应该像上面这样在控制台打印错误日志。 

---

### 恢复 shell 内的异常 {/*recovering-from-errors-inside-the-shell*/}

在这个例子中，shell 包含 `ProfileLayout`、`ProfileCover`、和 `PostsGlimmer`：

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

在这些组件渲染的过程中，如果发生了异常错误，React 就不会发送任何有效的 HTML 到客户端。重载 `onShellError`，发送一个不依赖服务端渲染的 HTML 作为后备方案：

```js {7-11}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>出错了</h1>'); 
  },
  onError(error) {
    console.error(error);
    logServerCrashReport(error);
  }
});
```

如果在生成 shell 的过程中出现异常错误，`onError` 和 `onShellError` 都会触发。使用 `onError` 来做错误上报，并且使用 `onShellError` 发送一个后备 HTML 文档。你的后备 HTML 不一定要是一个错误提示页面。你还可以引入一个可交互的、并且只在客户端渲染你的应用程序的 shell。

---

### 将 shell 之外的异常恢复 {/*recovering-from-errors-outside-the-shell*/}

在这个例子中，`<Posts />` 组件被被包裹在 `<Suspense>` 中，所以它 **不是** shell 的一部分。

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

1. 它将用在结构上和异常发生的位置最近的一个父级 `<Suspense>` 的加载中的后备方案（`PostsGlimmer`）替代这段 HTML。
2. 它将会“放弃”尝试在服务端渲染 `Posts` 组件的内容。
3. 当 JavaScript 在客户端代码加载时，React 将会在客户端 **重试** 渲染 `Posts` 组件。

如果在客户端重试渲染 `Posts` **也** 失败了，React 将会在客户端抛出一个异常错误。当渲染过程中的所有异常错误都被抛出时，距离它们[最近的父级异常错误边界](/reference/react/Component#static-getderivedstatefromerror) 会定义这个异常错误将如何呈现给用户。实际上，这意味着用户将看到一个加载指示器，直到这个异常错误被判定为是不可恢复的。

如果在客户端重试渲染 `Posts` 成功了，加载中的后备方案将被替换为客户端渲染的内容。这样一来用户感知到服务端出现了异常错误。不过，服务端的 `onError` 回调函数和客户端的 [`onRecoverableError`](/reference/react-dom/client/hydrateRoot#hydrateroot) 回调函数仍然会触发，所以你也可以获取到一些关于这个异常错误的提示信息。

---

### 设置状态码 {/*setting-the-status-code*/}

流式传输引入了一个折衷策略。如果可以的话，你应该尽早开启流式传输，以利于用户能够更快地看到页面内容。然而，一旦你开启了流式渲染，你就不能再设置状态码了。

通过 [将你的应用程序切分](#specifying-what-goes-into-the-shell) 为 shell（`<Suspense>` 之外的部分）和其余部分，你就已经解决了一部分问题。因为如果 shell 出现了异常错误，你就可以触发 `onShellError` 并在此设置错误状态码。相反，如果你知道应用程序可能已经在客户端将异常错误恢复了，就可以发送“OK”。

```js {4}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.statusCode = 200;
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>出错了</h1>'); 
  },
  onError(error) {
    console.error(error);
    logServerCrashReport(error);
  }
});
```

如果在 shell **之外**（即在 `<Suspense>` 中）的一个组件抛出了一个错误异常，React 也不会停止渲染。这意味着 `onError` 和 `onShellReady` 回调函数会被触发，而 `onShellError` 却不会。 这是因为 React 会尝试在客户端将这些异常错误恢复，[也就是像上文描述的那样](#recovering-from-errors-outside-the-shell)。

然而，如果你愿意的话，你可以利用发生了异常报错这个事实来设置状态码：

```js {1,6,16}
let didError = false;

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.statusCode = didError ? 500 : 200;
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>出错了</h1>'); 
  },
  onError(error) {
    didError = true;
    console.error(error);
    logServerCrashReport(error);
  }
});
```

这只会捕获在生成初始化 shell 内容的时候发生的，且在 shell 之外的异常错误，所以它并不全面。如果知晓某些内容是否发生了错误是一件很重要的事情，那么你可以将这些内容移动到 shell 中。

---

### 用不同的方式处理不同的异常错误 {/*handling-different-errors-in-different-ways*/}

你可以 [自定义 `Error` 子类](https://javascript.info/custom-errors) 并且使用 [`instanceof`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/instanceof) 运算符来检查抛出的错误类型。举个例子，你可以自定义一个 `NotFoundError` 然后在你的组件里抛出它。然后，你的 `onError`、`onShellReady` 和 `onShellError` 回调函数就能根据不同的错误类型做不同的处理：

```js {2,4-14,19,24,30}
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

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.statusCode = getStatusCode();
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
   response.statusCode = getStatusCode();
   response.setHeader('content-type', 'text/html');
   response.send('<h1>出错了</h1>'); 
  },
  onError(error) {
    didError = true;
    caughtError = error;
    console.error(error);
    logServerCrashReport(error);
  }
});
```

请记住，一旦发送了 shell 并开始流式传输，就不能够再改变状态码了。

---

### 为爬虫和静态内容生成而等待所有内容加载完毕 {/*waiting-for-all-content-to-load-for-crawlers-and-static-generation*/}

流式传输提供了更好的用户体验，因为当页面内容可用时，用户可以及时感知到它们。

然而，当一个爬虫访问该页面时，或者正处于静态生成页面的构建阶段时，就可能需要先加载所有内容，然后直接输出整个 HTML 而不是渐进式地加载它。

可以使用 `onAllReady` 回调函数，它会在所有内容加载完成时触发：


```js {2,7,11,18-24}
let didError = false;
let isCrawler = // ... 取决于你的爬虫嗅探策略 ...

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    if (!isCrawler) {
      response.statusCode = didError ? 500 : 200;
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>出错了</h1>'); 
  },
  onAllReady() {
    if (isCrawler) {
      response.statusCode = didError ? 500 : 200;
      response.setHeader('content-type', 'text/html');
      pipe(response);      
    }
  },
  onError(error) {
    didError = true;
    console.error(error);
    logServerCrashReport(error);
  }
});
```

一个普通的访问者将会得到渐进式加载的内容的一段流。而一个爬虫将会直接得到最终的 HTML 输出。然而，这也意味着爬虫必须等待 **所有** 数据加载完毕，其中一部分数据加载可能会很慢甚至可能出现异常报错。具体采取什么策略取决于你的应用程序，你也可以对爬虫只发送 shell 部分。

---

### 终止服务端渲染 {/*aborting-server-rendering*/}

可以设置一个超时时间，在超时后强制终止服务端渲染：

```js {1,5-7}
const { pipe, abort } = renderToPipeableStream(<App />, {
  // ...
});

setTimeout(() => {
  abort();
}, 10000);
```

React 将会刷新内容，把剩余的加载中的后备方案转为 HTML，然后尝试在客户端渲染剩下的内容。
