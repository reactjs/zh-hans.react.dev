---
title: "<title>"
---

<Intro>

[浏览器内置的 `<title>` 组件](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title) 允许向文档指定标题。

```js
<title>我的博客</title>
```

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `<title>` {/*title*/}

渲染 [浏览器内置的 `<title>` 组件](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title) 以指定文档标题。可以在任何组件中渲染 `<title>`，React 会始终将相应的 DOM 元素放置在文档头部。

```js
<title>我的博客</title>
```

[参见下方更多示例](#usage)。

#### 属性 {/*props*/}

`<title>` 支持所有 [常见元素属性](/reference/react-dom/components/common#common-props)。

* `children`：`<title>` 只接受文本作为子元素。该文本将成为文档的标题，也可以传递只渲染文本的自定义组件。

#### 特殊的渲染行为 {/*special-rendering-behavior*/}

无论在 React 树中的哪个位置被渲染，React 将始终将与 `<title>` 组件对应的 DOM 元素放置在文档的 `<head>` 中。`<head>` 是 `<title>` 在 DOM 中唯一有效的位置，但如果表示特定页面的组件可以自行渲染其 `<title>`，这样做既方便又保持了可组合性。

有两个例外情况：
* 如果 `<title>` 在 `<svg>` 组件内部，则没有特殊行为，因为在这种情况下它不代表文档的标题，而是 [SVG 图形的可访问性注释](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/title)。
* 如果 `<title>` 具有 [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop) 属性，也没有特殊行为，因为在这种情况下它不代表文档的标题，而是页面特定部分的元数据。

<Pitfall>

一次只渲染呈现一个 `<title>`。如果多个组件同时渲染那 `<title>` 标签，React 将把所有这些标题放在文档头部。发生这种情况时，浏览器和搜索引擎的行为是不确定的。

</Pitfall>

---

## 用法 {/*usage*/}

### 设置文档标题 {/*set-the-document-title*/}

从任何组件中使用文本作为其子元素渲染 `<title>` 组件。React 将在文档的 `<head>` 中放置一个 `<title>` DOM 节点。

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function ContactUsPage() {
  return (
    <ShowRenderedHTML>
      <title>我的网站：联系我们</title>
      <h1>联系我们</h1>
      <p>通过电子邮件 support@example.com 联系我们</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### 在标题中使用变量 {/*use-variables-in-the-title*/}

`<title>` 组件的子元素必须是单个文本字符串（或者是单个数字或带有 `toString` 方法的单个对象）。可能并不明显，但这样使用 JSX 大括号是存在问题的：

```js
<title>Results page {pageNumber}</title> // 🔴 问题：这不是单个字符串
```

……实际上会导致 `<title>` 组件的子元素是一个包含两个元素的数组（字符串 `"Results page"` 和 `pageNumber` 的值）。这将导致错误，应该使用字符串插值传递给 `<title>` 一个单个字符串：

```js
<title>{`Results page ${pageNumber}`}</title>
```

