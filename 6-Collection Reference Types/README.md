# 第6章 集合引用类型

表达式上下文 (expression context): 期待返回值的上下文

## 6.1 Object

创建对象的两种方式：

1. 使用 `new` 操作符和 `Object` **构造函数**

   ```js
   let person = new Object();
   person.name = "Nicholas";
   person.age = 29;
   ```

   

2. 使用**对象字面量** (object literal) 表示法

   ```js
   let person = {
       name: "Nicholas",
       age: 29
   };
   ```

   属性名可以是字符串或者数值，数值属性会自动转换为字符串

   ```js
   let person = {
       "name": "Nicholas",
       "age": 29,
       5: true  // 最后一个属性后面可以加上一个逗号，但是在旧版本浏览器会报错
   };
   ```

> **注意** 使用字面量定义对象时，并不会实际调用 Object 构造函数



对象属性存储方式

1. 点语法 (惯例)

2. 中括号，要在括号内使用属性名的字符串形式或者变量

   ```js
   console.log(person["name"]);  // "Nicholas"
   console.log(person["age"]);  // "Nicholas"
   
   let propertyName = "name";
   console.log(person[propertyName1]);  // "Nicholas"
   
   // 如果有可能导致语法错误的字符，或者包含关键字/保留字
   person["first name"] = "Nicholas";
   ```

   

## 6.2 Array

ECMAScript 数组每个槽位可以存储任意类型的数据

### 6.2.1 创建数组

1. 使用 Array 构造函数

   ```js
   let colors = new Array();
   ```

   ```js
   let colors = new Array(20);  // 创建 length 为 20 的数组
   ```

   ```js
   let colors = new Array("red", "green", "blue");  // 创建三个元素的数组
   ```

   ```js
   let colors = Array(3);  // 省略 new 操作符，效果一样
   ```

2. **数组字面量** (array literal)

   ```js
   let colors = ["red", "green", "blue"];
   let names = [];
   let values = [1, 2, ];  // 创建包含两个元素的数组，最后一个元素后面添加逗号
   ```

   > **注意** 与对象一样，在使用数组字面量表示法创建数组不会调用 Array 构造函数

3. ES6 新增：`Array.from()` `Array.of()` 方法

   ```js
   console.log(Array.from("Matt")); // ["M", "a", "t", "t"]
   ```

   ```js
   const m = new Map()
   ```

   ```js
   const m = new Map().set(1, 2)
                      .set(3, 4);
   const s = new Set().add(1)
                      .add(2)
                      .add(3)
                      .add(4);
   console.log(Array.from(m));  // [[1, 2], [3, 4]]
   console.log(Array.from(s));  // [1, 2, 3, 4]
   
   const iter = {
       *[Symbol.iterator]() {
   		yield 1;
   		yield 2;
   		yield 3;
   		yield 4;
       }
   };
   console.log(Array.from(iter));  // [1, 2, 3, 4]
   
   function getArgsArray() {
       return Array.from(arguments);
   }
   
   console.log(getArgsArray(1, 2, 3, 4));  // [1, 2, 3, 4]
   ```

   `Array.from()` 第二个参数，与第三个参数

   ```js
   console.log(getArgsArray(1, 2, 3, 4));
   const a1 = [1, 2, 3, 4];
   const a2 = Array.from(a1, x => x**2);
   const a3 = Array.from(a1, function(x) {
       return x**this.exponent;
   }, { exponent: 2 });
   console.log(a2);  // [1, 4, 9, 16]
   console.log(a3);  // [1, 4, 9, 16]
   ```

   

### 6.2.2 数组空位

使用一串逗号创建空位 (hole)

```js
const options = [,,,,,];  // 创建包含 5 个元素的数组
console.log(options.length);  // 5
console.log(options);  // [,,,,,]
console.log(Array.of(...[,,,]));  // [undefined, undefined, undefined]
```

> **注意** 避免使用数组空位，如果要创建空位，可以显式地用 `undefined` 值代替



### 6.2.3 数组索引

使用中括号并提供相应的值的数字索引

通过修改数组的 `length` 属性，可以动态修改数组长度

```js
let colors = ["red", "green", "blue"];
colors[99] = "black";  // 添加一种颜色， 3-98 位置的值都被 undefined 填充
alert(colors.length);  // 100
```

> **注意** 数组最多可以存 4294967295 个元素，如果超出这个长度，则会抛错



### 6.2.4 检测数组

- 使用 `instanceof` 操作符
- 使用 `Array.isArray()` 方法



### 6.2.5 迭代器方法

ES6 新增了 3 个用于检索数组内容的方法：`keys()`、`values()`、`entries()`

