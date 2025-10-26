---
title: renderToString
---

<Pitfall>

`renderToString` 不支持流式传输或等待数据。[请参考替代方案](#alternatives)。

</Pitfall>

<Intro>

`renderToString` 将 React 树渲染为一个 HTML 字符串。

```js
const html = renderToString(reactNode, options?)
```

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `renderToString(reactNode, options?)` {/*rendertostring*/}

在服务器，调用 `renderToString` 将你的应用渲染为 HTML。

```js
import { renderToString } from 'react-dom/server';

const html = renderToString(<App />);
```

在客户端，调用 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) 来使服务器生成的 HTML 具有交互性。

[请参考下面的更多示例](#usage)。

#### 参数 {/*parameters*/}

* `reactNode`：你要渲染为 HTML 的 React 节点。例如，一个 JSX 节点，就像 `<App />`。

* **可选的** `options`：服务器渲染的对象。
* **可选的** `identifierPrefix`：React 使用 [`useId`](/reference/react/useId) 生成的 ID 的字符串前缀。用于避免在同一页面使用多个根时发生冲突。必须与传递给 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot#parameters) 的前缀相同。

#### 返回 {/*returns*/}

一个 HTML 字符串。

#### 注意事项 {/*caveats*/}

* `renderToString` 对 Suspense 的支持有限。如果一个组件挂起（suspend），`renderToString` 会立即将其后备方案作为 HTML 发送。

* `renderToString` 可以在浏览器中工作，但 [不推荐](#removing-rendertostring-from-the-client-code) 在客户端代码中使用它。

---

## 用法 {/*usage*/}

### 将 React 树渲染为 HTML 字符串 {/*rendering-a-react-tree-as-html-to-a-string*/}

调用 `renderToString` 将你的应用渲染为 HTML 字符串，你可以将其与服务器响应一起发送：

```js {5-6}
import { renderToString } from 'react-dom/server';

// 路由处理程序的语法取决于你使用的后端框架
app.use('/', (request, response) => {
  const html = renderToString(<App />);
  response.send(html);
});
```

这将生成你的 React 组件的初始非交互式 HTML 输出。在客户端上，你需要调用 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) 来将服务器生成的 HTML 进行激活处理，使其具有交互功能。


<Pitfall>

`renderToString` 不支持流式传输或等待数据。[请参考替代方案](#alternatives)。

</Pitfall>

---

## 替代方案 {/*alternatives*/}

### 从 `renderToString` 迁移到服务器上的流式传输方法 {/*migrating-from-rendertostring-to-a-streaming-method-on-the-server*/}

`renderToString` 立即返回一个字符串，因此不支持加载时流式传输内容。

如果可能的话，我们建议使用这些功能完整的替代方法：

* 如果你使用 Node.js，请使用 [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream)。
* 如果你使用 Deno 或支持 [Web Streams](https://developer.mozilla.org/zh-CN/docs/Web/API/Streams_API) 的现代运行时，请使用 [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream)。

如果你的服务器环境不支持流式传输，你仍然可以继续使用 `renderToString`。

---

### 从 `renderToString` 迁移到服务器上的静态预渲染 {/*migrating-from-rendertostring-to-a-static-prerender-on-the-server*/}

`renderToString` 立即返回一个字符串，它不支持等待静态 HTML 生成的数据加载。

我们建议使用这些功能齐全的替代产品：

* 如果你使用 Node.js，可使用 [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream)。
* 如果你使用 Deno 或者一个 [Web 流](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) 的现代边缘运行环境，可使用 [`prerender`](/reference/react-dom/static/prerender)。

如果你的静态网站生成环境不支持流，你可以继续使用 `renderToString`。

---

### 从客户端代码中移除 `renderToString` {/*removing-rendertostring-from-the-client-code*/}

有时，`renderToString` 用于在客户端将某个组件转换为 HTML。

```js {1-2}
// 🚩 不必要：在客户端使用 renderToString
import { renderToString } from 'react-dom/server';

const html = renderToString(<MyIcon />);
console.log(html); // 例如，"<svg>...</svg>"
```

在客户端导入 `react-dom/server` 会不必要地增加 bundle 大小，所以应该避免这样做。如果你需要在浏览器中将某个组件渲染为 HTML，请使用 [`createRoot`](/reference/react-dom/client/createRoot) 并从 DOM 中读取 HTML。

```js
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';

const div = document.createElement('div');
const root = createRoot(div);
flushSync(() => {
  root.render(<MyIcon />);
});
console.log(div.innerHTML); // 例如，"<svg>...</svg>"
```

[`flushSync`](/reference/react-dom/flushSync) 调用是必要的，以便在读取 [`innerHTML`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/innerHTML) 属性之前更新 DOM。

---

## 故障排除 {/*troubleshooting*/}

### 当组件暂停时，HTML 中始终包含一个后备方案 {/*when-a-component-suspends-the-html-always-contains-a-fallback*/}

`renderToString` 不完全支持 Suspense。

如果某个组件 suspend（例如，因为它使用 [`lazy`](/reference/react/lazy) 定义或获取数据），`renderToString` 不会等待其内容解析完成。相反，`renderToString` 将找到最近的 [`<Suspense>`](/reference/react/Suspense) 边界，并在 HTML 中渲染其 `fallback` 属性。直到客户端代码加载后，内容才会显示出来。

要解决这个问题，请使用 [推荐的流式解决方案之一](#alternatives)。 对于服务器端渲染，它们可以在服务器上以块的形式流式传输内容，以便用户在客户端代码加载之前逐步看到页面被填充。对于静态站点，他们可以等待所有内容解析后再生成静态 HTML。

