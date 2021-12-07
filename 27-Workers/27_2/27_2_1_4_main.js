const worker = new Worker('./27_2_1_4_globalScopeWorker.js');

console.log('created worker: ', worker);
// created worker:  Worker {onmessage: null, onerror: null}
// inside worker:  DedicatedWorkerGlobalScope {name: '', onmessage: null, onmessageerror: null, cancelAnimationFrame: ƒ, close: ƒ, …}