# 第 17 章 事件

JavaScript 与 HTML 交互是通过**事件**实现的

可以使用仅在事件发生时执行的**监听器**（也叫处理程序）订阅事件。在传统软件工程领域，这个模型叫“观察者模式”

[`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event)

## 17.1 事件流

**事件流**描述了页面接收事件的顺序

- 事件冒泡流
- 事件捕获流

### 17.1.1 事件冒泡

IE 事件流被称为**事件冒泡**，事件被定义为从最具体的元素（文档树中最深的节点）开始出发，然后向上传播至没有那么具体的元素（文档）

![图17-1](./i/17-1.svg)

### 17.1.2 事件捕获

Netscape Communicator 团队提出的**事件捕获流**。是最不具体的节点应该最先接受到事件，而最具体的节点应该最后接收到事件

![图17-2](./i/17-2.svg)

### 17.1.3 DOM 事件流

DOM2 Events 规范规定事件流分为 3 个阶段：

- 事件捕获
- 到达目标
- 事件冒泡

![图17-3](./i/17-3.svg)

## 17.2 事件处理程序

为响应事件而调用的函数被称为**事件处理程序**(或**事件监听器**)。名字以 `on` 开头，例如 `click` 事件的处理程序叫 `onclick`

### 17.2.1 HTML 事件处理程序

HTML 属性形式来指定事件处理程序

```html
<input type="button" value="Click Me" onclick="console.log('Clicked')" />
```

也可以调用页面其他地方定义的脚本

```html
<script>
  function showMessage() {
    console.log('Hello world!');
  }
</script>
<input type="button" value="Click Me" onclick="showMessage()" />
```

这个函数有一个特殊的局部变量 `event`，其中保存的就是 `event` 对象

```html
<!-- 输出 "click" -->
<input type="button" value="Click Me" onclick="console.log(event.type)" />
```

使用 HTML 指定时间会导致 HTML 与 JavaScript 强耦合

### 17.2.2 DOM0 事件处理程序

每个元素（包括 `window`、`document`）都有小写的事件处理程序属性，如 `onclick` ，只要把这个属性赋值为一个函数

```js
const btn = document.getElementById('myBtn');
btn.onclick = function() {
  console.log('Clicked');
};
```

事件处理程序会在元素的作用域中执行

```js
const btn = document.getElementById('myBtn');
btn.onclick = function() {
  console.log(this.id);  // "myBtn"
};

// 移除事件处理程序
btn.onclick = null;
```

### 17.2.3 DOM2 事件处理程序

接收3个参数：事件名、事件处理函数、一个布尔值，`true` 表示在捕获阶段调用事件处理程序，`false` (默认值) 表示在冒泡阶段调用事件处理程序

- `addEventListener()`
- `removeEventListener()`

```js
const btn = document.getElementById('myBtn');
btn.addEventListener('click', function() {
  console.log(this.id);  // "myBtn"
}, false);
```

使用 DOM2 事件处理程序的优势是可以为同一个事件添加多个处理程序

```js
const btn = document.getElementById('myBtn');
btn.addEventListener('click', function() {
  console.log(this.id);
}, false);
btn.addEventListener('click', () => {
  console.log('Hello world!');
}, false);
```

`removeEventListener()` 无法移除 `addEventListener()` 添加的匿名函数，只能移除具名函数

```js
const btn = document.getElementById('myBtn');
function handler() {
	console.log(this.id);
}
btn.addEventListener('click', handler, false);
btn.removeEventListener('click', handler, false);
```

### 17.2.4 IE 事件处理程序

两个方法接受两个同样的参数：事件处理程序的名字和事件处理函数

- `attachEvent()`
- `detachEvent()`

```js
var btn = document.getElementById('myBtn');
btn.attachEvent('onclick', function() {
  console.log('Clicked');
});
```

使用 `attachEvent()` 时，事件处理程序是在全局作用域中运行

```js
var btn = document.getElementById('myBtn');
btn.attachEvent('onclick', function() {
  console.log(this === window);  // true
});
```

`attachEvent()` 同样可以绑定多个处理程序，但是会以添加它们的顺序反向触发

`detachEvent()` 同样不能移除匿名函数，可以移除具名函数

```js
var btn = document.getElementById('myBtn');
function handler() {
	console.log('Clicked');
}
btn.attachEvent('onclick', handler);
btn.detachEvent('onclick', handler);
```

### 17.2.5 跨浏览器事件处理程序

兼容DOM0、DOM2、IE 事件处理程序

```js
var EventUtil = {
  addHandler: function(element, type, handler) {
    if (element.addEventListener) {
      element.addEventListener(type, handler, false);
    } else if (element.attachEvent) {
      element.attachEvent('on' + type, handler);
    } else {
      element['on' + type] = handler;
    }
  },
  
 	removeHandler: function(element, type, handler) {
    if (element.removeEventListener) {
      element.removeEventListener(type, handler, false);
    } else if (element.detachEvent) {
      element.detachEvent('on' + type, handler);
    } else {
      element['on' + type] = null;
    }
  }
};
```

## 17.3 事件对象

在 DOM 中发生事件时，所有相关信息都会被收集并存储在一个名为 `event` 的对象中

### 17.3.1 DOM 事件对象

`event` 对象是传给事件处理程序的唯一参数。

```js
const btn = document.getElementById('myBtn');
btn.onclick = function(event) {
  console.log(event.type);  // "click"
};

btn.addEventListener('click', event => {
  console.log(event.type);  // "click"
}, false);
```

在事件处理程序内部，`this` 对象始终等于 `currentTarget` 的值，而 `target` 只包含事件的实际目标（也就是事件传播阶段的目标），常用于**事件委托**

`preventDefault()` 方法用于阻止特定事件的默认动作。比如，链接的默认行为就是在被单击时导航到 `href` 属性指定的 URL

```js
const link = document.getElementById('myLink');
link.onclick = function(event) {
  event.preventDefault();
};
```

`stopPropagation()` 方法用于立即阻止事件流在 DOM 结构中传播，取消后续的事件捕获或冒泡

`eventPhase` 属性可用于确定事件流当前所处的阶段

### 17.3.2 IE 事件对象

IE 事件对象可以基于事件处理程序被指定的方式以不同方式来访问

如果使用 DOM0 事件处理程序，则 `event` 对象只是 `window` 对象的一个属性

```js
var btn = document.getElementById('myBtn');
btn.onclick = function() {
  var event = window.event;
  console.log(event.type);  // "click"
};
```

`attachEvent()` 指定的，则 `event` 对象会作为唯一的参数传给处理函数

```js
var btn = document.getElementById('myBtn');
btn.attachEvent('onclick', function(event) {
  console.log(event.type);  // "click"
});
```

HTML 属性指定的事件可以通过 `event` 变量访问

```html
<input type="button" value="Click Me" onclick="console.log(event.type)" />
```

`returnValue` 设置为 `false` 可以取消事件默认行为

```js
var link = document.getElementById('myLink');
link.onclick = function() {
  window.event.returnValue = false;
};
```

### 17.3.3 跨浏览器事件对象

```js
var EventUtil = {
  addHandler: function(element, type, handler) {
    if (element.addEventListener) {
      element.addEventListener(type, handler, false);
    } else if (element.attachEvent) {
      element.attachEvent('on' + type, handler);
    } else {
      element['on' + type] = handler;
    }
  },
  
  getEvent: function(event) {
    return event ? event : window.event;
  },
  
  getTarget: function(event) {
    return event.target || event.srcElement;
  },
  
  preventDefault: function(event) {
    if (event.preventDefault) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
  },
  
 	removeHandler: function(element, type, handler) {
    if (element.removeEventListener) {
      element.removeEventListener(type, handler, false);
    } else if (element.detachEvent) {
      element.detachEvent('on' + type, handler);
    } else {
      element['on' + type] = null;
    }
  },
  
  stopPropagation: function(event) {
    if (event.stopPropagation) {
      event.stopPropagation();
    } else {
      event.cancelBubble = true;
    }
  }
};
```



## 17.4 事件类型

DOM3 Event 定义了如下事件类型

- **用户界面事件**（[`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent)）：设计与 BOM 交互的通用浏览器事件
- **焦点事件**（[`FocusEvent`](https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent)）：在元素获得和失去焦点时触发
- **鼠标事件**（[`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent)）：使用鼠标在页面上执行某些操作时触发
- **滚轮事件**（[`WheelEvent`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent)）：使用鼠标滚轮（或类似设备）时触发
- **输入事件**（[`InputEvent`](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent)）：向文档中输入文本时触发
- **键盘事件**（[`KeyboardEvent`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent)）：使用键盘在页面上执行某些操作时触发
- **合成事件**（[`CompositionEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent)）：在使用某种 IME（Input Method Editor，输入法编辑器）输入字符时触发

