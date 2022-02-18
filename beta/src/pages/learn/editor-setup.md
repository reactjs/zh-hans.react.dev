---
title: 编辑器设置
translators:
  - dahui4dev
  - QC-L
---

<Intro>

正确的编辑器配置可以开发事半功倍。并且还可以在编码时帮你提示错误！如果这是你第一次配置编辑器，或者想对现有编辑器进行调整，我们有一些建议可供参考。

</Intro>

## 你的编辑器 {/*your-editor*/}

[VS Code](https://code.visualstudio.com/) 是现如今最流行的编辑器之一。它拥有庞大的扩展市场，同时可以与 GitHub 等流行服务完美集成。下面列出的大多数功能都可以作为扩展添加到 VS Code 中，使其具有极高的可配置性！

React 社区中其他较为流行的文本编辑器包括：

<<<<<<< HEAD
* [WebStorm](https://www.jetbrains.com/webstorm/) — 专为 JavaScript 设计的集成开发环境。
* [Sublime Text](https://www.sublimetext.com/) — 支持 JSX 和 TypeScript，内置语法高亮和代码自动补全功能。
* [Vim](https://www.vim.org/) — 一个高度可配置的文本编辑器，可以非常高效地创建和更改任何类型的文本。它作为 “vi” 包含在大多数 UNIX 系统和 Apple OS X 中。
=======
* [WebStorm](https://www.jetbrains.com/webstorm/)—an integrated development environment designed specifically for JavaScript.
* [Sublime Text](https://www.sublimetext.com/)—has support for JSX and TypeScript, [syntax highlighting](https://stackoverflow.com/a/70960574/458193) and autocomplete built in.
* [Vim](https://www.vim.org/)—a highly configurable text editor built to make creating and changing any kind of text very efficient. It is included as "vi" with most UNIX systems and with Apple OS X.
>>>>>>> 5b8a720ece8dc7e055b6ff16ef409ccbc1f3ab4d

## 推荐的文本编辑器功能 {/*recommended-text-editor-features*/}

有些编辑器内置了这些功能，但某些编辑器可能需要添加扩展。你需要确认你的编辑器支持了哪些能力。

### 代码检查（Linting） {/*linting*/}

代码检查（Code linters）可以在你编写代码时，发现代码中的问题，以帮你尽早修复。[ESLint](https://eslint.org/) 是一款流行且开源的 JavaScript 代码检查工具。

* [使用 React 的推荐配置安装 ESLint](https://www.npmjs.com/package/eslint-config-react-app) （确保你已经安装了 [Node](https://nodejs.org/en/download/current/)）
* [安装 VSCode 中的官方 ESLint 扩展](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

### 格式化 {/*formatting*/}

与其他贡献者共享代码时，你最不想做的事就是争论代码缩进应该使用 [tabs 还是空格](https://www.google.com/search?q=tabs+vs+spaces)！幸好，[Prettier](https://prettier.io/) 会根据预设配置的规则重新格式化代码，以保证代码整洁。运行 Prettier，你的所有 tabs 都将转换为空格，同时缩进、引号等也都将根据你的配置而改变。理想状态下，当你保存文件时，Prettier 会自动执行格式化操作。

你可以为 [VSCode 安装 Prettier 扩展](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)，具体步骤如下：

1. 启动 VS Code
2. 使用快速打开（使用快捷键 `CTRL/CMD + P`）
3. 粘贴 `ext install esbenp.prettier-vscode`
4. 按回车键

#### 保存并自动格式化 {/*formatting-on-save*/}

理想情况下，你应该在每次保存时自动格式化代码。VS Code 就包含该配置!

1. 在 VS Code, 按快捷键 `CTRL/CMD + SHIFT + P`.
2. 输入 "settings"
3. 按回车键
4. 在搜索栏, 输入 "format on save"
5. 确保勾选 "format on save" 选项！

> Prettier 有时会与其他 linter 发生冲突。但通常有一个方法可以让它们很好地一起运行。例如，如果你需要将 Prettier 和 ESLint 搭配使用，你可以用 [eslint-prettier](https://github.com/prettier/eslint-plugin-prettier) 插件将 Prettier 作为 ESLint 规则运行。
