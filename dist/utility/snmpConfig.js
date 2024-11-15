'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.snmpConfigAll = void 0;
const snmp_object = [
  {
    snmp_code: '1.3.36466.1.3.1.1.1.1.0',
    scale: 1,
    name: '系統_State',
    community: 'public',
  },
  {
    snmp_code: '1.3.36466.1.3.1.1.1.2.0',
    scale: 1,
    name: 'SystemFault',
    community: 'public',
  },
  {
    snmp_code: '1.3.36466.1.3.1.1.1.3.0',
    scale: 1,
    name: 'SystemWarning',
    community: 'public',
  },
  {
    snmp_code: '1.3.36466.1.3.1.1.1.4.0',
    scale: 1,
    name: 'DoorOpen',
    community: 'public',
  },
  {
    snmp_code: '1.3.36466.1.1.1.2.1.9.0',
    scale: 100,
    name: 'kWh',
    community: 'public',
  },
  {
    snmp_code: '1.3.36466.1.1.1.2.1.10.0',
    scale: 1,
    name: '系統_V',
    community: 'public',
  },
  {
    snmp_code: '1.3.36466.1.1.1.2.1.11.0',
    scale: 1,
    name: '系統_A',
    community: 'public',
  },
  {
    snmp_code: '1.3.36466.1.1.1.2.1.12.0',
    scale: 100,
    name: '系統_W',
    community: 'public',
  },
  {
    snmp_code: '1.3.36466.1.3.1.2.1.4.0',
    scale: 100,
    name: 'FuelLevel',
    community: 'public',
  },
  {
    snmp_code: '1.3.36466.1.1.1.2.1.8.0',
    scale: 100,
    name: '系統_RunTime',
    community: 'public',
  },
  {
    snmp_code: '1.3.36466.1.3.1.4.1.7.0',
    scale: 100,
    name: 'Filter Maint',
    community: 'public',
  },
  {
    snmp_code: '1.3.36466.1.3.1.1.2.3.0',
    scale: 1,
    name: 'stack1 Fault',
    community: 'partpub',
  },
  {
    snmp_code: '1.3.36466.1.3.1.1.2.4.0',
    scale: 1,
    name: 'stack2 Fault',
    community: 'partpub',
  },
];
const snmpConfig = {
  host: '140.115.65.193',
  registers: snmp_object.map((obj) => ({
    name: obj.name,
    oid: obj.snmp_code,
    scale: obj.scale,
    community: obj.community,
  })),
  from_id: 1,
  from_name: '15kW_SNMP',
  frequency: 60,
};
const snmpConfigAll = [
  snmpConfig,
  Object.assign(Object.assign({}, JSON.parse(JSON.stringify(snmpConfig))), {
    host: '192.168.50.66',
    from_id: 2,
    from_name: '30kW_SNMP',
  }),
];
exports.snmpConfigAll = snmpConfigAll;
