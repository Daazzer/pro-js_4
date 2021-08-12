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

#### 6.邻近处理程序的执行顺序

如果给期约添加了多个处理程序，当期约状态变化时，相关处理程序会按照添加它们的顺序依次执行

```js
let p1 = Promise.resolve();
let p2 = Promise.reject();

p1.then(() => setTimeout(console.log, 0, 1));
p1.then(() => setTimeout(console.log, 0, 2));
// 1
// 2

p2.catch(() => setTimeout(console.log, 0, 3));
p2.catch(() => setTimeout(console.log, 0, 4));
// 3
// 4


p2.catch(() => setTimeout(console.log, 0, 5));
p2.catch(() => setTimeout(console.log, 0, 6));
// 5
// 6

p1.finally(() => setTimeout(console.log, 0, 7));
p1.finally(() => setTimeout(console.log, 0, 8));
// 7
// 8
```

#### 7.传递解决值和拒绝理由

在执行函数中，解决值和拒绝的理由是分别作为 `resolve()` 和 `reject()` 的第一个参数往后传的

```js
let p1 = new Promise((resolve, reject) => resolve('foo'));
p1.then(value => console.log(value));  // foo

let p2 = new Promise((resolve, reject) => reject('bar'));
p1.catch(reason => console.log(reason));  // bar
```

`Promise.resolve()` 和 `Promise.reject()` 在调用时就会接收解决值和拒绝理由

```js
let p1 = Promise.resolve('foo');
p1.then(value => console.log(value));  // foo

let p2 = Promise.reject('bar');
p1.catch(reason => console.log(reason));  // bar
```

#### 8.拒绝期约与拒绝错误处理

在期约中抛出错误时，因为错误实际上是从消息队列中异步抛出的，所以并不会阻止运行时继续执行同步指令

```js
let p1 = new Promise((resolve, reject) => reject(Error('foo')));
let p2 = new Promise((resolve, reject) => { throw Error('foo'); });
let p3 = Promise.resolve().then(() => { throw Error('foo'); });  // 最后才出现此错误，因为需要在消息队列中添加处理程序，在最终抛出未捕获错误之前它还会创建另一个期约
let p4 = Promise.reject(Error('foo'));

setTimeout(console.log, 0, p1);  // Promise <rejected>: Error: foo
setTimeout(console.log, 0, p2);  // Promise <rejected>: Error: foo
setTimeout(console.log, 0, p3);  // Promise <rejected>: Error: foo
setTimeout(console.log, 0, p4);  // Promise <rejected>: Error: foo
```

异步错误只能通过异步的 `onRejected` 处理程序捕获

执行函数中的错误仍然可以使用 `try/catch` 捕获

```js
let p = new Promise((resolve, reject) => {
    try {
        throw new Error('foo')
    } catch (err) {}
    
    resolve('bar');
});

setTimeout(console.log, 0, p);  // Promise <resolved>: bar
```

### 11.2.4 期约连锁与期约合成

- 期约连锁：一个期约接一个期约拼接
- 期约合成：多个期约组合成一个期约

#### 1.期约连锁

```js
let p = new Promise((resolve, reject) => {
    console.log('first');
    resolve();
});

p.then(() => console.log('second'))
 .then(() => console.log('third'))
 .then(() => console.log('fourth'));

// first
// second
// third
// fourth
```

串行化异步任务

```js
let p1 = new Promise((resolve, reject) => {
    console.log('p1 executor');
    setTimeout(resolve, 1000);
});

p1.then(() => new Promise((resolve, reject) => {
    console.log('p2 executor');
    setTimeout(resolve, 1000);
})).then(() => new Promise((resolve, reject) => {
    console.log('p3 executor');
    setTimeout(resolve, 1000);
})).then(() => new Promise((resolve, reject) => {
    console.log('p4 executor');
    setTimeout(resolve, 1000);
}));

// p1 executor (1秒后)
// p2 executor (2秒后)
// p3 executor (3秒后)
// p4 executor (4秒后)
```

