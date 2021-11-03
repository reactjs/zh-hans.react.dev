---
title: "React v17.0 Release Candidate: No New Features"
layout: Post
author: [gaearon,rachelnabors]
---

Today, we are publishing the first Release Candidate for React 17. It has been two and a half years since [the previous major release of React](/blog/2017/09/26/react-v16.0.html), which is a long time even by our standards! In this blog post, we will describe the role of this major release, what changes you can expect in it, and how you can try this release.

## No New Features {#no-new-features}

The React 17 release is unusual because it doesn't add any new developer-facing features. Instead, this release is primarily focused on **making it easier to upgrade React itself**.

We're actively working on the new React features, but they're not a part of this release. The React 17 release is a key part of our strategy to roll them out without leaving anyone behind.

In particular, **React 17 is a "stepping stone" release** that makes it safer to embed a tree managed by one version of React inside a tree managed by a different version of React.

## Gradual Upgrades {#gradual-upgrades}

For the past seven years, React upgrades have been "all-or-nothing". Either you stay on an old version, or you upgrade your whole app to a new version. There was no in-between.

This has worked out so far, but we are running into the limits of the "all-or-nothing" upgrade strategy. Some API changes, for example, deprecating the [legacy context API](/docs/legacy-context.html), are impossible to do in an automated way. Even though most apps written today don't ever use them, we still support them in React. We have to choose between supporting them in React indefinitely or leaving some apps behind on an old version of React. Both of these options aren't great.

So we wanted to provide another option.

**React 17 enables gradual React upgrades.** When you upgrade from React 15 to 16 (or, soon, from React 16 to 17), you would usually upgrade your whole app at once. This works well for many apps. But it can get increasingly challenging if the codebase was written more than a few years ago and isn't actively maintained. And while it's possible to use two versions of React on the page, until React 17 this has been fragile and caused problems with events.

We're fixing many of those problems with React 17. This means that **when React 18 and the next future versions come out, you will now have more options**. The first option will be to upgrade your whole app at once, like you might have done before. But you will also have an option to upgrade your app piece by piece. For example, you might decide to migrate most of your app to React 18, but keep some lazy-loaded dialog or a subroute on React 17.

This doesn't mean you *have to* do gradual upgrades. For most apps, upgrading all at once is still the best solution. Loading two versions of React -- even if one of them is loaded lazily on demand -- is still not ideal. However, for larger apps that aren't actively maintained, this option may make sense to consider, and React 17 enables those apps to not get left behind.

