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

