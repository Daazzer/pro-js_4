# 第 12 章 BOM

浏览器对象模型(BOM, Browser Object Model)提供了与网页无关的浏览器功能对象

## 12.1 window 对象

BOM 的核心是 `window` 对象。`window` 对象在浏览器中有两重身份，一个是 ECMAScript 中的 `Global` 对象，另一个就是浏览器窗口的 JavaScript 接口

> **注意** 很多浏览器 API 都以 `window` 对象属性的形式暴露出来