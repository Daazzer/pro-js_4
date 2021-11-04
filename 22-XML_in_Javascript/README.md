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

