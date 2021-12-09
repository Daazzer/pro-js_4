// serviceWorker.js
// 收到推送事件后，在通知中以文本形式显示数据
self.onpush = pushEvent => {
  pushEvent.waitUntil(
    self.registration.showNotification(pushEvent.data.text())
  );
};

// 如果用户单击通知，则打开相应的应用程序页面
self.onnotificationclick = ({ notification }) => {
  clients.openWindow('https://example.com/clicked-notification');
};