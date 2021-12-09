# 第 27 章 工作者线程

允许把主线程的工作转嫁给独立的实体，而不会改变现有的单线程模型。特点是都独立于 JavaScript 的主执行环境

## 27.1 工作者线程简介

使用工作者线程，浏览器可以在原始页面环境之外再分配一个完全独立的二级子环境。这个子环境不能与依赖单线程交互的 API（如 DOM）互操作，但可以与父环境并行执行代码。

### 27.1.1 工作者线程与线程

- **工作者线程是以实际线程实现的** 例如，Blink 浏览器引擎实现工作者线程的 `WorkerThread` 就对应着底层的线程。
- **工作者线程并行执行** 虽然页面和工作者线程都是单线程 JavaScript 环境，每个环境中的指令则可以并行执行。
- **工作者线程可以共享某些内存** 工作者线程能够使用 `SharedArrayBuffer` 在多个环境间共享内容。虽然线程会使用锁实现并发控制，但 JavaScript 使用 `Atomics` 接口实现并发控制。
- **工作者线程不共享全部内存** 在传统线程模型中，多线程有能力读写共享内存空间。除了 `SharedArrayBuffer` 外，从工作者线程进出的数据需要复制或转移。
- **工作者线程不一定在同一个进程里** 通常，一个进程可以在内部产生多个线程。根据浏览器引擎的实现，工作者线程可能与页面属于同一进程，也可能不属于。例如，Chrome 的 Blink 引擎对 共享工作者线程和服务工作者线程使用独立的进程。
- **创建工作者线程的开销更大** 工作者线程有自己独立的事件循环、全局对象、事件处理程序和其他 JavaScript 环境必需的特性。创建这些结构的代价不容忽视

> **注意** 工作者线程相对比较重，不建议大量使用。

### 27.1.2 工作者线程的类型

#### 1.专用工作者线程

专用工作者线程，通常简称为工作者线程、Web Worker 或 Worker，是一种实用的工具，可以让脚本单独创建一个 JavaScript 线程，以执行委托的任务。专用工作者线程，顾名思义，只能被创建它的页面使用。

#### 2.共享工作者线程

共享工作者线程可以被多个不同的上下文使用，包括不同的页面。任何与创建共享工作者线程的脚本同源的脚本，都可以向共享工作者线程发送消息或从中接收消息。

#### 3.服务工作者线程

主要用途是拦截、重定向和修改页面发出的请求，充当网络请求的仲裁者的角色。

### 27.1.3 WorkerGlobalScope

在工作者线程内部，没有 `window` 的概念。这里的全局对象是 `WorkerGlobalScope` 的实例，通过 `self` 关键字暴露出来。

#### 1.WorkerGlobalScope 属性和方法

`self` 上可用的属性是 `window` 对象上属性的严格子集。其中有些属性会返回特定于工作者线程的版本。

- `navigator` 返回与工作者线程关联的 `WorkerNavigator`
- `self` 返回 `WorkerGlobalScope` 对象
- `location` 返回与工作者线程关联的 `WorkerLocation`
- `performance` 返回（只包含特定属性和方法的）`Performance` 对象
- `console` 返回与工作者线程关联的 `Console` 对象；对 API 没有限制
- `caches` 返回与工作者线程关联的 `CacheStorage` 对象；对 API 没有限制
- `indexedDB` 返回 `IDBFactory` 对象
- `isSecureContext` 返回布尔值，表示工作者线程上下文是否安全
- `origin` 返回 `WorkerGlobalScope` 的源

暴露的一些方法

- `atob()`
- `btoa()`
- `clearInterval()`
- `clearTimeout()`
- `createImageBitmap()`
- `fetch()`
- `setInterval()`
- `setTimeout()`

`WorkerGlobalScope` 还增加了新的全局方法 `importScripts()`，只在工作者线程内可用

#### 2.WorkerGlobalScope 的子类

每种类型的工作者线程都使用了自己特定的全局对象，这继承自 `WorkerGlobalScope`

- 专用工作者线程使用 `DedicatedWorkerGlobalScope`
- 共享工作者线程使用 `SharedWorkerGlobalScope`
- 服务工作者线程使用 `ServiceWorkerGlobalScope`

## 27.2 专用工作者线程

网页中的脚本可以创建专用工作者线程来执行在页面线程之外的其他任务。这样的线程可以与父页面交换信息、发送网络请求、执行文件输入/输出、进行密集计算、处理大量数据，以及实现其他不适合在页面执行线程里做的任务（否则会导致页面响应迟钝）

### 27.2.1 专用工作者线程的基本概念

JavaScript 线程的各个方面，包括生命周期管理、代码路径和输入/输出，都由初始化线程时提供的脚本来控制。该脚本也可以再请求其他脚本，但一个线程总是从一个脚本源开始。

#### 1.创建专用工作者线程

把文件路径提供给 Worker 构造函数，然后构造函数再在后台异步加载脚本并实例化工作者线程。

```js
// emptyWorker.js
console.log('emptyWorker');
```

```js
// main.js
const worker = new Worker('./emptyWorker.js');
console.log(worker);
```

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>创建专用工作者线程</title>
  </head>
  <body>
    <script src="./main.js"></script>
  </body>
</html>
```

#### 2. 工作者线程安全限制

工作者线程的脚本文件只能从与父页面相同的源加载。从其他源加载工作者线程的脚本文件会导致错误

> **注意** 不能使用非同源脚本创建工作者线程，并不影响执行其他源的脚本。在工作者线程内部，使用 `importScripts()` 可以加载其他源的脚本。

基于加载脚本创建的工作者线程不受文档的内容安全策略限制，因为工作者线程在与父文档不同的上下文中运行。不过，如果工作者线程加载的脚本带有全局唯一标识符（与加载自一个二进制大文件一样），就会受父文档内容安全策略的限制。

#### 3.使用 Worker 对象

`Worker()` 构造函数返回的 `Worker` 对象，可用于在工作者线程和父上下文间传输信息，以及捕获专用工作者线程发出的事件。

> **注意** 要管理好使用 `Worker()` 创建的每个 `Worker` 对象。在终止工作者线程之前，它不会被垃圾回收，也不能通过编程方式恢复对之前 `Worker` 对象的引用。

`Worker` 对象支持下列事件处理程序属性

- `onerror` 在工作者线程中发生 `ErrorEvent` 类型的错误事件时会调用指定给该属性的处理程序
  - 该事件会在工作者线程中抛出错误时发生
  - 该事件也可以通过 `worker.addEventListener('error', handler)` 的形式处理
- `onmessage` 在工作者线程中发生 `MessageEvent` 类型的消息事件时会调用指定给该属性的处理程序
  - 该事件会在工作者线程向父上下文发送消息时发生
  - 该事件也可以通过使用 `worker.addEventListener('message', handler)` 处理
- `onmessageerror` 在工作者线程中发生 `MessageEvent` 类型的错误事件时会调用指定给该属 性的处理程序
  - 该事件会在工作者线程收到无法反序列化的消息时发生
  - 该事件也可以通过使用 `worker.addEventListener('messageerror', handler)` 处理。

`Worker` 对象还支持下列方法

- `postMessage()` 用于通过异步消息事件向工作者线程发送信息
- `terminate()` 用于立即终止工作者线程。没有为工作者线程提供清理的机会，脚本会突然停止

#### 4.DedicatedWorkerGlobalScope

在专用工作者线程内部，全局作用域是 `DedicatedWorkerGlobalScope` 的实例。因为这继承自 `WorkerGlobalScope`，所以包含它的所有属性和方法。工作者线程可以通过 `self` 关键字访问该全局作用域

```js
// globalScopeWorker.js
console.log('inside worker: ', self);
```

```js
// main.js
const worker = new Worker('./globalScopeWorker.js');

console.log('created worker: ', worker);
// created worker:  Worker {onmessage: null, onerror: null}
// inside worker:  DedicatedWorkerGlobalScope {name: '', onmessage: null, onmessageerror: null, cancelAnimationFrame: ƒ, close: ƒ, …}
```

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DedicatedWorkerGlobalScope</title>
  </head>
  <body>
    <script src="./main.js"></script>
  </body>
</html>
```

因为工作者线程具有不可忽略的启动延迟，所以即使 `Worker` 对象存在，工作者线程的日志也会在主线程的日志之后打印出来。

`DedicatedWorkerGlobalScope` 在 `WorkerGlobalScope` 基础上增加了以下属性和方法

- `name` 可以提供给 `Worker` 构造函数的一个可选的字符串标识符
- `postMessage()` 与 `worker.postMessage()` 对应的方法，用于从工作者线程内部向父上下文发送消息
- `close()` 与 `worker.terminate()` 对应的方法，用于立即终止工作者线程。没有为工作者线程提供清理的机会，脚本会突然停止
- `importScripts()` 用于向工作者线程中导入任意数量的脚本

