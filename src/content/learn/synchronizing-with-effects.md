---
title: '同步操作与 Effect'
---

<Intro>

一些组件需要与外部系统进行同步操作。 例如，您可能希望根据 React 状态来控制非 React 组件、连接到服务器，或者是在组件渲染时发送调试分析日志。 *Effects* 允许你在渲染后运行一些代码，这样你就可以将你的组件与 React 的一些外部系统执行同步操作。

</Intro>

<YouWillLearn>

- Effect 究竟是什么
- Effect 和事件（Event）有何不同
- 如何在你的组件中声明 Effect
- 如何避免 Effect 的不必要重复执行
- 为什么 Effects 在开发环境中运行两次，以及如何解决这个问题

</YouWillLearn>

## 什么是 Effect ？它与事件 (Event) 有何不同 {/*what-are-effects-and-how-are-they-different-from-events*/}

在我们开始讨论 Effects 之前, 你需要熟悉在React组件中两种类型的内部逻辑：

- **渲染逻辑代码** （详见 [描述用户界面](/learn/describing-the-ui) 一节）它位于组件声明区块的顶部位置。也就是你获取属性（Props）和设置状态（State）的地方，程序执行时会对这些代码进行计算，然后返回计算得到的 JSX 组件，并在屏幕上渲染。 [渲染逻辑代码必须是纯粹的。](/learn/keeping-components-pure) 就像数学公式，它只能去**计算**并得到结果, 除此之外什么也不要做。

