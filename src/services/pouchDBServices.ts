// import { Config, ModbusConfig } from '@/interface/interface';
// import PouchDBModel from '@/db/pouchdb/model/Model';

// const writeDataToPouchDBService = async (datas: any[], table: string) => {
//   const pouchDBModel = PouchDBModel.getInstance();

//   const upsertData = async (data: any) => {
//     try {
//       const response = await pouchDBModel.upsertDoc(data.key, (doc:any) => {
//         return {
//           _id: data.key,
//           ...doc,
//           ...data,
//           table: table
//         };
//       });

//     } catch (err) {
//       console.error(`Failed to write/update document for `, err);
//     }
//   };

//   const promises = datas.map(upsertData);
//   await Promise.all(promises);
// };

// export { writeDataToPouchDBService };

import { Config, ModbusConfig } from '@/interface/interface';
import PouchDBModel from '@/db/pouchdb/model/Model';

const writeDataToPouchDBService = async (datas: any | any[], table: string) => {
  const pouchDBModel = PouchDBModel.getInstance();

  const upsertData = async (data: any) => {
    if (!data.key) {
      console.error('Data item is missing key:', data);
      return;
    }

    try {
      const response = await pouchDBModel.upsertDoc(data.key, (doc: any) => {
        return {
          _id: data.key,
          ...doc,
          ...data,
          table: table,
        };
      });
      // console.log(`Document upserted successfully: ${data.key}`);
    } catch (err) {
      console.error(`Failed to write/update document for ${data.key}:`, err);
    }
  };

  // 确保 datas 是一个数组
  const dataArray = Array.isArray(datas) ? datas : [datas];

  if (dataArray.length === 0) {
    console.warn('No data to write to PouchDB');
    return;
  }

  try {
    const promises = dataArray.map(upsertData);
    await Promise.all(promises);
    // console.log(`All data written to PouchDB table '${table}' successfully`);
  } catch (error) {
    console.error(`Error writing data to PouchDB table '${table}':`, error);
  }
};

export { writeDataToPouchDBService };
