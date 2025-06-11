---
title: useContext
---

<Intro>

`useContext` 是一个 React Hook，可以让你读取和订阅组件中的 [context](/learn/passing-data-deeply-with-context)。

```js
const value = useContext(SomeContext)
```

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `useContext(SomeContext)` {/*usecontext*/}

在组件的顶层调用 `useContext` 来读取和订阅 [context](/learn/passing-data-deeply-with-context)。

```js
import { useContext } from 'react';

function MyComponent() {
  const theme = useContext(ThemeContext);
  // ...
```

[请看下方更多示例。](#usage)

#### 参数 {/*parameters*/}

* `SomeContext`：先前用 [`createContext`](/reference/react/createContext) 创建的 context。context 本身不包含信息，它只代表你可以提供或从组件中读取的信息类型。

#### 返回值 {/*returns*/}

`useContext` 为调用组件返回 context 的值。它被确定为传递给树中调用组件上方最近的 `SomeContext` 的 `value`。如果没有这样的 provider，那么返回值将会是为创建该 context 传递给 [`createContext`](/reference/react/createContext) 的 `defaultValue`。返回的值始终是最新的。如果 context 发生变化，React 会自动重新渲染读取 context 的组件。

#### 注意事项 {/*caveats*/}

* 组件中的 `useContext()` 调用不受 **同一** 组件返回的 provider 的影响。相应的 `<Context>` 需要位于调用 `useContext()` 的组件 **之上**。
* 从 provider 接收到不同的 `value` 开始，React 自动重新渲染使用了该特定 context 的所有子级。先前的值和新的值会使用 [`Object.is`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 来做比较。使用 [`memo`](/reference/react/memo) 来跳过重新渲染并不妨碍子级接收到新的 context 值。 
* 如果你的构建系统在输出中产生重复的模块（可能发生在符号链接中），这可能会破坏 context。通过 context 传递数据只有在用于传递 context 的 `SomeContext` 和用于读取数据的  `SomeContext` 是完全相同的对象时才有效，这是由 `===` 比较决定的。

---

## 用法 {/*usage*/}


### 向组件树深层传递数据 {/*passing-data-deeply-into-the-tree*/}

在组件的最顶级调用 `useContext` 来读取和订阅 [context](/learn/passing-data-deeply-with-context)。

```js [[2, 4, "theme"], [1, 4, "ThemeContext"]]
import { useContext } from 'react';

function Button() {
  const theme = useContext(ThemeContext);
  // ... 
```

`useContext` 返回你向 <CodeStep step={1}>context</CodeStep> 传递的 <CodeStep step={2}>context value</CodeStep>。为了确定 context 值，React 搜索组件树，为这个特定的 context **向上查找最近的** context provider。

若要将 context 传递给 `Button`，请将其或其父组件之一包装到相应的 context provider：

```js [[1, 3, "ThemeContext"], [2, 3, "\\"dark\\""], [1, 5, "ThemeContext"]]
function MyPage() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  );
}

function Form() {
  // ... 在内部渲染 buttons ...
}
```

provider 和 `Button` 之间有多少层组件并不重要。当 `Form` 中的任何位置的 `Button` 调用 `useContext(ThemeContext)` 时，它都将接收 `"dark"` 作为值。 

<Pitfall>

`useContext()` 总是在调用它的组件 **上面** 寻找最近的 provider。它向上搜索， **不考虑** 调用 `useContext()` 的组件中的 provider。

</Pitfall>

<Sandpack>

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  )
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

---

### 通过 context 更新传递的数据 {/*updating-data-passed-via-context*/}

通常，你会希望 context 随着时间的推移而改变。要更新 context，请将其与 [state](/reference/react/useState) 结合。在父组件中声明一个状态变量，并将当前状态作为 <CodeStep step={2}>context value</CodeStep> 传递给 provider。

```js {2} [[1, 4, "ThemeContext"], [2, 4, "theme"], [1, 11, "ThemeContext"]]
function MyPage() {
  const [theme, setTheme] = useState('dark');
  return (
    <ThemeContext value={theme}>
      <Form />
      <Button onClick={() => {
        setTheme('light');
      }}>
       Switch to light theme
      </Button>
    </ThemeContext>
  );
}
```

现在 provider 中的任何一个 `Button` 都会接收到当前的 `theme` 值。如果调用 `setTheme` 来更新传递给 provider 的 `theme` 值，则所有 `Button` 组件都将使用新的值 `'light'` 来重新渲染。

<Recipes titleText="更新 context 的例子" titleId="examples-basic">

#### 通过 context 来更新数据 {/*updating-a-value-via-context*/}

在这个示例中，`MyApp` 组件包含一个状态变量，然后该变量被传递给 `ThemeContext` provider。选中“Dark mode”复选框更新状态。更改提供的值将重新渲染使用该 context 的所有组件。

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext value={theme}>
      <Form />
      <label>
        <input
          type="checkbox"
          checked={theme === 'dark'}
          onChange={(e) => {
            setTheme(e.target.checked ? 'dark' : 'light')
          }}
        />
        Use dark mode
      </label>
    </ThemeContext>
  )
}

