---
title: '使用 Effect 进行同步'
---

<Intro>

有些组件需要与外部系统同步。例如，你可能希望根据 React state 控制非 React 组件、建立服务器连接或当组件在页面显示时发送分析日志。Effect 允许你在渲染结束后执行一些代码，以便将组件与 React 外部的某个系统相同步。

</Intro>

<YouWillLearn>

- 什么是 Effect
- Effect 与事件（event）有何不同
- 如何在组件中声明 Effect
- 如何避免不必要地重新运行 Effect
- 为什么 Effect 在开发环境中会运行两次以及如何解决这个问题

</YouWillLearn>

## 什么是 Effect，它与事件（event）有何不同？ {/*what-are-effects-and-how-are-they-different-from-events*/}

在接触 Effect 之前，你需要熟悉 React 组件中的两种逻辑类型：

- **渲染代码**（在 [描述 UI](/learn/describing-the-ui) 中有介绍）位于组件的顶层。你在这里处理 props 和 state，对它们进行转换，并返回希望在页面上显示的 JSX。[渲染代码必须是纯粹的](/learn/keeping-components-pure)——就像数学公式一样，它只应该“计算”结果，而不做其他任何事情。

- **事件处理程序**（在 [添加交互性](/learn/adding-interactivity) 中有介绍）是组件内部的嵌套函数，它们不光进行计算, 还会执行一些操作。事件处理程序可能会更新输入字段、提交 HTTP POST 请求来购买产品，或者将用户导航到另一个页面。事件处理程序包含由特定用户操作（例如按钮点击或输入）引起的“副作用”（它们改变了程序的状态）。

有时这还不够。考虑一个 `ChatRoom` 组件，它在页面上显示时必须连接到聊天服务器。连接到服务器并不是纯粹的计算（它是一个副作用），因此它不能在渲染期间发生。然而，并没有一个特定的事件（比如点击）能让 `ChatRoom` 被显示。

**Effect 允许你指定由渲染自身，而不是特定事件引起的副作用**。在聊天中发送消息是一个“事件”，因为它直接由用户点击特定按钮引起。然而，建立服务器连接是一个 Effect，因为无论哪种交互致使组件出现，它都应该发生。Effect 在 [提交](/learn/render-and-commit) 结束后、页面更新后运行。此时是将 React 组件与外部系统（如网络或第三方库）同步的最佳时机。

<Note>

在本文此处和后续文本中，大写的 `Effect` 是 React 中的专有定义——由渲染引起的副作用。至于更广泛的编程概念(任何改变程序状态或外部系统的行为)，我们则使用“副作用（side effect）” 来指代。

</Note>


## 你可能不需要 Effect {/*you-might-not-need-an-effect*/}

**不要急着在你的组件中使用 Effect**。记住，Effect 通常用于暂时“跳出” React 并与一些 **外部** 系统进行同步。这包括浏览器 API、第三方小部件，以及网络等等。如果你的 Effect 只是根据其他状态来调整某些状态，那么 [你可能并不需要一个 Effect](/learn/you-might-not-need-an-effect)。

## 如何编写 Effect {/*how-to-write-an-effect*/}

要编写一个 Effect, 请遵循以下三个步骤：

1. **声明 Effect**。通常 Effect 会在每次 [提交](/learn/render-and-commit) 后运行。
2. **指定 Effect 依赖**。大多数 Effect 应该按需运行，而不是在每次渲染后都运行。例如，淡入动画应该只在组件出现时触发。连接和断开服务器的操作只应在组件出现和消失时，或者切换聊天室时执行。你将通过指定 **依赖项** 来学习如何控制这一点。
3. **必要时添加清理操作**。一些 Effect 需要指定如何停止、撤销，或者清除它们所执行的操作。例如，“连接”需要“断开”，“订阅”需要“退订”，而“获取数据”需要“取消”或者“忽略”。你将学习如何通过返回一个 **清理函数** 来实现这些。

让我们详细看看每一步。

### 第一步：声明 Effect {/*step-1-declare-an-effect*/}

先从 React 中导入 [`useEffect` Hook](/reference/react/useEffect)：

```js
import { useEffect } from 'react';
```

再在组件顶部调用, 并在其中加入一些代码：

```js {2-4}
function MyComponent() {
  useEffect(() => {
    // 每次渲染后都会执行此处的代码
  });
  return <div />;
}
```

每当你的组件渲染时，React 会先更新页面，然后再运行 `useEffect` 中的代码。换句话说，**`useEffect` 会“延迟”一段代码的运行，直到渲染结果反映在页面上**。

接下来，让我们看看如何使用 Effect 来与外部系统同步。考虑一个 `<VideoPlayer>` React 组件。我们想要通过传递一个 `isPlaying` prop 来控制它播放或者暂停：

```js
<VideoPlayer isPlaying={isPlaying} />;
```

