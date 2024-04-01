---
title: 编辑器设置
translators:
  - dahui4dev
  - QC-L
---

<Intro>

正确的编辑器配置可以开发事半功倍。并且还可以在编码时帮你提示错误！如果这是你第一次配置编辑器，或者想对现有编辑器进行调整，我们有一些建议可供参考。

</Intro>

<YouWillLearn>

* 最受欢迎的编辑器是哪些
* 如何自动格式化你的代码

</YouWillLearn>

## 你的编辑器 {/*your-editor*/}

[VS Code](https://code.visualstudio.com/) 是现如今最流行的编辑器之一。它拥有庞大的扩展市场，同时可以与 GitHub 等流行服务完美集成。下面列出的大多数功能都可以作为扩展添加到 VS Code 中，使其具有极高的可配置性！

React 社区中其他较为流行的文本编辑器包括：

* [WebStorm](https://www.jetbrains.com/webstorm/) 是专为 JavaScript 设计的集成开发环境。
* [Sublime Text](https://www.sublimetext.com/) 支持 JSX 和 TypeScript，内置[语法高亮](https://stackoverflow.com/a/70960574/458193)和代码自动补全功能。
* [Vim](https://www.vim.org/) 是一个高度可配置的文本编辑器，可以非常高效地创建和更改任何类型的文本。它作为 “vi” 包含在大多数 UNIX 系统和 Apple OS X 中。

## 推荐的文本编辑器功能 {/*recommended-text-editor-features*/}

有些编辑器内置了这些功能，但某些编辑器可能需要添加扩展。你需要确认你的编辑器支持了哪些能力。

### 代码检查（Linting） {/*linting*/}

代码检查（Code linters）可以在你编写代码时，发现代码中的问题，以帮你尽早修复。[ESLint](https://eslint.org/) 是一款流行且开源的 JavaScript 代码检查工具。

* [使用 React 的推荐配置安装 ESLint](https://www.npmjs.com/package/eslint-config-react-app) （确保你已经安装了 [Node](https://nodejs.org/en/download/current/)）
* [安装 VSCode 中的官方 ESLint 扩展](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

**请确保你已经为你的项目启用了 [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) 规则**。这在 React 项目中是必备的，同时能帮助你及早的捕获较为严重的 bug。我们推荐的 [`eslint-config-react-app`](https://www.npmjs.com/package/eslint-config-react-app) preset 中已经集成了该规则。

### 格式化 {/*formatting*/}

与其他贡献者共享代码时，你最不想做的事就是争论代码缩进应该使用 [tabs 还是空格](https://www.google.com/search?q=tabs+vs+spaces)！幸好，[Prettier](https://prettier.io/) 会根据预设配置的规则重新格式化代码，以保证代码整洁。运行 Prettier，你的所有 tabs 都将转换为空格，同时缩进、引号等也都将根据你的配置而改变。理想状态下，当你保存文件时，Prettier 会自动执行格式化操作。

你可以为 [VSCode 安装 Prettier 扩展](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)，具体步骤如下：

1. 启动 VS Code
2. 使用快速打开（使用快捷键 `Ctrl/Cmd + P`）
3. 粘贴 `ext install esbenp.prettier-vscode`
4. 按回车键

#### 保存并自动格式化 {/*formatting-on-save*/}

理想情况下，你应该在每次保存时自动格式化代码。VS Code 就包含该配置!

1. 在 VS Code, 按快捷键 `Ctrl/Cmd + Shift + P`.
2. 输入 "settings"
3. 按回车键
4. 在搜索栏, 输入 "format on save"
5. 确保勾选 "format on save" 选项！

> 如果你的 ESLint 预设包含格式化规则，它们可能会与 Prettier 发生冲突。我们建议使用[`eslint-config-prettier`](https://github.com/prettier/eslint-config-prettier) 禁用你 ESLint 预设中的所有格式化规则，这样 ESLint 就只用于捕捉逻辑错误。如果你想在合并 PR 前强制执行文件的格式化，请在你的 CI 中使用 [`prettier --check`](https://prettier.io/docs/en/cli.html#--check) 命令。
