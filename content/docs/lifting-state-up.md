---
id: lifting-state-up
title: 状态提升
permalink: docs/lifting-state-up.html
prev: forms.html
next: composition-vs-inheritance.html
redirect_from:
  - "docs/flux-overview.html"
  - "docs/flux-todo-list.html"
---

通常，多个组件需要反映相同的变化数据，这时我们建议将共享状态提升到最近的共同父组件中去。让我们看看它是如何运作的。

在本节中，我们将创建一个用于计算水在给定温度下是否会沸腾的温度计算器。

我们将从一个名为 `BoilingVerdict` 的组件开始，它接受 `celsius` 温度作为一个 prop，并且打印出这个温度是否足以让水沸腾。

```js{3,5}
function BoilingVerdict(props) {
  if (props.celsius >= 100) {
    return <p>The water would boil.</p>;
  }
  return <p>The water would not boil.</p>;
}
```

接下来, 我们创建一个名为 `Calculator` 的组件。它渲染一个让你输入温度的 `<input>`，并将其值保存在 `this.state.temperature` 中。

另外, 它根据当前输入值渲染 `BoilingVerdict` 组件。

```js{5,9,13,17-21}
class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {temperature: ''};
  }

  handleChange(e) {
    this.setState({temperature: e.target.value});
  }

  render() {
    const temperature = this.state.temperature;
    return (
      <fieldset>
        <legend>Enter temperature in Celsius:</legend>
        <input
          value={temperature}
          onChange={this.handleChange} />
        <BoilingVerdict
          celsius={parseFloat(temperature)} />
      </fieldset>
    );
  }
}
```

