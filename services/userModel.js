import { pool } from '../db/dbPool.js';
import bcrypt from 'bcrypt';

const saltRounds = 10;

export class UserModel {
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
  async getAllUsers() {
    try {
      const result = await pool.query(
        'SELECT user_id, email, phone_number, role FROM users'
      );
      return result.rows;
    } catch (err) {
      throw new Error(`Unable to get all users because error: ${err}`);
    }
  }
  async getUserById(userId) {
    try {
      const resultRole = await pool.query(
        'SELECT role FROM users WHERE user_id = $1;',
        [userId]
      );

      if (resultRole.rows.length === 0) {
        throw new Error('Invalid user id');
      }

      const role = resultRole.rows[0].role;

      const roleMapping = {
        client: {
          table: 'clients',
          fields: ['client_id', 'name', 'salary'],
        },
        worker: {
          table: 'workers',
          fields: ['worker_id', 'name'],
        },
        admin: {
          table: 'admins',
          fields: ['admin_id', 'name'],
        },
      };

      const roleInfo = roleMapping[role];
      const fieldsString = roleInfo.fields.join(', ');

      const resultRoleDetails = await pool.query(
        `SELECT ${fieldsString} FROM ${roleInfo.table} WHERE user_id = $1;`,
        [userId]
      );

      if (resultRoleDetails.rows.length === 0) {
        throw new Error(
          `${role.charAt(0).toUpperCase() + role.slice(1)} details not found`
        );
      }

      const userDetails = await pool.query(
        'SELECT email, phone_number FROM users WHERE user_id = $1;',
        [userId]
      );

      if (userDetails.rows.length === 0) {
        throw new Error('User details not found');
      }

      return {
        ...userDetails.rows[0],
        ...resultRoleDetails.rows[0],
        role,
      };
    } catch (err) {
      console.error('Error during user searching by id', err);
      throw new Error('Sorry, unable to get user');
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
  async findUserById(userId) {
    try {
      const result = await pool.query(
        'SELECT user_id, username, password FROM users WHERE user_id = $1;',
        [userId]
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
  async filterByParameter(params) {
    try {
      let baseQuery = 'SELECT users.user_id, email, phone_number, role, name';
      let roleQuery;
      const values = [];
      const conditions = [];

      switch (params.role) {
        case 'client':
          roleQuery =
            ', salary, client_id FROM users LEFT JOIN clients ON users.user_id = clients.user_id';
          break;
        case 'worker':
          roleQuery =
            ', worker_id FROM users LEFT JOIN workers ON users.user_id = workers.user_id';
          break;
        case 'admin':
          roleQuery =
            ', admin_id FROM users LEFT JOIN admins ON users.user_id = admins.user_id';
          break;
        default:
          roleQuery = '';
          break;
      }

      baseQuery += roleQuery;

      if (params.role) {
        conditions.push(`users.role = $${values.length + 1}`);
        values.push(params.role);
      }
      if (params.name) {
        conditions.push(`name ILIKE $${values.length + 1}`);
        values.push(`%${params.name}%`);
      }
      if (params.email) {
        conditions.push(`users.email = $${values.length + 1}`);
        values.push(params.email);
      }
      if (params.phone) {
        conditions.push(`users.phone_number = $${values.length + 1}`);
        values.push(params.phone);
      }
      if (params.salary && params.role === 'client') {
        conditions.push(`clients.salary = $${values.length + 1}`);
        values.push(params.salary);
      }

      if (conditions.length) {
        baseQuery += ' WHERE ' + conditions.join(' AND ');
      }

      if (params.sort) {
        if (params.sort === 'name') {
          baseQuery += ' ORDER BY name';
        } else if (params.sort === 'salary' && params.role === 'client') {
          baseQuery += ' ORDER BY clients.salary';
        }
      }

      const result = await pool.query(baseQuery, values);
      return result.rows;
    } catch (err) {
      console.error(`Unable to get users by parameters`, err);
      throw new Error(`Unable to get users by parameters`);
    }
  }
  async changeData(userId, data) {
    try {
      const userResult = await pool.query(
        'SELECT role FROM users WHERE user_id = $1',
        [userId]
      );

      if (userResult.rows.length === 0) {
        throw new Error(`No user found with userId ${userId}`);
      }

      if (data.phone_number || data.email) {
        let userQuery = 'UPDATE users SET ';
        let userValues = [];

        if (data.email) {
          userQuery += `email = $${userValues.length + 1}, `;
          userValues.push(data.email);
        }

        if (data.phone_number) {
          userQuery += `phone_number = $${userValues.length + 1}, `;
          userValues.push(data.phone_number);
        }

        userQuery = userQuery.trim().endsWith(',')
          ? (userQuery = userQuery.slice(0, -2))
          : userQuery;

        userQuery += ` WHERE user_id = $${userValues.length + 1}`;

        userValues.push(userId);
        await pool.query(userQuery, userValues);
      }
      if (data.name || data.salary) {
        const role = userResult.rows[0].role;
        let query;
        let values;

        switch (role) {
          case 'client':
            query = 'UPDATE clients SET ';
            values = [];

            if (data.name) {
              query += `name = $${values.length + 1}, `;
              values.push(data.name);
            }

            if (data.salary) {
              query += `salary = $${values.length + 1}, `;
              values.push(data.salary);
            }

            query = query.trim().endsWith(',')
              ? (query = query.slice(0, -2))
              : query;
            query += ` WHERE user_id = $${values.length + 1}`;
            values.push(userId);

            break;

          case 'worker':
            query = 'UPDATE workers SET ';
            values = [];
            if (data.salary) {
              throw new Error(
                `User with id ${userId} is a worker, no salary is required`
              );
            }
            query += `name = $${values.length + 1}`;
            values.push(data.name);

            query += ` WHERE user_id = $${values.length + 1}`;
            values.push(userId);

            break;

          case 'admin':
            query = `UPDATE admins SET `;
            values = [];
            if (data.salary) {
              throw new Error(
                `User with id ${userId} is an admin, no salary is required`
              );
            }

            query += `name = $${values.length + 1}`;
            values.push(data.name);

            query += ` WHERE user_id = $${values.length + 1}`;
            values.push(userId);

            break;

          default:
            throw new Error('Invalid role');
        }

        await pool.query(query, values);
      }
      return;
    } catch (err) {
      console.error(`Unable to update data for userId ${userId}`, err);
      throw new Error(`Unable to update data for userId ${userId}`);
    }
  }
  async deleteUser(userId) {
    try {
      const userResult = await pool.query(
        'SELECT role FROM users WHERE user_id = $1',
        [userId]
      );

      if (userResult.rows.length === 0) {
        throw new Error(`No user found with userId ${userId}`);
      }

      await pool.query('DELETE FROM users WHERE user_id = $1', [userId]);

      return;
    } catch (err) {
      console.error(`Unable to delete userId ${userId}`, err);
      throw new Error(`Unable to delete userId ${userId}`);
    }
  }
}
