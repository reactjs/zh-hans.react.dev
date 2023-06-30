---
title: renderToNodeStream
---

<Deprecated>

此 API 将在未来的 React 主要版本中被移除，请使用 [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream)。

</Deprecated>

<Intro>

`renderToNodeStream` 可以为 [Node.js 只读流](https://nodejs.org/api/stream.html#readable-streams) 渲染 React 树。

```js
const stream = renderToNodeStream(reactNode)
```

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `renderToNodeStream(reactNode)` {/*rendertonodestream*/}

在服务端调用 `renderToNodeStream` 获取 [Node.js 只读流](https://nodejs.org/api/stream.html#readable-streams)，你也可以将其管道（pipe）传输到响应中。

```js
import { renderToNodeStream } from 'react-dom/server';

const stream = renderToNodeStream(<App />);
stream.pipe(response);
```

在客户端调用 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) 使由服务器生成的 HTML 具有交互功能。

[参见下面更多示例](#usage)。

#### 参数 {/*parameters*/}

* `reactNode`：想要渲染为 HTML 的 React 节点。比如像 `<App />` 一样的 JSX 元素。

#### 返回值 {/*returns*/}

输出 HTML 字符串的 [Node.js 只读流](https://nodejs.org/api/stream.html#readable-streams)。

#### 注意 {/*caveats*/}

* 此方法会等待所有 [Suspense 边界](/reference/react/Suspense) 完成后才返回输出。

* 从 React 18 开始，此方法会缓冲所有输出，因此实际上它并没有提供任何流式传输的好处。这就是为什么建议改用 [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream)。

* 返回的是一个 utf-8 编码的字节流。如果你需要其他编码格式的流，请参考 [iconv-lite](https://www.npmjs.com/package/iconv-lite) 这样的项目，它提供了用于转码文本的转换流。

---

## 用法 {/*usage*/}

### 为 Node.js 只读流将 React 树渲染为 HTML {/*rendering-a-react-tree-as-html-to-a-nodejs-readable-stream*/}

调用 `renderToNodeStream` 获取 [Node.js 只读流](https://nodejs.org/api/stream.html#readable-streams)，你也可以将其管道（pipe）传输到服务器响应中。

```js {5-6}
import { renderToNodeStream } from 'react-dom/server';

// 路由处理程序的语法取决于使用的后端框架。
app.use('/', (request, response) => {
  const stream = renderToNodeStream(<App />);
  stream.pipe(response);
});
```

这里的流会将 React 组件初始输出为非交互式 HTML。在客户端上，你需要调用 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) 方法来 hydrate 服务器生成的 HTML 并使其具有交互功能。
