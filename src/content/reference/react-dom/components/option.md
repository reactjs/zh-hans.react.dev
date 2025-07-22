---
title: "<option>"
---

<Intro>

[浏览器内置的 `<option>` 组件](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/option) 允许你渲染 [`<select>`](/reference/react-dom/components/select) 组件的选项（option）。

```js
<select>
  <option value="someOption">Some option</option>
  <option value="otherOption">Other option</option>
</select>
```

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `<option>` {/*option*/}

[浏览器内置的 `<option>` 组件](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/option) 允许你渲染 [`<select>`](/reference/react-dom/components/select) 组件的选项（option）。

```js
<select>
  <option value="someOption">Some option</option>
  <option value="otherOption">Other option</option>
</select>
```

[参见下面更多示例](#usage)。

#### Props {/*props*/}

`<option>` 支持所有 [常见的元素属性](/reference/react-dom/components/common#common-props)。

除此之外，`<option>` 还支持以下属性：

* [`disabled`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/option#disabled)：布尔值。如果 `disabled` 为 `true`，该选项（option）将会被选中，并将展示为暗淡状态（dimmed）。
* [`label`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/option#label)：字符串。指定选项的含义。如果未指定，则使用选项内部的文本。
* [`value`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/option#value)：如果选择了此选项，则在提交表单时将使用此选项的 `value` 值作为父级 `<select>` 的值。详细信息请参阅 [在提交表单时读取 `<select>` 值](/reference/react-dom/components/select#reading-the-select-box-value-when-submitting-a-form)。

#### 注意 {/*caveats*/}

* React 不支持在 `<option>` 上使用 `selected` 属性。相反，对于非受控选择框，请将此选项的 `value` 属性传递给父级 [`<select defaultValue>`](/reference/react-dom/components/select#providing-an-initially-selected-option)；对于受控选择框，请使用 [`<select value>`](/reference/react-dom/components/select#controlling-a-select-box-with-a-state-variable) 来控制选择框的值。

---

## 用法 {/*usage*/}

### 显示带有选项的选择框 {/*displaying-a-select-box-with-options*/}

渲染一个包含一系列 `<option>` 组件的 `<select>`，来展示一个选择框，并给每个 `<option>` 都设置一个 `value` 属性，表示要与表单一起提交的数据。

在这里了解更多关于 [如何展示一个包含一系列 `<option>` 组件的 `<select>`](/reference/react-dom/components/select) 的信息。

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

