---
title: renderToStaticMarkup
---

<Intro>

`renderToStaticMarkup` 会将非交互的 React 组件树渲染成 HTML 字符串。

```js
const html = renderToStaticMarkup(reactNode)
```

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `renderToStaticMarkup(reactNode)` {/*rendertostaticmarkup*/}

在服务器上，调用 `renderToStaticMarkup` 将你的应用程序渲染成 HTML。

```js
import { renderToStaticMarkup } from 'react-dom/server';

const html = renderToStaticMarkup(<Page />);
```

它将会把 React 组件转换为非交互式 HTML 。

[请看下方更多示例](#usage)。

#### 参数 {/*parameters*/}

* `reactNode`：你想渲染成 HTML 的 React 节点。例如，像 `<Page />` 这样的 JSX 节点。

#### 返回值 {/*returns*/}

一个 HTML 字符串。

#### 注意事项 {/*caveats*/}

* `renderToStaticMarkup` 的输出无法进行二次渲染。

* `renderToStaticMarkup` 对 Suspense 的支持有限。如果一个组件触发了 Suspense，`renderToStaticMarkup` 立即将它的 fallback 作为 HTML 输出。

* `renderToStaticMarkup` 在浏览器中可以使用，但不建议在客户端代码中使用它。如果你需要在浏览器中将组件渲染成 HTML，[请把它渲染到 DOM 节点中以获取 HTML](/reference/react-dom/server/renderToString#removing-rendertostring-from-the-client-code)。

---

## 用法 {/*usage*/}

### 将一个非交互式的 React 树渲染成 HTML 字符串 {/*rendering-a-non-interactive-react-tree-as-html-to-a-string*/}
``

调用 `renderToStaticMarkup` 将你的应用程序渲染为 HTML 字符串，然后将其与服务器响应一起发送：

```js {5-6}
import { renderToStaticMarkup } from 'react-dom/server';

// 路由处理程序语法取决于你的后端框架
app.use('/', (request, response) => {
  const html = renderToStaticMarkup(<Page />);
  response.send(html);
});
```

这将会把 React 组件转换为非交互式 HTML 。

<Pitfall>

此方法渲染的是 **无法进行二次渲染的非交互式 HTML**。如果你需要使用 React 作为简单静态页面生成器，或者需要呈现纯静态内容（例如邮件），则这种方法非常适用。

对于交互式的应用程序，建议在服务器端使用 [`renderToString`](/reference/react-dom/server/renderToString) 方法，而在客户端上使用 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) 方法。

</Pitfall>
