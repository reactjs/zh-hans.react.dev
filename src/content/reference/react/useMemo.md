---
title: useMemo
---

<Intro>

`useMemo` 是一个 React Hook，它在每次重新渲染的时候能够缓存计算的结果。

```js
const cachedValue = useMemo(calculateValue, dependencies)
```

</Intro>

<Note>

[React Compiler](/learn/react-compiler) 会自动对值和函数进行记忆化处理，从而减少手动调用 `useMemo` 的需求。你可以使用编译器自动处理记忆化。

</Note>

<InlineToc />

---

## 参考 {/*reference*/}

### `useMemo(calculateValue, dependencies)` {/*usememo*/}

在组件的顶层调用 `useMemo` 来缓存每次重新渲染都需要计算的结果。

```js
import { useMemo } from 'react';

function TodoList({ todos, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  // ...
}
```

[参见下面更多示例](#usage)。

#### 参数 {/*parameters*/}

* `calculateValue`：要缓存计算值的函数。它应该是一个没有任何参数的纯函数，并且可以返回任意类型。React 将会在首次渲染时调用该函数；在之后的渲染中，如果 `dependencies` 没有发生变化，React 将直接返回相同值。否则，将会再次调用 `calculateValue` 并返回最新结果，然后缓存该结果以便下次重复使用。

* `dependencies`：所有在 `calculateValue` 函数中使用的响应式变量组成的数组。响应式变量包括 props、state 和所有你直接在组件中定义的变量和函数。如果你在代码检查工具中 [配置了 React](/learn/editor-setup#linting)，它将会确保每一个响应式数据都被正确地定义为依赖项。依赖项数组的长度必须是固定的并且必须写成 `[dep1, dep2, dep3]` 这种形式。React 使用 [`Object.is`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 将每个依赖项与其之前的值进行比较。

#### 返回值 {/*returns*/}

在初次渲染时，`useMemo` 返回不带参数调用 `calculateValue` 的结果。

在接下来的渲染中，如果依赖项没有发生改变，它将返回上次缓存的值；否则将再次调用 `calculateValue`，并返回最新结果。

#### 注意 {/*caveats*/}

* `useMemo` 是一个 React Hook，所以你只能 **在组件的顶层** 或者自定义 Hook 中调用它。你不能在循环语句或条件语句中调用它。如有需要，将其提取为一个新组件并使用 state。
* 在严格模式下，为了 [帮你发现意外的错误](#my-calculation-runs-twice-on-every-re-render)，React 将会 **调用你的计算函数两次**。这只是一个开发环境下的行为，并不会影响到生产环境。如果计算函数是一个纯函数（它本来就应该是），这将不会影响到代码逻辑。其中一次的调用结果将被忽略。
* 除非有特定原因，React **不会丢弃缓存值**。例如，在开发过程中，React 会在你编辑组件文件时丢弃缓存。无论是在开发环境还是在生产环境，如果你的组件在初始挂载期间被终止，React 都会丢弃缓存。在未来，React 可能会添加更多利用丢弃缓存的特性——例如，如果 React 在未来增加了对虚拟化列表的内置支持，那么丢弃那些滚出虚拟化列表视口的缓存是有意义的。你可以仅仅依赖 `useMemo` 作为性能优化手段。否则，使用 [state 变量](/reference/react/useState#avoiding-recreating-the-initial-state) 或者 [ref](/reference/react/useRef#avoiding-recreating-the-ref-contents) 可能更加合适。

<Note>

这种缓存返回值的方式也叫做 [记忆化（memoization）](https://en.wikipedia.org/wiki/Memoization)，这也是该 Hook 叫做 `useMemo` 的原因。

</Note>

---

## 用法 {/*usage*/}

### 跳过代价昂贵的重新计算 {/*skipping-expensive-recalculations*/}

在组件顶层调用 `useMemo` 以在重新渲染之间缓存计算结果：

```js [[3, 4, "visibleTodos"], [1, 4, "() => filterTodos(todos, tab)"], [2, 4, "[todos, tab]"]]
import { useMemo } from 'react';

function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

你需要给 `useMemo` 传递两样东西：

1. 一个没有任何参数的 <CodeStep step={1}>calculation 函数</CodeStep>，像这样 `() =>`，并且返回任何你想要的计算结果。
2. 一个由包含在你的组件中并在 calculation 中使用的所有值组成的 <CodeStep step={2}>依赖列表</CodeStep>。

在初次渲染时，你从 `useMemo` 得到的 <CodeStep step={3}>值</CodeStep> 将会是你的 <CodeStep step={1}>calculation</CodeStep> 函数执行的结果。

在随后的每一次渲染中，React 将会比较前后两次渲染中的 <CodeStep step={2}>所有依赖项</CodeStep> 是否相同。如果通过 [`Object.is`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 比较所有依赖项都没有发生变化，那么 `useMemo` 将会返回之前已经计算过的那个值。否则，React 将会重新执行 calculation 函数并且返回一个新的值。

换言之，`useMemo` 在多次重新渲染中缓存了 calculation 函数计算的结果直到依赖项的值发生变化。

**让我们通过一个示例来看看这在什么情况下是有用的**。

默认情况下，React 会在每次重新渲染时重新运行整个组件。例如，如果 `TodoList` 更新了 state 或从父组件接收到新的 props，`filterTodos` 函数将会重新运行：

```js {2}
function TodoList({ todos, tab, theme }) {
  const visibleTodos = filterTodos(todos, tab);
  // ...
}
```

如果计算速度很快，这将不会产生问题。但是，当正在过滤转换一个大型数组，或者进行一些昂贵的计算，而数据没有改变，那么可能希望跳过这些重复计算。如果 `todos` 与 `tab` 都与上次渲染时相同，那么像之前那样将计算函数包装在 `useMemo` 中，便可以重用已经计算过的 `visibleTodos`。

这种缓存行为叫做 [记忆化](https://en.wikipedia.org/wiki/Memoization)。

<Note>

**你应该仅仅把 `useMemo` 作为性能优化的手段**。如果没有它，你的代码就不能正常工作，那么请先找到潜在的问题并修复它。然后再添加 `useMemo` 以提高性能。

</Note>

<DeepDive>

#### 如何衡量计算过程的开销是否昂贵？ {/*how-to-tell-if-a-calculation-is-expensive*/}

一般来说，除非要创建或循环遍历数千个对象，否则开销可能并不大。如果你想获得更详细的信息，可以在控制台来测量花费这上面的时间：

```js {1,3}
console.time('filter array');
const visibleTodos = filterTodos(todos, tab);
console.timeEnd('filter array');
```

然后执行你正在监测的交互（例如，在输入框中输入文字）。你将会在控制台看到如下的日志 `filter array: 0.15ms`。如果全部记录的时间加起来很长（`1ms` 或者更多），那么记忆此计算结果是有意义的。作为对比，你可以将计算过程包裹在 `useMemo` 中，以验证该交互的总日志时间是否减少了：

```js
console.time('filter array');
const visibleTodos = useMemo(() => {
  return filterTodos(todos, tab); // 如果 todos 和 tab 都没有变化，那么将会跳过渲染。
}, [todos, tab]);
console.timeEnd('filter array');
```

`useMemo` 不会让首次渲染更快，它只会帮助你跳过不必要的更新工作。

请记住，你的开发设备可能比用户的设备性能更强大，因此最好人为降低当前浏览器性能来测试。例如，Chrome 提供了 [CPU Throttling](https://developer.chrome.com/blog/new-in-devtools-61/#throttling) 选项来降低浏览器性能。

另外，请注意，在开发环境中测量性能无法为你提供最准确的结果（例如，当开启 [严格模式](/reference/react/StrictMode) 时，你会看到每个组件渲染两次而不是一次）。要获得最准确的时间，请构建用于生产的应用程序并在用户使用的设备上对其进行测试。

</DeepDive>

<DeepDive>

#### 你应该在所有地方添加 useMemo 吗？ {/*should-you-add-usememo-everywhere*/}

如果你的应用程序类似于此站点，并且大多数交互都很粗糙（例如替换页面或整个章节），则通常不需要使用记忆化。反之，如果你的应用程序更像是绘图编辑器，并且大多数交互都是颗粒状的（如移动形状），那么你可能会发现记忆化非常有用。

使用 `useMemo` 进行优化仅在少数情况下有价值：

- 你在 `useMemo` 中进行的计算明显很慢，而且它的依赖关系很少改变。
- 将计算结果作为 props 传递给包裹在 [`memo`](/reference/react/memo) 中的组件。当计算结果没有改变时，你会想跳过重新渲染。记忆化让组件仅在依赖项不同时才重新渲染。
- 你传递的值稍后用作某些 Hook 的依赖项。例如，也许另一个 `useMemo` 计算值依赖它，或者 [`useEffect`](/reference/react/useEffect) 依赖这个值。

在其他情况下，将计算过程包装在 `useMemo` 中没有任何好处。不过这样做也没有重大危害，所以一些团队选择不考虑具体情况，尽可能多地使用 `useMemo`。不过这种做法会降低代码可读性。此外，并不是所有 `useMemo` 的使用都是有效的：一个“永远是新的”的单一值就足以破坏整个组件的记忆化效果。

**在实践中，你可以通过遵循一些原则来避免 `useMemo` 的滥用**：

1. 当一个组件在视觉上包裹其他组件时，让它 [将 JSX 作为子组件传递](/learn/passing-props-to-a-component#passing-jsx-as-children)。这样，当包装器组件更新自己的 state 时，React 知道它的子组件不需要重新渲染。
2. 首选本地 state，非必要不进行 [状态提升](/learn/sharing-state-between-components)。例如，不要保持像表单、组件是否悬停在组件树顶部这样的瞬时状态。
3. 保持你的 [渲染逻辑纯粹](/learn/keeping-components-pure)。如果重新渲染组件会导致一些问题或产生一些明显的视觉错误，那么它就是组件中的错误！修复错误而不是使用记忆化。
4. 避免 [不必要地更新 state 的 Effect](/learn/you-might-not-need-an-effect)。React 应用程序中的大多数性能问题都是由 Effect 创造的更新链引起的，这些更新链导致组件反复重新渲染。
5. 尽力 [从 Effect 中移除不必要的依赖项](/learn/removing-effect-dependencies)。例如, 相比于记忆化，在 Effect 内部或组件外部移动某些对象或函数通常更简单。

如果某个特定的交互仍然感觉滞后，[使用 React 开发者工具分析器](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html) 查看哪些组件将从记忆化中获益最多，并在需要的地方添加记忆化。这些原则使你的组件更易于调试和理解，因此在任何情况下都应该遵循它们。从长远来看，我们正在研究 [自动进行粒度记忆](https://www.youtube.com/watch?v=lGEMwh32soc) 以一劳永逸地解决这个问题。

</DeepDive>

<Recipes titleText="使用 useMemo 和直接计算之间的区别" titleId="examples-recalculation">

#### 使用 `useMemo` 跳过重复计算 {/*skipping-recalculation-with-usememo*/}

在这个例子中，`filterTodos` 的执行被 **人为减速了**，这样就可以看到渲染期间调用的某些函数确实很慢时会发生什么。尝试切换选项卡并切换主题。

切换选项卡会感觉很慢，因为它迫使减速的 `filterTodos` 重新执行。这是预料之中的效果，因为“选项卡”已更改，因此整个计算 **需要** 重新运行。如果你好奇为什么它会运行两次，[此处](#my-calculation-runs-twice-on-every-re-render) 对此进行了解释。

然后试试切换主题。**在 `useMemo` 的帮助下，尽管已经被人为减速，但是它还是很快**！缓慢的 `filterTodos` 调用被跳过，因为 `todos` 和 `tab`（你将其作为依赖项传递给 `useMemo`）自上次渲染以来都没有改变。

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

```js src/TodoList.js active
import { useMemo } from 'react';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  return (
    <div className={theme}>
      <p><b>Note: <code>filterTodos</code> is artificially slowed down!</b></p>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('[ARTIFICIALLY SLOW] Filtering ' + todos.length + ' todos for "' + tab + '" tab.');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // 在 500 毫秒内不执行任何操作以模拟极慢的代码
  }

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

<Solution />

#### 始终重新计算 {/*always-recalculating-a-value*/}

在这个例子中，`filterTodos` 的执行也被 **人为减慢了**，这样就可以看到渲染期间调用的某些函数确实很慢时会发生什么。尝试切换选项卡并切换主题。

与前面的示例不同，现在切换主题也很慢！这是因为 **此版本没有调用 `useMemo`**，因此每次重新渲染都会调用人为减速的 `filterTodos`。即使只有 `theme` 发生了变化，它也会被调用。

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

```js src/TodoList.js active
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <ul>
        <p><b>Note: <code>filterTodos</code> is artificially slowed down!</b></p>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('[ARTIFICIALLY SLOW] Filtering ' + todos.length + ' todos for "' + tab + '" tab.');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // 在 500 毫秒内什么都不做以模拟极其缓慢的代码
  }

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

然而，这是 **删除了人为减速后** 的相同代码。此时你应该能感觉缺少 `useMemo` 后效果差异非常明显。

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

```js src/TodoList.js active
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('Filtering ' + todos.length + ' todos for "' + tab + '" tab.');

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

很多时候，没有使用记忆化的代码可以正常工作。如果你的交互速度足够快，你可能不需要记忆化。

你可以尝试增加 `utils.js` 中待办事项的数量，看看有什么变化。这个特定的计算一开始并不是很昂贵，但如果待办事项的数量显著增加，大部分开销将用于重新渲染而不是过滤。继续阅读下文，了解如何使用 `useMemo` 优化重新渲染。

<Solution />

</Recipes>

---

### 跳过组件的重新渲染 {/*skipping-re-rendering-of-components*/}

在某些情况下，`useMemo` 还可以帮助你优化重新渲染子组件的性能。为了说明这一点，假设这个 `TodoList` 组件将 `visibleTodos` 作为 props 传递给子 `List` 组件：

```js {5}
export default function TodoList({ todos, tab, theme }) {
  // ...
  return (
    <div className={theme}>
      <List items={visibleTodos} />
    </div>
  );
}
```

你已经注意到切换 `theme` 属性会使应用程序冻结片刻，但是如果你从 JSX 中删除 `<List />`，感觉会很快。这说明尝试优化 `List` 组件是值得的。

**默认情况下，当一个组件重新渲染时，React 会递归地重新渲染它的所有子组件**。这就是为什么当 `TodoList` 使用不同的 `theme` 重新渲染时，`List` 组件 **也会** 重新渲染。这对于不需要太多计算来重新渲染的组件来说很好。但是如果你已经确认重新渲染很慢，你可以通过将它包装在 [`memo`](/reference/react/memo) 中，这样当它的 props 跟上一次渲染相同的时候它就会跳过本次渲染：

```js {3,5}
import { memo } from 'react';

const List = memo(function List({ items }) {
  // ...
});
```

**通过此更改，如果 `List` 的所有 props 都与上次渲染时相同，则 `List` 将跳过重新渲染**。这就是缓存计算变得重要的地方！想象一下，你在没有 `useMemo` 的情况下计算了 `visibleTodos`：

```js {2-3,6-7}
export default function TodoList({ todos, tab, theme }) {
  // 每当主题发生变化时，这将是一个不同的数组……
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      {/* ... 所以List的props永远不会一样，每次都会重新渲染 */}
      <List items={visibleTodos} />
    </div>
  );
}
```

**在上面的示例中，`filterTodos` 函数总是创建一个不同数组**，类似于 `{}` 总是创建一个新对象的方式。通常，这不是问题，但这意味着 `List` 属性永远不会相同，并且你的 [`memo`](/reference/react/memo) 优化将不起作用。这就是 `useMemo` 派上用场的地方：

```js {2-3,5,9-10}
export default function TodoList({ todos, tab, theme }) {
  // 告诉 React 在重新渲染之间缓存你的计算结果...
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab] // ...所以只要这些依赖项不变...
  );
  return (
    <div className={theme}>
      {/* ... List 也就会接受到相同的 props 并且会跳过重新渲染 */}
      <List items={visibleTodos} />
    </div>
  );
}
```


**通过将 `visibleTodos` 的计算函数包裹在 `useMemo` 中，你可以确保它在重新渲染之间具有相同值**，直到依赖项发生变化。你 **不必** 将计算函数包裹在 `useMemo` 中，除非你出于某些特定原因这样做。在此示例中，这样做的原因是你将它传递给包裹在 [`memo`](/reference/react/memo) 中的组件，这使得它可以跳过重新渲染。添加 `useMemo` 的其他一些原因将在本页进一步描述。

<DeepDive>

#### 记忆单个 JSX 节点 {/*memoizing-individual-jsx-nodes*/}

你可以将 `<List />` JSX 节点本身包裹在 `useMemo` 中，而不是将 `List` 包裹在 [`memo`](/reference/react/memo) 中：

```js {3,6}
export default function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  const children = useMemo(() => <List items={visibleTodos} />, [visibleTodos]);
  return (
    <div className={theme}>
      {children}
    </div>
  );
}
```

他们的行为表现是一致的。如果 `visibleTodos` 没有改变，`List` 将不会重新渲染。

像 `<List items={visibleTodos} />` 这样的 JSX 节点是一个类似 `{ type: List, props: { items: visibleTodos } }` 的对象。创建这个对象的开销很低，但是 React 不知道它的内容是否和上次一样。这就是为什么默认情况下，React 会重新渲染 `List` 组件。

但是，如果 React 发现其与之前渲染的 JSX 是完全相同的，它不会尝试重新渲染你的组件。这是因为 JSX 节点是 [不可变的（immutable）](https://en.wikipedia.org/wiki/Immutable_object)。JSX 节点对象不可能随时间改变，因此 React 知道跳过重新渲染是安全的。然而，为了使其工作，节点必须 **实际上是同一个对象**，而不仅仅是在代码中看起来相同。这就是 `useMemo` 在此示例中所做的。

手动将 JSX 节点包裹到 `useMemo` 中并不方便，比如你不能在条件语句中这样做。这就是为什么通常会选择使用 [`memo`](/reference/react/memo) 包装组件而不是使用 `useMemo` 包装 JSX 节点。

</DeepDive>

<Recipes titleText="跳过重新渲染和总是重新渲染之间的区别" titleId="examples-rerendering">

#### 用 `useMemo` 和 `memo` 跳过重新渲染 {/*skipping-re-rendering-with-usememo-and-memo*/}

在此示例中，`List` 组件被 **人为地减速了**，以便可以看到当渲染的 React 组件真正变慢时会发生什么。尝试切换选项卡并切换主题。

切换选项卡感觉很慢，因为它迫使减速的 `List` 重新渲染。这是预料之中的，因为选项卡 `tab` 已更改，因此你需要在屏幕上展示用户的新选择。

接下来，尝试切换主题。**感谢 `useMemo` 和 [`memo`](/reference/react/memo)，尽管被人为减速了，但是它还是很快**！由于作为依赖性传递给 `useMemo` 的 `todos` 与 `tab` 都没有发生改变，因此 `visibleTodos` 不会发生改变。由于 `visibleTodos` 数组从上一次渲染之后就没有发生改变，所以 `List` 会跳过重新渲染。

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/TodoList.js active
import { useMemo } from 'react';
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  return (
    <div className={theme}>
      <p><b>Note: <code>List</code> is artificially slowed down!</b></p>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js src/List.js
import { memo } from 'react';

const List = memo(function List({ items }) {
  console.log('[ARTIFICIALLY SLOW] Rendering <List /> with ' + items.length + ' items');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // 在 500 毫秒内不执行任何操作以模拟极慢的代码
  }

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.completed ?
            <s>{item.text}</s> :
            item.text
          }
        </li>
      ))}
    </ul>
  );
});

export default List;
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

<Solution />

#### 总是重新渲染一个组件 {/*always-re-rendering-a-component*/}

在这个例子中，`List` 的实现也被 **人为地减慢了**，这样就可以看到当渲染的某些 React 组件真的很慢时会发生什么。尝试切换选项卡并切换主题。

与前面的示例不同，现在切换主题也很慢！这是因为 **此版本中没有使用 `useMemo`**，所以 `visibleTodos` 始终是一个不同的数组，并且速度变慢的 `List` 组件无法跳过重新渲染。

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/TodoList.js active
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <p><b>Note: <code>List</code> is artificially slowed down!</b></p>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js src/List.js
import { memo } from 'react';

const List = memo(function List({ items }) {
  console.log('[ARTIFICIALLY SLOW] Rendering <List /> with ' + items.length + ' items');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // 在 500 毫秒内不执行任何操作以模拟极慢的代码
  }

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.completed ?
            <s>{item.text}</s> :
            item.text
          }
        </li>
      ))}
    </ul>
  );
});

