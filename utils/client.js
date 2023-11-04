import db from './redisConfig.js';
import * as dotenv from 'dotenv';

dotenv.config();

await db.hSet('clients:client', {
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  grants: JSON.stringify(['password', 'refresh_token']),
});

export { db };
