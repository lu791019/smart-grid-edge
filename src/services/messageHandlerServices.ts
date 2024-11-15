import { ModbusConfig } from '@/interface/interface';
import { addModbusTask } from '@/queue/modbusQueue';

const handleMessage = async (topic: string, message: Buffer) => {
  let result: string = topic.split('/')[0];
  console.log('收到訊息', topic);
  switch (result) {
    case 'control':
      const [_, typeModule] = topic.split('/');
      if (typeModule === 'modbus') {
        controlModbusHandler(topic, message);
      }
      break;
  }
};

const controlModbusHandler = async (topic: string, message: Buffer) => {
  const messageContent = message.toString();
  let config: ModbusConfig = JSON.parse(messageContent);

  console.log('go to addModbusTask');
  // 使用导入的函数添加任务到队列
  addModbusTask(config);
};

export { handleMessage };
