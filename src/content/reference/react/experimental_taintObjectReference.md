---
title: experimental_taintObjectReference
version: experimental
---

<Experimental>

**此实验性 API 尚未在 React 的稳定版本中提供**。

可以尝试升级 React 包到最新的实验版本：

- `react@experimental`
- `react-dom@experimental`
- `eslint-plugin-react-hooks@experimental`

React 的实验版本可能有一些问题，请勿在生产环境中使用。

此 API 仅在 React 服务器组件内可用。

</Experimental>


<Intro>

`taintObjectReference` 允许阻止特定对象实例被传递给客户端组件，例如 `user` 对象。

```js
experimental_taintObjectReference(message, object);
```

请参阅 [`taintUniqueValue`](/reference/react/experimental_taintUniqueValue) 以了解关于防止传递密钥、哈希或令牌的更多信息。

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `taintObjectReference(message, object)` {/*taintobjectreference*/}

调用 `taintObjectReference`，并传递一个对象作为参数，然后将其注册到 React 中，表示不允许直接传递给客户端：

```js
import {experimental_taintObjectReference} from 'react';

experimental_taintObjectReference(
  'Do not pass ALL environment variables to the client.',
  process.env
);
```

[参见下方更多示例](#usage)。

#### 参数 {/*parameters*/}

* `message`：对象被传递给客户端组件时显示的消息。如果对象被传递给客户端组件，此消息将作为错误的一部分显示。

* `object`：被污染的对象。函数和类实例可以作为 `object` 传递给 `taintObjectReference`。React 会阻止直接将函数和类传递给客户端组件，并把默认的错误消息替换为在 `message` 中定义的内容。当将特定类型数组的实例作为 `object` 传递给 `taintObjectReference` 时，该类型数组的其他副本将不会被污染。

#### 返回值 {/*returns*/}

`experimental_taintObjectReference` 返回 `undefined`。

#### 注意 {/*caveats*/}

- 重新创建或克隆一个被污染的对象会创建一个新的未被污染的对象，其中可能包含敏感数据。如果有一个被污染的 `user` 对象，执行 `const userInfo = {name: user.name, ssn: user.ssn}` 或 `{...user}` 将创建新的未被污染的对象。`taintObjectReference` 只能防止把未修改的对象传递给客户端组件这种简单的错误。

<Pitfall>

**不要仅依赖于污点标记来确保安全**。被污染的对象并不防止泄露每一个可能的派生值。例如，被污染的对象的克隆将创建一个新的未被污染的对象。使用来自被污染的对象的数据（例如 `{secret: taintedObj.secret}`）将创建一个新的值或对象，它不被污染。污点标记只是一层保护，安全的应用程序应该有多层保护、精心设计的 API 和隔离模式。

</Pitfall>

---

## 用法 {/*usage*/}

### 防止用户数据被无意间传递到客户端 {/*prevent-user-data-from-unintentionally-reaching-the-client*/}

客户端组件不应接受携带敏感数据的对象。理想情况下数据获取函数不应暴露当前用户不允许访问的数据。有时在重构过程中会发生错误。为了防止这些错误在以后发生，我们可以在数据 API 中“污染”用户对象。

```js
import {experimental_taintObjectReference} from 'react';

export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  experimental_taintObjectReference(
    'Do not pass the entire user object to the client. ' +
      'Instead, pick off the specific properties you need for this use case.',
    user,
  );
  return user;
}
```

现在，无论谁试图将此对象传递给客户端组件，都将抛出一个带有传入错误消息的错误。

<DeepDive>

#### 防止数据获取中的泄漏 {/*protecting-against-leaks-in-data-fetching*/}

如果处于对敏感数据具有访问权限的服务器组件环境，必须牢记不要直接传递对象：

```js
// api.js
export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  return user;
}
```

```js
import { getUser } from 'api.js';
import { InfoCard } from 'components.js';

export async function Profile(props) {
  const user = await getUser(props.userId);
  // DO NOT DO THIS
  return <InfoCard user={user} />;
}
```

```js
// components.js
"use client";

export async function InfoCard({ user }) {
  return <div>{user.name}</div>;
}
```

理想情况下 `getUser` 不应暴露当前用户不允许访问的数据。为了防止将来把 `user` 对象传递给客户端组件，我们可以对用户对象进行“污染”：


```js
// api.js
import {experimental_taintObjectReference} from 'react';

export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  experimental_taintObjectReference(
    'Do not pass the entire user object to the client. ' +
      'Instead, pick off the specific properties you need for this use case.',
    user,
  );
  return user;
}
```

现在，如果有人试图将 `user` 对象传递给客户端组件，将会抛出一个带有传入错误消息的错误。

</DeepDive>
