---
title: React 开发者工具
translators:
  - dahui4dev
---

<Intro>

使用 React 开发者工具检查 React [components](/learn/your-first-component)，编辑 [props](/learn/passing-props-to-a-component) 和 [state](/learn/state-a-components-memory)，并识别性能问题。

</Intro>

<YouWillLearn>

* 如何安装 React 开发者工具

</YouWillLearn>

## 浏览器扩展 {/*browser-extension*/}

调试 React 构建的网站最简单的办法就是安装 React 开发者工具浏览器扩展。它可用于几种流行的浏览器：

* [安装 **Chrome** 扩展](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
* [安装 **Firefox** 扩展](https://addons.mozilla.org/zh-CN/firefox/addon/react-devtools/)
* [安装 **Edge** 扩展](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil)

现在，如果你访问一个用 **React 构建** 的网站，你将看到 **Components** 和 **Profiler** 面板。

![React Developer Tools extension](/images/docs/react-devtools-extension.png)

### Safari 和其他浏览器 {/*safari-and-other-browsers*/}
为其他浏览器（比如，Safari），安装 [`react-devtools`](https://www.npmjs.com/package/react-devtools) npm 包:
```bash
# Yarn
yarn global add react-devtools

# Npm
npm install -g react-devtools
```

接下来从终端打开开发者工具：
```bash
react-devtools
```

然后通过将以下 `<script>` 标签添加到你网站的 `<head>` 开头来连接你的网站： 
```html {3}
<html>
  <head>
    <script src="http://localhost:8097"></script>
```

现在在浏览器里刷新你的网站，你可以在开发者工具里查看它。

![React Developer Tools standalone](/images/docs/react-devtools-standalone.png)

## 移动端（React Native） {/*mobile-react-native*/}
React 开发者工具同样可检查用 [React Native](https://reactnative.dev/) 构建的应用程序。

使用 React 开发者工具最简单的办法就是全局安装它：
```bash
# Yarn
yarn global add react-devtools

# Npm
npm install -g react-devtools
```

接下来从终端打开开发者工具：
```bash
react-devtools
```

它应该可以连接到任何正在运行的本地 React Native 应用程序。

> 如果几秒钟后开发者工具未连接，请尝试重新加载应用程序。

[了解有关调试 React Native 的更多信息](https://reactnative.dev/docs/debugging)。
