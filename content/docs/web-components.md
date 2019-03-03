---
id: web-components
title: Web Component
permalink: docs/web-components.html
redirect_from:
  - "docs/webcomponents.html"
---

React 和 [Web Component](https://developer.mozilla.org/en-US/docs/Web/Web_Components) 为了解决不同的问题而构建。Web Component 为解决可复用组件提供了强大的封装，而 React 的提供了声明式库，使 DOM 和你的数据保持同步。作为开发人员，你可以在 Web Component 自由的使用 React，或者在 React 中使用 Web Component，或者两者都存在。

大多数使用 React 时不使用 Web Component，但可能你需要使用，尤其是在使用 Web Component 编写的第三方库时。

## 在 React 中使用 Web Component {#using-web-components-in-react}

```javascript
class HelloMessage extends React.Component {
  render() {
    return <div>Hello <x-search>{this.props.name}</x-search>!</div>;
  }
}
```

> 注意：
>
> Web Component 通常暴露的是命令式 API。例如，Web Component 组件 `video` 可能公开 `play()` 和 `pause()` 方法。要访问 Web Component 的命令式 API，你需要使用 `ref` 直接与 DOM 节点进行交互。如果你使用的是第三方 Web Components，那么最好的解决方案是编写一个 React 组件去包装 Web Component。
>
> Web Component 触发的事件可能无法通过 React 渲染树正确的传播。
> 你需要手动添加事件处理程序以在 React 组件中处理这些事件。

一个常见的混淆是 Web Component 使用的是 `class` 而不是 `className`。

```javascript
function BrickFlipbox() {
  return (
    <brick-flipbox class="demo">
      <div>front</div>
      <div>back</div>
    </brick-flipbox>
  );
}
```

## 在 Web Component 中使用 React  {#using-react-in-your-web-components}

```javascript
class XSearch extends HTMLElement {
  connectedCallback() {
    const mountPoint = document.createElement('span');
    this.attachShadow({ mode: 'open' }).appendChild(mountPoint);

    const name = this.getAttribute('name');
    const url = 'https://www.google.com/search?q=' + encodeURIComponent(name);
    ReactDOM.render(<a href={url}>{name}</a>, mountPoint);
  }
}
customElements.define('x-search', XSearch);
```

>注意：
>
>如果使用 Babel 来转换 class，此代码将**不会**起作用。请查看[此问题](https://github.com/w3c/webcomponents/issues/587)了解相关讨论。
>在加载 web component 前请包含[custom-elements-es5-adapter.js](https://github.com/webcomponents/webcomponentsjs#custom-elements-es5-adapterjs) 来解决此问题。
