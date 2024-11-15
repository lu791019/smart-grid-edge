'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.readSNMP = void 0;
const snmp = __importStar(require('net-snmp'));
function fetchOid(session, oidConfig) {
  return __awaiter(this, void 0, void 0, function* () {
    const { oid, name, scale } = oidConfig;
    return new Promise((resolve, reject) => {
      session.get([oid], (error, varbinds) => {
        if (error) {
          reject(error);
        } else {
          const varbind = varbinds[0];
          if (snmp.isVarbindError(varbind)) {
            reject(snmp.varbindError(varbind));
          } else {
            resolve({ [name]: varbind.value * scale }); // 进行scale转换
          }
        }
      });
    });
  });
}
function readSNMP(config) {
  return __awaiter(this, void 0, void 0, function* () {
    const completeResults = {};
    const sessions = {};
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
        const result = yield fetchOid(session, register);
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
  });
}
exports.readSNMP = readSNMP;
