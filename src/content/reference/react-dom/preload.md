---
title: preload
---

<Note>

 [基于 React 的框架](/learn/start-a-new-react-project) 通常会内置资源处理方案，因此你可能不必手动调用此 API。请查阅框架文档以获取详细信息。

</Note>

<Intro>

`preload` 可以预获取期望使用的资源，比如样式表、字体或外部脚本。

```js
preload("https://example.com/font.woff2", {as: "font"});
```

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `preload(href, options)` {/*preload*/}

调用 `react-dom` 中的 `preload` 函数以实现预加载资源。

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/font.woff2", {as: "font"});
  // ……
}

```

[参见下方更多示例。](#usage)

`preload` 函数向浏览器提供一个提示，告诉它应该开始下载给定的资源，这将会节省时间。

#### 参数 {/*parameters*/}

* `href`：字符串，要下载的资源的 URL。
* `options`：对象，可以包含以下属性：
  *  `as`：必需的字符串，表示资源的类型，[可能的值](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/link#as) 包括 `audio`、`document`、`embed`、`fetch`、`font`、`image`、`object`、`script`、`style`、`track`、`video` 与 `worker`。
  *  `crossOrigin`：字符串，表示要使用的 [CORS 策略](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Attributes/crossorigin)，可能的值为 `anonymous` 与 `use-credentials`。当 `as` 设置为 `"fetch"` 时是必需的。
  *  `referrerPolicy`：字符串，表示在获取时发送的 [referer 请求头](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/link#referrerpolicy)，可能的值为 `no-referrer-when-downgrade`（默认值）、`no-referrer`、`origin`、`origin-when-cross-origin` 与 `unsafe-url`。
  *  `integrity`：字符串，为资源的加密哈希，用于 [验证其真实性](https://developer.mozilla.org/zh-CN/docs/Web/Security/Subresource_Integrity)。
  *  `type`：字符串，表示资源的 MIME 类型。
  *  `nonce`：字符串，表示使用严格内容安全策略时允许资源的 [加密随机数](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes/nonce)。
  *  `fetchPriority`：字符串，为获取资源建议的相对优先级，可能的值为 `auto`（默认值）、`high` 与 `low`。
  *  `imageSrcSet`：字符串，仅与 `as: "image"` 一起使用，用于指定 [图像的源集](https://developer.mozilla.org/zh-CN/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)。
  *  `imageSizes`：字符串，仅与 `as: "image"` 一起使用，用于指定 [图像的尺寸](https://developer.mozilla.org/zh-CN/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)。

#### 返回值 {/*returns*/}

`preload` 不返回任何值。

#### 注意 {/*caveats*/}

* 对 `preload` 的多个等效调用与单个调用具有相同的效果。根据以下规则，对 `preload` 的调用被视为等效：
  * 如果两个调用具有相同的 `href`，则它们是等效的，除非：
  * 如果 `as` 设置为 `image`，并且两个调用具有相同的 `href`、`imageSrcSet` 和 `imageSizes`，则它们是等效的。
* 在浏览器中，可以在任何情况下调用 `preload`：例如渲染组件时、Effect 中以及事件处理程序中等等。
* 在服务器端渲染或渲染服务器组件时，只有在渲染组件时调用 `preload` 或在源自渲染组件的异步上下文中调用时，`preload` 才会生效。其他任何调用都将被忽略。

---

## 用法 {/*usage*/}

### 渲染时进行预加载 {/*preloading-when-rendering*/}

如果知道组件或其子组件将使用特定资源，那么在渲染组件时调用 `preload`。

<Recipes titleText="预加载的例子">

#### 预加载外部脚本 {/*preloading-an-external-script*/}

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/script.js", {as: "script"});
  return ...;
}
```

如果希望浏览器立即开始执行脚本（而不仅仅是下载它），请使用 [`preinit`](/reference/react-dom/preinit)；如果想加载一个 ESM 模块，请使用 [`preloadModule`](/reference/react-dom/preloadModule)。

<Solution />

#### 预加载样式表 {/*preloading-a-stylesheet*/}

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/style.css", {as: "style"});
  return ...;
}
```

如果希望样式表立即被插入到文档中（这意味着浏览器将立即开始解析它而不仅仅是下载它），请使用 [`preinit`](/reference/react-dom/preinit)。

<Solution />

#### 预加载字体 {/*preloading-a-font*/}

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/style.css", {as: "style"});
  preload("https://example.com/font.woff2", {as: "font"});
  return ...;
}
```

如果预加载样式表，最好也预加载样式表引用的任何字体。这样，浏览器可以在下载和解析样式表之前开始下载字体。

<Solution />

#### 预加载图片 {/*preloading-an-image*/}

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("/banner.png", {
    as: "image",
    imageSrcSet: "/banner512.png 512w, /banner1024.png 1024w",
    imageSizes: "(max-width: 512px) 512px, 1024px",
  });
  return ...;
}
```

当预加载图像时，`imageSrcSet` 和 `imageSizes` 选项可以帮助浏览器 [为屏幕尺寸获取正确大小的图像](https://developer.mozilla.org/zh-CN/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)。

<Solution />

</Recipes>

### 在事件处理程序中预加载 {/*preloading-in-an-event-handler*/}

在转换到需要外部资源的页面或状态之前，于事件处理程序中调用 `preload`。这会比在渲染新页面或状态时调用它更早地启动该过程。

```js
import { preload } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preload("https://example.com/wizardStyles.css", {as: "style"});
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```
