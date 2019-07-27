import React from 'react';
// highlight-next-line
import {polyfill} from 'react-lifecycles-compat';

class ExampleComponent extends React.Component {
  // highlight-next-line
  static getDerivedStateFromProps(props, state) {
    // 此处为 state 更新的逻辑 ...
  }
}

// polyfill 你的组件，以便兼容旧版本的 React：
// highlight-next-line
polyfill(ExampleComponent);

export default ExampleComponent;
