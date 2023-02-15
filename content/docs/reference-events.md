---
id: events
title: 合成事件
permalink: docs/events.html
layout: docs
category: Reference
---

> Try the new React documentation.
> 
> These new documentation pages teach modern React and include live examples:
>
> - [Common components (e.g. `<div>`)](https://beta.reactjs.org/reference/react-dom/components/common)
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

此参考指南记录了构成 React 事件系统一部分的 `SyntheticEvent` 包装器。请参考有关[事件处理](/docs/handling-events.html)的指南来了解更多。

## 概览 {#overview}

`SyntheticEvent` 实例将被传递给你的事件处理函数，它是浏览器的原生事件的跨浏览器包装器。除兼容所有浏览器外，它还拥有和浏览器原生事件相同的接口，包括 `stopPropagation()` 和 `preventDefault()`。

如果因为某些原因，当你需要使用浏览器的底层事件时，只需要使用 `nativeEvent` 属性来获取即可。合成事件与浏览器的原生事件不同，也不会直接映射到原生事件。例如，在 `onMouseLeave` 事件中 `event.nativeEvent` 将指向 `mouseout` 事件。每个 `SyntheticEvent` 对象都包含以下属性：

```javascript
boolean bubbles
boolean cancelable
DOMEventTarget currentTarget
boolean defaultPrevented
number eventPhase
boolean isTrusted
DOMEvent nativeEvent
void preventDefault()
boolean isDefaultPrevented()
void stopPropagation()
boolean isPropagationStopped()
void persist()
DOMEventTarget target
number timeStamp
string type
```

> 注意：
>
> 从 v17 开始，`e.persist()` 将不再生效，因为 `SyntheticEvent` 不再放入[事件池](/docs/legacy-event-pooling.html)中。

> 注意：
>
> 从 v0.14 开始，事件处理器返回 `false` 时，不再阻止事件传递。你可以酌情手动调用 `e.stopPropagation()` 或 `e.preventDefault()` 作为替代方案。

## 支持的事件 {#supported-events}

React 通过将事件 normalize 以让他们在不同浏览器中拥有一致的属性。

以下的事件处理函数在冒泡阶段被触发。如需注册捕获阶段的事件处理函数，则应为事件名添加 `Capture`。例如，处理捕获阶段的点击事件请使用 `onClickCapture`，而不是 `onClick`。

- [概览 {#overview}](#概览-overview)
- [支持的事件 {#supported-events}](#支持的事件-supported-events)
- [参考 {#reference}](#参考-reference)
  - [剪贴板事件 {#clipboard-events}](#剪贴板事件-clipboard-events)
  - [复合事件 {#composition-events}](#复合事件-composition-events)
  - [键盘事件 {#keyboard-events}](#键盘事件-keyboard-events)
  - [焦点事件 {#focus-events}](#焦点事件-focus-events)
    - [onFocus {#onfocus}](#onfocus-onfocus)
    - [onBlur {#onblur}](#onblur-onblur)
    - [监听焦点的进入与离开 {#detecting-focus-entering-and-leaving}](#监听焦点的进入与离开-detecting-focus-entering-and-leaving)
  - [表单事件 {#form-events}](#表单事件-form-events)
  - [通用事件 {#generic-events}](#通用事件-generic-events)
  - [鼠标事件 {#mouse-events}](#鼠标事件-mouse-events)
  - [指针事件 {#pointer-events}](#指针事件-pointer-events)
  - [选择事件 {#selection-events}](#选择事件-selection-events)
  - [触摸事件 {#touch-events}](#触摸事件-touch-events)
  - [UI 事件 {#ui-events}](#ui-事件-ui-events)
  - [滚轮事件 {#wheel-events}](#滚轮事件-wheel-events)
  - [媒体事件 {#media-events}](#媒体事件-media-events)
  - [图像事件 {#image-events}](#图像事件-image-events)
  - [动画事件 {#animation-events}](#动画事件-animation-events)
  - [过渡事件 {#transition-events}](#过渡事件-transition-events)
  - [其他事件 {#other-events}](#其他事件-other-events)

* * *

## 参考 {#reference}

### 剪贴板事件 {#clipboard-events}

事件名：

```
onCopy onCut onPaste
```

属性：

```javascript
DOMDataTransfer clipboardData
```

* * *

### 复合事件 {#composition-events}

事件名:

```
onCompositionEnd onCompositionStart onCompositionUpdate
```

属性:

```javascript
string data

```

* * *

### 键盘事件 {#keyboard-events}

事件名:

```
onKeyDown onKeyPress onKeyUp
```

属性:

```javascript
boolean altKey
number charCode
boolean ctrlKey
boolean getModifierState(key)
string key
number keyCode
string locale
number location
boolean metaKey
boolean repeat
boolean shiftKey
number which
```

`key` 属性可以是 [DOM Level 3 Events spec](https://www.w3.org/TR/uievents-key/#named-key-attribute-values) 里记录的任意值。

* * *

### 焦点事件 {#focus-events}

事件名：

```
onFocus onBlur
```

这些焦点事件在 React DOM 上的所有元素都有效，不只是表单元素。

属性：

```js
DOMEventTarget relatedTarget
```

#### onFocus {#onfocus}

`onFocus` 事件在元素（或其内部某些元素）聚焦时被调用。例如，当用户点击文本输入框时，就会调用该事件。

```javascript
function Example() {
  return (
    <input
      onFocus={(e) => {
        console.log('Focused on input');
      }}
      placeholder="onFocus is triggered when you click this input."
    />
  )
}
```

#### onBlur {#onblur}

`onBlur` 事件处理程序在元素（或元素内某些元素）失去焦点时被调用。例如，当用户在已聚焦的文本输入框外点击时，就会被调用。

```javascript
function Example() {
  return (
    <input
      onBlur={(e) => {
        console.log('Triggered because this input lost focus');
      }}
      placeholder="onBlur is triggered when you click this input and then you click outside of it."
    />
  )
}
```

#### 监听焦点的进入与离开 {#detecting-focus-entering-and-leaving}

你可以使用 `currentTarget` 和 `relatedTarget` 来区分聚焦和失去焦点是否来自父元素_外部_。这里有个 DEMO，你可以复制并在本地运行，它展示了如何监听一个子元素的聚焦，元素本身的聚焦，以及整个子树进入焦点或离开焦点。

```javascript
function Example() {
  return (
    <div
      tabIndex={1}
      onFocus={(e) => {
        if (e.currentTarget === e.target) {
          console.log('focused self');
        } else {
          console.log('focused child', e.target);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Not triggered when swapping focus between children
          console.log('focus entered self');
        }
      }}
      onBlur={(e) => {
        if (e.currentTarget === e.target) {
          console.log('unfocused self');
        } else {
          console.log('unfocused child', e.target);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Not triggered when swapping focus between children
          console.log('focus left self');
        }
      }}
    >
      <input id="1" />
      <input id="2" />
    </div>
  );
}
```

* * *

### 表单事件 {#form-events}

事件名：

```
onChange onInput onInvalid onReset onSubmit 
```

想了解 onChange 事件的更多信息，查看 [Forms](/docs/forms.html) 。

* * *

### 通用事件 {#generic-events}

事件名：

```
onError onLoad
```

* * *

### 鼠标事件 {#mouse-events}

事件名：

```
onClick onContextMenu onDoubleClick onDrag onDragEnd onDragEnter onDragExit
onDragLeave onDragOver onDragStart onDrop onMouseDown onMouseEnter onMouseLeave
onMouseMove onMouseOut onMouseOver onMouseUp
```

`onMouseEnter` 和 `onMouseLeave` 事件从离开的元素向进入的元素传播，不是正常的冒泡，也没有捕获阶段。

属性：

```javascript
boolean altKey
number button
number buttons
number clientX
number clientY
boolean ctrlKey
boolean getModifierState(key)
boolean metaKey
number pageX
number pageY
DOMEventTarget relatedTarget
number screenX
number screenY
boolean shiftKey
```

* * *

### 指针事件 {#pointer-events}

事件名:

```
onPointerDown onPointerMove onPointerUp onPointerCancel onGotPointerCapture
onLostPointerCapture onPointerEnter onPointerLeave onPointerOver onPointerOut
```

`onPointerEnter` 和 `onPointerLeave` 事件从离开的元素向进入的元素传播，不是正常的冒泡，也没有捕获阶段。

属性：

如 [W3 spec](https://www.w3.org/TR/pointerevents/) 中定义的，指针事件通过以下属性扩展了[鼠标事件](#mouse-events)：

```javascript
number pointerId
number width
number height
number pressure
number tangentialPressure
number tiltX
number tiltY
number twist
string pointerType
boolean isPrimary
```

关于跨浏览器支持的说明：

并非每个浏览器都支持指针事件（在写这篇文章时，已支持的浏览器有：Chrome，Firefox，Edge 和 Internet Explorer）。React 故意不通过 polyfill 的方式适配其他浏览器，主要是符合标准的 polyfill 会显著增加 react-dom 的 bundle 大小。

如果你的应用要求指针事件，我们推荐添加第三方的指针事件 polyfill。

* * *

### 选择事件 {#selection-events}

事件名：

```
onSelect
```

* * *

### 触摸事件 {#touch-events}

事件名：

```
onTouchCancel onTouchEnd onTouchMove onTouchStart
```

属性：

```javascript
boolean altKey
DOMTouchList changedTouches
boolean ctrlKey
boolean getModifierState(key)
boolean metaKey
boolean shiftKey
DOMTouchList targetTouches
DOMTouchList touches
```

* * *

### UI 事件 {#ui-events}

事件名：

```
onScroll
```

>注意
>
>从 React 17 开始，`onScroll` 事件在 React 中**不再冒泡**。这与浏览器的行为一致，并且避免了当一个嵌套且可滚动的元素在其父元素触发事件时造成混乱。

属性：

```javascript
number detail
DOMAbstractView view
```

* * *

### 滚轮事件 {#wheel-events}

事件名：

```
onWheel
```

属性：

```javascript
number deltaMode
number deltaX
number deltaY
number deltaZ
```

* * *

### 媒体事件 {#media-events}

事件名：

```
onAbort onCanPlay onCanPlayThrough onDurationChange onEmptied onEncrypted
onEnded onError onLoadedData onLoadedMetadata onLoadStart onPause onPlay
onPlaying onProgress onRateChange onSeeked onSeeking onStalled onSuspend
onTimeUpdate onVolumeChange onWaiting
```

* * *

### 图像事件 {#image-events}

事件名：

```
onLoad onError
```

* * *

### 动画事件 {#animation-events}

事件名：

```
onAnimationStart onAnimationEnd onAnimationIteration
```

属性：

```javascript
string animationName
string pseudoElement
float elapsedTime
```

* * *

### 过渡事件 {#transition-events}

事件名：

```
onTransitionEnd
```

属性：

```javascript
string propertyName
string pseudoElement
float elapsedTime
```

* * *

### 其他事件 {#other-events}

事件名：

```
onToggle
```
