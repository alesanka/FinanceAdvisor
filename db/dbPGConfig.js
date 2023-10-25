import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const absolutePath = path.resolve(__dirname, 'dbSQL.sql');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'finansialSystemDB',
  user: 'postgres_user',
  password: 'UsegvJW/a7vWQG-',
});

pool.connect((error) => {
  if (error) {
    throw error;
  } else {
    console.log('database is connected successfully');
  }
});

fs.readFile(absolutePath, 'utf-8', (err, sqlQuery) => {
  if (err) throw err;

  pool.query(sqlQuery, (err) => {
    if (err) {
      throw err;
    } else {
      console.log('Sql query is executed');
    }
    // pool.end();
  });
});

export { pool };
