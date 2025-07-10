---
title: forwardRef
---

<Deprecated>

In React 19, `forwardRef` is no longer necessary. Pass `ref` as a prop instead.

`forwardRef` will be deprecated in a future release. Learn more [here](/blog/2024/04/25/react-19#ref-as-a-prop).

</Deprecated>

<Intro>

`forwardRef` 允许组件使用 [ref](/learn/manipulating-the-dom-with-refs) 将 DOM 节点暴露给父组件。

```js
const SomeComponent = forwardRef(render)
```

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `forwardRef(render)` {/*forwardref*/}

使用 `forwardRef()` 让组件接收 ref 并将其传递给子组件：

```js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  // ...
});
```

[请参阅下方更多示例](#usage)。

#### 参数 {/*parameters*/}

* `render`：组件的渲染函数。React 会调用该函数并传入父组件传递的 props 和 `ref`。返回的 JSX 将作为组件的输出。

#### 返回值 {/*returns*/}

`forwardRef` 返回一个可以在 JSX 中渲染的 React 组件。与作为纯函数定义的 React 组件不同，`forwardRef` 返回的组件还能够接收 `ref` 属性。

#### 警告 {/*caveats*/}

* 在严格模式中，为了 [帮助找到意外的副作用](/reference/react/useState#my-initializer-or-updater-function-runs-twice)，React 将会 **调用两次渲染函数**。不过这仅限于开发环境，并不会影响生产环境。如果渲染函数是纯函数（也应该是），这不应该影响组件逻辑。其中一个调用的结果将被忽略。


---

### `render` 函数 {/*render-function*/}

`forwardRef` 接受一个渲染函数作为参数。React 将会使用 `props` 和 `ref` 调用此函数：

```js
const MyInput = forwardRef(function MyInput(props, ref) {
  return (
    <label>
      {props.label}
      <input ref={ref} />
    </label>
  );
});
```

#### 参数 {/*render-parameters*/}

* `props`：父组件传递过来的 props。

* `ref`：父组件传递的 `ref` 属性。`ref` 可以是一个对象或函数。如果父组件没有传递一个 ref，那么它将会是 `null`。你应该将接收到的 `ref` 转发给另一个组件，或者将其传递给 [`useImperativeHandle`](/reference/react/useImperativeHandle)。

#### 返回值 {/*render-returns*/}

`forwardRef` 返回一个可以在 JSX 中渲染的 React 组件。与作为纯函数定义的 React 组件不同，`forwardRef` 返回的组件还能够接收 `ref` 属性。

---

## 用法 {/*usage*/}

### 将 DOM 节点暴露给父组件 {/*exposing-a-dom-node-to-the-parent-component*/}

默认情况下，每个组件的 DOM 节点都是私有的。然而，有时候将 DOM 节点公开给父组件是很有用的，比如允许对它进行聚焦。将组件定义包装在 `forwardRef()` 中便可以公开 DOM 节点：

```js {3,11}
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} />
    </label>
  );
});
```

你将在 props 之后收到一个 <CodeStep step={1}>ref</CodeStep> 作为第二个参数。将其传递到要公开的 DOM 节点中：

```js {8} [[1, 3, "ref"], [1, 8, "ref", 30]]
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});
```

这样，父级的 `Form` 组件就能够访问 `MyInput` 暴露的 <CodeStep step={2}>`<input>` DOM 节点</CodeStep>：

```js [[1, 2, "ref"], [1, 10, "ref", 41], [2, 5, "ref.current"]]
function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <MyInput label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        编辑
      </button>
    </form>
  );
}
```

该 `Form` 组件 [将 ref 传递至](/reference/react/useRef#manipulating-the-dom-with-a-ref) `MyInput`。`MyInput` 组件将该 ref **转发** 至 `<input>` 浏览器标签。因此，`Form` 组件可以访问该 `<input>` DOM 节点并对其调用 [`focus()`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/focus)。

请记住，将组件内部的 ref 暴露给 DOM 节点会使得在稍后更改组件内部更加困难。通常会暴露可重用的低级组件的 DOM 节点，例如按钮或文本输入框，但不会在应用程序级别的组件中这样做，例如头像或评论。

<Recipes titleText="转发 ref 的示例">

#### 聚焦文本输入框 {/*focusing-a-text-input*/}

点击该按钮将聚焦输入框。`Form` 组件定义了一个 ref 并将其传递到 `MyInput` 组件。`MyInput` 组件将该 ref 转发至浏览器的 `<input>` 标签，这使得 `Form` 组件可以聚焦该 `<input>`。

<Sandpack>

```js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <MyInput label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js src/MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});

export default MyInput;
```

```css
input {
  margin: 5px;
}
```

</Sandpack>

<Solution />

#### 播放和暂停视频 {/*playing-and-pausing-a-video*/}

点击按钮将调用 `<video>` DOM 节点上的 [`play()`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLMediaElement/play) 和 [`pause()`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLMediaElement/pause) 方法。`App` 组件定义了一个 ref 并将其传递到 `MyVideoPlayer` 组件。`MyVideoPlayer` 组件将该 ref 转发到浏览器的 `<video>` 标签。这使得 `App` 组件可以播放和暂停 `<video>`。

<Sandpack>

```js
import { useRef } from 'react';
import MyVideoPlayer from './MyVideoPlayer.js';

export default function App() {
  const ref = useRef(null);
  return (
    <>
      <button onClick={() => ref.current.play()}>
        Play
      </button>
      <button onClick={() => ref.current.pause()}>
        Pause
      </button>
      <br />
      <MyVideoPlayer
        ref={ref}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
        type="video/mp4"
        width="250"
      />
    </>
  );
}
```

```js src/MyVideoPlayer.js
import { forwardRef } from 'react';

const VideoPlayer = forwardRef(function VideoPlayer({ src, type, width }, ref) {
  return (
    <video width={width} ref={ref}>
      <source
        src={src}
        type={type}
      />
    </video>
  );
});

export default VideoPlayer;
```

```css
button { margin-bottom: 10px; margin-right: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### 在多个组件中转发 ref {/*forwarding-a-ref-through-multiple-components*/}

除了将 `ref` 转发到 DOM 节点外，还可以将其转发到自定义组件，例如 `MyInput` 组件：

```js {1,5}
const FormField = forwardRef(function FormField(props, ref) {
  // ...
  return (
    <>
      <MyInput ref={ref} />
      ...
    </>
  );
});
```

如果 `MyInput` 组件将 ref 转发给它的 `<input>`，那么 `FormField` 的 ref 将会获得该 `<input>`：

```js {2,5,10}
function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <FormField label="Enter your name:" ref={ref} isRequired={true} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

`Form` 组件定义了一个 ref 并将其传递给 `FormField`。`FormField` 组件将该 ref 转发给 `MyInput`，后者又将其转发给浏览器的 `<input>` DOM 节点。这就是 `Form` 获取该 DOM 节点的方式。


<Sandpack>

```js
import { useRef } from 'react';
import FormField from './FormField.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <FormField label="输入你的名字：" ref={ref} isRequired={true} />
      <button type="button" onClick={handleClick}>
        编辑
      </button>
    </form>
  );
}
```

```js src/FormField.js
import { forwardRef, useState } from 'react';
import MyInput from './MyInput.js';

const FormField = forwardRef(function FormField({ label, isRequired }, ref) {
  const [value, setValue] = useState('');
  return (
    <>
      <MyInput
        ref={ref}
        label={label}
        value={value}
        onChange={e => setValue(e.target.value)} 
      />
      {(isRequired && value === '') &&
        <i>必填</i>
      }
    </>
  );
});

export default FormField;
```


```js src/MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef((props, ref) => {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});

export default MyInput;
```

```css
input, button {
  margin: 5px;
}
```

</Sandpack>

---

### 暴露命令式句柄而非 DOM 节点 {/*exposing-an-imperative-handle-instead-of-a-dom-node*/}

可以使用被称为 **命令式句柄（imperative handle）** 的自定义对象暴露一个更加受限制的方法集，而非整个 DOM 节点。为了实现这个目的需要定义一个单独的 ref 存储 DOM 节点：

```js {2,6}
const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  // ...

  return <input {...props} ref={inputRef} />;
});
```

将收到的 `ref` 传递给 [`useImperativeHandle`](/reference/react/useImperativeHandle) 并指定你想要暴露给 `ref` 的值：

```js {6-15}
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});
```

如果某个组件得到了 `MyInput` 的 ref，则只会接收到 `{ focus, scrollIntoView }` 对象，而非整个 DOM 节点。这可以让 DOM 节点暴露的信息限制到最小。

<Sandpack>

```js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
    // 这行代码不起作用，因为 DOM 节点没有被暴露出来：
    // ref.current.style.opacity = 0.5;
  }

  return (
    <form>
      <MyInput placeholder="Enter your name" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js src/MyInput.js
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});

export default MyInput;
```

```css
input {
  margin: 5px;
}
```

</Sandpack>

[了解更多关于命令式句柄的内容](/reference/react/useImperativeHandle)。

<Pitfall>

**不要滥用 ref**。只应在无法使用 props 表达的 **命令式** 行为中使用 ref：例如滚动到节点、将焦点放在节点上、触发动画，以及选择文本等等。


**如果可以将某些东西使用 props 表达，那就不应该使用 ref**。例如，不要从一个 Modal 组件中暴露像 `{ open, close }` 一样的命令式句柄，更好的做法是将 `isOpen` 作为 prop，像这样 `<Modal isOpen={isOpen} />`。[Effect](/learn/synchronizing-with-effects) 可以帮助通过 props 暴露命令式行为。
</Pitfall>

---

## 疑难解答 {/*troubleshooting*/}

### 我的组件使用了 `forwardRef`，但是它的 `ref` 总是为 `null` {/*my-component-is-wrapped-in-forwardref-but-the-ref-to-it-is-always-null*/}

这通常意味着你忘记实际使用你所接收到的 `ref` 了。

例如，这个组件的 `ref` 没有被使用：

```js {1}
const MyInput = forwardRef(function MyInput({ label }, ref) {
  return (
    <label>
      {label}
      <input />
    </label>
  );
});
```

为了修复它，将 `ref` 传递给一个可以接受 `ref` 的 DOM 节点或另一个组件：

```js {1,5}
const MyInput = forwardRef(function MyInput({ label }, ref) {
  return (
    <label>
      {label}
      <input ref={ref} />
    </label>
  );
});
```

如果某些逻辑是有条件的，`MyInput` 的 `ref` 可能也会为 `null`。

```js {1,5}
const MyInput = forwardRef(function MyInput({ label, showInput }, ref) {
  return (
    <label>
      {label}
      {showInput && <input ref={ref} />}
    </label>
  );
});
```

如果 `showInput` 是 `false`，则 `ref` 将不会被转发到任何节点，并且 `MyInput` 的 `ref` 会保持为空。如果这个条件隐藏在另一个组件中，那么很容易忽略这一点，比如这个例子中的 `Panel`：

```js {5,7}
const MyInput = forwardRef(function MyInput({ label, showInput }, ref) {
  return (
    <label>
      {label}
      <Panel isExpanded={showInput}>
        <input ref={ref} />
      </Panel>
    </label>
  );
});
```
