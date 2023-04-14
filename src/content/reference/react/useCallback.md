---
title: useCallback
---

<Intro>

`useCallback` 是一个让你在多次渲染中缓存函数定义的 React Hook

```js
const cachedFn = useCallback(fn, dependencies)
```

</Intro>

<InlineToc />

---

## 参考

### `useCallback(fn, dependencies)` {/*usecallback*/}

在你组件的顶层调用 `useCallback` 以便于在多次渲染中缓存函数：

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

[请看下面的更多例子](#usage)

#### 参数 {/*parameters*/}

* `fn` ： 你想要缓存的函数。 这个函数可以接受任何参数并且返回任何值。React将会在初次渲染中（并不是调用！）将这个函数返回。下一次渲染时, 如果 `dependencies` 自从上一次从未改变，React将会返回相同的函数。否则, React将返回你在最新一次渲染中传入的函数, 并且将其缓存下来以便稍后使用。 React将不会调用你的函数。这个函数返回给你，如此你可以决定何时调用它或者是否调用它。

* `dependencies` ：有关 `fn` 内部代码所有响应式值的一个列表。 Reactive values 包含 props、state，和所有在你组件内部直接声明的变量和函数。如果你的代码检查工具是 [configured for React](/learn/editor-setup#linting)， 那么它将校验每一个正确指定为依赖的响应式值。 依赖列表必须具有确切数量的项，并且像 `[dep1, dep2, dep3]` 的形式编写。React使用 [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 比较算法比较每一个依赖和它的先前值。

#### 返回值 {/*returns*/}

在初次渲染时，`useCallback` 返回你已经传入的 `fn` 函数

在随后的渲染中, `useCallback` 返回在上一次渲染中已经缓存的 `fn` 函数(如果依赖都没有改变的话)，或者返回你在这一次渲染中传入的 `fn` 函数

#### 警告 {/*caveats*/}

* `useCallback` 是一个Hook，所以你能在你 **组件的顶层** 或者你自定义的Hooks中调用。你不能在循环或者条件语句中调用它。如果你需要这样做，新建一个组件，并且将状态移入其中。
* React **将不会去丢弃已缓存的函数除非有特定的理由去那么做**。 比如，在开发中，当你编辑你的组件文件的时候，React会丢弃缓存。 在生产和开发环境中，如果你的组件在初次挂载中暂停，React将会丢弃缓存。将来, React可能会增加更多利用了丢弃缓存机制的特性-- 例如, 如果React在将来内置了对虚拟列表的支持，那么丢弃那些超出视口的项是有意义的。如果你依赖 `useCallback` 作为一个性能优化途径，那么这些对你会有帮助。不然，使用 [state variable](/reference/react/useState#im-trying-to-set-state-to-a-function-but-it-gets-called-instead) 或者 [ref](/reference/react/useRef#avoiding-recreating-the-ref-contents) 进行性能优化可能更好。

---

## 用法 {/*usage*/}

### 跳过组件的重新渲染 {/*skipping-re-rendering-of-components*/}

当你优化渲染性能的时候， 你有时需要缓存你传递给子组件的函数。让我们先关注一下如何实现，稍后去理解在哪些场景中它是有用的。

为了缓存你组件中多次渲染的函数，你需要将其定义在 `useCallback` Hook 中：

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

你需要传递两个参数给 `useCallback`:

1. 在多次渲染中需要缓存的函数
2. 你函数内部需要使用到的所有组件内部值的<CodeStep step={2}>依赖列表</CodeStep>。初次渲染时，你从 `useCallback` 获取到的返回函数将是你更改传递的。在随后的渲染里，React 将会把 <CodeStep step={2}>当前的依赖</CodeStep> 和已传入的先前依赖进行比较。如果没有任何依赖改变 (使用 [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 比较), `useCallback` 将会返回和之前一样的函数。 否则，`useCallback` 返回你在**这次**渲染中传递的函数。

在最初渲染时，你在 `useCallback` 处接收的<CodeStep step={3}>返回函数</CodeStep> 将会是你已经传入的函数。

简言之，`useCallback` 在多次渲染中缓存一个函数，直到这个函数的依赖发生改变。

**让我们通过一个示例看看它何时有用**

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

你已经注意到切换 `theme` prop会让应用停滞一小会，但如果你将 `<ShippingForm />` 从你的JSX中移除，应用反应迅速。这提示你尽力优化 `ShippingForm` 组件是值得的。

**默认情况下， 当一个组件重新渲染时, React将递归渲染它的所有子组件。** 这就是为什么, 当含有不同`theme` 值的 `ProductPage` 组件重新渲染时，`ShippingForm` 组件**也** 重新渲染。这对于不需要大量计算去重新渲染的组件来说影响很小。但如果你发现某次重新渲染很慢，你可以将 `ShippingForm` 组件包裹在 [`memo`](/reference/react/memo) 中。当它的 props 和上一个渲染相同时，告知 `ShippingForm` 组件跳过重新渲染
```js {3,5}
import { memo } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  // ...
});
```

**有了这个变化, `ShippingForm` 将跳过重新渲染，如果它的所有props都与上次渲染时相同。** 这时候缓存函数就变得很重要了！假设你定义了 `handleSubmit` 而没有定义 `useCallback`:

```js {2,3,8,12-13}
function ProductPage({ productId, referrer, theme }) {
  // 每一次theme改变的时候，都会生成一个不同的函数
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }
  return (
    <div className={theme}>
       {/*那么ShippingForm永远都不会是同一个，并且它每次都会重新渲染 */}
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );

```

**在JavaScript中， `function () {}` 或者 `() => {}` 总是会生成不同的函数，** 和字面对象 `{}` 总会创建新的对象类似。 正常情况下， 这不会产生问题， 但是这意味着 `ShippingForm` 的props将永远不会是相同的，并且你的 [`memo`](/reference/react/memo) 优化永远不会生效。这就是 `useCallback` 起作用的地方：
```js {2,3,8,12-13}
function ProductPage({ productId, referrer, theme }) { 
  // 告知React在多次渲染中缓存你的函数
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]); // 所以只要这些依赖没有发生改变

  return (
    <div className={theme}>
      {/* ShippingForm 就会收到同样的prop并且跳过重新渲染*/}
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );

```

**通过将 `handleSubmit`包裹在 `useCallback` 中，你可以确保它在多次重新渲染之间是 *相同的* 函数** (直到依赖发生改变)。除非你出于某种特定原因这样做，否则你不必将一个函数包裹在 `useCallback` 中。在本例中，理由是你将他传递到了包裹在 [`memo`](/reference/react/memo) 中的组件，这允许它跳过重新渲染。还有其他原因你可能需要用到 `useCallback`，本页将对此进行进一步描述。

<Note>

**你应该只依赖 `useCallback` 作为性能优化。** 如果你的代码在没有它的情况下无法运行，请找到根本问题并首先修复它。然后你可以将 `useCallback` 添加回来。

</Note>

<DeepDive>

#### useCallback 与 useMemo 有何关系？ {/*how-is-usecallback-related-to-usememo*/}

你经常会看到 [`useMemo`](/reference/react/useMemo) 伴随着 `useCallback` 出现。当你尝试优化子组件时，它们都很有用。他们让你[记住](https://en.wikipedia.org/wiki/Memoization) （或者，换句话说，缓存）你正在传递的东西：

```js {6-8,10-15,19}
import { useMemo, useCallback } from 'react';

function ProductPage({ productId, referrer }) {
  const product = useData('/product/' + productId);

  const requirements = useMemo(() => { //调用函数并且缓存它的结果
    return computeRequirements(product);
  }, [product]);

  const handleSubmit = useCallback((orderDetails) => {  // 缓存函数本身
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
```

区别在于他们让你缓存的**什么**:

* **[`useMemo`](/reference/react/useMemo) 缓存调用函数的结果。** 在本例中，它缓存了 `computeRequirements(product)` 调用的结果。这样它不会发生改变，除非 `product` 发生改变。这让你向下传递 `requirements` 对象，而无需不必要地重新渲染 `ShippingForm` 。必要时，React将会调用你传入的函数去计算结果。

* **`useCallback` 缓存函数本身。** 不像 `useMemo` ，它不会调用你传入地方函数。相反，它缓存你提供的函数，以便 `handleSubmit` **它自己**不会发生改变除非 `productId` 或者 `referrer` 发生了改变。这让你向下传递 `handleSubmit` 函数而无需不必要地重新渲染`ShippingForm`。你的代码将不会运行，直到用户提交表单。

如果你已经熟悉了 [`useMemo`](/reference/react/useMemo)，你可能发现将 `useCallback` 视为以下内容会很有帮助：

```js
// 简化的实现（在 React 内部）
function useCallback(fn, dependencies) {
  return useMemo(() => fn, dependencies);
}
```

[阅读更多关于 `useMemo` 和 `useCallback` 之间区别的信息](/reference/react/useMemo#memoizing-a-function)。

</DeepDive>

<DeepDive>

#### 是否应该在任何地方添加 useCallback？ {/*should-you-add-usecallback-everywhere*/}

如果你的应用程序与本网站类似，并且大多数交互都很粗糙（例如替换页面或整个部分），则通常不需要记忆。另一方面，如果你的应用更像是一个绘图编辑器，并且大多数交互都是精细的（如移动形状），那么你可能会发现记忆非常有用。

使用 `useCallback` 缓存函数仅在少数情况下有价值：

- 你可以将其作为prop传递给包装在 [`memo`] 中的组件。如果值未更改，则希望跳过重新渲染。记忆允许组件仅在依赖项更改时重新渲染。

- 你传递的函数稍后会作为一些Hook的依赖。比如，另一个包裹在 `useCallback` 中的函数依赖于它，或者你依赖于 [`useEffect`](/reference/react/useEffect) 中的函数

在其他情况下，将函数包装在 `useCallback` 中没有任何益处。这样做也没有很大的害处。所以有些团队选择不考虑个案，并且尽可能记住。不好的部分是代码可读性降低了。而且，并不是所有的记忆都是有效的：一个 “始终新” 的值足以破坏整个组件的记忆。

请注意，`useCallback` 不会阻止函数的**创建**。你总是在创建一个函数（这很好！），但是 React 忽略了它并且返回给你一个缓存的函数，如果没有任何东西改变的话。

**在实践中, 你可以通过遵循一些原则创建大部分不必要的记忆**

1. 当一个组件在视觉上包装其他组件时，让它 [接受JSX作为子组件](/learn/passing-props-to-a-component#passing-jsx-as-children)。随后，如果包装组件更新自己的状态，React知道它的子组件不需要重新渲染。
1. 推荐本地状态并且不要[提升状态](/learn/sharing-state-between-components)超过必要的程度。不要保留瞬态状态（如窗体），也不要保留在你树顶部或者在全局状态库的项。
1. 保持你的[渲染逻辑纯正]（/learn/keeping-components-pure）如果重新渲染组件会导致问题或产生一些明显的视觉伪影，则这是组件中的错误！修复这个错误，而不是添加记忆。
1. 避免[不必要的更新状态的副作用](/learn/you-might-not-need-an-effect)。React 应用程序中的大多数性能问题都是由Effects的更新链引起的，这些更新链导致组件一遍又一遍地渲染。
1. 尝试[从副作用中删除不必要的依赖关系](/learn/removing-effect-dependencies)。例如，将某些对象或函数移动到副作用内部或组件外部通常更简单，而不是记忆。

如果特定的交互仍然感觉滞后，[使用 React 开发者工具](/blog/2018/09/10/introducing-the-react-profiler.html)查看哪些组件从记忆中受益最大，并在需要时添加记忆。这些原则使你的组件更易于调试和理解，因此在任何情况下都最好遵循它们。从长远来看，我们正在研究[自动记忆](https://www.youtube.com/watch?v=lGEMwh32soc)一劳永逸地解决这个问题。
</DeepDive>

<Recipes titleText="useCallback 和直接声明函数的区别" titleId="examples-rerendering">

#### 使用 `useCallback` 和 `memo` 跳过函数的重新渲染 {/*skipping-re-rendering-with-usecallback-and-memo*/}

在这个例子中，`ShippingForm` 组件被人为地减慢了速度，以便你可以看到当你渲染的React组件真正变慢时会发生什么。尝试递增计数器并切换主题。

递增计数器感觉很慢，因为它会强制变慢的 `ShippingForm` 重新渲染。这是意料之中的，因为计数器已更改，因此你需要在屏幕上反映用户的新选择。

接下来，尝试更改主题。 **感谢 `useCallback` 和 [`memo`](/reference/react/memo)的结合使用, 尽管人为地变慢了速度，但它还是很快** `ShippingForm` 跳过了重新渲染，因为 `handleSubmit` 函数没有改变。`handleSubmit` 函数没有发生改变，因为 `productId` 和`referrer` （你的 `useCallback` 依赖）自从上次渲染到现在都没有发生改变。

<Sandpack>

```js App.js
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

```js ProductPage.js active
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

```js ShippingForm.js
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

#### 始终重新渲染组件{/*always-re-rendering-a-component*/}
在本例中， `ShippingForm` 的实现也被人为地减慢了速度，这样你可以看到当你渲染的某些 React 组件运行很慢时会发生什么。尝试递增计数器并切换主题。

与前面示例不同，现在切换主题也很慢！这是因为**在这个版本中没有调用 `useCallback`** ，所以 `handleSubmit` 总是一个新函数，并且被减速的`ShippingForm` 组件不能跳过重新渲染。

<Sandpack>

```js App.js
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

```js ProductPage.js active
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

```js ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('[ARTIFICIALLY SLOW] Rendering <ShippingForm />');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
     //500 毫秒内不执行任何操作来模拟极慢的代码
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

然而， 这里的代码相同，但是**被人为减慢的代码被移除**，缺少 `useCallback` 是否感觉明显？

<Sandpack>

```js App.js
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

```js ProductPage.js active
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

```js ShippingForm.js
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


很多时候，没有记忆的代码运行得也很好， 如果你的交互已经足够快了， 你不必去使用记忆。

请记住，你需要在生产模式下运行React，禁用 [React Developer Tools](/learn/react-developer-tools)，并使用与应用用户类似的设备，以便真实地了解实际减慢应用速度的因素。

<Solution />

</Recipes>

---

### 从记忆了的 callback 中更新状态 {/*updating-state-from-a-memoized-callback*/}

有时， 你可能需要基于来自记忆callback的先前状态去更新状态。

这个 `handleAddTodo` 函数将 `todos` 指定为依赖项，因为它从中计算下一个todos：

```js {6,7}
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos([...todos, newTodo]);
  }, [todos]);
  // ...

```

你经常希望有记忆的函数有尽可能少的依赖，当你读取某个状态只是为了计算下一个状态时，你可以通过传递 [updater function](/reference/react/useState#updating-state-based-on-the-previous-state)函数去移除该依赖：

```js {6,7}
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos(todos => [...todos, newTodo]);
  }, []); // ✅ 不需要 todos 依赖项
  // ...

```

在这里，并不是将 `todos` 作为依赖项并且在内部读取它，而是传递一个关于**如何**更新状态的指示器(`todos => [...todos, newTodo]`)给React [Read more about updater functions](/reference/react/useState#updating-state-based-on-the-previous-state)。

---
### 防止频繁触发副作用 {/*preventing-an-effect-from-firing-too-often*/}

有时，你可能想要在[副作用](/learn/synchronizing-with-effects)：内部调用函数

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
    const connection = createConnection();
    connection.connect();
    // ...
  })

```

这会产生一个问题，[每一个响应值都必须声明为副作用的依赖](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency)。 然而, 如果你将`createOptions` 声明为一个依赖， 它会导致你的副作用不断重新连接到聊天室：

```js {6}
  useEffect(() => {
    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // 🔴 问题：这个依赖在每一次渲染中都会发生改变
  // ...
```

解决这个问题， 你可以将你需要在副作用里面调用的函数包裹在 `useCallback` 中:
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
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // ✅ 仅当 createOptions 更改时更改
  // ...
}
```

这确保了如果 `roomId`相同， `createOptions` 在多次渲染中会是同一个函数。**但是，最好消除对函数依赖项的需求。** 将你的函数移入副作用**内部**：

```js {5-10,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() { // ✅无需使用回调或函数依赖！
      return {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅仅当 roomId 更改时更改
  // ...

```
现在你的代码变得更简单了并且不需要 `useCallback`。 [了解更多关于移除副作用依赖的详细信息](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)。

---

### 优化自定义 Hook{/*optimizing-a-custom-hook*/}
如果你在编写一个[自定义 Hook](/learn/reusing-logic-with-custom-hooks)，建议将它返回的任何函数包裹到 `useCallback` 中：

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

这确保了 hook 的使用者在需要时优化自己的代码

---

## 疑难解答 {/*troubleshooting*/}

### 我的组件每一次渲染时, `useCallback` 返回一个完全不同的函数{/*every-time-my-component-renders-usecallback-returns-a-different-function*/}

确保你已经将依赖数组指定为第二个参数！

如果你忘记了依赖数组, `useCallback` 每一次将返回一个新的函数：

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
}
```

如果这没有帮助，那么问题是至少有一个依赖项与以前的渲染不同。你可以通过手动将依赖项记录到控制台来调试此问题：

```js {5}

  const handleSubmit = useCallback((orderDetails) => {
    // ..
  }, [productId, referrer]);

  console.log([productId, referrer]);
```

然后，你可以在控制台中右键单击来自不同重新渲染的数组，并为它们选择“存储为全局变量”。假设第一个被保存为 `temp1` ，第二个被保存为   `temp2` ，然后你可以使用浏览器控制台检查两个数组中的每个依赖项是否相同：

```js
Object.is(temp1[0], temp2[0]); // 数组之间的第一个依赖关系是否相同？
Object.is(temp1[1], temp2[1]); // 数组之间的第二个依赖关系是否相同？
Object.is(temp1[2], temp2[2]); // ...  数组之间的每一个依赖关系是否相同...
```

当你发现哪个依赖项破坏了记忆时，请找到一种方法将其删除，或者[将其也记忆起来](/reference/react/useMemo#memoizing-a-dependency-of-another-hook)。

---

### 我需要在循环中为每一个列表项调用 `useCallback` 函数，但是这不被允许 {/*i-need-to-call-usememo-for-each-list-item-in-a-loop-but-its-not-allowed*/}

假设 `Chart` 组件被包裹在 [`memo`](/reference/react/memo) 中。你希望在 `ReportList` 组件重新呈现时跳过重新渲染列表中的每个 `Chart`。但是， 你不能在循环中调用 `useCallback` 。

```js {5-14}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item => {
        // 🔴 你不能在这样的循环中调用 useCallback：
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

相反，为单个项目提取一个组件，并将 `useCallback` 放在那里：

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

或者，你可以删除最后一个代码段中的 `useCallback`，而是将 `Report` 本身包装在 [`memo`](/reference/react/memo) 中。如果 `item` prop 没有更改，`Report` 将跳过重新渲染，因此 `Chart` 也将跳过重新渲染：

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