const worker = new Worker('./27_2_3_initializingWorker.js');

// Worker 可能仍处于初始化状态
// 但 postMessage() 数据可以正常处理
worker.postMessage('foo');
worker.postMessage('bar');
worker.postMessage('baz');

// foo
// bar
// baz