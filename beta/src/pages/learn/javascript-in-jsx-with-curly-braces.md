---
title: 在 JSX 的花括号内使用 JavaScript
---

<Intro>

JSX 允许你在 JavaScript 中编写类似 HTML 的标记，让渲染逻辑和内容在同一处地方。有些情况下，你想在一处标记中添加一些 JavaScript 逻辑或者引用动态属性。这种情况下，你可以在 JSX 的花括号内来编写 JavaScript。

</Intro>

<YouWillLearn>

* 如何使用引号传递字符串
* 在 JSX 的花括号内引用 JavaScript 变量
* 在 JSX 的花括号内调用 JavaScript 函数
* 在 JSX 的花括号内使用 JavaScript 对象

</YouWillLearn>

## 使用引号传递字符串 {/*passing-strings-with-quotes*/}

当你想传递一个字符串属性给 JSX 时，把它放到单引号或双引号中：

<Sandpack>

```js
export default function Avatar() {
  return (
    <img
      className="avatar"
      src="https://i.imgur.com/7vQD0fPs.jpg"
      alt="Gregorio Y. Zara"
    />
  );
}
```

```css
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

在此处，`"https://i.imgur.com/7vQD0fPs.jpg"` 和 `"Gregorio Y. Zara"` 作为字符串被传递。

但是如果你想动态指定 `src` 或 `alt` 该怎么办？你可以**使用 `{` 和 `}` 替代 `"` 和 `"` 来引用 JavaScript 的一个值**：

<Sandpack>

```js
export default function Avatar() {
  const avatar = 'https://i.imgur.com/7vQD0fPs.jpg';
  const description = 'Gregorio Y. Zara';
  return (
    <img
      className="avatar"
      src={avatar}
      alt={description}
    />
  );
}
```

```css
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

注意 `className="avatar"` 和 `src={avatar}` 之间的区别，`className="avatar"` 声明了一个叫 `"avatar"` 的 CSS 类名让图片变圆，而 `src={avatar}` 读取了 JavaScript 中一个叫做 `avatar` 的变量的值。正是因为花括号让 JavaScript 可以在你的标记中生效！

## 使用花括号：一扇进入 JavaScript 世界的窗户 {/*using-curly-braces-a-window-into-the-javascript-world*/}

JSX 是一种编写 JavaScript 的特殊方式。它意味着在花括号 `{ }` 中使用 JavaScript 成为可能。下面的例子中声明了科学家的名字，`name`，然后在 `<h1>` 后的花括号内嵌入它：

<Sandpack>

```js
export default function TodoList() {
  const name = 'Gregorio Y. Zara';
  return (
    <h1>{name}'s To Do List</h1>
  );
}
```

</Sandpack>

尝试将 `name` 的值从 `'Gregorio Y. Zara'` 更改成 `'Hedy Lamarr'`。看看这个 To Do List 的标题如何变化？

任何花括号内的 JavaScript 表达式都会工作，包括 像 `formatDate()` 这样的函数调用：

<Sandpack>

```js
const today = new Date();

function formatDate(date) {
  return new Intl.DateTimeFormat(
    'en-US',
    { weekday: 'long' }
  ).format(date);
}

export default function TodoList() {
  return (
    <h1>To Do List for {formatDate(today)}</h1>
  );
}
```

</Sandpack>

### 可以在哪使用花括号 {/*where-to-use-curly-braces*/}

在 JSX 中只能以下面两种方式使用花括号：

1. 用作 JSX 标签内的**文本**：`<h1>{name}'s To Do List</h1>` 是有效的，但是 `<{tag}>Gregorio Y. Zara's To Do List</{tag}>` 无效。
2. 用作紧跟在 `=` 符号后的**属性**：`src={avatar}` 会读取 `avatar` 的值，但是 `src="{avatar}"` 会传一个叫做 `{avatar}` 的字符串的值。

## 使用 "双花括号"：JSX 中的 CSS 和 对象 {/*using-double-curlies-css-and-other-objects-in-jsx*/}

除了字符串、数字和其它 JavaScript 表达式，你甚至可以在 JSX 中传递对象。对象也用花括号表示，例如 `{ name: "Hedy Lamarr", inventions: 5 }`。因此，为了在 JSX 中传递对象，你必须用另一对花括号包裹对象：`person={{ name: "Hedy Lamarr", inventions: 5 }}`。

你也许看到了内联在 JSX 中的 CSS 样式。React 不强制你使用内联样式（CSS 类适用于大多数情况）。但是当你需要内联样式的时候，你可以传递一个对象给 `style` 属性：

<Sandpack>

