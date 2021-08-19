# 第 14 章 DOM

文档对象模型（DOM，Document Object Model）是 HTML 和 XML 文档的编程接口

DOM Level 1 在 1998 年成为 W3C 推荐标准

> IE8 以下中的 DOM 是通过 COM 对象实现的。意味着与原生 JavaScript 对象具有不同的行为和功能

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

- `Node.ELEMENT_NODE`(1)
- `Node.ATTRIBUTE_NODE`(2)
- `Node.TEXT_NODE`(3)
- `Node.CDATA_SECTION_NODE`(4)
- `Node.ENTITY_REFERENCE_NODE`(5)
- `Node.ENTITY_NODE`(6)
- `Node.PROCESSING_INSTRUCTION_NODE`(7)
- `Node.COMMENT_NODE`(8)
- `Node.DOCUMENT_NODE`(9)
- `Node.DOCUMENT_TYPE_NODE`(10)
- `Node.DOCUMENT_FRAGMENT_NODE`(11)
- `Node.NOTATION_NODE`(12)

#### 1.nodeName 与 nodeValue

对元素节点而言，`nodeName` 始终等于元素的标签名，`nodeValue` 始终等于 `null`

#### 2.节点关系

父子关系与兄弟关系

每个节点都有一个 `childNodes` 属性，其中包好一个 `NodeList` 实例（一个类数组对象），用于存储可以按位置存取的有序节点。

`NodeList` 是实时的活动对象，不是内容快照

使用中括号或 `item()` 方法访问 `NodeList` 中的元素

```js
let firstChild = someNode.childNodes[0];
let secondChild = someNode.childNodes.item(1);
let count = someNode.childNodes.length;
```

每个节点都有一个 `parentNode` 属性，指向其 DOM 树中的父元素。`childNodes` 中的所有节点都有同一个父元素

`childNodes` 列表中的每个节点都是同一列表中其他节点的同胞节点。使用 `previousSibling` 和 `nextSibling` 可以在这个列表的节点间导航，第一个节点的 `previousSibling` 和最后一个节点的 `nextSibling` 都是 `null`

父节点的 `firstChild` 与 `lastChild` 表示第一个与最后一个子节点

节点的 `hasChildNodes()` 方法检测当前节点是否含有子节点

所有节点都有一个 `ownerDocument` 属性，指向文档节点

