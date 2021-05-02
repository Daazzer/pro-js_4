# 第1章 什么是 JavaScript

1995 年，JavaScript 问世。早期用于处理输入验证



## 1.1 简短的历史回顾

- 在 Netscape Navigator 2 正式发布前，网景把 LiveScript 改名为 JavaScript，以便搭上媒体当时热烈炒作的 Java 的顺风车

- 1997 年，JavaScript 1.1 作为提案被提交给欧洲计算机制造商协会(Ecma)。第 39 技术委员会(TC39)
- 1998 年，国际标准化组织 (ISO) 和国际电工委员会 (IEC) 也将 ECMAScript 采纳为标准 (ISO/IEC-16262)。



## 1.2 JavaScript 实现

完整的 JavaScript 包含：

- 核心 (ECMAScript)
- 文档对象模型 (DOM)
- 浏览器对象模型 (BOM)



### 1.2.1 ECMAScript

这门语言没有输入和输出之类的方法

Web 浏览器只是 ECMAScript 实现可能存在的一种**宿主环境** ( host enviroment )。

- **宿主环境**提供 ECMAScript 的基准实现和与环境自身交互必需的扩展
- **扩展** ( 比如DOM )  使用 ECMAScript 核心类型和语法

其他宿主环境还有服务端 JavaScript 平台 Node.js 和已经被淘汰的 Adobe Flash



ECMA-262 定义的基本层面

- 语法
- 类型
- 语句
- 关键字
- 保留字
- 操作符
- 全局对象



ECMAScript 只是对实现这个规范描述的所有方面的一门语言的称呼。

JavaScript 实现了 ECMAScript ，而 Adobe ActionScript 同样也实现了 ECMAScript 



#### 1. ECMAScript 版本

不同版本以 "edition" 表示

ECMA-262 要求支持 Unicode 标准 ( 以支持多语言 )，而且对象要与平台无关

- ECMA-262 第 1 版，本质上跟网景的 JavaScript 1.1 相同，只不过删除了所有浏览器特定的代码
- ECMA-262 第 2 版，做了一些编校工作，为了更新之后严格符合 ISO/IEC-16262 的要求
- ECMA-262 第 3 版，第一次对这个标准进行更新，更新了字符串处理、错误定义和数值输出。此外还增加了对正则表达式、新的控制语句、`try/catch` 异常处理的支持
- ECMA-262 第 4 版是对这门语言的一次彻底修订，包括强类型变量、新语句和数据结构、真正的类和经典的继承，以及操作数据的新手段，同时 ES3.1 在第 4 版发布之前被放弃
- ECMA-262 第 5 版 ( 由 ECMAScript 3.1 变为 )，2009 年 12 月 3 日正式发布。包括原生的解析和序列化 JSON 数据的 JSON 对象、方便继承和高级属性定义的方法，以及新的增强 ECMAScript 引擎解析和执行代码能力的严格模式
- ECMA-262 第 6 版，俗称 ES6、ES2015 或 ES Harmony ( 和谐版 )，于 2015 年 6 月发布。有史以来最重要的一批增强特性。正式支持了类、模块、迭代器、生成器、箭头函数、期约、反射、代理和众多的新的数据类型。
- ECMA-262 第 7 版，也称 ES7 或 ES2016，于 2016 年 6 月发布。只包含少量语法层面的增强，如 `Array.prototype.includes` 和指数操作符
- ECMA-262 第 8 版，也称 ES8 或 ES2017，于 2017 年 6 月发布。添加了异步函数 ( `async/await` )、`SharedArrayBuffer` 以及 Atomics API，以及 `Object.values()` / `Object.entries()` / `Object.getOwnPropertyDescriptors()` 和字符串填充方法，另外明确支持对象字面量最后的逗号
- ECMA-262 第 9 版，也称 ES9 或 ES2018，于 2018 年 6 月发布。异步迭代、剩余和扩展属性、一组新的正则特性、`Promise` `finally()`，以及模板字面量修订
- ECMA-262 第 10 版，也称 ES10 或 ES2019，于 2019 年 6 月发布。`Array.prototype.flat()/flatMap()` 、`String.prototype.trimStart()/trimEnd()`、`Object.fromEntries()` 方法，以及 `Symbol.prototype.description` 属性，明确定义了 `Function.prototype.toString()` 的返回值并固定了 `Array.prototype.sort()` 的顺序。另外，这次修订解决了与 JSON 字符串兼容的问题，并且定义了 `catch` 子句的可选绑定

