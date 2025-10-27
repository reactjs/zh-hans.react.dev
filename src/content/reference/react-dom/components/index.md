---
title: "React DOM 组件"
---

<Intro>

React 支持所有浏览器内置的 [HTML](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element) 与 [SVG](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element) 组件。

</Intro>

---

## 通用组件 {/*common-components*/}

所有的浏览器内置组件都支持一些共同的属性与方法。

* [通用组件（如 `<div>`）](/reference/react-dom/components/common)

这些组件在 React 中可以使用 React 特有的属性，如 `ref` 与 `dangerouslySetInnerHTML`。

---

## 表单组件 {/*form-components*/}

这些浏览器内置组件接收用户的输入：

* [`<input>`](/reference/react-dom/components/input)
* [`<select>`](/reference/react-dom/components/select)
* [`<textarea>`](/reference/react-dom/components/textarea)

将 `value` 作为 prop 传递给这些组件会将其变为 [受控组件](/reference/react-dom/components/input#controlling-an-input-with-a-state-variable)。

---

## 资源和元数据组件 {/*resource-and-metadata-components*/}

通过这些内置浏览器组件，您可以加载外部资源或为文档添加元数据注释：

* [`<link>`](/reference/react-dom/components/link)
* [`<meta>`](/reference/react-dom/components/meta)
* [`<script>`](/reference/react-dom/components/script)
* [`<style>`](/reference/react-dom/components/style)
* [`<title>`](/reference/react-dom/components/title)

它们在 React 中是特殊的，因为 React 可以将它们渲染到文档头部，在资源加载时暂停，并执行参考页面中针对每个特定组件描述的其他行为。

---

## 所有的 HTML 组件 {/*all-html-components*/}

React 支持所有浏览器内置的组件，包括：

* [`<aside>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/aside)
* [`<audio>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/audio)
* [`<b>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/b)
* [`<base>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/base)
* [`<bdi>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/bdi)
* [`<bdo>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/bdo)
* [`<blockquote>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/blockquote)
* [`<body>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/body)
* [`<br>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/br)
* [`<button>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/button)
* [`<canvas>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/canvas)
* [`<caption>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/caption)
* [`<cite>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/cite)
* [`<code>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/code)
* [`<col>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/col)
* [`<colgroup>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/colgroup)
* [`<data>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/data)
* [`<datalist>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/datalist)
* [`<dd>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/dd)
* [`<del>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/del)
* [`<details>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/details)
* [`<dfn>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/dfn)
* [`<dialog>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/dialog)
* [`<div>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/div)
* [`<dl>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/dl)
* [`<dt>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/dt)
* [`<em>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/em)
* [`<embed>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/embed)
* [`<fieldset>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/fieldset)
* [`<figcaption>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/figcaption)
* [`<figure>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/figure)
* [`<footer>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/footer)
* [`<form>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/form)
* [`<h1>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/h1)
* [`<head>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/head)
* [`<header>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/header)
* [`<hgroup>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/hgroup)
* [`<hr>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/hr)
* [`<html>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/html)
* [`<i>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/i)
* [`<iframe>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/iframe)
* [`<img>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/img)
* [`<input>`](/reference/react-dom/components/input)
* [`<ins>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/ins)
* [`<kbd>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/kbd)
* [`<label>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/label)
* [`<legend>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/legend)
* [`<li>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/li)
* [`<link>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/link)
* [`<main>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/main)
* [`<map>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/map)
* [`<mark>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/mark)
* [`<menu>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/menu)
* [`<meta>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/meta)
* [`<meter>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/meter)
* [`<nav>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/nav)
* [`<noscript>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/noscript)
* [`<object>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/object)
* [`<ol>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/ol)
* [`<optgroup>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/optgroup)
* [`<option>`](/reference/react-dom/components/option)
* [`<output>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/output)
* [`<p>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/p)
* [`<picture>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/picture)
* [`<pre>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/pre)
* [`<progress>`](/reference/react-dom/components/progress)
* [`<q>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/q)
* [`<rp>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/rp)
* [`<rt>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/rt)
* [`<ruby>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/ruby)
* [`<s>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/s)
* [`<samp>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/samp)
* [`<script>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/script)
* [`<section>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/section)
* [`<select>`](/reference/react-dom/components/select)
* [`<slot>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/slot)
* [`<small>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/small)
* [`<source>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/source)
* [`<span>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/span)
* [`<strong>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/strong)
* [`<style>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/style)
* [`<sub>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/sub)
* [`<summary>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/summary)
* [`<sup>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/sup)
* [`<table>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/table)
* [`<tbody>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/tbody)
* [`<td>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/td)
* [`<template>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/template)
* [`<textarea>`](/reference/react-dom/components/textarea)
* [`<tfoot>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/tfoot)
* [`<th>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/th)
* [`<thead>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/thead)
* [`<time>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/time)
* [`<title>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/title)
* [`<tr>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/tr)
* [`<track>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/track)
* [`<u>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/u)
* [`<ul>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/ul)
* [`<var>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/var)
* [`<video>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/video)
* [`<wbr>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/wbr)

<Note>

与 [DOM 标准](https://developer.mozilla.org/zh-CN/docs/Web/API/Document_Object_Model) 类似，React 使用 `camelCase` 命名约定来命名 props。例如，你应该使用 `tabIndex` 而不是 `tabindex`。你可以使用 [在线转换器](https://transform.tools/html-to-jsx) 将现有的 HTML 转换为 JSX。

</Note>

---

### 自定义 HTML 元素 {/*custom-html-elements*/}

如果你渲染一个带有连字符的标签，如 `<my-element>`，React 会认为你想要渲染一个 [自定义 HTML 元素](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components/Using_custom_elements)。

如果你使用 [`is`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes/is) 属性渲染一个内置的浏览器 HTML 元素，它也会被视为自定义元素。

#### 在自定义元素上设置值 {/*attributes-vs-properties*/}

自定义元素有两种数据传递方法：

1) Attributes：显示在标记中，只能设置为字符串值 
2) Properties：不在标记中显示，可设置为任意 JavaScript 值