- **事件处理程序** （详见 [添加交互](/learn/adding-interactivity) 一节）它是组件内声明的函数，它们**做**任务而不仅仅有计算渲染逻辑。还可以是更新输入字段、在电商网站中提交 HTTP、POST 请求以发送“购买”的动作，或者将用户导航到另一个屏幕。事件处理程序包括特定的用户操作（例如，单击按钮或键入）引起的[“副作用”](https://en.wikipedia.org/wiki/Side_effect_(computer_science))（它会改变程序的 State 状态）。

有时候，仅仅有上面这些东西还不够。 考虑 `ChatRoom` 这个“聊天室” 组件，它无论在是否被渲染都应当时刻与聊天服务器保持连接。而连接到聊天服务器并不是一个纯粹的操作（也就是说它是一个副作用）所以，它不能在组件渲染的过程中执行。那么，如果我希望在只在单击时触发渲染`ChatRoom`，那么我应该怎么做？

***Effects* 允许您指定由渲染本身引起的副作用，而不是由特定事件引起的副作用。** 在聊天中发送消息是一个事件，因为它是直接由用户点击特定按钮引起的。然而，连接到服务器则是一个副作用，因为它无论任何交互引起组件渲染时都会发生。Effects 在屏幕更新的 [提交](/learn/render-and-commit) 行为结束后运行。这是一个在 React 组件渲染时，与外部系统（如网络或第三方库）进行同步操作的好时机。

<Note>

在本文和后续文本中，这里的 `Effect` 在 React 里面是一个专有定义，即由渲染引起的副作用。为了指代更广泛的编程概念，也可以称其为 "副作用（side effect）"。

</Note>


## 你可能不需要 Effect {/*you-might-not-need-an-effect*/}

**不要莽然在你的组件中使用Effect** 记住，Effects 通常用于“跳出”你的 React 代码与一些*外部*系统进行同步。 这包括浏览器 API、第三方小部件、网络等。 如果您的 Effect 仅根据其他状态调整某些状态，[你可能不需要 Effect。](/learn/you-might-not-need-an-effect)

## 如何写一个 Effect {/*how-to-write-an-effect*/}

编写一个 Effect, 遵循以下三种规则：

1. **声明一个 Effect.** 默认情况下, 你的 Effect 会在每次渲染后都会执行。
2. **指定 Effect 依赖.** 大多数 Effects 应该按需执行，而不是在每次渲染后都要执行。例如，淡入动画应该只在组件出现时触发。连接和断开聊天室只应在组件出现和消失时，或者切换聊天室时发生。您将学习如何通过指定依赖来控制如何按需执行。
3. **必要时添加清理操作.** 有的 Effects 需要指定如何停止、撤销, 或者清除它的效果。 例如， “连接” 操作需要 “断连”, “订阅” 需要 “退订”， 以及 “获取” 既需要 “取消” 也需要 “忽略”。你将学习如何让通过 *清理操作函数* 来做这些。

以下是具体步骤

### 第一步 1: 声明 Effect {/*step-1-declare-an-effect*/}

在你的组件内声明 Effect ，从React模块中引入 [`useEffect` Hook](/reference/react/useEffect)：

```js
import { useEffect } from 'react';
```

然后，在你的组件顶层位置调用它，并传入一些在每次渲染时都需要执行的代码：

```js {2-4}
function MyComponent() {
  useEffect(() => {
    // Code here will run after *every* render
  });
  return <div />;
}
```

每当您的组件渲染时，React 将更新屏幕，然后运行 useEffect 中的代码。换句话说，**useEffect 会把这段代码拖延到屏幕更新渲染后执行。**

让我们看看如何使用 Effect 与外部系统同步。考虑一个 `<VideoPlayer>` React 组件。通过传递一个 `isPlaying` 的属性，可以控制它是正在播放还是暂停：

```js
<VideoPlayer isPlaying={isPlaying} />;
```

你让 `VideoPlayer` 组件渲染浏览器的内置的 [`<video>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/video) 标签:

```js
function VideoPlayer({ src, isPlaying }) {
  // TODO: do something with isPlaying
  return <video src={src} />;
}
```

然而， 这个 `<video>` 标签本身并没有 `isPlaying` 这个属性。 它只能在 DOM 上通过手动调用 [`play()`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLMediaElement/play) 和 [`pause()`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLMediaElement/pause) 方法来实现是否要播放内容。 **你需要同步 isPlaying 属性的值，通过调用 `play()` 和 `pause()` 函数。以决定是否要播放当前的视频。**

我们首先要为 `<video>` 这个DOM节点 [获取引用](/learn/manipulating-the-dom-with-refs)。

您可能会尝试在渲染期间调用 `play()` 或 `pause()`，但这种做法是错的：

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  if (isPlaying) {
    ref.current.play();  // Calling these while rendering isn't allowed.
  } else {
    ref.current.pause(); // Also, this crashes.
  }

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
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
button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

这段代码之所以不正确，是因为它试图在渲染期间对 DOM 节点进行操作。 在React中， [JSX的渲染必须是纯粹操作](/learn/keeping-components-pure) 并且不应该包含任何像修改DOM的副作用。

此外，在首次调用 `VideoPlayer`时，在没有运行到返回 JSX 这一步之前，先执行渲染逻辑代码，但此时还不清楚返回的 JSX 是什么样的，因此 React 还不知道要创建哪些 DOM 对象。所以它要渲染 `<video>` 的 DOM 此时还不存在！这样就还不能调用 `play()` 和 `pause()` 方法。

解决办法就是 **使用 `useEffect` 包裹副作用，把它分离到渲染计算的过程之外：**

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

把调用 DOM 方法的操作封装在 Effect 中，您可以让 React 先更新屏幕。然后再运行您的 Effect。

当 `VideoPlayer` 组件渲染时（无论是否为首次渲染），会发生以下事情。 首先，React 会刷新屏幕，确保 `<video>` 元素以正确地出现在 DOM 中。然后 React 将运行您的 Effect。最后，您的 Effect 将根据 `isPlaying` 的值调用 `play()` 或 `pause()`。

试试按下几次 播放/暂停 操作 ，观察视频播放器是如何与`isPlaying`值同步的：

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
button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

在这个示例中，您同步到 React 状态的 "外部系统" 是浏览器媒体 API。您可以使用类似的方法将旧的非 React 代码（如 jQuery 插件）封装成声明性的 React 组件。

请注意，控制视频播放器在实际应用中复杂得多。比如调用 `play()` 可能会失败，用户可能会使用内置浏览器控件播放或暂停等等。这只是一个简化了很多具体细节的例子。

<Pitfall>

一般来说，Effect会在 **每次** 渲染时都会执行。**以下代码会陷入无尽循环之中。**

```js
const [count, setCount] = useState(0);
useEffect(() => {
  setCount(count + 1);
});
```

这里的 Effect 会**生成新的渲染结果**。也就是说，Effect会设置新的 `count` 状态，而设置新的 `count` 状态又会**触发**新一轮渲染。但是新一轮渲染时又会再次执行 Effect ，然后 Effect 又开始改变状态，从而又开始触发新一轮渲染。就这样，它们陷入了一个无穷尽的循环之中。

效果通常应该使您的组件与**外部**系统同步。 如果没有外部系统，你只想根据其他状态调整一些状态， [那么你也许就不需要 Effect。](/learn/you-might-not-need-an-effect)

</Pitfall>

### Step 2: 指定 Effect 依赖 {/*step-2-specify-the-effect-dependencies*/}

一般来说， Effects 会在 **每次** 渲染时执行。**但通常来讲，有时候你并不需要每次渲染的时候都要执行 Effects 。**

- 有时，它会拖慢运行速度。因为与外部系统的同步操作总是有一定的时耗，在非必要时您可能希望跳过它。例如，您不想在每次击键时都重新连接到聊天服务器。
- 有时候，这会导致程序逻辑错误。 例如，组件的淡入动画只需要在第一次出现时播放一次，而不是每次事件在触发新一轮渲染后都要播放。

为了演示这个问题，还是拿前面的代码作示例，在这里调用 `console.log` 指示事件改变状态。在这里，为`VideoPlayer`的父组件 `<App/>` 加入了一个新的 `<input>` 文本输入框标签。请尝试点击按钮、往文本框内输入一些内容，注意点击、按键事件如何导致 Effect 重复执行：

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

在上面的例子中，点击按钮、按键都触发了事件，然后事件修改状态，修改状态引起新一轮渲染。

所以，你可以给定一个 **依赖数组** ，传入`useEffect`的第二个参数，来告诉 React **跳过非必要的Effect重复执行**。如果你在上面示例的第14行中传入一个空数组 `[]`。

```js {3}
  useEffect(() => {
    // ...
  }, []);
```

你会发现 React 会报错： `React Hook useEffect has a missing dependency: 'isPlaying'`。完整代码如下:

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
  }, []); // This causes an error

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

问题就出现在你在 Effect 里面 **依赖** 了一个 `isPlaying` 的属性来控制里面的逻辑。但你又没有直接明确告诉 Effect 要依赖这个属性。为了解决这个问题，你需要声明你的Effect依赖这个属性，把`isPlaying`加入到依赖数组中即可：

```js {2,7}
  useEffect(() => {
    if (isPlaying) { // It's used here...
      // ...
    } else {
      // ...
    }
  }, [isPlaying]); // ...so it must be declared here!
```

这样，你就向Effect声明依赖了这个`isPlaying`属性，这样就不会报错了。指定 `[isPlaying]` 作为依赖数组会告诉React：当新一轮渲染发生时，如果依赖中的`isPlaying`的值与前一轮渲染的值相同，那么就可以跳过这一次的Effect。就避免了Effect的重复执行。这样，你在向`<input>`执行按键输入时，由于 Effect不依赖 `Text` 状态而不会触发执行，但是按下 播放/暂停 按钮时由于修改了这个 Effect 依赖的 `isPlaying` 状态，则会触发执行：

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

依赖数组可以包含多个依赖。当React只有在数组中**所有的**依赖值与前一轮渲染相同时，才会跳过 本次Effect执行。其中，与前一轮渲染比较依赖值时，React使用的是 [`Object.is`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 这个比较方法。详见 [`useEffect` reference](/reference/react/useEffect#reference)。

**请注意，您不能随意“自选”您的依赖项。** 如果你在Effect里实际依赖项和你在依赖数组中所声明的依赖不匹配时，你就会得到 lint 报错。这是一种很不好的习惯，它会在你的代码中引入很多 BUG 。如果你希望在Effect实际依赖某个值的情况下，忽略掉某个依赖引发的重复执行, [那么你应当**编辑Effect代码本身**，使其“不需要”该依赖项。](/learn/lifecycle-of-reactive-effects#what-to-do-when-you-dont-want-to-re-synchronize)

<Pitfall>

没有依赖数组和带有**空**依赖数组 `[]`两种情况行为是不同的：

```js {3,7,11}
useEffect(() => {
  // 它会在每次渲染时执行
});

useEffect(() => {
  // 它只会在组件挂载时执行 (也就是说组件出现时，通常是组件首次调用时)
}, []);

useEffect(() => {
  // 它会在组件挂载时，或者与上一轮渲染时相比 a 或 b 发生变化时两种情况下执行
}, [a, b]);
```

我们将在下一步中仔细研究**挂载**的含义。

</Pitfall>

<DeepDive>

#### 为什么 ref 可以从依赖数组中省略？ {/*why-was-the-ref-omitted-from-the-dependency-array*/}

这个 Effect **同时** 依赖了 `ref` 和 `isPlaying`，但是只需要在数组中声明 `isPlaying` 这个依赖：

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
}
```

这是因为 `ref` 对象具有**稳定**的标识：React 保证 [在每一轮渲染中调用`useRef`，总是获取到对一个对象的相同引用](/reference/react/useRef#returns) useRef获取到的对象引用永远不会改变，所以它不会导致Effect的重复执行。 因此，是否包含它并不重要。当然也可以包括它，这样也可以：

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
}
```

`useState`返回的[`set` 函数](/reference/react/useState#setstate) 也有稳定的标识符所以你也可以把它从依赖数组中忽略掉。如果 linter 在你忽略某个依赖项时不报错，那么这么做就是安全的。

忽略始终稳定的依赖项仅在 linter 可以“看到”对象稳定时才起作用。 例如，如果 `ref` 是从父组件传递的，则必须在依赖项数组中指定它。 但是，这很好，因为您无法知道父组件是否始终传递相同的 ref，或者有条件地传递几个 ref 之一。 因此，您的 Effect 将取决于传递的是哪个 ref。

</DeepDive>

### Step 3: 按需添加清理函数 {/*step-3-add-cleanup-if-needed*/}

考虑一个不同的例子。您正在编写一个`ChatRoom`组件，该组件出现时需要连接到聊天服务器。为您提供了一个`createConnection（）`API，该API返回一个具有`connect（）`和`disconnection（）`方法的对象。当组件显示给用户时，如何保持连接？

从编写效果逻辑开始：

```js
useEffect(() => {
  const connection = createConnection();
  connection.connect();
});
```

每次重新渲染后连接到聊天会很慢，因此您可以添加依赖数组：

```js {4}
useEffect(() => {
  const connection = createConnection();
  connection.connect();
}, []);
```

**Effect内部的代码不使用任何属性或状态，因此依赖数组为空数组`[]`。这告诉React仅在组件“挂载”时运行此代码，即首次出现在屏幕上。**

让我们尝试运行以下代码：

<Sandpack>

```js
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
  }, []);
  return <h1>Welcome to the chat!</h1>;
}
```

```js chat.js
export function createConnection() {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting...');
    },
    disconnect() {
      console.log('❌ Disconnected.');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
```

</Sandpack>

这里的 Effect 仅在组件挂载时执行，所以你可能预期 `"✅ Connecting..."` 在控制台中只打印一次。 **然而你检查下控制台的输出结果，会发现 `"✅ Connecting..."` 被打印了两次！为什么会这样？**

想象 `ChatRoom` 组件是一个大规模的App中许多界面中的一部分。 用户切换到含有`ChatRoom`组件的页面上工作时，该组件被挂载，并调用 `connection.connect()` 方法来连接服务器。然后想象用户此时突然导航到另一个页面，比如切换到“设置”页面。这时候，之前页面利用的 `ChatRoom` 组件就被卸载了。接下来，用户在“设置”页面忙完后，单击“返回”，回到上一个页面，并再次挂载`ChatRoom`。这将建立第二次连接，但是，第一次时创建的连接从未被销毁！当用户在应用程序中不断切换界面再返回时，与服务器的连接会不断堆积。

如果不进行大量的手动测试，这样的错误很容易被遗漏。为了帮助您快速发现它们，在开发环境中，React 会在初始挂载组件后，再立即挂在一次。

观察 `"✅ Connecting..."` 出现了两次，可以帮你找到问题所在：你的代码中，组件被卸载时没有关闭连接。

为了修复这个问题，可以在 Effect 中返回一个**清理**函数。

```js {4-6}
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []);
```

每次 Effect 重复执行之前，React 都会调用你的清理函数，最后一次组件卸载（被删除）时。 让我们看看执行清理函数会做些什么：

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
  return <h1>Welcome to the chat!</h1>;
}
```