#### 2. ECMAScript 符合性是什么意思

要实现 ECMAScript ，必须满足

- 支持 ECMA-262 中描述的所有 "类型、值、对象、属性、函数，以及程序语法与含义"；
- 支持 Unicode 字符标准；
- 增加 ECMA-262 中未提及的 "额外的类型、值、对象、属性和函数"。ECMA-262 所说的这些额外内容主要指规范中为给出的新对象或对象的新属性。
- 支持 ECMA-262 中没有定义的 "程序和正则表达式语法"



#### 3. 浏览器对 ECMAScript 的支持

2008 年，五大浏览器 ( IE、FireFox、Safari、Chrome、Opera ) 全部兼容 ECMA-262 第 3 版。

IE8 率先实现 ECMA-262 第 5 版。并在 IE9 中完整支持



### 1.2.2 DOM

**文档对象模型 **(DOM，Document Object Model) 是一个应用编程接口 (API)，用于在 HTML 中使用扩展的 XML。DOM 将整个页面抽象为一组分层节点。HTML 或 XML 页面的每个组成部分都是一种节点，包含不同的数据。



#### 1. 为什么 DOM 是必需的

为了保持 Web 跨平台的本性，万维网联盟 ( W3C，World Wide Web Consortium ) 开始了制定 DOM 标准的进程。



#### 2. DOM 级别

- DOM Level 1，DOM Core 和 DOM HTML。1998 年 10 月
- DOM Level 2
  - DOM 视图：描述追踪文档不同视图 ( 如应用 CSS 样式前后的文档 ) 的接口
  - DOM 事件：描述事件及事件处理的接口
  - DOM 样式：描述处理元素 CSS 样式的接口
  - DOM 遍历和范围：描述遍历和操作 DOM 树的接口
- DOM Level 3，不再按 Level 来维护 DOM 了，而是作为 DOM Living Standard 来维护，其快照称为 DOM4。
- DOM 4，新增 Mutation Events 的 Mutation Observers



#### 3. 其他 DOM

- 可伸缩矢量图 ( SVG，Scalable Vector Graphics )
- 数学标记语言 ( MathML，Mathematical Markup Language )
- 同步多媒体集成语言 ( SMIL，Synchronized Multimedia Integration Language )



#### 4. Web 浏览器对 DOM 的支持情况

IE 5.5 版才开始真正支持

Firefox 3+ 支持全部的 Level 1、几乎全部的 Level 2、以及 Level 3 的某些部分



### 1.2.3 BOM

**浏览器对象模型** ( BOM ) API，用于支持访问和操作浏览器的窗口。唯一一个没有相关标准的 JavaScript 实现。HTML 5 改变了这个局面，这个版本的 HTML 以正式规范的形式涵盖了尽可能多的 BOM 特性。

BOM 主要针对浏览器窗口和子窗口 ( frame )

- 弹出新浏览器窗口的能力
- 移动、缩放和关闭浏览器窗口的能力
- `navigator` 对象，提供关于浏览器的详尽信息
- `location` 对象，提供浏览器加载页面的详尽信息
- `screen` 对象，提供关于用户屏幕分辨率的详尽信息
- `performance` 对象，提供浏览器内存占用、导航行为和时间统计的详尽信息
- 对 cookie 的支持
- 其他自定义对象，如 `XMLHttpRequest` 和 IE 的 `ActiveXObject`



## 1.3 JavaScript 版本

网景， JavaScript 在其浏览器中最后的版本是 1.3

