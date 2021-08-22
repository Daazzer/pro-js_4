# 第 14 章 DOM

文档对象模型（DOM，Document Object Model）是 HTML 和 XML 文档的编程接口

DOM Level 1 在 1998 年成为 W3C 推荐标准

> **注意** IE8 以下中的 DOM 是通过 COM 对象实现的。意味着与原生 JavaScript 对象具有不同的行为和功能

## 14.1 节点层级

`document` 表示每个文档的根节点。根节点的唯一子节点是 `<html>` 元素，我们称之为**文档元素**（`documentElement`）

每个文档只能有一个文档元素

- HTML 文档元素始终都是 `<html>`
- XML 任何文档元素都可能成为文档元素

DOM 中共有 12 种节点类型

### 14.1.1 Node 类型

DOM Level 1 描述了名为 `Node` 的接口，所有 DOM 节点类型都必须实现的。在 JavaScript 中被实现为 `Node` 类型

所有节点类型都继承 `Node` 类型，因此所有类型都共享相同的基本属性方法

每个节点都有 `nodeType` 属性，表示节点的类型

12 种节点类型：

- `Node.ELEMENT_NODE` (1)
- `Node.ATTRIBUTE_NODE` (2)
- `Node.TEXT_NODE` (3)
- `Node.CDATA_SECTION_NODE` (4)
- `Node.ENTITY_REFERENCE_NODE` (5)
- `Node.ENTITY_NODE` (6)
- `Node.PROCESSING_INSTRUCTION_NODE` (7)
- `Node.COMMENT_NODE` (8)
- `Node.DOCUMENT_NODE` (9)
- `Node.DOCUMENT_TYPE_NODE` (10)
- `Node.DOCUMENT_FRAGMENT_NODE` (11)
- `Node.NOTATION_NODE` (12)

#### 1.nodeName 与 nodeValue

对元素节点而言，`nodeName` 始终等于元素的标签名，`nodeValue` 始终等于 `null`

#### 2.节点关系

父子关系与兄弟关系

每个节点都有一个 `childNodes` 属性，其中包好一个 `NodeList` 实例（一个类数组对象），用于存储可以按位置存取的有序节点。`NodeList` 是实时的活动对象，不是内容快照

使用中括号或 `item()` 方法访问 `NodeList` 中的元素

```js
let firstChild = someNode.childNodes[0];
let secondChild = someNode.childNodes.item(1);
let count = someNode.childNodes.length;
```

每个节点都有：

- `parentNode` 属性，指向其 DOM 树中的父元素。`childNodes` 中的所有节点都有同一个父元素
- `childNodes` 列表中的每个节点都是同一列表中其他节点的同胞节点。使用 `previousSibling` 和 `nextSibling` 可以在这个列表的节点间导航，第一个节点的 `previousSibling` 和最后一个节点的 `nextSibling` 都是 `null`
-  `firstChild` 与 `lastChild` 表示第一个与最后一个子节点
- `hasChildNodes()` 方法检测当前节点是否含有子节点
- 所有节点都有一个 `ownerDocument` 属性，指向文档节点

#### 3.操纵节点

- `appendChild` 用于在 `childNodes` 列表末尾添加节点，如果把文档中已存在的节点传给 `appendChild()`，则这个节点会从之前的位置被转移到新位置
- `insertBefore()` 接收两个参数，要插入的节点与参照节点，将节点变为参照节点的前一个同胞，如果参照节点为 `null` 则效果与 `appendChild()` 相同
- `replaceChild()` 接收两个参数，要插入的节点与要替换的节点。要替换的节点会被返回并从文档树中删除
- `removeChild()` 接收一个参数，要删除的节点。用于移除文档中的节点

#### 4.其他方法

- `cloneNode()` 接收一个布尔值，表示对节点进行深赋值还是浅复制
- `normalize()` 处理文档子树中的文本节点，如果发现空文本节点，则将其删除；如果两个同胞节点是相邻的，则将其合并为一个文本节点

> **注意** `cloneNode()` 方法不会复制添加到 DOM 节点的 JavaScript 属性，比如事件处理程序。只复制 HTML 属性，以及可选的复制子节点。IE 在很长一段时间会复制事件处理程序，所以推荐在复制前先删除事件处理程序

### 14.1.2 Document 类型

JavaScript 中表示文档节点的类型。`Document` 类型可以表示 HTML 页面或其他 XML 文档

#### 1.文档子节点

访问 `Document` 子节点属性

- `document.documentElement` 属性，始终指向 HTML 页面的 `<html>` 元素
- `document.childNodes` 属性，含有 `documentElement` 元素
- `document.body` 属性，直接指向 `<body>` 元素
- `document.doctype` 属性，表示文档的声明 `<!doctype>`

#### 2.文档信息

- `document.title` 表示浏览器标签页标题，可读写
- `document.URL` 表示页面的完整 url
- `document.domain` 表示页面的域名
- `document.referrer` 表示来源，如果当前页面没有来源，则返回空串

#### 3.定位元素

获取元素的引用

- `document.getElementById()` 接收一个参数，要获取元素的 ID

- `document.getElementsByTagName()` 接收一个参数，要获取元素的标签名，返回一个 `HTMLCollection`

  - `document.getElementsByTagName('*')` 返回文档所有元素

- `document.getElementsByName()` 返回具有给定 `name` 属性的所有元素，常用于单选按钮

  ```html
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>定位元素</title>
    </head>
    <body>
      <fieldset>
        <legend>Which color do you prefer?</legend>
        <ul>
          <li>
            <input type="radio" value="red" name="color" id="colorRed">
            <label for="colorRed">Red</label>
          </li>
          <li>
            <input type="radio" value="green" name="color" id="colorGreen">
            <label for="colorGreen">Green</label>
          </li>
          <li>
            <input type="radio" value="blue" name="color" id="colorBlue">
            <label for="colorBlue">Blue</label>
          </li>
        </ul>
      </fieldset>
      <script>
        const radios = document.getElementsByName('color');
        console.log(radios);
      </script>
    </body>
  </html>
  ```

  这种情况下 `HTMLCollection` 的 `namedItem()` 方法只会取得第一项 

`HTMLCollection` 方法

- `HTMLCollection` 与 `NodeList` 一样支持 `item()`

- `namedItem()` 通过标签的 `name` 属性取得某一项的引用，或者使用对象形式访问

  ```js
  const images = document.getElementsByTagName('img');
  // 设置了 name 属性的元素可以通过对象形式访问
  const myImage = images.myImage;
  const myImage1 = images.namedItem('myImage');  // 与上面一样
  console.log(myImage);
  console.log(myImage1);
  ```

#### 4.特殊集合

访问文档公共部分的快捷方式

- `document.anchor` 包含文档中所有带 `name` 属性的 `<a>` 元素
- `doument.applets` 包含文档中所有 `<applet>` 元素，目前已经废弃
- `documet.forms` 包含文档中所有 `<form>` 元素
- `document.images` 包含文档中所有 `<img>` 元素
- `document.links` 包含文档中所有带 `href` 属性的 `<a>` 元素

#### 5.DOM 兼容性检测

- `document.implementation` 提供了与浏览器 DOM 实现相关的信息和能力

  - `document.implementation.hasFeature()` 接收两个参数，特性名称和 DOM 版本，返回一个布尔值，表示是否支持该特性

    由于实现不一致，此方法不可靠
