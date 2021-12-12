---
title: "React v16.8：Hook 发布"
author: [gaearon]
---

从 React 16.8 开始，[React Hook](/docs/hooks-intro.html) 稳定版本正式发布啦！

## 什么是 Hook？ {/*what-are-hooks*/}

Hook 允许你在不使用 class 的情况下使用 state 和 React 其他特性。你可以 **编写自定义的 Hook** 来在不同的组件中共享有状态的逻辑。

如果你之前从没听过 Hook，你可能会对以下资料感兴趣：

* [Hook 介绍](/docs/hooks-intro.html) 解释了为什么我们为 React 添加 Hook。
* [Hook 一览](/docs/hooks-overview.html) 是快速地对内置 Hook 的概览。
* [搭建你自己的 Hook](/docs/hooks-custom.html) 示范了如何使用自定义的 Hook 来重用代码。
* [React Hook 的意义](https://medium.com/@dan_abramov/making-sense-of-react-hooks-fdbde8803889) 探索了被 Hook 解锁的新可能性。
* [useHooks.com](https://usehooks.com/) 一些社区维护的 Hook 示例和实现。

**你并不是必须现在就学习 Hook**。Hook 并没有突破性的改变，并且我们并没有要删除 React class 的计划。其中 [Hook FAQ](/docs/hooks-faq.html) 描述了逐步采纳策略。

## 不需要大型重写 {/*no-big-rewrites*/}

我们不建议立马重写你的项目以在其中使用 Hook。相反，试着在一些新的组件中使用 Hook，并且告诉我们你的想法。使用 Hook 的代码可以和已经存在的使用 class 的的代码 [一起使用](/docs/hooks-intro.html#gradual-adoption-strategy)。

## 我今天可以使用 Hook 吗？ {/*can-i-use-hooks-today*/}

可以！从 16.8.0 开始，React 为以下几个功能引入了 React Hook 的稳定实现：

* React DOM
* React DOM Server
* React Test Renderer
* React Shallow Renderer

请注意 **为了使用 Hook，所有的 React 包的版本需要在 16.8.0 或以上**。如果你忘记对包进行升级，会造成 Hook 无法使用，比如说忘记升级 React DOM。

**React Native 会在 [0.59 版本](https://github.com/react-native-community/react-native-releases/issues/79#issuecomment-457735214) 支持 Hook。**

## 工具支持 {/*tooling-support*/}

React DevTools 现在已经支持 React Hook。目前最新版的 Flow 和 TypeScript 定义也为 React 提供了支持。我们强烈建议使用新的 [`eslint-plugin-react-hooks` 提示规范](https://www.npmjs.com/package/eslint-plugin-react-hooks) 来加强对 Hook 的使用。这个功能马上就会被加到 Create React App 的默认配置里。

## 下一步 {/*whats-next*/}

我们在最近发布的 [React 路线图](/blog/2018/11/27/react-16-roadmap.html) 里描述了下几个月的计划。

请注意现在 React Hook 还并没有覆盖*所有*的 class 使用情况，但是已经 [十分接近](/docs/hooks-faq.html#do-hooks-cover-all-use-cases-for-classes) 了。目前，只有 `getSnapshotBeforeUpdate()` 和 `componentDidCatch()` 方法没有等价的 Hook API，并且这些生命周期相对来说不常用。如果你想的话，你可以在大多数的情况下使用 Hook 来编写代码。

尽管在 Hook 处于 alpha 测试阶段的时候，React 社区已经开发了很多有趣的 [示例](https://codesandbox.io/react-hooks) 和 [方法](https://usehooks.com) 来使用 Hook 开发动画、表单、订阅、和其他库结合使用等等。我们对 Hook 把代码复用变得简单、帮助你用一种更简单的方式来编写你的组件、并且有着更好的用户体验这件事上感到非常的激动。我们已经迫不及待地想看到你将要创造出什么了！

## 测试 Hook {/*testing-hooks*/}

我们在这次发布中已经添加了一个新的叫 `ReactTestUtils.act()` 的 API。它保证了在测试中的表现会与在浏览器中的行为会非常的接近。我们建议把所有渲染和触发更新的代码用 `act()` 方法包起来。测试框架也可以把他们的 API 用它包起来（例如，[`react-testing-library`](https://testing-library.com/react) 的 `render` 和 `fireEvent` 方法就是这样做的）。

例如，在 [这个页面](/docs/hooks-effect.html) 的计时器的例子可以用这样的方法来测试：

```js {3,20-22,29-31}
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import Counter from './Counter';

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it('can render and update a counter', () => {
  // 测试第一次渲染和影响
  act(() => {
    ReactDOM.render(<Counter />, container);
  });
  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('You clicked 0 times');
  expect(document.title).toBe('You clicked 0 times');

  // 测试第二次渲染和影响
  act(() => {
    button.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });
  expect(label.textContent).toBe('You clicked 1 times');
  expect(document.title).toBe('You clicked 1 times');
});
```

`act()` 所调用的方法也会刷新它们内部所产生的影响。

如果你需要测试一个自定义的 Hook，你可以在你的测试里写一个组件，并且在里面使用 Hook。然后你就可以测试你写的组件了。

为了减少样板代码，我们建议使用 [`react-testing-library`](https://testing-library.com/react)，它鼓励你像终端用户一样使用你的组件写测试代码。

## 致谢 {/*thanks*/}

我们非常感谢所有在 [Hook RFC](https://github.com/reactjs/rfcs/pull/68) 上发布并分享反馈的用户。我们已经阅读了你们所有的评论并且依此给我们最终的 API 做了一些调整。

## 安装 {/*installation*/}

### React {/*react*/}

React v16.8.0 已经在 npm 上发布。

使用 Yarn 来安装 React 16，运行：

```bash
yarn add react@^16.8.0 react-dom@^16.8.0
```

使用 npm 来安装 React 16，运行：

```bash
npm install --save react@^16.8.0 react-dom@^16.8.0
```

我们也在 CDN 上提供了 React 的 UMD 打包：

```html
<script crossorigin src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
```

请参考文档的 [详细安装指南](/docs/installation.html)。

### React Hook 的 ESLint 插件 {/*eslint-plugin-for-react-hooks*/}

> 注意
>
> 就像上面提到的，我们强烈建议使用 `eslint-plugin-react-hooks` 提示规范。
>
> 如果你正在使用 Create React App，与其说手动配置 ESLint，你可以等待马上发版并且包括这个提示规范的下个版本的 `react-scripts`。

假设你已经安装了 ESLint，运行：

```sh
# npm
npm install eslint-plugin-react-hooks --save-dev

# yarn
yarn add eslint-plugin-react-hooks --dev
```

然后把它加到你的 ESLint 配置里：

```js
{
  "plugins": [
    // ...
    "react-hooks"
  ],
  "rules": {
    // ...
    "react-hooks/rules-of-hooks": "error"
  }
}
```

## 更新日志 {/*changelog*/}

### React {/*react-1*/}

* 添加 [Hook](https://reactjs.org/docs/hooks-intro.html) — 一个不用编写 class 就能使用 state 和其他 React 特性的方法。（[@acdlite](https://github.com/acdlite) et al. in [#13968](https://github.com/facebook/react/pull/13968)）
* 改善 `useReducer` Hook 懒初始化 API。（[@acdlite](https://github.com/acdlite) in [#14723](https://github.com/facebook/react/pull/14723)）

### React DOM {/*react-dom*/}

* 为 `useState` 和 `useReducer` Hook 在相同的值下进行渲染。（[@acdlite](https://github.com/acdlite) in [#14569](https://github.com/facebook/react/pull/14569)）
* 不要比较传给 `useEffect`/`useMemo`/`useCallback` Hook 的第一个参数。（[@acdlite](https://github.com/acdlite) in [#14594](https://github.com/facebook/react/pull/14594)）
* 使用 `Object.is` 算法来比较 `useState` 和 `useReducer` 的值。（[@Jessidhia](https://github.com/Jessidhia) in [#14752](https://github.com/facebook/react/pull/14752)）
* 支持对传给 `React.lazy()` 的 thenable 对象进行同步。（[@gaearon](https://github.com/gaearon) in [#14626](https://github.com/facebook/react/pull/14626)）
* 严格模式（只有在开发的时候）渲染使用 Hook 的组件两次使其和 class 的表现一样。（[@gaearon](https://github.com/gaearon) in [#14654](https://github.com/facebook/react/pull/14654)）
* 在开发的时候 Hook 顺序匹配错误的警告。（[@threepointone](https://github.com/threepointone) in [#14585](https://github.com/facebook/react/pull/14585) and [@acdlite](https://github.com/acdlite) in [#14591](https://github.com/facebook/react/pull/14591)）
* Effect clean-up 方法必须返回 `undefined` 或者一个方法。其他的值，包括 `null`，都不被允许。[@acdlite](https://github.com/acdlite) in [#14119](https://github.com/facebook/react/pull/14119)

### React 测试渲染器 {/*react-test-renderer*/}

* 在浅层渲染中支持 Hook。（[@trueadm](https://github.com/trueadm) in [#14567](https://github.com/facebook/react/pull/14567)）
* 为浅层渲染修复与 `shouldComponentUpdate` 和 `getDerivedStateFromProps` 共同的 state。（[@chenesan](https://github.com/chenesan) in [#14613](https://github.com/facebook/react/pull/14613)）
* 为批量更新添加 `ReactTestRenderer.act()` 和 `ReactTestUtils.act()` 方法，因此测试可以和真实的行为变得更加相符。（[@threepointone](https://github.com/threepointone) in [#14744](https://github.com/facebook/react/pull/14744)）

### ESLint 插件：React Hook {/*eslint-plugin-react-hooks*/}

* 初次 [发版](https://www.npmjs.com/package/eslint-plugin-react-hooks)。（[@calebmer](https://github.com/calebmer) in [#13968](https://github.com/facebook/react/pull/13968)）
* 修复在进入循环后的报告。（[@calebmer](https://github.com/calebmer) and [@Yurickh](https://github.com/Yurickh) in [#14661](https://github.com/facebook/react/pull/14661)）
* 不要认为抛出异常是违反规范的行为。（[@sophiebits](https://github.com/sophiebits) in [#14040](https://github.com/facebook/react/pull/14040)）

## 在 Alpha 版本后的 Hook 的更新日志 {/*hooks-changelog-since-alpha-versions*/}

上面的更新日志包括所有自上一个**稳定**版本（16.7.0）后的显著的更改。[和我们每次的小版本改动一样](/docs/faq-versioning.html)，所有的更改都没有打破向后兼容。

如果你正在使用基于 alpha Hook 的 React 版本，请注意这次发版的确包括一些小的 Hook 更改。**我们不建议在生产环境代码中使用 alpha 版本**。我们发布它们是为了在 API 稳定之前在社区反馈的基础上做一些更改。

这里是在 alpha 版本对 Hook 做的所有显著更改：

* 删除 `useMutationEffect`。（[@sophiebits](https://github.com/sophiebits) in [#14336](https://github.com/facebook/react/pull/14336)）
* 将 `useImperativeMethods` 重命名为 `useImperativeHandle`。（[@threepointone](https://github.com/threepointone) in [#14565](https://github.com/facebook/react/pull/14565)）
* 优化 `useState` 和 `useReducer` 在同等值下的渲染Hook。（[@acdlite](https://github.com/acdlite) in [#14569](https://github.com/facebook/react/pull/14569)）
* 不要比较传给 `useEffect`/`useMemo`/`useCallback` Hook 的第一个参数。（[@acdlite](https://github.com/acdlite) in [#14594](https://github.com/facebook/react/pull/14594)）
* 使用 `Object.is` 算法来比较 `useState` 和 `useReducer` 的值。（[@Jessidhia](https://github.com/Jessidhia) in [#14752](https://github.com/facebook/react/pull/14752)）
* 严格模式（只有在开发的时候）渲染使用 Hook 的组件两次使其和 class 的表现一样。（[@gaearon](https://github.com/gaearon) in [#14654](https://github.com/facebook/react/pull/14654)）
* 改善 `useReducer` Hook 懒初始化 API。（[@acdlite](https://github.com/acdlite) in [#14723](https://github.com/facebook/react/pull/14723)）
