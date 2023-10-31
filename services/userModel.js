import { pool } from '../db/dbPool.js';
import bcrypt from 'bcrypt';

const saltRounds = 10;

export class User {
  async registerUser(username, passwordRaw) {
    const password = await bcrypt.hash(passwordRaw, saltRounds);
    try {
      const result = await pool.query(
        'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING user_id',
        [username, password]
      );
      return result.rows[0].user_id;
    } catch (err) {
      console.error('Error during user creation:', err);
      throw new Error('Unable to create user');
    }
  }
  async findUserByUsername(username) {
    try {
      const result = await pool.query(
        'SELECT user_id, username, password FROM users WHERE username = $1;',
        [username]
      );
      if (result.rows.length > 0) {
        return result.rows[0];
      }
    } catch (err) {
      console.error('Error during user searching by username', err);
      throw new Error('Sorry, unable to get user');
    }
    return null;
  }
  async findUserById(id) {
    try {
      const result = await pool.query(
        'SELECT user_id, username, password FROM users WHERE user_id = $1;',
        [id]
      );
      if (result.rows.length > 0) {
        return result.rows[0];
      }
    } catch (err) {
      console.error('Error during user searching by id', err);
      throw new Error('Sorry, unable to get user');
    }
    return null;
  }
}
