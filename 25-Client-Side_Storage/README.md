# 第 25 章 客户端存储

无论是登录信息、个人偏好，还是其他数据，Web 应用程序提供者都需要有办法把它们保存在客户端。

## 25.1 cookie

HTTP cookie 通常也叫作 cookie，最初用于在客户端存储会话信息。这个规范要求服务器在响应 HTTP 请求时，通过发送 `Set-Cookie` HTTP 头部包含会话信息。

```http
HTTP/1.1 200 OK
Content-type: text/html
Set-Cookie: name=value
Other-header: other-header-value
```

这个 HTTP 响应会设置一个名为 `"name"`，值为 `"value"` 的 cookie。名和值在发送时都会经过 URL 编码。浏览器会存储这些会话信息，并在之后的每次请求中都会通过 HTTP 头部 cookie 再将它们发回服务器，比如：

```http
GET /index.jsl HTTP/1.1
Cookie: name=value
Other-header: other-header-value
```

这些发送会服务器的额外信息可用于唯一表示发送请求的客户端

### 25.1.1 限制

cookie 是与特定域绑定的。设置 cookie 后，它会与请求一起发送到创建它的域。这个限制能保证 cookie 中存储的信息只对被认可的接收者开放，不被其他域访问。

cookie 的限制

- 不超过 300 个 cookie
- 每个 cookie 不超过 4096 字节
- 每个域不超过 20 个 cookie
- 每个域不超过 81920 字节

### 25.1.2 cookie 构成

- **名称** 唯一标识 cookie 的名称。cookie 名不区分大小写，因此 `myCookie` 和 `MyCookie` 是同一个名称。不过，实践中最好将 cookie 名当成区分大小写来对待。cookie 名必须经过 URL 编码
- **值** 存储在 cookie 里的字符串值。这个值必须经过 URL 编码
- **域** cookie 有效的域。发送到这个域的所有请求都会包含对应的 cookie。这个值可能包含子域（如 www.wrox.com），也可以不包含（如 .wrox.com 表示对 wrox.com 的所有子域都有效）。如果不明确设置，则默认为设置 cookie 的域。
- **路径** 请求 URL 中包含这个路径才会把 cookie 发送到服务器。例如，可以指定 cookie 只能由 http://www.worx.com/books/ 访问，因此访问 http://www.wrox.com/ 下的页面就不会发送 cookie，即使请求的是同一个域
- **过期时间** 表示何时删除 cookie 的时间戳（即什么时间之后就不发送到服务器了）。默认情况下，浏览器会话结束后会删除所有 cookie。不过，也可以设置删除 cookie 时间。这个值是 GMT 格式（Wdy，DD-Mon-YYYY HH:MM:SS GMT），用指定删除 cookie 的具体时间。这样即使关闭浏览器 cookie 也会保留在用户机器上。把过期时间设置为过去的时间会立刻删除 cookie
- **安全标志** 设置之后，只在使用 SSL 安全连接的情况下才会把 cookie 发送到服务器。例如，请求 https://www.wrox.com 会发送 cookie，而请求 http://www.wrox.com 则不会

这些参数在 `Set-Cookie` 头部中使用分号加空格隔开

```http
HTTP/1.1 200 OK
Content-type: text/html
Set-Cookie: name=value; expires=Mon, 22-JAN-07 07:10:24 GMT; domain=.wrox.com;
Other-header: other-header-value
```

这个头部设置一个名为 `"name"` 的 cookie，这个 cookie 在 2007 年 1 月 22 日 7:10:24 过期，对 www.wrox.com 及其他 wrox.com 子域有效

安全标志 `secure` 是 cookie 中唯一的非名/值对，只需一个 `secure` 就可以了

```http
HTTP/1.1 200 OK
Content-type: text/html
Set-Cookie: name=value; domain=.wrox.com; path=/; secure
Other-header: other-header-value
```

这个 cookie 只能在 SSL 连接上发送，因为设置了 `secure` 标志

要知道，域、路径、过期时间和 `secure` 标志用于告诉浏览器什么情况下应该在请求中包含 cookie。这些参数并不会随请求发送给服务器，实际发送的只有 cookie 名/值对

### 25.1.3 JavaScript 中的 cookie

`document.cookie` 返回包含页面中所有有效 cookie 的字符串（根据域、路径、过期时间和安全设置），以逗号分隔，给 `document.cookie` 直接赋值不会覆盖原有的值，除非设置了相同的 cookie 名

`name1=value1;name2=value2;name3=value3`

所有名和值都是 URL 编码的，因此要用 `decodeURIComponent()` 编码

设置 cookie

