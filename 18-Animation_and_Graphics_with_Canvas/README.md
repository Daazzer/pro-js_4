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

  

## 18.3 2D 绘画上下文

[`CanvasRenderingContext2D`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)

2D 上下文原点 (0, 0) 在 `<canvas>` 元素的左上角。默认情况下，`width` 和 `height` 表示两个方向上像素的最大值

### 18.3.1 填充和描边

以下两个属性可以是字符串（可以是 CSS 支持的格式）、渐变对象或图案对象。

- `fillStyle` 填充以指定样式（颜色、渐变或图像）自动填充形状
- `strokeStyle` 描边只为图形边界着色

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>填充和描边</title>
  </head>
  <body>
    <canvas id="drawing" width="200" height="200">A drawing of something.</canvas>
    <script>
      const drawing = document.getElementById('drawing');

      // 确保浏览器支持 <canvas>
      if (drawing.getContext) {
        const context = drawing.getContext('2d');
        context.strokeStyle = 'red';
        context.fillStyle = '#0000ff';
      }
    </script>
  </body>
</html>
```



### 18.3.2 绘制矩形

与绘制矩形相关的方法有 3 个，这些方法都接收 4 个参数，矩形 x 坐标、矩形 y 坐标、矩形宽度和矩形高度，参数单位都是像素：

- `fillRect()`
- `strokeRect()`
- `clearRect()`

描绘填充矩形

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>绘制矩形</title>
  </head>
  <body>
    <canvas id="drawing" width="200" height="200">A drawing of something.</canvas>
    <!-- 填充矩形 -->
    <script>
      const drawing = document.getElementById('drawing');

      // 确保浏览器支持 <canvas>
      if (drawing.getContext) {
        const context = drawing.getContext('2d');

      /**
       * 引自 MDN 文档
       */

        // 绘制红色矩形
        context.fillStyle = '#ff0000';
        context.fillRect(10, 10, 50, 50);

        // 绘制半透明蓝色矩形
        context.fillStyle = 'rgba(0, 0, 255, 0.5)';
        context.fillRect(30, 30, 50, 50);
      }
    </script>
  </body>
</html>
```



描绘描边矩形

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>绘制矩形</title>
  </head>
  <body>
    <canvas id="drawing" width="200" height="200">A drawing of something.</canvas>
    <!-- 描边矩形 -->
    <script>
      const drawing = document.getElementById('drawing');

      // 确保浏览器支持 <canvas>
      if (drawing.getContext) {
        const context = drawing.getContext('2d');

      /**
       * 引自 MDN 文档
       */

        // 绘制红色轮廓的矩形
        context.strokeStyle = '#ff0000';
        context.strokeRect(10, 10, 50, 50);

        // 绘制半透明蓝色轮廓矩形
        context.strokeStyle = 'rgba(0, 0, 255, 0.5)';
        context.strokeRect(30, 30, 50, 50);
      }
    </script>
  </body>
</html>
```

描边矩形属性补充

- `lineWidth` 设置描边宽度，可以是任意整数
- `lineCap` 设置线条端点
- `lineJoin` 设置线条交点的形状



擦除矩形区域

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>绘制矩形</title>
  </head>
  <body>
    <canvas id="drawing" width="200" height="200">A drawing of something.</canvas>
    <!-- 擦除某个矩形区域 -->
    <script>
      const drawing = document.getElementById('drawing');

      // 确保浏览器支持 <canvas>
      if (drawing.getContext) {
        const context = drawing.getContext('2d');

      /**
       * 引自 MDN 文档
       */

        // 绘制红色矩形
        context.fillStyle = '#ff0000';
        context.fillRect(10, 10, 50, 50);

        // 绘制半透明蓝色矩形
        context.fillStyle = 'rgba(0, 0, 255, 0.5)';
        context.fillRect(30, 30, 50, 50);

        // 在前两个矩形重叠的区域擦除一个矩形区域
        context.clearRect(40, 40, 10, 10);
      }
    </script>
  </body>
</html>
```



