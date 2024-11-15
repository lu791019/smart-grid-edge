'use strict';
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
const errorMessage = {
  A001: '無此帳號',
  A002: '無email,請聯繫管理員',
  A003: '帳號沒有驗證過',
  A004: '帳號過期',
  J001: 'token異常',
  P001: '密碼錯誤',
  T001: '無此token',
};
const getErrorMessage = (code) => {
  return errorMessage[code];
};
exports.default = {
  success: (ctx, json = null) =>
    __awaiter(void 0, void 0, void 0, function* () {
      return ctx.json({ data: json, code: '0000', message: 'sucess' });
    }),
  failed: (ctx, message = '') =>
    __awaiter(void 0, void 0, void 0, function* () {
      return ctx.json({ data: null, code: '9999', message: message });
    }),
  failedCode: (ctx, code = '') =>
    __awaiter(void 0, void 0, void 0, function* () {
      try {
        if (code) {
          return ctx.json({
            data: null,
            code: code,
            message: getErrorMessage(code),
          });
        } else {
          return ctx.json({ data: null, code: '9999', message: 'error' });
        }
      } catch (error) {
        return ctx.json({ data: null, code: '9999', message: 'error' });
      }
    }),
};
