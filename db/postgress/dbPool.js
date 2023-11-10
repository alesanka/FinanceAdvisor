import pg from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

console.log(
  process.env.POSTGRES_USER,
  process.env.DB_HOST,
  process.env.DB_DB,
  process.env.POSTGRES_PASSWORD,
  process.env.DB_PORT
);

const { Pool } = pg;

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.DB_PORT,
});

export { pool };
