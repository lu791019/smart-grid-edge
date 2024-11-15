'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.sendMessage = void 0;
const mqtt = __importStar(require('mqtt'));
const fs = __importStar(require('fs'));
const dotenv = __importStar(require('dotenv'));
const path = __importStar(require('path'));
dotenv.config();
const host = process.env.MQTT_HOST;
const port = parseInt(process.env.MQTT_PORT, 10);
const clientId = process.env.MQTT_CLIENT_ID;
const username = process.env.MQTT_USERNAME;
const password = process.env.MQTT_PASSWORD;
console.log(__dirname);
console.log(path.join(__dirname, '../../ca/energypowerdemo/ca.cert.pem'));
const caFile = fs.readFileSync(
  path.join(__dirname, '../../ca/energypowerdemo/ca.cert.pem'),
);
const certFile = fs.readFileSync(
  path.join(__dirname, '../../ca/energypowerdemo/server.cert.pem'),
);
const keyFile = fs.readFileSync(
  path.join(__dirname, '../../ca/energypowerdemo/server.key.pem'),
);
const options = {
  host,
  port,
  protocol: 'mqtts',
  clientId,
  ca: [caFile],
  cert: certFile,
  key: keyFile,
  rejectUnauthorized: false,
  username,
  password,
};
const client = mqtt.connect(options);
let isConnected = false;
client.on('connect', () => {
  isConnected = true;
  console.log('客戶端已連接');
});
client.on('disconnect', () => {
  console.error('客戶端已斷開連接');
  isConnected = false;
});
client.on('error', (err) => {
  console.error('客戶端錯誤：' + err.message);
});
client.on('offline', () => {
  console.error('客戶端已離線');
});
client.on('reconnect', () => {
  console.log('客戶端正在重新連接');
});
const sendMessage = (topic, msg) => {
  if (!isConnected) {
    console.error('客戶端未連接。消息未發送。');
    return;
  }
  client.publish(topic, msg, { qos: 1 }, (err) => {
    if (err) {
      console.error('消息發送失敗：' + err.message);
    } else {
      console.log(`消息已發送到主題 ${topic}：${msg}`);
    }
  });
};
exports.sendMessage = sendMessage;
