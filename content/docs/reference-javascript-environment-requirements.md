---
id: javascript-environment-requirements
title: JavaScript 环境要求
layout: docs
category: Reference
permalink: docs/javascript-environment-requirements.html
---

React 16 依赖集合类型 [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) 和 [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) 。如果你要支持无法原生提供这些能力（例如 IE < 11）或实现不规范（例如 IE 11）的旧浏览器与设备，考虑在你的应用库中包含一个全局的 polyfill ，例如 [core-js](https://github.com/zloirock/core-js) 或 [babel-polyfill](https://babeljs.io/docs/usage/polyfill/) 。

React 16 使用 core-js 支持老版本浏览器，其 polyfill 环境可能如下：

```js
import 'core-js/es/map';
import 'core-js/es/set';

import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById('root')
);
```

React 同时还依赖于 `requestAnimationFrame`（甚至包括测试环境）。
你可以使用 [raf](https://www.npmjs.com/package/raf) 的 package 增添 `requestAnimationFrame` 的 shim：

```js
import 'raf/polyfill';
```
