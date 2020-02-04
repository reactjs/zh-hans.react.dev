// Before
class ExampleComponent extends React.Component {
  // highlight-range{1-10}
  componentWillMount() {
    this.setState({
      subscribedValue: this.props.dataSource.value,
    });

    // 这是不安全的，它会导致内存泄漏！
    this.props.dataSource.subscribe(
      this.handleSubscriptionChange
    );
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
