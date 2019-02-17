---
id: events
title: SyntheticEvent
permalink: docs/events.html
layout: docs
category: Reference
---
此参考指南记录了构成 React 事件系统一部分的 `SyntheticEvent` 包装器。参考 [Handling Events](/docs/handling-events.html) 指南学习更多。

## 概述 {#overview}

`SyntheticEvent` 实例将被传递给你的事件处理程序，这是一个浏览器原生事件的跨浏览器包装器。除了在所有浏览器间完全相同的事件，它有着和浏览器原生事件相同的接口，包括 `stopPropagation()` 和 `preventDefault()` 。

如果因为某些原因，你需要使用浏览器的底层事件，只需要使用 `nativeEvent` 属性实现。每个 `SyntheticEvent` 对象有以下属性：

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
DOMEventTarget target
number timeStamp
string type
```

> 注意：
>
> 截止 v0.14 ，事件处理程序返回 `false` 不再阻止事件传播。相反，`e.stopPropagation()` 或者 `e.preventDefault()` 应适当的手动触发。

### 事件池 {#event-pooling}

 `SyntheticEvent` 是被合并的。这意味着 `SyntheticEvent` 对象会被重用，而且在事件回调函数被调用后，所有的属性都会无效。这是为性能考虑。因此，你不能以异步方式访问事件。

```javascript
function onClick(event) {
  console.log(event); // => nullified object.
  console.log(event.type); // => "click"
  const eventType = event.type; // => "click"

  setTimeout(function() {
    console.log(event.type); // => null
    console.log(eventType); // => "click"
  }, 0);

  // 不起作用，this.state.clickEvent 的值将会只包含 null
  this.setState({clickEvent: event});

  // 你仍然可以导出事件属性
  this.setState({eventType: event.type});
}
```

> 注意：
>
> 如果你想以异步方式访问事件属性，你应当在事件上调用 `event.persist()` ，这个方法会从池中移除合成事件，允许用户代码保留对事件的引用。

## 支持的事件 {#supported-events}

React 使事件正常化，所以他们在不同浏览器中有一致的属性。

以下的事件处理函数在冒泡阶段被事件触发。要在注册捕获阶段的事件处理函数，需要为事件名称添加 `Capture` 。例如，不是使用 `onClick` ，而是使用 `onClickCapture` 处理捕获阶段的点击事件。

- [Clipboard Events](#clipboard-events)
- [Composition Events](#composition-events)
- [Keyboard Events](#keyboard-events)
- [Focus Events](#focus-events)
- [Form Events](#form-events)
- [Mouse Events](#mouse-events)
- [Pointer Events](#pointer-events)
- [Selection Events](#selection-events)
- [Touch Events](#touch-events)
- [UI Events](#ui-events)
- [Wheel Events](#wheel-events)
- [Media Events](#media-events)
- [Image Events](#image-events)
- [Animation Events](#animation-events)
- [Transition Events](#transition-events)
- [Other Events](#other-events)

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

```javascript
DOMEventTarget relatedTarget
```

* * *

### 表单事件 {#form-events}

事件名：

```
onChange onInput onInvalid onSubmit
```
想了解 onChange 事件的更多信息，查看 [Forms](/docs/forms.html) 。

* * *

### Mouse Events {#mouse-events}

鼠标事件：

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

并非每个浏览器都支持指针事件（在写这篇文章时，支持的浏览器有：Chrome，Firefox，Edge，和 Internet Explorer）。React 有意没有通过 polyfill 支持其他浏览器，因为符合标准的 polyfill 会显著增加 react-dom 的包大小。

如果你的应用要求指针事件，我们推荐添加第三方的指针事件 polyfil 。

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
