# 第 2 章 HTML 中的 JavaScript



## 2.1 `<script>` 元素

将 JavaScript 插入 HTML 的主要方法是使用 `<script>` 元素



| 属性          | 描述                                                         |
| ------------- | ------------------------------------------------------------ |
| `async`       | 可选。表示应该立即下载脚本，但不能阻止其他页面动作，比如下载资源或等待其他脚本加载。只对外部文件有效 |
| `charset`     | 可选。使用 `src` 属性指定的代码字符集。这个属性很少使用，因为大多数浏览器不在乎它的值。 |
| `crossorigin` | 可选。配置相关请求的 CORS ( 跨源资源共享 ) 设置。默认不使用 CORS。`crossorigin="anonymous"` 配置文件请求不必设置凭据标志。`crossorigin="use-credentials"` 设置凭据标志，意味着出站请求会包含凭据。 |
| `defer`       | 可选。表示文档解析和显示完成后在执行脚本是没有问题的。只对外部脚本文件有效。在 IE7  及更早的版本中，对行内脚本也可以指定这个属性。 |
| `integrity`   | 可选。允许比对接收到的资源和指定的加密签名以验证子资源完整性 (SRI，Subsource Intergrity)。如果接收到的资源的签名与这个属性指定的签名不匹配，则页面会报错，脚本不会执行。这个属性可以用于确保内容分发网络 (CDN，Content Delivery Network) 不会提供恶意内容。 |
| `language`    | 废弃。最初用于设置脚本语言 (如 `JavaScript`, `JavaScript 1.2`, `VBScript`) |
| `src`         | 可选。表示包含要执行的代码的外部文件                         |
| `type`        | 可选。代替 `language`，表示代码块中脚本语言的内容类型（也称 MIME 类型）。按照惯例，这个值始终是 `text/javascript`，尽管 `text/javascript` 和 `text/ecmascript` 都已经废弃了。JavaScript 文件的 MIME 类型通常是 `application/x-javascript`，不过这个值有可能导致脚本被忽略。在非 IE 浏览器还可以是 `application/javascript` 和 `application/ecmascript`。如果是 `module`，则代码会被当成 ES6 模块，只有这个时候才能使用 `import` 和 `export` 关键字 |



使用 `<script>` 的方式：

1. 直接在网页中嵌入 JavaScript 代码

    ```html
    <!-- 在 <script> 元素中的代码被计算完成之前，页面的其余内容不会被加载，也不会被显示 -->
    <script>
        function sayHi() {
            console.log("Hi!");
        }
    </script>
    ```

     

    ```html
    <!-- 代码中不能出现字符串 </script> -->
    <script>
    	function sayHi() {
    		console.log("</script>");  // 出错
        }
    </script>
    ```

    

    ```html
    <script>
        function sayHi() {
            // 转义符可以解决    
            console.log("<\/script>");
        }
    </script>
    ```

    

2. 外部 JavaScript 文件

    ```html
    <!-- 在加载外部文件时，页面也会阻塞 -->
    <script src="example.js"></script>
    ```

    

    ```xhtml
    <!-- 在 XHTML 中，可以忽略结束标签，但是这种写法不能出现在 HTML 中 -->
    <script src="example.js"/>
    ```

    

    - 使用了 `src` 属性的 `<script>` 不应该在标签内加入行内代码，否则只会执行外部文件的代码，从而忽略行内代码

    ```html
    <!-- 也可以使用跨源的 js 文件，受争议的用法，会向指定的路径发送一个 GET 请求。这个请求仍然受父页面 HTTP/HTTPS 协议的限制，注意，这个用法可能会导致恶意代码的攻击，integrity 属性是防范的一种手段 -->
    <script src="http://www.somewhere.com/afile.js"></script>
    ```

    

不管包含什么代码，浏览器都会按照 `<script>` 在页面中的出现顺序依次解析它们，前提是没有使用 `defer` 和 `async` 属性



### 2.1.1 标签位置

过去，所有的 `<script>` 元素都放在页面的 `<head>` 标签中，意味着所有 JavaScript 文件和 CSS 文件下载完成以后才会渲染页面（页面在浏览器解析到 `<body>` 标签的起始标签才开始渲染）。

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Example HTML Page</title>
    <script src="example1.js"></script>
    <script src="example2.js"></script>
</head>
<body>
    <!-- 这里是内容 -->
