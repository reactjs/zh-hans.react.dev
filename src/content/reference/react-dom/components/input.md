---
title: "<input>"
---

<Intro>

[浏览器内置的 `<input>` 组件](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/input) 允许你渲染不同类型的表单输入框。

```js
<input />
```

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `<input>` {/*input*/}

渲染 [浏览器内置的 `<input>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/input) 组件以展示输入框。

```js
<input name="myInput" />
```

[参见下面更多示例](#usage)。

#### 属性 {/*props*/}

`<input>` 支持所有 [常见的元素属性](/reference/react-dom/components/common#common-props)。

[`formAction`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formaction): 字符串或函数。设置了 `type="submit"` 或 `type="image"` 属性的 `input` 标签，会覆盖父表单对应属性 `<form action>`。当向 `formAction` 传递 URL 时，表单会表现为标准 HTML 表单；当传递函数时，该函数将处理表单提交。详见 [`<form action>`](/reference/react-dom/components/form#props)。

你可以通过传递以下属性之一来[使输入框成为受控组件](#controlling-an-input-with-a-state-variable)：

* `checked`：布尔值，控制复选框或单选按钮是否被选中。
* `value`：字符串，控制文本框的输入文本（如果是单选按钮，则为其表单数据）。

当你传递它们之一时，你必须同时传递 `onChange` 处理函数，用于更新传递的值。

以下 `<input>` 属性仅在非受控输入框中有效：

* `defaultChecked`：布尔值，指定 `type="checkbox"` 和 `type="radio"` 输入的 [初始值](#providing-an-initial-value-for-an-input)。
* `defaultValue`：字符串，指定文本框的 [初始值](#providing-an-initial-value-for-an-input)。

以下 `<input>` 属性均可用于受控与非受控输入框：

* `accept`：字符串，指定 `type="file"` 输入框所接受的文件类型。
* `alt`：字符串，指定 `type="image"` 输入框的替代图像文本。
* `capture`：字符串，指定 `type="file"` 输入框所捕获的媒体（麦克风、视频或摄像头）。
* `autoComplete`：字符串，指定可能的 [自动填充行为](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Attributes/autocomplete#values) 之一。
* `autoFocus`：布尔值。如果为 `true`，React 将在挂载时聚焦于此元素。
* `dirname`：字符串，指定元素的方向性的表单字段名称。
* `disabled`：布尔值。如果为`true`，输入框将无法交互并显示为不可用（dimmed）。
* `children`：`<input>` 不接受子元素。
* `form`：字符串，指定此输入框所属的 `<form>` 的 `id`。如果未指定，则为最近的父表单。
* `formAction`：字符串。输入框指定此值并指定 `type="submit"` 或 `type="image"` 后将覆盖父表单对应属性 `<form action>`。
* `formEnctype`：字符串。输入框指定此值并指定 `type="submit"` 或 `type="image"` 后将覆盖父表单对应属性 `<form enctype>`。
* `formMethod`：字符串。输入框指定此值并指定 `type="submit"` 或 `type="image"` 后将覆盖父表单对应属性 `<form method>`。
* `formNoValidate`：字符串。输入框指定此值并指定 `type="submit"` 或 `type="image"` 后将覆盖父表单对应属性 `<form noValidate>`。
* `formTarget`：字符串。输入框指定此值并指定 `type="submit"` 或 `type="image"` 后将覆盖父表单对应属性 `<form target>`。
* `height`：字符串，指定 `type="image"` 的图像高度。
* `list`：字符串，指定带有自动完成选项的 `<datalist>` 的 `id`。
* `max`：数字，指定数值和日期时间输入的最大值。
* `maxLength`：数字，指定文本和其他输入的最大长度。
* `min`：数字，指定数值和日期时间输入的最小值。
* `minLength`：数字，指定文本和其他输入的最小长度。
* `multiple`：布尔值，指定是否允许 `<type="file"` 和 `type="email"` 指定多个值。
* `name`：字符串，指定此输入框的名称，它将 [随表单一起提交](#reading-the-input-values-when-submitting-a-form)。
* `onChange`：一个 [`Event`](/reference/react-dom/components/common#event-handler) 处理函数。如果这是 [受控输入框](#controlling-an-input-with-a-state-variable)，则必须提供。在用户更改输入框的值时立即触发（例如，每次按键时触发）。行为类似于浏览器的 [`input`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/input_event) 事件。
* `onChangeCapture`：与 `onChange` 类似，但是是在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发。
* `onInput`：一个 [`Event`](/reference/react-dom/components/common#event-handler) 处理函数。在用户更改值时立即触发。由于历史原因，在 React 中习惯于使用 `onChange`，工作方式类似。
* `onInputCapture`：与 `onInput` 类似，但是是在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发。
* `onInvalid`：一个 [`Event`](/reference/react-dom/components/common#event-handler) 处理函数。在表单提交时，如果输入框未通过验证将触发。与内置的 `invalid` 事件不同，React 的 `onInvalid` 事件可以进行冒泡。
* `onInvalidCapture`：与 `onInvalid` 类似，但是是在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发。
* `onSelect`：一个 [`Event`](/reference/react-dom/components/common#event-handler) 处理函数。在 `<input>` 内的选择更改后触发。React 扩展了 `onSelect` 事件，使其也能在选择为空和编辑时触发（可能会影响选择）。
* `onSelectCapture`：与 `onSelect` 类似，但是是在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发。
* `pattern`：字符串，指定 `value` 必须匹配的模式。
* `placeholder`：字符串，当输入值为空时，以暗淡的颜色显示的内容。
* `readOnly`：布尔值。如果为 `true`，用户无法编辑输入。
* `required`：布尔值。如果为 `true`，提交表单时必须提供此输入框的值。
* `size`：数字，类似于设置宽度，但单位取决于控件。
* `src`：字符串，指定 `type="image"` 输入框的图像源。
* `step`：正数或 `'any'` 字符串，指定有效值之间的距离。
* `type`：字符串，[输入框类型](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/input#input_types) 中的一个。
* `width`：字符串，指定 `type="image"` 输入框的图像宽度。

#### 注意 {/*caveats*/}

- 复选框需要使用 `checked` 或 `defaultChecked`，而不是 `value` 或 `defaultValue`。
- 如果文本框接收到字符串类型的 `value` 属性，则会被 [视为受控组件](#controlling-an-input-with-a-state-variable)。
- 如果复选框或单选按钮接收到布尔类型的 `checked` 属性，则会被 [视为受控组件](#controlling-an-input-with-a-state-variable)。
- 一个输入框不能同时既是受控组件又是非受控组件。
- 一个输入框在其生命周期中不能在受控和非受控之间切换。
- 每个受控组件都需要一个 `onChange` 事件处理函数，用于同步更新其值。

---

## 用法 {/*usage*/}

### 展示不同类型的输入框 {/*displaying-inputs-of-different-types*/}

渲染 `input` 组件展示输入框。默认情况下，这是一个文本框。你可以传递 `type="checkbox"` 将其指定为多选框；或者传递 `type="radio"` 将其指定为单选按钮；[你也可以将其指定为其他类型](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/input#input_types)。

<Sandpack>

```js
export default function MyForm() {
  return (
    <>
      <label>
        文本框：<input name="myInput" />
      </label>
      <hr />
      <label>
        多选框<input type="checkbox" name="myCheckbox" />
      </label>
      <hr />
      <p>
        单选按钮：
        <label>
          <input type="radio" name="myRadio" value="option1" />
          选项一
        </label>
        <label>
          <input type="radio" name="myRadio" value="option2" />
          选项二
        </label>
        <label>
          <input type="radio" name="myRadio" value="option3" />
          选项三
        </label>
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

---

### 为输入框提供 label 属性 {/*providing-a-label-for-an-input*/}

一般而言，应该将每个 `<input>` 都放置在 [`<label>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/label) 内，表示此标签与该选择框相关联。当用户单击标签时，浏览器将自动聚焦选择框。这对于可访问性也非常重要：当用户聚焦选择框时，屏幕阅读器将宣布标签标题。

如果无法将 `<input>` 放置在 `<label>` 内，请通过将相同的 ID 传递给 `<input id>` 与 [`<label htmlFor>`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLLabelElement/htmlFor) 来将它们关联起来。为了避免一个组件的多实例之间的冲突，使用 [useId](/reference/react/useId) 生成这样的 ID。

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const ageInputId = useId();
  return (
    <>
      <label>
        你的名称：
        <input name="firstName" />
      </label>
      <hr />
      <label htmlFor={ageInputId}>你的年龄：</label>
      <input id={ageInputId} name="age" type="number" />
    </>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

---

### 为输入框提供初始值 {/*providing-an-initial-value-for-an-input*/}

你可以为任何输入框指定初始值。如果要为文本框指定初始值，传递字符串 `defaultValue`；如果要为复选框和单选按钮指定初始值，传递布尔值 `defaultChecked`。

<Sandpack>

```js
export default function MyForm() {
  return (
    <>
      <label>
        文本框：<input name="myInput" defaultValue="Some initial value" />
      </label>
      <hr />
      <label>
        多选框：<input type="checkbox" name="myCheckbox" defaultChecked={true} />
      </label>
      <hr />
      <p>
        单选按钮：
        <label>
          <input type="radio" name="myRadio" value="option1" />
          选项一
        </label>
        <label>
          <input
            type="radio"
            name="myRadio"
            value="option2"
            defaultChecked={true} 
          />
          选项二
        </label>
        <label>
          <input type="radio" name="myRadio" value="option3" />
          选项三
        </label>
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

---

### 提交表单时读取输入框的值 {/*reading-the-input-values-when-submitting-a-form*/}

在输入框周围添加一个包含 [`<button type="submit">`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/button) 按钮的 [`<form>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/form) 组件。这将调用 `<form onSubmit>` 事件处理程序。默认情况下，浏览器将向当前 URL 发送表单数据并刷新页面。你可以通过调用 `e.preventDefault()` 取消此默认行为，并使用 [`new FormData(e.target)`](https://developer.mozilla.org/zh-CN/docs/Web/API/FormData) 读取表单数据。
<Sandpack>

```js
export default function MyForm() {
  function handleSubmit(e) {
    // 阻止浏览器重新加载页面
    e.preventDefault();

    // 读取表单数据
    const form = e.target;
    const formData = new FormData(form);

    // 你可以直接将 formData 作为 fetch 的请求 body：
    fetch('/some-api', { method: form.method, body: formData });

    // 也可以使用普通的对象：
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        文本框：<input name="myInput" defaultValue="Some initial value" />
      </label>
      <hr />
      <label>
        多选框： <input type="checkbox" name="myCheckbox" defaultChecked={true} />
      </label>
      <hr />
      <p>
        单选按钮：
        <label><input type="radio" name="myRadio" value="option1" /> 选项一</label>
        <label><input type="radio" name="myRadio" value="option2" defaultChecked={true} /> 选项二</label>
        <label><input type="radio" name="myRadio" value="option3" /> 选项三</label>
      </p>
      <hr />
      <button type="reset">重置表单</button>
      <button type="submit">提交表单</button>
    </form>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

<Note>

给 `<input>` 添加 `name` 属性，例如 `<input name="firstName" defaultValue="Taylor" />`。指定的 `name` 将作为表单数据中的一个键，例如 `{ firstName: "Taylor" }`。

</Note>

<Pitfall>

默认情况下，`<form>` 内的任何没有 `type` 属性的 `<button>` 都可以提交表单。这可能会让人感到惊讶！如果你有自定义 `Button` 组件，请考虑使用 [`<button type="button">`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/button) 而不是 `<button>`。如果你想要明确指定提交表单的按钮，请使用 `<button type="submit">`。

</Pitfall>

---

### 使用 state 控制输入框 {/*controlling-an-input-with-a-state-variable*/}

像 `<input />` 这样的输入框是非受控的。即使你像 `<input defaultValue="Initial text" />` 一样 [传递了初始值](#providing-an-initial-value-for-an-input)，你的 JSX 也只是指定了初始值，而非当前时刻的值。

**如果要渲染一个受控输入框，请传递 `value` 属性（或者向多选框和单选按钮传递 `checked`**。React 将强制传递 `value` 属性给输入框。通常，你可以通过声明一个 [state](/reference/react/useState) 来控制输入框。

```js {2,6,7}
function Form() {
  const [firstName, setFirstName] = useState(''); // 声明一个 state 变量...
  // ...
  return (
    <input
      value={firstName} // ...强制输入框的值与 state 相匹配...
      onChange={e => setFirstName(e.target.value)} // ... 并在每次改变（change）时更新 state！
    />
  );
}
```

当你需要 state 时，受控输入框都将非常有用——比如，每次编辑时都重新渲染 UI：

```js {2,9}
function Form() {
  const [firstName, setFirstName] = useState('');
  return (
    <>
      <label>
        你的名称：
        <input value={firstName} onChange={e => setFirstName(e.target.value)} />
      </label>
      {firstName !== '' && <p>你的名称是 {firstName}。</p>}
      ...
```

如果你想提供多种方式来调整输入框 state（例如，通过单击按钮），它也会很有用：

```js {3-4,10-11,14}
function Form() {
  // ...
  const [age, setAge] = useState('');
  const ageAsNumber = Number(age);
  return (
    <>
      <label>
        年龄：
        <input
          value={age}
          onChange={e => setAge(e.target.value)}
          type="number"
        />
        <button onClick={() => setAge(ageAsNumber + 10)}>
          增加 10 年
        </button>
```

传递给受控组件的 `value` 属性不能是 `undefined` 或 `null`。如果你需要初始值为空（例如，下面的 `firstName` 字段），请将你的 state 变量初始化为空字符串（`''`）。

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [age, setAge] = useState('20');
  const ageAsNumber = Number(age);
  return (
    <>
      <label>
        名：
        <input
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        年龄：
        <input
          value={age}
          onChange={e => setAge(e.target.value)}
          type="number"
        />
        <button onClick={() => setAge(ageAsNumber + 10)}>
          增加 10 年
        </button>
      </label>
      {firstName !== '' &&
        <p>你的名称是 {firstName}。</p>
      }
      {ageAsNumber > 0 &&
        <p>你的年龄是 {ageAsNumber}。</p>
      }
    </>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
p { font-weight: bold; }
```

</Sandpack>

<Pitfall>

如果传递了 `value` 但没有传递 `onChange`，那么将无法输入内容。当你通过传递 `value` 来控制输入框时，你需要保证输入框始终具有你传递的值。因此，如果你将一个 state 作为 `value` 传递，但在 `onChange` 事件处理程序中忘记同步更新该状态变量，React 将在每次输入后将输入框恢复到指定的 `value`。

</Pitfall>

---

### 优化每次按键时的重新渲染 {/*optimizing-re-rendering-on-every-keystroke*/}

当你使用受控输入框时，每次按键都会设置 state。如果包含 state 的组件重新渲染了大型树形结构，这可能会变得很慢。有几种方法可以优化重新渲染的性能。

例如，假设表单在每次按键时会重新渲染所有页面内容：

```js {5-8}
function App() {
  const [firstName, setFirstName] = useState('');
  return (
    <>
      <form>
        <input value={firstName} onChange={e => setFirstName(e.target.value)} />
      </form>
      <PageContent />
    </>
  );
}
```

由于 `<PageContent />` 不依赖于输入框 state，因此可以将输入框 state 移入其自己的组件中：

```js {4,10-17}
function App() {
  return (
    <>
      <SignupForm />
      <PageContent />
    </>
  );
}

function SignupForm() {
  const [firstName, setFirstName] = useState('');
  return (
    <form>
      <input value={firstName} onChange={e => setFirstName(e.target.value)} />
    </form>
  );
}
```

这样可以显著提高性能，因为每次按键时只有 `SignupForm` 会重新渲染。

如果无法避免重新渲染（例如，如果 `PageContent` 依赖于搜索输入框的值），[`useDeferredValue`](/reference/react/useDeferredValue#deferring-re-rendering-for-a-part-of-the-ui) 可以帮助你在大型重新渲染过程中保持受控输入框的响应性（responsive）。

---

## 故障排除 {/*troubleshooting*/}

### 输入时文本框未更新 {/*my-text-input-doesnt-update-when-i-type-into-it*/}

如果传递了 `value` 属性给输入框，而没有传递 `onChange` 属性，那么你将在控制台看到错误信息：

```js
// 🔴 Bug：没有 onChange 事件处理程序的受控文本框
<input value={something} />
```

<ConsoleBlock level="error">

你传递了 `value` 属性给表单，但是没有传递 `onChange` 事件处理程序。这将使其变为只读。如果该字段应该是可变的，请使用 `defaultValue`。否则，设置 `onChange` 或 `readOnly`。

</ConsoleBlock>

正如错误信息所提示的，如果你仅仅是想要 [指定初始值](#providing-an-initial-value-for-an-input)，请传递 `defaultValue`：

```js
// ✅ Good：有初始值的非受控输入框
<input defaultValue={something} />
```

如果你想要 [使用 state 变量控制输入框](#controlling-an-input-with-a-state-variable)，指定 `onChange` 事件处理程序：

```js
// ✅ Good：具有 onChange 事件处理程序的受控输入框
<input value={something} onChange={e => setSomething(e.target.value)} />
```

如果输入框是只读的，额外传递 `readOnly` 属性：

```js
// ✅ Good：没有 onChange 事件处理程序的受控只读输入框
<input value={something} readOnly={true} />
```

---

### 点击时多选框未更新 {/*my-checkbox-doesnt-update-when-i-click-on-it*/}

如果传递了 `checked` 属性给多选框，而没有传递 `onChange` 属性，那么你将在控制台看到错误信息：

```js
// 🔴 Bug：没有 onChange 事件处理程序的受控多选框
<input type="checkbox" checked={something} />
```

<ConsoleBlock level="error">

你传递了 `checked` 属性给表单，但是没有传递 `onChange` 事件处理程序。这将使其变为只读。如果该字段应该是可变的，请使用 `defaultValue`。否则，设置 `onChange` 或 `readOnly`。

</ConsoleBlock>

正如错误信息所提示的，如果你仅仅是想要 [指定初始值](#providing-an-initial-value-for-an-input)，请传递 `defaultValue`：

```js
// ✅ Good：有初始值的非受控多选框
<input type="checkbox" defaultChecked={something} />
```

If you want [to control this checkbox with a state variable,](#controlling-an-input-with-a-state-variable) specify an `onChange` handler:

```js
// ✅ Good：具有 onChange 事件处理程序的受控多选框
<input type="checkbox" checked={something} onChange={e => setSomething(e.target.checked)} />
```

<Pitfall>

如果你想要读取多选框中选中的值，应该使用 `e.target.checked` 而不是 `e.target.value`。

</Pitfall>

如果多选框是只读的，额外传递 `readOnly` 属性：

```js
// ✅ Good：没有 onChange 事件处理程序的受控只读输入框
<input type="checkbox" checked={something} readOnly={true} />
```

---

### 当我输入时，输入框光标会跳到开头 {/*my-input-caret-jumps-to-the-beginning-on-every-keystroke*/}

如果你想要 [控制输入框](#controlling-an-input-with-a-state-variable)，你应该在 `onChange` 期间将对应的 state 变量更新为来自 DOM 的输入框的值。

你不应该将它更新为 `e.target.value`（对于多选框应该是 `e.target.checked`）以外的值：

```js
function handleChange(e) {
  // 🔴 Bug：将输入框更新为 e.target.value 以外的值
  setFirstName(e.target.value.toUpperCase());
}
```

你也不应该异步更新：

```js
function handleChange(e) {
  // 🔴 Bug：异步更新输入框
  setTimeout(() => {
    setFirstName(e.target.value);
  }, 100);
}
```

将 state 同步更新为 `e.target.value` 以解决此问题：

```js
function handleChange(e) {
  // ✅ 将受控输入框的值同步更新为 e.target.value
  setFirstName(e.target.value);
}
```

如果这不能解决问题，有可能是因为每次输入时输入框都从 DOM 中删除并重新添加。同样，如果在每次重新渲染时不小心 [重置了 state](/learn/preserving-and-resetting-state)，就会发生这种情况。例如，如果输入框或其祖先组件总是接收不同的 `key`，或者嵌套使用组件（这在 React 中是不允许的，并且会导致“内部”组件在每次渲染时重新挂载），就会发生这种情况。

---

### 收到错误：“A component is changing an uncontrolled input to be controlled” {/*im-getting-an-error-a-component-is-changing-an-uncontrolled-input-to-be-controlled*/}


提供的 `value` 属性必须在整个生命周期中都为字符串。

你不能一会传递 `value={undefined}` 一会传递 `value="some string"`，这会导致 React 不清楚你是想指定受控组件还是非受控组件。受控组件的 `value` 属性应该始终接收字符串，而不是 `null` 或 `undefined`。

如果 `value` 来自 API 或 state，它可能会被初始化为 `null` 或 `undefined`。在这种情况下，要么最初将其设置为空字符串（`''`），要么传递 `value={someValue ?? ''}` 以确保 `value` 是一个字符串。

类似的，如果传递 `checked` 属性给多选框，请确保它始终是布尔值。
