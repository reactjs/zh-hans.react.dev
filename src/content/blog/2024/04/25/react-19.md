---
title: "React 19 RC"
author: The React Team
date: 2024/04/25
description: React 19 RC 版现在可以在 npm 上使用了! 在这篇文章中，我们将概述 React 19 的新特性，以及如何使用它们。
---

2024 年 4 月 25 日 [The React Team](/community/team)

---

<Intro>

React 19 RC 版本现在可以在 npm 上使用了!

</Intro>

在我们的 [React 19 RC 升级指南](/blog/2024/04/25/react-19-upgrade-guide) 中, 我们分享了将应用程序升级到 React 19 的分步说明。在这篇文章中，我们将概述 React 19 的新特性，以及如何使用它们。

- [React 19 中的新功能](#whats-new-in-react-19)
- [React 19 中的改进](#improvements-in-react-19)
- [如何升级](#how-to-upgrade)

有关破坏性更改的列表，请参阅 [升级指南](/blog/2024/04/25/react-19-upgrade-guide)。

---

## React 19 中的新功能 {/*whats-new-in-react-19*/}

### Actions {/*actions*/}

在 React 应用中，一个常见的用例是执行数据变更，然后响应更新状态。例如，当用户提交一个表单来更改他们的名字，你会发起一个 API 请求，然后处理响应。在过去，你需要手动处理待定状态、错误、乐观更新和顺序请求。

例如，你可以在 `useState` 中处理待定和错误状态：

```js
// 没有 Actions 之前
function UpdateName({}) {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async () => {
    setIsPending(true);
    const error = await updateName(name);
    setIsPending(false);
    if (error) {
      setError(error);
      return;
    } 
    redirect("/path");
  };

  return (
    <div>
      <input value={name} onChange={(event) => setName(event.target.value)} />
      <button onClick={handleSubmit} disabled={isPending}>
        Update
      </button>
      {error && <p>{error}</p>}
    </div>
  );
}
```

在 React 19 中，我们正在添加在过渡中使用异步函数的支持，以自动处理待定状态、错误、表单和乐观更新。

例如，你可以使用 `useTransition` 来为你处理待定状态：

```js
// 使用 Actions 中的待定状态
function UpdateName({}) {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    startTransition(async () => {
      const error = await updateName(name);
      if (error) {
        setError(error);
        return;
      } 
      redirect("/path");
    })
  };

  return (
    <div>
      <input value={name} onChange={(event) => setName(event.target.value)} />
      <button onClick={handleSubmit} disabled={isPending}>
        Update
      </button>
      {error && <p>{error}</p>}
    </div>
  );
}
```

异步过渡会立即将 `isPending` 状态设置为 true，发出异步请求，然后在任何过渡后将 `isPending` 切换为 `false`。这使你能够在数据变化时保持当前 UI 的响应性和交互性。

<Note>

#### 按照惯例，使用异步过渡的函数被称为 "Actions"。 {/*by-convention-functions-that-use-async-transitions-are-called-actions*/}

Actions 自动为你管理数据提交：

- **待定状态**: Actions 提供一个待定状态，该状态在请求开始时启动，并在最终状态更新提交时自动重置。
- **乐观更新**: Actions 支持新的 [`useOptimistic`](#new-hook-optimistic-updates)  Hook，因此你可以在请求提交时向用户显示即时反馈。
- **错误处理**: Actions 提供错误处理，因此当请求失败时，你可以显示错误边界，并自动将乐观更新恢复到其原始值。
- **表单**: `<form>` 元素现在支持将函数传递给 `action` 和 `formAction` 属性。将函数传递给 `action` 属性默认使用 Actions，并在提交后自动重置表单。

</Note>

在 Actions 的基础上，React 19 引入了 [`useOptimistic`](#new-hook-optimistic-updates) 来管理乐观更新，以及一个新的 Hook [`React.useActionState`](#new-hook-useactionstate) 来处理 Actions 的常见情况。在 `react-dom` 中我们添加了 [`<form>` Actions](#form-actions) 来自动管理表单和 `useFormStatus` 来支持表单中 Actions 的常见情况。

在 React 19 中，上述示例可以简化为：

```js
// 使用表单的 Actions 和 useActionState
function ChangeName({ name, setName }) {
  const [error, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const error = await updateName(formData.get("name"));
      if (error) {
        return error;
      }
      redirect("/path");
      return null;
    },
    null,
  );

  return (
    <form action={submitAction}>
      <input type="text" name="name" />
      <button type="submit" disabled={isPending}>Update</button>
      {error && <p>{error}</p>}
    </form>
  );
}
```

在下一节中，我们将详细介绍 React 19 中的每一个新的 Action 功能。

### 新的 Hook: `useActionState` {/*new-hook-useactionstate*/}

为了使 Actions 的常见情况更加简单，我们添加了一个名为 `useActionState` 的新 Hook：

```js
const [error, submitAction, isPending] = useActionState(
  async (previousState, newName) => {
    const error = await updateName(newName);
    if (error) {
      // 你可以返回操作的任何结果。
      // 这里，我们只返回错误。
      return error;
    }

    // 处理成功的情况。
    return null;
  },
  null,
);
```

`useActionState` 接受一个函数（"Action"），并返回一个被包装的用于调用的 Action。这是因为 Actions 是可以组合的。当调用被包装的 Action 时，`useActionState` 将返回 Action 的最后结果作为 `data`，以及 Action 的待定状态作为 `pending`。

<Note>

`React.useActionState` 在 Canary 版本中曾被称为 `ReactDOM.useFormState`，但我们已经将其重命名并弃用了 `useFormState`。

有关更多信息，请参见 [#28491](https://github.com/facebook/react/pull/28491)。

</Note>

相关的更多信息，请参阅文档 [`useActionState`](/reference/react/useActionState)。

### React DOM: `<form>` Actions {/*form-actions*/}

Actions 也与 React 19 的新 `<form>` 功能集成在 `react-dom` 中。我们已经添加了对将函数作为 `<form>`、`<input>` 和 `<button>` 元素的 `action` 和 `formAction` 属性的支持，以便使用 Actions 自动提交表单：

```js [[1,1,"actionFunction"]]
<form action={actionFunction}>
```

当 `<form>` Action 成功时，React 将自动为非受控组件重置表单。如果你需要手动重置 `<form>`，你可以调用新的 `requestFormReset` React DOM API。

有关更多信息，请参阅 `react-dom` 文档中的 [`<form>`](/reference/react-dom/components/form)、[`<input>`](/reference/react-dom/components/input) 和 `<button>`。

### React DOM: 新 Hook: `useFormStatus` {/*new-hook-useformstatus*/}

在设计系统中，常常需要编写设计一类能够访问其所在的 `<form>` 的信息而无需将属性传递到组件内的组件。这可以通过 Context 来实现，但为了使这类常见情况更简单，我们添加了一个新的 Hook `useFormStatus`：

```js [[1, 4, "pending"], [1, 5, "pending"]]
import {useFormStatus} from 'react-dom';

function DesignButton() {
  const {pending} = useFormStatus();
  return <button type="submit" disabled={pending} />
}
```

`useFormStatus` 读取父 `<form>` 的状态，就像表单是一个 Context 提供者一样。

有关更多信息，请参阅 `react-dom` 文档中的 [`useFormStatus`](/reference/react-dom/hooks/useFormStatus)。

### 新 Hook: `useOptimistic` {/*new-hook-optimistic-updates*/}

执行数据变更时的另一个常见 UI 模式是在异步请求进行时乐观地显示最终状态。在 React 19 中，我们添加了一个名为 `useOptimistic` 的新 Hook，以便更容易实现这一点：

```js {2,6,13,19}
function ChangeName({currentName, onUpdateName}) {
  const [optimisticName, setOptimisticName] = useOptimistic(currentName);

  const submitAction = async formData => {
    const newName = formData.get("name");
    setOptimisticName(newName);
    const updatedName = await updateName(newName);
    onUpdateName(updatedName);
  };

  return (
    <form action={submitAction}>
      <p>Your name is: {optimisticName}</p>
      <p>
        <label>Change Name:</label>
        <input
          type="text"
          name="name"
          disabled={currentName !== optimisticName}
        />
      </p>
    </form>
  );
}
```

`useOptimistic` Hook 会在 `updateName` 请求进行时立即渲染 `optimisticName`。当更新完成或出错时，React 将自动切换回 `currentName` 值。

有关更多信息，请参阅 [`useOptimistic`](/reference/react/useOptimistic) 文档。

### 新的 API: `use` {/*new-feature-use*/}

在 React 19 中，我们引入了一个新的 API 来在渲染中读取资源：`use`。

例如，你可以使用 `use` 读取一个 promise，React 将挂起，直到 promise 解析完成：

```js {1,5}
import {use} from 'react';

function Comments({commentsPromise}) {
  // `use` 将被暂停直到 promise 被解决.
  const comments = use(commentsPromise);
  return comments.map(comment => <p key={comment.id}>{comment}</p>);
}

function Page({commentsPromise}) {
  // 当“use”在注释中暂停时,
  // 将显示此悬念边界。
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Comments commentsPromise={commentsPromise} />
    </Suspense>
  )
}
```

<Note>

#### `use` 不支持在渲染中创建的 promises。 {/*use-does-not-support-promises-created-in-render*/}

如果你尝试将在渲染中创建的 promise 传递给 `use`，React 将发出警告：

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

A component was suspended by an uncached promise. Creating promises inside a Client Component or hook is not yet supported, except via a Suspense-compatible library or framework.

</ConsoleLogLine>

</ConsoleBlockMulti>

为了解决这个问题，你需要从支持 promise 缓存的 Suspense 强化库或框架中传递一个 promise。在未来，我们计划推出功能，使在渲染中缓存 promise 更加容易。

</Note>

你也可以使用 `use` 读取 context，这使你能够在如提前返回之后的情况下有条件地读取 Context：

```js {1,11}
import {use} from 'react';
import ThemeContext from './ThemeContext'

function Heading({children}) {
  if (children == null) {
    return null;
  }
  
  // 因为过早的返回
  // 这里 useContext 无法正常工作。
  const theme = use(ThemeContext);
  return (
    <h1 style={{color: theme.color}}>
      {children}
    </h1>
  );
}
```

`use` API 只能在渲染中被调用，类似于 hooks。与 hooks 不同，`use` 可以被有条件地调用。在未来，我们计划支持在渲染中使用 `use` 消费更多资源的方式。

有关更多信息，请参阅 [`use`](/reference/react/use) 文档。


## React 服务器组件 {/*react-server-components*/}

### 服务器组件 {/*server-components*/}

服务器组件是一种新的选项，允许在打包前提前渲染组件，在与你的客户端应用程序或 SSR 服务器不同的环境中。这个独立的环境就是 React 服务器组件中的 "服务器"。服务器组件可以在你的 CI 服务器上在构建时运行一次，或者可以在每次请求时使用 web 服务器运行。

React 19 包含了所有从 Canary 频道引入的 React 服务器组件功能。这意味着，现在可以将 React 19 作为 peer 依赖项来发布带有服务器组件的库，使用 `react-server` [导出条件](https://github.com/reactjs/rfcs/blob/main/text/0227-server-module-conventions.md#react-server-conditional-exports) 用于支持 [全栈 React 架构](/learn/start-a-new-react-project#which-features-make-up-the-react-teams-full-stack-architecture-vision) 的框架。


<Note>

#### 如何构建对服务器组件的支持? {/*how-do-i-build-support-for-server-components*/}

虽然 React 19 中的 React 服务器组件是稳定的，并且在主版本之间不会发生破坏，但用于实现 React 服务器组件打包器或框架的底层 API 不遵循 semver，并可能在 React 19.x 的小版本之间发生破坏。

为了支持 React 服务器组件作为打包器或框架，我们建议固定到特定的 React 版本，或者使用 Canary 发行版。我们将继续与打包器和框架合作，以稳定用于实现 React 服务器组件的 API。

</Note>


有关更多信息，请参阅文档 [React Server Components](/reference/rsc/server-components).

### 服务器操作 {/*server-actions*/}

服务器 Actions 允许客户端组件调用在服务器上执行的异步函数。

当使用 `"use server"` 指令定义服务器 Action 时，你的框架将自动创建一个指向服务器函数的引用，并将该引用传递给客户端组件。当在客户端调用该函数时，React 将向服务器发送一个请求来执行该函数，并返回结果。

<Note>

#### 服务器组件没有指令 {/*there-is-no-directive-for-server-components*/}

一个常见的误解是服务器组件由 `"use server"` 指示，但服务器组件没有指令。`"use server"` 指令用于服务器 Actions。

有关更多信息，请参阅 [指令](/reference/rsc/directives) 文档。

</Note>

服务器 Actions 可以在服务器组件中创建并作为 props 传递给客户端组件，或者可以在客户端组件中导入和使用。

有关更多信息，请参阅 [React 服务器 Actions](/reference/rsc/server-actions) 文档。

## React 19 中的改进 {/*improvements-in-react-19*/}

### `ref` 作为一个属性 {/*ref-as-a-prop*/}

从 React 19 开始，你现在可以在函数组件中将 `ref` 作为 prop 进行访问：

```js [[1, 1, "ref"], [1, 2, "ref", 45], [1, 6, "ref", 14]]
function MyInput({placeholder, ref}) {
  return <input placeholder={placeholder} ref={ref} />
}

//...
<MyInput ref={ref} />
```

新的函数组件将不再需要 `forwardRef`，我们将发布一个 codemod 来自动更新你的组件以使用新的 `ref` prop。在未来的版本中，我们将弃用并移除 `forwardRef`。

<Note>

在类组件中，`ref` 不作为 props 传递，因为它们引用的是组件实例。这意味着，如果你在类组件中需要访问 `ref`，你需要使用 `React.forwardRef` 或者 `React.createRef`。

</Note>

### 激活错误的差异 {/*diffs-for-hydration-errors*/}

在 `react-dom` 中，我们也改进了水合错误的错误报告。例如，现在不再在 DEV 中记录多个没有任何不匹配信息的错误：

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Warning: Text content did not match. Server: "Server" Client: "Client"
{'  '}at span
{'  '}at App

</ConsoleLogLine>

<ConsoleLogLine level="error">

Warning: An error occurred during hydration. The server HTML was replaced with client content in \<div\>.

</ConsoleLogLine>

<ConsoleLogLine level="error">

Warning: Text content did not match. Server: "Server" Client: "Client"
{'  '}at span
{'  '}at App

</ConsoleLogLine>

<ConsoleLogLine level="error">

Warning: An error occurred during hydration. The server HTML was replaced with client content in \<div\>.

</ConsoleLogLine>

<ConsoleLogLine level="error">

Uncaught Error: Text content does not match server-rendered HTML.
{'  '}at checkForUnmatchedText
{'  '}...

</ConsoleLogLine>

</ConsoleBlockMulti>

现在我们会记录一条带有不匹配差异的单一消息：


<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Uncaught Error: Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client. This can happen if an SSR-ed Client Component used:{'\n'}
\- A server/client branch `if (typeof window !== 'undefined')`.
\- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
\- Date formatting in a user's locale which doesn't match the server.
\- External changing data without sending a snapshot of it along with the HTML.
\- Invalid HTML tag nesting.{'\n'}
It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.{'\n'}
https://react.dev/link/hydration-mismatch {'\n'}
{'  '}\<App\>
{'    '}\<span\>
{'+    '}Client
{'-    '}Server{'\n'}
{'  '}at throwOnHydrationMismatch
{'  '}...

</ConsoleLogLine>

</ConsoleBlockMulti>

### `<Context>` 作为提供者 {/*context-as-a-provider*/}

在 React 19 中，你可以将 `<Context>` 渲染为提供者，就无需再使用 `<Context.Provider>` 了：


```js {5,7}
const ThemeContext = createContext('');

function App({children}) {
  return (
    <ThemeContext value="dark">
      {children}
    </ThemeContext>
  );  
}
```

新的 Context 提供者可以使用 `<Context>`，我们将发布一个 codemod 来转换现有的提供者。在未来的版本中，我们将弃用 `<Context.Provider>`。

### refs 支持清理函数 {/*cleanup-functions-for-refs*/}

这将使得在 `ref` 改变时执行清理操作变得更加容易。例如，你可以在 `ref` 改变时取消订阅事件：

```js {7-9}
<input
  ref={(ref) => {
    // ref 创建

    // 新特性: 当元素从 DOM 中被移除时
    // 返回一个清理函数来重置 ref
    return () => {
      // ref cleanup
    };
  }}
/>
```

当组件卸载时，React 将调用从 `ref` 回调返回的清理函数。这适用于 DOM refs，类组件的 refs，以及 `useImperativeHandle`。

<Note>

以前，当卸载组件时，React 会用 `null` 调用 `ref` 函数。如果你的 `ref` 返回一个清理函数，React 现在将跳过这一步。

在未来的版本中，我们将弃用在卸载组件时用 `null` 调用 refs。

</Note>

由于引入了 `ref` 清理函数，现在 TypeScript 将拒绝从 `ref` 回调中返回任何其他内容。通常的解决方法是停止使用隐式返回，例如：

```diff [[1, 1, "("], [1, 1, ")"], [2, 2, "{", 15], [2, 2, "}", 1]]
- <div ref={current => (instance = current)} />
+ <div ref={current => {instance = current}} />
```

原始代码返回了 `HTMLDivElement` 的实例，TypeScript 不知道这是否应该是一个清理函数，或者你是否不想返回一个清理函数。

你可以使用 [`no-implicit-ref-callback-return`](https://github.com/eps1lon/types-react-codemod/#no-implicit-ref-callback-return) 这个 codemod 来转换这种模式。

### `useDeferredValue` 初始化 value {/*use-deferred-value-initial-value*/}

我们为 `useDeferredValue` 添加了一个 `initialValue` 选项：

```js [[1, 1, "deferredValue"], [1, 4, "deferredValue"], [2, 4, "''"]]
function Search({deferredValue}) {
  // On initial render the value is ''.
  // Then a re-render is scheduled with the deferredValue.
  const value = useDeferredValue(deferredValue, '');
  
  return (
    <Results query={value} />
  );
}
````

当提供了 <CodeStep step={2}>initialValue</CodeStep>, `useDeferredValue` 将在组件的初始渲染中返回它作为 `value` , 并在后台安排一个使用返回的  <CodeStep step={1}>deferredValue</CodeStep> 重新渲染。

有关更多信息，请参阅 [`useDeferredValue`](/reference/react/useDeferredValue)。

### 支持文档元数据 {/*support-for-metadata-tags*/}

在 HTML 中，像 `<title>`、`<link>` 和 `<meta>` 这样的文档元数据标签被保留在文档的 `<head>` 部分。在 React 中，决定应用程序适合的元数据的组件可能与你渲染 `<head>` 的地方相距甚远，或者 React 根本不渲染 `<head>`。在过去，这些元素需要在效果中手动插入，或者通过像 [`react-helmet`](https://github.com/nfl/react-helmet) 这样的库，并在服务器渲染 React 应用程序时需要小心处理。

在 React 19 中，我们将原生支持在组件中渲染文档元数据标签：

```js {5-8}
function BlogPost({post}) {
  return (
    <article>
      <h1>{post.title}</h1>
      <title>{post.title}</title>
      <meta name="author" content="Josh" />
      <link rel="author" href="https://twitter.com/joshcstory/" />
      <meta name="keywords" content={post.keywords} />
      <p>
        Eee equals em-see-squared...
      </p>
    </article>
  );
}
```

当 React 渲染这个组件时，它会看到 `<title>`、`<link>` 和 `<meta>` 标签，并自动将它们提升到文档的 `<head>` 部分。通过原生支持这些元数据标签，我们能够确保它们与仅客户端应用、流式 SSR 和服务器组件一起工作。

<Note>

#### 你可能仍然需要一个元数据库 {/*you-may-still-want-a-metadata-library*/}

对于简单的用例，渲染文档元数据为标签可能是合适的，但库可以提供更强大的功能，如基于当前路由用特定的元数据覆盖通用元数据。这些功能使得像 [`react-helmet`](https://github.com/nfl/react-helmet) 这样的框架和库更容易支持元数据标签，而不是替换它们。

</Note>

有关更多信息，请参阅文档 [`<title>`](/reference/react-dom/components/title), [`<link>`](/reference/react-dom/components/link), and [`<meta>`](/reference/react-dom/components/meta).

### 支持样式表 {/*support-for-stylesheets*/}

样式表，无论是外部链接的 (`<link rel="stylesheet" href="...">`) 还是内联的 (`<style>...</style>`)，都需要在 DOM 中进行精确的定位，因为样式优先级规则。构建一个允许在组件内部进行组合的样式表功能是困难的，所以用户通常要么将所有的样式远离可能依赖它们的组件加载，要么使用一个封装了这种复杂性的样式库。

在 React 19 中，我们正在解决这个复杂性，并提供更深入的集成到客户端的并发渲染和服务器的流式渲染，内置支持样式表。如果你告诉 React 你的样式表的 `precedence`，它将管理样式表在 DOM 中的插入顺序，并确保在显示依赖于这些样式规则的内容之前加载样式表（如果是外部的）。

```js {4,5,17}
function ComponentOne() {
  return (
    <Suspense fallback="loading...">
      <link rel="stylesheet" href="foo" precedence="default" />
      <link rel="stylesheet" href="bar" precedence="high" />
      <article class="foo-class bar-class">
        {...}
      </article>
    </Suspense>
  )
}

function ComponentTwo() {
  return (
    <div>
      <p>{...}</p>
      <link rel="stylesheet" href="baz" precedence="default" />  <-- will be inserted between foo & bar
    </div>
  )
}
```

在服务器端渲染时，React 会在 `<head>` 中包含样式表，确保浏览器在加载完样式表之前不会进行绘制。如果在已经开始流式传输后才发现样式表，React 会确保在揭示依赖于该样式表的 Suspense 边界的内容之前，将样式表插入到客户端的 `<head>` 中。

在客户端渲染时，React 会等待新渲染的样式表加载完成后再提交渲染。如果你在应用程序的多个地方渲染此组件，React 会只在文档中包含一次样式表：

```js {5}
function App() {
  return <>
    <ComponentOne />
    ...
    <ComponentOne /> // won't lead to a duplicate stylesheet link in the DOM
  </>
}
```

对于习惯于手动加载样式表的用户来说，这是一个机会，可以将这些样式表放在依赖它们的组件旁边，从而更好地进行本地推理，并确保只加载你实际依赖的样式表。

样式库和与打包器的样式集成也可以采用这种新的功能，所以即使你不直接渲染你自己的样式表，你也可以从你的工具升级到使用这个特性中受益。

有关更多详细信息，请阅读 [`<link>`](/reference/react-dom/components/link) 和 [`<style>`](/reference/react-dom/components/style) 的文档。

### 支持异步脚本 {/*support-for-async-scripts*/}

在 HTML 中，普通脚本 (`<script src="...">`) 和延迟脚本 (`<script defer="" src="...">`) 按照文档顺序加载，这使得在组件树深处渲染这些类型的脚本变得具有挑战性。然而，异步脚本 (`<script async="" src="...">`) 将以任意顺序加载。

在 React 19 中，我们通过允许你在组件树的任何位置，即实际依赖脚本的组件内部，渲染它们，从而为异步脚本提供了更好的支持，无需管理脚本实例的重新定位和去重。

```js {4,15}
function MyComponent() {
  return (
    <div>
      <script async={true} src="..." />
      Hello World
    </div>
  )
}

function App() {
  <html>
    <body>
      <MyComponent>
      ...
      <MyComponent> // won't lead to duplicate script in the DOM
    </body>
  </html>
}
```

在所有渲染环境中，异步脚本将被去重，因此即使它被多个不同的组件渲染，React 也只会加载并执行脚本一次。

在服务器端渲染中，异步脚本将被包含在 `<head>` 中，并优先于阻塞绘制的更关键的资源，如样式表、字体和图片预加载。

有关更多详细信息，请阅读 [`<script>`](/reference/react-dom/components/script) 的文档。

### 支持预加载资源 {/*support-for-preloading-resources*/}

在初始文档加载和客户端更新时，尽早告诉浏览器它可能需要加载的资源，可以显著提高页面性能。

React 19 包含了一些新的 API，用于加载和预加载浏览器资源，使得构建不受资源加载效率影响的优秀体验变得尽可能容易。

```js
import { prefetchDNS, preconnect, preload, preinit } from 'react-dom'
function MyComponent() {
  preinit('https://.../path/to/some/script.js', {as: 'script' }) // loads and executes this script eagerly
  preload('https://.../path/to/font.woff', { as: 'font' }) // preloads this font
  preload('https://.../path/to/stylesheet.css', { as: 'style' }) // preloads this stylesheet
  prefetchDNS('https://...') // when you may not actually request anything from this host
  preconnect('https://...') // when you will request something but aren't sure what
}
```
```html
<!-- the above would result in the following DOM/HTML -->
<html>
  <head>
    <!-- links/scripts are prioritized by their utility to early loading, not call order -->
    <link rel="prefetch-dns" href="https://...">
    <link rel="preconnect" href="https://...">
    <link rel="preload" as="font" href="https://.../path/to/font.woff">
    <link rel="preload" as="style" href="https://.../path/to/stylesheet.css">
    <script async="" src="https://.../path/to/some/script.js"></script>
  </head>
  <body>
    ...
  </body>
</html>
```

这些 API 可以通过将像字体这样的额外资源的发现从样式表加载中移出来，优化初始页面加载。它们还可以通过预取预期导航使用的资源列表，然后在点击或甚至悬停时积极预加载这些资源，使客户端更新更快。

有关更多详细信息，请参阅 [资源预加载 API](/reference/react-dom#resource-preloading-apis)。

### 兼容第三方脚本和扩展 {/*compatibility-with-third-party-scripts-and-extensions*/}

我们改进了激活机制，以考虑第三方脚本和浏览器扩展。

在激活过程中，如果在客户端渲染的元素与从服务器获取的 HTML 中找到的元素不匹配，React 将强制进行客户端重新渲染以修复内容。以前，如果一个元素是由第三方脚本或浏览器扩展插入的，它会触发一个不匹配的错误并进行客户端渲染。

在 React 19 中，`<head>` 和 `<body>` 中的意外标签将被跳过，避免了不匹配的错误。如果 React 需要由于无关的激活不匹配而重新渲染整个文档，它将保留由第三方脚本和浏览器扩展插入的样式表。

### 更好的错误报告 {/*error-handling*/}

在 React 19 中，我们改进了错误处理，以消除重复并提供处理捕获和未捕获错误的选项。例如，当在由错误边界捕获的渲染中出现错误时，以前 React 会抛出两次错误（一次是原始错误，然后在自动恢复失败后再次抛出），然后调用 `console.error` 提供错误发生的信息。

这导致每个捕获的错误都有三个错误：

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Uncaught Error: hit
{'  '}at Throws
{'  '}at renderWithHooks
{'  '}...

</ConsoleLogLine>

<ConsoleLogLine level="error">

Uncaught Error: hit<span className="ms-2 text-gray-30">{'    <--'} Duplicate</span>
{'  '}at Throws
{'  '}at renderWithHooks
{'  '}...

</ConsoleLogLine>

<ConsoleLogLine level="error">

The above error occurred in the Throws component:
{'  '}at Throws
{'  '}at ErrorBoundary
{'  '}at App{'\n'}
React will try to recreate this component tree from scratch using the error boundary you provided, ErrorBoundary.

</ConsoleLogLine>

</ConsoleBlockMulti>

在 React 19 中，我们记录一个包含所有错误信息的单一错误：

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Error: hit
{'  '}at Throws
{'  '}at renderWithHooks
{'  '}...{'\n'}
The above error occurred in the Throws component:
{'  '}at Throws
{'  '}at ErrorBoundary
{'  '}at App{'\n'}
React will try to recreate this component tree from scratch using the error boundary you provided, ErrorBoundary.
{'  '}at ErrorBoundary
{'  '}at App

</ConsoleLogLine>

</ConsoleBlockMulti>

此段代码介绍了 React 19 中添加的两个新的根选项，用于补充 `onRecoverableError`：

- `onCaughtError`：当 React 在错误边界中捕获错误时调用。
- `onUncaughtError`：当抛出错误并且未被错误边界捕获时调用。
- `onRecoverableError`：当抛出错误并自动恢复时调用。

有关更多信息和示例，请参阅 [`createRoot`](/reference/react-dom/client/createRoot) 和 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) 的文档。

### 支持自定义元素 {/*support-for-custom-elements*/}

React 19 添加了对自定义元素的全面支持，并通过了 [Custom Elements Everywhere](https://custom-elements-everywhere.com/) 上的所有测试。

在过去的版本中，使用 React 中的自定义元素很困难，因为 React 将无法识别的 props 视为 HTML attribute 而不是 DOM property。在 React 19 中，我们添加了对 DOM property 的支持，该支持在客户端和 SSR 期间都有效，策略如下：

- **服务器端渲染**：传递给自定义元素的 props 将作为 HTML attribute 渲染，如果它们的类型是原始值，如 `string`、`number`，或者值为 `true`。具有非原始类型的 props，如 `object`、`symbol`、`function`，或者值为 `false` 的 props 将被省略。
- **客户端渲染**：匹配自定义元素实例上的属性的 props 将被赋值为 DOM property，否则它们将被赋值为 HTML attribute。

感谢 [Joey Arhar](https://github.com/josepharhar) 在 React 中推动自定义元素支持的设计和实现。

#### 如何升级 {/*how-to-upgrade*/}

请查看 [React 19 升级指南](/blog/2024/04/25/react-19-upgrade-guide) 以获取逐步指导和完整的破坏性和显著变化列表。



