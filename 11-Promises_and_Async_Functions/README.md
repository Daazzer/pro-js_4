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