### 17.4.1 用户界面事件

UI 事件类型

- `DOMActive` 在 DOM3 Event 中废弃
- `load`
- `unload`
- `abort`
- `error`
- `select`
- `resize`
- `scroll`

#### 1.load 事件

- `window` 对象上，`load` 事件会在整个页面（包括所有外部资源）加载完成后触发
- `<body>` 元素上，元素加载完成时触发
- `<img>` 图片加载完成时触发，也可以在 DOM0 的 `Image` 类型实例上添加
- `<script>` JavaScript 文件加载完成时触发
- `<link>` 样式表加载完成时触发

#### 2.unload 事件

会在文档卸载完成后触发。一般是从一个页面跳到另外一个页面触发

- `window`
- `<body>`

#### 3.resize 事件

浏览器窗口被缩放到新高度或宽度时，会触发 `resize` 事件

- `window`
- `<body>`

#### 4.scroll 事件

文档滚动时触发

### 17.4.2 焦点事件

- `blur`
- `DOMFocusIn` DOM3 Event 废弃了
- `DOMFocusOut` DOM3 Event 废弃了
- `focus`
- `focusin`
- `focusout`

### 17.4.3 鼠标和滚轮事件

DOM3 Events 定义的鼠标事件

- `click`
- `dbclick`
- `mousedown`
- `mouseenter`
- `mouseleave`
- `mousemove`
- `mouseout`
- `mouseover`
- `mouseup`

