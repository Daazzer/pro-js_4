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

### 28.1.4 编码惯例

企业开发 Web 应用程序通常需要很多人协同工作。这时候就需要保证每个人的浏览器环境都有恒定不变的规则。为此，开发者应该遵守某些编码惯例。

#### 1.尊重对象所有权

在企业开发中，非常重要的编码惯例就是尊重对象所有权，这意味着不要修改不属于你的对象

- 不要给实例或原型添加属性。
- 不要给实例或原型添加方法。
- 不要重定义已有的方法。

可以按如下这样为对象添加新功能。

- 创建包含想要功能的新对象，通过它与别人的对象交互。
- 创建新自定义类型继承本来想要修改的类型，可以给自定义类型添加新功能。

#### 2.不声明全局变量

与尊重对象所有权密切相关的是尽可能不声明全局变量和函数。最多可以创建一个全局变量，作为其他对象和函数的命名空间。

```js
// 两个全局变量：不要！
var name = "Nicholas";
function sayName() {
  console.log(name);
} 
```

```js
// 一个全局变量：推荐
var MyApplication = {
  name: "Nicholas",
  sayName: function() {
    console.log(this.name);
  }
};
```

这样一个全局对象可以扩展为**命名空间**的概念。命名空间涉及创建一个对象，然后通过这个对象来暴露能力。

关于命名空间，最重要的确定一个所有人都同意的全局对象名称。这个名称要足够独特，不可能与其他人的冲突。大多数情况下，可以使用开发者所在的公司名，例如 `goog` 或 `Wrox`。下面的例子演示了使用 `Wrox` 作为命名空间来组织功能：

```js
// 创建全局对象
var Wrox = {};
// 为本书（Professional JavaScript）创建命名空间
Wrox.ProJS = {};
// 添加本书用到的其他对象
Wrox.ProJS.EventUtil = { /* ... */ };
Wrox.ProJS.CookieUtil = { /* ... */ };
```

#### 3.不要比较 null

```js
function sortArray(values) {
  if (values != null) { // 不要这样比较！
    values.sort(comparator);
  }
} 
```

单纯比较 `null` 通常是不够的。检查值的类型就要真的检查类型，而不是检查它不能是什么。

```js
function sortArray(values) {
  if (values instanceof Array) { // 推荐
    values.sort(comparator);
  }
} 
```

如果看到比较 `null` 的代码，可以使用下列某种技术替换它。

- 如果值应该是引用类型，则使用 `instanceof` 操作符检查其构造函数
- 如果值应该是原始类型，则使用 `typeof` 检查其类型
- 如果希望值是有特定方法名的对象，则使用 `typeof` 操作符确保对象上存在给定名字的方法

代码中比较 `null` 的地方越少，就越容易明确类型检查的目的，从而消除不必要的错误。

#### 4.使用常量

可以把可能会修改的数据提取出来，放在单独定义的常量中，以实现数据与逻辑分离。

关键在于把数据从使用它们的逻辑中分离出来。可以使用以下标准检查哪些数据需要提取。

- **重复出现的值** 任何使用超过一次的值都应该提取到常量中，这样可以消除一个值改了而另一个值没改造成的错误。这里也包括 CSS 的类名。
- **用户界面字符串** 任何会显示给用户的字符串都应该提取出来，以方便实现国际化
- **URL** Web 应用程序中资源的地址经常会发生变化，因此建议把所有 URL 集中放在一个地方管理
- **任何可能变化的值** 任何时候，只要在代码中使用字面值，就问问自己这个值将来是否可能会变。如果答案是“是”，那么就应该把它提取到常量中。

## 28.2 性能

JavaScript 一开始就是一门解释型语言，因此执行速度比编译型语言要慢一些。Chrome 是第一个引入优化引擎将 JavaScript 编译为原生代码的浏览器。

如果遵循一些基本模式，就能保证写出执行速度很快的代码。

### 28.2.1 作用域意识

访问全局变量始终比访问局部变量慢，因为必须遍历作用域链。

任何可以缩短遍历作用域链时间的举措都能提升代码性能。

