# 第 20 章 JavaScript API

不同浏览器实现 API 情况也不同，主要介绍大多数浏览器已实现的 API

## 20.1 Atomics 与 SharedArrayBuffer

多个上下文访问 `SharedArrayBuffer` 时，如果同时对缓冲区执行操作，就可能出现资源争用问题。

Atomics API 通过强制同一时刻只能对缓冲区执行一个操作，可以让多个上下文安全地读写一个 `SharedArrayBuffer`。

Atomics API 设计初衷是在最少但很稳定的原子行为基础之上，构建复杂的多线程 JavaScript 程序

### 20.1.1 SharedArrayBuffer

`SharedArrayBuffer` 与 `ArrayBuffer` 具有相同的 API。两者的主要区别是 `ArrayBuffer` 必须在不同的执行上下文间切换，`SharedArrayBuffer` 则可以被任意多个执行上下文同时使用

Atomics API 可以保证 `SharedArrayBuffer` 上的 JavaScript 操作线程是安全的。

> **注意** `SharedArrayBuffer` API 等同于 `ArrayBuffer` API

### 20.1.2 原子操作基础

任何上下文中都有 `Atomics` 对象，这个对象上暴露了用于执行线程安全操作的一套静态方法

#### 1.算术及位操作方法

在 ECMA 规范中，这些方法被定义为 `AtomicReadModifyWrite` 操作。在底层，这些方法都会从 `SharedArrayBuffer` 中某个位置读取值，然后执行算术或位操作，最后再把计算结果写回相同的位置。

- `Atomics.add()`
- `Atomics.sub()`
- `Atomics.or()`
- `Atomics.and()`
- `Atomics.xor()`

#### 2.原子读和写

浏览器的 JavaScript 编译器和 CPU 架构本身都有权限重排指令以提升程序执行效率。正常情况下， JavaScript 的单线程环境试可以随时进行这种优化的。但多线程下的指令重排可能导致资源争用，而且极难排错

`Atomics.load()` 和 `Atomics.store()` 还可以构建“代码围栏”。JavaScript 引擎保证非原子指令可以相对于 `load()` 和 `store()` **本地**重排，但这个重排不会侵犯原子读/写的边界

#### 3.原子交换

为了保证连续、不间断的先读后写。Atomics API 提供了两种方法：

- `Atomics.exchange()`
- `Atomics.compareExchange()`

#### 4.原子 Futex 操作与加锁

> **注意** 所有原子 Futex 操作只能用于 `Int32Array` 视图。而且，也只能用在工作线程内部

- `Atomics.wait()`
- `Atomics.notify()`
- `Atomics.isLockFree()`

## 20.2 跨上下文消息

**跨文档消息**，有时也称为 XDM（cross-document messaging），是一种在不同执行上下文（如不同工作线程或不同源的页面）间传递信息的能力

> **注意** 跨上下文消息用于窗口之间通信或工作线程之间通信。

核心方法

- `postMessage()` 接收三个参数：消息、表示目标接收源的字符串和可选的可传输对象的数组（只与工作线程有关）

```js
const iframeWindow = document.getElementById('myIframe').contentWindow;
iframeWindow.postMessage('A secret', 'http://www.wrox.com');
```

接收到 XDM 消息后，`window` 对象上会触发 `message` 事件，`event` 对象包含 3 方面重要信息

- `data` 作为第一个参数传给 `postMessage()` 的字符串数据
- `origin` 发送消息的文档源
- `source` 发送消息的文档中 `window` 对象代理。这个代理主要用于在发送上一条消息的窗口执行 `postMessage()` 方法。如果发送窗口有相同的源，那么这个对象应该就是 `window` 对象

```js
window.addEventListener('message', event => {
  // 确保来自预期发送者
  if (event.origin === 'http://www.wrox.com') {
    // 对数据进行一些处理
    processMessage(event.data);
    // 可选：向来源窗口发送一条消息
    event.source.postMessage('Received!', 'http://p2p.wrox.com')
  }
});
```



## 20.3 Encoding API

主要用于实现字符串与定型数组之间的转换。新增了 4 个用于执行转换的全局类

- `TextEncoder`
- `TextEncoderStream`
- `TextDecoder`
- `TextDecoderStream`

### 20.3.1 文本编码

批量编码和流编码

#### 1.批量编码

`TextEncoder` 实现

- `encode()` 接收一个字符串参数，并以 `Unit8Array` 格式返回每个字符的 UTF-8 编码
- `encodeInto()` 接收一个字符串和目标 `Unit8Array`，返回一个字典，该字典包含 `read` 和 `written` 属性。如果定型数组空间不够，编码就会提前终止

```js
const textEncoder = new TextEncoder();
const decodedText = 'foo';
const encodedText = textEncoder.encode(decodedText);
```



