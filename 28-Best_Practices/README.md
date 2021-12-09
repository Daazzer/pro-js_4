# 第 28 章 最佳实践

JavaScript 的最佳实践可以分成几类，适用于开发流程的不同阶段。

## 28.1 可维护性

编写可维护的代码十分重要，因为大多数开发者会花大量时间去维护别人写的代码。

实际开发中，从第一行代码开始写起的情况非常少，通常是要在别人的代码之上构建自己的工作。让自己的代码容易维护，可以保证其他开发者更好地完成自己的工作。

### 28.1.1 什么是可维护的代码

“可维护”就意味着它具备如下特点。

- **容易理解** 无须求助原始开发者，任何人一看代码就知道它是干什么的，以及它是怎么实现的。
- **符合常识** 代码中的一切都显得顺理成章，无论操作有多么复杂。
- **容易适配** 即使数据发生变化也不用完全重写。
- **容易扩展** 代码架构经过认真设计，支持未来扩展核心功能。
- **容易调试** 出问题时，代码可以给出明确的信息，通过它能直接定位问题。

### 28.1.2 编码规范

优秀开源项目有严格的编码规范，可以让社区的所有人容易地理解代码是如何组织的。

编码规范对 JavaScript 而言非常重要，因为这门语言实在太灵活了。与大多数面向对象语言不同， JavaScript 并不强迫开发者把任何东西都定义为对象。它支持任何编程风格，包括传统的面向对象编程、声明式编程，以及函数式编程。

#### 1.可读性

代码缩进，如果所有人都使用相同的缩进，缩进通常要使用空格数而不是 Tab（制表符）来定义

代码注释，可能给 JavaScript 中的每个函数都写注释才更重要

- **函数和方法** 每个函数和方法都应该有注释来描述其用途，以及完成任务所用的算法。同时，也写清使用这个函数或方法的前提（假设）、每个参数的含义，以及函数是否返回值（因为通过函数定义看不出来）。
- **大型代码块** 多行代码但用于完成单一任务的，应该在前面给出注释，把要完成的任务写清楚。
- **复杂的算法** 如果使用了独特的方法解决问题，要通过注释解释明白。这样不仅可以帮助别人查看代码，也可以帮助自己今后查看代码。
- **使用黑科技** 由于浏览器之间的差异，JavaScript 代码中通常包含一些黑科技。不要假设其他人一看就能明白某个黑科技是为了解决某个浏览器的什么问题。如果某个浏览器不能使用正常方式达到目的，那要在注释里把黑科技的用途写出来。这样可以避免别人误以为黑科技没有用而把它“修复”掉，结果你已解决的问题又会出现。

#### 2.变量和函数命名

以下是关于命名的通用规则。

- 变量名应该是名词，例如 `car` 或 `person`
- 函数名应该以动词开始，例如 `getName()`。返回布尔值的函数通常以 `is` 开头，比如 `isEnabled()`
- 对变量和函数都使用符合逻辑的名称，不用担心长度。长名字的问题可以通过后处理和压缩解 决
- 变量、函数和方法应该以小写字母开头，使用驼峰大小写（camelCase）形式，如 `getName()`和 `isPerson`。类名应该首字母大写，如 `Person`、`RequestFactory`。常量值应该全部大写并以下划线相接，比如 `REQUEST_TIMEOUT`
- 名称要尽量用描述性和直观的词汇，但不要过于冗长。`getName()` 一看就知道会返回名称，而 `PersonFactory` 一看就知道会产生某个 `Person` 对象或实体

通过适当命名，代码读起来就会像故事，因此更容易理解。

#### 3.变量类型透明化

因为 JavaScript 是松散类型的语言，所以很容易忘记变量包含的数据类型

有三种方式可以标明变量的数据类型。

第一种标明变量类型的方式是通过初始化。定义变量时，应该立即将其初始化为一个将来要使用的 类型值。

```js
// 通过初始化标明变量类型
let found = false; // 布尔值
let count = -1; // 数值
let name = ""; // 字符串
let person = null; // 对象
```

ES6 之前，初始化方式不适合函数声明中函数的参数；ES6 之后，可以在函数声明中为参数指定默认值来标明参数类型

第二种标明变量类型的方式是使用匈牙利表示法。匈牙利表示法指的是在变量名前面前缀一个或多个字符表示数据类型。JavaScript 传统的匈牙利表示法用 `o` 表示对象，`s` 表示字符串，`i` 表示整数，`f` 表示浮点数，`b` 表示布尔值。

