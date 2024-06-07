import { Context } from 'hono';
import { readModbusRegisters } from '@/services/modbusServices';
import { config, ModbusConfig, Register } from '@/utility/config';
import response from '@/utility/response';
import { sendMessage } from '@/services/mqttServices';

// 根據配置文件中的規則對數據進行轉換
const transformData = (data: number[], config: ModbusConfig) => {
  return config.registers.map((register: Register, index: number) => {
    const rawValue = data[index];
    const value = rawValue * register.scale;
    return {
      name: register.name,
      address: register.address,
      value,
      unit: register.unit,
    };
  });
};
// test
export default {
  get: async (ctx: Context) => {
    console.log('QQQ');
    try {
      const startAddress = config.start;
      const numRegisters = config.counts;

      // 讀取 modbus 設備
      const rawData = await readModbusRegisters(config, startAddress, numRegisters);

      // 根據 config 轉換數據
      const transformedData = transformData(rawData, config);

      sendMessage("test", JSON.stringify(transformedData));
      return response.sucess(ctx, transformedData);
    } catch (error) {
      console.log(error);
      console.log('QQ');
      return response.failed(ctx, 'Failed to read Modbus registers');
    }
  },
};
