# 第 11 章 期约与异步函数

ES6 新增 `Promise` (期约) 引用类型。在未来几个版本添加了 `async` 和 `await` 关键字定义异步函数的机制

## 11.1 异步编程

异步行为是为了优化因计算量大而时间长的操作。如果在等待其他操作完成的同时，即使运行其他指令，系统也保持稳定，那么这样做就是务实的

### 11.1.1 同步与异步

**同步行为**对应内存中顺序执行的处理器指令。后面的指令总是在前面的指令执行完成后才会执行

**异步行为**类似于系统中断，即当前进程外部的实体可以触发代码执行，但是什么时候触发中断是很难判断的

### 11.1.2 以往的异步编程模式

早期 JavaScript 中，只支持定义回调函数来表明异步操作完成，通常需要深度嵌套的回调函数（俗称“回调地狱”）来解决

`setTimeout` 可以定义一个在指定时间之后会被调度执行的回调函数

#### 1.异步返回值

给异步传一个回调，这个回调中包含要使用异步返回值的代码（作为回调的参数）

```js
function double(value, callback) {
    setTimeout(() => callback(value * 2), 1000);
}

double(3, x => console.log(`I was given: ${x}`));
// I was given: 6 (大约 1000 毫秒之后)
```

#### 2.失败处理

成功回调与失败回调

```js
function double(value, success, failure) {
    setTimeout(() => {
        try {
            if (typeof value !== 'number') {
                throw 'Must provide number as first argument';
            }
            success(2 * value);
        } catch (err) {
            failure(err);
        }
    }, 1000);
}

const successCallback = x => console.log(`Success: ${x}`);
const failureCallback = err => console.log(`Failure: ${err}`);

double(3, successCallback, failureCallback);
double('b', successCallback, failureCallback);

// Success: 6
// Failure: Must provide number as first argument
```

此模式已经不可取了，因为必须在初始化异步操作时定义回调

#### 3.嵌套异步回调

异步返回值又依赖另一个异步返回值，容易造成回调地狱

```js
function double(value, success, failure) {
    setTimeout(() => {
        try {
            if (typeof value !== 'number') {
                throw 'Must provide number as first argument';
            }
            success(2 * value);
        } catch (err) {
            failure(err);
        }
    }, 1000);
}

const successCallback = x => {
    double(x, y => console.log(`Success: ${y}`));
};
const failureCallback = err => console.log(`Failure: ${err}`);

double(3, successCallback, failureCallback);
// Success: 12
```

## 11.2 期约

一种异步程序执行机制

### 11.2.1 Promise/A+规范

ES6 增加了对 Promise/A+ 规范的完善支持，即 `Promise` 类型

### 11.2.2 期约基础

ES6 新增引用类型 `Promise`，可以通过 `new` 操作符来实例化，创建时需要传入执行器(executor)函数作为参数

```js
let p = new Promise(() => {});

setTimeout(console.log, 0, p);  // Promise <pending>
```

#### 1.期约状态机

把一个期约实例传给 `console.log`，控制台输出表示实例处于**待定(pending)**状态

期约是一个有状态的对象

- 待定(pending)
- 兑现(fulfilled，有时候也称为“解决”，resolve)
- 拒绝(rejected)

**待定(pending)**是期约最初始的状态。可以落定为代表成功的**兑现(fulfilled)**状态，或者代表失败的**拒绝(rejected)**状态

落定为某种状态之后不可逆

期约状态也不能被外部 JavaScript 代码修改

#### 2.解决值、拒绝理由及期约用例

- **兑现**表示已经成功完成
  - 只要状态为兑现，就会有一个私有的内部**值(value)**
- **拒绝**表示没有成功完成
  - 只要状态为拒绝，就会有一个私有的内部**理由(reason)**

#### 3.通过执行函数控制期约状态

由于期约的状态是私有的，所以只能在内部操作

控制期约状态的转换是通过调用它的两个函数参数实现的：

- `resolve()`  调用会把状态切换为兑现
- `reject()` 调用会把状态切换为拒绝

```js
let p1 = new Promise((resolve, reject) => resolve());
setTimeout(console.log, 0, p1);  // Promise <resolved>

let p2 = new Promise((resolve, reject) => reject());
setTimeoout(console.log, 0, p2);  // Promise <rejected>
// Uncaught error (in promise)
```

执行器函数是**同步**执行的，是期约的初始化程序

```js
new Promise(() => setTimeout(console.log, 0, 'executor'));
setTimeout(console.log, 0, 'promise initialized');
// executor
// promise initialized
```

```js
let p = new Promise((resolve, reject) => setTimeout(resolve, 1000));

// 在 console.log 打印期约实例的时候，还没到执行超时回调的时候(即 resolve())
setTimeout(console.log, 0, p);  // Promise <pending>
```

无论 `resolve()` 和 `reject()` 中的那个被调用，状态转换都不可撤销了，继续修改状态会静默失败

```js
let p = new Promise((resolve, reject) => {
    resolve();
    reject();  // 没有效果
});

setTimeout(console.log, 0, p);  // Promise <resolved>
```

如果执行器中的代码在超时之前已经解决或拒绝，超时回调再次尝试拒绝也会静默失败

#### 4.Promise.resolve()

通过调用 `Promise.resolve()` 静态方法，可以实例化一个解决的期约

```js
let p1 = new Promise((resolve, reject) => resolve());
let p2 = Promise.resolve();
```

多余的参数会忽略

```js
setTimeout(console.log, 0, Promise.resolve(4, 5, 6));
// Promise <resolved>: 4
```

