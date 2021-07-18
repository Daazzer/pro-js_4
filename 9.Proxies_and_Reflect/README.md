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



### 9.1.3 捕获器参数和反射 API

所有的捕获器都可以访问相应的参数

`get()` 捕获器会接收到目标对象、要查询的属性和代理对象三个参数

```js
const target = {
    foo: 'bar'
};

const proxy = new Proxy(target, {
    get(trapTarget, property, receiver) {
        console.log(trapTarget === target);
        console.log(property);
        console.log(receiver === proxy);
    }
});

proxy.foo;
// true
// foo
// true
```



有了这些参数，就可以重建被捕获方法的原始行为

```js
const target = {
    foo: 'bar'
};

const proxy = new Proxy(target, {
    get(trapTarget, property, receiver) {
        return trapTarget[property];
    }
});

console.log(proxy.foo);  // bar
console.log(target.foo);  // bar
```



实际上，可以通过全局 `Reflect` 对象上（封装了原始行为）的同名方法来轻松重建

处理程序对象中所有可以捕获的方法都有对应的反射（Reflect）API 方法。这些方法与捕获器拦截的方法具有相同的名称和函数签名

```js
const target = {
    foo: 'bar'
};

// const proxy0 = new Proxy(target, {
//   get() {
//     return Reflect.get(...arguments);
//   }
// });

const proxy = new Proxy(target, {
    get: Reflect.get
});

console.log(proxy.foo);  // bar
console.log(target.foo);  // bar
```



如果创建一个可以捕获所有方法，然后将每个方法转发给对应反射 API 的空代理，那么甚至不需要定义处理程序对象

```js
const target = {
    foo: 'bar'
};

const proxy = new Proxy(target, Reflect);

console.log(proxy.foo);  // bar
console.log(target.foo);  // bar
```



反射 API 为开发者准本好了样板代码，在此基础上开发者可以用最少的代码修饰捕获的方法

```js
const target = {
    foo: 'bar',
    baz: 'qux',
    bar: 'aa'
};

const proxy = new Proxy(target, {
    get(trapTarget, property, receiver) {
        let decoration = '';
        if (property === 'foo') {
            decoration = '!!!';
        }

        return Reflect.get(...arguments) + decoration;
    }
});

console.log(proxy.foo);  // bar!!!
console.log(target.foo);  // bar

console.log(proxy.baz);  // qux
console.log(target.baz);  // qux
```



### 9.1.4 捕获器不变式

捕获处理程序必须遵循“捕获器不变式”（trap invariant），通常方式捕获器定义出现过于反常的行为

比如，如果目标对象有一个不可配置且不可写的数据属性，那么捕获器返回一个与该属性不同的值时，会抛出 `TypeError`

```js
const target = {};
Object.defineProperty(target, 'foo', {
    configurable: false,
    writable: false,
    value: 'bar'
});

const proxy = new Proxy(target, {
    get() {
        return 'qux';
    }
});

console.log(proxy.foo);  // TypeError
```



### 9.1.5 可撤销代理

对于使用 `new Proxy()` 创建的普通代理来说，这种联系会在代理对象的生命周期内一直持续存在

`Proxy` 也暴露了 `revocable()` 方法，这个方法支持撤销代理对象与目标对象的关联。

撤销代理的操作是不可逆的。撤销代理后再调用代理会抛出 `TypeError`

```js
const target = {
    foo: 'bar'
};

const { proxy, revoke } = Proxy.revocable(target, {
    get() {
        return 'intercepted';
    }
});

console.log(proxy.foo);  // intercepted
console.log(target.foo);  // bar

revoke();

console.log(proxy.foo);  // TypeError
```



### 9.1.6 实用反射 API

#### 1. 反射 API 与对象 API

1. 反射 API 并不限于捕获处理程序；
2. 大多数反射 API 方法在 `Object` 类型上有对应的方法。

#### 2. 状态标记

很多反射方法返回称作“状态标记”的布尔值，表示意图执行的操作是否成功

比如

```js
const o = {};
try {
    Object.defineProperty(o, 'foo', 'bar');
    console.log('success');
} catch (e) {
    console.log('failure');
}
```

