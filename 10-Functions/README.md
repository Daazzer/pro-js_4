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

