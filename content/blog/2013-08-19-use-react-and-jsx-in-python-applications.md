---
title: "在 Python 应用程序中使用 React 与 JSX"
author: [kmeht]
---

今天我们很高兴能发布 [PyReact](https://github.com/facebook/react-python) 的初始版本，它可以让你在 Python 应用程序中更简单的使用 React 与 JSX。它被设计为一个将 JSX 文件转换为 JavaScript 的 API，同时提供最新 React 源文件的访问。

## 使用 {#usage}

通过我们提供的 `jsx` 模块转换多个 JSX 文件：

```python
from react import jsx

# 使用 JSXTransformer 类来操作多个路径。
transformer = jsx.JSXTransformer()
for jsx_path, js_path in my_paths:
    transformer.transform(jsx_path, js_path)

# 对于单个文件，你可以使用一个快捷方法.
jsx.transform('path/to/input/file.jsx', 'path/to/output/file.js')
```

对于指向 React 文件的完整目录，可以使用 `source` 模块：

```python
from react import source

# 如果指定文件不存在， path_for 会抛出 IOError 异常
react_js = source.path_for('react.min.js')
```

## Django {#django}

PyReact 包括一个与 [django-pipeline](https://github.com/cyberdelia/django-pipeline) 同时使用的 JSX 编译器。将它加入你项目的管道设置，如下：

```python
PIPELINE_COMPILERS = (
  'react.utils.pipeline.JSXCompiler',
)
```

## 安装 {#installation}

PyReact 托管于 PyPI, 并可以使用 `pip` 安装:

    $ pip install PyReact

或者，将其加入你的 `requirements` 文件:

    PyReact==0.1.1

**关于依赖**: PyReact 使用 [PyExecJS](https://github.com/doloopwhile/PyExecJS) 以执行打包过的 React 代码, 而这要求你的机器已经装有 JS 运行时环境。我们没有 明确指定上述的运行时环境 —— Mac OS X 自带一个。当然，如果你在使用其他平台，我们推荐使用 [PyV8](https://code.google.com/p/pyv8/)。

<<<<<<< HEAD
鉴于这是初始版本，我们只在 Python 2.7 平台进行过测试。如果你希望在未来得到关于 Python 3 版本的支持，或者发现任何值得改进的地方，我们欢迎你的[贡献](https://github.com/facebook/react-python/blob/master/CONTRIBUTING.md)！
=======
For the initial release, we've only tested on Python 2.7. Look out for support for Python 3 in the future, and if you see anything that can be improved, we welcome your [contributions](https://github.com/facebook/react-python/blob/main/CONTRIBUTING.md)!
>>>>>>> 0bb0303fb704147452a568472e968993f0729c28
