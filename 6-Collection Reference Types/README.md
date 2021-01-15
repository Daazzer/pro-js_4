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




### 6.2.12 搜索和位置方法

#### 1. 严格相等

- `indexOf()`
- `lastIndexOf()`
- `includes()`

在比较第一个参数跟数组每一项时，会使用全等 `===` 比较

#### 2. 断言函数

每个索引都会调用这个函数。断言函数的返回值决定了相应索引的元素是否被认为匹配

- `find()` 返回第一个匹配的元素

- `findIndex()` 返回第一个匹配元素的索引

  ```js
  const people = [
      {
          name: "Matt",
          age: 27
      },
      {
          name: "Nicholas",
          age: 29
      }
  ];
  
  console.log(people.findIndex((element, index, array) => element.age < 28));  // 0
  ```

找到匹配项之后，这两个方法都不再继续搜索



### 6.2.13 迭代方法

每个方法接收两个参数：以每一项为参数运行的函数，以及可选的作为函数运行上下文的作用域对象（影响函数中 `this` 的值）

- `every()` 对每一项函数都返回 `true`，则这个方法返回 `true`
- `filter()` 函数返回 `true` 的项会组成数组之后返回
- `forEach()` 对数组每一项都会运行传入函数，没有返回值
- `map()` 返回由每次函数调用的结果构成的数组
- `some()` 如果有一项函数返回 `true`，则这个方法返回 `true`



### 6.2.14 归并方法

- `reduce()`
- `reduceRight()`

回调都接收 4 个参数：上一个归并值、当前项、当前项的索引和数组本身

两个方法除了遍历方向之外，没有区别



## 6.3 定型数组

ECMAScript 新增的结构，目的是提升向原生库传输数据的效率，是一种特殊的包含数值类型的数组

### 6.3.1 历史

2006 年，Mozilla、Opera 等浏览器实验性地在浏览器中增加了用于渲染复杂图形应用程序的编程平台，无需安装任何插件

#### 1. WebGL

2011 年发布 1.0 版，早期因为 JavaScript 数组与原生数组之间不匹配，所以出现性能问题

#### 2. 定型数组

Mozilla 实现了 `CanvasFloatArray` 最终成为 `Float32Array`



### 6.3.2 ArrayBuffer

`ArrayBuffer` 实际上是所有定型数组及视图引用的基本单位

`ArrayBuffer()` 是一个普通的 JavaScript 构造函数，可以用于在内存中分配特定数量的字节空间

```js
const buf = new ArrayBuffer(16);  // 在内存中分配 16 字节
console.log(buf.byteLength);
```



`ArrayBuffer` 已经创建就不能再调整大小，可以使用 `slice()` 复制其全部或部分到一个新实例中

```js
// 一旦创建就不能调整大小
const buf1 = new ArrayBuffer(16);
const buf2 = buf1.slice(4, 12);
console.log(buf2.byteLength);
```



不能仅通过对 `ArrayBuffer` 的引用就读取或写入其内容。要读取或写入 `ArrayBuffer`，就必须通过视图。视图有不同的类型，但是引用的都是 `ArrayBuffer` 中存储的二进制数据



### 6.3.3 DataView

第一种允许读写 `ArrayBuffer` 的视图是 `DataView`，其 API 支持对缓冲数据的高度控制

必须对已有的 `ArrayBuffer` 读写才能创建 `DataView` 实例。这个实例可以使用全部或部分 `ArrayBuffer`

```js
const buf = new ArrayBuffer(16);
// DataView 默认使用整个 ArrayBuffer
const fullDataView = new DataView(buf);

console.log(fullDataView.byteOffset);  // 0
console.log(fullDataView.byteLength);  // 16
console.log(fullDataView.buffer === buf);  // true
```

