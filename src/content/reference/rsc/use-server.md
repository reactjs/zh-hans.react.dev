---
title: "'use server'"
titleForTitleTag: "'use server' 指示符"
---

<RSC>

`'use server'` 用于 [React 服务器组件](/reference/rsc/server-components)。

</RSC>


<Intro>

`'use server'` 标记可以从客户端代码调用的服务器函数。

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `'use server'` {/*use-server*/}

在异步函数顶部添加 `'use server'` 以将该函数标记为可由客户端调用。我们将这些函数称为 **[服务器函数](/reference/rsc/server-functions)**。

```js {2}
async function addToCart(data) {
  'use server';
  // ...
}
```

在客户端调用服务器函数时，它将向服务器发出网络请求，其中包含传递的任何参数的序列化副本。如果服务器函数返回一个值，该值将被序列化并返回给客户端。

可以将 `'use server'` 指示符添加到文件顶部来代替逐个在函数中添加它。位于文件顶部的指示符会将所有导出都标记为可在任何地方使用的服务器函数，包括在客户端代码中导入。

#### 注意 {/*caveats*/}
* `'use server'` 必须位于函数或模块的顶部，在任何导入或其他代码之前（可以位于代码顶部的注释之后）。它们必须用单引号或双引号编写，但不能用反引号。
* `'use server'` 只能在服务器端文件中使用。生成的服务器函数可以通过 props 传递给客户端组件。请参阅支持的 [序列化参数和返回值类型](#serializable-parameters-and-return-values)。
* 要从 [客户端代码](/reference/react/use-client) 导入服务器函数，必须在模块级别使用该指示符。
* 由于底层网络调用始终是异步的，`'use server'` 只能用于异步函数。
* 始终将服务器函数的参数视为不受信任的输入，并授权任何变更。请参阅 [安全考虑](#security)。
* 应在 [transition](/reference/react/useTransition) 中调用服务器函数。传递给 [`<form action>`](/reference/react-dom/components/form#props) 或 [`formAction`](/reference/react-dom/components/input#props) 的服务器函数将自动在 Transition 中被调用。
* 服务器函数专为更新服务器端状态的变更而设计，不建议用于数据获取。因此，实现服务器函数的框架通常一次只处理一个 Action，没有缓存返回值的方式。

### 安全考虑 {/*security*/}

服务器函数的参数完全由客户端控制。出于安全考虑，始终将它们视为不受信任的输入，并确保根据需要验证和转义参数。

在任何服务器函数中，请确保验证已登录的用户是否被允许执行该操作。

<Wip>

为防止从服务器函数中发送敏感数据，提供了实验性的污染 API 用于阻止唯一值和对象传递到客户端代码。

请参阅 [experimental_taintUniqueValue](/reference/react/experimental_taintUniqueValue) 与 [experimental_taintObjectReference](/reference/react/experimental_taintObjectReference) 以了解更多。

</Wip>

### 可序列化参数和返回值 {/*serializable-parameters-and-return-values*/}

当客户端代码通过网络调用服务器函数时，传递的任何参数都必须是可序列化的。

以下是服务器函数参数支持的类型：

* 原始类型
	* [string](https://developer.mozilla.org/zh-CN/docs/Glossary/String)
	* [number](https://developer.mozilla.org/zh-CN/docs/Glossary/Number)
	* [bigint](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
	* [boolean](https://developer.mozilla.org/zh-CN/docs/Glossary/Boolean)
	* [undefined](https://developer.mozilla.org/zh-CN/docs/Glossary/Undefined)
	* [null](https://developer.mozilla.org/zh-CN/docs/Glossary/Null)
	* [symbol](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol)，仅包含在全局符号注册表中使用 [`Symbol.for`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for) 注册的符号。
* 包含可序列化值的迭代类型
	* [String](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String)
	* [Array](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array)
	* [Map](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map)
	* [Set](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Set)
	* [TypedArray](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 与 [ArrayBuffer](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
* [Date](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date)
* [FormData](https://developer.mozilla.org/zh-CN/docs/Web/API/FormData) 实例
* 普通 [对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object)：使用 [对象初始化器](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Object_initializer) 创建的、具有可序列化属性
* 充当服务器函数的函数
* [Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)

值得注意的是，以下内容不受支持：
* React 元素或 [JSX](/learn/writing-markup-with-jsx)
* 函数，包括组件函数和其他并非 Server Action 的函数
* [类](https://developer.mozilla.org/zh-CN/docs/Learn/JavaScript/Objects/Classes_in_JavaScript)
* 任何类的实例对象（除了提到的内置类）或 [使用 null 作为原型](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object#null-prototype_objects) 的对象
* 未全局注册的符号，例如 `Symbol('my new symbol')`
* 来自事件处理程序的事件


支持的可序列化返回值与边界客户端组件的 [可序列化 props](/reference/rsc/use-client#serializable-types) 相同。


## 用法 {/*usage*/}

### 表格中的服务器函数 {/*server-actions-in-forms*/}

服务器函数的最常见用法将是调用会更改数据的函数。在浏览器中，[HTML form 元素](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) 是用户提交变更的传统方法。通过 React 服务器组件，React 在 [表单](/reference/react-dom/components/form) 中首次引入了对服务器函数的一流支持。

以下是一个允许用户请求用户名的表单。

```js [[1, 3, "formData"]]
// App.js

async function requestUsername(formData) {
  'use server';
  const username = formData.get('username');
  // ...
}

export default function App() {
  return (
    <form action={requestUsername}>
      <input type="text" name="username" />
      <button type="submit">Request</button>
    </form>
  );
}
```

在这个示例中，`requestUsername` 是一个传递给 `<form>` 的服务器函数。当用户提交此表单时，会发起一个网络请求到服务器函数 `requestUsername`。在调用表单中的服务器函数时，React 将 `FormData` 作为第一个参数提供给服务器函数。

通过将服务器函数传递给表单的 `action`，React 可以 [逐步增强](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement) 表单。这意味着表单可以在 JavaScript 捆绑加载之前提交。

#### 处理表单中的返回值 {/*handling-return-values*/}

在用户名请求表单中，可能存在用户名不可用的情况。`requestUsername` 应该告诉我们它是否失败。

请使用 [`useActionState`](/reference/react/useActionState) 以根据服务器函数的结果更新 UI 并支持逐步增强。

```js
// requestUsername.js
'use server';

export default async function requestUsername(formData) {
  const username = formData.get('username');
  if (canRequest(username)) {
    // ...
    return 'successful';
  }
  return 'failed';
}
```

```js {4,8}, [[2, 2, "'use client'"]]
// UsernameForm.js
'use client';

import { useActionState } from 'react';
import requestUsername from './requestUsername';

function UsernameForm() {
  const [state, action] = useActionState(requestUsername, null, 'n/a');

  return (
    <>
      <form action={action}>
        <input type="text" name="username" />
        <button type="submit">请求</button>
      </form>
      <p>最后一次提交的请求的返回值： {returnValue}</p>
    </>
  );
}
```

请注意，与大多数 Hook 一样，`useActionState` 只能在 <CodeStep step={1}>[客户端代码](/reference/react/use-client)</CodeStep> 中调用。

### 在 `<form>` 之外调用服务器函数 {/*calling-a-server-action-outside-of-form*/}

Server Action 是暴露的服务器端点，可以在客户端代码的任何位置调用。

在 `<form>` 之外使用服务器函数时请使用 [transition](/reference/react/useTransition)，这允许显示加载指示器、显示 [乐观状态更新](/reference/react/useOptimistic) 和处理意外错误。表单会自动在 Transition 中包装服务器函数。

```js {9-12}
import incrementLike from './actions';
import { useState, useTransition } from 'react';

function LikeButton() {
  const [isPending, startTransition] = useTransition();
  const [likeCount, setLikeCount] = useState(0);

  const onClick = () => {
    startTransition(async () => {
      const currentCount = await incrementLike();
      setLikeCount(currentCount);
    });
  };

  return (
    <>
      <p>点赞数量： {likeCount}</p>
      <button onClick={onClick} disabled={isPending}>点赞</button>;
    </>
  );
}
```

```js
// actions.js
'use server';

let likeCount = 0;
export default async function incrementLike() {
  likeCount++;
  return likeCount;
}
```

可以使用 `await` 获取 Promise 的返回值以读取服务器函数的返回值。
