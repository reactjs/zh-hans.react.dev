---
title: <Activity>
---

<Intro>

`<Activity>` 允许你隐藏并恢复其子组件的 UI 以及内部状态。

```js
<Activity mode={visibility}>
  <Sidebar />
</Activity>
```

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `<Activity>` {/*activity*/}

你可以使用 Activity 来隐藏应用中的部分内容

```js [[1, 1, "\\"hidden\\""], [2, 2, "<Sidebar />"], [3, 1, "\\"visible\\""]]
<Activity mode={isShowingSidebar ? "visible" : "hidden"}>
  <Sidebar />
</Activity>
```

当 Activity 边界被 <CodeStep step={1}>隐藏</CodeStep> 时，React 会使用 CSS 属性 `display: "none"` 从视觉上隐藏 <CodeStep step={2}>其子组件</CodeStep>。同时，React 还会销毁它们的 Effect，并清理所有活跃的订阅。

在隐藏期间，子组件仍会响应新 Props 的变化而进行重新渲染，但其优先级会低于页面上的其他内容。

当边界再次变为 <CodeStep step={3}>可见</CodeStep> 时，React 会将子组件重新显示，并恢复它们之前的状态，同时重新创建它们的 Effect。

通过这种方式，`Activity` 可以被视为一种渲染“后台活动”的机制。与其完全丢弃那些可能再次显示的内容，不如使用 `Activity` 来保持并恢复这些内容的 UI 和内部状态，同时确保隐藏的内容不会产生多余的副作用。