```js
// 接受一个可选的字节偏移量和字节长度
const firstHalfDataView = new DataView(buf, 0, 8);
console.log(firstHalfDataView.byteOffset);  // 0
console.log(firstHalfDataView.byteLength);  // 8
console.log(firstHalfDataView.buffer === buf);  // true
```

```js
// 如果不指定，则 DataView 会使用剩余的缓冲
const secondHalfDataView = new DataView(buf, 8);
console.log(secondHalfDataView.byteOffset);  // 8
console.log(secondHalfDataView.byteLength);  // 8
console.log(secondHalfDataView.buffer === buf);  // true
```

要通过 `DataView` 读取缓冲，还需要几个组件

- 字节偏移量
- ElementType 实现 JavaScript 的 `Number` 类型到缓冲内二进制格式的转换
- 内存中值的字节序

#### 1. ElementType

`DataView` 对存储在缓冲中的数据类型没有预设。而是通过暴露的 API 强制开发者在读、写时指定一个 `ElementType`

8 种不同的 `ElementType`

| ElementType | 字节 | 说明                 |
| ----------- | ---- | -------------------- |
| Int8        | 1    | 8位有符号整数        |
| Uint8       | 1    | 8位无符号整数        |
| Int16       | 2    | 16位有符号整数       |
| Uint16      | 2    | 16位无符号整数       |
| Int32       | 4    | 32位有符号整数       |
| Uint32      | 4    | 32位无符号整数       |
| Float32     | 4    | 32位 IEEE-754 浮点数 |
| Float64     | 8    | 64位 IEEE-754 浮点数 |



`DataView` 为每中类型暴露了 `get` `set` 方法

```js
const buf = new ArrayBuffer(2);
const view = new DataView(buf);

// 说明整个缓确实所有二进制位都是 0
// 检查第一个和第二个字符
console.log(view.getInt8(0));  // 0
console.log(view.getInt8(1));  // 0

// 检查整个缓冲区
console.log(view.getInt16(0));  // 0

// 将整个缓冲区都设置为 1
view.setUint8(0, 255);
// DataView 自动将数据转换为特定的 ElementType
view.setUint8(1, 0xFF);
console.log(view);

console.log(view.getInt16(0));  // -1
```



#### 2. 字节序

**字节序** 指的是计算机维护的一种字节顺序的约定。`DataView` 只支持两种约定：大端字节序和小端字节序

`DataView` 默认使用大端字节序

```js
const buf = new ArrayBuffer(2);
const view = new DataView(buf);

view.setUint8(0, 0x80);  // 设置左边第一位为 1
view.setUint8(1, 0x01);  // 设置最右边的位等于 1
// 按大端字节序读取 Uint16
// 0x80 是高字节，0x01 是低字节
console.log(view.getUint16(0));  // 32769
// 按小端字节序读取 Uint16
// 0x01 是高字节，0x80 是低字节
console.log(view.getUint16(0, true)); // 384

// 按大端字节序写入 Uint16
view.setUint16(0, 0x0004);
console.log(view.getUint8(0));  // 0
console.log(view.getUint8(1));  // 4

// 按小端字节序写入 Uint16
view.setUint16(0, 0x0002, true);
console.log(view.getUint8(0));  // 2
console.log(view.getUint8(1));  // 0
```



#### 3. 边界情况

`DataView` 完成读写操作的前提是必须有充足的缓冲区，否则就会抛出 `RangeError`

```js
const buf = new ArrayBuffer(6);
const view = new DataView(buf);

// 尝试读取部分超出缓冲范围的值
view.getInt32(4);  // RangeError
```



### 6.3.4 定型数组

是另一种形式的 `ArrayBuffer` 视图。它特定一种 `ElementType` 且遵循系统原生的字节序

定型数组的性能会更高，底层运算速度更快

创建定型数组的两种方法

- `<ElementType>.from()`
- `<ElementType>.of()`

