# 第 8 章 对象、类与面向对象编程

可以把 ECMAScript 的对象想象为一张散列表，其中的内容就是一组名/值对，值可以是数据或者函数

## 8.1 理解对象

使用 `Object` 构造函数创建

```js
let person = new Object();
person.name = "Nicholas";
person.age = 29;
person.job = "Software Engineer";
person.sayName = function() {
    console.log(this.name);
};
```



使用对象字面量创建对象（更加流行）

```js
let person = {
    name: "Nicholas",
    age: 29,
    job: "Software Enginner",
    sayName() {
        console.log(this.name);
    }
};
```

