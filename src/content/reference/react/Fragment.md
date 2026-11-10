---
title: <Fragment> (<>...</>)
---

<Intro>

`<Fragment>` 通常使用 `<>...</>` 代替，它们都允许你在不添加额外节点的情况下将子元素组合。

<Canary>Fragment 也可以接收 ref，使你能够与底层 DOM 节点交互，而无需添加额外的包装元素。参见下方的参考和用法。</Canary>

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
- <CanaryBadge />  **可选** `ref`：一个 ref 对象（例如来自 [`useRef`](/reference/react/useRef)）或[回调函数](/reference/react-dom/components/common#ref-callback)。React 提供一个 `FragmentInstance` 作为 ref 值，该对象实现了用于与 Fragment 包裹的 DOM 节点交互的方法。

### <CanaryBadge /> FragmentInstance {/*fragmentinstance*/}

当你将 ref 传递给 Fragment 时，React 会提供一个 `FragmentInstance` 对象，其中包含用于与 Fragment 包裹的 DOM 节点进行交互的方法：

**事件处理方法**：
- `addEventListener(type, listener, options?)`：向 Fragment 的所有第一级 DOM 子元素添加事件监听器。
- `removeEventListener(type, listener, options?)`：从 Fragment 的所有第一级 DOM 子元素中移除事件监听器。
- `dispatchEvent(event)`：向 Fragment 的虚拟子元素分发事件以调用任何已添加的监听器，并且可以冒泡到 DOM 父元素。

**布局方法**：
- `compareDocumentPosition(otherNode)`：比较 Fragment 与另一个节点的文档位置。
  - 如果 Fragment 有子元素，则返回原生的 `compareDocumentPosition` 值。
  - 空的 Fragment 会尝试在 React 树中比较位置，并包含 `Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC`。
  - 由于 portal 或其他插入方式导致在 React 树和 DOM 树中关系不同的元素，将返回 `Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC`。
- `getClientRects()`：返回一个扁平数组，包含表示所有子元素边界矩形的 `DOMRect` 对象。
- `getRootNode()`：返回包含 Fragment 父 DOM 节点的根节点。

**焦点管理方法**：
- `focus(options?)`：聚焦 Fragment 中的第一个可聚焦 DOM 节点。会以深度优先的方式尝试聚焦嵌套的子元素。
- `focusLast(options?)`：聚焦 Fragment 中的最后一个可聚焦 DOM 节点。会以深度优先的方式尝试聚焦嵌套的子元素。
- `blur()`：如果 `document.activeElement` 在 Fragment 内部，则移除焦点。

**观察者方法**：
- `observeUsing(observer)`：使用 IntersectionObserver 或 ResizeObserver 开始观察 Fragment 的 DOM 子元素。
- `unobserveUsing(observer)`：停止使用指定的观察者观察 Fragment 的 DOM 子元素。

#### 注意事项 {/*caveats*/}

- 如果你要传递 `key` 给一个 `<Fragment>`，你不能使用 `<>...</>`，你必须从 `'react'` 中导入 `Fragment` 且表示为`<Fragment key={yourKey}>...</Fragment>`。

- 当你要从 `<><Child /></>` 转换为  `[<Child />]` 或 `<><Child /></>` 转换为 `<Child />`，React 并不会[重置 state](/learn/preserving-and-resetting-state)。这个规则只在一层深度的情况下生效，如果从 `<><><Child /></></>` 转换为 `<Child />` 则会重置 state。在[这里](https://gist.github.com/clemmy/b3ef00f9507909429d8aa0d3ee4f986b)查看更详细的介绍。

- <CanaryBadge /> 如果你想向 Fragment 传递 `ref`，则不能使用 `<>...</>` 语法。你必须显式地从 `'react'` 中导入 `Fragment` 并渲染 `<Fragment ref={yourRef}>...</Fragment>`。

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
      <Post title="一则更新" body="距离我上次发帖已经有一段时间了..." />
      <Post title="我的新博客" body="我开始了新的博客！" />
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
      你确定要离开此页面吗？
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
      从
      <DatePicker date={start} />
      到
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

---

### <CanaryBadge /> 使用 Fragment ref 进行 DOM 交互 {/*using-fragment-refs-for-dom-interaction*/}

Fragment ref 允许你与 Fragment 包裹的 DOM 节点进行交互，而无需添加额外的包装元素。这对于事件处理、可见性跟踪、焦点管理以及替代已弃用的模式（如 `ReactDOM.findDOMNode()`）非常有用。

```js
import { Fragment } from 'react';

function ClickableFragment({ children, onClick }) {
  return (
    <Fragment ref={fragmentInstance => {
      fragmentInstance.addEventListener('click', handleClick);
      return () => fragmentInstance.removeEventListener('click', handleClick);
    }}>
      {children}
    </Fragment>
  );
}
```
---

### <CanaryBadge /> 使用 Fragment ref 跟踪可见性 {/*tracking-visibility-with-fragment-refs*/}

Fragment ref 对于可见性跟踪和交叉观察非常有用。这使你能够监控内容何时变为可见，而无需子组件暴露 ref：

```js {19,21,31-34}
import { Fragment, useRef, useLayoutEffect } from 'react';

function VisibilityObserverFragment({ threshold = 0.5, onVisibilityChange, children }) {
  const fragmentRef = useRef(null);

  useLayoutEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        onVisibilityChange(entries.some(entry => entry.isIntersecting))
      },
      { threshold }
    );

    fragmentRef.current.observeUsing(observer);
    return () => fragmentRef.current.unobserveUsing(observer);
  }, [threshold, onVisibilityChange]);

  return (
    <Fragment ref={fragmentRef}>
      {children}
    </Fragment>
  );
}

function MyComponent() {
  const handleVisibilityChange = (isVisible) => {
    console.log('组件', isVisible ? '可见' : '已隐藏');
  };

  return (
    <VisibilityObserverFragment onVisibilityChange={handleVisibilityChange}>
      <SomeThirdPartyComponent />
      <AnotherComponent />
    </VisibilityObserverFragment>
  );
}
```

这种模式是基于 Effect 的可见性日志记录的替代方案，后者在大多数情况下是一种反模式。仅依赖 Effect 并不能保证渲染的组件对用户可见。

---

### <CanaryBadge /> 使用 Fragment ref 管理焦点 {/*focus-management-with-fragment-refs*/}

Fragment ref 提供了焦点管理方法，可作用于 Fragment 内的所有 DOM 节点：

```js
import { Fragment, useRef } from 'react';

function FocusFragment({ children }) {
  return (
    <Fragment ref={(fragmentInstance) => fragmentInstance?.focus()}>
      {children}
    </Fragment>
  );
}
```

`focus()` 方法聚焦 Fragment 内的第一个可聚焦元素，而 `focusLast()` 聚焦最后一个可聚焦元素。
