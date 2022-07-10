# [React 中文文档](https://zh-hans.reactjs.org/)

此仓库包含 [React 中文文档](https://zh-hans.reactjs.org/) 的文档及源码，并由官方实时同步。

## 关于翻译内容反馈

翻译基本接近尾声，但文档中也有可能存在疏漏之处。<br><br>
如在阅读文档中，遇到文档的问题可直接 PR 修改。<br>也可添加反馈群。我们会及时给出反馈。<br><br>
当然也可以在群里交流 React 相关的交流心得，非常欢迎。<br><br>
希望大家共同把这个文档维护好，造福更多 React 开发者。<br>

## 关于中文翻译工作：

**翻译流程：**

1. 挑选你想要翻译或校对的文章 [New Chinese Website: TODOs](https://github.com/reactjs/zh-hans.reactjs.org/issues/4) 
2. 请 fork 这个仓库
3. 基于 fork 后的仓库中 main 分支拉取一个新的分支（名字自取）
4. 翻译(校对)你所选择的文章，提交到新的分支
5. 此时提交 Pull Request 到该仓库
6. 会有专人 Review 该 Pull Request，当两人以上通过该 Pull Request 时，你的翻译将被合并到仓库中
7. 删除你所创建的分支（如继续参与，参考同步流程）

**同步流程：**

1. 添加该 repo 为你 fork 后仓库上游

	```
	$ git remote add upstream git@github.com:reactjs/zh-hans.reactjs.org.git
	or
	$ git remote add upstream https://github.com/reactjs/zh-hans.reactjs.org.git
	``` 
	
2. 同步 git fetch 上游代码

	```
	$ git checkout main && git fetch upstream
	```
	
3. 将上游代码合并至你 fork 后的仓库(main 分支)中，保证你的 main 分支永远是最新版本

	```
	$ git merge upstream/main
	```
	
4. 重复翻译流程

> 注意：
> 
> 1. 同步时不应产生 Merge 相关的 commit
> 2. 尽量保证一次 PR 只有一篇文章，便于后续校对和维护

**词汇表（[Glossary](https://github.com/reactjs/zh-hans.reactjs.org/issues/2)）：**

大家在翻译过程中会遇到不需要翻译的内容，可以添加到词汇表中。

项目起步，部分内容逐步完善中。后续会添加相关流程图片，便于理解。
该流程我继续细化，如有疑问。

## About Chinese translation:

**Translation Process:**

1. Choose the article you want to translate or proofread [New Chinese Website: TODOs](https://github.com/reactjs/zh-hans.reactjs.org/issues/4)
2. Please fork this repo
3. In the repo after fork, create a new branch (custom branch name) based on the main branch.
4. Translation or proofread article, and commit your branch
5. Commit your PR to this repo
6. Please wait for Review.
7. When PR merge to this repo, you can delete your branch.

**Synchronization Process:**

1. Add the repo to become the remote upstream of your fork repo 
	
	```
	$ git remote add upstream git@github.com:reactjs/zh-hans.reactjs.org.git
	or
	$ git remote add upstream https://github.com/reactjs/zh-hans.reactjs.org.git
	```
2. Fetch remote upstream

	```
	$ git fetch upstream
	```
3. Merge upstream/main to your repo/main
	
	```
	$ git checkout main && git merge upstream/main
	```
4. Re-execute the translation process

## Getting started

### Prerequisites

1. Git
1. Node: any 12.x version starting with v12.0.0 or greater
1. Yarn v1: See [Yarn website for installation instructions](https://yarnpkg.com/lang/en/docs/install/)
1. A fork of the repo (for any contributions)
1. A clone of the [reactjs.org repo](https://github.com/reactjs/reactjs.org) on your local machine

### Installation

1. `cd reactjs.org` to go into the project root
1. `yarn` to install the website's npm dependencies

### Running locally

1. `yarn dev` to start the hot-reloading development server (powered by [Gatsby](https://www.gatsbyjs.org))
1. `open http://localhost:8000` to open the site in your favorite browser

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
1. Run `yarn check-all` from the project root. (This will run Prettier, ESLint, and Flow.)

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
