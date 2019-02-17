---
id: dom-elements
title: DOM 元素
layout: docs
category: Reference
permalink: docs/dom-elements.html
redirect_from:
  - "docs/tags-and-attributes.html"
  - "docs/dom-differences.html"
  - "docs/special-non-dom-attributes.html"
  - "docs/class-name-manipulation.html"
  - "tips/inline-styles.html"
  - "tips/style-props-value-px.html"
  - "tips/dangerously-set-inner-html.html"
---

React 实现了一套独立于浏览器的 DOM 系统，兼顾了性能和跨浏览器的兼容性。我们借此机会完善了浏览器 DOM 实现的一些边缘情况。

在 React 中，所有的 DOM 特性和属性（包括事件处理）都应该是驼峰拼写法命名。例如，与 HTML 中的 `tabindex` 属性对应的 React 的属性是 `tabIndex` 。例外的情况是 `aria-*` 和 `data-*` 属性，一律使用小写字母命名。比如, 你依然可以用 `aria-label` 作为 `aria-label`。

## 属性的不同 {#differences-in-attributes}
在 React 和 HTML 之间有很多属性的作用是不同的。

### checked {#checked}
`checked` 属性是由 type 为 `checkbox` 或 `radio` 的 `<input>` 组件所支持的。你可以用它来设定组件是否被选中。这对于构建控制组件很有用。与之相对的 `defaultChecked` 是非控制组件的属性，用来设定组件首次装载时是否被选中。

### className {#classname}
用 `className` 属性来指定一个 CSS class，这个特性适用于所有的常规 DOM 节点和 SVG 元素，比如 `<div>`，`<a>` 和其它的标签。

如果你在 React 中使用 Web 组件（这是一种不常见的使用方式），请使用 class 属性来代替。

