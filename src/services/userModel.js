import { pool } from '../../db/postgress/dbPool.js';
import { UserDTO } from '../dto/userDTO.js';
import { ClientDTO } from '../dto/clientDTO.js';
import { userRepos } from '../repositories/userRepos.js';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import * as dotenv from 'dotenv';

dotenv.config();

const SALTY = parseInt(process.env.SALT);

class UserModel {
  async registerUser(
    username,
    passwordRaw,
    firstName,
    lastName,
    email,
    phoneNumber,
    role,
    salary,
    isCreditStory
  ) {
    const userDto = new UserDTO(
      null,
      username,
      firstName,
      lastName,
      email,
      phoneNumber,
      role
    );

    const passwordSchema = z.string().min(8);
    try {
      passwordSchema.parse(passwordRaw);
    } catch (e) {
      throw new Error('Password should contain 8 or more symbols.');
    }

    const password = await bcrypt.hash(passwordRaw, SALTY);
    const isUsernameTaken = await userRepos.findUserByUsername(
      userDto.username
    );
    if (isUsernameTaken) {
      throw new Error(`The username is already taken!`);
    }
    try {
      const userId = await userRepos.createUser(
        userDto.username,
        password,
        userDto.first_name,
        userDto.last_name,
        userDto.email,
        userDto.phone_number,
        userDto.role
      );

      if (userDto.role === 'client') {
        await userRepos.createClient(userId, salary, isCreditStory);
      }
      return userId;
    } catch (err) {
      throw new Error(`Unable to register new user: ${err}`);
    }
  }

  async loginUser(username, passwordRaw) {
    try {
      const passwordSchema = z.string().min(8);
      try {
        passwordSchema.parse(passwordRaw);
      } catch (e) {
        throw new Error('Password should contain 8 or more symbols.');
      }

      const user = await userRepos.findUserByUsername(username);

      if (!user) {
        throw new Error('Username is incorrect.');
      }

      const validPassword = await bcrypt.compare(passwordRaw, user.password);

      if (!validPassword) {
        throw new Error('Password is incorrect.');
      }

      const role = await userRepos.checkRoleByUserId(user.user_id);

      return role;
    } catch (err) {
      throw new Error(`Unable to login user: ${err}`);
    }
  }
  async getAllUsers() {
    try {
      const users = await userRepos.getAllUsers();

      const userDTOs = users.map((user) => {
        const dto = new UserDTO(
          user.user_id,
          user.username,
          user.first_name,
          user.last_name,
          user.email,
          user.phone_number,
          user.role
        );
        return {
          id_user: dto.id_user,
          first_name: dto.first_name,
          last_name: dto.last_name,
          role: dto.role,
        };
      });

      return userDTOs;
    } catch (err) {
      throw new Error(`Unable to get all users: ${err}`);
    }
  }
  async getUserById(userId) {
    try {
      const user = await userRepos.findUserById(userId);
      if (!user) {
        throw new Error('Invalid user id');
      }
      const userDTO = new UserDTO(
        user.user_id,
        user.username,
        user.first_name,
        user.last_name,
        user.email,
        user.phone_number,
        user.role
      );

      let result = {
        first_name: userDTO.first_name,
        last_name: userDTO.last_name,
        email: userDTO.email,
        phone_number: userDTO.phone_number,
        role: userDTO.role,
        client_info: 'User is not a client',
      };

      if (userDTO.role === 'client') {
        const client = await userRepos.findClientByUserId(userId);
        if (client) {
          const clientDTO = new ClientDTO(
            client.client_id,
            client.user_id,
            client.salary,
            client.credit_story
          );

          result.client_info = {
            salary: clientDTO.salary,
            credit_story: clientDTO.credit_story,
          };
        }
      }

      return result;
    } catch (err) {
      throw new Error(`Unable to get user by id: ${err}.`);
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
      if (!result.rows.length) {
        throw new Error('User not found.');
      }

      return result.rows[0].role;
    } catch (err) {
      console.error(`Unable to get role by user id: ${err}`);
      throw new Error(`Unable to get role by user id.`);
    }
  }
  async findClientById(clientId) {
    try {
      const result = await pool.query(
        'SELECT client_id FROM clients WHERE client_id = $1;',
        [clientId]
      );
      if (result.rows.length > 0) {
        return result.rows[0];
      }
    } catch (err) {
      console.error(`Unable to get client by id: ${err}`);
      throw new Error(`Unable to get client by id.`);
    }
    return null;
  }
}

export const userModel = new UserModel();
