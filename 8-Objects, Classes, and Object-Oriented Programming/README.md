# 第 8 章 对象、类与面向对象编程

可以把 ECMAScript 的对象想象为一张散列表，其中的内容就是一组名/值对，值可以是数据或者函数

## 8.1 理解对象

使用 `Object` 构造函数创建

```js
let person = new Object();
person.name = "Nicholas";
person.age = 29;
person.job = "Software Engineer";
person.sayName = function() {
    console.log(this.name);
};
```



使用对象字面量创建对象（更加流行）

```js
let person = {
    name: "Nicholas",
    age: 29,
    job: "Software Enginner",
    sayName() {
        console.log(this.name);
    }
};
```



### 8.1.1 属性的类型

规范将两个中括号把特性的名称括起来，比如 `[[Enumerable]]`

属性分为：

- 数据属性
- 访问器属性

#### 1. 数据属性

- `[[Configurable]]` 表示属性是否可以通过 `delete` 删除并重新定义，默认值 `true`
- `[[Enumberable]]` 表示是否可以通过 `for-in` 循环返回，默认值 `true`
- `[[Writable]]` 表示属性的值是否可以被修改。默认值 `true`
- `[[Value]]` 包含属性的实际值。默认值 `undefined`

```js
/*
显式将属性添加到对象之后，[[Configurable]]、[[Enumberable]]、[[Writable]]、[[Value]]
都会被设置为 true
 */
let person = {
    name: "Nicholas"
};
```



修改默认特性：`Object.defineProperty(targetObj, propName, propDesc)`

```js
let person = {};
Object.defineProperty(person, "name", {
    writable: false,
    value: "Nicholas"
});
console.log(person.name);  // "Nicholas"
// 严格模式下会报错
person.name = "Greg";
console.log(person.name);  // "Nicholas"
```



如果对象中一个属性的 `[[Configurable]]` 设置为 `false`

- 不可 `delete` 此属性
- 不可再次对同一个属性调用 `Object.defineProperty()`

调用 `Object.defineProperty()` 默认的 `[[configurable]]` `[[enumerable]]` `[[writable]]` 默认为 `false`



#### 2. 访问器属性

不包含数据值。包含一个获取 (getter) 函数和一个设置 (setter) 函数

访问属性值时调用 getter，设置属性值时会调用 setter

- `[[configurable]]` 表示属性是否可以通过 `delete` 删除并重新定义，默认值 `true`
- `[[Enumberable]]` 表示是否可以通过 `for-in` 循环返回，默认值 `true`
- `[[Get]]` 获取函数，读取属性时调用。默认为 `undefined`
- `[[Set]]` 设置函数，写入属性时调用。默认为 `undefined`

```js
// 设置一个值会导致其他变化发生
let book = {
    year_: 2017,
    edition: 1
};

Object.defineProperty(book, "year", {
    get() {
        return this.year_;
    },
    set(newValue) {
        if (newValue > 2017) {
            this.year_ = newValue;
            this.edition += newValue - 2017;
        }
    }
});

book.year = 2018;
console.log(book.edition);  // 2
```



只定义获取函数 (getter) 说明这个属性时只读的，只有一个设置函数的属性是不能读取的



> **注意** 在 ES5 以前有两个非标准属性可以访问访问器属性: `__defineGetter__()` 和 `__defineSetter__()`



### 8.1.2 定义多个属性

`Object.defineProperties(targetObj, descObj)` 方法

```js
let book = {};
Object.defineProperties(book, {
    year_: {
        value: 2017
    },
    edition: {
        value: 1
    },
    year: {
        get() {
            return this.year_;
        },
        set(newValue) {
            if (newValue > 2017) {
                this.year_ = newValue;
                this.edition += newValue - 2017;
            }
        }
    }
});
```



### 8.1.3 读取属性的特性

`Object.getOwnPropertyDescriptor(targetObj, propName): descObj`

