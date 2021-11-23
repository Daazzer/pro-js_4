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



### 24.1.5 XMLHttpRequest Level 2

#### 1.FormData 类型

方法

- `append()` 接收两个参数：键和值，相当于表单字段名和该字段的值

```js
const data = new FormData();
data.append('name', 'Nicholas');
```



也可以将表单中的数据作为键/值对填充进去

```js
const data = new FormData(document.forms[0]);
```



直接传给 XHR 对象的 `send()` 方法

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

xhr.open('post', 'postexample.php', true);
const form = document.getElementById('user-info');
xhr.send(new FormData(form));
```



使用 `FormData` 的时候不需要另外设置请求头了。XHR 对象能够识别作为 `FormData` 实例的传入的数据并自动配置相应的头部

#### 2.超时

XHR 对象的 `timeout` 属性，用于表示发送请求后等待多少毫秒，如果响应不成功就中断请求。此时会触发 `timeout` 事件

```js
const xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
  if (xhr.readyState === 4) {
    try {
      if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
        console.log(xhr.responseText);
      } else {
        console.log('Request was unsuccessful ' + xhr.status);
      }
    } catch(ex) {
			// 假设由 ontimeout 处理
    }
  }
};

xhr.open('get', 'timeout.php', true);
xhr.timeout = 1000;  // 设置 1 秒超时
xhr.ontimeout = function() {
  console.log('Request did not return in a second.');
};
xhr.send(null);
```



#### 3.overrideMimeType() 方法

`overrideMimeType()` 方法用于重写 XHR 响应的 MIME 类型

```js
const xhr = new XMLHttpRequest();
xhr.open('get', 'text.php', true);
xhr.overrideMimeType('text/xml');
xhr.send(null);
```

必须在调用 `send()` 之前调用 `overrideMimeType()`

## 24.2 进度事件

6 个进度事件 API：

- `loadstart` 在接收到响应的第一个字节时触发
- `progress` 在接收响应期间反复触发
- `error` 在请求出错时触发
- `abort` 在调用 `abort()` 终止连接时触发
- `load` 在成功接收完响应时触发
- `loadend` 在通信完成时，且在 `error`、`abort` 或 `load` 之后触发

### 24.2.1 load 事件

`load` 事件用于替代 `readystatechange` 事件，`load` 事件会传入一个 `event` 对象，其 `target` 为 XHR 实例，为了兼容性，还是访问 XHR 实例比较靠谱

```js
const xhr = new XMLHttpRequest();
xhr.onload = function() {
  if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
    console.log(xhr.responseText);
  } else {
    console.log('Request was unsuccessful: ' + xhr.status);
  }
};

xhr.open('get', 'altevents.php', true);
xhr.send(null);
```



### 24.2.2 progress 事件

`progress` 事件处理程序的 `event` 对象

- `target` 是 XHR 对象 
- `lengthComputable` 一个布尔值，表示进度信息是否可用
- `position` 是接收到的字节数
- `totalSize` 是响应的 `Content-Length` 头部定义的总字节数

```js
const xhr = new XMLHttpRequest();
xhr.onload = function() {
  if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
    console.log(xhr.responseText);
  } else {
    console.log('Request was unsuccessful: ' + xhr.status);
  }
};
xhr.onprogress = function(event) {
  const divStatus = document.getElementById('status');
  if (event.lengthComputable) {
    divStatus.innerHTML = `Received ${event.position} of ${event.totalSize} bytes`;
  }
};

