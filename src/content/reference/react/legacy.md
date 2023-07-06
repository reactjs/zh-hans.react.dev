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
* [`isValidElement`](/reference/react/isValidElement) 检测参数值是否为 React 元素，通常会与 [`cloneElement`.](/reference/react/cloneElement) 一起使用。
* [`PureComponent`](/reference/react/PureComponent) 与 [`Component`](/reference/react/Component) 类似，但是当 props 相同时会跳过重新渲染。[查看替代方案](/reference/react/PureComponent#alternatives)。


---

## 已弃用的 API {/*deprecated-apis*/}

<Deprecated>

这些 API 将在未来的 React 主要版本中被移除。

</Deprecated>

* [`createFactory`](/reference/react/createFactory) 可以创建一个能够生成指定类型 React 元素的函数。
