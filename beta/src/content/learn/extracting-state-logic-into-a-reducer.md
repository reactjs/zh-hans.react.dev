---
title: 迁移状态逻辑至 Reducer 中
translators:
  - qinhua
  - yyyang1996
  - QC-L
---

<Intro>

<<<<<<< HEAD
对于拥有许多状态更新逻辑的组件来说，过于分散的事件处理程序可能会令人不知所措。对于这种情况，你可以将组件的所有状态更新逻辑整合到一个外部函数中，这个函数叫作 **reducer**。
=======
Components with many state updates spread across many event handlers can get overwhelming. For these cases, you can consolidate all the state update logic outside your component in a single function, called a _reducer._
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26

</Intro>

<YouWillLearn>

- 什么是 reducer 函数
- 如何将 `useState` 重构成 `useReducer`
- 什么时候使用 reducer
- 如何编写一个好的 reducer

</YouWillLearn>

<<<<<<< HEAD
## 使用 reducer 整合状态逻辑 {/*consolidate-state-logic-with-a-reducer*/}
=======
## Consolidate state logic with a reducer {/* consolidate-state-logic-with-a-reducer */}
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26

随着组件复杂度的增加，你将很难一眼看清所有的组件状态更新逻辑。例如，下面的 `TaskApp` 组件有一个数组类型的状态 `tasks`，并通过三个不同的事件处理程序来实现任务的添加、删除和修改：

<Sandpack>

```js App.js
import {useState} from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, setTasks] = useState(initialTasks);

  function handleAddTask(text) {
    setTasks([
      ...tasks,
      {
        id: nextId++,
        text: text,
        done: false,
      },
    ]);
  }

  function handleChangeTask(task) {
    setTasks(
      tasks.map((t) => {
        if (t.id === task.id) {
          return task;
        } else {
          return t;
        }
      })
    );
  }

  function handleDeleteTask(taskId) {
    setTasks(tasks.filter((t) => t.id !== taskId));
  }

  return (
    <>
<<<<<<< HEAD
      <h1>布拉格的行程安排</h1>
      <AddTask
        onAddTask={handleAddTask}
      />
=======
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26
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
<<<<<<< HEAD
  { id: 0, text: '参观卡夫卡博物馆', done: true },
  { id: 1, text: '看木偶戏', done: false },
  { id: 2, text: '打卡列侬墙', done: false },
=======
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26
];
```

```js AddTask.js hidden
import {useState} from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="添加任务"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
<<<<<<< HEAD
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>添加</button>
=======
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Add
      </button>
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26
    </>
  );
}
```

```js TaskList.js hidden
import {useState} from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
<<<<<<< HEAD
          }} />
        <button onClick={() => setIsEditing(false)}>
          保存
        </button>
=======
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
<<<<<<< HEAD
        <button onClick={() => setIsEditing(true)}>
          编辑
        </button>
=======
        <button onClick={() => setIsEditing(true)}>Edit</button>
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
<<<<<<< HEAD
      <button onClick={() => onDelete(task.id)}>
        删除
      </button>
=======
      <button onClick={() => onDelete(task.id)}>Delete</button>
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

</Sandpack>

<<<<<<< HEAD
这个组件的每个事件处理程序都通过 `setTasks` 来更新状态。随着这个组件的不断迭代，其状态逻辑也会越来越多。为了降低这种复杂度，并让所有逻辑都可以存放在一个易于理解的地方，你可以将这些状态逻辑移到组件之外的一个称为 **reducer** 的函数中。
=======
Each of its event handlers calls `setTasks` in order to update the state. As this component grows, so does the amount of state logic sprinkled throughout it. To reduce this complexity and keep all your logic in one easy-to-access place, you can move that state logic into a single function outside your component, **called a "reducer".**
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26

Reducer 是处理状态的另一种方式。你可以通过三个步骤将 `useState` 迁移到 `useReducer`：

1. 将设置状态的逻辑 **修改** 成 dispatch 一个 action；
2. **编写** 一个 reducer 函数；
3. 在你的组件中 **使用** reducer。

<<<<<<< HEAD
### 第 1 步: 将设置状态的逻辑修改成 dispatch 一个 action {/*step-1-move-from-setting-state-to-dispatching-actions*/}

你的事件处理程序目前是通过设置状态来实现逻辑的：
=======
### Step 1: Move from setting state to dispatching actions {/* step-1-move-from-setting-state-to-dispatching-actions */}

Your event handlers currently specify _what to do_ by setting state:
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26

```js
function handleAddTask(text) {
  setTasks([
    ...tasks,
    {
      id: nextId++,
      text: text,
      done: false,
    },
  ]);
}

function handleChangeTask(task) {
  setTasks(
    tasks.map((t) => {
      if (t.id === task.id) {
        return task;
      } else {
        return t;
      }
    })
  );
}

