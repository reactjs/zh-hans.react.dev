---
title: 选择 state 结构
translators: 
  - Davont
---

<Intro>

构建良好的 state 可以在一个易于修改和调试的组件与一个不断产生错误的组件之间产生对比。以下是你在构建 state 时应该考虑的一些建议。

</Intro>

<YouWillLearn>

* 何时使用单个 state 变量与多个 state 变量
* 组织 state 时应避免的事项
* 如何解决 state 结构中的常见问题

</YouWillLearn>

## state 结构的原则

当你写一个含有一些 state 的组件时，你必须对使用多少个 state 变量以及它们怎样的数据模型做出选择。尽管使用次优的 state 结构也有可能写出正确的程序，但有一些原则可以指导你做出更好的选择：

1. **组合关联的 state。** 如果你总是同时更新两个或更多的 state 变量，可以考虑将它们合并为一个 state 变量。
2. **避免 state 之间出现矛盾。** 当 state 是由几个相互矛盾或"不一致"的 state 构建而成的时候，你就可能为此会留下隐患。尽量避免这种情况。
3. **避免冗余的 state。** 如果你能在渲染过程中从组件的 props 或其现有的 state 变量中计算出一些信息，你就不应该把这些信息放到该组件的 state 中。
4. **避免重复的 state。** 当同一数据在多个 state 变量之间或嵌套对象中重复时，会很难保持它们同步。所以尽可能减少重复。
5. **避免深度嵌套的 state。** 深层次的 state 更新起来不是很方便。如果可能的话，要更倾向于以扁平的方式构造 state。

这些原则背后的目标是 *使 state 易于更新而不引入错误*。从 state 中删除冗余和重复数据有助于确保它的不同部分不会失去同步。这类似于数据库工程师可能希望将 [数据库结构“规范化”](https://docs.microsoft.com/en-us/office/troubleshoot/access/database-normalization-description)，以减少出现错误的机会。用爱因斯坦的话说， **“让你的状态尽可能简单，但不要更简单。”**

现在让我们来看看这些原则在实际中是如何应用的。

## 组合关联的 state

你有时可能不确定是使用单个还是多个 state 变量。

你应该像下面这样做吗？

```js
const [x, setX] = useState(0);
const [y, setY] = useState(0);
```

或这样？

```js
const [position, setPosition] = useState({ x: 0, y: 0 });
```

从技术上讲，你可以使用这些方法中的任何一种。但是 **如果某些两个 state 变量总是一起变化，把它们统一成一个 state 变量可能是个好主意**。这样你就不会忘记始终保持它们的同步，就像在这个例子中，悬停时更新红点的两个坐标：

<Sandpack>

```js
import { useState } from 'react';
export default function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  return (
    <div
      onPointerMove={e => {
        setPosition({
          x: e.clientX,
          y: e.clientY
        });
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}>
      <div style={{
        position: 'absolute',
        backgroundColor: 'red',
        borderRadius: '50%',
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: -10,
        top: -10,
        width: 20,
        height: 20,
      }} />
    </div>
  )
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```

</Sandpack>

另一种将数据分组到一个对象或一个数组中的情况是，当你不知道需要多少个不同的 state 片段时。 例如，当你有一个用户可以添加自定义字段的表单时，这会很有帮助。

<Gotcha>

如果你的 state 变量是一个对象时，记住你不能只更新其中的一个字段而不明确复制其他字段。例如，在上面的例子中，你不能写成 `setPosition({ x: 100 })`，因为它根本就没有 `y` 属性! 相反，如果你想单独设置 `x`，你要么做 `setPosition({ ...position, x: 100 })`，要么你需要把它们分成两个 state 变量，做 `setX(100)`。

</Gotcha>

## 避免 state 之间出现矛盾

下面是一个带有 `isSending` 和 `isSent` 两个 state 变量的表单：

<Sandpack>

```js
import { useState } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSending(true);
    await sendMessage(text);
    setIsSending(false);
    setIsSent(true);
  }

  if (isSent) {
    return <h1>Sent!</h1>
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        disabled={isSending}
        type="submit"
      >
        Send
      </button>
      {isSending && <p>Sending...</p>}
    </form>
  );
}

// Pretend to send a message.
function sendMessage(text) {
  return new Promise(resolve => {
    setTimeout(resolve, 2000);
  });
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

尽管这段代码是有效的，但它为"不可能"的 state 留下了大门。例如，如果你忘记同时调用 `setIsSent` 和 `setIsSending`，这就可能会出现 `isSending` 和 `isSent` 同时为 `true` 的情况。你的组件越复杂，就越难理解发生了什么。

**因为 `isSending` 和 `isSent` 不应该同时为 `true`，所以最好用一个 `status` 变量来代替它们，这个 state 变量可以采取 *三种* 有效状态之一：**`'typing'` (初始), `'sending'`, 和 `'sent'`:

<Sandpack>

```js
import { useState } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const [status, setStatus] = useState('typing');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    await sendMessage(text);
    setStatus('sent');
  }

  const isSending = status === 'sending';
  const isSent = status === 'sent';

  if (isSent) {
    return <h1>Sent!</h1>
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        disabled={isSending}
        type="submit"
      >
        Send
      </button>
      {isSending && <p>Sending...</p>}
    </form>
  );
}

