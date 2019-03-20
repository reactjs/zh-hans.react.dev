// 确保传递给 createContext 的默认值数据结构是调用的组件（consumers）所能匹配的！
// highlight-range{2-3}
export const ThemeContext = React.createContext({
  theme: themes.dark,
  toggleTheme: () => {},
});
