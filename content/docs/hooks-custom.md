---
id: hooks-custom
title: 自定义 Hooks
permalink: docs/hooks-custom.html
next: hooks-reference.html
prev: hooks-rules.html
---

*Hooks* 是 React 16.8 的新增特性，允许你不在编写类(class)的情况下使用状态(state)及 React 其他特性。

通过自定义 Hooks，可以将组件逻辑提取到可重用的函数中。

当我们学习[使用 Effect Hook](/docs/hooks-effect.html#example-using-hooks-1)时，我们从聊天程序中看到了下面这个组件，该组件指示朋友当前的状态是否在线：

```js{4-15}
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

现在比如说我们的聊天应用有一个联系人列表，当用户在线时需要把名字设置为绿色。我们可以把上面类似的逻辑复制并粘贴到 `FriendListItem` 组件中来，但这并不是理想的做法：

```js{4-15}
import React, { useState, useEffect } from 'react';

function FriendListItem(props) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  return (
    <li style={{ color: isOnline ? 'green' : 'black' }}>
      {props.friend.name}
    </li>
  );
}
```

相反，我们想在 `FriendStatus` 和 `FriendListItem` 之间共享逻辑。

在之前React中，有两种流行的方式来共享组件之间的状态逻辑: [render props](/docs/render-props.html) 和 [高阶组件](/docs/higher-order-components.html)，我们现在将看看 Hook 是如何在不强制添加更多组件的情况下解决相同的问题。

## Extracting a Custom Hook {#extracting-a-custom-hook}
## 提取自定义 Hook {#extracting-a-custom-hook}

当我们想在两个函数之间共享逻辑时，我们会将它提取成第三个函数中。而组件和 Hooks 都是函数，当然也同样适用。

**自定义 Hook 是一个函数，其名称以“`use`”开头，函数内部可以调用其他的 Hooks。** 例如，下面的 `useFriendStatus` 是我们第一个自定义的 Hook:

```js{3}
import React, { useState, useEffect } from 'react';

