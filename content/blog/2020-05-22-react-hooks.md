---
title: "React Hook 最佳实践"
author: [x-orpheus]
redirect_from:
  - "blog/2020/05/22/react-hook.html"
---

![](https://p1.music.126.net/ONBvYa_yYg6QWEEn9KmWoQ==/109951164867829503.jpg)

> 本文发布自 [网易云音乐前端团队](https://github.com/x-orpheus)，文章未经授权禁止任何形式的转载。团队持续招人中，如果你恰好准备换工作，又恰好喜欢云音乐，那就 [加入我们](mailto:grp.music-fe@corp.netease.com)！

## 写在前面

在过去的几个月里，React Hooks 在我们的项目中得到了充分利用。在实际使用过程中，我发现 React Hooks 除了带来简洁的代码外，也存在对其使用不当的情况。

在这篇文章中，我想总结我过去几个月来对 React Hooks 使用，分享我对它的看法以及我认为的最佳实践，供大家参考。

本文假定读者已经对 React-Hooks 及其使用方式有了初步的了解。您可以通过 [官方文档](/docs/hooks-intro.html) 进行学习。

## 函数式组件

简而言之，就是在一个函数中返回 React Element。

```jsx
const App = (props) => {
    const { title } = props;
    return (
        <h1>{title}</h1>
    );  
};

```

一般的，该函数接收唯一的参数：props 对象。从该对象中，我们可以读取到数据，并通过计算产生新的数据，最后返回 React Elements 以交给 React 进行渲染。此外也可以选择在函数中执行副作用。

在本文中，我们给函数式组件的函数起个简单一点的名字：render 函数。

```js
const appElement = App({ title: "XXX" });
ReactDOM.render(
    appElement,
    document.getElementById('app')
);
```

在上方的代码中，我们自行调用了 render 函数以期执行渲染。然而这在 React 中不是正常的操作。

正常操作是像下方这样的代码：

```jsx
// React.createElement(App, {
//     title: "XXX"
// });
const appElement = <App title="XXX" />;
ReactDOM.render(
    appElement,
    document.getElementById('app')
);
```

在 React 内部，它会决定在何时调用 render 函数，并对返回的 React Elements 进行遍历，如果遇到函数组件，React 便会继续调用这个函数组件。在这个过程中，可以由父组件通过 props 将数据传递到该子组件中。最终 React 会调用完所有的组件，从而知晓如何进行渲染。

这种把 render 函数交给 React 内部处理的机制，为引入状态带来了可能。

在本文中，为了方便描述，对于 render 函数的每次调用，我想称它为一帧。

## 每一帧拥有独立的变量

在引入状态之前，我们需要明白这一点。

我们通过 *例一* 进行观察：

[![Edit 1. 每一帧拥有独立的变量](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/serverless-microservice-35z1y?fontsize=14&hidenavigation=1&module=%2Fsrc%2FExample.js&theme=dark)

```jsx
function Example(props) {
    const { count } = props;
    const handleClick = () => {
        setTimeout(() => {
            alert(count);
        }, 3000);
    };
    return (
        <div>
            <p>{count}</p>
            <button onClick={handleClick}>Alert Count</button>
        </div>
    );
}
```

重点关注 `<Example>` 函数组件的代码，其中的 `count` 属性由父组件传入，初始值为 0，每隔一秒增加 1。点击 "Alert Count" 按钮，将延迟 3 秒钟弹出 `count` 的值。操作后发现，弹窗中出现的值，与页面中文本展示的值不同，而是等于点击 "alert Count" 按钮时 `count` 的值。

如果更换为 class 组件，它的实现是 `<Example2>` 这样的：

```jsx
class Example2 extends Component {
    handleClick = () => {
        setTimeout(() => {
            alert(this.props.count);
        }, 3000);
    };

    render() {
        return (
            <div>
                <h2>Example2</h2>
                <p>{this.props.count}</p>
                <button onClick={this.handleClick}>Alert Count</button>
            </div>
        );
    }
}
```

此时，点击 "Alert Count" 按钮，延迟 3 秒钟弹出 `count` 的值，与页面中文本展示的值是一样的。

在某些情况下，`<Example>` 函数组件中的行为才符合预期。如果将 `setTimeout` 类比到一次 Fetch 请求，在请求成功时，我要获取的是发起 Fetch 请求前相关的数据，并对其进行修改。

如何理解其中的差异呢？

在 `<Example2>` class 组件中，我们是从 `this` 中获取到的 `props.count`。`this` 是固定指向同一个组件实例的。在 3 秒的延时器生效后，组件重新进行了渲染，`this.props` 也发生了改变。当延时的回调函数执行时，读取到的 `this.props` 是当前组件最新的属性值。

而在 `<Example>` 函数组件中，每一次执行 render 函数时，`props` 作为该函数的参数传入，它是函数作用域下的变量。

当 `<Example>` 组件被创建，将运行类似这样的代码来完成第一帧：

```jsx
const props_0 = { count: 0 };

const handleClick_0 = () => {
    setTimeout(() => {
        alert(props_0.count);
    }, 3000);
};
return (
    <div>
        <h2>Example</h2>
        <p>{props_0.count}</p>
        <button onClick={handleClick_0}>alert Count</button>
    </div>
);
```

当父组件传入的 count 变为 1，React 会再次调用 `Example` 函数，执行第二帧，此时 `count` 是 `1`。

```jsx
const props_1 = { count: 1 };

const handleClick_1 = () => {
    setTimeout(() => {
        alert(props_1.count);
    }, 3000);
};
return (
    <div>
        <h2>Example</h2>
        <p>{props_1.count}</p>
        <button onClick={handleClick_1}>alert Count</button>
    </div>
);
```

由于 `props` 是 `Example` 函数作用域下的变量，可以说对于这个函数的每一次调用中，都产生了新的 `props` 变量，它在声明时被赋予了当前的属性，他们相互间互不影响。

换一种说法，对于其中任一个 `props` ，其值在声明时便已经决定，不会随着时间产生变化。`handleClick` 函数亦是如此。例如定时器的回调函数是在未来发生的，但 `props.count` 的值是在声明 `handleClick` 函数时就已经决定好的。

如果我们在函数开头使用解构赋值，`const { count } = props`，之后直接使用 `count`，和上面的情况没有区别。

## 状态

可以简单的认为，在某个组件中，对于返回的 React Elements 树形结构，某个位置的 element ，其类型与 key 属性均不变，React 便会选择重用该组件实例；否则，比如从 `<A/>` 组件切换到了 `<B/>` 组件，会销毁 A，然后重建 B，B 此时会执行第一帧。

在实例中，可以通过 `useState` 等方式拥有局部状态。在重用的过程中，这些状态会得到保留。而如果无法重用，状态会被销毁。

例如 `useState`，为当前的函数组件创建了一个状态，这个状态的值独立于函数存放。 `useState` 会返回一个数组，在该数组中，得到该状态的值和更新该状态的方法。通过解构，该状态的值会赋值到当前 render 函数作用域下的一个常量 `state` 中。

```js
const [state, setState] = useState(initialState);
```

当组件被创建而不是重用时，即在组件的第一帧中，该状态将被赋予初始值 `initialState`，而之后的重用过程中，不会被重复赋予初始值。

通过调用 `setState` ，可以更新状态的值。

## 每一帧拥有独立的状态

需要明确的是，`state` 作为函数中的一个常量，就是普通的数据，并不存在诸如数据绑定这样的操作来驱使 DOM 发生更新。在调用 `setState` 后，React 将重新执行 render 函数，仅此而已。

因此，状态也是函数作用域下的普通变量。我们可以说每次函数执行拥有独立的状态。

为了加深印象，我们来看 *例二*，它是 React 官网某个例子的复杂化：

[![Edit 每一帧拥有独立的状态](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/hardcore-fast-66u24?fontsize=14&hidenavigation=1&theme=dark)

```jsx
function Example2() {
    const [count, setCount] = useState(0);

    const handleClick = () => {
        setTimeout(() => {
            setCount(count + 1);
        }, 3000);
    };

    return (
        <div>
            <p>{count}</p>
            <button onClick={() => setCount(count + 1)}>
                setCount
            </button>
            <button onClick={handleClick}>
                Delay setCount
            </button>
        </div>
    );
}
```

在第一帧中，`p` 标签中的文本为 0。点击 "Delay setCount"，文本依然为 0。随后在 3 秒内连续点击 "setCount" 两次，将会分别执行第二帧和第三帧。你将看到 `p` 标签中的文本由 0 变化为 1, 2。但在点击 "Delay setCount" 3 秒后，文本重新变为 1。

```jsx
// 第一帧
const count_1 = 0;

const handleClick_1 = () => {
    const delayAction_1 = () => {
        setCount(count_1 + 1);
    };
    setTimeout(delayAction_1, 3000);
};

//...
<button onClick={handleClick_1}>
//...

// 点击 "setCount" 后第二帧
const count_2 = 1;

const handleClick_2 = () => {
    const delayAction_2 = () => {
        setCount(count_2 + 1);
    };
    setTimeout(delayAction_2, 3000);
};

//...
<button onClick={handleClick_2}>
//...

// 再次点击 "setCount" 后第三帧
const count_3 = 2;

const handleClick_3 = () => {
    const delayAction_3 = () => {
        setCount(count_3 + 1);
    };
    setTimeout(delayAction_3, 3000);
};

//...
<button onClick={handleClick_3}>
//...
```

`count`，`handleClick` 都是 `Example2` 函数作用域中的常量。在点击 "Delay setCount" 时，定时器设置 3000ms 到期后的执行函数为 `delayAction_1`，函数中读取 `count_1` 常量的值是 0，这和第二帧的 `count_2` 无关。

## 获取过去或未来帧中的值

对于 state，如果想要在第一帧时点击 "Delay setCount" ，在一个异步回调函数的执行中，获取到 `count` 最新一帧中的值，不妨向 `setCount` [传入函数作为参数](https://reactjs.org/docs/hooks-reference.html#functional-updates)。

其他情况下，例如需要读取到 state 及其衍生的某个常量，相对于变量声明时所在帧过去或未来的值，就需要使用 `useRef`，通过它来拥有一个在所有帧中共享的变量。

如果要与 class 组件进行比较，`useRef` 的作用相对于让你在 class 组件的 `this` 上追加属性。

```js
const refContainer = useRef(initialValue);
```

在组件的第一帧中，`refContainer.current` 将被赋予初始值 `initialValue`，之后便不再发生变化。但你可以自己去设置它的值。设置它的值不会重新触发 render 函数。

例如，我们把第 n 帧的某个 props 或者 state 通过 `useRef` 进行保存，在第 n + 1 帧可以读取到过去的，第 n 帧中的值。我们也可以在第 n + 1 帧使用 ref 保存某个 props 或者 state，然后在第 n 帧中声明的异步回调函数中读取到它。

对 *例二* 进行修改，得到 *例三*，看看具体的效果：

[![Edit 获取过去或未来帧中的值
](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/recursing-dan-b1syo?fontsize=14&hidenavigation=1&theme=dark)

```jsx
function Example() {
    const [count, setCount] = useState(0);

    const currentCount = useRef(count);

    currentCount.current = count;

    const handleClick = () => {
        setTimeout(() => {
            setCount(currentCount.current + 1);
        }, 3000);
    };

    return (
        <div>
            <p>{count}</p>
            <button onClick={() => setCount(count + 1)}>
                setCount
            </button>
            <button onClick={handleClick}>
                Delay setCount
            </button>
        </div>
    );
}
```

在 `setCount` 后便会执行下一帧，在函数的开头，
`currentCount` 始终与最新的 `count` state 保持同步。因此，在 `setTimeout` 中可以通过此方法获取到回调函数执行时当前的 count 值。

接下来再通过 *例四* 了解如何获取过去帧中的值：

[![Edit 获取过去帧中的值](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/snowy-voice-e4lyn?fontsize=14&hidenavigation=1&theme=dark)

```jsx
function Example4() {
    const [count, setCount] = useState(1);

    const prevCountRef = useRef(1);
    const prevCount = prevCountRef.current;
    prevCountRef.current = count;

    const handleClick = () => {
        setCount(prevCount + count);
    };

    return (
        <div>
            <p>{count}</p>
            <button onClick={handleClick}>SetCount</button>
        </div>
    );
}
```

这段代码实现的功能是，count 初始值为 1，点击按钮后累加到 2，随后点击按钮，总是用当前 count 的值和前一个 count 的值进行累加，得到新的 count 的值。

`prevCountRef` 在 render 函数执行的过程中，与最新的 `count` state 进行了同步。由于在同步前，我们将该 ref 保存到函数作用域下的另一个变量 `prevCount` 中，因此我们总是能够获取到前一个 count 的值。

同样的方法，我们可以用于保存任何值：某个 prop，某个 state 变量，甚至一个函数等。在后面的 Effects 部分，我们会继续使用 refs 为我们带来好处。

## 每一帧可以拥有独立的 Effects

如果弄清了前面的『每一帧拥有独立的变量』的概念，你会发现，若某个 useEffect/useLayoutEffect 有且仅有一个函数作为参数，那么每次 render 函数执行时该 Effects 也是独立的。因为它是在 render 函数中选择适当时机的执行。

对于 `useEffect` 来说，执行的时机是完成所有的 DOM 变更并让浏览器渲染页面后，而 `useLayoutEffect` 和 class 组件中 `componentDidMount`, `componentDidUpdate `一致——在 React 完成 DOM 更新后马上同步调用，会阻塞页面渲染。

如果 useEffect 没有传入第二个参数，那么第一个参数传入的 effect 函数在每次 render 函数执行是都是独立的。每个 effect 函数中捕获的 props 或 state 都来自于那一次的 render 函数。

我们可以再观察一个例子：

```jsx
function Counter() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        setTimeout(() => {
            console.log(`You clicked ${count} times`);
        }, 3000);
    });

    return (
        <div>
            <p>You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>
                Click me
        </button>
        </div>
    );
}
``` 

在这个例子中，每一次对 `count` 进行改变，重新执行 render 函数后，延迟 3 秒打印 `count` 的值。

如果我们不停地点击按钮，打印的结果是什么呢？

我们发现经过延时后，每个 count 的值被依次打印了，他们从 0 开始依次递增，且不重复。

如果换成 class 组件，尝试使用 `componentDidUpdate` 去实现，会得到不一样的结果：

```jsx
componentDidUpdate() {
    setTimeout(() => {
        console.log(`You clicked ${this.state.count} times`);
    }, 3000);
}
```

`this.state.count` 总是指向最新的 `count` 值，而不是属于某次调用 render 函数时的值。

因此，在使用 useEffect 时，应当抛开在 class 组件中关于生命周期的思维。他们并不相同。在 useEffect 中刻意寻找那几个生命周期函数的替代写法，将会陷入僵局，无法充分发挥 useEffect 的能力。

## 在比对中执行 Effects

React 针对 React Elements 前后值进行对比，只去更新 DOM 真正发生改变的部分。对于 Effects，能否有类似这样的理念呢？

某个 Effects 函数一旦执行，函数内的副作用已经发生，React 无法猜测到函数相比于上一次做了哪些变化。但我们可以给 useEffect 传入第二个参数，作为依赖数组 (deps)，避免 Effects 不必要的重复调用。

这个 deps 的含义是：当前 Effect 依赖了哪些变量。

但有时问题不一定能解决。比如官网就有 [这样的例子](https://zh-hans.reactjs.org/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often)：

```jsx
const [count, setCount] = useState(0);

useEffect(() => {
    const id = setInterval(() => {
        setCount(count + 1);
    }, 1000);
    return () => clearInterval(id);
}, [count]);
```

如果我们频繁修改 `count`，每次执行 Effect，上一次的计时器被清除，需要调用 `setInterval` 重新进入时间队列，实际的定期时间被延后，甚至有可能根本没有机会被执行。

但是下面这样的实践方式也不宜采用：

在 Effect 函数中寻找一些变量添加到 deps 中，需要满足条件：其变化时，需要重新触发 effect。

按照这种实践方式，`count` 变化时，我们并不希望重新 `setInterval`，故 deps 为空数组。这意味着该 hook 只在组件挂载时运行一次。Effect 中明明依赖了 `count`，但我们撒谎说它没有依赖，那么当 `setInterval` 回调函数执行时，获取到的 `count` 值永远为 0。

遇到这种问题，直接从 deps 移除是不可行的。静下来分析一下，此处为什么要用到 `count`？能否避免对其直接使用？

可以看到，在 `setCount` 中用到了 `count`，为的是把 `count` 转换为 `count + 1` ，然后返回给 React。React 其实已经知道当前的 `count`，我们需要告知 React 的仅仅是去递增状态，不管它现在具体是什么值。

所以有一个最佳实践：状态变更时，应该通过 setState 的函数形式来代替直接获取当前状态。

```js
setCount(c => c + 1);
```

另外一种场景是：

```jsx
const [count, setCount] = useState(0);

useEffect(() => {
    const id = setInterval(() => {
        console.log(count);
    }, 1000);
    return () => clearInterval(id);
}, []);
```

在这里，同样的，当`count` 变化时，我们并不希望重新 `setInterval`。但我们可以把 `count` 通过 ref 保存起来。

```jsx
const [count, setCount] = useState(0);
const countRef = useRef();
countRef.current = count;

useEffect(() => {
    const id = setInterval(() => {
        console.log(countRef.current);
    }, 1000);
    return () => clearInterval(id);
}, []);
```

这样，`count` 的确不再被使用，而是用 ref 存储了一个在所有帧中共享的变量。

另外的情况是，Effects 依赖了函数或者其他引用类型。与原始数据类型不同的是，在未优化的情况下，每次 render 函数调用时，因为对这些内容的重新创建，其值总是发生了变化，导致 Effects 在使用 deps 的情况下依然会频繁被调用。

对于这个问题，[官网的 FAQ](https://zh-hans.reactjs.org/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies) 已经给出了答案：对于函数，使用 useCallback 避免重复创建；对于对象或者数组，则可以使用 useMemo。从而减少 deps 的变化。

## 使用 ESLint 插件

使用 ESLint 插件 `eslint-plugin-react-hooks@>=2.4.0`，很有必要。

该插件除了帮你检查[使用 Hook 需要遵循的两条规则](https://zh-hans.reactjs.org/docs/hooks-rules.html#only-call-hooks-at-the-top-level)外，还会向你提示在使用 useEffect 或者 useMemo 时，deps 应该填入的内容。

如果你正在使用 VSCode，并且安装了 ESLint 扩展。当你编写 useEffect 或者 useMemo ，且 deps 中的内容并不完整时，deps 所在的那一行便会给出警告或者错误的提示，并且会有一个快速修复的功能，该功能会为你自动填入缺失的 deps。

对于这些提示，不要暴力地通过 `eslint-disable` 禁用。未来，你可能再次修改该 useEffect 或者 useMemo，如果使用了新的依赖并且在 deps 中漏掉了它，便会引发新的问题。有一些场景，比如 useEffect 依赖一个函数，并且填入 deps 了。但是这个函数使用了 useCallback 且 deps 出现了遗漏，这种情况下一旦出现问题，排查的难度会很大，所以为什么要让 ESLint 沉默呢？

尝试用上一节的方法进行分析，对于一些变量不希望引起 effect 重新更新的，使用 ref 解决。对于获取状态用于计算新的状态的，尝试 setState 的函数入参，或者使用 useReducer 整合多个类型的状态。

## 使用 useMemo/useCallback

useMemo 的含义是，通过一些变量计算得到新的值。通过把这些变量加入依赖 deps，当 deps 中的值均未发生变化时，跳过这次计算。useMemo 中传入的函数，将在 render 函数调用过程被同步调用。

可以使用 useMemo 缓存一些相对耗时的计算。

除此以外，useMemo 也非常适合用于存储引用类型的数据，可以传入对象字面量，匿名函数等，甚至是 React Elements。

```jsx
const data = useMemo(() => ({
    a,
    b,
    c,
    d: 'xxx'
}), [a, b, c]);

// 可以用 useCallback 代替
const fn = useMemo(() => () => {
    // do something
}, [a, b]);

const memoComponentsA = useMemo(() => (
    <ComponentsA {...someProps} />
), [someProps]);
```

在这些例子中，useMemo 的目的其实是尽量使用缓存的值。

对于函数，其作为另外一个 useEffect 的 deps 时，减少函数的重新生成，就能减少该 Effect 的调用，甚至避免一些死循环的产生;

对于对象和数组，如果某个子组件使用了它作为 props，减少它的重新生成，就能避免子组件不必要的重复渲染，提升性能。

未优化的代码如下：

```jsx
const data = { id };

return <Child data={data}>;
```

此时，每当父组件需要 render 时，子组件也会执行 render。如果使用 `useMemo` 对 data 进行优化：

```jsx
const data = useMemo(() => ({ id }), [id]);

return <Child data={data}>;
```

当父组件 render 时，只要满足 id 不变，data 的值也不会发生变化，子组件也将避免 render。

对于组件返回的 React Elements，我们可以选择性地提取其中一部分 elements，通过 useMemo 进行缓存，也能避免这一部分的重复渲染。

在过去的 class 组件中，我们通过 `shouldComponentUpdate` 判断当前属性和状态是否和上一次的相同，来避免组件不必要的更新。其中的比较是对于本组件的所有属性和状态而言的，无法根据 `shouldComponentUpdate` 的返回值来使该组件一部分 elements 更新，另一部分不更新。

为了进一步优化性能，我们会对大组件进行拆分，拆分出的小组件只关心其中一部分属性，从而有更多的机会不去更新。

而函数组件中的 useMemo 其实就可以代替这一部分工作。为了方便理解，我们来看 *例五*：

[![Edit 使用 useMemo 缓存 React Elements
](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/goofy-grothendieck-tkmow?fontsize=14&hidenavigation=1&module=%2Fsrc%2FExample.js&theme=dark)

```jsx
function Example(props) {
    const [count, setCount] = useState(0);
    const [foo] = useState("foo");

    const main = (
        <div>
            <Item key={1} x={1} foo={foo} />
            <Item key={2} x={2} foo={foo} />
            <Item key={3} x={3} foo={foo} />
            <Item key={4} x={4} foo={foo} />
            <Item key={5} x={5} foo={foo} />
        </div>
    );

    return (
        <div>
            <p>{count}</p>
            <button onClick={() => setCount(count + 1)}>setCount</button>
            {main}
        </div>
    );
}
```

假设 `<Item>` 组件，其自身的 render 消耗较多的时间。默认情况下，每次 setCount 改变 count 的值，便会重新对 `<Example>` 进行 render，其返回的 React Elements 中 5 个 `<Item>` 也重新 render，其耗时的操作阻塞了 UI 的渲染。导致按下 "setCount" 按钮后出现了明显的卡顿。

为了优化性能，我们可以将 `main` 变量这一部分单独作为一个组件 `<Main>`，拆分出去，并对  `<Main>` 使用诸如 `React.memo` , `shouldComponentUpdate` 的方式，使 `count` 属性变化时，`<Main>` 不重复 render。

```jsx
const Main = React.memo((props) => {
    const { foo }= props;
    return (
        <div>
            <Item key={1} x={1} foo={foo} />
            <Item key={2} x={2} foo={foo} />
            <Item key={3} x={3} foo={foo} />
            <Item key={4} x={4} foo={foo} />
            <Item key={5} x={5} foo={foo} />
        </div>
    );
});
```

而现在，我们可以使用 `useMemo`，避免了组件拆分，代码也更简洁易懂：

```jsx
function Example(props) {
    const [count, setCount] = useState(0);
    const [foo] = useState("foo");

    const main = useMemo(() => (
        <div>
            <Item key={1} x={1} foo={foo} />
            <Item key={2} x={2} foo={foo} />
            <Item key={3} x={3} foo={foo} />
            <Item key={4} x={4} foo={foo} />
            <Item key={5} x={5} foo={foo} />
        </div>
    ), [foo]);

    return (
        <div>
            <p>{count}</p>
            <button onClick={() => setCount(count + 1)}>setCount</button>
            {main}
        </div>
    );
}
```

## 惰性初始值

对于 state，其拥有 [惰性初始化的方法](https://reactjs.org/docs/hooks-reference.html#lazy-initial-state)。可能有人不明白它的作用。


`someExpensiveComputation` 是一个相对耗时的操作。如果我们直接采用

```jsx
const initialState = someExpensiveComputation(props);
const [state, setState] = useState(initialState);
```

注意，虽然 `initialState` 只在初始化时有其存在的价值，但是 `someExpensiveComputation` 在每一帧都被调用了。只有当使用惰性初始化的方法：

```jsx
const [state, setState] = useState(() => {
    const initialState = someExpensiveComputation(props);
    return initialState;
});
```

因 `someExpensiveComputation` 运行在一个匿名函数下，该函数当且仅当初始化时被调用，从而优化性能。

我们甚至可以跳出计算 state 这一规定，来完成任何昂贵的初始化操作。

```jsx
useState(() => {
    someExpensiveComputation(props);
    return null;
});
```


## 避免滥用 refs

当 `useEffect` 的依赖频繁变化，你可能想到把频繁变化的值用 ref 保存起来。然而，useReducer 可能是更好的解决方式：使用 dispatch 消除对一些状态的依赖。[官网的 FAQ](https://zh-hans.reactjs.org/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often) 有详细的解释。

最终可以总结出这样的实践：

useEffect 对于函数依赖，尝试将该函数放置在 effect 内，或者使用 useCallback 包裹；useEffect/useCallback/useMemo，对于 state 或者其他属性的依赖，根据 eslint 的提示填入 deps；如果不直接使用 state，只是想修改 state，用 setState 的函数入参方式（`setState(c => c + 1)`）代替；如果修改 state 的过程依赖了其他属性，尝试将 state 和属性聚合，改写成 useReducer 的形式。当这些方法都不奏效，使用 ref，但是依然要谨慎操作。

## 避免滥用 useMemo

使用 useMemo 当 deps 不变时，直接返回上一次计算的结果，从而使子组件跳过渲染。

但是当返回的是原始数据类型（如字符串、数字、布尔值）。即使参与了计算，只要 deps 依赖的内容不变，返回结果也很可能是不变的。此时就需要权衡这个计算的时间成本和 useMemo 额外带来的空间成本（缓存上一次的结果）了。

此外，如果 useMemo 的 deps 依赖数组为空，这样做说明你只是希望存储一个值，这个值在重新 render 时永远不会变。

比如：
```jsx
const Comp = () => {
    const data = useMemo(() => ({ type: 'xxx' }), []);
    return <Child data={data}>;
}
```
可以被替换为：
```jsx
const Comp = () => {
    const { current: data } = useRef({ type: 'xxx' });
    return <Child data={data}>;
}
```
甚至：
```jsx
const data = { type: 'xxx' };
const Comp = () => {
    return <Child data={data}>;
}
```

此外，如果 deps 频繁变动，我们也要思考，使用 useMemo 是否有必要。因为 useMemo 占用了额外的空间，还需要在每次 render 时检查 deps 是否变动，反而比不使用 useMemo 开销更大。


## 受控与非受控

在一个自定义 Hooks，我们可能有这样一段逻辑：

```jsx
useSomething = (inputCount) => {
    const [ count, setCount ] = useState(inputCount);
};
```

这里有一个问题，外部传入的 `inputCount` 属性发生了变化，使其与 `useSomething` Hook 内的 `count` state 不一致时，是否想要更新这个 `count` ？

默认不会更新，因为 useState 参数代表的是初始值，仅在 `useSomething` 初始时赋值给了 `count` state。后续 `count` 的状态将与 `inputCount` 无关。这种外部无法直接控制 state 的方式，我们称为非受控。

如果想被外部传入的 props 始终控制，比如在这个例子中，`useSomething` 内部，`count` 这一 state 的值需要从 `inputCount` 进行同步，需要这样写：

```jsx
useSomething = (inputCount) => {
    const [ count, setCount ] = useState(inputCount);
    setCount(inputCount);
};
```

`setCount`后，React 会立即退出当前的 render 并用更新后的 state 重新运行 render 函数。这一点，[官网文档](https://zh-hans.reactjs.org/docs/hooks-faq.html#how-do-i-implement-getderivedstatefromprops) 是有说明的。

在这种的机制下，state 由外界同步的同时，内部又有可能通过 setState 来修改 state，可能引发新的问题。例如 `useSomething` 初始时，count 为 0，后续内部通过 `setCount` 修改了 `count` 为 1。当外部函数组件的 render 函数重新调用，也会再一次调用 `useSomething`，此时传入的 `inputCount` 依然是 0，就会把 `count` 变回 0。这很可能不符合预期。

遇到这样的问题，建议将 `inputCount` 的当前值与上一次的值进行比较，只有确定发生变化时执行 `setCount(inputCount)` 。

当然，在特殊的场景下，这样的设定也不一定符合需求。[官网的这篇文章](https://zh-hans.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html) 有提出类似的问题。

## 实践：useSlider

通过一个滑动选择器自定义 hook `userSlider` 的实现，我们可以回答上面的这个问题，顺便对本文做一个总结。

![image](https://p1.music.126.net/ZtmN00eM49yWDirpRFRkyg==/109951164669603891.png)

`userSlider` 需要实现的逻辑是：按住滑动选择器的圆形手柄区域并拖动可以调节数值大小，数值范围为 0 到 1。

`userSlider` 只负责逻辑的实现，UI 样式由组件自行完成。为了模拟真实业务，另外通过文本展示了当前的数值。并有几个按钮用于切换数值的初始值，这是为了切换分类后，当前的滑动选择器需要重置到某个数值。

按照常规的逻辑，我们实现了以下代码：

[![Edit useSlider 问题](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/useslider-wenti-imji7?fontsize=14&hidenavigation=1&module=%2Fsrc%2FuseSlider.js&theme=dark)

当前的问题是，`useEffect` 涉及到多个 state 的获取与计算。导致鼠标按下、移动、弹起的几个操作中因为对 state 的修改，`useEffect` 频繁刷新，且涉及到了鼠标按下、移动、弹起事件监听的取消与重新绑定，这带来了性能问题以及较难观察到的 BUG。

和前面的 `setInterval` 例子相似，我们不希望在状态变动时，刷新 `useEffect`。由于此处涉及到多个状态：是否滑动中、鼠标位置、上一次鼠标的问题、选择器的可滑动宽度，如果整合到一个 `state` 中，会面临代码不清晰，缺少内聚性的问题，我们尝试用 `useReducer` 做一次替换。

```jsx
const reducer = (state, action) => {
    switch (action.type) {
        case "start":
            return {
                ...state,
                lastPos: action.x,
                slideRange: action.slideWidth,
                sliding: true
            };
        case "move": {
            if (!state.sliding) {
                return state;
            }
            const pos = action.x;
            const delta = pos - state.lastPos;
            return {
                ...state,
                lastPos: pos,
                ratio: fixRatio(state.ratio + delta / state.slideRange)
            };
        }
        case "end": {
            if (!state.sliding) {
                return state;
            }
            const pos = action.x;
            const delta = pos - state.lastPos;
            return {
                ...state,
                lastPos: pos,
                ratio: fixRatio(state.ratio + delta / state.slideRange),
                sliding: false
            };
        }
        default:
            return state;
    }
};

//...

const handleThumbMouseDown = useCallback(ev => {
    const hotArea = hotAreaRef.current;
    dispatch({
        type: "start",
        x: ev.pageX
      slideWidth: hotArea.clientWidth
    });
}, []);

useEffect(() => {
    const onSliding = ev => {
        dispatch({
            type: "move",
            x: ev.pageX
        });
    };
    const onSlideEnd = ev => {
        dispatch({
            type: "end",
            x: ev.pageX
        });
    };
    document.addEventListener("mousemove", onSliding);
    document.addEventListener("mouseup", onSlideEnd);

    return () => {
        document.removeEventListener("mousemove", onSliding);
        document.removeEventListener("mouseup", onSlideEnd);
    };
}, []);
```

这样处理后，effect 只要执行一次即可。

接下来还有一个问题没有处理，目前 `initRatio` 是作为初始值传入的，`useSlider` 内部的 ratio 是不受外部控制的。

以一个音乐均衡器的设置为例：当前滑动选择器代表的是低频端（31）的增益值，用户通过拖动滑块可以设置这个值的大小（-12 到 12 dB 范围，我们设置到了 3 dB）。同时我们提供了一些预设选项，一旦选择预设选项，如『流行』风格，当前滑块需要重置到特定值 -1 dB。为此， `useSlider` 需要提供控制状态的方法。

![image](https://p1.music.126.net/AHuWUMbk9w3RiNoKPuznLw==/109951164669651478.png)

根据前一节的介绍，在 `useSlider` 的开头，我们可以将属性 `initRatio` 的当前值与上一次的值进行比较，若发生变化，则执行 `setRatio`。但仍然有场景无法满足：用户选择了『流行』这一预设，然后拖动滑块进行了调节，之后又重新选择『流行』这一预设，此时 `initRatio` 没有任何变化，但我们期望 ratio 重新变为 `initRatio`。

解决这个问题的办法是，在 `useSlider` 内部添加一个 `setRatio` 方法。

```jsx
const setRatio = useCallback(
    ratio =>
        dispatch({
            type: "setRatio",
            ratio
        }),
    []
);
```

将该方法输出供外部用于对 ratio 控制。`initRatio` 不再控制 ratio 的状态，仅用于设置初始值。

可以看下最终的实现方案：

[![Edit useSlider 最终版](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/useslider-zuizhongban-tun1t?fontsize=14&hidenavigation=1&module=%2Fsrc%2FuseSlider.js&theme=dark)

该方案中，除了完成以上需求，还支持在选择器的其他区域点击直接跳转到对应的数值；支持设定选择器为垂直还是水平方向。供大家参考。

## 结束语

忘掉 class 组件的生命周期，重新审视函数式组件的意义，是用好 React Hooks 的关键一步。希望这篇文章能帮助大家进一步理解并获取到一些最佳实践。当然，不同的 React Hooks 使用姿势可能带来不同的最佳实践，欢迎大家交流。

## 相关资料

[A Complete Guide to useEffect](https://overreacted.io/a-complete-guide-to-useeffect/)
