import { ModbusConfig, ModbusRegister } from '@/interface/interface';
import { Buffer } from 'buffer';
import { string } from 'mathjs';

// 讀取 modbus 設備 進行轉換
const transformData = (data: number[], registers: ModbusRegister[]) => {
  const firstAddress = registers[0].address;

  return registers.map((register: ModbusRegister) => {
    const index = register.address - firstAddress;
    let value: any;
    switch (register.length) {
      case 1:
        value = data[index];
        break;
      case 2:
        const buffer = Buffer.alloc(4);
        buffer.writeUInt16LE(data[index], 0); // 低位在前
        buffer.writeUInt16LE(data[index + 1], 2); // 高位在後
        if (register.name === 'SystemPower') {
          value = buffer.readInt32LE(0); // 使用 readInt32LE 來讀取帶符號的整數
        } else {
          value = buffer.readUInt32LE(0); // 使用 readUInt32LE 來讀取無符號的整數
        }
        break;
      default:
        throw new Error(`Unsupported data type: ${register.name}`);
    }

    if (typeof value === 'number' && register.scale) {
      value = (value * register.scale).toFixed(4);
    }

    return {
      key: register.id,
      name: register.name,
      address: register.address,
      value: string(value),
      unit: register.unit,
      deviceConfigId: register.id,
      timestamp: new Date(),
    };
  });
};

export { transformData };