function handleDeleteTask(taskId) {
  setTasks(tasks.filter((t) => t.id !== taskId));
}
```

移除所有的状态设置逻辑。只留下三个事件处理函数：

<<<<<<< HEAD
* `handleAddTask(text)` 在用户点击 “添加” 时被调用。
* `handleChangeTask(task)` 在用户切换任务或点击 “保存” 时被调用。
* `handleDeleteTask(taskId)` 在用户点击 “删除” 时被调用。
=======
- `handleAddTask(text)` is called when the user presses "Add".
- `handleChangeTask(task)` is called when the user toggles a task or presses "Save".
- `handleDeleteTask(taskId)` is called when the user presses "Delete".
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26

使用 reducers 管理状态与直接设置状态略有不同。它不是通过设置状态来告诉 React “要做什么”，而是通过事件处理程序 dispatch 一个 “action” 来指明 “用户刚刚做了什么”。（而状态更新逻辑则保存在其他地方！）因此，我们不再通过事件处理器直接 “设置 `task`”，而是 dispatch 一个 “添加/修改/删除任务” 的 action。这更加符合用户的思维。

```js
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
    task: task,
  });
}

function handleDeleteTask(taskId) {
  dispatch({
    type: 'deleted',
    id: taskId,
  });
}
```

<<<<<<< HEAD
你传递给 `dispatch` 的对象叫做 "action"：
=======
The object you pass to `dispatch` is called an "action":
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26

```js {3-7}
function handleDeleteTask(taskId) {
  dispatch(
    // "action" 对象：
    {
      type: 'deleted',
      id: taskId,
    }
  );
}
```

<<<<<<< HEAD
它是一个普通的 JavaScript 对象。它的结构是由你决定的，但通常来说，它应该至少包含可以表明 *发生了什么事情* 的信息。（在后面的步骤中，你将会学习如何添加一个 `dispatch` 函数。）
=======
It is a regular JavaScript object. You decide what to put in it, but generally it should contain the minimal information about _what happened_. (You will add the `dispatch` function itself in a later step.)
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26

<Convention conventionFor="action objects">

action 对象可以有多种结构。按照惯例，我们通常会添加一个字符串类型的 `type` 字段来描述发生了什么，并通过其它字段传递额外的信息。`type` 是特定于组件的，在这个例子中 `added` 和 `addded_task` 都可以。选一个能描述清楚发生的事件的名字！

```js
dispatch({
  // 针对特定的组件
  type: 'what_happened',
  // 其它字段放这里
});
```

</Convention>

<<<<<<< HEAD
### 第 2 步: 编写一个 reducer 函数 {/*step-2-write-a-reducer-function*/}
=======
### Step 2: Write a reducer function {/* step-2-write-a-reducer-function */}
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26

reducer 函数就是你放置状态逻辑的地方。它接受两个参数，分别为当前 state 和 action 对象，并且返回的是更新后的 state：

```js
function yourReducer(state, action) {
  // 给 React 返回更新后的状态
}
```

React 会将状态设置为你从 reducer 返回的状态。

在这个例子中，要将状态设置逻辑从事件处理程序移到 reducer 函数中，你需要：

<<<<<<< HEAD
1. 声明当前状态（`tasks`）作为第一个参数；
2. 声明 `action` 对象作为第二个参数；
3. 从 `reducer` 返回 *下一个* 状态（React 会将旧的状态设置为这个最新的状态）。
=======
1. Declare the current state (`tasks`) as the first argument.
2. Declare the `action` object as the second argument.
3. Return the _next_ state from the reducer (which React will set the state to).
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26

下面是所有迁移到 `reducer` 函数的状态设置逻辑：

```js
function tasksReducer(tasks, action) {
  if (action.type === 'added') {
    return [
      ...tasks,
      {
        id: action.id,
        text: action.text,
        done: false,
      },
    ];
  } else if (action.type === 'changed') {
    return tasks.map((t) => {
      if (t.id === action.task.id) {
        return action.task;
      } else {
        return t;
      }
    });
  } else if (action.type === 'deleted') {
    return tasks.filter((t) => t.id !== action.id);
  } else {
    throw Error('未知 action: ' + action.type);
  }
}
```

> 由于 `reducer` 函数接受 `state`（tasks）作为参数，因此你可以 **在组件之外声明它**。**这减少了代码的缩进级别，提升了代码的可读性。

<Convention conventionFor="reducer functions">

上面的代码使用了 `if/else` 语句，但是在 reducers 中使用 [switch 语句](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/switch) 是一种惯例。两种方式结果是相同的，但 `switch` 语句读起来一目了然。在本文档的后面部分我们会像这样使用：

```js
function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('未知 action: ' + action.type);
    }
  }
}
```

我们建议将每个 `case` 块包装到 `{` 和 `}` 花括号中，这样在不同 `case` 中声明的变量就不会互相冲突。此外，`case` 通常应该以 `return` 结尾。如果你忘了 `return`，代码就会 `进入` 到下一个 `case`，这就会导致错误！

如果你还不熟悉 `switch` 语句，使用 `if/else` 也是可以的。

</Convention>

<<<<<<< HEAD

<DeepDive title="为什么叫它 reducer 呢？">
=======
<DeepDive title="Why are reducers called this way?">
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26

尽管 `reducer` 可以 “减少” 组件内的代码量，但它实际上是以数组上的 [`reduce()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) 方法命名的。

