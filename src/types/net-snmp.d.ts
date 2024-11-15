declare module 'net-snmp' {
  export interface Varbind {
    oid: string;
    type: number;
    value: any;
  }

  export function isVarbindError(varbind: Varbind): boolean;
  export function varbindError(varbind: Varbind): Error;

  export class Session {
    constructor(target: string, community: string, options?: any);
    get(
      oids: string[],
      callback: (error: Error, varbinds: Varbind[]) => void,
    ): void;
    close(): void;
  }

  export function createSession(
    target: string,
    community: string,
    options?: any,
  ): Session;
}
