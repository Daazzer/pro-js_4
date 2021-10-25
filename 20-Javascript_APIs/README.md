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



## 20.8 Page Visibility API

为开发者提供页面对用户是否可见的信息

- `document.visiblityState` 值，表示下面 4 中状态之一
  - 页面在后台标签页或浏览器中最小化了
  - 页面在前台标签页中
  - 实际页面隐藏了，但对页面的预览是可见的
  - 页面在屏外预渲染
- `visiblitychange` 事件，该事件会在文档从隐藏可见或触发
- `document.hidden` 布尔值，表示页面是否隐藏。这可能意味着页面在后台标签页或浏览器中被最小化了。这个值是为了向后兼容才继续被浏览器支持的，应该优先使用 `document.visiblityState` 检测页面可见性

## 20.9 Streams API

解决消费有序的小信息块而不是大块信息的问题

- 大块数据可能不会一次性都可用。流式处理可以让应用在数据一到达就能使用，而不必等到所有数据都加载完毕
- 大块数据可能需要分小部分处理。视频处理、数据压缩、图像编码和 JSON 解析都是可以分成小部分进行处理，而不必等到所有数据都在内存中时再处理的例子

### 20.9.1 理解流

提到流，可以把数据想象成某种通过管道输送的液体。JavaScript 中的流借用了管道相关的概念

Stream API 定义了三种流

- **可读流** 可以通过某个公共接口读取数据块的流。数据在内部从底层源进入流，然后由**消费者**（consumer）进行处理
- **可写流** 可以通过某个公共接口写入数据块的流。**生产者**（producer）将数据写入流，数据在内部传入底层数据槽（sink）
- **转换流** 由两种流组成，可写流用于接收数据（可写端），可读流用于输出数据（可读端）。这两个流之间是**转换程序**（transformer），可以根据需要检查和修改流内容

#### 块、内部队列和反压

流的基本单位是**块**（chunk）。块可以是任意数据类型，但通常是定型数组。每个块都是离散的流片段，可以作为一个整体来处理。更重要的是，块不是固定大小的，也不一定按固定间隔到达。在理想的流当中，块的大小通常近似相同，到达间隔也近似相等。不过好的流实现需要考虑边界情况

各种类型的流都有入口和出口的概念

有时候，由于数据进出速率不同，可能会出现不匹配的情况。为此流平衡可能出现如下三种情况：

- 流出口处理数据的速度比入口提供数据的速度快。流出口经常空闲（可能意味着流入口效率较低），但只会浪费一点内存或计算资源，因此这种流的不平衡是可以接受的。
- 流入和流出均衡。这是理想状态
- 流入口提供数据的速度比出口处理数据的速度快。这种流不平衡是固有的问题。此时一定会在某个地方出现数据积压，流必须相应作出处理

如果块入列速度快于出列速度，则内部队列会不断增大。流不能允许内部队列无限增大，因此它会使用**反压**（backpressure）通知流入口停止发送数据，直到队列大小降到某个既定的阈值之下。这个阈值由排列策略决定，这个策略定义了内部队列可以占用的最大内存，即**高水位线**（high water mark）

### 20.9.2 可读流

可读流是对底层数据源的封装。底层数据源可以将数据填充到流中，允许消费者通过流的公共接口读取数据。

#### 1.ReadableStreamDefaultController

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ReadableStreamDefaultController</title>
  </head>
  <body>
    <script>
      // 创建一个生成器，这个生成器的值可以通过可读流的控制器传入可读流
      async function* ints() {
        for (let i = 0; i < 5; i++) {
          yield await new Promise(resolve => setTimeout(resolve, 1000, i));
        }
      }

      // 通过创建 ReadableStream 实例访问控制器
      const readableStream = new ReadableStream({
        // 调用控制器的 enqueue() 方法可以把值传入控制器。所有值都有传完之后，调用 close() 关闭流
        async start(controller) {
          for await (const chunk of ints()) {
            controller.enqueue(chunk);
          }

          controller.close();
        }
      });
    </script>
  </body>