这个 `VideoPlayer` 组件渲染了浏览器内置的 [`<video>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/video) 标签：

```js
function VideoPlayer({ src, isPlaying }) {
  // TODO：使用 isPlaying 做一些事情
  return <video src={src} />;
}
```

但是，浏览器的 `<video>` 标签没有 `isPlaying` 属性。控制它的唯一方式是在 DOM 元素上调用 [`play()`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLMediaElement/play) 和 [`pause()`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLMediaElement/pause) 方法。因此，**你需要将 `isPlaying` prop 的值（表示视频当前是否应该播放）与 `play()` 和 `pause()` 等函数的调用进行同步**。

我们首先需要获取 `<video>` DOM 节点的 [对象引用](/learn/manipulating-the-dom-with-refs)。

你可能会尝试在渲染期间调用 `play()` 或 `pause()`，但这样做是不对的：

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

这段代码之所以不对，是因为它试图在渲染期间对 DOM 节点进行操作。在 React 中，[渲染应该是纯粹的计算](/learn/keeping-components-pure) JSX，不应该包含任何像修改 DOM 这样的副作用。

而且，当第一次调用 `VideoPlayer` 时，对应的 DOM 节点还不存在！因为 React 在你返回 JSX 之前不知道要创建什么样的 DOM，所以没有 DOM 节点可以调用 `play()` 或 `pause()` 方法。

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

通过将 DOM 更新封装在 Effect 中，你可以让 React 先更新页面，然后再运行 Effect。

当 `VideoPlayer` 组件渲染时（无论是否为首次渲染），会发生以下几件事：首先 React 会更新页面，确保 `<video>` 标签带着正确的 props 出现在 DOM 中；接着 React 将运行 Effect；最后 Effect 将根据 `isPlaying` 的值调用 `play()` 或 `pause()`。

试试点击几次播放和暂停按钮，观察视频播放器的行为是如何与 `isPlaying` 的值相同步的：

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

在这个示例中，你同步到 React state 的“外部系统”是浏览器媒体 API。你也可以使用类似的方法将传统的非 React 代码（如 jQuery 插件）封装成声明式的 React 组件。

需要注意的是，控制视频播放器在实际应用中要复杂得多：比如调用 `play()` 可能会失败、用户可能会使用内置的浏览器控件来进行播放或暂停等操作。本例子是一个非常简化且不完整的示例。

<Pitfall>

默认情况下，Effect 会在 **每次** 渲染后运行。**正因如此，以下代码会陷入死循环**：

```js
const [count, setCount] = useState(0);
useEffect(() => {
  setCount(count + 1);
});
```

Effect 在渲染结束后运行。更新 state 会触发重新渲染。在 Effect 中直接更新 state 就像是把电源插座的插头插回自身：Effect 运行、更新 state、触发重新渲染、于是又触发 Effect 运行、再次更新 state，继而再次触发重新渲染。如此反复，从而陷入死循环。

Effect 应该用于将你的组件与一个 **外部** 的系统保持同步。如果没有外部系统，你只是想根据其他状态调整一些状态，那么 [你也许不需要 Effect](/learn/you-might-not-need-an-effect)。

</Pitfall>

### 第二步：指定 Effect 的依赖项 {/*step-2-specify-the-effect-dependencies*/}

默认情况下，Effect 会在 **每次** 渲染后运行。但往往 **这并不是你想要的**：

- 有时，它可能会很慢。与外部系统的同步并不总是即时的，所以你可能希望在不必要时跳过它。例如，你不会想在每次打字时都得重新连接聊天服务器。
- 有时，它可能会出错。例如，你不会想在每次按键时都触发组件的淡入动画。动画应该只在组件首次出现时播放。

为了演示这个问题，以下是在之前的示例中加入了一些 `console.log` 调用和一个更新父组件 state 的文本输入框。注意在输入时是如何触发 Effect 重新运行的：

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

通过在调用 `useEffect` 时指定一个 **依赖数组** 作为第二个参数，你可以让 React **跳过不必要地重新运行 Effect**。首先，在上面示例的第 14 行中传入一个空数组 `[]`：

```js {3}
  useEffect(() => {
    // ...
  }, []);
```

你会看到一个错误提示：`React Hook useEffect has a missing dependency: 'isPlaying'`：

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

原因在于，你的 Effect 内部代码依赖于 `isPlaying` prop 来决定该做什么，但你并没有显式声明这个依赖关系。为了解决这个问题，将 `isPlaying` 添加至依赖数组中：

```js {2,7}
  useEffect(() => {
    if (isPlaying) { // isPlaying 在此处使用……
      // ...
    } else {
      // ...
    }
  }, [isPlaying]); // ……所以它必须在此处声明！
```

现在所有的依赖都已经声明，所以没有错误了。指定 `[isPlaying]` 作为依赖数组会告诉 React：如果 `isPlaying` 与上次渲染时相同，就跳过重新运行 Effect。这样一来，输入框的输入不会触发 Effect 重新运行，只有按下播放/暂停按钮会触发。

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

依赖数组可以包含多个依赖项。只有当你指定的 **所有** 依赖项的值都与上一次渲染时完全相同，React 才会跳过重新运行该 Effect。React 使用 [`Object.is`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 来比较依赖项的值。有关详细信息，请参阅 [`useEffect` 参考文档](/reference/react/useEffect#reference)。

**请注意，你不能随意“选择”依赖项**。如果你指定的依赖项与 React 根据 Effect 内部代码所推断出的依赖项不匹配，你将收到来自 linter 的错误提示。这有助于捕捉代码中的许多 bug。如果你不希望某些代码重新运行，[那么你应当 **修改 Effect 代码本身**，使其不再“需要”该依赖项](/learn/lifecycle-of-reactive-effects#what-to-do-when-you-dont-want-to-re-synchronize)。

<Pitfall>

没有依赖数组和使用空数组 `[]` 作为依赖数组，行为是不同的：

```js {3,7,11}
useEffect(() => {
  // 这里的代码会在每次渲染后运行
});

useEffect(() => {
  // 这里的代码只会在组件挂载（首次出现）时运行
}, []);

useEffect(() => {
  // 这里的代码不但会在组件挂载时运行，而且当 a 或 b 的值自上次渲染后发生变化后也会运行
}, [a, b]);
```

我们会在下一步详细了解什么是 **挂载（mount）**。

</Pitfall>

<DeepDive>

#### 为什么依赖数组中可以省略 ref? {/*why-was-the-ref-omitted-from-the-dependency-array*/}

下面的 Effect 同时使用了 `ref` 与 `isPlaying` prop，但是只有 `isPlaying` 被声明为依赖项：

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

这是因为 `ref` 具有 **稳定** 的标识：React 确保你在 [每轮渲染中调用同一个 `useRef` 时，总能获得相同的对象](/reference/react/useRef#returns)。ref 不会改变，所以它不会导致重新运行 Effect。因此，在依赖数组中它可有可无。把它加进去也可以：

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

`useState` 返回的 [`set` 函数](/reference/react/useState#setstate) 也具有稳定的标识，因此它们通常也会被省略。如果在省略某个依赖项时 linter 不会报错，那么这么做就是安全的。

省略始终稳定的依赖项仅在 linter 能“看到”对象是稳定的时候才有效。例如，如果 `ref` 是从父组件传递过来的，则必须在依赖数组中指定它。这很有必要，因为你无法确定父组件是一直传递相同的 ref，还是根据条件传递不同的 ref。所以，你的 Effect 会依赖于被传递的是哪个 ref。

</DeepDive>

### 第三步：按需添加清理（cleanup）函数 {/*step-3-add-cleanup-if-needed*/}

考虑一个不同的例子。假如你正在编写一个 `ChatRoom` 组件，该组件在显示时需要连接到聊天服务器。现在为你提供了 `createConnection()` API，该 API 返回一个包含 `connect()` 与 `disconnection()` 方法的对象。如何确保组件在显示时始终保持连接？

从编写 Effect 的逻辑开始：

```js
useEffect(() => {
  const connection = createConnection();
  connection.connect();
});
```

如果每次重新渲染后都得进行连接，这会很慢，所以你需要添加依赖数组：

```js {4}
useEffect(() => {
  const connection = createConnection();
  connection.connect();
}, []);
```

**由于 Effect 中的代码没有使用任何 props 或 state，所以依赖数组为空数组 `[]`。这告诉 React 仅在组件“挂载”（即首次显示在页面上）时运行此代码**。

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

```js src/chat.js
export function createConnection() {
  // 真正的实现实际上会连接到服务器
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

这里的 Effect 仅在组件挂载时运行，所以你可能以为 `"✅ 连接中……"` 只会在控制台中被打印一次。**然而实际情况是 `"✅ 连接中……"` 被打印了两次！为什么会这样**？

假设 `ChatRoom` 组件是一个大型多页面应用中的一部分。用户最初在 `ChatRoom` 页面上。组件挂载并调用 `connection.connect()` 。接着用户可能会导航到另一个页面，比如切换到“设置”页面，于是 `ChatRoom` 组件被卸载。最后，当用户点击“返回”时，`ChatRoom` 组件再次挂载。这将建立第二个连接——但第一个连接从未被销毁！随着用户在应用中来回切换，连接将会不断累积。

这类 bug 在没有大量手动测试的情况下很容易被忽略。为了帮助你快速发现它们，在开发环境中，React 会在组件首次挂载后立即重新挂载一次。

两次出现 `"✅ 连接中……"` 能够帮助你注意到真正的问题：在代码中，组件被卸载时没有关闭连接。

为了解决这个问题，可以在 Effect 中返回一个 **清理（cleanup）函数** 。

```js {4-6}
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []);
```

React 会在每次 Effect 重新运行之前调用清理函数，并在组件卸载（被移除）时最后一次调用清理函数。让我们看看实现清理函数后会发生什么：

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

```js src/chat.js
export function createConnection() {
  // 真正的实现实际上会连接到服务器
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

现在在开发环境下，你会看到三条控制台日志：

1. `"✅ 连接中……"`
2. `"❌ 连接断开。"`
3. `"✅ 连接中……"`

**在开发环境下，这是正确的行为**。通过重新挂载你的组件，React 验证了离开页面再返回不会导致代码出错。因为本就应该先断开然后再重新连接！如果你很好地实现了清理函数，那么无论是只执行一次 Effect ，还是执行、清理、再执行，都应该没有用户可见的区别。之所以会有额外的一次 connect/disconnect 调用，是因为在开发环境下 React 在检测你代码中的 bug。因此这是正常现象，不要去试图消除它！

**在生产环境下，你只会看到 `"✅ 连接中……"` 打印一次**。这是因为重新挂载组件只会在开发环境下发生，以此帮助你找到需要清理的 Effect。你可以通过关闭 [严格模式](/reference/react/StrictMode) 来禁用这个行为，但我们建议保留它。它可以帮助你发现许多类似上述的 bug。

## 如何处理在开发环境下 Effect 运行了两次？ {/*how-to-handle-the-effect-firing-twice-in-development*/}

React 有意在开发环境下重新挂载你的组件，来找到类似上例中的 bug。**你需要思考的不是“如何只运行一次 Effect”，而是“如何修复我的 Effect 来让它在重新挂载后正常运行”**。

通常，答案是实现清理函数。清理函数应该停止或撤销 Effect 所做的一切。原则是用户不应该感受到 Effect 只执行一次（在生产环境中）和连续执行“挂载 → 清理 → 挂载”（在开发环境中）之间的区别。

你将编写的大多数 Effect 都会符合下列的常见模式之一。

<Pitfall>

#### 不要使用 ref 来防止触发 Effect {/*dont-use-refs-to-prevent-effects-from-firing*/}

为了防止 Effect 在开发环境中触发两次，一个常见错误是使用 `ref` 来让 Effect 只运行一次。例如，你可能会用 `useRef` “修复”上述的 bug：

```js {1,3-4}
  const connectionRef = useRef(null);
  useEffect(() => {
    // 🚩 这并不能修复这个 bug！！！
    if (!connectionRef.current) {
      connectionRef.current = createConnection();
      connectionRef.current.connect();
    }
  }, []);
```

它虽然使你在开发环境下只看到一次 `“✅ 正在连接...”`，但并没有修复这个 bug。

当用户离开时，连接没有被关闭，当用户返回时，又会创建一个新的连接。随着用户浏览应用，连接会不断累积，就像“修复”之前一样。

要修复这个 bug，仅仅让 Effect 只运行一次是不够的。想要 Effect 在重新挂载后正常运行，就得按照之前的方法清除连接。

请看下面的示例，了解如何处理常见模式。

</Pitfall>

### 管理非 React 小部件 {/*controlling-non-react-widgets*/}

有时你需要添加不是用 React 实现的 UI 小部件。比如说你想在你的页面添加一个地图组件。它有一个 `setZoomLevel()` 方法，然后你希望地图的缩放比例和代码中的 `zoomLevel` state 保持同步。你的 Effect 应该类似于：

```js
useEffect(() => {
  const map = mapRef.current;
  map.setZoomLevel(zoomLevel);
}, [zoomLevel]);
```

请注意，这种情况下不需要清理操作。在开发环境中，虽然 React 会调用 Effect 两次，但这没关系，因为用相同的值调用 `setZoomLevel` 两次不会造成任何影响。虽然在开发环境下它可能会稍微慢一些，但问题不大，因为在生产环境下它不会多余地重新挂载。

有些 API 可能不允许你连续调用两次。例如，内置的 [`<dialog>`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLDialogElement) 元素的 [`showModal`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLDialogElement/showModal) 方法在连续被调用两次时会抛出异常。此时可以通过实现清理函数来使其关闭对话框：

```js {4}
useEffect(() => {
  const dialog = dialogRef.current;
  dialog.showModal();
  return () => dialog.close();
}, []);
```

在开发环境中，你的 Effect 会先调用 `showModal()`，然后立即调用 `close()`，之后再次调用 `showModal()`。这与在生产环境中只调用一次 `showModal()` 的用户可见行为是相同的。

### 订阅事件 {/*subscribing-to-events*/}

如果你的 Effect 订阅了某些事件，清理函数应退订这些事件：

```js {6}
useEffect(() => {
  function handleScroll(e) {
    console.log(window.scrollX, window.scrollY);
  }
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

在开发环境中，你的 Effect 会先调用 `addEventListener()`，然后立即调用 `removeEventListener()`，接着再次使用相同的处理函数调用 `addEventListener()`。因此，每次只会有一个有效订阅。这与在生产环境中只调用一次 `addEventListener()` 所产生的用户可见行为是相同的。

### 触发动画 {/*triggering-animations*/}

如果你的 Effect 触发了一些动画，清理函数应将动画重置为初始状态：

```js {4-6}
useEffect(() => {
  const node = ref.current;
  node.style.opacity = 1; // 触发动画
  return () => {
    node.style.opacity = 0; // 重置为初始值
  };
}, []);
```

在开发环境中，透明度由 `1` 变为 `0`，再变为 `1`。这与在生产环境中，直接将其设置为 `1` 具有相同的用户可见行为。如果你使用了支持补间动画的第三方动画库，你的清理函数应将时间轴重置为初始状态。

### 获取数据 {/*fetching-data*/}

如果你的 Effect 需要获取数据，清理函数应 [中止请求](https://developer.mozilla.org/zh-CN/docs/Web/API/AbortController) 或忽略其结果：

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

你无法“撤销”已经发生的网络请求，但是你的清理函数应当确保那些不再相关的请求不会继续影响你的应用。如果 `userId` 从 `'Alice'` 变为 `'Bob'`，那么请确保 `'Alice'` 的响应数据被忽略，即使它在 `'Bob'` 之后到达。

**在开发环境中，你会在浏览器调试工具的“网络”选项卡中看到两条请求**。这是正常的。使用上述方法，第一个 Effect 将立即被清理，所以它的 `ignore` 变量会被设置为 `true`。因此，即使有额外的请求，由于有 `if (!ignore)` 的检查，也不会影响 state。

**在生产环境中，只会有一条请求**。如果开发环境中的第二次请求给你造成了困扰，最好的办法是使用一个能够对请求去重并缓存响应的方案：

```js
function TodoList() {
  const todos = useSomeDataLibrary(`/api/user/${userId}/todos`);
  // ...
```

这不仅可以提高开发体验，还可以让你的应用程序响应更快。例如，当用户点击返回按钮时，不用再等待数据重新加载，因为它已经被缓存。你可以自己构建这样的缓存机制，也可以使用很多在 Effect 中手动获取数据的替代方法。

<DeepDive>

#### 在 Effect 中进行数据请求的替代方案 {/*what-are-good-alternatives-to-data-fetching-in-effects*/}

在 Effect 中直接编写 `fetch` 请求 [是一种常见的数据获取方式](https://www.robinwieruch.de/react-hooks-fetch-data/)，特别是在完全客户端渲染的应用中。然而，这种方法非常手动化，并且有明显的弊端：

- **Effect 不会在服务端运行**。这意味着最初由服务器渲染的 HTML 只会包含加载状态，而没有实际数据。客户端必须先下载所有的 JavaScript 并渲染应用，才会发现它需要加载数据——这并不高效。
- **直接在 Effect 中进行数据请求，容易产生“网络瀑布（network waterfall）”**。首先父组件渲染时请求一些数据，随后渲染子组件，接着子组件开始请求它们的数据。如果网络速度不快，这种方式会比并行获取所有数据慢得多。
- **直接在 Effect 中进行数据请求往往无法预加载或缓存数据**。例如，如果组件卸载后重新挂载，它必须重新获取数据。
- **不够简洁**。编写 fetch 请求时为了避免 [竞态条件（race condition）](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect) 等问题，会需要很多样板代码。

这些弊端并不仅限于 React。任何库在组件挂载时进行数据获取都会遇到这些问题。与路由处理一样，要做好数据获取并非易事，因此我们推荐以下方法：

- **如果你正在使用 [框架](/learn/start-a-new-react-project#full-stack-frameworks) ，请使用其内置的数据获取机制**。现代 React 框架集成了高效的数据获取机制，不会出现上述问题。
- **否则，请考虑使用或构建客户端缓存**。流行的开源解决方案包括 [React Query](https://tanstack.com/query/latest)、[useSWR](https://swr.vercel.app/) 和 [React Router v6.4+](https://beta.reactrouter.com/en/main/start/overview)。你也可以自己构建解决方案：在底层使用 Effect，但添加对请求的去重、缓存响应以及避免网络瀑布（通过预加载数据或将数据请求提升到路由层次）的逻辑。

如果这些方法都不适合你，你可以继续直接在 Effect 中获取数据。

</DeepDive>

### 发送分析报告 {/*sending-analytics*/}

考虑以下代码，它在页面访问时发送一个分析事件：

```js
useEffect(() => {
  logVisit(url); // 发送 POST 请求
}, [url]);
```

在开发环境中，对于每个 URL，`logVisit` 都会被调用两次，因此你可能会尝试修复这个问题。**我们建议保持不动**。与之前示例类似，运行一次还是运行两次，在用户可见的行为上没有区别。从实际角度来看，`logVisit` 不应该在开发环境中执行任何操作，因为你不会想让开发设备的日志影响生产环境的统计数据。每次保存文件时组件都会重新挂载，因此在开发环境中会记录额外的访问日志。

**在生产环境中，不会有重复的访问日志**。

为了调试发送的分析事件，你可以将应用部署到一个运行在生产模式下的暂存环境，或者暂时禁用 [严格模式](/reference/react/StrictMode) 及其仅在开发环境中的重新挂载检查。你还可以在路由更改的事件处理程序中发送分析数据，而不是在 Effect 中发送。对于更精确的分析，可以使用[交叉观察器](https://developer.mozilla.org/zh-CN/docs/Web/API/Intersection_Observer_API) 来跟踪哪些组件位于视口中以及它们保持可见的时间。

### 不适用于 Effect：初始化应用 {/*not-an-effect-initializing-the-application*/}

某些逻辑应该只在应用启动时运行一次。你可以将它放在组件外部：

```js {2-3}
if (typeof window !== 'undefined') { // 检查是否在浏览器中运行
  checkAuthToken();
  loadDataFromLocalStorage();
}

function App() {
  // ……
}
```

这可以确保此类逻辑只在浏览器加载页面后运行一次。

### 不适用于 Effect：购买商品 {/*not-an-effect-buying-a-product*/}

有时，即使你编写了清理函数，也无法避免用户观察到 Effect 运行了两次。比如你的 Effect 发送了一个像购买商品这样的 POST 请求：

```js {2-3}
useEffect(() => {
  // 🔴 错误：此处的 Effect 在开发环境中会触发两次，暴露出代码中的问题。
  fetch('/api/buy', { method: 'POST' });
}, []);
```

你肯定不希望购买两次商品。这也是为什么你不应该把这种逻辑放在 Effect 中。如果用户跳转到另一个页面，然后按下“返回”按钮，你的 Effect 就会再次运行。你不希望用户在访问页面时就购买产品，而是在他们点击“购买”按钮时才购买。

购买操作并不是由渲染引起的，而是由特定的交互引起的。它应该只在用户按下按钮时执行。因此，**它不应该写在 Effect 中，应当把 `/api/buy` 请求移动到“购买”按钮的事件处理程序中**：

```js {2-3}
  function handleClick() {
    // ✅ 购买行为是一个事件，因为它是由特定的交互引起的。
    fetch('/api/buy', { method: 'POST' });
  }
```

**这说明了如果重新挂载破坏了应用的逻辑，通常便暴露了存在的 bug**。对用户而言，访问一个页面不应该与访问页面后点击链接、再按下“返回”按钮查看页面有区别。React 通过在开发环境中重新挂载组件来验证你的组件是否遵守这一原则。

## 综合以上内容 {/*putting-it-all-together*/}

这个演练场可以帮助你“感受” Effect 在实际中的工作方式。

这个例子使用 [`setTimeout`](https://developer.mozilla.org/zh-CN/docs/Web/API/setTimeout) 调度一个日志记录，日志会在 Effect 运行三秒后显示输入的文本。清理函数会取消挂起的延时器。从按下“挂载组件”开始：

<Sandpack>

```js
import { useState, useEffect } from 'react';

function Playground() {
  const [text, setText] = useState('a');

  useEffect(() => {
    function onTimeout() {
      console.log('⏰ ' + text);
    }

    console.log('🔵 调度 "' + text + '" 日志');
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
        {show ? '卸载' : '挂载'}组件
      </button>
      {show && <hr />}
      {show && <Playground />}
    </>
  );
}
```

</Sandpack>

你首先会看到三条日志：`调度 "a" 日志`，`取消 "a" 日志`，再一条 `调度 "a" 日志`。三秒后，你还会看到一条日志：`a`。正如你先前所学，额外的调度/取消日志是因为 React 在开发环境中会重新挂载组件一次，以验证你是否正确实现了清理操作。

现在编辑输入框，输入 `abc`。如果输入速度足够快，你会看到 `调度 "ab" 日志`，紧接着 `取消 "ab" 日志` 和 `调度 "abc" 日志`。**React 总是在执行下一轮渲染的 Effect 之前清理上一轮渲染的 Effect**。这就是为什么即使你快速输入，最多也只有一个延时器被调度。试试多次编辑输入框，并观察控制台以了解 Effect 是如何被清理的。

在输入框中输入一些内容，然后立即按下“卸载组件”。注意卸载组件时是如何清理最后一轮渲染的 Effect 的。在这里，它会在最后一个延迟器要触发之前取消它。

最后，在上面的代码中注释掉清理函数，这样延时器就不会被取消。尝试快速输入 `abcde`。你觉得三秒后会发生什么？延时器中的 `console.log(text)` 会打印 **最新** 的 `text` 值并生成五条 `abcde` 日志吗？试试看吧，验证一下你的直觉！

三秒后，你应该会看到一系列的日志：`a`、`ab`、`abc`、`abcd` 与 `abcde`，而不是五条 `abcde` 日志。这是因为 **每个 Effect 都会“捕获”它对应渲染时的 `text` 值**。即使 `text` 的值发生了变化，渲染时 `text = 'ab'` 的 Effect 总是会得到 `'ab'`。换句话说，每个渲染的 Effect 都是相互独立的。如果你对这种机制感兴趣，可以阅读有关 [闭包](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Closures) 的内容。

<DeepDive>

#### 每一轮渲染都有其自己的 Effect {/*each-render-has-its-own-effects*/}

你可以将 `useEffect` 理解为“附加”一段行为到渲染输出中。考虑下面这个 Effect：

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

#### 初次渲染 {/*initial-render*/}

用户访问 `<ChatRoom roomId="general" />`。我们 [假设](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time) `roomId` 的值为 `'general'` ：

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

React 运行这个 Effect 来连接到 `'general'` 聊天室。

#### 依赖项相同时的重新渲染 {/*re-render-with-same-dependencies*/}

假设 `<ChatRoom roomId="general" />` 重新渲染。输出的 JSX 不变：

```js
  // 第二次渲染时的 JSX（roomId 为 "general"）
  return <h1>Welcome to general!</h1>;
```

React 看到渲染输出没有改变，所以不更新 DOM 。

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

React 将第二次渲染时的 `['general']` 与第一次渲染时的 `['general']` 进行比较。**因为所有的依赖项都相同，React 忽略第二次渲染时的 Effect**。Effect 不会被调用。

#### 依赖项不同时的重新渲染 {/*re-render-with-different-dependencies*/}

接着，用户访问了 `<ChatRoom roomId="travel" />`。这一次，组件返回了不同的 JSX：

```js
  // 第三次渲染时的 JSX（roomId 为 "travel"）
  return <h1>欢迎来到 travel！</h1>;
```

React 更新 DOM ，将 `"欢迎来到 general"` 改为 `"欢迎来到 travel"`。

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

React 将第三次渲染时的 `['travel']` 与第二次渲染时的 `['general']` 相比较。发现依赖项不同：`Object.is('travel', 'general')` 为 `false`。因此 Effect 不能被跳过。

**在 React 执行第三次渲染的 Effect 之前，它需要清理上一个运行的 Effect**。第二次渲染的 Effect 被跳过了。所以 React 需要清理第一次渲染时的 Effect。如果你回看第一次渲染，你会发现第一次渲染时的清理函数所做的事，是在 `createConnection('general')` 所创建的连接上调用 `disconnect()`。也就是从 `'general'` 聊天室断开连接。

之后，React 执行第三次渲染的 Effect。它连接到 `'travel'` 聊天室。

#### 组件卸载 {/*unmount*/}

最后，假设用户离开了当前页面，`ChatRoom` 组件被卸载。React 执行上一个运行的 Effect 的清理函数，也就是第三次渲染时的 Effect。这个清理函数会销毁 `createConnection('travel')` 所创建的连接。这样，应用与 `travel` 房间断开了连接。

#### 仅开发环境下的行为 {/*development-only-behaviors*/}

开启 [严格模式](/reference/react/StrictMode) 时，React 在每次挂载组件后都会重新挂载组件（组件的 state 与 创建的 DOM 都会被保留）。[它可以帮助你找出需要添加清理函数的 Effect](#step-3-add-cleanup-if-needed)，并在早期暴露类似竞态条件这样的 bug。此外，每当你在开发环境中保存文件时，React 也会重新挂载 Effect。这些行为都仅限于开发环境。

</DeepDive>

<Recap>

- 与事件不同，Effect 由渲染本身引起，而非特定的交互。
- Effect 允许你将组件与某些外部系统（第三方 API、网络等）同步。
- 默认情况下，Effect 在每次渲染（包括初始渲染）后运行。
- 如果所有依赖项都与上一次渲染时相同，React 会跳过本次 Effect。
- 你不能“选择”依赖项，它们是由 Effect 内部的代码所决定的。
- 空的依赖数组（`[]`）对应于组件的“挂载”，即组件被添加到页面上时。
- 仅在严格模式下的开发环境中，React 会挂载两次组件，以对 Effect 进行压力测试。
- 如果你的 Effect 因为重新挂载而出现问题，那么你需要实现一个清理函数。
- React 会在 Effect 再次运行之前和在组件卸载时调用你的清理函数。

</Recap>

<Challenges>

#### 挂载后聚焦于表单字段 {/*focus-a-field-on-mount*/}

在下面的例子中，表单中渲染了一个 `<MyInput />` 组件。

使用输入框的 [`focus()`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/focus) 方法，让 `MyInput` 在页面上出现时自动聚焦。已经有一个被注释掉的实现，但它并不能正常工作。找出它为什么不起作用，并修复它。如果你熟悉 `autoFocus` 属性，请假装它不存在：我们正在从头开始实现相同的功能。

<Sandpack>

```js src/MyInput.js active
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

```js src/App.js hidden
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


要验证你的方法是否奏效，请点击“展示表单”，并确认输入框获得焦点（高亮显示并且光标位于内部）；再次点击“隐藏表单”和“展示表单”，确认输入框是否再次被高亮显示。

`MyInput` 组件应该只在 **挂载** 时获得焦点，而非每次渲染后。为了验证这一行为是否正确，点击“展示表单”，然后反复点击“大写”的复选框。点击复选框时，上方的输入框不应该获得焦点。

<Solution>

在渲染期间调用 `ref.current.focus()` 是错误的。因为它是一个“副作用”。副作用应该放在事件处理程序中或通过 `useEffect` 来声明。在这里，这个副作用是由组件渲染引起的，而不是任何特定的交互引起的，因此应该将它放在 Effect 中。

要修复这个错误，需要将 `ref.current.focus()` 调用包裹在 Effect 中。然后，为了确保这个 Effect 只在组件挂载时运行，而不是每一轮渲染后都运行，再添加一个空的依赖数组 `[]`。

<Sandpack>

```js src/MyInput.js active
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

```js src/App.js hidden
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

#### 有条件地聚焦于表单字段 {/*focus-a-field-conditionally*/}

下面的表单渲染两个 `<MyInput />` 组件。

点击“展示表单”后，注意第二个输入框会自动获取焦点。这是因为两个 `<MyInput />` 组件在内部抢占焦点。当你连续为两个输入框调用 `focus()` 时，最后一个总会“获胜”。

假设你希望聚焦于第一个输入框。现在，第一个 `MyInput` 组件接收一个布尔类型的 `shouldFocus` 属性，且值设置为 `true`。请修改程序逻辑，使得仅当 `MyInput` 接收到的 `shouldFocus` 属性为 `true` 时才调用 `focus()` 。

<Sandpack>

```js src/MyInput.js active
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

```js src/App.js hidden
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

要验证你的方法是否奏效，请重复点击“展示表单”和“隐藏表单”。当表单显示时，只有第一个输入框该获得焦点。因为父组件在渲染第一个输入框时传入了 `shouldFocus={true}`，而渲染第二个输入框时传入了 `shouldFocus={false}`。同时，请确认两个输入框都能正常工作并且你都能在其中输入。

<Hint>

你不能有条件地声明 Effect，但你的 Effect 中可以包含条件逻辑。

</Hint>

<Solution>

在 Effect 中加入条件逻辑。由于你在 Effect 中使用了 `shouldFocus`，因此需要将它指定为依赖项。这意味着如果某个输入框的 `shouldFocus` 由 `false` 变为 `true`，它将在挂载后获得焦点。

<Sandpack>

```js src/MyInput.js active
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

```js src/App.js hidden
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

#### 修复会触发两次的定时器 {/*fix-an-interval-that-fires-twice*/}

这个 `Counter` 组件展示了一个每秒递增的计数器。在组件挂载时，它调用了 [`setInterval`](https://developer.mozilla.org/zh-CN/docs/Web/API/setInterval)。这使得 `onTick` 每秒运行一次。`onTick` 函数会递增计数器。

然而，计数器不是每秒递增一次，而是两次。这是为什么呢？找出 bug 的原因并修复它。

<Hint>

请记住，`setInterval` 返回一个 interval ID，你可以将它传递给 [`clearInterval`](https://developer.mozilla.org/zh-CN/docs/Web/API/clearInterval) 来停止这个定时器。

</Hint>

<Sandpack>

```js src/Counter.js active
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

```js src/App.js hidden
import { useState } from 'react';
import Counter from './Counter.js';

export default function Form() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? '隐藏' : '展示'}计数器</button>
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

当开启 [严格模式](/reference/react/StrictMode) 时（例如在本站的示例沙盒（sandbox）中），React 在开发环境中会将每个组件重新挂载一次。这使得计数器组件被挂载了两次，于是定时器也被设置了两次，因此计数器会每秒增加两次。

然而，React 的行为并不是导致这个 bug 的根本原因：代码中本就存在这个 bug。React 的行为只是让这个 bug 更加明显。真正的原因是这个 Effect 开启了一个进程但没有提供清理它的方式。

要修复这段代码，保存 `setInterval` 返回的 interval ID，并使用 [`clearInterval`](https://developer.mozilla.org/zh-CN/docs/Web/API/clearInterval) 实现一个清理函数：

<Sandpack>

```js src/Counter.js active
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

```js src/App.js hidden
import { useState } from 'react';
import Counter from './Counter.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? '隐藏' : '展示'}计数器</button>
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

在开发环境中，React 仍然会重新挂载一次你的组件，以确保你已经正确地实现了清理函数。因此，在调用 `setInterval` 后会紧接着调用 `clearInterval`，然后再调用 `setInterval`。在生产环境中，则只调用一次 `setInterval`。两种情况下用户可见的行为都是相同的：计数器每秒递增一次。

</Solution>

#### 解决在 Effect 中获取数据的问题 {/*fix-fetching-inside-an-effect*/}

下面这个组件显示所选人物的传记。它在挂载时和每当 `person` 改变时，通过调用一个异步函数 `fetchBio(person)` 来加载传记。该异步函数返回一个 [Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)，最终解析为一个字符串。当请求结束时，它调用 `setBio` 以将该字符串显示在选择框下方。

<Sandpack>

```js src/App.js
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

```js src/api.js hidden
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


这段代码中有一个 bug。试试先选择 `Alice`，再选择 `Bob`，接着立即选择 `Taylor`。如果操作得足够快，你会观察到这个 bug：虽然 Taylor 被选中了，但下面的一段却说：“这是 Bob 的传记。”

为什么会出现这种情况？试试修复这个 Effect 中的 bug。

<Hint>

如果 Effect 需要异步获取某些数据，它往往需要清理函数。

</Hint>

<Solution>

要触发这个 bug，事情需要按以下顺序发生：

- 选中 `'Bob'` 触发 `fetchBio('Bob')`
- 选中 `'Taylor'` 触发 `fetchBio('Taylor')`
- **`fetchBio('Taylor')` 在 `fetchBio('Bob')` 之前完成。**
- 渲染 `'Taylor'` 时的 Effect 调用 `setBio('这是Taylor的传记')`
- `fetchBio('Bob')` 请求完成
- 渲染 `'Bob'` 时的 Effect 调用 `setBio('这是Bob的传记')`

这就是为什么即使选择了 Taylor，但显示的仍然是 Bob 的传记。像这样的 bug 被称为 [竞态条件](https://en.wikipedia.org/wiki/Race_condition)，因为两个异步操作在“竞速”，并且可能会以意外的顺序完成。

要修复这个 bug，添加一个清理函数：

<Sandpack>

```js src/App.js
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

```js src/api.js hidden
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

每轮渲染的 Effect 都有其独立的 `ignore` 变量。最初，`ignore` 变量被设置为 `false`。但如果一个 Effect 被清理（例如，当你选择不同的人时），它的 `ignore` 变量会变为 `true`。因此，请求完成的顺序已经不再重要。只有最后选中的人的 Effect 的 `ignore` 变量会是 `false`，因此它将会调用 `setBio(result)`。而之前的 Effect 已经被清理，所以 `if (!ignore)` 的检查会阻止它们调用 `setBio`：

- 选中 `'Bob'` 触发 `fetchBio('Bob')`
- 选中 `'Taylor'` 触发 `fetchBio('Taylor')`，**并清理之前的（Bob 的） Effect**
- `fetchBio('Taylor')` 在 `fetchBio('Bob')` **之前** 完成。
- 渲染 `'Taylor'` 时的 Effect 调用 `setBio('这是Taylor的传记')`
- `fetchBio('Bob')` 请求完成
- 渲染 `'Bob'` 时的 Effect 不会做任何事情，因为它的 `ignore` 变量被设为了 `true`。

除了忽略过时 API 调用的结果外，你还可以使用 [`AbortController`](https://developer.mozilla.org/zh-CN/docs/Web/API/AbortController) 来取消不再需要的请求。然而，仅凭这一点还不足以防止竞态条件。因为可能在 fetch 之后还有更多的异步操作，因此使用像 `ignore` 这样的显式标志是解决这类问题最可靠的方法。

</Solution>

</Challenges>