```js chat.js
export function createConnection() {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting...');
    },
    disconnect() {
      console.log('❌ Disconnected.');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
```

</Sandpack>

现在在开发模式下，你的控制台会打印三条记录：

1. `"✅ Connecting..."`
2. `"❌ Disconnected."`
3. `"✅ Connecting..."`

**在开发环境下出现这样的结果才是符合预期的** 重复挂载组件，可以确保在React中离开和返回页面时不会导致代码运行出现问题。断开连接再重新连接是符合预期的行为。当你为 Effect 正确实现清理函数时，无论Effect执行一次，还是执行、清理并再执行，用户都不会感受到明显的差异。所以，在开发环境下，出现额外的连接、断连连接/断开，这是React正在调试你的代码。这是很正常的现象，不要试图消除它！

**在生产环境下你会看到 `"✅ Connecting..."` 只被打印了一次** 仅在开发环境下才会重复挂载组件，以帮助您找到需要清理的效果。你可以选择关闭 [严格模式](/reference/react/StrictMode) 来关闭开发环境下特有的行为，但我们建议保留它。 这可以让你发现许多像上面的错误。

## 如何处理在开发环境中Effect执行两次的效果？ {/*how-to-handle-the-effect-firing-twice-in-development*/}

React 会故意在开发中重复挂载你的组件，以查找像上面示例中的错误。 **正确的对待态度是“如何修复我的 Effect 以便它在重复挂在后能正常工作”，而不是“如何只运行一次 Effect”**

