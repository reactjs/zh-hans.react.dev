---
title: useId
---

<Intro>

`useId` 是一个 React Hook，可以生成传递给无障碍属性的唯一 ID。

```js
const id = useId()
```

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `useId()` {/*useid*/}

在组件的顶层调用 `useId` 生成唯一 ID：

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  // ...
```

[请看下方更多示例](#usage)。

#### 参数 {/*parameters*/}

`useId` 不带任何参数。

#### 返回值 {/*returns*/}

`useId` 返回一个唯一的字符串 ID，与此特定组件中的 `useId` 调用相关联。

#### 注意事项 {/*caveats*/}

* `useId` 是一个 Hook，因此你只能 **在组件的顶层** 或自己的 Hook 中调用它。你不能在内部循环或条件判断中调用它。如果需要，可以提取一个新组件并将 state 移到该组件中。

* `useId` **不应该被用来生成列表中的 key**。[key 应该由你的数据生成](/learn/rendering-lists#where-to-get-your-key)。

---

## 用法 {/*usage*/}

<Pitfall>

**不要使用 `useId` 来生成列表中的 key**。[key 应该由你的数据生成](/learn/rendering-lists#where-to-get-your-key)。

</Pitfall>

### 为无障碍属性生成唯一 ID {/*generating-unique-ids-for-accessibility-attributes*/}

在组件的顶层调用 `useId` 生成唯一 ID：

```js [[1, 4, "passwordHintId"]]
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  // ...
```

你可以将 <CodeStep step={1}>生成的 ID</CodeStep> 传递给不同的属性：

```js [[1, 2, "passwordHintId"], [1, 3, "passwordHintId"]]
<>
  <input type="password" aria-describedby={passwordHintId} />
  <p id={passwordHintId}>
</>
```

**让我们通过一个例子，看看这个什么时候有用**。

如 [`aria-describedby`](https://developer.mozilla.org/zh-CN/docs/Web/Accessibility/ARIA/Attributes/aria-describedby) 这样的 [HTML 无障碍属性](https://developer.mozilla.org/zh-CN/docs/Web/Accessibility/ARIA) 允许你指定两个标签之间的关系。例如，你可以指定一个元素（比如输入框）由另一个元素（比如段落）描述。

在常规的 HTML 中，你会这样写：

```html {5,8}
<label>
  密码:
  <input
    type="password"
    aria-describedby="password-hint"
  />
</label>
<p id="password-hint">
  密码应该包含至少 18 个字符
</p>
```

然而，在 React 中直接编写 ID 并不是一个好的习惯。一个组件可能会在页面上渲染多次，但是 ID 必须是唯一的！不要使用自己编写的 ID，而是使用 `useId` 生成唯一的 ID。

```js {4,11,14}
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  return (
    <>
      <label>
        密码:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        密码应该包含至少 18 个字符
      </p>
    </>
  );
}
```

现在，即使 `PasswordField` 多次出现在屏幕上，生成的 ID 并不会冲突。

<Sandpack>

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  return (
    <>
      <label>
        密码:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        密码应该包含至少 18 个字符
      </p>
    </>
  );
}

export default function App() {
  return (
    <>
      <h2>输入密码</h2>
      <PasswordField />
      <h2>验证密码</h2>
      <PasswordField />
    </>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

[请看这个视频](https://www.youtube.com/watch?v=0dNzNcuEuOo)，了解辅助技术所提供的用户体验的差异。

<Pitfall>

[使用服务端渲染时](/reference/react-dom/server)，**`useId` 需要在服务器和客户端上有相同的组件树**。如果你在服务器和客户端上渲染的树不完全匹配，生成的 ID 将不匹配。

</Pitfall>

<DeepDive>

#### 为什么 useId 比递增计数器更好？ {/*why-is-useid-better-than-an-incrementing-counter*/}

你可能想知道为什么使用 `useId` 比增加全局变量（如 `nextId++`）更好。

`useId` 的主要好处是 React 确保它能够与 [服务端渲染](/reference/react-dom/server)一起工作。 在服务器渲染期间，你的组件生成输出 HTML。随后，在客户端，[hydration](/reference/react-dom/client/hydrateRoot) 会将你的事件处理程序附加到生成的 HTML 上。由于 hydration，客户端必须匹配服务器输出的 HTML。

使用递增计数器很难保证这一点，因为客户端组件被 hydrate 处理后的顺序可能与服务器 HTML 的顺序不匹配。调用 `useId` 可以确保 hydration 正常工作，以及服务器和客户端之间的输出相匹配。

在 React 内部，调用组件的“父路径”生成 `useId`。这就是为什么如果客户端和服务器的树相同，不管渲染顺序如何，“父路径”始终都匹配。

</DeepDive>

---

### 为多个相关元素生成 ID {/*generating-ids-for-several-related-elements*/}

如果你需要为多个相关元素生成 ID，可以调用 `useId` 来为它们生成共同的前缀：

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const id = useId();
  return (
    <form>
      <label htmlFor={id + '-firstName'}>名字：</label>
      <input id={id + '-firstName'} type="text" />
      <hr />
      <label htmlFor={id + '-lastName'}>姓氏：</label>
      <input id={id + '-lastName'} type="text" />
    </form>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

可以使你避免为每个需要唯一 ID 的元素调用 `useId`。

---

### 为所有生成的 ID 指定共享前缀 {/*specifying-a-shared-prefix-for-all-generated-ids*/}

如果你在单个页面上渲染多个独立的 React 应用程序，请在 [`createRoot`](/reference/react-dom/client/createRoot#parameters) 或 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) 调用中将 `identifierPrefix` 作为选项传递。这确保了由两个不同应用程序生成的 ID 永远不会冲突，因为使用 `useId` 生成的每个 ID 都将以你指定的不同前缀开头。

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <div id="root1"></div>
    <div id="root2"></div>
  </body>
</html>
```

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  console.log('生成的 ID：', passwordHintId)
  return (
    <>
      <label>
        密码:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        密码应该包含至少 18 个字符
      </p>
    </>
  );
}

export default function App() {
  return (
    <>
      <h2>输入密码</h2>
      <PasswordField />
    </>
  );
}
```

```js index.js active
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root1 = createRoot(document.getElementById('root1'), {
  identifierPrefix: 'my-first-app-'
});
root1.render(<App />);

const root2 = createRoot(document.getElementById('root2'), {
  identifierPrefix: 'my-second-app-'
});
root2.render(<App />);
```

```css
#root1 {
  border: 5px solid blue;
  padding: 10px;
  margin: 5px;
}

#root2 {
  border: 5px solid green;
  padding: 10px;
  margin: 5px;
}

input { margin: 5px; }
```

</Sandpack>

---

### Using the same ID prefix on the client and the server {/*using-the-same-id-prefix-on-the-client-and-the-server*/}

If you [render multiple independent React apps on the same page](#specifying-a-shared-prefix-for-all-generated-ids), and some of these apps are server-rendered, make sure that the `identifierPrefix` you pass to the [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) call on the client side is the same as the `identifierPrefix` you pass to the [server APIs](/reference/react-dom/server) such as [`renderToPipeableStream`.](/reference/react-dom/server/renderToPipeableStream)

```js
// Server
import { renderToPipeableStream } from 'react-dom/server';

const { pipe } = renderToPipeableStream(
  <App />,
  { identifierPrefix: 'react-app1' }
);
```

```js
// Client
import { hydrateRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = hydrateRoot(
  domNode,
  reactNode,
  { identifierPrefix: 'react-app1' }
);
```

You do not need to pass `identifierPrefix` if you only have one React app on the page.
