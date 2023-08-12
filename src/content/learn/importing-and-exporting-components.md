---
title: 组件的导入与导出
translators:
  - Alienover
  - QC-L
---

<Intro>

组件的神奇之处在于它们的可重用性：你可以创建一个由其他组件构成的组件。但当你嵌套了越来越多的组件时，则需要将它们拆分成不同的文件。这样可以使得查找文件更加容易，并且能在更多地方复用这些组件。

</Intro>

<YouWillLearn>

* 何为根组件
* 如何导入和导出一个组件
* 何时使用默认和具名导入导出
* 如何在一个文件中导入导出多个组件
* 如何将组件拆分成多个文件

</YouWillLearn>

## 根组件文件 {/*the-root-component-file*/}

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

在此示例中，所有组件目前都定义在 **根组件** `App.js` 文件中。具体还需根据项目配置决定，有些根组件可能会声明在其他文件中。如果你使用的框架基于文件进行路由，如 Next.js，那你每个页面的根组件都会不一样。

## 导出和导入一个组件 {/*exporting-and-importing-a-component*/}

如果将来需要在首页添加关于科学书籍的列表，亦或者需要将所有的资料信息移动到其他文件。这时将 `Gallery` 组件和 `Profile` 组件移出根组件文件会更加合理。这会使组件更加模块化，并且可在其他文件中复用。你可以根据以下三个步骤对组件进行拆分：

