// serviceWorker.js
self.onactivate = () => {
  self.registration.pushManager.subscribe({
    applicationServerKey: '<public-key>', // 来自服务器的公钥
    userVisibleOnly: true
  });
};