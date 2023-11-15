import {
  UserModel,
  passwordCheck,
  passwordHash,
  passwordValidation,
  emailCheck,
  phoneCheck,
} from '../userModel.js';

import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { UserDTO } from '../../dto/userDTO.js';

dotenv.config();
const SALTY = parseInt(process.env.SALT);

class UserReposMock {
  constructor() {
    this.users = [];
    this.clients = [];
  }

  async createUser(userDto, password) {
    const userId = this.users.length + 1;
    this.users.push({ ...userDto, password, user_id: userId });
    return userId;
  }

  async createClient(userId, salary, creditStory) {
    const clientId = this.clients.length + 1;
    this.clients.push({
      client_id: clientId,
      user_id: userId,
      salary,
      credit_story: creditStory,
    });
  }

  async findUserByUsername(username) {
    return this.users.find((user) => user.username === username);
  }

  async findUserById(userId) {
    return {
      user_id: 1,
      username: 'alex',
      first_name: 'alex',
      last_name: 'alex',
      email: 'email@lala.com',
      phone_number: '1234567890',
      role: 'client',
    };
  }

  async checkRoleByUserId(userId) {
    const user = this.users.find((user) => user.user_id === userId);
    return user ? user.role : null;
  }

  async getAllUsers() {
    return this.users;
  }

  async findClientByUserId(userId) {
    return this.clients.find((client) => client.user_id === userId);
  }

  async updateData(userId, data) {
    const userIndex = this.users.findIndex((user) => user.user_id === userId);
    if (userIndex !== -1) {
      this.users[userIndex] = { ...this.users[userIndex], ...data };
    }
  }

  async deleteUser(userId) {
    return false;
  }

  async filterByParameter(params) {
    let filteredUsers = [...this.users];
    if (params.role) {
      filteredUsers = filteredUsers.filter((user) => user.role === params.role);
    }
    if (params.salary) {
      filteredUsers = filteredUsers.filter((user) => {
        const client = this.clients.find(
          (client) => client.user_id === user.user_id
        );
        return client && client.salary >= params.salary;
      });
    }
    if (params.credit_story !== undefined) {
      filteredUsers = filteredUsers.filter((user) => {
        const client = this.clients.find(
          (client) => client.user_id === user.user_id
        );
        return client && client.credit_story === params.credit_story;
      });
    }
    return filteredUsers;
  }
  clear() {
    (this.clients = []), (this.users = []);
  }
}

const userReposMock = new UserReposMock();
const userModel = new UserModel(userReposMock);

describe('User model', () => {
  test('should check password length', () => {
    const passwordRight = 'jekkiChan19++';
    const passwordWrong = 'jekki';

    expect(passwordCheck(passwordRight)).toBeTruthy();
    expect(passwordCheck(passwordWrong)).not.toBeTruthy();

    expect(passwordCheck(passwordRight)).toStrictEqual(true);
    expect(passwordCheck(passwordWrong)).toStrictEqual(false);
  });

  test('should hash password', async () => {
    const passwordRaw = '123456789';
    const hashedPassword = await passwordHash(passwordRaw);
    expect(passwordHash(passwordRaw)).toBeTruthy();
    expect(hashedPassword).not.toBe(passwordRaw);
  });

  test('should return true for matching passwords', async () => {
    const plainPassword = 'TestPassword123';
    const hashedPassword = await bcrypt.hash(plainPassword, SALTY);

    const isValid = await passwordValidation(plainPassword, hashedPassword);
    expect(isValid).toBeTruthy();
  });

  test('should return true for valid email addresses', () => {
    expect(emailCheck('test@example.com')).toBeTruthy();
  });

  test('should return false for invalid email addresses', () => {
    expect(emailCheck('test@example')).toBeFalsy();
    expect(emailCheck('justastring')).toBeFalsy();
    expect(emailCheck('user@.com')).toBeFalsy();
  });

  test('should return true for valid phone numbers', () => {
    expect(phoneCheck('1234567890')).toBeTruthy();
  });

  test('should return false for invalid phone numbers', () => {
    expect(phoneCheck('12345')).toBeFalsy();
    expect(phoneCheck('12345678901')).toBeFalsy();
    expect(phoneCheck('abcdefghij')).toBeFalsy();
  });

  test('should register a new user', async () => {
    const username = 'testuser';
    const password = 'password123';
    const firstName = 'John';
    const lastName = 'Doe';
    const email = 'appp@mail.com';
    const phoneNumber = '1234567890';
    const role = 'admin';

    const dto = new UserDTO(
      null,
      username,
      firstName,
      lastName,
      email,
      phoneNumber,
      role
    );
    const userId = await userModel.registerUser(
      dto.username,
      password,
      dto.first_name,
      dto.last_name,
      dto.email,
      dto.phone_number,
      dto.role
    );

    expect(userId).toBeTruthy();
    const user = await userReposMock.findUserById(1);
    expect(user).toBeTruthy();
  });

  test('should get all users', async () => {
    const users = await userModel.getAllUsers();

    expect(users.length).toBe(1);
    expect(users).toEqual([
      {
        email: 'appp@mail.com',
        first_name: 'John',
        id_user: 1,
        last_name: 'Doe',
        phone_number: '1234567890',
        role: 'admin',
        username: 'testuser',
      },
    ]);
  });

  test('should get user by id', async () => {
    const user = await userModel.getUserById(1);

    expect(user).toBeTruthy();
  });

  test('should check user role by id', async () => {
    const role = 'admin';
    const userRole = await userModel.checkUserRoleById(1);

    expect(userRole).toBe(role);
  });

  test('should filter users by parameter', async () => {
    const filteredUsers1 = await userModel.filterByParameter({
      role: 'admin',
    });
    expect(filteredUsers1.length).toBe(1);
  });

  test('should update user data', async () => {
    const newData = {
      email: 'newemail@exam.com',
      phone_number: '9876543210',
    };

    await userModel.updateData(1, newData);

    const updatedUser = await userReposMock.findUserById(1);
    expect(updatedUser).toBeTruthy();
  });

  test('should delete user', async () => {
    expect(await userModel.deleteUser(1)).toBeFalsy();
  });
});

afterAll(() => {
  userReposMock.clear();
});
