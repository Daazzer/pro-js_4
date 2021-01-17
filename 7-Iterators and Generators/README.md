# 第 7 章 迭代器与生成器

## 7.1 理解迭代

JavaScript 的计数循环是迭代机制的基础

ES5 新增了 `Array.prototype.forEach()` 方法，不过这种方法没有办法标识迭代何时终止

**迭代器模式**使得开发者无须事先知道如何迭代就能实现迭代操作

## 7.2 迭代器模式

可以把可迭代对象理解成数组或集合这样的集合类型的对象。

可迭代对象实现了正式的 `Iterable` 接口，而且可以通过 `Iterator` 消费

可迭代对象不一定是集合对象，也可以是仅仅具有类似数组行为的其他数据结构

**迭代器** (Iterator) 是按需创建的一次性对象。每个迭代器都会关联一个**可迭代对象**，而迭代器会暴露迭代其关联可迭代对象的 API

### 7.2.1 迭代器模式

实现 `Iterable` 接口（可迭代协议）要求同时具备两种能力：

- 支持迭代的自我识别能力
- 创建实现 `Iterator` 接口的对象能力

实现了 `Iterable` 接口的内置类型：

- 字符串
- 数组
- 映射
- 集合
- `arguments` 对象
- `NodeList` 等 DOM 集合类型

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



实现可迭代类型都会支持：

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



显式的迭代器实现

```js
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

const foo = new Foo();
console.log(foo[Symbol.iterator]());  // { next: f() {} }
```



### 7.2.3 自定义迭代器

任何实现 `Iterator` 接口的对象都可以作为迭代器使用

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

