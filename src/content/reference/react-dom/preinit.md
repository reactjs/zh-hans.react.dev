---
title: preinit
---

<Note>

[基于 React 的框架](/learn/start-a-new-react-project) 通常会内置资源处理方案，因此你可能不必手动调用此 API。请查阅框架文档以获取详细信息。

</Note>

<Intro>

`preinit` 可以预获取和评估样式表或外部脚本。

```js
preinit("https://example.com/script.js", {as: "script"});
```

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `preinit(href, options)` {/*preinit*/}

调用 `react-dom` 中的 `preinit` 函数以实现预初始化脚本或样式表。

```js
import { preinit } from 'react-dom';

function AppRoot() {
  preinit("https://example.com/script.js", {as: "script"});
  // ……
}

```

[参见下方更多示例](#usage)。

`preinit` 函数向浏览器提供一个提示，告诉它应该开始下载并执行给定的资源，这可以节省时间。`preinit` 的脚本在下载完成后执行。预初始化的样式表被插入到文档中，这会使它们立即生效。

#### 参数 {/*parameters*/}

* `href`：字符串，要下载并执行的资源的 URL。
* `options`：对象，可以包含以下属性：
  *  `as`：必需的字符串，表示资源的类型，可能的值包括 `script` 与 `style`。
  *  `precedence`：字符串，与样式表一起使用时必需。指定样式表相对于其他样式表的插入位置。具有较高优先级的样式表可以覆盖具有较低优先级的样式表，可能的值包括 `reset`、`low`、`medium` 与 `high`。
  *  `crossOrigin`：字符串，表示要使用的 [CORS 策略](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Attributes/crossorigin)，可能的值为 `anonymous` 与 `use-credentials`。
  *  `integrity`：字符串，为资源的加密哈希，用于 [验证其真实性](https://developer.mozilla.org/zh-CN/docs/Web/Security/Subresource_Integrity)。
  *  `nonce`：字符串，表示使用严格内容安全策略时允许资源的 [加密随机数](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes/nonce)。
  *  `fetchPriority`：字符串，表示建议获取资源的相对优先级，可能的值为 `auto`（默认值）、`high` 与 `low`。

#### 返回值 {/*returns*/}

`preinit` 不返回任何值。

#### 注意 {/*caveats*/}

* 对于具有相同 `href` 的多个 `preinit` 调用具有与单个调用相同的效果。
* 在浏览器中，可以在任何情况下调用 `preinit`：例如渲染组件时、Effect 中以及事件处理程序中等等。
* 在服务器端渲染或渲染服务器组件时，只有在渲染组件时调用 `preinit` 或在源自渲染组件的异步上下文中调用时，`preinit` 才会生效。其他任何调用都将被忽略。

---

## 用法 {/*usage*/}

### 渲染时预初始化 {/*preiniting-when-rendering*/}

如果知道组件或其子组件将使用特定资源，并且可以接受资源被评估并在下载后立即生效，请在渲染组件时调用 `preinit`。

<Recipes titleText="预初始化的例子">

#### 预初始化外部脚本 {/*preiniting-an-external-script*/}

```js
import { preinit } from 'react-dom';

function AppRoot() {
  preinit("https://example.com/script.js", {as: "script"});
  return ...;
}
```

如果希望浏览器下载脚本但不立即执行它，请使用 [`preload`](/reference/react-dom/preload)。如果想加载一个 ESM 模块，请使用 [`preinitModule`](/reference/react-dom/preinitModule)。

<Solution />

#### 预初始化样式表 {/*preiniting-a-stylesheet*/}

```js
import { preinit } from 'react-dom';

function AppRoot() {
  preinit("https://example.com/style.css", {as: "style", precedence: "medium"});
  return ...;
}
```

`precedence` 选项是必需的，它允许控制文档中样式表的顺序。具有较高优先级的样式表可以覆盖具有较低优先级的样式表。

如果希望下载样式表但不立即将其插入文档中，请改用 [`preload`](/reference/react-dom/preload)。

<Solution />

</Recipes>

### 在事件处理程序中预初始化 {/*preiniting-in-an-event-handler*/}

在转换到需要外部资源的页面或状态之前，于事件处理程序中调用 `preinit`。这会比在渲染新页面或状态时调用它更早地启动该过程。

```js
import { preinit } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preinit("https://example.com/wizardStyles.css", {as: "style"});
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```
