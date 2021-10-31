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

### 21.2.2 抛出错误

`throw` 操作符可以手动抛出错误，代码立即停止执行，除非 `try/catch` 语句捕获了抛出的值，必须有一个值，但值的类型不限

```js
throw 12345;
throw "Hello world!";
throw true;
throw { name: "JavaScript" };
```



或者使用内置的错误类型来模拟浏览器错误。每种错误类型的构造函数只接受一个参数，就是错误消息

```js
throw new Error("Something bad happened.");
// 使用特定类型也一样
throw new SyntaxError("I don't like your syntax.");
throw new InternalError("I can't do that, Dave.");
throw new TypeError("What type of variable do you take me for?");
throw new RangeError("Sorry, you just don't have the range.");
throw new EvalError("That doesn't evaluate.");
throw new URIError("Uri, is that you?");
throw new ReferenceError("You didn't cite your references properly.");
```



自定义错误类型，创建自定义错误类型时需要提供 `name` 和 `message` 属性

```js
class CustomError extends Error {
  constructor(message) {
    super(message);
    this.name = "CustomError";
    this.message = message;
  }
}
```



#### 1.何时抛出错误

在出现已知函数无法正确执行的情况时就应该抛出错误

使用适当的信息创建自定义错误可以有效提高代码的可维护性

```js
function process(values) {
  if (!(values instanceof Array)) {
    throw new Error('process(): Argument must be an Array.');
  }
  
  values.sort();
  
  for (const value of values) {
    if (value > 100) {
      return value;
    }
  }
  
  return -1;
}
```



良好的错误处理协议可以保证只会发生你自己抛出的错误

### 21.2.3 error 事件

任何没有被 `try/catch` 语句处理的错误都会在 `window` 上触发 `error` 事件，会传入 3 个参数：错误信息、发生错误的 URL 和行号

另外，`onerror` 事件处理程序需要使用 DOM Level 0 技术来指定，因为它不遵循 DOM Level 2 Events 标准格式：

```js
window.onerror = (message, url, line) => {
  console.log(message);
  return false;  // 阻止浏览器默认报告错误的行为
};
```



图片也支持 `error` 事件。如果图片 `src` 属性中的 URL 没有返回可识别的图片格式，就会触发 `error` 事件

```js
const image = new Image();

image.addEventListener('load', event => {
  console.log('Image loaded!');
});

image.addEventListener('error', event => {
  console.log('image not loaded!');
});

image.src = 'donesnotexist.gif';  // 不存在，资源会加载失败
```



### 21.2.4 错误处理策略

应该非常清楚自己的代码在什么情况下会失败，以及失败会导致什么结果。另外，还要有一个系统跟踪这些问题

### 20.1.2.5 识别错误

因为 JavaScript 是松散类型的，不会验证函数参数，所以很多错误只有运行代码真正运行起来时才会出现。通常，需要注意 3 类错误：

- 类型转换错误
- 数据类型错误
- 通信错误

#### 1.静态代码分析器

常用的静态代码分析工具

