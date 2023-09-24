---
title: '使用 Effect 同步'
---

<Intro>

有些组件需要与外部系统同步。例如，你可能希望根据 React state 控制非 React 组件、设置服务器连接或在组件出现在屏幕上时发送分析日志。Effects 会在渲染后运行一些代码，以便可以将组件与 React 之外的某些系统同步。

</Intro>

<YouWillLearn>

- 什么是 Effect
- Effect 与事件（event）有何不同
- 如何在组件中声明 Effect
- 如何避免不必要地重新运行 Effect
- 为什么 Effect 在开发环境中会影响两次，如何修复它们

</YouWillLearn>

## 什么是 Effect，它与事件（event）有何不同？ {/*what-are-effects-and-how-are-they-different-from-events*/}

在谈到 Effect 之前，你需要熟悉 React 组件中的两种逻辑类型：

- **渲染逻辑代码**（在 [描述 UI](/learn/describing-the-ui) 中有介绍）位于组件的顶层。你将在这里接收 props 和 state，并对它们进行转换，最终返回你想在屏幕上看到的 JSX。[渲染的代码必须是纯粹的](/learn/keeping-components-pure)——就像数学公式一样，它只应该“计算”结果，而不做其他任何事情。

- **事件处理程序**（在 [添加交互性](/learn/adding-interactivity) 中介绍）是嵌套在组件内部的函数，而不仅仅是计算函数。事件处理程序可能会更新输入字段、提交 HTTP POST 请求以购买产品，或者将用户导航到另一个屏幕。事件处理程序包含由特定用户操作（例如按钮点击或键入）引起的“副作用”（它们改变了程序的状态）。

有时这还不够。考虑一个 `ChatRoom` 组件，它在屏幕上可见时必须连接到聊天服务器。连接到服务器不是一个纯计算（它包含副作用），因此它不能在渲染过程中发生。然而，并没有一个特定的事件（比如点击）导致 `ChatRoom` 被显示。

**Effect 允许你指定由渲染本身，而不是特定事件引起的副作用**。在聊天中发送消息是一个“事件”，因为它直接由用户点击特定按钮引起。然而，建立服务器连接是 Effect，因为它应该发生无论哪种交互导致组件出现。Effect 在屏幕更新后的 [提交阶段](/learn/render-and-commit) 运行。这是一个很好的时机，可以将 React 组件与某个外部系统（如网络或第三方库）同步。

<Note>

在本文和后续文本中，`Effect` 在 React 中是专有定义——由渲染引起的副作用。为了指代更广泛的编程概念，也可以将其称为“副作用（side effect）”。

</Note>


## 你可能不需要 Effect {/*you-might-not-need-an-effect*/}

**不要随意在你的组件中使用 Effect**。记住，Effect 通常用于暂时“跳出” React 代码并与一些 **外部** 系统进行同步。这包括浏览器 API、第三方小部件，以及网络等等。如果你想用 Effect 仅根据其他状态调整某些状态，那么 [你可能不需要 Effect](/learn/you-might-not-need-an-effect)。

## 如何编写 Effect {/*how-to-write-an-effect*/}

编写 Effect 需要遵循以下三个规则：

1. **声明 Effect**。默认情况下，Effect 会在每次渲染后都会执行。
2. **指定 Effect 依赖**。大多数 Effect 应该按需执行，而不是在每次渲染后都执行。例如，淡入动画应该只在组件出现时触发。连接和断开服务器的操作只应在组件出现和消失时，或者切换聊天室时执行。文章将介绍如何通过指定依赖来控制如何按需执行。
3. **必要时添加清理（cleanup）函数**。有时 Effect 需要指定如何停止、撤销，或者清除它的效果。例如，“连接”操作需要“断连”，“订阅”需要“退订”，“获取”既需要“取消”也需要“忽略”。你将学习如何使用 **清理函数** 来做到这一切。

以下是具体步骤。

### 第一步：声明 Effect {/*step-1-declare-an-effect*/}

首先在 React 中引入 [`useEffect` Hook](/reference/react/useEffect)：

```js
import { useEffect } from 'react';
```

然后，在组件顶部调用它，并传入在每次渲染时都需要执行的代码：

```js {2-4}
function MyComponent() {
  useEffect(() => {
    // 每次渲染后都会执行此处的代码
  });
  return <div />;
}
```

每当你的组件渲染时，React 将更新屏幕，然后运行 `useEffect` 中的代码。换句话说，**`useEffect` 会把这段代码放到屏幕更新渲染之后执行**。

让我们看看如何使用 Effect 与外部系统同步。考虑一个 `<VideoPlayer>` React 组件。通过传递布尔类型的 `isPlaying` prop 以控制是播放还是暂停：

```js
<VideoPlayer isPlaying={isPlaying} />;
```

