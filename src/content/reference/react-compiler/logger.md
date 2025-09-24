---
title: logger
---

<Intro>

`logger` 选项在编译期间为 React 编译器事件提供自定义日志记录。

</Intro>

```js
{
  logger: {
    logEvent(filename, event) {
      console.log(`[Compiler] ${event.kind}: ${filename}`);
    }
  }
}
```

<InlineToc />

---

## 参考 {/*reference*/}

### `logger` {/*logger*/}

配置自定义日志以跟踪编译器行为并调试问题。

#### 类型 {/*type*/}

```
{
  logEvent: (filename: string | null, event: LoggerEvent) => void;
} | null
```

#### 默认值 {/*default-value*/}

`null`

#### 方法 {/*methods*/}

- **`logEvent`**：传入文件名和事件详情来记录每次编译器事件

#### 事件类型 {/*event-types*/}

- **`CompileSuccess`**：函数成功编译
- **`CompileError`**： 由于错误而跳过该函数
- **`CompileDiagnostic`**：非致命的诊断信息
- **`CompileSkip`**： 因其他原因跳过该函数
- **`PipelineError`**： 意外的编译管线错误
- **`Timing`**：性能计时信息

#### 注意事项 {/*caveats*/}

- 事件结构可能在不同版本之间发生变化
- 大型代码库会生成大量日志条目

---

## 用法 {/*usage*/}

### 基础日志 {/*basic-logging*/}

跟踪编译成功和失败：

```js
{
  logger: {
    logEvent(filename, event) {
      switch (event.kind) {
        case 'CompileSuccess': {
          console.log(`✅ Compiled: ${filename}`);
          break;
        }
        case 'CompileError': {
          console.log(`❌ Skipped: ${filename}`);
          break;
        }
        default: {}
      }
    }
  }
}
```

### 详细错误日志 {/*detailed-error-logging*/}

获取编译失败的具体信息：

```js
{
  logger: {
    logEvent(filename, event) {
      if (event.kind === 'CompileError') {
        console.error(`\nCompilation failed: ${filename}`);
        console.error(`Reason: ${event.detail.reason}`);

        if (event.detail.description) {
          console.error(`Details: ${event.detail.description}`);
        }

        if (event.detail.loc) {
          const { line, column } = event.detail.loc.start;
          console.error(`Location: Line ${line}, Column ${column}`);
        }

        if (event.detail.suggestions) {
          console.error('Suggestions:', event.detail.suggestions);
        }
      }
    }
  }
}
```
