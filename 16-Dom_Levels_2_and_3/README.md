# 第 16 章 DOM2 和 DOM3

DOM1 主要定义了 HTML 和 XML 文档底层结构。

DOM2 和 DOM3 是按照模块化的思路来制定标准的，每个模块之间有一定关联，但分别针对某个 DOM 子集

- **DOM Core** 在 DOM1 核心部分的基础上，为节点添加方法和属性
- **DOM Views** 在基于样式信息的不同视图
- **DOM Events** 定义通过事件实现 DOM 文档交互
- **DOM Style** 定义以编程方式访问和修改 CSS 样式的接口
- **DOM Traversal and Range** 新增遍历 DOM 文档及选择文档内容的接口
- **DOM HTML** 在 DOM1 HTML 部分的基础上，增加属性、方法和新接口
- **DOM Mutation Observers** 定义基于 DOM 变化触发回调的接口。这个模块是 DOM4 级模块，用于取代 Mutation Events

## 16.1 DOM 的演进

支持 XML 命名空间的概念。DOM2 Core 没有新增任何类型，仅仅在 DOM1 Core 基础上增加了一些方法和属性。DOM3 Core 则除了增强原有类型，也新增了一些新类型。

### 16.1.1 XML 命名空间

XML 命名空间可以实现在一个格式规范的文档中混用不同的 XML 语言，而不必担心元素命名冲突。严格来讲，XML 命名空间在 XHTML 中才支持，HTML 并不支持

命名空间时使用 `xmlns` 指定的。XHTML 命名空间是 `http://www.w3.org/1999/xhtml`

```xhtml
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title>Example XHTML page</title>
  </head>
  <body>
    Hello World!
  </body>
</html>
```

可以使用 `xmlns` 给命名空间创建一个前缀，属性也可以加上命名空间前缀

```xhtml
<xhtml:html xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <xhtml:head>
    <xhtml:title>Example XHTML page</xhtml:title>
  </xhtml:head>
  <!-- 属性也可以添加 -->
  <xhtml:body xhtml:class="home">
    Hello World!
  </xhtml:body>
</xhtml:html>
```

如果文档只使用一种 XML 语言，那么命名空间是多余的，要混合使用多种 XML 语言时才有必要

```xhtml
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title>Example XHTML page</title>
  </head>
  <body>
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 100" style="width: 100%; height: 100%">
      <rect x="0" y="0" width="100" height="100" style="fill: red" />
    </svg>
  </body>
</html>
```

#### 1.Node 的变化

DOM2 中 `Node` 类型包含以下特定于命名空间的属性：

- `localName` 不包含命名空间前缀的节点名
- `namespaceURI` 节点命名空间的 URL，如果未指定则为 `null`
- `prefix` 命名空间的前缀，如果未指定则为 `null`

DOM3 新增的相关方法：

- `isDefaultNamespace(namespaceURI)` 返回布尔值，表示 `namespaceURI` 是否为节点的默认命名空间
- `lookupNamespaceURI(prefix)` 返回给定 `prefix` 的命名空间 URI
- `lookupPrefix(namespaceURI)` 返回给定 `namespaceURI` 的前缀

#### 2.Document 的变化

DOM2 在 `Document` 类型上新增了以下命名空间特定的方法

- `createElementNS(namespaceURI, tagName)` 以给定的标签名 `tagName` 创建指定命名空间 `namespaceURI` 的一个元素
- `createAttributeNS(namespaceURI, attributeName)` 以给定的属性名 `attributeName` 创建指定命名空间 `namespaceURI` 的一个新属性
- `getElementsByTagNameNS(namespaceURI, tarName)` 返回给定命名空间 `namespaceURI` 中所有标签名为 `tagName` 的元素 `NodeList`

这些命名空间特定的方法只在文档中包含两个或两个以上命名空间时才有用

#### 3.Element 的变化

DOM2 Core 对 `Element` 类型新增的方法

- `getAttributeNS(namespaceURI, localName)` 取得指定命名空间 `namespaceURI` 中名为 `localName` 的属性
- `getAttributeNodeNS(namespaceURI, localName)` 取得指定命名空间 `namespaceURI` 中名为 `localName` 的属性节点
- `getElementsByTagNameNS(namespaceURI, tagName)` 取得指定命名空间 `namespaceURI` 中标签名为 `tagName` 的元素的 `NodeList`
- `hasAttributeNS(namespaceURI, localName)` 返回布尔值，表示元素中是否有命名空间 `namespaceURI` 下名为 `localName` 的属性
- `removeAttributeNS(namespaceURI, value)` 删除指定命名空间 `namespaceURI` 中名为 `localName` 的属性
- `setAttributeNS(namespaceURI, qualifiedName, value)` 设置指定命名空间 `namespaceURI` 中名为 `qualifiedName` 的属性为 `value`
- `setAttributeNodeNS(attNode)` 为元素设置包含命名空间信息的属性节点 `attNode` 这些方法与 DOM1 中对应的方法行为相同，除 `setAttributeNodeNS()` 之外多了一个命名空间参数

