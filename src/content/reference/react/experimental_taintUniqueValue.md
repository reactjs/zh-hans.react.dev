---
title: experimental_taintUniqueValue
version: experimental
---

<Experimental>

**此实验性 API 尚未在 React 的稳定版本中提供**。

可以尝试升级 React 包到最新的实验版本：

- `react@experimental`
- `react-dom@experimental`
- `eslint-plugin-react-hooks@experimental`

React 的实验版本可能有一些问题，请勿在生产环境中使用。

此 API 仅在 [React 服务器组件](/reference/rsc/use-client) 内可用。

</Experimental>


<Intro>

`taintUniqueValue` 允许防止将唯一值传递给客户端组件，例如密码、密钥或令牌。

```js
taintUniqueValue(errMessage, lifetime, value)
```

参阅 [`taintObjectReference`](/reference/react/experimental_taintObjectReference) 以了解更多关于防止传递包含敏感数据的对象的更多信息。

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `taintUniqueValue(message, lifetime, value)` {/*taintuniquevalue*/}

调用 `taintUniqueValue` 并传递密码、令牌、密钥或哈希作为参数，然后将其注册到 React 中，并标记为不允许直接传递给客户端的内容：

```js
import {experimental_taintUniqueValue} from 'react';

experimental_taintUniqueValue(
  'Do not pass secret keys to the client.',
  process,
  process.env.SECRET_KEY
);
```

[参见下方更多示例](#usage)。

#### 参数 {/*parameters*/}

* `message`：`value` 被传递给客户端组件时显示的消息。如果将 `value` 传递给客户端组件，此消息将作为错误的一部分显示。

* `lifetime`：指示 `value` 应该被污染多长时间的任何对象。只要此对象仍然存在，将阻止把 `value` 发送到任何客户端组件。例如，传递 `globalThis` 将在应用程序的生命周期内阻止该值的传递。`lifetime` 通常是一个包含 `value` 属性的对象。

* `value`：字符串、bigint 或 TypedArray。`value` 必须是具有高熵的字符或字节的唯一序列，例如加密令牌、私钥、哈希值或长密码。`value` 将被阻止发送到任何客户端组件。

#### 返回 {/*returns*/}

`experimental_taintUniqueValue` 返回 `undefined`。

#### 注意 {/*caveats*/}

* 从被污染的值派生新值可能会破坏污点标记保护。通过将被污染的值大写、将被污染的字符串值连接成较大的字符串、将被污染的值转换为 base64、对被污染的值进行子字符串操作以及其他类似的转换来创建的新值，除非明确调用 `taintUniqueValue` 污染这些新创建的值，否则它们不会被污染。
* 不要使用 `taintUniqueValue` 保护诸如 PIN 码与电话号码这类低熵值。如果请求中的任何值都可以受攻击者控制，那么他们可以秘密枚举所有值来判断那个值是被污染的

---

## 用法 {/*usage*/}

### 防止将令牌传递给客户端组件 {/*prevent-a-token-from-being-passed-to-client-components*/}

为了确保敏感信息（如密码、会话令牌或其他唯一值）不会被意外地传递给客户端组件，`taintUniqueValue` 函数提供了一层保护。当一个值被污染时，任何尝试将其传递给客户端组件的操作都将导致错误。

`lifetime` 参数定义了值保持被污染的状态的持续时间。对于应该永久保持被污染的状态的值，可以使用像 [`globalThis`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/globalThis) 或 `process` 这样的对象作为 `lifetime` 参数。这些对象的生命周期跨越应用程序执行的整个持续时间。

```js
import {experimental_taintUniqueValue} from 'react';

experimental_taintUniqueValue(
  'Do not pass a user password to the client.',
  globalThis,
  process.env.SECRET_KEY
);
```

如果被污染的值的寿命与某个对象相关联，那么 `lifetime` 应该是封装该值的对象。这样可以确保被污染的值在封装对象的生命周期内保持受保护状态。

```js
import {experimental_taintUniqueValue} from 'react';

export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  experimental_taintUniqueValue(
    'Do not pass a user session token to the client.',
    user,
    user.session.token
  );
  return user;
}
```

在此示例中，`user` 对象用作 `lifetime` 参数。如果此对象存储在全局缓存中或可以被其他请求访问，会话令牌将保持被污染的状态。

<Pitfall>

**不要仅依赖于污点标记来确保安全**。污染一个值不会阻止每一个可能派生出的值。例如，通过将被污染的字符串大写来创建新值，将不会污染新值。


```js
import {experimental_taintUniqueValue} from 'react';

const password = 'correct horse battery staple';

experimental_taintUniqueValue(
  'Do not pass the password to the client.',
  globalThis,
  password
);

const uppercasePassword = password.toUpperCase() // `uppercasePassword` 不被污染
```

在此示例中，常量 `password` 被污染。然后，通过在 `password` 上调用 `toUpperCase` 方法使用 `password` 创建新值 `uppercasePassword`。新创建的 `uppercasePassword` 不被污染。

从被污染的值派生新值的其他类似方式，如将其连接到较大的字符串中、将其转换为 base64 或返回子字符串，会创建未被污染的值。

污点标记仅保护免受简单错误的影响，比如明确将机密值传递给客户端的错误。在调用 `taintUniqueValue` 时出现的错误，例如在 React 外部使用全局存储，没有相应的生命周期对象，可能会导致被污染的值变为未被污染。污点标记是一层保护，安全的应用程序将具有多层保护、精心设计的 API 和隔离模式。

</Pitfall>

<DeepDive>

#### 使用 `server-only` 与 `taintUniqueValue` 防止机密信息泄露 {/*using-server-only-and-taintuniquevalue-to-prevent-leaking-secrets*/}

如果正在运行具有访问私钥或密码（如数据库密码）的服务器组件环境，必须小心不要将其传递给客户端组件。

```js
export async function Dashboard(props) {
  // 不要这样做
  return <Overview password={process.env.API_PASSWORD} />;
}
```

```js
"use client";

import {useEffect} from '...'

export async function Overview({ password }) {
  useEffect(() => {
    const headers = { Authorization: password };
    fetch(url, { headers }).then(...);
  }, [password]);
  ...
}
```

这个示例会将秘密的 API 令牌泄漏给客户端。如果这个 API 令牌可以用来访问此特定用户不应该访问的数据，可能会导致数据泄露。

[comment]: <> (TODO: 一旦 `server-only` 文档写好就就将其链接到对应处)

理想情况下，像这样的机密信息应该被抽象到一个单独的辅助文件中，只有服务器上的可信数据工具才能导入它。这个辅助文件甚至可以被污染为 [`server-only`](https://www.npmjs.com/package/server-only)，以确保此文件不会在客户端被导入。

```js
import "server-only";

export function fetchAPI(url) {
  const headers = { Authorization: process.env.API_PASSWORD };
  return fetch(url, { headers });
}
```

有时，在重构过程中可能会发生错误，而且不是所有同事都可能知道这一点。
为了防止此类错误在后续发生，我们可以对实际密码进行“污染”：

```js
import "server-only";
import {experimental_taintUniqueValue} from 'react';

experimental_taintUniqueValue(
  'Do not pass the API token password to the client. ' +
    'Instead do all fetches on the server.'
  process,
  process.env.API_PASSWORD
);
```

现在无论何时有人试图将此密码传递给客户端组件，或者通过服务器函数将密码发送给客户端组件时都会引发一个错误，错误消息则是在调用 `taintUniqueValue` 时定义的。

</DeepDive>

---
