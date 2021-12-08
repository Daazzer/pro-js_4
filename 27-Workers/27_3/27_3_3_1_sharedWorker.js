// sharedWorker.js
const connectedProts = new Set();

self.onconnect = ({ ports }) => {
  connectedProts.add(ports[0]);

  console.log(`${connectedProts.size} unique connected ports`);
};