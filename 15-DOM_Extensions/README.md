# 第 15 章 DOM 扩展

DOM 扩展的两个标准：Selectors API 与 HTML5，还有较小的 Element Traversal 规范

## 15.1 Selectors API

- Selectors API Level 1 核心方法：`querySelector()` 和 `querySelectorAll()`，`Document` 和 `Element` 类型都暴露此方法
- Selectors API Level 2 ：`matches()`、`find()`、`findAll()`

### 15.1.1 querySelector()

接收 CSS 选择符参数，返回匹配该模式的第一个后代元素，如果没有匹配到则返回 `null`

在 `Document` 上使用时会从文档元素开始搜索；在 `Element` 上使用时，则只会从当前元素的后代中查询

```js
const selected = document.querySelector('.selected');

const img = document.body.querySelector('img.button');
```

如果选择符有语法错误或碰到不支持的选择符，则 `querySelector()` 方法会抛出错误

### 15.1.2 querySelectorAll()

`querySelectorAll()` 接收一个查询的参数，会返回一个 `NodeList` 的静态实例，避免了使用 `NodeList` 对象可能造成的性能问题

如果没有匹配项，则返回空的 `NodeList` 实例

与 `querySelector()` 一样，也可以在 `Document`、`DocumentFragment`、`Element` 类型上使用

遇到的选择符有语法错误的或不支持的，则会报错

### 15.1.3 mathces()

`mathces()` 接收一个 CSS 选择符参数，如果元素匹配则选择符返回 `true`，否则返回 `false`

## 15.2 元素遍历

Element Traversal API 为 DOM 元素添加了 5 个属性：

- `childElementCount` 返回子元素数量（不包含文本节点和注释）
- `firstElementChild` 指向第一个 `Element` 类型的子元素（`Element` 版 `firstChild`）
- `lastElementChild` 指向最后一个 `Element` 类型 的子元素（`Element` 版 `lastChild`）
- `previousElementSibling` 指向前一个 `Element` 类型的同胞元素（`Element` 版 `previousSibling`）
- `nextElementSibling` 指向后一个 `Element` 类型的同胞元素（`Element` 版 `nextSibling`）

以上属性就可以在开发时节省了节点类型判断的代码

## 15.3 HTML5

HTML5 包含了与标记相关的大量 JavaScript API 定义

### 15.3.1 CSS 类扩展

HTML5 新增了一些特性以方便使用 CSS 类

#### 1.getElementByClassName()

`getElementByClassName()` 接收一个参数，即包含一个或多个类名的字符串，返回类名中包含相应类的元素的 `NodeList`

这个方法只会返回以调用它的对象为根元素的子树中所有匹配的元素，返回一个动态 `NodeList`

#### 2.classList 属性

`classList` 是一个新的集合类型 `DOMTokenList` 的实例。

属性

- `length` 表示有多少个类名

方法

- `item()` 取得元素
- `add(value)` 向类名列表添加指定的字符串值 `value`，如果这个值已存在，则什么也不做
- `contains(value)` 返回布尔值，表示给定的 `value` 是否存在
- `remove(value)` 从类名列表中删除指定的字符串值 `value`
- `toggle(value)` 如果类名列表中已存在指定的 `value` ，则删除；如果不存在，则添加

除非是完全重写 `class` 属性，否则 `className` 属性用不到了

### 15.3.2 焦点管理

- `document.activeElement` 包含当前拥有焦点的 DOM 元素，默认情况下，在页面加载完成之后会设置为 `document.body`。而在页面完全加载之前，是 `null`
- `document.hasFocus()` 方法，返回布尔值，表示文档是否拥有焦点

主要应用于无障碍使用

### 15.3.3 HTMLDocument 扩展

#### 1.readyState 属性

`document.readyState` 属性有两个可能的值

- `loading` 表示文档正在加载
- `complete` 表示文档加载完成

通常要依赖 `onload` 事件处理程序设置一个标记，表示文档加载完毕了

#### 2.compatMode 属性

`document.compatMode` 这个属性唯一的任务就是指示浏览器当前处于什么渲染模式

- 标准模式，值为 `CSS1Compat`
- 混杂模式下，值为 `BackCompat`

