---
title: <ViewTransition>
version: canary
---



<Intro>

<Canary>

**`<ViewTransition />` API 目前仅在 React 的 Canary 和实验通道中可用**。

[点击此处了解更多关于 React 发布渠道的信息。](/community/versioning-policy#all-release-channels)

</Canary>

`<ViewTransition>` 允许你使用 Transition 和 Suspense 为组件树添加动画。

```js
import {ViewTransition} from 'react';

<ViewTransition>
  <div>...</div>
</ViewTransition>
```

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `<ViewTransition>` {/*viewtransition*/}

将组件树包裹在 `<ViewTransition>` 中以添加动画：

```js
<ViewTransition>
  <Page />
</ViewTransition>
```

[参见下方更多示例。](#usage)

<DeepDive>

#### `<ViewTransition>` 如何工作？ {/*how-does-viewtransition-work*/}

在底层，React 将 `view-transition-name` 应用到 `<ViewTransition>` 组件内部最近 DOM 节点的内联样式上。如果有多个兄弟 DOM 节点，例如 `<ViewTransition><div /><div /></ViewTransition>`，那么 React 会为名称添加后缀使每个节点唯一，但它们在概念上属于同一组。React 不会过早地应用这些样式，只会在该边界需要参与动画时才应用。

React 会在幕后自动调用 `startViewTransition`，因此你永远不需要自己调用它。事实上，如果页面上有其他正在运行 ViewTransition 的代码，React 会中断它们。因此，建议你使用 React 自身来协调这些动画。如果你以前有其他触发 ViewTransition 的方式，我们建议你迁移到内置方式。

如果已经有其他 React ViewTransition 正在运行，React 会等待它们完成后再启动下一个。然而，重要的是，如果在第一个动画运行时有多个更新发生，这些更新都会被合并为一个。假设你启动了 A→B 的过渡，然后在此期间又收到了更新到 C 和 D。当第一个 A→B 动画完成后，下一个动画将从 B→D 过渡。

`getSnapshotBeforeUpdate` 生命周期会在 `startViewTransition` 之前调用，同时一些 `view-transition-name` 也会更新。

然后 React 调用 `startViewTransition`。在 `updateCallback` 内部，React 会：

- 将变更应用到 DOM 并调用 `useInsertionEffect`。
- 等待字体加载。
- 调用 `componentDidMount`、`componentDidUpdate`、`useLayoutEffect` 和 ref。
- 等待任何待处理的导航（Navigation）完成。
- 然后 React 会测量布局的任何变化，以确定哪些边界需要添加动画。

在 `startViewTransition` 的 ready Promise 被解决后，React 会还原 `view-transition-name`。然后 React 会调用 `onEnter`、`onExit`、`onUpdate` 和 `onShare` 回调，以便手动编程控制动画。这将在内置默认动画已经被计算之后进行。

如果 `flushSync` 在这期间的某个时刻被调用，React 将跳过该过渡，因为它依赖于能够同步完成。

在 `startViewTransition` 的 finished Promise 被解决后，React 会调用 `useEffect`。这可以防止这些 Effect 干扰动画的性能。然而，这并非保证，因为如果在动画运行时发生了另一个 `setState`，仍然必须提前调用 `useEffect` 以保持顺序保证。

</DeepDive>

#### 参数 {/*props*/}

- **可选** `name`：一个字符串或对象。用于共享元素过渡的视图过渡名称。如果未提供，React 将为每个 ViewTransition 使用唯一名称，以防止意外的动画。
- [View Transition Class](#view-transition-class) 参数。
- [View Transition Event](#view-transition-event) 参数。

#### 注意 {/*caveats*/}

- 仅在[共享元素过渡](#animating-a-shared-element)中使用 `name`。对于所有其他动画，React 会自动生成唯一名称，以防止意外的动画。
- 默认情况下，`setState` 立即更新并且不会激活 `<ViewTransition>`，只有包裹在 [Transition](/reference/react/useTransition)、[`<Suspense>`](/reference/react/Suspense) 或 `useDeferredValue` 中的更新才会激活 ViewTransition。
- `<ViewTransition>` 会创建一个可以移动、缩放和交叉淡入淡出的图像。与你可能在 React Native 或 Motion 中看到的布局动画不同，这意味着并非其内部的每个独立元素都会动画化其位置。相较于为每个独立部分添加动画，这可以带来更好的性能和更连续、更流畅的动画效果。然而，它也可能会丧失那些本应独立移动的事物的连续性。因此，你可能需要手动添加更多 `<ViewTransition>` 边界。
- 目前，`<ViewTransition>` 仅在 DOM 中可用。我们正在努力添加对 React Native 和其他平台的支持。

#### 动画触发器 {/*animation-triggers*/}

React 会自动决定要触发的视图过渡动画类型：

- `enter`：如果 `ViewTransition` 是在此 Transition 中插入的第一个组件，则会激活此动画。
- `exit`：如果 `ViewTransition` 是在此 Transition 中删除的第一个组件，则会激活此动画。
- `update`：如果 `ViewTransition` 内部有任何 React 正在进行的 DOM 变更（例如 prop 改变），或者如果 `ViewTransition` 边界本身由于直接兄弟节点而改变大小或位置，则会激活此动画。如果有嵌套的 `ViewTransition`，变更将应用于它们而非父级。
- `share`：如果一个具名 `ViewTransition` 位于被删除的子树中，而另一个具有相同名称的 `ViewTransition` 是同一 Transition 中插入的子树的一部分，它们会形成一个共享元素过渡，从删除的一侧动画到插入的一侧。

默认情况下，`<ViewTransition>` 使用平滑的交叉淡入淡出（浏览器默认的视图过渡）进行动画。

你可以通过为每种触发类型（参见[设置视图过渡样式](#styling-view-transitions)）向 `<ViewTransition>` 组件提供 [View Transition Class](#view-transition-class) 来定制动画，或者使用 [ViewTransition Events](#view-transition-events) 通过 [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) 用 JavaScript 控制动画。

<Note>

#### 始终检查 `prefers-reduced-motion` {/*always-check-prefers-reduced-motion*/}

许多用户可能不希望在页面上看到动画。React 不会对此情况自动禁用动画。

我们建议始终使用 `@media (prefers-reduced-motion)` 媒体查询，根据用户偏好来禁用动画或降低动画强度。

未来，CSS 库可能会在其预设中内置此功能。

</Note>

### View Transition Class {/*view-transition-class*/}

`<ViewTransition>` 提供了用于定义触发哪些动画的参数：

```js
<ViewTransition
  default="none"
  enter="slide-up"
  exit="slide-down"
/>
```

#### 参数 {/*view-transition-class-props*/}

- **可选** `enter`：`"auto"`、`"none"`、一个字符串或一个对象。
- **可选** `exit`：`"auto"`、`"none"`、一个字符串或一个对象。
- **可选** `update`：`"auto"`、`"none"`、一个字符串或一个对象。
- **可选** `share`：`"auto"`、`"none"`、一个字符串或一个对象。
- **可选** `default`：`"auto"`、`"none"`、一个字符串或一个对象。

#### 注意 {/*view-transition-class-caveats*/}

- 如果 `default` 设置为 `"none"`，则除非显式列出，否则所有其他触发器都将被关闭。

#### 可选值 {/*view-transition-values*/}

View Transition Class 的值可以是：
- `auto`：默认值。使用浏览器默认动画。
- `none`：禁用该类型的动画。
- `<classname>`：用于[自定义视图过渡](#styling-view-transitions)的自定义 CSS 类名。

对象值可以是一个字符串键与值（`auto`、`none` 或自定义 className）组成的对象：
- `{[type]: value}`：如果动画匹配该[过渡类型](/reference/react/addTransitionType)，则应用 `value`。
- `{default: value}`：如果没有匹配任何[过渡类型](/reference/react/addTransitionType)，则应用的默认值。

例如，你可以将 ViewTransition 定义为：

```js
<ViewTransition
  /* 关闭下面未定义的任何动画 */
  default="none"
  enter={{
    /* 为过渡类型 `forward` 应用 slide-in */
    "forward": 'slide-in',
    /* 否则使用浏览器默认动画 */
    "default": 'auto'
  }}
  /* 对退出动画使用浏览器默认动画 */
  exit="auto"
  /* 为更新动画应用自定义 `cross-fade` 类 */
  update="cross-fade"
>
```

参见[设置视图过渡样式](#styling-view-transitions)了解如何为自定义动画定义 CSS 类。

---

### View Transition Event {/*view-transition-event*/}

View Transition Events 允许你使用 [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) 通过 JavaScript 控制动画：

```js
<ViewTransition
  onEnter={instance => {/* ... */}}
  onExit={instance => {/* ... */}}
/>
```

#### 参数 {/*view-transition-event-props*/}

- **可选** `onEnter`：当触发 "enter" 动画时调用。
- **可选** `onExit`：当触发 "exit" 动画时调用。
- **可选** `onShare`：当触发 "share" 动画时调用。
- **可选** `onUpdate`：当触发 "update" 动画时调用。


#### 注意 {/*view-transition-event-caveats*/}
- 每次 Transition 中每个 `<ViewTransition>` 仅触发一个事件。`onShare` 优先于 `onEnter` 和 `onExit`。
- 每个事件应返回一个**清理函数**。清理函数在视图过渡完成时调用，允许你取消或清理任何动画。

#### 参数说明 {/*view-transition-event-arguments*/}

每个事件接收两个参数：

- `instance`：一个 View Transition 实例，提供对视图过渡[伪元素](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API/Using#the_view_transition_process)的访问
  - `old`：`::view-transition-old` 伪元素。
  - `new`：`::view-transition-new` 伪元素。
  - `name`：此边界的 `view-transition-name` 字符串。
  - `group`：`::view-transition-group` 伪元素。
  - `imagePair`：`::view-transition-image-pair` 伪元素。
- `types`：包含在动画中的[过渡类型](/reference/react/addTransitionType)的 `Array<string>`。如果未指定类型，则为空数组。

例如，你可以定义一个使用 JavaScript 驱动动画的 `onEnter` 事件：

```js
<ViewTransition
  onEnter={(instance, types) => {
    const anim = instance.new.animate([{opacity: 0}, {opacity: 1}], {
      duration: 500,
    });
    return () => anim.cancel();
  }}>
  <div>...</div>
</ViewTransition>
```

参见[使用 JavaScript 添加动画](#animating-with-javascript)了解更多示例。

---

## 设置视图过渡样式 {/*styling-view-transitions*/}

<Note>

在网络上许多早期的 View Transition 示例中，你可能看到过使用 [`view-transition-name`](https://developer.mozilla.org/en-US/docs/Web/CSS/view-transition-name) 并通过 `::view-transition-...(my-name)` 选择器进行样式设置。我们不推荐这种设置样式的方式。相反，我们通常建议使用 View Transition Class。

</Note>

要自定义 `<ViewTransition>` 的动画，你可以为某个激活属性提供一个 View Transition Class。View Transition Class 是一个 CSS 类名，当 ViewTransition 激活时，React 会将其应用到子元素上。

例如，要自定义 "enter" 动画，向 `enter` 属性提供一个类名：

```js
<ViewTransition enter="slide-in">
```

当 `<ViewTransition>` 激活 "enter" 动画时，React 会添加类名 `slide-in`。然后你可以使用[视图过渡伪选择器](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API#pseudo-elements)引用这个类来构建可复用的动画：

```css
::view-transition-group(.slide-in) {
}
::view-transition-old(.slide-in) {
}
::view-transition-new(.slide-in) {
}
```

未来，CSS 库可能会添加使用 View Transition Class 的内置动画，使这一切更容易使用。

---

## 用法 {/*usage*/}

### 为元素的进入/退出添加动画 {/*animating-an-element-on-enter*/}

当 `<ViewTransition>` 被过渡中的组件添加或移除时，会触发进入/退出过渡：

```js {3}
function Child() {
  return (
    <ViewTransition enter="auto" exit="auto" default="none">
      <div>你好</div>
    </ViewTransition>
  );
}

function Parent() {
  const [show, setShow] = useState();
  if (show) {
    return <Child />;
  }
  return null;
}
```

当 `setShow` 被调用时，`show` 切换为 `true` 并且 `Child` 组件被渲染。当 `setShow` 在 `startTransition` 内部被调用，并且 `Child` 在任何其他 DOM 节点之前渲染了一个 `ViewTransition` 时，就会触发 `enter` 动画。

当 `show` 切换回 `false` 时，会触发 `exit` 动画。

<Sandpack>

```js src/Video.js hidden
function Thumbnail({video, children}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {ViewTransition, useState, startTransition} from 'react';
import {Video} from './Video';
import videos from './data';

function Item() {
  return (
    <ViewTransition enter="auto" exit="auto" default="none">
      <Video video={videos[0]} />
    </ViewTransition>
  );
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}>
        {showItem ? '➖' : '➕'}
      </button>

      {showItem ? <Item /> : null}
    </>
  );
}
```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
];
```

```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

<Pitfall>

#### 只有顶层的 ViewTransition 才会在退出/进入时动画化 {/*only-top-level-viewtransition-animates-on-exit-enter*/}

`<ViewTransition>` 只有放置在任何 DOM 节点**之前**才会激活退出/进入。

如果 `<ViewTransition>` 上方有一个 `<div>`，则不会触发退出/进入动画：

```js [3, 5]
function Item() {
  return (
    <div> {/* 🚩<ViewTransition> 上方的 <div> 会破坏退出/进入 */}
      <ViewTransition enter="auto" exit="auto" default="none">
        <Video video={videos[0]} />
      </ViewTransition>
    </div>
  );
}
```

这种约束可以防止因为过多或过少的内容被动画化而导致的细微错误。

</Pitfall>

---

### 使用 Activity 为进入/退出添加动画 {/*animating-enter-exit-with-activity*/}

如果你想在保留组件状态或预渲染动画内容的同时让组件以动画方式进入和退出，可以使用 [`<Activity>`](/reference/react/Activity)。当 `<Activity>` 内的 `<ViewTransition>` 变为可见时，`enter` 动画激活。当它变为隐藏时，`exit` 动画激活：

```js
<Activity mode={isVisible ? 'visible' : 'hidden'}>
  <ViewTransition enter="auto" exit="auto">
    <Counter />
  </ViewTransition>
</Activity>

```

在此示例中，`Counter` 有一个带有内部状态的计数器。尝试增加计数，隐藏它，然后再次显示它。计数器的值被保留，而侧边栏以动画方式进入和退出：

<Sandpack>

```js
import { Activity, ViewTransition, useState, startTransition } from 'react';

export default function App() {
  const [show, setShow] = useState(true);
  return (
    <div className="layout">
      <Toggle show={show} setShow={setShow} />
      <Activity mode={show ? 'visible' : 'hidden'}>
        <ViewTransition enter="auto" exit="auto" default="none">
          <Counter />
        </ViewTransition>
      </Activity>
    </div>
  );
}
function Toggle({show, setShow}) {
  return (
    <button
      className="toggle"
      onClick={() => {
        startTransition(() => {
          setShow(s => !s);
        });
      }}>
      {show ? '隐藏' : '显示'}
    </button>
  )
}
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div className="counter">
      <h2>计数器</h2>
      <p>计数：{count}</p>
      <button onClick={() => setCount(count + 1)}>
        增加
      </button>
    </div>
  );
}

```

```css
.layout {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  min-height: 200px;
}
.counter {
  padding: 15px;
  background: #f0f4f8;
  border-radius: 8px;
  width: 200px;
}
.counter h2 {
  margin: 0 0 10px 0;
  font-size: 16px;
}
.counter p {
  margin: 0 0 10px 0;
}
.toggle {
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #f0f8ff;
  cursor: pointer;
  font-size: 14px;
}
.toggle:hover {
  background: #e0e8ff;
}
.counter button {
  padding: 4px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

没有 `<Activity>` 的话，每次侧边栏重新出现时计数器都会重置为 `0`。

---

### 为共享元素添加动画 {/*animating-a-shared-element*/}

通常情况下，我们不建议为 `<ViewTransition>` 指定名称，而是让 React 自动分配一个名称。你可能希望指定名称的原因是在完全不同的组件之间进行动画过渡，当一个组件树卸载且另一个组件树同时挂载时，以保持连续性。

```js
<ViewTransition name={UNIQUE_NAME}>
  <Child />
</ViewTransition>
```

当一棵树卸载而另一棵树挂载时，如果卸载树和挂载树中存在一对同名名称，它们会在两侧触发 "share" 动画。动画从卸载的一侧过渡到挂载的一侧。

与退出/进入动画不同，这可以位于被删除/挂载的树的深层内部。如果 `<ViewTransition>` 也符合退出/进入的条件，则 "share" 动画优先。

如果 Transition 先卸载一侧，然后导致显示 `<Suspense>` 后备方案，最后才挂载新名称，则不会发生共享元素过渡。

<Sandpack>

```js
import {ViewTransition, useState, startTransition} from 'react';
import {Video, Thumbnail, FullscreenVideo} from './Video';
import videos from './data';

export default function Component() {
  const [fullscreen, setFullscreen] = useState(false);
  if (fullscreen) {
    return (
      <FullscreenVideo
        video={videos[0]}
        onExit={() => startTransition(() => setFullscreen(false))}
      />
    );
  }
  return (
    <Video
      video={videos[0]}
      onClick={() => startTransition(() => setFullscreen(true))}
    />
  );
}
```

```js src/Video.js
import {ViewTransition} from 'react';

const THUMBNAIL_NAME = 'video-thumbnail';

export function Thumbnail({video, children}) {
  return (
    <ViewTransition name={THUMBNAIL_NAME}>
      <div
        aria-hidden="true"
        tabIndex={-1}
        className={`thumbnail ${video.image}`}
      />
    </ViewTransition>
  );
}

export function Video({video, onClick}) {
  return (
    <div className="video">
      <div className="link" onClick={onClick}>
        <Thumbnail video={video} />
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}

export function FullscreenVideo({video, onExit}) {
  return (
    <div className="fullscreenLayout">
      <ViewTransition name={THUMBNAIL_NAME}>
        <div
          aria-hidden="true"
          tabIndex={-1}
          className={`thumbnail ${video.image} fullscreen`}
        />
        <button className="close-button" onClick={onExit}>
          ✖
        </button>
      </ViewTransition>
    </div>
  );
}
```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
];
```

```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 300px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.thumbnail.red {
  background-image: conic-gradient(at top right, #c76a15, #a6423a, #2b3491);
}
.thumbnail.fullscreen {
  width: 100%;
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
.fullscreenLayout {
  position: relative;
  height: 100%;
  width: 100%;
}
.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  color: black;
}
@keyframes progress-animation {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

<Note>

如果配对中的挂载或卸载侧位于视口之外，则不会形成配对。这确保当内容滚动时，它不会飞出或飞入视口。相反，它自己会被视为常规的进入/退出。

如果相同的组件实例改变了位置，则会触发 "update"，则不会发生上述情况。无论其中一个位置是否在视口之外，这些都会进行动画化。

有一个已知情况：如果位于视口内的深层卸载的 `<ViewTransition>` 中的一侧，但挂载侧不在视口内，那么卸载侧会作为其自己的 "exit" 动画进行动画化，即使它深层嵌套，而不是作为父动画的一部分。

</Note>

<Pitfall>

在整个应用中，同一时间只能挂载一个同名元素，这一点非常重要。因此，必须使用唯一的命名空间作为名称以避免冲突。为了确保你能做到这一点，你可能需要在单独的模块中定义一个常量并导入它。

```js
export const MY_NAME = "my-globally-unique-name";
import {MY_NAME} from './shared-name';
...
<ViewTransition name={MY_NAME}>
```

</Pitfall>

---

### 为列表中的项目重新排序添加动画 {/*animating-reorder-of-items-in-a-list*/}

```js
items.map((item) => <Component key={item.id} item={item} />);
```

当重新排序列表而不更新内容时，如果列表中的每个 `<ViewTransition>` 位于 DOM 节点之外（类似于进入/退出动画），则 "update" 动画会在它们上触发。

这意味着这会触发此 `<ViewTransition>` 上的动画：

```js
function Component() {
  return (
    <ViewTransition>
      <div>...</div>
    </ViewTransition>
  );
}
```

<Sandpack>

```js src/Video.js hidden
function Thumbnail({video}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {ViewTransition, useState, startTransition} from 'react';
import {Video} from './Video';
import videos from './data';

export default function Component() {
  const [orderedVideos, setOrderedVideos] = useState(videos);
  const reorder = () => {
    startTransition(() => {
      setOrderedVideos((prev) => {
        return [...prev.sort(() => Math.random() - 0.5)];
      });
    });
  };
  return (
    <>
      <button onClick={reorder}>🎲</button>
      <div className="listContainer">
        {orderedVideos.map((video, i) => {
          return (
            <ViewTransition key={video.title}>
              <Video video={video} />
            </ViewTransition>
          );
        })}
      </div>
    </>
  );
}
```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
  {
    id: '2',
    title: 'Second video',
    description: 'Video description',
    image: 'red',
  },
  {
    id: '3',
    title: 'Third video',
    description: 'Video description',
    image: 'green',
  },
  {
    id: '4',
    title: 'Fourth video',
    description: 'Video description',
    image: 'purple',
  },
];
```

```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 150px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.thumbnail.red {
  background-image: conic-gradient(at top right, #c76a15, #a6423a, #2b3491);
}
.thumbnail.green {
  background-image: conic-gradient(at top right, #c76a15, #388f7f, #2b3491);
}
.thumbnail.purple {
  background-image: conic-gradient(at top right, #c76a15, #575fb7, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

然而，这种情况不会为每个单独的项目添加动画：

```js
function Component() {
  return (
    <div>
      <ViewTransition>...</ViewTransition>
    </div>
  );
}
```

相反，任何父级 `<ViewTransition>` 都会进行交叉淡入淡出。如果没有父级 `<ViewTransition>`，则在这种情况下不会有动画。

<Sandpack>

```js src/Video.js hidden
function Thumbnail({video}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {ViewTransition, useState, startTransition} from 'react';
import {Video} from './Video';
import videos from './data';

export default function Component() {
  const [orderedVideos, setOrderedVideos] = useState(videos);
  const reorder = () => {
    startTransition(() => {
      setOrderedVideos((prev) => {
        return [...prev.sort(() => Math.random() - 0.5)];
      });
    });
  };
  return (
    <>
      <button onClick={reorder}>🎲</button>
      <ViewTransition>
        <div className="listContainer">
          {orderedVideos.map((video, i) => {
            return <Video video={video} key={video.title} />;
          })}
        </div>
      </ViewTransition>
    </>
  );
}
```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
  {
    id: '2',
    title: 'Second video',
    description: 'Video description',
    image: 'red',
  },
  {
    id: '3',
    title: 'Third video',
    description: 'Video description',
    image: 'green',
  },
  {
    id: '4',
    title: 'Fourth video',
    description: 'Video description',
    image: 'purple',
  },
];
```

```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 150px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.thumbnail.red {
  background-image: conic-gradient(at top right, #c76a15, #a6423a, #2b3491);
}
.thumbnail.green {
  background-image: conic-gradient(at top right, #c76a15, #388f7f, #2b3491);
}
.thumbnail.purple {
  background-image: conic-gradient(at top right, #c76a15, #575fb7, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

这意味着在你希望允许组件控制自身重新排序动画的列表中，你可能想要避免使用包装元素：

```
items.map(item => <div><Component key={item.id} item={item} /></div>)
```

上述规则同样适用于以下情况：如果其中一个项目更新后改变尺寸，导致兄弟元素也重新调整尺寸，它同样会动画化其兄弟 `<ViewTransition>`，但仅在它们是直接兄弟时。

这意味着在一次导致大量重新布局的更新过程中，它不会为页面上的每个 `<ViewTransition>` 单独添加动画。这会导致大量嘈杂的动画，分散对实际变化的注意力。因此，React 在触发单独动画时更为保守。

<Pitfall>

在重新排序列表时，正确使用 key 来保持身份标识非常重要。看起来你可以使用 "name"（共享元素过渡）来为重新排序添加动画，但如果一侧位于视口之外，则该动画不会触发。要为重新排序添加动画，你通常希望显示它移动到了视口外的位置。

</Pitfall>

---

### 从 Suspense 内容添加动画 {/*animating-from-suspense-content*/}

像任何 Transition 一样，React 会在运行动画之前等待数据和新的 CSS（`<link rel="stylesheet" precedence="...">`）。除此之外，ViewTransitions 还会等待最多 500ms 以便新字体加载，然后才开始动画，以避免它们稍后闪烁。出于同样的原因，包裹在 ViewTransition 中的图片也会等待图片加载。

如果它位于新的 Suspense 边界实例内部，则会首先显示后备方案。当 Suspense 边界完全加载后，它会触发 `<ViewTransition>` 以动画方式显示内容。

根据你放置 `<ViewTransition>` 的位置，有两种方式可以为 Suspense 边界添加动画：

**更新**：

```
<ViewTransition>
  <Suspense fallback={<A />}>
    <B />
  </Suspense>
</ViewTransition>
```

在这种情况下，当内容从 A 变为 B 时，它将被视为 "update" 并相应地应用该类。A 和 B 都将获得相同的 `view-transition-name`，因此默认情况下它们表现为交叉淡入淡出。

<Sandpack>

```js src/Video.js hidden
function Thumbnail({video, children}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}

export function VideoPlaceholder() {
  const video = {image: 'loading'};
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title loading" />
          <div className="video-description loading" />
        </div>
      </div>
    </div>
  );
}
```

```js
import {ViewTransition, useState, startTransition, Suspense} from 'react';
import {Video, VideoPlaceholder} from './Video';
import {useLazyVideoData} from './data';

function LazyVideo() {
  const video = useLazyVideoData();
  return <Video video={video} />;
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}>
        {showItem ? '➖' : '➕'}
      </button>
      {showItem ? (
        <ViewTransition>
          <Suspense fallback={<VideoPlaceholder />}>
            <LazyVideo />
          </Suspense>
        </ViewTransition>
      ) : null}
    </>
  );
}
```

```js src/data.js hidden
import {use} from 'react';

let cache = null;

function fetchVideo() {
  if (!cache) {
    cache = new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: '1',
          title: 'First video',
          description: 'Video description',
          image: 'blue',
        });
      }, 1000);
    });
  }
  return cache;
}

export function useLazyVideoData() {
  return use(fetchVideo());
}
```

```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.loading {
  background-image: linear-gradient(
    90deg,
    rgba(173, 216, 230, 0.3) 25%,
    rgba(135, 206, 250, 0.5) 50%,
    rgba(173, 216, 230, 0.3) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-title.loading {
  height: 20px;
  width: 80px;
  border-radius: 0.5rem;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
  border-radius: 0.5rem;
}
.video-description.loading {
  height: 15px;
  width: 100px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

**进入/退出**：

```
<Suspense fallback={<ViewTransition><A /></ViewTransition>}>
  <ViewTransition><B /></ViewTransition>
</Suspense>
```

在这种情况下，这是两个独立的 `ViewTransition` 实例，各自拥有自己的 `view-transition-name`。这将被视为 `<A>` 的 "exit" 和 `<B>` 的 "enter"。

你可以根据选择放置 `<ViewTransition>` 边界的位置来实现不同的效果。

---

### 选择退出动画 {/*opting-out-of-an-animation*/}

有时你正在包裹一个大型现有组件，例如整个页面，并希望为某些更新（例如更改主题）添加动画。然而，你并不希望它让整个页面内的所有更新都加入交叉淡入淡出——尤其是在你逐步添加更多动画时。

你可以使用类 `"none"` 来选择退出动画。通过将子组件包裹在 `"none"` 中，你可以禁用它们的更新动画，而父级仍然会触发动画。

```js
<ViewTransition>
  <div className={theme}>
    <ViewTransition update="none">{children}</ViewTransition>
  </div>
</ViewTransition>
```

这仅在主题更改时添加动画，而不会在仅子组件更新时添加动画。子组件仍然可以通过自己的 `<ViewTransition>` 再次选择加入动画，但至少这又变回了手动控制。

---

### 自定义动画 {/*customizing-animations*/}

默认情况下，`<ViewTransition>` 包含浏览器的默认交叉淡入淡出。

要自定义动画，你可以根据 `<ViewTransition>` 的激活方式，为 `<ViewTransition>` 组件提供参数来指定要使用的动画。

例如，我们可以减慢默认的交叉淡入淡出动画：

```js
<ViewTransition default="slow-fade">
  <Video />
</ViewTransition>
```

并在 CSS 中使用视图过渡类定义 slow-fade：

```css
::view-transition-old(.slow-fade) {
  animation-duration: 500ms;
}

::view-transition-new(.slow-fade) {
  animation-duration: 500ms;
}
```

<Sandpack>

```js src/Video.js hidden
function Thumbnail({video, children}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>

        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {ViewTransition, useState, startTransition} from 'react';
import {Video} from './Video';
import videos from './data';

function Item() {
  return (
    <ViewTransition default="slow-fade">
      <Video video={videos[0]} />
    </ViewTransition>
  );
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}>
        {showItem ? '➖' : '➕'}
      </button>

      {showItem ? <Item /> : null}
    </>
  );
}
```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
];
```

```css
::view-transition-old(.slow-fade) {
  animation-duration: 500ms;
}

::view-transition-new(.slow-fade) {
  animation-duration: 500ms;
}

#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

除了设置 `default`，你还可以提供 `enter`、`exit`、`update` 和 `share` 动画的配置。

<Sandpack>

```js src/Video.js hidden
function Thumbnail({video, children}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>

        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {ViewTransition, useState, startTransition} from 'react';
import {Video} from './Video';
import videos from './data';

function Item() {
  return (
    <ViewTransition enter="slide-in" exit="slide-out">
      <Video video={videos[0]} />
    </ViewTransition>
  );
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}>
        {showItem ? '➖' : '➕'}
      </button>

      {showItem ? <Item /> : null}
    </>
  );
}
```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
];
```

```css
::view-transition-old(.slide-in) {
  animation-name: slideOutRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-in) {
  animation-name: slideInRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-old(.slide-out) {
  animation-name: slideOutLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-out) {
  animation-name: slideInLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

@keyframes slideOutLeft {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
}

@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

---

### 使用类型自定义动画 {/*customizing-animations-with-types*/}

你可以使用 [`addTransitionType`](/reference/react/addTransitionType) API 在特定过渡类型为特定激活触发器时向子元素添加类名。这允许你为每种过渡类型自定义动画。

例如，为所有前进和后退导航自定义动画：

```js
<ViewTransition
  default={{
    'navigation-back': 'slide-right',
    'navigation-forward': 'slide-left',
  }}>
  <div>...</div>
</ViewTransition>;

// 在你的路由器中：
startTransition(() => {
  addTransitionType('navigation-' + navigationType);
});
```

当 ViewTransition 激活 "navigation-back" 动画时，React 会添加类名 "slide-right"。当 ViewTransition 激活 "navigation-forward" 动画时，React 会添加类名 "slide-left"。

未来，路由器和其它库可能会添加对标准视图过渡类型和样式的支持。

<Sandpack>

```js src/Video.js hidden
function Thumbnail({video, children}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {
  ViewTransition,
  addTransitionType,
  useState,
  startTransition,
} from 'react';
import {Video} from './Video';
import videos from './data';

function Item() {
  return (
    <ViewTransition
      enter={{
        'add-video-back': 'slide-in-back',
        'add-video-forward': 'slide-in-forward',
      }}
      exit={{
        'remove-video-back': 'slide-in-forward',
        'remove-video-forward': 'slide-in-back',
      }}>
      <Video video={videos[0]} />
    </ViewTransition>
  );
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <div className="button-container">
        <button
          onClick={() => {
            startTransition(() => {
              if (showItem) {
                addTransitionType('remove-video-back');
              } else {
                addTransitionType('add-video-back');
              }
              setShowItem((prev) => !prev);
            });
          }}>
          ⬅️
        </button>
        <button
          onClick={() => {
            startTransition(() => {
              if (showItem) {
                addTransitionType('remove-video-forward');
              } else {
                addTransitionType('add-video-forward');
              }
              setShowItem((prev) => !prev);
            });
          }}>
          ➡️
        </button>
      </div>
      {showItem ? <Item /> : null}
    </>
  );
}
```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
];
```

```css
::view-transition-old(.slide-in-back) {
  animation-name: slideOutRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-in-back) {
  animation-name: slideInRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-old(.slide-out-back) {
  animation-name: slideOutLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-out-back) {
  animation-name: slideInLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-old(.slide-in-forward) {
  animation-name: slideOutLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-in-forward) {
  animation-name: slideInLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-old(.slide-out-forward) {
  animation-name: slideOutRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-out-forward) {
  animation-name: slideInRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

@keyframes slideOutLeft {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
}

@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.button-container {
  display: flex;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

---

### 使用 JavaScript 添加动画 {/*animating-with-javascript*/}

虽然 [View Transition Classes](#view-transition-class) 允许你使用 CSS 定义动画，但有时你需要对动画进行命令式控制。`onEnter`、`onExit`、`onUpdate` 和 `onShare` 回调让你可以直接访问视图过渡伪元素，从而使用 [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) 为它们添加动画。

每个回调接收一个 `instance`，其中包含 `.old` 和 `.new` 属性，代表视图过渡伪元素。你可以像在 DOM 元素上一样对它们调用 `.animate()`：

```js
<ViewTransition
  onEnter={(instance) => {
    const anim = instance.new.animate(
      [
        {transform: 'scale(0.8)'},
        {transform: 'scale(1)'},
      ],
      {duration: 300, easing: 'ease-out'}
    );
    return () => anim.cancel();
  }}>
  <div>...</div>
</ViewTransition>
```

这允许你结合使用 CSS 驱动的动画和 JavaScript 驱动的动画。

在以下示例中，默认的交叉淡入淡出由 CSS 处理，而滑动动画由 `onEnter` 和 `onExit` 事件中的 JavaScript 驱动：

<Sandpack>

```js src/Video.js hidden
function Thumbnail({video, children}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>

        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {ViewTransition, useState, startTransition} from 'react';
import {Video} from './Video';
import videos from './data';
import {SLIDE_IN, SLIDE_OUT} from './animations';

function Item() {
  return (
    <ViewTransition
      default="none"
      /* CSS 驱动的默认交叉淡入淡出 */
      enter="auto"
      exit="auto"
      /* JS 驱动的滑动动画 */
      onEnter={(instance) => {
        const anim = instance.new.animate(
          SLIDE_IN,
          {duration: 500, easing: 'ease-out'}
        );
        return () => anim.cancel();
      }}
      onExit={(instance) => {
        const anim = instance.old.animate(
          SLIDE_OUT,
          {duration: 300, easing: 'ease-in'}
        );
        return () => anim.cancel();
      }}>
      <Video video={videos[0]} />
    </ViewTransition>
  );
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}>
        {showItem ? '➖' : '➕'}
      </button>

      {showItem ? <Item /> : null}
    </>
  );
}
```

```js src/animations.js
export const SLIDE_IN = [
  {transform: 'translateY(20px)'},
  {transform: 'translateY(0)'},
];

export const SLIDE_OUT = [
  {transform: 'translateY(0)'},
  {transform: 'translateY(-20px)'},
];
```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
];
```

```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}

```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

<Note>

#### 始终清理 View Transition Events {/*always-clean-up-view-transition-events*/}

View Transition Events 应始终返回一个清理函数：

```js {7}
<ViewTransition
  onEnter={(instance) => {
    const anim = instance.new.animate(
      SLIDE_IN,
      {duration: 500, easing: 'ease-out'}
    );
    return () => anim.cancel();
  }}
>
```

这允许浏览器在视图过渡被中断时取消动画。

</Note>

---

### 使用 JavaScript 为过渡类型添加动画 {/*animating-transition-types-with-javascript*/}

你可以使用传递给 `ViewTransition` 事件的 `types` 来根据过渡的触发方式有条件地应用不同的动画。

```js {3}
 <ViewTransition
  onEnter={(instance, types) => {
    const duration = types.includes('fast') ? 150 : 2000;
    const anim = instance.new.animate(
      SLIDE_IN,
      {duration: duration, easing: 'ease-out'}
    );
    return () => anim.cancel();
  }}
>
```

此示例调用 [`addTransitionType`](/reference/react/addTransitionType) 将过渡标记为 "fast"，然后调整动画时长：

<Sandpack>

```js src/Video.js hidden
function Thumbnail({video, children}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>

        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {ViewTransition, useState, startTransition, addTransitionType} from 'react';
import {Video} from './Video';
import videos from './data';
import {SLIDE_IN, SLIDE_OUT} from './animations';

function Item() {
  return (
    <ViewTransition
      onEnter={(instance, types) => {
        const duration = types.includes('fast') ? 150 : 2000;
        const anim = instance.new.animate(
          SLIDE_IN,
          {duration: duration, easing: 'ease-out'}
        );
        return () => anim.cancel();
      }}
      onExit={(instance, types) => {
        const duration = types.includes('fast') ? 150 : 500;
        const anim = instance.old.animate(
          SLIDE_OUT,
          {duration: duration, easing: 'ease-in'}
        );
        return () => anim.cancel();
      }}>
      <Video video={videos[0]} />
    </ViewTransition>
  );
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  const [isFast, setIsFast] = useState(false);
  return (
    <>
      <div>
        快速：<input type="checkbox" onChange={() => {setIsFast(f => !f)}} value={isFast}></input>
      </div><br />
      <button
        onClick={() => {
          startTransition(() => {
            if (isFast) {
              addTransitionType('fast');
            }
            setShowItem((prev) => !prev);
          });
        }}>
        {showItem ? '➖' : '➕'}
      </button>

      {showItem ? <Item /> : null}
    </>
  );
}
```

```js src/animations.js
export const SLIDE_IN = [
  {opacity: 0, transform: 'translateY(20px)'},
  {opacity: 1, transform: 'translateY(0)'},
];

export const SLIDE_OUT = [
  {opacity: 1, transform: 'translateY(0)'},
  {opacity: 0, transform: 'translateY(-20px)'},
];
```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
];
```

```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}

```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

---

### 构建支持视图过渡的路由器 {/*building-view-transition-enabled-routers*/}

React 会等待任何待处理的导航完成，以确保滚动恢复在动画内进行。如果导航被 React 阻塞，你的路由器必须在 `useLayoutEffect` 中解除阻塞，因为 `useEffect` 会导致死锁。

如果 `startTransition` 是从传统的 popstate 事件（例如在「后退」导航期间）启动的，它必须同步完成，以确保滚动和表单恢复正确工作。这与运行动画过渡相冲突。因此，React 会跳过来自 popstate 的动画，后退按钮的动画不会运行。你可以通过将路由器升级为使用 Navigation API 来解决这个问题。

---

## 故障排除 {/*troubleshooting*/}

### 我的 `<ViewTransition>` 没有激活 {/*my-viewtransition-is-not-activating*/}

`<ViewTransition>` 只有放置在任何 DOM 节点之前才会激活：

```js [3, 5]
function Component() {
  return (
    <div>
      <ViewTransition>你好</ViewTransition>
    </div>
  );
}
```

要修复，请确保 `<ViewTransition>` 位于任何其他 DOM 节点之前：

```js [3, 5]
function Component() {
  return (
    <ViewTransition>
      <div>你好</div>
    </ViewTransition>
  );
}
```

### 我收到了错误「There are two `<ViewTransition name=%s>` components with the same name mounted at the same time.」 {/*two-viewtransition-with-same-name*/}

当两个具有相同 `name` 的 `<ViewTransition>` 组件同时被挂载时，会出现此错误：

```js [3]
function Item() {
  // 🚩 所有项目都将获得相同的 "name"。
  return <ViewTransition name="item">...</ViewTransition>;
}

function ItemList({items}) {
  return (
    <>
      {items.map((item) => (
        <Item key={item.id} />
      ))}
    </>
  );
}
```

这将导致 View Transition 出错。在开发环境中，React 会检测此问题并将其呈现出来，并记录两条错误：

<ConsoleBlockMulti>
<ConsoleLogLine level="error">

There are two `<ViewTransition name=%s>` components with the same name mounted at the same time. This is not supported and will cause View Transitions to error. Try to use a more unique name e.g. by using a namespace prefix and adding the id of an item to the name.
{' '}at Item
{' '}at ItemList

</ConsoleLogLine>

<ConsoleLogLine level="error">

The existing `<ViewTransition name=%s>` duplicate has this stack trace.
{' '}at Item
{' '}at ItemList

</ConsoleLogLine>
</ConsoleBlockMulti>

要修复，请通过确保 `name` 唯一或在名称中添加 `id`，来保证整个应用中同时只有一个具有相同名称的 `<ViewTransition>` 被挂载：

```js [3]
function Item({id}) {
  // ✅ 所有项目都将获得唯一名称。
  return <ViewTransition name={`item-${id}`}>...</ViewTransition>;
}

function ItemList({items}) {
  return (
    <>
      {items.map((item) => (
        <Item key={item.id} item={item} />
      ))}
    </>
  );
}
```