`reduce()` 允许你将数组中的多个值 “累加” 成一个值：

```
const arr = [1, 2, 3, 4, 5];
const sum = arr.reduce(
  (result, number) => result + number
); // 1 + 2 + 3 + 4 + 5
```

你传递给 `reduce` 的函数被称为 “reducer”。它接受 `目前的结果` 和 `当前的值`，然后返回 `下一个结果`。React 中的 `reducer` 和这个是一样的：它们都接受 `目前的状态` 和 `action` ，然后返回 `下一个状态`。这样，action 会随着时间推移累积到状态中。

你甚至可以使用 `reduce()` 方法以及 `initialState` 和 `actions` 数组，通过传递你的 `reducer` 函数来计算最终的状态：

<Sandpack>

```js index.js active
import tasksReducer from './tasksReducer.js';

let initialState = [];
let actions = [
<<<<<<< HEAD
  { type: 'added', id: 1, text: '参观卡夫卡博物馆' },
  { type: 'added', id: 2, text: '看木偶戏' },
  { type: 'deleted', id: 1 },
  { type: 'added', id: 3, text: '打卡列侬墙' },
=======
  {type: 'added', id: 1, text: 'Visit Kafka Museum'},
  {type: 'added', id: 2, text: 'Watch a puppet show'},
  {type: 'deleted', id: 1},
  {type: 'added', id: 3, text: 'Lennon Wall pic'},
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26
];

let finalState = actions.reduce(tasksReducer, initialState);

const output = document.getElementById('output');
output.textContent = JSON.stringify(finalState, null, 2);
```

```js tasksReducer.js
export default function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('未知 action: ' + action.type);
    }
  }
}
```

```html public/index.html
<pre id="output"></pre>
```

</Sandpack>

你可能不需要自己做这些，但这与 React 所做的很相似！

</DeepDive>

<<<<<<< HEAD
### 第 3 步: 在组件中使用 reducer {/*step-3-use-the-reducer-from-your-component*/}
=======
### Step 3: Use the reducer from your component {/* step-3-use-the-reducer-from-your-component */}
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26

最后，你需要将 `tasksReducer` 导入到组件中。记得先从 React 中导入 `useReducer` Hook：

```js
import {useReducer} from 'react';
```

Then you can replace `useState`:

```js
const [tasks, setTasks] = useState(initialTasks);
```

with `useReducer` like so:

```js
const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
```

`useReducer` 和 `useState` 很相似——你必须给它传递一个初始状态，它会返回一个有状态的值和一个设置该状态的函数（在这个例子中就是 dispatch 函数）。但是，它们两个之间还是有点差异的。

<<<<<<< HEAD
`useReducer` 钩子接受 2 个参数：
=======
The `useReducer` Hook takes two arguments:
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26

1. 一个 reducer 函数
2. 一个初始的 state

它返回如下内容：

1. 一个有状态的值
2. 一个 dispatch 函数（用来 “派发” 用户操作给 reducer）

现在一切都准备就绪了！我们在这里把 reducer 定义在了组件的末尾：

<Sandpack>

```js App.js
import {useReducer} from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

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
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
<<<<<<< HEAD
      <h1>布拉格的行程安排</h1>
      <AddTask
        onAddTask={handleAddTask}
      />
=======
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('未知 action: ' + action.type);
    }
  }
}

let nextId = 3;
const initialTasks = [
<<<<<<< HEAD
  { id: 0, text: '参观卡夫卡博物馆', done: true },
  { id: 1, text: '看木偶戏', done: false },
  { id: 2, text: '打卡列侬墙', done: false }
=======
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26
];
```

```js AddTask.js hidden
import {useState} from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="添加任务"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
<<<<<<< HEAD
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>添加</button>
=======
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Add
      </button>
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26
    </>
  );
}
```

```js TaskList.js hidden
import {useState} from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
<<<<<<< HEAD
          }} />
        <button onClick={() => setIsEditing(false)}>
          保存
        </button>
=======
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
<<<<<<< HEAD
        <button onClick={() => setIsEditing(true)}>
          编辑
        </button>
=======
        <button onClick={() => setIsEditing(true)}>Edit</button>
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
<<<<<<< HEAD
      <button onClick={() => onDelete(task.id)}>
        删除
      </button>
=======
      <button onClick={() => onDelete(task.id)}>Delete</button>
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

</Sandpack>

如果有需要，你甚至可以把 reducer 移到一个单独的文件中：

<Sandpack>

```js App.js
import {useReducer} from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import tasksReducer from './tasksReducer.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

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
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
<<<<<<< HEAD
      <h1>布拉格的行程安排</h1>
      <AddTask
        onAddTask={handleAddTask}
      />
=======
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26
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
<<<<<<< HEAD
  { id: 0, text: '参观卡夫卡博物馆', done: true },
  { id: 1, text: '看木偶戏', done: false },
  { id: 2, text: '打卡列侬墙', done: false },
