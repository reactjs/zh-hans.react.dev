---
id: faq-structure
title: 项目文件结构
permalink: docs/faq-structure.html
layout: docs
category: FAQ
---

### 是否有一种推荐的方式来组织 React 的项目文件结构呢？ {#is-there-a-recommended-way-to-structure-react-projects}

React 对如何将文件放入文件夹中没有意见。也就是说，你可以参考使用生态系统中一些常见的组织项目文件结构的方式。

#### 按功能或路由组织 {#grouping-by-features-or-routes}

组织项目文件结构的一种常见方法是将 CSS、JS 和测试文件一起按照功能或路由进行组织。

```
common/
  Avatar.js
  Avatar.css
  APIUtils.js
  APIUtils.test.js
feed/
  index.js
  Feed.js
  Feed.css
  FeedStory.js
  FeedStory.test.js
  FeedAPI.js
profile/
  index.js
  Profile.js
  ProfileHeader.js
  ProfileHeader.css
  ProfileAPI.js
```

一个“功能”的定义因人而异，你可以自行选择其粒度。如果你想不出如何设计顶层目录，则可以通过向产品用户询问这个产品所包含的主要部分，并将反馈的想法用作设计蓝本。

#### 按文件类型组织 {#grouping-by-file-type}

另一种组织项目文件结构的常用方法是将类似的文件组织在一起，例如：

```
api/
  APIUtils.js
  APIUtils.test.js
  ProfileAPI.js
  UserAPI.js
components/
  Avatar.js
  Avatar.css
  Feed.js
  Feed.css
  FeedStory.js
  FeedStory.test.js
  Profile.js
  ProfileHeader.js
  ProfileHeader.css
```

一些人还喜欢更进一步，他们根据组件在应用程序中的角色将组件文件组织到不同的目录中去。例如，[原子设计](http://bradfrost.com/blog/post/atomic-web-design/)就是一种基于此原理的设计方法。请记住，将这些方法作为有用的示例而非必须严格遵守的规则，通常会更富成效。

#### 避免多层嵌套 {#avoid-too-much-nesting}

JavaScript 项目中的深层目录嵌套会带来许多痛点。在编写相对路径导入，或是在文件移动后更新这些导入将变得更加困难。除非你有非常令人信服的理由来使用深层目录嵌套，否则请考虑将单个项目中的目录嵌套控制在最多三到四个层级内。当然，这只是一个建议，它可能与你的项目无关。

#### 不要过度思考 {#dont-overthink-it}

如果你刚刚开始一个项目，[不要花超过五分钟](https://en.wikipedia.org/wiki/Analysis_paralysis)在选择项目文件组织结构上。选择上述任何方式（或提出自己的方式）并开始编写代码！因为，在你编写了一些真正的代码之后，你将很有可能会重新考虑它。

如果您感觉完全卡住，请先将所有文件保存在同一个文件夹中。它最终会变得足够大，以至于让你想要将其中一些文件拆分出去。到那时，你将有足够的知识去区分你最频繁编辑的文件。通常，将经常一起变化的文件组织在一起是个好主意。这个原则被称为 “colocation”。

随着项目规模的扩大，人们通常会在实践中混搭使用上述这些方式。因此，在开始时选择“正确”的那个方式并不是很重要。
