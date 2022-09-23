---
title: createRoot
---

<Intro>

`createRoot` lets you create a root to display React components inside a browser DOM node.

```js
const root = createRoot(domNode, options?)
```

</Intro>

<InlineToc />

---

## Usage {/*usage*/}

### Rendering an app fully built with React {/*rendering-an-app-fully-built-with-react*/}

If your app is fully built with React, create a single root for your entire app.

```js [[1, 3, "document.getElementById('root')"], [2, 4, "<App />"]]
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
````

Usually, you only need to run this code once at startup. It will:

1. Find the <CodeStep step={1}>browser DOM node</CodeStep> defined in your HTML.
2. Display the <CodeStep step={2}>React component</CodeStep> for your app inside.

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <!-- This is the DOM node -->
    <div id="root"></div>
  </body>
</html>
```

```js index.js active
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

```js App.js
import { useState } from 'react';

export default function App() {
  return (
    <>
      <h1>Hello, world!</h1>
      <Counter />
    </>
  );
}

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      You clicked me {count} times
    </button>
  );
}
```

</Sandpack>

**If your app is fully built with React, you shouldn't need to create any more roots, or to call [`root.render`](#root-render) again.** 

From this point on, React will manage the DOM of your entire app. To add more components, [nest them inside the `App` component.](/learn/importing-and-exporting-components) When you need to update the UI, each of your components can do this by [using state.](/apis/react/useState) When you need to display extra content like a modal or a tooltip outside the DOM node, [render it with a portal.](/apis/react-dom/createPortal)

<Note>

When your HTML is empty, the user sees a blank page until the app's JavaScript code loads and runs:

```html
<div id="root"></div>
```

This can feel very slow! To solve this, you can generate the initial HTML from your components [on the server or during the build.](/apis/react-dom/server) Then your visitors can read text, see images, and click links before any of the JavaScript code loads. We recommend to [use a framework](/learn/start-a-new-react-project#building-with-a-full-featured-framework) that does this optimization out of the box. Depending on when it runs, this is called *server-side rendering (SSR)* or *static site generation (SSG).*

</Note>

<Gotcha>

**Apps using server rendering or static generation must call [`hydrateRoot`](/apis/react-dom/client/hydrateRoot) instead of `createRoot`.** React will then *hydrate* (reuse) the DOM nodes from your HTML instead of destroying and re-creating them.

</Gotcha>

---

### Rendering a page partially built with React {/*rendering-a-page-partially-built-with-react*/}

If your page [isn't fully built with React](/learn/add-react-to-a-website), you can call `createRoot` multiple times to create a root for each top-level piece of UI managed by React. You can display different content in each root by calling [`root.render`.](#root-render)

Here, two different React components are rendered into two DOM nodes defined in the `index.html` file:

<Sandpack>

```html public/index.html
<nav id="navigation"></nav>
<main>
  <p>This paragraph is not rendered by React (open index.html to verify).</p>
  <section id="comments"></section>
</main>
```

```js index.js active
import './styles.css';
import { createRoot } from 'react-dom/client';
import { Comments, Navigation } from './Components.js';

const navDomNode = document.getElementById('navigation');
const navRoot = createRoot(navDomNode); 
navRoot.render(<Navigation />);

const commentDomNode = document.getElementById('comments');
const commentRoot = createRoot(commentDomNode); 
commentRoot.render(<Comments />);
```

```js Components.js
export function Navigation() {
  return (
    <ul>
      <NavLink href="/">Home</NavLink>
      <NavLink href="/about">About</NavLink>
    </ul>
  );
}

function NavLink({ href, children }) {
  return (
    <li>
      <a href={href}>{children}</a>
    </li>
  );
}

export function Comments() {
  return (
    <>
      <h2>Comments</h2>
      <Comment text="Hello!" author="Sophie" />
      <Comment text="How are you?" author="Sunil" />
    </>
  );
}