export default List;
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

然而，这是 **删除了人为减速后** 的相同代码。此时你应该能感觉到缺少 `useMemo` 后效果差异非常明显。

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/TodoList.js active
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js src/List.js
import { memo } from 'react';

function List({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.completed ?
            <s>{item.text}</s> :
            item.text
          }
        </li>
      ))}
    </ul>
  );
}

export default memo(List);
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

很多时候，没有记忆化的代码可以正常工作。如果你的交互足够快，则不需要记忆化。

请记住，在生产环境下运行 React 进行测试，并且禁用 [React 开发者工具](/learn/react-developer-tools)，并准备好与使用你应用程序的用户类似的设备，这样可以对你的应用程序性能有一个更加准确的判断。

<Solution />

</Recipes>

---

### 防止过于频繁地触发 Effect {/*preventing-an-effect-from-firing-too-often*/}

有时你可能会想要在 [Effect](/learn/synchronizing-with-effects) 中使用变量：

```js {4-7,10}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = {
    serverUrl: 'https://localhost:1234',
    roomId: roomId
  }

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    // ...
```

但是这样做会带来一些问题。因为 [Effect 中的每一个响应式值都应该声明为其依赖。](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) 然而如果你将 `options` 声明为依赖，会导致在 Effect 中不断地重新连接到聊天室：


