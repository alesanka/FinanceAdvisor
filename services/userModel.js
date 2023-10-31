import { pool } from '../db/dbPool.js';
import bcrypt from 'bcrypt';

const saltRounds = 10;

export class User {
  async registerUser(
    username,
    passwordRaw,
    email,
    phone_number,
    role,
    name,
    salary
  ) {
    const password = await bcrypt.hash(passwordRaw, saltRounds);

    try {
      const result = await pool.query(
        'INSERT INTO users (username, password, email, phone_number, role) VALUES ($1, $2, $3, $4, $5) RETURNING user_id',
        [username, password, email, phone_number, role]
      );
      let id = result.rows[0].user_id;
      if (role === 'client') {
        const resultClient = await pool.query(
          'INSERT INTO clients (user_id, name, salary) VALUES ($1, $2, $3) RETURNING client_id',
          [id, name, salary]
        );
        return resultClient.rows[0].client_id;
      }
      if (role === 'worker') {
        const resultWorker = await pool.query(
          'INSERT INTO workers (user_id, name) VALUES ($1, $2) RETURNING worker_id',
          [id, name]
        );
        return resultWorker.rows[0].worker_id;
      }
      if (role === 'admin') {
        const resultAdmin = await pool.query(
          'INSERT INTO admins (user_id, name) VALUES ($1, $2) RETURNING admin_id',
          [id, name]
        );
        return resultAdmin.rows[0].admin_id;
      }
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
