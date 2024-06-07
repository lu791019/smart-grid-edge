import { Context } from 'hono';
import { readSNMP } from '@/services/snmpServices';

import { snmpConfigPublic, snmpConfigPartpub } from '@/utility/snmpConfig';

import response from '@/utility/response';
export default {
    get: async (ctx: Context) => {
        try {
            console.log(snmpConfigPublic)
            const resultsPublic = await readSNMP(snmpConfigPublic);
            console.log('Public SNMP Results:', resultsPublic);
            //
            // const resultsPartpub = await readSNMP(snmpConfigPartpub);
            // console.log('Partpub SNMP Results:', resultsPartpub);
        } catch (error) {
            console.error('Error reading SNMP data:', error);
        }
    },
};
