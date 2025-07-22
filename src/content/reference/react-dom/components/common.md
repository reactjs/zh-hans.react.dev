---
title: "普通组件（例如 <div>）"
---

<Intro>

所有的内置浏览器组件，例如 [`<div>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/div)，都支持一些常见的属性和事件。

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### 通用组件（例如 `<div>`） {/*common*/}

```js
<div className="wrapper">一些内容</div>
```

[参见下方更多示例](#usage)。

#### 属性 {/*common-props*/}

这些特殊的 React 属性适用于所有内置组件：

* `children`：React 节点（可以是元素、字符串、数字、[portal](/reference/react-dom/createPortal)，如 `null`，`undefined` 这样的空节点和布尔值，或其他 React 节点数组）。`children` 属性指定了组件内部的内容。当使用 JSX 时，通常会通过嵌套标签 `<div><span /></div>` 隐式地指定 `children` 属性。

* `dangerouslySetInnerHTML`：一个形如 `{ __html: '<p>一些 HTML</p>' }` 的对象，其中包含原始的 HTML 字符串。此属性将会覆盖 DOM 节点的 [`innerHTML`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/innerHTML) 属性，并在内部显示传递的 HTML 内容。这个属性应该极度谨慎使用！如果内部的 HTML 不可信（例如它来源于用户数据），那么会有引入 [XSS](https://en.wikipedia.org/wiki/Cross-site_scripting) 漏洞的风险。[阅读更多关于使用 `dangerouslySetInnerHTML` 的内容](#dangerously-setting-the-inner-html)。

* `ref`：使用 [`useRef`](/reference/react/useRef) 或者 [`createRef`](/reference/react/createRef) 的 ref 对象，或者一个 [`ref` 回调函数](#ref-callback)，再或者一个用于 [传统 ref](https://reactjs.org/docs/refs-and-the-dom.html#legacy-api-string-refs) 的字符串。ref 将被填充为此节点的 DOM 元素。[阅读更多关于使用 ref 操纵 DOM 的内容](#manipulating-a-dom-node-with-a-ref)。

* `suppressContentEditableWarning`：布尔值。如果为 `true` 将会抑制 React 对同时具有 `child` 和 `contentEditable={true}` 属性的元素发出的警告（这两者通常不能同时使用）。如果你正在构建一个手动管理 `contentEditable` 内容的文本输入库，请使用此选项。

* `suppressHydrationWarning`：布尔值。如果你使用 [服务器渲染](/reference/react-dom/server)，通常会在服务器和客户端渲染不同内容时发出警告。在一些罕见的情况下（比如时间戳），很难或者不可能保证完全匹配。如果你设置 `suppressHydrationWarning` 为 `true`，React 不会在元素属性和内容不匹配时发出警告。它只能在同级工作，并被作为脱围机制。[阅读有关抑制激活错误的内容](/reference/react-dom/client/hydrateRoot#suppressing-unavoidable-hydration-mismatch-errors)。

* `style`：CSS 样式对象，如 `{ fontWeight：'bold'，margin：20 }`。与 DOM [`style`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/style) 属性类似，CSS 属性应该使用像 `camelCase` 这样的驼峰命名法，如应该使用 `fontWeight` 而不是 `font-weight`。你可以将字符串或数字作为值传递，类似 `width: 100`，React 会自动将值附加为 `px`（“像素”），除非它是一个 [无单位的属性](https://github.com/facebook/react/blob/81d4ee9ca5c405dce62f64e61506b8e155f38d8d/packages/react-dom-bindings/src/shared/CSSProperty.js#L8-L57)。我们建议仅在动态样式中使用 `style`，即事先不知道样式值。在其他情况下，使用普通的 CSS 类和 `className` 更有效。[了解有关 `className` 和 `style` 的更多信息](#applying-css-styles)。

所有内置组件也支持这些标准的 DOM 属性：

* [`accessKey`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes/accesskey)：一个字符串。为该元素指定一个键盘快捷键。[通常不建议使用](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes/accesskey#accessibility_concerns)。
* [`aria-*`](https://developer.mozilla.org/zh-CN/docs/Web/Accessibility/ARIA/Attributes)：ARIA 属性允许你为此元素指定辅助功能树信息。请参阅 [ARIA 属性](https://developer.mozilla.org/zh-CN/docs/Web/Accessibility/ARIA/Attributes) 以获取完整的参考。在 React 中，所有 ARIA 属性名称与 HTML 中完全相同。
* [`autoCapitalize`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes/autocapitalize)：一个字符串。指定用户输入的大小写形式。
* [`className`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/className)：一个字符串。指定元素的 CSS 类名。[阅读更多关于应用 CSS 样式的内容](#applying-css-styles)。
* [`contentEditable`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes/contenteditable)：一个布尔值。如果为 `true`，浏览器允许用户直接编辑渲染的元素。这被用于实现像 [Lexical](https://lexical.dev/) 这样的富文本输入库。如果你尝试将 React 子元素传递给具有 `contentEditable={true}` 属性的元素，则 React 会发出警告，因为在用户编辑后，React 将无法更新其内容。
* [`data-*`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes/data-*)：数据属性允许你将一些字符串数据附加到元素上，例如 `data-fruit="banana"`。由于通常会从 props 与 state 中读取数据，因此在 React 中不常用此属性。
* [`dir`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes/dir)：值为 `ltr` 与 `rtl` 之一，指定元素的文本方向。
* [`draggable`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes/draggable)：布尔值，指定元素是否可拖动。属于 [HTML Drag 与 Drop API](https://developer.mozilla.org/zh-CN/docs/Web/API/HTML_Drag_and_Drop_API) 的一部分。
* [`enterKeyHint`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/enterKeyHint)：字符串，指定虚拟键盘上的回车键应该呈现哪种操作。
* [`htmlFor`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLLabelElement/htmlFor)：字符串，用于 [`<label>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/label) 和 [`<output>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/output)，以 [标签与某些控件关联起来](/reference/react-dom/components/input#providing-a-label-for-an-input)。类似在 HTML [`for` 属性](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Attributes/for) React 使用标准的 DOM 属性名称（`htmlFor`），而不是 HTML 属性名称。
* [`hidden`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes/hidden)：布尔值或者字符串，指定元素是否应该被隐藏。
* [`id`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes/id)：字符串，指定该元素的唯一标识符，可用于以后查找或将其与其他元素连接。使用 [`useId`](/reference/react/useId) 生成它，以避免同一组件的多个实例之间发生冲突。
* [`is`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes/is)：字符串。如果指定，该组件将表现得像一个 [自定义元素](/reference/react-dom/components#custom-html-elements)。
* [`inputMode`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes/inputmode)：字符串，指定要显示的键盘类型（例如，文本、数字或电话）。
* [`itemProp`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes/itemprop)：字符串，指定元素代表的属性，供结构化数据爬取程序使用。
* [`lang`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes/lang)：字符串，指定元素的语言。
* [`onAnimationEnd`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/animationend_event)：一个 [`AnimationEvent` 事件处理函数](#animationevent-handler)。在 CSS 动画完成时触发。
* `onAnimationEndCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onAnimationEnd` 版本。
* [`onAnimationIteration`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/animationiteration_event)：一个 [`AnimationEvent` 事件处理函数](#animationevent-handler)。当 CSS 动画的一次迭代结束并开始另一个迭代时触发。
* `onAnimationIterationCapture`：在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onAnimationIteration` 版本。
* [`onAnimationStart`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/animationstart_event)：一个 [`AnimationEvent` 事件处理函数](#animationevent-handler)。当 CSS 动画开始时触发。
* `onAnimationStartCapture`：跟 `onAnimationStart` 一样，但是是在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发。
* [`onAuxClick`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/auxclick_event)：一个 [`AnimationEvent` 事件处理函数](#mouseevent-handler)。当非主要指针按钮被点击时触发。
* `onAuxClickCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onAuxClick` 版本。
* `onBeforeInput`：一个 [`InputEvent` 触发](#inputevent-handler)。在可编辑元素的值被修改之前触发。React 尚未使用原生的 [`beforeinput`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/beforeinput_event) 事件，而是尝试使用其他事件来模拟它。
* `onBeforeInputCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onBeforeInput` 版本。
* `onBlur`：一个 [`FocusEvent` 事件处理函数](#focusevent-handler)。当元素失去焦点时触发。与内置的浏览器 [`blur`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/blur_event) 不同，在 React 中，`onBlur` 事件会冒泡。
* `onBlurCapture`：在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onBlur` 版本。
* [`onClick`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/click_event)：一个 [`MouseEvent` 事件处理函数](#mouseevent-handler)。当指针设备上的主按钮被点击时触发。
* `onClickCapture`：在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onClick` 版本。
* [`onCompositionStart`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/compositionstart_event)：一个 [`CompositionEvent` 事件处理函数](#compositionevent-handler)。当 [输入法编辑器](https://developer.mozilla.org/zh-CN/docs/Glossary/Input_method_editor) 开始新的组合会话时触发。
* `onCompositionStartCapture`：在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onCompositionStart` 版本。
* [`onCompositionEnd`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/compositionend_event)：一个 [`CompositionEvent` 事件处理函数](#compositionevent-handler)。在 [输入法编辑器](https://developer.mozilla.org/zh-CN/docs/Glossary/Input_method_editor) 完成或者取消组合会话时触发。
* `onCompositionEndCapture`：在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onCompositionEnd` 版本。
* [`onCompositionUpdate`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/compositionupdate_event)：一个 [`CompositionEvent` 事件处理函数](#compositionevent-handler)。在输入法 [输入法编辑器](https://developer.mozilla.org/zh-CN/docs/Glossary/Input_method_editor) 收到一个新的字符时触发。
* `onCompositionUpdateCapture`：在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onCompositionUpdate` 版本。
* [`onContextMenu`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/contextmenu_event)：一个 [`MouseEvent` 事件处理函数](#mouseevent-handler)。当用户尝试打开上下文菜单时触发。
* `onContextMenuCapture`：在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onContextMenu` 版本。
* [`onCopy`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/copy_event)：一个 [`ClipboardEvent` 事件处理函数](#clipboardevent-handler)。当用户尝试将某些内容复制到剪贴板时触发。
* `onCopyCapture`：在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onCopy` 版本。
* [`onCut`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/cut_event)：一个 [`ClipboardEvent` 事件处理函数](#clipboardevent-handler)。当用户尝试将某些内容剪切到剪贴板时触发。
* `onCutCapture`：在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onCut` 版本。
* `onDoubleClick`：一个 [`MouseEvent` 事件处理函数](#mouseevent-handler)。在用户双击时触发。对应于浏览器 [`dblclick` 事件](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/dblclick_event)。
* `onDoubleClickCapture`：在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onDoubleClick` 版本。
* [`onDrag`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/drag_event)：一个 [`DragEvent` 事件处理函数](#dragevent-handler)。当用户拖拽某些元素时触发。
* `onDragCapture`：在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onDrag` 版本。
* [`onDragEnd`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/dragend_event)：一个 [`DragEvent` 事件处理函数](#dragevent-handler)。当用户停止拖拽元素时触发。
* `onDragEndCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onDragEnd` 版本。
* [`onDragEnter`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/dragenter_event)：一个 [`DragEvent` 事件处理函数](#dragevent-handler)。当拖动的元素进入有效的放置目标时触发。
* `onDragEnterCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onDragEnter` 版本。
* [`onDragOver`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/dragover_event)：一个 [`DragEvent` 事件处理函数](#dragevent-handler)。当拖动的元素进入有效的放置目标完成时触发。你需要声明 `e.preventDefault()` 去允许拖拽。
* `onDragOverCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onDragOver` 版本。
* [`onDragStart`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/dragstart_event)：一个 [`DragEvent` 事件处理函数](#dragevent-handler)。当用户开始拖拽元素时触发。
* `onDragStartCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events)时触发 `onDragStart` 版本。
* [`onDrop`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/drop_event)：一个 [`DragEvent` 事件处理函数](#dragevent-handler)。当元素被拖放到有效的目标区域时触发。
* `onDropCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onDrop` 版本。
* `onFocus`：一个 [`FocusEvent` 事件处理函数](#focusevent-handler)。当元素失去焦点时触发。与内置的浏览器 [`focus`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/focus_event) 时间不同，在 React 中，`onFocus` 事件会冒泡。
* `onFocusCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events)时触发的 `onFocus` 版本。
* [`onGotPointerCapture`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/gotpointercapture_event)：一个 [`PointerEvent` 事件处理函数](#pointerevent-handler)。当元素以编程方式捕获指针时触发。
* `onGotPointerCaptureCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onGotPointerCapture` 版本。
* [`onKeyDown`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/keydown_event)：一个 [`KeyboardEvent` 事件处理函数](#keyboardevent-handler)。当按键被按下时触发。
* `onKeyDownCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onKeyDown` 版本。
* [`onKeyPress`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/keypress_event)：一个 [`KeyboardEvent` 事件处理函数](#keyboardevent-handler)。此属性已废弃，请使用 `onKeyDown` 或 `onBeforeInput` 替代。
* `onKeyPressCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onKeyPress` 版本。
* [`onKeyUp`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/keyup_event)：一个 [`KeyboardEvent` 事件处理函数](#keyboardevent-handler)。当按键被释放时触发。
* `onKeyUpCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onKeyUp` 版本。
* [`onLostPointerCapture`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/lostpointercapture_event)：一个 [`PointerEvent` 事件处理函数](#pointerevent-handler)。当元素停止捕获指针时触发。
* `onLostPointerCaptureCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onLostPointerCapture` 版本。
* [`onMouseDown`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/mousedown_event)：一个 [`MouseEvent` 事件处理函数](#mouseevent-handler)。当指针按下时触发。
* `onMouseDownCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onMouseDown` 版本。
* [`onMouseEnter`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/mouseenter_event)：一个 [`MouseEvent` 事件处理函数](#mouseevent-handler)。当指针在元素内移动时触发。没有捕获阶段。相反，`onMouseLeave` 和 `onMouseEnter` 从被离开的元素传播到被进入的元素。
* [`onMouseLeave`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/mouseleave_event)：一个 [`MouseEvent` 事件处理函数](#mouseevent-handler)。当指针移动到元素外部时触发。没有捕获阶段。相反，`onMouseLeave` 和 `onMouseEnter` 从被离开的元素传播到进入的元素。
* [`onMouseMove`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/mousemove_event)：一个 [`MouseEvent` 事件处理函数](#mouseevent-handler)。当指针改变坐标时触发。
* `onMouseMoveCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onMouseMove` 版本。
* [`onMouseOut`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/mouseout_event)：一个 [`MouseEvent` 事件处理函数](#mouseevent-handler)。当指针移动到元素外部或移动到子元素时触发。
* `onMouseOutCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onMouseOut` 版本。
* [`onMouseUp`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/mouseup_event)：一个 [`MouseEvent` 事件处理函数](#mouseevent-handler)。当指针释放时触发。
* `onMouseUpCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onMouseUp` 版本。
* [`onPointerCancel`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/pointercancel_event)：一个 [`PointerEvent` 事件处理函数](#pointerevent-handler)。当浏览器取消指针交互时触发。
* `onPointerCancelCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onPointerCancel` 版本。
* [`onPointerDown`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/pointerdown_event)：一个 [`PointerEvent` 事件处理函数](#pointerevent-handler)。当指针变为活动状态时触发。
* `onPointerDownCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onPointerDown` 版本。
* [`onPointerEnter`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/pointerenter_event)：一个 [`PointerEvent` 事件处理函数](#pointerevent-handler)。当指针在元素内移动时触发。没有捕获阶段。相反，`onPointerLeave` 和 `onPointerEnter` 从被离开的元素传播到被进入的元素。
* [`onPointerLeave`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/pointerleave_event)：一个 [`PointerEvent` 事件处理函数](#pointerevent-handler)。当指针移动到元素外部时触发。没有捕获阶段。相反，`onPointerLeave` 和 `onPointerEnter` 从被离开的元素传播到被进入的元素。
* [`onPointerMove`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/pointermove_event)：一个 [`PointerEvent` 事件处理函数](#pointerevent-handler)。当指针改变坐标时触发。
* `onPointerMoveCapture`:一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onPointerMove` 版本。
* [`onPointerOut`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/pointerout_event)：一个 [`PointerEvent` 事件处理函数](#pointerevent-handler)。当指针移动到元素外部时触发，如果指针交互被取消以及 [其他一些原因](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/pointerout_event)。
* `onPointerOutCapture`:一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onPointerOut` 版本。
* [`onPointerUp`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/pointerup_event)：一个 [`PointerEvent` 事件处理函数](#pointerevent-handler)。当指针不再活动时触发。
* `onPointerUpCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onPointerUp` 版本。
* [`onPaste`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/paste_event)：一个 [`ClipboardEvent` 事件处理函数](#clipboardevent-handler)。当用户尝试从剪贴板粘贴内容时触发。
* `onPasteCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onPaste` 版本。
* [`onScroll`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/scroll_event)：一个 [`Event` 事件处理函数](#event-handler)。当元素被滚动时触发。此事件不会冒泡。
* `onScrollCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onScroll` 版本。
* [`onSelect`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLInputElement/select_event)：一个 [`Event` 事件处理函数](#event-handler)。在可编辑元素内部的选择更改后触发，例如输入框。React 扩展了 `onSelect` 事件以适用于 `contentEditable={true}` 元素。此外，React 还将其扩展为在空选择和编辑时触发（可能会影响选择）。
* `onSelectCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onSelect` 版本。
* [`onTouchCancel`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/touchcancel_event)：一个[`TouchEvent` 事件处理函数](#touchevent-handler)。当浏览器取消触摸交互时触发。
* `onTouchCancelCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onTouchCancel` 版本。
* [`onTouchEnd`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/touchend_event)：一个 [`TouchEvent` 事件处理函数](#touchevent-handler)。当一个或多个触摸点被移除时触发。
* `onTouchEndCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onTouchEnd` 版本。
* [`onTouchMove`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/touchmove_event)：一个 [`TouchEvent` 事件处理函数](#touchevent-handler)。当一个或多个触点移动时，会触发火灾。
* `onTouchMoveCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onTouchMove` 版本。
* [`onTouchStart`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/touchstart_event)：一个 [`TouchEvent` 事件处理函数](#touchevent-handler)。当一个或多个触摸点被放置时触发。
* `onTouchStartCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onTouchStart` 版本。
* [`onTransitionEnd`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/transitionend_event)：一个 [`TransitionEvent` 事件处理函数](#transitionevent-handler)。当 CSS 过渡完成时触发。
* `onTransitionEndCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onTransitionEnd` 版本。
* [`onWheel`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/wheel_event)：一个 [`WheelEvent` 事件处理函数](#wheelevent-handler)。当用户旋转滚轮按钮时触发。
* `onWheelCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onWheel` 版本。
* [`role`](https://developer.mozilla.org/zh-CN/docs/Web/Accessibility/ARIA/Roles)：一个字符串。为辅助技术明确指定元素角色
* [`slot`](https://developer.mozilla.org/zh-CN/docs/Web/Accessibility/ARIA/Roles)：一个字符串。当使用 shadow DOM 时，指定插槽名称。在 React 中，通常通过将 JSX 作为 props 传递来实现等效模式。例如 `<Layout left={<Sidebar />} right={<Content />} />`。
* [`spellCheck`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes/spellcheck)：布尔值或空值。如果明确设置为 `true` 或 `false`，则启用或禁用拼写检查。
* [`tabIndex`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes/tabindex)：一个数字。覆盖默认的 Tab 按钮行为。[避免使用除了 -1 和 0 以外的值](https://www.tpgi.com/using-the-tabindex-attribute/)。
* [`title`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes/title)：一个字符串。指定元素的工具提示文本。
* [`translate`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes/translate)：`'yes'` 或者 `'no'`。选择 `'no'` 将排除元素内容的翻译。

你还可以将自定义属性作为 props 传递。例如 `mycustomprop="someValue"`。当与第三方库集成时，这可能很有用。但是自定义属性名称必须为小写，并且不能以 `on` 开头。该值将被转换为一个字符串。如果你传递 `null` 或 `undefined`，则自定义属性将被删除。

这些事件仅适用于 [`<form>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/form) 元素：

* [`onReset`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLFormElement/reset_event)：一个 [`Event` 事件处理函数](#event-handler)。当表单被重置时触发。
* `onResetCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onReset` 版本。
* [`onSubmit`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLFormElement/submit_event)：一个 [`Event` 事件处理函数](#event-handler)。当表单提交时触发。
* `onSubmitCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onSubmit` 版本。

这些事件仅适用于 [`<dialog>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/dialog) 元素，与浏览器事件不同，React 中的事件会冒泡：

* [`onCancel`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLDialogElement/cancel_event)：一个 [`Event` 事件处理函数](#event-handler)。当用户尝试关闭对话框时触发。
* `onCancelCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onCancel` 版本。
* [`onClose`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLDialogElement/close_event)：一个 [`Event` 事件处理函数](#event-handler)。当对话框已关闭时触发。
* `onCloseCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onClose` 版本。

这些事件仅适用于 [`<details>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/details) 元素，与浏览器事件不同，React 中的事件会冒泡：

* [`onToggle`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLDetailsElement/toggle_event)：一个 [`Event` 事件处理函数](#event-handler)。当用户切换详细信息时触发。
* `onToggleCapture`:一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onToggle` 版本。

这些事件会触发在 [`<img>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/img)、[`<iframe>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/iframe)、[`<object>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/object)、[`<embed>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/embed)、[`<link>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/link) 和 [SVG `<image>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/SVG_Image_Tag) 元素。与浏览器事件不同，React 中的事件会冒泡：

* `onLoad`：一个 [`Event` 事件处理函数](#event-handler)。与浏览器事件不同，React 中的事件会冒泡：
* `onLoadCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onLoad` 版本。
* [`onError`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLMediaElement/error_event)：一个 [`Event` 事件处理函数](#event-handler)。当资源无法加载时触发。
* `onErrorCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onError` 版本。

这些事件会触发在 [`<audio>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/audio) 和 [`<video>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/video)。与浏览器事件不同，React 中的事件会冒泡：

* [`onAbort`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLMediaElement/abort_event)：一个 [`Event` 事件处理函数](#event-handler)。当资源尚未完全加载但没有错误时触发。
* `onAbortCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onAbort` 版本。
* [`onCanPlay`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLMediaElement/canplay_event)：一个 [`Event` 事件处理函数](#event-handler)。当有足够的数据开始播放，但是没有足够的数据可以无缓冲地播放到结束时触发。
* `onCanPlayCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onCanPlay` 版本。
* [`onCanPlayThrough`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLMediaElement/canplaythrough_event)：一个 [`Event` 事件处理函数](#event-handler)。当有足够的数据可以开始播放而不需要缓冲到结束时触发。
* `onCanPlayThroughCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onCanPlayThrough` 版本。
* [`onDurationChange`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLMediaElement/durationchange_event)：一个 [`Event` 事件处理函数](#event-handler)。当媒体持续时间更新时触发。
* `onDurationChangeCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onDurationChange` 版本。
* [`onEmptied`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLMediaElement/emptied_event)：一个 [`Event` 事件处理函数](#event-handler)。当媒体变为空时触发。
* `onEmptiedCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onEmptied` 版本。
* [`onEncrypted`](https://w3c.github.io/encrypted-media/#dom-evt-encrypted)：一个 [`Event` 事件处理函数](#event-handler)。当浏览器遇到加密媒体时触发。
* `onEncryptedCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onEncrypted` 版本。
* [`onEnded`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLMediaElement/ended_event)：一个 [`Event` 事件处理函数](#event-handler)。当播放停止因为没有剩余的内容可供播放时触发。
* `onEndedCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onEnded` 版本。
* [`onError`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLMediaElement/error_event)：一个 [`Event` 事件处理函数](#event-handler)。当资源无法加载时触发。
* `onErrorCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onError` 版本。
* [`onLoadedData`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLMediaElement/loadeddata_event)：一个 [`Event` 事件处理函数](#event-handler)。在当前播放帧已加载时触发。
* `onLoadedDataCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onLoadedData` 版本。
* [`onLoadedMetadata`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLMediaElement/loadedmetadata_event)：一个 [`Event` 事件处理函数](#event-handler)。元数据加载完成时触发。
* `onLoadedMetadataCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onLoadedMetadata` 版本。
* [`onLoadStart`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLMediaElement/loadstart_event)：一个 [`Event` 事件处理函数](#event-handler)。当浏览器开始加载资源时触发。
* `onLoadStartCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onLoadStart` 版本。
* [`onPause`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLMediaElement/pause_event)：一个 [`Event` 事件处理函数](#event-handler)。当媒体暂停时触发。
* `onPauseCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onPause` 版本。
* [`onPlay`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLMediaElement/play_event)：一个 [`Event` 事件处理函数](#event-handler)。当媒体不再暂停时触发。
* `onPlayCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onPlay` 版本。
* [`onPlaying`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLMediaElement/playing_event)：一个 [`Event` 事件处理函数](#event-handler)。当媒体开始或重新开始播放时触发。
* `onPlayingCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onPlaying` 版本。
* [`onProgress`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLMediaElement/progress_event)：一个 [`Event` 事件处理函数](#event-handler)。在资源加载时定期触发。
* `onProgressCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onProgress` 版本。
* [`onRateChange`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLMediaElement/ratechange_event)：一个 [`Event` 事件处理函数](#event-handler)。当播放速率改变时触发。
* `onRateChangeCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onRateChange` 版本。
* `onResize`：一个 [`Event` 事件处理函数](#event-handler)。当视频大小改变时触发。
* `onResizeCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onResize` 版本。
* [`onSeeked`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLMediaElement/seeked_event)：一个 [`Event` 事件处理函数](#event-handler)。当搜索操作完成时触发。
* `onSeekedCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onSeeked` 版本。
* [`onSeeking`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLMediaElement/seeking_event)：一个 [`Event` 事件处理函数](#event-handler)。当搜索操作开始时触发。
* `onSeekingCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onSeeking` 版本。
* [`onStalled`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLMediaElement/stalled_event)：一个 [`Event` 事件处理函数](#event-handler)。当浏览器等待数据但仍未加载时触发。
* `onStalledCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onStalled` 版本。
* [`onSuspend`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLMediaElement/suspend_event)：一个 [`Event` 事件处理函数](#event-handler)。当资源加载被暂停时触发。
* `onSuspendCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onSuspend` 版本。
* [`onTimeUpdate`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLMediaElement/timeupdate_event)：一个 [`Event` 事件处理函数](#event-handler)。当前播放时间更新时触发。
* `onTimeUpdateCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onTimeUpdate` 版本。
* [`onVolumeChange`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLMediaElement/volumechange_event)：一个 [`Event` 事件处理函数](#event-handler)。当音量发生变化时触发。
* `onVolumeChangeCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onVolumeChange` 版本。
* [`onWaiting`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLMediaElement/waiting_event)：一个 [`Event` 事件处理函数](#event-handler)。由于临时缺少数据而导致播放停止时触发。
* `onWaitingCapture`：一个在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的 `onWaiting` 版本。

#### 注意 {/*common-caveats*/}

- 你不能同时传递 `children` 和 `dangerouslySetInnerHTML`。
- 有些事件，如 `onAbort` 和 `onLoad`，在浏览器中不冒泡，但是在 React 中仍然会冒泡。

---

### `ref` 回调函数 {/*ref-callback*/}

与 [`useRef`](/reference/react/useRef#manipulating-the-dom-with-a-ref) 返回的 ref 对象不同，可以将函数传递给 `ref` 属性。

```js
<div ref={(node) => {
  console.log('Attached', node);

  return () => {
    console.log('Clean up', node)
  }
}}>
```

[查看使用 `ref` 回调函数的示例](/learn/manipulating-the-dom-with-refs#how-to-manage-a-list-of-refs-using-a-ref-callback)

当 `<div>` DOM 节点被添加到屏幕上时，React 将使用该节点作为参数调用 `ref` 回调函数。当这个 `<div>` DOM 节点被移除的时候， React 将调用回调返回的清理函数。

当传递不同的` ref `回调时，React 也会调用 `ref` 回调。在上面的示例中，`(node) => { ... }` 在每次渲染时都是一个不同的函数。当组件重新渲染时，先前的函数将被调用并传递 `null` 作为参数，并且下一个函数将被调用并传递对应 DOM 节点作为参数。

#### 参数 {/*ref-callback-parameters*/}

* `node`: DOM 节点。当 ref 被附加时，React 会向你传递 DOM 节点作为参数。除非你在每次渲染时为 `ref` 的回调函数传递相同引用，否则回调将在组件的每次重新渲染期间临时清理并重新创建。

<Note>

#### React 19 添加了 `ref` 回调的清理函数。{/*react-19-added-cleanup-functions-for-ref-callbacks*/}

为了向后兼容，如果 `ref` 回调未返回清理函数，当 `ref` 被分离时 `node` 会被作为 `null` 传递。此行为将在未来版本中删除。

</Note>

#### 返回值 {/*returns*/}

* **可选的** `清理函数`：当 `ref` 被分离时，React 会调用清理函数。如果 `ref` 回调未返回清理函数，React 会再次使用 `null` 作为参数调用回调函数。此行为将在未来版本中删除。

#### Caveats {/*caveats*/}

* When Strict Mode is on, React will **run one extra development-only setup+cleanup cycle** before the first real setup. This is a stress-test that ensures that your cleanup logic "mirrors" your setup logic and that it stops or undoes whatever the setup is doing. If this causes a problem, implement the cleanup function.
* When you pass a *different* `ref` callback, React will call the *previous* callback's cleanup function if provided. If no cleanup function is defined, the `ref` callback will be called with `null` as the argument. The *next* function will be called with the DOM node.

---

### React 事件对象 {/*react-event-object*/}

你的事件处理程序将接收到一个 React 事件对象。它有时也被称为“合成事件”（synthetic event）。

```js
<button onClick={e => {
  console.log(e); // React 事件对象
}} />
```

它符合与底层 DOM 事件相同的标准，但修复了一些浏览器不一致性。

一些 React 事件不能直接映射到浏览器的原生事件。例如，`onMouseLeave` 中的 `e.nativeEvent` 将指向 `mouseout` 事件。具体的映射关系不是公共 API 的一部分，可能会在未来发生变化。如果处于某些原因需要浏览器的原生事件，请从 `e.nativeEvent` 中读取它。

#### 属性 {/*react-event-object-properties*/}

React 事件对象实现了一些标准的 [`Event`](https://developer.mozilla.org/zh-CN/docs/Web/API/Event) 属性：

* [`bubbles`](https://developer.mozilla.org/zh-CN/docs/Web/API/Event/bubbles)：布尔值，返回事件是否会在 DOM 中冒泡传播。
* [`cancelable`](https://developer.mozilla.org/zh-CN/docs/Web/API/Event/cancelable)：布尔值，返回事件是否可以被取消。
* [`currentTarget`](https://developer.mozilla.org/zh-CN/docs/Web/API/Event/currentTarget)：DOM 节点，返回当前处理程序所附加到的节点在 React 树中的位置。
* [`defaultPrevented`](https://developer.mozilla.org/zh-CN/docs/Web/API/Event/defaultPrevented)：布尔值，返回是否调用了 `preventDefault`。
* [`eventPhase`](https://developer.mozilla.org/zh-CN/docs/Web/API/Event/eventPhase)：数字，返回事件当前所处的阶段。
* [`isTrusted`](https://developer.mozilla.org/zh-CN/docs/Web/API/Event/isTrusted)：布尔值，返回事件是否由用户发起。
* [`target`](https://developer.mozilla.org/zh-CN/docs/Web/API/Event/target)：DOM 节点，返回事件发生的节点（可能是远程子节点）。
* [`timeStamp`](https://developer.mozilla.org/zh-CN/docs/Web/API/Event/timeStamp)：数字，返回事件发生的时间。

此外，React 事件对象额外提供了以下属性：

* `nativeEvent`：DOM [`Event`](https://developer.mozilla.org/zh-CN/docs/Web/API/Event) 对象，即浏览器的原生事件对象。

#### 方法 {/*react-event-object-methods*/}

React 事件对象实现了一些标准的 [`Event`](https://developer.mozilla.org/zh-CN/docs/Web/API/Event) 方法：

* [`preventDefault()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Event/preventDefault)：阻止事件的默认浏览器行为。
* [`stopPropagation()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Event/stopPropagation)：阻止事件在 React 树中的传播。

此外，React 事件对象提供了以下方法：

* `isDefaultPrevented()`：返回布尔值，表示是否调用了 `preventDefault` 方法。
* `isPropagationStopped()`：返回一个布尔值，表示是否调用了 `stopPropagation` 方法。
* `persist()`：不适用于 React DOM。在 React Native 中，调用此函数以读取事件后的属性。
* `isPersistent()`：不适用于 React DOM。在 React Native 中，返回是否已调用 `persist`。

#### 注意 {/*react-event-object-caveats*/}

* `currentTarget`、`eventPhase`、`target` 和 `type` 的值反映了 React 代码所期望的值。实际上 React 在节点附加事件处理程序，但这不会体现在 React 事件对象中。例如，`e.currentTarget` 可能与原生 `e.nativeEvent.currentTarget` 不同。对于 polyfill 事件，`e.type`（React 事件类型）可能与 `e.nativeEvent.type`（原生事件类型）不同。

---

### `AnimationsEvent` 处理函数 {/*animationsevent-handler*/}

一个用于 [CSS 动画](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Animations/Using_CSS_animations) 事件的事件处理程序类型。

```js
<div
  onAnimationStart={e => console.log('onAnimationStart')}
  onAnimationIteration={e => console.log('onAnimationIteration')}
  onAnimationEnd={e => console.log('onAnimationEnd')}
/>
```

#### 参数 {/*animationevent-handler-parameters*/}

* `e`：带有这些额外 [`animationevent`](https://developer.mozilla.org/zh-CN/docs/Web/API/animationevent) 属性的 [React 事件对象](#react-event-object)：
  * [`animationName`](https://developer.mozilla.org/zh-CN/docs/Web/API/animationevent/animationName)
  * [`elapsedTime`](https://developer.mozilla.org/zh-CN/docs/Web/API/animationevent/elapsedTime)
  * [`pseudoElement`](https://developer.mozilla.org/zh-CN/docs/Web/API/animationevent/pseudoElement)

---

### `ClipboardEvent` 处理函数 {/*clipboadevent-handler*/}

一个用于 [Clipboard API](https://developer.mozilla.org/zh-CN/docs/Web/API/Clipboard_API) 事件的处理程序类型。

```js
<input
  onCopy={e => console.log('onCopy')}
  onCut={e => console.log('onCut')}
  onPaste={e => console.log('onPaste')}
/>
```

#### 参数 {/*clipboadevent-handler-parameters*/}

* `e`：具有下列额外 [`ClipboardEvent`](https://developer.mozilla.org/zh-CN/docs/Web/API/ClipboardEvent) 属性的 [React 事件对象](#react-event-object)：

  * [`clipboardData`](https://developer.mozilla.org/zh-CN/docs/Web/API/ClipboardEvent/clipboardData)

---

### `CompositionEvent` 处理函数 {/*compositionevent-handler*/}

一个用于 [输入法编辑器（IME）](https://developer.mozilla.org/zh-CN/docs/Glossary/Input_method_editor) 的事件处理程序类型。

```js
<input
  onCompositionStart={e => console.log('onCompositionStart')}
  onCompositionUpdate={e => console.log('onCompositionUpdate')}
  onCompositionEnd={e => console.log('onCompositionEnd')}
/>
```

#### 参数 {/*compositionevent-handler-parameters*/}

* `e`：具有下列额外 [`CompositionEvent`](https://developer.mozilla.org/zh-CN/docs/Web/API/CompositionEvent) 属性的 [React 事件对象](#react-event-object)：
  * [`data`](https://developer.mozilla.org/zh-CN/docs/Web/API/CompositionEvent/data)

---

### `DragEvent` 事件处理函数 {/*dragevent-handler*/}

[HTML Drag 和 Drop API](https://developer.mozilla.org/zh-CN/docs/Web/API/HTML_Drag_and_Drop_API) 事件的事件处理程序类型。

```js
<>
  <div
    draggable={true}
    onDragStart={e => console.log('onDragStart')}
    onDragEnd={e => console.log('onDragEnd')}
  >
    拖拽源
  </div>

  <div
    onDragEnter={e => console.log('onDragEnter')}
    onDragLeave={e => console.log('onDragLeave')}
    onDragOver={e => { e.preventDefault(); console.log('onDragOver'); }}
    onDrop={e => console.log('onDrop')}
  >
    拖拽目标
  </div>
</>
```

#### 参数 {/*dragevent-handler-parameters*/}

* `e`：一个带有这些额外的 [`DragEvent`](https://developer.mozilla.org/zh-CN/docs/Web/API/DragEvent) 属性的 [React 事件对象](#react-event-object)：
  * [`dataTransfer`](https://developer.mozilla.org/zh-CN/docs/Web/API/DragEvent/dataTransfer)

  它还包括继承的 [`MouseEvent`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent) 属性：

  * [`altKey`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/shiftKey)

  它还包括继承的 [`UIEvent`](https://developer.mozilla.org/zh-CN/docs/Web/API/UIEvent) 属性：

  * [`detail`](https://developer.mozilla.org/zh-CN/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/zh-CN/docs/Web/API/UIEvent/view)

---

### `FocusEvent` 处理函数 {/*focusevent-handler*/}

 一个用于焦点事件的事件处理程序类型。
 
```js
<input
  onFocus={e => console.log('onFocus')}
  onBlur={e => console.log('onBlur')}
/>
```

[看一个例子](#handling-focus-events)。

#### 参数 {/*focusevent-handler-parameters*/}

* `e`：一个有额外 [`FocusEvent`](https://developer.mozilla.org/zh-CN/docs/Web/API/FocusEvent) 属性的 [React 事件对象](#react-event-object)：
  * [`relatedTarget`](https://developer.mozilla.org/zh-CN/docs/Web/API/FocusEvent/relatedTarget)

  它还包括继承的 [`UIEvent`](https://developer.mozilla.org/zh-CN/docs/Web/API/UIEvent) 属性:

  * [`detail`](https://developer.mozilla.org/zh-CN/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/zh-CN/docs/Web/API/UIEvent/view)

---

### `Event` 处理函数 {/*event-handler*/}

一个通用事件的事件处理程序类型。

#### 参数 {/*event-handler-parameters*/}

* `e`：一个没有额外属性的 [React 事件对象](#react-event-object)。

---

### `InputEvent` 处理函数 {/*inputevent-handler*/}

一个用于 `onBeforeInput` 事件的事件处理程序类型。

```js
<input onBeforeInput={e => console.log('onBeforeInput')} />
```

#### 属性 {/*inputevent-handler-parameters*/}

* `e`：一个带有这些额外 [`InputEvent`](https://developer.mozilla.org/zh-CN/docs/Web/API/InputEvent) 属性的 [React 事件对象](#react-event-object)：
  * [`data`](https://developer.mozilla.org/zh-CN/docs/Web/API/InputEvent/data)

---

### `KeyboardEvent` 处理函数 {/*keyboardevent-handler*/}

一个用于键盘事件的事件处理程序类型。

```js
<input
  onKeyDown={e => console.log('onKeyDown')}
  onKeyUp={e => console.log('onKeyUp')}
/>
```

[看一个例子](#handling-keyboard-events)。

#### 参数 {/*keyboardevent-handler-parameters*/}

* `e`：一个带有这些额外的 [`KeyboardEvent`](https://developer.mozilla.org/zh-CN/docs/Web/API/KeyboardEvent) 属性的 [React 事件对象](#react-event-object)：
  * [`altKey`](https://developer.mozilla.org/zh-CN/docs/Web/API/KeyboardEvent/altKey)
  * [`charCode`](https://developer.mozilla.org/zh-CN/docs/Web/API/KeyboardEvent/charCode)
  * [`code`](https://developer.mozilla.org/zh-CN/docs/Web/API/KeyboardEvent/code)
  * [`ctrlKey`](https://developer.mozilla.org/zh-CN/docs/Web/API/KeyboardEvent/ctrlKey)
  * [`getModifierState(key)`](https://developer.mozilla.org/zh-CN/docs/Web/API/KeyboardEvent/getModifierState)
  * [`key`](https://developer.mozilla.org/zh-CN/docs/Web/API/KeyboardEvent/key)
  * [`keyCode`](https://developer.mozilla.org/zh-CN/docs/Web/API/KeyboardEvent/keyCode)
  * [`locale`](https://developer.mozilla.org/zh-CN/docs/Web/API/KeyboardEvent/locale)
  * [`metaKey`](https://developer.mozilla.org/zh-CN/docs/Web/API/KeyboardEvent/metaKey)
  * [`location`](https://developer.mozilla.org/zh-CN/docs/Web/API/KeyboardEvent/location)
  * [`repeat`](https://developer.mozilla.org/zh-CN/docs/Web/API/KeyboardEvent/repeat)
  * [`shiftKey`](https://developer.mozilla.org/zh-CN/docs/Web/API/KeyboardEvent/shiftKey)
  * [`which`](https://developer.mozilla.org/zh-CN/docs/Web/API/KeyboardEvent/which)

  它还包括继承的 [`UIEvent`](https://developer.mozilla.org/zh-CN/docs/Web/API/UIEvent) 属性：

  * [`detail`](https://developer.mozilla.org/zh-CN/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/zh-CN/docs/Web/API/UIEvent/view)

---

### `MouseEvent` 处理函数 {/*mouseevent-handler*/}

一个用于鼠标事件的事件处理程序类型。

```js
<div
  onClick={e => console.log('onClick')}
  onMouseEnter={e => console.log('onMouseEnter')}
  onMouseOver={e => console.log('onMouseOver')}
  onMouseDown={e => console.log('onMouseDown')}
  onMouseUp={e => console.log('onMouseUp')}
  onMouseLeave={e => console.log('onMouseLeave')}
/>
```

[看一个例子](#handling-mouse-events)。

#### 参数 {/*mouseevent-handler-parameters*/}

* `e`：一个具有这些额外 [`鼠标事件`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent) 属性的 [React 事件对象](#react-event-object)：
  * [`altKey`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/shiftKey)

 它还包括继承的 [`UIEvent`](https://developer.mozilla.org/zh-CN/docs/Web/API/UIEvent) 属性：

  * [`detail`](https://developer.mozilla.org/zh-CN/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/zh-CN/docs/Web/API/UIEvent/view)

---

### `PointerEvent` 处理函数 {/*pointerevent-handler*/}

一个 [指针事件](https://developer.mozilla.org/zh-CN/docs/Web/API/Pointer_events) 的事件处理程序类型。

```js
<div
  onPointerEnter={e => console.log('onPointerEnter')}
  onPointerMove={e => console.log('onPointerMove')}
  onPointerDown={e => console.log('onPointerDown')}
  onPointerUp={e => console.log('onPointerUp')}
  onPointerLeave={e => console.log('onPointerLeave')}
/>
```

[看一个例子](#handling-pointer-events)。

#### 参数 {/*pointerevent-handler-parameters*/}

* `e`：具有这些额外 [`PointerEvent`](https://developer.mozilla.org/zh-CN/docs/Web/API/PointerEvent) 属性的 [React 事件对象](#react-event-object)：
  * [`height`](https://developer.mozilla.org/zh-CN/docs/Web/API/PointerEvent/height)
  * [`isPrimary`](https://developer.mozilla.org/zh-CN/docs/Web/API/PointerEvent/isPrimary)
  * [`pointerId`](https://developer.mozilla.org/zh-CN/docs/Web/API/PointerEvent/pointerId)
  * [`pointerType`](https://developer.mozilla.org/zh-CN/docs/Web/API/PointerEvent/pointerType)
  * [`pressure`](https://developer.mozilla.org/zh-CN/docs/Web/API/PointerEvent/pressure)
  * [`tangentialPressure`](https://developer.mozilla.org/zh-CN/docs/Web/API/PointerEvent/tangentialPressure)
  * [`tiltX`](https://developer.mozilla.org/zh-CN/docs/Web/API/PointerEvent/tiltX)
  * [`tiltY`](https://developer.mozilla.org/zh-CN/docs/Web/API/PointerEvent/tiltY)
  * [`twist`](https://developer.mozilla.org/zh-CN/docs/Web/API/PointerEvent/twist)
  * [`width`](https://developer.mozilla.org/zh-CN/docs/Web/API/PointerEvent/width)

  它还包括继承的 [`MouseEvent`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent) 属性：

  * [`altKey`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/shiftKey)

 它还包括继承的 [`UIEvent`](https://developer.mozilla.org/zh-CN/docs/Web/API/UIEvent) 属性：

  * [`detail`](https://developer.mozilla.org/zh-CN/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/zh-CN/docs/Web/API/UIEvent/view)

---

### `TouchEvent` 处理函数 {/*touchevent-handler*/}

 一个用于 [触摸事件](https://developer.mozilla.org/zh-CN/docs/Web/API/Touch_events) 的事件处理程序类型。

```js
<div
  onTouchStart={e => console.log('onTouchStart')}
  onTouchMove={e => console.log('onTouchMove')}
  onTouchEnd={e => console.log('onTouchEnd')}
  onTouchCancel={e => console.log('onTouchCancel')}
/>
```

#### 参数 {/*touchevent-handler-parameters*/}

* `e`：一个带有这些额外的 [`TouchEvent`](https://developer.mozilla.org/zh-CN/docs/Web/API/TouchEvent) 属性的 [React 事件对象](#react-event-object)：
  * [`altKey`](https://developer.mozilla.org/zh-CN/docs/Web/API/TouchEvent/altKey)
  * [`ctrlKey`](https://developer.mozilla.org/zh-CN/docs/Web/API/TouchEvent/ctrlKey)
  * [`changedTouches`](https://developer.mozilla.org/zh-CN/docs/Web/API/TouchEvent/changedTouches)
  * [`getModifierState(key)`](https://developer.mozilla.org/zh-CN/docs/Web/API/TouchEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/zh-CN/docs/Web/API/TouchEvent/metaKey)
  * [`shiftKey`](https://developer.mozilla.org/zh-CN/docs/Web/API/TouchEvent/shiftKey)
  * [`touches`](https://developer.mozilla.org/zh-CN/docs/Web/API/TouchEvent/touches)
  * [`targetTouches`](https://developer.mozilla.org/zh-CN/docs/Web/API/TouchEvent/targetTouches)
  
 它还包括继承的 [`UIEvent`](https://developer.mozilla.org/zh-CN/docs/Web/API/UIEvent) 属性：

  * [`detail`](https://developer.mozilla.org/zh-CN/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/zh-CN/docs/Web/API/UIEvent/view)

---

### `TransitionEvent` 处理函数 {/*transitionevent-handler*/}

一个用于 CSS 过渡的事件处理程序类型。

```js
<div
  onTransitionEnd={e => console.log('onTransitionEnd')}
/>
```

#### 参数 {/*transitionevent-handler-parameters*/}

* `e`：一个带有这些额外 [`TransitionEvent`](https://developer.mozilla.org/zh-CN/docs/Web/API/TransitionEvent) 属性的 [React 事件对象](#react-event-object)：
  * [`elapsedTime`](https://developer.mozilla.org/zh-CN/docs/Web/API/TransitionEvent/elapsedTime)
  * [`propertyName`](https://developer.mozilla.org/zh-CN/docs/Web/API/TransitionEvent/propertyName)
  * [`pseudoElement`](https://developer.mozilla.org/zh-CN/docs/Web/API/TransitionEvent/pseudoElement)

---

### `UIEvent` 处理函数 {/*uievent-handler*/}

 一个通用 UI 事件的事件处理程序类型。

```js
<div
  onScroll={e => console.log('onScroll')}
/>
```

#### 参数 {/*uievent-handler-parameters*/}

* `e`：一个带有这些额外 [`UIEvent`](https://developer.mozilla.org/zh-CN/docs/Web/API/UIEvent) 属性的 [React 事件对象](#react-event-object)：
  * [`detail`](https://developer.mozilla.org/zh-CN/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/zh-CN/docs/Web/API/UIEvent/view)

---

### `WheelEvent` 处理函数 {/*wheelevent-handler*/}

一个用于 `onWheel` 事件的事件处理程序类型。

```js
<div
  onWheel={e => console.log('onWheel')}
/>
```

#### 参数 {/*wheelevent-handler-parameters*/}

* `e`：带有这些额外 [`WheelEvent`](https://developer.mozilla.org/zh-CN/docs/Web/API/WheelEvent) 属性的 [React 事件对象](#react-event-object)：
  * [`deltaMode`](https://developer.mozilla.org/zh-CN/docs/Web/API/WheelEvent/deltaMode)
  * [`deltaX`](https://developer.mozilla.org/zh-CN/docs/Web/API/WheelEvent/deltaX)
  * [`deltaY`](https://developer.mozilla.org/zh-CN/docs/Web/API/WheelEvent/deltaY)
  * [`deltaZ`](https://developer.mozilla.org/zh-CN/docs/Web/API/WheelEvent/deltaZ)


 它还包括继承的 [`MouseEvent`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent) 属性：

  * [`altKey`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/shiftKey)

 它还包括继承的 [`UIEvent`](https://developer.mozilla.org/zh-CN/docs/Web/API/UIEvent) 属性：

  * [`detail`](https://developer.mozilla.org/zh-CN/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/zh-CN/docs/Web/API/UIEvent/view)

---

## 用法 {/*usage*/}

### 应用 CSS 样式 {/*applying-css-styles*/}

在 React 中，你可以使用 [`className`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/className) 指定 CSS 类。它的工作方式类似于 HTML 中的 `class` 属性：

```js
<img className="avatar" />
```

然后你在单独的 CSS 文件中编写它的 CSS 规则：

```css
/* 在你的 CSS 文件中 */
.avatar {
  border-radius: 50%;
}
```

在最简单的情况下，你可以将 [`<link>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/link) 标签添加到 HTML 中。如果你使用构建工具或框架，请查阅其文档以了解如何将 CSS 文件添加到项目中。React 不规定如何添加 CSS 文件。

有时，样式值取决于数据。使用 `style` 属性动态传递一些样式：

```js {3-6}
<img
  className="avatar"
  style={{
    width: user.imageSize,
    height: user.imageSize
  }}
/>
```


在上述例子中，`style={{}}` 不是一个特殊的语法，而是将 `style={ }` [JSX 花括号](/learn/javascript-in-jsx-with-curly-braces) 放在一个普通 `{}` 中。我们建议只在样式依赖于 JavaScript 变量时使用 `style` 属性。

<Sandpack>

```js src/App.js
import Avatar from './Avatar.js';

const user = {
  name: 'Hedy Lamarr',
  imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
  imageSize: 90,
};

export default function App() {
  return <Avatar user={user} />;
}
```

```js src/Avatar.js active
export default function Avatar({ user }) {
  return (
    <img
      src={user.imageUrl}
      alt={'Photo of ' + user.name}
      className="avatar"
      style={{
        width: user.imageSize,
        height: user.imageSize
      }}
    />
  );
}
```

```css src/styles.css
.avatar {
  border-radius: 50%;
}
```

</Sandpack>

<DeepDive>

#### 如何有条件地应用多个 CSS 类？ {/*how-to-apply-multiple-css-classes-conditionally*/}

要有条件地应用 CSS 类，你需要使用 JavaScript 自己生成 `className` 字符串。

例如，`className={'row ' + (isSelected ? 'selected'：'')}` 将会生成 `className="row"` 还是 `className="row selected"` 取决于 `isSelected` 是否为 `true`。

使用像 [`classnames`](https://github.com/JedWatson/classnames) 这样的小助手库以维持代码可读性：

```js
import cn from 'classnames';

function Row({ isSelected }) {
  return (
    <div className={cn('row', isSelected && 'selected')}>
      ...
    </div>
  );
}
```

如果你有多个条件类，则特别方便：

```js
import cn from 'classnames';

function Row({ isSelected, size }) {
  return (
    <div className={cn('row', {
      selected: isSelected,
      large: size === 'large',
      small: size === 'small',
    })}>
      ...
    </div>
  );
}
```

</DeepDive>

---

### 使用 ref 操作 DOM 节点 {/*manipulating-a-dom-node-with-a-ref*/}

有时需要获取与 JSX 标签相关联的浏览器 DOM 节点。举个例子，当你希望在点击按钮时聚焦于一个 `<input>`，你需要在浏览器的`<input>` DOM 节点上调用 [`focus()`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/focus) 方法。

要获取标签的浏览器 DOM 节点，请 [声明一个 ref](/reference/react/useRef) 并将其作为一个 `ref` 属性传递给标签:

```js {7}
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);
  // ...
  return (
    <input ref={inputRef} />
    // ...
```

在渲染到屏幕后，React 会将 DOM 节点放入 `inputRef.current` 中。

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

阅读更多关于 [使用 ref 操纵 DOM](/learn/manipulating-the-dom-with-refs) 的内容并 [查看更多示例](/reference/react/useRef#usage)。

对于更高级的用例，`ref` 属性还可以接受 [回调函数](#ref-callback)。

---

### 危险地设置内部 HTML {/*dangerously-setting-the-inner-html*/}

你可以像这样将原始的 HTML 字符串传递给元素:

```js
const markup = { __html:'<p>some raw html</p>' };
return <div dangerouslySetInnerHTML={markup} />;
```

**这很危险。与底层的 DOM [`innerHTML`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/innerHTML) 属性一样，你必须极度谨慎！除非标记语言来自完全可信的来源，否则通过这种方式引入 [XSS](https://en.wikipedia.org/wiki/Cross-site_scripting) 是容易被攻击的**。

例如，如果你使用将 Markdown 转换为 HTML 的 Markdown 库，你得相信它的解析器没有漏洞，用户只能看到自己的输入，你可以像这样显示生成的 HTML:

<Sandpack>

```js
import { useState } from 'react';
import MarkdownPreview from './MarkdownPreview.js';

export default function MarkdownEditor() {
  const [postContent, setPostContent] = useState('你好，**Markdown**!');
  return (
    <>
      <label>
        输入一些 markdown:
        <textarea
          value={postContent}
          onChange={e => setPostContent(e.target.value)}
        />
      </label>
      <hr />
      <MarkdownPreview markdown={postContent} />
    </>
  );
}
```

```js src/MarkdownPreview.js active
import { Remarkable } from 'remarkable';

const md = new Remarkable();

function renderMarkdownToHTML(markdown) {
  // 这里安全的原因是输出的 HTML 代码
  // 仅显示给同一用户，
  // 并且你信任此 Markdown 解析器没有漏洞。
  const renderedHTML = md.render(markdown);
  return {__html: renderedHTML};
}

export default function MarkdownPreview({ markdown }) {
  const markup = renderMarkdownToHTML(markdown);
  return <div dangerouslySetInnerHTML={markup} />;
}
```

```json package.json
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
textarea { display: block; margin-top: 5px; margin-bottom: 10px; }
```

</Sandpack>

`{__html}` 对象应尽可能在接近生成 HTML 的位置创建，就像上面的示例在 `renderMarkdownToHTML` 函数中所做的那样。这确保了代码中使用的所有原始 HTML 都明确标记为这样，并且只有你期望包含 HTML 的变量被传递给 `dangerouslySetInnerHTML`。不建议像 `<div dangerouslySetInnerHTML={{__html: markup}} />` 这样内联创建对象。

要了解为什么渲染任意 HTML 是危险的，请将上面的代码替换为此代码：

```js {1-4,7,8}
const post = {
  // 想象这个内容被存储在数据库中
  content: `<img src="" onerror='alert("你被入侵了")'>`
};

export default function MarkdownPreview() {
  // 🔴 安全漏洞：将不受信任的输入传递给 dangerouslySetInnerHTML
  const markup = { __html: post.content };
  return <div dangerouslySetInnerHTML={markup} />;
}
```

HTML 中嵌入的代码将会运行。黑客可以利用这个安全漏洞窃取用户信息或代表他们执行操作。 **只有在使用受信任和经过消毒的数据时才能使用 `dangerouslySetInnerHTML`**。

---

### 处理鼠标事件 {/*handling-mouse-events*/}

这个例子展示了一些常见的 [鼠标事件](#mouseevent-handler) 以及它们触发的时机。

<Sandpack>

```js
export default function MouseExample() {
  return (
    <div
      onMouseEnter={e => console.log('onMouseEnter (parent)')}
      onMouseLeave={e => console.log('onMouseLeave (parent)')}
    >
      <button
        onClick={e => console.log('onClick (first button)')}
        onMouseDown={e => console.log('onMouseDown (first button)')}
        onMouseEnter={e => console.log('onMouseEnter (first button)')}
        onMouseLeave={e => console.log('onMouseLeave (first button)')}
        onMouseOver={e => console.log('onMouseOver (first button)')}
        onMouseUp={e => console.log('onMouseUp (first button)')}
      >
        First button
      </button>
      <button
        onClick={e => console.log('onClick (second button)')}
        onMouseDown={e => console.log('onMouseDown (second button)')}
        onMouseEnter={e => console.log('onMouseEnter (second button)')}
        onMouseLeave={e => console.log('onMouseLeave (second button)')}
        onMouseOver={e => console.log('onMouseOver (second button)')}
        onMouseUp={e => console.log('onMouseUp (second button)')}
      >
        Second button
      </button>
    </div>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

### 处理指针事件 {/*handling-pointer-events*/}

这个例子展示了一些常见的 [指针事件](#pointerevent-handler) 以及它们触发的时机。

<Sandpack>

```js
export default function PointerExample() {
  return (
    <div
      onPointerEnter={e => console.log('onPointerEnter (parent)')}
      onPointerLeave={e => console.log('onPointerLeave (parent)')}
      style={{ padding: 20, backgroundColor: '#ddd' }}
    >
      <div
        onPointerDown={e => console.log('onPointerDown (first child)')}
        onPointerEnter={e => console.log('onPointerEnter (first child)')}
        onPointerLeave={e => console.log('onPointerLeave (first child)')}
        onPointerMove={e => console.log('onPointerMove (first child)')}
        onPointerUp={e => console.log('onPointerUp (first child)')}
        style={{ padding: 20, backgroundColor: 'lightyellow' }}
      >
        First child
      </div>
      <div
        onPointerDown={e => console.log('onPointerDown (second child)')}
        onPointerEnter={e => console.log('onPointerEnter (second child)')}
        onPointerLeave={e => console.log('onPointerLeave (second child)')}
        onPointerMove={e => console.log('onPointerMove (second child)')}
        onPointerUp={e => console.log('onPointerUp (second child)')}
        style={{ padding: 20, backgroundColor: 'lightblue' }}
      >
        Second child
      </div>
    </div>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

### 处理焦点事件 {/*handling-focus-events*/}

在 React 中，[焦点事件](#focusevent-handler) 冒泡。你可以使用 `currentTarget` 和 `relatedTarget` 来区分焦点或模糊事件是否起源于父元素之外。该示例展示了如何检测子元素的聚焦、父级元素的聚焦，以及如何检测整个子树的聚焦进入或离开。

<Sandpack>

```js
export default function FocusExample() {
  return (
    <div
      tabIndex={1}
      onFocus={(e) => {
        if (e.currentTarget === e.target) {
          console.log('focused parent');
        } else {
          console.log('focused child', e.target.name);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // 在子元素之间切换焦点时不会触发
          console.log('focus entered parent');
        }
      }}
      onBlur={(e) => {
        if (e.currentTarget === e.target) {
          console.log('unfocused parent');
        } else {
          console.log('unfocused child', e.target.name);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // 在子元素之间切换焦点时不会触发
          console.log('focus left parent');
        }
      }}
    >
      <label>
        First name:
        <input name="firstName" />
      </label>
      <label>
        Last name:
        <input name="lastName" />
      </label>
    </div>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

### 处理键盘事件 {/*handling-keyboard-events*/}

这个例子展示了一些常见的 [键盘事件](#keyboardevent-handler) 以及它们触发的时机。

<Sandpack>

```js
export default function KeyboardExample() {
  return (
    <label>
      First name:
      <input
        name="firstName"
        onKeyDown={e => console.log('onKeyDown:', e.key, e.code)}
        onKeyUp={e => console.log('onKeyUp:', e.key, e.code)}
      />
    </label>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>
