---
title: useCallback
---

<Intro>

`useCallback` 是一个允许你在多次渲染中缓存函数的 React Hook。

```js
const cachedFn = useCallback(fn, dependencies)
```

</Intro>

<Note>

[React 编译器](/learn/react-compiler) 会自动对值和函数进行记忆化处理，从而减少手动调用 `useCallback` 的需求。你可以使用编译器自动处理记忆化。

</Note>

<InlineToc />

---

## 参考 {/*reference*/}

### `useCallback(fn, dependencies)` {/*usecallback*/}

在组件顶层调用 `useCallback` 以便在多次渲染中缓存函数：

```js {4,9}
import { useCallback } from 'react';

export default function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
```

[参见下面更多示例](#usage)。

#### 参数 {/*parameters*/}

* `fn`：想要缓存的函数。此函数可以接受任何参数并且返回任何值。在初次渲染时，React 将把函数返回给你（而不是调用它！）。当进行下一次渲染时，如果 `dependencies` 相比于上一次渲染时没有改变，那么 React 将会返回相同的函数。否则，React 将返回在最新一次渲染中传入的函数，并且将其缓存以便之后使用。React 不会调用此函数，而是返回此函数。你可以自己决定何时调用以及是否调用。

* `dependencies`：有关是否更新 `fn` 的所有响应式值的一个列表。响应式值包括 props、state，和所有在你组件内部直接声明的变量和函数。如果你的代码检查工具 [配置了 React](/learn/editor-setup#linting)，那么它将校验每一个正确指定为依赖的响应式值。依赖列表必须具有确切数量的项，并且必须像 `[dep1, dep2, dep3]` 这样编写。React 使用 [`Object.is`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 比较每一个依赖和它的之前的值。

#### 返回值 {/*returns*/}

在初次渲染时，`useCallback` 返回你已经传入的 `fn` 函数

在之后的渲染中，如果依赖没有改变，`useCallback` 返回上一次渲染中缓存的 `fn` 函数；否则返回这一次渲染传入的 `fn`。

#### 注意 {/*caveats*/}

* `useCallback` 是一个 Hook，所以应该在 **组件的顶层** 或自定义 Hook 中调用。你不应在循环或者条件语句中调用它。如果你需要这样做，请新建一个组件，并将 state 移入其中。
* 除非有特定的理由，React **将不会丢弃已缓存的函数**。例如，在开发中，当编辑组件文件时，React 会丢弃缓存。在生产和开发环境中，如果你的组件在初次挂载中暂停，React 将会丢弃缓存。在未来，React 可能会增加更多利用了丢弃缓存机制的特性。例如，如果 React 未来内置了对虚拟列表的支持，那么在滚动超出虚拟化表视口的项目时，抛弃缓存是有意义的。如果你依赖 `useCallback` 作为一个性能优化途径，那么这些对你会有帮助。否则请考虑使用 [state 变量](/reference/react/useState#im-trying-to-set-state-to-a-function-but-it-gets-called-instead) 或 [ref](/reference/react/useRef#avoiding-recreating-the-ref-contents)。

---

## 用法 {/*usage*/}

### 跳过组件的重新渲染 {/*skipping-re-rendering-of-components*/}

当你优化渲染性能的时候，有时需要缓存传递给子组件的函数。让我们先关注一下如何实现，稍后去理解在哪些场景中它是有用的。

为了缓存组件中多次渲染的函数，你需要将其定义在 `useCallback` Hook 中：

```js [[3, 4, "handleSubmit"], [2, 9, "[productId, referrer]"]]
import { useCallback } from 'react';

function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
  // ...
```

你需要传递两个参数给 `useCallback`：

1. 在多次渲染中需要缓存的函数
2. 函数内部需要使用到的所有组件内部值的 <CodeStep step={2}>依赖列表</CodeStep>。

初次渲染时，在 `useCallback` 处接收的 <CodeStep step={3}>返回函数</CodeStep> 将会是已经传入的函数。

在之后的渲染中，React 将会使用 [`Object.is`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 把 <CodeStep step={2}>当前的依赖</CodeStep> 和已传入之前的依赖进行比较。如果没有任何依赖改变，`useCallback` 将会返回与之前一样的函数。否则 `useCallback` 将返回 **此次** 渲染中传递的函数。

简而言之，`useCallback` 在多次渲染中缓存一个函数，直至这个函数的依赖发生改变。

**让我们通过一个示例看看它何时有用**。

假设你正在从 `ProductPage` 传递一个 `handleSubmit` 函数到 `ShippingForm` 组件中：

```js {5}
function ProductPage({ productId, referrer, theme }) {
  // ...
  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
```

注意，切换 `theme` props 后会让应用停滞一小会，但如果将 `<ShippingForm />` 从 JSX 中移除，应用将反应迅速。这就提示尽力优化 `ShippingForm` 组件将会很有用。

**默认情况下，当一个组件重新渲染时， React 将递归渲染它的所有子组件**，因此每当因 `theme` 更改时而 `ProductPage` 组件重新渲染时，`ShippingForm` 组件也会重新渲染。这对于不需要大量计算去重新渲染的组件来说影响很小。但如果你发现某次重新渲染很慢，你可以将 `ShippingForm` 组件包裹在 [`memo`](/reference/react/memo) 中。如果 props 和上一次渲染时相同，那么 `ShippingForm` 组件将跳过重新渲染。

```js {3,5}
import { memo } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  // ...
});
```

**当代码像上面一样改变后，如果 props 与上一次渲染时相同，`ShippingForm` 将跳过重新渲染**。这时缓存函数就变得很重要。假设定义了 `handleSubmit` 而没有定义 `useCallback`：

```js {2,3,8,12-13}
function ProductPage({ productId, referrer, theme }) {
  // 每当 theme 改变时，都会生成一个不同的函数
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      {/* 这将导致 ShippingForm props 永远都不会是相同的，并且每次它都会重新渲染 */}
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

与字面量对象 `{}` 总是会创建新对象类似，**在 JavaScript 中，`function () {}` 或者 `() => {}` 总是会生成不同的函数**。正常情况下，这不会有问题，但是这意味着 `ShippingForm` props 将永远不会是相同的，并且 [`memo`](/reference/react/memo) 对性能的优化永远不会生效。而这就是 `useCallback` 起作用的地方：

```js {2,3,8,12-13}
function ProductPage({ productId, referrer, theme }) {
  // 在多次渲染中缓存函数
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]); // 只要这些依赖没有改变

  return (
    <div className={theme}>
      {/* ShippingForm 就会收到同样的 props 并且跳过重新渲染 */}
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

**将 `handleSubmit` 传递给 `useCallback` 就可以确保它在多次重新渲染之间是相同的函数**，直到依赖发生改变。注意，除非出于某种特定原因，否则不必将一个函数包裹在 `useCallback` 中。在本例中，你将它传递到了包裹在 [`memo`](/reference/react/memo) 中的组件，这允许它跳过重新渲染。不过还有其他场景可能需要用到 `useCallback`，本章将对此进行进一步描述。

<Note>

**`useCallback` 只应作用于性能优化**。如果代码在没有它的情况下无法运行，请找到根本问题并首先修复它，然后再使用 `useCallback`。

</Note>

<DeepDive>

#### `useCallback` 与 `useMemo` 有何关系？ {/*how-is-usecallback-related-to-usememo*/}

[`useMemo`](/reference/react/useMemo) 经常与 `useCallback` 一同出现。当尝试优化子组件时，它们都很有用。他们会 [记住](https://en.wikipedia.org/wiki/Memoization)（或者说，缓存）正在传递的东西：

```js {6-8,10-15,19}
import { useMemo, useCallback } from 'react';

function ProductPage({ productId, referrer }) {
  const product = useData('/product/' + productId);

  const requirements = useMemo(() => { //调用函数并缓存结果
    return computeRequirements(product);
  }, [product]);

  const handleSubmit = useCallback((orderDetails) => { // 缓存函数本身
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);

  return (
    <div className={theme}>
      <ShippingForm requirements={requirements} onSubmit={handleSubmit} />
    </div>
  );
}
```

区别在于你需要缓存 **什么**:

* **[`useMemo`](/reference/react/useMemo) 缓存函数调用的结果**。在这里，它缓存了调用 `computeRequirements(product)` 的结果。除非 `product` 发生改变，否则它将不会发生变化。这让你向下传递 `requirements` 时而无需不必要地重新渲染 `ShippingForm`。必要时，React 将会调用传入的函数重新计算结果。
* **`useCallback` 缓存函数本身**。不像 `useMemo`，它不会调用你传入的函数。相反，它缓存此函数。从而除非 `productId` 或 `referrer` 发生改变，`handleSubmit` 自己将不会发生改变。这让你向下传递 `handleSubmit` 函数而无需不必要地重新渲染 `ShippingForm`。直至用户提交表单，你的代码都将不会运行。

如果你已经熟悉了 [`useMemo`](/reference/react/useMemo)，你可能发现将 `useCallback` 视为以下内容会很有帮助：

```js {expectedErrors: {'react-compiler': [3]}}
// 在 React 内部的简化实现
function useCallback(fn, dependencies) {
  return useMemo(() => fn, dependencies);
}
```

[阅读更多关于 `useMemo` 与 `useCallback` 之间区别的信息](/reference/react/useMemo#memoizing-a-function)。

</DeepDive>

<DeepDive>

#### 是否应该在任何地方添加 `useCallback`？ {/*should-you-add-usecallback-everywhere*/}

如果你的应用程序与本网站类似，并且大多数交互都很粗糙（例如替换页面或整个部分），则通常不需要缓存。另一方面，如果你的应用更像是一个绘图编辑器，并且大多数交互都是精细的（如移动形状），那么你可能会发现缓存非常有用。

使用 `useCallback` 缓存函数仅在少数情况下有意义：

- 将其作为 props 传递给包装在 [`memo`] 中的组件。如果 props 未更改，则希望跳过重新渲染。缓存允许组件仅在依赖项更改时重新渲染。
- 传递的函数可能作为某些 Hook 的依赖。比如，另一个包裹在 `useCallback` 中的函数依赖于它，或者依赖于 [`useEffect`](/reference/react/useEffect) 中的函数。

在其他情况下，将函数包装在 `useCallback` 中没有任何意义。不过即使这样做了，也没有很大的坏处。所以有些团队选择不考虑个案，从而尽可能缓存。不好的地方可能是降低了代码可读性。而且，并不是所有的缓存都是有效的：一个始终是新的值足以破坏整个组件的缓存。

请注意，`useCallback` 不会阻止创建函数。你总是在创建一个函数（这很好！），但是如果没有任何东西改变，React 会忽略它并返回缓存的函数。

**在实践中，你可以通过遵循一些原则来减少许多不必要的记忆化**：

1. 当一个组件在视觉上包装其他组件时，让它 [接受 JSX 作为子元素](/learn/passing-props-to-a-component#passing-jsx-as-children)。随后，如果包装组件更新自己的 state，React 知道它的子组件不需要重新渲染。
2. 建议使用 state 并且不要 [提升状态](/learn/sharing-state-between-components) 超过必要的程度。不要将表单和项是否悬停等短暂状态保存在树的顶部或全局状态库中。
3. 保持 [渲染逻辑纯粹](/learn/keeping-components-pure)。如果重新渲染组件会导致问题或产生一些明显的视觉瑕疵，那么这是组件自身的问题！请修复这个错误，而不是添加记忆化。
4. 避免 [不必要地更新 Effect](/learn/you-might-not-need-an-effect)。React 应用程序中的大多数性能问题都是由 Effect 的更新链引起的，这些更新链不断导致组件重新渲染。
5. 尝试 [从 Effect 中删除不必要的依赖关系](/learn/removing-effect-dependencies)。例如，将某些对象或函数移动到副作用内部或组件外部通常更简单，而不是使用记忆化。

如果特定的交互仍然感觉滞后，[使用 React 开发者工具](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html) 查看哪些组件在记忆化中受益最大，并在需要时添加记忆化。这些原则使你的组件更易于调试和理解，因此在任何情况下都最好遵循它们。从长远来看，我们正在研究 [自动记忆化](https://www.youtube.com/watch?v=lGEMwh32soc) 以一劳永逸地解决这个问题。

</DeepDive>

<Recipes titleText="使用 useCallback 与直接声明函数的区别" titleId="examples-rerendering">

#### 使用 `useCallback` 和 `memo` 跳过函数的重新渲染 {/*skipping-re-rendering-with-usecallback-and-memo*/}

在这个例子中，`ShippingForm` 组件被人为地减慢了速度，以便你可以看到渲染的 React 组件真正变慢时会发生什么。尝试递增计数器并切换主题。

递增计数器感觉很慢，因为它会强制变慢 `ShippingForm` 的重新渲染。这是意料之中的，因为计数器已更改，因此你需要在屏幕上反映用户的新选择。

接下来，尝试更改主题。**将 `useCallback` 和 [`memo`](/reference/react/memo) 结合使用后，尽管人为减缓了速度，但它还是很快**。由于 `useCallback` 依赖 `productId` 与 `referrer` 自上次渲染后始终没有发生改变，因此 `handleSubmit` 也没有改变。由于 `handleSubmit` 没有发生改变，`ShippingForm` 就跳过了重新渲染。

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/ProductPage.js active
import { useCallback } from 'react';
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // 想象这发送了一个请求
  console.log('POST /' + url);
  console.log(data);
}
```

```js {expectedErrors: {'react-compiler': [7, 8]}} src/ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('[ARTIFICIALLY SLOW] Rendering <ShippingForm />');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // 500 毫秒内不执行任何操作来模拟极慢的代码
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <p><b>Note: <code>ShippingForm</code> is artificially slowed down!</b></p>
      <label>
        Number of items:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        Street:
        <input name="street" />
      </label>
      <label>
        City:
        <input name="city" />
      </label>
      <label>
        Postal code:
        <input name="zipCode" />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

<Solution />

#### 始终重新渲染组件 {/*always-re-rendering-a-component*/}

在本例中，`ShippingForm` 被人为地减慢了速度，这样你可以看到当你渲染的某些 React 组件运行很慢时会发生什么。尝试递增计数器并切换主题。

与前面示例不同，现在切换主题也很慢！这是因为 **此处没有调用 `useCallback`**，所以 `handleSubmit` 总是一个新的函数，并且被减速的 `ShippingForm` 组件不能跳过重新渲染。

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/ProductPage.js active
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  //想象这发送了一个请求
  console.log('POST /' + url);
  console.log(data);
}
```

```js {expectedErrors: {'react-compiler': [7, 8]}} src/ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('[ARTIFICIALLY SLOW] Rendering <ShippingForm />');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
     // 500 毫秒内不执行任何操作来模拟极慢的代码
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <p><b>Note: <code>ShippingForm</code> is artificially slowed down!</b></p>
      <label>
        Number of items:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        Street:
        <input name="street" />
      </label>
      <label>
        City:
        <input name="city" />
      </label>
      <label>
        Postal code:
        <input name="zipCode" />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>


然而，这里的代码是一致的，只是 **移除了人为减缓的部分**。此时缺少 `useCallback` 是否会感觉明显？

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/ProductPage.js active
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // 想象这里发送了一个请求
  console.log('POST /' + url);
  console.log(data);
}
```

```js src/ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('Rendering <ShippingForm />');

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Number of items:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        Street:
        <input name="street" />
      </label>
      <label>
        City:
        <input name="city" />
      </label>
      <label>
        Postal code:
        <input name="zipCode" />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>


很多时候，没有记忆化的代码运行得也很好。如果你的交互已经足够快了，就不必去使用记忆化。

注意，如果你需要在生产模式下运行 React，请禁用 [React 开发者工具](/learn/react-developer-tools)，并使用与用户类似的设备，以便真实地了解实际减慢应用速度的因素。

<Solution />

</Recipes>

---

### 从记忆化回调中更新 state {/*updating-state-from-a-memoized-callback*/}

有时，你可能在记忆化回调中基于之前的 state 来更新 state。

下面的 `handleAddTodo` 函数将 `todos` 指定为依赖项，因为它会从中计算下一个 todos：

```js {6,7}
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos([...todos, newTodo]);
  }, [todos]);
  // ...
```

我们期望记忆化函数具有尽可能少的依赖，当你读取 state 只是为了计算下一个 state 时，你可以通过传递 [updater function](/reference/react/useState#updating-state-based-on-the-previous-state) 以移除该依赖：

```js {6,7}
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos(todos => [...todos, newTodo]);
  }, []); // ✅ 不需要 todos 依赖项
  // ...
```

在这里，并不是将 `todos` 作为依赖项并在内部读取它，而是传递一个关于 **如何** 更新 state 的指示器 (`todos => [...todos, newTodo]`) 给 React。[阅读更多有关 updater function 的内容](/reference/react/useState#updating-state-based-on-the-previous-state)。

---

### 防止频繁触发 Effect {/*preventing-an-effect-from-firing-too-often*/}

有时，你想要在 [Effect](/learn/synchronizing-with-effects) 内部调用函数：

```js {4-9,12}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  function createOptions() {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    // ...
```

这会产生一个问题，[每一个响应值都必须声明为 Effect 的依赖](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency)。但是如果将 `createOptions` 声明为依赖，它会导致 Effect 不断重新连接到聊天室：


```js {6}
  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // 🔴 问题：这个依赖在每一次渲染中都会发生改变
  // ...
```

为了解决这个问题，需要在 Effect 中将要调用的函数包裹在 `useCallback` 中：

```js {4-9,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const createOptions = useCallback(() => {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }, [roomId]); // ✅ 仅当 roomId 更改时更改

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // ✅ 仅当 createOptions 更改时更改
  // ...
```

这将确保如果 `roomId` 相同，`createOptions` 在多次渲染中会是同一个函数。**但是，最好消除对函数依赖项的需求**。将你的函数移入 Effect **内部**：

```js {5-10,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() { // ✅ 无需使用回调或函数依赖！
      return {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ 仅当 roomId 更改时更改
  // ...
```

现在你的代码变得更简单了并且不需要 `useCallback`。[阅读更多关于移除 Effect 依赖的信息](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)。

---

### 优化自定义 Hook {/*optimizing-a-custom-hook*/}

如果你正在编写一个 [自定义 Hook](/learn/reusing-logic-with-custom-hooks)，建议将它返回的任何函数包裹在 `useCallback` 中：

```js {4-6,8-10}
function useRouter() {
  const { dispatch } = useContext(RouterStateContext);

  const navigate = useCallback((url) => {
    dispatch({ type: 'navigate', url });
  }, [dispatch]);

  const goBack = useCallback(() => {
    dispatch({ type: 'back' });
  }, [dispatch]);

  return {
    navigate,
    goBack,
  };
}
```

这确保了 Hook 的使用者在需要时能够优化自己的代码。

---

## 疑难解答 {/*troubleshooting*/}

### 我的组件每一次渲染时，`useCallback` 都返回了完全不同的函数 {/*every-time-my-component-renders-usecallback-returns-a-different-function*/}

确保你已经将依赖数组指定为第二个参数！

如果你忘记使用依赖数组，`useCallback` 每一次都将返回一个新的函数：

```js {7}
function ProductPage({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }); // 🔴 每一次都返回一个新函数：没有依赖项数组
  // ...
```

这是将依赖项数组作为第二个参数传递的更正版本：

```js {7}
function ProductPage({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]); // ✅ 必要时返回一个新的函数
  // ...
```

如果这没有帮助，那么问题是至少有一个依赖项与之前的渲染不同。你可以通过手动将依赖项记录到控制台来调试此问题：

```js {5}
  const handleSubmit = useCallback((orderDetails) => {
    // ..
  }, [productId, referrer]);

  console.log([productId, referrer]);
```

然后，你可以在控制台中右键单击来自不同重新渲染的数组，并为它们选择“存储为全局变量”。假设第一个被保存为 `temp1`，第二个被保存为 `temp2`，然后你可以使用浏览器控制台检查两个数组中的每个依赖项是否相同：

```js
Object.is(temp1[0], temp2[0]); // 数组之间的第一个依赖关系是否相同？
Object.is(temp1[1], temp2[1]); // 数组之间的第二个依赖关系是否相同？
Object.is(temp1[2], temp2[2]); // 数组之间的每一个依赖关系是否相同...
```

当你发现是某一个依赖性破坏记忆化时，请尝试将其删除，或者 [也对其进行记忆化](/reference/react/useMemo#memoizing-a-dependency-of-another-hook)。

---

### 我需要在循环中为每一个列表项调用 `useCallback` 函数，但是这不被允许 {/*i-need-to-call-usememo-for-each-list-item-in-a-loop-but-its-not-allowed*/}

假设 `Chart` 组件被包裹在 [`memo`](/reference/react/memo) 中。你希望在 `ReportList` 组件重新渲染时跳过重新渲染列表中的每个 `Chart`。但是，你不能在循环中调用 `useCallback`。

```js {expectedErrors: {'react-compiler': [6]}} {5-14}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item => {
        // 🔴 你不能在循环中调用 useCallback：
        const handleClick = useCallback(() => {
          sendReport(item)
        }, [item]);

        return (
          <figure key={item.id}>
            <Chart onClick={handleClick} />
          </figure>
        );
      })}
    </article>
  );
}
```

相反，为单个项目提取一个组件，然后使用 `useCallback`：

```js {5,12-21}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item =>
        <Report key={item.id} item={item} />
      )}
    </article>
  );
}

function Report({ item }) {
  // ✅ 在最顶层调用 useCallback
  const handleClick = useCallback(() => {
    sendReport(item)
  }, [item]);

  return (
    <figure>
      <Chart onClick={handleClick} />
    </figure>
  );
}
```

或者，你可以删除最后一个代码段中的 `useCallback`，并将 `Report` 本身包装在 [`memo`](/reference/react/memo) 中。如果 `item` props 没有更改，`Report` 将跳过重新渲染，因此 `Chart` 也将跳过重新渲染：

```js {5,6-8,15}
function ReportList({ items }) {
  // ...
}

const Report = memo(function Report({ item }) {
  function handleClick() {
    sendReport(item);
  }

  return (
    <figure>
      <Chart onClick={handleClick} />
    </figure>
  );
});
```
