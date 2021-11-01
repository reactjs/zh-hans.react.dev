---
title: 编辑器设置
---

<Intro>

编辑器配置得当可以使代码读写更加清晰高效。而且它还可以帮你在编码时提示错误！如果这是你第一次配置编辑器，或者你想调整现有的编辑器，我们有一些建议可供参考。

</Intro>

## 你的编辑器 {#your-editor}

[VS Code](https://code.visualstudio.com/) 是现如今最流行的编辑器之一。它拥有庞大的扩展市场，同时能集成像 GitHub 这样的流行服务。下面列出的大多数功能都可以作为扩展添加到 VS Code 中，使其具有极高的可配置性！

其他 React 社区里比较流行的文本编辑器包括：

* [WebStorm](https://www.jetbrains.com/webstorm/) — 专为 JavaScript 设计的集成开发环境。
* [Sublime Text](https://www.sublimetext.com/) — 支持 JSX 和 TypeScript，内置语法高亮和代码自动补全功能。
* [Vim](https://www.vim.org/) — 一个高度可配置的文本编辑器，可以非常高效地创建和更改任何类型的文本。它作为 “vi” 包含在大多数 UNIX 系统和 Apple OS X 中。

## 推荐的文本编辑器功能 {#recommended-text-editor-features}

有些编辑器内置了这些功能，但其他一些编辑器可能需要添加扩展。检查确认下你的编辑器支持了哪些能力！

### 代码检查（Linting） {#linting}

代码检查（Code linters）在你编写代码时会发现代码中的问题，帮你尽早修复这些问题。[ESLint](https://eslint.org/) 是一种流行的、开源的 JavaScript 代码检查工具。

* [使用 React 的推荐配置安装 ESLint](https://www.npmjs.com/package/eslint-config-react-app) （确保你已经安装了 [Node](https://nodejs.org/en/download/current/) ）
* [安装 VSCode 中的官方 ESLint 扩展](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

### 格式化 {#formatting}

与其他贡献者共享代码时，你最不想做的事就是讨论代码缩进使用 [tabs 还是空格](https://www.google.com/search?q=tabs+vs+spaces) ！幸好，[Prettier](https://prettier.io/) 将以预设的配置规则重新格式化代码以保证代码整洁。运行 Prettier，你的所有 tabs 将转换为空格，缩进、引号等也将全部更改为你预先配置好的。理想状态就是，当你保存文件时，Prettier 将自动运行格式化操作。

你可以安装 [Prettier 扩展在 VSCode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) 通过以下步骤：

1. 启动 VS Code
2. 使用快速打开 （使用快捷键 `CTRL/CMD + P`）
3. 粘贴 `ext install esbenp.prettier-vscode`
4. 按回车键

#### 保存并自动格式化 {#formatting-on-save}

理想情况下，你应该在每次保存时自动格式化代码。VS Code 就有这个配置!

1. 在 VS Code, 按快捷键 `CTRL/CMD + SHIFT + P`.
2. 输入 "settings"
3. 按回车键
4. 在搜索栏, 输入 "format on save"
5. 确保勾选 "format on save" 选项！

> Prettier 有时会与其他 linter 发生冲突。但通常有一个方法可以让它们很好地一起运行。例如，如果你要一起使用 Prettier 和 ESLint，你可以用 [eslint-prettier](https://github.com/prettier/eslint-plugin-prettier) 插件将 Prettier 作为 ESLint 规则运行。
