---
id: accessibility
title: 无障碍辅助功能
permalink: docs/accessibility.html
---

## 为什么我们需要无障碍辅助功能？ {#why-accessibility}

网络无障碍辅助功能（Accessibility，也被称为 [**a11y**](https://en.wiktionary.org/wiki/a11y)，因为以A开头，以Y结尾，一共11个字母）是一种可以帮助所有人获得服务的设计和创造。为了使辅助技术可以正确的解读您的网页，无障碍辅助功能是必要的。

React通常使用标准HTML技术来完全支持创建具有可访问性的网站。

## 标准和指引 {#standards-and-guidelines}

### WCAG {#wcag}

[网络内容无障碍指南（Web Content Accessibility Guidelines，WCAG）](https://www.w3.org/WAI/intro/wcag) 为开发无障碍网站提供了指南。

下面的 WCAG 检查表提供了一个概览：

- [Wuchang提供的WCAG检查表（WCAG checklist from Wuhcag）](https://www.wuhcag.com/wcag-checklist/)
- [WebAIM提供的WCAG检查表（WCAG checklist from WebAIM）](https://webaim.org/standards/wcag/checklist)
- [A11Y Project提供的检查表（Checklist from The A11Y Project）](https://a11yproject.com/checklist.html)

### WAI-ARIA {#wai-aria}

[网络无障碍倡议 - 无障碍互联网应用（Web Accessibility Initiative - Accessible Rich Internet Applications）](https://www.w3.org/WAI/intro/aria) 文件包含了创建完全无障碍JavaScript部件所需要的技术。

注意：JSX 支持所有 `aria-*` HTML 属性。虽然大多数React的DOM变量和属性命名都使用驼峰命名（camelCased），`aria-*` 应该使用带连字符的命名法（也叫诸如hyphen-cased，kebab-case, lisp-case），就像在 HTML 中一样。

```javascript{3,4}
<input
  type="text"
  aria-label={labelText}
  aria-required="true"
  onChange={onchangeHandler}
  value={inputValue}
  name="name"
/>
```

## HTML 语义 {#semantic-html}
HTML 语义是无障碍辅助功能网络应用的基础。利用多种HTML元素来强化您网站中的信息通常可以使您直接获得无障碍辅助功能。

- [MDN 的 HTML 元素参照（MDN HTML elements reference）](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)

在 JSX 中使用 `<div>` 元素来实现我们的 React 代码功能的时候，尤其当我们使用列表（`<ol>`， `<ul>` 和 `<dl>`）和 HTML `<table>` 时，HTML 语义会被破坏。
在这种情况下，我们应该使用 [React Fragments](/docs/fragments.html) 来组合各个组件。

举个例子，

```javascript{1,5,8}
import React, { Fragment } from 'react';

function ListItem({ item }) {
  return (
    <Fragment>
      <dt>{item.term}</dt>
      <dd>{item.description}</dd>
    </Fragment>
  );
}

function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        <ListItem item={item} key={item.id} />
      ))}
    </dl>
  );
}
```

和其他的元素一样，你可以把一系列的对象映射到一个 fragment 的数组中。

```javascript{6,9}
function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        // Fragments should also have a `key` prop when mapping collections
        <Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </Fragment>
      ))}
    </dl>
  );
}
```

当你不需要在 fragment 标签中添加任何 prop 且你的工具支持的时候，你可以使用 [短语法](/docs/fragments.html#short-syntax)：

```javascript{3,6}
function ListItem({ item }) {
  return (
    <>
      <dt>{item.term}</dt>
      <dd>{item.description}</dd>
    </>
  );
}
```

更多信息请参见 [Fragments 文档](/docs/fragments.html)。

## 无障碍表单 {#accessible-forms}

### 标记 {#labeling}
所有的 HTML 表单控制，例如 `<input>` 和 `<textarea>` ，都需要标注来实现无障碍辅助功能。我们需要提供屏幕朗读器以解释性标注。

以下资源向我们展示了如何写标注：

- [W3C 向我们展示如何标注元素](https://www.w3.org/WAI/tutorials/forms/labels/)
- [WebAIM 向我们展示如何标注元素](https://webaim.org/techniques/forms/controls)
- [Paciello Group 解释什么是无障碍名称](https://www.paciellogroup.com/blog/2017/04/what-is-an-accessible-name/)

尽管这些标准 HTML 实践可以被直接用在 React 中，请注意 `for` 在 JSX 中应该被写作 `htmlFor`：

```javascript{1}
<label htmlFor="namedInput">Name:</label>
<input id="namedInput" type="text" name="name"/>
```

### 在出错时提醒用户 {#notifying-the-user-of-errors}

当出现错误时，所有用户都应该知情。下面的链接告诉我们如何给屏幕朗读器设置错误信息：

- [W3C 展示用户推送](https://www.w3.org/WAI/tutorials/forms/notifications/)
- [WebAIM 关于表单校验的文章](https://webaim.org/techniques/formvalidation/)

## 控制焦点 {#focus-control}

确保你的网络应用可以在只使用键盘的情况下使用：

- [WebAIM 讨论使用键盘进行无障碍访问](https://webaim.org/techniques/keyboard/)

### 键盘焦点及焦点轮廓 {#keyboard-focus-and-focus-outline}

键盘焦点的定义是：在 DOM 中，当前被选中来接受键盘信息的元素。我们可以在各处看到键盘焦点，它会被焦点轮廓包围，像下面的这个图像一样。

<img src="../images/docs/keyboard-focus.png" alt="选中的链接被蓝色键盘焦点轮廓包围着。" />

请不要使用 CSS 移除这个轮廓，比如设置 `outline: 0`，除非你将使用其他的方法实现焦点轮廓。

### 跳过一些内容的机制 {#mechanisms-to-skip-to-desired-content}

为了帮助和提速键盘导航，我们提供了一种机制，可以帮助用户跳过一些导航段落。

跳转链接（Skiplinks），或者说跳转导航链接（Skip Navigation Links）是一种隐藏的导航链接，它只会在使用键盘导航时可见。使用网页内部锚点和一些式样可以很容易地实现它：

- [WebAIM - 跳转导航链接（Skip Navigation Links）](https://webaim.org/techniques/skipnav/)

另外，使用地标元素和角色，比如 `<main>` 和 `<aside>`，作为辅助来划分网页的区域可以让用户快速导航至这些部分。

您可以通过下面的链接了解更多如何使用这些元素来增强无障碍辅助功能：

- [无障碍地标](https://www.scottohara.me/blog/2018/03/03/landmarks.html)

### 使用程序管理焦点 {#programmatically-managing-focus}

我们的 React 应用在运行时会持续更改 HTML DOM，有时这将会导致键盘焦点的丢失或者是被设置到了意料之外的元素上。为了修复这类问题，我们需要以编程的方式让键盘聚焦到正确的方向上。比方说，在一个弹窗被关闭的时候，重新设置键盘焦点到弹窗的打开按钮上。

MDN Web Docs 关注了这个问题并解释了我们可以如何搭建[可用键盘导航的 JavaScript 部件](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Keyboard-navigable_JavaScript_widgets)。

我们可以用[DOM 元素的 Refs](/docs/refs-and-the-dom.html)在 React 中设置焦点。

用以上技术，我们先在一个类的 JSX 中创建一个元素的 ref：

```javascript{4-5,8-9,13}
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    // 创造一个 textInput DOM 元素的 ref
    this.textInput = React.createRef();
  }
  render() {
  // 使用 `ref` 回调函数以在实例的一个变量中存储文本输入 DOM 元素 （比如，this.textInput）。
    return (
      <input
        type="text"
        ref={this.textInput}
      />
    );
  }
}
```

然后我们就可以在需要时于其他地方把焦点设置在这个组件上：

 ```javascript
 focus() {
   // 使用原始的 DOM API 明确的聚焦在 text input 上
   // 注意：我们通过访问 ”current“ 来获得 DOM 节点
   this.textInput.current.focus();
 }
 ```

有时，父组件需要把焦点设置在其子组件的一个元素上。我们可以通过在子组件上设置一个特殊的 prop 来[对父组件暴露 DOM refs](/docs/refs-and-the-dom.html#exposing-dom-refs-to-parent-components)从而把父组件的 ref 传向子节点的 DOM 节点。

```javascript{4,12,16}
function CustomTextInput(props) {
  return (
    <div>
      <input ref={props.inputRef} />
    </div>
  );
}

class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.inputElement = React.createRef();
  }
  render() {
    return (
      <CustomTextInput inputRef={this.inputElement} />
    );
  }
}

// 现在你就可以在需要时设置焦点了
this.inputElement.current.focus();
```

当使用 HOC 来延伸组件的时候，我们建议使用 React 的 `forwardRef` 函数来向被包裹的组件[转递 ref](/docs/forwarding-refs.html)。如果第三方的 HOC 不支持转递 ref，上面的方法仍可以作为一种后备。

[react-aria-modal](https://github.com/davidtheclark/react-aria-modal)提供了一个很好的焦点管理的例子。这是一个少有的完全无障碍的模式窗口的例子。它不仅仅把初始焦点设置在了取消按钮上（防止键盘用户意外激活成功操作）和把键盘焦点固定在了窗口之内，关闭窗口时它也会把键盘焦点重置到打开窗口的那一个元素上。

>注意:
>
>虽然这是一个非常重要的无障碍辅助功能，但它也是一种应该谨慎使用的技术。 我们应该在受到干扰时使用它来修复键盘焦点，而不是试图预测
>用户想要如何使用应用程序。

## 鼠标和指针事件 {#mouse-and-pointer-events}

确保任何可以使用鼠标和指针完成的功能也可以只通过键盘完成。只依靠指针会产生很多使键盘用户无法使用你的应用的情况。

为了说明这一点，让我们看一下由点击事件引起的破坏无障碍访问的典型示例：外部点击模式，用户可以通过点击元素以外的地方来关闭已打开的弹出框。

<img src="../images/docs/outerclick-with-mouse.gif" alt="一个切换按钮可以打开一个弹窗，这个弹窗使用了外部点击模式，此图用一个鼠标指针展示了关闭操作是可行的。" />

通常实现这个功能的方法是在 `window` 对象中附上一个 `click` 事件以关闭弹窗：

```javascript{12-14,26-30}
class OuterClickExample extends React.Component {
constructor(props) {
    super(props);

    this.state = { isOpen: false };
    this.toggleContainer = React.createRef();

    this.onClickHandler = this.onClickHandler.bind(this);
    this.onClickOutsideHandler = this.onClickOutsideHandler.bind(this);
  }

  componentDidMount() {
    window.addEventListener('click', this.onClickOutsideHandler);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.onClickOutsideHandler);
  }

  onClickHandler() {
    this.setState(currentState => ({
      isOpen: !currentState.isOpen
    }));
  }

  onClickOutsideHandler(event) {
    if (this.state.isOpen && !this.toggleContainer.current.contains(event.target)) {
      this.setState({ isOpen: false });
    }
  }

  render() {
    return (
      <div ref={this.toggleContainer}>
        <button onClick={this.onClickHandler}>Select an option</button>
        {this.state.isOpen ? (
          <ul>
            <li>Option 1</li>
            <li>Option 2</li>
            <li>Option 3</li>
          </ul>
        ) : null}
      </div>
    );
  }
}
```

当用户使用指针设备，比如鼠标时，这样做没有问题。但是当只使用键盘时，因为 `window` 对象不会接受到 `click` 事件，用户将无法使用tab切换到下一个元素。这样会导致用户无法使用你应用中的一些内容，导致不完整的用户体验。

<img src="../images/docs/outerclick-with-keyboard.gif" alt="一个通过按钮打开的使用了外部点击模式的弹窗列表。用键盘操作时，我们可以看到弹窗没有在失去焦点时被关闭，遮挡了屏幕上的其他元素。" />

使用正确的事件触发器，比如 `onBlur` 和 `onFocus`，同样可以达成这项功能：

```javascript{19-29,31-34,37-38,40-41}
class BlurExample extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isOpen: false };
    this.timeOutId = null;

    this.onClickHandler = this.onClickHandler.bind(this);
    this.onBlurHandler = this.onBlurHandler.bind(this);
    this.onFocusHandler = this.onFocusHandler.bind(this);
  }

  onClickHandler() {
    this.setState(currentState => ({
      isOpen: !currentState.isOpen
    }));
  }

  // 我们在下一个时间点使用 setTimeout 关闭弹窗。
  // 这是必要的，因为失去焦点事件会在新的焦点事件前被触发，
  // 我们需要通过这个步骤确认这个元素的一个子节点是否得到了焦点。
  onBlurHandler() {
    this.timeOutId = setTimeout(() => {
      this.setState({
        isOpen: false
      });
    });
  }

  // 如果一个子节点获得了焦点，不要关闭弹窗。
  onFocusHandler() {
    clearTimeout(this.timeOutId);
  }

  render() {
    // React通过把失去焦点和获得焦点事件传输给父节点来帮助我们。
    return (
      <div onBlur={this.onBlurHandler}
           onFocus={this.onFocusHandler}>
        <button onClick={this.onClickHandler}
                aria-haspopup="true"
                aria-expanded={this.state.isOpen}>
          Select an option
        </button>
        {this.state.isOpen ? (
          <ul>
            <li>Option 1</li>
            <li>Option 2</li>
            <li>Option 3</li>
          </ul>
        ) : null}
      </div>
    );
  }
}
```

以上代码使得键盘和鼠标用户都可以使用我们的功能。请注意我们添加了 `aria-*` props 以服务屏幕朗读器用户。
作为一个简单的例子，我们没有实现使用`方向键`来与弹窗互动。

<img src="../images/docs/blur-popover-close.gif" alt="一个针对鼠标和键盘用户都正确关闭的弹窗。" />

这只是众多只依赖于鼠标和指针的程序破坏键盘用户的例子之一。始终使用键盘测试会让你迅速发现这些问题，你可以使用适用于键盘的事件处理器来修复这些问题。

## 更复杂的部件 {#more-complex-widgets}

一个更加复杂的用户体验并不意味着更加难以访问。通过尽可能接近 HTML 编程，无障碍访问会变得更加容易，即使最复杂的部件也可以实现无障碍访问。

这里我们需要了解 [ARIA Roles](https://www.w3.org/TR/wai-aria/#roles) 和 [ARIA States and Properties](https://www.w3.org/TR/wai-aria/#states_and_properties) 的知识。
其中有包含了多种 HTML 属性的工具箱，这些HTML属性被JSX完全支持并且可以帮助我们搭建完全无障碍，功能强大的React组件。

每一种部件都有一种特定的设计模式，并且用户和用户代理都会期待使用相似的方法使用它：

- [WAI-ARIA 创作实践 —— 设计模式和部件](https://www.w3.org/TR/wai-aria-practices/#aria_ex)
- [Heydon Pickering - ARIA Examples](https://heydonworks.com/practical_aria_examples/)
- [包容性组件（Inclusive Components）](https://inclusive-components.design/)

## 其他考虑因素 {#other-points-for-consideration}

### 设置语言 {#setting-the-language}

为了使屏幕朗读器可以使用正确的语音设置，请在网页上设置正确的人类语言（不是编程语言）：

- [WebAIM —— 文档语言](https://webaim.org/techniques/screenreader/#language)

### 设置文档标题 {#setting-the-document-title}

为了确保用户可以了解当前网页的内容，我们需要把文档的 `<title>` 设置为可以正确描述当前页面的文字。

- [WCAG —— 理解文档标题的要求](https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-title.html)

在 React 中，我们可以使用[React文档标题组件（React Document Title Component）](https://github.com/gaearon/react-document-title)来设置标题。

### 色彩对比度 {#color-contrast}

为了尽可能让视力障碍用户可以阅读您网站上的所有可读文字，请确保你的文字都有足够的色彩对比度。

- [WCAG —— 理解色彩对比度要求](https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html)
- [有关色彩对比度的一切以及为何你应该重新考虑它](https://www.smashingmagazine.com/2014/10/color-contrast-tips-and-tools-for-accessibility/)
- [A11yProject —— 什么是色彩对比度](https://a11yproject.com/posts/what-is-color-contrast/)

手工计算您网站上所有恰当的色彩组合会是乏味的。所以，作为代替，你可以[使用Colorable来计算出一个完全无障碍的调色板](https://jxnblk.com/colorable/)。

下面介绍的aXe和WAVE都支持色彩对比度测试并会报告对比度错误。

如果您想扩展对比度测试能力，可以使用以下工具：

- [WebAIM —— 色彩对比度检验工具](https://webaim.org/resources/contrastchecker/)
- [The Paciello Group —— 色彩对比度分析工具](https://www.paciellogroup.com/resources/contrastanalyser/)

## 开发及测试 {#development-and-testing-tools}

我们可以利用很多工具来帮助我们创建无障碍的网络应用。

### 键盘 {#the-keyboard}

最最简单也是最最重要的检测是确保你的整个网站都可以被只使用键盘的用户使用和访问。你可以通过如下步骤进行检测：

1. 拔掉鼠标
1. 使用 `Tab` 和 `Shift+Tab` 来浏览。
1. 使用 `Enter` 来激活元素。
1. 当需要时，使用键盘上的方向键来和某些元素互动，比如菜单和下拉选项。

### 开发辅助 {#development-assistance}

我们可以直接在 JSX 代码中检测一些无障碍复制功能。通常支持 JSX 的 IDE 会针对 ARIA roles,states 和 properties 提供智能检测。我们也可以使用以下工具：

#### eslint-plugin-jsx-a11y {#eslint-plugin-jsx-a11y}

ESLint 中的 [eslint-plugin-jsx-a11y](https://github.com/evcohen/eslint-plugin-jsx-a11y)插件提供为您 JSX 中的无障碍问题提供了 AST 的语法检测反馈。
许多 IDE 都允许您把这些发现直接集成到代码分析和源文件窗口中。

[创建 React 应用](https://github.com/facebookincubator/create-react-app)中使用了这个插件中的一部分规则。如果您想启用更多的无障碍规则，你可以在项目的根目录中创建一个有如下内容的 `.eslintrc` 文件：

  ```json
  {
    "extends": ["react-app", "plugin:jsx-a11y/recommended"],
    "plugins": ["jsx-a11y"]
  }
  ```

### 在浏览器中测试无障碍辅助功能 {#testing-accessibility-in-the-browser}

已有很多工具可以在您的浏览器内进行网页的无障碍性验证。因为它们只能检测您 HTML 的技术无障碍性，所以请将它们与这里提到的无障碍检测工具一起使用。

#### aXe,aXe-core以及react-axe {#axe-axe-core-and-react-axe}

Deque 系统提供了 [aXe-core](https://github.com/dequelabs/axe-core) 以对您的应用进行自动及端至端无障碍性测试。这个组件包含了对 Selenium 的集成。

[无障碍访问引擎（The Accessibility Engine）](https://www.deque.com/products/axe/)，简称 aXe，是一个基于 `aXe-core` 的无障碍访问性检测器。

在开发和 debug 时，你也可以使用 [react-axe](https://github.com/dylanb/react-axe) 组件直接把无障碍访问的发现显示在控制台中。

#### WebAIM WAVE {#webaim-wave}

[网络无障碍性评估工具（Web Accessibility Evaluation Tool）](https://wave.webaim.org/extension/)也是一个无障碍辅助的浏览器插件。

#### 无障碍辅助功能检测器和无障碍辅助功能树 {#accessibility-inspectors-and-the-accessibility-tree}

[无障碍辅助功能树](https://www.paciellogroup.com/blog/2015/01/the-browser-accessibility-tree/)是 DOM 树的一个子集，其中包含了所有 DOM 元素中应该被暴露给无障碍辅助技术（比如屏幕朗读器）的无障碍辅助对象。

在一些浏览器中，我们可以在无障碍辅助功能树中轻松的看到每个元素的无障碍辅助功能信息：

- [在 Firefox 中使用无障碍辅助功能检测器](https://developer.mozilla.org/en-US/docs/Tools/Accessibility_inspector)
- [在 Chrome 中激活无障碍辅助功能检测器](https://gist.github.com/marcysutton/0a42f815878c159517a55e6652e3b23a)
- [在 OS X Safari 中使用无障碍辅助功能检测器](https://developer.apple.com/library/content/documentation/Accessibility/Conceptual/AccessibilityMacOSX/OSXAXTestingApps.html)

### 屏幕朗读器 {#screen-readers}

使用屏幕朗读器测试应该是你无障碍辅助功能测试的一部分。

请注意，浏览器与屏幕朗读器的组合很重要。我们建议在最适用于您的屏幕朗读器的浏览器中测试您的应用。

### 常用屏幕朗读器 {#commonly-used-screen-readers}

#### 火狐中的NVDA {#nvda-in-firefox}

[NonVisual Desktop Access](https://www.nvaccess.org/)，简称 NVDA，是一个被广泛使用的 Windows 开源屏幕朗读器。

想要了解怎么样最好的使用NVDA，请参考下面的指南：

- [WebAIM —— 使用NVDA来评估网络的可无障碍访问性](https://webaim.org/articles/nvda/)
- [Deque —— NVDA键盘快捷键](https://dequeuniversity.com/screenreaders/nvda-keyboard-shortcuts)

#### Safari中的VoiceOver {#voiceover-in-safari}

VoiceOver 是苹果设备的自带屏幕朗读器。

想要了解如何激活以及使用 VoiceOver，请参考下面的指南：

- [WebAIM —— 使用VoiceOver来评估网络的可无障碍访问性](https://webaim.org/articles/voiceover/)
- [Deque —— OS X中的VoiceOver键盘快捷键](https://dequeuniversity.com/screenreaders/voiceover-keyboard-shortcuts)
- [Deque —— iOS中的VoiceOver快捷键](https://dequeuniversity.com/screenreaders/voiceover-ios-shortcuts)

#### Internet Explorer中的JAWS {#jaws-in-internet-explorer}

[Job Access With Speech](https://www.freedomscientific.com/Products/software/JAWS/)又称JAWS，是一个常用的Windows屏幕朗读器。

想要了解如何最好的使用 VoiceOver，请参考下面的指南：

- [WebAIM —— 使用 JAWS 来评估网络的可无障碍访问性](https://webaim.org/articles/jaws/)
- [Deque —— JAWS 键盘快捷键](https://dequeuniversity.com/screenreaders/jaws-keyboard-shortcuts)

### 其他屏幕朗读器 {#other-screen-readers}

#### Google Chrome中的ChromeVox {#chromevox-in-google-chrome}

[ChromeVox](https://www.chromevox.com/)是 Chromebook 的内置屏幕朗读器，同时也是 Google Chrome 中的[一个插件](https://chrome.google.com/webstore/detail/chromevox/kgejglhpjiefppelpmljglcjbhoiplfn?hl=en)。

想要了解如何最好的使用 ChromeVox，请参考下面的指南：

- [Google Chromebook 帮助 —— 使用内置屏幕朗读器](https://support.google.com/chromebook/answer/7031755?hl=en)
- [ChromeVox 经典键盘快捷键参考](https://www.chromevox.com/keyboard_shortcuts.html)
