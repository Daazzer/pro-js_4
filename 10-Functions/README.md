# 第 10 章 函数

函数实际上是对象。每个函数都是 `Function` 类型的实例，函数名就是指向函数对象的指针。

声明函数

```js
 function sum (num1, num2) {
     return num1 + num2;
 }
```

函数表达式

```js
let sum = function(num1, num2) {
    return num1 + num2;
};
```

箭头函数 (arrow function)

```js
let sum = (num1, num2) => {
    return num1 + num2;
};
```

还有一种是使用 `Function` 构造函数。接收任意多个字符串参数，最后一个参数始终会被当成函数体，而之前的参数都是新函数的参数

```js
let sum = new Function("num1", "num2", "return num1 + num2");  // 不推荐
```



## 10.1 箭头函数

ES6 新增了使用胖箭头 (=>) 语法定义函数表达式的能力

```js
let arrowSum = (a, b) => {
    return a + b;
};

let functionExpressionSum = function(a, b) {
    return a + b;
};

console.log(arrowSum(5, 8));  // 13
console.log(functionExpressionSum(5, 8));  // 13
```

箭头函数非常适合嵌入函数的场景

```js
let ints = [1, 2, 3];

console.log(ints.map(function(i) { return i + 1; }));  // [2, 3, 4]
console.log(ints.map((i) => { return i + 1; }));  // [2, 3, 4]
```

只有一个参数可以省略括号

```js
let triple = x => { return 3 + x; };

// 没有参数需要括号
let getRandom = () => { return Math.random(); };

// 多个参数需要括号
let sum = (a, b) => { return a + b; };
```



箭头函数可以省略花括号，如果省略后面就只能跟着一行代码，会直接返回后面一行代码的表达式结果

```js
let double = x => 3 * x;

// 可以赋值
let value = {};
let setName = x => x.name = "Matt";
setName(value);
console.log(value.name);  // "Matt"
```



但是，箭头函数不能使用 `arguments`、`super` 和 `new.target`，也不能用作构造函数。此外，箭头函数也没有 `prototype` 属性



## 10.2 函数名

函数名就是指向函数的指针，所以它们跟其他包含对象指针的变量具有相同的行为

```js
// 一个函数可以有多个名称
function sum(num1, num2) {
    return num1 + num2;
}

console.log(sum(10, 10));  // 20

let anotherSum = sum;
console.log(anotherSum(10, 10));  // 20

sum = null;
console.log(anotherSum(10, 10));  // 20
```



ES6 所有的函数对象都会暴露一个只读的 `name` 属性，保存的就是一个函数标识符，字符串话的变量名，即使函数没有名称也会显示成空串

```js
function foo() {}
let bar = function() {};
let baz = () => {};

console.log(foo.name);  // foo
console.log(bar.name);  // bar
console.log(baz.name);  // baz
console.log((() => {}).name);  // ""
console.log((new Function()).name);  // anonymous
```

获取函数、设置函数、或者 `bind()` 实例化，那么标识符前面会加上一个前缀

```js
function foo() {}

console.log(foo.bind(null).name);  // bound foo

let dog = {
    years: 1,
    get age() {
        return this.years;
    },
    set age(newAge) {
        this.years = newAge;
    }
};

let propertyDiscriptor = Object.getOwnPropertyDescriptor(dog, 'age');
console.log(propertyDiscriptor.get.name);  // get age
console.log(propertyDiscriptor.set.name);  // set age
```

