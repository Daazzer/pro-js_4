# 第 3 章 语言基础

ECMA-262 第 5 版（ES5）定义的 ECMAScript，是目前为止兼容性最好，实现最为广泛的一个版本。第 6 版（ES6）次之。但是到 2017 年底，大多数主流浏览器几乎全部实现了这一版的规范。



## 3.1 语法

ECMAScript 的语法很大程度上借鉴了 C 语言和其他类 C 语言，如 Java 和 Perl



### 3.1.1 区分大小写

ECMAScript 中的一切都区分大小写。关键字不能用作变量名，比如 `typeof` 关键字，但是 `Typeof` 是一个有效的变量名



### 3.1.2 标识符

所谓**标识符**，就是变量、函数、属性或函数参数的名称。标识符可以由一个或多个下列字符组成：

- 第一个字符必须是一个字母、下划线 `_` 或美元符号 `$`；
- 剩下的其他字符可以是字母、下划线、美元符号或数字。
- 标识符中的字母可以是扩展 ASCII（Extended ASCII）中的字母，也可以是 Unicode 的字母字符，但不推荐使用

按照惯例，ECMAScript 标识符使用驼峰法命名

```
firstSecond
myCar
doSomethingImportant
```



> **注意：** 关键字、保留字、布尔值和 `null` 不能作为标识符。



### 3.1.3 注释

ECMAScript 采用 C 语言风格的注释。

```js
// 单行注释

/*
多行
注释
*/
```



### 3.1.4 严格模式

ECMAScript 5 增加了严格模式（strict mode）概念，对于不安全的活动会抛出错误。

```js
"use strict";  // 在脚本开头加上这一句
```



实际是一个预处理指令，任何支持 JavaScript 引擎看到它都会切换到严格模式

```js
// 也可以在函数体中执行
function doSomething() {
    "use strict";
    // 函数体
}
```



### 3.1.5 语句

ECMAScript 中的语句以分号结尾。

```js
let sum = a + b  // 没有分号也有效，但是不推荐
let diff = a - b;  // 加分号有效，推荐
```



C 语言风格的代码块

```js
if (test) {
    test = false;
    console.log(test);
}
```



`if` 之类的控制语句只在执行多条语句时要求必须有代码块。不过最佳实践是始终在控制语句使用代码块

```js
// 有效，但是容易导致错误，应该避免
if (test)
    console.log(test);

// 推荐
if (test) {
    console.log(test); 
}
```



## 3.2 关键字与保留字

保留字与关键字不能用作标识符或属性名。

**ECMAScript-262 第 6 版所有关键字**

|            |            |              |          |
| ---------- | ---------- | ------------ | -------- |
| `break`    | `do`       | `in`         | `typeof` |
| `case`     | `else`     | `instanceof` | `var`    |
| `catch`    | `export`   | `new`        | `void`   |
| `class`    | `extends`  | `return`     | `while`  |
| `const`    | `finally`  | `super`      | `with`   |
| `continue` | `for`      | `switch`     | `yield`  |
| `debugger` | `function` | `this`       |          |
| `default`  | `if`       | `throw`      |          |
| `delete`   | `import`   | `try`        |          |

**未来保留字**，同样不能用作标识符和属性名

**ECMAScript-262 第 6 版为将来保留的所有词汇**

| 始终保留 | 严格模式下保留 | 模块代码中保留 |
| -------- | -------------- | -------------- |
| `enum`   | `implements`   | `await`        |
|          | `interface`    |                |
|          | `let`          |                |
|          | `package`      |                |
|          | `protected`    |                |
|          | `private`      |                |
|          | `public`       |                |
|          | `static`       |                |



## 3.3 变量

ECMAScript 变量时松散类型的，意思是变量可以用于保存任何类型的数据。每个变量只不过是一个用于保存任意值的命名占位符。

声明变量的三个关键字：

- 所有版本：`var`
- ES6+：`let`、`const`



### 3.3.1  var  关键字

定义变量

```js
// 不仅可以改变保存的值，还可以改变值的类型
var message = "hi";
message = 100;  // 合法，但不推荐
```



#### 1. var 声明作用域

`var` 能声明函数局部变量。

```js
function test() {
    var message = "hi";  // 局部变量
}
test();
console.log(message);  // 出错！
```



但是如果在函数内部省略 `var`，则会创建一个全局变量

```js
function test() {
    message = "hi";  // 全局变量
}
test();
console.log(message);  // "hi"
```



> **注意：**这种省略 `var` 的定义变量不推荐。在局部作用域定义的全局变量会导致代码很难维护，严格模式下会抛出 `ReferenceError`



定义多个变量，可以用逗号分隔

```js
var message = "hi",
    found = false,
    age = 29;
```



不同数据类型初始化变量可以用一条语句声明。

严格模式下，不能定义名为 `eval` 和 `arguments` 的变量，否则会导致语法错误



#### 2. var 声明提升

这个关键字的声明的变量会自动提升（hoist）到作用域顶部，以下代码不会报错

```js
function foo() {
    console.log(age);
    var age = 26;
}
foo();  // undefined
```



等价于

```js
function foo() {
    var age;
    console.log(age);
    age = 26;
}
foo();  // undefined
```



反复多次使用 `var` 声明同一个变量也没有问题

```js
function foo() {
    var age = 16;
    var age = 26;
    var age = 36;
    console.log(age);
}
foo();  // 36
```



### 3.3.2 let 声明

`let`  声明的范围是块级作用域，`var` 声明的范围是函数作用域

```js
if (true) {
    var name = 'Matt';
    console.log(name);  // Matt
}
console.log(name);  // Matt
```



```js
if (true) {
    let age = 26;
    console.log(age);  // 26
}
console.log(age);  // ReferenceError: age 没有定义
```



适用于 `var` 的作用域限制同样适用于 `let`

`let` 不允许同一个块级作用域中出现冗余（重复）声明

```js
var name;
var name;

let age;
let age;  // SyntaxError: 标识符 age 已经声明过了
```



混用 `var` 和 `let` 的冗余声明同样会出现错误

```js
var name;
let name;  // SyntaxError

let age;
var age;  // SyntaxError
```



#### 1. 临时死区

`let` 声明的变量不会在作用域中被提升

```js
// name 会被提升
console.log(name);  // undefined
var name = 'Matt';

// age 不会被提升
console.log(age);  // ReferenceError: age 没有定义
let age = 26;
```



在 `let` 声明之前的执行瞬间被称为“暂时性死区”（temporal dead zone），在此阶段引用任何后面才声明的变量都会抛出 `ReferenceError`



#### 2. 全局声明

使用 `let` 声明的全局变量不会成为 `window` 对象的属性

```js
var name = 'Matt';
console.log(window.name);  // 'Matt'

let age = 26;
console.log(window.age);  // undefined
```



#### 3.  条件声明

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>条件声明</title>
</head>
<body>
    <script>
        var name = 'Nicholas';
        let age = 26;
    </script>

    <script>
        // var 声明可以被提升，不需要检测前面是否被声明
        var name = 'Matt';

        // 如果 age 在前面被声明过，这里会报错
        let age = 36;
    </script>
</body>
</html>
```



```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>限制在作用域内的条件声明</title>
</head>
<body>
    <script>
        var name = 'Nicholas';
        let age = 26;
    </script>

    <script>
        /*
        假设脚本不确定页面是否已经声明了同名变量
        那它可以假设还没有声明过
        */
        if (typeof name === 'undefined') {
            let name;
        }

        /*
        name 被限制在 if {} 块的作用域内
        因此这个赋值形同全局赋值
        */
        name = 'Matt';

        try {
            console.log(age);  // 如果 age 没有声明过，则会报错
        } catch (error) {
            let age;
        }

        /*
        age 被限制在 catch {}  块的作用域内
        因此这个赋值形同全局赋值
        */
        age = 26;
    </script>
