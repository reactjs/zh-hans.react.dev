---
title: 无效 ARIA 属性警告
---

如果你尝试渲染一个在 WAI 与 ARIA [规范](https://www.w3.org/TR/wai-aria-1.1/#states_and_properties) 中不存在的 `aria-*` 属性，就会触发此警告。

1. 如果你认为你使用了有效的属性，请仔细检查拼写。`aria-labelledby` 与 `aria-activedescendant` 经常出现拼写错误。

2. 如果你使用了 `aria-role`，请试试 `role`。

<<<<<<< HEAD
3. 否则，如果你使用的是 React DOM 的最新版本，并且已经验证了你使用的是 ARIA 规范中列出的有效属性名称，请在这里 [报告错误](https://github.com/facebook/react/issues/new/choose)。
=======
3. Otherwise, if you're on the latest version of React DOM and verified that you're using a valid property name listed in the ARIA specification, please [report a bug](https://github.com/react/react/issues/new/choose).
>>>>>>> f3d9794fc31f4a3faf7e863984d37f4ae86b3290