```js
let book = {};
Object.defineProperties(book, {
    year_: {
        value: 2017
    },
    edition: {
        value: 1
    },
    year: {
        get: function() {
            return this.year_;
        },
        set: function(newValue) {
            if (newValue > 2017) {
                this.year_ = newValue;
                this.edition += newValue - 2017;
            }
        }
    }
});
let descriptor = Object.getOwnPropertyDescriptor(book, "year_");
console.log(descriptor.value);  // 2017
console.log(descriptor.configurable);  // false
console.log(typeof descriptor.get);  // "undefined"
let descriptor1 = Object.getOwnPropertyDescriptor(book, "year");
console.log(descriptor1.value);  // undefined
console.log(descriptor1.enumerable);  // false
console.log(typeof descriptor1.get);  // "function"
```



 **ES2017:**  `Object.getOwnPropertyDescriptors()`

```js
let book = {};
Object.defineProperties(book, {
    year_: {
        value: 2017
    },
    edition: {
        value: 1
    },
    year: {
        get: function() {
            return this.year_;
        },
        set: function(newValue) {
            if (newValue > 2017) {
                this.year_ = newValue;
                this.edition += newValue - 2017;
            }
        }
    }
});
console.log(Object.getOwnPropertyDescriptors(book));

/*
{
    "year_": {
        "value":2017,
        "writable":false,
        "enumerable":false,
        "configurable":false
    },
    "edition": {
        "value":1,
        "writable":false,
        "enumerable":false,
        "configurable":false
    },
    "year":{
        "enumerable":false,
        "configurable":false
    }
}; 
*/
```



### 8.1.4 合并对象

把源对象所有的本地属性一起复制到目标对象上。有时候这种操作叫做混入 (mixin)

- `Object.assign()` 接收一个目标对象和一个或多个源对象作为参数，然后将每个原对象中可枚举和只有属性复制到目标对象

  这个方法会使用源对象上的 `[[Get]]` 取得属性的值，然后使用目标对象上的 `[[Set]]` 设置属性的值

  ```js
  let dest, src, result;
  
  /**  
   * 简单复制
   */
  dest = {};
  src = { id: 'src' };
  result = Object.assign(dest, src);
  
  // Object.assign 修改目标对象
  // 也会返回修改后的目标对象
  console.log(dest === result);  // true
  console.log(dest !== src);  // true
  console.log(result);  // { id: 'src' }
  console.log(dest);  // { id: 'src' }
  
  /**
   * 多个源对象
   */
  dest = {};
  
  result = Object.assign(dest, { a: 'foo' }, { b: 'bar' });
  
  console.log(result);  // { a: 'foo', b: 'bar' }
  
  /**
   * 获取函数与设置函数
   */
  dest = {
      set a(val) {
          console.log(`Invoked dest setter with param ${val}`);
      }
  };
  src = {
      get a() {
          console.log('Involed src getter');
          return 'foo';
      }
  };
  
  Object.assign(dest, src);
  
  /*
  调用 src 的获取方法
  调用 dest 的设置方法并传入参数 "foo"
  因为这里的设置函数不执行赋值操作
  所以实际上并没有把值转移过来
   */
  console.log(dest);  // { set a(val) {...} }
  ```



`Object.assign()` 实际上对每个源对象执行的是浅复制，如果多个源对象都有相同的属性，则使用最后一个复制的值

```js
/**
 * 覆盖属性
 */
let desc = { id: 'dest' };

let result = Object.assign(dest, { id: 'src1', a: 'foo' }, { id: 'src2', b: 'bar' });

// Object.assign 会覆盖重复的属性
console.log(result);  // { id: 'src2', a: 'foo', b: 'bar' }

desc = {};
src = { a: {} };
console.log(dest);  // { a: {} }
console.log(dest.a === src.a);  // true
```



`Object.assign()` 没有“回滚”操作，如果报错会中断复制，可能只会完成部分复制



### 8.1.5 对象标识及相等判定

ECMAScript 6 新增 `Object.is()`，与 `===` 很像，但同时也考虑了边界情况

```js
console.log(Object.is(true, 1));  // false
console.log(Object.is({}, {}));  // false
console.log(Object.is("2", 2));  // false

// 正确的 0、-0、+0 相等/不等判定
console.log(Object.is(+0, -0));  // false
console.log(Object.is(+0, 0));  // true
console.log(Object.is(-0, 0));  // false

// 正确的 NaN 相等判定
console.log(Object.is(NaN, NaN));  // true
```



递归检查超过两个值

