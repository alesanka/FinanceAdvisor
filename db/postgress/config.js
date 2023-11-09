import dotenv from 'dotenv';

dotenv.config();

export const dbConfig = {
  user: 'user_user',
  host: 'postgres',
  database: 'finansialSystemDB',
  password: 'pgpwd4habr',
  port: 5432,
};
