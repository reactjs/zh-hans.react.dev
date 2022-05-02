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
const version = '18.0.0';
=======
const urlRoot = 'https://reactjs.org';
const version = '18.1.0';
>>>>>>> 5f3a9756e00e256735a5f52df19b403d8fdd3a9d
const babelURL = 'https://unpkg.com/babel-standalone@6.26.0/babel.min.js';

export {babelURL, urlRoot, version};