</body>
</html>
```



#### 4. for 循环中的 let 声明

在 `for` 循环体中使用 `var` 声明的迭代变量会渗透到循环体外部：

```js
for (var i = 0; i < 5; ++i) {
    // 循环逻辑
}
console.log(i);  // 5
```



如果使用 `let`

```js
for (let i = 0; i < 5; ++i) {
    // 循环逻辑
}
console.log(i);  // ReferenceError: i 没有定义
```



最常见的迭代变量的奇特声明和修改

```js
for (var i = 0; i < 5; ++i) {
    setTimeout(() => console.log(i), 0);
}
// 你可能以为是：0、1、2、3、4
// 实际上：5、5、5、5、5
// 所有的 i 都是同一个变量，最终输出是导致循环退出的 i 值，也就是 5
```



使用 `let` 声明解决

```js
for (let i = 0; i < 5; ++i) {
    setTimeout(() => console.log(i), 0);
}
// 会输出：0、1、2、3、4
// 每个循环迭代都声明一个新的迭代变量 i ，所以每次引用 i 的值都不同
```



### 3.3.3 const 声明

`const` 与 `let` 声明基本相同，唯一一个重要区别是用它声明变量时必须初始化变量（必须声明时就要赋值），而且尝试修改 `const` 声明的变量会导致运行时错误

```js
const age = 26;
age = 36;  // TypeError: 给常量赋值
```



`const ` 也允许重复声明

```js
const name = 'Matt';
const name = 'Nicholas';  // SyntaxError
```



`const` 声明的作用域也是块级作用域

```js
const name = 'Matt';
if (true) {
    const name = 'Nicholas';
}
console.log(name);  // Matt
```



`const` 声明的限制只适用于它指向的变量的引用。如果 `const` 变量引用的是一个对象，那么修改这个对象内部的属性并不违反 `const` 的限制

```js
const person = {};
person.name = 'Matt';  // ok
```



`for` 循环迭代时，就要注意不要用 `const` 声明迭代变量

```js
for (const i = 0; i < 10; ++i) {}  // TypeError: 给常量赋值
```



但是如果在 `for-of` 和 `for-in` 中就可以使用，这样也是特别有意义

```js
let i = 0;
for (const j = 7; i < 5; ++i) {
    console.log(j);
}
// 7, 7, 7, 7, 7

for (const key in { a: 1, b: 2 }) {
    console.log(key);
}
// a, b

for (const value of [1, 2, 3, 4, 5]) {
    console.log(value);
}
// 1, 2, 3, 4, 5
```



### 3.3.4 声明风格及最佳实践

#### 1. 不使用 var

有了 `let` 和 `const` 声明，使代码质量提升，而且有明确的作用域和声明位置以及不变的值

#### 2. const 优先，let 次之

`const` 除了能把变量保持不变，还可以让静态代码分析工具提前发现不合法的赋值操作。

只在提前知道未来会有修改时才用 `let`。

可以令开发者迅速发现因意外赋值导致的非预期行为



## 3.4 数据类型

ECMAScript 有 6 种简单数据类型（也称为原始类型）：`Undefined`、`Null`、`Boolean`、`Number`、`String` 和 `Symbol` （符号）是 ECMAScript 6 新增的。还有一种复杂数据类型叫 `Object`（对象）



### 3.4.1 typeof 操作符

对一个值使用 `typeof` 操作符会返回下列字符串

- `undefined` 表示值未定义；
- `boolean` 表示值为布尔值；
- `string` 表示值为字符串；
- `number` 表示值为数值；
- `object` 表示值为对象（而不是函数）或 `null`；
- `function` 表示值为函数；
- `symbol` 表示值为符号；

```js
let message = "some string";
console.log(typeof message);  // "string"
// typeof 不需要参数，但是可以用参数，一般不推荐这样使用
console.log(typeof(message));  // "string"
console.log(typeof 95);  // "number"
```



> **注意：**严格来讲，函数在 ECMAScript 中被认为是对象，并不代表一种数据类型。但是有必要通过 `typeof` 操作符来区分函数和其他对象



### 3.4.2 Undefined 类型

`Undefined` 类型只有一个值，就是特殊值 `undefined`。当使用 `var` 或 `let` 声明了变量但没有初始化时，就相当于给变量赋予了 `undefined` 值：

```js
let message;
console.log(message == undefined);  // true

// 显式以 undefined 初始化。但是不必要
let message = undefined;
console.log(message == undefined);  // true
```



> **注意：**字面量 `undefined` 在 ECMA-262 第 3 版之前是不存在的。增加这个特殊值的目的就是为了正式明确空对象指针 `null` 和未初始化变量的区别



包含 `undefined` 值的变量和未定义变量的区别

```js
let message;

console.log(message);
console.log(age);  // 报错，这个值还没声明
```



但是对未定义的变量使用 `typeof` 操作符会让人疑惑

```js
let message;

console.log(typeof message);  // "undefined"
console.log(typeof age);  // "undefined"
```



对于未声明的变量调用 `delete` 也不会报错，但这个操作什么用，严格模式下会报错

`undefined` 是一个假值。因此，如果需要，可以用更简洁的方式检测它。不过要记住，也有很多其它可能的值同样是假值。所以一定要明确自己想检测的就是 `undefined` 这个字面值，而不仅仅是假值。



### 3.4.3 Null 类型

`Null` 类型同样只有一个值，即特殊值 `null`。逻辑上讲，`null` 值表示一个空对象指针，这也是给 `typeof` 传一个 `null` 会返回 `"object"` 的原因：

```js
let car = null;
console.log(typeof car);  // object
```



在定义将来要保存对象的变量时，建议使用 `null` 来初始化，不要使用其他值。

```js
if (car != null) {
    // car 是一个对象的引用
}
```



`undefined` 值是由 `null` 值派生而来的，因此 ECMA-262 将它们定义为表面上相等

```js
console.log(null == undefined);  // true，这个 == 操作符会进行数据转换
```



任何时候，只要变量要保存对象，而且当时又没有那个对象可保存，就要用 `null` 来填充该变量。这样就可以保持 `null` 是空对象指针的语义，并进一步将其与 `undefined` 区分开来

`null` 是一个假值。因此，如果需要，可以用更简洁的方式检测它。不过要记住，也有很多其它可能的值同样是假值。所以一定要明确自己想检测的就是 `null` 这个字面值，而不仅仅是假值。



### 3.4.4 Boolean 类型

有两个字面量：`true` 和 `false`

这两个布尔值不同于数值，因此 `true` 不等于 1，`false` 不等于 0

所有其他 ECMAScript 类型的值都有相应布尔值的等价形式。要将一个其他的类型的值转换为布尔值，可以调用特定的 `Boolean()` 转型函数

```js
let message = "Hello World!";
let messageAsBoolean = Boolean(message);
```



什么样的值能转为 `true` 或 `false` 取决于数据类型和实际的值：

| 数据类型    | 转换为 `true` 的值     | 转换为 `false` 的值 |
| ----------- | ---------------------- | ------------------- |
| `Boolean`   | `true`                 | `false`             |
| `String`    | 非空字符串             | `""` （空字符串）   |
| `Number`    | 非零数值（包括无穷值） | 0、`NaN`            |
| `Object`    | 任意对象               | `null`              |
| `Undefined` | N/A（不存在）          | `undefined`         |



js 的数据自动转换的原因，理解以上非对程序流控制语句常重要

### 3.4.5 Number 类型

`Number` 类型使用 IEEE 754 格式表示整数和浮点值（在某些语言中也叫双精度值）。不同的数值类型相应地也有不同的数值字面量格式。

十进制数值字面量格式：

```js
let intNum = 55;  // 整数
```



八进制数值字面量，第一个数字必须是零（0），然后是相应的八进制数字（0~7）。如果字面量中包含的数字超出了应有的范围，就会忽略前缀的零，后面的数字序列会被当成十进制数：

```js
let octalNum1 = 070;  // 八进制的 56
let octalNum2 = 079;  // 无效的八进制值，当成 79 处理
let octalNum3 = 08;  // 无效的八进制值，当成 8 处理
```



八进制字面量在严格模式下是无效的，会导致 JavaScript 引擎抛出语法错误

ES6 中的八进制通过 `0o` 前缀来表示，如果表示八进制值，应该使用前缀 `0o`

```js
let octalNum1 = 0o70;  // 八进制的 56
let octalNum2 = 0o52;  // 八进制的 42
```



十六进制字面量，必须使用前缀 `0x` （区分大小写，大小写均可），然后是十六进制的数字（0~9以及A~F）。字母大小写均可。

```js
let hexNum1 = 0xA;  // 十六进制 10
let hexNum2 = 0x1f;  // 十六进制 31
```



十六进制和八进制格式的数值在所有数学操作中都被视为十进制的数值

> **注意：**正零（+0）和负零（-0）在所有情况下都被认为是等同的

#### 1. 浮点数

数值中必须包含小数，而且小数后面必须至少有一个数字。虽然小数点前面不是必须有整数，但是建议加上

```js
let floatNum1 = 1.1;
let floatNum2 = 0.1;
let floatNum3 = .1;  // 有效，但是不推荐
```



在小数点后面没有数字的情况下，数值就会变成整数。如果小数点后面只跟着 0 （如 1.0），也会被转换为整数

```js
let floatNum1 = 1.;  // 被转为整数 1
let floatNum2 = 10.0;  // 被转为整数 10
```



对于非常大或非常小的数值，浮点值可以用科学记数法来表示。

```js
let floatNum = 3.125e7;  // 等于 31250000，这种做法显得简洁

