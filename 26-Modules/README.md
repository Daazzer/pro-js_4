# 第 26 章 模块

在 ES6 模块规范出现之前，有类似的代码库基于 JavaScript 的语法和词法特性“伪造”出类似模块的行为

## 26.1 理解模块模式

将代码拆分成独立的块，然后再把这些块连接起来可以通过模块模式来实现。

背后的思想：把逻辑分块，各自封装，相互独立，每个块自行决定对外暴露什么，同时自行决定引入执行哪些外部代码。

### 26.1.1 模块标识符

模块系统本质上是键/值实体，其中每个模块都有个可用 于引用它的标识符。这个标识符在模拟模块的系统中可能是字符串，在原生实现的模块系统中可能是模块文件的实际路径。

原生浏览器模块标识符必须提供实际 JavaScript 文件的路径。除了文件路径，Node.js 还会搜索 node_modules 目录，用标识符去匹配包含 index.js 的目录。

### 26.1.2 模块依赖

模块系统的核心是管理依赖。

每个模块都会与某个唯一的标识符关联，该标识符可用于检索模块。这个标识符通常是 JavaScript 文件的路径，但在某些模块系统中，这个标识符也可以是在模块本身内部声明的命名空间路径字符串。

### 26.1.3 模块加载

当一个外部模块被指定为依赖时，本地模块期望在执行它时，依赖已准备好并已初始化。

在浏览器中，加载模块涉及几个步骤

- 加载模块涉及执行其中的代码，但必须是在所有依赖都加载并执行之后。
- 如果浏览器没有收到依赖模块的代码，则必须发送请求并等待网络返回。
- 收到模块代码之后，浏览器必须确定刚收到的模块是否也有依赖。
- 递归地评估并加载所有依赖，直到所有依赖模块都加载完成。只有整个依赖图都加载完成，才可以执行入口模块。

### 26.1.4 入口

相互依赖的模块必须指定一个模块作为入口（entry point），这也是代码执行的起点。模块化 JavaScript 应用程序的所有模块会构成依赖图。

可以通过有向图来表示应用程序中各模块的依赖关系。

![图 26-1](./i/26-1.svg)

这个应用程序的入口模块 A 必须在应用程序的其他部分加载后才能执行。

下面的脚本请求顺序能够满足依赖图的要求：

```html
<script src="moduleE.js"></script>
<script src="moduleD.js"></script>
<script src="moduleC.js"></script>
<script src="moduleB.js"></script>
<script src="moduleA.js"></script> 
```

模块加载是“阻塞的”，这意味着前置操作必须完成才能执行后续操作。

### 26.1.5 异步依赖

可以让 JavaScript 通知模块系统在必要时加载新模块，并在模块加载完成后提供回调。

```js
// 在模块 A 里面
load('moduleB').then(moduleB => {
  moduleB.doStuff();
});
```

只使用动态模块加载，那么使用一个 `<scirpt>` 标签即可完成模块 A 的加载。模块 A 会按需请求模块文件，而不会生成必需的依赖列表。

这样可以提高性能，因为在页面加载是只需同步加载一个文件

### 26.1.6 动态依赖

```js
if (loadCondition) {
  require('./moduleA');
}
```

在这个模块中，是否加载 `moduleA` 是运行时确定的。

动态依赖可以支持更复杂的依赖关系，但代价是增加了对模块进行静态分析的难度。

### 26.1.7 静态分析

对静态分析友好的模块系统可以让模块打包系统更容易将代码处理为较少的文件。

### 26.1.8 循环依赖

CommonJS、AMD 和 ES6 在内的所有模块系统都支持循环依赖。

在下面的模块代码中（其中使用了模块中立的伪代码），任何模块都可以作为入口模块，即使依赖 图中存在循环依赖：

```js
require('./moduleD');
require('./moduleB');

console.log('moduleA');
require('./moduleA');
require('./moduleC');

console.log('moduleB');
require('./moduleB');
require('./moduleD');

console.log('moduleC');

require('./moduleA');
require('./moduleC');

console.log('moduleD'); 
```

修改主模块中用到的模块会改变依赖加载顺序。

如果 `moduleA` 最先加载，则会按以下顺序输出

```js
moduleB
moduleC
moduleD
moduleA
```

![图26-2](./i/26-2.svg)

如果 `moduleC` 最先加载，则会按以下顺序输出

```js
moduleD
moduleA
moduleB
moduleC
```

![图26-3](./i/26-3.svg)

## 26.2 凑合的模块系统

ES6 之前会使用函数作用域和立即调用函数表达式（IIFE，Immediately Invoked Function Expression）将模块封装在匿名闭包中

 ```js
 (function() {
   // 私有 Foo 模块的代码
   console.log('bar');
 })();
 // bar
 ```

如果把这个模块的返回值赋给一个变量，那么实际上就为模块创建了命名空间

为了暴露公共 API，模块 IIFE 会返回一个对象，其属性就是模块命名空间中的公共成员

```js
var Foo = (function() {
  return {
    bar: 'baz',
    baz: function() {
      console.log(this.bar);
    }
  };
})();
```

还有一种模式叫作“泄露模块模式”（revealing module pattern）。这种模式只返回一个对象， 其属性是私有数据和成员的引用

```js
var Foo = (function() {
  var bar = 'baz';
  var baz = function() {
    console.log(bar);
  };

  return {
    bar: bar,
    baz: baz
  };
})();
```

在模块内部也可以定义模块，这样可以实现命名空间嵌套

```js
var Foo = (function() {
  return {
    bar: 'baz'
  };
})();
Foo.baz = (function() {
  return {
    qux: function() {
      console.log('baz');
    }
  };
})();
console.log(Foo.bar); // 'baz'
Foo.baz.qux(); // 'baz' 
```

为了让模块正确使用外部的值，可以将它们作为参数传给 IIFE

```js
var globalBar = 'baz';
var Foo = (function(bar) {
  return {
    bar: bar,
    baz: function() {
      console.log(bar);
    }
  };
})(globalBar);
console.log(Foo.bar); // 'baz' 
```

因为这里的模块实现其实就是在创建 JavaScript 对象的实例，所以完全可以在定义之后再扩展模块

无论模块是否存在，配置模块扩展以执行扩展也很有用

```js
// 扩展 Foo 以增加新方法
var Foo = (function(FooModule) {
  FooModule.baz = function() {
    console.log(FooModule.bar);
  };
  return FooModule;
})(Foo || {});
// 扩展 Foo 以增加新数据
var Foo = (function(FooModule) {
  FooModule.bar = 'baz';
  return FooModule;
})(Foo || {});
console.log(Foo.bar); // 'baz'
Foo.baz(); // 'baz'
```

自己动手写模块系统确实非常有意思，但实际开发中并不建议这么做，因为不够可靠

## 26.3 使用 ES6 之前的模块加载器

在 ES6 原生支持模块之前，需要单独的模块工具把这些模块语法与 JavaScript 运行时连接起来。这里的模块语法和连接方式有不同的表现形式，通常需要在浏览器中额外加载库或者在构建时完成预处理。

