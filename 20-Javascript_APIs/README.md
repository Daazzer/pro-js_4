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



#### 2.流编码

`TextEncoderStream` 就是 `TransformStream` 形式的 `TextEncoder`

### 20.3.2 文本解码

将定型数组转换为字符串的方式：分为批量解码和流解码

#### 1.批量解码

`TextDecoder` 实例

- `decode()`

```js
const textDecoder = new TextDecoder();
const encodedText = Unit8Array.of(102, 111, 111);
const decodedText = textDecoder.decode(encodedText);
console.log(decodedText);  // foo
```

#### 2.流解码

`TextDecoderStream` 其实就是 `TransformStream` 形式的 `TextDecoder`。将编码后的文本流通过管道输入流解码器会得到解码后文本块的流

## 20.4 File API 与 Blob API

File API 与 Blob API 是为了让 Web 开发者能以安全的方式访问客户端机器上的文件，从而更好地与这些文件交互而设计的

### 20.4.1 File 类型

HTML5 在 DOM 上为文件输入元素添加了 `files` 集合。当用户在文件字段中选择一个或多个文件时，这个 `files` 集合中会包含一组 `File` 对象，表示被选中的文件。

每个 `File` 对象有一些只读属性

- `name` 本地系统中的文件名
- `size` 以字节计的文件大小
- `type` 包含文件 MIME 类型的字符串
- `lastModifiedDate` 表示文件最后修改时间的字符串。这个属性只有 Chrome 实现了

例如通过监听 `change` 事件然后遍历 `files` 集合可以取得每个选中文件的信息

```js
const filesList = document.getElementById('files-list');
filesList.addEventListener('change', event => {
  let files = event.target.files,
        i = 0,
        len = files.length;

  while (i < len) {
    const file = files[i];
    console.log(`${file.name} (${file.type}, ${file.size} bytes)`);
    i++;
  }
});
```



### 20.4.2 FileReader 类型

`FileReader` 类型表示一种异步文件读取机制。提供了几个读取文件数据的方法

- `readAsText(file, encoding)` 从文件中读取纯文本内容并保存在 `result` 属性中。第二个参数表示编码，是可选的
- `readAsDataURL(file)` 读取文件并将内容的数据 URI 保存在 `result` 属性中
- `readAsBinaryString(file)` 读取文件并将每个字符的二进制数据保存在 `result` 属性中
- `readAsArrayBuffer(file)` 读取文件并将文件内容以 `ArrayBuffer` 形式保存在 `result` 属性中
- `abort()` 中断读取操作，触发 `abort` 事件

`FileReader` 发布的几个事件

- `progress` 进度事件，表示还有更多数据，每 50 毫秒触发一次
  - `lengthComputable`
  - `loaded`
  - `total`
- `error` 发生错误时触发
  - `code` 属性，1：未找到文件、2：安全错误、3：读取被中断、4：文件不可读、5：编码错误
- `load` 读取完成时触发
- `abort` 在读取中断时触发
- `loadend` 所有读取操作都已结束时触发

### 20.4.3 FileReaderSync 类型

`FileReaderSync` 只在工作线程中可用，是 `FileReader` 的**同步**版本，因为如果读取整个文件耗时太长则会影响全局

### 20.4.4 Blob 与部分读取

`File` 对象提供一个 `slice()` 方法，接收两个参数：起始字节和要读取额字节数。返回一个 `Blob` 实例

blob 表示**二进制大对象(binary larget object)**，是 JavaScript 对不可修改的二进制数据的封装类型。包含字符串数组、`ArrayBuffer`、`ArrayBufferViews`，甚至其它 `Blob` 都可以用来创建 blob。`Blob` 构造函数可以接收一个 `options` 参数，并在其指定 MIME 类型

`Blob` 对象有一个 `size` 属性和 `type` 属性，还有一个 `slice()` 方法用于进一步切分数据。另外也可以使用 `FileReader` 从 `Blob` 中读取数据

### 20.4.5 对象 URL 与 Blob

- `window.URL.createObjectURL()` 方法传入 `File` 或 `Blob` 对象，就可以创建对象 URL
- `window.URL.revokeObjectURL()` 可以卸载对象 URL 释放内存

### 20.4.6 读取拖放文件

在 `drop` 事件的 `event.dataTransfer.files` 可以读取文件，这个属性保存着一组 `File` 对象

## 20.5 媒体元素

HTML5 的 `<audio>` 和 `<video>` 元素

```html
<video src="conference.mpg" id="myVideo">Video player not avaliable.</video>
<audio src="song.mp3" id="myAudio">Audio player not avaliable.</audio>
```

提供不同的格式兼容

```html
<video id="myVideo">
	<source src="conference.webm" type="video/webm; codecs='vp8, vorbis'">
	<source src="conference.ogv" type="video/ogg; codecs='theora, vorbis'">
	<source src="conference.mpg">
  Video player not avaliable.
</video>

<audio id="myAudio">
  <source src="song.ogg" type="audio/ogg">
  <source src="song.mp3" type="audio/mpeg">
  Audio player not avaliable.
</audio>
```



### 20.5.1 属性

`<audio>` 和 `<video>` 的 JavaScript 接口