### dangerouslySetInnerHTML {#dangerouslysetinnerhtml}
`dangerouslySetInnerHTML` 是 React 提供给浏览器 DOM 中 `innerHTML` 方法的一种替换方案。通常来讲，使用代码直接设置 HTML 文档内容是存在风险的，因为这样很容易把你的用户信息暴露，且不经意间就会受到[跨站脚本(XSS)](https://en.wikipedia.org/wiki/Cross-site_scripting)攻击。所以，虽然可以直接在 React 中设置 HTML 的内容，但是你要使用 `dangerouslySetInnerHTML` 并且向其传递一个含有 `__html` 为 key 的对象，以此来提醒你这样做是很危险。例如：

```js
function createMarkup() {
  return {__html: 'First &middot; Second'};
}

function MyComponent() {
  return <div dangerouslySetInnerHTML={createMarkup()} />;
}
```

### htmlFor {#htmlfor}
因为 `for` 在 Javascript 中是一个关键字，所以 React 元素使用 `htmlFor` 代替。

### onChange {#onchange}
`onChange` 事件的行为就如你所想的：无论一个表单内容何时发生变化，这个事件都会被触发。我们故意不使用浏览器已有的默认行为，就是因为 `onChange` 在浏览器中的行为和名称不相称，而 React 是依靠这个事件实时处理用户输入。

### selected {#selected}
`selected` 属性被 `<option>` 组件所支持。你可以使用该属性设置组件是否被选择。这对构建控制组件很有用。

### style {#style}
>注
>
>在文档中，为了方便，一些例子直接使用了 `style` ，但是**一般不推荐使用 `style` 属性作为样式化元素的主要方式**。在多数情况下，[`className`](#classname) 应用于指向对应的外部 CSS 样式文档定义的 class 。`style` 在 React 应用中更多的用于在渲染过程中添加动态计算的样式。另请参阅：[问与答: Styling 和 CSS](/docs/faq-styling.html)。

`style` 属性接受一个 JavaScript 对象，其对象接受用驼峰拼写法命名的字符串，而不是 CSS 字符串。这和 DOM 中 `style` JavaScript 属性是一致的，同时也是更高效的，而且能够防止跨站脚本(XSS)的安全漏洞。例如：

```js
const divStyle = {
  color: 'blue',
  backgroundImage: 'url(' + imgUrl + ')',
};

function HelloWorldComponent() {
  return <div style={divStyle}>Hello World!</div>;
}
```

注意样式不会自动补齐前缀。为了支持旧的浏览器，你需要手动补充相对应的样式属性：


```js
const divStyle = {
  WebkitTransition: 'all', // note the capital 'W' here
  msTransition: 'all' // 'ms' is the only lowercase vendor prefix
};

function ComponentWithTransition() {
  return <div style={divStyle}>This should work cross-browser</div>;
}
```

样式中关键字使用驼峰拼写法命名是为了与从 JS 中访问 DOM 节点的属性保持一致性（例如 `node.style.backgroundImage` ）。浏览器引擎前缀 [除了 `ms` ](http://www.andismith.com/blog/2012/02/modernizr-prefixed/) 都应该以大写字母开头。这就是为什么 `WebkitTransition` 有一个大写字母 ”W”。

React 将自动添加一个 ”px” 后缀到某些特定数字的内联样式属性。如果你希望使用不同于 ”px” 的其他单位，那么设置值则是该数字与你想要设置的单位组成一个字符串。例如：

```js
// Result style: '10px'
<div style={{ height: 10 }}>
  Hello World!
</div>

// Result style: '10%'
<div style={{ height: '10%' }}>
  Hello World!
</div>
```
尽管不是所有样式属性都会被转化为像素字符串，但某些个样式属性是会保持无单位(例如 `zoom` , `order`, `flex`)。完整的无单位的属性列表在[这里](https://github.com/facebook/react/blob/4131af3e4bf52f3a003537ec95a1655147c81270/src/renderers/dom/shared/CSSProperty.js#L15-L59)。

### suppressContentEditableWarning {#suppresscontenteditablewarning}
一般来说，当一个拥有子节点的元素被标记为 `contentEditable` 时，React 会发出一个警告，因为这是无效的。这个属性会触发这样的警告信息。不要使用这个属性，除非你要构建一个类似 [Draft.js](https://facebook.github.io/draft-js/) 这样需要手动管理 `contentEditable` 属性的库。

### suppressHydrationWarning {#suppresshydrationwarning}

如果你使用服务端 React 渲染，通常来说，当服务端和客户端渲染不同的内容时，就会给出一个警告信息。但是，在一些极少数的情况下，很难甚至于不可能保证内容绝对的一致。例如，在服务端和客户端上，时间戳通常是不一样的。 

如果设置 `suppressHydrationWarning` 为 `true`，React 将不会警告你属性和元素的内容不一致。它只对元素一层深度起作用，并且意指在特殊情况下才使用的。不要过度使用它。你可以在 [`ReactDOM.hydrate()` 文档](/docs/react-dom.html#hydrate) 里读到更多关于 hydration 的信息。

### value {#value}

`value` 属性是受到 `<input>` 和 `<textarea>` 组件所支持的。你可以使用它设置组件的值。这对于构建控制组件是非常有用的。`defaultValue` 属性对应的是非控制组件属性，用来设置组件第一次装载时的值。

## All Supported HTML Attributes {#all-supported-html-attributes}

对于 React 16, 任何标准的[或自定义的](/blog/2017/09/08/dom-attributes-in-react-16.html) DOM 属性都是被充分支持的。

React 已经提供给 DOM 一套以 JavaScript 为中心的 API 。因为 React 组件经常采用自定义或和 DOM 相关的 props 。React 使用`驼峰拼写法`为惯例，就像 DOM APIs 一样：

```js
<div tabIndex="-1" />      // Just like node.tabIndex DOM API
<div className="Button" /> // Just like node.className DOM API
<input readOnly={true} />  // Just like node.readOnly DOM API
```

除了上述文档提到的特殊拼写方式以外，这些 props 的用法与相对应的 HTML 属性是类似的。

被 React 所支持的一些 DOM 属性包括：

```
accept acceptCharset accessKey action allowFullScreen alt async autoComplete
autoFocus autoPlay capture cellPadding cellSpacing challenge charSet checked
cite classID className colSpan cols content contentEditable contextMenu controls
controlsList coords crossOrigin data dateTime default defer dir disabled
download draggable encType form formAction formEncType formMethod formNoValidate
formTarget frameBorder headers height hidden high href hrefLang htmlFor
httpEquiv icon id inputMode integrity is keyParams keyType kind label lang list
loop low manifest marginHeight marginWidth max maxLength media mediaGroup method
min minLength multiple muted name noValidate nonce open optimum pattern
placeholder poster preload profile radioGroup readOnly rel required reversed
role rowSpan rows sandbox scope scoped scrolling seamless selected shape size
sizes span spellCheck src srcDoc srcLang srcSet start step style summary
tabIndex target title type useMap value width wmode wrap
```

同样, 所有的 SVG 属性也全部被支持:

```
accentHeight accumulate additive alignmentBaseline allowReorder alphabetic
amplitude arabicForm ascent attributeName attributeType autoReverse azimuth
baseFrequency baseProfile baselineShift bbox begin bias by calcMode capHeight
clip clipPath clipPathUnits clipRule colorInterpolation
colorInterpolationFilters colorProfile colorRendering contentScriptType
contentStyleType cursor cx cy d decelerate descent diffuseConstant direction
display divisor dominantBaseline dur dx dy edgeMode elevation enableBackground
end exponent externalResourcesRequired fill fillOpacity fillRule filter
filterRes filterUnits floodColor floodOpacity focusable fontFamily fontSize
fontSizeAdjust fontStretch fontStyle fontVariant fontWeight format from fx fy
g1 g2 glyphName glyphOrientationHorizontal glyphOrientationVertical glyphRef
gradientTransform gradientUnits hanging horizAdvX horizOriginX ideographic
imageRendering in in2 intercept k k1 k2 k3 k4 kernelMatrix kernelUnitLength
kerning keyPoints keySplines keyTimes lengthAdjust letterSpacing lightingColor
limitingConeAngle local markerEnd markerHeight markerMid markerStart
markerUnits markerWidth mask maskContentUnits maskUnits mathematical mode
numOctaves offset opacity operator order orient orientation origin overflow
overlinePosition overlineThickness paintOrder panose1 pathLength
patternContentUnits patternTransform patternUnits pointerEvents points
pointsAtX pointsAtY pointsAtZ preserveAlpha preserveAspectRatio primitiveUnits
r radius refX refY renderingIntent repeatCount repeatDur requiredExtensions
requiredFeatures restart result rotate rx ry scale seed shapeRendering slope
spacing specularConstant specularExponent speed spreadMethod startOffset
stdDeviation stemh stemv stitchTiles stopColor stopOpacity
strikethroughPosition strikethroughThickness string stroke strokeDasharray
strokeDashoffset strokeLinecap strokeLinejoin strokeMiterlimit strokeOpacity
strokeWidth surfaceScale systemLanguage tableValues targetX targetY textAnchor
textDecoration textLength textRendering to transform u1 u2 underlinePosition
underlineThickness unicode unicodeBidi unicodeRange unitsPerEm vAlphabetic
vHanging vIdeographic vMathematical values vectorEffect version vertAdvY
vertOriginX vertOriginY viewBox viewTarget visibility widths wordSpacing
writingMode x x1 x2 xChannelSelector xHeight xlinkActuate xlinkArcrole
xlinkHref xlinkRole xlinkShow xlinkTitle xlinkType xmlns xmlnsXlink xmlBase
xmlLang xmlSpace y y1 y2 yChannelSelector z zoomAndPan
```

你也可以使用自定义属性，只要这些属性全都是小写的。