=======
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26
];
```

```js tasksReducer.js
export default function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('未知 action：' + action.type);
    }
  }
}
```

```js AddTask.js hidden
import {useState} from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="添加任务"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
<<<<<<< HEAD
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>添加</button>
=======
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Add
      </button>
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26
    </>
  );
}
```

```js TaskList.js hidden
import {useState} from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
<<<<<<< HEAD
          }} />
        <button onClick={() => setIsEditing(false)}>
          保存
        </button>
=======
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
<<<<<<< HEAD
        <button onClick={() => setIsEditing(true)}>
          编辑
        </button>
=======
        <button onClick={() => setIsEditing(true)}>Edit</button>
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
<<<<<<< HEAD
      <button onClick={() => onDelete(task.id)}>
        删除
      </button>
=======
      <button onClick={() => onDelete(task.id)}>Delete</button>
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

</Sandpack>

<<<<<<< HEAD
当像这样分离关注点时，我们可以更容易地理解组件逻辑。现在，事件处理程序只通过派发 `action` 来指定 *发生了什么*，而 `reducer` 函数通过响应 `actions` 来决定 *状态如何更新*。

## `useState` 和 `useReducer` 的对比 {/*comparing-usestate-and-usereducer*/}
=======
Component logic can be easier to read when you separate concerns like this. Now the event handlers only specify _what happened_ by dispatching actions, and the reducer function determines _how the state updates_ in response to them.

## Comparing `useState` and `useReducer` {/* comparing-usestate-and-usereducer */}
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26

Reducers 并非没有缺点！以下是比较它们的几种方法：

<<<<<<< HEAD
* **代码体积：** 通常，在使用 `useState` 时，一开始只需要编写少量代码。而 `useReducer` 必须提前编写 reducer 函数和需要调度的 actions。但是，当多个事件处理程序以相似的方式修改 state 时，`useReducer` 可以减少代码量。
* **可读性：** 当状态更新逻辑足够简单时，`useState` 的可读性还行。但是，一旦逻辑变得复杂起来，它们会使组件变得臃肿且难以阅读。在这种情况下，`useReducer` 允许你将状态更新逻辑与事件处理程序分离开来。
* **可调试性：** 当使用 `useState` 出现问题时, 你很难发现具体原因以及为什么。 而使用 `useReducer` 时， 你可以在 reducer 函数中通过打印日志的方式来观察每个状态的更新，以及为什么要更新（来自哪个 `action`）。 如果所有 `action` 都没问题，你就知道问题出在了 reducer 本身的逻辑中。 然而，与使用 `useState` 相比，你必须单步执行更多的代码。
* **可测试性：** reducer 是一个不依赖于组件的纯函数。这就意味着你可以单独对它进行测试。一般来说，我们最好是在真实环境中测试组件，但对于复杂的状态更新逻辑，针对特定的初始状态和 `action`，断言 reducer 返回的特定状态会很有帮助。
* **个人偏好：** 并不是所有人都喜欢用 reducer，没关系，这是个人偏好问题。你可以随时在 `useState` 和 `useReducer` 之间切换，它们能做的事情是一样的！
=======
- **Code size:** Generally, with `useState` you have to write less code upfront. With `useReducer`, you have to write both a reducer function _and_ dispatch actions. However, `useReducer` can help cut down on the code if many event handlers modify state in a similar way.
- **Readability:** `useState` is very easy to read when the state updates are simple. When they get more complex, they can bloat your component's code and make it difficult to scan. In this case, `useReducer` lets you cleanly separate the _how_ of update logic from the _what happened_ of event handlers.
- **Debugging:** When you have a bug with `useState`, it can be difficult to tell _where_ the state was set incorrectly, and _why_. With `useReducer`, you can add a console log into your reducer to see every state update, and _why_ it happened (due to which `action`). If each `action` is correct, you'll know that the mistake is in the reducer logic itself. However, you have to step through more code than with `useState`.
- **Testing:** A reducer is a pure function that doesn't depend on your component. This means that you can export and test it separately in isolation. While generally it's best to test components in a more realistic environment, for complex state update logic it can be useful to assert that your reducer returns a particular state for a particular initial state and action.
- **Personal preference:** Some people like reducers, others don't. That's okay. It's a matter of preference. You can always convert between `useState` and `useReducer` back and forth: they are equivalent!
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26

如果你在修改某些组件状态时经常出现问题或者想给组件添加更多逻辑时，我们建议你还是使用 reducer。当然，你也不必整个项目都用 reducer，这是可以自由搭配的。你甚至可以在一个组件中同时使用 `useState` 和 `useReducer`。

<<<<<<< HEAD
## 编写一个好的 reducers {/*writing-reducers-well*/}
=======
## Writing reducers well {/* writing-reducers-well */}
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26

编写 `reducers` 时最好牢记以下两点：