在定义新属性时如果发生问题，`Reflect.defineProperty()` 会返回 `false`，而不是抛出错误。

```js
// 重构以上代码
const o = {};
if (Reflect.defineProperty(o, 'foo', { value: 'bar' })) {
    console.log('success');
} else {
    console.log('failure');
}
```



以下反射方法都会提供状态标记

- `Reflect.defineProperty()`
- `Reflect.preventExtensions()`
- `Reflect.setPrototypeOf()`
- `Reflect.set()`
- `Reflect.deleteProperty()`

#### 3. 用一等函数替代操作符

以下反射方法提供只有通过操作符才能完成的操作

- `Reflect.get()` 可以替代对象属性访问操作符
- `Reflect.set()` 可以替代 `=` 赋值操作符
- `Reflect.has()` 可以替代 `in` 操作符或 `with()`
- `Reflect.deleteProperty()` 可以替代 `delete` 操作符
- `Reflect.construct()` 可以替代 `new` 操作符

#### 4. 安全地应用函数

在 `Function` 原型上的 `apply` 方法

`Function.prototype.apply.call(myFunc, thisVal, argumentList);`

这种可怕的代码完全可以使用 `Reflect.apply` 来避免

`Reflect.apply(myFunc, thisVal, argumentsList);`



### 9.1.7 代理另一个代理

代理可以拦截反射 API 的操作，而这意味着完全可以创建一个代理，通过它去代理另一个代理

```js
const target = {
    foo: 'bar'
};

const firstProxy = new Proxy(target, {
    get() {
        console.log('first proxy');
        return Reflect.get(...arguments);
    }
});

const secondProxy = new Proxy(firstProxy, {
    get() {
        console.log('second proxy');
        return Reflect.get(...arguments);
    }
});

console.log(secondProxy.foo);
// second proxy
// first proxy
// bar
```



### 9.1.8 代理的问题与不足

#### 1. 代理中的 this

方法中的 `this` 通常指向调用这个方法的对象

```js
const target = {
    thisValueEqualsProxy() {
        return this === proxy;
    }
};

const proxy = new Proxy(target, {});

console.log(target.thisValueEqualsProxy());  // false
console.log(proxy.thisValueEqualsProxy());  // true
```



如果目标对象依赖于对象标识，那就可能碰到意料之外的问题

```js
const wm = new WeakMap();

class User {
    constructor(userId) {
        wm.set(this, userId);
    }

    set id(userId) {
        wm.set(this, userId);
    }

    get id() {
        return wm.get(this);
    }
}

// 由于这个实现依赖 User 实例的对象标识，在这个实例被代理的情况下就会出问题
const user = new User(123);
console.log(user.id);  // 123

const userInstanceProxy = new Proxy(user, {});
console.log(userInstanceProxy.id);  // undefined

/* 
因为 User 实例一开始使用目标对象作为 WeakMao 的键，代理对象却尝试从自身取得这个实例
要解决这个问题，就需要重新配置代理，把代理 User 实例改为代理 User 类本身。之后再创建
代理的实例就会以代理实例作为 WeakMap 的键了
 */
const UserClassProxy = new Proxy(User, {});
const proxyUser = new UserClassProxy(456);
console.log(proxyUser.id);  // 456
```



#### 2. 代理与内部槽位

代理与内置引用类型，通常能很好的协同，但是也有一些例外

例如 `Date` 类型，`Date` 类型方法的执行依赖 `this` 值上的内部槽位 `[[NumberDate]]`。代理对象上不存在这个槽位，而且这个内部槽位的值也不能通过普通的 `get()` 和 `set()` 操作访问到，于是代理拦截后本应该转发给目标对象的方法会抛出 `TypeError`

```js
const target = new Date();
const proxy = new Proxy(target, {});

console.log(proxy instanceof Date);  // true

proxy.getDate();  // TypeError: 'this' is not a Date object
```



## 9.2 代理捕获器与反射方法

代理可以捕获 13 种不同的基本操作

只要在代理上调用，所有捕获器都会拦截它们对应的反射 API 操作

### 9.2.1 get()

`get()` 捕获器会在获取属性的操作中被调用。对应的反射 API 方法为 `Reflect.get()`

