---
title: createContext
---

<Intro>

`createContext` 能让你创建一个 [context](/learn/passing-data-deeply-with-context) 以便组件能够提供和读取。

```js
const SomeContext = createContext(defaultValue)
```

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `createContext(defaultValue)` {/*createcontext*/}

在任意组件外调用 `createContext` 来创建一个上下文。

```js
import { createContext } from 'react';

const ThemeContext = createContext('light');
```

[请看下面的更多例子](#usage)

#### 参数 {/*parameters*/}

* `defaultValue`：当包裹需要读取上下文的组件树中没有匹配的上下文时，你可以用该值作上下文的。倘若你没有任何有意义的默认值，可指定其为 `null`。该默认值是用于作为“最后的手段”的后备方案。它是静态的，永远不会随时间改变。

#### 返回值 {/*returns*/}

`createContext` 返回一个 context 对象。

**该 context 对象本身不包含任何信息。** 它只表示其他组件读取或提供的 *那个* context。一般来说，你将在组件上方使用 [`SomeContext.Provider`](#provider) 来指定 context 的值，并在被包裹的下方组件内调用 [`useContext(SomeContext)`](/reference/react/useContext) 来读取它。context 对象有一些属性：

* `SomeContext.Provider` 让你为被它包裹的组件提供上下文的值。
* `SomeContext.Consumer` 是一个很少会用到的备选方案，它用于读取上下文的值。

---

### `SomeContext.Provider` {/*provider*/}

用上下文 provider 包裹你的组件，来为里面所有的组件指定一个 context 的值：

```js
function App() {
  const [theme, setTheme] = useState('light');
  // ...
  return (
    <ThemeContext.Provider value={theme}>
      <Page />
    </ThemeContext.Provider>
  );
}
```

#### Props {/*provider-props*/}

* `value`：该值为你想传递给所有处于这个 provider 内读取该 context 的组件，无论它们处于多深的层级。context 的值可以为任何类型。该 provider 内的组件可通过调用 [`useContext(SomeContext)`](/reference/react/useContext) 来获取它上面最近的 context provider 的 `value`。

---

### `SomeContext.Consumer` {/*consumer*/}

在 `useContext` 之前，有一种更老的方法来读取上下文：

```js
function Button() {
  // 🟡 遗留方式 (不推荐)
  return (
    <ThemeContext.Consumer>
      {theme => (
        <button className={theme} />
      )}
    </ThemeContext.Consumer>
  );
}
```

尽管这种老方法依然奏效，但 **新代码都应该通过 [`useContext()`](/reference/react/useContext) 来读取上下文：**

```js
function Button() {
  // ✅ 推荐方式
  const theme = useContext(ThemeContext);
  return <button className={theme} />;
}
```

#### Props {/*consumer-props*/}

* `children`：一个函数。React 将传入与 [`useContext()`](/reference/react/useContext) 相同算法确定的当前上下文的值，来调用该函数，并根据该函数的返回值渲染结果。只要当来自父组件的上下文发生变化，React 就会重新调用该函数。

---

## 使用方法 {/*usage*/}

### 创建上下文 {/*creating-context*/}

上下文使得组件能够无需通过显式传递参数的方式 [将信息逐层传递](/learn/passing-data-deeply-with-context)。

在任何组件外调用 `createContext` 来创建一个或多个上下文。

```js [[1, 3, "ThemeContext"], [1, 4, "AuthContext"], [3, 3, "'light'"], [3, 4, "null"]]
import { createContext } from 'react';

const ThemeContext = createContext('light');
const AuthContext = createContext(null);
```

`createContext` 返回一个 <CodeStep step={1}>上下文对象</CodeStep>。组件可以通过将它传给 [`useContext()`](/reference/react/useContext) 来读取上下文的值：

```js [[1, 2, "ThemeContext"], [1, 7, "AuthContext"]]
function Button() {
  const theme = useContext(ThemeContext);
  // ...
}

function Profile() {
  const currentUser = useContext(AuthContext);
  // ...
}
```

默认情况下，它们将获得的值是你在创建上下文时指定的 <CodeStep step={3}>默认值</CodeStep>。然而，它本身并不是很有用，因为默认值永远不会发生改变。

上下文之所以有用，是因为你可以 **提供来自你组件的其他的、动态变化的值：**

```js {8-9,11-12}
function App() {
  const [theme, setTheme] = useState('dark');
  const [currentUser, setCurrentUser] = useState({ name: 'Taylor' });

  // ...

  return (
    <ThemeContext.Provider value={theme}>
      <AuthContext.Provider value={currentUser}>
        <Page />
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}
```

现在 `Page` 组件以及其所包裹的任何子组件，无论层级多深，都会“看”到传入上下文的值。如果该值发生变化， React 也会重新渲染读取该值的组件。

[阅读更多有关读取和提供上下文的内容以及相关例子](/reference/react/useContext)

---

### 从一个文件导入和导出上下文 {/*importing-and-exporting-context-from-a-file*/}

通常，来自不同文件的组件都会需要读取同一个 context。因此，在一个单独的文件内定义 context 便成了常见做法。你可以使用 [`export` 语句](https://developer.mozilla.org/zh-CN/docs/web/javascript/reference/statements/export) 将其导出，以便其他文件读取使用：

```js {4-5}
// Contexts.js
import { createContext } from 'react';

export const ThemeContext = createContext('light');
export const AuthContext = createContext(null);
```

被定义在其他文件中的组件则可以使用 [`import`](https://developer.mozilla.org/zh-CN/docs/web/javascript/reference/statements/import) 语句来读取或提供该 context：

```js {2}
// Button.js
import { ThemeContext } from './Contexts.js';

function Button() {
  const theme = useContext(ThemeContext);
  // ...
}
```

```js {2}
// App.js
import { ThemeContext, AuthContext } from './Contexts.js';

function App() {
  // ...
  return (
    <ThemeContext.Provider value={theme}>
      <AuthContext.Provider value={currentUser}>
        <Page />
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}
```

这与 [组件的导入与导出](/learn/importing-and-exporting-components) 十分相似。

---

## 疑难解答 {/*troubleshooting*/}

### 我没有办法改变 context 的值 {/*i-cant-find-a-way-to-change-the-context-value*/}


如下的代码为 context 指定了 *默认* 值：

```js
const ThemeContext = createContext('light');
```

该值永远不会发生改变。当 React 无法找到匹配的 provider 时，该值会被作为后备方案。

要想使上下文的值随时间变化，[添加状态并用一个 context provider 包裹组件](/reference/react/useContext#updating-data-passed-via-context)。