</html>
```



#### 2.ReadableStreamDefaultReader

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ReadableStreamDefaultReader</title>
  </head>
  <body>
    <script>
      // 创建一个生成器，这个生成器的值可以通过可读流的控制器传入可读流
      async function* ints() {
        for (let i = 0; i < 5; i++) {
          yield await new Promise(resolve => setTimeout(resolve, 1000, i));
        }
      }

      // 通过创建 ReadableStream 实例访问控制器
      const readableStream = new ReadableStream({
        // 调用控制器的 enqueue() 方法可以把值传入控制器。所有值都有传完之后，调用 close() 关闭流
        async start(controller) {
          for await (const chunk of ints()) {
            controller.enqueue(chunk);
          }

          controller.close();
        }
      });

      // 通过流的 getReader() 方法获取 StreamDefaultReader 实例，调用这个方法会获得流的锁，保证只有这个读取器可以从流中读取值
      console.log(readableStream.locked);  // false
      const readableStreamDefaultReader = readableStream.getReader();
      console.log(readableStream.locked);  // true

      // 消费者使用这个读取实例的 read() 方法可以读出值
      (async () => {
        while (true) {
          const { done, value } = await readableStreamDefaultReader.read();
          if (done) {
            break;
          } else {
            console.log(value);
          }
        }
      })();

      // 0
      // 1
      // 2
      // 3
      // 4
    </script>
  </body>
</html>
```



### 20.9.3 可写流

可写流是底层数据槽的封装。底层数据槽处理通过流的公共接口写入的数据。

#### 1.创建 WriteableStream

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>创建 WriteableStream</title>
  </head>
  <body>
    <script>
      async function* ints() {
        for (let i = 0; i < 5; i++) {
          yield await new Promise(resolve => setTimeout(resolve, 1000, i));
        }
      }

      // 通过可写流的公共接口可以写入流。在传给 WriteableStream 构造函数的 underlyingSink 参数中，通过实现 write() 方法可以获得写入的数据
      const writableStream = new WritableStream({
        write(value) {
          console.log(value);
        }
      });
    </script>
  </body>
</html>
```



#### 2.WritableStreamDefaultWriter

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WritableStreamDefaultWriter</title>
  </head>
  <body>
    <script>
      async function* ints() {
        for (let i = 0; i < 5; i++) {
          yield await new Promise(resolve => setTimeout(resolve, 1000, i));
        }
      }

      // 通过可写流的公共接口可以写入流。在传给 WriteableStream 构造函数的 underlyingSink 参数中，通过实现 write() 方法可以获得写入的数据
      const writableStream = new WritableStream({
        write(value) {
          console.log(value);
        }
      });

      /*
      要把获得的数据写入流，可以通过流的 getWriter() 方法获取 WritableStreamDefaultWriter 的实例。
      这样会获得流的锁，确保只有一个写入器可以向流写入数据
       */
      console.log(writableStream.locked);  // false
      const writableStreamDefaultWriter = writableStream.getWriter();
      console.log(writableStream.locked);  // true

      /*
      在向流写入数据前，生产者必须确保写入器可以接收值。
      WritableStreamDefaultWriter.read 返回一个 Promise，此 Promise 会在能够向流中写入数据时解决
       */
      (async () => {
        for await (const chunk of ints()) {
          await writableStreamDefaultWriter.ready;
          writableStreamDefaultWriter.write(chunk);
        }

        writableStreamDefaultWriter.close();
      })();
    </script>
  </body>
</html>
```



### 20.9.4 转换流

用于组合可读流和可写流。数据块在两个流之间的转换是通过 `transform()` 方法来完成的

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>转换流</title>
  </head>
  <body>
    <script>
      async function* ints() {
        for (let i = 0; i < 5; i++) {
          yield await new Promise(resolve => setTimeout(resolve, 1000, i));
        }
      }

      // 通过 transform() 方法将每个值翻倍
      const { writable, readable } = new TransformStream({
        transform(chunk, controller) {
          controller.enqueue(chunk * 2);
        }
      });

      // 向转换流的组件流（可读流和可写流）传入数据和从中获取数据
      const readableStreamDefaultReader = readable.getReader();
      const writableStreamDefaultWriter = writable.getWriter();

      // 消费者
      (async () => {
        while (true) {
          const { done, value } = await readableStreamDefaultReader.read();

          if (done) {
            break;
          } else {
            console.log(value);
          }
        }
      })();

      // 生产者
      (async () => {
        for await (const chunk of ints()) {
          await writableStreamDefaultWriter.ready;
          writableStreamDefaultWriter.write(chunk);
        }

        writableStreamDefaultWriter.close();
      })();
    </script>
  </body>