### 27.2.2 专用工作者线程与隐式 MessagePorts

专用工作者线程的 `Worker` 对象和 `DedicatedWorkerGlobalScope` 与 `MessagePorts` 有一些相同接口处理程序和方法：`onmessage`、`onmessageerror`、`close()` 和 `postMessage()`

父上下文中的 `Worker` 对象和 `DedicatedWorkerGlobalScope` 实际上融合了 `MessagePort`，并在自己的接口中分别暴露了相应的处理程序和方法。

也有不一致的地方：比如 `start()` 和 `close()` 约定。专用工作者线程会自动发送排队的消息，因此 `start()` 也就没有必要了。另外，`close()` 在专用工作者线程的上下文中没有意义，因为这样关闭 `MessagePort` 会使工作者线程孤立。因此，在工作者线程内部调用 `close()`（或在外部调用 `terminate()`）不仅会关闭 `MessagePort`，也会终止线程。

### 27.2.3 专用工作者线程的生命周期

一般来说，专用工作者线程可以非正式区分为处于下列三个状态：**初始化**（initializing）、活动（active）和**终止**（terminated）。这几个状态对其他上下文是不可见的。

初始化时，虽然工作者线程脚本尚未执行，但可以先把要发送给工作者线程的消息加入队列。这些消息会等待工作者线程的状态变为活动，再把消息添加到它的消息队列。

```js
// initializingWorker.js
self.addEventListener('message', ({ data }) => console.log(data));
```

```js
// main.js
const worker = new Worker('./27_2_3_initializingWorker.js');

// Worker 可能仍处于初始化状态
// 但 postMessage() 数据可以正常处理
worker.postMessage('foo');
worker.postMessage('bar');
worker.postMessage('baz');

// foo
// bar
// baz
```

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>专用工作者线程的生命周期</title>
  </head>
  <body>
    <script src="./main.js"></script>
  </body>
</html>
```

自我终止和外部终止最终都会执行相同的工作者线程终止例程。

```js
// closeWorker.js
self.postMessage('foo');
self.close();
self.postMessage('bar');
setTimeout(() => self.postMessage('baz'));
```

```js
// main.js
const worker = new Worker('./closeWorker.js');

worker.addEventListener('message', ({ data }) => console.log(data));

// foo
// bar
```

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>专用工作者线程的生命周期</title>
  </head>
  <body>
    <script src="./main.js"></script>
  </body>
</html>
```

`close()` 在这里会通知工作者线程取消事件循环中的所有任务，并阻止继续添加新任务。这也是为什么 `"baz"` 没有打印出来的原因。工作者线程不需要执行同步停止，因此在父上下文的事件循环中处理的 `"bar"` 仍会打印出来。

外部终止的例子

```js
// terminateWorker.js
self.onmessage = ({ data }) => console.log(data);
```

```js
// main.js
const worker = new Worker('./terminateWorker.js');

// 给 1000 毫秒让工作者线程初始化
setTimeout(() => {
  worker.postMessage('foo');
  worker.terminate();
  worker.postMessage('bar');
  setTimeout(() => worker.postMessage('baz'), 0);
}, 1000);

// foo
```

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>专用工作者线程的生命周期</title>
  </head>
  <body>
    <script src="./main.js"></script>
  </body>
</html>
```

外部先给工作者线程发送了带 `"foo"` 的 `postMessage`，这条消息可以在外部终止之前处理。一旦调用了 `terminate()`，工作者线程的消息队列就会被清理并锁住，这也是只是打印 `"foo"` 的原因。

在整个生命周期中，一个专用工作者线程只会关联一个网页（Web 工作者线程规范称其为一个**文档**）。除非明确终止，否则只要关联文档存在，专用工作者线程就会存在。如果浏览器离开网页（通过导航或关闭标签页或关闭窗口），它会将与其关联的工作者线程标记为终止，它们的执行也会立即停止。

### 27.2.4 配置 Worker 选项

`Worker()` 构造函数允许将可选的配置对象作为第二个参数。该配置对象支持下列属性。

- `name` 可以在工作者线程中通过 `self.name` 读取到的字符串标识符
- `type` 表示加载脚本的运行方式，可以是 `"classic"` 或 `"module"`。`"classic"` 将脚本作为常规脚本来执行，`"module"` 将脚本作为模块来执行
- `credentials` 在 `type` 为 `"module"` 时，指定如何获取与传输凭证数据相关的工作者线程模块脚本。值可以是 `"omit"`、`"same-orign"` 或 `"include"`。这些选项与 `fetch()` 的凭证选项相同。在 `type` 为 `"classic"` 时，默认为 `"omit"`

### 27.2.5 在 JavaScript 行内创建工作者线程

专用工作者线程也可以通过 `Blob` 对象 URL 在行内脚本创建

在行内创建工作者线程的例子

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>在 JavaScript 行内创建工作者线程</title>
  </head>
  <body>
    <script>
      //  创建要执行的 JavaScript 代码字符串
      const workerScript = 'self.onmessage = ({ data }) => console.log(data);';

      // 基于脚本字符串生成 Blob 对象
      const workerScriptBlob = new Blob([workerScript]);

      // 基于 Blob 实例创建对象 URL
      const workerScriptBlobUrl = URL.createObjectURL(workerScriptBlob);

      // 基于对象 URL 创建专用工作者线程
      const worker = new Worker(workerScriptBlobUrl);

      worker.postMessage('blob worker script');
      // blob worker script
    </script>
  </body>
</html>
```

工作者线程也可以利用函数序列化来初始化行内脚本。这是因为函数的 `toString()` 方法返回函数 代码的字符串，而函数可以在父上下文中定义并在子上下文中执行。

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>在 JavaScript 行内创建工作者线程</title>
  </head>
  <body>
    <script>
      function fibonacci(n) {
        return n < 1 ? 0
        : n <= 2 ? 1
        : fibonacci(n - 1) + fibonacci(n - 2);
      }
      const workerScript = `self.postMessage(${fibonacci.toString()}(9));`;
      const worker = new Worker(URL.createObjectURL(new Blob([workerScript])));
      worker.onmessage = ({ data }) => console.log(data);
      // 34
    </script>
  </body>
</html>
```

> **注意** 像这样序列化函数有个前提，就是函数体内不能使用通过闭包获得的引用，也包括全局变量，比如 `window`，因为这些引用在工作者线程中执行时会出错。

### 27.2.6 在工作者线程中动态执行脚本

可以使用 `importScripts()` 方法通过编程方式加载和执行任意脚本。该方法可用于全局 `Worker` 对象。这个方法会加载脚本并按照加载顺序同步执行。

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>在工作者线程中动态执行脚本</title>
  </head>
  <body>
    <script>
      const worker = new Worker('./worker.js');
      // importing scripts
      // scriptA executes
      // scriptB executes
      // scripts imported
    </script>
  </body>
</html>
```

```js
// worker.js
console.log('importing scripts');

importScripts('./scriptA.js', './scriptB.js');

console.log('scripts imported');
```

```js
// scriptA.js
console.log('scriptA executes');
```

```js
// scriptB.js
console.log('scriptB executes');
```

脚本加载受到常规 CORS 的限制，但在工作者线程内部可以请求来自任何源的脚本。这里的脚本导入策略类似于使用生成的 `<script>` 标签动态加载脚本。在这种情况下，所有导入的脚本也会共享作用域。

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>在工作者线程中动态执行脚本</title>
  </head>
  <body>
    <script>
      const worker = new Worker('./worker.js', { name: 'foo' });
      // importing scripts in foo with bar
      // scriptA executes in foo with bar
      // scriptB executes in foo with bar
      // scripts imported
    </script>
  </body>
</html>
```

```js
// worker.js
const globalToken = 'bar';
console.log(`importing scripts in ${self.name} with ${globalToken}`);

importScripts('./scriptA.js', './scriptB.js');

console.log('scripts imported');
```

```js
// scriptA.js
console.log(`scriptA executes in ${self.name} with ${globalToken}`);
```

```js
// scriptB.js
console.log(`scriptB executes in ${self.name} with ${globalToken}`);
```

### 27.2.7 委托任务到子工作者线程

有时候可能需要在工作者线程中再创建子工作者线程。在有多个 CPU 核心的时候，使用多个子工作者线程可以实现并行计算

子工作者线程的脚本路径根据父工作者线程而不是相对于网页来解析

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>委托任务到子工作者线程</title>
  </head>
  <body>
    <script>
      const worker = new Worker('./worker.js');
      // worker
      // subworker
    </script>
  </body>
</html>
```

