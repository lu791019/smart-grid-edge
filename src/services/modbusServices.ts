import ModbusRTU from 'modbus-serial';
import { create, all } from 'mathjs';

import type { ModbusConfig, Register } from '@/interface/interface';

const functionCodeMap: { [key: string]: number } = {
  read_coils: 1,
  read_discrete_inputs: 2,
  read_holding_registers: 3,
  read_input_registers: 4,
  write_single_coil: 5,
  write_single_register: 6,
  write_multiple_coils: 15,
  write_multiple_registers: 16,
};
// const math = create(all);

// async function readModbusRegisters(config: ModbusConfig) {
//   const client = new ModbusRTU();
//   await client.connectTCP(config.host, { port: config.port });
//
//   const results: { [key: string]: any } = {};
//
//   for (const register of config.registers) {
//     let data: any;
//     const functionCode = functionCodeMap[register.function];
//
//     switch (functionCode) {
//       case 1:
//         data = await client.readCoils(register.address, register.length);
//         break;
//       case 2:
//         data = await client.readDiscreteInputs(
//           register.address,
//           register.length,
//         );
//         break;
//       case 3:
//         data = await client.readHoldingRegisters(
//           register.address,
//           register.length,
//         );
//         break;
//       case 4:
//         data = await client.readInputRegisters(
//           register.address,
//           register.length,
//         );
//         break;
//       // case 5:
//       //   data = await client.writeCoil(register.address, register.length);
//       //   break;
//       // case 6:
//       //   data = await client.writeRegister(register.address, register.length);
//       //   break;
//       // case 15:
//       //   data = await client.writeCoils(register.address, register.length);
//       //   break;
//       // case 16:
//       //   data = await client.writeRegisters(register.address, register.length);
//       //   break;
//       default:
//         throw new Error(`Unsupported function: ${register.function}`);
//     }
//     console.log(register.name)
//     console.log(data);
//     let value: any;
//
//     switch (register.length){
//       case 1:
//         value = data.data[0];
//         break;
//       case 2:
//         const buffer = Buffer.alloc(4);
//         buffer.writeUInt16LE(data.data[0], 0); // 低位在前
//         buffer.writeUInt16LE(data.data[1], 2); // 高位在後
//         value = buffer.readUInt32LE(0);
//         break;
//       default:
//         throw new Error(`Unsupported data type: ${register.name}`);
//     }
//
//
//     value = value * register.scale;
//     results[register.name] = value;
//   }
//
//   client.close(() => {
//     console.log('close');
//   });
//   return results;
// }

async function readModbusRegisters(config: ModbusConfig, startAddress: number, numRegisters: number) {
  const client = new ModbusRTU();

  await client.connectTCP(config.host, { port: config.port });

  try {
    const { data } = await client.readHoldingRegisters(startAddress, numRegisters);
    return data;
  } catch (err) {
    console.error('Error reading Modbus registers:', err);
    throw err;
  } finally {
    client.close(()=>{});
  }
}


export { readModbusRegisters };