</html>
```



### 20.9.5 通过管道连接流

使用 `pipeThrough()` 方法把 `ReadableStream` 接入 `TransformStream`

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>通过管道连接流</title>
  </head>
  <body>
    <script>
      async function* ints() {
        for (let i = 0; i < 5; i++) {
          yield await new Promise(resolve => setTimeout(resolve, 1000, i));
        }
      }

      // 将一个整数的 ReadableStream 传入 TransformStream，TransformStream 对每个值加倍处理
      const integerStream = new ReadableStream({
        async start(controller) {
          for await (const chunk of ints()) {
            controller.enqueue(chunk);
          }

          controller.close();
        }
      });

      const doublingStream = new TransformStream({
        transform(chunk, controller) {
          controller.enqueue(chunk * 2);
        }
      });

      // 通过管道连接流
      const pipedStream = integerStream.pipeThrough(doublingStream);

      // 从连接流的输出获得读取器
      const pipedStreamDefaultReader = pipedStream.getReader();

      // 消费者
      (async () => {
        while (true) {
          const { done, value } = await pipedStreamDefaultReader.read();

          if (done) {
            break;
          } else {
            console.log(value);
          }
        }
      })();

      // 0
      // 2
      // 4
      // 6
      // 8
    </script>
  </body>
</html>
```



```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>通过管道连接流</title>
  </head>
  <body>
    <script>
      async function* ints() {
        for (let i = 0; i < 5; i++) {
          yield await new Promise(resolve => setTimeout(resolve, 1000, i));
        }
      }

      // 将一个整数的 ReadableStream 传入 TransformStream，TransformStream 对每个值加倍处理
      const integerStream = new ReadableStream({
        async start(controller) {
          for await (const chunk of ints()) {
            controller.enqueue(chunk);
          }

          controller.close();
        }
      });

      // 另外，使用 pipeTo() 方法也可以将 ReadableStream 连接到 WritableStream
      const writableStream = new WritableStream({
        write(value) {
          console.log(value);
        }
      });

      const pipedStream = integerStream.pipeTo(writableStream);

      // 0
      // 1
      // 2
      // 3
      // 4
    </script>
  </body>
</html>
```



## 20.10 计时 API

`Performance` 接口通过 JavaScript API 暴露了浏览器内部的度量指标，允许开发者直接访问这些信息并基于这些信息实现自己想要的功能，这个接口暴露在 `window.performance`

`Performance` 接口由多个 API 构成：

- High Resolution Time API
- Performance Timeline API
- Navigation Timling API
- User Timing API
- Resource Timing API
- Paint Timing API

### 20.10.1 High Resolution Time API

- `window.performance.now()` 返回一个微秒精度的浮点值。这个方法先后捕获的时间戳更不可能出现相等的情况，这个计时器采用**相对**度量
- `performance.timeOrigin` 属性返回计时器初始化时全局系统时钟的值

### 20.10.2 Performance Timeline API

- `performance.getEntries()` 获取在一个执行上下文中被记录的所有性能条目

#### 1.User Timing API

用于记录和分析自定义性能条目

- `performance.mark()` 记录自定义性能条目

#### 2.Navigation Timing API

用于度量当前页面加载速度

- `performance.getEntriesByType('navigation')`

#### 3.Resource Timing API

用于度量当前页面加载时请求资源的速度

- `performance.getEntriesByType('resource')`

## 20.11 Web 组件

一套用于增强 DOM 行为的工具，包括影子 DOM、自定义元素和 HTML 模板。这一套浏览器 API 特别混乱

### 20.11.1 HTML 模板

