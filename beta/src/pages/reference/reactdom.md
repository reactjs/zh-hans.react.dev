---
title: ReactDOM API
layout: API
---

<Intro>

The ReactDOM package lets you render React components on a webpage.

</Intro>

Typically, you will use ReactDOM at the top level of your app to display your components. You will either use it directly or a [framework](/learn/start-a-new-react-project#building-with-react-and-a-framework) may do it for you. Most of your components should *not* need to import this module.

## Installation

<PackageImport>

<TerminalBlock>

npm install react-dom

</TerminalBlock>

```js
// Importing a specific API:
import { render } from 'react-dom';

// Importing all APIs together:
import * as ReactDOM from 'react';
```

</PackageImport>

You'll also need to install the same version of [React](/api/).

## Browser Support

ReactDOM supports all popular browsers, including Internet Explorer 9 and above. [Some polyfills are required](http://todo%20link%20to%20js%20environment%20requirements/) for older browsers such as IE 9 and IE 10.

## Exports

<YouWillLearnCard title="render" path="/reference/render">

Renders a piece of JSX ("React element") into a browser DOM container node.

</YouWillLearnCard>

This section is incomplete and is still being written!
