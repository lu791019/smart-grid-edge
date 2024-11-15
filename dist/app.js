'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const hono_1 = require('hono');
const index_1 = __importDefault(require('./schedulers/index'));
const route_1 = __importDefault(require('./routes/route'));
const initController_1 = require('./controllers/initController');
const app = new hono_1.Hono();
// 寫入基礎資訊 後續請改版 改成call api讀取
(0, initController_1.initController)();
// 启动定时任务
(0, index_1.default)();
// 使用路由
app.route('/', route_1.default);
exports.default = app;
