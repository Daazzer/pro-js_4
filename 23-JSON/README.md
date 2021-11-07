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

### 23.1.3 数组

数组在 JSON 中使用 JavaScript 的数组字面量形式表示

```json
[25, "hi", true]
```

复杂数组

```json
[
  {
    "title": "Professional JavaScript",
    "authors": [
      "Nicholas C. Zakas",
      "Matt Frisbie"
    ],
    "edition": 4,
    "year": 2017
  },
  {
    "title": "Professional JavaScript",
    "authors": [
      "Nicholas C. Zakas"
    ],
    "edition": 3,
    "year": 2011
  }
]
```



## 23.2 解析与序列化

JSON 可以直接被解析成可用的 JavaScript 对象。

### 23.2.1 对象

JSON 对象有两个静态方法：

- `stringify()` 将 JavaScript 序列化为 JSON 字符串
- `parse()` 将 JSON 解析为原生 JavaScript 值

### 23.2.2 序列化选项

`JSON.stringify()` 除了接收一个对象参数，还可以接收两个参数。过滤器，可以是数组或函数；用于缩进结果 JSON 字符串的选项

#### 1.过滤结果

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>过滤结果</title>
</head>
<body>
  <script>
    const book = {
      title: 'Professional JavaScript',
      authors: [
        'Nicholas C. Zakas',
        'Matt Frisbie'
      ],
      edition: 4,
      year: 2017
    };
    const jsonText = JSON.stringify(book, ['title', 'edition']);

    console.log(jsonText);  // {"title":"Professional JavaScript","edition":4}
    const jsonText1 = JSON.stringify(book, (key, value) => {
      switch(key) {
        case 'authors': return value.join(',');
        case 'year': return 5000;
        case 'edition': return undefined;  // 返回 undefined 会把属性删除
        default: return value;
      }
    });
    console.log(jsonText1);  // {"title":"Professional JavaScript","authors":"Nicholas C. Zakas,Matt Frisbie","year":5000}
  </script>
</body>
</html>
```



#### 2.字符串缩进

`JSON.stringify()` 第三个参数控制缩进和空格

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>字符串缩进</title>
</head>
<body>
  <script>
    const book = {
      title: 'Professional JavaScript',
      authors: [
        'Nicholas C. Zakas',
        'Matt Frisbie'
      ],
      edition: 4,
      year: 2017
    };
    const jsonText = JSON.stringify(book, null, 4);

    console.log(jsonText);
    /* 
    {
        "title": "Professional JavaScript",
        "authors": [
            "Nicholas C. Zakas",
            "Matt Frisbie"
        ],
        "edition": 4,
        "year": 2017
    }
     */
  </script>
</body>
</html>
```



#### 3.toJSON() 方法

可以在要序列化的对象中添加 `toJSON()` 方法，序列化时会基于这个方法返回适当的 JSON 表示

`toJSON()` 方法可以与过滤函数一起用

在把对象传给 `JSON.stringify()` 时会执行如下步骤

1. 如果可以获取实际的值，则调用 `toJSON()` 方法获取实际的值，否则使用默认的序列化
2. 如果提供了第二个参数，则应用过滤函数的值就是第 1 步返回的值
3. 第 2 步返回的每个值都会相应地进行序列化
4. 如果提供了第 3 个参数，则相应地进行缩进

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>toJSON() 方法</title>
</head>
<body>
  <script>
    const book = {
      title: 'Professional JavaScript',
      authors: [
        'Nicholas C. Zakas',
        'Matt Frisbie'
      ],
      edition: 4,
      year: 2017,
      toJSON: () => 'aaa'
    };
    const jsonText = JSON.stringify(book);

    console.log(jsonText);  // "Professional JavaScript"
  </script>
</body>
</html>
```



### 23.2.3 选项解析

`JSON.parse()` 可以接受第二个参数：为一个函数，这个函数会针对每个键/值对调用一次。被称为**还原函数**（reviver），如果还原函数返回 `undefined`，则结果中就会删除相应的的键

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>解析选项</title>
</head>
<body>
  <script>
    const book = {
      title: 'Professional JavaScript',
      authors: [
        'Nicholas C. Zakas',
        'Matt Frisbie'
      ],
      edition: 4,
      year: 2017,
      releaseDate: new Date(2017, 11, 1)
    };
    const jsonText = JSON.stringify(book);
    const bookCopy = JSON.parse(jsonText, (key, value) => key == 'releaseDate' ? new Date(value) : value);

    console.log(bookCopy);  // {title: 'Professional JavaScript', authors: Array(2), edition: 4, year: 2017, releaseDate: Fri Dec 01 2017 00:00:00 GMT+0800 (中国标准时间)}
    console.log(bookCopy.releaseDate.getFullYear());  // 2017
  </script>
</body>
</html>
```

