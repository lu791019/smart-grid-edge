import PouchDBModel from '@/db/pouchdb/model/Model';
import { IDocument } from '@/db/pouchdb/model/Model';

import { ModbusConfig, ModbusRegister } from '@/interface/interface';
import { readModbusRegisters } from '@/services/modbusServices';
import { writeDataToPouchDBService } from '@/services/pouchDBServices';
import { sendMessage } from '@/services/mqttServices';

import { transformData } from '@/utility/transform';

interface BatchModbusConfig extends ModbusConfig {
  registerBatches?: RegisterBatch[];
}
interface RegisterBatch {
  startAddress: number;
  registers: ModbusRegister[];
}

// 創建批次外部數據
const createBatchedExternalData = (
  baseConfig: ModbusConfig,
  host: string,
  fromId: number,
  fromName: string,
): BatchModbusConfig => {
  const batchSize = 60;
  const registerBatches: RegisterBatch[] = [];

  // 先按 address 排序 registers
  const sortedRegisters = [...baseConfig.registers].sort(
    (a, b) => a.address - b.address,
  );

  // 根據連續的地址範圍創建批次
  let currentBatch: ModbusRegister[] = [];
  let currentStartAddress = sortedRegisters[0].address;

  sortedRegisters.forEach((register, index) => {
    if (
      register.address - currentStartAddress >= batchSize ||
      index === sortedRegisters.length - 1
    ) {
      // 如果當前寄存器的地址與批次起始地址的差距大於或等於 batchSize，
      // 或者是最後一個寄存器，則結束當前批次
      if (currentBatch.length > 0) {
        registerBatches.push({
          startAddress: currentStartAddress,
          registers: currentBatch,
        });
      }
      // 開始新的批次
      currentBatch = [register];
      currentStartAddress = register.address;
    } else {
      // 將當前寄存器添加到當前批次
      currentBatch.push(register);
    }
  });

  // 添加最後一個批次（如果有的話）
  if (currentBatch.length > 0) {
    registerBatches.push({
      startAddress: currentStartAddress,
      registers: currentBatch,
    });
  }

  return {
    ...baseConfig,
    host,
    from_id: fromId,
    from_name: fromName,
    registers: sortedRegisters,
    registerBatches,
  };
};

// 從 PouchDBModel 讀取 後進行轉換
const isImportedModbusConfig = (
  doc: IDocument,
): doc is IDocument & BatchModbusConfig => {
  return (
    typeof doc.key === 'string' &&
    typeof doc.host === 'string' &&
    typeof doc.port === 'number' &&
    typeof doc.method === 'string' &&
    typeof doc.from_id === 'number' &&
    typeof doc.from_name === 'string' &&
    typeof doc.frequency === 'number' &&
    Array.isArray(doc.registers) &&
    typeof doc.table === 'string'
  );
};

const readModbusScheduler = async (key: string) => {
  // console.log('readModbusScheduler');
  // console.log(key);
  try {
    // 從 PouchDBModel 讀取
    const pouchDBModel = PouchDBModel.getInstance();
    const externalData: IDocument[] = await pouchDBModel.readDocByObject({
      table: 'device_config',
      key: key,
    });

    // 將 externalData 轉換為 ModbusConfig[] 並創建批次配置
    const modbusConfigs: BatchModbusConfig[] = externalData
      .filter(isImportedModbusConfig)
      .map((doc: IDocument & BatchModbusConfig) => {
        return createBatchedExternalData(
          doc,
          doc.host,
          doc.from_id,
          doc.from_name,
        );
      });

    // console.log('go to read');
    // 併發處理每個 modbusConfig
    await Promise.allSettled(
      modbusConfigs.map(async (config) => {
        // console.log('config');
        // console.log(config.key);
        try {
          let allTransformedData: any[] = [];

          // 使用 registerBatches
          const batches = config.registerBatches || [];

          // 處理每個批次
          for (const batch of batches) {
            const startAddress = batch.startAddress;
            // const numRegisters = batch.registers.length;

            // 讀取 modbus 設備
            const rawData = await readModbusRegisters(config, startAddress, 70);

            // 當沒有資訊關閉
            if (rawData == null) {
              // console.log(`No data read for device ${config.from_id}`);
              return false;
            }

            // 根據配置轉換數據
            const transformedData = transformData(rawData, batch.registers);
            allTransformedData = allTransformedData.concat(transformedData);

            // console.log(
            //   `Transformed data for device ${config.from_id}:`,
            //   JSON.stringify(transformedData, null, 2),
            // );
          }

          // 封裝數據
          const responseData = {
            method: config.method,
            from_id: config.from_id,
            from_name: config.from_name,
            frequency: config.frequency,
            data: allTransformedData,
          };

          // 構建 MQTT 主題名稱
          const topic = `device/${config.from_id}/${config.method}/${config.frequency}`;

          // console.log(
          //   `Sending MQTT message for device ${config.from_id} to topic: ${topic}`,
          // );

          // 發送消息到 MQTT
          sendMessage(topic, JSON.stringify(responseData));

          // 寫入DB
          // await writeDataToPouchDBService(allTransformedData, 'device_data');
        } catch (error) {
          console.error(
            `Error processing data for device ${config.from_id}:`,
            error,
          );
        }
      }),
    );
  } catch (e) {
    // console.log(e);
  }
};

export { readModbusScheduler };