#### 1.避免全局查找

全局变量和函数相比于局部值始终是最费时间的，因为需要经历作用域链查找。

```js
function updateUI() {
  let imgs = document.getElementsByTagName("img");
  /*
  如果页面的图片非常多，那么 for 循环中就需要引用 document 几十甚至上百次，
  每次都要遍历一次作用域链。
   */
  for (let i = 0, len = imgs.length; i < len; i++) {
    imgs[i].title = `${document.title} image ${i}`;
  }
  let msg = document.getElementById("msg");
  msg.innerHTML = "Update complete.";
}
```

通过在局部作用域中保存 `document` 对象的引用，能够明显提升这个函数的性能，因为只需要作用域链查找。

```js
function updateUI() {
  let doc = document;
  let imgs = doc.getElementsByTagName("img");
  for (let i = 0, len = imgs.length; i < len; i++) {
    imgs[i].title = `${doc.title} image ${i}`;
  }
  let msg = doc.getElementById("msg");
  msg.innerHTML = "Update complete.";
}
```

因此，一个经验规则就是，只要函数中有引用超过两次的全局对象，就应该把这个对象保存为一个局部变量。

#### 2.不使用 with 语句

在性能很重要的代码中，应避免使用 `with` 语句。与函数类似，`with` 语句会创建自己的作用域，因此也会加长其中代码的作用域链。在 `with` 语句中执行的代码一定比在它外部执行的代码慢，因为作用域链查找时多一步。

```js
function updateBody() {
  with(document.body) {
    console.log(tagName);
    innerHTML = "Hello world!";
  }
}
```

大多数情况下， 使用局部变量可以实现同样的效果，无须增加新作用域。

```js
function updateBody() {
  let body = document.body;
  console.log(body.tagName);
  body.innerHTML = "Hello world!";
}
```

### 28.2.2 选择正确的方法

与其他语言一样，影响性能的因素通常涉及算法或解决问题的方法。通常很多能在其他编程语言中提升性能的技术和方法同样也适用于 JavaScript。

#### 1.避免不必要的属性查找

在计算机科学中，算法复杂度使用大 `O` 表示法来表示。最简单同时也最快的算法可以表示为常量值或 `O(1)`。

下表列出了 JavaScript 中常见算法的类型。

| 表示法    | 名称   | 说明                                                         |
| --------- | ------ | ------------------------------------------------------------ |
| `O(1)`    | 常量   | 无论多少值，执行时间都不变。表示简单值和保存在变量中的值     |
| `O(logn)` | 对数   | 执行时间随着值的增加而增加，但算法完成不需要读取每个值。例子：二分查找 |
| `O(n)`    | 线性   | 执行时间与值的数量直接相关。例子：迭代数组的所有元素         |
| `O(n^2)`  | 二次方 | 执行时间随着值的增加而增加，而且每个值至少要读取 `n` 次。例子：插入排序 |

常量值或 O(1)，指字面量和保存在变量中的值，表示读取常量值所需的时间不会因值的多少而变化。读取常量值是效率极高的操作，因此非常快。

```js
let value = 5;
let sum = 10 + value;
console.log(sum);
/*
以上代码查询了 4 次常量值：数值 5、变量 value、数值 10 和变量 sum。
整体代码的复杂度可以认为是 O(1)
 */
```

 JavaScript 中访问数组元素也是 `O(1)` 操作，与简单的变量查找一样。

```js
let values = [5, 10];
let sum = values[0] + values[1];
console.log(sum);
```

访问对象属性的算法复杂度是 `O(n)`。访问对象的每个属性都比访问变量或数组花费的时间长，因为查找属性名要搜索原型链。

```js
let values = { first: 5, second: 10 };
let sum = values.first + values.second;
console.log(sum);
```

特别要注意避免通过多次查找获取一个值。

```js
let query = window.location.href.substring(window.location.href.indexOf("?"));
/*
这里有 6 次属性查找：3 次是为查找 window.location.href.substring()，3 次是为查找
window.location.href.indexOf()。通过数代码中出现的点号数量，就可以知道有几次属性查找。
以上代码效率特别低，这是因为使用了两次 window.location.href，即同样的查找执行了两遍。
 */
```

