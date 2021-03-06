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

#### 6.文档写入

- `document.write()` 接收一个字符串，可以将这个字符串写入到网页中
- `document.writeln()` 接收一个字符串，可以将这个字符串写入到网页中，还会在末尾添加一个 `\n` 换行符
- `document.open()` 打开网页输出流
- `document.close()` 关闭网页输出流

### 14.1.3 Element 类型

`Element` 类型表示 XML 或 HTML 元素

#### 1.HTML 元素

所有 HTML 元素都通过 `HTMLElement` 类型表示，包括直接实例和间接实例。`HTMLElement` 直接继承 `Element` 并增加了一些属性

标准属性

- `id` 元素在文档中的唯一标识符
- `title` 包含元素的额外信息，通常以提示条形式展示
- `lang` 元素内容的语言代码（很少用）
- `dir` 语言的书写方向（"ltr" 从左到右，"rtl" 从右到左）
- `className` 相当于 `class` 属性，用于指定元素的 CSS 类（因为 `class` 是 ECMAScript 关键字，所以不能直接用这个名字）

所有 HTML 元素都是 `HTMLElement` 或其子类型的实例

#### 2.取得属性

与属性相关的 DOM 方法

- `element.getAttribute(attrName)` 获取当前元素的某个属性
- `element.setAttribute(attrName, attrValue)` 给元素的某个属性设置值
- `element.removeAttribute(attrName)` 删除元素的某个属性，整个删掉

```js
const div = document.getElementById('myDiv');
console.log(div.getAttribute('id'));
// 可以获取自定义属性
console.log(div.getAttribute('my-special-attribute'));
```

根据 HTML5 规范，自定义属性名应该前缀 `data-` 以方便验证

`getAttribute()` 通常用于取得自定义属性的值，其他属性会使用对象属性来访问

#### 3.设置属性

`element.setAttribute()` 同样适用于自定义属性，设置的属性名会规范未小写形式，因此 `ID` 会变成 `id`

**注意** 在 DOM 对象上自定义属性，不会自动让它变成元素的属性

```js
div.setAttribute('my-color', 'red');
div.getAttribute('my-color');  // red
div.myNum = 12;
div.getAttribute('myNum');  // null
```

#### 4.attributes 属性

`attributes` 属性包含一个 `NamedNodeMap` 实例，是一个类似 `NodeList` 的”实时“集合。元素的每个属性都表示为一个 `Attr` 节点

`NamedNodeMap` 方法

- `getNamedItem(name)` 返回 `nodeName` 属性等于 `name` 的节点
- `removeNamedItem(name)` 删除 `nodeName` 属性等于 `name` 的节点
- `setNamedItem(node)` 向列表中添加 `node` 节点，以其 `nodeName` 为索引
- `item(pos)` 返回索引位置 `pos` 处的节点

`NamedNodeMap` 中每个节点的属性

- `nodeName` 属性名字

- `nodeValue` 属性值

  ```js
  const id = element.attribute.getNamedItem('id').nodeValue;
  ```

#### 5.创建元素

`document.createElement()` 接收一个参数，元素的标签名。注意，在 HTML 中，标签名不区分大小写，而 XML 文档中是区分的

#### 6.元素后代

`node.childNodes` 属性包含元素所有的子节点

`node.getElementsByTagName` 用于获取某个元素下面的所有层级子节点

### 14.1.4 Text 类型

表示包含按字面解释的纯文本，也可能包含转义后的 HTML 字符串，但不含 HTML 代码

操作文本的方法

- `appendData(text)` 向节点末尾添加文本 `text`
- `deleteData(offset, count)` 从位置 `offset` 开始删除 `count` 个字符
- `insertData(offset, text)` 在位置 `offset` 插入 `text`
- `replaceData(offset, count, text)` 用 `text` 替换从位置 `offset` 到 `offset` + `count` 的文本
- `splitText(offset)` 在位置 `offset` 将当前文本节点拆分为两个文本节点
- `substringData(offset, count)` 提取从位置 `offset` 到 `offset` + `count` 的文本

```html
<!-- 没有内容，因此没有文本节点 -->
<div></div>
<!-- 有空格，有一个文本节点 -->
<div> </div>
<!-- 有内容，有一个文本节点 -->
<div>Hello World!</div>
```

