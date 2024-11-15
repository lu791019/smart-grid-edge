import PouchDBModel from '@/db/pouchdb/model/Model';
import { IDocument } from '@/db/pouchdb/model/Model';
import { SnmpConfig, SnmpRegister } from '@/interface/interface';
import { readSNMP } from '@/services/snmpServices';
import { writeDataToPouchDBService } from '@/services/pouchDBServices';
import { sendMessage } from '@/services/mqttServices';
import { string } from 'mathjs';

interface SnmpRawData {
  [key: string]: any;
}
const transformData = (data: SnmpRawData, config: SnmpConfig) => {
  return config.registers.map((register: SnmpRegister) => {
    const rawValue = data[register.name];
    const value = rawValue.toFixed(2);

    return {
      key: register.id,
      name: register.name,
      oid: register.oid,
      value: string(value), // 确保 value 是数字类型
      community: register.community,
      deviceConfigId: register.id,
      timestamp: new Date(),
      // 可选的其他字段
    };
  });
};

const readSnmpScheduler = async (key: string) => {
  // 從 PouchDBModel 讀取
  const pouchDBModel = PouchDBModel.getInstance();
  const externalData: IDocument[] = await pouchDBModel.readDocByObject({
    table: 'device_config',
    key: key,
  });

  const snmpConfigs = externalData.map((data): SnmpConfig => {
    return {
      key: data.key,
      host: data.host,
      from_id: data.from_id,
      from_name: data.from_name,
      frequency: data.frequency,
      method: 'snmp',
      registers: data.registers,
    };
  });

  await Promise.allSettled(
    snmpConfigs.map(async (config) => {
      try {
        // 去 SNMP 设备读取数据
        const rawData = await readSNMP(config);

        // 抓到的樹鋸整理一下
        const transformedData = transformData(rawData, config);

        // 包装数据
        const responseData = {
          name: 'snmp',
          from_id: config.from_id,
          from_name: config.from_name,
          frequency: config.frequency, // 包括 frequency 字段
          data: transformedData,
        };

        // 構建 MQTT 主題名稱
        const topic = `device/${config.from_id}/snmp/${config.frequency}`;

        // 发送消息到 MQTT
        await sendMessage(topic, JSON.stringify(responseData));

        // 寫入DB
        // await writeDataToPouchDBService(transformedData, 'device_data');

        // console.log(`SNMP Results for ${config.host}:`, responseData);
        return responseData;
      } catch (error) {
        // console.error(
        //   `Error processing data for device ${config.host}:`,
        //   error,
        // );
      }
    }),
  );
};

export { readSnmpScheduler };
