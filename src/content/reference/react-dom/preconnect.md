---
title: preconnect
canary: true
---

<Canary>

`preconnect` 函数当前仅在 React Canary 与 experimental 渠道中可用，请在 [此处了解更多关于 React 发布渠道的信息](/community/versioning-policy#all-release-channels)。

</Canary>

<Intro>

`preconnect` 可以帮助提前连接到一个期望从中加载资源的服务器。

```js
preconnect("https://example.com");
```

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `preconnect(href)` {/*preconnect*/}

调用 `react-dom` 中的 `preconnect` 函数以实现预连接到主机。

```js
import { preconnect } from 'react-dom';

function AppRoot() {
  preconnect("https://example.com");
  // ……
}

```

[参见下方更多示例](#usage)。

`preconnect` 函数向浏览器提供一个提示，告诉它应该打开到给定服务器的连接。如果浏览器选择这样做，则可以加快从该服务器加载资源的速度。

#### 参数 {/*parameters*/}

* `href`：字符串，表示希望连接到的服务器 URL。


#### 返回值 {/*returns*/}

`preconnect` 不返回任何值。

#### 注意 {/*caveats*/}

<<<<<<< HEAD
* 对同一服务器进行多次调用 `preconnect` 具有与单次调用相同的效果。
* 在浏览器中，可以在任何情况下调用 `preconnect`：例如渲染组件时、Effect 中以及事件处理程序中等等。
* 在服务器端渲染或渲染服务器组件时，只有在渲染组件或在从渲染组件中发起的异步上下文中调用 `preconnect` 时才会生效。任何其他调用都将被忽略。
* 如果知道即将需要的具体资源，可以调用 [其他函数](/reference/react-dom/#resource-preloading-apis)，这些函数将立即开始加载资源。
* 预连接到托管网页本身的相同服务器没有好处，因为在给出提示时它已经连接。
=======
* Multiple calls to `preconnect` with the same server have the same effect as a single call.
* In the browser, you can call `preconnect` in any situation: while rendering a component, in an Effect, in an event handler, and so on.
* In server-side rendering or when rendering Server Components, `preconnect` only has an effect if you call it while rendering a component or in an async context originating from rendering a component. Any other calls will be ignored.
* If you know the specific resources you'll need, you can call [other functions](/reference/react-dom/#resource-preloading-apis) instead that will start loading the resources right away.
* There is no benefit to preconnecting to the same server the webpage itself is hosted from because it's already been connected to by the time the hint would be given.
>>>>>>> 2aa9594184e5cdd6cd52771d6a343b45e0e829cf

---

## 用法 {/*usage*/}

### 渲染时预连接 {/*preconnecting-when-rendering*/}

如果知道组件的子元素将从该主机加载外部资源，请在渲染组件时调用 `preconnect`。

```js
import { preconnect } from 'react-dom';

function AppRoot() {
  preconnect("https://example.com");
  return ...;
}
```

### 在事件处理程序中预连接 {/*preconnecting-in-an-event-handler*/}

在转换到需要外部资源的页面或状态之前，于事件处理程序中调用 `preconnect`。这会比在渲染新页面或状态时调用它更早地启动该过程。

```js
import { preconnect } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preconnect('http://example.com');
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```