```js
document.cookie = `${encodeURIComponent('name')}=${encodeURIComponent('Nicholas')}; domain=.wrox.com; path=/`;
```

### 25.1.4 子 cookie

为了绕过浏览器对每个域 cookie 数的限制，提出了子 cookie，子 cookie 是使用 cookie 的值在单个 cookie 中存储多个名/值对。

`name=name1=value1&name2=value2&name3=value3&name4=value4&name5=value5`

### 25.1.5 使用 cookie 的注意事项

还有一种叫作 **HTTP-only** 的 cookie。可以在浏览器设置，也可以在服务器设置。但只能在服务器上读取，这是因为 JavaScript 无法取得这种 cookie 的值

保存的 cookie 越大，请求时长越长。避免存储太大的 cookie

> **注意** 避免在 cookie 保存敏感信息

## 25.2 Web Storage

Web Storage 的第 2 版定义了两个对象：

- `localStorage` 是永久存储机制
- `sessionStorage` 是跨会话的存储机制

这两种浏览器存储 API 提供了在浏览器中不受页面刷新影响而存储数据的两种方式

### 25.2.1 Storage 类型

`Storage` 类型用于保存名/值对数据，直至存储空间上限（由浏览器决定）。

- `clear()` 删除所有值；不在 Firefox 实现
- `getItem(name)` 取得给定 `name` 的值
- `key(index)` 取得给定数值位置的名称
- `removeItem(name)` 删除给定 `name` 的名/值对
- `setItem(name, value)` 设置给定 `name` 的值

通过 `length` 属性可以确定 `Storage` 对象中保存了多少名/值对

> **注意** `Storage` 类型只能存储字符串。非字符串数据在存储之前会自动转换为字符串

### 25.2.2 sessionStorage 对象

`sessionStorage` 对象只存储会话数据，数据只会存储到浏览器关闭。并且不受页面刷新影响，可以在浏览器崩溃并重启后恢复。

可以使用 `getItem()` 或直接访问属性名来取得 `sessionStorage` 上的数据

```js
const name = sessionStorage.getItem('name');
const book = sessionStorage.book;
Object.entries(sessionStorage).forEach(([key, value]) => console.log(key, value));
```

从 `sessionStorage` 中删除数据，可以使用 `delete` 操作符或者 `removeItem()` 方法

```js
delete sessionStorage.name;
sessionStorage.removeItem('book');
```

### 25.2.3 localStorage 对象

`localStorage` 对象中的数据会保留到通过 JavaScript 删除或者用户清除浏览器缓存，并且不受页面刷新影响，也不会因关闭窗口、标签页或重启浏览器而丢失

可以使用 `getItem()` 或直接访问属性名来取得 `localStorage` 上的数据

```js
const name = localStorage.getItem('name');
const book = localStorage.book;
```

使用 `setItem()` 或直接设置属性来设置 `localStorage` 上的数据

```js
localStorage.setItem('name', 'Nicholas');
localStorage.book = 'Professional JavaScript';
```

从 `localStorage` 中删除数据，可以使用 `delete` 操作符或者 `removeItem()` 方法

```js
delete localStorage.name;
localStorage.removeItem('book');
```

### 25.2.4 存储事件

`Storage` 对象，使用属性或 `setItem()` 设置值、使用 `delete` 或 `removeItem()` 删除值，以及每次调用 `clear()` 时，都会在文档上触发 `storage` 事件。

事件对象属性：

- `domain` 存储变化对应的域
- `key` 被设置或删除的键
- `newValue` 键被设置的新值，若键被删除则为 `null`
- `oldValue` 键变化之前的值

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>存储事件</title>
</head>
<body>
  <button id="btn">点我设置值</button>

  <script>
    const btn = document.querySelector('#btn');
    // 要再打开新页面才会触发
    window.addEventListener('storage', event => {
      console.log(event.domain);
      console.log(event.key);
      console.log(event.newValue);
      console.log(event.oldValue);
    });
    btn.addEventListener('click', () => {
      let count = localStorage.getItem('count');
      count = Number(count || 0);
      localStorage.setItem('count', ++count);
    });
  </script>
</body>
</html>
```

监听的页面

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>存储事件1</title>
</head>
<body>
  <h2>用于监听存储事件的页面</h2>
  <script>
    window.addEventListener('storage', event => {
      console.log(event.domain);
      console.log(event.key);
      console.log(event.newValue);
      console.log(event.oldValue);
    });
  </script>
</body>
</html>
```

此技术可以用于跨页面通讯。

> **注意** 在同页面是不会触发 `storage` 事件的，必须要在相同的域不同的页面打开修改 `Storage` 时，才会在其它页面触发

