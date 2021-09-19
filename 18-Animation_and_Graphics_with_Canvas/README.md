# 第 18 章 动画与 Canvas 图形

`<canvas>` 支持：

- 2D 上下文
- 3D 上下文 WebGL

## 18.1 使用 requestAnimationFrame

`requestAnimationFrame()` 方法替代 `setTimeout()` 和 `setInterval()` 制作动画

### 18.1.1 早期定时器动画

`setInterval()`

```js
(function() {
  function updateAnimations() {
    doAnimation1();
    doAnimation2();
    // 其他任务
  }
  setInterval(updateAnimations, 100);
})();
```

存在无法知晓循环之间的延时

平滑动画最佳的重绘间隔为 1000ms/60，大约 17ms

### 18.1.2 时间间隔问题

几个浏览器计时器的精度情况：

- IE8 以下，15.625ms
- IE9 以上，4ms
- Firefox 和 Safari 约 10ms
- Chrome 4ms

### 18.1.3 requestAnimationFrame

目前，所有浏览器都支持 `requestAnimationFrame()`，接收一个参数，要在重绘屏幕前调用的函数

为了实现动画循环，可以把多个 `requestAnimationFrame()` 串联起来

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>requestAnimationFrame</title>
  </head>
  <body>
    <div id="status" style="background-color: red; height: 30px; width: 10px;"></div>
    <script>
      function updateProgress() {
        const div = document.getElementById('status');
        div.style.width = (parseInt(div.style.width, 10) + 5) + '%';
        if (div.style.left != '100%') {
          requestAnimationFrame(updateProgress);
        }
      }

      requestAnimationFrame(updateProgress);
    </script>
  </body>
</html>
```



### 18.1.4 cancelAnimationFrame

与 `setTimeout()` 类似，`requestAnimationFrame()` 也返回一个 ID，可以用 `cancelAnimationFrame()` 来取消重绘任务

```js
const requestID = window.requestAnimationFrame(() => {
  console.log('Repaint!');
});

window.cancelAnimationFrame(requestID);
```



### 18.1.5 通过 requestAnimationFrame 节流

支持这个方法的浏览器实际会暴露出作为钩子的回调队列。所谓钩子（hook），就是浏览器在执行下一次重绘之前的一个点。

通过 `requestAnimationFrame()` 递归地向队列中加入回调函数，可以保证每次重绘最多调用一次回调函数。

```js
// 把所有回调的执行集中在重绘的钩子，但不会过滤掉每次重绘的多余调用
function expensiveOperation() {
  console.log('Invoked at', Date.now());
}

window.addEventListener('scroll', () => {
  window.requestAnimationFrame(expensiveOperation);
});
```

将回调限制为不超过 50 毫秒执行一次

```js
let enabled = false;

function expensiveOperaion() {
  console.log('Invoked at', Date.now());
}

window.addEventListener('scroll', () => {
  if (enabled) {
    enabled = false;
    window.requestAnimationFrame(expensiveOperation);
    window.setTimeout(() => enabled = true, 50);
  }
});
```



## 18.2 基本的画布功能

`<canvas>` 元素至少要设置 `width` 与 `height` 属性，表示绘制图的大小

- `getContext()` 获取对绘图上下文的引用

  ```html
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>基本的画布功能</title>
    </head>
    <body>
      <canvas id="drawing" width="200" height="200">
        A drawing of something.
      </canvas>
      <script>
        const drawing = document.getElementById('drawing');
  
        // 确保浏览器支持 <canvas>
        if (drawing.getContext) {
          const context = drawing.getContext('2d');  // 创建 2d 上下文
        }
      </script>
    </body>
  </html>
  ```

- `toDataURL()` 导出 `<canvas>` 元素上的图像。接收一个参数：要生成图像的 MIME 类型

  ```html
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>基本的画布功能</title>
    </head>
    <body>
      <canvas id="drawing" width="200" height="200">
        A drawing of something.
      </canvas>
      <script>
        const drawing = document.getElementById('drawing');
  
        // 确保浏览器支持 <canvas>
        if (drawing.getContext) {
          const context = drawing.getContext('2d');  // 创建 2d 上下文
          const imgURI = drawing.toDataURL('image/png');  // 取得图像的数据 URI
  
          // 显示图片
          const image = document.createElement('img');
          image.src = imgURI;
          document.body.appendChild(image);
        }
      </script>
    </body>
  </html>
  ```

  
