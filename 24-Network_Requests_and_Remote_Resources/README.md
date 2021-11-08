# 第 24 章 网络请求与远程资源

Ajax (Asynchronous JavaScript+XML，及异步 JavaScript 加 XML)。这个技术涉及发送服务器请求额外数据而不刷新页面，从而实现更好的用户体验。

关键技术是 `XMLHttpRequest` (XHR) 对象。这个接口可以实现异步从服务器获取额外数据

XHR 对象 API 被普遍认为比较难用，而 Fetch API 后台成了替代工具。支持期约 (promise) 和服务线程 (service worker)

> **注意** 在实际开发中，应该尽可能使用 `fetch()`

## 24.1 XMLHttpRequest 对象

所有现代浏览器通过 `XMLHttpRequest` 构造函数原生支持 XHR 对象：

```js
const xhr = new XMLHttpRequest();
```

