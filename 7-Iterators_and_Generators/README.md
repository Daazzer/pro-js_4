# 第 7 章 迭代器与生成器

在软件开发领域，“迭代”的意思是按照顺序反复多次执行一段程序，通常会有明确的终止条件。

ECMAScript 6 规范新增了两个高级特性：迭代器和生成器。

## 7.1 理解迭代

循环是迭代机制的基础，这是因为它可以指定迭代的次数，以及每次迭代要执行什么操作。

迭代会在一个有序集合上进行。（“有序”可以理解为集合中所有项都可以按照既定的顺序被遍历到，特别是开始和结束项有明确的定义。）

由于如下原因，通过这种循环来执行例程并不理想

- **迭代之前需要事先知道如何使用数据结构** 数组中的每一项都只能先通过引用取得数组对象，然后再通过 `[]` 操作符取得特定索引位置上的项。这种情况并不适用于所有数据结构。
- **遍历顺序并不是数据结构固有的** 通过递增索引来访问数据是特定于数组类型的方式，并不适用于其他具有隐式顺序的数据结构。

ES5 新增了 `Array.prototype.forEach()` 方法，不过这种方法没有办法标识迭代何时终止

```js
const collection = ['foo', 'bar', 'baz'];
collection.forEach(item => console.log(item));
// foo
// bar
// baz
```

**迭代器模式**使得开发者无须事先知道如何迭代就能实现迭代操作

## 7.2 迭代器模式

可迭代对象实现了正式的 `Iterable` 接口，而且可以通过 `Iterator` 消费

可以把可迭代对象理解成数组或集合这样的集合类型的对象。它们包含的元素都是有限的，而且都具有无歧义的遍历顺序

```js
// 数组的元素是有限的
// 递增索引可以按序访问每个元素
let arr = [3, 1, 4];
// 集合的元素是有限的
// 可以按插入顺序访问每个元素
let set = new Set().add(3).add(1).add(4);
```

任何实现 `Iterable` 接口的数据结构都可以被实现 `Iterator` 接口的结构“消费”（consume）。

**迭代器** (Iterator) 是按需创建的一次性对象。每个迭代器都会关联一个**可迭代对象**，而迭代器会暴露迭代其关联可迭代对象的 API

### 7.2.1 可迭代协议

实现 `Iterable` 接口（可迭代协议）要求同时具备两种能力：

- 支持迭代的自我识别能力
- 创建实现 `Iterator` 接口的对象能力

在 ECMAScript 中，这意味着必须暴露一个属性作为“默认迭代器”，而且这个属性必须使用特殊的 `Symbol.iterator` 作为键。这个默认迭代器属性必须引用一个迭代器工厂函数，调用这个工厂函数必须返回一个新迭代器。

实现了 `Iterable` 接口的内置类型：

- 字符串
- 数组
- 映射
- 集合
- `arguments` 对象
- `NodeList` 等 DOM 集合类型

检查是否存在默认迭代器属性可以暴露这个工厂函数：

```js
let num = 1;
let obj = {};

console.log(num[Symbol.iterator]);  // undefined
console.log(obj[Symbol.iterator]);  // undefined

let str = 'abc';
let arr = ['a', 'b', 'c'];
let map = new Map().set('a', 1).set('b', 2).set('c', 3);
let set = new Set().add('a').add('b').add('c');
let els = document.querySelectorAll('div');

// 这些类型都实现了迭代器工厂函数
console.log(str[Symbol.iterator]);  // f values() { [native code] }
console.log(arr[Symbol.iterator]);  // f values() { [native code] }
console.log(map[Symbol.iterator]);  // f values() { [native code] }
console.log(set[Symbol.iterator]);  // f values() { [native code] }
console.log(els[Symbol.iterator]);  // f values() { [native code] }
```

实际写代码过程中，不需要显式调用这个工厂函数来生成迭代器。实现可迭代协议的所有类型都会自动兼容接收可迭代对象的任何语言特性。接收可迭代对象的原生语言特性包括：

- `for-of` 循环
- 数组解构
- 扩展操作符
- `Array.from()`
- 创建集合
- 创建映射
- `Promise.all()` 接收由期约组成的可迭代对象
- `Promise.race()` 接收由期约组成的可迭代对象
- `yield*` 操作符，在生成器中使用

如果对象原型链上的父类实现了 `Iterable` 接口，那这个对象也就实现了这个接口