xhr.open('get', 'altevents.php', true);
xhr.send(null);
```

必须在调用 `open()` 之前添加 `onprogress` 事件处理程序

## 24.3 跨源资源共享

默认情况下，XHR 只能访问与发起请求的页面在同一个域内的资源

跨源资源共享（CORS，Cross-Origin Resource Sharing）定义了浏览器与服务器如何实现跨源通信。CORS 背后的基本思路就是使用自定义的 HTTP 头部允许浏览器和服务器相互了解，以确实请求或响应应该成功还是失败

简单的请求，在发送时都会有一个额外的头部叫 `Origin` 表示发送请求的页面的源（协议、域名和端口）

如果服务器决定响应请求，那么应该发送 `Access-Control-Allow-Origin` 头部，包含相同的源或者如果资源是公开的，那么包含 `"*"`

```http
Access-Control-Allow-Origin: http://www.nczonline.net
```



要向不同域的源发送请求，可以使用标准 XHR 对象并給 `open()` 方法传入一个绝对 URL，比如：

```js
const xhr = new XMLHttpRequest();
xhr.onload = function() {
  if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
    console.log(xhr.responseText);
  } else {
    console.log('Request was unsuccessful: ' + xhr.status);
  }
};
xhr.open('get', 'http://www.somewhere-else.com/page/', true);
xhr.send(null);
```



出于安全考虑，跨域 XHR 对象也施加了一些额外限制

- 不能使用 `setRequestHeader()` 设置自定义头部
- 不能发送和接收 cookie
- `getAllResponseHeaders()` 方法始终返回空字符串

### 24.3.1 预检请求

CORS 通过一种叫**预检请求**（preflighted request）的服务器验证机制，允许使用自定义头部、除 GET 和 POST 之外的方法，以及不同请求体内容类型。在要发送涉及上述某种高级选项的请求时，会先向服务器发送一个“预检”请求。这个请求使用 OPTIONS 方法发送并包含以下头部

- `Origin` 与简单请求相同
- `Access-Control-Request-Method` 请求希望使用的方法
- `Access-Control-Request-Headers` （可选）要使用的逗号分隔的自定义头部列表

在这个请求发送后，服务器可以确定是否允许这种类型的请求。

预检请求返回后，结果会按向应指定的时间缓存一段时间。换句话说，只有第一次发送这种类型的请求时才会多发送一次额外的 HTTP 请求

### 24.3.2 凭据请求

默认情况，跨源请求不提供凭据（cookie、HTTP认证和客户端 SSL 证书）。可以通过将 `withCredentials` 属性设置为 `true` 来表明请求会发送凭据。如果服务器允许带凭据的请求，那么可以在响应中包含

```http
Access-Control-Allow-Credentials: true
```

如果发送了凭据请求而服务器返回的响应中没有这个头部，则浏览器不会把响应交给 JavaScript （`responseText` 是空字符串，`status` 是 `0`，`onerror()` 被调用）

## 24.4 替代性跨源技术

不需要修改服务器的跨源

### 24.4.1 图片探测

利用 `<img>` 标签实现跨域通信。可以动态创建图片，然后通过它们的 `onload` 和 `onerror` 事件处理程序得知何时接收到响应

通过监听 `onload` 和 `onerror` 事件知道什么时候能接收到响应

```js
const img = new Image();
img.onload = img.onerror = function() {
  console.log('Done!');
};
img.src = 'http://www.example.com/test?name=Nicholas';
```

缺点是只能发送 GET 请求和无法获取服务器响应的内容

### 24.4.2 JSONP

JSONP 是 “JSON with padding” 的简写

后端返回的数据

```js
callback({ "name": "Nicholas" });
```

JSONP 格式包含两个部分：回调和数据。回调是在页面接收到响应之后应该调用的函数，通常回调的名称是通过请求来动态指定的。而数据就是作为参数传给回调函数的 JSON 数据

```tex
http://freegeoip.net/json/?callback=handleResponse
```

JSONP 调用是通过动态创建 `<script>` 元素并为 `src` 属性指定跨域 URL 实现的。

```js
function handleResponse(response) {
  console.log(`You're at IP address ${response.ip}, which is in ${response.city}, ${response.region_name}`);
}
const script = document.createElement('script');
script.src = 'http://freegeoip.net/json/?callback=handleResponse';
document.body.insertBefore(script, document.body.firstChild);
```



JSONP 缺点：

- 如果请求的域不可信，则可能在响应中加入恶意内容。
- 不好确定 JSONP 请求是否失败。虽然 HTML5 规定了 `<script>` 元素的 `onerror` 事件，但是还没被任何浏览器实现

## 24.5 Fetch API

Fetch API 能够执行 `XMLHttpRequest` 对象的所有任务，但更容易使用，接口也更现代化，能够在 Web 工作线程等现代 Web 工具使用

### 24.5.1 基本用法

`fetch()` 方法暴露在全局作用域中，调用这个方法，浏览器就会向给定 URL 发送请求

#### 1.分派请求

`fetch()` 第一个参数是必填的 `input`

```js
const r = fecth('/bar');
console.log(r);  // Promise <pending>
```

请求完成、资源可用时，期约会解决为一个 `Response` 对象。使用这个对象的属性和方法，掌握响应的情况并且将负载转换为有用的形式

```js
fetch('bar.txt').then(response => console.log(response));

