import { pool } from './dbConfig';
import bcrypt from 'bcrypt';

export class User {
  async registerUser(username, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const result = await pool.query(
        'INSERT INTO users (username, hashedPassword) VALUES ($1, $2) RETURNING id',
        [username, hashedPassword]
      );
      return result.rows[0].id;
    } catch (err) {
      throw new Error('Unable to create user');
    }
  }
  async getUserByUsername(username) {
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
}