```js
class FooArray extends Array {}
const fooArr = new FooArray('foo', 'bar', 'baz');

for (const el of fooArr) {
  console.log(el);
}
// foo
// bar
// baz
```

### 7.2.2 迭代器协议

迭代器是一种一次性使用的对象，用于迭代与其关联的可迭代对象。

迭代器 API

- `next()` 方法在可迭代对象中遍历数据，每次成功调用 `next()`，都会返回一个 `IteratorResult` 对象，包含两个属性 `done` 和 `value`
  - `done` 布尔值，表示是否还可以调用 `next()` 取得下一个值
  - `value` 包含可迭代对象的下一个值 (`done` 为 `false`)，或者 `undefined` (`done` 为 `true`)

不同迭代器的实例相互之间没有联系，只会独立地遍历可迭代对象

```js
let arr = ['foo', 'bar'];
let iter1 = arr[Symbol.iterator]();
let iter2 = arr[Symbol.iterator]();

console.log(iter1.next());  // { done: false, value: 'foo' }
console.log(iter2.next());  // { done: false, value: 'foo' }
console.log(iter2.next());  // { done: false, value: 'bar' }
console.log(iter1.next());  // { done: false, value: 'bar' }
```

如果可迭代对象在迭代期间被修改了，那么迭代器也会反映相应的变化

```js
let arr = ['foo', 'baz'];
let iter = arr[Symbol.iterator]();

console.log(iter.next());  // { done: false, value: 'foo' }

// 在数组中间插入值
arr.splice(1, 0, 'bar');

console.log(iter.next());  // { done: false, value: 'bar' }
console.log(iter.next());  // { done: false, value: 'baz' }
console.log(iter.next());  // { done: true, value: undefined }
```

> **注意** 迭代器维护着一个指向可迭代对象的引用，因此迭代器会阻止垃圾回收程序回收可迭代对象

下面的例子比较了一个显式的迭代器实现和一个原生的迭代器实现。

```js
// 这个类实现了可迭代接口（Iterable）
// 调用默认的迭代器工厂函数会返回
// 一个实现迭代器接口（Iterator）的迭代器对象
class Foo {
  // 实现可迭代接口 (Iterable)
  [Symbol.iterator]() {
    return {
      next() {
        return { done: false, value: 'foo' };
      }
    };
  }
}

const f = new Foo();
// 打印出实现了迭代器接口的对象
console.log(f[Symbol.iterator]()); // { next: f() {} }

// Array 类型实现了可迭代接口（Iterable）
// 调用 Array 类型的默认迭代器工厂函数
// 会创建一个 ArrayIterator 的实例
const a = new Array();
// 打印出 ArrayIterator 的实例
console.log(a[Symbol.iterator]()); // Array Iterator {}
```

### 7.2.3 自定义迭代器

任何实现 `Iterator` 接口的对象都可以作为迭代器使用

为了让一个可迭代对象能够创建多个迭代器，必须每创建一个迭代器就对应一个新计数器。

```js
class Counter {
  // Counter 实例应该迭代 limit 次
  constructor(limit) {
    this.count = 1;
    this.limit = limit;
  }

  [Symbol.iterator]() {
    let count = 1,
        limit = this.limit;
    // 为了能够创建多个独立的迭代器，可以把计数器变量放到闭包里
    return {
      next() {
        if (count <= limit) {
          return { done: false, value: count++ };
        } else {
          return { done: true, value: undefined };
        }
      }
    };
  }
}

const counter = new Counter(3);

for (const c of counter) {
  console.log(c);
}
// 1
// 2
// 3

for (const c of counter) {
  console.log(c);
}
// 1
// 2
// 3
```

每个以这种方式创建的迭代器也实现了 `Iterable` 接口。`Symbol.iterator` 属性引用的工厂函数会返回相同的迭代器：

```js
let arr = ['foo', 'bar', 'baz'];
let iter1 = arr[Symbol.iterator]();

console.log(iter1[Symbol.iterator]); // f values() { [native code] }

let iter2 = iter1[Symbol.iterator]();

console.log(iter1 === iter2); // true
```

因为每个迭代器也实现了 `Iterable` 接口，所以它们可以用在任何期待可迭代对象的地方，比如 `for-of` 循环：