function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}
```

这里面并没有任何新的内容——逻辑是从上面的组件复制的。就像在组件中一样，请确保只在自定义 Hook 的顶层无条件(译者注：如if，三元等)地调用其他 Hooks.

与 React 组件不同的是，自定义 Hook 不需要具有特定的签名。我们可以自由的决定它的参数是什么，以及它应该返回什么（如果需要的话）。换句话说，它就像一个正常的函数。但是它的名字应该始终以 `use` 开头，这样可以一目了然地看出其符合[Hook 的规则](/docs/hooks-rules.html)。

我们这个 Hook `useFriendStatus` 的目的是订阅某个朋友的在线状态。这也就是为什么我们需要 `friendID` 作为参数，并返回这位朋友的是否在线状态。

```js
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  // ...

  return isOnline;
}
```

现在让我们看看应该如何使用自定义 Hook。

## 使用自定义Hook {#using-a-custom-hook}

在开始的时候，我们的目标是在 `FriendStatus` 和 `FriendListItem` 组件中去除重复的逻辑，即：这两个组件都想知道朋友是否在线。

现在我们已经将这个逻辑提到了名称叫 `useFriendStatus` 的自定义 Hook 中，接下来我们可以使用它。

```js{2}
function FriendStatus(props) {
  const isOnline = useFriendStatus(props.friend.id);

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

```js{2}
function FriendListItem(props) {
  const isOnline = useFriendStatus(props.friend.id);

  return (
    <li style={{ color: isOnline ? 'green' : 'black' }}>
      {props.friend.name}
    </li>
  );
}
```

**这段代码等价于原来的示例代码吗?** 是的，它的工作方式完全一样。如果你仔细观察，你会发现我们没有对其行为做任何的改变，我们所做的只是将两个函数之间一些共同的代码提取到单独的函数中。**自定义 Hook 是一种自然遵循 Hooks 设计的约定，而不是 React 的特性。**

**我必须以 “`use`” 开头来自定义 Hooks 吗?** 请这么做。这个约定非常重要。没有它，React 无法自动检查是否违反了[Hook 的规则](/docs/hooks-rules.html)，因为我们无法判断某个函数是否包含了 Hooks 的调用。

**在两个组件中使用相同的 Hook 会共享状态吗?** 不会。自定义 Hooks 是一种重用*有状态逻辑*的机制(例如设置订阅并记住当前值)，所以每次使用自定义 Hook 时，其中的所有 `state` 和 `effect` 都是完全隔离的。

**自定义Hook如何获得隔离状态?** 每次对Hook的*调用*都会被隔离状态. 因为我们直接调用 `useFriendStatus`，从 React 的角度来看，我们的组件只是调用了`useState` 和 `useEffect`. 正如我们前面的章节了解到的([tip：使用多个state](/docs/hooks-state.html#tip-using-multiple-state-variables) 和 [tip: 使用多个effect分离问题](/docs/hooks-effect.html#tip-use-multiple-effects-to-separate-concerns))，我们可以在一个组件中调用 `useState` 和 `useEffect` 很多次，它们将是完全独立的。

### Tip: 在多个 Hook 之间传递信息 {#tip-pass-information-between-hooks}

由于 Hooks 是函数，我们可以在它们之间传递信息。

为了说明这一点，我们将使用假设聊天示例中的另一个组件。这是一个聊天消息收件人选取器，显示当前选定的好友是否在线:

```js{8-9,13}
const friendList = [
  { id: 1, name: 'Phoebe' },
  { id: 2, name: 'Rachel' },
  { id: 3, name: 'Ross' },
];

function ChatRecipientPicker() {
  const [recipientID, setRecipientID] = useState(1);
  const isRecipientOnline = useFriendStatus(recipientID);

  return (
    <>
      <Circle color={isRecipientOnline ? 'green' : 'red'} />
      <select
        value={recipientID}
        onChange={e => setRecipientID(Number(e.target.value))}
      >
        {friendList.map(friend => (
          <option key={friend.id} value={friend.id}>
            {friend.name}
          </option>
        ))}
      </select>
    </>
  );
}
```

我们将当前选择的朋友 ID 保存在 `recipientID` 状态变量中，如果用户在 `<select>` 中选择了其他的朋友，我们就更新这个变量。

因为 `useState` 为我们提供了 `recipientID` 状态变量的最新值，所以我们可以将它作为参数传递给我们的自定义 Hook `useFriendStatus`：

```js
  const [recipientID, setRecipientID] = useState(1);
  const isRecipientOnline = useFriendStatus(recipientID);
```

这让我们知道*当前选中*的朋友是否在线。如果我们选择不同的朋友并更新 `recipientID` 状态变量，我们的 `useFriendStatusHook` 将会取消订阅之前选中的朋友，并订阅新选中的朋友状态。

## `useYourImagination()` {#useyourimagination}

自定义 Hooks 提供了以前在 React 组件中无法实现的共享逻辑的灵活性。你可以通过编写自定义 Hooks，去涵盖各种用例，如表单处理，动画，声明订阅，计时器，以及可能还有更多我们未考虑过的用例。更重要的是，你可以编写与 React 的内置特性一样易于使用的 Hooks。

尽量不要过早地增加抽象。既然函数定义组件可以做更多事了，那么代码库中函数定义组件的代码行数可能会变得更多。这是正常的 —— 不要觉得你必须立即将其拆分为 Hook。但我们鼓励你去发现可以通过自定义 Hook 将复杂的逻辑隐藏在简单的接口背后，或者可以帮助解决组件内部杂乱无章的情况的点。

例如，你可能有一个复杂的组件，包含了以临时方式来管理大量的本地状态。`useState` 不会使集中更新逻辑变得更容易，因此您可能更愿意将其编写为 [redux](http://redux.js.org/) reducer。

```js
function todosReducer(state, action) {
  switch (action.type) {
    case 'add':
      return [...state, {
        text: action.text,
        completed: false
      }];
    // ... other actions ...
    default:
      return state;
  }
}
```

Reducers 非常便于单独测试，并且可以扩展以表达复杂的更新逻辑。如有必要，您可以将它们分成更小的 reducer。但是，您可能还享受使用 React 本地状态的好处，或者可能不想安装其他库。

那么，如果我们可以编写一个名叫 `useReducer` 的 Hook 来让我们使用 reducer 管理组件的本地状态呢？它的简化版本可能如下所示：

```js
function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    const nextState = reducer(state, action);
    setState(nextState);
  }

  return [state, dispatch];
}
```

现在我们可以在我们的组件中使用它，让 reducer 驱动它的状态管理：

```js{2}
function Todos() {
  const [todos, dispatch] = useReducer(todosReducer, []);

  function handleAddClick(text) {
    dispatch({ type: 'add', text });
  }

  // ...
}
```

在复杂组件中使用 reducer 管理本地状态的需求很常见，我们已经将 `useReducer` Hook 内置到 React 中。你可以在[Hooks API 参考](/docs/hooks-reference.html)中找到它与其他内置的 Hook 一起使用。
