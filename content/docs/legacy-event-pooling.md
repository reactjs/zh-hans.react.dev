---
id: legacy-event-pooling
title: 事件池
permalink: docs/legacy-event-pooling.html
---

>注意
>
>此文章仅适用于 React 16 及更早版本、React Native。
>
>Web 端的 React 17 **不使用**事件池。
>
>[查看更多](/blog/2020/08/10/react-v17-rc.html#no-event-pooling)关于 React 17 中的相关改动。

<<<<<<< HEAD
[`SyntheticEvent`](/docs/events.html) 对象会被放入池中统一管理。这意味着 `SyntheticEvent` 可以被复用，当所有事件处理函数被调用之后，其所有属性都会被置空。例如，以下代码是无效的：
=======
The [`SyntheticEvent`](/docs/events.html) objects are pooled. This means that the `SyntheticEvent` object will be reused and all properties will be nullified after the event handler has been called. For example, this won't work:
>>>>>>> 957276e1e92bb48e5bb6b1c17fd0e7a559de0748

```javascript
function handleChange(e) {
  // This won't work because the event object gets reused.
  setTimeout(() => {
    console.log(e.target.value); // Too late!
  }, 100);
}
```

如果你需要在事件处理函数运行之后获取事件对象的属性，你需要调用 `e.persist()`：

```javascript
function handleChange(e) {
  // Prevents React from resetting its properties:
  e.persist();

  setTimeout(() => {
    console.log(e.target.value); // Works
  }, 100);
}
```
