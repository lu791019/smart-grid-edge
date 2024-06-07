import {SnmpConfig as Config} from '@/interface/interface';

const oids_public = [
    '1.3.36466.1.3.1.1.1.1',
    '1.3.36466.1.3.1.1.1.4',
    '1.3.36466.1.3.1.1.1.2',
    '1.3.36466.1.3.1.1.1.3',
    '1.3.36466.1.1.1.2.1.10',
    '1.3.36466.1.1.1.2.1.11',
    '1.3.36466.1.1.1.2.1.12',
    '1.3.36466.1.1.1.2.1.9',
    '1.3.36466.1.3.1.2.1.4',
    '1.3.36466.1.1.1.2.1.8',
    '1.3.36466.1.3.1.4.1.7',
    '1.3.36466.1.3.1.5.1.4',
    '1.3.36466.1.3.1.5.1.5',
    '1.3.36466.1.3.1.5.1.6',
    '1.3.36466.1.3.1.5.1.7',
];

const oids_partpub = [
    '1.3.36466.1.3.1.1.2.3',
    '1.3.36466.1.3.1.1.2.4',
];

const snmpConfigPublic: Config = {
    host: '140.115.65.193',
    community: 'public',
    oids: oids_public.map((oid, index) => ({
        name: `OID_Public_${index + 1}`,
        oid,
    })),
};

const snmpConfigPartpub: Config = {
    host: '140.115.65.193',
    community: 'partpub',
    oids: oids_partpub.map((oid, index) => ({
        name: `OID_Partpub_${index + 1}`,
        oid,
    })),
};

export { snmpConfigPublic, snmpConfigPartpub };
