---
title: 渲染和提交
translators:
  - oceanlvr
---

<Intro>

组件显示到屏幕之前，其必须被 React 渲染。理解这些处理步骤将帮助您思考代码的执行过程并能解释其行为。

</Intro>

<YouWillLearn>

* 在 React 中渲染的含义是什么
* 为什么以及什么时候 React 会渲染一个组件
* 在屏幕上显示组件所涉及的步骤
* 为什么渲染不总是伴随着 DOM 更新

</YouWillLearn>

想象一下，您的组件是厨房里的厨师，用食材“组装”成美味的菜肴。在这种场景下，React 是一名服务员，他接收客户的请求并给用户们带回完成的订单。请求和提供 UI 的过程总共包括三个步骤： 

1. 渲染 **触发中** (传递客户的订单到厨房)
2. 组件 **渲染中** (从厨房取得完成的订单)
3. 修改 **提交中** (将订单放在桌子上)

<IllustrationBlock sequential>
  <Illustration caption="触发" alt="React as a server in a restaurant, fetching orders from the users and delivering them to the Component Kitchen." src="/images/docs/illustrations/i_render-and-commit1.png" />
  <Illustration caption="渲染" alt="The Card Chef gives React a fresh Card component." src="/images/docs/illustrations/i_render-and-commit2.png" />
  <Illustration caption="提交" alt="React delivers the Card to the user at their table." src="/images/docs/illustrations/i_render-and-commit3.png" />
</IllustrationBlock>

## 步骤 1: 触发一次渲染 {/*step-1-trigger-a-render*/}

有两种原因会导致组件的渲染:

1. 组件的 **初始化渲染。**
2. 组件的 **状态发生了改变。**

### 初始化渲染 {/*initial-render*/}

当应用启动时，会触发初始渲染。框架和沙箱有时会隐藏这部分代码，但这是通过使用根组件和目标 DOM 节点调用 `ReactDOM.render` 来达成的：

<Sandpack>

```js index.js active
import Image from './Image.js';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <Image />,
  document.getElementById('root')
);
```

```js Image.js
export default function Image() {
  return (
    <img
      src="https://i.imgur.com/ZF6s192.jpg"
      alt="'Floralis Genérica' by Eduardo Catalano: a gigantic metallic flower sculpture with reflective petals"
    />
  );
}
```

</Sandpack>

试着注释掉 `ReactDOM.render`，然后您将会看到组件消失。

### 状态更新时重新渲染 {/*re-renders-when-state-updates*/}

一旦组件被渲染初始化后，您可以通过使用 [`setState`](reference/setstate) 更新其状态来触发之后的渲染。更新组件的状态会自动将渲染送入队列。（您可以想象这种情况为餐厅客人于第一次下单之后点了一份茶或点心或各种东西，具体取决于他们的状态现在是饿了或是渴了。）

<IllustrationBlock sequential>
  <Illustration caption="状态更新..." alt="React as a server in a restaurant, serving a Card UI to the user, represented as a patron with a cursor for their head. They patron expresses they want a pink card, not a black one!" src="/images/docs/illustrations/i_rerender1.png" />
  <Illustration caption="...触发..." alt="React returns to the Component Kitchen and tells the Card Chef they need a pink Card." src="/images/docs/illustrations/i_rerender2.png" />
  <Illustration caption="...渲染!" alt="The Card Chef gives React the pink Card." src="/images/docs/illustrations/i_rerender3.png" />
</IllustrationBlock>

## 步骤 2: React 渲染您的组件 {/*step-2-react-renders-your-components*/}

在你触发渲染后，React 会调用你的组件来确定要在屏幕上显示的内容。**"渲染中" 即 React 在调用您的组件。** 

* **当第一次渲染,** React 会调用根组件
* **对于后续的渲染,** React 将调用其状态更新触发了渲染的函数组件。

这个处理是递归的：如果更新组件返回了一些其他的组件，React 接下来将会渲染 _那个_ 组件，同时如果那个组件也返回一些其他的组件，接下来也会渲染 _那个_ 组件，返回如此。这个过程会持续下去直到没有更多的嵌套组件而 React 也就会确切地知道哪些东西应该显示到屏幕上了。

