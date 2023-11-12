import redis from 'redis';
import * as dotenv from 'dotenv';

dotenv.config();

const db = redis.createClient({
  socket: {
    port: 6379,
    host: process.env.AUTHDB_HOST,
  },
});

db.on('error', (err) => console.log('Redis Client Error', err));

await db.connect();

export default db;
