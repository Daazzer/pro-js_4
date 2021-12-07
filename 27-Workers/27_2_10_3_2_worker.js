// worker.js
self.onmessage = ({ data }) => {
  const view = new Uint32Array(data);

  // 执行 100 万次加操作
  for (let i = 0; i < 1e6; i++) {
    Atomics.add(view, 0, 1);
  }

  self.postMessage(null);
};