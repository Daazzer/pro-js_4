# 第 5 章 基本引用类型

引用值（或者对象）是某个特定**引用类型**的实例。

在 ECMAScript 中，引用类型是把数据和功能组织到一起的结构，有时候也被称为**对象定义**

> **注意** 引用类型虽然有点像类，但是和类不是一个概念

对象被认为是某个特定引用类型的实例。新对象通过 `new` 操作符后跟一个**构造函数**（constructor）来创建

```js
let now = new Date();
```



> **注意** 函数也是一种引用类型

## 5.1 Date

创建日期对象

```js
let now = new Date();  // 创建保存当前日期和时间的日期对象
```



基于其他日期时间创建日期对象

返回日期毫秒表示

```js
Date.parse();
Date.UTC();
```



Date 构造函数传参

```js
let someDate = new Date(Date.parse("May 23, 2019"));
// 相当于
let someDate = new Date("May 23, 2019");
```



返回当前日期和时间的毫秒数

```js
Date.now();
```

### 5.1.1 继承方法

`toLocaleString()` 返回本地环境一致的日期和时间

`toString()` 返回带时区信息的日期和时间

`valueOf()` 返回日期的毫秒



### 5.1.2 日期格式化方法

- `toDateString()`
- `toTimeString()`
- `toLocaleDateString()`
- `toLocaleTimeString()`
- `toUTCString()`



### 5.1.3 日期/时间组件方法

- `getTime()`
- `setTime(milliseconds)`
- ...



## 5.2 RegExp

ECMAScript 通过 `RegExp` 类型支持正则表达式

```js
let expression = /pattern/flags;
```



pattern（模式）：可以是任何简单或复杂的正则表达式，包括字符类、限定符、分组、向前查找和反向引用。每个正则表达式可以带零个或多个 flags（标记），用于控制正则表达式的行为

- `g`：全局模式，表示字符串的全部内容
- `i`：不区分大小写
- `m`：多行模式
- `y`：粘附模式，表示查找从 `lastIndex` 开始及之后的字符串
- `u`：Unicode 模式，启用 Unicode 匹配
- `s`： dotAll 模式，表示元字符 `.` 匹配任何字符（包括 `\n` 或 `\r`）

所有**元字符**在模式中也必须转义，

```tex
# 元字符
( [ { \ ^ $ | ) ] } ? * + .
```



`RegExp` 的构造形式

```js
let pattern1 = /[bc]at/i;
// 相当于
let pattern2 = new RegExp('[bc]at', 'i');
```



对应字符串参数的转义

| 字面量模式         | 对应的字符串            |
| ------------------ | ----------------------- |
| `/\[bc\]at/`       | `"\\[bc\\]at"`          |
| `/\.at/`           | `"\\.at"`               |
| `/name\/age/`      | `"name\\/age"`          |
| `/\d.\d{1,2}/`     | `"\\d.\\d{1,2}"`        |
| `/\w\\hello\\123/` | `"\\w\\\\hello\\\\123"` |



修改标记

```js
const re1 = /cat/g;
const re2 = new RegExp(re1);  // "/cat/g"
const re3 = new RegExp(re2, "i");  //  "/cat/i"
```



### 5.2.1 RegExp 实例属性

- `global` 布尔值，是否设置了 `g` 标记

- `ignoreCase` 布尔值，是否设置了 `i` 标记

- `unicode` 布尔值，是否设置了 `u` 标记

- `sticky` 布尔值，是否设置了 `y` 标记

- `multiline` 布尔值，是否设置了 `m` 标记

- `dotAll` 布尔值，是否设置了 `s` 标记

- `lastIndex` 源字符串中下次搜索的开始位置，始终从 0 开始

- `source` 正则表达式的字面量字符串

  ```js
  let re = /cat/i;
  console,log(re.source);  // "cat"
  ```

- `flags` 正则的标记字符串



### 5.2.1 RegExp 实例方法

- `exec()` 配合捕获组使用。如果找到匹配项，则返回包含第一个匹配信息的数组；如果没有找到匹配项，则返回 `null`

- [exec 参考](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec)

- JavaScript [`RegExp`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/RegExp) 对象是**有状态**的。他们会将上次成功匹配后的位置记录在 [`lastIndex`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/lastIndex) 属性中。

  ```js
  let text = "mom and dad and baby";
  let pattern = /mom( and dad( and baby)?)?/gi;
  
  let matches = pattern.exec(text);
  console.log(matches.index);  // 0
  console.log(matches.input);  // "mom and dad and baby"
  console.log(matches[0]);  // "mom and dad and baby"
  console.log(matches[1]);  // " and dad and baby"
  console.log(matches[2]);  // " and baby"
  ```

  启用全局标记

  ```js
  let text = "cat, bat, sat, fat";
  let pattern = /.at/g;
  let matches = pattern.exec(text);
  console.log(matches.index);  // 0
  console.log(matches[0]);  // cat
  console.log(pattern.lastIndex);  // 3
  
  matches = pattern.exec(text);
  console.log(matches.index);  // 5
  console.log(matches[0]);  // bat
  console.log(pattern.lastIndex);  // 8
  
  matches = pattern.exec(text);
  console.log(matches.index);  // 10
  console.log(matches[0]);  // sat
  console.log(pattern.lastIndex);  // 13
  ```

  启用粘附模式，`exec()` 就只会在 `lastIndex` 的位置上寻找匹配项，会覆盖全局标记

  ```js
  let text = "cat, bat, sat, fat";
  let pattern = /.at/y;
  let matches = pattern.exec(text);
  console.log(matches.index);  // 0
  console.log(matches[0]);  // cat
  console.log(pattern.lastIndex);  // 3
  
  matches = pattern.exec(text);
  console.log(matches);  // null
  console.log(pattern.lastIndex);  // 0
  
  pattern.lastIndex = 5;
  matches = pattern.exec(text);
  console.log(matches.index);  // 5
  console.log(matches[0]);  // bat
  console.log(pattern.lastIndex);  // 8
  ```

