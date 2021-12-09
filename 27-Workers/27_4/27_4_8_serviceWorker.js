// serviceWorker.js
const CACHE_KEY = 'v1';

self.oninstall = installEvent => {
  // 填充缓存，然后强制服务工作者线程进入已激活状态
  // 这样会触发 activate 事件
  installEvent.waitUntil(
    caches.open(CACHE_KEY)
      .then(cache => cache.addAll([
        '27_4_8_foo.css',
        '27_4_8_bar.js'
      ]))
      .then(() => self.skipWaiting())
  );
};

// 强制服务工作者线程接管客户端
// 这会在每个客户端触发 controllerchange 事件
self.onactivate = activateEvent => clients.claim();
