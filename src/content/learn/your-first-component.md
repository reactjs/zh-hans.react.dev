---
title: 你的第一个组件
translators:
  - fine-bot
  - nmsn
  - QC-L
---

<Intro>

**组件** 是 React 的核心概念之一。它们是构建用户界面（UI）的基础，是你开始 React 之旅的最佳起点！

</Intro>

<YouWillLearn>

* 什么是组件
* 组件在 React 应用中扮演的角色
* 如何编写你的第一个 React 组件

</YouWillLearn>

## 组件：UI 构成要素 {/*components-ui-building-blocks*/}

在 Web 当中，HTML 允许我们使用其内置的标签集（如 `<h1>` 和 `<li>`）创建丰富的结构化文档：

```html
<article>
  <h1>我的第一个组件</h1>
  <ol>
    <li>组件：UI 构成要素</li>
    <li>定义组件</li>
    <li>使用组件</li>
  </ol>
</article>
```

`<article>` 表示这篇文章，`<h1>` 表示文章的标题，`<ol>` 以有序列表的形式表示文章的（缩写的）目录。每一个侧边栏、头像、模态框、下拉框的背后是都是像这样的（结合了用于样式的 CSS 和用于交互的 JavaScript 的）标签——你在 Web 上看到的每一个 UI 模块。

React 允许你将标签、CSS 和 JavaScript 组合成自定义“组件”，即 **应用程序中可复用的 UI 元素**。上文中表示目录的代码可以改写成一个能够在每个页面中渲染的 `<TableOfContents />` 组件。实际上，使用的依然是 `<article>`、`<h1>` 等相同的 HTML 标签。

就像使用 HTML 标签一样，你可以组合、排序和嵌套组件来绘制整个页面。例如，你正在阅读的文档页面就是由 React 组件构成的：

```js
<PageLayout>
  <NavigationHeader>
    <SearchBar />
    <Link to="/docs">文档</Link>
  </NavigationHeader>
  <Sidebar />
  <PageContent>
    <TableOfContents />
    <DocumentationText />
  </PageContent>
</PageLayout>
```

