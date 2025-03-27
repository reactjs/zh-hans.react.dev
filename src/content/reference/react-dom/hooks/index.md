---
title: "Built-in React DOM Hooks"
---

<Intro>

`react-dom` 包含的 Hook 仅支持 web 应用程序，即在浏览器 DOM 环境中运行的应用程序。这些 Hook 不支持非浏览器环境，如 iOS、Android 或 Windows 应用程序。如果正在寻找在 web 浏览器以及其他环境中支持的 Hook，请参阅 [React Hooks 页面](/reference/react)。该页面列出了 `react-dom` 包中的所有 Hook。

</Intro>

---

## Form Hooks {/*form-hooks*/}

**Form** 允许创建用于提交信息的交互式控件。要在组件中管理表单，请使用以下其中一个 Hook：

* [`useFormStatus`](/reference/react-dom/hooks/useFormStatus) 允许根据表单的状态更新用户界面。

```js
function Form({ action }) {
  async function increment(n) {
    return n + 1;
  }
  const [count, incrementFormAction] = useActionState(increment, 0);
  return (
    <form action={action}>
      <button formAction={incrementFormAction}>Count: {count}</button>
      <Button />
    </form>
  );
}

function Button() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} type="submit">
      提交
    </button>
  );
}
```
