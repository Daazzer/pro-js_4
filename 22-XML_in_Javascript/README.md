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



### 22.2.2 单个节点结果

`XPathResult.FIRST_ORDERED_NODE_TYPE` 结果类型返回匹配的第一个节点，可以通过结果的 `singleNodeValue` 属性获取

```js
const result = xmldom.evaluate('employee/name', xmldom.documentElement, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);

if (result !== null) {
  console.log(result.singleNodeValue.tagName);
}
```



### 22.2.3 简单类型结果

使用布尔值、数值和字符串 `XPathResult` 类型，可以根据 XPath 获取简单、非节点数据类型。这些结果类型返回的值需要分别使用 `booleanValue`、`numberValue` 和 `stringValue` 属性获取。对于布尔值类型，如果至少有一个节点匹配 XPath 表达式，`booleanValue` 就是 `true0`；否则，`booleanValue` 为 `false`

```js
const result = xmldom.evaluate('employee/name', xmldom.documentElement, null, XPathResult.BOOLEAN_TYPE, null);

console.log(result.booleanValue)
```



### 22.2.4 默认类型结果

可以使用 `XPathResult.ANY_TYPE` 类型让求值自动返回默认类型结果。通常，默认类型结果是布尔值、数值、字符串和无序节点迭代器

```js
const result = xmldom.evaluate('employee/name', xmldom.documentElement, null, XPathResult.ANY_TYPE, null);

if (result !== null) {
  switch(result.resultType) {
      case XPathResult.STRING_TYPE;
      	// 处理字符串类型
      	break;
      case XPathResult.NUMBER_TYPE;
      	// 处理数值类型
      	break;
    	case XPathResult.BOOLEAN_TYPE;
      	// 处理布尔值类型
      	break;
      case XPathResult.UNORDERED_NODE_ITERATOR_TYPE;
      	// 处理无序节点迭代器
      	break;
    	default:
      	// 处理其他可能的结果类型
  }
}
```



### 22.2.5 命名空间支持

对于使用命名空间的 XML 文档，必须告诉 `XPathEvaluator` 命名空间信息，才能进行正确求值

```js
const nsresolver = xmldom.createNSResolver(xmldom.documentElement);

const result = xmldom.evaluate("wrox:book/wrox:author", xmldom.documentElement, nsresolver, XPathResult.ORDERED_NODE_SHAPSHOT_TYPE, null);

console.log(result.snapshotLength);
```



## 22.3 浏览器对 XSLT 的支持

可扩展样式表语言转换（XSLT，Extensible Stylesheet Language Transformations）是与 XML 相伴的一种技术，可以利用 XPath 将一种文档表示转换为另一种文档表示。与 XML 和 XPath 不同，XSLT 没有与之相关的正式 API，正式的 DOM 中也没有涵盖它。因此浏览器都以自己的方式实现 XSLT。率先在 JavaScript 中支持 XSLT 的是 IE

### 22.3.1 XLSTProcessor 类型

使用 `XSLTProcessor` 类型，开发者可以使用 XSLT 转换 XML 文档

```js
const processor = new XSLTProcessor();
processor.importStylesheet(xlstdom);

const result = processor.transformToDocument(xmldom);
console.log(serializeXml(result));
```



### 22.3.2 使用参数

`XLSTProcessor` 还允许使用 `setParameter()` 方法设置 XLST 参数。改方法接受三个参数：命名空间 URI、参数本地名称和要设置的值

```js
const processor = new XSLTProcessor();
processor.importStylesheet(xsltdom);
processor.setParameter(null, "message", "Hello World!");
const result = processor.transformToDocument(xmldom);
```



### 22.3.3 重置处理器

每个 `XLSTProcessor` 实例都可以重用与多个转换，只是要使用不同的 XSLT 样式表。

`reset()` 方法可以删除所有参数和样式表。

```js
const processor = new XLSTProcessor();
processor.importStylesheet(xsltdom);

// 执行某些转换

processor.reset();
processor.importStylesheet(xsltdom2);

// 再执行一些转换
```

