---
title: ReactDOM API
layout: API
translators:
  - liu-jin-yi
---

<Intro>

ReactDOM package 能够让你在页面上渲染 React 组件。

</Intro>

通常情况下，你会在你的应用程序的顶层使用 ReactDOM 来渲染你的组件。你要么直接使用它，要么交由 [框架](/learn/start-a-new-react-project#building-with-react-and-a-framework) 为你渲染。你的大部分组件应该 *不* 需要导入这个模块。

## 安装

<PackageImport>

<TerminalBlock>

npm install react-dom

</TerminalBlock>

```js
// 如何引入一个特定的 API ：
import { render } from 'react-dom';

// 如何将所有的 API 一起引入：
import * as ReactDOM from 'react';
```

</PackageImport>

你还需要安装相同版本的 [React](/api/)。

## 浏览器支持

ReactDOM 支持所有流行的浏览器，包括 Internet Explorer 9 及以上。对于 IE 9 和 IE 10 等旧浏览器 [需要一些 polyfills](http://todo%20link%20to%20js%20environment%20requirements/) 。

## 导出

<YouWillLearnCard title="render" path="/reference/render">

可以将一段 JSX （"React 元素"）渲染到浏览器 DOM 容器中。

</YouWillLearnCard>

本节内容不完整，仍在撰写中！