#### 3.head 属性

`document.head` 属性指向文档的 `<head>` 元素

### 15.3.4 字符集属性

`document.characterSet` 属性表示文档实际使用的字符集。默认值是 `"UTF-16"`，但是也可以通过 `<meta>` 元素或响应头以及新增的 `characterSet` 属性来修改

### 15.3.5 自定义数据属性

HTML5 允许给元素定义非标准的属性，但要使用前缀 `data-` 以便告诉浏览器，这些属性既不包含与渲染有关的信息，也不包含元素的语义信息，`data-` 后面跟什么都可以

```html
<div id="myDiv" data-appId="12345" data-myname="Nicholas"></div>
```

定义了自定义数据属性以后，可以通过元素的 `dataset` 属性来访问。`dataset` 属性是一个 `DOMStringMap` 实例，包含一组键/值对映射

```js
const div = document.getElementById('myDiv');

const appId = div.dataset.appId;
const myName = div.dataset.myname;

// 设置自定义数据属性的值
div.dataset.appId = 23456;
div.dataset.myname = "Michael";
```

### 15.3.6 插入标记

直接向文档中插入一个 HTML 字符串

#### 1.innerHTML 属性

读取 `innerHTML` 属性时，会返回元素所有后代的 HTML 字符串，包括元素、注释和文本节点。而在写入 `innerHTML` 时，则会根据提供的字符串值以新的 DOM 子树替代元素中原来包含的所有节点

如果赋值中不包含任何 HTML 标签，则直接生成一个文本节点

```js
div.innerHTML = 'Hello world!';
```

设置 `innerHTML` 属性后，页面返回的字符串是将原始字符串对应的 DOM 子树序列化之后的结果

#### 2.旧 IE 中的 innerHTML

现代浏览器中，通过 `innerHTML` 插入的 `<script>` 标签是不会执行的。如要需要可执行，则必须在 `<script>` 前面加上一个受控元素。而在 IE8 及之前的版本中，只要插入的 `<script>` 指定了 `defer` 属性，且 `<script>` 之前是 “受控元素”（scoped element），那就是可执行的

```js
div.innerHTML = '_<script defer>console.log(\'hi\');<\/script>';
div.innerHTML = '<div>&nbsp;</div><script defer>console.log(\'hi\');<\/script>';
div.innerHTML = '<input type=\"hidden\"><script defer>console.log(\'hi\');<\/script>';
```

在 IE 中，通过 `innerHTML` 插入 `<style>` 也会有类似的问题

#### 3.outerHTML 属性

读取 `outerHTML` 属性，会返回调用它的元素（及所有后代元素）的 HTML  字符串

写入 `outerHTML` 属性时，则调用它的元素及整个后代元素都被取代

#### 4.insertAdjacentHTML() 与 insertAdjacentText()

它们都接收两个参数：要插入标记的位置和要插入的 HTML 或文本。

第一个参数的枚举值

- `"beforebegin"` 插入当前元素前面，作为前一个同胞节点
- `"afterbegin"` 插入当前元素内部，作为新子节点或放在第一个子节点前面
- `"beforeend"` 插入当前元素内部，作为新子节点或放在最后一个子节点前面
- `"afterend"` 插入当前元素后面，作为下一个同胞节点

```js
element.insertAdjacentHTML('beforebegin', '<p>Hello world!</p>');
element.insertAdjacentText('beforebegin', 'Hello world!');
```

#### 5.内存与性能问题

如果被移除的子树元素中之前有关联的事件处理程序或其他 JavaScript 对象，那他们之间的绑定关系会滞留在内存中。如果这种替换操作频繁发生，页面的内存占用就会持续攀升。最好限制使用 `innerHTML` 和 `outerHTML` 的次数

```js
// 不直接设置 innerHTML 的循环操作
let itemsHtml = '';
for (let value of values) {
  itemsHtml += `<li>${value}</li>`;
}
ul.innerHTML = itemsHtml;

// 或者
ul.innerHTML = values.map(value => `<li>${value}</li>`).join('');
```

#### 6.跨站点脚本

虽然 `innerHTML` 使用方便，但是很容易受到 XSS 攻击。一定要隔离插入的数据。使用相关的库给它们转义
