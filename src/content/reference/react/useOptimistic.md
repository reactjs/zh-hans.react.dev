---
title: useOptimistic
---

<Intro>

`useOptimistic` 是一个 React Hook，它可以帮助你更乐观地更新用户界面。

```js
  const [optimisticState, addOptimistic] = useOptimistic(state, updateFn);
```

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `useOptimistic(state, updateFn)` {/*use*/}

`useOptimistic` 是一个 React Hook，它允许你在进行异步操作时显示不同 state。它接受 state 作为参数，并返回该 state 的副本，在异步操作（如网络请求）期间可以不同。你需要提供一个函数，该函数接受当前 state 和操作的输入，并返回在操作挂起期间要使用的乐观状态。

这个状态被称为“乐观”状态是因为通常用于立即向用户呈现执行操作的结果，即使实际上操作需要一些时间来完成。

```js
import { useOptimistic } from 'react';

function AppContainer() {
  const [optimisticState, addOptimistic] = useOptimistic(
    state,
    // 更新函数
    (currentState, optimisticValue) => {
      // 使用乐观值
      // 合并并返回新 state
    }
  );
}
```

[参阅下方更多示例](#usage)。

#### 参数 {/*parameters*/}

* `state`：初始时和没有挂起操作时要返回的值。
* `updateFn(currentState, optimisticValue)`：一个函数，接受当前 state 和传递给 `addOptimistic` 的乐观值，并返回结果乐观状态。它必须是一个纯函数。`updateFn` 接受两个参数：`currentState` 和 `optimisticValue`。返回值将是 `currentState` 和 `optimisticValue` 的合并值。


#### 返回值 {/*returns*/}

* `optimisticState`：结果乐观状态。除非有操作挂起，否则它等于 `state`，在这种情况下，它等于 `updateFn` 返回的值。
* `addOptimistic`：触发乐观更新时调用的 dispatch 函数。它接受一个可以是任何类型的参数 `optimisticValue`，并以 `state` 和 `optimisticValue` 作为参数来调用 `updateFn`。

---

## 用法 {/*usage*/}

### 乐观地更新表单 {/*optimistically-updating-with-forms*/}

`useOptimistic` Hook 提供了一种在后台操作（如网络请求）完成之前乐观地更新用户界面的方式。在表单的上下文中，这种技术有助于使应用程序在感觉上响应地更加快速。当用户提交表单时，界面立即更新为预期的结果，而不是等待服务器的响应来反映更改。

例如，当用户在表单中输入消息并点击“发送”按钮时，`useOptimistic` Hook 允许消息立即出现在列表中，并带有“发送中……”标签，即使消息实际上还没有发送到服务器。这种“乐观”方法给人一种快速和响应灵敏的印象。然后，表单在后台尝试真正发送消息。一旦服务器确认消息已收到，“发送中……”标签就会被移除。

<Sandpack>


```js src/App.js
import { useOptimistic, useState, useRef, startTransition } from "react";
import { deliverMessage } from "./actions.js";

function Thread({ messages, sendMessageAction }) {
  const formRef = useRef();
  function formAction(formData) {
    addOptimisticMessage(formData.get("message"));
    formRef.current.reset();
    startTransition(async () => {
      await sendMessageAction(formData);
    });
  }
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [
      {
        text: newMessage,
        sending: true
      },
      ...state,
    ]
  );

  return (
    <>
      <form action={formAction} ref={formRef}>
        <input type="text" name="message" placeholder="你好！" />
        <button type="submit">发送</button>
      </form>
      {optimisticMessages.map((message, index) => (
        <div key={index}>
          {message.text}
          {!!message.sending && <small>（发送中……）</small>}
        </div>
      ))}
      
    </>
  );
}

export default function App() {
  const [messages, setMessages] = useState([
    { text: "你好，在这儿！", sending: false, key: 1 }
  ]);
  async function sendMessageAction(formData) {
    const sentMessage = await deliverMessage(formData.get("message"));
    startTransition(() => {
      setMessages((messages) => [{ text: sentMessage }, ...messages]);
    })
  }
  return <Thread messages={messages} sendMessageAction={sendMessageAction} />;
}
```

```js src/actions.js
export async function deliverMessage(message) {
  await new Promise((res) => setTimeout(res, 1000));
  return message;
}
```


</Sandpack>