<<<<<<< HEAD
* **reducers 必须是纯净的。** 这一点和 [状态更新函数](/learn/queueing-a-series-of-state-updates) 是相似的，`reducers` 在是在渲染时运行的！（actions 会排队直到下一次渲染)。 这就意味着 `reducers` [必须纯净](/learn/keeping-components-pure)，即当输入相同时，输出也是相同的。它们不应该包含异步请求、定时器或者任何副作用（对组件外部有影响的操作）。它们应该以不可变值的方式去更新 [对象](/learn/updating-objects-in-state) 和 [数组](/learn/updating-arrays-in-state)。
* **每个 action 都描述了一个单一的用户交互，即使它会引发数据的多个变化。** 举个例子，如果用户在一个由 `reducer` 管理的表单（包含五个表单项）中点击了 `重置按钮`，那么 dispatch 一个 `reset_form` 的 action 比 dispatch 五个单独的 `set_field` 的 action 更加合理。如果你在一个 `reducer` 中打印了所有的 `action` 日志，那么这个日志应该是很清晰的，它能让你以某种步骤复现已发生的交互或响应。这对代码调试很有帮助！

## 使用 Immer 简化 reducers {/*writing-concise-reducers-with-immer*/}
=======
- **Reducers must be pure.** Similar to [state updater functions](/learn/queueing-a-series-of-state-updates), reducers run during rendering! (Actions are queued until the next render.) This means that reducers [must be pure](/learn/keeping-components-pure)—same inputs always result in the same output. They should not send requests, schedule timeouts, or perform any side effects (operations that impact things outside the component). They should update [objects](/learn/updating-objects-in-state) and [arrays](/learn/updating-arrays-in-state) without mutations.
- **Each action describes a single user interaction, even if that leads to multiple changes in the data.** For example, if a user presses "Reset" on a form with five fields managed by a reducer, it makes more sense to dispatch one `reset_form` action rather than five separate `set_field` actions. If you log every action in a reducer, that log should be clear enough for you to reconstruct what interactions or responses happened in what order. This helps with debugging!

## Writing concise reducers with Immer {/* writing-concise-reducers-with-immer */}
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26

