# [React 新的中文文档](https://beta.react.jscn.org/)

该仓库包含 [React 新的中文文档](https://beta.react.jscn.org/)和该文档的源码，并由官方同步。

## 让我们开始运行它

### 前提准备

- Git
- Node：任意从 12.x 开始或者更高的版本
- Yarn：参见 [Yarn 网站上的安装说明](https://yarnpkg.com/lang/en/docs/install/)
- 请 fork 该仓库（任意的贡献者）
- [将 fork 后的仓库拉取到本地，然后基于 main 分支拉取一个新的分支（名字自取）](#创建一个分支)

### 下载

1. `cd reactjs.org`：进入该项目的根目录
2. `cd beta`：打开 beta 文件夹
3. `yarn`：下载网站需要的 npm 依赖

### 在本地运行

1. 确定你所在的文件夹是 `beta`。
2. `yarn dev`：运行开发服务器（由 [Next.js](https://nextjs.org/) 支持）
3. `open http://localhost:3000`：用你最爱的浏览器打开这个网站

## 如何贡献

### 指导

The documentation is divided into several sections with a different tone and purpose. If you plan to write more than a few sentences, you might find it helpful to get familiar with the [contributing guidelines](https://github.com/reactjs/reactjs.org/blob/main/CONTRIBUTING.md#guidelines-for-text) for the appropriate sections.

### 创建一个分支

1. `git checkout main`：你可以在 `reactjs.org` 仓库中的任意文件夹运行这段命令，它会切换到 main 分支
2. `git pull origin main`：这将确保你的 main 分支保持最新
3. `git checkout -b the-name-of-my-branch`：这将创建一个新的分支，并切换到该分支（使用合适的名称替换 `the-name-of-my-branch`）

### 做出改变

1. 跟随[“在本地运行”](#在本地运行)的指导
2. 保存改变后的文件，并在浏览器检查它
   - 在 `src` 目录中改变 React 组件将会立刻更新（热更新）该项目。
   - 在 `content` 目录中改变 markdown 文件将也会立刻得到更新。
   - If working with plugins, you may need to remove the `.cache` directory and restart the server

### 测试你的改变

1. 如果可以，请在桌面和移动设备上测试最新版本在常见浏览器中的任何视觉变化。
2. 从 `beta` 文件夹中运行 `yarn check-all`。（这将运行 Prettier、ESLint 以及验证 TypeScript 的类型。）

### 提交它

1. `git add -A && git commit -m "My message"`：暂存以及提交你的改变（使用其它 commit 信息替换 `My message`，例如 `Fix header logo on Android`）
2. `git push -u my-fork-name the-name-of-my-branch`
3. 进入 [zh-hans.reactjs.org 仓库](https://github.com/reactjs/zh-hans.reactjs.org)，你将看到你最新 push 的分支。
4. 跟随 GitHub 的指导。
5. 如果可以的话，包括视觉变化的屏幕截图。在你将更改推送到 GitHub 之后，会触发预构建。

## 中文翻译指南

## Troubleshooting

- `yarn reset` to clear the local cache

## License

Content submitted to [reactjs.org](https://reactjs.org/) is CC-BY-4.0 licensed, as found in the [LICENSE-DOCS.md](https://github.com/open-source-explorer/reactjs.org/blob/master/LICENSE-DOCS.md) file.
