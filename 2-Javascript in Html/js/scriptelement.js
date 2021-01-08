const h1 = document.querySelector('h1');
const asyncScriptDesc = document.createElement('h2');
asyncScriptDesc.textContent = '我是 async 属性创建的元素';

document.body.insertBefore(asyncScriptDesc, h1.nextElementSibling);
