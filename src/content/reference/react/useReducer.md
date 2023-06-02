---
title: useReducer
---

<Intro>

`useReducer` 是一个 React Hook，它允许你在组件中添加一个 [reducer](/learn/extracting-state-logic-into-a-reducer) 

```js
const [state, dispatch] = useReducer(reducer, initialArg, init?)
```

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `useReducer(reducer, initialArg, init?)` {/*usereducer*/}

在组件的顶层调用 useReducer，以使用  [reducer.](/learn/extracting-state-logic-into-a-reducer) 管理其状态。

```js
import { useReducer } from 'react';

function reducer(state, action) {
  // ...
}

function MyComponent() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });
  // ...
```

[请参阅下面的更多示例。](#usage)

#### 参数 {/*parameters*/}

* `reducer`: 指定状态更新方式的 reducer 函数。它必须是纯函数，应该接收 state 和 action 作为参数，并返回下一个状态。State 和 action 可以是任何类型。 
* `initialArg`: 用于计算初始状态的值。它可以是任何类型的值。如何从它计算初始状态取决于下一个 init 参数。
* **可选** `init`：应该返回初始状态的初始化函数。如果未指定，初始状态将设置为 initialArg。否则，初始状态将设置为调用 init(initialArg) 的结果。

#### 返回值 {/*returns*/}

`useReducer`  返回一个包含两个值的数组：

1. 当前状态。在第一次渲染期间，它设置为 `init(initialArg)` 或 `initialArg`（如果没有 `init`）。
2. 用于将状态更新为不同值并触发重新渲染的 [`dispatch` 函数](#dispatch)。

#### 注意事项 {/*caveats*/}

* `useReducer` 是一个 Hook，因此你只能在 **组件的顶层** 或你自己的 Hook 中调用它。你不能在循环或条件语句中调用它。如果需要这样做，请提取一个新组件并将状态移动到其中。
* 在严格模式（Strict Mode）下，React 为了[帮助你发现意外的不纯操作](#my-reducer-or-initializer-function-runs-twice)，**将调用两次你的 reducer 和初始化器**。这只在开发环境中生效，不影响生产环境。如果你的 reducer 和初始化器是纯的（正如它们应该的那样），这不应影响你的逻辑。两次调用中的一个结果会被忽略。

---

### `dispatch` 函数 {/*dispatch*/}

`useReducer` 返回的 `dispatch` 函数允许您将状态更新为不同的值并触发重新渲染。您需要将 action 作为唯一参数传递给 `dispatch` 函数：

```js
const [state, dispatch] = useReducer(reducer, { age: 42 });

function handleClick() {
  dispatch({ type: 'incremented_age' });
  // ...
```

React 将把下一个状态设置为使用当前 `state` 和您传递给 `dispatch` 的 action 调用您提供的 `reducer` 函数的结果。

#### 参数 {/*dispatch-parameters*/}

* `action`: 用户执行的动作。它可以是任何类型的值。按照惯例，一个动作通常是一个带有 `type` 属性（用于识别）的对象，以及可选的其他属性，用于存储附加信息。

#### 返回值 {/*dispatch-returns*/}

`dispatch` 函数没有返回值。

#### 注意事项 {/*setstate-caveats*/}

* `dispatch` 函数**仅在下一次渲染时更新 state 变量**。如果在调用 `dispatch` 函数后读取 state 变量，[您仍然会得到旧值](#ive-dispatched-an-action-but-logging-gives-me-the-old-state-value)，即在您调用之前屏幕上的值。

* 如果您提供的新值与当前 `state` 相同，经 [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 比较后得出，React **将跳过重新渲染组件及其子组件**。这是一种优化。React 在忽略结果之前仍可能需要调用您的组件，但这不应影响您的代码。

* React **[批量更新 state。](/learn/queueing-a-series-of-state-updates)** 它会在**所有事件处理程序运行完毕**并调用了它们的 **`set`** 函数后更新屏幕。这可以防止在单个事件期间发生多次重渲染。在极少数情况下，如果您需要强制 React 提前更新屏幕，例如为了访问 DOM，您可以使用 **[`flushSync`](/reference/react-dom/flushSync)**。

---

## 用法 {/*usage*/}

### 在组件中添加一个 reducer {/*adding-a-reducer-to-a-component*/}

在组件的顶层调用 `useReducer` 以便使用 [reducer.](/learn/extracting-state-logic-into-a-reducer) 来管理状态。

```js [[1, 8, "state"], [2, 8, "dispatch"], [4, 8, "reducer"], [3, 8, "{ age: 42 }"]]
import { useReducer } from 'react';

function reducer(state, action) {
  // ...
}

function MyComponent() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });
  // ...
```

`useReducer` 返回一个包含两个元素的数组：

1. 此状态变量的 <CodeStep step={1}> 当前状态 </CodeStep>，初始值设置为您提供的 <CodeStep step={3}> 初始状态 </CodeStep>。
2. <CodeStep step={2}> dispatch 函数 </CodeStep>，允许您根据交互来改变它。

要更新屏幕上的内容，请使用表示用户操作的对象（被称为 *action*）调用 <CodeStep step={2}>dispatch</CodeStep>：

```js [[2, 2, "dispatch"]]
function handleClick() {
  dispatch({ type: 'incremented_age' });
}
```

React 会将当前状态和操作传递给您的 <CodeStep step={4}> reducer 函数</CodeStep>。您的 reducer 将计算并返回下一个状态。React 将存储该下一个状态，使用它渲染您的组件，并更新 UI。

<Sandpack>

```js
import { useReducer } from 'react';

function reducer(state, action) {
  if (action.type === 'incremented_age') {
    return {
      age: state.age + 1
    };
  }
  throw Error('Unknown action.');
}

export default function Counter() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });

  return (
    <>
      <button onClick={() => {
        dispatch({ type: 'incremented_age' })
      }}>
        Increment age
      </button>
      <p>Hello! You are {state.age}.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

`useReducer` 与 [`useState`](/reference/react/useState) 非常相似，但它允许您将状态更新逻辑从事件处理器移到组件外的单个函数中。阅读更多关于[在 `useState` 和 `useReducer` 之间进行选择的内容。](/learn/extracting-state-logic-into-a-reducer#comparing-usestate-and-usereducer)

---

### 编写 reducer 函数 {/*writing-the-reducer-function*/}

一个 reducer 函数是这样声明的：

```js
function reducer(state, action) {
  // ...
}
```
接下来，你需要编写计算并返回下一个状态的代码。按照惯例，我们通常会使用 [`switch` 语句](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/switch) 来进行编写。对于 `switch` 中的每个 `case`，都需要计算并返回某个下一个状态。

```js {4-7,10-13}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      return {
        name: state.name,
        age: state.age + 1
      };
    }
    case 'changed_name': {
      return {
        name: action.nextName,
        age: state.age
      };
    }
  }
  throw Error('Unknown action: ' + action.type);
}
```

Actions 可以是任何形态。按照惯例，我们通常会传递带有类型属性的对象来标识 action。它应该包含 reducer 需要计算下一个状态所需的最少必要信息。

```js {5,9-12}
function Form() {
  const [state, dispatch] = useReducer(reducer, { name: 'Taylor', age: 42 });
  
  function handleButtonClick() {
    dispatch({ type: 'incremented_age' });
  }

  function handleInputChange(e) {
    dispatch({
      type: 'changed_name',
      nextName: e.target.value
    });
  }
  // ...
```

action 类型名称是与你的组件相关的。[每个动作描述了一个单独的交互，即使这可能导致数据中的多重改变。](/learn/extracting-state-logic-into-a-reducer#writing-reducers-well) 状态的形状是任意的，但通常它会是一个对象或数组。

阅读 [提取状态逻辑到reducer](/learn/extracting-state-logic-into-a-reducer) 来学习更多。


<Pitfall>


状态是只读的。不要修改状态中的任何对象或数组：

```js {4,5}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // 🚩 不要像这样去改变状态中的对象：
      state.age = state.age + 1;
      return state;
    }
```

相反，总是从你的 reducer 返回新的对象：

```js {4-8}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // ✅ 相反，返回一个新的对象
      return {
        ...state,
        age: state.age + 1
      };
    }
```

阅读 [更新状态中的对象](/learn/updating-objects-in-state) 和 [更新状态中的数组](/learn/updating-arrays-in-state) 来学习更多。

</Pitfall>

<Recipes titleText="基础的 useReducer 示例" titleId="examples-basic">

#### 表单 (object) {/*form-object*/}

在这个示例中，reducer 管理一个包含两个字段：`name` 和 `age` 的状态对象。

<Sandpack>

```js
import { useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      return {
        name: state.name,
        age: state.age + 1
      };
    }
    case 'changed_name': {
      return {
        name: action.nextName,
        age: state.age
      };
    }
  }
  throw Error('Unknown action: ' + action.type);
}

