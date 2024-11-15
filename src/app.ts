import { Hono } from 'hono';

import defaultRoute from '@/routes/route';

import initController from '@/controllers/initContoller';

const app = new Hono();

// 寫入基礎資訊 後續請改版 改成call api讀取 並啟動排成
initController();

// 使用路由
app.route('/', defaultRoute);

export default app;
