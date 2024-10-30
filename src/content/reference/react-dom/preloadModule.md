---
title: preloadModule
canary: true
---

<Canary>

`preloadModule` 函数当前仅在 React Canary 与 experimental 渠道中可用，请在 [此处了解更多关于 React 发布渠道的信息](/community/versioning-policy#all-release-channels)。

</Canary>

<Note>

[基于 React 的框架](/learn/start-a-new-react-project) 通常会内置资源处理方案，因此你可能不必手动调用此 API。请查阅框架文档以获取详细信息。

</Note>

<Intro>

`preloadModule` 可以急切地预获取期望使用的 ESM 模块。

```js
preloadModule("https://example.com/module.js", {as: "script"});
```

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `preloadModule(href, options)` {/*preloadmodule*/}

 调用 `react-dom` 中的 `preloadModule` 函数以实现预加载资源。

```js
import { preloadModule } from 'react-dom';

function AppRoot() {
  preloadModule("https://example.com/module.js", {as: "script"});
  // ……
}

```

[参见下方更多示例](#usage)。

`preloadModule` 函数向浏览器提供一个提示，告诉它应该开始下载给定的资源，这将会节省时间。

#### 参数 {/*parameters*/}

* `href`：字符串，要下载的资源的 URL。
* `options`：对象，可以包含以下属性：
  *  `as`：必需的字符串，表示资源的类型，[可能的值](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/link#as) 包括 `audio`、`document`、`embed`、`fetch`、`font`、`image`、`object`、`script`、`style`、`track`、`video` 与 `worker`。
  *  `crossOrigin`：字符串，表示要使用的 [CORS 策略](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Attributes/crossorigin)，可能的值为 `anonymous` 与 `use-credentials`。当 `as` 设置为 `"fetch"` 时是必需的。
  *  `integrity`：字符串，为资源的加密哈希，用于 [验证其真实性](https://developer.mozilla.org/zh-CN/docs/Web/Security/Subresource_Integrity)。
  *  `nonce`：字符串，表示使用严格内容安全策略时允许资源的 [加密随机数](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes/nonce)。


#### Returns {/*returns*/}

`preloadModule` 不返回任何值。

#### 注意 {/*caveats*/}

* 对于相同的 `href`，多次调用 `preloadModule` 具有与单次调用相同的效果。
* 在浏览器中，你可以在任何情况下调用 `preloadModule`：在渲染组件时、在 Effect 中以及在事件处理程序中等等。
* 在服务器端渲染或渲染服务器组件时，只有在渲染组件或在从渲染组件中发起的异步上下文中调用 `preloadModule` 时才会生效。任何其他调用都将被忽略。

---

## 用法 {/*usage*/}

### 在渲染时预加载 {/*preloading-when-rendering*/}

如果知道组件或其子组件将使用特定资源，那么在渲染组件时调用 `preloadModule`。

```js
import { preloadModule } from 'react-dom';

function AppRoot() {
  preloadModule("https://example.com/module.js", {as: "script"});
  return ...;
}
```

如果希望浏览器立即开始执行模块（而不仅仅是下载它），请改用 [`preinitModule`](/reference/react-dom/preinitModule)；如果想加载一个不是 ESM 模块的脚本，请使用 [`preload`](/reference/react-dom/preload)。

### 在事件处理程序中预加载 {/*preloading-in-an-event-handler*/}

在转换到需要外部资源的页面或状态之前，于事件处理程序中调用 `preloadModule`。这会比在渲染新页面或状态时调用它更早地启动了该过程。

```js
import { preloadModule } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preloadModule("https://example.com/module.js", {as: "script"});
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```