To enable gradual updates, we've needed to make some changes to the React event system. React 17 is a major release because these changes are potentially breaking. In practice, we've only had to change fewer than twenty components out of 100,000+ so **we expect that most apps can upgrade to React 17 without too much trouble**. [Tell us](https://github.com/facebook/react/issues) if you run into problems.

### Demo of Gradual Upgrades {#demo-of-gradual-upgrades}

We've prepared an [example repository](https://github.com/reactjs/react-gradual-upgrade-demo/) demonstrating how to lazy-load an older version of React if necessary. This demo uses Create React App, but it should be possible to follow a similar approach with any other tool. We welcome demos using other tooling as pull requests.

>Note
>
>We've **postponed other changes** until after React 17. The goal of this release is to enable gradual upgrades. If upgrading to React 17 were too difficult, it would defeat its purpose.

## Changes to Event Delegation {#changes-to-event-delegation}

Technically, it has always been possible to nest apps developed with different versions of React. However, it was rather fragile because of how the React event system worked.


In React components, you usually write event handlers inline:

```js
<button onClick={handleClick}>
```

The vanilla DOM equivalent to this code is something like:

```js
myButton.addEventListener('click', handleClick);
```

However, for most events, React doesn't actually attach them to the DOM nodes on which you declare them. Instead, React attaches one handler per event type directly at the `document` node. This is called [event delegation](https://davidwalsh.name/event-delegate). In addition to its performance benefits on large application trees, it also makes it easier to add new features like [replaying events](https://twitter.com/dan_abramov/status/1200118229697486849).

React has been doing event delegation automatically since its first release. When a DOM event fires on the document, React figures out which component to call, and then the React event "bubbles" upwards through your components. But behind the scenes, the native event has already bubbled up to the `document` level, where React installs its event handlers.

However, this is a problem for gradual upgrades.

If you have multiple React versions on the page, they all register event handlers at the top. This breaks `e.stopPropagation()`: if a nested tree has stopped propagation of an event, the outer tree would still receive it. This made it difficult to nest different versions of React. This concern is not hypothetical -- for example, the Atom editor [ran into this](https://github.com/facebook/react/pull/8117) four years ago.

This is why we're changing how React attaches events to the DOM under the hood.

**In React 17, React will no longer attach event handlers at the `document` level. Instead, it will attach them to the root DOM container into which your React tree is rendered:**

```js
const rootNode = document.getElementById('root');
ReactDOM.render(<App />, rootNode);
```

In React 16 and earlier, React would do `document.addEventListener()` for most events. React 17 will call `rootNode.addEventListener()` under the hood instead.

![A diagram showing how React 17 attaches events to the roots rather than to the document](../images/blog/react-v17-rc/react_17_delegation.png)

Thanks to this change, **it is now safer to embed a React tree managed by one version inside a tree managed by a different React version**. Note that for this to work, both of the versions would need to be 17 or higher, which is why upgrading to React 17 is important. In a way, React 17 is a "stepping stone" release that makes next gradual upgrades feasible.

This change also **makes it easier to embed React into apps built with other technologies**. For example, if the outer "shell" of your app is written in jQuery, but the newer code inside of it is written with React, `e.stopPropagation()` inside the React code would now prevent it from reaching the jQuery code -- as you would expect. This also works in the other direction. If you no longer like React and want to rewrite your app -- for example, in jQuery -- you can start converting the outer shell from React to jQuery without breaking the event propagation.

We've confirmed that [numerous](https://github.com/facebook/react/issues/7094) [problems](https://github.com/facebook/react/issues/8693) [reported](https://github.com/facebook/react/issues/12518) [over](https://github.com/facebook/react/issues/13451) [the](https://github.com/facebook/react/issues/4335) [years](https://github.com/facebook/react/issues/1691) [on](https://github.com/facebook/react/issues/285#issuecomment-253502585) [our](https://github.com/facebook/react/pull/8117) [issue](https://github.com/facebook/react/issues/11530) [tracker](https://github.com/facebook/react/issues/7128) related to integrating React with non-React code have been fixed by the new behavior.

>Note
>
>You might be wondering whether this breaks [Portals](/docs/portals.html) outside of the root container. The answer is that React *also* listens to events on portal containers, so this is not an issue.

#### Fixing Potential Issues {#fixing-potential-issues}

As with any breaking change, it is likely some code would need to be adjusted. At Facebook, we had to adjust about 10 modules in total (out of many thousands) to work with this change.

For example, if you add manual DOM listeners with `document.addEventListener(...)`, you might expect them to catch all React events. In React 16 and earlier, even if you call `e.stopPropagation()` in a React event handler, your custom `document` listeners would still receive them because the native event is *already* at the document level. With React 17, the propagation *would* stop (as requested!), so your `document` handlers would not fire:

```js
document.addEventListener('click', function() {
  // This custom handler will no longer receive clicks
  // from React components that called e.stopPropagation()
});
```

You can fix code like this by converting your listener to use the [capture phase](https://javascript.info/bubbling-and-capturing#capturing). To do this, you can pass `{ capture: true }` as the third argument to `document.addEventListener`:

```js
document.addEventListener('click', function() {
  // Now this event handler uses the capture phase,
  // so it receives *all* click events below!
}, { capture: true });
```

Note how this strategy is more resilient overall -- for example, it will probably fix existing bugs in your code that happen when `e.stopPropagation()` is called outside of a React event handler. In other words, **event propagation in React 17 works closer to the regular DOM**.

## Other Breaking Changes {#other-breaking-changes}

We've kept the breaking changes in React 17 to the minimum. For example, it doesn't remove any of the methods that have been deprecated in the previous releases. However, it does include a few other breaking changes that have been relatively safe in our experience. In total, we've had to adjust fewer than 20 out of 100,000+ our components because of them.

### Aligning with Browsers {#aligning-with-browsers}

We've made a couple of smaller changes related to the event system:

* The `onScroll` event **no longer bubbles** to prevent [common confusion](https://github.com/facebook/react/issues/15723).
* React `onFocus` and `onBlur` events have switched to using the native `focusin` and `focusout` events under the hood, which more closely match React's existing behavior and sometimes provide extra information.
* Capture phase events (e.g. `onClickCapture`) now use real browser capture phase listeners.

These changes align React closer with the browser behavior and improve interoperability.

>Note
>
>Although React 17 switched from `focus` to `focusin` *under the hood* for the `onFocus` event, note that this has **not** affected the bubbling behavior. In React, `onFocus` event has always bubbled, and it continues to do so in React 17 because generally it is a more useful default. See [this sandbox](https://codesandbox.io/s/strange-albattani-7tqr7?file=/src/App.js) for the different checks you can add for different particular use cases.

### No Event Pooling {#no-event-pooling}

React 17 removes the "event pooling" optimization from React. It doesn't improve performance in modern browsers and confuses even experienced React users:

```js
function handleChange(e) {
  setData(data => ({
    ...data,
    // This crashes in React 16 and earlier:
    text: e.target.value
  }));
}
```

This is because React reused the event objects between different events for performance in old browsers, and set all event fields to `null` in between them. With React 16 and earlier, you have to call `e.persist()` to properly use the event, or read the property you need earlier.

**In React 17, this code works as you would expect. The old event pooling optimization has been fully removed, so you can read the event fields whenever you need them.**

This is a behavior change, which is why we're marking it as breaking, but in practice we haven't seen it break anything at Facebook. (Maybe it even fixed a few bugs!) Note that `e.persist()` is still available on the React event object, but now it doesn't do anything.

### Effect Cleanup Timing {#effect-cleanup-timing}

We are making the timing of the `useEffect` cleanup function more consistent.

```js {3-5}
useEffect(() => {
  // This is the effect itself.
  return () => {
    // This is its cleanup.
  };
});
```

Most effects don't need to delay screen updates, so React runs them asynchronously soon after the update has been reflected on the screen. (For the rare cases where you need an effect to block paint, e.g. to measure and position a tooltip, prefer `useLayoutEffect`.)

However, the effect *cleanup* function, when it exists, used to run synchronously in React 16. We've found that, similar to `componentWillUnmount` being synchronous in classes, this is not ideal for larger apps because it slows down large screen transitions (e.g. switching tabs).

**In React 17, the effect cleanup function also runs asynchronously -- for example, if the component is unmounting, the cleanup will run _after_ the screen has been updated.**

This mirrors how the effects themselves run more closely. In the  rare cases where you might want to rely on the synchronous execution, you can switch to `useLayoutEffect` instead.

>Note
>
>You might be wondering whether this means that you'll now be unable to fix warnings about `setState` on unmounted components. Don't worry -- React specifically checks for this case, and does *not* fire `setState` warnings in the short gap between unmounting and the cleanup. **So code cancelling requests or intervals can almost always stay the same.**

Additionally, React 17 executes the cleanup functions in the same order as the effects, according to their position in the tree. Previously, this order was occasionally different.

#### Potential Issues {#potential-issues}

We've only seen a couple of components break with this change, although reusable libraries may need to test it more thoroughly. One example of problematic code may look like this:

```js
useEffect(() => {
  someRef.current.someSetupMethod();
  return () => {
    someRef.current.someCleanupMethod();
  };
});
```

The problem is that `someRef.current` is mutable, so by the time the cleanup function runs, it may have been set to `null`. The solution is to capture any mutable values *inside* the effect:

```js
useEffect(() => {
  const instance = someRef.current;
  instance.someSetupMethod();
  return () => {
    instance.someCleanupMethod();
  };
});
```

We don't expect this to be a common problem because [our `eslint-plugin-react-hooks/exhaustive-deps` lint rule](https://github.com/facebook/react/tree/master/packages/eslint-plugin-react-hooks) (make sure you use it!) has always warned about this.

### Consistent Errors for Returning Undefined {#consistent-errors-for-returning-undefined}

In React 16 and earlier, returning `undefined` has always been an error:

```js
function Button() {
  return; // Error: Nothing was returned from render
}
```

This is in part because it’s easy to return `undefined` unintentionally:

```js
function Button() {
  // We forgot to write return, so this component returns undefined.
  // React surfaces this as an error instead of ignoring it.
  <button />;
}
```

Previously, React only did this for class and function components, but did not check the return values of `forwardRef` and `memo` components. This was due to a coding mistake.

**In React 17, the behavior for `forwardRef` and `memo` components is consistent with regular function and class components. Returning `undefined` from them is an error.**

```js
let Button = forwardRef(() => {
  // We forgot to write return, so this component returns undefined.
  // React 17 surfaces this as an error instead of ignoring it.
  <button />;
});

let Button = memo(() => {
  // We forgot to write return, so this component returns undefined.
  // React 17 surfaces this as an error instead of ignoring it.
  <button />;
});
```

For the cases where you want to render nothing intentionally, return `null` instead.

### Native Component Stacks {#native-component-stacks}

When you throw an error in the browser, the browser gives you a stack trace with JavaScript function names and their locations. However, JavaScript stacks are often not enough to diagnose a problem because the React tree hierarchy can be just as important. You want to know not just that a `Button` threw an error, but *where in the React tree* that `Button` is.

To solve this, React 16 started printing "component stacks" when you have an error. Still, they used to be inferior to the native JavaScript stacks. In particular, they were not clickable in the console because React didn't know where the function was declared in the source code. Additionally, they were [mostly useless in production](https://github.com/facebook/react/issues/12757). Unlike regular minified JavaScript stacks which can be automatically restored to the original function names with a sourcemap, with React component stacks you had to choose between production stacks and bundle size.

**In React 17, the component stacks are generated using a different mechanism that stitches them together from the regular native JavaScript stacks. This lets you get the fully symbolicated React component stack traces in a production environment.**

The way React implements this is somewhat unorthodox. Currently, the browsers don't provide a way to get a function's stack frame (source file and location). So when React catches an error, it will now *reconstruct* its component stack by throwing (and catching) a temporary error from inside each of the components above, when it is possible. This adds a small performance penalty for crashes, but it only happens once per component type.

If you're curious, you can read more details in [this pull request](https://github.com/facebook/react/pull/18561), but for the most part this exact mechanism shouldn't affect your code. From your perspective, the new feature is that component stacks are now clickable (because they rely on the native browser stack frames), and that you can decode them in production like you would with regular JavaScript errors.

The part that constitutes a breaking change is that for this to work, React re-executes parts of some of the React functions and React class constructors above in the stack after an error is captured. Since render functions and class constructors shouldn't have side effects (which is also important for server rendering), this should not pose any practical problems.

### Removing Private Exports {#removing-private-exports}

Finally, the last notable breaking change is that we've removed some React internals that were previously exposed to other projects. In particular, [React Native for Web](https://github.com/necolas/react-native-web) used to depend on some internals of the event system, but that dependency was fragile and used to break.

**In React 17, these private exports have been removed. As far as we're aware, React Native for Web was the only project using them, and they have already completed a migration to a different approach that doesn't depend on those private exports.**

This means that the older versions of React Native for Web won't be compatible with React 17, but the newer versions will work with it. In practice, this doesn't change much because React Native for Web had to release new versions to adapt to internal React changes anyway.

Additionally, we've removed the `ReactTestUtils.SimulateNative` helper methods. They have never been documented, didn't do quite what their names implied, and didn't work with the changes we've made to the event system. If you want a convenient way to fire native browser events in tests, check out the [React Testing Library](https://testing-library.com/docs/dom-testing-library/api-events) instead.

## Installation {#installation}

We encourage you to try React 17.0 Release Candidate soon and [raise any issues](https://github.com/facebook/react/issues) for the problems you might encounter in the migration. **Keep in mind that a release candidate is more likely to contain bugs than a stable release, so don't deploy it to production yet.**

To install React 17 RC with npm, run:

```bash
npm install react@17.0.0-rc.0 react-dom@17.0.0-rc.0
```

To install React 17 RC with Yarn, run:

```bash
yarn add react@17.0.0-rc.0 react-dom@17.0.0-rc.0
```

We also provide UMD builds of React via a CDN:

```html
<script crossorigin src="https://unpkg.com/react@17.0.0-rc.0/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@17.0.0-rc.0/umd/react-dom.production.min.js"></script>
```

Refer to the documentation for [detailed installation instructions](/docs/installation.html).

## Changelog {#changelog}

### React {#react}

* Add `react/jsx-runtime` and `react/jsx-dev-runtime` for the [new JSX transform](https://babeljs.io/blog/2020/03/16/7.9.0#a-new-jsx-transform-11154-https-githubcom-babel-babel-pull-11154). ([@lunaruan](https://github.com/lunaruan) in [#18299](https://github.com/facebook/react/pull/18299))
* Build component stacks from native error frames. ([@sebmarkbage](https://github.com/sebmarkbage) in [#18561](https://github.com/facebook/react/pull/18561))
* Allow to specify `displayName` on context for improved stacks. ([@eps1lon](https://github.com/eps1lon) in [#18224](https://github.com/facebook/react/pull/18224))

### React DOM {#react-dom}

* Delegate events to roots instead of `document`. ([@trueadm](https://github.com/trueadm) in [#18195](https://github.com/facebook/react/pull/18195) and [others](https://github.com/facebook/react/pulls?q=is%3Apr+author%3Atrueadm+modern+event+is%3Amerged))
* Clean up all effects before running any next effects. ([@bvaughn](https://github.com/bvaughn) in [#17947](https://github.com/facebook/react/pull/17947))
* Run `useEffect` cleanup functions asynchronously. ([@bvaughn](https://github.com/bvaughn) in [#17925](https://github.com/facebook/react/pull/17925))
* Use browser `focusin` and `focusout` for `onFocus` and `onBlur`. ([@trueadm](https://github.com/trueadm) in [#19186](https://github.com/facebook/react/pull/19186))
* Make all `Capture` events use the browser capture phase. ([@trueadm](https://github.com/trueadm) in [#19221](https://github.com/facebook/react/pull/19221))
* Don't emulate bubbling of the `onScroll` event. ([@gaearon](https://github.com/gaearon) in [#19464](https://github.com/facebook/react/pull/19464))
* Throw if `forwardRef` or `memo` component returns `undefined`. ([@gaearon](https://github.com/gaearon) in [#19550](https://github.com/facebook/react/pull/19550))
* Remove event pooling. ([@trueadm](https://github.com/trueadm) in [#18969](https://github.com/facebook/react/pull/18969))
* Stop exposing internals that won’t be needed by React Native Web. ([@necolas](https://github.com/necolas) in [#18483](https://github.com/facebook/react/pull/18483))
* Disable `console` in the second render pass of DEV mode double render. ([@sebmarkbage](https://github.com/sebmarkbage) in [#18547](https://github.com/facebook/react/pull/18547))
* Deprecate the undocumented and misleading `ReactTestUtils.SimulateNative` API. ([@gaearon](https://github.com/gaearon) in [#13407](https://github.com/facebook/react/pull/13407))
* Rename private field names used in the internals. ([@gaearon](https://github.com/gaearon) in [#18377](https://github.com/facebook/react/pull/18377))
* Don't call User Timing API in development. ([@gaearon](https://github.com/gaearon) in [#18417](https://github.com/facebook/react/pull/18417))
* Disable console during the repeated render in Strict Mode. ([@sebmarkbage](https://github.com/sebmarkbage) in [#18547](https://github.com/facebook/react/pull/18547))
* In Strict Mode, double-render components without Hooks too. ([@eps1lon](https://github.com/eps1lon) in [#18430](https://github.com/facebook/react/pull/18430))
* Allow calling `ReactDOM.flushSync` during lifecycle methods (but warn). ([@sebmarkbage](https://github.com/sebmarkbage) in [#18759](https://github.com/facebook/react/pull/18759))
* Add the `code` property to the keyboard event objects. ([@bl00mber](https://github.com/bl00mber) in [#18287](https://github.com/facebook/react/pull/18287))
* Add the `disableRemotePlayback` property for `video` elements. ([@tombrowndev](https://github.com/tombrowndev) in [#18619](https://github.com/facebook/react/pull/18619))
* Add the `enterKeyHint` property for `input` elements. ([@eps1lon](https://github.com/eps1lon) in [#18634](https://github.com/facebook/react/pull/18634))
* Warn when no `value` is provided to `<Context.Provider>`. ([@charlie1404](https://github.com/charlie1404) in [#19054](https://github.com/facebook/react/pull/19054))
* Warn when `memo` or `forwardRef` components return `undefined`. ([@bvaughn](https://github.com/bvaughn) in [#19550](https://github.com/facebook/react/pull/19550))
* Improve the error message for invalid updates. ([@JoviDeCroock](https://github.com/JoviDeCroock) in [#18316](https://github.com/facebook/react/pull/18316))
* Exclude forwardRef and memo from stack frames. ([@sebmarkbage](https://github.com/sebmarkbage) in [#18559](https://github.com/facebook/react/pull/18559))
* Improve the error message when switching between controlled and uncontrolled inputs. ([@vcarl](https://github.com/vcarl) in [#17070](https://github.com/facebook/react/pull/17070))
* Fix `setState` hanging in development inside a closed iframe. ([@gaearon](https://github.com/gaearon) in [#19220](https://github.com/facebook/react/pull/19220))
* Fix rendering bailout for lazy components with `defaultProps`. ([@jddxf](https://github.com/jddxf) in [#18539](https://github.com/facebook/react/pull/18539))
* Fix a false positive warning when `dangerouslySetInnerHTML` is `undefined`. ([@eps1lon](https://github.com/eps1lon) in [#18676](https://github.com/facebook/react/pull/18676))
* Fix Test Utils with non-standard `require` implementation. ([@just-boris](https://github.com/just-boris) in [#18632](https://github.com/facebook/react/pull/18632))
* Fix `onBeforeInput` reporting an incorrect `event.type`. ([@eps1lon](https://github.com/eps1lon) in [#19561](https://github.com/facebook/react/pull/19561))
* Use delegation for `onSubmit` and `onReset` events. ([@gaearon](https://github.com/gaearon) in [#19333](https://github.com/facebook/react/pull/19333))
* Improve memory usage. ([@trueadm](https://github.com/trueadm) in [#18970](https://github.com/facebook/react/pull/18970))

### React DOM Server {#react-dom-server}

* Make `useCallback` behavior consistent with `useMemo` for the server renderer. ([@alexmckenley](https://github.com/alexmckenley) in [#18783](https://github.com/facebook/react/pull/18783))
* Fix state leaking when a function component throws. ([@pmaccart](https://github.com/pmaccart) in [#19212](https://github.com/facebook/react/pull/19212))

### React Test Renderer {#react-test-renderer}

* Improve `findByType` error message. ([@henryqdineen](https://github.com/henryqdineen) in [#17439](https://github.com/facebook/react/pull/17439))

### Concurrent Mode (Experimental) {#concurrent-mode-experimental}

* Revamp the priority batching heuristics. ([@acdlite](https://github.com/acdlite) in [#18796](https://github.com/facebook/react/pull/18796))
* Add the `unstable_` prefix before the experimental APIs. ([@acdlite](https://github.com/acdlite) in [#18825](https://github.com/facebook/react/pull/18825))
* Remove `unstable_discreteUpdates` and `unstable_flushDiscreteUpdates`. ([@trueadm](https://github.com/trueadm) in [#18825](https://github.com/facebook/react/pull/18825))
* Disable `<div hidden />` prerendering in favor of a different future API. ([@acdlite](https://github.com/acdlite) in [#18917](https://github.com/facebook/react/pull/18917))
* Add an experimental `unstable_useOpaqueIdentifier` Hook. ([@lunaruan](https://github.com/lunaruan) in [#17322](https://github.com/facebook/react/pull/17322))
* Using `act` in the test renderer no longer flushes Suspense fallbacks. ([@acdlite](https://github.com/acdlite) in [#18596](https://github.com/facebook/react/pull/18596))
* Clear the existing root content before mounting. ([@bvaughn](https://github.com/bvaughn) in [#18730](https://github.com/facebook/react/pull/18730))
* Fix a bug with error boundaries. ([@acdlite](https://github.com/acdlite) in [#18265](https://github.com/facebook/react/pull/18265))
* Fix a bug causing dropped updates in a suspended tree. ([@acdlite](https://github.com/acdlite) in [#18384](https://github.com/facebook/react/pull/18384) and [#18457](https://github.com/facebook/react/pull/18457))
* Fix a bug causing dropped render phase updates. ([@acdlite](https://github.com/acdlite) in [#18537](https://github.com/facebook/react/pull/18537))
* Fix a bug in SuspenseList. ([@sebmarkbage](https://github.com/sebmarkbage) in [#18412](https://github.com/facebook/react/pull/18412))
* Fix a bug causing Suspense fallback to show too early. ([@acdlite](https://github.com/acdlite) in [#18411](https://github.com/facebook/react/pull/18411))
* Fix a bug with class components inside SuspenseList. ([@sebmarkbage](https://github.com/sebmarkbage) in [#18448](https://github.com/facebook/react/pull/18448))
* Fix a bug with inputs that may cause updates to be dropped. ([@jddxf](https://github.com/jddxf) in [#18515](https://github.com/facebook/react/pull/18515) and [@acdlite](https://github.com/acdlite) in [#18535](https://github.com/facebook/react/pull/18535))
* Fix a bug causing Suspense fallback to get stuck.  ([@acdlite](https://github.com/acdlite) in [#18663](https://github.com/facebook/react/pull/18663))
* Don't cut off the tail of a SuspenseList if hydrating. ([@sebmarkbage](https://github.com/sebmarkbage) in [#18854](https://github.com/facebook/react/pull/18854))
* Fix a bug in `useMutableSource` that may happen when `getSnapshot` changes. ([@bvaughn](https://github.com/bvaughn) in [#18297](https://github.com/facebook/react/pull/18297))
* Fix a tearing bug in `useMutableSource`. ([@bvaughn](https://github.com/bvaughn) in [#18912](https://github.com/facebook/react/pull/18912))
* Warn if calling setState outside of render but before commit. ([@sebmarkbage](https://github.com/sebmarkbage) in [#18838](https://github.com/facebook/react/pull/18838))
