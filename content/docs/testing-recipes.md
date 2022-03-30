---
id: testing-recipes
title: 测试技巧
permalink: docs/testing-recipes.html
prev: testing.html
next: testing-environments.html
---

React 组件的常见测试模式。

> 注意：
>
> 此章节假设你正在使用 [Jest](https://jestjs.io/) 作为测试运行器。如果你使用不同的测试运行器，你可能需要调整 API，但整体的解决方案是相同的。在[测试环境](/docs/testing-environments.html)章节阅读更多关于设置测试环境的细节。

在本章中，我们将主要使用函数组件。然而，这些测试策略并不依赖于实现细节，它对于 class 组件也同样有效。

- [创建/清理](#setup--teardown)
- [`act()`](#act)
- [渲染](#rendering)
- [数据获取](#data-fetching)
- [mock 模块](#mocking-modules)
- [事件](#events)
- [计时器](#timers)
- [快照测试](#snapshot-testing)
- [多渲染器](#multiple-renderers)
- [缺少什么?](#something-missing)

---

### 创建/清理 {#setup--teardown}

对于每个测试，我们通常希望将 React 树渲染给附加到 `document`的 DOM 元素。这点很重要，以便它可以接收 DOM 事件。当测试结束时，我们需要“清理”并从 `document` 中卸载树。

常见的方法是使用一对 `beforeEach` 和 `afterEach` 块，以便它们一直运行，并隔离测试本身造成的影响：

```jsx
import { unmountComponentAtNode } from "react-dom";

let container = null;
beforeEach(() => {
  // 创建一个 DOM 元素作为渲染目标
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // 退出时进行清理
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});
```

你可以使用不同的测试模式，但请注意，_即使测试失败_，也需要执行清理。否则，测试可能会导致“泄漏”，并且一个测试可能会影响另一个测试的行为。这使得其难以调试。

---

### `act()` {#act}

在编写 UI 测试时，可以将渲染、用户事件或数据获取等任务视为与用户界面交互的“单元”。`react-dom/test-utils` 提供了一个名为 [`act()`](/docs/test-utils.html#act) 的 helper，它确保在进行任何断言之前，与这些“单元”相关的所有更新都已处理并应用于 DOM：

```js
act(() => {
  // 渲染组件
});
// 进行断言
```

这有助于使测试运行更接近真实用户在使用应用程序时的体验。这些示例的其余部分使用 `act()` 来作出这些保证。

你可能会发现直接使用 `act()` 有点过于冗长。为了避免一些样板代码，你可以使用 [React 测试库](https://testing-library.com/react)，这些 helper 是使用 `act()` 函数进行封装的。

> 注意：
>
> `act` 名称来自 [Arrange-Act-Assert](http://wiki.c2.com/?ArrangeActAssert) 模式。

---

### 渲染 {#rendering}

通常，你可能希望测试组件对于给定的 prop 渲染是否正确。此时应考虑实现基于 prop 渲染消息的简单组件：

```jsx
// hello.js

import React from "react";

export default function Hello(props) {
  if (props.name) {
    return <h1>你好，{props.name}！</h1>;
  } else {
    return <span>嘿，陌生人</span>;
  }
}
```

我们可以为这个组件编写测试：

```jsx{24-27}
// hello.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Hello from "./hello";

let container = null;
beforeEach(() => {
  // 创建一个 DOM 元素作为渲染目标
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // 退出时进行清理
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("渲染有或无名称", () => {
  act(() => {
    render(<Hello />, container);
  });
  expect(container.textContent).toBe("嘿，陌生人");

  act(() => {
    render(<Hello name="Jenny" />, container);
  });
  expect(container.textContent).toBe("你好，Jenny！");

  act(() => {
    render(<Hello name="Margaret" />, container);
  });
  expect(container.textContent).toBe("你好，Margaret！");
});
```

---

### 数据获取 {#data-fetching}

你可以使用假数据来 mock 请求，而不是在所有测试中调用真正的 API。使用“假”数据 mock 数据获取可以防止由于后端不可用而导致的测试不稳定，并使它们运行得更快。注意：你可能仍然希望使用一个[“端到端”](/docs/testing-environments.html#end-to-end-tests-aka-e2e-tests)的框架来运行测试子集，该框架可显示整个应用程序是否一起工作。

```jsx
// user.js

import React, { useState, useEffect } from "react";

export default function User(props) {
  const [user, setUser] = useState(null);

  async function fetchUserData(id) {
    const response = await fetch("/" + id);
    setUser(await response.json());
  }

  useEffect(() => {
    fetchUserData(props.id);
  }, [props.id]);

  if (!user) {
    return "加载中...";
  }

  return (
    <details>
      <summary>{user.name}</summary>
      <strong>{user.age}</strong> 岁
      <br />
      住在 {user.address}
    </details>
  );
}
```

我们可以为它编写测试：

```jsx{23-33,44-45}
// user.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import User from "./user";

let container = null;
beforeEach(() => {
  // 创建一个 DOM 元素作为渲染目标
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // 退出时进行清理
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("渲染用户数据", async () => {
  const fakeUser = {
    name: "Joni Baez",
    age: "32",
    address: "123, Charming Avenue"
  };

  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve(fakeUser)
    })
  );

  // 使用异步的 act 应用执行成功的 promise
  await act(async () => {
    render(<User id="123" />, container);
  });

  expect(container.querySelector("summary").textContent).toBe(fakeUser.name);
  expect(container.querySelector("strong").textContent).toBe(fakeUser.age);
  expect(container.textContent).toContain(fakeUser.address);

  // 清理 mock 以确保测试完全隔离
  global.fetch.mockRestore();
});
```

---

### mock 模块 {#mocking-modules}

有些模块可能在测试环境中不能很好地工作，或者对测试本身不是很重要。使用虚拟数据来 mock 这些模块可以使你为代码编写测试变得更容易。

考虑一个嵌入第三方 `GoogleMap` 组件的 `Contact` 组件：

```jsx
// map.js

import React from "react";

import { LoadScript, GoogleMap } from "react-google-maps";
export default function Map(props) {
  return (
    <LoadScript id="script-loader" googleMapsApiKey="YOUR_API_KEY">
      <GoogleMap id="example-map" center={props.center} />
    </LoadScript>
  );
}

// contact.js

import React from "react";
import Map from "./map";

export default function Contact(props) {
  return (
    <div>
      <address>
        联系 {props.name}，通过{" "}
        <a data-testid="email" href={"mailto:" + props.email}>
          email
        </a>
        或者他们的 <a data-testid="site" href={props.site}>
          网站
        </a>。
      </address>
      <Map center={props.center} />
    </div>
  );
}
```

如果不想在测试中加载这个组件，我们可以将依赖 mock 到一个虚拟组件，然后运行我们的测试：

```jsx{10-18}
// contact.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Contact from "./contact";
import MockedMap from "./map";

jest.mock("./map", () => {
  return function DummyMap(props) {
    return (
      <div data-testid="map">
        {props.center.lat}:{props.center.long}
      </div>
    );
  };
});

let container = null;
beforeEach(() => {
  // 创建一个 DOM 元素作为渲染目标
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // 退出时进行清理
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("应渲染联系信息", () => {
  const center = { lat: 0, long: 0 };
  act(() => {
    render(
      <Contact
        name="Joni Baez"
        email="test@example.com"
        site="http://test.com"
        center={center}
      />,
      container
    );
  });

  expect(
    container.querySelector("[data-testid='email']").getAttribute("href")
  ).toEqual("mailto:test@example.com");

  expect(
    container.querySelector('[data-testid="site"]').getAttribute("href")
  ).toEqual("http://test.com");

  expect(container.querySelector('[data-testid="map"]').textContent).toEqual(
    "0:0"
  );
});
```

---

### Events {#events}

我们建议在 DOM 元素上触发真正的 DOM 事件，然后对结果进行断言。考虑一个 `Toggle` 组件：

```jsx
// toggle.js

import React, { useState } from "react";

export default function Toggle(props) {
  const [state, setState] = useState(false);
  return (
    <button
      onClick={() => {
        setState(previousState => !previousState);
        props.onChange(!state);
      }}
      data-testid="toggle"
    >
      {state === true ? "Turn off" : "Turn on"}
    </button>
  );
}
```

我们可以为它编写测试：

```jsx{13-14,35,43}
// toggle.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Toggle from "./toggle";

let container = null;
beforeEach(() => {
  // 创建一个 DOM 元素作为渲染目标
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // 退出时进行清理
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("点击时更新值", () => {
  const onChange = jest.fn();
  act(() => {
    render(<Toggle onChange={onChange} />, container);
  });

  // 获取按钮元素，并触发点击事件
  const button = document.querySelector("[data-testid=toggle]");
  expect(button.innerHTML).toBe("Turn on");

  act(() => {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(button.innerHTML).toBe("Turn off");

  act(() => {
    for (let i = 0; i < 5; i++) {
      button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    }
  });

  expect(onChange).toHaveBeenCalledTimes(6);
  expect(button.innerHTML).toBe("Turn on");
});
```

[MDN](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent)描述了不同的 DOM 事件及其属性。注意，你需要在创建的每个事件中传递 `{ bubbles: true }` 才能到达 React 监听器，因为 React 会自动将事件委托给 root。

> 注意：
>
> React 测试库为触发事件提供了一个[更简洁 helper](https://testing-library.com/docs/dom-testing-library/api-events)。

---

### 计时器 {#timers}

你的代码可能会使用基于计时器的函数（如 `setTimeout`）来安排将来更多的工作。在这个例子中，多项选择面板等待选择并前进，如果在 5 秒内没有做出选择，则超时：

```jsx
// card.js

import React, { useEffect } from "react";

export default function Card(props) {
  useEffect(() => {
    const timeoutID = setTimeout(() => {
      props.onSelect(null);
    }, 5000);
    return () => {
      clearTimeout(timeoutID);
    };
  }, [props.onSelect]);

  return [1, 2, 3, 4].map(choice => (
    <button
      key={choice}
      data-testid={choice}
      onClick={() => props.onSelect(choice)}
    >
      {choice}
    </button>
  ));
}
```

我们可以利用 [Jest 的计时器 mock](https://jestjs.io/docs/en/timer-mocks) 为这个组件编写测试，并测试它可能处于的不同状态。

```jsx{7,31,37,49,59}
// card.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Card from "./card";

let container = null;
beforeEach(() => {
  // 创建一个 DOM 元素作为渲染目标
  container = document.createElement("div");
  document.body.appendChild(container);
  jest.useFakeTimers();
});

afterEach(() => {
  // 退出时进行清理
  unmountComponentAtNode(container);
  container.remove();
  container = null;
  jest.useRealTimers();
});

it("超时后应选择 null", () => {
  const onSelect = jest.fn();
  act(() => {
    render(<Card onSelect={onSelect} />, container);
  });

  // 提前 100 毫秒执行
  act(() => {
    jest.advanceTimersByTime(100);
  });
  expect(onSelect).not.toHaveBeenCalled();

  // 然后提前 5 秒执行
  act(() => {
    jest.advanceTimersByTime(5000);
  });
  expect(onSelect).toHaveBeenCalledWith(null);
});

it("移除时应进行清理", () => {
  const onSelect = jest.fn();
  act(() => {
    render(<Card onSelect={onSelect} />, container);
  });

  act(() => {
    jest.advanceTimersByTime(100);
  });
  expect(onSelect).not.toHaveBeenCalled();

  // 卸载应用程序
  act(() => {
    render(null, container);
  });

  act(() => {
    jest.advanceTimersByTime(5000);
  });
  expect(onSelect).not.toHaveBeenCalled();
});

it("应接受选择", () => {
  const onSelect = jest.fn();
  act(() => {
    render(<Card onSelect={onSelect} />, container);
  });

  act(() => {
    container
      .querySelector("[data-testid='2']")
      .dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  expect(onSelect).toHaveBeenCalledWith(2);
});
```

你只能在某些测试中使用假计时器。在上面，我们通过调用 `jest.useFakeTimers()` 来启用它们。它们提供的主要优势是，你的测试实际上不需要等待 5 秒来执行，而且你也不需要为了测试而使组件代码更加复杂。

---

### 快照测试 {#snapshot-testing}

像 Jest 这样的框架还允许你使用 [`toMatchSnapshot` / `toMatchInlineSnapshot`](https://jestjs.io/docs/en/snapshot-testing) 保存数据的“快照”。有了这些，我们可以“保存”渲染的组件输出，并确保对它的更新作为对快照的更新显式提交。

在这个示例中，我们渲染一个组件并使用 [`pretty`](https://www.npmjs.com/package/pretty) 包对渲染的 HTML 进行格式化，然后将其保存为内联快照：

```jsx{29-31}
// hello.test.js, again

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import pretty from "pretty";

import Hello from "./hello";

let container = null;
beforeEach(() => {
  // 创建一个 DOM 元素作为渲染目标
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // 退出时进行清理
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("应渲染问候语", () => {
  act(() => {
    render(<Hello />, container);
  });

  expect(
    pretty(container.innerHTML)
  ).toMatchInlineSnapshot(); /* ... 由 jest 自动填充 ... */

  act(() => {
    render(<Hello name="Jenny" />, container);
  });

  expect(
    pretty(container.innerHTML)
  ).toMatchInlineSnapshot(); /* ... 由 jest 自动填充 ... */

  act(() => {
    render(<Hello name="Margaret" />, container);
  });

  expect(
    pretty(container.innerHTML)
  ).toMatchInlineSnapshot(); /* ... 由 jest 自动填充 ... */
});
```

通常，进行具体的断言比使用快照更好。这类测试包括实现细节，因此很容易中断，并且团队可能对快照中断不敏感。选择性地 [mock 一些子组件](#mocking-modules)可以帮助减小快照的大小，并使它们在代码评审中保持可读性。

---

### 多渲染器 {#multiple-renderers}

在极少数情况下，你可能正在使用多个渲染器的组件上运行测试。例如，你可能正在使用 `react-test-renderer` 组件上运行快照测试，该组件内部使用 `react-dom` 的 `render` 来渲染子组件的一些内容。在这个场景中，你可以使用与它们的渲染器相对应的 `act()` 来包装更新。

```jsx
import { act as domAct } from "react-dom/test-utils";
import { act as testAct, create } from "react-test-renderer";
// ...
let root;
domAct(() => {
  testAct(() => {
    root = create(<App />);
  });
});
expect(root).toMatchSnapshot();
```

---

### 缺少什么？ {#something-missing}

如果有一些常见场景没有覆盖，请在文档网站的 [issue 跟踪器](https://github.com/reactjs/reactjs.org/issues)上告诉我们。