```js
// worker.js
console.log('worker');

const worker = new Worker('./subworker.js');
```

```js
// subworker.js
console.log('subworker');
```

> **注意** 顶级工作者线程的脚本和子工作者线程的脚本都必须从与主页相同的源加载

### 27.2.8 处理工作者线程错误

如果工作者线程脚本抛出了错误，该工作者线程沙盒可以阻止它打断父线程的执行

```js
// main.js
// 其中的 try/catch 块不会捕获到错误
try {
  const worker = new Worker('./worker.js');
  console.log('no error');
} catch(e) {
  console.log('caught error');
}
// no error
```

```js
// worker.js
throw Error('foo');
```

此可以通过在 `Worker` 对象上设置 `onerror` 侦听器访问到

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>处理工作者线程错误</title>
  </head>
  <body>
    <script>
      const worker = new Worker('./worker.js');
      worker.onerror = console.log;
      // ErrorEvent {message: "Uncaught Error: foo"}
    </script>
  </body>
</html>
```

```js
// worker.js
throw new Error('foo');
```

### 27.2.9 与专用工作者线程通信

与工作者线程的通信都是通过异步消息完成的

#### 1.使用 postMessage()

使用 `postMessage()` 传递序列化的消息

```js
// factorialWorker.js
function factorial(n) {
  let result = 1;
  while (n) { result *= n--; }
  return result;
}

self.onmessage = ({ data }) => {
  self.postMessage(`${data}! = ${factorial(data)}`);
};
```

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>使用 postMessage()</title>
  </head>
  <body>
    <script>
      const factorialWorker = new Worker('./factorialWorker.js');

      factorialWorker.onmessage = ({ data }) => console.log(data);

      factorialWorker.postMessage(5);
      factorialWorker.postMessage(7);
      factorialWorker.postMessage(10);

      // 5! = 120
      // 7! = 5040
      // 10! = 3628800
    </script>
  </body>
</html>
```

#### 2. 使用 MessageChannel

Channel Messaging API 可以在两个上下文间明确建立通信渠道

`MessageChannel` 实例有两个端口，分别代表两个通信端点。要让父页面和工作线程通过 `MessageChannel` 通信，需要把一个端口传到工作者线程中

```js
// worker.js
// 在监听器中存储全局 messagePort
let messagePort = null;

function factorial(n) {
  let result = 1;
  while (n) { result *= n--; }
  return result;
}

self.onmessage = ({ ports }) => {
  // 只设置一次端口
  if (!messagePort) {
    // 初始化消息发送端口，
    // 给变量赋值并重置监听器
    messagePort = ports[0];
    self.onmessage = null;

    // 在全局对象上设置消息处理程序
    messagePort.onmessage = ({ data }) => {
      // 收到消息后发送数据
      messagePort.postMessage(`${data}! = ${factorial(data)}`);
    };
  }
};
```

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>使用 MessageChannel</title>
  </head>
  <body>
    <script>
      const channel = new MessageChannel();
      const factorialWorker = new Worker('./worker.js');

      // 把 MessagePort 对象发送到工作者线程
      // 工作者线程负责处理初始化信道
      factorialWorker.postMessage(null, [channel.port1]);

      // 工作者线程通过信道响应
      channel.port2.onmessage = ({ data }) => console.log(data);

      // 通过信道实际发送数据
      channel.port2.postMessage(5);

      // 5! = 120
    </script>
  </body>
</html>
```

`MessageChannel` 真正有用的地方是让两个工作者线程之间直接通信。这可以通过把端口传给另一个工作者线程实现

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>使用 MessageChannel</title>
  </head>
  <body>
    <script>
      const channel = new MessageChannel();
      const workerA = new Worker('./workerA.js');
      const workerB = new Worker('./workerB.js');

      workerA.postMessage('workerA', [channel.port1]);
      workerB.postMessage('workerB', [channel.port2]);

      workerA.onmessage = ({ data }) => console.log(data);
      workerB.onmessage = ({ data }) => console.log(data);

      workerA.postMessage(['page']);
      // ['page', 'workerA', 'workerB']

      workerB.postMessage(['page'])
      // ['page', 'workerB', 'workerA']
    </script>
  </body>
</html>
```

```js
// workerA.js
let messagePort = null;
let contextIdentifier = null;

/**
 * 添加上下文并发送
 * @param {string[]} data 标识符数据
 * @param {MessagePort|WindowOrWorkerGlobalScope} destination 通讯终端
 */
function addContextAndSend(data, destination) {
  // 添加标识符以表示当前工作者线程
  data.push(contextIdentifier);

  // 把数据发送到下一个目标
  destination.postMessage(data);
}

self.onmessage = ({ data, ports }) => {
  // 如果消息里存在端口（ports）
  // 则初始化工作者线程
  if (ports.length) {
    // 记录标识符
    contextIdentifier = data;

    // 获取 MessagePort
    messagePort = ports[0];

    // 添加处理程序把接收的数据
    // 发回到父页面
    messagePort.onmessage = ({ data }) => {
      addContextAndSend(data, self)
    };
  } else {
    addContextAndSend(data, messagePort);
  }
};
```

```js
// workerB.js
let messagePort = null;
let contextIdentifier = null;

/**
 * 添加上下文并发送
 * @param {string[]} data 标识符数据
 * @param {MessagePort|WindowOrWorkerGlobalScope} destination 通讯终端
 */
function addContextAndSend(data, destination) {
  // 添加标识符以表示当前工作者线程
  data.push(contextIdentifier);

  // 把数据发送到下一个目标
  destination.postMessage(data);
}

self.onmessage = ({ data, ports }) => {
  // 如果消息里存在端口（ports）
  // 则初始化工作者线程
  if (ports.length) {
    // 记录标识符
    contextIdentifier = data;

    // 获取 MessagePort
    messagePort = ports[0];

    // 添加处理程序把接收的数据
    // 发回到父页面
    messagePort.onmessage = ({ data }) => {
      addContextAndSend(data, self)
    };
  } else {
    addContextAndSend(data, messagePort);
  }
};
```

数组从父页面发送到工作者线程，工作者线程会加上自己的上下文标识符。然后，数组又从一个工作者线程发送到另一个工作者线程。第二个线程又加上自己的上下文标识符，随即将数组发回主页，主页把数组打印出来

#### 3.使用 BroadcastChannel

同源脚本能够通过 `BroadcastChannel` 相互之间发送和接收消息。这种通道类型的设置比较简单，不需要像 `MessageChannel` 那样转移乱糟糟的端口

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>使用 BroadcastChannel</title>
  </head>
  <body>
    <script>
      const channel = new BroadcastChannel('worker_channel');
      const worker = new Worker('./worker.js');
      const channel = new BroadcastChannel('worker_channel');

      channel.onmessage = ({ data }) => {
        console.log(`heard ${data} in worker`);
        channel.postMessage('bar');
      };

      // 工作者线程通过信道响应
      channel.onmessage = ({ data }) => console.log(`heard ${data} on page`);

      setTimeout(() => channel.postMessage('foo'), 1000);

      // heard foo in worker
      // heard bar on page
      /* 
      页面在通过 BroadcastChannel 发送消息之前会先等 1 秒钟。因为这种信道没有端口所有
      权的概念，所以如果没有实体监听这个信道，广播的消息就不会有人处理。在这种情况下，如果没有
      setTimeout()，则由于初始化工作者线程的延迟，就会导致消息已经发送了，但工作者线程上的消息
      处理程序还没有就位
       */
    </script>
  </body>
</html>
```

```js
// worker.js
const channel = new BroadcastChannel('worker_channel');

