---
id: hooks-custom
title: 自定义 Hook
permalink: docs/hooks-custom.html
next: hooks-reference.html
prev: hooks-rules.html
---

> Try the new React documentation.
> 
> These new documentation pages teach modern React and include live examples:
>
> - [Reusing Logic with Custom Hooks](https://beta.reactjs.org/learn/reusing-logic-with-custom-hooks)
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

*Hook* 是 React 16.8 的新增特性。它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性。

通过自定义 Hook，可以将组件逻辑提取到可重用的函数中。

在我们学习[使用 Effect Hook](/docs/hooks-effect.html#example-using-hooks-1) 时，我们已经见过这个聊天程序中的组件，该组件用于显示好友的在线状态：

```js{4-15}
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

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

现在我们假设聊天应用中有一个联系人列表，当用户在线时需要把名字设置为绿色。我们可以把上面类似的逻辑复制并粘贴到 `FriendListItem` 组件中来，但这并不是理想的解决方案：

```js{4-15}
import React, { useState, useEffect } from 'react';

function FriendListItem(props) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

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

相反，我们希望在 `FriendStatus` 和 `FriendListItem` 之间共享逻辑。

目前为止，在 React 中有两种流行的方式来共享组件之间的状态逻辑: [render props](/docs/render-props.html) 和[高阶组件](/docs/higher-order-components.html)，现在让我们来看看 Hook 是如何在让你不增加组件的情况下解决相同问题的。

## 提取自定义 Hook {#extracting-a-custom-hook}

当我们想在两个函数之间共享逻辑时，我们会把它提取到第三个函数中。而组件和 Hook 都是函数，所以也同样适用这种方式。

**自定义 Hook 是一个函数，其名称以 “`use`” 开头，函数内部可以调用其他的 Hook。** 例如，下面的 `useFriendStatus` 是我们第一个自定义的 Hook:

```js{3}
import { useState, useEffect } from 'react';

function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}
```

此处并未包含任何新的内容——逻辑是从上述组件拷贝来的。与组件中一致，请确保只在自定义 Hook 的顶层无条件地调用其他 Hook。

与 React 组件不同的是，自定义 Hook 不需要具有特殊的标识。我们可以自由的决定它的参数是什么，以及它应该返回什么（如果需要的话）。换句话说，它就像一个正常的函数。但是它的名字应该始终以 `use` 开头，这样可以一眼看出其符合 [Hook 的规则](/docs/hooks-rules.html)。

此处 `useFriendStatus` 的 Hook 目的是订阅某个好友的在线状态。这就是我们需要将 `friendID` 作为参数，并返回这位好友的在线状态的原因。

```js
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  // ...

  return isOnline;
}
```

现在让我们看看应该如何使用自定义 Hook。

## 使用自定义 Hook {#using-a-custom-hook}

我们一开始的目标是在 `FriendStatus` 和 `FriendListItem` 组件中去除重复的逻辑，即：这两个组件都想知道好友是否在线。

现在我们已经把这个逻辑提取到 `useFriendStatus` 的自定义 Hook 中，然后就可以*使用它了：*

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

**这段代码等价于原来的示例代码吗？**等价，它的工作方式完全一样。如果你仔细观察，你会发现我们没有对其行为做任何的改变，我们只是将两个函数之间一些共同的代码提取到单独的函数中。**自定义 Hook 是一种自然遵循 Hook 设计的约定，而并不是 React 的特性。**

**自定义 Hook 必须以 “`use`” 开头吗？**必须如此。这个约定非常重要。不遵循的话，由于无法判断某个函数是否包含对其内部 Hook 的调用，React 将无法自动检查你的 Hook 是否违反了 [Hook 的规则](/docs/hooks-rules.html)。

**在两个组件中使用相同的 Hook 会共享 state 吗？**不会。自定义 Hook 是一种重用*状态逻辑*的机制(例如设置为订阅并存储当前值)，所以每次使用自定义 Hook 时，其中的所有 state 和副作用都是完全隔离的。

**自定义 Hook 如何获取独立的 state？**每次*调用* Hook，它都会获取独立的 state。由于我们直接调用了 `useFriendStatus`，从 React 的角度来看，我们的组件只是调用了 `useState` 和 `useEffect`。 正如我们在[之前章节](/docs/hooks-effect.html#tip-use-multiple-effects-to-separate-concerns)中[了解到的](/docs/hooks-state.html#tip-using-multiple-state-variables)一样，我们可以在一个组件中多次调用 `useState` 和 `useEffect`，它们是完全独立的。

### 提示：在多个 Hook 之间传递信息 {#tip-pass-information-between-hooks}

由于 Hook 本身就是函数，因此我们可以在它们之间传递信息。

我们将使用聊天程序中的另一个组件来说明这一点。这是一个聊天消息接收者的选择器，它会显示当前选定的好友是否在线:

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

我们将当前选择的好友 ID 保存在 `recipientID` 状态变量中，并在用户从 `<select>` 中选择其他好友时更新这个 state。

由于 `useState` 为我们提供了 `recipientID` 状态变量的最新值，因此我们可以将它作为参数传递给自定义的 `useFriendStatus` Hook：

```js
  const [recipientID, setRecipientID] = useState(1);
  const isRecipientOnline = useFriendStatus(recipientID);
```

如此可以让我们知道*当前选中*的好友是否在线。当我们选择不同的好友并更新 `recipientID` 状态变量时，`useFriendStatus` Hook 将会取消订阅之前选中的好友，并订阅新选中的好友状态。

## `useYourImagination()` {#useyourimagination}

自定义 Hook 解决了以前在 React 组件中无法灵活共享逻辑的问题。你可以创建涵盖各种场景的自定义 Hook，如表单处理、动画、订阅声明、计时器，甚至可能还有其他我们没想到的场景。更重要的是，创建自定义 Hook 就像使用 React 内置的功能一样简单。

尽量避免过早地增加抽象逻辑。既然函数组件能够做的更多，那么代码库中函数组件的代码行数可能会剧增。这属于正常现象 —— 不必立即将它们拆分为 Hook。但我们仍鼓励你能通过自定义 Hook 寻找可能，以达到简化代码逻辑，解决组件杂乱无章的目的。

例如，有个复杂的组件，其中包含了大量以特殊的方式来管理的内部状态。`useState` 并不会使得集中更新逻辑变得容易，因此你可能更愿意使用 [redux](http://redux.js.org/) 中的 reducer 来编写。

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

Reducers 非常便于单独测试，且易于扩展，以表达复杂的更新逻辑。如有必要，您可以将它们分成更小的 reducer。但是，你可能还享受着 React 内部 state 带来的好处，或者可能根本不想安装其他库。

那么，为什么我们不编写一个 `useReducer` 的 Hook，使用 reducer 的方式来管理组件的内部 state 呢？其简化版本可能如下所示：

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

在组件中使用它，让 reducer 驱动它管理 state：

```js{2}
function Todos() {
  const [todos, dispatch] = useReducer(todosReducer, []);

  function handleAddClick(text) {
    dispatch({ type: 'add', text });
  }

  // ...
}
```

在复杂组件中使用 reducer 管理内部 state 的需求很常见，我们已经将 `useReducer` 的 Hook 内置到 React 中。你可以在 [Hook API 索引](/docs/hooks-reference.html)中找到它使用，搭配其他内置的 Hook 一起使用。
