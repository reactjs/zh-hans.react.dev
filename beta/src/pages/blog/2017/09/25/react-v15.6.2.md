---
title: 'React v15.6.2'
layout: Post
author: [nhunzaker]
---

Today we're sending out React 15.6.2. In 15.6.1, we shipped a few fixes for change events and inputs that had some unintended consequences. Those regressions have been ironed out, and we've also included a few more fixes to improve the stability of React across all browsers.

Additionally, 15.6.2 adds support for the [`controlList`](https://developers.google.com/web/updates/2017/03/chrome-58-media-updates#controlslist) attribute, and CSS columns are no longer appended with a `px` suffix.

## Installation {#installation}

We recommend using [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/) for managing front-end dependencies. If you're new to package managers, the [Yarn documentation](https://yarnpkg.com/en/docs/getting-started) is a good place to get started.

To install React with Yarn, run:

```bash
yarn add react@^15.6.2 react-dom@^15.6.2
```

To install React with npm, run:

```bash
npm install --save react@^15.6.2 react-dom@^15.6.2
```

We recommend using a bundler like [webpack](https://webpack.js.org/) or [Browserify](http://browserify.org/) so you can write modular code and bundle it together into small packages to optimize load time.

Remember that by default, React runs extra checks and provides helpful warnings in development mode. When deploying your app, make sure to [use the production build](/docs/optimizing-performance#use-the-production-build).

In case you don't use a bundler, we also provide pre-built bundles in the npm packages which you can [include as script tags](/docs/installation#using-a-cdn) on your page:

- **React**<br/>
  Dev build with warnings: [react/dist/react.js](https://unpkg.com/react@15.6.2/dist/react.js)<br/>
  Minified build for production: [react/dist/react.min.js](https://unpkg.com/react@15.6.2/dist/react.min.js)<br/>
- **React with Add-Ons**<br/>
  Dev build with warnings: [react/dist/react-with-addons.js](https://unpkg.com/react@15.6.2/dist/react-with-addons.js)<br/>
  Minified build for production: [react/dist/react-with-addons.min.js](https://unpkg.com/react@15.6.2/dist/react-with-addons.min.js)<br/>
- **React DOM** (include React in the page before React DOM)<br/>
  Dev build with warnings: [react-dom/dist/react-dom.js](https://unpkg.com/react-dom@15.6.2/dist/react-dom.js)<br/>
  Minified build for production: [react-dom/dist/react-dom.min.js](https://unpkg.com/react-dom@15.6.2/dist/react-dom.min.js)<br/>
- **React DOM Server** (include React in the page before React DOM Server)<br/>
  Dev build with warnings: [react-dom/dist/react-dom-server.js](https://unpkg.com/react-dom@15.6.2/dist/react-dom-server.js)<br/>
  Minified build for production: [react-dom/dist/react-dom-server.min.js](https://unpkg.com/react-dom@15.6.2/dist/react-dom-server.min.js)<br/>

We've also published version `15.6.2` of `react` and `react-dom` on npm, and the `react` package on bower.

---

## Changelog {#changelog}

## 15.6.2 (September 25, 2017) {#1562-september-25-2017}

### All Packages {#all-packages}

- Switch from BSD + Patents to MIT license

### React DOM {#react-dom}

- Fix a bug where modifying `document.documentMode` would trigger IE detection in other browsers, breaking change events. ([@aweary](https://github.com/aweary) in [#10032](https://github.com/facebook/react/pull/10032))
- CSS Columns are treated as unitless numbers. ([@aweary](https://github.com/aweary) in [#10115](https://github.com/facebook/react/pull/10115))
- Fix bug in QtWebKit when wrapping synthetic events in proxies. ([@walrusfruitcake](https://github.com/walrusfruitcake) in [#10115](https://github.com/facebook/react/pull/10011))
- Prevent event handlers from receiving extra argument in development. ([@aweary](https://github.com/aweary) in [#10115](https://github.com/facebook/react/pull/8363))
- Fix cases where `onChange` would not fire with `defaultChecked` on radio inputs. ([@jquense](https://github.com/jquense) in [#10156](https://github.com/facebook/react/pull/10156))
- Add support for `controlList` attribute to DOM property whitelist ([@nhunzaker](https://github.com/nhunzaker) in [#9940](https://github.com/facebook/react/pull/9940))
- Fix a bug where creating an element with a ref in a constructor did not throw an error in development. ([@iansu](https://github.com/iansu) in [#10025](https://github.com/facebook/react/pull/10025))