- `test()` 接收一个字符串参数。如果匹配则返回 `true`

- `toLocaleString()` 返回正则字面量

- `toString()`  返回正则字面量

- `valueOf()` 返回值本身

### 5.2.3 RegExp 构造函数属性

其他语言中，这种属性也叫静态属性

| 全名           | 简写 | 说明                                          |
| -------------- | ---- | --------------------------------------------- |
| `input`        | `$_` | 最后搜索的字符串                              |
| `lastMatch`    | `$&` | 最后匹配的文本                                |
| `lastParen`    | `&+` | 最后匹配的捕获组                              |
| `leftContext`  | $`   | `input` 字符串中出现在 `lastMatch` 前面的文本 |
| `rightContext` | `$'` | `input` 字符串中出现在 `lastMatch` 后面的文本 |

> **注意** RegExp 构造函数的所有属性都没有任何 Web 标准出处，因此不要在生产环境中使用



### 5.2.4 模式局限



## 5.3 原始值包装类型

3 种特殊的引用类型：`Boolean`、`Number`、`String`

每当用到某个原始值的方法或属性时，后台会创建一个相应原始包装类型的对象

```js
let s1 = "some text";
let s2 = s1.substring(2);  // 以读模式访问 s1
```



引用类型与原始值包装类型的主要区别在于对象的生命周期。在通过 `new` 实例化引用类型后，得到的实例会在离开作用域时销毁，而自动创建的原始值包装对象则只存在于访问它的那行代码执行期间，意味着不能在运行时给原始值添加属性和方法

```js
let s1 = "some text";
s1.color = "red";
console.log(s1.color);  // undefined
```



`Object` 工厂方法

```js
let obj = new Object("some text");
console.log(obj instanceof String);  // true
```



可以调用 `Boolean`、`Number`、`String` 构造函数创建原始值包装对象，但是要在必要时才这么做

```js
let value = "25";
let number = Number(value);  // 转型函数
console.log(typeof number);  // "number"
let obj = new Number(value);  // 构造函数
console.log(typeof obj);  // "object"
```



### 5.3.1 Boolean

**不建议使用**

```js
let falseObject = new Boolean(false);
let result = falseObject && true;
console.log(result)  // true
```

推荐使用

```js
let falseValue = false;
let result = falseValue && true;
console.log(result)  // false
```

### 5.3.2 Number

- `toFixed()` 传入表示小数位数的参数，返回包含指定小数点位数的字符串
- `toExponential()`  传入表示小数位数的参数，返回科学记数法表示的字符串
- `toPrecision()` 传入表示小数位数的参数，返回科学记数法表示的字符串最合理的输出结果

#### isInteger() 方法与安全整数

- `Number.isInteger()` 鉴别是否为整数 （ES6 新增）

- `Number.isSafeInteger` 鉴别数值是否在安全整数范围内

  

### 5.3.3 String

#### 1. JavaScript 字符

由 16 位码元（code unit）组成。每 16 位码元对应一个字符

字符串 `length` 表示字符串包含多少个 16 位码元

- `charAt()` 返回给定索引位置的字符

  JavaScript 字符串使用了两种 Unicode 编码混合的策略：UCS-2 和 UTF-16 （U+0000~U+FFFF）

- `CharCodeAt()` 查看指定码元的字符编码。这个方法返回指定索引位置的码元值

- `formCharCode()` 用于创建给定的 UTF-16 码元创建字符串中的字符

  以上三个都是表示**基本多语言平面**（BMP） U+0000~U+FFFF 范围的

  但是，如果是表情符之类的**增补平面**，每个字符使用两个 16 位码元的**代理对**策略

- `codePointAt()` 返回该索引位置上的**码点**（是 Unicode 中一个字符的完整标识）

- `fromCodePoint()` 接收任意数量的码点

#### 2. normailze() 方法

4 种规范化形式：NFD、NFC、NFKD、NFKC

判断字符串是否规范化了

