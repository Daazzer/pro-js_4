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