// Response { type: "basic", url: ... }
```

#### 2.读取响应

读取响应最简单的方式就是取得纯文本格式的内容，使用 `text()` 方法

```js
fetch('bar.txt')
	.then(response => response.text())
	.then(data => console.log(data));
// bar.txt 的内容
```

#### 3.处理状态码和请求失败

Fetch API 支持通过 `Response` 的 `status` 和 `statusText` 属性检查响应状态。成功通常 `status` 为 200

```js
fetch('bar.txt').then(response => {
  console.log(response.status);  // 200
  console.log(response.statusText);  // OK
});
```

请求不存在的资源

```js
fetch('/does-not-exist').then(response => {
  console.log(response.status);  // 404
  console.log(response.statusText);  // Not Found
});
```

服务器错误

```js
fetch('/throw-server-error').then(response => {
  console.log(response.status);  // 500
  console.log(response.statusText);  // Internal Server Error
});
```

重定向时默认是 200，会至少出现两轮网络请求，`Response` 对象的 `redirected` 属性会被设置为 `true`

```js
fetch('/permanent-redirect').then(response => {
  // 默认行为是跟随重定向直到最终 URL
  // <origin url>/permanent-redirect -> <redirect url>
  console.log(response.status);  // 200
  console.log(response.statusText);  // OK
  console.log(response.redirected);  // true
});
```

可以同时检查 `status` 和 `ok` 属性判断是否响应成功

```js
fetch('/bar').then(response => {
  console.log(response.status);  // 200
  console.log(response.ok);  // true
});
fetch('/does-not-exist').then(response => {
  console.log(response.status);  // 404
  console.log(response.ok);  // false
});
```

超时导致期约拒绝

```js
fetch('/hangs-forever').then(response => {
  console.log(response);
}, err => {
  console.log(err);
});
```

违反 CORS、无网络连接、HTTPS 错配及其他浏览器/网络策略问题都会导致期约被拒绝

#### 4.自定义选项

`fetch()` 第二个可选参数为 `init` 对象。有以下配置属性

| 键               | 值                                                           |
| ---------------- | ------------------------------------------------------------ |
| `body`           | 指定使用请求体时请求体的内容                                 |
| `cache`          | 用于控制浏览器与 HTTP 缓存的交互。要更重缓存的重定向，请求 `redirect` 属性必须是 `"follow"`，而且必须符合同源策略限制。 |
| `credentials`    | 用于指定在外发请求中如何包含 cookie。与 `XMLHttpRequest` 的 `withCredentials` 标签类似 |
| `headers`        | 用于指定请求头部，必须是 `Headers` 对象实例或包含字符串格式键/值对的常规对象。默认值为空 `Headers` 对象。这不意味着没有任何头部，浏览器会默认自动添加一些头部。这些头部对 JavaScript 不可见，但是可以用网络检查器观察到 |
| `integrity`      | 用于强制子资源完整性                                         |
| `keepalive`      | 用于指示浏览器允许请求存在时间超出页面生命周期               |
| `method`         | 用于指定 HTTP 请求方法                                       |
| `mode`           | 用于指定请求模式。这个模式决定来自跨源请求的响应是否有效，以及客户端可以读取多少响应 |
| `redirect`       | 用于指定如何处理重定向（状态码为 301、302、303、307 或 308） |
| `referrer`       | 用于指定 HTTP 的 `Referer` 头部的内容                        |
| `referrerPolicy` | 用于指定 HTTP 的 `Referer` 头部                              |
| `signal`         | 用于支持通过 `AbortController` 中断进行中的 `fetch()` 请求，必须是 `AbortSignal` 实例 |

### 24.5.2 常见 Fecth 请求模式

与 `XMLHttpRequest` 一样，`fetch()` 既可以发送数据也可以接受数据。使用 `init` 对象参数，可以配置 `fetch()` 在请求体中发送各种序列化的数据

#### 1.发送 JSON 数据

```js
const payload = JSON.stringify({
  foo: 'bar'
});

