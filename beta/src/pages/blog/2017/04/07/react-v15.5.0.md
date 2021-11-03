---
title: 'React v15.5.0'
layout: Post
author: [acdlite]
---

It's been exactly one year since the last breaking change to React. Our next major release, React 16, will include some exciting improvements, including a [complete rewrite](https://www.youtube.com/watch?v=ZCuYPiUIONs) of React's internals. [We take stability seriously](/docs/design-principles#stability), and are committed to bringing those improvements to all of our users with minimal effort.

To that end, today we're releasing React 15.5.0.

### New Deprecation Warnings {#new-deprecation-warnings}

The biggest change is that we've extracted `React.PropTypes` and `React.createClass` into their own packages. Both are still accessible via the main `React` object, but using either will log a one-time deprecation warning to the console when in development mode. This will enable future code size optimizations.

These warnings will not affect the behavior of your application. However, we realize they may cause some frustration, particularly if you use a testing framework that treats `console.error` as a failure.

**Adding new warnings is not something we do lightly.** Warnings in React are not mere suggestions — they are integral to our strategy of keeping as many people as possible on the latest version of React. We never add warnings without providing an incremental path forward.

So while the warnings may cause frustration in the short-term, we believe **prodding developers to migrate their codebases now prevents greater frustration in the future**. Proactively fixing warnings ensures you are prepared for the next major release. If your app produces zero warnings in 15.5, it should continue to work in 16 without any changes.

For each of these new deprecations, we've provided a codemod to automatically migrate your code. They are available as part of the [react-codemod](https://github.com/reactjs/react-codemod) project.

### Migrating from React.PropTypes {#migrating-from-reactproptypes}

Prop types are a feature for runtime validation of props during development. We've extracted the built-in prop types to a separate package to reflect the fact that not everybody uses them.

In 15.5, instead of accessing `PropTypes` from the main `React` object, install the `prop-types` package and import them from there:

```js {11,16,25}
// Before (15.4 and below)
import React from 'react';

class Component extends React.Component {
  render() {
    return <div>{this.props.text}</div>;
  }
}

Component.propTypes = {
  text: React.PropTypes.string.isRequired,
};

// After (15.5)
import React from 'react';
import PropTypes from 'prop-types';

class Component extends React.Component {
  render() {
    return <div>{this.props.text}</div>;
  }
}

Component.propTypes = {
  text: PropTypes.string.isRequired,
};
```

The [codemod](https://github.com/reactjs/react-codemod#react-proptypes-to-prop-types) for this change performs this conversion automatically. Basic usage:

```bash
jscodeshift -t react-codemod/transforms/React-PropTypes-to-prop-types.js <path>
```

The `propTypes`, `contextTypes`, and `childContextTypes` APIs will work exactly as before. The only change is that the built-in validators now live in a separate package.

You may also consider using [Flow](https://flow.org/) to statically type check your JavaScript code, including [React components](https://flow.org/en/docs/react/components/).

### Migrating from React.createClass {#migrating-from-reactcreateclass}

When React was initially released, there was no idiomatic way to create classes in JavaScript, so we provided our own: `React.createClass`.

Later, classes were added to the language as part of ES2015, so we added the ability to create React components using JavaScript classes. **Along with function components, JavaScript classes are now the [preferred way to create components in React](/docs/components-and-props#functional-and-class-components).**

For your existing `createClass` components, we recommend that you migrate them to JavaScript classes. However, if you have components that rely on mixins, converting to classes may not be immediately feasible. If so, `create-react-class` is available on npm as a drop-in replacement:

```js {4,13,15}
// Before (15.4 and below)
var React = require('react');

var Component = React.createClass({
  mixins: [MixinA],
  render() {
    return <Child />;
  },
});

// After (15.5)
var React = require('react');
var createReactClass = require('create-react-class');

var Component = createReactClass({
  mixins: [MixinA],
  render() {
    return <Child />;
  },
});
```

Your components will continue to work the same as they did before.

The [codemod](https://github.com/reactjs/react-codemod#explanation-of-the-new-es2015-class-transform-with-property-initializers) for this change attempts to convert a `createClass` component to a JavaScript class, with a fallback to `create-react-class` if necessary. It has converted thousands of components internally at Facebook.

Basic usage:

```bash
jscodeshift -t react-codemod/transforms/class.js path/to/components
```

### Discontinuing support for React Addons {#discontinuing-support-for-react-addons}

We're discontinuing active maintenance of React Addons packages. In truth, most of these packages haven't been actively maintained in a long time. They will continue to work indefinitely, but we recommend migrating away as soon as you can to prevent future breakages.

- **react-addons-create-fragment** – React 16 will have first-class support for fragments, at which point this package won't be necessary. We recommend using arrays of keyed elements instead.
- **react-addons-css-transition-group** - Use [react-transition-group/CSSTransitionGroup](https://github.com/reactjs/react-transition-group) instead. Version 1.1.1 provides a drop-in replacement.
- **react-addons-linked-state-mixin** - Explicitly set the `value` and `onChange` handler instead.
- **react-addons-pure-render-mixin** - Use [`React.PureComponent`](/docs/react-api#reactpurecomponent) instead.
- **react-addons-shallow-compare** - Use [`React.PureComponent`](/docs/react-api#reactpurecomponent) instead.
- **react-addons-transition-group** - Use [react-transition-group/TransitionGroup](https://github.com/reactjs/react-transition-group) instead. Version 1.1.1 provides a drop-in replacement.
- **react-addons-update** - Use [immutability-helper](https://github.com/kolodny/immutability-helper) instead, a drop-in replacement.
- **react-linked-input** - Explicitly set the `value` and `onChange` handler instead.

We're also discontinuing support for the `react-with-addons` UMD build. It will be removed in React 16.

### React Test Utils {#react-test-utils}

Currently, the React Test Utils live inside `react-addons-test-utils`. As of 15.5, we're deprecating that package and moving them to `react-dom/test-utils` instead:

```js
// Before (15.4 and below)
import TestUtils from 'react-addons-test-utils';

// After (15.5)
import TestUtils from 'react-dom/test-utils';
```

This reflects the fact that what we call the Test Utils are really a set of APIs that wrap the DOM renderer.

The exception is shallow rendering, which is not DOM-specific. The shallow renderer has been moved to `react-test-renderer/shallow`.

```js {2,5}
// Before (15.4 and below)
import {createRenderer} from 'react-addons-test-utils';

// After (15.5)
import {createRenderer} from 'react-test-renderer/shallow';
```

---

## Acknowledgements {#acknowledgements}

A special thank you to these folks for transferring ownership of npm package names:

- [Jason Miller](https://github.com/developit)
- [Aaron Ackerman](https://github.com/aackerman)
- [Vinicius Marson](https://github.com/viniciusmarson)

---

## Installation {#installation}

We recommend using [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/) for managing front-end dependencies. If you're new to package managers, the [Yarn documentation](https://yarnpkg.com/en/docs/getting-started) is a good place to get started.

To install React with Yarn, run:

```bash
yarn add react@^15.5.0 react-dom@^15.5.0
```

To install React with npm, run:

```bash
npm install --save react@^15.5.0 react-dom@^15.5.0
```

We recommend using a bundler like [webpack](https://webpack.js.org/) or [Browserify](http://browserify.org/) so you can write modular code and bundle it together into small packages to optimize load time.

Remember that by default, React runs extra checks and provides helpful warnings in development mode. When deploying your app, make sure to [compile it in production mode](/docs/installation#development-and-production-versions).

In case you don't use a bundler, we also provide pre-built bundles in the npm packages which you can [include as script tags](/docs/installation#using-a-cdn) on your page:

- **React**  
  Dev build with warnings: [react/dist/react.js](https://unpkg.com/react@15.5.0/dist/react.js)  
  Minified build for production: [react/dist/react.min.js](https://unpkg.com/react@15.5.0/dist/react.min.js)
- **React with Add-Ons**  
  Dev build with warnings: [react/dist/react-with-addons.js](https://unpkg.com/react@15.5.0/dist/react-with-addons.js)  
  Minified build for production: [react/dist/react-with-addons.min.js](https://unpkg.com/react@15.5.0/dist/react-with-addons.min.js)
- **React DOM** (include React in the page before React DOM)  
  Dev build with warnings: [react-dom/dist/react-dom.js](https://unpkg.com/react-dom@15.5.0/dist/react-dom.js)  
  Minified build for production: [react-dom/dist/react-dom.min.js](https://unpkg.com/react-dom@15.5.0/dist/react-dom.min.js)
- **React DOM Server** (include React in the page before React DOM Server)  
  Dev build with warnings: [react-dom/dist/react-dom-server.js](https://unpkg.com/react-dom@15.5.0/dist/react-dom-server.js)  
  Minified build for production: [react-dom/dist/react-dom-server.min.js](https://unpkg.com/react-dom@15.5.0/dist/react-dom-server.min.js)

We've also published version `15.5.0` of the `react`, `react-dom`, and addons packages on npm and the `react` package on bower.

---

## Changelog {#changelog}

## 15.5.0 (April 7, 2017) {#1550-april-7-2017}

### React {#react}

- Added a deprecation warning for `React.createClass`. Points users to create-react-class instead. ([@acdlite](https://github.com/acdlite) in [d9a4fa4](https://github.com/facebook/react/commit/d9a4fa4f51c6da895e1655f32255cf72c0fe620e))
- Added a deprecation warning for `React.PropTypes`. Points users to prop-types instead. ([@acdlite](https://github.com/acdlite) in [043845c](https://github.com/facebook/react/commit/043845ce75ea0812286bbbd9d34994bb7e01eb28))
- Fixed an issue when using `ReactDOM` together with `ReactDOMServer`. ([@wacii](https://github.com/wacii) in [#9005](https://github.com/facebook/react/pull/9005))
- Fixed issue with Closure Compiler. ([@anmonteiro](https://github.com/anmonteiro) in [#8895](https://github.com/facebook/react/pull/8895))
- Another fix for Closure Compiler. ([@Shastel](https://github.com/Shastel) in [#8882](https://github.com/facebook/react/pull/8882))
- Added component stack info to invalid element type warning. ([@n3tr](https://github.com/n3tr) in [#8495](https://github.com/facebook/react/pull/8495))

### React DOM {#react-dom}

- Fixed Chrome bug when backspacing in number inputs. ([@nhunzaker](https://github.com/nhunzaker) in [#7359](https://github.com/facebook/react/pull/7359))
- Added `react-dom/test-utils`, which exports the React Test Utils. ([@bvaughn](https://github.com/bvaughn))

### React Test Renderer {#react-test-renderer}

- Fixed bug where `componentWillUnmount` was not called for children. ([@gre](https://github.com/gre) in [#8512](https://github.com/facebook/react/pull/8512))
- Added `react-test-renderer/shallow`, which exports the shallow renderer. ([@bvaughn](https://github.com/bvaughn))

### React Addons {#react-addons}

- Last release for addons; they will no longer be actively maintained.
- Removed `peerDependencies` so that addons continue to work indefinitely. ([@acdlite](https://github.com/acdlite) and [@bvaughn](https://github.com/bvaughn) in [8a06cd7](https://github.com/facebook/react/commit/8a06cd7a786822fce229197cac8125a551e8abfa) and [67a8db3](https://github.com/facebook/react/commit/67a8db3650d724a51e70be130e9008806402678a))
- Updated to remove references to `React.createClass` and `React.PropTypes` ([@acdlite](https://github.com/acdlite) in [12a96b9](https://github.com/facebook/react/commit/12a96b94823d6b6de6b1ac13bd576864abd50175))
- `react-addons-test-utils` is deprecated. Use `react-dom/test-utils` and `react-test-renderer/shallow` instead. ([@bvaughn](https://github.com/bvaughn))
