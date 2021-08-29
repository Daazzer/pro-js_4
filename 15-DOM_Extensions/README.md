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