与在平常的 state 中 [修改对象](/learn/updating-objects-in-state#write-concise-update-logic-with-immer) 和 [数组](/learn/updating-arrays-in-state#write-concise-update-logic-with-immer) 一样，你可以使用 `Immer` 这个库来简化 `reducer`。在这里，[`useImmerReducer`](https://github.com/immerjs/use-immer#useimmerreducer) 让你可以通过 `push` 或 `arr[i] =` 来修改 state ：

<Sandpack>

```js App.js
import {useImmerReducer} from 'use-immer';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

function tasksReducer(draft, action) {
  switch (action.type) {
    case 'added': {
      draft.push({
        id: action.id,
        text: action.text,
        done: false,
      });
      break;
    }
    case 'changed': {
      const index = draft.findIndex((t) => t.id === action.task.id);
      draft[index] = action.task;
      break;
    }
    case 'deleted': {
      return draft.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('未知 action：' + action.type);
    }
  }
}

export default function TaskApp() {
  const [tasks, dispatch] = useImmerReducer(tasksReducer, initialTasks);

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
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
<<<<<<< HEAD
      <h1>布拉格的行程安排</h1>
      <AddTask
        onAddTask={handleAddTask}
      />
=======
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26
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
<<<<<<< HEAD
  {id: 0, text: '参观卡夫卡博物馆', done: true},
  {id: 1, text: '看木偶戏', done: false},
  {id: 2, text: '打卡列侬墙', done: false},
=======
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26
];
```

```js AddTask.js hidden
import {useState} from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="添加任务"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
<<<<<<< HEAD
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>添加</button>
=======
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Add
      </button>
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26
    </>
  );
}
```

```js TaskList.js hidden
import {useState} from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
<<<<<<< HEAD
          }} />
        <button onClick={() => setIsEditing(false)}>
          保存
        </button>
=======
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
<<<<<<< HEAD
        <button onClick={() => setIsEditing(true)}>
          编辑
        </button>
=======
        <button onClick={() => setIsEditing(true)}>Edit</button>
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
<<<<<<< HEAD
      <button onClick={() => onDelete(task.id)}>
        删除
      </button>
=======
      <button onClick={() => onDelete(task.id)}>Delete</button>
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
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

Reducers 应该是纯净的，所以它们不应该去修改 state。而 Immer 为你提供了一种特殊的 `draft` 对象，你可以通过它安全的修改 state。在底层，Immer 会基于当前 state 创建一个副本。这就是为什么通过 `useImmerReducer` 来管理 reducers 时，可以修改第一个参数，且不需要返回一个新的 state 的原因。

<Recap>

<<<<<<< HEAD
* 把 `useState` 转化为 `useReducer`：
  1. 通过事件处理函数 dispatch actions；
  2. 编写一个 reducer 函数，它接受传入的 state 和一个 action，并返回一个新的 state；
  3. 使用 `useReducer` 替换 `useState`；
* Reducers 可能需要你写更多的代码，但是这有利于代码的调试和测试。
* Reducers 必须是纯净的。
* 每个 action 都描述了一个单一的用户交互。
* 使用 Immer 来帮助你在 reducer 里直接修改状态。
=======
- To convert from `useState` to `useReducer`:
  1. Dispatch actions from event handlers.
  2. Write a reducer function that returns the next state for a given state and action.
  3. Replace `useState` with `useReducer`.
- Reducers require you to write a bit more code, but they help with debugging and testing.
- Reducers must be pure.
- Each action describes a single user interaction.
- Use Immer if you want to write reducers in a mutating style.
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26

</Recap>

<Challenges>

<<<<<<< HEAD
#### 通过事件处理函数 dispatch actions {/*dispatch-actions-from-event-handlers*/}
=======
#### Dispatch actions from event handlers {/* dispatch-actions-from-event-handlers */}
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26

目前，`ContactList.js` 和 `Chat.js` 中的事件处理程序包含 `// TODO` 注释。这就是为什么输入不起作用，点击按钮也不会改变收件人的原因。

将这两个 `// TODO` 替换为 `dispatch` 相应的 action。如果要查看 action 的结构和类型，请查看 `messerreducer.js` 中的 reducer。reducer 已经写好了，你不需要再修改它。你只需要在 `ContactList.js` 和 `Chat.js` 中 dispatch 相应的 action 即可。

<Hint>

`dispatch` 函数在这两个组件中都是可用的，因为它已经以 prop 的形式传递进来了。因此你需要通过传入相应的 action 对象来调用 `dispatch` 函数。

要检查 action 的对象结构，你可以查看 reducer，看看它需要哪些字段。例如，reducer 中的 `changed_selection` 是这样的：

```js
case 'changed_selection': {
  return {
    ...state,
    selectedId: action.contactId
  };
}
```

这表示你的 `action` 对象应该有一个 `type: 'changed_selection'`。同时你也可以看到代码中用到了 `action.contactId`，所以你需要传入一个 `contactId` 属性到你的 action 对象中。

</Hint>

<Sandpack>

```js App.js
import {useReducer} from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import {initialState, messengerReducer} from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
<<<<<<< HEAD
  message: '你好'
=======
  message: 'Hello',
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('未知 action：' + action.type);
    }
  }
}
```

```js ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
<<<<<<< HEAD
            <button onClick={() => {
              // TODO: 派发 changed_selection
            }}>
              {selectedId === contact.id ? (
                <b>{contact.name}</b>
              ) : (
                contact.name
              )}
=======
            <button
              onClick={() => {
                // TODO: dispatch changed_selection
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js
import {useState} from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
<<<<<<< HEAD
        placeholder={'和 ' + contact.name + ' 聊天'}
        onChange={e => {
          // TODO: 派发 edited_message
          // (从 e.target.value 获取输入框的值)
=======
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          // TODO: dispatch edited_message
          // (Read the input value from e.target.value)
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26
        }}
      />
      <br />
      <button>发送到 {contact.email}</button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

从 reducer 函数的代码中，你可以推断出 actions 需要像下面这样：

```js
// 当用户点击 "Alice"
dispatch({
  type: 'changed_selection',
  contactId: 1,
});

// 当用户输入 "你好！"
dispatch({
  type: 'edited_message',
<<<<<<< HEAD
  message: '你好！'
=======
  message: 'Hello!',
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26
});
```

下面是更新后的示例，可以实现派发相应的消息：

<Sandpack>

```js App.js
import {useReducer} from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import {initialState, messengerReducer} from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
<<<<<<< HEAD
  message: '你好'
=======
  message: 'Hello',
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('未知 action：' + action.type);
    }
  }
}
```

```js ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js
import {useState} from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
<<<<<<< HEAD
        placeholder={'和 ' + contact.name + ' 聊天'}
        onChange={e => {
=======
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button>发送到 {contact.email}</button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

</Solution>

<<<<<<< HEAD
#### 发送消息时清空输入框 {/*clear-the-input-on-sending-a-message*/}
=======
#### Clear the input on sending a message {/* clear-the-input-on-sending-a-message */}
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26

目前，点击 `发送` 没有任何反应。我们需要给 `发送` 按钮添加一个事件处理程序，它将：

1. 显示一个包含收件人电子邮件和信息的 `alert`。
2. 清空输入框。

<Sandpack>

```js App.js
import {useReducer} from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import {initialState, messengerReducer} from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
<<<<<<< HEAD
  message: '你好'
=======
  message: 'Hello',
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('未知 action：' + action.type);
    }
  }
}
```

```js ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js active
import {useState} from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
<<<<<<< HEAD
        placeholder={'和 ' + contact.name + ' 聊天'}
        onChange={e => {
=======
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button>发送到 {contact.email}</button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

在 “发送” 按钮的事件处理程序中，有很多方法可以用来清空输入框。一种方法是显示一个 alert，然后 dispatch 一个名为 `edited_message` 且带有空 `message` 的 action：

<Sandpack>

```js App.js
import {useReducer} from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import {initialState, messengerReducer} from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
<<<<<<< HEAD
  message: '你好'
=======
  message: 'Hello',
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('未知 action：' + action.type);
    }
  }
}
```

```js ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js active
import {useState} from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
<<<<<<< HEAD
        placeholder={'和 ' + contact.name + ' 聊天'}
        onChange={e => {
=======
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
<<<<<<< HEAD
      <button onClick={() => {
        alert(`正在发送 "${message}" 到 ${contact.email}`);
        dispatch({
          type: 'edited_message',
          message: '',
        });
      }}>发送到 {contact.email}</button>
=======
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'edited_message',
            message: '',
          });
        }}>
        Send to {contact.email}
      </button>
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<<<<<<< HEAD
这样当你点击 “发送” 按钮时就会清空输入框。