传入的参数是一个期约

```js
let p = Promise.resolve(7);

setTimeout(console.log, 0, p === Promise.resolve(p));
// true
```

#### 5.Promise.reject()

`Promise.reject()` 会实例化一个拒绝的期约并抛出一个异步错误(这个错误不能通过 `try/catch` 捕获，只能通过拒绝处理程序捕获)

```js
let p1 = new Promise((resolve, reject) => reject());
let p2 = Promise.reject();
```

拒绝的理由就是传给 `Promise.reject()` 的第一个参数

```js
let p = Promise.reject(3);

setTimeout(console.log, 0, p);  // Promise <rejected>: 3

p.then(null, err => setTimeout(console.log, 0, err));  // 3
```

#### 6.同步/异步执行的二元性

```js
try {
    throw new Error('foo');
} catch (e) {
    console.log(e);  // foo
}

try {
    Promise.reject(new Error('bar'));
} catch (e) {
    console.log(e);
}

// Uncaught (in promise) Error: bar
```

拒绝期约没有抛到同步代码的线程里，而是通过浏览器异步消息队列来处理的

唯一与之交互的方式就是使用异步结构——更具体地说，就是期约的方法

### 11.2.3 期约的实例方法

可以访问异步操作返回的数据，处理期约成功和失败的输出

#### 1.实现 Thenable 接口

```js
class MyThenable {
    then() {}
}
```

#### 2.Promise.prototype.then()

这个 `then()` 方法接收最多两个参数：`onResolved` 处理程序和 `onRejected` 处理程序

两个参数都是可选的，在期约分别进入 “兑现” 和 “拒绝” 状态时执行

```js
function onResolved(id) {
    setTimeout(console.log, 0, id, 'resolved');
}

function onRejected(id) {
    setTimeout(console.log, 0, id, 'rejected');
}

let p1 = new Promise((resolve, reject) => setTimeout(resolve, 3000));
let p2 = new Promise((resolve, reject) => setTimeout(reject, 3000));

p1.then(() => onResolved('p1'),
        () => onRejected('p1'));
p2.then(() => onResolved('p2'),
        () => onRejected('p2'));
// (3秒后)
// p1 resolved
// p2 rejected
```

因为期约只能转换为最终状态一次，所以这两个操作一定是互斥的(只能执行一种)

传给 `then()` 的任何非函数类型的参数都会被静默忽略

如果有显式的返回值，则 `Promise.resolve()` 会包装这个值

```js
let p1 = Promise.resolve('foo');
let p3 = p1.then(() => undefined);
let p4 = p1.then(() => {});
let p5 = p1.then(() => Promise.resolve());

setTimeout(console.log, 0, p3);  // Promise <resolved>: undefined
setTimeout(console.log, 0, p4);  // Promise <resolved>: undefined
setTimeout(console.log, 0, p5);  // Promise <resolved>: undefined

let p6 = p1. then(() => 'bar');
let p7 = p1. then(() => Promise.resolve('bar'));

setTimeout(console.log, 0, p6);  // Promise <resolved>: bar
setTimeout(console.log, 0, p7);  // Promise <resolved>: bar
```

抛错会返回拒绝期约

```js
let p10 = p1.then(() => { throw 'baz'; });
// Uncaught (in promise) baz

setTimeout(console.log, 0, p10);  // Promise <rejected> baz
```

调用 `then()` 是不传处理程序则原样向后传

```js
let p2 = p1.then();
// Uncaught (in promise) foo
setTimeout(console.log, 0, p2);  // Promise <rejected>: foo
```

#### 3.Promise.prototype.catch()

这个方法实际上是一个语法糖，相当于 `Promise.prototype.then(null, onRejected)`

`Promise.prototype.catch()` 返回一个新的期约实例

#### 4.Promise.prototype.finally()

用于给期约添加 `onFinally` 处理程序，这个处理程序无论期约是决绝或拒绝都会执行

```js
let p1 = Promise.resolve();
let p2 = Promise.reject();
let onFinally = () => {
    setTimeout(console.log, 0, 'Finally');
};

p1.finally(onFinally);  // Finally
p2.finally(onFinally);  // Finally
```

`Promise.prototype.finally()` 返回一个新的期约实例

多数情况下都会原样后传父期约

返回待定期约的情景并不常见，因为只要期约一解决，新期约仍然会原样后传初始的期约

```js
let p1 = Promise.resolve('foo');

// 忽略解决的值
let p2 = p1.finally(() => new Promise((resolve, reject) => setTimeout(() => resolve('bar'), 100)));

setTimeout(console.log, 0, p2);  // Promise <pending>

setTimeout(() => setTimeout(console.log, 0, p2), 200);

// 200毫秒后
// Promise <resolved>: foo
```

#### 5.非重入期约方法

当期约进入落定状态时，与该状态相关的处理程序仅仅会被**排期**，而非立即执行

在一个解决期约上调用 `then()` 会把 `onResolved` 处理程序推进消息队列。但这个处理程序在当前线程上的同步代码执行完成前不会执行

```js
let synchronousResolve;

// 创建一个期约并将解决函数保存在一个局部变量中
let p = new Promise(resolve => {
    synchronousResolve = () => {
        console.log('1: invoking resolve()');
        resolve();
        console.log('2: resolve() returns');
    };
});

p.then(() => console.log('4: then() handler executes'));

synchronousResolve();
console.log('3: synchronousResolve() returns');

// 实际的输出:
// 1: invoking resolve()
// 2: resolve() returns
// 3: synchronousResolve() returns
// 4: then() handler executes
```