#### 4.NamedNodeMap 的变化

`NamedNodeMap` 新增了以下方法

- `getNamedItemNS(namespaceURI, localName)`
- `removeNamedItemNS(namespaceURI, localName)`
- `setNamedItemNS(node)`

### 16.1.2 其他变化

DOM2 Core 还对 DOM API 的完整性与可靠性进行更新

#### 1.DocumentType 变化

`DocumentType` 新增 3 个属性

- `publicId` 表示文档声明中有效但无法使用 DOM1 API 访问的数据 `"-// W3C// DTD HTML 4.01// EN"`
- `systemId` 表示文档声明中有效但无法使用 DOM1 API 访问的数据 `"http://www.w3.org/TR/html4/strict.dtd"`
- `internamSubset` 用于访问文档类型声明中可能包含的额外定义  `[<!ELEMENT name (#PCDATA)>]`

```xml
<!DOCTYPE HTML PUBLIC 
  "-// W3C// DTD HTML 4.01// EN"
  "http://www.w3.org/TR/html4/strict.dtd"
  [<!ELEMENT name (#PCDATA)>]
>
```

#### 2.Document 的变化

- `importNode()` 从其他文档获取一个节点并导入到新文档，以便将其插入新文档，接收两个参数，要复制的节点和表示是否同时复制子树的布尔值

- `defaultView` 属性，是一个指向拥有当前文档的窗口（或窗格 `<iframe>` ）的指针

- `document.implementation.createDocumentType()` 创建 `DocumentType` 类型的新方法，接收三个参数：文档类型名称、`publicId` 和 `systemId`

  ```js
  let doctype = document.implementation.createDocumentType('html', '-// W3C// DTD HTML 4.01// EN', 'http://www.w3.org/TR/html4/strict.dtd');
  ```

- `document.implementation.createDocument()`  接收3个参数：文档元素的 `namespaceURI`、文档元素的标签名和文档类型

  ```js
  let doc = document.implementation.createDocument('', 'root', null);
  ```

- `document.implementation.createHTMLDocument()` 创建一个完整的 HTML 文档，接收一个参数，创建文档的标题（放到 `<title>` 元素中）

  ```js
  let htmldoc = document.implementation.createHTMLDocument('New Doc');
  console.log(htmldoc.title);  // 'New Doc'
  console.log(typeof htmldoc.body);  // 'object'
  ```

#### 3.Node 的变化

- `isSameNode()` 接收一个节点参数，判断是否节点相等
- `isEqualNode()` 接收一个节点参数，判断是否节点相等
- `setUserData()` 接收3个参数：键、值、处理函数，用于给节点追加数据，处理函数会在节点被复制、删除、重命名、或导入其他文档的时候执行。处理函数接收5个参数：表示操作类型的数值、数据的键、数据的值、源节点和目标节点
- `getUserData()` 接收一个键名，获取节点信息

#### 4.内嵌窗格的变化

- `contentDocument` 属性，`HTMLFrameElement`  类型的属性，包含代表子内嵌窗格中内容的 `document` 对象指针

## 16.2 样式

HTML 中的 3 中定义样式：

- 外部样式表，`<link>` 元素
- 文档样式表，`<style>` 元素
- 元素特定样式，`style` 属性。

DOM2 为这 3 中应用样式的机制都提供了 API

### 16.2.1 存取样式

`style` 属性是 `CSSStyleDeclaration` 类型实例

在 CSS 中属性名是连字符表示法，但是到了 JavaScript 中需要使用驼峰法

```js
const myDiv = document.getElementById('myDiv');

myDiv.style.backgroundColor = 'red';

myDiv.style.width = '100px';
myDiv.style.height = '200px';

myDiv.style.border = '1px solid black';
```

#### 1.DOM 样式属性和方法

