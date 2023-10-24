import { Pool } from 'pg';

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'finansialSystemDB',
  user: 'postgres',
  password: 'UsegvJW/a7vWQG-',
});

pool.connect((error) => {
  if (error) {
    throw error;
  } else {
    console.log('database is connected successfully');
  }
});

export { pool };