```js
const a = ["foo", "bar", "baz", "qux"];

const aKeys = Array.from(a.keys());
const aValues = Array.from(a.values());
const aEntries = Array.from(a.entries());

console.log(aKeys);  // [0, 1, 2, 3]
console.log(aValues);  // ["foo", "bar", "baz", "qux"]
console.log(aEntries);  // [[0, "foo"], [1, "bar"], [2, "baz"], [3, "qux"]]
```

```js
for (const [idx, element] of a.entries()) {
    console.log(idx);
    console.log(element);
}
// 0
// foo
// 1
// bar
// 2
// baz
// 3
```

### 6.2.6 复制和填充方法

ES6 新增两个方法

- 填充方法：`array.fill()`
- 复制方法：`array.copyWithin()`



### 6.2.7 转换方法

- `toLocaleString()` 方法
- `toString()` 方法
- `valueOf()` 方法
- `join()` 方法，接收一个参数，字符串分隔符，返回包含所有项的字符串（如果不传入参数或者传入 `undefined`，则仍然使用逗号分隔符）

```js
const colors = ["red", "green", "blue"];
console.log(colors.toLocaleString());  // red, green, blue
console.log(colors.toString());  // red, green, blue
console.log(colors.valueOf());  // ["red", "green", "blue"]
console.log(colors);  // ["red", "green", "blue"]
```

`toLocaleString()` 方法会调用成员的 `toLocaleString()`

`toString()` 方法会调用成员的 `toString()`

```js
const person1 = {
    toLocaleString() {
        return "Nikolaos";
    },

    toString() {
        return "Nicholas";
    }
};

const person2 = {
    toLocaleString() {
        return "Grigorios";
    },

    toString() {
        return "Greg";
    }
};

const people = [person1, person2];
console.log(people);
console.log(people.toString());  // Nicholas,Greg
console.log(people.toLocaleString());  // Nikolaos,Grigorios
```

> **注意** 如果数组中某一项是 `null` 或 `undefined`，则在 `join()`、`toLocaleString()`、`toString()`、`valueOf()` 返回的结果中会以空字符串表示



### 6.2.8 栈方法

栈结构，后进先出（LIFO，Last-In-First-Out）

栈方法：

- `push()`
- `pop()`



### 6.2.9 队列方法

队列结构，先进先出（FIFO，First-In-First-Out）

队列方法：

正方向队列

- `shift()`
- `push()`

反方向队列

- `unshift()`
- `pop()`



### 6.2.10 排序方法

- `reverse()` 将数组元素反向排列
- `sort()` 将数组元素排序，但是直接调用的话只会按照元素的字符串形式重新排序，接收一个**比较函数**
  - 比较函数接收两个参数（表示数组的前后两个比较的元素）
  - 如果第一个参数应该排列在第二个参数前面，就返回负数
  - 如果两个参数相等，就返回 0
  - 如果第一个参数应该排列在第二个参数后面，就返回正值

> **注意** `reverse()` 和 `sort()` 都返回调用它们的数组引用



### 6.2.11 操作方法

- `concat()` 创建一个当前数组的副本，然后再把它的参数添加到副本末尾，最后返回这个心构建的数组

  修改 `concat()` 方法的默认行为

  ```js
  const colors = ["red", "green", "blue"];
  const newColors = ["black", "brown"];
  const moreNewColors = {
      // 重写 concat 行为，强制打平类数组对象
      [Symbol.isConcatSpreadable]: true,
      length: 2,
      0: "pink",
      1: "cyan"
  };
  const moreNewColors2 = {
      length: 2,
      0: "pink",
      1: "cyan"
  };  // 如果不开启，则只当做对象添加
  
  newColors[Symbol.isConcatSpreadable] = false;
  
  const colors2 = colors.concat("yellow", newColors);
  const colors3 = colors.concat(moreNewColors);
  const colors4 = colors.concat(moreNewColors2);
  
  console.log(colors);
  console.log(colors2);
  console.log(colors3);
  console.log(colors4);
  ```

- `slice()` 创建一个包含原有数组中的一个或多个元素的新数组，可以接收两个参数，开始位置和结束位置

  > **注意** 如果结束位置小于开始位置，则返回空数组

- `splice()` 在数组中间插入元素

  - **删除**

    ```js
    const colors = ["red", "green", "blue"];
    // 删除
    let removed = colors.splice(0, 1);
    console.log(colors);  // ["green", "blue"]
    console.log(removed);  // ["red"]
    ```

  - **插入**

    ```js
    // 插入
    removed = colors.splice(1, 0, "yellow", "orange");
    console.log(colors);  // ["green", "yellow", "orange", "blue"]
    console.log(removed);  // 空数组
    ```

  - **替换**

    ```js
    // 替换
    removed = colors.splice(1, 1, "red", "purple");
    console.log(colors);  // ["green", "red", "purple", "orange", "blue"]
    console.log(removed);  // ["yellow"]
    ```

    