`<template>` 标签，提前在页面中写出特殊标记，让浏览器自动将其解析为 DOM 子树，但跳过渲染

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HTML 模板</title>
  </head>
  <body>
    <template id="foo">
      <p>I'm inside a template!</p>
    </template>
  </body>
</html>
```



#### 1.使用 DocumentFragment

通过 `<template>` 元素的 `content` 属性可以取得 `DocumentFragment` 的引用

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>使用 DocumentFragment</title>
  </head>
  <body>
    <template id="foo">
      <p>I'm inside a template!</p>
    </template>

    <script>
      const fragment = document.querySelector('#foo').content;

      console.log(document.querySelector('p'));  // null
      console.log(fragment.querySelector('p'));  // <p>...</p>
    </script>
  </body>
</html>
```



`DocumentFragment` 也是批量向 HTML 中添加元素的高效工具。相比于 `document.appendChild()`，可以一次性添加所有子节点，最多只会有一次布局重排

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>使用 DocumentFragment</title>
  </head>
  <body>
    <div id="foo"></div>
    <script>
      // 也可以使用 document.createDocumentFragment()
      const fragment = new DocumentFragment();
      const foo = document.querySelector('#foo');

      // 为 DocumentFragment 添加子元素不会导致布局重排
      for (let i = 1; i <= 3; i++) {
        fragment.appendChild(document.createElement('p'));
      }

      console.log(fragment.children.length);  // 3

      foo.appendChild(fragment);

      console.log(fragment.children.length);  // 0
      console.log(document.body.innerHTML);
    </script>
  </body>
</html>
```



#### 2.使用 `<template>` 标签

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>使用 template 标签</title>
  </head>
  <body>
    <div id="foo"></div>
    <template id="bar">
      <p></p>
      <p></p>
      <p></p>
    </template>
    <script>
      const fooElement = document.querySelector('#foo');
      const barTemplate = document.querySelector('#bar');
      const barFragment = barTemplate.content;

      console.log(document.body.innerHTML);
      fooElement.appendChild(barFragment);
      console.log(document.body.innerHTML);
    </script>
  </body>
</html>
```



如果想要复制模板，可以使用 `importNode()` 方法克隆 `DocumentFragment`

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>使用 template 标签</title>
  </head>
  <body>
    <div id="foo"></div>
    <template id="bar">
      <p></p>
      <p></p>
      <p></p>
    </template>
    <script>
      const fooElement = document.querySelector('#foo');
      const barTemplate = document.querySelector('#bar');
      const barFragment = barTemplate.content;

      console.log(document.body.innerHTML);
      fooElement.appendChild(document.importNode(barFragment, true));
      console.log(document.body.innerHTML);
    </script>
  </body>
</html>
```



#### 3.模板脚本

脚本执行可以推迟到将 `DocumentFragment` 的内容实际添加到 DOM 树。

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>模板脚本</title>
  </head>
  <body>
    <div id="foo"></div>
    <template id="bar">
      <script>console.log('Template script executed');</script>
    </template>
    <script>
      const fooElement = document.querySelector('#foo');
      const barTemplate = document.querySelector('#bar');
      const barFragment = barTemplate.content;

      console.log('About to add template');  // About to add template
      fooElement.appendChild(barFragment);  // Template script executed
      console.log('Added template');  // Added template
    </script>
  </body>
</html>
```



### 20.11.2 影子 DOM

用于实现 DOM 封装，意味着 CSS 样式和 CSS 选择符可以限制在影子 DOM 子树而不是整个顶级 DOM 树中

#### 1.理解影子 DOM

应该能够把 CSS 限制在使用它的 DOM 上，而不是影响到全局

#### 2.创建影子 DOM

影子 DOM 是通过 `attachShadow()` 方法创建并添加给有效 HTML 元素。容纳影子 DOM 的元素被称为**影子宿主**（shadow host）。影子 DOM 的根节点被称为**影子根**（shadow root）

