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