然而，从用户的角度来看，发送消息与编辑字段是不同的操作。为了体现这一点，你可以创建一个名为 `sent_message` 的新 *action*，并在 reducer 中单独处理：
=======
This works and clears the input when you hit "Send".

However, _from the user's perspective_, sending a message is a different action than editing the field. To reflect that, you could instead create a _new_ action called `sent_message`, and handle it separately in the reducer:
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26

<Sandpack>

```js App.js
import {useReducer} from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import {initialState, messengerReducer} from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js messengerReducer.js active
export const initialState = {
  selectedId: 0,
<<<<<<< HEAD
  message: '你好'
=======
  message: 'Hello',
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    case 'sent_message': {
      return {
        ...state,
        message: '',
      };
    }
    default: {
      throw Error('未知 action：' + action.type);
    }
  }
}
```

```js ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js active
import {useState} from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
<<<<<<< HEAD
        placeholder={'和 ' + contact.name + ' 聊天'}
        onChange={e => {
=======
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
<<<<<<< HEAD
      <button onClick={() => {
        alert(`正在发送 "${message}" 到 ${contact.email}`);
        dispatch({
          type: 'sent_message',
        });
      }}>发送到 {contact.email}</button>
=======
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

结果虽然是一样的。但请记住，action 的类型应该准确描述 “用户做了什么”，而不是 “你希望状态如何改变”。这使得以后添加更多特性变的容易。

不管是哪一种解决方案，最重要的是你 **不要** 把 `alert` 放置在 reducer 中。reducer 必须是一个纯函数——它应该只计算下一个状态。而不应该 “做” 其它事情，包括向用户显示消息。这应该在事件处理程序中处理。（为了便于捕获这样的错误，React 会在严格模式下多次调用你的 reducer。这就是为什么当你在 reducer 中加入一个 alert，它会触发两次的原因。）

</Solution>

<<<<<<< HEAD
#### 切换 tab 时重置输入框内容 {/*restore-input-values-when-switching-between-tabs*/}
=======
#### Restore input values when switching between tabs {/* restore-input-values-when-switching-between-tabs */}
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26

在这个示例中，切换收件人时总是会清空输入框。

```js
case 'changed_selection': {
  return {
    ...state,
    selectedId: action.contactId,
    message: '' // 清空输入框
  };
```

这是因为你不希望在多个收件人之间共享单个邮件草稿。但如果你的应用程序能单独 “记住” 每个联系人的草稿，并在你切换联系人时恢复，那就更好了。

<<<<<<< HEAD
你的任务是改变状态的组织形式，以便能记住 *每个联系人* 的消息草稿。你需要对 reducer、初始状态和组件进行一些修改。
=======
Your task is to change the way the state is structured so that you remember a separate message draft _per contact_. You would need to make a few changes to the reducer, the initial state, and the components.
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26

<Hint>

你可以像下面这样组织 state：

```js
export const initialState = {
  selectedId: 0,
  messages: {
<<<<<<< HEAD
    0: 'Hello, Taylor', // contactId = 0 的草稿
    1: 'Hello, Alice' // contactId = 1 的草稿
  }
=======
    0: 'Hello, Taylor', // Draft for contactId = 0
    1: 'Hello, Alice', // Draft for contactId = 1
  },
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26
};
```

这种 `[key]: value` [计算属性](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#computed_property_names) 可以帮你更新 `messages` 对象：

```js
{
  ...state.messages,
  [id]: message
}
```

</Hint>

<Sandpack>

```js App.js
import {useReducer} from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import {initialState, messengerReducer} from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
<<<<<<< HEAD
  message: '你好'
