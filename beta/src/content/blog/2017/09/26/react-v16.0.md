---
title: 'React v16.0'
author: [acdlite]
---

We're excited to announce the release of React v16.0! Among the changes are some long-standing feature requests, including [**fragments**](#new-render-return-types-fragments-and-strings), [**error boundaries**](#better-error-handling), [**portals**](#portals), support for [**custom DOM attributes**](#support-for-custom-dom-attributes), improved [**server-side rendering**](#better-server-side-rendering), and [**reduced file size**](#reduced-file-size).

### New render return types: fragments and strings {/*new-render-return-types-fragments-and-strings*/}

You can now return an array of elements from a component's `render` method. Like with other arrays, you'll need to add a key to each element to avoid the key warning:

```js
render() {
  // No need to wrap list items in an extra element!
  return [
    // Don't forget the keys :)
    <li key="A">First item</li>,
    <li key="B">Second item</li>,
    <li key="C">Third item</li>,
  ];
}
```

[Starting with React 16.2.0](/blog/2017/11/28/react-v16.2.0-fragment-support), we are adding support for a special fragment syntax to JSX that doesn't require keys.

We've added support for returning strings, too:

```js
render() {
  return 'Look ma, no spans!';
}
```

[See the full list of supported return types](/docs/react-component#render).

### Better error handling {/*better-error-handling*/}

Previously, runtime errors during rendering could put React in a broken state, producing cryptic error messages and requiring a page refresh to recover. To address this problem, React 16 uses a more resilient error-handling strategy. By default, if an error is thrown inside a component's render or lifecycle methods, the whole component tree is unmounted from the root. This prevents the display of corrupted data. However, it's probably not the ideal user experience.

Instead of unmounting the whole app every time there's an error, you can use error boundaries. Error boundaries are special components that capture errors inside their subtree and display a fallback UI in its place. Think of error boundaries like try-catch statements, but for React components.

For more details, check out our [previous post on error handling in React 16](/blog/2017/07/26/error-handling-in-react-16).

### Portals {/*portals*/}

Portals provide a first-class way to render children into a DOM node that exists outside the DOM hierarchy of the parent component.

```js
render() {
  // React does *not* create a new div. It renders the children into `domNode`.
  // `domNode` is any valid DOM node, regardless of its location in the DOM.
  return ReactDOM.createPortal(
    this.props.children,
    domNode,
  );
}
```

See a full example in the [documentation for portals](/docs/portals).

### Better server-side rendering {/*better-server-side-rendering*/}

React 16 includes a completely rewritten server renderer. It's really fast. It supports **streaming**, so you can start sending bytes to the client faster. And thanks to a [new packaging strategy](#reduced-file-size) that compiles away `process.env` checks (Believe it or not, reading `process.env` in Node is really slow!), you no longer need to bundle React to get good server-rendering performance.

Core team member Sasha Aickin wrote a [great article describing React 16's SSR improvements](https://medium.com/@aickin/whats-new-with-server-side-rendering-in-react-16-9b0d78585d67). According to Sasha's synthetic benchmarks, server rendering in React 16 is roughly **three times faster** than React 15. "When comparing against React 15 with `process.env` compiled out, there’s about a 2.4x improvement in Node 4, about a 3x performance improvement in Node 6, and a full 3.8x improvement in the new Node 8.4 release. And if you compare against React 15 without compilation, React 16 has a full order of magnitude gain in SSR in the latest version of Node!" (As Sasha points out, please be aware that these numbers are based on synthetic benchmarks and may not reflect real-world performance.)

In addition, React 16 is better at hydrating server-rendered HTML once it reaches the client. It no longer requires the initial render to exactly match the result from the server. Instead, it will attempt to reuse as much of the existing DOM as possible. No more checksums! In general, we don't recommend that you render different content on the client versus the server, but it can be useful in some cases (e.g. timestamps). **However, it's dangerous to have missing nodes on the server render as this might cause sibling nodes to be created with incorrect attributes.**

See the [documentation for `ReactDOMServer`](/docs/react-dom-server) for more details.

### Support for custom DOM attributes {/*support-for-custom-dom-attributes*/}

Instead of ignoring unrecognized HTML and SVG attributes, React will now [pass them through to the DOM](/blog/2017/09/08/dom-attributes-in-react-16). This has the added benefit of allowing us to get rid of most of React's attribute whitelist, resulting in reduced file sizes.

### Reduced file size {/*reduced-file-size*/}

Despite all these additions, React 16 is actually **smaller** compared to 15.6.1!

- `react` is 5.3 kb (2.2 kb gzipped), down from 20.7 kb (6.9 kb gzipped).
- `react-dom` is 103.7 kb (32.6 kb gzipped), down from 141 kb (42.9 kb gzipped).
- `react` + `react-dom` is 109 kb (34.8 kb gzipped), down from 161.7 kb (49.8 kb gzipped).

That amounts to a combined **32% size decrease compared to the previous version (30% post-gzip)**.

The size difference is partly attributable to a change in packaging. React now uses [Rollup](https://rollupjs.org/) to create flat bundles for each of its different target formats, resulting in both size and runtime performance wins. The flat bundle format also means that React's impact on bundle size is roughly consistent regardless of how you ship your app, whether it's with Webpack, Browserify, the pre-built UMD bundles, or any other system.

### MIT licensed {/*mit-licensed*/}

[In case you missed it](https://code.facebook.com/posts/300798627056246/relicensing-react-jest-flow-and-immutable-js/), React 16 is available under the MIT license. We've also published React 15.6.2 under MIT, for those who are unable to upgrade immediately.

### New core architecture {/*new-core-architecture*/}

React 16 is the first version of React built on top of a new core architecture, codenamed "Fiber." You can read all about this project over on [Facebook's engineering blog](https://code.facebook.com/posts/1716776591680069/react-16-a-look-inside-an-api-compatible-rewrite-of-our-frontend-ui-library/). (Spoiler: we rewrote React!)

Fiber is responsible for most of the new features in React 16, like error boundaries and fragments. Over the next few releases, you can expect more new features as we begin to unlock the full potential of React.

Perhaps the most exciting area we're working on is **async rendering**—a strategy for cooperatively scheduling rendering work by periodically yielding execution to the browser. The upshot is that, with async rendering, apps are more responsive because React avoids blocking the main thread.

This demo provides an early peek at the types of problems async rendering can solve:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Ever wonder what &quot;async rendering&quot; means? Here&#39;s a demo of how to coordinate an async React tree with non-React work <a href="https://t.co/3snoahB3uV">https://t.co/3snoahB3uV</a> <a href="https://t.co/egQ988gBjR">pic.twitter.com/egQ988gBjR</a></p>&mdash; Andrew Clark (@acdlite) <a href="https://twitter.com/acdlite/status/909926793536094209">September 18, 2017</a></blockquote>

_Tip: Pay attention to the spinning black square._

We think async rendering is a big deal, and represents the future of React. To make migration to v16.0 as smooth as possible, we're not enabling any async features yet, but we're excited to start rolling them out in the coming months. Stay tuned!

## Installation {/*installation*/}

React v16.0.0 is available on the npm registry.

To install React 16 with Yarn, run:

```bash
yarn add react@^16.0.0 react-dom@^16.0.0
```

To install React 16 with npm, run:

```bash
npm install --save react@^16.0.0 react-dom@^16.0.0
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

## Upgrading {/*upgrading*/}

Although React 16 includes significant internal changes, in terms of upgrading, you can think of this like any other major React release. We've been serving React 16 to Facebook and Messenger.com users since earlier this year, and we released several beta and release candidate versions to flush out additional issues. With minor exceptions, **if your app runs in 15.6 without any warnings, it should work in 16.**

For deprecations listed in [packaging](#packaging) below, codemods are provided to automatically transform your deprecated code.
See the [15.5.0](/blog/2017/04/07/react-v15.5.0) blog post for more information, or browse the codemods in the [react-codemod](https://github.com/reactjs/react-codemod) project.

### New deprecations {/*new-deprecations*/}

Hydrating a server-rendered container now has an explicit API. If you're reviving server-rendered HTML, use [`ReactDOM.hydrate`](/docs/react-dom#hydrate) instead of `ReactDOM.render`. Keep using `ReactDOM.render` if you're just doing client-side rendering.

### React Addons {/*react-addons*/}

As previously announced, we've [discontinued support for React Addons](/blog/2017/04/07/react-v15.5.0#discontinuing-support-for-react-addons). We expect the latest version of each addon (except `react-addons-perf`; see below) to work for the foreseeable future, but we won't publish additional updates.

Refer to the previous announcement for [suggestions on how to migrate](/blog/2017/04/07/react-v15.5.0#discontinuing-support-for-react-addons).

`react-addons-perf` no longer works at all in React 16. It's likely that we'll release a new version of this tool in the future. In the meantime, you can [use your browser's performance tools to profile React components](/docs/optimizing-performance#profiling-components-with-the-chrome-performance-tab).

### Breaking changes {/*breaking-changes*/}

React 16 includes a number of small breaking changes. These only affect uncommon use cases and we don't expect them to break most apps.

- React 15 had limited, undocumented support for error boundaries using `unstable_handleError`. This method has been renamed to `componentDidCatch`. You can use a codemod to [automatically migrate to the new API](https://github.com/reactjs/react-codemod#error-boundaries).
- `ReactDOM.render` and `ReactDOM.unstable_renderSubtreeIntoContainer` now return null if called from inside a lifecycle method. To work around this, you can use [portals](https://github.com/facebook/react/issues/10309#issuecomment-318433235) or [refs](https://github.com/facebook/react/issues/10309#issuecomment-318434635).
- `setState`:
  - Calling `setState` with null no longer triggers an update. This allows you to decide in an updater function if you want to re-render.
  - Calling `setState` directly in render always causes an update. This was not previously the case. Regardless, you should not be calling setState from render.
  - `setState` callbacks (second argument) now fire immediately after `componentDidMount` / `componentDidUpdate` instead of after all components have rendered.
- When replacing `<A />` with `<B />`, `B.componentWillMount` now always happens before `A.componentWillUnmount`. Previously, `A.componentWillUnmount` could fire first in some cases.
- Previously, changing the ref to a component would always detach the ref before that component's render is called. Now, we change the ref later, when applying the changes to the DOM.
- It is not safe to re-render into a container that was modified by something other than React. This worked previously in some cases but was never supported. We now emit a warning in this case. Instead you should clean up your component trees using `ReactDOM.unmountComponentAtNode`. [See this example.](https://github.com/facebook/react/issues/10294#issuecomment-318820987)
- `componentDidUpdate` lifecycle no longer receives `prevContext` param. (See [#8631](https://github.com/facebook/react/issues/8631))
- Shallow renderer no longer calls `componentDidUpdate` because DOM refs are not available. This also makes it consistent with `componentDidMount` (which does not get called in previous versions either).
- Shallow renderer does not implement `unstable_batchedUpdates` anymore.
- `ReactDOM.unstable_batchedUpdates` now only takes one extra argument after the callback.

### Packaging {/*packaging*/}

- There is no `react/lib/*` and `react-dom/lib/*` anymore. Even in CommonJS environments, React and ReactDOM are precompiled to single files (“flat bundles”). If you previously relied on undocumented React internals, and they don’t work anymore, let us know about your specific case in a new issue, and we’ll try to figure out a migration strategy for you.
- There is no `react-with-addons.js` build anymore. All compatible addons are published separately on npm, and have single-file browser versions if you need them.
- The deprecations introduced in 15.x have been removed from the core package. `React.createClass` is now available as `create-react-class`, `React.PropTypes` as `prop-types`, `React.DOM` as `react-dom-factories`, `react-addons-test-utils` as `react-dom/test-utils`, and shallow renderer as `react-test-renderer/shallow`. See [15.5.0](/blog/2017/04/07/react-v15.5.0) and [15.6.0](/blog/2017/06/13/react-v15.6.0) blog posts for instructions on migrating code and automated codemods.
- The names and paths to the single-file browser builds have changed to emphasize the difference between development and production builds. For example:
  - `react/dist/react.js` → `react/umd/react.development.js`
  - `react/dist/react.min.js` → `react/umd/react.production.min.js`
  - `react-dom/dist/react-dom.js` → `react-dom/umd/react-dom.development.js`
  - `react-dom/dist/react-dom.min`.js → `react-dom/umd/react-dom.production.min.js`

## JavaScript Environment Requirements {/*javascript-environment-requirements*/}

React 16 depends on the collection types [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) and [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set). If you support older browsers and devices which may not yet provide these natively (e.g. IE < 11), consider including a global polyfill in your bundled application, such as [core-js](https://github.com/zloirock/core-js) or [babel-polyfill](https://babeljs.io/docs/usage/polyfill/).

A polyfilled environment for React 16 using core-js to support older browsers might look like:

```js
import 'core-js/es6/map';
import 'core-js/es6/set';

import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(<h1>Hello, world!</h1>, document.getElementById('root'));
```

React also depends on `requestAnimationFrame` (even in test environments).  
You can use the [raf](https://www.npmjs.com/package/raf) package to shim `requestAnimationFrame`:

```js
import 'raf/polyfill';
```

## Acknowledgments {/*acknowledgments*/}

As always, this release would not have been possible without our open source contributors. Thanks to everyone who filed bugs, opened PRs, responded to issues, wrote documentation, and more!

Special thanks to our core contributors, especially for their heroic efforts over the past few weeks during the prerelease cycle: [Brandon Dail](https://twitter.com/aweary), [Jason Quense](https://twitter.com/monasticpanic), [Nathan Hunzaker](https://twitter.com/natehunzaker), and [Sasha Aickin](https://twitter.com/xander76).
