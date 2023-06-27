---
title: <Fragment> (<>...</>)
---

<Intro>

`<Fragment>` 通常使用 `<>...</>` 代替，它们都允许你在不添加额外节点的情况下将子元素组合。

```js
<>
  <OneChild />
  <AnotherChild />
</>
```

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `<Fragment>` {/*fragment*/}

当你需要单个元素时，你可以使用 `<Fragment>` 将其他元素组合起来，使用 `<Fragment>` 组合后的元素不会对 DOM 产生影响，就像元素没有被组合一样。在大多数情况下，`<Fragment></Fragment>` 可以简写为空的 JSX 元素 `<></>`。

#### 参数 {/*props*/}

- **可选** `key`：列表中 `<Fragment>` 的可以拥有 [keys](/learn/rendering-lists#keeping-list-items-in-order-with-key)。

#### 注意事项 {/*caveats*/}

- 如果你要传递 `key` 给一个 `<Fragment>`，你不能使用 `<>...</>`，你必须从 `'react'` 中导入 `Fragment` 且表示为`<Fragment key={yourKey}>...</Fragment>`。

- 当你要从 `<><Child /></>` 转换为  `[<Child />]` 或 `<><Child /></>` 转换为 `<Child />`，React 并不会[重置 state](/learn/preserving-and-resetting-state)。这个规则只在一层深度的情况下生效，如果从 `<><><Child /></></>` 转换为 `<Child />` 则会重置 state。在[这里](https://gist.github.com/clemmy/b3ef00f9507909429d8aa0d3ee4f986b)查看更详细的介绍。

---

## 用法 {/*usage*/}

### 返回多个元素 {/*returning-multiple-elements*/}

使用 `Fragment` 或简写语法 `<>...</>` 将多个元素组合在一起，你可以使用它将多个元素等效于单个元素。例如，一个组件只能返回一个元素，但是可以使用 `Fragment` 将多个元素组合在一起，并作为一个元素返回：

```js {3,6}
function Post() {
  return (
    <>
      <PostTitle />
      <PostBody />
    </>
  );
}
```

`Fragment` 作用很大，它与将元素包裹在一个 DOM 容器中不同，使用 `Fragment` 对元素进行组合后不会影响布局和样式。如果你使用浏览器调试工具查看这个示例，你会发现所有的 `<h1>` 和 `<article>` DOM 节点都是没有父元素的兄弟节点：

<Sandpack>

```js
export default function Blog() {
  return (
    <>
      <Post title="An update" body="It's been a while since I posted..." />
      <Post title="My new blog" body="I am starting a new blog!" />
    </>
  )
}

function Post({ title, body }) {
  return (
    <>
      <PostTitle title={title} />
      <PostBody body={body} />
    </>
  );
}

function PostTitle({ title }) {
  return <h1>{title}</h1>
}

function PostBody({ body }) {
  return (
    <article>
      <p>{body}</p>
    </article>
  );
}
```

</Sandpack>

<DeepDive>

#### 如何使用完整的语法编写 `Fragment`？ {/*how-to-write-a-fragment-without-the-special-syntax*/}

这个示例从 React 中导入了 `Fragment`：

```js {1,5,8}
import { Fragment } from 'react';

function Post() {
  return (
    <Fragment>
      <PostTitle />
      <PostBody />
    </Fragment>
  );
}
```

通常你不需要这样，除非你需要将 [`key` 传递给 `Fragment`](#rendering-a-list-of-fragments)。

</DeepDive>

---

### 分配多个元素给一个变量 {/*assigning-multiple-elements-to-a-variable*/}

和其他元素一样，你可以将 `Fragment` 元素分配给变量，作为 props 传递等：

```js
function CloseDialog() {
  const buttons = (
    <>
      <OKButton />
      <CancelButton />
    </>
  );
  return (
    <AlertDialog buttons={buttons}>
      Are you sure you want to leave this page?
    </AlertDialog>
  );
}
```

---

### 组合文本与组件 {/*grouping-elements-with-text*/}

你可以使用 `Fragment` 将文本与组件组合在一起：

```js
function DateRangePicker({ start, end }) {
  return (
    <>
      From
      <DatePicker date={start} />
      to
      <DatePicker date={end} />
    </>
  );
}
```

---

### 渲染 `Fragment` 列表 {/*rendering-a-list-of-fragments*/}

在这种情况下，你需要显式地表示为 `Fragment`，而不是使用简写语法 `<></>`。当你在[循环中渲染多个元素](/learn/rendering-lists)时，你需要为每一个元素分配一个 `key`。如果这个元素为 `Fragment` 时，则需要使用普通的 JSX 语法来提供 `key` 属性。

```js {3,6}
function Blog() {
  return posts.map(post =>
    <Fragment key={post.id}>
      <PostTitle title={post.title} />
      <PostBody body={post.body} />
    </Fragment>
  );
}
```

你可以查看 DOM 以验证组合后的子元素实际上并没有父元素 `Fragment`：

<Sandpack>

```js
import { Fragment } from 'react';

const posts = [
  { id: 1, title: 'An update', body: "It's been a while since I posted..." },
  { id: 2, title: 'My new blog', body: 'I am starting a new blog!' }
];

export default function Blog() {
  return posts.map(post =>
    <Fragment key={post.id}>
      <PostTitle title={post.title} />
      <PostBody body={post.body} />
    </Fragment>
  );
}

function PostTitle({ title }) {
  return <h1>{title}</h1>
}

function PostBody({ body }) {
  return (
    <article>
      <p>{body}</p>
    </article>
  );
}
```

</Sandpack>