```js
const myTarget = {};

const proxy = new Proxy(myTarget, {
    get(target, property, receiver) {
        console.log('get()');
        return Reflect.get(...arguments);
    }
});

proxy.foo;
// get()
```

#### 1. 返回值

返回值无限制

#### 2. 拦截的操作

- `proxy.property`
- `proxy[property]`
- `Object.create(proxy)[property]`
- `Reflect.get(proxy, property, receiver)`

#### 3. 捕获器处理程序参数

- `target` 目标对象
- `property` 引用的目标对象上的字符串键属性
- `receiver` 代理对象或继承代理对象的对象

#### 4. 捕获器不变式

如果 `target.property` 不可写且不可配置，则处理程序返回的值必须与 `target.property` 匹配

如果 `target.property` 不可配置且 `[[Get]]` 特性为 `undefined`，处理程序的返回值也必须是 `undefined`

### 9.2.2 set()

`set()` 捕获器会在设置属性值的操作中被调用。对应的反射 API 方法为 `Reflect.set()`

```js
const myTarget = {};

const proxy = new Proxy(myTarget, {
    set(target, property, value, receiver) {
        console.log('set()');
        return Reflect.set(...arguments);
    }
});

proxy.foo = 'bar';
// set()
```

#### 1. 返回值

返回 `true` 表示成功；返回 `false` 表示失败，严格模式下会抛出 `TypeError`

#### 2. 拦截的操作

- `proxy.property = value`
- `proxy[property] = value`
- `Object.create(proxy)[property] = value`
- `Reflect.set(proxy, property, value, receiver)`

#### 3. 捕获器处理程序参数

- `target` 目标对象
- `property` 引用目标对象上的字符串键属性
- `value` 要赋给属性的值
- `receiver` 接收最初赋值的对象

#### 4. 捕获器不变式

如果 `target.property` 不可写且不可配置，则不能修改目标属性的值

如果 `target.property` 不可配置且 `[[Set]]` 特性为 `undefined`，则不能修改目标的值

在严格模式下，处理程序中返回 `false` 会抛出 `TypeError`

### 9.2.3 has()

`has()` 捕获器会在 `in` 操作符中被调用。对应的反射 API 方法 `Reflect.has()`

```js
const myTarget = {};

const proxy = new Proxy(myTarget, {
    has(target, property) {
        console.log('has()');
        return Reflect.set(...arguments);
    }
});

'foo' in proxy;
// has()
```

#### 1. 返回值

`has()` 必须返回布尔值，表示属性是否存在。返回非布尔值会被转型为布尔值

#### 2. 拦截的操作

- `property in proxy`
- `property in Object.create(proxy)`
- `with(proxy) { (property); }`
- `Reflect.has(proxy, property)`

#### 3. 捕获器处理程序参数

- `target` 目标对象
- `property` 引用目标对象上的字符串键属性

#### 4. 捕获器不变式

如果 `target.property` 存在且不可配置，则处理程序必须返回 `true`

如果 `target.property` 存在且目标对象不可扩展，则处理程序必须返回 `true`



### 9.2.4 defineProperty()

`defineProperty()` 捕获器会在 `Object.defineProperty()` 中被调用。对应的反射 API 方法 `Reflect.defineProperty()`

```js
const myTarget = {};

const proxy = new Proxy(myTarget, {
    defineProperty(target, property, descriptor) {
        console.log('defineProperty()');
        return Reflect.defineProperty(...arguments);
    }
});

Object.defineProperty(proxy, 'foo', { value: 'bar' });
// defineProperty()
```

#### 1. 返回值

`defineProperty()` 必须返回布尔值，表示属性是否成功定义。返回非布尔值会被转型为布尔值

#### 2. 拦截的操作

- `Object.defineProperty(proxy, property, descriptor)`
- `Reflect.defineProperty(proxy, property, descriptor)`

#### 3. 捕获器处理程序参数

- `target` 目标对象
- `property` 引用目标对象上的字符串键属性
- `descriptor` 包含可选的 `enumerable`、`configurable`、`writable`、`value`、`get` 和 `set` 定义的对象

#### 4. 捕获器不变式

