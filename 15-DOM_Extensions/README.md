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