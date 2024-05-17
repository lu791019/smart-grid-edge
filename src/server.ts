import { Hono } from 'hono';
import ModbusClient from 'modbus-serial';
import { create, all } from 'mathjs';

const math = create(all);

interface Register {
  name: string;
  address: number;
  length: number;
  dataType: string;
  scale: number;
  function: string;
}

interface Config {
  host: string;
  port: number;
  method: string;
  registers: Register[];
}

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

async function readModbusRegisters(config: Config) {
  const client = new ModbusClient();
  await client.connectTCP(config.host, { port: config.port });

  const results: { [key: string]: any } = {};

  for (const register of config.registers) {
    let data: any;
    const functionCode = functionCodeMap[register.function];

    switch (functionCode) {
      case 1:
        data = await client.readCoils(register.address, register.length);
        break;
      case 2:
        data = await client.readDiscreteInputs(
          register.address,
          register.length,
        );
        break;
      case 3:
        data = await client.readHoldingRegisters(
          register.address,
          register.length,
        );
        break;
      case 4:
        data = await client.readInputRegisters(
          register.address,
          register.length,
        );
        break;
      case 5:
        data = await client.writeCoil(register.address, register.length);
        break;
      case 6:
        data = await client.writeRegister(register.address, register.length);
        break;
      case 15:
        data = await client.writeCoils(register.address, register.length);
        break;
      case 16:
        data = await client.writeRegisters(register.address, register.length);
        break;
      default:
        throw new Error(`Unsupported function: ${register.function}`);
    }

    let value: any;
    switch (register.dataType) {
      case 'int16':
        value = math.matrix(data.data).toArray();
        break;
      case 'float16':
        value = math.matrix(data.data).toArray();
        break;
      default:
        throw new Error(`Unsupported data type: ${register.dataType}`);
    }

    value[0] = value[0] * register.scale;
    results[register.name] = value[0];
  }

  client.close();
  return results;
}

const config: Config = {
  // 填入host ip 和 port
  host: 'XXX.XXX.XXX.XXX',
  port: XX,
  method: 'modbus',
  registers: [
    {
      name: 'RealPower_15K',
      address: 2181,
      length: 1,
      dataType: 'int16',
      scale: 1,
      function: 'read_holding_registers',
    },
    {
      name: 'BatterySOC_15K',
      address: 19,
      length: 1,
      dataType: 'float16',
      scale: 0.1,
      function: 'read_input_registers',
    },
    {
      name: 'PVPower_15K',
      address: 9,
      length: 1,
      dataType: 'float16',
      scale: 0.1,
      function: 'read_holding_registers',
    },
  ],
};

const app = new Hono();

app.get('/modbus', async (c) => {
  try {
    const results = await readModbusRegisters(config);
    return c.json(results);
  } catch (error) {
    return c.text(error.message, 500);
  }
});

export default app;
