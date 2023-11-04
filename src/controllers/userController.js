import { userModel } from '../services/userModel.js';

class UserController {
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
          return res.status(400).send(`Missing required parameter: ${field}`);
        }
      }

      const id = await userModel.registerUser(
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
      res.status(201).send(`User was registered successfully. Id - ${id}`);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: 'Something went wrong during user registration',
        error: err.message,
      });
    }
  };

  getAllUsers = async (req, res) => {
    try {
      const users = await userModel.getAllUsers();

      res.status(200).json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: 'Something went wrong during getting all users.',
        error: err.message,
      });
    }
  };

  getUserById = async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await userModel.getUserById(userId);
      res.status(200).json(user);
    } catch (err) {
      console.error(err);
      res.status(404).json({
        message: `Something went wrong during getting user ${req.params.userId}.`,
        error: err.message,
      });
    }
  };
  filterByParameter = async (req, res) => {
    try {
      const params = req.query;
      const users = await userModel.filterByParameter(params);
      if (!users.length) {
        return res.status(404).send('No users found matching the criteria.');
      }
      res.status(200).json(users);
    } catch (err) {
      console.error(err);
      res.status(404).json({
        message: `Something went wrong during getting users by parameters.`,
        error: err.message,
      });
    }
  };

  updateData = async (req, res) => {
    const userId = req.params.userId;
    if (!req.body) {
      return res.status(400).send('No data provided in request body.');
    }
    try {
      await userModel.updateData(userId, req.body);
      res
        .status(200)
        .send(`User's data with id - ${userId} was updated successfully.`);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: `Something went wrong during updating user's data.`,
        error: err.message,
      });
    }
  };
  deleteUser = async (req, res) => {
    const userId = req.params.userId;

    try {
      await userModel.deleteUser(userId);
      res.status(204).end();
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: `Something went wrong while deleting user.`,
        error: err.message,
      });
    }
  };
}

export const userController = new UserController();