只要使用某个 `object` 属性超过一次，就应该将其保存在局部变量中。第一次仍然要用 `O(n)` 的复杂度去访问这个属性，但后续每次访问就都是 `O(1)`，这样就是质的提升了。

```js
let url = window.location.href;
let query = url.substring(url.indexOf("?"));
```

如果实现某个需求既可以使用数组的数值索引，又可以使用命名属性（比如 `NodeList` 对象），那就都应该使用数值索引。

#### 2.优化循环

优化循环的基本步骤如下。

1. **简化终止条件** 因为每次循环都会计算终止条件，所以它应该尽可能地快。这意味着要避免属性查找或其他 `O(n)` 操作。
2. **简化循环体** 循环体是最花时间的部分，因此要尽可能优化。要确保其中不包含可以轻松转移到循环外部的密集计算。
3. **使用后测试循环** 最常见的循环就是 `for` 和 `while` 循环，这两种循环都属于先测试循环。`do-while` 就是后测试循环，避免了对终止条件初始评估 ，因此应该会更快。

```js
// 这个循环会将变量 i 从 0 递增至数组 values 的长度。
for (let i = 0; i < values.length; i++) {
  process(values[i]);
}
```

假设处理这些值的顺序不重要，那么可以将 循环变量改为递减的形式

```js
// 这一次，变量 i 每次循环都会递减。在这个过程中，终止条件的计算复杂度也从查找 values.length 的 O(n) 变成了访问 0 的 O(1)
for (let i = values.length - 1; i >= 0; i--) {
  process(values[i]);
}
```

整个循环可修改为后测试循环

```js
let i = values.length-1;
if (i > -1) {
  do {
    process(values[i]);
  } while (--i >= 0);
}
```

### 3.展开循环

如果循环的次数是有限的，那么通常抛弃循环而直接多次调用函数会更快。

```js
// 抛弃循环
// 这个例子假设 values 数组始终只有 3 个值，然后分别针对每个元素调用一次 process()
process(values[0]);
process(values[1]);
process(values[2]);
```

如果不能提前预知循环的次数，那么或许可以使用一种叫作**达夫设备**（Duff’s Device）的技术。达夫设备的基本思路是以 8 的倍数作为迭代次数从而将循环展开为一系列语句。

```js
// 来源：Jeff Greenberg 在 JavaScript 中实现的达夫设备
// 假设 values.length > 0
let iterations = Math.ceil(values.length / 8);
let startAt = values.length % 8;  // 保存着仅按照除以 8 来循环不会处理的元素个数
let i = 0;
do {
  switch(startAt) {
    case 0: process(values[i++]);
    case 7: process(values[i++]);
    case 6: process(values[i++]);
    case 5: process(values[i++]);
    case 4: process(values[i++]);
    case 3: process(values[i++]);
    case 2: process(values[i++]);
    case 1: process(values[i++]);
  }
  startAt = 0;
} while (--iterations > 0); 
```

Andrew B. King 在 *Speed Up Your Site* 一书中提出了更快的达夫设备实现，他将 `do-while` 循环分成了两个单独的循环

```js
// 来源：Speed Up Your Site（New Riders，2003）
let iterations = Math.floor(values.length / 8);
let leftover = values.length % 8;  // 保存着只按照除以 8 来循环不会处理
let i = 0;
if (leftover > 0) {
  do {
    process(values[i++]);
  } while (--leftover > 0);
}
do {
  process(values[i++]);
  process(values[i++]);
  process(values[i++]);
  process(values[i++]);
  process(values[i++]);
  process(values[i++]);
  process(values[i++]);
  process(values[i++]);
} while (--iterations > 0);
```

#### 4.避免重复解释

```js
// 对代码求值：不要
eval("console.log('Hello world!')");
// 创建新函数：不要
let sayHi = new Function("console.log('Hello world!')");
// 设置超时函数：不要
setTimeout("console.log('Hello world!')", 500);
```

