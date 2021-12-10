---
title: 'React v16.7：不包含 Hook 的版本'
author: [acdlite]
---

我们最新的发布版本包括了一个关于 `React.lazy` 的重要性能问题修复。尽管发布里不包括 API 的更改，我们还是以次要版本而不是修订版本的形式发布了。

## 这个问题修复为什么是次要版本而不是修订版本？ {/*why-is-this-bugfix-a-minor-instead-of-a-patch*/}

React 遵循 [语义化版本](/docs/faq-versioning)的原则。一般来说这意味着问题修复会发布成修订版，而新功能（不兼容的改动）会发布成次要版本。不过即使没有新功能，我们仍保留发布次要版的权力。这么做的目的是要确保修订版里的更动有着最小的破坏性影响。修订版是发布版本里最重要的一个版本，因为它时常包括了紧急问题的修复。所以修订版对可靠性的要求更高。而修订版带来更多的问题是不能被接受的。因为当大家开始不信任修订版时，我们即时解决紧急问题的能力也被影响了 — 比如说解决安全漏洞。

我们从不会蓄意提交有问题的发布。React 稳定的声誉来之不易，我们也打算继续维持。在发布前我们都会仔细测试每个新的版本。这包括了单元测试, 生成 (fuzzy) 测试, 集成测试, 以及内部 dogfooding 几万个组件。但是，我们也是会出错的。这就是为什么从现在开始，我们的政策就是如果新的发布包含了非无足轻重的改动，我们将递增次版本号, 即使外在行为不变。当更改有 `unstable_` 前缀的 API 过后我们也会递增次版本号。

## 我可以使用 Hook 了吗? {/*can-i-use-hooks-yet*/}

暂时还不行, 不过很快了!

在 React Conf 上， 我们宣布了 16.7 的发行将包括 Hook。这是个失误。我们不应该把还没有发行的功能连上具体的版本号。我们以后会避免犯同样的错误。

尽管 16.7 还不包括 Hook, 请不要胡乱揣测 Hook 的发布时间表。发布 Hook 的计划不变:

- [Hook 提案](https://github.com/reactjs/rfcs/pull/68)被接受了([附加了根据反馈讯息的次要改动](https://github.com/reactjs/rfcs/pull/68#issuecomment-439314884)).
- [执行](https://github.com/facebook/react/commit/7bee9fbdd49aa5b9365a94b0ddf6db04bc1bf51c) 被合并进了 React repo (隐藏在功能切换后)。
- 我们现在正在测试阶段，敬请期待几个月后的发布。

我们听到了很多人想要开始在应用里使用 Hook。我们也迫不及待的想要发表！但是因为 Hook 会改变大家写组件的方式，我们决定多花些时间处理细节。对大家耐心等待这个激动人心的新功能的推广运用,我们深表感激。

想了解更多 [我们的规划](/blog/2018/11/27/react-16-roadmap) 参考上篇博文。

## 安装 {/*installation*/}

React v16.7.0 已经在 npm 上发布。

使用 Yarn 来安装 React 16，执行：

```bash
yarn add react@^16.7.0 react-dom@^16.7.0
```

使用 npm 来安装 React 16，执行：

```bash
npm install --save react@^16.7.0 react-dom@^16.7.0
```

我们同时通过 CDN 的链接提供 UMD 打包的 React：

```html
<script
  crossorigin
  src="https://unpkg.com/react@16/umd/react.production.min.js"
></script>
<script
  crossorigin
  src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"
></script>
```

请参考文档的[详细安装指南](/docs/installation).

## 更新日志 {/*changelog*/}

### React DOM {/*react-dom*/}

- 修复当有大数量 lazily-loaded 组件时， `React.lazy` 的性能问题。([@acdlite](http://github.com/acdlite) 在 [#14429](https://github.com/facebook/react/pull/14429))
- 清除 unmount 时的 fields 来防止内存泄漏。([@trueadm](http://github.com/trueadm) 在 [#14276](https://github.com/facebook/react/pull/14276))
- 修复当共用 `react-dom/server@16.6` 和 `react@<16.6` 时 SSR 和 context 的问题。 ([@gaearon](http://github.com/gaearon) 在 [#14291](https://github.com/facebook/react/pull/14291))
- 修复一个 profiling mode 的性能回退。 ([@bvaughn](http://github.com/bvaughn) 在 [#14383](https://github.com/facebook/react/pull/14383))

### 调度器 (试验阶段) {/*scheduler-experimental*/}

- 提交到 MessageChannel 来代替 window。([@acdlite](http://github.com/acdlite) 提交在 [#14234](https://github.com/facebook/react/pull/14234))
- 减少序列化的成本。([@developit](http://github.com/developit) 提交在 [#14249](https://github.com/facebook/react/pull/14249))
- 修复测试环境里 `setTimeout` 的降级。([@bvaughn](http://github.com/bvaughn) 提交在 [#14358](https://github.com/facebook/react/pull/14358))
- 添加调试方法。([@mrkev](http://github.com/mrkev) 提交在 [#14053](https://github.com/facebook/react/pull/14053))