通常的解决办法是实现清理函数。清理函数应该停止或撤销 Effect 正在执行的任何操作。简单来说，用户不应该感受到Effect只执行一次（如在生产环境中）和执行“挂载 → 清理 → 挂载”过程（如在开发环境中）之间的差异。

下面提供一些常用的 Effect 应用模式。

### 控制非React组件 {/*controlling-non-react-widgets*/}

有时您需要添加不是使用 React 编写的 UI 小部件。 例如，假设您要向页面添加地图组件。 它有一个 `setZoomLevel()` 方法，您希望缩放级别与 React 代码中的 `zoomLevel` 状态变量保持同步。 您的效果看起来类似于：

```js
useEffect(() => {
  const map = mapRef.current;
  map.setZoomLevel(zoomLevel);
}, [zoomLevel]);
```

请注意，在这种情况下不需要清理。 在开发中，React 会调用 Effect 两次，但这不是问题，因为两次以用相同的值调用 `setZoomLevel` 不会做任何额外的事情。开发环境中它可能会稍微慢一些，但这问题不大，因为它不会在生产中进行不必要的重复挂载。

某些 API 可能不允许您连续调用两次。 例如，内置[`<dialog>`](https: //developer.mozilla.org/zh-CN/docs/Web/API/HTMLDialogElement) 元素连续调用两次时会抛出异常。这时候你就可以实现关闭 dialog 的清理函数：

```js {4}
useEffect(() => {
  const dialog = dialogRef.current;
  dialog.showModal();
  return () => dialog.close();
}, []);
```

在开发中，您的 Effect 将调用 `showModal()`，然后立即调用 `close()`，然后再次调用 `showModal()`。 这与调用只一次 `showModal()` 的效果相同。也正如您在生产环境中看到的那样。

### 订阅事件 {/*subscribing-to-events*/}

如果您的 Effect 订阅了某些东西，清理函数应该取消订阅：

```js {6}
useEffect(() => {
  function handleScroll(e) {
    console.log(window.scrollX, window.scrollY);
  }
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

在开发环境下，你的 Effect 会调用两次 `addEventListener()`，然后立即调用 `removeEventListener()`，然后再调用相同的 `addEventListener()`。因此与只订阅一次活动等效。 这与用户在生产中只调用一次 `addEventListener()` 具有相同的感知效果。

### 触发动画 {/*triggering-animations*/}

如果您的 Effect 订阅了某些东西，清理函数应该取消订阅：

```js {4-6}
useEffect(() => {
  const node = ref.current;
  node.style.opacity = 1; // Trigger the animation
  return () => {
    node.style.opacity = 0; // Reset to the initial value
  };
}, []);
```

在开发环境下， 透明度被设为由 `1` 到 `0` 再到 `1`。这与在生产环境中，直接将其设置为`1`具有相同的用户感知，如果您使用支持过渡的第三方动画库，您的清理函数应将时间轴重置为其初始状态。

### 获取数据 {/*fetching-data*/}

如果您的 Effect 获取了一些数据，清理函数应该实现 [中断获取](https://developer.mozilla.org/zh-CN/docs/Web/API/AbortController) 或忽略获取的结果：

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

您不能“撤消”已经发生的网络请求，但是您的清理功能应该确保获取数据的过程以及获取到的结果不会继续影响程序。 如果 `userId` 从 `'Alice'` 变为 `'Bob'`，确保 `'Alice'` 响应数据被忽略，即使它在 `'Bob'` 之后到达。

**在开发环境，您可以在浏览器调试工具的“network”选项卡中看到两个 Fetch 请求。** 这很正常。 使用上述方法，第一个 Effect 将立即被清理，因此它的 `ignore` 标志变量将被设置为 `true`。 因此，即使有额外的请求，由于有 if (!ignore) 检查，也不会影响程序状态。

**在生产环境，只会显示一条请求** 如果开发环境中，第二个请求给您造成了困扰，最好的方法是使用一种可以删除重复请求、并缓存请求响应的解决方案：

```js
function TodoList() {
  const todos = useSomeDataLibrary(`/api/user/${userId}/todos`);
  // ...
}
```

这不仅可以提高开发体验，还可以让你的应用程序速度更快。例如，用户按下按钮时，如果数据已经被缓存了，那么就不必再次等待加载。你可以自己构建这样的缓存，也可以使用很多在 Effect 中手动加载数据的替代方法。

<DeepDive>

#### 在Effects中，有哪些好的数据提取替代方案？ {/*what-are-good-alternatives-to-data-fetching-in-effects*/}

Writing `fetch` calls inside Effects is a [popular way to fetch data](https://www.robinwieruch.de/react-hooks-fetch-data/), especially in fully client-side apps. This is, however, a very manual approach and it has significant downsides:

- **Effects don't run on the server.** This means that the initial server-rendered HTML will only include a loading state with no data. The client computer will have to download all JavaScript and render your app only to discover that now it needs to load the data. This is not very efficient.
- **Fetching directly in Effects makes it easy to create "network waterfalls".** You render the parent component, it fetches some data, renders the child components, and then they start fetching their data. If the network is not very fast, this is significantly slower than fetching all data in parallel.
- **Fetching directly in Effects usually means you don't preload or cache data.** For example, if the component unmounts and then mounts again, it would have to fetch the data again.
- **It's not very ergonomic.** There's quite a bit of boilerplate code involved when writing `fetch` calls in a way that doesn't suffer from bugs like [race conditions.](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect)

This list of downsides is not specific to React. It applies to fetching data on mount with any library. Like with routing, data fetching is not trivial to do well, so we recommend the following approaches:

- **If you use a [framework](/learn/start-a-new-react-project#production-grade-react-frameworks), use its built-in data fetching mechanism.** Modern React frameworks have integrated data fetching mechanisms that are efficient and don't suffer from the above pitfalls.
- **Otherwise, consider using or building a client-side cache.** Popular open source solutions include [React Query](https://tanstack.com/query/latest), [useSWR](https://swr.vercel.app/), and [React Router 6.4+.](https://beta.reactrouter.com/en/main/start/overview) You can build your own solution too, in which case you would use Effects under the hood, but add logic for deduplicating requests, caching responses, and avoiding network waterfalls (by preloading data or hoisting data requirements to routes).

You can continue fetching data directly in Effects if neither of these approaches suit you.

</DeepDive>

### 发送分析报告 {/*sending-analytics*/}

考虑在访问页面时发送事件分析日志的代码：

```js
useEffect(() => {
  logVisit(url); // Sends a POST request
}, [url]);
```

在开发环境下， `logVisit` 会为每个 URL 发送两次请求。所以你可能会想尝试解决这个问题。 **我们建议保持此代码不变。** 与前面的示例一样，运行一次和运行两次之间没有**用户感知**的行为差异。从实际的角度来看，`logVisit` 不应该在开发环境中做任何影响生产事情，由于每次保存代码文件时都会重新装载组件，因此在开发环境中会额外记录访问次数。

**在生产环境中，不会有重复的访问日志。** 要调试你发送的事件分析日志，你可以将应用程序部署到一个暂存环境（以生产模式运行），或者暂时退出[严格模式](/reference/react/StrictMode)，仅在开发环境中检查重复挂载。你还可以通过路由更改事件处理程序来发送分析数据，而不是从 Effects 中发送。为了更精确的分析，[intersection observers](https://developer.mozilla.org/zh-CN/docs/Web/API/Intersection_Observer_API)可以帮助跟踪哪些组件在视口中，以及它们保持可见的时间。

### 初始化应用操作不是 Effect {/*not-an-effect-initializing-the-application*/}

某些逻辑应该只在应用程序启动时运行一次。比如，验证登陆状态和加载本地程序数据。您可以将其放在组件之外：

```js {2-3}
if (typeof window !== 'undefined') { // Check if we're running in the browser.
  checkAuthToken();
  loadDataFromLocalStorage();
}

function App() {
  // ...
}
```

这保证了这种逻辑在浏览器加载页面后只运行一次。

### 购买商品操作不是 Effect {/*not-an-effect-buying-a-product*/}

有时，即使您编写了一个清理函数，也不能防止运行两次Effect的操作后果。例如，您的Effect可能会像购买产品一样发送POST请求：

```js {2-3}
useEffect(() => {
  // 🔴 Wrong: This Effect fires twice in development, exposing a problem in the code.
  fetch('/api/buy', { method: 'POST' });
}, []);
```

这并不是一个幂等操作。
开发环境下，Effect会执行两次，这也意味着你的购买操作执行了两次。你不会想买两次这个产品的。然而，这也是为什么你不应该把这个逻辑放在一个效果中。另一方面，如果用户转到另一个页面，然后按“后退”按钮回到了这个界面，该怎么办？你的效果会再次运行。所以，当用户访问某个页面时，不应当执行购买操作；当只有用户点击“购买”按钮时，才执行购买操作。

所以，购买不是由渲染引起的；它是由特定的交互作用引起的。它应该只在用户按下按钮时运行，所以，**它不应该写在Effect里，应当把“/api/buy”请求操作移动到buy按钮事件处理程序中：**

```js {2-3}
  function handleClick() {
    // ✅ Buying is an event because it is caused by a particular interaction.
    fetch('/api/buy', { method: 'POST' });
  }
```

**这说明如果重新挂载破坏了应用程序的逻辑，这通常含有未被发现的错误。** 从用户的角度来看，访问这个页面的效果，与访问该页面时单击和页面中其他链接并按下后退没有什么不同。 React 通过在开发环境中重复挂载它们来验证您的组件是否遵守此原则。

## 总结 {/*putting-it-all-together*/}

This playground can help you "get a feel" for how Effects work in practice.

This example uses [`setTimeout`](https://developer.mozilla.org/zh-CN/docs/Web/API/setTimeout) to schedule a console log with the input text to appear three seconds after the Effect runs. The cleanup function cancels the pending timeout. Start by pressing "Mount the component":

<Sandpack>

```js
import { useState, useEffect } from 'react';

function Playground() {
  const [text, setText] = useState('a');

  useEffect(() => {
    function onTimeout() {
      console.log('⏰ ' + text);
    }

    console.log('🔵 Schedule "' + text + '" log');
    const timeoutId = setTimeout(onTimeout, 3000);

    return () => {
      console.log('🟡 Cancel "' + text + '" log');
      clearTimeout(timeoutId);
    };
  }, [text]);

  return (
    <>
      <label>
        What to log:{' '}
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
        {show ? 'Unmount' : 'Mount'} the component
      </button>
      {show && <hr />}
      {show && <Playground />}
    </>
  );
}
```

</Sandpack>

你在最开始时可以看到三个 log 输出： `Schedule "a" log`, `Cancel "a" log`，还有一个 `Schedule "a" log` 。三秒后，还会有一条 log 显示：`a` 。 正如之前所说，额外 schedule/cancel 产生的原因是因为 React 在开发环境中，会重新挂载组件一次，以验证您是否正确地实现了清理函数。

现在编辑输入框，输入 `abc`。 如果你输入速度足够快，你会看到 `Schedule "ab" log` 紧接着是 `Cancel "ab" log` 和 `Schedule "abc" log`。 **React 总是在下一个渲染的效果之前清理上一个渲染的效果。**这就是为什么即使您快速输入，最多也只安排了一个 Schedule。可以多次编辑输入框，并观察控制台以了解 Effects 是如何被清理的。

在输入框中输入一些内容，然后立即按“Unmount the component”。注意卸载时如何清理最后一个渲染的 Effect 。 在这里，它在触发卸载之前，清除了最后一次 Schedule。

最后，上面的代码中注释掉清理函数，这样 Schedule 就不会被取消。 尝试快速输入 `abcde`。 你希望三秒钟内发生什么？ Schedule 内的 `console.log(text)` 会打印**最新** `text` 并产生五个 `abcde` 日志吗？ 试试你的直觉吧！

三秒之后，你可以看到一系列的 logs (`a`, `ab`, `abc`, `abcd`, 还有 `abcde`) 而不是五个 `abcde`。 **每个 Effect 会"捕捉"它所对应的渲染过程中 `text` 的取值。**   `text` 状态的变化不重要： 以 `text = 'ab'` 渲染的 Effect 将始终只能看到 `'ab'` 这个值。 换句话说，来自每个渲染的 Effect 是相互隔离的。如果你有兴趣，可以了解下 [JavaScript中的闭包](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Closures).

<DeepDive>

#### 每一轮渲染都有它自己的副作用 {/*each-render-has-its-own-effects*/}

你可以认为 `useEffect`作为将一段行为“附加”到渲染输出。考虑这种情况：

```js
export default function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to {roomId}!</h1>;
}
```

让我们看看当用户在应用程序中导航时到底发生了什么。

#### 初始渲染 {/*initial-render*/}

用户访问 `<ChatRoom roomId="general" />`，这里让我们 [假设](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time) 赋予 `roomId` 属性值为 `'general'`:

```js
  // JSX for the first render (roomId = "general")
  return <h1>Welcome to general!</h1>;
