---
id: hooks-rules
title: 使用 Hook 的规则
permalink: docs/hooks-rules.html
next: hooks-custom.html
prev: hooks-effect.html
---

*Hook* 是 React 16.8 的新增特性。它可以让你在不使用 class 的情况下使用 state 和一些其他 React 特性。

Hook 是 JavaScript 函数，但是你在使用它的时候需要遵循两条规则。我们提供了一个 [linter 插件](https://www.npmjs.com/package/eslint-plugin-react-hooks)来强制执行这些规则：

### 只在最顶层使用 Hook {#only-call-hooks-at-the-top-level}

**不要在循环，条件或嵌套函数中调用 Hook，**确保总是在你的 React 函数的最顶层调用他们。遵守这条规则，你就能确保 Hooks 在每一次渲染中都按照同样的顺序被调用。这让 React 能够在多次的 `useState` 和 `useEffect` 调用之间保持 hook 状态的正确。(如果你对此感到好奇，我们在[下面](#explanation)会有更深入的解释。)

### 只在 React 函数中调用 Hook {#only-call-hooks-from-react-functions}

**不要在普通的 JavaScript 函数中调用 Hook。**你可以：

* ✅ 在 React 的函数组件中调用 Hook
* ✅ 在自定义 Hook 中调用 Hook (我们将会在[下一页](/docs/hooks-custom.html) 中学习这个。)

通过遵循此规则，你确保了组件的状态逻辑在它的代码中清晰可见。

## ESLint 插件 {#eslint-plugin}

我们发布了一个名为 [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) 的 ESLint 插件来强制执行这两条规则。如果你想尝试一下，可以将此插件添加到你的项目中：

```bash
npm install eslint-plugin-react-hooks
```

```js
// Your ESLint configuration
{
  "plugins": [
    // ...
    "react-hooks"
  ],
  "rules": {
    // ...
    "react-hooks/rules-of-hooks": "error"
  }
}
```

将来，我们打算默认将此插件包含在 Create React App 和其他类似的工具包中。

**现在你可以跳转到下一页学习如何编写[你自己的 Hook](/docs/hooks-custom.html)。**在本页中，我们将继续解释这些规则背后的原因。

## 说明 {#explanation}

正如我们[之前学到](/docs/hooks-state.html#tip-using-multiple-state-variables)的，我们可以在单个组件中使用多个 State Hook 或 Effect Hook

```js
function Form() {
  // 1. Use the name state variable
  const [name, setName] = useState('Mary');

  // 2. Use an effect for persisting the form
  useEffect(function persistForm() {
    localStorage.setItem('formData', name);
  });

  // 3. Use the surname state variable
  const [surname, setSurname] = useState('Poppins');

  // 4. Use an effect for updating the title
  useEffect(function updateTitle() {
    document.title = name + ' ' + surname;
  });

  // ...
}
```

那么 React 怎么知道哪个 state 对应哪个 `useState`？答案是 React 靠的是 Hook 调用的顺序。因为我们的示例中，Hook 的调用顺序在每次渲染中都是相同的，所以它能够正常工作：

```js
// ------------
// First render
// ------------
useState('Mary')           // 1. Initialize the name state variable with 'Mary'
useEffect(persistForm)     // 2. Add an effect for persisting the form
useState('Poppins')        // 3. Initialize the surname state variable with 'Poppins'
useEffect(updateTitle)     // 4. Add an effect for updating the title

// -------------
// Second render
// -------------
useState('Mary')           // 1. Read the name state variable (argument is ignored)
useEffect(persistForm)     // 2. Replace the effect for persisting the form
useState('Poppins')        // 3. Read the surname state variable (argument is ignored)
useEffect(updateTitle)     // 4. Replace the effect for updating the title

// ...
```

只要 Hook 的调用顺序在多次渲染之间保持一致，React 就能正确地将内部 state 和对应的 Hook 关联。但如果我们将一个 Hook (例如 `persistForm` effect) 调用放到一个条件语句中会发生什么呢？

```js
  // 🔴 We're breaking the first rule by using a Hook in a condition
  if (name !== '') {
    useEffect(function persistForm() {
      localStorage.setItem('formData', name);
    });
  }
```

在第一次渲染中 `name !== ''` 这个条件值为 `true`，所以我们会执行这个 Hook。但是下一次渲染时我们可能清空了表单，表达式值变为 `false`。现在我们在渲染时跳过了这个 Hook，Hook 的调用顺序变得不同了：

```js
useState('Mary')           // 1. Read the name state variable (argument is ignored)
// useEffect(persistForm)  // 🔴 This Hook was skipped!
useState('Poppins')        // 🔴 2 (but was 3). Fail to read the surname state variable
useEffect(updateTitle)     // 🔴 3 (but was 4). Fail to replace the effect
```

React 不知道第二个 `useState` Hook 应该返回什么了。React 以为在这个组件中第二次 Hook 调用像之前的渲染一样，对应了 `persistForm` effect，但事实上并不是。从这里开始，后面的每次 Hook 调用都被移动了一个顺位，导致 bug 的产生。

**这就是为什么 Hook 需要在我们组件的最顶层调用。**如果我们想要有条件地执行一个 effect，可以将判断放到 Hook 的*内部*：

```js
  useEffect(function persistForm() {
    // 👍 We're not breaking the first rule anymore
    if (name !== '') {
      localStorage.setItem('formData', name);
    }
  });
```

**注意：如果你使用了[上面提供的 lint 插件](https://www.npmjs.com/package/eslint-plugin-react-hooks)，就不需要担心这个问题了。**不过你现在知道了为什么 Hook 会这样工作，也知道了这个规则是为了避免什么问题。

## 下一步 {#next-steps}

最后，我们已经准备好学习[如何编写你自己的 Hook](/docs/hooks-custom.html)了！自定义 Hook 允许你将 React 提供的 Hook 组合到您自己的 Hook 中，复用不同组件之间的常见状态逻辑。
