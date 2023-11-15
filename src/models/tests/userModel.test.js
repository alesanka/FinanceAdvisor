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
import { ClientDTO } from '../../dto/clientDTO.js';

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
    const username1 = 'testuser';
    const password1 = 'password123';
    const firstName1 = 'John';
    const lastName1 = 'Doe';
    const email1 = 'appp@mail.com';
    const phoneNumber1 = '1234567890';
    const role1 = 'admin';

    const username2 = 'testuser2';
    const password2 = 'password123';
    const firstName2 = 'Johnny';
    const lastName2 = 'Diego';
    const email2 = 'diego@mail.com';
    const phoneNumber2 = '1234567890';
    const role2 = 'client';
    const salary2 = 50000;
    const isCreditStory2 = false;

    const dto = new UserDTO(
      null,
      username1,
      firstName1,
      lastName1,
      email1,
      phoneNumber1,
      role1
    );
    const userId1 = await userModel.registerUser(
      dto.username,
      password1,
      dto.first_name,
      dto.last_name,
      dto.email,
      dto.phone_number,
      dto.role
    );

    const dtoClient = new ClientDTO(null, null, salary2, isCreditStory2);

    const userId2 = await userModel.registerUser(
      username2,
      password2,
      firstName2,
      lastName2,
      email2,
      phoneNumber2,
      role2,
      dtoClient.salary2,
      dtoClient.isCreditStory2
    );
    expect(userId1).toBeTruthy();
    expect(userId2).toBeTruthy();
    const user1 = await userReposMock.findUserById(1);
    const user2 = await userReposMock.findUserById(2);
    expect(user1).toBeTruthy();
    expect(user2).toBeTruthy();
  });

  test('should get all users', async () => {
    const users = await userModel.getAllUsers();

    expect(users.length).toBe(2);
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
      {
        email: 'diego@mail.com',
        first_name: 'Johnny',
        id_user: 2,
        last_name: 'Diego',
        phone_number: '1234567890',
        role: 'client',
        username: 'testuser2',
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
