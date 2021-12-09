// serviceWorker.js
self.onmessage = ({ data, source }) => {
  console.log('service worker heard:', data);

  source.postMessage('bar');
};