### 18.3.3 绘制路径

要绘制路径，必须首先调用 `beginPath()` 方法表示开始绘制路径，然后调用下列方法绘制路径

- `arc(x, y, radius, startAngle, endAngle, counterclockwise)` 以坐标 `(x, y)` 为圆心，以 `radius` 为半径绘制一条弧线，起始角度为 `startAngle` 单位为弧度，结束角度为 `endAngle`，单位为弧度。最后一个参数 `counterclockwise` 表示是否逆时针计算起始角度和结束角度（默认为顺时针）
- `arcTo(x1, y1, x2, y2, radius)` 以给定半径 `radius`，经由 `(x1, y1)` 绘制一条从上一点到 `(x2, y2)` 的弧线
- `bazierCurveTo(c1x, c1y, c2x, c2y, x, y)` 以 `(c1x, c1y)` 和 `(c2x, c2y)` 为控制点，绘制一条从上一点到 `(x, y)` 的弧线（三次贝塞尔曲线）
- `lineTo(x, y)` 绘制一条从上一点到 `(x, y)` 的直线
- `moveTo(x, y)` 不绘制线条，只把绘制光标移动到 `(x, y)`
- `quadraticCurveTo(cx, cy, x, y)` 以 `(cx, cy)` 为控制点，绘制一条从上一点到 `(x, y)` 的弧线（二次贝塞尔曲线）
- `rect(x, y, width, height)` 以给定宽高在坐标点 `(x, y)` 绘制一个矩形。这个方法与 `strokeRect()` 和 `fillRect()` 的区别在于，它创建的是一条路径，而不是独立的图形
- `closePath()` 创建路径之后，此方法可以绘制一条返回起点的线
- `fill()` 创建路径之后，可以选择配合 `fillStyle` 来填充路径
- `stroke()` 创建路径之后，可以选择配合 `strokeStyle` 来描画路径
- `clip()` 基于已有路径创建一个新剪切区域
- `isPointInPath(x, y)` 确定指定的点 `(x, y)` 是否在路径上

绘制一个不带数字的表盘

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>绘制路径</title>
  </head>
  <body>
    <canvas id="drawing" width="200" height="200"></canvas>
    <script>
      const drawing = document.getElementById('drawing');

      // 确保浏览器支持 <canvas>
      if (drawing.getContext) {
        const context = drawing.getContext('2d');

        // 创建路径
        context.beginPath();

        // 绘制外圆
        context.arc(100, 100, 99, 0, 2 * Math.PI, false);

        // 绘制内圆
        context.moveTo(194, 100);
        context.arc(100, 100, 94, 0, 2 * Math.PI, false);

        // 绘制分针
        context.moveTo(100, 100);
        context.lineTo(100, 15);

        // 绘制时针
        context.moveTo(100, 100);
        context.lineTo(35, 100);

        // 描画路径(使路径在视图上显示)
        context.stroke();

        if (context.isPointInPath(100, 100)) {
          console.log('Point (100, 100) is in the path.');
        }
      }
    </script>
  </body>