// 非常小的值
let floatNum1 = 3e-17;  // 0.00000000000000003
```



ECMAScript 会将小数点后至少包含 6 个零的浮点值转换为科学记数法（从 6 个零开始就会转换，例如 0.0000003 会被转为 3e-7）

浮点值的精确度最高可达 17 位小数，但在算术中远不如整数精确。

```js
console.log(0.1 + 0.2);  // 0.30000000000000004

if (a + b == 0.3) {  // 别这么干！
    console.log("You got 0.3");
}
```



因此永远不要测试某个特定的浮点数

> **注意：**之所以存在这种舍入错误，是因为使用了 IEEE 754 数值，这种错误并非 ECMAScript 独有。其他使用相同格式的语言也有这个问题



#### 2. 值的范围

ECMAScript 可以表示的最小数值保存在 `Number.MIN_VALUE` 中，值为 `5e-324`；可以表示的最大数值保存在 `Number.MAX_VALUE` 中，值为 `1.7976931348623157e+308`，如果某个计算得到的数值超出了 JavaScript 可以表示的范围，则会自动保存为：`Infinity`（正无穷）或 `-Infinity` 负无穷

> **注意：**使用 `Number.POSITIVE_INFINITY` 和 `Number.NEGATIVE_INFINITY` 同样可以获得正负的 `Infinity`



#### 3. NaN

表示“不是数值”（Not a Number），用于表示本来要返回数值的操作失败了（而不是抛出错误）

```js
console.log(0/0);  // NaN
console.log(+0/-0);  // NaN

console.log(5/0);  // Infinity
console.log(5/-0);  // -Infinity
```



任何涉及 `NaN` 的操作始终返回 `NaN`，其次 `NaN` 不等于包括 `NaN` 在内的任何值

```js
console.log(NaN == NaN);  // false
```



ECMAScript 提供了 `isNaN()` 函数，检测这个参数是否 “不是数值”

#### 4. 数值转换

有 3 个函数可以将非数值转换为数值：`Number()`、`parseInt()`、`parseFloat()`

`Number()` 函数基于如下规则转换：

- 布尔值，`true` 转换为 1，`false` 转换为 0
- 数值，直接返回
- `null`，返回 0
- `undefined`，返回 `NaN`
- 字符串，则为以下规则
  - 包含数字字符的字符串，包括字符前带加减号，则转为一个十进制数值。`Number("011")` 返回 11（忽略前面的 0）
  - 包含浮点数的字符串，直接返回相应的浮点数（同样忽略前面的 0）
  - 如果包含十六进制，则会转为十进制的数值
  - 如果是空字符串，则返回 0
  - 如果字符串包含以上之外的其他字符，则返回 `NaN`
- 对象，调用 `valueOf()` 方法，并按照上述规则转换返回值。如果转换结果是 `NaN`，则调用 `toString()` 方法，再按照转换字符串的规则转换

```js
let num1 = Number("Hello world!");  // NaN
let num2 = Number("");  // 0
let num3 = Number("000011");  // 11
let num4 = Number(true);  // 1
```



通常想得到整数会优先使用 `parseInt()` 函数，如果第一个字符不是数值字符、加号或减号，会返回 `NaN`，如果第一个是数值字符，则会返回碰到第一个非整数数值字符前的所有数值

```js
let num1 = parseInt("1234blue");  // 1234
```



```js
// 传入第二个参数，则可以用于指定底数（进制数）。
let num = parseInt("0xAF", 16);  // 175

// 而且可以省略 0x
let num1 = parseInt("AF", 16);  // 175
let num2 = parseInt("AF");  // NaN
```



通过第二个参数，可以极大扩展转换后的结果

```js
let num1 = parseInt("10", 2);  // 2，按二进制解析
let num1 = parseInt("10", 8);  // 8，按八进制解析
let num1 = parseInt("10", 10);  // 10，按十进制解析
let num1 = parseInt("10", 16);  // 16，按十六进制解析
```



`parseFloat()` 函数，解析到字符串末尾或者解析到一个无效的浮点数值字符为止。意味着第一次出现小数点是有效的，但第二次出现小数点就无效了。"22.34.5" 将转换为 "22.34"

`parseFloat()` 会始终忽略开头的零，只能解析十进制

```js
let num = parseFloat("0xA");  // 0
```



### 3.4.6 String 类型

`String` （字符串）数据类型表示零或多个 16 位 Unicode 字符序列。

可以使用双引号 `""`、单引号 `''`、反引号 ``` ` 表示

以某种引号开头的字符串，必须仍然以该中引号作为字符串结尾

```js
let firstName = 'Nicholas";  // 语法错误：开头和结尾的引号必须是同一种
```



#### 1. 字符字面量

字符串数据类型包含一些字符字面量，用于表示非打印字符或有其他用途的字符

| 字面量 | 含义          |
| ------ | ------------- |
| `\n`   | 换行          |
| `\t`   | 制表          |
| `\b`   | 退格          |
| `\r`   | 回车          |
| `\f`   | 换页          |
| `\\`   | 反斜杠（`\`） |
| `\'`   | 单引号        |
| `\"`   | 双引号        |
| \\` |  反引号             |
| `\xnn` | 以十六进制编码 `nn` 表示的字符（其中 `n` 是十六进制数字 `0~F`），例如 `\x41` 等于 `"A"` |
| `\unnnn` | 以十六进制编码 `nnnn` 表示的 Unicode 字符（其中 `n` 是十六进制数字 `0~F`），例如 `\u03a3` 等于希腊字符 `"∑"` |



可以作为单个字符被解析

```js
let text = "This is the letter sigma: \u03a3.";

/*
即使包含 6 个字符长的转义序列，变量 text 仍然是 28 个字符长。因为转义序列表示一个字符，
所以只算一个字符
 */
console.log(text.length);  // 28，返回字符串中 16 位字符的个数
```



> **注意：**如果字符串中包含双字节字符，那么 `length` 属性返回的值可能不是准确的字符数。



#### 2. 字符串的特点

要修改某个变量中的字符串，必须先销毁原始的字符串，然后将包含新值的另一个字符串保存到该变量

```js
/*
整个过程首先会分配 10 个字符的空间，然后填充上 "Java" 和 "Script"。
最后销毁原始的字符串 "Java" 和字符串 "Script"，因为这两个字符串都没有用了，
这也是一些早期浏览器在拼接字符串时非常慢的原因
 */
let lang = "Java";
lang = lang + "Script";
```



#### 3. 转换为字符串

`toString()` 方法。这个方法返回当前值的字符串等价物

```js
let age = 11;
let ageAsString = age.toString();  // "11"
let found = true;
let foundAsString = found.toString();  // "true"
```



`null` 和 `undefined` 值没有 `toString()` 方法。此方法没有参数，但是对数值调用此方法时可以接收一个底数参数，表示输出数值字符串的进制数。默认为十进制。

```js
let num = 10;
console.log(num.toString());  // "10"
console.log(num.toString(2));  // "1010"
console.log(num.toString(8));  // "12"
console.log(num.toString(10));  // "10"
console.log(num.toString(16));  // "a"
```



使用 `String()` 转型函数，始终会返回表示相应类型的字符串。

```js
let value1 = 10;
let value2 = true;
let value3 = null;
let value4;

