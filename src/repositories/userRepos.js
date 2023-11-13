import { pool } from '../../db/postgress/dbPool.js';
import { UserDTO } from '../dto/userDTO.js';
import { ClientDTO } from '../dto/clientDTO.js';

export class UserRepos {
  constructor(connection) {
    this.connection = connection;
  }
  async createUser(userDto, password) {
    try {
      const result = await this.connection.query(
        'INSERT INTO users (username, password, first_name, last_name, email, phone_number, role) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING user_id',
        [
          userDto.username,
          password,
          userDto.first_name,
          userDto.last_name,
          userDto.email,
          userDto.phone_number,
          userDto.role,
        ]
      );

      return result.rows[0].user_id;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
  async createClient(clientDto) {
    try {
      const resultClient = await this.connection.query(
        'INSERT INTO clients (user_id, salary, credit_story) VALUES ($1, $2, $3) RETURNING client_id',
        [clientDto.user_id, clientDto.salary, clientDto.is_credit_story]
      );

      return resultClient.rows[0].client_id;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
  async findUserByUsername(username) {
    try {
      const result = await this.connection.query(
        'SELECT user_id, username, password FROM users WHERE username = $1;',
        [username]
      );
      if (result.rows.length > 0) {
        const user = result.rows[0];
        const userDTO = new UserDTO(
          user.user_id,
          user.username,
          user.first_name,
          user.last_name,
          user.email,
          user.phone_number,
          user.role
        );
        return userDTO;
      } else {
        return null;
      }
    } catch (err) {
      console.error(err);
      throw new Error(`${err}`);
    }
  }

  async findUserById(userId) {
    try {
      const result = await this.connection.query(
        'SELECT * FROM users WHERE user_id = $1;',
        [userId]
      );

      if (result.rows.length > 0) {
        const user = result.rows[0];
        const userDTO = new UserDTO(
          user.user_id,
          user.username,
          user.first_name,
          user.last_name,
          user.email,
          user.phone_number,
          user.role
        );
        return userDTO;
      } else {
        return null;
      }
    } catch (err) {
      throw new Error(`${err}}`);
    }
  }
  async getAllUsers() {
    try {
      const result = await this.connection.query('SELECT * FROM users');
      return result.rows.map(
        (row) =>
          new UserDTO(
            row.user_id,
            row.username,
            row.first_name,
            row.last_name,
            row.email,
            row.phone_number,
            row.role
          )
      );
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
  async findClientByUserId(userId) {
    try {
      const resultClient = await this.connection.query(
        `SELECT * FROM clients WHERE user_id = $1;`,
        [userId]
      );

      if (resultClient.rows.length > 0) {
        return new ClientDTO(
          row.client_id,
          row.user_id,
          row.salary,
          row.credit_story
        );
      } else {
        return null;
      }
    } catch (err) {
      throw new Error(`${err}`);
    }
  }

  async filterByParameter(params) {
    try {
      const values = [];
      const conditions = [];

      let baseQuery =
        'SELECT users.user_id, first_name, last_name, email, phone_number, role';

      let roleQuery = '';

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

      const result = await this.connection.query(baseQuery, values);
      return result.rows;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
  async updateData(userId, data) {
    try {
      console.log(data);
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
        await this.connection.query(userQuery, userValues);
      }
      if ('credit_story' in data || data.salary) {
        let query = 'UPDATE clients SET ';
        let values = [];

        if ('credit_story' in data) {
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

        await this.connection.query(query, values);
      }
      return;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
  async deleteUser(userId) {
    try {
      await this.connection.query('DELETE FROM users WHERE user_id = $1', [
        userId,
      ]);
      return;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
  async checkRoleByUserId(userId) {
    try {
      const result = await this.connection.query(
        `SELECT role FROM users WHERE user_id = $1;`,
        [userId]
      );
      if (result.rows.length > 0) {
        return result.rows[0].role;
      } else {
        return null;
      }
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
  async findClientById(clientId) {
    try {
      const result = await this.connection.query(
        'SELECT * FROM clients WHERE client_id = $1;',
        [clientId]
      );
      if (result.rows.length > 0) {
        return new ClientDTO(
          row.client_id,
          row.user_id,
          row.salary,
          row.credit_story
        );
      } else {
        return null;
      }
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
}

export const userRepos = new UserRepos(pool);
