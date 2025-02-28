---
title: act
---

<Intro>

`act` 是个测试辅助工具，用于在断言前应用待处理的 React 更新。

```js
await act(async actFn)
```

</Intro>

要将组件准备好进行断言，请将渲染代码和执行更新的操作包裹在 `await act()` 中。这能让你的测试更接近 React 在浏览器中的实际工作方式。

<Note>
你可能会发现直接使用 `act()` 略显繁琐。为了减少样板代码，可以使用像 [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)这样的库，其辅助方法已经内置了对 `act()` 的封装。
</Note>


<InlineToc />

---

## 参考 {/*reference*/}

### `await act(async actFn)` {/*await-act-async-actfn*/}

在编写 UI 测试时，诸如渲染、用户事件或数据获取等操作都可以视为与用户界面的“交互单元”。React 提供了 act() 辅助工具，确保在进行任何断言之前，所有与这些“交互单元”相关的更新都已处理并应用到 DOM。

名称 `act` 来源于 [Arrange-Act-Assert](https://wiki.c2.com/?ArrangeActAssert) 模式。

```js {2,4}
it ('renders with button disabled', async () => {
  await act(async () => {
    root.render(<TestComponent />)
  });
  expect(container.querySelector('button')).toBeDisabled();
});
```

<Note>

我们推荐将 `act` 与 `await` 和 `async` 函数配合使用。虽然同步版本在许多情况下有效，但由于 React 内部更新调度机制的原因，同步版本无法覆盖所有情况，且难以预测何时可以使用同步版本。

我们将在未来弃用并移除同步版本。

</Note>

#### 参数 {/*parameters*/}

* `async actFn`: 包裹被测组件渲染或交互的异步函数。在 `actFn` 内触发的所有更新都会被加入内部 act 队列，随后统一执行以处理变更并应用到 DOM。由于是异步操作，React 还会执行跨越异步边界的代码，并刷新所有计划中的更新。

#### 返回值 {/*returns*/}

`act` 不返回任何值。

## 用法 {/*usage*/}

测试组件时，可以使用 `act` 对其输出进行断言。

例如，假设我们有这个 `Counter` 组件，以下示例演示如何测试它：

```js
function Counter() {
  const [count, setCount] = useState(0);
  const handleClick = () => {
    setCount(prev => prev + 1);
  }

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  }, [count]);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={handleClick}>
        Click me
      </button>
    </div>
  )
}
```

### 在测试中渲染组件 {/*rendering-components-in-tests*/}

要测试组件的渲染输出，请将渲染操作包裹在 `act()` 中：

```js  {10,12}
import {act} from 'react';
import ReactDOMClient from 'react-dom/client';
import Counter from './Counter';

it('can render and update a counter', async () => {
  container = document.createElement('div');
  document.body.appendChild(container);
  
  // ✅ 在 act() 内渲染组件
  await act(() => {
    ReactDOMClient.createRoot(container).render(<Counter />);
  });
  
  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('You clicked 0 times');
  expect(document.title).toBe('You clicked 0 times');
});
```

这里我们创建容器元素并添加到文档中，然后在 `act()` 内渲染 `Counter`组件。这确保了在断言前组件已完成渲染且副作用已应用。

使用 `act` 能保证所有更新在断言前已完成处理。

### 在测试中触发事件 {/*dispatching-events-in-tests*/}

要测试事件，请将事件触发操作包裹在 `act()` 中：

```js {14,16}
import {act} from 'react';
import ReactDOMClient from 'react-dom/client';
import Counter from './Counter';

it.only('can render and update a counter', async () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  
  await act( async () => {
    ReactDOMClient.createRoot(container).render(<Counter />);
  });
  
  // ✅ 在 act() 内触发事件
  await act(async () => {
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });

  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('You clicked 1 times');
  expect(document.title).toBe('You clicked 1 times');
});
```

这里我们先用 `act`渲染组件，然后在另一个 `act()` 内触发事件。这确保了事件引起的所有更新在断言前已完成处理。

<Pitfall>

只有将 DOM 容器添加到文档后，触发 DOM 事件才会生效。可以使用 [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) 等库来减少样板代码。

</Pitfall>

## 疑难解答 {/*troubleshooting*/}

### 出现错误 "The current testing environment is not configured to support act"(...)" {/*error-the-current-testing-environment-is-not-configured-to-support-act*/}

使用 `act` 需要在测试环境中设置 `global.IS_REACT_ACT_ENVIRONMENT=true` 。这是为了确保 `act` 仅在正确的环境中使用。

如果未设置该全局变量，将看到如下错误：

<ConsoleBlock level="error">

Warning: The current testing environment is not configured to support act(...)

</ConsoleBlock>

解决方法：在 React 测试的全局设置文件中添加：

```js
global.IS_REACT_ACT_ENVIRONMENT=true
```

<Note>

在 [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) 等测试框架中，`IS_REACT_ACT_ENVIRONMENT` 已自动配置。

</Note>
