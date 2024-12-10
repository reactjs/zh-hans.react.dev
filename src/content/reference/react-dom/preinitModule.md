---
title: preinitModule
---

<Note>

[基于 React 的框架](/learn/start-a-new-react-project) 通常会内置资源处理方案，因此你可能不必手动调用此 API。请查阅框架文档以获取详细信息。

</Note>

<Intro>

`preinitModule` 可以预获取和评估 ESM 模块。

```js
preinitModule("https://example.com/module.js", {as: "script"});
```

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `preinitModule(href, options)` {/*preinitmodule*/}

调用 `react-dom` 中的 `preinitModule` 函数以实现预初始化 ESM 模块。

```js
import { preinitModule } from 'react-dom';

function AppRoot() {
  preinitModule("https://example.com/module.js", {as: "script"});
  // ……
}

```

[参见下方更多示例。](#usage)。

`preinitModule` 函数向浏览器提供一个提示，告诉它应该开始下载并执行给定的模块，这可以节省时间。预初始化的模块在下载完成后执行。

#### 参数 {/*parameters*/}

* `href`：字符串，要下载并执行的模块的 URL。
* `options`：对象，可以包含以下属性：
  *  `as`：必需的字符串，只能是 `script`。
  *  `crossOrigin`：字符串，表示要使用的 [CORS 策略](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Attributes/crossorigin)，可能的值为 `anonymous` 与 `use-credentials`。
  *  `integrity`：字符串，为资源的加密哈希，用于 [验证其真实性](https://developer.mozilla.org/zh-CN/docs/Web/Security/Subresource_Integrity)。
  *  `nonce`：字符串，表示使用严格内容安全策略时允许资源的 [加密随机数](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes/nonce)。

#### 返回值 {/*returns*/}

`preinitModule` 不返回任何值。

#### 注意 {/*caveats*/}

* 对于具有相同 `href` 的多个 `preinitModule` 调用具有与单个调用相同的效果。
* 在浏览器中，可以在任何情况下调用 `preinitModule`：例如渲染组件时、Effect 中以及事件处理程序中等等。
* 在服务器端渲染或渲染服务器组件时，只有在渲染组件时调用 `preinitModule` 或在源自渲染组件的异步上下文中调用时，`preinitModule` 才会生效。其他任何调用都将被忽略。

---

## 用法 {/*usage*/}

### 渲染时预加载 {/*preloading-when-rendering*/}

如果你知道组件或其子元素将使用特定模块，并且可以接受开始评估模块并在下载后立即生效，可以在渲染组件时调用 `preinitModule`。

```js
import { preinitModule } from 'react-dom';

function AppRoot() {
  preinitModule("https://example.com/module.js", {as: "script"});
  return ...;
}
```

如果希望浏览器下载模块但不立即执行它，请改用 [`preloadModule`](/reference/react-dom/preloadModule)；如果想预初始化一个不是 ESM 模块的脚本，请使用 [`preinit`](/reference/react-dom/preinit)。

### 在事件处理程序中预加载 {/*preloading-in-an-event-handler*/}

在转换到需要外部资源的页面或状态之前，于事件处理程序中调用 `preinitModule`。这会比在渲染新页面或状态时调用它更早地启动该过程。

```js
import { preinitModule } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preinitModule("https://example.com/module.js", {as: "script"});
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```
