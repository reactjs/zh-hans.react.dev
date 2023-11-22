---
title: useFormStatus
canary: true
---

<Canary>

`useFormStatus` Hook 目前仅在 React Canary 与 experimental 渠道中可用。在此处了解更多关于 [React 发布渠道](/community/versioning-policy#all-release-channels) 的信息。

</Canary>

<Intro>

`useFormStatus` 是一个提供上次表单提交状态信息的 Hook。

```js
const { pending, data, method, action } = useFormStatus();
```

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `useFormStatus()` {/*use-form-status*/}

`useFormStatus` Hook 提供了上次表单提交的状态信息。

```js {5},[[1, 6, "status.pending"]]
import { useFormStatus } from "react-dom";
import action from './actions';

function Submit() {
  const status = useFormStatus();
  return <button disabled={status.pending}>提交</button>
}

export default function App() {
  return (
    <form action={action}>
      <Submit />
    </form>
  );
}
```

`Submit` 组件必须在 `<form>` 内部渲染以获取状态信息。该 Hook 返回诸如 <CodeStep step={1}>`pending`</CodeStep> 属性的信息，用于指示表单是否正在提交中。

在上面的示例中，`Submit` 利用此信息来在表单提交时禁用 `<button>` 按钮的按压操作。

[参见下方更多示例](#usage)。

#### 参数 {/*parameters*/}

`useFormStatus` 不接收任何参数。

#### 返回值 {/*returns*/}

`useFormStatus` 返回一个包含以下属性的 `status` 对象：

* `pending`：布尔值。如果为 `true`，则表示父级 `<form>` 正在等待提交；否则为 `false`。

* `data`：实现了 [`FormData interface`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) 的对象，包含父级 `<form>` 正在提交的数据；如果没有进行提交或没有父级 `<form>`，它将为 `null`。

* `method`：字符串，可以是 `'get'` 或 `'post'`。表示父级 `<form>` 使用 `GET` 或 `POST` [HTTP 方法](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) 进行提交。默认情况下，`<form>` 将使用 `GET` 方法，并可以通过 [`method`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#method) 属性指定。

[//]: # (链接到 `<form>` 文档。"在 `<form>` 上的 `action` 属性上阅读更多信息。")
* `action`：一个传递给父级 `<form>` 的 `action` 属性的函数引用。如果没有父级 `<form>`，则该属性为 `null`。如果在 `action` 属性上提供了 URI 值，或者未指定 `action` 属性，`status.action` 将为 `null`。

#### 注意 {/*caveats*/}

* `useFormStatus` Hook 必须从在 `<form>` 内渲染的组件中调用。
* `useFormStatus` 仅会返回父级 `<form>` 的状态信息。它不会返回同一组件或子组件中渲染的任何 `<form>` 的状态信息。

---

## 用法 {/*usage*/}

### 在表单提交期间显示待定状态 {/*display-a-pending-state-during-form-submission*/}
可以在 `<form>` 中渲染的子组件中调用 `useFormStatus` Hook，并读取返回的 `pending` 属性，以在表单提交期间显示待定状态。

下面的示例使用 `pending` 属性指示表单正在提交。

<Sandpack>

```js App.js
import { useFormStatus } from "react-dom";
import { submitForm } from "./actions.js";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "提交中……" : "提交"}
    </button>
  );
}

function Form({ action }) {
  return (
    <form action={action}>
      <Submit />
    </form>
  );
}

export default function App() {
  return <Form action={submitForm} />;
}
```

```js actions.js hidden
export async function submitForm(query) {
    await new Promise((res) => setTimeout(res, 1000));
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```
</Sandpack>  

<Pitfall>

##### `useFormStatus` 不会返回在同一组件中渲染的 `<form>` 的状态信息 {/*useformstatus-will-not-return-status-information-for-a-form-rendered-in-the-same-component*/}

`useFormStatus` Hook 只会返回父级 `<form>` 的状态信息，而不会返回在调用 Hook 的同一组件中渲染的任何 `<form>` 的状态信息，也不会返回子组件的状态信息。

```js
function Form() {
  // 🚩 `pending` 永远不会为 true
  // useFormStatus 不会跟踪在此组件中渲染的表单
  const { pending } = useFormStatus();
  return <form action={submit}></form>;
}
```

正确的做法是从位于 `<form>` 内部的组件中调用 `useFormStatus`。

```js
function Submit() {
  // ✅ `pending` 将从包裹 Submit 组件的表单派生
  const { pending } = useFormStatus(); 
  return <button disabled={pending}>...</button>;
}

function Form() {
  // <form> `useFormStatus` 将会追踪它
  return (
    <form action={submit}>
      <Submit />
    </form>
  );
}
```

</Pitfall>

### 查看正在提交的表单数据 {/*read-form-data-being-submitted*/}

可以使用从 `useFormStatus` 返回的状态信息中的 `data` 属性来显示用户正在提交的数据是什么。

下面的示例中有一个表单，用户可以请求一个用户名。那么可以使用 `useFormStatus` 来显示一个临时状态消息，确认请求了什么用户名。

<Sandpack>

```js UsernameForm.js active
import {useState, useMemo, useRef} from 'react';
import {useFormStatus} from 'react-dom';

export default function UsernameForm() {
  const {pending, data} = useFormStatus();

  const [showSubmitted, setShowSubmitted] = useState(false);
  const submittedUsername = useRef(null);
  const timeoutId = useRef(null);

  useMemo(() => {
    if (pending) {
      submittedUsername.current = data?.get('username');
      if (timeoutId.current != null) {
        clearTimeout(timeoutId.current);
      }

      timeoutId.current = setTimeout(() => {
        timeoutId.current = null;
        setShowSubmitted(false);
      }, 2000);
      setShowSubmitted(true);
    }
  }, [pending, data]);

  return (
    <>
      <label>请求用户名：</label><br />
      <input type="text" name="username" />
      <button type="submit" disabled={pending}>
        {pending ? '提交中……' : '提交'}
      </button>
      {showSubmitted ? (
        <p>提交请求用户名：{submittedUsername.current}</p>
      ) : null}
    </>
  );
}
```

```js App.js
import UsernameForm from './UsernameForm';
import { submitForm } from "./actions.js";

export default function App() {
  return (
    <form action={submitForm}>
      <UsernameForm />
    </form>
  );
}
```

```js actions.js hidden
export async function submitForm(query) {
    await new Promise((res) => setTimeout(res, 1000));
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```
</Sandpack>  

---

## 疑难解答 {/*troubleshooting*/}

### `status.pending` 从不为 `true` {/*pending-is-never-true*/}

`useFormStatus` 仅会返回父级 `<form>` 的状态信息。

如果调用 `useFormStatus` 的组件未嵌套在 `<form>` 中，`status.pending` 总是返回 `false`。请验证 `useFormStatus` 是否在 `<form>` 元素的子组件中调用。

`useFormStatus` 不会追踪同一组件中渲染的 `<form>` 的状态。参阅 [陷阱](#useformstatus-will-not-return-status-information-for-a-form-rendered-in-the-same-component) 以了解更多详细信息。