- `cssText` 包含 `style` 属性中的 CSS 代码
- `length` 应用给元素的 CSS 属性数量
- `parentRule` 表示 CSS 信息的 `CSSRule` 对象
- `getPropertyCSSValue(propertyName)`  返回包含CSS属性 `propertyName` 值的 `CSSValue` 对象，已废弃
- `getPropertyPriority(propertyName)` 如果使用了 `!important` 则返回 `"important"`，否则返回空字符串
- `getPropertyValue(propertyName)` 返回树形 `propertyName` 的字符串值
- `item(index)` 返回索引为 `index` 的 CSS 属性名
- `removeProperty(propertyName)` 从样式中删除 CSS 属性 `propertyName`
- `setProperty(propertyName, value, priority)` 设置 CSS 属性 `propertyName` 的值为 `value`、`priority` 是 `"important"` 或空字符串

#### 2.计算样式

- `document.defaultView.getComputedStyle()` 接收两个参数：要取得计算样式的元素和伪元素字符串，返回一个 `CSSStyleDeclaration` 对象，也就是获得不是在 `style` 属性上的样式

### 16.2.2 操作样式表

`CSSStyleSheet` 类型表示 CSS 样式表，包括 `<link>` 引入和 `<style>` 元素定义的样式表，继承自 `StyleSheet`

属性和方法

- `disabled`
- `href`
- `media`
- `ownerNode`
- `parentStyleSheet`
- `title`
- `type`
- `cssRules`
- `ownerRule`
- `deleteRule(index)`
- `insertRule(rule, index)`

`document.styleSheets` 表示文档中可用的样式表集合。

```js
let sheet = null;
for (let i = 0, len = document.styleSheets.length; i < len; i++) {
  sheet = document.styleSheets[i];
  console.log(sheet.href);
}
```



#### 1.CSS 规则

`CSSStyleRule` 继承自 `CSSRule`

可用的属性

- `cssText`
- `parentRule`
- `parentStyleSheet`
- `selectorText`
- `style`
- `type`

```css
div.box {
  background-color: blue;
  width: 100px;
  height: 200px;
}
```



```js
let sheet = document.styleSheets[0];
let rules = sheet.cssRules || sheet.rules;
let rule = rules[0];
console.log(rule.selectorText);  // "div.box"
console.log(rule.style.cssText);  // 完整的 CSS 代码
console.log(rule.style.backgroundColor);  // "blue"
console.log(rule.style.width);  // "100px"
console.log(rule.style.height);  // "200px"

rule.style.backgroundColor = 'red';  // 也可以修改样式
```



#### 2.创建规则

- `insertRule()` 向样式表中添加新规则，接收两个参数，规则的文本和表示插入位置的索引值

  ```js
  sheet.insertRule('body { background-color: silver; }', 0);  // 使用 DOM 方法
  ```

#### 3.删除规则

- `deleteRule()` 接收一个参数，要删除规则的索引

  ```js
  sheet.deleteRule(0);
  ```

  

### 16.2.3 元素尺寸

#### 1.偏移尺寸

4 个偏移尺寸的属性

- `offsetHeight` 元素在垂直方向上占用的像素尺寸，包括它的高度、水平滚动条高度（如果可见）和上、下边框的高度
- `offsetLeft` 元素左边框外侧距离包含距离包含元素左边框内侧的像素数
- `offsetTop` 元素上边框外侧距离包含元素上边框内侧的像素数
- `offsetWidth` 元素在水平方向上占用的像素尺寸，包括它的宽度、垂直滚动条宽度（如果可见）和左、右边框宽度

`offsetLeft`、`offsetTop` 是相对于包含元素的，包含元素保存在 `offsetParent` 属性中

![dimensions-offset](./i/dimensions-offset.png)

例子，确定一个元素在页面中的偏移量，一直加到根元素

```js
function getElementLeft(element) {
  let actualLeft = element.offsetLeft;
  let current = element.offsetParent;
  
  while (current !== null) {
    actualLeft += current.offsetLeft;
    current = current.offsetParent;
  }
  
  return actualLeft;
}
```



#### 2.客户端尺寸

包含元素内容及其内边距所占用的空间。

- `clientWidth` 内容区宽度加左、右内边距宽度
- `clientHeight` 内容器高度加上、下内边距高度

![dimensions-client](./i/dimensions-client.png)

#### 3.滚动尺寸

提供了元素内容滚动距离的信息。

- `scrollHeight` 没有滚动条出现时，元素内容的总高度
- `scrollLeft` 内容区左侧隐藏的像素数，设置这个属性可以改变元素的滚动位置
- `scrollTop` 内容区顶部隐藏的像素数，设置这个属性可以改变元素的滚动位置
- `scrollWidth` 没有滚动条出现时，元素内容的总宽度（也就是整个元素连同隐藏部分的宽度）