[请参阅下方的更多示例]。(#usage)

#### Props {/*props*/}

* `children`： 你想要显示或隐藏的 UI。
* `mode`： 字符串值，取值为 `'visible'` 或 `'hidden'`。如果省略，默认值为 `'visible'`。

#### Caveats {/*caveats*/}

- 如果 Activity 被渲染在 [ViewTransition](/reference/react/ViewTransition) 内部，并且由于 [startTransition](/reference/react/startTransition) 触发的更新而变为可见，它将触发 ViewTransition 的 `enter` 动画。如果它变为隐藏，则会触发其 `exit` 动画。
- 仅渲染文本的 `Activity` 不会渲染出任何内容，而不是渲染出“隐藏的文本”，因为没有相应的 DOM 元素可以应用可见性变化。例如，对于 `const ComponentThatJustReturnsText = () => "Hello, World!"`，执行 `<Activity mode="hidden"><ComponentThatJustReturnsText /></Activity>` 在 DOM 中不会产生任何输出。

---

## 用法 {/*usage*/}

### 恢复隐藏组件的状态 {/*restoring-the-state-of-hidden-components*/}

在 React 中，当你想要根据某个条件来显示或隐藏一个组件时，通常会基于该条件对其进行挂载或卸载：

```jsx
{isShowingSidebar && (
  <Sidebar />
)}
```

但卸载一个组件会销毁其内部状态，而这并不总是你想要的效果。

相比之下，当你使用 `Activity` 边界来隐藏组件时，React 会将其状态“保存”起来以便后续使用：

```jsx
<Activity mode={isShowingSidebar ? "visible" : "hidden"}>
  <Sidebar />
</Activity>
```

这使得隐藏组件并随后将其恢复到之前的状态成为可能。

下方的示例包含一个带有可展开部分的侧边栏。你可以点击 Overview 来展开下方的三个子项。应用主区域还有一个可以隐藏或显示侧边栏的按钮。

试着展开 Overview 部分，然后将侧边栏切换为关闭，再重新打开：

<Sandpack>

```js src/App.js active
import { useState } from 'react';
import Sidebar from './Sidebar.js';

export default function App() {
  const [isShowingSidebar, setIsShowingSidebar] = useState(true);

  return (
    <>
      {isShowingSidebar && (
        <Sidebar />
      )}

      <main>
        <button onClick={() => setIsShowingSidebar(!isShowingSidebar)}>
          Toggle sidebar
        </button>
        <h1>Main content</h1>
      </main>
    </>
  );
}
```

```js src/Sidebar.js
import { useState } from 'react';

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <nav>
      <button onClick={() => setIsExpanded(!isExpanded)}>
        Overview
        <span className={`indicator ${isExpanded ? 'down' : 'right'}`}>
          &#9650;
        </span>
      </button>

      {isExpanded && (
        <ul>
          <li>Section 1</li>
          <li>Section 2</li>
          <li>Section 3</li>
        </ul>
      )}
    </nav>
  );
}
```

```css
body { height: 275px; margin: 0; }
#root {
  display: flex;
  gap: 10px;
  height: 100%;
}
nav {
  padding: 10px;
  background: #eee;
  font-size: 14px;
  height: 100%;
}
main {
  padding: 10px;
}
p {
  margin: 0;
}
h1 {
  margin-top: 10px;
}
.indicator {
  margin-left: 4px;
  display: inline-block;
  rotate: 90deg;
}
.indicator.down {
  rotate: 180deg;
}
```

</Sandpack>

Overview 部分最初总是处于折叠状态。因为当 `isShowingSidebar` 切换为 `false` 时，我们会卸载侧边栏，这导致其所有的内部状态都丢失了

这是 `Activity` 的一个完美用例。即使在视觉上隐藏侧边栏时，我们也可以保留其内部状态。

让我们用 `Activity` 边界来替换侧边栏的条件渲染：

```jsx {7,9}
// Before
{isShowingSidebar && (
  <Sidebar />
)}

// After
<Activity mode={isShowingSidebar ? 'visible' : 'hidden'}>
  <Sidebar />
</Activity>
```

然后看看新的行为表现：

<Sandpack>

```js src/App.js active
import { Activity, useState } from 'react';

import Sidebar from './Sidebar.js';

export default function App() {
  const [isShowingSidebar, setIsShowingSidebar] = useState(true);

  return (
    <>
      <Activity mode={isShowingSidebar ? 'visible' : 'hidden'}>
        <Sidebar />
      </Activity>

      <main>
        <button onClick={() => setIsShowingSidebar(!isShowingSidebar)}>
          Toggle sidebar
        </button>
        <h1>Main content</h1>
      </main>
    </>
  );
}
```

```js src/Sidebar.js
import { useState } from 'react';

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <nav>
      <button onClick={() => setIsExpanded(!isExpanded)}>
        Overview
        <span className={`indicator ${isExpanded ? 'down' : 'right'}`}>
          &#9650;
        </span>
      </button>

      {isExpanded && (
        <ul>
          <li>Section 1</li>
          <li>Section 2</li>
          <li>Section 3</li>
        </ul>
      )}
    </nav>
  );
}
```

```css
body { height: 275px; margin: 0; }
#root {
  display: flex;
  gap: 10px;
  height: 100%;
}
nav {
  padding: 10px;
  background: #eee;
  font-size: 14px;
  height: 100%;
}
main {
  padding: 10px;
}
p {
  margin: 0;
}
h1 {
  margin-top: 10px;
}
.indicator {
  margin-left: 4px;
  display: inline-block;
  rotate: 90deg;
}
.indicator.down {
  rotate: 180deg;
}
```

</Sandpack>

现在，侧边栏的内部状态可以被成功恢复，且无需对其实现逻辑做任何修改。

---

### 恢复隐藏组件的 DOM {/*restoring-the-dom-of-hidden-components*/}

由于 `Activity` 边界使用 `display: none` 来隐藏其子组件，因此这些子组件的 DOM 在隐藏时也会被保留。这使得它们非常适合用于维护 UI 中那些用户可能会再次交互的部分的瞬时状态。

在此示例中，`Contact` 标签页包含一个 `<textarea>`，用户可以在其中输入消息。如果你输入了一些文本，切换到 `Home` 标签页，然后再切回 `Contact` 标签页，那么草稿消息将会丢失：

<Sandpack>

```js src/App.js
import { useState } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Contact from './Contact.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('contact');

  return (
    <>
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        Home
      </TabButton>
      <TabButton
        isActive={activeTab === 'contact'}
        onClick={() => setActiveTab('contact')}
      >
        Contact
      </TabButton>

      <hr />

      {activeTab === 'home' && <Home />}
      {activeTab === 'contact' && <Contact />}
    </>
  );
}
```

```js src/TabButton.js
export default function TabButton({ onClick, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```js src/Home.js
export default function Home() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/Contact.js active
export default function Contact() {
  return (
    <div>
      <p>Send me a message!</p>

      <textarea />

      <p>You can find me online here:</p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </div>
  );
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

这是因为我们在 `App` 组件中完全卸载了 `Contact`。当`Contact`组标签页被卸载时，`<textarea>` 元素的内部 DOM 状态也就丢失了。

如果我们改用 `Activity` 边界来显示和隐藏当前活跃的标签页，我们就能保留每个标签页的 DOM 状态。试着再次输入文本并切换标签页，你会发现草稿消息不再被重置：

<Sandpack>

```js src/App.js active
import { Activity, useState } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Contact from './Contact.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('contact');

  return (
    <>
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        Home
      </TabButton>
      <TabButton
        isActive={activeTab === 'contact'}
        onClick={() => setActiveTab('contact')}
      >
        Contact
      </TabButton>

      <hr />

      <Activity mode={activeTab === 'home' ? 'visible' : 'hidden'}>
        <Home />
      </Activity>
      <Activity mode={activeTab === 'contact' ? 'visible' : 'hidden'}>
        <Contact />
      </Activity>
    </>
  );
}
```

```js src/TabButton.js
export default function TabButton({ onClick, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```js src/Home.js
export default function Home() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/Contact.js
export default function Contact() {
  return (
    <div>
      <p>Send me a message!</p>

      <textarea />

      <p>You can find me online here:</p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </div>
  );
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

同样地，`Activity` 边界让我们能够在不改变 `Contact` 标签页实现逻辑的情况下，保留其内部状态。

---

### 预渲染可能变为可见的内容 {/*pre-rendering-content-thats-likely-to-become-visible*/}

到目前为止，我们已经了解了 `Activity` 是如何在隐藏用户交互过的内容的同时，而不丢弃这些内容的瞬时状态（ephemeral state）的。

不仅如此，`Activity` 边界还可以用来预先**准备**那些用户尚未初次看到的内容：

```jsx [[1, 1, "\\"hidden\\""]]
<Activity mode="hidden">
  <SlowComponent />
</Activity>
```

当 `Activity` 边界在初次渲染时处于 <CodeStep step={1}>隐藏</CodeStep> 状态，其子组件虽然不会在页面上显示，但它们**仍会被渲染**。不过，它们的渲染优先级会低于可见内容，且不会挂载它们的 Effect。

这种“**预渲染**”允许子组件提前加载所需的任何代码或数据。这样一来，当随后 `Activity` 边界变为可见时，子组件就能以更短的加载时间实现更快的呈现。

让我们来看一个示例。

在此演示中，`Posts` 标签页会加载一些数据。如果你点击它，在获取数据的过程中，你会看到显示出的 `Suspense` 回退内容：

<Sandpack>

```js src/App.js
import { useState, Suspense } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Posts from './Posts.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <>
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        Home
      </TabButton>
      <TabButton
        isActive={activeTab === 'posts'}
        onClick={() => setActiveTab('posts')}
      >
        Posts
      </TabButton>

      <hr />

      <Suspense fallback={<h1>🌀 Loading...</h1>}>
        {activeTab === 'home' && <Home />}
        {activeTab === 'posts' && <Posts />}
      </Suspense>
    </>
  );
}
```

```js src/TabButton.js hidden
export default function TabButton({ onClick, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```js src/Home.js
export default function Home() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/Posts.js
import { use } from 'react';
import { fetchData } from './data.js';

export default function Posts() {
  const posts = use(fetchData('/posts'));

  return (
    <ul className="items">
      {posts.map(post =>
        <li className="item" key={post.id}>
          {post.title}
        </li>
      )}
    </ul>
  );
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/posts')) {
    return await getPosts();
  } else {
    throw Error('Not implemented');
  }
}

async function getPosts() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 10; i++) {
    posts.push({
      id: i,
      title: 'Post #' + (i + 1)
    });
  }
  return posts;
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
video { width: 300px; margin-top: 10px; aspect-ratio: 16/9; }
```

</Sandpack>

这是因为 `App` 组件直到 `Posts` 标签页变为活跃状态时才会挂载 `Posts`

如果我们更新 `App`，改用 `Activity` 边界来显示和隐藏活跃标签页，那么 `Posts` 将在应用初始加载时被预渲染，从而允许它在变得可见之前就获取到所需数据。

现在试着点击 `Posts` 标签页：

<Sandpack>

```js src/App.js
import { Activity, useState, Suspense } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Posts from './Posts.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <>
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        Home
      </TabButton>
      <TabButton
        isActive={activeTab === 'posts'}
        onClick={() => setActiveTab('posts')}
      >
        Posts
      </TabButton>

      <hr />

      <Suspense fallback={<h1>🌀 Loading...</h1>}>
        <Activity mode={activeTab === 'home' ? 'visible' : 'hidden'}>
          <Home />
        </Activity>
        <Activity mode={activeTab === 'posts' ? 'visible' : 'hidden'}>
          <Posts />
        </Activity>
      </Suspense>
    </>
  );
}
```

```js src/TabButton.js hidden
export default function TabButton({ onClick, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```js src/Home.js
export default function Home() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/Posts.js
import { use } from 'react';
import { fetchData } from './data.js';

export default function Posts() {
  const posts = use(fetchData('/posts'));

  return (
    <ul className="items">
      {posts.map(post =>
        <li className="item" key={post.id}>
          {post.title}
        </li>
      )}
    </ul>
  );
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/posts')) {
    return await getPosts();
  } else {
    throw Error('Not implemented');
  }
}

async function getPosts() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 10; i++) {
    posts.push({
      id: i,
      title: 'Post #' + (i + 1)
    });
  }
  return posts;
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
video { width: 300px; margin-top: 10px; aspect-ratio: 16/9; }
```

</Sandpack>

多亏了处于隐藏状态的 `Activity` 边界，`Posts` 组件才能够预先做好准备，从而实现更快的渲染。

---

使用隐藏的 `Activity` 边界来预渲染组件，是一种强大的优化手段，能够显著减少 UI 中那些用户接下来很可能与之交互的部分的加载时间。

<Note>

**只有支持 `Suspense` 的数据源才会在预渲染期间被获取。** 它们包括：

- 使用支持 `Suspense` 的框架进行数据获取，例如[Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) 和 [Next.js](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming#streaming-with-suspense)
- 使用 [`lazy`](/reference/react/lazy) 延迟加载（Lazy-loading）组件代码
- 使用 [`use`](/reference/react/use) 读取缓存的 Promise 的值

`Activity` **无法**检测到在 Effect 内部获取的数据。

你在上述 `Posts` 组件中加载数据的具体方式取决于你所使用的框架。如果你使用的是支持 `Suspense` 的框架，你可以在其数据获取文档中找到相关细节。

目前尚不支持在不使用集成框架的情况下，直接进行支持 `Suspense` 的数据获取。实现支持 `Suspense` 的数据源的相关要求尚不稳定且未记录在文档中。用于将数据源与 `Suspense` 集成的官方 API 将在 React 的未来版本中发布。

</Note>

---


### 加快页面加载过程中的交互速度 {/*speeding-up-interactions-during-page-load*/}

React 包含一项名为“选择性注水”的底层性能优化。它的工作原理是 **分块** 注水应用的初始 HTML，从而使部分组件即使在页面上其他组件的代码或数据尚未加载完成时，也能先变得可交互。

`Suspense` 边界参与了“选择性注水”，因为它们很自然地将你的组件树划分成了彼此独立的单元：

```jsx
function Page() {
  return (
    <>
      <MessageComposer />

      <Suspense fallback="Loading chats...">
        <Chats />
      </Suspense>
    </>
  )
}
```

在这里，`MessageComposer` 组件可以在页面的初始渲染期间完成完整的注水，即便此时 `Chats` 组件尚未挂载且还未开始获取数据。

因此，通过将组件树拆分为离散的单元，`Suspense` 允许 React 将应用在服务端渲染的 HTML 进行分块注水，从而使应用的各个部分能够尽可能快地变得可交互。

但是，对于那些没有使用 `Suspense` 的页面又该怎么办呢？

以这个标签页示例为例：

```jsx
function Page() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <>
      <TabButton onClick={() => setActiveTab('home')}>
        Home
      </TabButton>
      <TabButton onClick={() => setActiveTab('video')}>
        Video
      </TabButton>

      {activeTab === 'home' && (
        <Home />
      )}
      {activeTab === 'video' && (
        <Video />
      )}
    </>
  )
}
```

在这种情况下，React 必须一次性对整个页面进行注水。如果 `Home` 或 `Video` 的渲染速度较慢，它们可能会导致标签页按钮在注水期间感觉响应迟钝。

在活跃的标签页周围添加 `Suspense` 可以解决这个问题：

```jsx {13,20}
function Page() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <>
      <TabButton onClick={() => setActiveTab('home')}>
        Home
      </TabButton>
      <TabButton onClick={() => setActiveTab('video')}>
        Video
      </TabButton>

      <Suspense fallback={<Placeholder />}>
        {activeTab === 'home' && (
          <Home />
        )}
        {activeTab === 'video' && (
          <Video />
        )}
      </Suspense>
    </>
  )
}
```

……但这同时也会改变 UI 表现，因为在初始渲染期间会显示 `Placeholder` 回退内容

相反，我们可以使用 `Activity`。由于 `Activity` 边界负责显示和隐藏其子组件，它们已经自然地将组件树划分成了彼此独立的单元。而且与 `Suspense` 一样，这一特性使得它们能够参与到“选择性注水（Selective Hydration）”中。

让我们更新示例，在活跃的标签页周围使用 `Activity` 边界：

```jsx {13-18}
function Page() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <>
      <TabButton onClick={() => setActiveTab('home')}>
        Home
      </TabButton>
      <TabButton onClick={() => setActiveTab('video')}>
        Video
      </TabButton>

      <Activity mode={activeTab === "home" ? "visible" : "hidden"}>
        <Home />
      </Activity>
      <Activity mode={activeTab === "video" ? "visible" : "hidden"}>
        <Video />
      </Activity>
    </>
  )
}
```

现在，我们初始的服务端渲染HTML 看起来与原始版本完全一致；但多亏了 `Activity`，React 可以优先对标签页按钮进行注水，甚至在挂载 `Home` 或 `Video` 组件之前就完成这一操作。

---

因此，除了显示和隐藏内容外，`Activity` 边界还通过告知 React 哪些页面部分可以被独立地激活，从而帮助提升应用在注水期间的性能。

而且，即便你的组件从不隐藏任何内容，你仍然可以添加“始终可见”的 `Activity` 边界来优化注水性能：

```jsx
function Page() {
  return (
    <>
      <Post />

      <Activity>
        <Comments />
      </Activity>
    </>
  );
}
```

---

## 疑难解答 {/*troubleshooting*/}

### 隐藏组件产生了非预期的副作用 {/*my-hidden-components-have-unwanted-side-effects*/}

`Activity` 边界通过在其子组件上设置 `display: none` 并清理它们所有的 Effect 来隐藏内容。因此，大多数遵循最佳实践、能够正确清理自身副作用的 React 组件，在被 `Activity` 隐藏时都具有足够的健壮性。

但是，也**确实存在**一些情况下，隐藏组件的表现与卸载组件确实有所不同。最显著的一点是：由于隐藏组件的 DOM 并没有被销毁，来自该 DOM 的任何副作用都将持续存在，即便在组件被隐藏之后也是如此。

以 `<video>` 标签为例。通常它不需要任何显式的清理逻辑，因为即使你正在播放视频，卸载该标签也会让浏览器自动停止视频和音频的播放。在下面这个演示中，请试着播放视频，然后点击 `Home` 组件：

<Sandpack>

```js src/App.js active
import { useState } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Video from './Video.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('video');

  return (
    <>
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        Home
      </TabButton>
      <TabButton
        isActive={activeTab === 'video'}
        onClick={() => setActiveTab('video')}
      >
        Video
      </TabButton>

      <hr />

      {activeTab === 'home' && <Home />}
      {activeTab === 'video' && <Video />}
    </>
  );
}
```

```js src/TabButton.js hidden
export default function TabButton({ onClick, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```js src/Home.js
export default function Home() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/Video.js
export default function Video() {
  return (
    <video
      // 'Big Buck Bunny' licensed under CC 3.0 by the Blender foundation. Hosted by archive.org
      src="https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4"
      controls
      playsInline
    />

  );
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
video { width: 300px; margin-top: 10px; aspect-ratio: 16/9; }
```

</Sandpack>

视频如预期般停止播放。

现在，假设我们想要保留用户最后观看的时间点，以便当他们切回 `Video` 标签页时，视频不会从头开始播放。

这正是 `Activity` 的绝佳用例！

让我们更新 `App` 组件，使用隐藏的 `Activity` 边界来隐藏非活跃标签页，而不是将其卸载，看看这次演示的表现如何：

<Sandpack>

```js src/App.js active
import { Activity, useState } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Video from './Video.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('video');

  return (
    <>
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        Home
      </TabButton>
      <TabButton
        isActive={activeTab === 'video'}
        onClick={() => setActiveTab('video')}
      >
        Video
      </TabButton>

      <hr />

      <Activity mode={activeTab === 'home' ? 'visible' : 'hidden'}>
        <Home />
      </Activity>
      <Activity mode={activeTab === 'video' ? 'visible' : 'hidden'}>
        <Video />
      </Activity>
    </>
  );
}
```

```js src/TabButton.js hidden
export default function TabButton({ onClick, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```js src/Home.js
export default function Home() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/Video.js
export default function Video() {
  return (
    <video
      controls
      playsInline
      // 'Big Buck Bunny' licensed under CC 3.0 by the Blender foundation. Hosted by archive.org
      src="https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4"
    />

  );
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
video { width: 300px; margin-top: 10px; aspect-ratio: 16/9; }
```

</Sandpack>

糟糕！即便在被隐藏之后，视频和音频仍在继续播放，因为该标签页的 `<video>` 元素依然存在于 DOM 中。

为了修复这个问题，我们可以添加一个带有清理函数的 Effect，用于暂停视频播放：

```jsx {2,4-10,14}
export default function VideoTab() {
  const ref = useRef();

  useLayoutEffect(() => {
    const videoRef = ref.current;

    return () => {
      videoRef.pause()
    }
  }, []);

  return (
    <video
      ref={ref}
      controls
      playsInline
      src="..."
    />

  );
}
```

我们调用 `useLayoutEffect` 而不是 `useEffect`，是因为从概念上讲，清理代码是与组件 UI 的“视觉隐藏”紧密绑定的。如果我们使用普通的 Effect，代码逻辑可能会因为（例如）某个正在重新挂起的 `Suspense` 边界或视图过渡而发生延迟。

让我们看看新的表现。试着播放视频，切换到 `Home` 标签页，然后再切换回 `Video` 标签页：

<Sandpack>

```js src/App.js active
import { Activity, useState } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Video from './Video.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('video');

  return (
    <>
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        Home
      </TabButton>
      <TabButton
        isActive={activeTab === 'video'}
        onClick={() => setActiveTab('video')}
      >
        Video
      </TabButton>

      <hr />

      <Activity mode={activeTab === 'home' ? 'visible' : 'hidden'}>
        <Home />
      </Activity>
      <Activity mode={activeTab === 'video' ? 'visible' : 'hidden'}>
        <Video />
      </Activity>
    </>
  );
}
```

```js src/TabButton.js hidden
export default function TabButton({ onClick, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```js src/Home.js
export default function Home() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/Video.js
import { useRef, useLayoutEffect } from 'react';

export default function Video() {
  const ref = useRef();

  useLayoutEffect(() => {
    const videoRef = ref.current

    return () => {
      videoRef.pause()
    };
  }, [])

  return (
    <video
      ref={ref}
      controls
      playsInline
      // 'Big Buck Bunny' licensed under CC 3.0 by the Blender foundation. Hosted by archive.org
      src="https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4"
    />

  );
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
video { width: 300px; margin-top: 10px; aspect-ratio: 16/9; }
```

</Sandpack>

效果非常棒！我们的清理函数确保了当视频被 `Activity` 边界隐藏时会停止播放；更棒的是，由于 `<video>` 标签从未被销毁，播放时间点得以保留，而且当用户切回并继续观看时，视频本身无需重新初始化或重新下载。

这是一个使用 `Activity` 为那些会被隐藏、但用户很可能很快再次与之交互的 UI 部分保留“瞬时 DOM 状态”的绝佳示例。

---

我们的示例说明了对于像 `<video>` 这样的特定标签，卸载和隐藏的行为是不同的。如果一个组件渲染的 DOM 带有某种副作用，且你希望在 `Activity` 边界将其隐藏时阻止该副作用，请添加一个带有返回函数的 Effect 来进行清理。

这种情况最常见于以下标签：

  - `<video>`
  - `<audio>`
  - `<iframe>`

不过，通常情况下，你的大多数 React 组件应该已经具备了被 `Activity` 边界隐藏的健壮性。并且从概念上讲，你应该将“隐藏”状态的 `Activity` 视为已被“卸载”。

为了能及早发现其他没有正确清理逻辑的 Effect（这不仅对 `Activity` 边界至关重要，对 React 的许多其他行为也同样重要），我们建议使用 [`<StrictMode>`](/reference/react/StrictMode).

---


### 隐藏组件中的 Effect 没有运行 {/*my-hidden-components-have-effects-that-arent-running*/}

当一个 `<Activity>` 处于“隐藏”状态时，其所有子组件的 Effect 都会被清理。从概念上讲，这些子组件已被卸载，但 React 会保存它们的状态以便后续使用。这是 `Activity` 的一项特性，因为它意味着隐藏的 UI 部分不会维持活跃的订阅，从而减少了处理隐藏内容所需的工作量。

如果你正依赖 Effect 的挂载逻辑来清理组件的副作用，请重构该 Effect，将相关工作移至返回的清理函数中。

为了及早发现有问题的 Effect，我们建议添加 [`<StrictMode>`](/reference/react/StrictMode)。它会主动执行 `Activity` 的卸载和挂载操作，从而捕获任何非预期的副作用。