channel.onmessage = ({ data }) => {
  console.log(`heard ${data} in worker`);
  channel.postMessage('bar');
};
```

### 27.2.10 工作者线程数据传输

有三种在上下文间转移信息的方式：**结构化克隆算法**（structured clone algorithm）、**可转移对象**（transferable objects）和**共享数组缓冲区**（shared array buffers）

#### 1.结构化克隆算法

**结构化克隆算法**可用于在两个独立上下文间共享数据

在通过 `postMessage()` 传递对象时，浏览器会遍历该对象，并在目标上下文中生成它的一个副本。下列类型是结构化克隆算法支持的类型。

- 除 `Symbol` 之外的所有原始类型
- `Boolean` 对象
- `String` 对象
- `Date`
- `RegExp`
- `Blob`
- `File`
- `FileList`
- `ArrayBuffer`
- `ArrayBufferView`
- `ImageData`
- `Array`
- `Object`
- `Map`
- `Set`

> **注意** 结构化克隆算法在对象比较复杂时会存在计算性消耗。因此，实践中要尽可能避免过大、过多的复制

#### 2.可转移对象

使用可**转移对象**（transferable objects）可以把所有权从一个上下文转移到另一个上下文。

只有如下几种对象是可转移对象：

- `ArrayBuffer`
- `MessagePort`
- `ImageBitmap`
- `OffscreenCanvas`

`postMessage()` 方法的第二个可选参数是数组，它指定应该将哪些对象转移到目标上下文。

在遍历消息负载对象时，浏览器根据转移对象数组检查对象引用，并对转移对象进行转移而不复制它们。这意味着被转移的对象可以通过消息负载发送，消息负载本身会被复制

下面的例子演示了工作者线程对 `ArrayBuffer` 的常规结构化克隆。这里没有对象转移：

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>可转移对象</title>
  </head>
  <body>
    <script>
      const worker = new Worker('./worker.js');

      // 创建 32 位缓冲区
      const arrayBuffer = new ArrayBuffer(32);

      console.log(`page's buffer size: ${arrayBuffer.byteLength}`);  // 32

      worker.postMessage(arrayBuffer);

      console.log(`page's buffer size: ${arrayBuffer.byteLength}`);  // 32
    </script>
  </body>
</html>
```

```js
// worker.js
self.onmessage = ({ data }) => {
  console.log(`worker's buffer size: ${data.byteLength}`);  // 32
};
```

如果把 `ArrayBuffer` 指定为可转移对象，那么对缓冲区内存的引用就会从父上下文中抹去，然后分配给工作者线程。

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>可转移对象</title>
  </head>
  <body>
    <script>
      const worker = new Worker('./worker.js');

      // 创建 32 位缓冲区
      const arrayBuffer = new ArrayBuffer(32);

      console.log(`page's buffer size: ${arrayBuffer.byteLength}`);  // 32

      worker.postMessage(arrayBuffer, [arrayBuffer]);

      console.log(`page's buffer size: ${arrayBuffer.byteLength}`);  // 0
    </script>
  </body>
</html>
```

```js
// worker.js
self.onmessage = ({ data }) => {
  console.log(`worker's buffer size: ${data.byteLength}`);  // 32
};
```

#### 3.SharedArrayBuffer

> **注意** 由于 Spectre 和 Meltdown 的漏洞，所有主流浏览器在 2018 年 1 月就禁用了 `SharedArrayBuffer`。从 2019 年开始，有些浏览器开始逐步重新启用这一特性。

既不克隆，也不转移，`SharedArrayBuffer` 作为 `ArrayBuffer` 能够在不同浏览器上下文间共享。在把 `SharedArrayBuffer` 传给 `postMessage()` 时，浏览器只会传递原始缓冲区的引用。结果是，两个不同的 JavaScript 上下文会分别维护对同一个内存块的引用。每个上下文都可以随意修改这个缓冲区

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SharedArrayBuffer</title>
  </head>
  <body>
    <script>
      const worker = new Worker('./worker.js');

      // 创建 1 字节缓冲区
      const sharedArrayBuffer = new SharedArrayBuffer(1);

      // 创建 1 字节缓冲区的视图
      const view = new Uint8Array(sharedArrayBuffer);

      // 父上下文赋值 1
      view[0] = 1;

      worker.onmessage = () => {
        console.log(`buffer value after worker modification: ${view[0]}`);
      };

      // 发送对 sharedArrayBuffer 的引用
      worker.postMessage(sharedArrayBuffer);
      // buffer value before worker modification: 1
      // buffer value after worker modification: 2
    </script>
  </body>
</html>
```

```js
// worker.js
self.onmessage = ({ data }) => {
  const view = new Uint8Array(data);
  console.log(`buffer value before worker modification: ${view[0]}`);

  // 工作者线程为共享缓冲区赋值
  view[0] += 1;

  // 发送空消息，通知赋值完成
  self.postMessage(null);
};
```

在两个并行线程中共享内存块有资源争用的风险。换句话说，`SharedArrayBuffer` 实例实 际上会被当成易变（volatile）内存。

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SharedArrayBuffer</title>
  </head>
  <body>
    <script>
      // 创建包含 4 个线程的线程池
      const workers = [];
      for (let i = 0; i < 4; i++) {
        workers.push(new Worker('./27_2_10_3_1_worker.js'));
      }

      // 在最后一个工作者线程完成后打印最终值
      let responseCount = 0;
      for (const worker of workers) {
        worker.onmessage = () => {
          if (++responseCount === workers.length) {
            console.log(`Final buffer value: ${view[0]}`);
          }
        };
      }

      //  初始化 SharedArrayBuffer
      const sharedArrayBuffer = new SharedArrayBuffer(4);
      const view = new Uint32Array(sharedArrayBuffer);
      view[0] = 1;
      // 把 SharedArrayBuffer 发给每个线程
      for (const worker of workers) {
        worker.postMessage(sharedArrayBuffer);
      }
      // （期待结果为 4000001。实际输出类似于：）
      // Final buffer value: 2145106
    </script>
  </body>
</html>
```

```js
// worker.js
self.onmessage = ({ data }) => {
  const view = new Uint32Array(data);

  // 执行 100 万次加操作
  for (let i = 0; i < 1e6; i++) {
    view[0] += 1;
  }

  self.postMessage(null);
};
```

为解决该问题，可以使用 `Atomics` 对象让一个工作者线程获得 `SharedArrayBuffer` 实例的锁，在执行完全部读/写/读操作后，再允许另一个工作者线程执行操作。

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SharedArrayBuffer</title>
  </head>
  <body>
    <script>
      // 创建包含 4 个线程的线程池
      const workers = [];
      for (let i = 0; i < 4; i++) {
        workers.push(new Worker('./27_2_10_3_2_worker.js'));
      }

      // 在最后一个工作者线程完成后打印最终值
      let responseCount = 0;
      for (const worker of workers) {
        worker.onmessage = () => {
          if (++responseCount === workers.length) {
            console.log(`Final buffer value: ${view[0]}`);
          }
        };
      }

      //  初始化 SharedArrayBuffer
      const sharedArrayBuffer = new SharedArrayBuffer(4);
      const view = new Uint32Array(sharedArrayBuffer);
      view[0] = 1;

      // 把 SharedArrayBuffer 发给每个线程
      for (const worker of workers) {
        worker.postMessage(sharedArrayBuffer);
      }
      // （期待结果为 4000001）
      // Final buffer value: 2145106
    </script>
  </body>
</html>
```

```js
// worker.js
self.onmessage = ({ data }) => {
  const view = new Uint32Array(data);

  // 执行 100 万次加操作
  for (let i = 0; i < 1e6; i++) {
    Atomics.add(view, 0, 1);
  }

  self.postMessage(null);
};
```

### 27.2.11 线程池

工作者线程在执行计算时，会被标记为忙碌状态。直到它通知线程池自己空闲了，才准备好接收新任务。这些活动线程就称为“线程池”或“工作者线程池”。

可以参考  `navigator.hardwareConcurrency` 属性返回的系统可用的核心数量。因为不太可能知道每个核心的多线程能力，所以最好把这个数字作为线程池大小的上限。

