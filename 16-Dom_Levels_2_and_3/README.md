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