自定义的 `VideoPlayer` 组件渲染了内置的 [`<video>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/video) 标签：

```js
function VideoPlayer({ src, isPlaying }) {
  // TODO：使用 isPlaying 做一些事情
  return <video src={src} />;
}
```

但是，浏览器的 `<video>` 标签没有 `isPlaying` 属性。控制它的唯一方式是在 DOM 元素上调用 [`play()`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLMediaElement/play) 和 [`pause()`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLMediaElement/pause) 方法。因此，**你需要将 `isPlaying` prop 的值与 `play()` 和 `pause()` 等函数的调用进行同步，该属性用于告知当前视频是否应该播放**。

首先要获取 `<video>`  DOM 节点的 [对象引用](/learn/manipulating-the-dom-with-refs)。

你可能会尝试在渲染期间调用 `play()` 或 `pause()`，但这种做法是错的：

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  if (isPlaying) {
    ref.current.play();  // 渲染期间不能调用 `play()`。 
  } else {
    ref.current.pause(); // 同样，调用 `pause()` 也不行。
  }

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? '暂停' : '播放'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

这段代码之所以不正确，是因为它试图在渲染期间对 DOM 节点进行操作。在 React 中，[JSX 的渲染必须是纯粹操作](/learn/keeping-components-pure)，不应该包含任何像修改 DOM 的副作用。

而且，当第一次调用 `VideoPlayer` 时，对应的 DOM 节点甚至还不存在！如果连 DOM 节点都没有，那么如何调用 `play()` 或 `pause()` 方法呢！在返回 JSX 之前，React 不知道要创建什么 DOM。

解决办法是 **使用 `useEffect` 包裹副作用，把它分离到渲染逻辑的计算过程之外**：

```js {6,12}
import { useEffect, useRef } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  });

  return <video ref={ref} src={src} loop playsInline />;
}
```

把调用 DOM 方法的操作封装在 Effect 中，你可以让 React 先更新屏幕，确定相关 DOM 创建好了以后然后再运行 Effect。

当 `VideoPlayer` 组件渲染时（无论是否为首次渲染），都会发生以下事情。首先，React 会刷新屏幕，确保 `<video>` 元素已经正确地出现在 DOM 中；然后，React 将运行 Effect；最后，Effect 将根据 `isPlaying` 的值调用 `play()` 或 `pause()`。

试试按下几次播放和暂停操作，观察视频播放器的播放、暂停行为是如何与 `isPlaying` prop 同步的：

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  });

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? '暂停' : '播放'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

在这个示例中，你同步到 React state 的“外部系统”是浏览器媒体 API；也可以使用类似的方法将旧的非 React 代码（如 jQuery 插件）封装成声明性的 React 组件。

请注意，控制视频播放器在实际应用中复杂得多：比如调用 `play()` 可能会失败，用户可能会使用内置浏览器控件播放或暂停等等。这只是一个简化了很多具体细节的例子。

<Pitfall>

一般来说，Effect 会在  **每次** 渲染后执行，**而以下代码会陷入死循环中**：

```js
const [count, setCount] = useState(0);
useEffect(() => {
  setCount(count + 1);
});
```

每次渲染结束都会执行 Effect；而更新 state 会触发重新渲染。但是新一轮渲染时又会再次执行 Effect，然后 Effect 再次更新 state……如此周而复始，从而陷入死循环。

Effect 通常应该使组件与 **外部** 系统保持同步。如果没有外部系统，你只想根据其他状态调整一些状态，那么 [你也许不需要 Effect](/learn/you-might-not-need-an-effect)。

</Pitfall>

### 第二步：指定 Effect 依赖 {/*step-2-specify-the-effect-dependencies*/}

一般来说，Effect 会在 **每次** 渲染时执行。**但更多时候，并不需要每次渲染的时候都执行 Effect**。

- 有时这会拖慢运行速度。因为与外部系统的同步操作总是有一定时耗，在非必要时可能希望跳过它。例如，没有人会希望每次用键盘打字时都重新连接聊天服务器。
- 有时这会导致程序逻辑错误。例如，组件的淡入动画只需要在第一轮渲染出现时播放一次，而不是每次触发新一轮渲染后都播放。

为了演示这个问题，我们在前面的示例中加入一些 `console.log` 语句和更新父组件 state 的文本输入。请注意键入是如何导致 Effect 重新运行的：

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('调用 video.play()');
      ref.current.play();
    } else {
      console.log('调用 video.pause()');
      ref.current.pause();
    }
  });

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? '暂停' : '播放'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

将 **依赖数组** 传入 `useEffect` 的第二个参数，以告诉 React **跳过不必要地重新运行 Effect**。在上面示例的第 14 行中传入一个空数组 `[]`：

```js {3}
  useEffect(() => {
    // ...
  }, []);
```

你会发现 React 报错：`React Hook useEffect has a missing dependency: 'isPlaying'`：

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('调用 video.play()');
      ref.current.play();
    } else {
      console.log('调用 video.pause()');
      ref.current.pause();
    }
  }, []); // 这将产生错误

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

问题出现在 Effect 中使用了 `isPlaying` prop 以控制逻辑，但又没有直接告诉 Effect 需要依赖这个属性。为了解决这个问题，将 `isPlaying` 添加至依赖数组中：

```js {2,7}
  useEffect(() => {
    if (isPlaying) { // isPlaying 在此处使用……
      // ...
    } else {
      // ...
    }
  }, [isPlaying]); // ……所以它必须在此处声明！
```

现在所有的依赖都已经声明，所以没有错误了。指定 `[isPlaying]` 会告诉 React，如果 `isPlaying` 在上一次渲染时与当前相同，它应该跳过重新运行 Effect。通过这个改变，输入框的输入不会导致 Effect 重新运行，但是按下播放/暂停按钮会重新运行 Effect。

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Calling video.play()');
      ref.current.play();
    } else {
      console.log('Calling video.pause()');
      ref.current.pause();
    }
  }, [isPlaying]);

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

依赖数组可以包含多个依赖项。当指定的所有依赖项在上一次渲染期间的值与当前值完全相同时，React 会跳过重新运行该 Effect。React 使用 [`Object.is`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 比较依赖项的值。有关详细信息，请参阅 [`useEffect` 参考文档](/reference/react/useEffect#reference)。

**请注意，不能随意选择依赖项**。如果你指定的依赖项不能与 Effect 代码所期望的相匹配时，lint 将会报错，这将帮助你找到代码中的问题。如果你希望重复执行，[那么你应当 **重新编辑 Effect 代码本身**，使其不需要该依赖项](/learn/lifecycle-of-reactive-effects#what-to-do-when-you-dont-want-to-re-synchronize)。

<Pitfall>

没有依赖数组作为第二个参数，与依赖数组位空数组 `[]` 的行为是不一致的：

```js {3,7,11}
useEffect(() => {
  // 这里的代码会在每次渲染后执行
});

useEffect(() => {
  // 这里的代码只会在组件挂载后执行
}, []);

useEffect(() => {
  //这里的代码只会在每次渲染后，并且 a 或 b 的值与上次渲染不一致时执行
}, [a, b]);
```

接下来，我们将进一步介绍什么是 **挂载（mount）**。

</Pitfall>

<DeepDive>

#### 为什么依赖数组中可以省略 ref? {/*why-was-the-ref-omitted-from-the-dependency-array*/}

下面的 Effect 同时使用了 `ref` 与 `isPlaying` prop，但是只有 `isPlaying` 被声明为了依赖项：

```js {9}
function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);
  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying]);