```

**“Effects”也是渲染输出的一部分**。第一个渲染的Effects变为：

```js
  // Effect for the first render (roomId = "general")
  () => {
    const connection = createConnection('general');
    connection.connect();
    return () => connection.disconnect();
  },
  // Dependencies for the first render (roomId = "general")
  ['general']
```

React 执行这个连接到 `'general'` 聊天室的 Effect。

#### 依赖相同情况下的重复渲染 {/*re-render-with-same-dependencies*/}

让我们探讨下 `<ChatRoom roomId="general" />` 的重复渲染， JSX 的输出结果仍然相同：

```js
  // JSX for the second render (roomId = "general")
  return <h1>Welcome to general!</h1>;
```

React看到渲染输出没有改变，所以它不会更新DOM。

第二次渲染的效果如下所示：

```js
  // Effect for the second render (roomId = "general")
  () => {
    const connection = createConnection('general');
    connection.connect();
    return () => connection.disconnect();
  },
  // Dependencies for the second render (roomId = "general")
  ['general']
```

React 从第二次渲染的 `['general']` 与第一次渲染的 `['general']` 进行比较。 **因为所有的依赖性都是相同的， React 会 *忽略* 第二次渲染时的 Effect** 。所以此时 Effect 不会被调用。

#### 依赖不同情况下的重复渲染 {/*re-render-with-different-dependencies*/}

然后，用户访问 `<ChatRoom roomId="travel" />` 时，返回的是不同的 JSX 输出结果：

```js
  // JSX for the third render (roomId = "travel")
  return <h1>Welcome to travel!</h1>;