function Comment({ text, author }) {
  return (
    <p>{text} — <i>{author}</i></p>
  );
}
```

```css
nav ul { padding: 0; margin: 0; }
nav ul li { display: inline-block; margin-right: 20px; }
```

</Sandpack>

You could also create a new DOM node with [`document.createElement()`](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement) and add it to the document manually.

```js
const domNode = document.createElement('div');
const root = createRoot(domNode); 
root.render(<Comment />);
document.body.appendChild(domNode); // You can add it anywhere in the document
```

To remove the React tree from the DOM node and clean up all the resources used by it, call [`root.unmount`.](#root-unmount)

```js
root.unmount();
```

This is mostly useful if your React components are inside an app written in a different framework.

---

### Updating a root component {/*updating-a-root-component*/}

You can call `render` more than once on the same root. As long as the component tree structure matches up with what was previously rendered, React will [preserve the state.](/learn/preserving-and-resetting-state) Notice how you can type in the input, which means that the updates from repeated `render` calls every second in this example are not destructive:

<Sandpack>

```js index.js active
import { createRoot } from 'react-dom/client';
import './styles.css';
import App from './App.js';

const root = createRoot(document.getElementById('root'));

let i = 0;
setInterval(() => {
  root.render(<App counter={i} />);
  i++;
}, 1000);
```

```js App.js
export default function App({counter}) {
  return (
    <>
      <h1>Hello, world! {counter}</h1>
      <input placeholder="Type something here" />
    </>
  );
}
```

</Sandpack>

It is uncommon to call `render` multiple times. Usually, you'll [update state](/apis/react/useState) inside one of the components instead.

---
## Reference {/*reference*/}

### `createRoot(domNode, options?)` {/*create-root*/}

Call `createRoot` to create a React root for displaying content inside a browser DOM element.

```js
const domNode = document.getElementById('root');
const root = createRoot(domNode);
```

React will create a root for the `domNode`, and take over managing the DOM inside it. After you've created a root, you need to call [`root.render`](#root-render) to display a React component inside of it:

```js
root.render(<App />);
```

An app fully built with React will usually only have one `createRoot` call for its root component. A page that uses "sprinkles" of React for parts of the page may have as many separate roots as needed.

[See examples above.](#usage)

#### Parameters {/*parameters*/}


* `domNode`: A [DOM element.](https://developer.mozilla.org/en-US/docs/Web/API/Element) React will create a root for this DOM element and allow you to call functions on the root, such as `render` to display rendered React content.

* **optional** `options`: A object contain options for this React root.

  * `onRecoverableError`: optional callback called when React automatically recovers from errors.
  * `identifierPrefix`: optional prefix React uses for IDs generated by [`useId`.](/apis/react/useId) Useful to avoid conflicts when using multiple roots on the same page.
#### Returns {/*returns*/}

`createRoot` returns an object with two methods: [`render`](#root-render) and [`unmount`.](#root-unmount)

#### Caveats {/*caveats*/}
* If your app is server-rendered, using `createRoot()` is not supported. Use [`hydrateRoot()`](/apis/react-dom/client/hydrateRoot) instead.
* You'll likely have only one `createRoot` call in your app. If you use a framework, it might do this call for you.
* When you want to render a piece of JSX in a different part of the DOM tree that isn't a child of your component (for example, a modal or a tooltip), use [`createPortal`](/apis/react-dom/createPortal) instead of `createRoot`.

---

### `root.render(reactNode)` {/*root-render*/}

Call `root.render` to display a piece of [JSX](/learn/writing-markup-with-jsx) ("React node") into the React root's browser DOM node.

```js
root.render(<App />);
```

React will display `<App />` in the `root`, and take over managing the DOM inside it.

[See examples above.](#usage)

#### Parameters {/*parameters*/}

* `reactNode`: A *React node* that you want to display. This will usually be a piece of JSX like `<App />`, but you can also pass a React element constructed with [`createElement()`](/apis/react/createElement), a string, a number, `null`, or `undefined`.


#### Returns {/*returns*/}

`root.render` returns `undefined`.

#### Caveats {/*caveats*/}

* The first time you call `root.render`, React will clear all the existing HTML content inside the React root before rendering the React component into it.

* If your root's DOM node contains HTML generated by React on the server or during the build, use [`hydrateRoot()`](/apis/react-dom/client/hydrateRoot) instead, which attaches the event handlers to the existing HTML.

* If you call `render` on the same root more than once, React will update the DOM as necessary to reflect the latest JSX you passed. React will decide which parts of the DOM can be reused and which need to be recreated by ["matching it up"](/learn/preserving-and-resetting-state) with the previously rendered tree. Calling `render` on the same root again is similar to calling the [`set` function](/apis/react/useState#setstate) on the root component: React avoids unnecessary DOM updates.

---

### `root.unmount()` {/*root-unmount*/}

Call `root.unmount` to destroy a rendered tree inside a React root.

```js
root.unmount();
```

An app fully built with React will usually not have any calls to `root.unmount`.

This is mostly useful if your React root's DOM node (or any of its ancestors) may get removed from the DOM by some other code. For example, imagine a jQuery tab panel that removes inactive tabs from the DOM. If a tab gets removed, everything inside it (including the React roots inside) would get removed from the DOM as well. In that case, you need to tell React to "stop" managing the removed root's content by calling `root.unmount`. Otherwise, the components inside the removed root won't know to clean up and free up global resources like subscriptions.

Calling `root.unmount` will unmount all the components in the root and "detach" React from the root DOM node, including removing any event handlers or state in the tree. 


#### Parameters {/*parameters*/}

`root.unmount` does not accept any parameters.


#### Returns {/*returns*/}

`root.unmount` returns `undefined`.

#### Caveats {/*caveats*/}

* Calling `root.unmount` will unmount all the components in the tree and "detach" React from the root DOM node.

* Once you call `root.unmount` you cannot call `root.render` again on the same root. Attempting to call `root.render` on an unmounted root will throw a "Cannot update an unmounted root" error. However, you can create a new root for the same DOM node after the previous root for that node has been unmounted.

---

## Troubleshooting {/*troubleshooting*/}

### I've created a root, but nothing is displayed {/*ive-created-a-root-but-nothing-is-displayed*/}

Make sure you haven't forgotten to actually *render* your app into the root:

```js {5}
import { createRoot } from 'react-dom/client';
import App from './App.js';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

