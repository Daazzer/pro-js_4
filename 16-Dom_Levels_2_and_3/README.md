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