```

这是因为 `ref` 具有 **稳定** 的标识：React 保证 [每轮渲染中调用 `useRef` 所产生的引用对象时，获取到的对象引用总是相同的](/reference/react/useRef#returns)，即获取到的对象引用永远不会改变，所以它不会导致重新运行 Effect。因此，依赖数组中是否包含它并不重要。当然也可以包括它，这样也可以：

```js {9}
function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);
  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying, ref]);
```

`useState` 返回的 [`set` 函数](/reference/react/useState#setstate) 也有稳定的标识符，所以也可以把它从依赖数组中忽略掉。如果在忽略某个依赖项时 linter 不会报错，那么这么做就是安全的。

但是，仅在 linter 可以“看到”对象稳定时，忽略稳定依赖项的规则才会起作用。例如，如果 `ref` 是从父组件传递的，则必须在依赖项数组中指定它。这样做是合适的，因为无法确定父组件是否始终是传递相同的 ref，或者可能是有条件地传递几个 ref 之一。因此，你的 Effect 将取决于传递的是哪个 ref。

</DeepDive>

### 第三部：按需添加清理（cleanup）函数 {/*step-3-add-cleanup-if-needed*/}

考虑一个不同的例子。你正在编写一个 `ChatRoom` 组件，该组件出现时需要连接到聊天服务器。现在为你提供了 `createConnection()` API，该 API 返回一个包含 `connect()` 与 `disconnection()` 方法的对象。考虑当组件展示给用户时，应该如何保持连接？

从编写 Effect 逻辑开始：

```js
useEffect(() => {
  const connection = createConnection();
  connection.connect();
});
```

每次重新渲染后连接到聊天室会很慢，因此可以添加依赖数组：

```js {4}
useEffect(() => {
  const connection = createConnection();
  connection.connect();
}, []);
```

**在这个例子中，Effect 中的代码没有使用任何 props 或 state，此时指定依赖数组为空数组 `[]`。这告诉 React 仅在组件“挂载”时运行此代码，即首次出现在屏幕上这一阶段**。

试试运行下面的代码：

<Sandpack>

```js
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
  }, []);
  return <h1>欢迎来到聊天室！</h1>;
}
```

```js chat.js
export function createConnection() {
  // 真实的实现会将其连接到服务器，此处代码只是示例
  return {
    connect() {
      console.log('✅ 连接中……');
    },
    disconnect() {
      console.log('❌ 连接断开。');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
```

</Sandpack>

这里的 Effect 仅在组件挂载时执行，所以 `"✅ 连接中……"` 在控制台中只会打印一次。**然而控制台实际打印 `"✅ 连接中……"` 了两次！为什么会这样**？

想象 `ChatRoom` 组件是一个大规模的 App 中许多界面中的一部分。用户切换到含有 `ChatRoom` 组件的页面上时，该组件被挂载，并调用 `connection.connect()` 方法连接服务器。然后想象用户此时突然导航到另一个页面，比如切换到“设置”页面。这时，`ChatRoom` 组件就被卸载了。接下来，用户在“设置”页面忙完后，单击“返回”，回到上一个页面，并再次挂载 `ChatRoom`。这将建立第二次连接，但是，第一次时创建的连接从未被销毁！当用户在应用程序中不断切换界面再返回时，与服务器的连接会不断堆积。

如果不进行大量的手动测试，这样的错误很容易被遗漏。为了帮助你快速发现它们，在开发环境中，React 会在初始挂载组件后，立即再挂载一次。

观察到 `"✅ 连接中……"` 出现了两次，可以帮助找到问题所在：在代码中，组件被卸载时没有关闭连接。

为了解决这个问题，可以在 Effect 中返回一个 **清理（cleanup）** 函数。

```js {4-6}
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []);
```

每次重新执行 Effect 之前，React 都会调用清理函数；组件被卸载时，也会调用清理函数。让我们看看执行清理函数会做些什么：

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>欢迎来到聊天室！</h1>;
}
```

```js chat.js
export function createConnection() {
  // 真实的实现会将其连接到服务器，此处代码只是示例
  return {
    connect() {
      console.log('✅ 连接中……');
    },
    disconnect() {
      console.log('❌ 连接断开。');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
```

</Sandpack>

现在在开发模式下，控制台会打印三条记录：

1. `"✅ 连接中……"`
2. `"❌ 连接断开。"`
3. `"✅ 连接中……"`

**在开发环境下，出现这样的结果才是符合预期的**。重复挂载组件，可以确保在 React 中离开和返回页面时不会导致代码运行出现问题。上面的代码中规定了挂载组件时连接服务器、卸载组件时断连服务器。所以断开、连接再重新连接是符合预期的行为。当为 Effect 正确实现清理函数时，无论 Effect 执行一次，还是执行、清理、再执行，用户都不会感受到明显的差异。所以，在开发环境下，出现额外的连接、断连时，这是 React 正在调试你的代码。这是很正常的现象，不要试图消除它！

**在生产环境下，`"✅ 连接中……"` 只会被打印一次**。也就是说仅在开发环境下才会重复挂载组件，以帮助你找到需要清理的 Effect。你可以选择关闭 [严格模式](/reference/react/StrictMode) 来关闭开发环境下特有的行为，但我们建议保留它。这可以帮助发现许多上面这样的错误。

## 如何处理在开发环境中 Effect 执行两次？ {/*how-to-handle-the-effect-firing-twice-in-development*/}

在开发环境中，React 有意重复挂载你的组件，以查找像上面示例中的错误。**正确的态度是“如何修复 Effect 以便它在重复挂载后能正常工作”，而不是“如何只运行一次 Effect”**。

通常的解决办法是实现清理函数。清理函数应该停止或撤销 Effect 正在执行的任何操作。简单来说，用户不应该感受到 Effect 只执行一次（如在生产环境中）和执行“挂载 → 清理 → 挂载”过程（如在开发环境中）之间的差异。

下面提供一些常用的 Effect 应用模式。

### 控制非 React 组件 {/*controlling-non-react-widgets*/}

有时需要添加不是使用 React 编写的 UI 小部件。例如，假设你要向页面添加地图组件，并且它有一个 `setZoomLevel()` 方法，你希望调整缩放级别（zoom level）并与 React 代码中的 `zoomLevel` state 变量保持同步。Effect 看起来应该与下面类似：

```js
useEffect(() => {
  const map = mapRef.current;
  map.setZoomLevel(zoomLevel);
}, [zoomLevel]);
```

请注意，在这种情况下不需要清理。在开发环境中，React 会调用 Effect 两次，但这两次挂载时依赖项 `setZoomLevel` 都是相同的，所以会跳过执行第二次挂载时的 Effect。开发环境中它可能会稍微慢一些，但这问题不大，因为它在生产中不会进行不必要的重复挂载。

某些 API 可能不允许连续调用两次。例如，内置的 [`<dialog>`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLDialogElement) 元素的 [`showModal`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLDialogElement/showModal) 方法在连续调用两次时会抛出异常，此时实现清理函数并使其关闭对话框：

```js {4}
useEffect(() => {
  const dialog = dialogRef.current;
  dialog.showModal();
  return () => dialog.close();
}, []);
```

在开发环境中，Effect 将调用 `showModal()`，然后立即调用 `close()`，然后再次调用 `showModal()`。这与调用只一次 `showModal()` 的效果相同。也正如在生产环境中看到的那样。

### 订阅事件 {/*subscribing-to-events*/}

如果 Effect 订阅了某些事件，清理函数应该退订这些事件：

```js {6}
useEffect(() => {
  function handleScroll(e) {
    console.log(window.scrollX, window.scrollY);
  }
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

在开发环境中，Effect 会调用 `addEventListener()`，然后立即调用 `removeEventListener()`，然后再调用相同的 `addEventListener()`，这与只订阅一次事件的 Effect 等效；这也与用户在生产环境中只调用一次 `addEventListener()` 具有相同的感知效果。

### 触发动画 {/*triggering-animations*/}

如果 Effect 对某些内容加入了动画，清理函数应将动画重置：

```js {4-6}
useEffect(() => {
  const node = ref.current;
  node.style.opacity = 1; // 触发动画
  return () => {
    node.style.opacity = 0; // 重置为初始值
  };
}, []);
```

在开发环境中，透明度由 `1` 变为 `0`，再变为 `1`。这与在生产环境中，直接将其设置为 `1` 具有相同的感知效果，如果你使用支持过渡的第三方动画库，你的清理函数应将时间轴重置为其初始状态。

### 获取数据 {/*fetching-data*/}

如果 Effect 将会获取数据，清理函数应该要么 [中止该数据获取操作](https://developer.mozilla.org/zh-CN/docs/Web/API/AbortController)，要么忽略其结果：

```js {2,6,13-15}
useEffect(() => {
  let ignore = false;

  async function startFetching() {
    const json = await fetchTodos(userId);
    if (!ignore) {
      setTodos(json);
    }
  }

  startFetching();

  return () => {
    ignore = true;
  };
}, [userId]);
```

我们无法撤消已经发生的网络请求，但是清理函数应当确保获取数据的过程以及获取到的结果不会继续影响程序运行。如果 `userId` 从 `'Alice'` 变为 `'Bob'`，那么请确保 `'Alice'` 响应数据被忽略，即使它在 `'Bob'` 之后到达。

**在开发环境中，浏览器调试工具的“网络”选项卡中会出现两个 fetch 请求**。这是正常的。使用上述方法，第一个 Effect 将立即被清理，而 `ignore` 将被设置为 `true`。因此，即使有额外的请求，由于有 `if (!ignore)` 判断检查，也不会影响程序状态。

**在生产环境中，只会显示发送了一条获取请求**。如果开发环境中，第二次请求给你造成了困扰，最好的方法是使用一种可以删除重复请求、并缓存请求响应的解决方案：

```js
function TodoList() {
  const todos = useSomeDataLibrary(`/api/user/${userId}/todos`);
  // ...
```

这不仅可以提高开发体验，还可以让你的应用程序速度更快。例如，用户按下按钮时，如果数据已经被缓存了，那么就不必再次等待加载。你可以自己构建这样的缓存，也可以使用很多在 Effect 中手动加载数据的替代方法。

<DeepDive>

#### Effect 中有哪些好的数据获取替代方案？ {/*what-are-good-alternatives-to-data-fetching-in-effects*/}

在 Effect 中调用 `fetch` 请求数据 [是一种非常受欢迎的方式](https://www.robinwieruch.de/react-hooks-fetch-data/)，特别是在客户端应用中。然而，它非常依赖手动操作，有很多的缺点：

- **Effect 不能在服务端执行**。这意味着服务器最初传递的 HTML 不会包含任何数据。客户端的浏览器必须下载所有 JavaScript 脚本来渲染应用程序，然后才能加载数据——这并不搞笑。
- **直接在 Effect 中获取数据容易产生网络瀑布（network waterfall）**。首先渲染了父组件，它会获取一些数据并进行渲染；然后渲染子组件，接着子组件开始获取它们的数据。如果网络速度不够快，这种方式比同时获取所有数据要慢得多。
- **直接在 Effect 中获取数据通常意味着无法预加载或缓存数据**。例如，在组件卸载后然后再次挂载，那么它必须再次获取数据。
- **这不是很符合人机交互原则**。如果你不想出现像 [条件竞争（race condition）](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect) 之类的问题，那么你需要编写更多的样板代码。

以上所列出来的缺点并不是 React 特有的。在任何框架或者库上的组件挂载过程中获取数据，都会遇到这些问题。与路由一样，要做好数据获取并非易事，因此我们推荐以下方法：

- **如果你正在使用 [框架](/learn/start-a-new-react-project#production-grade-react-frameworks) ，使用其内置的数据获取机制**。现代 React 框架集成了高效的数据获取机制，不会出现上述问题。
- **否则，请考虑使用或构建客户端缓存**。目前受欢迎的开源解决方案是 [React Query](https://tanstack.com/query/latest)、[useSWR](https://swr.vercel.app/) 和 [React Router v6.4+](https://beta.reactrouter.com/en/main/start/overview)。你也可以构建自己的解决方案，在这种情况下，你可以在幕后使用 Effect，但是请注意添加用于删除重复请求、缓存响应和避免网络瀑布（通过预加载数据或将数据需求提升到路由）的逻辑。

如果这些方法都不适合你，你可以继续直接在 Effect 中获取数据。

</DeepDive>

### 发送分析报告 {/*sending-analytics*/}

考虑在访问页面时发送日志分析：

```js
useEffect(() => {
  logVisit(url); // 发送 POST 请求
}, [url]);
```

在开发环境中，`logVisit` 会为每个 URL 发送两次请求，所以你可能会想尝试解决这个问题。**不过我们建议不必修改此处代码**，与前面的示例一样，从用户的角度来看，运行一次和运行两次之间不会 **感知** 到行为差异。从实际的角度来看，`logVisit` 不应该在开发环境中做任何影响生产事情。由于每次保存代码文件时都会重新挂载组件，因此在开发环境中会额外记录访问次数。

**在生产环境中，不会产生有重复的访问日志**。

为了调试发送的分析事件，可以将应用部署到一个运行在生产模式下的暂存环境，或者暂时取消 [严格模式](/reference/react/StrictMode) 及其仅在开发环境中重新加载检查；还可以从路由变更事件处理程序中发送分析数据，而不是从 Effect 中发送。为了更精确的分析，可以使用 [Intersection Observer](https://developer.mozilla.org/zh-CN/docs/Web/API/Intersection_Observer_API) 来跟踪哪些组件位于视口中以及它们保持可见的时间。

### 初始化应用时不需要使用 Effect 的情形 {/*not-an-effect-initializing-the-application*/}

某些逻辑应该只在应用程序启动时运行一次。比如，验证登陆状态和加载本地程序数据。你可以将其放在组件之外：

```js {2-3}
if (typeof window !== 'undefined') { // 检查是否在浏览器中运行
  checkAuthToken();
  loadDataFromLocalStorage();
}

function App() {
  // ……
}
```

这保证了这种逻辑在浏览器加载页面后只运行一次。

### 不要在 Effect 中执行购买商品一类的操作 {/*not-an-effect-buying-a-product*/}

有时，即使编写了一个清理函数，也不能避免执行两次 Effect。例如，Effect 包含会发送 POST 请求以执行购买操作：

```js {2-3}
useEffect(() => {
  // 🔴 错误：此处的 Effect 会在开发环境中执行两次，这在代码中是有问题的。
  fetch('/api/buy', { method: 'POST' });
}, []);
```

一方面，开发环境下，Effect 会执行两次，这意味着购买操作执行了两次，但是这并非是预期的结果，所以不应该把这个业务逻辑放在 Effect 中。另一方面，如果用户转到另一个页面，然后按“后退”按钮回到了这个界面，该怎么办？Effect 会随着组件再次挂载而再次执行。所以，当用户重新访问某个页面时，不应当执行购买操作；当只有用户点击“购买”按钮时，才执行购买操作。

因此，“购买”的操作不应由组件的挂载、渲染引起的；它是由特定的交互作用引起的，它应该只在用户按下按钮时运行。因此，**它不应该写在 Effect 中，应当把 `/api/buy` 请求操作移动到购买按钮事件处理程序中**：

```js {2-3}
  function handleClick() {
    // ✅ 购买商品应当在事件中执行，因为这是由特定的操作引起的。
    fetch('/api/buy', { method: 'POST' });
  }
```

**这个例子说明如果重新挂载破坏了应用程序的逻辑，则通常含有未被发现的错误**。从用户的角度来看，访问一个页面不应该与访问它、点击链接然后按下返回键再次查看页面有什么不同。React 通过在开发环境中重复挂载组件以验证组件是否遵守此原则。

## 总结 {/*putting-it-all-together*/}

下面的 playground 可以帮助你在实践中找到对 Effect 的感觉。

这个例子使用 [`setTimeout`](https://developer.mozilla.org/zh-CN/docs/Web/API/setTimeout) 来安排控制台日志，在 Effect 运行后三秒钟显示输入文本。清理函数会取消挂起的超时。从按下“挂载组件”开始：

<Sandpack>

```js
import { useState, useEffect } from 'react';

function Playground() {
  const [text, setText] = useState('a');

  useEffect(() => {
    function onTimeout() {
      console.log('⏰ ' + text);
    }

    console.log('🔵 安排 "' + text + '" 日志');
    const timeoutId = setTimeout(onTimeout, 3000);

    return () => {
      console.log('🟡 取消 "' + text + '" 日志');
      clearTimeout(timeoutId);
    };
  }, [text]);

  return (
    <>
      <label>
        日志内容：{' '}
        <input
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </label>
      <h1>{text}</h1>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? '卸载' : '挂载'} 组件
      </button>
      {show && <hr />}
      {show && <Playground />}
    </>
  );
}
```

</Sandpack>

在最开始时可以看到三个日志输出：`安排 "a" 日志`，`取消 "a" 日志`，还有一个 `安排 "a" 日志`。三秒后，还会有一条日志显示：`a`。正如之前所说，额外的安排/取消动作产生的原因是因为 React 在开发环境中，会重新挂载组件一次，以验证你是否正确地实现了清理函数。

现在编辑输入框，输入 `abc`。如果输入速度足够快，你会看到 `安排 "ab" 日志`，紧接着的是 `取消 "ab" 日志` 和 `安排 "abc" 日志`。**React 总是在执行下一轮渲染的 Effect 之前清理上一轮渲染的 Effect**。这就是为什么即使你快速输入，最多也只有一个安排操作。试试多次编辑输入框，并观察控制台以了解 Effect 是如何被清理的。

在输入框中输入一些内容，然后立即按下“卸载组件”按钮。注意卸载时如何清理最后一轮渲染的 Effect。在这里，它在触发卸载之前，清除了最后一次安排操作。

最后，在上面的代码中注释掉清理函数，这样安排操作就不会被取消。尝试快速输入 `abcde`。你预期三秒钟内会发生什么？计时器安排内的 `console.log(text)` 会打印 **最新** 的 `text` 并产生五个 `abcde` 日志吗？验证你的直觉吧！

三秒后，你应该看到一系列日志：`a`、`ab`、`abc`、`abcd` 与 `abcde`，而不是五个 `abcde`。**每个 Effect 都会“捕获”其对应渲染的 `text` 值**。`text` state 发生变化并不重要：来自 `text = 'ab'` 的渲染的 Effect 始终会得到 `'ab'`。换句话说，每个渲染的 Effect 都是相互隔离的。如果你对这是如何工作的感到好奇，你可以阅读有关 [闭包](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Closures) 的内容。

<DeepDive>

#### 每一轮渲染都有自己的 Effect {/*each-render-has-its-own-effects*/}

你可以将 `useEffect` 认为其将一段行为“附加”到渲染输出。考虑这种情况：

```js
export default function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>欢迎来到 {roomId}！</h1>;
}
```

让我们看看当用户在应用程序中切换页面时到底发生了什么。

#### 初始渲染 {/*initial-render*/}

用户访问 `<ChatRoom roomId="general" />`，在这里让我们 [假设](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time) `roomId` 的值为 `'general'` ：

```js
  // 首次渲染时的 JSX（roomId 为 "general"）
  return <h1>欢迎来到 general！</h1>;
```

**Effect 也是渲染输出的一部分**。首次渲染的 Effect 变为：

```js
  //首先渲染时的 Effect（roomId 为 "general"）
  () => {
    const connection = createConnection('general');
    connection.connect();
    return () => connection.disconnect();
  },
  // 首次渲染时的依赖项（roomId 为 "general"）
  ['general']
```

React 将会执行用于连接到 `'general'` 聊天室的 Effect。

#### 依赖项相同时的重新渲染 {/*re-render-with-same-dependencies*/}

让我们探讨下 `<ChatRoom roomId="general" />` 的重复渲染。JSX 的输出结果仍然相同：

```js
  // 第二次渲染时的 JSX（roomId 为 "general"）
  return <h1>Welcome to general!</h1>;
```

React 看到渲染输出没有改变，所以它不会更新 DOM 。

第二次渲染的 Effect 如下所示：

```js
  // 第二次渲染时的 Effect（roomId 为 "general"）
  () => {
    const connection = createConnection('general');
    connection.connect();
    return () => connection.disconnect();
  },
  // 第二次渲染时的依赖项（roomId 为 "general"）
  ['general']
```

React 将第二次渲染时的 `['general']` 与第一次渲染时的 `['general']` 进行比较。**因为所有的依赖项都是相同的，React 会忽略第二次渲染时的 Effect**。所以此时 Effect 不会被调用。

#### 依赖项不同时的重新渲染 {/*re-render-with-different-dependencies*/}

接下来，用户开始访问 `<ChatRoom roomId="travel" />`。注意这里 `roomId` 的属性值改为了 `'travel'`，返回的是不同的 JSX 输出结果：

```js
  // 第三次渲染时的 JSX（roomId 为 "travel"）
  return <h1>欢迎来到 travel！</h1>;
```

这时的 React 会更新 DOM ，将 `"欢迎来到 general"` 更新为 `"欢迎来到 travel"`。

第三次渲染的 Effect 如下所示：

```js
  // 第三次渲染时的 Effect（roomId 为 "travel"）
  () => {
    const connection = createConnection('travel');
    connection.connect();
    return () => connection.disconnect();
  },
  // 第三次渲染时的依赖项（roomId 为 "travel"）
  ['travel']
```

React 将第三次渲染时的 `['travel']` 与第二次渲染时的 `['general']` 相互比较。会发现依赖项不同：`Object.is('travel', 'general')` 为 `false`：所以这次的 Effect 不能跳过。

**在 React 执行第三次渲染的 Effect 之前，它需要清理最近渲染的 Effect**。第二次渲染的 Effect 被跳过了。所以 React 需要清理第一次渲染时的 Effect。如果你回看第一次渲染的 Effect，你可以看到第一次渲染时的清理函数需要执行的内容，是在 `createConnection('general')` 所创建的连接上调用 `disconnect()`。也就是从 `'general'` 聊天室断开连接。

之后，React 执行第三次渲染的 Effect。它连接到 `'travel'` 聊天室。

#### 组件卸载 {/*unmount*/}

最后，假设用户离开了当前页面，`ChatRoom` 组件将被卸载时，React 会执行最近的 Effect 的清理函数，也就是第三次渲染时 Effect 的清理函数。第三次渲染后再清理时，清理函数破坏了 `createConnection('travel')` 方法创建的连接。因此，该应用程序与 `travel` 房间断开了连接。

#### 仅开发环境下的行为 {/*development-only-behaviors*/}

在 [严格模式](/reference/react/StrictMode) 下，React 在每次挂载组件后都会重新挂载组件（但是组件的 state 与 创建的 DOM 都会被保留）。[它可以帮助你找出需要添加清理函数的 Effect](#step-3-add-cleanup-if-needed)，以及早暴露出像条件竞争那样的问题。此外，每当你在开发环境中保存更新代码文件时，React 也会重新挂载 Effect，不过这两种行为都仅限于开发环境。

</DeepDive>

<Recap>

- 与事件不同，Effect 是由渲染本身，而非特定交互引起的。
- Effect 允许你将组件与某些外部系统（第三方 API、网络等）同步。
- 默认情况下，Effect 在每次渲染（包括初始渲染）后运行。
- 如果 React 的所有依赖项都与上次渲染时的值相同，则将跳过本次 Effect。
- 不能随意选择依赖项，它们是由 Effect 内部的代码决定的。
- 空的依赖数组（`[]`）对应于组件“挂载”，即添加到屏幕上。
- 仅在严格模式下的开发环境中，React 会挂载两次组件，以对 Effect 进行压力测试。
- 如果 Effect 因为重新挂载而中断，那么需要实现一个清理函数。
- React 将在下次 Effect 运行之前以及卸载期间这两个时候调用清理函数。

</Recap>

<Challenges>

#### 挂载后聚焦于表单字段 {/*focus-a-field-on-mount*/}

在下面的例子中，表单中渲染了一个 `<MyInput />` 组件。

使用输入框的 [`focus()`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/focus) 方法，以在 `MyInput` 出现在屏幕上时自动聚焦。下面有一种实现方式，但是被注释掉了，因为它并没有很好地工作。找出它为什么不起作用，并修复它。如果你熟悉 `autoFocus` 属性，请假装它不存在：我们正在从头开始重新实现相同的功能。

<Sandpack>

```js MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ value, onChange }) {
  const ref = useRef(null);

  // TODO：下面的这种做法不会生效，请修复。
  // ref.current.focus()    

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('Taylor');
  const [upper, setUpper] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? '隐藏' : '展示'}表单</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            输入你的姓名：
            <MyInput
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={upper}
              onChange={e => setUpper(e.target.checked)}
            />
            大写
          </label>
          <p>你好， <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>