Until you do that, nothing is displayed.

---

### I'm getting an error: "Target container is not a DOM element" {/*im-getting-an-error-target-container-is-not-a-dom-element*/}

This error means that whatever you're passing to `createRoot` is not a DOM node.

If you're not sure what's happening, try logging it:

```js {2}
const domNode = document.getElementById('root');
console.log(domNode); // ???
const root = createRoot(domNode);
root.render(<App />);
```

For example, if `domNode` is `null`, it means that [`getElementById`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById) returned `null`. This will happen if there is no node in the document with the given ID at the time of your call. There may be a few reasons for it:

1. The ID you're looking for might differ from the ID you used in the HTML file. Check for typos!
2. Your bundle's `<script>` tag cannot "see" any DOM nodes that appear *after* it in the HTML.

If you can't get it working, check out [Adding React to a Website](/learn/add-react-to-a-website) for a working example.

Another common way to get this error is to write `createRoot(<App />)` instead of `createRoot(domNode)`.

---

### I'm getting an error: "Functions are not valid as a React child." {/*im-getting-an-error-functions-are-not-valid-as-a-react-child*/}

This error means that whatever you're passing to `root.render` is not a React component.

This may happen if you call `root.render` with `Component` instead of `<Component />`:

```js {2,5}
// 🚩 Wrong: App is a function, not a Component.
root.render(App);

// ✅ Correct: <App /> is a component.
root.render(<App />);
````

Or if you pass a function to `root.render`, instead of the result of calling it:

```js {2,5}
// 🚩 Wrong: createApp is a function, not a component.
root.render(createApp);

// ✅ Correct: call createApp to return a component.
root.render(createApp());
```

If you can't get it working, check out [Adding React to a Website](/learn/add-react-to-a-website) for a working example.

---

### My server-rendered HTML gets re-created from scratch {/*my-server-rendered-html-gets-re-created-from-scratch*/}

If your app is server-rendered and includes the initial HTML generated by React, you might notice that creating a root and calling `root.render` deletes all that HTML, and then re-creates all the DOM nodes from scratch. This can be slower, resets focus and scroll positions, and may lose other user input.

Server-rendered apps must use [`hydrateRoot`](/apis/react-dom/client/hydrateRoot) instead of `createRoot`:

```js {1,4-7}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(
  document.getElementById('root'),
  <App />
);
```

Note that its API is different. In particular, usually there will be no further `root.render` call.
