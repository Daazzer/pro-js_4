# 第 12 章 BOM

浏览器对象模型(BOM, Browser Object Model)提供了与网页无关的浏览器功能对象

## 12.1 window 对象

BOM 的核心是 `window` 对象。`window` 对象在浏览器中有两重身份，一个是 ECMAScript 中的 `Global` 对象，另一个就是浏览器窗口的 JavaScript 接口

> **注意** 很多浏览器 API 都以 `window` 对象属性的形式暴露出来

### 12.1.1 Global 作用域

通过 `var` 声明的所有全局变量和函数都会变成 `window` 对象的属性和方法

```js
var age = 29;
var sayAge = () => alert(this.age);

alert(window.age);  // 29
sayAge();  // 29
window.sayAge();  // 29
```

使用 `let` 或 `const` 替代 `var`，则不会把变量添加到全局对象

```js
let age = 29;
const sayAge = () => alert(this.age);

alert(window.age);  // undefined
sayAge();  // undefined
window.sayAge();  // TypeError: window.sayAge in not a function
```

访问未声明的变量会抛出错误，但是可以在 `window` 对象上查询是否存在可能未声明的变量

```js
var newValue = oldValue;  // 抛错
var newValue = window.oldValue;  // undefined
```

