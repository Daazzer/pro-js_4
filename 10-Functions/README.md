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



## 10.3 理解参数

ECMAScript 函数既不关心传入参数的个数，也不关心参数的数据类型。

因为参数在函数内部表现为一个数组。

可以在函数内部访问 `arguments` 对象，是一个类数组对象（但不是 `Array` 实例）

```js
function sayHi() {
    console.log("Hello " + arguments[0] + ", " + arguments[1]);
}
```

ECMAScript 不存在验证命名参数的机制

`arguments` 对象可以跟命名参数混合使用

`arguments` 对象值始终会与对应的命名参数同步

```js
function doAdd(num1, num2) {
    arguments[1] = 10;
    console.log(arguments[0] + num2);
}
```

但是修改命名参数的值，不会影响 `arguments` 对象中相应的值

### 箭头函数中的参数

传给函数的参数不能使用 `arguments` 访问

```js
let bar = () => {
    console.log(arguments[0]);
};
bar(5);  // ReferenceError: arguments is not defined

// 可以包装函数中提供给箭头函数
function foo() {
    let bar = () => {
        console.log(arguments[0]);  // 5
    };
    bar();
}
foo(5);
```



## 10.4 没有重载

ECMAScript 函数没有签名，因为参数是由包含零个或多个值的数组表示的。没有函数签名，自然就没有重载

如果在 ECMAScript 中定义了两个同名函数，则后定义的会覆盖先定义

```js
function addSomeNumber(num) {
    return num + 100;
}

function addSomeNumber(num) {
    return num + 200;
}

let result = addSomeNumber(100);  // 300
```

第二个覆盖第一个定义

```js
// 类似例子
let addSomeNumber = function(num) {
    return num + 100;
};

addSomeNumber = function(num) {
    return num + 200;
};

let result = addSomeNumber(100);  // 300
```

## 10.5 默认参数值

在 ECMAScript 5.1 以前，实现默认参数的一种常用方式就是检测某个参数是否等于 `undefined`

```js
function makeKing(name) {
    name = (typeof name !== 'undefined') ? name : 'Henry';
    return `king ${name} Ⅷ`;
}

console.log(makeKing());  // 'King Henry Ⅷ';
console.log(makeKing('Louis'));  // 'King Louis Ⅷ';
```

ECMAScript 6 支持显式定义默认参数

```js
function makeKing(name = 'Henry') {
    return `King ${name} Ⅷ`;
}

console.log(makeKing());  // 'King Henry Ⅷ';
console.log(makeKing('Louis'));  // 'King Louis Ⅷ';
```

给参数传 `undefined` 相当于没有传值

```js
function makeKing(name = 'Henry', numerals = 'Ⅷ') {
    return `King ${name} ${numerals}`;
}
console.log(makeKing());  // King Henry Ⅷ
console.log(makeKing('Louis'));  // King Louis Ⅷ
console.log(makeKing(undefined, 'Ⅵ'));  // King Henry Ⅵ
```

使用默认参数，`arguments` 对象的值不反映参数的默认值，值反映传给函数的参数，修改命名参数也不会影响 `arguments` 对象，它始终以调用函数时传入的值为准

```js
function makeKing(name = 'Henry') {
    name = 'Louis';
    return `King ${arguments[0]}`;
}

console.log(makeKing());  // 'King undefined'
console.log(makeKing('Louis'));  // 'King Louis'
```

默认参数支持变量

```js
let romanNumerals = ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ']
let ordinality = 0;

function getNumerals() {
    return romanNumerals[ordinality++];
}

function makeKing(name = 'Henry', numerals = getNumerals()) {
    return `King ${name} ${numerals}`;
}

console.log(makeKing());  // King Henry Ⅰ
console.log(makeKing('Louis', 'ⅩⅥ'));  // King Louis ⅩⅥ
console.log(makeKing());  // King Henry Ⅱ
console.log(makeKing());  // King Henry Ⅲ
```

箭头函数也支持默认参数，但是只有一个参数时不能省略括号

```js
let makeKing = (name = 'Henry') => `King ${name}`;

console.log(makeKing());  // King Henry
```



### 默认参数作用域与临时性死区

给多个参数定义默认值实际上跟使用 `let` 关键字顺序声明变量一样

参数是按顺序初始化的，所以后定义默认值的参数可以引用先定义的参数

```js
function makeKing(name = 'Henry', numerals = name) {
    return `King ${name} ${numerals}`;
}

console.log(makeKing());  // King Henry Henry
```

前面定义的参数不能引用后定义的参数，否则会抛错

```js
// 报错
function makeKing(name = numerals, numerals = 'Ⅷ') {
    return `King ${name} ${numerals}`;
}
```

参数也存在于自己的作用域中，它们不能引用函数体的作用域

```js
// 报错
function makeKing(name = 'Henry', numerals = defaultNumeral) {
    var defaultNumeral = 'Ⅷ';
    return `King ${name} ${numerals}`;
}
```



## 10.6 参数扩展与收集

ECMAScript 6 新增了扩展操作符，既可用于调用函数时传参，也可以用于定义函数参数

### 10.6.1 扩展参数

传入多个参数

```js
let values = [1, 2, 3, 4];

function getSum() {
    let sum = 0;
    for (let i = 0; i < arguments.length; i++) {
        sum += arguments[i];
    }
    return sum;
}

// ES5
console.log(getSum.apply(null, values));  // 10
// ES6
console.log(getSum(...values));  // 10
// 在扩展操作符前后再加值
console.log(getSum(-1, ...values));  // 9
console.log(getSum(...values, 5));  // 15
console.log(getSum(-1, ...values, 5));  // 14
console.log(getSum(...values, ...[5, 6, 7]));  // 28
```

箭头函数也支持扩展操作符

```js
// 扩展操作符与参数默认值混合使用
function getProduct(a, b, c = 1) {
    return a * b * c;
}

let getSum = (a, b, c = 0) => {
    return a + b + c;
};

console.log(getProduct(...[1, 2]));  // 2
console.log(getProduct(...[1, 2, 3]));  // 6
console.log(getProduct(...[1, 2, 3, 4]));  // 6

console.log(getSum(...[0, 1]));  // 1
console.log(getSum(...[0, 1, 2]));  // 3
console.log(getSum(...[0, 1, 2, 3]));  // 3
```

### 10.6.2 收集参数

可以用扩展操作符把不同长度的独立参数组合为一个数组。收集到的参数的结果会得到一个 `Array` 实例

```js
function getSum(...values) {
    return values.reduce((x, y) => x + y, 0);
}

console.log(getSum(1, 2, 3));  // 6
```

收集参数只能作为最后一个参数，如果没有其余的参数则为空数组

```js
// 不可以
function getProduct(...values, lastValue) {}
// 可以
function ignoreFirst(firstValue, ...values) {
    console.log(values);
}
ignoreFirst();  // []
ignoreFirst(1);  // []
ignoreFirst(1, 2);  // [2]
ignoreFirst(1, 2, 3);  // [2, 3]
```

利用收集参数，可以让箭头函数实现与 `arguments` 一样的逻辑

```js
let getSum = (...values) => {
    return values.reduce((x, y) => x + y, 0);
}

console.log(getSum(1, 2, 3));  // 6
```

使用收集参数不影响 `arguments` 对象，它仍然反映调用时传给函数的参数

```js
function getSum(...values) {
    console.log(arguments.length);  // 3
    console.log(arguments);  // [1, 2, 3]
    console.log(values);  // [1, 2, 3]
}

console.log(getSum(1, 2, 3));
```

