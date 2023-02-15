---
title: 'React v16.3.0: New lifecycles and context API'
author: [bvaughn]
---

A few days ago, we [wrote a post about upcoming changes to our legacy lifecycle methods](/blog/2018/03/27/update-on-async-rendering), including gradual migration strategies. In React 16.3.0, we are adding a few new lifecycle methods to assist with that migration. We are also introducing new APIs for long requested features: an official context API, a ref forwarding API, and an ergonomic ref API.

Read on to learn more about the release.

## Official Context API {/*official-context-api*/}

For many years, React has offered an experimental API for context. Although it was a powerful tool, its use was discouraged because of inherent problems in the API, and because we always intended to replace the experimental API with a better one.

Version 16.3 introduces a new context API that is more efficient and supports both static type checking and deep updates.

> **Note**
>
> The old context API will keep working for all React 16.x releases, so you will have time to migrate.

Here is an example illustrating how you might inject a "theme" using the new context API:

```js {1,8-10,18-20}
const ThemeContext = React.createContext('light');

class ThemeProvider extends React.Component {
  state = {theme: 'light'};

  render() {
    return (
      <ThemeContext.Provider value={this.state.theme}>
        {this.props.children}
      </ThemeContext.Provider>
    );
  }
}

class ThemedButton extends React.Component {
  render() {
    return (
      <ThemeContext.Consumer>
        {theme => <Button theme={theme} />}
      </ThemeContext.Consumer>
    );
  }
}
```

[Learn more about the new context API here.](/docs/context)

## `createRef` API {/*createref-api*/}

Previously, React provided two ways of managing refs: the legacy string ref API and the callback API. Although the string ref API was the more convenient of the two, it had [several downsides](https://github.com/facebook/react/issues/1373) and so our official recommendation was to use the callback form instead.

Version 16.3 adds a new option for managing refs that offers the convenience of a string ref without any of the downsides:

```js {4,8,12}
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }

  render() {
    return <input type="text" ref={this.inputRef} />;
  }

  componentDidMount() {
    this.inputRef.current.focus();
  }
}
```

> **Note:**
>
> Callback refs will continue to be supported in addition to the new `createRef` API.
>
> You don't need to replace callback refs in your components. They are slightly more flexible, so they will remain as an advanced feature.

[Learn more about the new `createRef` API here.](/docs/refs-and-the-dom)

## `forwardRef` API {/*forwardref-api*/}

Generally, React components are declarative, but sometimes imperative access to the component instances and the underlying DOM nodes is necessary. This is common for use cases like managing focus, selection, or animations. React provides [refs](/docs/refs-and-the-dom) as a way to solve this problem. However, component encapsulation poses some challenges with refs.

For example, if you replace a `<button>` with a custom `<FancyButton>` component, the `ref` attribute on it will start pointing at the wrapper component instead of the DOM node (and would be `null` for function components). While this is desirable for "application-level" components like `FeedStory` or `Comment` that need to be encapsulated, it can be annoying for "leaf" components such as `FancyButton` or `MyTextInput` that are typically used like their DOM counterparts, and might need to expose their DOM nodes.

Ref forwarding is a new opt-in feature that lets some components take a `ref` they receive, and pass it further down (in other words, "forward" it) to a child. In the example below, `FancyButton` forwards its ref to a DOM `button` that it renders:

```js {1,2}
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
));

// You can now get a ref directly to the DOM button:
const ref = React.createRef();
<FancyButton ref={ref}>Click me!</FancyButton>;
```

This way, components using `FancyButton` can get a ref to the underlying `button` DOM node and access it if necessary—just like if they used a DOM `button` directly.

Ref forwarding is not limited to "leaf" components that render DOM nodes. If you write [higher order components](/docs/higher-order-components), we recommend using ref forwarding to automatically pass the ref down to the wrapped class component instances.

[Learn more about the forwardRef API here.](/docs/forwarding-refs)

## Component Lifecycle Changes {/*component-lifecycle-changes*/}

React's class component API has been around for years with little change. However, as we add support for more advanced features (such as [error boundaries](/docs/react-component#componentdidcatch) and the upcoming [async rendering mode](/blog/2018/03/01/sneak-peek-beyond-react-16)) we stretch this model in ways that it was not originally intended.

For example, with the current API, it is too easy to block the initial render with non-essential logic. In part this is because there are too many ways to accomplish a given task, and it can be unclear which is best. We've observed that the interrupting behavior of error handling is often not taken into consideration and can result in memory leaks (something that will also impact the upcoming async rendering mode). The current class component API also complicates other efforts, like our work on [prototyping a React compiler](https://twitter.com/trueadm/status/944908776896978946).

Many of these issues are exacerbated by a subset of the component lifecycles (`componentWillMount`, `componentWillReceiveProps`, and `componentWillUpdate`). These also happen to be the lifecycles that cause the most confusion within the React community. For these reasons, we are going to deprecate those methods in favor of better alternatives.

We recognize that this change will impact many existing components. Because of this, the migration path will be as gradual as possible, and will provide escape hatches. (At Facebook, we maintain more than 50,000 React components. We depend on a gradual release cycle too!)

> **Note:**
>
> Deprecation warnings will be enabled with a future 16.x release, **but the legacy lifecycles will continue to work until version 17**.
>
> Even in version 17, it will still be possible to use them, but they will be aliased with an "UNSAFE\_" prefix to indicate that they might cause issues. We have also prepared an [automated script to rename them](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) in existing code.

In addition to deprecating unsafe lifecycles, we are also adding a couple of new lifecyles:

- [`getDerivedStateFromProps`](/docs/react-component#static-getderivedstatefromprops) is being added as a safer alternative to the legacy `componentWillReceiveProps`. (Note that [in most cases you don't need either of them](/blog/2018/06/07/you-probably-dont-need-derived-state).)
- [`getSnapshotBeforeUpdate`](/docs/react-component#getsnapshotbeforeupdate) is being added to support safely reading properties from e.g. the DOM before updates are made.

[Learn more about these lifecycle changes here.](/blog/2018/03/27/update-on-async-rendering)

## `StrictMode` Component {/*strictmode-component*/}

`StrictMode` is a tool for highlighting potential problems in an application. Like `Fragment`, `StrictMode` does not render any visible UI. It activates additional checks and warnings for its descendants.

> **Note:**
>
> `StrictMode` checks are run in development mode only; _they do not impact the production build_.

Although it is not possible for strict mode to catch all problems (e.g. certain types of mutation), it can help with many. If you see warnings in strict mode, those things will likely cause bugs for async rendering.

In version 16.3, `StrictMode` helps with:

- Identifying components with unsafe lifecycles
- Warning about legacy string ref API usage
- Detecting unexpected side effects

Additional functionality will be added with future releases of React.

[Learn more about the `StrictMode` component here.](/docs/strict-mode)
