import ModbusRTU from 'modbus-serial';

import type { ModbusConfig, ModbusRegister } from '@/interface/interface';
import logger from '@/utility/logger';

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

const readModbusRegisters = async (
  config: ModbusConfig,
  startAddress: number,
  numRegisters: number,
) => {
  const client = new ModbusRTU();

  await client.connectTCP(config.host, {
    port:
      (typeof config.port === 'string'
        ? parseInt(config.port, 10)
        : config.port) ?? 502,
  });

  try {
    if (config.registers?.length > 0) {
      const functionCode = functionCodeMap[config.registers?.[0]?.function];
      switch (functionCode) {
        case 3:
          const { data } = await client.readHoldingRegisters(
            startAddress,
            numRegisters,
          );
          return data;
        default:
          throw new Error(
            `Unsupported function: ${config.registers?.[0]?.function}`,
          );
      }
    } else {
      console.log('No registers defined');
      logger.error('No registers defined');
      return null;
    }
  } catch (err) {
    console.error('Error reading Modbus registers:', err);
    logger.error('Error reading Modbus registers:', err);
    throw err;
  } finally {
    client.close(() => {
      // console.log('Connection closed');
    });
  }
};

const writeModbusRegisters = async (
  config: ModbusConfig,
  startAddress: number,
  values: number[],
) => {
  // console.log('Connecting to Modbus device...');
  const client = new ModbusRTU();
  await client.connectTCP(config.host, {
    port:
      (typeof config.port === 'string'
        ? parseInt(config.port, 10)
        : config.port) ?? 502,
  });
  // console.log('Connected to Modbus device');

  try {
    if (config.registers?.length > 0) {
      const functionCode = functionCodeMap[config.registers?.[0].function];
      // console.log('Function code:', functionCode);
      switch (functionCode) {
        case 6: // Write Single Register
          await client.writeRegister(startAddress, values[0]);
          // console.log(`Wrote single register at address ${startAddress}`);
          break;
        case 16: // Write Multiple Registers
          await client.writeRegisters(startAddress, values);

          break;
        default:
          logger.error(
            `Unsupported write function: ${config.registers?.[0].function}`,
          );
          throw new Error(
            `Unsupported write function: ${config.registers?.[0].function}`,
          );
      }
      return true;
    } else {
      logger.error('No registers defined');
      // console.log('No registers defined');
      return false;
    }
  } catch (err) {
    logger.error('Error writing Modbus registers:', err);
    // console.error('Error writing Modbus registers:', err);
    throw err;
  } finally {
    client.close(() => {
      // console.log('Modbus connection closed');
    });
  }
};

//
const readOneModbusRegister = async (
  config: ModbusConfig,
  register: ModbusRegister,
) => {
  config.registers = [register];
  const data = await readModbusRegisters(
    config,
    register.address,
    register.length,
  );
  return data;
};

const writeOneModbusRegister = async (
  config: ModbusConfig,
  register: ModbusRegister,
) => {
  config.registers = [register];
  if (register.write_value !== null && register.write_value !== undefined) {
    const data = await writeModbusRegisters(config, register.address, [
      register.write_value,
    ]);
    return data;
  }
  return null;
};

export {
  readModbusRegisters,
  writeModbusRegisters,
  readOneModbusRegister,
  writeOneModbusRegister,
};
