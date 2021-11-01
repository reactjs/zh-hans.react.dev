---
title: 组件的导入和导出
---

<Intro>

组件的神奇之处在于它们的可重用性：你可以创建一个由其他组件构成的组件。但当你嵌套了越来越多的组件，这时则需要开始要将它们拆分成不同的文件。这样可以使得你更容易去找到这些文件，并且在其他更多的地方复用这些组件。

</Intro>

<YouWillLearn>

* 何为根组件
* 如何导入和导出一个组件
* 何时使用默认和命名导入导出
* 如何在一个文件里导入和导出多个组件
* 如何将组件拆分成多个文件

</YouWillLearn>

## 根组件文件 {#the-root-component-file}

在 [你的第一个组件](/learn/your-first-component) 中，你创建了一个 `Profile` 组件，并且渲染在 `Gallery` 组件里。

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
      <h1>了不起的科学家们</h1>
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

在这个例子中，这些组件目前都定义在一个名为 `App.js` 的 **根组件文件** 中，在 [Create React App](https://create-react-app.dev/) 中，你的应用定义在 `src/App.js`。但取决于你的配置，你的根组件可能会在其他文件里。如果你使用的框架是基于文件进行路由的，如 Next.js，那你每个页面的根组件都会不一样。

## 导出和导入一个组件 {#exporting-and-importing-a-component}

假如将来你想在首页加入一个关于科学书籍的列表？或者将所有的资料信息都放到其他地方？这时将 `Gallery` 和 `Profile` 组件移出根组件文件会更合理点。这会让这些组件更加模块化，并且可在其他文件里重复使用。你可以根据以下三个步骤去拆分你的组件：

1. **创建** 一个新的 JS 文件来放这个组件。
2. **导出** 该文件里的函数组件（可以使用 [默认导出](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_the_default_export) 或 [命名导出](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_named_exports)）
3. **导入** 到你将会用到该组件的文件里 (可以根据相应的导出方式使用 [默认导入](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import#importing_defaults) 或 [命名导入](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import#import_a_single_export_from_a_module)).

这里 `Profile` 和 `Gallery` 均从 `App.js` 移到一个名为 `Gallery.js` 的文件了。现在你可以在 `App.js` 里，从 `Gallery.js` 导入 `Gallery` 组件:

<Sandpack>

```js App.js
import Gallery from './Gallery.js';

export default function App() {
  return (
    <Gallery />
  );
}
```

```js Gallery.js
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
      <h1>了不起的科学家们</h1>
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

这个例子里需要注意的是，如何将组件拆分成两个文件：

1. `Gallery.js`:
     - 定义了 `Profile` 组件，它仅在同一个文件内使用，没有被导出。
     - 用 **默认导出** 的方式，将 `Gallery` 组件导出
2. `App.js`:
     - 用 **默认导入** 的方式，将 `Gallery` 组件从 `Gallery.js` 里导入。
     - 用 **默认导出** 的方式，将根组件 `App` 导出。


<Note>

你可能会遇到一些文件是没有 `.js` 文件后缀的，如下所示：

```js 
import Gallery from './Gallery';
```

不管是 `'Gallery.js'` 还是 `'.Gallery'`，在 React 里都能正常使用，只是前者更符合 [原生 ES 模块](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Modules)。

</Note>

<DeepDive title="默认导出 vs 命名导出">

这是 JavaScript 里两个主要用来导出值的方法：默认导出和命名导出。到目前为止，我们的例子里仅仅是用到了默认导出。但你可以在一个文件里，使用其中一种或两种都使用。**一个文件里有且仅有一个 _默认_ 导出，但是可以有任意多个 _命名_ 导出。**

![Default and named exports](/images/docs/illustrations/i_import-export.svg)

你组件的导出方式决定了你导入它的方式。当你用默认导入的方法去导入一个命名导出的组件，这时会有报错。下面的表格可以帮助你更好地理解：

| 语法           | 导出语句                           | 导入语句                          |
| -----------    | -----------                        | -----------                       |
| 默认  | `export default function Button() {}` | `import Button from './button.js';`     |
| 命名  | `export function Button() {}`         | `import { Button } from './button.js';` |

当你用默认导入时，你可以在 `import` 语句后面起任何的名字。比如 `import Banana from './button.js'`，这样你还是能得到跟默认导出一样的内容。相反，对于命名导入，导入和导出的名字必须一致。这也是为什么叫 _命名_ 导入的原因！

**通常文件里只有一个组件时，人们会使用默认导出，而当文件里有多个组件或值需要导出时，则使用命名导出。** 不管你使用哪种方式，请记得给你的组件和相应的文件起一个有意义的名字。我们不建议创建没有命名的组件，比如 `export default () => {}`，因为这样会使得调试的时候更加困难。

</DeepDive>

## 从一个文件里导出和导入多个组件 {#exporting-and-importing-multiple-components-from-the-same-file}

假如你想展示仅仅一个 `Profile` 而不是一整个图集？你也可以导出 `Profile` 组件。但 `Gallery.js` 里已经有一个 *默认* 导出了，你不能定义 _两个_ 默认导出。你可以在一个新文件里用默认导出，或者将 `Profile` 用 *命名* 导出。**一个文件里，有且仅有一个默认导出，但可以有多个命名导出！**

> 为了减少在默认导出和命名导出之间的混淆，一些团队会选择只使用一种风格（默认或者命名），或者禁止在单个文件内混合使用。这因人而异，选择最适合你的即可！

首先，用命名导出的方法从 `Gallery.js` **导出** `Profile` 组件（没有 `default` 关键字）：

```js
export function Profile() {
  // ...
}
```

然后，用命名导入的方法从 `Gallery.js` **导入** `Profile` 组件（用大括号）:

```js
import { Profile } from './Gallery.js';
```

最后，在 `App` 组件里 **渲染** `<Profile />`：

```js
export default function App() {
  return <Profile />;
}
```

现在，`Gallery.js` 里两个导出：一个是默认导出的 `Gallery`，和一个命名导出的 `Profile`。`App.js` 里都导入了这两个组件。尝试将 `<Profile />` 改成 `<Gallery />`，然后回到这个例子里：

<Sandpack>

```js App.js
import Gallery from './Gallery.js';
import { Profile } from './Gallery.js';

export default function App() {
  return (
    <Profile />
  );
}
```

```js Gallery.js
export function Profile() {
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
      <h1>了不起的科学家们</h1>
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

现在你正在混合使用默认导出和命名导出：

* `Gallery.js`:
  - 用 **命名导出** 的方式，将 `Profile` 组件导出，并取名为 `Profile`。
  - 用 **默认导出** 的方式，将 `Gallery` 组件导出。
* `App.js`:
  - 用 **命名导入** 的方式，从 `Gallery.js` 导入 `Profile` 组件，并取名为 `Profile`。
  - 用 **默认导入** 的方式，从 `Gallery.js` 导入 `Gallery` 组件。
  - 用 **默认导出** 的方式，将根组件 `App` 导出。

<Recap>

在这个页面里，你学到了：

* 何为根组件
* 如何导入和导出一个组件
* 何时和如何使用默认和命名导入导出
* 如何在一个文件里导出多个组件

</Recap>



<Challenges>

### 进一步拆分组件

现在，`Gallery.js` 同时导出了 `Profile` 和 `Gallery`，这会让人感到有点混淆。

尝试将 `Profile` 组件移动到一个新的文件 `Profile.js`，然后更新 `App` 组件，依次渲染 `<Profile />` 和 `<Gallery />` 。

你也许会使用默认导出或者命名导出的方式来导出 `Profile` 组件，但请记住在 `App.js` 和 `Gallery.js` 里使用相应的导入语句！你可以参考下面的表格：

| 语法           | 导出语句                           | 导入语句                          |
| -----------    | -----------                        | -----------                       |
| 默认  | `export default function Button() {}` | `import Button from './button.js';`     |
| 命名  | `export function Button() {}`         | `import { Button } from './button.js';` |

<Hint>

不要忘记在调用它们的地方导入你的组件。`Gallery` 里不也调用了 `Profile` 吗？

</Hint>

<Sandpack>

```js App.js
import Gallery from './Gallery.js';
import { Profile } from './Gallery.js';

export default function App() {
  return (
    <div>
      <Profile />
    </div>
  );
}
```

```js Gallery.js active
// Move me to Profile.js!
export function Profile() {
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
      <h1>了不起的科学家们</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js Profile.js
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

在你使用其中一种导出方式完成以上问题后，请尝试使用另一种导出方式实现。

<Solution>

这是用了命名导出的解决方案：

<Sandpack>

```js App.js
import Gallery from './Gallery.js';
import { Profile } from './Profile.js';

export default function App() {
  return (
    <div>
      <Profile />
      <Gallery />
    </div>
  );
}
```

```js Gallery.js
import { Profile } from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>了不起的科学家们</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js Profile.js
export function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

这是用了默认导出的解决方案：

<Sandpack>

```js App.js
import Gallery from './Gallery.js';
import Profile from './Profile.js';

export default function App() {
  return (
    <div>
      <Profile />
      <Gallery />
    </div>
  );
}
```

```js Gallery.js
import Profile from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>了不起的科学家们</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js Profile.js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

</Solution>

</Challenges>
