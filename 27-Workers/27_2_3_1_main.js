// main.js
const worker = new Worker('./27_2_3_1_closeWorker.js');

worker.addEventListener('message', ({ data }) => console.log(data));

// foo
// bar