</html>
```



### 18.3.4 绘制文本

绘制文本的方法，都接收 4 个参数：要绘制的字符串、x 坐标、y 坐标和可选的最大像素宽度

- `fillText()`
- `strokeText()`

上面方法的绘制结果都取决于以下属性

- `font` 以 CSS 语法指定的字体样式、大小、字体族等，比如 `"10px Arial"`
- `textAlign` 指定文本的对齐方式，可能的值包括 `"start"`、`"end"`、`"left"`、`"right"`、`"center"`，推荐使用 `"start"` 和 `"end"`
- `textBaseLine` 指定文本的基线，可能的值包括 `"top"`、`"hanging"`、`"middle"`、`"alphabetic"`、`"ideographic"`、`"bottom"`

确定文本大小的方法

- `measureText()` 接收一个参数，要绘制的文本。返回一个 `TextMetrics` 对象，此对象用 `width` 属性来确定文本大小

表盘顶部绘制数字

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>绘制文本</title>
  </head>
  <body>
    <canvas id="drawing" width="200" height="200"></canvas>
    <script>
      const drawing = document.getElementById('drawing');

      // 确保浏览器支持 <canvas>
      if (drawing.getContext) {
        const context = drawing.getContext('2d');

        // 创建路径
        context.beginPath();

        // 绘制外圆
        context.arc(100, 100, 99, 0, 2 * Math.PI, false);

        // 绘制内圆
        context.moveTo(194, 100);
        context.arc(100, 100, 94, 0, 2 * Math.PI, false);

        // 绘制分针
        context.moveTo(100, 100);
        context.lineTo(100, 15);

        // 绘制时针
        context.moveTo(100, 100);
        context.lineTo(35, 100);

        // 描画路径(使路径在视图上显示)
        context.stroke();

        // 正常
        context.font = 'bold 14px Arial';
        context.textAlign = 'center';
        context.textBaseLine = 'middle';
        context.fillText('12', 100, 20);

        // 与开头对齐
        context.textAlign = 'start';
        context.fillText('12', 100, 40);

        // 与末尾对齐
        context.textAlign = 'end';
        context.fillText('12', 100, 60);
      }
    </script>
  </body>
</html>
```

计算文本大小判断

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>绘制文本</title>
  </head>
  <body>
    <canvas id="drawing" width="200" height="200"></canvas>
    <script>
      const drawing = document.getElementById('drawing');

      // 确保浏览器支持 <canvas>
      if (drawing.getContext) {
        const context = drawing.getContext('2d');

        let fontSize = 100;
        context.font = fontSize + 'px Arial';
        while (context.measureText('Hello world!').width > 140) {
          fontSize--;
          context.font = fontSize + 'px Arial';
        }
        context.fillText('Hello world!', 10, 30);
        context.fillText('Font size is' + fontSize + 'px', 10, 70);
      }
    </script>
  </body>
</html>
```



### 18.3.5 变换

改变绘制上下文的变换矩阵方法

- `rotate(angle)` 围绕原点把图像旋转 `angle` 弧度

- `scale(scalex, scaleY)` 通过在 x 轴乘以 `scaleX`、在 y 轴乘以 `scaleY` 来缩放图像。`scaleX` 和 `scaleY` 的默认值都是 1.0

- `translate(x, y)` 把原点移动到 `(x, y)` 执行这个操作后，坐标 (0, 0) 就会变成 `(x, y)`

- `transform(m1_1, m1_2, m2_1, m2_2, dx, dy)` 像下面通过矩阵乘法直接修改矩阵

  ```matlab
  m1_1 m1_2 dx
  m2_1 m2_2 dy
  0    0    1
  ```

- `setTransform(m1_1, m1_2, m2_1, m2_2, dx, dy)` 把矩阵重置为默认值，再以传入的参数调用 `transform()`

- `save()` 保存当前的属性和变换状态，所有这一时刻的设置会被放到一个暂存栈中

- `restore()` 系统地恢复之前保存的设置

前面的表盘例子，把坐标原点移动到表盘中心，再绘制表针那就简单了

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>变换</title>
  </head>
  <body>
    <canvas id="drawing" width="200" height="200"></canvas>
    <script>
      const drawing = document.getElementById('drawing');

      // 确保浏览器支持 <canvas>
      if (drawing.getContext) {
        const context = drawing.getContext('2d');

        // 创建路径
        context.beginPath();

        // 绘制外圆
        context.arc(100, 100, 99, 0, 2 * Math.PI, false);

        // 绘制内圆
        context.moveTo(194, 100);
        context.arc(100, 100, 94, 0, 2 * Math.PI, false);

        // 移动原点到表盘中心
        context.translate(100, 100);

        // 旋转表针
        context.rotate(1);

        // 绘制分针
        context.moveTo(0, 0);
        context.lineTo(0, -85);

        // 绘制时针
        context.moveTo(0, 0);
        context.lineTo(-65, 0);

        // 描画路径(使路径在视图上显示)
        context.stroke();
      }
    </script>
  </body>
</html>
```



