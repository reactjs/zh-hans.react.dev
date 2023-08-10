---
title: "Directives"
canary: true
---

<Canary>

These directives are needed only if you're [using React Server Components](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) or building a library compatible with them.

</Canary>

<Intro>

<<<<<<< HEAD
React 使用两个指令（directive）向 [与 React 服务器组件兼容的捆绑器（bundler）](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) 提供指令（instruction）。
=======
Directives provide instructions to [bundlers compatible with React Server Components](/learn/start-a-new-react-project#bleeding-edge-react-frameworks).
>>>>>>> ae06008d574e44992133f4cc74563ce968fde04c

</Intro>

---

## 源码命令 {/*source-code-directives*/}

* [`'use client'`](/reference/react/use-client) 标记组件在客户端上执行的源文件。
* [`'use server'`](/reference/react/use-server) 标记可以从客户端代码调用的服务器函数。
