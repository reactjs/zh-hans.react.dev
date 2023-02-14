---
title: 'React v15.6.0'
author: [flarnie]
---

Today we are releasing React 15.6.0. As we prepare for React 16.0, we have been fixing and cleaning up many things. This release continues to pave the way.

## Improving Inputs {/*improving-inputs*/}

In React 15.6.0 the `onChange` event for inputs is a little bit more reliable and handles more edge cases, including the following:

- not firing when radio button is clicked but not changed ([issue 1471](https://github.com/facebook/react/issues/1471))
- changing an input of type `range` with the arrow keys ([issue 554](https://github.com/facebook/react/issues/554))
- pasting text into a text area in IE11 ([issue 7211](https://github.com/facebook/react/issues/7211))
- auto-fill in IE11 ([issue 6614](https://github.com/facebook/react/issues/6614))
- clearing input with 'x' button or right-click 'delete' in IE11 ([issue 6822](https://github.com/facebook/react/issues/6822))
- not firing when characters are present in the input on render in IE11 ([issue 2185](https://github.com/facebook/react/issues/2185))

Thanks to [Jason Quense](https://github.com/jquense) and everyone who helped out on those issues and PRs.

## Less Noisy Deprecation Warnings {/*less-noisy-deprecation-warnings*/}

We are also including a couple of new warnings for upcoming deprecations. These should not affect most users, and for more details see the changelog below.

After the last release, we got valuable community feedback that deprecation warnings were causing noise and failing tests. **In React 15.6, we have downgraded deprecation warnings to use `console.warn` instead of `console.error`.** Our other warnings will still use `console.error` because they surface urgent issues which could lead to bugs. Unlike our other warnings, deprecation warnings can be fixed over time and won't cause problems in your app if shipped. We believe that downgrading the urgency of deprecation warnings will make your next update easier. Thanks to everyone who was involved in the discussion of this change.

---

## Installation {/*installation*/}

We recommend using [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/) for managing front-end dependencies. If you're new to package managers, the [Yarn documentation](https://yarnpkg.com/en/docs/getting-started) is a good place to get started.

To install React with Yarn, run:

```bash
yarn add react@^15.6.0 react-dom@^15.6.0
```

To install React with npm, run:

```bash
npm install --save react@^15.6.0 react-dom@^15.6.0
```

We recommend using a bundler like [webpack](https://webpack.js.org/) or [Browserify](http://browserify.org/) so you can write modular code and bundle it together into small packages to optimize load time.

Remember that by default, React runs extra checks and provides helpful warnings in development mode. When deploying your app, make sure to [use the production build](/docs/optimizing-performance#use-the-production-build).

In case you don't use a bundler, we also provide pre-built bundles in the npm packages which you can [include as script tags](/docs/installation#using-a-cdn) on your page:

- **React**<br/>
  Dev build with warnings: [react/dist/react.js](https://unpkg.com/react@15.6.0/dist/react.js)<br/>
  Minified build for production: [react/dist/react.min.js](https://unpkg.com/react@15.6.0/dist/react.min.js)<br/>
- **React with Add-Ons**<br/>
  Dev build with warnings: [react/dist/react-with-addons.js](https://unpkg.com/react@15.6.0/dist/react-with-addons.js)<br/>
  Minified build for production: [react/dist/react-with-addons.min.js](https://unpkg.com/react@15.5.0/dist/react-with-addons.min.js)<br/>
- **React DOM** (include React in the page before React DOM)<br/>
  Dev build with warnings: [react-dom/dist/react-dom.js](https://unpkg.com/react-dom@15.6.0/dist/react-dom.js)<br/>
  Minified build for production: [react-dom/dist/react-dom.min.js](https://unpkg.com/react-dom@15.6.0/dist/react-dom.min.js)<br/>
- **React DOM Server** (include React in the page before React DOM Server)<br/>
  Dev build with warnings: [react-dom/dist/react-dom-server.js](https://unpkg.com/react-dom@15.6.0/dist/react-dom-server.js)<br/>
  Minified build for production: [react-dom/dist/react-dom-server.min.js](https://unpkg.com/react-dom@15.6.0/dist/react-dom-server.min.js)<br/>

We've also published version `15.6.0` of `react` and `react-dom` on npm, and the `react` package on bower.

---

## Changelog {/*changelog*/}

## 15.6.0 (June 13, 2017) {/*1560-june-13-2017*/}

### React {/*react*/}

- Downgrade deprecation warnings to use `console.warn` instead of `console.error`. ([@flarnie](https://github.com/flarnie) in [#9753](https://github.com/facebook/react/pull/9753))
- Add a deprecation warning for `React.createClass`. Points users to `create-react-class` instead. ([@flarnie](https://github.com/flarnie) in [#9771](https://github.com/facebook/react/pull/9771))
- Add deprecation warnings and separate module for `React.DOM` factory helpers. ([@nhunzaker](https://github.com/nhunzaker) in [#8356](https://github.com/facebook/react/pull/8356))
- Warn for deprecation of `React.createMixin` helper, which was never used. ([@aweary](https://github.com/aweary) in [#8853](https://github.com/facebook/react/pull/8853))

### React DOM {/*react-dom*/}

- Add support for CSS variables in `style` attribute. ([@aweary](https://github.com/aweary) in [#9302](https://github.com/facebook/react/pull/9302))
- Add support for CSS Grid style properties. ([@ericsakmar](https://github.com/ericsakmar) in [#9185](https://github.com/facebook/react/pull/9185))
- Fix bug where inputs mutated value on type conversion. ([@nhunzaker](https://github.com/mhunzaker) in [#9806](https://github.com/facebook/react/pull/9806))
- Fix issues with `onChange` not firing properly for some inputs. ([@jquense](https://github.com/jquense) in [#8575](https://github.com/facebook/react/pull/8575))
- Fix bug where controlled number input mistakenly allowed period. ([@nhunzaker](https://github.com/nhunzaker) in [#9584](https://github.com/facebook/react/pull/9584))
- Fix bug where performance entries were being cleared. ([@chrisui](https://github.com/chrisui) in [#9451](https://github.com/facebook/react/pull/9451))

### React Addons {/*react-addons*/}

- Fix AMD support for addons depending on `react`. ([@flarnie](https://github.com/flarnie) in [#9919](https://github.com/facebook/react/issues/9919))
- Fix `isMounted()` to return `true` in `componentWillUnmount`. ([@mridgway](https://github.com/mridgway) in [#9638](https://github.com/facebook/react/issues/9638))
- Fix `react-addons-update` to not depend on native `Object.assign`. ([@gaearon](https://github.com/gaearon) in [#9937](https://github.com/facebook/react/pull/9937))
- Remove broken Google Closure Compiler annotation from `create-react-class`. ([@gaearon](https://github.com/gaearon) in [#9933](https://github.com/facebook/react/pull/9933))
- Remove unnecessary dependency from `react-linked-input`. ([@gaearon](https://github.com/gaearon) in [#9766](https://github.com/facebook/react/pull/9766))
- Point `react-addons-(css-)transition-group` to the new package. ([@gaearon](https://github.com/gaearon) in [#9937](https://github.com/facebook/react/pull/9937))