`then()`、`catch()`、`finally()` 都返回期约，所以串联这些方法也很直观

```js
let p = new Promise((resolve, reject) => {
    console.log('initial promise rejects');
	reject();
});

p.catch(() => console.log('reject handler'))
 .then(() => console.log('resolve handler'))
 .finally(() => console.log('finally handler'));

// initial promise rejects
// reject handler
// resolve handler
// finally handler
```

#### 2.期约图

期约连锁可以构建**有向非循环图**的结构

二叉树例子

```js
/*
      A
    /   \
   B      C
 /   \   /   \
D    E   F    G
 */
let A = new Promise((resolve, reject) => {
    console.log('A');
    resolve();
});

let B = A.then(() => console.log('B'));
let C = A.then(() => console.log('C'));

B.then(() => console.log('D'));
B.then(() => console.log('E'));
C.then(() => console.log('F'));
C.then(() => console.log('G'));

// A
// B
// C
// D
// E
// F
// G
```

期约的处理程序是**先**添加到消息队列，**然后**才逐个执行，因此构成了层序遍历

#### 3.Promise.all() 和 Promise.race()

两个将多个期约实例组合成一个期约的静态方法

- `Promise.all()` 

  会在一组期约全部解决之后再解决，这个方法接收一个可迭代对象，返回一个新期约

  ```js
  let p1 = Promise.all([
      Promise.resolve(),
      Promise.resolve()
  ]);
  
  // 可迭代对象中的元素会通过 Promise.resolve() 转换为期约
  let p2 = Promise.all([3, 4]);
  ```

  合成的期约只会在每个包含的期约都解决之后才解决

  ```js
  let p = Promise.all([
      Promise.resolve(),
      new Promise((resolve, reject) => setTimeout(resolve, 1000))
  ]);
  
  setTimeout(console.log, 0, p);  // Promise <pending>
  
  p.then(() => setTimeout(console.log, 0, 'all() resolved!'));
  
  // all() resolved! (大概一秒后)
  ```

  如果有一个包含的期约拒绝，则合成期约也会拒绝

  ```js
  let p2 = Promise.all([
      Promise.resolve(),
      Promise.reject(),
      Promise.resolve()
  ]);
  setTimeout(console.log, 0, p2);  // Promise <rejected>
  
  // Uncaught (in promise) undefined
  ```

  合成的期约会静默处理所有包含期约的拒绝操作 (一旦设置了 `catch()`)

- `Promise.race()`

  返回一个包装期约，是一组集合中最先解决或拒绝的期约的镜像

  `Promise.race()` 不会对解决或拒绝的期约区别对待。无论是拒绝还是解决，只要是第一个落定的期约，`Promise.race()` 就会包装其解决值或拒绝理由并返回新期约

  ```js
  // 解决先发生，超时后的拒绝被忽略
  let p1 = Promise.race([
      Promise.resolve(3),
      new Promise((resolve, reject) => setTimeout(reject, 1000))
  ]);
  setTimeout(console.log, 0, p1);  // Promise <resolved>: 3
  
  // 拒绝先发生，超时后的解决被忽略
  let p2 = Promise.race([
      Promise.reject(4),
      new Promise((resolve, reject) => setTimeout(resolve, 1000))
  ]);
  setTimeout(console.log, 0, p2);  // Promise <rejected>: 4
  ```

  与 `Promise.all()` 类似，合成的期约会静默处理所有包含期约的拒绝操作 (一旦设置了 `catch()`)

#### 4.串行期约合成

基于后续期约使用之前期约的返回值来串联期约是期约的基本功能。这很像**函数合成**，即将多个函数合成一个函数

```js
const addTwo = x => x + 2;
const addThree = x => x + 3;
const addFive = x => x + 5;

const addTen = x => Promise.resolve(x)
.then(addTwo)
.then(addThree)
.then(addFive);

addTen(8).then(console.log);  // 18
```