按下“展示表单”按钮并验证是否聚焦于 `<input />`（高亮显示，光标位于内部）；再次按下“隐藏表单”和“展示表单”，以验证是否再次聚焦于输入框。

仅在 **挂载** 时聚焦于 `MyInput`，而非每次渲染后。为了验证这一行为，按下“展示表单”，然后重复按下“大写”的复选框。点击复选框时，上方的输入框不应该获取焦点。

<Solution>

在渲染期间调用 `ref.current.focus()` 本身是不正确的。因为这会产生“副作用”。副作用要么应该放在事件处理程序里面，要么在 `useEffect` 中。在这种情况下，副作用是组件渲染引起的，而不是任何特定的交互引起的，因此应该将它放在 Effect 中。

为了修复这个错误，可以对 `ref.current.focus()` 的调用包裹在 Effect 中。然后确保这个 Effect 只在组件挂载时执行而不是在每一轮渲染时都执行，可以为 Effect 的声明加一个空的依赖数组 `[]`。

<Sandpack>

```js MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ value, onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    ref.current.focus();
  }, []);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('Taylor');
  const [upper, setUpper] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? '隐藏' : '展示'}表单</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            输入你的姓名：
            <MyInput
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={upper}
              onChange={e => setUpper(e.target.checked)}
            />
            大写
          </label>
          <p>你好，<b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

</Solution>

#### 有条件地聚焦于表单 {/*focus-a-field-conditionally*/}

下面的表单渲染两个 `<MyInput />` 组件。

按下“展示表单”，同时注意自动聚焦于第二个输入框，这是因为两个 `<MyInput />` 组件都在试图把焦点往自身上转移。当你连续为两个输入框调用 `focus()` 时，总是聚焦于最后面的输入框。

假设聚焦于第一个输入框，那么，第一个 `MyInput` 组件现在接收到 `shouldFocus` 属性，并且应当被设置为 `true`。更改下程序逻辑，规定仅当 `MyInput` 接收到的 `shouldFocus` 属性为 `true` 时才调用 `focus()` 。

<Sandpack>

```js MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ shouldFocus, value, onChange }) {
  const ref = useRef(null);

  // TODO：只在 shouldFocus 为 true 时才调用 focus()
  useEffect(() => {
    ref.current.focus();
  }, []);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  const [upper, setUpper] = useState(false);
  const name = firstName + ' ' + lastName;
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? '隐藏' : '展示'}表单</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            输入你的名：
            <MyInput
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              shouldFocus={true}
            />
          </label>
          <label>
            输入你的姓：
            <MyInput
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              shouldFocus={false}
            />
          </label>
          <p>你好，<b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