function Form({ children }) {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

注意，`value="dark"` 传递 `"dark"` 字符串，但 `value={theme}` 传递带有 [JSX 花括号](/learn/javascript-in-jsx-with-curly-braces) 的 JavaScript `theme` 变量的值。花括号还允许传递非字符串的 context 值。

<Solution />

#### 通过 context 更新对象 {/*updating-an-object-via-context*/}

在这个例子中，有一个 `currentUser` 状态变量，它包含一个对象。将 `{ currentUser, setCurrentUser }` 组合成一个对象，并通过 context 在 `value={}` 中向下传递。这允许下面的任何组件，如 `LoginButton`，同时读取 `currentUser` 和 `setCurrentUser`，然后在需要时调用 `setCurrentUser`。

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <CurrentUserContext
      value={{
        currentUser,
        setCurrentUser
      }}
    >
      <Form />
    </CurrentUserContext>
  );
}

function Form({ children }) {
  return (
    <Panel title="Welcome">
      <LoginButton />
    </Panel>
  );
}

function LoginButton() {
  const {
    currentUser,
    setCurrentUser
  } = useContext(CurrentUserContext);

  if (currentUser !== null) {
    return <p>You logged in as {currentUser.name}.</p>;
  }

  return (
    <Button onClick={() => {
      setCurrentUser({ name: 'Advika' })
    }}>Log in as Advika</Button>
  );
}

function Panel({ title, children }) {
  return (
    <section className="panel">
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
label {
  display: block;
}

.panel {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}

.button {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}
```

</Sandpack>

<Solution />

#### 同时使用多个 context {/*multiple-contexts*/}

在这个例子中，存在两个独立的 context。`ThemeContext` 提供了当前的主题，它是一个字符串，而 `CurrentUserContext` 保存了代表当前用户的对象。

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);
const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <ThemeContext value={theme}>
      <CurrentUserContext
        value={{
          currentUser,
          setCurrentUser
        }}
      >
        <WelcomePanel />
        <label>
          <input
            type="checkbox"
            checked={theme === 'dark'}
            onChange={(e) => {
              setTheme(e.target.checked ? 'dark' : 'light')
            }}
          />
          Use dark mode
        </label>
      </CurrentUserContext>
    </ThemeContext>
  )
}

function WelcomePanel({ children }) {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <Panel title="Welcome">
      {currentUser !== null ?
        <Greeting /> :
        <LoginForm />
      }
    </Panel>
  );
}

function Greeting() {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <p>You logged in as {currentUser.name}.</p>
  )
}

function LoginForm() {
  const {setCurrentUser} = useContext(CurrentUserContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const canLogin = firstName.trim() !== '' && lastName.trim() !== '';
  return (
    <>
      <label>
        First name{': '}
        <input
          required
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Last name{': '}
        <input
        required
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        />
      </label>
      <Button
        disabled={!canLogin}
        onClick={() => {
          setCurrentUser({
            name: firstName + ' ' + lastName
          });
        }}
      >
        Log in
      </Button>
      {!canLogin && <i>Fill in both fields.</i>}
    </>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, disabled, onClick }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

```css
label {
  display: block;
}

.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

<Solution />

#### 把 provider 抽离成组件 {/*extracting-providers-to-a-component*/}

随着你的应用增长，预计你会有一个像“金字塔”一样的 context 出现在靠近你应用的根部。这样没什么问题。然而，如果你从审美上不喜欢这种嵌套，你可以将 provider 抽离成单独的组件。在这个例子中，`MyProviders` 隐藏了“管路”，并且在需要的 provider 中渲染传递给它的子节点。请注意，`MyApp` 本身需要 `theme` 和 `setTheme` 状态，因此 `MyApp` 仍然拥有这部分的状态。

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);
const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <MyProviders theme={theme} setTheme={setTheme}>
      <WelcomePanel />
      <label>
        <input
          type="checkbox"
          checked={theme === 'dark'}
          onChange={(e) => {
            setTheme(e.target.checked ? 'dark' : 'light')
          }}
        />
        Use dark mode
      </label>
    </MyProviders>
  );
}