使用 `Array.prototype.reduce()` 重构

```js
const addTwo = x => x + 2;
const addThree = x => x + 3;
const addFive = x => x + 5;
const addTen = x => [addTwo, addThree, addFive]
.reduce((promise, fn) => promise.then(fn), Promise.resolve(x));

addTen(8).then(console.log);  // 18
```

提炼出一个通用函数

```js
const addTwo = x => x + 2;
const addThree = x => x + 3;
const addFive = x => x + 5;
const compose = (...fns) => x => fns.reduce((promise, fn) => promise.then(fn), Promise.resolve(x));
const addTen = compose(addTwo, addThree, addFive);
addTen(8).then(console.log);  // 18
```

### 11.2.5 期约扩展

期约的不足之处：

- 期约取消
- 进度追踪

#### 1.期约取消

```js
class CancelToken {
    constructor(cancelFn) {
        this.promise = new Promise(resolve => {
            const cancelCallback = () => {
                setTimeout(console.log, 0, 'delay cancelled');
                resolve(cancelCallback);
            }
            cancelFn(cancelCallback);
        });
    }
}

const startButton = document.querySelector('#start');
const cancelButton = document.querySelector('#cancel');

function cancellableDelayedResolve(delay) {
    setTimeout(console.log, 0, 'set delay');

    return new Promise(resolve => {
        const id = setTimeout(() => {
            setTimeout(console.log, 0, 'delay resolve');
            resolve();
        }, delay);
        /* 
        只是清除了定时器，感觉上中断了 Promise
        实际是同时建立了两个 Promise，用于手动中断的那个用事件处理器暂时保存着
        如果不手动中断，则事件处理器永远保存着另外的那个 Promise
         */
        const cancelToken = new CancelToken(cancelCallback => cancelButton.addEventListener('click', cancelCallback));

        cancelToken.promise.then(cancelCallback => {
            clearTimeout(id);
            // 清除点击事件，防止无限绑定
            cancelButton.removeEventListener('click', cancelCallback);
        });
    });
}

startButton.addEventListener('click', () => {
    const p = cancellableDelayedResolve(1000);
    /*
    问题是，如果中途中断了，那么原本的函数返回的 Promise 还是 pending 状态
    如果不中断才是 fulfilled 状态
     */
    setTimeout(console.log, 2000, p);
});
```

#### 2.期约进度通知

ES6 期约并不支持进度追踪，手动封装

```js
class TrackablePromise extends Promise {
    constructor(executor) {
        const notifyHandlers = [];

        super((resolve, reject) => {
            return executor(resolve, reject, status => {
                notifyHandlers.forEach(handler => handler(status));
            });
        });

        this.notifyHandlers = notifyHandlers;
    }

    notify(notifyHandler) {
        this.notifyHandlers.push(notifyHandler);
        return this;
    }
}

const p = new TrackablePromise((resolve, reject, notify) => {
    const countdown = x => {
        if (x > 0) {
            notify(`${20 * x}% remaining`);
            setTimeout(() => countdown(--x), 1000);
        } else {
            resolve();
        }
    }

    countdown(5);
});

p.notify(x => setTimeout(console.log, 0, 'progress:', x))
    .notify(x => setTimeout(console.log, 0, 'a:', x));  // 连锁调用
p.then(() => setTimeout(console.log, 0, 'completed'));
// (约1秒后) progress: 80% remaining
// (约2秒后) progress: 60% remaining
// (约3秒后) progress: 40% remaining
// (约4秒后) progress: 20% remaining
// (约5秒后) completed
```

## 11.3 异步函数

`async/await`，是ES6期约模式在函数中的应用

`async/await` 是 ES8 规范新增的，让同步的代码能够异步执行

### 11.3.1 异步函数

`async/await` 解决利用异步结构组织代码的问题



