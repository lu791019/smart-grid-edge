'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.createConfig = void 0;
const createConfig = (externalData) => {
  return {
    host: externalData.host,
    port: externalData.port,
    method: externalData.method,
    start: externalData.start,
    counts: externalData.counts,
    from_id: externalData.from_id,
    from_name: externalData.from_name,
    name: externalData.name,
    frequency: externalData.frequency || 10,
    registers: externalData.registers.map((reg) => ({
      name: reg.name,
      address: reg.address,
      length: reg.length,
      scale: reg.scale,
      function: reg.function,
      unit: reg.unit,
    })),
    table: externalData.table,
  };
};
exports.createConfig = createConfig;
// const config: ModbusConfig = {
//   host: '140.115.65.193',
//   port: 502,
//   method: 'modbus',
//   start: 1,
//   counts: 24,
//   from_id: 1,
//   from_name: '15_kw',
//   name: 'main', // 只能是 'main' | 'meter' | 'bettery'
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
// };
// export { config };
