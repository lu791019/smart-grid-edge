// import { serve } from '@hono/node-server';
// import app from '@/app';

// const port = 3000;
// console.log(`Server is running on port ${port}`);

// serve({
//   fetch: app.fetch,
//   port,
// });

import { serve } from '@hono/node-server';
import app from './server'; // 導入 app 實例

const port = 3000;
console.log(`Server is running on port ${port}`);
serve({ fetch: app.fetch, port });