const jsonHeaders = new Headers({
  'Content-Type': 'application/json'
});

fecth('/send-me-json', {
  method: 'POST',
  body: payload,
  headers: jsonHeaders
});
```

#### 2.在请求体中发送参数

因为请求体支持任意字符串值，所以可以通过它发送请求参数

```js
const payload = 'foo=bar&baz=qux';

const paramHeaders = new Headers({
  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
});

fecth('/send-me-params', {
  method: 'POST',
  body: payload,
  headers: paramHeaders
});
```

#### 3.发送文件

因为请求体支持 `FormData` 实现，所以 `fetch()` 也可以序列化并发送文件字段中的文件

```js
const imageFormData = new FormData();
const imageInput = document.querySelector('input[type="file"]');

imageFormData.append('image', imageInput.files[0]);

fecth('/img-upload', {
  method: 'POST',
  body: imageFormData
});
```

#### 4.加载 Blob 文件

可以使用响应对象上面的 `blob()` 方法，返回一个期约，解决为一个 `Blob` 的实例。可以将这个实例传递给 `URL.createObjectUrl()` 以生成可以添加给元素 `src` 属性的值

```js
const imageElement = document.querySelector('img');

fetch('my-image.png')
  .then(response => response.blob())
	.then(blob => imageElement.src = URL.createObjectURL(blob));
```

#### 5.发送跨源请求

```js
fetch('//cross-origin.com', { mode: 'no-cors' })
	.then(response => console.log(response.type));
// opaque
```

#### 6.中断请求

调用 `AbortControler.abort()` 会中断所有网络传输

```js
const abortController = new AbortController();

fetch('wikipedia.zip', { signal: abortController.signal })
  .catch(() => console.log('aborted!'));

// 10ms 后中断请求
setTimeout(() => abortController.abort(), 10);
```



### 24.5.3 Headers 对象

`Headers` 对象是所有外发请求和入站响应头部的容器。通过 `Request.prototype.headers` 或 `Response.prototype.headers` 访问，使用 `new Headers()` 也可以创建一个新实例

#### 1.Headers 与 Map 的相似之处

`Headers` 与 `Map` 类型都有 `get()`、`set()`、`has()` 和 `delete()` 等实例方法

```js
const h = new Headers();

h.set('foo', 'bar');  // 设置值

console.log(h.has('foo'));  // 检查值

console.log(h.get('foo'));  // 获取值

h.delete('foo');  // 删除值
```

`Headers` 和 `Map` 都可以使用一个可迭代对象来初始化

```js
const seed = [['foo', 'bar']];

const h = new Headers(seed);

console.log(h.get('foo'));  // bar
```

而且有相同的 `keys()`、`values()` 和 `entries()` 迭代器接口

```js
const seed = [['foo', 'bar'], ['baz', 'qux']];

const h = new Headers(seed);

