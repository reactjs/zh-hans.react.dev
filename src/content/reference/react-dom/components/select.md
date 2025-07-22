---
title: "<select>"
---

<Intro>

[浏览器内置的 `<select>` 组件](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/select) 允许你结合选项（options）渲染选择框。

```js
<select>
  <option value="一些选项">一些选项</option>
  <option value="其他选项">其他选项</option>
</select>
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `<select>` {/*select*/}

使用 [浏览器内置的 `<select>` 组件](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/select) 结合选项（options）渲染选择框。

```js
<select>
  <option value="一些选项">一些选项</option>
  <option value="其他选项">其他选项</option>
</select>
```

[参见下面更多示例](#usage)。

#### 属性 {/*props*/}

`<select>` 支持所有 [常见的元素属性](/reference/react-dom/components/common#common-props)。

你可以通过传递 `value` 属性 [以控制选择框](#controlling-a-select-box-with-a-state-variable):

* `value`：一个字符串（如果指定 [`multiple={true}`](#enabling-multiple-selection)，那么 `value` 也可以是一个字符串数组）。当某一个选项（option）被选中时，`value` 为其对应的值。每个字符串值都与嵌套在 `<select>` 内的 `<option>` 的 `value` 属性相匹配。

当你传递 `value` 时，你必须同时传递一个 `onChange` 处理函数，用于更新传递的值。

如果 `<select>` 是非受控组件，那么你应该传递 `defaultValue` 参数：

* `defaultValue`：一个字符串（如果指定 [`multiple={true}`](#enabling-multiple-selection)，那么 `defaultValue` 也可以是一个字符串数组）。`defaultValue` 表示 [初始选中的选项（option）](#providing-an-initially-selected-option)。

以下 `<select>` 属性均可用于受控与非受控选择框组件：

* [`autoComplete`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/select#autocomplete)：字符串，用于指定可能的 [自动完成行为](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Attributes/autocomplete#values) 之一。
* [`autoFocus`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/select#autofocus)：布尔值。如果为 `true`，React 将在挂载时聚焦该元素。
* `children`：`<select>` 接受 [`<option>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/option)、[`<optgroup>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/optgroup) 与 [`<datalist>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/datalist) 组件作为子元素。只要最终渲染的是其中之一，你也可以传递自己的组件。如果最终渲染的是 `<option>`，则每个 `<option>` 都必须具有 `value` 属性。
* [`disabled`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/select#disabled)：布尔值。如果为 `true`，选择框将不会交互并展示为暗淡状态（dimmed）。
* [`form`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/select#form)：字符串，表示此选择框所属的 `<form>` 的 `id`。如果未指定，则为最近的父表单。
* [`multiple`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/select#multiple)：布尔值。如果为 `true`，则浏览器允许 [多选](#enabling-multiple-selection)。
* [`name`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/select#name)：字符串，用于指定此选择框的名称，该名称将在 [提交表单时](#reading-the-select-box-value-when-submitting-a-form) 一起提交。
* `onChange`：一个 [`Event` 处理函数](/reference/react-dom/components/common#event-handler)，其对于 [受控选择框](#controlling-a-select-box-with-a-state-variable) 是必需的。当用户选择不同的选项时立即触发。此行为类似于浏览器 [`input` 事件](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/input_event)。
* `onChangeCapture`：与 `onChange` 类似，但是是在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的。
* [`onInput`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/input_event)：一个 [`Event` 处理函数](/reference/react-dom/components/common#event-handler)。当用户更改值时立即触发。由于历史原因，在 React 习惯于使用 `onChange`，工作方式类似。
* `onInputCapture`：与 `onInput` 类似，但是是在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的。
* [`onInvalid`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLInputElement/invalid_event)：一个 [`Event` 处理函数](/reference/react-dom/components/common#event-handler)。如果输入的内容在表单提交时未通过验证，则会触发此事件。与内置的 `invalid` 事件不同，React 的 `onInvalid` 事件可以进行冒泡。
* `onInvalidCapture`：与 `onInvalid` 类似，但是是在 [捕获阶段](/learn/responding-to-events#capture-phase-events) 触发的。
* [`required`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/select#required)：布尔值。如果为 `true`，则必须提供值才能提交表单。
* [`size`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/select#size)：数字。当指定 `multiple={true}` 时可选，表示同时可见的项目数。

#### 注意 {/*caveats*/}

- 与 HTML 不同，在 `<option>` 上传递 `selected` 属性将不受支持。你应该使用 [`<select defaultValue>`](#providing-an-initially-selected-option) 处理非受控选择框；而使用 [`<select value>`](#controlling-a-select-box-with-a-state-variable) 处理受控选择框。
- 如果选择框收到 `value` 属性，它将被视为 [受控组件](#controlling-a-select-box-with-a-state-variable)。
- 选择框不能同时受控与非受控。
- 选择框在其生命周期内无法在受控与非受控之间切换。
- 每个受控选择框都需要 `onChange` 事件处理程序，它会同步更新其后备值。

---

## 用法 {/*usage*/}

### 显示带有选项的选择框 {/*displaying-a-select-box-with-options*/}

渲染一个包含一系列 `<option>` 组件的 `<select>`，来展示一个选择框，并给每个 `<option>` 都设置一个 `value` 属性，表示要与表单一起提交的数据。

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      选择一个水果：
      <select name="精选水果">
        <option value="苹果">苹果</option>
        <option value="香蕉">香蕉</option>
        <option value="橘子">橘子</option>
      </select>
    </label>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>  

---

### 为选择框提供 label 属性 {/*providing-a-label-for-a-select-box*/}

一般而言，应该将每个 `<select>` 都放置在 [`<label>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/label) 内，表示此标签与该选择框相关联。当用户单击标签时，浏览器将自动聚焦选择框。这对于可访问性也非常重要：当用户聚焦选择框时，屏幕阅读器将宣布标签标题。

如果无法将 `<select>` 放置在 `<label>` 内，请通过将相同的 ID 传递给 `<select id>` 与 [`<label htmlFor>`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLLabelElement/htmlFor) 来将它们关联起来。为了避免一个组件的多实例之间的冲突，使用 [`useId`](/reference/react/useId) 生成这样的 ID。

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const vegetableSelectId = useId();
  return (
    <>
      <label>
        选择一个水果：
        <select name="精选水果">
          <option value="苹果">苹果</option>
          <option value="香蕉">香蕉</option>
          <option value="橘子">橘子</option>
        </select>
      </label>
      <hr />
      <label htmlFor={vegetableSelectId}>
        选择一种蔬菜：
      </label>
      <select id={vegetableSelectId} name="精选蔬菜">
        <option value="黄瓜">黄瓜</option>
        <option value="玉米">玉米</option>
        <option value="番茄">番茄</option>
      </select>
    </>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>


---

### 提供选项初始值 {/*providing-an-initially-selected-option*/}

默认情况下，浏览器将选择第一个 `<option>` 作为初始值。你可以将其他 `<option>` 的 `value` 作为 `defaultValue` 传递给 `<select>` 组件。

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      选择一个水果：
      <select name="精选水果" defaultValue="橘子">
        <option value="苹果">苹果</option>
        <option value="香蕉">香蕉</option>
        <option value="橘子">橘子</option>
      </select>
    </label>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>  

<Pitfall>

与 HTML 不同，在 `<option>` 上传递 `selected` 属性将不受支持。

</Pitfall>

---

### 支持多选 {/*enabling-multiple-selection*/}

你可以通过在 `<select>` 指定 `multiple={true}` 设置多选。如果这样做，那么你也应该向 `defaultValue` 传递一个字符串数组，以指定选中初始值。

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      选择一些水果
      <select
        name="精选水果"
        defaultValue={['橘子', '香蕉']}
        multiple={true}
      >
        <option value="苹果">苹果</option>
        <option value="香蕉">香蕉</option>
        <option value="橘子">橘子</option>
      </select>
    </label>
  );
}
```

```css
select { display: block; margin-top: 10px; width: 200px; }
```

</Sandpack>

---

### 提交表单时读取选择框的值 {/*reading-the-select-box-value-when-submitting-a-form*/}

在选择框周围添加一个包含 `<button type="submit">` 按钮的 `<form>` 组件。这将调用 `<form onSubmit>` 事件处理程序。默认情况下，浏览器将向当前 URL 发送表单数据并刷新页面。你可以通过调用 `e.preventDefault()` 取消此默认行为，并使用 `new FormData(e.target)` 读取表单数据。
<Sandpack>

```js
export default function EditPost() {
  function handleSubmit(e) {
    // 阻止浏览器重新加载页面
    e.preventDefault();
    // 读取表单数据
    const form = e.target;
    const formData = new FormData(form);
    // 你可以直接将 formData 作为 fetch 的请求 body：
    fetch('/some-api', { method: form.method, body: formData });
    // 你可以像浏览器默认的一样，将其转换为 URL：
    console.log(new URLSearchParams(formData).toString());
    // 也可以使用普通的对象：
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson); // （！）这并不包含多选值
    // 或者你可以使用 name 与 value 相匹配的数组对
    console.log([...formData.entries()]);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        选择你最喜欢的水果
        <select name="精选水果" defaultValue="橘子">
          <option value="苹果">苹果</option>
          <option value="香蕉">香蕉</option>
          <option value="橘子">橘子</option>
        </select>
      </label>
      <label>
        选择所有你最喜欢的蔬菜
        <select
          name="精选蔬菜"
          multiple={true}
          defaultValue={['玉米', '番茄']}
        >
          <option value="黄瓜">黄瓜</option>
          <option value="玉米">玉米</option>
          <option value="番茄">番茄</option>
        </select>
      </label>
      <hr />
      <button type="reset">重置</button>
      <button type="submit">提交</button>
    </form>
  );
}
```

```css
label, select { display: block; }
label { margin-bottom: 20px; }
```

</Sandpack>

<Note>

给 `<select>` 添加 `name` 属性，例如 `<select name="selectedFruit" />`。指定的 `name` 将作为表单数据中的一个键，例如 `{ selectedFruit: "orange" }`。

如果使用了 `<select multiple={true}>`，那么你从表单中读取的 [`FormData`](https://developer.mozilla.org/zh-CN/docs/Web/API/FormData) 将会将每个选择的选项作为单独 name 与 value 相匹配的键值对包含在内。仔细查看上面的示例中的控制台日志。

</Note>

<Pitfall>

默认情况下，`<form>` 内的任何 `<button>` 都可以提交表单。这可能会让人感到惊讶！如果你有自定义 `Button` 组件，请考虑使用 [`<button type="button">`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/input/button) 而不是 `<button>`。如果你想要明确指定提交表单的按钮，请使用 `<button type="submit">`。

</Pitfall>

---

### 使用 state 控制选择框 {/*controlling-a-select-box-with-a-state-variable*/}

像 `<select />` 这样的选择框是非受控的。即使你 [传递了初始值](#providing-an-initially-selected-option)，比如 `<select defaultValue="orange" />`，你的 JSX 也只是指定了初始值，而非当前时刻的值。

**如果要渲染一个受控选择框，请传递 `value` 属性**。React 将强制传递 `value` 属性给选择框。通常，你可以通过声明一个 [state](/reference/react/useState) 来控制选择框：

```js {2,6,7}
function FruitPicker() {
  const [selectedFruit, setSelectedFruit] = useState('orange'); // 声明一个 state 变量...
  // ...
  return (
    <select
      value={selectedFruit} // ...强制选择框的值与 state 相匹配...
      onChange={e => setSelectedFruit(e.target.value)} // ... 并在每次改变（change）时更新 state
    >
      <option value="苹果">苹果</option>
      <option value="香蕉">香蕉</option>
      <option value="橘子">橘子</option>
    </select>
  );
}
```

这将帮助你在每次选择时都触发重新渲染。

<Sandpack>

```js
import { useState } from 'react';

export default function FruitPicker() {
  const [selectedFruit, setSelectedFruit] = useState('orange');
  const [selectedVegs, setSelectedVegs] = useState(['corn', 'tomato']);
  return (
    <>
      <label>
        选择一个水果：
        <select
          value={selectedFruit}
          onChange={e => setSelectedFruit(e.target.value)}
        >
          <option value="苹果">苹果</option>
          <option value="香蕉">香蕉</option>
          <option value="橘子">橘子</option>
        </select>
      </label>
      <hr />
      <label>
        选择所有你喜欢的蔬菜：
        <select
          multiple={true}
          value={selectedVegs}
          onChange={e => {
            const options = [...e.target.selectedOptions];
            const values = options.map(option => option.value);
            setSelectedVegs(values);
          }}
        >
          <option value="黄瓜">黄瓜</option>
          <option value="玉米">玉米</option>
          <option value="番茄">番茄</option>
        </select>
      </label>
      <hr />
      <p>你最喜欢的水果：{selectedFruit}</p>
      <p>你最喜欢的蔬菜有：{selectedVegs.join('，')}</p>
    </>
  );
}
```

```css
select { margin-bottom: 10px; display: block; }
```

</Sandpack>

<Pitfall>

**如果传递了 `value` 但没有传递 `onChange`，那么将无法选择选项**。当你通过传递 `value` 来控制选择框时，你需要保证选择框始终具有你传递的值。因此，如果你将一个 state 作为 `value` 传递，但在 `onChange` 事件处理程序中忘记同步更新该状态变量，React 将在每次按键后将选择框恢复到你指定的 `value`。

与 HTML 不同，在 `<option>` 上传递 `selected` 属性将不受支持。

</Pitfall>