function MyProviders({ children, theme, setTheme }) {
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <ThemeContext value={theme}>
      <CurrentUserContext
        value={{
          currentUser,
          setCurrentUser
        }}
      >
        {children}
      </CurrentUserContext>
    </ThemeContext>
  );
}

function WelcomePanel({ children }) {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <Panel title="Welcome">
      {currentUser !== null ?
        <Greeting /> :
        <LoginForm />
      }
    </Panel>
  );
}

function Greeting() {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <p>You logged in as {currentUser.name}.</p>
  )
}

function LoginForm() {
  const {setCurrentUser} = useContext(CurrentUserContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const canLogin = firstName !== '' && lastName !== '';
  return (
    <>
      <label>
        First name{': '}
        <input
          required
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Last name{': '}
        <input
        required
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        />
      </label>
      <Button
        disabled={!canLogin}
        onClick={() => {
          setCurrentUser({
            name: firstName + ' ' + lastName
          });
        }}
      >
        Log in
      </Button>
      {!canLogin && <i>Fill in both fields.</i>}
    </>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, disabled, onClick }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

```css
label {
  display: block;
}

.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

<Solution />

#### 使用 context 和 reducer 进行扩展 {/*scaling-up-with-context-and-a-reducer*/}

在大型应用程序中，通常将 context 和 [reducer](/reference/react/useReducer) 结合起来从组件中抽离与某种状态相关的逻辑。在本例中，所有的“线路”都隐藏在 `TasksContext.js` 中，它包含一个 reducer 和两个单独 context。

阅读这个例子的 [完整演示。](/learn/scaling-up-with-reducer-and-context)

<Sandpack>

```js src/App.js
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import { TasksProvider } from './TasksContext.js';

export default function TaskApp() {
  return (
    <TasksProvider>
      <h1>Day off in Kyoto</h1>
      <AddTask />
      <TaskList />
    </TasksProvider>
  );
}
```

```js src/TasksContext.js
import { createContext, useContext, useReducer } from 'react';

const TasksContext = createContext(null);

const TasksDispatchContext = createContext(null);

export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  return (
    <TasksContext value={tasks}>
      <TasksDispatchContext value={dispatch}>
        {children}
      </TasksDispatchContext>
    </TasksContext>
  );
}

export function useTasks() {
  return useContext(TasksContext);
}

export function useTasksDispatch() {
  return useContext(TasksDispatchContext);
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'changed': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

const initialTasks = [
  { id: 0, text: 'Philosopher’s Path', done: true },
  { id: 1, text: 'Visit the temple', done: false },
  { id: 2, text: 'Drink matcha', done: false }
];
```

```js src/AddTask.js
import { useState, useContext } from 'react';
import { useTasksDispatch } from './TasksContext.js';

export default function AddTask() {
  const [text, setText] = useState('');
  const dispatch = useTasksDispatch();
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        dispatch({
          type: 'added',
          id: nextId++,
          text: text,
        }); 
      }}>Add</button>
    </>
  );
}

let nextId = 3;
```

```js src/TaskList.js
import { useState, useContext } from 'react';
import { useTasks, useTasksDispatch } from './TasksContext.js';

export default function TaskList() {
  const tasks = useTasks();
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task task={task} />
        </li>
      ))}
    </ul>
  );
}