如果目标对象不可扩展，则无法定义属性

如果目标对象有一个可配置的属性，则不能添加同名的不可配置属性

如果目标对象有一个不可配置的属性，则不能添加同名的可配置属性

### 9.2.5 getOwnPropertyDescriptor()

`getOwnPropertyDescriptor()` 捕获器会在 `Object.getOwnPropertyDescriptor()` 中被调用。对应的反射 API 方法 `Reflect.getOwnPropertyDescriptor()`

```js
const myTarget = {};

const proxy = new Proxy(myTarget, {
    getOwnPropertyDescriptor(target, property) {
        console.log('getOwnPropertyDescriptor()');
        return Reflect.getOwnPropertyDescriptor(...arguments);
    }
});

Object.getOwnPropertyDescriptor(proxy, 'foo');
// getOwnPropertyDescriptor()
```

#### 1. 返回值

`getOwnPropertyDescriptor()` 必须返回对象，或者在属性不存在时返回 `undefined`

#### 2. 拦截的操作

- `Object.getOwnPropertyDescriptor(proxy, property)`
- `Reflect.getOwnPropertyDescriptor(proxy, property)`

#### 3. 捕获器处理程序参数

- `target` 目标对象
- `property` 引用目标对象上的字符串键属性

#### 4. 捕获器不变式

如果自有的 `target.property` 存在且不可配置，则处理程序必须返回一个表示该属性存在的对象

如果自有的 `target.property` 存在且可配置，则处理程序必须返回一个表示该属性可配置对象

如果自有的 `target.property` 存在且 `target` 不可扩展，则处理程序必须返回一个表示该属性存在的对象

如果 `target.property` 不存在且 `target` 不可扩展，则处理程序必须返回 `undefined` 表示该属性不存在

如果 `target.property` 不存在，则处理程序不能返回表示该属性可配置的对象

### 9.2.6 deleteProperty()

`deleteProperty()` 捕获器会在 `delete` 操作符中被调用。对应的反射 API 方法 `Reflect.deleteProperty()`

```js
const myTarget = {};

const proxy = new Proxy(myTarget, {
    deleteProperty(target, property) {
        console.log('deleteProperty()');
        return Reflect.deleteProperty(...arguments);
    }
});

delete proxy.foo;
// deleteProperty()
```

#### 1. 返回值

`deleteProperty()` 必须返回布尔值，表示删除属性是否成功。返回非布尔值会被转型为布尔值

#### 2. 拦截的操作

- `delete proxy.property`
- `delete proxy[property]`
- `Reflect.deleteProperty(proxy, property)`

#### 3. 捕获器处理程序参数

- `target` 目标对象
- `property` 引用目标对象上的字符串键属性

#### 4. 捕获器不变式

如果自有的 `target.property` 存在且不可配置，则处理程序不能删除这个属性



### 9.2.7 ownKeys()

`ownKeys()` 捕获器会在 `Object.keys()` 及类似方法中被调用。对应的反射 API 方法 `Reflect.ownKeys()`

```js
const myTarget = {};

const proxy = new Proxy(myTarget, {
    ownKeys(target) {
        console.log('ownKeys()');
        return Reflect.ownKeys(...arguments);
    }
});

Object.keys(proxy);
// ownKeys()
```

#### 1. 返回值

`ownKeys()` 必须返回包含字符串或符号的可枚举对象

#### 2. 拦截的操作

- `Object.getOwnPropertyNames(proxy)`
- `Object.getOwnPropertySymbols(proxy)`
- `Object.keys(proxy)`
- `Reflect.ownKeys(proxy)`

#### 3. 捕获器处理程序参数

- `target` 目标对象

#### 4. 捕获器不变式

返回的可枚举对象必须包含 `target` 的所有不可配置的只有属性

如果 `target` 不可扩展，则返回可枚举对象必须准确地包含只有属性键

### 9.2.8 getPrototypeOf()

`getPrototypeOf()` 捕获器会在 `Object.getPrototypeOf()` 中被调用。对应的反射 API 方法 `Reflect.getPrototypeOf()`

