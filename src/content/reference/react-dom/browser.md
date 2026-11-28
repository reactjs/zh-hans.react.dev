---
title: browser
---

<Intro>

`browser` 允许你在服务端渲染期间将组件标记为仅在浏览器中渲染。

```js
use(browser(reason?))
```

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `browser(reason?)` {/*browser*/}

在 [`use`](/reference/react/use) 内部调用 `browser`，可以在服务端渲染期间将组件标记为仅在浏览器中渲染：

```js
import { use } from 'react';
import { browser } from 'react-dom';

function BrowserOnly() {
  use(browser('此组件需要使用浏览器 API。'));
  return <BrowserContent />;
}
```

在服务端渲染期间，`use(browser())` 会停止渲染该组件，并将最近的 [`<Suspense>`](/reference/react/Suspense) 边界的 fallback 保留在原处。而在浏览器中，`use(browser())` 会返回 `undefined`，因此组件可以正常渲染。

[请参阅下面的更多示例](#usage)。

#### 参数 {/*parameters*/}

* **可选** `reason`：一个字符串或函数，用于解释这段内容为什么需要在浏览器中渲染。该字符串或函数的返回值会成为传递给 [`onBrowserBailout`](#reporting-browser-only-rendering-on-the-server) 的 `Error` 的 `cause`。每当服务端渲染器遇到 `browser` 返回的值时，React 都会调用一次 reason 函数，但在浏览器中不会调用它。如果创建这个 reason 的开销较大，可以传入一个函数，例如 `() => new Error(...)`。

#### 返回值 {/*returns*/}

`browser` 返回一个不透明的值，你可以在组件中将它传递给 `use`，或者在 [中止服务端渲染](#aborting-pending-server-rendering-for-the-browser) 时将它作为 reason 使用。在浏览器中，将这个值传递给 `use` 会返回 `undefined`。

#### 注意事项 {/*caveats*/}

* 在服务端渲染期间，`use(browser())` 必须位于 `<Suspense>` 边界内。如果没有 Suspense 边界，服务端渲染将会失败。
* `use(browser())` 必须在 [客户端组件](/reference/rsc/use-client) 中调用，而不能在 [服务端组件](/reference/rsc/server-components) 中调用。
* 单独调用 `browser()` 不会产生任何效果。要将组件标记为仅在浏览器中渲染，请将 `browser` 返回的值传递给 `use`。不要将它抛出（throw）。

---

## 用法 {/*usage*/}

### 仅在浏览器中渲染内容 {/*rendering-content-only-in-the-browser*/}

在需要仅在浏览器中渲染的组件中，于 `use` 内部调用 `browser`：

你可以用它来代替检查 `typeof window`、等待 [`Effect`](/reference/react/useEffect) 设置挂载状态，或使用框架选项来禁用服务端渲染。

点击 **重新加载**，可以看到初始 HTML 中的加载 fallback。在完成 hydration 之后，React 会显示从 `localStorage` 中加载的草稿。

<Sandpack>

```js src/App.js active
import { Suspense, use, useState } from 'react';
import { browser } from 'react-dom';

function SavedDraft() {
  use(browser('此草稿存储在 localStorage 中。'));
  const [draft, setDraft] = useState(
    () => localStorage.getItem('draft') ?? ''
  );

  function handleChange(event) {
    const nextDraft = event.target.value;
    setDraft(nextDraft);
    localStorage.setItem('draft', nextDraft);
  }

  return (
    <label>
      草稿：
      <textarea
        value={draft}
        onChange={handleChange}
        rows={4}
        cols={30}
      />
    </label>
  );
}

export default function App() {
  return (
    <>
      <h1>已保存的草稿</h1>
      <Suspense fallback={<p>正在加载草稿……</p>}>
        <SavedDraft />
      </Suspense>
    </>
  );
}
```

```js src/Document.js hidden
import App from './App.js';

export default function Document() {
  return (
    <html lang="zh-CN">
      <head>
        <title>已保存的草稿</title>
        <style>{`
          h1 { font-size: 24px; margin-top: 0; }
          label, textarea { display: block; }
          textarea { margin-top: 5px; }
        `}</style>
      </head>
      <body>
        <App />
      </body>
    </html>
  );
}
```

```js src/index.js hidden
import { hydrateRoot } from 'react-dom/client';
import { renderToReadableStream } from 'react-dom/server';
import Document from './Document.js';
import { flushReadableStreamToFrame } from './demo-helpers.js';
import './styles.css';

async function main(frame) {
  const stream = await renderToReadableStream(<Document />);
  await flushReadableStreamToFrame(stream, frame);

  // 等待一段时间，以便 fallback 和 hydration 后的内容都能被看到。
  await new Promise(resolve => setTimeout(resolve, 1200));
  hydrateRoot(frame.contentDocument, <Document />);
}

main(document.getElementById('preview'));
```

```js src/demo-helpers.js hidden
export async function flushReadableStreamToFrame(readable, frame) {
  const doc = frame.contentWindow.document;
  const decoder = new TextDecoder();
  const reader = readable.getReader();

  while (true) {
    const {done, value} = await reader.read();
    if (done) {
      break;
    }
    doc.write(decoder.decode(value, {stream: true}));
  }

  doc.write(decoder.decode());
  doc.close();
}
```

```html public/index.html hidden
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>仅浏览器渲染</title>
</head>
<body>
  <iframe id="preview" title="Rendered page"></iframe>
</body>
</html>
```

```css src/styles.css hidden
iframe {
  width: 100%;
  height: 160px;
  border: 0;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

<Note>

`use(browser())` 必须在客户端组件中调用。如果你的框架默认使用服务端组件，请在该文件中添加 [`'use client'`](/reference/rsc/use-client) 指令，或者将这个调用移到一个子客户端组件中：

```js {1}
'use client';

import { use, useState } from 'react';
import { browser } from 'react-dom';

export default function SavedDraft() {
  use(browser('已保存的草稿存储在 localStorage 中。'));
  const [draft] = useState(() => localStorage.getItem('draft') ?? '');
  return <DraftEditor initialDraft={draft} />;
}
```

</Note>

---

### 在服务端上有条件地渲染 {/*conditionally-rendering-on-the-server*/}

与其他 [`use`](/reference/react/use) 调用一样，`use(browser())` 可以在条件语句中或提前返回（early return）之后调用。这可以让组件或自定义 Hook 根据某个条件（例如 prop 的值）选择退出服务端渲染。

例如，下面这个 `useTimeZone` Hook 接受一个可选的默认值。当提供了默认值时，React 会在初始 HTML 和浏览器中都渲染该默认值。当没有提供默认值时，组件会在服务端渲染期间挂起，并在浏览器中显示设备所在的本地时区。

点击 **重新加载**，可以看到用户的时区显示之前的加载 fallback。

<Sandpack>

```js src/App.js
import { Suspense } from 'react';
import { useTimeZone } from './useTimeZone.js';

function TimeZone({label, defaultTimeZone}) {
  const timeZone = useTimeZone(defaultTimeZone);
  return <p>{label}: <strong>{timeZone}</strong></p>;
}

export default function App() {
  return (
    <>
      <h1>活动详情</h1>
      <TimeZone
        label="活动时区"
        defaultTimeZone="America/New_York"
      />
      <Suspense fallback={<p>正在加载你的时区……</p>}>
        <TimeZone label="你的时区" />
      </Suspense>
    </>
  );
}
```

```js src/useTimeZone.js active
import { use } from 'react';
import { browser } from 'react-dom';

export function useTimeZone(defaultTimeZone) {
  if (defaultTimeZone !== undefined) {
    return defaultTimeZone;
  }

  use(browser('未提供默认时区。'));
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
```

```js src/Document.js hidden
import App from './App.js';

export default function Document() {
  return (
    <html lang="zh-CN">
      <head>
        <title>活动详情</title>
        <style>{`
          h1 { font-size: 24px; margin-top: 0; }
        `}</style>
      </head>
      <body>
        <App />
      </body>
    </html>
  );
}
```

```js src/index.js hidden
import { hydrateRoot } from 'react-dom/client';
import { renderToReadableStream } from 'react-dom/server';
import Document from './Document.js';
import { flushReadableStreamToFrame } from './demo-helpers.js';
import './styles.css';

async function main(frame) {
  const stream = await renderToReadableStream(<Document />);
  await flushReadableStreamToFrame(stream, frame);

  // 等待一段时间，以便 fallback 和 hydration 后的内容都能被看到。
  await new Promise(resolve => setTimeout(resolve, 1200));
  hydrateRoot(frame.contentDocument, <Document />);
}

main(document.getElementById('preview'));
```

```js src/demo-helpers.js hidden
export async function flushReadableStreamToFrame(readable, frame) {
  const doc = frame.contentWindow.document;
  const decoder = new TextDecoder();
  const reader = readable.getReader();

  while (true) {
    const {done, value} = await reader.read();
    if (done) {
      break;
    }
    doc.write(decoder.decode(value, {stream: true}));
  }

  doc.write(decoder.decode());
  doc.close();
}
```

```html public/index.html hidden
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>有条件的浏览器渲染</title>
</head>
<body>
  <iframe id="preview" title="Rendered page"></iframe>
</body>
</html>
```

```css src/styles.css hidden
iframe {
  width: 100%;
  height: 240px;
  border: 0;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

在使用支持 Suspense 的数据请求库时，你也可以应用类似的模式，有条件地跳过服务端渲染：

```js {3}
function useBrowserQuery(query, options) {
  if (options.initialData === undefined) {
    use(browser('useBrowserQuery：未提供初始数据。'));
  }

  return useQuery(query, options);
}

function ProductDetails({ productId, initialData }) {
  const product = useBrowserQuery(`/api/products/${productId}`, {
    initialData,
  });

  return <h1>{product.name}</h1>;
}
```

如果提供了 `initialData`，React 会在服务端将组件渲染为 HTML。如果没有提供，React 会在 HTML 中保留最近的 [`<Suspense>`](/reference/react/Suspense) 边界的 fallback。而在浏览器中，`useQuery` 可以照常获取数据或从客户端缓存中读取数据。

---

### 报告服务端上的仅浏览器渲染 {/*reporting-browser-only-rendering-on-the-server*/}

向服务端渲染器传递 `onBrowserBailout` 回调，可以报告仅浏览器渲染的情况。当 React 为浏览器保留一个 Suspense fallback 时，它不会调用服务端渲染器的 `onError` 回调，也不会调用 [`hydrateRoot` 的 `onRecoverableError`](/reference/react-dom/client/hydrateRoot#error-logging-in-production) 回调。下面的示例还传递了一个 reason，它可以通过所报告错误的 `cause` 属性获取：

```js
import { Suspense, use, useState } from 'react';
import { browser } from 'react-dom';
import { renderToPipeableStream } from 'react-dom/server';

function SavedDraft() {
  use(browser(() => new Error('已保存的草稿存储在 localStorage 中。')));
  const [draft] = useState(() => localStorage.getItem('draft') ?? '');
  return <DraftEditor initialDraft={draft} />;
}

function App() {
  return (
    <Suspense fallback={<p>正在加载已保存的草稿……</p>}>
      <SavedDraft />
    </Suspense>
  );
}

const { pipe } = renderToPipeableStream(<App />, {
  onShellReady() {
    pipe(response);
  },
  onBrowserBailout(error, errorInfo) {
    logBrowserBailout(error, errorInfo);
  }
});
```

`onBrowserBailout` 接收两个参数：

1. 一个描述这次仅浏览器渲染的 `Error`。如果你向 `browser` 传递了 reason，它可以通过这个错误的 `cause` 属性获取。
2. 一个 `errorInfo` 对象，其中的 `componentStack` 会显示发生仅浏览器渲染的位置。

reason 函数可以返回任意值。返回一个新的 `Error` 可以让 cause 拥有自己的堆栈信息，而无需在浏览器中创建这个 `Error`。React 不会将 reason 序列化到 HTML 中。

如果没有 Suspense 边界来提供 fallback，服务端渲染将会失败。React 会通过渲染器常规的错误回调（而不是 `onBrowserBailout`）来报告这个失败。

---

### 为浏览器中止尚未完成的服务端渲染 {/*aborting-pending-server-rendering-for-the-browser*/}

如果你直接调用服务端渲染 API，可以停止等待尚未完成的内容，让浏览器来完成渲染。在中止服务端渲染时，将 `browser` 返回的值作为 reason 传递。React 会将尚未完成的 Suspense 边界保持在 fallback 状态，并在浏览器中渲染它们的内容：

```js {1,8}
import { browser } from 'react-dom';
import { renderToPipeableStream } from 'react-dom/server';

const { pipe, abort } = renderToPipeableStream(<App />, {
  onShellReady() {
    pipe(response);
    setTimeout(() => {
      abort(browser('服务端渲染已超时。'));
    }, 10000);
  }
});
```

以 `browser` 作为 reason 中止渲染，不会触发服务端渲染器的 `onError` 回调，也不会触发 `hydrateRoot` 的 `onRecoverableError` 回调。相反，服务端渲染器会将每个恢复的 Suspense 边界报告给 `onBrowserBailout`。

对于接受 [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) 的服务端渲染 API，请将 `browser()` 作为 reason 传递给 [`AbortController.abort`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort)。