[`HTMLMediaElement` 属性](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement#properties)

### 20.5.2 事件

[`HTMLMediaElement` 事件](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement#events)

### 20.5.3 自定义媒体播放器

- `play()` 手动播放
- `pause()` 手动暂停

### 20.5.4 检测编解码器

- `canPlayType()` 接收一个格式/编解码器字符串，返回一个字符串值：`"probably"`、`"maybe"` 或 `""`

```js
if (audio.canPlayType("audio/oggl codecs=\"vorbis\"")) {
  // 执行某些操作
}
```



### 20.5.5 音频类型

`<audio>` 元素还有一个名为 `Audio` 的原生 JavaScript 构造函数，支持在任何时候播放音频。

```js
const audio = new Audio("sound.mp3");
audio.addEventListener('canplaythrough', event => {
  audio.play();
});
```



在 iOS 中调用 `play()` 方法会弹出一个对话框，请求用户授权播放声音。为了连续播放，必须在 `onfinish` 事件处理程序中立即调用 `play()`

## 20.6 原生拖放

可以跨窗格、跨浏览器容器，有时候甚至可以跨应用程序拖动元素。浏览器对拖放的支持可以让我们实现这些功能

### 20.6.1 拖放事件

在某个元素被拖放时，会（按顺序）触发以下事件：

- `dragstart` 在鼠标键不放并开始移动鼠标的那一刻触发
- `drag` `dragstart` 事件触发后，只要目标还被拖动就会持续触发
- `dragend` 当拖动停止时（把元素放到有效或无效的放置位置目标上）触发

所有这 3 个事件的目标都是被拖动的元素

在把元素拖动到一个有效的放置目标上时，会依次触发以下事件：

- `dragenter` 只要一把元素拖动到放置目标上，就会触发
- `dragover` `dragenter` 事件触发之后，会立即触发，并且元素在放置目标范围内被拖动期间此事件就会持续触发
- `dragleave` 当元素被拖动到放置目标之外触发，同时 `dragover` 事件停止触发
- `drop` 被拖动元素被放到了目标上触发

这些事件的目标是放置目标元素

### 20.6.2 自定义放置目标

通过覆盖 `dragenter` 和 `dragover` 事件的默认行为，可以把任何元素转换为有效的放置目标

```js
const droptarget = document.getElementById('droptarget');

droptarget.addEventListener('dragover', event => {
  event.preventDefault();
});

droptarget.addEventListener('dragenter', event => {
  event.preventDefault();
});
```



### 20.6.3 dataTransfer 对象

`event` 对象上的

- `dataTransfer` 属性
  - `getData()` 获取值，接收一个参数，表示数据类型
  - `setData()` 第一个参数表示设置的数据类型：`"text"` 或 `"URL"`，第二个参数是设置的值

```js
// 传递文本
event.dataTransfer.setData('text', 'some text');
const text = event.dataTransfer.getData('text');

// 传递 URL
event.dataTransfer.setData('URL', 'http://www.wrox.com/');
const url = event.dataTransfer.getData('URL');
```



### 20.6.4 dropEffect 与 effectAllowed

- `dropEffect` 属性可以告诉浏览器允许哪种放置行为，要同时设置 `effectAllowed` 才生效
- `effectAllowed` 属性表示对被拖动元素是否允许 `dropEffect`

### 20.6.5 可拖动能力

HTML5 在所有元素上添加了

- `draggable` 属性，表示元素是否可拖动

```html
<!-- 禁止拖动图片 -->
<img src="smile.gif" draggable="false" alt="Smiley face">
<!-- 让元素可以拖动 -->
<div draggable="true">...</div>
```



### 20.6.6 其他成员

`dataTransfer` 对象还定义了以下方法：

- `addElement(element)` 为拖动操作添加元素。
- `clearData(format)` 清除以特定格式存储的数据
- `setDragImage(element, x, y)` 允许指定拖动发生时显示在光标下面的图片。接收三个参数：要显示的 HTML 元素及标识光标位置的图片上的 x 和 y 坐标。
- `types` 当前存储的数据类型列表

## 20.7 Notifications API

用于向用户显示通知

### 20.7.1 通知权限

为了防止被滥用，默认会开启两项安全措施：

- 通知只能在运行在安全上下文的代码中被触发
- 通知必须按照每个源的原则明确得到用户允许

页面可以使用 `Notification` 全局对象向用户请求通知权限。

- `requestPemission()` 返回一个 `Promise` 用户在执行操作后，这个 `Promise` 会解决

### 20.7.2 显示和隐藏通知

`Notification` 构造函数用于创建和显示通知

```js
new Notification('Title text!', {
  body: 'Body text',
  image: 'path/to/image.png',
  vibrate: true
});
```

- `close()` 可以关闭显示的通知

```js
const n = new Notification('I will close in 1000ms');
setTimeout(() => n.close(), 1000);
```



### 20.7.3 通知生命周期回调

4 个添加回调的生命周期方法：

- `onshow` 在通知显示时触发
- `onclick` 在通知被点击时触发
- `onclose` 在通知消失或通过 `close()` 关闭时触发
- `onerror` 在发生错误阻止通知显示时触发

```js
const n = new Notification('foo');

n.onshow = () => console.log('Notification was shown!');
n.onclick = () => console.log('Notification was clicked!');
n.onclose = () => console.log('Notification was closed!');
n.onerror = () => console.log('Notification experienced an error!');
```

