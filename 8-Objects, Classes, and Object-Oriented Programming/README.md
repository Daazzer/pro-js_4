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

