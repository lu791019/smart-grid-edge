'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const hono_1 = require('hono');
const readModbus_1 = __importDefault(require('../controllers/readModbus'));
const defaultRoute = new hono_1.Hono();
const apiRouter = new hono_1.Hono();
const defaultRouter = new hono_1.Hono();
apiRouter.get('/modbus', readModbus_1.default.get);
// apiRouter.get('/snmp', readSnmp.get);
// 组织根路由
defaultRoute.route('/api', apiRouter);
exports.default = defaultRoute;
