import * as snmp from 'net-snmp';
import { SnmpConfig as Config } from '@/interface/interface';

async function readSNMP(config: Config) {
    const session = snmp.createSession(config.host, config.community);
    console.log(session)
    const results: { [key: string]: any } = {};

    for (const oidConfig of config.oids) {
        const { oid, name } = oidConfig;

        const promise = new Promise((resolve, reject) => {
            session.get([oid], (error: Error, varbinds: snmp.Varbind[]) => {
                if (error) {
                    reject(error);
                } else {
                    const varbind = varbinds[0];
                    if (snmp.isVarbindError(varbind)) {
                        reject(snmp.varbindError(varbind));
                    } else {
                        resolve(varbind.value);
                    }
                }
            });
        });

        try {
            const value = await promise;
            results[name] = value;
        } catch (error) {
            console.error(`Error fetching OID ${oid}:`, error);
        }
    }

    session.close();
    return results;
}

export { readSNMP };