1. **创建** 一个新的 JS 文件来存放该组件。
2. **导出** 该文件中的函数组件（可以使用 [默认导出](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_the_default_export) 或 [具名导出](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_named_exports)）
3. 在需要使用该组件的文件中 **导入**（可以根据相应的导出方式使用 [默认导入](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import#importing_defaults) 或 [具名导入](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import#import_a_single_export_from_a_module)）。

这里将 `Profile` 组件和 `Gallery` 组件，从 `App.js` 文件中移动到了 `Gallery.js` 文件中。修改后，即可在 `App.js` 中导入 `Gallery.js` 中的 `Gallery` 组件:

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

该示例中需要注意的是，如何将组件拆分成两个文件：

1. `Gallery.js`:
     - 定义了 `Profile` 组件，该组件仅在该文件内使用，没有被导出。
     - 使用 **默认导出** 的方式，将 `Gallery` 组件导出
2. `App.js`:
     - 使用 **默认导入** 的方式，从 `Gallery.js` 中导入 `Gallery` 组件。
     - 使用 **默认导出** 的方式，将根组件 `App` 导出。


<Note>

引入过程中，你可能会遇到一些文件并未添加 `.js` 文件后缀，如下所示：

```js 
import Gallery from './Gallery';
```

无论是 `'./Gallery.js'` 还是 `'./Gallery'`，在 React 里都能正常使用，只是前者更符合 [原生 ES 模块](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Modules)。

</Note>

<DeepDive>

#### 默认导出 vs 具名导出 {/*default-vs-named-exports*/}

这是 JavaScript 里两个主要用来导出值的方式：默认导出和具名导出。到目前为止，我们的示例中只用到了默认导出。但你可以在一个文件中，选择使用其中一种，或者两种都使用。**一个文件里有且仅有一个 _默认_ 导出，但是可以有任意多个 _具名_ 导出。**

![Default and named exports](/images/docs/illustrations/i_import-export.svg)

组件的导出方式决定了其导入方式。当你用默认导入的方式，导入具名导出的组件时，就会报错。如下表格可以帮你更好地理解它们：

| 语法           | 导出语句                           | 导入语句                          |
| -----------    | -----------                        | -----------                       |
| 默认  | `export default function Button() {}` | `import Button from './Button.js';`     |
| 具名  | `export function Button() {}`         | `import { Button } from './Button.js';` |

当使用默认导入时，你可以在 `import` 语句后面进行任意命名。比如 `import Banana from './Button.js'`，如此你能获得与默认导出一致的内容。相反，对于具名导入，导入和导出的名字必须一致。这也是为什么称其为 **具名** 导入的原因！

**通常，文件中仅包含一个组件时，人们会选择默认导出，而当文件中包含多个组件或某个值需要导出时，则会选择具名导出。** 无论选择哪种方式，请记得给你的组件和相应的文件命名一个有意义的名字。我们不建议创建未命名的组件，比如 `export default () => {}`，因为这样会使得调试变得异常困难。

</DeepDive>

## 从同一文件中导出和导入多个组件 {/*exporting-and-importing-multiple-components-from-the-same-file*/}

如果你只想展示一个 `Profile` 组，而不展示整个图集。你也可以导出 `Profile` 组件。但 `Gallery.js` 中已包含 **默认** 导出，此时，你不能定义 **两个** 默认导出。但你可以将其在新文件中进行默认导出，或者将 `Profile` 进行 **具名** 导出。**同一文件中，有且仅有一个默认导出，但可以有多个具名导出！**

<Note>

为了减少在默认导出和具名导出之间的混淆，一些团队会选择只使用一种风格（默认或者具名），或者禁止在单个文件内混合使用。这因人而异，选择最适合你的即可！

</Note>

首先，用具名导出的方式，将 `Profile` 组件从 `Gallery.js` **导出**（不使用 `default` 关键字）：

```js
export function Profile() {
  // ...
}
```

接着，用具名导入的方式，从 `Gallery.js` 文件中 **导入** `Profile` 组件（用大括号）:

```js
import { Profile } from './Gallery.js';
```

最后，在 `App` 组件里 **渲染** `<Profile />`：

```js
export default function App() {
  return <Profile />;
}
```

现在，`Gallery.js` 包含两个导出：一个是默认导出的 `Gallery`，另一个是具名导出的 `Profile`。`App.js` 中均导入了这两个组件。尝试将 `<Profile />` 改成 `<Gallery />`，回到示例中：

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

示例中混合使用了默认导出和具名导出：

* `Gallery.js`:
  - 使用 **具名导出** 的方式，将 `Profile` 组件导出，并取名为 `Profile`。
  - 使用 **默认导出** 的方式，将 `Gallery` 组件导出。
* `App.js`:
  - 使用 **具名导入** 的方式，从 `Gallery.js` 中导入 `Profile` 组件，并取名为 `Profile`。
  - 使用 **默认导入** 的方式，从 `Gallery.js` 中导入 `Gallery` 组件。
  - 使用 **默认导出** 的方式，将根组件 `App` 导出。

<Recap>

在本章节中，你学到了：

* 何为根组件
* 如何导入和导出一个组件
* 何时和如何使用默认和具名导入导出
* 如何在一个文件里导出多个组件

</Recap>



<Challenges>

#### 进一步拆分组件 {/*split-the-components-further*/}

现在，`Gallery.js` 同时导出了 `Profile` 和 `Gallery`，这会让人感到有点混淆。

尝试将 `Profile` 组件移动到 `Profile.js` 文件中，然后更新 `App` 组件，依次渲染 `<Profile />` 和 `<Gallery />` 。

你也许会使用默认导出或者具名导出的方式，来导出 `Profile` 组件，但请保证在 `App.js` 和 `Gallery.js` 里使用相应的导入语句！具体可以参考下面的表格：

| 语法           | 导出语句                           | 导入语句                          |
| -----------    | -----------                        | -----------                       |
| 默认  | `export default function Button() {}` | `import Button from './Button.js';`     |
| 具名  | `export function Button() {}`         | `import { Button } from './Button.js';` |

<Hint>

不要忘记在调用它们的地方导入你的组件。因为 `Gallery` 中也调用了 `Profile` 组件。

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

当你使用其中一种导出方式完成以上任务后，请尝试使用另一种导出方式实现。

<Solution>

具名导出的解决方案：

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

默认导出的解决方案：

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
