---
title: renderToStaticNodeStream
---

<Intro>

`renderToStaticNodeStream` 可以为 [Node.js 只读流](https://nodejs.org/api/stream.html#readable-streams) 渲染非交互式 React 树。

```js
const stream = renderToStaticNodeStream(reactNode)
```

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `renderToStaticNodeStream(reactNode)` {/*rendertostaticnodestream*/}

在服务端调用 `renderToStaticNodeStream` 获取 [Node.js 只读流](https://nodejs.org/api/stream.html#readable-streams)。

```js
import { renderToStaticNodeStream } from 'react-dom/server';

const stream = renderToStaticNodeStream(<Page />);
stream.pipe(response);
```

[参见下面更多示例](#usage)。

调用此方法为 React 组件输出非交互式 HTML。

#### 参数 {/*parameters*/}

* `reactNode`：想要渲染为 HTML 的 React 节点。比如像 `<Page />` 一样的 JSX 元素。

#### 返回值 {/*returns*/}

输出 HTML 字符串的 [Node.js 只读流](https://nodejs.org/api/stream.html#readable-streams)，以此法输出的 HTML 不能被客户端 hydrate。

#### 注意 {/*caveats*/}

* `renderToStaticNodeStream` 的输出不能被 hydrate。

* 此方法会等待所有 [Suspense边界](/reference/react/Suspense) 完成后才返回输出。

* 从 React 18 开始，此方法会缓冲所有输出，因此实际上它并没有提供任何流式传输的好处。

* 返回的是一个 utf-8 编码的字节流。如果你需要其他编码格式的流，请参考 [iconv-lite](https://www.npmjs.com/package/iconv-lite) 这样的项目，它提供了用于转码文本的转换流。

---

## 用法 {/*usage*/}

### 为 Node.js 只读流将 React 树渲染为静态 HTML {/*rendering-a-react-tree-as-static-html-to-a-nodejs-readable-stream*/}

调用 `renderToStaticNodeStream` 获取 [Node.js 只读流](https://nodejs.org/api/stream.html#readable-streams)，你也可以将其管道（pipe）传输到服务器响应中。

```js {5-6}
import { renderToStaticNodeStream } from 'react-dom/server';

// 路由处理程序的语法取决于使用的后端框架。
app.use('/', (request, response) => {
  const stream = renderToStaticNodeStream(<Page />);
  stream.pipe(response);
});
```

此方法将会将 React 组件初始输出为非交互式 HTML。

<Pitfall>

此方法将会渲染 **无法被 hydrate 的非交互式 HTML**。如果你想将 React 用作简单的静态页面生成器，或者渲染完全静态的内容（如电子邮件），那么这将会很有用。

交互式应用程序应该在服务端使用 [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) 并在客户端结合使用 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot)。

</Pitfall>
