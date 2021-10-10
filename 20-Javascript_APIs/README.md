# 第 20 章 JavaScript API

不同浏览器实现 API 情况也不同，主要介绍大多数浏览器已实现的 API

## 20.1 Atomics 与 SharedArrayBuffer

多个上下文访问 `SharedArrayBuffer` 时，如果同时对缓冲区执行操作，就可能出现资源争用问题。

Atomics API 通过强制同一时刻只能对缓冲区执行一个操作，可以让多个上下文安全地读写一个 `SharedArrayBuffer`。

Atomics API 设计初衷是在最少但很稳定的原子行为基础之上，构建复杂的多线程 JavaScript 程序

