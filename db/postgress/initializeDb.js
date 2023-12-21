import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './dbPool.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const absolutePath = path.resolve(__dirname, 'dbPG.sql');

export const initializeDatabase = async () => {
  let connected = false;
  while (!connected) {
    try {
      await pool.connect();
      connected = true;
    } catch (err) {
      console.error(
        'Error in connection with PostgreSQL, new attempt after 5s:',
        err
      );

      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  try {
    fs.readFile(absolutePath, 'utf-8', (err, sqlQuery) => {
      if (err) throw err;
      pool.query(sqlQuery, (err, res) => {
        if (err) throw err;
        console.log('Script executed successfully');
      });
    });

    console.log('Db postgres was successfully initialized');
  } catch (err) {
    console.error('Error while initialization db postgres', err);
    throw err;
  }
};
