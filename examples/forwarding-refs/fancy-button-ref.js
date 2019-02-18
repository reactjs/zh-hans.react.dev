import FancyButton from './FancyButton';

// highlight-next-line
const ref = React.createRef();

// 我们导入的 FancyButton 组件是高阶组件（HOC）LogProps。
// 尽管渲染的输出将是一样的，
// 但我们的 ref 将指向 LogProps 而不是 内部的 FancyButton 组件！
// 这意味着我们不能这样调用例如 ref.current.focus() 这样的方法
// highlight-range{4}
<FancyButton
  label="Click Me"
  handleClick={handleClick}
  ref={ref}
/>;
