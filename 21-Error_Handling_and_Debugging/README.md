# 第 21 章 错误处理与调试

到了 2008 年，大多数浏览器支持一些 JavaScript 调试能力

## 21.1 浏览器错误报告

默认情况下，所有浏览器都会隐藏错误信息。一个原因是除了开发者之外这些信息对别人没什么用，另一种原因是网页在正常操作中报错的固有特性

### 21.1.1 桌面控制台

要进入控制台，不同操作系统和浏览器支持不同的快捷键

| 浏览器  | Windows/Linux    | Mac       |
| ------- | ---------------- | --------- |
| Chrome  | Ctrl+Shift+J     | Cmd+Opt   |
| Firefox | Ctrl+Shift+K     | Cmd+Opt+K |
| IE/Edge | F12，然后 Ctrl+2 | 不适用    |
| Opera   | Ctrl+Shift+I     | Cmd+Opt+I |
| Safari  | 不适用           | Cmd+Opt+C |

### 21.1.2 移动控制台

- Chrome 移动版和 Safari 和 iOS 版内置了实用工具
- Firefox 常用的调试工具：Firebug Lite

## 21.2 错误处理

有一个良好的错误处理策略可以让用户知道到底发生了什么。为此，必须理解各种错误捕获和处理 JavaScript 错误的方式

### 21.2.1 try/catch 语句

ECMA-262 第 3 版新增了 `try/catch` 语句

```js
try {
  // 可能出错的代码
} catch (error) {
  // 出错时要做什么
}
```

即使在 `catch` 块中不使用错误对象，也必须为它定义名称。错误对象中暴露的实际信息因浏览器而异，但至少包含保存错误信息的 `messsage` 属性

#### 1.finally 子句

`try/catch` 语句中可选的 `finally` 子句始终运行

```js
// finally 的存在导致 try 块中的 return 语句被忽略。无论如何函数都会返回 0
function testFinally() {
  try {
    return 2;
  } catch (error) {
    return 1;
  } finally {
    return 0;
  }
}
```



#### 2.错误类型

ECMA-262 定义了 8 中错误类型

- `Error` 基类，其它错误类型继承于此
- `InternalError` JavaScript 引擎抛出异常时由浏览器抛出
- `EvalError` `eval()` 函数发生异常时抛出
- `RangeError` 数值越界时抛出
- `ReferenceError` 访问不存在的变量导致的
- `SyntaxError` 语法错误
- `TypeError` 变量不是预期类型或者访问不存在的方法抛出
- `URIError` 使用 `encodeURI()` 或 `decodeURI()` 但传入了格式错误的 URI 时发生

#### 3. try/catch 的用法

使用 `try/catch` 可以针对特定错误类型实现自定义的错误处理