console.log(String(value1));  // "10"
console.log(String(value2));  // "true"
console.log(String(value3));  // "null"
console.log(String(value4));  // "undefined"
```



#### 4. 模板字面量

ECMAScript 6 新增。模板字面量保留换行字符，可以跨行定义字符串

```js
let myMultiLineString = 'first line\nsecond line';
let myMultiLineTemplateLiteral = `first line
second line`;

console.log(myMultiLineString);
// "first line"
// "second line"

console.log(myMultiLineTemplateLiteral);
// "first line"
// "second line"

console.log(myMultiLineString === myMultiLineTemplateLiteral);  // true
```



顾名思义，模板字面量在定义模板时特别有用



#### 5. 字符串插值

可以在一个连续定义中插入一个或多个值。求值后得到的是字符串。

在 `${}` 中插入 JavaScript 表达式

```js
let value = 5;
let exponent = 'second';
let interpolatedTemplateLiteral = `${value} to the ${exponent} power is ${value * value}`;

console.log(interpolatedTemplateLiteral);  // 5 to the second power is 25
```



所有插入的值都会使用 `toString()` 强制转换为字符串

```js
let foo = { toString: () => 'World' };
console.log(`Hello, ${foo}!`);  // Hello, World!
```



也可以插入自己之前的值

```js
let value = '';
function append() {
    value = `${value}abc`;
    console.log(value);
}

append();  // abc
append();  // abcabc
append();  // abcabcabc
```



#### 6. 模板字面量标签函数

标签函数会接收被插值记号分隔后的模板和对每个表达式求值的结果。

```js
/*
标签函数接收到的参数依次是原始字符串数组对每个表达式求值的结果
这个函数的返回值是对模板字面量求值得到的字符串
 */
let a = 6;
let b = 9;

function simpleTag(strings, aValExpression, bValExpression, sumExpression) {
    console.log(strings);
    console.log(aValExpression);
    console.log(bValExpression);
    console.log(sumExpression);

    return 'foobar';
}

let untaggedResult = `${a} + ${b} = ${a + b}`;
let taggedResult = simpleTag`${a} + ${b} = ${a + b}`;
// ["", " + ", " = ", ""]
// 6
// 9
// 15

console.log(untaggedResult);  // "6 + 9 = 15"
console.log(taggedResult);  // "foobar"
```



因为表达式参数的数量是可变的，所以通常使用剩余操作符（rest operator）将它们收集到一个数组中：

```js
let a = 6;
let b = 9;

function simpleTag(strings, ...expressions) {
    console.log(strings);
    expressions.forEach(expression => console.log(expression));

    return 'foobar';
}

let taggedResult = simpleTag`${a} + ${b} = ${a + b}`;
// ["", " + ", " = ", ""]
// 6
// 9
// 15

console.log(taggedResult);  // "foobar"
```



对于有 n 个插值的模板字面量，传给标签函数的**表达式参数**个数始终是 n，而第一个字符串数组参数所包含的字符串个数始终是 n + 1。

```js
let a = 6;
let b = 9;

/*
把这些字符串和表达式求值的结果拼接起来
作为默认返回的字符串
 */
function zipTag(strings, ...expressions) {
    return strings[0] + expressions.map((e, i) => `${e}${strings[i + 1]}`).join('');
}

let untaggedResult = `${a} + ${b} = ${a + b}`;
let taggedResult = zipTag`${a} + ${b} = ${a + b}`;

console.log(untaggedResult);  // "6 + 9 = 15"
console.log(taggedResult);  // "6 + 9 = 15"
```



#### 7. 原始模板字符串

`String.raw` 标签函数

```js
console.log(`\u00A9`);  // ©
console.log(String.raw`\u00A9`);  // \u00A9
```



实际换行符也是原样输出

```js
console.log(`first line\nsecond line`);
// first line
// second line
console.log(String.raw`first line\nsecode line`);  // first line\nsecode line

console.log(String.raw`first line
second line`);
// first line
// second line
```



```js
function printRaw(strings) {
    console.log('Actual characters:');

    for (const string of strings) {
        console.log(string);
    }

    console.log('Escaped charaters:');

    for (const rawString of strings.raw) {
        console.log(rawString);
    }
}

printRaw`\u00A9${'and'}\n`;
// Actual characters:
// ©
// 换行符
// Escaped charaters:
// \u00A9
// \n
```



### 3.4.7 [Symbol 类型](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)

`Symbol` （符号）是 ECMAScript 6 新增的数据类型。符号是原始值，且符号实例是唯一、不可变的。确保对象属性使用唯一标识符，防止对象属性冲突。

#### 1. 符号的基本用法

需要使用 `Symbol()` 函数初始化。应为符号本身是原始类型，所以 `typeof` 操作符号返回 `symbol`

```js
let sym = Symbol();
console.log(typeof sym);  // symbol
```



可以传入字符串参数作为符号的描述（description）

```js
let genericSymbol = Symbol();
let otherGenericSymbol = Symbol();

let fooSymbol = Symbol('foo');
let otherFooSymbol = Symbol('foo');

console.log(genericSymbol == otherGenericSymbol); // false
console.log(fooSymbol == otherFooSymbol); // false
```



按照规范，你只要创建 `Symbol()` 实例并将其用作对象的新属性，就可以保证它不会覆盖已有的对象属性，无论是符号属性还是字符串属性

```js
let genericSymbol = Symbol();
console.log(genericSymbol);  // Symbol()

let fooSymbol = Symbol('foo');
console.log(fooSymbol);  // Symbol(foo)
```



`Symbol()` 不能用作构造函数，与 `new` 关键字一起使用会报错。

```js
let mySymbol = new Symbol();  // TypeError: Symbol is not a constructor

/*
如果你确实像使用符号包装对象，可以借用
Object() 函数
 */
let mySymbol1 = new Symbol();
let myWrappedSymbol = Object.(mySymbol1);
console.log(typeof myWrappedSymbol);  // "object"
```



#### 2. 使用全局符号注册表

使用一个字符串作为键，在全局符号注册表中创建重用符号

第一次使用某个字符串调用时，它会检查全局运行时注册表，发现不存在对应的符号，于是就会生成一个新符号实例并添加到注册表中。后续使用相同字符串调用同样会检查注册表，发现存在于该字符串对应的符号，然后就会返回该符号实例

`Symbol.for()` 方法

```js
let fooGlobalSymbol = Symbol.for('foo');
console.log(typeof fooGlobalSymbol);  // symbol

// 重用已有 symbol
let otherFooGlobalSymbol = Symbol.for('foo');

console.log(fooGlobalSymbol === otherFooGlobalSymbol);  // true
```



全局注册表定义的符号跟 `Symbol()` 直接定义的符号不相同

```js
let localSymbol = Symbol('foo');
let globalSymbol = Symbol.for('foo');

console.log(localSymbol === globalSymbol);  // false
```



全局注册表符号必须要用字符串键来创建，因此传入 `Symbol.for()` 中的任何值都会转换为字符串

```js
let emptyGlobalSymbol = Symbol.for();

console.log(emptyGlobalSymbol);  // Symbol(undefined)
```



还可以使用 `Symbol.keyFor()` 来查询全局注册表，接收一个符号作为参数，返回对应的字符串键

```js
// 创建全局符号
let s = Symbol.for('foo');
console.log(Symbol.keyFor(s));  // foo

// 创建普通符号
let s2 = Symbol('bar');
console.log(Symbol.keyFor(s2));  // undefined

// 如果传入的不是 symbol 类型，则抛出 TypeError
Symbol.keyFor(123);  // TypeError: 123 is not a symbol
```



#### 3. 使用符号作为属性

字面量属性名和 `Object.defineProperty() / Object.defineProperties()` 定义的属性名均可使用符号作为属性

```js
let s1 = Symbol('foo'),
    s2 = Symbol('bar'),
    s3 = Symbol('baz'),
    s4 = Symbol('qux');

let o = {
    [s1]: 'foo val'
};
// 也可以 o[s1] = 'foo val';

console.log(o);  // {Symbol(foo): "foo val"}


Object.defineProperty(o, s2, { value: 'bar val' });

console.log(o);  // {Symbol(foo): "foo val", Symbol(bar): "bar val"}

Object.defineProperties(o, {
    [s3]: { value: 'baz val' },
    [s4]: { value: 'qux val' }
});