在接下来的例子中，React 将会调用 `Gallery()` 和 `Image()` 若干次：

<Sandpack>

```js Gallery.js active
export default function Gallery() {
  return (
    <section>
      <h1>鼓舞人心的雕塑</h1>
      <Image />
      <Image />
      <Image />
    </section>
  );
}

function Image() {
  return (
    <img
      src="https://i.imgur.com/ZF6s192.jpg"
      alt="'Floralis Genérica' by Eduardo Catalano: a gigantic metallic flower sculpture with reflective petals"
    />
  );
}
```

```js index.js
import Gallery from './Gallery.js';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <Gallery />,
  document.getElementById('root')
);
```

```css
img { margin: 0 10px 10px 0; }
```

</Sandpack>

* **在初次渲染中，** React 将会为`<section>`，`<h1>` 和三个 `<img>` 标签 [创建 DOM 节点](https://developer.mozilla.org/docs/Web/API/Document/createElement)。
* **在一次重渲染过程中,** React 将计算它们的哪些属性（如果有）自上次渲染以来已更改。在下一步（提交阶段）之前，它不会对这些信息执行任何操作。

<Gotcha>

渲染必须总是一次 [纯计算](/learn/keeping-components-pure):

* **一些输入，一些输出。** 给定相同的输入，组件应始终返回相同的 JSX。（当有人点了西红柿沙拉时，他们不应该收到洋葱沙拉！）
* **管好它自己的事情。** 它不应更改渲染之前存在的任何对象或变量。（一个订单不应更改其他任何人的订单。）

否则，随着代码库复杂性的增加，您可能会遇到令人困惑的错误和不可预测的行为。在"严格模式"下开发时，React 会调用每个组件的函数两次，这可以帮助发现由不纯函数引起的错误。

</Gotcha>

<DeepDive title="性能优化">

如果更新的组件在树中的位置非常高，渲染所有嵌套的组件并且带有更新后的组件这种默认行为不是性能上的最佳选择。如果您遇到了性能问题，[性能](/learn/performance) 章节描述了几种可选的解决方案 。**不要过早优化！**

</DeepDive>

## 步骤 3: React 提交更改到 DOM 上 {/*step-3-react-commits-changes-to-the-dom*/}

在（调用）渲染你的组件之后，React 将会修改 DOM。

* **对于初次渲染，** React 会使用 [`appendChild()`](https://developer.mozilla.org/docs/Web/API/Node/appendChild) DOM API 以将其创建的所有 DOM 节点并放在屏幕上。
* **对于重渲染，** React 将应用最少的必要操作（在渲染时计算！），以使 DOM 与最新的渲染输出匹配。

**React 仅在渲染之间存在差异时更改 DOM 节点。** 例如，有一个组件，它每秒使用从父组件传递下来的不同属性重新渲染。注意，您如果添加一些文本到 `<input>` 标签，更新它的 `value`，但是文本不会在组件重渲染时消失：

<Sandpack>

```js Clock.js active
export default function Clock({ time }) {
  return (
    <>
      <h1>{time}</h1>
      <input />
    </>
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
  return (
    <Clock time={time.toLocaleTimeString()} />
  );
}
```

</Sandpack>

这是有效的是因为在最后一步中，React 只使用最新的 `time` 更新 `<h1>` 标签的内容。它看到 `<input>` 标签出现在 JSX 中与上次相同的位置，因此 React 不会触碰 `<input>` 标签或它的 `value`！
## 尾声：浏览器绘制 {/*epilogue-browser-paint*/}

在渲染完成之后 React 会更新 DOM，浏览器会重绘这个屏幕，尽管这个过程被称之为 “浏览器重绘” ("browser rendering")，我们将它称为 “绘制” ("painting")，以避免在这些文档的其余部分中混淆。

<Illustration alt="A browser painting 'still life with card element'." src="/images/docs/illustrations/i_browser-paint.png" />

<Recap>

* 在一个 React 应用中一次屏幕更新都会发生以下三个步骤：
  1. 触发
  2. 渲染
  3. 提交
* 您可以使用严格模式去找到组件中的错误
* React 不会去修改重渲染结果与上次一样的 DOM

</Recap>