#### 1.客户端坐标

浏览器视口中的坐标

- `event.clientX`
- `event.clientY`

```js
const div = document.getElementById('myDiv');
div.addEventListener('click', event => {
  console.log(`Client coordinates: ${event.clientX}, ${event.clientY}`);
});
```

#### 2.页面坐标

光标在文档页中的坐标，而非视口

- `event.pageX`
- `event.pageY`

```js
const div = document.getElementById('myDiv');
div.addEventListener('click', event => {
  console.log(`Page coordinates: ${event.pageX}, ${event.pageY}`);
});
```

#### 3.屏幕坐标

光标在整个屏幕中的坐标

- `event.screenX`
- `event.screenY`

```js
const div = document.getElementById('myDiv');
div.addEventListener('click', event => {
  console.log(`Screen coordinates: ${event.screenX}, ${event.screenY}`);
});
```

#### 4.修饰键

键盘上的**修饰键** Shift、Ctrl、Alt、Meta

4个属性表示这几个修饰键的状态，`true` 为按下，`false` 为没按下

- `event.shiftKey`
- `event.ctrlKey`
- `event.altKey`
- `event.metaKey`

#### 5.相关元素

- `event.relatedTarget` 属性提供了相关元素信息，`mouseover` 和 `mouseout` 发生时才包含值

#### 6.鼠标按键

- `event.button` 定义了3个值
  - `0` 表示鼠标主键
  - `1` 表示鼠标中键
  - `2` 表示鼠标副键

#### 7.额外事件信息

- `event.detail`

#### 8.mousewheel 事件

在用户使用鼠标滚轮时触发

- `event.wheelDelta` 表示滚动的方向

#### 9.触摸屏幕设备

不支持 `dbclick`

#### 10.无障碍问题

使用 `click` 事件执行代码

屏幕阅读器无法触发 `mousedown`、`dbclick` 事件

### 17.4.4 键盘与输入事件

**键盘事件**是用户操作键盘时触发

- `keydown`
- `keypress` DOM3 Event 废弃，推荐使用 `textInput` 事件
- `keyup`

#### 1.键码

对于 `keydown` 与 `keyup`

- `event.keyCode` 属性会保存一个键码

#### 2.字符编码

`keypress` 触发时

- `event.charCode`

#### 3.DOM3 的变化

- `event.key`
- `event.code`
- `event.keyIdentifier` Safari、Chrome 支持，不建议使用
- `event.keyLocation` 兼容性差
- `event.location` 兼容性差

#### 4.textInput 事件

在字符被输入到可编辑区域时触发

- `event.data`
- `event.inputMethod`

#### 5.设备上的键盘事件

任天堂 Wii 遥控器会触发键盘事件

### 17.4.5 合成事件

通常用于处理 IME 输入是的复杂输入序列。也就是类似于调用输入法之类的软件触发的事件

- `compositionstart`
- `compositionupdate`
- `compositionend`

```js
const textBox = document.getElementById('myText');
textBox.addEventListener('compostionstart', event => {
  console.log(event.data);
});
textBox.addEventListener('compostionupdate', event => {
  console.log(event.data);
});
textBox.addEventListener('compostionend', event => {
  console.log(event.data);
});
```

### 17.4.6 变化事件

DOM2 的**变化事件**（Mutation Events）目前已被废弃，被 Mutation Observers 所取代

### 17.4.7 HTML5 事件

DOM 规范并未涵盖浏览器都支持的所有事件

#### 1.contextmenu 事件

在 Windows 上右击鼠标展开上下文菜单触发

在 Mac 上 Ctrl+单击 触发

#### 2.beforeunload 事件

在页面即将从浏览器卸载时触发。这个事件会向用户显示一个确认框，请求用户确认是希望关闭页面，还是继续留在页面上

```js
window.addEventListener('beforeunload', event => {
  const message = 'I\'m really going to miss you if you go.';
  event.returnValue = message;
  return message;  // 提示信息作为函数值返回
});
```

#### 3.DOMContentLoaded 事件

会在 DOM 树构建完成后立即触发，而不用等待图片、JavaScript 文件、CSS 文件或其他资源加载完成

