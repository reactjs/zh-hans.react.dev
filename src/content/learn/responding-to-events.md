---
title: 响应事件
translators:
  - Jiacheng787
  - QC-L
  - Neo42
  - Zhou Chenyang
---

<Intro>

使用 React 可以在 JSX 中添加 **事件处理函数**。其中事件处理函数为自定义函数，它将在响应交互（如点击、悬停、表单输入框获得焦点等）时触发。

</Intro>

<YouWillLearn>

* 编写事件处理函数的不同方法
* 如何从父组件传递事件处理逻辑
* 事件如何传播以及如何停止它们

</YouWillLearn>

## 添加事件处理函数 {/*adding-event-handlers*/}

如需添加一个事件处理函数，你需要先定义一个函数，然后 [将其作为 prop 传入](/learn/passing-props-to-a-component) 合适的 JSX 标签。例如，这里有一个没绑定任何事件的按钮：

<Sandpack>

```js
export default function Button() {
  return (
    <button>
      未绑定任何事件
    </button>
  );
}
```

</Sandpack>

按照如下三个步骤，即可让它在用户点击时显示消息：

1. 在 `Button` 组件 **内部** 声明一个名为 `handleClick` 的函数。
2. 实现函数内部的逻辑（使用 `alert` 来显示消息）。
3. 添加 `onClick={handleClick}` 到 `<button>` JSX 中。

<Sandpack>

