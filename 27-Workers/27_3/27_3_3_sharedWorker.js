// sharedWorker.js
let i = 0;
self.onconnect = () => console.log(`connected ${i++} times`);