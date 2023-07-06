---
title: "'use server'"
---

<Wip>

此章节仍在完善中。

这些指令仅在你 [使用 React 服务器组件](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) 或构建可适配库时需要。

</Wip>


<Intro>

`'use server'` 标记可以从客户端代码调用的服务器函数。

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `'use server'` {/*use-server*/}

在异步函数的最顶部添加 `'use server'` 以标记该函数可以被客户端执行。

```js
async function addToCart(data) {
  'use server';
  // ...
}

// <ProductDetailPage addToCart={addToCart} />
```

上面这个函数可以传递给客户端。当在客户端调用时，它会向服务器发起网络请求，其中包含传递的任何参数的序列化副本。如果服务器函数返回一个值，该值将在序列化后返回给客户端。

另外，可以在文件的最顶部添加 `'use server';` 来将该文件中的所有导出标记为可以在任何地方使用的异步服务器函数，包括在客户端组件文件中导入。

#### 注意 {/*caveats*/}

* 请记住，使用 `'use server'` 标记的函数的参数是完全由客户端控制的。因此，为了安全起见，请始终将它们视为不可信的输入，并确保根据需要进行验证和转义。
* 为了避免将客户端和服务器代码混合在同一文件中从而导致混淆，`'use server'` 只能在服务器文件中使用；生成的函数可以通过 props 传递给客户端组件。
* 底层的网络调用总是异步的，所以 `'use server'` 只能在异步函数上使用。
* 像 `'use server'` 这样的指令必须位于文件或函数的最开头，位于任何导入或其他代码之上（指令上方可以存在注释）。它们必须用单引号或双引号编写，而不是反引号。`'use xyz'` 指令格式类似于 `'useXyz'` Hook 命名约定，但相似之处纯属巧合。
