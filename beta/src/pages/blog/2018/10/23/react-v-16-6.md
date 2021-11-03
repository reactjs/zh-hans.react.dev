---
title: 'React v16.6.0: lazy, memo and contextType'
layout: Post
author: [sebmarkbage]
---

Today we're releasing React 16.6 with a few new convenient features. A form of PureComponent/shouldComponentUpdate for function components, a way to do code splitting using Suspense and an easier way to consume Context from class components.

Check out the full [changelog](#changelog) below.

## [`React.memo`](/docs/react-api#reactmemo) {#reactmemo}

Class components can bail out from rendering when their input props are the same using [`PureComponent`](/docs/react-api#reactpurecomponent) or [`shouldComponentUpdate`](/docs/react-component#shouldcomponentupdate). Now you can do the same with function components by wrapping them in [`React.memo`](/docs/react-api#reactmemo).

```js
const MyComponent = React.memo(function MyComponent(props) {
  /* only rerenders if props change */
});
```

## [`React.lazy`](/docs/code-splitting#reactlazy): Code-Splitting with `Suspense` {#reactlazy-code-splitting-with-suspense}

You may have seen [Dan's talk about React Suspense at JSConf Iceland](/blog/2018/03/01/sneak-peek-beyond-react-16). Now you can use the Suspense component to do [code-splitting](/docs/code-splitting#reactlazy) by wrapping a dynamic import in a call to `React.lazy()`.

```js
import React, {lazy, Suspense} from 'react';
const OtherComponent = lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OtherComponent />
    </Suspense>
  );
}
```

The Suspense component will also allow library authors to start building data fetching with Suspense support in the future.

> Note: This feature is not yet available for server-side rendering. Suspense support will be added in a later release.

## [`static contextType`](/docs/context#classcontexttype) {#static-contexttype}

In [React 16.3](/blog/2018/03/29/react-v-16-3) we introduced the official Context API as a replacement to the previous [Legacy Context](/docs/legacy-context) API.

```js
const MyContext = React.createContext();
```

We've heard feedback that adopting the new render prop API can be difficult in class components. So we've added a convenience API to [consume a context value from within a class component](/docs/context#classcontexttype).

```js
class MyClass extends React.Component {
  static contextType = MyContext;
  componentDidMount() {
    let value = this.context;
    /* perform a side-effect at mount using the value of MyContext */
  }
  componentDidUpdate() {
    let value = this.context;
    /* ... */
  }
  componentWillUnmount() {
    let value = this.context;
    /* ... */
  }
  render() {
    let value = this.context;
    /* render something based on the value of MyContext */
  }
}
```

## [`static getDerivedStateFromError()`](/docs/react-component#static-getderivedstatefromerror) {#static-getderivedstatefromerror}

React 16 introduced [Error Boundaries](/blog/2017/07/26/error-handling-in-react-16) for handling errors thrown in React renders. We already had the `componentDidCatch` lifecycle method which gets fired after an error has already happened. It's great for logging errors to the server. It also lets you show a different UI to the user by calling `setState`.

Before that is fired, we render `null` in place of the tree that threw an error. This sometimes breaks parent components that don't expect their refs to be empty. It also doesn't work to recover from errors on the server since the `Did` lifecycle methods don't fire during server-side rendering.

We're adding another error method that lets you render the fallback UI before the render completes. See the docs for [`getDerivedStateFromError()`](/docs/react-component#static-getderivedstatefromerror).

> Note: `getDerivedStateFromError()` is not yet available for server-side rendering. It is designed to work with server-side rendering in a future release. We're releasing it early so that you can start preparing to use it.

## Deprecations in StrictMode {#deprecations-in-strictmode}

In [16.3](/blog/2018/03/29/react-v-16-3#strictmode-component) we introduced the [`StrictMode`](/docs/strict-mode) component. It lets you opt-in to early warnings for patterns that might cause problems in the future.

We've added two more APIs to the list of deprecated APIs in `StrictMode`. If you don't use `StrictMode` you don't have to worry; these warning won't fire for you.

- **ReactDOM.findDOMNode()** - This API is often misunderstood and most uses of it are unnecessary. It can also be surprisingly slow in React 16. [See the docs](/docs/strict-mode#warning-about-deprecated-finddomnode-usage) for possible upgrade paths.
- **Legacy Context** using contextTypes and getChildContext - Legacy context makes React slightly slower and bigger than it needs to be. That's why we strongly want to encourage upgrading to the [new context API](/docs/context). Hopefully the addition of the [`contextType`](/docs/context#classcontexttype) API makes this a bit easier.

If you're having trouble upgrading, we'd like to hear your feedback.

## Installation {#installation}

React v16.6.0 is available on the npm registry.

To install React 16 with Yarn, run:

```bash
yarn add react@^16.6.0 react-dom@^16.6.0
```

To install React 16 with npm, run:

```bash
npm install --save react@^16.6.0 react-dom@^16.6.0
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

- Add `React.memo()` as an alternative to `PureComponent` for functions. ([@acdlite](https://github.com/acdlite) in [#13748](https://github.com/facebook/react/pull/13748))
- Add `React.lazy()` for code splitting components. ([@acdlite](https://github.com/acdlite) in [#13885](https://github.com/facebook/react/pull/13885))
- `React.StrictMode` now warns about legacy context API. ([@bvaughn](https://github.com/bvaughn) in [#13760](https://github.com/facebook/react/pull/13760))
- `React.StrictMode` now warns about `findDOMNode`. ([@sebmarkbage](https://github.com/sebmarkbage) in [#13841](https://github.com/facebook/react/pull/13841))
- Rename `unstable_AsyncMode` to `unstable_ConcurrentMode`. ([@trueadm](https://github.com/trueadm) in [#13732](https://github.com/facebook/react/pull/13732))
- Rename `unstable_Placeholder` to `Suspense`, and `delayMs` to `maxDuration`. ([@gaearon](https://github.com/gaearon) in [#13799](https://github.com/facebook/react/pull/13799) and [@sebmarkbage](https://github.com/sebmarkbage) in [#13922](https://github.com/facebook/react/pull/13922))

### React DOM {#react-dom}

- Add `contextType` as a more ergonomic way to subscribe to context from a class. ([@bvaughn](https://github.com/bvaughn) in [#13728](https://github.com/facebook/react/pull/13728))
- Add `getDerivedStateFromError` lifecycle method for catching errors in a future asynchronous server-side renderer. ([@bvaughn](https://github.com/bvaughn) in [#13746](https://github.com/facebook/react/pull/13746))
- Warn when `<Context>` is used instead of `<Context.Consumer>`. ([@trueadm](https://github.com/trueadm) in [#13829](https://github.com/facebook/react/pull/13829))
- Fix gray overlay on iOS Safari. ([@philipp-spiess](https://github.com/philipp-spiess) in [#13778](https://github.com/facebook/react/pull/13778))
- Fix a bug caused by overwriting `window.event` in development. ([@sergei-startsev](https://github.com/sergei-startsev) in [#13697](https://github.com/facebook/react/pull/13697))

### React DOM Server {#react-dom-server}

- Add support for `React.memo()`. ([@alexmckenley](https://github.com/alexmckenley) in [#13855](https://github.com/facebook/react/pull/13855))
- Add support for `contextType`. ([@alexmckenley](https://github.com/alexmckenley) and [@sebmarkbage](https://github.com/sebmarkbage) in [#13889](https://github.com/facebook/react/pull/13889))

### Scheduler (Experimental) {#scheduler-experimental}

- Rename the package to `scheduler`. ([@gaearon](https://github.com/gaearon) in [#13683](https://github.com/facebook/react/pull/13683))
- Support priority levels, continuations, and wrapped callbacks. ([@acdlite](https://github.com/acdlite) in [#13720](https://github.com/facebook/react/pull/13720) and [#13842](https://github.com/facebook/react/pull/13842))
- Improve the fallback mechanism in non-DOM environments. ([@acdlite](https://github.com/acdlite) in [#13740](https://github.com/facebook/react/pull/13740))
- Schedule `requestAnimationFrame` earlier. ([@acdlite](https://github.com/acdlite) in [#13785](https://github.com/facebook/react/pull/13785))
- Fix the DOM detection to be more thorough. ([@trueadm](https://github.com/trueadm) in [#13731](https://github.com/facebook/react/pull/13731))
- Fix bugs with interaction tracing. ([@bvaughn](https://github.com/bvaughn) in [#13590](https://github.com/facebook/react/pull/13590))
- Add the `envify` transform to the package. ([@mridgway](https://github.com/mridgway) in [#13766](https://github.com/facebook/react/pull/13766))
