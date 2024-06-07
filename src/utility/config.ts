
import { ModbusConfig } from '@/interface/interface';
export interface Register {
  name: string;
  address: number;
  length: number;
  scale: number;
  function: string;
  unit: string;
}

export interface ModbusConfig {
  host: string;
  port: number;
  method: string;
  start: number;
  counts: number;
  registers: Register[];
}

const config: ModbusConfig = {
  host: '140.115.65.193',
  port: 502,
  method: 'modbus',
  start:1,
  counts:24,
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
      name: 'Main Grid Power(Low Word)',
      address: 3,
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
      address: 21,
      length: 1,
      scale: 0.01,
      function: 'read_holding_registers',
      unit: 'W',
    },
    {
      name: 'PV MPPT Power(Low Word)',
      address: 23,
      length: 2,
      scale: 0.1,
      function: 'read_holding_registers',
      unit: 'W',
    },
    // {
    //   name: 'mode_select',
    //   address: 700,
    //   length: 1,
    //   dataType: 'str',
    //   scale: 1,
    //   function: 'read_holding_registers',
    // },


  ],
};

export { config };