[**在 CodePen 上尝试**](https://codepen.io/gaearon/pen/ZXeOBm?editors=0010)

## 添加第二个输入框 {#adding-a-second-input}

现在我们有了新的需求，在已有摄氏温度输入框的基础上，我们提供华氏度的输入框，并保持两个输入框的数据同步。

我们先从 `Calculator` 组件中抽离出 `TemperatureInput` 组件，然后为其添加一个新的 `scale` prop，它可以是 `"c"` 或是 `"f"`：

```js{1-4,19,22}
const scaleNames = {
  c: 'Celsius',
  f: 'Fahrenheit'
};

class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {temperature: ''};
  }

  handleChange(e) {
    this.setState({temperature: e.target.value});
  }

  render() {
    const temperature = this.state.temperature;
    const scale = this.props.scale;
    return (
      <fieldset>
        <legend>Enter temperature in {scaleNames[scale]}:</legend>
        <input value={temperature}
               onChange={this.handleChange} />
      </fieldset>
    );
  }
}
```

我们现在可以修改 `Calculator` 组件让它渲染两个独立的温度输入框组件：

```js{5,6}
class Calculator extends React.Component {
  render() {
    return (
      <div>
        <TemperatureInput scale="c" />
        <TemperatureInput scale="f" />
      </div>
    );
  }
}
```

[**在 CodePen 上尝试**](https://codepen.io/gaearon/pen/jGBryx?editors=0010)

虽然我们现在有了两个输入框，但当你在其中一个键入温度时，另一个并不会更新，这便与两个输入框保持同步的需求相悖了。

另外，我们也不能通过 `Calculator` 组件展示 `BoilingVerdict` 组件的渲染结果。因为 `Calculator` 组件并不知道隐藏在 `TemperatureInput` 组件中的当前温度是多少。

## 编写转换函数 {#writing-conversion-functions}

首先，我们将编写两个可以在摄氏度与华氏度之间相互转换的函数：

```js
function toCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5 / 9;
}

function toFahrenheit(celsius) {
  return (celsius * 9 / 5) + 32;
}
```

上述两个函数仅做数值转换。而我们将编写另一个函数，它接受字符串类型的 `temperature` 和转换函数作为参数并返回一个字符串。我们将使用它来依据一个输入框的值计算出另一个输入框的值。

当输入 `temperature` 的值无效时，函数返回空字符串，反之，则返回保留三位小数并四舍五入后的转换结果：

```js
function tryConvert(temperature, convert) {
  const input = parseFloat(temperature);
  if (Number.isNaN(input)) {
    return '';
  }
  const output = convert(input);
  const rounded = Math.round(output * 1000) / 1000;
  return rounded.toString();
}
```

例如，`tryConvert('abc', toCelsius)` 返回一个空字符串，而 `tryConvert('10.22', toFahrenheit)` 返回 `'50.396'`。

## 状态提升 {#lifting-state-up}

到目前为止, 两个 `TemperatureInput` 组件均在各自本地的 state 中相互独立地保存着各自的数据。

```js{5,9,13}
class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {temperature: ''};
  }

  handleChange(e) {
    this.setState({temperature: e.target.value});
  }

  render() {
    const temperature = this.state.temperature;
    // ...  
```

然而，我们希望这两个输入框中的数值能够保持同步。当我们更新摄氏度输入框的内容时，华氏度输入框应当显示转换后的华氏温度，反之亦然。

在 React 中，共享 state 是通过将多个组件中需要共享的 state 向上移动到它们的最近共同父组件来实现的。这就是所谓的“状态提升”。接下来，我们将 `TemperatureInput` 组件中的 state 移动至 `Calculator` 组件中去。

如果 `Calculator` 组件拥有了共享的 state，它将成为两个温度输入框中当前温度的“数据源”。它能够将一致的数据传递给两个温度输入框。因为两个 `TemperatureInput` 组件的 props 均来源于他们共同的父组件 `Calculator`，所以这两个输入框中的内容将始终保持同步。

让我们看看这是如何一步一步实现的。

首先，我们将 `TemperatureInput` 组件中的 `this.state.temperature` 替换为 `this.props.temperature`。目前阶段，让我们先假定 `this.props.temperature` 已经存在，将来我们需要通过 `Calculator` 组件将其传入：

```js{3}
  render() {
    // Before: const temperature = this.state.temperature;
    const temperature = this.props.temperature;
    // ...
```

我们知道 [props 是只读的](/docs/components-and-props.html#props-are-read-only)。当 `temperature` 存在于 `TemperatureInput` 组件的 state 中时，组件只能通过调用 `this.setState()` 去修改它。然而现在，`temperature` 是由父组件传入的 prop，`TemperatureInput` 组件便失去了对它的控制权。

在 React 中，这个问题通常是通过让组件“受控”来解决的。与 DOM 中的 `<input>` 接受 `value` 和 `onChange` 一样，自定义的 `TemperatureInput` 组件接受 `temperature` 和 `onTemperatureChange` 这两个来自父组件 `Calculator` 的 props。

现在，`TemperatureInput` 组件便可以通过调用 `this.props.onTemperatureChange` 来更新它的温度。

```js{3}
  handleChange(e) {
    // Before: this.setState({temperature: e.target.value});
    this.props.onTemperatureChange(e.target.value);
    // ...
```

>注意：
>
>自定义组件中的 `temperature` 和 `onTemperatureChange` 这两个 prop 的命名是没有特殊含义的。我们可以将它们叫做其它任意的名字，例如，把它们叫做 `value` 和 `onChange` 就是一个常见的命名约定。

与 `temperature` 这个 prop 一起由父组件 `Calculator` 提供的还有 `onTemperatureChange` 这个 prop。它通过修改父组件本地的 state 来处理数据的变化，进而使用新的数值重新渲染两个输入框。我们很快就会看到 `Calculator` 组件的新实现。

在深入研究 `Calculator` 组件的变化之前，让我们回顾一下 `TemperatureInput` 组件的变化。我们将组件自身的 state 移除，通过使用 `this.props.temperature` 替代 `this.state.temperature` 来读取温度数据。当我们想要响应数据改变时，我们通过调用 `Calculator` 组件提供的 `this.props.onTemperatureChange()` 而不是之前的 `this.setState()`。

```js{8,12}
class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onTemperatureChange(e.target.value);
  }

  render() {
    const temperature = this.props.temperature;
    const scale = this.props.scale;
    return (
      <fieldset>
        <legend>Enter temperature in {scaleNames[scale]}:</legend>
        <input value={temperature}
               onChange={this.handleChange} />
      </fieldset>
    );
  }
}
```

现在，让我们把目光转向 `Calculator` 组件。

我们将会把当前输入的 `temperature` 和 `scale` 保存在组件本地的 state 中，这个 state 就是从两个输入框组件中“提升”得来的，并且它将用作两个输入框组件的同一“数据源”。这也就是我们为了渲染两个输入框组件所需要的所有数据的最小表示。

例如，当我们在摄氏度输入框中键入 37 时，`Calculator` 组件中的 state 将会是：

```js
{
  temperature: '37',
  scale: 'c'
}
```

如果我们之后修改华氏度的输入框中的内容为 212 时，`Calculator` 组件中的 state 将会是：

```js
{
  temperature: '212',
  scale: 'f'
}
```

我们可以将两个输入框中的值都保存起来，但这么做似乎没有什么必要。保存最近的输入温度和其计量单位就已经足够了，仅根据当前的 `temperature` 和 `scale` 是可以计算得到另一个输入框的值的。

由于两个输入框中的数值由同一个 state 计算而来，所以它们将始终保持同步：

```js{6,10,14,18-21,27-28,31-32,34}
class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.handleCelsiusChange = this.handleCelsiusChange.bind(this);
    this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this);
    this.state = {temperature: '', scale: 'c'};
  }

  handleCelsiusChange(temperature) {
    this.setState({scale: 'c', temperature});
  }

  handleFahrenheitChange(temperature) {
    this.setState({scale: 'f', temperature});
  }

  render() {
    const scale = this.state.scale;
    const temperature = this.state.temperature;
    const celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature;
    const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature;

    return (
      <div>
        <TemperatureInput
          scale="c"
          temperature={celsius}
          onTemperatureChange={this.handleCelsiusChange} />
        <TemperatureInput
          scale="f"
          temperature={fahrenheit}
          onTemperatureChange={this.handleFahrenheitChange} />
        <BoilingVerdict
          celsius={parseFloat(celsius)} />
      </div>
    );
  }
}
```

[**在 CodePen 上尝试**](https://codepen.io/gaearon/pen/WZpxpz?editors=0010)

现在无论你编辑哪个输入框中的内容，`Calculator` 组件中的 `this.state.temperature` 和 `this.state.scale` 均会被更新。其中一个输入框保留用户的输入并取值，另一个输入框始终基于这个值显示转换后的结果。

让我们来重新梳理一下当你对输入框内容进行编辑时会发生些什么：

* React 在 DOM 的 `<input>` 上调用被指定为是 `onChange` 的函数。在本例中，它是 `TemperatureInput` 组件的 `handleChange` 方法。
* `TemperatureInput` 组件的 `handleChange` 方法使用新输入的值调用 `this.props.onTemperatureChange()`。这个组件的 props 包括 `onTemperatureChange` 在内，都是由它的父组件 `Calculator` 提供的。
* 当 `Calculator` 组件先前渲染后，它用于摄氏度输入的子组件 `TemperatureInput` 中的 `onTemperatureChange` 被指定为了 `Calculator` 组件中的 `handleCelsiusChange` 方法，并且，其用作华氏度输入的子组件 `TemperatureInput` 中的 `onTemperatureChange` 被指定为了 `Calculator` 组件中的 `handleFahrenheitChange` 方法。因此，哪个输入框被编辑将决定 `Calculator` 组件上哪个对应的方法被调用。
* 在这些方法内部，`Calculator` 组件通过使用新的输入值与当前输入框对应的温度计量单位来调用 `this.setState()` 进而请求 React 重新渲染自己本身。
* React 调用 `Calculator` 组件的 `render` 方法得到组件的 UI 呈现。温度转换在这时进行，两个输入框中的数值通过当前输入温度和其计量单位来重新计算获得。
* React 使用 `Calculator` 组件提供的新 props 分别调用两个 `TemperatureInput` 子组件的 `render` 方法来获取子组件的 UI 呈现。
* React 调用 `BoilingVerdict` 组件的 `render` 方法，并将摄氏温度值以组件 props 方式传入。
* React DOM 根据输入值匹配水是否沸腾，并将结果更新至 DOM。
* 使用沸腾判定更新 DOM 并匹配所需的输入值。我们最近编辑的那个输入框接收其当前数值，而另一个输入框内的值更新为经过转换的温度数值。

得益于每次的更新都经历相同的步骤，两个输入框的内容才能始终保持同步。

## 学习小结 {#lessons-learned}

在React应用中，任何可变数据应当只有一个相对应的唯一“数据源”。通常，state 都是首先添加到需要渲染数据的组件中去。然后，如果其他组件也需要这个 state，那么你可以将它提升至这些组件的最近共同父组件中。你应当依靠 [自上而下的数据流](/docs/state-and-lifecycle.html#the-data-flows-down)，而不是尝试在不同组件间同步 state。

虽然提升 state 方式比双向绑定方式需要编写更多的“样板”代码，但带来的好处是，排查和隔离 bug 所需的工作量将会变少。因为任何“活”在某些组件中的状态数据，仅有该组件自己能够修改它，这样 bug 的排查范围就被大大地被缩减了。此外，你也可以使用自定义逻辑来拒绝或转换用户的输入。

如果某些数据可以由 props 或 state 推导得出，那么它就不应该存在于 state 中。举个例子，本例中我们没有将 `celsiusValue` 和 `fahrenheitValue` 一起保存，而是仅保存了最后修改的 `temperature` 和它的 `scale`。这是因为另一个输入框的温度值始终可以通过这两个值以及组件的 `render()` 方法获得。这使得我们能够清除输入框内容，亦或是，对输入框内的数值在不损失任何精度的前提下进行四舍五入的计算。

当你在 UI 界面上发现问题时，你可以使用 [React 开发者工具](https://github.com/facebook/react-devtools) 来检查问题组件的 props，并且按照组件树结构逐级向上搜寻，直到定位到负责更新 state 的那个组件。这使得你能够追踪到产生 bug 的源头：

<img src="../images/docs/react-devtools-state.gif" alt="Monitoring State in React DevTools" max-width="100%" height="100%">