function Task({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useTasksDispatch();
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            dispatch({
              type: 'changed',
              task: {
                ...task,
                text: e.target.value
              }
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={e => {
          dispatch({
            type: 'changed',
            task: {
              ...task,
              done: e.target.checked
            }
          });
        }}
      />
      {taskContent}
      <button onClick={() => {
        dispatch({
          type: 'deleted',
          id: task.id
        });
      }}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

<Solution />

</Recipes>

---

### 指定后备方案默认值 {/*specifying-a-fallback-default-value*/}

如果 React 没有在父树中找到该特定 <CodeStep step={1}>context</CodeStep> 的任何 provider，`useContext()` 返回的 context 值将等于你在 [创建 context](/reference/react/createContext) 时指定的 <CodeStep step={3}>默认值</CodeStep>：

```js [[1, 1, "ThemeContext"], [3, 1, "null"]]
const ThemeContext = createContext(null);
```

默认值 **从不改变**。如果你想要更新 context，请按 [上述方式](#updating-data-passed-via-context) 将其与状态一起使用。

通常，除了 `null`，还有一些更有意义的值可以用作默认值，例如：

```js [[1, 1, "ThemeContext"], [3, 1, "light"]]
const ThemeContext = createContext('light');
```

这样，如果你不小心渲染了没有相应 provider 的某个组件，它也不会出错。这也有助于你的组件在测试环境中很好地运行，而无需在测试中设置许多 provider。

在下面的例子中，“Toggle theme”按钮总是处于 light 状态，因为它位于 **任何主题的 context provider 之外**，且 context 主题的默认值是 `'light'`。试着编辑默认主题为 `'dark'`。

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext('light');

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <>
      <ThemeContext value={theme}>
        <Form />
      </ThemeContext>
      <Button onClick={() => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
      }}>
        Toggle theme
      </Button>
    </>
  )
}

function Form({ children }) {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, onClick }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

---

### 覆盖组件树一部分的 context {/*overriding-context-for-a-part-of-the-tree*/}

通过在 provider 中使用不同的值包装树的某个部分，可以覆盖该部分的 context。

```js {3,5}
<ThemeContext value="dark">
  ...
  <ThemeContext value="light">
    <Footer />
  </ThemeContext>
  ...
</ThemeContext>
```

你可以根据需要多次嵌套和覆盖 provider。

<Recipes titleText="Examples of overriding context">

#### 覆盖主题 {/*overriding-a-theme*/}

这里，与 `Footer` 外的值为（`"dark"`）的按钮相比，**里面** 的按钮接收到一个不一样的 context 值（`"light"`）。

<Sandpack>

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  )
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
      <ThemeContext value="light">
        <Footer />
      </ThemeContext>
    </Panel>
  );
}