在上面所列的每种情况下，都需要重复解释包含 JavaScript 代码的字符串。在  JavaScript 运行时，必须启动新解析器实例来 解析这些字符串中的代码。实例化新解析器比较费时间

尽量不使用 `eval()`

```js
// 直接写出来
console.log('Hello world!');
// 创建新函数：直接写出来
let sayHi = function() {
  console.log('Hello world!');
};
// 设置超时函数：直接写出来
setTimeout(function() {
  console.log('Hello world!');
}, 500);
```

#### 5.其他性能优化注意事项

- **原生方法很快** 应该尽可能使用原生方法，而不是使用 JavaScript 写的方法。原生方法是使用 C 或 C++等编译型语言写的，因此比 JavaScript 写的方法要快得多。JavaScript 中经常被忽视的是 `Math` 对象上那些执行复杂数学运算的方法。这些方法总是比执行相同任务的 JavaScript 函数快得多，比如求正弦、余弦等。
- **switch 语句很快** 如果代码中有复杂的 `if-else` 语句，将其转换成 `switch` 语句可以变得更快。然后，通过重新组织分支，把最可能的放前面，不太可能的放后面，可以进一步提升性能。
- **位操作很快** 在执行数学运算操作时，位操作一定比任何布尔值或数值计算更快。选择性地将某些数学操作替换成位操作，可以极大提升复杂计算的效率。像求模、逻辑 AND 与和逻辑 OR 或都很适合替代成位操作。

### 28.2.3 语句最少化

JavaScript 代码中语句的数量影响操作执行的速度。寻找可以合并的语句，以减少整个脚本的执行时间。

#### 1.多个变量声明

声明多个变量时很容易出现多条语句。

```js
// 有四条语句：浪费
let count = 5;
let color = "blue";
let values = [1,2,3];
let now = new Date();
```

不同数据类型的变量必须在不同的语句中声明。但在 JavaScript 中，所有变量都可以使用一个 `let` 语句声明。

```js
// 一条语句更好
let count = 5,
    color = "blue",
    values = [1,2,3],
    now = new Date();
```

#### 2.插入迭代性值

任何时候只要使用迭代性值（即会递增或递减的值），都要尽可能使用组合语句。

```js
// bad
let name = values[i];
i++;
```

```js
// good
let name = values[i++];
```

#### 3.使用数组和对象字面量

有两种使用数组和对象的方式：构造函数和字面量。

使用构造函数始终会产生比单纯插入元素或定义属性更多的语句，而字面量只需一条语句即可完成全部操作。

```js
// 创建和初始化数组用了四条语句：浪费
let values = new Array();
values[0] = 123;
values[1] = 456;
values[2] = 789;

// 创建和初始化对象用了四条语句：浪费
let person = new Object();
person.name = "Nicholas";
person.age = 29;
person.sayName = function() {
  console.log(this.name);
};
```

转换成字面量形式

```js
// 一条语句创建并初始化数组
let values = [123, 456, 789];
// 一条语句创建并初始化对象
let person = {
  name: "Nicholas",
  age: 29,
  sayName() {
    console.log(this.name);
  }
}; 
```

> **注意** 减少代码中的语句量是很不错的目标，但不是绝对的法则。一味追求语句最少化，可能导致一条语句容纳过多逻辑，最终难以理解。

### 28.2.4 优化 DOM 交互

DOM 操作和交互需要占用大量时间，因为经常需要重新渲染整个或部分页面。

#### 1.实时更新最小化

访问 DOM 时，只要访问的部分是显示页面的一部分，就是在执行**实时更新**操作。

实时更新的次数越多，执行代码所需的时间也越长。反之，实时更新的次数越少，代码执行就越快。

```js
let list = document.getElementById("myList"),
    item;
for (let i = 0; i < 10; i++) {
  item = document.createElement("li");
  list.appendChild(item);
  item.appendChild(document.createTextNode(`Item ${i}`));
}
/*
以上代码向列表中添加了 10 项。每添加 1 项，就会有两次实时更新：一次添加<li>元素，一次为
它添加文本节点。因为要添加 10 项，所以整个操作总共要执行 20 次实时更新。
 */
```

