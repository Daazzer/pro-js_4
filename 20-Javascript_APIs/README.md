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

