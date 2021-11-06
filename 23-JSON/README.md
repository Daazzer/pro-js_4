# 第 23 章 JSON

JavaScript 对象简谱（JSON，JavaScript Object Notation）标准，即 RFC 4627。JSON  是 JavaScript 的严格子集，利用 JavaScript 中的几种模式来表示结构化数据。

JSON 不属于 JavaScript，它们只是拥有相同的语法而已。JSON 也不是只能在 JavaScript 中使用，它是一种通用数据格式。很多语言都有解析和序列化 JSON 的内置能力

## 23.1 语法

JSON 语法支持表示 3 中类型的值

- **简单值** 字符串、数值、布尔值和 `null` 可以在 JSON 中出现，就像在 JavaScript 中一样。特殊值 `undefined` 不可以
- **对象** 第一种复杂数据类型，对象表示有序键/值对。每个值可以是简单值，也可以是复杂类型。
- **数组** 第二种复杂数据类型，数组表示可以通过数值索引访问的值的有序列表。数组的值可以是任意类型，包括简单值、对象，甚至其他数组。

JSON 没有变量、函数或对象实例的概念。JSON 的所有记号都只为表示结构化数据，虽然它借用了 JavaScript 的语法，但是千万不要把它跟 JavaScript 语言混淆

### 23.1.1 简单值

简单的 JSON 可以是一个数值。也可以是一个字符串、布尔值和 `null`

JavaScript 字符串与 JSON 字符串的区别主要是，JSON 字符串必须用双引号

### 23.1.2 对象

JSON 中的对象必须用双引号把属性名包围起来

```json
{
	"name": "Nicholas",
  "age": 29,
  "school": {
    "name": "Merrimack College",
    "location": "North Andover, MA"
  }
}
```

同一个对象不能同时出现两个相同的属性

