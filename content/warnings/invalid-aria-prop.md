---
title: 警告：非法的 ARIA Prop
layout: single
permalink: warnings/invalid-aria-prop.html
---

当你试图渲染一个 DOM 元素，并且它的 aria-* 属性不存在于 WAI-ARIA [规范](https://www.w3.org/TR/wai-aria-1.1/#states_and_properties) 中时，会出现 invalid-aria-prop 警告。

（WAI：Web Accessibility Initiative，Web 无障碍计划）  
（ARIA：Accessible Rich Internet Application，无障碍丰富互联网应用程序）

1. 如果你认为你使用的是合法的属性，仔细检查拼写。`aria-labelledby` 和 `aria-activedescendant` 常常会被拼错。

2. React 还无法识别你指定的属性。这可能会在 React 的未来版本中被修复。但是，React 目前会去除所有未知属性，因此即使在 React 应用中指定这些属性也无法使它们渲染。
