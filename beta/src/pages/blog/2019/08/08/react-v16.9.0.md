---
title: 'React v16.9.0 and the Roadmap Update'
layout: Post
author: [gaearon, bvaughn]
---

Today we are releasing React 16.9. It contains several new features, bugfixes, and new deprecation warnings to help prepare for a future major release.

## New Deprecations {#new-deprecations}

### Renaming Unsafe Lifecycle Methods {#renaming-unsafe-lifecycle-methods}

[Over a year ago](/blog/2018/03/27/update-on-async-rendering), we announced that unsafe lifecycle methods are getting renamed:

- `componentWillMount` → `UNSAFE_componentWillMount`
- `componentWillReceiveProps` → `UNSAFE_componentWillReceiveProps`
- `componentWillUpdate` → `UNSAFE_componentWillUpdate`

**React 16.9 does not contain breaking changes, and the old names continue to work in this release.** But you will now see a warning when using any of the old names:

![Warning: componentWillMount has been renamed, and is not recommended for use.](https://i.imgur.com/sngxSML.png)

As the warning suggests, there are usually [better approaches](/blog/2018/03/27/update-on-async-rendering#migrating-from-legacy-lifecycles) for each of the unsafe methods. However, maybe you don't have the time to migrate or test these components. In that case, we recommend running a ["codemod"](https://medium.com/@cpojer/effective-javascript-codemods-5a6686bb46fb) script that renames them automatically:

```bash
cd your_project
npx react-codemod rename-unsafe-lifecycles
```

_(Note that it says `npx`, not `npm`. `npx` is a utility that comes with Node 6+ by default.)_

Running this codemod will replace the old names like `componentWillMount` with the new names like `UNSAFE_componentWillMount`:

![Codemod in action](https://i.imgur.com/Heyvcyi.gif)

The new names like `UNSAFE_componentWillMount` **will keep working in both React 16.9 and in React 17.x**. However, the new `UNSAFE_` prefix will help components with problematic patterns stand out during the code review and debugging sessions. (If you'd like, you can further discourage their use inside your app with the opt-in [Strict Mode](/docs/strict-mode).)

> Note
>
> Learn more about our [versioning policy and commitment to stability](/docs/faq-versioning#commitment-to-stability).

### Deprecating `javascript:` URLs {#deprecating-javascript-urls}

URLs starting with `javascript:` are a dangerous attack surface because it's easy to accidentally include unsanitized output in a tag like `<a href>` and create a security hole:

```js
const userProfile = {
  website: "javascript: alert('you got hacked')",
};
// This will now warn:
<a href={userProfile.website}>Profile</a>;
```

**In React 16.9,** this pattern continues to work, but it will log a warning. If you use `javascript:` URLs for logic, try to use React event handlers instead. (As a last resort, you can circumvent the protection with [`dangerouslySetInnerHTML`](/docs/dom-elements#dangerouslysetinnerhtml), but it is highly discouraged and often leads to security holes.)

**In a future major release,** React will throw an error if it encounters a `javascript:` URL.

### Deprecating "Factory" Components {#deprecating-factory-components}

Before compiling JavaScript classes with Babel became popular, React had support for a "factory" component that returns an object with a `render` method:

```js
function FactoryComponent() {
  return {
    render() {
      return <div />;
    },
  };
}
```

This pattern is confusing because it looks too much like a function component — but it isn't one. (A function component would just return the `<div />` in the above example.)

This pattern was almost never used in the wild, and supporting it causes React to be slightly larger and slower than necessary. So we are deprecating this pattern in 16.9 and logging a warning if it's encountered. If you rely on it, adding `FactoryComponent.prototype = React.Component.prototype` can serve as a workaround. Alternatively, you can convert it to either a class or a function component.

We don't expect most codebases to be affected by this.

## New Features {#new-features}

### Async [`act()`](/docs/test-utils#act) for Testing {#async-act-for-testing}

[React 16.8](/blog/2019/02/06/react-v16.8.0) introduced a new testing utility called [`act()`](/docs/test-utils#act) to help you write tests that better match the browser behavior. For example, multiple state updates inside a single `act()` get batched. This matches how React already works when handling real browser events, and helps prepare your components for the future in which React will batch updates more often.

However, in 16.8 `act()` only supported synchronous functions. Sometimes, you might have seen a warning like this in a test but [could not easily fix it](https://github.com/facebook/react/issues/14769):

```
An update to SomeComponent inside a test was not wrapped in act(...).
```

**In React 16.9, `act()` also accepts asynchronous functions,** and you can `await` its call:

```js
await act(async () => {
  // ...
});
```

This solves the remaining cases where you couldn't use `act()` before, such as when the state update was inside an asynchronous function. As a result, **you should be able to fix all the remaining `act()` warnings in your tests now.**

We've heard there wasn't enough information about how to write tests with `act()`. The new [Testing Recipes](/docs/testing-recipes) guide describes common scenarios, and how `act()` can help you write good tests. These examples use vanilla DOM APIs, but you can also use [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) to reduce the boilerplate code. Many of its methods already use `act()` internally.

Please let us know [on the issue tracker](https://github.com/facebook/react/issues) if you bump into any other scenarios where `act()` doesn't work well for you, and we'll try to help.

### Performance Measurements with [`<React.Profiler>`](/docs/profiler) {#performance-measurements-with-reactprofiler}

In React 16.5, we introduced a new [React Profiler for DevTools](/blog/2018/09/10/introducing-the-react-profiler) that helps find performance bottlenecks in your application. **In React 16.9, we are also adding a _programmatic_ way to gather measurements** called `<React.Profiler>`. We expect that most smaller apps won't use it, but it can be handy to track performance regressions over time in larger apps.

The `<Profiler>` measures how often a React application renders and what the "cost" of rendering is. Its purpose is to help identify parts of an application that are slow and may benefit from [optimizations such as memoization](/docs/hooks-faq#how-to-memoize-calculations).

A `<Profiler>` can be added anywhere in a React tree to measure the cost of rendering that part of the tree.
It requires two props: an `id` (string) and an [`onRender` callback](/docs/profiler#onrender-callback) (function) which React calls any time a component within the tree "commits" an update.

```js {2,7}
render(
  <Profiler id="application" onRender={onRenderCallback}>
    <App>
      <Navigation {...props} />
      <Main {...props} />
    </App>
  </Profiler>
);
```

To learn more about the `Profiler` and the parameters passed to the `onRender` callback, check out [the `Profiler` docs](/docs/profiler).

> Note:
>
> Profiling adds some additional overhead, so **it is disabled in [the production build](https://reactjs.org/docs/optimizing-performance#use-the-production-build)**.
>
> To opt into production profiling, React provides a special production build with profiling enabled.
> Read more about how to use this build at [fb.me/react-profiling](https://fb.me/react-profiling).

## Notable Bugfixes {#notable-bugfixes}

This release contains a few other notable improvements:

- A crash when calling `findDOMNode()` inside a `<Suspense>` tree [has been fixed](https://github.com/facebook/react/pull/15312).

- A memory leak caused by retaining deleted subtrees [has been fixed](https://github.com/facebook/react/pull/16115) too.

- An infinite loop caused by `setState` in `useEffect` now [logs an error](https://github.com/facebook/react/pull/15180). (This is similar to the error you see when you call `setState` in `componentDidUpdate` in a class.)

We're thankful to all the contributors who helped surface and fix these and other issues. You can find the full changelog [below](#changelog).

## An Update to the Roadmap {#an-update-to-the-roadmap}

In [November 2018](/blog/2018/11/27/react-16-roadmap), we have posted this roadmap for the 16.x releases:

- A minor 16.x release with React Hooks (past estimate: Q1 2019)
- A minor 16.x release with Concurrent Mode (past estimate: Q2 2019)
- A minor 16.x release with Suspense for Data Fetching (past estimate: mid 2019)

These estimates were too optimistic, and we've needed to adjust them.

**tldr:** We shipped Hooks on time, but we're regrouping Concurrent Mode and Suspense for Data Fetching into a single release that we intend to release later this year.

In February, we [shipped a stable 16.8 release](/blog/2019/02/06/react-v16.8.0) including React Hooks, with React Native support coming [a month later](https://reactnative.dev/blog/2019/03/12/releasing-react-native-059). However, we underestimated the follow-up work for this release, including the lint rules, developer tools, examples, and more documentation. This shifted the timeline by a few months.

Now that React Hooks are rolled out, the work on Concurrent Mode and Suspense for Data Fetching is in full swing. The [new Facebook website that's currently in active development](https://twitter.com/facebook/status/1123322299418124289) is built on top of these features. Testing them with real code helped discover and address many issues before they can affect the open source users. Some of these fixes involved an internal redesign of these features, which has also caused the timeline to slip.

With this new understanding, here's what we plan to do next.

### One Release Instead of Two {#one-release-instead-of-two}

Concurrent Mode and Suspense [power the new Facebook website](https://developers.facebook.com/videos/2019/building-the-new-facebookcom-with-react-graphql-and-relay/) that's in active development, so we are confident that they're close to a stable state technically. We also now better understand the concrete steps before they are ready for open source adoption.

Originally we thought we would split Concurrent Mode and Suspense for Data Fetching into two releases. We've found that this sequencing is confusing to explain because these features are more related than we thought at first. So we plan to release support for both Concurrent Mode and Suspense for Data Fetching in a single combined release instead.

We don't want to overpromise the release date again. Given that we rely on both of them in production code, we expect to provide a 16.x release with opt-in support for them this year.

### An Update on Data Fetching {#an-update-on-data-fetching}

While React is not opinionated about how you fetch data, the first release of Suspense for Data Fetching will likely focus on integrating with _opinionated data fetching libraries_. For example, at Facebook we are using upcoming Relay APIs that integrate with Suspense. We will document how other opinionated libraries like Apollo can support a similar integration.

In the first release, we _don't_ intend to focus on the ad-hoc "fire an HTTP request" solution we used in earlier demos (also known as "React Cache"). However, we expect that both we and the React community will be exploring that space in the months after the initial release.

### An Update on Server Rendering {#an-update-on-server-rendering}

We have started the work on the [new Suspense-capable server renderer](/blog/2018/11/27/react-16-roadmap#suspense-for-server-rendering), but we _don't_ expect it to be ready for the initial release of Concurrent Mode. This release will, however, provide a temporary solution that lets the existing server renderer emit HTML for Suspense fallbacks immediately, and then render their real content on the client. This is the solution we are currently using at Facebook ourselves until the streaming renderer is ready.

### Why Is It Taking So Long? {#why-is-it-taking-so-long}

We've shipped the individual pieces leading up to Concurrent Mode as they became stable, including [new context API](/blog/2018/03/29/react-v-16-3), [lazy loading with Suspense](/blog/2018/10/23/react-v-16-6), and [Hooks](/blog/2019/02/06/react-v16.8.0). We are also eager to release the other missing parts, but [trying them at scale](/docs/design-principles#dogfooding) is an important part of the process. The honest answer is that it just took more work than we expected when we started. As always, we appreciate your questions and feedback on [Twitter](https://twitter.com/reactjs) and in our [issue tracker](https://github.com/facebook/react/issues).

## Installation {#installation}

### React {#react}

React v16.9.0 is available on the npm registry.

To install React 16 with Yarn, run:

```bash
yarn add react@^16.9.0 react-dom@^16.9.0
```

To install React 16 with npm, run:

```bash
npm install --save react@^16.9.0 react-dom@^16.9.0
```

We also provide UMD builds of React via a CDN:

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

Refer to the documentation for [detailed installation instructions](/docs/installation).

## Changelog {#changelog}

### React {#react}

- Add `<React.Profiler>` API for gathering performance measurements programmatically. ([@bvaughn](https://github.com/bvaughn) in [#15172](https://github.com/facebook/react/pull/15172))
- Remove `unstable_ConcurrentMode` in favor of `unstable_createRoot`. ([@acdlite](https://github.com/acdlite) in [#15532](https://github.com/facebook/react/pull/15532))

### React DOM {#react-dom}

- Deprecate old names for the `UNSAFE_*` lifecycle methods. ([@bvaughn](https://github.com/bvaughn) in [#15186](https://github.com/facebook/react/pull/15186) and [@threepointone](https://github.com/threepointone) in [#16103](https://github.com/facebook/react/pull/16103))
- Deprecate `javascript:` URLs as a common attack surface. ([@sebmarkbage](https://github.com/sebmarkbage) in [#15047](https://github.com/facebook/react/pull/15047))
- Deprecate uncommon "module pattern" (factory) components. ([@sebmarkbage](https://github.com/sebmarkbage) in [#15145](https://github.com/facebook/react/pull/15145))
- Add support for the `disablePictureInPicture` attribute on `<video>`. ([@eek](https://github.com/eek) in [#15334](https://github.com/facebook/react/pull/15334))
- Add support for `onLoad` event for `<embed>`. ([@cherniavskii](https://github.com/cherniavskii) in [#15614](https://github.com/facebook/react/pull/15614))
- Add support for editing `useState` state from DevTools. ([@bvaughn](https://github.com/bvaughn) in [#14906](https://github.com/facebook/react/pull/14906))
- Add support for toggling Suspense from DevTools. ([@gaearon](https://github.com/gaearon) in [#15232](https://github.com/facebook/react/pull/15232))
- Warn when `setState` is called from `useEffect`, creating a loop. ([@gaearon](https://github.com/gaearon) in [#15180](https://github.com/facebook/react/pull/15180))
- Fix a memory leak. ([@paulshen](https://github.com/paulshen) in [#16115](https://github.com/facebook/react/pull/16115))
- Fix a crash inside `findDOMNode` for components wrapped in `<Suspense>`. ([@acdlite](https://github.com/acdlite) in [#15312](https://github.com/facebook/react/pull/15312))
- Fix pending effects from being flushed too late. ([@acdlite](https://github.com/acdlite) in [#15650](https://github.com/facebook/react/pull/15650))
- Fix incorrect argument order in a warning message. ([@brickspert](https://github.com/brickspert) in [#15345](https://github.com/facebook/react/pull/15345))
- Fix hiding Suspense fallback nodes when there is an `!important` style. ([@acdlite](https://github.com/acdlite) in [#15861](https://github.com/facebook/react/pull/15861) and [#15882](https://github.com/facebook/react/pull/15882))
- Slightly improve hydration performance. ([@bmeurer](https://github.com/bmeurer) in [#15998](https://github.com/facebook/react/pull/15998))

### React DOM Server {#react-dom-server}

- Fix incorrect output for camelCase custom CSS property names. ([@bedakb](https://github.com/bedakb) in [#16167](https://github.com/facebook/react/pull/16167))

### React Test Utilities and Test Renderer {#react-test-utilities-and-test-renderer}

- Add `act(async () => ...)` for testing asynchronous state updates. ([@threepointone](https://github.com/threepointone) in [#14853](https://github.com/facebook/react/pull/14853))
- Add support for nesting `act` from different renderers. ([@threepointone](https://github.com/threepointone) in [#16039](https://github.com/facebook/react/pull/16039) and [#16042](https://github.com/facebook/react/pull/16042))
- Warn in Strict Mode if effects are scheduled outside an `act()` call. ([@threepointone](https://github.com/threepointone) in [#15763](https://github.com/facebook/react/pull/15763) and [#16041](https://github.com/facebook/react/pull/16041))
- Warn when using `act` from the wrong renderer. ([@threepointone](https://github.com/threepointone) in [#15756](https://github.com/facebook/react/pull/15756))