- [JSHint](https://jshint.com/)
- [JSLint](https://www.jslint.com/)
- [Google Closure](https://github.com/google/closure-library)
- [TypeScript](https://www.typescriptlang.org/)

静态代码分析器要求使用类型、函数签名及其他指令来注解 JavaScript，以此描述程序在基本可执行代码之外运行

#### 2.类型转换错误

**类型转换错误** 的主要原因是使用了会自动改变某个值的数据类型的操作符或语言构造。使用等于 `==` 或不等于 `!=` 操作符，以及在 `if`、`for`、`while` 等流程控制语句中使用非布尔值导致

```js
function concat(str1, str2, str3) {
	let result = str1 + str2;
  if (str3) {  // 不要！,就算 str3 为 1 的时候也会通过
    result += str3;
  }
  return result;
}
```

改写为

```js
function concat(str1, str2, str3) {
  let result = str1 + str2;
  if (typeof str3 === 'string') {
    result += str3;
  }
  return result;
}
```



#### 3.数据类型错误

因为 JavaScript 是松散类型的，所以变量和函数参数都不能保证会使用正确的数据类型

```js
function getQueryString(url) {
  if (typeof url === 'string') {
    let pos = url.indexOf('?');
    if (pos > -1) {
      return url.substring(pos + 1);
    }
  }
  return '';
}
```



一般来说，原始类型的值应该使用 `typeof` 检测，而对象值应该使用 `instanceof` 检测

#### 4.通信错误

- URL 格式错误或发送数据的格式不正确

对于查询字符串，应该都通过 `encodeURIComponent()` 编码

### 21.2.6 区分重大与非重大错误

非重大错误：

- 不会影响用户的主要任务
- 只会影响页面中某个部分
- 可以恢复
- 重复操作可能成功

重大错误：

- 应用程序绝对无法继续运行
- 错误严重影响用户的主要目标
- 会导致其他错误发生

在 `for` 循环中加入 `try/catch` 语句，使得代码不会影响初始化

```js
for (const mod of mods) {
  try {
    mod.init();
  } catch (ex) {
    // 在这里处理错误
  }
}
```



### 21.2.7 把错误记录到服务器中

对于复杂的 Web 应用程序，最好把 JavaScript 错误发送回服务器记录下来

```js
function logError(sev, msg) {
  const img = new Image(),
        encodedSev = encodeURIComponent(sev),
        encodedMsg = encodedURIComponent(msg);
  img.src = `log.php?sev=${encodedSev}&msg=${encodedMsg}`;  // 不受跨域影响
}

for (const mod of mods) {
  try {
    mod.init();
  } catch (ex) {
    logError('nonfatal', `Module init failed: ${ex.message}`);
  }
}
```



## 21.3 调试技术

以往最常用的调试方法，在相关代码中插入 `alert()`，但是这种方法非常不人性化，现在已经不推荐

### 21.3.1 把消息记录到控制台

浏览器通过 `console` 对象直接把 JavaScript 消息写入控制台，包含如下方法：

- `error(message)` 在控制台中记录错误消息
- `info(message)` 在控制台中记录信息性内容
- `log(message)` 在控制台记录常规消息
- `warn(message)` 在控制台中记录警告信息

### 21.3.2 理解控制台运行时

浏览器控制台是个读取-求值-打印-循环（REPL，read-eval-print-loop），与页面的 JavaScript 运行时并发

在浏览器的元素选项卡中单击任何一个节点，然后在控制台中使用 `$0` 可以打印出改节点的引用

### 21.3.3 使用 JavaScript 调试器

ECMAScript 5.1 定义了 `debugger` 关键字，用于调用可能存在的调试功能。如果没有相关的功能，这条语句会被简单地跳过

```js
function pauseExecution() {
  console.log('Will print before breakpoint');
  debugger;
  console.log('Will not print until breakpoint continues');
}
```



在运行时碰到这个关键字时，所有主流浏览器都会打开开发者工具板，并在指定位置显示断点

### 21.3.4 在页面中打印消息

在 DOM 中打印消息

```js
function log(message) {
  const console = document.getElementById('debuginfo');
  if (console === null) {
    console = document.createElement('div');
    console.id = 'debuginfo';
    console.style.background = '#dedede';
    console.style.border = '1px solid silver';
    console.style.padding = '5px';
    console.style.width = '400px';
    console.style.position = 'absolute';
    console.style.right = '0px';
    console.style.top = '0px';
    document.body.appendChild(console);
  }
  console.innerHTML = `<p>${message}</p>`;
}
```



### 21.3.5 补充控制台方法

```js
console.log = function() {
  const args = Array.prototype.slice.call(arguments);
  console.log(args.join(', '));
}
```



### 21.3.6 抛出错误

```js
function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
```



## 21.4 旧版 IE 的常见错误

### 21.4.1 无效字符

### 21.4.2 未找到成员

### 21.4.3 未知运行时错误

### 21.4.4 语法错误

### 21.4.5 系统找不到指定资源

