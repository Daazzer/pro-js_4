# 第 9 章 代理与反射

ES6 新增的代理和反射为开发者提供了拦截并向基本操作嵌入额外行为的能力。具体地说，可以给目标对象定义一个关联的代理对象，而这个对象可以作为抽象的目标对象来使用

> **注意** 代理是一种新的基础性语言能力，只在百分之百支持它们的平台上有用。



## 9.1 代理基础

代理是目标对象的抽象。从很多方面来看，代理类似 C++ 指针，因为它可以用作目标对象的替身。

目标对象既可以直接被操作，又可以通过代理操作。但直接操作会绕过代理施予的行为



### 9.1.1 创建空代理

在任何可以使用目标对象的地方，都可以通过同样的方式来使用与之关联的代理对象。

代理是使用 `Proxy` 构造函数创建的。这个构造函数接收两个参数：目标对象和处理程序对象。

```js
const target = {
    id: 'target'
};

const handler = {};

const proxy = new Proxy(target, handler);

// id 属性会访问同一个值
console.log(target.id);  // target
console.log(proxy.id);  // target

// 给目标属性赋值会反映在两个对象上
target.id = 'foo';
console.log(target.id);  // foo
console.log(proxy.id);  // foo

console.log(target.hasOwnProperty('id'));  // true
console.log(proxy.hasOwnProperty('id'));  // true

// Proxy.prototype 是 undefined
console.log(target instanceof Proxy);  // TypeError: Function has non-object prototype 'undefined' in instanceof check
console.log(proxy instanceof Proxy);  // TypeError: Function has non-object prototype 'undefined' in instanceof check

// 全等可以用来区分代理和目标
console.log(target === proxy);  // false
```



### 9.1.2 定义捕获器

捕获器就是在处理程序对象中定义的“基本操作的拦截器”

> **注意** 捕获器（trap）是从操作系统中借用的概念。在操作系统中，捕获器是程序流中的一个同步中断，可以暂停程序流，转而执行一段子例程，之后再返回原始程序流

```js
const target = {
    foo: 'bar'
};

const proxy = new Proxy(target, {
    get() {
        return 'handler override';
    }
});
```

`proxy[property]`、`proxy.property` 或 `Object.create(proxy)[property]` 等操作都会触发基本的  `get()` 操作以获取属性。注意，只有在代理对象上执行这些操作才会触发捕获器。在目标对象上仍然会产生正常的行为

```js
const target = {
    foo: 'bar'
};

const proxy = new Proxy(target, {
    get() {
        return 'handler override';
    }
});

console.log(target.foo);  // bar
console.log(proxy.foo);  // handler override

console.log(target['foo']);  // bar
console.log(proxy['foo']);  // handler override

console.log(Object.create(target)['foo']);  // bar
console.log(Object.create(proxy)['foo']);  // handler override
```