可以通过 `nodeValue` 属性修改文本节点内容

```js
const textNode = div.firstChild;
textNode.nodeValue = 'Some <strong>other</strong> message';
```

#### 1.创建文本节点

- `document.createTextNode()` 接收一个参数，要插入节点的文本

#### 2.规范化文本节点

- `node.normalize()` 用于合并相邻的文本节点

浏览器在解析文档时，永远不会创建同胞文本节点。同胞文本节点只会出现在 DOM 脚本生成的文档树中

#### 3.拆分文本节点

与 `normalize()` 完全相反的方法

- `node.splitText()` 可以在指定的偏移位置拆分 `nodeValue`

### 14.1.5 Comment 类型

表示 DOM 中的注释，不支持子节点

`document.createComment()` 创建一个注释节点

属性与方法

- `comment.splitText()` 拆分注释，与 `text.splitText()` 类似
- `comment.data` 访问注释内容

### 14.1.6  CDATASection 类型

表示 XML 中特有的 CDATA 区块。不支持子节点

CDATA 区块只在 XML 文档中有效

在真正的 XML 文档中，可以使用 `document.createCDataSection()`

### 14.1.8 DocumentFragment 类型

文档片段是“轻量级”文档，能够包含和操作节点，却没有完整文档那样额外的消耗

不能直接把文档片段添加到文档。文档片段的作用是充当其他要被添加到文档的节点的仓库

使用 `document.createDocumentFragment()`

可以通过 `appendChild()` 或 `insertBefore()` 方法将文档片段的内容添加到文档

```js
const fragment = document.createDocumentFragment();
const ul = document.getElementById('myList');

for (let i = 0; i < 3; i++) {
	const li = document.createElement('li');
  li.appendChild(document.createTextNode(`Item ${i + 1}`));
  fragment.appendChild(li);
}

ul.appendChild(fragment);
```

### 14.1.9 Attr 类型

表示 DOM 中的 `attributes` 属性中的节点，在 HTML 中不支持子节点；在 XML 中子节点可以是 `Text` 或 `EntityReference`

通常是使用 `getAttribute()`、`removeAttribute()`、`setAttribute()` 方法操作属性

属性

- `name` 属性名（与 nodeName 一样）
- `value` 属性值 （与 nodeValue 一样）
- `specified` 布尔值，表示属性使用的是默认值还是被指定的值

`document.createAttribute()` 创建 `Attr` 节点

```js
const attr = document.createAttribute('align');  // 直接可以设置节点的 name 属性
attr.value = 'left';
element.setAttributeNode(attr);

alert(element.attributes['align'].value);  // 'left'
alert(element.getAttributeNode('align').value);  // 'left'
alert(element.getAttribute('align'));  // 'left'
```

> **注意** 推荐使用 `getAttribute()`、`removeAttribute()`、`setAttribute()` 方法操作属性，而不是直接操作属性节点

## 14.2 DOM 编程

通过 JavaScript 实现 DOM 操作

### 14.2.1 动态脚本

两种方式通过 `<script>` 动态为网页添加脚本

- 通过 `src` 引入外部文本
- 直接插入源代码

```html
<script src="foo.js"></script>
```

通过 js 创建

```js
const script = document.createElement('script');
script.src = 'foo.js';
document.body.appendChild(script);
```

通过 `innerHTML` 创建的 `<script>` 元素永远不会执行

### 14.2.2 动态样式

CSS 在 HTML 中两种方法加载

- `<link>` 元素引用外部文件
- `<style>` 元素用于添加嵌入样式

```html
<link rel="stylesheet" type="text/css" href="styles.css">
```

使用 js 创建

```js
const link = document.createElement('link');
link.rel = 'stylesheet';
link.type = 'text/css';
link.href = 'style.css';
const head = document.getElementsByTagName('head')[0];
head.appendChild(link);
```

外部文件加载样式是一个异步过程。与 JavaScript 代码加载并没有先后顺序

### 14.2.3 操作表格

DOM 创建 `<table>` 元素

```js
const table = document.createElement('table');
```

`<table>` 元素的属性和方法