```js
// 使用匈牙利表示法标明数据类型
let bFound; // 布尔值
let iCount; // 整数
let sName; // 字符串
let oPerson; // 对象
```

匈牙利表示法也可以很好地应用于函数参数。它的缺点是使代码可读性下降、不够直观，并破坏了类似句子的自然阅读流畅性。

最后一种标明变量类型的方式是使用类型注释。类型注释放在变量名后面、初始化表达式的前面。

```js
// 使用类型注释表明数据类型
let found /*:Boolean*/ = false;
let count /*:int*/ = 10;
let name /*:String*/ = "Nicholas";
let person /*:Object*/ = null;
```

类型注释在保持代码整体可读性的同时向其注释了类型信息。类型注释的缺点是不能再使用多行注释把大型代码块注释掉了。因为类型注释也是多行注释，所以会造成干扰

补充一种，**强烈推荐**，使用 [JSDoc](https://jsdoc.app/index.html) 文档注释表示类型

```js
/** @type {boolean} */
let found;
/** @type {number} */
let count;
/** @type {string} */
let name;
/** @type {Object} */
let person;
```

### 28.1.3 松散耦合

只要应用程序的某个部分对另一个部分依赖得过于紧密，代码就会变成紧密耦合，因而难以维护

随时注意不要让代码产生紧密耦合

#### 1.解耦 HTML/JavaScript

把 JavaScript 直接嵌入在 HTML 中，要么使用包含嵌入代码的 `<script>` 元素，要么使用 HTML 属性添加事件处理程序，这些都会造成紧密耦合。

```html
<!-- 使用<script>造成 HTML/JavaScript 紧密耦合 -->
<script>
  document.write("Hello world!");
</script>

<!-- 使用事件处理程序属性造成 HTML/JavaScript 紧密耦合 -->
<input type="button" value="Click Me" onclick="doSomething()"/>
```

理想情况下，HTML 和 JavaScript 应该完全分开，通过外部文件引入 JavaScript，然后使用 DOM 添加行为。

在相反的情况下，HTML 和 JavaScript 也会变得紧密耦合：把 HTML 包含在 JavaScript 中。

```js
// HTML 紧密耦合到了 JavaScript
function insertMessage(msg) {
  let container = document.getElementById("container");
  container.innerHTML = `<div class="msg">
    <p> class="post">${msg}</p>
    <p><em>Latest message above.</em></p>
	</div>`;
}
```

HTML 渲染应该尽可能与 JavaScript 分开。在使用 JavaScript 插入数据时，应该尽可能不要插入标记。

#### 2.解耦 CSS/JavaScript

CSS 也可能与 JavaScript 产生紧密耦合。

```js
// CSS 紧耦合到了 JavaScript
element.style.color = "red";
element.style.backgroundColor = "blue";
```

现代 Web 应用程序经常使用 JavaScript 改变样式，因此虽然不太可能完全解耦 CSS 和 JavaScript，但可以让这种耦合变成更松散。这主要可以通过动态修改类名而不是样式来实现

```js
// CSS 与 JavaScript 松散耦合
element.className = "edit";
```

同样，保证层与层之间的适当分离至关重要。显示出问题就应该只到 CSS 中解决，行为出问题就应该只找 JavaScript 的问题。

#### 3.解耦应用程序逻辑/事件处理程序

将应用程序逻辑与事件处理程序分开，各自负责处理各自的事情。事件处理程序应该专注于 `event` 对象的相关信息，然后把这些信息传给处理应用程序逻辑的某些方法。

```js
// bad
function handleKeyPress(event) {
  if (event.keyCode == 13) {
    let target = event.target;
    let value = 5 * parseInt(target.value);
    if (value > 10) {
      document.getElementById("error-msg").style.display = "block";
    }
  }
}
```

```js
// good
function validateValue(value) {
  value = 5 * parseInt(value);
  if (value > 10) {
    document.getElementById("error-msg").style.display = "block";
  }
}
function handleKeyPress(event) {
  if (event.keyCode == 13) {
    let target = event.target;
    validateValue(target.value);
  }
} 
```

以下是在解耦应用程序逻辑和业务逻辑时应该注意的几点。

- 不要把 `event` 对象传给其他方法，而是只传递 `event` 对象中必要的数据。
- 应用程序中每个可能的操作都应该无须事件处理程序就可以执行。
- 事件处理程序应该处理事件，而把后续处理交给应用程序逻辑。

