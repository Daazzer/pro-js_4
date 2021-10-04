# 第 19 章 表单脚本

JavaScript 较早的一个用途是承担一部分服务器表单处理的责任，既做表单验证，又用于增强标准表单控件的默认行为

## 19.1 表单基础

在 HTML 中以 `<form>` 表示，在 JavaScript 中以 `HTMLFormElement` 类型表示，继承自 `HTMLElement` 类型

`HTMLFormElement`  属性与方法

- `acceptCharset` 服务器可以接受的字符集，等价于 HTML 的 `accept-charset` 属性
- `action` 请求的 URL，等价于 HTML 的 `action` 属性
- `elements` 表单中所有控件的 `HTMLCollection`
- `enctype` 请求的编码类型，等价于 HTML 的 `enctype` 属性
- `length` 表单中控件的数量
- `method` HTTP 请求的方法类型，通常是 `"get"` 或 `"post"`，等价于 HTML 的 `method` 属性
- `name` 表单的名字，等价于 HTML 的 `name` 属性
- `reset()` 把表单字段重置为各自的默认值
- `submit()` 提交表单
- `target` 用于发送请求和接收响应的窗口名字，等价于 HTML 的 `target` 属性

获取 `<form>` 元素引用的几种方式：

- 使用 `getElementById()`

  ```js
  const form = document.getElementById('form1');
  ```

- 使用 `document.forms` 集合，可以获取页面上所有表单元素。然后可以进一步使用数字索引或表单的名字 `name` 来访问特定的表单

  ```js
  // 取得页面第一个表单
  const firstForm = document.forms[0];
  
  // 取得名字为 form2 的表单
  const myForm = document.forms.form2;  // 也可以通过 document.form2 访问，但是不推荐
  ```




### 19.1.1 提交表单

提交按钮可以使用 `type` 属性为 `"submit"` 的 `<input>` 或 `<button>` 元素定义，图片按钮可以使用 `type` 属性为 `"image"` 的 `<input>` 元素定义。

```html
<!-- 通用提交按钮 -->
<input type="submit" value="Submit Form">

<!-- 自定义按钮提交 -->
<button type="submit">Submit Form</button>

<!-- 图片按钮 -->
<input type="image" src="graphic.gif">
```



如果表单中有上述任何一个按钮，且焦点在表单中某个控件上，则按回车键也可以提交表单

以这种方式提交表单会在向服务器发送请求之前触发 `submit` 事件。阻止这个事件默认行为可以取消表单提交

```js
const form = document.getElementById('myForm');

form.addEventListener('submit', event => {
  // 阻止表单提交
  event.preventDefault();
});
```



也可以调用 `submit()` 方法提交表单，此方法不会触发 `submit` 事件

```js
const form = document.getElementById('myForm');

// 提交表单
form.submit();
```



### 19.1.2 重置表单

重置按钮可以用 `type` 为 `"reset"` 的 `<input>` 或 `<button>` 元素来创建

表单重置后，所有表单字段都会重置回页面第一次渲染时各自拥有的值

单击重置按钮会触发 `reset` 事件

阻止重置表单示例

```js
const form = document.getElementById('myForm');

form.addEventListener('reset', event => {
  event.preventDefault();
});
```



调用 `reset()` 方法重置表单

```js
const form = document.getElementById('myForm');

form.reset();
```



> **注意** 在实际开发中，不推荐使用重置表单功能，因为会使用户感到厌烦

