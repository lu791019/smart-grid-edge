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
exports.initController = void 0;
const Model_1 = __importDefault(require('../db/pouchdb/model/Model'));
const snmpConfig_1 = require('../utility/snmpConfig');
const externalData = {
  host: '140.115.65.193',
  port: 502,
  method: 'modbus',
  start: 1,
  counts: 24,
  from_id: 1,
  from_name: '15_kw',
  name: 'main',
  frequency: 10,
  registers: [
    {
      name: 'RealPower_15K',
      address: 2181,
      length: 2,
      scale: 1,
      function: 'read_holding_registers',
      unit: 'W',
    },
    {
      name: 'BatterySOC_15K',
      address: 19,
      length: 2,
      scale: 0.1,
      function: 'read_holding_registers',
      unit: 'W',
    },
    {
      name: 'PVPower_15K',
      address: 9,
      length: 1,
      scale: 0.1,
      function: 'read_holding_registers',
      unit: 'W',
    },
    {
      name: 'MainPower_15K',
      address: 1,
      length: 2,
      scale: 0.1,
      function: 'read_holding_registers',
      unit: 'W',
    },
    {
      name: 'Main Grid Power(Low Word)',
      address: 3,
      length: 2,
      scale: 0.1,
      function: 'read_holding_registers',
      unit: 'W',
    },
    {
      name: 'Main Total Green Energy(Low Word)',
      address: 11,
      length: 2,
      scale: 0.001,
      function: 'read_holding_registers',
      unit: 'W',
    },
    {
      name: 'Main Carbon Redcing(Low Word)',
      address: 13,
      length: 2,
      scale: 0.001,
      function: 'read_holding_registers',
      unit: 'W',
    },
    {
      name: 'Main Wind MPPT Power(Low Word)',
      address: 15,
      length: 2,
      scale: 0.1,
      function: 'read_holding_registers',
      unit: 'W',
    },
    {
      name: 'Main Today Green Energy(Low Word)',
      address: 17,
      length: 2,
      scale: 0.001,
      function: 'read_holding_registers',
      unit: 'W',
    },
    {
      name: 'Ambient Temperature',
      address: 1000,
      length: 1,
      scale: 0.01,
      function: 'read_holding_registers',
      unit: 'W',
    },
    {
      name: 'PV MPPT Power(Low Word)',
      address: 1022,
      length: 2,
      scale: 0.1,
      function: 'read_holding_registers',
      unit: 'W',
    },
  ],
  table: 'device_config',
};
const newExternalData = [
  Object.assign(Object.assign({}, externalData), {
    host: '140.115.65.193',
    from_id: 1,
    from_name: '15kw_1',
  }),
  Object.assign(Object.assign({}, externalData), {
    host: '192.168.50.7',
    from_id: 2,
    from_name: '60kw_1',
  }),
  Object.assign(Object.assign({}, externalData), {
    host: '192.168.50.8',
    from_id: 3,
    from_name: '60kw_2',
  }),
  Object.assign(Object.assign({}, externalData), {
    host: '192.168.50.6',
    from_id: 4,
    from_name: '30kw_1',
  }),
];
// SNMP 配置
const snmpExternalData = snmpConfig_1.snmpConfigAll;
const writeModbusDataToPouchDB = (newExternalData) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const pouchDBModel = Model_1.default.getInstance();
    for (const data of newExternalData) {
      try {
        const docId = `modbus_${data.from_id}`;
        const doc = Object.assign(Object.assign({ _id: docId }, data), {
          type: 'modbus',
          table: 'device_config',
        });
        yield pouchDBModel.saveDoc(doc);
        console.log(
          `Modbus document for ${data.from_name} (ID: ${data.from_id}) written successfully`,
        );
      } catch (error) {
        if (error instanceof Error && error.name === 'conflict') {
          console.log(
            `Modbus document for ${data.from_name} (ID: ${data.from_id}) already exists, updating...`,
          );
          try {
            const existingDocs = yield pouchDBModel.readDocByTable(
              'device_config',
            );
            const existingDoc = existingDocs.find(
              (doc) => doc._id === `modbus_${data.from_id}`,
            );
            if (existingDoc) {
              const updatedDoc = Object.assign(
                Object.assign(Object.assign({}, existingDoc), data),
                { type: 'modbus' },
              );
              yield pouchDBModel.saveDoc(updatedDoc);
              console.log(
                `Modbus document for ${data.from_name} (ID: ${data.from_id}) updated successfully`,
              );
            }
          } catch (updateError) {
            console.error(
              `Failed to update Modbus document for ${data.from_name} (ID: ${data.from_id}):`,
              updateError,
            );
          }
        } else {
          console.error(
            `Failed to write Modbus document for ${data.from_name} (ID: ${data.from_id}):`,
            error,
          );
        }
      }
    }
  });
const writeSnmpDataToPouchDB = (snmpConfigs) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const pouchDBModel = Model_1.default.getInstance();
    for (const config of snmpConfigs) {
      const docId = `snmp_${config.from_id}`;
      try {
        const doc = Object.assign(Object.assign({ _id: docId }, config), {
          type: 'snmp',
          table: 'device_config',
        });
        yield pouchDBModel.saveDoc(doc);
        console.log(
          `SNMP document for ${config.from_name} (ID: ${config.from_id}) written successfully`,
        );
        const savedDoc = yield pouchDBModel.readDocById(docId); // 讀取剛寫入的文檔
        console.log(
          `Saved SNMP document: ${JSON.stringify(savedDoc, null, 2)}`,
        );
      } catch (error) {
        if (error instanceof Error && error.name === 'conflict') {
          console.log(
            `SNMP document for ${config.from_name} (ID: ${config.from_id}) already exists, updating...`,
          );
          try {
            const existingDocs = yield pouchDBModel.readDocByTable(
              'snmp_config',
            );
            const existingDoc = existingDocs.find((doc) => doc._id === docId);
            if (existingDoc) {
              const updatedDoc = Object.assign(
                Object.assign(Object.assign({}, existingDoc), config),
                { type: 'snmp' },
              );
              yield pouchDBModel.saveDoc(updatedDoc);
              console.log(
                `SNMP document for ${config.from_name} (ID: ${config.from_id}) updated successfully`,
              );
              const savedUpdatedDoc = yield pouchDBModel.readDocById(docId); // 讀取剛更新的文檔
              console.log(
                `Updated SNMP document: ${JSON.stringify(
                  savedUpdatedDoc,
                  null,
                  2,
                )}`,
              );
            }
          } catch (updateError) {
            console.error(
              `Failed to update SNMP document for ${config.from_name} (ID: ${config.from_id}):`,
              updateError,
            );
          }
        } else {
          console.error(
            `Failed to write SNMP document for ${config.from_name} (ID: ${config.from_id}):`,
            error,
          );
        }
      }
    }
  });
const initController = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      console.log('Starting initialization process...');
      yield writeModbusDataToPouchDB(newExternalData);
      // await writeSnmpDataToPouchDB(snmpExternalData);
      console.log('Initialization process completed successfully');
    } catch (error) {
      console.error('Error during initialization process:', error);
    }
  });
exports.initController = initController;
