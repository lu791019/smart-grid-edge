'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const modbusServices_1 = require('../services/modbusServices');
const mqttServices_1 = require('../services/mqttServices');
const Model_1 = __importDefault(require('../db/pouchdb/model/Model'));
// 修改類型守衛函數以處理 IDocument
function isImportedModbusConfig(doc) {
  return (
    typeof doc.host === 'string' &&
    typeof doc.port === 'number' &&
    typeof doc.method === 'string' &&
    typeof doc.start === 'number' &&
    typeof doc.counts === 'number' &&
    typeof doc.from_id === 'number' &&
    typeof doc.from_name === 'string' &&
    (doc.name === 'main' || doc.name === 'meter' || doc.name === 'battery') &&
    typeof doc.frequency === 'number' &&
    Array.isArray(doc.registers) &&
    typeof doc.table === 'string'
  );
}
// 轉換數據
const transformData = (data, registers) => {
  return registers.map((register, index) => {
    const rawValue = data[index];
    const value = (rawValue * register.scale).toFixed(2);
    return {
      name: register.name,
      address: register.address,
      value: parseFloat(value),
      unit: register.unit,
    };
  });
};
// 創建批次外部數據
const createBatchedExternalData = (baseConfig, host, fromId, fromName) => {
  const batchSize = 60;
  const registerBatches = [];
  // 先按 address 排序 registers
  const sortedRegisters = [...baseConfig.registers].sort(
    (a, b) => a.address - b.address,
  );
  // 根據連續的地址範圍創建批次
  let currentBatch = [];
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
  console.log(
    `Batches created for device ${fromId}:`,
    JSON.stringify(registerBatches, null, 2),
  );
  return Object.assign(Object.assign({}, baseConfig), {
    host,
    from_id: fromId,
    from_name: fromName,
    registers: sortedRegisters,
    registerBatches,
  });
};
// 主程式
exports.default = {
  get: () =>
    __awaiter(void 0, void 0, void 0, function* () {
      try {
        // 從 PouchDBModel 讀取
        const pouchDBModel = Model_1.default.getInstance();
        const externalData = yield pouchDBModel.readDocByObject({
          table: 'device_config',
          type: 'modbus',
        });
        // 將 externalData 轉換為 ModbusConfig[] 並創建批次配置
        const modbusConfigs = externalData
          .filter(isImportedModbusConfig)
          .map((doc) => {
            return createBatchedExternalData(
              doc,
              doc.host,
              doc.from_id,
              doc.from_name,
            );
          });
        // 併發處理每個 modbusConfig
        yield Promise.allSettled(
          modbusConfigs.map((config) =>
            __awaiter(void 0, void 0, void 0, function* () {
              try {
                let allTransformedData = [];
                // 使用 registerBatches
                const batches = config.registerBatches || [];
                console.log(
                  `Processing batches for device ${config.from_id}:`,
                  JSON.stringify(batches, null, 2),
                );
                // 處理每個批次
                for (const batch of batches) {
                  const startAddress = batch.startAddress;
                  const numRegisters = batch.registers.length;
                  console.log(`Reading batch for device ${config.from_id}:`, {
                    startAddress,
                    numRegisters,
                    registers: batch.registers.map((r) => r.name),
                  });
                  // 讀取 modbus 設備
                  const rawData = yield (0,
                  modbusServices_1.readModbusRegisters)(
                    config,
                    startAddress,
                    numRegisters,
                  );
                  // 根據配置轉換數據
                  const transformedData = transformData(
                    rawData,
                    batch.registers,
                  );
                  allTransformedData =
                    allTransformedData.concat(transformedData);
                  console.log(
                    `Transformed data for device ${config.from_id}:`,
                    JSON.stringify(transformedData, null, 2),
                  );
                }
                // 封裝數據
                const responseData = {
                  name: config.name,
                  method: config.method,
                  from_id: config.from_id,
                  from_name: config.from_name,
                  frequency: config.frequency,
                  data: allTransformedData,
                };
                // 構建 MQTT 主題名稱
                const topic = `device/${config.from_id}/${config.method}/${config.frequency}`;
                console.log(
                  `Sending MQTT message for device ${config.from_id} to topic: ${topic}`,
                );
                // 發送消息到 MQTT
                (0,
                mqttServices_1.sendMessage)(topic, JSON.stringify(responseData));
              } catch (error) {
                console.error(
                  `Error processing data for device ${config.from_id}:`,
                  error,
                );
              }
            }),
          ),
        );
      } catch (error) {
        console.log(error);
        console.log('QQ');
      }
    }),
};
