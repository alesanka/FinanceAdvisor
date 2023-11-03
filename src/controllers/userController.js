import { userModel } from '../services/userModel.js';

import bcrypt from 'bcrypt';

class AuthenticationController {
  registerUser = async (req, res) => {
    try {
      const {
        username,
        password,
        first_name,
        last_name,
        email,
        phone_number,
        role,
        salary,
        credit_story,
      } = req.body;

      const existingUser = await userModel.findUserByUsername(username);
      if (existingUser) {
        return res.status(409).send(`User with this username already exists`);
      }

      const requiredFields = [
        'username',
        'password',
        'email',
        'first_name',
        'last_name',
        'phone_number',
        'role',
      ];
      for (const field of requiredFields) {
        if (!req.body[field]) {
          return res.status(400).send(`Missing required field: ${field}`);
        }
      }

      if (role == 'client' && !req.body.salary) {
        return res
          .status(400)
          .send(`Missing required for client field "salary"`);
      }

      if (password.length < 8) {
        return res
          .status(400)
          .send('Password should be at least 8 characters long');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).send('Invalid email format');
      }

      const cleanedPhoneNumber = phone_number.replace(/\D/g, '');
      if (cleanedPhoneNumber.length !== 10) {
        return res
          .status(400)
          .send('Phone number should contain exactly 10 digits');
      }

      const validRoles = ['client', 'worker', 'admin'];
      if (!validRoles.includes(role)) {
        return res
          .status(400)
          .send('Invalid role. Accepted values are: client, worker, admin');
      }

      await userModel.registerUser(
        username,
        password,
        first_name,
        last_name,
        email,
        phone_number,
        role,
        salary,
        credit_story
      );
      res.status(201).send('User was registered successfully');
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };
  authenticateUser = async (req, res, next) => {
    try {
      const {
        grant_type,
        scope,
        client_id,
        client_secret,
        username,
        password,
      } = req.body;

      if (scope !== 'admin' && scope !== 'worker') {
        const requiredFields = [
          'grant_type',
          'scope',
          'client_id',
          'client_secret',
          'username',
          'password',
        ];

        for (const field of requiredFields) {
          if (!req.body[field]) {
            return res
              .status(400)
              .send(`Missing field: "${field}" in requst body`);
          }
        }

        if (grant_type !== 'password') {
          return res.status(400).send('Invalid value for grant_type');
        }
      }

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
      if (scope === 'admin' || scope === 'worker') {
        next();
      } else {
        return res.status(200).send('Client logged in successfully');
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };
}

class UserController {
  // to get all users in this method as well
  filterByParameter = async (req, res) => {
    try {
      if (Object.keys(req.query).length === 0) {
        const users = await userModel.getAllUsers();
        return res.status(200).json(users);
      }

      const params = req.query;

      const users = await userModel.filterByParameter(params);

      if (!users.length) {
        return res.status(404).send('No users found matching the criteria.');
      }

      res.status(200).json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };
  getUserById = async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await userModel.getUserById(userId);
      res.status(200).json(user);
    } catch (err) {
      console.error(err);
      res.status(404).json({ error: err.message });
    }
  };

  changeData = async (req, res) => {
    const userId = req.params.userId;
    if (!req.body) {
      return res.status(400).send('No data provided in request body.');
    }

    try {
      await userModel.changeData(userId, req.body);

      res
        .status(200)
        .send(`User's data with id - ${userId} was updated successfully.`);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };
  deleteUser = async (req, res) => {
    const userId = req.params.userId;

    try {
      await userModel.deleteUser(userId);
      res.status(204).end();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };
}

export const authenticationController = new AuthenticationController();
export const userController = new UserController();
