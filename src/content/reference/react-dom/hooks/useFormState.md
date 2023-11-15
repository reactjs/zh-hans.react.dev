---
title: useFormState
canary: true
---

<Canary>

`useFormState` Hook 当前仅在 React Canary 与 experimental 渠道中可用。请点此了解更多关于 [React 发布渠道](/community/versioning-policy#all-release-channels) 的信息。此外，需要一款完全支持 [React 服务器组件](/reference/react/use-client) 特性的框架才可以使用 `useFormState` 的所有特性。

</Canary>

<Intro>

`useFormState` 是一个可以根据某个表单动作的结果更新 state 的 Hook。

```js
const [state, formAction] = useFormState(fn, initialState);
```

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `useFormState(action, initialState)` {/*useformstate*/}

{/* TODO T164397693: link to actions documentation once it exists */}

在组件的顶层调用 `useFormState` 即可创建一个随 [表单动作被调用](/reference/react-dom/components/form) 而更新的 state。在调用 `useFormState` 时在参数中传入现有的表单动作函数以及一个初始状态，它就会返回一个新的 action 函数和一个 form state 以供在 form 中使用。这个新的 form state 也会作为参数传入提供的表单动作函数。

```js
import { useFormState } from "react-dom";

async function increment(previousState, formData) {
  return previousState + 1;
}

function StatefulForm({}) {
  const [state, formAction] = useFormState(increment, 0);
  return (
    <form>
      {state}
      <button formAction={formAction}>+1</button>
    </form>
  )
}
```

form state 是一个只在表单被提交触发 action 后才会被更新的值。如果该表单没有被提交，该值会保持传入的初始值不变。

如果配合 Server Action 一起使用，`useFormState` 允许与表单交互的服务器的返回值在 hydration 完成前显示。

[请参阅下方更多示例](#usage)。

#### 参数 {/*parameters*/}

* `fn`：当按钮被按下或者表单被提交时触发的函数。当函数被调用时，该函数会接收到表单的上一个 state（初始值为传入的 `initialState` 参数，否则为上一次执行完该函数的结果）作为函数的第一个参数，余下参数为普通表单动作接到的参数。
* `initialState`：state 的初始值。任何可序列化的值都可接收。当 action 被调用一次后该参数会被忽略。

{/* TODO T164397693: link to serializable values docs once it exists */}

#### 返回值 {/*returns*/}

`useFormState` 返回一个包含两个值的数组：

1. 当前的 state。第一次渲染期间，该值为传入的 `initialState` 参数值。在 action 被调用后该值会变为 action 的返回值。
2. 一个新的 action 函数用于在你的 `form` 组件的 `action` 参数或表单中任意一个 `button` 组件的 `formAction` 参数中传递。

#### 注意 {/*caveats*/}

* 在支持 React 服务器组件的框架中使用该功能时，`useFormState` 允许表单在服务器渲染阶段时获得部分交互性。当不使用服务器组件时，它的特性与本地 state 相同。
* 与直接通过表单动作调用的函数不同，传入 `useFormState` 的函数被调用时，会多传入一个代表 state 的上一个值或初始值的参数作为该函数的第一个参数。

---

## 用法 {/*usage*/}

### 使用某个表单动作返回的信息 {/*using-information-returned-by-a-form-action*/}

在组件的顶层调用 `useFormState` 以获取上一次表单被提交时触发的 action 的返回值。

```js [[1, 5, "state"], [2, 5, "formAction"], [3, 5, "action"], [4, 5, "null"], [2, 8, "formAction"]]
import { useFormState } from 'react-dom';
import { action } from './actions.js';

function MyComponent() {
  const [state, formAction] = useFormState(action, null);
  // ...
  return (
    <form action={formAction}>
      {/* ... */}
    </form>
  );
}
```

`useFormState` 返回一个包含两个值的数组：

1. 该表单的 <CodeStep step={1}>当前 state</CodeStep>，初始值为提供的 <CodeStep step={4}>初始 state</CodeStep>，当表单被提交后则改为传入的 <CodeStep step={3}>action</CodeStep> 的返回值。
2. 传入 `<form>` 标签的 `action` 属性的 <CodeStep step={2}>新 action</CodeStep>。

表单被提交后，传入的 <CodeStep step={3}>action</CodeStep> 函数会被执行。返回值将会作为该表单的新的 <CodeStep step={1}>当前 state</CodeStep>。

传入的 <CodeStep step={3}>action</CodeStep> 接受到的第一个参数将会变为该表单的 <CodeStep step={1}>当前 state</CodeStep>。当表单第一次被提交时将会传入提供的 <CodeStep step={4}>初始 state</CodeStep>，之后都将传入上一次调用 <CodeStep step={3}>action</CodeStep> 函数的返回值。余下参数与未使用 `useFormState` 前接受的参数别无二致<sup><a href="#note1">[1]</a></sup>。

```js [[3, 1, "action"], [1, 1, "currentState"]]
function action(currentState, formData) {
  // ...
  return 'next state';
}
```

<Recipes titleText="提交表单后展示信息" titleId="display-information-after-submitting-a-form">

#### 展示表单错误 {/*display-form-errors*/}

将 action 包裹进 `useFormState` 即可展示诸如错误信息或 Server Action 返回的 toast 等信息。

<Sandpack>

```js App.js
import { useState } from "react";
import { useFormState } from "react-dom";
import { addToCart } from "./actions.js";

function AddToCartForm({itemID, itemTitle}) {
  const [message, formAction] = useFormState(addToCart, null);
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

```js actions.js
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

```css styles.css hidden
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

```js App.js
import { useState } from "react";
import { useFormState } from "react-dom";
import { addToCart } from "./actions.js";

function AddToCartForm({itemID, itemTitle}) {
  const [formState, formAction] = useFormState(addToCart, {});
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

```js actions.js
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

```css styles.css hidden
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

当使用 `useFormState` 包裹 action 时，第一个参数变为了 form 的当前 state，提交的表单数据被顺移到了第二个参数中，与直接使用表单动作是不同的。

```js
function action(currentState, formData) {
  // ...
}
```

**译注：**

<a name="note1"></a> [1] 这里的意思是原来的第一个参数被顺移为第二个参数，第二个参数被顺移为第三个参数，以此类推
