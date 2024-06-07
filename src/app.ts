import { Hono } from 'hono';
import scheduleTasks from '@/schedulers/index';
import defaultRoute from '@/routes/route';

const app = new Hono();

// 启动定时任务
scheduleTasks();

// 使用路由
app.route('/', defaultRoute);



export default app;
