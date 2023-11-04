import { pool } from '../../db/postgress/dbPool.js';

class UserRepos {
  async createUser(
    username,
    password,
    firstName,
    lastName,
    email,
    phoneNumber,
    role
  ) {
    try {
      const result = await pool.query(
        'INSERT INTO users (username, password, first_name, last_name, email, phone_number, role) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING user_id',
        [username, password, firstName, lastName, email, phoneNumber, role]
      );

      return result.rows[0].user_id;
    } catch (err) {
      throw new Error(`Unable to register new user: ${err}`);
    }
  }
  async createClient(userId, salary, isCreditStory) {
    try {
      const resultClient = await pool.query(
        'INSERT INTO clients (user_id, salary, credit_story) VALUES ($1, $2, $3) RETURNING client_id',
        [userId, salary, isCreditStory]
      );

      return resultClient.rows[0].client_id;
    } catch (err) {
      throw new Error(`Unable to register new user: ${err}`);
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
      } else {
        return null;
      }
    } catch (err) {
      throw new Error(`Unable to get user by username: ${err}`);
    }
  }

  async findUserById(userId) {
    try {
      const result = await pool.query(
        'SELECT * FROM users WHERE user_id = $1;',
        [userId]
      );
      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        return null;
      }
    } catch (err) {
      throw new Error(`Unable to get user by id: ${err}`);
    }
  }
  async getAllUsers() {
    try {
      const result = await pool.query('SELECT * FROM users');
      return result.rows;
    } catch (err) {
      throw new Error(`Unable to get all users from db: ${err}.`);
    }
  }
  async getClientByUserId(userId) {
    try {
      const resultClient = await pool.query(
        `SELECT * FROM clients WHERE user_id = $1;`,
        [userId]
      );

      if (resultClient.rows.length > 0) {
        return resultClient.rows[0];
      } else {
        return null;
      }
    } catch (err) {
      throw new Error(`Unable to get user by id: ${err}`);
    }
  }

  async filterByParameter(params) {
    try {
      let baseQuery =
        'SELECT users.user_id, first_name, last_name, email, phone_number, role';
      let roleQuery = '';

      const values = [];
      const conditions = [];

      if (params.role === 'client') {
        roleQuery =
          ', salary, client_id, credit_story FROM users LEFT JOIN clients ON users.user_id = clients.user_id';
      } else {
        roleQuery = ' FROM users';
      }

      baseQuery += roleQuery;

      if (params.role) {
        conditions.push(`users.role = $${values.length + 1}`);
        values.push(params.role);
      }
      if (params.first_name) {
        conditions.push(`first_name ILIKE $${values.length + 1}`);
        values.push(`%${params.first_name}%`);
      }
      if (params.last_name) {
        conditions.push(`last_name ILIKE $${values.length + 1}`);
        values.push(`%${params.last_name}%`);
      }
      if (params.email) {
        conditions.push(`users.email = $${values.length + 1}`);
        values.push(params.email);
      }
      if (params.phone) {
        conditions.push(`users.phone_number = $${values.length + 1}`);
        values.push(params.phone);
      }
      if (params.salary) {
        conditions.push(`clients.salary = $${values.length + 1}`);
        values.push(params.salary);
      }
      if (params.credit_story) {
        conditions.push(`clients.credit_story = $${values.length + 1}`);
        values.push(params.credit_story);
      }

      if (conditions.length) {
        baseQuery += ' WHERE ' + conditions.join(' AND ');
      }

      if (params.sort) {
        baseQuery += ' ORDER BY clients.salary';
      }

      const result = await pool.query(baseQuery, values);
      return result.rows;
    } catch (err) {
      console.error(`Unable to get users by parameters: ${err}`);
      throw new Error(`Unable to get users by parameters.`);
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

      if (
        data.first_name ||
        data.last_name ||
        data.phone_number ||
        data.email
      ) {
        let userQuery = 'UPDATE users SET ';
        let userValues = [];

        if (data.first_name) {
          userQuery += `first_name = $${userValues.length + 1}, `;
          userValues.push(data.first_name);
        }

        if (data.last_name) {
          userQuery += `last_name = $${userValues.length + 1}, `;
          userValues.push(data.last_name);
        }

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
      if (data.credit_story || data.salary) {
        let query;
        let values;

        query = 'UPDATE clients SET ';
        values = [];

        if (data.credit_story) {
          query += `credit_story = $${values.length + 1}, `;
          values.push(data.credit_story);
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

        await pool.query(query, values);
      }
      return;
    } catch (err) {
      console.error(`Unable to update data for userId ${userId}: ${err}`);
      throw new Error(`Unable to update data for userId ${userId}.`);
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
      console.error(`Unable to delete userId ${userId}: ${err}`);
      throw new Error(`Unable to delete userId ${userId}.`);
    }
  }
  async checkRoleByUserId(userId) {
    try {
      const result = await pool.query(
        `SELECT role FROM users WHERE user_id = $1;`,
        [userId]
      );
      if (result.rows.length > 0) {
        return result.rows[0].role;
      } else {
        return null;
      }
    } catch (err) {
      throw new Error(`Unable to get role by user id: ${err}`);
    }
  }
  async findClientById(clientId) {
    try {
      const result = await pool.query(
        'SELECT * FROM clients WHERE client_id = $1;',
        [clientId]
      );
      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        return null;
      }
    } catch (err) {
      throw new Error(`Unable to get client by id: ${err}`);
    }
  }
}

export const userRepos = new UserRepos();