- `attachShadow()` 接收一个 `shadowRootInit` 对象，必须包含一个 `mode` 属性，值为 `"open"` 或 `"closed"`，对 `"open"` 影子的引用可以通过 `shadowRoot` 属性在 HTML 元素上获得，而对 `"closed"` 影子 DOM 的引用无法这样获取，返回影子 DOM 的实例。

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>创建影子 DOM</title>
  </head>
  <body>
    <div id="foo"></div>
    <div id="bar"></div>
    <script>
      const foo = document.querySelector('#foo');
      const bar = document.querySelector('#bar');

      const openShadowDOM = foo.attachShadow({ mode: 'open' });
      const closedShadowDOM = bar.attachShadow({ mode: 'closed' });  // 创建保密影子

      console.log(openShadowDOM);  // #shadow-root (open)
      console.log(closedShadowDOM);  // #shadow-root (closed)

      console.log(foo.shadowRoot);  // #shadow-root (open)
      console.log(bar.shadowRoot);  // null
    </script>
  </body>
</html>
```



#### 3.使用影子 DOM

可以像使用常规 DOM 一样使用影子 DOM

```html
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>使用影子 DOM</title>
</head>
<body>
  <script>
    for (const color of ['red', 'green', 'blue']) {
      const div = document.createElement('div');
      const shadowDOM = div.attachShadow({ mode: 'open' });

      document.body.appendChild(div);
      shadowDOM.innerHTML = `
        <p>Make me ${color}</p>

        <style>
          p {
            color: ${color};
          }
        </style>
      `;
    }

    function countP(node) {
      console.log(node.querySelectorAll('p').length);
    }

    countP(document);  // 0

    for (const element of document.querySelectorAll('div')) {
      countP(element.shadowRoot);
    }

    // 1
    // 1
    // 1
  </script>
</body>
```



影子 DOM 可以在 DOM 树间无限制移动

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>使用影子 DOM</title>
</head>
<body>
  <div></div>
  <p id="foo">Move me</p>
  <script>
    const divElement = document.querySelector('div');
    const pElement = document.querySelector('p');
    const shadowDOM = divElement.attachShadow({ mode: 'open' });

    // 从父 DOM 中移除元素
    divElement.parentElement.removeChild(pElement);

    // 把元素添加到影子 DOM
    shadowDOM.appendChild(pElement);

    // 检查元素是否移动到了影子 DOM 中
    console.log(shadowDOM.innerHTML);
  </script>
</body>
</html>
```



#### 4.合成与影子 DOM 槽位

位于影子宿主中的 HTML 需要一种机制以渲染到影子 DOM 中去，但这些 HTML 又不必属于影子 DOM 树

影子 DOM 一添加到元素中，浏览器就会赋予它最高优先级，优先渲染它的内容而不是原来的文本

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>合成与影子 DOM 槽位</title>
</head>
<body>
  <div>
    <p>Foo</p>
  </div>
  <script>
    setTimeout(() => document.querySelector('div').attachShadow({ mode: 'open' }), 1000);
  </script>
</body>
</html>
```



为了显示文本内容，需要使用 `<slot>` 标签指示浏览器在哪里放置原来的 HTML

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>合成与影子 DOM 槽位</title>
</head>
<body>
  <div id="foo">
    <p>Foo</p>
  </div>
  <script>
    setTimeout(() => {
      const shadowDOM = document.querySelector('div').attachShadow({ mode: 'open' });
      // 实际上只是 DOM 内容的投射(projection)
      shadowDOM.innerHTML = `
        <div #id="bar">
          <slot></slot>
        </div>
      `;
    }, 1000);
  </script>
</body>
</html>
```



改变影子宿主的渲染顺序，除了默认槽位，还可以使用**命名槽位**(named slot) 实现多个投射。这是通过匹配的 `slot/name` 属性对实现的。

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>合成与影子 DOM 槽位</title>
</head>
<body>
  <div>
    <p slot="foo">Foo</p>
    <p slot="bar">Bar</p>
  </div>
  <script>
    for (const color of ['red', 'green', 'blue']) {
      const div = document.createElement('div');
      const shadowDOM = div.attachShadow({ mode: 'open' });

      document.body.appendChild(div);
      shadowDOM.innerHTML = `
        <p>Make me ${color}</p>

        <style>
          p {
            color: ${color};
          }
        </style>
      `;
    }

    document.querySelector('div')
      .attachShadow({ mode: 'open' })
      .innerHTML = `
        <slot name="bar"></slot>
        <slot name="foo"></slot>
      `;
  </script>