```js
const myTarget = {};

const proxy = new Proxy(myTarget, {
    getPrototypeOf(target) {
        console.log('getPrototypeOf()');
        return Reflect.getPrototypeOf(...arguments);
    }
});

Object.getPrototypeOf(proxy);
// getPrototypeOf()
```

#### 1. 返回值

`getPrototypeOf()` 必须返回对象或 `null`

#### 2. 拦截的操作

- `Object.getPrototypeOf(proxy)`
- `Object.getPrototypeOf(proxy)`
- `proxy.__proto__`
- `Object.prototype.isPrototypeOf(proxy)`
- `proxy instanceof Object`

#### 3. 捕获器处理程序参数

- `target` 目标对象

#### 4. 捕获器不变式

如果 `target` 不可扩展，则 `Object.getPrototypeOf(proxy)` 唯一有效的返回值就是 `Object.getPrototypeOf(target)` 的返回值就是 `Object.getPrototypeOf(target)` 的返回值

### 9.2.10 isExtensible()

`isExtensible()` 捕获器会在 `Object.isExtensible()` 中被调用。对应的反射 API 方法 `Reflect.isExtensible()`

```js
const myTarget = {};

const proxy = new Proxy(myTarget, {
    isExtensible(target) {
        console.log('isExtensible()');
        return Reflect.isExtensible(...arguments);
    }
});

Object.isExtensible(proxy);
// isExtensible()
```

#### 1. 返回值

`isExtensible()` 必须返回布尔值，表示 `target` 是否可扩展。返回非布尔值会被转型为布尔值

#### 2.拦截的操作

#### 返回l`

- `Object.isExtensible(proxy)`
- `Relfect.isExtensible(proxy)`

#### 3. 捕获器处理程序参数

- `target` 目标对象

#### 4. 捕获器不变式

如果 `target` 可扩展，则处理程序必须返回 `true`

如果 `target` 不可扩展，则处理程序必须返回 `false`

### 9.2.11 preventExtensions()

`preventExtensions()` 捕获器会在 `Object.preventExtensions()` 中被调用。对应的反射 API 方法 `Reflect.preventExtensions()`

```js
const myTarget = {};

const proxy = new Proxy(myTarget, {
    preventExtensions(target) {
        console.log('preventExtensions()');
        return Reflect.preventExtensions(...arguments);
    }
});

Object.preventExtensions(proxy);
// preventExtensions()
```

#### 1. 返回值

`preventExtensions()` 必须返回布尔值，表示 `target` 是否可扩展。返回非布尔值会被转型为布尔值

#### 2.拦截的操作

- `Object.preventExtensions(proxy)`
- `Relfect.preventExtensions(proxy)`

#### 3. 捕获器处理程序参数

- `target` 目标对象

#### 4. 捕获器不变式

如果 `Object.preventExtensions(proxy)` 是 `false`，则处理程序必须返回 `true`

### 9.2.12 apply()

`apply()` 捕获器会在调用函数时被调用。对应的反射 API 方法 `Reflect.apply()`

```js
const myTarget = () => {};

const proxy = new Proxy(myTarget, {
    apply(target, thisArg, ...argumentsList) {
        console.log('apply()');
        return Reflect.apply(...arguments);
    }
});

proxy();
// apply()
```

#### 1. 返回值

返回值无限制

#### 2.拦截器的操作

- `proxy(...argumentsList)`
- `Function.prototype.apply(thisArg, argumentsList)`
- `Function.prototype.call(thisArg, ...argumentsList)`
- `Reflect.apply(target, thisArgument, argumentsList)`

#### 3. 捕获器处理程序参数

- `target` 目标对象
- `thisArg` 调用函数时的 `this` 参数
- `argumentsList` 调用函数时的参数列表

#### 4. 捕获器不变式

`target` 必须是一个函数对象

### 9.2.13 construct()

`construct()` 捕获器会在 `new` 操作符中被调用。对应的反射 API 方法 `Reflect.construct()`

```js
const myTarget = function() {};

const proxy = new Proxy(myTarget, {
    construct(target, argumentsList, newTarget) {
        console.log('construct()');
        return Reflect.construct(...arguments);
    }
});

new proxy();
// construct()
```

#### 1. 返回值

`construct()` 必须返回一个对象

