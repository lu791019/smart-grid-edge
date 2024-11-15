import PouchDBModel from '@/db/pouchdb/model/Model';
import { IDocument } from '@/db/pouchdb/model/Model';
import { APIBMSConfig, APIBMSRegister } from '@/interface/interface';

import { fetchToken, getToken, isTokenValid } from '@/100kw/auth';
import { sendMessage } from '@/services/mqttServices';
import { string } from 'mathjs';
import { Buffer } from 'buffer';

const readAPIBMSScheduler = async (key: string) => {
  // 從 PouchDBModel 讀取
  const pouchDBModel = PouchDBModel.getInstance();
  const externalData: IDocument[] = await pouchDBModel.readDocByObject({
    table: 'device_config',
    key: key,
  });

  const APIBMSConfigs = externalData.map((data): APIBMSConfig => {
    return {
      key: data.key,
      host: data.host,
      from_id: data.from_id,
      from_name: data.from_name,
      frequency: data.frequency,
      method: 'API_BMS',
      registers: data.registers,
    };
  });

  try {
    for (const config of APIBMSConfigs) {
      console.log('gogo API');
      if (!isTokenValid()) {
        await fetchToken();
      }

      const allTransformedData = await Promise.all(
        config.registers.map(async (register) => {
          if (
            register.option &&
            'body' in register.option &&
            register.option.body !== undefined
          ) {
            const response = await fetch(register.url, {
              method: register.community,
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
              },
              body: JSON.stringify(register.option!.body),
            });

            if (!response.ok) {
              throw new Error(`Error fetching data: ${response.statusText}`);
            }

            const data = await response.json();

            // 拿取資訊
            // @ts-ignore
            let value =
              // @ts-ignore
              getValueByPath(data, register.option!.value);

            if (register.name == 'SystemPower') {
              //    value 要進行sign Integer 轉換
              //    1. 進行 sign Integer 轉換
              const buf = Buffer.alloc(2); // 分配两个字节（16位）
              // 如果 value 是无符号整数，确保值在 0 到 65535 之间
              if (value >= 0 && value <= 65535) {
                // 将无符号整数写入 Buffer（Little-Endian 格式）
                // @ts-ignore
                buf.writeUInt16LE(value);
                // 按照有符号整数读取 Buffer 中的数据（Little-Endian 格式）
                value = buf.readInt16LE(0);
              } else {
                throw new Error(
                  'Value is out of range for a 16-bit unsigned integer',
                );
              }
            }

            // scale 轉換
            // @ts-ignore
            value = value * register!.scale;

            return {
              key: register.id,
              name: register.name,
              deviceConfigId: register.id,
              timestamp: new Date(),
              value: value,
              unit: register.unit,
            };
          }
        }),
      );

      // 封装数据
      const responseData = {
        method: config.method,
        from_id: config.from_id,
        from_name: config.from_name,
        frequency: config.frequency,
        data: allTransformedData,
      };

      // 构建 MQTT 主题名称
      const topic = `device/${config.from_id}/${config.method}/${config.frequency}`;

      // 发送消息到 MQTT
      sendMessage(topic, JSON.stringify(responseData));
    }
  } catch (e) {
    console.log(e);
  }
};

function getValueByPath(obj: any, path: string): any {
  if (typeof path !== 'string') {
    throw new TypeError(`Expected a string for path, but got ${typeof path}`);
  }

  if (typeof obj !== 'object' || obj === null) {
    return undefined; // 你也可以在此抛出一个错误
  }

  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

export { readAPIBMSScheduler };
