---
link: "<link>"
---

<Intro>

[浏览器内置的 `<link>` 组件](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/link) 允许使用外部资源，例如样式表，或使用链接元数据注释文档。

```js
<link rel="icon" href="favicon.ico" />
```

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `<link>` {/*link*/}

渲染 [浏览器内置的 `<link>` 组件](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/link) 以链接外部资源，例如样式表、字体和图标，或者在文档中通过链接元数据进行注释。可以在任何组件中渲染 `<link>`，并且 React 会在大多数情况下将相应的 DOM 元素放在文档头部。

```js
<link rel="icon" href="favicon.ico" />
```

[参见下方更多示例](#usage)。

#### 属性 {/*props*/}

`<link>` 支持所有 [常见元素属性](/reference/react-dom/components/common#common-props)。

* `rel`：字符串，必需字段，用于指定 [与资源的关系](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Attributes/rel)。React [将具有 `rel="stylesheet"` 的链接](#special-rendering-behavior) 与其他链接区别对待。

当 `rel="stylesheet"` 时，应用以下属性：

* `precedence`：字符串，用于告诉 React 在文档 `<head>` 中将 `<link>` DOM 节点排在其他节点之前的位置，这决定了哪个样式表可以覆盖其他样式表。React 会推断其首先发现的 `precedence` 值为“较低”，而后来发现的 `precedence` 值为“较高”。许多样式系统使用单个 `precedence` 值能够很好地工作，因为样式规则是原子的。无论是 `<link>` 还是内联 `<style>` 标签，或者使用 [`preinit`](/reference/react-dom/preinit) 函数加载的内容，具有相同优先级的样式表将一起处理。
* `media`：字符串，用于将样式表限制为特定的 [媒体查询](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_media_queries/Using_media_queries)。
* `title`：字符串，用于指定 [替代样式表](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Alternative_style_sheets) 的名称。

当 `rel="stylesheet"` 但禁用了 React 的 [样式表特殊处理](#special-rendering-behavior) 时，应当应用以下属性：

* `disabled`：布尔值，表示禁用样式表。
* `onError`：函数，当样式表加载失败时调用。
* `onLoad`：函数，当样式表加载完成时调用。

当 `rel="preload"` 或 `rel="modulepreload"` 时，应当应用以下属性：

* `as`：字符串，表示资源类型，可能的值包括 `audio`、`document`、`embed`、`fetch`、`font`、`image`、`object`、`script`、`style`、`track`、`video` 与 `worker`。
* `imageSrcSet`：字符串，仅当 `as="image"` 时适用，用于指定 [图像的源集](https://developer.mozilla.org/zh-CN/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)。
* `imageSizes`：字符串，仅当 `as="image"` 时适用，用于指定 [图像的尺寸](https://developer.mozilla.org/zh-CN/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)。

当 `rel="icon"` 或 `rel="apple-touch-icon"` 时，应当应用以下属性：

* `sizes`：字符串，表示 [图标的尺寸](https://developer.mozilla.org/zh-CN/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)。

在所有情况下都应用以下属性：

* `href`：字符串，表示链接资源的 URL。
* `crossOrigin`：字符串，表示要使用的 [CORS策略](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Attributes/crossorigin)。当 `as` 设置为 `"fetch"` 时，此字段是必需的。
* `referrerPolicy`：字符串，表示获取时发送的 [referer 请求头](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/link#referrerpolicy)，可能的值包括 `no-referrer-when-downgrade`（默认值）、`no-referrer`、`origin`、`origin-when-cross-origin` 与 `unsafe-url`。
* `fetchPriority`：字符串，为获取资源建议的相对优先级，可能的值包括 `auto`（默认值）、`high` 与 `low`。
* `hrefLang`：字符串，表示链接资源的语言。
* `integrity`：字符串，表示资源的加密哈希，用于 [验证其真实性](https://developer.mozilla.org/zh-CN/docs/Web/Security/Subresource_Integrity)。
* `type`：字符串，表示链接资源的 MIME 类型。

不建议与 React 一起使用的属性：

* `blocking`：字符串，如果设置为 `"render"`，则指示浏览器在样式表加载完毕前不渲染页面。React 使用 Suspense 提供更精细的控制。

#### 特殊的渲染行为 {/*special-rendering-behavior*/}

无论 `<link>` 组件在 React 树中的哪个位置被渲染，React 都会始终将其对应的 DOM 元素放在文档的 `<head>` 中。`<head>` 是 `<link>` 在 DOM 中唯一有效的位置，但如果表示特定页面的组件可以自行渲染 `<link>` 组件，则这种做法既方便又保持了可组合性。

但是，有几个例外情况：

* 如果 `<link>` 具有 `rel="stylesheet"` 属性，则它还必须具有 `precedence` 属性才能保持此特殊行为。这是因为文档中样式表的顺序很重要，因此 React 需要知道如何将此样式表与其他样式表排序，这可以使用 `precedence` 属性指定。如果省略了 `precedence` 属性，则没有特殊行为。
* 如果 `<link>` 具有 [`itemProp`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes/itemprop) 属性，则没有特殊行为，因为在这种情况下，它不适用于文档，而只是表示页面特定部分的元数据。
* 如果 `<link>` 具有 `onLoad` 或 `onError` 属性，则没有特殊行为，因为在这种情况下，你需要在 React 组件中手动管理链接资源的加载。

#### 链接到样式表的特殊行为 {/*special-behavior-for-stylesheets*/}

此外，如果 `<link>` 指向的是样式表（即，在其属性中具有 `rel="stylesheet"`），React 会以以下方式对其进行特殊处理：

* 渲染 `<link>` 的组件将在样式表加载时进行 [挂起](/reference/react/Suspense)。
* 如果多个组件渲染指向相同样式表的链接，React 将对它们进行去重，并只将单个链接放入 DOM 中。如果两个链接具有相同的 `href` 属性，则认为它们是相同的。

但是，有两个例外情况：

* 如果链接没有 `precedence` 属性，则没有特殊行为，因为文档中样式表的顺序很重要，因此 React 需要知道如何将此样式表与其他样式表排序，可以使用 `precedence` 属性指定。
* 如果提供了任何 `onLoad`、`onError` 或 `disabled` 属性，则没有特殊行为，因为这些属性表明你正在组件内部手动管理样式表的加载。

这种特殊处理带有两个注意事项：

* 在链接渲染后，React 将忽略属性的更改（React 在开发环境中会对这种情况发出警告）。
* 即使渲染它的组件已被卸载，React 也可能会保留链接在 DOM 中。

---

## 用法 {/*usage*/}

### 链接到相关资源 {/*linking-to-related-resources*/}

可以使用链接来为文档添加与相关资源的关联，例如图标、规范 URL 或回传。无论在 React 树中的哪个位置被渲染，React 都会将这些元数据放在文档的 `<head>` 中。

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function BlogPage() {
  return (
    <ShowRenderedHTML>
      <link rel="icon" href="favicon.ico" />
      <link rel="pingback" href="http://www.example.com/xmlrpc.php" />
      <h1>我的博客</h1>
      <p>……</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### 链接到样式表 {/*linking-to-a-stylesheet*/}

如果一个组件依赖于某个样式表以正确显示，可以在组件内部渲染一个指向该样式表的链接。当样式表加载时，组件将会 [挂起](/reference/react/Suspense)。因此必须提供 `precedence` 属性，该属性告诉 React 将此样式表放置在其他样式表的何处——具有较高优先级的样式表可以覆盖较低优先级的样式表。

<Note>
当想使用样式表时，调用 [preinit](/reference/react-dom/preinit) 函数可能是有益的。调用此函数可能使浏览器比仅渲染一个 `<link>` 组件更早地开始获取样式表，例如通过发送 [HTTP 103 Early Hints 响应](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/103)。
</Note>

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function SiteMapPage() {
  return (
    <ShowRenderedHTML>
      <link rel="stylesheet" href="sitemap.css" precedence="medium" />
      <p>……</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### 控制样式表优先级 {/*controlling-stylesheet-precedence*/}

样式表可能会相互冲突，当发生冲突时，浏览器会选择文档中排在后面的样式表。React 允许使用 `precedence` 属性来控制样式表的顺序。在这个例子中，三个组件渲染样式表，具有相同优先级的组件在 `<head>` 中将会被分组在一起。

{/*FIXME: this doesn't appear to actually work -- I guess precedence isn't implemented yet?*/}

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function HomePage() {
  return (
    <ShowRenderedHTML>
      <FirstComponent />
      <SecondComponent />
      <ThirdComponent/>
      ...
    </ShowRenderedHTML>
  );
}

function FirstComponent() {
  return <link rel="stylesheet" href="first.css" precedence="first" />;
}

function SecondComponent() {
  return <link rel="stylesheet" href="second.css" precedence="second" />;
}

function ThirdComponent() {
  return <link rel="stylesheet" href="third.css" precedence="first" />;
}

```

</SandpackWithHTMLOutput>

Note the `precedence` values themselves are arbitrary and their naming is up to you. React will infer that precedence values it discovers first are "lower" and precedence values it discovers later are "higher".

### 去除样式表的重复渲染 {/*deduplicated-stylesheet-rendering*/}

如果在多个组件渲染相同的样式表，React 将只在文档头部放置单个 `<link>`。

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function HomePage() {
  return (
    <ShowRenderedHTML>
      <Component />
      <Component />
      ...
    </ShowRenderedHTML>
  );
}

function Component() {
  return <link rel="stylesheet" href="styles.css" precedence="medium" />;
}
```

</SandpackWithHTMLOutput>

### 使用链接为文档中的特定项添加注释 {/*annotating-specific-items-within-the-document-with-links*/}

可以使用带有 `itemProp` 属性的 `<link>` 组件来为文档中的特定项添加链接到相关资源的注释。在这种情况下，React 不会将这些注释放置在文档 `<head>` 中，而是像任何其他 React 组件一样放置它们。

```js
<section itemScope>
  <h3>为特定项添加注释</h3>
  <link itemProp="author" href="http://example.com/" />
  <p>...</p>
</section>
```