#### 4.readystatechange 事件

文档加载时触发，并提供加载状态信息，但是行为不太稳定。支持 `readystatechange` 事件的每个对象都有一个 `readyState` 属性表示所处的阶段

#### 5.pageshow 和 pagehide 事件

- `pageshow` 页面显示时触发，会在 `load` 事件之后触发
  - `event.persisted` 页面是否存储在往返缓存，布尔值
- `pagehide` 在页面从浏览器卸载后触发，在 `unload` 事件之前触发
  - `event.persisted` 是否在往返缓存中加载的，布尔值

#### 6.hashchange 事件

URL 散列值（URL最后 `#` 后面的部分）发生变化时触发，必须添加给 `window`

- `event.oldURL` 变化前的 URL
- `event.newURL` 变化后的 URL

### 17.4.8 设备事件

可以用于确定用户使用设备的方式

#### 1.orientationchange 事件

设备的屏幕方向变化时触发

`window.orientation` 表示设备是垂直模式还是水平模式

```js
window.addEventListener('load', event => {
  let div = document.getElementById('myDiv');
  div.innerHTML = 'Current orientation is ' + window.orientation;

  window.addEventListener('orientationchange', event => {
    div.innerHTML = 'Current orientation is ' + window.orientation;
  });
});
```



#### 2.deviceorientation 事件

设备方向传感器输出新数据的时候触发（设备朝向）

- `event.alpha` 0~360 表示设备围绕 z 轴旋转时 y 轴的度数 （左右转）
- `event.beta` -180~180 表示设备围绕 x 轴旋转时 z 轴的度数 （前后转）
- `event.gamma`  -90~90 表示设备围绕 y 轴旋转时 z 轴的度数 （扭转）
- `event.absolute` 布尔值，表示设备是否返回绝对值
- `event.compassCalibrated` 布尔值，表示设备的指南针是否正确校准

#### 3.devicemotion 事件

设备移动的时候触发

`event` 属性

- `acceleration`
- `accelerationIncludingGravity`
- `interval`
- `rotationRate`

### 17.4.9 触摸及手势事件

设备上的事件

#### 1.触摸事件

当手指放在屏幕上、在屏幕上滑动或从屏幕上移开就会触发

- `touchstart`
- `touchmove`
- `touchend`
- `touchcancel`

#### 2.手势事件

手指触碰屏幕且相对距离或旋转角度变化时触发

- `gesturestart`
- `gesturechange`
- `gestureend`

### 17.4.10 事件参考

[Event](https://developer.mozilla.org/en-US/docs/Web/API/Event)

[EventTarget](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget)

## 17.5 内存与性能

控制页面事件处理程序的数量

### 17.5.1 事件委托

事件委托利用事件冒泡

```html
<ul id="myLinks">
  <li id="goSomewhere">Go somewhere</li>
  <li id="doSomething">Do something</li>
  <li id="sayHi">Say hi</li>
</ul>
<script>
	const list = document.getElementById('myLinks');
  list.addEventListener('click', event => {
    const target = event.target;
    switch(target.id) {
      case 'doSomething':
        document.title = 'I change the document\'s title';
        break;
      case 'goSomewhere':
        location.href = 'http://www.wrox.com';
        break;
      case 'sayHi':
        console.log('hi');
        break;
    }
  });
</script>
```



### 17.5.2 删除事件处理程序

```html
<div id="myDiv">
  <input type="button" value="Click Me" id="myBtn">
</div>
<script type="text/javascript">
	const btn = document.getElementById('myBtn');
  btn.onclick = function() {
    btn.onclick = null;  // 删除事件处理程序
    document.getElementById('myDiv').innerHTML = 'Processing...';
  };
</script>
```



最好在 `onunload` 中删除事件处理程序

## 17.6 模拟事件

DOM3 规范指明了模拟特定类型事件的方式

### 17.6.1 DOM 事件模拟

`document.createEvent()` 可以创建一个 `event` 对象，此方法已被废弃，使用 [`CustomEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) 替代

#### 1.模拟鼠标事件

```js
const btn = document.getElementById('myBtn');

const event = document.createEvent('MouseEvents');

event.initMouseEvent('click', true, true, document.defaultView, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

btn.dispatchEvent(event);  // 触发事件
```

#### 2.模拟键盘事件

```js
const textBox = document.getElementById('myTextBox');
let event;

if (document.implementation.hasFeature('keyboardEvents'), '3.0') {
  event = document.createEvent('keyboardEvents');
  
  event.initKeyboardEvent('keydown', true, true, document.defaultView, 'a', 0, 'Shift', 0);
}

textBox.dispatchEvent(event);
```

#### 3.模拟其他事件

```js
const event = document.createEvent('HTMLEvents');
event.initEvent('focus', true, false);
target.dispatchEvent(event);
```

