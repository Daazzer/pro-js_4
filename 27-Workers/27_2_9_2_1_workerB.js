// workerB.js
let messagePort = null;
let contextIdentifier = null;

/**
 * 添加上下文并发送
 * @param {string[]} data 标识符数据
 * @param {MessagePort|WindowOrWorkerGlobalScope} destination 通讯终端
 */
function addContextAndSend(data, destination) {
  // 添加标识符以表示当前工作者线程
  data.push(contextIdentifier);

  // 把数据发送到下一个目标
  destination.postMessage(data);
}

self.onmessage = ({ data, ports }) => {
  // 如果消息里存在端口（ports）
  // 则初始化工作者线程
  if (ports.length) {
    // 记录标识符
    contextIdentifier = data;

    // 获取 MessagePort
    messagePort = ports[0];

    // 添加处理程序把接收的数据
    // 发回到父页面
    messagePort.onmessage = ({ data }) => {
      addContextAndSend(data, self)
    };
  } else {
    addContextAndSend(data, messagePort);
  }
};