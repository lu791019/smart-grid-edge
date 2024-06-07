import * as mqtt from 'mqtt';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as url from 'url';

dotenv.config();

const host = process.env.MQTT_HOST!;
const port = parseInt(process.env.MQTT_PORT!, 10);
const clientId = process.env.MQTT_CLIENT_ID!;
const username = process.env.MQTT_USERNAME!;
const password = process.env.MQTT_PASSWORD!;

// Resolve the directory name
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

console.log(__dirname)
console.log(path.join(__dirname, '../../ca/energypowerdemo/ca.cert.pem'))
const caFile = fs.readFileSync(path.join(__dirname, '../../ca/energypowerdemo/ca.cert.pem'));
const certFile = fs.readFileSync(path.join(__dirname, '../../ca/energypowerdemo/server.cert.pem'));
const keyFile = fs.readFileSync(path.join(__dirname, '../../ca/energypowerdemo/server.key.pem'));

const options: mqtt.IClientOptions = {
    host,
    port,
    protocol: 'mqtts',
    clientId,
    ca: [caFile],
    cert: certFile,
    key: keyFile,
    rejectUnauthorized: false,
    username,
    password
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

export const sendMessage = (topic: string, msg: string) => {
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