#### 2.拦截器的操作

- `new proxy(...argumentsList)`
- `Reflect.construct(target, argumentsList, newTarget)`

#### 3. 捕获器处理程序参数

- `target` 目标构造函数
- `argumentsList` 传给目标构造函数的参数列表
- `newTarget` 最初被调用的构造函数

#### 4. 捕获器不变式

`target` 必须可以用作构造函数



## 9.3 代理模式

### 9.3.1 跟踪属性访问

捕获 `get` `set` `has` 等操作，可以知道对象属性什么时候被访问、被查阅。

```js
const user = {
    name: 'Jake'
};

const proxy = new Proxy(user, {
    get(target, property, receiver) {
        console.log(`Getting ${property}`);

        return Reflect.get(...arguments);
    },
    set(target, property, value, receiver) {
        console.log(`Setting ${property}=${value}`);

        return Reflect.set(...arguments);
    }
});

proxy.name;  // Getting name
proxy.age = 27;  // Setting age=27
```



### 9.3.2 隐藏属性

```js
const hiddenProperties = ['foo', 'bar'];
const targetObject = {
    foo: 1,
    bar: 2,
    baz: 3
};
const proxy = new Proxy(targetObject, {
    get(target, property) {
        if (hiddenProperties.includes(property)) {
            return undefined
        } else {
            return Reflect.get(...arguments);
        }
    },
    has(target, property) {
        if (hiddenProperties.includes(property)) {
            return false;
        } else {
            return Reflect.has(...arguments);
        }
    }
});
// get()
console.log(proxy.foo);  // undefined
console.log(proxy.bar);  // undefined
console.log(proxy.baz);  // 3

// has()
console.log('foo' in proxy);  // false
console.log('bar' in proxy);  // false
console.log('baz' in proxy);  // true
```



### 9.3.3 属性验证

因为所有赋值操作都会触发 `set()` 捕获器，所以可以根据所赋的值决定是否允许还是拒绝赋值

```js
const target = {
    onlyNumbersGoHere: 0
};

const proxy = new Proxy(target, {
    set(target, property, value) {
        if (typeof value !== 'number') {
            return false;
        } else {
            return Reflect.set(...arguments);
        }
    }
});

proxy.onlyNumbersGoHere = 1;
console.log(proxy.onlyNumbersGoHere);  // 1
proxy.onlyNumbersGoHere = '2';
console.log(proxy.onlyNumbersGoHere);  // 1
```



### 9.3.4 函数与构造函数参数验证

比如让函数值接收某种类型的值

```js
function median(...nums) {
    return nums.sort()[Math.floor(nums.length / 2)];
}

const proxy = new Proxy(median, {
    apply(target, thisArg, ...argumentsList) {
        for (const arg of argumentsList) {
            if (typeof arg !== 'number') {
                throw 'Non-number argument provided';
            }
        }
        return Reflect.apply(...arguments);
    }
});

console.log(proxy(4, 7, 1));  // 4
console.log(proxy(4, '7', 1));  // 4
// Error: Non-number argument provided
```

或者要求实例化时必须给构造函数传参

```js
class User {
    constructor(id) {
        this.id_ = id;
    }
}

const proxy = new Proxy(User, {
    construct(target, argumentsList, newTarget) {
        if (argumentsList[0] === undefined) {
            throw 'User cannot be instantiated without id';
        } else {
            return Reflect.construct(...arguments);
        }
    }
});

new proxy(1);

new proxy();
// Error: User cannot be instantiated without id
```



### 9.3.5 数据绑定与可观察对象

可以将代理的类绑定到一个全局实例集合，让所有创建的实例都被添加到这个集合中

```js
const userList = [];

class User {
    constructor(name) {
        this.name_ = name;
    }
}

const proxy = new Proxy(User, {
    construct(target, argumentsList, newTarget) {
        const newUser = Reflect.construct(...arguments);
        userList.push(newUser);
        return newUser;
    }
});

new proxy('John');
new proxy('Jacob');
new proxy('Jingleheimerschmidt');
console.log(userList);  // [User {}, User {}, User {}]
```

另外，还可以把集合绑定到一个事件分派程序，每次插入新实例都会发送消息



