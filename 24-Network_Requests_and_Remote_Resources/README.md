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



### 24.1.1 使用 XHR

XHR 实例**方法**

- `open()` 使用 XHR 对象首先调用此方法，接收 3 个参数：请求类型（`"get"`、`"post"` 等）、请求 URL，以及表示请求是否异步的布尔值
- `send()` 发送定义好的请求，接收一个参数，作为请求体发送的数据。如果不需要发送请求体，则必须传 `null`，能保证跨浏览器兼容
- `abort()` 在收到响应之前取消异步请求，调用这个方法后，XHR 对象会停止触发事件。中断请求后，应该取消对 XHR 对象的引用

> **注意** 只能访问同源 URL，如果访问跨源则会报安全错误



接收到响应后，XHR 对象的以下**属性**会被填充上数据

- `responseText` 作为响应体返回的文本
- `responseXML` 如果响应的内容类型是 `"text/xml"` 或 `"application/xml"`，那就是包含响应数据的 XML DOM 文档
- `status` 响应的 HTTP 状态码，一般来说，HTTP 状态码为 2xx 表示成功。304 表示资源未修改过，是从浏览器缓存中直接拿取的，建议使用
- `statusText` 响应的 HTTP 状态描述，不推荐使用这个，因为跨浏览器兼容不太好
- `readyState` 表示当前处在请求/响应过程的哪个阶段
  - `0` 未初始化（Uninitialized）。尚未调用 `open()` 方法
  - `1` 已打开（Open）。已调用 `open()` 方法，尚未调用 `send()` 方法
  - `2` 已发送（Sent）。已调用 `send()` 方法，尚未收到响应
  - `3` 接收中（Receiving）。已经收到部分响应
  - `4` 完成（Complete）。已经收到所有响应，可以使用了

```js
xhr.open('get', 'example.txt', false);  // 第二个参数表示从同源获取
xhr.send(null);

if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
  console.log(xhr.responseText);
} else {
  console.log('Request was unsuccessful ' + xhr.status);
}
```



XHR 对象**事件**

- `readystatechange` 事件，在 `xhr.readystate` 属性变化时触发

跨浏览器写法

```js
const xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
  if (xhr.readyState === 4) {
    if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
      console.log(xhr.responseText);
    } else {
      console.log('Request was unsuccessful ' + xhr.status);
    }
  }
};
xhr.open('get', 'example.txt', true);
xhr.send(null);
```



与其它事件处理器不同，`onreadystatechange` 事件处理程序不会接收到 `event` 对象。必须要用 XHR 对象本身来确定接下来做什么