接下来的例子将构建一个相对简单的线程池，定义一个 `TaskWorker` 类，它可以扩展 `Worker` 类。`TaskWorker` 类负责两件事：跟踪线程是否正忙于工作，并管理进出线程的信息与事件。另外，传入给这个工作者线程的任务会封装到一个 `Promise` 中，然后正确地解决和拒绝。

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>线程池</title>
  </head>
  <body>
    <script>
      class TaskWorker extends Worker {
        constructor(notifyAvaliable, ...workerArgs) {
          super(...workerArgs);

          // 初始化为不可用状态
          this.avaliable = false;
          this.resolve = null;
          this.reject = null;

          // 线程池会传递回调
          // 以便工作者线程发出它需要新任务的信号
          this.notifyAvaliable = notifyAvaliable;

          // 线程脚本在完全初始化之后
          // 会发送一条 "ready" 消息
          this.onmessage = this.setAvaliable;
        }

        // 由线程池调用，以分派新任务
        dispatch({ resolve, reject, postMessageArgs }) {
          this.avaliable = false;

          this.onmessage = ({ data }) => {
            resolve(data);
            this.setAvaliable();
          };

          this.onerror = e => {
            reject(e);
            this.setAvaliable();
          };

          this.postMessage(...postMessageArgs);
        }

        setAvaliable() {
          this.avaliable = true;
          this.resolve = null;
          this.reject = null;
          this.notifyAvaliable();
        }
      }

      class WorkerPool {
        constructor(poolSize, ...workerArgs) {
          this.taskQueue = [];
          this.workers = [];
          // 初始化线程池
          for (let i = 0; i < poolSize; i++) {
            this.workers.push(new TaskWorker(this.dispatchIfAvailable, ...workerArgs));
          }
        }

        // 把任务推入队列
        enqueue(...postMessageArgs) {
          return new Promise((resolve, reject) => {
            this.taskQueue.push({ resolve, reject, postMessageArgs });
            this.dispatchIfAvailable();
          });
        }

        // 把任务发送给下一个空闲的线程（如果有的话）
        dispatchIfAvailable() {
          if (!this.taskQueue.length) return;
          for (const worker of this.workers) {
            if (worker.available) {
              const a = this.taskQueue.shift();
              worker.dispatch(a);
              break;
            }
          }
        }

        // 终止所有工作者线程
        close() {
          for (const worker of this.workers) {
            worker.terminate();
          }
        }
      }
    </script>

    <script>
      const totalFloats = 1E8;
      const numTasks = 20;
      const floatsPerTask = totalFloats / numTasks;
      const numWorkers = 4;
      // 创建线程池
      const pool = new WorkerPool(numWorkers, './27_2_11_worker.js');

      // 填充浮点值数组
      const arrayBuffer = new SharedArrayBuffer(4 * totalFloats);
      const view = new Float32Array(arrayBuffer);
      const partialSumPromises = [];
      for (let i = 0; i < totalFloats; ++i) {
        view[i] = Math.random();
      }
      for (let i = 0; i < totalFloats; i += floatsPerTask) {
        partialSumPromises.push(
          pool.enqueue({
            startIdx: i,
            endIdx: i + floatsPerTask,
            arrayBuffer
          })
        );
      }
      // 等待所有期约完成，然后求和
      Promise.all(partialSumPromises)
        .then(partialSums => partialSums.reduce((x, y) => x + y))
        .then(console.log);
      //（在这个例子中，和应该约等于 1E8/2）
      // 49997075.47203197
    </script>
  </body>
</html>
```

```js
// worker.js
self.onmessage = ({ data }) => {
  let sum = 0;
  const view = new Float32Array(data.arrayBuffer);

  // 求和
  for (let i = data.startIdx; i < data.endIdx; i++) {
    // 不需要原子操作，因为只需要读
    sum += view[i];
  }

  // 把结果发送给工作者线程
  self.postMessage(sum);
};

// 发送消息给 TaskWorker
// 通知工作者线程准备好接收任务了
self.postMessage('ready');
```



## 27.3 共享工作者线程

**共享工作者线程**或**共享线程**与专用工作者线程类似，但可以被多个可信任的执行上下文访问

`SharedWorker` 与 `Worker` 的消息接口稍有不同，包括外部和内部

共享线程适合开发者希望通过在多个上下文间共享线程减少计算性消耗的情形

### 27.3.1 共享工作者线程简介

与专用工作者线程一样，共享工作者线程也在独立执行上下文中运行，也只能与其他上下文异步通信

#### 1.创建共享工作者线程

通过加载 JavaScript 文件创建。此时，需要给 `SharedWorker` 构造函数传入文件路径，该构造函数在后台异步加载脚本并实例化共享工作者线程

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>共享工作者线程简介</title>
  </head>
  <body>
    <script>
      const sharedWorker = new SharedWorker('./emptySharedWorker.js');
      console.log(sharedWorker);  // SharedWorker {}
    </script>
  </body>
</html>
```

```js
// emptySharedWorker.js
console.log('emptySharedWorker');
```

也可以在行内脚本中创建共享工作者线程，但这样做没什么意义。因为每个基于行内脚本字符串创建的 `Blob` 都会被赋予自己唯一的浏览器内部 URL，所以行内脚本中创建的共享工作者线程始终是唯一的。

#### 2.SharedWorker 标识与独占

虽然 `Worker()` 构造函数始终会创建新实例，而 `SharedWorker()` 则只会在相同的标识不存在的情况下才创建新实例。如果**的确**存在与标识匹配的共享工作者线程，则只会与已有共享者线程建立新的连接。

共享工作者线程标识源自解析后的脚本 URL、工作者线程名称和文档源。

下面的脚本将实例化一个共享工作者线程并添加两个连接：

```js
// 实例化一个共享工作者线程
// - 全部基于同源调用构造函数
// - 所有脚本解析为相同的 URL
// - 所有线程都有相同的名称
new SharedWorker('./sharedWorker.js');
new SharedWorker('./sharedWorker.js');
new SharedWorker('./sharedWorker.js');
```

下面三个脚本字符串都解析到相同的 URL，所以也只会创建一个共享工作者线程：

```js
// 实例化一个共享工作者线程，假设当前域名是：https://www.example.com
// - 全部基于同源调用构造函数
// - 所有脚本解析为相同的 URL
// - 所有线程都有相同的名称
new SharedWorker('./sharedWorker.js');
new SharedWorker('sharedWorker.js');
new SharedWorker('https://www.example.com/sharedWorker.js');
```

不同的线程名称会强制浏览器创建多个共享工作者线程。对下面的例子而言，一个名为 `'foo'`，另一个名为 `'bar'`，尽管它们同源且脚本 URL 相同：

```js
// 实例化一个共享工作者线程
// - 全部基于同源调用构造函数
// - 所有脚本解析为相同的 URL
// - 一个线程名称为'foo'，一个线程名称为'bar'
new SharedWorker('./sharedWorker.js', { name: 'foo' });
new SharedWorker('./sharedWorker.js', { name: 'foo' });
new SharedWorker('./sharedWorker.js', { name: 'bar' });
```

共享线程，顾名思义，可以在不同标签页、不同窗口、不同内嵌框架或同源的其他工作者线程之间共享。

初始化共享线程的脚本只会限制 URL，因此下面的代码会创建两个共享工作者线程，尽管加载了相同的脚本：

```js
// 实例化一个共享工作者线程
// - 全部基于同源调用构造函数
// - '?'导致了两个不同的 URL
// - 所有线程都有相同的名称
new SharedWorker('./sharedWorker.js');
new SharedWorker('./sharedWorker.js?');
```

如果该脚本在两个不同的标签页中运行，同样也只会创建两个共享工作者线程。每个构造函数都会检查匹配的共享工作者线程，然后连接到已存在的那个。

#### 3.使用 SharedWorker 对象

`SharedWorker` 通过 `MessagePort` 在共享工作者线程和父上下文间传递信息

`SharedWorker` 对象支持以下属性

- `onerror` 在共享线程中发生 `ErrorEvent` 类型的错误事件时会调用指定给该属性的处理程序
  - 此事件会在共享线程抛出错误时发生
  - 此事件也可以通过使用 `sharedWorker.addEventListener('error', handler)` 处理
- `port` 专门用来跟共享线程通信的 `MessagePort`

#### 4.SharedWorkerGlobalScope

在共享线程内部，全局作用域是 `SharedWorkerGlobalScope` 的实例。`SharedWorkerGlobalScope` 继承自 `WorkerGlobalScope`，因此包括它所有的属性和方法。通过 `self` 关键字访问该全局上下文

`SharedWorkerGlobalScope` 通过以下属性和方法扩展了 `WorkerGlobalScope`

- `name` 可选的字符串标识符，可以传给 `SharedWorker` 构造函数
- `importScripts()` 用于向工作者线程中导入任意数量的脚本
- `close()` 与 `worker.terminate()` 对应，用于立即终止工作者线程。没有给工作者线程提供终止前清理的机会；脚本会突然停止。
- `onconnect` 与共享线程建立新连接时，应将其设置为处理程序。`connect` 事件包括 `MessagePort` 实例的 `ports` 数组，可用于把消息发送回父上下文
  - 在通过 `worker.port.onmessage` 或 `worker.port.start()` 与共享线程建立连接时都会触发 `connect` 事件
  - `connect` 事件也可以通过使用 `sharedWorker.addEventListener('connect', handler)` 处理

> **注意** 根据浏览器实现，在 `SharedWorker` 中把日志打印到控制台不一定能在浏览器默认的控制台中看到。

### 27.3.2 理解共享工作者线程的生命周期

共享工作者线程的生命周期具有与专用工作者线程相同的阶段的特性。不同之处在于，专用工作者线程只跟一个页面绑定，而共享工作者线程只要还有一个上下文连接就会持续存在。

```js
// 每次调用它都会创建一个专用工作者线程
new Worker('./worker.js');
```

下表详细列出了当三个包含此脚本的标签页按顺序打开和关闭时会发生什么。

