---
id: testing-environments
title: 测试环境
permalink: docs/testing-environments.html
prev: testing-recipes.html
---

<!-- 本文档适用于那些熟悉 JavaScript 并且可能已经使用它编写过测试的人。它可以作为 React 组件测试环境差异的参考，以及这些差异会如何影响他们编写的测试。本文档倾向基于 Web 的 react-dom 组件的测试，但也有基于其他渲染器测试的注释。 -->

本章节介绍了可能会影响你测试环境的因素，并包含某些场景下的建议。

### 测试运行器 {#test-runners}

使用 [Jest](https://jestjs.io/)，[mocha](https://mochajs.org/)，[ava](https://github.com/avajs/ava) 等测试运行器能像编写 JavaScript 一样编写测试套件，并将其作为开发过程的环节运行。此外，测试套件也将作为持续集成的环节运行。

- Jest 与 React 项目广泛兼容，支持诸如模拟 [模块](#mocking-modules)、[计时器](#mocking-timers) 和 [`jsdom`](#mocking-a-rendering-surface) 等特性。**如果你使用 Create React App，[Jest 已经能够开箱即用](https://facebook.github.io/create-react-app/docs/running-tests)且包含许多实用的默认配置。**
- 像 [mocha](https://mochajs.org/#running-mocha-in-the-browser) 这样的库在真实浏览器环境下运行良好，并且可以为明确需要它的测试提供帮助。
- 端对端测试用于测试跨多个页面的长流程，并且需要[不同的设置](#end-to-end-tests-aka-e2e-tests)。

### 模拟渲染表面 {#mocking-a-rendering-surface}

测试通常在无法访问真实渲染表面（如浏览器）的环境中运行。对于这些环境，我们建议使用 [`jsdom`](https://github.com/jsdom/jsdom) 来模拟浏览器，这是一个在 Node.js 内运行的轻量级浏览器实现。

在大多数情况下，jsdom 的行为类似于常规浏览器，但不具备如[布局和导航](https://github.com/jsdom/jsdom#unimplemented-parts-of-the-web-platform)的功能。这对于大多数基于 Web 的组件测试仍然有用，因为它的运行比为每个测试启动浏览器的方式效率更高。并且由于它与你编写的测试运行在同一个进程中，所以你能够编写代码来检查和断言渲染的 DOM。

就像在真实的浏览器中一样，jsdom 让我们模拟用户交互；测试可以在 DOM 节点上派发事件，然后观察并断言这些操作的副作用[<small>(例子)</small>](/docs/testing-recipes.html#events)。

可以使用上述设置编写大部分 UI 测试：使用 Jest 作为测试运行器，渲染到 jsdom，使用 `act()` 辅助函数[<small>(例子)</small>](/docs/testing-recipes.html)提供的能力通过一系列的浏览器事件来模拟用户交互行为。例如，大量 React 自己的测试都是用这种组合编写的。

如果您正在编写一个主要测试浏览器特定行为的库，并且需要布局或真实输入等原生浏览器行为，那么你可以使用像 [mocha](https://mochajs.org/) 这样的框架。

在你 _无法_ 模拟 DOM 环境（例如，在 Node.js 上测试 React Native 组件）的情况下，可以使用 [事件模拟辅助函数](/docs/test-utils.html#simulate) 来模拟与元素的交互。或者，你也可以使用 [`@testing-library/react-native`](https://testing-library.com/docs/react-native-testing-library/intro) 中的 `fireEvent` 辅助函数。

诸如 [Cypress](https://www.cypress.io/)，[puppeteer](https://github.com/GoogleChrome/puppeteer) 和 [webdriver](https://www.seleniumhq.org/projects/webdriver/) 等框架对于运行[端对端测试](#end-to-end-tests-aka-e2e-tests) 都非常有用。

### 模拟功能 {#mocking-functions}

在编写测试的时候，我们希望模拟代码在测试环境较真实环境中缺失的等效部分（例如，在 Node.js 中检查 `navigator.onLine` 的状态）。测试还可以监视某些功能，并观察测试的其他部分如何与它们进行交互。有选择的将这些功能模拟为测试友好的版本是很有用的。

这对于数据获取尤其有用。通常最好使用“假”数据进行测试，以避免从实际 API 端获取数据可能导致的缓慢和不稳定[<small>（例子）</small>](/docs/testing-recipes.html#data-fetching)。这样做有助于让测试变得可预测。像 [Jest](https://jestjs.io/) 与 [sinon](https://sinonjs.org/) 这样的类库，支持模拟功能。对于端对端测试，虽然模拟网络可能更加困难，但你可能还想对真实的 API 端进行测试。

### 模拟模块 {#mocking-modules}

一些组件可能会依赖在测试环境中无法正常运行的模块，或者说这些模块对于我们的测试并不必要。那么，通过选择性地模拟来替换这些模块是很有用的[<small>（例子）</small>](/docs/testing-recipes.html#mocking-modules)。

在 Node.js 中，测试运行器如 Jest [支持模拟模块](https://jestjs.io/docs/en/manual-mocks)。你也可以使用像 [`mock-require`](https://www.npmjs.com/package/mock-require) 这样的类库。

### 模拟计时器 {#mocking-timers}

组件可能会使用基于时间的函数如 `setTimeout`、`setInterval` 和 `Date.now` 等。在测试环境中，使用可以手动“推进”时间的替代物来模拟这些功能会很有帮助。它会确保你的测试快速运行！依赖于计时器的测试仍将按照顺序解析，但会更快[<small>（例子）</small>](/docs/testing-recipes.html#timers)。大部分测试框架，包括 [Jest](https://jestjs.io/docs/en/timer-mocks)、[sinon](https://sinonjs.org/releases/latest/fake-timers/) 和 [lolex](https://github.com/sinonjs/lolex) 都允许你在测试中模拟计时器。

有些时候可能你不想要模拟计时器。例如，在你测试动画时，或是交互端对时间较为敏感的情况下（如 API 访问速率限制器）。具有计时器模拟的库允许你在每个测试/套件上启用或禁用这个功能，因此你可以明确地选择这些测试的运行方式。

### 端对端测试 {#end-to-end-tests-aka-e2e-tests}

端对端测试对于测试更长的工作流程非常有用，特别是当它们对于你的业务（例如付款或注册）特别重要时。对于这些测试，你可能会希望测试真实浏览器如何渲染整个应用、从真实的 API 端获取数据、使用 session 和 cookies 以及在不同的链接间导航等功能。你可能还希望不仅在 DOM 状态上进行断言，而同时也在后端数据上进行校验（例如，验证更新是否已经在数据库中持久化）。

在这种场景下，你可以使用像 [Cypress](https://www.cypress.io/)，[Playwright](https://playwright.dev) 等类似框架或者使用 [Puppeteer](https://github.com/GoogleChrome/puppeteer) 这样的库，这样你就可以在多个路由之间导航切换，并且不仅能够在浏览器中对副作用进行断言也能够在后端这么做。