```js
function recursivelyCheckEqual(x, ...rest) {
    return Object.is(x, rest[0]) && (rest.length < 2 || rescursivelyCheckEqual(...rest));
}
```



### 8.1.6 增强的对象语法

#### 1. 属性名简写

```js
let name = "Matt";

let person = {
    name
};

console.log(person);  // { name: "Matt" }
```



#### 2. 可计算属性

```js
const nameKey = "name";
const ageKey = "age";
const jobKey = "job";

const person = {
    [nameKey]: "Matt",
    [ageKey]: 27,
    [jobKey]: "Sofeware engineer"
};

console.log(person);  // { name: "Matt", age: 27, job: "Sofeware engineer" }
```



也可以是复杂的表达式

```js
const nameKey = "name";
const ageKey = "age";
const jobKey = "job";
let uniqueToken = 0;

function getUniqueKey(key) {
    return `${key}_${uniqueToken++}`;
}

const person = {
    [getUniqueKey(nameKey)]: "Matt",
    [getUniqueKey(ageKey)]: 27,
    [getUniqueKey(jobKey)]: "Sofeware engineer"
};

console.log(person);  // { name_0: "Matt", age_1: 27, job_2: "Sofeware engineer" }
```



> **注意** 可计算属性表达式在报错时没有回滚操作



#### 3. 简写方法名

```js
let person = {
    sayName(name) {
        console.log(`My name is ${name}`);
    }
};

person.sayName("Matt");  // My name is Matt

// 获取函数和设置函数同样适用
person = {
    name_: '',
    get name() {
        return this.name_;
    },
    set name(name) {
        this.name_ = name;
    },
    sayName() {
        console.log(`My name is ${this.name_}`);
    }
};

person.name = "Matt";
person.sayName();  // My name is Matt
```



同时可以与计算属性键相互兼容

```js
const methodKey = "sayName";

const person = {
    [methodKey](name) {
        console.log(`My name is ${name}`);
    }
};

person.sayName("Matt");  // My name is Matt
```



### 8.1.7 对象解构

ECMAScript 6 新增了对象解构语法，可以在一条语句中使用嵌套数据实现一个或多个赋值操作。

不使用对象解构

```js
const person = {
    name: "Matt",
    age: 27
};

const personName = person.name,
      personAge = person.age;
console.log(personName);  // Matt
console.log(personAge);  // 27
```



使用对象解构

```js
const person = {
    name: "Matt",
    age: 27
};

const { name: personName, age: personAge } = person;

console.log(personName);  // Matt
console.log(personAge);  // 27
```



解构赋值时定义默认值

```js
const person = {
    name: "Matt",
    age: 27
};

// 如果访问对象不存在的属性则默认是 undefined，除非赋默认值
const { name, job = 'Sofeware engineer' } = person;

console.log(name);  // Matt
console.log(job);  // Sofeware engineer
```



解构在内部使用函数 `ToObject()` (不能在运行时环境中直接访问) 把数据结构转换为对象。这意味着在对象解构的上下文中，原始值会被当成对象，但是 `null` 和 `undefined` 不能被解构，否则会抛出错误

```js
let { length } = 'foobar';
console.log(length);  // 6

let { constructor: c } = 4;
console.log(c === Number);  // true

let { _ } = null;  // TypeError
let { _ } = undefined;  // TypeError
```



预先声明的变量，对象解构赋值时要包在括号内部

```js
let personName, personAge;

let person = {
    name: "Matt",
    age: 27
};

({ name: personName, age: personAge } = person);

console.log(personName, personAge);  // Matt, 27
```



#### 1. 嵌套解构

```js
const person = {
    name: 'Matt',
    age: 27,
    job: {
        title: 'Sofeware engineer'
    }
};
const personCopy = {};

({
    name: personCopy.name,
    age: personCopy.age,
    job: personCopy.job
} = person);

// person.job 是对象引用，所以修改里面的属性 personCopy 也会影响
person.job.title = 'Hacker';

console.log(person);  // { name: 'Matt', age: 27, { title: 'Hacker' } }
console.log(personCopy);  // { name: 'Matt', age: 27, { title: 'Hacker' } }

// 嵌套结构
let { job: { title } } = person;

console.log(title);  // Hacker
```