```

React更新DOM，将 `"Welcome to general"` 更新为 `"Welcome to travel"`.

第三次渲染的 Effect 就像这个样子：

```js
  // Effect for the third render (roomId = "travel")
  () => {
    const connection = createConnection('travel');
    connection.connect();
    return () => connection.disconnect();
  },
  // Dependencies for the third render (roomId = "travel")
  ['travel']
```

React 将第三次渲染时的 `['travel']` 与第二次渲染时的 `['general']` 相互比较。只有一个依赖项不同： `Object.is('travel', 'general')` 为 `false`。所以这次的 Effect 不能跳过.

**在 React 执行第三次渲染的 Effect 之前，它需要清理最近渲染的 Effect。** 第二次渲染的 Effect 被跳过了。所以 React 需要清理第一次渲染时的 Effect。如果你回滚到第一次渲染的 Effect，你可以看到清理函数在`createConnection('general')`所创建的连接上调用了 `disconnect()` 。这回从 `'general'` 聊天室断开连接。

之后，React 执行第三次渲染的 Effect。 它连接到 `'travel'`聊天室。

#### 卸载 {/*unmount*/}

最后，假设现在用户离开当前页面，并且 `ChatRoom` 组件被卸载的时候，React执行Effect最后的清理函数，并且最后的清理函数来自于第三次渲染。第三次渲染后再清理时，清理函数破坏了 `createConnection('travel')` 方法创建的连接。 因此，该应用程序与 `travel` 房间断开了连接。

#### 仅开发环境下的程序行为 {/*development-only-behaviors*/}

在 [严格模式](/reference/react/StrictMode) 下，React 在每次卸载组件后都会重新挂载组件。（但是组建的 State 和 创建的DOM 都会被保留）。 [它可以帮助你找出需要添加清理函数的 Effect](#step-3-add-cleanup-if-needed) ，及早暴露出像条件竞争那样的 Bug 。 此外，每当您在开发环境中保存更新文件时，React 也会重新安装 Effects。 这两种行为都仅限于开发环境下。

</DeepDive>

<Recap>

- 与事件不同，Effects 是由渲染本身，而非特定交互引起的。
- Effects 允许您将组件与某些外部系统（第三方API、网络等）同步。
- 默认情况下，“Effects” 在每次渲染（包括初始渲染）后运行。
- 如果React的所有依赖项都与上次渲染时的值相同，则它将跳过本次 Effect。
- 你不能随意“自选”你的依赖关系。它们是由Effect内部的代码决定的。
- 空的依赖数组（`[]`）对应于组件“挂载”，即添加到屏幕上。
- 仅在严格模式下的开发环境中，React会挂载两次组件，以对您的 Effect 进行压力测试。
- 如果你的 Effect 因为重新挂载而中断，那么你就需要实现一个清理函数。
- React 将在下次 Effect 运行之前以及卸载期间这两个时候调用清理函数。

</Recap>

<Challenges>

#### 挂载时让表单字段获得焦点 {/*focus-a-field-on-mount*/}

在这个例子中，表单渲染了 `<MyInput />` 组件。

使用 input 的 [`focus()`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/focus) 方法让 `MyInput` 在加载到屏幕时自动获得焦点。下面代码中已经有一个注释掉的实现，但它没有效果。弄明白为什么没有出现这个效果，并修复它。（如果你想到使用 `autoFocus` 属性，那先忘掉它。我们从头开始，以另一个角度实现相同的效果）。

<Sandpack>

```js MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ value, onChange }) {
  const ref = useRef(null);

  // TODO: This doesn't quite work. Fix it.
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
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Enter your name:
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
            Make it uppercase
          </label>
          <p>Hello, <b>{upper ? name.toUpperCase() : name}</b></p>
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


要验证您的解决方案是否有效，请按“Show form”按钮并验证`<input />`输入框是否收到焦点（高亮显示，光标位于内部）。再次按下“Hide form”和“show form”。验证输入框是否再次获得焦点。

`MyInput` 仅在 **挂载** 时获取焦点，而不是在每次渲染后获取焦点。为了验证这一行为，按下“Show form”，然后重复按下“Make it uppercase”的复选框。点击复选框时，上方的输入框不应该获取到焦点。

<Solution>

在渲染期间调用 `ref.current.focus()` 本身是不正确的。因为它就是一个“副作用”。副作用既应该放在事件处理程序里面，或者用 `useEffect` 声明。在这种情况下，副作用是组件渲染引起的，而不是任何特定的交互引起的，因此应该将它放在 Effect 中。

为了修复这个错误，可以用 Effect 声明包裹对 `ref.current.focus()` 的调用。 然后确保这个 Effect 只在组件挂载时执行而不是在每一轮渲染时都执行，可以为 Effect 的声明加一个空的依赖数组 `[]`。

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
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Enter your name:
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
            Make it uppercase
          </label>
          <p>Hello, <b>{upper ? name.toUpperCase() : name}</b></p>
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

#### 有条件地让表单域获得焦点 {/*focus-a-field-conditionally*/}

这个表单渲染两个 `<MyInput />` 组件.

按下“显示表单”，同时注意第二个输入框已经自动获得了焦点。那是因为两个 `<MyInput />` 组件都在试图把焦点往自身上转移。当你连续为两个输入框调用`focus()`时，其中最后面的输入框总是能“获胜”。

假设让第一个输入框获得了焦点。那么，第一个`MyInput`组件现在接收到 `shouldFocus` 属性，并且应当被设置为 `true` 。更改下程序逻辑，规定仅当 `MyInput` 接收到的 `shouldFocus` 属性为 `true` 时才调用 `focus()`。

<Sandpack>

```js MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ shouldFocus, value, onChange }) {
  const ref = useRef(null);

  // TODO: call focus() only if shouldFocus is true.
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
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Enter your first name:
            <MyInput
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              shouldFocus={true}
            />
          </label>
          <label>
            Enter your last name:
            <MyInput
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              shouldFocus={false}
            />
          </label>
          <p>Hello, <b>{upper ? name.toUpperCase() : name}</b></p>
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

为了检验以上效果，重复按下“显示表单”和“隐藏表单”试一下。当表单出现时，这里只有第一个输入框获得了焦点。那是因为它的父组件渲染的第一个输入框时，第一个输入框带着 `shouldFocus={true}` 这个属性值，而渲染第二个输入框时，第二个输入框则带着 `shouldFocus={false}` 的属性值。你也可以看到，即使你往两个输入框里都输入一些内容时，他们仍然能正常工作。

<Hint>

所以，您不能有条件地声明 Effect，但您的 Effect 可以包含条件逻辑。

</Hint>

<Solution>

往 Effect 放入一些条件逻辑，你需要为 Effect 指定 `shouldFocus` 这个依赖项。因为你在 Effect 里面使用它了。（这也意味着如果input输入框的 `shouldFocus` 由 `false` 变为 `true` 时，它会在挂载时获得焦点）。

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
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Enter your first name:
            <MyInput
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              shouldFocus={true}
            />
          </label>
          <label>
            Enter your last name:
            <MyInput
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              shouldFocus={false}
            />
          </label>
          <p>Hello, <b>{upper ? name.toUpperCase() : name}</b></p>
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

#### 修复计时器触发两次的 Bug {/*fix-an-interval-that-fires-twice*/}

这个 `Counter` 组件展示的是计数器，它应该每秒都递增一次。在组件挂载时，它调用了 [`setInterval`.](https://developer.mozilla.org/zh-CN/docs/Web/API/setInterval) 这个函数，引发每次到点时，就递增一次的事件。

然而，它不是每秒递增一次，而是递增两次。为什么？找到错误的原因并进行修复。

<Hint>

记住， `setInterval` 返回一个计时器 ID，你可以将其传递给 [`clearInterval`](https://developer.mozilla.org/zh-CN/docs/Web/API/clearInterval) 来停止计时器。

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
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} counter</button>
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

当开启 [严格模式](/reference/react/StrictMode) 时 （本站中的示例沙盒就已经开启了严格模式），React在开发模式中，每个组件都会重复挂载一次。这也就导致计数器组件被挂载了两次。所以，计时器也被设立了两次，这就是为什么计数器每秒递增两次的原因。

然而，这个并不是React本身的错：而是你的 Effect 代码中本身就存在 Bug 。React只不过把这个 Bug 放大了。真正的错误原因是这种 Effect 启动后，但没有提供清理函数，所以上一次的 Effect 残留就没有被除去。

为了修复这个问题，你可以在保存 `setInterval` 返回的计时器 ID ，然后实现一个清理函数。这个清理函数可以调用 [`clearInterval`](https://developer.mozilla.org/zh-CN/docs/Web/API/clearInterval) 方法，把上一次设置的计时器残留清除掉。

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
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} counter</button>
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

在开发环境中，React 仍然会重复挂载一次组件，通过放大Bug，以确保你正确地实现了清理函数。这样，调用一次 `setInterval` 后就紧接着调用 `clearInterval`，然后再调用 `setInterval`。 在生产环境中与开发环境不同，React 只挂载一次组件，即只调用一次 `setInterval` 。两种情况下用户可见的行为是相同的：计数器每秒递增一次。

</Solution>

#### 修复在 Effect 里获取数据时的问题 {/*fix-fetching-inside-an-effect*/}

现在，我写一个组件，这个组件要求选择一些人名，然后显示所选人的传记。它会通过 `fetchBio(person)` 这个异步函数，在挂载时以及依赖参数 `person` 发生改变时加载数据。这个异步函数返回的是一个 [Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise) ，且这个Promise在 `resolve` 的情况下返回的是一个文本字符串。当数据加载获取完毕后，调用 `setBio` ，以在选择框下面显示加载好的文本数据。

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
      <p><i>{bio ?? 'Loading...'}</i></p>
    </>
  );
}
```

```js api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('This is ' + person + '’s bio.');
    }, delay);
  })
}

```

</Sandpack>


这个代码中有一个错误。首先选择 `Alice` 。然后选择 `Bob` ，然后紧接着选择 `Taylor`。如果你做得足够快，你会注意到这个错误：Taylor 被选中了，但下面的一段却说：“这是Bob的简历。”

为什么会发生这种情况？试着修复此 Effect 中的错误。

<Hint>

如果一个Effect异步获取某些数据，它通常需要清理函数。

</Hint>

<Solution>

触发Bug时，程序的指令序列是这样的：

- 选中 `'Bob'` 触发 `fetchBio('Bob')`
- 选中 `'Taylor'` 触发 `fetchBio('Taylor')`
- **在加载 `'Taylor'` 的数据完成之前，就已经加载完成了 `'Bob'` 的数据**
- 加载 `'Taylor'` 数据的 Effect 调用了 `setBio('This is Taylor’s bio')`
- 加载完成 `'Bob'` 的数据
- 加载 `'Bob'` 数据的 Effect 调用了 `setBio('This is Bob’s bio')`

这就是为什么即使 Taylor 被选中了，但显示的仍然是 Bob 的数据。这种 Bug 被称之为 [条件竞争](https://en.wikipedia.org/wiki/Race_condition) ，因为两个异步操作都在彼此竞争，谁先谁后都是不可预期的。

为了修复这种条件竞争的 Bug ，修正代码时可以加上清理函数：

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
      <p><i>{bio ?? 'Loading...'}</i></p>
    </>
  );
}
```

```js api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('This is ' + person + '’s bio.');
    }, delay);
  })
}

