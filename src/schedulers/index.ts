import { schedule } from 'node-cron';
const scheduleTasks = () => {
  // 示例任务：每天凌晨 1 点执行
  schedule('* * * * *', async () => {
    console.log('Running scheduled task: Fetch all users');
  });

  // 添加其他定时任务...
};

export default scheduleTasks;
