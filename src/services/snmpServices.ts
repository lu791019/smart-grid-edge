import * as snmp from 'net-snmp';
import { SnmpConfig, SnmpRegister } from '@/interface/interface';

async function fetchOid(session: snmp.Session, snmpRegister: SnmpRegister) {
  const { oid, name, scale } = snmpRegister;

  return new Promise((resolve, reject) => {
    session.get([oid], (error, varbinds: snmp.Varbind[]) => {
      if (error) {
        reject(error);
      } else {
        const varbind = varbinds[0];
        if (snmp.isVarbindError(varbind)) {
          reject(snmp.varbindError(varbind));
        } else {
          if (scale !== null && scale !== undefined) {
            resolve({ [name]: varbind.value * scale }); // 进行scale转换
          } else {
            resolve({ [name]: varbind.value });
          }
        }
      }
    });
  });
}

async function readSNMP(config: SnmpConfig) {
  const completeResults: { [key: string]: any } = {};
  const sessions: { [community: string]: snmp.Session } = {};

  // 创建社区session
  for (const register of config.registers) {
    if (!sessions[register.community]) {
      sessions[register.community] = snmp.createSession(
        config.host,
        register.community,
      );
    }
  }

  // 遍历 registers 并获取数据
  for (const register of config.registers) {
    const session = sessions[register.community];

    try {
      const result = await fetchOid(session, register);
      Object.assign(completeResults, result);
    } catch (error) {
      console.error(`Error fetching OID ${register.oid}:`, error);
    }
  }

  // 关闭所有session
  for (const session of Object.values(sessions)) {
    session.close();
  }

  return completeResults;
}

export { readSNMP };
