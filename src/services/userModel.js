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
  async checkUserRoleById(userId) {
    try {
      const user = await userRepos.findUserById(userId);
      if (!user) {
        throw new Error('Invalid user id');
      }
      return await userRepos.checkRoleByUserId(userId);
    } catch (err) {
      throw new Error(`Unable to check user role by id: ${err}.`);
    }
  }
  async filterByParameter(params) {
    try {
      const users = await userRepos.filterByParameter(params);

      const combinedDTOs = users.map((user) => {
        const userDto = new UserDTO(
          user.user_id,
          user.username,
          user.first_name,
          user.last_name,
          user.email,
          user.phone_number,
          user.role
        );

        let clientDto;
        if (
          user.client_id &&
          (params.salary || params.credit_story || params.role === 'client')
        ) {
          clientDto = new ClientDTO(
            user.client_id,
            user.user_id,
            user.salary,
            user.credit_story
          );
        }
        return { ...userDto, client: clientDto };
      });

      return combinedDTOs;
    } catch (err) {
      throw new Error(`Unable to get users by parameters: ${err}.`);
    }
  }

  async updateData(userId, data) {
    try {
      const isUserExists = await userRepos.findUserById(userId);

      if (!isUserExists) {
        throw new Error(`No user found with userId ${userId}`);
      }

      if (data.email) {
        const emailSchema = z.string().email();
        try {
          emailSchema.parse(data.email);
        } catch (e) {
          throw new Error(`Invalid email format`);
        }
      }

      if (data.phone_number) {
        const phoneSchema = z.string().length(10);
        try {
          phoneSchema.parse(data.phone_number);
        } catch (e) {
          throw new Error('Phone number must contain 10 digits');
        }
      }
      await userRepos.updateData(userId, data);
      return;
    } catch (err) {
      throw new Error(`Unable to update data for userId ${userId}: ${err}.`);
    }
  }
  async deleteUser(userId) {
    try {
      const isUserExists = await userRepos.findUserById(userId);

      if (!isUserExists) {
        throw new Error(`No user found with userId ${userId}`);
      }
      await userRepos.deleteUser(userId);
      return;
    } catch (err) {
      throw new Error(`Unable to delete userId ${userId}: ${err}.`);
    }
  }
}

export const userModel = new UserModel();