console.log(...h.keys());  // foo, baz
console.log(...h.values());  // bar, qux
console.log(...h.entries());  // ['foo', 'bar'], ['baz', 'qux']
```

#### 2.Headers 独有的特性

初始化 `Headers` 时，可以传入键/值对形式的对象

```js
const seed = { foo: 'bar' };
const h = new Headers(seed);
console.log(h.get('foo'));  // bar
```

`append()` 方法支持添加多个值，如果添加不存在的头部，相当于调用 `set()`

```js
const h = new Headers();
h.append('foo', 'bar');
console.log(h.get('foo'));  // bar
h.append('foo', 'baz');
console.log(h.get('foo'));  // bar, baz
```

#### 3.头部护卫

`Headers` 对象使用护卫来防止不被允许的修改。不同的护卫设置会改变 `set()`、`append()` 和 `delete()` 的行为。违反护卫限制会抛出 `TypeError`

| 护卫              | 使用情形                                                     | 限制                         |
| ----------------- | ------------------------------------------------------------ | ---------------------------- |
| `none`            | 在通过构造函数创建 `Headers` 实例时激活                      | 无                           |
| `request`         | 在通过构造函数初始化 `Request` 对象，且 `mode` 值为非 `no-cors` 时激活 | 不允许修改禁止修改的头部     |
| `request-no-cors` | 在通过构造函数初始化 `Request` 对象，且 `mode` 值为 `no-cors` 时激活 | 不允许修改非简单头部         |
| `response`        | 在通过构造函数初始化 `Response` 对象时激活                   | 不允许修改禁止修改的响应头部 |
| `immutable`       | 在通过 `error()` 或 `redirect()` 静态方法初始化 `Response` 对象时激活 | 不允许修改任何头部           |

### 24.5.4 Request 对象

`Request` 对象是获取资源请求的接口。

#### 1.创建 Request 对象

可以通过构造函数初始化 `Request` 对象。需要传入一个 `input` 参数，一般是 URL

```js
const r = new Request('https://foo.com');
console.log(r);
```

同时也接收第二个可选参数 `init` 对象，与 `fetch()` 的 `init` 对象一样

```js
console.log(new Request('https://foo.com', { method: 'POST' }));
```

#### 2.克隆 Request 对象

两种方式

1. 使用 `Request` 构造函数
2. `clone()` 方法

```js
const r1 = new Request('https://foo.com');
const r2 = new Request(r1, { method: 'POST' });

console.log(r1.method);  // GET
console.log(r2.method);  // POST
```

第二种

```js
const r1 = new Request('https://foo.com', { method: 'POST', body: 'foobar' });
const r2 = r1.clone();

console.log(r1.url);  // https://foo.com
console.log(r2.url);  // https://foo.com

console.log(r1.bodyUsed);  // false
console.log(r2.bodyUsed);  // false
```

如果请求对象的 `bodyUsed` 为 `true`，再克隆会报错

```js
const r = new Request('https://foo.com');
r.clone();
new Request(r);

r.text();  // 设置 bodyUsed 为 true
r.clone();  // 报错
new Request(r);  // 报错
```

#### 3.在 fetch() 中使用 Request 对象

可以给 `fetch()` 直接传入一个 `Request` 实例，如果还传入第二个参数 `init` 会覆盖默认传入的 `Request` 行为

```js
const r = new Request('https://foo.com');

// 向 foo.com 发送 GET 请求
fetch(r);

// 向 foo.com 发送 POST 请求
fetch(r, { method: 'POST' });
```

与克隆 `Request` 一样，`fetch()` 也不能拿请求体已经用过的 `Request` 对象来发送请求

### 24.5.5 Response 对象

`Response` 对象是获取资源响应的接口。

#### 1.创建 Response 对象

创建默认 `Response` 对象

```js
const r = new Response();
console.log(r);
```

`Response` 构造函数接收一个可选的 `body` 参数。这个 `body` 可以是 `null`，等同于 `fetch()` 参数 `init` 中的 `body`。还可以接收一个可选的 `init` 对象，包含以下键/值

| 键           | 值                                                         |
| ------------ | ---------------------------------------------------------- |
| `headers`    | 必须是 `Headers` 对象实例或包含字符串键/值对的常规对象实例 |
| `status`     | 表示 HTTP 响应状态码的整数                                 |
| `statusText` | 表示 HTTP 响应状态的字符串                                 |


创建有参数的 `Response` 实例

```js
const r = new Response('foobar', {
  status: 418,
  statusText: 'I\'m a teapot'
});
console.log(r);  // Response {type: 'default', url: '', redirected: false, status: 418, ok: false, …}
```

大多数情况下，产生 `Response` 对象的主要方式是调用 `fetch()`，它返回一个最后会解决为 `Response` 对象的期约，这个 `Response` 对象代表实际的 HTTP 响应。

```js
fetch('https://foo.com')
	.then(response => console.log(response));
