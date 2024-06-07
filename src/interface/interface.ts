
export interface Register {
  name: string;
  address: number;
  length: number;
  scale: number;
  function: string;
  unit: string;
  remark?: string;
}

export interface ModbusConfig {
  host: string;
  port: number;
  method: string;
  start:number;
  counts:number;
  registers: Register[];
}


export interface OID {
  name: string;
  oid: string;
}

export interface SnmpConfig {
  host: string;
  community: string;
  oids: OID[];
}