![scrollheight](./i/scrollheight.png)

`scrollHeight`、`scrollWidth` 在没有滚动条的情况下与 `clientHeight`、`clientWidth` 是分不清的，但是如果有滚动条，那么 `clientHeight` 与 `clientWidth` 等于视口的大小，`scrollWidth` 和 `scrollHeight` 等于文档大小

#### 4.确定元素尺寸

每个元素上暴露了

- `getBoundingClientRect()` 方法，返回一个 `DOMRect` 对象，包含6个属性，表示元素在页面中相对于视口的位置
  - `left`
  - `top`
  - `right`
  - `bottom`
  - `height`
  - `width`

![element-box-diagram](./i/element-box-diagram.png)

## 16.3 遍历

两个用于辅助顺序遍历 DOM 结构的类型：`NodeIterator`、`TreeWalker` 从某个起点开始执行对 DOM 结构的深度优先遍历

### 16.3.1 NodeIterator

通过 `document.createNodeIterator()` 创建，接收 4 个参数：

- `root` 作为遍历根节点的节点
- `whatToShow` 数值代码，表示应该访问那些节点
- `filter`，`NodeFilter` 对象或函数，表示是否接收或跳过特定节点
- `entityReferenceExpansion` 布尔值，表示是否扩展实体引用。这个参数在 HTML 文档中没有效果，因为实体引用永远不扩展

定义只接收 `<p>` 元素的节点过滤对象

```js
const filter = {
  acceptNode(node) {
    return node.tagName.toLowerCase() == 'p'
    	? NodeFilter.FILTER_ACCEPT
    	: NodeFilter.FILTER_SKIP;
  }
}

const iterator = document.createNodeIterator(root, NodeFilter.SHOW_ELEMENT, filter, false);
```



`NodeIterator` 主要方法

- `nextNode()` 在遍历中前进一步
- `previousNode()` 在遍历中后退一步

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NodeIterator</title>
  </head>
  <body>
    <div id="div1">
      <p><b>Hello</b> world!</p>
      <ul>
        <li>List item 1</li>
        <li>List item 2</li>
        <li>List item 3</li>
      </ul>
    </div>

    <script>
      const div = document.getElementById('div1');
      const iterator = document.createNodeIterator(div, NodeFilter.SHOW_ELEMENT, null, false);
      let node = iterator.nextNode();

      while (node !== null) {
        console.log(node.tagName);
        node = iterator.nextNode();
      }
      // DIV
      // P
      // B
      // UL
      // LIx3
    </script>

    <script>
      // 只想遍历 li
      const filter = node => node.tagName.toLowerCase() == 'li'
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_SKIP;

      const iterator1 = document.createNodeIterator(div, NodeFilter.SHOW_ELEMENT, filter, false);

      node = iterator1.nextNode();

      while (node !== null) {
        console.log(node.tagName);
        node = iterator1.nextNode();
      }
      // LIx3
    </script>
  </body>
</html>
```

### 16.3.2 TreeWalker

使用 `document.createTreeWalker()` 创建，接收与 `NodeIterator` 同样的参数

除了包含与 `NodeIterator` 的 `nextNode()`、`previousNode()` 方法，还有

- `parentNode()` 遍历到当前节点的父节点
- `firstChild()` 遍历到当前节点的第一个子节点
- `lastChild()` 遍历到当前节点的最后一个子节点
- `nextSibling()` 遍历到当前节点的下一个同胞节点
- `previousSibling()` 遍历到当前节点的上一个同胞节点

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TreeWalker</title>
  </head>
  <body>
    <div id="div1">
      <p><b>Hello</b> world!</p>
      <ul>
        <li>List item 1</li>
        <li>List item 2</li>
        <li>List item 3</li>
      </ul>
    </div>

    <script>
      const div = document.getElementById('div1');
      let walker = document.createTreeWalker(div, NodeFilter.SHOW_ELEMENT, null, false);

      walker.firstChild();  // 前往 <p>
      walker.nextSibling();  // 前往 <li>

      let node = walker.firstChild();
      while (node !== null) {
        console.log(node.tagName);
        node = walker.nextSibling();
      }
      // LIx3
    </script>
  </body>
</html>
```

相比起 `NodeIterator`，`TreeWalker` 类型提供更大的灵活性

## 16.4 范围

可用于在文档中选择内容

### 16.4.1 DOM 范围

每个范围都是 `Range` 类型的实例

```js
let range = document.createRange();
```

属性

- `startContainer`
- `startOffset`
- `endContainer`
- `endOffset`
- `commonAncestorContainer`
