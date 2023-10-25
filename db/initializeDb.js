import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './dbPool.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const absolutePath = path.resolve(__dirname, 'dbSQL.sql');

export const initializeDatabase = () => {
  fs.readFile(absolutePath, 'utf-8', (err, sqlQuery) => {
    if (err) throw err;

    pool.query(sqlQuery, (err) => {
      if (err) {
        throw err;
      } else {
        console.log('SQL query executed successfully');
      }
    });
  });
};
