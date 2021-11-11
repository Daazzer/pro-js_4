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

### 24.1.2 HTTP 头部

默认情况下，XHR 请求会发送以下头部字段

- `Accept` 浏览器可以处理的内容类型
- `Accept-Charset` 浏览器可以显示的字符集
- `Accept-Encoding` 浏览器可以处理的压缩编码类型
- `Accept-Language` 浏览器使用的语言
- `Connection` 浏览器与服务器的连接类型
- `Cookie` 页面中设置的 Cookie
- `Host` 发送请求的页面所在的域
- `Referer` 发送请求的页面的 URI。注意，这个字段在 HTTP 规范中就拼错了，所以考虑到兼容性也必须将错就错。（正确的拼写应该是 Referrer）。
- `User-Agent` 浏览器的用户代理字符串

设置请求头的方法：

- `setRequestHeader()` 接收两个参数：头部字段的名称和值

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
xhr.open('get', 'example.php', true);
xhr.setRequestHeader('MyHeader', 'MyValue');
xhr.send(null);
```



获取响应头方法：

- `getResponseHeader()` 接收一个参数：头部的名称
- `getAllResponseHeaders()` 返回包含所有响应头部字符串

```js
const myHeader = xhr.getResponseHeader('MyHeader');
const allHeaders = xhr.getAllResponseHeaders();
```



### 24.1.3 GET 请求

查询字符串中的每个名和值都必须使用 `encodeURIComponet()` 编码

```js
xhr.open('get', 'example.php?name1=value1&name2=value2', true);
```

可以使用以下函数将查询字符串参数添加到现有的 URL 末尾

```js
function addURLParam(url, name, value) {
  url += (url.indexOf('?') == -1) ? '?' : '&';
  url += encodeURIComponent(name) + '=' + encodeURIComponet(value);
  return url;
}
```



### 24.1.4 POST 请求

每个 POST 请求都应该在请求体中携带提交的数据，而 GET 请求则不然

```js
xhr.open('post', 'example.php', true);
```



可以使用 XHR 模拟表单提交。

1. 把 `Content-Type` 头部设置为 `"application/x-www-formurlencoded"`
2. 创建对应格式的字符串



```js
function submitData() {
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

  xhr.open('post', 'postexample.php', true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  const form = document.getElementById('user-info');
  xhr.send(serialize(form));
}
```



postexample.php 随后可以通过 `$_POST` 取得 POST 的数据

```php
<?php
  header("Content-Type: text/plain");
	echo <<<EOF
Name: {$_POST['user-name']}
Email: {$_POST['user-email']}
EOF;
?>
```

