---
style: "<style>"
---

<Intro>

[浏览器内置的 `<style>` ](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style) 允许向文档添加内联 CSS 样式表。

```js
<style>{` p { color: red; } `}</style>
```

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `<style>` {/*style*/}

渲染 [内置的浏览器 `<style>` 组件](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style) 以向文档添加内联样式。可以在任何组件中渲染 `<style>`，React 将在某些情况下将相应的 DOM 元素放置在文档头部，并对相同的样式进行去重。

```js
<style>{` p { color: red; } `}</style>
```

[参见下方更多示例](#usage)。

#### 属性 {/*props*/}

`<style>` 支持所有 [常见元素属性](/reference/react-dom/components/common#common-props)。

* `children`：字符串，必需字段，表示样式表的内容。
* `precedence`：字符串，告诉 React 在文档 `<head>` 中排列 `<style>` DOM 节点的位置，确定哪个样式表可以覆盖另一个。React 会推断其首先发现的 `precedence` 值为“较低”，而后来发现的 `precedence` 值为“较高”。许多样式系统使用单个 `precedence` 值能够很好地工作，因为样式规则是原子的。无论是 `<link>` 还是内联 `<style>` 标签，或者使用 [`preinit`](/reference/react-dom/preinit) 函数加载的样式表，具有相同优先级的将一起处理。
* `href`：字符串，允许 React [对 `href` 相同的样式进行去重](#special-rendering-behavior)。
* `media`：字符串，将样式表限制为特定的 [媒体查询](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries)。
* `nonce`：字符串，表示使用严格内容安全策略时允许资源的 [加密随机数](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes/nonce)。
* `title`：字符串，用于指定 [替代样式表](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Alternative_style_sheets) 的名称。

不建议在 React 中使用的属性：

* `blocking`：字符串。如果指定为 `"render"`，指示浏览器在样式表加载之前不要渲染页面。React 使用 Suspense 提供了更精细的控制。

#### 特殊的渲染行为 {/*special-rendering-behavior*/}

React 可以将 `<style>` 组件移动到文档的 `<head>` 中，去重相同的样式表，并在样式表加载时 [挂起](/reference/react/Suspense)。

请提供 `href` 和 `precedence` 属性以选择此行为。如果样式表具有相同的 `href`，React 将对样式去重。优先级属性告诉 React 在文档的 `<head>` 中排列 `<style>` DOM 节点的位置，从而确定哪个样式表可以覆盖另一个。

这种特殊处理带来两个注意事项：

* 在样式被渲染后，React 将忽略属性的更改（React 在开发环境中会对这种情况发出警告）。
* 当设置了 `precedence` 属性的时候，React 会丢弃除了 `href` 和 `precedence` 的之外所有无关属性。
* 即使渲染它的组件已被卸载，React 也可能将样式保留在 DOM 中。

---

## 用法 {/*usage*/}

### 渲染一个内联 CSS 样式表 {/*rendering-an-inline-css-stylesheet*/}

如果一个组件依赖于某些 CSS 样式以正确显示，可以在组件内部渲染一个内联样式表。

`href` 属性应该在样式表中唯一，因为 React 会删除具有相同 `href` 属性的重复样式表。
如果你提供了 `precedence` 属性，React 将根据这些值在组件树中出现的顺序对内联样式表重新排序。

内联样式表在加载时不会触发 Suspense 边界。
即使他们加载字体或图像等异步资源。

<SandpackWithHTMLOutput>

```js src/App.js active
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
