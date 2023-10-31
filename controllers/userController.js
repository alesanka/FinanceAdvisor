import { UserModel } from '../services/userModel.js';

import bcrypt from 'bcrypt';

const userModel = new UserModel();

class AuthenticationController {
  registerUser = async (req, res) => {
    try {
      const { username, password, email, phone_number, role, name, salary } =
        req.body;

      const existingUser = await userModel.findUserByUsername(username);
      if (existingUser) {
        return res.status(409).send(`User with this username already exists`);
      }

      if (password.length < 8) {
        return res.status(400).send({
          message: 'Password should be at least 8 characters long',
        });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).send({
          message: 'Invalid email format',
        });
      }

      const cleanedPhoneNumber = phone_number.replace(/\D/g, '');
      if (cleanedPhoneNumber.length !== 10) {
        return res.status(400).send({
          message: 'Phone number should contain exactly 10 digits',
        });
      }

      const validRoles = ['user', 'worker', 'admin'];
      if (!validRoles.includes(role)) {
        return res.status(400).send({
          message: 'Invalid role. Accepted values are: user, worker, admin',
        });
      }

      await userModel.registerUser(
        username,
        password,
        email,
        phone_number,
        role,
        name,
        salary
      );
      res.status(201).send('User was registered successfully');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error while registration');
    }
  };
  authenticateUser = async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const existingUser = await userModel.findUserByUsername(username);
      if (!existingUser) {
        return res.status(400).send('Username is incorrect');
      }
      const validPassword = await bcrypt.compare(
        password,
        existingUser.password
      );

      if (!validPassword) {
        return res.status(400).send('Password is incorrect');
      }
      next();
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error while log in');
    }
  };
}

class UserController {
  getAllUsers = async (req, res) => {
    try {
      const users = await userModel.getAllUsers();
      res.status(200).json(users);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error while geeting users');
    }
  };
}

export const authenticationController = new AuthenticationController();
export const userController = new UserController();
