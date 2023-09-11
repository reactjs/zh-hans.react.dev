---
title: "'use client'"
canary: true
---

<Canary>

`'use client'` 仅在你 [使用 React 服务器组件](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) 或构建可适配库时需要。

</Canary>


<Intro>

`'use client'` 标记组件在客户端上执行的源文件。

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `'use client'` {/*use-client*/}

在文件的最顶部添加 `'use client'` 以标记该文件（包括它使用的任何子组件）在客户端上执行，而无论其导入位置如何。

```js
'use client';

import { useState } from 'react';

export default function RichTextEditor(props) {
  // ...
```

当从服务器组件导入标记为 `'use client'` 的文件时，[兼容的捆绑器（bundler）](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) 会将导入视为服务器代码与客户端代码之间的“分界点”。模块图中该点或以下的组件可以使用如 [`useState`](/reference/react/useState) 的仅限客户端的 React 功能。

#### 注意 {/*caveats*/}

* 不必在每个使用仅客户端 React 功能的文件中都添加`'use client'`，只需在从服务器组件文件中导入的文件中添加。`'use client'` 表示服务器代码和客户端代码之间的边界；树中更深层次的任何组件将自动在客户端上执行。为了从服务器组件渲染，从`'use client'` 文件导出的组件必须具有可序列化的 props。
* 当从服务器文件导入 `'use client'` 文件时，导入的值可以渲染为 React 组件或通过 props 传递到客户端组件。任何其他使用都会引发异常。
* 当从另一个客户端文件导入 `'use client'` 文件时，该指令无效。这允许你编写可同时在服务器和客户端组件中使用的仅客户端组件。
* `'use client'` 文件中的所有代码以及它直接或间接导入的任何模块都将成为客户端模块图的一部分，并且必须发送到客户端并由客户端执行，以便由客户端渲染至浏览器。为了减少客户端包的大小并充分利用服务器，请尽可能将状态 state（和 `'use client'` 指令）移动到组件树的较低位置，并将渲染的服务器组件 [作为客户端组件的子组件](/learn/passing-props- to-a-component#passing-jsx-as-children)。
* 由于 props 是跨服务器客户端边界进行序列化的，因此这些指令的放置位置可能会影响发送到客户端的数据量；尽量仅使用必要的数据结构。
* 像 `<MarkdownRenderer>` 这样既不使用服务器功能也不使用客户端功能的组件通常不应标记为 `'use client'`。这样当在服务器组件中使用时，它们可以专门在服务器上渲染；但当在客户端组件中使用时，它们将被添加到客户端包中。
* 发布到 npm 的库应该在导出的 React 组件上包含 `'use client'`，这些组件可以仅使用客户端 React 功能的可序列化 props 进行渲染，以允许服务器组件导入和渲染这些组件。否则，用户将需要将库组件包装在自己的 `'use client'` 文件中，这可能很麻烦，并且会阻止库稍后将逻辑移动到服务器。将预捆绑文件发布到 npm 时，请确保 `'use client'` 源文件最终位于标有 `'use client'` 的捆绑包中，与包含可直接在服务器上使用的导出的任何捆绑包分开。
* 客户端组件仍将作为服务器渲染 (SSR) 或构建时（build-time）静态站点生成 (SSG) 的一部分运行，它们充当客户端，将 React 组件的初始渲染输出转换为可在下载 JavaScript 包之前渲染的 HTML。但他们无法使用服务器功能，例如直接从数据库读取数据。
* 像 `'use client'` 这样的指令必须位于文件的最开头，位于任何导入或其他代码之上（指令上方可以存在注释）。它们必须用单引号或双引号编写，而不是反引号。`'use xyz'` 指令格式类似于 `'useXyz'` Hook 命名约定，但相似之处纯属巧合。

## 用法 {/*usage*/}

<Wip>
此章节仍在编写中。

此 API 可以在任何支持 React 服务器组件的框架中使用，你可以从这些框架的相关文档中找到额外的内容。
* [Next.js 文档](https://nextjs.org/docs/getting-started/react-essentials)
* 敬请期待。
</Wip>