function Footer() {
  return (
    <footer>
      <Button>Settings</Button>
    </footer>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      {title && <h1>{title}</h1>}
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}
```

```css
footer {
  margin-top: 20px;
  border-top: 1px solid #aaa;
}

.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

<Solution />

#### 自动嵌套标题 {/*automatically-nested-headings*/}

在嵌套使用 context provider 时，可以“累积”信息。在此示例中，`Section` 组件记录了 `LevelContext`，该 context 指定了 section 嵌套的深度。它从父级 section 中读取 `LevelContext`，然后把 `LevelContext` 的数值加一传递给子级。因此，`Heading` 组件可以根据被 `Section` 组件嵌套的层数自动决定使用 `<h1>`，`<h2>`，`<h3>`，...，中的哪种标签。

阅读此示例的 [详细演示](/learn/passing-data-deeply-with-context)

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading>Title</Heading>
      <Section>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext value={level + 1}>
        {children}
      </LevelContext>
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 0:
      throw Error('Heading must be inside a Section!');
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(0);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<Solution />

</Recipes>

---

### 在传递对象和函数时优化重新渲染 {/*optimizing-re-renders-when-passing-objects-and-functions*/}

你可以通过 context 传递任何值，包括对象和函数。

```js [[2, 10, "{ currentUser, login }"]] 
function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);

  function login(response) {
    storeCredentials(response.credentials);
    setCurrentUser(response.user);
  }

  return (
    <AuthContext value={{ currentUser, login }}>
      <Page />
    </AuthContext>
  );
}
```

此处，<CodeStep step={2}>context value</CodeStep> 是一个具有两个属性的 JavaScript 对象，其中一个是函数。每当 `MyApp` 出现重新渲染（例如，路由更新）时，这里将会是一个 **不同的** 对象指向 **不同的** 函数，因此 React 还必须重新渲染树中调用 `useContext(AuthContext)` 的所有组件。

在较小的应用程序中，这不是问题。但是，如果基础数据如 `currentUser` 没有更改，则不需要重新渲染它们。为了帮助 React 利用这一点，你可以使用 [`useCallback`](/reference/react/useCallback) 包装 `login` 函数，并将对象创建包装到 [`useMemo`](/reference/react/useMemo) 中。这是一个性能优化的例子：

```js {6,9,11,14,17}
import { useCallback, useMemo } from 'react';

function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);

  const login = useCallback((response) => {
    storeCredentials(response.credentials);
    setCurrentUser(response.user);
  }, []);

  const contextValue = useMemo(() => ({
    currentUser,
    login
  }), [currentUser, login]);

  return (
    <AuthContext value={contextValue}>
      <Page />
    </AuthContext>
  );
}
```

根据以上改变，即使 `MyApp` 需要重新渲染，调用 `useContext(AuthContext)` 的组件也不需要重新渲染，除非 `currentUser` 发生了变化。

阅读更多关于 [`useMemo`](/reference/react/useMemo#skipping-re-rendering-of-components) 和 [`useCallback`](/reference/react/useCallback#skipping-re-rendering-of-components) 的内容。

---

## 疑难解答 {/*troubleshooting*/}

### 我的组件获取不到 provider 传递的值{/*my-component-doesnt-see-the-value-from-my-provider*/}

这里有几种常见的情况会引起这个问题：

1. 你在调用 `useContext()` 的同一组件（或下层）渲染 `<SomeContext>`。把 `<SomeContext>` 向调用 `useContext()` 组件 **之上和之外** 移动。
2. 你可能忘记了使用 `<SomeContext>` 包装组件，或者你可能将组件放在树的不同部分。使用 [React DevTools](/learn/react-developer-tools) 检查组件树的层级是否正确。
3. 你的工具可能会遇到一些构建问题，导致你在传值组件中的所看到的 `SomeContext` 和读值组件中所看到的 `SomeContext` 是两个不同的对象。例如，如果使用符号链接，就会发生这种情况。你可以通过将它们赋值给全局对象如 `window.SomeContext1` 和 `window.SomeContext2` 来验证这种情况。然后在控制台检查 `window.SomeContext1 === window.SomeContext2` 是否相等。如果它们是不相等的，就在构建工具层面修复这个问题。

### 尽管设置了不一样的默认值，但是我总是从 context 中得到 `undefined` {/*i-am-always-getting-undefined-from-my-context-although-the-default-value-is-different*/}

你可能在组件树中有一个没有设置 `value` 的 provider：

```js {1,2}
// 🚩 不起作用：没有 value 作为 prop
<ThemeContext>
   <Button />
</ThemeContext>
```

如果你忘记了指定 `value`，它会像这样传值 `value={undefined}`。

你可能还错误地使用了一个不同的 prop 名：

```js {1,2}
// 🚩 不起作用：prop 应该是“value”
<ThemeContext theme={theme}>
   <Button />
</ThemeContext>
```

在这两种情况下，你都应该在控制台中看到 React 发出的警告。要解决这些问题，使用 `value` 作为 prop：

```js {1,2}
// ✅ 传递 value 作为 prop
<ThemeContext value={theme}>
   <Button />
</ThemeContext>
```

注意，只有在 **上层根本没有匹配的 provider** 时才使用 [`createContext(defaultValue)`调用的默认值](#specifying-a-fallback-default-value)。如果存在 `<SomeContext value={undefined}>` 组件在父树的某个位置，调用 `useContext(SomeContext)` 的组件 **将会** 接收到 `undefined` 作为 context 的值。
