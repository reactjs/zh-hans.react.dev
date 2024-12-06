---
<<<<<<< HEAD
title: "指示符"
canary: true
=======
title: Directives
>>>>>>> acda167885d7db3a5e61d5d992135a1f5f574f6c
---

<RSC>

<<<<<<< HEAD
这些指令仅在 [使用 React 服务器组件](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) 或构建可适配库时需要。
=======
Directives are for use in [React Server Components](/learn/start-a-new-react-project#bleeding-edge-react-frameworks).
>>>>>>> acda167885d7db3a5e61d5d992135a1f5f574f6c

</RSC>

<Intro>

指示符（directive）向 [与 React 服务器组件兼容的捆绑器](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) 提供指令（instruction）。

</Intro>

---

## 源码命令 {/*source-code-directives*/}

* 使用 [`'use client'`](/reference/rsc/use-client) 标记运行在客户端的代码。
* 使用 [`'use server'`](/reference/rsc/use-server) 标记可以被客户端代码调用的服务端函数。
