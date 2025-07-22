---
title: memo
---

<Intro>

`memo` 允许你的组件在 props 没有改变的情况下跳过重新渲染。

```
const MemoizedComponent = memo(SomeComponent, arePropsEqual?)
```

</Intro>

<Note>

[React Compiler](/learn/react-compiler) automatically applies the equivalent of `memo` to all components, reducing the need for manual memoization. You can use the compiler to handle component memoization automatically.

</Note>

<InlineToc />

---

## 参考 {/*reference*/}

### `memo(Component, arePropsEqual?)` {/*memo*/}

使用 `memo` 将组件包装起来，以获得该组件的一个 **记忆化** 版本。通常情况下，只要该组件的 props 没有改变，这个记忆化版本就不会在其父组件重新渲染时重新渲染。但 React 仍可能会重新渲染它：记忆化是一种性能优化，而非保证。

```js
import { memo } from 'react';

const SomeComponent = memo(function SomeComponent(props) {
  // ...
});
```

[请看下面的更多例子。](#usage)

#### 参数 {/*parameters*/}

* `Component`：要进行记忆化的组件。`memo` 不会修改该组件，而是返回一个新的、记忆化的组件。它接受任何有效的 React 组件，包括函数组件和 [`forwardRef`](/reference/react/forwardRef) 组件。

* **可选参数** `arePropsEqual`：一个函数，接受两个参数：组件的前一个 props 和新的 props。如果旧的和新的 props 相等，即组件使用新的 props 渲染的输出和表现与旧的 props 完全相同，则它应该返回 `true`。否则返回 `false`。通常情况下，你不需要指定此函数。默认情况下，React 将使用 [`Object.is`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 比较每个 prop。

#### 返回值 {/*returns*/}

`memo` 返回一个新的 React 组件。它的行为与提供给 `memo` 的组件相同，只是当它的父组件重新渲染时 React 不会总是重新渲染它，除非它的 props 发生了变化。

---

## 用法 {/*usage*/}

### 当 props 没有改变时跳过重新渲染 {/*skipping-re-rendering-when-props-are-unchanged*/}

React 通常在其父组件重新渲染时重新渲染一个组件。你可以使用 `memo` 创建一个组件，当它的父组件重新渲染时，只要它的新 props 与旧 props 相同时，React 就不会重新渲染它。这样的组件被称为 **记忆化的**（memoized）组件。

要记忆化一个组件，请将它包装在 `memo` 中，使用它返回的值替换原来的组件：

```js
const Greeting = memo(function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
});

export default Greeting;
```

React 组件应该始终具有 [纯粹的渲染逻辑](/learn/keeping-components-pure)。这意味着如果其 props、state 和 context 没有改变，则必须返回相同的输出。通过使用 `memo`，你告诉 React 你的组件符合此要求，因此只要其 props 没有改变，React 就不需要重新渲染。即使使用 `memo`，如果它自己的 state 或正在使用的 context 发生更改，组件也会重新渲染。

在此示例中，请注意 `Greeting` 组件在 `name` 更改时重新渲染（因为那是它的 props 之一），但是在 `address` 更改时不会重新渲染（因为它不作为 props 传递给 `Greeting`）：

<Sandpack>

```js
import { memo, useState } from 'react';

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting was rendered at", new Date().toLocaleTimeString());
  return <h3>Hello{name && ', '}{name}!</h3>;
});
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

<Note>

**你应该只将 `memo` 用作为性能优化**。如果你的代码没有 `memo` 就无法运行，首先找出潜在问题并进行修复。然后，你可以通过添加 `memo` 来提高性能。

</Note>

<DeepDive>

#### 在每个地方都应该添加 memo 吗？ {/*should-you-add-memo-everywhere*/}

如果你的应用像此站点一样，大多数交互是粗略的（例如直接替换页面或整个部分），那么通常不需要记忆化。另一方面，如果你的应用更像是绘图编辑器，大多数交互是细粒度的（例如移动图形），那么你可能会发现记忆化非常有用。

只有当你的组件经常使用完全相同的 props 重新渲染时，并且其重新渲染逻辑是非常昂贵的，使用 `memo` 优化才有价值。如果你的组件重新渲染时没有明显的延迟，那么 `memo` 就不必要了。请记住，如果传递给组件的 props **始终不同**，例如在渲染期间传递对象或普通函数，则 `memo` 是完全无用的。这就是为什么你通常需要在 `memo` 中同时使用 [`useMemo`](/reference/react/useMemo#skipping-re-rendering-of-components) 和 [`useCallback`](/reference/react/useCallback#skipping-re-rendering-of-components)。

在其他情况下将组件包装在 `memo` 中是没有任何好处的。这种做法也没有什么明显的危害，因此一些团队会选择不考虑个别情况，并尽可能使用 `memo`。这种方法的缺点是代码变得不易读。此外，并不是所有的记忆化都是有效的：一个“总是新的”值足以破坏整个组件的记忆化。

**实践中，你可以通过遵循一些原则来使许多 memoization 变得不必要**：

1. 当一个组件在视觉上包裹其他组件时，让它 [接受 JSX 作为子组件](/learn/passing-props-to-a-component#passing-jsx-as-children)。这样，当包装组件更新其自身状态时，React 知道其子组件不需要重新渲染。
1. 优先使用局部状态，并且不要将 [状态提升](/learn/sharing-state-between-components) 到不必要的层级。例如，不要将短暂状态（如表单数据和项元素是否 hover 状态）保留在树的顶部或全局状态库中。
1. 保持你的 [渲染逻辑纯粹](/learn/keeping-components-pure)。如果重新渲染组件会导致问题或产生一些明显的视觉瑕疵，则这是你组件中的 bug！修复 bug 而不是添加 memoization。
1. 避免 [不必要的 Effect 来更新状态](/learn/you-might-not-need-an-effect)。React 应用中的大多数性能问题都是由于 Effect 引起的更新链，这些 Effect 会使你的组件一次又一次地重新渲染。
1. 尝试 [从你的 Effect 中删除不必要的依赖项](/learn/removing-effect-dependencies)。例如，与其使用 memoization，不如将某些对象或函数移动到 Effect 内部或组件外部，这通常更简单。

如果特定交互仍然感觉不流畅，请 [使用 React 开发者工具 profiler](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html) 来查看哪些组件最需要 memoization，并在需要时添加 memoization。这些原则使你的组件更易于调试和理解，因此建议在任何情况下都遵循它们。从长远来看，我们正在研究 [自动进行细粒度 memoization](https://www.youtube.com/watch?v=lGEMwh32soc)，以解决这个问题。

</DeepDive>

---

### 使用 state 更新记忆化（memoized）组件 {/*updating-a-memoized-component-using-state*/}

即使一个组件被记忆化了，当它自身的状态发生变化时，它仍然会重新渲染。memoization 只与从父组件传递给组件的 props 有关。

<Sandpack>

```js
import { memo, useState } from 'react';

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log('Greeting was rendered at', new Date().toLocaleTimeString());
  const [greeting, setGreeting] = useState('Hello');
  return (
    <>
      <h3>{greeting}{name && ', '}{name}!</h3>
      <GreetingSelector value={greeting} onChange={setGreeting} />
    </>
  );
});