| 事件                    | 结果            | 事件发生后的线程数 |
| ----------------------- | --------------- | ------------------ |
| 标签页 1 执行 `main.js` | 创建专用线程 1  | 1                  |
| 标签页 2 执行 `main.js` | 创建专用线程 2  | 2                  |
| 标签页 3 执行 `main.js` | 创建专用线程 3  | 3                  |
| 标签页 1 关闭           | 专用线程 1 终止 | 2                  |
| 标签页 2 关闭           | 专用线程 2 终止 | 1                  |
| 标签页 3 关闭           | 专用线程 3 终止 | 0                  |

```js
// 每次执行它都会创建或者连接到共享线程
new SharedWorker('./sharedWorker.js');
```

下表列出了当三个包含此脚本的标签页按顺序打开和关闭时会发生什么。

| 事件                    | 结果                                                    | 事件发生后的线程数 |
| ----------------------- | ------------------------------------------------------- | ------------------ |
| 标签页 1 执行 `main.js` | 创建共享线程 1                                          | 1                  |
| 标签页 2 执行 `main.js` | 连接共享线程 1                                          | 1                  |
| 标签页 3 执行 `main.js` | 连接共享线程 1                                          | 1                  |
| 标签页 1 关闭           | 断开与共享线程 1 的连接                                 | 1                  |
| 标签页 2 关闭           | 断开与共享线程 1 的连接                                 | 1                  |
| 标签页 3 关闭           | 断开与共享线程 1 的连接。没有连接了，因此终止共享线程 1 | 0                  |

没有办法以编程方式终止共享线程。`SharedWorker` 对象上没有 `terminate()` 方法。在共享线程端口（稍后讨论）上调用 `close()` 时，只要还有一个端口连接到该线程就不会真的终止线程

### 27.3.3 连接到共享工作者线程

每次调用 `SharedWorker()` 构造函数，无论是否创建了工作者线程，都会在共享线程内部触发 `connect` 事件。

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>连接到共享工作者线程</title>
  </head>
  <body>
    <script>
      for (let i = 0; i < 5; i++) {
        new SharedWorker('./sharedWorker.js');
      }

      // connected 1 times
      // connected 2 times
      // connected 3 times
      // connected 4 times
      // connected 5 times
    </script>
  </body>
</html>
```

```js
// sharedWorker.js
let i = 0;
self.onconnect = () => console.log(`connected ${i++} times`);
```

发生 `connect` 事件时，`SharedWorker()` 构造函数会隐式创建 `MessageChannel` 实例，并把 `MessagePort` 实例的所有权唯一地转移给该 `SharedWorker` 的实例。这个 `MessagePort` 实例会保存在 `connect` 事件对象的 `ports` 数组中。一个连接事件只能代表一个连接，因此可以假定 `ports` 数组的长度等于 1。

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>连接到共享工作者线程</title>
  </head>
  <body>
    <script>
      for (let i = 0; i < 5; i++) {
        new SharedWorker('./sharedWorker.js');
      }

      // 1 unique connected ports
      // 2 unique connected ports
      // 3 unique connected ports
      // 4 unique connected ports
      // 5 unique connected ports 
    </script>
  </body>
</html>
```

```js
// sharedWorker.js
const connectedProts = new Set();

self.onconnect = ({ ports }) => {
  connectedProts.add(ports[0]);

  console.log(`${connectedProts.size} unique connected ports`);
};
```

共享线程与父上下文的启动和关闭不是对称的。每个新 `SharedWorker` 连接都会触发一个事件，但没有事件对应断开 `SharedWorker` 实例的连接（如页面关闭）。

> **注意** `SharedWorker` 兼容性较差，实际开发中慎用

## 27.4 服务工作者线程

**服务工作者线程**（service worker）是一种类似浏览器中代理服务器的线程，可以拦截外出请求和缓存响应。这可以让网页在没有网络连接的情况下正常使用，因为部分或全部页面可以从服务工作者线程缓存中提供服务。服务工作者线程也可以使用 Notifications API、Push API、Background Sync API 和 Channel Messaging API。

> **注意** 服务工作者线程涉及的内容极其广泛，几乎可以单独写一本书。为了更好地理解这一话题，推荐有条件的读者学一下 Udacity 的课程“Offline Web Applications”。除此之外，也可以参考 Mozilla 维护的 Service Worker Cookbook 网站，其中包含了常见的服务工作者线程模式。

### 27.4.1 服务工作者线程基础

作为一种工作者线程，服务工作者线程与专用工作者线程和共享工作者线程拥有很多共性。比如，在独立上下文中运行，只能通过异步消息通信。

#### 1.ServiceWorkerContainer

服务工作者线程与专用工作者线程或共享工作者线程的一个区别是没有全局构造函数。服务工作者线程是通过 `ServiceWorkerContainer` 来管理的，它的实例保存在 `navigator.serviceWorker` 属性中。该对象是个顶级接口，通过它可以让浏览器创建、更新、销毁或者与服务工作者线程交互。

```js
console.log(navigator.serviceWorker);
// ServiceWorkerContainer { ... }
```

#### 2.创建服务工作者线程

`ServiceWorkerContainer` 没有通过全局构造函数创建，而是暴露了 `register()` 方法，该方法 以与 `Worker()` 或 `SharedWorker()` 构造函数相同的方式传递脚本 URL

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>创建服务工作者线程</title>
  </head>
  <body>
    <script>
      // 注册成功，成功回调（解决）
      navigator.serviceWorker.register('./emptyServiceWorker.js')
        .then(console.log, console.error);
      // ServiceWorkerRegistration { ... } 

      // 使用不存在的文件注册，失败回调（拒绝）
      navigator.serviceWorker.register('./doesNotExist.js')
        .then(console.log, console.error);
      // TypeError: Failed to register a ServiceWorker:
      // A bad HTTP response code (404) was received when fetching the script.
    </script>
  </body>
</html>
```

```js
// emptyServiceWorker.js
console.log('emptyServiceWorker');
```

注册服务工作者线程的一种非常常见的模式是基于特性检测，并在页面的 `load` 事件中操作

```js
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./serviceWorker.js');
  });
} 
```

如果没有 `load` 事件这个门槛，服务工作者线程的注册就会与页面资源的加载重叠，进而拖慢初始页面渲染的过程。除非该服务工作者线程负责管理缓存 `clients.claim()`，否则等待 `load` 事件是个明智的选择，这样同样可以发挥服务工作者线程的价值。

#### 3.使用 ServiceWorkerContainer 对象

`ServiceWorkerContainer` 支持以下事件处理程序

- `oncontrollerchange` 在 `ServiceWorkerContainer` 触发 `controllerchange` 事件时会调用指定的事件处理程序
  - 此事件在获得新激活的 `ServiceWorkerRegistration` 时触发
  - 此事件也可以使用 `navigator.serviceWorker.addEventListener('controllerchange', handler)` 处理
- `onerror` 在关联的服务工作者线程触发 `ErrorEvent` 错误事件时会调用指定的事件处理程序
  - 此事件在关联的服务工作者线程内部抛出错误时触发
  - 此事件也可以使用 `navigator.serviceWorker.addEventListener('error', handler)` 处理
- `onmessage` 在服务工作者线程触发 `MessageEvent` 事件时会调用指定的事件处理程序
  - 此事件在服务脚本向父上下文发送消息时触发
  - 此事件也可以使用 `navigator.serviceWorker.addEventListener('message', handler)` 处理

`ServiceWorkerContainer` 支持下列属性

- `ready` 返回期约，解决为激活的 `ServiceWorkerRegistration` 对象。该期约不会拒绝
- `controller` 返回与当前页面关联的激活的 `ServiceWorker` 对象，如果没有激活的服务工作者线程则返回 `null`

`ServiceWorkerContainer` 支持下列方法

- `register()` 使用接收的 `url` 和 `options` 对象创建或更新 `ServiceWorkerRegistration`
- `getRegistration()` 返回期约，解决为与提供的作用域匹配的 `ServiceWorkerRegistration` 对象；如果没有匹配的服务工作者线程则返回 `undefined`
- `getRegistrations()` 返回期约，解决为与 `ServiceWorkerContainer` 关联的 `ServiceWorkerRegistration` 对象的数组；如果没有关联的服务工作者线程则返回空数组
- `startMessage()` 开始传送通过 `Client.postMessage()` 派发的消息

#### 4.使用 ServiceWorkerRegistration 对象

`ServiceWorkerRegistration` 对象表示注册成功的服务工作者线程。该对象可以在 `register()` 返回的解决期约的处理程序中访问到。通过它的一些属性可以确定关联服务工作者线程的生命周期状态。

调用 `navigator.serviceWorker.register()` 之后返回的期约会将注册成功的 `ServiceWorkerRegistration` 对象（注册对象）发送给处理函数。在同一页面使用同一 URL 多次调用该方法会返回相同的注册对象。

```js
(async () => {
  const registrationA = await navigator.serviceWorker.register('./serviceWorker.js');
	const registrationB = await navigator.serviceWorker.register('./serviceWorker2.js');
  console.log(registrationA === registrationB);
})();
```

`ServiceWorkerRegistration` 支持以下事件处理程序

- `onupdatefound` 在服务工作者线程触发 `updatefound` 事件时会调用指定的事件处理程序
  - 此事件会在服务工作者线程开始安装新版本时触发，表现为 `ServiceWorkerRegistration.installing` 收到一个新的服务工作者线程
  - 此事件也可以使用 `serviceWorkerRegistration.addEventListener('updatefound', handler)` 处理

`ServiceWorkerRegistration` 支持以下通用属性

- `scope` 返回服务工作者线程作用域的完整 URL 路径。该值源自接收服务脚本的路径和在 `register()` 中提供的作用域
- `navigationPreload` 返回与注册对象关联的 `NavigationPreloadManager` 实例
- `pushManager` 返回与注册对象关联的 `pushManager` 实例

`ServiceWorkerRegistration` 还支持以下属性，可用于判断服务工作者线程处于生命周期的什么阶段

- `installing` 如果有则返回状态为 `installing`（安装）的服务工作者线程，否则为 `null`
- `waiting` 如果有则返回状态为 `waiting`（等待）的服务工作者线程，否则为 `null`
- `active` 如果有则返回状态 `activating` 或 `active`（活动）的服务工作者线程，否则为 `null`

注意，这些属性都是服务工作者线程状态的一次性快照。

`ServiceWorkerRegistration` 支持下列方法

- `getNotifications()` 返回期约，解决为 `Notification` 对象的数组
- `showNotifications()` 显示通知，可以配置 `title` 和 `options` 参数
- `update()` 直接从服务器重新请求服务脚本，如果新脚本不同，则重新初始化
- `unregister()` 取消服务工作者线程的注册。该方法会在服务工作者线程执行完再取消注册

#### 5.使用 ServiceWorker 对象

`ServiceWorker` 对象可以通过两种方式获得：

- 通过 `ServiceWorkerContainer` 对象的 `controller` 属性
- 通过 `ServiceWorkerRegistration` 的 `active` 属性

该对象继承 `Worker` 原型，因此包括其所有属性和方法，但没有 `terminate()` 方法。

`ServiceWorker` 支持以下事件处理程序

- `onstatechange` `ServiceWorker` 发生 `statechange` 事件时会调用指定的事件处理程序
  - 此事件会在 `ServiceWorker.state` 变化时发生
  - 此事件也可以使用 `serviceWorker.addEventListener('statechange', handler)` 处理。`ServiceWorker` 支持以下属性
- `scriptURL` 解析后注册服务工作者线程的 URL。例如，如果服务工作者线程是通过相对路径 `'./serviceWorker.js'` 创建的，且注册在 `https://www.example.com` 上，则 `scriptURL` 属性将返回 `"https://www.example.com/serviceWorker.js"`
- `state` 表示服务工作者线程状态的字符串，可能的值如下
  - `installing`
  - `installed`
  - `activating`
  - `activated`
  - `redundant`