默认情况下，React 会将 JSX 中绑定的值作为 attributes 传递：

```jsx
<my-element value="Hello, world!"></my-element>
```

默认情况下，传递给自定义元素的非字符串 JavaScript 值将被序列化：

```jsx
// 将以 `[1,2,3].toString()` 的输出结果 `"1,2,3"` 的形式传递
<my-element value={[1,2,3]}></my-element>
```

不过，如果自定义元素的属性名称在构建过程中出现在类上，React 就会将其识别为可以传递任意值的 arbitrary：

<Sandpack>

```js src/index.js hidden
import {MyElement} from './MyElement.js';
import { createRoot } from 'react-dom/client';
import {App} from "./App.js";

customElements.define('my-element', MyElement);

const root = createRoot(document.getElementById('root'))
root.render(<App />);
```

```js src/MyElement.js active
export class MyElement extends HTMLElement {
  constructor() {
    super();
    // 初始化为元素时
    // 此处的值将被 React 覆盖
    this.value = undefined;
  }

  connectedCallback() {
    this.innerHTML = this.value.join(", ");
  }
}
```

```js src/App.js
export function App() {
  return <my-element value={[1,2,3]}></my-element>
}
```

</Sandpack>

#### 监听自定义元素上的事件 {/*custom-element-events*/}

使用自定义元素时的一个常见模式是，它们可能会派发 [`自定义事件`](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent)，而不是在事件发生时接受函数调用。在通过 JSX 绑定事件时，可以使用 `on` 前缀来监听这些事件。

<Sandpack>

```js src/index.js hidden
import {MyElement} from './MyElement.js';
import { createRoot } from 'react-dom/client';
import {App} from "./App.js";

customElements.define('my-element', MyElement);

const root = createRoot(document.getElementById('root'))
root.render(<App />);
```

```javascript src/MyElement.js
export class MyElement extends HTMLElement {
  constructor() {
    super();
    this.test = undefined;
    this.emitEvent = this._emitEvent.bind(this);
  }

  _emitEvent() {
    const event = new CustomEvent('speak', {
      detail: {
        message: 'Hello, world!',
      },
    });
    this.dispatchEvent(event);
  }

  connectedCallback() {
    this.el = document.createElement('button');
    this.el.innerText = 'Say hi';
    this.el.addEventListener('click', this.emitEvent);
    this.appendChild(this.el);
  }

  disconnectedCallback() {
    this.el.removeEventListener('click', this.emitEvent);
  }
}
```

```jsx src/App.js active
export function App() {
  return (
    <my-element
      onspeak={e => console.log(e.detail.message)}
    ></my-element>
  )
}
```

