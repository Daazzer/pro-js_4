# 第 22 章 处理 XML

XML 曾一度是在互联网上存储和传输结构化数据的标准

## 22.1 浏览器对 XML DOM 的支持

浏览器在正式标准问世之前就开始实现 XML 解析方案。

DOM Level 3 增加了解析和序列化的能力

### 22.1.1 DOM Level 2 Core

添加了 `document.implementation` 的 `createDocument()` 方法

```js
// 创建空 XML 文档
const xmldom = document.implementation.createDocument(namespaceUri, root, doctype);
```



创建 XML 文档

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DOM Level 2 Core</title>
</head>
<body>
  <script>
    const xmldom = document.implementation.createDocument('', 'root', null);

    console.log(xmldom.documentElement.tagName);  // "root"

    const child = xmldom.createElement('child');
    xmldom.documentElement.appendChild(child);
    console.log(xmldom);
  </script>
</body>
</html>
```



检查浏览器是否支持 DOM Level 2 XML

```js
const hasXmlDom = document.implementation.hasFeature('XML', '2.0');
```



### 22.1.2 DOMParser 类型

要使用 `DOMParser`，需要先创建它的一个实例，然后再调用 `parseFromString()`，该方法接受两个参数：要解析的 XML 字符串和内容类型（始终应该是 `"text/html"`）。返回值是 `Document` 的实例

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DOMParser 类型</title>
</head>
<body>
  <script>
    const parser = new DOMParser();
    const xmldom = parser.parseFromString('<root><child /></root>', 'text/xml');

    console.log(xmldom.documentElement.tagName);  // "root"
    console.log(xmldom.documentElement.firstChild.tagName);  // "child"

    const anotherChild = xmldom.createElement('child');
    xmldom.documentElement.appendChild(anotherChild);

    const children = xmldom.getElementsByTagName('child');
    console.log(children.length);  // 2
  </script>
</body>
</html>
```



`DOMParser` 不能把 HTML 解析为 HTML 文档

### 22.1.3 XMLSerializer 类型

与 `DOMParser` 相对，`XMLSerializer` 类型用于把 DOM 文档序列化为 XML 字符串

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>XMLSerializer 类型</title>
</head>
<body>
  <script>
    const parser = new DOMParser();
    const xmldom = parser.parseFromString('<root><child /></root>', 'text/xml');
    const serializer = new XMLSerializer();
    const xml = serializer.serializeToString(xmldom);
    console.log(xml);  // "<root><child/></root>"
  </script>
</body>
</html>
```



> **注意** 如果给 `serializeToString()` 传入非 DOM 对象，就会导致抛出错误

## 22.2 浏览器对 XPath 的支持

XPath 是为了在 DOM 文档中定位特定节点而创建的

### 22.2.1 DOM Level 3 XPath

确定浏览器是否支持 DOM Level 3 XPath

```js
const supportsXPath = document.implementation.hasFeature("XPath", "3.0");
```



这个规范最重要的两个类型，`XPathEvaluator` 和 `XPathResult`

`Document` 类型通常是通过 `XPathEvaluator` 接口实现的

```js
const result = xmldom.evaluate('employee/name', xmldom.documentElement, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);

if (result !== null) {
  const element = result.iterateNext();
  while(element) {
    console.log(element.tagName);
    node = result.iterateNext();
  }
}
```