```js
let arr = [3, 1, 4];
let iter = arr[Symbol.iterator]();

for (let item of arr ) { console.log(item); }
// 3
// 1
// 4

for (let item of iter ) { console.log(item); }
// 3
// 1
// 4
```

### 7.2.4 提前终止迭代器

可选的 `return()` 方法用于指定在迭代器提前关闭时执行的逻辑，可能情况包括

- `for-of` 循环通过 `break`、`continue`、`return` 或  `throw` 提前退出
- 解构操作并未消费所有值

`return()` 方法必须返回一个有效的 `IteratorResult` 对象，简单情况下，可以只返回 `{ done: true }`

```js
class Counter {
  constructor(limit) {
    this.limit = limit;
  }

  [Symbol.iterator]() {
    let count = 1,
        limit = this.limit;
    return {
      next() {
        if (count <= limit) {
          return { done: false, value: count++ };
        } else {
          return { done: true };
        }
      },
      // 可选的 return() 方法用于指定在迭代器提前关闭时执行的逻辑。
      return() {
        console.log('提前退出');
        return { done: true };
      }
    };
  }
}

const counter1 = new Counter(5);

for (const i of counter1) {
  if (i > 2) {
    break;
  }
  console.log(i);
  // 1
  // 2
  // 提前退出
}

const counter2 = new Counter(5);

try {
  for (const i of counter2) {
    if (i > 2) {
      throw 'err';
    }
    console.log(i);
  }
} catch (e) {}
// 1
// 2
// 提前退出

const counter3 = new Counter(5);

const [a, b] = counter3;
// 提前退出
```

如果迭代器没有关闭，则还可以继续从上次离开的地方继续迭代

`return()` 方法是可选的。并非所有的迭代器都可关闭的，要知道某个迭代器是否可以关闭，可以测试这个迭代器实例的 `return` 属性是不是函数对象，不过，仅仅给一个不可关闭的迭代器增加这个方法**并不能**让它变成可关闭的。这是因为调用 `return()` 不会强制迭代器进入关闭状态。

```js
const arr = [1, 2, 3, 4, 5];
const iter = arr[Symbol.iterator]();

iter.return = function() {
  console.log('提前退出');
  return { done: true };
}

for (const i of iter) {
  console.log(i);
  if (i > 2) {
    break;
  }
}
// 1
// 2
// 3
// 提前退出

for (const i of iter) {
  console.log(i);
}
// 4
// 5
```

## 7.3 生成器

拥有在一个函数块内暂停和恢复代码执行的能力

### 7.3.1 生成器的基础

生成器的形式是一个函数，函数名称前面加一个星号 `*` 表示它是一个生成器

```js
// 声明一个生成器函数
function* generatorFn() {}

//  生成器函数表达式
let generatorFn() = function* () {}

// 对象字面量
let foo = {
  * generatorFn() {}
}

// 作为类实例方法的生成器函数
class Foo {
  * generatorFn() {}
}

// 作为静态方法的生成器函数
class Bar {
  static * generatorFn() {}
}
```

> **注意** 箭头函数不能用来定义生成器函数

调用生成器函数会产生一个**生成器对象**。生成器对象一开始处于暂停执行（suspended）的状态。与迭代器相似，生成器对象也实现了 `Iterator` 接口，因此具有 `next()` 方法。调用这个方法会让生成器开始或恢复执行。

函数体为空的生成器函数中间不会停留，调用一次 `next()` 就会让生成器到达 `done: true`

```js
function* generatorFn() {}

const generatorObject = generatorFn();

console.log(generatorObject); // generatorFn {<suspended>}
console.log(generatorObject.next());  // { done: true, value: undefined }
```

`value` 属性是生成器函数的返回值，默认值为 `undefined`，可以通过生成器函数的返回值指定


```js
class Foo {
  *generatorFn() {}
}

function *generatorFn() {
  console.log('foobar');
  return 'foo';
}

class Bar {
  static * generatorFn() {}
}

const g = generatorFn();  // 调用生成器函数不会执行内部代码
console.log(g);
console.log(g.next);
console.log(g.next());   //  { done: true, value: 'foo' }，只有 next() 之后才会执行内部代码
console.log(g === g[Symbol.iterator]());  // true，生成器对象实现了 Iterable 接口，它们默认的迭代器是自引用的
console.log(generatorFn()[Symbol.iterator]());  // generatorFn {<suspended>}
```

### 7.3.2 通过 yield 中断执行