</Sandpack>

<Note>

事件区分大小写，并支持破折号（`-`）。在监听自定义元素事件时，请保留事件的大小写并包含所有破折号：

```jsx
// 监听 `say-hi` 事件
<my-element onsay-hi={console.log}></my-element>
// 监听 `sayHi` 事件
<my-element onsayHi={console.log}></my-element>
```

</Note>
---

## 所有 SVG 组件 {/*all-svg-components*/}

React 支持所有浏览器内置的 SVG 组件，包括：

* [`<a>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/a)
* [`<animate>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/animate)
* [`<animateMotion>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/animateMotion)
* [`<animateTransform>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/animateTransform)
* [`<circle>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/circle)
* [`<clipPath>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/clipPath)
* [`<defs>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/defs)
* [`<desc>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/desc)
* [`<discard>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/discard)
* [`<ellipse>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/ellipse)
* [`<feBlend>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/feBlend)
* [`<feColorMatrix>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/feColorMatrix)
* [`<feComponentTransfer>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/feComponentTransfer)
* [`<feComposite>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/feComposite)
* [`<feConvolveMatrix>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/feConvolveMatrix)
* [`<feDiffuseLighting>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/feDiffuseLighting)
* [`<feDisplacementMap>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/feDisplacementMap)
* [`<feDistantLight>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/feDistantLight)
* [`<feDropShadow>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/feDropShadow)
* [`<feFlood>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/feFlood)
* [`<feFuncA>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/feFuncA)
* [`<feFuncB>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/feFuncB)
* [`<feFuncG>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/feFuncG)
* [`<feFuncR>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/feFuncR)
* [`<feGaussianBlur>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/feGaussianBlur)
* [`<feImage>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/feImage)
* [`<feMerge>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/feMerge)
* [`<feMergeNode>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/feMergeNode)
* [`<feMorphology>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/feMorphology)
* [`<feOffset>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/feOffset)
* [`<fePointLight>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/fePointLight)
* [`<feSpecularLighting>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/feSpecularLighting)
* [`<feSpotLight>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/feSpotLight)
* [`<feTile>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/feTile)
* [`<feTurbulence>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/feTurbulence)
* [`<filter>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/filter)
* [`<foreignObject>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/foreignObject)
* [`<g>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/g)
* `<hatch>`
* `<hatchpath>`
* [`<image>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/image)
* [`<line>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/line)
* [`<linearGradient>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/linearGradient)
* [`<marker>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/marker)
* [`<mask>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/mask)
* [`<metadata>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/metadata)
* [`<mpath>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/mpath)
* [`<path>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/path)
* [`<pattern>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/pattern)
* [`<polygon>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/polygon)
* [`<polyline>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/polyline)
* [`<radialGradient>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/radialGradient)
* [`<rect>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/rect)
* [`<script>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/script)
* [`<set>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/set)
* [`<stop>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/stop)
* [`<style>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/style)
* [`<svg>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/svg)
* [`<switch>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/switch)
* [`<symbol>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/symbol)
* [`<text>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/text)
* [`<textPath>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/textPath)
* [`<title>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/title)
* [`<tspan>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/tspan)
* [`<use>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/use)
* [`<view>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/view)

<Note>

与 [DOM 标准](https://developer.mozilla.org/zh-CN/docs/Web/API/Document_Object_Model) 类似，React 使用 `camelCase` 命名约定来命名 props。例如，你应该使用 `tabIndex` 而不是 `tabindex`。你可以使用 [在线转换器](https://transform.tools/html-to-jsx) 将现有的 SVG 转换为 JSX。

命名空间属性（attribute）也必须写成没有冒号的形式：

* `xlink:actuate` 改为 `xlinkActuate`。
* `xlink:arcrole` 改为 `xlinkArcrole`。
* `xlink:href` 改为 `xlinkHref`。
* `xlink:role` 改为 `xlinkRole`。
* `xlink:show` 改为 `xlinkShow`。
* `xlink:title` 改为 `xlinkTitle`。
* `xlink:type` 改为 `xlinkType`。
* `xml:base` 改为 `xmlBase`。
* `xml:lang` 改为 `xmlLang`。
* `xml:space` 改为 `xmlSpace`。
* `xmlns:xlink` 改为 `xmlnsXlink`。

</Note>
