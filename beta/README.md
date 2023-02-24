# [React 新中文文档翻翻译指南](https://github.com/reactjs/zh-hans.reactjs.org/blob/main/beta/README.md)

该仓库包含 [React 新中文文档](https://beta.react.jscn.org/) 和该文档的源码，并由官方同步。

下面我们会从[翻译流程](#翻译流程)以及[翻译注意事项](#中文翻译注意事项)两个方面开始介绍。如果你有除了翻译内容以外的贡献，请移步到[英文文档仓库](https://github.com/reactjs/reactjs.org/tree/main/beta/README.md)。

## 翻译流程

1. 挑选你想要翻译的文章，这些文章你可以[在这里](https://github.com/reactjs/reactjs.org/issues/4135)找到它们
2. 准备阶段，需要 fork 以及 clone 仓库到本地，你可以从[【前提准备】](#前提准备)中了解这个步骤
3. 开始阶段，需要创建一个独立的分支并完成你的改变，你可以从[【创建一个分支】](#创建一个分支)中了解这个步骤
4. 提交阶段，需要将你的改变提交到 GitHub，你可以从[【提交】](#提交)中了解这个步骤
5. 审查阶段，此时会有专人审查该 Pull Request，当两人以上通过该 Pull Request 时，你的翻译将被合并到仓库中

### 前提准备

- Git
- Node：任意从 12.x 开始或者更高的版本
- Yarn：参见 [Yarn 网站上的安装说明](https://yarnpkg.com/lang/en/docs/install/)
- fork 该仓库（无论是什么样的贡献，都需要该操作）
- clone 这个仓库到本地：`git clone my-fork-name`

#### 安装相关依赖

1. `cd reactjs.org`：进入该项目的根目录
2. `cd beta`：打开 beta 文件夹
3. `yarn`：下载网站需要的 npm 依赖

#### 在本地运行

1. 确定你所在的文件夹是 `beta`。
2. `yarn dev`：运行开发服务器（由 [Next.js](https://nextjs.org/) 支持）
3. `open http://localhost:3000`：用你最爱的浏览器打开这个网站

### 创建一个分支

1. `git checkout main`：你可以在 `reactjs.org` 仓库中的任意文件夹运行这段命令，它会切换到 main 分支
2. `git pull origin main`：这将确保你的 main 分支保持最新
3. `git checkout -b the-name-of-my-branch`：这将创建一个新的分支，并切换到该分支（使用合适的名称替换 `the-name-of-my-branch`）

#### 审查你的改变

> 在你为该项目做出贡献后，你可以先在本地审查你的贡献。

1. 如果可以，请在桌面和移动设备上测试最新版本在常见浏览器中的任何视觉变化。
2. 从 `beta` 文件夹中运行 `yarn check-all`。（这将运行 Prettier、ESLint 以及验证 TypeScript 的类型。）

### 提交

1. `git add -A && git commit -m "My message"`：暂存以及提交你的改变（使用其它提交信息替换 `My message`，例如 `Fix header logo on Android`）
2. `git push -u my-fork-name the-name-of-my-branch`
3. 进入 [zh-hans.reactjs.org 仓库](https://github.com/reactjs/zh-hans.reactjs.org)，你将看到你最新 push 的分支。
4. 跟随 GitHub 的指导。
5. 如果可以的话，包括视觉变化的屏幕截图。在你将更改推送到 GitHub 之后，会触发预构建。

## 中文翻译注意事项

在这里，我们会介绍一些你需要在翻译过程中的注意点：

- [排版](https://github.com/reactjs/zh-hans.reactjs.org/wiki/React-%E4%B8%AD%E6%96%87%E6%96%87%E6%A1%A3%E8%AF%91%E6%96%87%E6%8E%92%E7%89%88%E6%8C%87%E5%8D%97)：为什么需要使用它🤔？因为中文的字符和英文的字符有很大的差别，为了使内容更好的呈现给读者，我们需要一套尽可能完美的排版规范。
  - 对于 React 简体中文应该如何排版，请查看：[React 简体中文本地化翻译指南](https://github.com/reactjs/zh-hans.reactjs.org/wiki/React-%E4%B8%AD%E6%96%87%E6%96%87%E6%A1%A3%E8%AF%91%E6%96%87%E6%8E%92%E7%89%88%E6%8C%87%E5%8D%97)。
- [术语表](https://github.com/reactjs/zh-hans.reactjs.org/issues/2)：为什么需要使用它🤔？由于一些专有名词在 React 中有着特殊的含义，我们会在术语表中呈现，更好地帮助译者去理解以及翻译。（当然，译者也可以去补充）
  - 如果你想查看 React 专有名词的中英文对照表，请查看：[React 术语表](https://github.com/reactjs/zh-hans.reactjs.org/issues/2)。

---

# reactjs.org

This repo contains the source code and documentation powering [beta.reactjs.org](https://beta.reactjs.org/).


## Getting started

### Prerequisites

1. Git
1. Node: any 12.x version starting with v12.0.0 or greater
1. Yarn: See [Yarn website for installation instructions](https://yarnpkg.com/lang/en/docs/install/)
1. A fork of the repo (for any contributions)
1. A clone of the [reactjs.org repo](https://github.com/reactjs/reactjs.org) on your local machine

### Installation

1. `cd reactjs.org` to go into the project root
1. `cd beta` to open the beta website
3. `yarn` to install the website's npm dependencies

### Running locally

1. Make sure you're in the `beta` folder
1. `yarn dev` to start the development server (powered by [Next.js](https://nextjs.org/))
1. `open http://localhost:3000` to open the site in your favorite browser

## Contributing

### Guidelines

The documentation is divided into several sections with a different tone and purpose. If you plan to write more than a few sentences, you might find it helpful to get familiar with the [contributing guidelines](https://github.com/reactjs/reactjs.org/blob/main/CONTRIBUTING.md#guidelines-for-text) for the appropriate sections.

### Create a branch

1. `git checkout main` from any folder in your local `reactjs.org` repository
1. `git pull origin main` to ensure you have the latest main code
1. `git checkout -b the-name-of-my-branch` (replacing `the-name-of-my-branch` with a suitable name) to create a branch

### Make the change

1. Follow the ["Running locally"](#running-locally) instructions
1. Save the files and check in the browser
  1. Changes to React components in `src` will hot-reload
  1. Changes to markdown files in `content` will hot-reload
  1. If working with plugins, you may need to remove the `.cache` directory and restart the server

### Test the change

1. If possible, test any visual changes in all latest versions of common browsers, on both desktop and mobile.
2. Run `yarn check-all` from the `beta` folder. (This will run Prettier, ESLint and validate types.)

### Push it

1. `git add -A && git commit -m "My message"` (replacing `My message` with a commit message, such as `Fix header logo on Android`) to stage and commit your changes
1. `git push my-fork-name the-name-of-my-branch`
1. Go to the [reactjs.org repo](https://github.com/reactjs/reactjs.org) and you should see recently pushed branches.
1. Follow GitHub's instructions.
1. If possible, include screenshots of visual changes. A preview build is triggered after your changes are pushed to GitHub.

## Translation

If you are interested in translating `reactjs.org`, please see the current translation efforts at [translations.reactjs.org](https://translations.reactjs.org/).


If your language does not have a translation and you would like to create one, please follow the instructions at [reactjs.org Translations](https://github.com/reactjs/reactjs.org-translation#translating-reactjsorg).

## Troubleshooting

- `yarn reset` to clear the local cache

## License
Content submitted to [reactjs.org](https://reactjs.org/) is CC-BY-4.0 licensed, as found in the [LICENSE-DOCS.md](https://github.com/open-source-explorer/reactjs.org/blob/master/LICENSE-DOCS.md) file.