console.log(o);  // {Symbol(foo): "foo val", Symbol(bar): "bar val", Symbol(baz): "baz val", Symbol(qux): "qux val"}
```



```js
let s1 = Symbol('foo'),
    s2 = Symbol('bar');

let o = {
    [s1]: 'foo val',
    [s2]: 'bar val',
    baz: 'baz val',
    qux: 'qux val'
};

// Object.getOwnPropertyNames() 返回对象实例的常规属性数组
console.log(Object.getOwnPropertyNames(o));
// ["baz", "qux"]

// Object.getOwnPropertySymbols() 返回对象实例的符号属性数组，与 Object.getOwnPropertyNames() 互斥
console.log(Object.getOwnPropertySymbols(o));
// [Symbol(foo), Symbol(bar)]

// Object.getOwnPropertyDescriptor() 返回同时包含常规和符号属性描述符的对象
console.log(Object.getOwnPropertyDescriptors(o));
// {baz: {…}, qux: {…}, Symbol(foo): {…}, Symbol(bar): {…}}

// Reflect.ownKeys() 返回两种类型的键
console.log(Reflect.ownKeys(o));
// ["baz", "qux", Symbol(foo), Symbol(bar)]
```



符号属性是对内存中符号的一个引用，所以直接创建并用作属性的符号不会丢失。但是，如果没有显式地保存对这些属性的引用，那么必须遍历对象的所有符号属性才能找到相应的属性键：

```js
let o = {
    [Symbol('foo')]: 'foo val',
    [Symbol('bar')]: 'bar val'
};

console.log(o);
// {Symbol(foo): "foo val", Symbol(bar): "bar val"}

let barSymbol = Object.getOwnPropertySymbols(o).find(symbol => symbol.toString().match(/bar/));

console.log(barSymbol);
// Symbol(bar)
```



#### 4. 常用内置符号

内置符号都以 `Symbol` 工厂函数字符串属性的形式存在

这些内符号最重要的用途之一是重新定义他们，从而改变原生结构的行为。比如，我们知道 `for-of` 循环会在相关对象上使用 `Symbol.iterator` 属性，那么就可以在自定义对象上重新定义 `Symbol.iterator` 值

内置符号，也就是全局函数`Symbol` 的普通字符串属性，指向一个符号的实例。所有内置符号属性都是**不可写**、**不可枚举**、**不可配置**的



> **注意：**在提到 ECMAScript 规范时，符号在规范中的名称，前缀为 `@@`，比如 `@@iterator` 指的就是 `Symbol.iterator`



#### 5. Symbol.asyncIterator

表示“一个方法，该方法返回对象默认的 `AsyncIterator`。由 `for-await-of` 语句使用”

换句话说，这个符号表示实现异步迭代器 API 的函数

`for-await-of` 循环会利用这个函数执行异步迭代操作。

```js
class Foo {
    async *[Symbol.asyncIterator]() {}
}

let f = new Foo();

console.log(f[Symbol.asyncIterator]());
// AsyncGenerator {<suspended>}
```



`Symbol.asyncIterator` 函数生成的对象应该通过 `next()` 方法陆续返回 `Promise` 实例。可以通过显式地调用 `next()` 方法返回，也可以隐式地通过异步生成器函数返回

```js
class Emitter {
    constructor(max) {
        this.max = max;
        this.asyncIdx = 0;
    }

    async *[Symbol.asyncIterator]() {
        while (this.asyncIdx < this.max) {
            yield new Promise(resolve => resolve(this.asyncIdx++));
        }
    }
}

async function asyncCount() {
    const emitter = new Emitter(5);
	
    for await (const x of emitter) {
        console.log(x);
    }
}

asyncCount();
// 0
// 1
// 2
// 3
// 4
```



#### 6. Symbol.hasInstance

使用操作符 `instanceof` 时调用

```js
function Foo() { }
const f = new Foo();
console.log(Foo[Symbol.hasInstance](f));  // true

class Bar { }
const b = new Bar();
console.log(Bar[Symbol.hasInstance](b));  // true
```



默认在所有函数和类上都可以调用

```js
class Bar { }
// 通过静态方法重新定义
class Baz extends Bar {
    static [Symbol.hasInstance]() {
        return false;
    }
}

const b = new Baz();
console.log(Bar[Symbol.hasInstance](b));  // true
console.log(b instanceof Bar);            // true
console.log(Baz[Symbol.hasInstance](b));  // false
console.log(b instanceof Baz);            // false
```



#### 7. Symbol.isConcatSpreadable

ES6 的 `Array.prototype.concat()` 方法会根据接收到的对象类型选择如何将一个类数组对象拼接成数组实例。覆盖 `Symbol.isConcatSpreadable` 的值可以修改这一行为



#### 8. Symbol.iterator

表示实现迭代器 API 的函数，由 `for-of` 语句使用，默认会返回一个实现迭代器 API 的对象。很多时候，返回的对象是实现该 API 的 `Generator`

```js
class Emitter {
    constructor(max) {
        this.max = max;
        this.idx = 0;
    }

    *[Symbol.iterator]() {
        while (this.idx < this.max) {
            yield this.idx++;
        }
    }
}

function count() {
    const emitter = new Emitter(5);

    for (const x of emitter) {
        console.log(x);
    }
}

count();
// 0
// 1
// 2
// 3
// 4
```



#### 9. Symbol.match

`String.protoptye.match()` 方法会使用 `Symbol.match` 为键的函数来对正则表达式求值，可以改变这个函数的默认行为

`Symbol.match` 函数接收一个参数，就是调用 `match()` 方法的字符串实例

```js
class FooMatcher {
    static [Symbol.match](target) {
        return target.includes('foo');
    }
}

console.log('foobar'.match(FooMatcher));  // true
console.log('barbaz'.match(FooMatcher));  // false

class StringMatcher {
    constructor(str) {
        this.str = str;
    }

    [Symbol.match](target) {
        return target.includes(this.str);
    }
}

console.log('foobar'.match(new StringMatcher('foo')));  // true
console.log('barbaz'.match(new StringMatcher('qux')));  // false
```



#### 10. Symbol.replace

`String.prototype.replace()` 方法会以使用 `Symbol.replace` 为键的函数来对正则表达式求值



#### 11. Symbol.search

`String.prototype.search()` 方法会以使用 `Symbol.search` 为键的函数来对正则表达式求值 



#### 12. Symbol.species

这个属性在内置类型中最常用，用于对内置类型实例方法的返回值暴露实例化派生对象（子类）的方法

```js
class Bar extends Array {}
class Baz extends Array {
    static get [Symbol.species]() {
        return Array;
    }
}

let bar = new Bar();
console.log(bar instanceof Array);  // true
console.log(bar instanceof Bar);    // true
bar = bar.concat('bar');
console.log(bar instanceof Array);  // true
console.log(bar instanceof Bar);    // true

let baz = new Baz();
console.log(baz instanceof Array);  // true
console.log(baz instanceof Baz);    // true
baz = baz.concat('baz');
console.log(baz instanceof Array);  // true
console.log(baz instanceof Baz);    // false
```



#### 13. Symbol.split

`String.prototype.split()` 方法使用

...



#### 14. Symbol.toPrimitive

由 `ToPrimitive` 抽象操作使用。强制转换类型时会调用此函数。



#### 15. Symbol.toStringTag

`Object.prototype.toString()` 使用。

通过 `toString()` 方法获取对象标识时，会检索由 `Symbol.toStringTag` 指定的实例标识符。默认为 `"Object"`



#### 16. Symbol.unscopables

设置这个符号并让其映射对应属性的键值为 `true`，就可以阻止该属性出现在 `with` 环境绑定中

```js
const o = { foo: 'bar' };

with (o) {
    console.log(foo);  // bar
}

o[Symbol.unscopables] = {
    foo: true
};

