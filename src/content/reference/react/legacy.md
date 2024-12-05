---
title: "过时的 React API"
---

<Intro>

这些 API 从 `react` 包中导出，但是已经不再推荐在最新代码中使用。参见下方每个 API 对应的页面以查看替代方案。

</Intro>

---

## 过时的 API {/*legacy-apis*/}

<<<<<<< HEAD
* [`Children`](/reference/react/Children) 允许你处理和转化作为 `children` 的 JSX。[查看替代方案](/reference/react/Children#alternatives)。
* [`cloneElement`](/reference/react/cloneElement) 允许你使用一个元素作为初始值创建一个新的 React 元素。[查看替代方案](/reference/react/cloneElement#alternatives)。
* [`Component`](/reference/react/Component) 允许你定义一个 JavaScript class 作为 React 类式组件。[查看替代方案](/reference/react/Component#alternatives)。
* [`createElement`](/reference/react/createElement) 允许你创建一个 React 元素，但是一般会使用 JSX。
* [`createRef`](/reference/react/createRef) 允许你创建一个可以包含任何值的 ref 对象。[查看替代方案](/reference/react/createRef#alternatives)。
* [`isValidElement`](/reference/react/isValidElement) 检测参数值是否为 React 元素，通常会与 [`cloneElement`.](/reference/react/cloneElement) 一起使用。
* [`PureComponent`](/reference/react/PureComponent) 与 [`Component`](/reference/react/Component) 类似，但是当 props 相同时会跳过重新渲染。[查看替代方案](/reference/react/PureComponent#alternatives)。
=======
* [`Children`](/reference/react/Children) lets you manipulate and transform the JSX received as the `children` prop. [See alternatives.](/reference/react/Children#alternatives)
* [`cloneElement`](/reference/react/cloneElement) lets you create a React element using another element as a starting point. [See alternatives.](/reference/react/cloneElement#alternatives)
* [`Component`](/reference/react/Component) lets you define a React component as a JavaScript class. [See alternatives.](/reference/react/Component#alternatives)
* [`createElement`](/reference/react/createElement) lets you create a React element. Typically, you'll use JSX instead.
* [`createRef`](/reference/react/createRef) creates a ref object which can contain arbitrary value. [See alternatives.](/reference/react/createRef#alternatives)
* [`forwardRef`](/reference/react/forwardRef) lets your component expose a DOM node to parent component with a [ref.](/learn/manipulating-the-dom-with-refs)
* [`isValidElement`](/reference/react/isValidElement) checks whether a value is a React element. Typically used with [`cloneElement`.](/reference/react/cloneElement)
* [`PureComponent`](/reference/react/PureComponent) is similar to [`Component`,](/reference/react/Component) but it skip re-renders with same props. [See alternatives.](/reference/react/PureComponent#alternatives)
>>>>>>> acda167885d7db3a5e61d5d992135a1f5f574f6c

---

<<<<<<< HEAD
## 已弃用的 API {/*deprecated-apis*/}
=======
## Removed APIs {/*removed-apis*/}
>>>>>>> acda167885d7db3a5e61d5d992135a1f5f574f6c

These APIs were removed in React 19:

<<<<<<< HEAD
这些 API 将在未来的 React 主要版本中被移除。

</Deprecated>

* [`createFactory`](/reference/react/createFactory) 可以创建一个能够生成指定类型 React 元素的函数。
=======
* [`createFactory`](https://18.react.dev/reference/react/createFactory): use JSX instead.
* Class Components: [`static contextTypes`](https://18.react.dev//reference/react/Component#static-contexttypes): use [`static contextType`](#static-contexttype) instead.
* Class Components: [`static childContextTypes`](https://18.react.dev//reference/react/Component#static-childcontexttypes): use [`static contextType`](#static-contexttype) instead.
* Class Components: [`static getChildContext`](https://18.react.dev//reference/react/Component#getchildcontext): use [`Context.Provider`](/reference/react/createContext#provider) instead.
* Class Components: [`static propTypes`](https://18.react.dev//reference/react/Component#static-proptypes): use a type system like [TypeScript](https://www.typescriptlang.org/) instead.
* Class Components: [`this.refs`](https://18.react.dev//reference/react/Component#refs): use [`createRef`](/reference/react/createRef) instead.
>>>>>>> acda167885d7db3a5e61d5d992135a1f5f574f6c