const initialState = { name: 'Taylor', age: 42 };

export default function Form() {
  const [state, dispatch] = useReducer(reducer, initialState);

  function handleButtonClick() {
    dispatch({ type: 'incremented_age' });
  }

  function handleInputChange(e) {
    dispatch({
      type: 'changed_name',
      nextName: e.target.value
    }); 
  }

  return (
    <>
      <input
        value={state.name}
        onChange={handleInputChange}
      />
      <button onClick={handleButtonClick}>
        Increment age
      </button>
      <p>Hello, {state.name}. You are {state.age}.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

<Solution />

#### 待办事项 (array) {/*todo-list-array*/}

在这个示例中，reducer 管理一个任务数组。这个数组需要[无突变地](/learn/updating-arrays-in-state)被更新。

<Sandpack>

```js App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

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

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask
        onAddTask={handleAddTask}
      />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Visit Kafka Museum', done: true },
  { id: 1, text: 'Watch a puppet show', done: false },
  { id: 2, text: 'Lennon Wall pic', done: false }
];
```

```js AddTask.js hidden
import { useState } from 'react';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>Add</button>
    </>
  )
}
```

```js TaskList.js hidden
import { useState } from 'react';

export default function TaskList({
  tasks,
  onChangeTask,
  onDeleteTask
}) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task
            task={task}
            onChange={onChangeTask}
            onDelete={onDeleteTask}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ task, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            onChange({
              ...task,
              text: e.target.value
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
          onChange({
            ...task,
            done: e.target.checked
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>
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

#### 使用 Immer 编写简洁的更新逻辑 {/*writing-concise-update-logic-with-immer*/}

如果你觉得不通过变动就更新数组和对象的过程很繁琐，你可以使用像 [Immer](https://github.com/immerjs/use-immer#useimmerreducer) 这样的库来减少重复的代码。Immer让你能够像在直接修改对象一样编写简洁的代码，但在底层，它执行的却是不可变的更新。

<Sandpack>

```js App.js
import { useImmerReducer } from 'use-immer';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

function tasksReducer(draft, action) {
  switch (action.type) {
    case 'added': {
      draft.push({
        id: action.id,
        text: action.text,
        done: false
      });
      break;
    }
    case 'changed': {
      const index = draft.findIndex(t =>
        t.id === action.task.id
      );
      draft[index] = action.task;
      break;
    }
    case 'deleted': {
      return draft.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default function TaskApp() {
  const [tasks, dispatch] = useImmerReducer(
    tasksReducer,
    initialTasks
  );

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask
        onAddTask={handleAddTask}
      />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Visit Kafka Museum', done: true },
  { id: 1, text: 'Watch a puppet show', done: false },
  { id: 2, text: 'Lennon Wall pic', done: false },
];
```

```js AddTask.js hidden
import { useState } from 'react';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>Add</button>
    </>
  )
}
```

```js TaskList.js hidden
import { useState } from 'react';

export default function TaskList({
  tasks,
  onChangeTask,
  onDeleteTask
}) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task
            task={task}
            onChange={onChangeTask}
            onDelete={onDeleteTask}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ task, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            onChange({
              ...task,
              text: e.target.value
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
          onChange({
            ...task,
            done: e.target.checked
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>
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

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

<Solution />

</Recipes>

---

### 避免重新创建初始状态 {/*avoiding-recreating-the-initial-state*/}

React在首次渲染时保存初始状态，并在后续的渲染中忽略它。

```js
function createInitialState(username) {
  // ...
}

function TodoList({ username }) {
  const [state, dispatch] = useReducer(reducer, createInitialState(username));
  // ...
```

尽管 `createInitialState(username)` 的结果仅用于初始渲染，但你仍在每次渲染时都调用这个函数。如果它正在创建大型数组或执行昂贵的计算，这可能会造成浪费。

为了解决这个问题，你可以将其作为 **初始化函数 (*initializer* function)** 传递给 `useReducer`，作为第三个参数：


```js {6}
function createInitialState(username) {
  // ...
}

function TodoList({ username }) {
  const [state, dispatch] = useReducer(reducer, username, createInitialState);
  // ...
```

注意你传递的是 `createInitialState`，也就是*函数本身*，而不是 `createInitialState()`，后者是调用它后的结果。这样，初始状态在初始化后不会被重新创建。

在上述例子中，`createInitialState` 接受一个 `username` 参数。如果你的初始化函数在计算初始状态时不需要任何信息，你可以将 `null` 作为 `useReducer` 的第二个参数。

<Recipes titleText="传递初始化函数和直接传递初始状态的区别" titleId="examples-initializer">

#### 传递初始化函数 {/*passing-the-initializer-function*/}

这个例子传递了初始化函数，所以 `createInitialState` 函数只在初始化时运行。它不会在组件重渲染时运行，例如当你在输入框中输入时。

<Sandpack>

```js App.js hidden
import TodoList from './TodoList.js';

export default function App() {
  return <TodoList username="Taylor" />;
}
```

```js TodoList.js active
import { useReducer } from 'react';

function createInitialState(username) {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: username + "'s task #" + (i + 1)
    });
  }
  return {
    draft: '',
    todos: initialTodos,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'changed_draft': {
      return {
        draft: action.nextDraft,
        todos: state.todos,
      };
    };
    case 'added_todo': {
      return {
        draft: '',
        todos: [{
          id: state.todos.length,
          text: state.draft
        }, ...state.todos]
      }
    }
  }
  throw Error('Unknown action: ' + action.type);
}

export default function TodoList({ username }) {
  const [state, dispatch] = useReducer(
    reducer,
    username,
    createInitialState
  );
  return (
    <>
      <input
        value={state.draft}
        onChange={e => {
          dispatch({
            type: 'changed_draft',
            nextDraft: e.target.value
          })
        }}
      />
      <button onClick={() => {
        dispatch({ type: 'added_todo' });
      }}>Add</button>
      <ul>
        {state.todos.map(item => (
          <li key={item.id}>
            {item.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

<Solution />

#### 直接传递初始状态 {/*passing-the-initial-state-directly*/}

这个例子**没有**传递初始化函数，所以 `createInitialState` 函数在每次渲染时都会运行，例如当你在输入框中输入时。在行为上没有可观察的差别，但这段代码的效率较低。

<Sandpack>

```js App.js hidden
import TodoList from './TodoList.js';

export default function App() {
  return <TodoList username="Taylor" />;
}
```

```js TodoList.js active
import { useReducer } from 'react';

function createInitialState(username) {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: username + "'s task #" + (i + 1)
    });
  }
  return {
    draft: '',
    todos: initialTodos,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'changed_draft': {
      return {
        draft: action.nextDraft,
        todos: state.todos,
      };
    };
    case 'added_todo': {
      return {
        draft: '',
        todos: [{
          id: state.todos.length,
          text: state.draft
        }, ...state.todos]
      }
    }
  }
  throw Error('Unknown action: ' + action.type);
}

export default function TodoList({ username }) {
  const [state, dispatch] = useReducer(
    reducer,
    createInitialState(username)
  );
  return (
    <>
      <input
        value={state.draft}
        onChange={e => {
          dispatch({
            type: 'changed_draft',
            nextDraft: e.target.value
          })
        }}
      />
      <button onClick={() => {
        dispatch({ type: 'added_todo' });
      }}>Add</button>
      <ul>
        {state.todos.map(item => (
          <li key={item.id}>
            {item.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

## 故障排除 {/*troubleshooting*/}

### 我已经派发了一个 action，但日志显示我还是旧的 state 值 {/*ive-dispatched-an-action-but-logging-gives-me-the-old-state-value*/}

调用 `dispatch` 函数**不会在正在运行的代码中改变状态**：

```js {4,5,8}
function handleClick() {
  console.log(state.age);  // 42

  dispatch({ type: 'incremented_age' }); // 请求使用43进行重新渲染
  console.log(state.age);  // 仍然是42！

  setTimeout(() => {
    console.log(state.age); // 同样是42！
  }, 5000);
}
```

这是因为[状态表现得像一个快照](https://chat.openai.com/learn/state-as-a-snapshot)。更新状态会请求另一个带有新的状态值的渲染，但不会影响你已经运行的事件处理器中的 `state` JavaScript变量。

如果你需要预测下一个状态值，你可以通过自己调用 reducer 来手动计算它：

```js
const action = { type: 'incremented_age' };
dispatch(action);

const nextState = reducer(state, action);
console.log(state);     // { age: 42 }
console.log(nextState); // { age: 43 }
```

---

### 我已经派发了一个 action，但屏幕没有更新 {/*ive-dispatched-an-action-but-the-screen-doesnt-update*/}

如果下一个状态等于前一个状态，React将**忽略你的更新**，这是通过 [`Object.is`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 比较决定的。这通常发生在你直接更改状态中的对象或数组时：

```js {4-5,9-10}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // 🚩 错误：修改现有对象
      state.age++;
      return state;
    }
    case 'changed_name': {
      // 🚩 错误：修改现有对象
      state.name = action.nextName;
      return state;
    }
    // ...
  }
}
```

你修改了现有的 `state` 对象并返回它，所以React忽略了这个更新。为了修复这个问题，你需要确保你总是[更新状态中的对象](https://chat.openai.com/learn/updating-objects-in-state)和[更新状态中的数组](https://chat.openai.com/learn/updating-arrays-in-state)，而不是修改它们：

```js {4-8,11-15}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // ✅ 正确：创建一个新的对象
      return {
        ...state,
        age: state.age + 1
      };
    }
    case 'changed_name': {
      // ✅ 正确：创建一个新的对象
      return {
        ...state,
        name: action.nextName
      };
    }
    // ...
  }
}
```

---

### 在派发后，我的 reducer state 的一部分变成了 undefined {/*a-part-of-my-reducer-state-becomes-undefined-after-dispatching*/}

确保每个 `case` 分支在返回新状态时**复制所有现有的字段**：

```js {5}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      return {
        ...state, // 不要忘记这个！
        age: state.age + 1
      };
    }
    // ...
```

如果没有上面的 `...state`，返回的下一个状态只会包含 `age` 字段，其他的都没有。

---

### 在派发后，我的整个 reducer state 变成了 undifined {/*my-entire-reducer-state-becomes-undefined-after-dispatching*/}

如果你的状态意外地变成了 `undefined`，你可能忘记在其中一个 `case` 中 `return` 状态，或者你的操作类型没有匹配任何的 `case` 语句。为了找到原因，在 `switch` 外部抛出一个错误：

```js {10}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // ...
    }
    case 'edited_name': {
      // ...
    }
  }
  throw Error('Unknown action: ' + action.type);
}
```

你也可以使用静态类型检查器，如 TypeScript，来捕获此类错误。

---

### 我收到一个错误： "Too many re-renders" {/*im-getting-an-error-too-many-re-renders*/}

你可能会收到一个错误，提示：`过多的重新渲染。React 限制了渲染的次数以防止出现无限循环。`通常，这意味着你在*渲染过程中*无条件地派发一个操作，因此你的组件进入一个循环：渲染，派发（引起渲染），渲染，派发（引起渲染），如此往复。很常见的原因是在指定事件处理器时出错：

```js {1-2}
// 🚩 错误：在渲染过程中调用处理器
return <button onClick={handleClick()}>Click me</button>

// ✅ 正确：向下传递事件处理器
return <button onClick={handleClick}>Click me</button>

// ✅ 正确：向下传递一个内联函数
return <button onClick={(e) => handleClick(e)}>Click me</button>
```

如果你无法找到这个错误的原因，点击控制台中错误旁边的箭头，查看JavaScript堆栈，找出导致错误的具体 `dispatch` 函数调用。

---

### 我的 reducer 或初始化函数运行了两次 {/*my-reducer-or-initializer-function-runs-twice*/}

In [Strict Mode](/reference/react/StrictMode), React will call your reducer and initializer functions twice. This shouldn't break your code.

This **development-only** behavior helps you [keep components pure.](/learn/keeping-components-pure) React uses the result of one of the calls, and ignores the result of the other call. As long as your component, initializer, and reducer functions are pure, this shouldn't affect your logic. However, if they are accidentally impure, this helps you notice the mistakes.

For example, this impure reducer function mutates an array in state:

在 [严格模式](https://chat.openai.com/reference/react/StrictMode)下，React 将调用你的 reducer 和 initializer 函数两次。这不应该破坏你的代码。

这种**仅限开发环境**的行为有助于你[保持组件的纯净性](https://chat.openai.com/learn/keeping-components-pure)。React使用其中一个调用的结果，忽略另一个调用的结果。只要你的组件、initializer 和 reducer 函数是纯净的，这不应该影响你的逻辑。然而，如果它们意外地不纯，这可以帮助你注意到错误。

例如，这个不纯的 reducer 函数会更改状态中的数组：

```js {4-6}
function reducer(state, action) {
  switch (action.type) {
    case 'added_todo': {
      // 🚩 错误：更改状态
      state.todos.push({ id: nextId++, text: action.text });
      return state;
    }
    // ...
  }
}
```

因为 React 调用了你的 reducer 函数两次，你会看到待办事项被添加了两次，所以你会知道有一个错误。在这个例子中，你可以通过[替换数组而不是更改它](https://chat.openai.com/learn/updating-arrays-in-state#adding-to-an-array)来修复这个错误：

```js {4-11}
function reducer(state, action) {
  switch (action.type) {
    case 'added_todo': {
      // ✅ 正确：用新状态替换
      return {
        ...state,
        todos: [
          ...state.todos,
          { id: nextId++, text: action.text }
        ]
      };
    }
    // ...
  }
}
```

现在，这个 reducer 函数是纯净的，再调用一次它并不会影响行为。这就是为什么 React 调用它两次可以帮助你找到错误。**只有组件、initializer 和 reducer 函数需要是纯净的。** 事件处理器不需要是纯净的，所以 React 永远不会调用你的事件处理器两次。

阅读 **[保持组件的纯净性](https://chat.openai.com/learn/keeping-components-pure)** 以了解更多。
