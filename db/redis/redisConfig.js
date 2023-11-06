import redis from 'redis';

const db = redis.createClient({
  socket: {
    port: 6379,
    host: 'redis-stack',
  },
});

db.on('error', (err) => console.log('Redis Client Error', err));

await db.connect();

export default db;
