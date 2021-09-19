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

