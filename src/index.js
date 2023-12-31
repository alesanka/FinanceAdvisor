import express from 'express';
import bodyParser from 'body-parser';
import { initializeDatabase } from '../db/postgress/initializeDb.js';
import { initializeRedis } from '../db/redis/client.js';
import * as dotenv from 'dotenv';
import apiRoutes from './routers.js';

dotenv.config();

const PORT = process.env.APP_PORT;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/api/v1/', (req, res) => {
  res.send("“It's alive! It's alive!” - Frankenstein, 1931");
});

app.use('/api/v1', apiRoutes);

const start = async () => {
  try {
    await initializeDatabase();
    await initializeRedis();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Server startup error:', err);
    process.exit(1);
  }
};

start();

export { app };
