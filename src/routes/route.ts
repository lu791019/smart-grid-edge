import { Hono } from 'hono';
import readModbus from '@/controllers/readModbus';

const defaultRoute = new Hono();

const apiRouter = new Hono();
const defaultRouter = new Hono();

apiRouter.get('/modbus', readModbus.get);
// apiRouter.get('/snmp', readSnmp.get);

// 组织根路由
defaultRoute.route('/api', apiRouter);

export default defaultRoute;
