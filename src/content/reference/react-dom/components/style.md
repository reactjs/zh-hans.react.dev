---
style: "<style>"
canary: true
---

<Canary>

React 对 `<style>` 的扩展当前仅在 React Canary 与 experimental 渠道中可用。在 React 的稳定版本中，`<style>` 仅作为 [浏览器内置 HTML 组件](https://react.dev/reference/react-dom/components#all-html-components) 使用。请在 [此处了解更多关于 React 发布渠道的信息](/community/versioning-policy#all-release-channels)。

</Canary>

<Intro>

[浏览器内置的 `<style>` ](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style) 允许向文档添加内联 CSS 样式表。

```js
<style> p { color: red; } </style>
```

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `<style>` {/*style*/}

渲染 [内置的浏览器 `<style>` 组件](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style) 以向文档添加内联样式。可以在任何组件中渲染 `<style>`，React 将在某些情况下将相应的 DOM 元素放置在文档头部，并对相同的样式进行去重。

```js
<style> p { color: red; } </style>
```

[参见下方更多示例](#usage)。

#### 属性 {/*props*/}

`<style>` 支持所有 [常见元素属性](/reference/react-dom/components/common#props)。

* `children`：字符串，必需字段，表示样式表的内容。
* `precedence`：字符串，告诉 React 在文档 `<head>` 中排列 `<style>` DOM 节点的位置，确定哪个样式表可以覆盖另一个，可能的值包括（按优先级排序）`"reset"`、`"low"`、`"medium"` 与 `"high"`。无论是 `<link>` 还是内联 `<style>` 标签，或者使用 [`preload`](/reference/react-dom/preload) 或 [`preinit`](/reference/react-dom/preinit) 函数加载的样式表，具有相同优先级的将一起处理。
* `href`：字符串，允许 React [对 `href` 相同的样式进行去重](#special-rendering-behavior)。
* `media`：字符串，将样式表限制为特定的 [媒体查询](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries)。
* `nonce`：字符串，表示使用严格内容安全策略时允许资源的 [加密随机数](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes/nonce)。
* `title`：字符串，用于指定 [替代样式表](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Alternative_style_sheets) 的名称。

不建议在 React 中使用的属性：

* `blocking`：字符串。如果指定为 `"render"`，指示浏览器在样式表加载之前不要渲染页面。React 使用 Suspense 提供了更精细的控制。

#### 特殊的渲染行为 {/*special-rendering-behavior*/}

React 可以将 `<style>` 组件移动到文档的 `<head>` 中，去重相同的样式表，并在样式表加载时 [挂起](/reference/react/Suspense)。

请提供 `href` 和 `precedence` 属性以选择此行为。如果样式表具有相同的 `href`，React 将去重样式。优先级属性告诉 React 在文档的 `<head>` 中排列 `<style>` DOM 节点的位置，从而确定哪个样式表可以覆盖另一个。

这种特殊处理带来两个注意事项：

* 在样式被渲染后，React 将忽略属性的更改（在开发模式中，如果发生这种情况，React 将发出警告）。
* 即使渲染它的组件已被卸载，React 也可能将样式保留在 DOM 中。

---

## 用法 {/*usage*/}

### 渲染一个内联 CSS 样式表 {/*rendering-an-inline-css-stylesheet*/}

如果一个组件依赖于某些 CSS 样式以正确显示，可以在组件内部渲染一个内联样式表。

如果提供了 `href` 和 `precedence` 属性，组件将在样式表加载时挂起（即使是内联样式表，由于样式表引用的字体和图像，可能也会有加载时间）。`href` 属性应该唯一地标识样式表，因为 React 将去重具有相同 `href` 的样式表。

<SandpackWithHTMLOutput>

```js App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';
import { useId } from 'react';

function PieChart({data, colors}) {
  const id = useId();
  const stylesheet = colors.map((color, index) =>
    `#${id} .color-${index}: \{ color: "${color}"; \}`
  ).join();
  return (
    <>
      <style href={"PieChart-" + JSON.stringify(colors)} precedence="medium">
        {stylesheet}
      </style>
      <svg id={id}>
        …
      </svg>
    </>
  );
}

export default function App() {
  return (
    <ShowRenderedHTML>
      <PieChart data="..." colors={['red', 'green', 'blue']} />
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>
