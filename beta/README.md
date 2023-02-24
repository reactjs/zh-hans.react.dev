# [React 新的中文文档](https://beta.react.jscn.org/)

该仓库包含 [React 新的中文文档](https://beta.react.jscn.org/) 和该文档的源码，并由官方同步。

## 开始

### 前提准备

- Git
- Node：任意从 12.x 开始或者更高的版本
- Yarn：参见 [Yarn 网站上的安装说明](https://yarnpkg.com/lang/en/docs/install/)
- fork 该仓库（无论是什么样的贡献，都需要该操作）
- clone 这个仓库到本地

### 安装相关依赖

1. `cd reactjs.org`：进入该项目的根目录
2. `cd beta`：打开 beta 文件夹
3. `yarn`：下载网站需要的 npm 依赖

### 在本地运行

1. 确定你所在的文件夹是 `beta`。
2. `yarn dev`：运行开发服务器（由 [Next.js](https://nextjs.org/) 支持）
3. `open http://localhost:3000`：用你最爱的浏览器打开这个网站

## 如何贡献

### 指导

该文档被分成了几个部分，它们有不同的用处和目的。如果你计划做更多的工作，你可以发现熟悉[贡献指南](https://github.com/reactjs/zh-hans.reactjs.org/blob/main/CONTRIBUTING.md)对你会很有帮助。

### 创建一个分支

1. `git checkout main`：你可以在 `reactjs.org` 仓库中的任意文件夹运行这段命令，它会切换到 main 分支
2. `git pull origin main`：这将确保你的 main 分支保持最新
3. `git checkout -b the-name-of-my-branch`：这将创建一个新的分支，并切换到该分支（使用合适的名称替换 `the-name-of-my-branch`）

### 做出改变

1. 跟随[“在本地运行”](#在本地运行)的指导
2. 保存改变后的文件，并在浏览器检查它
   - 在 `src` 目录中改变 React 组件将会立刻更新（热更新）该项目。
   - 在 `content` 目录中改变 markdown 文件将也会立刻得到更新。
   - 如果你对 plugins 文件夹中的内容做出改变，你需要去移除 `.cache` 目录并重新开始这个服务。

### 测试你的改变

1. 如果可以，请在桌面和移动设备上测试最新版本在常见浏览器中的任何视觉变化。
2. 从 `beta` 文件夹中运行 `yarn check-all`。（这将运行 Prettier、ESLint 以及验证 TypeScript 的类型。）

### 提交它

1. `git add -A && git commit -m "My message"`：暂存以及提交你的改变（使用其它提交信息替换 `My message`，例如 `Fix header logo on Android`）
2. `git push -u my-fork-name the-name-of-my-branch`
3. 进入 [zh-hans.reactjs.org 仓库](https://github.com/reactjs/zh-hans.reactjs.org)，你将看到你最新 push 的分支。
4. 跟随 GitHub 的指导。
5. 如果可以的话，包括视觉变化的屏幕截图。在你将更改推送到 GitHub 之后，会触发预构建。

### 中文翻译指南

在这里，我们会介绍一些你在翻译过程中的注意点：

- 对于 React 简体中文应该如何排版，请查看：[React 简体中文本地化翻译指南](https://github.com/reactjs/zh-hans.reactjs.org/wiki/React-%E4%B8%AD%E6%96%87%E6%96%87%E6%A1%A3%E8%AF%91%E6%96%87%E6%8E%92%E7%89%88%E6%8C%87%E5%8D%97)。
- 如果你想查看 React 专有名词的中英文对照表，请查看：[React 术语表](https://github.com/reactjs/zh-hans.reactjs.org/issues/2)。

## Troubleshooting

- `yarn reset` to clear the local cache

## License

Content submitted to [reactjs.org](https://reactjs.org/) is CC-BY-4.0 licensed, as found in the [LICENSE-DOCS.md](https://github.com/open-source-explorer/reactjs.org/blob/master/LICENSE-DOCS.md) file.