试着重复按下“展示表单”和“隐藏表单”以验证你的解决方式。当表单出现时，这里只有第一个输入框获得了焦点。那是因为它的父组件渲染的第一个输入框时，第一个输入框带着 `shouldFocus={true}` 这个属性值，而渲染第二个输入框时，第二个输入框则带着 `shouldFocus={false}` 的属性值。可以发现，即使你往两个输入框里都输入一些内容时，它们仍然能正常工作。

<Hint>

所以，不能有条件地声明 Effect，但 Effect 中可以包含条件逻辑。

</Hint>

<Solution>

向 Effect 中加入条件逻辑。由于 Effect 使用了 `shouldFocus`，你需要为 Effect 指定 `shouldFocus` 这个依赖项。这也意味着如果输入框的 `shouldFocus` 由 `false` 变为 `true` 时，它才会在下次渲染时获得焦点。

<Sandpack>

```js MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ shouldFocus, value, onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    if (shouldFocus) {
      ref.current.focus();
    }
  }, [shouldFocus]);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  const [upper, setUpper] = useState(false);
  const name = firstName + ' ' + lastName;
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? '隐藏' : '展示'}表单</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            输入你的名：
            <MyInput
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              shouldFocus={true}
            />
          </label>
          <label>
            输入你的姓：
            <MyInput
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              shouldFocus={false}
            />
          </label>
          <p>你好，<b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

</Solution>

#### 修复计时器触发两次的问题 {/*fix-an-interval-that-fires-twice*/}

下面的 `Counter` 组件显示一个计数器，应该每秒递增一次。在组件挂载时，它调用 [`setInterval`](https://developer.mozilla.org/zh-CN/docs/Web/API/setInterval)。这会导致 `onTick` 每秒运行一次。`onTick` 函数会递增计数器。

然而，计数器不是每秒递增一次，而是两次。这是为什么呢？找出错误的原因并修复它。

<Hint>

请记住，`setInterval` 返回一个 interval ID，你可以将其传递给 [`clearInterval`](https://developer.mozilla.org/zh-CN/docs/Web/API/clearInterval) 来停止计时。

</Hint>

<Sandpack>

```js Counter.js active
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function onTick() {
      setCount(c => c + 1);
    }

    setInterval(onTick, 1000);
  }, []);

  return <h1>{count}</h1>;
}
```

```js App.js hidden
import { useState } from 'react';
import Counter from './Counter.js';

