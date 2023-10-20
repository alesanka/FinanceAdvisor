import { pool } from './dbConfig';
import bcrypt from 'bcrypt';

export class User {
  async registerUser(login, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const result = await pool.query(
        'INSERT INTO users (login, hashedPassword) VALUES ($1, $2) RETURNING id',
        [login, hashedPassword]
      );
      return result.rows[0].id;
    } catch (err) {
      throw new Error('Unable to create user');
    }
  }
  async getUserByLogin(login) {
    try {
      const result = await pool.query(
        'SELECT user_id, login, hashedPassword FROM users WHERE login = $1;',
        [login]
      );
      if (result.rows.length > 0) {
        const { user_id, login, hashedPassword } = result.rows[0];

        return {
          user_id: user_id,
          login: login,
          password: hashedPassword,
        };
      }
    } catch (err) {
      throw new Error('Unable to get user');
    }
    return null;
  }
}
