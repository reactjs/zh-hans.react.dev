// After
class ExampleComponent extends React.Component {
  state = {
    externalData: null,
  };

  // highlight-range{1-13}
  static getDerivedStateFromProps(props, state) {
    // 保存 prevId 在 state 中，以便我们在 props 变化时进行对比。
    // 清除之前加载的数据（这样我们就不会渲染旧的内容）。
    if (props.id !== state.prevId) {
      return {
        externalData: null,
        prevId: props.id,
      };
    }

    // 无需更新 state
    return null;
  }

  componentDidMount() {
    this._loadAsyncData(this.props.id);
  }

  // highlight-range{1-5}
  componentDidUpdate(prevProps, prevState) {
    if (this.state.externalData === null) {
      this._loadAsyncData(this.props.id);
    }
  }

  componentWillUnmount() {
    if (this._asyncRequest) {
      this._asyncRequest.cancel();
    }
  }

  render() {
    if (this.state.externalData === null) {
      // 渲染加载状态 ...
    } else {
      // 渲染真实 UI ...
    }
  }

  _loadAsyncData(id) {
    this._asyncRequest = loadMyAsyncData(id).then(
      externalData => {
        this._asyncRequest = null;
        this.setState({externalData});
      }
    );
  }
}
