import { Context } from 'hono';

const errorMessage = {
  A001: '無此帳號',
  A002: '無email,請聯繫管理員',
  A003: '帳號沒有驗證過',
  A004: '帳號過期',
  J001: 'token異常',
  P001: '密碼錯誤',
  T001: '無此token',
};

const getErrorMessage = (code: string) => {
  return errorMessage[code as keyof typeof errorMessage];
};

export default {
  success: async (ctx: Context, json: any = null) => {
    return ctx.json({ data: json, code: '0000', message: 'sucess' });
  },
  failed: async (ctx: Context, message: any = '') => {
    return ctx.json({ data: null, code: '9999', message: message });
  },
  failedCode: async (ctx: Context, code: string = '') => {
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
  },
};