```js
const buf = new ArrayBuffer(12);
// 创建一个引用该缓冲的 Int32Array
const ints = new Int32Array(buf);
// 这个定型数组知道自己的每个元素需要 4 字节
// 因此长度为 3
console.log(ints.length);  // 3
```

```js
// 创建一个长度为 6 的 Int32Array
const ints2 = new Int32Array(6);
// 每个数值使用 4 字节，因此 ArrayBuffer 是 24 字节
console.log(ints2.length);  // 3
// 类似 DataView，定型数组也有一个指向关联缓冲的引用
console.log(ints2.buffer.byteLength);  // 4*6 === 24
```

```js
// 创建一个 [2, 4, 6, 8] 的 Int32Array
const ints3 = new Int32Array([2, 4, 6, 8]);
console.log(ints3.length);  // 4
console.log(ints3.buffer.byteLength);  // 16
console.log(ints3[2]);  // 6
```

```js
// 通过复制 ints3 的值创建一个 Int16Array
const ints4 = new Int16Array(ints3);
console.log(ints4.length);  // 4
console.log(ints4.buffer.byteLength);  // 8
console.log(ints4[2]);  // 6
```

```js
// 使用 from 方法创建
const ints5 = Int16Array.from([3, 5, 7, 9]);
console.log(ints5.length);  // 4
console.log(ints5.buffer.byteLength);  // 8
```

```js
// 使用 of 方法基于传入的参数创建
const floats = Float32Array.of(3.14, 2.718, 1.618);
console.log(floats.length);  // 3
console.log(floats.buffer.byteLength);  // 12
console.log(floats[2]);  // 1.6180000305175781
```

```js
// BYTES_PER_ELEMENT 属性，返回该类型数组中每个元素的字节大小
console.log(Int16Array.BYTES_PER_ELEMENT);  // 2
console.log(Int32Array.BYTES_PER_ELEMENT);  // 4
console.log(ints.BYTES_PER_ELEMENT);  // 4

const float = new Float64Array(1);
console.log(float.BYTES_PER_ELEMENT);  // 8
```



#### 1. 定型数组行为

很多方面来看，定型数组与普通数组都很相似

- `[]`
- `copyWithin()`
- `entries()`
- `every()`
- `fill()`
- `filter()`
- `find()`
- `findIndex()`
- `forEach()`
- `indexOf()`
- `join()`
- `keys()`
- `lastIndexOf()`
- `length`
- `map()`
- `reduce()`
- `reduceRight()`
- `reverse()`
- `slice()`
- `some()`
- `sort()`
- `toLocaleString()`
- `toString()`
- `values()`

返回新数组的方法也会返回包含同样元素类型的新定型数组

定型数组有一个 `Symbol.iterator` 符号属性，因此可以通过 `for-of` 循环

#### 2. 合并、复制和修改定型数组

- `set()`
- `subarray()`

```js
// 创建长度为 8 的 int16 数组
const container = new Int16Array(8);
// 把定型数组复制为前 4 个值
// 偏移量默认为索引 0
container.set(Int8Array.of(1, 2, 3, 4));
console.log(container);  // Int16Array(8) [1, 2, 3, 4, 0, 0, 0, 0]
container.set([5, 6, 7, 8], 4);
console.log(container);  // Int16Array(8) [1, 2, 3, 4, 5, 6, 7, 8]
// 溢出会抛错
container.set([5, 6, 7, 8], 7); // RangeError
```



```js
const source = Int16Array.of(2, 4, 6, 8);

// 把整个数组复制为一个同类型的新数组
const fullCopy = source.subarray();
console.log(fullCopy);  // Int16Array(4) [2, 4, 6, 8]

// 从索引 2 开始复制数组
const halfCopy = source.subarray(2);
console.log(halfCopy);  // Int16Array(2) [6, 8]

// 从索引 1 开始复制到索引 3
const partialCopy = source.subarray(1, 3);
console.log(partialCopy);  // Int16Array(2) [4, 6]
```



