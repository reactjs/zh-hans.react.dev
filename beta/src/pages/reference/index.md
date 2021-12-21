---
title: React APIs
layout: API
translators:
  - liu-jin-yi
---

<Intro>

React 包中包含了定义和使用 [components](/learn/your-first-component) 所需的所有 API 。

</Intro>

## 安装

它在 npm 上的名字叫做 [`react`](https://www.npmjs.com/package/react) 。 你也可以 [将 React 作为 `<script>` 标签添加到页面中](/learn/add-react-to-a-website) 。

<PackageImport>

<TerminalBlock>

npm install react

</TerminalBlock>

```js
// 如何引入一个特定的 API ：
import { useState } from 'react';

// 如何将所有的 API 一起引入：
import * as React from 'react';
```

</PackageImport>

如果你想使用 React ，那么你也需要安装相同版本的 [ReactDOM](/api/reactdom) 。

## 导出

<YouWillLearnCard title="useState" path="/reference/usestate">

一个让组件“记住”某些信息（称为 state）的 React Hook 。

</YouWillLearnCard>

本节内容不完整，仍在撰写中！