---
title: 条件渲染
translators:
  - Alienover
---

<Intro>

通常你的组件会需要根据不同的情况显示不同的内容。在 React 中，你可以通过使用 JavaScript 的 `if` 语句、`&&` 和 `? :` 运算符来选择性地渲染 JSX。

</Intro>

<YouWillLearn>

* 如何根据不同条件返回不同的 JSX
* 如何根据不同条件包含或者去掉部分 JSX
* 一些你会在 React 代码库里遇到的常用的条件语法快捷表达式

</YouWillLearn>

## 条件返回 JSX {/*conditionally-returning-jsx*/}

假设有一个 `PackingList` 组件，里面渲染多个 `Item` 组件，每个物品可标记为打包与否：

<Sandpack>

```js
function Item({ name, isPacked }) {
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride 的行李清单</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="宇航服" 
        />
        <Item 
          isPacked={true} 
          name="带金箔的头盔" 
        />
        <Item 
          isPacked={false} 
          name="Tam 的照片" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

需要注意的是，有些 `Item` 组件的 `isPacked` 属性是被设为 `true` 而不是 `false`。你可以在那些满足 `isPacked={true}` 条件的物品旁加上一个勾选符号（✔）。

你可以用 [if/else 语句](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/if...else) 去判断：

```js
if (isPacked) {
  return <li className="item">{name} ✔</li>;
}
return <li className="item">{name}</li>;
```

如果 `isPacked` 属性是 `true`，这段代码会**返回一个不一样的 JSX**。通过这样的改动，一些物品的名字后面会出现一个勾选符号：

<Sandpack>

```js
function Item({ name, isPacked }) {
  if (isPacked) {
    return <li className="item">{name} ✔</li>;
  }
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride 的行李清单</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="宇航服" 
        />
        <Item 
          isPacked={true} 
          name="带金箔的头盔" 
        />
        <Item 
          isPacked={false} 
          name="Tam 的照片" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

动手尝试一下，看看各种情况会出现什么不同的结果！

留意这里你是怎么使用 JavaScript 的 `if` 和 `return` 语句来写分支逻辑。在 React 中，是由 JavaScript 来处理控制流的（比如条件）。

### 选择性地返回 `null` {/*conditionally-returning-nothing-with-null*/}

在一些情况下，你不想有任何东西进行渲染。比如，你不想显示已经打包好的物品。但一个组件必须返回一些东西。这种情况下，你可以直接返回 `null`。

```js
if (isPacked) {
  return null;
}
return <li className="item">{name}</li>;
```

如果组件的 `isPacked` 属性为 `true`，那么它将只返回 `null`。否则，它将返回相应的 JSX 用来渲染。

<Sandpack>

```js
function Item({ name, isPacked }) {
  if (isPacked) {
    return null;
  }
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride 的行李清单</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="宇航服" 
        />
        <Item 
          isPacked={true} 
          name="带金箔的头盔" 
        />
        <Item 
          isPacked={false} 
          name="Tam 的照片" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

实际上，在组件里返回 `null` 并不常见，因为这样会让想使用它的开发者感觉奇怪。通常情况下，你可以在父组件里选择是否要渲染该组件。让我们接着往下看吧！

## 选择性地包含 JSX {/*conditionally-including-jsx*/}

在之前的例子里，你在组件内部控制哪些 JSX 树（如果有的话！）会返回。你可能已经发现了在渲染输出里会有一些重复的内容：

```js
<li className="item">{name} ✔</li>
```

和下面的写法很像：

```js
<li className="item">{name}</li>
```

两个条件分支都会返回 `<li className="item">...</li>`：

```js
if (isPacked) {
  return <li className="item">{name} ✔</li>;
}
return <li className="item">{name}</li>;
```

虽然这些重复的内容没什么害处，但这样可能会导致你的代码更难维护。比如你想更改 `className`？你就需要修改两个地方！针对这种情况，你可以通过选择性地包含一小段 JSX 来让你的代码更加 [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)。

### 三目运算符（`? :`） {/*conditional-ternary-operator--*/}

JavaScript 有一种紧凑型语法来实现条件判断表达式——[条件运算符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) 又称“三目运算符”。

除了这样：

```js
if (isPacked) {
  return <li className="item">{name} ✔</li>;
}
return <li className="item">{name}</li>;
```

你还可以这样实现：

```js
return (
  <li className="item">
    {isPacked ? name + ' ✔' : name}
  </li>
);
```

你可以认为，*“如果 `isPacked` 为 true 时，则（`?`）渲染 `name + ' ✔'`，否则（`:`）渲染 `name`。”*

<DeepDive>

#### 两个例子完全一样吗？ {/*are-these-two-examples-fully-equivalent*/}

如果你之前是习惯面向对象开发的，你可能会认为上面的两个例子略有不同，因为其中一个可能会创建两个不同的 `<li>` “实例”。但 JSX 元素不是“实例”，因为它们没有内部状态也不是真实的 DOM 节点。它们只是一些简单的描述，就像图纸一样。所以上面这两个例子事实上是完全相同的。在 [状态的保持和重置](/learn/preserving-and-resetting-state) 里会深入探讨其原因。

</DeepDive>

现在，假如你想将对应物品的文本放到另一个 HTML 标签里，比如用 `<del>` 来显示删除线。你可以添加更多的换行和括号，以便在各种情况下更好地去嵌套 JSX：

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {isPacked ? (
        <del>
          {name + ' ✔'}
        </del>
      ) : (
        name
      )}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride 的行李清单</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="宇航服" 
        />
        <Item 
          isPacked={true} 
          name="带金箔的头盔" 
        />
        <Item 
          isPacked={false} 
          name="Tam 的照片" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

对于简单的条件判断，这样的风格可以很好地实现，但需要适量使用。如果你的组件里有很多的嵌套式条件表达式，则需要考虑通过提取为子组件来简化这些嵌套表达式。在 React 里，标签也是你代码中的一部分，所以你可以使用变量和函数来整理一些复杂的表达式。

### 与运算符（`&&`） {/*logical-and-operator-*/}

你会遇到的另一个常见的快捷表达式是 [JavaScript 逻辑与（`&&`）运算符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Logical_AND#:~:text=The%20logical%20AND%20(%20%26%26%20)%20operator,it%20returns%20a%20Boolean%20value.)。在 React 组件里，通常用在当条件成立时，你想渲染一些 JSX，**或者不做任何渲染**。使用 `&&`，你也可以实现仅当 `isPacked` 为 `true` 时，渲染勾选符号。

```js
return (
  <li className="item">
    {name} {isPacked && '✔'}
  </li>
);
```

你可以认为，*“当 `isPacked` 为真值时，则（`&&`）渲染勾选符号，否则，不渲染。”*

下面为具体的例子：

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✔'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride 的行李清单</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="宇航服" 
        />
        <Item 
          isPacked={true} 
          name="带金箔的头盔" 
        />
        <Item 
          isPacked={false} 
          name="Tam 的照片" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

当 [JavaScript && 表达式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Logical_AND) 的左侧（我们的条件）为 `true` 时，它则返回其右侧的值（在我们的例子里是勾选符号）。但条件的结果是 `false`，则整个表达式会变成 `false`。在 JSX 里，React 会将 `false` 视为一个“空值”，就像 `null` 或者 `undefined`，这样 React 就不会在这里进行任何渲染。


<Pitfall>

**切勿将数字放在 `&&` 左侧.**

JavaScript 会自动将左侧的值转换成布尔类型以判断条件成立与否。然而，如果左侧是 `0`，整个表达式将变成左侧的值（`0`），React 此时则会渲染 `0` 而不是不进行渲染。

例如，一个常见的错误是 `messageCount && <p>New messages</p>`。其原本是想当 `messageCount` 为 0 的时候不进行渲染，但实际上却渲染了 `0`。

为了更正，可以将左侧的值改成布尔类型：`messageCount > 0 && <p>New messages</p>`。

</Pitfall>

### 选择性地将 JSX 赋值给变量 {/*conditionally-assigning-jsx-to-a-variable*/}

当这些快捷方式妨碍写普通代码时，可以考虑使用 `if` 语句和变量。因为你可以使用 [`let`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/let) 进行重复赋值，所以一开始你可以将你想展示的（这里指的是物品的名字）作为默认值赋予给该变量。

```js
let itemContent = name;
```

结合 `if` 语句，当 `isPacked` 为 `true` 时，将 JSX 表达式的值重新赋值给 `itemContent`：

```js
if (isPacked) {
  itemContent = name + " ✔";
}
```

[在 JSX 中通过大括号使用 JavaScript](/learn/javascript-in-jsx-with-curly-braces#using-curly-braces-a-window-into-the-javascript-world)。将变量用大括号嵌入在返回的 JSX 树中，来嵌套计算好的表达式与 JSX：

```js
<li className="item">
  {itemContent}
</li>
```

这种方式是最冗长的，但也是最灵活的。下面是相关的例子：

<Sandpack>

```js
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = name + " ✔";
  }
  return (
    <li className="item">
      {itemContent}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride 的行李清单</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="宇航服" 
        />
        <Item 
          isPacked={true} 
          name="带金箔的头盔" 
        />
        <Item 
          isPacked={false} 
          name="Tam 的照片" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

跟之前的一样，这个方式不仅仅适用于文本，任意的 JSX 均适用：

<Sandpack>

```js
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = (
      <del>
        {name + " ✔"}
      </del>
    );
  }
  return (
    <li className="item">
      {itemContent}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride 的行李清单</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="宇航服" 
        />
        <Item 
          isPacked={true} 
          name="带金箔的头盔" 
        />
        <Item 
          isPacked={false} 
          name="Tam 的照片" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

如果对 JavaScript 不熟悉，这些不同的风格一开始可能会让你感到不知所措。但是，学习这些将有助于你理解和写任何的 JavaScript 代码，而不仅仅是 React 组件。一开始可以选择一个你喜欢的来用，然后当你忘记其他的怎么用时，可以再翻阅这份参考资料。

<Recap>

* 在 React，你可以使用 JavaScript 来控制分支逻辑。
* 你可以使用 `if` 语句来选择性地返回 JSX 表达式。
* 你可以选择性地将一些 JSX 赋值给变量，然后用大括号将其嵌入到其他 JSX 中。
* 在 JSX 中，`{cond ? <A /> : <B />}` 表示 *“当 `cond` 为真值时, 渲染 `<A />`，否则 `<B />`”*。
* 在 JSX 中，`{cond && <A />}` 表示 *“当 `cond` 为真值时, 渲染 `<A />`，否则不进行渲染”*。
* 快捷的表达式很常见，但如果你更倾向于使用 `if`，你也可以不使用它们，。

</Recap>



<Challenges>

#### 用 `? :` 给未完成的物品加上图标 {/*show-an-icon-for-incomplete-items-with--*/}

当 `isPacked` 不为 `true` 时，使用条件运算符 （`cond ? a : b`） 来渲染 ❌

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✔'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride 的行李清单</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="宇航服" 
        />
        <Item 
          isPacked={true} 
          name="带金箔的头盔" 
        />
        <Item 
          isPacked={false} 
          name="Tam 的照片" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked ? '✔' : '❌'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride 的行李清单</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="宇航服" 
        />
        <Item 
          isPacked={true} 
          name="带金箔的头盔" 
        />
        <Item 
          isPacked={false} 
          name="Tam 的照片" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

</Solution>

#### 用 `&&` 展示物品的重要性 {/*show-the-item-importance-with-*/}

在这个例子里，每个 `Item` 接收一个名为 `importance` 的数字类型属性。使用 `&&` 运算符渲染 “_（重要性：X）_”，以斜体呈现，但仅作用于那些难度值为非零的物品。你的物品列表后最终应该如下：

* 宇航服 _（重要性: 9）_
* 带金箔的头盔
* Tam 的照片 _（重要性: 6）_

注意别忘了在这两个标签之间加上一个空格！

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride 的行李清单</h1>
      <ul>
        <Item 
          importance={9} 
          name="宇航服" 
        />
        <Item 
          importance={0} 
          name="带金箔的头盔" 
        />
        <Item 
          importance={6} 
          name="Tam 的照片" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

这样应该可以实现：

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
      {importance > 0 && ' '}
      {importance > 0 &&
        <i>（重要性: {importance}）</i>
      }
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride 的行李清单</h1>
      <ul>
        <Item 
          importance={9} 
          name="宇航服" 
        />
        <Item 
          importance={0} 
          name="带金箔的头盔" 
        />
        <Item 
          importance={6} 
          name="Tam 的照片" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

需注意的是，你必须使用 `importance > 0 && ...` 而不是 `importance && ...`，这样如果 `importantce` 是 `0`， `0` 就不会被渲染出来了！

在这个解决方案里，分别用了两个条件判断在名字和重要性标签里插入一个空格。另外，你也可以通过一个带前导空格的 fragment ：`importance > 0 && <> <i>...</i></>`，或者将空格放在 `<i>` 标签内：`importance > 0 && <i> ...</i>`, 来实现相同的效果。

</Solution>

#### 用 `if` 和变量重构多余的 `? :` {/*refactor-a-series-of---to-if-and-variables*/}

这个 `Drink` 组件使用了一系列的 `? :` 条件语句，根据 `name` 属性是 `"tea"` 还是 `"coffee"` 来显示不同的信息。问题是，每个饮品的信息是在不同的条件判断里的。请去掉那三个 `? :` 条件，使用一个 `if` 语句来重构这段代码。

<Sandpack>

```js
function Drink({ name }) {
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Part of plant</dt>
        <dd>{name === 'tea' ? 'leaf' : 'bean'}</dd>
        <dt>Caffeine content</dt>
        <dd>{name === 'tea' ? '15–70 mg/cup' : '80–185 mg/cup'}</dd>
        <dt>Age</dt>
        <dd>{name === 'tea' ? '4,000+ years' : '1,000+ years'}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

当你使用 `if` 语句完成了以上代码的重构，你会不会有其他的想法去简化它？

<Solution>

很多的方法可以解决这个问题，这是只是其中一个可以切入的点：

<Sandpack>

```js
function Drink({ name }) {
  let part, caffeine, age;
  if (name === 'tea') {
    part = 'leaf';
    caffeine = '15–70 mg/cup';
    age = '4,000+ years';
  } else if (name === 'coffee') {
    part = 'bean';
    caffeine = '80–185 mg/cup';
    age = '1,000+ years';
  }
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Part of plant</dt>
        <dd>{part}</dd>
        <dt>Caffeine content</dt>
        <dd>{caffeine}</dd>
        <dt>Age</dt>
        <dd>{age}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

这个例子中，每种饮品的信息是放在一起的，而没有将其分散到多个条件判断里。这会让我们以后可以更容易地增加更多的饮品。

还可以通过将饮品信息存入对象中，从而去掉所有的条件判断语句：

<Sandpack>

```js
const drinks = {
  tea: {
    part: 'leaf',
    caffeine: '15–70 mg/cup',
    age: '4,000+ years'
  },
  coffee: {
    part: 'bean',
    caffeine: '80–185 mg/cup',
    age: '1,000+ years'
  }
};

function Drink({ name }) {
  const info = drinks[name];
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Part of plant</dt>
        <dd>{info.part}</dd>
        <dt>Caffeine content</dt>
        <dd>{info.caffeine}</dd>
        <dt>Age</dt>
        <dd>{info.age}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
