---
title: "React Hooks 的体系设计之一 - 分层"
author: [otakustay]
---

> 本文由百度资深研发工程师兼百度 ECOMFE FE-CMC 现任主席 — 张立理大佬带来。对 Hook 进行了深度剖析，此文为系列文章。

React Hooks 是 React 框架内的逻辑复用形式，因其轻量、易编写的形态，必然会逐渐成为一种主流。但在实际的开发中，我依然觉得大部分的开发者对 hook 的使用过于粗暴，缺乏设计感和复用性。

我在[《如何去合理使用 React hook》的回答](https://www.zhihu.com/question/357020049/answer/909484669)中有简单地提到一些思路，之后我会发布一个小系列来展开地讲述 hook 的设计和实现细节问题。

## 万物始于分层

软件工程中的经典论述：

> We can solve any problem by introducing an extra level of indirection.
>
> 没有什么问题是加一个层解决不了的。

这个论述自软件工程诞生起，时至今日依然是成立的。但要使之成立就必须有一个大前提：我们有分层。

React 内置的 hook 提供了基础的能力，虽然本质上它也有一些分层，比如：

- `useState` 是基于 `useReducer` 的简化版。
- `useMemo` 和 `useCallback` 事实上可以基于 `useRef` 实现。

但在实际应用时，我们可以将这些统一视为一层，即最基础的底层。

因此，如果我们在实际的应用开发中，单纯地在组件里组合使用内置的 hook，无疑是一种不分层的粗暴使用形式，这仅仅在表象上使用了 hook，而无法基于 hook 达到逻辑复用的目标。

## 状态的分层设计

分层的形式固然千千万万五花八门，我选择了一种更为贴近传统、更能表达程序的本质的方法，以此将 hook 在纵向分为了 6 个层，自底向上依次是：

1. 最底层的内置 hook，不需要自己实现，官方直接提供。
2. 简化状态更新方式的 hook，比较经典的是引入 [immer](https://github.com/immerjs/immer) 来达到更方便地进行不可变更新的目的。
3. 引入“状态 + 行为”的概念，通过声明状态结构与相应行为快速创建一个完整上下文。
4. 对常见数据结构的操作进行封装，如数组的操作。
5. 针对通用业务场景进行封装，如分页的列表、滚动加载的列表、多选等。
6. 实际面向业务的实现。

需要注意的是，这边仅提到了对状态的分层设计。事实上有大量的 hook 是游离于状态之外的，如基于 `useEffect` 的 `useDocumentTitle`、`useElementSize`，或基于 `useRef` 的 `usePreviousValue`、`useStableMemo` 等，这些 hook 是更加零散、独立的形态。

### 使用 immer 更新状态

在第二层中，我们需要解决的问题是 React 要求的不可变数据更新有一定的操作复杂性，比如当我们需要更新对象的一个属性时，就需要：

```js
const newValue = {
    ...oldValue,
    foo: newFoo,
};
```

这仅限于一个属性的更新，如果属性的层级较深时，代码就不得不变成这样子：

```js
const newValue = {
    ...oldValue,
    foo: {
        ...oldValue?.foo,
        bar: {
            ...oldValue?.foo?.bar,
            alice: newAlice
        },
    },
};
```

数组同样也不怎么容易，比如想删除一个元素，你就得这么来：

```js
const newArray = [
    ...oldArray.slice(0, index),
    ...oldArray.slice(index + 1)
];
```

要解决这一系列的问题，我们可以使用 immer 进行更新，利用 `Proxy` 的特性将可变的数据更新映射为不可变的操作。

状态管理的基础 hook 是 `useState` 和 `useReducer`，因此我们能封装成：

```js
const [state, setState] = useImmerState({foo: {bar: 1}});

setState(s => s.foo.bar++); // 直接进行可变更新
setState({foo: {bar: 2}}); // 保留直接更新值的功能
```

以及：

```js
const [state, dispatch] = useImmerReducer(
    (state, action) => {
        case 'ADD':
            state.foo.bar += action.payload;
        case 'SUBTRACT':
            state.foo.bar -= action.payload;
        default:
            return;
    },
    {foo: {bar: 1}}
);

dispatch('ADD', {payload: 2});
```

这一部分并没有太多的工作 (immer 的 TS 类型是真的难写)，但提供了非常方便的状态更新能力，也便于在它之上的所有层的实现。

### 状态与行为的封装

组件的开发，或者说绝大部分的业务的开发，逃不出“一个状态加一系列行为”这个模式，且行为与状态的结构是强相关的。这个模式在面向对象里我们称之为类：

```js
class User {
    name = '';
    age = 0;

    birthday() {
        this.age++;
    }
}
```

而在 hook 中，我们会这么来：

```js
const [name, setName] = useState('');
const [age, SetAge] = useState(0);
const birthday = useCallback(
    () => {
        setAge(age => age + 1);
    },
    [age]
);
```

会出现一些问题：

1. 太多的 `useState` 和 `useCallback` 调用，重复的编码工作。
2. 如果不仔细阅读代码，很难找到状态与行为的对应关系。

因此，我们需要一个 hook 能帮我们把“一个状态”和“针对这个状态的行为”合并在一起：

```js
const userMethods = {
    birthday(user) {
        user.age++; // 利用了immer的能力
    },
};

const [user, methods, setUser] = useMethods(
    userMethods,
    {name: '', age: 0}
);

methods.birthday();
```

可以看到，这样的声明非常接近面向对象的形态。有部分 React 的开发者在粗浅地了解函数式编程后，成了激进的“反面向对象党”，这显然是不可取的，面向对象依然是一种很好的封装和职责边界划分的形态，不一定要以其表面形态去实现，却也万万不可丢弃了其内在理念。

### 数据结构的抽象

有了 `useMethods` 之后，我们已经可以快速地使任何类型和结构的状态与 hook 整合。我们一定会意识到，有一部分状态类型是业务无关的，是全天下开发者公用的，比如最基础的数据类型 `number`、`string`、`Array` 等。

在数据类型的封装上，我们依然会面对几个核心问题：

1. 部分数据类型的不可变操作相当复杂，比如不可变地实现 `Array#splice`，好在有 immer 合理地解决了问题。
2. 部分操作的语义会发生变化，`setState` 最典型的是没有返回值，因此 `Array#pop` 只能产生“移除最后一个元素”的行为，而无法将移除的元素返回。
3. 部分类型是天生可变的，如 `Set` 和 `Map`，将之映射到不可变需要额外的工作。

针对常用数据结构的抽象，在试图解决这些问题 (第 2 个问题还真解决不了) 的同时，也能扩展一些行为，比如：

```ts
const [list, methods, setList] = useArray([]);

interface ArrayMethods<T> {
    push(item: T): void;
    unshift(item: T): void;
    pop(): void;
    shift(): void;
    slice(start?: number, end?: number): void;
    splice(index: number, count: number, ...items: T[]): void;
    remove(item: T): void;
    removeAt(index: number): void;
    insertAt(index: number, item: T): void;
    concat(item: T | T[]): void;
    replace(from: T, to: T): void;
    replaceAll(from: T, to: T): void;
    replaceAt(index: number, item: T): void;
    filter(predicate: (item: T, index: number) => boolean): void;
    union(array: T[]): void;
    intersect(array: T[]): void;
    difference(array: T[]): void;
    reverse(): void;
    sort(compare?: (x: T, y: T) => number): void;
    clear(): void;
}
```

而诸如 `useSet` 和 `useMap` 则会在每次更新时做一次对象复制的操作，强制实现状态的不可变。

我在社区的 hook 库中，很少看到有单独一个层实现数据结构的封装，实为一种遗憾。截止到今日，大致 `useNumber`、`useArray`、`useSet`、`useMap`、`useBoolean` 是已然实现的，其中还衍生出 `useToggle` 这样场景更狭窄的实现。而 `useString`、`useFunction` 和 `useObject` 能够提供什么能力还有待观察。

### 通用场景封装

在有了基本的数据结构后，可以对场景进行封装，这一点在阿里的 [@umijs/hooks](https://github.com/umijs/hooks) 体现的比较多，如 `useVirtualList` 就是一个价值非常大的场景的封装。

需要注意的是，场景的封装不应与组件库耦合，它应当是业务与组件之间的桥梁，不同的组件库使用相同的 hook 实现不同的界面，这才是一个理想的模式：

- `useTransfer` 实现左右双列表选择的能力。
- `useSelection` 实现列表上单选、多选、范围选择的能力
- `useScrollToLoad` 实现滚动加载的能力。

通用场景的封装非常的多，它的灵感可以来源于某一个组件库，也可以由团队的业务沉淀。一个充分的场景封装 hook 集合会是未来 React 业务开发的效率的关键之一。

## 总结

总而言之，在业务中暴力地直接使用 `useState` 等 hook 并不是一个值得提倡的方式，而针对状态这一块，精细地做一下分层，并在每个层提供相应的能力，是有助于组织 hook 库并赋能于业务研发效率的。

我们正在研发一个命名为 [@huse](https://github.com/ecomfe/react-hooks) 的 hook 集合，同样应用了分层的理念，也欢迎提出相应的需求，将于近期发布一个版本。
