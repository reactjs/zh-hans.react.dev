---
id: faq-ajax
title: AJAX and APIs
permalink: docs/faq-ajax.html
layout: docs
category: FAQ
---

### 我怎样在React中发起AJAX请求{#how-can-i-make-an-ajax-call}

在React开发中，你能使用任何你喜欢的AJAX库，比如社区比较流行的[Axios](https://github.com/axios/axios), [jQuery AJAX](https://api.jquery.com/jQuery.ajax/),或者是浏览器内置的[window.fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)。

### 我应该在React组件的哪个生命周期函数中发起AJAX请求？{#where-in-the-component-lifecycle-should-i-make-an-ajax-call}

我们推荐你在[`componentDidMount`](/docs/react-component.html#mounting)这个生命周期函数中发起AJAX请求。这样做你可以拿到AJAX请求返回的数据并通过`setState`来更新组件。

### 用例：使用AJAX请求结果去改变local state{#example-using-ajax-results-to-set-local-state}

下面这个组件演示了如何在`componentDidMount`中发起AJAX请求去更新组件的state。

示例API返回如下的JSON格式。

```
{
  "items": [
    { "id": 1, "name": "Apples",  "price": "$2" },
    { "id": 2, "name": "Peaches", "price": "$5" }
  ] 
}
```

```jsx
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    };
  }

  componentDidMount() {
    fetch("https://api.example.com/items")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result.items
          });
        },
        // 注意：在这里需要通过如下方式来处理错误而不是使用catch()去捕捉错误
        // 因为使用catch去捕捉错误会掩盖掉组件本身可能产生的bug
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render() {
    const { error, isLoaded, items } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <ul>
          {items.map(item => (
            <li key={item.name}>
              {item.name} {item.price}
            </li>
          ))}
        </ul>
      );
    }
  }
}
```
