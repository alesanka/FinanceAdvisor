import pg from 'pg';
import { dbConfig } from './config.js';

const { Pool } = pg;

const pool = new Pool(dbConfig);

pool.on('error', (error) => {
  console.error('Unexpected error on idle client', error);
  process.exit(-1);
});

export { pool };