with (o) {
    console.log(foo);  // ReferenceError
}
```



> **注意** 不推荐使用 `with`，因此也不推荐使用 `Symbol.unscopables`



### 3.4.8 Object 类型

ECMAScript 中的对象其实就是一组数据和功能的集合。

```js
const o = new Object();
```



上面类似于 Java，但是 ECMAScript 只要求在给构造函数提供参数时使用括号。如果没有参数，可以省略括号（不推荐）

```js
const o = new Object;  // 合法但是不推荐
```



类似于 Java 中的 `java.lang.Object`，ECMAScript 中的 Object 也是派生其他对象的基类。Object 类型的所有属性和方法在派生的对象上同样存在

 每个 Obejct 实例都有以下属性和方法

| 对象成员                       |                                                            |
| ------------------------------ | ---------------------------------------------------------- |
| `constructor`                  | 用于创建当前对象的够造函数                                 |
| `hasOwnProperty(propertyName)` | 用于判断当前对象实例（不是原型）上是否存在给定的属性       |
| `isPrototypeof(object)`        | 用于判断当前对象是否为另一个对象的原型                     |
| `prototypeIsEnumerable`        | 判断当前属性是否可以用 `for-in` 语句枚举                   |
| `toLocaleString()`             | 返回对象的字符串表示，该字符串反映对象所在的本地化执行环境 |
| `toString()`                   | 返回对象的字符串表示                                       |
| `valueOf()`                    | 返回对象对应的字符串、数值或布尔值表示                     |



> **注意：**因为 BOM 和 DOM 不受 ECMA-262 约束，其中的 JavaScript 有可能不会继承 Object



## 3.5 操作符

在应用给对象时，操作符通常会调用 `valueOf()`和/或 `toString()` 方法来取得可以计算的值

### 3.5.1 一元操作符

只操作一个值的操作符叫一元操作符（unary oprato）。

#### 1. 递增/递减操作符

直接照搬 C 语言，但是有前缀和后缀两个版本

```js
// 前缀递增
let age = 29;
++age;

// 相当于
let age = 29;
age = age + 1;

// 前缀递减
let age = 29;
--age;
```



无论是前缀递增还是前缀递减，变量的值都会在语句被求值之前改变

```js
let age = 29;
let anotherAge = --age + 2;

console.log(age);  // 28
console.log(anotherAge);  // 30
```



前缀递增和前缀递减优先级相等，因此会从左到右依次求值

```js
let num1 = 2;
let num2 = 20;
let num3 = --num1 + num2;
let num4 = num1 + num2;
console.log(num3);  // 21
console.log(num4);  // 21
```



递增和递减后缀，在语句被求值后才发生

```js
let num1 = 2;
let num2 = 20;
let num3 = num1-- + num2;
let num4 = num1 + num2;
console.log(num3);  // 22
console.log(num4);  // 21
```



可以用于任何值，不限于基础类型，甚至可以用于对象

- 对于字符串，如果是数字字符串，则转为数值之后再改变；如果不是数字字符串，则返回 `NaN`
- 对于布尔值，`true`，则返回 1 再改变；`false` 则返回 0 再改变
- 对于浮点数，加 1 或减 1
- 对于对象，则调用 `valueOf()` 方法取得可以操作的值。对得到的值应用以上规则。如果是 `NaN`，则调用 `toString()` 并再次应用其他规则



```js
let s1 = "2";
let s2 = "z";
let b = false;
let f = 1.1;
let o = {
    valueOf() {
		return -1;
    }
};

s1++;  // 3
s2++;  // NaN
b++;  // b 变为 1
f--;  // 0.10000000000000009
o--;  // -2
```



#### 2. 一元加和减

一元加

```js
let num = 25;
num = +num;
console.log(num);  // 25
```



如果一元加应用到非数值，则会执行与 `Number()` 转型函数一样的类型转换。对象则会调用它们的 `valueOf()` 和/或 `toString()` 方法得到可以转换的值



```js
let s1 = "01";
let s2 = "1.1";
let s3 = "z";
let b = false;
let f = 1.1;
let o = {
    valueOf() {
		return -1;
    }
};

s1 = +s1;  // 1
s2 = +s2;  // 1.1
s3 = +s3;  // NaN
b = +b;  // 0
f = +f;  // 1.1
o = +o;  // -1
```



一元减号，会先对非数值类型进行转换，再变成负数

```js
let s1 = "01";
let s2 = "1.1";
let s3 = "z";
let b = false;
let f = 1.1;
let o = {
    valueOf() {
		return -1;
    }
};

s1 = -s1;  // -1
s2 = -s2;  // -1.1
s3 = -s3;  // NaN
b = -b;  // 0
f = -f;  // -1.1
o = -o;  // 1
```



一元加或减主要用于类型转换



### 3.5.2 位操作符

ECMAScript 中的所有数值都以 IEEE 754 64 位格式存储，但位操作不直接应用到 64 位表示，而是先把数值转换为 32 为整数，再进行位操作，之后再把结果转换为 64 位。

有符号整数使用 32 位的前 31 位表示整数。第 32 位表示数值的符号，如 0 表示正，1 表示负。这一位称为**符号位**（sign bit）

正值以真正的而二进制格式存储，即 31 位中每一位都代表 2 的幂。第一位表示 2^1，第二位 2^2，依此类推



负值以一种称为**二补数**的二进制编码存储。通过如下三个步骤计算得到

1. 确定绝对值的二进制表示（如，-18，先确定 18 的二进制表示）
2. 找到数值的一补数（反码），也就是每个 0 变为 1，每个 1 变为 0
3. 给结果加 1

```
// -18 的二进制表示计算
// 从 18 的 二进制表示开始
0000 0000 0000 0000 0000 0000 0001 0010
// 计算一补数，即反转每一位的二进制
1111 1111 1111 1111 1111 1111 1110 1101
// 最后给一补数加 1
1111 1111 1111 1111 1111 1111 1110 1110
```



要注意的是，在处理有符号整数时，我们无法访问第 31 位

```js
let num = -18;
console.log(num.toString(2));  // "-10010"
```



**注意：**在默认情况下，ECMAScript 中的所有整数都表示为有符号数。无符号整数比有符号整数取值的范围大，因为符号位被用来表示数值了

ECMAScript 中在对数值应用位操作时，后台会先把 64 位数值转换为 32 位，然后执行位操作，最后再把结果从 32 位转换为 64 位存储起来。让二进制操作变得和其他语言中类似。特殊数值 `NaN` 和 `Infinity` 在位操作中都会被当成 0 处理

如果将位操作符引用到非数值，那么首先会使用 `Number()` 函数将该值转换为数值（这个过程是自动的），然后再应用位操作。



#### 1. 按位非

用 `~` 波浪符表示，返回数值的一补数（反码），最终结果是对数值取反并减一

```js
let num1 = 25;  // 二进制 0000 0000 0000 0000 0000 0000 0001 1001
let num2 = ~num1;  // 二进制 1111 1111 1111 1111 1111 1111 1110 0110
console.log(num2);  // -26
```



相当于

```js
let num1 = 25;
let num2 = -num1 - 1;
console.log(num2);  // "-26"
```

实际上这两种结果相同，但是位操作会快很多。因为位操作是在数值的底层表示的



#### 2. 按位与

用 `&` 和号表示，本质上是将两个数的每一个位对齐，然后基于下表（同 1 为 1，一 1 为 0）

| 第一个数值的位 | 第二个数值的位 | 结果 |
| -------------- | -------------- | ---- |
| 1              | 1              | 1    |
| 1              | 0              | 0    |
| 0              | 1              | 0    |
| 0              | 0              | 0    |



```js
let result = 25 & 3;
console.log(result);  // 1

/*
 25 = 0000 0000 0000 0000 0000 0000 0001 1001
  3 = 0000 0000 0000 0000 0000 0000 0000 0011
----------------------------------------------
AND = 0000 0000 0000 0000 0000 0000 0000 0001
 */
```



#### 3. 按位或

用管道符 `|` 表示，（有一个为 1，则为 1，全 0，则为 0）

| 第一个数值的位 | 第二个数值的位 | 结果 |
| -------------- | -------------- | ---- |
| 1              | 1              | 1    |
| 1              | 0              | 1    |
| 0              | 1              | 1    |
| 0              | 0              | 0    |



```js
let result = 25 | 3;
console.log(result);  // 27

/*
25 = 0000 0000 0000 0000 0000 0000 0001 1001
 3 = 0000 0000 0000 0000 0000 0000 0000 0011
----------------------------------------------
OR = 0000 0000 0000 0000 0000 0000 0001 1011
 */
