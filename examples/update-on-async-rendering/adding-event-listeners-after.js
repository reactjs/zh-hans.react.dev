// After
class ExampleComponent extends React.Component {
  // highlight-range{1-3}
  state = {
    subscribedValue: this.props.dataSource.value,
  };
  // highlight-line
  // highlight-range{1-18}
  componentDidMount() {
    // 事件监听器只有在挂载后添加才是安全的，
    // 因此，如果挂载中断或错误，它们不会泄漏。
    this.props.dataSource.subscribe(
      this.handleSubscriptionChange
    );

    // 外部值可能在渲染和挂载期间改变，
    // 在某些情况下，处理这种情况很重要。
    if (
      this.state.subscribedValue !==
      this.props.dataSource.value
    ) {
      this.setState({
        subscribedValue: this.props.dataSource.value,
      });
    }
  }

  componentWillUnmount() {
    this.props.dataSource.unsubscribe(
      this.handleSubscriptionChange
    );
  }

  handleSubscriptionChange = dataSource => {
    this.setState({
      subscribedValue: dataSource.value,
    });
  };
}
