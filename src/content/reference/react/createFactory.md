---
title: createFactory
---

<Deprecated>

此 API 将在未来的 React 主要版本中被移除，[请查看替代方案](#alternatives)。

</Deprecated>

<Intro>

`createFactory` 可以创建一个能够生成指定类型 React 元素的函数。

```js
const factory = createFactory(type)
```

</Intro>

<InlineToc />

---

## 参考 {/*reference*/}

### `createFactory(type)` {/*createfactory*/}

调用 `createFactory(type)` 创建一个能够生成指定 `type` 的 React 元素的工厂函数。

```js
import { createFactory } from 'react';

const button = createFactory('button');
```

然后你可以在不使用 JSX 的情况下创建 React 元素：

```js
export default function App() {
  return button({
    onClick: () => {
      alert('Clicked!')
    }
  }, 'Click me');
}
```

[参见下面更多示例](#usage)。

#### 参数 {/*parameters*/}

* `type`：`type` 参数必须是一个有效的 React 组件类型。例如，它可以是标签名称的字符串（如 `'div'` 或 `'span'`），或一个 React 组件（函数式组件、类式组件或一个特殊的组件，如 [`Fragment`](/reference/react/Fragment)）。

#### 返回值 {/*returns*/}

返回一个工厂函数。该工厂函数接收一个 `props` 对象作为第一个参数，后跟一系列的 `...children` 参数，并返回一个具有给定 `type`、`props` 和 `children` 的 React 元素，

---

## 用法 {/*usage*/}

### 使用工厂函数创建 React 元素 {/*creating-react-elements-with-a-factory*/}

尽管大多数 React 项目都使用 [JSX](/learn/writing-markup-with-jsx) 来描述用户界面，但并非必须使用 JSX。在过去，`createFactory` 曾是一种在没有 JSX 的情况下描述用户界面的方法之一。

调用 `createFactory` 来为特定的元素类型，如 `'button'`，创建一个 **工厂函数**：

```js
import { createFactory } from 'react';

const button = createFactory('button');
```

调用该工厂函数将生成具有你提供的 `props` 和 `children` 的 React 元素：

<Sandpack>

```js App.js
import { createFactory } from 'react';

const button = createFactory('button');

export default function App() {
  return button({
    onClick: () => {
      alert('已点击！')
    }
  }, '点我');
}
```

</Sandpack>

这就是 `createFactory` 作为 JSX 的替代方式的使用方法。但是，`createFactory` 已被弃用，因此你不应在任何新代码中调用 `createFactory`。请参阅下面内容，了解如何从 `createFactory` 迁移。

---

## 替代方案 {/*alternatives*/}

### 将 `createFactory` 拷贝进项目中 {/*copying-createfactory-into-your-project*/}

如果项目中调用了许多 `createFactory`，那么请将此 `createFactory.js` 复制到你的项目中：

<Sandpack>

```js App.js
import { createFactory } from './createFactory.js';

const button = createFactory('button');

export default function App() {
  return button({
    onClick: () => {
      alert('已点击！')
    }
  }, '点我');
}
```

```js createFactory.js
import { createElement } from 'react';

export function createFactory(type) {
  return createElement.bind(null, type);
}
```

</Sandpack>

这可以在只更改导入的情况下，保持其他所有代码不变。

---

### 使用 `createElement` 替代 `createFactory` {/*replacing-createfactory-with-createelement*/}

如果只有几个 `createFactory` 需要手动迁移，并且不想使用 JSX，你可以将调用工厂函数替换为调用 [`createElement`](/reference/react/createElement)。例如，你可以将以下代码：

```js {1,3,6}
import { createFactory } from 'react';

const button = createFactory('button');

export default function App() {
  return button({
    onClick: () => {
      alert('Clicked!')
    }
  }, 'Click me');
}
```

替换为以下代码：


```js {1,4}
import { createElement } from 'react';

export default function App() {
  return createElement('button', {
    onClick: () => {
      alert('Clicked!')
    }
  }, 'Click me');
}
```

这是一个完整的在不使用 JSX 的情况下使用 React 的示例：

<Sandpack>

```js App.js
import { createElement } from 'react';

export default function App() {
  return createElement('button', {
    onClick: () => {
      alert('已点击！')
    }
  }, '点我');
}
```

</Sandpack>

---

### 使用 JSX 替代 `createFactory` {/*replacing-createfactory-with-jsx*/}

最终，你可以使用 JSX 替代 `createFactory`。这也是大多数使用 React 的方式：

<Sandpack>

```js App.js
export default function App() {
  return (
    <button onClick={() => {
      alert('已点击！');
    }}>
      点我
    </button>
  );
};
```

</Sandpack>

<Pitfall>

有时，现有代码可能会将某个变量而不是 `'button'` 这样的常亮作为 `type` 传递：

```js {3}
function Heading({ isSubheading, ...props }) {
  const type = isSubheading ? 'h2' : 'h1';
  const factory = createFactory(type);
  return factory(props);
}
```

如果在 JSX 中要做相同的事情，需要将变量重命名为以大写字母开头，例如 `Type`：

```js {2,3}
function Heading({ isSubheading, ...props }) {
  const Type = isSubheading ? 'h2' : 'h1';
  return <Type {...props} />;
}
```

如果是小写字母开头，React 会将 `<type>` 作为内置的 HTML 标签。

</Pitfall>