定型数组没有原生的拼接能力，只能自己手动拼接



#### 3.  下溢和上溢

定型数组存入的值如果超过范围会导致值的溢出，但不会影响数组中其它索引

除了 8 种元素类型，还有一种”夹板“数组类型：`Uint8ClampedArray` 但是这个类型最好只用在 `canvas` 开发中



## 6.4 Map

ECMAScript 6 新增的键/值存储机制



### 6.4.1 基本 API

使用 `new` 关键字和 `Map` 构造函数可以创建一个空间映射

```js
const m = new Map();

// 可以传入键/值对数组作为参数
const m1 = new Map([
    ["key1", "val1"],
    ["key2", "val2"],
    ["key3", "val3"]
]);
console.log(m1.size);  // 3

// 使用自定义迭代器初始化映射
const m2 = new Map({
    [Symbol.iterator]: function*() {
        yield ["key1", "val1"];
        yield ["key2", "val2"];
        yield ["key3", "val3"];
    }
});
console.log(m2.size);  // 3

// 映射期待的键/值对，无论是否提供
const m3 = new Map([[]]);
console.log(m3.has(undefined));  // true
console.log(m3.get(undefined));  // undefined
```



- `set()` 添加键/值对
- `get()` 获取键值
- `has()` 查询是否存在键值
- `size` 获取映射中的键/值对的数量
- `delete()`、`clear()` 删除值

```js
const m = new Map();
m.set("firstName", "Matt");
m.set("lastName", "Frisbie");
console.log(m.has("firstName"));  // true
console.log(m.get("firstName"));  // Matt
console.log(m.size);  // 2
```



与 `Object` 只能用数值、字符串或符号作为键不同。

`Map` 可以使用任何 JavaScript 数据类型作为键，内部使用 SameValueZero 来比较操作（ECMAScript 内部定义，语言中不能使用），而映射的值也是和 `Object` 一样没有限制

```js
const m = new Map();

const functionKey = function() {};
const symbolKey = Symbol();
const objectKey = new Object();

m.set(functionKey, "functionValue");
m.set(symbolKey, "symbolValue");
m.set(objectKey, "objectValue");

console.log(m.get(functionKey));  // functionValue
console.log(m.get(symbolKey));  // symbolValue
console.log(m.get(objectKey));  // objectValue

console.log(m.get(function() {}));  // undefined
```

在映射中用作键和值对的对象以及其它“集合”类型，在自己的内容或属性被修改时仍然保持不变

但是基本类型的话只要值相同，则是有可能访问相同的有映射值

### 6.4.2 顺序与迭代

与 `Object` 类型的一个主要差异就是，`Map` 实例会维护键值对的插入顺序

映射实提供一个迭代器，可以通过 `entries()` 方法（或者 `Symbol.iterator` 属性，它引用 `entries()` ）取得这个迭代器

```js
const m = new Map([
    ["key1", "val1"],
    ["key2", "val2"],
    ["key3", "val3"]
]);

console.log(m.entries === m[Symbol.iterator]); // true
```



`keys()` 和 `values()` 分别返回以插入顺序生成键和值的迭代器



### 6.4.3 选择 Object 还是 Map

#### 1. 内存占用

`Map` 大约可以比 `object` 多存储 50% 的键/值对

#### 2. 插入性能

如果大量的插入键/值对操作， `Map` 性能更高

#### 3. 查找速度

如果少量键/值对，则 `Object` 有时候速度更快，但是与 `Map` 相比差异极小

如果代码大量查找操作，某些情况下可能 `Object` 会更高

#### 4. 删除性能

`Map` 的 `delete()` 操作都比插入和查找更快。而 `delete` 删除 `Object` 属性的性能一直很低，如果涉及到大量的删除操作，毫无疑问是 `Map`



## 6.5 WeakMap

`WeakMap` 是 `Map` 的“兄弟”类型，其 API 也是 `Map` 的子集