```



#### 4. 按位异或

使用脱字符 `^` 表示（同为 0，异为 1）

| 第一个数的位 | 第二个数的位 | 结果 |
| ------------ | ------------ | ---- |
| 1            | 1            | 0    |
| 1            | 0            | 1    |
| 0            | 1            | 1    |
| 0            | 0            | 0    |



```js
let result = 25 ^ 3;
console.log(result);  // 26

/*
 25 = 0000 0000 0000 0000 0000 0000 0001 1001
  3 = 0000 0000 0000 0000 0000 0000 0000 0011
----------------------------------------------
XOR = 0000 0000 0000 0000 0000 0000 0001 1010
 */
```



#### 5. 左移

用两个小于号 `<<` 表示，会按照指定的位数将数值的所有位向左移动。

```js
let oldValue = 2;
let newValue = oldValue << 5;  // 64

/*
     2 = [0]000 0000 0000 0000 0000 0000 0000 0010
-------------------------------------------------
2 << 5 = [0]000 0000 0000 0000 0000 0000 010[0 0000]
		  |                                    |
		  |									   |
		  V 								   v
	 秘密的符号位                     		 空位补 0
 */
```



#### 6. 有符号右移

用两个大于号 `>>` 表示，会将数值的 32 位都向右移，同时保留符号（正或负）

```js
let oldValue = 64;
let newValue = oldValue >> 5;  // 2

/*
     64 = [0]000 0000 0000 0000 0000 0000 0100 0000
-------------------------------------------------------
64 >> 5 = [0][000 00]00 0000 0000 0000 0000 0000 0010
	 	   |    |
		   |	|
		   V 	v
    秘密的符号位 空位补 0
 */
```



#### 7. 无符号右移

用三个大于号 `>>>` 表示，会将数值的所有 32 位都向右移。对于正数，结果与有符号右移相同。

```js
let oldValue = 64;
let newValue = oldValue >>> 5;  // 2
```



对于负数则差距非常大

```js
let oldValue = -64;
let newValue = oldValue >>> 5;  // 134217726

/*
      -64 = 1111 1111 1111 1111 1111 1111 1100 0000
-------------------------------------------------------
-64 >>> 5 = 0000 0111 1111 1111 1111 1111 1111 1110
 */
```



### 3.5.3 布尔操作符

逻辑非、逻辑与、逻辑或

#### 1. 逻辑非

使用 `!` 叹号表示，可以应用给  ECMAScript 的所有值。始终返回布尔值

```js
console.log(!false);  // true
console.log(!"blue");  // false
console.log(!0);  // true
console.log(!NaN);  // true
console.log(!"");  // true
console.log(!12345);  // false
```



#### 2. 逻辑与

使用两个和号 `&&` 表示

```js
let result = true && false;
```



同真则真，一真则假

| 第一个操作数 | 第二个操作数 | 结果    |
| ------------ | ------------ | ------- |
| `true`       | `true`       | `true`  |
| `true`       | `false`      | `false` |
| `false`      | `true`       | `false` |
| `false`      | `false`      | `false` |



逻辑与操作符是一种短路操作符，意思是如果第一个操作数决定了结果，那么永远不会对第二个操作数求值。

如果第一个操作数是 `false`，那么无论第二个操作数是什么值，结果也不可能等于 `true`

```js
let found = true;
let result = (found && someUndeclaredVariable);  // 报错，前面的 found 是 true 所以会继续执行后面的操作数
console.log(result);  // 不会执行这一行
```



```js
let found = false;
let result = (found && someUndeclaredVariable);  // 不会报错
console.log(result);  // 会执行
```



#### 3. 逻辑或

使用两个管道符 `||` 表示

```js
let result = true || false;
```



一真为真，全假为假

| 第一个操作数 | 第二个操作数 | 结果    |
| ------------ | ------------ | ------- |
| `true`       | `true`       | `true`  |
| `true`       | `false`      | `true`  |
| `false`      | `true`       | `ture`  |
| `false`      | `false`      | `false` |



逻辑或也有短路的特征。只不过对于逻辑或而言，第一个操作数求值为 `true`，第二个操作数就不被求值了

```js
let found = true;
let result = (found || someUndeclaredVariable);  // 不会报错
console.log(result);  // 会执行
```



```js
let found = false;
let result = (found || someUndeclaredVariable);  // 报错，前面的 found 是 false 所以会继续执行后面的操作数
console.log(result);  // 不会执行
```



这种模式在 ECMAScript 中经常用于变量赋值



### 3.5.4 乘性操作符

ECMAScript 定义了 3 个乘性操作符：乘法、除法和取模。但是如果乘性操作符有不是数值的操作数，则该操作数会在后台使用 `Number()` 转型函数转换为数值。空字符串被当成 0，而布尔 `true` 被当成 1

#### 1. 乘法操作符

```js
let result = 34 * 56;
```



#### 2. 除法操作符

```js
let result = 66 / 11;
```



#### 3. 取模操作符

取模（余数）操作符用百分比 `%` 号表示

```js
let result = 26 % 5;  // 1
```



### 3.5.5 指数操作符

ECMAScript 7 新增了指数操作符，`Math.pow()` 的操作符 `**`

```js
console.log(Math.pow(3, 2));  // 9
console.log(3 ** 2);  // 9

console.log(Math.pow(16, 0.5));  // 4
console.log(16 ** 0.5);  // 4
```



**指数赋值操作符**

```js
let squared = 3;
squared **= 2;
console.log(squared);  // 9
```



```js
let sqrt = 16;
sqrt **= 0.5;
console.log(sqrt);  // 4
```



### 3.5.6 加性操作符

即加法和减法操作符。但是在 ECMAScript 中会发生类型转换，而且规则不是这么直观



#### 1. 加法操作符

```js
let result = 1 + 2;

let result1 = 5 + 5;  // 10

let result2 = 5 + "5";  // "55" 只要有一个字符串则将另一个转换为字符串，然后拼接到一起

[] + [] // "" 调用了对象的 toString() 方法进行隐式转换了
{} + [] // "[object Object]" 调用了对象的 toString() 方法进行隐式转换了
{} + null // 0
[] + null // "null"
null + null // 0
undefined + null // NaN
```



可以用括号括起来防止转换

```js
let num1 = 5;
let num2 = 10;
let message = "The sum of 5 and 10 is " + (num1 + num2);
// "The sum of 5 and 10 is 15"
```



#### 2.  减法操作符

```js
let result = 2 - 1;
```



```js
let result1 = 5 - true;  // 4 将非数值转换为数值再运算
let result2 = NaN - 1;  // NaN
let result3 = 5 - 3;  // 2
let result4 = 5 - "";  // 字符串、布尔值、null 或 undefined 使用 Number() 转为数值后再运算
let result5 = 5 - "2";  // 3
let result6 = 5 - null;  // 5
{} - {} // NaN - 如果有任一操作数是对象，则调用 `valueOf()` 方法，取得结果后再根据前面的规则执行比较。如果没有 `valueOf()` 操作符，则调用 `toString()` 方法，这里调用了 toString() 方法
[] - [] // 0
5 - Symbol('a')  // 报错
```



### 3.5.7 关系操作符

小于 `<`

大于 `>`

小于等于 `<=`

大于等于 `>=`



- 如果有任一操作数是对象，则调用 `valueOf()` 方法，取得结果后再根据前面的规则执行比较。如果没有 `valueOf()` 操作符，则调用 `toString()` 方法，进行比较
- 对于字符串比较而言，关系操作符会比较字符串中对应字符的编码，而这些编码是数值。问题在于，大写字母的编码都小于小写字母的编码

```js
let result = "Brick" < "alphabet";  // true 字母 B 编码 66，字母 a 编码 97
```



```js
let result = "23" < "3"; // true "2" 编码是 50，"3" 的编码是 51
```



```js
// 如果有一个是数值，结果就对了
let result = "23" < 3;  // false
```



```js
let result = "a" < 3;  // 因为 "a" 会被转换为 NaN，所以结果是 false
```



```js
// 任何操作数与 NaN 比较结果都为 false
let result1 = NaN < 3; // false
let result2 = NaN >= 3; // false
```



### 3.5.8 相等操作符

两组

1. **等于**和**不等于**
2. **全等**和**不全等**



#### 1. 等于和不等于

`==` 和 `!=` 会发生类型转换，先类型转换在比较是否相等

```js
null == undefined;  // true
NaN != NaN; // true
NaN == NaN; // false
"5" == 5;  // true
```



#### 2. 全等和不全等

`===` 和 `!==`

在不进行类型转换的前提下相等才返回 `true`

```js
let result1 = ("55" == 55);  // true
let result2 = ("55" === 55);  // false
```



> **注意：**推荐使用全等和不全等进行操作数比较



### 3.5.9 条件操作符（三元运算符）

```
variable = boolean_expression ? true_value : false_value;
```



如果 boolean_expression 为 `true` 则将 true_value 赋值给 variable 否则将 false_value 赋值给 variable



### 3.5.10 赋值操作符

使用等于号 `=` 表示，将右手边的值赋给左手边的变量

```js
let num = 10;
```



符合写法

```js
let num = 10;
num = num + 10;
```

```js
let num = 10;
num += 10;
```



- 乘后赋值 `*=`
- 除后赋值 `/=`
- 取模后赋值 `%=`
- 加后赋值 `+=`
- 减后赋值 `-=`
- 左移后赋值 `<<=`
- 右移后赋值 `>>=`
- 无符号右移后赋值 `>>>=`

这些操作仅仅是简写，并不会提升性能



### 3.5.11 逗号操作符

可以在一条语句中执行多个操作

```js
let num1 = 1, num2 = 2, num3 = 3;
```



可以使用逗号操作符来辅助赋值。在赋值时使用逗号操作符分隔值，最终会返回表达式中最后一个值

```js
let num = (5, 1, 4, 8, 0);  // num 为 0
```



## 3.6 语句

语句通常使用一个或多个关键字完成既定的任务。语句可以简单，也可以复杂。简单的如告诉函数退出，复杂的如列出一对要重复执行的指令。



### 3.6.1 if 语句

语法：

```tex
if (condition) statement1 else statement2
```



`condition` 可以是任何表达式，并且求值结果不一定是布尔值。ECMAScript 会自动调用 `Boolean()` 函数将这个表达式的值转换为布尔值。如果 `condition` 为 `true` 则执行 `statement1`，`false` 则执行 `statement2`

```js
if (i > 25)
    console.log("Greater than 25");  // 只有一行代码的语句，不推荐，可能会产生疑惑
