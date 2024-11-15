'use strict';
// import { Context } from 'hono';
// import { readModbusRegisters } from '../services/modbusServices';
// import { ModbusConfig, Register } from '../interface/interface';
// import { createConfig } from '../utility/config';
// import response from '../utility/response';
// import { sendMessage } from '../services/mqttServices';
// import PouchDBModel from '../db/pouchdb/model/Model';
//
// const externalData: ModbusConfig = {
//   host: '140.115.65.193',
//   port: 502,
//   method: 'modbus',
//   start: 1,
//   counts: 24,
//   from_id: 1,
//   from_name: '15_kw',
//   name: 'main', // 只能是 'main' | 'meter' | 'battery'
//   frequency: 10,
//   registers: [
//     {
//       name: 'RealPower_15K',
//       address: 2181,
//       length: 2,
//       scale: 1,
//       function: 'read_holding_registers',
//       unit: 'W',
//     },
//     {
//       name: 'BatterySOC_15K',
//       address: 19,
//       length: 2,
//       scale: 0.1,
//       function: 'read_holding_registers',
//       unit: 'W',
//     },
//     {
//       name: 'PVPower_15K',
//       address: 9,
//       length: 1,
//       scale: 0.1,
//       function: 'read_holding_registers',
//       unit: 'W',
//     },
//     {
//       name: 'MainPower_15K',
//       address: 1,
//       length: 2,
//       scale: 0.1,
//       function: 'read_holding_registers',
//       unit: 'W',
//     },
//     {
//       name: 'Main Grid Power(Low Word)',
//       address: 3,
//       length: 2,
//       scale: 0.1,
//       function: 'read_holding_registers',
//       unit: 'W',
//     },
//     {
//       name: 'Main Total Green Energy(Low Word)',
//       address: 11,
//       length: 2,
//       scale: 0.001,
//       function: 'read_holding_registers',
//       unit: 'W',
//     },
//     {
//       name: 'Main Carbon Redcing(Low Word)',
//       address: 13,
//       length: 2,
//       scale: 0.001,
//       function: 'read_holding_registers',
//       unit: 'W',
//     },
//     {
//       name: 'Main Wind MPPT Power(Low Word)',
//       address: 15,
//       length: 2,
//       scale: 0.1,
//       function: 'read_holding_registers',
//       unit: 'W',
//     },
//     {
//       name: 'Main Today Green Energy(Low Word)',
//       address: 17,
//       length: 2,
//       scale: 0.001,
//       function: 'read_holding_registers',
//       unit: 'W',
//     },
//     {
//       name: 'Ambient Temperature',
//       address: 21,
//       length: 1,
//       scale: 0.01,
//       function: 'read_holding_registers',
//       unit: 'W',
//     },
//     {
//       name: 'PV MPPT Power(Low Word)',
//       address: 23,
//       length: 2,
//       scale: 0.1,
//       function: 'read_holding_registers',
//       unit: 'W',
//     },
//   ],
//   table:'device_config'
// };
//
// const newExternalData: ModbusConfig[] = [
//   {
//     ...externalData,
//     host: '192.168.50.7',
//     from_id: 2,
//     from_name: '60kw_1',
//   },
//   {
//     ...externalData,
//     host: '192.168.50.8',
//     from_id: 3,
//     from_name: '60kw_2',
//   },
//   {
//     ...externalData,
//     host: '192.168.50.6',
//     from_id: 4,
//     from_name: '30kw_1',
//   },
// ];
//
// // PouchDB 模型实例
// const dbModel = PouchDBModel.getInstance();
//
// // 根据配置文件中的规则对数据进行转换
// const transformData = (data: number[], config: ModbusConfig): TransformedData[] => {
//   return config.registers.map((register: Register, index: number) => {
//     const rawValue = data[index];
//     const value = (rawValue * register.scale).toFixed(2);
//
//     return {
//       name: register.name,
//       address: register.address,
//       value: parseFloat(value), // 确保 value 是数字类型
//       unit: register.unit,
//     };
//   });
// };
//
// const writeDataToPouchDB = async (responseData: ResponseData) => {
//   try {
//     const doc = {
//       _id: `doc_${responseData.from_id}_${new Date().toISOString()}`,
//       ...responseData,
//     };
//
//     // 删除已有文档
//     try {
//       const existingDoc = await dbModel.readDocById(doc._id);
//       await dbModel.deleteDoc(existingDoc._id, existingDoc._rev);
//     } catch (error) {
//       if ((error as PouchDB.Core.Error).status !== 404) {
//         throw error;
//       }
//     }
//
//     // 保存新文档
//     await dbModel.saveDoc(doc);
//     console.log('Document saved:', doc);
//
//     // 读取所有文档并检查是否成功写入
//     const allDocs = await dbModel.readAllDocs();
//     console.log('All Documents:', allDocs);
//
//     const savedDoc = allDocs.find(d => d._id === doc._id);
//     if (savedDoc) {
//       console.log('Document successfully written to PouchDB:', savedDoc);
//     } else {
//       console.error('Document not found in PouchDB after write:', doc._id);
//     }
//   } catch (error) {
//     console.error('Failed to write document:', error);
//   }
// };
//
// export default {
//   get: async (ctx: Context) => {
//     console.log('QQQ');
//     for (const data of newExternalData) {
//       if (data.host.startsWith('192.168.')) {
//         try {
//           await writeDataToPouchDB({
//             name: data.name,
//             method: data.method,
//             from_id: data.from_id,
//             from_name: data.from_name,
//             frequency: data.frequency,
//             data: [], // 这里无需实际数据
//           });
//         } catch (error) {
//           console.log(error);
//           console.log('QQ');
//           return response.failed(ctx, 'Failed to write data to PouchDB');
//         }
//       } else if (data.host === '140.115.65.193') {
//         try {
//           const config = createConfig(data);
//           const frequency = data.frequency; // 提取 frequency
//
//           const startAddress = config.start;
//           const numRegisters = config.counts;
//
//           const rawData = await readModbusRegisters(
//             config,
//             startAddress,
//             numRegisters,
//           );
//
//           const transformedData = transformData(rawData, config);
//
//           const responseData: ResponseData = {
//             name: config.name,
//             method: config.method,
//             from_id: config.from_id,
//             from_name: config.from_name,
//             frequency: config.frequency, // 包括 frequency 字段
//             data: transformedData,
//           };
//
//           console.log("Response Data:", responseData); // 调试输出
//
//           const topic = `device/${data.from_id}/${data.method}/${data.frequency}`;
//           // sendMessage(topic, JSON.stringify(responseData)); // 保留 MQTT 功能，暂时注释
//
//           await writeDataToPouchDB(responseData);
//
//         } catch (error) {
//           console.log(error);
//           console.log('QQ');
//           return response.failed(ctx, 'Failed to read Modbus registers and write to PouchDB');
//         }
//       }
//     }
//     return response.success(ctx, 'All data processed successfully');
//   },
// };
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
const response_1 = __importDefault(require('../utility/response'));
exports.default = {
  get: (ctx) =>
    __awaiter(void 0, void 0, void 0, function* () {
      return response_1.default.success(ctx, 'All data processed successfully');
    }),
};
// import response from '../utility/response';
// import { Context } from 'hono';
// import { ModbusConfig } from '../interface/interface';
// import PouchDBModel from '../db/pouchdb/model/Model';
// import { readModbus } from '../services/modbusServices'; // 假設您有這個服務
// const getModbusConfigs = async (): Promise<ModbusConfig[]> => {
//   const pouchDBModel = PouchDBModel.getInstance();
//   try {
//     const allDocs = await pouchDBModel.readDocByTable('device_config');
//     console.log('All documents from PouchDB:', allDocs);
//     const modbusConfigs = allDocs
//       .filter((doc: any) => doc.type === 'modbus')
//       .map((doc: any): ModbusConfig => ({
//         host: doc.host,
//         port: doc.port,
//         method: doc.method,
//         start: doc.start,
//         counts: doc.counts,
//         from_id: doc.from_id,
//         from_name: doc.from_name,
//         name: doc.name,
//         frequency: doc.frequency,
//         registers: doc.registers,
//         table: doc.table,
//       }));
//     console.log('Filtered Modbus configs:', modbusConfigs);
//     return modbusConfigs;
//   } catch (error) {
//     console.error('Error reading Modbus configs from PouchDB:', error);
//     return [];
//   }
// };
// export default {
//   get: async (ctx: Context) => {
//     try {
//       const configs = await getModbusConfigs();
//       console.log('Modbus Configurations from PouchDB:', configs);
//       if (configs.length === 0) {
//         console.warn('No Modbus configurations found in PouchDB');
//         return response.failed(ctx, 'No Modbus configurations found');
//       }
//       const results = await Promise.allSettled(
//         configs.map(async (config) => {
//           try {
//             console.log(`Attempting to read Modbus data for ${config.host}:${config.port}`);
//             const modbusData = await readModbus(config);
//             const responseData = {
//               host: config.host,
//               port: config.port,
//               from_name: config.from_name,
//               data: modbusData,
//             };
//             console.log(`Modbus Results for ${config.host}:${config.port}:`, responseData);
//             return responseData;
//           } catch (error) {
//             console.error(`Error processing data for device ${config.host}:${config.port}:`, error);
//             return {
//               host: config.host,
//               port: config.port,
//               from_name: config.from_name,
//               error: error instanceof Error ? error.message : 'Unknown error'
//             };
//           }
//         })
//       );
//       const processedResults = results.map(result => {
//         if (result.status === 'fulfilled') {
//           return result.value;
//         } else {
//           return result.reason;
//         }
//       });
//       console.log('Processed Modbus Results:', JSON.stringify(processedResults, null, 2));
//       return response.success(ctx, processedResults);
//     } catch (error) {
//       console.error('Error reading Modbus data:', error);
//       return response.failed(ctx, 'Error processing Modbus data');
//     }
//   },
// };
