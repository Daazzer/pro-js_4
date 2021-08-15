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

#### 像素比

CSS 像素是 Web 开发中使用的统一像素单位。这个单位的背后其实是一个角度：0.0213°。如果屏幕距离人眼是一臂长，则这个角度计算的 CSS 像素大小约为 1/96 英寸

物理像素与 CSS 像素之间的转换比率由 `window.devicePixelRatio` 属性提供，实际上与每英寸像素数（DPI，dots per inch）是对应的

例如：1920x1080 转换为 640x320 的设备，`window.devicePixelRatio` 的值就是 3

### 12.1.4 窗口大小

- `outerWidth` 返回浏览器自身宽度
- `outerHeight` 返回浏览器自身高度
- `innerWidth` 返回浏览器页面视口宽度（不包含浏览器边框和工具栏）
- `innerHeight` 返回浏览器页面视口高度（不包含浏览器边框和工具栏）

在移动设备上，`window.innerWidth` 和 `window.innerHeight` 返回视口的大小，也就是页面可视区域的大小，但是 `document.documentElement.clientWidth` 和 `document.documentElement.clientHeight` 中提供了相同的信息

- `resizeTo()` 将浏览器缩放到传入的参数的大小
- `resizeBy()` 将浏览器从当前大小再扩展缩放

与移动窗口方法一样，缩放窗口可能会被浏览器禁用

### 12.1.5 视口位置

- 度量文档相对于视口滚动距离的属性
  - `window.pageXOffset`/`window.scrollX`
  - `window.pageYOffset`/`window.scrollY`

- 滚动页面方法
  - `scroll()` 与 `scrollTo()` 效果一样
  - `scrollTo()`
  - `scrollBy()`

  三个方法都接收表示相对视口距离的 `x` 和 `y` 坐标

  ```js
  // 相对于当前视口向下滚动 100 像素
  window.scrollBy(0, 100);
  
  // 滚动到页面左上角
  window.scrollTo(0, 0);
  ```

  这几个方法都接收一个 `ScrollToOptions` 字典，还可以通过 `behavior` 属性告诉浏览器是否平滑滚动

  ```js
  // 正常滚动
  window.scrollTo({
      left: 100,
      top: 100,
      behavior: 'auto'
  });
  
  // 平滑滚动
  window.scrollTo({
      left: 100,
      top: 100,
      behavior: 'smooth'
  });
  ```

### 12.1.6 导航与打开新窗口

- `window.open()` 用于打开新浏览器窗口。接收4个参数，要加载的 URL、目标窗口、特性字符串、表示新窗口在浏览器历史记录中是否替代当前加载页面的布尔值

第二个参数如果是一个 `<iframe>` 的名字，则会在对应的 `<iframe>` 或窗格中打开 URL

第二个参数也可以是一个特殊的窗口名，比如 `_self`，`_parent`，`_top`，`_blank`

#### 1.弹出窗口

如果 `window.open()` 第二个参数不是已有窗口，则会打开一个新窗口或标签。第三个参数，即特性字符串，用于指定新窗口的配置

```js
window.open("http://www.wrox.com",
           "wroxWindow",
           "height=400,width=400,top=10,left=10,resizable=yes");
```

返回一个对新建窗口的引用

还可以用 `close()` 方法关闭新打开的窗口

```js
const wroxWin = window.open("http://www.wrox.com",
           "wroxWindow",
           "height=400,width=400,top=10,left=10,resizable=yes");
wroxWin.close();
```

`window.opener` 指向打开它的窗口

#### 2.安全限制

在网页加载过程中调用 `window.open()` 没有效果

#### 3.弹窗屏蔽程序

检测 `window.open()` 是否返回 `null` 就知道弹窗是否被屏蔽了

```js
let blocked = false;

try {
    let wroxWin = window.open("http://www.wrox.com", "_blank");
    if (wroxWin == null) {
        blocked = true
    }
} catch (ex) {
    blocked = true;
}
if (blocked) {
    alert("The popup was blocked");
}
```

### 12.1.7 定时器

- `setTimeout()` 在一定时间后执行某些代码

  - 返回一个表示该超时排期的数值 ID。这个超时 ID 是被排期执行代码的唯一标识符，可以用于取消该任务

- `setInterval()` 用于指定每隔一段时间执行某些代码

  - 返回一个循环定时 ID

- `clearTimeout()` 取消等待中的排期任务，传入超时 ID

  ```js
  // 设置超时任务
  let timeoutId = setTimeout(() => alert("Hello world!"), 1000);
  
  // 取消超时任务
  clearTimeout(timeoutId);
  ```

- `clearInterval()` 用于取消定时器，传入定时器 ID

  ```js
  let num = 0, intervalId = null;
  let max = 10;
  
  let incrementNumber = function() {
      num++;
      
      // 如果达到最大值，则取消定时器
      if (num == max) {
          clearInterval(intervalId);
      } else {
          alert("Done");
      }
  };
  ```

  使用 `setTimeout()` 实现，推荐做法

  ```js
  let num = 0;
  let max = 10;
  let incrementNumber = function() {
      num++;
  
      // 如果没有达到最大值，再设置一个超时任务
      if (num < max) {
          setTimeout(incrementNumber, 500);
      } else {
          alert("Done");
      }
  };
  
  setTimeout(incrementNumber, 500);
  ```

  在实践中很少用 `setInterval()`，不推荐使用

