import { config } from 'dotenv';
import e from 'express';
config({ path: '.env' });

const stratServer = (app = e()) => {
  const port = process.env.PORT ?? 3000;
  app.listen(port, () => {
    console.log(`Server is running on  http://localhost:${port}`);
  });
};

export { stratServer };