### 6.5.1 基本 API

使用 `new` 关键字实例化一个空的 `WeakMap`

```js
const wm = new WeakMap();
```

弱映射中的键只能是 `Object` 或者继承自 `Object` 的类型，尝试使用非对象设置键会抛出 `TypeError`。值的类型没有限制

```js
/*
初始化是全有或全无的操作
只要有一个键无效就会抛出错误，导致整个初始化失败
 */
const wm2 = new WeakMap([
    [key1, "val1"],
    ["BADKEY", "val2"],
    [key3, "val3"]
]);  // TypeError
```

```js
// 原始值可以先包装成对象再用作键
const stringKey = new String("key1");
const wm3 = new WeakMap([
    [stringKey, "val1"]
]);
console.log(wm3.get(stringKey));  // "val1"
```

- `get()` 获取键值
- `set()` 添加键值对，返回弱映射实例
- `has()` 查询键值
- `delete()` 删除键值对



### 6.5.2 弱键

键不属于正式的引用，不会阻止垃圾回收

只要键存在，键值对就会存在于映射中，并被当作对值的引用，因此就不会被当作垃圾回收

```js
const wm = new WeakMap();
wm.set({}, "val");  // 由于对象键没有被其它引用，因此当这行代码执行完之后，这个对象键就会被垃圾回收，然后，这个键值对也会从弱映射中消失
```



```js
const wm = new WeakMap();

const container = {
    key: {}
};

wm.set(container.key, "val");  // 由于这个对象键被引用着，所以不会被回收

// 如果调用这个函数，则会摧毁对象的最后一个引用，把键值对给清掉
function removeReference() {
    container.key = null;
}
```



### 6.5.3 不可迭代键

因为不可能迭代，所以也不可能在不知道对象引用的情况下从弱映射中取得值。

`WeakMap` 实例之所以限制只能用对象作为键，是为了保证只有通过键对象的引用才能取得值。如果允许原始值，就没办法区分初始化时使用的字符串字面量和初始化之后使用的一个相等的字符串了



### 6.5.4 使用弱映射

#### 1. 私有变量

```js
const User = (() => {
    const wm = new WeakMap();

    class User {
        constructor(id) {
            this.idProperty = Symbol('id');
            this.setId(id);
        }

        setPrivate(property, value) {
            const privateMembers = wm.get(this) || {};
            privateMembers[property] = value;
            wm.set(this, privateMembers);
        }

        getPrivate(property) {
            return wm.get(this)[property];
        }

        setId(id) {
            this.setPrivate(this.idProperty, id);
        }

        getId() {
            return this.getPrivate(this.idProperty);
        }
    }
    return User;
})();


const user = new User(123);
console.log(user.getId());  // 123
user.setId(456);
console.log(user.getId());  // 456
```



#### 2. DOM 节点元数据

因为 `WeakMap` 不会妨碍垃圾回收，所以非常适合保存关联元数据



## 6.6 Set

ECMAScript 6 新增的集合类型，大多数 API 与 `Map` 共有的

### 6.6.1 基本 API

`new` 关键字和 `Set` 构造函数创建空集合

```js
const s = new Set();

// 创建同时初始化实例
const s1 = new Set(["val1", "val2", "val3"]);

console.log(s1.size);  // 3

// 使用自定义迭代器初始化集合
const s2 = new Set({
    [Symbol.iterator]: function* () {
        yield "val1";
        yield "val2";
        yield "val3";
    }
});
console.log(s2.size);  // 3
```



- `add()` 添加值
- `has()` 查询值是否存在
- `size` 获取元素数量
- `delete()` 删除单个元素
- `clear()` 删除所有元素



与 `Map` 类似，`Set` 可以包含任意 JavaScript 数据类型。也使用 SameValueZero 操作，基本上相当于使用严格对象相等的标准来检查值的匹配性