function GreetingSelector({ value, onChange }) {
  return (
    <>
      <label>
        <input
          type="radio"
          checked={value === 'Hello'}
          onChange={e => onChange('Hello')}
        />
        Regular greeting
      </label>
      <label>
        <input
          type="radio"
          checked={value === 'Hello and welcome'}
          onChange={e => onChange('Hello and welcome')}
        />
        Enthusiastic greeting
      </label>
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

如果将 state 变量设置为其当前值，即使没有使用 `memo`，React 也会跳过重新渲染组件。你仍然可能会看到额外地调用组件函数，但其结果将被丢弃。

---

### 使用 context 更新记忆化（memoized）组件 {/*updating-a-memoized-component-using-a-context*/}

即使组件已被记忆化，当其使用的 context 发生变化时，它仍将重新渲染。记忆化只与从父组件传递给组件的 props 有关。

<Sandpack>

```js
import { createContext, memo, useContext, useState } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('dark');

  function handleClick() {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }

  return (
    <ThemeContext value={theme}>
      <button onClick={handleClick}>
        Switch theme
      </button>
      <Greeting name="Taylor" />
    </ThemeContext>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting was rendered at", new Date().toLocaleTimeString());
  const theme = useContext(ThemeContext);
  return (
    <h3 className={theme}>Hello, {name}!</h3>
  );
});
```

```css
label {
  display: block;
  margin-bottom: 16px;
}

.light {
  color: black;
  background-color: white;
}

.dark {
  color: white;
  background-color: black;
}
```

</Sandpack>

为了使组件仅在 context 的 **某个部分** 发生更改时重新渲染，请将组件分为两个部分。在外层组件中从 context 中读取所需内容，并将其作为 props 传递给记忆化的子组件。

---

### 最小化 props 的变化 {/*minimizing-props-changes*/}

当你使用 `memo` 时，只要任何一个 prop 与先前的值不是 **浅层相等** 的话，你的组件就会重新渲染。这意味着 React 会使用 [`Object.is`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 比较组件中的每个 prop 与其先前的值。注意，`Object.is(3, 3)` 为 `true`，但 `Object.is({}, {})` 为 `false`。


为了最大化使用 `memo` 的效果，应该尽量减少 props 的变化次数。例如，如果 props 是一个对象，可以使用 [`useMemo`](/reference/react/useMemo) 避免父组件每次都重新创建该对象：

```js {5-8}
function Page() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  const person = useMemo(
    () => ({ name, age }),
    [name, age]
  );

  return <Profile person={person} />;
}

const Profile = memo(function Profile({ person }) {
  // ...
});
```

最小化 props 的改变的更好的方法是确保组件在其 props 中接受必要的最小信息。例如，它可以接受单独的值而不是整个对象：

```js {4,7}
function Page() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);
  return <Profile name={name} age={age} />;
}

const Profile = memo(function Profile({ name, age }) {
  // ...
});
```

即使是单个值有时也可以投射为不经常变更的值。例如，这里的组件接受一个布尔值，表示是否存在某个值，而不是值本身：

```js {3}
function GroupsLanding({ person }) {
  const hasGroups = person.groups !== null;
  return <CallToAction hasGroups={hasGroups} />;
}

const CallToAction = memo(function CallToAction({ hasGroups }) {
  // ...
});
```

当你需要将一个函数传递给记忆化（memoized）组件时，要么在组件外声明它，以确保它永远不会改变，要么使用 [`useCallback`](/reference/react/useCallback#skipping-re-rendering-of-components) 在重新渲染之间缓存其定义。

---

### 指定自定义比较函数 {/*specifying-a-custom-comparison-function*/}

在极少数情况下，最小化 memoized 组件的 props 更改可能是不可行的。在这种情况下，你可以提供一个自定义比较函数，React 将使用它来比较旧的和新的 props，而不是使用浅比较。这个函数作为 `memo` 的第二个参数传递。它应该仅在新的 props 与旧的 props 具有相同的输出时返回 `true`；否则应该返回 `false`。

```js {3}
const Chart = memo(function Chart({ dataPoints }) {
  // ...
}, arePropsEqual);

function arePropsEqual(oldProps, newProps) {
  return (
    oldProps.dataPoints.length === newProps.dataPoints.length &&
    oldProps.dataPoints.every((oldPoint, index) => {
      const newPoint = newProps.dataPoints[index];
      return oldPoint.x === newPoint.x && oldPoint.y === newPoint.y;
    })
  );
}
```

如果这样做，请使用浏览器开发者工具中的性能面板来确保你的比较函数实际上比重新渲染组件要快。你可能会因此感到惊讶。

在进行性能测量时，请确保 React 处于生产模式下运行。

<Pitfall>

如果你提供了一个自定义的 `arePropsEqual` 实现，**你必须比较每个 prop，包括函数**。函数通常 [闭包](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Closures) 了父组件的 props 和 state。如果你在 `oldProps.onClick !== newProps.onClick` 时返回 `true`，你的组件将在其 `onClick` 处理函数中继续“看到”来自先前渲染的 props 和 state，导致非常令人困惑的 bug。

避免在 `arePropsEqual` 中进行深比较，除非你 100％ 确定你正在处理的数据结构具有已知有限的深度。**深比较可能会变得非常缓慢**，并且如果有人稍后更改数据结构，这可能会卡住你的应用数秒钟。

</Pitfall>

---

### Do I still need React.memo if I use React Compiler? {/*react-compiler-memo*/}

When you enable [React Compiler](/learn/react-compiler), you typically don't need `React.memo` anymore. The compiler automatically optimizes component re-rendering for you.

Here's how it works:

**Without React Compiler**, you need `React.memo` to prevent unnecessary re-renders:

```js
// Parent re-renders every second
function Parent() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <h1>Seconds: {seconds}</h1>
      <ExpensiveChild name="John" />
    </>
  );
}

// Without memo, this re-renders every second even though props don't change
const ExpensiveChild = memo(function ExpensiveChild({ name }) {
  console.log('ExpensiveChild rendered');
  return <div>Hello, {name}!</div>;
});
```

**With React Compiler enabled**, the same optimization happens automatically:

```js
// No memo needed - compiler prevents re-renders automatically
function ExpensiveChild({ name }) {
  console.log('ExpensiveChild rendered');
  return <div>Hello, {name}!</div>;
}
```

Here's the key part of what the React Compiler generates:

```js {6-12}
function Parent() {
  const $ = _c(7);
  const [seconds, setSeconds] = useState(0);
  // ... other code ...

  let t3;
  if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
    t3 = <ExpensiveChild name="John" />;
    $[4] = t3;
  } else {
    t3 = $[4];
  }
  // ... return statement ...
}
```

Notice the highlighted lines: The compiler wraps `<ExpensiveChild name="John" />` in a cache check. Since the `name` prop is always `"John"`, this JSX is created once and reused on every parent re-render. This is exactly what `React.memo` does - it prevents the child from re-rendering when its props haven't changed.

The React Compiler automatically:
1. Tracks that the `name` prop passed to `ExpensiveChild` hasn't changed
2. Reuses the previously created JSX for `<ExpensiveChild name="John" />`
3. Skips re-rendering `ExpensiveChild` entirely

This means **you can safely remove `React.memo` from your components when using React Compiler**. The compiler provides the same optimization automatically, making your code cleaner and easier to maintain.

<Note>

The compiler's optimization is actually more comprehensive than `React.memo`. It also memoizes intermediate values and expensive computations within your components, similar to combining `React.memo` with `useMemo` throughout your component tree.

</Note>

---

## 疑难解答 {/*troubleshooting*/}
### 当组件的某个 prop 是对象、数组或函数时，我的组件会重新渲染。 {/*my-component-rerenders-when-a-prop-is-an-object-or-array*/}

React 通过浅比较来比较旧的和新的 prop：也就是说，它会考虑每个新的 prop 是否与旧 prop 引用相等。如果每次父组件重新渲染时创建一个新的对象或数组，即使它们每个元素都相同，React 仍会认为它已更改。同样地，如果在渲染父组件时创建一个新的函数，即使该函数具有相同的定义，React 也会认为它已更改。为了避免这种情况，[可以简化 props 或在父组件中记忆化（memoize）props](#minimizing-props-changes)。
