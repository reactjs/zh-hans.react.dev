---
title: useTransition
---

<Intro>

`useTransition` 是一个让你可以在后台渲染部分 UI 的 React Hook。

```js
const [isPending, startTransition] = useTransition()
```

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `useTransition()` {/*usetransition*/}

在组件顶层调用 `useTransition`，将某些状态更新标记为 transition。

```js
import { useTransition } from 'react';

function TabContainer() {
  const [isPending, startTransition] = useTransition();
  // ……
}
```

[参见下方更多示例](#usage)。

#### 参数 {/*parameters*/}

`useTransition` 不需要任何参数。

#### 返回值 {/*returns*/}

`useTransition` 返回一个由两个元素组成的数组：

1. `isPending`，告诉你是否存在待处理的 transition。
2. [`startTransition` 函数](#starttransition)，你可以使用此方法将更新标记为 transition。

---

### `startTransition` 函数 {/*starttransition*/}

`useTransition` 返回的 `startTransition` 函数允许你将更新标记为 Transition。

```js {6,8}
function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ……
}
```

<Note>
#### 传递给 `startTransition` 的函数被称为 "Actions" {/*functions-called-in-starttransition-are-called-actions*/}

传递给 `startTransition` 的函数被称为 "Action" 。按照约定，任何在 `startTransition` 内调用的回调函数（例如作为回调的 prop）应命名为 `action` 或包含 "Action" 后缀：

```js {1,9}
function SubmitButton({ submitAction }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await submitAction();
        });
      }}
    >
      Submit
    </button>
  );
}

```

</Note>



#### 参数 {/*starttransition-parameters*/}

* `action`：通过调用一个或多个 [`set` 函数](/reference/react/useState#setstate) 来更新某些状态的函数。React 会立即调用 `action`（无需参数），并将 `action` 函数调用期间同步调度的所有状态更新标记为 Transition。在 `action` 中通过 `await` 等待的异步调用会被包含在 Transition 中，但目前需要在 `await` 之后将任何 `set` 函数再次包裹在 `startTransition` 中（参见[疑难解答](#react-doesnt-treat-my-state-update-after-await-as-a-transition)）。标记为 Transition 的状态更新将具备[非阻塞特性](#perform-non-blocking-updates-with-actions)，并且[不会显示不必要的加载指示](#preventing-unwanted-loading-indicators)。

#### 返回值 {/*starttransition-returns*/}

`startTransition` 不返回任何值。

#### 注意 {/*starttransition-caveats*/}

* `useTransition` 是一个 Hook，因此只能在组件或自定义 Hook 内部调用。如果需要在其他地方启动 transition（例如从数据库），请调用独立的 [`startTransition`](/reference/react/startTransition) 函数。

* 只有在可以访问该状态的 `set` 函数时，才能将其对应的状态更新包装为 transition。如果你想启用 Transition 以响应某个 prop 或自定义 Hook 值，请尝试使用 [`useDeferredValue`](/reference/react/useDeferredValue)。

* 传递给 `startTransition` 的函数会被立即执行，并将在其执行期间发生的所有状态更新标记为 transition。如果你尝试在 `setTimeout` 中执行状态更新，它们将不会被标记为 transition。

* 你必须将任意异步请求之后的状态更新用 `startTransition` 包裹，以将其标记为 Transition 更新。这是一个已知限制，我们将在未来版本中修复（参见[疑难解答](#react-doesnt-treat-my-state-update-after-await-as-a-transition)）。

* `startTransition` 函数具有稳定的标识，所以你经常会看到 Effect 的依赖数组中会省略它，即使包含它也不会导致 Effect 重新触发。如果 linter 允许你省略依赖项并且没有报错，那么你就可以安全地省略它。[了解移除 Effect 依赖项的更多信息。](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)

* 标记为 Transition 的状态更新将被其他状态更新打断。例如在 Transition 中更新图表组件，并在图表组件仍在重新渲染时继续在输入框中输入，React 将首先处理输入框的更新，之后再重新启动对图表组件的渲染工作。

* Transition 更新不能用于控制文本输入。

* 目前，React 会批处理多个同时进行的 transition。这是一个限制，可能会在未来版本中删除。

## 用法 {/*usage*/}

### 通过 Action 执行非阻塞更新 {/*perform-non-blocking-updates-with-actions*/}

在组件的顶层调用 `useTransition` 来创建 Action，并获取挂起的状态：

```js [[1, 4, "isPending"], [2, 4, "startTransition"]]
import {useState, useTransition} from 'react';

function CheckoutForm() {
  const [isPending, startTransition] = useTransition();
  // ……
}
```

`useTransition` 返回一个由两个元素组成的数组：

1. <CodeStep step={1}>`isPending`</CodeStep>，告诉你是否存在待处理的 transition。
2. <CodeStep step={2}>`startTransition` 函数</CodeStep>，你可以使用此方法创建一个 Action。

为了启动 Transition，你需要将函数传递给 `startTransition`。例如：

```js
import {useState, useTransition} from 'react';
import {updateQuantity} from './api';

function CheckoutForm() {
  const [isPending, startTransition] = useTransition();
  const [quantity, setQuantity] = useState(1);

  function onSubmit(newQuantity) {
    startTransition(async function () {
      const savedQuantity = await updateQuantity(newQuantity);
      startTransition(() => {
        setQuantity(savedQuantity);
      });
    });
  }
  // ……
}
```

传递给 `startTransition` 的函数被称为 "Action"。你可以在 Action 中更新状态和执行副作用操作，这些工作将在后台执行，不会阻塞页面的用户交互。一个 Transition 可以包含多个 Action，且在 Transition 进行期间，你的用户界面将保持流畅响应。例如，如果用户点击一个标签页后又改变主意点击另一个标签页，第二个点击会立即被处理，无需等待第一个更新完成。

为了向用户提供 Transition 进行中的反馈， `isPending` 状态会在首次调用 `startTransition` 时切换为 `true`，并会在所有 Action 完成且最终状态呈现给用户前一直保持为 `true`。Transition 机制确保 Action 中的副作用会完整执行以[避免不必要的加载指示](#preventing-unwanted-loading-indicators)，同时你可以通过 `useOptimistic` 在 Transition 进行期间提供即时反馈。

<Recipes titleText="Action 与常规事件处理的区别">

#### 在 Action 中更新数量 {/*updating-the-quantity-in-an-action*/}

在这个示例中，`updateQuantity` 函数模拟向服务端发送请求来更新购物车中的商品数量。该函数*被人为地减慢*，使得完成请求至少需要一秒钟。

快速多次更新数量。请注意，当任何请求在进行中时，都会显示挂起的 “Total” 状态，并且 “Total” 只会在最后一个请求完成后更新。由于更新操作在 Action 中进行，在请求处理期间仍可继续更新“quantity"”。

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "beta",
    "react-dom": "beta"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { useState, useTransition } from "react";
import { updateQuantity } from "./api";
import Item from "./Item";
import Total from "./Total";

export default function App({}) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();

  const updateQuantityAction = async newQuantity => {
    // To access the pending state of a transition,
    // call startTransition again.
    startTransition(async () => {
      const savedQuantity = await updateQuantity(newQuantity);
      startTransition(() => {
        setQuantity(savedQuantity);
      });
    });
  };

  return (
    <div>
      <h1>Checkout</h1>
      <Item action={updateQuantityAction}/>
      <hr />
      <Total quantity={quantity} isPending={isPending} />
    </div>
  );
}
```

```js src/Item.js
import { startTransition } from "react";

export default function Item({action}) {
  function handleChange(event) {
    // To expose an action prop, await the callback in startTransition.
    startTransition(async () => {
      await action(event.target.value);
    })
  }
  return (
    <div className="item">
      <span>Eras Tour Tickets</span>
      <label htmlFor="name">Quantity: </label>
      <input
        type="number"
        onChange={handleChange}
        defaultValue={1}
        min={1}
      />
    </div>
  )
}
```

```js src/Total.js
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export default function Total({quantity, isPending}) {
  return (
    <div className="total">
      <span>Total:</span>
      <span>
        {isPending ? "🌀 Updating..." : `${intl.format(quantity * 9999)}`}
      </span>
    </div>
  )
}
```

```js src/api.js
export async function updateQuantity(newQuantity) {
  return new Promise((resolve, reject) => {
    // Simulate a slow network request.
    setTimeout(() => {
      resolve(newQuantity);
    }, 2000);
  });
}
```

```css
.item {
  display: flex;
  align-items: center;
  justify-content: start;
}

.item label {
  flex: 1;
  text-align: right;
}

.item input {
  margin-left: 4px;
  width: 60px;
  padding: 4px;
}

.total {
  height: 50px;
  line-height: 25px;
  display: flex;
  align-content: center;
  justify-content: space-between;
}
```

</Sandpack>

这是一个演示 Action 工作原理的基础示例，但此示例未处理请求完成顺序错乱的问题。当多次更新数量时，较早的请求可能会在较晚的请求之后完成，导致数量更新顺序混乱。这是一个已知限制，我们将在未来版本中修复（参见下方的[疑难解答](#my-state-updates-in-transitions-are-out-of-order)）。

对于常见用例，React 提供了以下内置抽象方案：
- [`useActionState`](/reference/react/useActionState)
- [`<form>` 表单操作](/reference/react-dom/components/form)
- [服务端函数](/reference/rsc/server-functions)

这些方案会为你自动处理请求顺序问题。当使用 Transitions 构建自定义钩子或管理异步状态转换的库时，你虽然可以获得更精细的控制，但也需要自行处理请求顺序逻辑。

<Solution />

#### 在不使用 Action 的情况下更新数量 {/*updating-the-users-name-without-an-action*/}

在这个示例中，`updateQuantity` 函数同样模拟向服务端发送请求来更新购物车中的商品数量。该函数*被人为地减慢*，使得完成请求至少需要一秒钟。

快速多次更新数量。请注意，当任何请求在进行中时都会显示 “Total” 的挂起状态，但 “Total” 会根据每次点击 “quantity” 进行多次更新：

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "beta",
    "react-dom": "beta"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { useState } from "react";
import { updateQuantity } from "./api";
import Item from "./Item";
import Total from "./Total";

export default function App({}) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, setIsPending] = useState(false);

  const onUpdateQuantity = async newQuantity => {
    // Manually set the isPending State.
    setIsPending(true);
    const savedQuantity = await updateQuantity(newQuantity);
    setIsPending(false);
    setQuantity(savedQuantity);
  };

  return (
    <div>
      <h1>Checkout</h1>
      <Item onUpdateQuantity={onUpdateQuantity}/>
      <hr />
      <Total quantity={quantity} isPending={isPending} />
    </div>
  );
}

```

```js src/Item.js
export default function Item({onUpdateQuantity}) {
  function handleChange(event) {
    onUpdateQuantity(event.target.value);
  }
  return (
    <div className="item">
      <span>Eras Tour Tickets</span>
      <label htmlFor="name">Quantity: </label>
      <input
        type="number"
        onChange={handleChange}
        defaultValue={1}
        min={1}
      />
    </div>
  )
}
```

```js src/Total.js
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export default function Total({quantity, isPending}) {
  return (
    <div className="total">
      <span>Total:</span>
      <span>
        {isPending ? "🌀 Updating..." : `${intl.format(quantity * 9999)}`}
      </span>
    </div>
  )
}
```

```js src/api.js
export async function updateQuantity(newQuantity) {
  return new Promise((resolve, reject) => {
    // Simulate a slow network request.
    setTimeout(() => {
      resolve(newQuantity);
    }, 2000);
  });
}
```

```css
.item {
  display: flex;
  align-items: center;
  justify-content: start;
}

.item label {
  flex: 1;
  text-align: right;
}

.item input {
  margin-left: 4px;
  width: 60px;
  padding: 4px;
}

.total {
  height: 50px;
  line-height: 25px;
  display: flex;
  align-content: center;
  justify-content: space-between;
}
```

</Sandpack>

针对此问题的常见解决方案是在数量更新期间阻止用户进行更改：

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "beta",
    "react-dom": "beta"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { useState, useTransition } from "react";
import { updateQuantity } from "./api";
import Item from "./Item";
import Total from "./Total";

export default function App({}) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, setIsPending] = useState(false);

  const onUpdateQuantity = async event => {
    const newQuantity = event.target.value;
    // Manually set the isPending state.
    setIsPending(true);
    const savedQuantity = await updateQuantity(newQuantity);
    setIsPending(false);
    setQuantity(savedQuantity);
  };

  return (
    <div>
      <h1>Checkout</h1>
      <Item isPending={isPending} onUpdateQuantity={onUpdateQuantity}/>
      <hr />
      <Total quantity={quantity} isPending={isPending} />
    </div>
  );
}

```

```js src/Item.js
export default function Item({isPending, onUpdateQuantity}) {
  return (
    <div className="item">
      <span>Eras Tour Tickets</span>
      <label htmlFor="name">Quantity: </label>
      <input
        type="number"
        disabled={isPending}
        onChange={onUpdateQuantity}
        defaultValue={1}
        min={1}
      />
    </div>
  )
}
```

```js src/Total.js
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export default function Total({quantity, isPending}) {
  return (
    <div className="total">
      <span>Total:</span>
      <span>
        {isPending ? "🌀 Updating..." : `${intl.format(quantity * 9999)}`}
      </span>
    </div>
  )
}
```

```js src/api.js
export async function updateQuantity(newQuantity) {
  return new Promise((resolve, reject) => {
    // Simulate a slow network request.
    setTimeout(() => {
      resolve(newQuantity);
    }, 2000);
  });
}
```

```css
.item {
  display: flex;
  align-items: center;
  justify-content: start;
}

.item label {
  flex: 1;
  text-align: right;
}

.item input {
  margin-left: 4px;
  width: 60px;
  padding: 4px;
}

.total {
  height: 50px;
  line-height: 25px;
  display: flex;
  align-content: center;
  justify-content: space-between;
}
```

</Sandpack>

这种解决方案会让应用显得卡顿，因为用户必须每次更新数量时都等待。虽然可以手动添加更复杂的处理逻辑来允许用户在更新数量时继续操作界面，但 React Action 通过直观的内置 API 就能轻松处理这种情况。

<Solution />

</Recipes>

---

### 在组件中公开 `action` 属性 {/*exposing-action-props-from-components*/}

你可以通过组件暴露一个 `action` 属性，允许父组件调用一个 Action。

例如，这个 `TabButton` 组件将 `onClick` 事件逻辑封装到 `action` 属性中：

```js {8-12}
export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      startTransition(async () => {
        // await the action that's passed in.
        // This allows it to be either sync or async.
        await action();
      });
    }}>
      {children}
    </button>
  );
}
```

由于父组件的状态更新在 `action` 中，所以该状态更新会被标记为 transition。这意味着你可以在点击“Posts”后立即点击“Contact”，并且它不会阻止用户交互:

<Sandpack>

```js
import { useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        action={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        action={() => setTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        action={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={async () => {
      startTransition(async () => {
        // await the action that's passed in.
        // This allows it to be either sync or async.
        await action();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js {expectedErrors: {'react-compiler': [19, 20]}} src/PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // 打印一次。真正变慢的地方在 SlowPost 内。
  console.log('[ARTIFICIALLY SLOW] Rendering 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // 每个 item 都等待 1 毫秒以模拟极慢的代码。
  }

  return (
    <li className="item">
      Post #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
.items {
  max-height: 300px;
  overflow: auto;
}
```

</Sandpack>

<Note>

When exposing an `action` prop from a component, you should `await` it inside the transition.

This allows the `action` callback to be either synchronous or asynchronous without requiring an additional `startTransition` to wrap the `await` in the action.

</Note>

---

### 显示待处理的视觉状态 {/*displaying-a-pending-visual-state*/}

你可以使用 `useTransition` 返回的 `isPending` 布尔值来向用户表明当前处于 Transition 中。例如，选项卡按钮可以有一个特殊的“pending”视觉状态：

```js {4-6}
function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  // ...
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  // ...
```

请注意，现在点击“Posts”感觉更加灵敏，因为选项卡按钮本身立即更新了：

<Sandpack>

```js
import { useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        action={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        action={() => setTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        action={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={() => {
      startTransition(async () => {
        await action();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js {expectedErrors: {'react-compiler': [19, 20]}} src/PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // 打印一次。真正变慢的地方在 SlowPost 内。
  console.log('[ARTIFICIALLY SLOW] Rendering 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // 每个 item 都等待 1 毫秒以模拟极慢的代码。
  }

  return (
    <li className="item">
      Post #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
.items {
  max-height: 300px;
  overflow: auto;
}
```

</Sandpack>

---

### 避免不必要的加载指示器 {/*preventing-unwanted-loading-indicators*/}

在这个例子中，`PostsTab` 组件通过 [use](/reference/react/use) 获取了一些数据。当你点击“Posts”选项卡时，`PostsTab` 组件将 **挂起**，导致使用最近的加载中的后备方案：

<Sandpack>

```js
import { Suspense, useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <Suspense fallback={<h1>🌀 Loading...</h1>}>
      <TabButton
        isActive={tab === 'about'}
        action={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        action={() => setTab('posts')}
      >
        Posts
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        action={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </Suspense>
  );
}
```

```js src/TabButton.js
export default function TabButton({ action, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      action();
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js hidden
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/PostsTab.js hidden
import {use} from 'react';
import { fetchData } from './data.js';

function PostsTab() {
  const posts = use(fetchData('/posts'));
  return (
    <ul className="items">
      {posts.map(post =>
        <Post key={post.id} title={post.title} />
      )}
    </ul>
  );
}

function Post({ title }) {
  return (
    <li className="item">
      {title}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js hidden
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```


```js src/data.js hidden
// 注意：数据获取的方式取决于
// 与 Suspense 一同使用的框架
// 通常缓存逻辑是由框架内部处理的。

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
  for (let i = 0; i < 500; i++) {
    posts.push({
      id: i,
      title: 'Post #' + (i + 1)
    });
  }
  return posts;
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

隐藏整个选项卡容器以显示加载指示符会导致用户体验不连贯。如果你将 `useTransition` 添加到 `TabButton` 中，你可以改为在选项卡按钮中指示待处理状态。

请注意，现在点击“帖子”不再用一个旋转器替换整个选项卡容器：

<Sandpack>

```js
import { Suspense, useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <Suspense fallback={<h1>🌀 Loading...</h1>}>
      <TabButton
        isActive={tab === 'about'}
        action={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        action={() => setTab('posts')}
      >
        Posts
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        action={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </Suspense>
  );
}
```

```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={() => {
      startTransition(async () => {
        await action();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js hidden
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/PostsTab.js hidden
import {use} from 'react';
import { fetchData } from './data.js';

function PostsTab() {
  const posts = use(fetchData('/posts'));
  return (
    <ul className="items">
      {posts.map(post =>
        <Post key={post.id} title={post.title} />
      )}
    </ul>
  );
}

function Post({ title }) {
  return (
    <li className="item">
      {title}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js hidden
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```


```js src/data.js hidden
// 注意：数据获取的方式取决于
// 取决于与 Suspense 一同使用的框架
// 通常，缓存逻辑会嵌入在框架内部。

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
  for (let i = 0; i < 500; i++) {
    posts.push({
      id: i,
      title: 'Post #' + (i + 1)
    });
  }
  return posts;
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

[了解有关在Suspense中使用转换的更多信息](/reference/react/Suspense#preventing-already-revealed-content-from-hiding)。

<Note>

转换效果只会“等待”足够长的时间来避免隐藏 **已经显示** 的内容（例如选项卡容器）。如果“帖子”选项卡具有一个[嵌套 `<Suspense>` 边界](/reference/react/Suspense#revealing-nested-content-as-it-loads)，转换效果将不会“等待”它。

</Note>

---

### 构建一个Suspense-enabled 的路由 {/*building-a-suspense-enabled-router*/}

如果你正在构建一个 React 框架或路由，我们建议将页面导航标记为转换效果。

```js {3,6,8}
function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }
  // ...
```

这么做有三个好处：

- [转换效果是可中断的](#perform-non-blocking-updates-with-actions)，这样用户可以在等待重新渲染完成之前点击其他地方。
- [转换效果可以防止不必要的加载指示符](#preventing-unwanted-loading-indicators)，这样用户就可以避免在导航时产生不协调的跳转。
- [Transition 等待所有挂起的 action](#perform-non-blocking-updates-with-actions)，它允许用户在副作用完成之后再显示新页面。

下面是一个简单的使用转换效果进行页面导航的路由器示例：

<Sandpack>

```js src/App.js
import { Suspense, useState, useTransition } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout isPending={isPending}>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}
```

```js src/Layout.js
export default function Layout({ children, isPending }) {
  return (
    <div className="layout">
      <section className="header" style={{
        opacity: isPending ? 0.7 : 1
      }}>
        Music Browser
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

```js src/IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      Open The Beatles artist page
    </button>
  );
}
```

```js src/ArtistPage.js
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Biography artistId={artist.id} />
      <Suspense fallback={<AlbumsGlimmer />}>
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js src/data.js hidden
// 注意：数据获取的方式取决于
// 取决于与 Suspense 一同使用的框架
// 通常缓存逻辑是由框架内部处理的。

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles were an English rock band,
    formed in Liverpool in 1960, that comprised
    John Lennon, Paul McCartney, George Harrison
    and Ringo Starr.`;
}

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];
}
```

```css
main {
  min-height: 200px;
  padding: 10px;
}

.layout {
  border: 1px solid black;
}

.header {
  background: #222;
  padding: 10px;
  text-align: center;
  color: white;
}

.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

<Note>

启用 [Suspense](/reference/react/Suspense) 的路由默认情况下会将页面导航更新包装为 transition。

</Note>

---

### 使用错误边界向用户显示错误 {/*displaying-an-error-to-users-with-error-boundary*/}

如果传递给 `startTransition` 的函数抛出错误，可以通过[错误边界（error boundary）](/reference/react/Component#catching-rendering-errors-with-an-error-boundary) 向用户显示错误。要使用错误边界，请将调用 `useTransition` 的组件包裹在错误边界中。当传递给 `startTransition` 的函数报错时，错误边界的备用 UI 将会显示。

<Sandpack>

```js src/AddCommentContainer.js active
import { useTransition } from "react";
import { ErrorBoundary } from "react-error-boundary";

export function AddCommentContainer() {
  return (
    <ErrorBoundary fallback={<p>⚠️Something went wrong</p>}>
      <AddCommentButton />
    </ErrorBoundary>
  );
}

function addComment(comment) {
  // For demonstration purposes to show Error Boundary
  if (comment == null) {
    throw new Error("Example Error: An error thrown to trigger error boundary");
  }
}

function AddCommentButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => {
        startTransition(() => {
          // Intentionally not passing a comment
          // so error gets thrown
          addComment();
        });
      }}
    >
      Add comment
    </button>
  );
}
```

```js src/App.js hidden
import { AddCommentContainer } from "./AddCommentContainer.js";

export default function App() {
  return <AddCommentContainer />;
}
```

```js src/index.js hidden
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.0.0-rc-3edc000d-20240926",
    "react-dom": "19.0.0-rc-3edc000d-20240926",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```
</Sandpack>

---

## 疑难解答 {/*troubleshooting*/}

### 在 Transition 中无法更新输入框内容 {/*updating-an-input-in-a-transition-doesnt-work*/}

不应将控制输入框的状态变量标记为 transition：

```js {4,10}
const [text, setText] = useState('');
// ...
function handleChange(e) {
  // ❌ 不应将受控输入框的状态变量标记为 Transition
  startTransition(() => {
    setText(e.target.value);
  });
}
// ...
return <input value={text} onChange={handleChange} />;
```

这是因为 Transition 是非阻塞的，但是在响应更改事件时更新输入应该是同步的。如果想在输入时运行一个 transition，那么有两种做法：

1. 声明两个独立的状态变量：一个用于输入状态（它总是同步更新），另一个用于在 Transition 中更新。这样，便可以使用同步状态控制输入，并将用于 Transition 的状态变量（它将“滞后”于输入）传递给其余的渲染逻辑。
2. 或者使用一个状态变量，并添加 [`useDeferredValue`](/reference/react/useDeferredValue)，它将“滞后”于实际值，并自动触发非阻塞的重新渲染以“追赶”新值。

---

### React 没有将状态更新视为 Transition {/*react-doesnt-treat-my-state-update-as-a-transition*/}

当在 Transition 中包装状态更新时，请确保它发生在 `startTransition` 调用期间：

```js
startTransition(() => {
  // ✅ 在调用 startTransition 中更新状态
  setPage('/about');
});
```

传递给 `startTransition` 的函数必须是同步的。你不能像这样将更新标记为 transition：

```js
startTransition(() => {
  // ❌ 在调用 startTransition 后更新状态
  setTimeout(() => {
    setPage('/about');
  }, 1000);
});
```

相反，你可以这样做：

```js
setTimeout(() => {
  startTransition(() => {
    // ✅ 在调用 startTransition 中更新状态
    setPage('/about');
  });
}, 1000);
```

---

### React 不会将 `await` 之后的状态更新视为 Transition {/*react-doesnt-treat-my-state-update-after-await-as-a-transition*/}

当你在 `startTransition` 函数内部使用 `await` 时，`await` 之后的状态更新不会被标记为 Transition 更新。你必须将每个 `await` 之后的状态更新再次包裹在 `startTransition` 调用中：

```js
startTransition(async () => {
  await someAsyncFunction();
  // ❌ 不要在 await 之后调用 startTransition
  setPage('/about');
});
```

然而，使用以下方法可以正常工作：

```js
startTransition(async () => {
  await someAsyncFunction();
  // ✅ 在 await 之后 调用 startTransition
  startTransition(() => {
    setPage('/about');
  });
});
```

这是由于 JavaScript 的限制，React 无法跟踪异步上下文的范围。未来当 [AsyncContext](https://github.com/tc39/proposal-async-context) 提案实现后，该限制将被消除。

---

### 我想在组件外部调用 `useTransition` {/*i-want-to-call-usetransition-from-outside-a-component*/}

`useTransition` 是一个 Hook，因此不能在组件外部调用。请使用独立的 [`startTransition`](/reference/react/startTransition) 方法。它们的工作方式相同，但不提供 `isPending` 标记。

---

### 我传递给 `startTransition` 的函数会立即执行 {/*the-function-i-pass-to-starttransition-executes-immediately*/}

如果你运行这段代码，它将会打印 1, 2, 3：

```js {1,3,6}
console.log(1);
startTransition(() => {
  console.log(2);
  setPage('/about');
});
console.log(3);
```

**期望打印 1, 2, 3**。传递给 `startTransition` 的函数不会被延迟执行。与浏览器的 `setTimeout` 不同，它不会延迟执行回调。React 会立即执行你的函数，但是在它运行的同时安排的任何状态更新都被标记为 transition。你可以将其想象为以下方式：

```js
// React 运行的简易版本

let isInsideTransition = false;

function startTransition(scope) {
  isInsideTransition = true;
  scope();
  isInsideTransition = false;
}

function setState() {
  if (isInsideTransition) {
    // ……安排 Transition 状态更新……
  } else {
    // ……安排紧急状态更新……
  }
}
```

### Transitions 中的状态更新顺序混乱 {/*my-state-updates-in-transitions-are-out-of-order*/}

如果在 `startTransition` 内部使用 `await`，你可能会看到更新出现顺序错乱。

在这个示例中，`updateQuantity` 函数模拟向服务端发送请求以更新购物车中的商品数量。该函数 **人为地让每隔一次请求在前一次之后返回**，用于模拟网络请求的竞态条件。

尝试更新一次数量，然后快速多次更新。你可能会看到错误的总计：

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "beta",
    "react-dom": "beta"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { useState, useTransition } from "react";
import { updateQuantity } from "./api";
import Item from "./Item";
import Total from "./Total";

export default function App({}) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();
  // Store the actual quantity in separate state to show the mismatch.
  const [clientQuantity, setClientQuantity] = useState(1);

  const updateQuantityAction = newQuantity => {
    setClientQuantity(newQuantity);

    // Access the pending state of the transition,
    // by wrapping in startTransition again.
    startTransition(async () => {
      const savedQuantity = await updateQuantity(newQuantity);
      startTransition(() => {
        setQuantity(savedQuantity);
      });
    });
  };

  return (
    <div>
      <h1>Checkout</h1>
      <Item action={updateQuantityAction}/>
      <hr />
      <Total clientQuantity={clientQuantity} savedQuantity={quantity} isPending={isPending} />
    </div>
  );
}

```

```js src/Item.js
import {startTransition} from 'react';

export default function Item({action}) {
  function handleChange(e) {
    // Update the quantity in an Action.
    startTransition(async () => {
      await action(e.target.value);
    });
  }
  return (
    <div className="item">
      <span>Eras Tour Tickets</span>
      <label htmlFor="name">Quantity: </label>
      <input
        type="number"
        onChange={handleChange}
        defaultValue={1}
        min={1}
      />
    </div>
  )
}
```

```js src/Total.js
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export default function Total({ clientQuantity, savedQuantity, isPending }) {
  return (
    <div className="total">
      <span>Total:</span>
      <div>
        <div>
          {isPending
            ? "🌀 Updating..."
            : `${intl.format(savedQuantity * 9999)}`}
        </div>
        <div className="error">
          {!isPending &&
            clientQuantity !== savedQuantity &&
            `Wrong total, expected: ${intl.format(clientQuantity * 9999)}`}
        </div>
      </div>
    </div>
  );
}
```

```js src/api.js
let firstRequest = true;
export async function updateQuantity(newName) {
  return new Promise((resolve, reject) => {
    if (firstRequest === true) {
      firstRequest = false;
      setTimeout(() => {
        firstRequest = true;
        resolve(newName);
        // Simulate every other request being slower
      }, 1000);
    } else {
      setTimeout(() => {
        resolve(newName);
      }, 50);
    }
  });
}
```

```css
.item {
  display: flex;
  align-items: center;
  justify-content: start;
}

.item label {
  flex: 1;
  text-align: right;
}

.item input {
  margin-left: 4px;
  width: 60px;
  padding: 4px;
}

.total {
  height: 50px;
  line-height: 25px;
  display: flex;
  align-content: center;
  justify-content: space-between;
}

.total div {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.error {
  color: red;
}
```

</Sandpack>


多次点击时，较早的请求可能会在较晚的请求之后完成。当这种情况发生时，React 目前无法知道预期的顺序。这是因为更新是异步调度的，而 React 在异步边界处丢失了顺序的上下文。

这是预期内的，因为在 Transition 中的 Action 不保证执行顺序。对于常见用例，React 提供了更高级的抽象，如 [`useActionState`](/reference/react/useActionState) 和 [`<form>` actions](/reference/react-dom/components/form) 来为你处理顺序问题。对于高级用例，你需要自行实现队列和中止逻辑来处理这种情况。


Example of `useActionState` handling execution order:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "beta",
    "react-dom": "beta"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { useState, useActionState } from "react";
import { updateQuantity } from "./api";
import Item from "./Item";
import Total from "./Total";

export default function App({}) {
  // Store the actual quantity in separate state to show the mismatch.
  const [clientQuantity, setClientQuantity] = useState(1);
  const [quantity, updateQuantityAction, isPending] = useActionState(
    async (prevState, payload) => {
      setClientQuantity(payload);
      const savedQuantity = await updateQuantity(payload);
      return savedQuantity; // Return the new quantity to update the state
    },
    1 // Initial quantity
  );

  return (
    <div>
      <h1>Checkout</h1>
      <Item action={updateQuantityAction}/>
      <hr />
      <Total clientQuantity={clientQuantity} savedQuantity={quantity} isPending={isPending} />
    </div>
  );
}

```

```js src/Item.js
import {startTransition} from 'react';

export default function Item({action}) {
  function handleChange(e) {
    // Update the quantity in an Action.
    startTransition(() => {
      action(e.target.value);
    });
  }
  return (
    <div className="item">
      <span>Eras Tour Tickets</span>
      <label htmlFor="name">Quantity: </label>
      <input
        type="number"
        onChange={handleChange}
        defaultValue={1}
        min={1}
      />
    </div>
  )
}
```

```js src/Total.js
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export default function Total({ clientQuantity, savedQuantity, isPending }) {
  return (
    <div className="total">
      <span>Total:</span>
      <div>
        <div>
          {isPending
            ? "🌀 Updating..."
            : `${intl.format(savedQuantity * 9999)}`}
        </div>
        <div className="error">
          {!isPending &&
            clientQuantity !== savedQuantity &&
            `Wrong total, expected: ${intl.format(clientQuantity * 9999)}`}
        </div>
      </div>
    </div>
  );
}
```

```js src/api.js
let firstRequest = true;
export async function updateQuantity(newName) {
  return new Promise((resolve, reject) => {
    if (firstRequest === true) {
      firstRequest = false;
      setTimeout(() => {
        firstRequest = true;
        resolve(newName);
        // Simulate every other request being slower
      }, 1000);
    } else {
      setTimeout(() => {
        resolve(newName);
      }, 50);
    }
  });
}
```

```css
.item {
  display: flex;
  align-items: center;
  justify-content: start;
}

.item label {
  flex: 1;
  text-align: right;
}

.item input {
  margin-left: 4px;
  width: 60px;
  padding: 4px;
}

.total {
  height: 50px;
  line-height: 25px;
  display: flex;
  align-content: center;
  justify-content: space-between;
}

.total div {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.error {
  color: red;
}
```

</Sandpack>