export default function Form() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? '隐藏' : '展示'}计时器</button>
      <br />
      <hr />
      {show && <Counter />}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

<Solution>

在 [严格模式](/reference/react/StrictMode) 下，（本网站中的示例沙盒（sandbox）都已开启严格模式），React 在开发模式中，每个组件都会重复挂载一次。这也就导致计数器组件被挂载了两次。所以，计时器也被设立了两次，这就是为什么计数器每秒递增两次的原因。

然而，这并不是 React 本身的错：而是 Effect 代码中本身就存在问题。React 只不过把这个问题放大了。真正的错误原因是这样的 Effect 启动后，但没有提供清理函数，所以上一次的 Effect 残留就没有被除去。

要修复这个问题，保存 `setInterval` 返回的 interval ID，并使用 [`clearInterval`](https://developer.mozilla.org/zh-CN/docs/Web/API/clearInterval) 实现一个清理函数：

<Sandpack>

```js Counter.js active
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function onTick() {
      setCount(c => c + 1);
    }

    const intervalId = setInterval(onTick, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return <h1>{count}</h1>;
}
```

```js App.js hidden
import { useState } from 'react';
import Counter from './Counter.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? '隐藏' : '展示'}计时器</button>
      <br />
      <hr />
      {show && <Counter />}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

在开发环境中，React 仍然会重复挂载一次组件，通过放大问题，以确保已经正确地实现了清理函数。这样，调用一次 `setInterval` 后就紧接着调用 `clearInterval`，然后再调用 `setInterval`。在生产环境中与开发环境不同，React 只挂载一次组件，即只调用一次 `setInterval`。两种情况下用户感知的效果是相同的：计数器每秒递增一次。

</Solution>

#### 修复在 Effect 中获取数据的问题 {/*fix-fetching-inside-an-effect*/}

下面这个组件显示所选人物的传记。它在挂载时和每当 `person` 改变时通过调用一个异步函数 `fetchBio(person)` 来加载传记。该异步函数返回一个 [Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)，最终解析为一个字符串。当获取完成时，它调用 `setBio` 以将该字符串显示在选择框下方。

<Sandpack>

```js App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);

  useEffect(() => {
    setBio(null);
    fetchBio(person).then(result => {
      setBio(result);
    });
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Taylor">Taylor</option>
      </select>
      <hr />
      <p><i>{bio ?? '加载中……'}</i></p>
    </>
  );
}
```

```js api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('这是' + person + '的传记。');
    }, delay);
  })
}

