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