```js
let a1 = String.fromCharCode(0x00C5),
    a2 = String.fromCharCode(0x212B),
    a3 = String.fromCharCode(0x0041, 0x030A);

console.log(a1 === a1.normalize("NFD"));  // false
console.log(a1 === a1.normalize("NFC"));  // true
console.log(a1 === a1.normalize("NFKD"));  // false
console.log(a1 === a1.normalize("NFKC"));  // true

console.log(a2 === a2.normalize("NFD"));  // false
console.log(a2 === a2.normalize("NFC"));  // false
console.log(a2 === a2.normalize("NFKD"));  // false
console.log(a2 === a2.normalize("NFKC"));  // false

console.log(a3 === a3.normalize("NFD"));  // true
console.log(a3 === a3.normalize("NFC"));  // false
console.log(a3 === a3.normalize("NFKD"));  // true
console.log(a3 === a3.normalize("NFKC"));  // false
```



#### 3. 字符串操作方法

- `concat()` 拼接多个字符串
- `slice()`
- `substr()`
- `substring()`



#### 4. 字符串位置方法

字符串中定位字符串

- `indexOf()`
- `lastIndexOf()`



#### 5. 字符串包含方法

判断字符串中是否包含另一个字符串的方法

- `startsWith()` 检查开始于索引 0 的匹配项
- `endsWith()` 检查开始于索引 （string.length - substring.length) 的匹配项
- `includes()` 检查整个字符串



#### 6. trim() 方法

创建字符串的一个副本，删除前、后所有空格符

- `trim()`
- `trimLeft()`
- `trimRight()`



#### 7.  repeat() 方法

接收一个参数，表示要将字符串赋值多少次



#### 8. padStart() 和 padEnd() 方法

会复制字符串，如果小于指定长度，则在相应一边填充字符，直至满足长度条件。第一个参数是长度，第二个参数时可选的填充字符串

```js
let stringValue = "foo";

console.log(stringValue.padStart(6));  // "   foo"
console.log(stringValue.padStart(9, "."));  // "......foo"
console.log(stringValue.padStart(8, "bar"));  // "barbafoo"
console.log(stringValue.padStart(2));  // "foo"
console.log(stringValue.padStart(2, "bar"));  // "foo"
```



#### 9. 字符串迭代与解构

字符串原型上暴露了 `@@iterator` 方法，表示可以迭代字符串的每个字符

```js
let message = "abc";
let stringIterator = message[Symbol.iterator]();

console.log(stringIterator.next());  // { value: "a", done: false }
console.log(stringIterator.next());  // { value: "b", done: false }
console.log(stringIterator.next());  // { value: "c", done: false }
console.log(stringIterator.next());  // { value: undefined, done: true }
```



可以在 `for-of` 语句中访问每个字符

可以解构操作

```js
let message = "abcde";
console.log([...message]);  // ["a", "b", "C", "d", "e"]
```



#### 10. 字符串大小写转换

- `toLowerCase()`
- `toLocaleLowerCase()`
- `toUpperCase()`
- `toLocaleUpperCase()`



#### 11. 字符串模式匹配方法

- `match()`

  ```js
  let text = "cat, bar, sat, fat";
  let pattern = /.at/;
  
  // 等价于 pattern.exec(text);
  let matches = text.match(pattern);
  ```

- `search()`

  ```js
  let text = "cat, bar, sat, fat";
  let pos = text.search(/at/);
  console.log(pos);  // 1
  ```

- `replace()`

  - 接收两个参数
  - 第一个：可以是 `RegExp` 实例或者一个字符串
  - 第二个可以是字符串或函数
    - 第二个如果是回调的话回调接收三个参数：匹配的字符串、匹配项在字符串中的开始位置、整个字符串

- `split()`

#### 12. localeCompare() 方法

比较两个字符串

- 如果按照字母表顺序，字符串应该排在字符串前头，则返回负值，通常是 -1
- 如果相等，则返回 0
- 如果在后头，则返回正值，通常是 1



#### 13. HTML 方法

...



## 5.4 单例内置对象

任何由 ECMAScript 实现提供、与宿主环境无关，并在 ECMAScript 程序开始执行时就存在的对象



### 5.4.1 Global

一种兜底对象。全局作用域中定义的变量和函数都会变成 `Global` 对象的属性

#### 1. URL 编码方法

- `encodeURI()`
- `encodeURIComponent()`
- `decodeURI()`
- `decodeURIComponent()`

#### 2. eval() 方法

这个方法就是一个完整的 ECMAScript 解释器，接收一个参数，要执行的 ECMAScript （JavaScript）字符串



#### 3.  Global 对象属性

...

#### 4. window 对象

浏览器为 `Global` 对象实现的代理



### 5.4.2 Math

保存数学公式，信息和计算

#### 1.Math 对象属性

...

#### 2. min() 和 max() 方法

#### 3. 舍入方法

- `Math.ceil()` 向上取整
- `Math.floor()` 向下取整
- `Math.round()` 四舍五入
- `Math.fround()` 返回数值最接近的单精度（32位）浮点值表示

#### 4. random() 方法

`Math.random()` 返回 0-1 的随机数，包含 0 不包含 1

随机数公式

```js
number = Math.floor(Math.random() * total_number_of_choices + first_possible_value);
```



#### 5. 其他方法

...