```js
export default function TodoList() {
  return (
    <ul style={{
      backgroundColor: 'black',
      color: 'pink'
    }}>
      <li>Improve the videophone</li>
      <li>Prepare aeronautics lectures</li>
      <li>Work on the alcohol-fuelled engine</li>
    </ul>
  );
}
```

```css
body { padding: 0; margin: 0 }
ul { padding: 20px 20px 20px 40px; margin: 0; }
```

</Sandpack>

尝试更改 `backgroundColor` 和 `color` 的值。

当你像下面的例子那样写时，你真的可以发现花括号内的对象：

```js {2-5}
<ul style={
  {
    backgroundColor: 'black',
    color: 'pink'
  }
}>
```

当你下次在 JSX 中看到 `{{` 和 `}}`，要知道它只不过是 JSX 花括号里的一个对象！

<Gotcha>

内联 `style` 属性 使用驼峰命名法编写。例如，HTML `<ul style="background-color: black"`> 在你的组件里应该写成 `<ul style={{ backgroundColor: 'black' }}>`。

</Gotcha>

## JavaScript 对象 和 花括号的更多可能 {/*more-fun-with-javascript-objects-and-curly-braces*/}

你可以将多个表达式合并到一个对象中，在 JSX 内的花括号内引用它们：

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

在这个例子中，`person` JavaScript 对象包含 `name` 字符串和 `theme` 对象：

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};
```

该组件可以这样使用来自 `person` 的值：

```js
<div style={person.theme}>
  <h1>{person.name}'s Todos</h1>
```

JSX 是一个十分简洁的模板语言，因为它允许你使用 JavaScript 组织数据和逻辑。

<Recap>

现在你几乎了解了 JSX 的一切：

* JSX 引号内的值作为字符串传递给属性。
* 花括号让你可以将 JavaScript 的逻辑和变量带入你的标记中。
* 它们在 JSX 标签中的内容或紧随属性后的 `=` 有效。
* `{{` 和 `}}` 不是特殊语法：它是在 JSX 花括号内的 JavaScript 对象。

</Recap>

<Challenges>

### 修复错误 {/*fix-the-mistake*/}

此代码崩溃并显示 `Objects are not valid as a React child`：

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

你能找到问题吗？

<Hint>看看花括号内的内容。我们放那的东西对吗？</Hint>

<Solution>

之所以发生这样的问题是因为例子尝试把*一个对象*渲染进标记内而不是一个字符串：`<h1>{person}'s Todos</h1>` 尝试渲染整个 `person` 对象！未经处理的对象作为文本内容将会抛出错误，因为 React 不知道你想如何显示它们。

要修复它，请把 `<h1>{person}'s Todos</h1>` 替换成 `<h1>{person.name}'s Todos</h1>`：

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

</Solution>

### 提取信息到对象中 {/*extract-information-into-an-object*/}

提取图片 URL 信息到 `person` 对象中。

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

<Solution>

把图片 URL 移到一个叫做 `person.imageUrl` 的属性中并在 `<img>` 标签中的花括号中读取它：

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  imageUrl: "https://i.imgur.com/7vQD0fPs.jpg",
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src={person.imageUrl}
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

</Solution>

### 在 JSX 花括号内写一个表达式 {/*write-an-expression-inside-jsx-curly-braces*/}

在下面的对象中，完整的图片 URL 分成四部分：base URL、 `imageId`、 `imageSize` 和文件拓展名。

我们希望这些属性组合成图片的 URL：base URL（一直是 `'https://i.imgur.com/'`）、`imageId`（`'7vQD0fP'`）、`imageSize`（`'s'`）和文件拓展（总是 `'.jpg'`）。但是，`<img>` 标签 `src` 指明的方式是有问题的。

你能修复它吗？

<Sandpack>

```js

const baseUrl = 'https://i.imgur.com/';
const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="{baseUrl}{person.imageId}{person.imageSize}.jpg"
        alt={person.name}
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

要检查你的修复是否成功，尝试吧 `imageSize` 的值改成 `'b'`。在你编辑后图像应该会调整大小。

<Solution>

你可以这样写 `src={baseUrl + person.imageId + person.imageSize + '.jpg'}`。

1. `{` 开启 JavaScript 表达式
2. `baseUrl + person.imageId + person.imageSize + '.jpg'` 提供正确的 URL 字符串
3. `}` 结束 JavaScript 表达式

<Sandpack>

```js
const baseUrl = 'https://i.imgur.com/';
const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src={baseUrl + person.imageId + person.imageSize + '.jpg'}
        alt={person.name}
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

你还可以将此表达式封装成一个单独的函数，例如下面的 `getImageUrl`：

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js'

const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src={getImageUrl(person)}
        alt={person.name}
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```js utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    person.imageSize +
    '.jpg'
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

变量和函数可以帮助你保持标记文本的简洁！

</Solution>

</Challenges>