### 18.3.6  绘制图像

操作图像方法

- `drawImage()` 接收 3 组不同的参数

  - 传入 HTML 的 `<img>` 元素

    ```js
    const image = document.images[0];
    context.drawImage(image, 10, 10);  // 传入图像并且设置 x y 坐标
    ```

  - 缩放图像

    ```js
    context.drawImage(image, 50, 10, 20, 30);  // 图像缩放到 20 像素宽、30 像素高
    ```

  - 只把图像绘制到上下文中的一个区域，给 `drawImage()` 提供 9 个参数：要绘制的图像、源图像 `x` 坐标、源图像 `y` 坐标、源图像宽度、源图像高度、目标图像 `x` 坐标、目标图像 `y` 坐标、目标图像区域宽度和目标图像区域高度

    ```js
    context.drawImage(image, 0, 10, 50, 50, 0, 100, 40, 60);
    ```

- `toDataURL()` 方法获取图像绘制的结果，如果绘制的图像来自其他域而非当前页面，则不能获取其数据



### 18.3.7 阴影

以下属性的值可以自动为已有形状或路径生成阴影

- `shadowColor` CSS 颜色值，表示要绘制的阴影颜色，默认为黑色
- `shadowOffsetX` 阴影相对于形状或路径的 `x` 坐标的偏移量，默认为 0
- `shadowOffsetY` 阴影相对于形状或路径的 `y` 坐标的偏移量，默认为 0
- `shadowBlur` 像素，表示阴影的模糊量。默认值为 0，表示不模糊

设置两个矩形，使用相同的阴影样式

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>阴影</title>
  </head>
  <body>
    <canvas id="drawing" width="200" height="200"></canvas>
    <script>
      const drawing = document.getElementById('drawing');

      // 确保浏览器支持 <canvas>
      if (drawing.getContext) {
        const context = drawing.getContext('2d');

        // 设置阴影
        context.shadowOffsetX = 5;
        context.shadowOffsetY = 5;
        context.shadowBlur = 4;
        context.shadowColor = 'rgba(0, 0, 0, 0.5)';
        // 绘制红色矩形
        context.fillStyle = '#ff0000';
        context.fillRect(10, 10, 50, 50);
        // 绘制蓝色矩形
        context.fillStyle = '#0000ff';
        context.fillRect(30, 30, 50, 50);
      }
    </script>
  </body>
</html>
```



### 18.3.8 渐变

渐变通过 `CanvasGradient` 的实例表示，通过调用上下文的 `createLinearGradient()` 方法创建

- `createLinearGradient()` 接收 4 个参数：起点 `x` 坐标、起点 `y` 坐标、终点 `x` 坐标、终点 `y` 坐标，返回的 `gradient` 实例有以下方法
  - `addColorStop()` 为渐变指定色标，接收 2 个参数：色标位置(0~1范围值)、CSS 颜色字符串
- `createRadialGradient()` 方法创建径向渐变。接收 6 个参数：分别为两个圆形圆形的坐标和半径。前 3 个参数指定起点圆形中心的 `x`、`y` 坐标和半径，后 3 个参数指定终点圆形中心的 `x`、`y` 坐标和半径

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>渐变</title>
  </head>
  <body>
    <canvas id="drawing" width="200" height="200"></canvas>
    <script>
      const drawing = document.getElementById('drawing');

      // 确保浏览器支持 <canvas>
      if (drawing.getContext) {
        const context = drawing.getContext('2d');

        // 绘制红色矩形
        context.fillStyle = '#ff0000';
        context.fillRect(10, 10, 50, 50);
        // 绘制渐变矩形
        const gradient = context.createLinearGradient(30, 30, 70, 70);
        gradient.addColorStop(0, 'white');
        gradient.addColorStop(1, 'black');
        context.fillStyle = gradient;
        context.fillRect(30, 30, 50, 50);
      }
    </script>
  </body>
</html>
```

