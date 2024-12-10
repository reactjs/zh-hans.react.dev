---
title: prefetchDNS
---

<Intro>

`prefetchDNS` 允许提前查找期望从中加载资源的服务器的 IP。

```js
prefetchDNS("https://example.com");
```

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `prefetchDNS(href)` {/*prefetchdns*/}

调用 `react-dom` 中的 `prefetchDNS` 函数以查找主机。

```js
import { prefetchDNS } from 'react-dom';

function AppRoot() {
  prefetchDNS("https://example.com");
  // ……
}

```

[参见下方更多示例。](#usage)

`prefetchDNS` 函数向浏览器提供一个提示，告诉它应该查找给定服务器的 IP 地址。如果浏览器选择这样做，则可以加快从该服务器加载资源的速度。

#### 参数 {/*parameters*/}

* `href`：字符串，表示希望连接到的服务器 URL。

#### 返回值 {/*returns*/}

`prefetchDNS` 不返回任何值。

#### 注意 {/*caveats*/}

* 对同一服务器进行多次调用 `prefetchDNS` 具有与单次调用相同的效果。
* 在浏览器中，可以在任何情况下调用 `prefetchDNS`：例如渲染组件时、Effect 中以及事件处理程序中等等。
* 在服务器端渲染或渲染服务器组件时，只有在渲染组件或在从渲染组件中发起的异步上下文中调用 `prefetchDNS` 时才会生效。任何其他调用都将被忽略。
* 如果知道即将需要的具体资源，可以调用 [其他函数](/reference/react-dom/#resource-preloading-apis)，这些函数将立即开始加载资源。
* 对于托管网页本身的相同服务器，预获取其 IP 地址没有好处，因为在给出提示时它已经被查找过了。
* 与 [`preconnect`](/reference/react-dom/preconnect) 相比，如果正在尝试与大量域名进行推测性连接，`prefetchDNS` 可能更有效，因为预连接的开销可能会超过其带来的好处。

---

## 用法 {/*usage*/}

### 渲染时预获取 DNS {/*prefetching-dns-when-rendering*/}

如果知道组件的子元素将从该主机加载外部资源，请在渲染组件时调用 `prefetchDNS`。

```js
import { prefetchDNS } from 'react-dom';

function AppRoot() {
  prefetchDNS("https://example.com");
  return ...;
}
```

### 在事件处理程序中预获取 DNS {/*prefetching-dns-in-an-event-handler*/}

在转换到需要外部资源的页面或状态之前，于事件处理程序中调用 `prefetchDNS`。这会比在渲染新页面或状态时调用它更早地启动该过程。

```js
import { prefetchDNS } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    prefetchDNS('http://example.com');
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```
