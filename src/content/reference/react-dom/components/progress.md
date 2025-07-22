---
title: "<progress>"
---

<Intro>

[浏览器内置的 `<progress>` 组件](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/progress) 允许你渲染一个进度指示器。

```js
<progress value={0.5} />
```

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `<progress>` {/*progress*/}

使用 [浏览器内置的 `<progress>` 组件](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/progress) 渲染一个进度指示器。

```js
<progress value={0.5} />
```

[参见下面更多示例](#usage)。

#### 参数 {/*props*/}

`<progress>` 支持所有 [常见的元素属性](/reference/react-dom/components/common#common-props)。

除此之外，`<progress>` 还支持以下属性：

- [`max`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/progress#attr-max)：一个数字，表示指定的最大 `value`。默认值为 `1`。
- [`value`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/progress#value)：一个介于 `0` 至 `max` 之间的数字。如果不确定具体的进度，那么该值可以为 `null`。`value` 表示完成了多少进度。

---

## 用法 {/*usage*/}

### 控制进度指示器 {/*controlling-a-progress-indicator*/}

使用 `<progress>` 组件渲染进度指示器。你可以传递一个介于 `0` 和指定的 `max` 值之间的数字 `value`。如果不传递 `max` 参数，那么 `max` 默认值为 `1`。

如果相关操作未持续进行，请传递 `value={null}` 将进度指示器设置为不确定状态。

<Sandpack>

```js
export default function App() {
  return (
    <>
      <progress value={0} />
      <progress value={0.5} />
      <progress value={0.7} />
      <progress value={75} max={100} />
      <progress value={1} />
      <progress value={null} />
    </>
  );
}
```

```css
progress { display: block; }
```

</Sandpack>
