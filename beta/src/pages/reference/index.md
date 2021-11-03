---
title: React APIs
layout: API
---

<Intro>

The React package contains all the APIs necessary to define and use [components](/learn/your-first-component).

</Intro>

## Installation

It is available as [`react`](https://www.npmjs.com/package/react) on npm. You can also [add React to the page as a `<script>` tag](/learn/add-react-to-a-website).

<PackageImport>

<TerminalBlock>

npm install react

</TerminalBlock>

```js
// Importing a specific API:
import { useState } from 'react';

// Importing all APIs together:
import * as React from 'react';
```

</PackageImport>

If you use React on the web, you'll also need the same version of [ReactDOM](/api/reactdom).

## Exports

<YouWillLearnCard title="useState" path="/reference/usestate">

A React Hook that lets a component "remember" some information (called state).

</YouWillLearnCard>

This section is incomplete and is still being written!