使用文档片段构建 DOM 结构，然后一次性将它添加到 list 元素。这 个办法可以减少实时更新，也可以避免页面闪烁。

```js
let list = document.getElementById("myList"),
    fragment = document.createDocumentFragment(),
    item;
for (let i = 0; i < 10; i++) {
  item = document.createElement("li");
  fragment.appendChild(item);
  item.appendChild(document.createTextNode("Item " + i));
}
list.appendChild(fragment); 
```

这样修改之后，完成同样的操作只会触发一次实时更新。这是因为更新是在添加完所有列表项之后一次性完成的。文档片段在这里作为新创建项目的临时占位符。最后，使用 `appendChild()` 将所有项目都添加到列表中。

只要是必须更新 DOM，就尽量考虑使用文档片段来预先构建 DOM 结构，然后再把构建好的 DOM 结构实时更新到文档中。

#### 2.使用 innerHTML

使用 DOM方法如 `createElement()` 和 `appendChild()`，以及使用 `innerHTML`。

对于少量 DOM 更新，这两种技术区别不大，但对于大量 DOM 更新，使用 `innerHTML` 要比使用标准 DOM 方法创建同样的结构快很多

在给 `innerHTML` 赋值时，后台会创建 HTML 解析器，然后会使用原生 DOM 调用而不是 JavaScript 的 DOM 方法来创建 DOM 结构。原生 DOM 方法速度更快，因为该方法是执行编译代码而非解释代码。

```js
let list = document.getElementById("myList"),
    html = "";
for (let i = 0; i < 10; i++) {
  html += '<li>Item ${i}</li>';
}
list.innerHTML = html;
/*
以上代码构造了一个HTML字符串，然后将它赋值给list.innerHTML，结果也会创建适当的 DOM
结构。虽然拼接字符串也会有一些性能损耗，但这个技术仍然比执行多次 DOM 操作速度更快。
 */
```

与其他 DOM 操作一样，使用 `innerHTML` 的关键在于最小化调用次数。例如，下面的代码使用 `innerHTML` 的次数就太多了：

```js
let list = document.getElementById("myList");
for (let i = 0; i < 10; i++) {
  list.innerHTML += '<li>Item ${i}</li>'; // 不要
} 
```

> **注意** 使用 `innerHTML` 可以提升性能，但也会暴露巨大的 XSS 攻击面。无论何时使用它 填充不受控的数据，都有可能被攻击者注入可执行代码。此时必须要当心。

#### 3.使用事件委托

一个页面中事件处理程序的数量与页面响应用户交互的速度有直接关系。为了减少对页面响应的影响，应该尽可能使用事件委托。

事件委托利用了事件的冒泡。任何冒泡的事件都可以不在事件目标上，而在目标的任何祖先元素上处理。基于这个认知，可以把事件处理程序添加到负责处理多个目标的高层元素上。只要可能，就应该在文档级添加事件处理程序，因为在文档级可以处理整个页面的事件。

#### 4.注意 HTMLCollection

任何时候，只要访问 `HTMLCollection`，无论是它的属性还是方法，就会触发查询文档，而这个查询相当耗时。减少访问 `HTMLCollection` 的次数可以极大地提升脚本的性能。

可能优化 `HTMLCollection` 访问最关键地方就是循环了。

```js
let images = document.getElementsByTagName("img");
for (let i = 0, len = images.length; i < len; i++) {
  // 处理
}
```

在循环中使用 `HTMLCollection` 时，应该首先取得对要使用的元素的引用，如下面所示。这样才能避免在循环体内多次调用 `HTMLCollection`

```js
let images = document.getElementsByTagName("img"),
    image;
for (let i = 0, len=images.length; i < len; i++) {
  image = images[i];
  // 处理
}
```

编写 JavaScript 代码时，关键是要记住，只要返回 `HTMLCollection` 对象，就应该尽量不访问它。以下情形会返回 `HTMLCollection`