#### 2. 部分解构

```js
const person = {
    name: 'Matt',
    age: 27
};

let personName, personBar, personAge;

try {
    // person.foo 是 undefined，会抛错
    ({ name: personName, foo: { bar: personBar }, age: personAge } = person)
} catch (err) {}

console.log(personName, personBar, personAge);  // Matt undefined undefined
```



#### 3. 参数上下文匹配

在函数参数列表中也可以进行解构赋值。对参数的解构赋值不会影响 `arguments` 对象

```js
const person = {
    name: 'Matt',
    age: 27
};

function printPerson(foo, { name, age }, bar) {
    console.log(arguments);
    console.log(name, age);
}

function printPerson2(foo, { name: personName, age: personAge }, bar) {
    console.log(arguments);
    console.log(personName, personAge);
}

printPerson('1st', person, '2nd');
// ['1st', { name: 'Matt', age: 27 }, '2nd']
// 'Matt', 27

printPerson2('1st', person, '2nd');
// ['1st', { name: 'Matt', age: 27 }, '2nd']
// 'Matt', 27
```



## 8.2 创建对象

使用 `Object` 构造函数或字面量对象可以方便的创建对象，但是有不足：创建具有相同接口的多个对象需要重复编写很多代码

### 8.2.1 概述

ES6 开始正式支持类和继承，ES6 的类都仅仅是封装了 ES5.1 构造函数加原型继承的语法糖而已

### 8.2.2 工厂模式

工厂模式用于抽象创建特定对象的过程。

按照特定接口创建对象的方式：

```js
function createPerson(name, age, job) {
    const o = new Object();
    o.name = name;
    o.age = age;
    o.job = job;
    o.sayName = function() {
        console.log(this.name);
    };
    return o;
}

const person1 = createPerson("Nicholas", 29, "Sofeware Enginner");
const person2 = createPerson("Greg", 27, "Doctor");
```

工厂模式虽然可以解决创建多个类似对象的问题，但是没有解决对象标识问题 (即新创建的对象是什么类型)

### 8.2.3 构造函数模式

ECMAScript 中的构造函数是用于创建特定类型对象的。

```js
function Person(name, age, job) {
    this.name = name;
    this.age = age;
    this.job = job;
    this.sayName = function() {
        console.log(this.name);
    };
}

const person1 = new Person("Nicholas", 29, "Sofeware Enginner");
const person2 = new Person("Greg", 27, "Doctor");

person1.sayName();  // Nicholas
person2.sayName();  // Greg

console.log(person1.constructor === Person);  // true
console.log(person2.constructor === Person);  // true

// constructor 本来是用于表示对象类型的。不过，一般认为 instanceof 操作符是确定对象类型更可靠的方式
console.log(person1 instanceof Object);  // true
console.log(person1 instanceof Person);  // true
console.log(person2 instanceof Object);  // true
console.log(person2 instanceof Person);  // true
```

构造函数模式与工厂模式的区别

- 没有显示地创建对象
- 属性和方法直接赋值给了 `this`
- 没有 `return`

构造函数名要按照惯例，首字母大写

要创建 `Person` 实例，应使用 `new` 操作符。以这种方式调用构造函数会执行以下操作

1. 在内存中创建一个对象
2. 这个对象内部的 `[[Prototype]]` 特性被赋值为构造函数的 `prototype` 属性
3. 构造函数内部的 `this` 被赋值为这个新对象 (即 `this` 指向新对象)
4. 执行构造函数内部的代码 (给新对象添加属性)
5. 如果构造函数返回非空对象，则返回该对象；否则，返回刚创建的新对象

在实例化时，如果不想传参数，那么构造函数后面的括号可以不加 (不推荐)。只要有 `new` 操作符，就可以调用相应的构造函数

```js
function Person() {
    this.name = "Jake";
    this.sayName = function() {
        console.log(this.name);
    };
}

const person1 = new Person();
const person2 = new Person;  // 不推荐

person1.sayName();  // Jake
person2.sayName();  // Jake

console.log(person1 instanceof Object);  // true
console.log(person1 instanceof Person);  // true
console.log(person2 instanceof Object);  // true
console.log(person2 instanceof Person);  // true
```