随着项目的发展，你会发现很多布局可以通过复用已经完成的组件来实现，从而加快开发进程。上文中提到的目录可以通过 `<TableOfContents />` 组件添加到任意的画面中！你也可以使用 React 开源社区分享的大量组件（例如 [Chakra UI](https://chakra-ui.com/) 和 [Material UI](https://material-ui.com/)）来快速启动项目。

## 定义组件 {/*defining-a-component*/}

一直以来，创建网页时，Web 开发人员会用标签描述内容，然后通过 JavaScript 来增加交互。这种在 Web 上添加交互的方式能产生出色的效果。现在许多网站和全部应用都需要交互。React 最为重视交互性且使用了相同的处理方式：**React 组件是一段可以 使用标签进行扩展 的 JavaScript 函数**。如下所示（你可以编辑下面的示例）：

<Sandpack>

```js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3Am.jpg"
      alt="Katherine Johnson"
    />
  )
}
```

```css
img { height: 200px; }
```

</Sandpack>

以下是构建组件的方法：

### 第一步：导出组件 {/*step-1-export-the-component*/}

`export default` 前缀是一种 [JavaScript 标准语法](https://developer.mozilla.org/docs/web/javascript/reference/statements/export)（非 React 的特性）。它允许你标签一个文件中的主要函数以便你以后可以从其他文件引入它。欲了解更多关于导入的内容，请参阅 [组件的导入与导出](/learn/importing-and-exporting-components) 章节！

### 第二步：定义函数 {/*step-2-define-the-function*/}

使用 `function Profile() { }` 定义名为 `Profile` 的 JavaScript 函数。

<Pitfall>

React 组件是常规的 JavaScript 函数，但 **组件的名称必须以大写字母开头**，否则它们将无法运行！

</Pitfall>

### 第三步：添加标签 {/*step-3-add-markup*/}

这个组件返回一个带有 `src` 和 `alt` 属性的 `<img />` 标签。`<img />` 写得像 HTML，但实际上是 JavaScript！这种语法被称为 [JSX](/learn/writing-markup-with-jsx)，它允许你在 JavaScript 中嵌入使用标签。

返回语句可以全写在一行上，如下面组件中所示：

```js
return <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />;
```

但是，如果你的标签和 `return` 关键字不在同一行，则必须把它包裹在一对括号中，如下所示：

```js
return (
  <div>
    <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  </div>
);
```

<Pitfall>

没有括号包裹的话，任何在 `return` 下一行的代码都 [将被忽略](https://stackoverflow.com/questions/2846283/what-are-the-rules-for-javascripts-automatic-semicolon-insertion-asi)！

</Pitfall>

## 使用组件 {/*using-a-component*/}

现在你已经定义了 `Profile` 组件，你可以在其他组件中使用它。例如，你可以导出一个内部使用了多个 `Profile` 组件的 `Gallery` 组件：

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3As.jpg"
      alt="Katherine Johnson"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>了不起的科学家</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

### 浏览器所看到的 {/*what-the-browser-sees*/}

注意下面两者的区别：

* `<section>` 是小写的，所以 React 知道我们指的是 HTML 标签。
* `<Profile />` 以大写 `P` 开头，所以 React 知道我们想要使用名为 `Profile` 的组件。

然而 `Profile` 包含更多的 HTML：`<img />`。这是浏览器最后所看到的：

```html
<section>
  <h1>了不起的科学家</h1>
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
</section>
```

### 嵌套和组织组件 {/*nesting-and-organizing-components*/}

组件是常规的 JavaScript 函数，所以你可以将多个组件保存在同一份文件中。当组件相对较小或彼此紧密相关时，这是一种省事的处理方式。如果这个文件变得臃肿，你也可以随时将 `Profile` 移动到单独的文件中。你可以立即在 [关于引入的页面](/learn/importing-and-exporting-components) 中学习如何做到这些。

因为 `Profile` 组件在 `Gallery` 组件中渲染——甚至好几次！——我们可以认为 `Gallery` 是一个 **父组件**，将每个 `Profile` 渲染为一个“孩子”。这是 React 的神奇之处：你可以只定义组件一次，然后按需多处和多次使用。

<Pitfall>

组件可以渲染其他组件，但是 **请不要嵌套他们的定义**：

```js {2-5}
export default function Gallery() {
  // 🔴 永远不要在组件中定义组件
  function Profile() {
    // ...
  }
  // ...
}
```

上面这段代码 [非常慢，并且会导致 bug 产生](/learn/preserving-and-resetting-state#different-components-at-the-same-position-reset-state)。因此，你应该在顶层定义每个组件：

```js {5-8}
export default function Gallery() {
  // ...
}

// ✅ 在顶层声明组件
function Profile() {
  // ...
}
```

当子组件需要使用父组件的数据时，你需要 [通过 props 的形式进行传递](/learn/passing-props-to-a-component)，而不是嵌套定义。

</Pitfall>

<DeepDive>

#### 万物皆组件 {/*components-all-the-way-down*/}

你的 React 应用程序从“根”组件开始。通常，它会在启动新项目时自动创建。例如，如果你使用 [CodeSandbox](https://codesandbox.io/)，根组件定义在 `src/App.js` 中。如果使用 [Next.js](https://nextjs.org/) 框架，根组件定义在 `pages/index.js` 中。在这些示例中，一直有导出根组件。

大多数 React 应用程序只有组件。这意味着你不仅可以将组件用于可复用的部分，例如按钮，还可以用于较大块的部分，例如侧边栏、列表以及最终的完整页面！组件是组织 UI 代码和标签的一种快捷方式，即使其中一些组件只使用了一次。

像 Next.js 这样的框架会做更多事情。与使用一个空白的 HTML 页面并让 React 使用 JavaScript “接手”管理页面不同，框架还会根据你的 React 组件自动生成 HTML。这使你的应用程序在加载 JavaScript 代码之前能够展示一些内容。

尽管如此，许多网站仅使用 React 来 [添加“交互性”](/learn/add-react-to-a-website)。它们有很多根组件，而不是整个页面的单个组件。你可以根据需要尽可能多或尽可能少地使用 React。

</DeepDive>

<Recap>

你刚刚第一次体验 React！让我们回顾一些关键点。

* React 允许你创建组件，**应用程序的可复用 UI 元素**。
* 在 React 应用程序中，每一个 UI 模块都是一个组件。
* React 是常规的 JavaScript 函数，除了：

  1. 它们的名字总是以大写字母开头。
  2. 它们返回 JSX 标签。

</Recap>



<Challenges>

#### 导出组件 {/*export-the-component*/}

这个沙箱不起作用，因为根组件没有导出：

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/lICfvbD.jpg"
      alt="Aklilu Lemma"
    />
  );
}
```

```css
img { height: 181px; }
```

</Sandpack>

看答案之前先尝试自己修复它！

<Solution>

在函数定义前添加 `export default`，如下所示：

<Sandpack>

```js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/lICfvbD.jpg"
      alt="Aklilu Lemma"
    />
  );
}
```

```css
img { height: 181px; }
```

</Sandpack>

你可能想知道为什么单独写 `export` 不足以解决这个问题。你可以在 [引入和导出组件](/learn/importing-and-exporting-components) 中了解 `export` 和 `export default` 两者之间的区别。

</Solution>

#### 修复返回语句 {/*fix-the-return-statement*/}

这个 `return` 语句不太对，你能修复它吗？

<Hint>

当你尝试修复它时，可能会得到“Unexpected token”的报错。这种情况下，请检查分号是否在右括号 **之后**。在 `return ( )` 里面留下分号将会导致报错。

</Hint>


<Sandpack>

```js
export default function Profile() {
  return
    <img src="https://i.imgur.com/jA8hHMpm.jpg" alt="Katsuko Saruhashi" />;
}
```

```css
img { height: 180px; }
```

</Sandpack>

<Solution>

你可以通过将返回语句移动到一行上来修复这个组件，如下所示：

<Sandpack>

```js
export default function Profile() {
  return <img src="https://i.imgur.com/jA8hHMpm.jpg" alt="Katsuko Saruhashi" />;
}
```

```css
img { height: 180px; }
```

</Sandpack>

或者用括号包裹返回的 JSX 标签，将左括号放在 `return` 的后面： 

<Sandpack>

```js
export default function Profile() {
  return (
    <img 
      src="https://i.imgur.com/jA8hHMpm.jpg" 
      alt="Katsuko Saruhashi" 
    />
  );
}
```

```css
img { height: 180px; }
```

</Sandpack>

</Solution>

#### 发现错误 {/*spot-the-mistake*/}

下面 `Profile` 组件的声明和使用存在问题。你能指出其中的错误所在吗？（试着想想 React 是如何区分组件和常规的 HTML 标签的！）

<Sandpack>

```js
function profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>了不起的科学家</h1>
      <profile />
      <profile />
      <profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

<Solution>

React 组件名字必须以大写字母开头。

将 `function profile()` 改为 `function Profile()`，然后将每个 `<profile />` 改为 `<Profile />`：

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>了不起的科学家</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; }
```

</Sandpack>

</Solution>

#### 自定义组件 {/*your-own-component*/}

从头开始编写一个组件。你可以为它指定任何有效名称然后返回任何标签。如果你没有什么想法的话，你可以写一个显示 `<h1>干得漂亮！</h1>` 的 `Congratulations` 组件。不要忘了导出它！

<Sandpack>

```js
// 在下面写你的组件

```

</Sandpack>

<Solution>

<Sandpack>

```js
export default function Congratulations() {
  return (
    <h1>干得漂亮！</h1>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
