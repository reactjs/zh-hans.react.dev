class ScrollingList extends React.Component {
  listRef = null;

  // highlight-range{1-10}
  getSnapshotBeforeUpdate(prevProps, prevState) {
    // 我们正在向列表中添加新项吗？
    // 捕获滚动位置，以便我们稍后可以调整滚动位置。
    if (prevProps.list.length < this.props.list.length) {
      return (
        this.listRef.scrollHeight - this.listRef.scrollTop
      );
    }
    return null;
  }

  // highlight-range{1-8}
  componentDidUpdate(prevProps, prevState, snapshot) {
    // 如果我们刚刚添加了新项，并且有了快照值。
    // 调整滚动位置，以便这些新项不会把旧项挤出视图。
    // （此处的快照是从 getSnapshotBeforeUpdate 返回的值）
    if (snapshot !== null) {
      this.listRef.scrollTop =
        this.listRef.scrollHeight - snapshot;
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
