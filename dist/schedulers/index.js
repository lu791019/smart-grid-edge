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
const node_cron_1 = require('node-cron');
const readModbusScheduler_1 = __importDefault(
  require('../schedulers/readModbusScheduler'),
);
const scheduleTasks = () => {
  // 在这里添加 Modbus 调度任务
  (0, node_cron_1.schedule)('* * * * *', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      console.log('Running scheduled task: Read Modbus data');
      try {
        yield readModbusScheduler_1.default.get();
        console.log('Modbus data read successfully');
      } catch (error) {
        console.error('Error reading Modbus data:', error);
      }
    }),
  );
  // schedule('* * * * *', async () => {
  //   console.log('Running scheduled task: Read SNMP data');
  //   try {
  //     const results = await readSnmpScheduler();
  //     console.log('SNMP data read successfully:', results);
  //   } catch (error) {
  //     console.error('Error reading SNMP data:', error);
  //   }
  //   console.log('Scheduled task completed');
  // });
};
exports.default = scheduleTasks;
