# 第 14 章 DOM

文档对象模型（DOM，Document Object Model）是 HTML 和 XML 文档的编程接口

DOM Level 1 在 1998 年成为 W3C 推荐标准

> IE8 以下中的 DOM 是通过 COM 对象实现的。意味着与原生 JavaScript 对象具有不同的行为和功能

## 14.1 节点层级

`document` 表示每个文档的根节点。根节点的唯一子节点是 `<html>` 元素，我们称之为**文档元素**（`documentElement`）

每个文档只能有一个文档元素

- HTML 文档元素始终都是 `<html>`
- XML 任何文档元素都可能成为文档元素

DOM 中共有 12 种节点类型