</body>
</html>
```



#### 5.事件重定向

如果影子 DOM 中发生了浏览器事件，那么浏览器需要一种方式让父 DOM处理事件。事件会逃出影子 DOM 并经过**事件重定向**(event retarget) 在外部被处理

使用 `<slot>` 标签从外部投射进来的元素不会发生事件重定向，因为从技术上讲，这些元素仍然存在于影子 DOM 外部

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>事件重定向</title>
</head>
<body>
  <div onclick="console.log('Handled outside:', event.target)"></div>
  <script>
    document.querySelector('div')
      .attachShadow({ mode: 'open' })
      .innerHTML = `
        <button onclick="console.log('Handled inside:', event.target)">Foo</button>
      `;
  </script>
</body>
</html>
```



### 20.11.3 自定义元素

可以在 HTML 中创建自定义的、复杂的和可重用的元素，而且只要使用简单的 HTML 标签或属性就可以创建相应的实例

#### 1.创建自定义元素

自定义元素要使用全局属性 `customElements`，这个属性会返回 `CustomElementRegistry` 对象

`customElement.define()` 方法可以创建自定义元素。

> **注意** 自定义元素名必须至少包含一个不在名称开头和末尾的连字符，而且元素标签不能自关闭

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>创建自定义元素</title>
</head>
<body>
  <x-foo>I'm inside a nonsense element.</x-foo>
  <script>
    class FooElement extends HTMLElement {}
    customElements.define('x-foo', FooElement);
    console.log(document.querySelector('x-foo') instanceof FooElement);  // true
  </script>
</body>
</html>
```



通过调用自定义元素的构造函数来控制这个类在 DOM 中每个实例的行为

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>创建自定义元素</title>
</head>
<body>
  <x-foo></x-foo>
  <x-foo></x-foo>
  <x-foo></x-foo>
  <script>
    class FooElement extends HTMLElement {
      constructor() {
        super();
        console.log('x-foo');
      }
    }
    customElements.define('x-foo', FooElement);
    // x-foo
    // x-foo
    // x-foo
  </script>
</body>
</html>
```



如果自定义元素继承了一个元素类，那么可以使用 `is` 属性和 `extends` 选项将标签指定为该自定义元素的实例：

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>创建自定义元素</title>
</head>
<body>
  <div is="x-foo"></div>
  <div is="x-foo"></div>
  <div is="x-foo"></div>
  <script>
    class FooElement extends HTMLDivElement {
      constructor() {
        super();
        console.log('x-foo');
      }
    }
    customElements.define('x-foo', FooElement, { extends: 'div' });
    // x-foo
    // x-foo
    // x-foo
  </script>
</body>
</html>
```



#### 2.添加 Web 组件内容

每次将自定义元素添加到 DOM 中会调用其构造函数。虽然不能在构造函数中添加子 DOM，但可以为自定义元素添加影子 DOM 并将内容添加到这个影子 DOM 中

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>添加 Web 组件内容</title>
</head>
<body>
  <x-foo></x-foo>
  <script>
    class FooElement extends HTMLElement {
      constructor() {
        super();

        // this 引用 web 组件节点
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
          <p>I'm inside a custom element!</p>
        `;
      }
    }
    customElements.define('x-foo', FooElement);
  </script>
</body>
</html>
```



```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>添加 Web 组件内容</title>
</head>
<body>
  <template id="x-foo-tpl">
    <p>I'm inside a custom element template!</p>
  </template>
  <x-foo></x-foo>
  <script>
    const template = document.querySelector('#x-foo-tpl');

    class FooElement extends HTMLElement {
      constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
      }
    }

    customElements.define('x-foo', FooElement);
  </script>
