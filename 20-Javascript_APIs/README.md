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