```

</Sandpack>


这段代码中有一个错误。试试首先选择 `Alice`，然后选择 `Bob`，然后紧接着选择 `Taylor`。如果操作得足够快，会注意到这个错误：Taylor 被选中了，但下面的一段却说：“这是Bob的传记。”

为什么会发生这种情况？试着修复此 Effect 中的错误。

<Hint>

如果 Effect 需要异步获取某些数据，它通常需要清理函数。

</Hint>

<Solution>

触发问题时，程序的指令序列是这样的：

- 选中 `'Bob'` 触发 `fetchBio('Bob')`
- 选中 `'Taylor'` 触发 `fetchBio('Taylor')`
- **在 `'Bob'` 的数据完成加载之前，就已经完成了对 `'Taylor'` 的数据的加载**
- 加载 `'Taylor'` 数据的 Effect 调用了 `setBio('这是Taylor的传记')`
- 加载完成 `'Bob'` 的数据
- 加载 `'Bob'` 数据的 Effect 调用了 `setBio('这是Bob的传记')`

这就是为什么即使 Taylor 被选中了，但显示的仍然是 Bob 的数据。这种问题被称之为 [条件竞争](https://en.wikipedia.org/wiki/Race_condition)，因为两个异步操作都在彼此竞争，谁先谁后是不可预期的。

为了修复这种问题，在 Effect 中添加清理函数：

<Sandpack>

```js App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);
  useEffect(() => {
    let ignore = false;
    setBio(null);
    fetchBio(person).then(result => {
      if (!ignore) {
        setBio(result);
      }
    });
    return () => {
      ignore = true;
    }
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Taylor">Taylor</option>
      </select>
      <hr />
      <p><i>{bio ?? '加载中……'}</i></p>
    </>
  );
}
```

```js api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('这是' + person + '的传记。');
    }, delay);
  })
}