```js
export default function Button() {
  function handleClick() {
    alert('你点击了我！');
  }

  return (
    <button onClick={handleClick}>
      点我
    </button>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

你可以定义 `handleClick` 函数然后 [将其作为 prop 传入](/learn/passing-props-to-a-component) `<button>`。其中 `handleClick` 是一个 **事件处理函数** 。事件处理函数有如下特点:

* 通常在你的组件 **内部** 定义。
* 名称以 `handle` 开头，后跟事件名称。

> 按照惯例，通常将事件处理程序命名为 `handle`，后接事件名。你会经常看到 `onClick={handleClick}`，`onMouseEnter={handleMouseEnter}` 等。

或者，你也可以在 JSX 中定义一个内联的事件处理函数：

```jsx
<button onClick={function handleClick() {
  alert('你点击了我！');
}}>
```

或者，直接使用更为简洁箭头函数：

```jsx
<button onClick={() => {
  alert('你点击了我！');
}}>
```

以上所有方式都是等效的。当函数体较短时，内联事件处理函数会很方便。

<Pitfall>

传递给事件处理函数的函数应直接传递，而非调用。例如：

| 传递一个函数（正确）     | 调用一个函数（错误）     |
| -------------------------------- | ---------------------------------- |
| `<button onClick={handleClick}>` | `<button onClick={handleClick()}>` |

区别很微妙。在第一个示例中，`handleClick` 函数作为 `onClick` 事件处理函数传递。这会让 React 记住它，并且只在用户点击按钮时调用你的函数。

在第二个示例中，`handleClick()` 中最后的 `()` 会在 [渲染](/learn/render-and-commit) 过程中 **立即** 触发函数，即使没有任何点击。这是因为在 [JSX `{` 和 `}`](/learn/javascript-in-jsx-with-curly-braces) 之间的 JavaScript 会立即执行。

当你编写内联代码时，同样的陷阱可能会以不同的方式出现：

| 传递一个函数（正确）            | 调用一个函数（错误）    |
| --------------------------------------- | --------------------------------- |
| `<button onClick={() => alert('...')}>` | `<button onClick={alert('...')}>` |


如果按如下方式传递内联代码，并不会在点击时触发，而是会在每次组件渲染时触发：

```jsx
// 这个 alert 在组件渲染时触发，而不是点击时触发！
<button onClick={alert('你点击了我！')}>
```

如果你想要定义内联事件处理函数，请将其包装在匿名函数中，如下所示：

```jsx
<button onClick={() => alert('你点击了我！')}>
```

这里创建了一个稍后调用的函数，而不会在每次渲染时执行其内部代码。

在这两种情况下，你都应该传递一个函数：

* `<button onClick={handleClick}>` 传递了 `handleClick` 函数。
* `<button onClick={() => alert('...')}>` 传递了 `() => alert('...')` 函数。

> [了解更多箭头函数的信息](https://zh.javascript.info/arrow-functions-basics)。

</Pitfall>

### 在事件处理函数中读取 props {/*reading-props-in-event-handlers*/}

由于事件处理函数声明于组件内部，因此它们可以直接访问组件的 props。示例中的按钮，当点击时会弹出带有 `message` prop 的 alert：

<Sandpack>

```js
function AlertButton({ message, children }) {
  return (
    <button onClick={() => alert(message)}>
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <AlertButton message="正在播放！">
        播放电影
      </AlertButton>
      <AlertButton message="正在上传！">
        上传图片
      </AlertButton>
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

此处有两个按钮，会展示不同的消息。你可以尝试更改传递给它们的消息。

### 将事件处理函数作为 props 传递 {/*passing-event-handlers-as-props*/}

通常，我们会在父组件中定义子组件的事件处理函数。比如：置于不同位置的 `Button` 组件，可能最终执行的功能也不同 —— 也许是播放电影，也许是上传图片。

为此，将组件从父组件接收的 prop 作为事件处理函数传递，如下所示：

<Sandpack>

```js
function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}

function PlayButton({ movieName }) {
  function handlePlayClick() {
    alert(`正在播放 ${movieName}！`);
  }

  return (
    <Button onClick={handlePlayClick}>
      播放 "{movieName}"
    </Button>
  );
}

function UploadButton() {
  return (
    <Button onClick={() => alert('正在上传！')}>
      上传图片
    </Button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <PlayButton movieName="魔女宅急便" />
      <UploadButton />
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

示例中，`Toolbar` 组件渲染了一个 `PlayButton` 组件和 `UploadButton` 组件：

- `PlayButton` 将 `handlePlayClick` 作为 `onClick` prop 传入 `Button` 组件内部。
- `UploadButton` 将 `() => alert('正在上传！')` 作为 `onClick` prop 传入 `Button` 组件内部。

最后，你的 `Button` 组件接收一个名为 `onClick` 的 prop。它直接将这个 prop 以 `onClick={onClick}` 方式传递给浏览器内置的 `<button>`。当点击按钮时，React 会调用传入的函数。

如果你遵循某个 [设计系统](https://uxdesign.cc/everything-you-need-to-know-about-design-systems-54b109851969) 时，按钮之类的组件通常会包含样式，但不会指定行为。而 `PlayButton` 和 `UploadButton` 之类的组件则会向下传递事件处理函数。

### 命名事件处理函数 prop {/*naming-event-handler-props*/}

内置组件（`<button>` 和 `<div>`）仅支持 [浏览器事件名称](/reference/react-dom/components/common#common-props)，例如 `onClick`。但是，当你构建自己的组件时，你可以按你个人喜好命名事件处理函数的 prop。

> 按照惯例，事件处理函数 props 应该以 `on` 开头，后跟一个大写字母。

例如，`Button` 组件的 `onClick` prop 本来也可以被命名为 `onSmash`：

<Sandpack>

```js
function Button({ onSmash, children }) {
  return (
    <button onClick={onSmash}>
      {children}
    </button>
  );
}

export default function App() {
  return (
    <div>
      <Button onSmash={() => alert('正在播放！')}>
        播放电影
      </Button>
      <Button onSmash={() => alert('正在上传！')}>
        上传图片
      </Button>
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

上述示例中，`<button onClick={onSmash}>` 代表浏览器内置的 `<button>`（小写）仍然需要使用 `onClick` prop，而自定义的 `Button` 组件接收到的 prop 名称可由你决定！

当你的组件支持多种交互时，你可以根据不同的应用程序命名事件处理函数 prop。例如，一个 `Toolbar` 组件接收 `onPlayMovie` 和 `onUploadImage` 两个事件处理函数：

<Sandpack>

```js
export default function App() {
  return (
    <Toolbar
      onPlayMovie={() => alert('正在播放！')}
      onUploadImage={() => alert('正在上传！')}
    />
  );
}

function Toolbar({ onPlayMovie, onUploadImage }) {
  return (
    <div>
      <Button onClick={onPlayMovie}>
        播放电影
      </Button>
      <Button onClick={onUploadImage}>
        上传图片
      </Button>
    </div>
  );
}

function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

请注意，`App` 组件并不需要知道 `Toolbar` 将会对 `onPlayMovie` 和 `onUploadImage` 做 **什么** 。上述示例是 `Toolbar` 的实现细节。其中，`Toolbar` 将它们作为 `onClick` 处理函数传递给了 `Button` 组件，其实还可以通过键盘快捷键来触发它们。根据应用程序特定的交互方式（如 `onPlayMovie`）来命名 prop ，可以让你灵活地更改以后使用它们的方式。

<Note>

确保为事件处理程序使用适当的 HTML 标签。例如，要处理点击事件，请使用 [`<button onClick={handleClick}>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/button) 而不是 `<div onClick={handleClick}>`。使用真正的浏览器 `<button>` 启用内置的浏览器行为，如键盘导航。如果你不喜欢按钮的默认浏览器样式，并且想让它看起来更像一个链接或不同的 UI 元素，你可以使用 CSS 来实现。[了解有关编写无障碍标签的更多信息](https://developer.mozilla.org/zh-CN/docs/Learn/Accessibility/HTML)。

</Note>

## 事件传播 {/*event-propagation*/}

事件处理函数还将捕获任何来自子组件的事件。通常，我们会说事件会沿着树向上“冒泡”或“传播”：它从事件发生的地方开始，然后沿着树向上传播。

下面这个 `<div>` 包含两个按钮。`<div>` 和每个按钮都有自己的 `onClick` 处理函数。你认为点击按钮时会触发哪些处理函数？

<Sandpack>

```js
export default function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('你点击了 toolbar ！');
    }}>
      <button onClick={() => alert('正在播放！')}>
        播放电影
      </button>
      <button onClick={() => alert('正在上传！')}>
        上传图片
      </button>
    </div>
  );
}
```

```css
.Toolbar {
  background: #aaa;
  padding: 5px;
}
button { margin: 5px; }
```

</Sandpack>

如果你点击任一按钮，它自身的 `onClick` 将首先执行，然后父级 `<div>` 的 `onClick` 会接着执行。因此会出现两条消息。如果你点击 toolbar 本身，将只有父级 `<div>` 的 `onClick` 会执行。

<Pitfall>

在 React 中所有事件都会传播，除了 `onScroll`，它仅适用于你附加到的 JSX 标签。

</Pitfall>

### 阻止传播 {/*stopping-propagation*/}

事件处理函数接收一个 **事件对象** 作为唯一的参数。按照惯例，它通常被称为 `e` ，代表 "event"（事件）。你可以使用此对象来读取有关事件的信息。

这个事件对象还允许你阻止传播。如果你想阻止一个事件到达父组件，你需要像下面 `Button` 组件那样调用 `e.stopPropagation()` ：

<Sandpack>

```js
function Button({ onClick, children }) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onClick();
    }}>
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('你点击了 toolbar ！');
    }}>
      <Button onClick={() => alert('正在播放！')}>
        播放电影
      </Button>
      <Button onClick={() => alert('正在上传！')}>
        上传图片
      </Button>
    </div>
  );
}
```

```css
.Toolbar {
  background: #aaa;
  padding: 5px;
}
button { margin: 5px; }
```

</Sandpack>

当你点击按钮时：

1. React 调用了传递给 `<button>` 的 `onClick` 处理函数。
2. 定义在 `Button` 中的处理函数执行了如下操作：
   * 调用 `e.stopPropagation()`，阻止事件进一步冒泡。
   * 调用 `onClick` 函数，它是从 `Toolbar` 组件传递过来的 prop。
3. 在 `Toolbar` 组件中定义的函数，显示按钮对应的 alert。
4. 由于传播被阻止，父级 `<div>` 的 `onClick` 处理函数不会执行。

由于调用了 `e.stopPropagation()`，点击按钮现在将只显示一个 alert（来自 `<button>`），而并非两个（分别来自 `<button>` 和父级 toolbar `<div>`）。点击按钮与点击周围的 toolbar 不同，因此阻止传播对这个 UI 是有意义的。

<DeepDive>

#### 捕获阶段事件 {/*capture-phase-events*/}

极少数情况下，你可能需要捕获子元素上的所有事件，**即便它们阻止了传播**。例如，你可能想对每次点击进行埋点记录，传播逻辑暂且不论。那么你可以通过在事件名称末尾添加 `Capture` 来实现这一点：

```js
<div onClickCapture={() => { /* 这会首先执行 */ }}>
  <button onClick={e => e.stopPropagation()} />
  <button onClick={e => e.stopPropagation()} />
</div>
```

每个事件分三个阶段传播：

1. 它向下传播，调用所有的 `onClickCapture` 处理函数。
2. 它执行被点击元素的 `onClick` 处理函数。 
3. 它向上传播，调用所有的 `onClick` 处理函数。

捕获事件对于路由或数据分析之类的代码很有用，但你可能不会在应用程序代码中使用它们。

</DeepDive>

### 传递处理函数作为事件传播的替代方案 {/*passing-handlers-as-alternative-to-propagation*/}

注意，此处的点击事件处理函数先执行了一行代码，**然后**调用了父组件传递的 `onClick` prop：

```js {4,5}
function Button({ onClick, children }) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onClick();
    }}>
      {children}
    </button>
  );
}
```

你也可以在调用父元素 `onClick` 函数之前，向这个处理函数添加更多代码。此模式是事件传播的另一种 **替代方案** 。它让子组件处理事件，同时也让父组件指定一些额外的行为。与事件传播不同，它并非自动。但使用这种模式的好处是你可以清楚地追踪因某个事件的触发而执行的整条代码链。

如果你依赖于事件传播，而且很难追踪哪些处理程序在执行，及其执行的原因，可以尝试这种方法。

### 阻止默认行为 {/*preventing-default-behavior*/}

某些浏览器事件具有与事件相关联的默认行为。例如，点击 `<form>` 表单内部的按钮会触发表单提交事件，默认情况下将重新加载整个页面：

<Sandpack>

```js
export default function Signup() {
  return (
    <form onSubmit={() => alert('提交表单！')}>
      <input />
      <button>发送</button>
    </form>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

你可以调用事件对象中的 `e.preventDefault()` 来阻止这种情况发生：

<Sandpack>

```js
export default function Signup() {
  return (
    <form onSubmit={e => {
      e.preventDefault();
      alert('提交表单！');
    }}>
      <input />
      <button>发送</button>
    </form>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

不要混淆 `e.stopPropagation()` 和 `e.preventDefault()`。它们都很有用，但二者并不相关：

* [`e.stopPropagation()`](https://developer.mozilla.org/docs/Web/API/Event/stopPropagation) 阻止触发绑定在外层标签上的事件处理函数。
* [`e.preventDefault()`](https://developer.mozilla.org/docs/Web/API/Event/preventDefault) 阻止少数事件的默认浏览器行为。

## 事件处理函数可以包含副作用吗？ {/*can-event-handlers-have-side-effects*/}

当然可以！事件处理函数是执行副作用的最佳位置。

与渲染函数不同，事件处理函数不需要是 [纯函数](/learn/keeping-components-pure)，因此它是用来 *更改* 某些值的绝佳位置。例如，更改输入框的值以响应键入，或者更改列表以响应按钮的触发。但是，为了更改某些信息，你首先需要某种方式存储它。在 React 中，这是通过 [state（组件的记忆）](/learn/state-a-components-memory) 来完成的。你将在下一章节了解所有相关信息。

<Recap>

* 你可以通过将函数作为 prop 传递给元素如 `<button>` 来处理事件。
* 必须传递事件处理函数，**而非函数调用！** `onClick={handleClick}` ，不是 `onClick={handleClick()}`。
* 你可以单独或者内联定义事件处理函数。
* 事件处理函数在组件内部定义，所以它们可以访问 props。
* 你可以在父组件中定义一个事件处理函数，并将其作为 prop 传递给子组件。
* 你可以根据特定于应用程序的名称定义事件处理函数的 prop。
* 事件会向上传播。通过事件的第一个参数调用 `e.stopPropagation()` 来防止这种情况。
* 事件可能具有不需要的浏览器默认行为。调用 `e.preventDefault()` 来阻止这种情况。
* 从子组件显式调用事件处理函数 prop 是事件传播的另一种优秀替代方案。

</Recap>



<Challenges>

#### 修复事件处理函数 {/*fix-an-event-handler*/}

点击此按钮理论上应该在黑白主题之间切换页面背景。然而，当你点击它时，什么也没有发生。解决这个问题。（无需担心 `handleClick` 的内部逻辑。）

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={handleClick()}>
      切换背景
    </button>
  );
}
```

</Sandpack>

<Solution>

这是由于 `<button onClick={handleClick()}>` 在渲染过程中 _调用_ 了 `handleClick` 函数，而没有将其进行 _传递_。移除 `()` 调用改为 `<button onClick={handleClick}>` 进而修复问题：

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={handleClick}>
      切换背景
    </button>
  );
}
```

</Sandpack>

或者，你可以把函数调用包裹在另一个函数内，例如 `<button onClick={() => handleClick()}>` ：

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={() => handleClick()}>
      切换背景
    </button>
  );
}
```

</Sandpack>

</Solution>

#### 关联事件 {/*wire-up-the-events*/}

`ColorSwitch` 组件渲染了一个按钮。它应该改变页面颜色。将它与从父组件接收的 `onChangeColor` 事件处理函数关联，以便在点击按钮时改变颜色。

如此操作后，你会发现点击按钮时，也会增加页面点击计数器的值。而编写父组件的同事坚持认为 `onChangeColor` 不应该使得计数器的值递增。应该如何处理？修改问题使得点击按钮 **只** 改变颜色，并且 **不** 增加计数器。

<Sandpack>

```js ColorSwitch.js active
export default function ColorSwitch({
  onChangeColor
}) {
  return (
    <button>
      改变颜色
    </button>
  );
}
```

```js App.js hidden
import { useState } from 'react';
import ColorSwitch from './ColorSwitch.js';

export default function App() {
  const [clicks, setClicks] = useState(0);

  function handleClickOutside() {
    setClicks(c => c + 1);
  }

  function getRandomLightColor() {
    let r = 150 + Math.round(100 * Math.random());
    let g = 150 + Math.round(100 * Math.random());
    let b = 150 + Math.round(100 * Math.random());
    return `rgb(${r}, ${g}, ${b})`;
  }

  function handleChangeColor() {
    let bodyStyle = document.body.style;
    bodyStyle.backgroundColor = getRandomLightColor();
  }

  return (
    <div style={{ width: '100%', height: '100%' }} onClick={handleClickOutside}>
      <ColorSwitch onChangeColor={handleChangeColor} />
      <br />
      <br />
      <h2>页面点击次数：{clicks}</h2>
    </div>
  );
}
```

</Sandpack>

<Solution>

首先，你需要添加事件处理函数，例如 `<button onClick={onChangeColor}>`。

然而，同时又引入了计数器递增的问题。正如你的同事所坚持的那样，`onChangeColor` 并不符合预期，这主要是因为事件发生向上传播，并且上层的某些事件处理函数执行了递增操作。为了解决这个问题，你需要阻止事件冒泡。但是不要忘记调用 `onChangeColor`。

<Sandpack>

```js ColorSwitch.js active
export default function ColorSwitch({
  onChangeColor
}) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onChangeColor();
    }}>
      改变颜色
    </button>
  );
}
```

```js App.js hidden
import { useState } from 'react';
import ColorSwitch from './ColorSwitch.js';

export default function App() {
  const [clicks, setClicks] = useState(0);

  function handleClickOutside() {
    setClicks(c => c + 1);
  }

  function getRandomLightColor() {
    let r = 150 + Math.round(100 * Math.random());
    let g = 150 + Math.round(100 * Math.random());
    let b = 150 + Math.round(100 * Math.random());
    return `rgb(${r}, ${g}, ${b})`;
  }

  function handleChangeColor() {
    let bodyStyle = document.body.style;
    bodyStyle.backgroundColor = getRandomLightColor();
  }

  return (
    <div style={{ width: '100%', height: '100%' }} onClick={handleClickOutside}>
      <ColorSwitch onChangeColor={handleChangeColor} />
      <br />
      <br />
      <h2>页面点击次数：{clicks}</h2>
    </div>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
