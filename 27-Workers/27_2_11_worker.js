// worker.js
self.onmessage = ({ data }) => {
  let sum = 0;
  let view = new Float32Array(data.arrayBuffer);

  // 求和
  for (let i = data.startIdx; i < data.endIdx; i++) {
    // 不需要原子操作，因为只需要读
    sum += view[i];
  }

  // 把结果发送给工作者线程
  self.postMessage(sum);
};

// 发送消息给 TaskWorker
// 通知工作者线程准备好接收任务了
self.postMessage('ready');