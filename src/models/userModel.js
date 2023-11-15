import { UserDTO } from '../dto/userDTO.js';
import { ClientDTO } from '../dto/clientDTO.js';
import { userRepos } from '../repositories/userRepos.js';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import * as dotenv from 'dotenv';
import { assertValueExists } from '../../utils/helper.js';

dotenv.config();
const SALTY = parseInt(process.env.SALT);

export const passwordCheck = (pswrd) => {
  const passwordSchema = z.string().min(8);
  try {
    passwordSchema.parse(pswrd);
    return true;
  } catch (e) {
    return false;
  }
};

export const passwordHash = async (pswrd) => {
  const password = await bcrypt.hash(pswrd, SALTY);
  return password;
};

export const passwordValidation = async (pswrd, reposPswrd) => {
  await bcrypt.compare(pswrd, reposPswrd);
  return true;
};

export const emailCheck = (email) => {
  const emailSchema = z.string().email();
  try {
    emailSchema.parse(email);
    return true;
  } catch (e) {
    return false;
  }
};

export const phoneCheck = (phone) => {
  const phoneSchema = z.string().length(10).regex(/^\d+$/);

  try {
    phoneSchema.parse(phone);
    return true;
  } catch (e) {
    return false;
  }
};

export class UserModel {
  constructor(userRepos) {
    this.userRepos = userRepos;
  }

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

    assertValueExists(
      passwordCheck(passwordRaw),
      'Password should contain 8 symbols at least'
    );
    const password = await passwordHash(passwordRaw);

    const isUsernameTaken = await this.userRepos.findUserByUsername(
      userDto.username
    );

    if (isUsernameTaken) {
      throw new Error(`The username is already taken!`);
    }
    try {
      const userId = await this.userRepos.createUser(userDto, password);

      if (userDto.role === 'client') {
        await this.userRepos.createClient(userId, salary, isCreditStory);
      }
      return userId;
    } catch (err) {
      throw new Error(`Unable to register new user: ${err}`);
    }
  }

  async loginUser(username, passwordRaw) {
    try {
      assertValueExists(
        passwordCheck(passwordRaw),
        'Password should contain 8 symbols at least'
      );

      const user = await this.userRepos.findUserByUsername(username);

      assertValueExists(user, 'Username is incorrect.');

      const validPassword = passwordValidation(passwordRaw, user.password);

      assertValueExists(validPassword, 'Password is incorrect.');

      const role = await this.userRepos.checkRoleByUserId(user.user_id);

      return role;
    } catch (err) {
      throw new Error(`Unable to login user: ${err}`);
    }
  }
  async getAllUsers() {
    try {
      const users = await this.userRepos.getAllUsers();

      const userDTOs = users.map((user) => {
        try {
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
            username: dto.username,
            first_name: dto.first_name,
            last_name: dto.last_name,
            email: dto.email,
            phone_number: dto.phone_number,
            role: dto.role,
          };
        } catch (error) {
          throw new Error(`Error creating UserDTO: ${error.message}`);
        }
      });

      return userDTOs;
    } catch (err) {
      throw new Error(`Unable to get all users: ${err}`);
    }
  }
  async getUserById(userId) {
    try {
      const user = await this.userRepos.findUserById(userId);

      assertValueExists(user, 'Invalid user id');

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
        const client = await this.userRepos.findClientByUserId(userId);
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
      const user = await this.userRepos.findUserById(userId);

      assertValueExists(user, 'Invalid user id');

      return await this.userRepos.checkRoleByUserId(userId);
    } catch (err) {
      throw new Error(`Unable to check user role by id: ${err}.`);
    }
  }
  async filterByParameter(params) {
    try {
      const users = await this.userRepos.filterByParameter(params);

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
      const user = await this.userRepos.findUserById(userId);

      assertValueExists(user, `No user found with userId ${userId}`);

      if (data.email) {
        assertValueExists(emailCheck(data.email), `Invalid email format`);
      }

      if (data.phone_number) {
        assertValueExists(
          phoneCheck(data.phone_number),
          'Phone number must contain 10 digits'
        );
      }

      await this.userRepos.updateData(userId, data);
      return;
    } catch (err) {
      throw new Error(`Unable to update data for userId ${userId}: ${err}.`);
    }
  }
  async deleteUser(userId) {
    try {
      const user = await this.userRepos.findUserById(userId);
      assertValueExists(user, `No user found with userId ${userId}`);

      await this.userRepos.deleteUser(userId);
      return;
    } catch (err) {
      throw new Error(`Unable to delete userId ${userId}: ${err}.`);
    }
  }
}

export const userModel = new UserModel(userRepos);