```


两个用于生成 `Response` 对象的静态方法：

- `Response.redirect()` 接收一个 URL 和一个重定向状态码（301、302、303、307 或 308），返回重定向的 `Response` 对象
- `Response.error()` 用于产生表示网络错误的 `Response` 对象（网络错误会导致 `fetch()` 期约被拒绝）

```js
console.log(Response.redirect('https://foo.com', 301));  // 提供的状态码必须是重定向状态码，否则报错
// Response {type: 'default', url: '', redirected: false, status: 301, ok: false, …}
```



```js
console.log(Response.error());
// Response {type: 'error', url: '', redirected: false, status: 0, ok: false, …}
```

#### 2.读取响应状态信息

`Response` 对象包含一组只读属性，描述了请求完成后的状态

| 属性         | 值                                                           |
| ------------ | ------------------------------------------------------------ |
| `headers`    | 响应包含的 `Headers` 对象                                    |
| `ok`         | 布尔值，表示 HTTP 状态码的含义。200~299 的状态码返回 `true`，其他状态码返回 `false` |
| `redirected` | 布尔值，表示响应是否至少经过一次重定向                       |
| `status`     | 整数，表示响应的 HTTP 状态码                                 |
| `statusText` | 字符串，包含对 HTTP 状态码的正式描述。这个值派生自可选的 HTTP Reason-Pharse 字段，因此如果服务器以 Reason-Pharse 为由拒绝响应，这个字段可能是空字符串 |
| `type`       | 字符串，包含响应类型。                                       |
| `url`        | 包含响应 URL 的字符串。对于重定向响应，这是最终的 URL，非重定向响应就是它产生的 |

#### 3.克隆 Response 对象

主要是使用 `clone()` 方法，创建一个一模一样的副本，不会覆盖任何值，不会将任何请求的响应体标记为已使用

```js
const r1 = new Response('foobar');
const r2 = new r1.clone();

console.log(r1.bodyUsed);  // false
console.log(r2.bodyUsed);  // false
```

如果响应对象的 `bodyUsed` 属性为 `true`，则不能再创建这个对象的副本。否则报错

```js
const r = new Response('foobar');
r.clone();

r.text();  // 设置 bodyUsed 为 true

r.clone();  // 报错
```

有响应体的 `Response` 对象只能读取一次。（不包含响应体的 `Response` 对象不受此限制。）

```js
const r = new Response('foobar');

r.text().then(console.log);  // foobar

r.text().then(console.log);  // foobar  // 报错
```

必须在第一次读取前 `clone()`

```js
const r = new Response('foobar');

r.clone().text().then(console.log);  // foobar
r.clone().text().then(console.log);  // foobar
r.text().then(console.log);  // foobar
```

创建带有原始响应体的 `Response` 实例，响应体会在两个响应之间**共享**

```js
const r1 = new Response('foobar');
const r2 = new Response(r1.body);

console.log(r1.bodyUsed);  // false
console.log(r2.bodyUsed);  // false

r2.text().then(console.log);  // foobar
r1.text().then(console.log);  // 报错
```

### 24.5.6 Request、Response 及 Body 混入

`Request` 和 `Response` 都使用了 Fetch API 的 `Body` 混入，以实现两者承担有效载荷的能力。这个混入为两个类型提供了只读的 `body` 属性（实现为 `ReadableStream`）、只读的 `bodyUsed` 布尔值（表示 `body` 流是否已读）和一组方法，用于从流中读取内容并将结果转换为某种 JavaScript 对象类型。

`Body` 混入提供了 5 个方法

#### 1.Body.text()

`Body.text()` 方法返回期约，解决为将缓冲区转存得到的 UTF-8 格式字符串。

```js
fetch('https://foo.com')
	.then(response => response.text())
	.then(console.log);
```

`Request` 对象上使用 `Body.text()`

```js
const request = new Request('https://foo.com', { method: 'POST', body: 'barbazqux' });

request.text()
	.then(console.log);

// barbazqux
```

