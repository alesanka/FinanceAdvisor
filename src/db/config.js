import dotenv from 'dotenv';

dotenv.config();

export const dbConfig = {
  host: 'localhost',
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};
