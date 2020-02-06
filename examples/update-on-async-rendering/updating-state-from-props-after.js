// After
class ExampleComponent extends React.Component {
  // 在构造函数中初始化 state，
  // 或者使用属性初始化器。
  // highlight-range{1-4}
  state = {
    isScrollingDown: false,
    lastRow: null,
  };

  // highlight-range{1-7}
  static getDerivedStateFromProps(props, state) {
    if (props.currentRow !== state.lastRow) {
      return {
        isScrollingDown: props.currentRow > state.lastRow,
        lastRow: props.currentRow,
      };
    }

    // 返回 null 表示无需更新 state。
    return null;
  }
}
