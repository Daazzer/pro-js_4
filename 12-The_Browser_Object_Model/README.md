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

### 12.1.2 窗口关系

`top` 对象始终指向最上层（最外层）窗口，即浏览器窗口本身。而 `parent` 对象则始终指向当前窗口的父窗口。如果当前窗口是最上层窗口，则 `parent` 等于 `top`

还有一个 `self` 对象，它是终极的 `window` 属性

### 12.1.3 窗口位置与像素比

- `screenLeft` 表示窗口相对于屏幕左侧的位置
- `screenTop` 表示窗口相对于屏幕顶部的位置
- `moveTo()` 接收要移动到的新位置的绝对坐标 `x` 和 `y`
- `moveBy()` 接收相对当前位置在两个方向上移动的像素数

```js
// 把窗口移动到左上角
window.moveTo(0, 0);

// 把窗口当前的位置向下移动 100 像素
window.moveBy(0, 100);
```

依浏览器而定，以上方法可能会被部分或全部禁用