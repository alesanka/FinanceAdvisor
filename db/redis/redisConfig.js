import redis from 'redis';

const db = redis.createClient(6379, 'localhost');

db.on('error', (err) => console.log('Redis Client Error', err));

await db.connect();

export default db;