```js {5}
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // 🔴 问题：每次渲染这个依赖项都会发生改变
  // ...
```

为了解决这个场景，你可以使用 `useMemo` 将 Effect 中使用的对象包装起来：

```js {4-9,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = useMemo(() => {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }, [roomId]); // ✅ 只有当 roomId 改变时才会被改变

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ 只有当 options 改变时才会被改变
  // ...
```

因为 `useMemo` 返回了缓存的对象，所以这将确保 `options` 对象在重新渲染期间保持不变。

然而，因为 `useMemo` 只是一个性能优化手段，而并不是语义上的保证，所以 React 在 [特定场景下](#caveats) 会丢弃缓存值。这也会导致重新触发 Effect，因此 **最好通过将对象移动到 Effect 内部来消除对函数的依赖**：

```js {5-8,13}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = { // ✅ 不需要将 useMemo 或对象作为依赖！
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    }
    
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ 只有当 roomId 改变时才会被改变
  // ...
```

现在你的代码不需要使用 `useMemo` 并且更加简洁。[了解移除 Effect 依赖项的更多信息。](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)


### 记忆另一个 Hook 的依赖 {/*memoizing-a-dependency-of-another-hook*/}

假设你有一个计算函数依赖于直接在组件主体中创建的对象：

```js {2}
function Dropdown({ allItems, text }) {
  const searchOptions = { matchMode: 'whole-word', text };

  const visibleItems = useMemo(() => {
    return searchItems(allItems, searchOptions);
  }, [allItems, searchOptions]); // 🚩 提醒：依赖于在组件主体中创建的对象
  // ...
```

依赖这样的对象会破坏记忆化。当组件重新渲染时，组件主体内的所有代码都会再次运行。**创建 `searchOptions` 对象的代码行也将在每次重新渲染时运行**。因为 `searchOptions` 是你的 `useMemo` 调用的依赖项，而且每次都不一样，React 知道依赖项是不同的，并且每次都重新计算 `searchItems`。

要解决此问题，你可以在将其作为依赖项传递之前记忆 `searchOptions` 对象 **本身**：

```js {2-4}
function Dropdown({ allItems, text }) {
  const searchOptions = useMemo(() => {
    return { matchMode: 'whole-word', text };
  }, [text]); // ✅ 只有当 text 改变时才会发生改变

  const visibleItems = useMemo(() => {
    return searchItems(allItems, searchOptions);
  }, [allItems, searchOptions]); // ✅ 只有当 allItems 或 serachOptions 改变时才会发生改变
  // ...
```

在上面的例子中，如果 `text` 没有改变，`searchOptions` 对象也不会改变。然而，更好的解决方法是将 `searchOptions` 对象声明移到 `useMemo` 计算函数的 **内部**：

```js {3}
function Dropdown({ allItems, text }) {
  const visibleItems = useMemo(() => {
    const searchOptions = { matchMode: 'whole-word', text };
    return searchItems(allItems, searchOptions);
  }, [allItems, text]); // ✅ 只有当 allItems 或者 text 改变的时候才会重新计算
  // ...
```

现在你的计算直接取决于 `text`（这是一个字符串，不会“意外地”变得不同）。

---

### 记忆一个函数 {/*memoizing-a-function*/}

假设 `Form` 组件被包裹在 [`memo`](/reference/react/memo) 中，你想将一个函数作为 props 传递给它：

```js {2-7}
export default function ProductPage({ productId, referrer }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails
    });
  }

  return <Form onSubmit={handleSubmit} />;
}
```

正如 `{}` 每次都会创建不同的对象一样，像 `function() {}` 这样的函数声明和像 `() => {}` 这样的表达式在每次重新渲染时都会产生一个 **不同** 的函数。就其本身而言，创建一个新函数不是问题。这不是可以避免的事情！但是，如果 `Form` 组件被记忆了，大概你想在没有 props 改变时跳过它的重新渲染。**总是** 不同的 props 会破坏你的记忆化。

要使用 `useMemo` 记忆函数，你的计算函数必须返回另一个函数：

```js {2-3,8-9}
export default function Page({ productId, referrer }) {
  const handleSubmit = useMemo(() => {
    return (orderDetails) => {
      post('/product/' + productId + '/buy', {
        referrer,
        orderDetails
      });
    };
  }, [productId, referrer]);

  return <Form onSubmit={handleSubmit} />;
}
```

这看起来很笨拙！**记忆函数很常见，React 有一个专门用于此的内置 Hook。将你的函数包装到 [`useCallback`](/reference/react/useCallback) 而不是 `useMemo`** 中，以避免编写额外的嵌套函数：

```js {2,7}
export default function Page({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails
    });
  }, [productId, referrer]);

  return <Form onSubmit={handleSubmit} />;
}
```

上面两个例子是完全等价的。`useCallback` 的唯一好处是它可以让你避免在内部编写额外的嵌套函数。它没有做任何其他事情。[阅读更多关于 `useCallback` 的内容](/reference/react/useCallback)。

---

## 故障排除 {/*troubleshooting*/}

### 每次重新渲染时计算函数都会运行两次 {/*my-calculation-runs-twice-on-every-re-render*/}

在 [严格模式](/reference/react/StrictMode) 中，React 将调用你的某些函数两次而不是一次：

```js {2,5,6}
function TodoList({ todos, tab }) {
  // 此组件函数将为每个渲染运行两次。

  const visibleTodos = useMemo(() => {
    // 如果任何依赖项发生更改，此计算将运行两次。
    return filterTodos(todos, tab);
  }, [todos, tab]);

  // ...
```

这是符合预期的，不应对你的代码逻辑产生影响。

这种 **仅限开发环境下的** 行为可帮助你 [保持组件纯粹](/learn/keeping-components-pure)。React 使用其中一次调用的结果，而忽略另一次的结果。只要你的组件和计算函数是纯函数，这就不会影响你的逻辑。但是，如果你不小心写出带有副作用的代码，这可以帮助你发现并纠正错误。

例如，这个不纯的计算函数会改变你作为 props 收到的数组：

```js {2-3}
  const visibleTodos = useMemo(() => {
    // 🚩 错误：改变了 props
    todos.push({ id: 'last', text: 'Go for a walk!' });
    const filtered = filterTodos(todos, tab);
    return filtered;
  }, [todos, tab]);
```

React 调用你的函数两次，所以你会注意到 todo 被添加了两次。你的计算不应更改任何现有对象，但可以更改你在计算期间创建的任何 **新** 对象。例如，如果 `filterTodos` 函数总是返回一个 **不同** 数组，你可以改为改变 **那个** 数组：

```js {3,4}
  const visibleTodos = useMemo(() => {
    const filtered = filterTodos(todos, tab);
    // ✅ 正确：改变在计算过程中创建的对象
    filtered.push({ id: 'last', text: 'Go for a walk!' });
    return filtered;
  }, [todos, tab]);
```

阅读 [保持组件纯粹](/learn/keeping-components-pure) 以了解有关纯组件的更多信息。

此外，请查看有关不通过对象或者数组的可变性直接 [更新对象](/learn/updating-objects-in-state) 和 [更新数组](/learn/updating-arrays-in-state) 的指南。

---

### 我调用的 `useMemo` 应该返回一个对象，但返回了 `undefined` {/*my-usememo-call-is-supposed-to-return-an-object-but-returns-undefined*/}

这段代码不起作用：

```js {1-2,5}
  // 🔴 你不能像这样 `() => {` 在箭头函数中直接返回一个对象
  const searchOptions = useMemo(() => {
    matchMode: 'whole-word',
    text: text
  }, [text]);
```

在 JavaScript 中，`() => {` 是箭头函数体的开始标志，因此 `{` 大括号不是对象的一部分。这就是它不返回对象并导致错误的原因。你可以通过添加像 `({` 与 `})` 这样的括号来修复它：

```js {1-2,5}
  // 这行得通，但很容易有人再次破坏
  const searchOptions = useMemo(() => ({
    matchMode: 'whole-word',
    text: text
  }), [text]);
```

然而，这仍然令人困惑，而且对于某些人来说，通过移除括号来破坏它太容易了。

为避免此错误，请显式编写 `return` 语句：

```js {1-3,6-7}
  // ✅ 这有效并且是明确的
  const searchOptions = useMemo(() => {
    return {
      matchMode: 'whole-word',
      text: text
    };
  }, [text]);
```

---

### 组件每次渲染时，`useMemo` 都会重新计算 {/*every-time-my-component-renders-the-calculation-in-usememo-re-runs*/}

确保你已将依赖项数组指定为第二个参数！

如果你忘记了依赖数组，`useMemo` 将每次重新运行计算：

```js {2-3}
function TodoList({ todos, tab }) {
  // 🔴 每次都重新计算：没有依赖数组
  const visibleTodos = useMemo(() => filterTodos(todos, tab));
  // ...
```

这是将依赖项数组作为第二个参数传递的更正版本：

```js {2-3}
function TodoList({ todos, tab }) {
  // ✅ 不会不必要地重新计算
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
```

如果这没有帮助，那么问题是你的至少一个依赖项与之前的渲染不同。你可以通过手动将依赖项记录到控制台来调试此问题：

```js
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  console.log([todos, tab]);
```

然后，你可以在控制台中右键单击来自不同重新渲染的数组，并为它们选择“存储为全局变量”。假设第一个保存为 `temp1`，第二个保存为 `temp2`，然后你可以使用浏览器控制台检查两个数组中的每个依赖项是否相同：

```js
Object.is(temp1[0], temp2[0]); // 数组之间的第一个依赖项是否相同？
Object.is(temp1[1], temp2[1]); // 数组之间的第二个依赖项是否相同？
Object.is(temp1[2], temp2[2]); // ... 依此类推 ...
```

当你发现是哪个依赖项破坏了记忆化时，要么找到一种方法将其删除，要么 [也对其进行记忆化](#memoizing-a-dependency-of-another-hook)。

---

### 我需要为循环中的每个列表项调用 `useMemo`，但这是不允许的 {/*i-need-to-call-usememo-for-each-list-item-in-a-loop-but-its-not-allowed*/}

假设 `Chart` 组件被包裹在 [`memo`](/reference/react/memo) 中。当 `ReportList` 组件重新渲染时，你想跳过重新渲染列表中的每个 `Chart`。但是，你不能在循环中调用 `useMemo`：

```js {5-11}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item => {
        // 🔴 你不能像这样在循环中调用 useMemo：
        const data = useMemo(() => calculateReport(item), [item]);
        return (
          <figure key={item.id}>
            <Chart data={data} />
          </figure>
        );
      })}
    </article>
  );
}
```

相反，为每个 item 提取一个组件并为单个 item 记忆数据：

```js {5,12-18}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item =>
        <Report key={item.id} item={item} />
      )}
    </article>
  );
}

function Report({ item }) {
  // ✅ 在顶层调用 useMemo：
  const data = useMemo(() => calculateReport(item), [item]);
  return (
    <figure>
      <Chart data={data} />
    </figure>
  );
}
```

或者，你可以删除 `useMemo` 并将 `Report` 本身包装在 [`memo`](/reference/react/memo) 中。如果 `item` props 没有改变，`Report` 将跳过重新渲染，因此 `Chart` 也会跳过重新渲染：

```js {5,6,12}
function ReportList({ items }) {
  // ...
}

const Report = memo(function Report({ item }) {
  const data = calculateReport(item);
  return (
    <figure>
      <Chart data={data} />
    </figure>
  );
});
```
