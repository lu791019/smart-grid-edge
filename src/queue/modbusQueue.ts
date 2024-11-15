// modbusQueue.ts
import { Queue, Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import { ModbusConfig, ModbusRegister } from '@/interface/interface';
import {
  readOneModbusRegister,
  writeOneModbusRegister,
} from '@/services/modbusServices';
import { sendMessage } from '@/services/mqttServices';
import { transformData } from '@/utility/transform';
import { convertIPv6BinaryToString } from 'hono/dist/types/utils/ipaddr';
import logger from '@/utility/logger';

// 初始化 Redis 连接（如果需要自定义配置）
const redisOptions = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
  // 如果需要密码，请取消注释并填写
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
};
const connection = new IORedis(redisOptions);

// 初始化任务队列，使用 `connection` 选项
const taskQueue = new Queue('modbusQueue', { connection });

// 定义任务的重试策略和延迟
const RETRY_OPTIONS = {
  attempts: 1, // 最大重试次数
  backoff: {
    type: 'exponential',
    delay: 1000, // 初始延迟1秒
  },
};
// 创建 Worker 来处理任务
const worker = new Worker(
  'modbusQueue',
  async (job: Job) => {
    const { type, config, register } = job.data;
    logger.info(`Processing ${type} task for register: ${register.id}`);
    try {
      if (type === 'write') {
        await writeOneModbusRegister(config, register);
      } else if (type === 'read') {
        const rawData = await readOneModbusRegister(config, register);

        // 检查 rawData 是否为 null
        if (rawData !== null) {
          // 根据配置转换数据
          const transformedData = transformData(rawData, [register]);

          // 封装数据
          const responseData = {
            method: config.method,
            from_id: config.from_id,
            from_name: config.from_name,
            frequency: config.frequency,
            data: [transformedData],
          };

          // 构建 MQTT 主题名称
          const topic = `device/${config.from_id}/${config.method}/${config.frequency}`;

          console.log(
            `Sending MQTT message for device ${config.from_id} to topic: ${topic}`,
          );
          logger.info(
            `Sending MQTT message for device ${config.from_id} to topic: ${topic}`,
          );

          // 发送消息到 MQTT
          sendMessage(topic, JSON.stringify(responseData));
        } else {
          console.error(
            'readOneModbusRegister returned null for register:',
            register,
          );
          logger.error(
            'readOneModbusRegister returned null for register:',
            register,
          );
        }
      }
    } catch (error) {
      logger.error('Task failed:', error);
      console.error('Task failed:', error);
      throw error; // 抛出错误，BullMQ 会根据重试策略处理
    }
  },
  {
    concurrency: 1,
    connection, // 传递重试选项到 Worker
  }, // 设置并发数为 1
);

// 导出一个添加任务的函数
export const addModbusTask = (config: ModbusConfig) => {
  const readInterval = 5000; // 5秒间隔
  console.log('Adding tasks');
  config.registers?.forEach((register) => {
    if (register.function.startsWith('write')) {
      taskQueue.add(
        'write', // 任务名称
        { type: 'write', config, register },
        {
          jobId: `write-${register.id}-${Date.now()}`, // 确保每个任务的 jobId 唯一
          removeOnComplete: true,
          removeOnFail: false,
          ...RETRY_OPTIONS,
        },
      );
    } else if (register.function.startsWith('read')) {
      // 使用 BullMQ 的重复任务功能
      taskQueue.add(
        'read', // 任务名称
        { type: 'read', config, register },
        {
          jobId: `read-${register.id}`,
          repeat: { every: readInterval, limit: 10 }, // 每隔 5 秒重复一次
          removeOnComplete: true,
          removeOnFail: false,
          ...RETRY_OPTIONS,
        },
      );
    }
  });
};
