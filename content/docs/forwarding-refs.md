---
id: forwarding-refs
title: Refs 转发
permalink: docs/forwarding-refs.html
---

> Try the new React documentation.
> 
> These new documentation pages teach modern React and include live examples:
>
> - [Manipulating the DOM with Refs](https://beta.reactjs.org/learn/manipulating-the-dom-with-refs)
> - [`forwardRef`](https://beta.reactjs.org/reference/react/forwardRef)
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

Ref 转发是一项将 [ref](/docs/refs-and-the-dom.html) 自动地通过组件传递到其一子组件的技巧。对于大多数应用中的组件来说，这通常不是必需的。但其对某些组件，尤其是可重用的组件库是很有用的。最常见的案例如下所述。

## 转发 refs 到 DOM 组件 {#forwarding-refs-to-dom-components}

考虑这个渲染原生 DOM 元素 `button` 的 `FancyButton` 组件：
`embed:forwarding-refs/fancy-button-simple.js`

React 组件隐藏其实现细节，包括其渲染结果。其他使用 `FancyButton` 的组件**通常不需要**获取内部的 DOM 元素 `button` 的 [ref](/docs/refs-and-the-dom.html)。这很好，因为这防止组件过度依赖其他组件的 DOM 结构。

虽然这种封装对类似 `FeedStory` 或 `Comment` 这样的应用级组件是理想的，但其对 `FancyButton` 或 `MyTextInput` 这样的高可复用“叶”组件来说可能是不方便的。这些组件倾向于在整个应用中以一种类似常规 DOM `button` 和 `input` 的方式被使用，并且访问其 DOM 节点对管理焦点，选中或动画来说是不可避免的。

**Ref 转发是一个可选特性，其允许某些组件接收 `ref`，并将其向下传递（换句话说，“转发”它）给子组件。**

在下面的示例中，`FancyButton` 使用 `React.forwardRef` 来获取传递给它的 `ref`，然后转发到它渲染的 DOM `button`：

`embed:forwarding-refs/fancy-button-simple-ref.js`

这样，使用 `FancyButton` 的组件可以获取底层 DOM 节点 `button` 的 ref ，并在必要时访问，就像其直接使用 DOM `button` 一样。

以下是对上述示例发生情况的逐步解释：

1. 我们通过调用 `React.createRef` 创建了一个 [React ref](/docs/refs-and-the-dom.html) 并将其赋值给 `ref` 变量。
1. 我们通过指定 `ref` 为 JSX 属性，将其向下传递给 `<FancyButton ref={ref}>`。
1. React 传递 `ref` 给 `forwardRef` 内函数 `(props, ref) => ...`，作为其第二个参数。
1. 我们向下转发该 `ref` 参数到 `<button ref={ref}>`，将其指定为 JSX 属性。
1. 当 ref 挂载完成，`ref.current` 将指向 `<button>` DOM 节点。

>注意
>
>第二个参数 `ref` 只在使用 `React.forwardRef` 定义组件时存在。常规函数和 class 组件不接收 `ref` 参数，且 props 中也不存在 `ref`。
>
>Ref 转发不仅限于 DOM 组件，你也可以转发 refs 到 class 组件实例中。

## 组件库维护者的注意事项 {#note-for-component-library-maintainers}

**当你开始在组件库中使用 `forwardRef` 时，你应当将其视为一个破坏性更改，并发布库的一个新的主版本。** 这是因为你的库可能会有明显不同的行为（例如 refs 被分配给了谁，以及导出了什么类型），并且这样可能会导致依赖旧行为的应用和其他库崩溃。

出于同样的原因，当 `React.forwardRef` 存在时有条件地使用它也是不推荐的：它改变了你的库的行为，并在升级 React 自身时破坏用户的应用。

## 在高阶组件中转发 refs {#forwarding-refs-in-higher-order-components}

这个技巧对[高阶组件](/docs/higher-order-components.html)（也被称为 HOC）特别有用。让我们从一个输出组件 props 到控制台的 HOC 示例开始：
`embed:forwarding-refs/log-props-before.js`

“logProps” HOC 透传（pass through）所有 `props` 到其包裹的组件，所以渲染结果将是相同的。例如：我们可以使用该 HOC 记录所有传递到 “fancy button” 组件的 props：
`embed:forwarding-refs/fancy-button.js`

下面的示例有一点需要注意：refs 将不会透传下去。这是因为 `ref` 不是 prop 属性。就像 `key` 一样，其被 React 进行了特殊处理。如果你对 HOC 添加 ref，该 ref 将引用最外层的容器组件，而不是被包裹的组件。

这意味着用于我们 `FancyButton` 组件的 refs 实际上将被挂载到 `LogProps` 组件：
`embed:forwarding-refs/fancy-button-ref.js`

幸运的是，我们可以使用 `React.forwardRef` API 明确地将 refs 转发到内部的 `FancyButton` 组件。`React.forwardRef` 接受一个渲染函数，其接收 `props` 和 `ref` 参数并返回一个 React 节点。例如：
`embed:forwarding-refs/log-props-after.js`

## 在 DevTools 中显示自定义名称 {#displaying-a-custom-name-in-devtools}

`React.forwardRef` 接受一个渲染函数。React DevTools 使用该函数来决定为 ref 转发组件显示的内容。

例如，以下组件将在 DevTools 中显示为 “*ForwardRef*”：

`embed:forwarding-refs/wrapped-component.js`

如果你命名了渲染函数，DevTools 也将包含其名称（例如 “*ForwardRef(myFunction)*”）：

`embed:forwarding-refs/wrapped-component-with-function-name.js`

你甚至可以设置函数的 `displayName` 属性来包含被包裹组件的名称：

`embed:forwarding-refs/customized-display-name.js`