- 调用 `getElementsByTagName()`
- 读取元素的 `childNodes` 属性
- 读取元素的 `attributes` 属性
- 访问特殊集合，如 `document.form`、`document.images` 等

## 28.3 部署

任何 JavaScript 解决方案最重要的部分可能就是把网站或 Web 应用程序部署到线上环境了。不过，在发布之前，还需要解决一些问题。

### 28.3.1 构建流程

开发软件的典型模式是编码、编译和测试。换句话说，首先要写代码，然后编译，之后运行并确保它能够正常工作。

但因为 JavaScript 不是编译型语言，所以这个流程经常会变成编码、测试。你写的代码跟在浏览器中测试的代码一样。这种方式的问题在于代码并不是最优的。你写的代码不应该不做任何处理就直接交给浏览器，原因如下。

- **知识产权问题** 如果把满是注释的代码放到网上，其他人就很容易了解你在做什么，重用它，并可能发现安全漏洞。
- **文件大小** 你写的代码可读性很好，容易维护，但性能不好。浏览器不会因为代码中多余的空格、缩进、冗余的函数和变量名而受益。
- **代码组织** 为保证可维护性而组织的代码不一定适合直接交付给浏览器。

#### 1.文件结构

构建流程首先定义在源代码控制中存储文件的逻辑结构。最好不要在一个文件中包含所有 JavaScript 代码。

要遵循面向对象编程语言的典型模式，把对象和自定义类型保存到自己独立的文件中。这样可以让每个文件只包含最小量的代码，让后期修改更方便，也不易引入错误。

此外，在使用并发源代码控制系统（如 Git、CVS 或 Subversion）的环境中，这样可以减少合并时发生冲突的风险。

注意，把代码分散到多个文件是从可维护性而不是部署角度出发的。对于部署，应该把所有源文件合并为一个或多个汇总文件。Web 应用程序使用的 JavaScript 文件越少越好，因为 HTTP 请求对某些 Web 应用程序而言是主要的性能瓶颈。

而且，使用 `<script>` 标签包含 JavaScript 是阻塞性操作，这导致代码下载和执行期间停止所有其他下载任务。因此，要尽量以符合逻辑的方式把 JavaScript 代码组织到部署文件中。

#### 2.任务运行器

如果要把大量文件组合成一个应用程序，很可能需要任务运行器自动完成一些任务。任务运行器可以完成代码检查、打包、转译、启动本地服务器、部署，以及其他可以脚本化的任务。

很多时候，任务运行器要通过命令行界面来执行操作。因此你的任务运行器可能仅仅是一个辅助组织和排序复杂命令行调用的工具。

如果你使用 Node.js 和 npm 打印 JavaScript 资源，Grunt 和 Gulp 是两个主流的任务运行器。它们非常稳健，其任务和指令都是通过配置文件，以纯 JavaScript 形式指定的。

#### 3.摇树优化

摇树优化（tree shaking）是非常常见且极为有效的减少冗余代码的策略。

使用静态模块声明风格意味着构建工具可以确定代码各部分之间的依赖关系。更重要的是，摇树优化还能确定代码中的哪些内容是完全不需要的。

实现了摇树优化策略的构建工具能够分析出选择性导入的代码，其余模块文件中的代码可以在最终打包得到的文件中完全省略。

```js
import { foo } from './utils.js';

console.log(foo);
export const foo = 'foo';
export const bar = 'bar'; // unused
```

这里导出的 `bar` 就没有被用上，而构建工具可以很容易发现这种情况。在执行摇树优化时，构建工具会将 `bar` 导出完全排除在打包文件之外。静态分析也意味着构建工具可以确定未使用的依赖，同样也会排除掉。通过摇树优化，最终打包得到的文件可以瘦身很多。

#### 4.模块打包器

通常，由大量模块组成的 JavaScript 代码在构建时需要打包到一起，然后只交付一个或少数几个 JavaScript 文件。

模块打包器的工作是识别应用程序中涉及的 JavaScript 依赖关系，将它们组合成一个大文件，完成对模块的串行组织和拼接，然后生成最终提供给浏览器的输出文件。