```

</Sandpack>

其实，每个 Effect 都可以在里面设置一个 `ignore` 标记变量。在最开始，`ignore` 被设置为 `false`。然而，当 Effect 执行清理函数后（就像你选中了列表中不同的人时），`ignore` 就会被设置为 `true`。所以此时请求完成的顺序并不重要。只有最后选中的人在执行它的 Effect 时，`ignore` 会被设为 `false`，所以它会调用 `setBio(result)`。而之前的 Effect 都被清理掉了。所以检查 `if (!ignore)` 会阻止调用 `setBio`：

- 选中 `'Bob'` 触发 `fetchBio('Bob')`
- 选中 `'Taylor'` 触发 `fetchBio('Taylor')`，**然后清理之前加载（Bob）数据时的 Effect**
- 在加载完 `'Bob'` 的数据 **之前**，就已经完成加载 `'Taylor'` 的数据
- 渲染 `'Taylor'` 时的 Effect 调用 `setBio('这是Taylor的传记')`
- 加载完成 `'Bob'` 的数据
- 渲染 `'Bob'` 时的 Effect 不会做任何事情，因为 `ignore` 已经被设为了 `true`。

除了忽略过时 API 调用的结果外，你还可以使用 [`AbortController`](https://developer.mozilla.org/zh-CN/docs/Web/API/AbortController) 来取消不再需要的请求。然而，仅靠这个还不足以防止竞态条件。更多的异步步骤可能会在获取之后链接起来，因此使用显式标记，如 `ignore` 变量，是修复这类问题最可靠的方法。

</Solution>

</Challenges>