创建起点圆心在形状中心并向外扩散的径向渐变，将两个圆形设置为同心圆

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>渐变</title>
  </head>
  <body>
    <canvas id="drawing" width="200" height="200"></canvas>
    <script>
      const drawing = document.getElementById('drawing');

      // 确保浏览器支持 <canvas>
      if (drawing.getContext) {
        const context = drawing.getContext('2d');
        const gradient = context.createRadialGradient(55, 55, 10, 55, 55, 30);
        gradient.addColorStop(0, 'white');
        gradient.addColorStop(1, 'black');

        // 绘制红色矩形
        context.fillStyle = '#ff0000';
        context.fillRect(10, 10, 50, 50);
        // 绘制渐变矩形
        context.fillStyle = gradient;
        context.fillRect(30, 30, 50, 50);
      }
    </script>
  </body>
</html>
```



### 18.3.9 图案

用于填充和描画的重复图像

- `createPattern()` 方法并传入两个参数：一个 HTML `<img>` 元素（也可以是 `<video>` 或另一个 `<canvas>`）和一个表示该如何重复图像的字符串。第二个参数可取值 `"repeat"`、`"repeat-x"`、`"repeat-y"`、`"no-repeat"`

```js
const image = document.images[0];
const pattern = context.createPattern(image, 'repeat');

// 绘制矩形
context.fillStyle = pattern;
context.fillRect(10, 10, 150, 150);
```



### 18.3.10 图像数据

获取原始图像数据

- `getImageData()` 接收 4 个参数：要取得数据中第一个像素的左上角坐标和要取得的像素宽度及高度，返回一个 `ImageData` 实例，包含三个属性
  - `width`
  - `height`
  - `data` 数组中都由 4 个值表示，代表红、绿、蓝、透明度每个值都在 0~255 范围内
- `putImageData()` 将图像数据设置到上下文中

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>图像数据</title>
  </head>
  <body>
    <canvas id="drawing" width="200" height="200"></canvas>
    <script>
      const drawing = document.getElementById('drawing');

      // 确保浏览器支持 <canvas>
      if (drawing.getContext) {
        const context = drawing.getContext('2d');

        // 绘制红色矩形
        context.fillStyle = '#ff0000';
        context.fillRect(10, 10, 50, 50);

        const imageData = context.getImageData(0, 0, 50, 50);
        const data = imageData.data;
        for (let i = 0, len = data.length; i < len; i += 4) {
          const red = data[i];
          const green = data[i + 1];
          const blue = data[i + 2];
          const alpha = data[i + 3];

          // 取得 RGB 平均值
          average = Math.floor((red + green + blue) / 3);

          // 设置颜色，不管透明度
          data[i] = average;
          data[i + 1] = average;
          data[i + 2] = average;
        }

        // 将修改后的数据写回 ImageData 并应用到画布上显示出来
        imageData.data = data;
        context.putImageData(imageData, 0, 0);
      }
    </script>
  </body>
</html>
```



### 18.3.11 合成

- `globalAlpha` 范围在 0~1 的值，用于指定所有绘制内容的透明度，默认值为 0
- `globalCompositeOperation` 表示新绘制的形状如何与上下文中已有的形状融合，为字符串，可取值如下
  - `source-over`
  - `source-in`
  - `source-out`
  - `source-atop`
  - `destination-over`
  - `destination-in`
  - `destination-out`
  - `destination-atop`
  - `lighter`
  - `copy`
  - `xor`

> **注意** `globalCompositeOperation` 在不同浏览器上可能存在差异

## 18.4 WebGL

WebGL 是画布的 3D 上下文，WebGL 不是 W3C 制定的标准，而是 Khronos Group 的标准。

要使用 WebGL 最好熟悉 OpenGL ES 2.0，因为很多概念可以照搬过来

> **注意** 定型数组是在 WebGL 中执行操作的重要数据结构。