能够实现模块打包的工具非常多。Webpack、Rollupt 和 Browserify 只是其中的几个，可以将基于模块的代码转换为普遍兼容的网页脚本。

### 28.3.2 验证

有一些工具可以帮我们发现 JavaScript 代码中潜在的问题，最流行的是 Douglas Crockford 的 JSLint 和 ESLint。

这些代码检查工具可以发现 JavaScript 代码中的语法错误和常见的编码错误。

- 使用 `eval()`
- 使用未声明的变量
- 遗漏了分号
- 不适当地换行
- 不正确地使用逗号
- 遗漏了包含语句的括号
- 遗漏了 `switch` 分支中的 `break`
- 重复声明变量
- 使用了 `with`
- 错误地使用等号（应该是两个或三个等号）
- 执行不到的代码

### 28.3.3 压缩

JavaScript 文件压缩，实际上主要是两件事：

- **代码大小**（code size） 指的是浏览器需要解析的字节数
- **传输负载**（wire weight） 服务器实际发送给浏览器的字节数

#### 1.代码压缩

注释、额外的空格、长变量或函数名都能提升开发者的可读性，但对浏览器而言这些都是多余的字节。压缩工具可以通过如下操作减少代码大小：

- 删除空格（包括换行）
- 删除注释
- 缩短变量名、函数名和其他标识符

> **注意** 在 Web 开发的上下文中，“压缩”（compression）经常意味着“最小化”（minification）。虽然这两个术语可以互换使用，但实际上它们的含义并不相同。
>
> 最小化是指把文件大小减少到比原始大小还要小，但结果文件包含的仍是语法正确的代码。通常，最小化只适合 JavaScript 等解释型语言，编译为二进制的语言自然会被编译器最小化。
>
> 压缩与最小化的区别在于前者得到的文件不再包含语法正确的代码。压缩后的文件必须通过解压缩才能恢复为代码可读的格式。压缩通常能得到比最小化更小的文件，压缩算法不用考虑保留语法结构，因此自由度更高。

#### 2.JavaScript 编译

JavaScript 代码编译通常指的是把源代码转换为一种逻辑相同但字节更少的形式。编译后代码的结构可能不同，但仍然具备与原始代码相同的行为。

编译可能会执行如下操作：

- 删除未使用的代码
- 将某些代码转换为更简洁的语法
- 全局函数调用、常量和变量行内化

#### 3.JavaScript 转译

ES6、ES7 和 ES8 都为 ECMAScript 规范扩充增加了更好用的特性，但不同浏览器支持这些规范的步调并不一致。

通过 JavaScript 转译，可以在开发时使用最新的语法特性而不用担心浏览器的兼容性问题。转译可以将现代的代码转换成更早的 ECMAScript 版本，通常是 ES3 或 ES5，具体取决于你的需求。这样可以确保代码能够跨浏览器兼容。

> **注意** “转译”（transpilation）和“编译”（compilation）经常被人当成同一个术语混用。编译是将源代码从一种语言转换为另一种语言。转译在本质上跟编译是一样的，只是目标语言与源语言是一种语言的不同级别的抽象。

#### 4.HTTP 压缩

传输负载是从服务器发送给浏览器的实际字节数。这个字节数不一定与代码大小相同，因为服务器和浏览器都具有压缩能力。所有当前主流的浏览器（IE/Edge、Firefox、Safari、Chrome 和 Opera）都支持客户端解压缩收到的资源。

服务器则可以根据浏览器通过请求头部（Accept-Encoding）标明自己支持的格式，选择一种用来压缩 JavaScript 文件。在传输压缩后的文件时，服务器响应的头部会有字段（Content-Encoding）标明使用了哪种压缩格式。浏览器看到这个头部字段后，就会根据这个压缩格式进行解压缩。结果是通过网络传输的字节数明显小于原始代码大小。

> **注意** 大多数 Web 服务器（包括开源的和商业的）具备 HTTP 压缩能力。关于如何正确地配置压缩，请参考相关服务器的文档。

