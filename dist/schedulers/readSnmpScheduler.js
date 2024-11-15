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
exports.readSnmpScheduler = void 0;
const snmpServices_1 = require('../services/snmpServices');
const mqttServices_1 = require('../services/mqttServices');
const Model_1 = __importDefault(require('../db/pouchdb/model/Model'));
const transformData = (data, config) => {
  return config.registers.map((register) => {
    const rawValue = data[register.name];
    const value = rawValue.toFixed(2);
    return {
      name: register.name,
      oid: register.oid,
      value: parseFloat(value),
      community: register.community,
      // 可选的其他字段
    };
  });
};
const getSnmpConfigs = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    // 從數據庫獲取動態配置
    const pouchDBModel = Model_1.default.getInstance();
    // 讀取DB中的資訊
    const externalData = yield pouchDBModel.readDocByObject({
      table: 'device_config',
      type: 'snmp',
    });
    // 將資料轉換成config使用
    return externalData.map((data) => {
      return {
        host: data.host,
        registers: data.registers,
        from_id: data.from_id,
        from_name: data.from_name,
        frequency: data.frequency,
      };
    });
  });
const readSnmpScheduler = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      // DB拿到需要的參數
      const snmpConfigs = yield getSnmpConfigs();
      const results = yield Promise.allSettled(
        snmpConfigs.map((config) =>
          __awaiter(void 0, void 0, void 0, function* () {
            try {
              // 去 SNMP 设备读取数据
              const rawData = yield (0, snmpServices_1.readSNMP)(config);
              // 抓到的樹鋸整理一下
              const transformedData = transformData(rawData, config);
              // 包装数据
              const responseData = {
                name: 'snmp',
                from_id: config.from_id,
                from_name: config.from_name,
                frequency: config.frequency,
                data: transformedData,
              };
              // 構建 MQTT 主題名稱
              const topic = `device/${config.from_id}/snmp/${config.frequency}`;
              // 发送消息到 MQTT
              yield (0,
              mqttServices_1.sendMessage)(topic, JSON.stringify(responseData));
              console.log(`SNMP Results for ${config.host}:`, responseData);
              return responseData;
            } catch (error) {
              console.error(
                `Error processing data for device ${config.host}:`,
                error,
              );
            }
          }),
        ),
      );
      const processedResults = results.map((result) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          return result.reason;
        }
      });
      console.log('SNMP data processed successfully');
      return processedResults;
    } catch (error) {
      console.error('Error reading SNMP data:', error);
      throw new Error('Error processing SNMP data');
    }
  });
exports.readSnmpScheduler = readSnmpScheduler;
