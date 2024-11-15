import { schedule, ScheduledTask } from 'node-cron';
import { readModbusScheduler } from '@/schedulers/readModbusScheduler';
import { readSnmpScheduler } from '@/schedulers/readSnmpScheduler';
import { readAPIBMSScheduler } from '@/schedulers/readAPIBMSScheduler';
import { writeDataToPouchDBService } from '@/services/pouchDBServices';
import { subscribe } from '@/services/mqttServices';
import API from '@/API/api_index';
// 參數定義清楚
import { Config } from '@/interface/interface';

const jobReferences: { [key: string]: ScheduledTask } = {}; // 指定类型

// 動態添加排程任務並存儲到PouchDB
const addJob = async (data: Config) => {
  const frequencyInSeconds = data.frequency;
  const cronExpression = `\*/${frequencyInSeconds} \* \* \* \* \*`;

  const job = schedule(cronExpression, () => {
    if (data.method === 'modbus') {
      readModbusScheduler(data.key);
    } else if (data.method === 'snmp') {
      readSnmpScheduler(data.key);
    } else if (data.method === 'API_BMS') {
      readAPIBMSScheduler(data.key);
    }
  });
  // 儲存這個排程任務的參考
  jobReferences[data.key] = job;

  console.log(`Job ${data.key} added and stored to DB`);
};

// 移除排程任務
const removeAllJob = async () => {
  for (const jobKey of Object.keys(jobReferences)) {
    const job = jobReferences[jobKey];
    if (job) {
      job.stop(); // 這裡對應 node-schedule 設定
      delete jobReferences[jobKey];
      console.log(`Job ${jobKey} cancelled`);
    }
  }
};

const initController = async () => {
  try {
    // 拿取 線上的API 並解紀錄進入DB裡面
    const response = await API.devicesConfigAPI.getDevicesConfig();
    const datas: Config[] = response.data;

    // 寫入DB
    await writeDataToPouchDBService(datas, 'device_config');
    //   先清除所有的排程任務
    await removeAllJob();
    //根據資料進行 schedule 任務
    datas.forEach(async (data) => {
      await addJob(data);
    });

    // 訂閱
    subscribe('control/#', () => {
      console.log('成功訂閱 control/# 主題');
    });
  } catch (error) {
    console.error('Error during initialization process:', error);
  }
};

export default initController;
