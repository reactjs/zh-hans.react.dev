---
title: experimental_useEffectEvent
---

<Wip>

**这个 API 实验性的且在 React 的稳定版中还不可用**。

你可以通过升级到最新的实验版 React 包来尝试：

- `react@experimental`
- `react-dom@experimental`
- `eslint-plugin-react-hooks@experimental`

React 实验版可能存在 bug，所以千万不要在生产环境使用它。

</Wip>


<Intro>

`useEffectEvent` 这个 React Hook 让你可以提取非响应式逻辑到一个 [Effect Event](/learn/separating-events-from-effects#declaring-an-effect-event) 中。

```js
const onSomething = useEffectEvent(callback)
```

</Intro>

<InlineToc />
