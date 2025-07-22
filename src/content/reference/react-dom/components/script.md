---
script: "<script>"
---

<Intro>

[浏览器内置的 `<script>` 组件](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script) 允许向文档添加脚本。

```js
<script> alert("hi!") </script>
```

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `<script>` {/*script*/}

渲染 [浏览器内置的 `<script>` 组件](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script) 以向文档添加内联或外部脚本。可以在任何组件中渲染 `<script>`，React 将在某些情况下将相应的 DOM 元素放置在文档头部，并对相同的脚本进行去重。

```js
<script> alert("hi!") </script>
<script src="script.js" />
```

[参见下方更多示例](#usage)。

#### 属性 {/*props*/}

`<script>` 支持所有 [通用元素属性](/reference/react-dom/components/common#common-props)。

它应该要么具有 `children` 属性，要么具有 `src` 属性。

* `children`：字符串，内联脚本的源代码。
* `src`：字符串，外部脚本的 URL。

但也支持其他属性：

* `async`：布尔值，允许浏览器延迟执行脚本，直到文档的其余部分已经处理完毕——这是性能优化的首选行为。
* `crossOrigin`：字符串，表示要使用的 [CORS 策略](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin)，其可能的值为 `anonymous` 和 `use-credentials`。
* `fetchPriority`：字符串，用于指示浏览器在同时获取多个脚本时按优先级对脚本进行排名，可能的值包括 `"high"`、`"low"` 与 `"auto"`（默认值）。
* `integrity`：字符串，脚本的密码哈希，用于 [验证其真实性](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)。
* `noModule`：布尔值，表示在支持 ES 模块的浏览器中禁用脚本——用于为不支持的浏览器提供一个后备脚本。
* `nonce`：字符串，表示使用严格内容安全策略时允许资源的 [加密随机数](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes/nonce)。
* `referrer`：字符串，指定在获取脚本以及脚本依次获取任何资源时发送的 [referer 请求头](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#referrerpolicy)。
* `type`：字符串，指定脚本是一个 [传统脚本、ES 模块还是导入映射](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type)。

禁用 React 对脚本的 [特殊处理](#special-rendering-behavior) 的属性：

* `onError`：脚本加载失败时调用的函数。
* `onLoad`：脚本加载完成时调用的函数。

不建议与 React 一起使用的属性：

* `blocking`：字符串。如果其设置为 `"render"`，指示浏览器在脚本加载完成之前不要渲染页面。React 使用 Suspense 提供了更精细的控制。
* `defer`：字符串，用于防止浏览器在文档加载完成之前执行脚本。与流式服务器端渲染组件不兼容。请改用 `async` 属性。

#### 特殊的渲染行为 {/*special-rendering-behavior*/}

React 可以将 `<script>` 组件移动到文档的 `<head>` 中，并对相同脚本进行去重。

可以提供 `src` 和 `async={true}` 属性以选择行为。如果脚本具有相同的 `src`，React 将对脚本去重。`async` 属性必须为 true 才能安全地移动脚本。

这种特殊处理带来两个注意事项：

* 在脚本被渲染后，React 将忽略属性的更改（React 在开发环境中会对这种情况发出警告）。
* 即使渲染它的组件已被卸载，React 也可能将脚本保留在 DOM 中（这不会产生影响，因为脚本只在插入到 DOM 中时执行一次）。

---

## 用法 {/*usage*/}

### 渲染内部脚本 {/*rendering-an-external-script*/}

If a component depends on certain scripts in order to be displayed correctly, you can render a `<script>` within the component.
However, the component might be committed before the script has finished loading.
You can start depending on the script content once the `load` event is fired e.g. by using the `onLoad` prop.

React will de-duplicate scripts that have the same `src`, inserting only one of them into the DOM even if multiple components render it.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

function Map({lat, long}) {
  return (
    <>
      <script async src="map-api.js" onLoad={() => console.log('script loaded')} />
      <div id="map" data-lat={lat} data-long={long} />
    </>
  );
}

export default function Page() {
  return (
    <ShowRenderedHTML>
      <Map />
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

<Note>
想要使用脚本时，调用 [preinit](/reference/react-dom/preinit) 函数可能会有益处。调用此函数可能会使浏览器比仅渲染 `<script>` 组件更早地开始获取脚本，例如通过发送 [HTTP 103 Early Hints 响应](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/103)。
</Note>

### 渲染内联脚本 {/*rendering-an-inline-script*/}

如果需要包含内联脚本，请将 `<script>` 组件渲染为其子元素的脚本源代码。内联脚本不会被去重或移动到文档 `<head>` 中。

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

function Tracking() {
  return (
    <script>
      ga('send', 'pageview');
    </script>
  );
}

export default function Page() {
  return (
    <ShowRenderedHTML>
      <h1>My Website</h1>
      <Tracking />
      <p>Welcome</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>