```

</Sandpack>

其实，每个 Effect 都可以在里面设置一个 `ignore` 的标志变量。最初时， `ignore` 变量被设置为 `false`。然而，当 Effect 执行清理后（就像你选中了列表中不同的人时），`ignore` 变量就会被设置为 `true`。所以此时请求完成的顺序并不重要。只有最后选中的人在执行它的 Effect 时， `ignore` 会被设为 `false`，所以它会调用 `setBio(result)`。而之前的 Effects 都被清理掉了。 所以检查 `if (!ignore)` 会阻止调用 `setBio`：

- 选中 `'Bob'` 触发 `fetchBio('Bob')`
- 选中 `'Taylor'` 触发 `fetchBio('Taylor')` **然后清理之前加载 (Bob's) 数据时的Effect**
- 在加载完 `'Bob'` 的数据**之前**，就已经完成加载 `'Taylor'` 的数据。
- 渲染 `'Taylor'` 时的 Effect 调用 `setBio('This is Taylor’s bio')`
- 加载完成 `'Bob'` 的数
- 渲染 `'Bob'` 时的 Effect 不会做任何事情，因为 `ignore` 标志被设为了 `true` 。

除了忽略过时 API 调用的结果外，您还可以使用 [`AbortController`](https://developer.mozilla.org/zh-CN/docs/Web/API/AbortController) 取消正在执行的请求 不再需要。 然而，这本身并不足以防止竞争条件。 在获取之后可以链接更多异步步骤，因此使用像 `ignore` 这样的显式标志是解决此类问题的最可靠方法。

</Solution>

</Challenges>

