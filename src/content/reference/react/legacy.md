---
title: "过时的 React API"
---

<Intro>

这些 API 从 `react` 包中导出，但是已经不再推荐在最新代码中使用。参见下方每个 API 对应的页面以查看替代方案。

</Intro>

---

## 过时的 API {/*legacy-apis*/}

* [`Children`](/reference/react/Children) 允许你处理和转化作为 `children` 的 JSX。[查看替代方案](/reference/react/Children#alternatives)。
* [`cloneElement`](/reference/react/cloneElement) 允许你使用一个元素作为初始值创建一个新的 React 元素。[查看替代方案](/reference/react/cloneElement#alternatives)。
* [`Component`](/reference/react/Component) 允许你定义一个 JavaScript class 作为 React 类式组件。[查看替代方案](/reference/react/Component#alternatives)。
* [`createElement`](/reference/react/createElement) 允许你创建一个 React 元素，但是一般会使用 JSX。
* [`createRef`](/reference/react/createRef) 允许你创建一个可以包含任何值的 ref 对象。[查看替代方案](/reference/react/createRef#alternatives)。
* [`forwardRef`](/reference/react/forwardRef) 允许你使用 [ref](/learn/manipulating-the-dom-with-refs) 将 DOM 节点暴露给父组件。
* [`isValidElement`](/reference/react/isValidElement) 检测参数值是否为 React 元素，通常会与 [`cloneElement`.](/reference/react/cloneElement) 一起使用。
* [`PureComponent`](/reference/react/PureComponent) 与 [`Component`](/reference/react/Component) 类似，但是当 props 相同时会跳过重新渲染。[查看替代方案](/reference/react/PureComponent#alternatives)。

---

## 已移除的 API {/*removed-apis*/}

这些 API 在 React 19 中被移除。

* [`createFactory`](https://18.react.dev/reference/react/createFactory)：使用 JSX 来替代。
* 类组件：[`static contextTypes`](https://18.react.dev//reference/react/Component#static-contexttypes): 使用 [`static contextType`](#static-contexttype) 来替代。
* 类组件：[`static childContextTypes`](https://18.react.dev//reference/react/Component#static-childcontexttypes): 使用 [`static contextType`](#static-contexttype) 来替代。
* 类组件：[`static getChildContext`](https://18.react.dev//reference/react/Component#getchildcontext): 使用 [`Context`](/reference/react/createContext#provider) 来替代。
* 类组件：[`static propTypes`](https://18.react.dev//reference/react/Component#static-proptypes): 使用 [TypeScript](https://www.typescriptlang.org/) 等类型系统来替代。
* 类组件：[`this.refs`](https://18.react.dev//reference/react/Component#refs): 使用 [`createRef`](/reference/react/createRef) 来替代。
