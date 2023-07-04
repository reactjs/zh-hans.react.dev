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

如果你渲染一个带有连字符的标签，如 `<my-element>`，React 会认为你想要渲染一个 [自定义 HTML 元素](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components/Using_custom_elements)。在 React 中，渲染自定义元素与渲染内置的浏览器标签有所不同：

- 所有自定义元素的 props 都将被序列化为字符串，并且总是使用属性（attribute）进行设置。
- 自定义元素接受 `class` 而不是 `className`，接受 `for` 而不是 `htmlFor`。

如果你使用 [`is`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes/is) 属性渲染一个内置的浏览器 HTML 元素，它也会被视为自定义元素。

<Note>

[未来的 React 版本将提供更全面的自定义元素支持](https://github.com/facebook/react/issues/11347#issuecomment-1122275286)。

你可以通过将 React 包升级到最新的实验性版本来尝试：

- `react@experimental`
- `react-dom@experimental`

实验性版本的 React 可能包含一些错误，因此不要在生产环境中使用。

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
