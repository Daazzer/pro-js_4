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

### 19.1.3 表单字段

所有表单元素都是表单 `elements` 属性（元素集合）中包含的一个值。这个 `elements` 集合是一个有序列表，包含表单中所有字段的引用，包括 `<input>`、`<textarea>`、`<button>`、`<select>` 和 `<fieldset>` 元素，可以通过索引或 `name` 属性来访问

```js
const form = document.getElementById('form1');

// 取得表单中的第一个字段
const field1 = form.elements[0];

// 取得表单中名为"textbox"的字段
const field2 = form.elements.textbox1;

// 取得字段的数量
const fieldCount = form.elements.length;
```



如果多个表单控件使用了同一个 `name`，则会返回包含所有同名元素的 `HTMLCollection`

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>表单字段</title>
  </head>
  <body>
    <form action="" id="myForm" method="post">
      <ul>
        <li><input type="radio" name="color" value="red">Red</li>
        <li><input type="radio" name="color" value="green">Green</li>
        <li><input type="radio" name="color" value="blue">Blue</li>
      </ul>
    </form>

    <script>
      const form = document.getElementById('myForm');

      const colorFields = form.elements.color;

      console.log(colorFields.length);  // 3

      const firstColorField = colorFields[0];
      const firstFormField = form.elements[0];
      console.log(firstColorField === firstFormField);  // true
    </script>
  </body>
</html>
```



#### 1.表单字段的公共属性

除 `<fieldset>` 元素以外，所有表单字段都有一组同样的属性。

- `disabled` 布尔值，表示表单字段是否禁用
- `form` 指针，指向表单字段所属的表单。这个属性是只读的
- `name` 字符串，这个字段的名字
- `readOnly` 布尔值，表示这个字段是否只读
- `tabIndex` 数值，表示这个字段在按 Tab 键时的切换顺序
- `type` 字符串，表示字段类型，如 `"checkbox"`、`"radio"` 等
- `value` 要提交给服务器的字段值。对文件输入字段来说，这个属性是只读的，仅包含计算机上某个文件的路径

#### 2.表单字段的公共方法

- `focus()` 把浏览器焦点设置到表单字段，这意味着该字段会变成活动字段并可以响应键盘事件。
- `blur()` 将焦点从某个字段上移除

#### 3.表单字段的公共事件

- `blur` 在字段失去焦点时触发
- `change` 在 `<input>` 和 `<textarea>` 元素的 `value` 发生变化且失去焦点时触发，或者在 `<select>` 元素中选中项发生变化时触发
- `focus` 在字段获得焦点时触发

## 19.2 文本框编程

两种表示文本框的方式：

- 单行 `<input>` 元素
  - `type` 属性，默认是 `text`
  - `size` 属性，指定文本框宽度
  - `value` 属性，指定文本框的初始值
  - `maxLength` 属性，指定文本框允许最多字符数
- 多行 `<textarea>` 元素
  - `rows` 属性，指定这个文本框的高度，以字符数计量
  - `cols` 属性，指定以字符数计量的文本框宽度
  - `size` 属性，指定文本框宽度

### 19.2.1 选择文本

两种文本框都支持：

- `select()` 方法，用于全选文本框中的文本

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>选择文本</title>
  </head>
  <body>
    <form action="" name="myForm1">
      <textarea name="textbox1" id="textbox1" cols="30" rows="10">
        csacscsacsacsac
        csacacascascascsaca
        csacascascsa
      </textarea>
    </form>
    <script>
      const textbox1 = document.forms.myForm1.elements.textbox1;

      textbox1.addEventListener('focus', event => {
        event.target.select();
      });
    </script>
  </body>
</html>
```



#### 1.select 事件

当选中文本框中的文本是，会触发 `select` 事件

#### 2.取得选中文本

HTML5 文本框添加的两个属性：

- `selectionStart` 表示文本选区的起点偏移量（从 0 开始）
- `selectionEnd` 表示文本选区的终点偏移量（从 0 开始）

老 IE 中有一个包含整个文档选择信息的 `document.selection` 对象

```js
function getSelectedText(textbox) {
  if (typeof textbox.selectionStart === 'number') {
    return textbox.value.substring(textbox.selectionStart, textbox.selectionEnd);
  } else if (document.selection) {
    return document.selection.createRange().text;
  }
}
```



#### 3.部分选中文本

- `setSelectionRange()` 方法，接收两个参数，要选择的第一个字符的索引和停止选择的字符索引

```js
textbox.value = 'Hello world!';

// 选择所有文本
textbox.setSelectionRange(0, textbox.value.length);  // "Hello world!"

// 选择前 3 个字符
textbox.setSelectionRange(0, 3);  // "Hel"

// 选择第 4~6 个字符
textbox.setSelectionRange(4, 7);  // "o w"
```



IE 8 及更早

- `createTextRange()` 创建一个范围
- `moveStart()` 把范围放到起点
- `moveEnd()` 把范围放到终点

### 19.2.2 输入过滤

不同文本框经常需要保证输入特定类型或格式的数据

#### 1.屏蔽字符

输入事件

- `keypress` 事件

只允许输入数字代码

```js
textbox.addEventListener('keypress', event => {
  if (!/\d/.test(String.fromCharCode(event.charCode))) {
    event.preventDefault();
  }
});
```