=======
  message: 'Hello',
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    case 'sent_message': {
      return {
        ...state,
        message: '',
      };
    }
    default: {
      throw Error('未知 action：' + action.type);
    }
  }
}
```

```js ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js
import {useState} from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
<<<<<<< HEAD
        placeholder={'和 ' + contact.name + ' 聊天'}
        onChange={e => {
=======
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
<<<<<<< HEAD
      <button onClick={() => {
        alert(`正在发送 "${message}" 到 ${contact.email}`);
        dispatch({
          type: 'sent_message',
        });
      }}>发送到 {contact.email}</button>
=======
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

You'll need to update the reducer to store and update a separate message draft per contact:

```js
// 当输入框内容被修改时
case 'edited_message': {
  return {
    // 保存其它的 state，比如当前选中的
    ...state,
    messages: {
      // 保存其他联系人的消息
      ...state.messages,
      // 改变当前联系人的消息
      [state.selectedId]: action.message
    }
  };
}
```

You would also update the `Messenger` component to read the message for the currently selected contact:

```js
const message = state.messages[state.selectedId];
```

Here is the complete solution:

<Sandpack>

```js App.js
import {useReducer} from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import {initialState, messengerReducer} from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.messages[state.selectedId];
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor',
    1: 'Hello, Alice',
    2: 'Hello, Bob',
  },
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message,
        },
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: '',
        },
      };
    }
    default: {
      throw Error('未知 action：' + action.type);
    }
  }
}
```

```js ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js
import {useState} from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
<<<<<<< HEAD
        placeholder={'和 ' + contact.name + ' 聊天'}
        onChange={e => {
=======
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
<<<<<<< HEAD
      <button onClick={() => {
        alert(`正在发送 "${message}" 到 ${contact.email}`);
        dispatch({
          type: 'sent_message',
        });
      }}>发送到 {contact.email}</button>
=======
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

显然，你不再需要通过修改任何事件处理程序来实现不同的行为。但如果没使用 reducer 的话，你不得不在每个事件处理程序中去更新状态。

</Solution>

<<<<<<< HEAD
#### 从零开始实现 `useReducer` {/*implement-usereducer-from-scratch*/}

在前面的例子中，你从 React 中导入了 `useReducer` Hook。现在，你将学习自己实现 `useReducer` Hook。你可以从这个模板开始，它不会超过 10 行代码。
=======
#### Implement `useReducer` from scratch {/* implement-usereducer-from-scratch */}

In the earlier examples, you imported the `useReducer` Hook from React. This time, you will implement _the `useReducer` Hook itself!_ Here is a stub to get you started. It shouldn't take more than 10 lines of code.
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26

为了验证你的修改，试着在输入框中输入文字或选择联系人。

<Hint>

下面是一个更加详细的基本实现：

```js
export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    // ???
  }

  return [state, dispatch];
}
```

回想一下，reducer 函数接受两个参数——当前的 state 和 action 对象——并返回下一个 state。你的 `dispatch` 应该用它做什么？

</Hint>

<Sandpack>

```js App.js
import {useReducer} from './MyReact.js';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import {initialState, messengerReducer} from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.messages[state.selectedId];
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor',
    1: 'Hello, Alice',
    2: 'Hello, Bob',
  },
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message,
        },
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: '',
        },
      };
    }
    default: {
      throw Error('未知 action：' + action.type);
    }
  }
}
```

```js MyReact.js active
import {useState} from 'react';

export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  // ???

  return [state, dispatch];
}
```

```js ContactList.js hidden
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js hidden
import {useState} from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
<<<<<<< HEAD
        placeholder={'和 ' + contact.name + ' 聊天'}
        onChange={e => {
=======
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
<<<<<<< HEAD
      <button onClick={() => {
        alert(`正在发送 "${message}" 到 ${contact.email}`);
        dispatch({
          type: 'sent_message',
        });
      }}>发送到 {contact.email}</button>
=======
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

dispatch 一个 action 去调用一个具有当前 state 和 action 的 reducer，并将结果存储为下一个 state。下面是它在代码中的样子：

<Sandpack>

```js App.js
import {useReducer} from './MyReact.js';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import {initialState, messengerReducer} from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.messages[state.selectedId];
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor',
    1: 'Hello, Alice',
    2: 'Hello, Bob',
  },
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message,
        },
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: '',
        },
      };
    }
    default: {
      throw Error('未知 action：' + action.type);
    }
  }
}
```

```js MyReact.js active
import {useState} from 'react';

export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    const nextState = reducer(state, action);
    setState(nextState);
  }

  return [state, dispatch];
}
```

```js ContactList.js hidden
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js hidden
import {useState} from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
<<<<<<< HEAD
        placeholder={'和 ' + contact.name + ' 聊天'}
        onChange={e => {
=======
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
<<<<<<< HEAD
      <button onClick={() => {
        alert(`正在发送 "${message}" 到 ${contact.email}`);
        dispatch({
          type: 'sent_message',
        });
      }}>发送到 {contact.email}</button>
=======
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

虽然在大多数情况下这并不重要，但更准确的实现是这样的：

```js
function dispatch(action) {
  setState((s) => reducer(s, action));
}
```

<<<<<<< HEAD
这是因为被派发的 actions 在下一次渲染之前都是处于排队状态的，这和 [状态更新函数](/learn/queueing-a-series-of-state-updates) 类似。
=======
This is because the dispatched actions are queued until the next render, [similar to the updater functions.](/learn/queueing-a-series-of-state-updates)
>>>>>>> e3073b03a5b9eff4ef12998841b9e56120f37e26

</Solution>

</Challenges>
