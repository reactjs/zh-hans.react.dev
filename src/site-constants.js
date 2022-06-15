/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * @providesModule site-constants
 * @flow
 */

// NOTE: We can't just use `location.toString()` because when we are rendering
// the SSR part in node.js we won't have a proper location.
<<<<<<< HEAD
const urlRoot = 'https://zh-hans.reactjs.org';
const version = '18.1.0';
=======
const urlRoot = 'https://reactjs.org';
const version = '18.2.0';
>>>>>>> 763d57bb4e1af8d8b46fe5e74deb98e1dc19accb
const babelURL = 'https://unpkg.com/babel-standalone@6.26.0/babel.min.js';

export {babelURL, urlRoot, version};
