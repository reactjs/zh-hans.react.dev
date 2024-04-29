---
title: useActionState
canary: true
---

<Canary>

<<<<<<< HEAD:src/content/reference/react-dom/hooks/useFormState.md
`useFormState` Hook 当前仅在 React Canary 与 experimental 渠道中可用。请点此了解更多关于 [React 发布渠道](/community/versioning-policy#all-release-channels) 的信息。此外，需要一款完全支持 [React 服务器组件](/reference/react/use-client) 特性的框架才可以使用 `useFormState` 的所有特性。
=======
The `useActionState` Hook is currently only available in React's Canary and experimental channels. Learn more about [release channels here](/community/versioning-policy#all-release-channels). In addition, you need to use a framework that supports [React Server Components](/reference/rsc/use-client) to get the full benefit of `useActionState`.
>>>>>>> 9c53b48a92008f5030815137380d86bbb0a198d8:src/content/reference/react/useActionState.md

</Canary>

<Note>

In earlier React Canary versions, this API was part of React DOM and called `useFormState`.

</Note>

<Intro>

<<<<<<< HEAD:src/content/reference/react-dom/hooks/useFormState.md
`useFormState` 是一个可以根据某个表单动作的结果更新 state 的 Hook。
=======
`useActionState` is a Hook that allows you to update state based on the result of a form action.
>>>>>>> 9c53b48a92008f5030815137380d86bbb0a198d8:src/content/reference/react/useActionState.md

```js
const [state, formAction] = useActionState(fn, initialState, permalink?);
```

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `useActionState(action, initialState, permalink?)` {/*useactionstate*/}

{/* TODO T164397693: link to actions documentation once it exists */}

<<<<<<< HEAD:src/content/reference/react-dom/hooks/useFormState.md
在组件的顶层调用 `useFormState` 即可创建一个随 [表单动作被调用](/reference/react-dom/components/form) 而更新的 state。在调用 `useFormState` 时在参数中传入现有的表单动作函数以及一个初始状态，它就会返回一个新的 action 函数和一个 form state 以供在 form 中使用。这个新的 form state 也会作为参数传入提供的表单动作函数。
=======
Call `useActionState` at the top level of your component to create component state that is updated [when a form action is invoked](/reference/react-dom/components/form). You pass `useActionState` an existing form action function as well as an initial state, and it returns a new action that you use in your form, along with the latest form state. The latest form state is also passed to the function that you provided.
>>>>>>> 9c53b48a92008f5030815137380d86bbb0a198d8:src/content/reference/react/useActionState.md

```js
import { useActionState } from "react";

async function increment(previousState, formData) {
  return previousState + 1;
}

function StatefulForm({}) {
  const [state, formAction] = useActionState(increment, 0);
  return (
    <form>
      {state}
      <button formAction={formAction}>+1</button>
    </form>
  )
}
```

form state 是一个只在表单被提交触发 action 后才会被更新的值。如果该表单没有被提交，该值会保持传入的初始值不变。

<<<<<<< HEAD:src/content/reference/react-dom/hooks/useFormState.md
如果配合 Server Action 一起使用，`useFormState` 允许与表单交互的服务器的返回值在 hydration 完成前显示。
=======
If used with a Server Action, `useActionState` allows the server's response from submitting the form to be shown even before hydration has completed.
>>>>>>> 9c53b48a92008f5030815137380d86bbb0a198d8:src/content/reference/react/useActionState.md

[请参阅下方更多示例](#usage)。

<<<<<<< HEAD:src/content/reference/react-dom/hooks/useFormState.md
#### 参数 {/*parameters*/}
=======
#### Parameters {/*parameters*/}

* `fn`: The function to be called when the form is submitted or button pressed. When the function is called, it will receive the previous state of the form (initially the `initialState` that you pass, subsequently its previous return value) as its initial argument, followed by the arguments that a form action normally receives.
* `initialState`: The value you want the state to be initially. It can be any serializable value. This argument is ignored after the action is first invoked.
* **optional** `permalink`: A string containing the unique page URL that this form modifies. For use on pages with dynamic content (eg: feeds) in conjunction with progressive enhancement: if `fn` is a [server action](/reference/rsc/use-server) and the form is submitted before the JavaScript bundle loads, the browser will navigate to the specified permalink URL, rather than the current page's URL. Ensure that the same form component is rendered on the destination page (including the same action `fn` and `permalink`) so that React knows how to pass the state through. Once the form has been hydrated, this parameter has no effect.
>>>>>>> 9c53b48a92008f5030815137380d86bbb0a198d8:src/content/reference/react/useActionState.md

* `fn`：当按钮被按下或者表单被提交时触发的函数。当函数被调用时，该函数会接收到表单的上一个 state（初始值为传入的 `initialState` 参数，否则为上一次执行完该函数的结果）作为函数的第一个参数，余下参数为普通表单动作接到的参数。
* `initialState`：state 的初始值。任何可序列化的值都可接收。当 action 被调用一次后该参数会被忽略。
* **可选** `permalink`: A string containing the unique page URL that this form modifies. For use on pages with dynamic content (eg: feeds) in conjunction with progressive enhancement: if `fn` is a [server action](/reference/react/use-server) and the form is submitted before the JavaScript bundle loads, the browser will navigate to the specified permalink URL, rather than the current page's URL. Ensure that the same form component is rendered on the destination page (including the same action `fn` and `permalink`) so that React knows how to pass the state through. Once the form has been hydrated, this parameter has no effect.
{/* TODO T164397693: link to serializable values docs once it exists */}

#### 返回值 {/*returns*/}

<<<<<<< HEAD:src/content/reference/react-dom/hooks/useFormState.md
`useFormState` 返回一个包含两个值的数组：
=======
`useActionState` returns an array with exactly two values:
>>>>>>> 9c53b48a92008f5030815137380d86bbb0a198d8:src/content/reference/react/useActionState.md

1. 当前的 state。第一次渲染期间，该值为传入的 `initialState` 参数值。在 action 被调用后该值会变为 action 的返回值。
2. 一个新的 action 函数用于在你的 `form` 组件的 `action` 参数或表单中任意一个 `button` 组件的 `formAction` 参数中传递。

#### 注意 {/*caveats*/}

<<<<<<< HEAD:src/content/reference/react-dom/hooks/useFormState.md
* 在支持 React 服务器组件的框架中使用该功能时，`useFormState` 允许表单在服务器渲染阶段时获得部分交互性。当不使用服务器组件时，它的特性与本地 state 相同。
* 与直接通过表单动作调用的函数不同，传入 `useFormState` 的函数被调用时，会多传入一个代表 state 的上一个值或初始值的参数作为该函数的第一个参数。
=======
* When used with a framework that supports React Server Components, `useActionState` lets you make forms interactive before JavaScript has executed on the client. When used without Server Components, it is equivalent to component local state.
* The function passed to `useActionState` receives an extra argument, the previous or initial state, as its first argument. This makes its signature different than if it were used directly as a form action without using `useActionState`.
>>>>>>> 9c53b48a92008f5030815137380d86bbb0a198d8:src/content/reference/react/useActionState.md

---

## 用法 {/*usage*/}

### 使用某个表单动作返回的信息 {/*using-information-returned-by-a-form-action*/}

<<<<<<< HEAD:src/content/reference/react-dom/hooks/useFormState.md
在组件的顶层调用 `useFormState` 以获取上一次表单被提交时触发的 action 的返回值。
=======
Call `useActionState` at the top level of your component to access the return value of an action from the last time a form was submitted.
>>>>>>> 9c53b48a92008f5030815137380d86bbb0a198d8:src/content/reference/react/useActionState.md

```js [[1, 5, "state"], [2, 5, "formAction"], [3, 5, "action"], [4, 5, "null"], [2, 8, "formAction"]]
import { useActionState } from 'react';
import { action } from './actions.js';

function MyComponent() {
  const [state, formAction] = useActionState(action, null);
  // ...
  return (
    <form action={formAction}>
      {/* ... */}
    </form>
  );
}
```

<<<<<<< HEAD:src/content/reference/react-dom/hooks/useFormState.md
`useFormState` 返回一个包含两个值的数组：
=======
`useActionState` returns an array with exactly two items:
>>>>>>> 9c53b48a92008f5030815137380d86bbb0a198d8:src/content/reference/react/useActionState.md

1. 该表单的 <CodeStep step={1}>当前 state</CodeStep>，初始值为提供的 <CodeStep step={4}>初始 state</CodeStep>，当表单被提交后则改为传入的 <CodeStep step={3}>action</CodeStep> 的返回值。
2. 传入 `<form>` 标签的 `action` 属性的 <CodeStep step={2}>新 action</CodeStep>。

表单被提交后，传入的 <CodeStep step={3}>action</CodeStep> 函数会被执行。返回值将会作为该表单的新的 <CodeStep step={1}>当前 state</CodeStep>。

<<<<<<< HEAD:src/content/reference/react-dom/hooks/useFormState.md
传入的 <CodeStep step={3}>action</CodeStep> 接受到的第一个参数将会变为该表单的 <CodeStep step={1}>当前 state</CodeStep>。当表单第一次被提交时将会传入提供的 <CodeStep step={4}>初始 state</CodeStep>，之后都将传入上一次调用 <CodeStep step={3}>action</CodeStep> 函数的返回值。余下参数与未使用 `useFormState` 前接受的参数别无二致<sup><a href="#note1">[1]</a></sup>。
=======
The <CodeStep step={3}>action</CodeStep> that you provide will also receive a new first argument, namely the <CodeStep step={1}>current state</CodeStep> of the form. The first time the form is submitted, this will be the <CodeStep step={4}>initial state</CodeStep> you provided, while with subsequent submissions, it will be the return value from the last time the action was called. The rest of the arguments are the same as if `useActionState` had not been used.
>>>>>>> 9c53b48a92008f5030815137380d86bbb0a198d8:src/content/reference/react/useActionState.md

```js [[3, 1, "action"], [1, 1, "currentState"]]
function action(currentState, formData) {
  // ...
  return 'next state';
}
```

<Recipes titleText="提交表单后展示信息" titleId="display-information-after-submitting-a-form">

#### 展示表单错误 {/*display-form-errors*/}

<<<<<<< HEAD:src/content/reference/react-dom/hooks/useFormState.md
将 action 包裹进 `useFormState` 即可展示诸如错误信息或 Server Action 返回的 toast 等信息。
=======
To display messages such as an error message or toast that's returned by a Server Action, wrap the action in a call to `useActionState`.
>>>>>>> 9c53b48a92008f5030815137380d86bbb0a198d8:src/content/reference/react/useActionState.md

<Sandpack>

```js src/App.js
import { useActionState, useState } from "react";
import { addToCart } from "./actions.js";

function AddToCartForm({itemID, itemTitle}) {
  const [message, formAction] = useActionState(addToCart, null);
  return (
    <form action={formAction}>
      <h2>{itemTitle}</h2>
      <input type="hidden" name="itemID" value={itemID} />
      <button type="submit">加入购物车</button>
      {message}
    </form>
  );
}

export default function App() {
  return (
    <>
      <AddToCartForm itemID="1" itemTitle="JavaScript：权威指南" />
      <AddToCartForm itemID="2" itemTitle="JavaScript：优点荟萃" />
    </>
  )
}
```

```js src/actions.js
"use server";

export async function addToCart(prevState, queryData) {
  const itemID = queryData.get('itemID');
  if (itemID === "1") {
    return "已加入购物车";
  } else {
    return "无法加入购物车：商品已售罄";
  }
}
```

```css src/styles.css hidden
form {
  border: solid 1px black;
  margin-bottom: 24px;
  padding: 12px
}

form button {
  margin-right: 12px;
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

<Solution />

#### 提交表单后展示结构性数据 {/*display-structured-information-after-submitting-a-form*/}

Server Actions 的返回值可以为任意可序列化的值。例如，可以返回一个实例，该实例携带一个 boolean 类型的属性表示操作是否成功，同时附带错误信息或更新消息。

<Sandpack>

```js src/App.js
import { useActionState, useState } from "react";
import { addToCart } from "./actions.js";

function AddToCartForm({itemID, itemTitle}) {
  const [formState, formAction] = useActionState(addToCart, {});
  return (
    <form action={formAction}>
      <h2>{itemTitle}</h2>
      <input type="hidden" name="itemID" value={itemID} />
      <button type="submit">加入购物车</button>
      {formState?.success &&
        <div className="toast">
          成功加入购物车！当前购物车中共有 {formState.cartSize} 件商品。
        </div>
      }
      {formState?.success === false &&
        <div className="error">
          加入购物车失败：{formState.message}
        </div>
      }
    </form>
  );
}

export default function App() {
  return (
    <>
      <AddToCartForm itemID="1" itemTitle="JavaScript：权威指南" />
      <AddToCartForm itemID="2" itemTitle="JavaScript：优点荟萃" />
    </>
  )
}
```

```js src/actions.js
"use server";

export async function addToCart(prevState, queryData) {
  const itemID = queryData.get('itemID');
  if (itemID === "1") {
    return {
      success: true,
      cartSize: 12,
    };
  } else {
    return {
      success: false,
      message: "商品已售罄",
    };
  }
}
```

```css src/styles.css hidden
form {
  border: solid 1px black;
  margin-bottom: 24px;
  padding: 12px
}

form button {
  margin-right: 12px;
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

<Solution />

</Recipes>

## 疑难解答 {/*troubleshooting*/}

### 我的 action 无法再获取提交的 form data 了 {/*my-action-can-no-longer-read-the-submitted-form-data*/}

<<<<<<< HEAD:src/content/reference/react-dom/hooks/useFormState.md
当使用 `useFormState` 包裹 action 时，第一个参数变为了 form 的当前 state，提交的表单数据被顺移到了第二个参数中，与直接使用表单动作是不同的。
=======
When you wrap an action with `useActionState`, it gets an extra argument *as its first argument*. The submitted form data is therefore its *second* argument instead of its first as it would usually be. The new first argument that gets added is the current state of the form.
>>>>>>> 9c53b48a92008f5030815137380d86bbb0a198d8:src/content/reference/react/useActionState.md

```js
function action(currentState, formData) {
  // ...
}
```

**译注：**

<a name="note1"></a> [1] 这里的意思是原来的第一个参数被顺移为第二个参数，第二个参数被顺移为第三个参数，以此类推
