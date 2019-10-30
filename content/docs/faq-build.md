---
id: faq-build
title: Babel，JSX 及构建过程
permalink: docs/faq-build.html
layout: docs
category: FAQ
---

### 必须在 React 中使用 JSX 吗？ {#do-i-need-to-use-jsx-with-react}

不是必须的！请查阅 [“不使用 JSX”](/docs/react-without-jsx.html) 以了解更多信息。

### 必须在 React 中使用 ES6 (+) 吗？ {#do-i-need-to-use-es6--with-react}

不是必须的！请查阅 [“不使用 ES6”](/docs/react-without-es6.html) 以了解更多信息。

### 怎样才能在 JSX 中编写注释？ {#how-can-i-write-comments-in-jsx}

```jsx
<div>
  {/* 注释写在这里 */}
  Hello, {name}!
</div>
```

```jsx
<div>
  {/* 多行注释 
  也同样有效。 */}
  Hello, {name}! 
</div>
```
