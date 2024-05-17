import scheduleTasks from '@/schedulers/index';

// 导入 app 实例
import app from './server';

// 启动定时任务
scheduleTasks();
