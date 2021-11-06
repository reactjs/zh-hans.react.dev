class ScrollingList extends React.Component {
  listRef = null;
  previousScrollOffset = null;

  // highlight-range{1-8}
  componentWillUpdate(nextProps, nextState) {
    // 我们正在向列表中添加新项吗？
    // 捕获滚动位置，以便我们稍后可以调整滚动位置。
    if (this.props.list.length < nextProps.list.length) {
      this.previousScrollOffset =
        this.listRef.scrollHeight - this.listRef.scrollTop;
    }
  }

  // highlight-range{1-10}
  componentDidUpdate(prevProps, prevState) {
    // 如果我们刚刚添加了新项，并且设置了 previousScrollOffset。
    // 调整滚动位置，以便这些新项不会把旧项挤出视图。
    if (this.previousScrollOffset !== null) {
      this.listRef.scrollTop =
        this.listRef.scrollHeight -
        this.previousScrollOffset;
      this.previousScrollOffset = null;
    }
  }

  render() {
    return (
      <div ref={this.setListRef}>{/* ...内容... */}</div>
    );
  }

  setListRef = ref => {
    this.listRef = ref;
  };
}