#### 6.服务工作者线程的安全限制

服务工作者线程 API 只能在安全上下文（HTTPS）下使用。在非安全上下文（HTTP）中，`navigator.serviceWorker` 是 `undefined`。为方便开发，浏览器豁免了通过 `localhost` 或 `127.0.0.1` 在本地加载的页面的安全上下文规则。

> **注意** 可以通过 `window.isSecureContext` 确定当前上下文是否安全。

#### 7.ServiceWorkerGlobalScope

在服务工作者线程内部，全局上下文是 `ServiceWorkerGlobalScope` 的实例。

`ServiceWorkerGlobalScope` 通过以下属性和方法扩展了 `WorkerGlobalScope`。

- `caches` 返回服务工作者线程的 `CacheStorage` 对象
- `clients` 返回服务工作者线程的 `Clients` 接口，用于访问底层 `Client` 对象
- `registration` 返回服务工作者线程的 `ServiceWorkerRegistration` 对象
- `skipWaiting()` 强制服务工作者线程进入活动状态；需要跟 `Clients.claim()` 一起使用
- `fetch()` 在服务工作者线程内发送常规网络请求；用于在服务工作者线程确定有必要发送实际网络请求（而不是返回缓存值）时。

> **注意** 根据浏览器实现，在 `SeviceWorker` 中把日志打印到控制台不一定能在浏览器默认控制台中看到。

服务工作者线程的全局作用域可以监听以下事件，这里进行了分类

- 服务工作者线程状态
  - `install` 在服务工作者线程进入**安装**状态时触发（在客户端可以通过 `ServiceWorkerRegistration.installing` 判断）。也可以在 `self.onintall` 属性上指定该事件的处理程序
    - 这是服务工作者线程接收的第一个事件，在线程一开始执行时就会触发
    - 每个服务工作者线程只会调用一次
  - `activate` 在服务工作者线程进入激活或已激活 状态时触发（在客户端可以通过 `ServiceWorkerRegistration.active` 判断）。也可以在 `self.onactive` 属性上指定该事件的处理程序
    - 此事件在服务工作者线程准备好处理功能性事件和控制客户端时触发
    - 此事件并不代表服务工作者线程在控制客户端，只表明具有控制客户端的条件
- Fetch API
  - `fetch` 在服务工作者线程截获来自主页面的 `fetch()` 请求时触发。服务工作者线程的 `fetch` 事件处理程序可以访问 `FetchEvent`，可以根据需要调整输出。也可以在 `self.onfetch` 属性上指定该事件的处理程序
- Message API
  - `message` 在服务工作者线程通过 `postMesssage()` 获取数据时触发。也可以在 `self.onmessage` 属性上指定该事件的处理程序
- Notification API
  - `notificationclick` 在系统告诉浏览器用户点击了 `ServiceWorkerRegistration.showNotification()` 生成的通知时触发。也可以在 `self.onnotificationclick` 属性上指定该事件的处理程序
  - `notificationclose` 在系统告诉浏览器用户关闭或取消显示了 `ServiceWorkerRegistration.showNotification()` 生成的通知时触发。也可以在 `self.onnotificationclose` 属性上指定该事件的处理程序
- Push API
  - `push` 在服务工作者线程接收到推送消息时触发。也可以在 `self.onpush` 属性上指定该事件的处理程序
  - `pushsubscriptionchange` 在应用控制外的因素（非 JavaScript 显式操作）导致推送订阅状态变化时触发。也可以在 `self.onpushsubscriptionchange` 属性上指定该事件的处理程序

#### 8.服务工作者线程作用域限制

服务工作者线程只能拦截其作用域内的客户端发送的请求。作用域是相对于获取服务脚本的路径定义的。如果没有在 `register()` 中指定，则作用域就是服务脚本的路径。

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>服务工作者线程作用域限制</title>
  </head>
  <body>
    <script>
      (async () => {
        // const serviceWorkerRegistration = await navigator.serviceWorker.register('./serviceWorker.js');
        // const serviceWorkerRegistration = await navigator.serviceWorker.register('./serviceWorker.js', { scope: './' });
        const serviceWorkerRegistration = await navigator.serviceWorker.register('./serviceWorker.js', { scope: './foo' });
        console.log(serviceWorkerRegistration.scope);
        // http://127.0.0.1:5500
        // http://127.0.0.1:5500
        // http://127.0.0.1:5500/foo
      })();
    </script>
  </body>
