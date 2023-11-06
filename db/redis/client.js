import db from './redisConfig.js';
import * as dotenv from 'dotenv';

dotenv.config();

export async function initializeRedis() {
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const grants = JSON.stringify(['password', 'refresh_token']);

  if (!clientId || !clientSecret) {
    throw new Error('CLIENT_ID or CLIENT_SECRET are not defined in .env file');
  }

  try {
    const clientExists = await db.hExists('clients:client', 'clientId');

    if (!clientExists) {
      await db.hSet('clients:client', 'clientId', clientId);
      await db.hSet('clients:client', 'clientSecret', clientSecret);
      await db.hSet('clients:client', 'grants', grants);
      console.log('Client credentials have been set successfully.');
    }
  } catch (error) {
    console.error(
      'Error setting or retrieving client credentials in Redis:',
      error
    );
    throw error;
  }
}