`yield` 关键字可以让生成器停止和开始执行

`yield` 关键字有点像函数的中间返回语句，它生成的值会出现在 `next()` 方法返回的对象里。通过 `yield` 关键字退出的生成器函数会处在 `done: false` 状态；通过 `return` 关键字退出的生成器函数会处于 `done: true` 状态

```js
function* generator() {
  yield 'foo';
  yield 'bar';
  return 'baz';
}

const generatorObject = generator();

console.log(generatorObject.next());  // { done: false, value: 'foo' }
console.log(generatorObject.next());  // { done: false, value: 'bar' }
console.log(generatorObject.next());  // { done: true, value: 'baz' }

// 每个生成器对象上调用 next() 不会影响其他生成器
const generatorObject1 = generator();
const generatorObject2 = generator();

console.log(generatorObject1.next());  // { done: false, value: 'foo' }
console.log(generatorObject2.next());  // { done: false, value: 'foo' }
console.log(generatorObject2.next());  // { done: false, value: 'bar' }
console.log(generatorObject1.next());  // { done: false, value: 'bar' }
```

`yield` 关键字只能在生成器函数内部使用，用在其它地方会抛出错误

```js
// 有效
function* validGeneratorFn() {
  yield;
}
// 无效
function* invalidGeneratorFnA() {
  function a() {
    yield;
  }
}
// 无效
function* invalidGeneratorFnB() {
  const b = () => {
    yield;
  };
}
// 无效
function* invalidGeneratorFnC() {
  (() => {
    yield;
  })();
}
```

#### 1.生成器对象作为可迭代对象

在生成器对象上显式调用 `next()` 方法的用处并不大。其实，如果把生成器对象当成可迭代对象，那么使用起来会更方便

```js
// 生成器对象作为可迭代对象
function* generatorFn() {
  yield 1;
  yield 2;
  yield 3;
}

for (const x of generatorFn()) {
  console.log(x);
}
// 1
// 2
// 3

// 迭代器执行指定次数
function* nTimes(n) {
  while (n--) {
    yield;
  }
}

for (const _ of nTimes(3)) {
  console.log('foo');
}
// foo
// foo
// foo
```

#### 2.使用 yield 实现输入和输出

`yield` 关键字可以作为函数的中间参数使用。上一次生成器函数暂停的 `yield` 关键字会接收到传给 `next()` 方法的第一个值

```js
// yield 关键字可以作为函数的中间参数使用
function* generatorFn(initial) {
  console.log(initial);
  console.log(yield);
	console.log(yield);
}

const generatorObject = generatorFn('foo');

generatorObject.next('bar');  // 'foo'  *第一个 next 参数不会使用，是为了开始执行生成器函数
generatorObject.next('baz');  // 'baz'
generatorObject.next('qux');  // 'qux'
```

`yield` 关键字同时用于输入输出

```js
function* generatorFn1() {
  return yield 'foo';
}

const generatorObject1 = generatorFn1();

console.log(generatorObject1.next());  // {value: "foo", done: false}
console.log(generatorObject1.next('bar'));  // {value: "bar", done: true}
console.log(generatorObject1.next('bar'));  // {value: undefined, done: true}
```

这样使用生成器也可以实现范围和填充数组

```js
function* zeroes(n) {
  while(n--) {
    yield 0;
  }
}
console.log(Array.from(zeroes(8))); // [0, 0, 0, 0, 0, 0, 0, 0]
```

#### 3.产生可迭代对象

使用星号增强 `yield` 的行为，让它能够迭代一个可迭代对象，从而一次产出一个值

```js
function* generatorFn() {
  yield* [1, 2, 3];
}

const generatorObject = generatorFn();

for (const x of generatorObject) {
  console.log(x);
  // 1
  // 2
  // 3
}

// 相当于
// function* generatorFn() {
//   for (const x of [1, 2, 3]) {
//       yield 1x;
//   }
// }
```

```js
function* generatorFn1() {
  // 与生成器函数的星号类似，yield 星号两侧的空格不影响其行为
  yield* [1, 2];
  yield * [3, 4];
  yield *[5, 6];
}

for (const x of generatorFn1()) {
  console.log(x);
  // 1
  // 2
  // 3
  // 4
  // 5
  // 6
}

function* generatorFn2() {
  yield* 'abcde';
}

for (const x of generatorFn2()) {
  console.log(x);
  // a
  // b
  // c
  // d
  // e
}
```

