---
title: "'use client'"
titleForTitleTag: "'use client' 指示符"
---

<RSC>

`'use client'` 用于 [React 服务器组件](/reference/rsc/server-components)。

</RSC>


<Intro>

`'use client'` 标记在客户端运行的代码。

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `'use client'` {/*use-client*/}

在文件顶部添加 `'use client'` 以将模块及其传递的依赖项标记为客户端代码。

```js {1}
'use client';

import { useState } from 'react';
import { formatDate } from './formatters';
import Button from './button';

export default function RichTextEditor({ timestamp, text }) {
  const date = formatDate(timestamp);
  // ...
  const editButton = <Button />;
  // ...
}
```

当从服务器组件导入带有 `'use client'` 标记的文件时，[兼容的捆绑工具](/learn/start-a-new-react-project#full-stack-frameworks) 将模块导入视为服务器运行和客户端运行代码之间的边界。

作为 `RichTextEditor` 的依赖项，无论 `formatDate` 与 `Button` 的模块是否包含 `'use client'`，其都将在客户端上进行评估。请注意，当从服务器代码导入时，单个模块可能在服务器上进行评估，并且当从客户端代码导入时，可能在客户端上进行评估。

#### 注意 {/*caveats*/}

* `'use client'` 必须位于文件顶部，在任何导入或其他代码之前（可以位于代码顶部的注释之后）。它们必须用单引号或双引号编写，不能用反引号。
* 当从另一个客户端渲染的模块导入 `'use client'` 模块时，该指示符不起作用。
* 当组件模块包含 `'use client'` 指示符时，保证对该组件的任何使用都将是客户端组件。然而，即使没有 `'use client'` 指示符，组件仍可以在客户端上进行评估。
  * 如果组件是在带有 `'use client'` 指示符的模块中定义的，或者是带有 `'use client'` 指示符的模块的依赖，那么该组件将被视为客户端组件。否则，它将是服务器组件。
* 标记为客户端评估的代码不仅限于组件。客户端模块子树的所有代码都将被发送到客户端并由客户端运行。
* 当服务器评估的模块从 `'use client'` 模块导入值时，这些值必须是 React 组件或 [受支持的可序列化属性值](#passing-props-from-server-to-client-components)，以传递给客户端组件。其他用例将引发异常。

### `'use client'` 如何标记客户端代码 {/*how-use-client-marks-client-code*/}

在 React 应用程序中，组件通常被拆分为单独的文件，或称之为 [模块](/learn/importing-and-exporting-components#exporting-and-importing-a-component)。

对于使用 React 服务器组件的应用程序，默认情况下是由服务器渲染的。`'use client'` 在服务器客户端边界中引入了 [模块依赖树](/learn/understanding-your-ui-as-a-tree#the-module-dependency-tree) ，从而有效地创建了一个客户端模块的子树。

为了更好地说明这一点，请参考下面的 React 服务器组件应用程序示例。

<Sandpack>

```js src/App.js
import FancyText from './FancyText';
import InspirationGenerator from './InspirationGenerator';
import Copyright from './Copyright';

export default function App() {
  return (
    <>
      <FancyText title text="Get Inspired App" />
      <InspirationGenerator>
        <Copyright year={2004} />
      </InspirationGenerator>
    </>
  );
}

```

```js src/FancyText.js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

```js src/InspirationGenerator.js
'use client';

import { useState } from 'react';
import inspirations from './inspirations';
import FancyText from './FancyText';

export default function InspirationGenerator({children}) {
  const [index, setIndex] = useState(0);
  const quote = inspirations[index];
  const next = () => setIndex((index + 1) % inspirations.length);

  return (
    <>
      <p>Your inspirational quote is:</p>
      <FancyText text={quote} />
      <button onClick={next}>Inspire me again</button>
      {children}
    </>
  );
}
```

```js src/Copyright.js
export default function Copyright({year}) {
  return <p className='small'>©️ {year}</p>;
}
```

```js src/inspirations.js
export default [
  "Don’t let yesterday take up too much of today.” — Will Rogers",
  "Ambition is putting a ladder against the sky.",
  "A joy that's shared is a joy made double.",
];
```

```css
.fancy {
  font-family: 'Georgia';
}
.title {
  color: #007AA3;
  text-decoration: underline;
}
.cursive {
  font-style: italic;
}
.small {
  font-size: 10px;
}
```

</Sandpack>

在这个示例应用程序的模块依赖树中，`InspirationGenerator.js` 中的 `'use client'` 指示符标记了该模块及其所有传递依赖为客户端模块。从 `InspirationGenerator.js` 开始的子树现在被标记为客户端模块。

<Diagram name="use_client_module_dependency" height={250} width={545} alt="一个树形图，顶部节点代表模块 'App.js'。'App.js' 有三个子节点：'Copyright.js'、'FancyText.js' 和 'InspirationGenerator.js'。'InspirationGenerator.js' 有两个子节点：'FancyText.js' 和 'inspirations.js'。'InspirationGenerator.js' 及其下面的节点都具有黄色背景颜色，表示由于 'InspirationGenerator.js' 中的 'use client' 指示符，这个子图是由客户端渲染的。">
`'use client'` 划分了 React 服务器组件应用程序的模块依赖树，标记了 `InspirationGenerator.js` 以及其所有依赖为客户端渲染。
</Diagram>

在渲染过程中，框架将在服务端渲染根组件，然后沿着 [渲染树](/learn/understanding-your-ui-as-a-tree#the-render-tree) 进行渲染，在此过程中不评估从客户端标记的代码中导入的任何代码。

然后，渲染树的服务器渲染部分将发送到客户端。客户端在代码下载完毕后，接着完成渲染树的其余部分。

<Diagram name="use_client_render_tree" height={250} width={500} alt="一个树形图，其中每个节点代表一个组件及其子组件作为子组件。顶级节点标记为 'App'，它有两个子组件 'InspirationGenerator' 和 'FancyText'。'InspirationGenerator' 有两个子组件，'FancyText' 和 'Copyright'。'InspirationGenerator' 和其子组件 'FancyText' 都标记为客户端渲染。">
React服务器组件应用程序的渲染树。`InspirationGenerator` 和其子组件 `FancyText` 都是从客户端标记的代码中导出的组件，被视为客户端组件。
</Diagram>

我们引入以下定义：

* **客户端组件** 是渲染树中在客户端上渲染的组件。
* **服务器组件** 是渲染树中在服务器上渲染的组件。

通过示例应用程序，`App`、`FancyText` 和 `Copyright` 都是服务器渲染的，被视为服务器组件。由于 `InspirationGenerator.js` 及其传递依赖被标记为客户端代码，组件 `InspirationGenerator` 及其子组件 `FancyText` 都是客户端组件。

<DeepDive>
#### `FancyText` 是如何实现既是服务器组件也是客户端组件？ {/*how-is-fancytext-both-a-server-and-a-client-component*/}

根据上述定义，组件 `FancyText` 是如何实现既是服务器组件又是客户端组件的呢？

首先，术语“组件”并不是非常精确的。以下是“组件”可以被理解的两种方式：

1. “组件”可以指的是 **组件定义**。在大多数情况下，这将是一个函数。

```js
// 这是组件的定义
function MyComponent() {
  return <p>My Component</p>
}
```

2. “组件”可以指的是定义的 **组件的使用**。
```js
import MyComponent from './MyComponent';

function App() {
  // 这是组件的用法
  return <MyComponent />;
}
```

通常，在解释概念时，不太精确的性质并不重要，但在这种情况下是重要的。

当谈论服务器组件或客户端组件时，我们指的是组件的使用。

* 如果组件在带有 `'use client'` 指示符的模块中定义，或者组件在客户端组件中导入并调用，那么组件的使用将是客户端组件。
* 否则，组件的使用将是服务器组件。


<Diagram name="use_client_render_tree" height={150} width={450} alt="一个树形图，其中每个节点代表一个组件及其子组件作为子组件。顶级节点标记为 'App'，它有两个子组件 'InspirationGenerator' 和 'FancyText'。'InspirationGenerator' 有两个子组件，'FancyText' 和 'Copyright'。'InspirationGenerator' 和其子组件 'FancyText' 都标记为客户端渲染。">渲染树展示了组件的使用。</Diagram>

回到关于 `FancyText` 的问题，我们可以看到组件定义没有包含 `'use client'` 指示符，并且它有两个使用方式。

将 `FancyText` 作为 `App` 的子组件使用，将该使用标记为服务器组件。当 `FancyText` 在 `InspirationGenerator` 下导入并调用时，`FancyText` 的这种使用是客户端组件，因为 `InspirationGenerator` 包含 `'use client'` 指示符。

这意味着 `FancyText` 的组件定义将在服务器上进行评估，同时也将被客户端下载以渲染其客户端组件的使用。

</DeepDive>

<DeepDive>

#### 为什么 `Copyright` 是服务器组件？ {/*why-is-copyright-a-server-component*/}

由于 `Copyright` 是作为客户端组件 `InspirationGenerator` 的子组件进行渲染，这可能会让人感到惊讶，它却是一个服务器组件。

请回想一下，`'use client'` 定义了在 **模块依赖树** 上的服务器和客户端代码的边界，而不是在渲染树上。

<Diagram name="use_client_module_dependency" height={200} width={500} alt="一个树形图，顶部节点代表模块 'App.js'。'App.js' 有三个子节点：'Copyright.js'、'FancyText.js' 和 'InspirationGenerator.js'。'InspirationGenerator.js' 有两个子节点：'FancyText.js' 和 'inspirations.js'。'InspirationGenerator.js' 及其下面的节点都具有黄色背景颜色，表示由于 'InspirationGenerator.js' 中的 'use client' 指示符，这个子图是客户端渲染的。">
`'use client'` 在模块依赖树上定义了服务器和客户端代码之间的边界。
</Diagram>

在模块依赖树中可以看到 `App.js` 从 `Copyright.js` 模块导入并调用 `Copyright`。由于 `Copyright.js` 没有包含 `'use client'` 指示符，该组件的使用在服务器上进行渲染。`App` 作为根组件在服务器上进行渲染。

由于可以将 JSX 作为 props 传递，客户端组件可以渲染服务器组件。在这种情况下，`InspirationGenerator` 以 [children](/learn/passing-props-to-a-component#passing-jsx-as-children) 的形式接收 `Copyright`。然而，`InspirationGenerator` 模块从未直接导入 `Copyright` 模块，也不调用该组件，所有这些都是由 `App` 完成的。实际上，在 `InspirationGenerator` 开始渲染之前，`Copyright` 组件已经完全执行完毕。

请牢记，组件之间的父子渲染关系并不保证相同的渲染环境。

</DeepDive>

### 何时使用 `'use client'`？ {/*when-to-use-use-client*/}

通过 `'use client'` 可以确定哪些组件是客户端组件。由于服务器组件是默认的，以下是关于服务器组件的优势和限制的简要概述，以确定何时需要将某些内容标记为客户端渲染。

为简单起见，我们只谈论了服务器组件，但相同的原则适用于应用程序中所有在服务器上运行的代码。

#### 服务器组件的优点 {/*advantages*/}
* 服务器组件可以减少客户端发送和运行的代码量。只有客户端模块会被捆绑和由客户端进行评估。
* 服务器组件受益于在服务器上运行。它们可以访问本地文件系统，并且可能在数据获取和网络请求方面体验较低的延迟。

#### 服务器组件的限制 {/*limitations*/}
* 服务器组件不能支持交互，因为事件处理程序必须由客户端注册和触发。
  * 例如，像 `onClick` 这样的事件处理程序只能在客户端组件中定义。
* 服务器组件不能使用大多数 Hooks。
  * 当服务器组件被渲染时，它们的输出基本上是客户端渲染的一系列组件。服务器组件在渲染后不会在内存中保留，并且不能拥有自己的状态。

### 服务器组件返回的可序列化类型 {/*serializable-types*/}

与任何 React 应用程序一样，父组件会向子组件传递数据。由于它们在不同的环境中渲染，因此需要额外考虑将数据从服务器组件传递到客户端组件。

从服务器组件传递给客户端组件的属性值必须是可序列化的。

可序列化属性包括：
* 原始类型
	* [string](https://developer.mozilla.org/zh-CN/docs/Glossary/String)
	* [number](https://developer.mozilla.org/zh-CN/docs/Glossary/Number)
	* [bigint](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
	* [boolean](https://developer.mozilla.org/zh-CN/docs/Glossary/Boolean)
	* [undefined](https://developer.mozilla.org/zh-CN/docs/Glossary/Undefined)
	* [null](https://developer.mozilla.org/zh-CN/docs/Glossary/Null)
	* [symbol](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol)，仅包含在全局符号注册表中使用 [`Symbol.for`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for) 注册的符号。
* 包含可序列化值的迭代类型
	* [String](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String)
	* [Array](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array)
	* [Map](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map)
	* [Set](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Set)
	* [TypedArray](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 与 [ArrayBuffer](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
* [Date](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date)
* 普通 [对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object)：使用 [对象初始化器](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Object_initializer) 创建的、具有可序列化属性
* [服务器函数](/reference/rsc/use-server) 中的函数
* 客户端或服务器组件元素（JSX）
* [Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)

值得注意的是，以下内容不受支持：
* 未从客户端标记的模块中导出或未标记为 [`'use server'`](/reference/rsc/use-server) 的 [函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function)
* [类](https://developer.mozilla.org/zh-CN/docs/Learn/JavaScript/Objects/Classes_in_JavaScript)
* 任何类的实例对象（除了提到的内置类）或 [使用 null 作为原型](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object#null-prototype_objects) 的对象
* 未全局注册的符号，例如 `Symbol('my new symbol')`


## 用法 {/*usage*/}

### 构建交互性与状态 {/*building-with-interactivity-and-state*/}

<Sandpack>

```js src/App.js
'use client';

import { useState } from 'react';

export default function Counter({initialValue = 0}) {
  const [countValue, setCountValue] = useState(initialValue);
  const increment = () => setCountValue(countValue + 1);
  const decrement = () => setCountValue(countValue - 1);
  return (
    <>
      <h2>Count Value: {countValue}</h2>
      <button onClick={increment}>+1</button>
      <button onClick={decrement}>-1</button>
    </>
  );
}
```

</Sandpack>

由于 `Counter` 需要使用 `useState` Hook 和事件处理程序来增加或减少值，因此该组件必须是客户端组件，并且需要在顶部添加 `'use client'` 指示符。

相比之下，一个渲染 UI 而没有交互的组件不需要成为客户端组件。

```js
import { readFile } from 'node:fs/promises';
import Counter from './Counter';

export default async function CounterContainer() {
  const initialValue = await readFile('/path/to/counter_value');
  return <Counter initialValue={initialValue} />
}
```

例如，`Counter` 的父组件 `CounterContainer` 不需要 `'use client'`，因为它没有交互并且不使用状态。此外，`CounterContainer` 必须是服务器组件，因为它在服务器上从本地文件系统读取数据，这仅在服务器组件中可行。

还有一些组件不使用任何特定于服务器或客户端的功能，可以在渲染位置上保持中立。在之前的示例中，`FancyText` 就是这样一个组件。

```js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

在这种不添加 `'use client'` 指示符的情况下，当从服务器组件引用时，`FancyText` 的输出（而不是其源代码）将被发送到浏览器。正如之前在 Inspirations 应用程序示例中所演示的那样，`FancyText` 既可以作为服务器组件也可以作为客户端组件使用，这取决于它被导入和使用的位置。

但如果 `FancyText` 的 HTML 输出相对于其源代码（包括依赖项）较大，那么强制将其始终作为客户端组件可能更高效。返回较长 SVG 路径字符串的组件就是可能更高效地强制组件成为客户端组件的一种情况。

### 使用客户端 API {/*using-client-apis*/}

React 应用程序可能使用特定于客户端的 API，例如浏览器的 web 存储 API、音频和视频处理 API 以及有关设备硬件 API 等 [其他 API](https://developer.mozilla.org/zh-CN/docs/Web/API)。

在这个示例中，该组件使用 [DOM API](https://developer.mozilla.org/zh-CN/docs/Glossary/DOM) 来操作 [`canvas`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/canvas) 元素。由于这些 API 仅在浏览器中可用，因此必须将其标记为客户端组件。

```js
'use client';

import {useRef, useEffect} from 'react';

export default function Circle() {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const canvas = ref.current;
    const context = canvas.getContext('2d');
    context.reset();
    context.beginPath();
    context.arc(100, 75, 50, 0, 2 * Math.PI);
    context.stroke();
  });
  return <canvas ref={ref} />;
}
```

### 使用第三方库 {/*using-third-party-libraries*/}

在 React 应用程序中，通常会利用第三方库来处理常见的 UI 模式或逻辑。

这些库可能依赖于组件 Hook 或客户端 API。使用以下 React API 中的任何一个的第三方组件必须在客户端上运行：
* [createContext](/reference/react/createContext)
* [`react`](/reference/react/hooks) 和 [`react-dom`](/reference/react-dom/hooks) Hook，但不包括 [`use`](/reference/react/use) 和 [`useId`](/reference/react/useId)
* [forwardRef](/reference/react/forwardRef)
* [memo](/reference/react/memo)
* [startTransition](/reference/react/startTransition)
* 如果这些库使用了客户端 API，例如向 DOM 插入元素或查看本机平台视图

如果这些库已经更新为与 React 服务器组件兼容，那么它们将已经包含自己的 `'use client'` 标记，从而使开发者可以直接在服务器组件中使用它们。如果某个库尚未更新，或者某个组件需要像事件处理程序这样只能在客户端上指定的 props，那么可能需要在第三方客户端组件和希望使用它的服务器组件之间添加自己的客户端组件文件。

[TODO]: <> (Troubleshooting - need use-cases)