</body>
</html>
```



这样可以在自定义元素中实现高度的 HTML 代码重用，以及 DOM 封装

#### 3.使用自定义元素生命周期方法

5 个生命周期方法

- `constructor()` 在创建元素实例或将已有 DOM 元素升级为自定义元素时调用
- `connectedCallback()` 在每次将这个自定义元素实例添加到 DOM 中时调用
- `disconnectedCallback()` 在每次将这个自定义元素实例从 DOM 中移除时调用
- `attributeChangedCallback()` 在每次**可观察属性**的值发生变化时调用。在元素实例初始化时，初始值的定义也算一次变化
- `adoptedCallback()` 在通过 `document.adoptNode()` 将这个自定义元素实例移动到新文档对象时调用

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>使用自定义元素生命周期方法</title>
</head>
<body>
  <script>
    class FooElement extends HTMLElement {
      constructor() {
        super();
        console.log('ctor');
      }

      connectedCallback() {
        console.log('connected');
      }

      disconnectedCallback() {
        console.log('disconnected');
      }
    }

    customElements.define('x-foo', FooElement);

    const fooElement = document.createElement('x-foo');
    // ctor

    document.body.appendChild(fooElement);
    // connected

    document.body.removeChild(fooElement);
    // disconnected
  </script>
</body>
</html>
```



#### 4.反射自定义元素属性

对 DOM 的修改应该反映到 JavaScript 对象，反之亦然。要从 JavaScript 对象反射到 DOM，常见的方式是使用获取函数和设置函数

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>反射自定义元素属性</title>
</head>
<body>
  <x-foo></x-foo>
  <script>
    class FooElement extends HTMLElement {
      constructor() {
        super();

        this.bar = true;
      }

      get bar() {
        return this.getAttribute('bar');
      }

      set bar(value) {
        this.setAttribute('bar', value);
      }
    }

    customElements.define('x-foo', FooElement);

    console.log(document.body.innerHTML);  // <x-foo bar="true"></x-foo>
  </script>
</body>
</html>
```



从 DOM 反映到 JavaScript 对象

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>反射自定义元素属性</title>
</head>
<body>
  <x-foo bar="false"></x-foo>
  <script>
    class FooElement extends HTMLElement {
      static get observedAttributes() {
        // 返回应该触发 attributeChangedCallback() 执行的属性
        return ['bar'];
      }

      get bar() {
        return this.getAttribute('bar');
      }

      set bar(value) {
        this.setAttribute('bar', value);
      }

      attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
          console.log(`${oldValue} -> ${newValue}`);

          this[name] = newValue;
        }
      }
    }

    customElements.define('x-foo', FooElement);
    // null -> false

    document.querySelector('x-foo').setAttribute('bar', true);
    // false -> true
  </script>
</body>
</html>
```



#### 5.升级自定义元素

Web 组件再 `CustomElementRegistry` 上额外暴露了一些方法。可以用来检测自定义元素是否定义完成，然后用它来升级已有元素

- `CustomElementRegistry.get()` 返回相应自定义元素的类
- `CustomElementRegistry.whenDefined()` 返回一个 `Promise`，当相应自定义元素有定义之后解决
- `CustomElementRegistry.upgrade()` 在元素连接到 DOM 之前强制升级

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>升级自定义元素</title>
</head>
<body>
  <script>
    customElements.whenDefined('x-foo').then(() => console.log('defined!'));

    console.log(customElements.get('x-foo'));
    // undefined

    customElements.define('x-foo', class {});
    // defined!

    console.log(customElements.get('x-foo'));
    // class FooElement{}
  </script>
</body>
</html>
```



连接到 DOM 的元素在自定义元素有定义时会**自动升级**

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>升级自定义元素</title>
</head>
<body>
  <script>
    // 在自定义元素有定义之前会创建 HTMLUnknownElement 对象
    const fooElement = document.createElement('x-foo');

    // 创建自定义元素
    class FooElement extends HTMLElement {}
    customElements.define('x-foo', FooElement);

    console.log(fooElement instanceof FooElement);  // false

    // 强制升级
    customElements.upgrade(fooElement);

    console.log(fooElement instanceof FooElement);  // true
  </script>
</body>
</html>
```



## 20.12 Web Cryptography API

描述了一套密码学工具。这些工具包括生成、使用和应用加密密钥对，加密和解密信息，以及可靠地生成随机数

