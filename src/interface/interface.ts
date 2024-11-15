export interface APIBMSRegister {
  id: number;
  name: string;
  url: string;
  scale?: number | null; // 修改scale为可选并允许null
  community: string;
  unit?: string | null; // 修改unit为可选并允许null
  option: object;
}
// 定義Register接口
export interface ModbusRegister {
  id: number;
  name: string;
  address: number;
  length: number;
  scale?: number | null; // 修改scale为可选并允许null
  function: string;
  unit?: string | null; // 修改unit为可选并允许null
  write_value?: number | null; // 修改write_value为可选并允许null
}

export interface SnmpRegister {
  id: number;
  name: string;
  oid: string;
  scale?: number | null; // 修改scale为可选并允许null
  community: string;
  unit?: string | null; // 修改unit为可选并允许null
}

// 定義主配置接口（Modbus和SNMP的共同部分）
export interface BaseConfig {
  key: string;
  host: string;
  port?: string | number; // 修改port类型
  from_id: number;
  from_name: string;
  frequency: number;
}

// 定義Modbus配置接口
export interface ModbusConfig extends BaseConfig {
  method: 'modbus';
  registers: ModbusRegister[];
}

// 定義SNMP配置接口
export interface SnmpConfig extends BaseConfig {
  method: 'snmp';
  registers: SnmpRegister[];
}

export interface APIBMSConfig extends BaseConfig {
  method: 'API_BMS';
  registers: APIBMSRegister[];
}

// 定義總的配置接口
export type Config = ModbusConfig | SnmpConfig | APIBMSConfig;
