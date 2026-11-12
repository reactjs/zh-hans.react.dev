---
title: "React 19.3"
author: The React Team
date: 2026/09/09
description: React 19.3 新增了视图过渡、Fragment Refs、browser()、Trusted Types 等新特性。
---

2026 年 9 月 9 日 [The React Team](/community/team)

---

<Intro>

React 19.3 现已在 npm 上发布！

</Intro>


[去年](/blog/2025/04/23/react-labs-view-transitions-activity-and-more)，我们分享了即将在 React 中推出的新实验性 API：视图过渡（View Transitions）和 Fragment Refs。我们很高兴地宣布，这两项功能现已在 React 19.3 中正式稳定！

在这篇文章中，我们将介绍它们的工作原理，并涵盖此版本中一些其他值得注意的变更。

<InlineToc />

---

## React 新特性 {/*new-react-features*/}

### 视图过渡 {/*view-transition*/}

新的 `<ViewTransition>` 组件允许你使用浏览器的 [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API)，为元素的进入、退出、移动或尺寸变化添加动画。去年我们将其[作为实验性 API 分享](/blog/2025/04/23/react-labs-view-transitions-activity-and-more#view-transitions)，而在 19.3 中它已经稳定，可以正式使用了。

要为 UI 的某一部分添加动画，请将它包裹在 `<ViewTransition>` 中：

```js
import { ViewTransition } from 'react';

{isShowing && (
  <ViewTransition>
    <Component />
  </ViewTransition>
)}
```

现在，每当一次被标记为 [Transition](/reference/react/useTransition) 的更新改变了子组件的样式，或者导致 `ViewTransition` 被挂载或卸载时，React 都会为这次更新添加动画。

{/*
Updates outside of a Transition don't trigger animations, as those are meant to be urgent and reflected immediately in the UI. State updates inside of [startTransition](/reference/react/startTransition), a [`<Suspense>`](/reference/react/Suspense) reveal, or an update from [`useDeferredValue`](/reference/react/useDeferredValue) all cause a View Transition to animate.
*/}

React 会根据树的变化方式来选择运行哪种动画：

- **enter**：添加了 `<ViewTransition>`。
- **exit**：移除了 `<ViewTransition>`。
- **update**：`<ViewTransition>` 的子元素的样式或内容发生了变化。
- **share**：一个具名的 `<ViewTransition>` 在一处被移除，同时在另一处被添加。

请注意，未被标记为 Transition 的更新不会触发动画，因为这类更新是紧急的，应当立即反映在 UI 中。[startTransition](/reference/react/startTransition) 内部的状态更新、[`<Suspense>`](/reference/react/Suspense) 的内容展示，以及来自 [`useDeferredValue`](/reference/react/useDeferredValue) 的更新，都会让视图过渡播放动画。

下面是一个进入/退出动画的简单示例：

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
import { ViewTransition, useState, startTransition } from 'react';
import { Video } from './Video';
import videos from './data';

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

      {showItem && (
        <ViewTransition>
          <Video video={videos[0]} />
        </ViewTransition>
      )}
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
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

默认情况下，`<ViewTransition>` 会使用平滑的交叉淡入淡出动画。你可以通过传入 [View Transition Class](/reference/react/ViewTransition#view-transition-class) 并在 CSS 中定义动画来自定义每种动画；也可以使用 [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)，通过[事件属性](/reference/react/ViewTransition#view-transition-event)（`onEnter`、`onExit`、`onShare`、`onUpdate`）以命令式的方式触发动画。

{/*
There are a couple of rules to keep in mind. A `<ViewTransition>` only animates on enter and exit if it's the first thing rendered in its subtree, before any DOM node, and each shared `name` must be unique across your app at any given time. See [Troubleshooting](/reference/react/ViewTransition#troubleshooting) for the details.
 */}

目前，`<ViewTransition>` 仅支持 DOM 环境。我们正在为 React Native 及其他平台开发支持。

更多信息请参阅 [`<ViewTransition>` 文档](/reference/react/ViewTransition)。

---

#### `addTransitionType` {/*add-transition-type*/}

有时，你可能想为同一种状态更新定制不同的动画。例如，在轮播图中_向前_切换到第三张幻灯片时，幻灯片应该从右向左播放动画；而_向后_切换时，则应该从左向右播放动画——尽管这两种操作都会将 currentSlide 设置为 3。

你可以在进行状态更新的同时调用 `addTransitionType`，为特定的视图过渡定制动画。这让你能为一次特定过渡的_原因_添加更多信息：

```js {3,10}
function nextSlide() {
  startTransition(() => {
    addTransitionType('next');
    setCurrentSlide(c => c + 1);
  });
}

function previousSlide() {
  startTransition(() => {
    addTransitionType('previous');
    setCurrentSlide(c => c - 1);
  });
}
```

然后，你就可以根据过渡类型来指定不同的动画：

```js
<ViewTransition
  enter={{
    'next': 'from-right',
    'previous': 'from-left',
  }}
  exit={{
    'next': 'to-left',
    'previous': 'to-right',
  }}
>
  <Page />
</ViewTransition>
```

下面是一个示例：

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
  Fragment
} from 'react';
import { Video } from './Video';
import videos from './data';
import './animations.css';

export default function Component() {
  const [selected, setSelected] = useState(0)
  const video = videos[selected];

  return (
    <>
      <div className="button-container">
        <button
          onClick={() => {
            startTransition(() => {
              addTransitionType('previous');
              setSelected(c => c > 0 ? c - 1 : videos.length - 1 )
            });
          }}>
          ⬅️
        </button>
        <button
          onClick={() => {
            startTransition(() => {
              addTransitionType('next');
              setSelected(c => c + 1 < videos.length ? c + 1 : 0)
            });
          }}>
          ➡️
        </button>
      </div>

      <ViewTransition
        key={video.id}
        enter={{
          'next': 'from-right',
          'previous': 'from-left'
        }}
        exit={{
          'next': 'to-left',
          'previous': 'to-right'
        }}
      >
        <Video video={video} />
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
  {
    id: '5',
    title: 'Fifth video',
    description: 'Video description',
    image: 'yellow',
  },
  {
    id: '6',
    title: 'Sixth video',
    description: 'Video description',
    image: 'gray',
  },
];
```

```css src/animations.css
::view-transition-old(*),
::view-transition-new(*) {
  animation-duration: 250ms;
  animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
}

::view-transition-new(.from-right) {
  --offset: 100%;
  animation-name: slide-in;
}

::view-transition-new(.from-left) {
  --offset: -100%;
  animation-name: slide-in;
}

::view-transition-old(.to-right) {
  --offset: 100%;
  animation-name: slide-out;
}

::view-transition-old(.to-left) {
  --offset: -100%;
  animation-name: slide-out;
}

@keyframes slide-in {
  from {
    transform: translateX(var(--offset));
    opacity: 0;
  }
}

@keyframes slide-out {
  to {
    transform: translateX(var(--offset));
    opacity: 0;
  }
}
```

```css src/styles.css
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
  gap: 8px;
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

.thumbnail.yellow {
  background-image: conic-gradient(at top right, #c76a15, #FABD62, #2b3491);
}

.thumbnail.gray {
  background-image: conic-gradient(at top right, #c76a15, #4E5769, #2b3491);
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
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

React 还会将每个过渡类型作为浏览器的 [view transition type](https://www.w3.org/TR/css-view-transitions-2/#active-view-transition-pseudo-examples) 添加到元素上，因此你可以在 CSS 中使用 `:active-view-transition-type(...)` 来限定动画的作用范围。

更多信息请参阅 [`addTransitionType` 文档](/reference/react/addTransitionType)。

---

#### 使用 Suspense 为后备方案、图片和字体添加动画 {/*animating-fallbacks-images-and-fonts-with-suspense*/}

React 视图过渡最令人兴奋的一点，是它与 Suspense 的集成方式。

你可以将 Suspense 边界包裹在 `<ViewTransition>` 中，为它展示子内容的过程添加动画：

```js
<ViewTransition>
  <Suspense fallback={<Loading />}>
    <Component />
  </Suspense>
</ViewTransition>
```

当子内容加载完成后，React 将触发一个从后备方案到最终内容的 **update** 动画。

下面是一个示例。尝试按下 ➕ 来渲染一个首次渲染时会挂起的 LazyVideo：

<Sandpack>

```js src/Video.js hidden
import { ViewTransition } from 'react';

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
import { Suspense, useState, startTransition, use, ViewTransition } from 'react';
import { Video, VideoPlaceholder } from './Video';
import { fetchVideo } from './data';

export default function Component() {
  const [showItem, setShowItem] = useState(false);

  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}
      >
        {showItem ? '➖' : '➕'}
      </button>

      {showItem && (
        <ViewTransition>
          <Suspense fallback={<VideoPlaceholder />}>
            <LazyVideo />
          </Suspense>
        </ViewTransition>
      )}
    </>
  );
}

function LazyVideo() {
  const video = use(fetchVideo());

  return <Video video={video} />;
}
```


```js src/data.js hidden
let cache = null;

export function fetchVideo() {
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
```

```css
::view-transition-old(*),
::view-transition-new(*) {
  /* animation-duration: 750ms; */
  /* animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1); */
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
.loading {
  background-image: linear-gradient(
    90deg,
    rgba(173, 216, 230, 0.3) 25%,
    rgba(135, 206, 250, 0.5) 50%,
    rgba(173, 216, 230, 0.3) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  z-index: 999;
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
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
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
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

虽然这样做是可行的，但你会注意到，即使视频已经加载完成，后续展示时它仍会有进入和退出的动画。（你可能还会注意到，后备方案第一次显示时有一个淡入效果。）

一般来说，与 Suspense 配合的动画最好谨慎使用，并且避免用在那些本可以立即显示的已缓存 UI 上。

以下是在使用 Suspense 添加动画时获得良好用户体验的一些原则：

- 后备方案应当_不带动画_地立即出现
- 后备方案更新到最终内容时_带动画_
- 不会挂起的子内容应当_不带动画_地立即出现

这样，当内容已经加载完成时，你的应用依然保持敏捷响应；动画只在让后备方案到最终内容的更新更加无缝时才会使用。

要修复上面的示例，我们可以禁用 update 之外的所有动画：

```js {1}
<ViewTransition update="auto" default="none">
  <Suspense fallback={<Fallback />}>
    <Component />
  </Suspense>
</ViewTransition>
```

我们来看看现在的表现：

<Sandpack>

```js src/Video.js hidden
import { ViewTransition } from 'react';

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
import { Suspense, useState, startTransition, use, ViewTransition } from 'react';
import { Video, VideoPlaceholder } from './Video';
import { fetchVideo } from './data';

export default function Component() {
  const [showItem, setShowItem] = useState(false);

  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}
      >
        {showItem ? '➖' : '➕'}
      </button>

      {showItem && (
        <ViewTransition update="auto" default="none">
          <Suspense fallback={<VideoPlaceholder />}>
            <LazyVideo />
          </Suspense>
        </ViewTransition>
      )}
    </>
  );
}

function LazyVideo() {
  const video = use(fetchVideo());

  return <Video video={video} />;
}
```


```js src/data.js hidden
let cache = null;

export function fetchVideo() {
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
```

```css
::view-transition-old(*),
::view-transition-new(*) {
  /* animation-duration: 5000ms; */
  /* animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1); */
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
.loading {
  background-image: linear-gradient(
    90deg,
    rgba(173, 216, 230, 0.3) 25%,
    rgba(135, 206, 250, 0.5) 50%,
    rgba(173, 216, 230, 0.3) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  z-index: 999;
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
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
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
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

请注意，点击按钮后后备方案会立即出现，这让我们的 UI 对用户操作保持即时响应。此外，一旦视频加载完成，切换显示就是即时的。

根据你想要达到的效果，还有其他模式可以使用。更多信息请查看关于[配合 Suspense 使用动画](/reference/react/ViewTransition#animating-from-suspense-content)的文档。

---

除了为后备方案添加动画之外，视图过渡还提供了一种方式，让图片或字体在加载期间触发 Suspense。

这让你可以避免浏览器的默认行为——图片或字体在加载完成时突然闪烁出现——而是构建考虑组件所有资源的、协调一致的加载序列。

将图片或字体包裹在 `<ViewTransition>` 内部，即可在它们加载期间触发 Suspense：

```js
<ViewTransition>
  <Suspense fallback={<Fallback />}>
    <img src={imageSrc} />

    <style href={fontSrc} precedence="default">
      {`@font-face {
        font-family: 'Fancy';
        src: url(${fontSrc}) format('truetype');
        font-display: swap;
      }`}
    </style>
  </Suspense>
</ViewTransition>
```

下面是一个组件的示例，它会一直挂起，直到数据、图片和字体全部加载完成：


<Sandpack>

```js
import { ViewTransition, Suspense, use, useState, startTransition } from 'react';
import { fetchQuote } from './data.js';
import { freshStylesheetUrl, freshImageUrl } from './resources.js';
import { ProfileCard, ProfileCardLoading } from './ProfileCard.js';
import { VanillaProfileCard } from './VanillaProfileCard.js';

export default function App() {
  const [resources, setResources] = useState(null);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setResources({
              quotePromise: fetchQuote(),
              stylesheet: freshStylesheetUrl(),
              image: freshImageUrl(),
            });
          });
        }}>
        Show profile
      </button>

      {resources && (
        <ViewTransition update='auto' default='none'>
          <Suspense fallback={<ProfileCardLoading />}>
            <ProfileCard resources={resources} />
          </Suspense>
        </ViewTransition>
      )}

      <hr />

      <VanillaProfileCard />
    </>
  );
}
```

```js src/ProfileCard.js
import { use } from 'react';

export function ProfileCard({ resources }) {
  const quote = use(resources.quotePromise);
  return (
    <>
      <link rel="stylesheet" href={resources.stylesheet} precedence="default" />
      <div className="profile-card">
        <img src={resources.image} alt="Jack Pope" width={80} height={80} />
        <div>
          <p className="name">Jack Pope</p>
          <p className="bio">{quote}</p>
        </div>
      </div>
    </>
  );
}

export function ProfileCardLoading() {
  return (
    <div className="profile-card">
      <div className="avatar-placeholder" />
      <div>
        <p className="name name-placeholder">&nbsp;</p>
        <p className="bio bio-placeholder">&nbsp;</p>
      </div>
    </div>
  );
}
```


```js src/VanillaProfileCard.js
import { useRef } from 'react';
import { fetchQuote } from './data.js';
import { freshStylesheetUrl, freshImageUrl } from './resources.js';

export function VanillaProfileCard() {
  const ref = useRef(null);
  async function show() {
    const quote = await fetchQuote();
    const doc = ref.current.contentWindow.document;
    doc.open();
    doc.write(`
      <style>
        body { margin: 0; font-family: sans-serif; }
        img { object-fit: cover; }
        .profile-card { display: flex; gap: 12px; align-items: center; }
        .profile-card img { border-radius: 50%; background: #dfe3e9; }
        .name { margin: 0 0 4px; font-family: 'Caveat', sans-serif; font-size: 22px; line-height: 28px; font-weight: bold; }
        .bio { margin: 0; font-family: 'Caveat', sans-serif; font-size: 20px; line-height: 26px; }
      </style>
      <div class="profile-card">
        <img src="${freshImageUrl()}" alt="Jack Pope" width="80" height="80" />
        <div>
          <p class="name">Jack Pope</p>
          <p class="bio">${quote}</p>
        </div>
      </div>
      <link rel="stylesheet" href="${freshStylesheetUrl()}">
    `);
    doc.close();
  }
  return (
    <>
      <button onClick={show}>Show profile (without React)</button>
      <iframe ref={ref} title="Vanilla profile card" className="vanilla-frame" />
    </>
  );
}
```

```js src/resources.js hidden
// Add a unique parameter so the resources aren't cached,
// and every run shows the loading state.
export function freshStylesheetUrl() {
  return (
    'https://fonts.googleapis.com/css2?family=Caveat&display=swap' +
    '&t=' +
    Date.now()
  );
}

export function freshImageUrl() {
  return 'https://react.dev/images/team/jack-pope.jpg?t=' + Date.now();
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.

export async function fetchQuote() {
  // Add a fake delay to make waiting noticeable.
  await new Promise((resolve) => {
    setTimeout(resolve, 250);
  });
  return 'The best way to predict the future is to invent it.';
}
```

```css
#root {
  min-height: 320px;
}
button {
  margin-right: 8px;
}
hr {
  margin: 16px 0;
}
img {
  object-fit: cover;
}
.profile-card {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-top: 1em;
}
.profile-card img {
  border-radius: 50%;
  background: #dfe3e9;
}
.name {
  margin: 0 0 4px;
  font-family: 'Caveat', sans-serif;
  font-size: 22px;
  line-height: 28px;
  font-weight: bold;
}
.bio {
  margin: 0;
  font-family: 'Caveat', sans-serif;
  font-size: 20px;
  line-height: 26px;
}
.profile-card img {
  display: block;
}
.avatar-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #dfe3e9;
}
.name-placeholder,
.bio-placeholder {
  border-radius: 4px;
  background: #dfe3e9;
  color: transparent;
}
.name-placeholder {
  width: 90px;
}
.bio-placeholder {
  width: 220px;
}
.vanilla-frame {
  display: block;
  margin-top: 1em;
  border: none;
  width: 100%;
  height: 110px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

关于等待图片、字体或样式表加载的更多信息，请参阅 [Suspense 文档](/reference/react/Suspense#waiting-for-a-font-to-load)。

---

### Fragment Refs {/*fragment-refs*/}

当你需要对组件的 DOM 节点进行更底层的控制时——例如附加事件监听器、观察可见性或移动焦点——通常可以使用 ref。但在某些情况下，这并不容易：

- 渲染一组没有统一父元素的兄弟节点组件
- 不将 `ref` 属性传递给另一个元素的组件

```js
function Component() {
  // How can we work with the list of DOM nodes rendered by this component?
  return (
    {posts.map(post => (
      <Heading key={post.id}>
        {post.title}
      </Heading>
    ))}
  )
}
```

为了挂载 ref 而添加一个包裹用的 `<div>` 有时可行，但它也可能干扰组件的样式或布局。此外，如果组件没有暴露 `ref` 属性，你就需要修改该组件来实现这一点——而如果它来自一个你无法控制的库，这可能根本做不到。

Fragment Refs 通过提供一组有限的常用 DOM 方法解决了这些问题，这些方法可以作用于任何 React 组件，无论它渲染什么内容。

在 19.3 中，你可以通过直接向 [`<Fragment>`](/reference/react/Fragment) 传递 ref 来使用它们。这个 ref 会给你一个 `FragmentInstance`，你可以用它来操作 Fragment 的 DOM 子元素：

```js {2,5-6,10}
function Component() {
  const fragmentRef = useRef(null);

  useEffect(() => {
    const fragmentInstance = fragmentRef.current;
    fragmentInstance.focus();
  }, []);

  return (
    <Fragment ref={fragmentRef}>
      {posts.map(post => (
        <Heading key={post.id}>
          {post.title}
        </Heading>
      ))}
    </Fragment>
  )
}
```

`FragmentInstance` 会_作为一个整体_来操作子元素的 DOM，而不会改变其结构：

- `addEventListener`、`removeEventListener` 和 `dispatchEvent` 管理一级子元素的事件。
- `focus`、`focusLast` 和 `blur` 以深度优先的方式在嵌套的子元素间移动焦点。
- `observeUsing` 和 `unobserveUsing` 用于连接 `IntersectionObserver` 或 `ResizeObserver`。
- `getClientRects`、`getRootNode`、`compareDocumentPosition` 和 `scrollIntoView` 让你能够测量并滚动到 Fragment 的一级子元素。

这样，Fragment Refs 让你能够为其他组件附加行为，而无需修改这些组件的内部实现，也不会改变它们已经产出的 DOM 结构。

这个示例展示了一个带有 `onChange` 属性的 `InView` 组件，每当其子元素进入或离开视口时，该属性就会被触发：

<Sandpack>

```js src/App.js active
import { useState } from 'react';
import Card from './Card';
import InView from './InView';

export default function App() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className={isVisible ? 'page visible' : 'page'}>
      <div className="filler">Scroll down</div>

      <InView onChange={setIsVisible}>
        <Card title="First section" />
        <Card title="Second section" />
      </InView>

      <div className="filler">Scroll up</div>
    </div>
  );
}
```

```js src/Card.js
export default function Card({ title }) {
  return <div className="card">{title}</div>;
}
```

```js src/InView.js
import {
  Fragment,
  useRef,
  useLayoutEffect,
} from 'react';

export default function InView({ onChange, children }) {
  const fragmentRef = useRef(null);

  useLayoutEffect(() => {
    const visibleElements = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            visibleElements.add(e.target);
          } else {
            visibleElements.delete(e.target);
          }
        });
        onChange(visibleElements.size > 0);
      }
    );
    const fragmentInstance = fragmentRef.current;
    fragmentInstance.observeUsing(observer);
    return () => {
      fragmentInstance.unobserveUsing(observer);
    };
  }, [onChange]);

  return (
    <Fragment ref={fragmentRef}>
      {children}
    </Fragment>
  );
}
```

```css
.page {
  transition: background 0.3s;
}

.page.visible {
  background: #d4edda;
}

.filler {
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  font-size: 14px;
}

.card {
  padding: 16px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 8px 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  font-weight: 600;
  font-size: 14px;
}
```


```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

请注意，`InView` 能够为它的子元素附加行为，即使这些子元素没有统一的父 DOM 元素，而且 `Card` 也没有暴露 `ref` 属性。

关于使用 Fragment Refs 的更多信息，请参阅 [`<Fragment>` 文档](/reference/react/Fragment)。

---

## React DOM 新特性 {/*new-react-dom-features*/}

### `browser` {/*browser*/}

如果你的应用使用了服务端渲染，你的组件会在两种不同的环境中渲染：

- 在服务器上，组件负责渲染生成初始 HTML
- 在客户端上，组件负责为这些 HTML 附加事件处理器

大多数时候，你的组件应该能够生成与其客户端初次渲染输出相匹配的 HTML，从而确保正确完成 hydration，同时让用户在初次加载时尽可能看到更多内容。

但在少数情况下，组件可能无法在服务器上生成有意义的 UI。例如，它可能依赖 `localStorage` 这样仅在浏览器中可用的 API，或者需要读取浏览器的本地时区。在这些情况下，你可能希望让该组件完全退出服务端渲染。

以前，你可能会在 Effect 中更新某个状态来实现这一点，或者通过检查 `window` 等浏览器 API 是否存在来判断：

```js
function Component() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true)
  }, [])

  // ...
}

function Component() {
  const isBrowser = typeof window !== 'undefined';

  // ...
}
```

在 19.3 中，React 为这种做法提供了一个一等公民（first-class）API。

组件可以调用 `use(browser())` 来退出服务端渲染：

```js {5}
import { use } from 'react';
import { browser } from 'react-dom';

function Component() {
  use(browser());

  // ...
}
```

这会在服务器上触发 Suspense，但在客户端_不会_。在服务端渲染期间，最近的 Suspense 边界的后备方案会显示在 HTML 中。一旦组件在客户端完成 hydration，`use(browser())` 就不会挂起，组件可以继续正常渲染。

下面是一个渲染设备本地时区的组件示例。按下 **重新加载**，可以看到初始 HTML 以及随后 React 在客户端的首次渲染：

<Sandpack>

```js
import { Suspense, use } from 'react';
import { browser } from 'react-dom';

function TimeZone() {
  use(browser());
  const timeZone = new Intl.DateTimeFormat().resolvedOptions().timeZone;

  return <p>{timeZone}</p>
}

export default function App() {
  return (
    <>
      <p>Your current time zone is:</p>
      <Suspense fallback="Loading...">
        <TimeZone />
      </Suspense>
    </>
  );
}
```


```js src/Document.js hidden
import App from './App.js';

export default function Document() {
  return (
    <html lang="en">
      <head>
        <title>Event details</title>
        <style>{`
          h1 { font-size: 24px; margin-top: 0; }
        `}</style>
      </head>
      <body>
        <App />
      </body>
    </html>
  );
}
```

```js src/index.js hidden
import { hydrateRoot } from 'react-dom/client';
import { renderToReadableStream } from 'react-dom/server';
import Document from './Document.js';
import { flushReadableStreamToFrame } from './demo-helpers.js';
import './styles.css';

async function main(frame) {
  const stream = await renderToReadableStream(<Document />);
  await flushReadableStreamToFrame(stream, frame);

  // Wait so both the fallback and hydrated content are visible.
  await new Promise(resolve => setTimeout(resolve, 1200));
  hydrateRoot(frame.contentDocument, <Document />);
}

main(document.getElementById('preview'));
```

```js src/demo-helpers.js hidden
export async function flushReadableStreamToFrame(readable, frame) {
  const doc = frame.contentWindow.document;
  const decoder = new TextDecoder();
  const reader = readable.getReader();

  while (true) {
    const {done, value} = await reader.read();
    if (done) {
      break;
    }
    doc.write(decoder.decode(value, {stream: true}));
  }

  doc.write(decoder.decode());
  doc.close();
}
```

```html public/index.html hidden
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Conditional browser rendering</title>
</head>
<body>
  <iframe id="preview" title="Rendered page"></iframe>
</body>
</html>
```

```css src/styles.css hidden
iframe {
  width: 100%;
  height: 240px;
  border: 0;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

由于 TimeZone 在服务器上挂起，初始 HTML 中会包含 Suspense 的后备方案。经过一段人为的短暂延迟后，React 会对页面进行 hydration，让组件在浏览器中正常渲染。

因此，对于无法在服务端渲染期间生成有意义 UI 的组件，`browser` 让你能够使用 Suspense 来呈现它们的加载状态，使它们可以与其他挂起直到就绪才渲染的组件协同工作。

---

与其他 `use` 调用一样，`use(browser())` 可以在条件语句中或提前返回（early return）之后调用。这让你能够编写根据某个条件（例如 prop 的值）退出服务端渲染的组件或自定义 Hook。

下面是上面的同一个示例，只不过现在我们的 TimeZone 组件接受一个可选的默认值，可以将它作为初始 HTML 的一部分渲染出来：

<Sandpack>

```js
import { Suspense, use } from 'react';
import { browser } from 'react-dom';

function TimeZone({ defaultValue }) {
  if (defaultValue) {
    return <p>{defaultValue}</p>;
  }

  use(browser());
  const localTimeZone = new Intl.DateTimeFormat().resolvedOptions().timeZone;

  return <p>{localTimeZone}</p>
}

export default function App() {
  return (
    <>
      <div>
        <p>The event's time zone is:</p>
        <TimeZone defaultValue='America/New_York' />
      </div>

      <hr />

      <div>
        <p>Your current time zone is:</p>
        <Suspense fallback="Loading...">
          <TimeZone />
        </Suspense>
      </div>
    </>
  );
}
```


```js src/Document.js hidden
import App from './App.js';

export default function Document() {
  return (
    <html lang="en">
      <head>
        <title>Event details</title>
        <style>{`
          h1 { font-size: 24px; margin-top: 0; }
        `}</style>
      </head>
      <body>
        <App />
      </body>
    </html>
  );
}
```

```js src/index.js hidden
import { hydrateRoot } from 'react-dom/client';
import { renderToReadableStream } from 'react-dom/server';
import Document from './Document.js';
import { flushReadableStreamToFrame } from './demo-helpers.js';
import './styles.css';

async function main(frame) {
  const stream = await renderToReadableStream(<Document />);
  await flushReadableStreamToFrame(stream, frame);

  // Wait so both the fallback and hydrated content are visible.
  await new Promise(resolve => setTimeout(resolve, 1200));
  hydrateRoot(frame.contentDocument, <Document />);
}

main(document.getElementById('preview'));
```

```js src/demo-helpers.js hidden
export async function flushReadableStreamToFrame(readable, frame) {
  const doc = frame.contentWindow.document;
  const decoder = new TextDecoder();
  const reader = readable.getReader();

  while (true) {
    const {done, value} = await reader.read();
    if (done) {
      break;
    }
    doc.write(decoder.decode(value, {stream: true}));
  }

  doc.write(decoder.decode());
  doc.close();
}
```

```html public/index.html hidden
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Conditional browser rendering</title>
</head>
<body>
  <iframe id="preview" title="Rendered page"></iframe>
</body>
</html>
```

```css src/styles.css hidden
iframe {
  width: 100%;
  height: 240px;
  border: 0;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

请注意，TimeZone 只在第二种情况下（即没有提供默认值时）才会挂起。

这种模式的另一个实用示例是：让 `useQuery` 这样的数据请求 Hook 退出服务端渲染，除非传入了该查询的初始数据（例如来自服务端组件或框架的 loader 函数）：

```js {3}
function useBrowserQuery(query, options) {
  if (options.initialData === undefined) {
    use(browser());
  }

  return useQuery(query, options);
}

function ProductDetails({ productId, initialData }) {
  const product = useBrowserQuery(`/api/products/${productId}`, {
    initialData,
  });

  return <h1>{product.name}</h1>;
}
```

现在，只要 ProductDetails 组件在服务端渲染期间收到了 `initialData`，它就可以被包含在 HTML 中。如果没有收到，它会一直挂起，直到在浏览器中渲染——届时 `useQuery` 就可以照常获取数据或从缓存中读取数据。

关于 `browser` 的更多信息，请[查阅文档](/reference/react-dom/browser)。

---

### Trusted Types 支持 {/*trusted-types-support*/}

React 19.3 与浏览器的 [Trusted Types API](https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API) 集成，这是一项有助于防范基于 DOM 的 XSS 攻击的安全特性。当站点通过 `Content-Security-Policy: require-trusted-types-for 'script'` 强制启用 Trusted Types 时，浏览器会要求传递给 `innerHTML` 等注入点（injection sink）的值必须是通过你的净化策略创建的类型化对象（`TrustedHTML`、`TrustedScript`、`TrustedScriptURL`），而不是原始字符串。

以前，React 在将值传递给 DOM API 之前总是先将其强制转换为字符串（通过 `'' + value`），这会把 Trusted Types 对象变回浏览器会拒绝的普通字符串。现在 React 会将这些值原样传递，不再进行强制转换，因此浏览器可以对它们进行验证，你的 Trusted Types 策略也能按预期工作。

---

## React 服务端组件新特性 {/*new-react-server-components-features*/}

### `<Context>` 可以直接在服务端组件中渲染 {/*context-can-be-rendered-directly-in-server-components*/}

虽然服务端组件不能_创建_ Context，但它们可以通过从 `'use client'` 模块导入来_渲染_ Context。

以前，这需要客户端模块导出一个单独的包装组件，通常称为 Provider：

```js {7-9}
// user-context.js
'use client';
import { createContext } from 'react';

export const UserContext = createContext(null);

export function UserProvider({ currentUser, children }) {
  return <UserContext value={currentUser}>{children}</UserContext>;
}
```

```js {8}
// server-component.js
import { UserProvider } from './user-context';

export async function Layout({ children }) {
  const currentUser = await getCurrentUser();

  return (
    <UserProvider currentUser={currentUser}>
      {children}
    </UserProvider>
  )
}
```

请注意，在这个示例中，这个 Provider 唯一做的事情，就是把来自服务端组件的 prop 直接传递给 Context。

在 React 19.3 中，服务端组件可以直接从 `'use client'` 模块导入并渲染 Context，无需额外的包装组件：

```js {5}
// user-context.js
'use client';
import { createContext } from 'react';

export const UserContext = createContext(null);
```

```js {8}
// server-component.js
import { UserContext } from './user-context';

export async function Layout({ children }) {
  const currentUser = await getCurrentUser();

  return (
    <UserContext value={currentUser}>
      {children}
    </UserContext>
  )
}
```

这对于那些仅仅为了让服务端组件与客户端树的其他部分共享数据而存在的 Context 尤其有用。


---

## 更新日志 {/*changelog*/}

其他值得注意的变更
- `react`：独立渲染各个 Transition，而不是将它们纠缠在一次渲染中，这样缓慢的 Transition 不再阻塞不相关的 Transition [#37290](https://github.com/react/react/pull/37290)
- `react-dom`：在 hydration 期间的 Strict Mode 下双重调用 Effect，与客户端渲染的根节点保持一致 [#35961](https://github.com/react/react/pull/35961)
- `react`：当 `use` 在条件语句中被错误使用时添加警告 [#37104](https://github.com/react/react/pull/37104)
- `react`：在 `useActionState` 的错误信息中将「form state」重命名为「action state」[#35790](https://github.com/react/react/pull/35790)
- `react-dom`：添加对 `onFullscreenChange` 和 `onFullscreenError` 事件的支持 [#34621](https://github.com/react/react/pull/34621)
- `react-dom`：添加对 `maskType` SVG 属性的支持 [#35921](https://github.com/react/react/pull/35921)
- `react-dom`：支持模块资源的 `fetchPriority` [#36835](https://github.com/react/react/pull/36835)
- `react-dom`：当 React 在 Server Action 之后自动重置表单时触发 `onReset` [#35176](https://github.com/react/react/pull/35176)
- `react-dom`：在 `submit` 事件中包含 `submitter` [#35590](https://github.com/react/react/pull/35590)
- `react-dom`：将 iframe 上的 `credentialless` 识别为布尔属性 [#36148](https://github.com/react/react/pull/36148)
- `react-dom`：将来自 `resize` 事件的更新批量处理到下一帧 [#35117](https://github.com/react/react/pull/35117)
- `react-server`：将 `Error.cause` [#35810](https://github.com/react/react/pull/35810) 和 `AggregateError.errors` [#36156](https://github.com/react/react/pull/36156) 传输到客户端
- `react-server`：在 Flight 中添加对 `<Activity>` 的支持 [#34697](https://github.com/react/react/pull/34697)

重要的错误修复

- `react`：修复 `useDeferredValue` 卡在旧值上的问题 [#36134](https://github.com/react/react/pull/36134)
- `react`：修复 Context 传播到 Suspense 后备方案 [#36160](https://github.com/react/react/pull/36160) 以及穿过已挂起的 Suspense 边界 [#35839](https://github.com/react/react/pull/35839) 的问题
- `react`：修复在隐藏树中更新已脱水的 Suspense 边界时的挂起问题 [#37135](https://github.com/react/react/pull/37135)
- `react`：修复 `useSyncExternalStore` 遗漏 `<Activity>` 树隐藏期间发生的 store 变更的问题 [#36947](https://github.com/react/react/pull/36947)
- `react`：修复 `useEffectEvent` 在 `forwardRef` 和 `memo` 组件中读取最新值的问题 [#34831](https://github.com/react/react/pull/34831)
- `react`：修复组件状态更新时表单状态被重置的问题 [#34075](https://github.com/react/react/pull/34075)
- `react`：修复 `lazy`、`memo` 以及改变组件类型的编辑中的多个 Fast Refresh 错误 [#36965](https://github.com/react/react/pull/36965)、[#36964](https://github.com/react/react/pull/36964)、[#36963](https://github.com/react/react/pull/36963)、[#36950](https://github.com/react/react/pull/36950)
- `react`：修复了当包含 `<title>` 的 `<Activity>` 从 `visible` 模式切换为 `hidden` 后，`<title>` 仍被提升到 `<head>` 的问题 [#34983](https://github.com/react/react/pull/34983)
- `react`：不让错误从隐藏的 `<Activity>` 中逃逸 [#35074](https://github.com/react/react/pull/35074)
- `react`：隐藏渲染在隐藏 `<Activity>` 内部的 portal 内容 [#35091](https://github.com/react/react/pull/35091)
- `react`：不再在错误信息中引用内部类型 `<Offscreen>` [#35763](https://github.com/react/react/pull/35763)
- `react-dom`：修复委托事件和已聚焦元素的焦点问题 [#36010](https://github.com/react/react/pull/36010)
- `react-dom`：按照 DOM 规范规范化捕获选项，修复 `FragmentInstance` 监听器泄漏 [#36047](https://github.com/react/react/pull/36047)
- `react-dom`：修复 Mobile Safari 中 `<ViewTransition>` 的崩溃问题 [#35337](https://github.com/react/react/pull/35337)
- `react-dom`：修复 `<ViewTransition>` 与 `SuspenseList` 一起使用时的崩溃问题 [#35520](https://github.com/react/react/pull/35520)
- `react-dom`：更新 `type="number"` 输入框的 `defaultValue`，使其与其他输入类型保持一致 [#36980](https://github.com/react/react/pull/36980)
- `react-dom`：当 `innerHTML` 未变化时不再设置它 [#36949](https://github.com/react/react/pull/36949)
- `react-dom`：修复 `nonce` 属性上的 hydration 不匹配误报 [#37030](https://github.com/react/react/pull/37030)
- `react-dom`：修复 `react-dom/server` 在 Deno 上挂起的问题 [#35235](https://github.com/react/react/pull/35235)
- `react-server`：修复 `decodeReplyFromBusboy` 中丢失 `FormData` 条目的问题 [#36468](https://github.com/react/react/pull/36468)
- `react-server`：修复深层异步链导致的栈溢出 [#35612](https://github.com/react/react/pull/35612) 以及调试信息指数增长导致的 `RangeError` [#37481](https://github.com/react/react/pull/37481)

完整的变更列表请参阅[更新日志](https://github.com/react/react/blob/main/CHANGELOG.md)。

---

_感谢 [Sam Selikoff](https://x.com/samselikoff) 撰写本文，感谢 [Matt Carroll](https://mattcarrollcode.com/)、[Dan Abramov](https://bsky.app/profile/danabra.mov) 和 [Andrew Clark](https://x.com/acdlite) 审阅本文。_