- `caption` 指向 `<caption>` 元素的指针
- `tBodies` 包含 `<tbody>` 元素的 `HTMLCollection`
- `tFoot` 指向 `<tfoot>` 元素
- `tHead` 指向 `<thead>` 元素
- `rows` 包含所有行的 `HTMLCollection`
- `createTHead()` 创建 `<thead>` 元素，放到表格中，返回引用
- `createTFoot()` 创建 `<tfoot>` 元素，放到表格中，返回引用
- `createCaption()` 创建 `<caption>` 元素，放到表格中，返回引用
- `deleteTHead()` 删除 `<thead>` 元素
- `deleteRow(pos)` 删除给定位置的行
- `insertRow(pos)` 在集合中给定位置插入一行

`<tbody>` 元素的属性方法

- `rows` 包含 `<tbody>` 中所有行的 `HTMLCollection`
- `deleteRow(pos)` 删除给定位置的行
- `insertRow(pos)` 在集合中给定位置插入一行

`<tr>` 元素属性方法

- `cells` 包含 `<tr>` 元素所有表元的 `HTMLCollection`
- `deleteCell(pos)` 删除给定位置的表元
- `insertCell(pos)` 在表元集合给定位置插入一个表元，返回该表元的引用

### 14.2.4 使用 NodeList

`NodeList` 相关的 `NamedNodeMap`、`HTMLCollection`。这3个集合都是实时的，文档变化会实时更新

迭代 `NodeList` 而不导致无限循环

```js
const divs = document.getElementsByTagName('div');

for (let i = 0, len = divs.length; i < len; i++) {
  const div = document.createElement('div');
  document.body.appendChild(div);
}
```

如果不想多初始化一个变量，还可以反向迭代集合

```js
const divs = document.getElementsByTagName('div');

for (let i = divs.length - 1; i <= 0; i--) {
  const div = document.createElement('div');
  document.body.appendChild(div);
}
```

## 14.3 MutationObserver 接口

`MutationObserver` 接口可以在 DOM 被修改时异步执行回调，可以用于观察整个文档、DOM 数的一部分，或某个元素

> **注意** 新引进的 `MutationObserver` 接口是为了取代废弃的 `MutationEvent`

### 14.3.1 基本用法

通过调用 `MutationObserver` 构造函数并传入一个回调函数来创建

```js
const observer = new MutationObserver(() => console.log('DOM was mutated!'));
```

#### 1.observe() 方法

使用 `observe()` 方法将 `MutationObserver` 实例与 DOM 关联起来

```js
const observer = new MutationObserver(() => console.log('<body> attributes changed'));

observer.observe(document.body, { attributes: true });
// 执行以上代码，<body> 元素上任何属性发送变化都会被这个 MutationObserver 实例发现

document.body.className = 'foo';

console.log('Changed body class');

// Changed body class
// <body> attributes changed
```

#### 2.回调与 MutationRecord

每次回调执行都会传入一个包含按顺序入队的 `MutationRecord` 实例的数组

```js
const observer = new MutationObserver(mutationRecords => console.log(mutationRecords));
observer.observe(document.body, { attributes: true });
document.body.setAttribute('foo', 'bar');
// [
//   {
//     addedNodes: NodeList [],
//     attributeName: "foo",
//     attributeNamespace: null,
//     nextSibling: null,
//     oldValue: null,
//     previousSibling: null,
//     removedNodes: NodeList [],
//     target: body,
//     type: "attributes"
//   }
// ]
```

连续修改会生成多个 `MutationRecord` 实例，下次回调执行时就会收到包含所有这些实例的数组

传给回调的第二个参数就是观察变化的 `MutationRecord` 实例

```js
const observer = new MutationObserver((mutationRecords, mutationObserver) => console.log(mutationRecords, mutationObserver));
observer.observe(document.body, { attributes: true });
document.body.className = 'foo';
// [MutationRecord], MutationObserver
```

#### 3.disconnect() 方法

要提前终止回调执行，可以调用 `disconnect()` 方法

```js
const observer = new MutationObserver(() => console.log('<body> attributes changed'));

observer.observe(document.body, { attributes: true });

document.body.className = 'foo';

observer.disconnect();

document.body.className = 'bar';

// 没有日志输出
```

