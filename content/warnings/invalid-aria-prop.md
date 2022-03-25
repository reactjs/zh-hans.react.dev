---
title: 警告：非法的 ARIA Prop
layout: single
permalink: warnings/invalid-aria-prop.html
---

当你试图渲染一个 DOM 元素，并且它的 aria-* 属性不存在于 WAI<sup><a href="#note1">[1]</a></sup>-ARIA<sup><a href="#note2">[2]</a></sup> [规范](https://www.w3.org/TR/wai-aria-1.1/#states_and_properties)中时，会出现 invalid-aria-prop 警告。

1. 如果你认为你使用的是合法的属性，仔细检查拼写。`aria-labelledby` 和 `aria-activedescendant` 常常会被拼错。

<<<<<<< HEAD
2. React 还无法识别你指定的属性。这可能会在 React 的未来版本中被修复。但是，React 目前会去除所有未知属性，因此即使在 React 应用中指定这些属性也无法使它们渲染。

**译注：**
 
<a name="note1"></a> [1] WAI：Web Accessibility Initiative，Web 无障碍计划<br>
<a name="note2"></a> [2] ARIA：Accessible Rich Internet Application，无障碍丰富互联网应用程序
=======
2. React does not yet recognize the attribute you specified. This will likely be fixed in a future version of React.
>>>>>>> 9b5505e2651edef0fc2709ee8ae18382eaf008f4
