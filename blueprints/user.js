import { pool } from '../db/dbPGConfig.js';
import bcrypt from 'bcrypt';

export class User {
  async registerUser(username, passwordRaw) {
    const password = await bcrypt.hash(passwordRaw, 10);
    try {
      const result = await pool.query(
        'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id',
        [username, password]
      );
      return result.rows[0].id;
    } catch (err) {
      console.error('Error during user creation:', err);
      throw new Error('Unable to create user');
    }
  }
  async findUserByUsername(username) {
    try {
      const result = await pool.query(
        'SELECT user_id, username, hashedPassword FROM users WHERE username = $1;',
        [username]
      );
      if (result.rows.length > 0) {
        const { user_id, username, hashedPassword } = result.rows[0];

        return {
          user_id: user_id,
          username: username,
          password: hashedPassword,
        };
      }
    } catch (err) {
      throw new Error('Unable to get user');
    }
    return null;
  }
  async findUserById(user_id) {
    try {
      const result = await pool.query(
        'SELECT user_id, username, hashedPassword FROM users WHERE user_id = $1;',
        [user_id]
      );
      if (result.rows.length > 0) {
        const { user_id, username, hashedPassword } = result.rows[0];

        return {
          user_id: user_id,
          username: username,
          password: hashedPassword,
        };
      }
    } catch (err) {
      throw new Error('Unable to get user');
    }
    return null;
  }
}