#### 4.复用 MutationObserver

多次调用 `observer()` 方法，可以复用一个 `MutationObserver` 对象观察多个不同的目标节点

```js
const observer = new MutationObserver(mutationRecords => console.log(mutationRecords.map(x => x.target)));

// 向页面主体添加两个子节点
const childA = document.createElement('div'),
      childB = document.createElement('span');
document.body.appendChild(childA);
document.body.appendChild(childB);

observer.observe(childA, { attributes: true });
observer.observe(childB, { attributes: true });

childA.setAttribute('foo', 'bar');
childB.setAttribute('foo', 'bar');

// [<div>, <span>]
```

`disconnect()` 方法是一刀切的方案，它会停止观察所有目标

#### 5.重用 MutationObserver

`disconnect()` 方法不会结束 `MutationObserver` 的生命。还可以重新调用

```js
const observer = new MutationObserver(() => console.log('<body> attributes changed'));

observer.observe(document.body, { attributes: true });

// 这行代码会触发变化事件
document.body.setAttribute('foo', 'bar');

setTimeout(() => {
  observer.disconnect();
  
  // 这行代码不会触发变化事件
  document.body.setAttribute('bar', 'baz');
});

setTimeout(() => {
  // 重用
  observer.observe(document.body, { attributes: true });

  // 这行代码会触发变化事件
  document.body.setAttribute('baz', 'qux');
});

// <body> attributes changed
// <body> attributes changed
```

### 14.3.2 MutationObserverInit 与观察范围

用于控制对目标节点的观察范围，也就是 `MutationObserver` 构造器的第二个参数的配置对象

#### 1.观察属性

将 `attributes` 属性改为 `true`

```js
const observer = new MutationObserver(mutataionRecords => console.log(mutataionRecords));

observer.observe(document.body, { attributes: true });
```

`attributeFilter` 属性用于设置白名单

```js
const observer = new MutationObserver(mutataionRecords => console.log(mutataionRecords));

observer.observe(document.body, { attributeFilter: ['foo'] });

// 白名单属性
document.body.setAttribute('foo', 'bar');

// 被排除的属性
document.body.setAttribute('baz', 'qux');

// 只有foo属性变化被记录了
// [MutationRecord]
```

`attributeOldValue` 属性用于保存属性原来的值

```js
const observer = new MutationObserver(mutataionRecords => console.log(mutataionRecords.map(x => x.oldValue)));

observer.observe(document.body, { attributeOldValue: true });

document.body.setAttribute('foo', 'bar');
document.body.setAttribute('foo', 'baz');
document.body.setAttribute('foo', 'qux');

// 每次变化都保留了上一次的值
// [null, 'bar', 'baz']
```

#### 2.观察字符数据

- `characterData` 属性设置为 `true` 用于观察文本节点
- `characterDataOldValue` 设置为 `true` 用于记录上次的值

#### 3.观察子节点

- `childList` 属性设置为 `true`

对子节点**重新排序**会报告两次变化事件，因为技术上会涉及先移除和再添加

#### 4.观察子树

- `subtree` 属性设置为 `true`

被观察的子树被移出子树之后仍然能触发变化事件。

### 14.3.3 异步回调与记录队列

每次的变化信息都保存在 `MutationRecord` 实例中，然后添加到**记录队列**

#### 1.记录队列

仅当前没有已排期的微任务回调时，才会将观察者注册的回调作为微任务调度到任务队列上。回调要负责处理这个数组的每一个实例，因为函数退出之后这些实现就不存在了。

#### 2.takeRecords() 方法

调用 `MutationObserver` 实例的 `takeRecords()` 方法可以清空记录队列，取出并返回其中的所有 `MutationRecord` 实例

### 14.3.4 性能、内存与垃圾回收

理解使用 `MutationObserver` 带来的代价

#### 1.MutationObserver 的引用

`MutataionObserver` 拥有对观察目标的弱引用，不妨碍垃圾回收

然而，目标节点却对 `MutationObserver` 的强引用

#### 2.MutationRecord 的引用

如果需要尽快地释放内存，建议从每个 `MutationRecord` 中抽取出最有用的信息，然后保存到一个新对象中，最后抛弃 `MutationRecord`
