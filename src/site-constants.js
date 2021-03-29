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
const version = '17.0.1';
=======
const urlRoot = 'https://reactjs.org';
const version = '17.0.2';
>>>>>>> c970f75a0ac3513f50e7a4989757c50cde0b7396
const babelURL = 'https://unpkg.com/babel-standalone@6.26.0/babel.min.js';

export {babelURL, urlRoot, version};