</html>
```

```js
// serviceWorker.js
console.log('serviceWorker');
```

服务工作者线程的作用域实际上遵循了目录权限模型，即只能相对于服务脚本所在路径缩小作用 域。像下面这样扩展作用域会抛出错误

```js
navigator.serviceWorker.register('/foo/serviceWorker.js', { scope: '/' });
// Error: The path of the provided scope 'https://example.com/'
// is not under the max scope allowed 'https://example.com/foo/' 
```

通常，服务工作者线程作用域会使用末尾带斜杠的绝对路径来定义

```js
navigator.serviceWorker.register('/serviceWorker.js', { scope: '/foo/' });
```

如果想扩展服务工作者线程的作用域，主要有两种方式

- 通过包含想要的作用域的路径提供（获取）服务脚本。
- 给服务脚本的响应添加 `Service-Worker-Allowed` 头部，把它的值设置为想要的作用域。该作用域值应该与 `register()` 中的作用域值一致。

### 27.4.2 服务工作者线程缓存

服务工作者线程的一个主要能力是可以通过编程方式实现真正的网络请求缓存机制。与 HTTP 缓存或 CPU 缓存不同，服务工作者线程缓存非常简单。

- **服务工作者线程缓存不自动缓存任何请求**。所有缓存都必须明确指定。
- **服务工作者线程缓存没有到期失效的概念**。除非明确删除，否则缓存内容一直有效。
- **服务工作者线程缓存必须手动更新和删除**。
- **缓存版本必须手动管理**。每次服务工作者线程更新，新服务工作者线程负责提供新的缓存键以保存新缓存。
- **唯一的浏览器强制逐出策略基于服务工作者线程缓存占用的空间**。服务工作者线程负责管理自己缓存占用的空间。缓存超过浏览器限制时，浏览器会基于最近最少使用（LRU，Least Recently Used）原则为新缓存腾出空间。

顶级字典是 `CacheStorage` 对象，可以通过服务工作者线程全局作用域的 `caches` 属性访问。

与 `LocalStorage` 一样，`Cache` 对象在 `CacheStorage` 字典中无限期存在，会超出浏览器会话的界限。此外，`Cache` 条目只能以源为基础存取。

#### 1.CacheStorage 对象

`CacheStorage` 提供的 API 类似于异步 `Map`。`CacheStorage` 的接口通过全局对象的 `caches` 属性暴露出来。

`CacheStorage` 中的每个缓存可以通过给 `caches.open()` 传入相应字符串键取得。非字符串键会转换为字符串。如果缓存不存在，就会创建。

`Cache` 对象是通过期约返回的：

```js
caches.open('v1').then(console.log);
// Cache {}
```

与 `Map` 类似，`CacheStorage` 也有 `has()`、`delete()` 和 `keys()` 方法。这些方法与 `Map` 上对应方法类似，但都基于期约。

```js
caches.open('v1')
  .then(() => caches.open('v3'))
  .then(() => caches.open('v2'))
  .then(() => caches.keys())
  .then(console.log); // ["v1", "v3", "v2"]
```

`CacheStorage` 接口还有一个 `match()` 方法，可以接收一个 `options` 配置对象。可以根据 `Request` 对象搜索 `CacheStorage` 中的所有 `Cache` 对象。

```js
// 创建一个请求键和两个响应值
const request = new Request('');
const response1 = new Response('v1');
const response2 = new Response('v2');
// 用同一个键创建两个缓存对象，最终会先找到 v1
// 因为它排在 caches.keys()输出的前面
caches.open('v1')
  .then(v1cache => v1cache.put(request, response1))
  .then(() => caches.open('v2'))
  .then(v2cache => v2cache.put(request, response2))
  .then(() => caches.match(request))
  .then(response => response.text())
  .then(console.log); // v1
```

#### 2.Cache 对象

服务工作者线程缓存只考虑缓存 HTTP 的 GET 请求。这样是合理的，因为 GET 请求的响应通常不会随时间而改变。另一方面，默认情况下，`Cache` 不允许使用 POST、PUT 和 DELETE 等请求方法。这些方法意味着与服务器动态交换信息，因此不适合客户端缓存。

为填充 `Cache`，可使用以下三个方法。

- `put(request, response)` 在键（`Request` 对象或 URL 字符串）和值（`Response` 对象）同时存在时用于添加缓存项。该方法返回 `Promise`，在添加成功后会解决。
- `add(request)` 在只有 `Request` 对象或 URL 时使用此方法发送 `fetch()` 请求，并缓存响应。 该方法返回期约，期约在添加成功后会解决。
- `addAll(requests)` 在希望填充全部缓存时使用，比如在服务工作者线程初始化时也初始化缓存。该方法接收 URL 或 `Request` 对象的数组。`addAll()` 会对请求数组中的每一项分别调用 `add()`。该方法返回期约，期约在所有缓存内容添加成功后会解决。

```js
const request1 = new Request('https://www.foo.com');
const response1 = new Response('fooResponse');
caches.open('v1')
  .then(cache => {
  cache.put(request1, response1)
    .then(() => cache.keys())
    .then(console.log) // [Request]
    .then(() => cache.delete(request1))
    .then(() => cache.keys())
    .then(console.log); // []
});
```

要检索 Cache，可以使用下面的两个方法

- `matchAll(request, options)` 返回期约，期约解决为匹配缓存中 `Response` 对象的数组
  - 此方法对结构类似的缓存执行批量操作，比如删除所有缓存在 `/images` 目录下的值。
  - 可以通过 `options` 对象配置请求匹配方式
- `match(request, options)` 返回期约，期约解决为匹配缓存中的 `Response` 对象；如果没命中缓存则返回 `undefined`。
  - 本质上相当于 `matchAll(request, options)[0]`
  - 可以通过 `options` 对象配置请求匹配方式

缓存是否命中取决于 URL 字符串和/或 `Request` 对象 URL 是否匹配。URL 字符串和 `Request` 对象是可互换的，因为匹配时会提取 `Request` 对象的 URL。

```js
const request1 = 'https://www.foo.com';
const request2 = new Request('https://www.bar.com');
const response1 = new Response('fooResponse');
const response2 = new Response('barResponse');
caches.open('v1').then((cache) => {
  cache.put(request1, response1)
    .then(() => cache.put(request2, response2))
    .then(() => cache.match(new Request('https://www.foo.com')))
    .then(response => response.text())
    .then(console.log) // fooResponse
    .then(() => cache.match('https://www.bar.com'))
    .then(response => response.text())
    .then(console.log); // barResponse
}); 
```

`Cache` 对象使用 `Request` 和 `Response` 对象的 `clone()` 方法创建副本，并把它们存储为键/值对。

```js
const request1 = new Request('https://www.foo.com');
const response1 = new Response('fooResponse');
caches.open('v1').then(cache => {
  cache.put(request1, response1)
    .then(() => cache.keys())
    .then(keys => console.log(keys[0] === request1)) // false
    .then(() => cache.match(request1))
    .then(response => console.log(response === response1)); // false
}); 
```

`Cache.match()`、`Cache.matchAll()` 和 `CacheStorage.match()` 都支持可选的 `options` 对象，其属性是

- `cacheName` 只有 `CacheStorage.matchAll()` 支持。设置为字符串时，只会匹配 `Cache` 键为指定字符串的缓存值。
- `ignoreSearch` 设置为 `true` 时，在匹配 URL 时忽略查询字符串，包括请求查询和缓存键。例如，`https://example.com?foo=bar` 会匹配 `https://example.com`
- `ignoreMethod` 设置为 `true` 时，在匹配 URL 时忽略请求查询的 HTTP 方法。
- `ignoreVary` 匹配的时候考虑 HTTP 的 `Vary` 头部，该头部指定哪个请求头部导致服务器响应不同的值。`ignoreVary` 设置为 `true` 时，在匹配 URL 时忽略 `Vary` 头部

#### 3.最大存储空间

使用 StorageEstimate API 可以近似地获悉有多少空间可用（以字节为单位），以及当前使用了多少空间。此方法只在安全上下文中可用

```js
navigator.storage.estimate().then(console.log);
// 不同浏览器的输出可能不同：
// {quota: 76475314176, usage: 0, usageDetails: {…}}
```

### 27.4.3 服务工作者线程客户端

服务工作者线程会使用 `Client` 对象跟踪关联的窗口、工作线程或服务工作者线程。

可以通过 `Clients` 接口访问这些 `Client` 对象。该接口暴露在全局上下文的 `self.clients` 属性上

`Client` 对象支持以下属性和方法：

- `id` 返回客户端的全局唯一标识符，例如 `7e4248ec-b25e-4b33-b15f-4af8bb0a3ac4`。`id` 可用于通过 `Client.get()` 获取客户端的引用
- `type` 返回表示客户端类型的字符串。`type` 可能的值是 `window`、`worker` 或 `sharedworker`
- `url` 返回客户端的 URL
- `postMessage()` 用于向单个客户端发送消息

`Clients` 接口支持通过 `get()` 或 `matchAll()` 访问 `Client` 对象。`matchAll()` 也可以接收 `options` 对象，该对象支持以下属性

- `includeUncontrolled` 在设置为 `true` 时，返回结果包含不受当前服务工作者线程控制的客户端。默认为 `false`
- `type` 可以设置为 `window`、`worker` 或 `sharedworker`，对返回结果进行过滤。默认为 `all`， 返回所有类型的客户端

`Clients` 接口也支持以下方法

- `openWindow(url)` 在新窗口中打开指定 URL，实际上会给当前服务工作者线程添加一个新 `Client`。这个新 `Client` 对象以解决的期约形式返回。该方法可用于回应点击通知的操作，此时服务工作者线程可以检测单击事件并作为响应打开一个窗口
- `claim()` 强制性设置当前服务工作者线程以控制其作用域中的所有客户端。`claim()` 可用于不希望等待页面重新加载而让服务工作者线程开始管理页面。

