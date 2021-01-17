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