// Pretend to send a message.
function sendMessage(text) {
  return new Promise(resolve => {
    setTimeout(resolve, 2000);
  });
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

你仍然可以声明一些常量，以保证可读性：

```js
const isSending = status === 'sending';
const isSent = status === 'sent';
```

但它们不是 state 变量，所以你不需要担心它们会互相不同步。

## 避免冗余的 state

如果你能在渲染过程中从组件的 props 或其现有的 state 变量中计算出一些信息，你就不应该把这些信息放到该组件的 state 中。

例如，以这个表单为例。它可以运行，但你能在其中找到任何冗余的 state 吗？

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
    setFullName(e.target.value + ' ' + lastName);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
    setFullName(firstName + ' ' + e.target.value);
  }

  return (
    <>
      <label>
        First name:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <h3>
        Your full name is: {fullName}
      </h3>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

这个表单有三个 state 变量：`firstName`、`lastName` 和 `fullName`。然而，`fullName` 是多余的。**你总是可以在渲染过程中从 `firstName` 和 `lastName` 中计算出 `fullName`，所以要把它从 state 中删除。**

你可以这样做：

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const fullName = firstName + ' ' + lastName;

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <label>
        First name:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <h3>
        Your full name is: {fullName}
      </h3>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

这里，`fullName` *不是* 一个 state 变量。相反，它是在渲染过程中计算的：

```js
const fullName = firstName + ' ' + lastName;
```

因此，更改处理程序不需要做任何特殊的事情来更新它。 当你调用 `setFirstName` 或 `setLastName` 时，您会触发一次重新渲染，然后将根据新数据计算下一个 `fullName`。

<DeepDive title="Don't mirror props in state">

一个常见的冗余的 state 示例是这样的代码：

```js
function Message({ messageColor }) {
  const [color, setColor] = useState(messageColor);
```

这里，一个 `color` state 变量被初始化为 `messageColor` props 值。 这段代码的问题在于，**如果父组件稍后传递不同的 `messageColor` 值（例如，将其从 `'blue'` 更改为 `'red'`），则`color` *state 变量*将不会更新！** state 仅在第一次渲染期间初始化。

这就是为什么在这样的 state 变量中 "镜像 "一些道具会导致混乱的原因。相反，在你的代码中直接使用 `messageColor` 属性。如果你想在你的组件中给它一个更短的名字，可以使用一个普通的常量：

```js
function Message({ messageColor }) {
  const color = messageColor;
```

这样它就会与从父组件传递的 prop 同步。

只有当你 *想要* 忽略特定 props 属性的所有更新时，将 props “镜像”到 state 才有意义。按照惯例，prop 名称以 `initial` 或 `default` 开头，以阐明该 prop 的新值将被忽略：

```js
function Message({ initialColor }) {
  // The `color` state variable holds the *first* value of `initialColor`.
  // Further changes to the `initialColor` prop are ignored.
  const [color, setColor] = useState(initialColor);
```

</DeepDive>

## 避免重复的 state 

此菜单列表组件可让你从以下几道菜中选择一道菜：

<Sandpack>

```js
import { useState } from 'react';

const initialItems = [
  { title: 'Raddish', id: 0 },
  { title: 'Celery', id: 1 },
  { title: 'Carrot', id: 2 },
]

export default function CafeMenu() {
  const [items, setItems] = useState(initialItems);
  const [selectedItem, setSelectedItem] = useState(
    items[0]
  );

  return (
    <>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.title}
            {' '}
            <button onClick={() => {
              setSelectedItem(item);
            }}>Choose</button>
          </li>
        ))}
      </ul>
      <p>You picked {selectedItem.title}</p>
    </>
  );
}
```

</Sandpack>

目前，它将所选菜作为对象存储在 `selectedItem` state 变量中。 然而，这不是很好：**`selectedItem` 的内容与 `items` 列表中的项目之一是同一个对象。**这意味着关于项目本身的信息在两个地方重复。

为什么这是个问题？ 让我们使每个项目都可以编辑：

<Sandpack>

```js
import { useState } from 'react';

const initialItems = [
  { title: 'Raddish', id: 0 },
  { title: 'Celery', id: 1 },
  { title: 'Carrot', id: 2 },
]

export default function CafeMenu() {
  const [items, setItems] = useState(initialItems);
  const [selectedItem, setSelectedItem] = useState(
    items[0]
  );

  function handleItemChange(id, e) {
    setItems(items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          title: e.target.value,
        };
      } else {
        return item;
      }
    }));
  }

  return (
    <>
      <ul>
        {items.map((item, index) => (
          <li key={item.id}>
            <input
              value={item.title}
              onChange={e => {
                handleItemChange(item.id, e)
              }}
            />
            {' '}
            <button onClick={() => {
              setSelectedItem(item);
            }}>Choose</button>
          </li>
        ))}
      </ul>
      <p>You picked {selectedItem.title}</p>
    </>
  );
}
```

</Sandpack>

请注意，如果你首先单击菜单上的 “Choose” 并 *then* 编辑它，**输入会更新，但底部的标签不会反映编辑内容。** 这是因为你有重复的 state，而你忘记了更新 `selectedItem`。

尽管你也可以更新 `selectedItem`，但更简单的解决方法是删除重复项。在这个例子中，你将 `selectedId` 保持在 state 中，而不是在 `selectedItem` 对象（它创建了一个与 `items` 内重复的对象），然后 *then* 通过搜索 `items` 数组来获取 `selectedItem` 具有该 ID 的菜：

<Sandpack>

```js
import { useState } from 'react';

const initialItems = [
  { title: 'Raddish', id: 0 },
  { title: 'Celery', id: 1 },
  { title: 'Carrot', id: 2 },
]

export default function CafeMenu() {
  const [items, setItems] = useState(initialItems);
  const [selectedId, setSelectedId] = useState(0);

  const selectedItem = items.find(item =>
    item.id === selectedId
  );

  function handleItemChange(id, e) {
    setItems(items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          title: e.target.value,
        };
      } else {
        return item;
      }
    }));
  }

  return (
    <>
      <ul>
        {items.map((item, index) => (
          <li key={item.id}>
            <input
              value={item.title}
              onChange={e => {
                handleItemChange(item.id, e)
              }}
            />
            {' '}
            <button onClick={() => {
              setSelectedId(item.id);
            }}>Choose</button>
          </li>
        ))}
      </ul>
      <p>You picked {selectedItem.title}</p>
    </>
  );
}
```

</Sandpack>

(或者，你可以将所选索引保持在 state 中。)

state 过去常常是这样复制的：

* `items = [{ id: 0, text: 'Raddish'}, ...]`
* `selectedItem = {id: 0, text: 'Raddish}`

但是改了之后是这样的：

* `items = [{ id: 0, text: 'Raddish'}, ...]`
* `selectedId = 0`

重复的 state 没有了，你只要保留必要的 state！

现在，如果您编辑 *selected* 项目，下面的消息将立即更新。这是因为 `setItems` 会触发重新渲染，而 `items.find(...)` 会找到带有更新文本的项目。你不需要保持 *选定的项目* 在 state 中，因为只有 *选定的 ID* 是必需的。其余的可以在渲染期间计算。

## 避免深度嵌套的 state

想象一下一个任务可以任意嵌套的待办事项列表。你可能想用嵌套的对象和数组来构造它的 state，就像在这个例子：

<Sandpack>

```js
import { useState } from 'react';

const initialRootTask = {
  id: 1,
  text: 'Root task',
  childTasks: [{
    id: 2,
    text: 'First subtask',
    childTasks: [{
      id: 3,
      text: 'First subtask of first subtask',
      childTasks: []
    }]
  }, {
    id: 4,
    text: 'Second subtask',
    childTasks: [{
      id: 5,
      text: 'First subtask of second subtask',
      childTasks: [],
    }, {
      id: 6,
      text: 'Second subtask of second subtask',
      childTasks: [],
    }]
  }]
};

function Task({ task }) {
  const childTasks = task.childTasks;
  return (
    <>
      <li>{task.text}</li>
      {childTasks.length > 0 && (
        <ol>
          {childTasks.map(task => (
            <Task key={task.id} task={task} />
          ))}
        </ol>
      )}
    </>
  );
}

export default function TaskManager() {
  const [root, setRoot] = useState(initialRootTask);
  return <ol><Task task={root} /></ol>;
}
```

</Sandpack>

现在假设你想添加一个按钮来删除一个任务。你会如何去做呢？ [更新嵌套 state](/learn/updating-objects-and-arrays-in-state#updating-nested-objects-and-arrays) 涉及到从改变的部分开始一路复制对象。例如，删除一个深度嵌套的任务将涉及复制其整个父任务链。对于深度嵌套的 state，这可能是非常麻烦的。

**如果 state 的嵌套太多，不容易更新，可以考虑把它变成"扁平"的。**这里有一种方法可以重组这个数据。你可以让每个任务持有一个 *它的子任务* 的数组，而不是像树状结构那样，每个 `task` 都有一个数组。然后你可以存储一个从每个任务 ID 到相应任务的映射。

这种数据的重组可能会让你想起看到一个数据库表格：

<Sandpack>

```js
import { useState } from 'react';

const initialTasksById = {
  1: {
    id: 1,
    text: 'Root task',
    childIds: [2, 4]
  },
  2: {
    id: 2,
    text: 'First subtask',
    childIds: [3]
  }, 
  3: {
    id: 3,
    text: 'First subtask of first subtask',
    childIds: []
  },
  4: {
    id: 4,
    text: 'Second subtask',
    childIds: [5, 6],   
  },
  5: {
    id: 5,
    text: 'First subtask of second subtask',
    childIds: [],   
  },
  6: {
    id: 6,
    text: 'Second subtask of second subtask',
    childIds: [],   
  },
};

function Task({ id, tasksById }) {
  const task = tasksById[id];
  const childIds = task.childIds;
  return (
    <>
      <li>{task.text}</li>
      {childIds.length > 0 && (
        <ol>
          {childIds.map(childId => (
            <Task
              key={childId}
              id={childId}
              tasksById={tasksById}
            />
          ))}
        </ol>
      )}
    </>
  );
}

export default function TaskManager() {
  const [
    tasksById,
    setTasksById
  ] = useState(initialTasksById);
  return (
    <ol>
      <Task
        id={1}
        tasksById={tasksById}
      />
    </ol>
  );
}
```

</Sandpack>

**现在，state 是 "扁平式"（也被称为 "规范化"），更新嵌套项目变得更加容易。**

现在为了删除任务，您只需要更新两个级别的 state：

- 下一个版本的 *parent* 任务不应该在其 `childIds` 数组中包含已删除的子任务的 ID。
- 原始根对象 `tasksById` 的下一个版本应该包括父任务的新版本。

下面是一个如何去做的例子： 

<Sandpack>

```js
import { useState } from 'react';

const initialTasksById = {
  1: {
    id: 1,
    text: 'Root task',
    childIds: [2, 4]
  },
  2: {
    id: 2,
    text: 'First subtask',
    childIds: [3]
  }, 
  3: {
    id: 3,
    text: 'First subtask of first subtask',
    childIds: []
  },
  4: {
    id: 4,
    text: 'Second subtask',
    childIds: [5, 6],   
  },
  5: {
    id: 5,
    text: 'First subtask of second subtask',
    childIds: [],   
  },
  6: {
    id: 6,
    text: 'Second subtask of second subtask',
    childIds: [],   
  },
};

export default function TaskManager() {
  const [
    tasksById,
    setTasksById
  ] = useState(initialTasksById);

  function handleRemove(parentId, childId) {
    const parent = tasksById[parentId];
    // Create a new version of the parent task
    // that doesn't include this child ID.
    const nextParent = {
      ...parent,
      childIds: parent.childIds
        .filter(id => id !== childId)
    }
    // Update the root state object...
    setTasksById({
      ...tasksById,
      // ...so that it has the updated parent.
      [parentId]: nextParent,
    });
  }

  return (
    <ol>
      <Task
        id={1}
        parentId={0}
        tasksById={tasksById}
        onRemove={handleRemove}
      />
    </ol>
  );
}

function Task({ id, parentId, tasksById, onRemove }) {
  const task = tasksById[id];
  const childIds = task.childIds;
  return (
    <>
      <li>
        {task.text}
        {parentId !== 0 &&
          <button onClick={() => {
            onRemove(parentId, id);
          }}>
            Remove
          </button>
        }
      </li>
      {childIds.length > 0 &&
        <ol>
          {childIds.map(childId => (
            <Task
              key={childId}
              id={childId}
              parentId={id}
              tasksById={tasksById}
              onRemove={onRemove}
            />
          ))}
        </ol>
      }
    </>
  );
}

```

```css
button { margin: 10px; }
```

</Sandpack>

你可以随心所欲地嵌套 state，但使其 "扁平化" 可以解决许多问题。它使 state 更容易更新，并确保你在嵌套对象的不同部分没有重复。

<DeepDive title="Improving memory usage">

理想情况下，你还可以添加一些逻辑，从 `itemsById` 对象中删除已删除的项目（及其子项！），以提高内存利用率。

这个版本就是这样做的。 它还 [使用 Immer](/learn/updating-objects-in-state#write-concise-update-logic-with-immer) 使更新逻辑更加简洁。

<Sandpack>

```js
import { useImmer } from 'use-immer';

const initialTasksById = {
  1: {
    id: 1,
    text: 'Root task',
    childIds: [2, 4]
  },
  2: {
    id: 2,
    text: 'First subtask',
    childIds: [3]
  }, 
  3: {
    id: 3,
    text: 'First subtask of first subtask',
    childIds: []
  },
  4: {
    id: 4,
    text: 'Second subtask',
    childIds: [5, 6],   
  },
  5: {
    id: 5,
    text: 'First subtask of second subtask',
    childIds: [],   
  },
  6: {
    id: 6,
    text: 'Second subtask of second subtask',
    childIds: [],   
  },
};

export default function TaskManager() {
  const [
    tasksById,
    updateTasksById
  ] = useImmer(initialTasksById);

  function handleRemove(parentId, childId) {
    updateTasksById(draft => {
      // Remove from the parent task's child IDs.
      const parent = draft[parentId];
      parent.childIds = parent.childIds
        .filter(id => id !== childId);

      // Forget this task and all its subtree.
      deleteAllChildren(childId);
      function deleteAllChildren(id) {
        const task = draft[id];
        task.childIds.forEach(deleteAllChildren);
        delete draft[id];
      }
    });
  }

  return (
    <ol>
      <Task
        id={1}
        parentId={0}
        tasksById={tasksById}
        onRemove={handleRemove}
      />
    </ol>
  );
}

function Task({ id, parentId, tasksById, onRemove }) {
  const task = tasksById[id];
  const childIds = task.childIds;
  return (
    <>
      <li>
        {task.text}
        {parentId !== 0 &&
          <button onClick={() => {
            onRemove(parentId, id);
          }}>
            Remove
          </button>
        }
      </li>
      {childIds.length > 0 &&
        <ol>
          {childIds.map(childId => (
            <Task
              key={childId}
              id={childId}
              parentId={id}
              tasksById={tasksById}
              onRemove={onRemove}
            />
          ))}
        </ol>
      }
    </>
  );
}

```

```css
button { margin: 10px; }
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

</DeepDive>

有时，你也可以通过将一些嵌套的 state 移到子组件中来减少 state 的嵌套。这对那些不需要存储的短暂的 UI state 很有效，比如一个项目是否被悬停。

<Recap>

* 如果两个 state 变量总是一起更新，可以考虑将它们合并为一个变量。
* 仔细选择你的 state 变量以避免产生 "不可能" 的 state。
* 用一种能减少你在更新 state 时出错的机会的方式来构造你的 state。
* 避免冗余的和重复的 state，这样你就不需要保持同步了。
* 不要把 props *保存* state 中，除非你特别想阻止更新。
* 对于像选择这样的 UI 模式，在 state 中保留 ID 或索引而不是对象本身。
* 如果更新深度嵌套的 state 是很麻烦的，可以尝试把它扁平化。

</Recap>



<Challenges>

### 修复未更新的组件

这个 `Clock` 组件接收两个 props：`color` 和 `time`。当你在选择框中选择一个不同的颜色时，`Clock` 组件会从其父组件收到不同的 `color` 属性。但是，由于某些原因，显示的颜色并没有更新。 为什么呢？要解决这个问题。

<Sandpack>

```js Clock.js active
import { useState } from 'react';

export default function Clock(props) {
  const [color, setColor] = useState(props.color);
  return (
    <h1 style={{ color: color }}>
      {props.time}
    </h1>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  const [color, setColor] = useState('lightcoral');
  return (
    <div>
      <p>
        Pick a color:{' '}
        <select value={color} onChange={e => setColor(e.target.value)}>
          <option value="lightcoral">lightcoral</option>
          <option value="midnightblue">midnightblue</option>
          <option value="rebeccapurple">rebeccapurple</option>
        </select>
      </p>
      <Clock color={color} time={time.toLocaleTimeString()} />
    </div>
  );
}
```

</Sandpack>

<Solution>

这个问题在于这个组件的 `color` state 是用 `color` props 属性的初始值初始化的。但是当 `color` props 属性发生变化时，这并不影响 state 变量！所以它们就不同步了。要解决这个问题，请完全删除 state 变量，并直接使用`color` props 属性。

<Sandpack>

```js Clock.js active
import { useState } from 'react';

export default function Clock(props) {
  return (
    <h1 style={{ color: props.color }}>
      {props.time}
    </h1>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  const [color, setColor] = useState('lightcoral');
  return (
    <div>
      <p>
        Pick a color:{' '}
        <select value={color} onChange={e => setColor(e.target.value)}>
          <option value="lightcoral">lightcoral</option>
          <option value="midnightblue">midnightblue</option>
          <option value="rebeccapurple">rebeccapurple</option>
        </select>
      </p>
      <Clock color={color} time={time.toLocaleTimeString()} />
    </div>
  );
}
```

</Sandpack>

或者，使用去结构化的语法。

<Sandpack>

```js Clock.js active
import { useState } from 'react';

export default function Clock({ color, time }) {
  return (
    <h1 style={{ color: color }}>
      {time}
    </h1>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  const [color, setColor] = useState('lightcoral');
  return (
    <div>
      <p>
        Pick a color:{' '}
        <select value={color} onChange={e => setColor(e.target.value)}>
          <option value="lightcoral">lightcoral</option>
          <option value="midnightblue">midnightblue</option>
          <option value="rebeccapurple">rebeccapurple</option>
        </select>
      </p>
      <Clock color={color} time={time.toLocaleTimeString()} />
    </div>
  );
}
```

</Sandpack>

</Solution>

### 修复损坏的任务计数器

这个待办事项列表有一个页脚，显示完成了多少任务，以及总体有多少任务。它一开始似乎是有效的，但它也是有缺陷的。例如，如果你把一项任务标记为已完成，然后删除它，计数器就不会正确更新。修复计数器，使其总是正确的。

<Hint>

这个例子中的某些 state 是多余的吗？

</Hint>

<Sandpack>

```js App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, text: 'Buy milk', done: true },
  { id: 1, text: 'Eat tacos', done: false },
  { id: 2, text: 'Brew tea', done: false },
];

export default function TaskBoard() {
  const [text, setText] = useState('');
  const [todos, setTodos] = useState(
    initialTodos
  );
  const [total, setTotal] = useState(3);
  const [done, setDone] = useState(1);

  function handleAddTodo(text) {
    setTotal(total + 1);
    setTodos([
      ...todos,
      {
        id: nextId++,
        text: text,
        done: false
      }
    ]);
  }

  function handleChangeTodo(nextTodo) {
    if (nextTodo.done) {
      setDone(done + 1);
    } else {
      setDone(done - 1);
    }
    setTodos(todos.map(t => {
      if (t.id === nextTodo.id) {
        return nextTodo;
      } else {
        return t;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    setTotal(total - 1);
    setTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>  
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
      <hr />
      <b>{done} out of {total} done!</b>
    </>
  );
}
```

```js AddTodo.js hidden
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTodo(text);
      }}>Add</button>
    </>
  )
}
```

```js TaskList.js hidden
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <label>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={e => {
                onChangeTodo({
                  ...todo,
                  done: e.target.checked
                });
              }}
            />
            {' '}
            {todo.text}
          </label>
          <button onClick={() => onDeleteTodo(todo.id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

<Solution>

尽管你可以仔细地改变每个事件处理程序，以正确地更新 `total` 和 `done` 计数器，但根本问题在于这些 state 变量的存在。它们是多余的，因为你总是可以从 `todos` 数组本身计算出任务的数量（已完成或总数）。删除多余的 state 来修复这个错误。

<Sandpack>

```js App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, text: 'Buy milk', done: true },
  { id: 1, text: 'Eat tacos', done: false },
  { id: 2, text: 'Brew tea', done: false },
];

export default function TaskBoard() {
  const [text, setText] = useState('');
  const [todos, setTodos] = useState(
    initialTodos
  );

  const total = todos.length;
  const done = todos
    .filter(t => t.done)
    .length;

  function handleAddTodo(text) {
    setTodos([
      ...todos,
      {
        id: nextId++,
        text: text,
        done: false
      }
    ]);
  }

  function handleChangeTodo(nextTodo) {
    setTodos(todos.map(t => {
      if (t.id === nextTodo.id) {
        return nextTodo;
      } else {
        return t;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    setTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>  
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
      <hr />
      <b>{done} out of {total} done!</b>
    </>
  );
}
```

```js AddTodo.js hidden
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTodo(text);
      }}>Add</button>
    </>
  )
}
```

```js TaskList.js hidden
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <label>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={e => {
                onChangeTodo({
                  ...todo,
                  done: e.target.checked
                });
              }}
            />
            {' '}
            {todo.text}
          </label>
          <button onClick={() => onDeleteTodo(todo.id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

请注意事件处理程序在此更改之后是如何只关注调用 `setTodos` 的。现在的待办事项计数是在下次渲染时从 `todos` 中计算的，所以它们总是最新的。

</Solution>

### 修复消失的选项

state 中有一个 `letters` 列表。当你悬停或聚焦特定字母时，它会突出显示。当前突出显示的字母存储在 `highlightedLetter` state 变量中。你可以为单个字母 `加星标` 和 `取消星标`，这会更新 state 中的 `letters` 数组。

这段代码可以工作，但有一个小小的 UI 故障。当你按下 "Star "或 "Unstar" 时，高亮显示会消失一会。但是，只要你移动你的指针或用键盘切换到另一个字母，它就会重新出现。为什么会这样？修复它吧，使高亮显示在点击按钮后不会消失。

<Sandpack>

```js App.js
import { useState } from 'react';
import { initialLetters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [
    letters,
    setLetters
  ] = useState(initialLetters);
  const [
    highlightedLetter,
    setHighlightedLetter
  ] = useState(null);

  function handleHover(letter) {
    setHighlightedLetter(letter);
  }

  function handleStar(starred) {
    setLetters(letters.map(letter => {
      if (letter.id === starred.id) {
        return {
          ...letter,
          isStarred: !letter.isStarred
        };
      } else {
        return letter;
      }
    }));
  }

  return (
    <ul>
      {letters.map(letter => (
        <Letter
          key={letter.id}
          letter={letter}
          isHighlighted={
            letter === highlightedLetter
          }
          onHover={handleHover}
          onToggleStar={handleStar}
        />
      ))}
    </ul>
  );
}
```

```js Letter.js
export default function Letter({
  letter,
  isHighlighted,
  onHover,
  onToggleStar,
}) {
  return (
    <li
      className={
        isHighlighted ? 'highlighted' : ''
      }
      onFocus={() => {
        onHover(letter);        
      }}
      onPointerMove={() => {
        onHover(letter);
      }}
    >
      <button onClick={() => {
        onToggleStar(letter);
      }}>
        {letter.isStarred ? 'Unstar' : 'Star'}
      </button>
      {letter.subject}
    </li>
  )
}
```

```js data.js
export const initialLetters = [{
  id: 0,
  subject: 'How are you?',
  isStarred: true,
}, {
  id: 1,
  subject: 'Your taxes are due',
  isStarred: false,
}, {
  id: 2,
  subject: 'Reminder: dentist',
  isStarred: false,
}];
```

```css
button { margin: 5px; }
li { border-radius: 5px; }
.highlighted { background: #d2eaff; }
```

</Sandpack>

<Solution>

这里的问题是你将字母对象保存在 `highlightedLetter` 中。但是你也在 `letters` 数组本身中保存了它的信息。所以你的 state 是重复的！当你在按钮点击后更新 `letters` 数组时，你会创建一个不同于 `highlightedLetter` 的新字母对象。这就是为什么 `highlightedLetter === letter` 的检查变为 `false`，并且高亮消失的原因。下次当指针移动时，它在调用 `setHighlightedLetter` 时它会重新出现。

为了解决这个问题，请从 state 中删除重复的内容。不要在两个地方存储 *字母本身*，而是存储 `highlightedId`。然后你可以用 `letter.id === highlightedId` 来检查每个字母的 `isHighlighted`，即使 `letter` 对象在上次渲染后发生了变化，它也是有效的。

<Sandpack>

```js App.js
import { useState } from 'react';
import { initialLetters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [
    letters,
    setLetters
  ] = useState(initialLetters);
  const [
    highlightedId,
    setHighlightedId
  ] = useState(null);

  function handleHover(letterId) {
    setHighlightedId(letterId);
  }

  function handleStar(starredId) {
    setLetters(letters.map(letter => {
      if (letter.id === starredId) {
        return {
          ...letter,
          isStarred: !letter.isStarred
        };
      } else {
        return letter;
      }
    }));
  }

  return (
    <ul>
      {letters.map(letter => (
        <Letter
          key={letter.id}
          letter={letter}
          isHighlighted={
            letter.id === highlightedId
          }
          onHover={handleHover}
          onToggleStar={handleStar}
        />
      ))}
    </ul>
  );
}
```

```js Letter.js
export default function Letter({
  letter,
  isHighlighted,
  onHover,
  onToggleStar,
}) {
  return (
    <li
      className={
        isHighlighted ? 'highlighted' : ''
      }
      onFocus={() => {
        onHover(letter.id);        
      }}
      onPointerMove={() => {
        onHover(letter.id);
      }}
    >
      <button onClick={() => {
        onToggleStar(letter.id);
      }}>
        {letter.isStarred ? 'Unstar' : 'Star'}
      </button>
      {letter.subject}
    </li>
  )
}
```

```js data.js
export const initialLetters = [{
  id: 0,
  subject: 'How are you?',
  isStarred: true,
}, {
  id: 1,
  subject: 'Your taxes are due',
  isStarred: false,
}, {
  id: 2,
  subject: 'Reminder: dentist',
  isStarred: false,
}];
```

```css
button { margin: 5px; }
li { border-radius: 5px; }
.highlighted { background: #d2eaff; }
```

</Sandpack>

</Solution>

### 实现多选功能

在这个例子中，每个 `Letter` 都有一个 `isSelected` 属性和一个标记它被选中的 `onToggle` 处理程序。这是可行的，但 state 被存储为 `selectedId`（`null`或 ID），所以在任何时候只有一个字母能被选中。

更改 state 结构以支持多选功能。（您将如何构建它？在编写代码之前请考虑这一点。）每个复选框都应该独立于其他复选框。单击选定的字母应取消选中它。最后，页脚应显示所选项目的正确数量。

<Hint>

您可能希望 state 中保存所选 ID 的数组或 [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)，而不是单个所选ID。

</Hint>

<Sandpack>

```js App.js
import { useState } from 'react';
import { letters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [
    selectedId,
    setSelectedId
  ] = useState(null);

  // TODO: allow multiple selection
  const selectedCount = 1;

  function handleToggle(toggledId) {
    // TODO: allow multiple selection
    setSelectedId(toggledId);
  }

  return (
    <ul>
      {letters.map(letter => (
        <Letter
          key={letter.id}
          letter={letter}
          isSelected={
            // TODO: allow multiple selection
            letter.id === selectedId
          }
          onToggle={handleToggle}
        />
      ))}
      <hr />
      <p>
        <b>
          You selected {selectedCount} letters
        </b>
      </p>
    </ul>
  );
}
```

```js Letter.js
export default function Letter({
  letter,
  onToggle,
  isSelected,
}) {
  return (
    <li className={
      isSelected ? 'selected' : ''
    }>
      <label>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {
            onToggle(letter.id);
          }}
        />
        {letter.subject}
      </label>
    </li>
  )
}
```

```js data.js
export const letters = [{
  id: 0,
  subject: 'How are you?',
  isStarred: true,
}, {
  id: 1,
  subject: 'Your taxes are due',
  isStarred: false,
}, {
  id: 2,
  subject: 'Reminder: dentist',
  isStarred: false,
}];
```

```css
input { margin: 5px; }
li { border-radius: 5px; }
label { width: 100%; padding: 5px; display: inline-block; }
.selected { background: #d2eaff; }
```

</Sandpack>

<Solution>

而不是单一的 `selectedId`，在 state 中保存一个 `selectedIds` *array*。例如，如果你选择第一个和最后一个字母，它将包含 `[0, 2]`。当没有选择任何东西时，它将是一个空的`[]` 数组：

<Sandpack>

```js App.js
import { useState } from 'react';
import { letters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [
    selectedIds,
    setSelectedIds
  ] = useState([]);

  const selectedCount = selectedIds.length;

  function handleToggle(toggledId) {
    // Was it previously selected?
    if (selectedIds.includes(toggledId)) {
      // Then remove this ID from the array.
      setSelectedIds(selectedIds.filter(id =>
        id !== toggledId
      ));
    } else {
      // Otherwise, add this ID to the array.
      setSelectedIds([
        ...selectedIds,
        toggledId
      ]);
    }
  }

  return (
    <ul>
      {letters.map(letter => (
        <Letter
          key={letter.id}
          letter={letter}
          isSelected={
            selectedIds.includes(letter.id)
          }
          onToggle={handleToggle}
        />
      ))}
      <hr />
      <p>
        <b>
          You selected {selectedCount} letters
        </b>
      </p>
    </ul>
  );
}
```

```js Letter.js
export default function Letter({
  letter,
  onToggle,
  isSelected,
}) {
  return (
    <li className={
      isSelected ? 'selected' : ''
    }>
      <label>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {
            onToggle(letter.id);
          }}
        />
        {letter.subject}
      </label>
    </li>
  )
}
```

```js data.js
export const letters = [{
  id: 0,
  subject: 'How are you?',
  isStarred: true,
}, {
  id: 1,
  subject: 'Your taxes are due',
  isStarred: false,
}, {
  id: 2,
  subject: 'Reminder: dentist',
  isStarred: false,
}];
```

```css
input { margin: 5px; }
li { border-radius: 5px; }
label { width: 100%; padding: 5px; display: inline-block; }
.selected { background: #d2eaff; }
```

</Sandpack>

使用数组的一个小缺点是，对于每个项目，你要调用 `selectedIds.includes(letter.id)` 来检查它是否被选中。如果数组非常大，这可能会成为一个性能问题，因为数组搜索使用 [`includes()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes) 需要线性时间，而你要对每个单独的项目进行这种搜索。

要解决此问题，您可以将 [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) 保持在 state 中，这里提供了一个快速的 [`has( )`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/has) 操作：

<Sandpack>

```js App.js
import { useState } from 'react';
import { letters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [
    selectedIds,
    setSelectedIds
  ] = useState(new Set());

  const selectedCount = selectedIds.size;

  function handleToggle(toggledId) {
    // Create a copy (to avoid mutation).
    const nextIds = new Set(selectedIds);
    if (nextIds.has(toggledId)) {
      nextIds.delete(toggledId);
    } else {
      nextIds.add(toggledId);
    }
    setSelectedIds(nextIds);
  }

  return (
    <ul>
      {letters.map(letter => (
        <Letter
          key={letter.id}
          letter={letter}
          isSelected={
            selectedIds.has(letter.id)
          }
          onToggle={handleToggle}
        />
      ))}
      <hr />
      <p>
        <b>
          You selected {selectedCount} letters
        </b>
      </p>
    </ul>
  );
}
```

```js Letter.js
export default function Letter({
  letter,
  onToggle,
  isSelected,
}) {
  return (
    <li className={
      isSelected ? 'selected' : ''
    }>
      <label>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {
            onToggle(letter.id);
          }}
        />
        {letter.subject}
      </label>
    </li>
  )
}
```

```js data.js
export const letters = [{
  id: 0,
  subject: 'How are you?',
  isStarred: true,
}, {
  id: 1,
  subject: 'Your taxes are due',
  isStarred: false,
}, {
  id: 2,
  subject: 'Reminder: dentist',
  isStarred: false,
}];
```

```css
input { margin: 5px; }
li { border-radius: 5px; }
label { width: 100%; padding: 5px; display: inline-block; }
.selected { background: #d2eaff; }
```

</Sandpack>

现在每个项目都会做一个 `selectedIds.has(letter.id)` 检查，这非常快。

请记住，你[不应该改变 state 中的对象](/learn/updating-objects-in-state)，这也包括 Sets。这就是为什么 `handleToggle` 函数首先创建一个 Set 的 *副本*，然后更新这个副本。

</Solution>

</Challenges>