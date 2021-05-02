const text = 'cat, bat, sat, fat';
const pattern = /.at/y;
let matches = pattern.exec(text);

console.log(matches.index);
console.log(matches[0]);
console.log(pattern.lastIndex);

matches = pattern.exec(text);

console.log(matches);
console.log(pattern.__proto__);