else {
    console.log("Less than 25 or equal to 25");  // 一个语句块，推荐这样使用
}
```



连续多个 `if` 语句

```tex
if (condition) statement1 else if (condition2) statement2 else statement3
```



```js
if (i < 25) {
    console.log("Greater than 25");
} else if (i < 0) {
    console.log("Less than 0.");
} else {
    console.log("Between 0 and 25, inclusive.");
}
```



### 3.6.2 do-while 语句

是一种后测试循环语句，循环体的代码至少执行一次

```js
do {
    // statement
} while (expression);
```



```js
let i = 0;
do {
    i += 2;
} while (i < 10);
```



### 3.6.3 while 语句

一种先测试循环语句，先检测退出条件，再执行循环体内的代码

```js
while (expression) {
    // statement
}
```



```js
let i = 0;
while (i < 10) {
    i += 2;
}
```



### 3.6.4 for 语句

```tex
for (initialization; expression; post-loop-expression) statement
```



```js
let count = 10;
for (let i = 0; i < count; i++) {
    console.log(i);
}
```



无法通过 `while` 循环实现的逻辑，同样也无法使用 `for` 循环实现

```js
for (;;) {  // 无穷循环
    doSomething();
}
```



只包含条件表达式的 `for` 循环，实际上变成了 `while` 循环

```js
let count = 10;
let i = 0;
for (; i < count; ) {
    console.log(i);
    i++;
}
```





### 3.6.5 for-in 语句

用于枚举对象中的非符号属性

```tex
for (property in expression) statement
```



```js
for (const propName in window) {  // 推荐使用 const
    document.write(propName);
}
```



ECMAScript 中对象属性是无序的，因此 `for-in` 语句不能保证返回对象属性的顺序

迭代 `null` 或 `undefined`，不执行循环体



### 3.6.6 for-of 语句

用于遍历可迭代对象的元素

```tex
for (property of expression) statement
```



```js
for (const el of [2, 4, 6, 8]) {
    document.write(el);
}
```



`for-of` 循环会按照可迭代对象的 `next()` 方法产生值的顺序迭代元素。

> **注意：**ES2018 对 `for-of` 添加了， `for-await-of` 循环，支持生成期约（promise）的异步可迭代对象



### 3.6.7 标签语句

用于给语句添加标签

```tex
label: statement
```



```js
start: for (let i = 0; i < count; i++) {
    console.log(i);
}
```



可以通过 `break` 或 `continue` 语句引用。主要应用于嵌套循环



### 3.6.8 break 和 continue 语句

`break` 用于立即跳出循环，强制执行循环后的下一条语句。

`continue` 立即跳出循环，但会再次从循环顶部开始执行

```js
let num = 0;
for (let i = 1; i < 10; i++) {
    if (i % 5 == 0) {
        break;  // 退出后该次循环不会执行
    }
    num++;
}
console.log(num);  // 4
```



```js
let num = 0;
for (let i = 1; i < 10; i++) {
    if (i % 5 == 0) {
        continue;  // 退出后会再次执行循环
    }
    num++;
}
console.log(num);  // 8
```



与标签一起使用

```js
let num = 0;

outermost:
for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
        if (i == 5 && j == 5) {
            break outermost;  // 直接退出到 i 外边
        }
        num++;
    }
}
console.log(num);  // 55
```



```js
let num = 0;

outermost:
for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
        if (i == 5 && j == 5) {
            continue outermost;  // 直接从 i 继续
        }
        num++;
    }
}
console.log(num);  // 95
```



### 3.6.9 with 语句

将代码作用域设置为特定的对象

```
with (expression) statement
```



```js
let qs = location.search.substring(1);
let hostName = location.hostname;
let url = location.href;
```



用 `with` 语句针对一个对象的反复操作

```js
// 在 with 语句内部，每个变量首先会被认为是一个局部变量。
with (location) {
    let qs = search.substring(1);
    let hostName = hostname;
    let url = href;
}
```



> **警告：**`with` 语句严重影响性能，强烈不推荐在产品代码中使用



### 3.6.10 switch 语句

与 `if` 语句紧密相关的流控制语句

```js
switch (expression) {
    case value1:
        statement
        break;
    case value2:
        statement
        break;
    case value3:
        statement
        break;
    case value4:
        statement
        break;
    default:
        statement
}
```



如果没有 `break` 则会继续匹配下一个 `case`

js 中 `switch` 语句可以用于所有数据类型

```js
switch ("Hello world") {
    case "Hello" + "world":
        console.log("Greeting was found.");
        break;
    case "goodbye":
        console.log("Closing was found.");
        break;
    default:
        console.log("Unexpected message was found.");
}
// "Greeting was found."
```



```js
let num = 25;
switch (true) {
    case num < 0:
        console.log("Less than 0.");
        break;
    case num >= 0 && num <= 10:
        console.log("Between 0 and 10.");
        break;
    case num > 10 && num <= 20:
        console.log("Between 10 and 20.");
        break;
    default:
        console.log("More than 20.");
}
```



> **注意：** `switch` 语句使用全等比较，所以不会自动类型转换



## 3.7 函数

`function` 关键字声明 js 函数

```tex
// 函数的基本语法
function functionName(arg0, arg1, ..., argN) {
    // statements
}
```



```js
function sayHi(name, message) {
    console.log("Hello " + name + ", " + message);
}
```



ECMAScript 中的函数不需要指定是否返回值。

使用 `return` 语句来返回函数的值

```js
function sum(num1, num2) {
    return num1 + num2;
}
```



只要碰到 `return` 语句，就会立即停止执行并退出

```js
function sum(num1, num2) {
    return num1 + num2;
    console.log("Hello world");  // 不会执行
}
```



`return` 语句可以不带返回值，此时函数会立即停止并返回 `undefined`

```js
function sayHi(name, message) {
    return;
    console.log("Hello " + name + ", " + message);  // 不会执行
}
```



> **注意：**最佳实践是函数要么返回值，要么不返回值。

严格模式对函数的限制

- 函数不能以 `eval` 或 `arguments` 作为名称
- 函数的参数不能叫 `eval` 或 `arguments`
- 两个函数的参数不能叫同一个名称