`yield*` 的值是关联迭代器返回 `done: true` 时的 `value` 属性。对于普通迭代器来说，这个值是 `undefined`

```js
function* generatorFn3() {
  console.log('iter value:', yield* [1, 2, 3]);
}

for (const x of generatorFn3()) {
  console.log('value:', x);
  // value: 1
  // value: 2
  // value: 3
  // iter value: undefined
}
```

对于生成器函数产生的迭代值来说，这个值就是生成器函数返回的值

```js
function* innerGeneratorFn() {
  yield 'foo';
  return 'bar';
}

function* outerGeneratorFn(genObj) {
  console.log('iter value:', yield* genObj());
}

for (const x of outerGeneratorFn(innerGeneratorFn)) {
  console.log('value:', x);
}
// value: foo
// iter value: bar
```

#### 4.使用 yield* 实现递归算法

```js
// 实现递归算法
function* nTimes(n) {
  if (n > 0) {
    yield* nTimes(n - 1);
    yield n - 1;
  }
}

for (const x of nTimes(3)) {
  console.log(x);
  // 0
  // 1
  // 2
}
```

### 7.3.3 生成器作为默认迭代器

```js
class Foo {
  constructor() {
    this.values = [1, 2, 3];
  }
  * [Symbol.iterator]() {
    yield* this.values;
  }
}

const f = new Foo();
/*
这里，for-of 循环调用了默认迭代器（它恰好又是一个生成器函数）并产生了一个生成器对象。
这个生成器对象是可迭代的，所以完全可以在迭代中使用。
 */
for (const x of f) {
  console.log(x);
}
// 1
// 2
// 3
```

### 7.3.4 提前终止生成器

与迭代器类似，生成器也支持“可关闭”概念。

一个实现 `Iterator` 接口的对象一定有

- `next()` 方法
- `return()` 方法，可选的，用于提前终止迭代器
- `throw()` 方法

```js
function* generatorFn() {}

const g = generatorFn();

console.log(g); // generatorFn {<suspended>}
console.log(g.next); // f next() { [native code] }
console.log(g.return); // f return() { [native code] }
console.log(g.throw); // f throw() { [native code] }
```

`return()` 和 `throw()` 方法都可以用于强制生成器进入关闭状态。

#### 1.return()

`return()` 方法强制生成器进入关闭状态

```js
function* generatorFn() {
  for (const x of [1, 2, 3]) {
    yield x;
  }
}

const g = generatorFn();

console.log(g);  // generatorFn {<suspended>}
console.log(g.return(4));  // { value: 4, done: true }，提供给 return()方法的值，就是终止迭代器对象的值
console.log(g);  // generatorFn {<closed>}
// 后续调用 next 都是 done: true 状态，而提供的任何返回值都不会被存储或传播
console.log(g.next());
console.log(g.next());
```

`for-of` 循环等内置语言结构会忽略状态为 `done: true` 的 `IteratorObject` 内部返回的值

```js
function* generatorFn() {
  for (const x of [1, 2, 3]) {
    yield x;
  }
}

const g = generatorFn();

for (const x of g) {
  if (x > 1) {
    g.return(4);
  }
  console.log(x);
}
// 1
// 2
```

#### 2.throw()

`throw()` 方法会在暂停的时候将一个提供的错误注入到生成器对象中。如果错误未被处理，生成器就会关闭

```js
function* generatorErrorFn() {
  for (const x of [1, 2, 3]) {
    yield x;
  }
}

const gError = generatorErrorFn();

console.log(gError);  // generatorFn {<suspended>}

try {
  gError.throw('foo');
} catch (e) {
  console.log(e);  // foo
}

console.log(gError);  // generatorFn {<closed>}
```

如果在生成器函数**内部**处理了错误，则可以恢复执行，但是错误处理会跳过对应的 `yield`

```js
function* generatorHandleErrorFn() {
  for (const x of [1, 2, 3]) {
    try {
      yield x;
    } catch (e) {}
  }
}

const gHandleError = generatorHandleErrorFn();

console.log(gHandleError.next());  // {value: 1, done: false}
gHandleError.throw('foo');
console.log(gHandleError.next());  // {value: 3, done: false}
```

> **注意** 如果生成器对象还没有开始执行，那么调用 `throw()` 抛出的错误不会在函数内部被捕获，相当于在函数外部捕获