</body>
</html>
```



现代的 Web 程序通常将所有的 JavaScript 引用放在 `<body>` 中的内容的最后，这样一来页面的空白时间就短了。

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Example HTML Page</title>
</head>
<body>
    <!-- 这里是内容 -->
    <script src="example1.js"></script>
    <script src="example2.js"></script>
</body>
</html>
```



### 2.1.2 推迟执行脚本

`defer` 属性，会告诉浏览器应该立即下载，但执行应该推迟

这个例子中，虽然 `<script>` 元素包含在页面的 `<head>` 中，但它们会在浏览器解析到结束的 `</html>` 标签后才会执行，而且在 `DOMContentLoaded` 事件之前执行，`defer` 属性只对外部脚本文件有效。

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Example HTML Page</title>
    <script defer src="example1.js"></script>
    <script defer src="example2.js"></script>
</head>
<body>
    <!-- 这里是内容 -->
</body>
</html>
```



> **注意：**对于 XHTML 文档，指定 `defer` 属性时应该写成 `defer="defer"`



### 2.1.3 异步执行脚本

`async` 属性，告诉浏览器应该立即下载，但是不会阻塞页面渲染（即异步加载），而且会在 `load` 事件前执行，但可能会在 `DOMContentLoaded` 事件之前或之后，也不能保证脚本的执行顺序，一般浏览器开发不推荐使用这个属性

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Example HTML Page</title>
    <script async src="example1.js"></script>
    <script async src="example2.js"></script>
</head>
<body>
    <!-- 这里是内容 -->
</body>
</html>
```



> **注意：**对于 XHTML 文档，指定 `async` 属性时应该写成 `async="async"`



### 2.1.4 动态加载脚本

通过 DOM API 向 DOM 中动态添加 `<script>`

```js
// 相当于 async 属性，在元素被添加到 DOM 之前不会发送请求
let script = document.createElement('script');
script.src = 'gibberish.js';
document.head.appendChild(script);
```



如果要使用同步方法

```js
let script = document.createElement('script');
script.src = 'gibberish.js';
script.async = false;
document.head.appendChild(script);
```



这种方式获取资源，对浏览器的预加载器是不可见的。可以在文档头部显式声明它们

```html
<link rel="preload" href="gibberish.js">
```



### 2.1.5 XHTML 中的变化

可扩展超文本标记语言（XHTML，Extensible HyperText Markup Language）是将 HTML 作为 XML 的应用重新包装的结果。已经过时。

使用 JavaScript 是必须指定 `<script>` 元素的 `type="text/javascript"`

```xhtml
<script type="text/javascript">
// 为了 XHTML 中的 `<` 字符能被正确的解析而且不影响阅读，可以在 js 注释中包含 CDATA 块
// <![CDATA[
    function compare(a, b) {
        if (a < b) {
            console.log("A is less than B");
        } else if (a > b) {
            console.log("A is greater than B");
        } else {
            console.log("A is equal to B");
        }
    }
// ]]>
</script>
```



### 2.1.6 废弃的语法

早期为了解决不支持 `<script>` 元素的浏览器会把 js 代码输出到浏览器上

```html
<!-- 没必要再使用 -->
<script><!--
    function sayHi() {
        console.log("Hi!");
    }
//--></script>
```



## 2.2 行内代码与外部文件

人们认为最佳实践是将 JavaScript 文件放在外部，推荐使用外部文件的理由

- 可维护性：不会导致 JavaScript 代码分散到各个页面
- 缓存：浏览器可以通过特定的设置缓存外部的 JavaScript 文件
- 适应未来



## 2.3 文档模式

IE5.5 发明了文档模式的概念，即可以使用 `doctype` 切换文档模式。

最初的文档模式：

- 混杂模式（quirks mode）：让 IE 像 IE5 一样（支持一些非标准的特性）
- 标准模式（standards mode）：让 IE 具有兼容标准的行为

其后出现了

- 准标准模式（almost standrads mode）。让浏览器支持很多标准特性，但是又没有标准规定的这么严格

```html
<!-- HTML 4.01 Strict -->
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<!-- XHTML 1.0 Strict -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<!-- HTML5 -->
<!DOCTYPE html>
```



## 2.4 `<noscript>` 元素

浏览器在以下情况会显示 `<noscript>` 中的内容

- 浏览器不支持脚本
- 浏览器对脚本的支持被关闭

```html
<!DOCTYPE html>
<html>
<head>
    <title>Example HTML Page</title>
    <script defer src="example1.js"></script>
    <script defer src="example2.js"></script>
</head>
<body>
    <noscript>
        <p>This page requires a JavaScript-enable browser.</p>
    </noscript>
</body>
</html>
```

