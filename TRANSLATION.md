# React 中文文档翻译指南

下面我们会从 [翻译注意事项](#翻译注意事项) 以及 [翻译流程](#翻译流程) 两个方面开始介绍。

关于翻译的问题和反馈，请移步至 [这个讨论](https://github.com/reactjs/zh-hans.react.dev/discussions/1089)。

如果你有除了翻译内容以外的贡献，请移步到 [英文文档仓库](https://github.com/reactjs/react.dev/tree/main/README.md)。

## 翻译注意事项

- 在翻译的过程中，我们需要遵循 [React 中文文档译文规范](https://github.com/reactjs/zh-hans.react.dev/wiki/React-Translation-Guide)。
- 对于翻译中的专有名词，参见 [术语表](https://github.com/reactjs/zh-hans.react.dev/issues/2)。

## 翻译流程

1. 阅读 [翻译注意事项](#翻译注意事项)

~~2. 挑选你想要翻译的文章并进行 [任务认领](https://github.com/reactjs/zh-hans.react.dev/issues/602)~~ （**目前翻译工作大多数已经完成，无需在这里认领，请留意新提出的 issue，在那里进行认领**）

3. 你可能需要设置一些必要的开发环境，参见 [前提准备](#前提准备)
4. 准备就绪，你就可以进行 [翻译工作](#开始翻译)，翻译工作包括切换分支、内容修改和代码测试
5. 需要将你的改变提交到 GitHub 并创建 Pull Request，参见 [提交和推送](#提交和推送)
6. 审查人员会审核你的 Pull Request，当两人以上通过该 Pull Request 时，你的翻译将被合并到仓库中

注：在以前，我们还有一份更为详细的 [翻译流程说明](https://github.com/reactjs/zh-hans.react.dev/issues/603)，可以供你参考

### 前提准备

- Git
- Node：任意从 12.x 开始或者更高的版本
- Yarn：参见 [Yarn 网站上的安装说明](https://yarnpkg.com/lang/en/docs/install/)
- fork 该仓库（无论是什么样的贡献，都需要该操作）
- clone 这个仓库到本地：`git clone my-fork-name`

#### 安装相关依赖

1. 进入该项目的根目录
2. `yarn`：下载网站需要的 npm 依赖

#### 在本地运行

1. `yarn dev`：运行开发服务器（由 [Next.js](https://nextjs.org/) 支持）
2. `open http://localhost:3000`：用你最爱的浏览器打开这个网站

### 开始翻译

#### 切换分支

1. `git checkout main`：你可以在仓库中的任意文件夹运行这段命令，它会切换到 main 分支
2. `git pull origin main`：这将确保你的 main 分支保持最新
3. `git checkout -b the-name-of-my-branch`：这将创建一个新的分支，并切换到该分支（使用合适的名称替换 `the-name-of-my-branch`）

#### 审查你的改变

> 在你为该项目做出贡献后，你可以先在本地审查你的贡献。

1. 如果可以，请在桌面和移动设备上测试最新版本在常见浏览器中的任何视觉变化。
2. 运行 `yarn check-all`。（这将运行 Prettier、ESLint 以及验证 TypeScript 的类型）。

### 提交和推送

1. `git add -A && git commit -m "My message"`：暂存以及提交你的改变（使用其它提交信息替换 `My message`，例如 `Fix header logo on Android`）
2. `git push -u my-fork-name the-name-of-my-branch`
3. 进入 [zh-hans.react.dev 仓库](https://github.com/reactjs/zh-hans.react.dev)，你将看到你最新 push 的分支。
4. 跟随 [GitHub 的指南](https://docs.github.com/zh/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request?tool=webui) 创建 Pull Request。
5. 在你完成以上步骤之后，该仓库会触发预构建，此时你可以查看你的改变是否符合预期。
