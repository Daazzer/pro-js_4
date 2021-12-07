// worker.js
const globalToken = 'bar';
console.log(`importing scripts in ${self.name} with ${globalToken}`);

importScripts('./27_2_6_1_scriptA.js', './27_2_6_1_scriptB.js');

console.log('scripts imported');